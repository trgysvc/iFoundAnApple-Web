const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Apple Developer bilgilerinizi buraya girin
const TEAM_ID = 'RDCY864LPJ';  // Apple Developer → Membership → Team ID
const KEY_ID = 'TJJV6X8CKM';
const SERVICE_ID = 'com.ifoundanapple.web';
const PRIVATE_KEY_PATH = path.join(__dirname, '../Downloads/AuthKey_TJJV6X8CKM.p8');

console.log('\n🍎 Apple Sign In - JWT Token Generator\n');

// Validasyon
if (TEAM_ID === 'YOUR_TEAM_ID') {
  console.error('❌ HATA: TEAM_ID girilmemiş!');
  console.log('\nTeam ID nasıl bulunur:');
  console.log('1. https://developer.apple.com/account/#!/membership/');
  console.log('2. Team ID alanını kopyalayın (10 karakter)\n');
  process.exit(1);
}

if (!fs.existsSync(PRIVATE_KEY_PATH)) {
  console.error('❌ HATA: .p8 dosyası bulunamadı!');
  console.log('Dosya yolu:', PRIVATE_KEY_PATH);
  console.log('Lütfen dosya yolunu düzeltin.\n');
  process.exit(1);
}

try {
  // Private key oku
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  
  // JWT payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: TEAM_ID,
    iat: now,
    exp: now + (86400 * 180), // 180 gün geçerli
    aud: 'https://appleid.apple.com',
    sub: SERVICE_ID
  };
  
  // JWT token oluştur
  const token = jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: KEY_ID
    }
  });
  
  console.log('✓ JWT Token oluşturuldu\n');
  console.log('─'.repeat(80));
  console.log('APPLE CLIENT SECRET (JWT):');
  console.log('─'.repeat(80));
  console.log(token);
  console.log('─'.repeat(80));
  console.log('\n📝 Bu token\'ı Supabase Dashboard\'da Apple Provider ayarlarında');
  console.log('   "Secret Key (for OAuth)" alanına yapıştırın.\n');
  console.log('⏱️  Token geçerlilik süresi: 180 gün\n');
  
  // Token'ı dosyaya kaydet
  const outputPath = path.join(__dirname, '../apple-jwt-token.txt');
  fs.writeFileSync(outputPath, token);
  console.log('✓ Token kaydedildi:', outputPath, '\n');
  
} catch (error) {
  console.error('❌ HATA:', error.message);
  process.exit(1);
}

