// Importa Firestore dal file di configurazione
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebase-config.js"; // Assicurati che il file di configurazione Firebase sia corretto

// Funzione per leggere i dati dal documento
async function leggiMessaggio() {
    try {
        const docRef = doc(db, "dati", "messaggio"); // Modifica "messaggio" con l'ID corretto del tuo documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const messaggio = docSnap.data().messaggio;
            console.log("Messaggio dal database:", messaggio);

            // Visualizza il messaggio nella pagina
            document.getElementById("output").textContent = messaggio;
        } else {
            console.log("Nessun documento trovato!");
        }
    } catch (error) {
        console.error("Errore durante la lettura dei dati:", error);
    }
}

// Funzione per salvare un nuovo messaggio nel database
async function salvaMessaggio() {
    try {
        await setDoc(doc(db, "dati", "messaggio"), {
            messaggio: "Ciao dal tuo Babbo Natale aggiornato!"
        });
        alert("Dati salvati con successo!");
    } catch (error) {
        console.error("Errore durante il salvataggio dei dati:", error);
    }
}

// Aggiungi gli eventi per i pulsanti
document.getElementById("saveData").addEventListener("click", salvaMessaggio);

// Chiamare la funzione per leggere i dati al caricamento della pagina
leggiMessaggio();
