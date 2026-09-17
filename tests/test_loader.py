import pytest
from pathlib import Path
from backend.ingestion.loader import load_corpus, _read_file, Document


def test_load_corpus_extensions(tmp_path):
    # Create sample files
    (tmp_path / "guide.md").write_text("# Guide\nSome markdown content.", encoding="utf-8")
    (tmp_path / "notes.txt").write_text("Plain text notes.", encoding="utf-8")
    (tmp_path / "doc.rst").write_text("reStructuredText document.", encoding="utf-8")
    (tmp_path / "ignored.json").write_text('{"key": "val"}', encoding="utf-8")
    (tmp_path / "code.py").write_text("print('hello')", encoding="utf-8")

    docs = load_corpus(str(tmp_path), supported_extensions=[".md", ".txt", ".rst"])

    assert len(docs) == 3
    paths = {d.relative_path for d in docs}
    assert "guide.md" in paths
    assert "notes.txt" in paths
    assert "doc.rst" in paths


def test_crlf_normalization(tmp_path):
    crlf_file = tmp_path / "crlf.md"
    crlf_file.write_bytes(b"Line 1\r\n\r\nLine 2\r\n\r\nLine 3\r\n")

    content = _read_file(crlf_file)
    assert "\r" not in content
    assert content == "Line 1\n\nLine 2\n\nLine 3\n"


def test_document_metadata_and_doc_id(tmp_path):
    sub = tmp_path / "subdir"
    sub.mkdir()
    doc_file = sub / "sample.md"
    doc_file.write_text("Sample text", encoding="utf-8")

    docs = load_corpus(str(tmp_path))
    assert len(docs) == 1
    doc = docs[0]
    assert doc.metadata["filename"] == "sample.md"
    assert doc.metadata["extension"] == ".md"
    assert "subdir" in doc.doc_id
