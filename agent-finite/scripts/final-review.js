#!/usr/bin/env node

/**
 * Final Review Script - Comprehensive Quality Check
 *
 * This script performs a thorough review of all pages and assets
 * to ensure production readiness.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  log('\n' + '='.repeat(80), 'cyan');
  log(text, 'bold');
  log('='.repeat(80), 'cyan');
}

function section(text) {
  log(`\n${text}`, 'blue');
  log('-'.repeat(text.length), 'blue');
}

function checkmark() {
  return `${colors.green}✓${colors.reset}`;
}

function cross() {
  return `${colors.red}✗${colors.reset}`;
}

// Statistics
const stats = {
  totalPages: 0,
  pagesWithErrors: 0,
  totalAssets: 0,
  missingAssets: 0,
  issues: [],
  warnings: []
};

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Check HTML file for required elements
function checkHTML(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check for required meta tags
  if (!content.includes('<!DOCTYPE html>')) {
    issues.push('Missing DOCTYPE declaration');
  }
  if (!content.includes('<meta charset=')) {
    issues.push('Missing charset meta tag');
  }
  if (!content.includes('<meta name="viewport"')) {
    issues.push('Missing viewport meta tag');
  }
  if (!content.includes('<title>')) {
    issues.push('Missing title tag');
  }

  // Check for design system assets
  if (!content.includes('design-system.css') && !content.includes('design-system.min.css')) {
    issues.push('Missing design-system.css');
  }
  if (!content.includes('components.css') && !content.includes('components.min.css')) {
    issues.push('Missing components.css');
  }
  if (!content.includes('animations.css') && !content.includes('animations.min.css')) {
    issues.push('Missing animations.css');
  }

  // Check for analytics
  if (!content.includes('analytics.js') && !content.includes('analytics.min.js')) {
    stats.warnings.push(`${fileName}: Missing analytics.js (optional)`);
  }

  // Check for Google Analytics
  if (!content.includes('gtag') && !content.includes('G-')) {
    stats.warnings.push(`${fileName}: Missing Google Analytics (optional)`);
  }

  return issues;
}

// Main review function
async function runReview() {
  header('GEMINI ADS - FINAL REVIEW & QUALITY CHECK');

  // 1. Check all HTML pages
  section('1. HTML Pages Review');

  const pagesDir = path.join(__dirname, '../pages');
  const htmlFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

  log(`Found ${htmlFiles.length} pages in pages/ directory`);

  htmlFiles.forEach(fileName => {
    const filePath = path.join(pagesDir, fileName);
    const fileSize = getFileSize(filePath);
    const issues = checkHTML(filePath, fileName);

    stats.totalPages++;

    if (issues.length > 0) {
      log(`${cross()} ${fileName} (${formatSize(fileSize)})`, 'red');
      issues.forEach(issue => {
        log(`    - ${issue}`, 'red');
        stats.issues.push(`${fileName}: ${issue}`);
      });
      stats.pagesWithErrors++;
    } else {
      log(`${checkmark()} ${fileName} (${formatSize(fileSize)})`, 'green');
    }
  });

  // Check index.html
  const indexPath = path.join(__dirname, '../index.html');
  if (fileExists(indexPath)) {
    const fileSize = getFileSize(indexPath);
    const issues = checkHTML(indexPath, 'index.html');
    stats.totalPages++;

    if (issues.length > 0) {
      log(`${cross()} index.html (${formatSize(fileSize)})`, 'red');
      issues.forEach(issue => {
        log(`    - ${issue}`, 'red');
        stats.issues.push(`index.html: ${issue}`);
      });
      stats.pagesWithErrors++;
    } else {
      log(`${checkmark()} index.html (${formatSize(fileSize)})`, 'green');
    }
  } else {
    log(`${cross()} index.html - NOT FOUND`, 'red');
    stats.issues.push('index.html: File not found');
  }

  // 2. Check required assets
  section('2. Required Assets Review');

  const requiredAssets = [
    'assets/css/design-system.css',
    'assets/css/components.css',
    'assets/css/animations.css',
    'assets/js/animations.js',
    'assets/js/analytics.js'
  ];

  requiredAssets.forEach(assetPath => {
    const fullPath = path.join(__dirname, '..', assetPath);
    stats.totalAssets++;

    if (fileExists(fullPath)) {
      const fileSize = getFileSize(fullPath);
      log(`${checkmark()} ${assetPath} (${formatSize(fileSize)})`, 'green');
    } else {
      log(`${cross()} ${assetPath} - NOT FOUND`, 'red');
      stats.issues.push(`Asset not found: ${assetPath}`);
      stats.missingAssets++;
    }
  });

  // 3. Check minified assets
  section('3. Minified Assets Review');

  const minifiedAssets = [
    'assets/css/design-system.min.css',
    'assets/css/animations.min.css',
    'assets/js/animations.min.js',
    'assets/js/analytics.min.js'
  ];

  minifiedAssets.forEach(assetPath => {
    const fullPath = path.join(__dirname, '..', assetPath);

    if (fileExists(fullPath)) {
      const fileSize = getFileSize(fullPath);
      log(`${checkmark()} ${assetPath} (${formatSize(fileSize)})`, 'green');
    } else {
      log(`${cross()} ${assetPath} - NOT FOUND (optional)`, 'yellow');
      stats.warnings.push(`Minified asset not found: ${assetPath}`);
    }
  });

  // 4. Check documentation
  section('4. Documentation Review');

  const docs = [
    'README.md',
    'project_context.md',
    'ideas.md',
    'reflections-and-best.md',
    'design_guidelines.md',
    'ANALYTICS_GUIDE.md',
    'CONTEXT.md'
  ];

  docs.forEach(doc => {
    const fullPath = path.join(__dirname, '..', doc);

    if (fileExists(fullPath)) {
      const fileSize = getFileSize(fullPath);
      log(`${checkmark()} ${doc} (${formatSize(fileSize)})`, 'green');
    } else {
      log(`${cross()} ${doc} - NOT FOUND`, 'yellow');
      stats.warnings.push(`Documentation not found: ${doc}`);
    }
  });

  // 5. Check test files
  section('5. Test Files Review');

  const testsDir = path.join(__dirname, '../tests');
  if (fs.existsSync(testsDir)) {
    const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.spec.js'));
    log(`Found ${testFiles.length} test files`);

    testFiles.forEach(fileName => {
      const filePath = path.join(testsDir, fileName);
      const fileSize = getFileSize(filePath);
      log(`${checkmark()} ${fileName} (${formatSize(fileSize)})`, 'green');
    });
  } else {
    log(`${cross()} tests/ directory not found`, 'red');
    stats.issues.push('tests/ directory not found');
  }

  // 6. Summary
  header('REVIEW SUMMARY');

  log(`\nPages:`);
  log(`  Total pages: ${stats.totalPages}`);
  log(`  Pages with errors: ${stats.pagesWithErrors}`, stats.pagesWithErrors > 0 ? 'red' : 'green');

  log(`\nAssets:`);
  log(`  Total required assets: ${stats.totalAssets}`);
  log(`  Missing assets: ${stats.missingAssets}`, stats.missingAssets > 0 ? 'red' : 'green');

  log(`\nIssues:`);
  if (stats.issues.length === 0) {
    log(`  ${checkmark()} No critical issues found!`, 'green');
  } else {
    log(`  ${cross()} ${stats.issues.length} critical issue(s) found:`, 'red');
    stats.issues.forEach(issue => {
      log(`    - ${issue}`, 'red');
    });
  }

  log(`\nWarnings:`);
  if (stats.warnings.length === 0) {
    log(`  ${checkmark()} No warnings!`, 'green');
  } else {
    log(`  ${stats.warnings.length} warning(s):`, 'yellow');
    stats.warnings.slice(0, 5).forEach(warning => {
      log(`    - ${warning}`, 'yellow');
    });
    if (stats.warnings.length > 5) {
      log(`    ... and ${stats.warnings.length - 5} more`, 'yellow');
    }
  }

  // Final verdict
  header('FINAL VERDICT');

  if (stats.pagesWithErrors === 0 && stats.missingAssets === 0 && stats.issues.length === 0) {
    log('\n🎉 ALL CHECKS PASSED! Project is ready for deployment! 🎉\n', 'green');
    return 0;
  } else {
    log('\n⚠️  Some issues need attention before deployment. ⚠️\n', 'yellow');
    return 1;
  }
}

// Run the review
runReview().then(exitCode => {
  process.exit(exitCode);
}).catch(err => {
  log(`\n❌ Review failed with error: ${err.message}\n`, 'red');
  console.error(err);
  process.exit(1);
});
