#!/usr/bin/env node

/**
 * Pattern Refinement System
 *
 * Refines patterns based on actual effectiveness validation results.
 * Updates pattern definitions, recalibrates impact projections, and improves pattern quality.
 *
 * Features:
 * - Pattern effectiveness analysis
 * - Impact projection recalibration
 * - Pattern definition refinement
 * - Success factor extraction
 * - Pattern versioning
 * - Comprehensive reporting
 *
 * Usage:
 *   node scripts/refine-successful-patterns.js
 *   node scripts/refine-successful-patterns.js --pattern="Call to Action"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  paths: {
    validation: './reports/iterations/pattern-effectiveness-validation.json',
    patterns: './reports/iterations/pattern-library.json',
    refined: './reports/iterations/pattern-library-refined.json',
    refinementHistory: './reports/iterations/pattern-refinement-history.json',
    report: './reports/iterations/pattern-refinement-report.md'
  },
  thresholds: {
    minApplications: 3,      // Minimum applications needed to refine
    highSuccess: 0.8,        // 80%+ success rate
    lowSuccess: 0.3,         // Below 30% success rate
    accuracyTolerance: 0.2   // ±20% accuracy tolerance
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
 * Determine refinement action
 */
function determineRefinementAction(patternStats) {
  const { applications, successRate, avgAccuracy, effectiveness } = patternStats;

  // Not enough data
  if (applications < CONFIG.thresholds.minApplications) {
    return {
      action: 'monitor',
      reason: `Only ${applications} applications - need more data`,
      priority: 'low'
    };
  }

  // High performer - promote
  if (effectiveness === 'high' && successRate >= CONFIG.thresholds.highSuccess) {
    return {
      action: 'promote',
      reason: 'Proven high effectiveness and reliability',
      priority: 'high'
    };
  }

  // Low performer - retire
  if (effectiveness === 'negative' || successRate < CONFIG.thresholds.lowSuccess) {
    return {
      action: 'retire',
      reason: 'Low effectiveness or high failure rate',
      priority: 'high'
    };
  }

  // Accuracy issues - recalibrate
  if (Math.abs(1 - avgAccuracy) > CONFIG.thresholds.accuracyTolerance) {
    return {
      action: 'recalibrate',
      reason: `Impact projections ${avgAccuracy > 1 ? 'under' : 'over'}estimating by ${Math.abs((1 - avgAccuracy) * 100).toFixed(1)}%`,
      priority: 'medium'
    };
  }

  // Moderate performer - optimize
  if (effectiveness === 'medium' && successRate >= 0.5) {
    return {
      action: 'optimize',
      reason: 'Good baseline but room for improvement',
      priority: 'medium'
    };
  }

  // Default - monitor
  return {
    action: 'monitor',
    reason: 'Performance is stable, continue monitoring',
    priority: 'low'
  };
}

/**
 * Recalibrate pattern impact projections
 */
function recalibrateImpact(pattern, avgAccuracy) {
  if (!pattern.expectedImpact) {
    return pattern;
  }

  const calibrationFactor = avgAccuracy;
  const originalImpact = pattern.expectedImpact;
  const calibratedImpact = Math.round(originalImpact * calibrationFactor);

  return {
    ...pattern,
    expectedImpact: calibratedImpact,
    calibration: {
      original: originalImpact,
      factor: parseFloat(calibrationFactor.toFixed(2)),
      calibrated: calibratedImpact,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Promote pattern to production-ready
 */
function promotePattern(pattern, patternStats) {
  return {
    ...pattern,
    status: 'production',
    confidence: 'high',
    validatedBy: {
      applications: patternStats.applications,
      successRate: parseFloat(patternStats.successRate.toFixed(2)),
      avgActualImpact: parseFloat(patternStats.avgActualImpact.toFixed(2)),
      avgAccuracy: parseFloat(patternStats.avgAccuracy.toFixed(2)),
      effectiveness: patternStats.effectiveness,
      promotedAt: new Date().toISOString()
    }
  };
}

/**
 * Optimize pattern definition
 */
function optimizePattern(pattern, validations) {
  // Extract success factors from successful applications
  const successfulPages = validations
    .filter(v => v.patterns.includes(pattern.name) && v.success)
    .map(v => v.page);

  const failedPages = validations
    .filter(v => v.patterns.includes(pattern.name) && !v.success)
    .map(v => v.page);

  return {
    ...pattern,
    optimization: {
      successFactors: extractSuccessFactors(successfulPages, failedPages),
      optimizedAt: new Date().toISOString(),
      recommendations: generateOptimizationRecommendations(successfulPages, failedPages)
    }
  };
}

/**
 * Extract success factors
 */
function extractSuccessFactors(successfulPages, failedPages) {
  const factors = [];

  // Analyze page characteristics
  const successfulSegments = successfulPages.map(extractSegment).filter(Boolean);
  const failedSegments = failedPages.map(extractSegment).filter(Boolean);

  // Find segments that correlate with success
  const successSegments = [...new Set(successfulSegments)];
  const failureSegments = [...new Set(failedSegments)];

  successSegments.forEach(segment => {
    const successCount = successfulSegments.filter(s => s === segment).length;
    const failureCount = failedSegments.filter(s => s === segment).length;

    if (successCount > failureCount) {
      factors.push({
        factor: `Works well on ${segment} pages`,
        confidence: successCount / (successCount + failureCount)
      });
    }
  });

  return factors;
}

/**
 * Extract segment from page name
 */
function extractSegment(page) {
  const segments = {
    'writers': 'Writers',
    'creators': 'Creators',
    'operators': 'Operators',
    'automators': 'Automators',
    'trust': 'Trust',
    'apple': 'Apple-style',
    'workspace': 'Workspace',
    'research': 'Research',
    'productivity': 'Productivity',
    'aspirational': 'Aspirational'
  };

  for (const [key, value] of Object.entries(segments)) {
    if (page.toLowerCase().includes(key)) {
      return value;
    }
  }

  return null;
}

/**
 * Generate optimization recommendations
 */
function generateOptimizationRecommendations(successfulPages, failedPages) {
  const recommendations = [];

  if (successfulPages.length > 0 && failedPages.length === 0) {
    recommendations.push('Pattern is universally successful - consider scaling');
  } else if (failedPages.length > successfulPages.length) {
    recommendations.push('Pattern has high failure rate - consider retiring or major revision');
  } else if (successfulPages.length > 0) {
    recommendations.push(`Focus on ${extractSegment(successfulPages[0])} segment for best results`);
  }

  return recommendations;
}

/**
 * Retire pattern
 */
function retirePattern(pattern, reason) {
  return {
    ...pattern,
    status: 'retired',
    retired: {
      reason,
      retiredAt: new Date().toISOString()
    }
  };
}

/**
 * Refine patterns based on validation results
 */
function refinePatterns(validation, patternLibrary) {
  console.log('\n🔧 Refining patterns based on validation results...\n');

  if (!validation || !validation.patternStats) {
    console.log('⚠️  No validation data available');
    return { patterns: patternLibrary || [], refinements: [] };
  }

  const refinements = [];
  const refinedPatterns = [];

  // Process each pattern
  for (const [patternName, stats] of Object.entries(validation.patternStats)) {
    console.log(`\n📊 Analyzing: ${patternName}`);

    // Find original pattern definition
    let pattern = patternLibrary?.patterns?.find(p => p.name === patternName);

    if (!pattern) {
      // Create basic pattern if not found
      pattern = {
        name: patternName,
        description: `Auto-discovered pattern: ${patternName}`,
        status: 'emerging',
        confidence: 'low',
        category: 'auto-discovered'
      };
    }

    // Determine refinement action
    const refinementAction = determineRefinementAction(stats);
    console.log(`   Action: ${refinementAction.action} (${refinementAction.priority} priority)`);
    console.log(`   Reason: ${refinementAction.reason}`);

    // Apply refinement
    let refinedPattern = { ...pattern };

    switch (refinementAction.action) {
      case 'promote':
        refinedPattern = promotePattern(pattern, stats);
        break;

      case 'recalibrate':
        refinedPattern = recalibrateImpact(pattern, stats.avgAccuracy);
        break;

      case 'optimize':
        refinedPattern = optimizePattern(pattern, validation.validations);
        break;

      case 'retire':
        refinedPattern = retirePattern(pattern, refinementAction.reason);
        break;

      case 'monitor':
        // No changes, just track
        refinedPattern = {
          ...pattern,
          monitoring: {
            lastChecked: new Date().toISOString(),
            applications: stats.applications,
            status: 'monitoring'
          }
        };
        break;
    }

    // Track refinement
    refinements.push({
      pattern: patternName,
      action: refinementAction.action,
      priority: refinementAction.priority,
      reason: refinementAction.reason,
      stats: {
        applications: stats.applications,
        successRate: parseFloat(stats.successRate.toFixed(2)),
        avgActualImpact: parseFloat(stats.avgActualImpact.toFixed(2)),
        avgExpectedImpact: parseFloat(stats.avgExpectedImpact.toFixed(2)),
        avgAccuracy: parseFloat(stats.avgAccuracy.toFixed(2)),
        effectiveness: stats.effectiveness
      },
      timestamp: new Date().toISOString()
    });

    refinedPatterns.push(refinedPattern);
  }

  return {
    patterns: refinedPatterns,
    refinements,
    summary: {
      total: refinements.length,
      promoted: refinements.filter(r => r.action === 'promote').length,
      recalibrated: refinements.filter(r => r.action === 'recalibrate').length,
      optimized: refinements.filter(r => r.action === 'optimize').length,
      retired: refinements.filter(r => r.action === 'retire').length,
      monitoring: refinements.filter(r => r.action === 'monitor').length
    }
  };
}

/**
 * Generate refinement report
 */
function generateRefinementReport(results) {
  const { refinements, summary, metadata } = results;

  let report = `# Pattern Refinement Report\n\n`;
  report += `Generated: ${new Date(metadata.timestamp).toLocaleString()}\n\n`;

  // Summary
  report += `## Refinement Summary\n\n`;
  report += `- **Total Patterns**: ${summary.total}\n`;
  report += `- **Promoted**: ${summary.promoted}\n`;
  report += `- **Recalibrated**: ${summary.recalibrated}\n`;
  report += `- **Optimized**: ${summary.optimized}\n`;
  report += `- **Retired**: ${summary.retired}\n`;
  report += `- **Monitoring**: ${summary.monitoring}\n\n`;

  // Actions by priority
  const highPriority = refinements.filter(r => r.priority === 'high');
  const mediumPriority = refinements.filter(r => r.priority === 'medium');
  const lowPriority = refinements.filter(r => r.priority === 'low');

  // High priority actions
  if (highPriority.length > 0) {
    report += `## 🔴 High Priority Actions\n\n`;
    highPriority.forEach(ref => {
      const emoji = {
        promote: '🎯',
        recalibrate: '⚖️',
        optimize: '⚙️',
        retire: '🗑️',
        monitor: '👁️'
      }[ref.action];

      report += `### ${emoji} ${ref.pattern}\n\n`;
      report += `**Action**: ${ref.action.toUpperCase()}\n\n`;
      report += `**Reason**: ${ref.reason}\n\n`;
      report += `**Performance**:\n`;
      report += `- Applications: ${ref.stats.applications}\n`;
      report += `- Success Rate: ${(ref.stats.successRate * 100).toFixed(1)}%\n`;
      report += `- Avg Actual Impact: ${ref.stats.avgActualImpact >= 0 ? '+' : ''}${ref.stats.avgActualImpact.toFixed(1)} points\n`;
      report += `- Accuracy: ${(ref.stats.avgAccuracy * 100).toFixed(1)}%\n`;
      report += `- Effectiveness: ${ref.stats.effectiveness}\n\n`;
    });
  }

  // Medium priority actions
  if (mediumPriority.length > 0) {
    report += `## 🟡 Medium Priority Actions\n\n`;
    mediumPriority.forEach(ref => {
      const emoji = {
        promote: '🎯',
        recalibrate: '⚖️',
        optimize: '⚙️',
        retire: '🗑️',
        monitor: '👁️'
      }[ref.action];

      report += `### ${emoji} ${ref.pattern}\n\n`;
      report += `**Action**: ${ref.action.toUpperCase()}\n\n`;
      report += `**Reason**: ${ref.reason}\n\n`;
      report += `**Performance Summary**: ${ref.stats.applications} applications, ${(ref.stats.successRate * 100).toFixed(1)}% success rate\n\n`;
    });
  }

  // Low priority actions
  if (lowPriority.length > 0) {
    report += `## 🟢 Low Priority Actions\n\n`;
    lowPriority.forEach(ref => {
      report += `- **${ref.pattern}**: ${ref.action} - ${ref.reason}\n`;
    });
    report += `\n`;
  }

  return report;
}

/**
 * Update refinement history
 */
function updateRefinementHistory(refinements) {
  const history = loadJSON(CONFIG.paths.refinementHistory) || { refinements: [] };

  history.refinements.push({
    timestamp: new Date().toISOString(),
    refinements
  });

  return history;
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Pattern Refinement System\n');
  console.log('='.repeat(80));

  // Load data
  console.log('\n📂 Loading validation data...');
  const validation = loadJSON(CONFIG.paths.validation);
  const patternLibrary = loadJSON(CONFIG.paths.patterns);

  if (!validation) {
    console.error('❌ Validation data not found. Run validation first.');
    process.exit(1);
  }

  console.log('✅ Data loaded');

  // Refine patterns
  const results = refinePatterns(validation, patternLibrary);

  // Compile results
  const finalResults = {
    metadata: {
      timestamp: new Date().toISOString(),
      validation: CONFIG.paths.validation,
      patterns: CONFIG.paths.patterns
    },
    summary: results.summary,
    refinements: results.refinements,
    patterns: results.patterns
  };

  // Save refined patterns
  console.log('\n💾 Saving refined patterns...');
  saveJSON(CONFIG.paths.refined, {
    timestamp: new Date().toISOString(),
    patterns: results.patterns
  });
  console.log(`✅ Refined patterns saved to ${CONFIG.paths.refined}`);

  // Update history
  const history = updateRefinementHistory(results.refinements);
  saveJSON(CONFIG.paths.refinementHistory, history);
  console.log(`✅ History updated`);

  // Generate report
  const report = generateRefinementReport(finalResults);
  fs.writeFileSync(CONFIG.paths.report, report);
  console.log(`✅ Report saved to ${CONFIG.paths.report}`);

  // Display summary
  console.log('\n' + '='.repeat(80));
  console.log('\n🔧 REFINEMENT SUMMARY\n');
  console.log(`Total Patterns: ${results.summary.total}`);
  console.log(`Promoted: ${results.summary.promoted}`);
  console.log(`Recalibrated: ${results.summary.recalibrated}`);
  console.log(`Optimized: ${results.summary.optimized}`);
  console.log(`Retired: ${results.summary.retired}`);
  console.log(`Monitoring: ${results.summary.monitoring}`);

  console.log('\n✅ Pattern refinement complete!\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  refinePatterns,
  determineRefinementAction,
  recalibrateImpact,
  promotePattern,
  optimizePattern,
  retirePattern
};
