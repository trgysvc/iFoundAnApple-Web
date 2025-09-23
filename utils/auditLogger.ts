/**
 * Audit Logging Utilities
 * Provides comprehensive audit trail functionality for security and compliance
 */

import { getSecureConfig } from "./config.ts";

// Audit logging interfaces
export interface AuditLogEntry {
  eventType: string;
  eventCategory: AuditCategory;
  eventAction: AuditAction;
  eventDescription: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  eventData?: Record<string, any>;
  eventSeverity?: AuditSeverity;
  correlationId?: string;
  isSensitive?: boolean;
  tags?: string[];
}

export type AuditCategory =
  | "device"
  | "payment"
  | "escrow"
  | "user"
  | "security"
  | "system"
  | "cargo"
  | "financial";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "confirm"
  | "cancel"
  | "approve"
  | "reject"
  | "login"
  | "logout";

export type AuditSeverity = "debug" | "info" | "warning" | "error" | "critical";

export interface AuditQueryFilter {
  eventCategory?: AuditCategory;
  eventType?: string;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  severity?: AuditSeverity;
  dateFrom?: Date;
  dateTo?: Date;
  correlationId?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface AuditStatistics {
  totalEvents: number;
  eventsByCategory: Record<AuditCategory, number>;
  eventsBySeverity: Record<AuditSeverity, number>;
  uniqueUsers: number;
  sensitiveEvents: number;
  recentActivity: AuditLogEntry[];
}

/**
 * Create an audit log entry
 */
export const createAuditLog = async (
  entry: AuditLogEntry
): Promise<boolean> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    // Call the database function to create audit log
    const { error } = await supabase.rpc("create_audit_log", {
      p_event_type: entry.eventType,
      p_event_category: entry.eventCategory,
      p_event_action: entry.eventAction,
      p_event_description: entry.eventDescription,
      p_user_id: entry.userId || null,
      p_resource_type: entry.resourceType || null,
      p_resource_id: entry.resourceId || null,
      p_old_values: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
      p_new_values: entry.newValues ? JSON.stringify(entry.newValues) : null,
      p_event_data: entry.eventData ? JSON.stringify(entry.eventData) : null,
      p_event_severity: entry.eventSeverity || "info",
      p_session_id: entry.sessionId || null,
      p_ip_address: entry.ipAddress || null,
      p_correlation_id: entry.correlationId || null,
      p_is_sensitive: entry.isSensitive || false,
      p_tags: entry.tags || null,
    });

    if (error) {
      console.error("Error creating audit log:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in createAuditLog:", error);
    return false;
  }
};

/**
 * Device-related audit logging
 */
export class DeviceAuditLogger {
  static async logDeviceCreated(
    deviceId: string,
    userId: string,
    deviceData: any,
    context?: { sessionId?: string; ipAddress?: string }
  ) {
    return createAuditLog({
      eventType: "device_created",
      eventCategory: "device",
      eventAction: "create",
      eventDescription: `Device created: ${deviceData.model} (${deviceData.serialNumber})`,
      userId,
      resourceType: "device",
      resourceId: deviceId,
      newValues: deviceData,
      eventData: {
        deviceModel: deviceData.model,
        deviceSerial: deviceData.serialNumber,
        deviceStatus: deviceData.status,
        isLost: deviceData.status === "lost",
      },
      correlationId: deviceId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      tags: ["device", "creation", deviceData.status],
    });
  }

  static async logDeviceStatusChanged(
    deviceId: string,
    userId: string,
    oldStatus: string,
    newStatus: string,
    context?: { sessionId?: string; ipAddress?: string; reason?: string }
  ) {
    return createAuditLog({
      eventType: "device_status_changed",
      eventCategory: "device",
      eventAction: "update",
      eventDescription: `Device status changed: ${oldStatus} → ${newStatus}`,
      userId,
      resourceType: "device",
      resourceId: deviceId,
      oldValues: { status: oldStatus },
      newValues: { status: newStatus },
      eventData: {
        oldStatus,
        newStatus,
        reason: context?.reason,
      },
      correlationId: deviceId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      tags: ["device", "status_change", oldStatus, newStatus],
    });
  }

  static async logDeviceMatched(
    ownerDeviceId: string,
    finderDeviceId: string,
    context?: { sessionId?: string; matchScore?: number }
  ) {
    const correlationId = `match_${ownerDeviceId}_${finderDeviceId}`;

    return createAuditLog({
      eventType: "device_matched",
      eventCategory: "device",
      eventAction: "update",
      eventDescription: `Device match found between owner and finder devices`,
      resourceType: "device",
      resourceId: ownerDeviceId,
      eventData: {
        ownerDeviceId,
        finderDeviceId,
        matchScore: context?.matchScore || 100,
      },
      correlationId,
      sessionId: context?.sessionId,
      tags: ["device", "matching", "found"],
    });
  }
}

/**
 * Payment-related audit logging
 */
export class PaymentAuditLogger {
  static async logPaymentInitiated(
    paymentId: string,
    userId: string,
    paymentData: any,
    context?: { sessionId?: string; ipAddress?: string }
  ) {
    return createAuditLog({
      eventType: "payment_initiated",
      eventCategory: "payment",
      eventAction: "create",
      eventDescription: `Payment initiated: ${paymentData.totalAmount} TL`,
      userId,
      resourceType: "payment",
      resourceId: paymentId,
      newValues: {
        totalAmount: paymentData.totalAmount,
        provider: paymentData.provider,
        deviceId: paymentData.deviceId,
      },
      eventData: paymentData,
      correlationId: paymentData.deviceId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      isSensitive: true,
      tags: ["payment", "initiation", paymentData.provider],
    });
  }

  static async logPaymentCompleted(
    paymentId: string,
    userId: string,
    amount: number,
    transactionId: string,
    context?: { sessionId?: string; ipAddress?: string }
  ) {
    return createAuditLog({
      eventType: "payment_completed",
      eventCategory: "payment",
      eventAction: "confirm",
      eventDescription: `Payment completed successfully: ${amount} TL`,
      userId,
      resourceType: "payment",
      resourceId: paymentId,
      eventData: {
        amount,
        transactionId,
        completedAt: new Date().toISOString(),
      },
      eventSeverity: "info",
      correlationId: paymentId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      isSensitive: true,
      tags: ["payment", "completion", "success"],
    });
  }

  static async logPaymentFailed(
    paymentId: string,
    userId: string,
    amount: number,
    errorReason: string,
    context?: { sessionId?: string; ipAddress?: string }
  ) {
    return createAuditLog({
      eventType: "payment_failed",
      eventCategory: "payment",
      eventAction: "update",
      eventDescription: `Payment failed: ${errorReason}`,
      userId,
      resourceType: "payment",
      resourceId: paymentId,
      eventData: {
        amount,
        errorReason,
        failedAt: new Date().toISOString(),
      },
      eventSeverity: "error",
      correlationId: paymentId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      isSensitive: true,
      tags: ["payment", "failure", "error"],
    });
  }
}

/**
 * Escrow-related audit logging
 */
export class EscrowAuditLogger {
  static async logEscrowCreated(
    escrowId: string,
    paymentId: string,
    holderId: string,
    beneficiaryId: string,
    amount: number,
    context?: { sessionId?: string }
  ) {
    return createAuditLog({
      eventType: "escrow_created",
      eventCategory: "escrow",
      eventAction: "create",
      eventDescription: `Escrow account created: ${amount} TL held`,
      userId: holderId,
      resourceType: "escrow_account",
      resourceId: escrowId,
      eventData: {
        paymentId,
        holderId,
        beneficiaryId,
        amount,
        createdAt: new Date().toISOString(),
      },
      correlationId: paymentId,
      sessionId: context?.sessionId,
      isSensitive: true,
      tags: ["escrow", "creation", "held"],
    });
  }

  static async logEscrowConfirmation(
    escrowId: string,
    userId: string,
    userRole: "holder" | "beneficiary",
    confirmationType: string,
    context?: { sessionId?: string; ipAddress?: string }
  ) {
    return createAuditLog({
      eventType: "escrow_confirmation",
      eventCategory: "escrow",
      eventAction: "confirm",
      eventDescription: `Escrow confirmation by ${userRole}: ${confirmationType}`,
      userId,
      resourceType: "escrow_account",
      resourceId: escrowId,
      eventData: {
        userRole,
        confirmationType,
        confirmedAt: new Date().toISOString(),
      },
      correlationId: escrowId,
      sessionId: context?.sessionId,
      ipAddress: context?.ipAddress,
      isSensitive: true,
      tags: ["escrow", "confirmation", userRole, confirmationType],
    });
  }

  static async logEscrowReleased(
    escrowId: string,
    beneficiaryId: string,
    payoutAmount: number,
    context?: { sessionId?: string; transactionId?: string }
  ) {
    return createAuditLog({
      eventType: "escrow_released",
      eventCategory: "escrow",
      eventAction: "confirm",
      eventDescription: `Escrow released: ${payoutAmount} TL paid to beneficiary`,
      userId: beneficiaryId,
      resourceType: "escrow_account",
      resourceId: escrowId,
      eventData: {
        beneficiaryId,
        payoutAmount,
        transactionId: context?.transactionId,
        releasedAt: new Date().toISOString(),
      },
      eventSeverity: "info",
      correlationId: escrowId,
      sessionId: context?.sessionId,
      isSensitive: true,
      tags: ["escrow", "release", "payout", "success"],
    });
  }
}

/**
 * Security-related audit logging
 */
export class SecurityAuditLogger {
  static async logLoginAttempt(
    email: string,
    success: boolean,
    context: { sessionId?: string; ipAddress?: string; userAgent?: string }
  ) {
    return createAuditLog({
      eventType: success ? "login_success" : "login_failed",
      eventCategory: "security",
      eventAction: "login",
      eventDescription: `Login ${
        success ? "successful" : "failed"
      } for ${email}`,
      eventData: {
        email,
        success,
        userAgent: context.userAgent,
        timestamp: new Date().toISOString(),
      },
      eventSeverity: success ? "info" : "warning",
      sessionId: context.sessionId,
      ipAddress: context.ipAddress,
      isSensitive: true,
      tags: ["security", "authentication", success ? "success" : "failure"],
    });
  }

  static async logUnauthorizedAccess(
    userId: string | null,
    resourceType: string,
    resourceId: string,
    context: { sessionId?: string; ipAddress?: string; userAgent?: string }
  ) {
    return createAuditLog({
      eventType: "unauthorized_access",
      eventCategory: "security",
      eventAction: "view",
      eventDescription: `Unauthorized access attempt to ${resourceType}`,
      userId: userId || undefined,
      resourceType,
      resourceId,
      eventData: {
        userAgent: context.userAgent,
        timestamp: new Date().toISOString(),
      },
      eventSeverity: "error",
      sessionId: context.sessionId,
      ipAddress: context.ipAddress,
      isSensitive: true,
      tags: ["security", "unauthorized", "access_denied"],
    });
  }

  static async logSuspiciousActivity(
    userId: string | null,
    activityType: string,
    description: string,
    context: { sessionId?: string; ipAddress?: string; metadata?: any }
  ) {
    return createAuditLog({
      eventType: "suspicious_activity",
      eventCategory: "security",
      eventAction: "view",
      eventDescription: `Suspicious activity detected: ${description}`,
      userId: userId || undefined,
      eventData: {
        activityType,
        metadata: context.metadata,
        timestamp: new Date().toISOString(),
      },
      eventSeverity: "critical",
      sessionId: context.sessionId,
      ipAddress: context.ipAddress,
      isSensitive: true,
      tags: ["security", "suspicious", activityType],
    });
  }
}

/**
 * Query audit logs with filters
 */
export const queryAuditLogs = async (
  filter: AuditQueryFilter
): Promise<AuditLogEntry[]> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filter.eventCategory) {
      query = query.eq("event_category", filter.eventCategory);
    }
    if (filter.eventType) {
      query = query.eq("event_type", filter.eventType);
    }
    if (filter.userId) {
      query = query.eq("user_id", filter.userId);
    }
    if (filter.resourceType) {
      query = query.eq("resource_type", filter.resourceType);
    }
    if (filter.resourceId) {
      query = query.eq("resource_id", filter.resourceId);
    }
    if (filter.severity) {
      query = query.eq("event_severity", filter.severity);
    }
    if (filter.correlationId) {
      query = query.eq("correlation_id", filter.correlationId);
    }
    if (filter.dateFrom) {
      query = query.gte("created_at", filter.dateFrom.toISOString());
    }
    if (filter.dateTo) {
      query = query.lte("created_at", filter.dateTo.toISOString());
    }

    // Apply pagination
    if (filter.limit) {
      query = query.limit(filter.limit);
    }
    if (filter.offset) {
      query = query.range(
        filter.offset,
        filter.offset + (filter.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error querying audit logs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in queryAuditLogs:", error);
    return [];
  }
};

/**
 * Get audit statistics
 */
export const getAuditStatistics = async (
  days: number = 30
): Promise<AuditStatistics> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const { data, error } = await supabase
      .from("audit_logs")
      .select(
        "event_category, event_severity, user_id, is_sensitive, created_at, event_type, event_description"
      )
      .gte("created_at", dateFrom.toISOString());

    if (error) {
      console.error("Error fetching audit statistics:", error);
      return {
        totalEvents: 0,
        eventsByCategory: {} as Record<AuditCategory, number>,
        eventsBySeverity: {} as Record<AuditSeverity, number>,
        uniqueUsers: 0,
        sensitiveEvents: 0,
        recentActivity: [],
      };
    }

    const stats = data.reduce(
      (acc, log) => {
        acc.totalEvents++;
        acc.eventsByCategory[log.event_category as AuditCategory] =
          (acc.eventsByCategory[log.event_category as AuditCategory] || 0) + 1;
        acc.eventsBySeverity[log.event_severity as AuditSeverity] =
          (acc.eventsBySeverity[log.event_severity as AuditSeverity] || 0) + 1;

        if (log.user_id) {
          acc.userIds.add(log.user_id);
        }
        if (log.is_sensitive) {
          acc.sensitiveEvents++;
        }

        return acc;
      },
      {
        totalEvents: 0,
        eventsByCategory: {} as Record<AuditCategory, number>,
        eventsBySeverity: {} as Record<AuditSeverity, number>,
        userIds: new Set<string>(),
        sensitiveEvents: 0,
      }
    );

    // Get recent activity (last 10 events)
    const recentActivity = data
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
      .map((log) => ({
        eventType: log.event_type,
        eventCategory: log.event_category as AuditCategory,
        eventAction: "view" as AuditAction, // Simplified for display
        eventDescription: log.event_description,
        userId: log.user_id,
      }));

    return {
      totalEvents: stats.totalEvents,
      eventsByCategory: stats.eventsByCategory,
      eventsBySeverity: stats.eventsBySeverity,
      uniqueUsers: stats.userIds.size,
      sensitiveEvents: stats.sensitiveEvents,
      recentActivity,
    };
  } catch (error) {
    console.error("Error in getAuditStatistics:", error);
    return {
      totalEvents: 0,
      eventsByCategory: {} as Record<AuditCategory, number>,
      eventsBySeverity: {} as Record<AuditSeverity, number>,
      uniqueUsers: 0,
      sensitiveEvents: 0,
      recentActivity: [],
    };
  }
};

/**
 * Format audit log for display
 */
export const formatAuditLogForDisplay = (log: any): string => {
  const timestamp = new Date(log.created_at).toLocaleString("tr-TR");
  const severity = log.event_severity?.toUpperCase() || "INFO";
  const category = log.event_category?.toUpperCase() || "UNKNOWN";

  return `[${timestamp}] ${severity} ${category}: ${log.event_description}`;
};

/**
 * Export audit logs to CSV format
 */
export const exportAuditLogsToCSV = async (
  filter: AuditQueryFilter
): Promise<string> => {
  const logs = await queryAuditLogs(filter);

  const headers = [
    "Timestamp",
    "Event Type",
    "Category",
    "Action",
    "Severity",
    "User ID",
    "Resource Type",
    "Resource ID",
    "Description",
  ];

  const csvContent = [
    headers.join(","),
    ...logs.map((log) =>
      [
        new Date(log.created_at || "").toISOString(),
        log.event_type || "",
        log.event_category || "",
        log.event_action || "",
        log.event_severity || "",
        log.user_id || "",
        log.resource_type || "",
        log.resource_id || "",
        `"${(log.event_description || "").replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
};
