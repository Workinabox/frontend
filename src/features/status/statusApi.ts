import axios from 'axios';
import { config } from '../../config.ts';
import type { Health } from './types.ts';

export async function fetchHealth(): Promise<Health> {
  if (config.useStub) {
    return { status: 'ok', version: 'stub' };
  }
  const { data } = await axios.get<Health>(`${config.apiBaseUrl}/health`);
  return data;
}
