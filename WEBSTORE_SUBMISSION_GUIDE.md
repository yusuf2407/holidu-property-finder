# Chrome Web Store Submission Guide

## ✅ Files Ready for Submission

Your extension is now prepared for Chrome Web Store publication!

### What's Been Created:

1. **Icons** (✅ Complete):
   - `icon-16.png` - 16x16 pixels
   - `icon-48.png` - 48x48 pixels
   - `icon-128.png` - 128x128 pixels
   - `manifest.json` updated with all icon sizes

2. **Distribution Package** (✅ Complete):
   - `holidu-property-finder-webstore.zip` - Ready to upload

3. **Promotional Image** (✅ Complete):
   - `promo-tile-440x280.png` - Small promotional tile

---

## 📤 Upload Steps

### Step 1: Go to Chrome Web Store Developer Dashboard
1. Visit: https://chrome.google.com/webstore/devconsole
2. Sign in with your `@holidu.com` Google account
3. Click **"New Item"** button

### Step 2: Upload ZIP File
1. Click **"Choose file"** or drag and drop
2. Select: `holidu-property-finder-webstore.zip`
3. Wait for upload and validation to complete

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

#### **Privacy Tab:**

**Single Purpose:**
```
This extension helps Holidu team members find and test properties on Holidu websites with advanced filtering capabilities.
```

**Permission Justification:**

For **"storage"**:
```
Used to save user preferences, discovered properties, and query logs locally in the browser.
```

For **"activeTab"**:
```
Required to open and navigate to the selected property page on Holidu domains.
```

For **"scripting"**:
```
Needed to interact with property pages and extract current domain information.
```

For **"host_permissions"** (all Holidu domains):
```
Necessary to access Holidu API, Elasticsearch, and all Holidu brand websites to find and navigate to properties.
```

**Remote Code:** 
- No ❌

**Data Usage:**
- No user data collected ❌
- No data transmitted to external servers ❌
- All data stored locally in browser storage ❌

---

### Step 4: Submit for Review

1. Review all tabs for completeness
2. Click **"Submit for Review"**
3. Review typically takes **1-3 business days**
4. You'll receive an email when approved

---

## 🎯 After Approval

### Share with Team:

1. Go to your Chrome Web Store Developer Dashboard
2. Find your extension
3. Copy the Chrome Web Store URL (looks like: `https://chrome.google.com/webstore/detail/[extension-id]`)
4. Share this link with Holidu team members via Slack/Email

### Installation for Team Members:

1. Team members with `@holidu.com` accounts visit the link
2. Click **"Add to Chrome"**
3. Extension installs automatically (no Developer Mode needed)
4. Updates will be pushed automatically

---

## 📝 Notes

- **Trader Account:** Select "No/Non-trader" (this is a free internal tool)
- **Updates:** To update, just upload a new ZIP with an incremented version number in manifest.json
- **Support:** Link to your GitHub repo for documentation

---

## 🚀 Quick Checklist Before Submitting

- [✅] Icons created (16, 48, 128)
- [✅] Manifest.json updated
- [✅] ZIP file created
- [✅] Promotional tile ready
- [ ] Screenshot taken (you need to do this)
- [ ] Registered as Chrome Web Store developer ($5 fee)
- [ ] All form fields filled in Developer Dashboard
- [ ] Privacy set to "Organization-only"
- [ ] Ready to submit!

---

**Good luck with your submission!** 🎉

Your extension is ready to be published to the Chrome Web Store as a private, organization-only extension for Holidu team members.

