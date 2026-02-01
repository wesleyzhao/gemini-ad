#!/usr/bin/env node

/**
 * ============================================
 * OPTIMIZE-ASSETS.JS - Asset Optimization Script
 * ============================================
 *
 * Optimizes CSS and JS files for production:
 * - Removes comments
 * - Removes unnecessary whitespace
 * - Generates .min.css and .min.js versions
 * - Calculates file size savings
 *
 * Usage:
 *   node scripts/optimize-assets.js
 *   npm run optimize:assets
 */

const fs = require('fs');
const path = require('path');

/* ============================================
   CONFIGURATION
   ============================================ */

const CONFIG = {
  assetsDir: path.join(__dirname, '..', 'assets'),
  cssDir: path.join(__dirname, '..', 'assets', 'css'),
  jsDir: path.join(__dirname, '..', 'assets', 'js'),
  preserveComments: false, // Set to true to keep important comments (/*! ... */)
  verbose: true
};

/* ============================================
   MINIFICATION FUNCTIONS
   ============================================ */

/**
 * Minify CSS by removing comments and unnecessary whitespace
 * @param {string} css - CSS content
 * @returns {string} Minified CSS
 */
function minifyCSS(css) {
  let minified = css;

  // Remove comments (except /*! ... */ if preserveComments is true)
  if (CONFIG.preserveComments) {
    // Keep /*! ... */ comments, remove all others
    minified = minified.replace(/\/\*(?!\!)[\s\S]*?\*\//g, '');
  } else {
    // Remove all comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Remove unnecessary whitespace
  minified = minified
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\s*{\s*/g, '{') // Spaces around {
    .replace(/\s*}\s*/g, '}') // Spaces around }
    .replace(/\s*:\s*/g, ':') // Spaces around :
    .replace(/\s*;\s*/g, ';') // Spaces around ;
    .replace(/\s*,\s*/g, ',') // Spaces around ,
    .replace(/;\s*}/g, '}') // Remove last semicolon in rule
    .replace(/\s*>\s*/g, '>') // Spaces around >
    .replace(/\s*\+\s*/g, '+') // Spaces around +
    .replace(/\s*~\s*/g, '~') // Spaces around ~
    .trim();

  return minified;
}

/**
 * Minify JavaScript by removing comments and unnecessary whitespace
 * Note: This is a simple minifier. For production, use UglifyJS or Terser
 * @param {string} js - JavaScript content
 * @returns {string} Minified JavaScript
 */
function minifyJS(js) {
  let minified = js;

  // Remove single-line comments (but keep URLs like http://)
  minified = minified.replace(/(?<!:)\/\/[^\n]*/g, '');

  // Remove multi-line comments (except /*! ... */ if preserveComments is true)
  if (CONFIG.preserveComments) {
    minified = minified.replace(/\/\*(?!\!)[\s\S]*?\*\//g, '');
  } else {
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Remove unnecessary whitespace (simple approach)
  minified = minified
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s*\/\s*/g, '/')
    .trim();

  return minified;
}

/**
 * Calculate file size savings
 * @param {number} originalSize - Original file size in bytes
 * @param {number} minifiedSize - Minified file size in bytes
 * @returns {object} Size savings statistics
 */
function calculateSavings(originalSize, minifiedSize) {
  const saved = originalSize - minifiedSize;
  const percentage = ((saved / originalSize) * 100).toFixed(2);

  return {
    original: originalSize,
    minified: minifiedSize,
    saved: saved,
    percentage: percentage
  };
}

/**
 * Format bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/* ============================================
   FILE PROCESSING
   ============================================ */

/**
 * Process all CSS files in a directory
 * @param {string} directory - Directory path
 */
function processCSSFiles(directory) {
  const files = fs.readdirSync(directory);
  const cssFiles = files.filter(file => file.endsWith('.css') && !file.endsWith('.min.css'));

  console.log(`\n📦 Processing ${cssFiles.length} CSS files...`);
  console.log('━'.repeat(80));

  let totalOriginal = 0;
  let totalMinified = 0;

  cssFiles.forEach(file => {
    const inputPath = path.join(directory, file);
    const outputPath = path.join(directory, file.replace('.css', '.min.css'));

    const original = fs.readFileSync(inputPath, 'utf8');
    const minified = minifyCSS(original);

    fs.writeFileSync(outputPath, minified, 'utf8');

    const stats = calculateSavings(original.length, minified.length);
    totalOriginal += stats.original;
    totalMinified += stats.minified;

    if (CONFIG.verbose) {
      console.log(`✅ ${file}`);
      console.log(`   ${formatBytes(stats.original)} → ${formatBytes(stats.minified)} (${stats.percentage}% smaller)`);
    }
  });

  const totalStats = calculateSavings(totalOriginal, totalMinified);
  console.log('━'.repeat(80));
  console.log(`📊 CSS Total: ${formatBytes(totalStats.original)} → ${formatBytes(totalStats.minified)} (${totalStats.percentage}% reduction)\n`);

  return totalStats;
}

/**
 * Process all JS files in a directory
 * @param {string} directory - Directory path
 */
function processJSFiles(directory) {
  const files = fs.readdirSync(directory);
  const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.min.js'));

  console.log(`\n📦 Processing ${jsFiles.length} JS files...`);
  console.log('━'.repeat(80));

  let totalOriginal = 0;
  let totalMinified = 0;

  jsFiles.forEach(file => {
    const inputPath = path.join(directory, file);
    const outputPath = path.join(directory, file.replace('.js', '.min.js'));

    const original = fs.readFileSync(inputPath, 'utf8');
    const minified = minifyJS(original);

    fs.writeFileSync(outputPath, minified, 'utf8');

    const stats = calculateSavings(original.length, minified.length);
    totalOriginal += stats.original;
    totalMinified += stats.minified;

    if (CONFIG.verbose) {
      console.log(`✅ ${file}`);
      console.log(`   ${formatBytes(stats.original)} → ${formatBytes(stats.minified)} (${stats.percentage}% smaller)`);
    }
  });

  const totalStats = calculateSavings(totalOriginal, totalMinified);
  console.log('━'.repeat(80));
  console.log(`📊 JS Total: ${formatBytes(totalStats.original)} → ${formatBytes(totalStats.minified)} (${totalStats.percentage}% reduction)\n`);

  return totalStats;
}

/* ============================================
   MAIN EXECUTION
   ============================================ */

function main() {
  console.log('\n🚀 Starting Asset Optimization...\n');

  try {
    // Process CSS files
    const cssStats = processCSSFiles(CONFIG.cssDir);

    // Process JS files
    const jsStats = processJSFiles(CONFIG.jsDir);

    // Calculate total savings
    const totalOriginal = cssStats.original + jsStats.original;
    const totalMinified = cssStats.minified + jsStats.minified;
    const totalStats = calculateSavings(totalOriginal, totalMinified);

    console.log('═'.repeat(80));
    console.log('🎉 OPTIMIZATION COMPLETE');
    console.log('═'.repeat(80));
    console.log(`📊 Total Size: ${formatBytes(totalStats.original)} → ${formatBytes(totalStats.minified)}`);
    console.log(`💾 Space Saved: ${formatBytes(totalStats.saved)} (${totalStats.percentage}%)`);
    console.log('═'.repeat(80));
    console.log('\n✅ Minified files created with .min.css and .min.js extensions');
    console.log('💡 Update your HTML files to use minified versions for production\n');

  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

// Run optimization
main();
