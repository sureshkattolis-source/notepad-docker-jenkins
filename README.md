# 📝 NoteVault – Dockerized 3-Tier Notepad Web App with CI/CD

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![DockerHub](https://img.shields.io/badge/Docker%20Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A fully Dockerized full-stack notepad application with a 3-tier architecture — Frontend, Backend, and Database — all orchestrated with Docker Compose, routed through Nginx as a reverse proxy, deployed on AWS EC2, and automated with a Jenkins CI/CD pipeline.

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

## 🔄 CI/CD Pipeline Flow

```
Developer pushes code to GitHub
            ↓
GitHub Webhook triggers Jenkins automatically
            ↓
Jenkins Pipeline runs:
   ├── 📥 Clone Code from GitHub
   ├── 🐳 Build Docker Images
   ├── 📦 Push Images to Docker Hub
   └── 🚀 Deploy to AWS EC2
            ↓
App is live on the internet 🌍
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
├── Jenkinsfile
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
| CI/CD | Jenkins |
| Cloud | AWS EC2 |
| Image Registry | Docker Hub |
| Fonts & Icons | Sora (Google Fonts), Font Awesome 6 |

---

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/downloads)
- [VS Code](https://code.visualstudio.com) *(optional but recommended)*

Verify installations:
```bash
docker --version
docker-compose --version
git --version
```

---

## 🐳 Part 1 — Run with Docker (Local)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sureshkattolis-source/notepad-docker-jenkins.git
cd notepad-docker-jenkins
```

### Step 2 — Start Docker Desktop

Open Docker Desktop and wait for the engine to show:
```
🟢 Engine running
```

### Step 3 — Build and Run

```bash
docker-compose up --build
```

Wait for all containers to start:
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

> **Note:** Only Nginx (port 80) and MySQL (port 3307) are exposed to the host machine.

---

## 📦 Docker Commands

```bash
# Start the app
docker-compose up --build

# Start in background
docker-compose up --build -d

# Stop the app
docker-compose down

# Stop and delete database (fresh start)
docker-compose down -v

# View running containers
docker ps

# View logs
docker-compose logs
docker-compose logs backend
docker-compose logs nginx

# Restart a single service
docker-compose restart backend
```

---

## 🔧 Configuration

### Database (docker-compose.yml)
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root1234
  MYSQL_DATABASE: notepad_db
```

### Backend DB Connection
```yaml
environment:
  DB_HOST: mysql
  DB_USER: root
  DB_PASSWORD: root1234
  DB_NAME: notepad_db
```

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
http://localhost/               → Frontend (HTML/CSS/JS)
http://localhost/api/           → Backend  (FastAPI)
http://localhost/docs           → Swagger UI
http://localhost/openapi.json   → OpenAPI Schema
```

Benefits:
- Only port 80 exposed to the world
- Backend and Frontend hidden inside Docker network
- Easy to add HTTPS/SSL later

---

## ☁️ Part 2 — AWS EC2 Deployment

### Infrastructure

| Server | Purpose |
|--------|---------|
| EC2 #1 — `notevault-server` | Runs NoteVault app |
| EC2 #2 — `jenkins-server` | Runs Jenkins CI/CD |

### NoteVault EC2 Setup

```bash
# Connect to EC2
ssh -i notevault-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Install Docker
sudo apt update -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-v2 -y

# Clone and run
git clone https://github.com/sureshkattolis-source/notepad-docker-jenkins.git
cd notepad-docker-jenkins
docker-compose up -d
```

### Security Group Rules

| Port | Purpose |
|------|---------|
| 22 | SSH access |
| 80 | HTTP (Nginx) |

---

## 🔄 Part 3 — Jenkins CI/CD Pipeline

### Jenkins EC2 Setup

```bash
# Connect to Jenkins EC2
ssh -i jenkins-key.pem ubuntu@JENKINS_EC2_PUBLIC_IP

# Install Java 21
sudo apt update -y
sudo apt install fontconfig openjdk-21-jre -y

# Add Jenkins repo
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update -y
sudo apt install jenkins -y

# Install Docker
sudo apt install docker.io -y
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Access Jenkins

```
http://JENKINS_EC2_PUBLIC_IP:8080
```

Get initial password:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Jenkins Security Group Rules

| Port | Purpose |
|------|---------|
| 22 | SSH access |
| 8080 | Jenkins UI |

### Jenkins Plugins Required

| Plugin | Purpose |
|--------|---------|
| Docker Pipeline | Build & push Docker images |
| SSH Agent | SSH into EC2 |
| GitHub Integration | Connect GitHub webhook |
| Pipeline Stage View | Visualize pipeline stages |

### Jenkins Credentials

| ID | Kind | Purpose |
|----|------|---------|
| `dockerhub-creds` | Username & Password | Docker Hub login |
| `ec2-ssh-key` | SSH Username with Private Key | SSH into NoteVault EC2 |

---

## 📄 Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        EC2_IP = 'YOUR_NOTEVAULT_EC2_PUBLIC_IP'
    }

    stages {

        stage('Clone Code') {
            steps {
                echo '📥 Cloning from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/sureshkattolis-source/notepad-docker-jenkins.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh 'docker-compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📦 Pushing to Docker Hub...'
                sh '''
                    echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                    docker tag dockerized-notevault-app-backend:latest kattolisuresh/notevault-backend:latest
                    docker tag dockerized-notevault-app-frontend:latest kattolisuresh/notevault-frontend:latest
                    docker push kattolisuresh/notevault-backend:latest
                    docker push kattolisuresh/notevault-frontend:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '🚀 Deploying to AWS EC2...'
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} "
                        mkdir -p ~/apps &&
                        cd ~/apps &&
                        if [ ! -d Dockerized-NoteVault-app ]; then
                            git clone https://github.com/sureshkattolis-source/notepad-docker-jenkins.git Dockerized-NoteVault-app
                        fi &&
                        cd Dockerized-NoteVault-app &&
                        git checkout main &&
                        git pull origin main &&
                        docker-compose down &&
                        docker-compose pull &&
                        docker-compose up -d
                    "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful! NoteVault is live 🚀'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
    }
}
```

---

## 🔗 GitHub Webhook Setup

Auto-triggers Jenkins on every `git push`:

1. Go to GitHub repo → **Settings** → **Webhooks** → **Add webhook**
2. Fill in:

| Field | Value |
|-------|-------|
| Payload URL | `http://JENKINS_EC2_PUBLIC_IP:8080/github-webhook/` |
| Content type | `application/json` |
| Which events | Just the push event ✅ |

3. In Jenkins job → **Configure** → **Build Triggers** → ✅ **GitHub hook trigger for GITScm polling**

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `docker daemon not running` | Open Docker Desktop, wait for 🟢 |
| `port 3306 already in use` | Local MySQL running — use port 3307 |
| `port 80 already in use` | Stop IIS/Apache |
| Notes not loading on EC2 | Check `app.js` API URL points to EC2 public IP |
| Jenkins node offline | Lower disk threshold in Manage Jenkins → System |
| `docker compose` not found | Use `docker-compose` (with hyphen) in Jenkinsfile |
| Jenkins can't push to Docker Hub | Check `dockerhub-creds` ID matches Jenkinsfile |
| SSH deploy failing | Make sure NoteVault EC2 PEM is added as `ec2-ssh-key` |
| Container exits immediately | Run `docker-compose logs backend` to debug |

---

## 💻 Run Locally Without Docker

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

---

## 📤 Push to GitHub

```bash
git add .
git commit -m "your commit message"
git push
```

---

## 🙌 Author

**Suresh Kattoli**
- GitHub: [@sureshkattolis-source](https://github.com/sureshkattolis-source)
- Docker Hub: [kattolisuresh](https://hub.docker.com/u/kattolisuresh)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).