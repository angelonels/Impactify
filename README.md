<div align="center">

<br />

# Impactify

#### Conversational analytics for your spreadsheets.

<p>
  Upload a CSV or Excel file. Ask questions in plain English or Hindi. Impactify writes safe SQL, picks the right chart from a catalog of twenty-two visualization types, and remembers every turn of the conversation. Pin charts. Compose drag-and-drop dashboards.
</p>

<br />

<p>
  <a href="https://impactify-alpha.vercel.app"><b>Live demo</b></a>
  &nbsp;·&nbsp;
  <a href="./idea.md">Product vision</a>
  &nbsp;·&nbsp;
  <a href="./samples/sales_sample.csv">Sample dataset</a>
</p>

<br />

<sub>
React 19 · Vite · Tailwind · Nivo · Express 5 · Prisma · Postgres · Gemini 2.5 Flash
</sub>

</div>

<br />

---

## Overview

Impactify removes the technical barrier between non-technical users and their own data. Where a typical analytics tool asks the user to learn SQL, write transformations, and configure a chart library, Impactify lets the user state intent and returns the chart. The system handles ingestion, type inference, conversation memory, SQL synthesis, sandboxed execution, visualization choice, and persistence.

A single interaction looks like this: the user uploads `sales.xlsx`, the backend parses the file, infers each column's type, marks the dataset ready, and surfaces the data in a chat workbench. The user asks *"show monthly sales trend"*. The assistant produces a SELECT statement against the user's private table, validates it through an AST parser, executes it inside a read-only transaction with a hard time and row cap, picks a line chart, and renders the result. The next message — *"now break that down by city"* — reuses the previous SQL with one new dimension, because the last six conversational turns are part of the prompt. The user clicks Pin; the chart joins the Insights gallery and can be dragged onto a Dashboard tile that re-executes its query live whenever the dashboard is opened.

## Highlights

- **Conversational SQL.** Multi-turn chat with persistent history. The assistant resolves follow-ups against earlier turns, self-corrects when its first SQL attempt fails against Postgres, and explains every generated query in plain English using a deterministic AST walker — no second LLM call required.
- **Twenty-two visualization types.** Bar, line, area, pie, donut, scatter, heatmap, treemap, sunburst, circle-packing, funnel, calendar, radar, radial-bar, waffle, boxplot, swarmplot, stream, bump, marimekko, KPI, table. The AI picks; the user can override via a switcher above any chart without re-querying.
- **Sandboxed execution.** Every AI-generated query is parsed with `node-sql-parser`, rejected if it is not a single SELECT, then executed inside `BEGIN READ ONLY` with a configurable statement timeout and an outer row cap. Postgres lock timeouts surface as 504 responses.
- **Pinned insights and dashboards.** Save any chart to Insights. Compose drag-and-drop dashboards backed by `react-grid-layout`. Layout persists; tiles re-execute their SQL on every load, so dashboards are never stale.
- **Ingestion at scale.** Streaming CSV parser plus a sheet-aware xlsx reader. Parameterized batch inserts sized to stay under Postgres' 65535-parameter cap regardless of column count. Cleaner infers `INTEGER`, `FLOAT` (including scientific notation and currency formats), `BOOLEAN`, `TIMESTAMP`, and `TEXT` with savepoint-per-column rollback on failure.
- **Bilingual prompts.** Questions in English or Hindi return English SQL with the overview answered in the user's language.
- **Model fallback chain.** When Gemini 2.5 Flash exhausts its free-tier quota, the request automatically falls back to Flash Lite, then 2.0 Flash, without user-visible disruption.
- **Production hardening.** Helmet, rate limits on auth and analyze endpoints, central error middleware, healthcheck endpoint, environment validator at boot, JWT auth with code-exchange OAuth (no token leakage via URL), 25 MB upload caps, and an end-to-end deploy descriptor in `render.yaml`.
- **Polish.** Dark and light themes that persist, branded modals and toast notifications instead of native browser dialogs, command palette via `cmdk`, lazy-loaded routes, responsive layouts.

## Architecture

```
+-----------------------------+        +---------------------------------+        +-----------------+
|        Frontend             |  HTTPS |            Backend              |  pg    |    Database     |
|        Vite + React 19      | <----> |        Express 5 + Prisma       | <----> |  Postgres (Neon)|
+-----------------------------+        +---------------------------------+        +-----------------+
 Routes (lazy loaded)                   Middleware: helmet, cors, rate-limit       Per-user data
 AuthContext (Bearer JWT)               Validator: node-sql-parser AST guard       tables  ds_*
 ThemeContext (dark/light)              Sandbox:   sqlRunner (READ ONLY +          stored side by
 ToastContext                                       timeout + row cap)             side with Prisma
 CommandPalette (cmdk)                  AI:        aiService (Gemini 2.5 Flash,    metadata models.
 22 Nivo chart components                          multi-turn + repair loop +
 react-grid-layout dashboards                      model fallback chain)
 lib/api.js (auto Bearer,               Memory:    conversationService
 friendly error mapping)                Explainer: sqlExplainer (deterministic)
```

## Tech stack

| Layer | Technologies |
| ----- | ------------ |
| Frontend | Vite 7, React 19, React Router, Tailwind v4, framer-motion, lucide-react, cmdk, react-grid-layout |
| Charts | `@nivo/*` (bar, line, pie, scatterplot, heatmap, treemap, sunburst, funnel, calendar, sankey-ready, chord-ready, network-ready, radar, radial-bar, stream, waffle, bump, boxplot, swarmplot, marimekko, circle-packing) |
| Backend | Express 5, Prisma 5, pg, helmet, express-rate-limit, morgan, multer, xlsx, csv-parser |
| AI | `@google/genai` against Gemini 2.5 Flash with deterministic fallback chain |
| Auth | bcryptjs, jsonwebtoken, passport-google-oauth20 (code-exchange) |
| Validation | node-sql-parser (PostgreSQL dialect) |
| Tests | Vitest |
| Hosting | Vercel (frontend), Render (backend via `render.yaml`), Neon (Postgres) |

## Quick start

```bash
# 1. Local Postgres (one-time, via Homebrew on macOS)
brew install postgresql@15 && brew services start postgresql@15
createdb impactify

# 2. Server
cd server
cp .env.example .env       # fill DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npm install
npx prisma migrate deploy
npm run dev                # http://localhost:5001

# 3. Client (new shell)
cd client
echo "VITE_API_URL=http://localhost:5001" > .env.local
npm install
npm run dev                # http://localhost:5173
```

For a no-login local demo set `AUTH_REQUIRED=false` in `server/.env`. The middleware then routes every request to a shared guest user; the rest of the auth stack stays in place behind the flag.

## Configuration

### Server environment

| Variable | Required | Description |
| --- | :---: | --- |
| `DATABASE_URL` | yes | Postgres connection string (Neon, Supabase, RDS, or local) |
| `JWT_SECRET` | yes | A random string of at least 24 characters |
| `FRONTEND_URL` | yes | Used for OAuth callback redirects |
| `GEMINI_API_KEY` | recommended | Without it, `/api/dataset/analyze` returns HTTP 503 |
| `GOOGLE_CLIENT_ID` | recommended | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | recommended | Google OAuth |
| `GEMINI_MODELS` | optional | Comma-separated fallback chain (defaults to `gemini-2.5-flash,gemini-2.5-flash-lite,gemini-2.0-flash`) |
| `AUTH_REQUIRED` | optional | Set to `false` to disable auth enforcement in development |
| `CORS_ORIGINS` | optional | Comma-separated whitelist of allowed origins |
| `ANALYZE_ROW_CAP` | optional | Maximum rows returned per query (default `5000`) |
| `ANALYZE_STATEMENT_TIMEOUT_MS` | optional | Per-query Postgres timeout in ms (default `10000`) |
| `NODE_ENV` | optional | `production` enables condensed logging and hides stack traces |
| `PORT` | optional | Defaults to `5001` |

### Client environment

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | URL of the backend (e.g. `http://localhost:5001` or `https://impactify.onrender.com`) |

## API surface

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | open | Email/password signup |
| `POST` | `/api/auth/login` | open | Email/password login |
| `GET` | `/api/auth/google` | open | Google OAuth entry |
| `GET` | `/api/auth/google/callback` | open | OAuth redirect, issues exchange code |
| `POST` | `/api/auth/exchange` | open | Trade short-lived code for JWT |
| `GET` | `/api/auth/me` | required | Current user |
| `POST` | `/api/dataset/upload` | required | CSV / XLSX up to 25 MB |
| `GET` | `/api/dataset/list` | required | All datasets owned by the user |
| `GET` | `/api/dataset/:id` | required | Dataset detail with schema |
| `PATCH` | `/api/dataset/:id` | required | Rename |
| `DELETE` | `/api/dataset/:id` | required | Delete (drops the underlying table) |
| `PATCH` | `/api/dataset/:id/schema/:colId` | required | Edit a column description |
| `POST` | `/api/dataset/analyze` | required | Natural-language question against a dataset |
| `GET` | `/api/conversations` | required | List conversations |
| `GET` | `/api/conversations/:id` | required | Conversation with full message history |
| `PATCH` | `/api/conversations/:id` | required | Rename |
| `DELETE` | `/api/conversations/:id` | required | Delete |
| `POST` | `/api/conversations/:id/messages/:msgId/execute` | required | Re-execute a stored message's SQL |
| `GET` | `/api/insights` | required | Pinned insights |
| `POST` | `/api/insights` | required | Pin a chart |
| `POST` | `/api/insights/:id/execute` | required | Re-execute insight SQL with fresh data |
| `DELETE` | `/api/insights/:id` | required | Delete |
| `GET` | `/api/dashboards` | required | List dashboards |
| `POST` | `/api/dashboards` | required | Create |
| `GET` | `/api/dashboards/:id` | required | Detail with tiles |
| `PATCH` | `/api/dashboards/:id` | required | Rename |
| `DELETE` | `/api/dashboards/:id` | required | Delete |
| `POST` | `/api/dashboards/:id/items` | required | Add a tile |
| `DELETE` | `/api/dashboards/:id/items/:itemId` | required | Remove a tile |
| `PATCH` | `/api/dashboards/:id/layout` | required | Persist grid layout |
| `GET` | `/healthz` | open | Liveness check |

## Security model

- **Read-only execution.** AI-generated SQL is parsed before execution. Anything that is not a single SELECT is rejected. Execution runs inside a `BEGIN READ ONLY` transaction with `SET LOCAL statement_timeout` and an outer `LIMIT` cap.
- **AST-based validation.** `node-sql-parser` runs the PostgreSQL grammar and returns a typed tree. Multi-statement and DDL/DML payloads cannot pass.
- **No silent fallback.** When the Gemini key is missing or the model returns malformed JSON, the API returns HTTP 503/502 with a structured error. The system never invents a fake chart to mask a configuration error.
- **OAuth without URL tokens.** Google callback issues a short-lived one-time exchange code; the frontend trades it for a JWT through a POST endpoint. Tokens never appear in the URL bar, browser history, or referer headers.
- **Rate limits.** Thirty auth requests per fifteen minutes, twenty analyze requests per minute. Configurable.
- **Hardening defaults.** Helmet sets a strict CSP, COOP/CORP, `nosniff`, and frame protection. CORS whitelist is explicit.
- **Auth bypass flag.** `AUTH_REQUIRED=false` (development only) routes every request to a single shared guest user. The auth code itself remains active; flipping the flag back to `true` restores enforcement.

## Project structure

```
server/
  controllers/         analyzeQuery, insights, dashboards, conversations, datasets, auth
  services/            aiService, cleanerService, ingestionService, sqlRunner,
                       sqlExplainer, conversationService
  routes/              datasetRoutes, conversationRoutes, insightsRoutes,
                       dashboardsRoutes, authRoutes
  middleware/          authMiddleware, errorHandler
  utils/               sqlGuard, oauthExchange
  config/              env, db (Prisma client), pg (raw pool), passport
  prisma/              schema.prisma + 4 migrations
  tests/               *.test.mjs (Vitest, run with `npm test`)

client/
  src/
    pages/             Home, Dashboard, Upload, Workbench, DataCleaning,
                       Insights, Dashboards, DashboardView, DemoGallery,
                       AboutUs, Contact, Login, Signup, ForgotPassword,
                       AuthSuccess, TermsOfService, PrivacyPolicy
    components/        Modal, ConfirmDialog, InputDialog, ChatMessage,
                       ConversationSidebar, CommandPalette, VizRenderer,
                       RequireAuth, Navbar, Footer, Hero, Features, HowItWorks,
                       ChromaGrid, LiquidEther, ScrollVelocity
    components/charts/ 21 chart components + registry.js + theme.js
    context/           AuthContext, ThemeContext, ToastContext
    lib/               api, chartShape, datasetTitle
    styles/            *.css with dark + light variants

samples/               sales_sample.csv  (48-row demo)
render.yaml            Backend service definition for Render
```

## Demo

`samples/sales_sample.csv` contains forty-eight rows across seven columns
(`order_date`, `city`, `product_category`, `customer_segment`, `sales`, `units_sold`, `discount_pct`)
spanning the full calendar year. The `DemoGallery` page renders the entire chart catalog against this data offline; no backend round trip is required to exercise the visualization layer.

Representative queries:

| Prompt | Resulting chart |
| --- | --- |
| `show monthly total sales trend` | line |
| `top 5 cities by total sales` | bar |
| `market share by product category` | pie |
| `scatter plot of sales vs units_sold` | scatter |
| `heatmap of sales by city and product category` | heatmap |
| `treemap of sales by category` | treemap |
| `what is the total revenue?` | kpi |
| `boxplot of sales by city` | boxplot |
| `मुंबई की कुल बिक्री दिखाओ` | bar (overview answered in Hindi) |

## Development

```bash
# Run the server test suite (Vitest, fast unit tests, no DB required)
cd server && npm test

# Apply a new Prisma migration locally
cd server && npx prisma migrate dev --name describe_change

# Build the production client bundle (lazy-split per route)
cd client && npm run build

# Type-check generated Prisma client
cd server && npx prisma generate
```

## Deployment

The application targets a three-service topology: Vercel for the static frontend, Render for the Node backend, Neon for managed Postgres.

- **Render** picks up `render.yaml` automatically. Set the listed environment variables on the dashboard. Build command runs `npm install && npx prisma generate && npx prisma migrate deploy` so schema changes propagate without manual intervention. Healthcheck path is `/healthz`.
- **Vercel** builds the client directory with `VITE_API_URL` pointing at the Render backend. SPA refresh is handled by `client/vercel.json`.
- **Neon** branch databases work as drop-in replacements for the production URL during preview deploys.

## Roadmap

Tracked in [`idea.md`](./idea.md). Near-term: in-page data report card with per-column statistics, few-shot prompt enrichment from past successful conversations, query-result and LLM-response caching, Google Sheets connector, derived columns via Postgres `GENERATED ALWAYS AS`, server-sent events for streaming analyze responses.

## License

Released under the MIT License.
