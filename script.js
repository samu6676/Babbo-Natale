// Inizializza Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2mZiGw5qMcCQQCiPc9PMInCF54bNvrdE",
  authDomain: "babbo-natale-segreto-bde25.firebaseapp.com",
  projectId: "babbo-natale-segreto-bde25",
  storageBucket: "babbo-natale-segreto-bde25.firebasestorage.app",
  messagingSenderId: "92176963194",
  appId: "1:92176963194:web:9013a73f0dac82dc1f8dc3",
  measurementId: "G-NM8SHJYFHQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variabili principali
const userLoginPanel = document.getElementById("user-login-panel");
const userRevealPanel = document.getElementById("user-reveal-panel");
const adminLoginPanel = document.getElementById("admin-login-panel");
const adminPanel = document.getElementById("admin-panel");

// Funzioni Firebase
async function saveParticipant(name, password) {
  await setDoc(doc(db, "participants", name), { password });
}

async function saveAssignments(assignments) {
  await setDoc(doc(db, "assignments", "data"), { assignments });
}

async function getAssignments() {
  const docSnap = await getDoc(doc(db, "assignments", "data"));
  return docSnap.exists() ? docSnap.data().assignments : null;
}

async function getParticipant(name) {
  const docSnap = await getDoc(doc(db, "participants", name));
  return docSnap.exists() ? docSnap.data() : null;
}

// Eventi
document.getElementById("go-to-admin-btn").addEventListener("click", () => {
  userLoginPanel.classList.add("hidden");
  adminLoginPanel.classList.remove("hidden");
});

document.getElementById("admin-login-btn").addEventListener("click", () => {
  const password = document.getElementById("admin-password").value.trim();
  if (password === "admin123") {
    adminLoginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
  } else {
    document.getElementById("admin-error-message").textContent = "Password errata!";
  }
});

document.getElementById("add-participant-btn").addEventListener("click", async () => {
  const name = document.getElementById("participant-name").value.trim();
  const password = document.getElementById("participant-password").value.trim();
  if (!name || !password) {
    alert("Nome o password non validi!");
    return;
  }

  await saveParticipant(name, password);
  alert("Partecipante aggiunto!");
});

document.getElementById("generate-assignments-btn").addEventListener("click", async () => {
  const participants = [];
  const participantsRef = db.collection("participants");
  const snapshot = await participantsRef.get();
  snapshot.forEach((doc) => {
    participants.push(doc.id);
  });

  if (participants.length < 2) {
    alert("Servono almeno 2 partecipanti!");
    return;
  }

  const shuffled = [...participants].sort(() => 0.5 - Math.random());
  const assignments = {};
  for (let i = 0; i < shuffled.length; i++) {
    assignments[shuffled[i]] = shuffled[(i + 1) % shuffled.length];
  }

  await saveAssignments(assignments);
  alert("Abbinamenti generati!");
});

document.getElementById("toggle-assignments").addEventListener("change", async (e) => {
  const assignments = await getAssignments();
  const assignmentsList = document.getElementById("assignments-list");

  if (e.target.checked && assignments) {
    assignmentsList.innerHTML = "";
    Object.entries(assignments).forEach(([giver, receiver]) => {
      const li = document.createElement("li");
      li.textContent = `${giver} → ${receiver}`;
      assignmentsList.appendChild(li);
    });
    assignmentsList.classList.remove("hidden");
  } else {
    assignmentsList.classList.add("hidden");
  }
});

document.getElementById("reset-btn").addEventListener("click", async () => {
  if (confirm("Sei sicuro di voler resettare tutti i dati?")) {
    await db.collection("participants").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => doc.ref.delete());
    });
    await db.collection("assignments").doc("data").delete();
    alert("Dati resettati!");
  }
});

// Login utente
document.getElementById("user-login-btn").addEventListener("click", async () => {
  const password = document.getElementById("user-password").value.trim();
  const participantsRef = db.collection("participants");
  const snapshot = await participantsRef.where("password", "==", password).get();

  if (snapshot.empty) {
    document.getElementById("user-error-message").textContent = "Password non valida!";
    return;
  }

  const user = snapshot.docs[0].id;
  const assignments = await getAssignments();
  if (!assignments || !assignments[user]) {
    document.getElementById("user-error-message").textContent = "Nessun abbinamento disponibile!";
    return;
  }

  document.getElementById("reveal-name").textContent = assignments[user];
  userLoginPanel.classList.add("hidden");
  userRevealPanel.classList.remove("hidden");
});

document.getElementById("logout-btn").addEventListener("click", () => {
  userRevealPanel.classList.add("hidden");
  userLoginPanel.classList.remove("hidden");
});
