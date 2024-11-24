// Importa Firebase SDK e Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD2mZiGw5qMcCQQCiPc9PMInCF54bNvrdE",
    authDomain: "babbo-natale-segreto-bde25.firebaseapp.com",
    projectId: "babbo-natale-segreto-bde25",
    storageBucket: "babbo-natale-segreto-bde25.firebasestorage.app",
    messagingSenderId: "92176963194",
    appId: "1:92176963194:web:9013a73f0dac82dc1f8dc3",
    measurementId: "G-NM8SHJYFHQ"
};

// Inizializza Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variabili principali
let participants = [];
let passwords = {};
let assignments = {};
let isAssignmentsVisible = false;

// Riferimenti ai pannelli e agli elementi
const userLoginPanel = document.getElementById("user-login-panel");
const userRevealPanel = document.getElementById("user-reveal-panel");
const adminLoginPanel = document.getElementById("admin-login-panel");
const adminPanel = document.getElementById("admin-panel");
const assignmentsList = document.getElementById("assignments-list");
const toggleAssignmentsCheckbox = document.getElementById("toggle-assignments");
const revealCard = document.getElementById("reveal-card");

// Funzioni Firebase
async function loadData() {
    try {
        const docRef = doc(db, "dati", "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            participants = data.participants || [];
            passwords = data.passwords || {};
            assignments = data.assignments || {};
            updateParticipantsList();
            updateAssignmentsList();
        } else {
            console.log("Nessun documento trovato!");
        }
    } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
    }
}

async function saveData() {
    try {
        const docRef = doc(db, "dati", "main");
        await setDoc(docRef, {
            participants,
            passwords,
            assignments
        });
        console.log("Dati salvati con successo!");
    } catch (error) {
        console.error("Errore durante il salvataggio dei dati:", error);
    }
}

// Gestione del login utente
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
});

// Logout utente
document.getElementById("logout-btn").addEventListener("click", () => {
    userRevealPanel.classList.add("hidden");
    userLoginPanel.classList.remove("hidden");
    document.getElementById("user-password").value = "";
});

// Login admin
document.getElementById("admin-login-btn").addEventListener("click", () => {
    const password = document.getElementById("admin-password").value.trim();
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
    document.getElementById("admin-password").value = "";
});

// Aggiungi partecipante
document.getElementById("add-participant-btn").addEventListener("click", () => {
    const name = document.getElementById("participant-name").value.trim();
    const password = document.getElementById("participant-password").value.trim();
    if (!name || !password || participants.includes(name)) return;

    participants.push(name);
    passwords[name] = password;
    updateParticipantsList();
    saveData();
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
    saveData();
});

// Visualizza/nasconde gli abbinamenti
toggleAssignmentsCheckbox.addEventListener("change", (e) => {
    isAssignmentsVisible = e.target.checked;
    updateAssignmentsList();
});

// Reset dati
document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Sei sicuro di voler resettare tutti i dati?")) {
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
    participants.forEach((name) => {
        const li = document.createElement("li");
        li.textContent = `${name} (password: ${passwords[name]})`;
        list.appendChild(li);
    });
}

// Aggiorna la lista degli abbinamenti
function updateAssignmentsList() {
    assignmentsList.innerHTML = "";
    if (isAssignmentsVisible) {
        Object.entries(assignments).forEach(([giver, receiver]) => {
            const li = document.createElement("li");
            li.textContent = `${giver} → ${receiver}`;
            assignmentsList.appendChild(li);
        });
    }
}

// Inizializza il sito caricando i dati
loadData();
