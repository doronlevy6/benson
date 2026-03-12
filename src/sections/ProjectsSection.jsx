import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import SectionTitle from '../components/ui/SectionTitle'
import { fetchTrackerData, updateTrackerStatus } from '../services/projectStatusService'

const statusChipColor = {
  not_started: 'default',
  in_progress: 'warning',
  completed: 'success',
}

function toRecordKey(buildingId, apartmentId, tradeId) {
  return `${buildingId}::${apartmentId}::${tradeId}`
}

function formatDateTime(isoString) {
  if (!isoString) {
    return '-'
  }

  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ProjectsSection() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [syncInfo, setSyncInfo] = useState('')
  const [source, setSource] = useState('')
  const [buildings, setBuildings] = useState([])
  const [trades, setTrades] = useState([])
  const [statuses, setStatuses] = useState([])
  const [records, setRecords] = useState([])
  const [selectedBuildingId, setSelectedBuildingId] = useState('')
  const [selectedApartmentId, setSelectedApartmentId] = useState('')
  const [savingTradeId, setSavingTradeId] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setLoadError('')

      try {
        const data = await fetchTrackerData()
        setBuildings(data.buildings)
        setTrades(data.trades)
        setStatuses(data.statuses)
        setRecords(data.records)
        setSource(data.source)

        const firstBuilding = data.buildings[0]
        const firstApartment = firstBuilding?.apartments?.[0] || ''

        setSelectedBuildingId(firstBuilding?.id || '')
        setSelectedApartmentId(firstApartment)

        if (data.source === 'google-sheets') {
          setSyncInfo('הנתונים נטענו מ-Google Sheets')
        } else if (data.source === 'local-storage-fallback') {
          setSyncInfo('הטעינה נעשתה מלוקאלי (Google לא זמין כרגע)')
        } else {
          setSyncInfo('מצב דמו מקומי פעיל (localStorage)')
        }
      } catch {
        setLoadError('לא הצלחנו לטעון נתוני פרויקטים כרגע.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId),
    [buildings, selectedBuildingId],
  )

  const apartmentOptions = useMemo(
    () => selectedBuilding?.apartments || [],
    [selectedBuilding],
  )

  useEffect(() => {
    if (!apartmentOptions.length) {
      setSelectedApartmentId('')
      return
    }

    if (!apartmentOptions.includes(selectedApartmentId)) {
      setSelectedApartmentId(apartmentOptions[0])
    }
  }, [apartmentOptions, selectedApartmentId])

  const recordsMap = useMemo(() => {
    const map = new Map()
    records.forEach((record) => {
      map.set(toRecordKey(record.buildingId, record.apartmentId, record.tradeId), record)
    })
    return map
  }, [records])

  const statusById = useMemo(
    () => Object.fromEntries(statuses.map((status) => [status.id, status.label])),
    [statuses],
  )

  const handleBuildingChange = (event) => {
    const buildingId = event.target.value
    const building = buildings.find((item) => item.id === buildingId)
    setSelectedBuildingId(buildingId)
    setSelectedApartmentId(building?.apartments?.[0] || '')
  }

  const handleStatusChange = async (tradeId, nextStatus) => {
    if (!selectedBuildingId || !selectedApartmentId) {
      return
    }

    setSavingTradeId(tradeId)
    setLoadError('')

    const nextRecord = {
      buildingId: selectedBuildingId,
      apartmentId: selectedApartmentId,
      tradeId,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    }

    setRecords((previous) => {
      const next = previous.filter(
        (record) =>
          !(
            record.buildingId === selectedBuildingId &&
            record.apartmentId === selectedApartmentId &&
            record.tradeId === tradeId
          ),
      )

      return [...next, nextRecord]
    })

    const result = await updateTrackerStatus(nextRecord)

    if (result.synced) {
      setSyncInfo('העדכון נשמר ב-Google Sheets')
      setSource(result.source)
    } else if (result.source === 'local-storage-fallback') {
      setSyncInfo('Google לא זמין, נשמר לוקאלית זמנית')
      setSource(result.source)
    } else {
      setSyncInfo('העדכון נשמר לוקאלית (מצב דמו)')
      setSource(result.source)
    }

    setSavingTradeId('')
  }

  return (
    <SectionWrapper id="projects">
      <SectionTitle
        eyebrow="Projects"
        title="מערכת מעקב סטטוס לדירות"
        description="מנהל עבודה בוחר בניין ודירה, מעדכן סטטוס לפי תחום, והנתונים נשמרים ל-Google Sheets או ללוקאלי כדמו."
      />

      {loadError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {syncInfo ? (
        <Alert severity="info" sx={{ mb: 2.5 }}>
          {syncInfo}
        </Alert>
      ) : null}

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ mb: 2 }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel id="building-label">בניין</InputLabel>
            <Select
              labelId="building-label"
              label="בניין"
              value={selectedBuildingId}
              onChange={handleBuildingChange}
            >
              {buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="apartment-label">דירה</InputLabel>
            <Select
              labelId="apartment-label"
              label="דירה"
              value={selectedApartmentId}
              onChange={(event) => setSelectedApartmentId(event.target.value)}
            >
              {apartmentOptions.map((apartment) => (
                <MenuItem key={apartment} value={apartment}>
                  {apartment}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Chip
            label={
              source === 'google-sheets'
                ? 'Data Source: Google Sheets'
                : source === 'local-storage-fallback'
                  ? 'Data Source: Local Fallback'
                  : 'Data Source: Local Demo'
            }
            color={source === 'google-sheets' ? 'success' : 'default'}
            variant={source === 'google-sheets' ? 'filled' : 'outlined'}
            sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
          />
        </Stack>

        {loading ? (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 3 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">טוען נתוני מעקב...</Typography>
          </Stack>
        ) : (
          <TableContainer sx={{ border: '1px solid rgba(31, 42, 55, 0.12)', borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>תחום</TableCell>
                  <TableCell>סטטוס נוכחי</TableCell>
                  <TableCell>עדכון סטטוס</TableCell>
                  <TableCell>עודכן לאחרונה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => {
                  const record = recordsMap.get(
                    toRecordKey(selectedBuildingId, selectedApartmentId, trade.id),
                  )
                  const statusId = record?.status || 'not_started'

                  return (
                    <TableRow key={trade.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trade.label}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={statusById[statusId] || 'לא התחילו'}
                          color={statusChipColor[statusId] || 'default'}
                          variant={statusId === 'not_started' ? 'outlined' : 'filled'}
                        />
                      </TableCell>

                      <TableCell>
                        <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                          <Select
                            value={statusId}
                            onChange={(event) => handleStatusChange(trade.id, event.target.value)}
                            disabled={savingTradeId === trade.id}
                          >
                            {statuses.map((status) => (
                              <MenuItem key={status.id} value={status.id}>
                                {status.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {savingTradeId === trade.id ? <CircularProgress size={14} /> : null}
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(record?.updatedAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </SectionWrapper>
  )
}

export default ProjectsSection
