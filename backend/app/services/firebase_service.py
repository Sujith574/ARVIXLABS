import firebase_admin
from firebase_admin import credentials, storage, firestore
import os
import uuid
from app.core.config import settings

class FirebaseService:
    def __init__(self):
        # Prevent double initialization
        if not firebase_admin._apps:
            # We use environment variables or a service account dict
            try:
                # Best option: use env vars for Cloud Run compatibility
                raw_key = settings.FIREBASE_PRIVATE_KEY.strip()
                if raw_key.startswith('"') and raw_key.endswith('"'):
                    raw_key = raw_key[1:-1]
                
                # Replace literal \n with actual newlines
                clean_key = raw_key.replace('\\n', '\n')
                
                cred_dict = {
                    "type": "service_account",
                    "project_id": settings.FIREBASE_PROJECT_ID,
                    "private_key": clean_key,
                    "client_email": settings.FIREBASE_CLIENT_EMAIL,
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred, {
                    'storageBucket': settings.FIREBASE_STORAGE_BUCKET
                })
            except Exception as e:
                print(f"Firebase Init Error: {e}")
                
        self.db = firestore.client() if firebase_admin._apps else None
        self.bucket = storage.bucket() if firebase_admin._apps else None

    def upload_file(self, file_content, filename: str, content_type: str = "image/jpeg"):
        """Uploads a file to Firebase Storage and returns the public URL."""
        if not self.bucket:
            return None
            
        ext = filename.split('.')[-1]
        unique_name = f"grievances/{uuid.uuid4()}.{ext}"
        blob = self.bucket.blob(unique_name)
        blob.upload_from_string(file_content, content_type=content_type)
        blob.make_public()
        return blob.public_url

    def get_founders(self):
        """Fetch founders data from Firestore."""
        if not self.db:
            return []
        docs = self.db.collection('founders').stream()
        return [doc.to_dict() for doc in docs]

firebase_service = FirebaseService()
