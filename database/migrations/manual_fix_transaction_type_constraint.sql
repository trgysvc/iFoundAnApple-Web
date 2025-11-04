-- Manual Fix: Add 'escrow_release' to financial_transactions transaction_type CHECK constraint
-- Bu script constraint'i zorla drop edip yeniden oluşturur
-- Eğer hala constraint hatası alıyorsanız bu script'i çalıştırın

-- ADIM 1: Mevcut constraint'i göster (referans için)
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.financial_transactions'::regclass
  AND conname LIKE '%transaction_type%';

-- ADIM 2: Constraint'i zorla drop et
ALTER TABLE public.financial_transactions 
DROP CONSTRAINT IF EXISTS financial_transactions_transaction_type_check;

-- ADIM 3: Yeni constraint'i ekle (escrow_release dahil)
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

-- ADIM 4: Constraint'in doğru oluşturulduğunu kontrol et
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.financial_transactions'::regclass
  AND conname = 'financial_transactions_transaction_type_check';

-- ADIM 5: Constraint'in escrow_release içerdiğini doğrula
-- Bu sorgu 'escrow_release' içermeli
SELECT 
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.financial_transactions'::regclass
  AND conname = 'financial_transactions_transaction_type_check'
  AND pg_get_constraintdef(oid) LIKE '%escrow_release%';
