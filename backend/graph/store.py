"""
GraphLens — Graph Store (FR-3.7, NFR-4)
Persists the NetworkX graph to JSON for cross-run durability.
"""
import json
import logging
from pathlib import Path
import networkx as nx
from networkx.readwrite import json_graph

logger = logging.getLogger(__name__)


class GraphStore:
    def __init__(self, store_path: str):
        self.path = Path(store_path)
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def save(self, G: nx.DiGraph) -> None:
        """FR-3.7: Persist graph to disk."""
        # Convert sets to lists for JSON serialization
        G_copy = G.copy()
        for node in G_copy.nodes():
            chunk_ids = G_copy.nodes[node].get("chunk_ids", set())
            G_copy.nodes[node]["chunk_ids"] = list(chunk_ids)
        for src, tgt in G_copy.edges():
            chunk_ids = G_copy[src][tgt].get("chunk_ids", set())
            G_copy[src][tgt]["chunk_ids"] = list(chunk_ids)

        data = json_graph.node_link_data(G_copy)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        logger.info(f"Graph saved to {self.path} ({G.number_of_nodes()} nodes, {G.number_of_edges()} edges)")

    def load(self) -> nx.DiGraph:
        """NFR-4: Load persisted graph."""
        if not self.path.exists():
            logger.warning(f"No graph found at {self.path} — returning empty graph")
            return nx.DiGraph()

        with open(self.path, "r", encoding="utf-8") as f:
            data = json.load(f)

        G = json_graph.node_link_graph(data, directed=True)
        # Restore sets
        for node in G.nodes():
            chunk_ids = G.nodes[node].get("chunk_ids", [])
            G.nodes[node]["chunk_ids"] = set(chunk_ids)
        for src, tgt in G.edges():
            chunk_ids = G[src][tgt].get("chunk_ids", [])
            G[src][tgt]["chunk_ids"] = set(chunk_ids)

        logger.info(f"Graph loaded from {self.path} ({G.number_of_nodes()} nodes, {G.number_of_edges()} edges)")
        return G

    def exists(self) -> bool:
        return self.path.exists()

    def get_graph_summary(self, G: nx.DiGraph) -> dict:
        """Return a serializable summary for the API."""
        nodes = []
        for node, data in G.nodes(data=True):
            nodes.append({
                "id": node,
                "type": data.get("type", "unknown"),
                "chunk_count": len(data.get("chunk_ids", [])),
            })
        edges = []
        for src, tgt, data in G.edges(data=True):
            edges.append({
                "source": src,
                "target": tgt,
                "type": data.get("type", "related"),
                "chunk_count": len(data.get("chunk_ids", [])),
            })
        return {"nodes": nodes, "edges": edges}
