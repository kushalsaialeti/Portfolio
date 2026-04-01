const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: `"Architect Console" <${process.env.SMTP_USER}>`,
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
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpMail };
