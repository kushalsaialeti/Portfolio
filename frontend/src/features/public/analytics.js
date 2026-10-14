import { chooseVisibleSection, createEngagementSession, makeEvent, TRACKED_SECTIONS } from './engagement';

const PREFERENCE_KEY = 'portfolio:analytics-preference';
const SESSION_KEY = 'portfolio:analytics-session';
const CHANGE_EVENT = 'portfolio:analytics-preference-changed';
const ENDPOINT = `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')}/analytics/events`;
let currentTracker = null;
let memoryPreference = null;

function privacySignal() {
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
}

export function getAnalyticsPreference() {
  if (privacySignal()) return 'blocked';
  try { return localStorage.getItem(PREFERENCE_KEY) || memoryPreference || 'unset'; }
  catch { return memoryPreference || 'unset'; }
}

export function subscribeAnalyticsPreference(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function setAnalyticsPreference(allowed) {
  memoryPreference = allowed ? 'allowed' : 'declined';
  try { localStorage.setItem(PREFERENCE_KEY, memoryPreference); } catch { /* Memory-only preference. */ }
  if (!allowed) {
    currentTracker?.stop(false);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Storage may be disabled. */ }
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function trackingAllowed() {
  if (window.location.pathname !== '/' || getAnalyticsPreference() !== 'allowed') return false;
  try { if (localStorage.getItem('admin_token')) return false; } catch { /* No persistent admin session. */ }
  return typeof crypto.randomUUID === 'function';
}

export function startPublicAnalytics() {
  currentTracker?.stop(false);
  if (!trackingAllowed()) return () => {};
  let sessionId;
  try { sessionId = sessionStorage.getItem(SESSION_KEY); } catch { /* In-memory fallback. */ }
  if (!/^[0-9a-f-]{36}$/i.test(sessionId || '')) sessionId = crypto.randomUUID();
  try { sessionStorage.setItem(SESSION_KEY, sessionId); } catch { /* No fingerprint fallback. */ }
  let stopped = false;
  let queue = [];
  let lastActivity = performance.now();
  let timer;
  const emit = (event) => { if (event && queue.length < 100) queue.push(event); };
  const session = createEngagementSession({ uuid: () => crypto.randomUUID(), emit });
  const activeSection = () => chooseVisibleSection(TRACKED_SECTIONS.flatMap((id) => {
    const node = document.getElementById(id);
    if (!node) return [];
    const { top, bottom } = node.getBoundingClientRect();
    return [{ id, top, bottom }];
  }), window.innerHeight);

  const flush = () => {
    if (!trackingAllowed()) { queue = []; return; }
    while (queue.length) {
      const events = queue.splice(0, 20);
      // No Authorization header or cookies, no referrer URL, and no third-party SDK.
      // Best effort: analytics failures never interrupt reading or contacting us.
      fetch(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, events }), credentials: 'omit',
        referrerPolicy: 'no-referrer', keepalive: true,
      }).catch(() => {});
    }
  };
  const tick = () => {
    if (stopped) return;
    if (!trackingAllowed()) { tracker.stop(false); return; }
    const now = performance.now();
    session.tick({ now, section: activeSection(),
      visible: document.visibilityState === 'visible' && document.hasFocus() && now - lastActivity < 60000 });
  };
  const activity = () => { lastActivity = performance.now(); };
  const boundary = () => { tick(); flush(); };
  const focus = () => { activity(); tick(); };
  const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'];
  const tracker = {
    record(type, properties) {
      if (!stopped && trackingAllowed()) emit(makeEvent(crypto.randomUUID(), type, properties));
    },
    stop(send = true) {
      if (stopped) return;
      if (send) { tick(); flush(); }
      stopped = true;
      queue = [];
      clearInterval(timer);
      events.forEach((name) => window.removeEventListener(name, activity));
      document.removeEventListener('visibilitychange', boundary);
      window.removeEventListener('blur', boundary);
      window.removeEventListener('focus', focus);
      window.removeEventListener('pagehide', boundary);
      if (currentTracker === tracker) currentTracker = null;
    },
  };
  currentTracker = tracker;
  events.forEach((name) => window.addEventListener(name, activity, { passive: true }));
  document.addEventListener('visibilitychange', boundary);
  window.addEventListener('blur', boundary);
  window.addEventListener('focus', focus);
  window.addEventListener('pagehide', boundary);
  tick();
  flush();
  timer = setInterval(() => { tick(); flush(); }, 10000);
  return () => tracker.stop();
}

export function trackPublicEvent(type, properties = {}) {
  currentTracker?.record(type, properties);
}
