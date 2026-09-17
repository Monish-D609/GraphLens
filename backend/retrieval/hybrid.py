"""
GraphLens — Hybrid Retrieval Merger (FR-7)
Merges vector and graph result sets, deduplicates, and applies context cap.
"""
import logging
from typing import TYPE_CHECKING

logger = logging.getLogger(__name__)


def merge_results(
    vector_chunks: list[dict],
    graph_chunks: list[dict],
    context_cap: int = 8,
    dedup_strategy: str = "chunk_id"
) -> list[dict]:
    """
    FR-7.1: Merge vector and graph results into a single ordered context set.
    FR-7.2: Deduplicate chunks appearing in both sets.
    FR-7.3: Cap merged context at configurable size limit.
    """
    seen_ids = set()
    merged = []

    # Priority: vector results first (scored), then graph results (supplementary)
    for chunk in vector_chunks + graph_chunks:
        chunk_id = chunk.get("chunk_id") or chunk.get("text", "")[:32]

        if chunk_id in seen_ids:
            continue
        seen_ids.add(chunk_id)
        merged.append(chunk)

        if len(merged) >= context_cap:
            break

    logger.info(
        f"Merged {len(vector_chunks)} vector + {len(graph_chunks)} graph → "
        f"{len(merged)} unique chunks (cap: {context_cap})"
    )
    return merged
