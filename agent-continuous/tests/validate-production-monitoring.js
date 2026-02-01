#!/usr/bin/env node

/**
 * Production Monitoring Validation Tests
 *
 * Validates that the production Core Web Vitals monitoring system is working correctly.
 *
 * Tests:
 * - Monitoring script exists and is executable
 * - Can generate performance data
 * - Dashboard generation works
 * - Alerts system functions
 * - Reports are created
 * - NPM scripts are configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🧪 Production Monitoring Validation Tests');
console.log('═══════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;
const results = [];

/**
 * Test helper
 */
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passCount++;
    results.push({ name, status: 'pass' });
    return true;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failCount++;
    results.push({ name, status: 'fail', error: error.message });
    return false;
  }
}

// ============================================================================
// Core Files Tests
// ============================================================================

test('Monitoring script exists', () => {
  const scriptPath = 'scripts/monitor-production-cwv.js';
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`${scriptPath} not found`);
  }
  const stats = fs.statSync(scriptPath);
  if (stats.size === 0) {
    throw new Error('Script file is empty');
  }
});

test('Production monitoring documentation exists', () => {
  const docPath = 'docs/PRODUCTION_MONITORING.md';
  if (!fs.existsSync(docPath)) {
    throw new Error(`${docPath} not found`);
  }
  const content = fs.readFileSync(docPath, 'utf-8');
  if (content.length < 1000) {
    throw new Error('Documentation is too short');
  }
});

test('Reports directory exists', () => {
  if (!fs.existsSync('reports')) {
    throw new Error('reports/ directory not found');
  }
  if (!fs.existsSync('reports/dashboards')) {
    throw new Error('reports/dashboards/ directory not found');
  }
  if (!fs.existsSync('reports/alerts')) {
    throw new Error('reports/alerts/ directory not found');
  }
});

// ============================================================================
// NPM Scripts Tests
// ============================================================================

test('NPM scripts are configured', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const requiredScripts = [
    'monitor:cwv',
    'monitor:cwv:analyze',
    'monitor:cwv:dashboard',
    'monitor:cwv:alerts'
  ];

  requiredScripts.forEach(script => {
    if (!packageJson.scripts[script]) {
      throw new Error(`Missing NPM script: ${script}`);
    }
  });
});

// ============================================================================
// Functionality Tests
// ============================================================================

test('Can execute monitoring script', () => {
  try {
    execSync('node scripts/monitor-production-cwv.js --analyze', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
  } catch (error) {
    throw new Error(`Script execution failed: ${error.message}`);
  }
});

test('Dashboard generation works', () => {
  // Run dashboard generation
  try {
    execSync('node scripts/monitor-production-cwv.js --dashboard', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
  } catch (error) {
    throw new Error(`Dashboard generation failed: ${error.message}`);
  }

  // Check that dashboard was created
  if (!fs.existsSync('reports/dashboards/latest.html')) {
    throw new Error('Dashboard file not created');
  }

  const dashboard = fs.readFileSync('reports/dashboards/latest.html', 'utf-8');
  if (dashboard.length < 1000) {
    throw new Error('Dashboard file is too small');
  }

  // Check for key dashboard components
  if (!dashboard.includes('Core Web Vitals Dashboard')) {
    throw new Error('Dashboard missing title');
  }
  if (!dashboard.includes('LCP')) {
    throw new Error('Dashboard missing LCP metric');
  }
});

test('Alerts generation works', () => {
  // Run alerts check
  try {
    execSync('node scripts/monitor-production-cwv.js --alerts', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
  } catch (error) {
    throw new Error(`Alerts generation failed: ${error.message}`);
  }

  // Check that alerts file was created
  const alertFiles = fs.readdirSync('reports/alerts').filter(f => f.endsWith('.json'));
  if (alertFiles.length === 0) {
    throw new Error('No alert files created');
  }

  const alertsPath = path.join('reports/alerts', alertFiles[alertFiles.length - 1]);
  const alerts = JSON.parse(fs.readFileSync(alertsPath, 'utf-8'));

  // Validate structure
  if (!alerts.critical || !Array.isArray(alerts.critical)) {
    throw new Error('Alerts missing critical array');
  }
  if (!alerts.warning || !Array.isArray(alerts.warning)) {
    throw new Error('Alerts missing warning array');
  }
  if (!alerts.info || !Array.isArray(alerts.info)) {
    throw new Error('Alerts missing info array');
  }
});

test('Full report generation works', () => {
  // Run full report
  try {
    execSync('node scripts/monitor-production-cwv.js --report', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
  } catch (error) {
    throw new Error(`Report generation failed: ${error.message}`);
  }

  // Check that report was created
  const reportFiles = fs.readdirSync('reports').filter(f => f.startsWith('cwv-monitoring-report-'));
  if (reportFiles.length === 0) {
    throw new Error('No report files created');
  }

  const reportPath = path.join('reports', reportFiles[reportFiles.length - 1]);
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  // Validate report structure
  if (!report.timestamp) throw new Error('Report missing timestamp');
  if (!report.summary) throw new Error('Report missing summary');
  if (!report.alerts) throw new Error('Report missing alerts');
  if (!report.recommendations) throw new Error('Report missing recommendations');
  if (!report.pages) throw new Error('Report missing pages data');
});

// ============================================================================
// Dashboard Content Tests
// ============================================================================

test('Dashboard contains all metrics', () => {
  const dashboard = fs.readFileSync('reports/dashboards/latest.html', 'utf-8');

  const requiredMetrics = ['LCP', 'FID', 'INP', 'CLS'];
  requiredMetrics.forEach(metric => {
    if (!dashboard.includes(metric)) {
      throw new Error(`Dashboard missing ${metric} metric`);
    }
  });
});

test('Dashboard has visual elements', () => {
  const dashboard = fs.readFileSync('reports/dashboards/latest.html', 'utf-8');

  // Check for CSS
  if (!dashboard.includes('<style>')) {
    throw new Error('Dashboard missing CSS styles');
  }

  // Check for structure
  if (!dashboard.includes('summary-card')) {
    throw new Error('Dashboard missing summary cards');
  }

  // Check for metric visualizations
  if (!dashboard.includes('metric-bar')) {
    throw new Error('Dashboard missing metric visualizations');
  }
});

test('Dashboard is valid HTML', () => {
  const dashboard = fs.readFileSync('reports/dashboards/latest.html', 'utf-8');

  // Basic HTML validation
  if (!dashboard.includes('<!DOCTYPE html>')) {
    throw new Error('Dashboard missing DOCTYPE');
  }
  if (!dashboard.includes('<html')) {
    throw new Error('Dashboard missing html tag');
  }
  if (!dashboard.includes('<head>')) {
    throw new Error('Dashboard missing head');
  }
  if (!dashboard.includes('<body>')) {
    throw new Error('Dashboard missing body');
  }
});

// ============================================================================
// Report Data Tests
// ============================================================================

test('Report contains performance data', () => {
  const reportFiles = fs.readdirSync('reports').filter(f => f.startsWith('cwv-monitoring-report-'));
  const reportPath = path.join('reports', reportFiles[reportFiles.length - 1]);
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  if (!report.pages || Object.keys(report.pages).length === 0) {
    throw new Error('Report has no page data');
  }

  // Check first page has all metrics
  const firstPage = Object.values(report.pages)[0];
  const requiredMetrics = ['lcp', 'fid', 'inp', 'cls', 'fcp', 'ttfb'];

  requiredMetrics.forEach(metric => {
    if (!firstPage.metrics[metric]) {
      throw new Error(`Page missing ${metric} metric`);
    }
    if (typeof firstPage.metrics[metric].p75 === 'undefined') {
      throw new Error(`Metric ${metric} missing p75 value`);
    }
  });
});

test('Report has valid summary', () => {
  const reportFiles = fs.readdirSync('reports').filter(f => f.startsWith('cwv-monitoring-report-'));
  const reportPath = path.join('reports', reportFiles[reportFiles.length - 1]);
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  const summary = report.summary;
  if (typeof summary.totalPages !== 'number' || summary.totalPages === 0) {
    throw new Error('Invalid totalPages in summary');
  }
  if (typeof summary.excellentPages !== 'number') {
    throw new Error('Invalid excellentPages in summary');
  }
  if (typeof summary.goodPages !== 'number') {
    throw new Error('Invalid goodPages in summary');
  }
  if (typeof summary.needsWorkPages !== 'number') {
    throw new Error('Invalid needsWorkPages in summary');
  }
  if (typeof summary.poorPages !== 'number') {
    throw new Error('Invalid poorPages in summary');
  }

  // Total should equal sum of categories
  const total = summary.excellentPages + summary.goodPages + summary.needsWorkPages + summary.poorPages;
  if (total !== summary.totalPages) {
    throw new Error('Summary categories do not add up to total');
  }
});

// ============================================================================
// Configuration Tests
// ============================================================================

test('Monitoring system has proper configuration', () => {
  const scriptContent = fs.readFileSync('scripts/monitor-production-cwv.js', 'utf-8');

  // Check for configuration object
  if (!scriptContent.includes('const CONFIG')) {
    throw new Error('Missing CONFIG object');
  }

  // Check for thresholds
  if (!scriptContent.includes('thresholds')) {
    throw new Error('Missing performance thresholds');
  }

  // Check for alerts configuration
  if (!scriptContent.includes('alerts')) {
    throw new Error('Missing alerts configuration');
  }
});

test('Monitoring supports simulated and real data', () => {
  const scriptContent = fs.readFileSync('scripts/monitor-production-cwv.js', 'utf-8');

  if (!scriptContent.includes('generateSimulatedData')) {
    throw new Error('Missing simulated data support');
  }

  if (!scriptContent.includes('GA4')) {
    throw new Error('Missing GA4 integration support');
  }
});

// ============================================================================
// Documentation Tests
// ============================================================================

test('Documentation covers all features', () => {
  const doc = fs.readFileSync('docs/PRODUCTION_MONITORING.md', 'utf-8');

  const requiredSections = [
    'Quick Start',
    'System Architecture',
    'Data Collection',
    'Monitoring Dashboard',
    'Alerts',
    'Optimization Workflow',
    'GA4 Integration',
    'Troubleshooting'
  ];

  requiredSections.forEach(section => {
    if (!doc.includes(section)) {
      throw new Error(`Documentation missing section: ${section}`);
    }
  });
});

test('Documentation has usage examples', () => {
  const doc = fs.readFileSync('docs/PRODUCTION_MONITORING.md', 'utf-8');

  if (!doc.includes('npm run')) {
    throw new Error('Documentation missing npm script examples');
  }

  if (!doc.includes('```')) {
    throw new Error('Documentation missing code examples');
  }
});

// ============================================================================
// Integration Tests
// ============================================================================

test('Monitoring integrates with existing systems', () => {
  // Check that monitoring references other systems
  const doc = fs.readFileSync('docs/PRODUCTION_MONITORING.md', 'utf-8');

  if (!doc.includes('CORE_WEB_VITALS.md')) {
    throw new Error('Missing reference to Core Web Vitals guide');
  }

  if (!doc.includes('performance-budgets.json')) {
    throw new Error('Missing reference to performance budgets');
  }
});

// ============================================================================
// Print Results
// ============================================================================

console.log('\n═══════════════════════════════════════════════════════════');
console.log('                      TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Tests: ${passCount + failCount}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);

const passRate = Math.round((passCount / (passCount + failCount)) * 100);
console.log(`\nPass Rate: ${passRate}%`);

// Grade
let grade;
if (passRate >= 95) grade = 'A+ (Excellent)';
else if (passRate >= 90) grade = 'A (Very Good)';
else if (passRate >= 85) grade = 'B+ (Good)';
else if (passRate >= 80) grade = 'B (Satisfactory)';
else if (passRate >= 75) grade = 'C+ (Acceptable)';
else if (passRate >= 70) grade = 'C (Needs Improvement)';
else grade = 'D (Poor)';

console.log(`Grade: ${grade}`);
console.log('═══════════════════════════════════════════════════════════\n');

// Exit code
process.exit(failCount > 0 ? 1 : 0);
