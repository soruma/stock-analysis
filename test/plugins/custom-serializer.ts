import type { SnapshotSerializer } from 'vitest';

export default {
  test(val: unknown) {
    return typeof val === 'string';
  },
  serialize(val: string) {
    return val.replace(/[A-Fa-f0-9]{64}/, 'hashed');
  },
} satisfies SnapshotSerializer;
