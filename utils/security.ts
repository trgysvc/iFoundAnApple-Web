/**
 * Security utilities for input validation and sanitization
 */

// Environment check
const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

/**
 * Secure logger that prevents sensitive data exposure
 */
export const secureLogger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error?.message || error);
  },
  
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  
  // For user data - only log non-sensitive fields
  userAction: (action: string, userId?: string) => {
    if (isDevelopment) {
      console.log(`[USER] ${action}`, { userId: userId ? `***${userId.slice(-4)}` : 'unknown' });
    }
  }
};

/**
 * Input validation functions
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },
  
  tcKimlik: (tcNo: string): boolean => {
    // Remove spaces and validate format
    const cleaned = tcNo.replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleaned)) return false;
    
    // TC Kimlik algorithm validation
    const digits = cleaned.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    const check1 = (sum1 * 7 - sum2) % 10;
    const check2 = (sum1 + sum2 + digits[9]) % 10;
    
    return check1 === digits[9] && check2 === digits[10];
  },
  
  iban: (iban: string): boolean => {
    // Turkish IBAN validation
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    const ibanRegex = /^TR\d{24}$/;
    return ibanRegex.test(cleaned);
  },
  
  phoneNumber: (phone: string): boolean => {
    // Turkish phone number validation
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(cleaned);
  },
  
  serialNumber: (serial: string): boolean => {
    // Apple serial number validation (basic)
    const cleaned = serial.trim().toUpperCase();
    return /^[A-Z0-9]{8,12}$/.test(cleaned);
  }
};

/**
 * Input sanitization functions
 */
export const sanitizers = {
  text: (input: string): string => {
    return input.trim().replace(/[<>"'&]/g, '');
  },
  
  html: (input: string): string => {
    // Use DOMPurify for secure HTML sanitization
    if (typeof window !== 'undefined') {
      // Client-side: use DOMPurify
      try {
        const DOMPurify = require('dompurify');
        return DOMPurify.sanitize(input, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
          ALLOWED_ATTR: ['href', 'class', 'target'],
          ALLOW_DATA_ATTR: false
        });
      } catch (error) {
        console.warn('DOMPurify not available, falling back to basic sanitization');
        return basicHtmlSanitize(input);
      }
    } else {
      // Server-side: basic sanitization
      return basicHtmlSanitize(input);
    }
  },
  
  tcKimlik: (input: string): string => {
    return input.replace(/\D/g, '').slice(0, 11);
  },
  
  iban: (input: string): string => {
    return input.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 26);
  },
  
  phoneNumber: (input: string): string => {
    return input.replace(/[^\d\+\(\)\-\s]/g, '');
  }
};

/**
 * File upload security
 */
export const fileValidation = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
  maxSize: 5 * 1024 * 1024, // 5MB
  
  validateFile: (file: File): { valid: boolean; error?: string } => {
    if (!fileValidation.allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type' };
    }
    
    if (file.size > fileValidation.maxSize) {
      return { valid: false, error: 'File too large (max 5MB)' };
    }
    
    return { valid: true };
  }
};

/**
 * Environment variables validation
 */
export const envValidation = {
  required: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ],
  
  validate: (): { valid: boolean; missing: string[] } => {
    const missing = envValidation.required.filter(
      key => !import.meta.env[key]
    );
    
    return {
      valid: missing.length === 0,
      missing
    };
  }
};

/**
 * Rate limiting helpers (client-side basic implementation)
 */
export const rateLimiter = {
  attempts: new Map<string, { count: number; lastAttempt: number }>(),
  
  checkLimit: (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now();
    const record = rateLimiter.attempts.get(key);
    
    if (!record || now - record.lastAttempt > windowMs) {
      rateLimiter.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    record.lastAttempt = now;
    return true;
  },
  
  reset: (key: string): void => {
    rateLimiter.attempts.delete(key);
  }
};

/**
 * Security headers for fetch requests
 */
export const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};

/**
 * Secure configuration getter
 */
/**
 * Basic HTML sanitization fallback
 */
const basicHtmlSanitize = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const getSecureConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Backend API Configuration
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/v1';
  
  // Stripe Configuration (optional, not currently used)
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
  const stripeWebhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing required environment variables:', {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      supabaseServiceKey: !!supabaseServiceKey
    });
    throw new Error('Missing required environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  }
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
    geminiApiKey,
    backendApiUrl,
    isDevelopment,
    // Payment Gateway Configurations (PAYNET managed by backend)
    paynet: {
      isConfigured: true // PAYNET credentials managed by backend
    },
    stripe: {
      publishableKey: stripePublishableKey || undefined,
      secretKey: stripeSecretKey || undefined,
      webhookSecret: stripeWebhookSecret || undefined,
      isConfigured: !!(stripePublishableKey && stripeSecretKey)
    }
  };
};
