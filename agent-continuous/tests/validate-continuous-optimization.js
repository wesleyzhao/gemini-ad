#!/usr/bin/env node

/**
 * Validation Tests for Continuous Optimization System
 *
 * Feature #51: Validate continuous monitoring and optimization
 *
 * This test suite validates:
 * 1. Optimization scripts run successfully
 * 2. Applied optimizations are valid HTML
 * 3. Performance hints are correctly added
 * 4. Monitoring systems produce actionable insights
 * 5. Reports are generated correctly
 */

const fs = require('fs');
const path = require('path');
const { identifyOptimizations, applyOptimizations, generateReport } = require('../scripts/continuous-optimization');
const { analyzeFeedback, correlateFeedbackWithCWV } = require('../scripts/feedback-monitor');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function test(name, fn) {
  try {
    const result = fn();
    if (result === true) {
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
      console.log(`✓ ${name}`);
    } else if (result === 'warning') {
      results.warnings++;
      results.tests.push({ name, status: 'WARN' });
      console.log(`⚠ ${name}`);
    } else {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', message: result });
      console.log(`✗ ${name}: ${result}`);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'ERROR', message: error.message });
    console.log(`✗ ${name}: ${error.message}`);
  }
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     CONTINUOUS OPTIMIZATION VALIDATION TESTS               ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Test 1: CWV report exists and is valid
test('CWV monitoring report exists', () => {
  const reportPath = './reports/cwv-monitoring-report-2026-02-01.json';
  if (!fs.existsSync(reportPath)) {
    return 'CWV report not found';
  }

  const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  if (!data.pages || !data.issues || !data.alerts) {
    return 'CWV report missing required fields';
  }

  return true;
});

// Test 2: Optimization report was generated
test('Optimization report generated', () => {
  const reportDir = './reports/optimizations';
  if (!fs.existsSync(reportDir)) {
    return 'Optimizations directory not found';
  }

  const files = fs.readdirSync(reportDir).filter(f => f.startsWith('optimization-run-'));

  if (files.length === 0) {
    return 'No optimization reports found';
  }

  return true;
});

// Test 3: Feedback report was generated
test('Feedback monitoring report generated', () => {
  const reportDir = './reports/feedback-analysis';
  if (!fs.existsSync(reportDir)) {
    return 'Feedback analysis directory not found';
  }

  const files = fs.readdirSync(reportDir).filter(f => f.startsWith('feedback-report-'));

  if (files.length === 0) {
    return 'No feedback reports found';
  }

  return true;
});

// Test 4: User feedback data exists
test('User feedback data generated', () => {
  const feedbackPath = './reports/user-feedback.json';
  if (!fs.existsSync(feedbackPath)) {
    return 'User feedback data not found';
  }

  const data = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));

  if (!data.responses || data.responses.length === 0) {
    return 'No feedback responses found';
  }

  return true;
});

// Test 5: Backups were created before optimization
test('Page backups created during optimization', () => {
  const pagesDir = './pages';
  const backups = fs.readdirSync(pagesDir).filter(f => f.includes('.backup-'));

  if (backups.length === 0) {
    return 'warning'; // Warning, not failure - first run might not have backups
  }

  return true;
});

// Test 6: Optimized pages contain performance hints
test('Pages contain performance optimization hints', () => {
  const pagesDir = './pages';
  const pages = ['index.html', 'trust.html', 'creators.html'];
  let foundOptimizations = 0;

  pages.forEach(page => {
    const pagePath = path.join(pagesDir, page);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // Check for optimization markers
      if (content.includes('preload') ||
          content.includes('animation-performance-optimized') ||
          content.includes('critical-css') ||
          content.includes('defer non-critical CSS')) {
        foundOptimizations++;
      }
    }
  });

  if (foundOptimizations === 0) {
    return 'No optimization hints found in pages';
  }

  return true;
});

// Test 7: Optimization script functions work
test('identifyOptimizations() function works', () => {
  const cwvPath = './reports/cwv-monitoring-report-2026-02-01.json';
  if (!fs.existsSync(cwvPath)) {
    return 'warning';
  }

  const cwvData = JSON.parse(fs.readFileSync(cwvPath, 'utf8'));
  const optimizations = identifyOptimizations(cwvData);

  if (!Array.isArray(optimizations)) {
    return 'identifyOptimizations did not return array';
  }

  if (optimizations.length === 0) {
    return 'warning'; // Might be no optimizations needed
  }

  // Verify structure
  const first = optimizations[0];
  if (!first.page || !first.score || !first.strategies) {
    return 'Optimization object missing required fields';
  }

  return true;
});

// Test 8: Feedback analysis function works
test('analyzeFeedback() function works', () => {
  const feedbackPath = './reports/user-feedback.json';
  if (!fs.existsSync(feedbackPath)) {
    return 'warning';
  }

  const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
  const analysis = analyzeFeedback(feedbackData);

  if (!analysis.overall || !analysis.byPage || !analysis.alerts) {
    return 'Feedback analysis missing required fields';
  }

  if (typeof analysis.overall.positiveRate !== 'number') {
    return 'Invalid positiveRate calculation';
  }

  return true;
});

// Test 9: Correlation function works
test('correlateFeedbackWithCWV() function works', () => {
  const feedbackPath = './reports/user-feedback.json';
  const cwvPath = './reports/cwv-monitoring-report-2026-02-01.json';

  if (!fs.existsSync(feedbackPath) || !fs.existsSync(cwvPath)) {
    return 'warning';
  }

  const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
  const cwvData = JSON.parse(fs.readFileSync(cwvPath, 'utf8'));

  const feedbackAnalysis = analyzeFeedback(feedbackData);
  const correlations = correlateFeedbackWithCWV(feedbackAnalysis, cwvData);

  if (!Array.isArray(correlations)) {
    return 'Correlation did not return array';
  }

  return true;
});

// Test 10: HTML validity check on optimized pages
test('Optimized pages have valid HTML structure', () => {
  const pagesDir = './pages';
  const pages = ['index.html', 'trust.html'];
  let errors = 0;

  pages.forEach(page => {
    const pagePath = path.join(pagesDir, page);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');

      // Basic HTML validity checks
      if (!content.includes('<!DOCTYPE html>')) errors++;
      if (!content.includes('<html')) errors++;
      if (!content.includes('</html>')) errors++;
      if (!content.includes('<head>')) errors++;
      if (!content.includes('</head>')) errors++;
      if (!content.includes('<body')) errors++;
      if (!content.includes('</body>')) errors++;

      // Check for unclosed comments
      const openComments = (content.match(/<!--/g) || []).length;
      const closeComments = (content.match(/-->/g) || []).length;
      if (openComments !== closeComments) errors++;
    }
  });

  if (errors > 0) {
    return `Found ${errors} HTML validity issues`;
  }

  return true;
});

// Test 11: Performance monitoring script exists
test('Performance monitoring scripts exist', () => {
  const scripts = [
    './scripts/continuous-optimization.js',
    './scripts/feedback-monitor.js',
    './scripts/add-performance-monitoring.js',
    './scripts/analyze-trends.js'
  ];

  const missing = scripts.filter(s => !fs.existsSync(s));

  if (missing.length > 0) {
    return `Missing scripts: ${missing.join(', ')}`;
  }

  return true;
});

// Test 12: Documentation exists
test('Continuous monitoring documentation exists', () => {
  // Check for feature documentation
  const featureList = './feature_list.json';
  if (!fs.existsSync(featureList)) {
    return 'feature_list.json not found';
  }

  const features = JSON.parse(fs.readFileSync(featureList, 'utf8'));
  const feature51 = features.features.find(f => f.id === 51);

  if (!feature51) {
    return 'Feature #51 not found in feature list';
  }

  return true;
});

// Test 13: Reports directory structure
test('Reports directory structure is correct', () => {
  const requiredDirs = [
    './reports',
    './reports/optimizations',
    './reports/feedback-analysis',
    './reports/analysis',
    './reports/dashboards',
    './reports/alerts'
  ];

  const missing = requiredDirs.filter(d => !fs.existsSync(d));

  if (missing.length > 0) {
    return `Missing directories: ${missing.join(', ')}`;
  }

  return true;
});

// Test 14: Optimization strategies are defined
test('Optimization strategies are well-defined', () => {
  const optimizationScript = fs.readFileSync('./scripts/continuous-optimization.js', 'utf8');

  const requiredStrategies = [
    'preload-lcp-image',
    'preconnect-fonts',
    'inline-critical-css',
    'optimize-animations',
    'set-image-dimensions'
  ];

  const missing = requiredStrategies.filter(s => !optimizationScript.includes(s));

  if (missing.length > 0) {
    return `Missing strategies: ${missing.join(', ')}`;
  }

  return true;
});

// Test 15: Integration test - full workflow
test('Full continuous optimization workflow', () => {
  try {
    // 1. Load CWV data
    const cwvPath = './reports/cwv-monitoring-report-2026-02-01.json';
    if (!fs.existsSync(cwvPath)) return 'warning';

    const cwvData = JSON.parse(fs.readFileSync(cwvPath, 'utf8'));

    // 2. Identify optimizations
    const optimizations = identifyOptimizations(cwvData);
    if (!optimizations || optimizations.length === 0) return 'warning';

    // 3. Load feedback
    const feedbackPath = './reports/user-feedback.json';
    if (!fs.existsSync(feedbackPath)) return 'warning';

    const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));

    // 4. Analyze feedback
    const feedbackAnalysis = analyzeFeedback(feedbackData);
    if (!feedbackAnalysis) return 'Feedback analysis failed';

    // 5. Correlate
    const correlations = correlateFeedbackWithCWV(feedbackAnalysis, cwvData);

    // Workflow completed successfully
    return true;
  } catch (error) {
    return `Workflow error: ${error.message}`;
  }
});

// Display summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  TEST SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`✓ Passed:   ${results.passed}`);
console.log(`⚠ Warnings: ${results.warnings}`);
console.log(`✗ Failed:   ${results.failed}`);

const total = results.passed + results.warnings + results.failed;
const passRate = ((results.passed / total) * 100).toFixed(1);

console.log(`\nPass Rate: ${passRate}%`);

if (results.failed === 0) {
  console.log('\n✅ All critical tests passed!');
} else {
  console.log('\n❌ Some tests failed. Review above for details.');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Save test results
const testReport = {
  timestamp: new Date().toISOString(),
  summary: {
    total,
    passed: results.passed,
    warnings: results.warnings,
    failed: results.failed,
    passRate: `${passRate}%`
  },
  tests: results.tests
};

const reportPath = './reports/test-results-continuous-optimization.json';
fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2));
console.log(`Test results saved: ${reportPath}\n`);

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
