#!/usr/bin/env node

/**
 * Validation Tests for Advanced Monitoring System
 *
 * Validates Feature #52: Advanced performance monitoring and UX optimization
 *
 * Tests:
 * 1. Advanced UX monitoring functionality
 * 2. Anomaly detection system
 * 3. UX recommendation engine
 * 4. Report generation and data quality
 * 5. Integration between systems
 * 6. End-to-end workflow
 */

const fs = require('fs');
const path = require('path');

// Import modules to test
const uxMonitoring = require('../scripts/advanced-ux-monitoring.js');
const alerting = require('../scripts/advanced-alerting.js');
const recommendations = require('../scripts/ux-recommendation-engine.js');

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const CONFIG = {
  reportsDir: path.join(__dirname, '..', 'reports'),
  scriptsDir: path.join(__dirname, '..', 'scripts'),
  testResultsPath: path.join(__dirname, '..', 'reports', 'test-results-advanced-monitoring.json')
};

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    warnings: 0,
    failed: 0
  },
  tests: []
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

function test(name, testFn) {
  testResults.summary.total++;

  try {
    const result = testFn();

    if (result.status === 'PASS') {
      testResults.summary.passed++;
      console.log(`✅ ${name}`);
    } else if (result.status === 'WARNING') {
      testResults.summary.warnings++;
      console.log(`⚠️  ${name}: ${result.message}`);
    } else {
      testResults.summary.failed++;
      console.log(`❌ ${name}: ${result.message}`);
    }

    testResults.tests.push({
      name,
      status: result.status,
      message: result.message || '',
      details: result.details || {}
    });

    return result;
  } catch (err) {
    testResults.summary.failed++;
    console.log(`❌ ${name}: ${err.message}`);

    testResults.tests.push({
      name,
      status: 'FAIL',
      message: err.message,
      stack: err.stack
    });

    return { status: 'FAIL', message: err.message };
  }
}

function pass(message = '') {
  return { status: 'PASS', message };
}

function fail(message) {
  return { status: 'FAIL', message };
}

function warning(message) {
  return { status: 'WARNING', message };
}

// ============================================================================
// TESTS: SCRIPT EXISTENCE
// ============================================================================

function testScriptsExist() {
  console.log('\n📦 Testing Script Files...\n');

  test('Advanced UX monitoring script exists', () => {
    const scriptPath = path.join(CONFIG.scriptsDir, 'advanced-ux-monitoring.js');
    return fs.existsSync(scriptPath)
      ? pass()
      : fail('Script file not found');
  });

  test('Advanced alerting script exists', () => {
    const scriptPath = path.join(CONFIG.scriptsDir, 'advanced-alerting.js');
    return fs.existsSync(scriptPath)
      ? pass()
      : fail('Script file not found');
  });

  test('UX recommendation engine script exists', () => {
    const scriptPath = path.join(CONFIG.scriptsDir, 'ux-recommendation-engine.js');
    return fs.existsSync(scriptPath)
      ? pass()
      : fail('Script file not found');
  });
}

// ============================================================================
// TESTS: FUNCTIONAL VALIDATION
// ============================================================================

function testFunctionalComponents() {
  console.log('\n🔧 Testing Functional Components...\n');

  test('UX monitoring journey simulation works', () => {
    try {
      const journeys = uxMonitoring.simulateUserJourneys();

      if (!journeys || journeys.length === 0) {
        return fail('No journeys generated');
      }

      // Validate journey structure
      const sample = journeys[0];
      if (!sample.sessionId || !sample.page || !sample.metrics) {
        return fail('Invalid journey structure');
      }

      return pass(`Generated ${journeys.length} user journeys`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Heatmap analysis processes data correctly', () => {
    try {
      const journeys = uxMonitoring.simulateUserJourneys();
      const heatmap = uxMonitoring.analyzeHeatmapData(journeys);

      if (!heatmap || Object.keys(heatmap).length === 0) {
        return fail('No heatmap data generated');
      }

      // Validate heatmap structure
      const firstPage = Object.values(heatmap)[0];
      if (!firstPage.avgScrollDepth || !firstPage.clickDistribution) {
        return fail('Invalid heatmap structure');
      }

      return pass(`Analyzed ${Object.keys(heatmap).length} pages`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Engagement quality analysis calculates metrics', () => {
    try {
      const journeys = uxMonitoring.simulateUserJourneys();
      const engagement = uxMonitoring.analyzeEngagementQuality(journeys);

      if (!engagement || Object.keys(engagement).length === 0) {
        return fail('No engagement data generated');
      }

      // Validate engagement structure
      const firstPage = Object.values(engagement)[0];
      if (!firstPage.qualityScore || !firstPage.metrics || !firstPage.grade) {
        return fail('Invalid engagement structure');
      }

      return pass(`Analyzed engagement for ${Object.keys(engagement).length} pages`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Conversion funnel analysis works', () => {
    try {
      const journeys = uxMonitoring.simulateUserJourneys();
      const funnel = uxMonitoring.analyzeConversionFunnel(journeys);

      if (!funnel || !funnel.stages) {
        return fail('No funnel data generated');
      }

      // Validate funnel stages
      const requiredStages = ['landed', 'scrolled', 'interacted', 'engaged', 'converted'];
      for (const stage of requiredStages) {
        if (!funnel.stages[stage]) {
          return fail(`Missing funnel stage: ${stage}`);
        }
      }

      return pass('Funnel analysis complete with all stages');
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Anomaly detection identifies issues', () => {
    try {
      // Create mock data for testing
      const current = {
        ux: {
          engagementAnalysis: {
            'test.html': {
              qualityScore: 45,
              metrics: {
                conversionRate: '8.5',
                bounceRate: '65.2',
                avgClicks: '1.2'
              }
            }
          }
        }
      };

      const historical = [
        {
          timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
          pages: {
            'test.html': {
              qualityScore: 75,
              metrics: { conversionRate: '18.5', bounceRate: '35.2' }
            }
          }
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
          pages: {
            'test.html': {
              qualityScore: 72,
              metrics: { conversionRate: '17.2', bounceRate: '38.1' }
            }
          }
        },
        {
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          pages: {
            'test.html': {
              qualityScore: 73,
              metrics: { conversionRate: '19.1', bounceRate: '36.5' }
            }
          }
        }
      ];

      const anomalies = alerting.detectAnomalies(current, historical);

      if (!Array.isArray(anomalies)) {
        return fail('Anomalies not returned as array');
      }

      // Should detect quality score drop
      const hasQualityAnomaly = anomalies.some(a => a.metric === 'Quality Score');
      if (!hasQualityAnomaly) {
        return warning('Expected to detect quality score anomaly');
      }

      return pass(`Detected ${anomalies.length} anomalies`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Trend analysis calculates patterns', () => {
    try {
      // Create mock historical data with trend
      const historical = [];
      for (let i = 0; i < 10; i++) {
        historical.push({
          timestamp: new Date(Date.now() - 86400000 * (10 - i)).toISOString(),
          avgQualityScore: 60 + i * 2, // Upward trend
          avgConversionRate: 15 - i * 0.5, // Downward trend
          avgBounceRate: 40 + i
        });
      }

      const trends = alerting.analyzeTrends(historical);

      if (!trends || !trends.trends) {
        return fail('No trends generated');
      }

      return pass(`Identified ${trends.trends.length} trends`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Alert generation creates actionable alerts', () => {
    try {
      const mockAnomalies = [
        {
          severity: 'critical',
          page: 'test.html',
          metric: 'Quality Score',
          message: 'Critical drop detected'
        }
      ];

      const mockTrends = {
        trends: [
          {
            direction: 'declining',
            confidence: 'high',
            metric: 'Quality Score'
          }
        ]
      };

      const alerts = alerting.generateAlerts(mockAnomalies, mockTrends);

      if (!Array.isArray(alerts)) {
        return fail('Alerts not returned as array');
      }

      if (alerts.length === 0) {
        return warning('No alerts generated from critical anomaly');
      }

      // Validate alert structure
      const alert = alerts[0];
      if (!alert.priority || !alert.type || !alert.title || !alert.actions) {
        return fail('Invalid alert structure');
      }

      return pass(`Generated ${alerts.length} alerts with actions`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Recommendation engine generates recommendations', () => {
    try {
      // Create mock analysis data
      const mockData = {
        ux: {
          engagementAnalysis: {
            'test.html': {
              qualityScore: 45,
              metrics: {
                avgScrollDepth: 25,
                bounceRate: '65.5',
                conversionRate: '8.2',
                avgClicks: '1.5'
              }
            }
          },
          heatmapAnalysis: {
            'test.html': {
              avgScrollDepth: 25,
              clickDistribution: { hero: 10, features: 5, footer: 2 },
              totalClicks: 20
            }
          }
        }
      };

      const recs = recommendations.generateRecommendations(mockData);

      if (!recs || Object.keys(recs).length === 0) {
        return fail('No recommendations generated');
      }

      const pageRecs = recs['test.html'];
      if (!pageRecs || !pageRecs.recommendations) {
        return fail('Invalid recommendation structure');
      }

      // Should generate multiple recommendations for low-quality page
      if (pageRecs.recommendations.length === 0) {
        return fail('Expected recommendations for low-quality page');
      }

      // Validate recommendation structure
      const rec = pageRecs.recommendations[0];
      if (!rec.title || !rec.actions || !rec.priority || !rec.impact) {
        return fail('Invalid recommendation structure');
      }

      return pass(`Generated ${pageRecs.recommendations.length} recommendations`);
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Implementation plan generation works', () => {
    try {
      const mockRecommendations = {
        'page1.html': {
          recommendations: [
            { priority: 'critical', difficulty: 'medium', category: 'Performance' },
            { priority: 'high', difficulty: 'low', category: 'Design' }
          ]
        },
        'page2.html': {
          recommendations: [
            { priority: 'medium', difficulty: 'high', category: 'Content' }
          ]
        }
      };

      const plan = recommendations.generateImplementationPlan(mockRecommendations);

      if (!plan || !plan.plan || !plan.effort) {
        return fail('Invalid implementation plan structure');
      }

      // Validate plan structure
      if (!plan.plan.immediate || !plan.plan.shortTerm || !plan.plan.mediumTerm) {
        return fail('Missing plan timeframes');
      }

      // Validate effort calculation
      if (!plan.effort.immediate || !plan.effort.immediate.estimatedHours) {
        return fail('Missing effort estimates');
      }

      return pass('Implementation plan generated successfully');
    } catch (err) {
      return fail(err.message);
    }
  });
}

// ============================================================================
// TESTS: INTEGRATION
// ============================================================================

function testIntegration() {
  console.log('\n🔗 Testing System Integration...\n');

  test('End-to-end UX monitoring workflow', () => {
    try {
      // Run full UX monitoring workflow
      const uxReport = uxMonitoring.main();

      if (!uxReport) {
        return fail('UX monitoring did not return report');
      }

      // Validate report structure
      if (!uxReport.summary || !uxReport.engagementAnalysis || !uxReport.heatmapAnalysis) {
        return fail('Invalid UX report structure');
      }

      // Check report was saved
      const uxReportDir = path.join(CONFIG.reportsDir, 'ux-analysis');
      if (!fs.existsSync(uxReportDir)) {
        return fail('UX report directory not created');
      }

      const files = fs.readdirSync(uxReportDir).filter(f => f.endsWith('.json'));
      if (files.length === 0) {
        return fail('UX report not saved');
      }

      return pass('UX monitoring workflow complete');
    } catch (err) {
      return fail(err.message);
    }
  });

  test('End-to-end alerting workflow', () => {
    try {
      // Ensure UX data exists first
      uxMonitoring.main();

      // Run alerting workflow
      const alertReport = alerting.main();

      if (!alertReport) {
        return fail('Alerting did not return report');
      }

      // Validate report structure
      if (!alertReport.summary || !alertReport.alerts) {
        return fail('Invalid alert report structure');
      }

      // Check report was saved
      const alertsDir = path.join(CONFIG.reportsDir, 'alerts');
      if (!fs.existsSync(alertsDir)) {
        return fail('Alerts directory not created');
      }

      const files = fs.readdirSync(alertsDir).filter(f => f.endsWith('.json'));
      if (files.length === 0) {
        return fail('Alert report not saved');
      }

      return pass('Alerting workflow complete');
    } catch (err) {
      return fail(err.message);
    }
  });

  test('End-to-end recommendation workflow', () => {
    try {
      // Ensure UX data exists first
      uxMonitoring.main();

      // Run recommendation workflow
      const recReport = recommendations.main();

      if (!recReport) {
        return fail('Recommendation engine did not return report');
      }

      // Validate report structure
      if (!recReport.summary || !recReport.pageRecommendations || !recReport.implementationPlan) {
        return fail('Invalid recommendation report structure');
      }

      // Check report was saved
      const recDir = path.join(CONFIG.reportsDir, 'recommendations');
      if (!fs.existsSync(recDir)) {
        return fail('Recommendations directory not created');
      }

      const files = fs.readdirSync(recDir).filter(f => f.endsWith('.json'));
      if (files.length === 0) {
        return fail('Recommendation report not saved');
      }

      return pass('Recommendation workflow complete');
    } catch (err) {
      return fail(err.message);
    }
  });

  test('Historical data tracking works', () => {
    const historicalDir = path.join(CONFIG.reportsDir, 'historical');

    if (!fs.existsSync(historicalDir)) {
      return warning('Historical directory not created yet');
    }

    const files = fs.readdirSync(historicalDir).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      return warning('No historical snapshots saved yet');
    }

    // Validate historical data structure
    try {
      const data = JSON.parse(fs.readFileSync(path.join(historicalDir, files[0]), 'utf8'));
      if (!data.timestamp || !data.avgQualityScore || !data.pages) {
        return fail('Invalid historical data structure');
      }

      return pass(`${files.length} historical snapshots saved`);
    } catch (err) {
      return fail('Historical data is corrupted');
    }
  });
}

// ============================================================================
// TESTS: DATA QUALITY
// ============================================================================

function testDataQuality() {
  console.log('\n📊 Testing Data Quality...\n');

  test('UX report contains valid metrics', () => {
    const uxReportDir = path.join(CONFIG.reportsDir, 'ux-analysis');

    if (!fs.existsSync(uxReportDir)) {
      return fail('UX report directory does not exist');
    }

    const files = fs.readdirSync(uxReportDir).filter(f => f.endsWith('.json')).sort().reverse();

    if (files.length === 0) {
      return fail('No UX reports found');
    }

    try {
      const report = JSON.parse(fs.readFileSync(path.join(uxReportDir, files[0]), 'utf8'));

      // Check engagement metrics are valid numbers
      for (const [page, data] of Object.entries(report.engagementAnalysis || {})) {
        if (typeof data.qualityScore !== 'number' || data.qualityScore < 0 || data.qualityScore > 100) {
          return fail(`Invalid quality score for ${page}: ${data.qualityScore}`);
        }

        const bounce = parseFloat(data.metrics.bounceRate);
        if (isNaN(bounce) || bounce < 0 || bounce > 100) {
          return fail(`Invalid bounce rate for ${page}: ${data.metrics.bounceRate}`);
        }
      }

      return pass('All UX metrics are valid');
    } catch (err) {
      return fail(`Invalid UX report: ${err.message}`);
    }
  });

  test('Alerts have actionable recommendations', () => {
    const alertsDir = path.join(CONFIG.reportsDir, 'alerts');

    if (!fs.existsSync(alertsDir)) {
      return warning('Alerts directory does not exist yet');
    }

    const files = fs.readdirSync(alertsDir).filter(f => f.endsWith('.json')).sort().reverse();

    if (files.length === 0) {
      return warning('No alert reports found yet');
    }

    try {
      const report = JSON.parse(fs.readFileSync(path.join(alertsDir, files[0]), 'utf8'));

      // Each alert should have actions
      for (const alert of report.alerts || []) {
        if (!alert.actions || alert.actions.length === 0) {
          return fail(`Alert "${alert.title}" has no actions`);
        }

        if (!alert.priority || !alert.type || !alert.title) {
          return fail('Alert missing required fields');
        }
      }

      return pass('All alerts have actionable recommendations');
    } catch (err) {
      return fail(`Invalid alert report: ${err.message}`);
    }
  });

  test('Recommendations are prioritized correctly', () => {
    const recDir = path.join(CONFIG.reportsDir, 'recommendations');

    if (!fs.existsSync(recDir)) {
      return fail('Recommendations directory does not exist');
    }

    const files = fs.readdirSync(recDir).filter(f => f.endsWith('.json')).sort().reverse();

    if (files.length === 0) {
      return fail('No recommendation reports found');
    }

    try {
      const report = JSON.parse(fs.readFileSync(path.join(recDir, files[0]), 'utf8'));

      // Check that critical recommendations come first
      for (const [page, data] of Object.entries(report.pageRecommendations || {})) {
        const recs = data.recommendations || [];

        for (let i = 0; i < recs.length - 1; i++) {
          const current = recs[i];
          const next = recs[i + 1];

          // Critical should come before high
          if (current.priority === 'high' && next.priority === 'critical') {
            return fail(`Recommendations for ${page} not properly prioritized`);
          }

          // High should come before medium
          if (current.priority === 'medium' && next.priority === 'high') {
            return fail(`Recommendations for ${page} not properly prioritized`);
          }
        }
      }

      return pass('Recommendations are correctly prioritized');
    } catch (err) {
      return fail(`Invalid recommendation report: ${err.message}`);
    }
  });
}

// ============================================================================
// MAIN TEST EXECUTION
// ============================================================================

function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ADVANCED MONITORING SYSTEM - VALIDATION TESTS');
  console.log('  Feature #52: Advanced Performance Monitoring');
  console.log('═══════════════════════════════════════════════════════════');

  const startTime = Date.now();

  // Run test suites
  testScriptsExist();
  testFunctionalComponents();
  testIntegration();
  testDataQuality();

  // Calculate pass rate
  const passRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1);
  testResults.summary.passRate = `${passRate}%`;

  // Save results
  fs.writeFileSync(CONFIG.testResultsPath, JSON.stringify(testResults, null, 2));

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Total Tests:    ${testResults.summary.total}`);
  console.log(`✅ Passed:      ${testResults.summary.passed}`);
  console.log(`⚠️  Warnings:    ${testResults.summary.warnings}`);
  console.log(`❌ Failed:      ${testResults.summary.failed}`);
  console.log(`\n📊 Pass Rate:   ${passRate}%`);
  console.log(`⏱️  Duration:    ${duration}s`);
  console.log(`\n📄 Report:      ${CONFIG.testResultsPath}`);
  console.log('\n═══════════════════════════════════════════════════════════\n');

  // Exit with appropriate code
  const exitCode = testResults.summary.failed > 0 ? 1 : 0;

  if (exitCode === 0) {
    console.log('✅ All tests passed!\n');
  } else {
    console.log('❌ Some tests failed. Please review the results.\n');
  }

  process.exit(exitCode);
}

// Run tests
if (require.main === module) {
  main();
}

module.exports = { test, pass, fail, warning };
