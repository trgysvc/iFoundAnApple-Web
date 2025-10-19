import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for device management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const deviceId = searchParams.get('deviceId');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'getDevices':
        const { data: devices, error: devicesError } = await supabase
          .from('devices')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (devicesError) throw devicesError;

        return NextResponse.json({
          success: true,
          data: devices
        });

      case 'getDevice':
        if (!deviceId) {
          return NextResponse.json({
            success: false,
            error: 'Device ID is required'
          }, { status: 400 });
        }

        const { data: device, error: deviceError } = await supabase
          .from('devices')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('id', deviceId)
          .single();

        if (deviceError) throw deviceError;

        return NextResponse.json({
          success: true,
          data: device
        });

      case 'getDeviceStats':
        const { data: allDevices, error: statsError } = await supabase
          .from('devices')
          .select('status');

        if (statsError) throw statsError;

        const stats = allDevices.reduce((acc, device) => {
          acc[device.status] = (acc[device.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
          success: true,
          data: {
            total: allDevices.length,
            byStatus: stats
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Devices API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, deviceId, data } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'updateDevice':
        if (!deviceId) {
          return NextResponse.json({
            success: false,
            error: 'Device ID is required'
          }, { status: 400 });
        }

        const { data: updatedDevice, error: updateError } = await supabase
          .from('devices')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', deviceId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Log the update
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'device_update',
            event_category: 'admin',
            event_action: 'update',
            event_severity: 'info',
            resource_type: 'device',
            resource_id: deviceId,
            event_description: 'Device updated by admin',
            event_data: {
              changes: data,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: updatedDevice
        });

      case 'deleteDevice':
        if (!deviceId) {
          return NextResponse.json({
            success: false,
            error: 'Device ID is required'
          }, { status: 400 });
        }

        // First get device info for logging
        const { data: deviceToDelete, error: fetchError } = await supabase
          .from('devices')
          .select('*')
          .eq('id', deviceId)
          .single();

        if (fetchError) throw fetchError;

        // Delete the device
        const { error: deleteError } = await supabase
          .from('devices')
          .delete()
          .eq('id', deviceId);

        if (deleteError) throw deleteError;

        // Log the deletion
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'device_delete',
            event_category: 'admin',
            event_action: 'delete',
            event_severity: 'warning',
            resource_type: 'device',
            resource_id: deviceId,
            event_description: 'Device deleted by admin',
            event_data: {
              deleted_device: deviceToDelete,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          message: 'Device deleted successfully'
        });

      case 'updateDeviceStatus':
        if (!deviceId) {
          return NextResponse.json({
            success: false,
            error: 'Device ID is required'
          }, { status: 400 });
        }

        const { data: statusUpdatedDevice, error: statusError } = await supabase
          .from('devices')
          .update({
            status: data.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', deviceId)
          .select()
          .single();

        if (statusError) throw statusError;

        // Log the status change
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'device_status_change',
            event_category: 'admin',
            event_action: 'update',
            event_severity: 'info',
            resource_type: 'device',
            resource_id: deviceId,
            event_description: `Device status changed to ${data.status} by admin`,
            event_data: {
              new_status: data.status,
              reason: data.reason || 'Admin action',
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: statusUpdatedDevice
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Devices API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
