"""
GraphLens — Embedder (FR-4.1)

Provider priority:
  1. Cloudflare Workers AI  — @cf/baai/bge-small-en-v1.5, free tier 10K req/day
  2. Local sentence-transformers — all-MiniLM-L6-v2, zero cost, no API key needed

The factory function `get_embedder()` automatically selects the right provider:
- If CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN are set → use Cloudflare
- Otherwise → fall back to local model (downloads ~90 MB once, then cached)

NOTE: Both providers return 384-dimensional vectors, so the ChromaDB collection
      is compatible with either provider. However, if you switch providers mid-run
      you must delete ./data/vector_store and re-ingest (dimension mismatch).
"""
import logging
import os
from typing import Protocol

import httpx

logger = logging.getLogger(__name__)


class Embedder(Protocol):
    def embed(self, texts: list[str]) -> list[list[float]]: ...
    def embed_query(self, text: str) -> list[float]: ...


# ─── Factory ─────────────────────────────────────────────────────────────────

def get_embedder(embedding_config: dict) -> "Embedder":
    """
    Returns a Cloudflare embedder if credentials are present,
    otherwise falls back to the local sentence-transformers model.
    """
    cf_account = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
    cf_token   = os.getenv("CLOUDFLARE_API_TOKEN", "")

    if cf_account and cf_token:
        logger.info("Embedding provider: Cloudflare Workers AI (primary)")
        return CloudflareEmbedder(embedding_config)

    logger.info(
        "Cloudflare credentials not found — "
        "falling back to local sentence-transformers embedder"
    )
    return LocalEmbedder(embedding_config)


# ─── Cloudflare Workers AI Embedder (primary) ────────────────────────────────

class CloudflareEmbedder:
    """
    Uses Cloudflare Workers AI REST API for embeddings.
    Model: @cf/baai/bge-small-en-v1.5 → 384-dim vectors
    Free tier: 10,000 requests/day (each request = up to 100 texts)
    """

    def __init__(self, config: dict):
        self.account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
        self.api_token  = os.getenv("CLOUDFLARE_API_TOKEN", "")
        self.model = config.get(
            "cloudflare_embed_model", "@cf/baai/bge-small-en-v1.5"
        )
        self.base_url = (
            f"https://api.cloudflare.com/client/v4/accounts"
            f"/{self.account_id}/ai/run/{self.model}"
        )
        logger.info(f"CloudflareEmbedder initialised with model {self.model}")

    def _call(self, texts: list[str]) -> list[list[float]]:
        """
        Synchronous HTTP call (used during ingestion which runs in a thread pool).
        CF API accepts up to 100 texts per request.
        """
        with httpx.Client(timeout=45.0) as client:
            resp = client.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_token}",
                    "Content-Type": "application/json",
                },
                json={"text": texts},
            )

        resp.raise_for_status()
        data = resp.json()

        if not data.get("success"):
            raise RuntimeError(f"Cloudflare embedding error: {data.get('errors')}")

        return data["result"]["data"]

    def embed(self, texts: list[str]) -> list[list[float]]:
        """Batch embed with Cloudflare, 100 texts per request."""
        results: list[list[float]] = []
        for i in range(0, len(texts), 100):
            batch = texts[i : i + 100]
            try:
                results.extend(self._call(batch))
            except Exception as e:
                logger.error(
                    f"Cloudflare embed failed on batch {i}–{i+len(batch)}: {e}. "
                    "Falling back to local model for this batch."
                )
                # Per-batch fallback to local model
                fallback = LocalEmbedder.__new__(LocalEmbedder)
                fallback._lazy_load()
                results.extend(fallback.embed(batch))
        return results

    def embed_query(self, text: str) -> list[float]:
        try:
            return self._call([text])[0]
        except Exception as e:
            logger.warning(f"Cloudflare query embed failed: {e}. Using local model.")
            fallback = LocalEmbedder.__new__(LocalEmbedder)
            fallback._lazy_load()
            return fallback.embed_query(text)


# ─── Local sentence-transformers Embedder (fallback) ─────────────────────────

class LocalEmbedder:
    """
    Runs all-MiniLM-L6-v2 locally via sentence-transformers.
    Model is ~90 MB and downloaded once to ~/.cache/huggingface.
    Zero ongoing cost — no API key required.
    """

    def __init__(self, config: dict | None = None):
        model_name = (config or {}).get("local_model", "all-MiniLM-L6-v2")
        logger.info(f"Loading local embedding model: {model_name} (first run may take ~30s)")
        self._load(model_name)

    def _lazy_load(self, model_name: str = "all-MiniLM-L6-v2"):
        """Used by CloudflareEmbedder when falling back per-batch."""
        if not hasattr(self, "_model"):
            self._load(model_name)

    def _load(self, model_name: str):
        from sentence_transformers import SentenceTransformer
        self._model = SentenceTransformer(model_name)
        logger.info(f"Local model '{model_name}' ready")

    def embed(self, texts: list[str]) -> list[list[float]]:
        return self._model.encode(
            texts, batch_size=32, show_progress_bar=False
        ).tolist()

    def embed_query(self, text: str) -> list[float]:
        return self._model.encode([text])[0].tolist()
