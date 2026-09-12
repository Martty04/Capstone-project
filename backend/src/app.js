const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();


// ==========================================
// CORS
// ==========================================

app.use(cors({
    origin: "https://capstone-project-yg3e.vercel.app",
    credentials: true
}));


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SafeReach API is running"
    });
});


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.use("/api/auth", authRoutes);


// ==========================================
// REPORT ROUTES
// ==========================================

app.use("/api/reports", reportRoutes);


// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// ==========================================
// EXPORT APP
// ==========================================

module.exports = app;