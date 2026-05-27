const https = require('https');

/**
 * Core function to send emails via the Resend API (HTTP-based, works on Render free tier).
 * This bypasses SMTP port blocks.
 */
const sendResendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[MAIL_ERROR]: RESEND_API_KEY is missing.');
    throw new Error('Mailing Service Not Configured.');
  }

  const data = JSON.stringify({
    from: 'Architect Portfolio <onboarding@resend.dev>',
    to: to,
    subject: subject,
    html: html
  });

  const options = {
    hostname: 'api.resend.com',
    port: 443,
    path: '/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[MAIL_SUCCESS]: Email sent via Resend.');
          resolve(JSON.parse(body));
        } else {
          console.error('[MAIL_ERROR]: Resend Failure:', body);
          reject(new Error(`Resend Error: ${res.statusCode}`));
        }
      });
    });
    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
};

/* --- HIGH-LEVEL DISPATCHERS --- */

// 1. Dispatch Admin OTP Access Code
const sendOtpMail = async (email, otp) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid #27c93f; max-width: 500px; margin: 0 auto; text-align: center;">
      <h2 style="text-transform: uppercase; letter-spacing: 0.2em; font-weight: 900; color: #27c93f;">Authentication Protocol</h2>
      <p style="color: #A1A1A6; text-transform: uppercase; font-size: 10px; font-weight: 700; tracking: 0.2em;">Restricted Access Terminal</p>
      <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; margin: 40px 0; color: #fff;">${otp}</div>
      <p style="color: #A1A1A6; line-height: 1.6; font-size: 13px;">Enter this code into the 'Architect Console' login terminal.</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); color: #27c93f; font-size: 10px; font-weight: 900; text-transform: uppercase;">Version 1.4.2 [STABLE]</div>
    </div>
  `;
  return sendResendEmail({ to: email, subject: 'Verification Code: [ADMIN ACCESS]', html });
};

// 2. Dispatch Contact Form Notification to Admin
const sendContactMail = async ({ adminEmail, name, email, subject, message }) => {
    const html = `
      <div style="font-family: 'Inter', sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid #27c93f; max-width: 550px; margin: 0 auto;">
         <h2 style="color: #27c93f; text-transform: uppercase; letter-spacing: 0.1em;">New Portfolio Inquiry</h2>
         <p style="color: #A1A1A6; font-size: 12px; margin-bottom: 30px;">A visitor has reached out via your professional dashboard.</p>
         
         <div style="background-color: #111; padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin-bottom: 12px;"><span style="color: #27c93f; font-weight: bold;">NAME:</span> ${name}</p>
            <p style="margin-bottom: 12px;"><span style="color: #27c93f; font-weight: bold;">EMAIL:</span> ${email}</p>
            <p style="margin-bottom: 12px;"><span style="color: #27c93f; font-weight: bold;">SUBJECT:</span> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 20px 0;" />
            <p style="line-height: 1.6;">${message}</p>
         </div>
         
         <p style="margin-top: 30px; font-size: 10px; color: #A1A1A6; text-transform: uppercase;">Sent via Architect Console Notification Hub</p>
      </div>
    `;
    return sendResendEmail({ to: adminEmail, subject: `Inquiry: ${subject} from ${name}`, html });
};

module.exports = { sendOtpMail, sendContactMail };
