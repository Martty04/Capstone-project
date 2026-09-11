const Report = require("../models/Report");


// ======================================
// CREATE REPORT
// ======================================
const createReport = async (req, res) => {
    try {

        const {
            category,
            fireType,
            description,
            location,
            latitude,
            longitude,
            severity
        } = req.body;


        // Validate required fields
        if (!category || !description || !location) {
            return res.status(400).json({
                success: false,
                message: "Category, description and location are required"
            });
        }


        // Create report
       const report = await Report.create({
    user: req.user._id,
    category,
    fireType,
    description,
    location,
    latitude,
    longitude,
    severity
});


        res.status(201).json({
            success: true,
            message: "Report submitted successfully",
            report
        });


    } catch (error) {

        console.error("Create report error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// ======================================
// GET USER REPORTS
// ======================================
const getMyReports = async (req, res) => {
    try {

        const reports = await Report.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });


        res.json({
            success: true,
            count: reports.length,
            reports
        });


    } catch (error) {

        console.error("Get reports error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// ======================================
// GET SINGLE REPORT
// ======================================
const getReport = async (req, res) => {
    try {

        const report = await Report.findOne({
            _id: req.params.id,
            user: req.user._id
        });


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }


        res.json({
            success: true,
            report
        });


    } catch (error) {

        console.error("Get report error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// ======================================
// UPDATE REPORT
// ======================================
const updateReport = async (req, res) => {
    try {

        const report = await Report.findOne({
            _id: req.params.id,
            user: req.user._id
        });


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }


        const {
    category,
    fireType,
    description,
    location,
    latitude,
    longitude,
    severity
} = req.body;

        if (category !== undefined) {
            report.category = category;
        }

          if (fireType !== undefined) {
            report.fireType = fireType;
        }

        if (description !== undefined) {
            report.description = description;
        }

        if (location !== undefined) {
            report.location = location;
        }

        if (latitude !== undefined) {
            report.latitude = latitude;
        }

        if (longitude !== undefined) {
            report.longitude = longitude;
        }

        if (severity !== undefined) {
            report.severity = severity;
        }


        await report.save();


        res.json({
            success: true,
            message: "Report updated successfully",
            report
        });


    } catch (error) {

        console.error("Update report error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// ======================================
// DELETE REPORT
// ======================================
const deleteReport = async (req, res) => {
    try {

        const report = await Report.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }


        res.json({
            success: true,
            message: "Report deleted successfully"
        });


    } catch (error) {

        console.error("Delete report error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



module.exports = {
    createReport,
    getMyReports,
    getReport,
    updateReport,
    deleteReport
};