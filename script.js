// Importa Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// Esporta `db` per usarlo in altri script
export { db };
