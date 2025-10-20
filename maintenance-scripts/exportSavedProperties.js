// Utility script to export saved properties from chrome.storage to properties.json
// Run this in the browser console on the extension popup page

chrome.storage.local.get(['savedProperties'], function(result) {
  if (result.savedProperties && result.savedProperties.length > 0) {
    console.log(`Found ${result.savedProperties.length} saved properties in chrome.storage`);
    console.log('Copy the JSON below and merge it with your properties.json file:');
    console.log('========================================');
    console.log(JSON.stringify(result.savedProperties, null, 2));
    console.log('========================================');
    
    // Also download as file
    const blob = new Blob([JSON.stringify(result.savedProperties, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved_properties_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ File downloaded as saved_properties_export.json');
  } else {
    console.log('No saved properties found in chrome.storage');
  }
});

// Optional: Clear saved properties after export
// Uncomment the line below if you want to clear after export
// chrome.storage.local.remove(['savedProperties'], () => console.log('Saved properties cleared'));

