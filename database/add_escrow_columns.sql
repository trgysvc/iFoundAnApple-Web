-- Add missing columns to escrow_accounts table
-- These columns will be useful for future escrow management features

-- Add escrow party information (already exists but ensuring they're there)
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS holder_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS beneficiary_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add escrow management details
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS escrow_type VARCHAR(20) DEFAULT 'standard' CHECK (escrow_type IN ('standard', 'conditional', 'time_based', 'manual')),
ADD COLUMN IF NOT EXISTS auto_release_days INTEGER DEFAULT 30, -- Days until automatic release
ADD COLUMN IF NOT EXISTS release_conditions JSONB DEFAULT '[]'::jsonb, -- Conditions for release
ADD COLUMN IF NOT EXISTS confirmations JSONB DEFAULT '[]'::jsonb; -- Confirmation tracking

-- Add escrow security and compliance
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS escrow_fee DECIMAL(10,2) DEFAULT 0.00, -- Escrow service fee
ADD COLUMN IF NOT EXISTS insurance_amount DECIMAL(10,2) DEFAULT 0.00, -- Insurance coverage
ADD COLUMN IF NOT EXISTS risk_assessment VARCHAR(20) DEFAULT 'low' CHECK (risk_assessment IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS compliance_verified BOOLEAN DEFAULT FALSE;

-- Add escrow timeline tracking
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS released_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS refunded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS release_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_reason TEXT;

-- Add escrow notifications and communication
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS activity_log JSONB DEFAULT '[]'::jsonb;

-- Add escrow dispute and resolution
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS dispute_status VARCHAR(20) DEFAULT 'none' CHECK (dispute_status IN ('none', 'pending', 'resolved', 'escalated')),
ADD COLUMN IF NOT EXISTS dispute_reason TEXT,
ADD COLUMN IF NOT EXISTS resolution_method VARCHAR(20), -- 'automatic', 'manual', 'arbitration'
ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

-- Add escrow analytics and reporting
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS processing_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_fees DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2) DEFAULT 0.00;

-- Add escrow metadata
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[], -- Array of tags for categorization
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_holder_user_id ON public.escrow_accounts (holder_user_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_beneficiary_user_id ON public.escrow_accounts (beneficiary_user_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_escrow_type ON public.escrow_accounts (escrow_type);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_risk_assessment ON public.escrow_accounts (risk_assessment);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_dispute_status ON public.escrow_accounts (dispute_status);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_priority ON public.escrow_accounts (priority);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_last_activity ON public.escrow_accounts (last_activity_at);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_auto_release ON public.escrow_accounts (auto_release_days);

-- Add comments for documentation
COMMENT ON COLUMN public.escrow_accounts.escrow_type IS 'Type of escrow arrangement';
COMMENT ON COLUMN public.escrow_accounts.auto_release_days IS 'Days until automatic release if conditions not met';
COMMENT ON COLUMN public.escrow_accounts.release_conditions IS 'JSON array of conditions required for release';
COMMENT ON COLUMN public.escrow_accounts.confirmations IS 'JSON array of confirmations received';
COMMENT ON COLUMN public.escrow_accounts.risk_assessment IS 'Risk level assessment for this escrow';
COMMENT ON COLUMN public.escrow_accounts.dispute_status IS 'Current dispute status';
COMMENT ON COLUMN public.escrow_accounts.activity_log IS 'Complete activity log for audit';
COMMENT ON COLUMN public.escrow_accounts.metadata IS 'Additional metadata for custom fields';
COMMENT ON COLUMN public.escrow_accounts.tags IS 'Tags for categorization and filtering';
COMMENT ON COLUMN public.escrow_accounts.priority IS 'Priority level for processing';
