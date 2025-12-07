import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Vendor chunks
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-vendor';
                }
                if (id.includes('react-router')) {
                  return 'router';
                }
                if (id.includes('supabase')) {
                  return 'supabase';
                }
                if (id.includes('@google/genai')) {
                  return 'ai-vendor';
                }
                return 'vendor';
              }
              
              // Shared types - MUST be in separate chunk to avoid enum issues
              // This must come BEFORE device-pages check to ensure types.ts is included
              if (id.includes('types.ts')) {
                return 'shared-types';
              }
              
              // UI components chunk
              if (id.includes('components/ui/')) {
                return 'ui-components';
              }
              
              // Payment-related components (business critical)
              if (id.includes('payment/') || id.includes('PaymentFlow') || id.includes('MatchPayment')) {
                return 'payment';
              }
              
              // Admin components (low priority)
              if (id.includes('admin/') || id.includes('AdminDashboard')) {
                return 'admin';
              }
              
              // Static/Info pages
              if (id.includes('FAQPage') || id.includes('TermsPage') || id.includes('PrivacyPage') || id.includes('ContactPage')) {
                return 'static-pages';
              }
              
              // Device-related pages
              if (id.includes('Device') || id.includes('AddDevice')) {
                return 'device-pages';
              }
              
              // Dashboard and profile
              if (id.includes('Dashboard') || id.includes('Profile')) {
                return 'user-pages';
              }
            }
          }
        },
        // Enable source maps for debugging
        sourcemap: mode === 'development',
        
        // Optimize chunk size
        chunkSizeWarningLimit: 500,
        
        // Enable minification
        minify: mode === 'production' ? 'esbuild' : false,
        
        // Target modern browsers for better optimization
        target: 'es2020',
        
        // Enable CSS code splitting
        cssCodeSplit: true,
        
        // Optimize assets
        assetsInlineLimit: 4096
      },
      
      // Optimize dependencies
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom'
        ],
        exclude: [
          // Exclude large dependencies that should be loaded on demand
        ]
      },
      
      // Development server configuration
      server: {
        // Enable compression
        cors: true,
        // Optimize HMR
        hmr: {
          overlay: true
        }
      }
    };
});
