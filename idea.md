# Impactify — Your AI-Powered Data Analyst

## Overview

Impactify is a full-stack web application that turns raw spreadsheets into clear, actionable insights. Upload a CSV or Excel file. Ask questions in plain English (or Hindi). The AI translates each question into validated SQL, executes it safely against your private data, and renders the answer as a chart picked from a 22-chart catalog. Conversation memory lets you ask follow-ups — "now break that down by city" — without restating context. Pin charts you love. Compose dashboards. Open them later; tiles re-execute live.

The mission: remove technical barriers — schema knowledge, SQL fluency, viz tooling — so non-technical decision-makers can self-serve answers from their own data.

---

## Core capabilities (as built)

### 1. Ingestion
- **CSV and Excel** (`.csv`, `.xlsx`, `.xls`) up to 25 MB.
- Headers sanitized (`Sales by Year` → `sales_by_year`). Blank cells stored as `NULL` so `IS NOT NULL` filters work.
- Parameterized batch inserts (under Postgres' 65k-param limit), no SQLi surface from raw cell values.

### 2. Auto-cleaning + type inference
Background job (per dataset) infers the SQL type of every column from a sample:
- INTEGER, FLOAT (incl. scientific notation `1.2e-4`, currency `$1,200`, percent `33%`)
- BOOLEAN (`true/false/yes/no/1/0`)
- TIMESTAMP (ISO `2024-05-21`, English `May 21 2024`, robust against false positives — "20" is NOT a date)
- TEXT fallback when no type dominates (80% threshold)

Failed casts roll back per-column via SAVEPOINT — the column stays TEXT instead of nuking the whole dataset. Dataset status flips to `READY` when done.

### 3. Conversational NL→SQL (Gemini 2.5 Flash)
- Each chat thread is a `Conversation` with its own message history.
- Last 6 turns injected into Gemini prompt. Follow-ups like *"now break that down by city"* reuse the prior SQL.
- Multilingual: ask in English, Hindi, or transliterated Hinglish. SQL stays English; overview answers in your language.
- **Self-correcting retry**: if Postgres rejects the generated SQL (column missing, etc.), the controller re-prompts Gemini with the failing SQL + Postgres error and retries once.
- **Per-column descriptions**: edit `"sales"` → "total revenue in INR" once; every future query benefits.

### 4. Defense-in-depth SQL execution
- **Validator** (`node-sql-parser`): rejects anything but a single SELECT. No DROP/DELETE/UPDATE/INSERT, no multi-statement.
- **Sandboxed runner**: every analyze query runs inside `BEGIN READ ONLY` with a 10-second `statement_timeout` and an outer `LIMIT 5000` row cap. Timeouts surface as HTTP 504.

### 5. Plain-English SQL explainer
Every generated SQL is parsed AST-side (no extra LLM call) into a human summary:
> *Selects "city", SUM of "sales" (aliased "total_sales"), from ds_…, grouped by "city", ordered by "total_sales" DESC, limited to 5 rows.*

### 6. Visualization catalog — 22 codes
**Comparison**: bar, radial-bar, marimekko, radar, funnel, heatmap
**Time**: line, area, stream, bump, calendar
**Part-to-whole**: pie, donut, treemap, sunburst, circle-packing, waffle
**Distribution**: scatter, boxplot, swarmplot
**Single value**: kpi
**Tabular**: table

Each chart auto-fits the data shape (numeric vs categorical vs temporal columns). The Gemini prompt encodes a decision tree per category. A chip row above every chart lets the user override the AI's pick and re-render without re-querying.

### 7. Insights + Dashboards
- **Pin** any assistant message → `SavedInsight`. Title, SQL, chartType, overview, dataset link.
- **Insights gallery** page lists all pinned charts; each tile re-executes its SQL on load (never stale).
- **Dashboards**: drag-and-drop layouts using `react-grid-layout`. Resize, rearrange, persist. Compose multi-chart views from any combination of pinned insights.

### 8. UX
- **Dark + Light themes**, persisted, toggleable from navbar (every chart, panel, and surface re-tints).
- **Cmd+K command palette** (`cmdk`): jump to any dataset, insight, dashboard, or action. Pages list is searchable.
- **Mobile-responsive**: sidebar collapses on narrow viewports.
- **Code-split bundle**: every page is lazy-loaded.

### 9. Production hardening
- Authentication: JWT (email/password + Google OAuth, exchange-code flow — no token in URL).
- `helmet`, `express-rate-limit` (30/15 min auth, 20/min analyze), central error handler, `/healthz`.
- Prisma schema with cascade deletes + FK indexes; migrations applied via `prisma migrate deploy` in build.
- Auth bypass flag (`AUTH_REQUIRED=false`) for local demo; flip to true for production.
- Vitest unit tests for `sqlGuard`, `sqlExplainer`, `cleanerService.inferType`, `conversationService.titleFromPrompt`.
- GitHub Actions CI: server tests + client build on PR / push.
- `render.yaml` for declarative Render deploy with `/healthz` healthcheck.

---

## Architecture

```
[ React + Vite ]  ←HTTP→  [ Express + Prisma ]  ←pg pool→  [ Neon Postgres ]
   ↑ Bearer JWT             ↑ helmet + rate-limit
   ↑ ⌘K palette              ↑ sqlGuard validates AI SQL
   ↑ AuthContext             ↑ sqlRunner: BEGIN READ ONLY + timeout
   ↑ ThemeContext            ↑ aiService → Gemini 2.5 Flash
                                ↑ history-aware multi-turn
```

User data tables (`ds_<ts>_<random>`) live in the same Postgres as metadata; metadata (datasets, conversations, messages, insights, dashboards) is managed by Prisma. AI SQL only runs in a read-only transaction with hard caps.

---

## What's intentionally NOT here (scope decisions)

- Multi-tenant orgs, sharing links, real-time collaboration → out of scope (solo / portfolio).
- Row-level security, audit logs, PII masking → out of scope.
- Background forecasting / anomaly cron → deferred (would need a job runner).
- Multi-model AI routing (Gemini Flash only).
- Embed iframe / public chart links.
- Voice input → deliberately removed (would not survive cross-browser).
- Sankey, chord, network charts → need `{nodes, links}` shape Gemini won't produce raw.

---

## Roadmap (next milestones)

- **M3 — Data Report Card**: per-column null %, distinct count, histogram, sample-row drill-through from chart click.
- **M2-advanced — Few-shot from history**: embed past successful prompts (`text-embedding-004`), inject top-3 similar examples per new query.
- **Query / LLM cache**: `(schemaHash, normalizedPrompt, history-hash)` → response cache. Saves Gemini calls and shaves latency for repeat questions.
- **Google Sheets connector**: live import via OAuth Sheets scope.
- **Derived columns**: Postgres `GENERATED ALWAYS AS (<expr>) STORED` with a node-sql-parser expression validator.
- **Streaming responses**: SSE for `{stage: thinking → sql → executing → done}` so the user sees progress on slow queries.

Tech bet: stay on Gemini 2.5 Flash, Express, Vite, Neon. No stack rewrite — instead, layer features one milestone at a time.
