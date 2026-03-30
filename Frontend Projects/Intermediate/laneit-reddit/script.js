const lanesContainer = document.getElementById('lanes-container');
const popup = document.getElementById('popup');
const subredditInput = document.getElementById('subreddit-input');
const addBtn = document.getElementById('add-btn');
const cancelBtn = document.getElementById('cancel-btn');

let lanes = JSON.parse(localStorage.getItem('redditLanes')) || [
  { name: "learnprogramming" },
  { name: "javascript" },
  { name: "pakistan" }
];

function saveLanes() {
  localStorage.setItem('redditLanes', JSON.stringify(lanes));
}

async function fetchPosts(subreddit, laneElement) {
  const postsContainer = laneElement.querySelector('.posts');
  postsContainer.innerHTML = `<p style="text-align:center; color:#64748b; padding:30px;">Loading r/${subreddit}...</p>`;

  try {
    let clean = subreddit.toLowerCase().trim();
    if (clean.startsWith("r/")) clean = clean.slice(2);
    if (clean.includes("/")) clean = clean.split("/")[0];

    const proxy = "https://corsproxy.io/?";
    const url = `https://www.reddit.com/r/${clean}.json`;

    const res = await fetch(proxy + encodeURIComponent(url));
    if (!res.ok) throw new Error("Invalid subreddit");

    const data = await res.json();

    postsContainer.innerHTML = '';

    data.data.children.forEach(post => {
      const p = post.data;
      const postEl = document.createElement('div');
      postEl.className = 'post';
      postEl.innerHTML = `
        <div class="post-title">${p.title}</div>
        <div class="post-meta">
          ▲ ${p.ups || 0} &nbsp;&nbsp; 💬 ${p.num_comments || 0}
        </div>
      `;
      postEl.onclick = () => window.open(`https://reddit.com${p.permalink}`, '_blank');
      postsContainer.appendChild(postEl);
    });
  } catch (err) {
    postsContainer.innerHTML = `<p style="color:#f87171; text-align:center; padding:30px;">Failed to load r/${subreddit}</p>`;
  }
}

function createLane(subreddit) {
  const lane = document.createElement('div');
  lane.className = 'lane';
  lane.innerHTML = `
    <div class="lane-header">
      <span>r/${subreddit}</span>
      <span class="delete" title="Delete Lane">✕</span>
    </div>
    <div class="posts"></div>
  `;

  lane.querySelector('.delete').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Delete r/${subreddit} lane?`)) {
      lanes = lanes.filter(l => l.name !== subreddit);
      saveLanes();
      lane.remove();
    }
  });

  lanesContainer.appendChild(lane);
  fetchPosts(subreddit, lane);
}

// Add new subreddit
addBtn.addEventListener('click', () => {
  let name = subredditInput.value.trim().toLowerCase();

  if (name.includes("reddit.com/r/")) {
    name = name.split("reddit.com/r/")[1].split("/")[0];
  }
  if (name.startsWith("r/")) name = name.slice(2);

  if (!name) return;

  if (lanes.some(l => l.name.toLowerCase() === name)) {
    alert("This subreddit is already added!");
    return;
  }

  lanes.push({ name });
  saveLanes();
  createLane(name);
  popup.style.display = 'none';
  subredditInput.value = '';
});

cancelBtn.addEventListener('click', () => popup.style.display = 'none');

document.getElementById('add-lane-btn').addEventListener('click', () => {
  popup.style.display = 'flex';
  subredditInput.focus();
});

// Initial load
lanes.forEach(lane => createLane(lane.name));