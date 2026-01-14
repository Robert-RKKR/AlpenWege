#!/usr/bin/env sh
set -e

echo "[entrypoint] Running database migrations..."
python manage.py migrate --noinput

# Run base data initialization ONLY when enabled
if [ "${RUN_INITIATION:-0}" = "1" ]; then
  echo "[entrypoint] Running application_initiation..."
  python manage.py application_initiation
fi

# Execute the container command (runserver / gunicorn / celery)
exec "$@"
