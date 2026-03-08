import { defineConfig } from 'rsbuild/config';

export default defineConfig({
  output: {
    distPath: {
      root: 'dist',
    },
  },
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  server: {
    port: 3000,
  },
});
