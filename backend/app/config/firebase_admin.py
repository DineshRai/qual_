import firebase_admin
from firebase_admin import credentials
import os


def initialize_firebase():
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path:
        raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set")

    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
