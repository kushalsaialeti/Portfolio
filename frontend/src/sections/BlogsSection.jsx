import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import SectionShell from '../components/SectionShell';
import { BLOGS } from '../constants/siteContent';

function BlogCard({ blog }) {
  return (
    <motion.article 
      whileHover={{ y: -10 }}
      className="group relative flex flex-col items-start gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--cards)] p-8 transition-colors hover:border-[var(--accent)]/30 shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center gap-3 text-[var(--accent)]">
         <div className="p-2 rounded-lg bg-[var(--accent)]/10">
            <BookOpen className="w-4 h-4" />
         </div>
         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Insight</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-tight">
          {blog.title}
        </h3>
        <div className="flex items-center gap-3 text-[var(--text-secondary)]/50 text-[10px] font-mono">
           <Calendar className="w-3 h-3" />
           <span>{blog.date}</span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          {blog.snippet}
        </p>
      </div>

      <a 
        href={blog.link} 
        className="mt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
      >
        <span>Full Article</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
      </a>
    </motion.article>
  );
}

export default function BlogsSection({ section, content }) {
  const blogs = content?.blogs || [];
  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
        {blogs.map((blog, idx) => (
          <BlogCard key={idx} blog={blog} />
        ))}
      </div>
    </SectionShell>
  );
}
