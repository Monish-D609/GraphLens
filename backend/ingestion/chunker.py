"""
GraphLens — Chunker (FR-2)
Splits documents into retrievable chunks with configurable size/overlap.
Assigns stable unique IDs and propagates source metadata.
"""
import hashlib
import re
from dataclasses import dataclass, field
from typing import Optional
from .loader import Document


@dataclass
class Chunk:
    chunk_id: str           # Stable unique identifier (FR-2.4)
    doc_id: str             # Source document identifier (FR-2.3)
    text: str               # Chunk content
    position: int           # 0-indexed position within document
    start_char: int         # Character offset in source document
    end_char: int
    metadata: dict = field(default_factory=dict)


def chunk_documents(
    documents: list[Document],
    chunk_size: int = 512,
    chunk_overlap: int = 64,
    separator: str = "\n\n"
) -> list[Chunk]:
    """
    FR-2.1: Split each document into chunks of configurable size.
    FR-2.2: Apply configurable overlap between adjacent chunks.
    FR-2.3: Each chunk retains source doc + position metadata.
    FR-2.4: Each chunk has a stable unique identifier.
    """
    all_chunks: list[Chunk] = []

    for doc in documents:
        doc_chunks = _split_document(doc, chunk_size, chunk_overlap, separator)
        all_chunks.extend(doc_chunks)

    return all_chunks


def _split_document(
    doc: Document,
    chunk_size: int,
    chunk_overlap: int,
    separator: str
) -> list[Chunk]:
    text = doc.content.replace("\r\n", "\n").replace("\r", "\n")
    chunks: list[Chunk] = []

    # Split on separator first, then merge small paragraphs
    paragraphs = text.split(separator)
    current_text = ""
    current_start = 0
    position = 0
    char_offset = 0

    for para in paragraphs:
        para_len = len(para)

        if len(current_text) + para_len > chunk_size and current_text:
            # Save current chunk
            chunk = _make_chunk(doc, current_text, position, current_start, char_offset)
            chunks.append(chunk)
            position += 1

            # Overlap: take last `chunk_overlap` chars as start of next chunk
            overlap_text = current_text[-chunk_overlap:] if chunk_overlap > 0 else ""
            current_start = char_offset - len(overlap_text)
            current_text = overlap_text + separator + para
        else:
            if current_text:
                current_text += separator + para
            else:
                current_start = char_offset
                current_text = para

        char_offset += para_len + len(separator)

    # Flush remaining text
    if current_text.strip():
        chunk = _make_chunk(doc, current_text, position, current_start, char_offset)
        chunks.append(chunk)

    return chunks


def _make_chunk(doc: Document, text: str, position: int, start: int, end: int) -> Chunk:
    """Create a chunk with a stable deterministic ID."""
    raw_id = f"{doc.doc_id}::{position}::{text[:64]}"
    chunk_id = hashlib.sha256(raw_id.encode()).hexdigest()[:16]

    return Chunk(
        chunk_id=chunk_id,
        doc_id=doc.doc_id,
        text=text.strip(),
        position=position,
        start_char=start,
        end_char=end,
        metadata={
            **doc.metadata,
            "chunk_id": chunk_id,
            "relative_path": doc.relative_path,
            "file_path": doc.file_path,
            "position": position,
        }
    )

