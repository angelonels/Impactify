# Team Execution Plan: Impactify (v2)

## 📋 Project Status Overview

- **Repo Structure**: ✅ Initialized.
- **Home Page**: ✅ Components (`Hero`, `Features`, `HowItWorks`) and `Home.jsx` are ready.
- **Backend**: ⚠️ Basic setup with Mock Auth. `datasetRoutes` mounted at `/api/dataset`.
- **Frontend Routing**: ❌ Missing. `App.jsx` currently renders Home directly.
- **Auth/Dashboard/Analysis**: ❌ Not implemented.

## 👥 Team Roles & Responsibilities

### 👤 Person 1: The Architect (Routing, Auth, & Integration)

**Goal**: Turn the static Home page into a multi-page app and handle Authentication.
**Key Tasks**:

1.  **Router Setup**: Refactor `App.jsx` to use `react-router-dom`. Keep `Home` as `/`.
2.  **Auth Pages**: Build `/login` and `/signup` with a beautiful, minimalist design (Black & White).
3.  **Auth Integration**: Connect forms to the backend (or use the mock auth flow if backend is pending).
4.  **Navigation**: Update `Navbar.jsx` to handle "Login" vs "Logout" states.

### 👤 Person 2: The Data Engineer (Dashboard & Ingestion)

**Goal**: Allow users to manage projects and upload data.
**Key Tasks**:

1.  **Dashboard (`/dashboard`)**: List user's datasets. Fetch from `/api/dataset`.
2.  **Upload (`/upload`)**: Create a drag-and-drop zone. Parse CSVs using `papaparse`.
3.  **Cleaning (`/dataset/:id/clean`)**: Interface to view raw data and fix issues (missing values, types).

### 👤 Person 3: The Analyst (Visualization & AI)

**Goal**: The core "Impactify" experience—Chat & Charts.
**Key Tasks**:

1.  **Workbench (`/dataset/:id/analyze`)**: A split-screen or chat-focused UI.
2.  **Chat Interface**: "Ask a question..." input and message history.
3.  **Visualization**: Render charts (Bar, Line, Pie) using `recharts` or `d3` based on data.

---

## 🚀 AI Prompts (Copy & Paste)

### 🟢 Prompt for Person 1 (Architect)

```text
I am **Person 1: The Architect**.
**Context**: The project has a `client` folder with a ready-made `Home.jsx` and components (`Hero`, `Features`, etc.). `App.jsx` currently renders `Home` directly.
**Design**: Minimalist Black & White.

**My Tasks**:
1.  **Install Router**: Ensure `react-router-dom` is installed.
2.  **Refactor App.jsx**:
    *   Wrap the app in `BrowserRouter`.
    *   Create Routes: `/` (Home), `/login`, `/signup`, `/dashboard` (Protected), `/upload` (Protected), `/dataset/:id/*` (Protected).
    *   Ensure the `LiquidEther` background persists across pages.
3.  **Implement Auth Pages**:
    *   Create `src/pages/Login.jsx` and `Signup.jsx`.
    *   Design: Centered white card on the animated background. Simple black inputs, black "Sign In" button.
    *   Logic: For now, mock the login to set a user in `localStorage` (since backend has mock auth).
4.  **Update Navbar**:
    *   If logged in -> Show "Dashboard" & "Logout".
    *   If logged out -> Show "Login" & "Get Started".

**Execute**: Start by refactoring `App.jsx` to add Routing, then build the Login/Signup pages.
```

### 🔵 Prompt for Person 2 (Data Engineer)

```text
I am **Person 2: The Data Engineer**.
**Context**: Person 1 is handling the Router and Auth. I need to build the "Data" pages.
**Design**: Minimalist Black & White. Clean tables.

**My Tasks**:
1.  **Dashboard (`src/pages/Dashboard.jsx`)**:
    *   Fetch datasets from `GET /api/dataset` (mock response if needed).
    *   Display as a grid of simple cards: "Dataset Name", "Date", "Status".
    *   "New Project" button redirects to `/upload`.
2.  **Upload (`src/pages/Upload.jsx`)**:
    *   UI: Large dashed border dropzone. Text: "Drop CSV here".
    *   Logic: Use `papaparse` to parse the file client-side.
    *   On success, POST to `/api/dataset/upload` (or mock it) and redirect to `/clean`.
3.  **Cleaning (`src/pages/DataCleaning.jsx`)**:
    *   Route: `/dataset/:id/clean`.
    *   UI: A simple table showing the first 50 rows of data.
    *   Header: Show "Data Health" (e.g., "3 columns with missing values").

**Execute**: Create these three pages. Assume `Navbar` and `Layout` are provided by Person 1.
```

### 🟣 Prompt for Person 3 (Analyst)

```text
I am **Person 3: The Analyst**.
**Context**: The core value of the app. I need to build the Analysis Workbench.
**Design**: Chat-centric, high-tech but minimal.

**My Tasks**:
1.  **Workbench (`src/pages/Workbench.jsx`)**:
    *   Route: `/dataset/:id/analyze`.
    *   Layout: Chat bar at the bottom, Visualization area in the center/top.
2.  **Chat UI**:
    *   Input: "Ask a question about your data..." (Black border, rounded).
    *   History: User (Right, Black bubble), AI (Left, Gray bubble).
3.  **Visualization**:
    *   Install `recharts` (or use D3).
    *   Create a `ChartRenderer` component that takes `{ type: 'bar', data: [...] }` and renders the chart.
    *   Mock the AI response for now: If user types "Show sales", render a mock Bar Chart.

**Execute**: Build the `Workbench` page and the `ChartRenderer` component.
```

---

## 🌿 Git Workflow

1.  **Person 1**: Work on `feature/router-auth`.
2.  **Person 2**: Work on `feature/dashboard-upload`.
3.  **Person 3**: Work on `feature/analysis`.
4.  **Merge**: Person 1 merges first to set up the Router. Then Person 2 and 3 merge their pages.
