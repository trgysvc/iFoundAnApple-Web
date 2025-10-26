#!/usr/bin/env node
/**
 * Generate Encryption Key Script
 * 
 * Usage: node scripts/generate-encryption-key.js
 * 
 * This script generates a secure random encryption key for the application.
 * Use this key in your .env file as VITE_ENCRYPTION_KEY
 */

const crypto = require('crypto');

// Generate a secure random key
const keyLength = 64; // bytes
const key = crypto.randomBytes(keyLength).toString('hex');

console.log('═══════════════════════════════════════════════════════════');
console.log('🔐 ENCRYPTION KEY GENERATED');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('Copy this key and add it to your .env file:\n');
console.log(`VITE_ENCRYPTION_KEY=${key}\n`);
console.log('═══════════════════════════════════════════════════════════');
console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('═══════════════════════════════════════════════════════════');
console.log('1. Never commit this key to version control');
console.log('2. Store the key securely (password manager + encrypted USB)');
console.log('3. Use different keys for development and production');
console.log('4. Rotate keys periodically (every 90 days)');
console.log('5. If key is lost, encrypted data is unrecoverable');
console.log('═══════════════════════════════════════════════════════════\n');

