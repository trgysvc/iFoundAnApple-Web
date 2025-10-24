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
            // Enum'ların düzgün işlenmesi için preserveModules kullan
            preserveModules: false,
            manualChunks: (id) => {
              // Vendor chunks - prioritize stability
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
              
              // Critical pages - each in separate chunk to avoid conflicts
              if (id.includes('pages/DeviceDetailPage')) {
                return 'device-detail-page';
              }
              if (id.includes('pages/AddDevicePage')) {
                return 'add-device-page';
              }
              if (id.includes('pages/DashboardPage')) {
                return 'dashboard-page';
              }
              if (id.includes('pages/ProfilePage')) {
                return 'profile-page';
              }
              if (id.includes('pages/HomePage')) {
                return 'home-page';
              }
              if (id.includes('pages/LoginPage')) {
                return 'login-page';
              }
              if (id.includes('pages/RegisterPage')) {
                return 'register-page';
              }
              
              // Payment pages - critical business logic
              if (id.includes('pages/PaymentFlowPage')) {
                return 'payment-flow-page';
              }
              if (id.includes('pages/MatchPaymentPage')) {
                return 'match-payment-page';
              }
              if (id.includes('pages/PaymentSuccessPage')) {
                return 'payment-success-page';
              }
              if (id.includes('pages/PaymentCallbackPage')) {
                return 'payment-callback-page';
              }
              if (id.includes('components/payment/')) {
                return 'payment-components';
              }
              
              // UI components chunk
              if (id.includes('components/ui/')) {
                return 'ui-components';
              }
              
              // Admin components (low priority) - split further
              if (id.includes('pages/admin/') || id.includes('AdminDashboard')) {
                return 'admin-pages';
              }
              if (id.includes('components/admin/')) {
                return 'admin-components';
              }
              
              // Static/Info pages
              if (id.includes('pages/FAQPage') || id.includes('pages/TermsPage') || id.includes('pages/PrivacyPage') || id.includes('pages/ContactPage')) {
                return 'static-pages';
              }
              
              // Other device components
              if (id.includes('components/Device') || id.includes('components/cargo')) {
                return 'device-components';
              }
              
              // Utils and contexts
              if (id.includes('utils/') || id.includes('contexts/')) {
                return 'utils-contexts';
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
        },
        // Proxy for İyzico API (CORS bypass)
        proxy: {
          '/api/iyzico-verify': {
            target: 'https://sandbox-api.iyzipay.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/iyzico-verify/, '/payment/iyzipos/checkoutform/auth/ecom/detail'),
            configure: (proxy, options) => {
              proxy.on('proxyReq', (proxyReq, req, res) => {
                // Add İyzico headers
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Authorization', 'IYZWS sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL:' + Buffer.from('sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR').toString('base64'));
              });
            }
          }
        }
      }
    };
});
