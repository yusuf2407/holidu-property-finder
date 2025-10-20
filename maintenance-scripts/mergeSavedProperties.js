// Merge saved properties export with properties.json
// Usage: node mergeSavedProperties.js

const fs = require('fs');
const path = require('path');

// Read existing properties.json
const propertiesPath = path.join(__dirname, 'properties.json');
const existingProperties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));
console.log(`📂 Loaded ${existingProperties.length} existing properties from properties.json`);

// Read saved properties export
const savedPropertiesPath = path.join(__dirname, 'saved_properties_export.json');

if (!fs.existsSync(savedPropertiesPath)) {
  console.error('❌ saved_properties_export.json not found!');
  console.log('Please run exportSavedProperties.js in the browser console first.');
  process.exit(1);
}

const savedProperties = JSON.parse(fs.readFileSync(savedPropertiesPath, 'utf8'));
console.log(`📥 Loaded ${savedProperties.length} saved properties from export`);

// Merge, avoiding duplicates
let addedCount = 0;
savedProperties.forEach(savedProp => {
  const exists = existingProperties.find(p => p.id === savedProp.id);
  if (!exists) {
    existingProperties.push(savedProp);
    addedCount++;
    console.log(`✅ Added property ${savedProp.id} (${savedProp.provider || 'unknown provider'})`);
  } else {
    console.log(`⏭️  Skipped property ${savedProp.id} (already exists)`);
  }
});

// Write back to properties.json
fs.writeFileSync(propertiesPath, JSON.stringify(existingProperties, null, 2));
console.log('');
console.log('========================================');
console.log(`✅ Merge complete!`);
console.log(`   Added: ${addedCount} new properties`);
console.log(`   Total: ${existingProperties.length} properties in database`);
console.log('========================================');

