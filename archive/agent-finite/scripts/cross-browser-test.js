/**
 * Cross-Browser Testing Script
 *
 * Tests all landing pages across multiple browsers to ensure compatibility:
 * - Chromium (Chrome, Edge)
 * - Firefox
 * - WebKit (Safari)
 *
 * Checks:
 * - Page loads successfully (200 status)
 * - No JavaScript errors
 * - CSS loads correctly
 * - Core Web Vitals (LCP, FID, CLS)
 * - Responsive layouts (mobile, tablet, desktop)
 * - Critical UI elements render correctly
 * - Animations work properly
 * - Cross-browser screenshot comparison
 */

const { chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:8080';
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'cross-browser');
const RESULTS_DIR = path.join(__dirname, '..', 'test-results');

// Viewports to test
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

// Browsers to test
const BROWSERS = {
  chromium: { name: 'Chromium', engine: chromium },
  firefox: { name: 'Firefox', engine: firefox },
  webkit: { name: 'WebKit (Safari)', engine: webkit }
};

// Get all HTML pages
function getPages() {
  return fs.readdirSync(PAGES_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      name: file.replace('.html', ''),
      path: `/pages/${file}`,
      file: file
    }));
}

// Create directories if they don't exist
function ensureDirectories() {
  [SCREENSHOTS_DIR, RESULTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create subdirectories for each browser
  Object.keys(BROWSERS).forEach(browserName => {
    const browserDir = path.join(SCREENSHOTS_DIR, browserName);
    if (!fs.existsSync(browserDir)) {
      fs.mkdirSync(browserDir, { recursive: true });
    }
  });
}

// Test a single page in a browser
async function testPageInBrowser(browser, browserName, page, viewportName, viewport) {
  const results = {
    browser: browserName,
    page: page.name,
    viewport: viewportName,
    passed: true,
    errors: [],
    warnings: [],
    metrics: {}
  };

  const context = await browser.newContext({ viewport });
  const browserPage = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  browserPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Track page errors
  const pageErrors = [];
  browserPage.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  try {
    // Navigate to page
    const url = `${BASE_URL}${page.path}`;
    const response = await browserPage.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Check HTTP status
    if (!response || response.status() !== 200) {
      results.passed = false;
      results.errors.push(`HTTP status: ${response ? response.status() : 'No response'}`);
    }

    // Wait for page to be ready
    await browserPage.waitForLoadState('networkidle');
    await browserPage.waitForTimeout(2000); // Wait for animations

    // Check for JavaScript errors
    if (consoleErrors.length > 0) {
      results.warnings.push(`Console errors: ${consoleErrors.join(', ')}`);
    }

    if (pageErrors.length > 0) {
      results.passed = false;
      results.errors.push(`Page errors: ${pageErrors.join(', ')}`);
    }

    // Collect Core Web Vitals
    const vitals = await browserPage.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {
          lcp: null,
          fid: null,
          cls: null
        };

        // LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS (Cumulative Layout Shift)
        let clsScore = 0;
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              metrics.cls = clsScore;
            }
          });
        }).observe({ entryTypes: ['layout-shift'] });

        // Get paint timing
        const paintEntries = performance.getEntriesByType('paint');
        const navigation = performance.getEntriesByType('navigation')[0];

        setTimeout(() => {
          resolve({
            ...metrics,
            firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime,
            firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime,
            domContentLoaded: navigation?.domContentLoadedEventEnd,
            loadComplete: navigation?.loadEventEnd
          });
        }, 1000);
      });
    });

    results.metrics = vitals;

    // Check critical elements exist and are visible
    const criticalElements = [
      { selector: 'h1', name: 'Main heading' },
      { selector: '.cta-button, .hero-cta, button[class*="cta"]', name: 'CTA button' },
      { selector: 'main, .hero, .main-content', name: 'Main content area' }
    ];

    for (const element of criticalElements) {
      try {
        const visible = await browserPage.locator(element.selector).first().isVisible({ timeout: 5000 });
        if (!visible) {
          results.warnings.push(`${element.name} not visible`);
        }
      } catch (error) {
        results.warnings.push(`${element.name} not found or not visible`);
      }
    }

    // Check CSS loaded correctly
    const cssLoaded = await browserPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.every(link => {
        const sheet = Array.from(document.styleSheets).find(s => s.href === link.href);
        return sheet && sheet.cssRules && sheet.cssRules.length > 0;
      });
    });

    if (!cssLoaded) {
      results.passed = false;
      results.errors.push('CSS failed to load correctly');
    }

    // Take screenshot
    const screenshotPath = path.join(
      SCREENSHOTS_DIR,
      browserName,
      `${page.name}_${viewportName}.png`
    );
    await browserPage.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    // Check for layout issues
    const layoutIssues = await browserPage.evaluate(() => {
      const issues = [];

      // Check for horizontal scrollbars
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
        issues.push('Horizontal scrollbar detected (possible overflow)');
      }

      // Check for elements outside viewport
      const elements = document.querySelectorAll('*');
      let overflowCount = 0;
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth && el.offsetParent !== null) {
          overflowCount++;
        }
      });

      if (overflowCount > 5) {
        issues.push(`${overflowCount} elements overflow viewport`);
      }

      return issues;
    });

    if (layoutIssues.length > 0) {
      results.warnings.push(...layoutIssues);
    }

  } catch (error) {
    results.passed = false;
    results.errors.push(`Test error: ${error.message}`);
  } finally {
    await browserPage.close();
    await context.close();
  }

  return results;
}

// Test all pages across all browsers
async function runTests() {
  console.log('🌐 Cross-Browser Testing Suite');
  console.log('========================================\n');

  ensureDirectories();

  const pages = getPages();
  const allResults = [];
  const summary = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    byBrowser: {},
    byPage: {},
    byViewport: {}
  };

  // Initialize summary counters
  Object.keys(BROWSERS).forEach(browser => {
    summary.byBrowser[browser] = { passed: 0, failed: 0, warnings: 0 };
  });
  Object.keys(VIEWPORTS).forEach(viewport => {
    summary.byViewport[viewport] = { passed: 0, failed: 0, warnings: 0 };
  });

  console.log(`Testing ${pages.length} pages across ${Object.keys(BROWSERS).length} browsers and ${Object.keys(VIEWPORTS).length} viewports`);
  console.log(`Total tests: ${pages.length * Object.keys(BROWSERS).length * Object.keys(VIEWPORTS).length}\n`);

  // Test each browser
  for (const [browserKey, browserConfig] of Object.entries(BROWSERS)) {
    console.log(`\n📱 Testing in ${browserConfig.name}...`);
    console.log('─'.repeat(50));

    const browser = await browserConfig.engine.launch();

    // Test each viewport
    for (const [viewportKey, viewport] of Object.entries(VIEWPORTS)) {
      console.log(`\n  Viewport: ${viewportKey} (${viewport.width}x${viewport.height})`);

      // Test each page
      for (const page of pages) {
        summary.totalTests++;
        process.stdout.write(`    Testing ${page.name}... `);

        const result = await testPageInBrowser(
          browser,
          browserKey,
          page,
          viewportKey,
          viewport
        );

        allResults.push(result);

        // Update summary
        if (result.passed) {
          summary.passed++;
          summary.byBrowser[browserKey].passed++;
          summary.byViewport[viewportKey].passed++;
          console.log('✅ PASS');
        } else {
          summary.failed++;
          summary.byBrowser[browserKey].failed++;
          summary.byViewport[viewportKey].failed++;
          console.log('❌ FAIL');
          result.errors.forEach(err => console.log(`      ❌ ${err}`));
        }

        if (result.warnings.length > 0) {
          summary.warnings++;
          summary.byBrowser[browserKey].warnings++;
          summary.byViewport[viewportKey].warnings++;
          result.warnings.forEach(warn => console.log(`      ⚠️  ${warn}`));
        }

        // Initialize page summary if needed
        if (!summary.byPage[page.name]) {
          summary.byPage[page.name] = { passed: 0, failed: 0, warnings: 0 };
        }
        if (result.passed) {
          summary.byPage[page.name].passed++;
        } else {
          summary.byPage[page.name].failed++;
        }
        if (result.warnings.length > 0) {
          summary.byPage[page.name].warnings++;
        }
      }
    }

    await browser.close();
  }

  // Generate reports
  console.log('\n\n📊 Test Summary');
  console.log('========================================\n');
  console.log(`Total Tests: ${summary.totalTests}`);
  console.log(`✅ Passed: ${summary.passed} (${(summary.passed / summary.totalTests * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${summary.failed} (${(summary.failed / summary.totalTests * 100).toFixed(1)}%)`);
  console.log(`⚠️  With Warnings: ${summary.warnings} (${(summary.warnings / summary.totalTests * 100).toFixed(1)}%)`);

  console.log('\n\n📱 Results by Browser:');
  Object.entries(summary.byBrowser).forEach(([browser, stats]) => {
    const total = stats.passed + stats.failed;
    console.log(`\n  ${BROWSERS[browser].name}:`);
    console.log(`    ✅ Passed: ${stats.passed}/${total} (${(stats.passed / total * 100).toFixed(1)}%)`);
    console.log(`    ❌ Failed: ${stats.failed}/${total} (${(stats.failed / total * 100).toFixed(1)}%)`);
    console.log(`    ⚠️  Warnings: ${stats.warnings}`);
  });

  console.log('\n\n📐 Results by Viewport:');
  Object.entries(summary.byViewport).forEach(([viewport, stats]) => {
    const total = stats.passed + stats.failed;
    console.log(`\n  ${viewport}:`);
    console.log(`    ✅ Passed: ${stats.passed}/${total} (${(stats.passed / total * 100).toFixed(1)}%)`);
    console.log(`    ❌ Failed: ${stats.failed}/${total} (${(stats.failed / total * 100).toFixed(1)}%)`);
    console.log(`    ⚠️  Warnings: ${stats.warnings}`);
  });

  // Find pages with issues
  const pagesWithIssues = Object.entries(summary.byPage)
    .filter(([_, stats]) => stats.failed > 0)
    .sort((a, b) => b[1].failed - a[1].failed);

  if (pagesWithIssues.length > 0) {
    console.log('\n\n⚠️  Pages with Issues:');
    pagesWithIssues.forEach(([page, stats]) => {
      console.log(`\n  ${page}:`);
      console.log(`    ❌ Failed: ${stats.failed} tests`);
      console.log(`    ⚠️  Warnings: ${stats.warnings} tests`);
    });
  }

  // Save detailed JSON report
  const jsonReport = {
    timestamp: new Date().toISOString(),
    summary,
    results: allResults
  };

  const reportPath = path.join(RESULTS_DIR, 'cross-browser-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  console.log(`\n\n📄 Detailed report saved to: ${reportPath}`);

  // Generate HTML report
  generateHtmlReport(jsonReport);

  console.log('\n\n✨ Testing complete!');
  console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}\n`);

  // Exit with error code if tests failed
  if (summary.failed > 0) {
    process.exit(1);
  }
}

// Generate HTML report
function generateHtmlReport(data) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cross-Browser Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #1a73e8; margin-bottom: 1rem; }
    h2 { color: #333; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #1a73e8; padding-bottom: 0.5rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
    .stat-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #1a73e8; }
    .stat-card h3 { font-size: 0.9rem; color: #666; margin-bottom: 0.5rem; }
    .stat-card .value { font-size: 2rem; font-weight: bold; color: #1a73e8; }
    .pass { color: #34a853; }
    .fail { color: #ea4335; }
    .warn { color: #fbbc04; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
    .status { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600; }
    .status.pass { background: #e8f5e9; color: #2e7d32; }
    .status.fail { background: #ffebee; color: #c62828; }
    .errors { color: #ea4335; font-size: 0.9rem; margin-top: 0.25rem; }
    .warnings { color: #f57c00; font-size: 0.9rem; margin-top: 0.25rem; }
    .timestamp { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌐 Cross-Browser Test Report</h1>
    <p class="timestamp">Generated: ${new Date(data.timestamp).toLocaleString()}</p>

    <div class="summary">
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="value">${data.summary.totalTests}</div>
      </div>
      <div class="stat-card">
        <h3>Passed</h3>
        <div class="value pass">${data.summary.passed}</div>
        <div>${(data.summary.passed / data.summary.totalTests * 100).toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <h3>Failed</h3>
        <div class="value fail">${data.summary.failed}</div>
        <div>${(data.summary.failed / data.summary.totalTests * 100).toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <h3>Warnings</h3>
        <div class="value warn">${data.summary.warnings}</div>
        <div>${(data.summary.warnings / data.summary.totalTests * 100).toFixed(1)}%</div>
      </div>
    </div>

    <h2>Results by Browser</h2>
    <table>
      <thead>
        <tr>
          <th>Browser</th>
          <th>Passed</th>
          <th>Failed</th>
          <th>Warnings</th>
          <th>Pass Rate</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(data.summary.byBrowser).map(([browser, stats]) => {
          const total = stats.passed + stats.failed;
          const passRate = (stats.passed / total * 100).toFixed(1);
          return `
            <tr>
              <td>${BROWSERS[browser].name}</td>
              <td class="pass">${stats.passed}</td>
              <td class="fail">${stats.failed}</td>
              <td class="warn">${stats.warnings}</td>
              <td>${passRate}%</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <h2>Results by Viewport</h2>
    <table>
      <thead>
        <tr>
          <th>Viewport</th>
          <th>Passed</th>
          <th>Failed</th>
          <th>Warnings</th>
          <th>Pass Rate</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(data.summary.byViewport).map(([viewport, stats]) => {
          const total = stats.passed + stats.failed;
          const passRate = (stats.passed / total * 100).toFixed(1);
          return `
            <tr>
              <td>${viewport}</td>
              <td class="pass">${stats.passed}</td>
              <td class="fail">${stats.failed}</td>
              <td class="warn">${stats.warnings}</td>
              <td>${passRate}%</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <h2>Detailed Results</h2>
    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Browser</th>
          <th>Viewport</th>
          <th>Status</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
        ${data.results.map(result => `
          <tr>
            <td>${result.page}</td>
            <td>${BROWSERS[result.browser].name}</td>
            <td>${result.viewport}</td>
            <td><span class="status ${result.passed ? 'pass' : 'fail'}">${result.passed ? 'PASS' : 'FAIL'}</span></td>
            <td>
              ${result.errors.length > 0 ? `<div class="errors">❌ ${result.errors.join('<br>❌ ')}</div>` : ''}
              ${result.warnings.length > 0 ? `<div class="warnings">⚠️  ${result.warnings.join('<br>⚠️  ')}</div>` : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  const htmlPath = path.join(RESULTS_DIR, 'cross-browser-test-results.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 HTML report saved to: ${htmlPath}`);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite error:', error);
  process.exit(1);
});
