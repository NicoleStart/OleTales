// Get all stories from localStorage
function getAllStories() {
  const stories = JSON.parse(localStorage.getItem('stories')) || [];
  return stories;
}

// Save a story to localStorage
function saveStory(story) {
  const stories = getAllStories();
  stories.push(story);
  localStorage.setItem('stories', JSON.stringify(stories));
}

// Handle story form submission
const form = document.getElementById('story-form');
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const type = document.getElementById('type').value;

    saveStory({title, content, type});
    alert('Story saved!');
    form.reset();
  });
}

// Display stories on landing page
function filterStories(type) {
  const storyList = document.getElementById('story-list');
  if(!storyList) return;

  const stories = getAllStories();
  storyList.innerHTML = '';

  const filtered = type === 'all' ? stories : stories.filter(s => s.type === type);

  filtered.forEach(story => {
    const div = document.createElement('div');
    div.className = 'story';
    div.innerHTML = `<h2>${story.title} <span class="badge">${story.type === 'ai' ? '🤖 AI-assisted' : '✍️ Human-only'}</span></h2>
                     <p>${story.content.substring(0, 150)}...</p>`;
    storyList.appendChild(div);
  });

  if(filtered.length === 0){
    storyList.innerHTML = "<p>No stories found.</p>";
  }
}
