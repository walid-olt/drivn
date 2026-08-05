import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['test/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['src/lib/jwt.test.ts'],
    setupFiles: ['test/test-setup.ts'],
    hookTimeout: 120000,
    testTimeout: 30000,
  },
});
