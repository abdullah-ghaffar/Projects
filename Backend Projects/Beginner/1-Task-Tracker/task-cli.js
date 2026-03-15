// Node.js ka built-in 'fs' (File System) module
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'tasks.json');

// ==========================================
// DATABASE LOGIC (Load & Save)
// ==========================================

function loadTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// ==========================================
// CORE FEATURES
// ==========================================

// 1. ADD TASK
function addTask(description) {
    if (!description) {
        console.log("❌ Error: Task description is required!");
        return;
    }
    const tasks = loadTasks();
    const newId = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;
    const now = new Date().toLocaleString();

    const newTask = {
        id: newId,
        description: description,
        status: "todo",
        createdAt: now,
        updatedAt: now
    };

    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`✅ Task added successfully (ID: ${newId})`);
}

// 2. LIST TASKS
function listTasks(statusFilter) {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log("📭 No tasks found.");
        return;
    }

    let tasksToShow = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;

    if (tasksToShow.length === 0) {
        console.log(`📭 No tasks with status '${statusFilter}' found.`);
        return;
    }

    console.log("\n--- Your Task List ---");
    tasksToShow.forEach(t => {
        let icon = t.status === "done" ? "✅" : (t.status === "in-progress" ? "⏳" : "📝");
        console.log(`${icon} ID ${t.id}: ${t.description} [${t.status}]`);
    });
    console.log("----------------------\n");
}

// 3. UPDATE TASK
function updateTask(id, newDesc) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(id));

    if (!task) {
        console.log(`❌ Error: Task with ID ${id} not found.`);
        return;
    }

    task.description = newDesc;
    task.updatedAt = new Date().toLocaleString();
    saveTasks(tasks);
    console.log(`✅ Task ${id} updated successfully.`);
}

// 4. DELETE TASK
function deleteTask(id) {
    let tasks = loadTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== parseInt(id));

    if (tasks.length === initialLength) {
        console.log(`❌ Error: Task with ID ${id} not found.`);
        return;
    }

    saveTasks(tasks);
    console.log(`🗑️ Task ${id} deleted successfully.`);
}

// 5. MARK STATUS (Done / In-Progress)
function markStatus(id, status) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(id));

    if (!task) {
        console.log(`❌ Error: Task with ID ${id} not found.`);
        return;
    }

    task.status = status;
    task.updatedAt = new Date().toLocaleString();
    saveTasks(tasks);
    console.log(`✅ Task ${id} marked as ${status}.`);
}

// ==========================================
// THE ROUTER (Command Handler)
// ==========================================

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case "add":
        addTask(args[1]);
        break;
    case "list":
        listTasks(args[1]);
        break;
    case "update":
        updateTask(args[1], args[2]);
        break;
    case "delete":
        deleteTask(args[1]);
        break;
    case "mark-in-progress":
        markStatus(args[1], "in-progress");
        break;
    case "mark-done":
        markStatus(args[1], "done");
        break;
    default:
        console.log("\n--- CLI Task Tracker ---");
        console.log("Commands:");
        console.log("  add <description>           - Add a new task");
        console.log("  list [status]               - List tasks (optional: todo, in-progress, done)");
        console.log("  update <id> <description>   - Update a task's description");
        console.log("  delete <id>                 - Delete a task");
        console.log("  mark-in-progress <id>       - Set status to in-progress");
        console.log("  mark-done <id>              - Set status to done");
        break;
}