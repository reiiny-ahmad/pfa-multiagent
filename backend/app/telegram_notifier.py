import os
import httpx
from dotenv import load_dotenv

load_dotenv()

_MAX_CHUNK = 4000


def _split_message(text: str) -> list[str]:
    """Split a long message into chunks ≤ _MAX_CHUNK chars, breaking at blank lines."""
    if len(text) <= _MAX_CHUNK:
        return [text]

    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for paragraph in text.split("\n\n"):
        para_len = len(paragraph) + 2  # +2 for the \n\n
        if current_len + para_len > _MAX_CHUNK and current:
            chunks.append("\n\n".join(current))
            current = []
            current_len = 0
        current.append(paragraph)
        current_len += para_len

    if current:
        chunks.append("\n\n".join(current))

    return chunks


async def send_telegram_message(text: str) -> bool:
    token = os.getenv("TELEGRAM_TOKEN", "")
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "")

    if not token or not chat_id:
        print("[Telegram] TELEGRAM_TOKEN or TELEGRAM_CHAT_ID not set")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    chunks = _split_message(text)

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            for i, chunk in enumerate(chunks, 1):
                payload = {
                    "chat_id": chat_id.strip(),
                    "text": chunk,
                    "disable_web_page_preview": True,
                }
                r = await client.post(url, json=payload)
                data = r.json()
                if r.status_code != 200 or not data.get("ok"):
                    print(f"[Telegram] API error on chunk {i}/{len(chunks)}: {data}")
                    return False
        return True
    except Exception as e:
        print(f"[Telegram] Exception: {e}")
        return False
