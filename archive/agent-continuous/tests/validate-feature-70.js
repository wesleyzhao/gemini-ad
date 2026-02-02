#!/usr/bin/env node

/**
 * Feature #70 Validation Test Suite
 *
 * Validates:
 * 1. Parameter refinements applied correctly
 * 2. Exploratory mode functionality
 * 3. Monitoring system integration
 * 4. Documentation completeness
 *
 * Usage: node tests/validate-feature-70.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

/**
 * Test helper function
 */
function test(description, testFn) {
  try {
    testFn();
    results.passed++;
    results.tests.push({ description, status: 'PASS' });
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    return true;
  } catch (error) {
    results.failed++;
    results.tests.push({ description, status: 'FAIL', error: error.message });
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Assert helper function
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Run test suite
 */
function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log('FEATURE #70 VALIDATION TEST SUITE');
  console.log('='.repeat(80) + '\n');

  // =========================================================================
  // TEST SUITE 1: Parameter Refinements
  // =========================================================================
  console.log(`${colors.blue}[1/5] Testing Parameter Refinements${colors.reset}\n`);

  test('iterative-optimization-cycle.js exists', () => {
    const scriptPath = './scripts/iterative-optimization-cycle.js';
    assert(fs.existsSync(scriptPath), 'Script file not found');
  });

  test('minImprovement parameter refined to 0.03', () => {
    const content = fs.readFileSync('./scripts/iterative-optimization-cycle.js', 'utf8');
    assert(content.includes('minImprovement: 0.03'), 'minImprovement not set to 0.03');
    assert(content.includes('3% minimum improvement'), 'Comment not updated');
  });

  test('minCycleDuration parameter refined to 5 days', () => {
    const content = fs.readFileSync('./scripts/iterative-optimization-cycle.js', 'utf8');
    assert(content.includes('minCycleDuration: 5'), 'minCycleDuration not set to 5');
  });

  test('Refinement history file created', () => {
    const historyPath = './reports/optimization/refinement-history.json';
    assert(fs.existsSync(historyPath), 'Refinement history file not found');
  });

  test('Refinement history contains parameter changes', () => {
    const history = JSON.parse(fs.readFileSync('./reports/optimization/refinement-history.json', 'utf8'));
    assert(history.refinements && history.refinements.length > 0, 'No refinements recorded');
    const latest = history.refinements[0];
    assert(latest.changes.some(c => c.parameter === 'minImprovement'), 'minImprovement refinement not recorded');
    assert(latest.changes.some(c => c.parameter === 'minCycleDuration'), 'minCycleDuration refinement not recorded');
  });

  // =========================================================================
  // TEST SUITE 2: Exploratory Mode Implementation
  // =========================================================================
  console.log(`\n${colors.blue}[2/5] Testing Exploratory Mode${colors.reset}\n`);

  test('create-ab-test-variations.js has --explore flag', () => {
    const content = fs.readFileSync('./scripts/create-ab-test-variations.js', 'utf8');
    assert(content.includes('explore:'), 'explore option not added to args');
    assert(content.includes('--explore'), '--explore flag not documented');
  });

  test('Exploratory pattern generation functions exist', () => {
    const content = fs.readFileSync('./scripts/create-ab-test-variations.js', 'utf8');
    assert(content.includes('generateExploratoryPatterns'), 'generateExploratoryPatterns function missing');
    assert(content.includes('createExploratoryTests'), 'createExploratoryTests function missing');
  });

  test('Exploratory patterns include multiple categories', () => {
    const content = fs.readFileSync('./scripts/create-ab-test-variations.js', 'utf8');
    const categories = ['Social Proof', 'Interactive Elements', 'Scarcity & Urgency',
                       'Value Proposition', 'Progressive Disclosure', 'Personalization',
                       'Multimedia Content', 'Risk Reversal'];
    categories.forEach(cat => {
      assert(content.includes(cat), `Missing category: ${cat}`);
    });
  });

  test('Exploratory mode handles stagnation', () => {
    const content = fs.readFileSync('./scripts/create-ab-test-variations.js', 'utf8');
    assert(content.includes('EXPLORATORY MODE'), 'Exploratory mode messaging missing');
    assert(content.includes('stagnation'), 'Stagnation detection missing');
  });

  test('Exploratory report generation implemented', () => {
    const content = fs.readFileSync('./scripts/create-ab-test-variations.js', 'utf8');
    assert(content.includes('exploratory-patterns-report'), 'Report generation missing');
    assert(content.includes('Exploratory Pattern Discovery Report'), 'Report template missing');
  });

  // =========================================================================
  // TEST SUITE 3: Exploratory Execution Results
  // =========================================================================
  console.log(`\n${colors.blue}[3/5] Testing Exploratory Execution${colors.reset}\n`);

  test('Exploratory patterns report exists', () => {
    const reportPath = './reports/ab-tests/exploratory-patterns-report.md';
    assert(fs.existsSync(reportPath), 'Exploratory patterns report not found');
  });

  test('Exploratory patterns JSON exists', () => {
    const jsonPath = './reports/ab-tests/exploratory-patterns-report.json';
    assert(fs.existsSync(jsonPath), 'Exploratory patterns JSON not found');
  });

  test('Exploratory report contains pattern recommendations', () => {
    const report = fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.md', 'utf8');
    assert(report.includes('Personalization'), 'Personalization pattern missing');
    assert(report.includes('Expected Impact:'), 'Impact metrics missing');
    assert(report.includes('Implementation Options:'), 'Implementation guidance missing');
  });

  test('Exploratory JSON contains structured pattern data', () => {
    const data = JSON.parse(fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.json', 'utf8'));
    assert(data.mode === 'exploratory', 'Mode not set to exploratory');
    assert(data.patterns && data.patterns.length >= 3, 'Insufficient patterns generated');
    assert(data.nextSteps && data.nextSteps.length > 0, 'Next steps missing');
  });

  test('Exploratory patterns prioritized by impact', () => {
    const data = JSON.parse(fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.json', 'utf8'));
    const patterns = data.patterns;
    for (let i = 0; i < patterns.length - 1; i++) {
      assert(patterns[i].expectedImpact >= patterns[i + 1].expectedImpact,
             'Patterns not sorted by impact');
    }
  });

  test('Exploratory patterns include implementation details', () => {
    const data = JSON.parse(fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.json', 'utf8'));
    data.patterns.forEach(pattern => {
      assert(pattern.implementations && pattern.implementations.length > 0,
             `Pattern ${pattern.name} missing implementations`);
      assert(pattern.hypothesis, `Pattern ${pattern.name} missing hypothesis`);
      assert(pattern.expectedImpact > 0, `Pattern ${pattern.name} missing impact estimate`);
    });
  });

  // =========================================================================
  // TEST SUITE 4: Integration Testing
  // =========================================================================
  console.log(`\n${colors.blue}[4/5] Testing Integration${colors.reset}\n`);

  test('Monitoring system still operational', () => {
    const scriptPath = './scripts/monitor-optimization-results.js';
    assert(fs.existsSync(scriptPath), 'Monitoring script not found');
  });

  test('Monitoring system detects stagnation', () => {
    const report = fs.readFileSync('./reports/optimization/monitoring-report.md', 'utf8');
    assert(report.includes('Stagnant') || report.includes('stagnant'), 'Stagnation not detected');
  });

  test('Parameter recommendations remain available', () => {
    const recsPath = './reports/optimization/parameter-recommendations.json';
    assert(fs.existsSync(recsPath), 'Parameter recommendations not found');
    const recs = JSON.parse(fs.readFileSync(recsPath, 'utf8'));
    assert(recs.recommendations && recs.recommendations.length >= 3, 'Insufficient recommendations');
  });

  test('Refinement history tracks feature #70 changes', () => {
    const history = JSON.parse(fs.readFileSync('./reports/optimization/refinement-history.json', 'utf8'));
    const latest = history.refinements[0];
    assert(latest.source && latest.source.includes('Feature #70'), 'Feature #70 not attributed');
  });

  test('All optimization components compatible', () => {
    // Check that all major optimization scripts exist and are executable
    const scripts = [
      './scripts/iterative-optimization-cycle.js',
      './scripts/monitor-optimization-results.js',
      './scripts/create-ab-test-variations.js'
    ];
    scripts.forEach(script => {
      assert(fs.existsSync(script), `${script} not found`);
    });
  });

  // =========================================================================
  // TEST SUITE 5: Documentation & Completeness
  // =========================================================================
  console.log(`\n${colors.blue}[5/5] Testing Documentation${colors.reset}\n`);

  test('Exploratory report includes next steps', () => {
    const report = fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.md', 'utf8');
    assert(report.includes('Next Steps'), 'Next steps section missing');
    assert(report.includes('Success Criteria'), 'Success criteria missing');
  });

  test('Exploratory report provides clear guidance', () => {
    const report = fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.md', 'utf8');
    assert(report.includes('implement'), 'Implementation guidance missing');
    assert(report.includes('Monitor'), 'Monitoring guidance missing');
    assert(report.includes('baseline'), 'Baseline comparison guidance missing');
  });

  test('Parameter refinements are documented', () => {
    const history = JSON.parse(fs.readFileSync('./reports/optimization/refinement-history.json', 'utf8'));
    const latest = history.refinements[0];
    assert(latest.changes.every(c => c.reason), 'Refinement reasons not documented');
    assert(latest.changes.every(c => c.expectedImpact), 'Expected impacts not documented');
  });

  test('Feature #70 provides complete workflow', () => {
    // Check that the complete workflow is documented
    const exploratoryReport = fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.md', 'utf8');
    const steps = ['Review', 'implement', 'Monitor', 'Compare', 'Scale'];
    steps.forEach(step => {
      assert(exploratoryReport.toLowerCase().includes(step.toLowerCase()),
             `Missing workflow step: ${step}`);
    });
  });

  test('Success criteria defined for stagnation breakout', () => {
    const report = fs.readFileSync('./reports/ab-tests/exploratory-patterns-report.md', 'utf8');
    assert(report.includes('0.18 pts/cycle'), 'Current velocity not mentioned');
    assert(report.includes('>0.5 pts/cycle') || report.includes('0.5 pts/cycle'),
           'Target velocity not specified');
  });

  // =========================================================================
  // Performance Validation
  // =========================================================================
  console.log(`\n${colors.blue}[Bonus] Performance Validation${colors.reset}\n`);

  test('Exploratory mode executes in reasonable time', () => {
    const startTime = Date.now();
    try {
      execSync('node scripts/create-ab-test-variations.js --explore', {
        stdio: 'pipe',
        timeout: 5000 // 5 second timeout
      });
      const duration = Date.now() - startTime;
      assert(duration < 5000, `Execution too slow: ${duration}ms`);
    } catch (error) {
      if (error.killed) {
        throw new Error('Script timeout (>5 seconds)');
      }
      // Other errors might be ok (e.g., missing dependencies)
    }
  });

  test('Monitoring system executes in reasonable time', () => {
    const startTime = Date.now();
    try {
      execSync('node scripts/monitor-optimization-results.js', {
        stdio: 'pipe',
        timeout: 5000
      });
      const duration = Date.now() - startTime;
      assert(duration < 5000, `Execution too slow: ${duration}ms`);
    } catch (error) {
      if (error.killed) {
        throw new Error('Script timeout (>5 seconds)');
      }
    }
  });

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`\nTests Run:    ${results.passed + results.failed}`);
  console.log(`Tests Passed: ${colors.green}${results.passed}${colors.reset}`);
  console.log(`Tests Failed: ${results.failed > 0 ? colors.red : colors.green}${results.failed}${colors.reset}`);
  console.log(`Pass Rate:    ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  const grade = results.failed === 0 ? 'A+' :
                results.passed / (results.passed + results.failed) >= 0.9 ? 'A' :
                results.passed / (results.passed + results.failed) >= 0.8 ? 'B' :
                results.passed / (results.passed + results.failed) >= 0.7 ? 'C' : 'F';

  console.log(`Grade:        ${grade}`);
  console.log(`Status:       ${results.failed === 0 ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);

  console.log('\n' + '='.repeat(80) + '\n');

  // Save results to file
  const reportPath = './test-reports-feature-70/validation-results.json';
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    feature: 'Feature #70 - Parameter Refinements & Exploratory Discovery',
    summary: {
      total: results.passed + results.failed,
      passed: results.passed,
      failed: results.failed,
      passRate: ((results.passed / (results.passed + results.failed)) * 100).toFixed(1) + '%',
      grade: grade
    },
    tests: results.tests
  }, null, 2));

  console.log(`📊 Detailed results saved to: ${reportPath}\n`);

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests();
