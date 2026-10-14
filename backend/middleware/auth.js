const jwt = require('jsonwebtoken');
const Blacklist = require('../modules/auth/Blacklist');
const env = require('../config/env');

async function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    if (!env.jwtSecret) return res.status(503).json({ error: 'Authentication is not configured' });
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    if (await Blacklist.exists({ token })) {
      return res.status(401).json({ error: 'Session revoked' });
    }

    req.user = decoded;
    req.token = token;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { verifyAdmin };
