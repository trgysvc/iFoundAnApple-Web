-- Migration: Add 'escrow_release' to financial_transactions transaction_type CHECK constraint
-- This migration checks the current constraint and adds 'escrow_release' as an allowed value

-- Step 1: Check current constraint (for reference)
-- This query will show the current constraint definition
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.financial_transactions'::regclass
  AND conname LIKE '%transaction_type%';

-- Step 2: Drop the existing constraint (if it exists)
-- Bu constraint'i zorla drop ediyoruz çünkü değerlerini güncellemek istiyoruz
ALTER TABLE public.financial_transactions 
DROP CONSTRAINT IF EXISTS financial_transactions_transaction_type_check;

-- Step 3: Create new constraint with escrow_release added
-- Common transaction types based on codebase analysis:
-- - payment (payment made)
-- - refund (refund issued)
-- - escrow_release (escrow funds released)
-- - escrow_refund (escrow funds refunded)
-- - transfer (fund transfer)
-- - fee (fee deduction)
-- - adjustment (amount adjustment)
ALTER TABLE public.financial_transactions
ADD CONSTRAINT financial_transactions_transaction_type_check
CHECK (
  transaction_type IN (
    'payment',
    'refund',
    'refund_issued',
    'escrow_release',
    'escrow_refund',
    'escrow_hold',
    'transfer',
    'fee',
    'adjustment',
    'reward_payout',
    'reward_transfer'
  )
);

-- Step 4: Add comment
COMMENT ON CONSTRAINT financial_transactions_transaction_type_check ON public.financial_transactions 
IS 'Ensures transaction_type is one of the allowed values: payment, refund, refund_issued, escrow_release, escrow_refund, escrow_hold, transfer, fee, adjustment, reward_payout, reward_transfer';

-- Step 5: Verify constraint was created
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.financial_transactions'::regclass
  AND conname = 'financial_transactions_transaction_type_check';

