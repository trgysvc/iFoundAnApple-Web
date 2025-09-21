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
            manualChunks: {
              // Vendor chunks
              'react-vendor': ['react', 'react-dom'],
              'router': ['react-router-dom'],
              
              // UI components chunk
              'ui-components': [
                './components/ui/Button.tsx',
                './components/ui/Input.tsx', 
                './components/ui/Select.tsx',
                './components/ui/Container.tsx',
                './components/ui/LoadingSpinner.tsx'
              ],
              
              // Payment-related components (business critical)
              'payment': [
                './pages/PaymentFlowPage.tsx',
                './pages/MatchPaymentPage.tsx',
                './components/payment/PaymentSummaryPage.tsx',
                './components/payment/FeeBreakdownCard.tsx',
                './components/payment/PaymentMethodSelector.tsx'
              ],
              
              // Admin components (low priority)
              'admin': [
                './pages/AdminDashboardPage.tsx',
                './components/admin/SecurityDashboard.tsx'
              ],
              
              // Static/Info pages
              'static-pages': [
                './pages/FAQPage.tsx',
                './pages/TermsPage.tsx',
                './pages/PrivacyPage.tsx',
                './pages/ContactPage.tsx'
              ]
            }
          }
        },
        // Enable source maps for debugging
        sourcemap: mode === 'development',
        
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        
        // Enable minification
        minify: mode === 'production' ? 'esbuild' : false,
        
        // Target modern browsers for better optimization
        target: 'es2020'
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
