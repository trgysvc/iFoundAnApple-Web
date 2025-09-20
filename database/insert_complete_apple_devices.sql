-- Complete Apple Device Models List
-- Bu script tüm Apple cihazlarını device_models tablosuna ekler
-- Sadece ücretleri belli olmayanlar 0.00 olarak ayarlanmış
-- Mevcut ücretler korunmuş

-- iPhone Modelleri (2007-2024)
INSERT INTO device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee, is_active, created_at, updated_at) VALUES
-- iPhone (Original - 2024) - Eski modeller, fiyat belirlenmemiş
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
-- Bu modeller zaten mevcut ve ücretleri var, ON CONFLICT ile korunacak
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
('Apple', 'iPhone 14 Pro', 'iPhone', 0.00, 18.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 14 Pro Max', 'iPhone', 0.00, 18.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 15', 'iPhone', 45000.00, 18.00, 400.00, 6000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 15 Plus', 'iPhone', 0.00, 18.00, 100.00, 5000.00, 25.00, true, NOW(), NOW()),
('Apple', 'iPhone 15 Pro', 'iPhone', 0.00, 20.00, 100.00, 7000.00, 30.00, true, NOW(), NOW()),
('Apple', 'iPhone 15 Pro Max', 'iPhone', 0.00, 20.00, 100.00, 8000.00, 30.00, true, NOW(), NOW()),
('iPhone 16', 'iPhone', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPhone 16 Plus', 'iPhone', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPhone 16 Pro', 'iPhone', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPhone 16 Pro Max', 'iPhone', 0.00, 0.00, 0.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- iPad Modelleri (2010-2024)
INSERT INTO device_models (name, category, repair_price, ifoundanapple_fee, total_price, is_active, created_at, updated_at) VALUES
-- iPad Original ve Air Serisi
('iPad (1st generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad 2', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (3rd generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (4th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air 2', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (5th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (6th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air (3rd generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (7th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (8th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air (4th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (9th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air (5th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad (10th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air 11-inch (M2)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Air 13-inch (M2)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- iPad Mini Serisi
('iPad mini', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad mini 2', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad mini 3', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad mini 4', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad mini (5th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad mini (6th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- iPad Pro Serisi
('iPad Pro 12.9-inch (1st generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 9.7-inch', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (2nd generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 10.5-inch', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 11-inch (1st generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (3rd generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 11-inch (2nd generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (4th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 11-inch (3rd generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (5th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 11-inch (4th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (6th generation)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 11-inch (M4)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPad Pro 13-inch (M4)', 'iPad', 0.00, 0.00, 0.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Apple Watch Modelleri (2015-2024)
INSERT INTO device_models (name, category, repair_price, ifoundanapple_fee, total_price, is_active, created_at, updated_at) VALUES
-- Apple Watch Serisi
('Apple Watch (1st generation)', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 1', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 2', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 3', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 4', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 5', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch SE (1st generation)', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 6', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 7', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch SE (2nd generation)', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 8', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Ultra', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 9', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Ultra 2', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Watch Series 10', 'Apple Watch', 0.00, 0.00, 0.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- AirPods ve Audio Modelleri (2016-2024)
INSERT INTO device_models (name, category, repair_price, ifoundanapple_fee, total_price, is_active, created_at, updated_at) VALUES
-- AirPods Serisi
('AirPods (1st generation)', 'AirPods', 0.00, 0.00, 0.00, true, NOW(), NOW()),
-- Bu model zaten mevcut ve ücreti var, ON CONFLICT ile korunacak
('AirPods (2nd generation)', 'AirPods', 1100.00, 110.00, 1210.00, true, NOW(), NOW()),
('AirPods (3rd generation)', 'AirPods', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('AirPods Pro (1st generation)', 'AirPods', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('AirPods Pro (2nd generation)', 'AirPods', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('AirPods Max', 'AirPods', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('AirPods Pro 2 (USB-C)', 'AirPods', 0.00, 0.00, 0.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Mac Modelleri (Taşınabilir - kaybolabilir)
INSERT INTO device_models (name, category, repair_price, ifoundanapple_fee, total_price, is_active, created_at, updated_at) VALUES
-- MacBook Air
('MacBook Air 11-inch (Mid 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Mid 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 11-inch (Mid 2012)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Mid 2012)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 11-inch (Mid 2013)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Mid 2013)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 11-inch (Early 2014)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Early 2014)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 11-inch (Early 2015)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Early 2015)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Mid 2017)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (Late 2018)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (True Tone, 2019)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (M1, 2020)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (M2, 2022)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 15-inch (M2, 2023)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 13-inch (M3, 2024)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Air 15-inch (M3, 2024)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- MacBook Pro
('MacBook Pro 13-inch (Mid 2009)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2009)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Mid 2010)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2010)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 17-inch (Mid 2010)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Early 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Early 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 17-inch (Early 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Late 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Late 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 17-inch (Late 2011)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Mid 2012)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2012)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Late 2012)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Early 2013)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Late 2013)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Late 2013)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Mid 2014)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2014)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Early 2015)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2015)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Late 2016)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Late 2016)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Mid 2017)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2017)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Mid 2018)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2018)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (Mid 2019)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 15-inch (Mid 2019)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (2019)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (M1, 2020)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M1 Pro, 2021)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M1 Pro, 2021)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (M2, 2022)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M2 Pro, 2023)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M2 Pro, 2023)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M3, 2023)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M3, 2023)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M4, 2024)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M4, 2024)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- MacBook (12-inch)
('MacBook 12-inch (Early 2015)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook 12-inch (Early 2016)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('MacBook 12-inch (Mid 2017)', 'MacBook', 0.00, 0.00, 0.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Apple TV ve Diğer Taşınabilir Cihazlar
INSERT INTO device_models (name, category, repair_price, ifoundanapple_fee, total_price, is_active, created_at, updated_at) VALUES
-- Apple TV (taşınabilir)
('Apple TV (1st generation)', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple TV (2nd generation)', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple TV (3rd generation)', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple TV HD', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple TV 4K (1st generation)', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple TV 4K (2nd generation)', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple TV 4K (3rd generation)', 'Apple TV', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- iPod (tarihi modeller)
('iPod Classic', 'iPod', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPod Mini', 'iPod', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPod Nano', 'iPod', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPod Shuffle', 'iPod', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPod Touch', 'iPod', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('iPod Touch (7th generation)', 'iPod', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- Apple Pencil ve Aksesuarlar
('Apple Pencil (1st generation)', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Pencil (2nd generation)', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Pencil (USB-C)', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Pencil Pro', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Magic Mouse', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Magic Mouse 2', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Magic Trackpad', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Magic Trackpad 2', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Magic Keyboard', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),
('Apple Keyboard', 'Accessory', 0.00, 0.00, 0.00, true, NOW(), NOW()),

-- AirTag
('AirTag', 'AirTag', 0.00, 0.00, 0.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Toplam eklenen model sayısını göster
SELECT 
    category,
    COUNT(*) as model_count
FROM device_models 
WHERE is_active = true
GROUP BY category
ORDER BY model_count DESC;

-- Toplam model sayısı
SELECT COUNT(*) as total_models FROM device_models WHERE is_active = true;
