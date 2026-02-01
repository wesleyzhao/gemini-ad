#!/usr/bin/env node

/**
 * Feature #60: Measure Impact of Validation-Driven Actions
 *
 * This script measures the actual impact of actions executed by the
 * validation monitoring system, comparing before/after metrics and
 * refining the continuous optimization loop.
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const REPORTS_DIR = path.join(__dirname, '..', 'reports', 'iterations');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'action-impact-report.json');
const MARKDOWN_FILE = path.join(REPORTS_DIR, 'action-impact-report.md');

// ============================================================================
// DATA LOADING
// ============================================================================

function loadData() {
  const actionHistoryFile = path.join(REPORTS_DIR, 'action-history.json');
  const lessonsLearnedFile = path.join(REPORTS_DIR, 'lessons-learned-iteration-1.json');
  const validationDataFile = path.join(REPORTS_DIR, 'strategy-validation.json');
  const uxDataFile = path.join(__dirname, '..', 'reports', 'ux-analysis', 'ux-analysis-2026-02-01.json');

  const data = {
    actionHistory: JSON.parse(fs.readFileSync(actionHistoryFile, 'utf8')),
    lessonsLearned: fs.existsSync(lessonsLearnedFile)
      ? JSON.parse(fs.readFileSync(lessonsLearnedFile, 'utf8'))
      : null,
    validation: fs.existsSync(validationDataFile)
      ? JSON.parse(fs.readFileSync(validationDataFile, 'utf8'))
      : null,
    uxData: fs.existsSync(uxDataFile)
      ? JSON.parse(fs.readFileSync(uxDataFile, 'utf8'))
      : null
  };

  return data;
}

// ============================================================================
// IMPACT ANALYSIS
// ============================================================================

function analyzeActionImpact(data) {
  const { actionHistory, lessonsLearned, validation, uxData } = data;

  // Get all executed actions
  const executedActions = actionHistory.actions || [];

  // Calculate impact metrics from lessons learned
  const improvementImpact = lessonsLearned ? {
    totalQualityPoints: lessonsLearned.executiveSummary.totalImprovementPoints || 0,
    pilotPages: lessonsLearned.executiveSummary.pilotPages || 0,
    scaledPages: lessonsLearned.executiveSummary.pagesScaled || 0,
    topPerformer: lessonsLearned.executiveSummary.topPerformer,
    successfulPatterns: lessonsLearned.successfulPatterns || [],
    bestPractices: lessonsLearned.bestPractices || []
  } : null;

  // Calculate UX metrics if available
  const uxImpact = uxData ? {
    averageQuality: uxData.summary?.avgQualityScore || 0,
    totalPages: uxData.summary?.pagesAnalyzed || 0,
    conversionRate: calculateAverageConversionFromEngagement(uxData.engagementAnalysis),
    topPages: getTopPagesFromEngagement(uxData.engagementAnalysis, 5)
  } : null;

  // Calculate overall impact
  const overallImpact = {
    actionsExecuted: executedActions.length,
    totalQualityGained: improvementImpact ? improvementImpact.totalQualityPoints : 0,
    averageImpactPerAction: improvementImpact && executedActions.length > 0
      ? (improvementImpact.totalQualityPoints / executedActions.length).toFixed(1)
      : 0,
    pagesImproved: improvementImpact
      ? improvementImpact.pilotPages + improvementImpact.scaledPages
      : 0,
    successRate: executedActions.length > 0
      ? ((executedActions.filter(a => a.success).length / executedActions.length) * 100).toFixed(1)
      : 100
  };

  return {
    timestamp: new Date().toISOString(),
    executedActions,
    improvementImpact,
    uxImpact,
    overallImpact,
    recommendations: generateRecommendations(overallImpact, improvementImpact)
  };
}

function calculateAverageQuality(pages) {
  if (!pages || pages.length === 0) return 0;
  const sum = pages.reduce((acc, page) => acc + (page.qualityScore || 0), 0);
  return (sum / pages.length).toFixed(1);
}

function calculateAverageConversion(pages) {
  if (!pages || pages.length === 0) return 0;
  const sum = pages.reduce((acc, page) => acc + (page.metrics?.conversionRate || 0), 0);
  return (sum / pages.length).toFixed(1);
}

function calculateAverageConversionFromEngagement(engagement) {
  if (!engagement) return 0;
  const pages = Object.values(engagement);
  if (pages.length === 0) return 0;
  const sum = pages.reduce((acc, page) => acc + (parseFloat(page.metrics?.conversionRate) || 0), 0);
  return (sum / pages.length).toFixed(1);
}

function getTopPages(pages, limit) {
  return pages
    .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))
    .slice(0, limit)
    .map(page => ({
      page: page.page,
      quality: page.qualityScore,
      conversion: page.metrics?.conversionRate,
      grade: page.grade
    }));
}

function getTopPagesFromEngagement(engagement, limit) {
  if (!engagement) return [];
  const pages = Object.entries(engagement).map(([pageName, data]) => ({
    page: pageName,
    quality: data.qualityScore,
    conversion: parseFloat(data.metrics?.conversionRate) || 0,
    grade: data.grade
  }));
  return pages
    .sort((a, b) => b.quality - a.quality)
    .slice(0, limit);
}

function generateRecommendations(overallImpact, improvementImpact) {
  const recommendations = [];

  // Based on success rate
  if (parseFloat(overallImpact.successRate) === 100) {
    recommendations.push({
      priority: 'high',
      category: 'Execution Success',
      recommendation: 'Continue current execution strategy',
      rationale: `${overallImpact.successRate}% success rate indicates effective action selection and execution`,
      action: 'Maintain current automation settings and execution criteria'
    });
  }

  // Based on quality gains
  if (overallImpact.totalQualityGained > 150) {
    recommendations.push({
      priority: 'high',
      category: 'Performance',
      recommendation: 'Scale successful patterns to more pages',
      rationale: `Total quality gain of ${overallImpact.totalQualityGained} points shows high ROI`,
      action: 'Apply successful patterns (CTAs, hero improvements) to remaining low-performing pages'
    });
  }

  // Based on improvement impact
  if (improvementImpact && improvementImpact.successfulPatterns.length > 0) {
    const topPattern = improvementImpact.successfulPatterns[0];
    recommendations.push({
      priority: 'medium',
      category: 'Pattern Library',
      recommendation: `Document and expand "${topPattern.pattern}" pattern`,
      rationale: `${topPattern.avgImprovement} average improvement with high confidence`,
      action: `Create pattern template and apply to all ${topPattern.confidence.toLowerCase()}-potential pages`
    });
  }

  // Future iterations
  recommendations.push({
    priority: 'low',
    category: 'Continuous Improvement',
    recommendation: 'Schedule next improvement iteration',
    rationale: 'Maintain momentum with regular optimization cycles',
    action: 'Run improvement iteration in 2 weeks (2/15/2026)'
  });

  return recommendations;
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateMarkdownReport(analysis) {
  let md = `# Action Impact Report\n\n`;
  md += `**Generated**: ${new Date().toLocaleString()}\n`;
  md += `**Feature**: #60 - Execute validation-driven actions and measure impact\n\n`;

  md += `---\n\n`;

  // Executive Summary
  md += `## 📊 Executive Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Actions Executed | ${analysis.overallImpact.actionsExecuted} |\n`;
  md += `| Success Rate | ${analysis.overallImpact.successRate}% |\n`;
  md += `| Total Quality Gained | +${analysis.overallImpact.totalQualityGained} points |\n`;
  md += `| Average Impact/Action | +${analysis.overallImpact.averageImpactPerAction} points |\n`;
  md += `| Pages Improved | ${analysis.overallImpact.pagesImproved} |\n\n`;

  // Executed Actions
  md += `## ⚡ Executed Actions\n\n`;
  if (analysis.executedActions.length > 0) {
    analysis.executedActions.forEach((action, i) => {
      md += `### ${i + 1}. ${action.recommendation}\n\n`;
      md += `- **Category**: ${action.category}\n`;
      md += `- **Priority**: ${action.priority}\n`;
      md += `- **Status**: ${action.success ? '✅ Success' : '❌ Failed'}\n`;
      md += `- **Executed**: ${new Date(action.timestamp).toLocaleString()}\n`;
      md += `- **Message**: ${action.message}\n`;
      md += `- **Details**: ${action.details}\n\n`;
    });
  } else {
    md += `*No actions executed yet*\n\n`;
  }

  // Improvement Impact
  if (analysis.improvementImpact) {
    md += `## 📈 Improvement Impact\n\n`;
    md += `### Quality Points Breakdown\n\n`;
    md += `- **Total Quality Points**: +${analysis.improvementImpact.totalQualityPoints}\n`;
    md += `- **Pilot Pages**: ${analysis.improvementImpact.pilotPages}\n`;
    md += `- **Scaled Pages**: ${analysis.improvementImpact.scaledPages}\n\n`;

    if (analysis.improvementImpact.topPerformer) {
      md += `### Top Performer\n\n`;
      md += `**${analysis.improvementImpact.topPerformer.page}**: +${analysis.improvementImpact.topPerformer.improvement} points\n\n`;
    }

    if (analysis.improvementImpact.successfulPatterns.length > 0) {
      md += `### Successful Patterns\n\n`;
      analysis.improvementImpact.successfulPatterns.forEach(pattern => {
        md += `- **${pattern.pattern}**: ${pattern.avgImprovement} average improvement (${pattern.confidence} confidence)\n`;
      });
      md += `\n`;
    }
  }

  // UX Impact
  if (analysis.uxImpact) {
    md += `## 🎯 Current UX Metrics\n\n`;
    md += `- **Average Quality Score**: ${analysis.uxImpact.averageQuality}/100\n`;
    md += `- **Average Conversion Rate**: ${analysis.uxImpact.conversionRate}%\n`;
    md += `- **Total Pages Tracked**: ${analysis.uxImpact.totalPages}\n\n`;

    md += `### Top 5 Pages\n\n`;
    md += `| Page | Quality | Conversion | Grade |\n`;
    md += `|------|---------|------------|-------|\n`;
    analysis.uxImpact.topPages.forEach(page => {
      md += `| ${page.page} | ${page.quality} | ${page.conversion?.toFixed(1)}% | ${page.grade} |\n`;
    });
    md += `\n`;
  }

  // Recommendations
  md += `## 💡 Recommendations\n\n`;
  analysis.recommendations.forEach(rec => {
    const priorityEmoji = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    }[rec.priority] || '⚪';

    md += `### ${priorityEmoji} ${rec.recommendation}\n\n`;
    md += `- **Category**: ${rec.category}\n`;
    md += `- **Priority**: ${rec.priority}\n`;
    md += `- **Rationale**: ${rec.rationale}\n`;
    md += `- **Action**: ${rec.action}\n\n`;
  });

  // Next Steps
  md += `## 🔄 Next Steps\n\n`;
  md += `1. **Continue Monitoring**: Run validation monitoring daily during active optimization\n`;
  md += `2. **Execute Recommendations**: Address high and medium priority recommendations\n`;
  md += `3. **Schedule Next Iteration**: Plan next improvement cycle for 2/15/2026\n`;
  md += `4. **Track Progress**: Monitor quality scores and conversion rates\n`;
  md += `5. **Refine Patterns**: Document successful patterns in pattern library\n\n`;

  md += `---\n\n`;
  md += `*Generated by measure-action-impact.js (Feature #60)*\n`;
  md += `*Measures impact of validation-driven actions and refines optimization loop*\n`;

  return md;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log('📊 Measuring Action Impact - Feature #60\n');
  console.log('Analyzing impact of validation-driven actions...\n');

  // Load data
  console.log('📂 Loading data...');
  const data = loadData();

  // Analyze impact
  console.log('📈 Analyzing impact...');
  const analysis = analyzeActionImpact(data);

  // Generate reports
  console.log('📝 Generating reports...');

  // Save JSON report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(analysis, null, 2));
  console.log(`✅ JSON report saved: ${OUTPUT_FILE}`);

  // Save Markdown report
  const markdown = generateMarkdownReport(analysis);
  fs.writeFileSync(MARKDOWN_FILE, markdown);
  console.log(`✅ Markdown report saved: ${MARKDOWN_FILE}`);

  // Display summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPACT SUMMARY');
  console.log('='.repeat(60) + '\n');

  console.log('⚡ Actions Executed:');
  console.log(`   Total: ${analysis.overallImpact.actionsExecuted}`);
  console.log(`   Success Rate: ${analysis.overallImpact.successRate}%\n`);

  console.log('📈 Quality Impact:');
  console.log(`   Total Quality Gained: +${analysis.overallImpact.totalQualityGained} points`);
  console.log(`   Average Impact/Action: +${analysis.overallImpact.averageImpactPerAction} points`);
  console.log(`   Pages Improved: ${analysis.overallImpact.pagesImproved}\n`);

  if (analysis.uxImpact) {
    console.log('🎯 Current UX Metrics:');
    console.log(`   Average Quality: ${analysis.uxImpact.averageQuality}/100`);
    console.log(`   Average Conversion: ${analysis.uxImpact.conversionRate}%\n`);
  }

  console.log('💡 Recommendations:');
  console.log(`   High Priority: ${analysis.recommendations.filter(r => r.priority === 'high').length}`);
  console.log(`   Medium Priority: ${analysis.recommendations.filter(r => r.priority === 'medium').length}`);
  console.log(`   Low Priority: ${analysis.recommendations.filter(r => r.priority === 'low').length}\n`);

  console.log('✨ Analysis complete!\n');
  console.log('📊 View reports:');
  console.log(`   - ${MARKDOWN_FILE}`);
  console.log(`   - ${OUTPUT_FILE}\n`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { analyzeActionImpact, generateMarkdownReport };
