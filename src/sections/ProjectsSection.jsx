import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import SectionWrapper from '../components/layout/SectionWrapper'
import SectionTitle from '../components/ui/SectionTitle'
import { fetchTrackerData, updateTrackerStatus } from '../services/projectStatusService'

const statusVisual = {
  not_started: {
    label: 'לא התחילו',
    chipSelectedBg: 'grey.500',
    buttonBg: 'rgba(148, 163, 184, 0.2)',
    buttonBorder: 'rgba(100, 116, 139, 0.45)',
    buttonColor: '#334155',
  },
  in_progress: {
    label: 'בתהליך',
    chipSelectedBg: 'warning.main',
    buttonBg: 'rgba(245, 158, 11, 0.2)',
    buttonBorder: 'rgba(217, 119, 6, 0.45)',
    buttonColor: '#78350f',
  },
  completed: {
    label: 'סיימו',
    chipSelectedBg: 'success.main',
    buttonBg: 'rgba(22, 163, 74, 0.2)',
    buttonBorder: 'rgba(21, 128, 61, 0.45)',
    buttonColor: '#14532d',
  },
}

const statusOrder = ['not_started', 'in_progress', 'completed']

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

function getSourceLabel(source) {
  if (source === 'google-sheets') {
    return 'מקור נתונים: גיליון אמת'
  }

  if (source === 'local-storage-fallback') {
    return 'מקור נתונים: גיבוי מקומי זמני'
  }

  return 'מקור נתונים: מקומי בלבד'
}

function getSourceColor(source) {
  return source === 'google-sheets' ? 'success' : 'default'
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
          setSyncInfo('המערכת מסונכרנת לגיליון')
        } else if (data.source === 'local-storage-fallback') {
          setSyncInfo('הגיליון לא זמין כרגע, עובדים על גיבוי מקומי זמני')
        } else {
          setSyncInfo('אין קישור לגיליון, עובדים מקומית בלבד')
        }
      } catch {
        setLoadError('לא הצלחנו לטעון נתוני מעקב כרגע')
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

  const statusSummary = useMemo(() => {
    const summary = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
    }

    trades.forEach((trade) => {
      const key = toRecordKey(selectedBuildingId, selectedApartmentId, trade.id)
      const statusId = recordsMap.get(key)?.status || 'not_started'
      summary[statusId] = (summary[statusId] || 0) + 1
    })

    return summary
  }, [recordsMap, selectedApartmentId, selectedBuildingId, trades])

  const handleBuildingSelect = (buildingId) => {
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
      setSyncInfo('העדכון נשמר בגיליון')
      setSource(result.source)
    } else if (result.source === 'local-storage-fallback') {
      setSyncInfo('העדכון נשמר בגיבוי מקומי עד שהחיבור לגיליון יחזור')
      setSource(result.source)
    } else {
      setSyncInfo('העדכון נשמר מקומית בלבד')
      setSource(result.source)
    }

    setSavingTradeId('')
  }

  return (
    <SectionWrapper id="projects">
      <SectionTitle
        eyebrow="Projects"
        title="מעקב עבודות לפי בניין ודירה"
        description="בחירה פשוטה בקופסאות צבעוניות. לוחצים על תחום ומעדכנים סטטוס במקום."
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

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {selectedBuilding?.name || 'בחר בניין'}
              {selectedApartmentId ? ` · ${selectedApartmentId}` : ''}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                label={getSourceLabel(source)}
                color={getSourceColor(source)}
                variant={source === 'google-sheets' ? 'filled' : 'outlined'}
              />
            </Stack>
          </Stack>

          {!loading && (!buildings.length || !trades.length) ? (
            <Alert severity="warning">
              לא נמצאו נתוני אמת בגיליון.
              נדרש לפחות בניין, דירה ותחום אחד עם סטטוס.
            </Alert>
          ) : null}

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
              בחירת בניין
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(3, minmax(0, 1fr))',
                  md: 'repeat(5, minmax(0, 1fr))',
                },
              }}
            >
              {buildings.map((building, index) => {
                const selected = selectedBuildingId === building.id

                return (
                  <Button
                    key={building.id}
                    onClick={() => handleBuildingSelect(building.id)}
                    variant={selected ? 'contained' : 'outlined'}
                    sx={{
                      py: 1.15,
                      borderRadius: 2,
                      borderColor: selected ? 'transparent' : 'rgba(31, 42, 55, 0.22)',
                      backgroundColor: selected
                        ? 'primary.main'
                        : `hsl(${(index * 29) % 360} 62% 96%)`,
                      color: selected ? 'white' : 'primary.dark',
                    }}
                  >
                    {building.name}
                  </Button>
                )
              })}
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
              בחירת דירה
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(5, minmax(0, 1fr))',
                },
              }}
            >
              {apartmentOptions.map((apartment) => {
                const selected = selectedApartmentId === apartment

                return (
                  <Button
                    key={apartment}
                    onClick={() => setSelectedApartmentId(apartment)}
                    variant={selected ? 'contained' : 'outlined'}
                    color={selected ? 'secondary' : 'inherit'}
                    sx={{ py: 1.1, borderRadius: 2 }}
                  >
                    {apartment}
                  </Button>
                )
              })}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: {
                xs: 'repeat(1, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {statusOrder.map((statusId) => (
              <Paper
                key={statusId}
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  borderColor: statusVisual[statusId].buttonBorder,
                  backgroundColor: statusVisual[statusId].buttonBg,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 700, color: statusVisual[statusId].buttonColor }}>
                    {statusVisual[statusId].label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {statusSummary[statusId] || 0}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Box>

          {loading ? (
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 3 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">טוען נתוני מעקב</Typography>
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: {
                  xs: 'repeat(1, minmax(0, 1fr))',
                  md: 'repeat(2, minmax(0, 1fr))',
                },
              }}
            >
              {trades.map((trade) => {
                const record = recordsMap.get(
                  toRecordKey(selectedBuildingId, selectedApartmentId, trade.id),
                )
                const statusId = record?.status || 'not_started'

                return (
                  <Paper
                    key={trade.id}
                    variant="outlined"
                    sx={{ p: 1.5, borderRadius: 2.5, borderColor: 'rgba(31, 42, 55, 0.2)' }}
                  >
                    <Stack spacing={1.2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {trade.label}
                        </Typography>

                        <Chip
                          size="small"
                          label={statusById[statusId] || statusVisual.not_started.label}
                          variant="filled"
                          sx={{
                            backgroundColor:
                              statusVisual[statusId]?.chipSelectedBg ||
                              statusVisual.not_started.chipSelectedBg,
                            color: '#ffffff',
                            fontWeight: 700,
                            border: 'none',
                          }}
                        />
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        {`עודכן לאחרונה: ${formatDateTime(record?.updatedAt)}`}
                      </Typography>

                      <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                        {statuses.map((status) => {
                          const selected = statusId === status.id

                          return (
                            <Button
                              key={status.id}
                              size="small"
                              variant={selected ? 'contained' : 'outlined'}
                              onClick={() => handleStatusChange(trade.id, status.id)}
                              disabled={savingTradeId === trade.id}
                              sx={{
                                borderRadius: 999,
                                minWidth: 90,
                                borderColor: statusVisual[status.id]?.buttonBorder,
                                color: selected
                                  ? 'white'
                                  : statusVisual[status.id]?.buttonColor || 'text.primary',
                                backgroundColor: selected
                                  ? status.id === 'completed'
                                    ? 'success.main'
                                    : status.id === 'in_progress'
                                      ? 'warning.main'
                                      : 'grey.500'
                                  : statusVisual[status.id]?.buttonBg || 'transparent',
                              }}
                            >
                              {status.label}
                            </Button>
                          )
                        })}

                        {savingTradeId === trade.id ? <CircularProgress size={14} sx={{ mt: 0.8 }} /> : null}
                      </Stack>
                    </Stack>
                  </Paper>
                )
              })}
            </Box>
          )}
        </Stack>
      </Paper>
    </SectionWrapper>
  )
}

export default ProjectsSection
