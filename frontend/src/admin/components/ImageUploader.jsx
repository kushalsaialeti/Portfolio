import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Link2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImageUploader({
  label = 'Image',
  sublabel = 'PNG, JPG, WEBP, or SVG',
  value = '', // URL string or object { url, public_id }
  onChange,
  onUpload, // async (file) => { url, public_id }
  aspectRatio = 'square', // 'square', 'video', 'portrait', 'auto'
  className = '',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const currentUrl = typeof value === 'object' && value !== null ? value.url : value;

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    setErrorMsg('');
    setIsUploading(true);
    try {
      if (onUpload) {
        const result = await onUpload(file);
        if (onChange) onChange(result);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    if (onChange) {
      onChange(typeof value === 'object' && value !== null ? { ...value, url: manualUrl.trim() } : manualUrl.trim());
    }
    setShowUrlInput(false);
    setManualUrl('');
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange(typeof value === 'object' && value !== null ? { url: '', public_id: '' } : '');
    }
    setErrorMsg('');
  };

  const aspectClass = {
    square: 'aspect-square max-w-[200px]',
    portrait: 'aspect-[4/5] max-w-[220px]',
    video: 'aspect-video max-w-[320px]',
    auto: 'min-h-[160px] max-w-full',
  }[aspectRatio] || 'min-h-[160px]';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-white/80">
            {label}
          </label>
          {sublabel && (
            <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">
              {sublabel}
            </span>
          )}
        </div>
      )}

      {currentUrl ? (
        /* IMAGE PREVIEW CARD */
        <div className={`relative group rounded-2xl overflow-hidden border border-white/15 bg-black/40 ${aspectClass}`}>
          <img
            src={currentUrl}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* OVERLAY ACTIONS */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-[#27c93f] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 font-bold text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          {/* UPLOADING SPINNER OVERLAY */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 z-10">
              <RefreshCw className="w-8 h-8 text-[#27c93f] animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Uploading...</span>
            </div>
          )}
        </div>
      ) : (
        /* DROPZONE / UPLOAD PROMPT */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer ${
            isDragOver
              ? 'border-[#27c93f] bg-[#27c93f]/10'
              : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <RefreshCw className="w-8 h-8 text-[#27c93f] animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider text-white">Uploading image to cloud...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#27c93f] shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Drag & Drop or <span className="text-[#27c93f] underline">Browse</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1 font-medium">Supports JPG, PNG, WEBP, SVG</p>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  <Link2 className="w-3 h-3" />
                  <span>{showUrlInput ? 'Hide URL input' : 'Or paste URL'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MANUAL URL INPUT */}
      {showUrlInput && !currentUrl && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2 pt-1">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#191A23] border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-[#27c93f] outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#27c93f] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Set
          </button>
        </form>
      )}

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <p className="text-[11px] font-bold text-red-400 mt-1 flex items-center gap-1">
          <span>⚠️</span> {errorMsg}
        </p>
      )}

      {/* HIDDEN FILE INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
