#!/usr/bin/env node

/**
 * Validation Tests for Iteration Effectiveness Tracking
 * Feature #56: Continue iterative improvement cycles
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '..', 'reports', 'iterations');
const TRACKING_FILE = path.join(REPORTS_DIR, 'iteration-tracking.json');
const EFFECTIVENESS_REPORT = path.join(REPORTS_DIR, 'effectiveness-report.md');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n📋 Validating Iteration Effectiveness Tracking System\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Test 1: Script exists and is executable
test('Script exists and is executable', () => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'track-iteration-effectiveness.js');
  assert(fs.existsSync(scriptPath), 'Script file does not exist');
  const stats = fs.statSync(scriptPath);
  assert(stats.mode & fs.constants.S_IXUSR, 'Script is not executable');
});

// Test 2: Tracking file is generated
test('Tracking file is generated', () => {
  assert(fs.existsSync(TRACKING_FILE), 'Tracking file does not exist');
  const content = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  assert(content.lastUpdated, 'Missing lastUpdated timestamp');
  assert(content.metrics, 'Missing metrics object');
  assert(content.history, 'Missing history array');
});

// Test 3: Effectiveness report is generated
test('Effectiveness report is generated', () => {
  assert(fs.existsSync(EFFECTIVENESS_REPORT), 'Effectiveness report does not exist');
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');
  assert(content.includes('# Iteration Effectiveness Report'), 'Missing report title');
  assert(content.includes('Executive Summary'), 'Missing executive summary');
  assert(content.includes('Successful Patterns'), 'Missing successful patterns section');
});

// Test 4: Tracking data structure is valid
test('Tracking data structure is valid', () => {
  const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));

  // Check metrics structure
  assert(typeof data.metrics.totalIterations === 'number', 'Invalid totalIterations');
  assert(typeof data.metrics.totalPagesImproved === 'number', 'Invalid totalPagesImproved');
  assert(typeof data.metrics.totalChangesApplied === 'number', 'Invalid totalChangesApplied');
  assert(typeof data.metrics.totalQualityPointsGained === 'number', 'Invalid totalQualityPointsGained');

  // Check history structure
  assert(Array.isArray(data.history), 'History is not an array');
  if (data.history.length > 0) {
    const latest = data.history[data.history.length - 1];
    assert(latest.date, 'History entry missing date');
    assert(typeof latest.totalIterations === 'number', 'History entry missing totalIterations');
  }
});

// Test 5: Metrics are reasonable
test('Metrics are reasonable', () => {
  const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));

  assert(data.metrics.totalIterations >= 0, 'Negative iterations count');
  assert(data.metrics.totalPagesImproved >= 0, 'Negative pages improved count');
  assert(data.metrics.totalChangesApplied >= 0, 'Negative changes count');
  assert(data.metrics.totalQualityPointsGained >= 0, 'Negative quality points');

  // Sanity checks
  if (data.metrics.totalIterations > 0) {
    assert(data.metrics.totalPagesImproved > 0, 'No pages improved despite iterations');
    assert(data.metrics.totalChangesApplied > 0, 'No changes applied despite iterations');
  }
});

// Test 6: Report contains iteration history
test('Report contains iteration history', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  assert(content.includes('Iteration History'), 'Missing iteration history section');
  assert(content.includes('| Iteration | Date |'), 'Missing iteration history table');
});

// Test 7: Report contains successful patterns
test('Report contains successful patterns', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  assert(content.includes('## Successful Patterns'), 'Missing successful patterns section');

  const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  if (Object.keys(data.metrics.successfulPatterns).length > 0) {
    assert(content.includes('Times Applied'), 'Missing pattern details');
    assert(content.includes('Average Improvement'), 'Missing average improvement');
  }
});

// Test 8: Report contains current page performance
test('Report contains current page performance', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  // Check if UX data is available
  const uxReportDir = path.join(__dirname, '..', 'reports', 'ux-analysis');
  if (fs.existsSync(uxReportDir) && fs.readdirSync(uxReportDir).length > 0) {
    assert(content.includes('Current Page Performance'), 'Missing page performance section');
    assert(content.includes('Top Performers'), 'Missing top performers');
    assert(content.includes('Bottom Performers'), 'Missing bottom performers');
  }
});

// Test 9: Report contains recommendations
test('Report contains recommendations', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  assert(content.includes('## Recommendations'), 'Missing recommendations section');
  assert(content.includes('## Action Items'), 'Missing action items section');
});

// Test 10: Report contains long-term projections
test('Report contains long-term projections', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  if (data.metrics.totalIterations > 0) {
    assert(content.includes('Long-Term Projections'), 'Missing projections section');
    assert(content.includes('3 months'), 'Missing 3-month projection');
    assert(content.includes('6 months'), 'Missing 6-month projection');
    assert(content.includes('12 months'), 'Missing 12-month projection');
  }
});

// Test 11: History tracking works correctly
test('History tracking works correctly', () => {
  const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));

  assert(Array.isArray(data.history), 'History is not an array');
  assert(data.history.length <= 30, 'History exceeds 30 entries (should auto-trim)');

  if (data.history.length > 0) {
    // Check chronological order
    for (let i = 1; i < data.history.length; i++) {
      const prev = new Date(data.history[i - 1].date);
      const curr = new Date(data.history[i].date);
      // Allow same date or newer
      assert(curr >= prev || isNaN(curr) || isNaN(prev), 'History not in chronological order');
    }
  }
});

// Test 12: Pattern success tracking is accurate
test('Pattern success tracking is accurate', () => {
  const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));

  Object.entries(data.metrics.successfulPatterns).forEach(([name, pattern]) => {
    assert(typeof pattern.count === 'number', `Pattern ${name}: invalid count`);
    assert(typeof pattern.totalImprovement === 'number', `Pattern ${name}: invalid totalImprovement`);
    assert(!isNaN(parseFloat(pattern.averageImprovement)), `Pattern ${name}: invalid averageImprovement`);

    // Average should be reasonable
    if (pattern.count > 0) {
      const calculatedAvg = pattern.totalImprovement / pattern.count;
      const reportedAvg = parseFloat(pattern.averageImprovement);
      assert(Math.abs(calculatedAvg - reportedAvg) < 0.1, `Pattern ${name}: average calculation mismatch`);
    }
  });
});

// Test 13: Integration with iteration system
test('Integration with iteration system', () => {
  // Check that we can read all iteration reports
  const files = fs.readdirSync(REPORTS_DIR);
  const lessonsLearned = files.filter(f => f.startsWith('lessons-learned-iteration-'));
  const pilotImplementations = files.filter(f => f.startsWith('pilot-implementation-'));
  const pilotAnalyses = files.filter(f => f.startsWith('pilot-analysis-'));
  const patternScalings = files.filter(f => f.startsWith('pattern-scaling-'));

  assert(lessonsLearned.length > 0, 'No lessons learned files found');

  // Verify we can parse all files
  lessonsLearned.forEach(file => {
    if (file.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, file), 'utf8'));
      assert(data.executiveSummary, `${file}: missing executiveSummary`);
    }
  });
});

// Test 14: Report formatting is valid
test('Report formatting is valid', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  // Check markdown structure
  assert(content.includes('# '), 'Missing H1 header');
  assert(content.includes('## '), 'Missing H2 headers');
  assert(content.includes('| '), 'Missing tables');
  assert(content.includes('- **'), 'Missing bold bullet points');

  // Check for broken links or references
  assert(!content.includes('undefined'), 'Report contains undefined values');
  assert(!content.includes('NaN'), 'Report contains NaN values');
  assert(!content.includes('[object Object]'), 'Report contains unformatted objects');
});

// Test 15: Recommendations are actionable
test('Recommendations are actionable', () => {
  const content = fs.readFileSync(EFFECTIVENESS_REPORT, 'utf8');

  // Check for action-oriented language
  const hasActionItems = content.includes('Action Items');
  assert(hasActionItems, 'Missing action items');

  // Check for specific recommendations
  assert(
    content.includes('iteration') || content.includes('monitor') || content.includes('analyze'),
    'No actionable recommendations found'
  );
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);

const successRate = ((passed / (passed + failed)) * 100).toFixed(1);
console.log(`🎯 Success Rate: ${successRate}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Iteration tracking system is working perfectly.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
