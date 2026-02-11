import requests

API_URL = "https://ymit-production.up.railway.app/api/auth/login/"

def test_login():
    data = {
        "email": "testuser2026@example.com",
        "password": "Test1234!"
    }
    response = requests.post(API_URL, json=data)
    print("Status:", response.status_code)
    print("Response:", response.text)

if __name__ == "__main__":
    test_login()
