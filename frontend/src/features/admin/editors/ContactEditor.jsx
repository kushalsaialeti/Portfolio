import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../../../cms/CmsContext';
import { Save, RefreshCw, Mail, Phone, MapPin, Send, AlertCircle, MessageSquare } from 'lucide-react';
import { useEditorDirty } from '../useEditorForm';

export default function ContactEditor() {
  const { sections, fetchSection, updateSection } = useContext(CmsContext);
  const [contactData, setContactData] = useState({
    introTitle: 'Contact Info',
    introText: "Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    formTitle: 'Send a Message',
    submitLabel: 'Send Message',
    successMessage: 'Message sent successfully!',
    errorMessage: 'Failed to send message. Please try again.',
    placeholders: {
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Brief Subject',
      message: 'Tell me more about your project...',
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isDirty, setIsDirty] = useState(false);
  useEditorDirty(isDirty, isSaving);

  useEffect(() => {
    fetchSection('contact');
  }, [fetchSection]);

  useEffect(() => {
    if (sections.contact) {
      setContactData({
        introTitle: sections.contact.introTitle || 'Contact Info',
        introText: sections.contact.introText || '',
        formTitle: sections.contact.formTitle || 'Send a Message',
        submitLabel: sections.contact.submitLabel || 'Send Message',
        successMessage: sections.contact.successMessage || 'Message sent successfully!',
        errorMessage: sections.contact.errorMessage || 'Failed to send message. Please try again.',
        placeholders: {
          name: sections.contact.placeholders?.name || 'Your Name',
          email: sections.contact.placeholders?.email || 'Your Email',
          subject: sections.contact.placeholders?.subject || 'Brief Subject',
          message: sections.contact.placeholders?.message || 'Tell me more about your project...',
        },
      });
      setIsDirty(false);
    }
  }, [sections.contact]);

  const handleChange = (field, value) => {
    setIsDirty(true);
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceholderChange = (field, value) => {
    setIsDirty(true);
    setContactData((prev) => ({
      ...prev,
      placeholders: {
        ...prev.placeholders,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('contact', {
        ...sections.contact,
        ...contactData,
        placeholders: {
          ...(sections.contact?.placeholders || {}),
          ...contactData.placeholders,
        },
      });
      setIsDirty(false);
      setSaveMessage({ type: 'success', text: 'Contact configuration saved successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to save contact settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Mail className="w-7 h-7 text-[#27c93f]" />
            Contact Section Settings
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Configure contact card descriptions, form input placeholders, and automated feedback messages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-[#27c93f] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(39,201,63,0.3)] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save</span>
        </button>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {saveMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'cms-success-message'
              : 'bg-red-500/15 border border-red-500/40 text-red-400'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* SECTION 1: INTRO TEXT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#27c93f] flex items-center gap-2">
          <span>01.</span> Contact Card Intro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Card Heading</label>
            <input
              type="text"
              value={contactData.introTitle}
              onChange={(e) => handleChange('introTitle', e.target.value)}
              placeholder="e.g. Contact Info"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Form Title</label>
            <input
              type="text"
              value={contactData.formTitle}
              onChange={(e) => handleChange('formTitle', e.target.value)}
              placeholder="e.g. Send a Message"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-white/70">Intro Description</label>
          <textarea
            rows={2}
            value={contactData.introText}
            onChange={(e) => handleChange('introText', e.target.value)}
            placeholder="Whether you have a question or just want to say hi..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* SECTION 2: FORM PLACEHOLDERS & FEEDBACK */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#27c93f] flex items-center gap-2">
          <span>02.</span> Form Placeholders & Status Messages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Name Field Placeholder</label>
            <input
              type="text"
              value={contactData.placeholders.name}
              onChange={(e) => handlePlaceholderChange('name', e.target.value)}
              placeholder="e.g. Your Name"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Email Field Placeholder</label>
            <input
              type="text"
              value={contactData.placeholders.email}
              onChange={(e) => handlePlaceholderChange('email', e.target.value)}
              placeholder="e.g. Your Email"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Subject Field Placeholder</label>
            <input
              type="text"
              value={contactData.placeholders.subject}
              onChange={(e) => handlePlaceholderChange('subject', e.target.value)}
              placeholder="e.g. Brief Subject"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Submit Button Text</label>
            <input
              type="text"
              value={contactData.submitLabel}
              onChange={(e) => handleChange('submitLabel', e.target.value)}
              placeholder="e.g. Send Message"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-white/70">Message Area Placeholder</label>
          <input
            type="text"
            value={contactData.placeholders.message}
            onChange={(e) => handlePlaceholderChange('message', e.target.value)}
            placeholder="e.g. Tell me more about your project..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#27c93f]">Success Message</label>
            <input
              type="text"
              value={contactData.successMessage}
              onChange={(e) => handleChange('successMessage', e.target.value)}
              placeholder="Message sent successfully!"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-[#27c93f]/30 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-red-400">Error Message</label>
            <input
              type="text"
              value={contactData.errorMessage}
              onChange={(e) => handleChange('errorMessage', e.target.value)}
              placeholder="Failed to send message. Please try again."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-red-500/30 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
