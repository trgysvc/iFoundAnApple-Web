-- Mevcut device_models tablosunun yapısını kontrol et
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'device_models' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Mevcut verileri kontrol et
SELECT 
    name,
    category,
    apple_exchange_price,
    reward_percentage,
    min_reward_amount,
    max_reward_amount,
    cargo_fee,
    is_active
FROM device_models 
WHERE is_active = true
ORDER BY category, name
LIMIT 10;
