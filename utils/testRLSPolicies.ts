// Test RLS Policies for Matching System
// This script tests if users can access all devices for matching

import { supabase } from "./supabaseClient.ts";

export async function testRLSPolicies() {
  console.log("🔍 Testing RLS Policies for Matching System...");
  
  try {
    // Test 1: Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("❌ User not authenticated:", authError);
      return;
    }
    
    console.log("✅ User authenticated:", user.id);
    
    // Test 2: Try to fetch all lost devices
    console.log("🔍 Testing: Fetch all LOST devices...");
    const { data: lostDevices, error: lostError } = await supabase
      .from("devices")
      .select("*")
      .eq("status", "lost");
    
    if (lostError) {
      console.error("❌ Error fetching lost devices:", lostError);
    } else {
      console.log("✅ Lost devices fetched:", lostDevices?.length || 0);
      console.log("📋 Lost devices:", lostDevices);
    }
    
    // Test 3: Try to fetch all reported devices
    console.log("🔍 Testing: Fetch all REPORTED devices...");
    const { data: reportedDevices, error: reportedError } = await supabase
      .from("devices")
      .select("*")
      .eq("status", "reported");
    
    if (reportedError) {
      console.error("❌ Error fetching reported devices:", reportedError);
    } else {
      console.log("✅ Reported devices fetched:", reportedDevices?.length || 0);
      console.log("📋 Reported devices:", reportedDevices);
    }
    
    // Test 4: Try to fetch all devices (should work if RLS allows)
    console.log("🔍 Testing: Fetch ALL devices...");
    const { data: allDevices, error: allError } = await supabase
      .from("devices")
      .select("*");
    
    if (allError) {
      console.error("❌ Error fetching all devices:", allError);
    } else {
      console.log("✅ All devices fetched:", allDevices?.length || 0);
    }
    
    // Test 5: Check current RLS policies
    console.log("🔍 Testing: Check current RLS policies...");
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: 'devices' });
    
    if (policiesError) {
      console.log("ℹ️ Could not fetch policies (function might not exist):", policiesError);
    } else {
      console.log("📋 Current policies:", policies);
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Make it available in browser console
(window as any).testRLSPolicies = testRLSPolicies;
