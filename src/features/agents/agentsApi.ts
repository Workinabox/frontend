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
  body: { name: string; description: string; vm_type?: string | null },
): Promise<Agent> {
  if (config.useStub) {
    const agent: Agent = {
      id: nextId('A', db.agents),
      organization_id: orgId,
      name: body.name,
      description: body.description,
      vm_type: body.vm_type ?? null,
      active: false,
      vm_id: null,
      guest_ip: null,
    };
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
  body: { name: string; description: string; vm_type?: string | null },
): Promise<Agent> {
  if (config.useStub) {
    const found = db.agents.find((a) => a.id === id)!;
    found.name = body.name;
    found.description = body.description;
    found.vm_type = body.vm_type ?? null;
    return respond(found);
  }
  const { data } = await axios.put<Agent>(`${config.apiBaseUrl}/agents/${id}`, body);
  return data;
}

export async function activateAgent(id: string): Promise<Agent> {
  if (config.useStub) {
    const found = db.agents.find((a) => a.id === id)!;
    found.active = true;
    found.vm_id = 'VM-' + found.id;
    found.guest_ip = '192.168.100.' + (db.agents.indexOf(found) + 2);
    return respond(found);
  }
  const { data } = await axios.post<Agent>(`${config.apiBaseUrl}/agents/${id}/activate`, {});
  return data;
}

export async function deactivateAgent(id: string): Promise<Agent> {
  if (config.useStub) {
    const found = db.agents.find((a) => a.id === id)!;
    found.active = false;
    found.vm_id = null;
    found.guest_ip = null;
    return respond(found);
  }
  const { data } = await axios.post<Agent>(`${config.apiBaseUrl}/agents/${id}/deactivate`, {});
  return data;
}
