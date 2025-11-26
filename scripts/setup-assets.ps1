# PowerShell script to copy assets to public folder
# Run this script after cloning the repository

Write-Host "Setting up BaseRunner game assets..."

# Create directories
New-Item -ItemType Directory -Force -Path "public\base-runner-game\assets" | Out-Null

# Copy PNG files
Write-Host "Copying PNG files..."
Copy-Item "*.png" -Destination "public\base-runner-game\assets\" -ErrorAction SilentlyContinue
Copy-Item "*.PNG" -Destination "public\base-runner-game\assets\" -ErrorAction SilentlyContinue

# Copy sound file
Write-Host "Copying sound file..."
Copy-Item "Sound.mp3" -Destination "public\base-runner-game\assets\" -ErrorAction SilentlyContinue

# Verify
$assetCount = (Get-ChildItem "public\base-runner-game\assets\" -ErrorAction SilentlyContinue).Count
Write-Host "Assets setup complete! Found $assetCount files in public/base-runner-game/assets/"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Run 'npm install' to install dependencies"
Write-Host "2. Run 'npm run dev' to start the development server"
Write-Host "3. Open http://localhost:3000 in your browser"

