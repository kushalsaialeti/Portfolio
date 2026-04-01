const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Content Routes (Public Read)
router.get('/content', cmsController.getContent);

// Protected Operations (Write/Reset)
router.post('/content/update', verifyAdmin, cmsController.updateContent);
router.post('/content/seed', verifyAdmin, cmsController.seedContent);

module.exports = router;
