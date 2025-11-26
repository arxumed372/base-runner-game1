const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '..', 'public', 'base-runner-game', 'assets', '20251117_2359_BaseRunner Game Title Screen_remix_01ka9sq27aechvm20k8yghfsmj.png');
const publicDir = path.join(__dirname, '..', 'public');

// Check if source exists, if not use a fallback
let imageToUse = sourceFile;
if (!fs.existsSync(imageToUse)) {
  // Try to find any PNG in the assets folder
  const assetsDir = path.join(__dirname, '..', 'public', 'base-runner-game', 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png') || f.endsWith('.PNG'));
    if (files.length > 0) {
      imageToUse = path.join(assetsDir, files[0]);
    }
  }
}

if (fs.existsSync(imageToUse)) {
  // Copy to icon.png, embed.png, splash.png
  const imageData = fs.readFileSync(imageToUse);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), imageData);
  fs.writeFileSync(path.join(publicDir, 'embed.png'), imageData);
  fs.writeFileSync(path.join(publicDir, 'splash.png'), imageData);
  console.log('Created placeholder files: icon.png, embed.png, splash.png');
  console.log('Note: These are temporary placeholders - replace with actual images');
} else {
  console.error('Could not find source image to copy');
  process.exit(1);
}

