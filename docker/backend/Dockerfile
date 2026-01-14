# ============================
# Backend Base Image
# ============================

# Use Python 3.12 slim image
# - Minimal Debian-based image
# - Suitable for production and development
# - Reduced attack surface and image size
FROM python:3.12-slim


# ============================
# Python Runtime Configuration
# ============================

# Prevent Python from writing .pyc files to disk
# Ensures cleaner containers and avoids unnecessary filesystem writes
ENV PYTHONDONTWRITEBYTECODE=1

# Force stdout/stderr to be unbuffered
# Ensures logs appear immediately (important for Docker logs)
ENV PYTHONUNBUFFERED=1


# ============================
# System Dependencies
# ============================

# Install system-level dependencies required by:
# - GeoDjango (GDAL)
# - PostgreSQL (psycopg)
# - Python package compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    gdal-bin \
    libgdal-dev \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*


# ============================
# GeoDjango Configuration
# ============================

# Explicitly define GDAL shared library path
# Required for GeoDjango to locate GDAL at runtime
ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so


# ============================
# Application Working Directory
# ============================

# Set application root inside container
WORKDIR /app


# ============================
# Python Dependencies
# ============================

# Copy Python dependency list
# Isolated to allow Docker layer caching
COPY backend/requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt


# ============================
# Application Source Code
# ============================

# Copy full backend source code into container
# Includes Django project, apps, and configuration
COPY backend .


# ============================
# Entrypoint Script
# ============================

# Copy entrypoint script
# Used to run migrations, initialization logic, or startup checks
COPY docker/backend/entrypoint.sh /entrypoint.sh

# Ensure entrypoint script is executable
RUN chmod +x /entrypoint.sh


# ============================
# Runtime Configuration
# ============================

# Expose application port
# Actual port mapping is handled by Docker Compose
EXPOSE 8000

# Define container entrypoint
ENTRYPOINT ["/entrypoint.sh"]
