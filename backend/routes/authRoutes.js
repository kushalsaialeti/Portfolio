const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, checkAuth, logout } = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/check', verifyAdmin, checkAuth);
router.post('/logout', verifyAdmin, logout);

module.exports = router;
