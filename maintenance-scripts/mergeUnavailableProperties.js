// Merge unavailable properties export with unavailable_properties.json
// Usage: node mergeUnavailableProperties.js

const fs = require('fs');
const path = require('path');

// Read existing unavailable_properties.json
const unavailablePath = path.join(__dirname, 'unavailable_properties.json');
const existingUnavailable = JSON.parse(fs.readFileSync(unavailablePath, 'utf8'));
console.log(`📂 Loaded ${existingUnavailable.length} existing quarantined properties from unavailable_properties.json`);

// Read unavailable properties export
const exportPath = path.join(__dirname, 'unavailable_properties_export.json');

if (!fs.existsSync(exportPath)) {
  console.error('❌ unavailable_properties_export.json not found!');
  console.log('Please run exportUnavailableProperties.js in the browser console first.');
  process.exit(1);
}

const exportedUnavailable = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
console.log(`📥 Loaded ${exportedUnavailable.length} quarantined properties from export`);

// Merge, avoiding duplicates
let addedCount = 0;
exportedUnavailable.forEach(unavailProp => {
  const exists = existingUnavailable.find(p => p.id === unavailProp.id);
  if (!exists) {
    existingUnavailable.push(unavailProp);
    addedCount++;
    console.log(`🚫 Added quarantined property ${unavailProp.id} (${unavailProp.provider || 'unknown'}) - Reason: ${unavailProp.reason}`);
  } else {
    console.log(`⏭️  Skipped property ${unavailProp.id} (already quarantined)`);
  }
});

// Write back to unavailable_properties.json
fs.writeFileSync(unavailablePath, JSON.stringify(existingUnavailable, null, 2));

// Statistics
const byReason = {};
existingUnavailable.forEach(p => {
  byReason[p.reason] = (byReason[p.reason] || 0) + 1;
});

const byProvider = {};
existingUnavailable.forEach(p => {
  const provider = p.provider || 'unknown';
  byProvider[provider] = (byProvider[provider] || 0) + 1;
});

console.log('');
console.log('========================================');
console.log(`✅ Merge complete!`);
console.log(`   Added: ${addedCount} new quarantined properties`);
console.log(`   Total: ${existingUnavailable.length} quarantined properties`);
console.log('========================================');
console.log('\n📊 Quarantine Statistics by Reason:');
console.table(byReason);
console.log('\n📊 Quarantine Statistics by Provider:');
console.table(byProvider);

