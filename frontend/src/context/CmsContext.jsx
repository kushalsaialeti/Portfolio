import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CmsContext = createContext();

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CmsProvider = ({ children }) => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch Section by Slug
  const fetchSection = async (slug) => {
    try {
      const response = await axios.get(`${API_ROOT}/sections/${slug}`);
      setSections(prev => ({
        ...prev,
        [slug]: response.data.content || {}
      }));
    } catch (error) {
      console.error(`Error fetching section ${slug}:`, error);
    }
  };

  // 1.5 Hydration effect to signal end of loading
  useEffect(() => {
    const init = async () => {
      // Just a brief heartbeat to ensure context is alive
      setLoading(false);
    };
    init();
  }, []);

  // 2. Commit Section Content
  const updateSection = async (slug, content) => {
    try {
      const response = await axios.put(`${API_ROOT}/sections/${slug}`, { content });
      setSections(prev => ({
        ...prev,
        [slug]: response.data.content
      }));
      return response.data;
    } catch (error) {
      console.error(`Error updating section ${slug}:`, error);
      throw error;
    }
  };

  // 3. Upload Media (To Cloudinary via Backend)
  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`${API_ROOT}/sections/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data; // { url, public_id }
    } catch (error) {
       console.error('Error uploading media:', error);
       throw error;
    }
  };

  // 4. Replace Media (Cleanup old + Upload new)
  const replaceMedia = async (file, oldPublicId) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('old_public_id', oldPublicId);
    try {
      const response = await axios.put(`${API_ROOT}/sections/replace`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data; // { url, public_id }
    } catch (error) {
      console.error('Error replacing media:', error);
      throw error;
    }
  };

  // 5. Inject Baseline Static Data (Migration Utility)
  const injectBaseline = async (staticData) => {
    try {
      const promises = Object.entries(staticData).map(([slug, content]) => 
        updateSection(slug, content)
      );
      await Promise.all(promises);
      alert('Legacy data migration successful. All sections are now dynamic.');
    } catch (error) {
      console.error('Error injecting baseline:', error);
      alert('Migration failed.');
    }
  };

  return (
    <CmsContext.Provider value={{ 
      sections, 
      loading, 
      fetchSection, 
      updateSection, 
      uploadMedia, 
      replaceMedia,
      injectBaseline
    }}>
      {children}
    </CmsContext.Provider>
  );
};
