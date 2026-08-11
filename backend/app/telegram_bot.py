import os
import asyncio
import httpx
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

load_dotenv("/app/.env")

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "")
API_BASE_URL = os.getenv("API_BASE_URL", "http://backend:8000")


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🤖 Welcome to PFA Multi-Agents!\n\n"
        "Send me a request in natural language and I'll process it.\n\n"
        "Example: Women's Africa Cup of Nations in Morocco"
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    waiting_msg = await update.message.reply_text("⏳ Analysis in progress...")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{API_BASE_URL}/api/query",
                json={"query": user_message}
            )
            data = response.json()

        await waiting_msg.delete()
        result = data.get("result", "No response")
        await update.message.reply_text(
            f"✅ *Request processed!*\n\n📝 *Query:* {user_message}\n\n{result}",
            parse_mode="Markdown"
        )
    except Exception as e:
        await waiting_msg.delete()
        await update.message.reply_text(f"❌ Error: {str(e)}")


def run_bot():
    if not TELEGRAM_TOKEN:
        print("[Bot] TELEGRAM_TOKEN not set — bot not started")
        return

    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("[Bot] Starting polling...")
    asyncio.run(app.run_polling())


if __name__ == "__main__":
    run_bot()
