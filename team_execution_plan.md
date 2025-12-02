# Team Execution Plan: Impactify

## 🎨 Design Philosophy

**"Minimalist, Human, & Alive"**

- **Color Palette**: Strictly Black (`#000000`), White (`#FFFFFF`), and Grays (`#F3F4F6` to `#1F2937`). No vibrant colors except for critical alerts or specific data visualization elements where necessary.
- **Typography**: Clean sans-serif (Inter or system fonts). Large, bold headings. Readable body text.
- **Interactions**:
  - **Hover**: Subtle scale up (`scale-105`), border darkening, or background shifts (white to light gray) on interactive elements.
  - **Transitions**: Smooth `transition-all duration-300 ease-in-out`.
  - **Animations**: Fade-ins on page load, slide-ups for modals.
- **Code Style**:
  - **Human-Readable**: Use clear variable names (`isUploading` vs `flag`). Avoid overly complex one-liners.
  - **Simple**: Prefer standard CSS/Tailwind over complex animation libraries unless needed.
  - **Functional**: Components should be small and focused.

---

## 🤖 Global AI Instructions

_Copy and paste this into your AI agent context before starting any task._

> **System Instruction**: You are building "Impactify", a minimalist data analysis platform.
>
> 1.  **Design**: Use a strict Black & White theme. Use Tailwind CSS. Buttons should be black with white text (or vice versa) with smooth hover effects.
> 2.  **Code Style**: Write simple, clean, and readable React code. Avoid over-engineering. Use functional components with hooks.
> 3.  **Animation**: Add `framer-motion` or CSS transitions for smooth entry and hover states. Every clickable element must have a visual feedback on hover.
> 4.  **Responsiveness**: Ensure layouts work on mobile and desktop.

---

## 📋 Page-Specific Implementation Prompts

### 1. Landing Page (`/`)

**Prompt for AI:**

> "Create a Landing Page for Impactify.
> **Design**: Minimalist. Hero section with a large, bold black headline on white background: 'Data Analysis. Simplified.' Subtext in gray.
> **Features**:
>
> 1.  **Hero**: Centered text, 'Get Started' button (Black background, white text, scales up on hover).
> 2.  **Features Grid**: 3x1 grid showing 'Upload', 'Clean', 'Visualize'. Use simple Lucide-React icons (black). Cards should lift slightly with a shadow on hover.
> 3.  **Footer**: Simple minimalist footer.
>     **Tech**: React, Tailwind, Framer Motion for fade-in effects on scroll."

### 2. Authentication (`/login`, `/signup`)

**Prompt for AI:**

> "Create Login and Signup pages.
> **Design**: Centered card layout. White card with subtle gray border on a very light gray background.
> **Components**:
>
> 1.  **Input Fields**: Minimalist borders (bottom border only or thin full border). Focus state turns border black.
> 2.  **Buttons**: 'Sign In' (Black block button). 'Sign in with Google' (White button, black border).
> 3.  **Transitions**: Smooth switch between Login and Signup modes if on the same component, or smooth page transition."

### 3. Dashboard (`/dashboard`)

**Prompt for AI:**

> "Create the User Dashboard.
> **Design**: Sidebar layout (Left sidebar: Black, Main content: White).
> **Sidebar**: Navigation links (Dashboard, Profile, Settings). Active link is White text, inactive is Gray.
> **Main Content**:
>
> 1.  **Header**: 'Welcome back, [Name]'.
> 2.  **Project Grid**: Display user's datasets as simple cards.
>     - **Card**: White background, thin black border.
>     - **Content**: Dataset Name (Bold), Date (Gray), Status badge (Small pill shape, B&W).
>     - **Hover**: Card border gets thicker, slight shadow.
> 3.  **New Project**: A card with a dashed border and a '+' icon that turns solid black on hover."

### 4. Upload Page (`/upload`)

**Prompt for AI:**

> "Create the File Upload Interface.
> **Design**: Clean, distraction-free center focus.
> **Components**:
>
> 1.  **Dropzone**: Large area with dashed black border. Text: 'Drag & drop your CSV here'.
> 2.  **Interaction**: When dragging a file over, background turns light gray.
> 3.  **Progress**: Minimalist progress bar (thin black line filling up).
> 4.  **Success**: smooth transition to a 'Checkmark' icon and a 'Proceed to Cleaning' button."

### 5. Data Cleaning (`/dataset/:id/clean`)

**Prompt for AI:**

> "Create the Data Cleaning Interface.
> **Design**: Split view or Table view.
> **Components**:
>
> 1.  **Data Report**: Top section summarizing issues (e.g., '3 Missing Values'). Use simple text counters.
> 2.  **Data Table**: Clean HTML table. Headers are black with white text. Rows alternate white/very light gray.
> 3.  **Actions**: Hovering over a column header shows a menu (three dots) to 'Rename', 'Fill Missing', 'Delete'.
> 4.  **Feedback**: When an action is taken (e.g., filling values), flash the changed cells briefly to indicate success."

### 6. Analysis Workbench (`/dataset/:id/analyze`)

**Prompt for AI:**

> "Create the Analysis Workbench.
> **Design**: Chat-centric interface.
> **Components**:
>
> 1.  **Chat Bar**: Fixed at the bottom. Clean input field with a 'Send' arrow button.
> 2.  **Message History**: User messages right-aligned (Black bubble, white text). AI messages left-aligned (Gray bubble, black text).
> 3.  **Chart Area**: Large central canvas.
>     - **Charts**: Use D3.js or Recharts. Style charts to match the theme (Monochrome bars/lines unless color is needed for data distinction).
>     - **Loading**: Minimalist pulsing dots animation while generating SQL."

---

## 👥 Team Task Division (3 Members)

### 👤 Person 1: The Architect (Core & Auth)

**Focus**: Project Setup, Routing, Authentication, Landing Page.
**Tasks**:

1.  Initialize the Vite project and install dependencies (Tailwind, Zustand, React Router).
2.  Set up the global layout (Navbar, Footer) and Routing structure.
3.  Implement **Landing Page** (Prompt #1).
4.  Implement **Login/Signup** pages and Auth Logic (Prompt #2).
5.  **Deliverable**: A working website where users can visit home, sign up, and log in to see an empty dashboard.

### 👤 Person 2: The Data Engineer (Ingestion & Cleaning)

**Focus**: Dashboard, File Upload, Data Processing.
**Tasks**:

1.  Implement the **Dashboard** UI (Prompt #3).
2.  Implement **Upload Page** with Papa Parse logic (Prompt #4).
3.  Implement **Data Cleaning** interface (Prompt #5).
4.  **Deliverable**: Users can log in, see their dashboard, upload a CSV, and clean the data.

### 👤 Person 3: The Analyst (Visualization & AI)

**Focus**: Analysis Workbench, Charts, AI Integration.
**Tasks**:

1.  Set up the D3.js / Recharts visualization components.
2.  Implement the **Analysis Workbench** chat interface (Prompt #6).
3.  Connect the Chat UI to the Mock/Real Backend for SQL generation.
4.  Render charts based on data.
5.  **Deliverable**: Users can go to a dataset and ask questions to generate charts.

---

## 🌿 Git Workflow & Branching Strategy

To ensure no conflicts, follow this strict workflow:

### 1. Setup (Person 1 starts)

- Create the repo.
- Push the initial `main` branch with the basic Vite + Tailwind setup.
- Add `Person 2` and `Person 3` as collaborators.

### 2. Branching Rules

**NEVER push directly to `main`.**
Each person works in their own "Feature Branch":

- **Person 1**: `feature/core-auth`
- **Person 2**: `feature/data-ingestion`
- **Person 3**: `feature/visualization`

### 3. Daily Workflow

1.  **Pull Latest Main**: Before starting work, run `git checkout main` and `git pull`.
2.  **Merge into Feature**: Go to your branch (`git checkout feature/...`) and run `git merge main`. This keeps your branch up to date.
3.  **Code & Commit**: Do your work. Commit often with clear messages (e.g., "feat: add login page").
4.  **Push**: `git push origin feature/...`

### 4. Merging (The "Pull Request")

When a feature is ready (e.g., Person 1 finishes Auth):

1.  Go to GitHub.
2.  Create a **Pull Request (PR)** from `feature/core-auth` to `main`.
3.  **Review**: Another team member should quickly check the code.
4.  **Merge**: Click "Squash and Merge".
5.  **Sync**: Everyone else runs `git checkout main` && `git pull` to get the new changes.

### 🛑 Conflict Prevention

- **Person 1** touches `App.jsx` (Routes) and `pages/Auth`.
- **Person 2** touches `pages/Dashboard` and `pages/Upload`.
- **Person 3** touches `pages/Analyze`.
- **Common Files**: If you need to change a common file (like `tailwind.config.js`), communicate in your group chat before doing it!

---

## 🚀 Start Your Shift: Copy-Paste Prompts

Each member should copy the prompt below and paste it into their Antigravity chat to start working.

### 🟢 Prompt for Person 1 (Architect)

```text
I am acting as "Person 1: The Architect" from the `team_execution_plan.md`.

Please read the `team_execution_plan.md` file in the artifacts directory.
My goal is to execute ONLY the tasks assigned to Person 1.

1.  **Setup**: Initialize the project (if not done), install dependencies (Tailwind, Zustand, Router), and create the folder structure.
2.  **Branch**: Create/Checkout branch `feature/core-auth`.
3.  **Implement**:
    *   Global Layout (Navbar/Footer).
    *   **Landing Page** (Use "Prompt #1" from the plan).
    *   **Login/Signup Pages** (Use "Prompt #2" from the plan).

Follow the "Design Philosophy" strictly (Minimalist, B&W). Do NOT implement Dashboard or Analysis pages.
```

### 🔵 Prompt for Person 2 (Data Engineer)

```text
I am acting as "Person 2: The Data Engineer" from the `team_execution_plan.md`.

Please read the `team_execution_plan.md` file in the artifacts directory.
My goal is to execute ONLY the tasks assigned to Person 2.

1.  **Branch**: Create/Checkout branch `feature/data-ingestion`.
2.  **Implement**:
    *   **Dashboard UI** (Use "Prompt #3" from the plan).
    *   **Upload Page** (Use "Prompt #4" from the plan).
    *   **Data Cleaning Interface** (Use "Prompt #5" from the plan).

Follow the "Design Philosophy" strictly. Assume Person 1 has set up the Layout/Router. If files are missing, create placeholders but focus on my specific pages.
```

### 🟣 Prompt for Person 3 (Analyst)

```text
I am acting as "Person 3: The Analyst" from the `team_execution_plan.md`.

Please read the `team_execution_plan.md` file in the artifacts directory.
My goal is to execute ONLY the tasks assigned to Person 3.

1.  **Branch**: Create/Checkout branch `feature/visualization`.
2.  **Implement**:
    *   **Analysis Workbench** (Use "Prompt #6" from the plan).
    *   Setup D3.js/Recharts components.
    *   Connect the Chat UI to a mock backend for now.

Follow the "Design Philosophy" strictly. Focus on the `/dataset/:id/analyze` route.
```
