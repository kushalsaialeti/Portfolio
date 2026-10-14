const mongoose = require('mongoose');
const AnalyticsEvent = require('./AnalyticsEvent');
const { validateEventsPayload } = require('./analyticsValidation');
const { buildSummaryPipeline, formatSummary } = require('./analyticsSummary');

const PAYLOAD_LIMIT_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 60 * 1000;
// This limiter is intentionally process-local; a multi-instance deployment
// would need a shared counter to enforce the same bound across instances.
const MAX_EVENTS_PER_SESSION_WINDOW = 120;
const MAX_EVENTS_OVERALL_WINDOW = 2000;
const MAX_TRACKED_SESSIONS = 10000;

function createRateLimiter({ now = () => Date.now() } = {}) {
  const sessionWindows = new Map();
  let overall = { startedAt: 0, count: 0 };

  function currentWindow(window, limit) {
    const timestamp = now();
    if (!window.startedAt || timestamp - window.startedAt >= RATE_WINDOW_MS) {
      return { startedAt: timestamp, count: 0, limit };
    }
    return window;
  }

  return {
    check(sessionId, eventCount) {
      const timestamp = now();
      overall = currentWindow(overall, MAX_EVENTS_OVERALL_WINDOW);
      if (overall.count + eventCount > MAX_EVENTS_OVERALL_WINDOW) return false;

      let session = sessionWindows.get(sessionId);
      session = currentWindow(session || { startedAt: timestamp, count: 0 }, MAX_EVENTS_PER_SESSION_WINDOW);
      if (session.count + eventCount > MAX_EVENTS_PER_SESSION_WINDOW) return false;
      session.count += eventCount;
      overall.count += eventCount;
      sessionWindows.set(sessionId, session);

      if (sessionWindows.size > MAX_TRACKED_SESSIONS) {
        const oldest = sessionWindows.keys().next().value;
        if (oldest) sessionWindows.delete(oldest);
      }
      return true;
    },
    reset() {
      sessionWindows.clear();
      overall = { startedAt: 0, count: 0 };
    },
  };
}

function databaseReady() {
  return mongoose.connection.readyState === 1;
}

function privacyOptOut(req) {
  return ['dnt', 'sec-gpc', 'gpc'].some((header) => {
    const value = String(req.headers?.[header] || '').toLowerCase();
    return value === '1' || value === 'true';
  });
}

function createAnalyticsController({
  model = AnalyticsEvent,
  isDatabaseReady = databaseReady,
  now = () => new Date(),
  limiter = createRateLimiter({ now: () => now().getTime() }),
} = {}) {
  async function collect(req, res) {
    if (privacyOptOut(req)) return res.status(204).end();

    let payload;
    try {
      payload = validateEventsPayload(req.body);
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
    if (!isDatabaseReady()) {
      return res.status(503).json({ error: 'Analytics storage is unavailable' });
    }
    if (payload.events.length === 0) {
      return res.status(202).json({ accepted: 0, duplicates: 0 });
    }
    if (!limiter.check(payload.sessionId, payload.events.length)) {
      return res.status(429).json({ error: 'Analytics rate limit exceeded' });
    }

    const createdAt = now();
    const documents = payload.events.map((event) => ({ ...event, sessionId: payload.sessionId, createdAt }));
    try {
      const result = await model.bulkWrite(
        documents.map((document) => ({ insertOne: { document } })),
        { ordered: false },
      );
      const accepted = Number(result?.insertedCount ?? result?.nInserted ?? documents.length);
      return res.status(202).json({ accepted, duplicates: Math.max(0, documents.length - accepted) });
    } catch (error) {
      // Unique eventId is the global dedupe mechanism. MongoDB can report
      // duplicate writes in an unordered batch while successfully writing the
      // remaining events.
      const writeErrors = error?.writeErrors || error?.result?.writeErrors || [];
      const onlyDuplicates = writeErrors.length > 0
        && writeErrors.every((item) => item.code === 11000 || item.err?.code === 11000);
      if (onlyDuplicates) {
        const accepted = Number(error?.result?.insertedCount ?? error?.result?.nInserted ?? 0);
        return res.status(202).json({ accepted, duplicates: documents.length - accepted });
      }
      console.error('Analytics event persistence error:', error.message);
      return res.status(503).json({ error: 'Analytics storage is unavailable' });
    }
  }

  async function summary(req, res) {
    res.set('Cache-Control', 'no-store');
    const days = Number(req.query?.days);
    if (![7, 30, 90].includes(days)) {
      return res.status(400).json({ error: 'days must be one of 7, 30, or 90' });
    }
    if (!isDatabaseReady()) {
      return res.status(503).json({ error: 'Analytics storage is unavailable' });
    }
    const to = now();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    try {
      let aggregate = model.aggregate(buildSummaryPipeline(from, to));
      if (typeof aggregate.allowDiskUse === 'function') aggregate = aggregate.allowDiskUse(true);
      const result = typeof aggregate.exec === 'function' ? await aggregate.exec() : await aggregate;
      return res.json(formatSummary(result?.[0] || {}, { days, from, to }));
    } catch (error) {
      console.error('Analytics summary error:', error.message);
      return res.status(503).json({ error: 'Analytics storage is unavailable' });
    }
  }

  return { collect, summary };
}

module.exports = {
  PAYLOAD_LIMIT_BYTES,
  createRateLimiter,
  privacyOptOut,
  createAnalyticsController,
};
