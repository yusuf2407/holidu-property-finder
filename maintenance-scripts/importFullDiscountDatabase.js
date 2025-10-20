const fs = require('fs');

// Read the new SQL export with multi-unit data
const sqlData = JSON.parse(fs.readFileSync('./holidu_homes holidu_homes_apartment_history 2025-10-10T1136.json', 'utf8'));

// Read existing properties
const properties = JSON.parse(fs.readFileSync('./properties.json', 'utf8'));

// Create a map for quick lookup
const propertiesMap = new Map();
properties.forEach(prop => {
  propertiesMap.set(prop.id.toString(), prop);
});

console.log(`📊 Processing ${sqlData.length} properties from SQL export...`);
console.log('');

let added = 0;
let updated = 0;
let skipped = 0;

sqlData.forEach(record => {
  const propertyId = parseInt(record['holidu_homes_apartment_history.apartment_id']);
  const existingProperty = propertiesMap.get(propertyId.toString());

  // Parse discount flags
  const hasEarlyBird = record['discounts_early_bird.has_early_bird_discount'] === 'Yes';
  const hasLastMinute = record['discounts_last_minute.has_last_minute_discount'] === 'Yes';
  const hasLoyalty = record['discounts_loyalty_discount.has_loyalty_discount'] === 'Yes';
  const hasMobile = record['discounts_mobile_discount.has_mobile_discount'] === 'Yes';
  const hasNewListing = record['discounts_new_listing_promotion.has_new_listing_discount_active_or_applied'] === 'Yes';
  const hasWeekly = record['discounts_weekly.has_weekly_discount'] === 'Yes';
  const hasNonRefundable = record['discounts_nrr.discount_percent_nrr'] && parseFloat(record['discounts_nrr.discount_percent_nrr']) > 0;
  const nonRefundablePercentage = parseFloat(record['discounts_nrr.discount_percent_nrr']) || 0;
  const cancellationPolicy = record['apartments_aggregated_feilds.cancellation_policy_holidu_name'];
  const isMultiUnit = record['holidu_homes_multi_unit_apartments.is_multiunit'] === 'Yes';

  // Calculate if it's a Special Discount (2+ discounts)
  const discountCount = [hasEarlyBird, hasLastMinute, hasWeekly, hasLoyalty, hasMobile, hasNewListing].filter(Boolean).length;
  const hasSpecialDiscount = discountCount >= 2;

  // Calculate hasAnyDiscount
  const hasAnyDiscount = hasEarlyBird || hasLastMinute || hasWeekly || hasLoyalty || hasMobile || hasNewListing || hasNonRefundable;

  if (existingProperty) {
    // Update existing property with discount data
    existingProperty.hasEarlyBirdDiscount = hasEarlyBird;
    existingProperty.hasLastMinuteDiscount = hasLastMinute;
    existingProperty.hasLoyaltyDiscount = hasLoyalty;
    existingProperty.hasMobileDiscount = hasMobile;
    existingProperty.hasNewListingDiscount = hasNewListing;
    existingProperty.hasWeeklyDiscount = hasWeekly;
    existingProperty.hasNonRefundableDiscount = hasNonRefundable;
    existingProperty.nonRefundablePercentage = nonRefundablePercentage;
    existingProperty.hasSpecialDealDiscount = hasSpecialDiscount;
    existingProperty.hasAnyDiscount = hasAnyDiscount;
    existingProperty.cancellationPolicy = cancellationPolicy !== 'CHANNEL_NOT_ACTIVE' ? cancellationPolicy : undefined;
    
    // Update multi-unit if exists
    if (isMultiUnit) {
      existingProperty.isMultiUnit = true;
    }
    
    updated++;
  } else {
    // Add new property
    const newProperty = {
      id: propertyId,
      provider: 'BOOKIPLY',
      paymentType: 'ADYEN',
      
      // Multi-unit
      isMultiUnit: isMultiUnit,
      
      // Discounts
      hasAnyDiscount: hasAnyDiscount,
      hasEarlyBirdDiscount: hasEarlyBird,
      earlyBirdPercentage: 0, // Percentage not available in SQL
      hasLastMinuteDiscount: hasLastMinute,
      lastMinutePercentage: 0,
      hasWeeklyDiscount: hasWeekly,
      weeklyPercentage: 0,
      hasLoyaltyDiscount: hasLoyalty,
      loyaltyPercentage: 0,
      hasMobileDiscount: hasMobile,
      mobilePercentage: 0,
      hasNewListingDiscount: hasNewListing,
      newListingPercentage: 0,
      hasNonRefundableDiscount: hasNonRefundable,
      nonRefundablePercentage: nonRefundablePercentage,
      hasSpecialDealDiscount: hasSpecialDiscount,
      specialDealPercentage: 0,
      hasOfferDiscount: false,
      offerPercentage: 0,
      hasProviderDifferenceDiscount: false,
      providerDifferencePercentage: 0,
      totalDiscountPercentage: 0,
      
      // Cancellation Policy
      cancellationPolicy: cancellationPolicy !== 'CHANNEL_NOT_ACTIVE' ? cancellationPolicy : undefined
    };
    
    properties.push(newProperty);
    added++;
  }
});

// Write back to properties.json
fs.writeFileSync('./properties.json', JSON.stringify(properties, null, 2));

console.log('✅ Import Complete!');
console.log('');
console.log('📈 Statistics:');
console.log(`  Total SQL Records: ${sqlData.length}`);
console.log(`  Properties Added: ${added}`);
console.log(`  Properties Updated: ${updated}`);
console.log('');
console.log('💰 Discount Counts (in database):');
console.log(`  Early Bird: ${properties.filter(p => p.hasEarlyBirdDiscount).length}`);
console.log(`  Last Minute: ${properties.filter(p => p.hasLastMinuteDiscount).length}`);
console.log(`  Weekly: ${properties.filter(p => p.hasWeeklyDiscount).length}`);
console.log(`  Loyalty: ${properties.filter(p => p.hasLoyaltyDiscount).length}`);
console.log(`  Mobile: ${properties.filter(p => p.hasMobileDiscount).length}`);
console.log(`  New Listing: ${properties.filter(p => p.hasNewListingDiscount).length}`);
console.log(`  Non-Refundable: ${properties.filter(p => p.hasNonRefundableDiscount).length}`);
console.log(`  Special Discount (2+): ${properties.filter(p => p.hasSpecialDealDiscount).length}`);
console.log('');
console.log('🎯 Total Properties with ANY discount:', properties.filter(p => p.hasAnyDiscount).length);
console.log('🏢 Total Multi-unit Properties:', properties.filter(p => p.isMultiUnit).length);
console.log('');
console.log('📦 Total Properties in Database:', properties.length);

