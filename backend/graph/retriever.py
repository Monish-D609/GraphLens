"""
GraphLens — Graph Retriever (FR-6)
Resolves query entities to graph nodes and traverses neighbours.
"""
import re
import logging
from typing import TYPE_CHECKING
import networkx as nx
from ..graph.extractor import normalize_entity

if TYPE_CHECKING:
    from ..vector.store import VectorStore

logger = logging.getLogger(__name__)


class GraphRetriever:
    def __init__(self, G: nx.DiGraph, vector_store: "VectorStore", config: dict):
        self.G = G
        self.vector_store = vector_store
        self.max_depth = config.get("traversal_depth", 2)

    def retrieve(self, query: str, top_k: int = 5) -> dict:
        """
        FR-6.1: Identify entities in query, resolve to graph nodes.
        FR-6.2: Traverse to neighbours (configurable depth).
        FR-6.3: Retrieve chunks for traversed nodes/edges.
        FR-6.4: Return empty set gracefully if no entities match.
        """
        # Step 1: Identify query entities
        matched_nodes = self._resolve_query_entities(query)

        if not matched_nodes:
            logger.info("No entity matches found in query — graph retrieval returns empty")
            return {
                "chunks": [],
                "entities_matched": [],
                "traversal_trace": {"nodes": [], "edges": []}
            }

        # Step 2: Traverse the graph
        visited_nodes = set()
        visited_edges = []

        for node in matched_nodes:
            self._traverse(node, depth=0, visited_nodes=visited_nodes, visited_edges=visited_edges)

        # Step 3: Collect chunk IDs from traversed nodes and edges
        chunk_ids = set()
        for node in visited_nodes:
            node_data = self.G.nodes.get(node, {})
            chunk_ids.update(node_data.get("chunk_ids", set()))

        for src, tgt in visited_edges:
            if self.G.has_edge(src, tgt):
                chunk_ids.update(self.G[src][tgt].get("chunk_ids", set()))

        # Step 4: Retrieve actual chunk texts from vector store
        chunks = self.vector_store.get_chunks_by_ids(list(chunk_ids))

        # Build traversal trace for UI display (FR-9.4)
        trace_nodes = [
            {"id": n, "type": self.G.nodes[n].get("type", "unknown"), "matched": n in matched_nodes}
            for n in visited_nodes if self.G.has_node(n)
        ]
        trace_edges = [
            {"source": s, "target": t, "type": self.G[s][t].get("type", "related")}
            for s, t in visited_edges if self.G.has_edge(s, t)
        ]

        logger.info(
            f"Graph retrieval: matched {len(matched_nodes)} entities, "
            f"traversed {len(visited_nodes)} nodes, found {len(chunks)} chunks"
        )

        return {
            "chunks": chunks,
            "entities_matched": list(matched_nodes),
            "traversal_trace": {"nodes": trace_nodes, "edges": trace_edges}
        }

    def _resolve_query_entities(self, query: str) -> set[str]:
        """
        FR-6.1: Match query tokens against graph node names.
        Uses substring matching + normalization for fuzzy matching.
        """
        matched = set()
        # Tokenize query: extract word tokens + CamelCase + snake_case
        tokens = re.findall(r'[A-Za-z][a-z0-9]+(?:[A-Z][a-z0-9]+)*|[a-z_]+', query)
        normalized_tokens = {normalize_entity(t) for t in tokens}

        for node in self.G.nodes():
            node_norm = normalize_entity(node)
            # Exact or substring match
            if any(tok in node_norm or node_norm in tok for tok in normalized_tokens if len(tok) > 2):
                matched.add(node)

        return matched

    def _traverse(self, node: str, depth: int, visited_nodes: set, visited_edges: list) -> None:
        """BFS traversal up to max_depth hops."""
        if depth > self.max_depth or node in visited_nodes:
            return
        visited_nodes.add(node)

        if not self.G.has_node(node):
            return

        # Traverse outgoing edges
        for _, neighbour, data in self.G.out_edges(node, data=True):
            if (node, neighbour) not in visited_edges:
                visited_edges.append((node, neighbour))
            self._traverse(neighbour, depth + 1, visited_nodes, visited_edges)

        # Also traverse incoming edges (reverse direction)
        for predecessor, _, data in self.G.in_edges(node, data=True):
            if (predecessor, node) not in visited_edges:
                visited_edges.append((predecessor, node))
            self._traverse(predecessor, depth + 1, visited_nodes, visited_edges)
