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

// Funzione per leggere i dati dal database
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
        console.error("Errore durante la lettura dei dati:", error);
    }
}

// Funzione per salvare i dati nel database
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

// Riferimenti ai pannelli
const adminLoginPanel = document.getElementById("admin-login-panel");
const adminPanel = document.getElementById("admin-panel");
const userLoginPanel = document.getElementById("user-login-panel");
const userRevealPanel = document.getElementById("user-reveal-panel");

// Gestione del login admin
document.getElementById("admin-login-btn").addEventListener("click", () => {
    const password = document.getElementById("admin-password").value.trim();
    const error = document.getElementById("admin-error-message");
    error.textContent = "";

    if (password === "admin123") {
        // Mostra il pannello admin e nascondi il login
        adminLoginPanel.classList.add("hidden");
        adminPanel.classList.remove("hidden");
    } else {
        error.textContent = "Password errata!";
    }
});

// Torna indietro al login utente
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

    // Animazione della card e del nome
    document.getElementById("reveal-card").style.animation = "fade-in 1s ease-in-out";
    revealName.style.animation = "zoom-in 0.6s ease-in-out";
});

// Logout utente
document.getElementById("logout-btn").addEventListener("click", () => {
    userRevealPanel.classList.add("hidden");
    userLoginPanel.classList.remove("hidden");
    document.getElementById("user-password").value = "";
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
});

// Visualizza/nasconde gli abbinamenti
document.getElementById("toggle-assignments").addEventListener("change", (e) => {
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
    participants.forEach((name, index) => {
        const li = document.createElement("li");
        li.textContent = `${name} (password: ${passwords[name]})`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Rimuovi";
        removeBtn.addEventListener("click", () => {
            participants.splice(index, 1);
            delete passwords[name];
            updateParticipantsList();
        });

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
    saveData();
}

// Aggiorna la lista degli abbinamenti
function updateAssignmentsList() {
    const assignmentsList = document.getElementById("assignments-list");
    assignmentsList.innerHTML = "";
    if (isAssignmentsVisible) {
        Object.entries(assignments).forEach(([giver, receiver]) => {
            const li = document.createElement("li");
            li.textContent = `${giver} → ${receiver}`;
            assignmentsList.appendChild(li);
        });
    }
    saveData();
}

// Inizializza
loadData();
