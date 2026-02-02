#!/usr/bin/env node

/**
 * Visual Regression Comparison Script
 *
 * This script helps manage and compare visual regression test results.
 * It provides utilities for:
 * - Listing all baseline screenshots
 * - Comparing current screenshots against baselines
 * - Generating summary reports
 * - Managing baseline updates
 *
 * Usage:
 *   node tests/compare-visuals.js list              # List all baselines
 *   node tests/compare-visuals.js count             # Count baseline screenshots
 *   node tests/compare-visuals.js verify            # Verify baselines exist
 *   node tests/compare-visuals.js summary           # Generate summary report
 */

const fs = require('fs');
const path = require('path');

// Paths
const SNAPSHOT_DIR = path.join(__dirname, 'visual-regression.spec.js-snapshots');
const FINAL_PAGES = [
  { name: 'Think Different', slug: 'think-different' },
  { name: 'Workspace Infinity', slug: 'workspace-infinity' },
  { name: 'Truth Matters', slug: 'truth-matters' },
  { name: 'Love Letter to Productivity', slug: 'love-letter' },
  { name: 'Secret Weapon', slug: 'secret-weapon' },
  { name: 'Gemini Pro', slug: 'gemini-pro' },
  { name: 'Email Savior', slug: 'email-savior' },
  { name: 'Meeting Notes Magic', slug: 'meeting-notes-magic' },
  { name: "The Writer's Room", slug: 'writers-room' },
  { name: 'Workflow Wizard', slug: 'workflow-wizard' },
];

/**
 * Expected baseline screenshot patterns
 */
const BASELINE_PATTERNS = [
  // Full-page screenshots (3 viewports × 10 pages = 30)
  '{slug}-mobile-full.png',
  '{slug}-tablet-full.png',
  '{slug}-desktop-full.png',

  // Hero sections (10 pages)
  '{slug}-hero-desktop.png',

  // CTA buttons (10 pages)
  '{slug}-cta-button.png',

  // Responsive breakpoints (2 × 10 pages = 20)
  '{slug}-small-mobile.png',
  '{slug}-large-desktop.png',

  // Cross-browser (3 × 10 pages = 30)
  '{slug}-chromium.png',
  '{slug}-firefox.png',
  '{slug}-webkit.png',
];

/**
 * Animation pages (4 pages)
 */
const ANIMATED_PAGES = [
  'email-savior',
  'meeting-notes-magic',
  'writers-room',
  'workflow-wizard',
];

/**
 * Get all expected baseline screenshots
 */
function getExpectedBaselines() {
  const baselines = [];

  // Add regular patterns for all pages
  for (const page of FINAL_PAGES) {
    for (const pattern of BASELINE_PATTERNS) {
      const filename = pattern.replace('{slug}', page.slug);
      baselines.push({
        page: page.name,
        slug: page.slug,
        filename: filename,
        type: getScreenshotType(filename),
      });
    }
  }

  // Add animation screenshots for animated pages
  for (const slug of ANIMATED_PAGES) {
    const page = FINAL_PAGES.find(p => p.slug === slug);
    baselines.push({
      page: page.name,
      slug: slug,
      filename: `${slug}-before-animation.png`,
      type: 'Animation (Before)',
    });
    baselines.push({
      page: page.name,
      slug: slug,
      filename: `${slug}-after-animation.png`,
      type: 'Animation (After)',
    });
  }

  return baselines;
}

/**
 * Determine screenshot type from filename
 */
function getScreenshotType(filename) {
  if (filename.includes('-mobile-full')) return 'Full Page (Mobile)';
  if (filename.includes('-tablet-full')) return 'Full Page (Tablet)';
  if (filename.includes('-desktop-full')) return 'Full Page (Desktop)';
  if (filename.includes('-hero-desktop')) return 'Hero Section';
  if (filename.includes('-cta-button')) return 'CTA Button';
  if (filename.includes('-small-mobile')) return 'Responsive (Small Mobile)';
  if (filename.includes('-large-desktop')) return 'Responsive (Large Desktop)';
  if (filename.includes('-chromium')) return 'Cross-Browser (Chromium)';
  if (filename.includes('-firefox')) return 'Cross-Browser (Firefox)';
  if (filename.includes('-webkit')) return 'Cross-Browser (WebKit)';
  if (filename.includes('-before-animation')) return 'Animation (Before)';
  if (filename.includes('-after-animation')) return 'Animation (After)';
  return 'Unknown';
}

/**
 * Check if snapshot directory exists
 */
function snapshotDirExists() {
  return fs.existsSync(SNAPSHOT_DIR);
}

/**
 * Get all baseline screenshots from disk
 */
function getActualBaselines() {
  if (!snapshotDirExists()) {
    return [];
  }

  const files = fs.readdirSync(SNAPSHOT_DIR);
  return files
    .filter(f => f.endsWith('.png'))
    .map(filename => {
      const stats = fs.statSync(path.join(SNAPSHOT_DIR, filename));
      return {
        filename,
        type: getScreenshotType(filename),
        size: stats.size,
        modified: stats.mtime,
      };
    });
}

/**
 * Command: list
 * Lists all baseline screenshots
 */
function commandList() {
  console.log('📸 Visual Regression Baselines\n');

  const baselines = getActualBaselines();

  if (baselines.length === 0) {
    console.log('❌ No baseline screenshots found.');
    console.log('💡 Run "npm run test:visual" to generate baselines.\n');
    return;
  }

  console.log(`Found ${baselines.length} baseline screenshots:\n`);

  // Group by type
  const byType = {};
  for (const baseline of baselines) {
    if (!byType[baseline.type]) {
      byType[baseline.type] = [];
    }
    byType[baseline.type].push(baseline);
  }

  // Print grouped
  for (const [type, items] of Object.entries(byType).sort()) {
    console.log(`\n${type} (${items.length}):`);
    for (const item of items.sort((a, b) => a.filename.localeCompare(b.filename))) {
      const sizeKB = (item.size / 1024).toFixed(1);
      console.log(`  - ${item.filename} (${sizeKB} KB)`);
    }
  }

  console.log('');
}

/**
 * Command: count
 * Counts baseline screenshots by type
 */
function commandCount() {
  console.log('📊 Visual Regression Baseline Count\n');

  const baselines = getActualBaselines();

  if (baselines.length === 0) {
    console.log('❌ No baseline screenshots found.');
    console.log('💡 Run "npm run test:visual" to generate baselines.\n');
    return;
  }

  // Group by type
  const byType = {};
  for (const baseline of baselines) {
    byType[baseline.type] = (byType[baseline.type] || 0) + 1;
  }

  console.log('Screenshot counts by type:\n');
  for (const [type, count] of Object.entries(byType).sort()) {
    console.log(`  ${type.padEnd(30)} ${count}`);
  }

  console.log(`\n${'Total:'.padEnd(30)} ${baselines.length}`);

  // Calculate total size
  const totalSize = baselines.reduce((sum, b) => sum + b.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`${'Total Size:'.padEnd(30)} ${totalSizeMB} MB\n`);
}

/**
 * Command: verify
 * Verifies all expected baselines exist
 */
function commandVerify() {
  console.log('✅ Verifying Visual Regression Baselines\n');

  const expected = getExpectedBaselines();
  const actual = getActualBaselines().map(b => b.filename);

  console.log(`Expected baselines: ${expected.length}`);
  console.log(`Actual baselines:   ${actual.length}\n`);

  // Find missing baselines
  const missing = expected.filter(e => !actual.includes(e.filename));

  if (missing.length === 0) {
    console.log('✅ All expected baselines exist!\n');
    return;
  }

  console.log(`❌ Missing ${missing.length} baseline screenshots:\n`);

  // Group by page
  const byPage = {};
  for (const item of missing) {
    if (!byPage[item.page]) {
      byPage[item.page] = [];
    }
    byPage[item.page].push(item);
  }

  for (const [page, items] of Object.entries(byPage).sort()) {
    console.log(`\n${page}:`);
    for (const item of items) {
      console.log(`  - ${item.filename} (${item.type})`);
    }
  }

  console.log('\n💡 Run "npm run test:visual" to generate missing baselines.\n');
}

/**
 * Command: summary
 * Generates a summary report
 */
function commandSummary() {
  console.log('📋 Visual Regression Testing Summary\n');
  console.log('='.repeat(60));

  // Check if baselines exist
  if (!snapshotDirExists()) {
    console.log('\n❌ No baselines found.\n');
    console.log('To get started:');
    console.log('  1. Run: npm run test:visual');
    console.log('  2. Review baseline screenshots');
    console.log('  3. Commit baselines to Git');
    console.log('  4. Run tests again to detect changes\n');
    return;
  }

  const baselines = getActualBaselines();
  const expected = getExpectedBaselines();

  console.log('\n📊 Statistics:\n');
  console.log(`  Total Pages:              ${FINAL_PAGES.length}`);
  console.log(`  Expected Baselines:       ${expected.length}`);
  console.log(`  Actual Baselines:         ${baselines.length}`);
  console.log(`  Coverage:                 ${((baselines.length / expected.length) * 100).toFixed(1)}%`);

  // Total size
  const totalSize = baselines.reduce((sum, b) => sum + b.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`  Total Size:               ${totalSizeMB} MB`);

  // Latest modification
  const latest = baselines.sort((a, b) => b.modified - a.modified)[0];
  if (latest) {
    console.log(`  Last Updated:             ${latest.modified.toLocaleString()}`);
  }

  // Count by type
  console.log('\n📸 Breakdown by Type:\n');
  const byType = {};
  for (const baseline of baselines) {
    byType[baseline.type] = (byType[baseline.type] || 0) + 1;
  }

  const typeOrder = [
    'Full Page (Mobile)',
    'Full Page (Tablet)',
    'Full Page (Desktop)',
    'Hero Section',
    'CTA Button',
    'Responsive (Small Mobile)',
    'Responsive (Large Desktop)',
    'Cross-Browser (Chromium)',
    'Cross-Browser (Firefox)',
    'Cross-Browser (WebKit)',
    'Animation (Before)',
    'Animation (After)',
  ];

  for (const type of typeOrder) {
    const count = byType[type] || 0;
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${type.padEnd(30)} ${count}`);
  }

  // Check for missing baselines
  const missing = expected.filter(e => !baselines.find(b => b.filename === e.filename));
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing Baselines: ${missing.length}`);
    console.log('\n💡 Run "npm run test:visual" to generate missing baselines.');
  } else {
    console.log('\n✅ All expected baselines present!');
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📚 Quick Commands:\n');
  console.log('  npm run test:visual              # Run visual regression tests');
  console.log('  npm run test:visual:update       # Update baselines');
  console.log('  npm run test:visual:report       # View HTML report');
  console.log('  node tests/compare-visuals.js list       # List all baselines');
  console.log('  node tests/compare-visuals.js verify     # Verify completeness\n');
}

/**
 * Main command dispatcher
 */
function main() {
  const command = process.argv[2] || 'summary';

  switch (command) {
    case 'list':
      commandList();
      break;
    case 'count':
      commandCount();
      break;
    case 'verify':
      commandVerify();
      break;
    case 'summary':
      commandSummary();
      break;
    case 'help':
      console.log('Visual Regression Comparison Tool\n');
      console.log('Usage: node tests/compare-visuals.js <command>\n');
      console.log('Commands:');
      console.log('  list      - List all baseline screenshots');
      console.log('  count     - Count baselines by type');
      console.log('  verify    - Verify all expected baselines exist');
      console.log('  summary   - Generate summary report (default)');
      console.log('  help      - Show this help message\n');
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Run "node tests/compare-visuals.js help" for usage.\n');
      process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  getExpectedBaselines,
  getActualBaselines,
  snapshotDirExists,
  FINAL_PAGES,
};
