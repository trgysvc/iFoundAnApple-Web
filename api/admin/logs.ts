import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for system logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const logId = searchParams.get('logId');
    const severity = searchParams.get('severity');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'getLogs':
        let query = supabase
          .from('audit_logs')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        // Apply filters
        if (severity && severity !== 'all') {
          query = query.eq('event_severity', severity);
        }
        if (category && category !== 'all') {
          query = query.eq('event_category', category);
        }

        const { data: logs, error: logsError } = await query;

        if (logsError) throw logsError;

        return NextResponse.json({
          success: true,
          data: logs
        });

      case 'getLog':
        if (!logId) {
          return NextResponse.json({
            success: false,
            error: 'Log ID is required'
          }, { status: 400 });
        }

        const { data: log, error: logError } = await supabase
          .from('audit_logs')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('id', logId)
          .single();

        if (logError) throw logError;

        return NextResponse.json({
          success: true,
          data: log
        });

      case 'getLogStats':
        const { data: allLogs, error: statsError } = await supabase
          .from('audit_logs')
          .select('event_severity, event_category, created_at');

        if (statsError) throw statsError;

        const stats = {
          total: allLogs.length,
          bySeverity: allLogs.reduce((acc, log) => {
            acc[log.event_severity] = (acc[log.event_severity] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byCategory: allLogs.reduce((acc, log) => {
            acc[log.event_category] = (acc[log.event_category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          recentActivity: allLogs
            .filter(log => {
              const logDate = new Date(log.created_at);
              const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
              return logDate > oneDayAgo;
            }).length
        };

        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'getErrorLogs':
        const { data: errorLogs, error: errorLogsError } = await supabase
          .from('audit_logs')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .in('event_severity', ['error', 'critical'])
          .order('created_at', { ascending: false })
          .limit(50);

        if (errorLogsError) throw errorLogsError;

        return NextResponse.json({
          success: true,
          data: errorLogs
        });

      case 'getSecurityLogs':
        const { data: securityLogs, error: securityLogsError } = await supabase
          .from('audit_logs')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('event_category', 'security')
          .order('created_at', { ascending: false })
          .limit(100);

        if (securityLogsError) throw securityLogsError;

        return NextResponse.json({
          success: true,
          data: securityLogs
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Logs API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, logId, data } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'createLog':
        const { data: newLog, error: createError } = await supabase
          .from('audit_logs')
          .insert({
            event_type: data.event_type,
            event_category: data.event_category,
            event_action: data.event_action,
            event_severity: data.event_severity || 'info',
            user_id: data.user_id,
            session_id: data.session_id,
            ip_address: data.ip_address,
            user_agent: data.user_agent,
            resource_type: data.resource_type,
            resource_id: data.resource_id,
            event_description: data.event_description,
            event_data: data.event_data,
            error_details: data.error_details,
            is_sensitive: data.is_sensitive || false,
            environment: data.environment || 'production',
            application_version: data.application_version || 'v5.1'
          })
          .select()
          .single();

        if (createError) throw createError;

        return NextResponse.json({
          success: true,
          data: newLog
        });

      case 'deleteLog':
        if (!logId) {
          return NextResponse.json({
            success: false,
            error: 'Log ID is required'
          }, { status: 400 });
        }

        const { error: deleteError } = await supabase
          .from('audit_logs')
          .delete()
          .eq('id', logId);

        if (deleteError) throw deleteError;

        return NextResponse.json({
          success: true,
          message: 'Log deleted successfully'
        });

      case 'archiveLogs':
        const { data: archivedLogs, error: archiveError } = await supabase
          .from('audit_logs')
          .update({
            archived_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .lt('created_at', data.beforeDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .is('archived_at', null)
          .select();

        if (archiveError) throw archiveError;

        // Log the archive action
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'logs_archive',
            event_category: 'admin',
            event_action: 'archive',
            event_severity: 'info',
            event_description: `Archived ${archivedLogs.length} log entries`,
            event_data: {
              archived_count: archivedLogs.length,
              before_date: data.beforeDate,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: { archivedCount: archivedLogs.length }
        });

      case 'exportLogs':
        const { data: exportLogs, error: exportError } = await supabase
          .from('audit_logs')
          .select('*')
          .gte('created_at', data.startDate)
          .lte('created_at', data.endDate)
          .order('created_at', { ascending: false });

        if (exportError) throw exportError;

        return NextResponse.json({
          success: true,
          data: exportLogs
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Logs API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
