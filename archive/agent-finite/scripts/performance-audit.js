#!/usr/bin/env node

/**
 * ============================================
 * PERFORMANCE-AUDIT.JS - Performance Auditing
 * ============================================
 *
 * Audits performance of all landing pages using Playwright
 * Measures: Load time, resource sizes, Core Web Vitals
 *
 * Usage:
 *   node scripts/performance-audit.js
 *   npm run perf:audit
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/* ============================================
   CONFIGURATION
   ============================================ */

const CONFIG = {
  baseUrl: 'http://localhost:8080',
  pagesDir: path.join(__dirname, '..', 'pages'),
  outputDir: path.join(__dirname, '..', 'performance-reports'),
  thresholds: {
    loadTime: 2000, // 2 seconds
    firstContentfulPaint: 1000, // 1 second
    largestContentfulPaint: 2500, // 2.5 seconds
    totalSize: 500 * 1024, // 500 KB
    cssSize: 100 * 1024, // 100 KB
    jsSize: 100 * 1024 // 100 KB
  }
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function checkThreshold(value, threshold, inverse = false) {
  if (inverse) {
    return value <= threshold ? '✅' : '❌';
  }
  return value >= threshold ? '✅' : '❌';
}

/* ============================================
   PERFORMANCE AUDITING
   ============================================ */

async function auditPage(page, pageUrl, pageName) {
  const metrics = {
    name: pageName,
    url: pageUrl,
    timestamp: new Date().toISOString()
  };

  try {
    // Navigate and collect performance metrics
    await page.goto(pageUrl, { waitUntil: 'networkidle' });

    // Get performance timing
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintData = performance.getEntriesByType('paint');

      return {
        // Navigation timing
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        responseTime: perfData.responseEnd - perfData.requestStart,

        // Paint timing
        firstPaint: paintData.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintData.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

        // Total duration
        totalLoadTime: perfData.loadEventEnd - perfData.fetchStart
      };
    });

    metrics.timing = performanceMetrics;

    // Get resource sizes
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');

      const sizes = {
        total: 0,
        html: 0,
        css: 0,
        js: 0,
        images: 0,
        fonts: 0,
        other: 0
      };

      const counts = {
        total: resources.length,
        html: 0,
        css: 0,
        js: 0,
        images: 0,
        fonts: 0,
        other: 0
      };

      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        sizes.total += size;

        if (resource.initiatorType === 'link' && resource.name.includes('.css')) {
          sizes.css += size;
          counts.css++;
        } else if (resource.initiatorType === 'script' || resource.name.includes('.js')) {
          sizes.js += size;
          counts.js++;
        } else if (resource.initiatorType === 'img' || /\.(jpg|jpeg|png|gif|svg|webp)/.test(resource.name)) {
          sizes.images += size;
          counts.images++;
        } else if (/\.(woff|woff2|ttf|eot)/.test(resource.name)) {
          sizes.fonts += size;
          counts.fonts++;
        } else if (resource.initiatorType === 'navigation') {
          sizes.html += size;
          counts.html++;
        } else {
          sizes.other += size;
          counts.other++;
        }
      });

      return { sizes, counts };
    });

    metrics.resources = resourceMetrics;

    // Get layout shift score (CLS approximation)
    const layoutShiftScore = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
        });

        try {
          observer.observe({ entryTypes: ['layout-shift'] });
          setTimeout(() => {
            observer.disconnect();
            resolve(cls);
          }, 1000);
        } catch (e) {
          resolve(0);
        }
      });
    });

    metrics.layoutShift = layoutShiftScore;

    // Check thresholds
    metrics.passed = {
      loadTime: metrics.timing.totalLoadTime <= CONFIG.thresholds.loadTime,
      fcp: metrics.timing.firstContentfulPaint <= CONFIG.thresholds.firstContentfulPaint,
      totalSize: metrics.resources.sizes.total <= CONFIG.thresholds.totalSize,
      cssSize: metrics.resources.sizes.css <= CONFIG.thresholds.cssSize,
      jsSize: metrics.resources.sizes.js <= CONFIG.thresholds.jsSize
    };

    metrics.score = Object.values(metrics.passed).filter(v => v).length;
    metrics.totalChecks = Object.keys(metrics.passed).length;

  } catch (error) {
    console.error(`❌ Error auditing ${pageName}:`, error.message);
    metrics.error = error.message;
  }

  return metrics;
}

/* ============================================
   REPORT GENERATION
   ============================================ */

function generateConsoleReport(results) {
  console.log('\n' + '═'.repeat(100));
  console.log('📊 PERFORMANCE AUDIT REPORT');
  console.log('═'.repeat(100));

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.name}`);
    console.log('─'.repeat(100));

    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
      return;
    }

    // Timing metrics
    console.log('   ⏱️  Timing:');
    console.log(`      Load Time: ${formatTime(result.timing.totalLoadTime)} ${checkThreshold(result.timing.totalLoadTime, CONFIG.thresholds.loadTime, true)}`);
    console.log(`      FCP: ${formatTime(result.timing.firstContentfulPaint)} ${checkThreshold(result.timing.firstContentfulPaint, CONFIG.thresholds.firstContentfulPaint, true)}`);
    console.log(`      DOM Interactive: ${formatTime(result.timing.domInteractive)}`);

    // Resource metrics
    console.log('   📦 Resources:');
    console.log(`      Total Size: ${formatBytes(result.resources.sizes.total)} ${checkThreshold(result.resources.sizes.total, CONFIG.thresholds.totalSize, true)}`);
    console.log(`      CSS: ${formatBytes(result.resources.sizes.css)} (${result.resources.counts.css} files) ${checkThreshold(result.resources.sizes.css, CONFIG.thresholds.cssSize, true)}`);
    console.log(`      JS: ${formatBytes(result.resources.sizes.js)} (${result.resources.counts.js} files) ${checkThreshold(result.resources.sizes.js, CONFIG.thresholds.jsSize, true)}`);
    console.log(`      Images: ${formatBytes(result.resources.sizes.images)} (${result.resources.counts.images} files)`);
    console.log(`      Fonts: ${formatBytes(result.resources.sizes.fonts)} (${result.resources.counts.fonts} files)`);

    // Layout shift
    console.log(`   📐 Layout Shift: ${result.layoutShift.toFixed(4)} ${result.layoutShift < 0.1 ? '✅' : result.layoutShift < 0.25 ? '⚠️' : '❌'}`);

    // Score
    console.log(`   🎯 Score: ${result.score}/${result.totalChecks} checks passed`);
  });

  // Summary
  console.log('\n' + '═'.repeat(100));
  console.log('📈 SUMMARY');
  console.log('═'.repeat(100));

  const totalPages = results.filter(r => !r.error).length;
  const avgLoadTime = results.filter(r => !r.error).reduce((sum, r) => sum + r.timing.totalLoadTime, 0) / totalPages;
  const avgSize = results.filter(r => !r.error).reduce((sum, r) => sum + r.resources.sizes.total, 0) / totalPages;
  const pagesPassed = results.filter(r => !r.error && r.score === r.totalChecks).length;

  console.log(`   Total Pages: ${results.length}`);
  console.log(`   Pages Audited: ${totalPages}`);
  console.log(`   Pages Passed: ${pagesPassed}/${totalPages} (${((pagesPassed/totalPages)*100).toFixed(1)}%)`);
  console.log(`   Average Load Time: ${formatTime(avgLoadTime)}`);
  console.log(`   Average Page Size: ${formatBytes(avgSize)}`);
  console.log('═'.repeat(100) + '\n');
}

function saveJSONReport(results) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `performance-audit-${timestamp}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
  console.log(`💾 Detailed report saved to: ${filepath}\n`);
}

/* ============================================
   MAIN EXECUTION
   ============================================ */

async function main() {
  console.log('🚀 Starting Performance Audit...\n');
  console.log('⚠️  Note: Make sure the development server is running on http://localhost:8080');
  console.log('   Run: npm run serve\n');

  // Get all HTML files
  const files = fs.readdirSync(CONFIG.pagesDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));

  console.log(`📄 Found ${htmlFiles.length} pages to audit\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = [];

  for (const file of htmlFiles) {
    const pageName = file.replace('.html', '');
    const pageUrl = `${CONFIG.baseUrl}/pages/${file}`;

    console.log(`🔍 Auditing: ${pageName}...`);
    const metrics = await auditPage(page, pageUrl, pageName);
    results.push(metrics);
  }

  await browser.close();

  // Generate reports
  generateConsoleReport(results);
  saveJSONReport(results);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
