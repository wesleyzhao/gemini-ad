#!/usr/bin/env node

/**
 * Pattern Library Effectiveness Monitoring System
 * Feature #62
 *
 * This script:
 * 1. Monitors pattern library effectiveness over time
 * 2. Identifies which patterns are actually working
 * 3. Recommends pattern refinements
 * 4. Triggers next iteration on prioritized pages
 * 5. Maintains autonomous optimization cycle
 *
 * Part of the continuous optimization system.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// Configuration
// ============================================================================

const PATTERN_LIBRARY_PATH = path.join(__dirname, '../reports/iterations/pattern-library.json');
const ITERATION_HISTORY_PATH = path.join(__dirname, '../reports/iterations/iteration-history.json');
const UX_ANALYSIS_DIR = path.join(__dirname, '../reports/ux-analysis');
const ACTION_HISTORY_PATH = path.join(__dirname, '../reports/iterations/action-history.json');
const EFFECTIVENESS_REPORT_PATH = path.join(__dirname, '../reports/iterations/pattern-effectiveness.json');
const EFFECTIVENESS_MD_PATH = path.join(__dirname, '../reports/iterations/pattern-effectiveness.md');
const NEXT_ITERATION_PATH = path.join(__dirname, '../reports/iterations/next-iteration-plan.json');

// Effectiveness thresholds
const EFFECTIVENESS_THRESHOLDS = {
  EXCELLENT: 10,    // 10+ points average improvement
  GOOD: 5,          // 5-10 points improvement
  MODERATE: 2,      // 2-5 points improvement
  LOW: 0,           // 0-2 points improvement
  INEFFECTIVE: -Infinity  // Negative or no impact
};

// Confidence level mapping
const CONFIDENCE_SCORE = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

// ============================================================================
// Data Loading
// ============================================================================

function loadJSON(filePath, defaultValue = {}) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error(`⚠️  Error loading ${filePath}:`, error.message);
  }
  return defaultValue;
}

function getLatestUXAnalysis() {
  try {
    if (!fs.existsSync(UX_ANALYSIS_DIR)) {
      return { pages: [] };
    }

    const files = fs.readdirSync(UX_ANALYSIS_DIR)
      .filter(f => f.startsWith('ux-analysis-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return { pages: [] };
    }

    const latestFile = path.join(UX_ANALYSIS_DIR, files[0]);
    const rawData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

    // Convert engagementAnalysis to pages array
    const pages = [];
    if (rawData.engagementAnalysis) {
      for (const [pageName, pageData] of Object.entries(rawData.engagementAnalysis)) {
        pages.push({
          name: pageName,
          quality: pageData.qualityScore || 0,
          conversion: parseFloat(pageData.metrics?.conversionRate || 0),
          engagement: parseFloat(pageData.metrics?.engagementRate || 0),
          grade: pageData.grade || 'F'
        });
      }
    }

    return { pages };
  } catch (error) {
    console.error('⚠️  Error loading UX analysis:', error.message);
    return { pages: [] };
  }
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`⚠️  Error saving ${filePath}:`, error.message);
    return false;
  }
}

// ============================================================================
// Pattern Effectiveness Analysis
// ============================================================================

function analyzePatternEffectiveness(patternLibrary, iterationHistory, uxAnalysis, actionHistory) {
  const patterns = patternLibrary.patterns || [];
  const iterations = iterationHistory.iterations || [];
  const uxData = uxAnalysis.pages || [];
  const actions = actionHistory.history || [];

  console.log(`📊 Analyzing ${patterns.length} patterns...`);

  const effectiveness = patterns.map(pattern => {
    // Extract numeric impact from avgImpact string
    const impactMatch = pattern.avgImpact.match(/([+-]?\d+\.?\d*)/);
    const avgImpact = impactMatch ? parseFloat(impactMatch[1]) : 0;

    // Calculate confidence score
    const confidenceScore = CONFIDENCE_SCORE[pattern.confidence] || 1;

    // Determine effectiveness level
    let effectivenessLevel = 'ineffective';
    let effectivenessScore = 0;

    if (avgImpact >= EFFECTIVENESS_THRESHOLDS.EXCELLENT) {
      effectivenessLevel = 'excellent';
      effectivenessScore = 5;
    } else if (avgImpact >= EFFECTIVENESS_THRESHOLDS.GOOD) {
      effectivenessLevel = 'good';
      effectivenessScore = 4;
    } else if (avgImpact >= EFFECTIVENESS_THRESHOLDS.MODERATE) {
      effectivenessLevel = 'moderate';
      effectivenessScore = 3;
    } else if (avgImpact >= EFFECTIVENESS_THRESHOLDS.LOW) {
      effectivenessLevel = 'low';
      effectivenessScore = 2;
    } else {
      effectivenessLevel = 'ineffective';
      effectivenessScore = 1;
    }

    // Calculate overall score (impact × confidence)
    const overallScore = effectivenessScore * confidenceScore;

    // Count applications in action history
    const applicationCount = actions.filter(action =>
      action.message && action.message.includes(pattern.name)
    ).length;

    // Get pages where pattern was applied
    const appliedPages = findPagesWithPattern(pattern, uxData);

    return {
      name: pattern.name,
      status: pattern.status,
      avgImpact,
      confidence: pattern.confidence,
      confidenceScore,
      effectivenessLevel,
      effectivenessScore,
      overallScore,
      occurrences: pattern.occurrences || 0,
      applicationCount,
      appliedPages: appliedPages.length,
      recommendation: generatePatternRecommendation(pattern, effectivenessLevel, avgImpact),
      lastApplied: pattern.addedAt,
      priority: calculatePatternPriority(effectivenessLevel, confidenceScore, pattern.status)
    };
  });

  // Sort by overall score (descending)
  effectiveness.sort((a, b) => b.overallScore - a.overallScore);

  return effectiveness;
}

function findPagesWithPattern(pattern, uxData) {
  // This is a simplified version - in production, we'd track pattern applications more explicitly
  const patternKeywords = pattern.name.toLowerCase().split(' ');

  return uxData.filter(page => {
    // Check if page quality improved (suggesting pattern was applied)
    return page.quality > 40; // Arbitrary threshold
  });
}

function generatePatternRecommendation(pattern, effectivenessLevel, avgImpact) {
  if (effectivenessLevel === 'excellent') {
    return `🚀 Highly effective pattern. Apply to all remaining pages immediately.`;
  } else if (effectivenessLevel === 'good') {
    return `✅ Good pattern. Continue applying to similar pages.`;
  } else if (effectivenessLevel === 'moderate') {
    return `📊 Moderate results. Test variations or refine approach.`;
  } else if (effectivenessLevel === 'low') {
    return `⚠️  Low impact. Consider revising or retiring pattern.`;
  } else {
    return `❌ Ineffective. Retire this pattern and try alternative approaches.`;
  }
}

function calculatePatternPriority(effectivenessLevel, confidenceScore, status) {
  if (effectivenessLevel === 'excellent' && confidenceScore >= 2) {
    return 'critical';
  } else if (effectivenessLevel === 'good' || (effectivenessLevel === 'excellent' && confidenceScore < 2)) {
    return 'high';
  } else if (effectivenessLevel === 'moderate') {
    return 'medium';
  } else {
    return 'low';
  }
}

// ============================================================================
// Next Iteration Planning
// ============================================================================

function planNextIteration(patternEffectiveness, uxData) {
  console.log(`📋 Planning next iteration...`);

  // Identify priority patterns (excellent and good)
  const priorityPatterns = patternEffectiveness.filter(p =>
    p.effectivenessLevel === 'excellent' || p.effectivenessLevel === 'good'
  );

  // Identify low-performing pages that need improvement
  const pages = uxData.pages || [];
  const lowPerformingPages = pages
    .filter(page => page.quality < 45) // Below average
    .sort((a, b) => a.quality - b.quality) // Worst first
    .slice(0, 5); // Top 5 worst

  // Create iteration plan
  const plan = {
    timestamp: new Date().toISOString(),
    patternsToApply: priorityPatterns.map(p => ({
      name: p.name,
      avgImpact: p.avgImpact,
      priority: p.priority,
      targetPages: lowPerformingPages.length
    })),
    targetPages: lowPerformingPages.map(p => ({
      name: p.name,
      currentQuality: p.quality,
      currentConversion: p.conversion,
      improvementPotential: calculateImprovementPotential(p, priorityPatterns)
    })),
    expectedImpact: calculateExpectedImpact(lowPerformingPages, priorityPatterns),
    recommendedActions: generateIterationActions(priorityPatterns, lowPerformingPages),
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
  };

  return plan;
}

function calculateImprovementPotential(page, patterns) {
  // Sum up potential improvements from all priority patterns
  const totalPotential = patterns.reduce((sum, pattern) => sum + pattern.avgImpact, 0);
  return Math.round(totalPotential * 10) / 10; // Round to 1 decimal
}

function calculateExpectedImpact(pages, patterns) {
  const totalPages = pages.length;
  const avgPatternImpact = patterns.reduce((sum, p) => sum + p.avgImpact, 0) / Math.max(patterns.length, 1);
  const totalExpected = totalPages * avgPatternImpact;

  return {
    totalPages,
    avgImpactPerPage: Math.round(avgPatternImpact * 10) / 10,
    totalExpectedGain: Math.round(totalExpected * 10) / 10,
    confidenceLevel: patterns.length >= 2 ? 'high' : 'medium'
  };
}

function generateIterationActions(patterns, pages) {
  const actions = [];

  // Action 1: Apply top pattern to all target pages
  if (patterns.length > 0) {
    const topPattern = patterns[0];
    actions.push({
      type: 'apply-pattern',
      priority: 'high',
      pattern: topPattern.name,
      targetPages: pages.map(p => p.name),
      expectedImpact: `+${topPattern.avgImpact * pages.length} points`,
      rationale: `Top performing pattern with ${topPattern.effectivenessLevel} effectiveness`
    });
  }

  // Action 2: A/B test moderate patterns
  const moderatePatterns = patterns.filter(p => p.effectivenessLevel === 'moderate');
  if (moderatePatterns.length > 0) {
    actions.push({
      type: 'ab-test',
      priority: 'medium',
      patterns: moderatePatterns.map(p => p.name),
      targetPages: pages.slice(0, 2).map(p => p.name),
      expectedImpact: 'Validate effectiveness',
      rationale: 'Test variations to improve or retire these patterns'
    });
  }

  // Action 3: Retire ineffective patterns
  const ineffectivePatterns = patterns.filter(p => p.effectivenessLevel === 'ineffective' || p.effectivenessLevel === 'low');
  if (ineffectivePatterns.length > 0) {
    actions.push({
      type: 'retire-pattern',
      priority: 'low',
      patterns: ineffectivePatterns.map(p => p.name),
      rationale: 'Remove low-impact patterns to focus on proven strategies'
    });
  }

  return actions;
}

// ============================================================================
// Report Generation
// ============================================================================

function generateMarkdownReport(effectiveness, nextIteration, summary) {
  const timestamp = new Date().toLocaleString();

  let md = `# Pattern Library Effectiveness Report\n\n`;
  md += `**Generated**: ${timestamp}\n`;
  md += `**Feature**: #62 - Monitor pattern effectiveness and execute next iteration\n\n`;
  md += `---\n\n`;

  // Summary
  md += `## 📊 Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Patterns | ${summary.totalPatterns} |\n`;
  md += `| Excellent Patterns | ${summary.excellentPatterns} 🚀 |\n`;
  md += `| Good Patterns | ${summary.goodPatterns} ✅ |\n`;
  md += `| Moderate Patterns | ${summary.moderatePatterns} 📊 |\n`;
  md += `| Low/Ineffective | ${summary.lowPatterns} ⚠️ |\n`;
  md += `| Average Impact | ${summary.avgImpact} points |\n`;
  md += `| Top Pattern Impact | ${summary.topImpact} points |\n\n`;

  // Pattern Rankings
  md += `## 🏆 Pattern Rankings\n\n`;
  md += `### Excellent Patterns (10+ points average)\n\n`;
  const excellent = effectiveness.filter(p => p.effectivenessLevel === 'excellent');
  if (excellent.length > 0) {
    excellent.forEach(p => {
      md += `#### ${p.name}\n\n`;
      md += `- **Average Impact**: ${p.avgImpact} points\n`;
      md += `- **Confidence**: ${p.confidence}\n`;
      md += `- **Status**: ${p.status}\n`;
      md += `- **Applications**: ${p.applicationCount}\n`;
      md += `- **Overall Score**: ${p.overallScore}/15\n`;
      md += `- **Priority**: ${p.priority.toUpperCase()}\n`;
      md += `- **Recommendation**: ${p.recommendation}\n\n`;
    });
  } else {
    md += `*No excellent patterns yet. Continue testing and refinement.*\n\n`;
  }

  md += `### Good Patterns (5-10 points average)\n\n`;
  const good = effectiveness.filter(p => p.effectivenessLevel === 'good');
  if (good.length > 0) {
    good.forEach(p => {
      md += `- **${p.name}**: ${p.avgImpact} points (${p.confidence} confidence, ${p.applicationCount} applications)\n`;
    });
    md += `\n`;
  } else {
    md += `*No good patterns identified yet.*\n\n`;
  }

  md += `### Moderate Patterns (2-5 points average)\n\n`;
  const moderate = effectiveness.filter(p => p.effectivenessLevel === 'moderate');
  if (moderate.length > 0) {
    moderate.forEach(p => {
      md += `- **${p.name}**: ${p.avgImpact} points - ${p.recommendation}\n`;
    });
    md += `\n`;
  } else {
    md += `*No moderate patterns.*\n\n`;
  }

  md += `### Low/Ineffective Patterns\n\n`;
  const low = effectiveness.filter(p => p.effectivenessLevel === 'low' || p.effectivenessLevel === 'ineffective');
  if (low.length > 0) {
    low.forEach(p => {
      md += `- ⚠️  **${p.name}**: ${p.avgImpact} points - Consider retiring\n`;
    });
    md += `\n`;
  } else {
    md += `*All patterns showing positive results.*\n\n`;
  }

  // Next Iteration Plan
  md += `## 🎯 Next Iteration Plan\n\n`;
  md += `**Scheduled**: ${new Date(nextIteration.scheduledDate).toLocaleDateString()}\n\n`;
  md += `### Target Pages (${nextIteration.targetPages.length})\n\n`;
  md += `| Page | Quality | Conversion | Potential |\n`;
  md += `|------|---------|------------|----------|\n`;
  nextIteration.targetPages.forEach(page => {
    md += `| ${page.name} | ${page.currentQuality} | ${page.currentConversion}% | +${page.improvementPotential} |\n`;
  });
  md += `\n`;

  md += `### Patterns to Apply (${nextIteration.patternsToApply.length})\n\n`;
  nextIteration.patternsToApply.forEach(pattern => {
    md += `- **${pattern.name}**: ${pattern.avgImpact} points average (${pattern.priority} priority)\n`;
  });
  md += `\n`;

  md += `### Expected Impact\n\n`;
  md += `- **Total Pages**: ${nextIteration.expectedImpact.totalPages}\n`;
  md += `- **Avg Impact/Page**: ${nextIteration.expectedImpact.avgImpactPerPage} points\n`;
  md += `- **Total Expected Gain**: ${nextIteration.expectedImpact.totalExpectedGain} points\n`;
  md += `- **Confidence**: ${nextIteration.expectedImpact.confidenceLevel}\n\n`;

  // Recommended Actions
  md += `## 🚀 Recommended Actions\n\n`;
  nextIteration.recommendedActions.forEach((action, idx) => {
    const priorityEmoji = action.priority === 'high' ? '🔴' : action.priority === 'medium' ? '🟡' : '🟢';
    md += `### ${idx + 1}. ${priorityEmoji} ${action.type.replace(/-/g, ' ').toUpperCase()}\n\n`;
    md += `- **Priority**: ${action.priority}\n`;
    if (action.pattern) md += `- **Pattern**: ${action.pattern}\n`;
    if (action.patterns) md += `- **Patterns**: ${action.patterns.join(', ')}\n`;
    if (action.targetPages) md += `- **Target Pages**: ${action.targetPages.length} pages\n`;
    md += `- **Expected Impact**: ${action.expectedImpact}\n`;
    md += `- **Rationale**: ${action.rationale}\n\n`;
  });

  // System Health
  md += `## 🏥 System Health\n\n`;
  md += `- **Pattern Library Size**: ${summary.totalPatterns} patterns\n`;
  md += `- **Effective Patterns**: ${summary.excellentPatterns + summary.goodPatterns}/${summary.totalPatterns} (${Math.round((summary.excellentPatterns + summary.goodPatterns) / summary.totalPatterns * 100)}%)\n`;
  md += `- **Average Effectiveness**: ${summary.avgImpact} points\n`;
  md += `- **Library Quality**: ${summary.excellentPatterns > 0 ? '🟢 EXCELLENT' : summary.goodPatterns > 0 ? '🟡 GOOD' : '🔴 NEEDS IMPROVEMENT'}\n\n`;

  md += `---\n\n`;
  md += `*Generated by monitor-pattern-effectiveness.js (Feature #62)*\n`;
  md += `*Monitors pattern library effectiveness and plans next iterations*\n`;

  return md;
}

function generateJSONReport(effectiveness, nextIteration, summary) {
  return {
    timestamp: new Date().toISOString(),
    feature: 62,
    summary,
    patterns: effectiveness,
    nextIteration,
    systemHealth: {
      totalPatterns: summary.totalPatterns,
      effectivePatterns: summary.excellentPatterns + summary.goodPatterns,
      effectivenessRate: Math.round((summary.excellentPatterns + summary.goodPatterns) / summary.totalPatterns * 100),
      avgImpact: summary.avgImpact,
      libraryQuality: summary.excellentPatterns > 0 ? 'excellent' : summary.goodPatterns > 0 ? 'good' : 'needs-improvement'
    }
  };
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  console.log('🔍 Pattern Library Effectiveness Monitor - Feature #62\n');
  console.log('Monitoring pattern effectiveness and planning next iteration...\n');

  // Load data
  console.log('📂 Loading data...');
  const patternLibrary = loadJSON(PATTERN_LIBRARY_PATH, { patterns: [] });
  const iterationHistory = loadJSON(ITERATION_HISTORY_PATH, { iterations: [] });
  const uxAnalysis = getLatestUXAnalysis();
  const actionHistory = loadJSON(ACTION_HISTORY_PATH, { history: [] });

  // Analyze pattern effectiveness
  const effectiveness = analyzePatternEffectiveness(
    patternLibrary,
    iterationHistory,
    uxAnalysis,
    actionHistory
  );

  // Calculate summary statistics
  const summary = {
    totalPatterns: effectiveness.length,
    excellentPatterns: effectiveness.filter(p => p.effectivenessLevel === 'excellent').length,
    goodPatterns: effectiveness.filter(p => p.effectivenessLevel === 'good').length,
    moderatePatterns: effectiveness.filter(p => p.effectivenessLevel === 'moderate').length,
    lowPatterns: effectiveness.filter(p => p.effectivenessLevel === 'low' || p.effectivenessLevel === 'ineffective').length,
    avgImpact: Math.round(effectiveness.reduce((sum, p) => sum + p.avgImpact, 0) / effectiveness.length * 10) / 10 || 0,
    topImpact: effectiveness.length > 0 ? effectiveness[0].avgImpact : 0
  };

  console.log(`\n📊 Pattern Analysis Complete:`);
  console.log(`   Total Patterns: ${summary.totalPatterns}`);
  console.log(`   Excellent: ${summary.excellentPatterns} 🚀`);
  console.log(`   Good: ${summary.goodPatterns} ✅`);
  console.log(`   Moderate: ${summary.moderatePatterns} 📊`);
  console.log(`   Low/Ineffective: ${summary.lowPatterns} ⚠️`);
  console.log(`   Average Impact: ${summary.avgImpact} points`);

  // Plan next iteration
  const nextIteration = planNextIteration(effectiveness, uxAnalysis);

  console.log(`\n🎯 Next Iteration Planned:`);
  console.log(`   Target Pages: ${nextIteration.targetPages.length}`);
  console.log(`   Patterns to Apply: ${nextIteration.patternsToApply.length}`);
  console.log(`   Expected Impact: +${nextIteration.expectedImpact.totalExpectedGain} points`);
  console.log(`   Scheduled: ${new Date(nextIteration.scheduledDate).toLocaleDateString()}`);

  // Generate reports
  console.log(`\n📝 Generating reports...`);
  const jsonReport = generateJSONReport(effectiveness, nextIteration, summary);
  const mdReport = generateMarkdownReport(effectiveness, nextIteration, summary);

  // Save reports
  saveJSON(EFFECTIVENESS_REPORT_PATH, jsonReport);
  fs.writeFileSync(EFFECTIVENESS_MD_PATH, mdReport);
  saveJSON(NEXT_ITERATION_PATH, nextIteration);

  console.log(`\n✅ Reports saved:`);
  console.log(`   - ${EFFECTIVENESS_REPORT_PATH}`);
  console.log(`   - ${EFFECTIVENESS_MD_PATH}`);
  console.log(`   - ${NEXT_ITERATION_PATH}`);

  // Execute next iteration if conditions are met
  console.log(`\n🔄 Checking if next iteration should run...`);

  const shouldExecuteNow = shouldExecuteIteration(effectiveness, uxAnalysis);

  if (shouldExecuteNow) {
    console.log(`   ✅ Conditions met. Executing iteration...`);
    executeIteration(nextIteration);
  } else {
    console.log(`   ⏸️  Waiting for scheduled date (${new Date(nextIteration.scheduledDate).toLocaleDateString()})`);
  }

  console.log(`\n✨ Pattern effectiveness monitoring complete!\n`);
  console.log(`📊 View reports:`);
  console.log(`   - ${EFFECTIVENESS_MD_PATH}`);
  console.log(`   - ${NEXT_ITERATION_PATH}`);
}

function shouldExecuteIteration(effectiveness, uxAnalysis) {
  // Execute if we have excellent patterns and low-performing pages
  const hasExcellentPatterns = effectiveness.some(p => p.effectivenessLevel === 'excellent');

  const pages = uxAnalysis.pages || [];
  if (pages.length === 0) {
    return false;
  }

  const avgQuality = pages.reduce((sum, p) => sum + p.quality, 0) / pages.length;
  const hasRoomForImprovement = avgQuality < 60;

  return hasExcellentPatterns && hasRoomForImprovement;
}

function executeIteration(plan) {
  try {
    // Trigger the improvement iteration system
    console.log(`   🚀 Running improvement iteration system...`);
    execSync('node scripts/iterate-improvements.js', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log(`   ✅ Iteration executed successfully`);
  } catch (error) {
    console.error(`   ❌ Error executing iteration:`, error.message);
  }
}

// ============================================================================
// Execute
// ============================================================================

if (require.main === module) {
  main();
}

module.exports = {
  analyzePatternEffectiveness,
  planNextIteration,
  shouldExecuteIteration
};
