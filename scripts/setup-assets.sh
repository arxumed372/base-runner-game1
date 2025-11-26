#!/bin/bash
# Bash script to copy assets to public folder
# Run this script after cloning the repository

echo "Setting up BaseRunner game assets..."

# Create directories
mkdir -p public/base-runner-game/assets

# Copy PNG files
echo "Copying PNG files..."
cp *.png public/base-runner-game/assets/ 2>/dev/null
cp *.PNG public/base-runner-game/assets/ 2>/dev/null

# Copy sound file
echo "Copying sound file..."
cp Sound.mp3 public/base-runner-game/assets/ 2>/dev/null

# Verify
ASSET_COUNT=$(ls -1 public/base-runner-game/assets/ 2>/dev/null | wc -l)
echo "Assets setup complete! Found $ASSET_COUNT files in public/base-runner-game/assets/"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"

