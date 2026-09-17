FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (git for corpus sparse-checkout, build-essential for any C-extensions)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy application files
COPY config.yaml ./
COPY backend/ ./backend/
COPY scripts/ ./scripts/

# Create data directories
RUN mkdir -p data/vector_store data/graph_store corpus

# Default port
ENV PORT=8000
EXPOSE 8000

# Copy and setup entrypoint script
COPY scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

CMD ["./scripts/start.sh"]
