import requests
import sys

api_key = 're_cxbihbLS_DjuAevsUWKUXDqrqzX4SJRSn'

print("Sending verification email...", flush=True)

response = requests.post(
    'https://api.resend.com/emails',
    headers={
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    },
    json={
        'from': 'onboarding@resend.dev',
        'to': ['pro100bekzhan@gmail.com'],
        'subject': 'Verify your email - YMIT Academy',
        'html': '''
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">YMIT Academy</h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
        <p>Hello!</p>
        <p>Welcome to YMIT Academy! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://ymit.vercel.app/verify-email?token=abc123def456" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;
                      display: inline-block;">
                Verify Email
            </a>
        </div>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        <p style="color: #999; font-size: 12px;">If you did not create an account, you can safely ignore this email.</p>
    </div>
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        &copy; 2026 YMIT Academy. All rights reserved.
    </div>
</div>
''',
    },
    timeout=10
)

print(f'Status: {response.status_code}', flush=True)
print(f'Response: {response.text}', flush=True)
