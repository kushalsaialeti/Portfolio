const Otp = require('../models/Otp');
const { sendOtpMail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');

// 6-digit logic
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.requestOtp = async (req, res) => {
  const { email } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'kushalsaialeti98@gmail.com';

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(403).json({ message: 'Unauthorized. ACCESS DENIED.' });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  try {
    // Upsert OTP
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, otp);
    res.json({ message: 'Verification Code Sent to Authorised Device.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Authentication Protocol Error.' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'kushalsaialeti98@gmail.com';

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(403).json({ message: 'Unauthorized.' });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Verification Failed. Code Invalid or Expired.' });
    }

    // Success - Delete OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate JWT
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'architect_vault_secret_key',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { email, role: 'admin' },
      message: 'Access Authorized. Entering Console...'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification System Failure.' });
  }
};

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

exports.logout = async (req, res) => {
  try {
    const Blacklist = require('../models/Blacklist');
    const token = req.token; 
    
    // 1. Blacklist current token
    const existing = await Blacklist.findOne({ token });
    if (!existing) {
        await Blacklist.create({ token });
    }

    res.json({ message: 'Session Revoked. logout successful.' });
  } catch (error) {
    console.error('Rotation Error:', error);
    res.status(500).json({ message: 'Logout Protocol Failure.' });
  }
};

exports.checkAuth = (req, res) => {
  res.json({ authenticated: true, user: req.user });
};
