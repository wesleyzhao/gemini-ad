#!/usr/bin/env node

/**
 * Feature #76 Validation Tests
 * Tests scaling of winning patterns, mobile optimizations, and new pattern combinations
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const UPDATED_PAGES = [
  'pages/trust.html',
  'pages/workspace.html',
  'pages/research.html',
  'pages/productivity.html',
  'pages/apple-style.html',
  'pages/valentine.html',
  'pages/comparison.html',
  'pages/future.html'
];

const MOBILE_VIEWPORT = { width: 375, height: 667 }; // iPhone SE
const TABLET_VIEWPORT = { width: 768, height: 1024 }; // iPad
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

class Feature76Validator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      feature: 'Feature #76',
      totalTests: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  FEATURE #76 VALIDATION TESTS');
    console.log('  Scaling Winning Patterns + Mobile Optimization');
    console.log('═══════════════════════════════════════════════════════════\n');

    const browser = await chromium.launch({ headless: true });

    try {
      // Test 1: Verify pattern deployment
      await this.testPatternDeployment(browser);

      // Test 2: Verify mobile optimizations
      await this.testMobileOptimizations(browser);

      // Test 3: Verify responsive behavior
      await this.testResponsiveBehavior(browser);

      // Test 4: Verify performance
      await this.testPerformance(browser);

      // Test 5: Verify accessibility
      await this.testAccessibility(browser);

      // Test 6: Verify next pattern configs
      await this.testNextPatternConfigs();

      // Test 7: Take validation screenshots
      await this.takeValidationScreenshots(browser);

    } finally {
      await browser.close();
    }

    // Generate report
    this.generateReport();
  }

  async testPatternDeployment(browser) {
    console.log('\n📦 Test 1: Pattern Deployment Validation\n');

    for (const pagePath of UPDATED_PAGES) {
      this.results.totalTests++;

      const page = await browser.newPage();

      try {
        await page.goto(`file://${path.resolve(pagePath)}`, {
          waitUntil: 'networkidle'
        });

        // Check for urgency banner
        const urgencyBanner = await page.locator('[data-pattern="urgency"]').count();
        const bannerVisible = await page.locator('.urgency-banner').isVisible();
        const timerExists = await page.locator('#urgency-timer').count();

        const passed = urgencyBanner > 0 && bannerVisible && timerExists > 0;

        this.results.tests.push({
          name: `Pattern deployment: ${path.basename(pagePath)}`,
          passed,
          details: {
            urgencyCSS: urgencyBanner > 0,
            bannerVisible,
            timerExists: timerExists > 0
          }
        });

        if (passed) {
          this.results.passed++;
          console.log(`   ✅ ${path.basename(pagePath)} - Patterns deployed correctly`);
        } else {
          this.results.failed++;
          console.log(`   ❌ ${path.basename(pagePath)} - Pattern deployment issue`);
        }

      } catch (error) {
        this.results.failed++;
        this.results.tests.push({
          name: `Pattern deployment: ${path.basename(pagePath)}`,
          passed: false,
          error: error.message
        });
        console.log(`   ❌ ${path.basename(pagePath)} - Error: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  }

  async testMobileOptimizations(browser) {
    console.log('\n📱 Test 2: Mobile Optimization Validation\n');

    const testPage = UPDATED_PAGES[0]; // Test first page
    const page = await browser.newPage();

    try {
      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto(`file://${path.resolve(testPage)}`, {
        waitUntil: 'networkidle'
      });

      // Test 1: Banner height on mobile
      this.results.totalTests++;
      const bannerHeight = await page.locator('.urgency-banner').evaluate(el => el.offsetHeight);
      const bannerHeightCorrect = bannerHeight <= 50; // Should be ~40-45px on mobile

      this.results.tests.push({
        name: 'Mobile banner height optimization',
        passed: bannerHeightCorrect,
        details: {
          height: bannerHeight,
          expected: '≤ 50px',
          actual: `${bannerHeight}px`
        }
      });

      if (bannerHeightCorrect) {
        this.results.passed++;
        console.log(`   ✅ Banner height optimized for mobile: ${bannerHeight}px`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Banner too tall on mobile: ${bannerHeight}px`);
      }

      // Test 2: Body padding on mobile
      this.results.totalTests++;
      const bodyPadding = await page.evaluate(() => {
        return parseInt(window.getComputedStyle(document.body).paddingTop);
      });
      const paddingCorrect = bodyPadding >= 35 && bodyPadding <= 50;

      this.results.tests.push({
        name: 'Mobile body padding adjustment',
        passed: paddingCorrect,
        details: {
          padding: bodyPadding,
          expected: '40-50px',
          actual: `${bodyPadding}px`
        }
      });

      if (paddingCorrect) {
        this.results.passed++;
        console.log(`   ✅ Body padding correct on mobile: ${bodyPadding}px`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Body padding incorrect: ${bodyPadding}px`);
      }

      // Test 3: Font size reduction on mobile
      this.results.totalTests++;
      const fontSize = await page.locator('.urgency-content').evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });
      const fontSizeCorrect = fontSize <= 12;

      this.results.tests.push({
        name: 'Mobile font size optimization',
        passed: fontSizeCorrect,
        details: {
          fontSize,
          expected: '≤ 12px',
          actual: `${fontSize}px`
        }
      });

      if (fontSizeCorrect) {
        this.results.passed++;
        console.log(`   ✅ Font size optimized for mobile: ${fontSize}px`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Font size not optimized: ${fontSize}px`);
      }

    } catch (error) {
      console.log(`   ❌ Error testing mobile optimizations: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testResponsiveBehavior(browser) {
    console.log('\n📐 Test 3: Responsive Behavior Validation\n');

    const testPage = UPDATED_PAGES[0];
    const viewports = [
      { name: 'Mobile', ...MOBILE_VIEWPORT },
      { name: 'Tablet', ...TABLET_VIEWPORT },
      { name: 'Desktop', ...DESKTOP_VIEWPORT }
    ];

    for (const viewport of viewports) {
      this.results.totalTests++;
      const page = await browser.newPage();

      try {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`file://${path.resolve(testPage)}`, {
          waitUntil: 'networkidle'
        });

        // Check banner is visible and not overflowing
        const bannerVisible = await page.locator('.urgency-banner').isVisible();
        const bannerWidth = await page.locator('.urgency-banner').evaluate(el => el.offsetWidth);
        const viewportWidth = viewport.width;
        const widthCorrect = bannerWidth <= viewportWidth;

        const passed = bannerVisible && widthCorrect;

        this.results.tests.push({
          name: `Responsive behavior: ${viewport.name}`,
          passed,
          details: {
            viewport: `${viewport.width}x${viewport.height}`,
            bannerVisible,
            bannerWidth,
            overflow: !widthCorrect
          }
        });

        if (passed) {
          this.results.passed++;
          console.log(`   ✅ ${viewport.name} (${viewport.width}px) - Responsive OK`);
        } else {
          this.results.failed++;
          console.log(`   ❌ ${viewport.name} - Responsive issue`);
        }

      } catch (error) {
        this.results.failed++;
        console.log(`   ❌ ${viewport.name} - Error: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  }

  async testPerformance(browser) {
    console.log('\n⚡ Test 4: Performance Validation\n');

    const testPage = UPDATED_PAGES[0];
    const page = await browser.newPage();

    try {
      await page.setViewportSize(MOBILE_VIEWPORT);

      // Measure load time
      const startTime = Date.now();
      await page.goto(`file://${path.resolve(testPage)}`, {
        waitUntil: 'networkidle'
      });
      const loadTime = Date.now() - startTime;

      // Test: Load time should be reasonable (< 3s for local file)
      this.results.totalTests++;
      const loadTimeOK = loadTime < 3000;

      this.results.tests.push({
        name: 'Page load time (mobile)',
        passed: loadTimeOK,
        details: {
          loadTime: `${loadTime}ms`,
          expected: '< 3000ms'
        }
      });

      if (loadTimeOK) {
        this.results.passed++;
        console.log(`   ✅ Load time: ${loadTime}ms`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Load time too slow: ${loadTime}ms`);
      }

      // Test: JavaScript errors
      this.results.totalTests++;
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.waitForTimeout(2000); // Wait for any delayed scripts

      const noErrors = errors.length === 0;

      this.results.tests.push({
        name: 'JavaScript errors',
        passed: noErrors,
        details: {
          errors: errors.length,
          messages: errors
        }
      });

      if (noErrors) {
        this.results.passed++;
        console.log(`   ✅ No JavaScript errors`);
      } else {
        this.results.failed++;
        console.log(`   ❌ ${errors.length} JavaScript errors found`);
      }

    } catch (error) {
      console.log(`   ❌ Error testing performance: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testAccessibility(browser) {
    console.log('\n♿ Test 5: Accessibility Validation\n');

    const testPage = UPDATED_PAGES[0];
    const page = await browser.newPage();

    try {
      await page.goto(`file://${path.resolve(testPage)}`, {
        waitUntil: 'networkidle'
      });

      // Test: ARIA attributes on urgency banner
      this.results.totalTests++;
      const hasRole = await page.locator('.urgency-banner[role="banner"]').count() > 0;
      const hasAriaLive = await page.locator('.urgency-banner[aria-live]').count() > 0;

      const ariaCorrect = hasRole && hasAriaLive;

      this.results.tests.push({
        name: 'ARIA attributes on urgency banner',
        passed: ariaCorrect,
        details: {
          hasRole,
          hasAriaLive
        }
      });

      if (ariaCorrect) {
        this.results.passed++;
        console.log(`   ✅ ARIA attributes present`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Missing ARIA attributes`);
      }

      // Test: Keyboard navigation
      this.results.totalTests++;
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);

      const keyboardNavOK = focusedElement !== 'BODY';

      this.results.tests.push({
        name: 'Keyboard navigation',
        passed: keyboardNavOK,
        details: {
          firstFocusableElement: focusedElement
        }
      });

      if (keyboardNavOK) {
        this.results.passed++;
        console.log(`   ✅ Keyboard navigation works`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Keyboard navigation issue`);
      }

    } catch (error) {
      console.log(`   ❌ Error testing accessibility: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testNextPatternConfigs() {
    console.log('\n🧪 Test 6: Next Pattern Configuration Validation\n');

    const configPath = 'ab-tests/next-pattern-combinations/test-config.json';
    const libraryPath = 'ab-tests/next-pattern-combinations/pattern-library.json';

    // Test: Config file exists
    this.results.totalTests++;
    const configExists = fs.existsSync(configPath);

    this.results.tests.push({
      name: 'Next pattern test config exists',
      passed: configExists,
      details: { path: configPath }
    });

    if (configExists) {
      this.results.passed++;
      console.log(`   ✅ Test config file exists`);
    } else {
      this.results.failed++;
      console.log(`   ❌ Test config file missing`);
      return;
    }

    // Test: Config is valid JSON
    this.results.totalTests++;
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const hasNewTests = config.newTests && config.newTests.length >= 3;

      this.results.tests.push({
        name: 'Next pattern config validity',
        passed: hasNewTests,
        details: {
          testsCount: config.newTests ? config.newTests.length : 0,
          patterns: config.newTests ? config.newTests.map(t => t.pattern) : []
        }
      });

      if (hasNewTests) {
        this.results.passed++;
        console.log(`   ✅ Config valid with ${config.newTests.length} new tests`);
      } else {
        this.results.failed++;
        console.log(`   ❌ Config invalid or missing tests`);
      }
    } catch (error) {
      this.results.failed++;
      console.log(`   ❌ Config parsing error: ${error.message}`);
    }

    // Test: Pattern library exists
    this.results.totalTests++;
    const libraryExists = fs.existsSync(libraryPath);

    this.results.tests.push({
      name: 'Pattern library exists',
      passed: libraryExists,
      details: { path: libraryPath }
    });

    if (libraryExists) {
      this.results.passed++;
      console.log(`   ✅ Pattern library exists`);
    } else {
      this.results.failed++;
      console.log(`   ❌ Pattern library missing`);
    }
  }

  async takeValidationScreenshots(browser) {
    console.log('\n📸 Test 7: Taking Validation Screenshots\n');

    const screenshotDir = 'screenshots/feature-76';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const testPages = UPDATED_PAGES.slice(0, 3); // Test first 3 pages
    const viewports = [
      { name: 'mobile', ...MOBILE_VIEWPORT },
      { name: 'desktop', ...DESKTOP_VIEWPORT }
    ];

    for (const pagePath of testPages) {
      for (const viewport of viewports) {
        this.results.totalTests++;
        const page = await browser.newPage();

        try {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(`file://${path.resolve(pagePath)}`, {
            waitUntil: 'networkidle'
          });

          const pageName = path.basename(pagePath, '.html');
          const screenshotPath = path.join(screenshotDir, `${pageName}-${viewport.name}.png`);

          await page.screenshot({
            path: screenshotPath,
            fullPage: false // Above-fold only
          });

          this.results.tests.push({
            name: `Screenshot: ${pageName} (${viewport.name})`,
            passed: true,
            details: { path: screenshotPath }
          });

          this.results.passed++;
          console.log(`   ✅ ${pageName} (${viewport.name})`);

        } catch (error) {
          this.results.failed++;
          console.log(`   ❌ ${path.basename(pagePath)} (${viewport.name}) - Error`);
        } finally {
          await page.close();
        }
      }
    }
  }

  generateReport() {
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('  VALIDATION REPORT');
    console.log('═══════════════════════════════════════════════════════════\n');

    const passRate = ((this.results.passed / this.results.totalTests) * 100).toFixed(1);

    console.log(`Total Tests: ${this.results.totalTests}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`Pass Rate: ${passRate}%`);

    // Determine grade
    let grade = 'F';
    if (passRate >= 95) grade = 'A+';
    else if (passRate >= 90) grade = 'A';
    else if (passRate >= 85) grade = 'B+';
    else if (passRate >= 80) grade = 'B';
    else if (passRate >= 75) grade = 'C';
    else if (passRate >= 70) grade = 'D';

    console.log(`Grade: ${grade}`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(t => !t.passed)
        .forEach(t => console.log(`   - ${t.name}`));
    }

    // Save report
    const reportDir = 'test-reports-feature-76';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, 'validation-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Status
    console.log('\n═══════════════════════════════════════════════════════════');
    if (passRate >= 90) {
      console.log('  ✅ FEATURE #76 VALIDATION: PASSED');
    } else if (passRate >= 75) {
      console.log('  ⚠️  FEATURE #76 VALIDATION: NEEDS IMPROVEMENT');
    } else {
      console.log('  ❌ FEATURE #76 VALIDATION: FAILED');
    }
    console.log('═══════════════════════════════════════════════════════════\n');
  }
}

// Run tests
const validator = new Feature76Validator();
validator.runAllTests().catch(error => {
  console.error('❌ Validation error:', error);
  process.exit(1);
});
