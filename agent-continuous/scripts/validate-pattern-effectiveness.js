#!/usr/bin/env node

/**
 * Pattern Effectiveness Validation
 *
 * Validates pattern application effectiveness through before/after UX analysis.
 * Compares baseline UX scores with post-application scores to measure actual impact.
 *
 * Features:
 * - Before/after UX score comparison
 * - Actual vs. expected impact analysis
 * - Pattern success rate calculation
 * - Effectiveness rating (high/medium/low/negative)
 * - Detailed insights and recommendations
 * - Comprehensive reporting (JSON + Markdown)
 *
 * Usage:
 *   node scripts/validate-pattern-effectiveness.js
 *   node scripts/validate-pattern-effectiveness.js --pattern="Call to Action"
 *   node scripts/validate-pattern-effectiveness.js --page="writers.html"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  paths: {
    baseline: './reports/iterations/ux-analysis-baseline.json',
    current: './reports/iterations/ux-analysis-current.json',
    applications: './reports/iterations/pattern-application-results.json',
    applicationHistory: './reports/iterations/pattern-application-history.json',
    output: './reports/iterations/pattern-effectiveness-validation.json',
    report: './reports/iterations/pattern-effectiveness-report.md'
  },
  thresholds: {
    highEffectiveness: 10,  // >= 10 points is highly effective
    mediumEffectiveness: 5,  // 5-9 points is moderately effective
    lowEffectiveness: 1,     // 1-4 points is minimally effective
    // < 1 point is ineffective/negative
    accuracyHigh: 0.8,       // >= 80% of expected impact
    accuracyMedium: 0.5      // 50-79% of expected impact
  }
};

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Save JSON file
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
    console.error(`❌ Error saving ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Run UX analysis to get current scores
 */
function runUXAnalysis() {
  console.log('📊 Running UX analysis to get current scores...');

  const { execSync } = require('child_process');

  try {
    execSync('node scripts/analyze-ux-quality.js', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ UX analysis complete');
    return true;
  } catch (error) {
    console.error('❌ UX analysis failed:', error.message);
    return false;
  }
}

/**
 * Get UX score for a page
 */
function getUXScore(uxData, page) {
  if (!uxData || !uxData.pages) {
    return null;
  }

  const pageData = uxData.pages.find(p => p.page === page);
  return pageData ? pageData.score : null;
}

/**
 * Calculate actual impact
 */
function calculateActualImpact(beforeScore, afterScore) {
  if (beforeScore === null || afterScore === null) {
    return null;
  }
  return afterScore - beforeScore;
}

/**
 * Determine effectiveness rating
 */
function determineEffectiveness(actualImpact) {
  if (actualImpact === null) {
    return 'unknown';
  }

  if (actualImpact >= CONFIG.thresholds.highEffectiveness) {
    return 'high';
  } else if (actualImpact >= CONFIG.thresholds.mediumEffectiveness) {
    return 'medium';
  } else if (actualImpact >= CONFIG.thresholds.lowEffectiveness) {
    return 'low';
  } else {
    return 'negative';
  }
}

/**
 * Calculate accuracy (actual vs expected)
 */
function calculateAccuracy(actualImpact, expectedImpact) {
  if (actualImpact === null || expectedImpact === null || expectedImpact === 0) {
    return null;
  }

  return actualImpact / expectedImpact;
}

/**
 * Determine accuracy rating
 */
function determineAccuracyRating(accuracy) {
  if (accuracy === null) {
    return 'unknown';
  }

  if (accuracy >= CONFIG.thresholds.accuracyHigh) {
    return 'high';
  } else if (accuracy >= CONFIG.thresholds.accuracyMedium) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Validate pattern applications
 */
function validatePatternApplications(baseline, current, applications) {
  console.log('\n🔍 Validating pattern applications...\n');

  if (!applications || !applications.applications || applications.applications.length === 0) {
    console.log('⚠️  No pattern applications found to validate');
    return {
      validations: [],
      summary: {
        total: 0,
        successful: 0,
        failed: 0,
        avgActualImpact: 0,
        avgExpectedImpact: 0,
        avgAccuracy: 0
      }
    };
  }

  const validations = [];
  let totalActualImpact = 0;
  let totalExpectedImpact = 0;
  let totalAccuracy = 0;
  let validCount = 0;

  // Group applications by page
  const applicationsByPage = {};
  applications.applications.forEach(app => {
    if (!applicationsByPage[app.page]) {
      applicationsByPage[app.page] = [];
    }
    applicationsByPage[app.page].push(app);
  });

  // Validate each page
  for (const [page, pageApps] of Object.entries(applicationsByPage)) {
    const beforeScore = getUXScore(baseline, page);
    const afterScore = getUXScore(current, page);
    const actualImpact = calculateActualImpact(beforeScore, afterScore);

    // Calculate expected impact for this page (sum of all patterns)
    const expectedImpact = pageApps.reduce((sum, app) => sum + (app.expectedImpact || 0), 0);

    const accuracy = calculateAccuracy(actualImpact, expectedImpact);
    const effectiveness = determineEffectiveness(actualImpact);
    const accuracyRating = determineAccuracyRating(accuracy);

    // Determine success/failure
    const isSuccessful = effectiveness === 'high' || effectiveness === 'medium';

    validations.push({
      page,
      patterns: pageApps.map(app => app.pattern),
      patternCount: pageApps.length,
      beforeScore,
      afterScore,
      actualImpact,
      expectedImpact,
      accuracy: accuracy !== null ? parseFloat(accuracy.toFixed(2)) : null,
      effectiveness,
      accuracyRating,
      success: isSuccessful,
      insights: generateInsights(page, pageApps, beforeScore, afterScore, actualImpact, expectedImpact, accuracy, effectiveness)
    });

    // Track totals
    if (actualImpact !== null) {
      totalActualImpact += actualImpact;
      validCount++;
    }
    if (expectedImpact !== null) {
      totalExpectedImpact += expectedImpact;
    }
    if (accuracy !== null) {
      totalAccuracy += accuracy;
    }
  }

  // Calculate summary
  const successful = validations.filter(v => v.success).length;
  const failed = validations.filter(v => !v.success).length;

  return {
    validations,
    summary: {
      total: validations.length,
      successful,
      failed,
      successRate: validations.length > 0 ? (successful / validations.length) : 0,
      avgActualImpact: validCount > 0 ? totalActualImpact / validCount : 0,
      avgExpectedImpact: validations.length > 0 ? totalExpectedImpact / validations.length : 0,
      avgAccuracy: validCount > 0 ? totalAccuracy / validCount : 0,
      totalActualImpact,
      totalExpectedImpact,
      effectivenessDistribution: {
        high: validations.filter(v => v.effectiveness === 'high').length,
        medium: validations.filter(v => v.effectiveness === 'medium').length,
        low: validations.filter(v => v.effectiveness === 'low').length,
        negative: validations.filter(v => v.effectiveness === 'negative').length,
        unknown: validations.filter(v => v.effectiveness === 'unknown').length
      }
    }
  };
}

/**
 * Generate insights for a validation
 */
function generateInsights(page, patterns, beforeScore, afterScore, actualImpact, expectedImpact, accuracy, effectiveness) {
  const insights = [];

  // Effectiveness insights
  if (effectiveness === 'high') {
    insights.push(`✅ Highly effective: ${actualImpact >= 0 ? '+' : ''}${actualImpact.toFixed(1)} points improvement`);
  } else if (effectiveness === 'medium') {
    insights.push(`✓ Moderately effective: ${actualImpact >= 0 ? '+' : ''}${actualImpact.toFixed(1)} points improvement`);
  } else if (effectiveness === 'low') {
    insights.push(`⚠️  Minimal effectiveness: Only ${actualImpact >= 0 ? '+' : ''}${actualImpact.toFixed(1)} points improvement`);
  } else if (effectiveness === 'negative') {
    insights.push(`❌ Negative impact: ${actualImpact.toFixed(1)} points decrease`);
  }

  // Accuracy insights
  if (accuracy !== null) {
    const accuracyPercent = (accuracy * 100).toFixed(1);
    if (accuracy >= CONFIG.thresholds.accuracyHigh) {
      insights.push(`🎯 High accuracy: ${accuracyPercent}% of expected impact achieved`);
    } else if (accuracy >= CONFIG.thresholds.accuracyMedium) {
      insights.push(`📊 Medium accuracy: ${accuracyPercent}% of expected impact achieved`);
    } else {
      insights.push(`⚠️  Low accuracy: Only ${accuracyPercent}% of expected impact achieved`);
    }
  }

  // Pattern combination insights
  if (patterns.length > 1) {
    insights.push(`🔗 ${patterns.length} patterns applied in combination`);

    if (actualImpact > expectedImpact) {
      insights.push(`✨ Synergy detected: Actual impact exceeds expected by ${(actualImpact - expectedImpact).toFixed(1)} points`);
    } else if (actualImpact < expectedImpact * 0.5) {
      insights.push(`⚠️  Possible interference: Patterns may be conflicting`);
    }
  }

  return insights;
}

/**
 * Analyze pattern-level effectiveness
 */
function analyzePatternEffectiveness(validations) {
  const patternStats = {};

  validations.forEach(validation => {
    validation.patterns.forEach(pattern => {
      if (!patternStats[pattern]) {
        patternStats[pattern] = {
          applications: 0,
          successful: 0,
          totalActualImpact: 0,
          totalExpectedImpact: 0,
          avgActualImpact: 0,
          avgExpectedImpact: 0,
          successRate: 0,
          avgAccuracy: 0,
          effectiveness: 'unknown'
        };
      }

      patternStats[pattern].applications++;

      if (validation.success) {
        patternStats[pattern].successful++;
      }

      if (validation.actualImpact !== null) {
        // Distribute impact across patterns for this page
        const impactPerPattern = validation.actualImpact / validation.patternCount;
        patternStats[pattern].totalActualImpact += impactPerPattern;
      }

      if (validation.expectedImpact !== null) {
        const expectedPerPattern = validation.expectedImpact / validation.patternCount;
        patternStats[pattern].totalExpectedImpact += expectedPerPattern;
      }
    });
  });

  // Calculate averages and ratings
  for (const [pattern, stats] of Object.entries(patternStats)) {
    stats.avgActualImpact = stats.totalActualImpact / stats.applications;
    stats.avgExpectedImpact = stats.totalExpectedImpact / stats.applications;
    stats.successRate = stats.successful / stats.applications;
    stats.avgAccuracy = stats.avgExpectedImpact > 0 ? stats.avgActualImpact / stats.avgExpectedImpact : 0;
    stats.effectiveness = determineEffectiveness(stats.avgActualImpact);
  }

  return patternStats;
}

/**
 * Generate recommendations
 */
function generateRecommendations(validations, patternStats, summary) {
  const recommendations = [];

  // Overall performance
  if (summary.successRate >= 0.8) {
    recommendations.push({
      priority: 'high',
      category: 'scaling',
      action: 'Scale successful patterns to production',
      reason: `${(summary.successRate * 100).toFixed(1)}% success rate indicates high reliability`,
      impact: 'high'
    });
  } else if (summary.successRate < 0.5) {
    recommendations.push({
      priority: 'high',
      category: 'refinement',
      action: 'Refine or replace underperforming patterns',
      reason: `Only ${(summary.successRate * 100).toFixed(1)}% success rate - patterns need improvement`,
      impact: 'high'
    });
  }

  // Pattern-specific recommendations
  for (const [pattern, stats] of Object.entries(patternStats)) {
    if (stats.effectiveness === 'high' && stats.successRate >= 0.8) {
      recommendations.push({
        priority: 'high',
        category: 'scaling',
        action: `Scale "${pattern}" pattern to production`,
        reason: `High effectiveness (${stats.avgActualImpact >= 0 ? '+' : ''}${stats.avgActualImpact.toFixed(1)} avg) and ${(stats.successRate * 100).toFixed(1)}% success rate`,
        impact: 'high',
        pattern
      });
    } else if (stats.effectiveness === 'negative' || stats.successRate < 0.3) {
      recommendations.push({
        priority: 'high',
        category: 'refinement',
        action: `Refine or retire "${pattern}" pattern`,
        reason: `Low effectiveness or high failure rate (${(stats.successRate * 100).toFixed(1)}% success)`,
        impact: 'medium',
        pattern
      });
    } else if (stats.effectiveness === 'medium' && stats.avgAccuracy < 0.5) {
      recommendations.push({
        priority: 'medium',
        category: 'refinement',
        action: `Refine "${pattern}" pattern to improve accuracy`,
        reason: `Expected impact not being achieved (${(stats.avgAccuracy * 100).toFixed(1)}% accuracy)`,
        impact: 'medium',
        pattern
      });
    }
  }

  // Synergy opportunities
  const synergyPages = validations.filter(v =>
    v.patternCount > 1 && v.actualImpact > v.expectedImpact
  );

  if (synergyPages.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'optimization',
      action: 'Investigate pattern synergies',
      reason: `${synergyPages.length} pages showing synergistic effects`,
      impact: 'medium'
    });
  }

  // Accuracy improvements
  if (summary.avgAccuracy < CONFIG.thresholds.accuracyMedium) {
    recommendations.push({
      priority: 'medium',
      category: 'refinement',
      action: 'Recalibrate impact projections',
      reason: `Average accuracy is ${(summary.avgAccuracy * 100).toFixed(1)}% - projections may be overestimating`,
      impact: 'low'
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  const { validations, patternStats, summary, recommendations, metadata } = results;

  let report = `# Pattern Effectiveness Validation Report\n\n`;
  report += `Generated: ${new Date(metadata.timestamp).toLocaleString()}\n\n`;

  // Executive Summary
  report += `## Executive Summary\n\n`;
  report += `- **Total Validations**: ${summary.total}\n`;
  report += `- **Successful**: ${summary.successful} (${(summary.successRate * 100).toFixed(1)}%)\n`;
  report += `- **Failed**: ${summary.failed} (${((1 - summary.successRate) * 100).toFixed(1)}%)\n`;
  report += `- **Avg Actual Impact**: ${summary.avgActualImpact >= 0 ? '+' : ''}${summary.avgActualImpact.toFixed(1)} points\n`;
  report += `- **Avg Expected Impact**: ${summary.avgExpectedImpact >= 0 ? '+' : ''}${summary.avgExpectedImpact.toFixed(1)} points\n`;
  report += `- **Avg Accuracy**: ${(summary.avgAccuracy * 100).toFixed(1)}%\n\n`;

  // Effectiveness Distribution
  report += `### Effectiveness Distribution\n\n`;
  report += `| Rating | Count | Percentage |\n`;
  report += `|--------|-------|------------|\n`;
  report += `| High | ${summary.effectivenessDistribution.high} | ${((summary.effectivenessDistribution.high / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| Medium | ${summary.effectivenessDistribution.medium} | ${((summary.effectivenessDistribution.medium / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| Low | ${summary.effectivenessDistribution.low} | ${((summary.effectivenessDistribution.low / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| Negative | ${summary.effectivenessDistribution.negative} | ${((summary.effectivenessDistribution.negative / summary.total) * 100).toFixed(1)}% |\n\n`;

  // Pattern Performance
  report += `## Pattern Performance\n\n`;

  const sortedPatterns = Object.entries(patternStats).sort((a, b) =>
    b[1].avgActualImpact - a[1].avgActualImpact
  );

  for (const [pattern, stats] of sortedPatterns) {
    const effectivenessEmoji = {
      high: '🟢',
      medium: '🟡',
      low: '🟠',
      negative: '🔴',
      unknown: '⚪'
    }[stats.effectiveness];

    report += `### ${effectivenessEmoji} ${pattern}\n\n`;
    report += `- **Applications**: ${stats.applications}\n`;
    report += `- **Success Rate**: ${(stats.successRate * 100).toFixed(1)}%\n`;
    report += `- **Avg Actual Impact**: ${stats.avgActualImpact >= 0 ? '+' : ''}${stats.avgActualImpact.toFixed(1)} points\n`;
    report += `- **Avg Expected Impact**: ${stats.avgExpectedImpact >= 0 ? '+' : ''}${stats.avgExpectedImpact.toFixed(1)} points\n`;
    report += `- **Accuracy**: ${(stats.avgAccuracy * 100).toFixed(1)}%\n`;
    report += `- **Effectiveness**: ${stats.effectiveness}\n\n`;
  }

  // Page-Level Results
  report += `## Page-Level Validation Results\n\n`;

  const sortedValidations = [...validations].sort((a, b) =>
    (b.actualImpact || 0) - (a.actualImpact || 0)
  );

  for (const validation of sortedValidations) {
    const statusEmoji = validation.success ? '✅' : '❌';

    report += `### ${statusEmoji} ${validation.page}\n\n`;
    report += `**Patterns Applied**: ${validation.patterns.join(', ')}\n\n`;
    report += `**Metrics**:\n`;
    report += `- Before: ${validation.beforeScore !== null ? validation.beforeScore.toFixed(1) : 'N/A'}\n`;
    report += `- After: ${validation.afterScore !== null ? validation.afterScore.toFixed(1) : 'N/A'}\n`;
    report += `- Actual Impact: ${validation.actualImpact !== null ? (validation.actualImpact >= 0 ? '+' : '') + validation.actualImpact.toFixed(1) : 'N/A'}\n`;
    report += `- Expected Impact: ${validation.expectedImpact !== null ? (validation.expectedImpact >= 0 ? '+' : '') + validation.expectedImpact.toFixed(1) : 'N/A'}\n`;
    report += `- Accuracy: ${validation.accuracy !== null ? (validation.accuracy * 100).toFixed(1) + '%' : 'N/A'}\n`;
    report += `- Effectiveness: ${validation.effectiveness}\n\n`;

    if (validation.insights && validation.insights.length > 0) {
      report += `**Insights**:\n`;
      validation.insights.forEach(insight => {
        report += `- ${insight}\n`;
      });
      report += `\n`;
    }
  }

  // Recommendations
  report += `## Recommendations\n\n`;

  const highPriority = recommendations.filter(r => r.priority === 'high');
  const mediumPriority = recommendations.filter(r => r.priority === 'medium');
  const lowPriority = recommendations.filter(r => r.priority === 'low');

  if (highPriority.length > 0) {
    report += `### 🔴 High Priority\n\n`;
    highPriority.forEach((rec, i) => {
      report += `${i + 1}. **${rec.action}**\n`;
      report += `   - Category: ${rec.category}\n`;
      report += `   - Reason: ${rec.reason}\n`;
      report += `   - Impact: ${rec.impact}\n\n`;
    });
  }

  if (mediumPriority.length > 0) {
    report += `### 🟡 Medium Priority\n\n`;
    mediumPriority.forEach((rec, i) => {
      report += `${i + 1}. **${rec.action}**\n`;
      report += `   - Category: ${rec.category}\n`;
      report += `   - Reason: ${rec.reason}\n`;
      report += `   - Impact: ${rec.impact}\n\n`;
    });
  }

  if (lowPriority.length > 0) {
    report += `### 🟢 Low Priority\n\n`;
    lowPriority.forEach((rec, i) => {
      report += `${i + 1}. **${rec.action}**\n`;
      report += `   - Category: ${rec.category}\n`;
      report += `   - Reason: ${rec.reason}\n`;
      report += `   - Impact: ${rec.impact}\n\n`;
    });
  }

  return report;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Pattern Effectiveness Validation\n');
  console.log('=' .repeat(80));

  // Step 1: Run UX analysis to get current scores
  const analysisSuccess = runUXAnalysis();
  if (!analysisSuccess) {
    console.error('\n❌ Failed to run UX analysis. Cannot proceed with validation.');
    process.exit(1);
  }

  // Step 2: Load data
  console.log('\n📂 Loading data...');

  const baseline = loadJSON(CONFIG.paths.baseline);
  const current = loadJSON(CONFIG.paths.current);
  const applications = loadJSON(CONFIG.paths.applications);

  if (!baseline) {
    console.error('❌ Baseline UX data not found. Run UX analysis first to create baseline.');
    process.exit(1);
  }

  if (!current) {
    console.error('❌ Current UX data not found.');
    process.exit(1);
  }

  if (!applications) {
    console.error('❌ Pattern application data not found.');
    process.exit(1);
  }

  console.log('✅ Data loaded successfully');

  // Step 3: Validate pattern applications
  const validation = validatePatternApplications(baseline, current, applications);

  // Step 4: Analyze pattern-level effectiveness
  console.log('\n📊 Analyzing pattern-level effectiveness...');
  const patternStats = analyzePatternEffectiveness(validation.validations);

  // Step 5: Generate recommendations
  console.log('\n💡 Generating recommendations...');
  const recommendations = generateRecommendations(
    validation.validations,
    patternStats,
    validation.summary
  );

  // Step 6: Compile results
  const results = {
    metadata: {
      timestamp: new Date().toISOString(),
      baseline: CONFIG.paths.baseline,
      current: CONFIG.paths.current,
      applications: CONFIG.paths.applications
    },
    summary: validation.summary,
    validations: validation.validations,
    patternStats,
    recommendations
  };

  // Step 7: Save results
  console.log('\n💾 Saving results...');

  saveJSON(CONFIG.paths.output, results);
  console.log(`✅ Results saved to ${CONFIG.paths.output}`);

  const report = generateMarkdownReport(results);
  fs.writeFileSync(CONFIG.paths.report, report);
  console.log(`✅ Report saved to ${CONFIG.paths.report}`);

  // Step 8: Display summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 VALIDATION SUMMARY\n');
  console.log(`Total Validations: ${validation.summary.total}`);
  console.log(`Successful: ${validation.summary.successful} (${(validation.summary.successRate * 100).toFixed(1)}%)`);
  console.log(`Failed: ${validation.summary.failed} (${((1 - validation.summary.successRate) * 100).toFixed(1)}%)`);
  console.log(`\nAvg Actual Impact: ${validation.summary.avgActualImpact >= 0 ? '+' : ''}${validation.summary.avgActualImpact.toFixed(1)} points`);
  console.log(`Avg Expected Impact: ${validation.summary.avgExpectedImpact >= 0 ? '+' : ''}${validation.summary.avgExpectedImpact.toFixed(1)} points`);
  console.log(`Avg Accuracy: ${(validation.summary.avgAccuracy * 100).toFixed(1)}%`);

  console.log(`\n🎯 TOP RECOMMENDATIONS:\n`);
  recommendations.slice(0, 5).forEach((rec, i) => {
    const emoji = { high: '🔴', medium: '🟡', low: '🟢' }[rec.priority];
    console.log(`${emoji} ${i + 1}. ${rec.action}`);
    console.log(`   ${rec.reason}`);
  });

  console.log('\n✅ Pattern effectiveness validation complete!\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validatePatternApplications,
  analyzePatternEffectiveness,
  generateRecommendations,
  calculateActualImpact,
  determineEffectiveness,
  calculateAccuracy
};
