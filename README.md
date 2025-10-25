# 🌟 Impactify — Your AI-Powered Data Analyst

> **Empowering everyone to become a data analyst — without writing a single line of SQL.**

Impactify is a **full-stack AI-powered web application** that bridges the gap between raw data and actionable insights.  
Users can **upload datasets, clean data interactively**, and **ask questions in plain English** — Impactify automatically converts them into **SQL queries** and **renders visualizations** like bar, line, or pie charts instantly.

---

## 📖 Table of Contents

1. [✨ Overview](#-overview)
2. [🚀 Key Features](#-key-features)
3. [👤 User Roles](#-user-roles)
4. [🖥️ Frontend Pages](#️-frontend-pages)
5. [🧱 Database Schema](#-database-schema)
6. [🧩 Tech Stack](#-tech-stack)
7. [⚙️ Workflow](#️-workflow)
8. [🗂️ Folder Structure](#️-folder-structure)
9. [🧰 Installation & Setup](#-installation--setup)
10. [🔑 Environment Variables](#-environment-variables)
11. [🧠 AI Query Example](#-ai-query-example)
12. [📡 API Endpoints](#-api-endpoints)
13. [💾 Expected Outcomes](#-expected-outcomes)
14. [🤝 Contributing](#-contributing)
15. [📜 License](#-license)
16. [❤️ Acknowledgments](#️-acknowledgments)

---

## ✨ Overview

**Impactify** is a next-generation data analysis platform designed to simplify how people interact with data.  
Instead of learning SQL or data visualization tools, users can **ask questions in natural language**.  
The backend then securely converts these questions into SQL queries and visualizes the results dynamically.

### 🎯 Mission
> To make data-driven decision-making accessible to everyone — not just data scientists.

---

## 🚀 Key Features

### 1. 🧾 File Ingestion
- **In-browser parsing** using [Papa Parse](https://www.papaparse.com/).  
- **Chunked streaming** to backend for reliable ingestion.

### 2. 🤖 Automated Data Profiling
- Detects column types, missing values, and text inconsistencies.  
- Generates a **Data Report Card** highlighting issues and suggestions.

### 3. 🧹 Interactive Data Cleaning
- View and fix issues from the Data Report Card.  
- Fill missing values (mean, median, custom).  
- Merge inconsistent text entries.  
- Correct inferred data types.

### 4. 💬 Natural Language → SQL
- AI translates plain English into optimized SQL queries.  
- Example: _“Show me the top 10 customers by sales last quarter as a bar chart.”_  
- Secure validation before execution.  
- Outputs chart-ready data and visualization type.

### 5. 📊 AI-Driven Visualization Workbench
- Dynamic rendering via **D3.js**.  
- Supports bar, line, pie, scatter charts, etc.  
- Pin and save charts to a customizable dashboard using `react-grid-layout`.

---

## 👤 User Roles

| Role | Permissions | Data Access |
|------|--------------|--------------|
| **Admin** | Manage users, view system metrics, control public content | Read-only metadata (no user data) |
| **Registered User** | Upload, clean, analyze data, manage dashboards | Full access to their own data |
| **Guest (Future)** | Browse public dashboards | Read-only |

---

## 🖥️ Frontend Pages

| Route | Description |
|--------|--------------|
| `/login` & `/signup` | Authentication pages |
| `/dashboard` | User's project hub |
| `/upload` | Upload CSV datasets |
| `/dataset/{id}/clean` | Data cleaning interface |
| `/dataset/{id}/analyze` | Natural language querying + visualization workbench |
| `/admin/dashboard` | Admin control panel |
| `/profile` | Manage user profile |

---

## 🧱 Database Schema (PostgreSQL)

### **User**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| email | String | Unique |
| password_hash | String | Securely stored |
| role | Enum(`ADMIN`, `USER`) | Access control |
| auth_provider | Enum(`EMAIL`, `GOOGLE`) | Login type |
| google_id | String | Nullable |
| created_at | Timestamp | Creation date |

### **Dataset**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | FK → User |
| dataset_name | String | Name of dataset |
| status | Enum | `uploading`, `profiling`, `cleaning`, `ready`, `error` |
| data_table_name | String | Private table name per dataset |

### **Dataset_Schema**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| dataset_id | UUID | FK → Dataset |
| column_name | String | Column name |
| data_type | String | FLOAT / TEXT / TIMESTAMP |
| description | Text | Optional column notes for AI |

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Tailwind CSS, Zustand, D3.js, React Router, react-grid-layout, Papa Parse |
| **Backend** | Node.js, Express, Fastify (optional), JWT Auth, Google OAuth |
| **AI / LLM** | Google Gemini API (Schema-Aware Prompting) |
| **Database** | PostgreSQL (with TimescaleDB extension optional) |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend), Neon.tech (DB) |

---

## ⚙️ Workflow

1. **Login/Upload** — User signs in and uploads a CSV.  
2. **Parsing** — Browser parses CSV with Papa Parse, streams to backend.  
3. **Profiling** — Backend analyzes data, creates schema, sets dataset status = `cleaning`.  
4. **Cleaning** — User fixes missing values, text inconsistencies, etc.  
5. **Commit** — Backend applies cleaning rules and finalizes dataset.  
6. **Analyze** — User queries data in plain English.  
7. **AI Processing** — Backend retrieves schema and queries LLM for SQL + chart type.  
8. **Execution** — SQL is validated and executed on user’s private dataset.  
9. **Visualization** — Frontend dynamically renders the chart.  
10. **Dashboard Save** — Users can pin, save, and manage dashboards.

---


## 🗂️ Folder Structure

impactify/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── auth.js
│ │ │ ├── datasets.js
│ │ │ └── query.js
│ │ ├── lib/
│ │ │ ├── llm.js
│ │ │ └── sqlValidator.js
│ │ ├── workers/
│ │ │ └── profiler.js
│ │ ├── db.js
│ │ └── server.js
│ ├── package.json
│ ├── .env.example
│ └── migrations/
│ └── init.sql
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── context/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── public/
│ ├── package.json
│ ├── vite.config.js
│ └── index.html
└── README.md

## 🧰 Installation & Setup

Follow these steps to set up **Impactify** locally:

```bash
# Clone the repository
git clone https://github.com/your-username/impactify.git
cd impactify

# Install and run backend
cd backend
npm install
cp .env.example .env
npm run dev

# In a new terminal, run frontend
cd ../frontend
npm install
npm run dev

The app should now be running on:

Frontend: http://localhost:5173

Backend: http://localhost:5000

🔑 Environment Variables

Copy the .env.example file and fill in your credentials:

# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/impactify

# Optional: OpenAI or Gemini key
AI_API_KEY=your_ai_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

🧠 AI Query Example
Example query

“Show total users grouped by country for the last 6 months.”

How it works:

The AI model converts this query into a validated SQL query.

The query is run on your uploaded dataset.

Results are displayed in a D3.js visualization.

Example SQL Output:

SELECT country, COUNT(*) AS total_users
FROM users
WHERE signup_date >= NOW() - INTERVAL '6 months'
GROUP BY country;


Example Chart Output:
A bar chart comparing user counts by country.

📡 API Endpoints
Auth Routes (/api/auth)
Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	Login and get token
Dataset Routes (/api/datasets)
Method	Endpoint	Description
GET	/	Get all datasets
POST	/upload	Upload a CSV dataset
Query Routes (/api/query)
Method	Endpoint	Description
POST	/generate	Convert natural query to SQL
POST	/execute	Execute SQL on the dataset
💾 Expected Outcomes

✅ Users can upload datasets (CSV, JSON).
✅ AI generates SQL queries from natural text.
✅ Queries are validated and executed securely.
✅ Data visualizations appear dynamically (via D3.js).
✅ Authenticated routes for login/register are functional.
✅ Ready for Docker, CI/CD, and future AI model integration.

🤝 Contributing

Contributions are welcome!
Please follow these steps:

Fork the repository

Create a new branch

git checkout -b feature/your-feature


Commit your changes

git commit -m "Add your feature"


Push the branch

git push origin feature/your-feature


Open a Pull Request 🎉

📜 License

This project is licensed under the MIT License.
See the LICENSE
 file for more details.

❤️ Acknowledgments

Special thanks to:

OpenAI & Gemini for natural language query support.

D3.js for stunning data visualizations.

PapaParse for CSV ingestion.

Vite + React + Tailwind for the lightning-fast frontend.

Express + PostgreSQL for the reliable backend foundation.

All the open-source contributors and inspiration behind Impactify.

⭐ Star this repository if you find it helpful!
