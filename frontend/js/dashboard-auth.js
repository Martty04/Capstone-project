const token = localStorage.getItem("token");


const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userLocation = document.getElementById("userLocation");
const profileImage = document.getElementById("profileImage");


const loadUser = async () => {

    // No token = user is not logged in
    if (!token) {
        window.location.href = "../html/login.html";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/me",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";

            return;
        }


        const user = data.user;


        // =========================
        // USER INFORMATION
        // =========================

        userName.textContent = user.name;

        userEmail.textContent = user.email;

        userLocation.textContent = user.location;


        // =========================
        // PROFILE IMAGE
        // =========================

        if (user.gender === "male") {

            profileImage.src = "../images/male-profile.png";

        } else if (user.gender === "female") {

            profileImage.src = "../images/female-profile.png";

        }


        // Update alt text
        profileImage.alt = `${user.name} Profile`;


        // Save updated user
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


    } catch (error) {

        console.error("Dashboard authentication error:", error);

    }
};


loadUser();