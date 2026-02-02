#!/usr/bin/env node

/**
 * Pattern Library Expansion System
 *
 * This script:
 * 1. Analyzes all improvement iterations for new patterns
 * 2. Refines existing patterns based on effectiveness data
 * 3. Identifies emerging patterns from recent improvements
 * 4. Updates pattern library with new discoveries
 * 5. Generates recommendations for pattern application
 */

const fs = require('fs');
const path = require('path');

// File paths
const ITERATIONS_DIR = 'reports/iterations';
const PATTERN_LIBRARY = path.join(ITERATIONS_DIR, 'pattern-library.json');
const PATTERN_EFFECTIVENESS = path.join(ITERATIONS_DIR, 'pattern-effectiveness.json');
const ACTION_IMPACT = path.join(ITERATIONS_DIR, 'action-impact-report.json');
const UX_ANALYTICS = 'reports/ux-analytics.json';
const OUTPUT_FILE = path.join(ITERATIONS_DIR, 'pattern-library-expansion.json');
const OUTPUT_MD = path.join(ITERATIONS_DIR, 'pattern-library-expansion.md');

// Thresholds
const MIN_IMPACT_FOR_PATTERN = 5; // Minimum average impact to qualify as pattern
const MIN_OCCURRENCES = 2; // Minimum occurrences to establish pattern
const EXCELLENT_THRESHOLD = 10; // Impact threshold for excellent pattern
const GOOD_THRESHOLD = 5; // Impact threshold for good pattern

/**
 * Load JSON file safely
 */
function loadJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Save JSON file
 */
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Save markdown file
 */
function saveMarkdown(filePath, content) {
  fs.writeFileSync(filePath, content);
}

/**
 * Analyze UX data for emerging patterns
 */
function analyzeUXPatterns(uxData) {
  if (!uxData || !uxData.pages) return [];

  const patterns = [];
  const pages = uxData.pages;

  // Pattern: High engagement pages
  const highEngagement = pages
    .filter(p => p.engagement && p.engagement.timeOnPage > 60)
    .map(p => ({
      page: p.page,
      engagement: p.engagement.timeOnPage,
      quality: p.quality
    }));

  if (highEngagement.length >= 2) {
    const avgQuality = highEngagement.reduce((sum, p) => sum + p.quality, 0) / highEngagement.length;
    patterns.push({
      name: 'High Engagement Design',
      type: 'emerging',
      avgImpact: Math.round(avgQuality - 40), // Compared to baseline
      occurrences: highEngagement.length,
      evidence: `${highEngagement.length} pages with 60+ seconds time on page`,
      examples: highEngagement.slice(0, 3).map(p => p.page),
      recommendation: 'Analyze common design elements and apply to other pages'
    });
  }

  // Pattern: High conversion rate
  const highConversion = pages
    .filter(p => p.conversion && parseFloat(p.conversion) > 20)
    .map(p => ({
      page: p.page,
      conversion: parseFloat(p.conversion),
      quality: p.quality
    }));

  if (highConversion.length >= 2) {
    const avgQuality = highConversion.reduce((sum, p) => sum + p.quality, 0) / highConversion.length;
    patterns.push({
      name: 'High Conversion CTA Placement',
      type: 'emerging',
      avgImpact: Math.round(avgQuality - 40),
      occurrences: highConversion.length,
      evidence: `${highConversion.length} pages with 20%+ conversion`,
      examples: highConversion.slice(0, 3).map(p => p.page),
      recommendation: 'Study CTA placement and copy on these pages'
    });
  }

  // Pattern: Mobile optimization
  const mobileOptimized = pages
    .filter(p => p.mobileOptimized === true || (p.quality > 45 && p.mobile))
    .map(p => ({
      page: p.page,
      quality: p.quality
    }));

  if (mobileOptimized.length >= 2) {
    const avgQuality = mobileOptimized.reduce((sum, p) => sum + p.quality, 0) / mobileOptimized.length;
    patterns.push({
      name: 'Mobile-First Design',
      type: 'emerging',
      avgImpact: Math.round(avgQuality - 40),
      occurrences: mobileOptimized.length,
      evidence: `${mobileOptimized.length} pages with strong mobile performance`,
      examples: mobileOptimized.slice(0, 3).map(p => p.page),
      recommendation: 'Apply mobile-first principles to all pages'
    });
  }

  return patterns;
}

/**
 * Analyze action impact for proven strategies
 */
function analyzeActionPatterns(actionData) {
  if (!actionData || !actionData.improvementImpact) return [];

  const patterns = [];
  const impact = actionData.improvementImpact;

  // Extract successful patterns
  if (impact.successfulPatterns) {
    impact.successfulPatterns.forEach(pattern => {
      const avgImpact = parseFloat(pattern.avgImprovement) || 0;
      if (avgImpact >= MIN_IMPACT_FOR_PATTERN) {
        patterns.push({
          name: pattern.pattern,
          type: 'proven',
          avgImpact: avgImpact,
          occurrences: pattern.occurrences,
          evidence: pattern.avgImprovement,
          confidence: pattern.confidence,
          recommendation: pattern.recommendation,
          status: 'validated'
        });
      }
    });
  }

  // Analyze top performer characteristics
  if (impact.topPerformer) {
    patterns.push({
      name: 'Top Performer Design Elements',
      type: 'emerging',
      avgImpact: impact.topPerformer.improvement,
      occurrences: 1,
      evidence: `${impact.topPerformer.page} improved by ${impact.topPerformer.improvement} points`,
      examples: [impact.topPerformer.page],
      recommendation: 'Analyze and replicate design elements from top performer'
    });
  }

  return patterns;
}

/**
 * Refine existing patterns based on effectiveness data
 */
function refineExistingPatterns(patternLib, effectiveness) {
  if (!patternLib || !patternLib.patterns) return [];

  const refined = patternLib.patterns.map(pattern => {
    // Find effectiveness data for this pattern
    const effectData = effectiveness?.patterns?.find(p => p.name === pattern.name);

    const refinement = {
      name: pattern.name,
      originalImpact: pattern.avgImpact,
      originalStatus: pattern.status,
      originalConfidence: pattern.confidence
    };

    if (effectData) {
      refinement.currentImpact = effectData.avgImpact;
      refinement.effectivenessLevel = effectData.effectivenessLevel;
      refinement.effectivenessScore = effectData.effectivenessScore;
      refinement.overallScore = effectData.overallScore;
      refinement.recommendation = effectData.recommendation;

      // Determine if pattern needs refinement
      if (effectData.effectivenessLevel === 'excellent') {
        refinement.action = 'promote';
        refinement.newStatus = 'proven-excellent';
        refinement.priority = 'critical';
        refinement.rationale = 'Consistently high impact - prioritize for scaling';
      } else if (effectData.effectivenessLevel === 'good') {
        refinement.action = 'maintain';
        refinement.newStatus = 'proven';
        refinement.priority = 'high';
        refinement.rationale = 'Good performance - continue current application';
      } else if (effectData.effectivenessLevel === 'moderate') {
        refinement.action = 'optimize';
        refinement.newStatus = 'needs-refinement';
        refinement.priority = 'medium';
        refinement.rationale = 'Moderate impact - refine implementation approach';
      } else {
        refinement.action = 'retire-or-revise';
        refinement.newStatus = 'under-review';
        refinement.priority = 'low';
        refinement.rationale = 'Low impact - consider retiring or significant revision';
      }
    } else {
      refinement.action = 'needs-validation';
      refinement.rationale = 'No effectiveness data available - needs testing';
    }

    return refinement;
  });

  return refined;
}

/**
 * Identify new patterns from recent improvements
 */
function identifyNewPatterns(uxPatterns, actionPatterns) {
  const newPatterns = [];
  const existingNames = new Set();

  // Combine and deduplicate
  [...uxPatterns, ...actionPatterns].forEach(pattern => {
    if (!existingNames.has(pattern.name)) {
      existingNames.add(pattern.name);

      // Only include patterns with sufficient impact or occurrences
      if (pattern.avgImpact >= MIN_IMPACT_FOR_PATTERN ||
          pattern.occurrences >= MIN_OCCURRENCES) {
        newPatterns.push({
          name: pattern.name,
          type: pattern.type,
          avgImpact: pattern.avgImpact,
          occurrences: pattern.occurrences,
          evidence: pattern.evidence,
          examples: pattern.examples || [],
          confidence: pattern.confidence || determineConfidence(pattern),
          recommendation: pattern.recommendation,
          status: pattern.status || 'candidate',
          addedAt: new Date().toISOString(),
          priority: determinePatternPriority(pattern.avgImpact),
          application: {
            targetPages: pattern.recommendation,
            effort: estimateEffort(pattern),
            expectedImpact: `+${pattern.avgImpact} points per page`
          }
        });
      }
    }
  });

  return newPatterns;
}

/**
 * Determine confidence level for a pattern
 */
function determineConfidence(pattern) {
  if (pattern.occurrences >= 5 && pattern.avgImpact >= EXCELLENT_THRESHOLD) {
    return 'Very High';
  } else if (pattern.occurrences >= 3 && pattern.avgImpact >= GOOD_THRESHOLD) {
    return 'High';
  } else if (pattern.occurrences >= 2) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

/**
 * Determine pattern priority
 */
function determinePatternPriority(impact) {
  if (impact >= EXCELLENT_THRESHOLD) return 'critical';
  if (impact >= GOOD_THRESHOLD) return 'high';
  if (impact >= 3) return 'medium';
  return 'low';
}

/**
 * Estimate implementation effort
 */
function estimateEffort(pattern) {
  const name = pattern.name.toLowerCase();

  if (name.includes('cta') || name.includes('button') || name.includes('headline')) {
    return 'Low (automated)';
  } else if (name.includes('layout') || name.includes('placement')) {
    return 'Medium (semi-automated)';
  } else if (name.includes('design') || name.includes('visual')) {
    return 'High (manual)';
  } else {
    return 'Medium';
  }
}

/**
 * Generate pattern application recommendations
 */
function generateRecommendations(refinements, newPatterns) {
  const recommendations = [];

  // High-priority pattern promotions
  const promotions = refinements.filter(r => r.action === 'promote');
  if (promotions.length > 0) {
    recommendations.push({
      type: 'promote-patterns',
      priority: 'critical',
      patterns: promotions.map(p => p.name),
      action: 'Apply these excellent patterns to all remaining pages',
      expectedImpact: `+${promotions.reduce((sum, p) => sum + (p.currentImpact || 0), 0)} points`,
      rationale: 'Proven patterns with excellent effectiveness scores'
    });
  }

  // New high-impact patterns
  const highImpactNew = newPatterns.filter(p => p.priority === 'critical' || p.priority === 'high');
  if (highImpactNew.length > 0) {
    recommendations.push({
      type: 'test-new-patterns',
      priority: 'high',
      patterns: highImpactNew.map(p => p.name),
      action: 'Run pilot tests on 2-3 pages for each pattern',
      expectedImpact: `+${highImpactNew.reduce((sum, p) => sum + p.avgImpact, 0)} points (if validated)`,
      rationale: 'Emerging patterns show strong potential based on current data'
    });
  }

  // Patterns needing optimization
  const needsOptimization = refinements.filter(r => r.action === 'optimize');
  if (needsOptimization.length > 0) {
    recommendations.push({
      type: 'optimize-patterns',
      priority: 'medium',
      patterns: needsOptimization.map(p => p.name),
      action: 'Refine implementation approach and re-test',
      rationale: 'Moderate performance suggests implementation could be improved'
    });
  }

  // Patterns to retire
  const toRetire = refinements.filter(r => r.action === 'retire-or-revise');
  if (toRetire.length > 0) {
    recommendations.push({
      type: 'retire-patterns',
      priority: 'low',
      patterns: toRetire.map(p => p.name),
      action: 'Remove from active pattern library or significantly revise',
      rationale: 'Low effectiveness - not worth continued investment'
    });
  }

  return recommendations;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  let md = '# Pattern Library Expansion Report\n\n';
  md += `**Generated**: ${new Date().toISOString()}\n\n`;

  // Summary
  md += '## Summary\n\n';
  md += `- **Existing Patterns Refined**: ${results.refinements.length}\n`;
  md += `- **New Patterns Identified**: ${results.newPatterns.length}\n`;
  md += `- **Total Patterns in Library**: ${results.updatedLibrary.patterns.length}\n`;
  md += `- **Recommendations Generated**: ${results.recommendations.length}\n\n`;

  // Pattern Refinements
  md += '## Pattern Refinements\n\n';
  if (results.refinements.length === 0) {
    md += '*No patterns to refine*\n\n';
  } else {
    results.refinements.forEach(ref => {
      const statusIcon = ref.action === 'promote' ? '🚀' :
                        ref.action === 'maintain' ? '✅' :
                        ref.action === 'optimize' ? '🔧' : '⚠️';

      md += `### ${statusIcon} ${ref.name}\n\n`;
      md += `- **Original Impact**: ${ref.originalImpact}\n`;
      md += `- **Current Impact**: ${ref.currentImpact || 'N/A'}\n`;
      md += `- **Effectiveness**: ${ref.effectivenessLevel || 'Unknown'}\n`;
      md += `- **Action**: ${ref.action}\n`;
      md += `- **Rationale**: ${ref.rationale}\n`;
      md += `- **Priority**: ${ref.priority}\n\n`;
    });
  }

  // New Patterns
  md += '## New Patterns Discovered\n\n';
  if (results.newPatterns.length === 0) {
    md += '*No new patterns identified*\n\n';
  } else {
    results.newPatterns.forEach(pattern => {
      const priorityIcon = pattern.priority === 'critical' ? '🔥' :
                          pattern.priority === 'high' ? '⭐' :
                          pattern.priority === 'medium' ? '📊' : '📋';

      md += `### ${priorityIcon} ${pattern.name}\n\n`;
      md += `- **Type**: ${pattern.type}\n`;
      md += `- **Average Impact**: +${pattern.avgImpact} points\n`;
      md += `- **Occurrences**: ${pattern.occurrences}\n`;
      md += `- **Confidence**: ${pattern.confidence}\n`;
      md += `- **Evidence**: ${pattern.evidence}\n`;
      if (pattern.examples && pattern.examples.length > 0) {
        md += `- **Examples**: ${pattern.examples.join(', ')}\n`;
      }
      md += `- **Recommendation**: ${pattern.recommendation}\n`;
      md += `- **Expected Impact**: ${pattern.application.expectedImpact}\n`;
      md += `- **Effort**: ${pattern.application.effort}\n\n`;
    });
  }

  // Recommendations
  md += '## Recommended Actions\n\n';
  if (results.recommendations.length === 0) {
    md += '*No recommendations at this time*\n\n';
  } else {
    results.recommendations.forEach((rec, idx) => {
      md += `### ${idx + 1}. ${rec.type.replace(/-/g, ' ').toUpperCase()}\n\n`;
      md += `**Priority**: ${rec.priority.toUpperCase()}\n\n`;
      md += `**Patterns**: ${rec.patterns.join(', ')}\n\n`;
      md += `**Action**: ${rec.action}\n\n`;
      if (rec.expectedImpact) {
        md += `**Expected Impact**: ${rec.expectedImpact}\n\n`;
      }
      md += `**Rationale**: ${rec.rationale}\n\n`;
    });
  }

  // Updated Library Stats
  md += '## Updated Pattern Library Stats\n\n';
  const stats = results.updatedLibrary.stats;
  md += `- **Total Patterns**: ${stats.totalPatterns}\n`;
  md += `- **Proven Patterns**: ${stats.provenPatterns}\n`;
  md += `- **Candidate Patterns**: ${stats.candidatePatterns}\n`;
  md += `- **Under Review**: ${stats.underReviewPatterns}\n`;
  md += `- **Average Impact**: ${stats.avgImpact.toFixed(1)} points\n`;
  md += `- **High-Priority Patterns**: ${stats.highPriorityPatterns}\n\n`;

  // Next Steps
  md += '## Next Steps\n\n';
  md += '1. Review and approve new patterns for pilot testing\n';
  md += '2. Execute promotion recommendations for excellent patterns\n';
  md += '3. Refine or retire low-performing patterns\n';
  md += '4. Schedule next pattern library review (2 weeks)\n';
  md += '5. Monitor impact of newly applied patterns\n\n';

  return md;
}

/**
 * Update pattern library with refinements and new patterns
 */
function updatePatternLibrary(currentLib, refinements, newPatterns) {
  const updatedPatterns = [];

  // Update existing patterns based on refinements
  if (currentLib && currentLib.patterns) {
    currentLib.patterns.forEach(pattern => {
      const refinement = refinements.find(r => r.name === pattern.name);
      if (refinement) {
        updatedPatterns.push({
          ...pattern,
          status: refinement.newStatus || pattern.status,
          priority: refinement.priority,
          effectiveness: refinement.effectivenessLevel,
          lastReviewed: new Date().toISOString(),
          refinementAction: refinement.action
        });
      } else {
        updatedPatterns.push(pattern);
      }
    });
  }

  // Add new patterns
  newPatterns.forEach(pattern => {
    // Check if pattern already exists
    if (!updatedPatterns.find(p => p.name === pattern.name)) {
      updatedPatterns.push(pattern);
    }
  });

  // Calculate stats
  const stats = {
    totalPatterns: updatedPatterns.length,
    provenPatterns: updatedPatterns.filter(p => p.status?.includes('proven')).length,
    candidatePatterns: updatedPatterns.filter(p => p.status === 'candidate').length,
    underReviewPatterns: updatedPatterns.filter(p => p.status === 'under-review').length,
    avgImpact: updatedPatterns.reduce((sum, p) => {
      const impact = typeof p.avgImpact === 'number' ? p.avgImpact :
                     parseFloat(p.avgImpact) || 0;
      return sum + impact;
    }, 0) / updatedPatterns.length || 0,
    highPriorityPatterns: updatedPatterns.filter(p =>
      p.priority === 'critical' || p.priority === 'high'
    ).length
  };

  return {
    version: '2.0',
    lastUpdated: new Date().toISOString(),
    patterns: updatedPatterns,
    stats: stats
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Pattern Library Expansion System\n');

  // Load data
  console.log('📂 Loading data files...');
  const patternLib = loadJSON(PATTERN_LIBRARY);
  const effectiveness = loadJSON(PATTERN_EFFECTIVENESS);
  const actionImpact = loadJSON(ACTION_IMPACT);
  const uxAnalytics = loadJSON(UX_ANALYTICS);

  // Analyze patterns
  console.log('\n📊 Analyzing UX data for emerging patterns...');
  const uxPatterns = analyzeUXPatterns(uxAnalytics);
  console.log(`   Found ${uxPatterns.length} emerging patterns from UX data`);

  console.log('\n📊 Analyzing action impact for proven strategies...');
  const actionPatterns = analyzeActionPatterns(actionImpact);
  console.log(`   Found ${actionPatterns.length} patterns from action impact`);

  console.log('\n🔧 Refining existing patterns...');
  const refinements = refineExistingPatterns(patternLib, effectiveness);
  console.log(`   Refined ${refinements.length} existing patterns`);

  console.log('\n🆕 Identifying new patterns...');
  const newPatterns = identifyNewPatterns(uxPatterns, actionPatterns);
  console.log(`   Identified ${newPatterns.length} new patterns`);

  console.log('\n💡 Generating recommendations...');
  const recommendations = generateRecommendations(refinements, newPatterns);
  console.log(`   Generated ${recommendations.length} recommendations`);

  console.log('\n📚 Updating pattern library...');
  const updatedLibrary = updatePatternLibrary(patternLib, refinements, newPatterns);
  console.log(`   Updated library now contains ${updatedLibrary.patterns.length} patterns`);

  // Prepare results
  const results = {
    timestamp: new Date().toISOString(),
    refinements: refinements,
    newPatterns: newPatterns,
    recommendations: recommendations,
    updatedLibrary: updatedLibrary,
    summary: {
      totalPatternsAnalyzed: (patternLib?.patterns?.length || 0),
      patternsRefined: refinements.length,
      newPatternsDiscovered: newPatterns.length,
      recommendationsGenerated: recommendations.length,
      finalLibrarySize: updatedLibrary.patterns.length,
      avgImpact: updatedLibrary.stats.avgImpact,
      highPriorityPatterns: updatedLibrary.stats.highPriorityPatterns
    }
  };

  // Save results
  console.log('\n💾 Saving results...');
  saveJSON(OUTPUT_FILE, results);
  console.log(`   ✅ Saved JSON report: ${OUTPUT_FILE}`);

  const markdown = generateMarkdownReport(results);
  saveMarkdown(OUTPUT_MD, markdown);
  console.log(`   ✅ Saved Markdown report: ${OUTPUT_MD}`);

  // Update pattern library
  saveJSON(PATTERN_LIBRARY, updatedLibrary);
  console.log(`   ✅ Updated pattern library: ${PATTERN_LIBRARY}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PATTERN LIBRARY EXPANSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Patterns Refined:     ${results.summary.patternsRefined}`);
  console.log(`New Patterns Found:   ${results.summary.newPatternsDiscovered}`);
  console.log(`Total Patterns:       ${results.summary.finalLibrarySize}`);
  console.log(`High Priority:        ${results.summary.highPriorityPatterns}`);
  console.log(`Average Impact:       ${results.summary.avgImpact.toFixed(1)} points`);
  console.log(`Recommendations:      ${results.summary.recommendationsGenerated}`);
  console.log('='.repeat(60));

  console.log('\n✅ Pattern library expansion complete!\n');

  return results;
}

// Run if called directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { main };
