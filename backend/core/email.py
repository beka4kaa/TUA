"""
Email utilities for YMIT Academy
Supports: Django SMTP, Resend API
"""

import os
import requests
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_email_via_resend(to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    """Send email using Resend API"""
    api_key = os.getenv('RESEND_API_KEY')
    if not api_key:
        print("RESEND_API_KEY not configured")
        return False
    
    from_email = os.getenv('RESEND_FROM_EMAIL', 'onboarding@resend.dev')
    
    try:
        response = requests.post(
            'https://api.resend.com/emails',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'from': from_email,
                'to': to_email,
                'subject': subject,
                'html': html_content,
            },
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"Email sent via Resend to {to_email}, id: {response.json().get('id')}")
            return True
        else:
            print(f"Resend error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Resend exception: {e}")
        return False


def send_email(to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    """Send email using configured provider (Resend or Django SMTP)"""
    
    # Try Resend first if configured
    if os.getenv('RESEND_API_KEY'):
        return send_email_via_resend(to_email, subject, html_content, text_content)
    
    # Fallback to Django SMTP
    try:
        send_mail(
            subject=subject,
            message=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=html_content,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Django SMTP error: {e}")
        return False


def send_verification_email(user, token: str):
    """Send email verification link to user"""
    
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    verification_url = f"{frontend_url}/verify-email?token={token}"
    
    subject = "Verify your email - YMIT Academy"
    
    message = f"""
Hello {user.first_name or 'there'}!

Welcome to YMIT Academy! Please verify your email address by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Best regards,
YMIT Academy Team
"""
    
    html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">YMIT Academy</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
        
        <p>Hello {user.first_name or 'there'}!</p>
        
        <p>Welcome to YMIT Academy! Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_url}" 
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
        
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="background: #eee; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
            {verification_url}
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours.<br>
            If you didn't create an account, you can safely ignore this email.
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        &copy; 2026 YMIT Academy. All rights reserved.
    </div>
</body>
</html>
"""
    
    return send_email(user.email, subject, html_message, message)


def send_password_reset_email(user, token: str):
    """Send password reset link to user"""
    
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    reset_url = f"{frontend_url}/reset-password?token={token}"
    
    subject = "Reset your password - YMIT Academy"
    
    message = f"""
Hello {user.first_name or 'there'}!

We received a request to reset your password for your YMIT Academy account.

Click the link below to reset your password:

{reset_url}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

Best regards,
YMIT Academy Team
"""
    
    html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">YMIT Academy</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
        
        <p>Hello {user.first_name or 'there'}!</p>
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_url}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;
                      display: inline-block;">
                Reset Password
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="background: #eee; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
            {reset_url}
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour.<br>
            If you didn't request a password reset, you can safely ignore this email.
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        &copy; 2026 YMIT Academy. All rights reserved.
    </div>
</body>
</html>
"""
    
    return send_email(user.email, subject, html_message, message)
