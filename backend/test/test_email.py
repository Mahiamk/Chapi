import asyncio
from email_service import send_welcome_email

async def main():
    await send_welcome_email("mahikomohammed@gmail.com")  # 👈 put your real email here

asyncio.run(main())
