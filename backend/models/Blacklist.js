const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days (matching JWT expiration)
  }
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
