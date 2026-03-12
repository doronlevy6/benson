export const statusOptions = [
  { id: 'not_started', label: 'לא התחילו' },
  { id: 'in_progress', label: 'בתהליך' },
  { id: 'completed', label: 'סיימו' },
]

export const tradeOptions = [
  { id: 'plaster', label: 'טייח' },
  { id: 'rebar', label: 'ברזל' },
  { id: 'plumbing', label: 'אינסטלציה' },
  { id: 'electrical', label: 'חשמל' },
  { id: 'painting', label: 'צבע' },
  { id: 'aluminum', label: 'אלומיניום' },
]

export const buildingOptions = [
  {
    id: 'benson-heights-a',
    name: 'Benson Heights A',
    apartments: ['A101', 'A102', 'A103', 'A104', 'A105'],
  },
  {
    id: 'benson-heights-b',
    name: 'Benson Heights B',
    apartments: ['B101', 'B102', 'B103', 'B104', 'B105'],
  },
  {
    id: 'oak-tower',
    name: 'Oak Tower',
    apartments: ['201', '202', '203', '204'],
  },
]

const statusPattern = ['not_started', 'in_progress', 'completed']

function getSeedStatus(buildingIndex, apartmentIndex, tradeIndex) {
  const statusIndex = (buildingIndex + apartmentIndex + tradeIndex) % statusPattern.length
  return statusPattern[statusIndex]
}

function toUpdatedAt(daysAgo) {
  const timestamp = Date.now() - daysAgo * 24 * 60 * 60 * 1000
  return new Date(timestamp).toISOString()
}

export function createSeedRecords() {
  const rows = []

  buildingOptions.forEach((building, buildingIndex) => {
    building.apartments.forEach((apartmentId, apartmentIndex) => {
      tradeOptions.forEach((trade, tradeIndex) => {
        rows.push({
          buildingId: building.id,
          apartmentId,
          tradeId: trade.id,
          status: getSeedStatus(buildingIndex, apartmentIndex, tradeIndex),
          updatedAt: toUpdatedAt((buildingIndex + apartmentIndex + tradeIndex) % 5),
        })
      })
    })
  })

  return rows
}

export const seedRecords = createSeedRecords()
