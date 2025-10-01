-- Create invoice_logs table for audit trail and admin management
-- Run this script in your Supabase SQL Editor

CREATE TABLE public.invoice_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deviceId UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    fileName TEXT NOT NULL,
    originalFileName TEXT NOT NULL,
    filePath TEXT NOT NULL,
    fileSize BIGINT NOT NULL,
    mimeType TEXT NOT NULL,
    deviceModel TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verifiedBy UUID REFERENCES auth.users(id),
    verificationNotes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_invoice_logs_user_id ON public.invoice_logs(userId);
CREATE INDEX idx_invoice_logs_device_id ON public.invoice_logs(deviceId);
CREATE INDEX idx_invoice_logs_status ON public.invoice_logs(status);
CREATE INDEX idx_invoice_logs_uploaded_at ON public.invoice_logs(uploaded_at);
CREATE INDEX idx_invoice_logs_verified_by ON public.invoice_logs(verifiedBy);

-- Enable RLS
ALTER TABLE public.invoice_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own invoice logs" ON public.invoice_logs
    FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can insert own invoice logs" ON public.invoice_logs
    FOR INSERT WITH CHECK (auth.uid() = userId);

-- Admin can view all invoice logs (for verification)
CREATE POLICY "Admins can view all invoice logs" ON public.invoice_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_invoice_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoice_logs_updated_at
    BEFORE UPDATE ON public.invoice_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_logs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.invoice_logs IS 'Audit trail and management for invoice documents';
COMMENT ON COLUMN public.invoice_logs.status IS 'pending: awaiting verification, verified: approved by admin, rejected: rejected by admin';
COMMENT ON COLUMN public.invoice_logs.fileName IS 'Generated secure filename in storage';
COMMENT ON COLUMN public.invoice_logs.originalFileName IS 'Original filename uploaded by user';
COMMENT ON COLUMN public.invoice_logs.filePath IS 'Full path in Supabase Storage';
