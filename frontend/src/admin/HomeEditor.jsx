import React, { useContext, useState, useEffect } from 'react';
import { CmsContext } from '../context/CmsContext';
import { Save, RefreshCw, User, Image as ImageIcon, MapPin, Plus, Trash2, Tag, Link2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './components/ImageUploader';

export default function HomeEditor() {
  const { sections, fetchSection, updateSection, uploadMedia, replaceMedia } = useContext(CmsContext);
  const [localData, setLocalData] = useState({
    profile: {
      name: '',
      tagline: '',
      subtitle: '',
      email: '',
      phone: '',
      github: '',
      linkedin: '',
      instagram: '',
      resume: '',
      stackLabels: ['MERN', 'REACT NATIVE', 'VIBE CODING'],
      statusWords: ['WORK', 'COLLABORATE'],
      portrait: { url: '', public_id: '' },
      location: { title: 'Current Location', text: '', description: '', query: '' },
    },
    gallery: [],
  });

  const [newStackTag, setNewStackTag] = useState('');
  const [newStatusWord, setNewStatusWord] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSection('home');
  }, []);

  useEffect(() => {
    if (sections.home) {
      setLocalData({
        profile: {
          name: sections.home.profile?.name || '',
          tagline: sections.home.profile?.tagline || '',
          subtitle: sections.home.profile?.subtitle || '',
          email: sections.home.profile?.email || '',
          phone: sections.home.profile?.phone || '',
          github: sections.home.profile?.github || '',
          linkedin: sections.home.profile?.linkedin || '',
          instagram: sections.home.profile?.instagram || '',
          resume: sections.home.profile?.resume || '',
          stackLabels: sections.home.profile?.stackLabels || ['MERN', 'REACT NATIVE', 'VIBE CODING'],
          statusWords: sections.home.profile?.statusWords || ['WORK', 'COLLABORATE'],
          portrait: sections.home.profile?.portrait || { url: '', public_id: '' },
          location: sections.home.profile?.location || { title: 'Current Location', text: '', description: '', query: '' },
        },
        gallery: sections.home.gallery || [],
      });
    }
  }, [sections.home]);

  const handleProfileChange = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleLocationChange = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        location: {
          ...prev.profile.location,
          [field]: value,
        },
      },
    }));
  };

  const handlePortraitUpload = async (file) => {
    const oldPublicId = localData.profile.portrait?.public_id;
    if (oldPublicId) {
      return await replaceMedia(file, oldPublicId);
    }
    return await uploadMedia(file);
  };

  const handleAddGalleryImage = async (file) => {
    const result = await uploadMedia(file);
    setLocalData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), { url: result.url, public_id: result.public_id }],
    }));
    return result;
  };

  const handleRemoveGalleryImage = (index) => {
    setLocalData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleAddStackTag = (e) => {
    e.preventDefault();
    if (!newStackTag.trim()) return;
    const tag = newStackTag.trim().toUpperCase();
    if (!localData.profile.stackLabels?.includes(tag)) {
      handleProfileChange('stackLabels', [...(localData.profile.stackLabels || []), tag]);
    }
    setNewStackTag('');
  };

  const handleRemoveStackTag = (tagToRemove) => {
    handleProfileChange(
      'stackLabels',
      (localData.profile.stackLabels || []).filter((tag) => tag !== tagToRemove)
    );
  };

  const handleAddStatusWord = (e) => {
    e.preventDefault();
    if (!newStatusWord.trim()) return;
    const word = newStatusWord.trim().toUpperCase();
    if (!localData.profile.statusWords?.includes(word)) {
      handleProfileChange('statusWords', [...(localData.profile.statusWords || []), word]);
    }
    setNewStatusWord('');
  };

  const handleRemoveStatusWord = (wordToRemove) => {
    handleProfileChange(
      'statusWords',
      (localData.profile.statusWords || []).filter((w) => w !== wordToRemove)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      await updateSection('home', localData);
      setSaveMessage({ type: 'success', text: 'Hero & profile configuration saved successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to save changes. Please check console/network.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <User className="w-7 h-7 text-[#27c93f]" />
            Hero & Identity Editor
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Manage your headline, portrait, animated status words, location, and social links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="self-start sm:self-auto px-6 py-3 rounded-xl bg-[#27c93f] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(39,201,63,0.3)] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {saveMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-[#27c93f]/15 border border-[#27c93f]/40 text-[#27c93f]'
              : 'bg-red-500/15 border border-red-500/40 text-red-400'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* SECTION 1: CORE IDENTITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#27c93f] flex items-center gap-2">
          <span>01.</span> Core Profile Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Full Name</label>
            <input
              type="text"
              value={localData.profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              placeholder="e.g. Kushal Sai Aleti"
              className="w-full px-4 py-3 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Tagline / Headline</label>
            <input
              type="text"
              value={localData.profile.tagline}
              onChange={(e) => handleProfileChange('tagline', e.target.value)}
              placeholder="e.g. MERN developer building crisp web experiences."
              className="w-full px-4 py-3 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-sm focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/70">Subtitle / Bio Teaser</label>
          <textarea
            rows={2}
            value={localData.profile.subtitle}
            onChange={(e) => handleProfileChange('subtitle', e.target.value)}
            placeholder="e.g. React, Node.js, product-focused UI/UX, AI-assisted workflows."
            className="w-full px-4 py-3 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-sm focus:border-[#27c93f] outline-none resize-none"
          />
        </div>
      </div>

      {/* SECTION 2: PORTRAIT & CAROUSEL IMAGES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#27c93f] flex items-center gap-2">
          <span>02.</span> Portrait & Carousel Media
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Portrait */}
          <div className="space-y-3">
            <ImageUploader
              label="Primary Portrait Image"
              sublabel="Hero face & avatar across the site"
              value={localData.profile.portrait}
              onChange={(val) => handleProfileChange('portrait', typeof val === 'object' ? val : { url: val, public_id: '' })}
              onUpload={handlePortraitUpload}
              aspectRatio="portrait"
            />
          </div>

          {/* Gallery Carousel Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                Rotating Hero Gallery ({localData.gallery?.length || 0} images)
              </label>
            </div>

            {/* Thumbnails List */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {localData.gallery?.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-square">
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image to Gallery */}
            <div className="pt-2">
              <ImageUploader
                label="Add Image to Hero Gallery"
                sublabel="Upload an additional image for the auto-rotating carousel"
                value=""
                onChange={() => {}}
                onUpload={handleAddGalleryImage}
                aspectRatio="square"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ANIMATED STATUS WORDS & STACK LABELS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#27c93f] flex items-center gap-2">
          <span>03.</span> Interactive Pills & Typing Words
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Typing Words */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                "Open To" Typing Words
              </label>
              <p className="text-[11px] text-white/50 mt-0.5">
                Words that cycle in the hero box ("OPEN TO WORK", "OPEN TO COLLABORATE", etc.)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-xl bg-[#1c1d27] border border-white/10">
              {localData.profile.statusWords?.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#27c93f]/15 border border-[#27c93f]/30 text-[#27c93f] text-xs font-bold uppercase tracking-wider"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => handleRemoveStatusWord(word)}
                    className="hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddStatusWord} className="flex gap-2">
              <input
                type="text"
                value={newStatusWord}
                onChange={(e) => setNewStatusWord(e.target.value)}
                placeholder="e.g. FULL-TIME"
                className="flex-1 px-4 py-2 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs uppercase tracking-wider focus:border-[#27c93f] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#27c93f] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>

          {/* Hero Stack Badges */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                Hero Stack Badges
              </label>
              <p className="text-[11px] text-white/50 mt-0.5">
                Buttons displayed right below your hero name (e.g. "MERN", "REACT NATIVE")
              </p>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-xl bg-[#1c1d27] border border-white/10">
              {localData.profile.stackLabels?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveStackTag(tag)}
                    className="hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddStackTag} className="flex gap-2">
              <input
                type="text"
                value={newStackTag}
                onChange={(e) => setNewStackTag(e.target.value)}
                placeholder="e.g. NEXT.JS"
                className="flex-1 px-4 py-2 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs uppercase tracking-wider focus:border-[#27c93f] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#27c93f] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 4: LOCATION & CONTACT / SOCIAL LINKS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14151e] border border-white/10 space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#27c93f] flex items-center gap-2">
          <span>04.</span> Location & Social Links
        </h3>

        {/* Location Subcard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Location Card Title</label>
            <input
              type="text"
              value={localData.profile.location?.title || ''}
              onChange={(e) => handleLocationChange('title', e.target.value)}
              placeholder="e.g. Current Location"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Location Display Text</label>
            <input
              type="text"
              value={localData.profile.location?.text || ''}
              onChange={(e) => handleLocationChange('text', e.target.value)}
              placeholder="e.g. Bhimavaram, SRKR campus"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Google Maps Search Query</label>
            <input
              type="text"
              value={localData.profile.location?.query || ''}
              onChange={(e) => handleLocationChange('query', e.target.value)}
              placeholder="e.g. SRKR Engineering College, Bhimavaram"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Resume Link (URL / PDF)</label>
            <input
              type="url"
              value={localData.profile.resume || ''}
              onChange={(e) => handleProfileChange('resume', e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Email Address</label>
            <input
              type="email"
              value={localData.profile.email || ''}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              placeholder="your-email@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Phone Number</label>
            <input
              type="text"
              value={localData.profile.phone || ''}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">GitHub Profile URL</label>
            <input
              type="url"
              value={localData.profile.github || ''}
              onChange={(e) => handleProfileChange('github', e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">LinkedIn Profile URL</label>
            <input
              type="url"
              value={localData.profile.linkedin || ''}
              onChange={(e) => handleProfileChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">Instagram Profile URL</label>
            <input
              type="url"
              value={localData.profile.instagram || ''}
              onChange={(e) => handleProfileChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1d27] border border-white/10 text-white text-xs focus:border-[#27c93f] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
