const locationStatus = document.getElementById("locationStatus");
const locationAddress = document.getElementById("locationAddress");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const locationError = document.getElementById("locationError");
const submitReportButton = document.getElementById("submitReport");

let currentLatitude = null;
let currentLongitude = null;


// ========================================
// GET USER LOCATION
// ========================================

function getUserLocation() {

    if (!navigator.geolocation) {

        locationStatus.textContent = "Location unavailable";

        locationAddress.textContent =
            "Your browser does not support location services.";

        locationError.textContent =
            "Please use a browser that supports location services.";

        return;
    }

    locationStatus.textContent = "Getting your location...";
    locationAddress.textContent =
        "Please allow location access.";
    locationError.textContent = "";

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            currentLatitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;

            // Show coordinates
            latitudeElement.textContent =
                currentLatitude.toFixed(6);

            longitudeElement.textContent =
                currentLongitude.toFixed(6);

            locationStatus.textContent =
                "Location detected";

            locationAddress.textContent =
                `Coordinates: ${currentLatitude.toFixed(6)}, ${currentLongitude.toFixed(6)}`;

            locationError.textContent = "";

            // Get readable address
            await getAddress(
                currentLatitude,
                currentLongitude
            );
        },

        function (error) {

            console.error("Location error:", error);

            currentLatitude = null;
            currentLongitude = null;

            locationStatus.textContent =
                "Unable to detect location";

            locationAddress.textContent =
                "Please enable location services and try again.";

            locationError.textContent =
                "We could not access your location. Please allow location permission.";
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


// ========================================
// GET READABLE ADDRESS
// ========================================

async function getAddress(latitude, longitude) {

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );

        if (!response.ok) {
            throw new Error("Unable to get address");
        }

        const data = await response.json();

        if (data.display_name) {

            locationStatus.textContent =
                "Incident Location";

            locationAddress.textContent =
                data.display_name;
        }

    } catch (error) {

        console.error("Address lookup error:", error);

        locationStatus.textContent =
            "Location detected";

        locationAddress.textContent =
            `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
}


// ========================================
// SUBMIT REPORT
// ========================================

async function submitReport() {

    console.log("=================================");
    console.log("SUBMIT REPORT BUTTON CLICKED");
    console.log("=================================");

    locationError.textContent = "";

    // ====================================
    // CHECK TOKEN
    // ====================================

    const token = localStorage.getItem("token");

    if (!token) {

        locationError.textContent =
            "Your session has expired. Please login again.";

        setTimeout(() => {
            window.location.href = "../login.html";
        }, 1500);

        return;
    }


    // ====================================
    // GET SAVED REPORT DETAILS
    // ====================================

    const category =
        localStorage.getItem("reportCategory");

    const fireType =
        localStorage.getItem("reportFireType");

    const description =
        localStorage.getItem("reportDescription");

    const severity =
        localStorage.getItem("reportSeverity") || "Low";


    console.log("Report information:");
    console.log("Category:", category);
    console.log("Fire Type:", fireType);
    console.log("Description:", description);
    console.log("Severity:", severity);


    // ====================================
    // VALIDATE CATEGORY
    // ====================================

    if (!category) {

        locationError.textContent =
            "Report category is missing. Please go back and select a category.";

        return;
    }


    // ====================================
    // VALIDATE DESCRIPTION
    // ====================================

    if (!description || description.trim() === "") {

        locationError.textContent =
            "Report description is missing. Please go back and describe the incident.";

        return;
    }


    // ====================================
    // VALIDATE LOCATION
    // ====================================

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        locationError.textContent =
            "Please wait for your location to be detected before submitting.";

        return;
    }


    // ====================================
    // GET ADDRESS
    // ====================================

    let address =
        locationAddress.textContent.trim();

    if (!address) {

        address =
            `Coordinates: ${currentLatitude.toFixed(6)}, ${currentLongitude.toFixed(6)}`;
    }


    // ====================================
    // DISABLE BUTTON
    // ====================================

    submitReportButton.disabled = true;

    submitReportButton.textContent =
        "Submitting...";


    try {

        console.log("Sending report to backend...");


        // =================================
        // REPORT DATA
        // =================================

        const reportData = {

            category: category,

            fireType: fireType || null,

            description: description.trim(),

            location: address,

            latitude: currentLatitude,

            longitude: currentLongitude,

            severity: severity
        };


        console.log("Sending:", reportData);


        // =================================
        // SEND TO BACKEND
        // =================================

        const response = await fetch(
            `${API_URL}/reports`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(reportData)
            }
        );


        // =================================
        // READ BACKEND RESPONSE
        // =================================

        const data = await response.json();

        console.log("Backend response:", data);


        // =================================
        // CHECK RESPONSE
        // =================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to submit report."
            );
        }


        // =================================
        // SUCCESS
        // =================================

        console.log(
            "REPORT SUBMITTED SUCCESSFULLY"
        );


        // =================================
        // REFERENCE ID
        // =================================

        if (data.report && data.report._id) {

            const reportId =
                data.report._id;

            localStorage.setItem(
                "lastReportId",
                reportId
            );

            const referenceId =
                document.getElementById("referenceId");

            if (referenceId) {

                referenceId.textContent =
                    `#SR-${reportId
                        .slice(-8)
                        .toUpperCase()}`;
            }
        }


        // =================================
        // USER NAME
        // =================================

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            try {

                const user =
                    JSON.parse(storedUser);

                const successUserName =
                    document.getElementById("successUserName");

                if (
                    successUserName &&
                    user.name
                ) {

                    successUserName.textContent =
                        user.name;
                }

            } catch (error) {

                console.error(
                    "Could not read stored user:",
                    error
                );
            }
        }


        // =================================
        // SHOW SUCCESS MODAL
        // =================================

        const successModal =
            document.getElementById("successModal");

        console.log(
            "Success modal:",
            successModal
        );


        if (!successModal) {

            console.error(
                "SUCCESS MODAL WAS NOT FOUND!"
            );

            alert(
                "Report submitted successfully!"
            );

            window.location.href =
                "../dashboard.html";

            return;
        }


        // THIS SHOWS YOUR PROMPT
        successModal.classList.add("active");


        console.log(
            "SUCCESS MODAL SHOULD NOW BE VISIBLE"
        );


        // =================================
        // CLEAR TEMPORARY DATA
        // =================================

        localStorage.removeItem("reportCategory");
        localStorage.removeItem("reportFireType");
        localStorage.removeItem("reportDescription");
        localStorage.removeItem("reportSeverity");


    } catch (error) {

        console.error(
            "Submit report error:",
            error
        );

        locationError.textContent =
            error.message ||
            "Something went wrong while submitting the report.";

        submitReportButton.disabled = false;

        submitReportButton.textContent =
            "Submit Report →";
    }
}


// ========================================
// CLOSE SUCCESS MODAL
// ========================================

function closeModal() {

    const modal =
        document.getElementById("successModal");

    if (modal) {

        modal.classList.remove("active");
    }

    window.location.href =
        "../html/dashboard.html";
}


// ========================================
// SUBMIT BUTTON
// ========================================

if (submitReportButton) {

    submitReportButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            submitReport();

        }
    );

} else {

    console.error(
        "Submit Report button was not found."
    );
}


// ========================================
// START LOCATION DETECTION
// ========================================

getUserLocation();