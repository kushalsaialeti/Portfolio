import React from 'react';
import SectionShell from '../components/SectionShell';

export default function ActivitiesSection({ section, content }) {
  const activities = content?.activities || [];
  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <ul className="grid gap-3 md:grid-cols-2">
        {activities.map((item) => (
          <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-[#d1d1d6] backdrop-blur-[3px]">
            {item}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
