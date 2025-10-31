<h1 align="center">📊 Impactify — Your AI-Powered Data Analyst</h1>
<p align="center">
  <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="400" alt="AI animation" />
</p>

<h3 align="center">
  <em>Empowering everyone to become a data analyst — without writing a single line of SQL.</em>
  
</h3>

<br/>

<p align="center">
  <a href="https://github.com/angelonels/Impactify/stargazers">
    <img src="https://img.shields.io/github/stars/angelonels/Impactify?color=gold&style=for-the-badge" alt="Stars Badge"/>
  </a>
  <a href="https://github.com/angelonels/Impactify/forks">
    <img src="https://img.shields.io/github/forks/angelonels/Impactify?color=teal&style=for-the-badge" alt="Forks Badge"/>
  </a>
  <a href="https://github.com/angelonels/Impactify/issues">
    <img src="https://img.shields.io/github/issues/angelonels/Impactify?color=orange&style=for-the-badge" alt="Issues Badge"/>
  </a>
  <a href="https://github.com/angelonels/Impactify/pulls">
    <img src="https://img.shields.io/github/issues-pr/angelonels/Impactify?color=brightgreen&style=for-the-badge" alt="Pull Requests Badge"/>
  </a>
  <a href="https://github.com/angelonels/Impactify/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/angelonels/Impactify?color=purple&style=for-the-badge" alt="Contributors Badge"/>
  </a>
<a href="https://github.com/angelonels/Impactify/commits/main">
  <img src="https://img.shields.io/github/commit-activity/m/angelonels/Impactify?color=ff69b4&style=for-the-badge" alt="Commit Activity Badge"/>
</a>

  <a href="https://github.com/angelonels/Impactify/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/angelonels/Impactify?color=blue&style=for-the-badge" alt="License Badge"/>
  </a>
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react&logoColor=white" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge"/>
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Badge"/>
  <img src="https://img.shields.io/badge/Auth-Google%20OAuth%20%7C%20JWT-FF4081?style=for-the-badge&logo=google&logoColor=white" alt="Auth Badge"/>
  <img src="https://img.shields.io/badge/Deployed%20On-Vercel%20%26%20Render-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy Badge"/>
</p>

---

<p align="center">
Impactify is a <b>full-stack AI-powered web application</b> that bridges the gap between raw data and actionable insights.  
Users can <b>upload datasets</b>, <b>clean data interactively</b>, and <b>ask questions in plain English</b> — Impactify automatically converts them into <b>SQL queries</b> and renders <b>dynamic visualizations</b> like bar, line, or pie charts instantly.
</p>

---
## 📖 **Table of Contents**

<div align="center">

| 🔹 | Section | Description |
|:--:|:---------|:-------------|
| 1️⃣ | [✨ **Overview**](#-overview) | Learn what this project is all about |
| 2️⃣ | [🚀 **Key Features**](#-key-features) | Explore the unique and powerful functionalities |
| 3️⃣ | [👤 **User Roles**](#-user-roles) | Understand the roles and permissions in the system |
| 4️⃣ | [🖥️ **Frontend Pages**](#️-frontend-pages) | See what the user interface includes |
| 5️⃣ | [🧱 **Database Schema**](#-database-schema) | Visualize the data structure and relationships |
| 6️⃣ | [🧩 **Tech Stack**](#-tech-stack) | Discover the technologies powering this project |
| 7️⃣ | [⚙️ **Workflow**](#️-workflow) | Understand how the frontend, backend, and DB interact |
| 8️⃣ | [🧑‍💻 **Our Team**](#-our-team) | Meet the developers behind the project |

</div>

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
8. **Execution** — SQL is validated and executed on the user’s private dataset.  
9. **Visualization** — Frontend dynamically renders the chart.  
10. **Dashboard Save** — Users can pin, save, and manage dashboards.

---
## ☕ Team CodeBrewers

### 🧑‍💻 Our Team
Thanks to these amazing people for contributing to **Impactify** 🔥

<p align="center">
  <a href="https://github.com/angelonels/Impactify/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=angelonels/Impactify" />
  </a>
</p>
<p align="center">
  <b>Ayush Kumar Singh</b> • <b>Angelo Nelson</b> • <b>Rohit Nair P</b> • <b>Isha Singh</b>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" />
</p>
