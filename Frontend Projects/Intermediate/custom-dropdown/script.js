const items = [
  "First Item",
  "Second Item",
  "Third Item",
  "Fourth Item",
  "Fifth Item",
  "Sixth Item",
  "Seventh Item"
];

const trigger = document.getElementById('trigger');
const selectedText = document.getElementById('selected-text');
const arrow = document.getElementById('arrow');
const menu = document.getElementById('menu');
const optionsList = document.getElementById('options-list');

let selectedItem = null;

// Render options
function renderOptions() {
  optionsList.innerHTML = '';
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    
    if (selectedItem === item) {
      li.classList.add('selected');
      li.innerHTML = `
        ${item}
        <span class="checkmark">✓</span>
      `;
    }
    
    li.addEventListener('click', () => {
      selectedItem = item;
      selectedText.textContent = item;
      trigger.classList.remove('active');
      arrow.classList.remove('up');
      menu.classList.remove('show');
      renderOptions(); // Re-render to show checkmark
    });
    
    optionsList.appendChild(li);
  });
}

// Toggle dropdown
trigger.addEventListener('click', () => {
  const isOpen = menu.classList.contains('show');
  
  if (isOpen) {
    trigger.classList.remove('active');
    arrow.classList.remove('up');
    menu.classList.remove('show');
  } else {
    trigger.classList.add('active');
    arrow.classList.add('up');
    menu.classList.add('show');
    renderOptions();
  }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!trigger.contains(e.target) && !menu.contains(e.target)) {
    trigger.classList.remove('active');
    arrow.classList.remove('up');
    menu.classList.remove('show');
  }
});

// Initial render
renderOptions();