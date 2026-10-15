import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Relative base, damit der Build auch in Unterordnern (z. B. GitHub Pages) läuft.
// Das Legacy-Plugin erzeugt zusätzlich ein Paket für ältere Browser (z. B. ältere iPads/Smartphones).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'safari >= 11', 'ios >= 11', 'chrome >= 64', 'firefox >= 60', 'samsung >= 9'],
    }),
  ],
});
