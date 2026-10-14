import { useCallback, useEffect, useRef, useState } from 'react';
import api from './api';
import { CmsContext } from './CmsContext';

const CACHE_TTL = 60 * 1000;

export function CmsProvider({ children }) {
  const [sections, setSections] = useState({});
  const [error, setError] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pending = useRef(new Map());
  const cache = useRef(new Map());

  const clearSession = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('cache:admin_token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (failure) => {
        if (failure.response?.status === 401) clearSession();
        return Promise.reject(failure);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [clearSession]);

  useEffect(() => {
    let active = true;
    async function validateSession() {
      setLoading(true);
      try {
        if (token) {
          await api.get('/auth/check');
          if (active) setIsAuthenticated(true);
        }
      } catch {
        if (active) setIsAuthenticated(false);
      } finally {
        if (active) setLoading(false);
      }
    }
    validateSession();
    return () => { active = false; };
  }, [token]);

  const fetchSection = useCallback(async (slug, refresh = false) => {
    const cached = cache.current.get(slug);
    // Launch visibility is always checked against the server.
    if (!refresh && slug !== 'polishing' && cached?.expiry > Date.now()) {
      setSections((previous) => ({ ...previous, [slug]: cached.data.content }));
      return cached.data;
    }
    if (pending.current.has(slug)) return pending.current.get(slug);
    const request = api.get(`/sections/${slug}`)
      .then(({ data }) => {
        cache.current.set(slug, { data, expiry: Date.now() + CACHE_TTL });
        setSections((previous) => ({ ...previous, [slug]: data.content || {} }));
        setError('');
        return data;
      })
      .catch(() => {
        setError(`Unable to load ${slug}. Check the API connection and retry.`);
        return null;
      })
      .finally(() => pending.current.delete(slug));
    pending.current.set(slug, request);
    return request;
  }, []);

  async function updateSection(slug, content) {
    const { data } = await api.put(`/sections/${slug}`, { content });
    cache.current.delete(slug);
    setSections((previous) => ({ ...previous, [slug]: data.content }));
    return data;
  }

  async function seedBaseline() {
    const { data } = await api.post('/sections/seed-baseline');
    cache.current.clear();
    const slugs = data.sections.map((section) => section.slug);
    await Promise.all(slugs.map((slug) => fetchSection(slug, true)));
    return data;
  }

  async function saveBaseline() {
    const { data } = await api.post('/sections/save-baseline');
    return data;
  }

  async function uploadMedia(file) {
    const body = new FormData();
    body.append('image', file);
    const { data } = await api.post('/sections/upload', body, { timeout: 30000 });
    return data;
  }

  // Upload first. Old media stays available until the section is saved successfully.
  async function replaceMedia(file, oldPublicId) {
    const body = new FormData();
    body.append('image', file);
    if (oldPublicId) body.append('old_public_id', oldPublicId);
    const { data } = await api.put('/sections/replace', body, { timeout: 30000 });
    return data;
  }

  async function requestOtp(email) {
    const { data } = await api.post('/auth/request-otp', { email }, { timeout: 20000 });
    return data;
  }

  async function verifyOtp(email, otp) {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('admin_token', data.token);
    setToken(data.token);
    setIsAuthenticated(true);
    return data;
  }

  async function logout() {
    try {
      if (token) await api.post('/auth/logout');
    } finally {
      clearSession();
      cache.current.clear();
    }
  }

  return (
    <CmsContext.Provider value={{
      sections, error, loading, isAuthenticated, fetchSection, updateSection,
      seedBaseline, saveBaseline, uploadMedia, replaceMedia, requestOtp, verifyOtp, logout,
    }}>
      {children}
    </CmsContext.Provider>
  );
}
