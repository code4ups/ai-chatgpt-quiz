const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, 'assets/icons/ai-logo.svg');
const outputDir = path.join(__dirname, 'assets/icons');

// Sizes to generate
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-64x64.png', size: 64 },
  { name: 'favicon-128x128.png', size: 128 },
  { name: 'favicon-256x256.png', size: 256 },
  { name: 'favicon.png', size: 64 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  console.log('Generating icon files from ai-logo.svg...\n');

  // Copy SVG as favicon.svg
  fs.copyFileSync(inputSvg, path.join(outputDir, 'favicon.svg'));
  console.log('✓ favicon.svg');

  // Generate PNG files using sharp
  for (const { name, size } of sizes) {
    const outputPath = path.join(outputDir, name);
    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}: ${error.message}`);
    }
  }

  // Generate ICO file using sharp
  try {
    const icoPath = path.join(outputDir, 'favicon.ico');
    await sharp(inputSvg)
      .resize(32, 32)
      .toFormat('png')
      .toFile(icoPath.replace('.ico', '-temp.png'));

    fs.renameSync(icoPath.replace('.ico', '-temp.png'), icoPath);
    console.log('✓ favicon.ico (32x32)');
  } catch (error) {
    console.error(`✗ Failed to generate favicon.ico: ${error.message}`);
  }

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
