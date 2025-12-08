/**
 * Kart Bilgileri Validation Utility
 * PAYNET API formatına uygun validation kuralları
 */

export interface CardValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Kart numarası validation
 * Format: 13-19 haneli, sadece rakam
 */
export const validateCardNumber = (pan: string): CardValidationResult => {
  // Boşlukları temizle
  const cleanedPan = pan.replace(/\s/g, '');
  
  if (!cleanedPan) {
    return { isValid: false, error: 'Kart numarası boş olamaz' };
  }
  
  // Sadece rakam kontrolü
  if (!/^\d+$/.test(cleanedPan)) {
    return { isValid: false, error: 'Kart numarası sadece rakam içermelidir' };
  }
  
  // Uzunluk kontrolü (13-19 haneli)
  if (cleanedPan.length < 13 || cleanedPan.length > 19) {
    return { isValid: false, error: 'Kart numarası 13-19 haneli olmalıdır' };
  }
  
  return { isValid: true };
};

/**
 * Kart numarasını formatla (4'lü gruplar halinde)
 */
export const formatCardNumber = (value: string): string => {
  // Sadece rakamları al
  const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
  
  // 4'lü gruplar halinde ayır
  const groups = cleaned.match(/.{1,4}/g);
  if (!groups) return cleaned;
  
  return groups.join(' ').trim();
};

/**
 * Ay validation
 * Format: MM (01-12)
 */
export const validateMonth = (month: string): CardValidationResult => {
  if (!month) {
    return { isValid: false, error: 'Ay boş olamaz' };
  }
  
  // Sadece rakam kontrolü
  if (!/^\d+$/.test(month)) {
    return { isValid: false, error: 'Ay sadece rakam içermelidir' };
  }
  
  // 01-12 aralığı kontrolü
  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, error: 'Ay 01-12 arasında olmalıdır' };
  }
  
  // 2 haneli format kontrolü
  if (month.length !== 2) {
    return { isValid: false, error: 'Ay 2 haneli olmalıdır (ör: 12)' };
  }
  
  return { isValid: true };
};

/**
 * Ay input formatla (2 haneli)
 */
export const formatMonth = (value: string): string => {
  // Sadece rakamları al
  const cleaned = value.replace(/\D/g, '');
  
  // En fazla 2 karakter
  if (cleaned.length > 2) {
    return cleaned.substring(0, 2);
  }
  
  // Tek haneli ise başına 0 ekle
  if (cleaned.length === 1 && parseInt(cleaned, 10) > 1) {
    return `0${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Yıl validation
 * Format: YY (25) veya YYYY (2025)
 */
export const validateYear = (year: string): CardValidationResult => {
  if (!year) {
    return { isValid: false, error: 'Yıl boş olamaz' };
  }
  
  // Sadece rakam kontrolü
  if (!/^\d+$/.test(year)) {
    return { isValid: false, error: 'Yıl sadece rakam içermelidir' };
  }
  
  const currentYear = new Date().getFullYear();
  const currentYear2Digit = currentYear % 100;
  
  // 2 haneli format (YY)
  if (year.length === 2) {
    const yearNum = parseInt(year, 10);
    if (yearNum < currentYear2Digit) {
      return { isValid: false, error: 'Geçmiş bir yıl seçilemez' };
    }
    return { isValid: true };
  }
  
  // 4 haneli format (YYYY)
  if (year.length === 4) {
    const yearNum = parseInt(year, 10);
    if (yearNum < currentYear) {
      return { isValid: false, error: 'Geçmiş bir yıl seçilemez' };
    }
    if (yearNum > currentYear + 20) {
      return { isValid: false, error: 'Gelecek yıl çok ileri bir tarih' };
    }
    return { isValid: true };
  }
  
  return { isValid: false, error: 'Yıl 2 haneli (25) veya 4 haneli (2025) olmalıdır' };
};

/**
 * Yıl input formatla
 */
export const formatYear = (value: string): string => {
  // Sadece rakamları al
  const cleaned = value.replace(/\D/g, '');
  
  // En fazla 4 karakter
  if (cleaned.length > 4) {
    return cleaned.substring(0, 4);
  }
  
  return cleaned;
};

/**
 * Son kullanma tarihi kontrolü (ay ve yıl birlikte)
 */
export const validateExpiryDate = (month: string, year: string): CardValidationResult => {
  const monthResult = validateMonth(month);
  if (!monthResult.isValid) {
    return monthResult;
  }
  
  const yearResult = validateYear(year);
  if (!yearResult.isValid) {
    return yearResult;
  }
  
  // Geçmiş tarih kontrolü
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  
  let expiryYear: number;
  if (year.length === 2) {
    // 2 haneli yıl: YY formatı
    const year2Digit = parseInt(year, 10);
    expiryYear = 2000 + year2Digit;
  } else {
    // 4 haneli yıl: YYYY formatı
    expiryYear = parseInt(year, 10);
  }
  
  const expiryMonth = parseInt(month, 10);
  
  // Geçmiş tarih kontrolü
  if (expiryYear < currentYear) {
    return { isValid: false, error: 'Kartın son kullanma tarihi geçmiş' };
  }
  
  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return { isValid: false, error: 'Kartın son kullanma tarihi geçmiş' };
  }
  
  return { isValid: true };
};

/**
 * CVV/CVC validation
 * Format: 3-4 haneli, sadece rakam
 */
export const validateCVC = (cvc: string): CardValidationResult => {
  if (!cvc) {
    return { isValid: false, error: 'CVV boş olamaz' };
  }
  
  // Sadece rakam kontrolü
  if (!/^\d+$/.test(cvc)) {
    return { isValid: false, error: 'CVV sadece rakam içermelidir' };
  }
  
  // Uzunluk kontrolü (3-4 haneli)
  if (cvc.length < 3 || cvc.length > 4) {
    return { isValid: false, error: 'CVV 3 veya 4 haneli olmalıdır' };
  }
  
  return { isValid: true };
};

/**
 * CVV input formatla
 */
export const formatCVC = (value: string): string => {
  // Sadece rakamları al, en fazla 4 karakter
  return value.replace(/\D/g, '').substring(0, 4);
};

/**
 * Kart sahibi adı validation
 * Format: Boş olamaz, minimum 2 karakter, harf ve boşluk karakterleri
 */
export const validateCardHolder = (cardHolder: string): CardValidationResult => {
  if (!cardHolder || cardHolder.trim().length === 0) {
    return { isValid: false, error: 'Kart sahibi adı boş olamaz' };
  }
  
  const trimmed = cardHolder.trim();
  
  // Minimum uzunluk kontrolü
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Kart sahibi adı en az 2 karakter olmalıdır' };
  }
  
  // Harf, boşluk ve bazı özel karakterler (örn: ' - .)
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s'\-\.]+$/.test(trimmed)) {
    return { isValid: false, error: 'Kart sahibi adı sadece harf, boşluk ve bazı özel karakterler içerebilir' };
  }
  
  return { isValid: true };
};

/**
 * Kart sahibi adını formatla (büyük harfe çevir)
 */
export const formatCardHolder = (value: string): string => {
  return value.toUpperCase().trim();
};

/**
 * Tüm kart bilgilerini validate et
 */
export interface CardData {
  pan: string;
  month: string;
  year: string;
  cvc: string;
  cardHolder: string;
}

export const validateCardData = (cardData: CardData): CardValidationResult => {
  // Kart numarası
  const panResult = validateCardNumber(cardData.pan);
  if (!panResult.isValid) {
    return panResult;
  }
  
  // Son kullanma tarihi (ay ve yıl birlikte)
  const expiryResult = validateExpiryDate(cardData.month, cardData.year);
  if (!expiryResult.isValid) {
    return expiryResult;
  }
  
  // CVV
  const cvcResult = validateCVC(cardData.cvc);
  if (!cvcResult.isValid) {
    return cvcResult;
  }
  
  // Kart sahibi adı
  const cardHolderResult = validateCardHolder(cardData.cardHolder);
  if (!cardHolderResult.isValid) {
    return cardHolderResult;
  }
  
  return { isValid: true };
};
