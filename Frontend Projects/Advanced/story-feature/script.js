document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const storiesList = document.getElementById('stories-list');
    const storiesHeader = document.getElementById('stories-header');
    const storyViewer = document.getElementById('story-viewer');
    const storyImage = document.getElementById('story-image');
    const progressContainer = document.getElementById('progress-container');
    const closeBtn = document.getElementById('close-btn');
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');

    let stories = [];
    let currentIndex = 0;
    let currentProgressInterval;
    const STORY_DURATION = 3000; 
    const EXPIRY_TIME = 24 * 60 * 60 * 1000; 

    // Mouse Wheel Horizontal Scroll Fix
    storiesHeader.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            storiesHeader.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    });

    function init() {
        const stored = localStorage.getItem('user_stories');
        if (stored) {
            const parsed = JSON.parse(stored);
            const now = Date.now();
            stories = parsed.filter(story => (now - story.timestamp) < EXPIRY_TIME);
            saveStories();
        }
        renderThumbnails();
    }

    function saveStories() {
        localStorage.setItem('user_stories', JSON.stringify(stories));
    }

    function renderThumbnails() {
        storiesList.innerHTML = '';
        stories.forEach((story, index) => {
            const div = document.createElement('div');
            div.className = 'story-item';
            div.innerHTML = `<img src="${story.dataUrl}" class="story-avatar">`;
            div.addEventListener('click', () => openViewer(index));
            storiesList.appendChild(div);
        });
    }

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > 1080 || height > 1920) {
                    const ratio = Math.min(1080 / width, 1920 / height);
                    width *= ratio; height *= ratio;
                }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                stories.push({ id: Date.now(), dataUrl: canvas.toDataURL('image/jpeg', 0.8), timestamp: Date.now() });
                saveStories();
                renderThumbnails();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    function openViewer(index) {
        currentIndex = index;
        storyViewer.classList.add('active');
        renderProgressBars();
        playStory();
    }

    function renderProgressBars() {
        progressContainer.innerHTML = '';
        stories.forEach(() => {
            const bar = document.createElement('div').appendChild(document.createElement('div'));
            bar.parentElement.className = 'progress-bar';
            bar.className = 'progress-fill';
            progressContainer.appendChild(bar.parentElement);
        });
    }

    function playStory() {
        clearInterval(currentProgressInterval);
        storyImage.src = stories[currentIndex].dataUrl;
        const fills = document.querySelectorAll('.progress-fill');
        
        fills.forEach((fill, idx) => {
            if (idx < currentIndex) fill.style.width = '100%';
            else fill.style.width = '0%';
        });

        let startTime = Date.now();
        currentProgressInterval = setInterval(() => {
            let elapsed = Date.now() - startTime;
            let progress = (elapsed / STORY_DURATION) * 100;
            fills[currentIndex].style.width = `${Math.min(100, progress)}%`;
            if (elapsed >= STORY_DURATION) {
                clearInterval(currentProgressInterval);
                nextStory();
            }
        }, 10);
    }

    function nextStory() {
        if (currentIndex < stories.length - 1) { currentIndex++; playStory(); }
        else closeViewer();
    }

    function prevStory() {
        if (currentIndex > 0) { currentIndex--; playStory(); }
        else playStory();
    }

    navRight.addEventListener('click', nextStory);
    navLeft.addEventListener('click', prevStory);
    closeBtn.addEventListener('click', closeViewer);
    function closeViewer() { storyViewer.classList.remove('active'); clearInterval(currentProgressInterval); }

    init();
});