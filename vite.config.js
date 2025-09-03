import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Router
          'router': ['react-router-dom'],
          
          // UI Libraries
          'ui-vendor': [
            '@mui/material', 
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
            '@material-tailwind/react'
          ],
          
          // Animation libraries
          'animation': ['framer-motion'],
          
          // Form and validation
          'forms': ['@formspree/react'],
          
                     // Firebase
           'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          
          // Icons and utilities
          'utils': [
            'lucide-react',
            'react-icons',
            'react-helmet-async'
          ]
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
    
    // Improve build performance
    sourcemap: false,
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@material-tailwind/react',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ],
    exclude: [],
    force: true
  },
  
  // Performance optimizations
  server: {
    fs: {
      strict: false,
    },
  },
})
