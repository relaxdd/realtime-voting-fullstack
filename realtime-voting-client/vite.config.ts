import tailwindcss from '@tailwindcss/vite';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // basicSsl({
    //   /** name of certification */
    //   name: 'test',
    //   /** custom trust domains */
    //   // domains: ['awenn-voting.local'],
    // }),
    react(),
    tailwindcss()
  ],
  server: {
    port: 80,
    host: '127.0.0.1',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
