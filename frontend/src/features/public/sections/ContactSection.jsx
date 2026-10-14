import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Instagram, FileText, ExternalLink, Send, CheckCircle, MapPin } from 'lucide-react';
import SectionShell from '../../../components/SectionShell';
import api from '../../../cms/api';
import { trackPublicEvent } from '../analytics';

const isSafeContactHref = (value) => {
  if (!value || value === '#') return false;
  if (/^(mailto|tel):/i.test(value)) return true;
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

function ContactCard({ label, value, href, icon: Icon }) {
  const prefersReducedMotion = useReducedMotion();
  if (!isSafeContactHref(href)) return null;
  const opensNewTab = /^https?:/i.test(href);
  return (
    <motion.a
      href={href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer noopener' : undefined}
      onClick={() => trackPublicEvent('contact_click', { section: 'contact', target: 'contact' })}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02, y: -4, borderColor: 'var(--accent)' }}
      className="group flex min-w-0 items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl shadow-[var(--shadow-sm)] transition-all hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none"
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition-transform group-hover:scale-110">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">{label}</span>
          <span className="block truncate text-sm font-bold text-[var(--text-primary)] transition-colors group-hover:text-white">{value}</span>
        </span>
      </span>
      <ExternalLink aria-hidden="true" className="ml-3 h-3 w-3 shrink-0 text-[var(--text-secondary)]/20" />
    </motion.a>
  );
}

export default function ContactSection({ section, content }) {
  const prefersReducedMotion = useReducedMotion();
  const profile = content?.siteProfile;
  const contact = content?.contact || {};
  const placeholders = contact.placeholders || {};
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const contactCards = [
    profile?.email && { label: 'Direct email', value: profile.email, icon: Mail, href: `mailto:${profile.email}` },
    profile?.linkedin && { label: 'Network', value: 'LinkedIn', icon: Linkedin, href: profile.linkedin },
    profile?.github && { label: 'GitHub', value: 'Source code', icon: Github, href: profile.github },
    profile?.phone && { label: 'Phone', value: profile.phone, icon: Phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    {
      label: 'Location',
      value: profile?.location?.text || 'Bhimavaram, SRKR',
      icon: MapPin,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.location?.query || 'SRKR Engineering College, Bhimavaram')}`,
    },
  ].filter(Boolean);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (status.msg) setStatus({ type: '', msg: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await api.post('/contact', formData);
      trackPublicEvent('contact_submit', { section: 'contact', target: 'contact' });
      setStatus({ type: 'success', msg: contact.successMessage || 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', msg: contact.errorMessage || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = (field) => ({
    id: `contact-${field}`,
    name: field,
    value: formData[field],
    onChange: (e) => updateField(field, e.target.value),
    'aria-describedby': status.msg ? 'contact-status' : undefined,
    className: 'w-full rounded-2xl border border-white/10 bg-black/20 px-6 py-4 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-zinc-600 focus:border-white/45 focus-visible:ring-2 focus-visible:ring-white/30',
  });

  return (
    <SectionShell id={section?.id || 'contact'} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="min-w-0 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-widest text-[var(--text-primary)]">{contact.introTitle || 'Start a conversation'}</h3>
            <p className="max-w-prose text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
              {contact.introText || 'Have a project in mind or a question about the work? Share a little context and I will review it carefully.'}
            </p>
            <p className="max-w-prose text-sm leading-relaxed text-zinc-500">
              {contact.inquiryPrompt || 'Helpful context includes your goals, intended scope, timeline, and budget range. It is fine if some details are still taking shape.'}
            </p>
          </div>

          <div className="grid min-w-0 gap-4">
            {contactCards.map((card) => <ContactCard key={card.label} {...card} />)}
          </div>

          <div className="flex flex-col gap-4">
            {profile?.resume && isSafeContactHref(profile.resume) && (
              <motion.a
                href={profile.resume}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => trackPublicEvent('resume_click', { section: 'contact', target: 'resume' })}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--text-primary)] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--bg-base)] shadow-xl shadow-[var(--bg-base)]/5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none"
              >
                <FileText aria-hidden="true" className="h-4 w-4" />
                <span>Download CV</span>
              </motion.a>
            )}
            {profile?.instagram && isSafeContactHref(profile.instagram) && (
              <motion.a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => trackPublicEvent('contact_click', { section: 'contact', target: 'contact' })}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                className="flex items-center justify-center gap-3 rounded-2xl border border-[var(--border)] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] backdrop-blur-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none"
              >
                <Instagram aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                <span>Instagram</span>
              </motion.a>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[var(--shadow-lg)] md:p-10 motion-reduce:transform-none"
          >
            <div className="pointer-events-none absolute right-0 top-0 -z-10 h-32 w-32 bg-white/[0.06] blur-3xl" />
            <h3 className="mb-3 text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)]">{contact.formTitle || 'Tell me about the work'}</h3>
            <p className="mb-8 max-w-lg text-sm leading-6 text-zinc-500">A few practical details help shape a useful first conversation. There is no need to have every answer yet.</p>

            <form onSubmit={handleSubmit} className="space-y-6" aria-describedby={status.msg ? 'contact-status' : undefined}>
              <div className="grid min-w-0 gap-6 md:grid-cols-2">
                <div className="min-w-0 space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Name</label>
                  <input required type="text" autoComplete="name" placeholder={placeholders.name || 'Your name'} {...fieldProps('name')} />
                </div>
                <div className="min-w-0 space-y-2">
                  <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Email</label>
                  <input required type="email" autoComplete="email" placeholder={placeholders.email || 'Your email'} {...fieldProps('email')} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Subject</label>
                <input required type="text" placeholder={placeholders.subject || 'Brief project subject'} {...fieldProps('subject')} />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Project context</label>
                <textarea required rows="5" placeholder={placeholders.message || 'What are you hoping to build? Goals, scope, timeline, or budget context are welcome.'} {...fieldProps('message')} className={`${fieldProps('message').className} resize-none`} />
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase tracking-[0.3em] text-[11px] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${loading ? 'cursor-not-allowed bg-zinc-700 text-zinc-400' : 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)] hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none'}`}
              >
                {loading ? 'Sending...' : (contact.submitLabel || 'Send message')}
                {!loading && <Send aria-hidden="true" className="h-4 w-4" />}
              </button>

              <AnimatePresence>
                {status.msg && (
                  <motion.div
                    id="contact-status"
                    role={status.type === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    className={`flex items-center justify-center gap-2 rounded-xl p-4 text-center text-xs font-bold leading-5 ${status.type === 'success' ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-300'}`}
                  >
                    {status.type === 'success' && <CheckCircle aria-hidden="true" className="h-4 w-4 shrink-0" />}
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
