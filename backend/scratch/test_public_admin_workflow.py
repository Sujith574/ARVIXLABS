from fastapi.testclient import TestClient

from app.main import app
from app.api.v1 import grievances
from app.core.security import get_current_admin


async def _mock_classify(title: str, description: str) -> dict:
    return {
        "category": "Water",
        "priority": "high",
        "department": "General Affairs",
        "summary": f"{title[:60]}",
    }


def run_workflow_test() -> None:
    original_classify = grievances._classify
    app.dependency_overrides[get_current_admin] = lambda: {"sub": "qa-admin@arvixlabs.com", "role": "admin"}
    grievances._classify = _mock_classify

    try:
        with TestClient(app) as client:
            submit_payload = {
                "title": "Water supply outage in Sector 5",
                "description": "No water has been available for the past 18 hours.",
                "submitter_name": "QA Citizen",
                "submitter_email": "qa-citizen@example.com",
            }
            submit_res = client.post("/api/v1/grievances/submit", json=submit_payload)
            assert submit_res.status_code == 201, submit_res.text
            created = submit_res.json()

            complaint_id = created["id"]
            ticket_id = created["ticket_id"]

            admin_all = client.get("/api/v1/grievances/admin/all")
            assert admin_all.status_code == 200, admin_all.text
            all_rows = admin_all.json()
            assert any(row["id"] == complaint_id for row in all_rows), "Submitted complaint not visible in admin list"

            status_under_review = client.patch(
                f"/api/v1/grievances/admin/{complaint_id}/status",
                json={"status": "in-review", "note": "Assigned to initial triage officer."},
            )
            assert status_under_review.status_code == 200, status_under_review.text
            assert status_under_review.json()["status"] == "under_review"

            status_resolved = client.patch(
                f"/api/v1/grievances/admin/{complaint_id}/status",
                json={"status": "resolved", "remarks": "Water board restored supply and completed checks."},
            )
            assert status_resolved.status_code == 200, status_resolved.text
            resolved_row = status_resolved.json()
            assert resolved_row["status"] == "resolved"
            assert resolved_row["remarks"] == "Water board restored supply and completed checks."
            assert resolved_row["resolved_at"] is not None

            track_resolved = client.get(f"/api/v1/grievances/track/{ticket_id}")
            assert track_resolved.status_code == 200, track_resolved.text
            tracked = track_resolved.json()
            assert tracked["status"] == "resolved"
            assert tracked["remarks"] == "Water board restored supply and completed checks."

            status_closed = client.patch(
                f"/api/v1/grievances/admin/{complaint_id}/status",
                json={"status": "rejected", "remarks": "Duplicate complaint merged into primary ticket."},
            )
            assert status_closed.status_code == 200, status_closed.text
            closed_row = status_closed.json()
            assert closed_row["status"] == "closed"
            assert closed_row["resolved_at"] is None

            track_closed = client.get(f"/api/v1/grievances/track/{ticket_id}")
            assert track_closed.status_code == 200, track_closed.text
            assert track_closed.json()["status"] == "closed"

    finally:
        grievances._classify = original_classify
        app.dependency_overrides.pop(get_current_admin, None)


if __name__ == "__main__":
    run_workflow_test()
    print("PASS: public_to_admin_workflow")
