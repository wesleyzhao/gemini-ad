#!/usr/bin/env node

/**
 * Test Suite: Iterative Optimization Cycle System
 *
 * Validates the complete iterative optimization workflow including:
 * - Cycle execution
 * - Performance tracking
 * - Learning accumulation
 * - Report generation
 * - Integration with all components
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Test configuration
const TEST_CONFIG = {
  testReportsDir: './test-reports-iterative',
  iterativeScript: './scripts/iterative-optimization-cycle.js',
  monitorScript: './scripts/monitor-production-performance.js',
  analyzeScript: './scripts/analyze-ab-test-results.js',
  createTestScript: './scripts/create-ab-test-variations.js',
  scaleScript: './scripts/scale-to-production.js'
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Run a test
 */
function runTest(name, testFn) {
  testResults.total++;
  try {
    testFn();
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

/**
 * Setup test environment
 */
function setupTestEnvironment() {
  // Ensure test reports directory exists
  if (!fs.existsSync(TEST_CONFIG.testReportsDir)) {
    fs.mkdirSync(TEST_CONFIG.testReportsDir, { recursive: true });
  }

  // Create test optimization directory
  const optimizationDir = './reports/optimization';
  if (!fs.existsSync(optimizationDir)) {
    fs.mkdirSync(optimizationDir, { recursive: true });
  }

  // Create mock data files
  createMockPerformanceData();
  createMockABTestData();
  createMockPatternLibrary();
}

/**
 * Create mock performance data
 */
function createMockPerformanceData() {
  const mockData = {
    summary: {
      overallHealth: {
        status: 'good',
        averageScore: 78.5
      },
      patterns: {
        total: 5,
        production: 3,
        pilot: 2
      }
    },
    regressions: [],
    alerts: [],
    timestamp: new Date().toISOString()
  };

  const productionDir = './reports/production';
  if (!fs.existsSync(productionDir)) {
    fs.mkdirSync(productionDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(productionDir, 'performance-monitoring.json'),
    JSON.stringify(mockData, null, 2)
  );
}

/**
 * Create mock A/B test data
 */
function createMockABTestData() {
  const mockTests = {
    tests: [
      {
        id: 'test_cta_001',
        patternName: 'Call to Action',
        status: 'active',
        variations: [
          { id: 'control', name: 'Control', type: 'control' },
          { id: 'var1', name: 'Enhanced', type: 'variation', expectedImpact: 10 }
        ],
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  };

  const abTestDir = './reports/ab-tests';
  if (!fs.existsSync(abTestDir)) {
    fs.mkdirSync(abTestDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(abTestDir, 'active-tests.json'),
    JSON.stringify(mockTests, null, 2)
  );
}

/**
 * Create mock pattern library
 */
function createMockPatternLibrary() {
  const mockLibrary = {
    patterns: [
      {
        name: 'Call to Action',
        category: 'conversion',
        status: 'production',
        validation: {
          successRate: 0.85,
          applications: 5,
          avgImpact: 8.5
        }
      },
      {
        name: 'Visual Hierarchy',
        category: 'design',
        status: 'pilot',
        validation: {
          successRate: 0.75,
          applications: 3,
          avgImpact: 6.2
        }
      }
    ],
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  };

  const iterationsDir = './reports/iterations';
  if (!fs.existsSync(iterationsDir)) {
    fs.mkdirSync(iterationsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(iterationsDir, 'pattern-library.json'),
    JSON.stringify(mockLibrary, null, 2)
  );
}

/**
 * Cleanup test environment
 */
function cleanupTestEnvironment() {
  // Remove test cycle history if exists
  const cycleHistoryPath = './reports/optimization/cycle-history.json';
  if (fs.existsSync(cycleHistoryPath)) {
    fs.unlinkSync(cycleHistoryPath);
  }
}

// ============================================================================
// Component Tests
// ============================================================================

console.log('\n📦 Testing Component Availability...\n');

runTest('Iterative optimization script exists', () => {
  assert(fs.existsSync(TEST_CONFIG.iterativeScript),
    'Iterative optimization script not found');
});

runTest('Monitor production script exists', () => {
  assert(fs.existsSync(TEST_CONFIG.monitorScript),
    'Monitor production script not found');
});

runTest('Analyze AB test script exists', () => {
  assert(fs.existsSync(TEST_CONFIG.analyzeScript),
    'Analyze AB test script not found');
});

runTest('Create test variations script exists', () => {
  assert(fs.existsSync(TEST_CONFIG.createTestScript),
    'Create test variations script not found');
});

runTest('Scale to production script exists', () => {
  assert(fs.existsSync(TEST_CONFIG.scaleScript),
    'Scale to production script not found');
});

// ============================================================================
// Function Tests
// ============================================================================

console.log('\n🔧 Testing Core Functions...\n');

// Load the module
const iterativeModule = require(path.join('..', TEST_CONFIG.iterativeScript));

runTest('getPerformanceBaseline returns valid baseline', () => {
  setupTestEnvironment();
  const baseline = iterativeModule.getPerformanceBaseline();

  assert(typeof baseline === 'object', 'Baseline should be an object');
  assert(typeof baseline.initialScore === 'number', 'Should have initialScore');
  assert(typeof baseline.currentScore === 'number', 'Should have currentScore');
  assert(typeof baseline.targetScore === 'number', 'Should have targetScore');
  assert(Array.isArray(baseline.history), 'Should have history array');
});

runTest('updatePerformanceBaseline updates correctly', () => {
  const newScore = 80;
  const cycleId = 'test_cycle_001';

  const baseline = iterativeModule.updatePerformanceBaseline(newScore, cycleId);

  assert(baseline.currentScore === newScore, 'Score should be updated');
  assert(baseline.history.length > 0, 'History should have entries');
  assert(baseline.history[baseline.history.length - 1].cycleId === cycleId,
    'Latest history should have correct cycleId');
});

runTest('updatePerformanceBaseline calculates trends', () => {
  // Add multiple scores to establish a trend
  iterativeModule.updatePerformanceBaseline(75, 'cycle_1');
  iterativeModule.updatePerformanceBaseline(77, 'cycle_2');
  iterativeModule.updatePerformanceBaseline(79, 'cycle_3');
  iterativeModule.updatePerformanceBaseline(81, 'cycle_4');
  const baseline = iterativeModule.updatePerformanceBaseline(83, 'cycle_5');

  assert(baseline.trend !== undefined, 'Should have trend');
  assert(['improving', 'stable', 'declining'].includes(baseline.trend),
    'Trend should be valid value');
});

// ============================================================================
// Integration Tests
// ============================================================================

console.log('\n🔗 Testing Integration...\n');

runTest('monitorProductionPerformance returns valid results', () => {
  setupTestEnvironment();
  const result = iterativeModule.monitorProductionPerformance();

  assert(typeof result === 'object', 'Should return object');
  assert(typeof result.success === 'boolean', 'Should have success flag');
  assert(Array.isArray(result.regressions), 'Should have regressions array');
  assert(Array.isArray(result.alerts), 'Should have alerts array');
});

runTest('analyzeABTestResults returns valid results', () => {
  setupTestEnvironment();
  const result = iterativeModule.analyzeABTestResults();

  assert(typeof result === 'object', 'Should return object');
  assert(typeof result.success === 'boolean', 'Should have success flag');
  assert(Array.isArray(result.winners), 'Should have winners array');
  assert(Array.isArray(result.continuing), 'Should have continuing array');
  assert(Array.isArray(result.completed), 'Should have completed array');
});

runTest('scaleWinningVariations handles empty winners', () => {
  const result = iterativeModule.scaleWinningVariations([]);

  assert(result.success === true, 'Should succeed with empty winners');
  assert(result.scaled === 0, 'Should scale 0 patterns');
});

runTest('scaleWinningVariations handles winners correctly', () => {
  const mockWinners = [
    {
      patternName: 'Call to Action',
      results: {
        confidence: 0.96,
        liftOverControl: 8.5,
        statisticalSignificance: true
      }
    }
  ];

  const result = iterativeModule.scaleWinningVariations(mockWinners);

  assert(typeof result === 'object', 'Should return object');
  assert(typeof result.success === 'boolean', 'Should have success flag');
  assert(typeof result.scaled === 'number', 'Should have scaled count');
});

runTest('createNewABTests respects max tests limit', () => {
  setupTestEnvironment();
  const result = iterativeModule.createNewABTests(0);

  assert(result.success === true, 'Should succeed');
  assert(result.created === 0, 'Should create 0 tests when max is 0');
});

runTest('updateLearnings generates insights from winners', () => {
  const mockCycleResults = {
    cycleId: 'test_cycle',
    analysis: {
      winners: [
        {
          patternName: 'Call to Action',
          results: {
            winner: 'Enhanced',
            liftOverControl: 8.5,
            confidence: 0.96
          }
        }
      ]
    }
  };

  const result = iterativeModule.updateLearnings(mockCycleResults);

  assert(result.success === true, 'Should succeed');
  assert(result.learnings.insights.length > 0, 'Should have insights');
  assert(result.learnings.insights[0].pattern === 'Call to Action',
    'Should have correct pattern in insight');
});

// ============================================================================
// File Output Tests
// ============================================================================

console.log('\n📄 Testing File Outputs...\n');

runTest('Creates cycle history file', () => {
  setupTestEnvironment();

  // Trigger a baseline update to create the file
  iterativeModule.updatePerformanceBaseline(80, 'test_cycle');

  const baselinePath = './reports/optimization/performance-baseline.json';
  assert(fs.existsSync(baselinePath), 'Baseline file should be created');

  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  assert(baseline.history.length > 0, 'Baseline should have history');
});

runTest('Creates learnings file structure', () => {
  setupTestEnvironment();

  const mockCycleResults = {
    cycleId: 'test_cycle',
    analysis: { winners: [] }
  };

  iterativeModule.updateLearnings(mockCycleResults);

  const learningsPath = './reports/optimization/learnings.json';
  assert(fs.existsSync(learningsPath), 'Learnings file should be created');

  const learnings = JSON.parse(fs.readFileSync(learningsPath, 'utf8'));
  assert(Array.isArray(learnings.patterns), 'Should have patterns array');
  assert(Array.isArray(learnings.insights), 'Should have insights array');
  assert(Array.isArray(learnings.bestPractices), 'Should have bestPractices array');
});

// ============================================================================
// Edge Cases
// ============================================================================

console.log('\n⚠️  Testing Edge Cases...\n');

runTest('Handles missing performance data gracefully', () => {
  // Remove performance data file
  const perfPath = './reports/production/performance-monitoring.json';
  if (fs.existsSync(perfPath)) {
    fs.unlinkSync(perfPath);
  }

  const result = iterativeModule.monitorProductionPerformance();
  assert(typeof result === 'object', 'Should still return object');
  assert(typeof result.success === 'boolean', 'Should have success flag');
});

runTest('Handles missing A/B test data gracefully', () => {
  // Remove A/B test data file
  const testPath = './reports/ab-tests/active-tests.json';
  if (fs.existsSync(testPath)) {
    fs.unlinkSync(testPath);
  }

  const result = iterativeModule.analyzeABTestResults();
  assert(result.success === true, 'Should succeed with missing data');
  assert(result.winners.length === 0, 'Should have no winners');
});

runTest('Handles missing pattern library gracefully', () => {
  // Remove pattern library file
  const libraryPath = './reports/iterations/pattern-library.json';
  if (fs.existsSync(libraryPath)) {
    fs.unlinkSync(libraryPath);
  }

  const mockCycleResults = {
    cycleId: 'test_cycle',
    analysis: { winners: [] }
  };

  const result = iterativeModule.updateLearnings(mockCycleResults);
  assert(result.success === true, 'Should succeed with missing library');
});

runTest('Baseline initializes with defaults when file missing', () => {
  // Remove baseline file
  const baselinePath = './reports/optimization/performance-baseline.json';
  if (fs.existsSync(baselinePath)) {
    fs.unlinkSync(baselinePath);
  }

  const baseline = iterativeModule.getPerformanceBaseline();
  assert(baseline.initialScore > 0, 'Should have default initial score');
  assert(baseline.currentScore > 0, 'Should have default current score');
  assert(baseline.targetScore > baseline.initialScore,
    'Target should be higher than initial');
});

runTest('updateLearnings accumulates insights over time', () => {
  setupTestEnvironment();

  // Add multiple cycle results
  const cycle1 = {
    cycleId: 'cycle_1',
    analysis: {
      winners: [{
        patternName: 'Call to Action',
        results: { winner: 'Enhanced', liftOverControl: 8.5, confidence: 0.96 }
      }]
    }
  };

  const cycle2 = {
    cycleId: 'cycle_2',
    analysis: {
      winners: [{
        patternName: 'Visual Hierarchy',
        results: { winner: 'Contrast', liftOverControl: 6.2, confidence: 0.94 }
      }]
    }
  };

  iterativeModule.updateLearnings(cycle1);
  const result = iterativeModule.updateLearnings(cycle2);

  assert(result.learnings.insights.length >= 2,
    'Should accumulate insights from multiple cycles');
});

// ============================================================================
// Cleanup and Results
// ============================================================================

cleanupTestEnvironment();

// ============================================================================
// Results Summary
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed} ✅`);
console.log(`Failed: ${testResults.failed} ❌`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed > 0) {
  console.log('\nFailed Tests:');
  testResults.tests.filter(t => t.status === 'FAIL').forEach(t => {
    console.log(`  ❌ ${t.name}`);
    console.log(`     ${t.error}`);
  });
}

// Save results
const resultsFile = path.join(TEST_CONFIG.testReportsDir, 'iterative-optimization-test-results.json');
fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));

const summaryFile = path.join(TEST_CONFIG.testReportsDir, 'iterative-optimization-test-summary.txt');
const summary = `Iterative Optimization System Test Results
Generated: ${new Date().toISOString()}

Total Tests: ${testResults.total}
Passed: ${testResults.passed}
Failed: ${testResults.failed}
Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%

${testResults.tests.map(t => `${t.status === 'PASS' ? '✅' : '❌'} ${t.name}`).join('\n')}
`;

fs.writeFileSync(summaryFile, summary);

console.log(`\n📁 Results saved to: ${TEST_CONFIG.testReportsDir}/`);

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0);
