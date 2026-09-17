#!/bin/bash
set -e

echo "=== GraphLens Backend Starting ==="

# Download corpus if not present
if [ ! -d "corpus/drf" ] || [ -z "$(ls -A corpus/drf 2>/dev/null)" ]; then
    echo "Corpus not found. Downloading DRF documentation..."
    python scripts/download_corpus.py
fi

# Run ingestion if vector store or graph store not populated
if [ ! -f "data/graph_store/graph.json" ] || [ ! -d "data/vector_store" ]; then
    echo "Index not found. Running initial ingestion pipeline..."
    python -c "from dotenv import load_dotenv; load_dotenv(); from backend.ingestion.pipeline import run_ingestion; run_ingestion()"
fi

echo "Starting Uvicorn server on port ${PORT:-8000}..."
exec uvicorn backend.api.main:app --host 0.0.0.0 --port "${PORT:-8000}"
