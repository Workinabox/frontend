import { describe, expect, it } from 'vitest';
import statusReducer, { loadHealth } from './statusSlice.ts';

describe('status reducer', () => {
  it('returns the initial state', () => {
    expect(statusReducer(undefined, { type: 'unknown' })).toEqual({
      online: false,
      status: 'idle',
    });
  });

  it('marks online and records whatever backend version the payload carries', () => {
    const next = statusReducer(undefined, {
      type: loadHealth.fulfilled.type,
      payload: { status: 'ok', version: 'test-version' },
    });
    expect(next.online).toBe(true);
    expect(next.backendVersion).toBe('test-version');
    expect(next.status).toBe('succeeded');
  });

  it('goes offline on failure', () => {
    const online = { online: true, backendVersion: 'test-version', status: 'succeeded' as const };
    const next = statusReducer(online, { type: loadHealth.rejected.type });
    expect(next.online).toBe(false);
    expect(next.status).toBe('failed');
  });
});
