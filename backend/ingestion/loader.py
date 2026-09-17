"""
GraphLens — Document Loader (FR-1)
Reads .md, .txt, .rst files from the corpus directory.
Records file path, identifier, and handles unreadable files gracefully (FR-1.4).
"""
import logging
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional
import chardet

logger = logging.getLogger(__name__)


@dataclass
class Document:
    doc_id: str               # Stable identifier derived from relative path
    file_path: str            # Absolute path
    relative_path: str        # Relative to corpus root
    content: str
    metadata: dict = field(default_factory=dict)


def load_corpus(corpus_dir: str, supported_extensions: list[str] = None) -> list[Document]:
    """
    FR-1.1: Read all documents from corpus_dir.
    FR-1.2: Support .md, .txt, .rst
    FR-1.3: Record file path and identifier per document.
    FR-1.4: Skip unreadable files, log them, don't abort.
    """
    if supported_extensions is None:
        supported_extensions = [".md", ".txt", ".rst"]

    corpus_path = Path(corpus_dir)
    if not corpus_path.exists():
        logger.error(f"Corpus directory not found: {corpus_dir}")
        return []

    documents: list[Document] = []
    skipped: list[str] = []

    for file_path in corpus_path.rglob("*"):
        if file_path.suffix.lower() not in supported_extensions:
            continue
        if not file_path.is_file():
            continue

        relative = file_path.relative_to(corpus_path)
        doc_id = str(relative).replace("\\", "/").replace("/", "__").replace(".", "_")

        try:
            content = _read_file(file_path)
            doc = Document(
                doc_id=doc_id,
                file_path=str(file_path.absolute()),
                relative_path=str(relative),
                content=content,
                metadata={
                    "filename": file_path.name,
                    "extension": file_path.suffix,
                    "size_bytes": file_path.stat().st_size,
                }
            )
            documents.append(doc)
            logger.info(f"Loaded: {relative} ({len(content)} chars)")

        except Exception as e:
            logger.warning(f"Skipped {relative}: {e}")
            skipped.append(str(relative))

    logger.info(f"Loaded {len(documents)} documents, skipped {len(skipped)}")
    return documents


def _read_file(file_path: Path) -> str:
    """Attempt UTF-8 first, fall back to chardet detection, with normalized line endings."""
    raw = file_path.read_bytes()
    try:
        content = raw.decode("utf-8")
    except UnicodeDecodeError:
        detected = chardet.detect(raw)
        encoding = detected.get("encoding") or "latin-1"
        content = raw.decode(encoding, errors="replace")
    return content.replace("\r\n", "\n").replace("\r", "\n")

