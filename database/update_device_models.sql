-- Update device_models table with comprehensive Apple devices list
-- Run this script in your Supabase SQL Editor
-- Based on existing table structure: id, name, createdAt

-- The table already exists with this structure:
-- CREATE TABLE public.device_models (
--   id uuid not null default gen_random_uuid (),
--   name text not null,
--   "createdAt" timestamp with time zone not null default now(),
--   constraint device_models_pkey primary key (id),
--   constraint device_models_name_key unique (name)
-- );

-- Clear existing data (optional - remove this line if you want to keep existing data)
-- TRUNCATE TABLE public.device_models;

-- Enable Row Level Security if not already enabled
ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for authenticated users
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.device_models;
CREATE POLICY "Allow read access for authenticated users" ON public.device_models
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert comprehensive Apple device models list
INSERT INTO public.device_models (name) VALUES
-- iPhone Models - Complete History
('iPhone 2G (1st gen)'),
('iPhone 3G'),
('iPhone 3GS'),
('iPhone 4'),
('iPhone 4S'),
('iPhone 5'),
('iPhone 5C'),
('iPhone 5S'),
('iPhone 6'),
('iPhone 6 Plus'),
('iPhone 6S'),
('iPhone 6S Plus'),
('iPhone SE (1st gen)'),
('iPhone 7'),
('iPhone 7 Plus'),
('iPhone 8'),
('iPhone 8 Plus'),
('iPhone X'),
('iPhone XR'),
('iPhone XS'),
('iPhone XS Max'),
('iPhone 11'),
('iPhone 11 Pro'),
('iPhone 11 Pro Max'),
('iPhone SE (2nd gen)'),
('iPhone 12 Mini'),
('iPhone 12'),
('iPhone 12 Pro'),
('iPhone 12 Pro Max'),
('iPhone 13 Mini'),
('iPhone 13'),
('iPhone 13 Pro'),
('iPhone 13 Pro Max'),
('iPhone SE (3rd gen)'),
('iPhone 14'),
('iPhone 14 Plus'),
('iPhone 14 Pro'),
('iPhone 14 Pro Max'),
('iPhone 15'),
('iPhone 15 Plus'),
('iPhone 15 Pro'),
('iPhone 15 Pro Max'),
('iPhone 16'),
('iPhone 16 Plus'),
('iPhone 16 Pro'),
('iPhone 16 Pro Max'),
-- Future iPhone Models (rumored/expected)
('iPhone 16e'),
('iPhone 17'),
('iPhone 17 Pro'),
('iPhone 17 Pro Max'),
('iPhone Air'),

-- iPad Models - Complete History
('iPad (1st generation)'),
('iPad (2nd generation)'),
('iPad (3rd generation)'),
('iPad (4th generation)'),
('iPad (5th generation)'),
('iPad (6th generation)'),
('iPad (7th generation)'),
('iPad (8th generation)'),
('iPad (9th generation)'),
('iPad (10th generation)'),
('iPad (11th generation)'),
('iPad mini (1st generation)'),
('iPad mini (2nd generation)'),
('iPad mini (3rd generation)'),
('iPad mini (4th generation)'),
('iPad mini (5th generation)'),
('iPad mini (6th generation)'),
('iPad mini (7th generation)'),
('iPad Air (1st generation)'),
('iPad Air (2nd generation)'),
('iPad Air (3rd generation)'),
('iPad Air (4th generation)'),
('iPad Air (5th generation)'),
('iPad Air (M2)'),
('iPad Air 11-inch (M2)'),
('iPad Air 13-inch (M2)'),
('iPad Pro 9.7-inch'),
('iPad Pro 10.5-inch'),
('iPad Pro 11-inch (1st generation)'),
('iPad Pro 11-inch (2nd generation)'),
('iPad Pro 11-inch (3rd generation)'),
('iPad Pro 11-inch (4th generation)'),
('iPad Pro 11-inch (M4)'),
('iPad Pro 12.9-inch (1st generation)'),
('iPad Pro 12.9-inch (2nd generation)'),
('iPad Pro 12.9-inch (3rd generation)'),
('iPad Pro 12.9-inch (4th generation)'),
('iPad Pro 12.9-inch (5th generation)'),
('iPad Pro 12.9-inch (6th generation)'),
('iPad Pro 13-inch (M4)'),

-- Mac Models - Complete History
-- MacBook Air
('MacBook Air 11-inch (Mid 2011)'),
('MacBook Air 13-inch (Mid 2011)'),
('MacBook Air 11-inch (Mid 2012)'),
('MacBook Air 13-inch (Mid 2012)'),
('MacBook Air 11-inch (Mid 2013)'),
('MacBook Air 13-inch (Mid 2013)'),
('MacBook Air 11-inch (Early 2014)'),
('MacBook Air 13-inch (Early 2014)'),
('MacBook Air 11-inch (Early 2015)'),
('MacBook Air 13-inch (Early 2015)'),
('MacBook Air 13-inch (Mid 2017)'),
('MacBook Air 13-inch (Mid 2018)'),
('MacBook Air 13-inch (Late 2018)'),
('MacBook Air 13-inch (True Tone, 2019)'),
('MacBook Air 13-inch (M1, 2020)'),
('MacBook Air 13-inch (M2, 2022)'),
('MacBook Air 15-inch (M2, 2023)'),
('MacBook Air 13-inch (M3, 2024)'),
('MacBook Air 15-inch (M3, 2024)'),

-- MacBook Pro
('MacBook Pro 13-inch (Mid 2009)'),
('MacBook Pro 15-inch (Mid 2009)'),
('MacBook Pro 17-inch (Mid 2009)'),
('MacBook Pro 13-inch (Mid 2010)'),
('MacBook Pro 15-inch (Mid 2010)'),
('MacBook Pro 17-inch (Mid 2010)'),
('MacBook Pro 13-inch (Early 2011)'),
('MacBook Pro 15-inch (Early 2011)'),
('MacBook Pro 17-inch (Early 2011)'),
('MacBook Pro 13-inch (Late 2011)'),
('MacBook Pro 15-inch (Late 2011)'),
('MacBook Pro 17-inch (Late 2011)'),
('MacBook Pro 13-inch (Mid 2012)'),
('MacBook Pro 15-inch (Mid 2012)'),
('MacBook Pro Retina 13-inch (Late 2012)'),
('MacBook Pro Retina 15-inch (Mid 2012)'),
('MacBook Pro Retina 13-inch (Early 2013)'),
('MacBook Pro Retina 15-inch (Early 2013)'),
('MacBook Pro Retina 13-inch (Late 2013)'),
('MacBook Pro Retina 15-inch (Late 2013)'),
('MacBook Pro Retina 13-inch (Mid 2014)'),
('MacBook Pro Retina 15-inch (Mid 2014)'),
('MacBook Pro Retina 13-inch (Early 2015)'),
('MacBook Pro Retina 15-inch (Mid 2015)'),
('MacBook Pro 13-inch (Late 2016)'),
('MacBook Pro 15-inch (Late 2016)'),
('MacBook Pro 13-inch (Mid 2017)'),
('MacBook Pro 15-inch (Mid 2017)'),
('MacBook Pro 13-inch (Mid 2018)'),
('MacBook Pro 15-inch (Mid 2018)'),
('MacBook Pro 13-inch (Mid 2019)'),
('MacBook Pro 15-inch (Mid 2019)'),
('MacBook Pro 16-inch (Late 2019)'),
('MacBook Pro 13-inch (Early 2020)'),
('MacBook Pro 16-inch (Early 2020)'),
('MacBook Pro 13-inch (M1, Late 2020)'),
('MacBook Pro 14-inch (M1 Pro, 2021)'),
('MacBook Pro 14-inch (M1 Max, 2021)'),
('MacBook Pro 16-inch (M1 Pro, 2021)'),
('MacBook Pro 16-inch (M1 Max, 2021)'),
('MacBook Pro 13-inch (M2, 2022)'),
('MacBook Pro 14-inch (M2 Pro, 2023)'),
('MacBook Pro 14-inch (M2 Max, 2023)'),
('MacBook Pro 16-inch (M2 Pro, 2023)'),
('MacBook Pro 16-inch (M2 Max, 2023)'),
('MacBook Pro 14-inch (M3, 2023)'),
('MacBook Pro 14-inch (M3 Pro, 2023)'),
('MacBook Pro 14-inch (M3 Max, 2023)'),
('MacBook Pro 16-inch (M3 Pro, 2023)'),
('MacBook Pro 16-inch (M3 Max, 2023)'),
('MacBook Pro 14-inch (M4, 2024)'),
('MacBook Pro 16-inch (M4, 2024)'),

-- iMac
('iMac 21.5-inch (Late 2009)'),
('iMac 27-inch (Late 2009)'),
('iMac 21.5-inch (Mid 2010)'),
('iMac 27-inch (Mid 2010)'),
('iMac 21.5-inch (Mid 2011)'),
('iMac 27-inch (Mid 2011)'),
('iMac 21.5-inch (Late 2012)'),
('iMac 27-inch (Late 2012)'),
('iMac 21.5-inch (Late 2013)'),
('iMac 27-inch (Late 2013)'),
('iMac 21.5-inch (Mid 2014)'),
('iMac 27-inch (5K, Mid 2014)'),
('iMac 21.5-inch (Late 2015)'),
('iMac 27-inch (5K, Late 2015)'),
('iMac 21.5-inch (Late 2017)'),
('iMac 27-inch (5K, Mid 2017)'),
('iMac Pro 27-inch (5K, Late 2017)'),
('iMac 21.5-inch (Mid 2019)'),
('iMac 27-inch (5K, Mid 2019)'),
('iMac 27-inch (5K, Mid 2020)'),
('iMac 24-inch (M1, 2021)'),
('iMac 24-inch (M3, 2023)'),
('iMac 24-inch (M4, 2024)'),

-- Mac mini
('Mac mini (Mid 2010)'),
('Mac mini (Mid 2011)'),
('Mac mini Server (Mid 2011)'),
('Mac mini (Late 2012)'),
('Mac mini Server (Late 2012)'),
('Mac mini (Late 2014)'),
('Mac mini (Late 2018)'),
('Mac mini (M1, 2020)'),
('Mac mini (M2, 2023)'),
('Mac mini (M2 Pro, 2023)'),
('Mac mini (M4, 2024)'),

-- Mac Pro
('Mac Pro (Mid 2010)'),
('Mac Pro (Mid 2012)'),
('Mac Pro (Late 2013)'),
('Mac Pro (2019)'),
('Mac Pro (M2 Ultra, 2023)'),

-- Mac Studio
('Mac Studio (M1 Max, 2022)'),
('Mac Studio (M1 Ultra, 2022)'),
('Mac Studio (M2 Max, 2023)'),
('Mac Studio (M2 Ultra, 2023)'),
('Mac Studio (M4 Max, 2024)'),
('Mac Studio (M4 Ultra, 2024)'),

-- Apple Watch Models
('Apple Watch (1st generation)'),
('Apple Watch Series 1'),
('Apple Watch Series 2'),
('Apple Watch Series 3'),
('Apple Watch Series 4'),
('Apple Watch Series 5'),
('Apple Watch SE (1st generation)'),
('Apple Watch Series 6'),
('Apple Watch Series 7'),
('Apple Watch SE (2nd generation)'),
('Apple Watch Series 8'),
('Apple Watch Ultra'),
('Apple Watch Series 9'),
('Apple Watch Ultra 2'),
('Apple Watch Series 10'),

-- AirPods Models
('AirPods (1st generation)'),
('AirPods (2nd generation)'),
('AirPods (3rd generation)'),
('AirPods (4th generation)'),
('AirPods Pro (1st generation)'),
('AirPods Pro (2nd generation)'),
('AirPods Pro (3rd generation)'),
('AirPods Max'),
('AirPods Max (2nd generation)'),

-- Apple TV Models
('Apple TV (1st generation)'),
('Apple TV (2nd generation)'),
('Apple TV (3rd generation)'),
('Apple TV HD (4th generation)'),
('Apple TV 4K (1st generation)'),
('Apple TV 4K (2nd generation)'),
('Apple TV 4K (3rd generation)'),

-- HomePod Models
('HomePod (1st generation)'),
('HomePod (2nd generation)'),
('HomePod mini'),

-- iPod Models (Legacy)
('iPod (1st generation)'),
('iPod (2nd generation)'),
('iPod (3rd generation)'),
('iPod (4th generation)'),
('iPod (5th generation)'),
('iPod classic'),
('iPod mini'),
('iPod nano (1st generation)'),
('iPod nano (2nd generation)'),
('iPod nano (3rd generation)'),
('iPod nano (4th generation)'),
('iPod nano (5th generation)'),
('iPod nano (6th generation)'),
('iPod nano (7th generation)'),
('iPod shuffle (1st generation)'),
('iPod shuffle (2nd generation)'),
('iPod shuffle (3rd generation)'),
('iPod shuffle (4th generation)'),
('iPod touch (1st generation)'),
('iPod touch (2nd generation)'),
('iPod touch (3rd generation)'),
('iPod touch (4th generation)'),
('iPod touch (5th generation)'),
('iPod touch (6th generation)'),
('iPod touch (7th generation)'),

-- Accessories
('Magic Mouse'),
('Magic Mouse 2'),
('Magic Trackpad'),
('Magic Trackpad 2'),
('Magic Keyboard'),
('Magic Keyboard with Touch ID'),
('Magic Keyboard with Touch ID and Numeric Keypad'),
('Magic Keyboard for iPad Pro 11-inch'),
('Magic Keyboard for iPad Pro 12.9-inch'),
('Magic Keyboard for iPad Pro 11-inch (M4)'),
('Magic Keyboard for iPad Pro 13-inch (M4)'),
('Magic Keyboard for iPad Air 11-inch (M2)'),
('Magic Keyboard for iPad Air 13-inch (M2)'),
('Apple Pencil (1st generation)'),
('Apple Pencil (2nd generation)'),
('Apple Pencil Pro'),
('Smart Keyboard'),
('Smart Keyboard Folio'),
('Apple Pro Display XDR'),
('Apple Studio Display'),
('Apple Thunderbolt Display'),
('Apple Cinema Display'),
('AirTag'),
('MagSafe Charger'),
('MagSafe Duo Charger'),
('MagSafe Battery Pack'),
('Lightning to USB Cable'),
('USB-C to Lightning Cable'),
('Thunderbolt 4 Pro Cable'),
('Polishing Cloth')

-- Handle conflicts (ignore duplicates since we only have name column)
ON CONFLICT (name) DO NOTHING;

-- Grant necessary permissions
GRANT SELECT ON public.device_models TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify the data was inserted
SELECT COUNT(*) as total_models FROM public.device_models;

-- Show breakdown by device type
SELECT 
    CASE 
        WHEN name LIKE 'iPhone%' THEN 'iPhone'
        WHEN name LIKE 'iPad%' THEN 'iPad'
        WHEN name LIKE 'MacBook%' OR name LIKE 'iMac%' OR name LIKE 'Mac %' THEN 'Mac'
        WHEN name LIKE 'Apple Watch%' THEN 'Apple Watch'
        WHEN name LIKE 'AirPods%' THEN 'AirPods'
        WHEN name LIKE 'Apple TV%' THEN 'Apple TV'
        WHEN name LIKE 'HomePod%' THEN 'HomePod'
        WHEN name LIKE 'iPod%' THEN 'iPod'
        ELSE 'Accessories'
    END as category,
    COUNT(*) as model_count
FROM public.device_models 
GROUP BY 
    CASE 
        WHEN name LIKE 'iPhone%' THEN 'iPhone'
        WHEN name LIKE 'iPad%' THEN 'iPad'
        WHEN name LIKE 'MacBook%' OR name LIKE 'iMac%' OR name LIKE 'Mac %' THEN 'Mac'
        WHEN name LIKE 'Apple Watch%' THEN 'Apple Watch'
        WHEN name LIKE 'AirPods%' THEN 'AirPods'
        WHEN name LIKE 'Apple TV%' THEN 'Apple TV'
        WHEN name LIKE 'HomePod%' THEN 'HomePod'
        WHEN name LIKE 'iPod%' THEN 'iPod'
        ELSE 'Accessories'
    END
ORDER BY model_count DESC;