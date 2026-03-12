export const statusOptions = [
  { id: 'not_started', label: 'לא התחילו' },
  { id: 'in_progress', label: 'בתהליך' },
  { id: 'completed', label: 'סיימו' },
]

export const tradeOptions = [
  { id: 'electrical', label: 'חשמל' },
  { id: 'plumbing', label: 'אינסטלציה' },
  { id: 'plaster', label: 'טייח' },
  { id: 'rebar', label: 'ברזל' },
  { id: 'painting', label: 'צבע' },
  { id: 'aluminum', label: 'אלומיניום' },
  { id: 'flooring', label: 'ריצוף' },
  { id: 'drywall', label: 'גבס' },
  { id: 'waterproofing', label: 'איטום' },
  { id: 'carpentry', label: 'נגרות' },
]

const apartmentTemplate = ['A1', 'A2', 'A3', 'A4', 'A5']

export const buildingOptions = Array.from({ length: 5 }, (_, index) => {
  const buildingNumber = String(index + 1).padStart(2, '0')

  return {
    id: `building-${buildingNumber}`,
    name: `בניין ${buildingNumber}`,
    apartments: apartmentTemplate,
  }
})

const statusPattern = ['not_started', 'in_progress', 'completed']

function getSeedStatus(buildingIndex, apartmentIndex, tradeIndex) {
  const statusIndex = (buildingIndex * 3 + apartmentIndex * 2 + tradeIndex) % statusPattern.length
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
          updatedAt: toUpdatedAt((buildingIndex + apartmentIndex + tradeIndex) % 7),
        })
      })
    })
  })

  return rows
}

export const seedRecords = createSeedRecords()

export const demoMatrixSize = {
  buildings: buildingOptions.length,
  apartmentsPerBuilding: apartmentTemplate.length,
  trades: tradeOptions.length,
  records: seedRecords.length,
}
