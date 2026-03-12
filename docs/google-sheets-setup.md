# Google Sheets Setup (Projects Tracker)

The `Projects` tab can read/write statuses to a Google Sheet through a Google Apps Script web app.

## 1. Create a new Google Sheet

1. Create a spreadsheet and name it **Benson**.
2. Copy the spreadsheet ID from the URL `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`.
3. Open `Extensions -> Apps Script`.
4. Replace the script with the code from `docs/google-sheets-apps-script.gs`.
5. In the script, set `SPREADSHEET_ID` to your real sheet ID.

## 2. Deploy Apps Script as Web App

1. Click `Deploy -> New deployment`.
2. Type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone` (or `Anyone with link`).
5. Deploy and copy the `Web app URL`.

## 3. Connect React app

Create `.env.local` in the project root:

```bash
VITE_SHEETS_API_URL="https://script.google.com/macros/s/XXXX/exec"
```

Then restart dev server:

```bash
npm run dev
```

## 4. Data contract

The endpoint uses POST JSON actions:

- `{ "action": "list" }` -> returns `{ "records": [...] }`
- `{ "action": "upsert", ...record }` -> returns `{ "ok": true }`

Each row in sheet `Tracker`:

- `buildingId`
- `apartmentId`
- `tradeId`
- `status` (`not_started` | `in_progress` | `completed`)
- `updatedAt` (ISO string)

## 5. No endpoint configured

If `VITE_SHEETS_API_URL` is missing, the UI works in local demo mode using `localStorage`.
