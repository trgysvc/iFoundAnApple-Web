-- Add missing updated_at columns to all tables that need it
-- This ensures consistency across all tables for tracking modifications

-- First, create the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at to devices table
ALTER TABLE public.devices 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger for devices
DROP TRIGGER IF EXISTS update_devices_updated_at ON public.devices;
CREATE TRIGGER update_devices_updated_at
BEFORE UPDATE ON public.devices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at to payments table (if not exists)
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Trigger for payments should already exist, but ensure it's there
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at to escrow_accounts table (if not exists)
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger for escrow_accounts
DROP TRIGGER IF EXISTS update_escrow_accounts_updated_at ON public.escrow_accounts;
CREATE TRIGGER update_escrow_accounts_updated_at
BEFORE UPDATE ON public.escrow_accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at to financial_transactions table (if not exists)
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger for financial_transactions
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;
CREATE TRIGGER update_financial_transactions_updated_at
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at to cargo_shipments table (if exists and missing)
ALTER TABLE public.cargo_shipments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger for cargo_shipments
DROP TRIGGER IF EXISTS update_cargo_shipments_updated_at ON public.cargo_shipments;
CREATE TRIGGER update_cargo_shipments_updated_at
BEFORE UPDATE ON public.cargo_shipments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify all columns were added
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'updated_at'
  AND table_name IN ('devices', 'payments', 'escrow_accounts', 'financial_transactions', 'cargo_shipments')
ORDER BY table_name;


