// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();

/* ────────────── GLOBAL MIDDLEWARES ────────────── */

// CORS – must be BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

/* ────────────── ROUTES ────────────── */

app.use("/api/auth", require("./modules/auth/routes"));
app.use("/api/products", require("./modules/product/routes"));
app.use("/api/certificates", require("./modules/certificate/routes"));

// Public verification (no auth)
app.use("/api/verify", require("./modules/verification/routes"));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


/* ────────────── HEALTH CHECK ────────────── */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Certificate Verification Backend",
    timestamp: new Date().toISOString(),
  });
});

/* ────────────── GLOBAL ERROR HANDLER ────────────── */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
