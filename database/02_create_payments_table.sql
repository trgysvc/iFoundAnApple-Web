-- Create payments table for managing escrow payments and transactions
-- This table will track all payment operations including holds and releases

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- The finder who will receive the reward
  
  -- Payment amounts (all in Turkish Lira - TL)
  total_amount DECIMAL(10,2) NOT NULL, -- Total amount paid by device owner
  reward_amount DECIMAL(10,2) NOT NULL, -- Base reward amount for finder
  cargo_fee DECIMAL(10,2) NOT NULL DEFAULT 25.00, -- Shipping cost
  payment_gateway_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Iyzico/Stripe commission
  service_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- ifoundanapple service fee (15%)
  net_payout DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Final amount to be paid to finder
  
  -- Payment gateway details
  payment_provider VARCHAR(50) NOT NULL DEFAULT 'iyzico', -- 'iyzico', 'stripe', 'test'
  provider_payment_id VARCHAR(200), -- Payment ID from the gateway
  provider_transaction_id VARCHAR(200), -- Transaction ID from the gateway
  provider_status VARCHAR(50), -- Gateway specific status
  provider_response TEXT, -- Full response from gateway (JSON)
  
  -- Escrow management
  escrow_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'held', 'released', 'refunded', 'failed')),
  escrow_held_at TIMESTAMP WITH TIME ZONE,
  escrow_released_at TIMESTAMP WITH TIME ZONE,
  escrow_refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment status tracking
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method VARCHAR(50), -- 'credit_card', 'debit_card', 'bank_transfer'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional metadata
  currency VARCHAR(3) DEFAULT 'TRY',
  notes TEXT,
  failure_reason TEXT,
  refund_reason TEXT
);

-- Create indexes for performance
CREATE INDEX idx_payments_device_id ON public.payments(device_id);
CREATE INDEX idx_payments_payer_id ON public.payments(payer_id);
CREATE INDEX idx_payments_receiver_id ON public.payments(receiver_id);
CREATE INDEX idx_payments_escrow_status ON public.payments(escrow_status);
CREATE INDEX idx_payments_payment_status ON public.payments(payment_status);
CREATE INDEX idx_payments_provider_payment_id ON public.payments(provider_payment_id);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);

-- Add RLS (Row Level Security)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment records (as payer or receiver)
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    auth.uid() = payer_id OR 
    auth.uid() = receiver_id
  );

-- Only payers can create payment records
CREATE POLICY "Payers can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- System/admin can update payment status (you'll need to implement proper admin checks)
CREATE POLICY "System can update payments" ON public.payments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON public.payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate payment breakdown
CREATE OR REPLACE FUNCTION calculate_payment_breakdown(
  base_reward_amount DECIMAL(10,2),
  cargo_fee_amount DECIMAL(10,2) DEFAULT 25.00,
  service_fee_percentage DECIMAL(5,2) DEFAULT 15.00
)
RETURNS TABLE(
  total_amount DECIMAL(10,2),
  reward_amount DECIMAL(10,2),
  cargo_fee DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  payment_gateway_fee DECIMAL(10,2),
  net_payout DECIMAL(10,2)
) AS $$
DECLARE
  calculated_service_fee DECIMAL(10,2);
  calculated_gateway_fee DECIMAL(10,2);
  calculated_total DECIMAL(10,2);
  calculated_net_payout DECIMAL(10,2);
BEGIN
  -- Calculate service fee (15% of reward)
  calculated_service_fee := ROUND(base_reward_amount * service_fee_percentage / 100, 2);
  
  -- Calculate total amount (reward + cargo + service fee)
  calculated_total := base_reward_amount + cargo_fee_amount + calculated_service_fee;
  
  -- Calculate payment gateway fee (approximately 2.9% of total for Iyzico)
  calculated_gateway_fee := ROUND(calculated_total * 2.9 / 100, 2);
  
  -- Add gateway fee to total
  calculated_total := calculated_total + calculated_gateway_fee;
  
  -- Calculate net payout to finder (reward - service fee)
  calculated_net_payout := base_reward_amount - calculated_service_fee;
  
  RETURN QUERY SELECT 
    calculated_total,
    base_reward_amount,
    cargo_fee_amount,
    calculated_service_fee,
    calculated_gateway_fee,
    calculated_net_payout;
END;
$$ LANGUAGE plpgsql;

-- Create view for payment summaries with device information
CREATE VIEW public.payment_summaries AS
SELECT 
    p.*,
    d.model as device_model,
    d."serialNumber" as device_serial,
    d.status as device_status,
    payer.email as payer_email,
    receiver.email as receiver_email
FROM public.payments p
JOIN public.devices d ON p.device_id = d.id
JOIN auth.users payer ON p.payer_id = payer.id
LEFT JOIN auth.users receiver ON p.receiver_id = receiver.id;

-- Grant access to the view
GRANT SELECT ON public.payment_summaries TO authenticated;
