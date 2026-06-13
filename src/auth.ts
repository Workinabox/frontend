// Console authentication: stores the access token and attaches it to every API call.
// The token is a wiab access token (the bootstrap owner token, or one minted in the UI).
import axios from 'axios';

const TOKEN_KEY = 'wiab_token';

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? '';
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

let installed = false;

/// Installs a global axios interceptor that sends `Authorization: Bearer <token>`.
export function installAuth(): void {
  if (installed) return;
  installed = true;
  axios.interceptors.request.use((cfg) => {
    const token = getToken();
    if (token) {
      cfg.headers.set('Authorization', `Bearer ${token}`);
    }
    return cfg;
  });
}
