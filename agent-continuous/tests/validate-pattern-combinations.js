#!/usr/bin/env node

/**
 * Validation Tests for Pattern Combination Testing & Application System
 *
 * Validates:
 * - Pattern identification and categorization
 * - Combination testing logic
 * - Application planning
 * - Top performer analysis
 * - Quality metrics calculation
 * - Report generation
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TESTS = {
  componentTests: [],
  dataStructureTests: [],
  functionalityTests: [],
  integrationTests: [],
  qualityTests: []
};

let passedTests = 0;
let failedTests = 0;

// ============================================================================
// TEST UTILITIES
// ============================================================================

function test(category, name, fn) {
  TESTS[category].push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function loadJSON(filepath) {
  try {
    if (!fs.existsSync(filepath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    return null;
  }
}

// ============================================================================
// COMPONENT TESTS
// ============================================================================

test('componentTests', 'Script exists and is accessible', () => {
  const scriptPath = path.join(__dirname, '../scripts/test-pattern-combinations.js');
  assert(fs.existsSync(scriptPath), 'Script file should exist');
});

test('componentTests', 'Script has correct permissions', () => {
  const scriptPath = path.join(__dirname, '../scripts/test-pattern-combinations.js');
  const stats = fs.statSync(scriptPath);
  assert(stats.isFile(), 'Should be a file');
});

test('componentTests', 'Results file is generated', () => {
  const resultsPath = path.join(__dirname, '../reports/iterations/pattern-combination-results.json');
  const exists = fs.existsSync(resultsPath);
  assert(exists, 'Results file should be generated');
});

test('componentTests', 'Markdown report is generated', () => {
  const reportPath = path.join(__dirname, '../reports/iterations/pattern-combination-report.md');
  const exists = fs.existsSync(reportPath);
  assert(exists, 'Markdown report should be generated');
});

// ============================================================================
// DATA STRUCTURE TESTS
// ============================================================================

test('dataStructureTests', 'Results have valid structure', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  assert(results !== null, 'Results should be valid JSON');
  assert(results.timestamp, 'Should have timestamp');
  assert(Array.isArray(results.provenPatterns), 'Should have provenPatterns array');
  assert(Array.isArray(results.emergingPatterns), 'Should have emergingPatterns array');
  assert(Array.isArray(results.combinations), 'Should have combinations array');
  assert(Array.isArray(results.targetPages), 'Should have targetPages array');
  assert(results.applicationPlan, 'Should have applicationPlan');
  assert(results.metrics, 'Should have metrics');
  assert(results.summary, 'Should have summary');
});

test('dataStructureTests', 'Proven patterns have required fields', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.provenPatterns.length > 0) {
    const pattern = results.provenPatterns[0];
    assert(pattern.name, 'Pattern should have name');
    assert(typeof pattern.impact === 'number', 'Pattern should have numeric impact');
    assert(pattern.confidence, 'Pattern should have confidence level');
    assert(pattern.status, 'Pattern should have status');
  }
});

test('dataStructureTests', 'Combinations have required fields', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.combinations.length > 0) {
    const combo = results.combinations[0];
    assert(Array.isArray(combo.patterns), 'Combination should have patterns array');
    assert(Array.isArray(combo.individualImpacts), 'Combination should have individualImpacts array');
    assert(typeof combo.combinedImpact === 'number', 'Combination should have numeric combinedImpact');
    assert(combo.avgConfidence, 'Combination should have avgConfidence');
    assert(typeof combo.synergy === 'boolean', 'Combination should have boolean synergy');
    assert(combo.recommendation, 'Combination should have recommendation');
    assert(combo.priority, 'Combination should have priority');
  }
});

test('dataStructureTests', 'Application plan has required structure', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.applicationPlan) {
    const plan = results.applicationPlan;
    assert(Array.isArray(plan.immediate), 'Plan should have immediate actions array');
    assert(Array.isArray(plan.pilot), 'Plan should have pilot actions array');
    assert(Array.isArray(plan.scheduled), 'Plan should have scheduled actions array');
  }
});

test('dataStructureTests', 'Metrics have valid structure', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.metrics) {
    const metrics = results.metrics;
    assert(metrics.patternLibraryHealth, 'Metrics should have patternLibraryHealth');
    assert(metrics.combinationPotential, 'Metrics should have combinationPotential');
    assert(metrics.applicationOpportunity, 'Metrics should have applicationOpportunity');
    assert(metrics.systemHealth, 'Metrics should have systemHealth');
    assert(typeof metrics.systemHealth.qualityScore === 'number', 'Quality score should be numeric');
  }
});

// ============================================================================
// FUNCTIONALITY TESTS
// ============================================================================

test('functionalityTests', 'Proven patterns are identified correctly', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results) {
    // Should identify patterns with >= 5 points impact
    const allProvenHighImpact = results.provenPatterns.every(p => p.impact >= 5);
    assert(allProvenHighImpact, 'All proven patterns should have >= 5 points impact');

    // Should be sorted by impact (highest first)
    for (let i = 0; i < results.provenPatterns.length - 1; i++) {
      assert(results.provenPatterns[i].impact >= results.provenPatterns[i + 1].impact,
             'Proven patterns should be sorted by impact (descending)');
    }
  }
});

test('functionalityTests', 'Pattern combinations are generated', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.provenPatterns.length >= 2) {
    // Should generate combinations
    assert(results.combinations.length > 0, 'Should generate pattern combinations');

    // Combined impact should equal sum of individual impacts
    const combo = results.combinations[0];
    const expectedSum = combo.individualImpacts.reduce((sum, i) => sum + i, 0);
    assert(Math.abs(combo.combinedImpact - expectedSum) < 0.01,
           'Combined impact should equal sum of individual impacts');
  }
});

test('functionalityTests', 'Synergy is identified correctly', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.combinations.length > 0) {
    // Synergy should be identified for high combined impact
    const synergyCombos = results.combinations.filter(c => c.synergy);
    if (synergyCombos.length > 0) {
      // All synergy combos should have >= 15 points combined impact
      const allHighImpact = synergyCombos.every(c => c.combinedImpact >= 15);
      assert(allHighImpact, 'Synergy combinations should have >= 15 points combined impact');
    }
  }
});

test('functionalityTests', 'Target pages are identified correctly', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.targetPages) {
    // All target pages should have quality score < 50
    const allLowQuality = results.targetPages.every(p => p.qualityScore < 50);
    assert(allLowQuality, 'All target pages should have quality score < 50');

    // Should be sorted by quality score (lowest first)
    for (let i = 0; i < results.targetPages.length - 1; i++) {
      assert(results.targetPages[i].qualityScore <= results.targetPages[i + 1].qualityScore,
             'Target pages should be sorted by quality score (ascending)');
    }
  }
});

test('functionalityTests', 'Application plan is prioritized correctly', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  if (results && results.applicationPlan) {
    const plan = results.applicationPlan;

    // Immediate actions should apply top pattern to worst pages
    if (plan.immediate.length > 0) {
      const action = plan.immediate[0];
      assert(action.priority === 'critical', 'Immediate actions should have critical priority');
      assert(action.expectedImprovement > 0, 'Should have positive expected improvement');
    }

    // Scheduled actions should have timeline
    if (plan.scheduled.length > 0) {
      const action = plan.scheduled[0];
      assert(action.timeline, 'Scheduled actions should have timeline');
    }
  }
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test('integrationTests', 'Integrates with pattern library', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  const library = loadJSON(path.join(__dirname, '../reports/iterations/pattern-library.json'));

  if (results && library) {
    // Proven patterns should come from library
    const libraryPatternNames = library.patterns.map(p => p.name);
    const allFromLibrary = results.provenPatterns.every(p =>
      libraryPatternNames.includes(p.name));
    assert(allFromLibrary, 'Proven patterns should come from pattern library');
  }
});

test('integrationTests', 'Integrates with UX analysis', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  const uxAnalysis = loadJSON(path.join(__dirname, '../reports/ux-analysis/ux-analysis-2026-02-01.json'));

  if (results && uxAnalysis && uxAnalysis.engagementAnalysis) {
    // Target pages should exist in UX analysis
    const uxPages = Object.keys(uxAnalysis.engagementAnalysis);
    const allInUX = results.targetPages.every(p => uxPages.includes(p.page));
    assert(allInUX, 'Target pages should exist in UX analysis');
  }
});

test('integrationTests', 'Top performer analysis uses action impact data', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  const actionImpact = loadJSON(path.join(__dirname, '../reports/iterations/action-impact-report.json'));

  if (results && results.topPerformerAnalysis && actionImpact && actionImpact.improvementImpact) {
    const analysis = results.topPerformerAnalysis;
    const topPerformer = actionImpact.improvementImpact.topPerformer;

    if (topPerformer) {
      assert(analysis.page === topPerformer.page, 'Should analyze correct top performer page');
      assert(analysis.improvement === topPerformer.improvement, 'Should have correct improvement value');
    }
  }
});

test('integrationTests', 'Summary reflects actual data', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));

  if (results && results.summary) {
    assert(results.summary.provenPatternsCount === results.provenPatterns.length,
           'Summary proven count should match actual');
    assert(results.summary.emergingPatternsCount === results.emergingPatterns.length,
           'Summary emerging count should match actual');
    assert(results.summary.combinationsTested === results.combinations.length,
           'Summary combinations count should match actual');
    assert(results.summary.targetPagesCount === results.targetPages.length,
           'Summary target pages count should match actual');
  }
});

// ============================================================================
// QUALITY TESTS
// ============================================================================

test('qualityTests', 'High-impact patterns are prioritized', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));

  if (results && results.applicationPlan.immediate.length > 0) {
    const immediateAction = results.applicationPlan.immediate[0];
    const topPattern = results.provenPatterns[0];

    if (topPattern) {
      assert(immediateAction.pattern === topPattern.name,
             'Immediate action should use highest-impact pattern');
      assert(immediateAction.impact === topPattern.impact,
             'Immediate action should have correct impact');
    }
  }
});

test('qualityTests', 'Quality metrics are calculated correctly', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));

  if (results && results.metrics) {
    const metrics = results.metrics;

    // Pattern library health
    const expectedTotal = results.provenPatterns.length + results.emergingPatterns.length;
    assert(metrics.patternLibraryHealth.totalPatterns === expectedTotal,
           'Total patterns should be sum of proven and emerging');

    // Combination potential
    assert(metrics.combinationPotential.totalCombinations === results.combinations.length,
           'Total combinations should match combinations array length');

    // Quality score should be in valid range
    assert(metrics.systemHealth.qualityScore >= 0 && metrics.systemHealth.qualityScore <= 100,
           'Quality score should be between 0 and 100');
  }
});

test('qualityTests', 'Expected improvements are positive', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));

  if (results && results.applicationPlan) {
    const allActions = [
      ...results.applicationPlan.immediate,
      ...results.applicationPlan.scheduled
    ];

    const allPositive = allActions.every(action =>
      !action.expectedImprovement || action.expectedImprovement > 0);
    assert(allPositive, 'All expected improvements should be positive');
  }
});

test('qualityTests', 'Markdown report matches JSON data', () => {
  const results = loadJSON(path.join(__dirname, '../reports/iterations/pattern-combination-results.json'));
  const markdownPath = path.join(__dirname, '../reports/iterations/pattern-combination-report.md');

  if (results && fs.existsSync(markdownPath)) {
    const markdown = fs.readFileSync(markdownPath, 'utf8');

    // Check key values are in markdown
    assert(markdown.includes(results.summary.provenPatternsCount.toString()),
           'Markdown should include proven patterns count');
    assert(markdown.includes(results.summary.targetPagesCount.toString()),
           'Markdown should include target pages count');
    assert(markdown.includes(results.metrics.systemHealth.status),
           'Markdown should include system health status');
  }
});

// ============================================================================
// TEST RUNNER
// ============================================================================

function runTests() {
  console.log('🧪 Pattern Combination Testing Validation');
  console.log('========================================');
  console.log('');

  const categories = [
    { name: 'Component Tests', key: 'componentTests' },
    { name: 'Data Structure Tests', key: 'dataStructureTests' },
    { name: 'Functionality Tests', key: 'functionalityTests' },
    { name: 'Integration Tests', key: 'integrationTests' },
    { name: 'Quality Tests', key: 'qualityTests' }
  ];

  for (const category of categories) {
    console.log(`\n${category.name}:`);
    console.log('─'.repeat(50));

    const tests = TESTS[category.key];
    let categoryPassed = 0;
    let categoryFailed = 0;

    for (const test of tests) {
      try {
        test.fn();
        console.log(`✅ ${test.name}`);
        categoryPassed++;
        passedTests++;
      } catch (error) {
        console.log(`❌ ${test.name}`);
        console.log(`   ${error.message}`);
        categoryFailed++;
        failedTests++;
      }
    }

    console.log(`\n${category.name} Summary: ${categoryPassed}/${tests.length} passed`);
  }

  // Overall summary
  console.log('\n');
  console.log('========================================');
  console.log('Overall Test Results');
  console.log('========================================');
  console.log(`Total Tests: ${passedTests + failedTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n✅ All tests passed!');
    console.log('   Grade: A+ (100%)');
  } else if (passedTests / (passedTests + failedTests) >= 0.9) {
    console.log('\n✅ Most tests passed!');
    console.log('   Grade: A');
  } else if (passedTests / (passedTests + failedTests) >= 0.8) {
    console.log('\n⚠️  Some tests failed');
    console.log('   Grade: B');
  } else {
    console.log('\n❌ Many tests failed');
    console.log('   Grade: C or below');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests();
