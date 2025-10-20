/**
 * Dispute Management System
 * Handles dispute workflow, status management, and resolution logic
 */

import { supabase } from './supabaseClient';
import { DisputeStatus, DisputeReason, Dispute, DisputeResolution } from '../types.ts';

export interface DisputeWorkflowStep {
  status: DisputeStatus;
  description: string;
  nextPossibleStatuses: DisputeStatus[];
  requiredActions: string[];
  estimatedTimeHours?: number;
}

export class DisputeManager {
  private static readonly WORKFLOW_STEPS: Record<DisputeStatus, DisputeWorkflowStep> = {
    [DisputeStatus.PENDING]: {
      status: DisputeStatus.PENDING,
      description: 'İtiraz bekliyor - Admin incelemesi bekleniyor',
      nextPossibleStatuses: [DisputeStatus.UNDER_REVIEW, DisputeStatus.REJECTED],
      requiredActions: ['Admin incelemesi', 'İtiraz geçerliliği kontrolü'],
      estimatedTimeHours: 24
    },
    [DisputeStatus.UNDER_REVIEW]: {
      status: DisputeStatus.UNDER_REVIEW,
      description: 'İtiraz inceleniyor - Detaylı analiz yapılıyor',
      nextPossibleStatuses: [DisputeStatus.RESOLVED, DisputeStatus.REJECTED, DisputeStatus.ESCALATED],
      requiredActions: ['Detaylı inceleme', 'Taraflarla iletişim', 'Kanıt analizi'],
      estimatedTimeHours: 72
    },
    [DisputeStatus.RESOLVED]: {
      status: DisputeStatus.RESOLVED,
      description: 'İtiraz çözüldü - Sorun giderildi',
      nextPossibleStatuses: [],
      requiredActions: ['Çözüm uygulaması', 'Taraflara bildirim'],
      estimatedTimeHours: 0
    },
    [DisputeStatus.REJECTED]: {
      status: DisputeStatus.REJECTED,
      description: 'İtiraz reddedildi - Geçersiz bulundu',
      nextPossibleStatuses: [DisputeStatus.ESCALATED],
      requiredActions: ['Red nedeni açıklaması', 'Taraflara bildirim'],
      estimatedTimeHours: 0
    },
    [DisputeStatus.ESCALATED]: {
      status: DisputeStatus.ESCALATED,
      description: 'İtiraz üst seviyeye taşındı - Özel inceleme',
      nextPossibleStatuses: [DisputeStatus.RESOLVED, DisputeStatus.REJECTED],
      requiredActions: ['Üst düzey inceleme', 'Hukuki danışmanlık'],
      estimatedTimeHours: 168
    }
  };

  /**
   * Raise a new dispute
   */
  static async raiseDispute(
    deviceId: string,
    paymentId: string,
    cargoShipmentId: string,
    disputeReason: DisputeReason,
    notes: string,
    photos: string[] = [],
    userId: string
  ): Promise<{ success: boolean; disputeId?: string; error?: string }> {
    try {
      console.log('[DISPUTE] Raising new dispute...', {
        deviceId,
        paymentId,
        disputeReason,
        userId
      });

      // Update escrow account with dispute
      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow_accounts')
        .update({
          dispute_status: DisputeStatus.PENDING,
          dispute_reason: disputeReason,
          resolution_notes: notes,
          activity_log: supabase.raw(`
            activity_log || '[{"action": "dispute_raised", "timestamp": "${new Date().toISOString()}", "user_id": "${userId}", "reason": "${disputeReason}", "description": "Dispute raised by user"}]'::jsonb
          `),
          last_activity_at: new Date().toISOString()
        })
        .eq('device_id', deviceId)
        .eq('payment_id', paymentId)
        .select()
        .single();

      if (escrowError) {
        console.error('[DISPUTE] Error updating escrow:', escrowError);
        return { success: false, error: 'Failed to raise dispute' };
      }

      // Update payment with dispute
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          dispute_status: DisputeStatus.PENDING,
          dispute_reason: disputeReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (paymentError) {
        console.error('[DISPUTE] Error updating payment:', paymentError);
        return { success: false, error: 'Failed to update payment dispute status' };
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          event_type: 'dispute_raised',
          event_category: 'dispute',
          event_action: 'create',
          event_severity: 'medium',
          user_id: userId,
          resource_type: 'dispute',
          resource_id: escrowData.id,
          parent_resource_type: 'escrow_account',
          parent_resource_id: escrowData.id,
          event_description: `Dispute raised for device ${deviceId}: ${disputeReason}`,
          event_data: {
            device_id: deviceId,
            payment_id: paymentId,
            cargo_shipment_id: cargoShipmentId,
            dispute_reason: disputeReason,
            photos_count: photos.length,
            notes_length: notes.length
          }
        });

      console.log('[DISPUTE] ✅ Dispute raised successfully:', escrowData.id);
      return { success: true, disputeId: escrowData.id };

    } catch (error) {
      console.error('[DISPUTE] Error raising dispute:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update dispute status
   */
  static async updateDisputeStatus(
    disputeId: string,
    newStatus: DisputeStatus,
    adminNotes: string,
    resolution?: string,
    adminUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[DISPUTE] Updating dispute status...', {
        disputeId,
        newStatus,
        adminUserId
      });

      // Validate status transition
      const currentDispute = await this.getDisputeById(disputeId);
      if (!currentDispute) {
        return { success: false, error: 'Dispute not found' };
      }

      const currentStep = this.WORKFLOW_STEPS[currentDispute.status];
      if (!currentStep.nextPossibleStatuses.includes(newStatus)) {
        return { 
          success: false, 
          error: `Invalid status transition from ${currentDispute.status} to ${newStatus}` 
        };
      }

      // Update escrow account
      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow_accounts')
        .update({
          dispute_status: newStatus,
          admin_notes: adminNotes,
          resolution_method: newStatus === DisputeStatus.RESOLVED ? resolution : null,
          resolution_notes: resolution || null,
          activity_log: supabase.raw(`
            activity_log || '[{"action": "dispute_status_updated", "timestamp": "${new Date().toISOString()}", "admin_id": "${adminUserId}", "from_status": "${currentDispute.status}", "to_status": "${newStatus}", "description": "Dispute status updated by admin"}]'::jsonb
          `),
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId)
        .select()
        .single();

      if (escrowError) {
        console.error('[DISPUTE] Error updating escrow:', escrowError);
        return { success: false, error: 'Failed to update dispute status' };
      }

      // Update payment
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          dispute_status: newStatus,
          dispute_reason: newStatus === DisputeStatus.RESOLVED ? null : escrowData.dispute_reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', escrowData.payment_id);

      if (paymentError) {
        console.error('[DISPUTE] Error updating payment:', paymentError);
        return { success: false, error: 'Failed to update payment dispute status' };
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          event_type: 'dispute_status_updated',
          event_category: 'dispute',
          event_action: 'update',
          event_severity: 'medium',
          user_id: adminUserId,
          resource_type: 'dispute',
          resource_id: disputeId,
          parent_resource_type: 'escrow_account',
          parent_resource_id: disputeId,
          event_description: `Dispute status updated from ${currentDispute.status} to ${newStatus}`,
          event_data: {
            dispute_id: disputeId,
            previous_status: currentDispute.status,
            new_status: newStatus,
            admin_notes: adminNotes,
            resolution: resolution
          }
        });

      // Handle resolution-specific actions
      if (newStatus === DisputeStatus.RESOLVED) {
        await this.handleDisputeResolution(disputeId, escrowData);
      }

      console.log('[DISPUTE] ✅ Dispute status updated successfully');
      return { success: true };

    } catch (error) {
      console.error('[DISPUTE] Error updating dispute status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get dispute by ID
   */
  static async getDisputeById(disputeId: string): Promise<Dispute | null> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select(`
          id,
          device_id,
          payment_id,
          dispute_status,
          dispute_reason,
          resolution_notes,
          admin_notes,
          resolution_method,
          created_at,
          updated_at,
          last_activity_at
        `)
        .eq('id', disputeId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        device_id: data.device_id,
        payment_id: data.payment_id,
        dispute_reason: data.dispute_reason as DisputeReason,
        status: data.dispute_status as DisputeStatus,
        created_at: data.created_at,
        updated_at: data.updated_at,
        admin_notes: data.admin_notes,
        resolution: data.resolution_method,
        notes: data.resolution_notes,
        photos: []
      };
    } catch (error) {
      console.error('[DISPUTE] Error getting dispute:', error);
      return null;
    }
  }

  /**
   * Get user disputes
   */
  static async getUserDisputes(userId: string): Promise<Dispute[]> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select(`
          id,
          device_id,
          payment_id,
          dispute_status,
          dispute_reason,
          resolution_notes,
          admin_notes,
          resolution_method,
          created_at,
          updated_at,
          last_activity_at,
          devices!inner(
            model,
            serialNumber
          )
        `)
        .or(`holder_user_id.eq.${userId},beneficiary_user_id.eq.${userId}`)
        .not('dispute_status', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[DISPUTE] Error fetching user disputes:', error);
        return [];
      }

      return data.map(dispute => ({
        id: dispute.id,
        device_id: dispute.device_id,
        payment_id: dispute.payment_id,
        dispute_reason: dispute.dispute_reason as DisputeReason,
        status: dispute.dispute_status as DisputeStatus,
        created_at: dispute.created_at,
        updated_at: dispute.updated_at,
        admin_notes: dispute.admin_notes,
        resolution: dispute.resolution_method,
        notes: dispute.resolution_notes,
        photos: [],
        device_model: dispute.devices?.model,
        device_serial: dispute.devices?.serialNumber
      }));
    } catch (error) {
      console.error('[DISPUTE] Error fetching user disputes:', error);
      return [];
    }
  }

  /**
   * Get all disputes for admin
   */
  static async getAllDisputes(): Promise<Dispute[]> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select(`
          id,
          device_id,
          payment_id,
          holder_user_id,
          beneficiary_user_id,
          dispute_status,
          dispute_reason,
          resolution_notes,
          admin_notes,
          resolution_method,
          created_at,
          updated_at,
          last_activity_at,
          devices!inner(
            model,
            serialNumber
          )
        `)
        .not('dispute_status', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[DISPUTE] Error fetching all disputes:', error);
        return [];
      }

      return data.map(dispute => ({
        id: dispute.id,
        device_id: dispute.device_id,
        payment_id: dispute.payment_id,
        dispute_reason: dispute.dispute_reason as DisputeReason,
        status: dispute.dispute_status as DisputeStatus,
        created_at: dispute.created_at,
        updated_at: dispute.updated_at,
        admin_notes: dispute.admin_notes,
        resolution: dispute.resolution_method,
        notes: dispute.resolution_notes,
        photos: [],
        device_model: dispute.devices?.model,
        device_serial: dispute.devices?.serialNumber
      }));
    } catch (error) {
      console.error('[DISPUTE] Error fetching all disputes:', error);
      return [];
    }
  }

  /**
   * Get workflow step information
   */
  static getWorkflowStep(status: DisputeStatus): DisputeWorkflowStep {
    return this.WORKFLOW_STEPS[status];
  }

  /**
   * Get all possible next statuses for a given status
   */
  static getNextPossibleStatuses(currentStatus: DisputeStatus): DisputeStatus[] {
    return this.WORKFLOW_STEPS[currentStatus].nextPossibleStatuses;
  }

  /**
   * Handle dispute resolution (trigger escrow release, notifications, etc.)
   */
  private static async handleDisputeResolution(disputeId: string, escrowData: any): Promise<void> {
    try {
      console.log('[DISPUTE] Handling dispute resolution...', { disputeId });

      // TODO: Implement automatic escrow release logic
      // TODO: Send notifications to involved parties
      // TODO: Update device status if needed
      // TODO: Generate resolution report

      console.log('[DISPUTE] ✅ Dispute resolution handled');
    } catch (error) {
      console.error('[DISPUTE] Error handling dispute resolution:', error);
    }
  }

  /**
   * Get dispute statistics
   */
  static async getDisputeStatistics(): Promise<{
    total: number;
    pending: number;
    under_review: number;
    resolved: number;
    rejected: number;
    escalated: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select('dispute_status')
        .not('dispute_status', 'is', null);

      if (error) {
        console.error('[DISPUTE] Error fetching dispute statistics:', error);
        return {
          total: 0,
          pending: 0,
          under_review: 0,
          resolved: 0,
          rejected: 0,
          escalated: 0
        };
      }

      const stats = data.reduce((acc, dispute) => {
        acc.total++;
        acc[dispute.dispute_status as DisputeStatus]++;
        return acc;
      }, {
        total: 0,
        pending: 0,
        under_review: 0,
        resolved: 0,
        rejected: 0,
        escalated: 0
      });

      return stats;
    } catch (error) {
      console.error('[DISPUTE] Error getting dispute statistics:', error);
      return {
        total: 0,
        pending: 0,
        under_review: 0,
        resolved: 0,
        rejected: 0,
        escalated: 0
      };
    }
  }
}
