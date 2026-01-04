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








function registerAuthor() {
  const name = document.getElementById("name").value;
  const penName = document.getElementById("penName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("authors").doc(cred.user.uid).set({
        name,
        penName,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      status.innerText = "Author account created!";
    })
    .catch(err => alert(err.message));
}

function loginAuthor() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
}







/*Book Upload*/

function showBookUpload() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("bookSection").style.display = "block";
}

function uploadBook() {
  const title = bookTitle.value;
  const description = bookDesc.value;
  const content = bookContent.value;
  const user = auth.currentUser;

  if (!user) return alert("Not logged in");

  db.collection("books").add({
    title,
    description,
    content,
    authorId: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Book uploaded!");
    bookTitle.value = "";
    bookDesc.value = "";
    bookContent.value = "";
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Author logged in:", user.uid);
    showBookUpload();
  } else {
    console.log("No author logged in");
  }
});
