# Chrome Extension Installation Guide

## Prerequisites
- Google Chrome browser
- No additional dependencies required

## Installation Steps

### Method 1: Load Unpacked Extension (Development Mode)

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" switch in top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `conqueror-testos` folder
   - Extension will appear in your extensions list

4. **Pin the Extension (Optional)**
   - Click the puzzle icon in Chrome toolbar
   - Find "Conqueror Testos"
   - Click the pin icon to keep it visible

### Method 2: Install from ZIP

1. **Extract the ZIP file**
   - Unzip `conqueror-testos.zip` to a folder
   
2. **Follow Method 1 steps** to load the unpacked extension

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
