import requests

def get_admin_token(otp):
    email = "arvixlabs@gmail.com"
    res = requests.post("http://localhost:8000/api/v1/auth/verify-otp", json={"email": email, "otp": otp})
    if res.status_code == 200:
        token = res.json()["access_token"]
        print(f"Token: {token}")
        
        # Test fetching all grievances
        res = requests.get("http://localhost:8000/api/v1/grievances/admin/all", headers={"Authorization": f"Bearer {token}"})
        print(f"Grievances: {len(res.json())}")
        for g in res.json():
            print(f"- {g['ticket_id']}: {g['title']} ({g['status']})")
    else:
        print(f"Failed to verify OTP: {res.status_code} - {res.text}")

if __name__ == "__main__":
    get_admin_token("716281")
