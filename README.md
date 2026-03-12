# Benson Website

React + Vite + MUI website for **Benson Construction**, prepared for deployment on GitHub Pages:

`https://doronlevy6.github.io/benson/`

## Tech Stack

- React (Vite)
- MUI (`@mui/material`)
- GitHub Actions + `gh-pages`

## Current Features

- Single-page website with section tabs.
- `Projects` tab includes a **construction status tracker**:
  - Select building
  - Select apartment
  - Update trade status per apartment (`not_started`, `in_progress`, `completed`)
- Data source modes:
  - `localStorage` demo mode (default)
  - Google Sheets mode via Apps Script endpoint (`VITE_SHEETS_API_URL`)

## Project Notes

- Vite base path is configured as `'/benson/'` in `vite.config.js`.
- This avoids route issues on GitHub Pages because the app is section-based (no router yet).
- Layout is mobile-first and responsive.

## Run Locally

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
VITE_SHEETS_API_URL="https://script.google.com/macros/s/XXXX/exec"
```

If env var is missing, app runs in local demo mode.

## Build

```bash
npm run build
npm run preview
```

## Google Sheets Integration

- Setup docs: `docs/google-sheets-setup.md`
- Apps Script code: `docs/google-sheets-apps-script.gs`
- Optional helper script to create spreadsheet + seed rows:
  - `scripts/create_benson_sheet.py`

## Deploy Options

### 1) Automatic deploy (recommended)

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.

Repository setting needed:

- `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`

### 2) Manual deploy command

```bash
npm run deploy
```

Publishes `dist/` to branch `gh-pages`.
