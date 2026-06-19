// Console authentication: the session lives in an HttpOnly cookie the backend sets at
// login. We send it on every API call (same-origin via the /api proxy) and bounce to the
// login page when the server reports the session is gone.
import axios from 'axios';

let installed = false;

export function installAuth(): void {
  if (installed) return;
  installed = true;
  axios.defaults.withCredentials = true;
  // Double-submit CSRF: echo the readable `wiab_csrf` cookie in `X-CSRF-Token` on
  // state-changing requests. The backend enforces this for cookie-authenticated writes.
  axios.interceptors.request.use((config) => {
    const method = (config.method ?? 'get').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      const token = readCsrfCookie();
      if (token) config.headers.set('X-CSRF-Token', token);
    }
    return config;
  });
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url: string = error?.config?.url ?? '';
      // A 401 on a normal API call means the session expired — redirect to login. The
      // /auth/ endpoints handle their own 401s (they distinguish "logged out" from error).
      if (
        status === 401 &&
        !url.includes('/auth/') &&
        !window.location.pathname.startsWith('/login')
      ) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.assign(`/login?next=${next}`);
      }
      return Promise.reject(error);
    },
  );
}

// The CSRF token the backend set as a non-HttpOnly cookie at login (survives reloads).
function readCsrfCookie(): string | undefined {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('wiab_csrf='))
    ?.slice('wiab_csrf='.length);
}
