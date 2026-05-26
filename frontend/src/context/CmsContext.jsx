import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const CmsContext = createContext();

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// OPTIMIZATION: Cache TTL in milliseconds
const CACHE_TTL = {
  SECTIONS: 24 * 60 * 60 * 1000, // 24 hours
  AUTH: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// OPTIMIZATION: Local storage cache helpers
const cacheService = {
  get: (key) => {
    try {
      const cached = localStorage.getItem(`cache:${key}`);
      if (!cached) return null;
      const { data, expiry } = JSON.parse(cached);
      if (Date.now() > expiry) {
        localStorage.removeItem(`cache:${key}`);
        return null;
      }
      console.log(`💾 Local Cache HIT: ${key}`);
      return data;
    } catch (err) {
      console.warn(`Cache read error for ${key}:`, err.message);
      return null;
    }
  },
  set: (key, data, ttl) => {
    try {
      localStorage.setItem(`cache:${key}`, JSON.stringify({
        data,
        expiry: Date.now() + ttl,
      }));
      console.log(`💾 Local Cache SAVED: ${key}`);
    } catch (err) {
      console.warn(`Cache write error for ${key}:`, err.message);
    }
  },
  clear: (key) => {
    try {
      localStorage.removeItem(`cache:${key}`);
    } catch (err) {
      console.warn(`Cache clear error for ${key}:`, err.message);
    }
  },
};

export const CmsProvider = ({ children }) => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  
  // OPTIMIZATION: Track pending requests to prevent duplicates
  const requestCache = useRef(new Map());

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
      setLoading(false);
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
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin-login';
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // OPTIMIZATION: Deduplicated fetch with caching
  const fetchSection = async (slug, skipCache = false) => {
    const cacheKey = `section:${slug}`;
    
    // OPTIMIZATION: Check local storage cache first
    if (!skipCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        setSections(prev => ({
          ...prev,
          [slug]: cached.content || {}
        }));
        return cached;
      }
    }

    // OPTIMIZATION: Prevent duplicate requests for the same slug
    if (requestCache.current.has(cacheKey)) {
      return requestCache.current.get(cacheKey);
    }

    const promise = (async () => {
      try {
        const response = await axios.get(`${API_ROOT}/sections/${slug}`, {
          timeout: 5000,
        });
        const data = response.data;
        
        // Cache the response
        cacheService.set(cacheKey, data, CACHE_TTL.SECTIONS);
        
        setSections(prev => ({
          ...prev,
          [slug]: data.content || {}
        }));
        
        return data;
      } catch (error) {
        console.error(`Error fetching section ${slug}:`, error);
        throw error;
      } finally {
        requestCache.current.delete(cacheKey);
      }
    })();

    requestCache.current.set(cacheKey, promise);
    return promise;
  };

  // 2. Commit Section Content
  const updateSection = async (slug, content) => {
    try {
      const response = await axios.put(`${API_ROOT}/sections/${slug}`, { content }, {
        timeout: 10000,
      });
      setSections(prev => ({
        ...prev,
        [slug]: response.data.content
      }));
      // OPTIMIZATION: Invalidate cache on update
      cacheService.clear(`section:${slug}`);
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
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      return response.data;
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
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error('Error replacing media:', error);
      throw error;
    }
  };

  // 5. Auth Actions (OTP Flow)
  const requestOtp = async (email) => {
    try {
      const response = await axios.post(`${API_ROOT}/auth/request-otp`, { email }, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error('OTP Request Error:', error);
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(`${API_ROOT}/auth/verify-otp`, { email, otp }, {
        timeout: 5000,
      });
      setToken(response.data.token);
      cacheService.set('admin_token', response.data.token, CACHE_TTL.AUTH);
      return response.data;
    } catch (error) {
      console.error('OTP Verification Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_ROOT}/auth/logout`, {}, {
          timeout: 5000,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      localStorage.removeItem('admin_token');
      requestCache.current.clear();
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
