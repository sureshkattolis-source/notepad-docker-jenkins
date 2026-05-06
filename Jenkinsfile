pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        EC2_IP = '54.88.106.143'
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
                sh 'docker compose build'
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

                        docker compose down &&
                        docker compose pull &&
                        docker compose up -d
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