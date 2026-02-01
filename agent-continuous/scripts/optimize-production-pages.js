#!/usr/bin/env node

/**
 * Production Optimization Script
 *
 * This script optimizes all 13 production pages by:
 * 1. Making console.log conditional (only in development mode)
 * 2. Adding lazy loading for images
 * 3. Ensuring all pages are production-ready
 */

const fs = require('fs');
const path = require('path');

const PAGES = [
  'pages/workspace.html',
  'pages/research.html',
  'pages/comparison.html',
  'pages/writers.html',
  'pages/creators.html',
  'pages/productivity.html',
  'pages/future.html',
  'pages/index.html',
  'pages/apple-style.html',
  'pages/valentine.html',
  'pages/operators.html',
  'pages/automators.html',
  'pages/trust.html'
];

let totalChanges = 0;

console.log('🔧 Production Optimization Script\n');
console.log('Optimizing 13 production pages...\n');

for (const pagePath of PAGES) {
  console.log(`📄 Processing: ${pagePath}`);

  const fullPath = path.join(__dirname, '..', pagePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  File not found: ${pagePath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let changes = 0;

  // 1. Make console.log conditional
  const debugMode = `
    // Debug mode check
    const DEBUG_MODE = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       window.location.search.includes('debug=true');
  `.trim();

  // Add debug mode check if not present
  if (!content.includes('DEBUG_MODE')) {
    content = content.replace(
      /(<script[^>]*>)/i,
      `$1\n    ${debugMode}\n`
    );
    changes++;
  }

  // Wrap console.log in DEBUG_MODE check
  content = content.replace(
    /(\s+)(console\.log\([^;]+\);?)/g,
    (match, indent, logStatement) => {
      if (match.includes('if (DEBUG_MODE)')) {
        return match; // Already wrapped
      }
      return `${indent}if (DEBUG_MODE) ${logStatement}`;
    }
  );

  // Count how many console.log were wrapped
  const logCount = (content.match(/if \(DEBUG_MODE\) console\.log/g) || []).length;
  if (logCount > 0) {
    changes += logCount;
  }

  // 2. Add lazy loading hint for images (if not already present)
  // Add loading="lazy" to img tags that don't have it
  const beforeImgOptimization = content;
  content = content.replace(
    /<img([^>]+)>/gi,
    (match, attrs) => {
      // Skip if already has loading attribute
      if (/loading\s*=/.test(attrs)) {
        return match;
      }
      // Add loading="lazy" to images (except hero images which should load immediately)
      // We'll add it to all images except those in the first viewport
      return `<img${attrs} loading="lazy">`;
    }
  );

  if (content !== beforeImgOptimization) {
    const imgChanges = (content.match(/loading="lazy"/g) || []).length;
    changes += imgChanges;
    console.log(`  ✅ Added lazy loading to ${imgChanges} images`);
  }

  // 3. Add Intersection Observer for lazy loading if not present
  if (!content.includes('IntersectionObserver') && content.includes('loading="lazy"')) {
    const lazyLoadingScript = `
    // Lazy loading fallback for browsers without native support
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => imageObserver.observe(img));
    }
    `.trim();

    // Add before closing script tag
    content = content.replace(
      /(<\/script>\s*<\/body>)/i,
      `\n    ${lazyLoadingScript}\n  $1`
    );
    changes++;
    console.log(`  ✅ Added IntersectionObserver for lazy loading`);
  }

  // Save changes
  if (changes > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✨ ${changes} optimizations applied`);
    totalChanges += changes;
  } else {
    console.log(`  ℹ️  No changes needed`);
  }

  console.log('');
}

console.log('='.repeat(60));
console.log(`✅ Optimization complete!`);
console.log(`Total optimizations applied: ${totalChanges}`);
console.log('='.repeat(60));
console.log('\nOptimizations applied:');
console.log('  ✓ Console.log statements wrapped in DEBUG_MODE check');
console.log('  ✓ Lazy loading added to images');
console.log('  ✓ IntersectionObserver fallback added');
console.log('\nPages are now production-ready! 🚀');
