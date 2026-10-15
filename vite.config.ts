import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base, damit der Build auch in Unterordnern (z. B. GitHub Pages) läuft.
export default defineConfig({
  base: './',
  plugins: [react()],
});
