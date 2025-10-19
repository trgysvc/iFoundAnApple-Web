import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for escrow management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const escrowId = searchParams.get('escrowId');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'getEscrows':
        const { data: escrows, error: escrowsError } = await supabase
          .from('escrow_accounts')
          .select(`
            *,
            devices:device_id (
              id,
              model,
              serial_number,
              status
            ),
            holder:holder_user_id (
              id,
              email,
              first_name,
              last_name
            ),
            beneficiary:beneficiary_user_id (
              id,
              email,
              first_name,
              last_name
            ),
            payments:payment_id (
              id,
              payment_status,
              total_amount
            )
          `)
          .order('created_at', { ascending: false });

        if (escrowsError) throw escrowsError;

        return NextResponse.json({
          success: true,
          data: escrows
        });

      case 'getEscrow':
        if (!escrowId) {
          return NextResponse.json({
            success: false,
            error: 'Escrow ID is required'
          }, { status: 400 });
        }

        const { data: escrow, error: escrowError } = await supabase
          .from('escrow_accounts')
          .select(`
            *,
            devices:device_id (
              id,
              model,
              serial_number,
              status
            ),
            holder:holder_user_id (
              id,
              email,
              first_name,
              last_name
            ),
            beneficiary:beneficiary_user_id (
              id,
              email,
              first_name,
              last_name
            ),
            payments:payment_id (
              id,
              payment_status,
              total_amount
            )
          `)
          .eq('id', escrowId)
          .single();

        if (escrowError) throw escrowError;

        return NextResponse.json({
          success: true,
          data: escrow
        });

      case 'getEscrowStats':
        const { data: allEscrows, error: statsError } = await supabase
          .from('escrow_accounts')
          .select('status, total_amount, created_at');

        if (statsError) throw statsError;

        const stats = {
          total: allEscrows.length,
          totalAmount: allEscrows.reduce((sum, e) => sum + (e.total_amount || 0), 0),
          byStatus: allEscrows.reduce((acc, escrow) => {
            acc[escrow.status] = (acc[escrow.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          heldAmount: allEscrows
            .filter(e => e.status === 'held')
            .reduce((sum, e) => sum + (e.total_amount || 0), 0)
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
    console.error('Admin Escrow API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, escrowId, data } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'releaseEscrow':
        if (!escrowId) {
          return NextResponse.json({
            success: false,
            error: 'Escrow ID is required'
          }, { status: 400 });
        }

        // Get escrow details
        const { data: escrow, error: fetchError } = await supabase
          .from('escrow_accounts')
          .select('*')
          .eq('id', escrowId)
          .single();

        if (fetchError) throw fetchError;

        if (escrow.status !== 'held') {
          return NextResponse.json({
            success: false,
            error: 'Escrow is not in held status'
          }, { status: 400 });
        }

        // Update escrow status
        const { data: releasedEscrow, error: releaseError } = await supabase
          .from('escrow_accounts')
          .update({
            status: 'released',
            released_at: new Date().toISOString(),
            released_by: data.adminUserId,
            admin_notes: data.notes || 'Released by admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', escrowId)
          .select()
          .single();

        if (releaseError) throw releaseError;

        // Update related device status
        if (escrow.device_id) {
          await supabase
            .from('devices')
            .update({
              status: 'completed',
              final_payment_distributed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', escrow.device_id);
        }

        // Create financial transaction record
        await supabase
          .from('financial_transactions')
          .insert({
            payment_id: escrow.payment_id,
            device_id: escrow.device_id,
            from_user_id: escrow.holder_user_id,
            to_user_id: escrow.beneficiary_user_id,
            transaction_type: 'escrow_release',
            amount: escrow.net_payout,
            status: 'completed',
            completed_at: new Date().toISOString(),
            notes: 'Escrow released by admin'
          });

        // Log the release
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'escrow_release',
            event_category: 'admin',
            event_action: 'release',
            event_severity: 'info',
            resource_type: 'escrow',
            resource_id: escrowId,
            event_description: `Escrow released by admin: ${data.notes || 'No notes provided'}`,
            event_data: {
              release_amount: escrow.net_payout,
              admin_notes: data.notes,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: releasedEscrow
        });

      case 'refundEscrow':
        if (!escrowId) {
          return NextResponse.json({
            success: false,
            error: 'Escrow ID is required'
          }, { status: 400 });
        }

        // Get escrow details
        const { data: escrowToRefund, error: fetchRefundError } = await supabase
          .from('escrow_accounts')
          .select('*')
          .eq('id', escrowId)
          .single();

        if (fetchRefundError) throw fetchRefundError;

        // Update escrow status
        const { data: refundedEscrow, error: refundError } = await supabase
          .from('escrow_accounts')
          .update({
            status: 'refunded',
            refunded_at: new Date().toISOString(),
            refunded_by: data.adminUserId,
            admin_notes: data.notes || 'Refunded by admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', escrowId)
          .select()
          .single();

        if (refundError) throw refundError;

        // Update related device status
        if (escrowToRefund.device_id) {
          await supabase
            .from('devices')
            .update({
              status: 'lost', // Reset to lost status
              updated_at: new Date().toISOString()
            })
            .eq('id', escrowToRefund.device_id);
        }

        // Create financial transaction record for refund
        await supabase
          .from('financial_transactions')
          .insert({
            payment_id: escrowToRefund.payment_id,
            device_id: escrowToRefund.device_id,
            from_user_id: escrowToRefund.beneficiary_user_id,
            to_user_id: escrowToRefund.holder_user_id,
            transaction_type: 'escrow_refund',
            amount: escrowToRefund.total_amount,
            status: 'completed',
            completed_at: new Date().toISOString(),
            notes: 'Escrow refunded by admin'
          });

        // Log the refund
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'escrow_refund',
            event_category: 'admin',
            event_action: 'refund',
            event_severity: 'warning',
            resource_type: 'escrow',
            resource_id: escrowId,
            event_description: `Escrow refunded by admin: ${data.notes || 'No reason provided'}`,
            event_data: {
              refund_amount: escrowToRefund.total_amount,
              admin_notes: data.notes,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: refundedEscrow
        });

      case 'updateEscrowNotes':
        if (!escrowId) {
          return NextResponse.json({
            success: false,
            error: 'Escrow ID is required'
          }, { status: 400 });
        }

        const { data: updatedEscrow, error: updateError } = await supabase
          .from('escrow_accounts')
          .update({
            admin_notes: data.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', escrowId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Log the update
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'escrow_update',
            event_category: 'admin',
            event_action: 'update',
            event_severity: 'info',
            resource_type: 'escrow',
            resource_id: escrowId,
            event_description: 'Escrow notes updated by admin',
            event_data: {
              admin_notes: data.notes,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: updatedEscrow
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Escrow API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
