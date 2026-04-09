const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorMiddleware, notFoundMiddleware } = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const lettreRoutes = require("./routes/lettreRoutes");
const profilRoutes = require("./routes/profilRoutes");

const app = express();

// --- الأمن والأداء ---
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- محدد الطلبات (Rate Limiting) ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Trop de requêtes, réessayez plus tard" }
});
app.use("/api", limiter);

// --- قراءة البيانات ---
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// --- الطرق (Routes) ---
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Bienvenue sur l'API de Génération de Lettres de Motivation AI",
    version: "1.0.0",
    healthCheck: "/health",
    documentation: "/api-docs" // Si vous en rajoutez une plus tard
  });
});

app.get("/health", (req, res) => {
  res.json({ success: true, message: "API is healthy", timestamp: new Date() });
});

app.use("/api/auth", authRoutes);
app.use("/api/lettres", lettreRoutes);
app.use("/api/profils", profilRoutes);

// --- Error handling ---
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
