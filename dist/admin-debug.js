// Admin Panel Debug Script
// Browser console'da çalıştırın

console.log('🔍 ADMIN PANEL DEBUG SCRIPT');
console.log('============================');

// 1. Current User Kontrolü
const currentUser = window.currentUser || null;
console.log('👤 Current User:', currentUser);

if (currentUser) {
  console.log('📧 Email:', currentUser.email);
  console.log('🆔 ID:', currentUser.id);
  console.log('👑 Role:', currentUser.role);
  console.log('📝 Full Name:', currentUser.fullName);
  
  // 2. Admin Yetki Kontrolü
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';
  console.log('🔐 Is Admin:', isAdmin);
  
  if (isAdmin) {
    console.log('✅ Admin yetkisi var!');
    console.log('🎯 Admin paneli erişilebilir olmalı');
  } else {
    console.log('❌ Admin yetkisi yok!');
    console.log('🚫 Admin paneli erişilemez olmalı');
  }
} else {
  console.log('❌ Kullanıcı giriş yapmamış');
  console.log('🔑 Önce login yapın');
}

// 3. URL Kontrolü
console.log('🌐 Current URL:', window.location.href);
console.log('📍 Pathname:', window.location.pathname);

// 4. Admin Route Kontrolü
if (window.location.pathname.startsWith('/admin')) {
  console.log('🎯 Admin sayfasındasınız');
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')) {
    console.log('✅ Admin yetkisi ile admin sayfasına erişim başarılı');
  } else {
    console.log('❌ Admin yetkisi olmadan admin sayfasına erişim hatası');
  }
}

// 5. Local Storage Kontrolü
const authToken = localStorage.getItem('sb-localhost-auth-token');
console.log('🔑 Auth Token:', authToken ? 'Mevcut' : 'Yok');

// 6. Supabase Client Kontrolü
if (window.supabase) {
  console.log('✅ Supabase client mevcut');
} else {
  console.log('❌ Supabase client bulunamadı');
}

// 7. Test Fonksiyonları
window.testAdminAccess = function() {
  console.log('🧪 Admin erişim testi başlatılıyor...');
  
  if (!currentUser) {
    console.log('❌ Test başarısız: Kullanıcı giriş yapmamış');
    return false;
  }
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
    console.log('❌ Test başarısız: Admin yetkisi yok');
    return false;
  }
  
  console.log('✅ Test başarılı: Admin yetkisi mevcut');
  return true;
};

window.testAdminPages = function() {
  console.log('🧪 Admin sayfaları testi başlatılıyor...');
  
  const adminPages = [
    '/admin',
    '/admin/users',
    '/admin/devices',
    '/admin/payments',
    '/admin/escrow',
    '/admin/cargo',
    '/admin/logs',
    '/admin/reports',
    '/admin/permissions',
    '/admin/settings'
  ];
  
  adminPages.forEach(page => {
    console.log(`🔗 Test ediliyor: ${page}`);
  });
  
  console.log('💡 Manuel olarak her sayfayı ziyaret edin');
};

console.log('============================');
console.log('🎯 Test fonksiyonları:');
console.log('   testAdminAccess() - Admin yetki testi');
console.log('   testAdminPages() - Admin sayfaları testi');
console.log('============================');
