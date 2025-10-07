// Debug script to test device addition
// Run this in browser console

const testDeviceAddition = async () => {
  console.log("🔍 Testing device addition...");
  
  try {
    // Get Supabase client from window (if available)
    if (!window.supabase) {
      console.error("❌ Supabase client not found on window object");
      return;
    }

    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await window.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("❌ No authenticated user found:", authError);
      return;
    }
    
    console.log("Current user:", user);
    
    // Test device data
    const deviceData = {
      model: "iPhone 17 Pro",
      serialNumber: "NEW112233", 
      color: "Deep Purple",
      description: "Test device for debugging",
      rewardAmount: 1000,
      marketValue: 5000,
      invoice_url: null
    };
    
    console.log("📱 Device data:", deviceData);
    
    // Map to database format
    const payload = {
      model: deviceData.model,
      serialNumber: deviceData.serialNumber,
      color: deviceData.color, 
      description: deviceData.description,
      rewardAmount: deviceData.rewardAmount,
      marketValue: deviceData.marketValue,
      invoice_url: deviceData.invoice_url,
      userId: user.id,
      status: 'lost',
      exchangeConfirmedBy: []
    };
    
    console.log("📤 Payload to send:", payload);
    
    const { data, error } = await window.supabase
      .from('devices')
      .insert([payload])
      .select();
      
    if (error) {
      console.error("❌ Supabase error:", error);
    } else {
      console.log("✅ Success! Device added:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
};

// Run the test
testDeviceAddition();
