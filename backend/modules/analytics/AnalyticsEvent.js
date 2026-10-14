const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  sessionId: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  section: { type: String, index: true },
  target: { type: String },
  durationMs: { type: Number },
  createdAt: { type: Date, default: Date.now },
}, {
  strict: true,
  versionKey: false,
});

analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
analyticsEventSchema.index({ sessionId: 1, createdAt: 1 });
analyticsEventSchema.index({ type: 1, createdAt: 1 });

module.exports = mongoose.models.AnalyticsEvent
  || mongoose.model('AnalyticsEvent', analyticsEventSchema);
