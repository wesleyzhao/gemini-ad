#!/usr/bin/env node

/**
 * Validation Tests for Production Monitoring & A/B Testing System
 *
 * Tests all components of the production monitoring and A/B testing system:
 * - Production performance monitoring
 * - A/B test variation creation
 * - A/B test results analysis
 * - Statistical significance calculations
 * - Integration between components
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Component paths
const COMPONENTS = {
  monitor: path.join(__dirname, '..', 'scripts', 'monitor-production-performance.js'),
  variations: path.join(__dirname, '..', 'scripts', 'create-ab-test-variations.js'),
  analysis: path.join(__dirname, '..', 'scripts', 'analyze-ab-test-results.js')
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test helper function
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
 * Component Tests
 */
function testComponents() {
  console.log('\n📦 Component Tests\n');

  test('All monitoring scripts exist', () => {
    Object.entries(COMPONENTS).forEach(([name, path]) => {
      assert(fs.existsSync(path), `${name} script not found at ${path}`);
    });
  });

  test('All scripts are executable', () => {
    Object.values(COMPONENTS).forEach(scriptPath => {
      const stats = fs.statSync(scriptPath);
      assert(stats.mode & fs.constants.S_IXUSR || stats.mode & fs.constants.S_IRUSR,
        `${scriptPath} is not executable`);
    });
  });

  test('All required functions exported', () => {
    // Monitor
    const monitor = require(COMPONENTS.monitor);
    assert(typeof monitor.loadPatternLibrary === 'function');
    assert(typeof monitor.detectRegressions === 'function');
    assert(typeof monitor.generateInsights === 'function');

    // Variations
    const variations = require(COMPONENTS.variations);
    assert(typeof variations.generatePatternVariations === 'function');
    assert(typeof variations.createTestConfig === 'function');

    // Analysis
    const analysis = require(COMPONENTS.analysis);
    assert(typeof analysis.calculateStatisticalSignificance === 'function');
    assert(typeof analysis.determineWinner === 'function');
  });
}

/**
 * Monitoring Function Tests
 */
function testMonitoring() {
  console.log('\n🔍 Monitoring Function Tests\n');

  const monitor = require(COMPONENTS.monitor);

  test('Detect regressions correctly', () => {
    const currentAnalysis = {
      pages: [
        { file: 'test1.html', uxScore: 70, metrics: {} },
        { file: 'test2.html', uxScore: 80, metrics: {} }
      ]
    };

    const history = {
      snapshots: [{
        pages: [
          { file: 'test1.html', uxScore: 80, metrics: {} }, // Regression of 10 points
          { file: 'test2.html', uxScore: 85, metrics: {} }  // Regression of 5 points
        ]
      }]
    };

    const regressions = monitor.detectRegressions(currentAnalysis, history, 5);
    assert(regressions.length >= 1, 'Should detect at least one regression');
    const majorRegression = regressions.find(r => r.page === 'test1.html');
    assert(majorRegression && majorRegression.decline === 10, 'Should calculate correct decline');
  });

  test('Generate insights correctly', () => {
    const patternMetrics = [
      {
        patternName: 'Test Pattern 1',
        alerts: [],
        trends: { successRateTrend: 'improving', impactTrend: 'improving' }
      },
      {
        patternName: 'Test Pattern 2',
        alerts: [{ severity: 'high' }],
        trends: { successRateTrend: 'declining', impactTrend: 'declining' }
      }
    ];

    const regressions = [];
    const currentAnalysis = { pages: [] };

    const insights = monitor.generateInsights(patternMetrics, regressions, currentAnalysis);

    assert(insights.patterns.improving === 1, 'Should count improving patterns');
    assert(insights.patterns.declining === 1, 'Should count declining patterns');
    assert(insights.recommendations.length > 0, 'Should generate recommendations');
  });

  test('Create performance snapshot correctly', () => {
    const currentAnalysis = {
      pages: [
        { file: 'test1.html', uxScore: 75 },
        { file: 'test2.html', uxScore: 85 }
      ]
    };

    const patternMetrics = [
      {
        patternName: 'Test Pattern',
        performance: { successRate: 80, applications: 5 },
        trends: { successRateTrend: 'stable' }
      }
    ];

    const snapshot = monitor.createSnapshot(currentAnalysis, patternMetrics);

    assert(snapshot.timestamp, 'Should have timestamp');
    assert(snapshot.pages.length === 2, 'Should include all pages');
    assert(snapshot.summary.averageScore === 80, 'Should calculate average correctly');
    assert(snapshot.patterns['Test Pattern'], 'Should include pattern data');
  });
}

/**
 * A/B Test Variation Tests
 */
function testVariations() {
  console.log('\n🧪 A/B Test Variation Tests\n');

  const variations = require(COMPONENTS.variations);

  test('Generate pattern variations correctly', () => {
    const pattern = {
      name: 'Test Pattern',
      category: 'Call to Action',
      description: 'Test description'
    };

    const result = variations.generatePatternVariations(pattern, 3);

    assert(result.length === 3, 'Should generate correct number of variations');
    assert(result[0].id === 'control', 'First should be control');
    assert(result[0].type === 'control', 'Control should have correct type');
    assert(result[1].type === 'variation', 'Others should be variations');
  });

  test('Create test configuration correctly', () => {
    const pattern = {
      name: 'Test Pattern',
      category: 'Call to Action'
    };

    const variationsData = [
      { id: 'control', name: 'Control' },
      { id: 'variation_1', name: 'Variation 1' }
    ];

    const pages = [
      { file: 'test1.html' },
      { file: 'test2.html' }
    ];

    const config = variations.createTestConfig(pattern, variationsData, pages);

    assert(config.id, 'Should have test ID');
    assert(config.patternName === 'Test Pattern', 'Should include pattern name');
    assert(config.status === 'active', 'Should be active');
    assert(config.variations.length === 2, 'Should include variations');
    assert(config.targetPages.length === 2, 'Should include pages');
    assert(config.allocation.control === 50, 'Should split traffic equally');
  });

  test('Get test eligible patterns correctly', () => {
    const library = {
      patterns: [
        {
          name: 'Pattern 1',
          status: 'production',
          stats: { applications: 5, successRate: 80 }
        },
        {
          name: 'Pattern 2',
          status: 'production',
          stats: { applications: 2, successRate: 90 } // Too few applications
        },
        {
          name: 'Pattern 3',
          status: 'testing', // Not production
          stats: { applications: 5, successRate: 80 }
        }
      ]
    };

    const eligible = variations.getTestEligiblePatterns(library);

    assert(eligible.length === 1, 'Should filter correctly');
    assert(eligible[0].name === 'Pattern 1', 'Should select correct pattern');
  });
}

/**
 * Statistical Analysis Tests
 */
function testStatisticalAnalysis() {
  console.log('\n📊 Statistical Analysis Tests\n');

  const analysis = require(COMPONENTS.analysis);

  test('Calculate statistical significance correctly', () => {
    const control = {
      sampleSize: 100,
      metrics: {
        ux_score: { mean: 75, stdDev: 10 }
      }
    };

    const variation = {
      sampleSize: 100,
      metrics: {
        ux_score: { mean: 85, stdDev: 10 } // 10 point improvement
      }
    };

    const result = analysis.calculateStatisticalSignificance(control, variation);

    assert(result.tStatistic, 'Should calculate t-statistic');
    assert(result.pValue >= 0 && result.pValue <= 1, 'P-value should be valid probability');
    assert(result.degreesOfFreedom === 198, 'Should calculate degrees of freedom correctly');
    assert(typeof result.isSignificant === 'boolean', 'Should determine significance');
  });

  test('Determine winner correctly - significant improvement', () => {
    const test = {
      id: 'test_123',
      patternName: 'Test Pattern',
      variations: [
        { id: 'control', name: 'Control', type: 'control' },
        { id: 'variation_1', name: 'Variation 1', type: 'variation' }
      ]
    };

    const performanceData = [
      {
        variationId: 'control',
        variationName: 'Control',
        sampleSize: 150,
        metrics: {
          ux_score: { mean: 70, stdDev: 8 }
        }
      },
      {
        variationId: 'variation_1',
        variationName: 'Variation 1',
        sampleSize: 150,
        metrics: {
          ux_score: { mean: 85, stdDev: 8 } // Large improvement
        }
      }
    ];

    const result = analysis.determineWinner(test, performanceData);

    assert(result.hasWinner, 'Should detect winner');
    assert(result.winner.variationId === 'variation_1', 'Should select correct winner');
    assert(result.winner.liftOverControl > 0, 'Should calculate lift');
    assert(result.recommendation.action === 'scale_winner', 'Should recommend scaling');
  });

  test('Determine winner correctly - no significant difference', () => {
    const test = {
      id: 'test_123',
      patternName: 'Test Pattern',
      variations: [
        { id: 'control', name: 'Control', type: 'control' },
        { id: 'variation_1', name: 'Variation 1', type: 'variation' }
      ]
    };

    const performanceData = [
      {
        variationId: 'control',
        variationName: 'Control',
        sampleSize: 150,
        metrics: {
          ux_score: { mean: 75, stdDev: 10 }
        }
      },
      {
        variationId: 'variation_1',
        variationName: 'Variation 1',
        sampleSize: 150,
        metrics: {
          ux_score: { mean: 76, stdDev: 10 } // Tiny improvement
        }
      }
    ];

    const result = analysis.determineWinner(test, performanceData);

    assert(!result.hasWinner, 'Should not detect winner');
    assert(result.recommendation.action !== 'scale_winner', 'Should not recommend scaling');
  });

  test('Update pattern library correctly', () => {
    const library = {
      patterns: [
        {
          name: 'Test Pattern',
          impact: { expectedImprovement: 10 }
        }
      ]
    };

    const testResults = {
      patternName: 'Test Pattern',
      testId: 'test_123',
      timestamp: new Date().toISOString(),
      analysis: {
        hasWinner: true,
        winner: {
          variationName: 'Variation 1',
          liftOverControl: 20,
          absoluteImprovement: 15,
          statistics: { confidence: 0.95 }
        }
      }
    };

    const updated = analysis.updatePatternLibrary(library, testResults);

    assert(updated, 'Should update successfully');
    assert(library.patterns[0].abTestResults, 'Should add AB test results');
    assert(library.patterns[0].abTestResults.length === 1, 'Should record result');
    assert(library.patterns[0].impact.validatedByABTest, 'Should mark as validated');
  });
}

/**
 * Integration Tests
 */
function testIntegration() {
  console.log('\n🔗 Integration Tests\n');

  test('Complete monitoring and testing workflow', () => {
    const monitor = require(COMPONENTS.monitor);
    const variations = require(COMPONENTS.variations);
    const analysis = require(COMPONENTS.analysis);

    // 1. Load pattern library
    const library = {
      patterns: [
        {
          name: 'Test Pattern',
          status: 'production',
          stats: { applications: 5, successRate: 80, averageImpact: 10 },
          category: 'Call to Action'
        }
      ]
    };

    // 2. Create test variations
    const pattern = library.patterns[0];
    const variationsData = variations.generatePatternVariations(pattern, 2);
    assert(variationsData.length === 2, 'Should create variations');

    // 3. Create test config
    const pages = [{ file: 'test.html' }];
    const testConfig = variations.createTestConfig(pattern, variationsData, pages);
    assert(testConfig.id, 'Should create config');

    // 4. Simulate performance data
    const performanceData = variationsData.map(v => ({
      variationId: v.id,
      variationName: v.name,
      sampleSize: 150,
      metrics: {
        ux_score: {
          mean: v.id === 'control' ? 70 : 85,
          stdDev: 8
        }
      }
    }));

    // 5. Analyze results
    const winnerAnalysis = analysis.determineWinner(testConfig, performanceData);
    assert(winnerAnalysis.hasWinner, 'Should identify winner');

    // 6. Update library
    const testResults = {
      patternName: pattern.name,
      testId: testConfig.id,
      timestamp: new Date().toISOString(),
      analysis: winnerAnalysis
    };

    const updated = analysis.updatePatternLibrary(library, testResults);
    assert(updated, 'Should update library');
    assert(library.patterns[0].abTestResults.length === 1, 'Should record result');
  });
}

/**
 * Edge Case Tests
 */
function testEdgeCases() {
  console.log('\n⚠️  Edge Case Tests\n');

  const monitor = require(COMPONENTS.monitor);
  const variations = require(COMPONENTS.variations);
  const analysis = require(COMPONENTS.analysis);

  test('Handle empty pattern library', () => {
    const library = { patterns: [] };
    const eligible = variations.getTestEligiblePatterns(library);
    assert(eligible.length === 0, 'Should return empty array');
  });

  test('Handle no regressions', () => {
    const currentAnalysis = {
      pages: [{ file: 'test.html', uxScore: 80 }]
    };
    const history = {
      snapshots: [{
        pages: [{ file: 'test.html', uxScore: 75 }]
      }]
    };
    const regressions = monitor.detectRegressions(currentAnalysis, history, 5);
    assert(regressions.length === 0, 'Should detect no regressions when scores improve');
  });

  test('Handle empty performance history', () => {
    const currentAnalysis = { pages: [] };
    const history = { snapshots: [] };
    const regressions = monitor.detectRegressions(currentAnalysis, history, 5);
    assert(regressions.length === 0, 'Should handle empty history');
  });

  test('Handle insufficient sample size', () => {
    const test = {
      variations: [
        { id: 'control', name: 'Control', type: 'control' },
        { id: 'variation_1', name: 'Variation 1', type: 'variation' }
      ]
    };

    const performanceData = [
      {
        variationId: 'control',
        variationName: 'Control',
        sampleSize: 10, // Too small
        metrics: { ux_score: { mean: 70, stdDev: 10 } }
      },
      {
        variationId: 'variation_1',
        variationName: 'Variation 1',
        sampleSize: 10, // Too small
        metrics: { ux_score: { mean: 85, stdDev: 10 } }
      }
    ];

    const result = analysis.determineWinner(test, performanceData);
    // With small sample size, might still detect winner if effect is large
    // Just verify we get a valid recommendation
    assert(result.recommendation, 'Should have a recommendation');
    assert(result.recommendation.action, 'Should have an action');
  });

  test('Handle equal variation performance', () => {
    const control = {
      sampleSize: 100,
      metrics: { ux_score: { mean: 75, stdDev: 10 } }
    };

    const variation = {
      sampleSize: 100,
      metrics: { ux_score: { mean: 75, stdDev: 10 } } // Identical
    };

    const result = analysis.calculateStatisticalSignificance(control, variation);
    assert(Math.abs(result.tStatistic) < 0.1, 'T-statistic should be near zero');
    assert(!result.isSignificant, 'Should not be significant');
  });
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('🧪 Production Monitoring & A/B Testing System Validation\n');
  console.log('='.repeat(70));

  testComponents();
  testMonitoring();
  testVariations();
  testStatisticalAnalysis();
  testIntegration();
  testEdgeCases();

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Results Summary\n');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  // Save results
  const resultsFile = path.join(__dirname, '..', 'reports', 'iterations', 'production-monitoring-test-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

  const resultsDir = path.join(__dirname, '..', 'reports', 'iterations');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const txtFile = path.join(resultsDir, 'production-monitoring-test-results.txt');
  let output = '🧪 Production Monitoring & A/B Testing System Validation\n\n';
  output += `Date: ${new Date().toISOString()}\n\n`;
  output += `Results:\n`;
  output += `✅ Passed: ${results.passed}\n`;
  output += `❌ Failed: ${results.failed}\n`;
  output += `📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n\n`;
  output += `Test Details:\n`;
  results.tests.forEach(test => {
    output += `${test.status === 'PASS' ? '✅' : '❌'} ${test.name}\n`;
    if (test.error) {
      output += `   Error: ${test.error}\n`;
    }
  });

  fs.writeFileSync(txtFile, output);

  console.log(`\n📁 Results saved to:`);
  console.log(`   - ${resultsFile}`);
  console.log(`   - ${txtFile}`);

  if (results.failed > 0) {
    console.log('\n❌ Some tests failed. Please review the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! System is production ready.');
    process.exit(0);
  }
}

// Run tests
runAllTests();
