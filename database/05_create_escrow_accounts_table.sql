-- Create escrow_accounts table for managing secure payment holds and releases
-- This table tracks all escrow operations and release conditions

CREATE TABLE public.escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  
  -- Parties involved
  holder_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Device owner who made payment
  beneficiary_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Finder who will receive reward
  
  -- Financial amounts (all in Turkish Lira - TL)
  total_amount DECIMAL(10,2) NOT NULL, -- Total amount held in escrow
  reward_amount DECIMAL(10,2) NOT NULL, -- Base reward amount
  service_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Platform service fee (15%)
  gateway_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Payment gateway fee
  cargo_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Cargo shipping fee
  net_payout DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Final amount to be paid to beneficiary
  
  -- Escrow status and timestamps
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  held_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Release conditions and confirmations (stored as JSONB for flexibility)
  release_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  confirmations JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Additional metadata
  currency VARCHAR(3) DEFAULT 'TRY',
  notes TEXT,
  admin_notes TEXT,
  
  -- Audit fields
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  released_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  refunded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_escrow_accounts_payment_id ON public.escrow_accounts(payment_id);
CREATE INDEX idx_escrow_accounts_device_id ON public.escrow_accounts(device_id);
CREATE INDEX idx_escrow_accounts_holder_user_id ON public.escrow_accounts(holder_user_id);
CREATE INDEX idx_escrow_accounts_beneficiary_user_id ON public.escrow_accounts(beneficiary_user_id);
CREATE INDEX idx_escrow_accounts_status ON public.escrow_accounts(status);
CREATE INDEX idx_escrow_accounts_created_at ON public.escrow_accounts(created_at);
CREATE INDEX idx_escrow_accounts_held_at ON public.escrow_accounts(held_at);

-- Composite indexes for common queries
CREATE INDEX idx_escrow_accounts_status_created ON public.escrow_accounts(status, created_at);
CREATE INDEX idx_escrow_accounts_beneficiary_status ON public.escrow_accounts(beneficiary_user_id, status);

-- Add RLS (Row Level Security)
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;

-- Users can view escrow accounts where they are holder or beneficiary
CREATE POLICY "Users can view own escrow accounts" ON public.escrow_accounts
  FOR SELECT USING (
    auth.uid() = holder_user_id OR 
    auth.uid() = beneficiary_user_id
  );

-- Only system/admin can create and modify escrow accounts
CREATE POLICY "System can manage escrow accounts" ON public.escrow_accounts
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to automatically update timestamps
CREATE TRIGGER update_escrow_accounts_updated_at 
    BEFORE UPDATE ON public.escrow_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create escrow account with initial conditions
CREATE OR REPLACE FUNCTION create_escrow_account(
  p_payment_id UUID,
  p_device_id UUID,
  p_holder_user_id UUID,
  p_beneficiary_user_id UUID,
  p_total_amount DECIMAL(10,2),
  p_reward_amount DECIMAL(10,2),
  p_service_fee DECIMAL(10,2),
  p_gateway_fee DECIMAL(10,2),
  p_cargo_fee DECIMAL(10,2)
)
RETURNS UUID AS $$
DECLARE
  new_escrow_id UUID;
  net_payout DECIMAL(10,2);
  initial_conditions JSONB;
BEGIN
  -- Calculate net payout
  net_payout := p_reward_amount - p_service_fee;
  
  -- Define initial release conditions
  initial_conditions := '[
    {
      "type": "both_parties_confirm",
      "description": "Her iki taraf da takası onaylamalı",
      "met": false
    },
    {
      "type": "delivery_confirmed", 
      "description": "Teslimat alıcı tarafından onaylanmalı",
      "met": false
    }
  ]'::jsonb;
  
  -- Insert new escrow account
  INSERT INTO public.escrow_accounts (
    payment_id,
    device_id,
    holder_user_id,
    beneficiary_user_id,
    total_amount,
    reward_amount,
    service_fee,
    gateway_fee,
    cargo_fee,
    net_payout,
    status,
    held_at,
    release_conditions,
    confirmations
  ) VALUES (
    p_payment_id,
    p_device_id,
    p_holder_user_id,
    p_beneficiary_user_id,
    p_total_amount,
    p_reward_amount,
    p_service_fee,
    p_gateway_fee,
    p_cargo_fee,
    net_payout,
    'held',
    NOW(),
    initial_conditions,
    '[]'::jsonb
  ) RETURNING id INTO new_escrow_id;
  
  RETURN new_escrow_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add confirmation to escrow account
CREATE OR REPLACE FUNCTION add_escrow_confirmation(
  p_escrow_id UUID,
  p_user_id UUID,
  p_user_role VARCHAR(10),
  p_confirmation_type VARCHAR(20),
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_confirmations JSONB;
  current_conditions JSONB;
  new_confirmation JSONB;
  updated_confirmations JSONB;
  updated_conditions JSONB;
  confirmation_count INTEGER;
  should_release BOOLEAN := FALSE;
BEGIN
  -- Get current confirmations and conditions
  SELECT confirmations, release_conditions 
  INTO current_confirmations, current_conditions
  FROM public.escrow_accounts 
  WHERE id = p_escrow_id AND status = 'held';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user already confirmed
  IF current_confirmations @> jsonb_build_array(jsonb_build_object('user_id', p_user_id)) THEN
    RETURN TRUE; -- Already confirmed
  END IF;
  
  -- Create new confirmation
  new_confirmation := jsonb_build_object(
    'user_id', p_user_id,
    'user_role', p_user_role,
    'confirmed_at', NOW(),
    'confirmation_type', p_confirmation_type,
    'notes', p_notes
  );
  
  -- Add to confirmations array
  updated_confirmations := current_confirmations || jsonb_build_array(new_confirmation);
  confirmation_count := jsonb_array_length(updated_confirmations);
  
  -- Update conditions based on confirmations
  updated_conditions := current_conditions;
  
  -- Update both_parties_confirm condition
  IF confirmation_count >= 2 THEN
    updated_conditions := jsonb_set(
      updated_conditions,
      '{0,met}',
      'true'::jsonb
    );
    updated_conditions := jsonb_set(
      updated_conditions,
      '{0,met_at}',
      to_jsonb(NOW()::text)
    );
  END IF;
  
  -- Update delivery_confirmed condition if delivery confirmation exists
  IF updated_confirmations @> jsonb_build_array(jsonb_build_object('confirmation_type', 'delivery_received')) THEN
    updated_conditions := jsonb_set(
      updated_conditions,
      '{1,met}',
      'true'::jsonb
    );
    updated_conditions := jsonb_set(
      updated_conditions,
      '{1,met_at}',
      to_jsonb(NOW()::text)
    );
  END IF;
  
  -- Check if all conditions are met
  IF (updated_conditions->0->>'met')::boolean = true AND 
     (updated_conditions->1->>'met')::boolean = true THEN
    should_release := TRUE;
  END IF;
  
  -- Update escrow account
  IF should_release THEN
    UPDATE public.escrow_accounts 
    SET 
      confirmations = updated_confirmations,
      release_conditions = updated_conditions,
      status = 'released',
      released_at = NOW()
    WHERE id = p_escrow_id;
  ELSE
    UPDATE public.escrow_accounts 
    SET 
      confirmations = updated_confirmations,
      release_conditions = updated_conditions
    WHERE id = p_escrow_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get escrow summary for user
CREATE OR REPLACE FUNCTION get_user_escrow_summary(p_user_id UUID)
RETURNS TABLE(
  total_held DECIMAL(10,2),
  total_received DECIMAL(10,2),
  active_escrows INTEGER,
  completed_escrows INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN status = 'held' AND holder_user_id = p_user_id THEN total_amount ELSE 0 END), 0) as total_held,
    COALESCE(SUM(CASE WHEN status = 'released' AND beneficiary_user_id = p_user_id THEN net_payout ELSE 0 END), 0) as total_received,
    COUNT(CASE WHEN status = 'held' AND (holder_user_id = p_user_id OR beneficiary_user_id = p_user_id) THEN 1 END)::INTEGER as active_escrows,
    COUNT(CASE WHEN status = 'released' AND (holder_user_id = p_user_id OR beneficiary_user_id = p_user_id) THEN 1 END)::INTEGER as completed_escrows
  FROM public.escrow_accounts
  WHERE holder_user_id = p_user_id OR beneficiary_user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for escrow analytics
CREATE MATERIALIZED VIEW public.escrow_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    status,
    COUNT(*) as escrow_count,
    SUM(total_amount) as total_amount,
    AVG(total_amount) as average_amount,
    SUM(net_payout) as total_payout,
    AVG(
      CASE 
        WHEN status = 'released' AND held_at IS NOT NULL AND released_at IS NOT NULL
        THEN EXTRACT(EPOCH FROM (released_at - held_at)) / 3600 -- Hours
        ELSE NULL
      END
    ) as average_hold_time_hours
FROM public.escrow_accounts
GROUP BY DATE_TRUNC('day', created_at), status
ORDER BY date DESC, status;

-- Create index on materialized view
CREATE INDEX idx_escrow_analytics_date ON public.escrow_analytics(date);
CREATE INDEX idx_escrow_analytics_status ON public.escrow_analytics(status);

-- Function to refresh escrow analytics (should be called periodically)
CREATE OR REPLACE FUNCTION refresh_escrow_analytics()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.escrow_analytics;
END;
$$ LANGUAGE plpgsql;

-- Create view for user escrow history
CREATE VIEW public.user_escrow_history AS
SELECT 
    ea.id,
    ea.payment_id,
    ea.device_id,
    ea.total_amount,
    ea.reward_amount,
    ea.net_payout,
    ea.status,
    ea.created_at,
    ea.held_at,
    ea.released_at,
    ea.refunded_at,
    ea.confirmations,
    d.model as device_model,
    d."serialNumber" as device_serial,
    CASE 
      WHEN ea.holder_user_id = auth.uid() THEN 'holder'
      WHEN ea.beneficiary_user_id = auth.uid() THEN 'beneficiary'
      ELSE NULL
    END as user_role,
    CASE 
      WHEN ea.holder_user_id = auth.uid() THEN 'Ödeme Yapan'
      WHEN ea.beneficiary_user_id = auth.uid() THEN 'Ödül Alacak'
      ELSE NULL
    END as user_role_description
FROM public.escrow_accounts ea
JOIN public.devices d ON ea.device_id = d.id
WHERE 
    ea.holder_user_id = auth.uid() 
    OR ea.beneficiary_user_id = auth.uid()
ORDER BY ea.created_at DESC;

-- Grant access to views
GRANT SELECT ON public.user_escrow_history TO authenticated;
GRANT SELECT ON public.escrow_analytics TO authenticated;
