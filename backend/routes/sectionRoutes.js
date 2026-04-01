const express = require('express');
const router = express.Router();
const controller = require('../controllers/sectionController');
const { upload } = require('../utils/cloudinary');
const { verifyAdmin } = require('../middleware/authMiddleware');

// 1. Section Content Management (JSON-Based)
router.get('/:slug', controller.getSection);
router.put('/:slug', verifyAdmin, controller.updateSection);

// 2. Media Management (Cloudinary-Based)
// POST: Upload single new image
router.post('/upload', verifyAdmin, upload.single('image'), controller.uploadImage);

// DELETE: Remove image by public_id
router.delete('/image', verifyAdmin, controller.deleteImage);

// PUT: Cleanup old + upload new single image
router.put('/replace', verifyAdmin, upload.single('image'), controller.replaceImage);

module.exports = router;
