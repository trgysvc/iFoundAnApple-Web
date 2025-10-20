// utils/profileValidation.ts
import { UserProfile } from '../types.ts';

export interface ProfileValidationResult {
  isValid: boolean;
  missingFields: string[];
  message: string;
}

/**
 * Kullanıcı profilinin ödeme için tamamlanıp tamamlanmadığını kontrol eder
 */
export const validateProfileForPayment = (profile: UserProfile | null): ProfileValidationResult => {
  if (!profile) {
    return {
      isValid: false,
      missingFields: ['Profil bulunamadı'],
      message: 'Profil bilgileriniz bulunamadı. Lütfen profil sayfasından bilgilerinizi tamamlayın.'
    };
  }

  const requiredFields = [
    { key: 'first_name', label: 'Ad' },
    { key: 'last_name', label: 'Soyad' },
    { key: 'date_of_birth', label: 'Doğum Tarihi' },
    { key: 'tc_kimlik_no', label: 'TC Kimlik Numarası' },
    { key: 'phone_number', label: 'Telefon Numarası' },
    { key: 'address', label: 'Adres' }
  ];

  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    const value = profile[field.key as keyof UserProfile];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field.label);
    }
  });

  // TC Kimlik numarası format kontrolü
  if (profile.tc_kimlik_no && !isValidTCKimlikNo(profile.tc_kimlik_no)) {
    missingFields.push('TC Kimlik Numarası (geçersiz format)');
  }

  // Telefon numarası format kontrolü
  if (profile.phone_number && !isValidPhoneNumber(profile.phone_number)) {
    missingFields.push('Telefon Numarası (geçersiz format)');
  }

  const isValid = missingFields.length === 0;

  return {
    isValid,
    missingFields,
    message: isValid 
      ? 'Profil bilgileriniz tamamlanmış. Ödeme yapabilirsiniz.'
      : 'Profil bilgilerinizi tamamlayınız. Lütfen tekrar deneyin.'
  };
};

/**
 * TC Kimlik numarası doğrulama
 */
const isValidTCKimlikNo = (tcNo: string): boolean => {
  // TC Kimlik numarası 11 haneli olmalı ve sadece rakam içermeli
  if (!/^\d{11}$/.test(tcNo)) {
    return false;
  }

  // TC Kimlik numarası algoritması kontrolü
  const digits = tcNo.split('').map(Number);
  
  // İlk 10 hanenin toplamının mod 10'u 11. haneye eşit olmalı
  const sum = digits.slice(0, 10).reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);
  
  const checkDigit = sum % 10;
  return checkDigit === digits[10];
};

/**
 * Telefon numarası doğrulama
 */
const isValidPhoneNumber = (phone: string): boolean => {
  // Türkiye telefon numarası formatı: +90XXXXXXXXXX veya 0XXXXXXXXXX
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Profil tamamlama yüzdesini hesaplar
 */
export const getProfileCompletionPercentage = (profile: UserProfile | null): number => {
  if (!profile) return 0;

  const totalFields = 6; // Zorunlu alan sayısı
  let completedFields = 0;

  if (profile.first_name?.trim()) completedFields++;
  if (profile.last_name?.trim()) completedFields++;
  if (profile.date_of_birth?.trim()) completedFields++;
  if (profile.tc_kimlik_no?.trim()) completedFields++;
  if (profile.phone_number?.trim()) completedFields++;
  if (profile.address?.trim()) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};
