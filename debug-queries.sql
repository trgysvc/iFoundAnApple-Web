-- ================================================
-- ART998877 Cihazı İçin Debug Sorguları
-- ================================================

-- 1. Devices tablosundaki kayıt
SELECT 
    id, 
    "serialNumber", 
    status, 
    "userId", 
    model, 
    created_at, 
    updated_at
FROM devices 
WHERE "serialNumber" = 'ART998877';

-- ================================================

-- 2. Payments tablosundaki kayıt
SELECT 
    p.id, 
    p.device_id, 
    p.status, 
    p.payment_status, 
    p.payer_id, 
    p.receiver_id, 
    p.total_amount, 
    p.created_at, 
    p.completed_at, 
    p.provider_status,
    p.escrow_status
FROM payments p
JOIN devices d ON p.device_id = d.id
WHERE d."serialNumber" = 'ART998877';

-- ================================================

-- 3. Tam bilgi - Kim bulan, kim kaybeden?
SELECT 
    d.id as device_id,
    d."serialNumber",
    d.status as device_status,
    d."userId" as device_owner_id,
    p.id as payment_id,
    p.payer_id,
    p.receiver_id,
    p.status as payment_status,
    p.payment_status as detailed_payment_status,
    p.escrow_status,
    p.completed_at,
    CASE 
        WHEN d.status = 'lost' THEN 'Cihaz Sahibi (Ödeme Yapan)'
        WHEN d.status = 'reported' THEN 'Bulan Kişi'
        ELSE d.status
    END as user_role
FROM devices d
LEFT JOIN payments p ON p.device_id = d.id
WHERE d."serialNumber" = 'ART998877';

-- ================================================

-- 4. Kullanıcı bilgileri
SELECT 
    d."serialNumber",
    d.status as device_status,
    owner.id as owner_id,
    owner.email as owner_email,
    payer.id as payer_id,
    payer.email as payer_email,
    receiver.id as receiver_id,
    receiver.email as receiver_email
FROM devices d
LEFT JOIN payments p ON p.device_id = d.id
LEFT JOIN auth.users owner ON d."userId" = owner.id
LEFT JOIN auth.users payer ON p.payer_id = payer.id
LEFT JOIN auth.users receiver ON p.receiver_id = receiver.id
WHERE d."serialNumber" = 'ART998877';

-- ================================================

-- 5. Tüm durumları göster
SELECT 
    d."serialNumber",
    d.status as device_status,
    p.status as payment_status,
    p.payment_status as payment_detailed_status,
    p.escrow_status,
    p.provider_status,
    p.completed_at,
    d.updated_at as device_updated_at,
    p.updated_at as payment_updated_at
FROM devices d
LEFT JOIN payments p ON p.device_id = d.id
WHERE d."serialNumber" = 'ART998877';

