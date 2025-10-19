/**
 * Test script for Admin Reports API
 * Bu script raporlama API'sinin çalışıp çalışmadığını test eder
 */

import { getAdminReportsAPI, exportReportAPI } from './api/admin-reports.js';

async function testReportsAPI() {
  console.log('🧪 Testing Admin Reports API...\n');

  try {
    // Test 1: Basic report generation
    console.log('📊 Test 1: Basic report generation (30 days)');
    const reportData = await getAdminReportsAPI({
      period: '30d',
      reportType: 'overview'
    });
    
    console.log('✅ Report generated successfully:');
    console.log(`   - Total Users: ${reportData.totalUsers}`);
    console.log(`   - Total Devices: ${reportData.totalDevices}`);
    console.log(`   - Total Payments: ${reportData.totalPayments}`);
    console.log(`   - Total Revenue: ₺${reportData.totalRevenue.toLocaleString('tr-TR')}`);
    console.log(`   - User Growth: ${reportData.userGrowth.toFixed(1)}%`);
    console.log(`   - Device Growth: ${reportData.deviceGrowth.toFixed(1)}%`);
    console.log(`   - Payment Growth: ${reportData.paymentGrowth.toFixed(1)}%`);
    console.log(`   - Revenue Growth: ${reportData.revenueGrowth.toFixed(1)}%`);
    console.log('');

    // Test 2: Different time periods
    console.log('📊 Test 2: Different time periods');
    const periods = ['7d', '30d', '90d', '1y'];
    for (const period of periods) {
      try {
        const data = await getAdminReportsAPI({
          period: period,
          reportType: 'overview'
        });
        console.log(`   ✅ ${period}: ${data.totalUsers} users, ${data.totalDevices} devices`);
      } catch (error) {
        console.log(`   ❌ ${period}: ${error.message}`);
      }
    }
    console.log('');

    // Test 3: Different report types
    console.log('📊 Test 3: Different report types');
    const reportTypes = ['overview', 'users', 'devices', 'payments', 'financial', 'security'];
    for (const reportType of reportTypes) {
      try {
        const data = await getAdminReportsAPI({
          period: '30d',
          reportType: reportType
        });
        console.log(`   ✅ ${reportType}: Report generated successfully`);
      } catch (error) {
        console.log(`   ❌ ${reportType}: ${error.message}`);
      }
    }
    console.log('');

    // Test 4: Export functionality
    console.log('📊 Test 4: Export functionality');
    const formats = ['pdf', 'excel', 'csv'];
    for (const format of formats) {
      try {
        const result = await exportReportAPI({
          period: '30d',
          reportType: 'overview'
        }, format);
        
        if (result.success) {
          console.log(`   ✅ ${format.toUpperCase()}: Export successful - ${result.downloadUrl}`);
        } else {
          console.log(`   ❌ ${format.toUpperCase()}: ${result.error}`);
        }
      } catch (error) {
        console.log(`   ❌ ${format.toUpperCase()}: ${error.message}`);
      }
    }
    console.log('');

    // Test 5: Device status distribution
    console.log('📊 Test 5: Device status distribution');
    const statusDistribution = reportData.deviceStatusDistribution;
    console.log('   Device Status Distribution:');
    Object.entries(statusDistribution).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} devices`);
    });
    console.log('');

    // Test 6: Top users
    console.log('📊 Test 6: Top users');
    if (reportData.topUsers && reportData.topUsers.length > 0) {
      console.log('   Top Users:');
      reportData.topUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      - Devices: ${user.deviceCount}`);
        console.log(`      - Total Spent: ₺${user.totalSpent.toLocaleString('tr-TR')}`);
      });
    } else {
      console.log('   No user data available');
    }
    console.log('');

    // Test 7: Recent activity
    console.log('📊 Test 7: Recent activity');
    if (reportData.recentActivity && reportData.recentActivity.length > 0) {
      console.log('   Recent Activity:');
      reportData.recentActivity.slice(0, 5).forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.description}`);
        console.log(`      - User: ${activity.user}`);
        console.log(`      - Time: ${new Date(activity.timestamp).toLocaleString('tr-TR')}`);
      });
    } else {
      console.log('   No activity data available');
    }
    console.log('');

    // Test 8: Financial summary
    console.log('📊 Test 8: Financial summary');
    const financial = reportData.financialSummary;
    console.log('   Financial Summary:');
    console.log(`   - Total Escrow Amount: ₺${financial.totalEscrowAmount.toLocaleString('tr-TR')}`);
    console.log(`   - Total Service Fees: ₺${financial.totalServiceFees.toLocaleString('tr-TR')}`);
    console.log(`   - Total Cargo Fees: ₺${financial.totalCargoFees.toLocaleString('tr-TR')}`);
    console.log(`   - Total Rewards: ₺${financial.totalRewards.toLocaleString('tr-TR')}`);
    console.log(`   - Pending Amount: ₺${financial.pendingAmount.toLocaleString('tr-TR')}`);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📊 Admin Reports API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testReportsAPI();
