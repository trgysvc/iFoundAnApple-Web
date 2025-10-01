-- Fee Update Logs Table
-- Ücret güncelleme işlemlerinin audit trail'ini tutar

CREATE TABLE IF NOT EXISTS public.fee_update_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL, -- 'UPDATE_SINGLE', 'UPDATE_CATEGORY', 'BULK_UPDATE'
  device_model_id UUID NULL,
  device_model_name VARCHAR(100) NULL,
  category VARCHAR(50) NULL,
  multiplier DECIMAL(5,2) NULL,
  old_fee DECIMAL(10,2) NULL,
  new_fee DECIMAL(10,2) NULL,
  updated_count INTEGER NULL,
  reason TEXT NULL,
  api_key_used BOOLEAN DEFAULT FALSE,
  user_id UUID NULL,
  ip_address INET NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fee_update_logs_created_at ON public.fee_update_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fee_update_logs_action ON public.fee_update_logs(action);
CREATE INDEX IF NOT EXISTS idx_fee_update_logs_device_model ON public.fee_update_logs(device_model_id);
CREATE INDEX IF NOT EXISTS idx_fee_update_logs_category ON public.fee_update_logs(category);

-- RLS (Row Level Security)
ALTER TABLE public.fee_update_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can see all logs
CREATE POLICY "Admin can view all fee update logs" ON public.fee_update_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only system can insert logs (via API)
CREATE POLICY "System can insert fee update logs" ON public.fee_update_logs
  FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.fee_update_logs TO authenticated;
GRANT INSERT ON public.fee_update_logs TO authenticated;

-- Create view for fee update statistics
CREATE OR REPLACE VIEW public.fee_update_statistics AS
SELECT 
  action,
  COUNT(*) as update_count,
  AVG(new_fee) as avg_new_fee,
  MIN(created_at) as first_update,
  MAX(created_at) as last_update,
  COUNT(DISTINCT device_model_id) as unique_models_updated,
  COUNT(DISTINCT category) as categories_affected
FROM public.fee_update_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY action
ORDER BY update_count DESC;

-- Grant access to the view
GRANT SELECT ON public.fee_update_statistics TO authenticated;
