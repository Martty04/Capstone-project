const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SafeReach API is running"
    });
});


// Authentication routes
app.use("/api/auth", authRoutes);

// Reports
app.use("/api/reports", reportRoutes);


module.exports = app;