const getApiUrl = () => {
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, '');
  }
  return '';
};

const api = (path, options = {}) => {
  const base = getApiUrl();
  const url = path.startsWith('http') ? path : `${base}/api${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
};

export const apiGet = (path) => api(path).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))));
export const apiPost = (path, body) =>
  api(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }).then((r) =>
    r.status === 204 ? null : r.ok ? r.json() : Promise.reject(new Error(r.statusText))
  );
export const apiPut = (path, body) =>
  api(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }).then((r) =>
    r.status === 204 ? null : r.ok ? r.json() : Promise.reject(new Error(r.statusText))
  );
export const apiDelete = (path) =>
  api(path, { method: 'DELETE' }).then((r) => (r.status === 204 ? null : r.ok ? r.json() : Promise.reject(new Error(r.statusText))));

export { getApiUrl };
