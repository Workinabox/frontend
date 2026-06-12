import axios from 'axios';
import { config } from '../../config.ts';
import type { WorkSnapshot } from './types.ts';
import { db, nextId, respond } from '../stub/db.ts';

export async function fetchWorks(projectId: string): Promise<WorkSnapshot[]> {
  if (config.useStub) {
    return respond(db.works.filter((w) => w.project_id === projectId));
  }
  const { data } = await axios.get<WorkSnapshot[]>(
    `${config.apiBaseUrl}/projects/${projectId}/works`,
  );
  return data;
}

export async function createWork(
  projectId: string,
  body: { title: string; description: string },
): Promise<WorkSnapshot> {
  if (config.useStub) {
    const work: WorkSnapshot = {
      id: nextId('W', db.works),
      project_id: projectId,
      ...body,
      dones: [],
      children: [],
      is_done: false,
    };
    db.works.push(work);
    return respond(work);
  }
  const { data } = await axios.post<WorkSnapshot>(
    `${config.apiBaseUrl}/projects/${projectId}/works`,
    body,
  );
  return data;
}

export async function updateWork(
  id: string,
  body: { title: string; description: string },
): Promise<WorkSnapshot> {
  if (config.useStub) {
    const found = db.works.find((w) => w.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<WorkSnapshot>(`${config.apiBaseUrl}/works/${id}`, body);
  return data;
}
