import app as myapp
import json

client = myapp.app.test_client()

print("--- Testing Email ---")
try:
    res = client.post("/api/contact", data={
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message."
    })
    print("Status:", res.status_code)
    print("Response:", res.get_data(as_text=True))
except Exception as e:
    print("Error:", e)

print("\n--- Testing Chatbot ---")
try:
    res = client.post("/api/chat", json={
        "message": "Hello, who are you?"
    })
    print("Status:", res.status_code)
    print("Response:", res.get_data(as_text=True))
except Exception as e:
    print("Error:", e)

print("\n--- Testing Cover Letter ---")
try:
    res = client.post("/api/cover-letter", json={
        "job_title": "Software Engineer",
        "company": "Google",
        "description": "We are looking for a Python developer."
    })
    print("Status:", res.status_code)
    print("Response:", res.get_data(as_text=True))
except Exception as e:
    print("Error:", e)
