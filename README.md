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
  <img src="https://img.shields.io/badge/Deployed%20On-Vercel%20%26%20Render-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy Badge"/>
</p>

---

<p align="center">
Impactify is a <b>full-stack AI-powered web application</b> that bridges the gap between raw data and actionable insights.  
Users can <b>upload datasets</b> and <b>ask questions in plain English</b> — Impactify automatically converts them into <b>SQL queries</b> and renders <b>dynamic visualizations</b> like bar, line, or pie charts instantly. No login required!
</p>

---

## 📖 **Table of Contents**

<div align="center">

| 🔹  | Section                                               | Description                                     |
| :-: | :---------------------------------------------------- | :---------------------------------------------- |
| 1️⃣  | [✨ **Overview**](#-overview)                         | Learn what this project is all about            |
| 2️⃣  | [🚀 **Key Features**](#-key-features)                 | Explore the unique and powerful functionalities |
| 3️⃣  | [🧩 **Tech Stack**](#-tech-stack)                     | Discover the technologies powering this project |
| 4️⃣  | [�️ **Installation & Setup**](#️-installation--setup) | How to run the project locally                  |
| 5️⃣  | [💡 **Usage Guide**](#-usage-guide)                   | Step-by-step guide to using the app             |
| 6️⃣  | [🧑‍💻 **Our Team**](#-our-team)                         | Meet the developers behind the project          |

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

### 1. 🧾 Seamless File Ingestion

- **Drag & Drop Upload:** Easily upload CSV files.
- **Automatic Schema Detection:** The system automatically detects columns and data types.
- **Robust Error Handling:** Automatically fixes common CSV issues like conflicting IDs.

### 2. 💬 Natural Language → SQL

- **AI-Powered:** Uses Google Gemini to translate plain English into optimized SQL queries.
- **Example:** _“Show me the top 10 customers by sales last quarter as a bar chart.”_
- **Secure:** Queries are generated and executed safely on your private dataset table.

### 3. 📊 AI-Driven Visualization Workbench

- **Dynamic Charts:** Automatically selects the best chart type (Bar, Line, Pie) based on your data.
- **Interactive:** Hover over data points for details.
- **Table View:** View raw data in a clean, paginated table.
- **SQL Transparency:** View the generated SQL query for verification.

### 4. 🔓 Frictionless Access

- **No Login Required:** Start analyzing immediately as a guest.
- **Privacy Focused:** Your data is isolated and secure.

---

## 🧩 Tech Stack

| Layer          | Technologies                                                    |
| -------------- | --------------------------------------------------------------- |
| **Frontend**   | React, Tailwind CSS, Framer Motion, Recharts/Nivo, React Router |
| **Backend**    | Node.js, Express, Prisma ORM                                    |
| **AI / LLM**   | Google Gemini API (Schema-Aware Prompting)                      |
| **Database**   | PostgreSQL                                                      |
| **Deployment** | Vercel (Frontend), Render (Backend), Neon.tech (DB)             |

---

## 🛠️ Installation & Setup

Follow these steps to run Impactify on your local machine.

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/angelonels/Impactify.git
cd Impactify
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/impactify"
GEMINI_API_KEY="your_google_gemini_api_key"
FRONTEND_URL="http://localhost:5173"
```

Run Database Migrations:

```bash
npx prisma migrate dev --name init
```

Start the Server:

```bash
npm run dev
```

### 3. Setup Frontend

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory:

```env
VITE_API_URL="http://localhost:5000"
```

Start the Client:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser!

---

## 💡 Usage Guide

1.  **Upload Data:** Go to the Upload page and drag & drop your CSV file.
2.  **Analyze:** You will be redirected to the Workbench.
3.  **Ask Questions:** Type questions like:
    - "Show me a pie chart of sales by category"
    - "Plot the monthly revenue as a line chart"
    - "List the top 5 products"
4.  **View Results:** See the AI-generated charts and insights instantly.

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
