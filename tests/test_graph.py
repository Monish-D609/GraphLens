import pytest
from backend.graph.extractor import normalize_entity, rule_based_extract, extract_graph
from backend.graph.store import GraphStore
from backend.ingestion.loader import Document
from backend.ingestion.chunker import Chunk


def test_normalize_entity():
    assert normalize_entity("views.py") == "views"
    assert normalize_entity("ModelViewSet") == "modelviewset"
    assert normalize_entity("DRF Authentication") == "drf_authentication"
    assert normalize_entity("  API-Guide  ") == "api_guide"


def test_rule_based_extract():
    code_text = (
        "from rest_framework import serializers\n"
        "import permissions\n\n"
        "class AccountSerializer:\n"
        "    pass\n"
    )
    extracted = rule_based_extract(code_text, "chunk_123", "api-guide/serializers.md")
    entities = {e["name"]: e["type"] for e in extracted["entities"]}
    assert "serializers" in entities
    assert "permissions" in entities
    assert "accountserializer" in entities

    rel_types = {(r["source"], r["target"]): r["type"] for r in extracted["relationships"]}
    assert ("serializers", "accountserializer") in rel_types
    assert rel_types[("serializers", "accountserializer")] == "defines"


def test_graph_store_save_and_load(tmp_path):
    store_file = tmp_path / "test_graph.json"
    store = GraphStore(str(store_file))

    chunk = Chunk(
        chunk_id="chk1",
        doc_id="doc1",
        text="class ViewSet:\n    pass",
        position=0,
        start_char=0,
        end_char=20,
        metadata={"relative_path": "views.md"}
    )
    doc = Document("doc1", "/path/views.md", "views.md", chunk.text)

    G = extract_graph([chunk], [doc], {})
    store.save(G)
    assert store_file.exists()

    loaded_G = store.load()
    assert loaded_G.number_of_nodes() == G.number_of_nodes()
    assert loaded_G.number_of_edges() == G.number_of_edges()
    for node in loaded_G.nodes():
        assert isinstance(loaded_G.nodes[node]["chunk_ids"], set)
