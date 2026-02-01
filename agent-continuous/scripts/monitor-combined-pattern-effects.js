#!/usr/bin/env node

/**
 * Combined Pattern Effects Monitoring Script
 *
 * Monitors the effects of applied patterns, especially when multiple patterns
 * are applied to the same page (combined effects)
 *
 * Features:
 * - Track pattern applications per page
 * - Measure combined pattern effects
 * - Detect synergy or interference
 * - Compare actual vs expected impact
 * - Generate insights and recommendations
 *
 * Usage:
 *   node scripts/monitor-combined-pattern-effects.js
 */

const fs = require('fs');

// Configuration
const UX_ANALYSIS_RESULTS = 'reports/ux-analysis-results.json';
const APPLICATION_HISTORY = 'reports/iterations/pattern-application-history.json';
const COMBINED_EFFECTS_RESULTS = 'reports/iterations/combined-pattern-effects.json';
const COMBINED_EFFECTS_REPORT = 'reports/iterations/combined-pattern-effects-report.md';

console.log('📊 Combined Pattern Effects Monitoring');
console.log('=======================================\n');

// Load data
let uxAnalysis, applicationHistory;

try {
  uxAnalysis = JSON.parse(fs.readFileSync(UX_ANALYSIS_RESULTS, 'utf8'));

  if (fs.existsSync(APPLICATION_HISTORY)) {
    applicationHistory = JSON.parse(fs.readFileSync(APPLICATION_HISTORY, 'utf8'));
  } else {
    console.log('⚠️  No application history found. Run execute-pattern-applications.js first.\n');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Error loading data files:', error.message);
  process.exit(1);
}

/**
 * Group applications by page
 */
function groupApplicationsByPage() {
  const pageApplications = {};

  for (const app of applicationHistory.applications) {
    if (!pageApplications[app.page]) {
      pageApplications[app.page] = {
        page: app.page,
        patterns: [],
        totalExpectedImpact: 0,
        applicationCount: 0,
        firstApplication: app.timestamp,
        lastApplication: app.timestamp
      };
    }

    pageApplications[app.page].patterns.push({
      pattern: app.pattern,
      timestamp: app.timestamp,
      expectedImpact: app.expectedImpact,
      changes: app.changes
    });

    pageApplications[app.page].totalExpectedImpact += app.expectedImpact;
    pageApplications[app.page].applicationCount++;
    pageApplications[app.page].lastApplication = app.timestamp;
  }

  return Object.values(pageApplications);
}

/**
 * Detect pages with multiple patterns (combined effects)
 */
function detectCombinedPatterns(pageApplications) {
  return pageApplications.filter(pa => pa.patterns.length > 1);
}

/**
 * Get current quality score for a page
 */
function getCurrentQualityScore(pageName) {
  const pageData = uxAnalysis.pages.find(p => p.page === pageName);
  return pageData ? pageData.qualityScore : null;
}

/**
 * Analyze combined pattern effects
 */
function analyzeCombinedEffects(combinedPages) {
  const results = [];

  for (const pageApp of combinedPages) {
    const currentScore = getCurrentQualityScore(pageApp.page);
    const patternNames = pageApp.patterns.map(p => p.pattern);

    // Calculate expected combined impact
    const expectedCombinedImpact = pageApp.totalExpectedImpact;

    // Note: We can't measure actual impact yet as we don't have baseline scores
    // This will be updated once we have before/after UX analysis data

    const analysis = {
      page: pageApp.page,
      patternsApplied: patternNames,
      patternCount: pageApp.patterns.length,
      expectedCombinedImpact,
      currentQualityScore: currentScore,
      applicationTimeline: {
        first: pageApp.firstApplication,
        last: pageApp.lastApplication
      },
      combinationType: determineCombinationType(patternNames),
      synergySuspected: expectedCombinedImpact >= 25, // High combined impact
      details: pageApp.patterns.map(p => ({
        pattern: p.pattern,
        expectedImpact: p.expectedImpact,
        changesApplied: p.changes.length
      }))
    };

    results.push(analysis);
  }

  return results;
}

/**
 * Determine combination type
 */
function determineCombinationType(patternNames) {
  // Categorize pattern combinations
  const hasCTA = patternNames.some(p => p.includes('Call to Action'));
  const hasDesign = patternNames.some(p => p.includes('Design'));
  const hasPerformance = patternNames.some(p => p.includes('Performance'));

  if (hasCTA && hasDesign) {
    return 'UX + Design';
  } else if (hasCTA && hasPerformance) {
    return 'UX + Performance';
  } else if (hasDesign && hasPerformance) {
    return 'Design + Performance';
  } else {
    return 'Multi-pattern';
  }
}

/**
 * Analyze single-pattern pages for comparison
 */
function analyzeSinglePatternPages(pageApplications) {
  const singlePatternPages = pageApplications.filter(pa => pa.patterns.length === 1);

  const results = singlePatternPages.map(pageApp => {
    const currentScore = getCurrentQualityScore(pageApp.page);
    const pattern = pageApp.patterns[0];

    return {
      page: pageApp.page,
      pattern: pattern.pattern,
      expectedImpact: pattern.expectedImpact,
      currentQualityScore: currentScore,
      applicationDate: pattern.timestamp,
      changesApplied: pattern.changes.length
    };
  });

  return results;
}

/**
 * Generate insights from combined effects
 */
function generateInsights(combinedEffects, singlePatternEffects) {
  const insights = [];

  // Insight 1: Pages with multiple patterns
  if (combinedEffects.length > 0) {
    insights.push({
      category: 'Combined Patterns',
      severity: 'info',
      finding: `${combinedEffects.length} page(s) have multiple patterns applied`,
      detail: `Pages: ${combinedEffects.map(ce => ce.page).join(', ')}`,
      recommendation: 'Monitor these pages for synergistic or interfering effects'
    });
  }

  // Insight 2: High-impact combinations
  const highImpactCombos = combinedEffects.filter(ce => ce.expectedCombinedImpact >= 25);
  if (highImpactCombos.length > 0) {
    insights.push({
      category: 'High Impact',
      severity: 'success',
      finding: `${highImpactCombos.length} page(s) have high-impact pattern combinations`,
      detail: `Expected combined impact >= 25 points`,
      recommendation: 'Prioritize measuring actual impact on these pages'
    });
  }

  // Insight 3: Pattern distribution
  const patternCounts = {};
  for (const ce of combinedEffects) {
    for (const pattern of ce.patternsApplied) {
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    }
  }

  const mostCommonPattern = Object.keys(patternCounts).reduce((a, b) =>
    patternCounts[a] > patternCounts[b] ? a : b, null
  );

  if (mostCommonPattern) {
    insights.push({
      category: 'Pattern Usage',
      severity: 'info',
      finding: `"${mostCommonPattern}" is the most commonly combined pattern`,
      detail: `Applied in ${patternCounts[mostCommonPattern]} combination(s)`,
      recommendation: 'Analyze effectiveness of this pattern in combinations vs. alone'
    });
  }

  // Insight 4: Measurement readiness
  insights.push({
    category: 'Measurement',
    severity: 'warning',
    finding: 'Actual impact cannot be measured yet',
    detail: 'Need before/after UX analysis data to measure real improvements',
    recommendation: 'Run UX analysis again after patterns have been live for 24+ hours'
  });

  return insights;
}

/**
 * Calculate metrics
 */
function calculateMetrics(pageApplications, combinedEffects, singlePatternEffects) {
  const totalPages = pageApplications.length;
  const pagesWithCombinedPatterns = combinedEffects.length;
  const pagesWithSinglePattern = singlePatternEffects.length;

  const totalExpectedImpact = pageApplications.reduce(
    (sum, pa) => sum + pa.totalExpectedImpact, 0
  );

  const avgPatternsPerPage = totalPages > 0
    ? (pageApplications.reduce((sum, pa) => sum + pa.patterns.length, 0) / totalPages).toFixed(1)
    : 0;

  const totalCombinedExpectedImpact = combinedEffects.reduce(
    (sum, ce) => sum + ce.expectedCombinedImpact, 0
  );

  const avgCombinedImpact = combinedEffects.length > 0
    ? (totalCombinedExpectedImpact / combinedEffects.length).toFixed(1)
    : 0;

  return {
    totalPages,
    pagesWithCombinedPatterns,
    pagesWithSinglePattern,
    totalExpectedImpact,
    avgPatternsPerPage: parseFloat(avgPatternsPerPage),
    combinedPatternMetrics: {
      totalCombinedExpectedImpact,
      avgCombinedImpact: parseFloat(avgCombinedImpact),
      highImpactCombinations: combinedEffects.filter(ce => ce.expectedCombinedImpact >= 25).length,
      synergyOpportunities: combinedEffects.filter(ce => ce.synergySuspected).length
    }
  };
}

/**
 * Generate recommendations
 */
function generateRecommendations(combinedEffects, insights, metrics) {
  const recommendations = [];

  // Recommendation 1: Monitor high-impact combinations
  if (metrics.combinedPatternMetrics.highImpactCombinations > 0) {
    recommendations.push({
      priority: 'critical',
      category: 'monitoring',
      action: 'Monitor high-impact pattern combinations closely',
      rationale: `${metrics.combinedPatternMetrics.highImpactCombinations} page(s) with expected impact >= 25 points`,
      pages: combinedEffects
        .filter(ce => ce.expectedCombinedImpact >= 25)
        .map(ce => ce.page)
    });
  }

  // Recommendation 2: Run follow-up UX analysis
  recommendations.push({
    priority: 'high',
    category: 'measurement',
    action: 'Run UX analysis after 24-48 hours to measure actual impact',
    rationale: 'Need real data to validate pattern effectiveness and detect synergies',
    expectedBenefit: 'Understand which combinations work best'
  });

  // Recommendation 3: Compare single vs combined patterns
  if (metrics.pagesWithSinglePattern > 0 && metrics.pagesWithCombinedPatterns > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'analysis',
      action: 'Compare effectiveness of single vs. combined patterns',
      rationale: 'Determine if patterns work better alone or in combination',
      approach: 'Statistical analysis of impact differences'
    });
  }

  // Recommendation 4: Document successful combinations
  if (metrics.combinedPatternMetrics.synergyOpportunities > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'documentation',
      action: 'Document promising pattern combinations for future use',
      rationale: `${metrics.combinedPatternMetrics.synergyOpportunities} combination(s) showing synergy potential`,
      expectedBenefit: 'Build library of proven pattern combinations'
    });
  }

  return recommendations;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  const { pageApplications, combinedEffects, singlePatternEffects, insights, metrics, recommendations } = results;

  let report = '# Combined Pattern Effects Monitoring Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;

  report += '## Executive Summary\n\n';
  report += `- **Total Pages with Patterns:** ${metrics.totalPages}\n`;
  report += `- **Pages with Combined Patterns:** ${metrics.pagesWithCombinedPatterns}\n`;
  report += `- **Pages with Single Pattern:** ${metrics.pagesWithSinglePattern}\n`;
  report += `- **Total Expected Impact:** +${metrics.totalExpectedImpact} points\n`;
  report += `- **Avg Patterns per Page:** ${metrics.avgPatternsPerPage}\n\n`;

  if (combinedEffects.length > 0) {
    report += '## Combined Pattern Effects\n\n';
    report += `Found ${combinedEffects.length} page(s) with multiple patterns applied:\n\n`;

    for (const effect of combinedEffects) {
      report += `### ${effect.page}\n\n`;
      report += `- **Patterns Applied:** ${effect.patternsApplied.join(', ')}\n`;
      report += `- **Pattern Count:** ${effect.patternCount}\n`;
      report += `- **Expected Combined Impact:** +${effect.expectedCombinedImpact} points\n`;
      report += `- **Current Quality Score:** ${effect.currentQualityScore}\n`;
      report += `- **Combination Type:** ${effect.combinationType}\n`;
      report += `- **Synergy Suspected:** ${effect.synergySuspected ? 'Yes ⭐' : 'No'}\n\n`;

      report += '**Pattern Details:**\n\n';
      for (const detail of effect.details) {
        report += `- ${detail.pattern}: +${detail.expectedImpact} points (${detail.changesApplied} changes)\n`;
      }
      report += '\n';
    }
  }

  if (singlePatternEffects.length > 0) {
    report += '## Single Pattern Effects\n\n';
    report += `${singlePatternEffects.length} page(s) with single pattern applied:\n\n`;

    const patternGroups = {};
    for (const effect of singlePatternEffects) {
      if (!patternGroups[effect.pattern]) {
        patternGroups[effect.pattern] = [];
      }
      patternGroups[effect.pattern].push(effect);
    }

    for (const [pattern, effects] of Object.entries(patternGroups)) {
      report += `### ${pattern}\n\n`;
      report += `Applied to ${effects.length} page(s):\n\n`;
      for (const effect of effects) {
        report += `- **${effect.page}**\n`;
        report += `  - Expected Impact: +${effect.expectedImpact} points\n`;
        report += `  - Current Quality Score: ${effect.currentQualityScore}\n`;
        report += `  - Changes Applied: ${effect.changesApplied}\n\n`;
      }
    }
  }

  report += '## Metrics\n\n';
  report += '### Combined Pattern Metrics\n\n';
  report += `- **Total Combined Expected Impact:** +${metrics.combinedPatternMetrics.totalCombinedExpectedImpact} points\n`;
  report += `- **Avg Combined Impact:** +${metrics.combinedPatternMetrics.avgCombinedImpact} points/page\n`;
  report += `- **High-Impact Combinations:** ${metrics.combinedPatternMetrics.highImpactCombinations}\n`;
  report += `- **Synergy Opportunities:** ${metrics.combinedPatternMetrics.synergyOpportunities}\n\n`;

  report += '## Insights\n\n';
  for (const insight of insights) {
    const emoji = insight.severity === 'success' ? '✅' :
                  insight.severity === 'warning' ? '⚠️' : 'ℹ️';

    report += `### ${emoji} ${insight.category}\n\n`;
    report += `**Finding:** ${insight.finding}\n\n`;
    report += `**Detail:** ${insight.detail}\n\n`;
    report += `**Recommendation:** ${insight.recommendation}\n\n`;
  }

  report += '## Recommendations\n\n';
  for (const rec of recommendations) {
    const priorityEmoji = rec.priority === 'critical' ? '🔴' :
                         rec.priority === 'high' ? '🟡' : '🟢';

    report += `### ${priorityEmoji} [${rec.priority.toUpperCase()}] ${rec.action}\n\n`;
    report += `**Category:** ${rec.category}\n\n`;
    report += `**Rationale:** ${rec.rationale}\n\n`;

    if (rec.pages) {
      report += `**Pages:** ${rec.pages.join(', ')}\n\n`;
    }
    if (rec.expectedBenefit) {
      report += `**Expected Benefit:** ${rec.expectedBenefit}\n\n`;
    }
    if (rec.approach) {
      report += `**Approach:** ${rec.approach}\n\n`;
    }
  }

  report += '## Next Steps\n\n';
  report += '1. Monitor pattern applications for 24-48 hours\n';
  report += '2. Run UX analysis to measure actual impact\n';
  report += '3. Compare actual vs. expected results\n';
  report += '4. Identify successful combinations for pattern library\n';
  report += '5. Scale winning combinations to additional pages\n\n';

  report += '---\n\n';
  report += '*This report is automatically generated by the Combined Pattern Effects Monitoring system.*\n';

  return report;
}

/**
 * Main execution
 */
function main() {
  console.log('📋 Analyzing pattern applications...\n');

  // Group applications by page
  const pageApplications = groupApplicationsByPage();
  console.log(`✅ Found ${pageApplications.length} page(s) with pattern applications\n`);

  // Detect combined patterns
  const combinedPages = detectCombinedPatterns(pageApplications);
  console.log(`🔍 Detected ${combinedPages.length} page(s) with combined patterns\n`);

  // Analyze combined effects
  const combinedEffects = analyzeCombinedEffects(combinedPages);
  console.log(`📊 Analyzed combined pattern effects\n`);

  // Analyze single-pattern pages
  const singlePatternEffects = analyzeSinglePatternPages(pageApplications);
  console.log(`📊 Analyzed ${singlePatternEffects.length} single-pattern page(s)\n`);

  // Generate insights
  const insights = generateInsights(combinedEffects, singlePatternEffects);
  console.log(`💡 Generated ${insights.length} insights\n`);

  // Calculate metrics
  const metrics = calculateMetrics(pageApplications, combinedEffects, singlePatternEffects);
  console.log(`📈 Calculated performance metrics\n`);

  // Generate recommendations
  const recommendations = generateRecommendations(combinedEffects, insights, metrics);
  console.log(`🎯 Generated ${recommendations.length} recommendations\n`);

  // Compile results
  const results = {
    timestamp: new Date().toISOString(),
    pageApplications,
    combinedEffects,
    singlePatternEffects,
    insights,
    metrics,
    recommendations,
    summary: {
      totalPages: metrics.totalPages,
      combinedPatterns: metrics.pagesWithCombinedPatterns,
      singlePatterns: metrics.pagesWithSinglePattern,
      totalExpectedImpact: metrics.totalExpectedImpact,
      highImpactCombinations: metrics.combinedPatternMetrics.highImpactCombinations
    }
  };

  // Save results
  fs.writeFileSync(
    COMBINED_EFFECTS_RESULTS,
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log(`💾 Results saved to: ${COMBINED_EFFECTS_RESULTS}\n`);

  // Generate and save markdown report
  const markdownReport = generateMarkdownReport(results);
  fs.writeFileSync(COMBINED_EFFECTS_REPORT, markdownReport, 'utf8');
  console.log(`📄 Markdown report saved to: ${COMBINED_EFFECTS_REPORT}\n`);

  // Display summary
  console.log('📊 MONITORING SUMMARY');
  console.log('====================\n');
  console.log(`Total Pages: ${metrics.totalPages}`);
  console.log(`Combined Patterns: ${metrics.pagesWithCombinedPatterns}`);
  console.log(`Single Patterns: ${metrics.pagesWithSinglePattern}`);
  console.log(`Total Expected Impact: +${metrics.totalExpectedImpact} points`);
  console.log(`High-Impact Combinations: ${metrics.combinedPatternMetrics.highImpactCombinations}\n`);

  console.log('✨ Monitoring complete!\n');
}

// Run main
main();
