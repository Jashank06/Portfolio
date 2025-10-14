# Docker & CI/CD Setup for Portfolio Project

## 📋 Prerequisites

- Docker (>= 20.10)
- Docker Compose (>= 1.29)
- Node.js (>= 18) - for local development
- Jenkins (optional) - for CI/CD

## 🚀 Quick Start

### Development Mode (with hot reload)

```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Mode

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📁 Project Structure

```
Portfolio/
├── Frontend/
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development with hot reload
│   └── .dockerignore
├── Backend/
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development with nodemon
│   └── .dockerignore
├── docker-compose.yml       # Production configuration
├── docker-compose.dev.yml   # Development configuration
├── Jenkinsfile              # CI/CD pipeline
└── DOCKER_README.md         # This file
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001
NODE_ENV=production
```

#### Backend (.env)
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/portfolio
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
```

## 🐳 Docker Commands

### Build Images

```bash
# Build frontend only
docker build -t portfolio-frontend:latest ./Frontend

# Build backend only
docker build -t portfolio-backend:latest ./Backend

# Build all images
docker-compose build
```

### Manage Containers

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose stop

# Restart containers
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove all unused images
docker image prune -a

# Complete cleanup
docker system prune -a --volumes
```

## 🔍 Health Checks

The containers include health checks to ensure services are running properly:

- **Frontend**: `http://localhost/`
- **Backend**: `http://localhost:5001/health`

Check health status:
```bash
docker-compose ps
docker inspect --format='{{.State.Health.Status}}' portfolio-frontend
docker inspect --format='{{.State.Health.Status}}' portfolio-backend
```

## 🚢 Jenkins CI/CD Pipeline

### Setup Jenkins

1. Install Jenkins plugins:
   - Docker Pipeline
   - Git
   - Email Extension

2. Configure credentials in Jenkins:
   - Docker Hub credentials (ID: `docker-hub-credentials`)
   - Email SMTP settings

3. Create a new Pipeline job:
   - Point to your repository
   - Use Jenkinsfile from SCM

### Pipeline Stages

1. **Checkout**: Clone repository
2. **Environment Check**: Verify tools
3. **Install Dependencies**: npm ci for both services
4. **Run Tests**: Execute test suites
5. **Build**: Create production builds
6. **Docker Build**: Build Docker images
7. **Security Scan**: Scan images for vulnerabilities
8. **Push to Registry**: Push to Docker Hub (main branch only)
9. **Deploy**: Deploy with docker-compose (main branch only)
10. **Health Check**: Verify deployment

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 -f
```

### Container Stats

```bash
# Resource usage
docker stats

# Specific containers
docker stats portfolio-frontend portfolio-backend
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5001
lsof -ti:5001 | xargs kill -9

# Find process using port 80
sudo lsof -ti:80 | xargs kill -9
```

### Container Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check container status
docker-compose ps

# Restart service
docker-compose restart [service-name]
```

### Image Build Issues

```bash
# Clean build (no cache)
docker-compose build --no-cache

# Remove old images
docker image prune -a
```

### Network Issues

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

## 📈 Production Deployment

### AWS ECS Deployment

```bash
# Build and push images
docker-compose build
docker tag portfolio-frontend:latest your-registry/portfolio-frontend:latest
docker tag portfolio-backend:latest your-registry/portfolio-backend:latest
docker push your-registry/portfolio-frontend:latest
docker push your-registry/portfolio-backend:latest
```

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml portfolio

# Check services
docker service ls

# Scale services
docker service scale portfolio_backend=3
```

## 🔐 Security Best Practices

1. **Use secrets for sensitive data**
2. **Run containers as non-root user** (already configured)
3. **Keep images updated**
4. **Scan images regularly**
5. **Use minimal base images** (Alpine Linux)
6. **Set resource limits**

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## 🆘 Support

For issues or questions, please create an issue in the repository.
