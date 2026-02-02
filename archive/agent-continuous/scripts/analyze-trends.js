#!/usr/bin/env node

/**
 * Core Web Vitals Trend Analysis & Insight Generation
 *
 * Feature #50: Analyze real user data trends and implement performance improvements
 *
 * This script analyzes historical CWV data to:
 * - Identify performance trends (improving/degrading)
 * - Detect patterns and anomalies
 * - Generate actionable insights
 * - Prioritize optimization opportunities
 * - Track impact of changes
 *
 * Usage:
 *   node scripts/analyze-trends.js --analyze      # Analyze trends
 *   node scripts/analyze-trends.js --insights     # Generate insights
 *   node scripts/analyze-trends.js --recommend    # Get recommendations
 *   node scripts/analyze-trends.js --full-report  # Complete analysis
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  reportsDir: './reports',
  outputDir: './reports/analysis',
  historicalDataDir: './reports/historical',
  insightsFile: './reports/analysis/insights.json',
  recommendationsFile: './reports/analysis/recommendations.json',
  trendReportFile: './reports/analysis/trend-report.json',

  // Trend detection thresholds
  trends: {
    significantChange: 5,      // 5% change is significant
    criticalChange: 15,        // 15% change is critical
    improvementThreshold: 3,   // 3% improvement worth noting
    degradationThreshold: 3    // 3% degradation worth noting
  },

  // Analysis configuration
  analysis: {
    minDataPoints: 2,          // Minimum data points for trend analysis
    outlierThreshold: 2.5,     // Standard deviations for outlier detection
    confidenceLevel: 0.95      // 95% confidence interval
  }
};

// Ensure output directories exist
[CONFIG.outputDir, CONFIG.historicalDataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Load historical CWV data
 */
function loadHistoricalData() {
  const reports = [];

  // Load existing monitoring reports
  const reportsDir = CONFIG.reportsDir;
  if (!fs.existsSync(reportsDir)) {
    console.log('⚠️  No reports directory found');
    return reports;
  }

  const files = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('cwv-monitoring-report-') && f.endsWith('.json'))
    .sort();

  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
      reports.push({
        file,
        timestamp: data.timestamp,
        date: new Date(data.timestamp),
        data
      });
    } catch (error) {
      console.error(`Error loading ${file}:`, error.message);
    }
  });

  console.log(`📂 Loaded ${reports.length} historical reports`);
  return reports;
}

/**
 * Calculate trend between two data points
 */
function calculateTrend(oldValue, newValue) {
  if (!oldValue || oldValue === 0) return null;

  const change = newValue - oldValue;
  const percentChange = (change / oldValue) * 100;

  let trend = 'stable';
  if (Math.abs(percentChange) >= CONFIG.trends.criticalChange) {
    trend = percentChange > 0 ? 'critical-degradation' : 'critical-improvement';
  } else if (Math.abs(percentChange) >= CONFIG.trends.significantChange) {
    trend = percentChange > 0 ? 'degrading' : 'improving';
  } else if (Math.abs(percentChange) >= CONFIG.trends.improvementThreshold) {
    trend = percentChange > 0 ? 'slightly-degrading' : 'slightly-improving';
  }

  return {
    change,
    percentChange: parseFloat(percentChange.toFixed(2)),
    trend,
    direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable'
  };
}

/**
 * Analyze metric trends across all pages
 */
function analyzeMetricTrends(reports) {
  if (reports.length < CONFIG.analysis.minDataPoints) {
    return { error: 'Insufficient data for trend analysis' };
  }

  const latest = reports[reports.length - 1];
  const previous = reports[reports.length - 2];

  const trends = {
    timestamp: latest.timestamp,
    comparisonPeriod: {
      from: previous.timestamp,
      to: latest.timestamp
    },
    metrics: {},
    pages: {}
  };

  // Analyze each metric across all pages
  const metrics = ['lcp', 'fid', 'inp', 'cls', 'fcp', 'ttfb'];

  metrics.forEach(metric => {
    const metricData = {
      overallTrend: null,
      pagesImproving: [],
      pagesDegrading: [],
      pagesStable: [],
      avgChange: 0
    };

    let totalChange = 0;
    let pageCount = 0;

    Object.keys(latest.data.pages).forEach(page => {
      const latestMetric = latest.data.pages[page]?.metrics?.[metric]?.p75;
      const previousMetric = previous.data.pages[page]?.metrics?.[metric]?.p75;

      if (latestMetric && previousMetric) {
        const trend = calculateTrend(
          parseFloat(previousMetric),
          parseFloat(latestMetric)
        );

        if (trend) {
          totalChange += trend.percentChange;
          pageCount++;

          const pageInfo = {
            page,
            oldValue: parseFloat(previousMetric),
            newValue: parseFloat(latestMetric),
            ...trend
          };

          if (trend.trend.includes('improving')) {
            metricData.pagesImproving.push(pageInfo);
          } else if (trend.trend.includes('degrading')) {
            metricData.pagesDegrading.push(pageInfo);
          } else {
            metricData.pagesStable.push(pageInfo);
          }
        }
      }
    });

    if (pageCount > 0) {
      metricData.avgChange = parseFloat((totalChange / pageCount).toFixed(2));

      // Determine overall trend
      if (Math.abs(metricData.avgChange) >= CONFIG.trends.significantChange) {
        metricData.overallTrend = metricData.avgChange > 0 ? 'degrading' : 'improving';
      } else {
        metricData.overallTrend = 'stable';
      }
    }

    // Sort by magnitude of change
    metricData.pagesImproving.sort((a, b) => a.percentChange - b.percentChange);
    metricData.pagesDegrading.sort((a, b) => b.percentChange - a.percentChange);

    trends.metrics[metric] = metricData;
  });

  return trends;
}

/**
 * Generate insights from trend data
 */
function generateInsights(trends, reports) {
  const insights = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: 0,
      improvingPages: 0,
      degradingPages: 0,
      stablePages: 0
    },
    keyFindings: [],
    opportunities: [],
    concerns: [],
    patterns: []
  };

  // Analyze overall patterns
  const latest = reports[reports.length - 1].data;
  insights.summary.totalPages = Object.keys(latest.pages).length;

  // Key findings from metric trends
  Object.entries(trends.metrics).forEach(([metric, data]) => {
    const metricName = metric.toUpperCase();

    // Improvements
    if (data.pagesImproving.length > 0) {
      insights.keyFindings.push({
        type: 'improvement',
        metric,
        message: `${data.pagesImproving.length} pages showing ${metricName} improvement`,
        impact: data.pagesImproving.length >= insights.summary.totalPages / 2 ? 'high' : 'medium',
        details: data.pagesImproving.slice(0, 3).map(p => ({
          page: p.page,
          improvement: `${Math.abs(p.percentChange).toFixed(1)}% faster`
        }))
      });
    }

    // Degradations
    if (data.pagesDegrading.length > 0) {
      const severity = data.pagesDegrading.some(p => p.trend === 'critical-degradation') ? 'critical' : 'warning';

      insights.concerns.push({
        type: 'degradation',
        metric,
        severity,
        message: `${data.pagesDegrading.length} pages showing ${metricName} degradation`,
        impact: data.pagesDegrading.length >= insights.summary.totalPages / 2 ? 'high' : 'medium',
        details: data.pagesDegrading.slice(0, 3).map(p => ({
          page: p.page,
          degradation: `${Math.abs(p.percentChange).toFixed(1)}% slower`
        }))
      });
    }
  });

  // Identify optimization opportunities
  const allIssues = latest.issues || [];
  const issuesByMetric = {};

  allIssues.forEach(issue => {
    if (!issuesByMetric[issue.metric]) {
      issuesByMetric[issue.metric] = [];
    }
    issuesByMetric[issue.metric].push(issue);
  });

  // Top optimization opportunities
  Object.entries(issuesByMetric).forEach(([metric, issues]) => {
    if (issues.length >= 3) {
      insights.opportunities.push({
        metric,
        affectedPages: issues.length,
        priority: issues.length >= insights.summary.totalPages / 2 ? 'high' : 'medium',
        impact: `Fixing ${metric.toUpperCase()} could improve ${issues.length} pages`,
        commonRecommendations: getCommonRecommendations(issues)
      });
    }
  });

  // Detect patterns
  insights.patterns = detectPatterns(latest, trends);

  return insights;
}

/**
 * Get most common recommendations
 */
function getCommonRecommendations(issues) {
  const recCounts = {};

  issues.forEach(issue => {
    if (issue.recommendation) {
      issue.recommendation.forEach(rec => {
        recCounts[rec] = (recCounts[rec] || 0) + 1;
      });
    }
  });

  return Object.entries(recCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([rec, count]) => ({ recommendation: rec, frequency: count }));
}

/**
 * Detect patterns in data
 */
function detectPatterns(latestData, trends) {
  const patterns = [];

  // Device-specific patterns
  const deviceIssues = { mobile: 0, desktop: 0, tablet: 0 };
  Object.values(latestData.pages).forEach(page => {
    if (page.devices) {
      if (page.devices.mobile > 70) deviceIssues.mobile++;
      if (page.devices.desktop > 30) deviceIssues.desktop++;
      if (page.devices.tablet > 10) deviceIssues.tablet++;
    }
  });

  if (deviceIssues.mobile > Object.keys(latestData.pages).length / 2) {
    patterns.push({
      type: 'device',
      pattern: 'mobile-heavy',
      message: 'Majority of traffic from mobile devices',
      recommendation: 'Prioritize mobile performance optimizations'
    });
  }

  // Connection-specific patterns
  const slow3gPages = [];
  Object.entries(latestData.pages).forEach(([page, data]) => {
    if (data.connections && data.connections['3g'] > 10) {
      slow3gPages.push(page);
    }
  });

  if (slow3gPages.length > 0) {
    patterns.push({
      type: 'connection',
      pattern: 'slow-connection-users',
      message: `${slow3gPages.length} pages have significant 3G traffic`,
      recommendation: 'Implement aggressive resource optimization for slow connections',
      affectedPages: slow3gPages.slice(0, 5)
    });
  }

  // Metric correlation patterns
  const clsAndLcpIssues = [];
  Object.entries(latestData.pages).forEach(([page, data]) => {
    const hasLcpIssue = data.metrics?.lcp?.p75 > 2500;
    const hasClsIssue = parseFloat(data.metrics?.cls?.p75) > 0.1;

    if (hasLcpIssue && hasClsIssue) {
      clsAndLcpIssues.push(page);
    }
  });

  if (clsAndLcpIssues.length >= 3) {
    patterns.push({
      type: 'correlation',
      pattern: 'cls-lcp-correlation',
      message: 'CLS and LCP issues often occur together',
      recommendation: 'Font loading optimization could fix both issues',
      affectedPages: clsAndLcpIssues
    });
  }

  return patterns;
}

/**
 * Generate prioritized recommendations
 */
function generateRecommendations(insights, trends) {
  const recommendations = {
    timestamp: new Date().toISOString(),
    high_priority: [],
    medium_priority: [],
    low_priority: [],
    quick_wins: []
  };

  // High priority: Critical degradations
  insights.concerns.forEach(concern => {
    if (concern.severity === 'critical') {
      recommendations.high_priority.push({
        title: `Fix critical ${concern.metric.toUpperCase()} degradation`,
        description: concern.message,
        affectedPages: concern.details.map(d => d.page),
        estimatedImpact: 'high',
        effort: 'medium',
        actions: getActionItems(concern.metric, 'critical')
      });
    }
  });

  // Medium priority: Opportunities
  insights.opportunities.forEach(opp => {
    if (opp.priority === 'high') {
      recommendations.medium_priority.push({
        title: `Optimize ${opp.metric.toUpperCase()} across ${opp.affectedPages} pages`,
        description: opp.impact,
        affectedPages: opp.affectedPages,
        estimatedImpact: 'medium',
        effort: 'medium',
        actions: opp.commonRecommendations.map(r => r.recommendation)
      });
    }
  });

  // Quick wins: Easy improvements
  insights.patterns.forEach(pattern => {
    if (pattern.type === 'correlation') {
      recommendations.quick_wins.push({
        title: 'Font loading optimization',
        description: pattern.message,
        affectedPages: pattern.affectedPages,
        estimatedImpact: 'medium',
        effort: 'low',
        actions: [
          'Add font-display: swap to all @font-face declarations',
          'Preload critical fonts',
          'Use system fonts for initial render'
        ]
      });
    }
  });

  // Sort by impact
  const sortByImpact = (a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.estimatedImpact] - impactOrder[a.estimatedImpact];
  };

  recommendations.high_priority.sort(sortByImpact);
  recommendations.medium_priority.sort(sortByImpact);
  recommendations.quick_wins.sort(sortByImpact);

  return recommendations;
}

/**
 * Get action items for specific metric
 */
function getActionItems(metric, severity = 'medium') {
  const actions = {
    lcp: [
      'Optimize and compress hero images',
      'Add preconnect hints for external resources',
      'Implement critical CSS inlining',
      'Use CDN for static assets',
      'Enable text compression (Brotli/gzip)'
    ],
    fcp: [
      'Minimize render-blocking CSS',
      'Defer non-critical JavaScript',
      'Optimize font loading strategy',
      'Reduce server response time'
    ],
    cls: [
      'Set explicit dimensions on images and videos',
      'Preload web fonts with font-display: swap',
      'Reserve space for dynamic content',
      'Avoid inserting content above existing content'
    ],
    inp: [
      'Break up long JavaScript tasks',
      'Use passive event listeners',
      'Optimize CSS animations',
      'Reduce JavaScript execution time'
    ],
    ttfb: [
      'Enable server-side caching',
      'Use a Content Delivery Network (CDN)',
      'Optimize database queries',
      'Enable HTTP/2 or HTTP/3'
    ],
    fid: [
      'Minimize main thread work',
      'Reduce JavaScript execution time',
      'Break up Long Tasks',
      'Use web workers for heavy computation'
    ]
  };

  const baseActions = actions[metric.toLowerCase()] || [];

  if (severity === 'critical') {
    return ['URGENT: ' + baseActions[0], ...baseActions.slice(1)];
  }

  return baseActions;
}

/**
 * Generate comprehensive trend report
 */
function generateTrendReport(reports, trends, insights, recommendations) {
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      reportType: 'Core Web Vitals Trend Analysis',
      dataPoints: reports.length,
      period: {
        from: reports[0]?.timestamp,
        to: reports[reports.length - 1]?.timestamp
      }
    },

    executive_summary: {
      overview: generateExecutiveSummary(insights, trends),
      topPriorities: recommendations.high_priority.slice(0, 3),
      quickWins: recommendations.quick_wins.slice(0, 3),
      keyMetrics: generateKeyMetrics(trends)
    },

    detailed_analysis: {
      trends,
      insights,
      recommendations
    },

    action_plan: generateActionPlan(recommendations),

    monitoring_dashboard: {
      metricsToWatch: generateMetricsToWatch(insights),
      alertsActive: insights.concerns.length,
      nextReviewDate: getNextReviewDate()
    }
  };

  return report;
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(insights, trends) {
  const improving = insights.keyFindings.filter(f => f.type === 'improvement').length;
  const concerns = insights.concerns.length;
  const opportunities = insights.opportunities.length;

  let summary = '';

  if (concerns > improving) {
    summary = `⚠️ Performance regression detected. ${concerns} areas need attention. `;
  } else if (improving > concerns) {
    summary = `✅ Performance improving overall. ${improving} positive trends identified. `;
  } else {
    summary = `📊 Performance stable. `;
  }

  if (opportunities > 0) {
    summary += `${opportunities} optimization opportunities available for quick wins.`;
  }

  return summary;
}

/**
 * Generate key metrics summary
 */
function generateKeyMetrics(trends) {
  const metrics = [];

  Object.entries(trends.metrics).forEach(([metric, data]) => {
    metrics.push({
      metric: metric.toUpperCase(),
      trend: data.overallTrend,
      avgChange: data.avgChange + '%',
      improving: data.pagesImproving.length,
      degrading: data.pagesDegrading.length,
      stable: data.pagesStable.length
    });
  });

  return metrics;
}

/**
 * Generate action plan
 */
function generateActionPlan(recommendations) {
  const plan = {
    immediate: [],
    thisWeek: [],
    thisMonth: []
  };

  // Immediate: High priority items
  recommendations.high_priority.slice(0, 2).forEach(rec => {
    plan.immediate.push({
      task: rec.title,
      pages: rec.affectedPages,
      actions: rec.actions
    });
  });

  // This week: Quick wins
  recommendations.quick_wins.slice(0, 3).forEach(rec => {
    plan.thisWeek.push({
      task: rec.title,
      pages: rec.affectedPages,
      actions: rec.actions
    });
  });

  // This month: Medium priority
  recommendations.medium_priority.slice(0, 3).forEach(rec => {
    plan.thisMonth.push({
      task: rec.title,
      pages: rec.affectedPages,
      actions: rec.actions
    });
  });

  return plan;
}

/**
 * Generate metrics to watch
 */
function generateMetricsToWatch(insights) {
  const toWatch = [];

  // Add concerning metrics
  insights.concerns.forEach(concern => {
    toWatch.push({
      metric: concern.metric.toUpperCase(),
      reason: concern.message,
      threshold: 'Monitor for further degradation',
      checkFrequency: 'daily'
    });
  });

  // Add improving metrics to track success
  insights.keyFindings
    .filter(f => f.type === 'improvement')
    .slice(0, 2)
    .forEach(finding => {
      toWatch.push({
        metric: finding.metric.toUpperCase(),
        reason: 'Track continued improvement',
        threshold: 'Maintain current trend',
        checkFrequency: 'weekly'
      });
    });

  return toWatch;
}

/**
 * Get next review date
 */
function getNextReviewDate() {
  const next = new Date();
  next.setDate(next.getDate() + 7); // Weekly review
  return next.toISOString();
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--full-report';

  console.log('\n🔍 Core Web Vitals Trend Analysis');
  console.log('====================================\n');

  // Load historical data
  const reports = loadHistoricalData();

  if (reports.length < CONFIG.analysis.minDataPoints) {
    console.log('⚠️  Insufficient data for trend analysis');
    console.log(`   Need at least ${CONFIG.analysis.minDataPoints} reports, found ${reports.length}`);
    console.log('   Run monitoring first: npm run monitor:cwv\n');
    return;
  }

  console.log(`✅ Analyzing ${reports.length} data points\n`);

  // Analyze trends
  const trends = analyzeMetricTrends(reports);

  if (mode === '--analyze') {
    console.log('📈 Metric Trends:\n');
    console.log(JSON.stringify(trends, null, 2));
    return;
  }

  // Generate insights
  const insights = generateInsights(trends, reports);

  if (mode === '--insights') {
    console.log('💡 Insights:\n');
    console.log(JSON.stringify(insights, null, 2));
    fs.writeFileSync(CONFIG.insightsFile, JSON.stringify(insights, null, 2));
    console.log(`\n✅ Insights saved to ${CONFIG.insightsFile}`);
    return;
  }

  // Generate recommendations
  const recommendations = generateRecommendations(insights, trends);

  if (mode === '--recommend') {
    console.log('🎯 Recommendations:\n');
    console.log(JSON.stringify(recommendations, null, 2));
    fs.writeFileSync(CONFIG.recommendationsFile, JSON.stringify(recommendations, null, 2));
    console.log(`\n✅ Recommendations saved to ${CONFIG.recommendationsFile}`);
    return;
  }

  // Full report
  const report = generateTrendReport(reports, trends, insights, recommendations);

  // Save all outputs
  fs.writeFileSync(CONFIG.trendReportFile, JSON.stringify(report, null, 2));
  fs.writeFileSync(CONFIG.insightsFile, JSON.stringify(insights, null, 2));
  fs.writeFileSync(CONFIG.recommendationsFile, JSON.stringify(recommendations, null, 2));

  // Display executive summary
  console.log('📊 EXECUTIVE SUMMARY');
  console.log('==================\n');
  console.log(report.executive_summary.overview);
  console.log('\n');

  console.log('🎯 TOP PRIORITIES:\n');
  report.executive_summary.topPriorities.forEach((priority, i) => {
    console.log(`${i + 1}. ${priority.title}`);
    console.log(`   Impact: ${priority.estimatedImpact} | Effort: ${priority.effort}`);
    console.log(`   Pages affected: ${priority.affectedPages.length}`);
    console.log('');
  });

  console.log('⚡ QUICK WINS:\n');
  report.executive_summary.quickWins.forEach((win, i) => {
    console.log(`${i + 1}. ${win.title}`);
    console.log(`   Impact: ${win.estimatedImpact} | Effort: ${win.effort}`);
    console.log('');
  });

  console.log('📈 KEY METRICS:\n');
  report.executive_summary.keyMetrics.forEach(metric => {
    const icon = metric.trend === 'improving' ? '📈' : metric.trend === 'degrading' ? '📉' : '➡️';
    console.log(`${icon} ${metric.metric}: ${metric.trend} (${metric.avgChange})`);
    console.log(`   Improving: ${metric.improving} | Degrading: ${metric.degrading} | Stable: ${metric.stable}`);
  });

  console.log('\n✅ Reports generated:');
  console.log(`   - Trend Report: ${CONFIG.trendReportFile}`);
  console.log(`   - Insights: ${CONFIG.insightsFile}`);
  console.log(`   - Recommendations: ${CONFIG.recommendationsFile}`);
  console.log('\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadHistoricalData,
  analyzeMetricTrends,
  generateInsights,
  generateRecommendations,
  generateTrendReport
};
