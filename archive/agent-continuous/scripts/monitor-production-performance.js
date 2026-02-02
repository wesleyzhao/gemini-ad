#!/usr/bin/env node

/**
 * Production Performance Monitoring System
 *
 * Monitors production pattern performance in real-time:
 * - Tracks UX scores over time
 * - Detects performance regressions
 * - Measures pattern impact
 * - Generates alerts and insights
 * - Recommends optimizations
 *
 * Usage:
 *   node scripts/monitor-production-performance.js
 *   node scripts/monitor-production-performance.js --pattern="Call to Action"
 *   node scripts/monitor-production-performance.js --page="index.html"
 *   node scripts/monitor-production-performance.js --threshold=5  # Alert if score drops >5 points
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  reportsDir: path.join(__dirname, '..', 'reports', 'production'),
  iterationsDir: path.join(__dirname, '..', 'reports', 'iterations'),
  pagesDir: path.join(__dirname, '..'),
  patternLibraryFile: path.join(__dirname, '..', 'reports', 'iterations', 'pattern-library.json'),
  historyFile: path.join(__dirname, '..', 'reports', 'production', 'performance-history.json'),
  alertsFile: path.join(__dirname, '..', 'reports', 'production', 'alerts.json'),
  regressionThreshold: 5, // Alert if UX score drops by this many points
  monitoringInterval: 3600000, // 1 hour in milliseconds (for daemon mode)
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  pattern: args.find(arg => arg.startsWith('--pattern='))?.split('=')[1],
  page: args.find(arg => arg.startsWith('--page='))?.split('=')[1],
  threshold: parseInt(args.find(arg => arg.startsWith('--threshold='))?.split('=')[1]) || CONFIG.regressionThreshold,
  daemon: args.includes('--daemon'),
};

/**
 * Ensure required directories exist
 */
function ensureDirectories() {
  [CONFIG.reportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Load pattern library
 */
function loadPatternLibrary() {
  if (!fs.existsSync(CONFIG.patternLibraryFile)) {
    return { patterns: [] };
  }
  return JSON.parse(fs.readFileSync(CONFIG.patternLibraryFile, 'utf8'));
}

/**
 * Load performance history
 */
function loadPerformanceHistory() {
  if (!fs.existsSync(CONFIG.historyFile)) {
    return {
      snapshots: [],
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
  }
  return JSON.parse(fs.readFileSync(CONFIG.historyFile, 'utf8'));
}

/**
 * Save performance history
 */
function savePerformanceHistory(history) {
  history.metadata.updated = new Date().toISOString();
  fs.writeFileSync(CONFIG.historyFile, JSON.stringify(history, null, 2));
}

/**
 * Load alerts history
 */
function loadAlerts() {
  if (!fs.existsSync(CONFIG.alertsFile)) {
    return {
      alerts: [],
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
  }
  return JSON.parse(fs.readFileSync(CONFIG.alertsFile, 'utf8'));
}

/**
 * Save alerts
 */
function saveAlerts(alerts) {
  alerts.metadata.updated = new Date().toISOString();
  fs.writeFileSync(CONFIG.alertsFile, JSON.stringify(alerts, null, 2));
}

/**
 * Run UX analysis to get current scores
 */
function runUXAnalysis() {
  console.log('📊 Running UX analysis...');

  try {
    const scriptPath = path.join(__dirname, 'analyze-ux-patterns.js');
    execSync(`node "${scriptPath}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    // Load the latest analysis results
    const analysisFile = path.join(CONFIG.iterationsDir, 'ux-analysis.json');
    if (fs.existsSync(analysisFile)) {
      return JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
    }
  } catch (error) {
    console.error('❌ Error running UX analysis:', error.message);
  }

  return null;
}

/**
 * Get production patterns
 */
function getProductionPatterns(library) {
  return library.patterns.filter(p => p.status === 'production');
}

/**
 * Calculate pattern performance metrics
 */
function calculatePatternMetrics(pattern, currentAnalysis, history) {
  const metrics = {
    patternName: pattern.name,
    status: pattern.status,
    currentStats: pattern.stats || {},
    performance: {
      successRate: pattern.stats?.successRate || 0,
      applications: pattern.stats?.applications || 0,
      totalImpact: pattern.stats?.totalImpact || 0,
      averageImpact: pattern.stats?.averageImpact || 0
    },
    trends: {
      successRateTrend: 'stable',
      impactTrend: 'stable',
      applicationsTrend: 'stable'
    },
    alerts: []
  };

  // Get historical data for this pattern
  const previousSnapshots = history.snapshots
    .filter(s => s.patterns[pattern.name])
    .slice(-10); // Last 10 snapshots

  if (previousSnapshots.length > 0) {
    const latest = previousSnapshots[previousSnapshots.length - 1];
    const latestStats = latest.patterns[pattern.name];

    // Calculate trends
    if (latestStats) {
      const successRateDiff = metrics.performance.successRate - latestStats.successRate;
      const impactDiff = metrics.performance.averageImpact - latestStats.averageImpact;
      const applicationsDiff = metrics.performance.applications - latestStats.applications;

      // Success rate trend
      if (Math.abs(successRateDiff) > 5) {
        metrics.trends.successRateTrend = successRateDiff > 0 ? 'improving' : 'declining';
      }

      // Impact trend
      if (Math.abs(impactDiff) > 2) {
        metrics.trends.impactTrend = impactDiff > 0 ? 'improving' : 'declining';
      }

      // Applications trend
      if (applicationsDiff !== 0) {
        metrics.trends.applicationsTrend = applicationsDiff > 0 ? 'increasing' : 'stable';
      }

      // Generate alerts for declining performance
      if (successRateDiff < -10) {
        metrics.alerts.push({
          severity: 'high',
          type: 'success_rate_decline',
          message: `Success rate declined by ${Math.abs(successRateDiff).toFixed(1)}%`,
          previous: latestStats.successRate,
          current: metrics.performance.successRate
        });
      }

      if (impactDiff < -5) {
        metrics.alerts.push({
          severity: 'medium',
          type: 'impact_decline',
          message: `Average impact declined by ${Math.abs(impactDiff).toFixed(1)} points`,
          previous: latestStats.averageImpact,
          current: metrics.performance.averageImpact
        });
      }
    }
  }

  return metrics;
}

/**
 * Detect regressions in page performance
 */
function detectRegressions(currentAnalysis, history, threshold) {
  const regressions = [];

  if (!currentAnalysis || !currentAnalysis.pages) {
    return regressions;
  }

  // Get previous snapshot
  const previousSnapshots = history.snapshots.slice(-5); // Last 5 snapshots
  if (previousSnapshots.length === 0) {
    return regressions;
  }

  const latestSnapshot = previousSnapshots[previousSnapshots.length - 1];

  // Compare each page's current score with previous
  currentAnalysis.pages.forEach(currentPage => {
    const previousPage = latestSnapshot.pages?.find(p => p.file === currentPage.file);

    if (previousPage) {
      const scoreDiff = currentPage.uxScore - previousPage.uxScore;

      if (scoreDiff < -threshold) {
        regressions.push({
          page: currentPage.file,
          previousScore: previousPage.uxScore,
          currentScore: currentPage.uxScore,
          decline: Math.abs(scoreDiff),
          severity: Math.abs(scoreDiff) > threshold * 2 ? 'critical' : 'high',
          timestamp: new Date().toISOString(),
          details: {
            previousMetrics: previousPage.metrics,
            currentMetrics: currentPage.metrics
          }
        });
      }
    }
  });

  return regressions;
}

/**
 * Generate performance insights
 */
function generateInsights(patternMetrics, regressions, currentAnalysis) {
  const insights = {
    summary: {
      totalPatterns: patternMetrics.length,
      patternsWithAlerts: patternMetrics.filter(p => p.alerts.length > 0).length,
      regressions: regressions.length,
      overallHealth: 'good'
    },
    patterns: {
      improving: patternMetrics.filter(p =>
        p.trends.successRateTrend === 'improving' ||
        p.trends.impactTrend === 'improving'
      ).length,
      declining: patternMetrics.filter(p =>
        p.trends.successRateTrend === 'declining' ||
        p.trends.impactTrend === 'declining'
      ).length,
      stable: patternMetrics.filter(p =>
        p.trends.successRateTrend === 'stable' &&
        p.trends.impactTrend === 'stable'
      ).length
    },
    recommendations: []
  };

  // Determine overall health
  if (insights.summary.patternsWithAlerts > 2 || regressions.length > 1) {
    insights.summary.overallHealth = 'needs_attention';
  } else if (insights.summary.patternsWithAlerts > 0 || regressions.length > 0) {
    insights.summary.overallHealth = 'monitoring';
  }

  // Generate recommendations
  if (insights.patterns.declining > 0) {
    insights.recommendations.push({
      priority: 'high',
      type: 'pattern_optimization',
      message: `${insights.patterns.declining} pattern(s) showing declining performance. Consider A/B testing variations.`,
      action: 'Run A/B test variations for declining patterns'
    });
  }

  if (regressions.length > 0) {
    insights.recommendations.push({
      priority: 'critical',
      type: 'regression_fix',
      message: `${regressions.length} page(s) showing performance regression. Investigate recent changes.`,
      action: 'Review recent pattern applications and rollback if necessary'
    });
  }

  if (insights.patterns.improving > 0) {
    insights.recommendations.push({
      priority: 'medium',
      type: 'scale_success',
      message: `${insights.patterns.improving} pattern(s) showing improvement. Consider scaling to more pages.`,
      action: 'Scale improving patterns to additional pages'
    });
  }

  // Add performance-based recommendations
  if (currentAnalysis && currentAnalysis.pages) {
    const lowPerformingPages = currentAnalysis.pages.filter(p => p.uxScore < 70);
    if (lowPerformingPages.length > 0) {
      insights.recommendations.push({
        priority: 'medium',
        type: 'page_optimization',
        message: `${lowPerformingPages.length} page(s) with UX score below 70. Apply proven patterns.`,
        action: 'Apply high-performing patterns to low-scoring pages',
        pages: lowPerformingPages.map(p => p.file)
      });
    }
  }

  return insights;
}

/**
 * Create performance snapshot
 */
function createSnapshot(currentAnalysis, patternMetrics) {
  const snapshot = {
    timestamp: new Date().toISOString(),
    pages: currentAnalysis?.pages || [],
    patterns: {},
    summary: {
      totalPages: currentAnalysis?.pages?.length || 0,
      averageScore: 0,
      totalPatterns: patternMetrics.length
    }
  };

  // Calculate average score
  if (snapshot.pages.length > 0) {
    snapshot.summary.averageScore = snapshot.pages.reduce((sum, p) => sum + p.uxScore, 0) / snapshot.pages.length;
  }

  // Store pattern metrics
  patternMetrics.forEach(metric => {
    snapshot.patterns[metric.patternName] = {
      successRate: metric.performance.successRate,
      applications: metric.performance.applications,
      totalImpact: metric.performance.totalImpact,
      averageImpact: metric.performance.averageImpact,
      trends: metric.trends
    };
  });

  return snapshot;
}

/**
 * Generate monitoring report
 */
function generateReport(patternMetrics, regressions, insights, history) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: insights.summary,
    regressions: regressions,
    patternPerformance: patternMetrics,
    insights: insights,
    history: {
      snapshots: history.snapshots.length,
      oldestSnapshot: history.snapshots[0]?.timestamp,
      latestSnapshot: history.snapshots[history.snapshots.length - 1]?.timestamp
    }
  };

  // Save JSON report
  const jsonFile = path.join(CONFIG.reportsDir, 'performance-monitoring.json');
  fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));

  // Generate markdown report
  let markdown = `# Production Performance Monitoring Report\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;

  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- **Overall Health:** ${insights.summary.overallHealth.toUpperCase()}\n`;
  markdown += `- **Production Patterns:** ${insights.summary.totalPatterns}\n`;
  markdown += `- **Patterns with Alerts:** ${insights.summary.patternsWithAlerts}\n`;
  markdown += `- **Performance Regressions:** ${insights.summary.regressions}\n`;
  markdown += `- **Pattern Trends:**\n`;
  markdown += `  - Improving: ${insights.patterns.improving}\n`;
  markdown += `  - Stable: ${insights.patterns.stable}\n`;
  markdown += `  - Declining: ${insights.patterns.declining}\n\n`;

  // Regressions
  if (regressions.length > 0) {
    markdown += `## ⚠️ Performance Regressions\n\n`;
    regressions.forEach(reg => {
      markdown += `### ${reg.page} (${reg.severity.toUpperCase()})\n\n`;
      markdown += `- **Previous Score:** ${reg.previousScore.toFixed(1)}\n`;
      markdown += `- **Current Score:** ${reg.currentScore.toFixed(1)}\n`;
      markdown += `- **Decline:** ${reg.decline.toFixed(1)} points\n`;
      markdown += `- **Timestamp:** ${reg.timestamp}\n\n`;
    });
  }

  // Pattern Performance
  markdown += `## Pattern Performance\n\n`;
  patternMetrics.forEach(metric => {
    const icon = metric.alerts.length > 0 ? '⚠️' :
                 metric.trends.successRateTrend === 'improving' ? '📈' :
                 metric.trends.successRateTrend === 'declining' ? '📉' : '📊';

    markdown += `### ${icon} ${metric.patternName}\n\n`;
    markdown += `- **Status:** ${metric.status}\n`;
    markdown += `- **Success Rate:** ${metric.performance.successRate.toFixed(1)}%`;
    markdown += ` (${metric.trends.successRateTrend})\n`;
    markdown += `- **Applications:** ${metric.performance.applications}`;
    markdown += ` (${metric.trends.applicationsTrend})\n`;
    markdown += `- **Average Impact:** ${metric.performance.averageImpact.toFixed(1)} points`;
    markdown += ` (${metric.trends.impactTrend})\n`;

    if (metric.alerts.length > 0) {
      markdown += `\n**Alerts:**\n`;
      metric.alerts.forEach(alert => {
        markdown += `- 🚨 ${alert.severity.toUpperCase()}: ${alert.message}\n`;
      });
    }
    markdown += `\n`;
  });

  // Recommendations
  if (insights.recommendations.length > 0) {
    markdown += `## 💡 Recommendations\n\n`;
    insights.recommendations.forEach((rec, idx) => {
      const icon = rec.priority === 'critical' ? '🔴' :
                   rec.priority === 'high' ? '🟡' : '🟢';
      markdown += `${idx + 1}. ${icon} **${rec.type.replace(/_/g, ' ').toUpperCase()}** (${rec.priority})\n`;
      markdown += `   - ${rec.message}\n`;
      markdown += `   - **Action:** ${rec.action}\n`;
      if (rec.pages) {
        markdown += `   - **Affected Pages:** ${rec.pages.join(', ')}\n`;
      }
      markdown += `\n`;
    });
  }

  // History
  markdown += `## Performance History\n\n`;
  markdown += `- **Total Snapshots:** ${history.snapshots.length}\n`;
  if (history.snapshots.length > 0) {
    markdown += `- **Oldest Snapshot:** ${history.snapshots[0].timestamp}\n`;
    markdown += `- **Latest Snapshot:** ${history.snapshots[history.snapshots.length - 1].timestamp}\n`;

    // Show score trend
    if (history.snapshots.length >= 2) {
      const recent = history.snapshots.slice(-5);
      markdown += `\n### Recent Score Trend\n\n`;
      markdown += `| Timestamp | Avg Score | Total Pages |\n`;
      markdown += `|-----------|-----------|-------------|\n`;
      recent.forEach(snap => {
        markdown += `| ${snap.timestamp.split('T')[0]} | ${snap.summary.averageScore.toFixed(1)} | ${snap.summary.totalPages} |\n`;
      });
    }
  }

  const mdFile = path.join(CONFIG.reportsDir, 'performance-monitoring.md');
  fs.writeFileSync(mdFile, markdown);

  return { jsonFile, mdFile };
}

/**
 * Main monitoring function
 */
async function monitor() {
  console.log('🔍 Production Performance Monitoring\n');

  ensureDirectories();

  // Run UX analysis
  const currentAnalysis = runUXAnalysis();
  if (!currentAnalysis) {
    console.error('❌ Failed to get current UX analysis');
    return;
  }

  // Load data
  const library = loadPatternLibrary();
  const history = loadPerformanceHistory();
  const alerts = loadAlerts();

  // Get production patterns
  const productionPatterns = getProductionPatterns(library);
  console.log(`\n📊 Monitoring ${productionPatterns.length} production patterns...`);

  // Calculate pattern metrics
  const patternMetrics = productionPatterns.map(pattern =>
    calculatePatternMetrics(pattern, currentAnalysis, history)
  );

  // Detect regressions
  const regressions = detectRegressions(currentAnalysis, history, options.threshold);

  // Generate insights
  const insights = generateInsights(patternMetrics, regressions, currentAnalysis);

  // Create snapshot
  const snapshot = createSnapshot(currentAnalysis, patternMetrics);
  history.snapshots.push(snapshot);

  // Keep only last 100 snapshots
  if (history.snapshots.length > 100) {
    history.snapshots = history.snapshots.slice(-100);
  }

  // Save history
  savePerformanceHistory(history);

  // Add new alerts
  if (regressions.length > 0 || patternMetrics.some(p => p.alerts.length > 0)) {
    const newAlerts = [
      ...regressions.map(r => ({
        type: 'regression',
        severity: r.severity,
        page: r.page,
        message: `Performance regression: ${r.decline.toFixed(1)} point decline`,
        timestamp: r.timestamp,
        resolved: false
      })),
      ...patternMetrics.flatMap(p =>
        p.alerts.map(a => ({
          type: a.type,
          severity: a.severity,
          pattern: p.patternName,
          message: a.message,
          timestamp: new Date().toISOString(),
          resolved: false
        }))
      )
    ];

    alerts.alerts.push(...newAlerts);
    saveAlerts(alerts);
  }

  // Generate report
  const { jsonFile, mdFile } = generateReport(patternMetrics, regressions, insights, history);

  // Print results
  console.log(`\n✅ Monitoring complete!\n`);
  console.log(`📊 Overall Health: ${insights.summary.overallHealth.toUpperCase()}`);
  console.log(`📈 Patterns Improving: ${insights.patterns.improving}`);
  console.log(`📉 Patterns Declining: ${insights.patterns.declining}`);
  console.log(`⚠️  Regressions: ${regressions.length}`);
  console.log(`💡 Recommendations: ${insights.recommendations.length}`);

  if (insights.recommendations.length > 0) {
    console.log(`\n💡 Top Recommendations:`);
    insights.recommendations.slice(0, 3).forEach((rec, idx) => {
      console.log(`${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
    });
  }

  console.log(`\n📄 Reports saved:`);
  console.log(`   - ${jsonFile}`);
  console.log(`   - ${mdFile}`);
}

/**
 * Run monitoring
 */
if (options.daemon) {
  console.log(`🔄 Starting daemon mode (interval: ${CONFIG.monitoringInterval}ms)...`);

  // Initial run
  monitor();

  // Run periodically
  setInterval(monitor, CONFIG.monitoringInterval);
} else {
  monitor().catch(error => {
    console.error('❌ Monitoring failed:', error);
    process.exit(1);
  });
}

// Export functions for testing
module.exports = {
  loadPatternLibrary,
  loadPerformanceHistory,
  getProductionPatterns,
  calculatePatternMetrics,
  detectRegressions,
  generateInsights,
  createSnapshot
};
