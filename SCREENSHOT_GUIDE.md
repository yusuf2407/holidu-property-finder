# Screenshot Preparation for Chrome Web Store

## Chrome Web Store Requirements

Screenshots must be:
- **Resolution:** 1280x800 or 640x400 pixels (aspect ratio 16:10)
- **Format:** PNG or JPEG
- **Minimum:** 1 screenshot (maximum 5)

---

## Quick Method: Manual Resize

Since you already have a screenshot, follow these steps:

### Step 1: Save Your Screenshot

1. Save the screenshot image you shared as: `screenshot-raw.png`
2. Place it in this directory: `/Users/yusufmonaf/Documents/holidu-property-finder/`

### Step 2: Run the Conversion Script

Open Terminal in this directory and run:

```bash
./prepare-screenshot.sh
```

This will automatically create:
- `screenshot-1280x800.png` (recommended)
- `screenshot-640x400.png` (alternative)

---

## Alternative: Direct Command

If you prefer to do it manually with a single command:

### For 1280x800 (Recommended):
```bash
sips -z 800 1280 screenshot-raw.png --out screenshot-1280x800.png
```

### For 640x400:
```bash
sips -z 400 640 screenshot-raw.png --out screenshot-640x400.png
```

---

## Taking a New Screenshot

If you want to take a fresh screenshot:

### Method 1: Native macOS Screenshot (Best Quality)

1. **Open the extension** in Chrome (click the icon)
2. Press **Cmd + Shift + 4** (macOS screenshot tool)
3. Press **Spacebar** to capture the window
4. Click on the extension popup
5. Screenshot saved to Desktop

### Method 2: Chrome DevTools (Precise Dimensions)

1. Open the extension popup
2. Right-click on the popup → **Inspect**
3. Open Chrome DevTools
4. Press **Cmd + Shift + P** (Command Palette)
5. Type "screenshot" and select **"Capture screenshot"**
6. Screenshot saved to Downloads

---

## What to Upload to Chrome Web Store

After preparing your screenshots:

1. Go to Chrome Web Store Developer Dashboard
2. Navigate to: **Graphic Assets** tab
3. Scroll to **Screenshots** section
4. Upload: `screenshot-1280x800.png`

You can upload up to 5 screenshots showing different features!

---

## Recommended Screenshots to Take

For the best presentation, consider taking multiple screenshots:

1. **Main Interface** - Full view with filters (you have this!)
2. **Services Section** - Showing Services, Tourist Tax, Deposit filters
3. **Discounts Section** - Showing all discount options
4. **Multi-units & Payment** - Showing payment types and multi-unit options
5. **Success State** - After finding a property (optional)

---

## Current Status

✅ Screenshot script created: `prepare-screenshot.sh`
✅ Script is executable
⏳ Waiting for you to save `screenshot-raw.png` and run the script

---

## Quick Start

```bash
# 1. Save your screenshot as screenshot-raw.png in this folder
# 2. Run the conversion
./prepare-screenshot.sh

# 3. Upload to Chrome Web Store
# Use: screenshot-1280x800.png
```

That's it! 🎉

