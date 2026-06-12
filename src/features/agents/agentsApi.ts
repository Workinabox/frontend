import axios from 'axios';
import { config } from '../../config.ts';
import type { Agent } from './types.ts';
import { db, nextId, respond } from '../stub/db.ts';

export async function fetchAgents(orgId: string): Promise<Agent[]> {
  if (config.useStub) {
    return respond(db.agents.filter((a) => a.organization_id === orgId));
  }
  const { data } = await axios.get<Agent[]>(
    `${config.apiBaseUrl}/organizations/${orgId}/agents`,
  );
  return data;
}

export async function createAgent(
  orgId: string,
  body: { name: string; description: string },
): Promise<Agent> {
  if (config.useStub) {
    const agent: Agent = { id: nextId('A', db.agents), organization_id: orgId, ...body };
    db.agents.push(agent);
    return respond(agent);
  }
  const { data } = await axios.post<Agent>(
    `${config.apiBaseUrl}/organizations/${orgId}/agents`,
    body,
  );
  return data;
}

export async function updateAgent(
  id: string,
  body: { name: string; description: string },
): Promise<Agent> {
  if (config.useStub) {
    const found = db.agents.find((a) => a.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<Agent>(`${config.apiBaseUrl}/agents/${id}`, body);
  return data;
}
