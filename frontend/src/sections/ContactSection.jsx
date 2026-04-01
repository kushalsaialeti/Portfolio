import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Instagram, FileText, ExternalLink } from 'lucide-react';
import SectionShell from '../components/SectionShell';

function ContactCard({ label, value, href, icon: Icon }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(39, 201, 63, 0.4)' }}
      className="group flex items-center justify-between rounded-3xl border border-white/10 bg-[#0c0c0e] p-6 backdrop-blur-xl shadow-xl transition-all"
    >
      <div className="flex items-center gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#27c93f]/10 text-[#27c93f] shadow-[0_0_15px_rgba(39,201,63,0.15)] group-hover:shadow-[0_0_20px_rgba(39,201,63,0.3)] transition-all">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</p>
          <p className="mt-1 text-sm font-bold text-white group-hover:text-[#27c93f] transition-colors md:text-base">{value}</p>
        </div>
      </div>
      <ExternalLink className="h-4 w-4 text-white/10 group-hover:text-white/40 transition-colors" />
    </motion.a>
  );
}

export default function ContactSection({ section, content, onNavigate }) {
  const profile = content?.siteProfile;
  
  const contactCards = [
    { label: 'Direct Email', value: profile?.email || 'Loading...', icon: Mail, href: `mailto:${profile?.email}` },
    { label: 'Professional Network', value: 'LinkedIn', icon: Linkedin, href: profile?.linkedin },
    { label: 'Visual Studio', value: 'GitHub', icon: Github, href: profile?.github },
    { label: 'Direct Connection', value: profile?.phone || 'Loading...', icon: Phone, href: `tel:${profile?.phone?.replace(/\s+/g, '')}` }
  ];

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      {/* PRIMARY GRID */}
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {contactCards.filter(c => c.href).map((card) => (
          <ContactCard 
            key={card.label}
            label={card.label} 
            value={card.value} 
            href={card.href} 
            icon={card.icon} 
          />
        ))}
      </div>

      {/* ADDITIONAL SOCIALS */}
      <div className="mt-12 flex flex-wrap items-center gap-6 p-1">
        {profile?.instagram && (
          <motion.a
            href={profile.instagram}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.06)' }}
            className="flex items-center gap-4 rounded-full border border-white/20 px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all"
          >
            <Instagram className="h-4 w-4 text-[#27c93f]" />
            <span>Follow Instagram</span>
          </motion.a>
        )}
        
        {profile?.resume && (
          <motion.a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05, backgroundColor: '#35e050' }}
            className="flex items-center gap-4 rounded-full bg-[#27c93f] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(39,201,63,0.3)] transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>View Resume</span>
          </motion.a>
        )}
      </div>
    </SectionShell>
  );
}
