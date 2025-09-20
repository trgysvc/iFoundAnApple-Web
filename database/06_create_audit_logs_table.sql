-- Create comprehensive audit logging system
-- This system tracks all important operations and changes for security and compliance

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event identification
  event_type VARCHAR(50) NOT NULL, -- e.g., 'device_created', 'payment_processed', 'escrow_released'
  event_category VARCHAR(30) NOT NULL, -- e.g., 'device', 'payment', 'user', 'security', 'system'
  event_action VARCHAR(30) NOT NULL, -- e.g., 'create', 'update', 'delete', 'view', 'confirm'
  event_severity VARCHAR(20) DEFAULT 'info' CHECK (event_severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  
  -- Context information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255), -- User session identifier
  ip_address INET, -- User's IP address
  user_agent TEXT, -- Browser/client information
  
  -- Resource information
  resource_type VARCHAR(50), -- e.g., 'device', 'payment', 'escrow_account'
  resource_id UUID, -- ID of the affected resource
  parent_resource_type VARCHAR(50), -- e.g., parent device for payment
  parent_resource_id UUID, -- ID of the parent resource
  
  -- Change tracking
  old_values JSONB, -- Previous state (for updates)
  new_values JSONB, -- New state (for creates/updates)
  changes JSONB, -- Specific fields that changed
  
  -- Event details
  event_description TEXT NOT NULL, -- Human-readable description
  event_data JSONB, -- Additional structured data
  error_details JSONB, -- Error information if applicable
  
  -- Timestamps and metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  request_id VARCHAR(255), -- Request correlation ID
  correlation_id VARCHAR(255), -- Business process correlation ID
  
  -- Security and compliance
  is_sensitive BOOLEAN DEFAULT FALSE, -- Contains sensitive data
  retention_period_days INTEGER DEFAULT 2555, -- ~7 years for financial records
  archived_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional context
  application_version VARCHAR(50),
  environment VARCHAR(20) DEFAULT 'production', -- 'development', 'staging', 'production'
  tags TEXT[] -- Searchable tags for categorization
);

-- Create indexes for performance and common queries
CREATE INDEX idx_audit_logs_event_type ON public.audit_logs(event_type);
CREATE INDEX idx_audit_logs_event_category ON public.audit_logs(event_category);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_severity ON public.audit_logs(event_severity);
CREATE INDEX idx_audit_logs_session_id ON public.audit_logs(session_id);
CREATE INDEX idx_audit_logs_correlation_id ON public.audit_logs(correlation_id);

-- Composite indexes for common query patterns
CREATE INDEX idx_audit_logs_user_category_date ON public.audit_logs(user_id, event_category, created_at);
CREATE INDEX idx_audit_logs_resource_action_date ON public.audit_logs(resource_type, event_action, created_at);
CREATE INDEX idx_audit_logs_sensitive_retention ON public.audit_logs(is_sensitive, retention_period_days, created_at);

-- GIN indexes for JSONB columns
CREATE INDEX idx_audit_logs_event_data_gin ON public.audit_logs USING GIN(event_data);
CREATE INDEX idx_audit_logs_changes_gin ON public.audit_logs USING GIN(changes);
CREATE INDEX idx_audit_logs_tags_gin ON public.audit_logs USING GIN(tags);

-- Add RLS (Row Level Security)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own audit logs (non-sensitive)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (
    auth.uid() = user_id 
    AND is_sensitive = FALSE
    AND event_severity NOT IN ('error', 'critical')
  );

-- Admins can view all audit logs (requires admin role check)
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    -- TODO: Implement proper admin role check
    auth.role() = 'authenticated'
  );

-- Only system can insert audit logs (no direct user access)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_event_type VARCHAR(50),
  p_event_category VARCHAR(30),
  p_event_action VARCHAR(30),
  p_event_description TEXT,
  p_user_id UUID DEFAULT NULL,
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_event_data JSONB DEFAULT NULL,
  p_event_severity VARCHAR(20) DEFAULT 'info',
  p_session_id VARCHAR(255) DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_correlation_id VARCHAR(255) DEFAULT NULL,
  p_is_sensitive BOOLEAN DEFAULT FALSE,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_audit_id UUID;
  calculated_changes JSONB;
BEGIN
  -- Calculate changes if both old and new values provided
  IF p_old_values IS NOT NULL AND p_new_values IS NOT NULL THEN
    calculated_changes := jsonb_diff(p_old_values, p_new_values);
  END IF;
  
  -- Insert audit log entry
  INSERT INTO public.audit_logs (
    event_type,
    event_category,
    event_action,
    event_description,
    event_severity,
    user_id,
    session_id,
    ip_address,
    resource_type,
    resource_id,
    old_values,
    new_values,
    changes,
    event_data,
    correlation_id,
    is_sensitive,
    tags,
    application_version,
    environment
  ) VALUES (
    p_event_type,
    p_event_category,
    p_event_action,
    p_event_description,
    p_event_severity,
    p_user_id,
    p_session_id,
    p_ip_address,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    calculated_changes,
    p_event_data,
    p_correlation_id,
    p_is_sensitive,
    p_tags,
    '1.0.0', -- TODO: Get from application
    COALESCE(current_setting('app.environment', true), 'production')
  ) RETURNING id INTO new_audit_id;
  
  RETURN new_audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate JSONB differences
CREATE OR REPLACE FUNCTION jsonb_diff(old_data JSONB, new_data JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}'::jsonb;
  key TEXT;
  old_value JSONB;
  new_value JSONB;
BEGIN
  -- Check for changed or new fields
  FOR key IN SELECT * FROM jsonb_object_keys(new_data)
  LOOP
    old_value := old_data -> key;
    new_value := new_data -> key;
    
    IF old_value IS DISTINCT FROM new_value THEN
      result := result || jsonb_build_object(
        key, 
        jsonb_build_object(
          'old', old_value,
          'new', new_value
        )
      );
    END IF;
  END LOOP;
  
  -- Check for removed fields
  FOR key IN SELECT * FROM jsonb_object_keys(old_data)
  LOOP
    IF NOT (new_data ? key) THEN
      result := result || jsonb_build_object(
        key,
        jsonb_build_object(
          'old', old_data -> key,
          'new', null
        )
      );
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic audit logging on important tables

-- Audit trigger for devices table
CREATE OR REPLACE FUNCTION audit_devices_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_audit_log(
      'device_created',
      'device',
      'create',
      format('Device created: %s (%s)', NEW.model, NEW.serialNumber),
      NEW.userId,
      'device',
      NEW.id,
      NULL,
      to_jsonb(NEW),
      jsonb_build_object(
        'device_model', NEW.model,
        'device_serial', NEW.serialNumber,
        'device_status', NEW.status
      ),
      'info',
      NULL, -- session_id would need to be passed from application
      NULL, -- ip_address would need to be passed from application
      NEW.id::text, -- use device id as correlation
      FALSE,
      ARRAY['device', 'creation', NEW.status]
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM create_audit_log(
      'device_updated',
      'device', 
      'update',
      format('Device updated: %s (%s)', NEW.model, NEW.serialNumber),
      NEW.userId,
      'device',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      jsonb_build_object(
        'device_model', NEW.model,
        'device_serial', NEW.serialNumber,
        'old_status', OLD.status,
        'new_status', NEW.status
      ),
      'info',
      NULL,
      NULL,
      NEW.id::text,
      FALSE,
      ARRAY['device', 'update', OLD.status, NEW.status]
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM create_audit_log(
      'device_deleted',
      'device',
      'delete', 
      format('Device deleted: %s (%s)', OLD.model, OLD.serialNumber),
      OLD.userId,
      'device',
      OLD.id,
      to_jsonb(OLD),
      NULL,
      jsonb_build_object(
        'device_model', OLD.model,
        'device_serial', OLD.serialNumber,
        'device_status', OLD.status
      ),
      'warning',
      NULL,
      NULL,
      OLD.id::text,
      FALSE,
      ARRAY['device', 'deletion', OLD.status]
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_devices_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION audit_devices_changes();

-- Audit trigger for payments table
CREATE OR REPLACE FUNCTION audit_payments_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_audit_log(
      'payment_created',
      'payment',
      'create',
      format('Payment created: %s TL for device %s', NEW.total_amount, NEW.device_id),
      NEW.payer_id,
      'payment',
      NEW.id,
      NULL,
      to_jsonb(NEW),
      jsonb_build_object(
        'total_amount', NEW.total_amount,
        'payment_provider', NEW.payment_provider,
        'device_id', NEW.device_id
      ),
      'info',
      NULL,
      NULL,
      NEW.device_id::text,
      TRUE, -- Payment information is sensitive
      ARRAY['payment', 'creation', NEW.payment_provider]
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM create_audit_log(
      'payment_updated',
      'payment',
      'update',
      format('Payment status changed: %s -> %s (Amount: %s TL)', OLD.payment_status, NEW.payment_status, NEW.total_amount),
      NEW.payer_id,
      'payment',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      jsonb_build_object(
        'total_amount', NEW.total_amount,
        'old_status', OLD.payment_status,
        'new_status', NEW.payment_status,
        'old_escrow_status', OLD.escrow_status,
        'new_escrow_status', NEW.escrow_status
      ),
      CASE 
        WHEN NEW.payment_status = 'failed' THEN 'error'
        WHEN NEW.payment_status = 'completed' THEN 'info'
        ELSE 'info'
      END,
      NULL,
      NULL,
      NEW.device_id::text,
      TRUE,
      ARRAY['payment', 'status_change', OLD.payment_status, NEW.payment_status]
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_payments_trigger
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION audit_payments_changes();

-- Audit trigger for escrow accounts
CREATE OR REPLACE FUNCTION audit_escrow_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_audit_log(
      'escrow_created',
      'escrow',
      'create',
      format('Escrow account created: %s TL held for device %s', NEW.total_amount, NEW.device_id),
      NEW.holder_user_id,
      'escrow_account',
      NEW.id,
      NULL,
      to_jsonb(NEW),
      jsonb_build_object(
        'total_amount', NEW.total_amount,
        'net_payout', NEW.net_payout,
        'device_id', NEW.device_id,
        'beneficiary_id', NEW.beneficiary_user_id
      ),
      'info',
      NULL,
      NULL,
      NEW.device_id::text,
      TRUE,
      ARRAY['escrow', 'creation', 'held']
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM create_audit_log(
      'escrow_updated',
      'escrow',
      'update',
      format('Escrow status changed: %s -> %s (Amount: %s TL)', OLD.status, NEW.status, NEW.total_amount),
      COALESCE(NEW.released_by, NEW.refunded_by, NEW.holder_user_id),
      'escrow_account',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      jsonb_build_object(
        'total_amount', NEW.total_amount,
        'net_payout', NEW.net_payout,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'confirmations_count', jsonb_array_length(COALESCE(NEW.confirmations, '[]'::jsonb))
      ),
      CASE 
        WHEN NEW.status = 'released' THEN 'info'
        WHEN NEW.status = 'refunded' THEN 'warning'
        WHEN NEW.status = 'failed' THEN 'error'
        ELSE 'info'
      END,
      NULL,
      NULL,
      NEW.device_id::text,
      TRUE,
      ARRAY['escrow', 'status_change', OLD.status, NEW.status]
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_escrow_trigger
  AFTER INSERT OR UPDATE ON public.escrow_accounts
  FOR EACH ROW EXECUTE FUNCTION audit_escrow_changes();

-- Create materialized view for audit analytics
CREATE MATERIALIZED VIEW public.audit_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    event_category,
    event_action,
    event_severity,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(CASE WHEN is_sensitive THEN 1 END) as sensitive_events
FROM public.audit_logs
WHERE created_at >= NOW() - INTERVAL '90 days' -- Last 90 days
GROUP BY DATE_TRUNC('day', created_at), event_category, event_action, event_severity
ORDER BY date DESC, event_category, event_action;

-- Create index on materialized view
CREATE INDEX idx_audit_analytics_date ON public.audit_analytics(date);
CREATE INDEX idx_audit_analytics_category ON public.audit_analytics(event_category);

-- Function to refresh audit analytics
CREATE OR REPLACE FUNCTION refresh_audit_analytics()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.audit_analytics;
END;
$$ LANGUAGE plpgsql;

-- Create view for security events (failed logins, suspicious activity)
CREATE VIEW public.security_audit_events AS
SELECT 
    al.*,
    u.email as user_email
FROM public.audit_logs al
LEFT JOIN auth.users u ON al.user_id = u.id
WHERE 
    al.event_category = 'security' 
    OR al.event_severity IN ('error', 'critical')
    OR al.event_type IN ('login_failed', 'unauthorized_access', 'suspicious_activity')
ORDER BY al.created_at DESC;

-- Create view for financial audit trail
CREATE VIEW public.financial_audit_trail AS
SELECT 
    al.*,
    u.email as user_email,
    CASE 
      WHEN al.resource_type = 'payment' THEN p.total_amount
      WHEN al.resource_type = 'escrow_account' THEN ea.total_amount
      ELSE NULL
    END as amount
FROM public.audit_logs al
LEFT JOIN auth.users u ON al.user_id = u.id
LEFT JOIN public.payments p ON al.resource_type = 'payment' AND al.resource_id = p.id
LEFT JOIN public.escrow_accounts ea ON al.resource_type = 'escrow_account' AND al.resource_id = ea.id
WHERE 
    al.event_category IN ('payment', 'escrow', 'financial')
    OR al.resource_type IN ('payment', 'escrow_account', 'financial_transaction')
ORDER BY al.created_at DESC;

-- Function to archive old audit logs
CREATE OR REPLACE FUNCTION archive_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Archive logs older than their retention period
  UPDATE public.audit_logs 
  SET archived_at = NOW()
  WHERE 
    archived_at IS NULL 
    AND created_at < NOW() - (retention_period_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  
  -- Log the archival operation
  PERFORM create_audit_log(
    'audit_logs_archived',
    'system',
    'archive',
    format('Archived %s old audit log entries', archived_count),
    NULL,
    'audit_logs',
    NULL,
    NULL,
    jsonb_build_object('archived_count', archived_count),
    NULL,
    'info'
  );
  
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Grant appropriate access to views
GRANT SELECT ON public.audit_analytics TO authenticated;
-- Security and financial views should have restricted access
-- GRANT SELECT ON public.security_audit_events TO admin_role;
-- GRANT SELECT ON public.financial_audit_trail TO admin_role;
