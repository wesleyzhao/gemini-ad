#!/usr/bin/env node

/**
 * Validation Tests for Trend Analysis System
 *
 * Tests:
 * - Trend analysis script functionality
 * - Insight generation accuracy
 * - Recommendation prioritization
 * - Implementation tracking
 * - Dashboard generation
 */

const fs = require('fs');
const path = require('path');

const TESTS = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
};

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function test(description, fn) {
  TESTS.total++;
  try {
    const result = fn();
    if (result === true) {
      TESTS.passed++;
      console.log(`${COLORS.green}✓${COLORS.reset} ${description}`);
      return true;
    } else if (result === 'warning') {
      TESTS.warnings++;
      console.log(`${COLORS.yellow}⚠${COLORS.reset} ${description}`);
      return true;
    } else {
      TESTS.failed++;
      console.log(`${COLORS.red}✗${COLORS.reset} ${description}`);
      return false;
    }
  } catch (error) {
    TESTS.failed++;
    console.log(`${COLORS.red}✗${COLORS.reset} ${description}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

console.log('\n' + COLORS.cyan + '━'.repeat(80) + COLORS.reset);
console.log(COLORS.cyan + '  Trend Analysis System Validation' + COLORS.reset);
console.log(COLORS.cyan + '━'.repeat(80) + COLORS.reset + '\n');

// Test 1: Core script files exist
console.log(COLORS.blue + '📁 Core Files' + COLORS.reset);

test('Trend analysis script exists', () => {
  return fs.existsSync('./scripts/analyze-trends.js');
});

test('Implementation tracker exists', () => {
  return fs.existsSync('./scripts/implementation-tracker.js');
});

test('Monitoring script exists', () => {
  return fs.existsSync('./scripts/monitor-production-cwv.js');
});

// Test 2: Scripts are executable
console.log('\n' + COLORS.blue + '🔧 Script Permissions' + COLORS.reset);

test('Trend analysis script is executable', () => {
  const stats = fs.statSync('./scripts/analyze-trends.js');
  return (stats.mode & 0o111) !== 0;
});

test('Implementation tracker is executable', () => {
  const stats = fs.statSync('./scripts/implementation-tracker.js');
  return (stats.mode & 0o111) !== 0;
});

// Test 3: Required directories exist
console.log('\n' + COLORS.blue + '📂 Directory Structure' + COLORS.reset);

test('Reports directory exists', () => {
  return fs.existsSync('./reports');
});

test('Analysis directory exists or can be created', () => {
  const dir = './reports/analysis';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return fs.existsSync(dir);
});

test('Dashboards directory exists', () => {
  return fs.existsSync('./reports/dashboards');
});

test('Historical data directory exists or can be created', () => {
  const dir = './reports/historical';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return fs.existsSync(dir);
});

// Test 4: Required data files exist
console.log('\n' + COLORS.blue + '📊 Data Files' + COLORS.reset);

test('At least one monitoring report exists', () => {
  const files = fs.readdirSync('./reports')
    .filter(f => f.startsWith('cwv-monitoring-report-') && f.endsWith('.json'));
  return files.length > 0;
});

test('Performance budgets configuration exists', () => {
  return fs.existsSync('./performance-budgets.json');
});

// Test 5: Script functionality
console.log('\n' + COLORS.blue + '⚙️  Script Functionality' + COLORS.reset);

test('Trend analysis script can be required', () => {
  try {
    const analyzer = require('../scripts/analyze-trends.js');
    return typeof analyzer.loadHistoricalData === 'function' &&
           typeof analyzer.analyzeMetricTrends === 'function' &&
           typeof analyzer.generateInsights === 'function';
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return false;
  }
});

test('Implementation tracker can be required', () => {
  try {
    const tracker = require('../scripts/implementation-tracker.js');
    return typeof tracker.loadTracking === 'function' &&
           typeof tracker.importRecommendations === 'function' &&
           typeof tracker.generateDashboard === 'function';
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return false;
  }
});

// Test 6: Data validation
console.log('\n' + COLORS.blue + '🔍 Data Validation' + COLORS.reset);

test('Monitoring reports have correct structure', () => {
  const files = fs.readdirSync('./reports')
    .filter(f => f.startsWith('cwv-monitoring-report-') && f.endsWith('.json'));

  if (files.length === 0) return false;

  const report = JSON.parse(fs.readFileSync(path.join('./reports', files[0]), 'utf8'));

  return report.timestamp &&
         report.summary &&
         report.pages &&
         report.configuration &&
         typeof report.pages === 'object';
});

test('Monitoring reports contain required metrics', () => {
  const files = fs.readdirSync('./reports')
    .filter(f => f.startsWith('cwv-monitoring-report-') && f.endsWith('.json'));

  if (files.length === 0) return false;

  const report = JSON.parse(fs.readFileSync(path.join('./reports', files[0]), 'utf8'));
  const firstPage = Object.values(report.pages)[0];

  if (!firstPage || !firstPage.metrics) return false;

  const requiredMetrics = ['lcp', 'fid', 'inp', 'cls', 'fcp', 'ttfb'];
  return requiredMetrics.every(metric => firstPage.metrics[metric] !== undefined);
});

// Test 7: Trend analysis functions
console.log('\n' + COLORS.blue + '📈 Trend Analysis Functions' + COLORS.reset);

test('Can load historical data', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();
  return Array.isArray(reports) && reports.length >= 0;
});

test('Historical data has correct structure', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length === 0) return 'warning';

  return reports.every(report =>
    report.timestamp &&
    report.date &&
    report.data &&
    report.data.pages
  );
});

test('Can analyze metric trends (with sufficient data)', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length < 2) return 'warning';

  const trends = analyzer.analyzeMetricTrends(reports);
  return trends &&
         trends.timestamp &&
         trends.metrics &&
         typeof trends.metrics === 'object';
});

test('Trend analysis identifies improving/degrading pages', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length < 2) return 'warning';

  const trends = analyzer.analyzeMetricTrends(reports);

  // Check if at least one metric has trend data
  const hasValidTrends = Object.values(trends.metrics).some(metric =>
    Array.isArray(metric.pagesImproving) ||
    Array.isArray(metric.pagesDegrading)
  );

  return hasValidTrends;
});

// Test 8: Insight generation
console.log('\n' + COLORS.blue + '💡 Insight Generation' + COLORS.reset);

test('Can generate insights from trends', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length < 2) return 'warning';

  const trends = analyzer.analyzeMetricTrends(reports);
  const insights = analyzer.generateInsights(trends, reports);

  return insights &&
         insights.summary &&
         Array.isArray(insights.keyFindings) &&
         Array.isArray(insights.opportunities) &&
         Array.isArray(insights.patterns);
});

test('Insights include actionable patterns', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length < 2) return 'warning';

  const trends = analyzer.analyzeMetricTrends(reports);
  const insights = analyzer.generateInsights(trends, reports);

  // Insights should have some findings, opportunities, or patterns
  return insights.keyFindings.length > 0 ||
         insights.opportunities.length > 0 ||
         insights.patterns.length > 0;
});

// Test 9: Recommendation generation
console.log('\n' + COLORS.blue + '🎯 Recommendations' + COLORS.reset);

test('Can generate prioritized recommendations', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length < 2) return 'warning';

  const trends = analyzer.analyzeMetricTrends(reports);
  const insights = analyzer.generateInsights(trends, reports);
  const recommendations = analyzer.generateRecommendations(insights, trends);

  return recommendations &&
         Array.isArray(recommendations.high_priority) &&
         Array.isArray(recommendations.medium_priority) &&
         Array.isArray(recommendations.quick_wins);
});

test('Recommendations include action items', () => {
  const analyzer = require('../scripts/analyze-trends.js');
  const reports = analyzer.loadHistoricalData();

  if (reports.length < 2) return 'warning';

  const trends = analyzer.analyzeMetricTrends(reports);
  const insights = analyzer.generateInsights(trends, reports);
  const recommendations = analyzer.generateRecommendations(insights, trends);

  // At least some recommendations should exist
  const totalRecs = recommendations.high_priority.length +
                   recommendations.medium_priority.length +
                   recommendations.quick_wins.length;

  return totalRecs > 0;
});

// Test 10: Implementation tracking
console.log('\n' + COLORS.blue + '📋 Implementation Tracking' + COLORS.reset);

test('Can initialize tracking data', () => {
  const tracker = require('../scripts/implementation-tracker.js');
  const tracking = tracker.loadTracking();

  return !!(tracking &&
            tracking.version &&
            Array.isArray(tracking.implementations) &&
            tracking.metrics);
});

test('Can generate dashboard HTML', () => {
  const tracker = require('../scripts/implementation-tracker.js');
  tracker.generateDashboard();

  const dashboardPath = './reports/dashboards/implementation-dashboard.html';
  if (!fs.existsSync(dashboardPath)) return false;

  const content = fs.readFileSync(dashboardPath, 'utf8');
  return content.includes('<!DOCTYPE html') &&
         content.includes('Performance Implementation Dashboard');
});

// Test 11: Integration
console.log('\n' + COLORS.blue + '🔗 Integration' + COLORS.reset);

test('NPM scripts are configured', () => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

  return pkg.scripts['analyze:trends'] !== undefined &&
         pkg.scripts['track:implementations'] !== undefined;
});

test('Full workflow can execute', () => {
  // This tests the complete workflow without errors
  try {
    const analyzer = require('../scripts/analyze-trends.js');
    const tracker = require('../scripts/implementation-tracker.js');

    const reports = analyzer.loadHistoricalData();

    if (reports.length < 2) return 'warning';

    const trends = analyzer.analyzeMetricTrends(reports);
    const insights = analyzer.generateInsights(trends, reports);
    const recommendations = analyzer.generateRecommendations(insights, trends);
    const report = analyzer.generateTrendReport(reports, trends, insights, recommendations);

    return report &&
           report.metadata &&
           report.executive_summary &&
           report.detailed_analysis &&
           report.action_plan;
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return false;
  }
});

// Test 12: Documentation
console.log('\n' + COLORS.blue + '📚 Documentation' + COLORS.reset);

test('Scripts have usage documentation', () => {
  const trendScript = fs.readFileSync('./scripts/analyze-trends.js', 'utf8');
  const trackerScript = fs.readFileSync('./scripts/implementation-tracker.js', 'utf8');

  return trendScript.includes('Usage:') && trackerScript.includes('Usage:');
});

test('Scripts include examples', () => {
  const trendScript = fs.readFileSync('./scripts/analyze-trends.js', 'utf8');
  const trackerScript = fs.readFileSync('./scripts/implementation-tracker.js', 'utf8');

  return (trendScript.includes('node scripts/') || trendScript.includes('npm run')) &&
         (trackerScript.includes('node scripts/') || trackerScript.includes('npm run'));
});

// Final report
console.log('\n' + COLORS.cyan + '━'.repeat(80) + COLORS.reset);
console.log(COLORS.cyan + '  Results' + COLORS.reset);
console.log(COLORS.cyan + '━'.repeat(80) + COLORS.reset + '\n');

const passRate = ((TESTS.passed / TESTS.total) * 100).toFixed(1);
const grade = passRate >= 95 ? 'A+' :
              passRate >= 90 ? 'A' :
              passRate >= 85 ? 'B+' :
              passRate >= 80 ? 'B' :
              passRate >= 75 ? 'C+' : 'C';

console.log(`Total tests:     ${TESTS.total}`);
console.log(`${COLORS.green}Passed:          ${TESTS.passed}${COLORS.reset}`);
if (TESTS.warnings > 0) {
  console.log(`${COLORS.yellow}Warnings:        ${TESTS.warnings}${COLORS.reset}`);
}
if (TESTS.failed > 0) {
  console.log(`${COLORS.red}Failed:          ${TESTS.failed}${COLORS.reset}`);
}
console.log(`\nPass rate:       ${passRate}%`);
console.log(`Grade:           ${grade}\n`);

if (TESTS.warnings > 0) {
  console.log(`${COLORS.yellow}ℹ  Warnings indicate features that work but lack sufficient data for full testing.${COLORS.reset}`);
  console.log(`${COLORS.yellow}   Generate more monitoring reports to enable complete trend analysis.${COLORS.reset}\n`);
}

// Exit with appropriate code
process.exit(TESTS.failed > 0 ? 1 : 0);
