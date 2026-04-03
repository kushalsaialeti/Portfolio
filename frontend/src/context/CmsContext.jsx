import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CmsContext = createContext();

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CmsProvider = ({ children }) => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));

  // 0. Global Auth Setup & Axios Interceptor
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          localStorage.setItem('admin_token', token);
          // Verify with server
          await axios.get(`${API_ROOT}/auth/check`);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Session Validation Failed. Clearing.");
          setToken(null);
          setIsAuthenticated(false);
          localStorage.removeItem('admin_token');
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      }
      setLoading(false); // Signal that we've checked the token
    };

    validateToken();
  }, [token]);

  // Auth Error Handler (Auto-Logout on 401/403)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          setToken(null);
          // Only redirect if we were on an admin page
          if (window.location.pathname.startsWith('/admin')) {
             window.location.href = '/admin-login';
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

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

  // Removed redundant hydration effect to favor token validation timing

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

  // 5. Auth Actions (OTP Flow)
  const requestOtp = async (email) => {
    try {
      const response = await axios.post(`${API_ROOT}/auth/request-otp`, { email });
      return response.data;
    } catch (error) {
      console.error('OTP Request Error:', error);
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(`${API_ROOT}/auth/verify-otp`, { email, otp });
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      console.error('OTP Verification Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_ROOT}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      localStorage.removeItem('admin_token');
    }
  };

  return (
    <CmsContext.Provider value={{ 
      sections, 
      loading, 
      isAuthenticated,
      fetchSection, 
      updateSection, 
      uploadMedia, 
      replaceMedia,
      requestOtp,
      verifyOtp,
      logout
    }}>
      {children}
    </CmsContext.Provider>
  );
};
