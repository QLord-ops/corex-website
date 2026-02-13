const getApiUrl = () => {
  // Check for environment variable first (production/build)
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, '');
  }
  // Fallback to localhost for development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  // Empty string for production without env var (will use relative URLs)
  return '';
};

const api = (path, options = {}) => {
  const base = getApiUrl();
  const url = path.startsWith('http') ? path : `${base}/api${path.startsWith('/') ? path : `/${path}`}`;
  
  return fetch(url, { 
    ...options, 
    headers: { 
      'Content-Type': 'application/json', 
      ...options.headers 
    } 
  }).catch((error) => {
    // Better error handling for network issues
    console.error('API request failed:', { url, error });
    throw new Error(`Network error: ${error.message || 'Failed to connect to backend'}`);
  });
};

export const apiGet = (path) => api(path).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))));
export const apiPost = (path, body) =>
  api(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }).then((r) =>
    r.status === 204 ? null : r.ok ? r.json() : Promise.reject(new Error(r.statusText))
  );

/** Returns { status, data } so callers can handle 503 etc. without throwing. */
export const apiPostWithResponse = (path, body) =>
  api(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }).then(async (r) => {
    const data = r.status === 204 ? null : await r.json().catch(() => ({}));
    return { status: r.status, ok: r.ok, data };
  });
export const apiPut = (path, body) =>
  api(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }).then((r) =>
    r.status === 204 ? null : r.ok ? r.json() : Promise.reject(new Error(r.statusText))
  );
export const apiDelete = (path) =>
  api(path, { method: 'DELETE' }).then((r) => (r.status === 204 ? null : r.ok ? r.json() : Promise.reject(new Error(r.statusText))));

export { getApiUrl };
