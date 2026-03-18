/**
 * 0.001% ELITE ARCHITECT BREAKDOWN: TASK TRACKER CLI
 */

// ---------------------------------------------------------
// LAYER 1: LOW-LEVEL SYSTEM BINDINGS (The "require" Phase)
// ---------------------------------------------------------

// [Linguistic]: 'require' ka matlab hai "Zaroorat". 'fs' (File System).
// [Architectural]: V8 Engine ko OS ke "I/O Controller" ke saath link karna.
// Yeh line Hardware aur Software ke darmiyan aik "Permission Bridge" kholti hai.
const fs = require('fs'); 

// [Linguistic]: 'path' ka matlab hai "Rasta".
// [Architectural]: Operating System ke "File Tree" ko cross-platform compatible banana.
// Taake code Windows, Mac, aur Linux teeno par sahi address dhoond sake.
const path = require('path'); 

// [Architectural]: Static Configuration. Absolute Path Calculation.
// '__dirname' current folder ka path nikalta hai taake file ka address "Hard-coded" na ho.
const FILE_PATH = path.join(__dirname, 'tasks.json');


// ---------------------------------------------------------
// LAYER 2: PERSISTENCE LAYER (Disk-to-RAM Hydration)
// ---------------------------------------------------------

// [Linguistic]: 'load' = Uthana. 'parse' = Tukre karke samajhna.
// [Architectural]: "De-serialization". SSD par pare "Dead Bytes" (JSON String) ko 
// RAM mein "Living Objects" (JS Array) mein badalna.
function loadTasks() {
    // [Architectural]: Guard Clause. Check karna ke kya database physically mojood hai.
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
        return [];
    }
    // [Linguistic]: 'readFileSync' = Buffer ko "Synchronously" parhna.
    // [Architectural]: Blocking I/O Operation. CPU wait karega jab tak SSD data na bhej de.
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return data ? JSON.parse(data) : [];
}

// [Linguistic]: 'stringify' = Dhage mein pirona (String banana).
// [Architectural]: "Serialization". RAM ke volatile data ko persistent string mein badal kar 
// SSD ke sectors mein physically write karna.
function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}


// ---------------------------------------------------------
// LAYER 3: CORE BUSINESS LOGIC (State Mutation)
// ---------------------------------------------------------

// [Architectural]: Atomic Write Operation. Naya Record banana.
function addTask(description) {
    if (!description) return console.log("❌ Error: Task description missing!");
    
    // RAM Hydration
    const tasks = loadTasks(); 
    
    // [Architectural]: Primary Key Generation. Linear increment logic.
    const newId = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;
    const now = new Date().toLocaleString();
    
    // [Architectural]: Data Modeling. Ek anonymous object ko heap memory mein allocate karna.
    tasks.push({ id: newId, description, status: "todo", createdAt: now, updatedAt: now });
    
    // Disk Sync
    saveTasks(tasks); 
    console.log(`✅ Task added (ID: ${newId})`);
}

// [Architectural]: Data Projection. Memory mein mojood array ko filter karke view banana.
function listTasks(statusFilter) {
    const tasks = loadTasks();
    if (tasks.length === 0) return console.log("📭 No tasks found.");

    // [Architectural]: Predicate Filtering. O(N) complexity mein array traverse karna.
    let filtered = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;
    
    if (filtered.length === 0) return console.log(`📭 No tasks found with status: ${statusFilter}`);
    
    console.log("\n--- Task List ---");
    filtered.forEach(t => {
        let icon = t.status === "done" ? "✅" : (t.status === "in-progress" ? "⏳" : "📝");
        console.log(`${icon} ID ${t.id}: ${t.description} [${t.status}]`);
    });
}

// [Architectural]: In-Memory Pointer Update. 
function updateTask(id, newDesc) {
    const tasks = loadTasks();
    // [Linguistic]: 'find' = Dhoondna. 
    // [Architectural]: Linear Search. Reference pakarna taake original object mutate ho.
    const task = tasks.find(t => t.id === parseInt(id));
    
    if (!task) return console.log("❌ Task not found.");
    
    task.description = newDesc; 
    task.updatedAt = new Date().toLocaleString(); 
    saveTasks(tasks); 
    console.log(`✅ Task ${id} updated.`);
}

// [Architectural]: Non-Destructive Filtering. Purani array ko filter karke replace karna.
function deleteTask(id) {
    let tasks = loadTasks();
    const newTasks = tasks.filter(t => t.id !== parseInt(id));
    
    if (tasks.length === newTasks.length) return console.log("❌ Task not found.");
    
    saveTasks(newTasks); 
    console.log(`🗑️ Task ${id} deleted.`);
}

// [Architectural]: Wipe Operation. Puray file buffer ko reset karna.
function deleteAllTasks() {
    saveTasks([]); 
    console.log("🗑️ All tasks deleted.");
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


// ---------------------------------------------------------
// LAYER 4: INTERFACE ADAPTER (CLI Argument Parsing)
// ---------------------------------------------------------

// [Linguistic]: 'argv' = Argument Vector (Rasta/Saman).
// [Architectural]: User-provided strings ko OS Buffer se nikal kar JS Array mein lana.
const args = process.argv.slice(2); 
const cmd = args[0]; 

// [Architectural]: Command Router. 'cmd' ki base par executable branch chun-na.
switch (cmd) {
    case "add": addTask(args[1]); break;
    case "list": listTasks(args[1]); break;
    case "update": updateTask(args[1], args[2]); break;
    case "delete": deleteTask(args[1]); break;
    case "clear": deleteAllTasks(); break; 
    case "mark-in-progress": markStatus(args[1], "in-progress"); break;
    case "mark-done": markStatus(args[1], "done"); break;
}