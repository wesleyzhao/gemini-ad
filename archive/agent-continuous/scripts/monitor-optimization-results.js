#!/usr/bin/env node

/**
 * Optimization Results Monitoring and Parameter Refinement
 *
 * Monitors iterative optimization cycle results and intelligently refines
 * cycle parameters based on observed performance patterns.
 *
 * Key Features:
 * - Analyzes cycle performance trends
 * - Identifies bottlenecks and inefficiencies
 * - Recommends parameter adjustments
 * - Automatically tunes optimization settings
 * - Tracks ROI and effectiveness metrics
 * - Generates actionable insights
 *
 * Monitored Metrics:
 * - Cycle success rate
 * - Performance improvement velocity
 * - Pattern effectiveness
 * - Test creation efficiency
 * - Scaling success rate
 * - Learning accumulation rate
 *
 * Parameter Refinement:
 * - Adjusts confidence thresholds based on pattern performance
 * - Tunes test creation frequency based on available opportunities
 * - Optimizes cycle duration based on data collection needs
 * - Scales concurrent test limits based on capacity
 *
 * Usage:
 *   node scripts/monitor-optimization-results.js
 *   node scripts/monitor-optimization-results.js --refine
 *   node scripts/monitor-optimization-results.js --auto-tune
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  paths: {
    cycleHistory: './reports/optimization/cycle-history.json',
    performanceBaseline: './reports/optimization/performance-baseline.json',
    learnings: './reports/optimization/learnings.json',
    optimizationCycle: './scripts/iterative-optimization-cycle.js',
    monitoringReport: './reports/optimization/monitoring-report.md',
    parameterRecommendations: './reports/optimization/parameter-recommendations.json',
    refinementHistory: './reports/optimization/refinement-history.json'
  },
  thresholds: {
    minSuccessRate: 0.80,           // 80% cycle success rate
    targetVelocity: 2.0,            // 2 points per cycle target
    minPatternEffectiveness: 0.75,  // 75% pattern success
    maxStagnationCycles: 3,         // Alert if no improvement for 3 cycles
    confidenceRange: [0.90, 0.99],  // Min/max confidence thresholds
    improvementRange: [0.03, 0.10]  // 3-10% improvement range
  },
  analysis: {
    lookbackPeriod: 10,  // Analyze last 10 cycles
    trendWindow: 5       // Use last 5 cycles for trends
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  refine: args.includes('--refine'),
  autoTune: args.includes('--auto-tune'),
  verbose: args.includes('--verbose'),
  dryRun: args.includes('--dry-run')
};

/**
 * Load JSON file safely
 */
function loadJSON(filePath, defaultValue = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return defaultValue;
  }
}

/**
 * Save JSON file safely
 */
function saveJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Analyze cycle performance trends
 */
function analyzeCycleTrends(cycles) {
  if (!cycles || cycles.length === 0) {
    return {
      totalCycles: 0,
      successRate: 0,
      avgImprovement: 0,
      velocity: 0,
      trend: 'insufficient-data'
    };
  }

  const successfulCycles = cycles.filter(c => c.success);
  const successRate = successfulCycles.length / cycles.length;

  // Calculate improvement metrics
  const improvements = cycles
    .filter(c => c.scoreChange !== undefined)
    .map(c => c.scoreChange);

  const avgImprovement = improvements.length > 0
    ? improvements.reduce((sum, val) => sum + val, 0) / improvements.length
    : 0;

  // Calculate velocity (points per cycle)
  const velocity = avgImprovement;

  // Determine trend
  const recentCycles = cycles.slice(-CONFIG.analysis.trendWindow);
  const recentImprovements = recentCycles
    .filter(c => c.scoreChange !== undefined)
    .map(c => c.scoreChange);

  let trend = 'stable';
  if (recentImprovements.length >= 2) {
    const recentAvg = recentImprovements.reduce((sum, val) => sum + val, 0) / recentImprovements.length;
    if (recentAvg > avgImprovement * 1.2) {
      trend = 'accelerating';
    } else if (recentAvg < avgImprovement * 0.8) {
      trend = 'decelerating';
    }
  }

  // Check for stagnation
  const lastNImprovements = improvements.slice(-CONFIG.thresholds.maxStagnationCycles);
  const isStagnant = lastNImprovements.every(imp => Math.abs(imp) < 1);

  return {
    totalCycles: cycles.length,
    successfulCycles: successfulCycles.length,
    successRate,
    avgImprovement,
    velocity,
    trend,
    isStagnant,
    recentImprovements
  };
}

/**
 * Analyze pattern effectiveness
 */
function analyzePatternEffectiveness(learnings) {
  if (!learnings || !learnings.patterns) {
    return {
      totalPatterns: 0,
      avgSuccessRate: 0,
      avgImpact: 0,
      topPatterns: []
    };
  }

  const patterns = learnings.patterns;
  const totalPatterns = patterns.length;

  if (totalPatterns === 0) {
    return {
      totalPatterns: 0,
      avgSuccessRate: 0,
      avgImpact: 0,
      topPatterns: []
    };
  }

  const avgSuccessRate = patterns.reduce((sum, p) => sum + p.successRate, 0) / totalPatterns;
  const avgImpact = patterns.reduce((sum, p) => sum + p.avgImpact, 0) / totalPatterns;

  // Identify top performing patterns
  const topPatterns = patterns
    .sort((a, b) => (b.successRate * b.avgImpact) - (a.successRate * a.avgImpact))
    .slice(0, 3)
    .map(p => ({
      name: p.name,
      successRate: p.successRate,
      avgImpact: p.avgImpact,
      applications: p.applications,
      score: p.successRate * p.avgImpact
    }));

  return {
    totalPatterns,
    avgSuccessRate,
    avgImpact,
    topPatterns
  };
}

/**
 * Analyze learning accumulation
 */
function analyzeLearningAccumulation(learnings) {
  if (!learnings) {
    return {
      totalInsights: 0,
      recentInsights: 0,
      bestPractices: 0,
      learningRate: 0
    };
  }

  const totalInsights = learnings.insights?.length || 0;
  const bestPractices = learnings.bestPractices?.length || 0;

  // Calculate recent learning rate (insights in last 7 days)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const recentInsights = learnings.insights?.filter(i =>
    new Date(i.timestamp).getTime() > sevenDaysAgo
  ).length || 0;

  const learningRate = totalInsights > 0 ? recentInsights / 7 : 0;

  return {
    totalInsights,
    recentInsights,
    bestPractices,
    learningRate: learningRate.toFixed(2)
  };
}

/**
 * Generate parameter recommendations
 */
function generateParameterRecommendations(analysis) {
  const recommendations = [];
  const currentConfig = {
    minConfidence: 0.95,
    minImprovement: 0.05,
    maxActiveTests: 5,
    minCycleDuration: 7
  };

  // Adjust confidence threshold based on pattern effectiveness
  if (analysis.patterns.avgSuccessRate > 0.85) {
    recommendations.push({
      parameter: 'minConfidence',
      current: 0.95,
      recommended: 0.93,
      reason: 'High pattern success rate allows slightly lower confidence threshold',
      impact: 'More patterns will qualify for scaling, increasing iteration speed'
    });
  } else if (analysis.patterns.avgSuccessRate < 0.70) {
    recommendations.push({
      parameter: 'minConfidence',
      current: 0.95,
      recommended: 0.97,
      reason: 'Lower pattern success rate requires higher confidence for safety',
      impact: 'Reduces risk of scaling ineffective patterns'
    });
  }

  // Adjust improvement threshold based on velocity
  if (analysis.trends.velocity > CONFIG.thresholds.targetVelocity * 1.5) {
    recommendations.push({
      parameter: 'minImprovement',
      current: 0.05,
      recommended: 0.07,
      reason: 'High velocity allows raising the bar for what counts as improvement',
      impact: 'Focuses on higher-impact optimizations'
    });
  } else if (analysis.trends.velocity < CONFIG.thresholds.targetVelocity * 0.5) {
    recommendations.push({
      parameter: 'minImprovement',
      current: 0.05,
      recommended: 0.03,
      reason: 'Lower velocity suggests need for more incremental improvements',
      impact: 'Enables more patterns to qualify, increasing opportunities'
    });
  }

  // Adjust test capacity based on opportunity identification
  if (analysis.trends.trend === 'accelerating') {
    recommendations.push({
      parameter: 'maxActiveTests',
      current: 5,
      recommended: 7,
      reason: 'Accelerating improvements suggest capacity for more concurrent tests',
      impact: 'Increases parallel testing capacity'
    });
  }

  // Adjust cycle duration based on data collection needs
  if (analysis.trends.successRate > 0.90) {
    recommendations.push({
      parameter: 'minCycleDuration',
      current: 7,
      recommended: 5,
      reason: 'High success rate allows shorter cycles for faster iteration',
      impact: 'Reduces time between optimization cycles'
    });
  }

  // Alert on stagnation
  if (analysis.trends.isStagnant) {
    recommendations.push({
      parameter: 'strategy',
      current: 'incremental',
      recommended: 'exploratory',
      reason: 'Stagnation detected - need to explore new pattern categories',
      impact: 'Shifts focus to discovering new optimization opportunities',
      action: 'Run create-ab-test-variations.js with --explore flag'
    });
  }

  return recommendations;
}

/**
 * Apply parameter refinements
 */
function applyParameterRefinements(recommendations) {
  if (options.dryRun) {
    console.log('\n🔍 DRY RUN: Would apply the following refinements:\n');
    recommendations.forEach(rec => {
      console.log(`  ${rec.parameter}: ${rec.current} → ${rec.recommended}`);
      console.log(`  Reason: ${rec.reason}\n`);
    });
    return false;
  }

  // Read current configuration
  const scriptPath = CONFIG.paths.optimizationCycle;
  let scriptContent = fs.readFileSync(scriptPath, 'utf8');

  let modified = false;
  recommendations.forEach(rec => {
    if (rec.parameter === 'strategy') {
      // Strategic recommendation, not a code change
      return;
    }

    // Find and replace parameter values
    const patterns = {
      minConfidence: /minConfidence:\s*[\d.]+/,
      minImprovement: /minImprovement:\s*[\d.]+/,
      maxActiveTests: /maxActivetests:\s*\d+/,
      minCycleDuration: /minCycleDuration:\s*\d+/
    };

    const pattern = patterns[rec.parameter];
    if (pattern && pattern.test(scriptContent)) {
      const replacement = rec.parameter === 'maxActiveTests'
        ? `maxActivetests: ${rec.recommended}`
        : `${rec.parameter}: ${rec.recommended}`;

      scriptContent = scriptContent.replace(pattern, replacement);
      modified = true;
      console.log(`✅ Updated ${rec.parameter}: ${rec.current} → ${rec.recommended}`);
    }
  });

  if (modified && !options.dryRun) {
    fs.writeFileSync(scriptPath, scriptContent);
    console.log('\n✅ Parameter refinements applied successfully');
    return true;
  }

  return false;
}

/**
 * Generate monitoring report
 */
function generateMonitoringReport(analysis, recommendations) {
  const timestamp = new Date().toISOString();
  const date = new Date().toLocaleDateString();

  let report = `# Optimization Results Monitoring Report

**Generated:** ${date}
**Analysis Period:** Last ${analysis.trends.totalCycles} cycle(s)

## Executive Summary

`;

  // Performance summary
  const baseline = analysis.baseline;
  const current = baseline.currentScore;
  const target = baseline.targetScore;
  const progress = ((current - baseline.initialScore) / (target - baseline.initialScore) * 100).toFixed(1);

  report += `### Performance Overview

- **Current Score:** ${current} / ${target}
- **Progress:** ${progress}%
- **Total Improvement:** +${(current - baseline.initialScore).toFixed(1)} points
- **Cycles Completed:** ${analysis.trends.totalCycles}
- **Success Rate:** ${(analysis.trends.successRate * 100).toFixed(1)}%

`;

  // Trend analysis
  const trendEmoji = {
    'accelerating': '📈',
    'stable': '➡️',
    'decelerating': '📉',
    'insufficient-data': '❓'
  };

  report += `### Trend Analysis

- **Velocity:** ${analysis.trends.velocity.toFixed(2)} points/cycle
- **Trend:** ${trendEmoji[analysis.trends.trend]} ${analysis.trends.trend}
- **Status:** ${analysis.trends.isStagnant ? '⚠️ Stagnant' : '✅ Active improvement'}

`;

  // Pattern effectiveness
  report += `### Pattern Effectiveness

- **Total Patterns:** ${analysis.patterns.totalPatterns}
- **Average Success Rate:** ${(analysis.patterns.avgSuccessRate * 100).toFixed(1)}%
- **Average Impact:** ${analysis.patterns.avgImpact.toFixed(1)}%

`;

  if (analysis.patterns.topPatterns.length > 0) {
    report += `#### Top Performing Patterns

`;
    analysis.patterns.topPatterns.forEach((pattern, idx) => {
      report += `${idx + 1}. **${pattern.name}**
   - Success Rate: ${(pattern.successRate * 100).toFixed(1)}%
   - Avg Impact: ${pattern.avgImpact.toFixed(1)}%
   - Applications: ${pattern.applications}
   - Performance Score: ${pattern.score.toFixed(2)}

`;
    });
  }

  // Learning accumulation
  report += `### Learning Accumulation

- **Total Insights:** ${analysis.learning.totalInsights}
- **Recent Insights (7 days):** ${analysis.learning.recentInsights}
- **Best Practices:** ${analysis.learning.bestPractices}
- **Learning Rate:** ${analysis.learning.learningRate} insights/day

`;

  // Recommendations
  if (recommendations.length > 0) {
    report += `## Parameter Recommendations

`;
    recommendations.forEach((rec, idx) => {
      report += `### ${idx + 1}. ${rec.parameter}

- **Current:** ${rec.current}
- **Recommended:** ${rec.recommended}
- **Reason:** ${rec.reason}
- **Expected Impact:** ${rec.impact}
`;
      if (rec.action) {
        report += `- **Action Required:** ${rec.action}
`;
      }
      report += `
`;
    });
  } else {
    report += `## Parameter Recommendations

✅ Current parameters are optimal. No adjustments recommended at this time.

`;
  }

  // Health indicators
  report += `## System Health Indicators

`;

  const health = {
    successRate: analysis.trends.successRate >= CONFIG.thresholds.minSuccessRate ? '✅' : '⚠️',
    velocity: analysis.trends.velocity >= CONFIG.thresholds.targetVelocity ? '✅' : '⚠️',
    patternEffectiveness: analysis.patterns.avgSuccessRate >= CONFIG.thresholds.minPatternEffectiveness ? '✅' : '⚠️',
    stagnation: !analysis.trends.isStagnant ? '✅' : '⚠️'
  };

  report += `- ${health.successRate} **Cycle Success Rate:** ${(analysis.trends.successRate * 100).toFixed(1)}% (Target: ${CONFIG.thresholds.minSuccessRate * 100}%)
- ${health.velocity} **Improvement Velocity:** ${analysis.trends.velocity.toFixed(2)} pts/cycle (Target: ${CONFIG.thresholds.targetVelocity})
- ${health.patternEffectiveness} **Pattern Effectiveness:** ${(analysis.patterns.avgSuccessRate * 100).toFixed(1)}% (Target: ${CONFIG.thresholds.minPatternEffectiveness * 100}%)
- ${health.stagnation} **System Activity:** ${analysis.trends.isStagnant ? 'Stagnant' : 'Active'}

`;

  // Next steps
  report += `## Recommended Next Steps

`;

  if (recommendations.length > 0) {
    report += `1. Review and approve parameter recommendations above
2. ${options.autoTune ? 'Parameters will be auto-applied' : 'Run with --refine flag to apply recommendations'}
3. Continue monitoring next ${CONFIG.analysis.trendWindow} cycles for impact
4. Adjust strategy if stagnation persists

`;
  } else {
    report += `1. Continue current optimization cycles
2. Monitor for trend changes
3. Review again after ${CONFIG.analysis.trendWindow} more cycles

`;
  }

  report += `---

*Generated by Optimization Results Monitoring System*
*Last updated: ${timestamp}*
`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Optimization Results Monitoring and Parameter Refinement\n');

  // Load data
  console.log('📊 Loading optimization data...');
  const cycleHistory = loadJSON(CONFIG.paths.cycleHistory, { cycles: [] });
  const baseline = loadJSON(CONFIG.paths.performanceBaseline, {
    initialScore: 75,
    currentScore: 75,
    targetScore: 95
  });
  const learnings = loadJSON(CONFIG.paths.learnings, {
    patterns: [],
    insights: [],
    bestPractices: []
  });

  // Analyze trends
  console.log('📈 Analyzing performance trends...');
  const trends = analyzeCycleTrends(cycleHistory.cycles);

  // Analyze patterns
  console.log('🎯 Analyzing pattern effectiveness...');
  const patterns = analyzePatternEffectiveness(learnings);

  // Analyze learning
  console.log('📚 Analyzing learning accumulation...');
  const learning = analyzeLearningAccumulation(learnings);

  // Compile analysis
  const analysis = {
    baseline,
    trends,
    patterns,
    learning,
    timestamp: new Date().toISOString()
  };

  // Generate recommendations
  console.log('💡 Generating parameter recommendations...');
  const recommendations = generateParameterRecommendations(analysis);

  // Generate report
  console.log('📝 Generating monitoring report...');
  const report = generateMonitoringReport(analysis, recommendations);
  saveJSON(CONFIG.paths.monitoringReport.replace('.md', '.json'), analysis);
  fs.writeFileSync(CONFIG.paths.monitoringReport, report);

  // Save recommendations
  if (recommendations.length > 0) {
    const recommendationsData = {
      timestamp: new Date().toISOString(),
      recommendations,
      analysis: {
        trends: trends,
        patterns: patterns,
        learning: learning
      }
    };
    saveJSON(CONFIG.paths.parameterRecommendations, recommendationsData);
  }

  // Apply refinements if requested
  if (options.refine || options.autoTune) {
    if (recommendations.length > 0) {
      console.log('\n🔧 Applying parameter refinements...');
      const applied = applyParameterRefinements(recommendations);

      if (applied) {
        // Save refinement history
        const refinementHistory = loadJSON(CONFIG.paths.refinementHistory, { refinements: [] });
        refinementHistory.refinements.push({
          timestamp: new Date().toISOString(),
          recommendations,
          applied: true,
          analysis
        });
        saveJSON(CONFIG.paths.refinementHistory, refinementHistory);
      }
    } else {
      console.log('\n✅ No parameter refinements needed at this time');
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('MONITORING SUMMARY');
  console.log('='.repeat(80));
  console.log(`\nPerformance: ${baseline.currentScore}/${baseline.targetScore} (${((baseline.currentScore - baseline.initialScore) / (baseline.targetScore - baseline.initialScore) * 100).toFixed(1)}%)`);
  console.log(`Cycles: ${trends.totalCycles} (${(trends.successRate * 100).toFixed(1)}% success rate)`);
  console.log(`Velocity: ${trends.velocity.toFixed(2)} points/cycle`);
  console.log(`Trend: ${trends.trend}`);
  console.log(`Patterns: ${patterns.totalPatterns} (${(patterns.avgSuccessRate * 100).toFixed(1)}% effective)`);
  console.log(`Learning: ${learning.totalInsights} insights, ${learning.bestPractices} best practices`);
  console.log(`\nRecommendations: ${recommendations.length}`);

  if (recommendations.length > 0) {
    console.log('\nTop Recommendations:');
    recommendations.slice(0, 3).forEach((rec, idx) => {
      console.log(`  ${idx + 1}. ${rec.parameter}: ${rec.current} → ${rec.recommended}`);
    });
  }

  console.log(`\n📄 Full report: ${CONFIG.paths.monitoringReport}`);

  if (recommendations.length > 0 && !options.refine && !options.autoTune) {
    console.log(`\n💡 Run with --refine to apply recommendations`);
  }

  console.log('\n✅ Monitoring complete\n');
}

// Run main function
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
