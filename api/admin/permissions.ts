import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for permission management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'checkPermissions':
        // Check if current user has admin permissions
        const currentUserId = userId || request.headers.get('x-user-id');
        
        if (!currentUserId) {
          return NextResponse.json({
            success: false,
            error: 'User ID is required'
          }, { status: 400 });
        }

        // Check admin permissions from admin_permissions table
        const { data: adminPermission, error: permissionError } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('user_id', currentUserId)
          .eq('is_active', true)
          .single();

        // Also check auth.users table for role (if implemented)
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(currentUserId);

        const isAdmin = !!adminPermission || 
          (authUser?.user?.user_metadata?.role === 'admin') ||
          (authUser?.user?.user_metadata?.role === 'super_admin');

        const isSuperAdmin = adminPermission?.role === 'super_admin' ||
          authUser?.user?.user_metadata?.role === 'super_admin';

        return NextResponse.json({
          success: true,
          data: {
            isAdmin,
            isSuperAdmin,
            permissions: adminPermission?.permissions || {},
            role: adminPermission?.role || authUser?.user?.user_metadata?.role || 'user'
          }
        });

      case 'getPermissions':
        const { data: permissions, error: permissionsError } = await supabase
          .from('admin_permissions')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            ),
            granter:granted_by (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .order('granted_at', { ascending: false });

        if (permissionsError) throw permissionsError;

        return NextResponse.json({
          success: true,
          data: permissions
        });

      case 'getPermission':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID is required'
          }, { status: 400 });
        }

        const { data: permission, error: permissionError } = await supabase
          .from('admin_permissions')
          .select(`
            *,
            userprofile:user_id (
              id,
              first_name,
              last_name,
              email
            ),
            granter:granted_by (
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (permissionError) throw permissionError;

        return NextResponse.json({
          success: true,
          data: permission
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Permissions API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, role, permissions, expiresAt, notes } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get current user ID from headers or JWT
    const currentUserId = request.headers.get('x-user-id') || 'system';

    switch (action) {
      case 'grantPermission':
        if (!userId || !role) {
          return NextResponse.json({
            success: false,
            error: 'User ID and role are required'
          }, { status: 400 });
        }

        // Check if user already has active admin permission
        const { data: existingPermission } = await supabase
          .from('admin_permissions')
          .select('id')
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (existingPermission) {
          return NextResponse.json({
            success: false,
            error: 'User already has active admin permission'
          }, { status: 400 });
        }

        // Grant new admin permission
        const { data: newPermission, error: grantError } = await supabase
          .from('admin_permissions')
          .insert({
            user_id: userId,
            role,
            permissions: permissions || {},
            granted_by: currentUserId,
            expires_at: expiresAt || null,
            notes: notes || 'Admin permission granted',
            is_active: true
          })
          .select()
          .single();

        if (grantError) throw grantError;

        // Log the permission grant
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'admin_permission_granted',
            event_category: 'admin',
            event_action: 'grant',
            event_severity: 'warning',
            user_id: userId,
            event_description: `Admin permission granted: ${role}`,
            event_data: {
              role,
              permissions,
              granted_by: currentUserId,
              expires_at: expiresAt
            }
          });

        return NextResponse.json({
          success: true,
          data: newPermission
        });

      case 'revokePermission':
        const { permissionId } = body;
        
        if (!permissionId) {
          return NextResponse.json({
            success: false,
            error: 'Permission ID is required'
          }, { status: 400 });
        }

        // Get permission details before revoking
        const { data: permissionToRevoke, error: fetchError } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('id', permissionId)
          .single();

        if (fetchError) throw fetchError;

        // Revoke permission
        const { error: revokeError } = await supabase
          .from('admin_permissions')
          .update({
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', permissionId);

        if (revokeError) throw revokeError;

        // Log the permission revocation
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'admin_permission_revoked',
            event_category: 'admin',
            event_action: 'revoke',
            event_severity: 'warning',
            user_id: permissionToRevoke.user_id,
            event_description: `Admin permission revoked`,
            event_data: {
              permission_id: permissionId,
              revoked_by: currentUserId,
              original_role: permissionToRevoke.role
            }
          });

        return NextResponse.json({
          success: true,
          message: 'Permission revoked successfully'
        });

      case 'updatePermission':
        const { permissionId: updatePermissionId, updateData } = body;
        
        if (!updatePermissionId) {
          return NextResponse.json({
            success: false,
            error: 'Permission ID is required'
          }, { status: 400 });
        }

        const { data: updatedPermission, error: updateError } = await supabase
          .from('admin_permissions')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatePermissionId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Log the permission update
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'admin_permission_updated',
            event_category: 'admin',
            event_action: 'update',
            event_severity: 'info',
            user_id: updatedPermission.user_id,
            event_description: `Admin permission updated`,
            event_data: {
              permission_id: updatePermissionId,
              updated_by: currentUserId,
              changes: updateData
            }
          });

        return NextResponse.json({
          success: true,
          data: updatedPermission
        });

      case 'extendPermission':
        const { permissionId: extendPermissionId, newExpiryDate } = body;
        
        if (!extendPermissionId) {
          return NextResponse.json({
            success: false,
            error: 'Permission ID is required'
          }, { status: 400 });
        }

        const { data: extendedPermission, error: extendError } = await supabase
          .from('admin_permissions')
          .update({
            expires_at: newExpiryDate,
            updated_at: new Date().toISOString()
          })
          .eq('id', extendPermissionId)
          .select()
          .single();

        if (extendError) throw extendError;

        // Log the permission extension
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'admin_permission_extended',
            event_category: 'admin',
            event_action: 'extend',
            event_severity: 'info',
            user_id: extendedPermission.user_id,
            event_description: `Admin permission extended until ${newExpiryDate}`,
            event_data: {
              permission_id: extendPermissionId,
              extended_by: currentUserId,
              new_expiry_date: newExpiryDate
            }
          });

        return NextResponse.json({
          success: true,
          data: extendedPermission
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin Permissions API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
