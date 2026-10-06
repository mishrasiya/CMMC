# CMMCForge — Continuous Compliance & Evidence Engine

A working compliance console for **CMMC Level 2 (NIST SP 800-171 Rev 2)** — assessment,
frameworks, controls, risk (assets/vendors/register), documents, monitoring, integrations,
POA&M, audits, trust portal, and configurable reports. Data persists locally in your
browser (`localStorage`). Ships with a one-click demo dataset.

> This is the front-end. The `server/` folder is where the automation backend
> (auto-evidence collection via provider APIs) will live — see `server/README.md`.

## Requirements

- **Node.js 18+** (for `crypto.randomUUID`; localhost counts as a secure context)
- npm (bundled with Node)

## Run it

```bash
npm install
npm run dev
```

Vite prints a local URL (default **http://localhost:5173**) and opens it. On first
load it auto-seeds the demo dataset. Manage data under **Settings → Data management**
(Load demo data / Export / Import / Reset).

Build a static bundle:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built bundle
```

## Open in Cursor

1. Download and unzip this project somewhere on your machine.
2. In Cursor: **File → Open Folder…** and choose the `cmmc-console` folder
   (or from a terminal in the folder: `cursor .`).
3. Open a terminal in Cursor (`` Ctrl+` ``) and run `npm install` then `npm run dev`.

The whole app lives in `src/App.jsx` (single file), which makes it easy to ask
Cursor's AI to modify any page.

## Put it under version control

```bash
git init
git add .
git commit -m "Initial commit: CMMCForge CMMC L2 console"
```

Push to GitHub (after creating an empty repo there):

```bash
git remote add origin https://github.com/<you>/cmmc-console.git
git branch -M main
git push -u origin main
```

(The GitHub CLI shortcut, if installed: `gh repo create cmmc-console --private --source=. --push`.)

## Project layout

```
cmmc-console/
├── index.html         # loads Tailwind (Play CDN) + mounts the app
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx       # React entry
│   └── App.jsx        # the entire console (all pages/components)
└── server/            # automation backend (to be scaffolded)
    └── README.md
```

## Notes

- **Tailwind** is loaded via the Play CDN for zero-config dev. It generates every
  utility at runtime, so the classes this app builds dynamically (e.g. status colors)
  are never purged. For production, switch to a compiled Tailwind build and add a
  safelist for those dynamic color classes.
- **Data** is stored in `localStorage` (single browser, ~5MB). Use Export in Settings
  to back it up to JSON.
- **SPRS point weights** are best-effort estimates — reconcile with the official DoD
  Assessment Methodology before formal use.
