#!/usr/bin/env node

/**
 * Strategy Effectiveness Validator
 *
 * Feature #58: Validates that the optimized iteration strategy is working as expected
 * and provides refinements based on emerging patterns.
 *
 * What this does:
 * - Validates strategy recommendations are being followed
 * - Measures actual vs expected impact
 * - Identifies emerging patterns that need attention
 * - Provides refined recommendations based on validation
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function analyzeStrategyAdherence(trendData, strategyData) {
  log('\n📋 Analyzing Strategy Adherence...', 'cyan');

  const snapshots = trendData.snapshots || [];
  if (snapshots.length < 2) {
    return {
      status: 'insufficient_data',
      message: 'Need at least 2 snapshots to validate adherence',
      adherence: null
    };
  }

  // Get current recommended strategy
  const currentStrategy = snapshots[snapshots.length - 1].strategy;

  // Count how many snapshots follow the current recommended strategy
  let adherenceCount = 0;
  const recentSnapshots = snapshots.slice(-5); // Last 5 snapshots

  recentSnapshots.forEach(snapshot => {
    if (snapshot.strategy.frequency === currentStrategy.frequency &&
        snapshot.strategy.scope === currentStrategy.scope &&
        snapshot.strategy.focus === currentStrategy.focus) {
      adherenceCount++;
    }
  });

  const adherenceRate = (adherenceCount / recentSnapshots.length) * 100;

  return {
    status: 'analyzed',
    currentStrategy: currentStrategy,
    adherenceRate: adherenceRate,
    recentSnapshots: recentSnapshots.length,
    message: `Strategy adherence: ${adherenceRate.toFixed(1)}% (${adherenceCount}/${recentSnapshots.length} snapshots)`,
    recommendation: adherenceRate < 80
      ? 'Low adherence. Consider revisiting strategy or updating it based on new insights.'
      : 'Good adherence. Strategy is being followed consistently.'
  };
}

function analyzeActualVsExpectedImpact(strategyData, trendData, uxData) {
  log('\n📊 Analyzing Actual vs Expected Impact...', 'cyan');

  const analysis = strategyData.analysis;
  const expectedImpact = analysis.strategyRecommendations.expectedImpact;

  // Get actual quality improvement from UX data
  const snapshots = trendData.snapshots || [];
  if (snapshots.length < 2) {
    return {
      status: 'insufficient_data',
      message: 'Need at least 2 snapshots to measure actual impact'
    };
  }

  // Calculate actual improvement
  const firstSnapshot = snapshots[0];
  const latestSnapshot = snapshots[snapshots.length - 1];

  // Parse saturation percentages
  const firstSaturation = parseFloat(firstSnapshot.saturation) || 0;
  const latestSaturation = parseFloat(latestSnapshot.saturation) || 0;
  const saturationGain = latestSaturation - firstSaturation;

  // Estimate actual quality points gained
  // If saturation increased, quality improved
  const estimatedActualGain = saturationGain * 10; // Rough conversion

  return {
    status: 'analyzed',
    expected: expectedImpact,
    actual: {
      saturationGain: saturationGain.toFixed(1) + '%',
      estimatedQualityGain: estimatedActualGain.toFixed(1)
    },
    message: `Saturation increased by ${saturationGain.toFixed(1)}% across ${snapshots.length} snapshots`,
    assessment: saturationGain > 5
      ? 'Exceeding expectations - continue current strategy'
      : saturationGain > 0
        ? 'On track - maintain steady progress'
        : 'Below expectations - investigate bottlenecks'
  };
}

function identifyEmergingPatterns(strategyData, trendData) {
  log('\n🔍 Identifying Emerging Patterns...', 'cyan');

  const snapshots = trendData.snapshots || [];
  if (snapshots.length < 3) {
    return {
      status: 'insufficient_data',
      message: 'Need at least 3 snapshots to identify patterns'
    };
  }

  // Analyze velocity consistency
  const velocities = snapshots.map(s => s.velocity);
  const velocityPattern = {
    stable: velocities.filter(v => v === 'stable').length,
    accelerating: velocities.filter(v => v === 'accelerating').length,
    decelerating: velocities.filter(v => v === 'decelerating').length
  };

  // Analyze effectiveness consistency
  const effectiveness = snapshots.map(s => s.effectiveness);
  const effectivenessPattern = {
    stable: effectiveness.filter(e => e === 'stable').length,
    improving: effectiveness.filter(e => e === 'improving').length,
    declining: effectiveness.filter(e => e === 'declining').length
  };

  // Analyze ROI consistency
  const rois = snapshots.map(s => s.roi);
  const roiPattern = {
    stable: rois.filter(r => r === 'stable').length,
    improving: rois.filter(r => r === 'improving').length,
    declining: rois.filter(r => r === 'declining').length
  };

  // Determine dominant patterns
  const patterns = {
    velocity: Object.keys(velocityPattern).reduce((a, b) =>
      velocityPattern[a] > velocityPattern[b] ? a : b
    ),
    effectiveness: Object.keys(effectivenessPattern).reduce((a, b) =>
      effectivenessPattern[a] > effectivenessPattern[b] ? a : b
    ),
    roi: Object.keys(roiPattern).reduce((a, b) =>
      roiPattern[a] > roiPattern[b] ? a : b
    )
  };

  // Generate insights
  const insights = [];

  if (patterns.velocity === 'stable' && patterns.effectiveness === 'stable' && patterns.roi === 'stable') {
    insights.push({
      type: 'consistency',
      severity: 'positive',
      message: 'System shows consistent stable performance - this is healthy and sustainable',
      action: 'Continue current approach while monitoring for any changes'
    });
  }

  if (patterns.velocity === 'decelerating') {
    insights.push({
      type: 'warning',
      severity: 'medium',
      message: 'Velocity is showing deceleration trend',
      action: 'Investigate: Are we running out of easy wins? Consider focusing on high-impact changes only.'
    });
  }

  if (patterns.effectiveness === 'declining') {
    insights.push({
      type: 'alert',
      severity: 'high',
      message: 'Effectiveness is declining - changes are having less impact',
      action: 'URGENT: Refocus on proven high-impact patterns. Avoid low-value changes.'
    });
  }

  if (patterns.roi === 'improving') {
    insights.push({
      type: 'opportunity',
      severity: 'positive',
      message: 'ROI is improving - getting more value per hour invested',
      action: 'Consider increasing iteration frequency to capitalize on improved efficiency'
    });
  }

  return {
    status: 'analyzed',
    patterns: patterns,
    rawData: {
      velocity: velocityPattern,
      effectiveness: effectivenessPattern,
      roi: roiPattern
    },
    insights: insights,
    message: `Identified ${insights.length} emerging pattern insights`
  };
}

function generateRefinedRecommendations(adherence, impact, patterns, strategyData) {
  log('\n💡 Generating Refined Recommendations...', 'cyan');

  const recommendations = [];
  const analysis = strategyData.analysis;

  // Recommendation 1: Strategy adherence
  if (adherence.status === 'analyzed') {
    if (adherence.adherenceRate < 80) {
      recommendations.push({
        category: 'Strategy Adherence',
        priority: 'high',
        recommendation: 'Strategy is not being followed consistently',
        action: 'Review why strategy keeps changing. Either commit to the strategy or update it based on new data.',
        rationale: `Only ${adherence.adherenceRate.toFixed(1)}% adherence in recent snapshots`
      });
    } else {
      recommendations.push({
        category: 'Strategy Adherence',
        priority: 'low',
        recommendation: 'Strategy is being followed well',
        action: 'Continue following current strategy',
        rationale: `${adherence.adherenceRate.toFixed(1)}% adherence indicates consistency`
      });
    }
  }

  // Recommendation 2: Impact vs expectations
  if (impact.status === 'analyzed') {
    if (impact.assessment.includes('Exceeding')) {
      recommendations.push({
        category: 'Performance',
        priority: 'opportunity',
        recommendation: 'Performance exceeds expectations',
        action: 'Consider increasing iteration frequency or scope to capitalize on momentum',
        rationale: impact.message
      });
    } else if (impact.assessment.includes('Below')) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        recommendation: 'Performance below expectations',
        action: 'Investigate bottlenecks. Consider reducing scope to focus on high-impact changes only.',
        rationale: impact.message
      });
    }
  }

  // Recommendation 3: Pattern insights
  if (patterns.status === 'analyzed' && patterns.insights.length > 0) {
    patterns.insights.forEach(insight => {
      recommendations.push({
        category: 'Pattern Insight',
        priority: insight.severity === 'high' ? 'high' : insight.severity === 'medium' ? 'medium' : 'low',
        recommendation: insight.message,
        action: insight.action,
        rationale: `Dominant pattern: ${insight.type}`
      });
    });
  }

  // Recommendation 4: Saturation-based guidance
  const saturation = analysis.saturationAnalysis;
  if (saturation) {
    const satLevel = parseFloat(saturation.saturationLevel) || 0;

    if (satLevel < 50) {
      recommendations.push({
        category: 'Saturation',
        priority: 'medium',
        recommendation: 'Early stage optimization (< 50% saturation)',
        action: 'Focus on broad improvements across many pages. Quick wins still available.',
        rationale: `Current saturation: ${saturation.saturationLevel}%`
      });
    } else if (satLevel < 70) {
      recommendations.push({
        category: 'Saturation',
        priority: 'medium',
        recommendation: 'Mid-stage optimization (50-70% saturation)',
        action: 'Shift focus to low performers and proven patterns. Avoid diminishing returns.',
        rationale: `Current saturation: ${saturation.saturationLevel}%`
      });
    } else {
      recommendations.push({
        category: 'Saturation',
        priority: 'high',
        recommendation: 'High saturation (> 70%) - approaching ceiling',
        action: 'Transition to maintenance mode. Only high-impact changes. Monthly iterations sufficient.',
        rationale: `Current saturation: ${saturation.saturationLevel}%`
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 1, medium: 2, opportunity: 3, low: 4 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    recommendations: recommendations,
    count: recommendations.length,
    highPriority: recommendations.filter(r => r.priority === 'high').length,
    message: `Generated ${recommendations.length} refined recommendations (${recommendations.filter(r => r.priority === 'high').length} high priority)`
  };
}

function createValidationReport(results) {
  const timestamp = new Date().toLocaleDateString('en-US');

  let report = `# Strategy Effectiveness Validation Report\n\n`;
  report += `**Generated**: ${timestamp}\n\n`;
  report += `---\n\n`;

  // Executive Summary
  report += `## Executive Summary\n\n`;
  report += `**Status**: ${results.summary.status}\n`;
  report += `**Data Points**: ${results.summary.dataPoints}\n`;
  report += `**Key Finding**: ${results.summary.keyFinding}\n\n`;
  report += `---\n\n`;

  // Strategy Adherence
  if (results.adherence.status === 'analyzed') {
    report += `## 📋 Strategy Adherence\n\n`;
    report += `**Adherence Rate**: ${results.adherence.adherenceRate.toFixed(1)}%\n\n`;
    report += `**Current Strategy**:\n`;
    report += `- Frequency: ${results.adherence.currentStrategy.frequency}\n`;
    report += `- Scope: ${results.adherence.currentStrategy.scope}\n`;
    report += `- Focus: ${results.adherence.currentStrategy.focus}\n\n`;
    report += `**Assessment**: ${results.adherence.recommendation}\n\n`;
    report += `---\n\n`;
  }

  // Actual vs Expected Impact
  if (results.impact.status === 'analyzed') {
    report += `## 📊 Actual vs Expected Impact\n\n`;
    report += `**Expected Impact (Per Iteration)**:\n`;
    report += `- Quality Points: +${results.impact.expected.perIteration}\n`;
    report += `- 3 Months: +${results.impact.expected.threeMonth}\n`;
    report += `- 6 Months: +${results.impact.expected.sixMonth}\n\n`;
    report += `**Actual Performance**:\n`;
    report += `- Saturation Gain: ${results.impact.actual.saturationGain}\n`;
    report += `- Estimated Quality Gain: ${results.impact.actual.estimatedQualityGain}\n\n`;
    report += `**Assessment**: ${results.impact.assessment}\n\n`;
    report += `---\n\n`;
  }

  // Emerging Patterns
  if (results.patterns.status === 'analyzed') {
    report += `## 🔍 Emerging Patterns\n\n`;
    report += `**Dominant Patterns**:\n`;
    report += `- Velocity: ${results.patterns.patterns.velocity}\n`;
    report += `- Effectiveness: ${results.patterns.patterns.effectiveness}\n`;
    report += `- ROI: ${results.patterns.patterns.roi}\n\n`;

    if (results.patterns.insights.length > 0) {
      report += `**Insights**:\n\n`;
      results.patterns.insights.forEach((insight, i) => {
        report += `${i + 1}. **${insight.type}** (${insight.severity})\n`;
        report += `   - ${insight.message}\n`;
        report += `   - Action: ${insight.action}\n\n`;
      });
    }

    report += `---\n\n`;
  }

  // Refined Recommendations
  if (results.recommendations.count > 0) {
    report += `## 💡 Refined Recommendations\n\n`;

    const highPriority = results.recommendations.recommendations.filter(r => r.priority === 'high');
    const mediumPriority = results.recommendations.recommendations.filter(r => r.priority === 'medium');
    const lowPriority = results.recommendations.recommendations.filter(r =>
      r.priority === 'low' || r.priority === 'opportunity'
    );

    if (highPriority.length > 0) {
      report += `### 🔴 High Priority\n\n`;
      highPriority.forEach((rec, i) => {
        report += `**${i + 1}. ${rec.category}**: ${rec.recommendation}\n\n`;
        report += `- **Action**: ${rec.action}\n`;
        report += `- **Rationale**: ${rec.rationale}\n\n`;
      });
    }

    if (mediumPriority.length > 0) {
      report += `### 🟡 Medium Priority\n\n`;
      mediumPriority.forEach((rec, i) => {
        report += `**${i + 1}. ${rec.category}**: ${rec.recommendation}\n\n`;
        report += `- **Action**: ${rec.action}\n`;
        report += `- **Rationale**: ${rec.rationale}\n\n`;
      });
    }

    if (lowPriority.length > 0) {
      report += `### 🟢 Low Priority / Opportunities\n\n`;
      lowPriority.forEach((rec, i) => {
        report += `**${i + 1}. ${rec.category}**: ${rec.recommendation}\n\n`;
        report += `- **Action**: ${rec.action}\n`;
        report += `- **Rationale**: ${rec.rationale}\n\n`;
      });
    }

    report += `---\n\n`;
  }

  // Action Checklist
  report += `## ✅ Action Checklist\n\n`;
  report += `### Immediate Actions (Next 7 Days)\n\n`;

  const immediateActions = [];

  if (results.adherence.adherenceRate < 80) {
    immediateActions.push('- [ ] Review why strategy adherence is low');
    immediateActions.push('- [ ] Decide: commit to strategy or update based on new insights');
  }

  if (results.impact.assessment.includes('Below')) {
    immediateActions.push('- [ ] Investigate bottlenecks causing below-expected performance');
    immediateActions.push('- [ ] Identify 3-5 highest-impact changes to focus on');
  }

  if (results.patterns.insights.some(i => i.severity === 'high')) {
    immediateActions.push('- [ ] Address high-severity pattern insights');
  }

  if (immediateActions.length === 0) {
    immediateActions.push('- [ ] Monitor current trends');
    immediateActions.push('- [ ] Maintain current strategy');
  }

  report += immediateActions.join('\n') + '\n\n';

  report += `### Short-Term Actions (Next 2-4 Weeks)\n\n`;
  report += `- [ ] Execute recommended iteration strategy\n`;
  report += `- [ ] Track actual vs expected impact\n`;
  report += `- [ ] Re-validate strategy effectiveness\n\n`;

  report += `### Long-Term Goals (Next 1-3 Months)\n\n`;
  report += `- [ ] Achieve target saturation level (60-70%)\n`;
  report += `- [ ] Build library of 5+ proven patterns\n`;
  report += `- [ ] Transition to maintenance mode when appropriate\n\n`;

  report += `---\n\n`;
  report += `*Generated by Strategy Effectiveness Validator (Feature #58)*\n`;
  report += `*Validates iteration strategy and provides refined recommendations*\n`;

  return report;
}

function main() {
  log('🎯 Strategy Effectiveness Validation', 'bright');
  log('======================================================================\n', 'bright');

  const reportsDir = path.join(__dirname, '../reports/iterations');
  const uxDir = path.join(__dirname, '../reports/ux-analysis');

  // Load required data
  log('📂 Loading data...', 'cyan');
  const trendData = loadJSON(path.join(reportsDir, 'trend-data.json'));
  const strategyData = loadJSON(path.join(reportsDir, 'strategy-optimization.json'));

  // Find latest UX analysis
  const uxFiles = fs.readdirSync(uxDir).filter(f => f.startsWith('ux-analysis-'));
  const latestUxFile = uxFiles.sort().reverse()[0];
  const uxData = latestUxFile ? loadJSON(path.join(uxDir, latestUxFile)) : null;

  if (!trendData || !strategyData) {
    log('❌ Missing required data files', 'red');
    log('   Please run: node scripts/optimize-iteration-strategy.js', 'yellow');
    process.exit(1);
  }

  log('   ✓ Loaded trend data', 'green');
  log('   ✓ Loaded strategy data', 'green');
  if (uxData) log('   ✓ Loaded UX data', 'green');

  // Perform validation analyses
  const adherence = analyzeStrategyAdherence(trendData, strategyData);
  log(`   ✓ ${adherence.message}`, 'green');

  const impact = analyzeActualVsExpectedImpact(strategyData, trendData, uxData);
  if (impact.status === 'analyzed') {
    log(`   ✓ ${impact.message}`, 'green');
  }

  const patterns = identifyEmergingPatterns(strategyData, trendData);
  if (patterns.status === 'analyzed') {
    log(`   ✓ ${patterns.message}`, 'green');
  }

  const recommendations = generateRefinedRecommendations(adherence, impact, patterns, strategyData);
  log(`   ✓ ${recommendations.message}`, 'green');

  // Create results object
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      status: 'validated',
      dataPoints: trendData.snapshots.length,
      keyFinding: impact.assessment || 'Insufficient data for impact assessment'
    },
    adherence: adherence,
    impact: impact,
    patterns: patterns,
    recommendations: recommendations
  };

  // Save JSON report
  const jsonPath = path.join(reportsDir, 'strategy-validation.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  log(`\n💾 Saved JSON report to ${jsonPath}`, 'green');

  // Generate and save markdown report
  const mdReport = createValidationReport(results);
  const mdPath = path.join(reportsDir, 'strategy-validation.md');
  fs.writeFileSync(mdPath, mdReport);
  log(`📝 Saved markdown report to ${mdPath}`, 'green');

  // Print summary
  log('\n✅ Strategy Validation Complete!\n', 'bright');
  log('📊 Summary:', 'cyan');
  log(`   • Strategy Adherence: ${adherence.adherenceRate?.toFixed(1) || 'N/A'}%`, 'white');
  log(`   • Performance: ${impact.assessment || 'Insufficient data'}`, 'white');
  log(`   • Recommendations: ${recommendations.count} (${recommendations.highPriority} high priority)`, 'white');

  if (recommendations.highPriority > 0) {
    log('\n⚠️  High priority actions required! See strategy-validation.md', 'yellow');
  }

  log('\n📁 Reports generated:', 'cyan');
  log(`   - ${mdPath}`, 'white');
  log(`   - ${jsonPath}`, 'white');
}

main();
