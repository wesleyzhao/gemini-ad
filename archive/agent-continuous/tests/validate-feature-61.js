#!/usr/bin/env node

/**
 * Test Suite for Feature #61
 * Continue executing validation-driven actions, scaling successful patterns,
 * and maintaining the autonomous optimization system
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failures.push({ name, error: error.message });
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function fileExists(filepath) {
  return fs.existsSync(filepath);
}

function loadJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

console.log('🧪 TESTING FEATURE #61: AUTONOMOUS OPTIMIZATION SYSTEM MAINTENANCE\n');
console.log('=' .repeat(80));
console.log();

// ============================================================================
// Component Tests
// ============================================================================

console.log('📦 Component Tests\n');

test('Execute-next-cycle script exists', () => {
  assert(fileExists('scripts/execute-next-cycle.js'), 'Script not found');
});

test('Execute-next-cycle script is executable', () => {
  const stats = fs.statSync('scripts/execute-next-cycle.js');
  assert(stats.mode & 0o111, 'Script is not executable');
});

test('Cycle 2 summary report generated', () => {
  assert(fileExists('reports/iterations/cycle-2-summary.md'), 'Summary report not found');
});

test('Pattern library created', () => {
  assert(fileExists('reports/iterations/pattern-library.json'), 'Pattern library not found');
});

test('System status tracking exists', () => {
  assert(fileExists('reports/iterations/system-status.json'), 'System status not found');
});

test('Pattern scaling results exist', () => {
  assert(fileExists('reports/iterations/pattern-scaling-next-cycle.json'), 'Scaling results not found');
});

console.log();

// ============================================================================
// Data Structure Tests
// ============================================================================

console.log('📊 Data Structure Tests\n');

test('Pattern library has valid structure', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  assert(lib.version, 'Missing version');
  assert(lib.lastUpdated, 'Missing lastUpdated');
  assert(Array.isArray(lib.patterns), 'Patterns is not an array');
  assert(lib.patterns.length > 0, 'No patterns documented');
});

test('Pattern library contains proven patterns', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const proven = lib.patterns.filter(p => p.status === 'proven');
  assert(proven.length > 0, 'No proven patterns found');
});

test('Pattern library contains best practices', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const practices = lib.patterns.filter(p => p.status === 'best-practice');
  assert(practices.length > 0, 'No best practices found');
});

test('Each pattern has required fields', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  lib.patterns.forEach(p => {
    assert(p.name, 'Pattern missing name');
    assert(p.status, 'Pattern missing status');
    assert(p.confidence, 'Pattern missing confidence');
    assert(p.recommendation, 'Pattern missing recommendation');
    assert(p.application, 'Pattern missing application details');
  });
});

test('System status has valid structure', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(status.timestamp, 'Missing timestamp');
  assert(status.cycleNumber, 'Missing cycle number');
  assert(status.health, 'Missing health metrics');
  assert(status.executionMetrics, 'Missing execution metrics');
  assert(status.patternLibrary, 'Missing pattern library stats');
  assert(status.currentCycle, 'Missing current cycle info');
  assert(Array.isArray(status.nextSteps), 'Missing next steps');
});

test('Scaling results have valid structure', () => {
  const scaling = loadJSON('reports/iterations/pattern-scaling-next-cycle.json');
  assert(scaling.timestamp, 'Missing timestamp');
  assert(Array.isArray(scaling.patternsApplied), 'Patterns applied not array');
  assert(Array.isArray(scaling.pagesModified), 'Pages modified not array');
  assert(Array.isArray(scaling.results), 'Results not array');
  assert(typeof scaling.totalChanges === 'number', 'Total changes not number');
});

console.log();

// ============================================================================
// Functionality Tests
// ============================================================================

console.log('⚙️  Functionality Tests\n');

test('Recommendations were executed', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(status.currentCycle.recommendationsExecuted > 0, 'No recommendations executed');
});

test('Patterns were scaled to pages', () => {
  const scaling = loadJSON('reports/iterations/pattern-scaling-next-cycle.json');
  assert(scaling.pagesModified.length > 0, 'No pages were scaled');
  assert(scaling.totalChanges > 0, 'No changes applied');
});

test('High-confidence patterns were identified', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const highConf = lib.patterns.filter(p => p.confidence === 'High');
  assert(highConf.length > 0, 'No high-confidence patterns found');
});

test('System health is tracked', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(status.health.status, 'Health status missing');
  assert(status.health.strategyAdherence, 'Strategy adherence missing');
  assert(status.health.performanceMultiplier, 'Performance multiplier missing');
});

test('Next steps are defined', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(status.nextSteps.length >= 3, 'Not enough next steps defined');
});

test('Execution metrics are tracked', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(status.executionMetrics.actionsExecuted >= 0, 'Actions executed not tracked');
  assert(status.executionMetrics.successRate, 'Success rate not tracked');
  assert(status.executionMetrics.totalQualityGained >= 0, 'Quality gained not tracked');
});

console.log();

// ============================================================================
// Integration Tests
// ============================================================================

console.log('🔗 Integration Tests\n');

test('Pattern library integrates with lessons learned', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const lessons = loadJSON('reports/iterations/lessons-learned-iteration-1.json');

  // Check that successful patterns from lessons are in library
  const successfulPatterns = lessons.successfulPatterns || [];
  if (successfulPatterns.length > 0) {
    const libPatternNames = lib.patterns.map(p => p.name);
    const foundPattern = successfulPatterns.some(p =>
      libPatternNames.includes(p.pattern)
    );
    assert(foundPattern, 'Successful patterns not in library');
  }
});

test('Scaling integrates with pattern library', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const scaling = loadJSON('reports/iterations/pattern-scaling-next-cycle.json');

  if (scaling.patternsApplied.length > 0) {
    const libPatternNames = lib.patterns.map(p => p.name);
    const appliedPattern = scaling.patternsApplied[0];
    assert(
      libPatternNames.includes(appliedPattern),
      'Applied pattern not in library'
    );
  }
});

test('System status reflects actual execution', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  const scaling = loadJSON('reports/iterations/pattern-scaling-next-cycle.json');

  assert(
    status.currentCycle.patternsScaled === scaling.pagesModified.length,
    'Mismatch between status and scaling results'
  );
  assert(
    status.currentCycle.totalChangesApplied === scaling.totalChanges,
    'Mismatch in total changes'
  );
});

test('Cycle summary includes all key sections', () => {
  const summary = fs.readFileSync('reports/iterations/cycle-2-summary.md', 'utf8');
  assert(summary.includes('Executive Summary'), 'Missing executive summary');
  assert(summary.includes('Executed Recommendations'), 'Missing recommendations section');
  assert(summary.includes('Pattern Library'), 'Missing pattern library section');
  assert(summary.includes('System Health'), 'Missing health section');
  assert(summary.includes('Next Steps'), 'Missing next steps');
});

test('Summary reflects correct cycle number', () => {
  const summary = fs.readFileSync('reports/iterations/cycle-2-summary.md', 'utf8');
  assert(summary.includes('Cycle 2') || summary.includes('Cycle Summary - Cycle 2'),
    'Incorrect cycle number in summary');
});

console.log();

// ============================================================================
// Quality Tests
// ============================================================================

console.log('✨ Quality Tests\n');

test('Pattern library has high-confidence patterns', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const highConf = lib.patterns.filter(p => p.confidence === 'High');
  assert(highConf.length > 0, 'No high-confidence patterns documented');
});

test('Proven patterns have impact data', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  const proven = lib.patterns.filter(p => p.status === 'proven');
  proven.forEach(p => {
    assert(p.avgImpact, `Pattern ${p.name} missing impact data`);
  });
});

test('System maintains excellent health', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(
    status.health.status === 'EXCELLENT' || status.health.status === 'GOOD',
    'System health not maintained'
  );
});

test('Success rate remains high', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  const rate = parseFloat(status.executionMetrics.successRate);
  assert(rate >= 80, `Success rate too low: ${rate}%`);
});

test('Quality gains are positive', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(
    status.executionMetrics.totalQualityGained > 0,
    'No quality gains recorded'
  );
});

test('Pattern library is growing', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  assert(lib.patterns.length >= 3, 'Pattern library too small');
});

console.log();

// ============================================================================
// Continuous Improvement Tests
// ============================================================================

console.log('🔄 Continuous Improvement Tests\n');

test('Next iteration targets are identified', () => {
  const lessons = loadJSON('reports/iterations/lessons-learned-iteration-1.json');
  assert(lessons.nextIteration, 'Next iteration plan missing');
  assert(lessons.nextIteration.targets, 'Next targets not identified');
  assert(lessons.nextIteration.focus, 'Next focus area not defined');
});

test('System has actionable next steps', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  const actionableSteps = status.nextSteps.filter(s =>
    s.toLowerCase().includes('monitor') ||
    s.toLowerCase().includes('execute') ||
    s.toLowerCase().includes('track')
  );
  assert(actionableSteps.length > 0, 'No actionable next steps');
});

test('Pattern library supports future scaling', () => {
  const lib = loadJSON('reports/iterations/pattern-library.json');
  lib.patterns.forEach(p => {
    assert(p.application, `Pattern ${p.name} missing application details`);
    assert(p.application.targetPages, `Pattern ${p.name} missing target pages`);
  });
});

test('System tracks long-term metrics', () => {
  const status = loadJSON('reports/iterations/system-status.json');
  assert(status.executionMetrics.pagesImproved, 'Pages improved not tracked');
  assert(status.patternLibrary.totalPatterns, 'Pattern count not tracked');
});

console.log();

// ============================================================================
// Documentation Tests
// ============================================================================

console.log('📚 Documentation Tests\n');

test('Cycle summary is comprehensive', () => {
  const summary = fs.readFileSync('reports/iterations/cycle-2-summary.md', 'utf8');
  assert(summary.length > 1000, 'Summary too brief');
});

test('Pattern library is documented', () => {
  const summary = fs.readFileSync('reports/iterations/cycle-2-summary.md', 'utf8');
  assert(summary.includes('Pattern Library'), 'Pattern library not documented');
});

test('Results are quantified', () => {
  const summary = fs.readFileSync('reports/iterations/cycle-2-summary.md', 'utf8');
  assert(summary.includes('points') || summary.includes('changes'),
    'Results not quantified');
});

test('Next steps are documented', () => {
  const summary = fs.readFileSync('reports/iterations/cycle-2-summary.md', 'utf8');
  assert(summary.includes('Next Steps'), 'Next steps not documented');
});

console.log();

// ============================================================================
// Results
// ============================================================================

console.log('=' .repeat(80));
console.log('\n📊 TEST RESULTS\n');
console.log(`Total tests: ${passed + failed}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log();

if (failed > 0) {
  console.log('Failed tests:');
  failures.forEach(f => {
    console.log(`  ❌ ${f.name}`);
    console.log(`     ${f.error}`);
  });
  console.log();
}

const passRate = Math.round((passed / (passed + failed)) * 100);
console.log(`Pass rate: ${passRate}%`);

let grade;
if (passRate >= 95) grade = 'A+';
else if (passRate >= 90) grade = 'A';
else if (passRate >= 85) grade = 'B+';
else if (passRate >= 80) grade = 'B';
else if (passRate >= 75) grade = 'C';
else grade = 'F';

console.log(`Grade: ${grade}`);
console.log();

if (passRate === 100) {
  console.log('🎉 ALL TESTS PASSED! Feature #61 is production ready!');
  console.log();
  console.log('The autonomous optimization system is:');
  console.log('  ✅ Executing validation-driven actions');
  console.log('  ✅ Scaling successful patterns');
  console.log('  ✅ Maintaining pattern library');
  console.log('  ✅ Tracking system health');
  console.log('  ✅ Planning future iterations');
  console.log('  ✅ Continuously improving');
} else if (passRate >= 90) {
  console.log('✅ Feature #61 is operational with minor issues');
} else {
  console.log('⚠️  Feature #61 needs attention');
}

console.log();
console.log('=' .repeat(80));

process.exit(failed > 0 ? 1 : 0);
