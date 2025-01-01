import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { weeksAgo } from '../../src/utils';

describe('weeksAgo', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2024/01/01 09:11:23'));
  });

  it('Date 12 weeks ago', () => {
    const dateStr = weeksAgo(12);

    expect(dateStr).equals('2023-10-09');
  });
});
