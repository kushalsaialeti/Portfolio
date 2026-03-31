const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');

// Content Routes
router.get('/content', cmsController.getContent);
router.post('/content/update', cmsController.updateContent);
router.post('/content/seed', cmsController.seedContent);

module.exports = router;
