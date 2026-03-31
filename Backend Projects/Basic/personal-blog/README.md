```
# Personal Blog - Flask

Ek simple aur clean Personal Blog jisme aap articles likh, publish, edit aur delete kar sakte hain.

## Features
- Home page pe published articles ki list
- Individual article page
- Admin Dashboard (Add, Edit, Delete)
- Basic Login System
- Articles filesystem (JSON) mein save hote hain
- No JavaScript, sirf HTML + CSS + Flask

---

## Installation & Setup (Windows)

### 1. Project Folder Mein Jaayein
```powershell
cd personal-blog
```

### 2. Virtual Environment Banao

```
python -m venv venv
```

### 3. Virtual Environment Activate Karo

```
.\venv\Scripts\Activate.ps1
```

*(Agar error aaye to pehle yeh command chalayein:)*

```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

### 4. Dependencies Install Karo

```
pip install -r requirements.txt
```

### 5. .env File Banao

```
copy .env.example .env
```

### 6. Blog Run Karo

```
python run.py
```

Ab browser mein kholo: **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## How to Use

### Guest / Public Section

* **Home Page** : http://127.0.0.1:5000
  → Sab published articles list mein dikhte hain
* **Article Page** : Title pe click karne se pura article khulta hai

### Admin Section

1. Login page kholo:
   **[http://127.0.0.1:5000/admin/login](http://127.0.0.1:5000/admin/login)**
2. Credentials:
   * **Username** : admin
   * **Password** : fortune500blog2025
3. Admin Dashboard se aap kar sakte hain:
   * Naya article add karna (+ Add New Article)
   * Existing article edit karna
   * Article delete karna

---

## Default Credentials

* **Username** : admin
* **Password** : fortune500blog2025

> Note: Password change karne ke liye .env file mein ADMIN_PASSWORD edit karein.

---

## Project Structure (Important Folders)

```
personal-blog/
├── app/
│   ├── routes/          # public aur admin routes
│   ├── templates/       # HTML templates
│   ├── models/
│   ├── repositories/
│   └── services/
├── data/articles/       # Yahan sab articles JSON files mein save hote hain
├── static/css/
├── .env
├── requirements.txt
└── run.py
```

---

## Future Improvements (Ideas)

* Database (SQLite/PostgreSQL) use karna
* Markdown support for content
* Search functionality
* Categories aur Tags
* Comments system
* Image upload
* Docker support
