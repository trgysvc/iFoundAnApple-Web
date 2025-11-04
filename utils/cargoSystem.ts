/**
 * Cargo System Utilities
 * Handles anonymous cargo shipment management and tracking
 */

import { getSecureConfig } from "./config.ts";

// Cargo system interfaces
export interface CargoCompany {
  id: string;
  code: string;
  name: string;
  api_endpoint?: string;
  tracking_url_template: string;
  standard_delivery_days: number;
  express_delivery_days: number;
  base_fee: number;
  express_fee_multiplier: number;
  is_active: boolean;
}

export interface CargoShipment {
  id: string;
  device_id: string;
  payment_id?: string;
  cargo_company: string;
  tracking_number?: string;
  cargo_service_type: "standard" | "express" | "same_day";
  estimated_delivery_days: number;
  sender_anonymous_id: string;
  receiver_anonymous_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  status: CargoStatus;
  created_at: string;
  updated_at: string;
  picked_up_at?: string;
  delivered_at?: string;
  package_weight?: number;
  package_dimensions?: string;
  declared_value: number;
  cargo_fee: number;
  delivery_confirmed_by_receiver: boolean;
  delivery_confirmation_date?: string;
  delivery_signature?: string;
  delivery_photos?: string[];
  special_instructions?: string;
  notes?: string;
  failure_reason?: string;
}

export type CargoStatus =
  | "created"
  | "label_printed"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed_delivery"
  | "returned"
  | "cancelled";

export interface ShipmentCreateRequest {
  deviceId: string;
  paymentId?: string;
  cargoCompany: string;
  senderUserId: string;
  receiverUserId: string;
  senderAddress: string;
  receiverAddress: string;
  serviceType?: "standard" | "express";
  declaredValue?: number;
  specialInstructions?: string;
}

export interface ShipmentTrackingInfo {
  shipmentId: string;
  trackingNumber?: string;
  status: CargoStatus;
  statusDescription: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  trackingEvents: TrackingEvent[];
  userAnonymousId: string;
  userRole: "sender" | "receiver";
}

export interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location?: string;
}

/**
 * Get available cargo companies
 */
export const getAvailableCargoCompanies = async (): Promise<CargoCompany[]> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const { data, error } = await supabase
      .from("cargo_companies")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching cargo companies:", error);
      return [];
    }

    return data as CargoCompany[];
  } catch (error) {
    console.error("Error in getAvailableCargoCompanies:", error);
    return [];
  }
};

/**
 * Calculate cargo fee based on company and service type
 */
export const calculateCargoFee = async (
  cargoCompanyCode: string,
  serviceType: "standard" | "express" = "standard"
): Promise<number> => {
  try {
    const companies = await getAvailableCargoCompanies();
    const company = companies.find((c) => c.code === cargoCompanyCode);

    if (!company) {
      return 25.0; // Default fee
    }

    const baseFee = company.base_fee;
    return serviceType === "express"
      ? baseFee * company.express_fee_multiplier
      : baseFee;
  } catch (error) {
    console.error("Error calculating cargo fee:", error);
    return 25.0; // Default fee
  }
};

/**
 * Create a new cargo shipment
 */
export const createCargoShipment = async (
  request: ShipmentCreateRequest
): Promise<{ success: boolean; shipmentId?: string; error?: string }> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    // Generate anonymous IDs
    const senderAnonymousId = generateAnonymousId("FND");
    const receiverAnonymousId = generateAnonymousId("OWN");

    // Calculate cargo fee
    const cargoFee = await calculateCargoFee(
      request.cargoCompany,
      request.serviceType
    );

    // Get delivery estimation
    const companies = await getAvailableCargoCompanies();
    const company = companies.find((c) => c.code === request.cargoCompany);
    const estimatedDays =
      request.serviceType === "express"
        ? company?.express_delivery_days || 1
        : company?.standard_delivery_days || 2;

    // Create shipment record
    const { data, error } = await supabase
      .from("cargo_shipments")
      .insert({
        device_id: request.deviceId,
        payment_id: request.paymentId,
        cargo_company: request.cargoCompany,
        cargo_service_type: request.serviceType || "standard",
        estimated_delivery_days: estimatedDays,
        sender_anonymous_id: senderAnonymousId,
        receiver_anonymous_id: receiverAnonymousId,
        sender_user_id: request.senderUserId,
        receiver_user_id: request.receiverUserId,
        sender_address_encrypted: request.senderAddress, // TODO: Implement encryption
        receiver_address_encrypted: request.receiverAddress, // TODO: Implement encryption
        status: "created",
        declared_value: request.declaredValue || 1000.0,
        cargo_fee: cargoFee,
        special_instructions: request.specialInstructions,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating cargo shipment:", error);
      return { success: false, error: "Failed to create shipment" };
    }

    console.log("Cargo shipment created:", data);

    // Audit log: Cargo shipment created
    try {
      const { error: auditError } = await supabase
        .from("audit_logs")
        .insert({
          event_type: 'cargo_shipment_created',
          event_category: 'cargo',
          event_action: 'create',
          event_severity: 'info',
          user_id: request.senderUserId,
          resource_type: 'cargo_shipment',
          resource_id: data.id,
          event_description: 'Device shipped by finder',
          event_data: {
            tracking_number: data.tracking_number || null,
            cargo_company: request.cargoCompany,
            device_id: request.deviceId,
            shipment_id: data.id,
          },
        });
      if (auditError) {
        console.error("Error creating cargo shipment audit log:", auditError);
      } else {
        console.log("Audit log created for cargo shipment");
      }
    } catch (auditError) {
      console.error("Error in cargo shipment audit log:", auditError);
      // Don't fail the whole operation if audit log fails
    }

    // TODO: Integrate with actual cargo company API to create label
    // This would involve calling the cargo company's API to:
    // 1. Create shipping label
    // 2. Get tracking number
    // 3. Schedule pickup

    return { success: true, shipmentId: data.id };
  } catch (error) {
    console.error("Error in createCargoShipment:", error);
    return { success: false, error: "Shipment creation failed" };
  }
};

/**
 * Get shipment tracking information
 */
export const getShipmentTracking = async (
  shipmentId: string,
  userId: string
): Promise<ShipmentTrackingInfo | null> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const { data, error } = await supabase
      .from("shipment_tracking")
      .select("*")
      .eq("id", shipmentId)
      .single();

    if (error || !data) {
      console.error("Error fetching shipment tracking:", error);
      return null;
    }

    // Get additional tracking events from cargo company API
    const trackingEvents = await getCargoTrackingEvents(
      data.cargo_company,
      data.tracking_number
    );

    return {
      shipmentId: data.id,
      trackingNumber: data.tracking_number,
      status: data.status,
      statusDescription: getStatusDescription(data.status),
      estimatedDelivery: calculateEstimatedDelivery(
        data.created_at,
        data.estimated_delivery_days
      ),
      trackingEvents,
      userAnonymousId: data.user_anonymous_id,
      userRole: data.user_role,
    };
  } catch (error) {
    console.error("Error in getShipmentTracking:", error);
    return null;
  }
};

/**
 * Update shipment status
 */
export const updateShipmentStatus = async (
  shipmentId: string,
  status: CargoStatus,
  notes?: string
): Promise<boolean> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add timestamp for specific status changes
    if (status === "picked_up") {
      updateData.picked_up_at = new Date().toISOString();
    } else if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const { error } = await supabase
      .from("cargo_shipments")
      .update(updateData)
      .eq("id", shipmentId);

    if (error) {
      console.error("Error updating shipment status:", error);
      return false;
    }

    // Audit log for status changes
    if (status === "delivered") {
      try {
        // Get shipment data to find user_id
        const { data: shipmentData } = await supabase
          .from("cargo_shipments")
          .select("receiver_user_id, device_id, tracking_number, cargo_company")
          .eq("id", shipmentId)
          .single();

        if (shipmentData) {
          await supabase.from("audit_logs").insert({
            event_type: 'cargo_delivered',
            event_category: 'cargo',
            event_action: 'deliver',
            event_severity: 'info',
            user_id: null, // System event from cargo API
            resource_type: 'cargo_shipment',
            resource_id: shipmentId,
            event_description: 'Package delivered by cargo company',
            event_data: {
              tracking_number: shipmentData.tracking_number,
              delivered_at: new Date().toISOString(),
              device_id: shipmentData.device_id,
              cargo_company: shipmentData.cargo_company,
            },
          });
          console.log("Audit log created for cargo delivery");
        }
      } catch (auditError) {
        console.error("Error creating cargo delivered audit log:", auditError);
        // Don't fail the whole operation if audit log fails
      }
    }

    return true;
  } catch (error) {
    console.error("Error in updateShipmentStatus:", error);
    return false;
  }
};

/**
 * Confirm delivery by receiver
 * This function implements the complete delivery confirmation process as described in PROCESS_FLOW.md Step 9
 */
export const confirmDelivery = async (
  shipmentId: string,
  userId: string,
  signature?: string,
  photos?: string[]
): Promise<{ success: boolean; error?: string; deliveryConfirmationId?: string }> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    // 1. Get shipment data to retrieve device_id and payment_id
    const { data: shipmentData, error: shipmentFetchError } = await supabase
      .from("cargo_shipments")
      .select("device_id, payment_id, receiver_user_id")
      .eq("id", shipmentId)
      .eq("receiver_user_id", userId) // Ensure only receiver can confirm
      .single();

    if (shipmentFetchError || !shipmentData) {
      console.error("Error fetching shipment data:", shipmentFetchError);
      return { success: false, error: "Shipment not found or unauthorized" };
    }

    const { device_id, payment_id } = shipmentData;

    // 2. Create delivery_confirmations record
    const { data: confirmationData, error: confirmationError } = await supabase
      .from("delivery_confirmations")
      .insert({
        device_id: device_id,
        payment_id: payment_id,
        cargo_shipment_id: shipmentId,
        confirmed_by: userId,
        confirmation_type: "device_received",
        confirmation_data: {
          serial_number_verified: true,
          condition: "good",
          signature: signature || null,
          photos: photos || [],
        },
        confirmed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (confirmationError || !confirmationData) {
      console.error("Error creating delivery confirmation:", confirmationError);
      return { success: false, error: "Failed to create delivery confirmation" };
    }

    const deliveryConfirmationId = confirmationData.id;

    // 3. Update cargo_shipments table
    const { error: cargoUpdateError } = await supabase
      .from("cargo_shipments")
      .update({
        delivery_confirmed_by_receiver: true,
        delivery_confirmation_date: new Date().toISOString(),
        delivery_confirmation_id: deliveryConfirmationId,
        delivery_signature: signature,
        delivery_photos: photos,
        cargo_status: "confirmed", // Kargo durumu: onaylandı
        status: "delivered", // Teslim kodu durumu: teslim edildi
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipmentId)
      .eq("receiver_user_id", userId);

    if (cargoUpdateError) {
      console.error("Error updating cargo_shipments:", cargoUpdateError);
      return { success: false, error: "Failed to update cargo shipment" };
    }

    // 4. Update devices.status to 'completed'
    const { error: deviceUpdateError } = await supabase
      .from("devices")
      .update({
        status: "completed",
        delivery_confirmed_at: new Date().toISOString(),
        final_payment_distributed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", device_id);

    if (deviceUpdateError) {
      console.error("Error updating device status:", deviceUpdateError);
      // Continue even if device update fails, as escrow release is more critical
    }

    // 5. Release escrow via releaseEscrowAPI
    try {
      const { releaseEscrowAPI } = await import("../api/release-escrow.ts");
      const releaseResult = await releaseEscrowAPI({
        deviceId: device_id,
        paymentId: payment_id,
        releaseReason: "Device received and confirmed by owner",
        confirmationType: "device_received",
        confirmedBy: userId,
        additionalNotes: "Delivery confirmed via cargo system",
      });

      if (!releaseResult.success) {
        console.error("Error releasing escrow:", releaseResult.errorMessage);
        // Don't fail the whole operation, but log the error
        // The escrow can be released manually later if needed
      }
    } catch (escrowError) {
      console.error("Error calling releaseEscrowAPI:", escrowError);
      // Continue even if escrow release fails, as the confirmation record is already created
    }

    // 6. Create audit log
    try {
      await supabase.from("audit_logs").insert({
        event_type: "escrow_released",
        event_category: "financial",
        event_action: "release",
        event_severity: "info",
        user_id: userId,
        resource_type: "escrow",
        resource_id: shipmentId,
        event_description: "Escrow released after device confirmation",
        event_data: {
          payment_id: payment_id,
          device_id: device_id,
          delivery_confirmation_id: deliveryConfirmationId,
          confirmed_at: new Date().toISOString(),
        },
      });
    } catch (auditError) {
      console.error("Error creating audit log:", auditError);
      // Don't fail the whole operation if audit log fails
    }

    // 7. Create notifications
    try {
      // Get shipment data to find sender_user_id (finder)
      const { data: shipmentForFinder } = await supabase
        .from("cargo_shipments")
        .select("sender_user_id")
        .eq("id", shipmentId)
        .single();

      if (shipmentForFinder && shipmentForFinder.sender_user_id) {
        // Notification to finder (reward released)
        await supabase.from("notifications").insert({
          user_id: shipmentForFinder.sender_user_id,
          message_key: "reward_released",
          link: `/device/${device_id}`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }

      // Notification to owner (transaction completed)
      await supabase.from("notifications").insert({
        user_id: userId,
        message_key: "transactionCompletedOwner",
        link: `/device/${device_id}`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notificationError) {
      console.error("Error creating notifications:", notificationError);
      // Don't fail the whole operation if notifications fail
    }

    console.log("Delivery confirmation completed successfully:", {
      shipmentId,
      deliveryConfirmationId,
      deviceId: device_id,
      paymentId: payment_id,
    });

    return {
      success: true,
      deliveryConfirmationId: deliveryConfirmationId,
    };
  } catch (error) {
    console.error("Error in confirmDelivery:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Generate anonymous ID for cargo system
 */
const generateAnonymousId = (prefix: string): string => {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomSuffix}`;
};

/**
 * Get cargo tracking events from external API
 */
const getCargoTrackingEvents = async (
  cargoCompany: string,
  trackingNumber?: string
): Promise<TrackingEvent[]> => {
  // TODO: Integrate with actual cargo company APIs
  // This is a placeholder that returns mock tracking events

  if (!trackingNumber) {
    return [];
  }

  // Mock tracking events
  const mockEvents: TrackingEvent[] = [
    {
      date: new Date().toISOString(),
      status: "created",
      description: "Kargo kaydı oluşturuldu",
      location: "İstanbul",
    },
  ];

  return mockEvents;
};

/**
 * Get human-readable status description
 */
const getStatusDescription = (status: CargoStatus): string => {
  const statusMap: Record<CargoStatus, string> = {
    created: "Kargo kaydı oluşturuldu",
    label_printed: "Kargo etiketi hazırlandı",
    picked_up: "Kargo alındı",
    in_transit: "Kargo yolda",
    out_for_delivery: "Teslimat için çıktı",
    delivered: "Teslim edildi",
    failed_delivery: "Teslimat başarısız",
    returned: "İade edildi",
    cancelled: "İptal edildi",
  };

  return statusMap[status] || status;
};

/**
 * Calculate estimated delivery date
 */
const calculateEstimatedDelivery = (
  createdAt: string,
  estimatedDays: number
): string => {
  const createdDate = new Date(createdAt);
  const estimatedDate = new Date(
    createdDate.getTime() + estimatedDays * 24 * 60 * 60 * 1000
  );

  return estimatedDate.toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Get cargo tracking URL for external tracking
 */
export const getCargoTrackingUrl = async (
  cargoCompany: string,
  trackingNumber: string
): Promise<string | null> => {
  try {
    const companies = await getAvailableCargoCompanies();
    const company = companies.find((c) => c.code === cargoCompany);

    if (!company || !company.tracking_url_template) {
      return null;
    }

    return company.tracking_url_template.replace(
      "{tracking_number}",
      trackingNumber
    );
  } catch (error) {
    console.error("Error getting cargo tracking URL:", error);
    return null;
  }
};

/**
 * Format cargo fee for display
 */
export const formatCargoFee = (fee: number): string => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fee);
};

/**
 * Get delivery time estimation text
 */
export const getDeliveryTimeText = (
  cargoCompany: string,
  serviceType: "standard" | "express" = "standard"
): string => {
  // This would typically fetch from the cargo companies table
  // For now, return default estimates
  const estimates = {
    standard: "2-3 iş günü",
    express: "1 iş günü",
  };

  return estimates[serviceType];
};
