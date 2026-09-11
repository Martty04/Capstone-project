const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

function closeSidebar() { sidebar.classList.remove("active"); overlay.classList.remove("active"); }


/* =========================================
   FIRE PAGE
========================================= */

const fireBtn = document.getElementById("fireBtn");
const allBtn = document.getElementById("allBtn");

if (fireBtn) {

  fireBtn.addEventListener("click", () => {

    window.location.href = "../html/fire.html";

  });
}

if (allBtn) {

   allBtn.addEventListener("click", () => {

    window.location.href = "../html/alert.html";

  });
  

}

// DASHBOARD

  const services = {
    police: {
      icon: '🛡️',
      title: 'Police Dept',
      desc: 'Immediate assistance for law enforcement and public safety.',
      phone: '990'
    },

    fire: {
      icon: '🚒',
      title: 'Fire Rescue',
      desc: 'Emergency services for fire suppression, rescue, and hazardous materials.',
      phone: '112'
    },

    ambulance: {
      icon: '🚑',
      title: 'Ambulance',
      desc: 'Urgent medical transport and emergency medical services.',
      phone: '112'
    }
  };

  function openModal(type){
    const service = services[type];

    document.getElementById('modalIcon').textContent = service.icon;
    document.getElementById('modalTitle').textContent = service.title;
    document.getElementById('modalDesc').textContent = service.desc;

    const callBtn = document.getElementById('callBtn');
    callBtn.textContent = `📞 Call ${service.phone}`;
    callBtn.href = `tel:${service.phone}`;

    document.getElementById('emergencyModal').classList.add('show');
  }

  function closeModal(){
    document.getElementById('emergencyModal').classList.remove('show');
  }

  // close when clicking outside
  document.getElementById('emergencyModal').addEventListener('click', function(e){
    if(e.target === this){
      closeModal();
    }
  });


  const token = localStorage.getItem("token");


// ========================================
// CHECK IF USER IS LOGGED IN
// ========================================
if (!token) {
    window.location.href = "login.html";
}


// ========================================
// GET LOGGED-IN USER
// ========================================
const getCurrentUser = async () => {
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
            console.error(data.message);

            // Token is invalid/expired
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";
            return;
        }

        // Display user
        displayUser(data.user);

    } catch (error) {
        console.error("Error retrieving user:", error);
    }
};


// ========================================
// DISPLAY USER
// ========================================
const displayUser = (user) => {

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userPhone = document.getElementById("userPhone");
    const userLocation = document.getElementById("userLocation");

    if (userName) {
        userName.textContent = user.name;
    }

    if (userEmail) {
        userEmail.textContent = user.email;
    }

    if (userPhone) {
        userPhone.textContent = user.phone;
    }

    if (userLocation) {
        userLocation.textContent = user.location;
    }
};

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    const profileImage =
        user.gender === "male"
            ? "../images/male-profile.png"
            : "../images/female-profile.png";

    document.getElementById("profileImage").src = profileImage;
}

if (user) {
    document.getElementById("userName").textContent = user.name;
}


// ========================================
// RUN
// ========================================
getCurrentUser();


const userName = document.getElementById("userName");

const savedUser = localStorage.getItem("user");

if (savedUser) {
    const user = JSON.parse(savedUser);

    userName.textContent = user.name;
} else {
    userName.textContent = "User";
}

async function loadMyReports() {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

        const response = await fetch(
            `${API_URL}/reports`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        displayMyReports(data.reports);

    } catch (error) {

        console.error("Could not load reports:", error);

    }
}

function displayMyReports(reports) {

    const container =
        document.getElementById("myReports");

    if (!container) return;

    if (reports.length === 0) {

        container.innerHTML = `
            <div class="empty-reports">
                <p>You haven't submitted any reports yet.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = reports
        .slice(0, 3)
        .map(report => {

            return `
                <div class="my-report">

                    <div>
                        <strong>${report.category}</strong>

                        <p>
                            ${report.description}
                        </p>
                    </div>

                    <span class="report-status">
                        ${report.status}
                    </span>

                </div>
            `;

        })
        .join("");
}