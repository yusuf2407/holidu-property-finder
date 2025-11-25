# Chrome Web Store Submission Guide

## ✅ STATUS: PUBLISHED (Private)

**Current Version:** 2.1.2  
**Status:** Published - Private  
**Chrome Web Store Link:** [https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf](https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf)  
**Extension ID:** `nddkflapkpfljkfnehffjfnfelmeocmf`

### What "Private" Means:
- ✅ Extension is live and published
- ✅ Only @holidu.com users can see and install it
- ✅ Automatic updates work for all authorized users
- ❌ Does not appear in Chrome Web Store search results
- ❌ Not accessible to anyone outside the organization

### Submission History:
**1st Rejection:** October 24, 2025 - Unused `scripting` permission (Violation ID: Purple Potassium)  
**2nd Rejection:** October 27, 2025 - Unused `activeTab` permission (Violation ID: Purple Potassium)  
**Root Cause:** Used wrong permission - need `tabs` not `activeTab` to read tab.url  
**Fix Applied:** ✅ Changed from `activeTab` to `tabs` permission  
**3rd Submission:** October 29, 2025 - ✅ **APPROVED & PUBLISHED**

---

## 🔧 What Was Fixed

### Issue Timeline:
1. **1st Rejection:** Unused `scripting` permission - we removed it
2. **2nd Rejection:** Unused `activeTab` permission - wrong permission!
3. **Root Cause:** Extension reads `tabs[0].url` which requires `tabs` permission, not `activeTab`

### Technical Explanation:
- `activeTab` = Temporary access to inject scripts when user clicks icon
- `tabs` = Read tab metadata like URL, title, etc.
- Our code in `prepare.js` line 281: `new URL(tabs[0].url).hostname` requires **`tabs`** permission

### Fix Applied:
1. ✅ Removed `scripting` permission (1st fix)
2. ✅ Changed `activeTab` to `tabs` permission (2nd fix)
3. ✅ Updated `PRIVACY_POLICY.md` to reflect tabs permission
4. ✅ Recreated package with `prepare.js` included
5. ✅ Updated permission justifications below

### Current Permissions (2 only):
- ✅ `storage` - Save preferences and property data locally
- ✅ `tabs` - Read current tab URL and open new tabs

---

## ✅ Files Ready for Submission

Your extension is now prepared for Chrome Web Store publication!

### What's Been Created:

1. **Icons** (✅ Complete):
   - `icon-16.png` - 16x16 pixels
   - `icon-48.png` - 48x48 pixels
   - `icon-128.png` - 128x128 pixels
   - `manifest.json` updated with all icon sizes

2. **Distribution Package** (✅ Complete):
   - `holidu-property-finder-v2.1.2.zip` - Ready to upload
   
### Version 2.1.1 Release Notes

**What's New:**
- ✅ **Webstore Compatibility Fixes**: Fixed icon loading issues when installed from Chrome Web Store
- ✅ **Error Handling Improvements**: Enhanced error handling for tab URL detection and DOM element access
- ✅ **UI Improvements**: Converted parent structure options to single-select radio buttons for better UX
- ✅ **Label Updates**: Updated multi-unit filter labels to "Without Parent Structure" and "With Parent Structure"
- ✅ **ES8 Migration**: Migrated Elasticsearch queries from ES7 to ES8 endpoint

**Technical Changes:**
- Icons now use `chrome.runtime.getURL()` for proper webstore compatibility
- Added null checks for DOM elements to prevent crashes
- Improved error logging for debugging
- Parent structure filter now uses radio buttons (mutually exclusive selection)

3. **Promotional Image** (✅ Complete):
   - `promo-tile-440x280.png` - Small promotional tile

---

## 📤 Upload Steps

### Step 1: Go to Chrome Web Store Developer Dashboard
1. Visit: https://chrome.google.com/webstore/devconsole
2. Sign in with your `@holidu.com` Google account
3. Find your existing item: **Holidu Property Finder** (ID: `nddkflapkpfljkfnehffjfnfelmeocmf`)
4. Click on it to open the dashboard

### Step 2: Upload ZIP File
1. Click **"Upload new package"** (for resubmission)
2. Select: `holidu-property-finder-v2.1.2.zip`
3. Wait for upload and validation to complete
4. ✅ Verify that permissions show only `storage` and `tabs` (correct!)
5. ✅ Verify version shows 2.1.2

### Step 3: Fill in Store Listing Information

#### **Product Details Tab:**

**Name:**
```
Holidu Property Finder
```

**Summary:** (132 characters max)
```
Quickly find and test properties on Holidu with advanced filtering options. Internal tool for QA, support, and development teams.
```

**Description:**
```
Holidu Property Finder is a powerful Chrome extension designed for Holidu team members to quickly find properties based on specific criteria.

FEATURES:
• Advanced filtering: payment types, services, discounts, meal options
• Multi-unit property support
• Provider search across 400+ providers
• Test property filtering for QA
• ES Query Logs for debugging
• Automatic property database updates

PERFECT FOR:
✓ QA Testing - Find test properties with specific payment methods
✓ Customer Support - Quickly locate properties with certain features
✓ Development - Test specific scenarios (multi-unit, deposits, discounts)
✓ Exploration - Discover properties with rare combinations

DATABASE:
• Elasticsearch: 439K+ properties (requires VPN)
• Static fallback: 1,802 properties (always available)
• Auto-quarantine system for unavailable properties

FILTERS:
• Payment Types: ADYEN, PCI CC, PCI Multiple, TOMAS, On-Request, etc.
• Services: Included, Mandatory, Selectable, On-site costs
• Tourist Tax & Deposits: Included or On-site
• Discounts: Early Bird, Last Minute, Weekly, Mobile, Loyalty, etc.
• Meal Options: Breakfast, Half Board, Full Board
• Multi-units & Parent structures
• Free Cancellation & Cancellation Policies

Internal tool - Only for Holidu team members
```

**Category:**
```
Developer Tools
```

**Language:**
```
English
```

#### **Graphic Assets Tab:**

**Icon:** (already in manifest.json)
- ✅ Automatically pulled from manifest

**Small promotional tile:** (440x280 - REQUIRED)
- Upload: `promo-tile-440x280.png`

**Screenshot:** (1280x800 or 640x400 - REQUIRED)
- You need to take a screenshot of the extension popup
- Steps:
  1. Open Chrome and load the extension
  2. Click the extension icon
  3. Take a screenshot of the popup (Command+Shift+4 on Mac)
  4. Crop to 1280x800 or 640x400
  5. Upload to Chrome Web Store

#### **Distribution Tab:**

**Visibility:**
- Select: ✅ **Private**

**Distribution:**
- Select: ✅ **Only users in my organization**
- Domain: `holidu.com`

This ensures ONLY users with `@holidu.com` email addresses can see and install the extension.

**✅ APPLIED:** This setting is now active on the published extension.

#### **Privacy Tab:**

**Single Purpose Description:**
```
This extension helps Holidu team members quickly search and navigate to specific properties on Holidu websites using advanced filters (payment types, services, discounts, meal options, etc.) for QA testing, customer support, and development purposes.
```

**Permission Justifications:**

**Storage Justification:**
```
The storage permission is used to save user preferences, discovered property data, and Elasticsearch query logs locally in the browser. This allows the extension to maintain a database of properties, remember filter settings, and provide query history for debugging without requiring external servers.
```

**Tabs Justification:**
```
The tabs permission is required to detect the current Holidu domain by reading the active tab's URL (line 281 in prepare.js: new URL(tabs[0].url).hostname) and to open property pages in new tabs (line 271: chrome.tabs.create). This ensures the extension opens properties on the correct Holidu website (holidu.com, holidu.de, etc.) based on the user's current browsing context.
```

**Host Permission Justification:**
```
Host permissions are required to access Holidu's internal APIs (api.holidu.com), Elasticsearch service (kibana-search-8.holidu.cloud), and all Holidu brand domains (holidu.com, holidu.de, holidu.fr, etc.) to fetch property data, validate availability, and navigate users to the correct property pages across different Holidu websites.
```

**Remote Code Usage:**
- Selected: **No, I am not using remote code** ✅
- Note: Fetching JSON data from APIs is NOT considered remote code. Only executable JavaScript/WebAssembly loaded externally counts as remote code.

**Data Usage:**
- No user data collection boxes checked ❌
- All three disclosure certifications checked ✅:
  - ✅ I do not sell or transfer user data to third parties
  - ✅ I do not use or transfer user data for unrelated purposes
  - ✅ I do not use or transfer user data for creditworthiness/lending

**Privacy Policy URL:**
```
https://raw.githubusercontent.com/yusuf2407/holidu-property-finder/main/PRIVACY_POLICY.md
```

---

### Step 4: Submit for Review

1. Review all tabs for completeness
2. Click **"Submit for Review"**
3. Review typically takes **1-3 business days**
4. You'll receive an email when approved

---

## 🎯 After Approval

### ✅ Extension is Now Published!

**Chrome Web Store Link:**
```
https://chromewebstore.google.com/detail/nddkflapkpfljkfnehffjfnfelmeocmf
```

### Share with Team:

Share this link with Holidu team members via:
- 📧 Email
- 💬 Slack
- 📝 Internal documentation
- 🔗 Confluence/Wiki

### Installation for Team Members:

1. Visit the Chrome Web Store link above
2. Click **"Add to Chrome"**
3. Confirm by clicking **"Add extension"**
4. ✅ Extension installs automatically (no Developer Mode needed)
5. 🔄 Updates will be pushed automatically within 24 hours

### Visibility Settings:

**Current Setting:** Private
- Only @holidu.com users can see and install
- Does not appear in Chrome Web Store search
- Perfect for internal tools restricted to your organization

**Visibility Options:**
1. Go to [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Select your extension
3. Go to **Distribution** tab
4. Available visibility options:
   - **Public**: Anyone can find and install (searchable)
   - **Unlisted**: Only people with link can install
   - **Private**: Only specific organization/group can access (current) ⭐

---

## 📝 Notes

- **Trader Account:** Select "No/Non-trader" (this is a free internal tool)
- **Updates:** To update, just upload a new ZIP with an incremented version number in manifest.json
- **Support:** Link to your GitHub repo for documentation

---

## 🚀 Submission Checklist

- [✅] Icons created (16, 48, 128)
- [✅] Manifest.json updated
- [✅] ZIP file created
- [✅] Promotional tile created
- [✅] Screenshot taken and uploaded
- [✅] Registered as Chrome Web Store developer ($5 fee)
- [✅] All form fields filled in Developer Dashboard
- [✅] Privacy justifications completed
- [✅] Privacy policy created and URL added
- [✅] Privacy set to "Organization-only" (holidu.com)
- [✅] Submitted for review!

---

## 📧 What Happens Next

1. **Review Period:** Chrome Web Store will review your submission (1-3 business days)
2. **Email Notification:** You'll receive an email when:
   - Extension is approved ✅
   - More information is needed 📝
   - Extension is rejected (with reasons) ❌
3. **After Approval:** Extension will be live for `@holidu.com` users
4. **Updates:** To update, increment version in manifest.json, create new ZIP, and upload

---

## 🔄 How to Update the Extension

When you need to release version 2.2.0 or later:

1. Make your code changes
2. Update version in `manifest.json` (e.g., `"version": "2.2.0"`)
3. Create new ZIP file:
   ```bash
   zip -r holidu-property-finder-v2.2.0.zip . -x "*.git*" "*node_modules/*" "*.DS_Store" "*.zip"
   ```
4. Go to Chrome Web Store Developer Dashboard
5. Click on your extension → **"Package"** tab
6. Upload new ZIP file
7. Click **"Submit for Review"**
8. Users will receive automatic update within a few hours

---

**Congratulations on your submission!** 🎉

Your extension has been submitted to the Chrome Web Store as a private, organization-only extension for Holidu team members.

