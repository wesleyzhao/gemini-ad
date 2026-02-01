#!/usr/bin/env node

/**
 * Quality Maintenance Cycle Script
 *
 * Continuous quality maintenance system that:
 * 1. Monitors UX analysis results
 * 2. Executes pattern applications
 * 3. Monitors combined effects
 * 4. Validates improvements
 * 5. Generates next iteration plan
 *
 * This is the orchestration layer that runs all maintenance scripts
 * in sequence to ensure continuous optimization quality.
 *
 * Usage:
 *   node scripts/quality-maintenance-cycle.js [--auto]
 *
 * Options:
 *   --auto: Run automatically without prompts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const MAINTENANCE_LOG = 'reports/iterations/maintenance-log.json';
const MAINTENANCE_REPORT = 'reports/iterations/maintenance-report.md';

// Parse command line arguments
const args = process.argv.slice(2);
const autoMode = args.includes('--auto');

console.log('🔧 Quality Maintenance Cycle');
console.log('============================\n');

if (autoMode) {
  console.log('🤖 AUTO MODE - Running automatically\n');
}

/**
 * Load or initialize maintenance log
 */
function loadMaintenanceLog() {
  if (fs.existsSync(MAINTENANCE_LOG)) {
    return JSON.parse(fs.readFileSync(MAINTENANCE_LOG, 'utf8'));
  }

  return {
    cycles: [],
    totalCycles: 0,
    successfulCycles: 0,
    failedCycles: 0,
    lastCycle: null,
    totalImpact: 0,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Execute a script and capture output
 */
function executeScript(scriptPath, description) {
  console.log(`\n📋 ${description}`);
  console.log(`   Script: ${scriptPath}\n`);

  const startTime = Date.now();

  try {
    const output = execSync(`node ${scriptPath}`, {
      encoding: 'utf8',
      stdio: 'inherit'
    });

    const duration = Date.now() - startTime;

    console.log(`\n✅ ${description} completed (${(duration / 1000).toFixed(1)}s)\n`);

    return {
      success: true,
      duration,
      output: output || 'Success'
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error(`\n❌ ${description} failed (${(duration / 1000).toFixed(1)}s)`);
    console.error(`   Error: ${error.message}\n`);

    return {
      success: false,
      duration,
      error: error.message
    };
  }
}

/**
 * Run UX analysis
 */
function runUXAnalysis() {
  return executeScript(
    'scripts/analyze-ux.js',
    'Step 1: UX Analysis'
  );
}

/**
 * Test pattern combinations
 */
function testPatternCombinations() {
  return executeScript(
    'scripts/test-pattern-combinations.js',
    'Step 2: Pattern Combination Testing'
  );
}

/**
 * Execute pattern applications
 */
function executePatternApplications() {
  return executeScript(
    'scripts/execute-pattern-applications.js',
    'Step 3: Pattern Application Execution'
  );
}

/**
 * Monitor combined effects
 */
function monitorCombinedEffects() {
  return executeScript(
    'scripts/monitor-combined-pattern-effects.js',
    'Step 4: Combined Pattern Effects Monitoring'
  );
}

/**
 * Run next iteration
 */
function runNextIteration() {
  return executeScript(
    'scripts/run-next-iteration.js',
    'Step 5: Next Iteration Planning'
  );
}

/**
 * Collect cycle results
 */
function collectCycleResults() {
  const results = {
    uxAnalysis: null,
    patternApplications: null,
    combinedEffects: null,
    iteration: null
  };

  // Load UX analysis results
  if (fs.existsSync('reports/ux-analysis-results.json')) {
    const uxData = JSON.parse(fs.readFileSync('reports/ux-analysis-results.json', 'utf8'));
    results.uxAnalysis = {
      totalPages: uxData.summary.totalPages,
      avgQualityScore: uxData.summary.avgQualityScore,
      excellentPages: uxData.summary.excellentPages,
      needsImprovementPages: uxData.summary.needsImprovementPages
    };
  }

  // Load pattern application results
  if (fs.existsSync('reports/iterations/pattern-application-results.json')) {
    const appData = JSON.parse(fs.readFileSync('reports/iterations/pattern-application-results.json', 'utf8'));
    results.patternApplications = {
      successfulApplications: appData.summary.successfulApplications,
      failedApplications: appData.summary.failedApplications,
      totalExpectedImpact: appData.summary.totalExpectedImpact,
      successRate: parseFloat(appData.summary.successRate)
    };
  }

  // Load combined effects results
  if (fs.existsSync('reports/iterations/combined-pattern-effects.json')) {
    const combData = JSON.parse(fs.readFileSync('reports/iterations/combined-pattern-effects.json', 'utf8'));
    results.combinedEffects = {
      totalPages: combData.summary.totalPages,
      combinedPatterns: combData.summary.combinedPatterns,
      singlePatterns: combData.summary.singlePatterns,
      totalExpectedImpact: combData.summary.totalExpectedImpact,
      highImpactCombinations: combData.summary.highImpactCombinations
    };
  }

  // Load iteration results
  if (fs.existsSync('reports/iterations/iteration-results.json')) {
    const iterData = JSON.parse(fs.readFileSync('reports/iterations/iteration-results.json', 'utf8'));
    results.iteration = {
      iterationNumber: iterData.iterationNumber,
      pagesProcessed: iterData.summary.totalPages,
      improvedPages: iterData.summary.improvedPages,
      totalImpact: iterData.summary.totalImpact,
      strategyEffectiveness: iterData.strategyEffectiveness
    };
  }

  return results;
}

/**
 * Calculate cycle health score
 */
function calculateCycleHealth(stepResults, cycleResults) {
  let score = 100;

  // Deduct for failed steps
  const failedSteps = Object.values(stepResults).filter(r => !r.success).length;
  score -= failedSteps * 20;

  // Boost for successful applications
  if (cycleResults.patternApplications) {
    const successRate = cycleResults.patternApplications.successRate;
    if (successRate >= 90) {
      score += 10;
    } else if (successRate >= 70) {
      score += 5;
    }
  }

  // Boost for high-impact combinations
  if (cycleResults.combinedEffects) {
    const highImpact = cycleResults.combinedEffects.highImpactCombinations;
    score += Math.min(highImpact * 5, 20);
  }

  // Boost for page improvements
  if (cycleResults.iteration) {
    const improvementRate = cycleResults.iteration.pagesProcessed > 0
      ? (cycleResults.iteration.improvedPages / cycleResults.iteration.pagesProcessed) * 100
      : 0;

    if (improvementRate >= 80) {
      score += 15;
    } else if (improvementRate >= 60) {
      score += 10;
    } else if (improvementRate >= 40) {
      score += 5;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Determine cycle status
 */
function determineCycleStatus(healthScore) {
  if (healthScore >= 90) {
    return 'excellent';
  } else if (healthScore >= 75) {
    return 'good';
  } else if (healthScore >= 60) {
    return 'fair';
  } else if (healthScore >= 40) {
    return 'needs-improvement';
  } else {
    return 'critical';
  }
}

/**
 * Generate cycle recommendations
 */
function generateCycleRecommendations(stepResults, cycleResults, healthScore) {
  const recommendations = [];

  // Check for failed steps
  const failedSteps = Object.entries(stepResults)
    .filter(([_, result]) => !result.success)
    .map(([step, _]) => step);

  if (failedSteps.length > 0) {
    recommendations.push({
      priority: 'critical',
      category: 'step-failure',
      action: `Investigate and resolve failures in: ${failedSteps.join(', ')}`,
      rationale: 'Some maintenance steps failed to complete',
      impact: 'System may not be optimizing effectively'
    });
  }

  // Check pattern application success rate
  if (cycleResults.patternApplications) {
    const successRate = cycleResults.patternApplications.successRate;
    if (successRate < 70) {
      recommendations.push({
        priority: 'high',
        category: 'application-quality',
        action: 'Review and improve pattern application strategies',
        rationale: `Success rate is ${successRate}% (below 70% threshold)`,
        impact: 'Patterns may not be applying correctly to pages'
      });
    }
  }

  // Check for high-impact opportunities
  if (cycleResults.combinedEffects) {
    const highImpact = cycleResults.combinedEffects.highImpactCombinations;
    if (highImpact > 0) {
      recommendations.push({
        priority: 'high',
        category: 'scaling',
        action: `Scale ${highImpact} high-impact combination(s) to more pages`,
        rationale: 'Proven combinations showing excellent results',
        impact: 'Maximize ROI from successful patterns'
      });
    }
  }

  // Check overall health
  if (healthScore < 60) {
    recommendations.push({
      priority: 'critical',
      category: 'system-health',
      action: 'Conduct comprehensive system review and optimization',
      rationale: `Cycle health score is ${healthScore}/100 (below 60)`,
      impact: 'System effectiveness may be degraded'
    });
  }

  // Always recommend next cycle
  recommendations.push({
    priority: 'medium',
    category: 'continuation',
    action: 'Schedule next maintenance cycle',
    rationale: 'Continuous optimization requires regular cycles',
    impact: 'Maintain improvement momentum'
  });

  return recommendations;
}

/**
 * Update maintenance log
 */
function updateMaintenanceLog(log, cycleData) {
  log.cycles.push(cycleData);
  log.totalCycles++;

  if (cycleData.status === 'excellent' || cycleData.status === 'good') {
    log.successfulCycles++;
  } else {
    log.failedCycles++;
  }

  log.lastCycle = cycleData.timestamp;

  if (cycleData.results.patternApplications) {
    log.totalImpact += cycleData.results.patternApplications.totalExpectedImpact || 0;
  }

  log.lastUpdated = new Date().toISOString();

  // Keep only last 50 cycles in detail
  if (log.cycles.length > 50) {
    log.cycles = log.cycles.slice(-50);
  }

  fs.writeFileSync(MAINTENANCE_LOG, JSON.stringify(log, null, 2), 'utf8');
}

/**
 * Generate maintenance report
 */
function generateMaintenanceReport(log, cycleData) {
  let report = '# Quality Maintenance Cycle Report\n\n';
  report += `**Generated:** ${cycleData.timestamp}\n`;
  report += `**Cycle Number:** ${log.totalCycles}\n`;
  report += `**Cycle Status:** ${cycleData.status.toUpperCase()}\n`;
  report += `**Health Score:** ${cycleData.healthScore}/100\n\n`;

  report += '## Cycle Summary\n\n';
  report += `- **Duration:** ${(cycleData.duration / 1000).toFixed(1)}s\n`;
  report += `- **Steps Executed:** ${Object.keys(cycleData.steps).length}\n`;
  report += `- **Successful Steps:** ${Object.values(cycleData.steps).filter(s => s.success).length}\n`;
  report += `- **Failed Steps:** ${Object.values(cycleData.steps).filter(s => !s.success).length}\n\n`;

  report += '## Step Results\n\n';
  for (const [step, result] of Object.entries(cycleData.steps)) {
    const emoji = result.success ? '✅' : '❌';
    report += `### ${emoji} ${step}\n\n`;
    report += `- **Status:** ${result.success ? 'Success' : 'Failed'}\n`;
    report += `- **Duration:** ${(result.duration / 1000).toFixed(1)}s\n`;

    if (!result.success && result.error) {
      report += `- **Error:** ${result.error}\n`;
    }

    report += '\n';
  }

  report += '## Cycle Results\n\n';

  if (cycleData.results.uxAnalysis) {
    report += '### UX Analysis\n\n';
    const ux = cycleData.results.uxAnalysis;
    report += `- **Total Pages:** ${ux.totalPages}\n`;
    report += `- **Avg Quality Score:** ${ux.avgQualityScore}\n`;
    report += `- **Excellent Pages:** ${ux.excellentPages}\n`;
    report += `- **Needs Improvement:** ${ux.needsImprovementPages}\n\n`;
  }

  if (cycleData.results.patternApplications) {
    report += '### Pattern Applications\n\n';
    const apps = cycleData.results.patternApplications;
    report += `- **Successful:** ${apps.successfulApplications}\n`;
    report += `- **Failed:** ${apps.failedApplications}\n`;
    report += `- **Success Rate:** ${apps.successRate}%\n`;
    report += `- **Expected Impact:** +${apps.totalExpectedImpact} points\n\n`;
  }

  if (cycleData.results.combinedEffects) {
    report += '### Combined Pattern Effects\n\n';
    const combo = cycleData.results.combinedEffects;
    report += `- **Total Pages:** ${combo.totalPages}\n`;
    report += `- **Combined Patterns:** ${combo.combinedPatterns}\n`;
    report += `- **Single Patterns:** ${combo.singlePatterns}\n`;
    report += `- **High-Impact Combinations:** ${combo.highImpactCombinations}\n`;
    report += `- **Expected Impact:** +${combo.totalExpectedImpact} points\n\n`;
  }

  if (cycleData.results.iteration) {
    report += '### Iteration Results\n\n';
    const iter = cycleData.results.iteration;
    report += `- **Iteration:** #${iter.iterationNumber}\n`;
    report += `- **Pages Processed:** ${iter.pagesProcessed}\n`;
    report += `- **Pages Improved:** ${iter.improvedPages}\n`;
    report += `- **Total Impact:** +${iter.totalImpact} points\n\n`;
  }

  report += '## Health Assessment\n\n';
  report += `**Score:** ${cycleData.healthScore}/100\n\n`;
  report += `**Status:** ${cycleData.status.toUpperCase()}\n\n`;

  const statusMessages = {
    'excellent': '🌟 Outstanding performance! All systems optimal.',
    'good': '✅ Good performance. System running well.',
    'fair': '⚠️ Fair performance. Some areas need attention.',
    'needs-improvement': '⚠️ Performance below expectations. Review needed.',
    'critical': '🚨 Critical issues detected. Immediate action required.'
  };

  report += `${statusMessages[cycleData.status]}\n\n`;

  report += '## Recommendations\n\n';
  for (const rec of cycleData.recommendations) {
    const priorityEmoji = rec.priority === 'critical' ? '🔴' :
                         rec.priority === 'high' ? '🟡' : '🟢';

    report += `### ${priorityEmoji} [${rec.priority.toUpperCase()}] ${rec.action}\n\n`;
    report += `- **Category:** ${rec.category}\n`;
    report += `- **Rationale:** ${rec.rationale}\n`;
    report += `- **Impact:** ${rec.impact}\n\n`;
  }

  report += '## Historical Trends\n\n';
  report += `- **Total Cycles:** ${log.totalCycles}\n`;
  report += `- **Successful Cycles:** ${log.successfulCycles}\n`;
  report += `- **Failed Cycles:** ${log.failedCycles}\n`;
  report += `- **Success Rate:** ${log.totalCycles > 0 ? ((log.successfulCycles / log.totalCycles) * 100).toFixed(1) : 0}%\n`;
  report += `- **Total Impact Generated:** +${log.totalImpact} points\n\n`;

  report += '## Next Steps\n\n';
  report += '1. Review recommendations above\n';
  report += '2. Address any critical or high-priority issues\n';
  report += '3. Monitor pattern effectiveness over 24-48 hours\n';
  report += '4. Schedule next maintenance cycle\n';
  report += '5. Continue continuous optimization loop\n\n';

  report += '---\n\n';
  report += '*This report is automatically generated by the Quality Maintenance Cycle system.*\n';

  fs.writeFileSync(MAINTENANCE_REPORT, report, 'utf8');
}

/**
 * Display cycle summary
 */
function displayCycleSummary(cycleData, log) {
  console.log('\n\n╔════════════════════════════════════════════╗');
  console.log('║   QUALITY MAINTENANCE CYCLE SUMMARY        ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log(`Cycle: #${log.totalCycles}`);
  console.log(`Status: ${cycleData.status.toUpperCase()}`);
  console.log(`Health Score: ${cycleData.healthScore}/100`);
  console.log(`Duration: ${(cycleData.duration / 1000).toFixed(1)}s\n`);

  console.log('Steps Executed:');
  for (const [step, result] of Object.entries(cycleData.steps)) {
    const emoji = result.success ? '✅' : '❌';
    console.log(`  ${emoji} ${step} (${(result.duration / 1000).toFixed(1)}s)`);
  }

  console.log('\nImpact Summary:');
  if (cycleData.results.patternApplications) {
    console.log(`  Pattern Applications: ${cycleData.results.patternApplications.successfulApplications} successful`);
    console.log(`  Expected Impact: +${cycleData.results.patternApplications.totalExpectedImpact} points`);
  }

  if (cycleData.results.combinedEffects) {
    console.log(`  Combined Patterns: ${cycleData.results.combinedEffects.combinedPatterns} pages`);
    console.log(`  High-Impact Combos: ${cycleData.results.combinedEffects.highImpactCombinations}`);
  }

  console.log('\nHistorical Performance:');
  console.log(`  Total Cycles: ${log.totalCycles}`);
  console.log(`  Success Rate: ${log.totalCycles > 0 ? ((log.successfulCycles / log.totalCycles) * 100).toFixed(1) : 0}%`);
  console.log(`  Total Impact: +${log.totalImpact} points`);

  console.log(`\n📄 Detailed report: ${MAINTENANCE_REPORT}\n`);
}

/**
 * Main execution
 */
function main() {
  const cycleStartTime = Date.now();

  // Load maintenance log
  const log = loadMaintenanceLog();

  console.log('🔄 Starting Quality Maintenance Cycle...\n');
  console.log(`Previous cycles: ${log.totalCycles}`);
  console.log(`Last cycle: ${log.lastCycle || 'Never'}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Execute maintenance steps
  const stepResults = {
    'UX Analysis': runUXAnalysis(),
    'Pattern Combination Testing': testPatternCombinations(),
    'Pattern Application': executePatternApplications(),
    'Combined Effects Monitoring': monitorCombinedEffects(),
    'Next Iteration Planning': runNextIteration()
  };

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Collect cycle results
  console.log('📊 Collecting cycle results...\n');
  const cycleResults = collectCycleResults();

  // Calculate health score
  const healthScore = calculateCycleHealth(stepResults, cycleResults);
  const status = determineCycleStatus(healthScore);

  // Generate recommendations
  const recommendations = generateCycleRecommendations(stepResults, cycleResults, healthScore);

  // Compile cycle data
  const cycleDuration = Date.now() - cycleStartTime;
  const cycleData = {
    timestamp: new Date().toISOString(),
    cycleNumber: log.totalCycles + 1,
    duration: cycleDuration,
    steps: stepResults,
    results: cycleResults,
    healthScore,
    status,
    recommendations
  };

  // Update maintenance log
  updateMaintenanceLog(log, cycleData);
  console.log(`💾 Maintenance log updated: ${MAINTENANCE_LOG}\n`);

  // Generate report
  generateMaintenanceReport(log, cycleData);
  console.log(`📄 Maintenance report generated: ${MAINTENANCE_REPORT}\n`);

  // Display summary
  displayCycleSummary(cycleData, log);

  console.log('✨ Quality Maintenance Cycle Complete!\n');

  // Exit with appropriate code
  const hasFailures = Object.values(stepResults).some(r => !r.success);
  process.exit(hasFailures ? 1 : 0);
}

// Run main
main();
