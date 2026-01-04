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
   ADMIN AUTHENTICATION
   ========================= */
if (IS_ADMIN) {
  auth.signInWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    .then(userCredential => {
      ADMIN_UID = userCredential.user.uid;
      console.log("Admin signed in:", ADMIN_UID);
      document.getElementById("admin-link").classList.remove("hidden");
    })
    .catch(error => console.error("Sign in error:", error));
}

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

/* =========================
   RENDER STORIES
   ========================= */
function renderStories() {
  const list = document.getElementById("story-list");
  if (!list) return;

  const filtered = currentFilter === "all" ? stories : stories.filter(s => s.type === currentFilter);
  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<p>No stories yet.</p>";
    return;
  }

  filtered.forEach(story => {
    const card = document.createElement("div");
    card.className = "book";

    card.innerHTML = `
      <div class="book-cover">
        <span class="book-type ${story.type}">${story.type === "ai" ? "AI-assisted" : "Human-written"}</span>
      </div>
      <div class="book-info">
        <h3 class="book-title">${story.title}</h3>
        <p class="book-blurb">${story.content.substring(0,120)}...</p>
        ${
          (IS_ADMIN && auth.currentUser && auth.currentUser.uid === ADMIN_UID)
          ? `<button class="delete-btn" data-id="${story.id}">Delete</button>`
          : ""
        }
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) openReader(story);
    });

    list.appendChild(card);
  });

  if (IS_ADMIN) attachDeleteEvents();
}

/* =========================
   TAB SWITCHING
   ========================= */
function showTab(type, button) {
  currentFilter = type;
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  if (button) button.classList.add("active");
  renderStories();
}

/* =========================
   DELETE LOGIC (SECURE)
   ========================= */
function attachDeleteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const storyId = btn.dataset.id;

      if (!auth.currentUser || auth.currentUser.uid !== ADMIN_UID) return;
      if (confirm("Are you sure you want to delete this story?")) {
        db.collection("stories").doc(storyId).delete();
      }
    });
  });
}

/* =========================
   READER PAGE
   ========================= */
function openReader(story) {
  document.getElementById("library").classList.add("hidden");
  document.getElementById("reader").classList.remove("hidden");
  document.getElementById("reader-title").textContent = story.title;
  document.getElementById("reader-type").textContent = story.type === "ai" ? "AI-assisted writing" : "Human-written";
  document.getElementById("reader-content").textContent = story.content;
}

document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("reader").classList.add("hidden");
  document.getElementById("library").classList.remove("hidden");
});

/* =========================
   ADMIN PROFILE
   ========================= */
function openAdminProfile() {
  if (!IS_ADMIN || !auth.currentUser || auth.currentUser.uid !== ADMIN_UID) return;

  document.getElementById("library").classList.add("hidden");
  document.getElementById("reader").classList.add("hidden");
  document.getElementById("admin-profile").classList.remove("hidden");

  document.getElementById("admin-name").textContent = ADMIN_PROFILE.name;
  document.getElementById("admin-role").textContent = ADMIN_PROFILE.role;
  document.getElementById("admin-bio").textContent = ADMIN_PROFILE.bio;
}

document.getElementById("admin-back-btn").addEventListener("click", () => {
  document.getElementById("admin-profile").classList.add("hidden");
  document.getElementById("library").classList.remove("hidden");
});

if (IS_ADMIN) {
  const adminLink = document.getElementById("admin-link");
  if (adminLink) adminLink.addEventListener("click", openAdminProfile);
}
