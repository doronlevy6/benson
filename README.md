# Benson Website

React + Vite + MUI website for **Benson Construction**, prepared for deployment on GitHub Pages under:

`https://doronlevy6.github.io/benson/`

## Tech Stack

- React (Vite)
- MUI (`@mui/material`)
- GitHub Actions for Pages deployment

## Project Notes

- Vite base path is configured as `'/benson/'` in `vite.config.js`.
- The Phase 1 site is a **single-page app with section tabs** (no router yet), which avoids GitHub Pages route fallback issues.
- The layout is mobile-first and responsive.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy Options

### 1) Automatic deploy (recommended)

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.

Make sure repo settings are:

- `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`

### 2) Manual deploy command

```bash
npm run deploy
```

This publishes `dist/` to the `gh-pages` branch using `gh-pages` package.

