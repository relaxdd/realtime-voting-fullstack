import { defineConfig } from 'vite';
import path from 'path';

const entry = 'src/index.ts'

export default defineConfig({
  build: {
    lib: {
      name: 'MyNodeApp',
      formats: ['es'],
      entry: path.resolve(__dirname, entry),
      fileName: (format) => `${path.basename(entry, path.extname(entry))}.${format}.js`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:path', 'node:http'],
    },
    minify: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    conditions: ['node'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  apply: 'build',
})
