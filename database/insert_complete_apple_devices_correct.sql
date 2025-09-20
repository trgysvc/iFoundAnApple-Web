-- Complete Apple Device Models List - CORRECT VERSION
-- Mevcut tablo yapısına uygun: (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage)
-- Mevcut veriler korunacak: ON CONFLICT (name) DO NOTHING

-- iPhone Modelleri (2007-2024)
INSERT INTO device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, "createdAt", updated_at) VALUES
-- iPhone (Original - 2024) - Eski modeller, fiyat belirlenmemiş (0.00)
('iPhone', 'iPhone', 'iPhone (1st generation)', 'Original iPhone, 2007', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 3G', 'iPhone', 'iPhone 3G', '3G connectivity, 2008', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 3GS', 'iPhone', 'iPhone 3GS', 'Speed improvements, 2009', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 4', 'iPhone', 'iPhone 4', 'Retina display, 2010', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 4S', 'iPhone', 'iPhone 4S', 'Siri introduction, 2011', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 5', 'iPhone', 'iPhone 5', 'Lightning connector, 2012', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 5c', 'iPhone', 'iPhone 5c', 'Colorful plastic design, 2013', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 5s', 'iPhone', 'iPhone 5s', 'Touch ID, 2013', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 6', 'iPhone', 'iPhone 6', '4.7-inch display, 2014', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 6 Plus', 'iPhone', 'iPhone 6 Plus', '5.5-inch display, 2014', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 6s', 'iPhone', 'iPhone 6s', '3D Touch, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 6s Plus', 'iPhone', 'iPhone 6s Plus', '3D Touch, 5.5-inch, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone SE (1st generation)', 'iPhone', 'iPhone SE', 'Compact design, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 7', 'iPhone', 'iPhone 7', 'Water resistant, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 7 Plus', 'iPhone', 'iPhone 7 Plus', 'Dual camera, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 8', 'iPhone', 'iPhone 8', 'Wireless charging, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 8 Plus', 'iPhone', 'iPhone 8 Plus', 'Wireless charging, dual camera, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone X', 'iPhone', 'iPhone X', 'Face ID, OLED, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone XR', 'iPhone', 'iPhone XR', 'LCD, multiple colors, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone XS', 'iPhone', 'iPhone XS', 'A12 Bionic, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone XS Max', 'iPhone', 'iPhone XS Max', 'Largest iPhone, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- iPhone 11-16 serisi (bazıları zaten mevcut, ON CONFLICT ile korunacak)
('iPhone 11', 'iPhone', 'iPhone 11', 'Dual camera, A13 Bionic, 2019', 3300.00, 330.00, 10.00, true, NOW(), NOW()),
('iPhone 11 Pro', 'iPhone', 'iPhone 11 Pro', 'Triple camera, Pro display, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 11 Pro Max', 'iPhone', 'iPhone 11 Pro Max', 'Largest Pro iPhone, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone SE (2nd generation)', 'iPhone', 'iPhone SE (2nd generation)', 'A13 Bionic in iPhone 8 body, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 12 mini', 'iPhone', 'iPhone 12 mini', '5G, compact size, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 12', 'iPhone', 'iPhone 12', '5G, A14 Bionic, 2020', 4400.00, 440.00, 10.00, true, NOW(), NOW()),
('iPhone 12 Pro', 'iPhone', 'iPhone 12 Pro', '5G, LiDAR, Pro cameras, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 12 Pro Max', 'iPhone', 'iPhone 12 Pro Max', 'Largest iPhone 12, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 13 mini', 'iPhone', 'iPhone 13 mini', 'A15 Bionic, compact, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 13', 'iPhone', 'iPhone 13', 'A15 Bionic, improved cameras, 2021', 5500.00, 550.00, 10.00, true, NOW(), NOW()),
('iPhone 13 Pro', 'iPhone', 'iPhone 13 Pro', 'ProMotion display, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 13 Pro Max', 'iPhone', 'iPhone 13 Pro Max', 'Largest iPhone 13, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone SE (3rd generation)', 'iPhone', 'iPhone SE (3rd generation)', 'A15 Bionic, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 14', 'iPhone', 'iPhone 14', 'A15 Bionic, improved cameras, 2022', 6600.00, 660.00, 10.00, true, NOW(), NOW()),
('iPhone 14 Plus', 'iPhone', 'iPhone 14 Plus', 'Large iPhone 14, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 14 Pro', 'iPhone', 'iPhone 14 Pro', 'Dynamic Island, A16 Bionic, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 14 Pro Max', 'iPhone', 'iPhone 14 Pro Max', 'Largest iPhone 14, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 15', 'iPhone', 'iPhone 15', 'USB-C, A16 Bionic, 2023', 7700.00, 770.00, 10.00, true, NOW(), NOW()),
('iPhone 15 Plus', 'iPhone', 'iPhone 15 Plus', 'Large iPhone 15, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 15 Pro', 'iPhone', 'iPhone 15 Pro', 'Titanium, A17 Pro, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 15 Pro Max', 'iPhone', 'iPhone 15 Pro Max', 'Largest iPhone 15, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 16', 'iPhone', 'iPhone 16', 'A18 chip, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 16 Plus', 'iPhone', 'iPhone 16 Plus', 'Large iPhone 16, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 16 Pro', 'iPhone', 'iPhone 16 Pro', 'A18 Pro chip, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPhone 16 Pro Max', 'iPhone', 'iPhone 16 Pro Max', 'Largest iPhone 16, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- iPad Modelleri (2010-2024)
INSERT INTO device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, "createdAt", updated_at) VALUES
-- iPad Original ve Air Serisi
('iPad (1st generation)', 'iPad', 'iPad', 'Original iPad, 2010', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad 2', 'iPad', 'iPad 2', 'Thinner design, 2011', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (3rd generation)', 'iPad', 'iPad (3rd generation)', 'Retina display, 2012', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (4th generation)', 'iPad', 'iPad (4th generation)', 'Lightning connector, 2012', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air', 'iPad', 'iPad Air', 'Thinner and lighter, 2013', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air 2', 'iPad', 'iPad Air 2', 'Touch ID, 2014', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (5th generation)', 'iPad', 'iPad (5th generation)', 'A9 chip, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (6th generation)', 'iPad', 'iPad (6th generation)', 'Apple Pencil support, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air (3rd generation)', 'iPad', 'iPad Air (3rd generation)', 'A12 Bionic, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (7th generation)', 'iPad', 'iPad (7th generation)', '10.2-inch display, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (8th generation)', 'iPad', 'iPad (8th generation)', 'A12 Bionic, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air (4th generation)', 'iPad', 'iPad Air (4th generation)', 'A14 Bionic, USB-C, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (9th generation)', 'iPad', 'iPad (9th generation)', 'A13 Bionic, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air (5th generation)', 'iPad', 'iPad Air (5th generation)', 'M1 chip, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad (10th generation)', 'iPad', 'iPad (10th generation)', 'A14 Bionic, new design, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air 11-inch (M2)', 'iPad', 'iPad Air 11-inch (M2)', 'M2 chip, 11-inch, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Air 13-inch (M2)', 'iPad', 'iPad Air 13-inch (M2)', 'M2 chip, 13-inch, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- iPad Mini Serisi
('iPad mini', 'iPad', 'iPad mini', 'Compact iPad, 2012', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad mini 2', 'iPad', 'iPad mini 2', 'Retina display, 2013', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad mini 3', 'iPad', 'iPad mini 3', 'Touch ID, 2014', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad mini 4', 'iPad', 'iPad mini 4', 'A8 chip, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad mini (5th generation)', 'iPad', 'iPad mini (5th generation)', 'A12 Bionic, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad mini (6th generation)', 'iPad', 'iPad mini (6th generation)', 'A15 Bionic, new design, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- iPad Pro Serisi
('iPad Pro 12.9-inch (1st generation)', 'iPad', 'iPad Pro 12.9-inch (1st generation)', 'First iPad Pro, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 9.7-inch', 'iPad', 'iPad Pro 9.7-inch', 'Smaller Pro iPad, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (2nd generation)', 'iPad', 'iPad Pro 12.9-inch (2nd generation)', 'A10X Fusion, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 10.5-inch', 'iPad', 'iPad Pro 10.5-inch', 'ProMotion display, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 11-inch (1st generation)', 'iPad', 'iPad Pro 11-inch (1st generation)', 'Face ID, USB-C, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (3rd generation)', 'iPad', 'iPad Pro 12.9-inch (3rd generation)', 'Face ID, USB-C, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 11-inch (2nd generation)', 'iPad', 'iPad Pro 11-inch (2nd generation)', 'A12Z Bionic, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (4th generation)', 'iPad', 'iPad Pro 12.9-inch (4th generation)', 'A12Z Bionic, LiDAR, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 11-inch (3rd generation)', 'iPad', 'iPad Pro 11-inch (3rd generation)', 'M1 chip, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (5th generation)', 'iPad', 'iPad Pro 12.9-inch (5th generation)', 'M1 chip, Liquid Retina XDR, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 11-inch (4th generation)', 'iPad', 'iPad Pro 11-inch (4th generation)', 'M2 chip, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 12.9-inch (6th generation)', 'iPad', 'iPad Pro 12.9-inch (6th generation)', 'M2 chip, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 11-inch (M4)', 'iPad', 'iPad Pro 11-inch (M4)', 'M4 chip, OLED, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('iPad Pro 13-inch (M4)', 'iPad', 'iPad Pro 13-inch (M4)', 'M4 chip, OLED, 13-inch, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Apple Watch Modelleri (2015-2024)
INSERT INTO device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, "createdAt", updated_at) VALUES
('Apple Watch (1st generation)', 'Apple Watch', 'Apple Watch', 'Original Apple Watch, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 1', 'Apple Watch', 'Apple Watch Series 1', 'Dual-core processor, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 2', 'Apple Watch', 'Apple Watch Series 2', 'GPS, water resistant, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 3', 'Apple Watch', 'Apple Watch Series 3', 'Cellular option, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 4', 'Apple Watch', 'Apple Watch Series 4', 'Larger display, ECG, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 5', 'Apple Watch', 'Apple Watch Series 5', 'Always-On display, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch SE (1st generation)', 'Apple Watch', 'Apple Watch SE', 'Affordable Apple Watch, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 6', 'Apple Watch', 'Apple Watch Series 6', 'Blood oxygen monitoring, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 7', 'Apple Watch', 'Apple Watch Series 7', 'Larger display, fast charging, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch SE (2nd generation)', 'Apple Watch', 'Apple Watch SE (2nd generation)', 'Updated SE model, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 8', 'Apple Watch', 'Apple Watch Series 8', 'Temperature sensing, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Ultra', 'Apple Watch', 'Apple Watch Ultra', 'Rugged design, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 9', 'Apple Watch', 'Apple Watch Series 9', 'S9 chip, Double Tap, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Ultra 2', 'Apple Watch', 'Apple Watch Ultra 2', 'S9 chip, brighter display, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Watch Series 10', 'Apple Watch', 'Apple Watch Series 10', 'Latest Apple Watch, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- AirPods ve Audio Modelleri (2016-2024)
INSERT INTO device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, "createdAt", updated_at) VALUES
('AirPods (1st generation)', 'AirPods', 'AirPods', 'Original AirPods, 2016', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('AirPods (2nd generation)', 'AirPods', 'AirPods (2nd generation)', 'H1 chip, Hey Siri, 2019', 1100.00, 110.00, 10.00, true, NOW(), NOW()),
('AirPods (3rd generation)', 'AirPods', 'AirPods (3rd generation)', 'Spatial Audio, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('AirPods Pro (1st generation)', 'AirPods', 'AirPods Pro', 'Active Noise Cancellation, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('AirPods Pro (2nd generation)', 'AirPods', 'AirPods Pro (2nd generation)', 'H2 chip, improved ANC, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('AirPods Max', 'AirPods', 'AirPods Max', 'Over-ear headphones, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('AirPods Pro 2 (USB-C)', 'AirPods', 'AirPods Pro (2nd generation) USB-C', 'USB-C charging case, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- MacBook Modelleri (Seçilmiş önemli modeller)
INSERT INTO device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, "createdAt", updated_at) VALUES
-- MacBook Air
('MacBook Air 13-inch (M1, 2020)', 'MacBook', 'MacBook Air 13-inch (M1)', 'M1 chip, fanless design, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Air 13-inch (M2, 2022)', 'MacBook', 'MacBook Air 13-inch (M2)', 'M2 chip, new design, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Air 15-inch (M2, 2023)', 'MacBook', 'MacBook Air 15-inch (M2)', 'M2 chip, 15-inch display, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Air 13-inch (M3, 2024)', 'MacBook', 'MacBook Air 13-inch (M3)', 'M3 chip, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Air 15-inch (M3, 2024)', 'MacBook', 'MacBook Air 15-inch (M3)', 'M3 chip, 15-inch, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- MacBook Pro
('MacBook Pro 13-inch (M1, 2020)', 'MacBook', 'MacBook Pro 13-inch (M1)', 'M1 chip, Touch Bar, 2020', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M1 Pro, 2021)', 'MacBook', 'MacBook Pro 14-inch (M1 Pro)', 'M1 Pro chip, Liquid Retina XDR, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M1 Pro, 2021)', 'MacBook', 'MacBook Pro 16-inch (M1 Pro)', 'M1 Pro/Max chip, 16-inch, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 13-inch (M2, 2022)', 'MacBook', 'MacBook Pro 13-inch (M2)', 'M2 chip, Touch Bar, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M2 Pro, 2023)', 'MacBook', 'MacBook Pro 14-inch (M2 Pro)', 'M2 Pro/Max chip, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M2 Pro, 2023)', 'MacBook', 'MacBook Pro 16-inch (M2 Pro)', 'M2 Pro/Max chip, 16-inch, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M3, 2023)', 'MacBook', 'MacBook Pro 14-inch (M3)', 'M3 chip series, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M3, 2023)', 'MacBook', 'MacBook Pro 16-inch (M3)', 'M3 chip series, 16-inch, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 14-inch (M4, 2024)', 'MacBook', 'MacBook Pro 14-inch (M4)', 'M4 chip, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('MacBook Pro 16-inch (M4, 2024)', 'MacBook', 'MacBook Pro 16-inch (M4)', 'M4 chip, 16-inch, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Apple TV ve Diğer Cihazlar
INSERT INTO device_models (name, category, model_name, specifications, repair_price, ifoundanapple_fee, fee_percentage, is_active, "createdAt", updated_at) VALUES
('Apple TV HD', 'Apple TV', 'Apple TV HD', '1080p streaming, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple TV 4K (1st generation)', 'Apple TV', 'Apple TV 4K', '4K HDR streaming, 2017', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple TV 4K (2nd generation)', 'Apple TV', 'Apple TV 4K (2nd generation)', 'A12 Bionic, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple TV 4K (3rd generation)', 'Apple TV', 'Apple TV 4K (3rd generation)', 'A15 Bionic, 2022', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- iPod (tarihi modeller)
('iPod Touch (7th generation)', 'iPod', 'iPod Touch', 'Last iPod model, 2019', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- Apple Pencil ve Aksesuarlar
('Apple Pencil (1st generation)', 'Accessory', 'Apple Pencil', 'First generation stylus, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Pencil (2nd generation)', 'Accessory', 'Apple Pencil (2nd generation)', 'Magnetic attachment, 2018', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Pencil (USB-C)', 'Accessory', 'Apple Pencil (USB-C)', 'USB-C charging, 2023', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Apple Pencil Pro', 'Accessory', 'Apple Pencil Pro', 'Advanced features, 2024', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Magic Mouse 2', 'Accessory', 'Magic Mouse 2', 'Wireless mouse, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Magic Trackpad 2', 'Accessory', 'Magic Trackpad 2', 'Force Touch trackpad, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),
('Magic Keyboard', 'Accessory', 'Magic Keyboard', 'Wireless keyboard, 2015', 0.00, 0.00, 10.00, true, NOW(), NOW()),

-- AirTag
('AirTag', 'AirTag', 'AirTag', 'Item tracker, 2021', 0.00, 0.00, 10.00, true, NOW(), NOW())

ON CONFLICT (name) DO NOTHING;

-- Sonuç raporu
SELECT 
    category,
    COUNT(*) as model_count,
    COUNT(CASE WHEN repair_price > 0 THEN 1 END) as models_with_price,
    COUNT(CASE WHEN repair_price = 0 OR repair_price IS NULL THEN 1 END) as models_without_price
FROM device_models 
WHERE is_active = true
GROUP BY category
ORDER BY model_count DESC;

SELECT 
    'Toplam Model Sayısı' as info,
    COUNT(*) as count
FROM device_models 
WHERE is_active = true;
