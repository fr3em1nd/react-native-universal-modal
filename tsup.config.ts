import { defineConfig } from 'tsup';

export default defineConfig([
  // CommonJS build
  {
    entry: ['src/index.ts', 'src/animation/index.ts'],
    format: ['cjs'],
    outDir: 'lib/commonjs',
    dts: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-native', 'react-native-reanimated'],
    esbuildOptions(options) {
      options.platform = 'neutral';
      options.conditions = ['react-native'];
    },
  },
  // ESM build
  {
    entry: ['src/index.ts', 'src/animation/index.ts'],
    format: ['esm'],
    outDir: 'lib/module',
    dts: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-native', 'react-native-reanimated'],
    esbuildOptions(options) {
      options.platform = 'neutral';
      options.conditions = ['react-native'];
    },
  },
  // TypeScript declarations
  {
    entry: ['src/index.ts', 'src/animation/index.ts'],
    format: ['esm'],
    outDir: 'lib/typescript',
    dts: { only: true },
    clean: false,
    external: ['react', 'react-native', 'react-native-reanimated'],
  },
]);
