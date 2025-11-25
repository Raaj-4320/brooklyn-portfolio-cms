import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 3000, // Forces app to run on http://localhost:3000
    },
    define: {
      // CRITICAL: Prevents "process is not defined" error in browser
      // This allows services/gemini.ts to read the API key safely
      'process.env': {
         API_KEY: JSON.stringify(env.API_KEY || ''),
         GEMINI_API_KEY: JSON.stringify(env.GEMINI_API_KEY || '')
      }
    }
  };
});