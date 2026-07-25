# 🦠 CovidTrack

A modern, real-time **COVID-19 statistics dashboard** — global and per-country
figures with animated stat cards, an interactive historical-trend chart, and a
light/dark theme. Built with **React 18** and **Vite**.

<p align="center">
  <em>Data from the open <a href="https://disease.sh">disease.sh</a> API
  (Johns Hopkins University, Worldometers & others).</em>
</p>

---

## ✨ Features

- **Live global & country stats** — confirmed, active, recovered, deaths, critical, and tests.
- **Searchable country picker** with flags and full keyboard navigation.
- **Interactive trend chart** (Chart.js) with a cumulative / daily-new toggle.
- **Animated counters** with an ease-out curve that respect `prefers-reduced-motion`.
- **Light & dark themes** — auto-detected from the system, persisted across visits.
- **Responsive, accessible UI** — fluid grid, ARIA roles, focus-visible outlines.
- **Graceful loading & error states** — shimmer skeletons and retry actions.

## 🛠️ Tech stack

| Concern     | Choice                          |
| ----------- | ------------------------------- |
| Framework   | React 18 (function components)  |
| Build tool  | Vite 6                          |
| Charts      | Chart.js 4 + react-chartjs-2 5  |
| Data source | [disease.sh](https://disease.sh) REST API |
| HTTP        | Native `fetch` (no dependency)  |
| Styling     | Hand-rolled CSS design system with custom properties |

## 🚀 Getting started

Requires **Node.js 18+**.

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev

# Type-check-free production build → ./build
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

## 📁 Project structure

```
covidtrack/
├── index.html              # Vite entry HTML
├── vite.config.js
├── eslint.config.js
├── public/                 # Static assets (icons, manifest)
└── src/
    ├── main.jsx            # App bootstrap
    ├── App.jsx             # Layout & data orchestration
    ├── api/
    │   └── covid.js        # disease.sh client (fetch-based)
    ├── components/
    │   ├── Header.jsx
    │   ├── Scope.jsx
    │   ├── CountryPicker.jsx
    │   ├── StatCards.jsx
    │   ├── StatCard.jsx
    │   ├── TrendChart.jsx
    │   └── Footer.jsx
    ├── hooks/
    │   ├── useCountUp.js    # rAF count-up animation
    │   └── useTheme.js      # theme detection + persistence
    ├── utils/
    │   └── format.js        # number / date formatters
    └── styles/
        └── global.css       # design tokens + component styles
```

## 📊 Data & disclaimer

All figures are fetched client-side from the public
[disease.sh](https://disease.sh) API and are provided **for informational
purposes only**. Reporting methodology and update cadence vary by source and
country.

## 📄 License

Released under the MIT License.
