import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sync-dist-to-root',
      closeBundle() {
        try {
          const src = path.resolve(__dirname, 'dist');
          const rootDest = path.resolve(__dirname, '../dist');
          if (fs.existsSync(src) && src !== rootDest) {
            fs.cpSync(src, rootDest, { recursive: true });
            console.log(`[Vite Plugin] Successfully synced build from ${src} to ${rootDest}`);
          }
        } catch (err) {
          console.error('[Vite Plugin] Error syncing dist to root:', err.message);
        }
      },
    },
  ],
});
