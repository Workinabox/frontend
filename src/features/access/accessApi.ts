import axios from 'axios';
import { config } from '../../config.ts';
import type { RoleAssignment } from './types.ts';

const base = config.apiBaseUrl;

export async function listRoleAssignments(): Promise<RoleAssignment[]> {
  return (await axios.get<RoleAssignment[]>(`${base}/role-assignments`)).data;
}

export async function grantRole(body: {
  user_id: string;
  scope_kind: string;
  scope_id: string;
  role: string;
}): Promise<RoleAssignment> {
  return (await axios.post<RoleAssignment>(`${base}/role-assignments`, body)).data;
}

export async function revokeRole(id: string): Promise<void> {
  await axios.delete(`${base}/role-assignments/${id}`);
}
