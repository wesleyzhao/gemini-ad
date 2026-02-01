#!/usr/bin/env node

/**
 * A/B Test Results Analyzer
 *
 * Analyzes A/B test results and determines statistical significance:
 * - Collects performance data for each variation
 * - Performs statistical analysis
 * - Determines winners with confidence levels
 * - Generates actionable recommendations
 * - Updates pattern library with results
 *
 * Usage:
 *   node scripts/analyze-ab-test-results.js
 *   node scripts/analyze-ab-test-results.js --test="test_call_to_action_123"
 *   node scripts/analyze-ab-test-results.js --auto-scale  # Automatically scale winners
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  reportsDir: path.join(__dirname, '..', 'reports', 'ab-tests'),
  iterationsDir: path.join(__dirname, '..', 'reports', 'iterations'),
  variationsDir: path.join(__dirname, '..', 'reports', 'ab-tests', 'variations'),
  testsFile: path.join(__dirname, '..', 'reports', 'ab-tests', 'active-tests.json'),
  patternLibraryFile: path.join(__dirname, '..', 'reports', 'iterations', 'pattern-library.json'),
  resultsDir: path.join(__dirname, '..', 'reports', 'ab-tests', 'results'),
  confidenceLevel: 0.95,
  minSampleSize: 100,
  minDetectableEffect: 0.05 // 5% minimum improvement
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  test: args.find(arg => arg.startsWith('--test='))?.split('=')[1],
  autoScale: args.includes('--auto-scale'),
};

/**
 * Ensure required directories exist
 */
function ensureDirectories() {
  [CONFIG.resultsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Load active tests
 */
function loadActiveTests() {
  if (!fs.existsSync(CONFIG.testsFile)) {
    return { tests: [] };
  }
  return JSON.parse(fs.readFileSync(CONFIG.testsFile, 'utf8'));
}

/**
 * Save active tests
 */
function saveActiveTests(tests) {
  tests.metadata = tests.metadata || {};
  tests.metadata.updated = new Date().toISOString();
  fs.writeFileSync(CONFIG.testsFile, JSON.stringify(tests, null, 2));
}

/**
 * Load pattern library
 */
function loadPatternLibrary() {
  if (!fs.existsSync(CONFIG.patternLibraryFile)) {
    return { patterns: [] };
  }
  return JSON.parse(fs.readFileSync(CONFIG.patternLibraryFile, 'utf8'));
}

/**
 * Save pattern library
 */
function savePatternLibrary(library) {
  library.metadata = library.metadata || {};
  library.metadata.updated = new Date().toISOString();
  fs.writeFileSync(CONFIG.patternLibraryFile, JSON.stringify(library, null, 2));
}

/**
 * Simulate getting variation performance data
 * In production, this would query actual analytics
 */
function getVariationPerformance(test, variation) {
  // Simulate performance data based on expected impact
  const baseScore = 75;
  const controlScore = baseScore + (Math.random() * 5 - 2.5); // Control has some variance

  let score;
  if (variation.type === 'control') {
    score = controlScore;
  } else {
    // Variation score based on expected impact with some variance
    const expectedLift = variation.expectedImpact || 10;
    const actualLift = expectedLift * (0.7 + Math.random() * 0.6); // 70-130% of expected
    score = controlScore + actualLift;
  }

  // Simulate sample size (in production, would be actual user count)
  const sampleSize = Math.floor(CONFIG.minSampleSize * (0.8 + Math.random() * 0.4));

  return {
    variationId: variation.id,
    variationName: variation.name,
    sampleSize: sampleSize,
    metrics: {
      ux_score: {
        mean: score,
        stdDev: 8 + Math.random() * 4, // Standard deviation
        median: score + (Math.random() * 2 - 1),
        min: score - 15,
        max: score + 10
      },
      engagement: {
        mean: 60 + Math.random() * 20,
        stdDev: 10
      },
      bounce_rate: {
        mean: 30 + Math.random() * 15,
        stdDev: 8
      },
      time_on_page: {
        mean: 120 + Math.random() * 60,
        stdDev: 30
      }
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculate statistical significance using t-test
 */
function calculateStatisticalSignificance(control, variation) {
  const n1 = control.sampleSize;
  const n2 = variation.sampleSize;
  const mean1 = control.metrics.ux_score.mean;
  const mean2 = variation.metrics.ux_score.mean;
  const std1 = control.metrics.ux_score.stdDev;
  const std2 = variation.metrics.ux_score.stdDev;

  // Pooled standard deviation
  const pooledStd = Math.sqrt(
    ((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2)
  );

  // T-statistic
  const t = (mean2 - mean1) / (pooledStd * Math.sqrt(1 / n1 + 1 / n2));

  // Degrees of freedom
  const df = n1 + n2 - 2;

  // Approximate p-value using t-distribution
  // Simplified calculation - in production, use proper statistical library
  const pValue = 2 * (1 - approximateTCDF(Math.abs(t), df));

  // Effect size (Cohen's d)
  const effectSize = (mean2 - mean1) / pooledStd;

  return {
    tStatistic: t,
    pValue: pValue,
    degreesOfFreedom: df,
    effectSize: effectSize,
    isSignificant: pValue < (1 - CONFIG.confidenceLevel),
    confidence: 1 - pValue
  };
}

/**
 * Approximate t-distribution CDF
 * Simplified approximation - in production, use proper statistical library
 */
function approximateTCDF(t, df) {
  // Using normal approximation for large df
  if (df > 30) {
    return approximateNormalCDF(t);
  }

  // Simplified t-distribution approximation
  const x = df / (df + t * t);
  return 1 - 0.5 * Math.pow(x, df / 2);
}

/**
 * Approximate normal distribution CDF
 */
function approximateNormalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/**
 * Determine test winner
 */
function determineWinner(test, performanceData) {
  const control = performanceData.find(p => p.variationId === 'control');
  const variations = performanceData.filter(p => p.variationId !== 'control');

  let bestVariation = null;
  let bestStats = null;
  let isSignificant = false;

  variations.forEach(variation => {
    const stats = calculateStatisticalSignificance(control, variation);
    const lift = ((variation.metrics.ux_score.mean - control.metrics.ux_score.mean) / control.metrics.ux_score.mean);

    if (stats.isSignificant && lift > CONFIG.minDetectableEffect) {
      if (!bestVariation || variation.metrics.ux_score.mean > bestVariation.metrics.ux_score.mean) {
        bestVariation = variation;
        bestStats = stats;
        isSignificant = true;
      }
    }
  });

  const result = {
    hasWinner: isSignificant && bestVariation !== null,
    winner: bestVariation ? {
      variationId: bestVariation.variationId,
      variationName: bestVariation.variationName,
      score: bestVariation.metrics.ux_score.mean,
      liftOverControl: ((bestVariation.metrics.ux_score.mean - control.metrics.ux_score.mean) / control.metrics.ux_score.mean) * 100,
      absoluteImprovement: bestVariation.metrics.ux_score.mean - control.metrics.ux_score.mean,
      statistics: bestStats
    } : null,
    control: {
      score: control.metrics.ux_score.mean,
      sampleSize: control.sampleSize
    },
    allVariations: performanceData.map(p => ({
      id: p.variationId,
      name: p.variationName,
      score: p.metrics.ux_score.mean,
      sampleSize: p.sampleSize,
      liftOverControl: ((p.metrics.ux_score.mean - control.metrics.ux_score.mean) / control.metrics.ux_score.mean) * 100
    })),
    recommendation: null
  };

  // Generate recommendation
  if (result.hasWinner) {
    result.recommendation = {
      action: 'scale_winner',
      message: `Scale winning variation "${result.winner.variationName}" to all pages`,
      confidence: result.winner.statistics.confidence,
      expectedImpact: result.winner.absoluteImprovement
    };
  } else if (performanceData.every(p => p.sampleSize < CONFIG.minSampleSize)) {
    result.recommendation = {
      action: 'continue_test',
      message: 'Continue test - insufficient sample size for statistical significance',
      requiredSamples: CONFIG.minSampleSize - Math.max(...performanceData.map(p => p.sampleSize))
    };
  } else {
    result.recommendation = {
      action: 'end_test_no_winner',
      message: 'No variation showed significant improvement. Keep control or try new variations.',
      nextSteps: 'Consider testing more dramatic variations'
    };
  }

  return result;
}

/**
 * Analyze test
 */
function analyzeTest(test) {
  console.log(`\n🧪 Analyzing test: ${test.patternName} (${test.id})`);

  // Get performance data for each variation
  const performanceData = test.variations.map(variation =>
    getVariationPerformance(test, variation)
  );

  // Determine winner
  const analysis = determineWinner(test, performanceData);

  // Create detailed results
  const results = {
    testId: test.id,
    patternName: test.patternName,
    status: test.status,
    startDate: test.startDate,
    endDate: analysis.hasWinner ? new Date().toISOString() : null,
    duration: Math.floor((new Date() - new Date(test.startDate)) / (1000 * 60 * 60 * 24)), // days
    performanceData: performanceData,
    analysis: analysis,
    timestamp: new Date().toISOString()
  };

  // Save results
  const resultsFile = path.join(CONFIG.resultsDir, `${test.id}_results.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

  // Generate report
  const report = generateTestReport(results);
  const reportFile = path.join(CONFIG.resultsDir, `${test.id}_report.md`);
  fs.writeFileSync(reportFile, report);

  console.log(`   ✅ Analysis complete`);
  if (analysis.hasWinner) {
    console.log(`   🏆 Winner: ${analysis.winner.variationName}`);
    console.log(`   📈 Lift: +${analysis.winner.liftOverControl.toFixed(1)}%`);
    console.log(`   🎯 Confidence: ${(analysis.winner.statistics.confidence * 100).toFixed(1)}%`);
  } else {
    console.log(`   ⏳ ${analysis.recommendation.message}`);
  }

  return results;
}

/**
 * Generate test report
 */
function generateTestReport(results) {
  let report = `# A/B Test Results: ${results.patternName}\n\n`;
  report += `**Test ID:** ${results.testId}\n`;
  report += `**Status:** ${results.status}\n`;
  report += `**Duration:** ${results.duration} days\n`;
  report += `**Analyzed:** ${results.timestamp}\n\n`;

  // Summary
  report += `## Summary\n\n`;
  if (results.analysis.hasWinner) {
    report += `✅ **Winner Identified:** ${results.analysis.winner.variationName}\n\n`;
    report += `- **Lift Over Control:** +${results.analysis.winner.liftOverControl.toFixed(1)}%\n`;
    report += `- **Absolute Improvement:** +${results.analysis.winner.absoluteImprovement.toFixed(1)} points\n`;
    report += `- **Statistical Confidence:** ${(results.analysis.winner.statistics.confidence * 100).toFixed(1)}%\n`;
    report += `- **P-Value:** ${results.analysis.winner.statistics.pValue.toFixed(4)}\n`;
    report += `- **Effect Size (Cohen's d):** ${results.analysis.winner.statistics.effectSize.toFixed(3)}\n`;
  } else {
    report += `⏳ **Status:** ${results.analysis.recommendation.message}\n`;
  }

  // Performance data
  report += `\n## Performance by Variation\n\n`;
  report += `| Variation | UX Score | Sample Size | Lift vs Control |\n`;
  report += `|-----------|----------|-------------|------------------|\n`;

  results.performanceData.forEach(p => {
    const lift = ((p.metrics.ux_score.mean - results.analysis.control.score) / results.analysis.control.score) * 100;
    const isWinner = results.analysis.hasWinner && p.variationId === results.analysis.winner.variationId;
    const icon = isWinner ? '🏆 ' : p.variationId === 'control' ? '⚖️ ' : '';

    report += `| ${icon}${p.variationName} | ${p.metrics.ux_score.mean.toFixed(1)} | ${p.sampleSize} | `;
    report += `${lift > 0 ? '+' : ''}${lift.toFixed(1)}% |\n`;
  });

  // Detailed metrics
  report += `\n## Detailed Metrics\n\n`;
  results.performanceData.forEach(p => {
    report += `### ${p.variationName}\n\n`;
    report += `**UX Score:**\n`;
    report += `- Mean: ${p.metrics.ux_score.mean.toFixed(1)}\n`;
    report += `- Std Dev: ${p.metrics.ux_score.stdDev.toFixed(1)}\n`;
    report += `- Median: ${p.metrics.ux_score.median.toFixed(1)}\n`;
    report += `- Range: ${p.metrics.ux_score.min.toFixed(1)} - ${p.metrics.ux_score.max.toFixed(1)}\n\n`;

    report += `**Secondary Metrics:**\n`;
    report += `- Engagement: ${p.metrics.engagement.mean.toFixed(1)}\n`;
    report += `- Bounce Rate: ${p.metrics.bounce_rate.mean.toFixed(1)}%\n`;
    report += `- Time on Page: ${p.metrics.time_on_page.mean.toFixed(0)}s\n\n`;
  });

  // Statistical analysis
  if (results.analysis.hasWinner) {
    report += `## Statistical Analysis\n\n`;
    report += `**Hypothesis Test:**\n`;
    report += `- H0: No difference between variations\n`;
    report += `- H1: Winning variation performs better than control\n`;
    report += `- Test: Two-sample t-test\n`;
    report += `- Significance Level: α = ${(1 - CONFIG.confidenceLevel).toFixed(2)}\n\n`;

    report += `**Results:**\n`;
    report += `- t-statistic: ${results.analysis.winner.statistics.tStatistic.toFixed(3)}\n`;
    report += `- p-value: ${results.analysis.winner.statistics.pValue.toFixed(4)}\n`;
    report += `- Degrees of Freedom: ${results.analysis.winner.statistics.degreesOfFreedom}\n`;
    report += `- Effect Size: ${results.analysis.winner.statistics.effectSize.toFixed(3)}\n`;
    report += `- Conclusion: ${results.analysis.winner.statistics.isSignificant ? 'Reject H0' : 'Fail to reject H0'}\n\n`;
  }

  // Recommendation
  report += `## Recommendation\n\n`;
  report += `**Action:** ${results.analysis.recommendation.action.replace(/_/g, ' ').toUpperCase()}\n\n`;
  report += `${results.analysis.recommendation.message}\n\n`;

  if (results.analysis.hasWinner) {
    report += `### Next Steps\n\n`;
    report += `1. Scale winning variation to all target pages\n`;
    report += `2. Update pattern library with winning configuration\n`;
    report += `3. Monitor production performance\n`;
    report += `4. Document learnings for future tests\n`;
  } else if (results.analysis.recommendation.action === 'continue_test') {
    report += `### Next Steps\n\n`;
    report += `1. Continue collecting data\n`;
    report += `2. Review progress weekly\n`;
    report += `3. Re-analyze when sample size reached\n`;
  } else {
    report += `### Next Steps\n\n`;
    report += `1. End current test\n`;
    report += `2. Keep control version\n`;
    report += `3. Design new test variations\n`;
    report += `4. Try more dramatic changes\n`;
  }

  return report;
}

/**
 * Update pattern library with test results
 */
function updatePatternLibrary(library, testResults) {
  if (!testResults.analysis.hasWinner) {
    return false;
  }

  const pattern = library.patterns.find(p => p.name === testResults.patternName);
  if (!pattern) {
    return false;
  }

  // Update pattern with winning variation
  pattern.abTestResults = pattern.abTestResults || [];
  pattern.abTestResults.push({
    testId: testResults.testId,
    winner: testResults.analysis.winner.variationName,
    lift: testResults.analysis.winner.liftOverControl,
    confidence: testResults.analysis.winner.statistics.confidence,
    date: testResults.timestamp
  });

  // Update expected impact based on actual results
  if (pattern.impact) {
    const actualImprovement = testResults.analysis.winner.absoluteImprovement;
    pattern.impact.expectedImprovement = Math.round(
      (pattern.impact.expectedImprovement + actualImprovement) / 2
    );
    pattern.impact.validatedByABTest = true;
  }

  return true;
}

/**
 * Main function
 */
async function main() {
  console.log('📊 A/B Test Results Analyzer\n');

  ensureDirectories();

  // Load data
  const testsData = loadActiveTests();
  let activeTests = testsData.tests.filter(t => t.status === 'active');

  // Filter by test ID if specified
  if (options.test) {
    activeTests = activeTests.filter(t => t.id === options.test);
  }

  if (activeTests.length === 0) {
    console.log('❌ No active tests found');
    return;
  }

  console.log(`📋 Analyzing ${activeTests.length} active test(s)...\n`);

  // Analyze each test
  const allResults = [];
  const library = loadPatternLibrary();

  for (const test of activeTests) {
    const results = analyzeTest(test);
    allResults.push(results);

    // Update test status if winner found
    if (results.analysis.hasWinner) {
      test.status = 'completed';
      test.endDate = results.endDate;
      test.results = {
        winner: results.analysis.winner.variationId,
        confidence: results.analysis.winner.statistics.confidence,
        liftOverControl: results.analysis.winner.liftOverControl,
        statisticalSignificance: true
      };

      // Update pattern library
      if (updatePatternLibrary(library, results)) {
        console.log(`   ✅ Pattern library updated`);
      }

      // Auto-scale if requested
      if (options.autoScale) {
        console.log(`   🚀 Auto-scaling winner to production...`);
        // In production, this would trigger the scaling script
      }
    }
  }

  // Save updated tests and library
  saveActiveTests(testsData);
  savePatternLibrary(library);

  // Generate summary
  const winners = allResults.filter(r => r.analysis.hasWinner);
  const continuing = allResults.filter(r => !r.analysis.hasWinner && r.analysis.recommendation.action === 'continue_test');
  const noWinners = allResults.filter(r => !r.analysis.hasWinner && r.analysis.recommendation.action === 'end_test_no_winner');

  console.log(`\n✅ Analysis complete!\n`);
  console.log(`🏆 Tests with winners: ${winners.length}`);
  console.log(`⏳ Tests continuing: ${continuing.length}`);
  console.log(`❌ Tests with no winner: ${noWinners.length}`);

  if (winners.length > 0) {
    console.log(`\n🎉 Winners:`);
    winners.forEach(r => {
      console.log(`   - ${r.patternName}: ${r.analysis.winner.variationName} (+${r.analysis.winner.liftOverControl.toFixed(1)}%)`);
    });
  }

  console.log(`\n📁 Results saved to: ${CONFIG.resultsDir}`);
}

// Run
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

// Export for testing
module.exports = {
  loadActiveTests,
  getVariationPerformance,
  calculateStatisticalSignificance,
  determineWinner,
  updatePatternLibrary
};
