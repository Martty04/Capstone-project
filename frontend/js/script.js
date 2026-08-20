const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

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





  
function openModal(){
      document.getElementById("successModal").classList.add("show");
    }

    function closeModal(){
      document.getElementById("successModal").classList.remove("show");
   window.location.href = "../html/dashboard.html";

    }

      function goToDashboard() {
  }

      function moveToDashboard() {

         document.getElementById("btn").classList.remove("show");
   window.location.href = "../html/dashboard.html";
  }
  