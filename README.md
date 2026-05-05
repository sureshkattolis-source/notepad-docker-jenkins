# 📝 NoteVault – Dockerized 3-Tier Notepad Web App

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

A fully Dockerized full-stack notepad application with a 3-tier architecture — Frontend, Backend, and Database — all orchestrated with Docker Compose and routed through Nginx as a reverse proxy.

---

## 🏗️ Architecture

```
Browser
   ↓
:80 → Nginx (Reverse Proxy)
         ├── /          → Frontend (Nginx static server)
         ├── /api/      → Backend  (FastAPI Python)
         └── /docs      → Swagger  (API Documentation)
                              ↓
                         MySQL 8.0 Database
```

---

## 📁 Project Structure

```
notepad-app/
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
│
├── database/
│   └── schema.sql
│
├── nginx/
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| ✅ Create Note | Add notes with title, content, color |
| ✅ Edit Note | Update any note anytime |
| ✅ Delete Note | Remove notes with confirmation |
| ✅ Pin Notes | Keep important notes on top |
| ✅ Categories | Organize into Work / Personal / General |
| ✅ Color Code | 7 card background colors |
| ✅ Search | Instant client-side search |
| ✅ Filter | Filter by category or pinned |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6) |
| Backend | Python 3.11, FastAPI, Pydantic v2 |
| Database | MySQL 8.0 |
| Reverse Proxy | Nginx Alpine |
| Containerization | Docker, Docker Compose |
| Fonts & Icons | Sora (Google Fonts), Font Awesome 6 |

---

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker + Docker Compose)
- [Git](https://git-scm.com/downloads)
- [VS Code](https://code.visualstudio.com) *(optional but recommended)*

Verify installations:
```bash
docker --version
docker compose version
git --version
```

---

## 🐳 Run with Docker (Recommended)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/notepad-app.git
cd notepad-app
```

### Step 2 — Start Docker Desktop

Open Docker Desktop and wait for the engine to show:
```
🟢 Engine running
```

### Step 3 — Build and Run

```bash
docker compose up --build
```

Wait for all containers to start. You will see:
```
✔ Container nodevault_db        Started
✔ Container nodevault_backend   Started
✔ Container nodevault_frontend  Started
✔ Container nodevault_nginx     Started
```

### Step 4 — Open in Browser

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost |
| 🔌 API | http://localhost/api/notes |
| 📄 Swagger Docs | http://localhost/docs |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/{id}` | Get single note |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |
| GET | `/api/notes/search/{keyword}` | Search notes |

---

## 🐋 Docker Services

| Container | Image | Port | Role |
|-----------|-------|------|------|
| `nodevault_nginx` | nginx:alpine | 80 | Reverse proxy / entry point |
| `nodevault_backend` | custom build | internal | FastAPI REST API |
| `nodevault_frontend` | custom build | internal | Static HTML/CSS/JS |
| `nodevault_db` | mysql:8.0 | 3307 | MySQL database |

> **Note:** Only Nginx (port 80) and MySQL (port 3307) are exposed to the host machine. Backend and Frontend are internal to the Docker network.

---

## 📦 Docker Commands

### Start the app
```bash
docker compose up --build
```

### Start in background (detached mode)
```bash
docker compose up --build -d
```

### Stop the app
```bash
docker compose down
```

### Stop and delete database volume (fresh start)
```bash
docker compose down -v
```

### View running containers
```bash
docker ps
```

### View logs
```bash
# All containers
docker compose logs

# Specific container
docker compose logs backend
docker compose logs mysql
docker compose logs nginx
```

### Restart a single service
```bash
docker compose restart backend
```

---

## 🔧 Configuration

### Database (docker-compose.yml)
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root1234
  MYSQL_DATABASE: notepad_db
```

### Backend DB Connection (via environment variables)
```yaml
environment:
  DB_HOST: mysql
  DB_USER: root
  DB_PASSWORD: root1234
  DB_NAME: notepad_db
```

> To change the password, update both `MYSQL_ROOT_PASSWORD` and `DB_PASSWORD` in `docker-compose.yml` to match.

---

## 🗄️ Database Schema

```sql
CREATE TABLE notes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL DEFAULT 'Untitled Note',
    content     TEXT,
    category    VARCHAR(100)  DEFAULT 'General',
    color       VARCHAR(20)   DEFAULT '#ffffff',
    is_pinned   TINYINT(1)    DEFAULT 0,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🌐 Nginx Reverse Proxy

Nginx routes all traffic through a single port (80):

```
http://localhost/          → Frontend (HTML/CSS/JS)
http://localhost/api/      → Backend  (FastAPI)
http://localhost/docs      → Swagger UI
http://localhost/openapi.json → OpenAPI Schema
```

This means:
- No need to expose backend or frontend ports directly
- All traffic is controlled and filtered through one entry point
- Easy to add HTTPS/SSL later

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `docker daemon not running` | Open Docker Desktop and wait for green engine indicator |
| `port 3306 already in use` | Local MySQL is running; schema uses port 3307 to avoid conflict |
| `port 80 already in use` | Stop any other web server using port 80 (e.g., IIS, Apache) |
| Notes not loading | Check browser console (F12) — backend may still be starting |
| `Access denied` MySQL error | Check `DB_PASSWORD` matches `MYSQL_ROOT_PASSWORD` in docker-compose.yml |
| Container exits immediately | Run `docker compose logs backend` to see the error |
| Fresh database needed | Run `docker compose down -v` then `docker compose up --build` |

---

## 💻 Run Locally Without Docker

If you want to run without Docker:

### 1. MySQL Setup
```sql
source path/to/database/schema.sql;
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

### 3. Frontend
Right-click `frontend/index.html` → Open with Live Server in VS Code

> Make sure `frontend/js/app.js` has `const API = "http://localhost:5000"` for local mode.

---

## 📤 Committing to GitHub

### First time setup
```bash
git init
git add .
git commit -m "Initial commit - Dockerized NoteVault app"
git branch -M main
git remote add origin https://github.com/your-username/notepad-app.git
git push -u origin main
```

### Subsequent pushes
```bash
git add .
git commit -m "your commit message"
git push
```

---

## 🙌 Author

**Suresh Kattoli**
- GitHub: [@sureshkattoli](https://github.com/sureshkattoli)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).