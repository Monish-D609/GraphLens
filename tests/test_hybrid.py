import pytest
from backend.retrieval.hybrid import merge_results


def test_merge_results_dedup_and_cap():
    vec_chunks = [
        {"chunk_id": "c1", "text": "Chunk 1", "score": 0.9},
        {"chunk_id": "c2", "text": "Chunk 2", "score": 0.8},
        {"chunk_id": "c3", "text": "Chunk 3", "score": 0.7},
    ]
    graph_chunks = [
        {"chunk_id": "c2", "text": "Chunk 2 duplicate", "score": 0.0},
        {"chunk_id": "c4", "text": "Chunk 4", "score": 0.0},
        {"chunk_id": "c5", "text": "Chunk 5", "score": 0.0},
    ]

    merged = merge_results(vec_chunks, graph_chunks, context_cap=4)

    assert len(merged) == 4
    ids = [c["chunk_id"] for c in merged]
    assert ids == ["c1", "c2", "c3", "c4"]
    # c2 was kept from vector (higher precedence)
    assert merged[1]["score"] == 0.8
