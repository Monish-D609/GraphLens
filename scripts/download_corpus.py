"""
GraphLens — Corpus Downloader
Downloads the Django REST Framework documentation into ./corpus/drf/

Why DRF?
- Rich inter-module relationships: serializers ↔ views ↔ authentication ↔ permissions ↔ routers
- Explicit dependency language in the docs ("depends on", "uses", "requires", "calls")
- ~50 well-structured Markdown files — ideal for graph extraction
- Relationship questions have ground-truth answers: e.g. "what does ModelViewSet inherit from?"

Usage:
    python scripts/download_corpus.py
    python scripts/download_corpus.py --dest ./corpus --verbose
"""
import argparse
import logging
import os
import sys
from pathlib import Path

import httpx

logger = logging.getLogger("corpus_downloader")


# ─── Corpus definition ────────────────────────────────────────────────────────

CORPUS_SOURCES = [
    {
        "name": "Django REST Framework",
        "repo": "encode/django-rest-framework",
        "branch": "master",
        "paths": ["docs/"],        # Only docs/ directory
        "extensions": [".md"],
        "dest_subdir": "drf",
    },
]

# Direct raw file URLs for the most important DRF docs
# (used as fallback if git sparse-checkout is unavailable)
DRF_RAW_BASE = "https://raw.githubusercontent.com/encode/django-rest-framework/master/docs"

DRF_DOC_FILES = [
    # Core concepts — highest relationship density
    "api-guide/serializers.md",
    "api-guide/views.md",
    "api-guide/viewsets.md",
    "api-guide/routers.md",
    "api-guide/authentication.md",
    "api-guide/permissions.md",
    "api-guide/throttling.md",
    "api-guide/filtering.md",
    "api-guide/pagination.md",
    "api-guide/versioning.md",
    "api-guide/parsers.md",
    "api-guide/renderers.md",
    "api-guide/requests.md",
    "api-guide/responses.md",
    "api-guide/exceptions.md",
    "api-guide/status-codes.md",
    "api-guide/testing.md",
    "api-guide/fields.md",
    "api-guide/relations.md",
    "api-guide/validators.md",
    "api-guide/reverse.md",
    "api-guide/generic-views.md",
    "api-guide/format-suffixes.md",
    # Topic guides
    "topics/documenting-your-api.md",
    "topics/settings.md",
    "topics/browsable-api.md",
    "topics/ajax-csrf-cors.md",
    # Tutorial (shows how components relate end-to-end)
    "tutorial/quickstart.md",
    "tutorial/1-serialization.md",
    "tutorial/2-requests-and-responses.md",
    "tutorial/3-class-based-views.md",
    "tutorial/4-authentication-and-permissions.md",
    "tutorial/5-relationships-and-hyperlinked-apis.md",
    "tutorial/6-viewsets-and-routers.md",
    # Index
    "index.md",
    "community/contributing.md",
]


def download_file(url: str, dest: Path, verbose: bool = False) -> bool:
    """Download a single file using httpx with retry. Returns True on success."""
    import time
    dest.parent.mkdir(parents=True, exist_ok=True)

    headers = {
        "User-Agent": "GraphLens/1.0 (corpus-downloader; +https://github.com/Monish-D609/GraphLens)",
        "Accept": "text/plain,text/markdown,*/*",
    }

    for attempt in range(3):
        try:
            with httpx.Client(timeout=30.0, follow_redirects=True, verify=True) as client:
                resp = client.get(url, headers=headers)
                resp.raise_for_status()
            dest.write_bytes(resp.content)
            if verbose:
                logger.info(f"  ✓ {dest.relative_to(dest.parents[3])}")
            return True
        except Exception as e:
            if attempt < 2:
                wait = 2 ** attempt   # 1s, 2s, 4s
                logger.debug(f"  Retry {attempt+1}/3 for {url}: {e} — waiting {wait}s")
                time.sleep(wait)
            else:
                logger.warning(f"  ✗ Failed after 3 attempts: {url} → {e}")
    return False


def download_drf_via_git(dest_dir: Path, verbose: bool = False) -> dict:
    """
    Primary strategy: sparse git clone (works even when raw.githubusercontent.com is blocked).
    Clones only the docs/ directory from the DRF repo.
    """
    import subprocess
    import shutil

    drf_dir = dest_dir / "drf"
    tmp_dir = dest_dir / "_drf_clone_tmp"

    # Clean up any previous failed attempt
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir, ignore_errors=True)

    logger.info("Strategy: git sparse-checkout (github.com)")
    try:
        result = subprocess.run(
            [
                "git", "clone",
                "--depth=1",
                "--filter=blob:none",
                "--sparse",
                "--no-tags",
                "https://github.com/encode/django-rest-framework.git",
                str(tmp_dir),
            ],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            raise RuntimeError(f"git clone failed: {result.stderr}")

        # Enable sparse checkout for docs/ only
        subprocess.run(
            ["git", "sparse-checkout", "set", "docs"],
            cwd=str(tmp_dir), capture_output=True, timeout=60
        )

        # Copy docs/ to drf_dir
        docs_src = tmp_dir / "docs"
        if docs_src.exists():
            if drf_dir.exists():
                shutil.rmtree(drf_dir)
            shutil.copytree(docs_src, drf_dir)
            count = sum(1 for f in drf_dir.rglob("*.md"))
            logger.info(f"  ✓ git sparse-checkout: {count} .md files → {drf_dir}")
            return {"downloaded": count, "failed": 0, "dest": str(drf_dir), "strategy": "git"}
        else:
            raise RuntimeError("docs/ directory not found after clone")

    except Exception as e:
        logger.warning(f"git strategy failed: {e}")
        return {"downloaded": 0, "failed": 1, "dest": str(drf_dir), "strategy": "git", "error": str(e)}
    finally:
        if tmp_dir.exists():
            shutil.rmtree(tmp_dir, ignore_errors=True)


def download_drf_via_http(dest_dir: Path, verbose: bool = False) -> dict:
    """Fallback: download individual files via HTTPS."""
    drf_dir = dest_dir / "drf"
    drf_dir.mkdir(parents=True, exist_ok=True)

    ok, fail = 0, 0
    for rel_path in DRF_DOC_FILES:
        url = f"{DRF_RAW_BASE}/{rel_path}"
        dest = drf_dir / rel_path
        if download_file(url, dest, verbose):
            ok += 1
        else:
            fail += 1

    return {"downloaded": ok, "failed": fail, "dest": str(drf_dir), "strategy": "http"}


def download_drf_corpus(dest_dir: Path, verbose: bool = False) -> dict:
    """
    Try git sparse-checkout first (more reliable), fall back to HTTP downloads.
    """
    # Try git clone first
    result = download_drf_via_git(dest_dir, verbose)
    if result["downloaded"] > 0:
        return result

    # Fall back to HTTP
    logger.info("Falling back to HTTP file-by-file download...")
    return download_drf_via_http(dest_dir, verbose)


def main():
    parser = argparse.ArgumentParser(
        description="Download GraphLens corpus (Django REST Framework docs)"
    )
    parser.add_argument(
        "--dest",
        default="./corpus",
        help="Destination directory (default: ./corpus)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Print each downloaded file",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s  %(message)s",
    )

    dest = Path(args.dest).resolve()
    logger.info(f"Downloading corpus to: {dest}")
    logger.info("Corpus: Django REST Framework documentation")
    logger.info(f"Files: {len(DRF_DOC_FILES)} markdown documents")
    logger.info("")

    result = download_drf_corpus(dest, verbose=args.verbose)

    logger.info("")
    logger.info(f"Done! ✓ {result['downloaded']} downloaded  ✗ {result['failed']} failed")
    logger.info(f"Corpus location: {result['dest']}")
    logger.info("")
    logger.info("Next: run the ingestion pipeline via the API or:")
    logger.info("  POST http://localhost:8000/api/ingest")

    return 0 if result["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
