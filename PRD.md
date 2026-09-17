# Product Requirements Document (PRD)
## GraphLens — Graph-Augmented Retrieval over Technical Documentation

| Field | Value |
|---|---|
| Project | GraphLens |
| Document | PRD |
| Version | 1.0 |
| Status | Draft |

---

## 1. Overview

GraphLens is a document question-answering system that combines standard vector similarity retrieval with an explicit entity–relationship graph built from the same corpus. Queries are answered from a merged context set drawn from both retrieval paths, with source citations.

GraphLens also includes a comparison mode that runs the same query through vanilla (vector-only) retrieval and graph-augmented retrieval, so the difference in retrieved context and final answer can be observed directly.

## 2. Problem Statement

Standard RAG treats every chunk as an isolated unit: each chunk is embedded, and at query time the chunks whose embeddings are nearest to the query embedding are returned. This retrieves chunks that are *semantically similar* to the query, not chunks that are *structurally connected* to the answer.

This fails on relationship questions such as:

- "What depends on the payments module?"
- "If I change the pricing tier field, what else is affected?"
- "Which components does this feature interact with?"

For these questions, the answer lives in the links between entities, which a flat embedding index does not represent.

## 3. Goals

| ID | Goal |
|---|---|
| G-1 | Answer relationship and dependency questions correctly over a documentation corpus |
| G-2 | Preserve baseline quality on ordinary factual/lookup questions |
| G-3 | Ground every answer in retrieved source chunks, with citations |
| G-4 | Expose a vanilla-vs-graph toggle so both retrieval modes can be compared on the same query |

## 4. Non-Goals

- GraphLens will not implement a general-purpose knowledge-graph platform or graph query language.
- GraphLens will not require a dedicated graph database; a lightweight store is sufficient at this scale.
- GraphLens will not attempt open-domain entity extraction across arbitrary subject matter. Extraction is scoped to one chosen domain.
- GraphLens will not support multi-user accounts, authentication, or persistence of user history.

## 5. Target Corpus

GraphLens targets a domain where relationships are the substance of the content, not incidental prose. Candidate corpora:

| Corpus | Entities | Relationship types |
|---|---|---|
| Codebase architecture docs / README files | modules, services, packages | calls, imports, depends on |
| Product catalog with specs | components, parts | requires, replaces, compatible with |
| Org chart + policy documents | roles, teams | reports to, approves |

**Default selection:** the documentation and README files of a well-documented open-source repository. This is the fastest corpus to source real data for, and dependency relationships can be extracted partly by direct parsing rather than by inference.

## 6. Users and Use Cases

| User | Use case |
|---|---|
| Engineer new to a codebase | "What depends on the payments module?" — wants the dependency chain, not prose about payments |
| Engineer planning a change | "If I change the pricing tier field, what else is affected?" — wants blast-radius traversal |
| Evaluator / reviewer | Runs the same query in both modes to compare retrieval behaviour |

## 7. Product Requirements

| ID | Requirement | Priority |
|---|---|---|
| PR-1 | Ingest documents from a local corpus directory | Must |
| PR-2 | Split documents into retrievable chunks with source metadata | Must |
| PR-3 | Extract entities and relationships from chunks into a graph | Must |
| PR-4 | Embed chunks and store them in a vector store | Must |
| PR-5 | Vector retrieval for a natural-language query | Must |
| PR-6 | Graph retrieval: resolve entities in the query, traverse neighbours, return linked chunks | Must |
| PR-7 | Merge and deduplicate both result sets into one context set | Must |
| PR-8 | Generate an answer grounded in the merged context, with citations to source documents | Must |
| PR-9 | Retrieval-mode toggle: vanilla (vector-only) vs graph-augmented | Must |
| PR-10 | Display which entities and edges were used in a graph-augmented answer | Should |
| PR-11 | Configurable traversal depth (1–2 hops) | Should |
| PR-12 | Side-by-side display of both modes' answers for one query | Could |

## 8. Success Criteria

| ID | Criterion |
|---|---|
| SC-1 | A defined set of relationship questions is answered correctly in graph-augmented mode and demonstrably worse in vanilla mode |
| SC-2 | Factual lookup questions are answered no worse in graph-augmented mode than in vanilla mode |
| SC-3 | Every generated answer carries at least one resolvable source citation |
| SC-4 | Full corpus ingestion completes without manual intervention |

## 9. Key Risk

Entity and relationship extraction from unstructured text is the highest-uncertainty component and the most likely to consume the schedule. Mitigation: prefer deterministic, rule-based extraction wherever the corpus allows it (for example, parsing import statements directly rather than asking a model to infer dependencies), and keep the graph narrow and reliable rather than broad and noisy.
