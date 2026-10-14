const mongoose = require('mongoose');

const baselineSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  sections: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Baseline', baselineSchema);
