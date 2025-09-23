-- Create cargo_shipments table for managing anonymous cargo deliveries
-- This table will track all shipment operations while maintaining user anonymity

CREATE TABLE public.cargo_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  
  -- Cargo company details
  cargo_company VARCHAR(50) NOT NULL, -- 'aras', 'mng', 'yurtici', 'ptt'
  tracking_number VARCHAR(100) UNIQUE, -- Cargo tracking number
  cargo_service_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'express', 'same_day'
  estimated_delivery_days INTEGER DEFAULT 2,
  
  -- Anonymous identities for privacy
  sender_anonymous_id VARCHAR(20) NOT NULL, -- Random ID for finder (e.g., 'FND-ABC123')
  receiver_anonymous_id VARCHAR(20) NOT NULL, -- Random ID for owner (e.g., 'OWN-XYZ789')
  
  -- Actual user IDs (for internal tracking only)
  sender_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Finder
  receiver_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Owner
  
  -- Shipment addresses (encrypted for privacy)
  sender_address_encrypted TEXT, -- Encrypted pickup address
  receiver_address_encrypted TEXT, -- Encrypted delivery address
  
  -- Shipment status tracking
  status VARCHAR(30) NOT NULL DEFAULT 'created' CHECK (status IN (
    'created',      -- Shipment record created
    'label_printed', -- Cargo label generated
    'picked_up',    -- Package picked up from sender
    'in_transit',   -- Package in transit
    'out_for_delivery', -- Package out for delivery
    'delivered',    -- Package delivered successfully
    'failed_delivery', -- Delivery failed
    'returned',     -- Package returned to sender
    'cancelled'     -- Shipment cancelled
  )),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Cargo details
  package_weight DECIMAL(5,2), -- Weight in kg
  package_dimensions VARCHAR(50), -- e.g., "20x15x5 cm"
  declared_value DECIMAL(10,2), -- Declared value for insurance
  cargo_fee DECIMAL(8,2) NOT NULL DEFAULT 25.00,
  
  -- Delivery confirmation
  delivery_confirmed_by_receiver BOOLEAN DEFAULT false,
  delivery_confirmation_date TIMESTAMP WITH TIME ZONE,
  delivery_signature TEXT, -- Digital signature or confirmation code
  delivery_photos TEXT[], -- URLs to delivery proof photos
  
  -- Additional metadata
  special_instructions TEXT,
  notes TEXT,
  failure_reason TEXT
);

-- Create indexes for performance
CREATE INDEX idx_cargo_shipments_device_id ON public.cargo_shipments(device_id);
CREATE INDEX idx_cargo_shipments_payment_id ON public.cargo_shipments(payment_id);
CREATE INDEX idx_cargo_shipments_tracking_number ON public.cargo_shipments(tracking_number);
CREATE INDEX idx_cargo_shipments_sender_user_id ON public.cargo_shipments(sender_user_id);
CREATE INDEX idx_cargo_shipments_receiver_user_id ON public.cargo_shipments(receiver_user_id);
CREATE INDEX idx_cargo_shipments_status ON public.cargo_shipments(status);
CREATE INDEX idx_cargo_shipments_cargo_company ON public.cargo_shipments(cargo_company);
CREATE INDEX idx_cargo_shipments_created_at ON public.cargo_shipments(created_at);

-- Add RLS (Row Level Security)
ALTER TABLE public.cargo_shipments ENABLE ROW LEVEL SECURITY;

-- Users can view shipments where they are sender or receiver
CREATE POLICY "Users can view own shipments" ON public.cargo_shipments
  FOR SELECT USING (
    auth.uid() = sender_user_id OR 
    auth.uid() = receiver_user_id
  );

-- Only authenticated users can create shipments (with proper user validation)
CREATE POLICY "Users can create shipments" ON public.cargo_shipments
  FOR INSERT WITH CHECK (
    auth.uid() = sender_user_id OR 
    auth.uid() = receiver_user_id
  );

-- Users can update their own shipment status (for delivery confirmations)
CREATE POLICY "Users can update own shipments" ON public.cargo_shipments
  FOR UPDATE USING (
    auth.uid() = sender_user_id OR 
    auth.uid() = receiver_user_id
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cargo_shipments_updated_at 
    BEFORE UPDATE ON public.cargo_shipments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate anonymous IDs
CREATE OR REPLACE FUNCTION generate_anonymous_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  random_suffix TEXT;
BEGIN
  -- Generate a random 6-character alphanumeric string
  random_suffix := upper(substring(md5(random()::text) from 1 for 6));
  RETURN prefix || '-' || random_suffix;
END;
$$ LANGUAGE plpgsql;

-- Function to create a new cargo shipment
CREATE OR REPLACE FUNCTION create_cargo_shipment(
  p_device_id UUID,
  p_payment_id UUID,
  p_cargo_company VARCHAR(50),
  p_sender_user_id UUID,
  p_receiver_user_id UUID,
  p_sender_address TEXT,
  p_receiver_address TEXT,
  p_cargo_service_type VARCHAR(50) DEFAULT 'standard',
  p_declared_value DECIMAL(10,2) DEFAULT 1000.00
)
RETURNS UUID AS $$
DECLARE
  new_shipment_id UUID;
  sender_anon_id TEXT;
  receiver_anon_id TEXT;
BEGIN
  -- Generate anonymous IDs
  sender_anon_id := generate_anonymous_id('FND');
  receiver_anon_id := generate_anonymous_id('OWN');
  
  -- Insert new shipment record
  INSERT INTO public.cargo_shipments (
    device_id,
    payment_id,
    cargo_company,
    cargo_service_type,
    sender_anonymous_id,
    receiver_anonymous_id,
    sender_user_id,
    receiver_user_id,
    sender_address_encrypted,
    receiver_address_encrypted,
    declared_value
  ) VALUES (
    p_device_id,
    p_payment_id,
    p_cargo_company,
    p_cargo_service_type,
    sender_anon_id,
    receiver_anon_id,
    p_sender_user_id,
    p_receiver_user_id,
    p_sender_address, -- TODO: Implement encryption
    p_receiver_address, -- TODO: Implement encryption
    p_declared_value
  ) RETURNING id INTO new_shipment_id;
  
  RETURN new_shipment_id;
END;
$$ LANGUAGE plpgsql;

-- Create view for shipment tracking (limited information for privacy)
CREATE VIEW public.shipment_tracking AS
SELECT 
    cs.id,
    cs.device_id,
    cs.tracking_number,
    cs.cargo_company,
    cs.status,
    cs.created_at,
    cs.picked_up_at,
    cs.delivered_at,
    cs.estimated_delivery_days,
    cs.delivery_confirmed_by_receiver,
    d.model as device_model,
    CASE 
      WHEN auth.uid() = cs.sender_user_id THEN cs.sender_anonymous_id
      WHEN auth.uid() = cs.receiver_user_id THEN cs.receiver_anonymous_id
      ELSE NULL
    END as user_anonymous_id,
    CASE 
      WHEN auth.uid() = cs.sender_user_id THEN 'sender'
      WHEN auth.uid() = cs.receiver_user_id THEN 'receiver'
      ELSE NULL
    END as user_role
FROM public.cargo_shipments cs
JOIN public.devices d ON cs.device_id = d.id
WHERE auth.uid() = cs.sender_user_id OR auth.uid() = cs.receiver_user_id;

-- Grant access to the view
GRANT SELECT ON public.shipment_tracking TO authenticated;

-- Insert sample cargo companies configuration
CREATE TABLE public.cargo_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  api_endpoint VARCHAR(255),
  tracking_url_template VARCHAR(255), -- e.g., 'https://www.aras.com.tr/cargo-tracking?code={tracking_number}'
  standard_delivery_days INTEGER DEFAULT 2,
  express_delivery_days INTEGER DEFAULT 1,
  base_fee DECIMAL(8,2) DEFAULT 25.00,
  express_fee_multiplier DECIMAL(3,2) DEFAULT 1.5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Turkish cargo companies
INSERT INTO public.cargo_companies (code, name, tracking_url_template, standard_delivery_days, express_delivery_days, base_fee) VALUES
('aras', 'Aras Kargo', 'https://www.aras.com.tr/cargo-tracking?code={tracking_number}', 2, 1, 25.00),
('mng', 'MNG Kargo', 'https://www.mngkargo.com.tr/tracking?code={tracking_number}', 2, 1, 28.00),
('yurtici', 'Yurtiçi Kargo', 'https://www.yurticikargo.com/tr/tracking?code={tracking_number}', 3, 1, 30.00),
('ptt', 'PTT Kargo', 'https://www.ptt.gov.tr/tracking?code={tracking_number}', 3, 2, 22.00);

-- Add RLS for cargo companies (read-only for all authenticated users)
ALTER TABLE public.cargo_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read cargo companies" ON public.cargo_companies FOR SELECT USING (auth.role() = 'authenticated');
GRANT SELECT ON public.cargo_companies TO authenticated;
