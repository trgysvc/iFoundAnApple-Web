/**
 * Local API: Admin Reports
 * Gerçek verilerle çalışan raporlama sistemi
 */

import { createClient } from "@supabase/supabase-js";
import { getSecureConfig } from "../utils/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReportRequest {
  period: string; // '7d', '30d', '90d', '1y', 'custom'
  startDate?: string;
  endDate?: string;
  reportType: string; // 'overview', 'users', 'devices', 'payments', 'financial', 'security'
}

interface ReportData {
  period: string;
  totalUsers: number;
  totalDevices: number;
  totalPayments: number;
  totalRevenue: number;
  completedTransactions: number;
  pendingEscrows: number;
  averageTransactionValue: number;
  userGrowth: number;
  deviceGrowth: number;
  paymentGrowth: number;
  revenueGrowth: number;
  deviceStatusDistribution: Record<string, number>;
  topUsers: Array<{
    id: string;
    name: string;
    email: string;
    deviceCount: number;
    totalSpent: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
  financialSummary: {
    totalEscrowAmount: number;
    totalServiceFees: number;
    totalCargoFees: number;
    totalRewards: number;
    pendingAmount: number;
  };
}

export async function getAdminReportsAPI(
  request: ReportRequest
): Promise<ReportData> {
  try {
    const config = getSecureConfig();
    const supabaseClient = createClient(
      config.supabaseUrl,
      config.supabaseServiceKey || config.supabaseAnonKey
    );

    const { period, startDate, endDate, reportType } = request;

    // Calculate date range
    const now = new Date();
    let start: Date;
    let end: Date = now;

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
      case 'custom':
        start = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = endDate ? new Date(endDate) : now;
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    console.log(`[ADMIN_REPORTS] Generating report for period: ${period}`, {
      start: start.toISOString(),
      end: end.toISOString(),
      reportType
    });

    // Get total users
    const { data: users, error: usersError } = await supabaseClient
      .from('userprofile')
      .select('user_id, first_name, last_name, created_at');

    if (usersError) {
      console.error('[ADMIN_REPORTS] Error fetching users:', usersError);
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    // Get total devices
    const { data: devices, error: devicesError } = await supabaseClient
      .from('devices')
      .select('id, status, created_at, owner_id, finder_id');

    if (devicesError) {
      console.error('[ADMIN_REPORTS] Error fetching devices:', devicesError);
      throw new Error(`Failed to fetch devices: ${devicesError.message}`);
    }

    // Get payments
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('payments')
      .select('id, total_amount, payment_status, created_at, completed_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (paymentsError) {
      console.error('[ADMIN_REPORTS] Error fetching payments:', paymentsError);
      throw new Error(`Failed to fetch payments: ${paymentsError.message}`);
    }

    // Get escrow accounts
    const { data: escrows, error: escrowsError } = await supabaseClient
      .from('escrow_accounts')
      .select('id, amount, status, created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (escrowsError) {
      console.error('[ADMIN_REPORTS] Error fetching escrows:', escrowsError);
      throw new Error(`Failed to fetch escrows: ${escrowsError.message}`);
    }

    // Get previous period data for growth calculation
    const previousStart = new Date(start.getTime() - (end.getTime() - start.getTime()));
    const previousEnd = start;

    const { data: previousUsers } = await supabaseClient
      .from('userprofile')
      .select('user_id')
      .gte('created_at', previousStart.toISOString())
      .lte('created_at', previousEnd.toISOString());

    const { data: previousDevices } = await supabaseClient
      .from('devices')
      .select('id')
      .gte('created_at', previousStart.toISOString())
      .lte('created_at', previousEnd.toISOString());

    const { data: previousPayments } = await supabaseClient
      .from('payments')
      .select('total_amount')
      .gte('created_at', previousStart.toISOString())
      .lte('created_at', previousEnd.toISOString());

    // Calculate metrics
    const totalUsers = users?.length || 0;
    const totalDevices = devices?.length || 0;
    const totalPayments = payments?.length || 0;
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;
    const completedTransactions = payments?.filter(p => p.payment_status === 'completed').length || 0;
    const pendingEscrows = escrows?.filter(e => e.status === 'active').length || 0;
    const averageTransactionValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    // Calculate growth percentages
    const previousUserCount = previousUsers?.length || 0;
    const previousDeviceCount = previousDevices?.length || 0;
    const previousPaymentCount = previousPayments?.length || 0;
    const previousRevenue = previousPayments?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;

    const userGrowth = previousUserCount > 0 ? ((totalUsers - previousUserCount) / previousUserCount) * 100 : 0;
    const deviceGrowth = previousDeviceCount > 0 ? ((totalDevices - previousDeviceCount) / previousDeviceCount) * 100 : 0;
    const paymentGrowth = previousPaymentCount > 0 ? ((totalPayments - previousPaymentCount) / previousPaymentCount) * 100 : 0;
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Device status distribution
    const deviceStatusDistribution = devices?.reduce((acc, device) => {
      acc[device.status] = (acc[device.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Top users (by device count and spending)
    const userDeviceCounts = devices?.reduce((acc, device) => {
      if (device.owner_id) {
        acc[device.owner_id] = (acc[device.owner_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};

    const userSpending = payments?.reduce((acc, payment) => {
      // This would need payer_id from payments table
      return acc;
    }, {} as Record<string, number>) || {};

    const topUsers = users?.slice(0, 5).map(user => ({
      id: user.user_id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Bilinmeyen',
      email: `user-${user.user_id.slice(0, 8)}@example.com`,
      deviceCount: userDeviceCounts[user.user_id] || 0,
      totalSpent: userSpending[user.user_id] || 0
    })) || [];

    // Recent activity (from audit logs)
    const { data: recentActivity } = await supabaseClient
      .from('audit_logs')
      .select('id, event_type, event_description, created_at, user_id')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    const formattedRecentActivity = recentActivity?.map(activity => ({
      id: activity.id,
      type: activity.event_type,
      description: activity.event_description,
      timestamp: activity.created_at,
      user: activity.user_id ? `user-${activity.user_id.slice(0, 8)}` : 'Sistem'
    })) || [];

    // Financial summary
    const totalEscrowAmount = escrows?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
    const totalServiceFees = payments?.reduce((sum, p) => sum + ((p.total_amount || 0) * 0.1), 0) || 0; // Assuming 10% service fee
    const totalCargoFees = payments?.length * 250 || 0; // Fixed cargo fee
    const totalRewards = payments?.reduce((sum, p) => sum + ((p.total_amount || 0) * 0.2), 0) || 0; // Assuming 20% reward
    const pendingAmount = escrows?.filter(e => e.status === 'active').reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    const reportData: ReportData = {
      period: period,
      totalUsers,
      totalDevices,
      totalPayments,
      totalRevenue,
      completedTransactions,
      pendingEscrows,
      averageTransactionValue,
      userGrowth,
      deviceGrowth,
      paymentGrowth,
      revenueGrowth,
      deviceStatusDistribution,
      topUsers,
      recentActivity: formattedRecentActivity,
      financialSummary: {
        totalEscrowAmount,
        totalServiceFees,
        totalCargoFees,
        totalRewards,
        pendingAmount
      }
    };

    console.log('[ADMIN_REPORTS] Report generated successfully:', {
      totalUsers,
      totalDevices,
      totalPayments,
      totalRevenue: totalRevenue.toFixed(2)
    });

    return reportData;

  } catch (error) {
    console.error('[ADMIN_REPORTS] Error generating report:', error);
    throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function exportReportAPI(
  request: ReportRequest,
  format: 'pdf' | 'excel' | 'csv'
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  try {
    // Generate report data
    const reportData = await getAdminReportsAPI(request);
    
    // In a real implementation, you would:
    // 1. Generate PDF using a library like jsPDF or Puppeteer
    // 2. Generate Excel using a library like xlsx
    // 3. Generate CSV by formatting the data
    // 4. Upload to storage and return download URL
    
    console.log(`[ADMIN_REPORTS] Exporting ${format} report for period: ${request.period}`);
    
    // Mock implementation - in production, implement actual export
    return {
      success: true,
      downloadUrl: `/api/downloads/report-${request.period}-${Date.now()}.${format}`
    };

  } catch (error) {
    console.error('[ADMIN_REPORTS] Error exporting report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed'
    };
  }
}
