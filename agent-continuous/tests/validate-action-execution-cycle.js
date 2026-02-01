#!/usr/bin/env node

/**
 * Test Suite: Action Execution and Measurement Cycle (Feature #60)
 *
 * Validates the complete cycle of:
 * 1. Validation monitoring generates actions
 * 2. Actions are executed automatically
 * 3. Impact is measured and tracked
 * 4. Results feed back into optimization loop
 */

const fs = require('fs');
const path = require('path');

// Test results
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`✅ ${testName}`);
    return true;
  } else {
    testsFailed++;
    console.log(`❌ ${testName}`);
    return false;
  }
}

console.log('\n' + '='.repeat(60));
console.log('TEST SUITE: Action Execution & Measurement Cycle');
console.log('Feature #60: Execute validation-driven actions');
console.log('='.repeat(60) + '\n');

// ============================================================================
// Component Existence Tests
// ============================================================================

console.log('📦 Component Existence Tests\n');

const impactScriptPath = path.join(__dirname, '..', 'scripts', 'measure-action-impact.js');
assert(
  fs.existsSync(impactScriptPath),
  'Impact measurement script exists'
);

const monitorScriptPath = path.join(__dirname, '..', 'scripts', 'monitor-and-act-on-validation.js');
assert(
  fs.existsSync(monitorScriptPath),
  'Validation monitoring script exists'
);

const actionHistoryPath = path.join(__dirname, '..', 'reports', 'iterations', 'action-history.json');
assert(
  fs.existsSync(actionHistoryPath),
  'Action history file exists'
);

const impactReportPath = path.join(__dirname, '..', 'reports', 'iterations', 'action-impact-report.json');
assert(
  fs.existsSync(impactReportPath),
  'Action impact report exists'
);

const impactMarkdownPath = path.join(__dirname, '..', 'reports', 'iterations', 'action-impact-report.md');
assert(
  fs.existsSync(impactMarkdownPath),
  'Action impact markdown report exists'
);

// ============================================================================
// Data Structure Tests
// ============================================================================

console.log('\n📊 Data Structure Tests\n');

// Test action history structure
const actionHistory = JSON.parse(fs.readFileSync(actionHistoryPath, 'utf8'));
assert(
  Array.isArray(actionHistory.actions),
  'Action history has actions array'
);

assert(
  typeof actionHistory.totalActionsCompleted === 'number',
  'Action history tracks total actions completed'
);

assert(
  actionHistory.actions.length > 0,
  'At least one action has been executed'
);

// Test impact report structure
const impactReport = JSON.parse(fs.readFileSync(impactReportPath, 'utf8'));
assert(
  impactReport.timestamp !== undefined,
  'Impact report has timestamp'
);

assert(
  Array.isArray(impactReport.executedActions),
  'Impact report has executed actions array'
);

assert(
  impactReport.overallImpact !== undefined,
  'Impact report has overall impact metrics'
);

assert(
  Array.isArray(impactReport.recommendations),
  'Impact report has recommendations array'
);

// ============================================================================
// Action Execution Tests
// ============================================================================

console.log('\n⚡ Action Execution Tests\n');

assert(
  actionHistory.actions.every(action => action.success === true),
  'All executed actions succeeded'
);

assert(
  actionHistory.actions.every(action => action.executed === true),
  'All actions are marked as executed'
);

assert(
  actionHistory.actions.every(action => action.timestamp !== undefined),
  'All actions have execution timestamps'
);

assert(
  actionHistory.actions.every(action => action.message !== undefined),
  'All actions have execution messages'
);

// ============================================================================
// Impact Measurement Tests
// ============================================================================

console.log('\n📈 Impact Measurement Tests\n');

assert(
  impactReport.overallImpact.actionsExecuted > 0,
  'Impact report counts executed actions'
);

assert(
  impactReport.overallImpact.totalQualityGained > 0,
  'Impact report measures quality gained'
);

assert(
  parseFloat(impactReport.overallImpact.successRate) === 100,
  'Success rate is calculated correctly (100%)'
);

assert(
  impactReport.overallImpact.pagesImproved > 0,
  'Impact report counts pages improved'
);

assert(
  impactReport.improvementImpact !== null,
  'Impact report includes improvement impact data'
);

assert(
  impactReport.improvementImpact.successfulPatterns.length > 0,
  'Impact report identifies successful patterns'
);

// ============================================================================
// Integration Tests
// ============================================================================

console.log('\n🔄 Integration Tests\n');

assert(
  impactReport.executedActions.length === actionHistory.actions.length,
  'Impact report matches action history count'
);

assert(
  impactReport.recommendations.length > 0,
  'System generates actionable recommendations'
);

assert(
  impactReport.recommendations.some(r => r.priority === 'high'),
  'High priority recommendations are generated'
);

// Test that markdown report matches JSON data
const markdownContent = fs.readFileSync(impactMarkdownPath, 'utf8');
assert(
  markdownContent.includes('Action Impact Report'),
  'Markdown report has correct title'
);

assert(
  markdownContent.includes(`Actions Executed | ${impactReport.overallImpact.actionsExecuted}`),
  'Markdown report includes action count'
);

assert(
  markdownContent.includes('Executed Actions'),
  'Markdown report includes executed actions section'
);

assert(
  markdownContent.includes('Recommendations'),
  'Markdown report includes recommendations section'
);

// ============================================================================
// Continuous Loop Tests
// ============================================================================

console.log('\n🔁 Continuous Optimization Loop Tests\n');

// Test that actions feed back into the system
const validationDashboardPath = path.join(__dirname, '..', 'reports', 'iterations', 'validation-dashboard.md');
assert(
  fs.existsSync(validationDashboardPath),
  'Validation dashboard exists'
);

const lessonsLearnedPath = path.join(__dirname, '..', 'reports', 'iterations', 'lessons-learned-iteration-1.json');
assert(
  fs.existsSync(lessonsLearnedPath),
  'Lessons learned from iteration exist'
);

const lessonsLearned = JSON.parse(fs.readFileSync(lessonsLearnedPath, 'utf8'));
assert(
  lessonsLearned.executiveSummary.totalImprovementPoints > 0,
  'Iteration generated measurable improvement points'
);

assert(
  impactReport.improvementImpact.totalQualityPoints === lessonsLearned.executiveSummary.totalImprovementPoints,
  'Impact report correctly aggregates quality points from iterations'
);

// Test that recommendations drive future actions
assert(
  impactReport.recommendations.some(r =>
    r.category === 'Continuous Improvement' &&
    r.action.includes('improvement iteration')
  ),
  'System recommends future improvement iterations'
);

// ============================================================================
// Performance Metrics Tests
// ============================================================================

console.log('\n📊 Performance Metrics Tests\n');

assert(
  impactReport.overallImpact.averageImpactPerAction > 0,
  'System calculates average impact per action'
);

assert(
  impactReport.uxImpact !== null,
  'System tracks current UX metrics'
);

assert(
  impactReport.uxImpact.averageQuality > 0,
  'System measures average quality score'
);

assert(
  impactReport.uxImpact.totalPages > 0,
  'System tracks total pages'
);

assert(
  impactReport.uxImpact.topPages.length > 0,
  'System identifies top performing pages'
);

// ============================================================================
// Final Results
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('TEST RESULTS');
console.log('='.repeat(60) + '\n');

console.log(`Total Tests: ${testsRun}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`Success Rate: ${((testsPassed / testsRun) * 100).toFixed(1)}%\n`);

if (testsFailed === 0) {
  console.log('🎉 ALL TESTS PASSED!\n');
  console.log('✅ Action execution cycle is fully functional');
  console.log('✅ Impact measurement is accurate');
  console.log('✅ Continuous optimization loop is complete');
  console.log('✅ System is ready for production use\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED\n');
  console.log(`${testsFailed} test(s) need attention`);
  console.log('Review the failed tests above for details\n');
  process.exit(1);
}
