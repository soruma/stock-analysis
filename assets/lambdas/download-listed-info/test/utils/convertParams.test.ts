import { beforeEach, describe, expect, it, vi } from 'vitest';

import { convertParams } from '../../src/utils';

describe('convertParams', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2024/01/01 09:11:23'));
  });

  it('empty parameters, the date is 12 weeks ago', () => {
    const result = convertParams({});

    expect(result).toEqual(['2023-10-09']);
  });

  it('inputArray is passed, an array of dates is returned', () => {
    const input = {
      inputArray: [{ date: '2023-10-09' }, { date: '2023-10-10' }, { date: '2023-10-11' }],
    };
    const result = convertParams(input);

    expect(result).toEqual(['2023-10-09', '2023-10-10', '2023-10-11']);
  });

  it('date is passed, an array of dates is returned', () => {
    const input = { date: '2024-12-21' };

    const result = convertParams(input);
    expect(result).toEqual(['2024-12-21']);
  });
});
