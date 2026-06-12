import axios from 'axios';
import { config } from '../../config.ts';
import type { Pipeline } from './types.ts';
import { db, nextId, respond } from '../stub/db.ts';

export async function fetchPipelines(projectId: string): Promise<Pipeline[]> {
  if (config.useStub) {
    return respond(db.pipelines.filter((p) => p.project_id === projectId));
  }
  const { data } = await axios.get<Pipeline[]>(
    `${config.apiBaseUrl}/projects/${projectId}/pipelines`,
  );
  return data;
}

export async function createPipeline(
  projectId: string,
  body: { name: string; description: string },
): Promise<Pipeline> {
  if (config.useStub) {
    const pipeline: Pipeline = {
      id: nextId('PL', db.pipelines),
      project_id: projectId,
      ...body,
    };
    db.pipelines.push(pipeline);
    return respond(pipeline);
  }
  const { data } = await axios.post<Pipeline>(
    `${config.apiBaseUrl}/projects/${projectId}/pipelines`,
    body,
  );
  return data;
}

export async function updatePipeline(
  id: string,
  body: { name: string; description: string },
): Promise<Pipeline> {
  if (config.useStub) {
    const found = db.pipelines.find((p) => p.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<Pipeline>(`${config.apiBaseUrl}/pipelines/${id}`, body);
  return data;
}
