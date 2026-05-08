pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        EC2_IP = '3.86.46.15'
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
                    docker tag notevault-pipeline-backend:latest kattolisuresh/notevault-backend:latest
                    docker tag notevault-pipeline-frontend:latest kattolisuresh/notevault-frontend:latest
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
                        cd ~/apps/Dockerized-NoteVault-app &&
                        git pull origin main &&
                        docker rm -f nodevault_db nodevault_backend nodevault_frontend nodevault_nginx || true &&
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