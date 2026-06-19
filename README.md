# MF Tracker - Production-Ready Mutual Fund Tracker

MF Tracker is a modern, fast, SEO-friendly Mutual Fund Tracker web application built using the [MFapi.in](https://api.mfapi.in) public API. The application is completely static and deploys to **GitHub Pages** using GitHub Actions.

The UI features glassmorphism card layouts, dynamic glowing animations, a dark-mode first design, custom Recharts curves, and an easy-to-use search and comparison console.

## Key Features

- 🔍 **Instant Search & Filters**: Search over 10,000+ mutual fund schemes instantly, complete with history chips and AMC filters.
- 📈 **Price Performance Charts**: Beautiful interactive historical charts for 1M, 3M, 6M, 1Y, 3Y, 5Y, and custom ranges.
- ⚖️ **Comparison Console**: Compare key metrics and relative performance curves side-by-side for up to 4 funds.
- 🧮 **SIP Calculator**: Estimate expected investment growth and total corpus with interactive pie chart breakdowns.
- ⭐ **Local Watchlist**: Favorite and bookmark funds for daily tracking with offline support.
- 📱 **Progressive Web App (PWA)**: Desktop/mobile installable app with network-first offline API query caches.
- ⚡ **Performance & SEO**: Fully optimized with route code-splitting, Helmet metadata, and structured JSON-LD schemas.

---

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **State Management**: Zustand (localStorage persistence)
- **API Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM (subroute redirections fallback)
- **Visuals**: Recharts (price charts & pie charts), Framer Motion (page animations)
- **Icons**: Lucide Icons
- **SEO & Meta**: React Helmet Async + Robots/Sitemap generator
- **PWA support**: `vite-plugin-pwa` service workers

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kapil-dev-pal/mf-tracker.git
   cd mf-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build production static bundle:
   ```bash
   npm run build
   ```

---

## Deployment to GitHub Pages

The project contains a GitHub Actions workflow `.github/workflows/deploy.yml` which automates building and publishing the application to GitHub Pages on every push to the `main` branch.

### Manual SPA Routing Fallback
Since GitHub Pages does not support native SPA fallback, this project incorporates the `rafgraph/spa-github-pages` redirect mechanism:
- `public/404.html` intercepts page-refreshes on subroutes and redirects them to `index.html` with query parameters.
- `index.html` parses and decodes the route back into the browser's history log for React Router to resolve.

---

## Data Source
Mutual fund NAV data is sourced from **AMFI (Association of Mutual Funds in India)** via the free public endpoint [MFapi.in](https://api.mfapi.in). No API key is required.
