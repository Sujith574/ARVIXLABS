import requests
import json

API = "http://127.0.0.1:8000"

payload = {
    "title": "Test Grievance from Automation",
    "description": "This is a test grievance to verify if it shows up in the admin dashboard. The water supply in our area has been cut off for 3 days.",
    "submitter_name": "Test User",
    "submitter_email": "test@example.com"
}

try:
    response = requests.post(f"{API}/api/v1/grievances/submit", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
