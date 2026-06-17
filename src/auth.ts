// Console authentication: the session lives in an HttpOnly cookie the backend sets at
// login. We send it on every API call (same-origin via the /api proxy) and bounce to the
// login page when the server reports the session is gone.
import axios from 'axios';

let installed = false;

export function installAuth(): void {
  if (installed) return;
  installed = true;
  axios.defaults.withCredentials = true;
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
