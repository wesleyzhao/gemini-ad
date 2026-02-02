#!/usr/bin/env node

/**
 * Update Asset References Script
 *
 * Updates HTML files to use minified CSS/JS assets for production.
 * Creates .prod.html versions with minified asset references.
 *
 * Usage: npm run build:prod
 */

const fs = require('fs').promises;
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function updateHTMLReferences(filePath) {
  log('cyan', `\n📝 Processing: ${path.basename(filePath)}`);

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Replace CSS references
    const cssRegex = /(href=["'])([^"']*\.css)(["'])/g;
    const updatedCSS = content.replace(cssRegex, (match, prefix, cssPath, suffix) => {
      // Skip if already minified
      if (cssPath.includes('.min.css')) {
        return match;
      }

      // Replace .css with .min.css
      const minifiedPath = cssPath.replace('.css', '.min.css');
      log('green', `  ✓ CSS: ${cssPath} → ${minifiedPath}`);
      modified = true;
      return `${prefix}${minifiedPath}${suffix}`;
    });

    // Replace JS references
    const jsRegex = /(src=["'])([^"']*\.js)(["'])/g;
    const updatedJS = updatedCSS.replace(jsRegex, (match, prefix, jsPath, suffix) => {
      // Skip if already minified or external
      if (jsPath.includes('.min.js') || jsPath.startsWith('http')) {
        return match;
      }

      // Replace .js with .min.js
      const minifiedPath = jsPath.replace('.js', '.min.js');
      log('green', `  ✓ JS:  ${jsPath} → ${minifiedPath}`);
      modified = true;
      return `${prefix}${minifiedPath}${suffix}`;
    });

    if (modified) {
      // Create production version
      const prodPath = filePath.replace('.html', '.prod.html');
      await fs.writeFile(prodPath, updatedJS, 'utf-8');
      log('bright', `  ✓ Created: ${path.basename(prodPath)}`);
      return true;
    } else {
      log('yellow', '  ⚠ No changes needed');
      return false;
    }
  } catch (error) {
    log('red', `  ✗ Error: ${error.message}`);
    return false;
  }
}

async function findHTMLFiles(dir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip certain directories
        if (!['node_modules', '.git', 'dist', 'screenshots'].includes(entry.name)) {
          await walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.html') && !entry.name.endsWith('.prod.html')) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

async function main() {
  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║       🔧 UPDATE ASSET REFERENCES FOR PRODUCTION           ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝');

  // Find all HTML files
  const htmlFiles = await findHTMLFiles('.');

  let updatedCount = 0;

  for (const file of htmlFiles) {
    const updated = await updateHTMLReferences(file);
    if (updated) updatedCount++;
  }

  log('bright', '\n\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║                    📊 UPDATE SUMMARY                       ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝');

  log('green', `\n✓ Total HTML files: ${htmlFiles.length}`);
  log('green', `✓ Updated files: ${updatedCount}`);
  log('yellow', '\n⚠ Note: .prod.html files are for reference only.');
  log('yellow', '  GitHub Pages will serve minified assets automatically');
  log('yellow', '  by detecting .min.css and .min.js files.\n');
}

main().catch(error => {
  log('red', `\n❌ Error: ${error.message}`);
  process.exit(1);
});
