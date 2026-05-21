<h1 align="center">Impactify — Your AI-Powered Data Analyst</h1>
<p align="center"><em>Upload a CSV. Chat with it. Get charts.</em></p>

<p align="center">
  <strong>Live:</strong> <a href="https://impactify-alpha.vercel.app">impactify-alpha.vercel.app</a>
</p>

---

## What it does

Upload a CSV or Excel file. Ask questions in plain English (or Hindi). Impactify writes SQL, runs it safely, and renders the answer as one of **22 chart types** — bar, line, pie, area, scatter, heatmap, treemap, sunburst, funnel, waffle, radar, calendar, boxplot, stream, bump, KPI cards, and more. Follow-ups remember context. Pin charts you love. Compose dashboards. Open them later and tiles re-execute live.

## The 30-second tour

1. **Upload** — drop a `.csv` / `.xlsx` (≤25 MB).
2. **Wait ~2s** while the cleaner infers column types (INTEGER, FLOAT, BOOLEAN, TIMESTAMP, TEXT).
3. **Chat** — *"show monthly sales over time"*, *"now break it down by city"*, *"top 5 cities"*, *"what's total revenue?"*.
4. **Switch chart** — chip row above every chart lets you re-render in any compatible code.
5. **Pin** — save a chart to Insights.
6. **Compose** — drop pinned insights onto a Dashboard, drag/resize.
7. **⌘K** — jump anywhere instantly.

## Architecture

```
Client (Vite + React)          ↔   Server (Express + Prisma)        ↔   Postgres (Neon)
─ AuthContext + Bearer JWT          ─ helmet, rate-limit, CORS           ─ User-data tables (ds_*)
─ ThemeContext (dark/light)         ─ sqlGuard (AST validator)            ─ Metadata via Prisma
─ ⌘K palette (cmdk)                 ─ sqlRunner (READ ONLY txn,
─ Lazy routes (React.lazy)             10s timeout, 5000 row cap)
─ Nivo charts (22 types)            ─ aiService (Gemini 2.5 Flash,
─ react-grid-layout dashboards         multi-turn, self-correcting)
                                    ─ conversationService (chat memory)
```

## Stack

- **Frontend**: Vite, React 19, React Router, Tailwind, Nivo (22 chart packages), framer-motion, cmdk, react-grid-layout.
- **Backend**: Express 5, Prisma 5, pg, helmet, express-rate-limit, node-sql-parser, @google/genai, multer, xlsx, passport-google-oauth20, bcryptjs, jsonwebtoken, morgan.
- **DB**: Postgres (Neon in prod, local Homebrew for dev).
- **AI**: Gemini 2.5 Flash (`@google/genai`).
- **Tests**: Vitest (server). 30+ tests for sqlGuard, sqlExplainer, cleaner inference, conversation utils.
- **CI**: GitHub Actions — server test + client build on PR / push.
- **Deploy**: Vercel (FE), Render (BE, `render.yaml` with `/healthz` + `prisma migrate deploy`), Neon (DB).

## Local development

```bash
# Postgres (one-time)
brew install postgresql@15 && brew services start postgresql@15
createdb impactify

# Server
cd server
cp .env.example .env             # edit DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npm install
npx prisma migrate deploy
npm run dev                      # http://localhost:5001

# Client (new terminal)
cd client
echo "VITE_API_URL=http://localhost:5001" > .env.local
npm install
npm run dev                      # http://localhost:5173
```

Set `AUTH_REQUIRED=false` in `server/.env` for a no-login local demo (auth code stays in place behind the flag).

## Required env (server)

| Key | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string |
| `JWT_SECRET` | yes | ≥24 chars recommended |
| `FRONTEND_URL` | yes | For OAuth callback redirect |
| `GEMINI_API_KEY` | rec. | `/analyze` returns 503 without it (no silent fallback) |
| `GOOGLE_CLIENT_ID` / `_SECRET` | rec. | For Google OAuth |
| `AUTH_REQUIRED` | opt. | `false` to disable auth gates in dev |
| `CORS_ORIGINS` | opt. | Comma-separated whitelist |
| `ANALYZE_ROW_CAP` | opt. | Default 5000 |
| `ANALYZE_STATEMENT_TIMEOUT_MS` | opt. | Default 10000 |

## Project structure

```
server/
  controllers/         analyze, insights, dashboards, conversations, datasets, auth
  services/            aiService, cleanerService, ingestionService, sqlRunner, sqlExplainer,
                       conversationService
  routes/              datasetRoutes, conversationRoutes, insightsRoutes, dashboardsRoutes, authRoutes
  utils/               sqlGuard (node-sql-parser AST validator), oauthExchange
  middleware/          authMiddleware, errorHandler
  prisma/              schema.prisma + 4 migrations
  tests/               *.test.mjs (Vitest)

client/
  src/
    pages/             Home, Dashboard, Upload, Workbench (chat), Insights, Dashboards,
                       DashboardView, DemoGallery, Login, Signup, AuthSuccess
    components/        VizRenderer, ConversationSidebar, ChatMessage, CommandPalette, RequireAuth, Navbar
    components/charts/ 21 chart components + registry.js + theme.js
    context/           AuthContext, ThemeContext
    lib/               api (Bearer auto-attach), chartShape (data-shape helpers)
    styles/            *.css (dark + light variants)

samples/sales_sample.csv  # 48-row demo dataset for exercising all chart types
```

## Demo data

`samples/sales_sample.csv` — 48 rows × 7 columns (order_date, city, product_category, customer_segment, sales, units_sold, discount_pct). Used by `pages/DemoGallery.jsx` to render a complete UX walkthrough offline. Try queries:

- `"show monthly total sales trend"` → **line**
- `"top 5 cities by total sales"` → **bar**
- `"market share by product category"` → **pie**
- `"scatter plot of sales vs units_sold"` → **scatter**
- `"heatmap of sales by city and product category"` → **heatmap**
- `"what is the total revenue?"` → **kpi**
- `"मुंबई की कुल बिक्री दिखाओ"` → still produces valid SQL; overview in Hindi.

## Roadmap

See [`idea.md`](./idea.md) — milestones M3 (Data Report Card), M2-advanced (few-shot from history), query/LLM cache, Google Sheets connector, derived columns, SSE streaming.

## License

MIT.
