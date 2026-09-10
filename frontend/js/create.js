
// SIGN UP
const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const gender = document.getElementById("gender").value;


        // Check passwords
        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        // Check password length
        if (password.length < 6) {

            alert("Password must be at least 6 characters.");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        location,
                        gender,
                        email,
                        phone,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Registration failed.");

                return;
            }


            // Save JWT
            localStorage.setItem(
                "token",
                data.token
            );


            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            alert("Account created successfully!");


            // Move to dashboard
            window.location.href = "../html/dashboard.html";


        } catch (error) {

            console.error("Registration error:", error);

            alert(
                "Unable to connect to SafeReach server."
            );
        }

    });

}