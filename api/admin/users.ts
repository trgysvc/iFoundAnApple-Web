import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin API endpoints for user management
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
      case 'getUsers':
        const { data: users, error: usersError } = await supabase
          .from('userprofile')
          .select(`
            *,
            auth_users:user_id (
              id,
              email,
              created_at,
              last_sign_in_at
            )
          `)
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        return NextResponse.json({
          success: true,
          data: users
        });

      case 'getUser':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID is required'
          }, { status: 400 });
        }

        const { data: user, error: userError } = await supabase
          .from('userprofile')
          .select(`
            *,
            auth_users:user_id (
              id,
              email,
              created_at,
              last_sign_in_at
            )
          `)
          .eq('user_id', userId)
          .single();

        if (userError) throw userError;

        return NextResponse.json({
          success: true,
          data: user
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (action) {
      case 'updateUser':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID is required'
          }, { status: 400 });
        }

        const { data: updatedUser, error: updateError } = await supabase
          .from('userprofile')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (updateError) throw updateError;

        return NextResponse.json({
          success: true,
          data: updatedUser
        });

      case 'banUser':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID is required'
          }, { status: 400 });
        }

        // Update user profile with ban status
        const { data: bannedUser, error: banError } = await supabase
          .from('userprofile')
          .update({
            is_banned: true,
            ban_reason: data.reason || 'Admin ban',
            banned_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (banError) throw banError;

        // Log the ban action
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'user_ban',
            event_category: 'admin',
            event_action: 'ban',
            event_severity: 'warning',
            user_id: userId,
            event_description: `User banned by admin: ${data.reason || 'No reason provided'}`,
            event_data: {
              ban_reason: data.reason,
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: bannedUser
        });

      case 'unbanUser':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID is required'
          }, { status: 400 });
        }

        const { data: unbannedUser, error: unbanError } = await supabase
          .from('userprofile')
          .update({
            is_banned: false,
            ban_reason: null,
            banned_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (unbanError) throw unbanError;

        // Log the unban action
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'user_unban',
            event_category: 'admin',
            event_action: 'unban',
            event_severity: 'info',
            user_id: userId,
            event_description: 'User unbanned by admin',
            event_data: {
              admin_action: true
            }
          });

        return NextResponse.json({
          success: true,
          data: unbannedUser
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
