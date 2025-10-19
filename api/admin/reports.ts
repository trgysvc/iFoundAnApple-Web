import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for reports and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const period = searchParams.get('period') || '30d';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate date range based on period
    const getDateRange = (period: string) => {
      const now = new Date();
      let start: Date;

      switch (period) {
        case '7d':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      return {
        start: startDate ? new Date(startDate) : start,
        end: endDate ? new Date(endDate) : now
      };
    };

    const { start, end } = getDateRange(period);

    switch (action) {
      case 'getOverview':
        // Get basic statistics
        const [
          { data: users, error: usersError },
          { data: devices, error: devicesError },
          { data: payments, error: paymentsError },
          { data: escrows, error: escrowsError }
        ] = await Promise.all([
          supabase.from('userprofile').select('id, created_at'),
          supabase.from('devices').select('id, status, created_at'),
          supabase.from('payments').select('id, total_amount, payment_status, created_at'),
          supabase.from('escrow_accounts').select('id, status, total_amount, created_at')
        ]);

        if (usersError) throw usersError;
        if (devicesError) throw devicesError;
        if (paymentsError) throw paymentsError;
        if (escrowsError) throw escrowsError;

        const overview = {
          users: {
            total: users.length,
            new: users.filter(u => new Date(u.created_at) >= start).length,
            growth: users.length > 0 ? ((users.filter(u => new Date(u.created_at) >= start).length / users.length) * 100) : 0
          },
          devices: {
            total: devices.length,
            byStatus: devices.reduce((acc, d) => {
              acc[d.status] = (acc[d.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            new: devices.filter(d => new Date(d.created_at) >= start).length
          },
          payments: {
            total: payments.length,
            totalAmount: payments.reduce((sum, p) => sum + (p.total_amount || 0), 0),
            byStatus: payments.reduce((acc, p) => {
              acc[p.payment_status] = (acc[p.payment_status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            new: payments.filter(p => new Date(p.created_at) >= start).length
          },
          escrows: {
            total: escrows.length,
            totalAmount: escrows.reduce((sum, e) => sum + (e.total_amount || 0), 0),
            byStatus: escrows.reduce((acc, e) => {
              acc[e.status] = (acc[e.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          }
        };

        return NextResponse.json({
          success: true,
          data: overview
        });

      case 'getUserAnalytics':
        const { data: userAnalytics, error: userAnalyticsError } = await supabase
          .from('userprofile')
          .select(`
            id,
            created_at,
            first_name,
            last_name,
            email,
            devices:user_id (
              id,
              status,
              created_at
            )
          `)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        if (userAnalyticsError) throw userAnalyticsError;

        const userStats = {
          totalUsers: userAnalytics.length,
          activeUsers: userAnalytics.filter(u => u.devices && u.devices.length > 0).length,
          topUsers: userAnalytics
            .map(user => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              deviceCount: user.devices?.length || 0,
              joinedAt: user.created_at
            }))
            .sort((a, b) => b.deviceCount - a.deviceCount)
            .slice(0, 10)
        };

        return NextResponse.json({
          success: true,
          data: userStats
        });

      case 'getDeviceAnalytics':
        const { data: deviceAnalytics, error: deviceAnalyticsError } = await supabase
          .from('devices')
          .select(`
            id,
            model,
            status,
            created_at,
            updated_at,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        if (deviceAnalyticsError) throw deviceAnalyticsError;

        const deviceStats = {
          totalDevices: deviceAnalytics.length,
          byModel: deviceAnalytics.reduce((acc, d) => {
            acc[d.model] = (acc[d.model] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byStatus: deviceAnalytics.reduce((acc, d) => {
            acc[d.status] = (acc[d.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          completionRate: deviceAnalytics.length > 0 ? 
            (deviceAnalytics.filter(d => d.status === 'completed').length / deviceAnalytics.length) * 100 : 0
        };

        return NextResponse.json({
          success: true,
          data: deviceStats
        });

      case 'getFinancialAnalytics':
        const { data: financialAnalytics, error: financialAnalyticsError } = await supabase
          .from('payments')
          .select(`
            id,
            total_amount,
            reward_amount,
            service_fee,
            cargo_fee,
            gateway_fee,
            net_payout,
            payment_status,
            created_at,
            completed_at
          `)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        if (financialAnalyticsError) throw financialAnalyticsError;

        const financialStats = {
          totalRevenue: financialAnalytics.reduce((sum, p) => sum + (p.total_amount || 0), 0),
          totalServiceFees: financialAnalytics.reduce((sum, p) => sum + (p.service_fee || 0), 0),
          totalGatewayFees: financialAnalytics.reduce((sum, p) => sum + (p.gateway_fee || 0), 0),
          totalPayouts: financialAnalytics.reduce((sum, p) => sum + (p.net_payout || 0), 0),
          averageTransactionValue: financialAnalytics.length > 0 ? 
            financialAnalytics.reduce((sum, p) => sum + (p.total_amount || 0), 0) / financialAnalytics.length : 0,
          completedTransactions: financialAnalytics.filter(p => p.payment_status === 'completed').length,
          successRate: financialAnalytics.length > 0 ? 
            (financialAnalytics.filter(p => p.payment_status === 'completed').length / financialAnalytics.length) * 100 : 0,
          monthlyRevenue: financialAnalytics
            .filter(p => p.completed_at)
            .reduce((acc, payment) => {
              const month = new Date(payment.completed_at).toISOString().substring(0, 7);
              acc[month] = (acc[month] || 0) + (payment.total_amount || 0);
              return acc;
            }, {} as Record<string, number>)
        };

        return NextResponse.json({
          success: true,
          data: financialStats
        });

      case 'getActivityTimeline':
        const { data: activityTimeline, error: activityTimelineError } = await supabase
          .from('audit_logs')
          .select('event_type, event_category, created_at')
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString())
          .order('created_at', { ascending: false });

        if (activityTimelineError) throw activityTimelineError;

        const timeline = activityTimeline
          .reduce((acc, log) => {
            const date = new Date(log.created_at).toISOString().substring(0, 10);
            if (!acc[date]) {
              acc[date] = {
                date,
                events: 0,
                byCategory: {}
              };
            }
            acc[date].events++;
            acc[date].byCategory[log.event_category] = (acc[date].byCategory[log.event_category] || 0) + 1;
            return acc;
          }, {} as Record<string, any>);

        return NextResponse.json({
          success: true,
          data: Object.values(timeline).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        });

      case 'exportReport':
        const reportType = searchParams.get('reportType') || 'overview';
        
        // This would generate and return a downloadable report
        // For now, we'll return the data that would be in the report
        const reportData = {
          period: `${start.toISOString().substring(0, 10)} to ${end.toISOString().substring(0, 10)}`,
          generatedAt: new Date().toISOString(),
          reportType,
          data: {} // Would contain the actual report data
        };

        return NextResponse.json({
          success: true,
          data: reportData
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Reports API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
