const loginForm = document.getElementById("loginForm");


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;


    // Basic validation
    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        // Backend returned an error
        if (!response.ok) {

            alert(
                data.message || "Login failed."
            );

            return;
        }


        // ===============================
        // LOGIN SUCCESSFUL
        // ===============================

        console.log("Login response:", data);


        // Save JWT token
        localStorage.setItem(
            "token",
            data.token
        );


        // Save user information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        alert("Login successful!");


        // Redirect to dashboard
        window.location.href = "home.html";

    } catch (error) {

        console.error("Login error:", error);

        alert(
            "Unable to connect to SafeReach server. " +
            "Make sure the backend is running."
        );
    }

});


const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");


togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "X";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "👁";
    }

});