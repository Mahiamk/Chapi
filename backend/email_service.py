import httpx
import asyncio
from config import settings

async def send_welcome_email(email: str):
    """Send welcome email using Resend API"""
    if not settings.RESEND_API_KEY:
        print("Resend API key not configured, skipping email send")
        return
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    email_data = {
        "from": "Waitlist <onboarding@resend.dev>",
        "to": [email],
        "subject": "Welcome to the Waitlist! 🎉",
        "html": """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to the Waitlist</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Welcome to the Waitlist!</h1>
            </div>
            <div class="content">
                <h2>Thank you for joining our waitlist!</h2>
                <p>We're excited to have you on board. You're now part of an exclusive group that will be the first to know when we launch our amazing new product.</p>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>You'll receive exclusive updates about our progress</li>
                    <li>Early access to features before public release</li>
                    <li>Special launch discounts and offers</li>
                </ul>
                
                <p>We'll keep you posted on our journey and notify you as soon as we're ready to launch!</p>
                
                <div style="text-align: center;">
                    <p>Stay tuned for exciting updates!</p>
                </div>
            </div>
            <div class="footer">
                <p>If you have any questions, feel free to reach out to us.</p>
                <p>Best regards,<br>The Team</p>
            </div>
        </body>
        </html>
        """
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=email_data, headers=headers)
            response.raise_for_status()
            print(f"Welcome email sent successfully to {email}")
            return response.json()
    except httpx.HTTPError as e:
        print(f"Failed to send email to {email}: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error sending email to {email}: {e}")
        raise

