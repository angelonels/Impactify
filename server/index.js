const { validateEnv } = require("./config/env");
validateEnv();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const datasetRoutes = require("./routes/datasetRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const dashboardsRoutes = require("./routes/dashboardsRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = (process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
    : ["https://impactify-alpha.vercel.app", "http://localhost:5173"]);

app.set("trust proxy", 1);

app.use(helmet());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(passport.initialize());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many auth attempts. Try again later." },
});

const analyzeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many analyze requests. Slow down." },
});

app.get("/healthz", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => res.send("Impactify Backend Running"));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/dataset/analyze", analyzeLimiter);
app.use("/api/dataset", datasetRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/dashboards", dashboardsRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
