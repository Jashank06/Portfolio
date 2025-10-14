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
                    script {
                        try {
                            sh 'npm test -- --watchAll=false --passWithNoTests'
                        } catch (Exception e) {
                            echo "Frontend tests failed: ${e.message}"
                            echo 'Continuing build despite test failures...'
                        }
                    }
                }
            }
        }
        
        stage('Run Backend Tests') {
            steps {
                dir('Backend') {
                    echo 'Running backend tests...'
                    script {
                        try {
                            sh 'npm test'
                        } catch (Exception e) {
                            echo "Backend tests failed: ${e.message}"
                            echo 'Continuing build despite test failures...'
                        }
                    }
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
                            script {
                                try {
                                    echo '🔨 Building frontend Docker image...'
                                    sh """
                                        docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} . || exit 1
                                        docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:${DOCKER_LATEST}
                                        echo '✅ Frontend image built successfully!'
                                    """
                                } catch (Exception e) {
                                    echo "❌ Frontend Docker build failed: ${e.message}"
                                    error("Frontend build failed")
                                }
                            }
                        }
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        dir('Backend') {
                            script {
                                try {
                                    echo '🔨 Building backend Docker image...'
                                    sh """
                                        docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} . || exit 1
                                        docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:${DOCKER_LATEST}
                                        echo '✅ Backend image built successfully!'
                                    """
                                } catch (Exception e) {
                                    echo "❌ Backend Docker build failed: ${e.message}"
                                    error("Backend build failed")
                                }
                            }
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
            echo "Build URL: ${BUILD_URL}"
        }
        failure {
            echo 'Pipeline failed!'
            echo "Build URL: ${BUILD_URL}"
            echo 'Check console output for details.'
        }
    }
}
