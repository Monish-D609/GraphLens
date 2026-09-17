"""
GraphLens — FastAPI Application (Main API)
Exposes /api/ingest, /api/query, /api/graph endpoints.
"""
import logging
import os
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional

import yaml
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables from .env in project root
dotenv_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Setup logging
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

# ─── Config loading ──────────────────────────────────────────────────────────

def load_config() -> dict:
    config_path = Path(__file__).parent.parent.parent / "config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)

# ─── App state (lazy-loaded at startup) ─────────────────────────────────────

class AppState:
    config: dict = {}
    vector_store = None
    graph_store = None
    graph = None
    embedder = None
    llm_client = None
    ingestion_status: str = "idle"  # idle | running | done | error

app_state = AppState()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load config and initialize stores on startup."""
    try:
        app_state.config = load_config()
        logger.info("Config loaded successfully")

        # Initialize vector store
        from ..vector.store import VectorStore
        app_state.vector_store = VectorStore(app_state.config["vector_store"])

        # Initialize embedder
        from ..vector.embedder import get_embedder
        app_state.embedder = get_embedder(app_state.config["embedding"])

        # Initialize graph store and load if exists
        from ..graph.store import GraphStore
        app_state.graph_store = GraphStore(app_state.config["graph"]["store_path"])
        if app_state.graph_store.exists():
            app_state.graph = app_state.graph_store.load()

        # Initialize LLM client
        from ..generation.llm import LLMClient
        app_state.llm_client = LLMClient(app_state.config["generation"])

        logger.info("GraphLens API initialized")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    yield
    logger.info("GraphLens API shutting down")


# ─── FastAPI app ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="GraphLens API",
    description="Graph-Augmented Retrieval over Technical Documentation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_state.config.get("api", {}).get("cors_origins", ["*"]) if hasattr(app_state, 'config') else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request/Response Models ─────────────────────────────────────────────────

class QueryRequest(BaseModel):
    question: str
    mode: str = "graph"          # "vanilla" | "graph" | "compare"
    top_k: Optional[int] = None
    traversal_depth: Optional[int] = None


class QueryResponse(BaseModel):
    question: str
    mode: str
    answer: str
    citations: list[str]
    context_chunks: list[dict]
    traversal_trace: Optional[dict] = None
    vanilla_answer: Optional[str] = None
    vanilla_citations: Optional[list[str]] = None
    vanilla_chunks: Optional[list[dict]] = None
    model: str


class IngestResponse(BaseModel):
    status: str
    documents: Optional[int] = None
    chunks: Optional[int] = None
    entities: Optional[int] = None
    relationships: Optional[int] = None
    message: Optional[str] = None


# ─── Health check ────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "vector_store_count": app_state.vector_store.count() if app_state.vector_store else 0,
        "graph_nodes": app_state.graph.number_of_nodes() if app_state.graph else 0,
        "graph_edges": app_state.graph.number_of_edges() if app_state.graph else 0,
        "ingestion_status": app_state.ingestion_status,
    }


# ─── Ingestion endpoint ──────────────────────────────────────────────────────

@app.post("/api/ingest", response_model=IngestResponse)
async def ingest(background_tasks: BackgroundTasks):
    """
    FR-1–4: Run the full ingestion pipeline.
    Runs in background to avoid timeout (NFR-2).
    """
    if app_state.ingestion_status == "running":
        return IngestResponse(status="running", message="Ingestion already in progress")

    app_state.ingestion_status = "running"
    background_tasks.add_task(_run_ingestion_background)
    return IngestResponse(status="started", message="Ingestion started in background")


async def _run_ingestion_background():
    try:
        from ..ingestion.pipeline import run_ingestion
        result = run_ingestion()
        # Reload graph after ingestion
        if app_state.graph_store.exists():
            app_state.graph = app_state.graph_store.load()
        app_state.ingestion_status = "done"
        logger.info(f"Ingestion complete: {result}")
    except Exception as e:
        app_state.ingestion_status = "error"
        logger.error(f"Ingestion failed: {e}")


@app.get("/api/ingest/status")
async def ingest_status():
    return {"status": app_state.ingestion_status}


# ─── Query endpoint ──────────────────────────────────────────────────────────

@app.post("/api/query", response_model=QueryResponse)
async def query(req: QueryRequest):
    """
    FR-5–9: Process a query with vanilla or graph-augmented retrieval.
    FR-9.1–9.5: Supports mode toggle and side-by-side comparison.
    """
    if not app_state.vector_store or app_state.vector_store.count() == 0:
        raise HTTPException(status_code=400, detail="No documents ingested yet. Run /api/ingest first.")

    top_k = req.top_k or app_state.config["vector_store"]["top_k"]
    config = app_state.config

    # --- Step 1: Vector retrieval (always runs) ---
    query_embedding = app_state.embedder.embed_query(req.question)
    vector_chunks = app_state.vector_store.similarity_search(query_embedding, top_k=top_k)

    traversal_trace = None
    final_chunks = vector_chunks
    vanilla_answer = None
    vanilla_citations = None
    vanilla_chunks = None

    if req.mode in ("graph", "compare") and app_state.graph and app_state.graph.number_of_nodes() > 0:
        # --- Step 2: Graph retrieval ---
        from ..graph.retriever import GraphRetriever
        graph_config = {**config["graph"]}
        if req.traversal_depth:
            graph_config["traversal_depth"] = req.traversal_depth

        graph_retriever = GraphRetriever(app_state.graph, app_state.vector_store, graph_config)
        graph_result = graph_retriever.retrieve(req.question, top_k=top_k)
        traversal_trace = graph_result["traversal_trace"]

        # --- Step 3: Hybrid merge ---
        from ..retrieval.hybrid import merge_results
        final_chunks = merge_results(
            vector_chunks,
            graph_result["chunks"],
            context_cap=config["retrieval"]["context_cap"]
        )

    if req.mode == "compare":
        # Generate vanilla answer separately for comparison (FR-9.5)
        vanilla_result = await app_state.llm_client.generate_answer(req.question, vector_chunks)
        vanilla_answer = vanilla_result["answer"]
        vanilla_citations = vanilla_result["citations"]
        vanilla_chunks = vector_chunks

    # --- Step 4: Generate answer ---
    result = await app_state.llm_client.generate_answer(req.question, final_chunks)

    return QueryResponse(
        question=req.question,
        mode=req.mode,
        answer=result["answer"],
        citations=result["citations"],
        context_chunks=final_chunks,
        traversal_trace=traversal_trace,
        vanilla_answer=vanilla_answer,
        vanilla_citations=vanilla_citations,
        vanilla_chunks=vanilla_chunks,
        model=result["model"]
    )


# ─── Graph visualization endpoint ────────────────────────────────────────────

@app.get("/api/graph")
async def get_graph():
    """Return graph structure for visualization."""
    if not app_state.graph:
        return {"nodes": [], "edges": []}
    return app_state.graph_store.get_graph_summary(app_state.graph)


# ─── Run directly ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    cfg = load_config().get("api", {})
    uvicorn.run("main:app", host=cfg.get("host", "0.0.0.0"), port=cfg.get("port", 8000), reload=True)
