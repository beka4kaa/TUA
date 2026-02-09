const https = require('https');

const data = JSON.stringify({
  from: 'onboarding@resend.dev',
  to: 'pro100bekzhan@gmail.com',
  subject: 'Verify your email - YMIT Academy',
  html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">YMIT Academy</h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hello!</p>
        <p>Welcome to YMIT Academy! Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://ymit.vercel.app/verify-email?token=test123" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold;">
                Verify Email
            </a>
        </div>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
</div>
`
});

const options = {
  hostname: 'api.resend.com',
  port: 443,
  path: '/emails',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer re_cxbihbLS_DjuAevsUWKUXDqrqzX4SJRSn',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
