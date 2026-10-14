const { ALLOWED_SECTIONS } = require('./analyticsValidation');

const INTERACTION_TYPES = [
  'project_click',
  'project_details',
  'contact_click',
  'contact_submit',
  'resume_click',
  'service_click',
];

function inferredSectionExpression() {
  return {
    $cond: [
      { $in: ['$section', ALLOWED_SECTIONS] },
      '$section',
      {
        $switch: {
          branches: [
            { case: { $in: ['$type', ['project_click', 'project_details']] }, then: 'projects' },
            { case: { $eq: ['$type', 'service_click'] }, then: 'services' },
            { case: { $in: ['$type', ['contact_click', 'contact_submit']] }, then: 'contact' },
          ],
          default: null,
        },
      },
    ],
  };
}

function buildSummaryPipeline(from, to) {
  return [
    { $match: { createdAt: { $gte: from, $lt: to } } },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: '$sessionId',
              pageViews: { $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] } },
              engagedMs: {
                $sum: { $cond: [{ $eq: ['$type', 'section_time'] }, { $ifNull: ['$durationMs', 0] }, 0] },
              },
              contactClicks: { $sum: { $cond: [{ $eq: ['$type', 'contact_click'] }, 1, 0] } },
              inquiries: { $sum: { $cond: [{ $eq: ['$type', 'contact_submit'] }, 1, 0] } },
              sectionViews: {
                $addToSet: { $cond: [{ $eq: ['$type', 'section_view'] }, '$section', null] },
              },
              hasProjectDetails: { $max: { $cond: [{ $eq: ['$type', 'project_details'] }, 1, 0] } },
            },
          },
          {
            $project: {
              pageViews: 1,
              engagedMs: 1,
              contactClicks: 1,
              inquiries: 1,
              deep: {
                $cond: [
                  { $or: [
                    { $gte: [{ $size: { $setDifference: ['$sectionViews', [null]] } }, 3] },
                    { $eq: ['$hasProjectDetails', 1] },
                  ] },
                  1,
                  0,
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              visits: { $sum: 1 },
              pageViews: { $sum: '$pageViews' },
              engagedMs: { $sum: '$engagedMs' },
              contactClicks: { $sum: '$contactClicks' },
              inquiries: { $sum: '$inquiries' },
              deepVisits: { $sum: '$deep' },
            },
          },
        ],
        sectionStats: [
          { $match: { type: 'section_view', section: { $in: ALLOWED_SECTIONS } } },
          {
            $group: {
              _id: { section: '$section', session: '$sessionId' },
              views: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.section',
              views: { $sum: '$views' },
              visits: { $sum: 1 },
            },
          },
        ],
        sectionTimes: [
          { $match: { type: 'section_time', section: { $in: ALLOWED_SECTIONS } } },
          { $group: { _id: '$section', totalMs: { $sum: { $ifNull: ['$durationMs', 0] } } } },
        ],
        interactions: [
          { $match: { type: { $in: INTERACTION_TYPES } } },
          { $set: { associatedSection: inferredSectionExpression() } },
          { $match: { associatedSection: { $in: ALLOWED_SECTIONS } } },
          { $group: { _id: '$associatedSection', interactions: { $sum: 1 } } },
        ],
        projects: [
          {
            $match: {
              type: { $in: ['project_click', 'project_details'] },
              target: { $regex: '^project-[0-9]{1,3}$' },
            },
          },
          {
            $group: {
              _id: '$target',
              clicks: { $sum: { $cond: [{ $eq: ['$type', 'project_click'] }, 1, 0] } },
              details: { $sum: { $cond: [{ $eq: ['$type', 'project_details'] }, 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ],
        dailyVisits: [
          { $set: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } } } },
          { $group: { _id: { date: '$date', session: '$sessionId' } } },
          { $group: { _id: '$_id.date', visits: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        dailyPageViews: [
          { $match: { type: 'page_view' } },
          { $set: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } } } },
          { $group: { _id: '$date', pageViews: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ];
}

function firstOrNull(value) {
  return Array.isArray(value) && value.length ? value[0] : null;
}

function formatSummary(facet, { days, from, to }) {
  const totals = firstOrNull(facet?.totals) || {};
  const statsBySection = new Map((facet?.sectionStats || []).map((item) => [item._id, item]));
  const timesBySection = new Map((facet?.sectionTimes || []).map((item) => [item._id, item]));
  const interactionsBySection = new Map((facet?.interactions || []).map((item) => [item._id, item]));

  const sections = ALLOWED_SECTIONS.map((id) => {
    const stat = statsBySection.get(id) || {};
    const totalMs = Number(timesBySection.get(id)?.totalMs || 0);
    const visits = Number(stat.visits || 0);
    return {
      id,
      views: Number(stat.views || 0),
      visits,
      totalMs,
      avgMs: visits ? totalMs / visits : 0,
      interactions: Number(interactionsBySection.get(id)?.interactions || 0),
    };
  });
  const visited = sections.filter((section) => section.visits > 0);
  const byTime = [...visited].sort((a, b) => b.totalMs - a.totalMs || a.id.localeCompare(b.id));
  const byInterest = [...visited].sort((a, b) => b.interactions - a.interactions || a.id.localeCompare(b.id));
  const mostInterest = byInterest[0]?.interactions ? byInterest[0].id : null;

  const dailyVisits = new Map((facet?.dailyVisits || []).map((item) => [item._id, Number(item.visits || 0)]));
  const dailyPageViews = new Map((facet?.dailyPageViews || []).map((item) => [item._id, Number(item.pageViews || 0)]));
  const dailyDates = new Set([...dailyVisits.keys(), ...dailyPageViews.keys()]);
  const daily = [...dailyDates].sort().map((date) => ({
    date,
    visits: dailyVisits.get(date) || 0,
    pageViews: dailyPageViews.get(date) || 0,
  }));
  const projects = (facet?.projects || []).map((project) => ({
    id: project._id,
    clicks: Number(project.clicks || 0),
    details: Number(project.details || 0),
  })).sort((a, b) => Number(String(a.id).split('-')[1]) - Number(String(b.id).split('-')[1]));

  const visits = Number(totals.visits || 0);
  const engagedMs = Number(totals.engagedMs || 0);
  return {
    days,
    from: from.toISOString(),
    to: to.toISOString(),
    totals: {
      visits,
      pageViews: Number(totals.pageViews || 0),
      engagedMs,
      avgVisitMs: visits ? engagedMs / visits : 0,
      deepVisits: Number(totals.deepVisits || 0),
      contactClicks: Number(totals.contactClicks || 0),
      inquiries: Number(totals.inquiries || 0),
    },
    sections,
    projects,
    daily,
    insights: {
      mostTimeSection: byTime[0]?.id || null,
      leastTimeSection: byTime[byTime.length - 1]?.id || null,
      mostInterestSection: mostInterest,
    },
    definitions: {
      visits: 'Unique anonymous sessions with at least one event in the selected UTC rolling interval.',
      engagedTime: 'The sum of section_time durations reported by opted-in clients, in milliseconds.',
      deepVisits: 'Unique sessions with at least three different section_view sections or one project_details event.',
    },
    retentionDays: 90,
  };
}

module.exports = {
  INTERACTION_TYPES,
  buildSummaryPipeline,
  formatSummary,
};
