# Dev Jobs Board

A Next.js 16 app showing live-scraped LinkedIn developer job listings
(Software / Fullstack / Backend Developer — San Francisco & Dhaka),
with filters, inline-editable rows, and CSV export.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build a static export

```bash
npm run build
```

This produces a fully static site in `out/` (because `next.config.js`
sets `output: "export"`) — no Node server required to host it.

## Deploy — GitHub Pages (included, automatic)

This repo already includes `.github/workflows/deploy.yml`, which builds
the static export and publishes it to GitHub Pages every time you push
to `main`. See the "Go live on GitHub Pages" steps in the chat message
that came with this project for the one-time repo setup.

If your repo is **not** named `<your-username>.github.io`, uncomment
and set `basePath` / `assetPrefix` in `next.config.js` to `/<repo-name>`
before your first deploy, or asset paths will 404.

## Deploy — Vercel (alternative, zero config)

Since this is a Next.js app, Vercel (made by the Next.js team) will
detect everything automatically — just import the GitHub repo at
vercel.com/new and click Deploy. No workflow file or `output: "export"`
needed for this path.
# jobs-dashboard
