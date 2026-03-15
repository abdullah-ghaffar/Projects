const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'tasks.json');

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

function addTask(description) {
    if (!description) return console.log("❌ Error: Task description missing!");
    const tasks = loadTasks();
    const newId = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;
    const now = new Date().toLocaleString();
    tasks.push({ id: newId, description, status: "todo", createdAt: now, updatedAt: now });
    saveTasks(tasks);
    console.log(`✅ Task added (ID: ${newId})`);
}

function listTasks(statusFilter) {
    const tasks = loadTasks();
    if (tasks.length === 0) return console.log("📭 No tasks found.");
    let filtered = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;
    if (filtered.length === 0) return console.log(`📭 No tasks found with status: ${statusFilter}`);
    console.log("\n--- Task List ---");
    filtered.forEach(t => {
        let icon = t.status === "done" ? "✅" : (t.status === "in-progress" ? "⏳" : "📝");
        console.log(`${icon} ID ${t.id}: ${t.description} [${t.status}]`);
    });
}

function updateTask(id, newDesc) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) return console.log("❌ Task not found.");
    task.description = newDesc;
    task.updatedAt = new Date().toLocaleString();
    saveTasks(tasks);
    console.log(`✅ Task ${id} updated.`);
}

function deleteTask(id) {
    let tasks = loadTasks();
    const newTasks = tasks.filter(t => t.id !== parseInt(id));
    if (tasks.length === newTasks.length) return console.log("❌ Task not found.");
    saveTasks(newTasks);
    console.log(`🗑️ Task ${id} deleted.`);
}

// NEW: Sabi tasks delete karne ka function
function deleteAllTasks() {
    saveTasks([]);
    console.log("🗑️ All tasks have been deleted successfully. Database is now empty.");
}

function markStatus(id, status) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) return console.log("❌ Task not found.");
    task.status = status;
    task.updatedAt = new Date().toLocaleString();
    saveTasks(tasks);
    console.log(`✅ Task ${id} marked as ${status}.`);
}

const args = process.argv.slice(2);
const cmd = args[0];

switch (cmd) {
    case "add": addTask(args[1]); break;
    case "list": listTasks(args[1]); break;
    case "update": updateTask(args[1], args[2]); break;
    case "delete": deleteTask(args[1]); break;
    case "clear": deleteAllTasks(); break; // New Command
    case "mark-in-progress": markStatus(args[1], "in-progress"); break;
    case "mark-done": markStatus(args[1], "done"); break;
    default: 
        console.log("\n--- Usage Commands ---");
        console.log("add <desc>, list, update <id> <desc>, delete <id>, clear, mark-done <id>");
}