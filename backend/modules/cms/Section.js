const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  content: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

SectionSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Section', SectionSchema);
