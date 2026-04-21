import requests

def submit_new():
    payload = {
        "title": "API Test Grievance",
        "description": "This is a test grievance submitted via scratch script to verify admin visibility."
    }
    res = requests.post("http://localhost:8000/api/v1/grievances/submit", json=payload)
    print(f"Submit: {res.status_code}")
    if res.status_code == 201:
        print(f"Ticket: {res.json()['ticket_id']}")
    else:
        print(res.text)

if __name__ == "__main__":
    submit_new()
