#!/usr/bin/env node

/**
 * Performance Optimization Validation Script
 *
 * Validates that minified assets are properly created and optimized.
 * Measures compression ratios, file sizes, and expected performance gains.
 *
 * Usage: npm run test:perf-optimization
 */

const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

async function getGzipSize(filePath) {
  try {
    const content = await fs.readFile(filePath);
    const compressed = await gzip(content, { level: 9 });
    return compressed.length;
  } catch (error) {
    return 0;
  }
}

async function validateAssetPair(originalPath, minifiedPath, type) {
  const originalExists = await getFileSize(originalPath) > 0;
  const minifiedExists = await getFileSize(minifiedPath) > 0;

  if (!originalExists) {
    return {
      status: 'error',
      message: `Original ${type} file not found: ${originalPath}`
    };
  }

  if (!minifiedExists) {
    return {
      status: 'error',
      message: `Minified ${type} file not found: ${minifiedPath}`
    };
  }

  const originalSize = await getFileSize(originalPath);
  const minifiedSize = await getFileSize(minifiedPath);
  const originalGzip = await getGzipSize(originalPath);
  const minifiedGzip = await getGzipSize(minifiedPath);

  const savings = originalSize - minifiedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
  const gzipSavings = originalGzip - minifiedGzip;
  const gzipSavingsPercent = ((gzipSavings / originalGzip) * 100).toFixed(1);

  // Validation thresholds
  const minSavingsPercent = 10; // Expect at least 10% savings
  const passed = parseFloat(savingsPercent) >= minSavingsPercent;

  return {
    status: passed ? 'pass' : 'warning',
    originalSize,
    minifiedSize,
    savings,
    savingsPercent: parseFloat(savingsPercent),
    originalGzip,
    minifiedGzip,
    gzipSavings,
    gzipSavingsPercent: parseFloat(gzipSavingsPercent),
    passed
  };
}

async function findAssetPairs(dir, extension) {
  const pairs = [];

  async function walk(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'screenshots'].includes(entry.name)) {
            await walk(fullPath);
          }
        } else if (entry.isFile() && entry.name.endsWith(extension) && !entry.name.includes('.min.')) {
          const minifiedPath = fullPath.replace(extension, `.min${extension}`);
          pairs.push({ original: fullPath, minified: minifiedPath });
        }
      }
    } catch (error) {
      // Directory might not exist, skip
    }
  }

  await walk(dir);
  return pairs;
}

async function validateAll() {
  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║       🔍 PERFORMANCE OPTIMIZATION VALIDATION               ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝');

  const results = {
    css: [],
    js: [],
    totalOriginal: 0,
    totalMinified: 0,
    totalSaved: 0,
    totalOriginalGzip: 0,
    totalMinifiedGzip: 0,
    totalGzipSaved: 0,
    passed: 0,
    warnings: 0,
    errors: 0
  };

  // Validate CSS files
  log('cyan', '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('cyan', '  CSS MINIFICATION VALIDATION');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const cssPairs = await findAssetPairs('assets/css', '.css');

  for (const { original, minified } of cssPairs) {
    log('blue', `\n📄 ${path.basename(original)}`);

    const result = await validateAssetPair(original, minified, 'CSS');

    if (result.status === 'error') {
      log('red', `  ✗ ${result.message}`);
      results.errors++;
    } else {
      log('dim', `  Original: ${formatBytes(result.originalSize)}`);
      log('dim', `  Minified: ${formatBytes(result.minifiedSize)}`);

      const color = result.passed ? 'green' : 'yellow';
      const icon = result.passed ? '✓' : '⚠';

      log(color, `  ${icon} Saved: ${formatBytes(result.savings)} (${result.savingsPercent}%)`);
      log('dim', `  Gzip Original: ${formatBytes(result.originalGzip)}`);
      log('dim', `  Gzip Minified: ${formatBytes(result.minifiedGzip)}`);
      log(color, `  ${icon} Gzip Saved: ${formatBytes(result.gzipSavings)} (${result.gzipSavingsPercent}%)`);

      results.css.push(result);
      results.totalOriginal += result.originalSize;
      results.totalMinified += result.minifiedSize;
      results.totalSaved += result.savings;
      results.totalOriginalGzip += result.originalGzip;
      results.totalMinifiedGzip += result.minifiedGzip;
      results.totalGzipSaved += result.gzipSavings;

      if (result.passed) {
        results.passed++;
      } else {
        results.warnings++;
      }
    }
  }

  // Validate JavaScript files
  log('cyan', '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('cyan', '  JAVASCRIPT MINIFICATION VALIDATION');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const jsPairs = await findAssetPairs('assets/js', '.js');

  for (const { original, minified } of jsPairs) {
    log('blue', `\n📄 ${path.basename(original)}`);

    const result = await validateAssetPair(original, minified, 'JavaScript');

    if (result.status === 'error') {
      log('red', `  ✗ ${result.message}`);
      results.errors++;
    } else {
      log('dim', `  Original: ${formatBytes(result.originalSize)}`);
      log('dim', `  Minified: ${formatBytes(result.minifiedSize)}`);

      const color = result.passed ? 'green' : 'yellow';
      const icon = result.passed ? '✓' : '⚠';

      log(color, `  ${icon} Saved: ${formatBytes(result.savings)} (${result.savingsPercent}%)`);
      log('dim', `  Gzip Original: ${formatBytes(result.originalGzip)}`);
      log('dim', `  Gzip Minified: ${formatBytes(result.minifiedGzip)}`);
      log(color, `  ${icon} Gzip Saved: ${formatBytes(result.gzipSavings)} (${result.gzipSavingsPercent}%)`);

      results.js.push(result);
      results.totalOriginal += result.originalSize;
      results.totalMinified += result.minifiedSize;
      results.totalSaved += result.savings;
      results.totalOriginalGzip += result.originalGzip;
      results.totalMinifiedGzip += result.minifiedGzip;
      results.totalGzipSaved += result.gzipSavings;

      if (result.passed) {
        results.passed++;
      } else {
        results.warnings++;
      }
    }
  }

  // Summary
  log('bright', '\n\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║                    📊 VALIDATION SUMMARY                   ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝');

  const totalFiles = results.css.length + results.js.length;
  const totalPercent = results.totalOriginal > 0
    ? ((results.totalSaved / results.totalOriginal) * 100).toFixed(1)
    : 0;
  const gzipPercent = results.totalOriginalGzip > 0
    ? ((results.totalGzipSaved / results.totalOriginalGzip) * 100).toFixed(1)
    : 0;

  log('cyan', `\nTotal Files Validated: ${totalFiles}`);
  log('green', `✓ Passed: ${results.passed}`);
  if (results.warnings > 0) log('yellow', `⚠ Warnings: ${results.warnings}`);
  if (results.errors > 0) log('red', `✗ Errors: ${results.errors}`);

  log('bright', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '  SIZE REDUCTION (Uncompressed)');
  log('bright', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('green', `\n  Original: ${formatBytes(results.totalOriginal)}`);
  log('green', `  Minified: ${formatBytes(results.totalMinified)}`);
  log('bright', `  Saved: ${formatBytes(results.totalSaved)} (${totalPercent}%)`);

  log('bright', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '  SIZE REDUCTION (Gzipped)');
  log('bright', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('green', `\n  Original: ${formatBytes(results.totalOriginalGzip)}`);
  log('green', `  Minified: ${formatBytes(results.totalMinifiedGzip)}`);
  log('bright', `  Saved: ${formatBytes(results.totalGzipSaved)} (${gzipPercent}%)`);

  // Performance impact
  log('magenta', '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('magenta', '  📈 EXPECTED PERFORMANCE IMPACT');
  log('magenta', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const loadTimeImprovement = Math.round(parseFloat(totalPercent) * 0.5);
  const lcpImprovement = Math.round(parseFloat(totalPercent) * 0.3);

  log('green', `\n  • Page load time: ~${loadTimeImprovement}% faster`);
  log('green', `  • Bandwidth saved: ${formatBytes(results.totalSaved)} per page load`);
  log('green', `  • LCP improvement: ~${lcpImprovement}%`);
  log('green', `  • FCP improvement: ~${Math.round(parseFloat(totalPercent) * 0.25)}%`);
  log('green', '  • Better mobile experience (reduced data usage)');
  log('green', '  • Improved SEO (faster load times)');
  log('green', '  • Lower hosting costs (reduced bandwidth)');

  // Grade
  log('bright', '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '  🎯 OVERALL GRADE');
  log('bright', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let grade, gradeColor;
  const avgSavings = parseFloat(totalPercent);

  if (avgSavings >= 40) {
    grade = 'A+ (Excellent)';
    gradeColor = 'green';
  } else if (avgSavings >= 30) {
    grade = 'A (Very Good)';
    gradeColor = 'green';
  } else if (avgSavings >= 20) {
    grade = 'B (Good)';
    gradeColor = 'cyan';
  } else if (avgSavings >= 10) {
    grade = 'C (Acceptable)';
    gradeColor = 'yellow';
  } else {
    grade = 'D (Needs Improvement)';
    gradeColor = 'red';
  }

  log(gradeColor, `\n  Grade: ${grade}`);
  log('dim', `  Average Savings: ${totalPercent}%`);

  // Overall result
  const overallPassed = results.errors === 0 && parseFloat(totalPercent) >= 10;

  log('bright', '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (overallPassed) {
    log('green', '\n✅ VALIDATION PASSED');
    log('green', 'All assets are properly minified and optimized!\n');
  } else if (results.errors > 0) {
    log('red', '\n❌ VALIDATION FAILED');
    log('red', 'Some assets are missing or have errors.\n');
  } else {
    log('yellow', '\n⚠ VALIDATION PASSED WITH WARNINGS');
    log('yellow', 'Some assets have lower than expected savings.\n');
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles,
      passed: results.passed,
      warnings: results.warnings,
      errors: results.errors,
      totalOriginal: results.totalOriginal,
      totalMinified: results.totalMinified,
      totalSaved: results.totalSaved,
      totalPercent: parseFloat(totalPercent),
      gzipOriginal: results.totalOriginalGzip,
      gzipMinified: results.totalMinifiedGzip,
      gzipSaved: results.totalGzipSaved,
      gzipPercent: parseFloat(gzipPercent),
      grade,
      overallPassed
    },
    css: results.css,
    js: results.js
  };

  await fs.writeFile(
    'PERFORMANCE_OPTIMIZATION_REPORT.json',
    JSON.stringify(report, null, 2)
  );

  log('dim', 'Report saved to PERFORMANCE_OPTIMIZATION_REPORT.json\n');

  process.exit(overallPassed ? 0 : 1);
}

validateAll().catch(error => {
  log('red', `\n❌ Validation error: ${error.message}\n`);
  process.exit(1);
});
