const Section = require('../models/Section');
const { cloudinary } = require('../utils/cloudinary');

// 1. Get Section by Slug
exports.getSection = async (req, res) => {
  try {
    const { slug } = req.params;
    let section = await Section.findOne({ slug });
    
    if (!section) {
      // Return empty default if not found
      return res.json({ slug, content: {} });
    }
    
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Update/Create Section (Atomic Save)
exports.updateSection = async (req, res) => {
  try {
    const { slug } = req.params;
    const { content } = req.body;
    
    const section = await Section.findOneAndUpdate(
      { slug },
      { content },
      { new: true, upsert: true }
    );
    
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Upload Image to Cloudinary
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: "Upload successful"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Delete Image from Cloudinary
exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "No public_id provided" });
    
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Image deleted from Cloudinary" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Replace Image (Orphan cleanup + new upload)
exports.replaceImage = async (req, res) => {
  try {
    const { old_public_id } = req.body;
    
    // Clean up original
    if (old_public_id) {
      await cloudinary.uploader.destroy(old_public_id);
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No new file uploaded" });
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: "Replacement successful"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
