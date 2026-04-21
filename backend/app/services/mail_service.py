import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class MailService:
    def __init__(self):
        self.smtp_server = settings.MAIL_SERVER
        self.smtp_port = settings.MAIL_PORT
        self.sender_email = settings.MAIL_USERNAME
        self.sender_password = settings.MAIL_PASSWORD
        self.target_emails = ["sujithlavudu@gmail.com", "vennelabarnana21@gmail.com"]

    def send_notification(self, subject: str, body: str, to_emails: list = None):
        if not self.sender_password:
            print("⚠️ MAIL_PASSWORD not set. Skipping email notification.")
            return False

        try:
            targets = to_emails or self.target_emails
            msg = MIMEMultipart("alternative")
            msg['From'] = f"Arvix Labs Intelligence <{self.sender_email}>"
            msg['To'] = ", ".join(targets)
            msg['Subject'] = f"[Arvix Alert] {subject}"

            # Plain text part
            msg.attach(MIMEText(body, 'plain'))
            
            # Check if body is HTML
            if body.strip().startswith("<html") or body.strip().startswith("<div"):
                html = body
            else:
                # Simple HTML part for better delivery
                html = f"""
                <html>
                    <body style="font-family: sans-serif; padding: 20px; color: #1e293b;">
                        <h2 style="color: #3b82f6;">{subject}</h2>
                        <p style="white-space: pre-wrap;">{body}</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="font-size: 11px; color: #64748b;">&copy; 2026 Arvix Labs Intelligence Node</p>
                    </body>
                </html>
                """
            msg.attach(MIMEText(html, 'html'))

            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.sendmail(self.sender_email, targets, msg.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"❌ Mail Error: {e}")
            return False

    def send_ticket_confirmation(self, to_email: str, ticket_id: str, title: str):
        if not self.sender_password: return
        
        try:
            msg = MIMEMultipart("alternative")
            msg['Subject'] = f"Arvix Docket Initialized: {ticket_id}"
            msg['From'] = f"Arvix Labs <{self.sender_email}>"
            msg['To'] = to_email

            html = f"""
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        @media only screen and (max-width: 600px) {{
                            .main-body {{ padding: 20px !important; }}
                            .container {{ padding: 32px 20px !important; border-radius: 20px !important; }}
                            .ticket-id {{ font-size: 32px !important; letter-spacing: 2px !important; }}
                            .title {{ font-size: 26px !important; }}
                            .button {{ padding: 16px !important; font-size: 13px !important; }}
                        }}
                    </style>
                </head>
                <body class="main-body" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 40px; margin: 0; -webkit-font-smoothing: antialiased;">
                    <div class="container" style="max-width: 600px; margin: 0 auto; background: #0f172a; padding: 48px; border-radius: 32px; border: 1px solid rgba(59,130,246,0.2); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                        <div style="margin-bottom: 40px;">
                            <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff;">ARVIX <span style="color: #3b82f6;">LABS</span></span>
                        </div>
                        
                        <h1 class="title" style="font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 24px 0; color: #ffffff;">Grievance Logged <br/>Successfully.</h1>
                        
                        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 48px;">
                            Our neural classification systems have prioritized your request. Use the secure token below to track real-time resolution nodes.
                        </p>
                        
                        <div style="background: rgba(59,130,246,0.1); border: 1px dashed rgba(59,130,246,0.3); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 48px;">
                            <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; font-weight: 900; color: #60a5fa; margin-bottom: 12px; margin-top: 0;">Immutable Ticket ID</p>
                            <div class="ticket-id" style="font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 40px; font-weight: 900; color: #ffffff; letter-spacing: 4px;">{ticket_id}</div>
                        </div>
                        
                        <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 32px; margin-bottom: 40px;">
                            <p style="font-size: 11px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Record Title</p>
                            <p style="font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0;">{title}</p>
                        </div>
                        
                        <a href="https://arvix-frontend-666036188871.asia-south1.run.app/track" 
                           class="button"
                           style="display: block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 20px; border-radius: 16px; text-align: center; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">
                            Track Resolution Protocol
                        </a>
                        
                        <p style="font-size: 11px; color: #475569; text-align: center; margin-top: 60px; line-height: 1.6;">
                            This is an automated intelligence dispatch. <br/>
                            &copy; 2026 Arvix Labs. Sovereign Data Control.
                        </p>
                    </div>
                </body>
            </html>
            """
            msg.attach(MIMEText(html, "html"))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.sendmail(self.sender_email, to_email, msg.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"❌ Mail Confirmation Error: {e}")
            return False

mail_service = MailService()
