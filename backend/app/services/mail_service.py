import smtplib, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class MailService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv("MAIL_USERNAME", "arvixlabs@gmail.com")
        self.sender_password = os.getenv("MAIL_PASSWORD", "")
        self.target_emails = ["sujithlavudu@gmail.com", "vennelabarnana21@gmail.com"]

    def send_notification(self, subject: str, body: str):
        if not self.sender_password:
            print("⚠️ MAIL_PASSWORD not set. Skipping email notification.")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = ", ".join(self.target_emails)
            msg['Subject'] = f"[Arvix Alert] {subject}"

            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            text = msg.as_string()
            server.sendmail(self.sender_email, self.target_emails, text)
            server.quit()
            print(f"✅ Email sent to {self.target_emails}")
            return True
        except Exception as e:
            print(f"❌ Mail Error: {e}")
            return False

mail_service = MailService()
