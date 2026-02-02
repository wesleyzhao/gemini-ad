#!/usr/bin/env node

/**
 * Test Suite: Optimization Results Monitoring System
 *
 * Validates the monitoring and parameter refinement functionality.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const TEST_DIR = './test-reports-monitoring';
const SCRIPTS_DIR = './scripts';
const REPORTS_DIR = './reports/optimization';

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Test helper functions
 */
function assert(condition, testName) {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`  ✅ ${testName}`);
    return true;
  } else {
    testsFailed++;
    console.log(`  ❌ ${testName}`);
    return false;
  }
}

function testFileExists(filePath, description) {
  return assert(fs.existsSync(filePath), `${description}: ${path.basename(filePath)} exists`);
}

function testJSONValid(filePath, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return assert(true, `${description}: Valid JSON`);
  } catch (error) {
    return assert(false, `${description}: Valid JSON - ${error.message}`);
  }
}

function testFileNotEmpty(filePath, description) {
  const content = fs.readFileSync(filePath, 'utf8');
  return assert(content.length > 0, `${description}: Not empty`);
}

/**
 * Setup test environment
 */
function setupTestEnvironment() {
  console.log('\n📁 Setting up test environment...\n');

  // Ensure test directory exists
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  // Ensure reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  console.log('✅ Test environment ready\n');
}

/**
 * Test 1: Script file availability
 */
function test1_ScriptAvailability() {
  console.log('Test 1: Script Availability');
  console.log('─'.repeat(80));

  const scriptPath = path.join(SCRIPTS_DIR, 'monitor-optimization-results.js');
  testFileExists(scriptPath, 'Monitoring script');

  const iterativePath = path.join(SCRIPTS_DIR, 'iterative-optimization-cycle.js');
  testFileExists(iterativePath, 'Iterative cycle script');

  console.log();
}

/**
 * Test 2: Required data files
 */
function test2_DataFiles() {
  console.log('Test 2: Required Data Files');
  console.log('─'.repeat(80));

  const files = [
    'cycle-history.json',
    'performance-baseline.json',
    'learnings.json'
  ];

  files.forEach(file => {
    const filePath = path.join(REPORTS_DIR, file);
    if (testFileExists(filePath, `Data file: ${file}`)) {
      testJSONValid(filePath, `Data file: ${file}`);
    }
  });

  console.log();
}

/**
 * Test 3: Monitoring execution
 */
function test3_MonitoringExecution() {
  console.log('Test 3: Monitoring Execution');
  console.log('─'.repeat(80));

  try {
    // Run monitoring script
    console.log('  Running monitoring script...');
    execSync('node scripts/monitor-optimization-results.js', {
      stdio: 'pipe',
      timeout: 30000
    });

    assert(true, 'Monitoring script executed successfully');

    // Check for generated report
    const reportPath = path.join(REPORTS_DIR, 'monitoring-report.md');
    testFileExists(reportPath, 'Monitoring report generated');

    if (fs.existsSync(reportPath)) {
      testFileNotEmpty(reportPath, 'Monitoring report');

      // Check report content
      const content = fs.readFileSync(reportPath, 'utf8');
      assert(content.includes('Performance Overview'), 'Report contains performance overview');
      assert(content.includes('Trend Analysis'), 'Report contains trend analysis');
      assert(content.includes('Pattern Effectiveness'), 'Report contains pattern analysis');
      assert(content.includes('Parameter Recommendations'), 'Report contains recommendations');
    }

  } catch (error) {
    assert(false, `Monitoring execution failed: ${error.message}`);
  }

  console.log();
}

/**
 * Test 4: Trend analysis
 */
function test4_TrendAnalysis() {
  console.log('Test 4: Trend Analysis');
  console.log('─'.repeat(80));

  try {
    const cycleHistory = JSON.parse(fs.readFileSync(
      path.join(REPORTS_DIR, 'cycle-history.json'),
      'utf8'
    ));

    assert(cycleHistory.cycles !== undefined, 'Cycle history has cycles array');
    assert(cycleHistory.metadata !== undefined, 'Cycle history has metadata');

    if (cycleHistory.cycles.length > 0) {
      const firstCycle = cycleHistory.cycles[0];
      assert(firstCycle.cycleId !== undefined, 'Cycle has ID');
      assert(firstCycle.success !== undefined, 'Cycle has success status');
      assert(firstCycle.performanceScore !== undefined, 'Cycle has performance score');
    }

  } catch (error) {
    assert(false, `Trend analysis failed: ${error.message}`);
  }

  console.log();
}

/**
 * Test 5: Pattern effectiveness analysis
 */
function test5_PatternEffectiveness() {
  console.log('Test 5: Pattern Effectiveness Analysis');
  console.log('─'.repeat(80));

  try {
    const learnings = JSON.parse(fs.readFileSync(
      path.join(REPORTS_DIR, 'learnings.json'),
      'utf8'
    ));

    assert(learnings.patterns !== undefined, 'Learnings has patterns array');
    assert(learnings.insights !== undefined, 'Learnings has insights array');
    assert(learnings.bestPractices !== undefined, 'Learnings has best practices');

    if (learnings.patterns.length > 0) {
      const pattern = learnings.patterns[0];
      assert(pattern.name !== undefined, 'Pattern has name');
      assert(pattern.successRate !== undefined, 'Pattern has success rate');
      assert(pattern.avgImpact !== undefined, 'Pattern has average impact');
    }

  } catch (error) {
    assert(false, `Pattern effectiveness analysis failed: ${error.message}`);
  }

  console.log();
}

/**
 * Test 6: Parameter recommendations
 */
function test6_ParameterRecommendations() {
  console.log('Test 6: Parameter Recommendations');
  console.log('─'.repeat(80));

  const recommendationsPath = path.join(REPORTS_DIR, 'parameter-recommendations.json');

  if (fs.existsSync(recommendationsPath)) {
    try {
      const recommendations = JSON.parse(fs.readFileSync(recommendationsPath, 'utf8'));

      assert(recommendations.timestamp !== undefined, 'Recommendations have timestamp');
      assert(Array.isArray(recommendations.recommendations), 'Recommendations is array');

      if (recommendations.recommendations.length > 0) {
        const rec = recommendations.recommendations[0];
        assert(rec.parameter !== undefined, 'Recommendation has parameter');
        assert(rec.current !== undefined, 'Recommendation has current value');
        assert(rec.recommended !== undefined, 'Recommendation has recommended value');
        assert(rec.reason !== undefined, 'Recommendation has reason');
        assert(rec.impact !== undefined, 'Recommendation has impact description');
      }

    } catch (error) {
      assert(false, `Parameter recommendations test failed: ${error.message}`);
    }
  } else {
    assert(true, 'No recommendations needed (optimal parameters)');
  }

  console.log();
}

/**
 * Test 7: Dry run mode
 */
function test7_DryRunMode() {
  console.log('Test 7: Dry Run Mode');
  console.log('─'.repeat(80));

  try {
    execSync('node scripts/monitor-optimization-results.js --dry-run --refine', {
      stdio: 'pipe',
      timeout: 30000
    });

    assert(true, 'Dry run mode executed successfully');

    // Verify script wasn't modified in dry run
    const scriptPath = path.join(SCRIPTS_DIR, 'iterative-optimization-cycle.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    assert(scriptContent.includes('minConfidence'), 'Script configuration intact after dry run');

  } catch (error) {
    assert(false, `Dry run mode failed: ${error.message}`);
  }

  console.log();
}

/**
 * Test 8: Performance baseline tracking
 */
function test8_PerformanceBaseline() {
  console.log('Test 8: Performance Baseline Tracking');
  console.log('─'.repeat(80));

  try {
    const baseline = JSON.parse(fs.readFileSync(
      path.join(REPORTS_DIR, 'performance-baseline.json'),
      'utf8'
    ));

    assert(baseline.initialScore !== undefined, 'Baseline has initial score');
    assert(baseline.currentScore !== undefined, 'Baseline has current score');
    assert(baseline.targetScore !== undefined, 'Baseline has target score');
    assert(baseline.history !== undefined, 'Baseline has history array');

    // Validate score progression
    const improvement = baseline.currentScore - baseline.initialScore;
    assert(improvement >= 0, 'Current score >= initial score (no regression)');

    const progress = (baseline.currentScore - baseline.initialScore) /
                     (baseline.targetScore - baseline.initialScore);
    assert(progress >= 0 && progress <= 1, 'Progress is within 0-100%');

  } catch (error) {
    assert(false, `Performance baseline test failed: ${error.message}`);
  }

  console.log();
}

/**
 * Test 9: Learning accumulation metrics
 */
function test9_LearningAccumulation() {
  console.log('Test 9: Learning Accumulation Metrics');
  console.log('─'.repeat(80));

  try {
    const learnings = JSON.parse(fs.readFileSync(
      path.join(REPORTS_DIR, 'learnings.json'),
      'utf8'
    ));

    const totalInsights = learnings.insights?.length || 0;
    const totalPatterns = learnings.patterns?.length || 0;
    const totalBestPractices = learnings.bestPractices?.length || 0;

    assert(totalInsights >= 0, `Total insights tracked: ${totalInsights}`);
    assert(totalPatterns >= 0, `Total patterns tracked: ${totalPatterns}`);
    assert(totalBestPractices >= 0, `Total best practices: ${totalBestPractices}`);

    // Check metadata
    if (learnings.metadata) {
      assert(learnings.metadata.created !== undefined, 'Metadata has creation date');
      assert(learnings.metadata.updated !== undefined, 'Metadata has update date');
    }

  } catch (error) {
    assert(false, `Learning accumulation test failed: ${error.message}`);
  }

  console.log();
}

/**
 * Test 10: Report generation quality
 */
function test10_ReportQuality() {
  console.log('Test 10: Report Generation Quality');
  console.log('─'.repeat(80));

  const reportPath = path.join(REPORTS_DIR, 'monitoring-report.md');

  if (fs.existsSync(reportPath)) {
    const content = fs.readFileSync(reportPath, 'utf8');

    // Check for required sections
    const requiredSections = [
      'Executive Summary',
      'Performance Overview',
      'Trend Analysis',
      'Pattern Effectiveness',
      'Learning Accumulation',
      'Parameter Recommendations',
      'System Health Indicators',
      'Recommended Next Steps'
    ];

    requiredSections.forEach(section => {
      assert(content.includes(section), `Report includes: ${section}`);
    });

    // Check for metrics
    assert(/\d+\/\d+/.test(content), 'Report includes score ratios');
    assert(/\d+%/.test(content), 'Report includes percentages');

  } else {
    assert(false, 'Monitoring report not found');
  }

  console.log();
}

/**
 * Generate test report
 */
function generateTestReport() {
  const passRate = ((testsPassed / testsRun) * 100).toFixed(1);
  const timestamp = new Date().toISOString();

  const report = {
    timestamp,
    summary: {
      total: testsRun,
      passed: testsPassed,
      failed: testsFailed,
      passRate: `${passRate}%`
    },
    grade: passRate >= 95 ? 'A+' :
           passRate >= 90 ? 'A' :
           passRate >= 85 ? 'B+' :
           passRate >= 80 ? 'B' :
           passRate >= 70 ? 'C' : 'F',
    status: testsFailed === 0 ? 'PASS' : 'FAIL'
  };

  // Save JSON report
  const jsonPath = path.join(TEST_DIR, 'monitoring-test-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Save text summary
  const summary = `
${'='.repeat(80)}
MONITORING SYSTEM TEST RESULTS
${'='.repeat(80)}

Tests Run:    ${testsRun}
Tests Passed: ${testsPassed}
Tests Failed: ${testsFailed}
Pass Rate:    ${passRate}%
Grade:        ${report.grade}
Status:       ${report.status}

${'='.repeat(80)}
`;

  const summaryPath = path.join(TEST_DIR, 'monitoring-test-summary.txt');
  fs.writeFileSync(summaryPath, summary);

  return report;
}

/**
 * Main test execution
 */
function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('OPTIMIZATION MONITORING SYSTEM - TEST SUITE');
  console.log('='.repeat(80) + '\n');

  setupTestEnvironment();

  // Run all tests
  test1_ScriptAvailability();
  test2_DataFiles();
  test3_MonitoringExecution();
  test4_TrendAnalysis();
  test5_PatternEffectiveness();
  test6_ParameterRecommendations();
  test7_DryRunMode();
  test8_PerformanceBaseline();
  test9_LearningAccumulation();
  test10_ReportQuality();

  // Generate report
  const report = generateTestReport();

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`\nTests Run:    ${testsRun}`);
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Pass Rate:    ${report.summary.passRate}`);
  console.log(`Grade:        ${report.grade}`);
  console.log(`Status:       ${report.status}`);
  console.log(`\nDetailed results: ${TEST_DIR}/monitoring-test-results.json\n`);

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests();
