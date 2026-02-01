/**
 * Script to add Google Analytics 4 and analytics.js to all landing pages
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../pages');

// Google Analytics 4 Measurement ID (placeholder - update with real ID)
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// GA4 script tags to insert in <head>
const GA4_SCRIPT = `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA4_MEASUREMENT_ID}', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
`;

// Analytics library script to insert before </body>
const ANALYTICS_SCRIPT = `
<!-- Gemini Analytics Tracking -->
<script src="../assets/js/analytics.js" defer></script>
`;

// Get all HTML files
const htmlFiles = fs.readdirSync(PAGES_DIR)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(PAGES_DIR, file));

console.log(`Found ${htmlFiles.length} HTML files to process\n`);

let successCount = 0;
let skippedCount = 0;

htmlFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  console.log(`Processing ${fileName}...`);

  try {
    let html = fs.readFileSync(filePath, 'utf8');

    // Check if GA4 already exists
    if (html.includes('googletagmanager.com/gtag/js')) {
      console.log(`  ⚠️  GA4 already exists, skipping GA4 insertion`);
    } else {
      // Insert GA4 script before </head>
      html = html.replace('</head>', `${GA4_SCRIPT}</head>`);
      console.log(`  ✅ Added GA4 script`);
    }

    // Check if analytics.js already exists
    if (html.includes('analytics.js')) {
      console.log(`  ⚠️  analytics.js already exists, skipping`);
      skippedCount++;
    } else {
      // Insert analytics script before </body>
      html = html.replace('</body>', `${ANALYTICS_SCRIPT}</body>`);
      console.log(`  ✅ Added analytics.js script`);

      // Write back to file
      fs.writeFileSync(filePath, html, 'utf8');
      successCount++;
    }

    console.log('');

  } catch (error) {
    console.error(`  ❌ Error processing ${fileName}:`, error.message);
    console.log('');
  }
});

console.log('='.repeat(60));
console.log('Analytics Setup Complete');
console.log('='.repeat(60));
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`⚠️  Skipped (already exists): ${skippedCount} files`);
console.log(`📊 Total files processed: ${htmlFiles.length}`);
console.log('');
console.log('⚠️  IMPORTANT: Update GA4_MEASUREMENT_ID in this script');
console.log(`   Current value: ${GA4_MEASUREMENT_ID}`);
console.log('   Replace with your actual Google Analytics 4 Measurement ID');
console.log('   Then run this script again to update all pages');
