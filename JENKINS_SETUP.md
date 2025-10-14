# 🚀 Jenkins CI/CD Setup Guide with Docker Hub

## 📋 Prerequisites

- Jenkins installed (version 2.x or higher)
- Docker installed on Jenkins server
- Docker Hub account
- Git repository access

---

## 🔧 Step 1: Install Jenkins Plugins

### Required Plugins:
1. **Docker Pipeline** - For Docker commands in pipeline
2. **Docker Plugin** - Docker integration
3. **Git Plugin** - For Git operations
4. **Email Extension Plugin** - For notifications
5. **Pipeline** - For pipeline support

### Installation Steps:
1. Go to: **Jenkins Dashboard → Manage Jenkins → Manage Plugins**
2. Click on **Available** tab
3. Search and install:
   - `Docker Pipeline`
   - `Docker Plugin`
   - `Git Plugin`
   - `Email Extension Plugin`
4. Click **Install without restart**
5. Wait for installation to complete

---

## 🔐 Step 2: Add Docker Hub Credentials

### Method 1: Using Jenkins UI (Recommended)

1. **Navigate to Credentials:**
   ```
   Jenkins Dashboard → Manage Jenkins → Manage Credentials
   ```

2. **Select Domain:**
   - Click on **(global)** domain
   - Or click **Add domain** for new domain

3. **Add Credentials:**
   - Click **Add Credentials** (on the left sidebar)

4. **Fill in the Details:**
   ```
   Kind: Username with password
   Scope: Global (Jenkins, nodes, items, all child items, etc)
   Username: [Your Docker Hub Username]
   Password: [Your Docker Hub Password or Access Token]
   ID: dockerhub
   Description: Docker Hub Credentials for Image Push
   ```

5. **Click "Create"**

### Method 2: Using Docker Hub Access Token (More Secure)

1. **Create Docker Hub Access Token:**
   - Go to https://hub.docker.com
   - Click on your profile → **Account Settings**
   - Go to **Security** tab
   - Click **New Access Token**
   - Name: `jenkins-ci`
   - Access permissions: `Read, Write, Delete`
   - Copy the generated token

2. **Add Token to Jenkins:**
   ```
   Kind: Username with password
   Username: [Your Docker Hub Username]
   Password: [Paste the Access Token here]
   ID: dockerhub
   Description: Docker Hub Access Token
   ```

### Method 3: Using Jenkins CLI

```bash
# Create credentials XML file
cat > docker-hub-creds.xml << EOF
<com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
  <scope>GLOBAL</scope>
  <id>dockerhub</id>
  <description>Docker Hub Credentials</description>
  <username>YOUR_DOCKER_USERNAME</username>
  <password>YOUR_DOCKER_PASSWORD</password>
</com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
EOF

# Import using Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080/ \
  create-credentials-by-xml system::system::jenkins _ < docker-hub-creds.xml
```

---

## 📝 Step 3: Update Jenkinsfile with Your Docker Hub Username

Update the `Jenkinsfile` with your Docker Hub username:

```groovy
environment {
    DOCKER_REGISTRY = 'docker.io'
    DOCKER_HUB_USERNAME = 'YOUR_DOCKER_USERNAME'  // ← Change this
    DOCKER_IMAGE_FRONTEND = "${DOCKER_HUB_USERNAME}/portfolio-frontend"
    DOCKER_IMAGE_BACKEND = "${DOCKER_HUB_USERNAME}/portfolio-backend"
    DOCKER_TAG = "${env.BUILD_NUMBER}"
    DOCKER_LATEST = 'latest'
}
```

---

## 🔄 Step 4: Create Jenkins Pipeline Job

### Create New Pipeline:

1. **Go to Jenkins Dashboard**
2. **Click "New Item"**
3. **Enter Job Details:**
   ```
   Name: Portfolio-CI-CD
   Type: Pipeline
   ```
4. **Click "OK"**

### Configure Pipeline:

1. **General Settings:**
   - Description: `CI/CD Pipeline for Portfolio Project`
   - ☑️ GitHub project: `https://github.com/YOUR_USERNAME/Portfolio`

2. **Build Triggers:**
   - ☑️ Poll SCM: `H/5 * * * *` (every 5 minutes)
   - Or ☑️ GitHub hook trigger for GITScm polling

3. **Pipeline Configuration:**
   ```
   Definition: Pipeline script from SCM
   SCM: Git
   Repository URL: https://github.com/YOUR_USERNAME/Portfolio.git
   Credentials: [Your Git credentials]
   Branch Specifier: */main
   Script Path: Jenkinsfile
   ```

4. **Click "Save"**

---

## 📧 Step 5: Configure Email Notifications

### Configure Email Extension:

1. **Go to:** `Manage Jenkins → Configure System`

2. **Scroll to "Extended E-mail Notification":**
   ```
   SMTP server: smtp.gmail.com
   SMTP Port: 465
   Use SSL: ☑️ Checked
   ```

3. **Add Credentials:**
   - Click "Add" next to "Credentials"
   - Username: `your-email@gmail.com`
   - Password: `[App Password - not regular password]`

4. **Configure Default Recipients:**
   ```
   Default Recipients: your-email@gmail.com
   Default Subject: $PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!
   Default Content: $DEFAULT_CONTENT
   ```

5. **For Gmail - Create App Password:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Go to: App passwords
   - Select app: Mail
   - Select device: Other (Jenkins)
   - Copy generated password
   - Use this password in Jenkins

---

## 🐳 Step 6: Configure Docker on Jenkins Server

### Install Docker on Jenkins Server:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io -y

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins
```

### Verify Docker Access:

```bash
# SSH to Jenkins server
docker --version
docker ps

# Test as Jenkins user
sudo -u jenkins docker ps
```

---

## ✅ Step 7: Test Pipeline

### Run Pipeline Manually:

1. Go to your Pipeline job
2. Click **"Build Now"**
3. Watch the Console Output
4. Verify stages:
   - ✅ Checkout
   - ✅ Environment Check
   - ✅ Install Dependencies
   - ✅ Run Tests
   - ✅ Build Frontend
   - ✅ Build Docker Images
   - ✅ Push to Docker Hub
   - ✅ Deploy

### Verify Docker Hub:

1. Go to https://hub.docker.com
2. Check your repositories:
   - `YOUR_USERNAME/portfolio-frontend`
   - `YOUR_USERNAME/portfolio-backend`
3. Verify tags: `latest` and build number

---

## 🔍 Troubleshooting

### Issue 1: Docker Command Not Found

**Error:** `docker: command not found`

**Solution:**
```bash
# SSH to Jenkins server
which docker
sudo ln -s /usr/bin/docker /usr/local/bin/docker

# Add to Jenkins PATH
sudo nano /etc/default/jenkins
# Add: PATH="/usr/local/bin:$PATH"
sudo systemctl restart jenkins
```

### Issue 2: Permission Denied on Docker

**Error:** `permission denied while trying to connect to the Docker daemon socket`

**Solution:**
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Or restart Jenkins container if using Docker
docker restart jenkins
```

### Issue 3: Docker Login Failed

**Error:** `Error response from daemon: Get https://registry-1.docker.io/v2/: unauthorized`

**Solution:**
- Verify credentials in Jenkins
- Check credential ID matches: `dockerhub`
- Try creating new Access Token on Docker Hub
- Test login manually:
```bash
sudo -u jenkins docker login -u YOUR_USERNAME
```

### Issue 4: Cannot Push to Docker Hub

**Error:** `denied: requested access to the resource is denied`

**Solution:**
```bash
# Create repositories on Docker Hub first
# Or enable auto-create in Docker Hub settings

# Verify image name format:
# Should be: YOUR_USERNAME/image-name:tag
docker tag portfolio-frontend:latest YOUR_USERNAME/portfolio-frontend:latest
```

---

## 📋 Complete Jenkinsfile with Docker Hub Push

Here's the updated Jenkinsfile with your username:

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_HUB_USERNAME = 'YOUR_DOCKER_USERNAME'  // ← Change this
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
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('Frontend') {
                            sh """
                                docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} .
                                docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:${DOCKER_LATEST}
                            """
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        dir('Backend') {
                            sh """
                                docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} .
                                docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:${DOCKER_LATEST}
                            """
                        }
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
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
    }
}
```

---

## 🔐 Security Best Practices

1. **Use Access Tokens** instead of passwords
2. **Never commit credentials** to Git
3. **Use Jenkins Credentials** store only
4. **Rotate tokens** regularly (every 3-6 months)
5. **Limit token scope** to minimum required
6. **Enable 2FA** on Docker Hub account
7. **Use separate tokens** for different projects

---

## 📊 Monitoring Pipeline

### View Build History:
```
Jenkins Dashboard → Your Job → Build History
```

### View Console Output:
```
Click on build number → Console Output
```

### View Docker Hub Activity:
```
Docker Hub → Your Repository → Activity
```

---

## 🚀 Next Steps

1. **Set up Webhooks** for auto-build on Git push
2. **Add Slack/Discord** notifications
3. **Configure staging** environment
4. **Set up automated** rollback
5. **Add performance** testing
6. **Implement blue-green** deployment

---

## 📞 Support

If you encounter issues:
1. Check Jenkins logs: `/var/log/jenkins/jenkins.log`
2. Check Docker logs: `docker logs [container-id]`
3. Review build console output
4. Test Docker commands manually

---

**Created:** October 2025  
**Last Updated:** October 2025  
**Jenkins Version:** 2.x+  
**Docker Version:** 20.10+
