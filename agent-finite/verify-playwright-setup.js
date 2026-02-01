#!/usr/bin/env node

/**
 * Playwright Setup Verification Script
 *
 * This script verifies that Playwright is correctly installed and configured.
 * Run this after installing Playwright to ensure everything works.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying Playwright Setup...\n');

const checks = [];

// Check 1: Playwright installed
try {
  const version = execSync('npx playwright --version', { encoding: 'utf-8' }).trim();
  checks.push({ name: 'Playwright installed', status: 'PASS', detail: version });
} catch (error) {
  checks.push({ name: 'Playwright installed', status: 'FAIL', detail: error.message });
}

// Check 2: playwright.config.js exists
const configPath = path.join(__dirname, 'playwright.config.js');
if (fs.existsSync(configPath)) {
  checks.push({ name: 'playwright.config.js exists', status: 'PASS', detail: 'Found' });
} else {
  checks.push({ name: 'playwright.config.js exists', status: 'FAIL', detail: 'Missing' });
}

// Check 3: tests directory exists
const testsDir = path.join(__dirname, 'tests');
if (fs.existsSync(testsDir)) {
  const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.spec.js'));
  checks.push({
    name: 'tests directory exists',
    status: 'PASS',
    detail: `${testFiles.length} test files found`,
  });
} else {
  checks.push({ name: 'tests directory exists', status: 'FAIL', detail: 'Missing' });
}

// Check 4: test-utils.js exists
const utilsPath = path.join(__dirname, 'tests', 'test-utils.js');
if (fs.existsSync(utilsPath)) {
  checks.push({ name: 'test-utils.js exists', status: 'PASS', detail: 'Found' });
} else {
  checks.push({ name: 'test-utils.js exists', status: 'FAIL', detail: 'Missing' });
}

// Check 5: screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  checks.push({
    name: 'screenshots directory',
    status: 'PASS',
    detail: 'Created screenshots directory',
  });
} else {
  checks.push({ name: 'screenshots directory', status: 'PASS', detail: 'Already exists' });
}

// Check 6: Final 10 pages exist
const pagesDir = path.join(__dirname, 'pages');
const requiredPages = [
  'think-different.html',
  'workspace-infinity.html',
  'truth-matters.html',
  'love-letter-to-productivity.html',
  'secret-weapon.html',
  'pro.html',
  'email-savior.html',
  'meeting-notes-magic.html',
  'writers-room.html',
  'workflow-wizard.html',
];

let pagesFound = 0;
requiredPages.forEach(page => {
  const pagePath = path.join(pagesDir, page);
  if (fs.existsSync(pagePath)) {
    pagesFound++;
  }
});

if (pagesFound === requiredPages.length) {
  checks.push({
    name: 'All 10 final pages exist',
    status: 'PASS',
    detail: `${pagesFound}/${requiredPages.length} pages found`,
  });
} else {
  checks.push({
    name: 'All 10 final pages exist',
    status: 'WARN',
    detail: `${pagesFound}/${requiredPages.length} pages found`,
  });
}

// Check 7: Browsers installed (this will be a warning, not a failure)
try {
  // Try to list installed browsers
  const browsers = execSync('npx playwright install --dry-run 2>&1', { encoding: 'utf-8' });
  if (browsers.includes('is already installed')) {
    checks.push({ name: 'Playwright browsers', status: 'PASS', detail: 'Browsers installed' });
  } else {
    checks.push({
      name: 'Playwright browsers',
      status: 'WARN',
      detail: 'Run: npx playwright install',
    });
  }
} catch (error) {
  checks.push({
    name: 'Playwright browsers',
    status: 'WARN',
    detail: 'Run: npx playwright install',
  });
}

// Print results
console.log('═'.repeat(70));
console.log('SETUP VERIFICATION RESULTS');
console.log('═'.repeat(70));

let passCount = 0;
let failCount = 0;
let warnCount = 0;

checks.forEach(check => {
  const icon =
    check.status === 'PASS' ? '✅' : check.status === 'FAIL' ? '❌' : '⚠️';
  const color =
    check.status === 'PASS' ? '\x1b[32m' : check.status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(
    `${icon} ${color}${check.status.padEnd(4)}${reset} │ ${check.name.padEnd(30)} │ ${check.detail}`
  );

  if (check.status === 'PASS') passCount++;
  else if (check.status === 'FAIL') failCount++;
  else warnCount++;
});

console.log('═'.repeat(70));
console.log(
  `\nResults: ${passCount} passed, ${failCount} failed, ${warnCount} warnings`
);

if (failCount > 0) {
  console.log('\n❌ Setup verification failed. Please fix the issues above.\n');
  process.exit(1);
} else if (warnCount > 0) {
  console.log('\n⚠️  Setup verification passed with warnings.');
  console.log('    Run the suggested commands to complete setup.\n');
} else {
  console.log('\n✅ Playwright setup verified successfully!\n');
  console.log('Next steps:');
  console.log('  1. Run smoke tests: npm test tests/smoke.spec.js');
  console.log('  2. Generate screenshots: npm run test:screenshot');
  console.log('  3. Run all tests: npm test\n');
}
