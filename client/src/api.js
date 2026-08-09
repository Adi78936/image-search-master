// Default to production backend if VITE_API_BASE is not explicitly configured
const rawBase =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://image-search-master.onrender.com');

export const API_BASE = rawBase ? rawBase.replace(/\/$/, '') : '';

const resolveUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

export const withCreds = (path, options = {}) => {
  const { timeout = 5000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  return fetch(resolveUrl(path), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(fetchOptions.headers || {}) },
    signal: controller.signal,
    ...fetchOptions,
  }).finally(() => clearTimeout(timer));
};

export const authUrl = (provider) => resolveUrl(`/auth/${provider}`);
