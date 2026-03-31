const express = require('express');
const router = express.Router();
const controller = require('../controllers/sectionController');
const { upload } = require('../utils/cloudinary');

// 1. Section Content Management (JSON-Based)
router.get('/:slug', controller.getSection);
router.put('/:slug', controller.updateSection);

// 2. Media Management (Cloudinary-Based)
// POST: Upload single new image
router.post('/upload', upload.single('image'), controller.uploadImage);

// DELETE: Remove image by public_id
router.delete('/image', controller.deleteImage);

// PUT: Cleanup old + upload new single image
router.put('/replace', upload.single('image'), controller.replaceImage);

module.exports = router;
