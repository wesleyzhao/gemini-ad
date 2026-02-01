#!/usr/bin/env node

/**
 * Feature #76 Simple Validation (No Browser Required)
 * Validates file existence, code patterns, and configuration
 */

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

class Feature76SimpleValidator {
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

  runAllTests() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  FEATURE #76 VALIDATION (Simple)');
    console.log('  Scaling Winning Patterns + Mobile Optimization');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test 1: Pattern deployment in pages
    this.testPatternDeployment();

    // Test 2: Mobile optimizations in code
    this.testMobileOptimizations();

    // Test 3: Script files exist
    this.testScriptFiles();

    // Test 4: Documentation exists
    this.testDocumentation();

    // Test 5: Next pattern configurations
    this.testNextPatternConfigs();

    // Test 6: Reports generated
    this.testReports();

    // Generate summary
    this.generateReport();
  }

  testPatternDeployment() {
    console.log('\n📦 Test 1: Pattern Deployment in Pages\n');

    for (const pagePath of UPDATED_PAGES) {
      this.results.totalTests++;

      if (!fs.existsSync(pagePath)) {
        this.results.failed++;
        this.results.tests.push({
          name: `Pattern deployment: ${path.basename(pagePath)}`,
          passed: false,
          details: { error: 'File not found' }
        });
        console.log(`   ❌ ${path.basename(pagePath)} - File not found`);
        continue;
      }

      const html = fs.readFileSync(pagePath, 'utf8');

      // Check for urgency pattern
      const hasUrgencyCSS = html.includes('data-pattern="urgency"');
      const hasUrgencyBanner = html.includes('class="urgency-banner"');
      const hasTimer = html.includes('id="urgency-timer"');
      const hasTimerScript = html.includes('updateTimer()');
      const hasMobileCSS = html.includes('@media (max-width: 768px)');

      const passed = hasUrgencyCSS && hasUrgencyBanner && hasTimer && hasTimerScript && hasMobileCSS;

      this.results.tests.push({
        name: `Pattern deployment: ${path.basename(pagePath)}`,
        passed,
        details: {
          urgencyCSS: hasUrgencyCSS,
          urgencyBanner: hasUrgencyBanner,
          timer: hasTimer,
          timerScript: hasTimerScript,
          mobileCSS: hasMobileCSS
        }
      });

      if (passed) {
        this.results.passed++;
        console.log(`   ✅ ${path.basename(pagePath)} - All patterns deployed`);
      } else {
        this.results.failed++;
        console.log(`   ❌ ${path.basename(pagePath)} - Missing patterns:`);
        if (!hasUrgencyCSS) console.log(`      - Urgency CSS`);
        if (!hasUrgencyBanner) console.log(`      - Urgency Banner`);
        if (!hasTimer) console.log(`      - Timer`);
        if (!hasTimerScript) console.log(`      - Timer Script`);
        if (!hasMobileCSS) console.log(`      - Mobile CSS`);
      }
    }
  }

  testMobileOptimizations() {
    console.log('\n📱 Test 2: Mobile Optimization Code\n');

    const testPage = UPDATED_PAGES[0];

    if (!fs.existsSync(testPage)) {
      console.log(`   ⚠️  Test page not found, skipping mobile tests`);
      return;
    }

    const html = fs.readFileSync(testPage, 'utf8');

    // Test: Mobile-specific padding
    this.results.totalTests++;
    const hasMobilePadding = html.includes('padding-top: 45px') || html.includes('padding-top: 50px');

    this.results.tests.push({
      name: 'Mobile body padding optimization',
      passed: hasMobilePadding,
      details: { found: hasMobilePadding }
    });

    if (hasMobilePadding) {
      this.results.passed++;
      console.log(`   ✅ Mobile padding optimization found`);
    } else {
      this.results.failed++;
      console.log(`   ❌ Mobile padding optimization missing`);
    }

    // Test: Timer label hidden on mobile
    this.results.totalTests++;
    const hasTimerLabelHidden = html.includes('.timer-label') && html.includes('display: none');

    this.results.tests.push({
      name: 'Timer label hidden on mobile',
      passed: hasTimerLabelHidden,
      details: { found: hasTimerLabelHidden }
    });

    if (hasTimerLabelHidden) {
      this.results.passed++;
      console.log(`   ✅ Timer label hidden on mobile`);
    } else {
      this.results.failed++;
      console.log(`   ❌ Timer label not hidden on mobile`);
    }

    // Test: Responsive font sizes
    this.results.totalTests++;
    const hasResponsiveFonts = html.includes('font-size: 11px') || html.includes('font-size: 12px');

    this.results.tests.push({
      name: 'Responsive font sizes',
      passed: hasResponsiveFonts,
      details: { found: hasResponsiveFonts }
    });

    if (hasResponsiveFonts) {
      this.results.passed++;
      console.log(`   ✅ Responsive font sizes found`);
    } else {
      this.results.failed++;
      console.log(`   ❌ Responsive font sizes missing`);
    }

    // Test: Extra small device support (480px)
    this.results.totalTests++;
    const hasExtraSmallSupport = html.includes('@media (max-width: 480px)');

    this.results.tests.push({
      name: 'Extra small device support',
      passed: hasExtraSmallSupport,
      details: { found: hasExtraSmallSupport }
    });

    if (hasExtraSmallSupport) {
      this.results.passed++;
      console.log(`   ✅ Extra small device support found`);
    } else {
      this.results.failed++;
      console.log(`   ❌ Extra small device support missing`);
    }
  }

  testScriptFiles() {
    console.log('\n📜 Test 3: Script Files\n');

    const scriptFiles = [
      'scripts/scale-winning-patterns-v2.js',
      'scripts/generate-next-pattern-combinations.js'
    ];

    for (const scriptPath of scriptFiles) {
      this.results.totalTests++;

      const exists = fs.existsSync(scriptPath);

      this.results.tests.push({
        name: `Script exists: ${path.basename(scriptPath)}`,
        passed: exists,
        details: { path: scriptPath }
      });

      if (exists) {
        this.results.passed++;
        console.log(`   ✅ ${path.basename(scriptPath)}`);
      } else {
        this.results.failed++;
        console.log(`   ❌ ${path.basename(scriptPath)} - Not found`);
      }
    }
  }

  testDocumentation() {
    console.log('\n📚 Test 4: Documentation\n');

    const docFiles = [
      'docs/MOBILE-CONVERSION-OPTIMIZATION-GUIDE.md'
    ];

    for (const docPath of docFiles) {
      this.results.totalTests++;

      const exists = fs.existsSync(docPath);

      this.results.tests.push({
        name: `Documentation: ${path.basename(docPath)}`,
        passed: exists,
        details: { path: docPath }
      });

      if (exists) {
        // Check content
        const content = fs.readFileSync(docPath, 'utf8');
        const hasFeature76 = content.includes('Feature #76');
        const hasMobileOptimization = content.includes('Mobile Optimization');
        const hasContent = content.length > 5000; // At least 5KB of content

        const contentValid = hasFeature76 && hasMobileOptimization && hasContent;

        if (contentValid) {
          this.results.passed++;
          console.log(`   ✅ ${path.basename(docPath)} (${(content.length / 1024).toFixed(1)}KB)`);
        } else {
          this.results.failed++;
          console.log(`   ⚠️  ${path.basename(docPath)} - Content incomplete`);
        }
      } else {
        this.results.failed++;
        console.log(`   ❌ ${path.basename(docPath)} - Not found`);
      }
    }
  }

  testNextPatternConfigs() {
    console.log('\n🧪 Test 5: Next Pattern Configurations\n');

    const configPath = 'ab-tests/next-pattern-combinations/test-config.json';
    const libraryPath = 'ab-tests/next-pattern-combinations/pattern-library.json';

    // Test: Config file
    this.results.totalTests++;
    const configExists = fs.existsSync(configPath);

    this.results.tests.push({
      name: 'Next pattern test config',
      passed: configExists,
      details: { path: configPath }
    });

    if (configExists) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const hasNewTests = config.newTests && config.newTests.length >= 3;
        const hasFeature76 = config.feature === 'Feature #76';

        if (hasNewTests && hasFeature76) {
          this.results.passed++;
          console.log(`   ✅ Test config valid (${config.newTests.length} tests)`);
        } else {
          this.results.failed++;
          console.log(`   ⚠️  Test config incomplete`);
        }
      } catch (error) {
        this.results.failed++;
        console.log(`   ❌ Test config invalid JSON`);
      }
    } else {
      this.results.failed++;
      console.log(`   ❌ Test config not found`);
    }

    // Test: Pattern library
    this.results.totalTests++;
    const libraryExists = fs.existsSync(libraryPath);

    this.results.tests.push({
      name: 'Pattern library',
      passed: libraryExists,
      details: { path: libraryPath }
    });

    if (libraryExists) {
      try {
        const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
        const hasPatterns = library.patterns && library.patterns.length >= 3;

        if (hasPatterns) {
          this.results.passed++;
          console.log(`   ✅ Pattern library valid (${library.patterns.length} patterns)`);
        } else {
          this.results.failed++;
          console.log(`   ⚠️  Pattern library incomplete`);
        }
      } catch (error) {
        this.results.failed++;
        console.log(`   ❌ Pattern library invalid JSON`);
      }
    } else {
      this.results.failed++;
      console.log(`   ❌ Pattern library not found`);
    }
  }

  testReports() {
    console.log('\n📊 Test 6: Generated Reports\n');

    const reportPath = 'reports/scaling/feature-76-scaling-report.json';

    this.results.totalTests++;
    const reportExists = fs.existsSync(reportPath);

    this.results.tests.push({
      name: 'Scaling report generated',
      passed: reportExists,
      details: { path: reportPath }
    });

    if (reportExists) {
      try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        const hasFeature76 = report.feature === 'Feature #76';
        const hasPagesUpdated = report.pagesUpdated >= 8;

        if (hasFeature76 && hasPagesUpdated) {
          this.results.passed++;
          console.log(`   ✅ Scaling report valid (${report.pagesUpdated} pages updated)`);
        } else {
          this.results.failed++;
          console.log(`   ⚠️  Scaling report incomplete`);
        }
      } catch (error) {
        this.results.failed++;
        console.log(`   ❌ Scaling report invalid JSON`);
      }
    } else {
      this.results.failed++;
      console.log(`   ❌ Scaling report not found`);
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

    process.exit(passRate >= 75 ? 0 : 1);
  }
}

// Run tests
const validator = new Feature76SimpleValidator();
validator.runAllTests();
