import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      all: true,
      exclude: ['cdk.out', '**/*.d.ts'],
      reporter: ['text', 'json', 'html'],
    },
    exclude: ['node_modules/**', '**/*.{d.ts,js}'],
    env: {
      JQUANTS_API_MAIL_ADDRESS: 'test@example.com',
      JQUANTS_API_PASSWORD: 'password',
    },
    snapshotSerializers: ['test/plugins/custom-serializer.ts'],
  },
});
