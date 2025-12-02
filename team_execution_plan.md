# Team Execution Plan: Impactify (v3)

## 🎨 Design System & Consistency

**"Minimalist, Human, & Alive"**

- **Reference**: The existing Home Page (`Home.jsx`, `Hero.jsx`, `Features.jsx`).
- **Core Theme**:
  - **Background**: White (`#FFFFFF`) or very light gray (`#F9FAFB`).
  - **Accents**: Black (`#000000`) for buttons, borders, and primary text.
  - **Typography**: Inter/System fonts. Large, bold headings.
  - **Motion**: `framer-motion` for smooth entry (fade-up) and hover effects (scale/lift).
  - **Components**: Use the same button styles (`btn-primary`, `btn-secondary`) and card styles (`feature-card`) as seen in `Hero.jsx` and `Features.jsx`.

---

## 👥 Team Roles & Task Division

### 👤 Person 1: The Frontend Lead (Home & Layout)

**Status**: _Mostly Complete_ (Home page components exist).
**Responsibility**:

- **Home Page**: Ensure `Home.jsx` is perfect.
- **Global Layout**: `Navbar.jsx` and `Footer.jsx`.
- **Routing Setup**: Wrap the app in `BrowserRouter` and define the `Routes`.
- **Deliverable**: A working landing page with navigation that links to (currently empty) routes for Login and Dashboard.

### 👤 Person 3: The Auth Specialist (Login & Signup)

**Responsibility**:

- **Independent Task**: Build the Authentication pages.
- **Pages**: `/login`, `/signup`.
- **Design**: Match the Home page aesthetic (Minimalist cards).
- **Deliverable**: Two beautiful pages that mock-login the user and redirect to `/dashboard`.

### 👤 Person 2: The Core Developer (YOU - Major Workload)

**Responsibility**:

- **The "App"**: Everything after login.
- **Dashboard**: `/dashboard` (List projects).
- **Upload**: `/upload` (Drag & drop CSV).
- **Cleaning**: `/dataset/:id/clean` (Table view & fixes).
- **Analysis**: `/dataset/:id/analyze` (Chat & Charts).
- **Deliverable**: The entire functional application flow.

---

## 🤖 Global AI Instructions (For Everyone)

> **System Instruction**: You are building "Impactify".
>
> 1.  **Context**: The `client/src/components` folder already contains `Hero.jsx`, `Features.jsx`, etc. Use them as design references.
> 2.  **Style**: Strict Black & White. Use `framer-motion` for animations.
> 3.  **Routing**: Use `react-router-dom`.
> 4.  **State**: Use `zustand` for global state (user, datasets).

---

## 📋 Page-Specific Implementation Prompts

### 1. Navbar & Routing (Person 1)

**Prompt:**

> "Refactor `App.jsx` and `Navbar.jsx`.
> **Context**: `Home.jsx` exists.
> **Task**:
>
> 1.  **Router**: Wrap `App` in `BrowserRouter`. Define routes: `/`, `/login`, `/signup`, `/dashboard`, `/upload`, `/dataset/:id/clean`, `/dataset/:id/analyze`.
> 2.  **Navbar**: Update `Navbar.jsx`.
>     _ **Left**: Logo (Text 'IMPACTIFY' in bold black).
>     _ **Right**:
>     _ If `!user`: Links to 'Features', 'How it Works', 'Login' (Text), 'Get Started' (Black Button).
>     _ If `user`: Links to 'Dashboard', 'New Project' (Black Button), 'Profile' (Icon). \* **Mobile**: Simple hamburger menu.
>     **Design**: Sticky top, glassmorphism effect (white with blur)."

### 2. Login & Signup (Person 3)

**Prompt:**

> "Create `src/pages/Login.jsx` and `src/pages/Signup.jsx`.
> **Design**:
>
> - **Layout**: Centered card on a dynamic background (reuse `LiquidEther` if possible, or a soft gradient).
> - **Card**: White background, thin black border, subtle shadow.
> - **Inputs**: Minimalist. Label in small gray caps. Input has bottom border only, animating to black on focus.
> - **Button**: Full-width black button 'Sign In'. Hover: Scale 1.02.
> - **Social**: 'Continue with Google' button (White, black border, Google icon).
>   **Logic**:
> - On submit, call a mock function `login()` that sets a dummy user in localStorage and redirects to `/dashboard`."

### 3. Dashboard (Person 2)

**Prompt:**

> "Create `src/pages/Dashboard.jsx`.
> **Design**:
>
> - **Header**: 'Your Projects' (Large Bold). 'New Project' button (Right aligned).
> - **Grid**: 3-column grid of Project Cards.
> - **Card**:
>   _ **Visual**: White card, thin gray border. Hover: Border turns black, card lifts.
>   _ **Content**: Project Name (Bold), Date (Gray), Status Badge (Pill shape: 'Ready', 'Processing'). \* **Action**: Clicking a card goes to `/dataset/:id/analyze`.
>   **Data**: Fetch from `GET /api/dataset`. If empty, show a 'Create your first project' empty state with an illustration."

### 4. Upload Page (Person 2)

**Prompt:**

> "Create `src/pages/Upload.jsx`.
> **Design**:
>
> - **Layout**: Centered, distraction-free.
> - **Dropzone**: Large rectangular area (60% width). Dashed black border.
> - **Animation**: When dragging file, border becomes solid and background turns very light gray.
> - **Content**: Icon (UploadCloud), Text 'Drag & drop your CSV', Subtext 'or click to browse'.
>   **Logic**:
> - Use `papaparse` to parse the file on client-side.
> - Show a minimalist progress bar (thin black line).
> - On success, show a 'Checkmark' animation and redirect to `/dataset/:id/clean`."

### 5. Data Cleaning (Person 2)

**Prompt:**

> "Create `src/pages/DataCleaning.jsx`.
> **Route**: `/dataset/:id/clean`.
> **Design**:
>
> - **Top Bar**: 'Data Health Report'. Stats: 'Rows: 1000', 'Missing: 5', 'Types: Mixed'.
> - **Table**:
>   _ Clean HTML table.
>   _ Headers: Sticky, Black background, White text.
>   _ Rows: White, hover turns light gray.
>   _ Cells: Monospace font for numbers. \* **Sidebar/Panel**: 'Cleaning Actions'. Buttons like 'Fill Missing (Mean)', 'Drop Empty Rows'.
>   **Logic**:
> - Display the parsed data.
> - Allow applying simple transformations (update local state)."

### 6. Analysis Workbench (Person 2)

**Prompt:**

> "Create `src/pages/Workbench.jsx`.
> **Route**: `/dataset/:id/analyze`.
> **Design**: 'Chat-First' Analytics.
>
> - **Layout**:
>   - **Left (or Bottom)**: Chat Interface.
>   - **Right (or Top)**: Visualization Canvas (Large).
> - **Chat**:
>   - Input: 'Ask a question...' (Rounded black border).
>   - Messages: Minimal bubbles. User (Black), AI (Gray).
> - **Canvas**:
>   _ Empty State: 'Ask a question to generate a chart'.
>   _ Chart: Use `recharts`. Render responsive charts inside a clean white container with a shadow.
>   **Logic**:
> - Mock the AI: If user types 'Show sales', render a mock Bar Chart."

---

## 🚀 Start Your Shift: Copy-Paste Prompts

### 🟢 Prompt for Person 1 (Frontend Lead)

```text
I am **Person 1: The Frontend Lead**.
My goal is to finalize the **Home Page** and set up the **Global Routing**.

1.  **Context**: The `client` folder has `Home.jsx` and components. `App.jsx` renders Home directly.
2.  **Task**:
    *   Install `react-router-dom`.
    *   Refactor `App.jsx` to use `BrowserRouter` and `Routes`.
    *   Create placeholder pages for: Login, Signup, Dashboard, Upload, Clean, Analyze.
    *   Update `Navbar.jsx` to link to these routes based on a mock `isLoggedIn` state.
3.  **Git**: Create branch `feature/setup-routing`.

**Execute**: Set up the routing architecture so Person 2 and 3 can plug in their pages.
```

### 🟣 Prompt for Person 3 (Auth Specialist)

```text
I am **Person 3: The Auth Specialist**.
My goal is to build the **Login** and **Signup** pages.

1.  **Context**: Person 1 has set up the Router. I need to build the pages at `/login` and `/signup`.
2.  **Task**:
    *   Create `src/pages/Login.jsx` and `Signup.jsx`.
    *   **Design**: Minimalist Black & White cards. Match the style of `Hero.jsx`.
    *   **Logic**: Create a mock login flow that redirects to `/dashboard`.
3.  **Git**: Create branch `feature/auth-pages`.

**Execute**: Build these two pages. Make them look premium and smooth.
```

### 🔵 Prompt for Person 2 (YOU - Core Developer)

```text
I am **Person 2: The Core Developer**.
My goal is to build the **Core Application** (Dashboard, Upload, Clean, Analyze).

1.  **Context**: Person 1 handles Routing, Person 3 handles Auth. I own the actual product features.
2.  **Task**:
    *   **Dashboard**: Fetch and list datasets.
    *   **Upload**: Drag & drop CSV parsing.
    *   **Clean**: Table view for data inspection.
    *   **Analyze**: Chat interface + Chart rendering.
3.  **Git**: Create branch `feature/core-app`.

**Execute**: Start with the **Dashboard** and **Upload** pages first. Use `papaparse` for the upload logic.
```

---

## 🌿 Git Workflow (Strict)

1.  **Person 1** pushes `feature/setup-routing` **FIRST**.
2.  **Person 2 & 3** pull `main` to get the router setup.
3.  **Person 2** works on `feature/core-app`.
4.  **Person 3** works on `feature/auth-pages`.
5.  **Merge**: Person 3 merges Auth. Person 2 merges Core.
