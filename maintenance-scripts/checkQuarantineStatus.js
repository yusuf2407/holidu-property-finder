// Check Quarantine Status
// Run this in browser console on the extension popup page

console.log('🔍 Checking quarantine status...\n');

chrome.storage.local.get(['unavailableProperties'], (result) => {
  const unavailable = result.unavailableProperties || [];
  
  console.log(`📊 Total quarantined properties: ${unavailable.length}\n`);
  
  if (unavailable.length === 0) {
    console.log('✅ No properties in quarantine');
    return;
  }
  
  // Group by reason
  const byReason = {};
  unavailable.forEach(p => {
    const reason = p.reason || 'unknown';
    byReason[reason] = (byReason[reason] || 0) + 1;
  });
  
  console.log('📋 By Reason:');
  console.table(byReason);
  
  // Group by provider
  const byProvider = {};
  unavailable.forEach(p => {
    const provider = p.provider || 'unknown';
    byProvider[provider] = (byProvider[provider] || 0) + 1;
  });
  
  console.log('\n📋 By Provider:');
  console.table(byProvider);
  
  // Show recent 10
  console.log('\n📋 Recent 10 quarantined properties:');
  const recent = unavailable.slice(-10).reverse();
  console.table(recent.map(p => ({
    id: p.id,
    provider: p.provider || 'unknown',
    reason: p.reason,
    quarantinedAt: p.quarantinedAt ? new Date(p.quarantinedAt).toLocaleString() : 'unknown'
  })));
  
  // Export option
  console.log('\n💾 To export all quarantined properties:');
  console.log('→ Run: maintenance-scripts/exportUnavailableProperties.js');
});





