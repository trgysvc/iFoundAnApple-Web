-- Create device_models table for Apple device pricing and reward percentages
-- This table will store official Apple exchange prices and reward calculation rates

CREATE TABLE public.device_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand VARCHAR(50) NOT NULL DEFAULT 'Apple',
  model VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'iPhone', 'iPad', 'MacBook', 'Apple Watch', 'AirPods'
  apple_exchange_price DECIMAL(10,2) NOT NULL, -- Apple'ın resmi değişim ücreti (TL)
  reward_percentage DECIMAL(5,2) NOT NULL DEFAULT 15.00, -- Ödül yüzdesi (%)
  min_reward_amount DECIMAL(8,2) NOT NULL DEFAULT 100.00, -- Minimum ödül miktarı (TL)
  max_reward_amount DECIMAL(8,2) NOT NULL DEFAULT 5000.00, -- Maksimum ödül miktarı (TL)
  cargo_fee DECIMAL(8,2) NOT NULL DEFAULT 25.00, -- Kargo ücreti (TL)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on brand and model combination
CREATE UNIQUE INDEX idx_device_models_brand_model ON public.device_models(brand, model);

-- Create index for faster lookups
CREATE INDEX idx_device_models_category ON public.device_models(category);
CREATE INDEX idx_device_models_active ON public.device_models(is_active);

-- Add RLS (Row Level Security)
ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read device models (for pricing calculations)
CREATE POLICY "Allow read access to device models" ON public.device_models
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can modify device models (you'll need to implement admin role check)
-- For now, we'll allow authenticated users to insert (you can restrict this later)
CREATE POLICY "Allow admin access to device models" ON public.device_models
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample Apple device data with realistic Turkish pricing
INSERT INTO public.device_models (brand, model, category, apple_exchange_price, reward_percentage, min_reward_amount, max_reward_amount, cargo_fee) VALUES
-- iPhone Models
('Apple', 'iPhone 15 Pro Max', 'iPhone', 65000.00, 20.00, 500.00, 8000.00, 30.00),
('Apple', 'iPhone 15 Pro', 'iPhone', 55000.00, 20.00, 500.00, 7000.00, 30.00),
('Apple', 'iPhone 15', 'iPhone', 45000.00, 18.00, 400.00, 6000.00, 25.00),
('Apple', 'iPhone 14 Pro Max', 'iPhone', 50000.00, 18.00, 400.00, 6500.00, 25.00),
('Apple', 'iPhone 14 Pro', 'iPhone', 42000.00, 18.00, 350.00, 5500.00, 25.00),
('Apple', 'iPhone 14', 'iPhone', 35000.00, 16.00, 300.00, 4500.00, 25.00),
('Apple', 'iPhone 13', 'iPhone', 28000.00, 15.00, 250.00, 3500.00, 25.00),
('Apple', 'iPhone 12', 'iPhone', 22000.00, 15.00, 200.00, 2800.00, 25.00),

-- iPad Models
('Apple', 'iPad Pro 12.9-inch', 'iPad', 35000.00, 18.00, 300.00, 4500.00, 35.00),
('Apple', 'iPad Pro 11-inch', 'iPad', 28000.00, 18.00, 250.00, 3500.00, 35.00),
('Apple', 'iPad Air', 'iPad', 20000.00, 16.00, 200.00, 2500.00, 30.00),
('Apple', 'iPad', 'iPad', 12000.00, 15.00, 150.00, 1500.00, 30.00),

-- MacBook Models
('Apple', 'MacBook Pro 16-inch', 'MacBook', 80000.00, 22.00, 800.00, 12000.00, 50.00),
('Apple', 'MacBook Pro 14-inch', 'MacBook', 65000.00, 22.00, 650.00, 10000.00, 50.00),
('Apple', 'MacBook Air 15-inch', 'MacBook', 45000.00, 20.00, 450.00, 7000.00, 45.00),
('Apple', 'MacBook Air 13-inch', 'MacBook', 35000.00, 20.00, 350.00, 5500.00, 45.00),

-- Apple Watch Models
('Apple', 'Apple Watch Ultra 2', 'Apple Watch', 25000.00, 16.00, 200.00, 3000.00, 20.00),
('Apple', 'Apple Watch Series 9', 'Apple Watch', 15000.00, 15.00, 150.00, 2000.00, 20.00),
('Apple', 'Apple Watch SE', 'Apple Watch', 8000.00, 14.00, 100.00, 1000.00, 20.00),

-- AirPods Models
('Apple', 'AirPods Pro 2nd generation', 'AirPods', 8000.00, 14.00, 100.00, 800.00, 15.00),
('Apple', 'AirPods 3rd generation', 'AirPods', 5500.00, 13.00, 80.00, 600.00, 15.00),
('Apple', 'AirPods 2nd generation', 'AirPods', 4000.00, 12.00, 60.00, 400.00, 15.00),
('Apple', 'AirPods Max', 'AirPods', 20000.00, 16.00, 200.00, 2500.00, 25.00);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_device_models_updated_at 
    BEFORE UPDATE ON public.device_models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for easier querying with calculated values
CREATE VIEW public.device_models_with_calculations AS
SELECT 
    dm.*,
    ROUND(dm.apple_exchange_price * dm.reward_percentage / 100, 2) as calculated_reward,
    CASE 
        WHEN (dm.apple_exchange_price * dm.reward_percentage / 100) < dm.min_reward_amount 
        THEN dm.min_reward_amount
        WHEN (dm.apple_exchange_price * dm.reward_percentage / 100) > dm.max_reward_amount 
        THEN dm.max_reward_amount
        ELSE ROUND(dm.apple_exchange_price * dm.reward_percentage / 100, 2)
    END as final_reward_amount
FROM public.device_models dm
WHERE dm.is_active = true;

-- Grant access to the view
GRANT SELECT ON public.device_models_with_calculations TO authenticated;
