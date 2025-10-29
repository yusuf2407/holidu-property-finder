# 🏠 Holidu Property Finder

A Chrome extension to quickly find and test properties on Holidu with advanced filtering options.

**🌐 Chrome Web Store:** [Install Extension](https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf)

---

## 📋 Table of Contents

1. [What is this?](#what-is-this)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Filter Options](#filter-options)
5. [How It Works](#how-it-works)
6. [Use Cases](#use-cases)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)
9. [Developer Tools](#developer-tools)

---

## What is this?

Holidu Property Finder is a browser extension that helps you quickly find properties on Holidu based on specific criteria like payment types, services, discounts, meal options, and more.

### Perfect for:
- ✅ **QA Testing** - Find test properties with specific payment methods
- ✅ **Customer Support** - Quickly locate properties with certain features
- ✅ **Development** - Test specific scenarios (multi-unit, deposits, discounts)
- ✅ **Exploration** - Discover properties with rare combinations

---

## Installation

### Method 1: Chrome Web Store (Recommended) ⭐

1. **Visit the Chrome Web Store:**
   - 🔗 [https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf](https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf)

2. **Install the Extension:**
   - Click **"Add to Chrome"** button
   - Confirm by clicking **"Add extension"** in the popup
   - ✅ **Extension installed!** You'll see a confirmation message

3. **Pin the Extension (Recommended):**
   - Click the **puzzle icon** 🧩 in Chrome's toolbar (top-right)
   - Find **"Holidu Property Finder"** in the list
   - Click the **pin icon** 📌 next to it
   - Now you can access it easily from your toolbar!

**✨ Benefits:**
- ✅ **Automatic Updates** - Get new features and bug fixes automatically
- ✅ **No Developer Mode** - Clean installation, no manual updates needed
- ✅ **One-Click Install** - No file downloads or folder management

---

### Method 2: Manual Installation (Developer Mode)

For developers or when testing unreleased versions:

#### Step 1: Download the Extension

1. Go to the repository: **https://github.com/yusuf2407/holidu-property-finder**
2. Click the green **"Code"** button (near the top right)
3. Click **"Download ZIP"** from the dropdown menu
4. Save the ZIP file to your computer (e.g., Downloads folder)
5. **Extract the ZIP file:**
   - **Windows:** Right-click → "Extract All..."
   - **Mac:** Double-click the ZIP file
6. Remember where you extracted it! You'll need this folder in the next step

#### Step 2: Install in Chrome

1. Open Google Chrome
2. Go to `chrome://extensions/` (copy-paste this into your address bar)
3. Turn ON **"Developer mode"** (toggle switch in the top-right corner)
4. Click the **"Load unpacked"** button (appears after enabling Developer mode)
5. Navigate to the folder you extracted in Step 1
6. Select the **`holidu-property-finder-main`** folder (or `holidu-property-finder` if renamed)
7. Click **"Select Folder"** or **"Open"**
8. ✅ **Extension installed!** You should see it in your extensions list

#### Step 3: Pin the Extension (Recommended)

1. Click the **puzzle icon** 🧩 in Chrome's toolbar (top-right)
2. Find **"Holidu Property Finder"** in the list
3. Click the **pin icon** 📌 next to it
4. Now you can access it easily from your toolbar!

**⚠️ Note:** Manual installations don't receive automatic updates. You'll need to download and reinstall manually for new versions.

---

### VPN Requirement (Optional)
- **For ES Search:** Connect to Holidu VPN for Elasticsearch access (439K+ properties)
- **Without VPN:** Extension still works using static database fallback (1,802 properties)

---

## Quick Start

### Basic Search

1. **Click extension icon** in Chrome toolbar
2. **Click "Find & go to apartment"** (no criteria selected)
3. **Result:** Opens a random property on Holidu Details page

### Search by Apartment ID

1. **Enter property ID** in the "Apartment ID" field
2. **Click "Find & go to apartment"**
3. **Result:** Opens that specific property

### Search by Criteria

1. **Select desired filters** (see [Filter Options](#filter-options))
2. **Click "Find & go to apartment"**
3. **Result:** Opens a property matching your criteria

---

## Filter Options

### 🎯 Basic Filters

#### Payment Types
Select the payment method you want:
- **ADYEN** - Properties using Adyen payment gateway
- **PCI CC** - PCI credit card payment (single method)
- **PCI Multiple** - PCI with multiple payment methods
- **TOMAS** - TOMAS Lightbox payment
- **On-Request** - Requires host confirmation (not instant)
- **Selectable** - Multiple payment methods, user can choose
- **Non-Selectable** - Multiple methods, no user choice
- **Single** - Single payment method only

#### Domains
- **Default:** Uses your current browser domain
- **Custom:** Type domain name (e.g., `holidu.de`) or ID to select another

#### Page Type
Where to open the property:
- **List** - Opens on search/list page
- **Details** - Opens property details page (default)
- **Checkout** - Opens checkout page

---

### 🔧 Services

Filter by service costs included in the booking:

| Service | Include (✓) | Exclude (✗) |
|---------|-------------|-------------|
| **Included Costs** | Must have | Must not have |
| **Mandatory Costs** | Must have | Must not have |
| **Selectable Costs** | Must have | Must not have |
| **Free Selectable** | Must have | Must not have |
| **Onsite Costs** | Must have | Must not have |
| **Mandatory Onsite** | Must have | Must not have |

**How to use:**
1. Check the checkbox for the service you want to filter
2. Click the toggle button:
   - **Green (✓)** = Property MUST have this service
   - **Red (✗)** = Property MUST NOT have this service

---

### 💰 Tourist Tax

Filter by tourist tax payment:
- **Tourist Tax Included** - Tax included in price
- **Tourist Tax Onsite** - Tax paid on arrival

**Toggles:** ✓ (must have) / ✗ (must not have)

---

### 💳 Deposits

Filter by deposit requirements:
- **Deposit Included** - Deposit in booking price
- **Deposit Onsite** - Deposit paid on arrival

**Toggles:** ✓ (must have) / ✗ (must not have)

---

### 🏢 Multi-units

Filter by multi-unit properties:

- **Multi-units Only** - Properties that are multi-unit (hotels, apartment complexes) WITHOUT parent structure
  - Examples: BOOKINGCOM apartments, MYRENT properties, flat multi-unit structures
  - Use case: Find multi-unit properties with simpler, non-hierarchical structure
  
- **Parent Structure Only** - Properties that have multi-unit parent structure
  - Examples: Properties with hierarchical unit organization
  - Use case: Find properties with parent-child unit relationships

**Note:** These filters are mutually exclusive - if "Multi-units Only" is selected, "Parent Structure Only" is ignored

---

### 🎁 Discounts Available

Find properties with specific discounts:

| Discount | Description |
|----------|-------------|
| **Non-refundable Discount** | Multi-rate properties with non-refundable rates |
| **Early Bird Discount** | Book early, save more |
| **Last Minute Discount** | Book last minute, save more |
| **Weekly Discount** | Discounts for 7+ night stays |
| **New Listing Discount** | Discount for newly listed properties |
| **Mobile Discount** | Discount for mobile bookings |
| **Loyalty Discount** | Discount for returning customers |
| **Special Discount** | 2+ discounts from (Early Bird, Last Minute, Weekly, Loyalty, Mobile, New Listing) |
| **Offer Discount** | Special promotional offers |
| **Provider Difference** | Price difference vs provider direct |

**ℹ️ Note:** Discounts appear on the website based on their criteria (dates, device, user status).

---

### 🍽️ Meal Options

Filter by meal plans:
- **Breakfast** - Includes breakfast
- **Half Board** - Breakfast + dinner
- **Full Board** - All meals included

---

### 🧪 Test Properties

- **Test Property** - Filter for QA/test properties only

**Use cases:**
- QA testing specific payment flows
- Testing booking scenarios
- Reproducing bugs on test properties

---

### ✅ Free Cancellation

Filter by cancellation policy:
- **Free Cancellation** - Property allows free cancellation

---

### 🔍 Provider Search

Search for properties from a specific provider:
- **Exact match:** `MALLORCA_CHARME`
- **Partial match:** `MALLORCA` (finds MALLORCA_CHARME, MALLORCA_VILLAS, etc.)

---

## How It Works

### Search Flow

```
1. User selects criteria
         ↓
2. Extension searches in order:
         ↓
   ┌─────────────────────┐
   │ Elasticsearch (ES)  │ ← If criteria requires ES
   │ 439K+ properties    │    (provider, multi-unit, discounts, etc.)
   └──────────┬──────────┘
              ↓ (IDs)
   ┌─────────────────────┐
   │ Live API Validation │ ← Validate ES results
   │ Check availability  │    Get real-time data
   │ Verify criteria     │
   └──────────┬──────────┘
              ↓ (Match found?)
              ├─ YES → Open property ✅
              └─ NO  → Continue ↓
   
   ┌─────────────────────┐
   │ Static Database     │ ← Fallback if ES fails
   │ 1,802 properties    │    or simple search
   │ + 71 quarantined    │
   └──────────┬──────────┘
              ↓
         Open property ✅
```

### Database Layers

#### 1️⃣ **Elasticsearch (ES)**
- **Size:** 439K+ properties (offers-discounts), millions in detailed-apartments
- **Speed:** Very fast (optimized queries)
- **Availability:** Requires VPN
- **Use:** Provider search, multi-unit, services, discounts

#### 2️⃣ **Static Database (`properties.json`)**
- **Size:** 1,802 active properties
- **Speed:** Instant (in-memory)
- **Availability:** Always (offline-ready)
- **Use:** Fallback, simple searches, no VPN needed

#### 3️⃣ **Quarantine Database (`unavailable_properties.json`)**
- **Size:** 71 properties
- **Purpose:** Track unavailable properties to avoid wasted API calls
- **Use:** Automatic cleanup, prevent searching dead properties

#### 4️⃣ **Chrome Storage (`chrome.storage.local`)**
- **Size:** User-specific (grows over time)
- **Purpose:** Save newly discovered properties
- **Use:** Persistent storage across extension reloads

---

## Use Cases

### Use Case 1: Find PCI Credit Card Property for QA
```
✅ Select "PCI CC" payment type
✅ Click "Find & go to apartment"
→ Opens a PCI CC property for testing
```

### Use Case 2: Find Property with Deposit for Support Ticket
```
✅ Check "Deposit Included"
✅ Click green toggle (✓) = must have
✅ Click "Find & go to apartment"
→ Opens property with deposit
```

### Use Case 3: Find TOMAS Provider Property
```
✅ Enter "TOMAS" in Provider field
✅ Click "Find & go to apartment"
→ Opens a TOMAS provider property
```

### Use Case 4: Find Property with Breakfast + ADYEN
```
✅ Check "Breakfast"
✅ Select "ADYEN" payment type
✅ Click "Find & go to apartment"
→ Opens ADYEN property with breakfast
```

### Use Case 5: Find Multi-unit WITHOUT Parent Structure
```
✅ Check "Multi-units Only"
✅ Click "Find & go to apartment"
→ Opens multi-unit property without parent structure (e.g., BOOKINGCOM, MYRENT)
```

### Use Case 6: Find Test Property for QA
```
✅ Check "Test Property"
✅ Select desired payment type (optional)
✅ Click "Find & go to apartment"
→ Opens a test property
```

### Use Case 7: Open Property on List Page
```
✅ Select "List" page type
✅ Click "Find & go to apartment"
→ Opens property on search results page
```

### Use Case 8: Find Property with Early Bird Discount
```
✅ Check "Early Bird Discount"
✅ Click "Find & go to apartment"
→ Opens property with early bird discount
```

---

## Troubleshooting

### ❌ No Property Found

**Possible reasons:**
1. **Too many criteria** - Try fewer filters
2. **ES timeout** - Check VPN connection
3. **No matching properties** - Criteria combination doesn't exist

**Solutions:**
- Remove some filters
- Try different combination
- Check console logs for details

### ❌ Extension Not Working

**Possible reasons:**
1. **Extension not loaded** - Check `chrome://extensions/`
2. **Errors in console** - Open DevTools (F12) and check Console tab
3. **Permissions issue** - Extension needs permissions in manifest

**Solutions:**
- Reload extension (click reload button)
- Check for errors in console
- Re-install extension

### ❌ Search Stuck on "Searching..."

**Possible reasons:**
1. **ES timeout** - VPN off
2. **API error** - Holidu API temporarily down
3. **Network issue** - Check internet connection

**Solutions:**
- Wait 10 seconds for timeout/fallback
- Check VPN connection
- Reload extension

### ❌ Wrong Property Opened

**Possible reasons:**
1. **Live API validation failed** - Property changed since DB save
2. **Criteria mismatch** - Property doesn't match all criteria

**Solutions:**
- Try again (gets random property)
- Check console logs for validation details
- Verify criteria selection

---

## Advanced Features

### 📋 ES Query Logs Viewer

View and copy all Elasticsearch queries for debugging and documentation.

**How to use:**
1. Perform any search (with or without criteria)
2. Scroll down in popup and click **"📋 View ES Query Logs"**
3. Beautiful window opens with all saved queries
4. Click **"📋 Copy All Logs"** to copy queries to clipboard
5. Click **"🗑️ Clear All Logs"** to delete all saved queries

**Features:**
- ✅ Automatically saves last 50 ES queries
- ✅ Persists across extension reloads
- ✅ Shows timestamp, index name, criteria, and full query
- ✅ Dark theme with formatted JSON
- ✅ One-click copy/clear functionality

**Use cases:**
- Debug ES queries without console
- Copy queries for Kibana testing
- Compare different search criteria
- Learn ES query structure
- Share queries with team members

**Console logs:**
```javascript
ES query: {...}  // Logged to console
(Query also auto-saved to chrome.storage.local)
```

---

### 🔄 Auto-Save Properties

The extension automatically saves new properties discovered via ES to the local database.

**How it works:**
1. ES search finds property
2. Live API validates property
3. ✅ Property auto-saved to `chrome.storage.local`
4. On extension reload, saved properties are merged with `properties.json`

**Export saved properties:**
```javascript
// Open extension popup, then open browser console (F12)
// Copy-paste contents of: maintenance-scripts/exportSavedProperties.js
```

### 🚫 Quarantine System

Properties with no availability are automatically quarantined to avoid wasted API calls.

**How it works:**
1. Property found but has no availability
2. ❌ Property moved to `unavailable_properties.json`
3. Future searches skip quarantined properties
4. Database self-cleans over time

**Console logs:**
```
🚫 Property 12345 has no availability - quarantining
⏭️  Skipping property 12345 - already in quarantine
🔄 Property 12345 moved from main DB to quarantine
```

### 🔁 Retry Logic

If a property has no availability, the extension automatically retries with another property (up to 5 attempts).

**Console logs:**
```
🔍 Attempt 1/5: Checking property 12345...
❌ Property 12345 has no availability
🔍 Attempt 2/5: Checking property 67890...
✅ Property 67890 has availability!
```

### 📊 Loading State

CTA button shows search progress:
```
"Searching..."    → In progress
"Searching."      → In progress (dot animation)
"Searching.."     → In progress
"Searching..."    → In progress
```

---

## Developer Tools

### Check Database Sizes

```javascript
// Check properties in database
fetch('./properties.json')
  .then(r => r.json())
  .then(props => console.log(`Properties: ${props.length}`));

// Check saved properties in chrome storage
chrome.storage.local.get(['savedProperties'], (r) => {
  console.log(`Saved: ${r.savedProperties?.length || 0}`);
});

// Check quarantined properties
chrome.storage.local.get(['unavailableProperties'], (r) => {
  console.log(`Quarantined: ${r.unavailableProperties?.length || 0}`);
});
```

### View Properties by Criteria

```javascript
// Find all ADYEN properties
fetch('./properties.json')
  .then(r => r.json())
  .then(props => {
    const adyen = props.filter(p => p.paymentType === 'ADYEN');
    console.log(`ADYEN properties: ${adyen.length}`);
    console.table(adyen);
  });

// Find all test properties
fetch('./properties.json')
  .then(r => r.json())
  .then(props => {
    const tests = props.filter(p => p.isTestProperty);
    console.log(`Test properties: ${tests.length}`);
    console.table(tests);
  });

// Find properties with breakfast
fetch('./properties.json')
  .then(r => r.json())
  .then(props => {
    const breakfast = props.filter(p => p.hasBreakfast);
    console.log(`Breakfast properties: ${breakfast.length}`);
    console.table(breakfast);
  });
```

### Clear Stored Data

```javascript
// Clear saved properties
chrome.storage.local.remove(['savedProperties'], () => {
  console.log('✅ Saved properties cleared');
});

// Clear quarantine
chrome.storage.local.remove(['unavailableProperties'], () => {
  console.log('✅ Quarantine cleared');
});

// Clear ES query logs
chrome.storage.local.remove(['esQueryLogs'], () => {
  console.log('✅ ES query logs cleared');
});

// Clear all extension data
chrome.storage.local.clear(() => {
  console.log('✅ All data cleared');
});
```

### Export Data

**Saved Properties:**
```bash
# Run in browser console (on extension popup page)
node maintenance-scripts/exportSavedProperties.js
```

**Quarantined Properties:**
```bash
# Run in browser console (on extension popup page)
node maintenance-scripts/exportUnavailableProperties.js
```

### Merge Exported Data

**Merge Saved Properties:**
```bash
cd /path/to/holidu-property-finder
node maintenance-scripts/mergeSavedProperties.js
```

**Merge Quarantined Properties:**
```bash
cd /path/to/holidu-property-finder
node maintenance-scripts/mergeUnavailableProperties.js
```

---

## File Structure

```
/holidu-property-finder/
├── popup.html                          # Extension UI
├── popup.js                            # UI logic & event handlers
├── search.js                           # Core search logic (ES, Live API, DB)
├── prepare.js                          # URL construction & date handling
├── holiduHelper.js                     # Holidu API client
├── esClient.js                         # Elasticsearch client
├── index.css                           # Styles
├── manifest.json                       # Extension config
├── properties.json                     # Main database (1,802 properties)
├── unavailable_properties.json         # Quarantine database (71 properties)
├── README.md                           # This file
├── CHANGELOG.md                        # All implementation history
└── maintenance-scripts/                # Database management scripts
    ├── exportSavedProperties.js        # Export saved properties
    ├── exportUnavailableProperties.js  # Export quarantine
    ├── mergeSavedProperties.js         # Merge saved → properties.json
    └── mergeUnavailableProperties.js   # Merge quarantine
```

---

## Console Logging

The extension provides detailed console logs for debugging:

### Search Progress
```
🔍 Attempting ES search first...
ES query: {...}
ES returned 50 IDs
🔍 Resolving via Live API - checking 50 candidates...
✅ Property 12345 has availability!
```

### Auto-Save
```
💾 Saving new property 12345678 to database...
✅ Property 12345678 saved to in-memory database
💾 Property 12345678 persisted to chrome.storage
```

### Quarantine
```
🚫 Property 87654321 has no availability - quarantining
❌ Property 87654321 added to unavailable database
⏭️  Skipping property 87654321 - already in quarantine
```

### Database Loading
```
📂 Loading 15 saved properties from chrome.storage
✅ Total properties in database: 1802
🚫 Loading 8 unavailable properties from chrome.storage
📊 Total unavailable properties: 71
```

---

## Statistics

### Database
- **Active Properties:** 1,802
- **Quarantined:** 71
- **Test Properties:** 31
- **Discount Properties:** 500+
- **ES Index (offers-discounts):** 439,710 properties

### Filters
- **Payment Types:** 8
- **Services:** 6 (with positive/negative flags)
- **Tourist Tax:** 2 (with positive/negative flags)
- **Deposits:** 2 (with positive/negative flags)
- **Discounts:** 10
- **Meal Options:** 3
- **Multi-unit:** 1 (with positive/negative flag)

### Performance
- **ES Search:** < 2 seconds (when VPN on)
- **Static DB Search:** < 100ms (instant)
- **Live API Validation:** 2-5 seconds per property
- **Fallback:** Automatic within 5 seconds

---

## 🔄 Updates & Versioning

### Automatic Updates

If you installed from the Chrome Web Store, you'll receive automatic updates:

- ✅ **Updates happen automatically** - Chrome checks for updates every few hours
- ✅ **No user action required** - Updates install silently in the background
- ✅ **Always up-to-date** - You'll get new features and bug fixes within 24 hours
- ✅ **No notifications** - Extension reloads seamlessly with new version

### Manual Update (Developer Mode Only)

If you installed manually (Developer Mode):

1. Download the latest version from [GitHub](https://github.com/yusuf2407/holidu-property-finder)
2. Extract the ZIP file
3. Go to `chrome://extensions/`
4. Click the **"Reload"** icon on the extension card
5. Or remove and reinstall the extension

**💡 Tip:** Switch to Chrome Web Store installation to get automatic updates forever!

---

## Support & Contribution

### Report Issues
- Check console logs for error details
- Share screenshots if UI issue
- Provide steps to reproduce

### Feature Requests
- Describe use case
- Explain expected behavior
- Suggest UI/UX improvements

### Contributing
- Follow existing code style
- Test changes thoroughly
- Update README/CHANGELOG if needed

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full implementation history with timestamps.

---

## Links

- 🌐 **Chrome Web Store:** [Install Extension](https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf)
- 📦 **GitHub Repository:** [holidu-property-finder](https://github.com/yusuf2407/holidu-property-finder)
- 📖 **Privacy Policy:** [PRIVACY_POLICY.md](PRIVACY_POLICY.md)
- 📝 **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## License

Internal Holidu tool - Not for public distribution

---

**Last Updated:** October 29, 2025  
**Version:** 2.1.0  
**Maintainer:** Holidu Tech Team

---

Happy Property Finding! 🏠✨
