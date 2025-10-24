# **Project Title & Overview**

**Project Title:** Impactify \- Your AI-Powered Data Analyst

Overview:  
Impactify is a full-stack web application designed to bridge the gap between raw data and clear, actionable insights. Its core mission is to empower users to become data analysts. Users can upload their datasets, guide the system through an intelligent data cleaning process, and then—most importantly—ask questions in plain English. Impactify's AI engine will translate these natural language queries into the necessary SQL, retrieve the data, and present the answer as the requested interactive visualization. This project focuses on removing technical barriers, such as learning SQL, to make data-driven decisions accessible to a wider audience.

# **Key Features / Modules**

1. **File Ingestion:**  
   * **In-Browser Parsing:** To ensure a smooth upload experience, the application will parse text-based files (like CSV) directly in the browser, chunk by chunk, using a library like Papa Parse.  
   * **Streaming API:** The frontend will then send these manageable JSON chunks to the backend, allowing for reliable data ingestion.  
2. **Automated Data Profiling:**  
   * After the data is staged, the backend will automatically profile it.  
   * **Data Report Card:** This process generates a summary for the user, noting things like columns with missing values, inferred data types, or potential text inconsistencies (e.g., "USA" vs. "U.S.A.").  
3. **Interactive Data Cleaning:**  
   * A user-friendly interface that presents the "Data Report Card."  
   * **Simple Fixes:** Users will be provided with simple tools to:  
     * Fill missing values (e.g., with the average, median, or a custom value).  
     * Group and merge inconsistent text entries.  
     * Correct data types that the profiler may have inferred incorrectly.  
4. **Natural Language to SQL :**  
   * **The Query Bar:** The primary interface for visualization will be a simple text bar.  
   * **AI Translation:** A user can type, "Show me the top 10 customers by sales last quarter as a bar chart." The backend will securely combine this query with the schema of the user's dataset and send it to an LLM (e.g., Gemini). This schema-aware prompting ensures the AI understands the data structure.  
   * **Intelligent Response:** The LLM will return a JSON object containing the validated SQL query and the requested chart type (e.g., {"sql": "SELECT ...", "chartType": "bar"}).  
   * **Secure Execution:** The backend will validate this SQL to prevent unauthorized actions and then execute it against the user's database.  
5. **AI-Driven Visualization Workbench:**  
   * **Dynamic Rendering:** The frontend will be able to take the data from the AI-generated query and instantly render the correct chart (Bar, Line, Pie, etc.) using D3.js.

# **User Roles**

1. **Admin:**  
   * **Permissions:** System-level administrator. Can manage user accounts (e.g., delete users, reset passwords), view system-wide usage statistics, and manage public gallery content (if the Guest feature is implemented).  
   * **Data Access:** Read-only access to system metadata. **No access** to private user-uploaded data to ensure user privacy.  
2. **Registered User:**  
   * **Permissions:** The core user. They can upload, profile, clean, and manage their own private datasets. They can perform AI-driven queries and view visualizations.  
   * **Data Access:** Full and exclusive read, write, and delete access to their *own* data.  
3. **Guest:**  
   * **Permissions:** Could be allowed to browse a public "gallery" of interesting datasets or analyses that other users have chosen to share.  
   * **Data Access:** Read-only.

# **Page / Screen List (Frontend)**

* /login & /signup (Authentication pages)  
* /admin/dashboard (Admin Panel: User management, system stats)  
* /dashboard (Dashboard Home): The main hub, listing the user's "Data Projects."  
* /upload (Data Upload Page): The interface for file selection to begin the ingestion process.  
* /dataset/{id}/clean (Data Cleaning Page): The interactive interface for data preprocessing.  
* /dataset/{id}/analyze (The "Impact" Workbench): The main analysis page, featuring the natural language query bar and the visualization canvas.  
* /profile (User Profile Page): For managing account details.

# **Database Schema**

This schema separates application metadata from the user's ingested data, which is crucial for security and organization.

### **App Metadata (PostgreSQL)**

**User**

* id (UUID, Primary Key)  
* email (String, Unique, Indexed)  
* password\_hash (String, Nullable)  
* created\_at (Timestamp)  
* role (Enum: ADMIN, USER)  
* auth\_provider (Enum: EMAIL, GOOGLE, Default: EMAIL)  
* google\_id (String, Nullable, Unique)

**Dataset**

* id (UUID, Primary Key)  
* user\_id (UUID, Foreign Key to User.id)  
* dataset\_name (String)  
* status (Enum: uploading, profiling, cleaning, ready, error)  
* data\_table\_name (String): The unique, private table created for their data (e.g., data\_user\_abc\_dataset\_xyz).

**Dataset\_Schema (Critical for AI)**

* id (UUID, Primary Key)  
* dataset\_id (UUID, Foreign Key to Dataset.id)  
* column\_name (String)  
* data\_type (String, e.g., "FLOAT", "TEXT", "TIMESTAMP")  
* description (Text, Nullable): A hint for the AI (e.g., "Main sales column").

# **Tech Stack**

* **Frontend:**  
  * **Framework:** React  
  * **Data Visualization:** D3.js (for rendering)  
  * **State Management:** Zustand  
  * **File Parsing:** Papa Parse  
  * **UI/Layout:** CSS/Tailwind CSS  
* **Backend:**  
  * **Framework:** Node.js with **Express**  
  * **AI / LLM:** **Google Gemini API** (for natural language-to-SQL)  
  * **Authentication:** JWT (JSON Web Tokens), **Google OAuth 2.0**  
* **Database:**  
  * **Primary DB:** PostgreSQL

# **Workflow**

1. **Login/Upload:** A user signs up or logs in (using email/password or Google OAuth) and uploads a CSV file.  
2. **Parse & Stream:** The browser parses the file chunk by chunk (via Papa Parse) and streams the JSON to the backend.  
3. **Stage & Profile:** The backend saves the data to a staging\_table and begins profiling it. This job profiles the data and saves the findings (column types, etc.) into the Dataset\_Schema table. The Dataset status is set to cleaning.  
4. **Cleaning:** The user is directed to the /clean page, where they see the profiler's report and can use tools to clean the data.  
5. **Commit:** When finished, the backend cleans the staging\_table based on the user's choices, creates the permanent data\_... table, and applies necessary indexes. The Dataset status is set to ready.  
6. **Analyze:** The user proceeds to the /analyze workbench.  
7. **Ask in English:** The user types: "What was our total revenue by month for last year? Make it a line chart."  
8. **AI Translation:** The backend takes this query, retrieves the schema from the Dataset\_Schema table, and builds a prompt for the Gemini LLM.  
9. **AI Response:** The LLM returns {"sql": "SELECT ...", "chartType": "line"}.  
10. **Execute & Send:** The backend validates the SQL, runs it against the user's private data\_... table, and sends the resulting data and chartType to the frontend.  
11. **Render:** The frontend receives the payload and dynamically renders a \<LineChart\> component (using React \+ D3).

# **Expected Outcomes**

* A functional and scalable web application that provides a seamless, end-to-end experience for users, from data upload to final visualization.  
* A genuinely useful tool that empowers non-technical users to query their data and gain insights simply by asking questions in plain English.  
* A clear demonstration of how AI can be securely and effectively integrated into an application to automate complex tasks, like data analysis and SQL generation.