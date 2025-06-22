# Backend Docker Setup

This directory contains Docker configuration files for the Spring Boot backend application.

## Files Overview

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Complete development environment with PostgreSQL
- `.dockerignore` - Optimizes build context
- `application-prod.properties` - Production configuration
- `init.sql` - Database initialization script

## Quick Start

### Development Environment

1. **Start the complete development environment:**
   ```bash
   docker-compose up
   ```
   This will start:
   - PostgreSQL database on port 5432
   - Backend application on port 8081
   - Debug port available on 5005

2. **Start only the database:**
   ```bash
   docker-compose up postgres
   ```

3. **Start with production profile:**
   ```bash
   docker-compose --profile production up
   ```

### Production Build

1. **Build the production image:**
   ```bash
   docker build -t backend:latest .
   ```

2. **Run the production container:**
   ```bash
   docker run -p 8081:8081 \
     -e SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/javadb \
     -e SPRING_DATASOURCE_USERNAME=your-username \
     -e SPRING_DATASOURCE_PASSWORD=your-password \
     -e GOOGLE_CLIENT_ID=your-google-client-id \
     -e GOOGLE_CLIENT_SECRET=your-google-client-secret \
     backend:latest
   ```

## Environment Variables

### Required for Production
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `GOOGLE_CLIENT_ID` - Google OAuth2 client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 client secret

### Optional
- `JWT_SECRET` - JWT signing secret (defaults to development value)
- `OAUTH2_REDIRECT_URI` - OAuth2 redirect URI
- `SPRING_PROFILES_ACTIVE` - Spring profile (dev/prod)

## Development Features

### Hot Reload
The development Dockerfile (`Dockerfile.dev`) includes:
- Spring Boot DevTools for automatic restart
- Live reload support
- Source code mounting for instant changes
- Remote debugging on port 5005

### Database
- PostgreSQL 15 with Alpine Linux
- Persistent data volume
- Health checks
- Initialization script support

## Production Features

### Security
- Non-root user execution
- Minimal Alpine Linux base image
- Health checks
- Optimized logging

### Performance
- Multi-stage build for smaller images
- Connection pooling configuration
- JPA/Hibernate optimizations
- Disabled development features

## Useful Commands

### Development
```bash
# Start development environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend-dev

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Production
```bash
# Build production image
docker build -t backend:latest .

# Run with custom environment
docker run -d \
  --name backend-prod \
  -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=prod \
  backend:latest

# Check container health
docker inspect backend-prod | grep Health -A 10
```

### Database
```bash
# Connect to database
docker exec -it backend-postgres psql -U postgres -d javadb

# Backup database
docker exec backend-postgres pg_dump -U postgres javadb > backup.sql

# Restore database
docker exec -i backend-postgres psql -U postgres -d javadb < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :8081
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Database connection issues:**
   ```bash
   # Check if database is running
   docker-compose ps
   # Check database logs
   docker-compose logs postgres
   ```

3. **Build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Health Checks

The production container includes health checks. You can monitor them:
```bash
docker inspect backend-prod | grep Health -A 10
```

## Customization

### Adding Environment Variables
Edit `docker-compose.yml` and add to the `environment` section:
```yaml
environment:
  - CUSTOM_VAR=value
```

### Modifying Database Configuration
Edit the `postgres` service in `docker-compose.yml`:
```yaml
postgres:
  environment:
    POSTGRES_DB: your-db-name
    POSTGRES_USER: your-username
    POSTGRES_PASSWORD: your-password
```

### Adding Additional Services
Add new services to `docker-compose.yml`:
```yaml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
```

## Security Notes

- Never commit sensitive environment variables to version control
- Use Docker secrets or external secret management in production
- Regularly update base images for security patches
- Consider using a private registry for production images 