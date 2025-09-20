-- Complete Apple Device Models List - FIXED VERSION
-- Bu script tüm Apple cihazlarını device_models tablosuna ekler
-- Doğru tablo yapısı: (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee)

-- iPhone Modelleri (2007-2024)
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
-- iPhone (Original - 2024) - Eski modeller, fiyat belirlenmemiş (0.00)
('Apple', 'iPhone', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 3G', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 3GS', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 4', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 4S', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 5', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 5c', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 5s', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 6', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 6 Plus', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 6s', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 6s Plus', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone SE (1st generation)', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 7', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 7 Plus', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 8', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 8 Plus', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone X', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone XR', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone XS', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone XS Max', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),

-- iPhone 11-16 serisi (bazıları zaten mevcut, ON CONFLICT ile korunacak)
('Apple', 'iPhone 11', 'iPhone', 28000.00, 15.00, 250.00, 3500.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 11 Pro', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 11 Pro Max', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone SE (2nd generation)', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 12 mini', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 12', 'iPhone', 22000.00, 15.00, 200.00, 2800.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 12 Pro', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 12 Pro Max', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 13 mini', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 13', 'iPhone', 28000.00, 15.00, 250.00, 3500.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 13 Pro', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 13 Pro Max', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone SE (3rd generation)', 'iPhone', 0.00, 15.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 14', 'iPhone', 35000.00, 16.00, 300.00, 4500.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 14 Plus', 'iPhone', 0.00, 16.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 14 Pro', 'iPhone', 42000.00, 18.00, 350.00, 5500.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 14 Pro Max', 'iPhone', 50000.00, 18.00, 400.00, 6500.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 15', 'iPhone', 45000.00, 18.00, 400.00, 6000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 15 Plus', 'iPhone', 0.00, 18.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 15 Pro', 'iPhone', 55000.00, 20.00, 500.00, 7000.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPhone 15 Pro Max', 'iPhone', 65000.00, 20.00, 500.00, 8000.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPhone 16', 'iPhone', 0.00, 18.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 16 Plus', 'iPhone', 0.00, 18.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 16 Pro', 'iPhone', 0.00, 20.00, 100.00, 7000.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPhone 16 Pro Max', 'iPhone', 0.00, 20.00, 100.00, 8000.00, 30.00, true, NOW(), NOW())

ON CONFLICT (brand, model) DO NOTHING;

-- iPad Modelleri (2010-2024)
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
-- iPad Original ve Air Serisi
('Apple', 'iPad (1st generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad 2', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (3rd generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (4th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad Air', 'iPad', 20000.00, 16.00, 200.00, 2500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad Air 2', 'iPad', 0.00, 16.00, 100.00, 2500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (5th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (6th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad Air (3rd generation)', 'iPad', 0.00, 16.00, 100.00, 2500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (7th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (8th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad Air (4th generation)', 'iPad', 0.00, 16.00, 100.00, 2500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (9th generation)', 'iPad', 12000.00, 15.00, 150.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad Air (5th generation)', 'iPad', 0.00, 16.00, 100.00, 2500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad (10th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad Air 11-inch (M2)', 'iPad', 0.00, 18.00, 100.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Air 13-inch (M2)', 'iPad', 0.00, 18.00, 100.00, 3500.00, 35.00, true, NOW(), NOW()),

-- iPad Mini Serisi
('Apple', 'iPad mini', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad mini 2', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad mini 3', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad mini 4', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad mini (5th generation)', 'iPad', 0.00, 15.00, 100.00, 1500.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPad mini (6th generation)', 'iPad', 0.00, 16.00, 100.00, 2000.00, 30.00, true, NOW(), NOW()),

-- iPad Pro Serisi
('Apple', 'iPad Pro 12.9-inch (1st generation)', 'iPad', 0.00, 18.00, 100.00, 4500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 9.7-inch', 'iPad', 0.00, 18.00, 100.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 12.9-inch (2nd generation)', 'iPad', 0.00, 18.00, 100.00, 4500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 10.5-inch', 'iPad', 28000.00, 18.00, 250.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 11-inch (1st generation)', 'iPad', 0.00, 18.00, 100.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 12.9-inch (3rd generation)', 'iPad', 0.00, 18.00, 100.00, 4500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 11-inch (2nd generation)', 'iPad', 28000.00, 18.00, 250.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 12.9-inch (4th generation)', 'iPad', 35000.00, 18.00, 300.00, 4500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 11-inch (3rd generation)', 'iPad', 0.00, 18.00, 100.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 12.9-inch (5th generation)', 'iPad', 0.00, 18.00, 100.00, 4500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 11-inch (4th generation)', 'iPad', 0.00, 18.00, 100.00, 3500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 12.9-inch (6th generation)', 'iPad', 0.00, 18.00, 100.00, 4500.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 11-inch (M4)', 'iPad', 0.00, 20.00, 100.00, 4000.00, 35.00, true, NOW(), NOW()),
('Apple', 'iPad Pro 13-inch (M4)', 'iPad', 0.00, 20.00, 100.00, 5000.00, 35.00, true, NOW(), NOW())

ON CONFLICT (brand, model) DO NOTHING;

-- Apple Watch Modelleri (2015-2024)
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
('Apple', 'Apple Watch (1st generation)', 'Apple Watch', 0.00, 14.00, 100.00, 1000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 1', 'Apple Watch', 0.00, 14.00, 100.00, 1000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 2', 'Apple Watch', 0.00, 14.00, 100.00, 1000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 3', 'Apple Watch', 0.00, 14.00, 100.00, 1000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 4', 'Apple Watch', 0.00, 15.00, 100.00, 1500.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 5', 'Apple Watch', 0.00, 15.00, 100.00, 1500.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch SE (1st generation)', 'Apple Watch', 8000.00, 14.00, 100.00, 1000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 6', 'Apple Watch', 0.00, 15.00, 100.00, 2000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 7', 'Apple Watch', 0.00, 15.00, 100.00, 2000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch SE (2nd generation)', 'Apple Watch', 0.00, 14.00, 100.00, 1000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 8', 'Apple Watch', 0.00, 15.00, 100.00, 2000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Ultra', 'Apple Watch', 25000.00, 16.00, 200.00, 3000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 9', 'Apple Watch', 15000.00, 15.00, 150.00, 2000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Ultra 2', 'Apple Watch', 0.00, 16.00, 100.00, 3000.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple Watch Series 10', 'Apple Watch', 0.00, 15.00, 100.00, 2000.00, 20.00, true, NOW(), NOW())

ON CONFLICT (brand, model) DO NOTHING;

-- AirPods ve Audio Modelleri (2016-2024)
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
('Apple', 'AirPods (1st generation)', 'AirPods', 0.00, 12.00, 60.00, 400.00, 15.00, true, NOW(), NOW()),
('Apple', 'AirPods (2nd generation)', 'AirPods', 4000.00, 12.00, 60.00, 400.00, 15.00, true, NOW(), NOW()),
('Apple', 'AirPods (3rd generation)', 'AirPods', 5500.00, 13.00, 80.00, 600.00, 15.00, true, NOW(), NOW()),
('Apple', 'AirPods Pro (1st generation)', 'AirPods', 0.00, 14.00, 100.00, 800.00, 15.00, true, NOW(), NOW()),
('Apple', 'AirPods Pro (2nd generation)', 'AirPods', 8000.00, 14.00, 100.00, 800.00, 15.00, true, NOW(), NOW()),
('Apple', 'AirPods Max', 'AirPods', 20000.00, 16.00, 200.00, 2500.00, 25.00, true, NOW(), NOW()),
('Apple', 'AirPods Pro 2 (USB-C)', 'AirPods', 0.00, 14.00, 100.00, 800.00, 15.00, true, NOW(), NOW())

ON CONFLICT (brand, model) DO NOTHING;

-- MacBook Modelleri (Seçilmiş önemli modeller)
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
-- MacBook Air
('Apple', 'MacBook Air 13-inch (M1, 2020)', 'MacBook', 0.00, 20.00, 350.00, 5500.00, 45.00, true, NOW(), NOW()),
('Apple', 'MacBook Air 13-inch (M2, 2022)', 'MacBook', 0.00, 20.00, 350.00, 5500.00, 45.00, true, NOW(), NOW()),
('Apple', 'MacBook Air 15-inch (M2, 2023)', 'MacBook', 45000.00, 20.00, 450.00, 7000.00, 45.00, true, NOW(), NOW()),
('Apple', 'MacBook Air 13-inch (M3, 2024)', 'MacBook', 35000.00, 20.00, 350.00, 5500.00, 45.00, true, NOW(), NOW()),
('Apple', 'MacBook Air 15-inch (M3, 2024)', 'MacBook', 0.00, 20.00, 450.00, 7000.00, 45.00, true, NOW(), NOW()),

-- MacBook Pro
('Apple', 'MacBook Pro 13-inch (M1, 2020)', 'MacBook', 0.00, 22.00, 400.00, 6000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 14-inch (M1 Pro, 2021)', 'MacBook', 65000.00, 22.00, 650.00, 10000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 16-inch (M1 Pro, 2021)', 'MacBook', 80000.00, 22.00, 800.00, 12000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 13-inch (M2, 2022)', 'MacBook', 0.00, 22.00, 400.00, 6000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 14-inch (M2 Pro, 2023)', 'MacBook', 0.00, 22.00, 650.00, 10000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 16-inch (M2 Pro, 2023)', 'MacBook', 0.00, 22.00, 800.00, 12000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 14-inch (M3, 2023)', 'MacBook', 0.00, 22.00, 650.00, 10000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 16-inch (M3, 2023)', 'MacBook', 0.00, 22.00, 800.00, 12000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 14-inch (M4, 2024)', 'MacBook', 0.00, 22.00, 650.00, 10000.00, 50.00, true, NOW(), NOW()),
('Apple', 'MacBook Pro 16-inch (M4, 2024)', 'MacBook', 0.00, 22.00, 800.00, 12000.00, 50.00, true, NOW(), NOW())

ON CONFLICT (brand, model) DO NOTHING;

-- Apple TV ve Diğer Cihazlar
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
('Apple', 'Apple TV HD', 'Apple TV', 0.00, 12.00, 50.00, 300.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple TV 4K (1st generation)', 'Apple TV', 0.00, 12.00, 50.00, 500.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple TV 4K (2nd generation)', 'Apple TV', 0.00, 12.00, 50.00, 500.00, 20.00, true, NOW(), NOW()),
('Apple', 'Apple TV 4K (3rd generation)', 'Apple TV', 0.00, 12.00, 50.00, 500.00, 20.00, true, NOW(), NOW()),

-- iPod (tarihi modeller)
('Apple', 'iPod Touch (7th generation)', 'iPod', 0.00, 12.00, 50.00, 300.00, 15.00, true, NOW(), NOW()),

-- Apple Pencil ve Aksesuarlar
('Apple', 'Apple Pencil (1st generation)', 'Accessory', 0.00, 10.00, 30.00, 200.00, 15.00, true, NOW(), NOW()),
('Apple', 'Apple Pencil (2nd generation)', 'Accessory', 0.00, 10.00, 30.00, 200.00, 15.00, true, NOW(), NOW()),
('Apple', 'Apple Pencil (USB-C)', 'Accessory', 0.00, 10.00, 30.00, 200.00, 15.00, true, NOW(), NOW()),
('Apple', 'Apple Pencil Pro', 'Accessory', 0.00, 10.00, 30.00, 200.00, 15.00, true, NOW(), NOW()),
('Apple', 'Magic Mouse 2', 'Accessory', 0.00, 10.00, 30.00, 150.00, 15.00, true, NOW(), NOW()),
('Apple', 'Magic Trackpad 2', 'Accessory', 0.00, 10.00, 30.00, 200.00, 15.00, true, NOW(), NOW()),
('Apple', 'Magic Keyboard', 'Accessory', 0.00, 10.00, 30.00, 200.00, 15.00, true, NOW(), NOW()),

-- AirTag
('Apple', 'AirTag', 'AirTag', 0.00, 10.00, 20.00, 50.00, 10.00, true, NOW(), NOW())

ON CONFLICT (brand, model) DO NOTHING;

-- Sonuç raporu
SELECT 
    category,
    COUNT(*) as model_count,
    COUNT(CASE WHEN apple_exchange_price > 0 THEN 1 END) as models_with_price,
    COUNT(CASE WHEN apple_exchange_price = 0 THEN 1 END) as models_without_price
FROM device_models 
WHERE is_active = true
GROUP BY category
ORDER BY model_count DESC;

SELECT 
    'Toplam Model Sayısı' as info,
    COUNT(*) as count
FROM device_models 
WHERE is_active = true;
