document.addEventListener("DOMContentLoaded", () => {
  const snowflakesContainer = document.getElementById("snowflakes-container");

  // Numero di fiocchi di neve
  const snowflakeCount = 100;

  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");

    // Posizionamento casuale
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.animationDuration = `${5 + Math.random() * 10}s`; // Durata casuale
    snowflake.style.animationDelay = `${Math.random() * 5}s`; // Ritardo iniziale casuale

    snowflakesContainer.appendChild(snowflake);
  }
});

// Variabili principali
const userLoginPanel = document.getElementById("user-login-panel");
const userRevealPanel = document.getElementById("user-reveal-panel");
const adminLoginPanel = document.getElementById("admin-login-panel");
const adminPanel = document.getElementById("admin-panel");
const assignmentsList = document.getElementById("assignments-list");
const toggleAssignmentsCheckbox = document.getElementById("toggle-assignments");
const revealCard = document.getElementById("reveal-card");

let participants = JSON.parse(localStorage.getItem("participants")) || [];
let passwords = JSON.parse(localStorage.getItem("passwords")) || {};
let assignments = JSON.parse(localStorage.getItem("assignments")) || {};
let isAssignmentsVisible = false;

// Salva i dati nel localStorage
function saveData() {
  localStorage.setItem("participants", JSON.stringify(participants));
  localStorage.setItem("passwords", JSON.stringify(passwords));
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

// Passa al pannello admin
document.getElementById("go-to-admin-btn").addEventListener("click", () => {
  userLoginPanel.classList.add("hidden");
  adminLoginPanel.classList.remove("hidden");
});

// Login utente e visualizzazione del destinatario
document.getElementById("user-login-btn").addEventListener("click", () => {
  const password = document.getElementById("user-password").value.trim();
  const errorMessage = document.getElementById("user-error-message");
  const revealName = document.getElementById("reveal-name");
  errorMessage.textContent = "";

  const user = Object.keys(passwords).find((name) => passwords[name] === password);
  if (!user) {
    errorMessage.textContent = "Password non valida!";
    return;
  }

  if (!assignments[user]) {
    errorMessage.textContent = "Non ci sono ancora abbinamenti!";
    return;
  }

  userLoginPanel.classList.add("hidden");
  userRevealPanel.classList.remove("hidden");
  revealName.textContent = assignments[user];

  // Riattiva l'animazione della card e del nome
  revealCard.style.animation = "none";
  revealName.style.animation = "none";

  setTimeout(() => {
    revealCard.style.animation = "fade-in 1s ease-in-out";
    revealName.style.animation = "zoom-in 0.6s ease-in-out";
  }, 50);
});

// Logout utente
document.getElementById("logout-btn").addEventListener("click", () => {
  userRevealPanel.classList.add("hidden");
  userLoginPanel.classList.remove("hidden");
  document.getElementById("user-password").value = "";
});

// Login admin
document.getElementById("admin-login-btn").addEventListener("click", () => {
  const password = document.getElementById("admin-password").value;
  const error = document.getElementById("admin-error-message");
  error.textContent = "";

  if (password === "admin123") {
    adminLoginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
  } else {
    error.textContent = "Password errata!";
  }
});

// Torna indietro dal login admin
document.getElementById("admin-back-btn").addEventListener("click", () => {
  adminLoginPanel.classList.add("hidden");
  userLoginPanel.classList.remove("hidden");
});

// Logout admin
document.getElementById("admin-logout-btn").addEventListener("click", () => {
  adminPanel.classList.add("hidden");
  userLoginPanel.classList.remove("hidden");
});

// Aggiungi partecipante
document.getElementById("add-participant-btn").addEventListener("click", () => {
  const name = document.getElementById("participant-name").value.trim();
  const password = document.getElementById("participant-password").value.trim();
  if (!name || !password || participants.includes(name)) return;

  participants.push(name);
  passwords[name] = password;
  document.getElementById("participant-name").value = "";
  document.getElementById("participant-password").value = "";
  updateParticipantsList();
});

// Genera abbinamenti
document.getElementById("generate-assignments-btn").addEventListener("click", () => {
  if (participants.length < 2) {
    alert("Servono almeno 2 partecipanti!");
    return;
  }

  assignments = {};
  const shuffled = [...participants].sort(() => 0.5 - Math.random());
  for (let i = 0; i < shuffled.length; i++) {
    assignments[shuffled[i]] = shuffled[(i + 1) % shuffled.length];
  }
  updateAssignmentsList();

  // Notifica visiva per confermare l'operazione
  alert("Abbinamenti generati con successo!");
});

// Visualizza/nasconde gli abbinamenti
toggleAssignmentsCheckbox.addEventListener("change", (e) => {
  isAssignmentsVisible = e.target.checked;
  updateAssignmentsList();
});

// Reset dati
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Sei sicuro di voler resettare tutti i dati? Questa operazione non può essere annullata.")) {
    participants = [];
    passwords = {};
    assignments = {};
    updateParticipantsList();
    updateAssignmentsList();
  }
});

// Aggiorna la lista dei partecipanti
function updateParticipantsList() {
  const list = document.getElementById("participants-list");
  list.innerHTML = "";
  participants.forEach((name, index) => {
    const li = document.createElement("li");
    li.classList.add("participant-item");
    li.textContent = `${name} (password: ${passwords[name]})`;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Rimuovi";
    removeBtn.addEventListener("click", () => {
      if (confirm(`Sei sicuro di voler rimuovere ${name}?`)) {
        participants.splice(index, 1);
        delete passwords[name];
        updateParticipantsList();
      }
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
  saveData();
}

// Aggiorna la lista degli abbinamenti
function updateAssignmentsList() {
  assignmentsList.innerHTML = "";
  if (isAssignmentsVisible) {
    Object.entries(assignments).forEach(([giver, receiver]) => {
      const li = document.createElement("li");
      li.classList.add("assignment-item");
      li.textContent = `${giver} \u2192 ${receiver}`;
      assignmentsList.appendChild(li);
    });
    assignmentsList.classList.remove("hidden");
  } else {
    assignmentsList.classList.add("hidden");
  }
  saveData();
}

// Inizializza
updateParticipantsList();
updateAssignmentsList();
