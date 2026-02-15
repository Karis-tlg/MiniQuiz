import os
from httpx import AsyncClient

class MailClient:
    async def send_mail(self, subject: str, to: str, template: int, data: dict):
        async with AsyncClient() as client:
            response = await client.post(
                "https://smtp.maileroo.com/api/v2/emails/template",
                headers={"Authorization": f"Bearer {os.environ.get('MAILEROO_API_KEY')}"},
                json={
                    "from": {
                        "display_name": "MiniQuiz",
                        "address": "no-reply@4aff3d588fbcb262.maileroo.org"
                    },
                    "to": {
                        "address": to
                    },
                    "subject": subject,
                    "template_id": template,
                    "template_data": data
                }
            )
            return response.json()
