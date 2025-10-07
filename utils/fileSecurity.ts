/**
 * Advanced File Security Utilities
 * Enhanced security measures for file uploads
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
  fileType?: string;
  size?: number;
}

export interface MagicNumberInfo {
  signature: string;
  extension: string;
  mimeType: string;
}

/**
 * Magic numbers for common file types
 * These are the actual file signatures (file headers)
 */
export const MAGIC_NUMBERS: MagicNumberInfo[] = [
  // Images
  { signature: 'FFD8FF', extension: 'jpg', mimeType: 'image/jpeg' },
  { signature: 'FFD8FFE0', extension: 'jpg', mimeType: 'image/jpeg' },
  { signature: 'FFD8FFE1', extension: 'jpg', mimeType: 'image/jpeg' },
  { signature: '89504E47', extension: 'png', mimeType: 'image/png' },
  { signature: '52494646', extension: 'webp', mimeType: 'image/webp' }, // RIFF header
  { signature: '47494638', extension: 'gif', mimeType: 'image/gif' },
  
  // PDF
  { signature: '25504446', extension: 'pdf', mimeType: 'application/pdf' }, // %PDF
];

/**
 * Read file header and extract magic number
 */
export const getFileMagicNumber = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert first 8 bytes to hex string
      const hexArray = Array.from(uint8Array.slice(0, 8))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
      
      resolve(hexArray);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file.slice(0, 8)); // Read only first 8 bytes
  });
};

/**
 * Validate file magic number against declared MIME type
 */
export const validateMagicNumber = async (
  file: File
): Promise<{ valid: boolean; detectedType?: string; error?: string }> => {
  try {
    const magicNumber = await getFileMagicNumber(file);
    
    // Find matching magic number
    const matchedType = MAGIC_NUMBERS.find(type => 
      magicNumber.startsWith(type.signature)
    );
    
    if (!matchedType) {
      return {
        valid: false,
        error: 'Unknown or unsupported file type detected'
      };
    }
    
    // Check if detected type matches declared MIME type
    const declaredMimeType = file.type.toLowerCase();
    const detectedMimeType = matchedType.mimeType.toLowerCase();
    
    if (detectedMimeType !== declaredMimeType) {
      return {
        valid: false,
        detectedType: detectedMimeType,
        error: `File type mismatch: declared as ${declaredMimeType} but detected as ${detectedMimeType}`
      };
    }
    
    return {
      valid: true,
      detectedType: detectedMimeType
    };
    
  } catch (error) {
    return {
      valid: false,
      error: `Failed to validate file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Enhanced file validation with magic number check
 */
export const validateFileSecurity = async (
  file: File
): Promise<FileValidationResult> => {
  const warnings: string[] = [];
  
  // 1. Basic file size validation (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit',
      size: file.size
    };
  }
  
  // 2. File type validation
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'application/pdf'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP and PDF files are allowed.',
      fileType: file.type
    };
  }
  
  // 3. Magic number validation
  const magicValidation = await validateMagicNumber(file);
  if (!magicValidation.valid) {
    return {
      valid: false,
      error: magicValidation.error || 'File validation failed',
      fileType: file.type
    };
  }
  
  // 4. File name validation
  const nameValidation = validateFileName(file.name);
  if (!nameValidation.valid) {
    return {
      valid: false,
      error: nameValidation.error || 'Invalid file name',
      fileType: file.type,
      size: file.size
    };
  }
  
  // 5. File size warnings
  if (file.size > 2 * 1024 * 1024) { // 2MB
    warnings.push('Large file size may affect upload speed');
  }
  
  return {
    valid: true,
    fileType: file.type,
    size: file.size,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

/**
 * Enhanced file name validation and sanitization
 */
export const validateFileName = (fileName: string): { valid: boolean; error?: string; sanitized?: string } => {
  // Check for empty name
  if (!fileName || fileName.trim().length === 0) {
    return { valid: false, error: 'File name cannot be empty' };
  }
  
  // Check length
  if (fileName.length > 255) {
    return { valid: false, error: 'File name is too long (max 255 characters)' };
  }
  
  // Check for path traversal attempts
  const pathTraversalPatterns = [
    /\.\./,           // Directory traversal
    /\.\.\//,         // Directory traversal with slash
    /\.\.\\/,         // Directory traversal with backslash
    /%2e%2e/,         // URL encoded ..
    /%2E%2E/,         // URL encoded .. (uppercase)
    /\.%2e/,          // Mixed encoding
    /%2e\./,          // Mixed encoding
  ];
  
  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(fileName)) {
      return { valid: false, error: 'File name contains path traversal characters' };
    }
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(fileName)) {
    return { valid: false, error: 'File name contains invalid characters' };
  }
  
  // Check for reserved names (Windows)
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];
  
  const baseName = fileName.split('.')[0].toUpperCase();
  if (reservedNames.includes(baseName)) {
    return { valid: false, error: 'File name uses reserved system name' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.exe$/i,        // Executable files
    /\.bat$/i,        // Batch files
    /\.cmd$/i,        // Command files
    /\.scr$/i,        // Screensaver files
    /\.com$/i,        // Command files
    /\.pif$/i,        // Program information files
    /\.vbs$/i,        // VBScript files
    /\.js$/i,         // JavaScript files
    /\.jar$/i,        // Java archives
    /\.zip$/i,        // Archive files
    /\.rar$/i,        // Archive files
    /\.7z$/i,         // Archive files
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fileName)) {
      return { valid: false, error: 'File type not allowed for security reasons' };
    }
  }
  
  // Sanitize file name (remove dangerous characters)
  const sanitized = fileName
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')  // Replace invalid chars with underscore
    .replace(/\s+/g, '_')                     // Replace spaces with underscore
    .replace(/_+/g, '_')                      // Replace multiple underscores with single
    .replace(/^_|_$/g, '');                   // Remove leading/trailing underscores
  
  return {
    valid: true,
    sanitized: sanitized !== fileName ? sanitized : undefined
  };
};

/**
 * Basic malware detection patterns
 */
export const MALWARE_PATTERNS = [
  // Common malware signatures (simplified)
  /eval\s*\(/i,                    // JavaScript eval
  /document\.write\s*\(/i,         // Document write
  /window\.location/i,             // Window location manipulation
  /<script[^>]*>/i,                // Script tags in files
  /javascript:/i,                  // JavaScript protocol
  /vbscript:/i,                    // VBScript protocol
  /data:text\/html/i,              // Data URI with HTML
  /<iframe[^>]*>/i,                // Iframe tags
  /<object[^>]*>/i,                // Object tags
  /<embed[^>]*>/i,                 // Embed tags
];

/**
 * Basic client-side malware detection
 */
export const detectMalware = async (file: File): Promise<{ safe: boolean; warnings?: string[] }> => {
  const warnings: string[] = [];
  
  // Only scan text-based files (PDF, images might contain metadata)
  if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
    try {
      const text = await file.text();
      
      for (const pattern of MALWARE_PATTERNS) {
        if (pattern.test(text)) {
          warnings.push(`Suspicious pattern detected: ${pattern.source}`);
        }
      }
      
      // Check for excessive script content
      const scriptMatches = text.match(/<script[^>]*>/gi);
      if (scriptMatches && scriptMatches.length > 5) {
        warnings.push('Excessive script tags detected');
      }
      
    } catch (error) {
      // If we can't read the file as text, it's likely binary - that's okay
      console.warn('Could not scan file for malware patterns:', error);
    }
  }
  
  return {
    safe: warnings.length === 0,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

/**
 * Complete file security validation
 */
export const performCompleteFileValidation = async (
  file: File
): Promise<FileValidationResult> => {
  // 1. Basic security validation
  const basicValidation = await validateFileSecurity(file);
  if (!basicValidation.valid) {
    return basicValidation;
  }
  
  // 2. Malware detection
  const malwareCheck = await detectMalware(file);
  if (!malwareCheck.safe) {
    return {
      valid: false,
      error: 'File contains suspicious content',
      warnings: malwareCheck.warnings
    };
  }
  
  // 3. Add malware warnings to basic validation
  if (malwareCheck.warnings && malwareCheck.warnings.length > 0) {
    return {
      ...basicValidation,
      warnings: [...(basicValidation.warnings || []), ...malwareCheck.warnings]
    };
  }
  
  return basicValidation;
};

export default {
  validateFileSecurity,
  validateMagicNumber,
  validateFileName,
  detectMalware,
  performCompleteFileValidation,
  getFileMagicNumber,
  MAGIC_NUMBERS
};
