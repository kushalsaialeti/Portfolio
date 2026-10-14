const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const express = require('express');
const apiApp = require('../app');

const { validateEventsPayload } = require('../modules/analytics/analyticsValidation');
const { formatSummary } = require('../modules/analytics/analyticsSummary');
const { createAnalyticsRouter } = require('../modules/analytics/analyticsRoutes');
const sectionRoutes = require('../modules/cms/sectionRoutes');

const sessionId = '11111111-1111-4111-8111-111111111111';
const eventId = (last) => `11111111-1111-4111-8111-1111111111${last}`;

test('analytics validation keeps only the allowlisted event fields', () => {
  const payload = validateEventsPayload({
    sessionId: sessionId.toUpperCase(),
    events: [{
      id: eventId('01'),
      type: 'section_time',
      section: 'projects',
      durationMs: 15000,
      title: 'must not be stored',
      url: 'https://example.test/private',
    }],
  });

  assert.deepEqual(payload, {
    sessionId,
    events: [{
      eventId: eventId('01'),
      type: 'section_time',
      section: 'projects',
      durationMs: 15000,
    }],
  });
});

test('analytics validation rejects malformed IDs, sections, targets and durations', () => {
  assert.throws(() => validateEventsPayload({ sessionId: 'not-a-uuid', events: [] }), /sessionId/);
  assert.throws(() => validateEventsPayload({
    sessionId,
    events: [{ id: eventId('02'), type: 'section_view', section: 'private' }],
  }), /section/);
  assert.throws(() => validateEventsPayload({
    sessionId,
    events: [{ id: eventId('03'), type: 'project_click', target: 'project-200' }],
  }), /target/);
  assert.throws(() => validateEventsPayload({
    sessionId,
    events: [{ id: eventId('04'), type: 'section_time', section: 'home', durationMs: 15001 }],
  }), /durationMs/);
});

test('analytics validation accepts the compact project action targets', () => {
  const payload = validateEventsPayload({
    sessionId,
    events: [
      { id: eventId('07'), type: 'project_click', section: 'projects', target: 'live' },
      { id: eventId('08'), type: 'project_click', section: 'projects', target: 'project-0' },
    ],
  });
  assert.equal(payload.events.length, 2);
});

test('summary formatting calculates averages and insights from visited sections', () => {
  const from = new Date('2026-01-01T00:00:00.000Z');
  const to = new Date('2026-01-08T00:00:00.000Z');
  const summary = formatSummary({
    totals: [{ visits: 2, pageViews: 3, engagedMs: 9000, deepVisits: 1, contactClicks: 1, inquiries: 1 }],
    sectionStats: [
      { _id: 'home', views: 2, visits: 2 },
      { _id: 'projects', views: 1, visits: 1 },
    ],
    sectionTimes: [
      { _id: 'home', totalMs: 6000 },
      { _id: 'projects', totalMs: 3000 },
    ],
    interactions: [{ _id: 'projects', interactions: 2 }],
    projects: [{ _id: 'project-0', clicks: 2, details: 1 }],
    dailyVisits: [{ _id: '2026-01-02', visits: 2 }],
    dailyPageViews: [{ _id: '2026-01-02', pageViews: 3 }],
  }, { days: 7, from, to });

  assert.deepEqual(summary.totals, {
    visits: 2,
    pageViews: 3,
    engagedMs: 9000,
    avgVisitMs: 4500,
    deepVisits: 1,
    contactClicks: 1,
    inquiries: 1,
  });
  assert.equal(summary.sections.find((section) => section.id === 'home').avgMs, 3000);
  assert.equal(summary.insights.mostTimeSection, 'home');
  assert.equal(summary.insights.leastTimeSection, 'projects');
  assert.equal(summary.insights.mostInterestSection, 'projects');
  assert.deepEqual(summary.projects, [{ id: 'project-0', clicks: 2, details: 1 }]);
  assert.deepEqual(summary.daily, [{ date: '2026-01-02', visits: 2, pageViews: 3 }]);
});

function request(server, body, headers = {}, path = '/events') {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify(body);
    const address = server.address();
    const req = http.request({
      port: address.port,
      method: 'POST',
      path,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(requestBody), ...headers },
    }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { text += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: text ? JSON.parse(text) : null }));
    });
    req.on('error', reject);
    req.end(requestBody);
  });
}

test('analytics route smoke test persists a sanitized batch with an injected model', async () => {
  const writes = [];
  const model = {
    async bulkWrite(operations) {
      writes.push(...operations);
      return { insertedCount: operations.length };
    },
  };
  const app = express();
  app.use(express.json());
  app.use(createAnalyticsRouter({ model, isDatabaseReady: () => true }));
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  try {
    const response = await request(server, {
      sessionId,
      events: [{ id: eventId('05'), type: 'page_view', title: 'private', url: 'https://example.test' }],
    });
    assert.equal(response.status, 202);
    assert.equal(response.body.accepted, 1);
    assert.deepEqual(Object.keys(writes[0].insertOne.document).sort(), ['createdAt', 'eventId', 'sessionId', 'type']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('analytics route returns 503 instead of claiming success when storage is unavailable', async () => {
  const app = express();
  app.use(express.json());
  app.use(createAnalyticsRouter({ isDatabaseReady: () => false }));
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  try {
    const response = await request(server, {
      sessionId,
      events: [{ id: eventId('06'), type: 'page_view' }],
    });
    assert.equal(response.status, 503);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('production app rejects analytics JSON bodies larger than 16kb', async () => {
  const server = await new Promise((resolve) => {
    const instance = apiApp.listen(0, () => resolve(instance));
  });
  try {
    const response = await request(server, { events: [], padding: 'x'.repeat(17000) }, {}, '/api/analytics/events');
    assert.equal(response.status, 413);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('CMS media replacement route is registered before the generic section slug route', () => {
  const paths = sectionRoutes.stack
    .filter((layer) => layer.route)
    .map((layer) => `${Object.keys(layer.route.methods)[0]} ${layer.route.path}`);
  assert.ok(paths.indexOf('put /replace') < paths.indexOf('put /:slug'));
});
