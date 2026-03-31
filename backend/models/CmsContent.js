const mongoose = require('mongoose');

const CmsContentSchema = new mongoose.Schema({
  siteProfile: {
    name: String,
    tagline: String,
    subtitle: String,
    email: String,
    phone: String,
    github: String,
    linkedin: String,
    instagram: String,
    resume: String,
  },
  siteSections: [{
    id: String,
    navLabel: String,
    title: String,
    eyebrow: String,
    panelInfo: String,
    isVisible: { type: Boolean, default: true },
    order: Number
  }],
  blogs: [{
    title: String,
    date: String,
    snippet: String,
    link: String
  }],
  aboutLines: [String],
  skills: {
    frontend: [String],
    backend: [String],
    databases: [String],
    tools: [String],
    languages: [String],
  },
  projects: [{
    name: String,
    description: String,
    stack: [String],
    live: String
  }],
  activities: [String]
}, { timestamps: true });

module.exports = mongoose.model('CmsContent', CmsContentSchema);
