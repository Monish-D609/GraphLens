import pytest
from backend.ingestion.loader import Document
from backend.ingestion.chunker import chunk_documents, _split_document, _make_chunk


def test_chunker_basic():
    text = (
        "Paragraph 1 with some meaningful text content.\n\n"
        "Paragraph 2 with another set of words for testing.\n\n"
        "Paragraph 3 is also here to verify chunk boundaries."
    )
    doc = Document(
        doc_id="test_doc",
        file_path="/tmp/test_doc.md",
        relative_path="test_doc.md",
        content=text,
        metadata={"filename": "test_doc.md"}
    )

    chunks = chunk_documents([doc], chunk_size=80, chunk_overlap=15)
    assert len(chunks) > 1

    for chunk in chunks:
        assert chunk.doc_id == "test_doc"
        assert chunk.chunk_id != ""
        assert "chunk_id" in chunk.metadata
        assert chunk.metadata["chunk_id"] == chunk.chunk_id
        assert chunk.metadata["relative_path"] == "test_doc.md"


def test_deterministic_chunk_id():
    doc = Document(
        doc_id="stable_doc",
        file_path="/path/stable.md",
        relative_path="stable.md",
        content="Fixed content for hashing test.",
        metadata={}
    )
    c1 = _make_chunk(doc, "Fixed content for hashing test.", position=0, start=0, end=31)
    c2 = _make_chunk(doc, "Fixed content for hashing test.", position=0, start=0, end=31)
    assert c1.chunk_id == c2.chunk_id
    assert len(c1.chunk_id) == 16
