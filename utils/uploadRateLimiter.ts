/**
 * Upload Rate Limiter
 * Prevents abuse of file upload functionality
 */

interface UploadAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class UploadRateLimiter {
  private attempts = new Map<string, UploadAttempt>();
  
  // Rate limiting configuration
  private readonly MAX_UPLOADS_PER_HOUR = 10;
  private readonly MAX_UPLOADS_PER_DAY = 50;
  private readonly BLOCK_DURATION = 60 * 60 * 1000; // 1 hour block
  
  /**
   * Check if user can upload a file
   */
  canUpload(userId: string): { allowed: boolean; reason?: string; retryAfter?: number } {
    const now = Date.now();
    const userAttempts = this.attempts.get(userId);
    
    // Check if user is currently blocked
    if (userAttempts?.blockedUntil && now < userAttempts.blockedUntil) {
      return {
        allowed: false,
        reason: 'Upload temporarily blocked due to rate limiting',
        retryAfter: Math.ceil((userAttempts.blockedUntil - now) / 1000)
      };
    }
    
    // Reset attempts if blocked period has passed
    if (userAttempts?.blockedUntil && now >= userAttempts.blockedUntil) {
      this.attempts.delete(userId);
      return { allowed: true };
    }
    
    // Check hourly limit
    if (userAttempts) {
      const oneHourAgo = now - (60 * 60 * 1000);
      
      if (userAttempts.lastAttempt > oneHourAgo && userAttempts.count >= this.MAX_UPLOADS_PER_HOUR) {
        // Block user for 1 hour
        userAttempts.blockedUntil = now + this.BLOCK_DURATION;
        
        return {
          allowed: false,
          reason: `Upload limit exceeded: ${this.MAX_UPLOADS_PER_HOUR} uploads per hour`,
          retryAfter: Math.ceil(this.BLOCK_DURATION / 1000)
        };
      }
    }
    
    return { allowed: true };
  }
  
  /**
   * Record a successful upload attempt
   */
  recordUpload(userId: string): void {
    const now = Date.now();
    const existing = this.attempts.get(userId);
    
    if (existing) {
      // Reset count if more than 1 hour has passed
      const oneHourAgo = now - (60 * 60 * 1000);
      if (existing.lastAttempt <= oneHourAgo) {
        existing.count = 1;
      } else {
        existing.count++;
      }
      existing.lastAttempt = now;
      delete existing.blockedUntil; // Remove block on successful upload
    } else {
      this.attempts.set(userId, {
        count: 1,
        lastAttempt: now
      });
    }
  }
  
  /**
   * Get user's upload statistics
   */
  getUploadStats(userId: string): { uploadsThisHour: number; uploadsToday: number; isBlocked: boolean } {
    const userAttempts = this.attempts.get(userId);
    const now = Date.now();
    
    if (!userAttempts) {
      return { uploadsThisHour: 0, uploadsToday: 0, isBlocked: false };
    }
    
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    const uploadsThisHour = userAttempts.lastAttempt > oneHourAgo ? userAttempts.count : 0;
    const uploadsToday = userAttempts.lastAttempt > oneDayAgo ? userAttempts.count : 0;
    const isBlocked = !!(userAttempts.blockedUntil && now < userAttempts.blockedUntil);
    
    return {
      uploadsThisHour,
      uploadsToday,
      isBlocked
    };
  }
  
  /**
   * Reset rate limit for a user (admin function)
   */
  resetUserLimit(userId: string): void {
    this.attempts.delete(userId);
  }
  
  /**
   * Clean up old entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    for (const [userId, attempts] of this.attempts.entries()) {
      if (attempts.lastAttempt < oneDayAgo && (!attempts.blockedUntil || attempts.blockedUntil < now)) {
        this.attempts.delete(userId);
      }
    }
  }
  
  /**
   * Get global statistics
   */
  getGlobalStats(): { totalUsers: number; blockedUsers: number; totalAttempts: number } {
    const now = Date.now();
    let blockedUsers = 0;
    let totalAttempts = 0;
    
    for (const attempts of this.attempts.values()) {
      totalAttempts += attempts.count;
      if (attempts.blockedUntil && now < attempts.blockedUntil) {
        blockedUsers++;
      }
    }
    
    return {
      totalUsers: this.attempts.size,
      blockedUsers,
      totalAttempts
    };
  }
}

// Create singleton instance
export const uploadRateLimiter = new UploadRateLimiter();

// Cleanup old entries every hour
setInterval(() => {
  uploadRateLimiter.cleanup();
}, 60 * 60 * 1000);

export default uploadRateLimiter;
