/* =========================
   OLETALES APP LOGIC
   ========================= */

/* ---------- STORAGE ---------- */
const IS_ADMIN = true; // ← set to false later for public users


// Get all stories
function getStories() {
  return JSON.parse(localStorage.getItem("stories")) || [];
}

// Save all stories
function saveStories(stories) {
  localStorage.setItem("stories", JSON.stringify(stories));
}

/* ---------- WRITING PAGE ---------- */

const form = document.getElementById("story-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const type = document.getElementById("type").value;

    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }

    const newStory = {
      id: Date.now(),
      title,
      content,
      type, // "ai" or "human"
      createdAt: new Date().toISOString()
    };

    const stories = getStories();
    stories.unshift(newStory); // newest first
    saveStories(stories);

    alert("Story published!");
    form.reset();
  });
}

/* ---------- READING PAGE ---------- */

function renderStories() {
  const list = document.getElementById("story-list");
  list.innerHTML = "";

  const filtered =
    currentFilter === "all"
      ? stories
      : stories.filter(s => s.type === currentFilter);

  if (filtered.length === 0) {
    list.innerHTML = "<p>No stories yet.</p>";
    return;
  }

  filtered.forEach((story, index) => {
    const card = document.createElement("div");
    card.className = "book";

    card.addEventListener("click", () => openReader(story));


    card.innerHTML = `
      <div class="book-cover">
        <span class="book-type ${story.type}">
          ${story.type === "ai" ? "AI-assisted" : "Human-written"}
        </span>
      </div>

      <div class="book-info">
        <h3 class="book-title">${story.title}</h3>
        <p class="book-blurb">
          ${story.content.substring(0, 120)}...
        </p>

        ${
          IS_ADMIN
            ? `<button class="delete-btn" data-index="${index}">
                Delete
              </button>`
            : ""
        }
      </div>
    `;

    list.appendChild(card);
  });

  if (IS_ADMIN) attachDeleteEvents();
}

function attachDeleteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();

      const index = btn.dataset.index;
      const confirmDelete = confirm(
        "Are you sure you want to delete this story?"
      );

      if (confirmDelete) {
        stories.splice(index, 1);
        renderStories();
      }
    });
  });
}

function openReader(story) {
  document.getElementById("library").classList.add("hidden");
  document.getElementById("reader").classList.remove("hidden");

  document.getElementById("reader-title").textContent = story.title;
  document.getElementById("reader-type").textContent =
    story.type === "ai" ? "AI-assisted writing" : "Human-written";

  document.getElementById("reader-content").textContent = story.content;
}



/* ---------- TABS ---------- */

function showTab(type, button) {
  document.querySelectorAll(".tab-btn").forEach(btn =>
    btn.classList.remove("active")
  );

  if (button) {
    button.classList.add("active");
  }

  renderStories(type);
}

/* ---------- DEFAULT LOAD ---------- */

document.addEventListener("DOMContentLoaded", () => {
  // Load AI stories by default
  renderStories("ai");
});

document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("reader").classList.add("hidden");
  document.getElementById("library").classList.remove("hidden");
});
