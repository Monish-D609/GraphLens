# GraphLens 🔍

### A Graph-Augmented AI Knowledge Assistant for Technical Documentation

GraphLens is a **retrieval-augmented generation (RAG) system** that combines conventional vector similarity search with a **knowledge graph** built from the same documents. It is designed to answer questions about technical documentation — including questions that involve relationships between components, such as inheritance, dependencies, and function calls — which flat vector search alone often struggles with.

Built on **Django REST Framework documentation** as its knowledge base, GraphLens ingests, embeds, graphs, and queries a 36-document corpus through a **FastAPI backend** and a **React web interface**.

---

## 🎯 Problem

Conventional RAG systems retrieve the most semantically similar text chunks for a query. This works well for **definitional questions**:

> *"What is a Serializer?"* → retrieves the Serializer overview page. ✅

But technical documentation is rich with **relational structure**. Classes inherit from other classes. Components depend on modules. Functions call other functions. When a question is about these **relationships**, semantic similarity is often not enough:

| Query | Problem with vector-only retrieval |
|---|---|
| *"What does `ModelViewSet` inherit from?"* | The answer may be spread across multiple documents with no single chunk explaining the full chain |
| *"Which components depend on authentication?"* | Requires traversing `depends_on` edges across documents, not just finding the word "authentication" |
| *"What does the `Router` class call?"* | Requires following `calls` relationships, not keyword proximity |

Standard vector search returns the *k* most similar chunks — but has no mechanism for following relationships between entities across documents.

---

## 💡 Solution

GraphLens adds a **knowledge graph layer** on top of standard vector retrieval.

During ingestion, entities (modules, classes, functions) and relationships (`imports`, `depends_on`, `calls`, `inherits_from`, `defines`) are extracted from each document chunk. These form a **directed graph stored in NetworkX**. When a query arrives:

1. Entities mentioned in the query are identified and matched to graph nodes.
2. The graph is traversed outward (BFS, configurable 1–2 hops) to find related nodes.
3. Chunks associated with those traversed nodes are retrieved.
4. These **graph-retrieved chunks are merged with vector-retrieved chunks**, deduplicated, and capped at a configurable context size.
5. The merged context is passed to an **LLM** (Cloudflare Workers AI, with OpenRouter as fallback) to generate a grounded answer with inline source citations.

The result is a retrieval system that can surface contextually relevant chunks that vector similarity would not rank highly — particularly for relationship-based questions.

---

## ✨ Key Features

- **Multi-document knowledge base** — 36 Django REST Framework documentation pages (`.md`)
- **Semantic vector retrieval** — ChromaDB with embeddings from Cloudflare BGE or `all-MiniLM-L6-v2`
- **Knowledge graph construction** — Rule-based + LLM-assisted entity/relationship extraction into a NetworkX directed graph
- **Graph traversal retrieval** — BFS traversal across `imports`, `depends_on`, `calls`, `inherits_from`, `defines` edges
- **Hybrid retrieval merger** — Vector and graph results merged, deduplicated, and context-capped
- **Grounded LLM generation** — Answers are generated strictly from retrieved context, with inline `[Source: filename.md]` citations
- **Three retrieval modes** — `vanilla` (vector only), `graph` (graph-augmented), `compare` (both side-by-side)
- **Graph traversal trace** — The retrieval path (nodes visited, edges followed) is returned alongside the answer for inspection
- **LLM provider fallback** — Cloudflare Workers AI (primary) → OpenRouter free models (automatic fallback)
- **Configurable parameters** — Chunk size, traversal depth, context cap, model selection — all in `config.yaml`, no code changes needed
- **REST API** — Full FastAPI backend with Swagger UI at `/docs`
- **Web interface** — React frontend with side-by-side Vanilla vs Graph RAG comparison playground

---

## 🖥️ Demo

The application is not deployed to a public URL. To see it in action, run it locally following the [Quick Start](#-quick-start) instructions below.

**Example queries to test with:**

```
What does ModelViewSet inherit from?
Which components depend on the authentication module?
What does the Router class call internally?
What serializer fields does HyperlinkedModelSerializer provide?
How does the permission system interact with views?
```

These queries exercise graph traversal across relationship edges, making them a meaningful test of the graph-augmented mode versus vanilla RAG.

---

## 🧠 How It Works

```
Documents (.md files — DRF documentation)
        │
        ▼
   Loading + Chunking
   (sentence-aware, SHA-256 chunk IDs)
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
  Embedding                         Entity/Relationship
  (Cloudflare BGE /                   Extraction
   all-MiniLM-L6-v2)              (rule-based + LLM)
        │                                  │
        ▼                                  ▼
   ChromaDB                          NetworkX Graph
  Vector Store                     (modules, classes,
        │                        functions + edges)
        └──────────┬───────────────────────┘
                   ▼
           Hybrid Retrieval
      (vector top-k  +  graph BFS traversal
       → merge → deduplicate → context cap)
                   │
                   ▼
            LLM Generation
     (Cloudflare Workers AI / OpenRouter)
       [answer grounded in retrieved context
        with inline source citations]
                   │
                   ▼
                Answer
```

**Pipeline steps:**

**1. Document loading** — The corpus downloader fetches 36 DRF documentation pages from GitHub. The loader reads `.md`, `.txt`, and `.rst` files from the `./corpus` directory.

**2. Chunking** — Documents are split into overlapping chunks (`chunk_size: 512`, `chunk_overlap: 64`) with paragraph-aware splitting. Each chunk gets a stable SHA-256 ID.

**3. Embedding and vector storage** — Each chunk is embedded using Cloudflare Workers AI BGE (`@cf/baai/bge-small-en-v1.5`, 384-dim) or `all-MiniLM-L6-v2` locally as fallback. Embeddings are stored in ChromaDB, persisted to disk.

**4. Knowledge graph construction** — For each chunk, entities (module, class, function, package) and relationships (`imports`, `depends_on`, `calls`, `inherits_from`, `defines`) are extracted using Python regex patterns (import/class/function detection) supplemented by LLM-based extraction. The graph is a NetworkX `DiGraph` stored as JSON.

**5. Hybrid retrieval** — At query time, vector similarity retrieves the top-k semantically relevant chunks. In graph mode, entities in the query are matched to graph nodes, and a configurable BFS traversal (default: 2 hops) fetches associated chunks from the graph. Both result sets are merged, deduplicated by chunk ID, and capped at `context_cap: 8` chunks.

**6. LLM generation** — The merged context is assembled into a prompt. The LLM is instructed to answer strictly from provided context and cite sources inline. Cloudflare Workers AI is tried first; OpenRouter free models serve as automatic fallback.

---

## 🔎 Example Query

**Query:** *"What does ModelViewSet inherit from?"*

**What happens in graph mode:**

1. The entity `ModelViewSet` is matched to a graph node extracted from the DRF Views documentation.
2. BFS traversal follows `inherits_from` edges outward up to 2 hops — reaching `ViewSetMixin`, `generics.GenericAPIView`, `views.APIView`, and their dependencies.
3. Chunks associated with all traversed nodes are retrieved.
4. These are merged with the vector top-k results.
5. The LLM answers from this enriched context, citing sources like `[Source: viewsets.md]`.

In **vanilla mode**, retrieval would return only the chunks most semantically similar to "ModelViewSet inherit" — which may not include the full inheritance chain if it is distributed across multiple document pages.

---

## ⚖️ Vanilla RAG vs Graph RAG

| | Vanilla RAG | GraphLens (Graph mode) |
|---|---|---|
| Semantic similarity search | ✓ | ✓ |
| Vector database (ChromaDB) | ✓ | ✓ |
| Relationship traversal | — | ✓ |
| Multi-hop entity resolution | — | ✓ (configurable 1–2 hops) |
| Cross-document relationships | Limited | ✓ |
| Relationship-focused queries | Standard retrieval | Graph-enhanced retrieval |
| Traversal trace returned | — | ✓ |
| Available as a mode | `vanilla` | `graph` |
| Side-by-side comparison | — | `compare` mode |

> **Note:** Graph-augmented retrieval adds additional context for relationship queries. Whether this results in a better answer depends on the specific query and the quality of graph extraction. Both modes are available and can be compared directly using `mode: "compare"`.

---

## 📋 Assignment Requirements

| Assignment Requirement | GraphLens Implementation |
|---|---|
| Document knowledge source | 36 Django REST Framework documentation pages (`.md`) from the official DRF GitHub repository |
| Content extraction and processing | `backend/ingestion/loader.py` — reads `.md`/`.txt`/`.rst` files from corpus directory |
| Content chunking | `backend/ingestion/chunker.py` — configurable `chunk_size` (default 512) and `chunk_overlap` (64) with paragraph-aware splitting |
| Embeddings | `backend/vector/embedder.py` — Cloudflare BGE (`@cf/baai/bge-small-en-v1.5`) as primary; `all-MiniLM-L6-v2` via `sentence-transformers` as local fallback |
| Vector storage and retrieval | `backend/vector/store.py` — ChromaDB, persisted to `./data/vector_store` |
| Accept user questions | React web interface at `localhost:3000`; also `POST /api/query` REST endpoint |
| LLM-generated answers | `backend/generation/llm.py` — Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) primary; OpenRouter (`google/gemma-2-9b-it:free`) fallback |
| Knowledge-grounded answers | System prompt instructs the LLM to answer **only** from provided context chunks; answers are rejected if context is insufficient |
| User interface | React + Next.js frontend with query input, example queries, and side-by-side comparison playground |
| Source citations | Inline `[Source: filename.md]` citations extracted from LLM output |
| Multiple documents | 36-document corpus covering serializers, views, authentication, permissions, routers, filtering, and more |
| Improved retrieval (bonus) | Graph-augmented retrieval via NetworkX knowledge graph with BFS traversal |
| Retrieval comparison (bonus) | `mode: "compare"` returns both vanilla and graph answers in a single response for direct comparison |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Next.js |
| Backend | FastAPI (Python) |
| Embeddings | Cloudflare Workers AI BGE (`@cf/baai/bge-small-en-v1.5`) / `sentence-transformers` (`all-MiniLM-L6-v2`) |
| Vector Store | ChromaDB |
| Knowledge Graph | NetworkX (`DiGraph`) |
| LLM (primary) | Cloudflare Workers AI — `@cf/meta/llama-3.1-8b-instruct` |
| LLM (fallback) | OpenRouter — `google/gemma-2-9b-it:free` |
| Configuration | YAML (`config.yaml`) |
| HTTP client | `httpx`, `openai` SDK (for OpenRouter) |

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Monish-D609/GraphLens
cd GraphLens

# Backend dependencies
pip install -r backend/requirements.txt

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure API keys

```bash
cp .env.example .env
# Edit .env with your credentials
```

You need two free API keys:

| Service | Purpose | Where to get it |
|---|---|---|
| **Cloudflare Workers AI** | Embeddings + LLM (primary) | [dash.cloudflare.com](https://dash.cloudflare.com) → API Tokens |
| **OpenRouter** | LLM fallback | [openrouter.ai/keys](https://openrouter.ai/keys) |

Required `.env` values:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
OPENROUTER_API_KEY=your_openrouter_key
```

> Both Cloudflare and OpenRouter offer free tiers. If neither key is configured, the system falls back to local `all-MiniLM-L6-v2` for embeddings and will error on generation.

### 3. Download the corpus

```bash
python scripts/download_corpus.py
# Downloads 36 DRF documentation pages into ./corpus/drf/
```

### 4. Start the backend

```bash
uvicorn backend.api.main:app --reload
# API available at http://localhost:8000
# Swagger UI at http://localhost:8000/docs
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
# Frontend at http://localhost:3000
```

### 6. Ingest and query

1. Open `http://localhost:3000`
2. Trigger ingestion — click the ingest button or `POST /api/ingest` (runs in the background; poll `/api/ingest/status` for progress)
3. Once ingestion is complete, ask a question in the playground

---

## 🎛️ Configuration

All tunable parameters are in [`config.yaml`](config.yaml). No code changes are required.

```yaml
chunking:
  chunk_size: 512       # characters (sentence-aware split)
  chunk_overlap: 64

graph:
  traversal_depth: 2    # BFS hops from matched entities (1 or 2)
  entity_types: [module, class, function, package]
  relationship_types: [imports, depends_on, calls, inherits_from, defines]

retrieval:
  context_cap: 8        # max chunks in merged context

generation:
  cloudflare_model: "@cf/meta/llama-3.1-8b-instruct"
  model: "google/gemma-2-9b-it:free"   # OpenRouter fallback
  max_tokens: 1024
  temperature: 0.1
```

---

## 🖥️ API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns index stats (chunk count, graph nodes/edges) |
| `POST` | `/api/ingest` | Trigger ingestion pipeline (runs async in background) |
| `GET` | `/api/ingest/status` | Poll ingestion progress |
| `POST` | `/api/query` | Submit a question and receive an answer |
| `GET` | `/api/graph` | Return full graph structure (nodes and edges) for visualisation |

**Query request:**
```json
{
  "question": "What does ModelViewSet inherit from?",
  "mode": "graph",
  "top_k": 5,
  "traversal_depth": 2
}
```

**`mode` values:**
- `vanilla` — vector similarity retrieval only
- `graph` — graph-augmented retrieval (vector + BFS traversal)
- `compare` — runs both; returns `answer`, `vanilla_answer`, and their respective context chunks

---

## 🗂️ Project Structure

```
GraphLens/
├── backend/
│   ├── ingestion/        # Document loader, chunker, pipeline orchestrator
│   ├── vector/           # Embedder (CF BGE / local), ChromaDB vector store
│   ├── graph/            # Entity/relationship extractor, NetworkX store, graph retriever
│   ├── retrieval/        # Hybrid merge + deduplication
│   ├── generation/       # LLM client (Cloudflare → OpenRouter fallback)
│   └── api/              # FastAPI application and all endpoints
├── frontend/
│   └── components/       # React components — query input, answer panels, graph trace
├── scripts/
│   └── download_corpus.py
├── corpus/               # Downloaded documentation (git-ignored)
├── data/                 # Persisted vector store + graph store (git-ignored)
└── config.yaml           # All configurable parameters
```

---

## 📄 License

MIT
