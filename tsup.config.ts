import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'expo/index': 'src/expo/index.ts',
    'testing/index': 'src/testing/index.ts',
    'playwright/index': 'src/playwright/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom', 'react-native', 'react-dom/client', 'expo-router', '@dloizides/ui-tour'],
});
