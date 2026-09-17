"""
GraphLens — Vector Store (FR-4.2, FR-4.3, FR-5)
Uses ChromaDB for persistent vector storage.
Implements top-K similarity search (FR-5.2, FR-5.3).
"""
import logging
from dataclasses import asdict
from typing import TYPE_CHECKING
import chromadb
from chromadb.config import Settings

if TYPE_CHECKING:
    from ..ingestion.chunker import Chunk
    from .embedder import Embedder

logger = logging.getLogger(__name__)


class VectorStore:
    def __init__(self, config: dict):
        persist_path = config.get("persist_path", "./data/vector_store")
        collection_name = config.get("collection_name", "graphlens_chunks")

        self.client = chromadb.PersistentClient(
            path=persist_path,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        self.top_k = config.get("top_k", 5)
        logger.info(f"Vector store ready at {persist_path} (collection: {collection_name})")

    def add_chunks(self, chunks: list["Chunk"], embedder: "Embedder") -> None:
        """FR-4.2: Embed chunks and store with text + metadata."""
        if not chunks:
            return

        batch_size = 64
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            texts = [c.text for c in batch]
            ids = [c.chunk_id for c in batch]
            metadatas = [c.metadata for c in batch]

            embeddings = embedder.embed(texts)

            self.collection.upsert(
                ids=ids,
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas
            )
            logger.info(f"Stored chunks {i}–{i+len(batch)-1}")

        logger.info(f"Total chunks in store: {self.collection.count()}")

    def similarity_search(
        self,
        query_embedding: list[float],
        top_k: int = None
    ) -> list[dict]:
        """
        FR-5.2: Return top-K most similar chunks.
        FR-5.3: Each result includes similarity score and source metadata.
        """
        k = top_k or self.top_k
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(k, self.collection.count()),
            include=["documents", "metadatas", "distances"]
        )

        hits = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        ):
            hits.append({
                "chunk_id": meta.get("chunk_id", ""),
                "text": doc,
                "score": 1.0 - dist,   # cosine distance → similarity
                "source": meta.get("relative_path", ""),
                "metadata": meta
            })

        return hits

    def get_chunks_by_ids(self, chunk_ids: list[str]) -> list[dict]:
        """Retrieve specific chunks by their IDs (for graph retrieval path)."""
        if not chunk_ids:
            return []
        results = self.collection.get(
            ids=chunk_ids,
            include=["documents", "metadatas"]
        )
        hits = []
        for doc, meta in zip(results["documents"], results["metadatas"]):
            hits.append({
                "chunk_id": meta.get("chunk_id", ""),
                "text": doc,
                "score": 0.0,   # Graph-retrieved, no similarity score
                "source": meta.get("relative_path", ""),
                "metadata": meta
            })
        return hits

    def count(self) -> int:
        return self.collection.count()
