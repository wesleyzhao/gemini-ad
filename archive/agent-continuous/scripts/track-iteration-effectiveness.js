#!/usr/bin/env node

/**
 * Track Iteration Effectiveness
 *
 * Monitors and reports on the effectiveness of iterative improvements
 * by comparing before/after metrics and tracking pattern success rates.
 *
 * Feature #56: Continue iterative improvement cycles
 */

const fs = require('fs');
const path = require('path');

// Configuration
const REPORTS_DIR = path.join(__dirname, '..', 'reports', 'iterations');
const TRACKING_FILE = path.join(REPORTS_DIR, 'iteration-tracking.json');
const UX_REPORTS_DIR = path.join(__dirname, '..', 'reports', 'ux-analysis');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'effectiveness-report.md');

// Utility functions
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getIterationFiles() {
  if (!fs.existsSync(REPORTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(REPORTS_DIR);
  return {
    lessons: files.filter(f => f.startsWith('lessons-learned-iteration-')),
    pilots: files.filter(f => f.startsWith('pilot-implementation-')),
    analyses: files.filter(f => f.startsWith('pilot-analysis-')),
    scalings: files.filter(f => f.startsWith('pattern-scaling-'))
  };
}

function getCurrentUXMetrics() {
  if (!fs.existsSync(UX_REPORTS_DIR)) {
    return null;
  }

  const files = fs.readdirSync(UX_REPORTS_DIR);
  const latestReport = files
    .filter(f => f.startsWith('ux-analysis-'))
    .sort()
    .reverse()[0];

  if (!latestReport) return null;

  const data = loadJSON(path.join(UX_REPORTS_DIR, latestReport));
  return data;
}

function calculateIterationMetrics(iterationFiles) {
  const metrics = {
    totalIterations: 0,
    totalPagesImproved: new Set(),
    totalChangesApplied: 0,
    totalQualityPointsGained: 0,
    successfulPatterns: {},
    iterationDetails: []
  };

  // Process lessons learned files
  iterationFiles.lessons.forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = loadJSON(path.join(REPORTS_DIR, filename));
    if (!data) return;

    metrics.totalIterations++;
    metrics.totalQualityPointsGained += data.executiveSummary?.totalImprovementPoints || 0;

    // Track successful patterns
    if (data.successfulPatterns) {
      data.successfulPatterns.forEach(pattern => {
        const patternName = pattern.pattern || pattern.type;
        if (!metrics.successfulPatterns[patternName]) {
          metrics.successfulPatterns[patternName] = {
            count: 0,
            totalImprovement: 0,
            pagesApplied: new Set()
          };
        }
        metrics.successfulPatterns[patternName].count++;

        // Parse improvement value (e.g., "12.0 points" -> 12.0)
        const improvementStr = pattern.avgImprovement || pattern.averageImprovement || '0';
        const improvementValue = parseFloat(improvementStr.toString().replace(/[^\d.]/g, '')) || 0;
        metrics.successfulPatterns[patternName].totalImprovement += improvementValue;
      });
    }

    // Track iteration details
    metrics.iterationDetails.push({
      iteration: data.iteration || metrics.totalIterations,
      date: data.timestamp ? new Date(data.timestamp).toLocaleDateString('en-US') : 'Unknown',
      pilotPages: data.executiveSummary?.pilotPages || 0,
      pagesScaled: data.executiveSummary?.pagesScaled || 0,
      qualityGained: data.executiveSummary?.totalImprovementPoints || 0,
      topPattern: data.successfulPatterns?.[0]?.pattern || 'None'
    });
  });

  // Process pilot implementation files
  iterationFiles.pilots.forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = loadJSON(path.join(REPORTS_DIR, filename));
    if (!data) return;

    // Add pilot pages
    data.pilotPages?.forEach(page => {
      metrics.totalPagesImproved.add(page);
    });

    // Add changes from implementations
    data.implementations?.forEach(impl => {
      metrics.totalChangesApplied += impl.changesApplied || 0;
    });
  });

  // Process scaling files
  iterationFiles.scalings.forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = loadJSON(path.join(REPORTS_DIR, filename));
    if (!data) return;

    // Add scaled pages
    data.pagesScaled?.forEach(page => {
      metrics.totalPagesImproved.add(page);
    });

    // Add changes from results
    data.results?.forEach(result => {
      metrics.totalChangesApplied += result.changesApplied || 0;
    });
  });

  // Convert Set to count
  metrics.totalPagesImproved = metrics.totalPagesImproved.size;

  // Convert successful patterns
  Object.keys(metrics.successfulPatterns).forEach(key => {
    const pattern = metrics.successfulPatterns[key];
    pattern.pagesApplied = pattern.pagesApplied.size || 0;
    pattern.averageImprovement = pattern.count > 0
      ? (pattern.totalImprovement / pattern.count).toFixed(1)
      : 0;
  });

  return metrics;
}

function generateEffectivenessReport(metrics, uxMetrics) {
  const now = new Date().toLocaleDateString('en-US');

  let report = `# Iteration Effectiveness Report

**Generated**: ${now}

## Executive Summary

`;

  // Overall metrics
  report += `### Overall Impact

- **Total Iterations Completed**: ${metrics.totalIterations}
- **Total Pages Improved**: ${metrics.totalPagesImproved}
- **Total Changes Applied**: ${metrics.totalChangesApplied}
- **Total Quality Points Gained**: +${metrics.totalQualityPointsGained.toFixed(1)}

`;

  // Iteration history
  if (metrics.iterationDetails.length > 0) {
    report += `### Iteration History

| Iteration | Date | Pilot Pages | Scaled Pages | Quality Gained | Top Pattern |
|-----------|------|-------------|--------------|----------------|-------------|
`;

    metrics.iterationDetails.forEach(iteration => {
      report += `| #${iteration.iteration} | ${iteration.date} | ${iteration.pilotPages} | ${iteration.pagesScaled} | +${iteration.qualityGained.toFixed(1)} | ${iteration.topPattern} |
`;
    });

    report += `
`;
  }

  // Successful patterns
  report += `## Successful Patterns

`;

  const patternList = Object.entries(metrics.successfulPatterns)
    .sort((a, b) => b[1].averageImprovement - a[1].averageImprovement);

  if (patternList.length > 0) {
    patternList.forEach(([name, data]) => {
      report += `### ${name}

- **Times Applied**: ${data.count} iterations
- **Average Improvement**: +${data.averageImprovement} quality points
- **Total Impact**: +${data.totalImprovement.toFixed(1)} quality points

`;
    });
  } else {
    report += `No successful patterns identified yet. More iterations needed.

`;
  }

  // Current page performance
  if (uxMetrics?.engagementAnalysis || uxMetrics?.pages || uxMetrics?.pageMetrics) {
    const pageData = uxMetrics.engagementAnalysis || uxMetrics.pages || uxMetrics.pageMetrics;

    report += `## Current Page Performance

### Top Performers (Quality Score)

| Page | Quality | Conversion | Bounce Rate | Grade |
|------|---------|------------|-------------|-------|
`;

    const allPages = Array.isArray(pageData)
      ? pageData
      : Object.entries(pageData).map(([filename, data]) => ({
          filename,
          qualityScore: data.qualityScore,
          conversionRate: parseFloat(data.metrics?.conversionRate || 0),
          bounceRate: parseFloat(data.metrics?.bounceRate || 0),
          grade: data.grade
        }));

    const topPages = allPages
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 10);

    topPages.forEach(page => {
      const shortName = (page.filename || page.page || '').replace('.html', '');
      report += `| ${shortName} | ${page.qualityScore} | ${page.conversionRate.toFixed(1)}% | ${page.bounceRate.toFixed(1)}% | ${page.grade} |
`;
    });

    report += `

### Bottom Performers (Need Attention)

| Page | Quality | Conversion | Bounce Rate | Grade |
|------|---------|------------|-------------|-------|
`;

    const bottomPages = allPages
      .sort((a, b) => a.qualityScore - b.qualityScore)
      .slice(0, 5);

    bottomPages.forEach(page => {
      const shortName = (page.filename || page.page || '').replace('.html', '');
      report += `| ${shortName} | ${page.qualityScore} | ${page.conversionRate.toFixed(1)}% | ${page.bounceRate.toFixed(1)}% | ${page.grade} |
`;
    });

    report += `
`;
  }

  // Recommendations
  report += `## Recommendations

`;

  if (metrics.totalIterations === 0) {
    report += `### Start First Iteration
- No iterations completed yet
- Run \`node scripts/iterate-improvements.js\` to begin
- Expected impact: +150-200 quality points

`;
  } else {
    const avgQualityPerIteration = metrics.totalQualityPointsGained / metrics.totalIterations;

    report += `### Continue Iteration Cycles
- Average quality gain per iteration: +${avgQualityPerIteration.toFixed(1)} points
- Recommended frequency: Every 2-3 weeks
- Next iteration should focus on: `;

    if (uxMetrics?.pageMetrics) {
      const bottomPages = Object.entries(uxMetrics.pageMetrics)
        .map(([filename, metrics]) => ({
          filename,
          ...metrics
        }))
        .sort((a, b) => a.qualityScore - b.qualityScore)
        .slice(0, 3);

      report += `\n`;
      bottomPages.forEach((page, i) => {
        report += `  ${i + 1}. ${page.filename.replace('.html', '')} (Quality: ${page.qualityScore})\n`;
      });
    } else {
      report += `Low-performing pages\n`;
    }

    report += `
`;

    // Pattern-specific recommendations
    const topPattern = patternList[0];
    if (topPattern) {
      report += `### Scale Top Pattern: ${topPattern[0]}
- Proven effectiveness: +${topPattern[1].averageImprovement} points average
- Apply to all pages that haven't received this optimization
- Expected additional impact: +50-100 quality points

`;
    }
  }

  // Long-term projections
  if (metrics.totalIterations > 0) {
    const avgQualityPerIteration = metrics.totalQualityPointsGained / metrics.totalIterations;
    const projections = [3, 6, 12].map(months => ({
      months,
      iterations: Math.floor(months / 0.5), // Bi-weekly iterations
      expectedGain: Math.floor(avgQualityPerIteration * (months / 0.5))
    }));

    report += `## Long-Term Projections

Based on current iteration performance (+${avgQualityPerIteration.toFixed(1)} points per iteration):

| Timeframe | Iterations | Expected Quality Gain | Estimated Conversion Lift |
|-----------|------------|----------------------|---------------------------|
`;

    projections.forEach(proj => {
      const conversionLift = (proj.expectedGain * 0.4).toFixed(0); // ~40% correlation
      report += `| ${proj.months} months | ${proj.iterations} | +${proj.expectedGain} points | +${conversionLift}% |
`;
    });

    report += `

*Assumes bi-weekly iteration cycles with similar effectiveness*

`;
  }

  // Action items
  report += `## Action Items

`;

  if (metrics.totalIterations === 0) {
    report += `1. ✅ **Run first iteration** - Use \`node scripts/iterate-improvements.js\`
2. ⏳ **Wait 2-3 weeks** - Allow patterns to settle
3. 📊 **Run second iteration** - Build on successful patterns
4. 🔄 **Establish rhythm** - Bi-weekly improvement cycles

`;
  } else {
    const daysSinceLastIteration = 1; // Placeholder

    report += `1. `;
    if (daysSinceLastIteration < 14) {
      report += `⏳ **Monitor current changes** - Wait ${14 - daysSinceLastIteration} more days before next iteration
`;
    } else {
      report += `✅ **Run next iteration** - Ready for iteration #${metrics.totalIterations + 1}
`;
    }

    report += `2. 📊 **Analyze pattern effectiveness** - Review which patterns are working best
3. 🎯 **Focus on bottom performers** - Target lowest-quality pages in next iteration
4. 📈 **Track conversion metrics** - Monitor real user data as it becomes available

`;
  }

  report += `
---

*Generated by Iteration Effectiveness Tracker (Feature #56)*
*Next update recommended: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}*
`;

  return report;
}

// Main execution
function main() {
  console.log('📊 Tracking Iteration Effectiveness\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Ensure directories exist
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  // Get iteration files
  const iterationFiles = getIterationFiles();
  console.log(`📁 Found Iteration Files:`);
  console.log(`   Lessons Learned: ${iterationFiles.lessons.length}`);
  console.log(`   Pilot Implementations: ${iterationFiles.pilots.length}`);
  console.log(`   Pilot Analyses: ${iterationFiles.analyses.length}`);
  console.log(`   Pattern Scalings: ${iterationFiles.scalings.length}\n`);

  // Get current UX metrics
  const uxMetrics = getCurrentUXMetrics();
  if (uxMetrics) {
    console.log(`✅ Loaded current UX metrics\n`);
  } else {
    console.log(`⚠️  No UX metrics available (run advanced-ux-monitoring.js)\n`);
  }

  // Calculate metrics
  console.log('🔍 Calculating iteration metrics...\n');
  const metrics = calculateIterationMetrics(iterationFiles);

  console.log('📊 Iteration Metrics Summary:');
  console.log(`   Total Iterations: ${metrics.totalIterations}`);
  console.log(`   Pages Improved: ${metrics.totalPagesImproved}`);
  console.log(`   Changes Applied: ${metrics.totalChangesApplied}`);
  console.log(`   Quality Points Gained: +${metrics.totalQualityPointsGained.toFixed(1)}\n`);

  // Generate report
  console.log('📝 Generating effectiveness report...\n');
  const report = generateEffectivenessReport(metrics, uxMetrics);

  // Save report
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  console.log(`✅ Report saved: ${OUTPUT_FILE}\n`);

  // Save tracking data
  const trackingData = {
    lastUpdated: new Date().toISOString(),
    metrics,
    history: []
  };

  // Load previous tracking data
  const previousData = loadJSON(TRACKING_FILE);
  if (previousData?.history) {
    trackingData.history = previousData.history;
  }

  // Add current snapshot to history
  trackingData.history.push({
    date: new Date().toISOString(),
    totalIterations: metrics.totalIterations,
    totalQualityGained: metrics.totalQualityPointsGained,
    pagesImproved: metrics.totalPagesImproved,
    changesApplied: metrics.totalChangesApplied
  });

  // Keep last 30 snapshots
  if (trackingData.history.length > 30) {
    trackingData.history = trackingData.history.slice(-30);
  }

  saveJSON(TRACKING_FILE, trackingData);
  console.log(`✅ Tracking data updated: ${TRACKING_FILE}\n`);

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ TRACKING COMPLETE\n');

  // Print key insights
  if (metrics.totalIterations > 0) {
    console.log('🎯 KEY INSIGHTS:\n');

    const avgQualityPerIteration = metrics.totalQualityPointsGained / metrics.totalIterations;
    console.log(`   Average quality gain: +${avgQualityPerIteration.toFixed(1)} points per iteration`);

    const topPattern = Object.entries(metrics.successfulPatterns)
      .sort((a, b) => b[1].averageImprovement - a[1].averageImprovement)[0];

    if (topPattern) {
      console.log(`   Top pattern: ${topPattern[0]} (+${topPattern[1].averageImprovement} points avg)`);
    }

    console.log(`   Total impact: +${metrics.totalQualityPointsGained.toFixed(1)} quality points\n`);
  } else {
    console.log('💡 No iterations completed yet - run iterate-improvements.js to start\n');
  }

  console.log(`📄 Read full report: ${OUTPUT_FILE}\n`);
}

// Run
main();
