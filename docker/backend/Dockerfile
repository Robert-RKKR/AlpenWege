FROM python:3.12-slim

# Prevent .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# System dependencies required by GeoDjango
RUN apt-get update && apt-get install -y \
    build-essential \
    gdal-bin \
    libgdal-dev \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# GeoDjango requires GDAL shared library path
ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend source
COPY backend .

# Entrypoint
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
