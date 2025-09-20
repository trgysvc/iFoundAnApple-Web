-- Create financial_transactions table for comprehensive financial tracking
-- This table will serve as a complete audit trail for all financial operations

CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  
  -- Transaction parties
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Transaction details
  transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
    'payment_received',    -- Initial payment from device owner
    'escrow_hold',        -- Money held in escrow
    'service_fee_deduction', -- Platform service fee deduction
    'gateway_fee_deduction', -- Payment gateway fee deduction
    'cargo_fee_deduction', -- Cargo shipping fee deduction
    'reward_payout',      -- Final reward payout to finder
    'refund_issued',      -- Refund to device owner
    'chargeback',         -- Chargeback from payment provider
    'adjustment'          -- Manual adjustment by admin
  )),
  
  -- Financial amounts (all in Turkish Lira - TL)
  amount DECIMAL(10,2) NOT NULL, -- Transaction amount (positive for credits, negative for debits)
  currency VARCHAR(3) DEFAULT 'TRY',
  
  -- Transaction status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',     -- Transaction initiated
    'processing',  -- Transaction being processed
    'completed',   -- Transaction completed successfully
    'failed',      -- Transaction failed
    'cancelled',   -- Transaction cancelled
    'reversed'     -- Transaction reversed
  )),
  
  -- External references
  external_transaction_id VARCHAR(200), -- ID from payment provider
  external_reference VARCHAR(200),      -- Additional external reference
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional information
  description TEXT,
  metadata JSONB, -- Additional structured data
  notes TEXT,
  
  -- Accounting fields
  debit_account VARCHAR(50),  -- For double-entry bookkeeping
  credit_account VARCHAR(50), -- For double-entry bookkeeping
  
  -- Admin tracking
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for performance and reporting
CREATE INDEX idx_financial_transactions_payment_id ON public.financial_transactions(payment_id);
CREATE INDEX idx_financial_transactions_device_id ON public.financial_transactions(device_id);
CREATE INDEX idx_financial_transactions_from_user_id ON public.financial_transactions(from_user_id);
CREATE INDEX idx_financial_transactions_to_user_id ON public.financial_transactions(to_user_id);
CREATE INDEX idx_financial_transactions_type ON public.financial_transactions(transaction_type);
CREATE INDEX idx_financial_transactions_status ON public.financial_transactions(status);
CREATE INDEX idx_financial_transactions_created_at ON public.financial_transactions(created_at);
CREATE INDEX idx_financial_transactions_external_id ON public.financial_transactions(external_transaction_id);

-- Composite index for reporting
CREATE INDEX idx_financial_transactions_type_status_date ON public.financial_transactions(transaction_type, status, created_at);

-- Add RLS (Row Level Security)
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view transactions they are involved in
CREATE POLICY "Users can view own transactions" ON public.financial_transactions
  FOR SELECT USING (
    auth.uid() = from_user_id OR 
    auth.uid() = to_user_id OR
    auth.uid() IN (
      SELECT d.userId FROM public.devices d WHERE d.id = device_id
    )
  );

-- Only system/admin can create and modify financial transactions
CREATE POLICY "System can manage transactions" ON public.financial_transactions
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to automatically update timestamps
CREATE TRIGGER update_financial_transactions_updated_at 
    BEFORE UPDATE ON public.financial_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create a complete payment transaction flow
CREATE OR REPLACE FUNCTION process_payment_transaction_flow(
  p_payment_id UUID,
  p_device_id UUID,
  p_from_user_id UUID,
  p_to_user_id UUID,
  p_total_amount DECIMAL(10,2),
  p_reward_amount DECIMAL(10,2),
  p_service_fee DECIMAL(10,2),
  p_gateway_fee DECIMAL(10,2),
  p_cargo_fee DECIMAL(10,2),
  p_external_transaction_id VARCHAR(200)
)
RETURNS BOOLEAN AS $$
DECLARE
  transaction_success BOOLEAN := true;
BEGIN
  -- 1. Record initial payment received
  INSERT INTO public.financial_transactions (
    payment_id, device_id, from_user_id, to_user_id,
    transaction_type, amount, status, external_transaction_id,
    description, debit_account, credit_account
  ) VALUES (
    p_payment_id, p_device_id, p_from_user_id, NULL,
    'payment_received', p_total_amount, 'completed', p_external_transaction_id,
    'Payment received from device owner', 'customer_payments', 'escrow_account'
  );

  -- 2. Record escrow hold
  INSERT INTO public.financial_transactions (
    payment_id, device_id, from_user_id, to_user_id,
    transaction_type, amount, status,
    description, debit_account, credit_account
  ) VALUES (
    p_payment_id, p_device_id, p_from_user_id, p_to_user_id,
    'escrow_hold', p_total_amount, 'completed',
    'Payment held in escrow pending exchange completion', 'escrow_account', 'escrow_held'
  );

  -- 3. Record service fee deduction (will be processed later)
  INSERT INTO public.financial_transactions (
    payment_id, device_id, from_user_id, to_user_id,
    transaction_type, amount, status,
    description, debit_account, credit_account
  ) VALUES (
    p_payment_id, p_device_id, NULL, NULL,
    'service_fee_deduction', -p_service_fee, 'pending',
    'Platform service fee (15%)', 'escrow_held', 'service_revenue'
  );

  -- 4. Record gateway fee deduction
  INSERT INTO public.financial_transactions (
    payment_id, device_id, from_user_id, to_user_id,
    transaction_type, amount, status,
    description, debit_account, credit_account
  ) VALUES (
    p_payment_id, p_device_id, NULL, NULL,
    'gateway_fee_deduction', -p_gateway_fee, 'pending',
    'Payment gateway processing fee', 'escrow_held', 'gateway_fees'
  );

  -- 5. Record cargo fee deduction
  INSERT INTO public.financial_transactions (
    payment_id, device_id, from_user_id, to_user_id,
    transaction_type, amount, status,
    description, debit_account, credit_account
  ) VALUES (
    p_payment_id, p_device_id, NULL, NULL,
    'cargo_fee_deduction', -p_cargo_fee, 'pending',
    'Cargo shipping fee', 'escrow_held', 'cargo_expenses'
  );

  -- 6. Record pending reward payout
  INSERT INTO public.financial_transactions (
    payment_id, device_id, from_user_id, to_user_id,
    transaction_type, amount, status,
    description, debit_account, credit_account
  ) VALUES (
    p_payment_id, p_device_id, NULL, p_to_user_id,
    'reward_payout', (p_reward_amount - p_service_fee), 'pending',
    'Reward payout to finder (after service fee)', 'escrow_held', 'finder_payouts'
  );

  RETURN transaction_success;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to complete escrow release
CREATE OR REPLACE FUNCTION complete_escrow_release(p_payment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  transaction_success BOOLEAN := true;
BEGIN
  -- Update all pending transactions for this payment to completed
  UPDATE public.financial_transactions 
  SET 
    status = 'completed',
    processed_at = NOW(),
    completed_at = NOW()
  WHERE 
    payment_id = p_payment_id 
    AND status = 'pending'
    AND transaction_type IN ('service_fee_deduction', 'gateway_fee_deduction', 'cargo_fee_deduction', 'reward_payout');
  
  RETURN transaction_success;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for financial reporting
CREATE MATERIALIZED VIEW public.financial_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as transaction_date,
    transaction_type,
    status,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    MIN(amount) as min_amount,
    MAX(amount) as max_amount
FROM public.financial_transactions
GROUP BY DATE_TRUNC('day', created_at), transaction_type, status
ORDER BY transaction_date DESC, transaction_type;

-- Create index on materialized view
CREATE INDEX idx_financial_summary_date ON public.financial_summary(transaction_date);
CREATE INDEX idx_financial_summary_type ON public.financial_summary(transaction_type);

-- Function to refresh financial summary (should be called periodically)
CREATE OR REPLACE FUNCTION refresh_financial_summary()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.financial_summary;
END;
$$ LANGUAGE plpgsql;

-- Create view for user transaction history
CREATE VIEW public.user_transaction_history AS
SELECT 
    ft.id,
    ft.payment_id,
    ft.device_id,
    ft.transaction_type,
    ft.amount,
    ft.currency,
    ft.status,
    ft.created_at,
    ft.completed_at,
    ft.description,
    d.model as device_model,
           d."serialNumber" as device_serial,
    CASE 
      WHEN ft.from_user_id = auth.uid() THEN 'outgoing'
      WHEN ft.to_user_id = auth.uid() THEN 'incoming'
      ELSE 'related'
    END as transaction_direction
FROM public.financial_transactions ft
JOIN public.devices d ON ft.device_id = d.id
WHERE 
    ft.from_user_id = auth.uid() 
    OR ft.to_user_id = auth.uid()
    OR d."userId" = auth.uid()
ORDER BY ft.created_at DESC;

-- Grant access to views
GRANT SELECT ON public.user_transaction_history TO authenticated;
GRANT SELECT ON public.financial_summary TO authenticated;
