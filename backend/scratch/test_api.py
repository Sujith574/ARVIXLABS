import requests

def test_admin_all():
    # Attempt to call without token (should fail 401)
    res = requests.get("http://localhost:8000/api/v1/grievances/admin/all")
    print(f"No token: {res.status_code}")
    
    # Request OTP for admin login
    email = "arvixlabs@gmail.com"
    res = requests.post("http://localhost:8000/api/v1/auth/request-otp", json={"email": email})
    print(f"Request OTP: {res.status_code}")
    
    # Normally we'd get the OTP from logs. I'll need to read the backend command output to get it.
    
if __name__ == "__main__":
    test_admin_all()
