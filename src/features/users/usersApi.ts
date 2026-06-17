import axios from 'axios';
import { config } from '../../config.ts';
import type { IssuedToken, User } from './types.ts';

const base = config.apiBaseUrl;

export async function fetchUsers(): Promise<User[]> {
  return (await axios.get<User[]>(`${base}/users`)).data;
}

export async function fetchUser(id: string): Promise<User> {
  return (await axios.get<User>(`${base}/users/${id}`)).data;
}

export async function createUser(body: {
  kind: string;
  name: string;
  email: string | null;
}): Promise<User> {
  return (await axios.post<User>(`${base}/users`, body)).data;
}

export async function inviteUser(body: { email: string; name: string }): Promise<User> {
  return (await axios.post<User>(`${base}/users/invite`, body)).data;
}

export async function deactivateUser(id: string): Promise<User> {
  return (await axios.post<User>(`${base}/users/${id}/deactivate`, {})).data;
}

export async function activateUser(id: string): Promise<User> {
  return (await axios.post<User>(`${base}/users/${id}/activate`, {})).data;
}

export async function addSshKey(
  userId: string,
  body: { label: string; public_key: string },
): Promise<User> {
  return (await axios.post<User>(`${base}/users/${userId}/ssh-keys`, body)).data;
}

export async function removeSshKey(userId: string, keyId: string): Promise<User> {
  return (await axios.delete<User>(`${base}/users/${userId}/ssh-keys/${keyId}`)).data;
}

export async function issueToken(
  userId: string,
  body: {
    label: string;
    read_only: boolean;
    repos: string[] | null;
    orgs: string[] | null;
    expires_at: string | null;
  },
): Promise<IssuedToken> {
  return (await axios.post<IssuedToken>(`${base}/users/${userId}/tokens`, body)).data;
}

export async function revokeToken(userId: string, tokenId: string): Promise<User> {
  return (await axios.delete<User>(`${base}/users/${userId}/tokens/${tokenId}`)).data;
}
