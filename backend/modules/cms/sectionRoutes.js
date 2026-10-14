const express = require('express');
const router = express.Router();
const controller = require('./sectionController');
const { upload } = require('../../integrations/cloudinary');
const { verifyAdmin } = require('../../middleware/auth');

// Media paths must come before PUT /:slug; otherwise PUT /replace is treated
// as a section update and the upload handler never runs.
router.post('/upload', verifyAdmin, upload.single('image'), controller.uploadImage);
router.delete('/image', verifyAdmin, controller.deleteImage);
router.put('/replace', verifyAdmin, upload.single('image'), controller.replaceImage);

// 1. Section Content Management (JSON-Based)
router.post('/seed-baseline', verifyAdmin, controller.seedBaseline);
router.post('/save-baseline', verifyAdmin, controller.saveBaseline);
router.get('/:slug', controller.getSection);
router.put('/:slug', verifyAdmin, controller.updateSection);

module.exports = router;
