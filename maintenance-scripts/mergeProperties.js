const fs = require('fs');

// Read both files
const currentProperties = JSON.parse(fs.readFileSync('./properties.json', 'utf8'));
const oldProperties = JSON.parse(fs.readFileSync('./propertiesOLD.json', 'utf8'));

console.log(`Current properties: ${currentProperties.length}`);
console.log(`Old properties: ${oldProperties.length}`);

// Create a Map for deduplication by ID
const propertyMap = new Map();

// Add current properties first (they take priority)
currentProperties.forEach(prop => {
  propertyMap.set(prop.id, prop);
});

// Add old properties (won't overwrite existing ones)
oldProperties.forEach(prop => {
  if (!propertyMap.has(prop.id)) {
    propertyMap.set(prop.id, prop);
  }
});

// Convert back to array
const mergedProperties = Array.from(propertyMap.values());

console.log(`Merged properties: ${mergedProperties.length}`);
console.log(`Added ${mergedProperties.length - currentProperties.length} new properties`);

// Write the merged result
fs.writeFileSync('./properties.json', JSON.stringify(mergedProperties, null, 2));

console.log('✅ Merge complete! properties.json updated.');


