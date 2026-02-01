/**
 * Fix Core Web Vitals Optimizations
 * Removes duplicate optimization elements
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(process.cwd(), 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

console.log('Fixing duplicate optimization elements...\n');

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Remove duplicate performance optimization meta tags
  const perfOptCount = (html.match(/<!-- Performance optimizations -->/g) || []).length;
  if (perfOptCount > 1) {
    const firstOccurrence = html.indexOf('<!-- Performance optimizations -->');
    const rest = html.substring(firstOccurrence);
    const dupPattern = /\s*<!-- Performance optimizations -->\s*<meta name="theme-color"[^>]*>\s*<meta http-equiv="X-UA-Compatible"[^>]*>/g;

    // Keep only the first occurrence
    let temp = html.substring(0, firstOccurrence);
    temp += rest.replace(dupPattern, '');
    html = temp;
    changes++;
  }

  // Remove duplicate preload links
  const preloadCount = (html.match(/rel="preload" href="[^"]*shared-styles\.css"/g) || []).length;
  if (preloadCount > 1) {
    // Keep only the async loading version with onload
    html = html.replace(/<link rel="preload" href="([^"]+shared-styles\.css)" as="style">\n\s*/g, '');
    changes++;
  }

  // Fix noscript duplication
  html = html.replace(/<noscript><link rel="preload"[^>]+><\/noscript>>/g, '');
  html = html.replace(/>\s*<noscript><link rel="stylesheet"[^>]+><\/noscript>>/g, '>\n  <noscript><link rel="stylesheet" href="../assets/css/shared-styles.css"></noscript>');

  if (changes > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Fixed ${file} (${changes} issues)`);
  }
});

console.log('\n✅ Done!');
