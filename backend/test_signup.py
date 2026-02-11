import requests

API_URL = "https://ymit-production.up.railway.app/api/auth/signup/"

def test_signup():
    data = {
        "email": "testuser2026@example.com",
        "password": "Test1234!",
        "first_name": "Test",
        "last_name": "User"
    }
    response = requests.post(API_URL, json=data)
    print("Status:", response.status_code)
    print("Response:", response.text)

if __name__ == "__main__":
    test_signup()
