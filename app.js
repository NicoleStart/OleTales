/* =========================
   OLETALES APP LOGIC - SECURE VERSION
   ========================= */

/* ---------- ADMIN SETUP ---------- */
const IS_ADMIN = true; // set false for public readers
const ADMIN_EMAIL = "onkel.nicole@gmail.com"; // your admin email
const ADMIN_PASSWORD = "RememberMe@2025"; // your admin password
let ADMIN_UID = ""; // will be set after sign in
const ADMIN_PROFILE = {
  name: "Nicole",
  role: "Founder & Admin",
  bio: "Managing OleTales content and platform direction."
};

/* ---------- FIREBASE CONFIG ---------- */

const firebaseConfig = {
  apiKey: "AIzaSyDTc2lm15qGtCg3r5T36rQYStrltK_SlMk",
  authDomain: "oletales-29202.firebaseapp.com",
  projectId: "oletales-29202",
  storageBucket: "oletales-29202.firebasestorage.app",
  messagingSenderId: "540760611740",
  appId: "1:540760611740:web:29b998a80d0089ea010659",
  measurementId: "G-F7PJGRPPJ5"
};



// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

/* ---------- GLOBAL VARIABLES ---------- */
let stories = [];
let currentFilter = "ai";


/* =========================
   LOAD STORIES FROM FIRESTORE
   ========================= */
function loadStories() {
  db.collection("stories")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      stories = [];
      snapshot.forEach(doc => {
        stories.push({ id: doc.id, ...doc.data() });
      });
      renderStories();
    });
}

// Load initially
loadStories();







