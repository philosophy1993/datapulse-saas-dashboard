# DataPulse — SaaS Analytics Dashboard

A modern SaaS analytics dashboard with real-time KPI tracking, revenue charts, and transaction monitoring.

## Features

- 📊 Interactive revenue & user growth charts (Chart.js)
- 💳 Recent transactions table with search & status filter
- 📈 KPI cards with sparklines (MRR, Active Users, Orders, Conversion)
- 🌙 Dark / light mode with localStorage persistence
- 🔒 Login screen with form validation
- ⌨️ Keyboard shortcuts (⌘K command palette, D, T, N, E, G+D/A/S)
- 📋 Settings page with profile & notification preferences
- 📱 Responsive sidebar layout

## Tech Stack

- **React 18** — component-based UI
- **Vite 5** — build tool & dev server
- **Chart.js 4** — sparklines, revenue line chart, donut chart
- **Custom CSS** — Inter font, CSS variables, dark-mode overrides

## Getting Started

```bash
npm install
npm run dev      # starts dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # ESLint
```

## Screenshots

![Overview](screenshots/dashboard_02_overview.png)
![KPI Cards](screenshots/dashboard_03_kpi_cards.png)
![Revenue Chart](screenshots/dashboard_05_revenue_chart.png)

## Project Structure

```
src/
├── main.jsx                    # React entry point
├── index.css                   # Global styles & CSS variables
├── data.js                     # All static data constants
├── App.jsx                     # Root component (state + layout)
└── components/
    ├── Auth.jsx                # LoginOverlay
    ├── Charts.jsx              # Sparkline, RevenueChart, DonutChart
    ├── CommandPalette.jsx      # ⌘K command palette
    ├── Dashboard.jsx           # Dashboard, ChartsSection, OrderRow
    ├── KpiCard.jsx             # KpiCard
    ├── Modals.jsx              # ReportModal, TransactionsModal, KpiPanel, KeyboardShortcutsModal
    ├── Settings.jsx            # SettingsPage
    ├── Sidebar.jsx             # Sidebar + workspace switcher
    ├── Toast.jsx               # ToastItem
    └── Topbar.jsx              # Topbar + notification panel
```
