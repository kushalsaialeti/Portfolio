export const TRACKED_SECTIONS = ['home', 'services', 'about', 'projects', 'skills', 'contact'];
const TYPES = new Set(['page_view', 'section_view', 'section_time', 'project_click',
  'project_details', 'contact_click', 'contact_submit', 'resume_click', 'service_click']);

// A deliberately small vocabulary: no form text, titles, URLs or identity data.
export function makeEvent(id, type, properties = {}) {
  if (!TYPES.has(type)) return null;
  const event = { id, type };
  if (TRACKED_SECTIONS.includes(properties.section)) event.section = properties.section;
  const target = properties.target;
  if (typeof target === 'string' && /^(project|service)-(0|[1-9]\d{0,2})$/.test(target)
    && Number(target.split('-')[1]) <= 199) event.target = target;
  if (['contact', 'resume'].includes(target)) event.target = target;
  if (['project_click', 'project_details'].includes(type) && !event.target?.startsWith('project-')) return null;
  if (type === 'service_click' && !event.target?.startsWith('service-')) return null;
  if (['contact_click', 'contact_submit'].includes(type)) event.target = 'contact';
  if (type === 'resume_click') event.target = 'resume';
  if (['section_time', 'section_view'].includes(type) && !event.section) return null;
  if (type === 'section_time') {
    if (!Number.isFinite(properties.durationMs) || properties.durationMs <= 0) return null;
    event.durationMs = Math.min(15000, Math.round(properties.durationMs));
  }
  return event;
}

// Only one section receives time per tick, including nested home/services.
// Discard long timer gaps rather than mistaking a sleeping device for reading.
export function createEngagementSession({ uuid, emit }) {
  let previous = null;
  let viewedPage = false;
  const viewedSections = new Set();
  return {
    tick({ now, section, visible }) {
      if (!viewedPage && visible) {
        emit(makeEvent(uuid(), 'page_view'));
        viewedPage = true;
      }
      if (previous?.visible && previous.section) {
        const elapsed = now - previous.now;
        if (elapsed > 0 && elapsed <= 15000) {
          emit(makeEvent(uuid(), 'section_time', { section: previous.section, durationMs: elapsed }));
        }
      }
      const active = visible && TRACKED_SECTIONS.includes(section) ? section : null;
      if (active && !viewedSections.has(active)) {
        emit(makeEvent(uuid(), 'section_view', { section: active }));
        viewedSections.add(active);
      }
      previous = { now, section: active, visible };
    },
  };
}

export function chooseVisibleSection(rects, viewportHeight) {
  const visible = rects.map(({ id, top, bottom }) => ({
    id, top, bottom, area: Math.max(0, Math.min(bottom, viewportHeight) - Math.max(top, 0)),
  })).filter((item) => item.area > 0);
  const center = visible.filter((item) => item.top <= viewportHeight / 2 && item.bottom > viewportHeight / 2);
  // The smaller enclosing section is the more specific one (services within home).
  if (center.length) return center.sort((a, b) => (a.bottom - a.top) - (b.bottom - b.top))[0].id;
  return visible.sort((a, b) => b.area - a.area)[0]?.id || null;
}
