import axios from 'axios';
import { config } from '../../config.ts';
import type { AuthConfig, CurrentUser, LoginResponse } from './types.ts';

const base = config.apiBaseUrl;

// The current user, or null when there is no valid session (a 401 is the "logged out"
// signal here, not an error — the response interceptor skips /auth/ URLs).
export async function fetchSession(): Promise<CurrentUser | null> {
  try {
    return (await axios.get<CurrentUser>(`${base}/auth/session`)).data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return (await axios.post<LoginResponse>(`${base}/auth/session`, { email, password })).data;
}

export async function logout(): Promise<void> {
  await axios.delete(`${base}/auth/session`);
}

export async function changePassword(
  current_password: string,
  new_password: string,
): Promise<void> {
  await axios.put(`${base}/auth/password`, { current_password, new_password });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await axios.post(`${base}/auth/password/reset/request`, { email });
}

export async function confirmPasswordReset(token: string, new_password: string): Promise<void> {
  await axios.post(`${base}/auth/password/reset/confirm`, { token, new_password });
}

export async function signup(email: string, password: string, name: string): Promise<void> {
  await axios.post(`${base}/auth/signup`, { email, password, name });
}

// Accept-invite and verify-email auto-sign-in (the server sets the session cookie).
export async function acceptInvite(token: string, password: string): Promise<void> {
  await axios.post(`${base}/auth/invite/accept`, { token, password });
}

export async function verifyEmail(token: string): Promise<void> {
  await axios.post(`${base}/auth/verify-email`, { token });
}

export async function fetchAuthConfig(): Promise<AuthConfig> {
  return (await axios.get<AuthConfig>(`${base}/auth/config`)).data;
}
