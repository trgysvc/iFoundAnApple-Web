-- Add missing columns to payments table
-- These columns will be useful for future features and better data tracking

-- Add payer and device information columns
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payer_info JSONB, -- Payer's contact and address information
ADD COLUMN IF NOT EXISTS device_info JSONB, -- Device details and description
ADD COLUMN IF NOT EXISTS billing_address JSONB, -- Billing address for payment
ADD COLUMN IF NOT EXISTS shipping_address JSONB; -- Shipping address for delivery

-- Add payment method details
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS card_last_four VARCHAR(4), -- Last 4 digits of card
ADD COLUMN IF NOT EXISTS card_brand VARCHAR(20), -- Visa, Mastercard, etc.
ADD COLUMN IF NOT EXISTS card_expiry_month VARCHAR(2), -- Card expiry month
ADD COLUMN IF NOT EXISTS card_expiry_year VARCHAR(4), -- Card expiry year
ADD COLUMN IF NOT EXISTS card_holder_name VARCHAR(100); -- Cardholder name

-- Add fraud and security tracking
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS fraud_score INTEGER DEFAULT 0, -- Fraud risk score
ADD COLUMN IF NOT EXISTS ip_address INET, -- Payer's IP address
ADD COLUMN IF NOT EXISTS user_agent TEXT, -- Browser/device information
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high'));

-- Add 3D Secure information
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS threeds_enrolled BOOLEAN DEFAULT FALSE, -- 3D Secure enrollment status
ADD COLUMN IF NOT EXISTS threeds_status VARCHAR(20), -- 3D Secure authentication status
ADD COLUMN IF NOT EXISTS threeds_eci VARCHAR(2), -- Electronic Commerce Indicator
ADD COLUMN IF NOT EXISTS threeds_cavv VARCHAR(50); -- Cardholder Authentication Verification Value

-- Add webhook and callback tracking
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS webhook_received_at TIMESTAMP WITH TIME ZONE, -- When webhook was received
ADD COLUMN IF NOT EXISTS webhook_attempts INTEGER DEFAULT 0, -- Number of webhook attempts
ADD COLUMN IF NOT EXISTS callback_url TEXT, -- Callback URL for payment gateway
ADD COLUMN IF NOT EXISTS webhook_signature TEXT; -- Webhook signature for verification

-- Add audit and compliance fields
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS compliance_status VARCHAR(20) DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'rejected', 'review')),
ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT FALSE, -- Know Your Customer verification
ADD COLUMN IF NOT EXISTS aml_checked BOOLEAN DEFAULT FALSE, -- Anti-Money Laundering check
ADD COLUMN IF NOT EXISTS audit_trail JSONB; -- Complete audit trail

-- Add refund and dispute tracking
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2) DEFAULT 0.00, -- Refunded amount
ADD COLUMN IF NOT EXISTS refund_reason_code VARCHAR(20), -- Refund reason code
ADD COLUMN IF NOT EXISTS dispute_status VARCHAR(20) DEFAULT 'none' CHECK (dispute_status IN ('none', 'pending', 'won', 'lost')),
ADD COLUMN IF NOT EXISTS dispute_reason TEXT; -- Dispute reason

-- Add performance and analytics fields
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER, -- Processing time in milliseconds
ADD COLUMN IF NOT EXISTS gateway_response_time_ms INTEGER, -- Gateway response time
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0, -- Number of retry attempts
ADD COLUMN IF NOT EXISTS success_rate DECIMAL(5,2); -- Success rate for similar transactions

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_payments_payer_info ON public.payments USING GIN (payer_info);
CREATE INDEX IF NOT EXISTS idx_payments_device_info ON public.payments USING GIN (device_info);
CREATE INDEX IF NOT EXISTS idx_payments_fraud_score ON public.payments (fraud_score);
CREATE INDEX IF NOT EXISTS idx_payments_risk_level ON public.payments (risk_level);
CREATE INDEX IF NOT EXISTS idx_payments_threeds_status ON public.payments (threeds_status);
CREATE INDEX IF NOT EXISTS idx_payments_compliance_status ON public.payments (compliance_status);
CREATE INDEX IF NOT EXISTS idx_payments_dispute_status ON public.payments (dispute_status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments (created_at);

-- Add comments for documentation
COMMENT ON COLUMN public.payments.payer_info IS 'Payer contact information and address details';
COMMENT ON COLUMN public.payments.device_info IS 'Device details including model, serial number, and description';
COMMENT ON COLUMN public.payments.billing_address IS 'Billing address for payment processing';
COMMENT ON COLUMN public.payments.shipping_address IS 'Shipping address for device delivery';
COMMENT ON COLUMN public.payments.fraud_score IS 'Fraud risk score from 0-100';
COMMENT ON COLUMN public.payments.risk_level IS 'Overall risk assessment level';
COMMENT ON COLUMN public.payments.threeds_enrolled IS 'Whether card is enrolled in 3D Secure';
COMMENT ON COLUMN public.payments.compliance_status IS 'Compliance review status';
COMMENT ON COLUMN public.payments.audit_trail IS 'Complete audit trail for compliance';
COMMENT ON COLUMN public.payments.dispute_status IS 'Chargeback/dispute status';
COMMENT ON COLUMN public.payments.processing_time_ms IS 'Total processing time in milliseconds';
