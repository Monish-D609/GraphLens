"""
GraphLens — LLM Answer Generation (FR-8)

Provider priority:
  1. Cloudflare Workers AI  — free tier, 10K neurons/day
  2. OpenRouter             — free models (Gemma 2 9B, Llama 3.1 8B) as fallback

The same priority applies to entity-extraction chat calls used by the graph extractor.
"""
import os
import re
import json
import logging
import httpx
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# ─── Prompts ─────────────────────────────────────────────────────────────────

GROUNDED_SYSTEM_PROMPT = """You are GraphLens, a precise technical documentation assistant.

Rules:
1. Answer ONLY from the provided context chunks — do not use external knowledge.
2. Always cite your sources using [Source: filename.md] inline after each claim.
3. If multiple sources support a claim, cite all of them.
4. If the context is insufficient to answer, say: "The provided context does not contain enough information to answer this question."
5. Be concise and technical. No filler language."""

ANSWER_PROMPT_TEMPLATE = """Based on the following documentation excerpts, answer the question.

=== CONTEXT CHUNKS ===
{context}

=== QUESTION ===
{question}

=== ANSWER (cite sources inline) ==="""


# ─── Cloudflare Workers AI client ────────────────────────────────────────────

class CloudflareLLMClient:
    """
    Calls Cloudflare Workers AI text-generation endpoint.
    Free tier: 10,000 neurons/day — no billing needed.
    Docs: https://developers.cloudflare.com/workers-ai/models/
    """

    # Best free CF models for Q&A tasks (in preference order)
    MODELS = [
        "@cf/meta/llama-3.1-8b-instruct",
        "@cf/mistral/mistral-7b-instruct-v0.1",
        "@cf/google/gemma-2b-it-lora",
    ]

    def __init__(self, config: dict):
        self.account_id = (
            config.get("cloudflare_account_id")
            or os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
        )
        self.api_token = os.getenv("CLOUDFLARE_API_TOKEN", "")
        self.model = config.get("cloudflare_model", self.MODELS[0])
        self.max_tokens = config.get("max_tokens", 1024)
        self.temperature = config.get("temperature", 0.1)
        self.base_url = (
            f"https://api.cloudflare.com/client/v4/accounts"
            f"/{self.account_id}/ai/run"
        )

    def is_available(self) -> bool:
        return bool(self.account_id and self.api_token)

    async def chat(self, system: str, user: str) -> str:
        """Call CF AI chat endpoint. Raises on non-2xx or missing credentials."""
        if not self.is_available():
            raise RuntimeError("Cloudflare credentials not configured")

        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(
                f"{self.base_url}/{self.model}",
                headers={
                    "Authorization": f"Bearer {self.api_token}",
                    "Content-Type": "application/json",
                },
                json={
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": self.max_tokens,
                    "temperature": self.temperature,
                },
            )
        resp.raise_for_status()
        data = resp.json()

        # CF response shape: { "result": { "response": "..." }, "success": true }
        if not data.get("success"):
            errors = data.get("errors", [])
            raise RuntimeError(f"Cloudflare AI error: {errors}")

        return data["result"]["response"]

    async def chat_json(self, prompt: str) -> str:
        """Best-effort JSON extraction — CF doesn't have a native JSON mode."""
        raw = await self.chat(
            system="You are a precise JSON extraction assistant. Return only valid JSON, no markdown fences.",
            user=prompt,
        )
        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.MULTILINE)
        raw = re.sub(r"\s*```$", "", raw.strip(), flags=re.MULTILINE)
        return raw.strip()


# ─── OpenRouter fallback client ───────────────────────────────────────────────

class OpenRouterLLMClient:
    """
    OpenAI-compatible client pointing at OpenRouter.
    Used as fallback when Cloudflare AI is unavailable / returns an error.
    Free models: google/gemma-2-9b-it:free, meta-llama/llama-3.1-8b-instruct:free
    """

    def __init__(self, config: dict):
        api_key = os.getenv("OPENROUTER_API_KEY", "")
        if not api_key:
            logger.warning("OPENROUTER_API_KEY not set — OpenRouter fallback will also fail")

        self.client = AsyncOpenAI(
            api_key=api_key or "sk-no-key",
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": "https://github.com/Monish-D609/GraphLens",
                "X-Title": "GraphLens",
            },
        )
        self.model = config.get("model", "google/gemma-2-9b-it:free")
        self.fallback_model = config.get(
            "fallback_model", "meta-llama/llama-3.1-8b-instruct:free"
        )
        self.max_tokens = config.get("max_tokens", 1024)
        self.temperature = config.get("temperature", 0.1)

    def is_available(self) -> bool:
        return bool(os.getenv("OPENROUTER_API_KEY"))

    async def chat(self, system: str, user: str, model: str | None = None) -> str:
        target = model or self.model
        completion = await self.client.chat.completions.create(
            model=target,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            max_tokens=self.max_tokens,
            temperature=self.temperature,
        )
        return completion.choices[0].message.content

    async def chat_json(self, prompt: str) -> str:
        completion = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=512,
            temperature=0.0,
            response_format={"type": "json_object"},
        )
        return completion.choices[0].message.content


# ─── Unified LLM Client (Cloudflare → OpenRouter fallback chain) ─────────────

class LLMClient:
    """
    Tries Cloudflare Workers AI first; falls back to OpenRouter on any error.
    Exposes the same interface regardless of which provider is actually used.
    """

    def __init__(self, config: dict):
        self.cf = CloudflareLLMClient(config)
        self.or_ = OpenRouterLLMClient(config)
        self.max_tokens = config.get("max_tokens", 1024)
        self.temperature = config.get("temperature", 0.1)

        if self.cf.is_available():
            logger.info(f"LLM primary: Cloudflare Workers AI ({self.cf.model})")
        elif self.or_.is_available():
            logger.info(f"LLM primary: OpenRouter ({self.or_.model}) — Cloudflare not configured")
        else:
            logger.warning("No LLM provider configured — generation will return placeholder answers")

    async def _call(self, system: str, user: str) -> tuple[str, str]:
        """
        Try Cloudflare first, then OpenRouter.
        Returns (response_text, provider_used).
        """
        # 1️⃣  Cloudflare Workers AI
        if self.cf.is_available():
            try:
                text = await self.cf.chat(system, user)
                return text, f"cloudflare/{self.cf.model}"
            except Exception as e:
                logger.warning(f"Cloudflare AI failed: {e} — falling back to OpenRouter")

        # 2️⃣  OpenRouter
        if self.or_.is_available():
            try:
                text = await self.or_.chat(system, user)
                return text, f"openrouter/{self.or_.model}"
            except Exception as e:
                logger.warning(f"OpenRouter primary model failed: {e} — trying fallback model")
                try:
                    text = await self.or_.chat(system, user, model=self.or_.fallback_model)
                    return text, f"openrouter/{self.or_.fallback_model}"
                except Exception as e2:
                    logger.error(f"OpenRouter fallback also failed: {e2}")

        return "", "none"

    async def generate_answer(self, question: str, context_chunks: list[dict]) -> dict:
        """
        FR-8.1–8.4: Generate a grounded answer with inline citations.
        """
        if not context_chunks:
            return {
                "answer": "The provided context does not contain enough information to answer this question.",
                "citations": [],
                "model": "none",
            }

        # Build context string with source labels
        context_parts = []
        for i, chunk in enumerate(context_chunks):
            source = chunk.get("source", f"chunk_{i}")
            context_parts.append(f"[Source: {source}]\n{chunk['text']}")
        context_str = "\n\n---\n\n".join(context_parts)

        user_prompt = ANSWER_PROMPT_TEMPLATE.format(
            context=context_str,
            question=question,
        )

        response, model_used = await self._call(GROUNDED_SYSTEM_PROMPT, user_prompt)

        if not response:
            return {
                "answer": "Answer generation failed. Please set CLOUDFLARE_API_TOKEN and/or OPENROUTER_API_KEY.",
                "citations": [],
                "model": "none",
                "error": "all_providers_failed",
            }

        citations = list(set(re.findall(r"\[Source:\s*([^\]]+)\]", response)))
        return {"answer": response, "citations": citations, "model": model_used}

    async def chat(self, prompt: str, json_mode: bool = False) -> str:
        """
        Simple chat used by the graph extractor for entity extraction.
        Cloudflare first → OpenRouter fallback.
        """
        # 1️⃣  Cloudflare (best-effort JSON stripping)
        if self.cf.is_available():
            try:
                if json_mode:
                    return await self.cf.chat_json(prompt)
                text, _ = await self._call("You are a helpful assistant.", prompt)
                return text
            except Exception as e:
                logger.warning(f"CF chat failed: {e}")

        # 2️⃣  OpenRouter with native JSON mode
        if self.or_.is_available():
            if json_mode:
                return await self.or_.chat_json(prompt)
            text, _ = await self._call("You are a helpful assistant.", prompt)
            return text

        return "{}"  # graceful no-op for extraction calls
