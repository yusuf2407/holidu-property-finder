# Chrome Extension Installation Guide

## Prerequisites
- Google Chrome browser
- No additional dependencies required

---

## 📥 Step 1: Download from GitHub

### Easy Download Instructions

1. **Visit the repository:**
   ```
   https://github.com/yusuf2407/holidu-property-finder
   ```

2. **Download the ZIP file:**
   - Click the green **"Code"** button (near the top right)
   - Click **"Download ZIP"** from the dropdown menu
   - Save to your computer (e.g., Downloads folder)

3. **Extract the ZIP file:**
   - **Windows:** Right-click the ZIP file → Select "Extract All..." → Choose location → Click "Extract"
   - **Mac:** Simply double-click the ZIP file (it extracts automatically)

4. **Remember the location!**
   - Note where you extracted the files (you'll need this in Step 2)
   - The folder will be named `holidu-property-finder-main` or `holidu-property-finder`

---

## 🔧 Step 2: Install in Chrome

1. **Open Chrome Extensions Page**
   - **Method 1:** Type `chrome://extensions/` in your address bar and press Enter
   - **Method 2:** Click Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Look for the **"Developer mode"** toggle in the top-right corner
   - Click it to turn it ON (it should be blue/enabled)

3. **Load the Extension**
   - Click the **"Load unpacked"** button (appears after enabling Developer mode)
   - Navigate to the folder where you extracted the ZIP (from Step 1)
   - Select the **`holidu-property-finder-main`** folder (or `holidu-property-finder`)
   - Click **"Select Folder"** (Windows) or **"Open"** (Mac)

4. **Verify Installation**
   - You should see "Holidu Property Finder" in your extensions list
   - It should show as "Enabled"

---

## 📌 Step 3: Pin the Extension (Recommended)

1. **Find the Extensions Icon**
   - Look for the puzzle icon 🧩 in Chrome's toolbar (top-right, next to your profile picture)

2. **Pin the Extension**
   - Click the puzzle icon
   - Find **"Holidu Property Finder"** in the dropdown list
   - Click the **pin icon** 📌 next to it

3. **Access the Extension**
   - The extension icon will now appear in your toolbar
   - Click it anytime to open the property search interface

## Verification

After installation, you should see:
- Extension icon in Chrome toolbar
- Clicking icon opens the search popup
- All search filters are visible and functional

## Important Notes

### Files to Include in ZIP:
✅ **Required Files:**
- `manifest.json`
- `popup.html`, `popup.js`
- `search.js`, `esClient.js`, `prepare.js`, `holiduHelper.js`
- `index.css`
- `properties.json`, `unavailable_properties.json`
- `favicon.png`
- `README.md`, `CHANGELOG.md`
- `maintenance-scripts/` folder
- `scripts/`, `seeds/` folders

❌ **Exclude from ZIP:**
- `node_modules/` (not needed - extension uses browser APIs)
- `package.json`, `package-lock.json` (optional, no runtime dependencies)
- `.git/`, `.DS_Store`, etc.

## Troubleshooting

### Extension doesn't load
- Check that `manifest.json` is in the root of the selected folder
- Ensure all required files are present

### Search not working
- Check browser console for errors (F12)
- Verify you have internet connection (needs API access)
- Check that `properties.json` exists and is valid

### No properties found
- Ensure the static database (`properties.json`) is present
- Try different search criteria
- Check ES Query Logs for debugging

## Features

- Advanced property search with 40+ filters
- Discount filters (Early Bird, Last Minute, Weekly, etc.)
- Board types (Breakfast, Half Board, Full Board)
- Services, Tourist Tax, Deposit filters
- Payment type filters
- Multi-unit property support
- ES Query Logs viewer for debugging

## Support

For issues or questions, refer to:
- `README.md` - Full feature documentation
- `CHANGELOG.md` - Recent changes and fixes
- ES Query Logs - Debug search queries
