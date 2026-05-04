# 📝 NoteVault – 3-Tier Notepad Web App

A full-stack notepad application built with:
- **Frontend** → HTML + CSS + Vanilla JavaScript
- **Backend**  → Python (FastAPI)
- **Database** → MySQL

---

## 📁 Folder Structure

```
notepad-app/
├── frontend/
│   ├── index.html          ← Main HTML page
│   ├── css/
│   │   └── style.css       ← All styles
│   └── js/
│       └── app.js          ← All JS logic (API calls, DOM)
│
├── backend/
│   ├── main.py             ← FastAPI app (all routes)
│   └── requirements.txt    ← Python dependencies
│
├── database/
│   └── schema.sql          ← MySQL schema + sample data
│
└── README.md               ← This file
```

---

## ⚙️ Setup Instructions (Step by Step)

### ✅ Prerequisites
Make sure the following are installed on your system:
- **Python 3.10+** → https://python.org
- **MySQL 8.0+**  → https://dev.mysql.com/downloads/
- **VS Code**     → https://code.visualstudio.com
- **Live Server** VS Code extension (for frontend)

---

### 🛢️ Step 1 – Set Up MySQL Database

1. Open your MySQL shell or MySQL Workbench
2. Run the schema file:

```sql
source path/to/notepad-app/database/schema.sql;
```

Or paste the contents of `database/schema.sql` directly into MySQL Workbench and click **Execute**.

This will:
- Create the `notepad_db` database
- Create the `notes` table
- Insert 3 sample notes

---

### 🐍 Step 2 – Set Up Python Backend

1. Open a terminal in VS Code (`Ctrl + `` ` ``)
2. Navigate to the backend folder:

```bash
cd notepad-app/backend
```

3. Create a virtual environment:

```bash
python -m venv venv
```

4. Activate it:
- **Windows:**  `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

5. Install dependencies:

```bash
pip install -r requirements.txt
```

6. **Edit your MySQL password** in `main.py`:

Open `backend/main.py` and find this section (~line 22):

```python
DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",
    "password": "your_password",   # ← Change this to your MySQL password
    "database": "notepad_db",
}
```

7. Start the backend server:

```bash
uvicorn main:app --reload --port 5000
```

✅ You should see:
```
INFO: Uvicorn running on http://127.0.0.1:5000
```

8. Test it by opening in browser: http://localhost:5000

---

### 🌐 Step 3 – Open Frontend

**Option A – Using Live Server (Recommended)**
1. In VS Code, right-click on `frontend/index.html`
2. Click **"Open with Live Server"**
3. Browser opens automatically at `http://127.0.0.1:5500`

**Option B – Direct File**
1. Simply double-click `frontend/index.html` to open in your browser

> ⚠️ Note: The frontend connects to the backend at `http://localhost:5000`.
> Make sure the Python backend is running before opening the frontend.

---

## 🚀 Features

| Feature       | Description                          |
|---------------|--------------------------------------|
| ✅ Create Note | Add notes with title, content, color |
| ✅ Edit Note   | Update any note anytime              |
| ✅ Delete Note | Remove notes with confirmation       |
| ✅ Pin Notes   | Keep important notes on top          |
| ✅ Categories  | Organize into Work / Personal / General |
| ✅ Color Code  | 7 card background colors             |
| ✅ Search      | Instant client-side search           |
| ✅ Filter      | Filter by category or pinned         |

---

## 🔗 API Endpoints

| Method | URL                       | Description         |
|--------|---------------------------|---------------------|
| GET    | /notes                    | Get all notes       |
| GET    | /notes/{id}               | Get single note     |
| POST   | /notes                    | Create new note     |
| PUT    | /notes/{id}               | Update a note       |
| DELETE | /notes/{id}               | Delete a note       |
| GET    | /notes/search/{keyword}   | Search notes        |

API docs (auto-generated): http://localhost:5000/docs

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `CORS error` in browser | Make sure backend is running on port 5000 |
| `Access denied` for MySQL | Check password in `main.py` |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` again |
| Notes not showing | Check browser console (F12) for errors |

---

## 🎨 Tech Stack

| Layer    | Technology           |
|----------|----------------------|
| Frontend | HTML5, CSS3, JS (ES6)|
| Backend  | Python 3, FastAPI    |
| Database | MySQL 8              |
| Fonts    | Sora (Google Fonts)  |
| Icons    | Font Awesome 6       |
