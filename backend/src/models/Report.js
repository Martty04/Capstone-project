const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
    type: String,
    required: true,
    enum: [
        "Fire",
        "Medical",
        "Police",
        "Accident",
        "Flood",
        "Crime",
        "Other"
    ]
},

fireType: {
    type: String,
    trim: true,
    default: null
},

description: {
    type: String,
    required: true,
    trim: true
},

        location: {
            type: String,
            required: true,
            trim: true
        },

        latitude: {
            type: Number,
            default: null
        },

        longitude: {
            type: Number,
            default: null
        },

        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Resolved",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);