import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for payment management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const paymentId = searchParams.get('paymentId');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'getPayments':
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select(`
            *,
            devices:device_id (
              id,
              model,
              serial_number,
              status
            ),
            payer:payer_id (
              id,
              email,
              first_name,
              last_name
            ),
            receiver:receiver_id (
              id,
              email,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });

        if (paymentsError) throw paymentsError;

        return NextResponse.json({
          success: true,
          data: payments
        });

      case 'getPayment':
        if (!paymentId) {
          return NextResponse.json({
            success: false,
            error: 'Payment ID is required'
          }, { status: 400 });
        }

        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select(`
            *,
            devices:device_id (
              id,
              model,
              serial_number,
              status
            ),
            payer:payer_id (
              id,
              email,
              first_name,
              last_name
            ),
            receiver:receiver_id (
              id,
              email,
              first_name,
              last_name
            )
          `)
          .eq('id', paymentId)
          .single();

        if (paymentError) throw paymentError;

        return NextResponse.json({
          success: true,
          data: payment
        });

      case 'getPaymentStats':
        const { data: allPayments, error: statsError } = await supabase
          .from('payments')
          .select('payment_status, total_amount, created_at');

        if (statsError) throw statsError;

        const stats = {
          total: allPayments.length,
          totalAmount: allPayments.reduce((sum, p) => sum + (p.total_amount || 0), 0),
          byStatus: allPayments.reduce((acc, payment) => {
            acc[payment.payment_status] = (acc[payment.payment_status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          monthlyRevenue: allPayments
            .filter(p => p.created_at)
            .reduce((acc, payment) => {
              const month = new Date(payment.created_at).toISOString().substring(0, 7);
              acc[month] = (acc[month] || 0) + (payment.total_amount || 0);
              return acc;
            }, {} as Record<string, number>)
        };

        return NextResponse.json({
          success: true,
          data: stats
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Payments API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, paymentId, data } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'refundPayment':
        if (!paymentId) {
          return NextResponse.json({
            success: false,
            error: 'Payment ID is required'
          }, { status: 400 });
        }

        // Get payment details
        const { data: payment, error: fetchError } = await supabase
          .from('payments')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (fetchError) throw fetchError;

        // Update payment status
        const { data: refundedPayment, error: refundError } = await supabase
          .from('payments')
          .update({
            payment_status: 'refunded',
            refund_reason: data.reason || 'Admin refund',
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentId)
          .select()
          .single();

        if (refundError) throw refundError;

        // Update related device status if needed
        if (payment.device_id) {
          await supabase
            .from('devices')
            .update({
              status: 'lost', // Reset to lost status
              updated_at: new Date().toISOString()
            })
            .eq('id', payment.device_id);
        }

        // Log the refund
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'payment_refund',
            event_category: 'admin',
            event_action: 'refund',
            event_severity: 'warning',
            resource_type: 'payment',
            resource_id: paymentId,
            event_description: `Payment refunded by admin: ${data.reason || 'No reason provided'}`,
            event_data: {
              refund_reason: data.reason,
              refund_amount: payment.total_amount,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: refundedPayment
        });

      case 'updatePaymentStatus':
        if (!paymentId) {
          return NextResponse.json({
            success: false,
            error: 'Payment ID is required'
          }, { status: 400 });
        }

        const { data: statusUpdatedPayment, error: statusError } = await supabase
          .from('payments')
          .update({
            payment_status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentId)
          .select()
          .single();

        if (statusError) throw statusError;

        // Log the status change
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'payment_status_change',
            event_category: 'admin',
            event_action: 'update',
            event_severity: 'info',
            resource_type: 'payment',
            resource_id: paymentId,
            event_description: `Payment status changed to ${data.status} by admin`,
            event_data: {
              new_status: data.status,
              reason: data.reason || 'Admin action',
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: statusUpdatedPayment
        });

      case 'retryPayment':
        if (!paymentId) {
          return NextResponse.json({
            success: false,
            error: 'Payment ID is required'
          }, { status: 400 });
        }

        // This would integrate with the actual payment provider
        // For now, we'll just log the retry attempt
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'payment_retry',
            event_category: 'admin',
            event_action: 'retry',
            event_severity: 'info',
            resource_type: 'payment',
            resource_id: paymentId,
            event_description: 'Payment retry initiated by admin',
            event_data: {
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          message: 'Payment retry initiated'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Payments API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
