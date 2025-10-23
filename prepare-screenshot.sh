#!/bin/bash

# Chrome Web Store Screenshot Preparation Script
# Resizes screenshots to meet Chrome Web Store requirements (1280x800 or 640x400)

echo "Chrome Web Store Screenshot Preparation"
echo "========================================"
echo ""

# Check if ImageMagick is installed, if not use sips (macOS)
if command -v convert &> /dev/null; then
    TOOL="imagemagick"
    echo "Using ImageMagick for conversion"
elif command -v sips &> /dev/null; then
    TOOL="sips"
    echo "Using sips (macOS) for conversion"
else
    echo "Error: No image processing tool found"
    echo "Please install ImageMagick: brew install imagemagick"
    exit 1
fi

echo ""
echo "Instructions:"
echo "1. Save your screenshot as 'screenshot-raw.png' in this folder"
echo "2. Run this script: ./prepare-screenshot.sh"
echo ""

# Check if screenshot exists
if [ ! -f "screenshot-raw.png" ]; then
    echo "❌ Error: screenshot-raw.png not found"
    echo ""
    echo "Please save your screenshot as 'screenshot-raw.png' and run again"
    exit 1
fi

echo "✅ Found screenshot-raw.png"
echo ""

# Get original dimensions
if [ "$TOOL" = "sips" ]; then
    WIDTH=$(sips -g pixelWidth screenshot-raw.png | grep pixelWidth | awk '{print $2}')
    HEIGHT=$(sips -g pixelHeight screenshot-raw.png | grep pixelHeight | awk '{print $2}')
else
    DIMENSIONS=$(identify -format "%wx%h" screenshot-raw.png)
    WIDTH=$(echo $DIMENSIONS | cut -d'x' -f1)
    HEIGHT=$(echo $DIMENSIONS | cut -d'x' -f2)
fi

echo "Original size: ${WIDTH}x${HEIGHT}"
echo ""

# Calculate aspect ratio
ASPECT=$(echo "scale=4; $WIDTH / $HEIGHT" | bc)
TARGET_ASPECT_LARGE="1.6"  # 1280/800 = 1.6
TARGET_ASPECT_SMALL="1.6"  # 640/400 = 1.6

echo "Creating Chrome Web Store screenshots..."
echo ""

# Create 1280x800 version
if [ "$TOOL" = "sips" ]; then
    # Use canvas padding to fit exact dimensions
    sips -z 800 1280 screenshot-raw.png --out screenshot-1280x800.png --padColor FFFFFF
    echo "✅ Created: screenshot-1280x800.png"
    
    # Create 640x400 version
    sips -z 400 640 screenshot-raw.png --out screenshot-640x400.png --padColor FFFFFF
    echo "✅ Created: screenshot-640x400.png"
else
    # ImageMagick approach with better quality
    convert screenshot-raw.png -resize 1280x800 -background white -gravity center -extent 1280x800 screenshot-1280x800.png
    echo "✅ Created: screenshot-1280x800.png"
    
    convert screenshot-raw.png -resize 640x400 -background white -gravity center -extent 640x400 screenshot-640x400.png
    echo "✅ Created: screenshot-640x400.png"
fi

echo ""
echo "🎉 Screenshots ready for Chrome Web Store!"
echo ""
echo "📁 Files created:"
echo "   - screenshot-1280x800.png (recommended for main screenshot)"
echo "   - screenshot-640x400.png (alternative size)"
echo ""
echo "📤 Upload these to Chrome Web Store Developer Dashboard > Graphic Assets"

