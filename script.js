// ================== KONFIGURACJA FIREBASE ==================
// Wklej tutaj dane ze swojego projektu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVwGGTbfFHabf-pRK6_ohBlgj5i8zYxX4",
  authDomain: "matchchat-34583.firebaseapp.com",
  projectId: "matchchat-34583",
  storageBucket: "matchchat-34583.firebasestorage.app",
  messagingSenderId: "450520938408",
  appId: "1:450520938408:web:ab8fc56c97f86ff804e5bd",
  measurementId: "G-2PC5275D6X"
};

// Inicjalizacja Firebase
let database;
let myUserId = 'user_' + Math.random().toString(36).substr(2, 9);
let selectedGender = null;
let currentRoom = null;

// Po załadowaniu strony
function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error("Firebase nie załadowany");
        return;
    }
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("Firebase połączony");
    updateOnlineCount();
}

// Wybór płci
function selectGender(gender) {
    selectedGender = gender;
    document.querySelectorAll('.gender-option').forEach(el => el.classList.remove('active'));
    document.getElementById(gender).classList.add('active');
    document.getElementById('start-btn').disabled = false;
}

// Dołącz do poczekalni
function joinWaitingRoom() {
    if (!selectedGender) return;
    
    document.getElementById('waiting-room').classList.remove('active');
    document.getElementById('chat-screen').classList.add('active');
    
    currentRoom = database.ref('waitingRoom/' + selectedGender);
    
    // Dodaj siebie do poczekalni
    const userRef = currentRoom.child(myUserId);
    userRef.set({
        gender: selectedGender,
        timestamp: Date.now()
    });
    
    // Nasłuchuj na partnera
    listenForPartner();
}

// Aktualizacja licznika online
function updateOnlineCount() {
    const ref = database.ref('waitingRoom');
    ref.on('value', (snapshot) => {
        let count = 0;
        snapshot.forEach(child => count += child.numChildren());
        document.getElementById('online-count').textContent = count;
    });
}

function listenForPartner() {
    // Proste matching - szukaj innej osoby w tej samej płci
    currentRoom.on('child_added', (snapshot) => {
        if (snapshot.key !== myUserId) {
            // Znaleziono partnera
            const partner = snapshot.val();
            startChatWith(partner, snapshot.key);
        }
    });
}

function startChatWith(partner, partnerId) {
    addMessage("Połączono z partnerem! 🎉", "received");
    // Tu można dodać realny czat room
}

// Wysyłanie wiadomości
function sendMessage() {
    const input = document.getElementById('message-input');
    if (!input.value.trim()) return;
    
    addMessage(input.value, 'sent');
    input.value = '';
    // W realnej wersji wysyłałoby do Firebase
}

function addMessage(text, type) {
    const chat = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

function leaveChat() {
    if (confirm("Wyjść z czatu?")) {
        location.reload();
    }
}

function toggleEmojiPicker() {
    alert("Emoji picker - do uzupełnienia");
}

// Start
window.onload = () => {
    initFirebase();
};