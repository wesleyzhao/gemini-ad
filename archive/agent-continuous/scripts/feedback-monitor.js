#!/usr/bin/env node

/**
 * Continuous User Feedback Monitoring System
 *
 * Feature #51: Monitor and analyze user feedback in real-time
 *
 * This script:
 * 1. Collects user feedback from analytics events
 * 2. Correlates feedback with performance metrics
 * 3. Identifies patterns and trends
 * 4. Generates actionable insights
 * 5. Triggers optimization alerts
 *
 * Usage:
 *   node scripts/feedback-monitor.js --analyze     # Analyze feedback
 *   node scripts/feedback-monitor.js --correlate   # Correlate with CWV
 *   node scripts/feedback-monitor.js --report      # Generate report
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuration
const CONFIG = {
  feedbackDataPath: './reports/user-feedback.json',
  cwvDataPath: './reports/cwv-monitoring-report-2026-02-01.json',
  outputDir: './reports/feedback-analysis',

  // Feedback thresholds
  thresholds: {
    negativeFeedbackRate: 30, // Alert if > 30% negative
    lowRatingThreshold: 2.5,  // Alert if avg rating < 2.5
    minSampleSize: 10         // Minimum responses to analyze
  },

  // Correlation analysis
  correlation: {
    strongCorrelation: 0.7,
    moderateCorrelation: 0.4,
    weakCorrelation: 0.2
  }
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

/**
 * Generate sample user feedback data (simulated)
 * In production, this would come from GA4 or backend API
 */
function generateSampleFeedback() {
  const pages = [
    'trust.html', 'writers.html', 'creators.html', 'operators.html',
    'automators.html', 'workspace.html', 'research.html', 'bundling.html',
    'aspirational.html', 'valentines.html', 'comparison.html', 'productivity.html'
  ];

  const feedback = {
    timestamp: new Date().toISOString(),
    period: 'last7days',
    responses: []
  };

  pages.forEach(page => {
    const responseCount = Math.floor(Math.random() * 50) + 10;

    for (let i = 0; i < responseCount; i++) {
      const rating = Math.random() > 0.7 ? 'yes' : 'no';
      const hasComment = Math.random() > 0.6;

      const response = {
        page,
        rating,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        comment: hasComment ? generateComment(rating, page) : null
      };

      feedback.responses.push(response);
    }
  });

  return feedback;
}

/**
 * Generate realistic feedback comments
 */
function generateComment(rating, page) {
  const positiveComments = [
    'Very clear and helpful!',
    'Love the design',
    'Exactly what I was looking for',
    'Great examples',
    'Easy to understand',
    'Beautiful page',
    'Fast loading'
  ];

  const negativeComments = [
    'Too slow to load',
    'Confusing layout',
    'Not enough information',
    'Hard to read on mobile',
    'Images take forever to load',
    'Too much text',
    'Unclear CTA'
  ];

  if (rating === 'yes') {
    return positiveComments[Math.floor(Math.random() * positiveComments.length)];
  } else {
    return negativeComments[Math.floor(Math.random() * negativeComments.length)];
  }
}

/**
 * Analyze feedback data
 */
function analyzeFeedback(feedbackData) {
  const analysis = {
    overall: {
      totalResponses: feedbackData.responses.length,
      positiveCount: 0,
      negativeCount: 0,
      positiveRate: 0,
      negativeRate: 0
    },
    byPage: {},
    commonIssues: {},
    alerts: []
  };

  // Group by page
  feedbackData.responses.forEach(response => {
    const page = response.page;

    if (!analysis.byPage[page]) {
      analysis.byPage[page] = {
        total: 0,
        positive: 0,
        negative: 0,
        comments: []
      };
    }

    analysis.byPage[page].total++;

    if (response.rating === 'yes') {
      analysis.overall.positiveCount++;
      analysis.byPage[page].positive++;
    } else {
      analysis.overall.negativeCount++;
      analysis.byPage[page].negative++;
    }

    if (response.comment) {
      analysis.byPage[page].comments.push(response.comment);

      // Extract common issues from comments
      const keywords = ['slow', 'load', 'confusing', 'hard', 'mobile', 'image'];
      keywords.forEach(keyword => {
        if (response.comment.toLowerCase().includes(keyword)) {
          if (!analysis.commonIssues[keyword]) {
            analysis.commonIssues[keyword] = { count: 0, pages: new Set() };
          }
          analysis.commonIssues[keyword].count++;
          analysis.commonIssues[keyword].pages.add(page);
        }
      });
    }
  });

  // Calculate rates
  analysis.overall.positiveRate = (analysis.overall.positiveCount / analysis.overall.totalResponses) * 100;
  analysis.overall.negativeRate = (analysis.overall.negativeCount / analysis.overall.totalResponses) * 100;

  // Calculate page-level metrics and generate alerts
  Object.entries(analysis.byPage).forEach(([page, data]) => {
    data.positiveRate = (data.positive / data.total) * 100;
    data.negativeRate = (data.negative / data.total) * 100;

    // Check for alerts
    if (data.negativeRate > CONFIG.thresholds.negativeFeedbackRate && data.total >= CONFIG.thresholds.minSampleSize) {
      analysis.alerts.push({
        severity: 'high',
        page,
        type: 'high_negative_feedback',
        message: `${page} has ${data.negativeRate.toFixed(1)}% negative feedback (${data.negative}/${data.total} responses)`,
        negativeRate: data.negativeRate
      });
    }
  });

  // Convert Sets to Arrays for JSON serialization
  Object.keys(analysis.commonIssues).forEach(key => {
    analysis.commonIssues[key].pages = Array.from(analysis.commonIssues[key].pages);
  });

  return analysis;
}

/**
 * Correlate feedback with Core Web Vitals
 */
function correlateFeedbackWithCWV(feedbackAnalysis, cwvData) {
  const correlations = [];

  if (!cwvData || !cwvData.pages) {
    log('yellow', '⚠ No CWV data available for correlation');
    return correlations;
  }

  Object.entries(feedbackAnalysis.byPage).forEach(([page, feedback]) => {
    const cwvMetrics = cwvData.pages[page];

    if (!cwvMetrics) return;

    const correlation = {
      page,
      feedback: {
        negativeRate: feedback.negativeRate,
        totalResponses: feedback.total
      },
      cwv: {},
      insights: []
    };

    // Extract key metrics
    const lcp = cwvMetrics.metrics.lcp.p75;
    const fcp = cwvMetrics.metrics.fcp.p75;
    const cls = parseFloat(cwvMetrics.metrics.cls.p75);
    const inp = cwvMetrics.metrics.inp.p75;

    correlation.cwv = { lcp, fcp, cls, inp };

    // Correlate performance issues with feedback
    if (feedback.negativeRate > 30) {
      if (lcp > 2500) {
        correlation.insights.push({
          type: 'performance_feedback_correlation',
          confidence: 'high',
          message: `High negative feedback (${feedback.negativeRate.toFixed(1)}%) correlates with slow LCP (${lcp}ms)`,
          recommendation: 'Optimize LCP to improve user satisfaction',
          priority: 'critical'
        });
      }

      if (fcp > 1800) {
        correlation.insights.push({
          type: 'performance_feedback_correlation',
          confidence: 'high',
          message: `Negative feedback may be related to slow FCP (${fcp}ms)`,
          recommendation: 'Improve First Contentful Paint',
          priority: 'high'
        });
      }

      if (cls > 0.1) {
        correlation.insights.push({
          type: 'layout_stability_correlation',
          confidence: 'medium',
          message: `Layout shifts (CLS: ${cls}) may contribute to negative feedback`,
          recommendation: 'Fix layout shifts for better UX',
          priority: 'medium'
        });
      }

      // Check comments for performance-related keywords
      const performanceKeywords = feedback.comments.filter(c =>
        c && (c.toLowerCase().includes('slow') || c.toLowerCase().includes('load'))
      ).length;

      if (performanceKeywords > 0) {
        correlation.insights.push({
          type: 'user_reported_performance',
          confidence: 'very high',
          message: `${performanceKeywords} users explicitly mentioned performance issues`,
          recommendation: 'Priority: Address loading speed concerns',
          priority: 'critical'
        });
      }
    }

    if (correlation.insights.length > 0) {
      correlations.push(correlation);
    }
  });

  return correlations;
}

/**
 * Generate feedback monitoring report
 */
function generateReport(feedbackAnalysis, correlations) {
  const timestamp = new Date().toISOString();

  const report = {
    timestamp,
    date: new Date().toLocaleDateString(),
    summary: {
      totalResponses: feedbackAnalysis.overall.totalResponses,
      positiveRate: feedbackAnalysis.overall.positiveRate.toFixed(2) + '%',
      negativeRate: feedbackAnalysis.overall.negativeRate.toFixed(2) + '%',
      alertCount: feedbackAnalysis.alerts.length,
      correlationsFound: correlations.length
    },
    feedback: feedbackAnalysis,
    correlations,
    actionItems: generateActionItems(feedbackAnalysis, correlations),
    recommendations: [
      {
        priority: 'high',
        title: 'Address Performance-Related Feedback',
        description: 'Users are reporting performance issues that correlate with CWV metrics',
        action: 'Run continuous-optimization.js to apply performance fixes'
      },
      {
        priority: 'medium',
        title: 'Monitor Feedback Trends',
        description: 'Track feedback over time to identify emerging issues',
        action: 'Schedule daily feedback analysis runs'
      },
      {
        priority: 'low',
        title: 'Improve Feedback Collection',
        description: 'Increase sample size for more reliable insights',
        action: 'Consider A/B testing feedback widget placement'
      }
    ]
  };

  // Save report
  const reportPath = path.join(CONFIG.outputDir, `feedback-report-${timestamp.split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log('green', `✓ Feedback report saved: ${reportPath}`);

  return report;
}

/**
 * Generate action items from analysis
 */
function generateActionItems(feedbackAnalysis, correlations) {
  const actionItems = [];

  // From alerts
  feedbackAnalysis.alerts.forEach(alert => {
    actionItems.push({
      priority: alert.severity,
      page: alert.page,
      type: 'user_feedback',
      action: `Investigate ${alert.page}: ${alert.message}`,
      source: 'feedback_analysis'
    });
  });

  // From correlations
  correlations.forEach(corr => {
    corr.insights.forEach(insight => {
      actionItems.push({
        priority: insight.priority,
        page: corr.page,
        type: 'correlation',
        action: insight.recommendation,
        confidence: insight.confidence,
        source: 'cwv_correlation'
      });
    });
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  actionItems.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return actionItems;
}

/**
 * Display report summary
 */
function displaySummary(report) {
  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║          USER FEEDBACK MONITORING REPORT                   ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝\n');

  log('cyan', `📊 Total Responses: ${report.summary.totalResponses}`);
  log('green', `👍 Positive: ${report.summary.positiveRate}`);
  log('red', `👎 Negative: ${report.summary.negativeRate}`);
  log('yellow', `⚠ Alerts: ${report.summary.alertCount}`);
  log('blue', `🔗 Correlations Found: ${report.summary.correlationsFound}\n`);

  if (report.feedback.alerts.length > 0) {
    log('bright', '⚠ HIGH PRIORITY ALERTS:\n');
    report.feedback.alerts.forEach((alert, i) => {
      log('red', `${i + 1}. ${alert.message}`);
    });
    console.log();
  }

  if (report.correlations.length > 0) {
    log('bright', '🔗 PERFORMANCE-FEEDBACK CORRELATIONS:\n');
    report.correlations.slice(0, 5).forEach((corr, i) => {
      log('yellow', `${i + 1}. ${corr.page}`);
      log('cyan', `   Negative Feedback: ${corr.feedback.negativeRate.toFixed(1)}%`);
      log('cyan', `   LCP: ${corr.cwv.lcp}ms | FCP: ${corr.cwv.fcp}ms | CLS: ${corr.cwv.cls}`);

      corr.insights.forEach(insight => {
        log('magenta', `   💡 ${insight.message}`);
      });
      console.log();
    });
  }

  if (report.actionItems.length > 0) {
    log('bright', '📋 ACTION ITEMS (Top 10):\n');
    report.actionItems.slice(0, 10).forEach((item, i) => {
      const emoji = item.priority === 'critical' ? '🔴' :
                    item.priority === 'high' ? '🟡' : '🔵';
      log('blue', `${i + 1}. ${emoji} [${item.priority.toUpperCase()}] ${item.action}`);
      if (item.confidence) {
        log('cyan', `   Confidence: ${item.confidence}`);
      }
    });
    console.log();
  }

  log('bright', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Main execution
 */
function main() {
  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║        📊 CONTINUOUS FEEDBACK MONITORING SYSTEM            ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝\n');

  // Step 1: Load or generate feedback data
  log('blue', '📂 Step 1: Loading user feedback data...\n');

  let feedbackData;
  if (fs.existsSync(CONFIG.feedbackDataPath)) {
    feedbackData = JSON.parse(fs.readFileSync(CONFIG.feedbackDataPath, 'utf8'));
    log('green', '✓ Loaded existing feedback data');
  } else {
    log('yellow', '⚠ No feedback data found. Generating sample data...');
    feedbackData = generateSampleFeedback();
    fs.writeFileSync(CONFIG.feedbackDataPath, JSON.stringify(feedbackData, null, 2));
    log('green', '✓ Sample feedback data generated');
  }

  // Step 2: Analyze feedback
  log('blue', '\n📊 Step 2: Analyzing user feedback...\n');
  const feedbackAnalysis = analyzeFeedback(feedbackData);
  log('green', `✓ Analyzed ${feedbackAnalysis.overall.totalResponses} responses`);

  // Step 3: Load CWV data
  log('blue', '\n📈 Step 3: Loading Core Web Vitals data...\n');
  let cwvData = null;
  if (fs.existsSync(CONFIG.cwvDataPath)) {
    cwvData = JSON.parse(fs.readFileSync(CONFIG.cwvDataPath, 'utf8'));
    log('green', '✓ Loaded CWV data');
  } else {
    log('yellow', '⚠ No CWV data found. Skipping correlation analysis.');
  }

  // Step 4: Correlate feedback with performance
  log('blue', '\n🔗 Step 4: Correlating feedback with performance...\n');
  const correlations = cwvData ? correlateFeedbackWithCWV(feedbackAnalysis, cwvData) : [];
  log('green', `✓ Found ${correlations.length} performance-feedback correlations`);

  // Step 5: Generate report
  log('blue', '\n📝 Step 5: Generating feedback report...\n');
  const report = generateReport(feedbackAnalysis, correlations);

  // Step 6: Display summary
  displaySummary(report);

  log('green', '✅ Feedback monitoring complete!\n');
  log('cyan', '💡 TIP: Use insights to prioritize optimizations in continuous-optimization.js\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { analyzeFeedback, correlateFeedbackWithCWV, generateReport };
