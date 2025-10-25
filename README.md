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
8. [🧑‍💻 Our Team](#-our-team)

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

### 🧑‍💻 Our Team
**Team CodeBrewers**

**Angelo Nelson** • **Ayush Kumar Singh** • **Isha Singh** • **Rohit Nair P**

> A collaborative effort fueled by creativity, curiosity, and coffee ☕  
> Building impactful tech — one line of code at a time 🚀

---
