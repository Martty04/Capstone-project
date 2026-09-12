const API_URL = "https://capstone-project-55lc.onrender.com/api";


async function getCurrentUser() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../html/login.html";
        return null;
    }

    try {

        const response = await fetch(
            `${API_URL}/auth/me`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "../html/login.html";

            return null;
        }


        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        return data.user;

    } catch (error) {

        console.error(
            "Unable to get current user:",
            error
        );

        return null;
    }
}



function displayUserInformation(user) {

    if (!user) return;


    // Name
    document
        .querySelectorAll("[data-user-name]")
        .forEach(element => {
            element.textContent = user.name;
        });


    // Email
    document
        .querySelectorAll("[data-user-email]")
        .forEach(element => {
            element.textContent = user.email;
        });


    // Phone
    document
        .querySelectorAll("[data-user-phone]")
        .forEach(element => {
            element.textContent = user.phone;
        });


    // Location
    document
        .querySelectorAll("[data-user-location]")
        .forEach(element => {
            element.textContent = user.location;
        });


    // Role
    document
        .querySelectorAll("[data-user-role]")
        .forEach(element => {
            element.textContent = user.role;
        });


    // First name
    document
        .querySelectorAll("[data-user-first-name]")
        .forEach(element => {

            element.textContent =
                user.name.split(" ")[0];

        });
}



async function loadUserInformation() {

    const user = await getCurrentUser();

    if (!user) return;

    displayUserInformation(user);
}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../html/login.html";
}