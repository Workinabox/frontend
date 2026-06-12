import axios from 'axios';
import { config } from '../../config.ts';
import type { Repo } from './types.ts';
import { db, nextId, respond } from '../stub/db.ts';

export async function fetchRepos(projectId: string): Promise<Repo[]> {
  if (config.useStub) {
    return respond(db.repos.filter((r) => r.project_id === projectId));
  }
  const { data } = await axios.get<Repo[]>(
    `${config.apiBaseUrl}/projects/${projectId}/repos`,
  );
  return data;
}

export async function createRepo(
  projectId: string,
  body: { name: string; description: string },
): Promise<Repo> {
  if (config.useStub) {
    const repo: Repo = { id: nextId('R', db.repos), project_id: projectId, ...body };
    db.repos.push(repo);
    return respond(repo);
  }
  const { data } = await axios.post<Repo>(
    `${config.apiBaseUrl}/projects/${projectId}/repos`,
    body,
  );
  return data;
}

export async function updateRepo(
  id: string,
  body: { name: string; description: string },
): Promise<Repo> {
  if (config.useStub) {
    const found = db.repos.find((r) => r.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<Repo>(`${config.apiBaseUrl}/repos/${id}`, body);
  return data;
}
