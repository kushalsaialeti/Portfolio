const ALLOWED_TYPES = new Set([
  'page_view',
  'section_view',
  'section_time',
  'project_click',
  'project_details',
  'contact_click',
  'contact_submit',
  'resume_click',
  'service_click',
]);

const ALLOWED_SECTIONS = ['home', 'services', 'about', 'projects', 'skills', 'contact'];
const ALLOWED_SECTION_SET = new Set(ALLOWED_SECTIONS);
const ALLOWED_TARGETS = new Set(['live', 'source', 'contact', 'resume']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TARGET_PATTERN = /^(project|service)-(0|[1-9][0-9]{0,2})$/;
const EVENT_KEYS = new Set(['id', 'type', 'section', 'target', 'durationMs']);

function isUuid(value) {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

function isAllowedTarget(value) {
  if (typeof value !== 'string') return false;
  if (ALLOWED_TARGETS.has(value)) return true;
  const match = value.match(TARGET_PATTERN);
  return Boolean(match && Number(match[2]) <= 199);
}

function invalid(message, details = undefined) {
  const error = new Error(message);
  error.statusCode = 400;
  if (details) error.details = details;
  return error;
}

function validateEvent(event, index) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    throw invalid(`events[${index}] must be an object`);
  }
  if (!isUuid(event.id)) throw invalid(`events[${index}].id must be a UUID`);
  if (typeof event.type !== 'string' || !ALLOWED_TYPES.has(event.type)) {
    throw invalid(`events[${index}].type is not supported`);
  }

  const sanitized = { eventId: event.id.toLowerCase(), type: event.type };
  if (event.section !== undefined) {
    if (typeof event.section !== 'string' || !ALLOWED_SECTION_SET.has(event.section)) {
      throw invalid(`events[${index}].section is not supported`);
    }
    sanitized.section = event.section;
  }
  if (event.target !== undefined) {
    if (!isAllowedTarget(event.target)) throw invalid(`events[${index}].target is not supported`);
    sanitized.target = event.target;
  }

  if (event.type === 'section_time') {
    if (!sanitized.section) throw invalid(`events[${index}].section is required for section_time`);
    if (!Number.isInteger(event.durationMs) || event.durationMs < 0 || event.durationMs > 15000) {
      throw invalid(`events[${index}].durationMs must be an integer from 0 to 15000`);
    }
    sanitized.durationMs = event.durationMs;
  }

  if (event.type === 'section_view' && !sanitized.section) {
    throw invalid(`events[${index}].section is required for section_view`);
  }

  const targetPrefixes = {
    project_details: 'project-',
    service_click: 'service-',
  };
  const prefix = targetPrefixes[event.type];
  if (prefix && sanitized.target !== undefined && !sanitized.target.startsWith(prefix)) {
    throw invalid(`events[${index}].target does not match ${event.type}`);
  }
  if (event.type === 'project_click' && sanitized.target !== undefined
    && !sanitized.target.startsWith('project-') && !['live', 'source'].includes(sanitized.target)) {
    throw invalid(`events[${index}].target does not match ${event.type}`);
  }
  if ((event.type === 'contact_click' || event.type === 'contact_submit')
    && sanitized.target !== undefined && sanitized.target !== 'contact') {
    throw invalid(`events[${index}].target does not match ${event.type}`);
  }
  if (event.type === 'resume_click' && sanitized.target !== undefined && sanitized.target !== 'resume') {
    throw invalid(`events[${index}].target does not match ${event.type}`);
  }

  // Deliberately build a new object. Unknown keys (including URLs, titles and
  // form/identity data) never reach the persistence layer.
  return sanitized;
}

function validateEventsPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw invalid('Request body must be an object');
  }
  if (!isUuid(body.sessionId)) throw invalid('sessionId must be a UUID');
  if (!Array.isArray(body.events)) throw invalid('events must be an array');
  if (body.events.length > 20) throw invalid('A maximum of 20 events may be sent at once');

  const sessionId = body.sessionId.toLowerCase();
  const events = body.events.map(validateEvent);
  const eventIds = new Set();
  for (const event of events) {
    if (eventIds.has(event.eventId)) throw invalid('Event IDs must be unique within a request');
    eventIds.add(event.eventId);
  }
  return { sessionId, events };
}

module.exports = {
  ALLOWED_TYPES,
  ALLOWED_SECTIONS,
  ALLOWED_TARGETS,
  EVENT_KEYS,
  isUuid,
  isAllowedTarget,
  validateEvent,
  validateEventsPayload,
};
