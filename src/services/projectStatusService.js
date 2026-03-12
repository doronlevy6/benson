import { statusAliases, statusIdToLabel, statusOptions } from '../data/projectTrackerData'

const STORAGE_KEY = 'benson-project-tracker-v4'
const SHEETS_ENDPOINT = import.meta.env.VITE_SHEETS_API_URL?.trim() || ''
const validStatuses = new Set(statusOptions.map((status) => status.id))

function normalizeStatus(rawStatus) {
  if (rawStatus === undefined || rawStatus === null) {
    return 'not_started'
  }

  const value = String(rawStatus).trim()
  if (!value) {
    return 'not_started'
  }

  if (validStatuses.has(value)) {
    return value
  }

  const normalized = value.replace(/\s+/g, '_')
  if (statusAliases[normalized]) {
    return statusAliases[normalized]
  }

  return 'not_started'
}

function toRecordKey({ buildingId, apartmentId, tradeId }) {
  return `${buildingId}::${apartmentId}::${tradeId}`
}

function sanitizeRecords(records) {
  if (!Array.isArray(records)) {
    return []
  }

  return records
    .map((record) => {
      const buildingId = String(record?.buildingId ?? '').trim()
      const apartmentId = String(record?.apartmentId ?? '').trim()
      const tradeId = String(record?.tradeId ?? '').trim()

      return {
        buildingId,
        apartmentId,
        tradeId,
        status: normalizeStatus(record?.status),
        updatedAt: record?.updatedAt || new Date().toISOString(),
      }
    })
    .filter((record) => record.buildingId && record.apartmentId && record.tradeId)
}

function readLocalRecords() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    return sanitizeRecords(JSON.parse(raw))
  } catch {
    return []
  }
}

function writeLocalRecords(records) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function normalizePayload(payload) {
  return {
    buildingId: String(payload?.buildingId ?? '').trim(),
    apartmentId: String(payload?.apartmentId ?? '').trim(),
    tradeId: String(payload?.tradeId ?? '').trim(),
    status: normalizeStatus(payload?.status),
    updatedAt: new Date().toISOString(),
  }
}

function sortHebrew(items) {
  return [...items].sort((a, b) => a.localeCompare(b, 'he'))
}

function deriveDimensions(records) {
  const buildingMap = new Map()
  const tradeSet = new Set()

  records.forEach((record) => {
    if (!buildingMap.has(record.buildingId)) {
      buildingMap.set(record.buildingId, new Set())
    }

    buildingMap.get(record.buildingId).add(record.apartmentId)
    tradeSet.add(record.tradeId)
  })

  const buildings = sortHebrew(Array.from(buildingMap.keys())).map((buildingId) => ({
    id: buildingId,
    name: buildingId,
    apartments: sortHebrew(Array.from(buildingMap.get(buildingId))),
  }))

  const trades = sortHebrew(Array.from(tradeSet)).map((tradeId) => ({
    id: tradeId,
    label: tradeId,
  }))

  return { buildings, trades }
}

function readApiResponse(data) {
  if (!data || !Array.isArray(data.records)) {
    throw new Error('Google Sheets response does not include records array.')
  }

  return sanitizeRecords(data.records)
}

async function fetchFromSheets() {
  const response = await fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'list' }),
  })

  if (!response.ok) {
    throw new Error('Failed to read from Google Sheets endpoint.')
  }

  let data = null

  try {
    data = await response.json()
  } catch {
    throw new Error('Invalid JSON response from Google Sheets endpoint.')
  }

  return readApiResponse(data)
}

async function upsertToSheets(record) {
  const sheetPayload = {
    action: 'upsert',
    buildingId: record.buildingId,
    apartmentId: record.apartmentId,
    tradeId: record.tradeId,
    status: statusIdToLabel[record.status] || record.status,
    updatedAt: record.updatedAt,
  }

  const response = await fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sheetPayload),
  })

  if (!response.ok) {
    throw new Error('Failed to write to Google Sheets endpoint.')
  }

  try {
    const data = await response.json()
    if (data && Object.prototype.hasOwnProperty.call(data, 'ok') && data.ok !== true) {
      throw new Error('Google Sheets endpoint returned ok=false.')
    }
  } catch {
    // Some Apps Script deployments return non-JSON; HTTP 200 is still treated as success.
  }
}

function buildDataShape(records, source) {
  const { buildings, trades } = deriveDimensions(records)
  return {
    records,
    source,
    buildings,
    trades,
    statuses: statusOptions,
  }
}

export async function fetchTrackerData() {
  const localRecords = readLocalRecords()

  if (!SHEETS_ENDPOINT) {
    return buildDataShape(localRecords, 'local-storage')
  }

  try {
    const records = await fetchFromSheets()
    writeLocalRecords(records)
    return buildDataShape(records, 'google-sheets')
  } catch {
    return buildDataShape(localRecords, 'local-storage-fallback')
  }
}

export async function updateTrackerStatus(payload) {
  const nextRecord = normalizePayload(payload)
  const currentRecords = readLocalRecords()
  const recordKey = toRecordKey(nextRecord)

  const nextRecords = sanitizeRecords([
    ...currentRecords.filter((record) => toRecordKey(record) !== recordKey),
    nextRecord,
  ])

  writeLocalRecords(nextRecords)

  if (!SHEETS_ENDPOINT) {
    return { synced: false, source: 'local-storage' }
  }

  try {
    await upsertToSheets(nextRecord)
    return { synced: true, source: 'google-sheets' }
  } catch {
    return { synced: false, source: 'local-storage-fallback' }
  }
}
