const fs = require('fs');

// Read both databases
const esProperties = JSON.parse(fs.readFileSync('properties_es.json', 'utf8'));
const apiProperties = JSON.parse(fs.readFileSync('properties_api.json', 'utf8'));

// Combine databases
const combinedProperties = [...esProperties, ...apiProperties];

// Remove duplicates based on ID
const uniqueProperties = combinedProperties.filter((property, index, self) => 
  index === self.findIndex(p => p.id === property.id)
);

// Save combined database
fs.writeFileSync('properties.json', JSON.stringify(uniqueProperties));

console.log(`Merged databases:`);
console.log(`- ES properties: ${esProperties.length}`);
console.log(`- API properties: ${apiProperties.length}`);
console.log(`- Combined unique: ${uniqueProperties.length}`);

// Check for MALLORCA_CHARME
const mallorcaProperties = uniqueProperties.filter(p => p.provider === 'MALLORCA_CHARME');
console.log(`- MALLORCA_CHARME properties: ${mallorcaProperties.length}`);


