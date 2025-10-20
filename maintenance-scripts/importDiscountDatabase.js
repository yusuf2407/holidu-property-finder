const fs = require('fs');

// Read the SQL export
const sqlData = JSON.parse(fs.readFileSync('./holidu_homes holidu_homes_apartment_history 2025-10-10T1113.json', 'utf8'));

// Read existing properties
const properties = JSON.parse(fs.readFileSync('./properties.json', 'utf8'));

// Create a map for quick lookup
const propertiesMap = new Map();
properties.forEach(prop => {
  propertiesMap.set(prop.id.toString(), prop);
});

console.log(`📊 Processing ${sqlData.length} properties from SQL export...`);
console.log('');

let updated = 0;
let skipped = 0;
let discountCounts = {
  longStay: 0,
  earlyBird: 0,
  lastMinute: 0,
  loyalty: 0,
  mobile: 0,
  newListing: 0,
  weekly: 0,
  nonRefundable: 0
};

sqlData.forEach(record => {
  const propertyId = record['holidu_homes_apartment_history.apartment_id'];
  const existingProperty = propertiesMap.get(propertyId);

  if (!existingProperty) {
    skipped++;
    return; // Skip properties not in our database
  }

  // Update discount flags
  const hasLongStay = record['discounts_los.has_los_discount'] === 'Yes';
  const hasEarlyBird = record['discounts_early_bird.has_early_bird_discount'] === 'Yes';
  const hasLastMinute = record['discounts_last_minute.has_last_minute_discount'] === 'Yes';
  const hasLoyalty = record['discounts_loyalty_discount.has_loyalty_discount'] === 'Yes';
  const hasMobile = record['discounts_mobile_discount.has_mobile_discount'] === 'Yes';
  const hasNewListing = record['discounts_new_listing_promotion.has_new_listing_discount_active_or_applied'] === 'Yes';
  const hasWeekly = record['discounts_weekly.has_weekly_discount'] === 'Yes';
  const hasNonRefundable = record['discounts_nrr.discount_percent_nrr'] && parseFloat(record['discounts_nrr.discount_percent_nrr']) > 0;
  const cancellationPolicy = record['apartments_aggregated_feilds.cancellation_policy_holidu_name'];

  // Set hasAnyDiscount if any discount is present
  const hasAnyDiscount = hasLongStay || hasEarlyBird || hasLastMinute || hasLoyalty || 
                         hasMobile || hasNewListing || hasWeekly || hasNonRefundable;

  // Update existing property
  if (hasAnyDiscount) {
    existingProperty.hasAnyDiscount = true;
  }
  if (hasLongStay) {
    existingProperty.hasLongStayDiscount = true;
    discountCounts.longStay++;
  }
  if (hasEarlyBird) {
    existingProperty.hasEarlyBirdDiscount = true;
    discountCounts.earlyBird++;
  }
  if (hasLastMinute) {
    existingProperty.hasLastMinuteDiscount = true;
    discountCounts.lastMinute++;
  }
  if (hasLoyalty) {
    existingProperty.hasLoyaltyDiscount = true;
    discountCounts.loyalty++;
  }
  if (hasMobile) {
    existingProperty.hasMobileDiscount = true;
    discountCounts.mobile++;
  }
  if (hasNewListing) {
    existingProperty.hasNewListingDiscount = true;
    discountCounts.newListing++;
  }
  if (hasWeekly) {
    existingProperty.hasWeeklyDiscount = true;
    discountCounts.weekly++;
  }
  if (hasNonRefundable) {
    existingProperty.hasNonRefundableDiscount = true;
    discountCounts.nonRefundable++;
  }
  if (cancellationPolicy && cancellationPolicy !== 'CHANNEL_NOT_ACTIVE') {
    existingProperty.cancellationPolicy = cancellationPolicy;
  }

  updated++;
});

// Write back to properties.json
fs.writeFileSync('./properties.json', JSON.stringify(properties, null, 2));

console.log('✅ Import Complete!');
console.log('');
console.log('📈 Statistics:');
console.log(`  Total SQL Records: ${sqlData.length}`);
console.log(`  Properties Updated: ${updated}`);
console.log(`  Properties Skipped (not in DB): ${skipped}`);
console.log('');
console.log('💰 Discount Type Counts (in database):');
console.log(`  Long Stay: ${discountCounts.longStay}`);
console.log(`  Early Bird: ${discountCounts.earlyBird}`);
console.log(`  Last Minute: ${discountCounts.lastMinute}`);
console.log(`  Loyalty: ${discountCounts.loyalty}`);
console.log(`  Mobile: ${discountCounts.mobile}`);
console.log(`  New Listing: ${discountCounts.newListing}`);
console.log(`  Weekly: ${discountCounts.weekly}`);
console.log(`  Non-Refundable: ${discountCounts.nonRefundable}`);
console.log('');
console.log('🎯 Properties with ANY discount:', properties.filter(p => p.hasAnyDiscount).length);

