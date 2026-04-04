const https = require('https');

/**
 * Dispatches an OTP via the Resend API.
 * This replaces SMTP to bypass cloud-provider port blocks.
 */
const sendOtpMail = async (email, otp) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[MAIL_ERROR]: RESEND_API_KEY is missing from environment variables.');
    throw new Error('Mailing Service Not Configured.');
  }

  const data = JSON.stringify({
    from: 'Architect Console <onboarding@resend.dev>',
    to: email,
    subject: 'Verification Code: [ADMIN ACCESS]',
    html: `
      <div style="font-family: 'Inter', sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid #27c93f; max-width: 500px; margin: 0 auto; text-align: center;">
        <h2 style="text-transform: uppercase; letter-spacing: 0.2em; font-weight: 900; color: #27c93f;">Authentication Protocol</h2>
        <p style="color: #A1A1A6; text-transform: uppercase; font-size: 10px; font-weight: 700; tracking: 0.2em;">Restricted Access Access</p>
        <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; margin: 40px 0; color: #fff;">${otp}</div>
        <p style="color: #A1A1A6; line-height: 1.6; font-size: 13px;">Enter this code into the 'Architect Console' login terminal to authorize your current session.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); color: #27c93f; font-size: 10px; font-weight: 900; text-transform: uppercase;">Version 1.4.2 [STABLE]</div>
      </div>
    `
  });

  const options = {
    hostname: 'api.resend.com',
    port: 443,
    path: '/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[MAIL_SUCCESS]: Code dispatched via Resend API.');
          resolve(JSON.parse(body));
        } else {
          console.error('[MAIL_ERROR]: Resend API failure:', body);
          reject(new Error(`Resend Error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('[MAIL_ERROR]: API connection failure:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

module.exports = { sendOtpMail };
