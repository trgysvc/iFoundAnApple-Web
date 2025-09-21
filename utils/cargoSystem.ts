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

    return true;
  } catch (error) {
    console.error("Error in updateShipmentStatus:", error);
    return false;
  }
};

/**
 * Confirm delivery by receiver
 */
export const confirmDelivery = async (
  shipmentId: string,
  userId: string,
  signature?: string,
  photos?: string[]
): Promise<boolean> => {
  try {
    const config = getSecureConfig();
    const supabase = (await import("@supabase/supabase-js")).createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const { error } = await supabase
      .from("cargo_shipments")
      .update({
        delivery_confirmed_by_receiver: true,
        delivery_confirmation_date: new Date().toISOString(),
        delivery_signature: signature,
        delivery_photos: photos,
        status: "delivered",
      })
      .eq("id", shipmentId)
      .eq("receiver_user_id", userId); // Ensure only receiver can confirm

    if (error) {
      console.error("Error confirming delivery:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in confirmDelivery:", error);
    return false;
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
