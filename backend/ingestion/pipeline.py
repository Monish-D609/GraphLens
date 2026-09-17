"""
GraphLens — Ingestion Pipeline Orchestrator
Runs the full ingestion pipeline: Load → Chunk → Embed → Build Graph
"""
import logging
import yaml
from pathlib import Path
from .loader import load_corpus
from .chunker import chunk_documents

logger = logging.getLogger(__name__)


def run_ingestion(config_path: str = "config.yaml") -> dict:
    """
    Full ingestion pipeline:
    1. Load documents from corpus
    2. Chunk documents
    3. Embed chunks → vector store
    4. Extract entities/relationships → graph store
    Returns summary statistics.
    """
    config = _load_config(config_path)

    # Step 1: Load
    logger.info("=== Phase 1: Loading corpus ===")
    documents = load_corpus(
        corpus_dir=config["corpus"]["directory"],
        supported_extensions=config["corpus"]["supported_extensions"]
    )

    if not documents:
        logger.warning("No documents loaded — check corpus directory")
        return {"status": "error", "reason": "no_documents"}

    # Step 2: Chunk
    logger.info("=== Phase 2: Chunking ===")
    chunks = chunk_documents(
        documents=documents,
        chunk_size=config["chunking"]["chunk_size"],
        chunk_overlap=config["chunking"]["chunk_overlap"],
        separator=config["chunking"]["separator"]
    )
    logger.info(f"Created {len(chunks)} chunks from {len(documents)} documents")

    # Step 3: Embed + store (imported lazily to avoid heavy startup cost)
    logger.info("=== Phase 3: Embedding ===")
    from ..vector.embedder import get_embedder
    from ..vector.store import VectorStore

    embedder = get_embedder(config["embedding"])
    vector_store = VectorStore(config["vector_store"])
    vector_store.add_chunks(chunks, embedder)

    # Step 4: Graph extraction
    logger.info("=== Phase 4: Graph extraction ===")
    from ..graph.extractor import extract_graph
    from ..graph.store import GraphStore

    graph_store = GraphStore(config["graph"]["store_path"])
    graph = extract_graph(chunks, documents, config["graph"])
    graph_store.save(graph)

    return {
        "status": "success",
        "documents": len(documents),
        "chunks": len(chunks),
        "entities": graph.number_of_nodes(),
        "relationships": graph.number_of_edges(),
    }


def _load_config(config_path: str) -> dict:
    path = Path(config_path)
    if not path.exists():
        # Try project root
        path = Path(__file__).parent.parent.parent / "config.yaml"
    with open(path, "r") as f:
        return yaml.safe_load(f)
