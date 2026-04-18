import requests

base_url = "http://localhost:8000/api/v1"

# We first need to get a token. Since we don't have OTP email setup locally easy to read, 
# let's just use the fact that we can generate one if we decode the JWT or we can just mock it.
# Wait, auth.py says:
# token = create_access_token({"sub": data.email, "role": role})

import jwt
from datetime import datetime, timedelta

# Create a local admin token manually to test the dependency get_current_admin
SECRET_KEY = "dummy" # Wait, backend uses settings.SECRET_KEY. 
