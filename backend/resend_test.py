# resend_test.py
import httpx

API_KEY ="re_FWf3Kb2v_MmjKhTxB1FCKcccujkUrfLcY"

url = "https://api.resend.com/emails"
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

email_data = {
    "from": "Waitlist <onboarding@resend.dev>",
    "to": ["mahikomohammed@gmail.com"],
    "subject": "Resend test email",
    "html": "<p>Hello! This is a test from Resend API.</p>"
}

r = httpx.post(url, headers=headers, json=email_data)
print(r.status_code)
print(r.text)
