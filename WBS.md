# Work Breakdown Structure (WBS)
## GraphLens — Graph-Augmented Retrieval over Technical Documentation

| Field | Value |
|---|---|
| Project | GraphLens |
| Document | WBS |
| Version | 1.0 |
| Status | Draft |

---

## 1. Structure

```
1.0 GraphLens
├── 1.1 Project Setup
├── 1.2 Corpus & Ingestion
├── 1.3 Chunking
├── 1.4 Vector Pipeline
├── 1.5 Graph Pipeline
├── 1.6 Retrieval Layer
├── 1.7 Generation Layer
├── 1.8 Mode Toggle & Comparison
├── 1.9 Evaluation
└── 1.10 Documentation & Packaging
```

## 2. Work Packages

### 1.1 Project Setup
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.1.1 | Initialise repository and project structure | Repo skeleton | — |
| 1.1.2 | Set up environment, dependencies, and secrets handling | Reproducible environment | 1.1.1 |
| 1.1.3 | Define configuration file (chunk size, overlap, top-K, hop depth, context cap) | Config schema | 1.1.1 |

### 1.2 Corpus & Ingestion
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.2.1 | Select target corpus and confirm relationship density | Corpus decision note | — |
| 1.2.2 | Acquire corpus into a local directory | Local corpus | 1.2.1 |
| 1.2.3 | Implement document loader (text, Markdown) | Loader module | 1.1.2 |
| 1.2.4 | Attach source metadata and document identifiers | Document records | 1.2.3 |
| 1.2.5 | Handle unreadable/unsupported files without aborting | Error handling | 1.2.3 |

### 1.3 Chunking
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.3.1 | Implement chunk splitter with configurable size and overlap | Chunker module | 1.2.4 |
| 1.3.2 | Assign stable chunk identifiers | Chunk ID scheme | 1.3.1 |
| 1.3.3 | Propagate source and position metadata to each chunk | Chunk records | 1.3.1 |

### 1.4 Vector Pipeline
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.4.1 | Integrate embedding model | Embedding client | 1.1.2 |
| 1.4.2 | Batch-embed all chunks | Embedding job | 1.3.3, 1.4.1 |
| 1.4.3 | Select and initialise vector store | Vector store | 1.1.2 |
| 1.4.4 | Persist embeddings with chunk text and metadata | Populated index | 1.4.2, 1.4.3 |
| 1.4.5 | Implement top-K similarity search | Vector retriever | 1.4.4 |

### 1.5 Graph Pipeline
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.5.1 | Define entity and relationship schema for the chosen domain | Schema spec | 1.2.1 |
| 1.5.2 | Choose graph store (SQLite / in-memory graph / JSON adjacency) | Store decision | 1.5.1 |
| 1.5.3 | Implement rule-based extractor for structured signals | Rule extractor | 1.5.1 |
| 1.5.4 | Implement LLM-based extractor for unstructured prose | LLM extractor | 1.5.1 |
| 1.5.5 | Implement entity-name normalisation / alias resolution | Normaliser | 1.5.3 |
| 1.5.6 | Link each edge back to its originating chunk identifiers | Edge provenance | 1.5.3, 1.5.4 |
| 1.5.7 | Build and persist the graph over the full corpus | Graph artefact | 1.5.2, 1.5.6 |
| 1.5.8 | Spot-check extracted edges against source text for accuracy | Extraction QA note | 1.5.7 |

### 1.6 Retrieval Layer
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.6.1 | Implement query-side entity recognition and node resolution | Entity linker | 1.5.7 |
| 1.6.2 | Implement neighbour traversal with configurable hop depth | Graph retriever | 1.6.1 |
| 1.6.3 | Retrieve chunks associated with traversed nodes and edges | Graph result set | 1.6.2 |
| 1.6.4 | Implement merge and deduplication of vector and graph results | Hybrid merger | 1.4.5, 1.6.3 |
| 1.6.5 | Apply context size cap and ordering | Context builder | 1.6.4 |
| 1.6.6 | Handle the no-entity-match case gracefully | Fallback path | 1.6.1 |

### 1.7 Generation Layer
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.7.1 | Integrate LLM for answer generation | LLM client | 1.1.2 |
| 1.7.2 | Design grounded-answer prompt with citation instructions | Prompt template | 1.7.1 |
| 1.7.3 | Implement citation assembly from chunk metadata | Citation formatter | 1.6.5 |
| 1.7.4 | Implement insufficient-context refusal behaviour | Guard logic | 1.7.2 |

### 1.8 Mode Toggle & Comparison
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.8.1 | Implement vanilla mode that bypasses the graph path | Mode switch | 1.4.5, 1.6.4 |
| 1.8.2 | Expose the toggle in the query interface | UI/CLI control | 1.8.1 |
| 1.8.3 | Report retrieval mode and retrieval trace with each answer | Trace output | 1.8.1 |
| 1.8.4 | Display entities and edges used in graph-augmented answers | Graph trace view | 1.6.3, 1.8.3 |
| 1.8.5 | Implement side-by-side dual-mode execution for one query | Comparison view | 1.8.1 |

### 1.9 Evaluation
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.9.1 | Author a relationship-question test set over the corpus | Test set | 1.2.2 |
| 1.9.2 | Author a factual-lookup regression set | Baseline set | 1.2.2 |
| 1.9.3 | Run both modes across both sets and record outcomes | Results table | 1.8.5, 1.9.1, 1.9.2 |
| 1.9.4 | Verify citation resolvability on all answers | Citation audit | 1.9.3 |
| 1.9.5 | Tune chunk size, top-K, and hop depth against results | Tuned config | 1.9.3 |

### 1.10 Documentation & Packaging
| ID | Task | Deliverable | Depends on |
|---|---|---|---|
| 1.10.1 | Write setup and run instructions | README | 1.1.3 |
| 1.10.2 | Document architecture and retrieval flow | Architecture doc | 1.6.5 |
| 1.10.3 | Document configuration parameters and defaults | Config reference | 1.9.5 |
| 1.10.4 | Record evaluation results and known limitations | Results write-up | 1.9.3 |

## 3. Critical Path

`1.1.2 → 1.2.3 → 1.3.1 → 1.4.2 → 1.4.4 → 1.5.7 → 1.6.2 → 1.6.4 → 1.7.2 → 1.9.3`

## 4. Milestones

| ID | Milestone | Complete when |
|---|---|---|
| M1 | Corpus ingested and chunked | 1.3 complete |
| M2 | Vanilla RAG answering end to end | 1.4, 1.7 complete |
| M3 | Graph built and persisted | 1.5 complete |
| M4 | Hybrid retrieval operational | 1.6 complete |
| M5 | Mode comparison working | 1.8 complete |
| M6 | Evaluated and documented | 1.9, 1.10 complete |

## 5. Risk Register

| ID | Risk | Affects | Mitigation |
|---|---|---|---|
| R-1 | Entity/relationship extraction is unreliable on unstructured prose and consumes disproportionate effort | 1.5 | Prefer rule-based extraction (1.5.3) wherever the corpus allows; keep the graph narrow and accurate rather than broad and noisy |
| R-2 | Entity surface variants fragment the graph into duplicate nodes | 1.5.5 | Normalise aggressively; maintain an alias map |
| R-3 | Chosen corpus has too few real relationships to demonstrate value | 1.2.1 | Validate relationship density before committing (1.2.1); prefer a corpus with explicit dependency structure |
| R-4 | Merged context exceeds the model's usable window | 1.6.5 | Enforce the configurable context cap and prioritised ordering |
| R-5 | Graph path adds latency beyond the response-time target | 1.6.2 | Cap hop depth at 2; precompute adjacency at ingestion time |
| R-6 | Graph mode degrades answers on ordinary factual questions | 1.9.2 | Maintain the regression set and tune the merge weighting |

## 6. Sequencing Note

Build vanilla RAG (M2) to a working end-to-end state before starting the graph pipeline. This guarantees a functioning deliverable independent of the highest-risk component, and establishes the baseline that the comparison in 1.8.5 measures against.
