const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const url = require('url');

// Create directory if it doesn't exist
const imageDir = path.join(__dirname, 'public', 'assets', 'images');
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
  console.log('Created public directory');
}
if (!fs.existsSync(path.join(__dirname, 'public', 'assets'))) {
  fs.mkdirSync(path.join(__dirname, 'public', 'assets'));
  console.log('Created assets directory');
}
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
  console.log(`Created images directory: ${imageDir}`);
}

// Read the bots.ts file
const botsFile = fs.readFileSync(path.join(__dirname, 'prisma', 'bots.ts'), 'utf8');

// Extract data using a more targeted approach
const extractUrls = () => {
  const bots = [];
  
  // Extract individual bot objects
  const botBlocks = botsFile.match(/{\s*id:[\s\S]*?},/g) || [];
  
  botBlocks.forEach(block => {
    // Extract name
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : 'unknown';
    
    // Extract avatar
    const avatarMatch = block.match(/avatar:\s*"([^"]+)"/);
    const avatar = avatarMatch ? avatarMatch[1] : null;
    
    // Extract character image
    const characterMatch = block.match(/characterImage:\s*"([^"]+)"/);
    const characterImage = characterMatch ? characterMatch[1] : null;
    
    // Extract background image
    const bgMatch = block.match(/backgroundImage:\s*"([^"]+)"/);
    const backgroundImage = bgMatch ? bgMatch[1] : null;
    
    bots.push({
      name,
      avatar,
      characterImage,
      backgroundImage
    });
  });
  
  return bots;
};

// Function to download an image
function downloadImage(imageUrl, outputPath) {
  return new Promise((resolve, reject) => {
    // Skip if URL contains S3 placeholder or is undefined
    if (!imageUrl || imageUrl.includes('waifuu.s3.eu-central-1.amazonaws.com')) {
      console.log(`Skipping S3 placeholder: ${imageUrl}`);
      return resolve();
    }
    
    console.log(`Starting download: ${imageUrl}`);
    
    const parsedUrl = url.parse(imageUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = protocol.get(imageUrl, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const newUrl = res.headers.location;
        console.log(`Following redirect to: ${newUrl}`);
        return downloadImage(newUrl, outputPath).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${imageUrl}: Status ${res.statusCode}`);
        return resolve(); // Continue with other downloads
      }
      
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Successfully downloaded: ${outputPath}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        console.error(`Error writing to file ${outputPath}: ${err.message}`);
        resolve(); // Continue with other downloads
      });
    });
    
    req.on('error', (err) => {
      console.error(`Error downloading ${imageUrl}: ${err.message}`);
      resolve(); // Continue with other downloads
    });
    
    // Set a timeout
    req.setTimeout(10000, () => {
      req.abort();
      console.error(`Request timeout for ${imageUrl}`);
      resolve(); // Continue with other downloads
    });
    
    req.end();
  });
}

// Function to get file extension from URL
function getExtensionFromUrl(imageUrl) {
  if (!imageUrl) return '.jpg'; // Default extension
  
  try {
    const pathname = url.parse(imageUrl).pathname;
    let extension = path.extname(pathname).toLowerCase() || '.jpg';
    
    // Handle some common cases
    if (extension === '.webp') extension = '.webp';
    else if (extension === '.png') extension = '.png';
    else if (extension === '.jpeg' || extension === '.jpg') extension = '.jpg';
    else extension = '.jpg'; // Default to jpg for other cases
    
    return extension;
  } catch (err) {
    console.error(`Error parsing URL ${imageUrl}: ${err.message}`);
    return '.jpg'; // Default to jpg
  }
}

async function main() {
  const bots = extractUrls();
  console.log(`Found ${bots.length} bots to process`);
  
  for (const bot of bots) {
    const safeName = bot.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    console.log(`Processing ${bot.name} (${safeName})...`);
    
    // Avatar image
    if (bot.avatar && !bot.avatar.includes('waifuu.s3')) {
      const avatarExt = getExtensionFromUrl(bot.avatar);
      const avatarPath = path.join(imageDir, `${safeName}-avatar${avatarExt}`);
      await downloadImage(bot.avatar, avatarPath);
    }
    
    // Character image
    if (bot.characterImage && !bot.characterImage.includes('waifuu.s3')) {
      const characterExt = getExtensionFromUrl(bot.characterImage);
      const characterPath = path.join(imageDir, `${safeName}-character${characterExt}`);
      await downloadImage(bot.characterImage, characterPath);
    }
    
    // Background image
    if (bot.backgroundImage && !bot.backgroundImage.includes('waifuu.s3')) {
      const bgExt = getExtensionFromUrl(bot.backgroundImage);
      const bgPath = path.join(imageDir, `${safeName}-bg${bgExt}`);
      await downloadImage(bot.backgroundImage, bgPath);
    }
  }
  
  console.log('All downloads completed!');
}

main().catch(err => {
  console.error('Error in main process:', err);
});