import axios from 'axios';
import { config } from '../../config.ts';
import type { WorkSnapshot } from './types.ts';
import { worksStub } from './worksStub.ts';

export async function fetchWorks(): Promise<WorkSnapshot[]> {
  if (config.useStub) {
    // Mimic network latency so loading states are exercised.
    return new Promise((resolve) => setTimeout(() => resolve(worksStub), 300));
  }
  const { data } = await axios.get<WorkSnapshot[]>(`${config.apiBaseUrl}/works`);
  return data;
}
