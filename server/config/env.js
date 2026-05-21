require("dotenv").config();

const REQUIRED = [
    "DATABASE_URL",
    "JWT_SECRET",
    "FRONTEND_URL",
];

const RECOMMENDED = [
    "GEMINI_API_KEY",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
];

function validateEnv() {
    const missing = REQUIRED.filter((k) => !process.env[k]);
    if (missing.length) {
        throw new Error(
            `Boot aborted — missing required env vars: ${missing.join(", ")}`
        );
    }

    const weak = RECOMMENDED.filter((k) => !process.env[k]);
    if (weak.length) {
        console.warn(
            `[env] Missing recommended env vars (some features will fail): ${weak.join(", ")}`
        );
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 24) {
        console.warn("[env] JWT_SECRET is shorter than 24 chars — use a longer secret in production.");
    }
}

module.exports = { validateEnv };
