const Section = require('./Section');
const Baseline = require('./Baseline');
const { cloudinary } = require('../../integrations/cloudinary');
const { getCache, setCache, deleteCache } = require('../../integrations/redis');
const { defaultSections } = require('../../data/defaultSections');
const mongoose = require('mongoose');

const ALLOWED_SECTION_SLUGS = new Set([
  ...Object.keys(defaultSections),
  'services',
]);

// OPTIMIZATION: Cache TTL constants
const CACHE_TTL_SECTION = 300;

// Read-only compatibility endpoint for clients that still expect one CMS payload.
exports.getContent = async (_req, res) => {
  const cacheKey = 'cms:content';
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.set('X-Cache', 'FALLBACK').json({
        siteProfile: defaultSections.home?.profile || {},
        siteSections: defaultSections.layout?.siteSections || [],
        aboutLines: defaultSections.about?.aboutLines || [],
        gallery: defaultSections.home?.gallery || [],
        skills: defaultSections.skills?.skills || {},
        projects: defaultSections.projects?.projects || [],
        contact: defaultSections.contact || {},
        blogs: defaultSections.extra?.blogs || [],
        activities: defaultSections.extra?.activities || [],
        experience: defaultSections.experience || {},
      });
    }
    const cached = await getCache(cacheKey);
    if (cached) return res.set('X-Cache', 'HIT').json(cached);

    const storedSections = await Section.find({ slug: { $in: [...ALLOWED_SECTION_SLUGS] } }).lean();
    const content = { ...defaultSections };
    storedSections.forEach((section) => { content[section.slug] = section.content; });
    const response = {
      siteProfile: content.home?.profile || {},
      siteSections: content.layout?.siteSections || [],
      aboutLines: content.about?.aboutLines || [],
      gallery: content.home?.gallery || [],
      skills: content.skills?.skills || {},
      projects: content.projects?.projects || [],
      contact: content.contact || {},
      blogs: content.extra?.blogs || [],
      activities: content.extra?.activities || [],
      experience: content.experience || {},
    };
    await setCache(cacheKey, response, CACHE_TTL_SECTION);
    return res.set('X-Cache', 'MISS').json(response);
  } catch (error) {
    console.error('Aggregate CMS fetch error:', error);
    return res.status(500).json({ error: 'Unable to load CMS content' });
  }
};

// 1. Get Section by Slug
exports.getSection = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!ALLOWED_SECTION_SLUGS.has(slug)) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // OPTIMIZATION: Check cache first
    const cacheKey = `section:${slug}`;
    if (mongoose.connection.readyState !== 1) {
      return res.set('X-Cache', 'FALLBACK').json({ slug, content: defaultSections[slug] || {} });
    }
    const cachedSection = await getCache(cacheKey);
    if (cachedSection) {
      console.log(`✅ Cache HIT: Section ${slug}`);
      return res.set('X-Cache', 'HIT').json(cachedSection);
    }
    
    let section = await Section.findOne({ slug }).lean(); // OPTIMIZATION: Use .lean() for read-only
    
    if (!section) {
      section = { slug, content: defaultSections[slug] || {} };
    }
    
    // OPTIMIZATION: Cache the result
    await setCache(cacheKey, section, CACHE_TTL_SECTION);
    res.set('X-Cache', 'MISS').json(section);
  } catch (error) {
    console.error(`Section fetch error for ${req.params.slug}:`, error);
    res.status(500).json({ error: error.message });
  }
};

exports.seedBaseline = async (req, res) => {
  try {
    const storedBaseline = await Baseline.findOne({ key: 'default' }).lean();
    const baselineSource = storedBaseline?.sections || defaultSections;
    const source = Object.fromEntries(
      Object.entries(baselineSource).filter(([slug]) => ALLOWED_SECTION_SLUGS.has(slug)),
    );
    const writes = Object.entries(source).map(([slug, content]) => (
      Section.findOneAndUpdate(
        { slug },
        { content },
        { new: true, upsert: true }
      )
    ));

    const sections = await Promise.all(writes);
    await Promise.all(Object.keys(source).map((slug) => deleteCache(`section:${slug}`)));
    await deleteCache('cms:content');

    res.json({ message: 'Baseline data synced successfully to database.', sections });
  } catch (error) {
    console.error('Baseline seed error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.saveBaseline = async (req, res) => {
  try {
    const sections = await Section.find({}).lean();
    if (!sections || sections.length === 0) {
      return res.status(400).json({ message: 'No sections found in database to save as baseline.' });
    }

    const snapshot = { ...defaultSections };
    sections.forEach((s) => {
      if (ALLOWED_SECTION_SLUGS.has(s.slug)) snapshot[s.slug] = s.content;
    });
    await Baseline.findOneAndUpdate(
      { key: 'default' },
      { key: 'default', sections: snapshot },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({
      message: 'Current live CMS data saved into the database baseline successfully!',
      defaultSections: snapshot,
    });
  } catch (error) {
    console.error('Save baseline error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Update/Create Section (Atomic Save)
exports.updateSection = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase();
    const content = req.body?.content;
    if (!ALLOWED_SECTION_SLUGS.has(slug)) {
      return res.status(400).json({ error: 'Unsupported section slug' });
    }
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return res.status(400).json({ error: 'Section content must be an object' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'CMS storage is unavailable' });
    }
    
    const section = await Section.findOneAndUpdate(
      { slug },
      { $set: { content, lastUpdated: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    // OPTIMIZATION: Invalidate cache after update
    const cacheKey = `section:${slug}`;
    await deleteCache(cacheKey);
    await deleteCache('cms:content');
    console.log(`✅ Cache invalidated: Section ${slug}`);
    
    res.json(section);
  } catch (error) {
    console.error(`Section update error for ${req.params.slug}:`, error);
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
    console.error('Image upload error:', error);
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
    console.error('Image delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 5. Replace Image (Orphan cleanup + new upload)
exports.replaceImage = async (req, res) => {
  try {
    const { old_public_id } = req.body;

    // Multer uploads the replacement before this handler runs. Check it before
    // deleting anything so a missing/failed upload can never destroy the old
    // image.
    if (!req.file) {
      return res.status(400).json({ message: "No new file uploaded" });
    }

    // Cleanup is deliberately after the new asset exists. If cleanup fails,
    // the old image remains available and the caller can retry safely.
    if (old_public_id) {
      await cloudinary.uploader.destroy(old_public_id);
    }
    
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: "Replacement successful"
    });
  } catch (error) {
    console.error('Image replace error:', error);
    res.status(500).json({ error: error.message });
  }
};
