const jwt = require('jsonwebtoken');
const Blacklist = require('../models/Blacklist');

exports.verifyAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const secret = process.env.JWT_SECRET || 'architect_vault_secret_key';

  if (!token) {
    return res.status(401).json({ message: 'No access token found. UNRECOGNIZED USER.' });
  }

  // 1. Check Blacklist for "expired" session
  const isBlacklisted = await Blacklist.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Session Revoked. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Restricted Area. Admin only.' });
    }
    req.user = decoded;
    req.token = token; // attach token for logout logic
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session Expired or Token Compromised. REAUTHENTICATE.' });
  }
};
