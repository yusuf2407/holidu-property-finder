# Privacy Policy - Holidu Property Finder

**Last Updated:** October 23, 2025  
**Version:** 2.1.0

## Overview

Holidu Property Finder is an internal Chrome extension designed exclusively for Holidu team members. This extension helps employees quickly search and navigate to specific properties on Holidu websites for QA testing, customer support, and development purposes.

## Scope

This extension is only available to users with `@holidu.com` email addresses and is not intended for public use.

## Data Collection

**We do not collect any personal user data.**

The extension operates entirely within your browser and does not transmit any personal information to external servers.

## Data Storage

### Local Storage Only
All data is stored locally in your browser using Chrome's storage API:

- **Property Database:** A local database of property information used for search functionality
- **User Preferences:** Your filter settings and search criteria
- **Query Logs:** Elasticsearch query history for debugging purposes
- **Unavailable Properties:** A quarantine list of properties with no availability

**Important:** This data never leaves your browser and is not synced or transmitted to any external servers.

## Permissions Explained

### Storage Permission
Used to save property data, user preferences, and query logs locally in your browser.

### ActiveTab Permission
Required to detect your current Holidu domain and navigate to the selected property page on the correct website.

### Scripting Permission
Used to extract domain information from the active tab to automatically select the appropriate Holidu website.

### Host Permissions
Required to access:
- **Holidu Internal APIs** (api.holidu.com) - To fetch property data
- **Elasticsearch Service** (kibana-search-7.holidu.cloud) - To search properties
- **Holidu Brand Domains** (holidu.com, holidu.de, holidu.fr, etc.) - To navigate to property pages

## Remote Code

The extension fetches property data from Holidu's internal APIs and Elasticsearch service. Only JSON data responses are fetched - no executable code is loaded remotely. All logic runs locally in your browser.

## Third-Party Services

This extension connects only to Holidu's internal services:
- Holidu API (api.holidu.com)
- Elasticsearch (kibana-search-7.holidu.cloud)
- Holidu brand websites

**No third-party services or analytics tools are used.**

## Data Sharing

- ❌ We do **not** sell user data
- ❌ We do **not** share data with third parties
- ❌ We do **not** transfer data outside of Holidu's internal systems
- ❌ We do **not** use data for advertising or tracking

## Data Security

All data is stored locally in your browser and protected by Chrome's security mechanisms. Access to internal Holidu APIs requires VPN connection for additional security.

## User Rights

As this is an internal tool, you can:
- Clear all stored data at any time through Chrome's extension settings
- Uninstall the extension to remove all local data
- View source code on GitHub: https://github.com/yusuf2407/holidu-property-finder

## Changes to This Policy

We may update this privacy policy from time to time. The "Last Updated" date at the top of this page will reflect when changes were made.

## Contact

For questions or concerns about this privacy policy or the extension, please contact:

**Holidu Tech Team**  
Internal Holidu communication channels

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- EU General Data Protection Regulation (GDPR)
- Google's User Data Policy

## Developer Information

**Developer:** Holidu Tech Team  
**Organization:** Holidu GmbH  
**Purpose:** Internal tool for property search and testing  
**Distribution:** Private (Holidu organization only)

---

**Note:** This extension is for internal Holidu use only and is not available to the general public.

