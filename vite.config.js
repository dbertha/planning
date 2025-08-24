import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer React et ReactDOM
          'react-vendor': ['react', 'react-dom'],
          // Séparer les composants admin (gros)
          'admin-components': [
            './src/components/AdminPanel.jsx',
            './src/components/SMSManager.jsx',
            './src/components/ScheduledSMSManager.jsx',
            './src/components/FamillesManager.jsx',
            './src/components/ClassesManager.jsx',
            './src/components/SemainesManager.jsx',
            './src/components/PlanningManager.jsx',
            './src/components/ExclusionsManager.jsx'
          ],
          // Séparer les composants de planning (moyens)
          'planning-components': [
            './src/components/Planning.jsx',
            './src/components/PlanningGrid.jsx',
            './src/components/PlanningHeader.jsx',
            './src/components/WeekRow.jsx',
            './src/components/AffectationCell.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000  // Augmenter la limite d'avertissement
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy des APIs vers le serveur Vercel
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
}) 