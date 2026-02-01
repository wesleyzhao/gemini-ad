#!/usr/bin/env node

/**
 * Validation Tests for Strategy Effectiveness Validator (Feature #58)
 *
 * Tests that the strategy effectiveness validation system works correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

let testsPassed = 0;
let testsFailed = 0;
let testsSkipped = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    log(`✅ ${name}`, 'green');
  } catch (error) {
    testsFailed++;
    log(`❌ ${name}`, 'red');
    log(`   Error: ${error.message}`, 'red');
  }
}

function skip(name, reason) {
  testsSkipped++;
  log(`⏭️  ${name} (skipped: ${reason})`, 'yellow');
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertExists(filepath, message) {
  if (!fs.existsSync(filepath)) {
    throw new Error(message || `File does not exist: ${filepath}`);
  }
}

function assertValidJSON(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  try {
    JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filepath}: ${error.message}`);
  }
}

// Test Suite
log('\n🧪 Strategy Effectiveness Validator - Test Suite', 'bright');
log('==================================================\n', 'bright');

const scriptsDir = path.join(__dirname, '../scripts');
const reportsDir = path.join(__dirname, '../reports/iterations');

// Component Tests
log('📦 Component Tests', 'cyan');

test('Script exists and is accessible', () => {
  const scriptPath = path.join(scriptsDir, 'validate-strategy-effectiveness.js');
  assertExists(scriptPath, 'validate-strategy-effectiveness.js not found');
  assertTrue(
    fs.statSync(scriptPath).mode & fs.constants.S_IXUSR,
    'Script is not executable'
  );
});

test('Script executes without errors', () => {
  try {
    execSync('node scripts/validate-strategy-effectiveness.js', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
  } catch (error) {
    throw new Error(`Script execution failed: ${error.message}`);
  }
});

test('Validation JSON is generated', () => {
  const jsonPath = path.join(reportsDir, 'strategy-validation.json');
  assertExists(jsonPath, 'strategy-validation.json not found');
  assertValidJSON(jsonPath);
});

test('Validation report is generated', () => {
  const mdPath = path.join(reportsDir, 'strategy-validation.md');
  assertExists(mdPath, 'strategy-validation.md not found');
  const content = fs.readFileSync(mdPath, 'utf8');
  assertTrue(content.length > 0, 'Report is empty');
  assertTrue(
    content.includes('Strategy Effectiveness Validation Report'),
    'Report missing title'
  );
});

// Content Tests
log('\n📝 Content Tests', 'cyan');

test('Validation data structure is valid', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  assertTrue(data.timestamp, 'Missing timestamp');
  assertTrue(data.summary, 'Missing summary');
  assertTrue(data.adherence, 'Missing adherence analysis');
  assertTrue(data.impact, 'Missing impact analysis');
  assertTrue(data.patterns, 'Missing pattern analysis');
  assertTrue(data.recommendations, 'Missing recommendations');
});

test('Strategy adherence analysis is present', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  assertTrue(data.adherence.status, 'Missing adherence status');

  if (data.adherence.status === 'analyzed') {
    assertTrue(
      typeof data.adherence.adherenceRate === 'number',
      'Missing adherence rate'
    );
    assertTrue(data.adherence.currentStrategy, 'Missing current strategy');
    assertTrue(data.adherence.recommendation, 'Missing adherence recommendation');
  }
});

test('Impact analysis is present', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  assertTrue(data.impact.status, 'Missing impact status');

  if (data.impact.status === 'analyzed') {
    assertTrue(data.impact.expected, 'Missing expected impact');
    assertTrue(data.impact.actual, 'Missing actual impact');
    assertTrue(data.impact.assessment, 'Missing impact assessment');
  }
});

test('Pattern analysis is present', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  assertTrue(data.patterns.status, 'Missing pattern status');

  if (data.patterns.status === 'analyzed') {
    assertTrue(data.patterns.patterns, 'Missing pattern summary');
    assertTrue(Array.isArray(data.patterns.insights), 'Missing insights array');
  }
});

test('Recommendations are generated', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  assertTrue(
    Array.isArray(data.recommendations.recommendations),
    'Recommendations is not an array'
  );
  assertTrue(
    typeof data.recommendations.count === 'number',
    'Missing recommendation count'
  );
  assertTrue(
    typeof data.recommendations.highPriority === 'number',
    'Missing high priority count'
  );
});

// Report Format Tests
log('\n📄 Report Format Tests', 'cyan');

test('Report contains executive summary', () => {
  const report = fs.readFileSync(
    path.join(reportsDir, 'strategy-validation.md'),
    'utf8'
  );

  assertTrue(report.includes('## Executive Summary'), 'Missing executive summary');
  assertTrue(report.includes('**Status**:'), 'Missing status');
  assertTrue(report.includes('**Data Points**:'), 'Missing data points');
  assertTrue(report.includes('**Key Finding**:'), 'Missing key finding');
});

test('Report contains strategy adherence section', () => {
  const report = fs.readFileSync(
    path.join(reportsDir, 'strategy-validation.md'),
    'utf8'
  );

  assertTrue(
    report.includes('## 📋 Strategy Adherence') ||
    report.includes('insufficient_data'),
    'Missing strategy adherence section'
  );
});

test('Report contains impact analysis section', () => {
  const report = fs.readFileSync(
    path.join(reportsDir, 'strategy-validation.md'),
    'utf8'
  );

  assertTrue(
    report.includes('## 📊 Actual vs Expected Impact') ||
    report.includes('insufficient_data'),
    'Missing impact analysis section'
  );
});

test('Report contains pattern analysis section', () => {
  const report = fs.readFileSync(
    path.join(reportsDir, 'strategy-validation.md'),
    'utf8'
  );

  assertTrue(
    report.includes('## 🔍 Emerging Patterns') ||
    report.includes('insufficient_data'),
    'Missing pattern analysis section'
  );
});

test('Report contains refined recommendations', () => {
  const report = fs.readFileSync(
    path.join(reportsDir, 'strategy-validation.md'),
    'utf8'
  );

  assertTrue(
    report.includes('## 💡 Refined Recommendations'),
    'Missing recommendations section'
  );
});

test('Report contains action checklist', () => {
  const report = fs.readFileSync(
    path.join(reportsDir, 'strategy-validation.md'),
    'utf8'
  );

  assertTrue(report.includes('## ✅ Action Checklist'), 'Missing action checklist');
  assertTrue(
    report.includes('### Immediate Actions'),
    'Missing immediate actions'
  );
  assertTrue(
    report.includes('### Short-Term Actions'),
    'Missing short-term actions'
  );
  assertTrue(report.includes('### Long-Term Goals'), 'Missing long-term goals');
});

// Validation Logic Tests
log('\n🧮 Validation Logic Tests', 'cyan');

test('Adherence rate is calculated correctly', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  if (data.adherence.status === 'analyzed') {
    const rate = data.adherence.adherenceRate;
    assertTrue(
      rate >= 0 && rate <= 100,
      `Adherence rate out of range: ${rate}`
    );
  }
});

test('Impact assessment is provided', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  if (data.impact.status === 'analyzed') {
    const assessment = data.impact.assessment;
    assertTrue(
      assessment.includes('Exceeding') ||
      assessment.includes('On track') ||
      assessment.includes('Below'),
      'Invalid impact assessment'
    );
  }
});

test('Recommendations are prioritized', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  const recommendations = data.recommendations.recommendations;
  const priorities = recommendations.map(r => r.priority);

  // Check that priorities are valid
  priorities.forEach(priority => {
    assertTrue(
      ['high', 'medium', 'low', 'opportunity'].includes(priority),
      `Invalid priority: ${priority}`
    );
  });

  // Check that high priority comes first (if present)
  const firstHighIndex = priorities.indexOf('high');
  const firstLowIndex = priorities.indexOf('low');

  if (firstHighIndex !== -1 && firstLowIndex !== -1) {
    assertTrue(
      firstHighIndex < firstLowIndex,
      'High priority recommendations should come before low priority'
    );
  }
});

// Integration Tests
log('\n🔗 Integration Tests', 'cyan');

test('Data is integrated from strategy optimization', () => {
  const strategyData = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-optimization.json'), 'utf8')
  );

  const validationData = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  assertTrue(
    strategyData.timestamp || strategyData.generated,
    'Strategy optimization data is missing timestamp/generated field'
  );
  assertTrue(
    validationData.timestamp,
    'Validation data is missing timestamp'
  );
});

test('Data is integrated from trend tracking', () => {
  const trendData = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'trend-data.json'), 'utf8')
  );

  assertTrue(Array.isArray(trendData.snapshots), 'Trend snapshots not found');
  assertTrue(trendData.snapshots.length > 0, 'No trend snapshots available');
});

test('Validation detects strategy changes', () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(reportsDir, 'strategy-validation.json'), 'utf8')
  );

  if (data.adherence.status === 'analyzed') {
    // Adherence analysis should have been performed
    assertTrue(
      data.adherence.recentSnapshots > 0,
      'No recent snapshots analyzed'
    );
  }
});

// Print results
log('\n' + '='.repeat(50), 'cyan');
log('📊 Test Results', 'bright');
log('='.repeat(50), 'cyan');
log(`✅ Passed: ${testsPassed}`, 'green');
log(`❌ Failed: ${testsFailed}`, 'red');
log(`⏭️  Skipped: ${testsSkipped}`, 'yellow');
log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`, 'cyan');
log('='.repeat(50) + '\n', 'cyan');

if (testsFailed > 0) {
  log('❌ Some tests failed. Please review the errors above.', 'red');
  process.exit(1);
} else {
  log('✅ All tests passed! Strategy effectiveness validator is working correctly.', 'green');
  process.exit(0);
}
