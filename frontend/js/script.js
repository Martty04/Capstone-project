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