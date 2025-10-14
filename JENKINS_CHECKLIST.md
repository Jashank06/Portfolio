# ✅ Jenkins Docker Hub Setup Checklist

## 🎯 Pre-Setup Requirements

- [ ] Docker Hub account created (https://hub.docker.com)
- [ ] Jenkins installed and running
- [ ] Docker installed on Jenkins server
- [ ] Git repository with your code

---

## 📝 Quick Setup Steps

### 1️⃣ Docker Hub Access Token (5 min)

- [ ] Login to Docker Hub: https://hub.docker.com
- [ ] Click profile → **Account Settings**
- [ ] Go to **Security** tab
- [ ] Click **New Access Token**
- [ ] Name: `jenkins-ci`
- [ ] Permissions: `Read, Write, Delete`
- [ ] **Copy the token** (save it securely!)

---

### 2️⃣ Jenkins Credentials (3 min)

- [ ] Open Jenkins: http://localhost:8080
- [ ] Go to: **Manage Jenkins** → **Manage Credentials**
- [ ] Click **(global)** domain
- [ ] Click **Add Credentials**
- [ ] Fill in:
  ```
  Kind: Username with password
  Username: YOUR_DOCKER_HUB_USERNAME
  Password: [Paste Access Token]
  ID: docker-hub-credentials
  Description: Docker Hub Access Token
  ```
- [ ] Click **Create**

---

### 3️⃣ Update Jenkinsfile (2 min)

- [ ] Open: `/Users/Jay/Documents/Portfolio/Jenkinsfile`
- [ ] Find line 6:
  ```groovy
  DOCKER_HUB_USERNAME = 'YOUR_DOCKER_HUB_USERNAME'
  ```
- [ ] Replace with your actual username:
  ```groovy
  DOCKER_HUB_USERNAME = 'jashank123'  // example
  ```
- [ ] Save file

---

### 4️⃣ Install Jenkins Plugins (5 min)

- [ ] Go to: **Manage Jenkins** → **Manage Plugins**
- [ ] Click **Available** tab
- [ ] Search and install:
  - [ ] Docker Pipeline
  - [ ] Docker Plugin
  - [ ] Git Plugin
  - [ ] Email Extension Plugin
- [ ] Click **Install without restart**

---

### 5️⃣ Configure Jenkins Docker Access (Linux/Mac)

**On Jenkins Server:**

```bash
# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Verify
sudo -u jenkins docker ps
```

- [ ] Jenkins user has Docker access
- [ ] `docker ps` works without sudo

---

### 6️⃣ Create Jenkins Pipeline Job (5 min)

- [ ] Jenkins Dashboard → **New Item**
- [ ] Name: `Portfolio-CI-CD`
- [ ] Type: **Pipeline**
- [ ] Click **OK**

**Configuration:**

- [ ] **General:**
  - [ ] Description: `Portfolio CI/CD Pipeline`
  - [ ] GitHub project URL: `https://github.com/YOUR_USERNAME/Portfolio`

- [ ] **Pipeline:**
  - [ ] Definition: `Pipeline script from SCM`
  - [ ] SCM: `Git`
  - [ ] Repository URL: `https://github.com/YOUR_USERNAME/Portfolio.git`
  - [ ] Branch: `*/main`
  - [ ] Script Path: `Jenkinsfile`

- [ ] Click **Save**

---

### 7️⃣ Test Build (3 min)

- [ ] Open your Pipeline job
- [ ] Click **Build Now**
- [ ] Watch Console Output
- [ ] Wait for completion

**Expected stages:**
- [ ] ✅ Checkout
- [ ] ✅ Environment Check
- [ ] ✅ Install Frontend Dependencies
- [ ] ✅ Install Backend Dependencies
- [ ] ✅ Run Frontend Tests
- [ ] ✅ Run Backend Tests
- [ ] ✅ Build Frontend
- [ ] ✅ Build Docker Images
  - [ ] Frontend image built
  - [ ] Backend image built
- [ ] ✅ Security Scan
- [ ] ✅ Push to Docker Hub
  - [ ] Frontend pushed
  - [ ] Backend pushed
- [ ] ✅ Deploy with Docker Compose
- [ ] ✅ Health Check

---

### 8️⃣ Verify Docker Hub (2 min)

- [ ] Login to Docker Hub: https://hub.docker.com
- [ ] Check **Repositories** tab
- [ ] Find: `YOUR_USERNAME/portfolio-frontend`
- [ ] Find: `YOUR_USERNAME/portfolio-backend`
- [ ] Check tags:
  - [ ] `latest` tag exists
  - [ ] Build number tag exists (e.g., `1`)

---

## 🔍 Troubleshooting

### ❌ Build Failed at "Push to Docker Hub"

**Check:**
1. Credential ID is exactly: `docker-hub-credentials`
2. Docker Hub username in Jenkinsfile is correct
3. Access token is valid
4. Test manually:
   ```bash
   docker login -u YOUR_USERNAME
   # Enter access token as password
   ```

### ❌ Docker Command Not Found

**Fix:**
```bash
# On Jenkins server
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### ❌ Permission Denied

**Fix:**
```bash
# On Jenkins server
sudo chmod 666 /var/run/docker.sock
# OR
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### ❌ Cannot Push Image

**Check:**
- Image name format: `username/image-name:tag`
- Repository exists on Docker Hub
- Token has Write permissions

---

## 📊 Post-Setup Verification

### Manual Push Test:

```bash
# Build test image
docker build -t YOUR_USERNAME/test:latest .

# Login
docker login -u YOUR_USERNAME

# Push
docker push YOUR_USERNAME/test:latest

# Verify on hub.docker.com
```

### Jenkins Console Check:

```bash
# View Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Check Docker access
sudo -u jenkins docker ps
sudo -u jenkins docker images
```

---

## 🎉 Success Indicators

✅ **Build Status:** SUCCESS (green)  
✅ **Docker Hub:** Images visible with tags  
✅ **Console Output:** No errors in push stage  
✅ **Email:** Success notification received  

---

## 📁 Important Files

| File | Purpose | Location |
|------|---------|----------|
| `Jenkinsfile` | Pipeline definition | `/Portfolio/Jenkinsfile` |
| `JENKINS_SETUP.md` | Detailed guide | `/Portfolio/JENKINS_SETUP.md` |
| `JENKINS_CHECKLIST.md` | This checklist | `/Portfolio/JENKINS_CHECKLIST.md` |

---

## 🚀 Next Steps

After successful setup:

1. **Enable Auto-Build:**
   - Add GitHub webhook
   - Or use Poll SCM

2. **Configure Notifications:**
   - Setup email alerts
   - Add Slack/Discord webhooks

3. **Add Staging Environment:**
   - Create staging branch
   - Configure separate deployment

4. **Monitor Builds:**
   - Review build history
   - Check Docker Hub activity
   - Monitor resource usage

---

## 📞 Quick Help

### Common Commands:

```bash
# Restart Jenkins
sudo systemctl restart jenkins

# Check Jenkins status
sudo systemctl status jenkins

# View Jenkins logs
sudo journalctl -u jenkins -f

# Test Docker access
sudo -u jenkins docker ps

# Manual build trigger
curl -X POST http://localhost:8080/job/Portfolio-CI-CD/build

# Clean Docker
docker system prune -a
```

### Useful Links:

- Jenkins Dashboard: http://localhost:8080
- Docker Hub: https://hub.docker.com
- Jenkins Docs: https://www.jenkins.io/doc/
- Docker Docs: https://docs.docker.com

---

**Setup Time:** ~25 minutes  
**Difficulty:** Intermediate  
**Support:** Check JENKINS_SETUP.md for detailed troubleshooting

---

## ✅ Completion Checklist

- [ ] Docker Hub account ready
- [ ] Access token created
- [ ] Jenkins credentials added
- [ ] Jenkinsfile updated with username
- [ ] Plugins installed
- [ ] Docker access configured
- [ ] Pipeline job created
- [ ] Test build successful
- [ ] Images visible on Docker Hub
- [ ] All stages passing

**Status:** [ ] Complete 🎉

---

*Last updated: October 2025*
