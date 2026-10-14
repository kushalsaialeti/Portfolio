const express = require('express');
const { verifyAdmin } = require('../../middleware/auth');
const { PAYLOAD_LIMIT_BYTES, createAnalyticsController } = require('./analyticsController');

function createAnalyticsRouter(options = {}) {
  const router = express.Router();
  const controller = createAnalyticsController(options);
  router.post('/events', controller.collect);
  router.get('/summary', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  }, verifyAdmin, controller.summary);
  return router;
}

module.exports = createAnalyticsRouter;
module.exports.PAYLOAD_LIMIT_BYTES = PAYLOAD_LIMIT_BYTES;
module.exports.createAnalyticsRouter = createAnalyticsRouter;
