-- Update device_models table with latest Apple devices
-- Run this script in your Supabase SQL Editor

-- First, create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.device_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    release_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_device_models_category ON public.device_models(category);
CREATE INDEX IF NOT EXISTS idx_device_models_active ON public.device_models(is_active);
CREATE INDEX IF NOT EXISTS idx_device_models_name ON public.device_models(name);

-- Enable Row Level Security
ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for authenticated users
CREATE POLICY IF NOT EXISTS "Allow read access for authenticated users" ON public.device_models
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert/Update latest Apple device models
INSERT INTO public.device_models (name, category, release_year, is_active) VALUES
-- iPhone Models (2020-2025)
('iPhone 16 Pro Max', 'iPhone', 2024, true),
('iPhone 16 Pro', 'iPhone', 2024, true),
('iPhone 16 Plus', 'iPhone', 2024, true),
('iPhone 16', 'iPhone', 2024, true),
('iPhone 15 Pro Max', 'iPhone', 2023, true),
('iPhone 15 Pro', 'iPhone', 2023, true),
('iPhone 15 Plus', 'iPhone', 2023, true),
('iPhone 15', 'iPhone', 2023, true),
('iPhone 14 Pro Max', 'iPhone', 2022, true),
('iPhone 14 Pro', 'iPhone', 2022, true),
('iPhone 14 Plus', 'iPhone', 2022, true),
('iPhone 14', 'iPhone', 2022, true),
('iPhone 13 Pro Max', 'iPhone', 2021, true),
('iPhone 13 Pro', 'iPhone', 2021, true),
('iPhone 13 mini', 'iPhone', 2021, true),
('iPhone 13', 'iPhone', 2021, true),
('iPhone 12 Pro Max', 'iPhone', 2020, true),
('iPhone 12 Pro', 'iPhone', 2020, true),
('iPhone 12 mini', 'iPhone', 2020, true),
('iPhone 12', 'iPhone', 2020, true),
('iPhone SE (3rd generation)', 'iPhone', 2022, true),
('iPhone SE (2nd generation)', 'iPhone', 2020, true),

-- iPad Models (2020-2025)
('iPad Pro 13-inch (M4)', 'iPad', 2024, true),
('iPad Pro 11-inch (M4)', 'iPad', 2024, true),
('iPad Air 13-inch (M2)', 'iPad', 2024, true),
('iPad Air 11-inch (M2)', 'iPad', 2024, true),
('iPad (10th generation)', 'iPad', 2022, true),
('iPad mini (6th generation)', 'iPad', 2021, true),
('iPad Pro 12.9-inch (5th generation)', 'iPad', 2021, true),
('iPad Pro 11-inch (3rd generation)', 'iPad', 2021, true),
('iPad Air (5th generation)', 'iPad', 2022, true),
('iPad Air (4th generation)', 'iPad', 2020, true),
('iPad (9th generation)', 'iPad', 2021, true),
('iPad (8th generation)', 'iPad', 2020, true),

-- Mac Models (2020-2025)
('MacBook Air 15-inch (M3)', 'Mac', 2024, true),
('MacBook Air 13-inch (M3)', 'Mac', 2024, true),
('MacBook Air 15-inch (M2)', 'Mac', 2023, true),
('MacBook Air 13-inch (M2)', 'Mac', 2022, true),
('MacBook Air 13-inch (M1)', 'Mac', 2020, true),
('MacBook Pro 16-inch (M4 Pro)', 'Mac', 2024, true),
('MacBook Pro 14-inch (M4 Pro)', 'Mac', 2024, true),
('MacBook Pro 16-inch (M3 Max)', 'Mac', 2023, true),
('MacBook Pro 14-inch (M3 Max)', 'Mac', 2023, true),
('MacBook Pro 16-inch (M3 Pro)', 'Mac', 2023, true),
('MacBook Pro 14-inch (M3 Pro)', 'Mac', 2023, true),
('MacBook Pro 16-inch (M2 Max)', 'Mac', 2023, true),
('MacBook Pro 14-inch (M2 Max)', 'Mac', 2023, true),
('MacBook Pro 16-inch (M2 Pro)', 'Mac', 2023, true),
('MacBook Pro 14-inch (M2 Pro)', 'Mac', 2023, true),
('MacBook Pro 13-inch (M2)', 'Mac', 2022, true),
('MacBook Pro 16-inch (M1 Max)', 'Mac', 2021, true),
('MacBook Pro 14-inch (M1 Max)', 'Mac', 2021, true),
('MacBook Pro 16-inch (M1 Pro)', 'Mac', 2021, true),
('MacBook Pro 14-inch (M1 Pro)', 'Mac', 2021, true),
('MacBook Pro 13-inch (M1)', 'Mac', 2020, true),

-- iMac Models (2020-2025)
('iMac 24-inch (M4)', 'Mac', 2024, true),
('iMac 24-inch (M3)', 'Mac', 2023, true),
('iMac 24-inch (M1)', 'Mac', 2021, true),
('iMac Pro 27-inch (M4 Pro)', 'Mac', 2024, true),

-- Mac Studio & Mac Pro (2022-2025)
('Mac Studio (M4 Max)', 'Mac', 2024, true),
('Mac Studio (M4 Ultra)', 'Mac', 2024, true),
('Mac Studio (M2 Max)', 'Mac', 2023, true),
('Mac Studio (M2 Ultra)', 'Mac', 2023, true),
('Mac Studio (M1 Max)', 'Mac', 2022, true),
('Mac Studio (M1 Ultra)', 'Mac', 2022, true),
('Mac Pro (M2 Ultra)', 'Mac', 2023, true),

-- Mac mini Models (2020-2025)
('Mac mini (M4)', 'Mac', 2024, true),
('Mac mini (M4 Pro)', 'Mac', 2024, true),
('Mac mini (M2)', 'Mac', 2023, true),
('Mac mini (M2 Pro)', 'Mac', 2023, true),
('Mac mini (M1)', 'Mac', 2020, true),

-- Apple Watch Models (2020-2025)
('Apple Watch Series 10', 'Apple Watch', 2024, true),
('Apple Watch Ultra 2', 'Apple Watch', 2023, true),
('Apple Watch Series 9', 'Apple Watch', 2023, true),
('Apple Watch Ultra', 'Apple Watch', 2022, true),
('Apple Watch Series 8', 'Apple Watch', 2022, true),
('Apple Watch SE (2nd generation)', 'Apple Watch', 2022, true),
('Apple Watch Series 7', 'Apple Watch', 2021, true),
('Apple Watch Series 6', 'Apple Watch', 2020, true),
('Apple Watch SE (1st generation)', 'Apple Watch', 2020, true),

-- AirPods Models (2020-2025)
('AirPods 4', 'AirPods', 2024, true),
('AirPods Pro (2nd generation)', 'AirPods', 2022, true),
('AirPods (3rd generation)', 'AirPods', 2021, true),
('AirPods Pro (1st generation)', 'AirPods', 2019, true),
('AirPods (2nd generation)', 'AirPods', 2019, true),
('AirPods Max', 'AirPods', 2020, true),

-- Apple TV Models (2020-2025)
('Apple TV 4K (3rd generation)', 'Apple TV', 2022, true),
('Apple TV 4K (2nd generation)', 'Apple TV', 2021, true),
('Apple TV HD', 'Apple TV', 2015, true),

-- Accessories (2020-2025)
('Magic Keyboard for iPad Pro 13-inch (M4)', 'Accessories', 2024, true),
('Magic Keyboard for iPad Pro 11-inch (M4)', 'Accessories', 2024, true),
('Magic Keyboard for iPad Air 13-inch (M2)', 'Accessories', 2024, true),
('Magic Keyboard for iPad Air 11-inch (M2)', 'Accessories', 2024, true),
('Apple Pencil Pro', 'Accessories', 2024, true),
('Apple Pencil (2nd generation)', 'Accessories', 2018, true),
('Apple Pencil (1st generation)', 'Accessories', 2015, true),
('Magic Mouse', 'Accessories', 2021, true),
('Magic Trackpad', 'Accessories', 2021, true),
('Magic Keyboard', 'Accessories', 2021, true),
('Magic Keyboard with Touch ID', 'Accessories', 2021, true),
('Studio Display', 'Accessories', 2022, true),
('Pro Display XDR', 'Accessories', 2019, true)

-- Handle conflicts (update if exists)
ON CONFLICT (name) DO UPDATE SET
    category = EXCLUDED.category,
    release_year = EXCLUDED.release_year,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_device_models_updated_at 
    BEFORE UPDATE ON public.device_models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT ON public.device_models TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify the data was inserted
SELECT 
    category,
    COUNT(*) as model_count,
    MIN(release_year) as earliest_year,
    MAX(release_year) as latest_year
FROM public.device_models 
WHERE is_active = true
GROUP BY category
ORDER BY category;
