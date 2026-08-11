from abc import ABC, abstractmethod
import logging
import os
import app.config  # noqa: F401  — charge backend/.env ET le .env racine

from openai import AsyncOpenAI, AuthenticationError, RateLimitError

logger = logging.getLogger(__name__)

# Placeholder values that mean "no real key configured"
_PLACEHOLDER_KEYS = {"", "your_openai_api_key_here", "sk-placeholder", "YOUR_KEY_HERE"}


class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name
        self._client: AsyncOpenAI | None = None

    def _get_client(self) -> AsyncOpenAI | None:
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        if api_key in _PLACEHOLDER_KEYS:
            logger.warning("[%s] No valid OPENAI_API_KEY — using mock response", self.name)
            return None
        if self._client is None:
            self._client = AsyncOpenAI(
                api_key=api_key,
                base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
                timeout=60.0,
            )
        return self._client

    @abstractmethod
    async def execute(self, task: str, context: str = "") -> str:
        pass

    async def ask_llm(self, system_prompt: str, user_prompt: str) -> str:
        client = self._get_client()
        if client is None:
            logger.info("[%s] Using mock response (no valid API key)", self.name)
            return self._mock_response(user_prompt)

        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        logger.info("[%s] Calling LLM model=%s", self.name, model)
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=4096,
            )
            content = response.choices[0].message.content.strip()
            logger.info("[%s] LLM response received (%d chars)", self.name, len(content))
            return content
        except (AuthenticationError, RateLimitError) as e:
            logger.error("[%s] API auth/rate error: %s — falling back to mock", self.name, e)
            return self._mock_response(user_prompt)
        except Exception as e:
            logger.error("[%s] LLM call failed: %s — falling back to mock", self.name, e)
            return self._mock_response(user_prompt)

    def _mock_response(self, prompt: str) -> str:
        raise NotImplementedError(f"{self.name} must define _mock_response()")
