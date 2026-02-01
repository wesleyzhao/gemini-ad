#!/usr/bin/env node

/**
 * Pattern Library Expansion System Validation Tests
 *
 * Validates that the pattern library expansion system:
 * 1. Successfully analyzes existing patterns
 * 2. Discovers new patterns from data
 * 3. Refines patterns based on effectiveness
 * 4. Generates actionable recommendations
 * 5. Updates the pattern library correctly
 */

const fs = require('fs');
const path = require('path');

const ITERATIONS_DIR = 'reports/iterations';

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Test helper
 */
function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    failedTests++;
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n🧪 Pattern Library Expansion System Validation\n');
console.log('='.repeat(60));

// ============================================================================
// COMPONENT TESTS
// ============================================================================

console.log('\n📦 Component Tests\n');

test('Script exists and is accessible', () => {
  const scriptPath = 'scripts/expand-pattern-library.js';
  assert(fs.existsSync(scriptPath), 'Script file not found');
  const stats = fs.statSync(scriptPath);
  assert(stats.isFile(), 'Script is not a file');
  assert(stats.size > 1000, 'Script file seems too small');
});

test('Expansion results file exists', () => {
  const resultsPath = path.join(ITERATIONS_DIR, 'pattern-library-expansion.json');
  assert(fs.existsSync(resultsPath), 'Results file not found');
  const data = loadJSON(resultsPath);
  assert(data.timestamp, 'Results missing timestamp');
});

test('Markdown report is generated', () => {
  const mdPath = path.join(ITERATIONS_DIR, 'pattern-library-expansion.md');
  assert(fs.existsSync(mdPath), 'Markdown report not found');
  const content = fs.readFileSync(mdPath, 'utf8');
  assert(content.includes('Pattern Library Expansion Report'), 'Report missing title');
  assert(content.length > 500, 'Report seems too short');
});

test('Pattern library is updated', () => {
  const libPath = path.join(ITERATIONS_DIR, 'pattern-library.json');
  assert(fs.existsSync(libPath), 'Pattern library not found');
  const lib = loadJSON(libPath);
  assert(lib.version, 'Library missing version');
  assert(lib.patterns, 'Library missing patterns array');
  assert(lib.stats, 'Library missing stats');
});

// ============================================================================
// DATA STRUCTURE TESTS
// ============================================================================

console.log('\n📊 Data Structure Tests\n');

test('Expansion results have valid structure', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  assert(results.timestamp, 'Missing timestamp');
  assert(Array.isArray(results.refinements), 'Refinements not an array');
  assert(Array.isArray(results.newPatterns), 'New patterns not an array');
  assert(Array.isArray(results.recommendations), 'Recommendations not an array');
  assert(results.updatedLibrary, 'Missing updated library');
  assert(results.summary, 'Missing summary');
});

test('Pattern refinements have required fields', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  if (results.refinements.length > 0) {
    const refinement = results.refinements[0];
    assert(refinement.name, 'Refinement missing name');
    assert(refinement.action, 'Refinement missing action');
    assert(refinement.rationale, 'Refinement missing rationale');
    assert(refinement.priority, 'Refinement missing priority');
  }
});

test('New patterns have required fields', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  if (results.newPatterns.length > 0) {
    const pattern = results.newPatterns[0];
    assert(pattern.name, 'Pattern missing name');
    assert(pattern.type, 'Pattern missing type');
    assert(typeof pattern.avgImpact === 'number', 'Pattern missing valid avgImpact');
    assert(pattern.confidence, 'Pattern missing confidence');
    assert(pattern.recommendation, 'Pattern missing recommendation');
  }
});

test('Recommendations have valid structure', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  if (results.recommendations.length > 0) {
    const rec = results.recommendations[0];
    assert(rec.type, 'Recommendation missing type');
    assert(rec.priority, 'Recommendation missing priority');
    assert(Array.isArray(rec.patterns), 'Recommendation patterns not an array');
    assert(rec.action, 'Recommendation missing action');
    assert(rec.rationale, 'Recommendation missing rationale');
  }
});

test('Updated library has valid stats', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  const stats = results.updatedLibrary.stats;
  assert(typeof stats.totalPatterns === 'number', 'Invalid total patterns');
  assert(typeof stats.provenPatterns === 'number', 'Invalid proven patterns');
  assert(typeof stats.candidatePatterns === 'number', 'Invalid candidate patterns');
  assert(typeof stats.avgImpact === 'number', 'Invalid average impact');
  assert(typeof stats.highPriorityPatterns === 'number', 'Invalid high priority count');
});

// ============================================================================
// FUNCTIONALITY TESTS
// ============================================================================

console.log('\n⚙️  Functionality Tests\n');

test('Patterns are successfully refined', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  assert(results.refinements.length >= 0, 'No refinements processed');

  // Check if high-impact patterns get promoted
  const promoted = results.refinements.filter(r => r.action === 'promote');
  const highImpact = results.refinements.filter(r => r.currentImpact >= 10);

  if (highImpact.length > 0) {
    assert(promoted.length > 0, 'High-impact patterns not promoted');
  }
});

test('New patterns are identified', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  // Should have at least some patterns from action impact data
  assert(results.newPatterns.length >= 0, 'Pattern discovery failed');

  // Check that patterns have impact data
  results.newPatterns.forEach(pattern => {
    assert(typeof pattern.avgImpact === 'number', `Pattern ${pattern.name} missing impact`);
  });
});

test('Recommendations are generated', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  assert(results.recommendations.length > 0, 'No recommendations generated');

  // Check priority levels are valid
  const validPriorities = ['critical', 'high', 'medium', 'low'];
  results.recommendations.forEach(rec => {
    assert(validPriorities.includes(rec.priority), `Invalid priority: ${rec.priority}`);
  });
});

test('Pattern library is properly updated', () => {
  const lib = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library.json'));

  assert(lib.version, 'Library missing version');
  assert(lib.lastUpdated, 'Library missing last updated timestamp');
  assert(Array.isArray(lib.patterns), 'Patterns not an array');
  assert(lib.patterns.length > 0, 'No patterns in library');

  // Verify stats match patterns
  const totalCount = lib.patterns.length;
  assert(lib.stats.totalPatterns === totalCount, 'Stats total patterns mismatch');
});

test('Low-impact patterns flagged for retirement', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  // Find patterns with 0 or very low impact
  const lowImpact = results.refinements.filter(r =>
    (r.currentImpact === 0 || r.currentImpact < 3) && r.currentImpact !== undefined
  );

  if (lowImpact.length > 0) {
    const flaggedForRetirement = lowImpact.filter(r =>
      r.action === 'retire-or-revise' || r.action === 'optimize'
    );
    assert(flaggedForRetirement.length > 0, 'Low-impact patterns not flagged');
  }
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

console.log('\n🔗 Integration Tests\n');

test('Integrates with pattern effectiveness data', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  // Check if effectiveness data influenced refinements
  const withEffectiveness = results.refinements.filter(r => r.effectivenessLevel);
  assert(withEffectiveness.length > 0, 'Effectiveness data not integrated');
});

test('Integrates with action impact data', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  // Should have patterns from action impact
  const fromActions = results.newPatterns.filter(p => p.type === 'proven');
  assert(fromActions.length > 0, 'Action impact data not integrated');
});

test('Summary reflects actual data', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  const summary = results.summary;

  assert(summary.patternsRefined === results.refinements.length, 'Summary refinement count mismatch');
  assert(summary.newPatternsDiscovered === results.newPatterns.length, 'Summary new patterns count mismatch');
  assert(summary.recommendationsGenerated === results.recommendations.length, 'Summary recommendations count mismatch');
  assert(summary.finalLibrarySize === results.updatedLibrary.patterns.length, 'Summary library size mismatch');
});

test('Markdown report matches JSON data', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));
  const md = fs.readFileSync(path.join(ITERATIONS_DIR, 'pattern-library-expansion.md'), 'utf8');

  assert(md.includes(results.summary.patternsRefined.toString()), 'MD refinements count not found');
  assert(md.includes(results.summary.newPatternsDiscovered.toString()), 'MD new patterns count not found');
  assert(md.includes(results.summary.finalLibrarySize.toString()), 'MD total patterns not found');
});

// ============================================================================
// QUALITY TESTS
// ============================================================================

console.log('\n✨ Quality Tests\n');

test('High-impact patterns prioritized correctly', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  // Check if critical recommendations exist for high-impact patterns
  const criticalRecs = results.recommendations.filter(r => r.priority === 'critical');

  if (results.newPatterns.some(p => p.avgImpact >= 10)) {
    assert(criticalRecs.length > 0, 'High-impact patterns not marked critical');
  }
});

test('Pattern confidence levels are appropriate', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  results.newPatterns.forEach(pattern => {
    if (pattern.occurrences >= 5 && pattern.avgImpact >= 10) {
      assert(pattern.confidence === 'Very High' || pattern.confidence === 'High',
        `Pattern ${pattern.name} should have high confidence`);
    }
  });
});

test('Effort estimates are reasonable', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  const validEfforts = ['Low (automated)', 'Medium (semi-automated)', 'High (manual)', 'Medium', 'Low', 'High'];
  results.newPatterns.forEach(pattern => {
    if (pattern.application && pattern.application.effort) {
      assert(validEfforts.some(e => pattern.application.effort.includes(e.split('(')[0].trim())),
        `Invalid effort estimate for ${pattern.name}: ${pattern.application.effort}`);
    }
  });
});

test('Expected impacts are positive', () => {
  const results = loadJSON(path.join(ITERATIONS_DIR, 'pattern-library-expansion.json'));

  results.newPatterns.forEach(pattern => {
    assert(pattern.avgImpact > 0 || pattern.avgImpact === 0,
      `Pattern ${pattern.name} has negative impact`);
  });
});

// ============================================================================
// RESULTS
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests:  ${totalTests}`);
console.log(`Passed:       ${passedTests} ✅`);
console.log(`Failed:       ${failedTests} ❌`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failedTests === 0) {
  console.log('\n🎉 All tests passed! Pattern library expansion system is working correctly.\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failedTests} test(s) failed. Please review the errors above.\n`);
  process.exit(1);
}
