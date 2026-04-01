import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import SectionShell from '../components/SectionShell';
import { BLOGS } from '../constants/siteContent';

function BlogCard({ blog }) {
  return (
    <motion.article 
      whileHover={{ y: -10 }}
      className="group relative flex flex-col items-start gap-6 rounded-[32px] border border-white/10 bg-[#0c0c0e] p-8 transition-colors hover:border-[#27c93f]/30"
    >
      <div className="flex items-center gap-3 text-[#27c93f]">
         <div className="p-2 rounded-lg bg-[#27c93f]/10">
            <BookOpen className="w-4 h-4" />
         </div>
         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Insight</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#27c93f] transition-colors leading-tight">
          {blog.title}
        </h3>
        <div className="flex items-center gap-3 text-white/30 text-[10px] font-mono">
           <Calendar className="w-3 h-3" />
           <span>{blog.date}</span>
        </div>
        <p className="text-[#a1a1a6] text-sm leading-relaxed">
          {blog.snippet}
        </p>
      </div>

      <a 
        href={blog.link} 
        className="mt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#27c93f] transition-colors"
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
