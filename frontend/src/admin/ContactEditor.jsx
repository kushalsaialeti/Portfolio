import React, { useContext, useEffect, useState } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, Mail, Phone, Github, Linkedin, Instagram, FileText, MapPin, MessageSquare } from 'lucide-react';

const CONTACT_DRAFT = {
  introTitle: '',
  introText: '',
  formTitle: '',
  submitLabel: '',
  successMessage: '',
  errorMessage: '',
  placeholders: {
    name: '',
    email: '',
    subject: '',
    message: '',
  },
};

const PROFILE_DRAFT = {
  name: '',
  tagline: '',
  subtitle: '',
  email: '',
  phone: '',
  github: '',
  linkedin: '',
  instagram: '',
  resume: '',
  location: {
    title: '',
    text: '',
    description: '',
    query: '',
  },
};

const profileFields = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'github', label: 'GitHub URL', icon: Github },
  { key: 'linkedin', label: 'LinkedIn URL', icon: Linkedin },
  { key: 'instagram', label: 'Instagram URL', icon: Instagram },
  { key: 'resume', label: 'Resume URL', icon: FileText },
];

const placeholderFields = [
  { key: 'name', label: 'Name Placeholder' },
  { key: 'email', label: 'Email Placeholder' },
  { key: 'subject', label: 'Subject Placeholder' },
  { key: 'message', label: 'Message Placeholder' },
];

export default function ContactEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [contactContent, setContactContent] = useState(CONTACT_DRAFT);
  const [profile, setProfile] = useState(PROFILE_DRAFT);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSection('contact');
    fetchSection('home');
  }, []);

  useEffect(() => {
    setContactContent({
      ...CONTACT_DRAFT,
      ...(sections.contact || {}),
      placeholders: {
        ...CONTACT_DRAFT.placeholders,
        ...(sections.contact?.placeholders || {}),
      },
    });
  }, [sections.contact]);

  useEffect(() => {
    if (sections.home?.profile) {
      setProfile({
        ...PROFILE_DRAFT,
        ...sections.home.profile,
        location: {
          ...PROFILE_DRAFT.location,
          ...(sections.home.profile.location || {}),
        },
      });
    }
  }, [sections.home]);

  const handleContactChange = (field, value) => {
    setContactContent((current) => ({ ...current, [field]: value }));
  };

  const handlePlaceholderChange = (field, value) => {
    setContactContent((current) => ({
      ...current,
      placeholders: {
        ...(current.placeholders || {}),
        [field]: value,
      },
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      location: {
        ...(current.location || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateSection('contact', contactContent),
        updateSection('home', {
          ...(sections.home || {}),
          profile,
        }),
      ]);
      alert('Contact content committed.');
    } catch (error) {
      alert('Contact save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Contact Architect</h2>
          <p className="text-[#A1A1A6] text-sm mt-1 uppercase tracking-widest font-medium">Control public contact details and form copy</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-[#27c93f] text-black border border-[#27c93f] flex items-center gap-2 hover:brightness-110 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Form Content</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Intro Title</label>
              <input
                value={contactContent.introTitle || ''}
                onChange={(e) => handleContactChange('introTitle', e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Form Title</label>
              <input
                value={contactContent.formTitle || ''}
                onChange={(e) => handleContactChange('formTitle', e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Intro Text</label>
            <textarea
              value={contactContent.introText || ''}
              rows={3}
              onChange={(e) => handleContactChange('introText', e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Submit Button</label>
              <input
                value={contactContent.submitLabel || ''}
                onChange={(e) => handleContactChange('submitLabel', e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Success Message</label>
              <input
                value={contactContent.successMessage || ''}
                onChange={(e) => handleContactChange('successMessage', e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">Error Message</label>
            <input
              value={contactContent.errorMessage || ''}
              onChange={(e) => handleContactChange('errorMessage', e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
            />
          </div>
        </div>

        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Contact Channels</h3>
          </div>

          <div className="grid gap-4">
            {profileFields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </label>
                <input
                  value={profile[key] || ''}
                  onChange={(e) => handleProfileChange(key, e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Location</h3>
          </div>

          {['title', 'text', 'description', 'query'].map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">{field}</label>
              <input
                value={profile.location?.[field] || ''}
                onChange={(e) => handleLocationChange(field, e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#27c93f]" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#27c93f]">Placeholders</h3>
          </div>

          {placeholderFields.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest pl-1">{label}</label>
              <input
                value={contactContent.placeholders?.[key] || ''}
                onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/5 text-white transition-all focus:border-[#27c93f]/40 outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
