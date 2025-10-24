# 🌐 Impactify — Your AI-Powered Data Analyst

> **Impactify** bridges the gap between raw data and actionable insights.  
> Upload. Clean. Ask in English. Visualize. All powered by an AI that understands your data.

---

## 🚀 Overview

**Impactify** is a full-stack web application designed to make data analysis accessible to everyone — even without SQL or data science expertise.  

Users can:
- Upload datasets (CSV files)
- Interactively clean and fix issues
- Ask questions in plain English (like *“Show me top 10 products by revenue last quarter”*)
- Get the results as dynamic D3.js visualizations

Behind the scenes, Impactify’s **AI engine** translates natural language queries into **secure SQL** and executes them on the user’s private dataset.

---

## 🧩 Key Features

### 🗂️ File Ingestion
- **In-browser parsing:** CSVs parsed chunk-by-chunk using **Papa Parse**  
- **Streaming upload:** Frontend streams data chunks to backend for smooth, large uploads  

### 📊 Automated Data Profiling
- Backend automatically infers column types, missing values, and inconsistencies  
- Generates a **“Data Report Card”** showing data health and stats  

### 🧼 Interactive Data Cleaning (“Cleaning Room”)
- Fix missing values (mean, median, custom)
- Merge inconsistent text entries (e.g., “USA” vs “U.S.A.”)
- Correct wrongly inferred data types
- Preview and commit cleaned dataset

### 🧠 Natural Language → SQL
- Users can ask queries in plain English  
- Backend uses **Google Gemini API** with schema-aware prompting  
- Returns validated SQL + chart type (JSON format)
- Backend validates SQL for safety before execution  

### 📈 AI Visualization Workbench
- Dynamic charts rendered via **D3.js**
- Pin favorite queries and visualizations to a **drag-and-drop dashboard**
- Persistent layouts using **react-grid-layout**

---

## 👤 User Roles

### Registered User
- Can upload, clean, and analyze their datasets  
- Full CRUD access to their own data and dashboards  

### Guest (Future Scope)
- Can browse shared public dashboards (read-only)

---

## 🧱 Tech Stack

### Frontend
- **React (Vite)**  
- **Tailwind CSS**  
- **D3.js** (visualizations)  
- **Zustand** (state management)  
- **react-grid-layout** (dashboards)  
- **Papa Parse** (file parsing)

### Backend
- **Node.js** + **Fastify** (API framework)  
- **PostgreSQL** (database)  
- **JWT Authentication**  
- **Google Gemini API** (LLM for SQL generation)

### Optional / Extensions
- **Prisma ORM** (for schema handling)  
- **TimescaleDB** (for time-series data)

---

## 🗃️ Database Schema (Simplified)

**Users**
| Field | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| email | String | Unique |
| password_hash | String | Secure password storage |
| created_at | Timestamp | Account creation date |

**Datasets**
| Field | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key |
| dataset_name | String | File name |
| status | Enum | uploading / profiling / cleaning / ready / error |
| data_table_name | String | Private table name |

**Dataset Schema**
| Field | Type | Description |
|--------|------|-------------|
| column_name | String | Column name |
| data_type | String | Data type (TEXT, FLOAT, etc.) |
| description | Text | Optional hints for AI |

**Dashboards / Charts**
| Table | Description |
|--------|-------------|
| Dashboard | User’s saved dashboard layout |
| Chart | Saved chart widget (NL query + SQL + chart type) |

---

## 🧠 Workflow

1. **Login / Signup**
2. **Upload CSV** → parsed with Papa Parse → streamed to backend
3. **Data Profiling** → backend analyzes columns and missing data
4. **Cleaning Room** → fix issues interactively
5. **Commit Clean Data** → stored securely in private table
6. **Ask Query in English** → AI generates and validates SQL
7. **Visualize** → Chart auto-rendered via D3.js
8. **Pin to Dashboard** → Save chart for future insights

---

## 🧰 Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm / pnpm / yarn
- Google Gemini API key

### Clone & Install
```bash
git clone https://github.com/<your-username>/impactify.git
cd impactify
