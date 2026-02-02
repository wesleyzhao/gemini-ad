#!/usr/bin/env node

/**
 * Validation Test Suite for Pattern Effectiveness Monitoring
 * Feature #62
 *
 * Tests the pattern effectiveness monitoring system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test counter
let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ ${name}`);
    passedTests++;
    return true;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('🧪 Testing Pattern Effectiveness Monitoring System\n');
console.log('='.repeat(60));
console.log('\n📋 Component Tests\n');

// ============================================================================
// Component Tests
// ============================================================================

test('Pattern effectiveness script exists', () => {
  const scriptPath = path.join(__dirname, '../scripts/monitor-pattern-effectiveness.js');
  assert(fs.existsSync(scriptPath), 'Script file not found');
});

test('Pattern effectiveness script is executable', () => {
  const scriptPath = path.join(__dirname, '../scripts/monitor-pattern-effectiveness.js');
  const stats = fs.statSync(scriptPath);
  assert(stats.mode & fs.constants.S_IXUSR, 'Script is not executable');
});

test('Pattern effectiveness report is generated', () => {
  const reportPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.md');
  assert(fs.existsSync(reportPath), 'Pattern effectiveness report not found');
});

test('Next iteration plan is generated', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  assert(fs.existsSync(planPath), 'Next iteration plan not found');
});

test('Pattern effectiveness JSON is generated', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  assert(fs.existsSync(jsonPath), 'Pattern effectiveness JSON not found');
});

console.log('\n📊 Data Structure Tests\n');

// ============================================================================
// Data Structure Tests
// ============================================================================

test('Pattern effectiveness JSON has valid structure', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  assert(data.timestamp, 'Missing timestamp');
  assert(data.feature === 62, 'Missing or incorrect feature number');
  assert(data.summary, 'Missing summary');
  assert(Array.isArray(data.patterns), 'Patterns is not an array');
  assert(data.nextIteration, 'Missing nextIteration');
  assert(data.systemHealth, 'Missing systemHealth');
});

test('Next iteration plan has valid structure', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

  assert(data.timestamp, 'Missing timestamp');
  assert(Array.isArray(data.patternsToApply), 'patternsToApply is not an array');
  assert(Array.isArray(data.targetPages), 'targetPages is not an array');
  assert(data.expectedImpact, 'Missing expectedImpact');
  assert(Array.isArray(data.recommendedActions), 'recommendedActions is not an array');
  assert(data.scheduledDate, 'Missing scheduledDate');
});

test('Pattern effectiveness report has proper format', () => {
  const reportPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.md');
  const content = fs.readFileSync(reportPath, 'utf8');

  assert(content.includes('# Pattern Library Effectiveness Report'), 'Missing report title');
  assert(content.includes('## 📊 Summary'), 'Missing summary section');
  assert(content.includes('## 🏆 Pattern Rankings'), 'Missing rankings section');
  assert(content.includes('## 🎯 Next Iteration Plan'), 'Missing iteration plan section');
  assert(content.includes('## 🚀 Recommended Actions'), 'Missing recommendations section');
});

console.log('\n⚙️  Functionality Tests\n');

// ============================================================================
// Functionality Tests
// ============================================================================

test('Pattern effectiveness analysis is performed', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  assert(data.summary.totalPatterns > 0, 'No patterns analyzed');
  assert(typeof data.summary.avgImpact === 'number', 'Average impact not calculated');
});

test('Patterns are ranked by effectiveness', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  if (data.patterns.length > 1) {
    // Check that patterns are sorted by overallScore (descending)
    for (let i = 0; i < data.patterns.length - 1; i++) {
      assert(
        data.patterns[i].overallScore >= data.patterns[i + 1].overallScore,
        'Patterns not properly sorted by effectiveness'
      );
    }
  }
});

test('Effectiveness levels are assigned correctly', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  data.patterns.forEach(pattern => {
    assert(pattern.effectivenessLevel, 'Missing effectiveness level');
    assert(
      ['excellent', 'good', 'moderate', 'low', 'ineffective'].includes(pattern.effectivenessLevel),
      `Invalid effectiveness level: ${pattern.effectivenessLevel}`
    );
  });
});

test('Pattern priorities are calculated', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  data.patterns.forEach(pattern => {
    assert(pattern.priority, 'Missing priority');
    assert(
      ['critical', 'high', 'medium', 'low'].includes(pattern.priority),
      `Invalid priority: ${pattern.priority}`
    );
  });
});

test('Recommendations are generated for patterns', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  data.patterns.forEach(pattern => {
    assert(pattern.recommendation, 'Missing pattern recommendation');
    assert(typeof pattern.recommendation === 'string', 'Recommendation is not a string');
    assert(pattern.recommendation.length > 0, 'Recommendation is empty');
  });
});

test('Next iteration plan includes target pages', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

  assert(Array.isArray(data.targetPages), 'targetPages is not an array');
  // Note: Array might be empty if all pages are high-performing
});

test('Next iteration plan includes patterns to apply', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

  assert(Array.isArray(data.patternsToApply), 'patternsToApply is not an array');
});

test('Expected impact is calculated', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

  assert(data.expectedImpact, 'Missing expectedImpact');
  assert(typeof data.expectedImpact.totalPages === 'number', 'totalPages not a number');
  assert(typeof data.expectedImpact.avgImpactPerPage === 'number', 'avgImpactPerPage not a number');
  assert(typeof data.expectedImpact.totalExpectedGain === 'number', 'totalExpectedGain not a number');
  assert(data.expectedImpact.confidenceLevel, 'Missing confidence level');
});

test('Recommended actions are generated', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

  assert(Array.isArray(data.recommendedActions), 'recommendedActions is not an array');
  // Should have at least one action
  assert(data.recommendedActions.length > 0, 'No recommended actions generated');
});

test('Scheduled date is set for next iteration', () => {
  const planPath = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

  assert(data.scheduledDate, 'Missing scheduledDate');
  const scheduledDate = new Date(data.scheduledDate);
  const now = new Date();
  assert(scheduledDate > now, 'Scheduled date is not in the future');
});

console.log('\n🔗 Integration Tests\n');

// ============================================================================
// Integration Tests
// ============================================================================

test('Integrates with pattern library', () => {
  const libraryPath = path.join(__dirname, '../reports/iterations/pattern-library.json');
  assert(fs.existsSync(libraryPath), 'Pattern library not found');

  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
  assert(library.patterns, 'Pattern library has no patterns array');
});

test('Integrates with UX analysis data', () => {
  const uxDir = path.join(__dirname, '../reports/ux-analysis');
  assert(fs.existsSync(uxDir), 'UX analysis directory not found');

  const files = fs.readdirSync(uxDir).filter(f => f.startsWith('ux-analysis-') && f.endsWith('.json'));
  assert(files.length > 0, 'No UX analysis files found');

  const uxPath = path.join(uxDir, files[files.length - 1]);
  const uxData = JSON.parse(fs.readFileSync(uxPath, 'utf8'));
  assert(uxData.engagementAnalysis || uxData.pages, 'UX data has no engagement or pages data');

  // Verify that the pattern effectiveness system can convert this data
  const effectivenessData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../reports/iterations/pattern-effectiveness.json'),
    'utf8'
  ));
  // The system should have processed the UX data successfully (no error in reports)
  assert(effectivenessData.summary, 'Pattern effectiveness system failed to process UX data');
});

test('System health assessment is accurate', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  assert(data.systemHealth.totalPatterns === data.summary.totalPatterns, 'Inconsistent pattern count');
  assert(data.systemHealth.effectivePatterns <= data.systemHealth.totalPatterns, 'More effective than total patterns');
  assert(['excellent', 'good', 'needs-improvement'].includes(data.systemHealth.libraryQuality), 'Invalid library quality');
});

test('Pattern effectiveness metrics are consistent', () => {
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const totalPatterns = data.summary.excellentPatterns + data.summary.goodPatterns +
                       data.summary.moderatePatterns + data.summary.lowPatterns;

  assert(totalPatterns === data.summary.totalPatterns, 'Pattern count mismatch in summary');
});

test('Complete workflow is functional', () => {
  // Check that all components work together
  const effectiveness = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const plan = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');
  const library = path.join(__dirname, '../reports/iterations/pattern-library.json');

  assert(fs.existsSync(effectiveness), 'Effectiveness report missing');
  assert(fs.existsSync(plan), 'Next iteration plan missing');
  assert(fs.existsSync(library), 'Pattern library missing');

  const effectivenessData = JSON.parse(fs.readFileSync(effectiveness, 'utf8'));
  const planData = JSON.parse(fs.readFileSync(plan, 'utf8'));

  assert(effectivenessData.nextIteration, 'Missing next iteration in effectiveness data');
  assert(planData.patternsToApply, 'Missing patterns to apply in plan');
});

test('Autonomous optimization cycle is maintained', () => {
  const validationActions = path.join(__dirname, '../reports/iterations/validation-actions.json');
  const actionHistory = path.join(__dirname, '../reports/iterations/action-history.json');

  assert(fs.existsSync(validationActions), 'Validation actions missing');
  assert(fs.existsSync(actionHistory), 'Action history missing');

  // Verify the cycle continues
  const jsonPath = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  assert(data.nextIteration, 'Next iteration not planned - cycle broken');
});

// ============================================================================
// Results
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Results\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%\n`);

if (passedTests === totalTests) {
  console.log('✅ All tests passed!\n');
  console.log('🎉 Pattern effectiveness monitoring system is fully operational!\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!\n');
  process.exit(1);
}
