import axios from 'axios';
import { config } from '../../config.ts';
import type { Organization, Project } from './types.ts';
import { db, nextId, respond } from '../stub/db.ts';

export async function fetchOrganizations(): Promise<Organization[]> {
  if (config.useStub) {
    return respond(db.organizations);
  }
  const { data } = await axios.get<Organization[]>(`${config.apiBaseUrl}/organizations`);
  return data;
}

export async function createOrganization(body: {
  name: string;
  description: string;
}): Promise<Organization> {
  if (config.useStub) {
    const organization: Organization = { id: nextId('O', db.organizations), ...body };
    db.organizations.push(organization);
    return respond(organization);
  }
  const { data } = await axios.post<Organization>(`${config.apiBaseUrl}/organizations`, body);
  return data;
}

export async function updateOrganization(
  id: string,
  body: { name: string; description: string },
): Promise<Organization> {
  if (config.useStub) {
    const found = db.organizations.find((o) => o.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<Organization>(
    `${config.apiBaseUrl}/organizations/${id}`,
    body,
  );
  return data;
}

export async function fetchProjects(orgId: string): Promise<Project[]> {
  if (config.useStub) {
    return respond(db.projects.filter((p) => p.organization_id === orgId));
  }
  const { data } = await axios.get<Project[]>(
    `${config.apiBaseUrl}/organizations/${orgId}/projects`,
  );
  return data;
}

export async function createProject(
  orgId: string,
  body: { name: string; description: string },
): Promise<Project> {
  if (config.useStub) {
    const project: Project = {
      id: nextId('P', db.projects),
      organization_id: orgId,
      ...body,
    };
    db.projects.push(project);
    return respond(project);
  }
  const { data } = await axios.post<Project>(
    `${config.apiBaseUrl}/organizations/${orgId}/projects`,
    body,
  );
  return data;
}

export async function updateProject(
  id: string,
  body: { name: string; description: string },
): Promise<Project> {
  if (config.useStub) {
    const found = db.projects.find((p) => p.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<Project>(`${config.apiBaseUrl}/projects/${id}`, body);
  return data;
}
