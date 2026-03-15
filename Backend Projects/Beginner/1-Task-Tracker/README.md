# 🚀 Task Tracker CLI

A lightweight, pure Node.js Command Line Interface tool to manage your daily tasks.

## 🛠 Features
- **Zero External Dependencies**
- **Full CRUD operations**
- **Status Tracking**
- **Bulk Delete (Clear All)**

## 💻 Usage

### 1. Basic Commands
- **Add Task:** `node task-cli.js add "My task"`
- **List All:** `node task-cli.js list`
- **Update Task:** `node task-cli.js update 1 "New description"`
- **Delete Single Task:** `node task-cli.js delete 1`
- **Delete ALL Tasks:** `node task-cli.js clear`

### 2. Changing Status
- **Mark In-Progress:** `node task-cli.js mark-in-progress 1`
- **Mark Done:** `node task-cli.js mark-done 1`

### 3. Filtering
- **Show Done:** `node task-cli.js list done`
- **Show Todo:** `node task-cli.js list todo`
- **Show In-Progress:** `node task-cli.js list in-progress`