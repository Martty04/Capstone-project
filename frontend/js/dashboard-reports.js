const API_URL = "http://localhost:5000/api";


// ========================================
// LOAD USER REPORTS
// ========================================

async function loadUserReports() {

    const reportsContainer =
        document.getElementById("recentReports");

    if (!reportsContainer) {
        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        reportsContainer.innerHTML = `
            <p class="reports-error">
                Please login to view your reports.
            </p>
        `;

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/reports`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        console.log("My reports:", data);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load reports."
            );
        }


        const reports =
            data.reports || [];


        // =================================
        // NO REPORTS
        // =================================

        if (reports.length === 0) {

            reportsContainer.innerHTML = `
                <div class="no-reports">
                    <h4>No reports yet</h4>

                    <p>
                        You haven't submitted any incident reports.
                    </p>

                    <a href="pages/report.html">
                        Submit a Report
                    </a>
                </div>
            `;

            return;
        }


        // =================================
        // SHOW ONLY RECENT REPORTS
        // =================================

        const recentReports =
            reports.slice(0, 3);


        reportsContainer.innerHTML =
            recentReports
                .map(report => createReportCard(report))
                .join("");


    } catch (error) {

        console.error(
            "Load reports error:",
            error
        );


        reportsContainer.innerHTML = `
            <div class="reports-error">

                <p>
                    Unable to load your reports.
                </p>

                <button onclick="loadUserReports()">
                    Try Again
                </button>

            </div>
        `;
    }
}


// ========================================
// CREATE REPORT CARD
// ========================================

function createReportCard(report) {

    const category =
        report.category || "Other";


    const severity =
        report.severity || "Medium";


    const status =
        report.status || "Pending";


    const date =
        formatReportDate(report.createdAt);


    const description =
        report.description || "No description provided.";


    const icon =
        getReportIcon(category);


    const severityClass =
        severity.toLowerCase();


    const statusClass =
        status
            .toLowerCase()
            .replace(/\s+/g, "-");


    return `

        <div class="incident report-card">

            <div class="bar"></div>


            <img
                src="${icon}"
                class="icon"
                alt="${category}"
            />


            <div class="incident-body">


                <div class="incident-top">

                    <span class="tag ${severityClass}">
                        ${severity.toUpperCase()}
                    </span>


                    <small>
                        ${date}
                    </small>

                </div>


                <h4>
                    ${category} Incident
                </h4>


                <p>
                    ${description}
                </p>


                <div class="report-meta">

                    <span>
                        <strong>Status:</strong>
                        <span class="report-status ${statusClass}">
                            ${status}
                        </span>
                    </span>


                    <span>
                        <strong>Location:</strong>
                        ${report.location || "Unknown"}
                    </span>

                </div>

            </div>

        </div>

    `;
}


// ========================================
// REPORT ICON
// ========================================

function getReportIcon(category) {

    const icons = {

        Fire:
            "../images/bluefire.png",

        Flood:
            "../images/blueflood.png",

        Crime:
            "../images/bluecrime.png",

        Accident:
            "../images/bluecar.png",

        Medical:
            "../images/firerescue.png",

        Police:
            "../images/police.png",

        Other:
            "../images/notice.png"
    };


    return icons[category] ||
        "../images/notice.png";
}


// ========================================
// FORMAT DATE
// ========================================

function formatReportDate(dateString) {

    if (!dateString) {
        return "Unknown date";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return "Unknown date";
    }


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// ========================================
// LOAD REPORTS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserReports();

    }
);