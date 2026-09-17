"""
GraphLens — Graph Extractor (FR-3)
Extracts entities and relationships from document chunks.
Combines rule-based extraction (import parsing) with LLM-based extraction.
"""
import re
import logging
import json
from typing import TYPE_CHECKING
import networkx as nx

if TYPE_CHECKING:
    from ..ingestion.chunker import Chunk
    from ..ingestion.loader import Document

logger = logging.getLogger(__name__)

# ─── Entity normalization helpers ───────────────────────────────────────────

def normalize_entity(name: str) -> str:
    """FR-3.5: Normalize entity names — lowercase, strip special chars."""
    name = name.strip()
    # Remove common suffixes like .py
    name = re.sub(r'\.py$', '', name)
    # Convert to canonical form
    name = name.replace("-", "_").replace(" ", "_").lower()
    return name


from pathlib import Path

PYTHON_IMPORT_FROM_RE = re.compile(
    r'^from\s+([\w.]+)\s+import\s+([\w., *]+)',
    re.MULTILINE
)
PYTHON_IMPORT_RE = re.compile(
    r'^import\s+([\w., ]+)',
    re.MULTILINE
)
MODULE_DEF_RE = re.compile(r'^class\s+(\w+)', re.MULTILINE)
FUNC_DEF_RE = re.compile(r'^def\s+(\w+)', re.MULTILINE)


def rule_based_extract(chunk_text: str, chunk_id: str, doc_path: str) -> dict:
    """
    Extract entities and relationships from structured code/docs.
    Returns: { entities: [...], relationships: [...] }
    """
    entities = []
    relationships = []

    # Extract module name from doc path (cross-platform)
    stem = Path(doc_path).stem if doc_path else "unknown"
    doc_module = normalize_entity(stem)
    if doc_module and doc_module != "unknown":
        entities.append({
            "name": doc_module,
            "type": "module",
            "chunk_ids": [chunk_id]
        })

    # Python imports: from X import Y
    for match in PYTHON_IMPORT_FROM_RE.finditer(chunk_text):
        mod = normalize_entity(match.group(1).strip())
        if mod and mod != doc_module:
            entities.append({"name": mod, "type": "module", "chunk_ids": [chunk_id]})
            relationships.append({
                "source": doc_module,
                "target": mod,
                "type": "imports",
                "chunk_ids": [chunk_id]
            })
        for item in match.group(2).split(","):
            item_norm = normalize_entity(item.strip())
            if item_norm and item_norm != "*" and item_norm != doc_module:
                entities.append({"name": item_norm, "type": "module", "chunk_ids": [chunk_id]})
                relationships.append({
                    "source": doc_module,
                    "target": item_norm,
                    "type": "imports",
                    "chunk_ids": [chunk_id]
                })

    # Python imports: import X, Y
    for match in PYTHON_IMPORT_RE.finditer(chunk_text):
        for imp in match.group(1).split(","):
            imp_norm = normalize_entity(imp.strip())
            if imp_norm and imp_norm != doc_module:
                entities.append({"name": imp_norm, "type": "module", "chunk_ids": [chunk_id]})
                relationships.append({
                    "source": doc_module,
                    "target": imp_norm,
                    "type": "imports",
                    "chunk_ids": [chunk_id]
                })

    # Class definitions
    for match in MODULE_DEF_RE.finditer(chunk_text):
        class_name = normalize_entity(match.group(1))
        entities.append({"name": class_name, "type": "class", "chunk_ids": [chunk_id]})
        relationships.append({
            "source": doc_module,
            "target": class_name,
            "type": "defines",
            "chunk_ids": [chunk_id]
        })

    return {"entities": entities, "relationships": relationships}


# ─── LLM-based extraction (FR-3.4) ──────────────────────────────────────────

EXTRACTION_PROMPT = """Extract technical entities and relationships from this documentation chunk.

Return JSON with this exact structure:
{{
  "entities": [
    {{"name": "EntityName", "type": "module|class|function|package|concept"}}
  ],
  "relationships": [
    {{"source": "Entity1", "target": "Entity2", "type": "depends_on|imports|calls|inherits_from|uses"}}
  ]
}}

Only extract entities actually mentioned in the text. Be conservative — prefer precision over recall.

Text:
{text}"""


async def llm_extract(chunk_text: str, chunk_id: str, llm_client) -> dict:
    """FR-3.4: LLM-based extraction for unstructured prose."""
    try:
        prompt = EXTRACTION_PROMPT.format(text=chunk_text[:2000])
        response = await llm_client.chat(prompt, json_mode=True)
        data = json.loads(response)
        # Normalize entity names
        for e in data.get("entities", []):
            e["name"] = normalize_entity(e["name"])
            e["chunk_ids"] = [chunk_id]
        for r in data.get("relationships", []):
            r["source"] = normalize_entity(r["source"])
            r["target"] = normalize_entity(r["target"])
            r["chunk_ids"] = [chunk_id]
        return data
    except Exception as e:
        logger.warning(f"LLM extraction failed for chunk {chunk_id}: {e}")
        return {"entities": [], "relationships": []}


# ─── Graph builder ───────────────────────────────────────────────────────────

def extract_graph(
    chunks: list["Chunk"],
    documents: list["Document"],
    config: dict
) -> nx.DiGraph:
    """
    FR-3.1–3.7: Build the entity-relationship graph from all chunks.
    Uses rule-based extraction first, LLM fallback for prose-heavy chunks.
    FR-3.7: Returns a NetworkX DiGraph (caller persists it).
    """
    G = nx.DiGraph()
    entity_chunk_map: dict[str, set] = {}   # entity → chunk_ids

    for chunk in chunks:
        # Rule-based extraction (FR-3.3)
        extracted = rule_based_extract(chunk.text, chunk.chunk_id, chunk.metadata.get("relative_path", ""))

        for entity in extracted["entities"]:
            name = entity["name"]
            if not name or len(name) < 2:
                continue
            if not G.has_node(name):
                G.add_node(name, type=entity.get("type", "unknown"), chunk_ids=set())
            G.nodes[name]["chunk_ids"] = G.nodes[name].get("chunk_ids", set()) | set(entity["chunk_ids"])

        for rel in extracted["relationships"]:
            src, tgt = rel["source"], rel["target"]
            if not src or not tgt or src == tgt:
                continue
            if not G.has_node(src):
                G.add_node(src, type="module", chunk_ids=set())
            if not G.has_node(tgt):
                G.add_node(tgt, type="module", chunk_ids=set())
            # FR-3.6: Record originating chunk IDs per edge
            if G.has_edge(src, tgt):
                G[src][tgt]["chunk_ids"] = G[src][tgt]["chunk_ids"] | set(rel["chunk_ids"])
            else:
                G.add_edge(src, tgt, type=rel["type"], chunk_ids=set(rel["chunk_ids"]))

    logger.info(f"Graph built: {G.number_of_nodes()} entities, {G.number_of_edges()} relationships")
    return G
