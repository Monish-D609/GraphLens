# GraphLens 🔍

> **Graph-Augmented Retrieval over Technical Documentation**

GraphLens combines **vector search** with **entity-relationship graph traversal** to answer questions that live *between* the documents — dependency chains, blast-radius queries, module relationships — that flat embeddings can't see.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Monish-D609/GraphLens)

---

## ✨ What Makes It Different

| Vanilla RAG | Graph-Augmented RAG (GraphLens) |
|---|---|
| Vector similarity to top-K chunks | Vector similarity **+** entity graph traversal |
| Misses cross-document relationships | Follows `imports`, `depends_on`, `calls` edges |
| "What is a Serializer?" ✅ | "What does ModelViewSet depend on?" ✅ ✅ |

---

## 🏗️ Architecture

```
Query
  │
  ├─── Vector retrieval ──────────────────────────────┐
  │    (sentence-transformers / Cloudflare BGE)       │
  │                                                   ▼
  └─── Graph traversal ──────── Entity resolution ─→ Merge ─→ LLM ─→ Answer
       (NetworkX, 1–2 hops)    (BFS from matched nodes)      (CF AI / OpenRouter)
```

### Ingestion Pipeline
```
Corpus (.md/.txt/.rst)
  → Loader  (FR-1)
  → Chunker (FR-2, stable SHA-256 chunk IDs)
  → Embedder → ChromaDB  (FR-3/4)
  → Entity extractor → NetworkX graph (FR-5)
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Monish-D609/GraphLens
cd GraphLens

# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configure API Keys

```bash
cp .env.example .env
# Edit .env — add your keys (see below)
```

**You need two free API keys:**

| Service | Purpose | Get it free |
|---|---|---|
| **Cloudflare Workers AI** | Primary LLM + embeddings | [dash.cloudflare.com](https://dash.cloudflare.com) → API Tokens |
| **OpenRouter** | Fallback LLM | [openrouter.ai/keys](https://openrouter.ai/keys) |

> ℹ️ **Provider priority:** Cloudflare is tried first for **both** embeddings and generation. OpenRouter (and local `all-MiniLM-L6-v2`) are automatic fallbacks — no code changes needed.

### 3. Download Corpus

```bash
python scripts/download_corpus.py
# Downloads 36 Django REST Framework doc pages into ./corpus/drf/
```

### 4. Run Backend

```bash
uvicorn backend.api.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 5. Run Frontend

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

### 6. Ingest & Query

1. Open `http://localhost:5173`
2. Click **Re-Ingest** (or `POST /api/ingest`)
3. Ask a relationship question:
   - *"What does ModelViewSet inherit from?"*
   - *"Which components depend on the authentication module?"*
   - *"What does the Router class call?"*

---

## 🎛️ Configuration

All parameters in [`config.yaml`](config.yaml) — no code changes needed (NFR-5):

```yaml
chunking:
  chunk_size: 512       # increase for longer context
  chunk_overlap: 64

graph:
  traversal_depth: 2    # hops from matched entities (1 or 2)

retrieval:
  context_cap: 8        # max chunks in merged context

generation:
  cloudflare_model: "@cf/meta/llama-3.1-8b-instruct"
  model: "google/gemma-2-9b-it:free"   # OpenRouter fallback
  max_tokens: 1024
  temperature: 0.1
```

---

## 🖥️ API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Service health + index stats |
| `POST` | `/api/ingest` | Trigger ingestion (async background) |
| `GET` | `/api/ingest/status` | Poll ingestion progress |
| `POST` | `/api/query` | Run a query (vanilla / graph / compare) |
| `GET` | `/api/graph` | Full graph structure for visualisation |

**Query request body:**
```json
{
  "question": "What does ModelViewSet depend on?",
  "mode": "graph",
  "top_k": 5,
  "traversal_depth": 2
}
```

**Modes:**
- `vanilla` — vector similarity only
- `graph` — graph-augmented retrieval
- `compare` — both, side-by-side

---

## 🗂️ Project Structure

```
GraphLens/
├── backend/
│   ├── ingestion/     # Loader (FR-1), Chunker (FR-2), Pipeline
│   ├── vector/        # Embedder (FR-4), ChromaDB store (FR-4/5)
│   ├── graph/         # Extractor (FR-3), Store, Retriever (FR-6)
│   ├── retrieval/     # Hybrid merge + dedup (FR-7)
│   ├── generation/    # LLM client — CF first, OpenRouter fallback (FR-8)
│   └── api/           # FastAPI app, all endpoints
├── frontend/
│   └── src/
│       ├── components/ # QueryInput, ModeToggle, AnswerPanel, GraphTrace…
│       └── App.jsx
├── scripts/
│   └── download_corpus.py
├── corpus/            # Downloaded docs (git-ignored)
├── data/              # Persisted vector + graph stores (git-ignored)
├── config.yaml        # All tunable parameters
└── vercel.json        # Vercel deployment config
```

---

## 🚢 Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel --prod
```

Or click **Deploy with Vercel** at the top of this README.

Set these environment variables in Vercel dashboard:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `OPENROUTER_API_KEY`

---

## 📄 License

MIT
