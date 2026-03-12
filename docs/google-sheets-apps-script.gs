const SHEET_NAME = 'Tracker'
const HEADERS = ['buildingId', 'apartmentId', 'tradeId', 'status', 'updatedAt']

function doGet() {
  const sheet = getOrCreateSheet_()
  const values = sheet.getDataRange().getValues()

  if (values.length <= 1) {
    return jsonResponse_({ records: [] })
  }

  const records = values.slice(1).map((row) => ({
    buildingId: row[0],
    apartmentId: row[1],
    tradeId: row[2],
    status: row[3],
    updatedAt: row[4],
  }))

  return jsonResponse_({ records })
}

function doPost(e) {
  const sheet = getOrCreateSheet_()
  const payload = JSON.parse(e.postData.contents || '{}')

  const rowKey = `${payload.buildingId}::${payload.apartmentId}::${payload.tradeId}`
  const values = sheet.getDataRange().getValues()

  let targetRow = -1

  for (let i = 1; i < values.length; i += 1) {
    const key = `${values[i][0]}::${values[i][1]}::${values[i][2]}`
    if (key === rowKey) {
      targetRow = i + 1
      break
    }
  }

  const rowData = [
    payload.buildingId || '',
    payload.apartmentId || '',
    payload.tradeId || '',
    payload.status || 'not_started',
    payload.updatedAt || new Date().toISOString(),
  ]

  if (targetRow === -1) {
    sheet.appendRow(rowData)
  } else {
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData])
  }

  return jsonResponse_({ ok: true })
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
  }

  return sheet
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
