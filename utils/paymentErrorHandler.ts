/**
 * Payment Hata Yönetimi ve Logging Sistemi
 * Kapsamlı hata yakalama, loglama ve kullanıcı dostu mesajlar
 */

// Genel ödeme hata kodları ve açıklamaları
export const PAYMENT_ERROR_CODES = {
  // Genel hatalar
  '1000': 'İşlem başarılı',
  '1001': 'Bilinmeyen hata',
  '1002': 'İşlem zaman aşımına uğradı',
  '1003': 'Geçersiz parametre',
  '1004': 'Yetkisiz erişim',
  '1005': 'İşlem bulunamadı',
  
  // Ödeme hataları
  '2000': 'Ödeme başarılı',
  '2001': 'Kart bilgileri geçersiz',
  '2002': 'Yetersiz bakiye',
  '2003': 'Kart limiti aşıldı',
  '2004': 'Kart bloke',
  '2005': '3D Secure doğrulama gerekli',
  '2006': 'Ödeme reddedildi',
  '2007': 'Fraud riski tespit edildi',
  
  // Konfigürasyon hataları
  '3000': 'API anahtarı geçersiz',
  '3001': 'Güvenlik anahtarı geçersiz',
  '3002': 'Merchant ID geçersiz',
  '3003': 'Webhook URL geçersiz',
  
  // Sistem hataları
  '4000': 'Ödeme servisi geçici olarak kullanılamıyor',
  '4001': 'Ağ bağlantı hatası',
  '4002': 'Sunucu hatası',
  '4003': 'Veritabanı hatası'
};

// Hata seviyeleri
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Hata kategorileri
export enum ErrorCategory {
  PAYMENT = 'payment',
  CONFIGURATION = 'configuration',
  NETWORK = 'network',
  VALIDATION = 'validation',
  SECURITY = 'security',
  SYSTEM = 'system'
}

// Hata interface'i
export interface PaymentError {
  code: string;
  message: string;
  level: ErrorLevel;
  category: ErrorCategory;
  timestamp: Date;
  userId?: string;
  paymentId?: string;
  deviceId?: string;
  details?: any;
  stack?: string;
}

// Hata yöneticisi sınıfı
export class PaymentErrorManager {
  private static instance: PaymentErrorManager;
  private errorLog: PaymentError[] = [];

  static getInstance(): PaymentErrorManager {
    if (!PaymentErrorManager.instance) {
      PaymentErrorManager.instance = new PaymentErrorManager();
    }
    return PaymentErrorManager.instance;
  }

  // Hata oluşturma
  createError(
    code: string,
    message: string,
    level: ErrorLevel = ErrorLevel.ERROR,
    category: ErrorCategory = ErrorCategory.SYSTEM,
    details?: any
  ): PaymentError {
    const error: PaymentError = {
      code,
      message,
      level,
      category,
      timestamp: new Date(),
      details
    };

    this.logError(error);
    return error;
  }

  // Ödeme hata kodunu kullanıcı dostu mesaja çevir
  translatePaymentError(errorCode: string, originalMessage?: string): string {
    const translatedMessage = PAYMENT_ERROR_CODES[errorCode as keyof typeof PAYMENT_ERROR_CODES];
    
    if (translatedMessage) {
      return translatedMessage;
    }

    // Bilinmeyen hata kodları için genel mesajlar
    switch (errorCode) {
      case '1001':
        return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
      case '2001':
        return 'Kart bilgileriniz geçersiz. Lütfen kontrol edin.';
      case '2002':
        return 'Kartınızda yeterli bakiye bulunmuyor.';
      case '2005':
        return '3D Secure doğrulaması gerekli. Lütfen bankanızla iletişime geçin.';
      case '3000':
        return 'Ödeme sistemi konfigürasyon hatası. Lütfen destek ile iletişime geçin.';
      default:
        return originalMessage || 'Ödeme işlemi sırasında bir hata oluştu.';
    }
  }

  // Hata loglama
  private logError(error: PaymentError): void {
    this.errorLog.push(error);
    
    // Console'a logla
    const logMessage = `[${error.level.toUpperCase()}] ${error.code}: ${error.message}`;
    
    switch (error.level) {
      case ErrorLevel.INFO:
        console.info(logMessage, error.details);
        break;
      case ErrorLevel.WARNING:
        console.warn(logMessage, error.details);
        break;
      case ErrorLevel.ERROR:
        console.error(logMessage, error.details);
        break;
      case ErrorLevel.CRITICAL:
        console.error(`🚨 CRITICAL ERROR 🚨 ${logMessage}`, error.details);
        break;
    }

    // Kritik hatalar için ek işlemler
    if (error.level === ErrorLevel.CRITICAL) {
      this.handleCriticalError(error);
    }
  }

  // Kritik hata işleme
  private handleCriticalError(error: PaymentError): void {
    // Kritik hatalar için:
    // 1. Admin'e bildirim gönder
    // 2. Monitoring sistemine alert gönder
    // 3. Hata raporu oluştur
    
    console.error('[CRITICAL_ERROR] Handling critical error:', error);
    
    // TODO: Gerçek uygulamada burada:
    // - Email/SMS bildirimi
    // - Slack/Discord webhook
    // - Error tracking service (Sentry, Bugsnag)
    // - Database'e kaydet
  }

  // Hata geçmişini al
  getErrorHistory(limit: number = 100): PaymentError[] {
    return this.errorLog.slice(-limit);
  }

  // Belirli kategorideki hataları al
  getErrorsByCategory(category: ErrorCategory): PaymentError[] {
    return this.errorLog.filter(error => error.category === category);
  }

  // Belirli seviyedeki hataları al
  getErrorsByLevel(level: ErrorLevel): PaymentError[] {
    return this.errorLog.filter(error => error.level === level);
  }

  // Hata istatistikleri
  getErrorStatistics(): {
    total: number;
    byLevel: Record<ErrorLevel, number>;
    byCategory: Record<ErrorCategory, number>;
    recentErrors: PaymentError[];
  } {
    const total = this.errorLog.length;
    const byLevel = Object.values(ErrorLevel).reduce((acc, level) => {
      acc[level] = this.getErrorsByLevel(level).length;
      return acc;
    }, {} as Record<ErrorLevel, number>);
    
    const byCategory = Object.values(ErrorCategory).reduce((acc, category) => {
      acc[category] = this.getErrorsByCategory(category).length;
      return acc;
    }, {} as Record<ErrorCategory, number>);
    
    const recentErrors = this.errorLog.slice(-10);

    return {
      total,
      byLevel,
      byCategory,
      recentErrors
    };
  }

  // Hata temizleme (eski logları sil)
  clearOldErrors(olderThanDays: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    this.errorLog = this.errorLog.filter(error => error.timestamp > cutoffDate);
  }
}

// Hata yöneticisi instance'ı
export const errorManager = PaymentErrorManager.getInstance();

// Yardımcı fonksiyonlar
export const createPaymentError = (
  code: string,
  message: string,
  level: ErrorLevel = ErrorLevel.ERROR,
  category: ErrorCategory = ErrorCategory.PAYMENT,
  details?: any
) => errorManager.createError(code, message, level, category, details);

export const translatePaymentError = (errorCode: string, originalMessage?: string) =>
  errorManager.translatePaymentError(errorCode, originalMessage);

// Ödeme API çağrıları için hata yakalama wrapper'ı
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: {
    operation: string;
    userId?: string;
    paymentId?: string;
    deviceId?: string;
  }
): Promise<{ success: boolean; data?: T; error?: PaymentError }> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const paymentError = createPaymentError(
      '1001', // Bilinmeyen hata
      error instanceof Error ? error.message : 'Unknown error',
      ErrorLevel.ERROR,
      ErrorCategory.SYSTEM,
      {
        operation: context.operation,
        userId: context.userId,
        paymentId: context.paymentId,
        deviceId: context.deviceId,
        originalError: error
      }
    );

    return { success: false, error: paymentError };
  }
};

// Validation hataları için özel fonksiyonlar
export const validatePaymentData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.amount || data.amount <= 0) {
    errors.push('Geçerli bir ödeme tutarı giriniz');
  }

  if (!data.buyerInfo?.email) {
    errors.push('E-posta adresi gereklidir');
  }

  if (!data.buyerInfo?.phone) {
    errors.push('Telefon numarası gereklidir');
  }

  if (!data.basketItems || data.basketItems.length === 0) {
    errors.push('En az bir ürün seçmelisiniz');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Hata raporu oluşturma
export const generateErrorReport = (): string => {
  const stats = errorManager.getErrorStatistics();
  const recentErrors = stats.recentErrors;

  return `
Ödeme Sistemi - Hata Raporu
=====================================

Toplam Hata Sayısı: ${stats.total}

Hata Seviyeleri:
${Object.entries(stats.byLevel).map(([level, count]) => `  ${level}: ${count}`).join('\n')}

Hata Kategorileri:
${Object.entries(stats.byCategory).map(([category, count]) => `  ${category}: ${count}`).join('\n')}

Son 10 Hata:
${recentErrors.map(error => 
  `  [${error.timestamp.toISOString()}] ${error.code}: ${error.message}`
).join('\n')}

Rapor Oluşturulma Tarihi: ${new Date().toISOString()}
  `;
};
