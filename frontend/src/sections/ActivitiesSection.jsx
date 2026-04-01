import React from 'react';
import SectionShell from '../components/SectionShell';

export default function ActivitiesSection({ section, content }) {
  const activities = content?.activities || [];
  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <ul className="grid gap-3 md:grid-cols-2">
        {activities.map((item) => (
          <li key={item} className="rounded-xl border border-[var(--border)] bg-[var(--cards)] p-4 text-sm leading-7 text-[var(--text-secondary)] backdrop-blur-[3px] shadow-[var(--shadow-sm)]">
            {item}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
