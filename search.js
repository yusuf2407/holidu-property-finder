// Initialize properties
var properties = null;
var unavailableProperties = null;

fetch('./properties.json')
  .then(response => response.json())
  .then(data => {
    properties = data;
    // Load additionally saved properties from chrome.storage
    chrome.storage.local.get(['savedProperties'], function(result) {
      if (result.savedProperties && result.savedProperties.length > 0) {
        console.log(`📂 Loading ${result.savedProperties.length} saved properties from chrome.storage`);
        // Merge with existing properties, avoiding duplicates
        result.savedProperties.forEach(savedProp => {
          const exists = properties.find(p => p.id === savedProp.id);
          if (!exists) {
            properties.push(savedProp);
          }
        });
        console.log(`✅ Total properties in database: ${properties.length}`);
      }
    });
  });

// Initialize unavailable properties database
fetch('./unavailable_properties.json')
  .then(response => response.json())
  .then(data => {
    unavailableProperties = data;
    // Load additionally quarantined properties from chrome.storage
    chrome.storage.local.get(['unavailableProperties'], function(result) {
      if (result.unavailableProperties && result.unavailableProperties.length > 0) {
        console.log(`🚫 Loading ${result.unavailableProperties.length} unavailable properties from chrome.storage`);
        // Merge with existing unavailable properties, avoiding duplicates
        result.unavailableProperties.forEach(unavailProp => {
          const exists = unavailableProperties.find(p => p.id === unavailProp.id);
          if (!exists) {
            unavailableProperties.push(unavailProp);
          }
        });
        console.log(`📊 Total unavailable properties: ${unavailableProperties.length}`);
      }
    });
  })

function getCriteria(){

    let criteria = {};

    let cbHasIncludedCosts = document.getElementById('hasIncludedCosts');
    if (cbHasIncludedCosts.checked) {
      let flag = document.getElementById('hasIncludedCosts_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasIncludedCosts = true;
      } else {
        criteria.hasIncludedCosts_negative = true;
      }
    }

    let cbHasMandatoryCosts = document.getElementById('hasMandatoryCosts');
    if (cbHasMandatoryCosts.checked) {
      let flag = document.getElementById('hasMandatoryCosts_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasMandatoryCosts = true;
      } else {
        criteria.hasMandatoryCosts_negative = true;
      }
    }

    let cbHasSelectableCosts = document.getElementById('hasSelectableCosts');
    if (cbHasSelectableCosts.checked) {
      let flag = document.getElementById('hasSelectableCosts_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasSelectableCosts = true;
      } else {
        criteria.hasSelectableCosts_negative = true;
      }
    }

    let cbHasFreeSelectableCosts = document.getElementById('hasFreeSelectableCosts');
    if (cbHasFreeSelectableCosts.checked) {
      let flag = document.getElementById('hasFreeSelectableCosts_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasFreeSelectableCosts = true;
      } else {
        criteria.hasFreeSelectableCosts_negative = true;
      }
    }

    let cbHasMandatoryOnsiteCosts = document.getElementById('hasMandatoryOnsiteCosts');
    if (cbHasMandatoryOnsiteCosts.checked) {
      let flag = document.getElementById('hasMandatoryOnsiteCosts_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasMandatoryOnsiteCosts = true;
      } else {
        criteria.hasMandatoryOnsiteCosts_negative = true;
      }
    }

    let cbHasOnsiteCosts = document.getElementById('hasOnsiteCosts');
    if (cbHasOnsiteCosts.checked) {
      let flag = document.getElementById('hasOnsiteCosts_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasOnsiteCosts = true;
      } else {
        criteria.hasOnsiteCosts_negative = true;
      }
    }

    let cbHasDeposit = document.getElementById('hasDeposit');
    if (cbHasDeposit.checked) {
      let flag = document.getElementById('hasDeposit_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasDeposit = true;
      } else {
        criteria.hasDeposit_negative = true;
      }
    }

    let cbHasDepositOnsite = document.getElementById('hasDepositOnsite');
    if (cbHasDepositOnsite.checked) {
      let flag = document.getElementById('hasDepositOnsite_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasDepositOnsite = true;
      } else {
        criteria.hasDepositOnsite_negative = true;
      }
    }

    let cbHasTouristTax = document.getElementById('hasTouristTax');
    if (cbHasTouristTax.checked) {
      let flag = document.getElementById('hasTouristTax_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasTouristTax = true;
      } else {
        criteria.hasTouristTax_negative = true;
      }
    }

    let cbHasTouristTaxOnSite = document.getElementById('hasTouristTaxOnSite');
    if (cbHasTouristTaxOnSite.checked) {
      let flag = document.getElementById('hasTouristTaxOnSite_flag').dataset.state;
      if (flag === 'positive') {
        criteria.hasTouristTaxOnSite = true;
      } else {
        criteria.hasTouristTaxOnSite_negative = true;
      }
    }

    let cbHasFreeCancellation = document.getElementById('hasFreeCancellation');
    if (cbHasFreeCancellation.checked) criteria.hasFreeCancellation = true;

    let selCancellationPolicy = document.getElementById('cancellationPolicy');
    if (selCancellationPolicy && selCancellationPolicy.value) {
      criteria.cancellationPolicy = selCancellationPolicy.value;
    }

    let cbHasNonRefundableDiscount = document.getElementById('hasNonRefundableDiscount');
    if (cbHasNonRefundableDiscount.checked) criteria.hasNonRefundableDiscount = true;

    // Discount filters
    let cbHasEarlyBirdDiscount = document.getElementById('hasEarlyBirdDiscount');
    if (cbHasEarlyBirdDiscount?.checked) {
      criteria.hasEarlyBirdDiscount = true;
      let minEarlyBirdPercentage = document.getElementById('minEarlyBirdPercentage');
      if (minEarlyBirdPercentage?.value) {
        criteria.minEarlyBirdPercentage = parseInt(minEarlyBirdPercentage.value);
      }
    }

    let cbHasMobileDiscount = document.getElementById('hasMobileDiscount');
    if (cbHasMobileDiscount?.checked) {
      criteria.hasMobileDiscount = true;
      let minMobilePercentage = document.getElementById('minMobilePercentage');
      if (minMobilePercentage?.value) {
        criteria.minMobilePercentage = parseInt(minMobilePercentage.value);
      }
    }

    let cbHasLoyaltyDiscount = document.getElementById('hasLoyaltyDiscount');
    if (cbHasLoyaltyDiscount?.checked) {
      criteria.hasLoyaltyDiscount = true;
      let minLoyaltyPercentage = document.getElementById('minLoyaltyPercentage');
      if (minLoyaltyPercentage?.value) {
        criteria.minLoyaltyPercentage = parseInt(minLoyaltyPercentage.value);
      }
    }


    let cbHasSpecialDealDiscount = document.getElementById('hasSpecialDealDiscount');
    if (cbHasSpecialDealDiscount?.checked) {
      criteria.hasSpecialDealDiscount = true;
      let minSpecialDealPercentage = document.getElementById('minSpecialDealPercentage');
      if (minSpecialDealPercentage?.value) {
        criteria.minSpecialDealPercentage = parseInt(minSpecialDealPercentage.value);
      }
    }

    let cbHasOfferDiscount = document.getElementById('hasOfferDiscount');
    if (cbHasOfferDiscount?.checked) {
      criteria.hasOfferDiscount = true;
      let minOfferPercentage = document.getElementById('minOfferPercentage');
      if (minOfferPercentage?.value) {
        criteria.minOfferPercentage = parseInt(minOfferPercentage.value);
      }
    }

    let cbHasProviderDifferenceDiscount = document.getElementById('hasProviderDifferenceDiscount');
    if (cbHasProviderDifferenceDiscount?.checked) {
      criteria.hasProviderDifferenceDiscount = true;
      let minProviderDifferencePercentage = document.getElementById('minProviderDifferencePercentage');
      if (minProviderDifferencePercentage?.value) {
        criteria.minProviderDifferencePercentage = parseInt(minProviderDifferencePercentage.value);
      }
    }

    let cbHasLastMinuteDiscount = document.getElementById('hasLastMinuteDiscount');
    if (cbHasLastMinuteDiscount?.checked) {
      criteria.hasLastMinuteDiscount = true;
      let minLastMinutePercentage = document.getElementById('minLastMinutePercentage');
      if (minLastMinutePercentage?.value) {
        criteria.minLastMinutePercentage = parseInt(minLastMinutePercentage.value);
      }
    }

    let cbHasNewListingDiscount = document.getElementById('hasNewListingDiscount');
    if (cbHasNewListingDiscount?.checked) {
      criteria.hasNewListingDiscount = true;
      let minNewListingPercentage = document.getElementById('minNewListingPercentage');
      if (minNewListingPercentage?.value) {
        criteria.minNewListingPercentage = parseInt(minNewListingPercentage.value);
      }
    }

    let cbHasWeeklyDiscount = document.getElementById('hasWeeklyDiscount');
    if (cbHasWeeklyDiscount?.checked) {
      criteria.hasWeeklyDiscount = true;
      let minWeeklyPercentage = document.getElementById('minWeeklyPercentage');
      if (minWeeklyPercentage?.value) {
        criteria.minWeeklyPercentage = parseInt(minWeeklyPercentage.value);
      }
    }

    let cbHasEarlyBirdNonBookiply = document.getElementById('hasEarlyBirdNonBookiply');
    if (cbHasEarlyBirdNonBookiply?.checked) {
      criteria.hasEarlyBirdNonBookiply = true;
    }

    let cbHasLastMinuteNonBookiply = document.getElementById('hasLastMinuteNonBookiply');
    if (cbHasLastMinuteNonBookiply?.checked) {
      criteria.hasLastMinuteNonBookiply = true;
    }

    let selPaymentType ;
    if (document.querySelector("input[name=paymentType]:checked"))
        selPaymentType = document.querySelector("input[name=paymentType]:checked").value;
    if (selPaymentType) criteria.paymentType = selPaymentType;

    let txtProvider = document.getElementById('provider');
    if (txtProvider.value !== "") {
      criteria.provider = txtProvider.value;
      
      // Check if the entered value exactly matches a datalist option
      const datalist = document.getElementById('providers');
      const options = Array.from(datalist.options).map(opt => opt.value);
      const isExactMatch = options.includes(txtProvider.value);
      
      // Only use partial matching if it's NOT an exact match
      criteria.providerPartialMatch = !isExactMatch;
    }

    // Multi-units filters
    let cbIsMultiUnit = document.getElementById('isMultiUnit');
    if (cbIsMultiUnit?.checked) {
      criteria.isMultiUnit = true;
    }

    let cbSupportsParentUnitStructure = document.getElementById('supportsParentUnitStructure');
    if (cbSupportsParentUnitStructure?.checked) {
        criteria.supportsParentUnitStructure = true;
    }

    // Meal options
    let cbHasBreakfast = document.getElementById('hasBreakfast');
    if (cbHasBreakfast?.checked) criteria.hasBreakfast = true;

    let cbHasHalfBoard = document.getElementById('hasHalfBoard');
    if (cbHasHalfBoard?.checked) criteria.hasHalfBoard = true;

    let cbHasFullBoard = document.getElementById('hasFullBoard');
    if (cbHasFullBoard?.checked) criteria.hasFullBoard = true;

    // Test Property filter
    let cbIsTestProperty = document.getElementById('isTestProperty');
    if (cbIsTestProperty?.checked) criteria.isTestProperty = true;

    console.log('Search criteria:', criteria);
    return criteria;
}

// ES query function for Multi-unit parent structure properties
async function getMultiUnitPropertyIds() {
  try {
    console.log("Fetching Multi-unit parent structure properties from ES...");
    console.log("Make sure you're connected to Holidu VPN!");
    
    const esQuery = {
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "supportsParentUnitStructure": {
                  "value": true
                }
              }
            },
            {
              "term": {
                "isDeleted": {
                  "value": false
                }
              }
            },
            {
              "term": {
                "searchable": {
                  "value": true
                }
              }
            }
          ]
        }
      },
      "_source": [
        "id"
      ],
      "size": 20
    };

    const response = await fetch("https://kibana-search-7.holidu.io/api/console/proxy?path=detailed-apartments/_search&method=POST", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'true'
      },
      body: JSON.stringify(esQuery)
    });

    if (!response.ok) {
      throw new Error(`ES API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.hits && data.hits.hits) {
      const propertyIds = data.hits.hits.map(hit => hit._source.id);
      console.log(`Found ${propertyIds.length} Multi-unit parent structure properties from ES`);
      return propertyIds;
    } else {
      console.log("No Multi-unit parent structure properties found from ES");
      return [];
    }
  } catch (error) {
    console.error("Error fetching from ES API:", error.message);
    console.log("Falling back to sample Multi-unit property IDs...");
    return [48419392, 48419418, 47533901]; // Sample IDs
  }
}

async function findProperty(criteria) {
    // Check if we need offers-discounts search (for discount filters)
    // Note: hasLoyaltyDiscount uses Static DB only (no ES/Live API validation)
    const needsDiscountSearch = criteria.hasEarlyBirdDiscount || 
                                 criteria.hasMobileDiscount || 
                                 criteria.hasLastMinuteDiscount || 
                                 criteria.hasNewListingDiscount || 
                                 criteria.hasEarlyBirdNonBookiply ||
                                 criteria.hasLastMinuteNonBookiply || 
                                 criteria.hasOfferDiscount || 
                                 criteria.hasProviderDifferenceDiscount || 
                                 criteria.hasSpecialDealDiscount ||
                                 criteria.hasWeeklyDiscount;
    
    // Check if criteria needs ONLY static DB (not in ES or Live API)
    // Board types (hasBreakfast, hasHalfBoard, hasFullBoard) now use Static DB first
    // Loyalty Discount: Skip Live API validation, only use Static DB
    const needsOnlyStaticDb = criteria.isTestProperty || 
                              criteria.hasBreakfast || 
                                     criteria.hasHalfBoard || 
                                     criteria.hasFullBoard || 
                              criteria.hasLoyaltyDiscount;
    
    // Check if criteria needs ONLY Live API validation (not in ES)
    const needsOnlyLiveValidation = criteria.hasNonRefundableDiscount ||
                                     criteria.paymentType;
    
    // Use ES→Live flow when provider, multi-unit, discounts, or any service/tax/deposit flags (positive or negative)
    const needsEsSearch = criteria.provider || 
                          criteria.isMultiUnit ||
                          criteria.supportsParentUnitStructure ||
                          needsDiscountSearch ||
                          // Services (positive or negative)
                          criteria.hasIncludedCosts ||
                          criteria.hasIncludedCosts_negative ||
                          criteria.hasMandatoryCosts ||
                          criteria.hasMandatoryCosts_negative ||
                          criteria.hasSelectableCosts ||
                          criteria.hasSelectableCosts_negative ||
                          criteria.hasFreeSelectableCosts ||
                          criteria.hasFreeSelectableCosts_negative ||
                          criteria.hasOnsiteCosts ||
                          criteria.hasOnsiteCosts_negative ||
                          criteria.hasMandatoryOnsiteCosts ||
                          criteria.hasMandatoryOnsiteCosts_negative ||
                          // Tourist Tax (positive or negative)
                          criteria.hasTouristTax ||
                          criteria.hasTouristTax_negative ||
                          criteria.hasTouristTaxOnSite ||
                          criteria.hasTouristTaxOnSite_negative ||
                          // Deposit (positive or negative)
                          criteria.hasDeposit ||
                          criteria.hasDeposit_negative ||
                          criteria.hasDepositOnsite ||
                          criteria.hasDepositOnsite_negative;
    
    console.log('needsEsSearch:', needsEsSearch);
    console.log('needsOnlyStaticDb:', needsOnlyStaticDb);
    console.log('needsOnlyLiveValidation:', needsOnlyLiveValidation);
    
    // If criteria can ONLY be filtered via static DB (like test properties), skip ES completely
    if (needsOnlyStaticDb && !needsEsSearch) {
      console.log('⚠️  Criteria requires static DB only (not in ES) - skipping ES search');
      console.log('🔍 Going directly to static DB filter...');
      // Skip ES, go directly to static DB
    }
    // If criteria can ONLY be validated via Live API (not in ES), skip ES search
    else if (needsOnlyLiveValidation && !needsEsSearch) {
      console.log('⚠️  Criteria requires Live API validation only (not in ES) - skipping ES search');
      console.log('🔍 Going directly to static DB → Live API validation...');
      // Skip ES, go directly to static DB fallback
    } else {
      // ALWAYS try ES first for other criteria
      console.log('🔍 Attempting ES search first...');
    
    try {
      const ids = await runEsSearch(criteria);
      console.log('ES returned IDs:', ids);
      
      if (ids && ids.length > 0) {
        const match = await resolveViaLiveApi(ids, criteria);
        console.log('Live API match:', match);
        if (match) {
          // Update CTA to show found status
          if (typeof window.updateSearchStatus === 'function') {
            console.log('📱 Updating CTA: Found (ES)');
            window.updateSearchStatus('Found');
          }
          return { id: match };
        }
      }
      
      // If ES returned no results or Live API validation failed, fallback to static DB
      console.log('⚠️  ES/Live API returned no results, falling back to static DB...');
    } catch (error) {
      console.error('❌ ES search error, falling back to static DB:', error.message);
    }
    } // Close the else block for needsOnlyLiveValidation check
    // Don't return null here - let it fall through to static DB

    // Fallback to static DB (always runs if ES didn't return a match)
    console.log('🔍 Using static DB filter for criteria:', criteria);
    var results = properties.filter(function(obj) {
      // First check if property is quarantined
      if (unavailableProperties?.find(p => p.id === obj.id)) {
        return false; // Skip quarantined properties
      }
      
      return Object.keys(criteria).every(function(c) {
        // Skip internal flags
        if (c === 'providerPartialMatch') return true;
        
        // Skip percentage criteria (they're checked alongside the boolean)
        if (c.startsWith('min') && c.endsWith('Percentage')) return true;
        
        // Skip Live-API-only criteria (validated later via Live API, not in static DB)
        // PaymentType: Filter in static DB if property has paymentType field, otherwise validate via Live API
        // Note: Services/Tax/Deposits are NOT in this list - they're filtered by Static DB first, then validated by Live API
        // Special handling for non-refundable: Only BOOKIPLY provider has non-refundable discounts
        if (c === 'hasNonRefundableDiscount') {
          if (obj.provider !== 'BOOKIPLY') {
            return false; // Non-BOOKIPLY properties can't have non-refundable discount
          }
          // For BOOKIPLY properties, skip this check and validate via Live API
          return true;
        }
        
        // Live-only criteria: discounts that are not in Static DB or require Live API validation
        // Board types (hasBreakfast, hasHalfBoard, hasFullBoard) should use Static DB first
        // Note: hasOfferDiscount, hasProviderDifferenceDiscount try offers-discounts first, then fallback to Live-only
        // Loyalty Discount: uses Static DB fallback (strict matching)
        const liveOnlyCriteria = ['hasOfferDiscount', 'hasProviderDifferenceDiscount'];
        if (liveOnlyCriteria.includes(c)) {
          console.log(`  ⏭️  Skipping '${c}' in static DB filter (will validate via Live API)`);
          return true; // Don't filter by this - validate later
        }
        
        // For paymentType: filter in static DB where available (helps narrow down candidates)
        // Missing paymentType in DB will pass through and be validated via Live API
        
        // Handle negative flags - check if this is a negative flag criterion
        if (c.endsWith('_negative')) {
          // Extract the base field name (e.g., 'hasIncludedCosts' from 'hasIncludedCosts_negative')
          const baseField = c.replace('_negative', '');
          
          // Special handling for supportsParentUnitStructure
          // For negative flag: Match properties where supportsParentUnitStructure is explicitly false
          // AND isMultiUnit is true (only multi-unit properties can have parent structure)
          if (baseField === 'supportsParentUnitStructure') {
            return obj.supportsParentUnitStructure === false && obj.isMultiUnit === true;
          }
          
          // For other fields, must NOT have this feature
          return !obj[baseField] || obj[baseField] === false || obj[baseField] === 0;
        }
        
        // Handle provider partial matching
        if (c === 'provider' && criteria.providerPartialMatch) {
          return obj.provider && obj.provider.toUpperCase().includes(criteria.provider.toUpperCase());
        }
        
        // Handle discount percentage filtering
        // Note: DB percentages are often 0 (actual % comes from Live API)
        // Only check percentage when minimum is specified
        if (c === 'hasEarlyBirdDiscount' && criteria.hasEarlyBirdDiscount) {
          if (!obj.hasEarlyBirdDiscount) return false;
          if (criteria.minEarlyBirdPercentage && obj.earlyBirdPercentage < criteria.minEarlyBirdPercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasMobileDiscount' && criteria.hasMobileDiscount) {
          if (!obj.hasMobileDiscount) return false;
          if (criteria.minMobilePercentage && obj.mobilePercentage < criteria.minMobilePercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasLoyaltyDiscount' && criteria.hasLoyaltyDiscount) {
          if (!obj.hasLoyaltyDiscount) return false;
          if (criteria.minLoyaltyPercentage && obj.loyaltyPercentage < criteria.minLoyaltyPercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasSpecialDealDiscount' && criteria.hasSpecialDealDiscount) {
          if (!obj.hasSpecialDealDiscount) return false;
          if (criteria.minSpecialDealPercentage && obj.specialDealPercentage < criteria.minSpecialDealPercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasOfferDiscount' && criteria.hasOfferDiscount) {
          if (!obj.hasOfferDiscount) return false;
          if (criteria.minOfferPercentage && obj.offerPercentage < criteria.minOfferPercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasProviderDifferenceDiscount' && criteria.hasProviderDifferenceDiscount) {
          if (!obj.hasProviderDifferenceDiscount) return false;
          if (criteria.minProviderDifferencePercentage && obj.providerDifferencePercentage < criteria.minProviderDifferencePercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasLastMinuteDiscount' && criteria.hasLastMinuteDiscount) {
          if (!obj.hasLastMinuteDiscount) return false;
          if (criteria.minLastMinutePercentage && obj.lastMinutePercentage < criteria.minLastMinutePercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasNewListingDiscount' && criteria.hasNewListingDiscount) {
          if (!obj.hasNewListingDiscount) return false;
          if (criteria.minNewListingPercentage && obj.newListingPercentage < criteria.minNewListingPercentage) {
            return false;
          }
          return true;
        }
        if (c === 'hasWeeklyDiscount' && criteria.hasWeeklyDiscount) {
          if (!obj.hasWeeklyDiscount) return false;
          if (criteria.minWeeklyPercentage && obj.weeklyPercentage < criteria.minWeeklyPercentage) {
            return false;
          }
          return true;
        }
        
        // Special handling for Non-Holidu Home (Non-BOOKIPLY) discounts
        if (c === 'hasEarlyBirdNonBookiply') {
          // Must have Early Bird discount AND provider is NOT BOOKIPLY
          return obj.hasEarlyBirdDiscount === true && obj.provider !== 'BOOKIPLY';
        }
        if (c === 'hasLastMinuteNonBookiply') {
          // Must have Last Minute discount AND provider is NOT BOOKIPLY
          return obj.hasLastMinuteDiscount === true && obj.provider !== 'BOOKIPLY';
        }
        
        // STRICT MATCHING for discount fields
        // Each discount field must match EXACTLY (not just "has any discount")
        const discountFields = [
          'hasEarlyBirdDiscount', 'hasMobileDiscount', 'hasLoyaltyDiscount', 
          'hasSpecialDealDiscount', 'hasOfferDiscount', 'hasProviderDifferenceDiscount',
          'hasLastMinuteDiscount', 'hasNewListingDiscount', 'hasWeeklyDiscount'
        ];
        
        if (discountFields.includes(c)) {
          // Must have THIS SPECIFIC discount, not just any discount
          return obj[c] === true;
        }
        
        // Regular positive matching for non-discount fields
        return (obj[c] == criteria[c] || (obj[c]>0 && criteria[c]));
      });
    });
    if (results.length > 0){
      // Validate with live API before returning
      console.log(`✅ Found ${results.length} matching properties in static DB, validating with Live API...`);
      return await validateStaticDbResultWithLiveApi(results, criteria);
    } else {
      console.log('❌ No matching properties found in static DB for criteria:', criteria);
      console.log('💡 Try adjusting your filters or search criteria');
      return null;
    }
}

// Validate static DB results with Live API to ensure accuracy
async function validateStaticDbResultWithLiveApi(candidates, criteria) {
  // Check if we need strict validation (discount/board/payment type/complex criteria)
  // Note: hasLoyaltyDiscount excluded - uses Static DB only (no Live API validation)
  const needsStrictValidation = criteria.hasEarlyBirdDiscount || criteria.hasMobileDiscount || 
    criteria.hasNonRefundableDiscount || criteria.hasSpecialDealDiscount || criteria.hasOfferDiscount || 
    criteria.hasProviderDifferenceDiscount || criteria.hasLastMinuteDiscount || criteria.hasNewListingDiscount || 
    criteria.hasWeeklyDiscount || criteria.hasBreakfast || criteria.hasHalfBoard || 
    criteria.hasFullBoard || criteria.paymentType ||
    // Services, Tourist Tax, Deposits (need Live API validation)
    criteria.hasIncludedCosts || criteria.hasMandatoryCosts || criteria.hasSelectableCosts || 
    criteria.hasFreeSelectableCosts || criteria.hasOnsiteCosts || criteria.hasMandatoryOnsiteCosts ||
    criteria.hasTouristTax || criteria.hasTouristTaxOnSite ||
    criteria.hasDeposit || criteria.hasDepositOnsite;
  
  // If no strict validation needed, still need to check availability
  if (!needsStrictValidation) {
    console.log('ℹ️  Simple criteria - checking availability for DB properties...');
    // Shuffle for variety
    const shuffled = candidates.sort(() => Math.random() - 0.5);
    
    // Try up to 10 candidates from DB
    for (const candidate of shuffled.slice(0, 10)) {
      console.log(`  Checking property ${candidate.id} availability...`);
      
      try {
        // Check availability
        const availRes = await fetch(`https://api.holidu.com/search/v1/offers/${candidate.id}/availability?domainId=1&locale=en-IE`);
        if (!availRes.ok) {
          console.log(`  ⏭️  Property ${candidate.id} - availability API failed`);
          continue;
        }
        
        const avail = await availRes.json();
        
        if (!avail?.checkinDates || avail.checkinDates.length === 0) {
          console.log(`  🚫 Property ${candidate.id} - no availability, quarantining`);
          // Quarantine if it's not a test property
          if (!candidate.isTestProperty) {
            await saveToUnavailableDatabase(candidate.id, candidate.provider, 'no_availability_simple_check');
          }
          continue;
        }
        
        console.log(`  ✅ Property ${candidate.id} has availability!`);
        
        // Update CTA to show found status
        if (typeof window.updateSearchStatus === 'function') {
          console.log('📱 Updating CTA: Found (DB simple)');
          window.updateSearchStatus('Found');
        }
        
        return candidate;
      } catch (error) {
        console.log(`  ❌ Property ${candidate.id} - error:`, error.message);
        continue;
      }
    }
    
    console.log('❌ No available properties found in static DB after checking');
    return null;
  }
  
  // Strict validation for discount/board criteria
  console.log('🔍 Discount/Board criteria detected - performing strict Live API validation');
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  
  for (const candidate of shuffled.slice(0, 10)) { // Try up to 10 candidates
    try {
      console.log(`🔍 Validating property ${candidate.id} with Live API...`);
      
      // Check availability
      const availRes = await fetch(`https://api.holidu.com/search/v1/offers/${candidate.id}/availability?domainId=1&locale=en-IE`);
      if (!availRes.ok) {
        console.log(`⏭️  Property ${candidate.id} - availability API failed`);
        continue;
      }
      
      const avail = await availRes.json();
      
      // Skip availability check for test properties (they often don't have availability)
      if (!candidate.isTestProperty) {
        if (!avail?.checkinDates || avail.checkinDates.length === 0) {
          console.log(`⏭️  Property ${candidate.id} - no availability, quarantining`);
          await saveToUnavailableDatabase(candidate.id, candidate.provider, 'no_availability_validation');
          continue;
        }
      } else {
        console.log(`🧪 Test property - skipping availability check`);
      }
      
      // Try multiple dates (TOMAS properties sometimes have broken first dates)
      let prices = null;
      let checkin = null;
      let checkout = null;
      
      for (let dateIdx = 0; dateIdx < Math.min(5, avail.checkinDates.length); dateIdx++) {
        checkin = avail.checkinDates[dateIdx];
        checkout = avail.firstPossibleCheckout[checkin];
        
        // Get pricing data
        const priceRes = await fetch(`https://api.holidu.com/old/rest/v6/search/offers/${candidate.id}/prices?domainId=1&locale=en-IE&currency=EUR`, {
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
        
        if (!priceRes.ok) continue;
        
        const priceData = await priceRes.json();
        
        // Check if this date actually works (isAvailable and has data)
        if (priceData.isAvailable && (priceData.costsV2 || priceData.rates)) {
          prices = priceData;
          console.log(`  ✅ Found working date: ${checkin} → ${checkout}`);
          break;
        }
      }
      
      if (!prices) {
        // For test properties, if no pricing data but it's a test property, validate payment type
        if (candidate.isTestProperty && criteria.paymentType) {
          console.log(`🧪 Test property - validating payment type`);
          console.log(`   avail object:`, avail);
          console.log(`   paymentDetails:`, avail?.paymentDetails);
          console.log(`   instantPaymentMethod:`, avail?.paymentDetails?.instantPaymentMethod);
          const livePaymentType = detectPaymentType(avail);
          console.log(`   detectPaymentType returned:`, livePaymentType);
          
          // If Live API doesn't have payment details, trust the DB value for test properties
          if (livePaymentType === null && candidate.paymentType === criteria.paymentType) {
            console.log(`✅ Test property ${candidate.id} - payment type matches (from DB, Live API unavailable)`);
            if (typeof window.updateSearchStatus === 'function') {
              window.updateSearchStatus('Found');
            }
            return candidate;
          } else if (livePaymentType === criteria.paymentType) {
            console.log(`✅ Test property ${candidate.id} - payment type matches (from Live API)!`);
            if (typeof window.updateSearchStatus === 'function') {
              window.updateSearchStatus('Found');
            }
            return candidate;
          } else {
            console.log(`⏭️  Test property ${candidate.id} - payment type mismatch: expected=${criteria.paymentType}, actual=${livePaymentType}, DB=${candidate.paymentType}`);
            continue;
          }
        }
        
        console.log(`⏭️  Property ${candidate.id} - no working pricing dates found`);
        continue;
      }
      
      // Validate criteria against live data
      const liveMatches = matchesLiveCriteria(prices, criteria, avail);
      if (!liveMatches) {
        // For properties with paymentType in DB, if only payment type fails but DB says it matches, trust DB
        if (criteria.paymentType && candidate.paymentType === criteria.paymentType) {
          console.log(`⚠️  Property ${candidate.id} - Live validation failed but DB payment type matches - accepting property`);
          // Continue to return this property
        } else {
          console.log(`⏭️  Property ${candidate.id} - doesn't match criteria in live data`);
          continue;
        }
      }
      
      console.log(`✅ Property ${candidate.id} validated successfully!`);
      
      // Update CTA to show found status
      if (typeof window.updateSearchStatus === 'function') {
        console.log('📱 Updating CTA: Found (DB strict)');
        window.updateSearchStatus('Found');
      }
      
      // Update the candidate with fresh data
      candidate.checkin = checkin;
      candidate.checkout = checkout;
      candidate.liveValidated = true;
      
      return candidate;
      
    } catch (error) {
      console.error(`Error validating property ${candidate.id}:`, error.message);
      continue;
    }
  }
  
  console.log('❌ No valid properties found after Live API validation');
  return null;
}

// Check if live API data matches the search criteria
function matchesLiveCriteria(priceResponse, criteria, availResponse) {
  // Check discount criteria if specified (EXCLUDING hasNonRefundableDiscount and hasLoyaltyDiscount - checked separately)
  if (criteria.hasEarlyBirdDiscount || 
      criteria.hasMobileDiscount ||
      criteria.hasSpecialDealDiscount || criteria.hasOfferDiscount || criteria.hasProviderDifferenceDiscount ||
      criteria.hasLastMinuteDiscount || criteria.hasNewListingDiscount || criteria.hasWeeklyDiscount) {
    
    // Discounts only appear in multi-rate responses with REFUNDABLE rate
    if (!priceResponse.rates?.REFUNDABLE?.receipt?.discountDetails) {
      console.log('  ⚠️ Discount check: No discount data in Live API response');
      
      // For OFFER and PROVIDER_DIFFERENCE: These are Live API only (not in Static DB)
      // If Live API unavailable, we must reject
      if (criteria.hasOfferDiscount || criteria.hasProviderDifferenceDiscount) {
        console.log('  ❌ OFFER/PROVIDER_DIFFERENCE requires Live API - rejecting');
        return false;
      }
      
      console.log('  ⚠️ This might be due to VPN off or API unavailable - trusting Static DB for other discounts');
      // For other discounts (Early Bird, Last Minute, etc.) trust Static DB
      return true;
    }
    
    const discounts = priceResponse.rates.REFUNDABLE.receipt.discountDetails.items || [];
    
    // If discount data exists but items array is empty
    if (discounts.length === 0) {
      // For OFFER and PROVIDER_DIFFERENCE: Reject if no discounts found
      if (criteria.hasOfferDiscount || criteria.hasProviderDifferenceDiscount) {
        console.log('  ❌ OFFER/PROVIDER_DIFFERENCE not found in Live API - rejecting');
        return false;
      }
      console.log('  ⚠️ Empty discounts array in Live API - trusting Static DB for other discounts');
      return true;
    }
    
    // HOLIDU BUSINESS LOGIC: New Listing Discount is EXCLUSIVE
    // If property has New Listing discount (and user is NOT searching for it), reject it
    // because New Listing overrides all other discounts
    if (!criteria.hasNewListingDiscount) {
      const newListing = discounts.find(d => d.type === 'NEW_LISTING_PROMOTION' && d.percentage > 0);
      if (newListing) {
        console.log('  ❌ Property has New Listing discount (' + newListing.percentage + '%) - rejecting because New Listing is exclusive');
        return false;
      }
    }
    
    if (criteria.hasEarlyBirdDiscount) {
      const earlyBird = discounts.find(d => d.type === 'EARLY_BIRD');
      if (!earlyBird) return false;
      if (criteria.minEarlyBirdPercentage && earlyBird.percentage < criteria.minEarlyBirdPercentage) return false;
    }
    
    if (criteria.hasMobileDiscount) {
      const mobile = discounts.find(d => d.type === 'MOBILE_DISCOUNT');
      if (!mobile) return false;
      if (criteria.minMobilePercentage && mobile.percentage < criteria.minMobilePercentage) return false;
    }
    
    if (criteria.hasLoyaltyDiscount) {
      const loyalty = discounts.find(d => d.type === 'LOYALTY');
      if (!loyalty) {
        console.log('  ⚠️ Loyalty discount not found in Live API - trusting Static DB');
        // Trust Static DB (like deposits) - Live API often doesn't have loyalty data
        return true;
      }
      // If found in Live API, check percentage only if specified
      if (criteria.minLoyaltyPercentage && loyalty.percentage < criteria.minLoyaltyPercentage) {
        console.log('  ❌ Loyalty discount % below threshold');
        return false;
      }
      console.log('  ✅ Loyalty discount found in Live API (' + (loyalty.percentage || 0) + '%) - accepting');
    }
    
    if (criteria.hasSpecialDealDiscount) {
      // Special Discount = 2 or more discounts (EXCLUDING New Listing)
      // New Listing is exclusive and shouldn't be counted
      const specialDiscountTypes = ['EARLY_BIRD', 'LAST_MINUTE', 'WEEKLY_DISCOUNT', 'LOYALTY', 'MOBILE_DISCOUNT'];
      
      // Filter discounts with percentage > 0 and NOT New Listing
      const validDiscounts = discounts.filter(d => 
        specialDiscountTypes.includes(d.type) && d.percentage > 0
      );
      
      console.log('  Special Deal check:', validDiscounts.length, 'valid discounts (excluding New Listing)');
      
      // Must have at least 2 discounts with > 0%
      if (validDiscounts.length < 2) {
        console.log('  ❌ Special Deal requires 2+ discounts, found:', validDiscounts.length);
        return false;
      }
      
      // Check: Property should NOT have New Listing (it's exclusive)
      const hasNewListing = discounts.find(d => d.type === 'NEW_LISTING_PROMOTION' && d.percentage > 0);
      if (hasNewListing) {
        console.log('  ❌ Property has New Listing discount - rejecting (New Listing is exclusive)');
        return false;
      }
      
      // If percentage threshold specified, check total of valid special discounts
      if (criteria.minSpecialDealPercentage) {
        const totalSpecialPercentage = validDiscounts.reduce((sum, d) => sum + (d.percentage || 0), 0);
        console.log('  Total Special Deal %:', totalSpecialPercentage);
        if (totalSpecialPercentage < criteria.minSpecialDealPercentage) {
          console.log('  ❌ Total % below threshold:', totalSpecialPercentage, '<', criteria.minSpecialDealPercentage);
          return false;
        }
      }
      
      console.log('  ✅ Special Deal validated:', validDiscounts.length, 'discounts');
    }
    
    if (criteria.hasOfferDiscount) {
      const offer = discounts.find(d => d.type === 'OFFER');
      if (!offer) return false;
      // Reject if discount percentage is 0 (invalid/expired discount)
      if (!offer.percentage || offer.percentage === 0) {
        console.log('  ❌ Offer discount found but percentage is 0 - rejecting');
        return false;
      }
      if (criteria.minOfferPercentage && offer.percentage < criteria.minOfferPercentage) return false;
      console.log('  ✅ Offer discount present (' + offer.percentage + '%) - accepting');
    }
    
    if (criteria.hasProviderDifferenceDiscount) {
      const providerDiff = discounts.find(d => d.type === 'PROVIDER_DIFFERENCE');
      if (!providerDiff) return false;
      // Reject if discount percentage is 0 (invalid/expired discount)
      if (!providerDiff.percentage || providerDiff.percentage === 0) {
        console.log('  ❌ Provider Difference discount found but percentage is 0 - rejecting');
        return false;
      }
      if (criteria.minProviderDifferencePercentage && providerDiff.percentage < criteria.minProviderDifferencePercentage) return false;
      console.log('  ✅ Provider Difference discount present (' + providerDiff.percentage + '%) - accepting');
    }
    
    if (criteria.hasLastMinuteDiscount) {
      const lastMinute = discounts.find(d => d.type === 'LAST_MINUTE');
      if (!lastMinute) return false;
      if (criteria.minLastMinutePercentage && lastMinute.percentage < criteria.minLastMinutePercentage) return false;
    }
    
    if (criteria.hasNewListingDiscount) {
      const newListing = discounts.find(d => d.type === 'NEW_LISTING_PROMOTION');
      if (!newListing) return false;
      // Reject if discount percentage is 0 (invalid/expired discount)
      if (!newListing.percentage || newListing.percentage === 0) {
        console.log('  ❌ New Listing discount found but percentage is 0 - rejecting');
        return false;
      }
      if (criteria.minNewListingPercentage && newListing.percentage < criteria.minNewListingPercentage) return false;
      
      // HOLIDU BUSINESS LOGIC: New Listing Discount is EXCLUSIVE
      // If New Listing is present (% > 0), ACCEPT the property
      // Other discounts might be present but New Listing takes priority
      console.log('  ✅ New Listing discount present (' + newListing.percentage + '%) - accepting');
    }
    
    if (criteria.hasWeeklyDiscount) {
      const weekly = discounts.find(d => d.type === 'WEEKLY_DISCOUNT');
      if (!weekly) return false;
      if (criteria.minWeeklyPercentage && weekly.percentage < criteria.minWeeklyPercentage) return false;
    }
    
    if (criteria.hasNonRefundableDiscount) {
      // Check if NON_REFUNDABLE rate exists (multi-rate property)
      if (!priceResponse.rates?.NON_REFUNDABLE) {
        console.log('  ❌ Non-refundable rate not found');
        return false;
      }
      
      // Check if it's actually a multi-rate property with REFUNDABLE rate too
      if (!priceResponse.rates?.REFUNDABLE) {
        console.log('  ❌ REFUNDABLE rate not found - not a multi-rate property');
        return false;
      }
      
      // Check if there's an actual discount (NON_REFUNDABLE should be cheaper than REFUNDABLE)
      const nonRefPrice = priceResponse.rates.NON_REFUNDABLE.receipt?.totalPrice?.amount;
      const refPrice = priceResponse.rates.REFUNDABLE.receipt?.totalPrice?.amount;
      
      if (!nonRefPrice || !refPrice) {
        console.log('  ❌ Could not get prices for comparison');
        return false;
      }
      
      if (nonRefPrice >= refPrice) {
        console.log('  ❌ Non-refundable price (' + nonRefPrice + ') is not cheaper than refundable (' + refPrice + ') - no actual discount');
        return false;
      }
      
      const discountPercent = ((refPrice - nonRefPrice) / refPrice * 100).toFixed(2);
      console.log('  ✅ Non-refundable discount found: ' + discountPercent + '% (non-ref: ' + nonRefPrice + ', ref: ' + refPrice + ')');
    }
    
  }
  
  // Check board type criteria
  if (criteria.hasBreakfast || criteria.hasHalfBoard || criteria.hasFullBoard) {
    const boardTypes = new Set();
    
    console.log('  🍽️  Board type check - priceResponse structure:');
    console.log('    Has rates?', !!priceResponse.rates);
    if (priceResponse.rates) {
      console.log('    Rate keys:', Object.keys(priceResponse.rates));
    }
    console.log('    Has boardType directly?', !!priceResponse.boardType);
    if (priceResponse.boardType) {
      console.log('    Direct boardType:', priceResponse.boardType);
    }
    
    // Multi-rate response (has rates object)
    if (priceResponse.rates) {
      Object.values(priceResponse.rates).forEach(rate => {
        console.log('    Rate boardType:', rate.boardType);
        if (rate.boardType) boardTypes.add(rate.boardType);
      });
    }
    
    // Check if boardType is directly on priceResponse (single-rate structure)
    if (priceResponse.boardType) {
      boardTypes.add(priceResponse.boardType);
      console.log('    Added direct boardType:', priceResponse.boardType);
    }
    
    // Single-rate response (check costs for breakfast)
    if (criteria.hasBreakfast) {
      const hasBreakfastInCosts = priceResponse.costsV2?.MANDATORY_FREE?.some(cost => 
        cost.label?.toLowerCase().includes('breakfast') || 
        cost.label?.toLowerCase().includes('frühstück')
      );
      
      console.log('  🍳 Breakfast check:');
      console.log('    boardTypes:', Array.from(boardTypes));
      console.log('    hasBreakfastInCosts:', hasBreakfastInCosts);
      console.log('    costsV2 present:', !!priceResponse.costsV2);
      if (priceResponse.costsV2?.MANDATORY_FREE) {
        console.log('    MANDATORY_FREE costs:', priceResponse.costsV2.MANDATORY_FREE.map(c => c.label));
      }
      
      // Pass if either: has BED_AND_BREAKFAST board type OR has breakfast in costs
      if (!boardTypes.has('BED_AND_BREAKFAST') && !boardTypes.has('BREAKFAST') && !hasBreakfastInCosts) {
        console.log('    ❌ FAILED breakfast check');
        return false;
      }
      console.log('    ✅ PASSED breakfast check');
    }
    
    if (criteria.hasHalfBoard) {
      console.log('  🍽️  Half Board check:');
      console.log('    boardTypes:', Array.from(boardTypes));
      console.log('    Has HALF_BOARD?', boardTypes.has('HALF_BOARD'));
      
      // Check if Half Board present in boardTypes
        if (!boardTypes.has('HALF_BOARD')) {
        console.log('    ⚠️  HALF_BOARD not found in Live API boardTypes');
        console.log('    ℹ️  Trusting Static DB (boardType info not always in API response)');
        // Don't fail - trust Static DB since API doesn't always have boardType
      } else {
        console.log('    ✅ PASSED half board check (confirmed by Live API)');
      }
    }
    
    if (criteria.hasFullBoard) {
      console.log('  🍴 Full Board check:');
      console.log('    Has FULL_BOARD?', boardTypes.has('FULL_BOARD'));
      
      // Check if Full Board present in boardTypes
        if (!boardTypes.has('FULL_BOARD')) {
        console.log('    ⚠️  FULL_BOARD not found in Live API boardTypes');
        console.log('    ℹ️  Trusting Static DB (boardType info not always in API response)');
        // Don't fail - trust Static DB since API doesn't always have boardType
      } else {
        console.log('    ✅ PASSED full board check (confirmed by Live API)');
      }
    }
  }
  
  // Check Services, Tourist Tax, and Deposit criteria (positive AND negative flags)
  if (criteria.hasIncludedCosts || criteria.hasMandatoryCosts || criteria.hasSelectableCosts || 
      criteria.hasFreeSelectableCosts || criteria.hasOnsiteCosts || criteria.hasMandatoryOnsiteCosts ||
      criteria.hasTouristTax || criteria.hasTouristTaxOnSite || 
      criteria.hasDeposit || criteria.hasDepositOnsite ||
      // Negative flags
      criteria.hasIncludedCosts_negative || criteria.hasMandatoryCosts_negative || 
      criteria.hasSelectableCosts_negative || criteria.hasFreeSelectableCosts_negative ||
      criteria.hasOnsiteCosts_negative || criteria.hasMandatoryOnsiteCosts_negative ||
      criteria.hasTouristTax_negative || criteria.hasTouristTaxOnSite_negative ||
      criteria.hasDeposit_negative || criteria.hasDepositOnsite_negative) {
    
    // Try to get costs from multiple possible locations
    let costs = priceResponse?.rates?.REFUNDABLE?.receipt?.priceDetails?.items || [];
    
    // Fallback to costsV2 if priceDetails.items is empty
    if (costs.length === 0 && priceResponse?.costsV2) {
      console.log('  ℹ️  Using costsV2 as fallback (priceDetails.items was empty)');
      // costsV2 structure: { MANDATORY_FREE: [...], MANDATORY: [...], SELECTABLE: [...], etc }
      console.log('  🔍 DEBUG: costsV2 keys:', Object.keys(priceResponse.costsV2).join(', '));
      
      // Log array sizes for each key
      Object.keys(priceResponse.costsV2).forEach(key => {
        const arr = priceResponse.costsV2[key];
        console.log(`  🔍 DEBUG: costsV2.${key} has ${arr ? arr.length : 0} items`);
      });
      
      // Flatten all cost arrays into single array
      costs = [];
      Object.keys(priceResponse.costsV2).forEach(paymentType => {
        const costsArray = priceResponse.costsV2[paymentType] || [];
        costsArray.forEach(cost => {
          costs.push({
            ...cost,
            paymentType: paymentType // Add paymentType from the key
          });
        });
      });
      console.log('  ✅ Extracted', costs.length, 'costs from costsV2');
    }
    
    // DEBUG: Log costs array structure
    if (costs.length > 0) {
      console.log('  🔍 DEBUG: costs array has', costs.length, 'items');
      console.log('  🔍 DEBUG: First cost item:', JSON.stringify(costs[0]));
      console.log('  🔍 DEBUG: All unique paymentTypes:', [...new Set(costs.map(c => c.paymentType))].join(', '));
    } else {
      console.log('  ⚠️  WARNING: No costs found in either priceDetails.items or costsV2');
    }
    
    // Services checks
    if (criteria.hasIncludedCosts) {
      // INCLUDED costs can be either 'INCLUDED' or 'MANDATORY_FREE' (both are included in price)
      const hasIncluded = costs.some(c => c.paymentType === 'INCLUDED' || c.paymentType === 'MANDATORY_FREE');
      console.log('  💼 Included Costs check:', hasIncluded);
      console.log('  🔍 DEBUG: Costs with INCLUDED:', costs.filter(c => c.paymentType === 'INCLUDED').length);
      console.log('  🔍 DEBUG: Costs with MANDATORY_FREE:', costs.filter(c => c.paymentType === 'MANDATORY_FREE').length);
      if (!hasIncluded) {
        console.log('    ❌ FAILED included costs check');
          return false;
        }
      console.log('    ✅ PASSED included costs check');
    }
    
    if (criteria.hasMandatoryCosts) {
      // Check for MANDATORY or MANDATORY_FREE (both are mandatory costs)
      const hasMandatory = costs.some(c => c.paymentType === 'MANDATORY' || c.paymentType === 'MANDATORY_FREE');
      console.log('  💼 Mandatory Costs check:', hasMandatory);
      console.log('  🔍 DEBUG: Costs with MANDATORY:', costs.filter(c => c.paymentType === 'MANDATORY').length);
      console.log('  🔍 DEBUG: Costs with MANDATORY_FREE:', costs.filter(c => c.paymentType === 'MANDATORY_FREE').length);
      console.log('  🔍 DEBUG: All paymentTypes found:', [...new Set(costs.map(c => c.paymentType))]);
      if (!hasMandatory) {
        console.log('    ❌ FAILED mandatory costs check');
        return false;
      }
      console.log('    ✅ PASSED mandatory costs check');
    }
    
    if (criteria.hasSelectableCosts) {
      // SELECTABLE = OPTIONAL in costsV2 (excludes FREE variants)
      console.log('  🔍 DEBUG: Sample costs with paymentType:', costs.slice(0, 3).map(c => ({label: c.label, paymentType: c.paymentType})));
      
      const hasSelectable = costs.some(c => c.paymentType === 'SELECTABLE' || c.paymentType === 'OPTIONAL');
      console.log('  💼 Selectable Costs check:', hasSelectable);
      console.log('  🔍 DEBUG: Costs with OPTIONAL:', costs.filter(c => c.paymentType === 'OPTIONAL').length);
      console.log('  🔍 DEBUG: Costs with OPTIONAL_FREE:', costs.filter(c => c.paymentType === 'OPTIONAL_FREE').length);
      console.log('  🔍 DEBUG: Costs with SELECTABLE:', costs.filter(c => c.paymentType === 'SELECTABLE').length);
      
      // Check actual paymentType values
      const actualTypes = costs.filter(c => c.label && c.label.toLowerCase().includes('air')).map(c => ({label: c.label, type: c.paymentType}));
      if (actualTypes.length > 0) {
        console.log('  🔍 DEBUG: Air conditioning cost has paymentType:', actualTypes[0].type);
      }
      
      if (!hasSelectable) {
        console.log('    ❌ FAILED selectable costs check');
        return false;
      }
      console.log('    ✅ PASSED selectable costs check');
    }
    
    if (criteria.hasFreeSelectableCosts) {
      // Free selectable = OPTIONAL_FREE or OPTIONAL with price 0
      const hasFreeSelectable = costs.some(c => 
        c.paymentType === 'OPTIONAL_FREE' ||
        (c.paymentType === 'OPTIONAL' && c.price?.amount === 0) ||
        c.paymentType === 'SELECTABLE_FREE' ||
        (c.paymentType === 'SELECTABLE' && c.price?.amount === 0)
      );
      console.log('  💼 Free Selectable Costs check:', hasFreeSelectable);
      console.log('  🔍 DEBUG: Costs with OPTIONAL_FREE:', costs.filter(c => c.paymentType === 'OPTIONAL_FREE').length);
      console.log('  🔍 DEBUG: Costs with OPTIONAL (price=0):', costs.filter(c => c.paymentType === 'OPTIONAL' && c.price?.amount === 0).length);
      if (!hasFreeSelectable) {
        console.log('    ❌ FAILED free selectable costs check');
        return false;
      }
      console.log('    ✅ PASSED free selectable costs check');
    }
    
    if (criteria.hasOnsiteCosts) {
      // ON_SITE = OPTIONAL_ON_SPOT or MANDATORY_ON_SPOT in costsV2
      const hasOnsite = costs.some(c => 
        c.paymentType === 'ON_SITE' || 
        c.paymentType === 'ONSITE' ||
        c.paymentType === 'OPTIONAL_ON_SPOT' ||
        c.paymentType === 'MANDATORY_ON_SPOT'
      );
      console.log('  💼 On-site Costs check:', hasOnsite);
      console.log('  🔍 DEBUG: Costs with OPTIONAL_ON_SPOT:', costs.filter(c => c.paymentType === 'OPTIONAL_ON_SPOT').length);
      console.log('  🔍 DEBUG: Costs with MANDATORY_ON_SPOT:', costs.filter(c => c.paymentType === 'MANDATORY_ON_SPOT').length);
      if (!hasOnsite) {
        console.log('    ❌ FAILED on-site costs check');
        return false;
      }
      console.log('    ✅ PASSED on-site costs check');
    }
    
    if (criteria.hasMandatoryOnsiteCosts) {
      // Mandatory on-site = MANDATORY_ON_SPOT in costsV2
      const hasMandatoryOnsite = costs.some(c => 
        c.paymentType === 'MANDATORY_ON_SITE' || 
        c.paymentType === 'MANDATORY_ONSITE' ||
        c.paymentType === 'MANDATORY_ON_SPOT'
      );
      console.log('  💼 Mandatory On-site Costs check:', hasMandatoryOnsite);
      console.log('  🔍 DEBUG: Costs with MANDATORY_ON_SPOT:', costs.filter(c => c.paymentType === 'MANDATORY_ON_SPOT').length);
      if (!hasMandatoryOnsite) {
        console.log('    ❌ FAILED mandatory on-site costs check');
        return false;
      }
      console.log('    ✅ PASSED mandatory on-site costs check');
    }
    
    // Tourist Tax checks
    if (criteria.hasTouristTax) {
      // Tourist tax in price = TAX (not TAX_ON_SPOT)
      const hasTouristTax = costs.some(c => 
        (c.costType === 'TOURIST_TAX' && c.paymentType !== 'ON_SITE' && c.paymentType !== 'MANDATORY_ON_SITE' && c.paymentType !== 'TAX_ON_SPOT') ||
        (c.paymentType === 'TAX' && c.paymentType !== 'TAX_ON_SPOT')
      );
      console.log('  🏖️  Tourist Tax (in price) check:', hasTouristTax);
      console.log('  🔍 DEBUG: Costs with TAX:', costs.filter(c => c.paymentType === 'TAX').length);
      if (!hasTouristTax) {
        console.log('    ❌ FAILED tourist tax check');
        return false;
      }
      console.log('    ✅ PASSED tourist tax check');
    }
    
    if (criteria.hasTouristTaxOnSite) {
      // Tourist tax on-site = TAX_ON_SPOT in costsV2
      const hasTouristTaxOnsite = costs.some(c => 
        (c.costType === 'TOURIST_TAX' && (c.paymentType === 'ON_SITE' || c.paymentType === 'MANDATORY_ON_SITE')) ||
        c.paymentType === 'TAX_ON_SPOT'
      );
      console.log('  🏖️  Tourist Tax (on-site) check:', hasTouristTaxOnsite);
      console.log('  🔍 DEBUG: Costs with TAX_ON_SPOT:', costs.filter(c => c.paymentType === 'TAX_ON_SPOT').length);
      if (!hasTouristTaxOnsite) {
        console.log('    ❌ FAILED tourist tax on-site check');
        return false;
      }
      console.log('    ✅ PASSED tourist tax on-site check');
    }
    
    // Deposit checks (OPTIONAL - deposits might not be in costs array)
    if (criteria.hasDeposit) {
      const hasDeposit = costs.some(c => c.costType === 'SECURITY_DEPOSIT' && c.paymentType !== 'ON_SITE' && c.paymentType !== 'MANDATORY_ON_SITE');
      console.log('  💰 Deposit (in price) check:', hasDeposit);
      if (!hasDeposit) {
        console.log('    ⚠️  Deposit not found in Live API costs - trusting Static DB (deposits not always in costs array)');
        // Don't fail - deposits might be stored separately, trust Static DB
      } else {
        console.log('    ✅ PASSED deposit check');
      }
    }
    
    if (criteria.hasDepositOnsite) {
      const hasDepositOnsite = costs.some(c => c.costType === 'SECURITY_DEPOSIT' && (c.paymentType === 'ON_SITE' || c.paymentType === 'MANDATORY_ON_SITE'));
      console.log('  💰 Deposit (on-site) check:', hasDepositOnsite);
      if (!hasDepositOnsite) {
        console.log('    ⚠️  Deposit on-site not found in Live API costs - trusting Static DB (deposits not always in costs array)');
        // Don't fail - deposits might be stored separately, trust Static DB
      } else {
        console.log('    ✅ PASSED deposit on-site check');
      }
    }
    
    // NEGATIVE FLAGS VALIDATION (Exclude properties that HAVE these features)
    
    // Services negative checks
    if (criteria.hasIncludedCosts_negative) {
      const hasIncluded = costs.some(c => c.paymentType === 'INCLUDED' || c.paymentType === 'MANDATORY_FREE');
      console.log('  💼 Included Costs (negative) check - has:', hasIncluded);
      if (hasIncluded) {
        console.log('    ❌ FAILED - property HAS included costs (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have included costs');
    }
    
    if (criteria.hasMandatoryCosts_negative) {
      const hasMandatory = costs.some(c => c.paymentType === 'MANDATORY' || c.paymentType === 'MANDATORY_FREE');
      console.log('  💼 Mandatory Costs (negative) check - has:', hasMandatory);
      if (hasMandatory) {
        console.log('    ❌ FAILED - property HAS mandatory costs (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have mandatory costs');
    }
    
    if (criteria.hasSelectableCosts_negative) {
      const hasSelectable = costs.some(c => c.paymentType === 'SELECTABLE' || c.paymentType === 'OPTIONAL');
      console.log('  💼 Selectable Costs (negative) check - has:', hasSelectable);
      if (hasSelectable) {
        console.log('    ❌ FAILED - property HAS selectable costs (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have selectable costs');
    }
    
    if (criteria.hasFreeSelectableCosts_negative) {
      const hasFreeSelectable = costs.some(c => 
        c.paymentType === 'OPTIONAL_FREE' ||
        (c.paymentType === 'OPTIONAL' && c.price?.amount === 0) ||
        c.paymentType === 'SELECTABLE_FREE' ||
        (c.paymentType === 'SELECTABLE' && c.price?.amount === 0)
      );
      console.log('  💼 Free Selectable Costs (negative) check - has:', hasFreeSelectable);
      if (hasFreeSelectable) {
        console.log('    ❌ FAILED - property HAS free selectable costs (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have free selectable costs');
    }
    
    if (criteria.hasOnsiteCosts_negative) {
      const hasOnsite = costs.some(c => 
        c.paymentType === 'ON_SITE' ||
        c.paymentType === 'OPTIONAL_ON_SPOT' ||
        c.paymentType === 'MANDATORY_ON_SPOT'
      );
      console.log('  💼 On-site Costs (negative) check - has:', hasOnsite);
      if (hasOnsite) {
        console.log('    ❌ FAILED - property HAS on-site costs (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have on-site costs');
    }
    
    if (criteria.hasMandatoryOnsiteCosts_negative) {
      const hasMandatoryOnsite = costs.some(c => 
        c.paymentType === 'MANDATORY_ON_SITE' ||
        c.paymentType === 'MANDATORY_ON_SPOT'
      );
      console.log('  💼 Mandatory On-site Costs (negative) check - has:', hasMandatoryOnsite);
      if (hasMandatoryOnsite) {
        console.log('    ❌ FAILED - property HAS mandatory on-site costs (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have mandatory on-site costs');
    }
    
    // Tourist Tax negative checks
    if (criteria.hasTouristTax_negative) {
      const hasTouristTax = costs.some(c => 
        (c.costType === 'TOURIST_TAX' && c.paymentType !== 'ON_SITE' && c.paymentType !== 'MANDATORY_ON_SITE' && c.paymentType !== 'TAX_ON_SPOT') ||
        (c.paymentType === 'TAX' && c.paymentType !== 'TAX_ON_SPOT')
      );
      console.log('  🏖️  Tourist Tax (negative) check - has:', hasTouristTax);
      if (hasTouristTax) {
        console.log('    ❌ FAILED - property HAS tourist tax in price (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have tourist tax in price');
    }
    
    if (criteria.hasTouristTaxOnSite_negative) {
      const hasTouristTaxOnsite = costs.some(c => 
        (c.costType === 'TOURIST_TAX' && (c.paymentType === 'ON_SITE' || c.paymentType === 'MANDATORY_ON_SITE')) ||
        c.paymentType === 'TAX_ON_SPOT'
      );
      console.log('  🏖️  Tourist Tax On-site (negative) check - has:', hasTouristTaxOnsite);
      if (hasTouristTaxOnsite) {
        console.log('    ❌ FAILED - property HAS tourist tax on-site (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have tourist tax on-site');
    }
    
    // Deposit negative checks
    if (criteria.hasDeposit_negative) {
      const hasDeposit = costs.some(c => c.costType === 'SECURITY_DEPOSIT' && c.paymentType !== 'ON_SITE' && c.paymentType !== 'MANDATORY_ON_SITE');
      console.log('  💰 Deposit (negative) check - has:', hasDeposit);
      if (hasDeposit) {
        console.log('    ❌ FAILED - property HAS deposit in price (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have deposit in price');
    }
    
    if (criteria.hasDepositOnsite_negative) {
      const hasDepositOnsite = costs.some(c => c.costType === 'SECURITY_DEPOSIT' && (c.paymentType === 'ON_SITE' || c.paymentType === 'MANDATORY_ON_SITE'));
      console.log('  💰 Deposit On-site (negative) check - has:', hasDepositOnsite);
      if (hasDepositOnsite) {
        console.log('    ❌ FAILED - property HAS deposit on-site (should not)');
        return false;
      }
      console.log('    ✅ PASSED - property does NOT have deposit on-site');
    }
  }
  
  // Check payment type criteria
  if (criteria.paymentType) {
    const livePaymentType = detectPaymentType(availResponse);
    if (livePaymentType !== criteria.paymentType) return false;
  }
  
  return true;
}

// Detect payment type from live API response
function detectPaymentType(availResponse) {
  const isExpressBookable = availResponse?.isExpressBookable || false;
  const isInstantBookable = availResponse?.isInstantBookable || false;
  
  // On-Request: expressBookable but NOT instantBookable
  if (isExpressBookable && !isInstantBookable) {
    return 'On-Request';
  }
  
  const paymentDetails = availResponse?.paymentDetails;
  if (!paymentDetails) return null;
  
  const instantPaymentMethod = paymentDetails.instantPaymentMethod;
  
  // TOMAS
  if (instantPaymentMethod?.type === 'TOMAS_LIGHTBOX') {
    return 'TOMAS';
  }
  
  // ADYEN
  if (instantPaymentMethod?.type === 'ADYEN') {
    return 'ADYEN';
  }
  
  // PCI-based
  if (instantPaymentMethod?.type?.includes('PCI')) {
    const isSelectable = paymentDetails.isSelectable;
    const paymentMethods = paymentDetails.paymentMethods || [];
    
    // PCI Multiple: Must be PCI_PROXY + selectable + multiple payment methods
    if (instantPaymentMethod.type === 'PCI_PROXY' && isSelectable && paymentMethods.length > 1) {
      return 'PCI Multiple';
    } else if (instantPaymentMethod.type === 'PCI_PROXY' && instantPaymentMethod.isUse3ds) {
      return 'PCI CC';
    }
  }
  
  // Selectable/Non-Selectable/Single
  if (paymentDetails.isSelectable) {
    return 'Selectable';
  } else if (paymentDetails.paymentMethods?.length > 1) {
    return 'Non-Selectable';
  } else {
    return 'Single';
  }
}

// Search offers-discounts ES index for properties with specific discounts
async function searchOffersDiscounts(criteria) {
  try {
    console.log('🎁 Searching offers-discounts index for discount criteria...');
    
    // Map UI discount names to ES discountType values
    const discountTypeMap = {
      hasEarlyBirdDiscount: 'EARLY_BIRD',
      hasMobileDiscount: 'DEVICE_SPECIFIC', // Special case: needs deviceType filter
      hasLastMinuteDiscount: 'LAST_MINUTE',
      hasNewListingDiscount: 'NEW_LISTING',
      hasOfferDiscount: 'OFFER',
      hasProviderDifferenceDiscount: 'PROVIDER_DIFFERENCE',
      hasSpecialDealDiscount: 'SPECIAL_DEAL',
      hasWeeklyDiscount: 'LONG_STAY', // ES uses LONG_STAY, Live API uses WEEKLY_DISCOUNT
      hasLoyaltyDiscount: 'LOYALTY',
      hasEarlyBirdNonBookiply: 'EARLY_BIRD', // Same discount type, different provider filter
      hasLastMinuteNonBookiply: 'LAST_MINUTE' // Same discount type, different provider filter
    };
    
    // Find which discount type is requested
    let discountType = null;
    let criteriaKey = null;
    for (const [key, esType] of Object.entries(discountTypeMap)) {
      if (criteria[key]) {
        discountType = esType;
        criteriaKey = key;
        console.log(`  Searching for discount type: ${esType} (criteria: ${key})`);
        break;
      }
    }
    
    if (!discountType) {
      console.log('  No specific discount type found in criteria');
      return [];
    }
    
    // Build ES query
    const filters = [];
    filters.push({ term: { discountType: { value: discountType } } });
    
    // Special handling for mobile discount (DEVICE_SPECIFIC)
    if (criteria.hasMobileDiscount) {
      filters.push({ term: { deviceType: { value: 'MOBILE' } } });
    }
    
    // Special handling for Non-Holidu Home (Non-BOOKIPLY) discounts
    if (criteria.hasEarlyBirdNonBookiply || criteria.hasLastMinuteNonBookiply) {
      // Exclude BOOKIPLY provider - offers-discounts index has provider field
      filters.push({
        bool: {
          must_not: [
            { term: { provider: { value: 'BOOKIPLY' } } }
          ]
        }
      });
      console.log('  Excluding BOOKIPLY provider (Non-Holidu Home)');
    }
    
    const body = {
      query: { 
        function_score: {
          query: { bool: { filter: filters } },
          random_score: {
            seed: Date.now(), // Different results each time
            field: "_seq_no"
          }
        }
      },
      _source: ['offerId', 'discountType', 'discountPercentage', 'timestamp', 'provider'],
      size: 500 // Increased from 100 to get more variety
    };
    
    console.log('  offers-discounts query:', JSON.stringify(body, null, 2));
    
    // Save discount query to storage
    const queryLog = {
      timestamp: new Date().toISOString(),
      index: 'offers-discounts',
      query: body,
      criteria: criteria
    };
    
    chrome.storage.local.get(['esQueryLogs'], function(result) {
      const logs = result.esQueryLogs || [];
      logs.push(queryLog);
      if (logs.length > 50) logs.shift();
      chrome.storage.local.set({ esQueryLogs: logs });
    });
    
    const { ids, hits, error } = await window.esSearch('offers-discounts', body);
    
    if (error) {
      console.warn('  ⚠️ offers-discounts search error:', error);
      return [];
    }
    
    // Note: offers-discounts uses 'offerId' field, not 'id', so we extract from hits directly
    if (hits && hits.length > 0) {
      // Extract unique property IDs (offerId field)
      const propertyIds = [...new Set(hits.map(h => h._source?.offerId).filter(id => id))];
      console.log(`  ✅ Found ${propertyIds.length} unique properties with ${discountType} from ${hits.length} offer records`);
      return propertyIds;
    }
    
    console.log(`  ⚠️ No properties found with ${discountType}`);
    return [];
    
  } catch (error) {
    console.error('❌ searchOffersDiscounts error:', error.message);
    return [];
  }
}

async function runEsSearch(criteria){
  try {
    // First, try offers-discounts if discount criteria is present
    const needsDiscountSearch = criteria.hasEarlyBirdDiscount || 
                                 criteria.hasMobileDiscount || 
                                 criteria.hasLastMinuteDiscount || 
                                 criteria.hasNewListingDiscount || 
                                 criteria.hasEarlyBirdNonBookiply ||
                                 criteria.hasLastMinuteNonBookiply || 
                                 criteria.hasOfferDiscount || 
                                 criteria.hasProviderDifferenceDiscount || 
                                 criteria.hasSpecialDealDiscount ||
                                 criteria.hasWeeklyDiscount ||
                                 criteria.hasLoyaltyDiscount;
    
    if (needsDiscountSearch) {
      const discountIds = await searchOffersDiscounts(criteria);
      if (discountIds && discountIds.length > 0) {
        console.log(`🎁 Using ${discountIds.length} IDs from offers-discounts`);
        return discountIds;
      }
      console.log('⚠️ No results from offers-discounts (might be ES down or VPN off)');
      
      // For OFFER and PROVIDER_DIFFERENCE, if offers-discounts is empty, 
      // get random properties from detailed-apartments for Live API validation
      if (criteria.hasOfferDiscount || criteria.hasProviderDifferenceDiscount) {
        console.log('🔄 OFFER/PROVIDER_DIFFERENCE not in offers-discounts index');
        console.log('🔄 Will try detailed-apartments for Live API validation');
        // Continue to detailed-apartments with base filters only (no discount filters)
      } else {
        console.log('⚠️ offers-discounts failed - will skip detailed-apartments and use Static DB directly');
        // Skip detailed-apartments and return empty to trigger Static DB fallback
        return [];
      }
    }
    
    // Continue with detailed-apartments search for other criteria
    const filters = [];
    
    // Always include base filters
    filters.push({ term: { isDeleted: { value: false } } });
    filters.push({ term: { searchable: { value: true } } });
    
    // Support wildcard/partial matching for provider
    if (criteria.provider) {
      // Convert to uppercase since ES provider field is uppercase
      const providerUpper = criteria.provider.toUpperCase();
      
      if (criteria.providerPartialMatch) {
        // Use wildcard query for partial matching
        filters.push({ 
          wildcard: { 
            provider: { 
              value: `*${providerUpper}*`
            } 
          } 
        });
      } else {
        // Exact match
        filters.push({ term: { provider: { value: providerUpper } } });
      }
    }
    
    // Handle multi-unit filter (checks externalGroupId exists)
    if (criteria.isMultiUnit) {
      filters.push({ exists: { field: "externalGroupId" } });
      // When multi-unit is selected, exclude properties with parent structure
      // (to get only flat multi-unit properties without hierarchical units)
      filters.push({
        bool: {
          should: [
            { bool: { must_not: { exists: { field: "supportsParentUnitStructure" } } } },
            { term: { supportsParentUnitStructure: { value: false } } }
          ]
        }
      });
    }
    
    // Handle supportsParentUnitStructure (positive only, no toggle)
    // Note: This is ignored if isMultiUnit is checked (multi-unit excludes parent structure)
    if (criteria.supportsParentUnitStructure && !criteria.isMultiUnit) {
      filters.push({ term: { supportsParentUnitStructure: { value: true } } });
    }

    const body = {
      query: { 
        function_score: {
          query: { bool: { filter: filters } },
          random_score: {
            seed: Date.now(), // Different results each time
            field: "_seq_no"
          }
        }
      },
      _source: ["id", "provider"],
      size: 500 // Increased from 50 to get more variety
    };

    console.log("ES query:", JSON.stringify(body, null, 2));

    // Save ES query to storage for logs viewer
    const queryLog = {
      timestamp: new Date().toISOString(),
      index: 'detailed-apartments',
      query: body,
      criteria: criteria
    };
    
    // Storage mein save (non-blocking)
    chrome.storage.local.get(['esQueryLogs'], function(result) {
      const logs = result.esQueryLogs || [];
      logs.push(queryLog);
      // Sirf last 50 queries rakhenge
      if (logs.length > 50) logs.shift();
      chrome.storage.local.set({ esQueryLogs: logs });
    });

    // Try detailed-apartments first
    const { ids, hits, error } = await window.esSearch("detailed-apartments", body);
    console.log(`ES returned ${ids?.length || 0} results from detailed-apartments`);
    
    if (error) {
      console.warn("ES error:", error);
    }

    if (ids && ids.length) {
      return ids;
    }

    // Backstop to generic apartments index
    console.log("Trying apartments index as backstop...");
    const { ids: ids2 } = await window.esSearch("apartments", body);
    console.log(`ES returned ${ids2?.length || 0} results from apartments`);
    
    return ids2 || [];
  } catch (e) {
    console.error("ES search failed:", e?.message, e);
    return [];
  }
}

async function resolveViaLiveApi(candidates, criteria){
  console.log(`🔍 Resolving via Live API - checking ${Math.min(candidates.length, 100)} candidates...`);
  
  // Randomize the order to avoid always trying the same properties first
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const capped = shuffled.slice(0, 100); // Increased from 50 to 100 for more variety
  console.log(`🔀 Randomized candidate order: [${capped.slice(0, 5).join(', ')}${capped.length > 5 ? ', ...' : ''}]`);
  
  let attemptCount = 0;
  
  for (const id of capped){
    attemptCount++;
    console.log(`  Attempt ${attemptCount}/${capped.length}: Checking property ${id}...`);
    
    try {
      // Check if property is already quarantined
      if (unavailableProperties?.find(p => p.id === id)) {
        console.log(`  ⏭️  Skipping property ${id} - already in quarantine database`);
        continue;
      }

      const availRes = await fetch("https://api.holidu.com/search/v1/offers/" + id + "/availability?domainId=1&locale=en-IE");
      if (!availRes.ok) {
        console.log(`  ❌ Property ${id} - availability API failed`);
        continue;
      }
      const avail = await availRes.json();
      const checkin = avail?.checkinDates?.[0];
      const checkout = checkin ? avail.firstPossibleCheckout[checkin] : null;
      
      // Check if property has NO availability at all
      if (!checkin || !avail?.checkinDates || avail.checkinDates.length === 0) {
        // Fetch property details to check if it's a test property
        const detailsRes = await fetch("https://api.holidu.com/rest/v6.2/search/offers/" + id + "?domainId=1&locale=en-IE");
        let provider = null;
        let isTestProperty = false;
        if (detailsRes.ok) {
          const details = await detailsRes.json();
          provider = details?.provider?.id || null;
        }
        
        // Check if this is a test property (already in main DB with isTestProperty flag)
        const existingProp = properties?.find(p => p.id === id);
        isTestProperty = existingProp?.isTestProperty === true;
        
        if (isTestProperty) {
          console.log(`🧪 Property ${id} is a test property - skipping quarantine (test properties are always kept)`);
          continue; // Don't quarantine test properties
        }
        
        console.log(`🚫 Property ${id} has no availability - quarantining`);
        await saveToUnavailableDatabase(id, provider, "no_availability");
        continue;
      }
      
      if (!checkout) continue;

      // Pricing
      const priceRes = await fetch("https://api.holidu.com/old/rest/v6/search/offers/" + id + "/prices?domainId=1&locale=en-IE&currency=EUR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkin,
          checkout,
          adults: [{ age: null }, { age: null }],
          kids: [],
          selectedOptions: [],
          paymentMethod: null
        })
      });
      if (!priceRes.ok) continue;
      const price = await priceRes.json();

      // Fetch property details for provider info
      const detailsRes = await fetch("https://api.holidu.com/rest/v6.2/search/offers/" + id + "?domainId=1&locale=en-IE");
      let provider = null;
      let supportsParentUnitStructure = false;
      let isMultiunit = false;
      if (detailsRes.ok) {
        const details = await detailsRes.json();
        provider = details?.provider?.id || null;
        supportsParentUnitStructure = details?.supportsParentUnitStructure || false;
        isMultiunit = details?.isMultiunit || false;
        
        // Validate multi-unit filter
        if (criteria.isMultiUnit) {
          if (!isMultiunit) {
            console.log(`  ⏭️  Property ${id} - not a true multi-unit (isMultiunit: false)`);
            continue;
          }
          // When multi-unit is selected, exclude parent structure properties
          if (supportsParentUnitStructure) {
            console.log(`  ⏭️  Property ${id} - has parent structure (excluded by multi-unit filter)`);
            continue;
          }
        }
      }

      // Validate all criteria using matchesLiveCriteria (checks discounts, services, tax, deposits)
      const liveMatches = matchesLiveCriteria(price, criteria, avail);
      if (!liveMatches) {
        console.log(`  ⏭️  Property ${id} - failed live criteria validation`);
        continue;
      }

      // Additional dynamic checks
      if (criteria.paymentType){
        const p = price?.paymentDetails;
        
        // Check for On-Request (isExpressBookable: true, isInstantBookable: false)
        const isOnRequest = avail?.isExpressBookable === true && avail?.isInstantBookable === false;
        
        const type = isOnRequest ? 'On-Request' :
          p?.instantPaymentMethod?.type === 'ADYEN' ? 'ADYEN' :
          p?.instantPaymentMethod?.type === 'TOMAS_LIGHTBOX' ? 'TOMAS' :
          (p?.instantPaymentMethod?.type === 'PCI_PROXY' && p?.paymentMethods?.length > 1) ? 'PCI Multiple' :
          (p?.instantPaymentMethod?.type === 'PCI_PROXY') ? 'PCI CC' :
          p?.isSelectable ? 'Selectable' :
          (p?.paymentMethods?.length > 1 ? 'Non-Selectable' : 'Single');
        if (type !== criteria.paymentType) continue;
      }

      // Note: Services/Tax/Deposit checks (both positive and negative) are now handled by matchesLiveCriteria above
      // Multi-unit checks are handled by ES query filters (isMultiUnit, supportsParentUnitStructure)

      // ✅ Save this property to properties.json for future fallback
      await savePropertyToDatabase(id, price, provider, supportsParentUnitStructure, avail);

      console.log(`✅ Found valid property ${id} with availability!`);
      return id; // first valid
    } catch (error) {
      console.log(`  ❌ Property ${id} - error during processing:`, error.message);
    }
  }
  
  console.log(`❌ No valid properties found after checking ${attemptCount} candidates`);
  return null;
}

// Helper function to extract property stats and save to properties.json
async function savePropertyToDatabase(propertyId, priceResponse, provider, supportsParentUnitStructure, availabilityResponse) {
  try {
    // Check if property is quarantined (should never save unavailable properties)
    const isQuarantined = unavailableProperties?.find(p => p.id === propertyId);
    if (isQuarantined) {
      console.log(`🚫 Property ${propertyId} is quarantined, not saving to main database`);
      return;
    }

    // Check if property already exists in main database
    const existingProperty = properties.find(p => p.id === propertyId);
    if (existingProperty) {
      console.log(`Property ${propertyId} already in database, skipping save`);
      return;
    }

    console.log(`💾 Saving new property ${propertyId} to database...`);

    // Extract all property stats
    const costs = priceResponse?.rates?.REFUNDABLE?.receipt?.priceDetails?.items || [];
    
    const propertyStats = {
      id: propertyId,
      provider: provider,
      supportsParentUnitStructure: supportsParentUnitStructure,
      
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
      hasFreeCancellation: priceResponse?.rates?.REFUNDABLE?.cancellationPolicy?.hasFreeCancellation || false,
      
      // Non-refundable discount
      hasNonRefundableDiscount: (priceResponse.rates && priceResponse.rates.NON_REFUNDABLE && priceResponse.rates.REFUNDABLE) ? true : false,
      
      // Payment Type
      paymentType: (() => {
        const p = priceResponse?.paymentDetails;
        // Check for On-Request (isExpressBookable: true, isInstantBookable: false)
        const isOnRequest = availabilityResponse?.isExpressBookable === true && availabilityResponse?.isInstantBookable === false;
        
        return isOnRequest ? 'On-Request' :
               p?.instantPaymentMethod?.type === 'ADYEN' ? 'ADYEN' :
               p?.instantPaymentMethod?.type === 'TOMAS_LIGHTBOX' ? 'TOMAS' :
               (p?.instantPaymentMethod?.type === 'PCI_PROXY' && p?.paymentMethods?.length > 1) ? 'PCI Multiple' :
               (p?.instantPaymentMethod?.type === 'PCI_PROXY') ? 'PCI CC' :
               p?.isSelectable ? 'Selectable' :
               (p?.paymentMethods?.length > 1 ? 'Non-Selectable' : 'Single');
      })(),
      
      // Store booking flags for On-Request properties
      isExpressBookable: availabilityResponse?.isExpressBookable || false,
      isInstantBookable: availabilityResponse?.isInstantBookable || false
    };

    // Discounts
    if (priceResponse.rates?.REFUNDABLE?.receipt?.discountDetails?.items) {
      const discounts = priceResponse.rates.REFUNDABLE.receipt.discountDetails.items;
      
      const earlyBird = discounts.find(d => d.type === 'EARLY_BIRD');
      propertyStats.hasEarlyBirdDiscount = !!earlyBird;
      propertyStats.earlyBirdPercentage = earlyBird?.percentage || 0;

      const mobile = discounts.find(d => d.type === 'MOBILE_DISCOUNT');
      propertyStats.hasMobileDiscount = !!mobile;
      propertyStats.mobilePercentage = mobile?.percentage || 0;

      const loyalty = discounts.find(d => d.type === 'LOYALTY');
      propertyStats.hasLoyaltyDiscount = !!loyalty;
      propertyStats.loyaltyPercentage = loyalty?.percentage || 0;

      const lastMinute = discounts.find(d => d.type === 'LAST_MINUTE');
      propertyStats.hasLastMinuteDiscount = !!lastMinute;
      propertyStats.lastMinutePercentage = lastMinute?.percentage || 0;

      const newListing = discounts.find(d => d.type === 'NEW_LISTING_PROMOTION');
      propertyStats.hasNewListingDiscount = !!newListing;
      propertyStats.newListingPercentage = newListing?.percentage || 0;

      const weekly = discounts.find(d => d.type === 'WEEKLY_DISCOUNT');
      propertyStats.hasWeeklyDiscount = !!weekly;
      propertyStats.weeklyPercentage = weekly?.percentage || 0;

      // Special Discount = 2 or more discounts from: Early Bird, Last Minute, Weekly, Loyalty, Mobile, New Listing
      const specialDiscountTypes = ['EARLY_BIRD', 'LAST_MINUTE', 'WEEKLY_DISCOUNT', 'LOYALTY', 'MOBILE_DISCOUNT', 'NEW_LISTING_PROMOTION'];
      const specialDiscountsCount = discounts.filter(d => specialDiscountTypes.includes(d.type)).length;
      propertyStats.hasSpecialDealDiscount = specialDiscountsCount >= 2;
      propertyStats.specialDealPercentage = discounts
        .filter(d => specialDiscountTypes.includes(d.type))
        .reduce((sum, d) => sum + (d.percentage || 0), 0);

      const offer = discounts.find(d => d.type === 'OFFER');
      propertyStats.hasOfferDiscount = !!offer;
      propertyStats.offerPercentage = offer?.percentage || 0;

      const providerDifference = discounts.find(d => d.type === 'PROVIDER_DIFFERENCE');
      propertyStats.hasProviderDifferenceDiscount = !!providerDifference;
      propertyStats.providerDifferencePercentage = providerDifference?.percentage || 0;

      propertyStats.totalDiscountPercentage = priceResponse.rates.REFUNDABLE.receipt.discountDetails.totalDiscountPercentage || 0;
    } else {
      propertyStats.hasEarlyBirdDiscount = false;
      propertyStats.earlyBirdPercentage = 0;
      propertyStats.hasMobileDiscount = false;
      propertyStats.mobilePercentage = 0;
      propertyStats.hasLoyaltyDiscount = false;
      propertyStats.loyaltyPercentage = 0;
      propertyStats.hasLastMinuteDiscount = false;
      propertyStats.lastMinutePercentage = 0;
      propertyStats.hasNewListingDiscount = false;
      propertyStats.newListingPercentage = 0;
      propertyStats.hasWeeklyDiscount = false;
      propertyStats.weeklyPercentage = 0;
      propertyStats.hasSpecialDealDiscount = false;
      propertyStats.specialDealPercentage = 0;
      propertyStats.hasOfferDiscount = false;
      propertyStats.offerPercentage = 0;
      propertyStats.hasProviderDifferenceDiscount = false;
      propertyStats.providerDifferencePercentage = 0;
      propertyStats.totalDiscountPercentage = 0;
    }

    // Board types (meal options)
    const boardTypes = new Set();
    if (priceResponse.rates) {
      Object.values(priceResponse.rates).forEach(rate => {
        if (rate.boardType) boardTypes.add(rate.boardType);
      });
    }
    propertyStats.hasBreakfast = boardTypes.has('BED_AND_BREAKFAST');
    propertyStats.hasHalfBoard = boardTypes.has('HALF_BOARD');
    propertyStats.hasFullBoard = boardTypes.has('FULL_BOARD');

    // Add to in-memory array
    properties.push(propertyStats);
    
    console.log(`✅ Property ${propertyId} saved to in-memory database`);

    // Save to chrome.storage.local for persistence
    chrome.storage.local.get(['savedProperties'], function(result) {
      const savedProperties = result.savedProperties || [];
      savedProperties.push(propertyStats);
      
      chrome.storage.local.set({ savedProperties: savedProperties }, function() {
        console.log(`💾 Property ${propertyId} persisted to chrome.storage`);
      });
    });

  } catch (error) {
    console.error(`Error saving property ${propertyId}:`, error);
  }
}

// Helper function to save unavailable properties to quarantine database
async function saveToUnavailableDatabase(propertyId, provider, reason) {
  try {
    // Check if already in either database
    const inMainDB = properties?.find(p => p.id === propertyId);
    const inUnavailableDB = unavailableProperties?.find(p => p.id === propertyId);
    
    if (inMainDB) {
      console.log(`🔄 Property ${propertyId} exists in main DB but now unavailable - moving to quarantine`);
      // Remove from main DB (gradual cleanup - option 2c)
      const index = properties.findIndex(p => p.id === propertyId);
      if (index > -1) properties.splice(index, 1);
      
      // Also remove from chrome.storage savedProperties
      chrome.storage.local.get(['savedProperties'], function(result) {
        if (result.savedProperties) {
          const filteredProps = result.savedProperties.filter(p => p.id !== propertyId);
          chrome.storage.local.set({ savedProperties: filteredProps });
        }
      });
    }
    
    if (inUnavailableDB) {
      console.log(`🚫 Property ${propertyId} already in unavailable database, skipping`);
      return;
    }

    console.log(`🚫 Quarantining property ${propertyId} - Reason: ${reason}`);

    const unavailableEntry = {
      id: propertyId,
      provider: provider,
      reason: reason,
      quarantinedAt: new Date().toISOString()
    };

    // Add to in-memory unavailable array
    if (unavailableProperties) {
      unavailableProperties.push(unavailableEntry);
    }
    
    console.log(`❌ Property ${propertyId} added to unavailable database`);

    // Save to chrome.storage.local for persistence
    chrome.storage.local.get(['unavailableProperties'], function(result) {
      const unavailableProps = result.unavailableProperties || [];
      unavailableProps.push(unavailableEntry);
      
      chrome.storage.local.set({ unavailableProperties: unavailableProps }, function() {
        console.log(`💾 Property ${propertyId} persisted to unavailable database`);
      });
    });

  } catch (error) {
    console.error(`Error quarantining property ${propertyId}:`, error);
  }
  }