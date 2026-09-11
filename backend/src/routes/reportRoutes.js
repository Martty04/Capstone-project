const express = require("express");

const {
    createReport,
    getMyReports,
    getReport,
    updateReport,
    deleteReport
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// All report routes require authentication
router.use(protect);


// Create report
router.post("/", createReport);


// Get logged-in user's reports
router.get("/", getMyReports);


// Get one report
router.get("/:id", getReport);


// Update report
router.put("/:id", updateReport);


// Delete report
router.delete("/:id", deleteReport);


module.exports = router;