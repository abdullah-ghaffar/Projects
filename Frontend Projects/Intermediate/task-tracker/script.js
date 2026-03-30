document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    let tasks = [];

    // 1. Function to Render Tasks
    function renderTasks() {
        // Clear the current list
        taskList.innerHTML = '';

        // Sort: Pending tasks first, Completed tasks last
        const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

        sortedTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <div class="checkbox" onclick="toggleTask(${task.id})"></div>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            taskList.appendChild(li);
        });
    }

    // 2. Add New Task
    function addTask() {
        const text = taskInput.value.trim();
        if (text !== '') {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
        }
    }

    // 3. Toggle Complete/Incomplete (Global so HTML can call it)
    window.toggleTask = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    };

    // 4. Delete Task
    window.deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    };

    // Event Listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});