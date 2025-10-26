/**
 * Encryption Manager for Sensitive User Data
 * 
 * Handles encryption and decryption of sensitive data fields
 * using AES-256-GCM encryption
 * 
 * Data Protection:
 * - TC Kimlik No
 * - IBAN
 * - Phone Number
 * - Address
 */

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const TAG_LENGTH = 128;
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Get encryption key from environment
 * In production, this should be stored in secure environment variables
 */
const getEncryptionKey = async (): Promise<CryptoKey> => {
  // Get master key from environment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const masterKeyString = (import.meta.env as any)?.VITE_ENCRYPTION_KEY as string | undefined;
  
  if (!masterKeyString) {
    console.error('[ENCRYPTION] Master key not found in environment');
    throw new Error('Encryption configuration error: Master key not found. Please set VITE_ENCRYPTION_KEY in your .env file');
  }

  try {
    // Convert string key to CryptoKey
    const keyBuffer = new TextEncoder().encode(masterKeyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyBuffer);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: ALGORITHM },
      false,
      ['encrypt', 'decrypt']
    );

    return cryptoKey;
  } catch (error) {
    console.error('[ENCRYPTION] Error importing encryption key:', error);
    throw new Error('Failed to initialize encryption key');
  }
};

/**
 * Generate a random IV for each encryption operation
 */
const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
};

/**
 * Encrypt sensitive data
 * @param plaintext - The data to encrypt
 * @returns Encrypted data as base64 string
 */
export const encrypt = async (plaintext: string): Promise<string> => {
  if (!plaintext || plaintext.trim() === '') {
    return '';
  }

  try {
    const key = await getEncryptionKey();
    const iv = generateIV();
    const plaintextBuffer = new TextEncoder().encode(plaintext);

    const encryptedArrayBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
        tagLength: TAG_LENGTH,
      },
      key,
      plaintextBuffer
    );

    // Combine IV and encrypted data
    const encryptedArray = new Uint8Array(encryptedArrayBuffer);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv, 0);
    combined.set(encryptedArray, iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  } catch (error) {
    console.error('[ENCRYPTION] Encryption error:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
};

/**
 * Decrypt sensitive data
 * @param ciphertext - The encrypted data (base64 string)
 * @returns Decrypted data as string
 */
export const decrypt = async (ciphertext: string): Promise<string> => {
  if (!ciphertext || ciphertext.trim() === '') {
    return '';
  }

  try {
    // Check if data is encrypted (base64 encoded with IV)
    // Encrypted data is always longer than 44 characters (IV + tag + minimal data)
    // Plain text data (like TC Kimlik) is 11 characters
    // If the data looks like plain text, return it as is
    if (ciphertext.length < 44 || !isBase64(ciphertext)) {
      console.log('[ENCRYPTION] Data appears to be plain text, returning as is');
      return ciphertext;
    }

    const key = await getEncryptionKey();
    
    // Convert from base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encryptedData = combined.slice(IV_LENGTH);

    // Create a new ArrayBuffer for encrypted data
    const encryptedBuffer = encryptedData.buffer.slice(
      encryptedData.byteOffset,
      encryptedData.byteOffset + encryptedData.byteLength
    );

    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
        tagLength: TAG_LENGTH,
      },
      key,
      encryptedBuffer
    );

    // Convert decrypted data to string
    return new TextDecoder().decode(decryptedArrayBuffer);
  } catch (error) {
    console.error('[ENCRYPTION] Decryption error:', error);
    // If decryption fails, assume it's plain text and return as is
    console.log('[ENCRYPTION] Returning plain text data');
    return ciphertext;
  }
};

/**
 * Check if string is valid base64
 */
function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

/**
 * Mask sensitive data for display (only show last few characters)
 */
export const maskData = (data: string, visibleChars: number = 4): string => {
  if (!data || data.length <= visibleChars) {
    return '*'.repeat(data?.length || 0);
  }
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
};

/**
 * Encrypt multiple fields in an object
 */
export const encryptFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): Promise<T> => {
  const encrypted = { ...data };
  
  for (const field of fieldsToEncrypt) {
    if (encrypted[field] && typeof encrypted[field] === 'string' && encrypted[field].trim() !== '') {
      encrypted[field] = await encrypt(encrypted[field]) as any;
    }
  }
  
  return encrypted;
};

/**
 * Decrypt multiple fields in an object
 */
export const decryptFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[]
): Promise<T> => {
  const decrypted = { ...data };
  
  for (const field of fieldsToDecrypt) {
    if (decrypted[field] && typeof decrypted[field] === 'string' && decrypted[field].trim() !== '') {
      try {
        // Try to decrypt, if it fails, it's probably plain text
        const decryptedValue = await decrypt(decrypted[field]);
        decrypted[field] = decryptedValue as any;
      } catch (error) {
        console.warn(`[ENCRYPTION] Failed to decrypt field ${String(field)}:`, error);
        // Keep original value if decryption fails (might be plain text or invalid)
      }
    }
  }
  
  return decrypted;
};

/**
 * Sensitive fields that need encryption
 */
export const SENSITIVE_FIELDS = [
  'tc_kimlik_no',
  'iban',
  'phone_number',
  'address',
];

/**
 * Check if a field is sensitive and should be encrypted
 */
export const isSensitiveField = (fieldName: string): boolean => {
  return SENSITIVE_FIELDS.includes(fieldName);
};

/**
 * Encrypt user profile data before saving to database
 */
export const encryptUserProfile = async (profileData: any) => {
  return encryptFields(profileData, SENSITIVE_FIELDS);
};

/**
 * Decrypt user profile data after retrieving from database
 */
export const decryptUserProfile = async (profileData: any) => {
  return decryptFields(profileData, SENSITIVE_FIELDS);
};

