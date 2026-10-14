import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, BarChart3, Clock3, Eye, MousePointerClick, RefreshCw, Users, Zap } from 'lucide-react';
import api from '../../cms/api';

const WINDOWS = [7, 30, 90];

function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value) || 0);
}

function formatDuration(value) {
  const milliseconds = Number(value) || 0;
  if (milliseconds < 1000) return '0s';
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3 text-white/50">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</span>
        <Icon className="h-4 w-4 text-[#27c93f]" aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-white/45">{detail}</p>}
    </div>
  );
}

function SectionComparison({ sections }) {
  const maxViews = Math.max(...sections.map((section) => Number(section.views) || 0), 0);
  if (!sections.length) return <p className="text-sm text-white/50">No section activity in this period.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">Section activity comparison</caption>
        <thead className="text-xs uppercase tracking-wider text-white/45">
          <tr className="border-b border-white/10">
            <th className="px-3 py-3 font-medium">Section</th>
            <th className="px-3 py-3 font-medium">Views</th>
            <th className="px-3 py-3 font-medium">Visits</th>
            <th className="px-3 py-3 font-medium">Avg. time</th>
            <th className="px-3 py-3 font-medium">Interactions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => {
            const views = Number(section.views) || 0;
            return (
              <tr key={section.id} className="border-b border-white/5 last:border-0">
                <th scope="row" className="px-3 py-3 font-medium text-white">{section.id}</th>
                <td className="px-3 py-3 text-white/70">
                  <div className="flex items-center gap-3">
                    <span className="w-10">{formatNumber(views)}</span>
                    <div className="h-1.5 min-w-20 flex-1 rounded-full bg-white/10" aria-hidden="true">
                      <div className="h-full rounded-full bg-[#27c93f]" style={{ width: `${maxViews ? Math.max((views / maxViews) * 100, views ? 3 : 0) : 0}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-white/70">{formatNumber(section.visits)}</td>
                <td className="px-3 py-3 text-white/70">{formatDuration(section.avgMs)}</td>
                <td className="px-3 py-3 text-white/70">{formatNumber(section.interactions)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DailyTrend({ daily }) {
  const max = Math.max(...daily.map((day) => Number(day.pageViews) || 0), 0);
  if (!daily.length) return <p className="text-sm text-white/50">No daily activity in this period.</p>;

  return (
    <div className="space-y-3">
      <div className="flex h-36 items-end gap-1.5" aria-label="Daily page view trend">
        {daily.map((day) => {
          const value = Number(day.pageViews) || 0;
          const height = max ? Math.max((value / max) * 100, value ? 4 : 0) : 0;
          return (
            <div key={day.date} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${day.date}: ${formatNumber(value)} page views`}>
              <span className="sr-only">{day.date}: {formatNumber(value)} page views</span>
              <div className="w-full rounded-t bg-[#27c93f]/70 transition-colors group-hover:bg-[#27c93f]" style={{ height: `${height}%` }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 text-[10px] text-white/35">
        <span>{daily[0]?.date}</span>
        <span>{daily[daily.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const requestRef = useRef(null);

  const loadSummary = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    const { signal } = controller;
    setStatus('loading');
    setError('');
    try {
      const response = await api.get(`/analytics/summary?days=${days}`, { signal });
      if (!signal.aborted) {
        setData(response.data);
        setStatus('ready');
      }
    } catch (requestError) {
      if (requestError?.name === 'CanceledError' || requestError?.code === 'ERR_CANCELED' || signal.aborted) return;
      setError(requestError?.response?.data?.error || requestError?.response?.data?.message || 'Analytics could not be loaded.');
      setStatus('error');
    }
  }, [days]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadSummary(), 0);
    return () => {
      window.clearTimeout(timeoutId);
      requestRef.current?.abort();
    };
  }, [loadSummary]);

  const totals = useMemo(() => data?.totals || {}, [data]);
  const sections = useMemo(() => data?.sections || [], [data]);
  const projects = useMemo(() => data?.projects || [], [data]);
  const daily = useMemo(() => data?.daily || [], [data]);
  const hasActivity = useMemo(() => (
    Object.values(totals).some((value) => Number(value) > 0)
      || sections.some((section) => Object.values(section).some((value) => Number(value) > 0))
      || projects.some((project) => Object.values(project).some((value) => Number(value) > 0))
  ), [projects, sections, totals]);

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27c93f]">Analytics</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Understand what visitors explore</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/55">Opt-in portfolio activity from anonymous tab sessions. This is active visible time, not a heatmap.</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1" aria-label="Analytics date range">
          {WINDOWS.map((windowDays) => (
            <button key={windowDays} type="button" onClick={() => setDays(windowDays)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${days === windowDays ? 'bg-[#27c93f] text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`} aria-pressed={days === windowDays}>
              {windowDays}d
            </button>
          ))}
        </div>
      </header>

      {status === 'loading' && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60" role="status">
          <RefreshCw className="h-4 w-4 animate-spin text-[#27c93f]" /> Loading the last {days} days…
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-5 text-sm text-red-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</span>
          <button type="button" onClick={() => loadSummary()} className="inline-flex items-center gap-2 self-start rounded-lg border border-red-300/30 px-3 py-2 text-xs font-semibold hover:bg-red-400/10 sm:self-auto"><RefreshCw className="h-3.5 w-3.5" /> Retry</button>
        </div>
      )}
      {status === 'ready' && !hasActivity && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <BarChart3 className="mx-auto h-8 w-8 text-white/25" />
          <h3 className="mt-4 text-base font-semibold text-white">No activity yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/50">There is no opt-in activity for this period. Visitors who decline analytics are not included.</p>
        </div>
      )}
      {status === 'ready' && hasActivity && (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Analytics totals">
            <Metric icon={Users} label="Visits" value={formatNumber(totals.visits)} detail="Anonymous tab sessions" />
            <Metric icon={Eye} label="Page views" value={formatNumber(totals.pageViews)} />
            <Metric icon={Clock3} label="Avg. visit time" value={formatDuration(totals.avgVisitMs)} detail={`${formatDuration(totals.engagedMs)} active time`} />
            <Metric icon={Zap} label="Deep exploration" value={formatNumber(totals.deepVisits)} detail="3+ sections or project details" />
            <Metric icon={MousePointerClick} label="Contact clicks" value={formatNumber(totals.contactClicks)} />
            <Metric icon={BarChart3} label="Inquiries" value={formatNumber(totals.inquiries)} />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
              <div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="font-semibold text-white">Section comparison</h3><p className="mt-1 text-xs text-white/45">Visits and average active time per section visit.</p></div><BarChart3 className="h-4 w-4 text-[#27c93f]" /></div>
              <SectionComparison sections={sections} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="font-semibold text-white">What stands out</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div><dt className="text-xs uppercase tracking-wider text-white/40">Most time</dt><dd className="mt-1 text-white">{data.insights?.mostTimeSection || 'Not enough data'}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-white/40">Least time</dt><dd className="mt-1 text-white">{data.insights?.leastTimeSection || 'Not enough data'}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-white/40">Most interest</dt><dd className="mt-1 text-white">{data.insights?.mostInterestSection || 'Not enough data'}</dd></div>
              </dl>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h3 className="mb-5 font-semibold text-white">Daily trend</h3><DailyTrend daily={daily} /></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h3 className="mb-5 font-semibold text-white">Project interest</h3>{projects.length ? <div className="overflow-x-auto"><table className="w-full min-w-[360px] text-left text-sm"><caption className="sr-only">Project clicks and details</caption><thead className="text-xs uppercase tracking-wider text-white/45"><tr className="border-b border-white/10"><th className="px-2 py-3">Project</th><th className="px-2 py-3">Clicks</th><th className="px-2 py-3">Details</th></tr></thead><tbody>{projects.map((project) => <tr key={project.id} className="border-b border-white/5 last:border-0"><th scope="row" className="px-2 py-3 font-medium text-white">{project.id}</th><td className="px-2 py-3 text-white/70">{formatNumber(project.clicks)}</td><td className="px-2 py-3 text-white/70">{formatNumber(project.details)}</td></tr>)}</tbody></table></div> : <p className="text-sm text-white/50">No project activity in this period.</p>}</div>
          </section>

          <p className="text-xs leading-relaxed text-white/40">No historical backfill. Daily buckets use UTC. Data is retained for {data.retentionDays || 90} days. Section average time is calculated per visit session.</p>
        </>
      )}
    </div>
  );
}
