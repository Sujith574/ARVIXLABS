from app.db.database import SessionLocal
from app.models.models import Complaint

db = SessionLocal()
try:
    count = db.query(Complaint).count()
    print(f"Total Complaints: {count}")
    complaints = db.query(Complaint).all()
    for c in complaints:
        print(f"ID: {c.id}, Ticket: {c.ticket_id}, Status: {c.status}")
finally:
    db.close()
