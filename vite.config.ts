import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { concernAnalysisPlugin } from './server/concern-analysis.ts';

export default defineConfig({
  plugins: [react(), concernAnalysisPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['3000-i5dxexnsxef48o2ugyus4-f97f3300.sg2.manus.computer'],
  },
});
