-- Database'deki "paid" status'unu "payment_completed" olarak güncelle
UPDATE devices 
SET status = 'payment_completed', 
    updated_at = NOW()
WHERE status = 'paid';

-- Güncellenen kayıtları kontrol et
SELECT id, "serialNumber", status, updated_at 
FROM devices 
WHERE status = 'payment_completed' 
ORDER BY updated_at DESC;
