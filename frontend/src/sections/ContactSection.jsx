import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Instagram, FileText, ExternalLink, Send, CheckCircle } from 'lucide-react';
import SectionShell from '../components/SectionShell';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ContactCard({ label, value, href, icon: Icon }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      whileHover={{ scale: 1.02, y: -4, borderColor: 'var(--accent)' }}
      className="group flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--cards)] p-5 backdrop-blur-xl shadow-[var(--shadow-sm)] transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]/50">{label}</p>
          <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">{value}</p>
        </div>
      </div>
      <ExternalLink className="h-3 w-3 text-[var(--text-secondary)]/20" />
    </motion.a>
  );
}

export default function ContactSection({ section, content }) {
  const profile = content?.siteProfile;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const contactCards = [
    { label: 'Direct Email', value: profile?.email || 'Loading...', icon: Mail, href: `mailto:${profile?.email}` },
    { label: 'Network', value: 'LinkedIn', icon: Linkedin, href: profile?.linkedin },
    { label: 'GitHub', value: 'Source Code', icon: Github, href: profile?.github },
    { label: 'Phone', value: profile?.phone || 'Loading...', icon: Phone, href: `tel:${profile?.phone?.replace(/\s+/g, '')}` }
  ].filter(c => c.href);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await axios.post(`${API_URL}/contact`, formData);
      setStatus({ type: 'success', msg: 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionShell id={section?.id} eyebrow={section?.eyebrow} title={section?.title}>
      <div className="flex flex-col lg:flex-row gap-16 mt-10">
        
        {/* LEFT SIDE: Contact Info */}
        <div className="lg:w-2/5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-widest text-[var(--text-primary)]">Contact Info</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed max-w-sm">
               Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
          </div>

          <div className="grid gap-4">
            {contactCards.map((card) => (
              <ContactCard key={card.label} {...card} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {profile?.resume && (
              <motion.a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--text-primary)] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--bg-base)] shadow-xl shadow-[var(--bg-base)]/5 transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>Download CV</span>
              </motion.a>
            )}
            
            {profile?.instagram && (
              <motion.a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-3 rounded-2xl border border-[var(--border)] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] backdrop-blur-md transition-all"
              >
                <Instagram className="h-4 w-4 text-[var(--accent)]" />
                <span>Instagram Feed</span>
              </motion.a>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Contact Form */}
        <div className="lg:w-3/5">
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="p-8 md:p-10 rounded-[40px] border border-[var(--border)] bg-[var(--cards)] shadow-[var(--shadow-lg)] relative overflow-hidden group"
           >
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl -z-10 group-hover:bg-[var(--accent)]/10 transition-all duration-700" />
              
              <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)] mb-8">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Brief Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-secondary)]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Message</label>
                  <textarea 
                    rows="4" 
                    placeholder="Tell me more about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all resize-none placeholder:text-[var(--text-secondary)]/30"
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className={`w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase tracking-[0.3em] text-[11px] transition-all
                    ${loading ? 'bg-[var(--text-secondary)]/50 cursor-not-allowed' : 'bg-[var(--accent)] text-[var(--bg-base)] shadow-[0_10px_30px_var(--accent)]/30 hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {loading ? 'Sending...' : 'Dispatch Message'}
                  {!loading && <Send className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {status.msg && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center gap-2 p-4 rounded-xl text-center justify-center text-xs font-bold leading-none ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {status.type === 'success' && <CheckCircle className="w-4 h-4" />}
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
