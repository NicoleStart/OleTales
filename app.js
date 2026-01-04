/* =========================
   OLETALES APP LOGIC - COMPLETE
   ========================= */

/* ---------- ADMIN SETUP ---------- */
const IS_ADMIN = true; // set false for public
const ADMIN_PROFILE = {
  name: "Nicole",
  role: "Founder & Admin",
  bio: "Managing OleTales content and platform direction."
};

/* ---------- FIREBASE CONFIG ---------- */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

/* ---------- GLOBAL VARIABLES ---------- */
let stories = [];
let currentFilter = "ai"; // default tab

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
   RENDER STORIES AS BOOKS
   ========================= */
function renderStories() {
  const list = document.getElementById("story-list");
  if (!list) return;

  const filtered =
    currentFilter === "all"
      ? stories
      : stories.filter(s => s.type === currentFilter);

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<p>No stories yet.</p>";
    return;
  }

  filtered.forEach((story) => {
    const card = document.createElement("div");
    card.className = "book";

    card.innerHTML = `
      <div class="book-cover">
        <span class="book-type ${story.type}">
          ${story.type === "ai" ? "AI-assisted" : "Human-written"}
        </span>
      </div>

      <div class="book-info">
        <h3 class="book-title">${story.title}</h3>
        <p class="book-blurb">${story.content.substring(0, 120)}...</p>
        ${
          IS_ADMIN
            ? `<button class="delete-btn" data-id="${story.id}">Delete</button>`
            : ""
        }
      </div>
    `;

    // Open reader when clicking book
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) {
        openReader(story);
      }
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

  document.querySelectorAll(".tab-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  if (button) button.classList.add("active");

  renderStories();
}

/* =========================
   DELETE LOGIC (ADMIN ONLY)
   ========================= */
function attachDeleteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const storyId = btn.dataset.id;
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
  document.getElementById("reader-type").textContent =
    story.type === "ai" ? "AI-assisted writing" : "Human-written";
  document.getElementById("reader-content").textContent = story.content;
}

// Reader back button
document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("reader").classList.add("hidden");
  document.getElementById("library").classList.remove("hidden");
});

/* =========================
   ADMIN PROFILE
   ========================= */
function openAdminProfile() {
  if (!IS_ADMIN) return;

  document.getElementById("library").classList.add("hidden");
  document.getElementById("reader").classList.add("hidden");
  document.getElementById("admin-profile").classList.remove("hidden");

  document.getElementById("admin-name").textContent = ADMIN_PROFILE.name;
  document.getElementById("admin-role").textContent = ADMIN_PROFILE.role;
  document.getElementById("admin-bio").textContent = ADMIN_PROFILE.bio;
}

// Admin back button
document.getElementById("admin-back-btn").addEventListener("click", () => {
  document.getElementById("admin-profile").classList.add("hidden");
  document.getElementById("library").classList.remove("hidden");
});

// Show hidden admin link if admin
if (IS_ADMIN) {
  const adminLink = document.getElementById("admin-link");
  if (adminLink) {
    adminLink.classList.remove("hidden");
    adminLink.addEventListener("click", openAdminProfile);
  }
}

/* =========================
   WRITING PAGE - ADD STORY
   ========================= */
const form = document.getElementById("story-form");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const type = document.getElementById("type").value;

    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }

    db.collection("stories").add({
      title,
      content,
      type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Story published!");
    form.reset();
  });
}
