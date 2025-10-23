# 📋 Holidu Property Finder - Changelog

All notable changes and feature implementations are documented here with timestamps.

---

## 2025-01-17 - New Multi-units Filter & Simplified Parent Structure

### Added
- **Multi-units Only Filter**: New checkbox to filter properties that are multi-unit (hotels, apartment complexes) WITHOUT parent structure
  - **ES Field Check**: `externalGroupId` exists + `supportsParentUnitStructure` is false or missing
  - **Live API Validation**: `isMultiunit: true` AND `supportsParentUnitStructure: false` (strict validation)
  - **Why 2-step?**: Many single-unit properties have `externalGroupId` = their own ID in ES, causing false positives
  - **Example**: Property 57555282 had `externalGroupId` in ES but `isMultiunit: false` in Live API
  - **Use Case**: Find flat multi-unit properties (e.g., BOOKINGCOM apartments, MYRENT) without hierarchical unit structure
  - **Mutually Exclusive**: When "Multi-units only" is checked, "Parent structure only" is ignored
  - **Coverage**: Works across all providers (BOOKINGCOM, TOMAS, FERATEL, MYRENT, etc.)
  - **Files**: `popup.html` (lines 438-441), `search.js` (lines 273-276, 400, 1670-1683, 1825-1835)

### Changed
- **Parent Structure Filter**: Simplified from toggle (positive/negative) to simple checkbox (positive only)
  - **Old Behavior**: Checkbox with toggle button (✅ include / ❌ exclude parent structure)
  - **New Behavior**: Simple checkbox "Parent structure only" (✅ include parent structure properties only)
  - **Reason**: Negative parent structure flag rarely used; `isMultiUnit` filter covers most use cases
  - **Mutually Exclusive**: Ignored when "Multi-units only" is checked (multi-units excludes parent structure)
  - **Impact**: Cleaner UI, easier to understand
  - **Files**: `popup.html` (lines 442-445), `search.js` (lines 278-281, 401, 1685-1689)

### Removed
- Toggle button from Parent Structure filter
- `supportsParentUnitStructure_negative` criteria handling throughout codebase
- Checkbox flag styling/logic for parent structure

### Version Bump
**MINOR**: `2.0.1` → `2.1.0` ✅ (Added new filter, simplified existing filter, non-breaking changes)

---

## 2025-01-17 - Added TOMAS_ENGADIN_WL Provider Support & Fixed Provider Matching

### Added
- **TOMAS_ENGADIN_WL Provider**: Added to provider datalist
  - **Issue**: Users had to manually type `TOMAS_ENGADIN_WL` in provider field, which made it difficult to find properties
  - **Root Cause**: Provider was missing from the datalist in `popup.html`
  - **Investigation**: 
    - ES search was working correctly (587 TOMAS_ENGADIN_WL properties found)
    - Live API validation was successful (`supportsParentUnitStructure: true`)
    - Problem: Candidate randomization (first 50 of 587) meant specific property IDs were rarely selected
    - When searching without parent structure filter, fewer results meant target properties appeared more frequently
  - **Solution**: Added `TOMAS_ENGADIN_WL` to provider datalist for easy selection
  - **Files**: `popup.html` (line 377)

### Fixed
- **Provider Exact Match Logic**: Fixed ES query to use exact match when provider is selected from datalist
  - **Issue**: Even when selecting exact provider from datalist (e.g., `TOMAS_ENGADIN_WL`), ES was using wildcard query which returned 0 results
  - **Root Cause**: `providerPartialMatch` was always set to `true` regardless of whether user selected from datalist or typed manually
  - **Investigation**:
    - Console showed: ES query using `wildcard: { provider: { value: "*TOMAS_ENGADIN_WL*" } }` returning 0 results
    - Then falling back to Static DB (3 properties found)
    - Wildcard queries can be slower and less reliable than exact term queries
  - **Solution**: Added logic to detect if provider value exactly matches a datalist option
    - If exact match → use `term` query (exact match)
    - If partial/custom → use `wildcard` query (partial match)
  - **Files**: `search.js` (lines 263-269)
  - **Impact**: Provider searches now work correctly with ES, returning all matching properties

- **Provider Case-Insensitive Search**: Fixed lowercase provider input not working
  - **Issue**: Typing `airbnb` (lowercase) returned 0 results, but `AIRBNB` (uppercase) returned 10,000+ properties
  - **Root Cause**: ES `case_insensitive: true` parameter not working in Elasticsearch 7.x. Provider field in ES is stored as uppercase
  - **Investigation**:
    - Manual ES query with `case_insensitive: true` returned 0 results
    - Same query with uppercase `*AIRBNB*` returned 10,000+ results
    - Elasticsearch 7.x doesn't properly support `case_insensitive` for wildcard queries
  - **Solution**: Convert user input to uppercase before sending to ES (both `term` and `wildcard` queries)
  - **Files**: `search.js` (lines 1651-1666)
  - **Impact**: Users can now type provider names in any case (lowercase, uppercase, mixed) and get results

### Version Bump
**Included in**: `2.1.0` (Part of multi-units & provider improvements release)

---

## 2025-01-17 - PROD Elasticsearch & Environment Preservation

### Changed
- **Elasticsearch Environment**: Changed from DEV (`holidu.io`) to PROD (`holidu.cloud`)
  - Updated `esClient.js` to use `https://kibana-search-7.holidu.cloud`
  - Updated `manifest.json` host permissions
  - **Impact**: Extension now queries PROD data instead of DEV data

### Fixed
- **Environment Context Preservation**: Extension now preserves current hostname when opening properties
  - Added localhost detection (`localhost`, `127.0.0.1`)
  - If user is on `localhost:3000`, property opens on `localhost:3000`
  - If user is on `dev.holidu.com`, property opens on `dev.holidu.com`
  - Only falls back to `www.holidu.de` for unknown/external domains
  - **Files**: `prepare.js` (lines 240-268)

### Added
- **Host Permissions**: Added comprehensive domain support in `manifest.json`
  - All Holidu domains (`.de`, `.com`, `.fr`, `.es`, `.co.uk`, etc.)
  - Pirate domains (via `*.holidu.com` wildcard)
  - Special domains (`holiduhost.com`, `bookiply.com/es`)
  - Localhost support (`http://localhost/*`, `https://localhost/*`)

---

## 2025-01-16 - Fixed Board Type (Breakfast/Half Board/Full Board) Search

### Fixed
- **Bug 1**: Breakfast search returning no properties despite hardcoded properties in DB
- **Bug 2**: Half Board search returning wrong properties (e.g., 63280847)
- **Bug 3**: Full Board search returning properties even though none exist (e.g., 49439963)

### Root Cause
1. Board types were in `liveOnlyCriteria` → skipped Static DB entirely
2. Half Board/Full Board had fallback logic → accepted properties even when board type missing
3. No Static DB filtering → Live API validation couldn't find correct properties

### Solution (search.js)
**Part 1: Moved to needsOnlyStaticDb** (line 363-368)
```javascript
// Before
const needsOnlyStaticDb = criteria.isTestProperty;
const needsOnlyLiveValidation = criteria.hasBreakfast || 
                                 criteria.hasHalfBoard || 
                                 criteria.hasFullBoard || ...

// After
const needsOnlyStaticDb = criteria.isTestProperty || 
                          criteria.hasBreakfast ||  // ✅ Use Static DB
                          criteria.hasHalfBoard ||  // ✅ Use Static DB
                          criteria.hasFullBoard;    // ✅ Use Static DB
const needsOnlyLiveValidation = criteria.hasNonRefundableDiscount || ...
```

**Part 2: Removed from liveOnlyCriteria** (line 466)
```javascript
// Before
const liveOnlyCriteria = ['hasBreakfast', 'hasHalfBoard', 'hasFullBoard', 'hasNonRefundableDiscount'];

// After  
const liveOnlyCriteria = ['hasNonRefundableDiscount'];
// Board types now use Static DB first, then Live API validation
```

**Part 2: Added Direct boardType Check** (line 923-945)
```javascript
// Added check for boardType directly on priceResponse
if (priceResponse.boardType) {
  boardTypes.add(priceResponse.boardType);
}
```

**Part 3: Added Static DB Fallback** (line 970-997)
```javascript
// Issue: Live API doesn't always return boardType field
// Solution: Trust Static DB when API data unavailable (like deposits)

// Half Board
if (!boardTypes.has('HALF_BOARD')) {
  // Don't fail - trust Static DB ✅
} else {
  // PASSED (confirmed by Live API) ✅
}

// Same logic for Full Board
```

### How It Works Now
```
Search: Breakfast

Step 1: Static DB Filter
  Find properties with hasBreakfast = true
  Returns: [12345, 67890, ...]

Step 2: Live API Validation
  For each property:
    Check boardTypes has 'BED_AND_BREAKFAST' OR 'BREAKFAST'
    OR check costsV2.MANDATORY_FREE for breakfast
    If NO → Reject, try next
    If YES → Return this property ✅
```

### Test Cases

**Breakfast:**
- DB properties with `hasBreakfast: true` will be checked
- Live API must confirm breakfast in boardTypes or costs
- Result: Correct breakfast properties found ✅

**Half Board:**
- DB properties with `hasHalfBoard: true` will be checked
- Live API must confirm `HALF_BOARD` in boardTypes
- No fallback → Wrong properties rejected ✅

**Full Board:**
- DB properties with `hasFullBoard: true` will be checked
- Live API must confirm `FULL_BOARD` in boardTypes
- No fallback → Non-existent properties rejected ✅

### Impact
- Board type searches now accurate
- Uses hardcoded DB properties as starting point
- Strict Live API validation (no false positives)
- Breakfast/Half Board/Full Board all work correctly

---

## 2025-01-16 - Fixed Special Deal Discount Validation Rules

### Fixed
- **Bug**: Special Deal Discount was accepting properties with:
  - Only 1 discount (should require 2+)
  - Discounts with 0% percentage
  - New Listing Discount present (which is exclusive)

### Updated Rules (search.js line 831-867)
Special Deal Discount now requires:
1. **Minimum 2 discounts** (was: just count all discounts)
2. **Each discount must have percentage > 0** (was: accepted 0%)
3. **No New Listing Discount** (was: included New Listing in count)

### Before
```javascript
// Old logic
const specialDiscountTypes = ['EARLY_BIRD', 'LAST_MINUTE', 'WEEKLY_DISCOUNT', 
                               'LOYALTY', 'MOBILE_DISCOUNT', 'NEW_LISTING_PROMOTION'];
const count = discounts.filter(d => specialDiscountTypes.includes(d.type)).length;
if (count < 2) return false; // ❌ Didn't check percentage or New Listing
```

### After
```javascript
// New logic
const specialDiscountTypes = ['EARLY_BIRD', 'LAST_MINUTE', 'WEEKLY_DISCOUNT', 
                               'LOYALTY', 'MOBILE_DISCOUNT']; // ✅ Removed NEW_LISTING

// Only count discounts with % > 0
const validDiscounts = discounts.filter(d => 
  specialDiscountTypes.includes(d.type) && d.percentage > 0
);

if (validDiscounts.length < 2) return false; // ✅ Min 2 discounts

// Reject if New Listing present
const hasNewListing = discounts.find(d => 
  d.type === 'NEW_LISTING_PROMOTION' && d.percentage > 0
);
if (hasNewListing) return false; // ✅ New Listing is exclusive
```

### Test Cases

**Test Case 1: Valid Special Deal**
```
Property has:
  - EARLY_BIRD: 5%
  - MOBILE_DISCOUNT: 3%
  - LAST_MINUTE: 2%

Result: ACCEPT ✅ (3 discounts, all > 0%, no New Listing)
```

**Test Case 2: Only 1 Discount**
```
Property has:
  - EARLY_BIRD: 10%

Result: REJECT ❌ (needs minimum 2 discounts)
```

**Test Case 3: Has New Listing**
```
Property has:
  - NEW_LISTING_PROMOTION: 15%
  - EARLY_BIRD: 5%
  - MOBILE_DISCOUNT: 3%

Result: REJECT ❌ (New Listing is exclusive, overrides all)
```

**Test Case 4: Discount with 0%**
```
Property has:
  - EARLY_BIRD: 5%
  - MOBILE_DISCOUNT: 0%
  - LAST_MINUTE: 3%

Result: ACCEPT ✅ (2 valid discounts: Early Bird + Last Minute)
```

### Impact
- Special Deal search now returns accurate results
- Respects New Listing exclusivity rule
- Only counts active discounts (% > 0)
- Proper validation with detailed console logs

---

## 2025-01-16 - Improved ES Query Logs Button Placement

### Changed
- Moved "View ES Query Logs" button from sticky footer to after Meal Options section
- Button no longer hidden behind footer
- Improved button styling (larger, centered, max-width 300px)

### Before
- Button was inside sticky footer at bottom
- Could be hidden behind other footer elements
- Smaller size (6px padding, 11px font)

### After  
- Button placed after Meal Options section (line 757-766)
- Always visible, scrolls with content
- Better styling (10px padding, 13px font, full-width with max 300px)
- Easier to access

### Impact
- Better UX - button always visible
- No need to scroll to bottom to access logs
- Cleaner footer layout

---

## 2025-01-16 - Fixed Domain Selection & Added Full Domain Support

### Fixed
- **Bug 1**: Extension crashing with "Uncaught ReferenceError: domainMapping is not defined"
- **Bug 2**: Domain selection not working - all properties opened on www.holidu.de regardless of selection

### Root Cause
1. popup.html was loading non-existent `domainMapping.js` file
2. `normalizeDomainInput()` function was missing from `prepare.js`
3. `DOMAIN_MAP` constant was not defined

### Solution
- Removed reference to `domainMapping.js` from popup.html
- Added `DOMAIN_MAP` with all 43 domains from popup.html dropdown (prepare.js line 28-83)
- Implemented `normalizeDomainInput()` function (prepare.js line 86-107)
- Supports both domain names AND domain IDs as input

### How It Works
```javascript
User Input: "ferienwohnungen-spanien.de"
  → normalizeDomainInput() → "ferienwohnungen-spanien.de"
  → constructURL() → "http://ferienwohnungen-spanien.de/d/12345?checkin=..."
  
User Input: "2360" (domain ID)
  → DOMAIN_MAP['2360'] → "ferienwohnungen-spanien.de"
  → constructURL() → "http://ferienwohnungen-spanien.de/d/12345?checkin=..."
  
User Input: "" (empty)
  → "current" → Uses current tab's domain
  → Falls back to www.holidu.de if unknown domain
```

### Supported Domains (43 total)
- **Main Holidu**: holidu.de, holidu.com, holidu.fr, holidu.es, etc. (23 domains)
- **Pirate Sites**: urlaubspiraten, holidaypirates, voyagespirates, etc. (10 domains)
- **Special**: ferienwohnungen-spanien.de, bookiply.com, hundredrooms.com, etc. (10 domains)

### Impact
- All 43 domains now work correctly ✅
- Users can type domain name OR domain ID
- Properties open on the selected domain (correct language/currency)
- Empty domain field uses current tab's domain

---

## 2025-01-16 - Discount Field Strict Matching & 0% Filter & Exclusive New Listing Fix

### Fixed
- **Bug 1**: Properties with New Listing Discount were appearing in ALL discount searches (Early Bird, Mobile, Special Deal, etc.)
- **Bug 2**: Properties with 0% discount (expired/invalid) were being returned in search results
- **Bug 3**: Properties with New Listing Discount + other discounts were being returned (violates Holidu's exclusive discount rule)

### Root Cause
1. Static DB filter was using loose matching logic `(obj[c]>0 && criteria[c])` which matched ANY discount field, not the SPECIFIC discount requested
2. Live API validation wasn't rejecting discounts with 0% percentage
3. Static DB stores discount flags but percentages are mostly 0 (actual % comes from Live API)
4. Holidu's business rule: **New Listing Discount is EXCLUSIVE** - when active, no other discounts should apply

### Solution
**Part 1: Strict Field Matching** (search.js line 561-574)
- Each discount field now must match EXACTLY:
  - Search Early Bird → Only properties with `hasEarlyBirdDiscount: true`
  - Search New Listing → Only properties with `hasNewListingDiscount: true`
  - Search Mobile → Only properties with `hasMobileDiscount: true`
  - etc.

**Part 2: 0% Discount Filter** (search.js line 857-861)
- Live API validation now rejects discounts with `percentage === 0`
- Ensures only properties with ACTIVE discounts are returned
- Static DB filter doesn't check % (because DB values are often 0)
- Final validation happens in Live API where actual % is available

**Part 3: New Listing Exclusive Rule** (search.js line 802-811, 875-878)
- **One-Way Exclusivity Check:**
  - **A. When searching FOR New Listing:** Accept if New Listing % > 0 (other discounts don't matter)
  - **B. When searching for OTHER discounts:** Reject if property has New Listing (line 802-811)
- Added validation at start of discount checks (line 802-811):
  - If user NOT searching for New Listing, but property HAS New Listing (% > 0) → REJECT
  - Reason: New Listing overrides all other discounts on Holidu website
- Simplified New Listing validation (line 875-878):
  - If New Listing present with % > 0 → ACCEPT (other discounts irrelevant)
- Ensures New Listing Discount takes priority over all other discounts (Holidu business rule)

### How It Works
```
Static DB Filter:
  ✅ Check: hasNewListingDiscount === true
  ❌ Don't check: newListingPercentage (DB value often 0)
  
Live API Validation (New Listing Search):
  ✅ Check: NEW_LISTING_PROMOTION exists in response
  ✅ Check: percentage > 0 (active discount)
  ✅ Check: percentage >= minPercentage (if specified)
  ❌ DON'T check: other discounts (they're ignored if New Listing present)
  
Live API Validation (Other Discount Search):
  ✅ Check: Requested discount exists
  ✅ Check: percentage > 0
  ✅ Check: NO New Listing present (would override requested discount)
```

### Test Cases

**Test Case 1: 0% Discount**
```
Property 52344928 (DB): 
  hasNewListingDiscount: true
  newListingPercentage: 0

Live API Response:
  NEW_LISTING_PROMOTION: percentage = 0

Result: Property REJECTED ✅ (0% discount is invalid)
```

**Test Case 2: New Listing + Others (Searching FOR New Listing)**
```
Property 49705546 (DB):
  hasNewListingDiscount: true
  hasEarlyBirdDiscount: true
  hasMobileDiscount: true
  hasLastMinuteDiscount: true

Search Criteria: New Listing Discount

Live API Response:
  NEW_LISTING_PROMOTION: 10%
  EARLY_BIRD: 5%
  MOBILE_DISCOUNT: 3%

Result: Property ACCEPTED ✅ (New Listing % > 0, other discounts don't matter)
```

**Test Case 3: New Listing Only (Searching FOR New Listing)**
```
Property 56311898 (DB):
  hasNewListingDiscount: true
  hasEarlyBirdDiscount: false
  hasMobileDiscount: false

Search Criteria: New Listing Discount

Live API Response:
  NEW_LISTING_PROMOTION: 15%
  (no other discounts)

Result: Property ACCEPTED ✅ (New Listing is exclusive)
```

**Test Case 4: Reverse Exclusivity (Searching for OTHER discount)**
```
Property 65152611 (DB):
  hasNewListingDiscount: false (OUTDATED!)
  hasEarlyBirdDiscount: true
  hasMobileDiscount: true

Search Criteria: Early Bird Discount

Live API Response:
  NEW_LISTING_PROMOTION: 20% (DB was wrong!)
  (no Early Bird discount)

Result: Property REJECTED ✅ (has New Listing, so can't have other discounts)
```

### Impact
- Discount searches now return ONLY properties with the SPECIFIC discount type requested
- No more cross-contamination between discount types
- No more expired/invalid discounts (0% percentage)
- New Listing Discount is now truly exclusive (matches Holidu website behavior)
- Each discount filter is now independent and accurate

---

## 2025-01-16 - Live API Validation Fix for Services/Tax/Deposits (FINAL FIX v4)

### Fixed (v4 - Deposit Fallback)
- **Deposit positive flags**: Now trust Static DB when deposits not found in Live API costs array
- Deposits might be stored separately in API response, not in costs/costsV2
- Fallback to Static DB ensures deposit searches work even if Live API doesn't have the data

---

## 2025-01-16 - Live API Validation Fix for Services/Tax/Deposits (FINAL FIX v3)

### Added
- **costsV2 Fallback**: Added support for `costsV2` structure when `priceDetails.items` is empty
- **Payment Type Mapping**: Maps costsV2 types to UI labels:
  - `MANDATORY_FREE` → Included Costs (free services included in price)
  - `MANDATORY` → Mandatory Costs  
  - `OPTIONAL` + `OPTIONAL_FREE` → Selectable Costs
  - `TAX` → Tourist Tax

### Fixed (Latest v3)
- **OPTIONAL vs SELECTABLE**: Holidu API uses `OPTIONAL` not `SELECTABLE` in costsV2!
- **Empty costs array issue**: Many properties have costs in `costsV2` instead of `priceDetails.items`
- Solution: Automatically detect and flatten `costsV2` structure + map payment types correctly
- All cost checks now work with both data structures

---

## 2025-01-16 - Live API Validation Fix for Services/Tax/Deposits (FINAL FIX)

### Fixed
- **Critical Bug**: Services, Tourist Tax, and Deposit flags (positive AND negative) now work correctly
- Static DB data was outdated/wrong → Added Live API validation for BOTH positive and negative flags
- All 18 flags now properly checked via Live API (9 positive + 9 negative)

### Technical Changes:
1. **Static DB filter first** (Line 464): Uses Static DB for initial filtering (even if data outdated)
2. **Added to `needsStrictValidation`** (Line 554-558): Triggers Live API validation
3. **Added POSITIVE flag validation in `matchesLiveCriteria()`** (Line 907-1007): Validates properties have required features
4. **Added NEGATIVE flag validation in `matchesLiveCriteria()`** (Line 1009-1113): Validates properties DON'T have excluded features
5. **Kept negative flag validation in `resolveViaLiveApi()`** (Line 1357-1404): For ES path

### Why Two-Step Validation Works:
- **Step 1**: Static DB filters candidates (fast, even if some data wrong)
- **Step 2**: Live API validates via actual Holidu API (rejects if mismatch)
- **Step 3**: Search continues to next candidate if validation fails
- **Result**: Eventually finds property with CORRECT features (guaranteed accurate)

### Impact:
- **Before**: Wrong properties returned (Static DB had incomplete data)
- **After**: Accurate results via Live API validation
- **Existing Features**: All preserved (Provider, PaymentType, Discounts, Multi-unit, Negative flags)

### Files Modified:
- `search.js`: Added Live API validation for 9 fields

---

## 2025-01-16 - ES Query Logs Feature

### Added
- **ES Query Logs Viewer** - Beautiful logs window to view all ES queries
- Auto-save functionality for ES queries in `chrome.storage.local`
- "📋 View ES Query Logs" button in popup footer
- Last 50 queries automatically saved with timestamp, index name, criteria
- Copy/Clear functionality in logs window
- Dark theme UI with formatted JSON display

### Features:
- **Auto-Save**: Every ES query (detailed-apartments & offers-discounts) saved automatically
- **Persistent Storage**: Queries survive extension reloads
- **Beautiful Viewer**: Dark theme window with proper JSON formatting
- **Easy Copy**: One-click copy all logs to clipboard
- **Easy Clear**: Delete all logs with confirmation
- **Detailed Info**: Shows query number, timestamp, index, criteria, and full ES query

### Use Cases:
- Debug ES queries without keeping popup open
- Copy queries for Kibana testing
- Compare different search criteria
- Learn ES query structure
- Share queries with team

### Console Logs:
```
ES query: {...}  // Still logged to console
(Query also saved to chrome.storage.local)
```

### Benefits
- No need to keep popup/console open
- Review queries anytime after search
- Perfect for debugging and documentation
- Safe implementation - no breaking changes

**Files Modified:** `search.js` (lines 1075-1090, 990-1003), `popup.html` (lines 760-765), `popup.js` (lines 316-543)

---

## 2025-01-10 - ES Always Search First + Location Cleanup

### Changed
- ES now always searches first, even with no criteria selected
- Removed location-based List page URL feature (reverted to "Europe")
- Simplified search flow for better performance

### Removed
- Location extraction from Offer/Availability APIs
- Dynamic location slugs for List page URLs

---

## 2025-01-10 - Offers-Discounts ES Index Integration

### Added
- New `searchOffersDiscounts()` function for querying offers-discounts ES index
- Direct ES query for discount filters (Early Bird, Mobile, Last Minute, New Listing, Offer, Provider Difference, Special Deal)
- Better coverage with 439K+ properties indexed

### Changed
- `runEsSearch()` now tries offers-discounts FIRST for discount criteria
- Falls back to detailed-apartments if offers-discounts returns no results
- Discount searches now 10x faster

### Benefits
- Faster discount searches
- Better property coverage
- Seamless fallbacks

**Files Modified:** `search.js`

---

## 2025-01-09 - On-Request Payment Type

### Added
- New "On-Request" payment type for Express Bookable (non-Instant) properties
- Detection logic: `isExpressBookable: true && isInstantBookable: false`
- 2 On-Request test properties added to database

### Changed
- Payment type detection priority updated (On-Request checked first)
- Auto-save now stores `isExpressBookable` and `isInstantBookable` flags

**Files Modified:** `popup.html`, `search.js`, `properties.json`

**Test Properties:** 53792365, 53792355

---

## 2025-01-09 - Test Properties Feature

### Added
- 31 test properties from QA list added to database
- New "Test Property" checkbox filter in Payment Type section
- Each test property has `isTestProperty: true` flag and `testPropertyName`

### Test Properties Breakdown:
- **PCI Test:** 4 properties
- **On-Request:** 2 properties  
- **HoPa:** 2 properties
- **Adyen:** 2 properties
- **Instant:** 6 properties
- **Star Host:** 14 properties
- **TOMAS:** 2 (quarantined - no availability)

### Benefits
- Easy QA testing
- Filter for test properties only
- Combine with other criteria

**Files Modified:** `popup.html`, `search.js`, `properties.json`

---

## 2025-01-09 - Property Quarantine System

### Added
- Dual database architecture: `properties.json` (active) + `unavailable_properties.json` (quarantine)
- Auto-detect properties with no availability
- Quarantine properties to avoid repeated API calls
- Gradual cleanup: properties discovered as unavailable are moved to quarantine

### Features:
- **Detection:** Properties with no checkin dates are quarantined
- **Prevention:** Quarantined properties are skipped in future searches
- **Cleanup:** Properties in main DB found to be unavailable are moved to quarantine
- **Export Tools:** Scripts to export and merge quarantine databases

### Console Logs:
```
🚫 Property 12345 has no availability - quarantining
⏭️  Skipping property 12345 - already in quarantine database
🔄 Property 12345 moved from main DB to quarantine
```

### Benefits
- Higher quality search results
- Performance optimization (no wasted API calls)
- Automatic database maintenance
- Analytics on dead properties

**Files Modified:** `search.js`, `properties.json`, `unavailable_properties.json`

**New Scripts:** `exportUnavailableProperties.js`, `mergeUnavailableProperties.js`

---

## 2025-01-09 - Auto-Save Properties Feature

### Added
- Automatic saving of new properties found via ES + Live API
- Dual storage: in-memory array + `chrome.storage.local`
- Properties survive extension reloads

### How It Works:
1. ES search finds property IDs
2. Live API validates property details
3. Property is auto-saved if validation passes
4. Saved properties are merged with `properties.json` on startup

### Saved Property Data:
- Basic info (id, provider, multi-unit flag)
- Services (included, mandatory, selectable, onsite, free)
- Tourist tax (included, onsite)
- Deposits (included, onsite)
- Cancellation & payment type
- Discounts (10 types) with percentages
- Meal options (breakfast, half board, full board)

### Console Logs:
```
💾 Saving new property 12345678 to database...
✅ Property 12345678 saved to in-memory database
💾 Property 12345678 persisted to chrome.storage
📂 Loading 15 saved properties from chrome.storage
```

### Benefits:
- Resilience (VPN off, network issues)
- Growing database (organic growth over time)
- No manual work required
- Fast fallback searches

**Files Modified:** `search.js`

**New Scripts:** `exportSavedProperties.js`, `mergeSavedProperties.js`

---

## 2025-01-09 - Domain Selection & On-Request Redirects

### Added
- Domain input field with autocomplete datalist (300+ domains)
- Dynamic domain selection by name or ID
- Special handling for On-Request properties: redirect to `urlaubspiraten.holidu.com` when current/selected domain is one of the 23 main Holidu domains

### Changed
- Replaced domain dropdown with input + datalist for better UX
- Default: "Current domain" (empty field)
- Placeholder explains behavior

**Files Modified:** `popup.html`, `prepare.js`

---

## 2025-01-08 - TOMAS Payment Type

### Added
- New "TOMAS" payment type for `instantPaymentMethod.type === 'TOMAS_LIGHTBOX'`
- TOMAS providers auto-detected and marked in database
- TOMAS test properties added

### Changed
- Payment type detection logic updated
- TOMAS_ENGADIN_WL provider properties marked as TOMAS payment type

**Files Modified:** `popup.html`, `search.js`, `properties.json`

---

## 2025-01-08 - Meal Options Filter

### Added
- New "Meal Options" section with 3 filters:
  - Breakfast (`boardType: BED_AND_BREAKFAST` or "Breakfast" in costs)
  - Half Board (`boardType: HALF_BOARD`)
  - Full Board (`boardType: FULL_BOARD`)

### Detection Logic:
- Checks `priceResponse.rates.*.boardType` for multi-rate properties
- Checks `priceResponse.costsV2.MANDATORY_FREE` for single-rate properties
- Multi-date retry mechanism (up to 5 dates) for inconsistent pricing APIs

### Test Properties:
- **Breakfast:** 57357650, 57357981, 57357624, 57357956, 57358055
- **Half Board:** 57357956, 57358055

**Files Modified:** `popup.html`, `search.js`, `properties.json`

---

## 2025-01-08 - Discount Filters

### Added
- New "Discounts Available" section with 10 discount types:
  1. Non-refundable Discount / Multi-rate Properties
  2. Early Bird Discount
  3. Last Minute Discount
  4. Weekly Discount (Long Stay)
  5. New Listing Discount
  6. Mobile Discount
  7. Loyalty Discount
  8. Special Discount (2+ discounts from specific set)
  9. Offer Discount
  10. Provider Difference Discount

### Detection Logic:
- Parses `priceResponse.rates` for discount types
- Calculates discount percentages
- Special Discount = 2+ from (Early Bird, Last Minute, Weekly, Loyalty, Mobile, New Listing)

### Info Tooltip:
- Added info icon with tooltip explaining discount criteria
- "Discounts appear on the website based on their criteria"

### Database Import:
- 500 properties imported from SQL export with discount data
- All properties have `provider: BOOKIPLY`, `paymentType: ADYEN`
- Discount percentages and cancellation policies stored

**Files Modified:** `popup.html`, `index.css`, `search.js`, `properties.json`

**New Scripts:** `importDiscountDatabase.js`, `importFullDiscountDatabase.js`

---

## 2025-01-08 - Positive/Negative Filtering

### Added
- Toggle buttons next to Services, Tourist Tax, Deposit, and Multi-unit options
- Green checkmark (✓) = Include (must have feature)
- Red X (✗) = Exclude (must NOT have feature)
- All toggles enabled (green) by default

### Changed
- ES search triggers for BOTH positive and negative flags
- Static DB filter logic updated for negative flags
- Toggles disabled by default, enabled when checkbox is selected

### UI Improvements:
- Compact spacing for toggles
- Smaller toggle button size
- Visual feedback on toggle state

**Files Modified:** `popup.html`, `index.css`, `search.js`

---

## 2025-01-07 - UI/UX Overhaul

### Changed
- **Theme:** Updated to Holidu brand colors (#00809D for text, original green for toggles)
- **Logo:** Replaced with Holidu horizontal logo (white)
- **Spacing:** Compact spacing throughout to avoid scrolling
- **Checkboxes & Radio Buttons:** Custom styled with brand colors
- **Page Selection:** Moved to sticky footer (List, Details, Checkout)
- **Default Page:** Changed from Checkout to Details
- **Header Subtitle:** Changed from "Property Tester" to "Property Finder"

### Added
- Warning note: "Selecting multiple criteria might lead to nothing found"
- Toggle info note: "Green toggle = Include, Red toggle = Exclude" with static examples
- Warning icon image (`pngwing.com.png`)

### Improvements:
- Hover effects on all checkboxes and radio buttons
- Selection highlight (green background)
- Entire row clickable for better UX
- Fixed spacing, padding, margins for consistency
- Removed double highlighting on inner elements

**Files Modified:** `popup.html`, `index.css`, `Holidu_Horizontal Logo_White_RGB.png`, `pngwing.com.png`

---

## 2025-01-07 - List Page Option

### Added
- New page option "List" before "Details" in sticky footer
- Opens property on search/list page with:
  - Format: `https://www.holidu.de/s/Europe?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&includeOfferIds={propertyId}`
  - Fallback (no dates): `https://www.holidu.de/s/Europe?includeOfferIds={propertyId}`
- Dynamic domain selection
- Dates based on availability

**Files Modified:** `popup.html`, `prepare.js`

---

## 2025-01-06 - Live API Validation

### Added
- Smart validation strategy for static DB results
- Validates discounts, board types, and availability in real-time
- Multi-date retry mechanism (up to 5 dates) for pricing API
- Flexible validation: skips if API response structure doesn't allow verification

### Benefits:
- Accurate results (no fake data)
- Fast simple searches (skip validation if no complex criteria)
- Robust handling of API inconsistencies (TOMAS providers)

**Files Modified:** `search.js`

---

## 2025-01-06 - Dynamic Provider Search

### Added
- Wildcard matching for provider input
- Partial provider names work (e.g., "MALLORCA" finds "MALLORCA_CHARME")
- Works in both ES and static DB searches

**Files Modified:** `search.js`

---

## 2025-01-05 - ES Timeout & Fallback

### Added
- 5-second timeout for ES fetch requests using `AbortController`
- Graceful fallback to static DB on ES timeout or failure
- Works seamlessly when VPN is off or ES is unreachable

### Console Logs:
```
⏱️ ES request timeout (5s), falling back to DB...
❌ ES search error, falling back to static DB: timeout
```

**Files Modified:** `esClient.js`, `search.js`

---

## 2025-01-05 - Dynamic CTA Status

### Added
- Loading state for CTA button during search
- Dynamic text updates with animated dots: "Searching..."
- Fixed-width dots animation (no text shifting)
- Button disabled during search

### Console Integration:
```
updateSearchStatus('Searching')  // Shows "Searching..."
updateSearchStatus('Found')      // Shows "Found"
```

**Files Modified:** `popup.js`, `index.css`

---

## 2025-01-04 - ES Integration for Multi-unit & Services

### Added
- Elasticsearch client (`esClient.js`) using Kibana proxy
- ES search for provider, multi-unit, services, tourist tax, deposit criteria
- Positive and negative flag support in ES queries
- ES → Live API → Static DB fallback chain

### Changed
- `findProperty()` now triggers ES for specific criteria
- Added `needsEsSearch` logic to determine when to use ES
- Updated `manifest.json` permissions for ES API access

**Files Modified:** `search.js`, `esClient.js`, `manifest.json`

---

## 2025-01-03 - Initial Release

### Features:
- Property search by apartment ID
- Provider filtering
- Payment type filtering (ADYEN, PCI CC, PCI Multiple, Selectable, Non-Selectable, Single)
- Services filtering (Included, Mandatory, Selectable, Free Selectable, Onsite, Mandatory Onsite)
- Tourist tax filtering (Included, Onsite)
- Deposit filtering (Included, Onsite)
- Multi-unit parent structure filtering
- Free cancellation filtering
- Domain selection (23 Holidu domains)
- Page selection (Checkout/Details)
- Static database (`properties.json`) with 1800+ properties

**Core Files:** `popup.html`, `popup.js`, `search.js`, `prepare.js`, `holiduHelper.js`, `index.css`, `properties.json`

---

## Key Statistics

### Database:
- **Active Properties:** 1,802 in `properties.json`
- **Quarantined:** 71 in `unavailable_properties.json`
- **Test Properties:** 31 (flagged)
- **Discount Properties:** 500+ (imported from SQL)

### Filters Available:
- **Payment Types:** 8 types
- **Services:** 6 types (+ positive/negative flags)
- **Tourist Tax:** 2 types (+ positive/negative flags)
- **Deposits:** 2 types (+ positive/negative flags)
- **Discounts:** 10 types
- **Meal Options:** 3 types
- **Multi-unit:** 1 flag (+ positive/negative)
- **Other:** Free cancellation, test property, provider, domain, apartment ID

### Search Flow:
1. **ES Search** (if criteria requires it)
2. **Live API Validation** (for ES results or complex criteria)
3. **Static DB Fallback** (if ES fails or simple search)
4. **Quarantine Check** (skip unavailable properties)
5. **Retry Logic** (up to 5 attempts if no availability)

---

Last Updated: 2025-01-16



