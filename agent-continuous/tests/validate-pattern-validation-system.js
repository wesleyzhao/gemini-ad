#!/usr/bin/env node

/**
 * Test Suite: Pattern Validation & Production Scaling System
 *
 * Tests the complete pattern validation, refinement, and production scaling pipeline.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Import modules to test
const {
  validatePatternApplications,
  analyzePatternEffectiveness,
  calculateActualImpact,
  determineEffectiveness,
  calculateAccuracy
} = require('../scripts/validate-pattern-effectiveness.js');

const {
  refinePatterns,
  determineRefinementAction,
  recalibrateImpact,
  promotePattern,
  retirePattern
} = require('../scripts/refine-successful-patterns.js');

const {
  filterProductionPatterns,
  getPagesForPattern,
  createBackup
} = require('../scripts/scale-to-production.js');

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test helper
 */
function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

/**
 * Test Suite
 */
console.log('🧪 Pattern Validation & Production Scaling System Tests\n');
console.log('='.repeat(80) + '\n');

// ============================================================================
// Component Tests
// ============================================================================
console.log('📦 Component Tests\n');

test('All validation scripts exist', () => {
  assert(fs.existsSync('./scripts/validate-pattern-effectiveness.js'));
  assert(fs.existsSync('./scripts/refine-successful-patterns.js'));
  assert(fs.existsSync('./scripts/scale-to-production.js'));
});

test('All validation scripts are executable', () => {
  const stats1 = fs.statSync('./scripts/validate-pattern-effectiveness.js');
  const stats2 = fs.statSync('./scripts/refine-successful-patterns.js');
  const stats3 = fs.statSync('./scripts/scale-to-production.js');
  assert(stats1.mode & fs.constants.S_IXUSR || stats1.mode & fs.constants.S_IRUSR);
  assert(stats2.mode & fs.constants.S_IXUSR || stats2.mode & fs.constants.S_IRUSR);
  assert(stats3.mode & fs.constants.S_IXUSR || stats3.mode & fs.constants.S_IRUSR);
});

test('All validation scripts have required functions', () => {
  assert(typeof validatePatternApplications === 'function');
  assert(typeof refinePatterns === 'function');
  assert(typeof filterProductionPatterns === 'function');
});

// ============================================================================
// Calculation Tests
// ============================================================================
console.log('\n📊 Calculation Tests\n');

test('Calculate actual impact correctly', () => {
  assert.strictEqual(calculateActualImpact(80, 90), 10);
  assert.strictEqual(calculateActualImpact(90, 85), -5);
  assert.strictEqual(calculateActualImpact(null, 90), null);
});

test('Determine effectiveness correctly', () => {
  assert.strictEqual(determineEffectiveness(15), 'high');
  assert.strictEqual(determineEffectiveness(7), 'medium');
  assert.strictEqual(determineEffectiveness(2), 'low');
  assert.strictEqual(determineEffectiveness(-3), 'negative');
  assert.strictEqual(determineEffectiveness(null), 'unknown');
});

test('Calculate accuracy correctly', () => {
  assert.strictEqual(calculateAccuracy(10, 10), 1.0);
  assert.strictEqual(calculateAccuracy(8, 10), 0.8);
  assert.strictEqual(calculateAccuracy(12, 10), 1.2);
  assert.strictEqual(calculateAccuracy(null, 10), null);
  assert.strictEqual(calculateAccuracy(10, 0), null);
});

// ============================================================================
// Validation Tests
// ============================================================================
console.log('\n🔍 Validation Tests\n');

test('Validate pattern applications with mock data', () => {
  const baseline = {
    pages: [
      { page: 'writers.html', score: 80 },
      { page: 'creators.html', score: 75 }
    ]
  };

  const current = {
    pages: [
      { page: 'writers.html', score: 92 },
      { page: 'creators.html', score: 81 }
    ]
  };

  const applications = {
    applications: [
      { page: 'writers.html', pattern: 'Test Pattern', expectedImpact: 10 },
      { page: 'creators.html', pattern: 'Test Pattern', expectedImpact: 5 }
    ]
  };

  const result = validatePatternApplications(baseline, current, applications);

  assert(result.validations.length === 2);
  assert(result.summary.total === 2);
  assert(result.validations[0].actualImpact === 12);
  assert(result.validations[1].actualImpact === 6);
});

test('Analyze pattern effectiveness correctly', () => {
  const validations = [
    {
      patterns: ['Pattern A'],
      patternCount: 1,
      actualImpact: 10,
      expectedImpact: 10,
      success: true
    },
    {
      patterns: ['Pattern A'],
      patternCount: 1,
      actualImpact: 8,
      expectedImpact: 10,
      success: true
    }
  ];

  const stats = analyzePatternEffectiveness(validations);

  assert(stats['Pattern A']);
  assert(stats['Pattern A'].applications === 2);
  assert(stats['Pattern A'].successful === 2);
  assert(stats['Pattern A'].avgActualImpact === 9);
});

test('Handle empty validation data gracefully', () => {
  const baseline = { pages: [] };
  const current = { pages: [] };
  const applications = { applications: [] };

  const result = validatePatternApplications(baseline, current, applications);

  assert(result.validations.length === 0);
  assert(result.summary.total === 0);
});

// ============================================================================
// Refinement Tests
// ============================================================================
console.log('\n🔧 Refinement Tests\n');

test('Determine refinement action for high performer', () => {
  const stats = {
    applications: 5,
    successRate: 0.9,
    avgActualImpact: 12,
    avgAccuracy: 0.95,
    effectiveness: 'high'
  };

  const action = determineRefinementAction(stats);

  assert(action.action === 'promote');
  assert(action.priority === 'high');
});

test('Determine refinement action for low performer', () => {
  const stats = {
    applications: 5,
    successRate: 0.2,
    avgActualImpact: -2,
    avgAccuracy: 0.5,
    effectiveness: 'negative'
  };

  const action = determineRefinementAction(stats);

  assert(action.action === 'retire');
  assert(action.priority === 'high');
});

test('Determine refinement action for accuracy issues', () => {
  const stats = {
    applications: 5,
    successRate: 0.7,
    avgActualImpact: 5,
    avgAccuracy: 0.5,
    effectiveness: 'medium'
  };

  const action = determineRefinementAction(stats);

  assert(action.action === 'recalibrate');
  assert(action.priority === 'medium');
});

test('Recalibrate impact correctly', () => {
  const pattern = {
    name: 'Test Pattern',
    expectedImpact: 10
  };

  const calibrated = recalibrateImpact(pattern, 0.8);

  assert(calibrated.expectedImpact === 8);
  assert(calibrated.calibration.factor === 0.8);
  assert(calibrated.calibration.original === 10);
});

test('Promote pattern correctly', () => {
  const pattern = {
    name: 'Test Pattern',
    status: 'emerging'
  };

  const stats = {
    applications: 5,
    successRate: 0.9,
    avgActualImpact: 12,
    avgAccuracy: 0.95,
    effectiveness: 'high'
  };

  const promoted = promotePattern(pattern, stats);

  assert(promoted.status === 'production');
  assert(promoted.confidence === 'high');
  assert(promoted.validatedBy.successRate === 0.9);
});

test('Retire pattern correctly', () => {
  const pattern = {
    name: 'Test Pattern',
    status: 'emerging'
  };

  const retired = retirePattern(pattern, 'Low effectiveness');

  assert(retired.status === 'retired');
  assert(retired.retired.reason === 'Low effectiveness');
});

test('Refine patterns with mock data', () => {
  const validation = {
    validations: [
      {
        patterns: ['Pattern A'],
        patternCount: 1,
        actualImpact: 10,
        expectedImpact: 10,
        success: true
      }
    ],
    patternStats: {
      'Pattern A': {
        applications: 5,
        successful: 5,
        totalActualImpact: 50,
        totalExpectedImpact: 50,
        avgActualImpact: 10,
        avgExpectedImpact: 10,
        successRate: 1.0,
        avgAccuracy: 1.0,
        effectiveness: 'high'
      }
    }
  };

  const patternLibrary = {
    patterns: [
      { name: 'Pattern A', status: 'emerging', expectedImpact: 10 }
    ]
  };

  const result = refinePatterns(validation, patternLibrary);

  assert(result.patterns.length === 1);
  assert(result.refinements.length === 1);
  assert(result.summary.total === 1);
  assert(result.refinements[0].action === 'promote');
});

// ============================================================================
// Production Scaling Tests
// ============================================================================
console.log('\n📈 Production Scaling Tests\n');

test('Filter production-ready patterns correctly', () => {
  const patterns = {
    patterns: [
      {
        name: 'Pattern A',
        status: 'production'
      },
      {
        name: 'Pattern B',
        status: 'emerging'
      },
      {
        name: 'Pattern C',
        status: 'production'
      }
    ]
  };

  const validation = {
    patternStats: {
      'Pattern A': {
        applications: 5,
        successRate: 0.9,
        avgActualImpact: 10,
        effectiveness: 'high'
      },
      'Pattern B': {
        applications: 5,
        successRate: 0.9,
        avgActualImpact: 10,
        effectiveness: 'high'
      },
      'Pattern C': {
        applications: 2,
        successRate: 0.5,
        avgActualImpact: 3,
        effectiveness: 'low'
      }
    }
  };

  const productionReady = filterProductionPatterns(patterns, validation);

  // Only Pattern A should pass (production status + 5 apps + 90% success)
  assert(productionReady.length === 1);
  assert(productionReady[0].name === 'Pattern A');
});

test('Get pages for pattern correctly', () => {
  const pattern = { name: 'Test Pattern' };

  const validation = {
    validations: [
      { patterns: ['Test Pattern'], page: 'writers.html' },
      { patterns: ['Test Pattern'], page: 'creators.html' }
    ]
  };

  // Mock CONFIG.productionPages
  const originalPages = require('../scripts/scale-to-production.js').CONFIG;

  const pages = getPagesForPattern(pattern, validation, null);

  // Should exclude already-applied pages
  assert(!pages.includes('writers.html'));
  assert(!pages.includes('creators.html'));
});

test('Create backup successfully', () => {
  // Create a test file
  const testFile = './test-backup-file.txt';
  const backupDir = './test-backups';

  fs.writeFileSync(testFile, 'test content');

  const backupPath = createBackup(testFile, backupDir);

  assert(backupPath !== null);
  assert(fs.existsSync(backupPath));

  // Cleanup
  fs.unlinkSync(testFile);
  fs.rmSync(backupDir, { recursive: true, force: true });
});

// ============================================================================
// Integration Tests
// ============================================================================
console.log('\n🔗 Integration Tests\n');

test('Complete validation-refinement-scaling pipeline', () => {
  // Mock baseline and current UX data
  const baseline = {
    pages: [
      { page: 'writers.html', score: 80 },
      { page: 'creators.html', score: 75 },
      { page: 'operators.html', score: 78 },
      { page: 'automators.html', score: 82 }
    ]
  };

  const current = {
    pages: [
      { page: 'writers.html', score: 92 },
      { page: 'creators.html', score: 86 },
      { page: 'operators.html', score: 90 },
      { page: 'automators.html', score: 94 }
    ]
  };

  const applications = {
    applications: [
      { page: 'writers.html', pattern: 'High Impact Pattern', expectedImpact: 10 },
      { page: 'creators.html', pattern: 'High Impact Pattern', expectedImpact: 10 },
      { page: 'operators.html', pattern: 'High Impact Pattern', expectedImpact: 10 },
      { page: 'automators.html', pattern: 'High Impact Pattern', expectedImpact: 10 }
    ]
  };

  // Step 1: Validate
  const validation = validatePatternApplications(baseline, current, applications);
  assert(validation.validations.length === 4);

  // Step 2: Analyze
  const patternStats = analyzePatternEffectiveness(validation.validations);
  assert(patternStats['High Impact Pattern']);

  // Step 3: Refine
  const validationData = {
    validations: validation.validations,
    patternStats
  };

  const patternLibrary = {
    patterns: [
      { name: 'High Impact Pattern', status: 'emerging', expectedImpact: 10 }
    ]
  };

  const refined = refinePatterns(validationData, patternLibrary);
  assert(refined.patterns.length === 1);
  assert(refined.refinements[0].action === 'promote');

  // Step 4: Filter for production
  const patternsData = { patterns: refined.patterns };
  const productionReady = filterProductionPatterns(patternsData, validationData);

  // Pattern should be promoted and ready
  assert(productionReady.length === 1);
});

// ============================================================================
// Edge Case Tests
// ============================================================================
console.log('\n⚠️  Edge Case Tests\n');

test('Handle null/undefined inputs gracefully', () => {
  const result1 = calculateActualImpact(null, null);
  const result2 = calculateAccuracy(null, null);
  const result3 = determineEffectiveness(null);

  assert(result1 === null);
  assert(result2 === null);
  assert(result3 === 'unknown');
});

test('Handle empty pattern library', () => {
  const validation = {
    validations: [],
    patternStats: {}
  };

  const patternLibrary = null;

  const result = refinePatterns(validation, patternLibrary);

  assert(result.patterns.length === 0);
  assert(result.refinements.length === 0);
});

test('Handle missing validation stats', () => {
  const patterns = {
    patterns: [
      { name: 'Pattern A', status: 'production' }
    ]
  };

  const validation = {
    patternStats: {}
  };

  const productionReady = filterProductionPatterns(patterns, validation);

  assert(productionReady.length === 0);
});

test('Handle division by zero in accuracy calculation', () => {
  const accuracy = calculateAccuracy(10, 0);
  assert(accuracy === null);
});

test('Handle zero applications in pattern stats', () => {
  const stats = {
    applications: 0,
    successRate: 0,
    avgActualImpact: 0,
    avgAccuracy: 0,
    effectiveness: 'unknown'
  };

  const action = determineRefinementAction(stats);
  assert(action.action === 'monitor');
  assert(action.priority === 'low');
});

// ============================================================================
// Results
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('\n📊 TEST RESULTS\n');
console.log(`Total Tests: ${results.passed + results.failed}`);
console.log(`Passed: ${results.passed} ✅`);
console.log(`Failed: ${results.failed} ❌`);
console.log(`Pass Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

if (results.failed === 0) {
  console.log('\n🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. See details above.\n');
  process.exit(1);
}
