from aiohttp import ClientSession

class MailClient:
    async def send_mail(self, subject: str, to: str, template: int, data: dict):
        async with ClientSession() as session:
            async with session.post("https://smtp.maileroo.com/api/v2/emails/template", headers={"Authorization": "Bearer b23931e57db56b9dfd8c9f4c7082eda62a84eb51b8df101daab3802d1b747f40"}, json={
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
            }) as response:
                return await response.json()
