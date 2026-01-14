# AlpenWegs – Docker Guide (Development & Production)

This document explains how to run, stop, reset, and operate the **AlpenWegs** application using **Docker Compose** in both **development** and **production** environments.

---

## Prerequisites

Ensure the following tools are installed:

- Docker Engine
- Docker Compose v2 (`docker compose`)
- Git

Verify installation:

```bash
docker --version
docker compose version
```

---

# Development Environment

## Configuration

Development configuration is defined in `.env.dev`.

It controls:
- Exposed ports
- Django debug settings
- Database credentials
- Frontend API base URL

---

## Start Development Stack (Foreground)

```bash
docker compose \
  --env-file .env.dev \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up --build
```

Stop with **CTRL + C**.

---

## Start Development Stack (Background – Recommended)

```bash
docker compose \
  --env-file .env.dev \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up --build -d
```

---

## Stop Development Stack

```bash
docker compose \
  --env-file .env.dev \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  down
```

---

## Full Development Reset

Removes containers, volumes, and orphan services.

```bash
docker compose \
  --env-file .env.dev \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  down -v --remove-orphans
```

⚠️ This deletes database data.

---

## Development Service Access

- Frontend: `http://localhost:<FRONTEND_PORT>`
- Backend: `http://localhost:<BACKEND_PORT>`
- PostgreSQL: `localhost:<DB_PORT>`
- Redis: `localhost:<REDIS_PORT>`

---

# Production Environment

## Configuration

Production configuration is defined in `.env.prod`.

It controls:
- Public ports
- Allowed hosts
- Secret keys
- Database credentials
- Frontend API base URL

---

## Build and Start Production Stack

```bash
docker compose \
  --env-file .env.prod \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  up --build -d
```

---

## Stop Production Stack

```bash
docker compose \
  --env-file .env.prod \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  down
```

---

## Restart Production Stack

```bash
docker compose \
  --env-file .env.prod \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  restart
```

---

## Production Service Access

- Frontend (Nginx): `http://<SERVER_IP>:<FRONTEND_PORT>`
- Backend (Gunicorn): `http://<SERVER_IP>:<BACKEND_PORT>`

---

## Runtime Notes

- Migrations run automatically on startup
- Static files are collected via init container
- Celery runs as a dedicated worker
- Frontend is served via Nginx in production
- Redis is used for cache and task broker
- PostGIS is enabled for geospatial features

---

## Useful Commands

Check container status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Inspect backend logs only:

```bash
docker compose logs backend
```

---

## Recommended Workflow

- Use **development mode** for coding and testing
- Use **production mode** only for deployment
- Never reuse `.env.dev` in production
- Rotate production secrets regularly

---

End of document.
