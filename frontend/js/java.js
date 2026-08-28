const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");


// ==========================================
// OPEN MENU
// ==========================================

menuToggle.addEventListener("click", () => {

    sidebar.classList.add("active");
    overlay.classList.add("active");

    document.body.style.overflow = "hidden";

});


// ==========================================
// CLOSE MENU
// ==========================================

function closeSidebar() {

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

    document.body.style.overflow = "";

}


closeMenu.addEventListener("click", closeSidebar);

overlay.addEventListener("click", closeSidebar);


// ==========================================
// CLOSE WHEN NAV LINK IS CLICKED
// ==========================================

const mobileLinks = document.querySelectorAll(".mobile-nav a");

mobileLinks.forEach(link => {

    link.addEventListener("click", closeSidebar);

});