-- Migration: Add escrow-related fields to financial_transactions table
-- This migration adds escrow_id, confirmed_by, and confirmation_type columns
-- to support escrow release tracking in financial transactions

-- Step 1: Add escrow_id column (nullable, references escrow_accounts.id)
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS escrow_id uuid;

-- Step 2: Add confirmed_by column (nullable, references auth.users.id)
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS confirmed_by uuid;

-- Step 3: Add confirmation_type column (nullable, varchar)
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS confirmation_type character varying(50);

-- Step 4: Add foreign key constraint for escrow_id
-- Note: This will fail if escrow_accounts table doesn't exist
-- If needed, remove this constraint and add it separately after ensuring escrow_accounts exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'escrow_accounts'
  ) THEN
    -- Check if constraint already exists using information_schema
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints
      WHERE constraint_schema = 'public'
        AND table_name = 'financial_transactions'
        AND constraint_name = 'financial_transactions_escrow_id_fkey'
    ) THEN
      ALTER TABLE public.financial_transactions 
      ADD CONSTRAINT financial_transactions_escrow_id_fkey 
      FOREIGN KEY (escrow_id) REFERENCES public.escrow_accounts(id) 
      ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Step 5: Add foreign key constraint for confirmed_by
DO $$
BEGIN
  -- Check if constraint already exists using information_schema
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'financial_transactions'
      AND constraint_name = 'financial_transactions_confirmed_by_fkey'
  ) THEN
    ALTER TABLE public.financial_transactions 
    ADD CONSTRAINT financial_transactions_confirmed_by_fkey 
    FOREIGN KEY (confirmed_by) REFERENCES auth.users(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Step 6: Create index for escrow_id for better query performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_escrow_id 
ON public.financial_transactions(escrow_id) 
TABLESPACE pg_default;

-- Step 7: Create index for confirmed_by for better query performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_confirmed_by 
ON public.financial_transactions(confirmed_by) 
TABLESPACE pg_default;

-- Step 8: Add comments to columns
COMMENT ON COLUMN public.financial_transactions.escrow_id IS 'Reference to escrow_accounts.id when this transaction is related to escrow release';
COMMENT ON COLUMN public.financial_transactions.confirmed_by IS 'User ID who confirmed this transaction (e.g., device owner who confirmed receipt)';
COMMENT ON COLUMN public.financial_transactions.confirmation_type IS 'Type of confirmation (e.g., device_received, manual_release, etc.)';

-- Step 9: Verify migration
-- Check if columns were added successfully
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'financial_transactions'
  AND column_name IN ('escrow_id', 'confirmed_by', 'confirmation_type');

