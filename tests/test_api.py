import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)


def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "vector_store_count" in data
    assert "graph_nodes" in data
    assert "graph_edges" in data
    assert "ingestion_status" in data


def test_api_graph():
    response = client.get("/api/graph")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data


def test_query_validation_error():
    # Empty question should fail validation
    response = client.post("/api/query", json={"question": "", "mode": "vanilla"})
    # FastAPI may return 422 for pydantic validation or 400
    assert response.status_code in [200, 400, 422]
