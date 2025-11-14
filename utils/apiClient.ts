/**
 * Backend API Client
 * Supabase JWT token ile authenticated istekler için
 */

import { supabase } from './supabaseClient';

// Backend API Base URL
const getBackendBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/v1';
  }
  return import.meta.env.VITE_BACKEND_API_URL || 'https://api.ifoundanapple.com/v1';
};

const BACKEND_BASE_URL = getBackendBaseUrl();

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp?: string;
  path?: string;
}

/**
 * API Client - Supabase JWT token ile authenticated istekler
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Supabase JWT token'ı al
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('[API] Token alma hatası:', error);
      return null;
    }
  }

  /**
   * API isteği yap
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Token varsa Authorization header'ına ekle
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`[API] ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 401 Unauthorized - Token geçersiz veya süresi dolmuş
      if (response.status === 401) {
        console.error('[API] 401 Unauthorized - Token geçersiz');
        // Kullanıcıyı logout yap
        await supabase.auth.signOut();
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      // Response'u parse et (JSON olmayabilir)
      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          // Debug: Hata durumunda backend'den gelen yanıtı logla
          if (!response.ok) {
            console.log('[API] Backend hata yanıtı:', JSON.stringify(data, null, 2));
          }
        } catch (parseError) {
          console.error('[API] JSON parse hatası:', parseError);
          const error: ApiError = {
            statusCode: response.status,
            message: `Backend API yanıtı geçersiz (${response.status}): ${response.statusText}`,
            path: endpoint,
          };
          throw error;
        }
      } else {
        // JSON değilse text olarak oku
        const text = await response.text();
        console.warn('[API] JSON olmayan yanıt:', text.substring(0, 100));
        const error: ApiError = {
          statusCode: response.status,
          message: `Backend API beklenmeyen yanıt döndü (${response.status}): ${response.statusText}`,
          path: endpoint,
        };
        throw error;
      }

      // Hata durumunda (tüm HTTP error status kodları)
      if (!response.ok) {
        // Backend'den gelen hata mesajını kullan
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        
        // Özel durumlar için daha anlaşılır mesajlar
        let userFriendlyMessage = errorMessage;
        if (response.status === 404) {
          if (errorMessage.includes('Device model not found') || errorMessage.includes('model')) {
            userFriendlyMessage = 'Cihaz modeli bulunamadı. Lütfen cihaz bilgilerini kontrol edin.';
          } else {
            userFriendlyMessage = 'İstenen kaynak bulunamadı. Lütfen bilgileri kontrol edin.';
          }
        } else if (response.status === 400) {
          // Backend'den gelen 400 hataları için özel mesajlar
          if (errorMessage.includes('must be in') && errorMessage.includes('status')) {
            userFriendlyMessage = 'Cihaz durumu uygun değil. Lütfen cihaz durumunu kontrol edin.';
          } else if (errorMessage.includes('Amount mismatch') || errorMessage.includes('amount')) {
            userFriendlyMessage = 'Tutar uyuşmazlığı. Lütfen tutarı kontrol edin.';
          } else {
            userFriendlyMessage = errorMessage || 'Geçersiz istek. Lütfen bilgileri kontrol edin.';
          }
        } else if (response.status === 500) {
          userFriendlyMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        
        const apiError: ApiError = {
          statusCode: response.status,
          message: userFriendlyMessage,
          timestamp: data?.timestamp,
          path: data?.path || endpoint,
        };
        // ApiError'ı Error'a çevir ki catch bloğunda yakalanabilsin
        const error = new Error(apiError.message);
        (error as any).statusCode = apiError.statusCode;
        (error as any).timestamp = apiError.timestamp;
        (error as any).path = apiError.path;
        throw error;
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`[API] İstek hatası (${endpoint}):`, error.message);
        // Network hatası (CORS, connection refused, vb.)
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Backend API\'ye bağlanılamıyor. Lütfen backend API\'nin çalıştığından emin olun.');
        }
        throw error;
      }
      throw new Error('Bilinmeyen API hatası');
    }
  }

  /**
   * GET isteği
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST isteği
   */
  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT isteği
   */
  async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE isteği
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Export default
export default apiClient;

