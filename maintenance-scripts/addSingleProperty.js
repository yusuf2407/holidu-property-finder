const fs = require('fs');

const PROPERTY_ID = 57358106;

async function fetchAndAddProperty() {
  try {
    console.log(`\n🔍 Fetching property ${PROPERTY_ID}...`);
    
    // 1. Fetch property details
    const detailsRes = await fetch(`https://api.holidu.com/rest/v6.2/search/offers/${PROPERTY_ID}?domainId=1&locale=en-IE`);
    if (!detailsRes.ok) {
      throw new Error(`Details API failed: ${detailsRes.status}`);
    }
    const details = await detailsRes.json();
    const provider = details?.provider?.id || 'UNKNOWN';
    const supportsParentUnitStructure = details?.supportsParentUnitStructure || false;
    const isMultiunit = details?.isMultiunit || false;
    
    console.log(`✅ Provider: ${provider}`);
    console.log(`✅ Multi-unit: ${isMultiunit}`);
    console.log(`✅ Parent Structure: ${supportsParentUnitStructure}`);
    
    // 2. Check availability
    const availRes = await fetch(`https://api.holidu.com/search/v1/offers/${PROPERTY_ID}/availability?domainId=1&locale=en-IE`);
    if (!availRes.ok) {
      throw new Error(`Availability API failed: ${availRes.status}`);
    }
    const avail = await availRes.json();
    
    if (!avail?.checkinDates || avail.checkinDates.length === 0) {
      console.log('❌ No availability found');
      return;
    }
    
    const checkin = avail.checkinDates[0];
    const checkout = avail.firstPossibleCheckout[checkin];
    console.log(`✅ Available dates: ${checkin} → ${checkout}`);
    
    // 3. Get pricing data
    const priceRes = await fetch(`https://api.holidu.com/old/rest/v6/search/offers/${PROPERTY_ID}/prices?domainId=1&locale=en-IE&currency=EUR`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkin: checkin,
        checkout: checkout,
        adults: [{ age: null }, { age: null }],
        kids: [],
        selectedOptions: [],
        paymentMethod: null
      })
    });
    
    if (!priceRes.ok) {
      throw new Error(`Pricing API failed: ${priceRes.status}`);
    }
    const price = await priceRes.json();
    
    if (!price.isAvailable) {
      console.log('❌ Property not available for booking');
      return;
    }
    
    // 4. Extract property stats
    const costs = price?.rates?.REFUNDABLE?.receipt?.priceDetails?.items || [];
    const p = price?.paymentDetails;
    
    // Check for On-Request
    const isOnRequest = avail?.isExpressBookable === true && avail?.isInstantBookable === false;
    
    const paymentType = isOnRequest ? 'On-Request' :
      p?.instantPaymentMethod?.type === 'ADYEN' ? 'ADYEN' :
      p?.instantPaymentMethod?.type === 'TOMAS_LIGHTBOX' ? 'TOMAS' :
      (p?.instantPaymentMethod?.type === 'PCI_PROXY' && p?.paymentMethods?.length > 1) ? 'PCI Multiple' :
      (p?.instantPaymentMethod?.type === 'PCI_PROXY') ? 'PCI CC' :
      p?.isSelectable ? 'Selectable' :
      (p?.paymentMethods?.length > 1 ? 'Non-Selectable' : 'Single');
    
    console.log(`\n💳 Payment Type: ${paymentType}`);
    console.log(`📦 Services found: ${costs.length} items`);
    
    const propertyStats = {
      id: PROPERTY_ID,
      provider: provider,
      isMultiunit: isMultiunit,
      supportsParentUnitStructure: supportsParentUnitStructure,
      reviewCount: details?.reviewCount || 0,
      
      // Services
      hasIncludedCosts: costs.some(c => c.paymentType === 'INCLUDED'),
      hasMandatoryCosts: costs.some(c => c.paymentType === 'MANDATORY'),
      hasSelectableCosts: costs.some(c => c.paymentType === 'SELECTABLE'),
      hasFreeSelectableCosts: costs.some(c => c.paymentType === 'SELECTABLE' && c.price?.amount === 0),
      hasOnsiteCosts: costs.some(c => c.paymentType === 'ON_SITE'),
      hasMandatoryOnsiteCosts: costs.some(c => c.paymentType === 'MANDATORY_ON_SITE'),
      
      // Tourist Tax
      hasTouristTax: costs.some(c => c.costType === 'TOURIST_TAX' && c.paymentType !== 'ON_SITE' && c.paymentType !== 'MANDATORY_ON_SITE'),
      hasTouristTaxOnSite: costs.some(c => c.costType === 'TOURIST_TAX' && (c.paymentType === 'ON_SITE' || c.paymentType === 'MANDATORY_ON_SITE')),
      
      // Deposits
      hasDeposit: costs.some(c => c.costType === 'SECURITY_DEPOSIT' && c.paymentType !== 'ON_SITE' && c.paymentType !== 'MANDATORY_ON_SITE'),
      hasDepositOnsite: costs.some(c => c.costType === 'SECURITY_DEPOSIT' && (c.paymentType === 'ON_SITE' || c.paymentType === 'MANDATORY_ON_SITE')),
      
      // Cancellation
      hasFreeCancellation: price?.rates?.REFUNDABLE?.cancellationPolicy?.hasFreeCancellation || false,
      
      // Non-refundable discount
      hasNonRefundableDiscount: (price.rates && price.rates.NON_REFUNDABLE && price.rates.REFUNDABLE) ? true : false,
      
      // Payment Type
      paymentType: paymentType,
      
      // Booking flags (for On-Request)
      isExpressBookable: avail?.isExpressBookable || false,
      isInstantBookable: avail?.isInstantBookable || false,
      
      // Meal options (default false, would need to check board types)
      hasBreakfast: false,
      hasHalfBoard: false,
      hasFullBoard: false
    };
    
    console.log('\n📋 Property Stats:');
    console.log(`  Payment Type: ${propertyStats.paymentType}`);
    console.log(`  On-Request: isExpress=${propertyStats.isExpressBookable}, isInstant=${propertyStats.isInstantBookable}`);
    console.log(`  Selectable Costs: ${propertyStats.hasSelectableCosts}`);
    console.log(`  Free Selectable: ${propertyStats.hasFreeSelectableCosts}`);
    console.log(`  Parent Structure: ${propertyStats.supportsParentUnitStructure}`);
    
    // 5. Add to database
    const properties = JSON.parse(fs.readFileSync('./properties.json', 'utf8'));
    
    // Check if already exists
    const existingIndex = properties.findIndex(p => p.id === PROPERTY_ID);
    if (existingIndex !== -1) {
      console.log('\n⚠️  Property already exists in database, updating...');
      properties[existingIndex] = propertyStats;
    } else {
      console.log('\n✅ Adding new property to database...');
      properties.push(propertyStats);
    }
    
    // Save back to file
    fs.writeFileSync('./properties.json', JSON.stringify(properties, null, 2));
    console.log(`\n💾 Property ${PROPERTY_ID} saved to database!`);
    console.log(`📊 Total properties in database: ${properties.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

fetchAndAddProperty();

