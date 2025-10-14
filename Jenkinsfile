pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_HUB_USERNAME = 'jashank06'  // ← CHANGE THIS to your Docker Hub username
        DOCKER_IMAGE_FRONTEND = "${DOCKER_HUB_USERNAME}/portfolio-frontend"
        DOCKER_IMAGE_BACKEND = "${DOCKER_HUB_USERNAME}/portfolio-backend"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_LATEST = 'latest'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Environment Check') {
            steps {
                echo 'Checking environment...'
                sh 'node --version'
                sh 'npm --version'
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }
        
        stage('Install Frontend Dependencies') {
            steps {
                dir('Frontend') {
                    echo 'Installing frontend dependencies...'
                    sh 'npm ci'
                }
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                dir('Backend') {
                    echo 'Installing backend dependencies...'
                    sh 'npm ci'
                }
            }
        }
        
        stage('Run Frontend Tests') {
            steps {
                dir('Frontend') {
                    echo 'Running frontend tests...'
                    sh 'npm test -- --watchAll=false --passWithNoTests'
                }
            }
        }
        
        stage('Run Backend Tests') {
            steps {
                dir('Backend') {
                    echo 'Running backend tests...'
                    sh 'npm test || true'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    echo 'Building frontend...'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        dir('Frontend') {
                            echo 'Building frontend Docker image...'
                            sh """
                                docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} .
                                docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:${DOCKER_LATEST}
                            """
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        dir('Backend') {
                            echo 'Building backend Docker image...'
                            sh """
                                docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} .
                                docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:${DOCKER_LATEST}
                            """
                        }
                    }
                }
            }
        }
        
        stage('Run Security Scan') {
            steps {
                echo 'Running security scan...'
                script {
                    try {
                        sh "docker scan ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} || true"
                        sh "docker scan ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} || true"
                    } catch (Exception e) {
                        echo "Security scan failed or not available: ${e.message}"
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing images to registry...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${DOCKER_REGISTRY}
                        docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_LATEST}
                        docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_LATEST}
                        docker logout ${DOCKER_REGISTRY}
                    """
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying with Docker Compose...'
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                    docker-compose ps
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Running health checks...'
                script {
                    sleep(time: 30, unit: 'SECONDS')
                    sh '''
                        curl -f http://localhost:5001/health || exit 1
                        curl -f http://localhost:80 || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Pipeline completed successfully!'
            emailext(
                subject: "Jenkins Build #${BUILD_NUMBER} - SUCCESS",
                body: "Build completed successfully!\n\nBuild URL: ${BUILD_URL}",
                to: 'your-email@example.com'
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext(
                subject: "Jenkins Build #${BUILD_NUMBER} - FAILED",
                body: "Build failed!\n\nBuild URL: ${BUILD_URL}",
                to: 'your-email@example.com'
            )
        }
    }
}
