/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_IYZICO_API_KEY: string
  readonly VITE_IYZICO_SECRET_KEY: string
  readonly VITE_IYZICO_BASE_URL: string
  readonly VITE_IYZICO_WEBHOOK_URL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_SECRET_KEY: string
  readonly VITE_STRIPE_WEBHOOK_SECRET: string
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_NODE_ENV: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

