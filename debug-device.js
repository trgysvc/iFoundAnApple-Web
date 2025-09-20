// Debug script to test device addition
// Run this in browser console

const testDeviceAddition = async () => {
  console.log("🔍 Testing device addition...");
  
  // Get current user from localStorage or session
  const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
  console.log("Current user:", currentUser);
  
  if (!currentUser.id) {
    console.error("❌ No current user found!");
    return;
  }
  
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
    serialnumber: deviceData.serialNumber,
    color: deviceData.color, 
    description: deviceData.description,
    rewardamount: deviceData.rewardAmount,
    marketvalue: deviceData.marketValue,
    invoice_url: deviceData.invoice_url,
    userid: currentUser.id,
    status: 'lost',
    exchangeconfirmedby: []
  };
  
  console.log("📤 Payload to send:", payload);
  
  try {
    // Get Supabase client from window (if available)
    if (window.supabase) {
      const { data, error } = await window.supabase
        .from('devices')
        .insert([payload])
        .select();
        
      if (error) {
        console.error("❌ Supabase error:", error);
      } else {
        console.log("✅ Success! Device added:", data);
      }
    } else {
      console.error("❌ Supabase client not found on window object");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
};

// Run the test
testDeviceAddition();
