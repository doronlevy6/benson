const SHEET_NAME = 'Tracker'
const HEADERS = ['buildingId', 'apartmentId', 'tradeId', 'status', 'updatedAt']
const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_HERE'

function doPost(e) {
  const sheet = getOrCreateSheet_()
  const payload = JSON.parse(e.postData.contents || '{}')
  const action = (payload.action || '').toString()

  if (action === 'list') {
    return jsonResponse_({ records: readRecords_(sheet) })
  }

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

function readRecords_(sheet) {
  const values = sheet.getDataRange().getValues()

  if (values.length <= 1) {
    return []
  }

  return values.slice(1).map((row) => ({
    buildingId: row[0],
    apartmentId: row[1],
    tradeId: row[2],
    status: row[3],
    updatedAt: row[4],
  }))
}

function getOrCreateSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PASTE_SPREADSHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID before deployment.')
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
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
