#!/usr/bin/env sh

# ============================
# Container Entrypoint Script
# ============================

# Exit immediately if any command fails
# Prevents container from starting in a broken state
set -e


# ============================
# Database Migrations
# ============================

# Apply Django database migrations automatically on container startup
# Ensures database schema is always in sync with models
echo "[entrypoint] Running database migrations..."
python manage.py migrate --noinput


# ============================
# Optional Application Initialization
# ============================

# Run base data initialization only when explicitly enabled
# Controlled via RUN_INITIATION environment variable
# Typically used for:
# - Initial data seeding
# - Reference tables
# - One-time setup logic
if [ "${RUN_INITIATION:-0}" = "1" ]; then
  echo "[entrypoint] Running application_initiation..."
  python manage.py application_initiation
fi


# ============================
# Start Main Process
# ============================

# Execute the command provided by Docker
# This replaces the shell process and ensures proper signal handling
# Examples:
# - Django runserver
# - Gunicorn
# - Celery worker
exec "$@"
