import { describe, expect, it } from 'vitest';
import counterReducer, { increment } from './counterSlice.ts';

describe('counter reducer', () => {
  it('returns the initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({ value: 0 });
  });

  it('increments the value', () => {
    expect(counterReducer({ value: 0 }, increment())).toEqual({ value: 1 });
  });
});
