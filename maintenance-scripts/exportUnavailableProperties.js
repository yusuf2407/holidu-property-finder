// Utility script to export unavailable (quarantined) properties from chrome.storage
// Run this in the browser console on the extension popup page

chrome.storage.local.get(['unavailableProperties'], function(result) {
  if (result.unavailableProperties && result.unavailableProperties.length > 0) {
    console.log(`Found ${result.unavailableProperties.length} quarantined properties in chrome.storage`);
    console.log('Copy the JSON below and merge it with your unavailable_properties.json file:');
    console.log('========================================');
    console.log(JSON.stringify(result.unavailableProperties, null, 2));
    console.log('========================================');
    
    // Also download as file
    const blob = new Blob([JSON.stringify(result.unavailableProperties, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unavailable_properties_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ File downloaded as unavailable_properties_export.json');
    
    // Show statistics
    const byReason = {};
    result.unavailableProperties.forEach(p => {
      byReason[p.reason] = (byReason[p.reason] || 0) + 1;
    });
    console.log('\n📊 Quarantine Statistics:');
    console.table(byReason);
    
    const byProvider = {};
    result.unavailableProperties.forEach(p => {
      const provider = p.provider || 'unknown';
      byProvider[provider] = (byProvider[provider] || 0) + 1;
    });
    console.log('\n📊 By Provider:');
    console.table(byProvider);
  } else {
    console.log('No quarantined properties found in chrome.storage');
  }
});

// Optional: Clear unavailable properties after export
// Uncomment the line below if you want to clear after export
// chrome.storage.local.remove(['unavailableProperties'], () => console.log('Quarantined properties cleared'));

