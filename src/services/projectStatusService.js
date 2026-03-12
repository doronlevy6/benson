import {
  buildingOptions,
  seedRecords,
  statusOptions,
  tradeOptions,
} from '../data/projectTrackerData'

const STORAGE_KEY = 'benson-project-tracker-v1'
const SHEETS_ENDPOINT = import.meta.env.VITE_SHEETS_API_URL?.trim() || ''
const validStatuses = new Set(statusOptions.map((status) => status.id))

function toRecordKey({ buildingId, apartmentId, tradeId }) {
  return `${buildingId}::${apartmentId}::${tradeId}`
}

function sanitizeRecords(records) {
  if (!Array.isArray(records)) {
    return []
  }

  return records
    .map((record) => ({
      buildingId: record.buildingId,
      apartmentId: record.apartmentId,
      tradeId: record.tradeId,
      status: validStatuses.has(record.status) ? record.status : 'not_started',
      updatedAt: record.updatedAt || new Date().toISOString(),
    }))
    .filter((record) => record.buildingId && record.apartmentId && record.tradeId)
}

function readLocalRecords() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRecords))
      return seedRecords
    }

    const parsed = JSON.parse(raw)
    return sanitizeRecords(parsed)
  } catch {
    return seedRecords
  }
}

function writeLocalRecords(records) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function mergeWithSeed(records) {
  const recordMap = new Map(seedRecords.map((record) => [toRecordKey(record), record]))

  records.forEach((record) => {
    recordMap.set(toRecordKey(record), record)
  })

  return Array.from(recordMap.values())
}

function normalizePayload(payload) {
  const normalized = {
    buildingId: payload.buildingId,
    apartmentId: payload.apartmentId,
    tradeId: payload.tradeId,
    status: validStatuses.has(payload.status) ? payload.status : 'not_started',
    updatedAt: new Date().toISOString(),
  }

  return normalized
}

function readApiResponse(data) {
  const records = sanitizeRecords(data?.records)
  return mergeWithSeed(records)
}

async function fetchFromSheets() {
  const response = await fetch(`${SHEETS_ENDPOINT}?action=list`)

  if (!response.ok) {
    throw new Error('Failed to read from Google Sheets endpoint.')
  }

  const data = await response.json()
  return readApiResponse(data)
}

async function upsertToSheets(record) {
  const response = await fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'upsert', ...record }),
  })

  if (!response.ok) {
    throw new Error('Failed to write to Google Sheets endpoint.')
  }
}

export async function fetchTrackerData() {
  const localRecords = mergeWithSeed(readLocalRecords())

  if (!SHEETS_ENDPOINT) {
    return {
      records: localRecords,
      source: 'local-storage',
      buildings: buildingOptions,
      trades: tradeOptions,
      statuses: statusOptions,
    }
  }

  try {
    const records = await fetchFromSheets()
    writeLocalRecords(records)

    return {
      records,
      source: 'google-sheets',
      buildings: buildingOptions,
      trades: tradeOptions,
      statuses: statusOptions,
    }
  } catch {
    return {
      records: localRecords,
      source: 'local-storage-fallback',
      buildings: buildingOptions,
      trades: tradeOptions,
      statuses: statusOptions,
    }
  }
}

export async function updateTrackerStatus(payload) {
  const nextRecord = normalizePayload(payload)
  const currentRecords = readLocalRecords()
  const recordKey = toRecordKey(nextRecord)

  const nextRecords = mergeWithSeed([
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
