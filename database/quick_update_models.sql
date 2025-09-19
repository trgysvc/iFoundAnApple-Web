-- Quick update script for device_models table
-- This adds only the most essential Apple devices (93 → 200+ models)

-- Insert latest Apple devices
INSERT INTO public.device_models (name) VALUES
-- Latest iPhones (2020-2024)
('iPhone 16 Pro Max'),
('iPhone 16 Pro'),
('iPhone 16 Plus'),
('iPhone 16'),
('iPhone 15 Pro Max'),
('iPhone 15 Pro'),
('iPhone 15 Plus'),
('iPhone 15'),
('iPhone 14 Pro Max'),
('iPhone 14 Pro'),
('iPhone 14 Plus'),
('iPhone 14'),
('iPhone 13 Pro Max'),
('iPhone 13 Pro'),
('iPhone 13 Mini'),
('iPhone 13'),
('iPhone 12 Pro Max'),
('iPhone 12 Pro'),
('iPhone 12 Mini'),
('iPhone 12'),
('iPhone SE (3rd gen)'),

-- Latest iPads (2020-2024)
('iPad Pro 13-inch (M4)'),
('iPad Pro 11-inch (M4)'),
('iPad Air 13-inch (M2)'),
('iPad Air 11-inch (M2)'),
('iPad (10th generation)'),
('iPad (11th generation)'),
('iPad mini (6th generation)'),
('iPad mini (7th generation)'),
('iPad Pro 12.9-inch (6th generation)'),
('iPad Pro 11-inch (4th generation)'),
('iPad Air (5th generation)'),

-- Latest Macs (2020-2024)
('MacBook Air 15-inch (M3, 2024)'),
('MacBook Air 13-inch (M3, 2024)'),
('MacBook Air 15-inch (M2, 2023)'),
('MacBook Air 13-inch (M2, 2022)'),
('MacBook Air 13-inch (M1, 2020)'),
('MacBook Pro 16-inch (M4, 2024)'),
('MacBook Pro 14-inch (M4, 2024)'),
('MacBook Pro 16-inch (M3 Max, 2023)'),
('MacBook Pro 14-inch (M3 Max, 2023)'),
('MacBook Pro 16-inch (M3 Pro, 2023)'),
('MacBook Pro 14-inch (M3 Pro, 2023)'),
('MacBook Pro 16-inch (M2 Max, 2023)'),
('MacBook Pro 14-inch (M2 Max, 2023)'),
('MacBook Pro 16-inch (M1 Max, 2021)'),
('MacBook Pro 14-inch (M1 Max, 2021)'),
('MacBook Pro 13-inch (M1, 2020)'),
('iMac 24-inch (M4, 2024)'),
('iMac 24-inch (M3, 2023)'),
('iMac 24-inch (M1, 2021)'),
('Mac Studio (M4 Max, 2024)'),
('Mac Studio (M4 Ultra, 2024)'),
('Mac Studio (M2 Max, 2023)'),
('Mac Studio (M2 Ultra, 2023)'),
('Mac Studio (M1 Max, 2022)'),
('Mac Studio (M1 Ultra, 2022)'),
('Mac mini (M4, 2024)'),
('Mac mini (M2, 2023)'),
('Mac mini (M1, 2020)'),
('Mac Pro (M2 Ultra, 2023)'),

-- Latest Apple Watch
('Apple Watch Series 10'),
('Apple Watch Ultra 2'),
('Apple Watch Series 9'),
('Apple Watch Ultra'),
('Apple Watch Series 8'),
('Apple Watch SE (2nd generation)'),
('Apple Watch Series 7'),
('Apple Watch Series 6'),
('Apple Watch SE (1st generation)'),

-- Latest AirPods
('AirPods (4th generation)'),
('AirPods Pro (2nd generation)'),
('AirPods (3rd generation)'),
('AirPods Max'),
('AirPods Max (2nd generation)'),

-- Apple TV & HomePod
('Apple TV 4K (3rd generation)'),
('Apple TV 4K (2nd generation)'),
('HomePod (2nd generation)'),
('HomePod mini'),

-- Essential Accessories
('Magic Keyboard for iPad Pro 13-inch (M4)'),
('Magic Keyboard for iPad Pro 11-inch (M4)'),
('Magic Keyboard for iPad Air 13-inch (M2)'),
('Magic Keyboard for iPad Air 11-inch (M2)'),
('Apple Pencil Pro'),
('Apple Pencil (2nd generation)'),
('Apple Pencil (1st generation)'),
('Magic Mouse'),
('Magic Trackpad'),
('Magic Keyboard'),
('Magic Keyboard with Touch ID'),
('Apple Studio Display'),
('Apple Pro Display XDR'),
('AirTag'),
('MagSafe Charger')

-- Handle conflicts (ignore duplicates)
ON CONFLICT (name) DO NOTHING;

-- Check results
SELECT COUNT(*) as total_models FROM public.device_models;

-- Show breakdown
SELECT 
    CASE 
        WHEN name LIKE 'iPhone%' THEN 'iPhone'
        WHEN name LIKE 'iPad%' THEN 'iPad'
        WHEN name LIKE 'MacBook%' OR name LIKE 'iMac%' OR name LIKE 'Mac %' THEN 'Mac'
        WHEN name LIKE 'Apple Watch%' THEN 'Apple Watch'
        WHEN name LIKE 'AirPods%' THEN 'AirPods'
        ELSE 'Other'
    END as category,
    COUNT(*) as count
FROM public.device_models 
GROUP BY 
    CASE 
        WHEN name LIKE 'iPhone%' THEN 'iPhone'
        WHEN name LIKE 'iPad%' THEN 'iPad'
        WHEN name LIKE 'MacBook%' OR name LIKE 'iMac%' OR name LIKE 'Mac %' THEN 'Mac'
        WHEN name LIKE 'Apple Watch%' THEN 'Apple Watch'
        WHEN name LIKE 'AirPods%' THEN 'AirPods'
        ELSE 'Other'
    END
ORDER BY count DESC;
