# 🚀 Task Tracker CLI

A lightweight, pure Node.js Command Line Interface tool to manage your daily tasks with a local JSON database.

## 🛠 Features
- **Zero External Dependencies**
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Status Tracking** (Todo, In-Progress, Done)

## 💻 Usage

### 1. Adding a new task
`node task-cli.js add "Buy groceries"`

### 2. Updating a task
`node task-cli.js update 1 "Buy groceries and cook dinner"`

### 3. Deleting a task
`node task-cli.js delete 1`

### 4. Changing Task Status
- **Mark as In-Progress:** `node task-cli.js mark-in-progress 1`
- **Mark as Done:** `node task-cli.js mark-done 1`

### 5. Listing Tasks
- **List All:** `node task-cli.js list`
- **List by Done:** `node task-cli.js list done`
- **List by Todo:** `node task-cli.js list todo`
- **List by In-Progress:** `node task-cli.js list in-progress`