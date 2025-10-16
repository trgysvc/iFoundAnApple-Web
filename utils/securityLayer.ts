// Rate Limiting ve Güvenlik Katmanı
export class SecurityLayer {
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 dakika
  private static readonly MAX_REQUESTS_PER_WINDOW = 100; // Dakikada maksimum 100 istek

  static checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requestCounts.get(userId);

    if (!userRequests || now > userRequests.resetTime) {
      // Yeni pencere başlat
      this.requestCounts.set(userId, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
      return true;
    }

    if (userRequests.count >= this.MAX_REQUESTS_PER_WINDOW) {
      console.warn(`Rate limit exceeded for user: ${userId}`);
      return false;
    }

    userRequests.count++;
    return true;
  }

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // XSS koruması
      .substring(0, 1000); // Maksimum uzunluk
  }

  static validateUserId(userId: string): boolean {
    // UUID format kontrolü
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId);
  }

  static validateDeviceId(deviceId: string): boolean {
    return this.validateUserId(deviceId); // Aynı UUID formatı
  }

  static logSecurityEvent(event: string, userId: string, details?: any) {
    console.warn(`🚨 SECURITY EVENT: ${event}`, {
      userId: userId.substring(0, 8) + '***', // Masked
      timestamp: new Date().toISOString(),
      details: details ? JSON.stringify(details).substring(0, 200) : undefined
    });
  }
}
