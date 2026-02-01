#!/usr/bin/env node

/**
 * Advanced Production Metrics Monitoring System
 *
 * Purpose: Week 2+ continuous monitoring with:
 * - Trend analysis and pattern detection
 * - Anomaly detection and alerts
 * - Predictive analytics for revenue forecasting
 * - Automated insight generation
 * - Competitive benchmarking
 *
 * Usage:
 *   node monitor-production-metrics.js [--mode=MODE] [--days=N] [--alert-threshold=N]
 *
 * Modes:
 *   - daily: Daily monitoring report (default)
 *   - weekly: Weekly trend analysis
 *   - monthly: Monthly performance review
 *   - realtime: Continuous monitoring with live updates
 *   - forecast: Revenue prediction and forecasting
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  mode: process.argv.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'daily',
  days: parseInt(process.argv.find(arg => arg.startsWith('--days='))?.split('=')[1] || '7'),
  alertThreshold: parseFloat(process.argv.find(arg => arg.startsWith('--alert-threshold='))?.split('=')[1] || '0.10'), // 10% change
  outputDir: './analytics-reports',
  dataDir: './analytics-data',

  // Performance targets
  targets: {
    conversionRate: 0.08, // 8% target
    avgSessionDuration: 90, // 90 seconds
    bounceRate: 0.35, // 35% max
    revenuePerVisitor: 13.75, // $13.75 target
  },

  // Alert thresholds
  alerts: {
    conversionDrop: 0.15, // Alert if conversion drops 15%+
    bounceIncrease: 0.20, // Alert if bounce increases 20%+
    revenueChange: 0.10, // Alert if revenue changes 10%+
    performanceRegression: 0.25, // Alert if performance drops 25%+
  }
};

// Ensure directories exist
[CONFIG.outputDir, CONFIG.dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Mock data generator for testing (replace with real GA4 data)
 */
function generateMockData(days = 30) {
  const data = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // Simulate gradual improvement with some variance
    const trend = 1 + (i / days) * 0.15; // 15% improvement over period
    const variance = 0.95 + Math.random() * 0.10; // ±5% daily variance

    data.push({
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(10000 * trend * variance),
      conversions: Math.floor(650 * trend * variance),
      conversionRate: (0.065 * trend * variance).toFixed(4),
      avgSessionDuration: Math.floor(75 * variance),
      bounceRate: (0.42 * (2 - trend) * variance).toFixed(4),
      revenue: (89375 * trend * variance).toFixed(2),
      revenuePerVisitor: (8.94 * trend * variance).toFixed(2),

      // Page-level data
      pageViews: {
        'workspace-integration.html': Math.floor(2000 * trend * variance),
        'writers.html': Math.floor(1800 * trend * variance),
        'trust.html': Math.floor(1600 * trend * variance),
        'creators.html': Math.floor(1500 * trend * variance),
        'valentine.html': Math.floor(1400 * trend * variance),
      },

      // Performance metrics
      performance: {
        LCP: (1.8 - (i / days) * 0.3 + Math.random() * 0.2).toFixed(2), // Improving
        FID: (50 - (i / days) * 10 + Math.random() * 10).toFixed(0),
        CLS: (0.08 - (i / days) * 0.02 + Math.random() * 0.01).toFixed(3),
      },

      // Device breakdown
      devices: {
        mobile: (0.65 + Math.random() * 0.05).toFixed(2),
        desktop: (0.30 + Math.random() * 0.03).toFixed(2),
        tablet: (0.05 + Math.random() * 0.02).toFixed(2),
      },

      // Traffic sources
      sources: {
        organic: Math.floor(4000 * trend * variance),
        paid: Math.floor(3000 * trend * variance),
        direct: Math.floor(2000 * trend * variance),
        referral: Math.floor(1000 * trend * variance),
      }
    });
  }

  return data;
}

/**
 * Calculate statistical metrics
 */
function calculateStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stdDev,
    variance,
  };
}

/**
 * Detect trends using linear regression
 */
function detectTrend(values) {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = values;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);

  const trendDirection = slope > 0 ? '↗️ IMPROVING' : slope < 0 ? '↘️ DECLINING' : '→ STABLE';
  const trendStrength = Math.abs(rSquared) > 0.7 ? 'STRONG' : Math.abs(rSquared) > 0.4 ? 'MODERATE' : 'WEAK';

  return {
    slope,
    intercept,
    rSquared,
    direction: trendDirection,
    strength: trendStrength,
    changePercent: ((slope * values.length / values[0]) * 100).toFixed(2),
  };
}

/**
 * Detect anomalies using Z-score method
 */
function detectAnomalies(data, metric, threshold = 2) {
  const values = data.map(d => parseFloat(d[metric]));
  const stats = calculateStats(values);

  const anomalies = data.filter((d, i) => {
    const value = parseFloat(d[metric]);
    const zScore = Math.abs((value - stats.mean) / stats.stdDev);
    return zScore > threshold;
  }).map((d, i) => ({
    date: d.date,
    value: parseFloat(d[metric]),
    zScore: Math.abs((parseFloat(d[metric]) - stats.mean) / stats.stdDev).toFixed(2),
    deviation: ((parseFloat(d[metric]) - stats.mean) / stats.mean * 100).toFixed(1) + '%',
  }));

  return anomalies;
}

/**
 * Generate revenue forecast
 */
function forecastRevenue(data, daysAhead = 30) {
  const revenues = data.map(d => parseFloat(d.revenue));
  const trend = detectTrend(revenues);

  const forecast = [];
  const lastDate = new Date(data[data.length - 1].date);

  for (let i = 1; i <= daysAhead; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);

    const x = data.length + i - 1;
    const predictedValue = trend.slope * x + trend.intercept;

    // Add confidence intervals (±1 std dev)
    const revenues = data.map(d => parseFloat(d.revenue));
    const stats = calculateStats(revenues);

    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      predicted: predictedValue.toFixed(2),
      lower: (predictedValue - stats.stdDev).toFixed(2),
      upper: (predictedValue + stats.stdDev).toFixed(2),
      confidence: '68%', // ±1 std dev
    });
  }

  return {
    forecast,
    trend,
    totalForecast: forecast.reduce((sum, f) => sum + parseFloat(f.predicted), 0).toFixed(2),
    avgDaily: (forecast.reduce((sum, f) => sum + parseFloat(f.predicted), 0) / daysAhead).toFixed(2),
  };
}

/**
 * Analyze performance against targets
 */
function analyzeTargets(data) {
  const latest = data[data.length - 1];

  const results = {
    conversionRate: {
      current: parseFloat(latest.conversionRate),
      target: CONFIG.targets.conversionRate,
      achievement: ((parseFloat(latest.conversionRate) / CONFIG.targets.conversionRate) * 100).toFixed(1) + '%',
      status: parseFloat(latest.conversionRate) >= CONFIG.targets.conversionRate ? '✅ MET' : '❌ BELOW TARGET',
      gap: ((CONFIG.targets.conversionRate - parseFloat(latest.conversionRate)) * 100).toFixed(2) + '%',
    },
    avgSessionDuration: {
      current: latest.avgSessionDuration,
      target: CONFIG.targets.avgSessionDuration,
      achievement: ((latest.avgSessionDuration / CONFIG.targets.avgSessionDuration) * 100).toFixed(1) + '%',
      status: latest.avgSessionDuration >= CONFIG.targets.avgSessionDuration ? '✅ MET' : '❌ BELOW TARGET',
      gap: (CONFIG.targets.avgSessionDuration - latest.avgSessionDuration).toFixed(0) + 's',
    },
    bounceRate: {
      current: parseFloat(latest.bounceRate),
      target: CONFIG.targets.bounceRate,
      achievement: ((CONFIG.targets.bounceRate / parseFloat(latest.bounceRate)) * 100).toFixed(1) + '%',
      status: parseFloat(latest.bounceRate) <= CONFIG.targets.bounceRate ? '✅ MET' : '❌ ABOVE TARGET',
      gap: ((parseFloat(latest.bounceRate) - CONFIG.targets.bounceRate) * 100).toFixed(2) + '%',
    },
    revenuePerVisitor: {
      current: parseFloat(latest.revenuePerVisitor),
      target: CONFIG.targets.revenuePerVisitor,
      achievement: ((parseFloat(latest.revenuePerVisitor) / CONFIG.targets.revenuePerVisitor) * 100).toFixed(1) + '%',
      status: parseFloat(latest.revenuePerVisitor) >= CONFIG.targets.revenuePerVisitor ? '✅ MET' : '❌ BELOW TARGET',
      gap: '$' + (CONFIG.targets.revenuePerVisitor - parseFloat(latest.revenuePerVisitor)).toFixed(2),
    },
  };

  return results;
}

/**
 * Generate alerts based on thresholds
 */
function generateAlerts(data) {
  if (data.length < 2) return [];

  const alerts = [];
  const current = data[data.length - 1];
  const previous = data[data.length - 2];

  // Conversion rate alert
  const conversionChange = (parseFloat(current.conversionRate) - parseFloat(previous.conversionRate)) / parseFloat(previous.conversionRate);
  if (conversionChange < -CONFIG.alerts.conversionDrop) {
    alerts.push({
      severity: '🚨 CRITICAL',
      metric: 'Conversion Rate',
      message: `Conversion rate dropped ${(conversionChange * 100).toFixed(1)}% (threshold: -${CONFIG.alerts.conversionDrop * 100}%)`,
      current: current.conversionRate,
      previous: previous.conversionRate,
      action: 'Review recent page changes, check for technical issues, analyze user behavior',
    });
  }

  // Bounce rate alert
  const bounceChange = (parseFloat(current.bounceRate) - parseFloat(previous.bounceRate)) / parseFloat(previous.bounceRate);
  if (bounceChange > CONFIG.alerts.bounceIncrease) {
    alerts.push({
      severity: '⚠️ WARNING',
      metric: 'Bounce Rate',
      message: `Bounce rate increased ${(bounceChange * 100).toFixed(1)}% (threshold: +${CONFIG.alerts.bounceIncrease * 100}%)`,
      current: current.bounceRate,
      previous: previous.bounceRate,
      action: 'Check page load times, review hero content, analyze traffic sources',
    });
  }

  // Revenue alert
  const revenueChange = (parseFloat(current.revenue) - parseFloat(previous.revenue)) / parseFloat(previous.revenue);
  if (Math.abs(revenueChange) > CONFIG.alerts.revenueChange) {
    alerts.push({
      severity: revenueChange > 0 ? '✅ POSITIVE' : '⚠️ WARNING',
      metric: 'Revenue',
      message: `Revenue ${revenueChange > 0 ? 'increased' : 'decreased'} ${Math.abs(revenueChange * 100).toFixed(1)}% (threshold: ±${CONFIG.alerts.revenueChange * 100}%)`,
      current: '$' + current.revenue,
      previous: '$' + previous.revenue,
      action: revenueChange > 0 ? 'Analyze winning patterns and scale to other pages' : 'Investigate drop and revert recent changes if needed',
    });
  }

  // Performance alert
  if (parseFloat(current.performance.LCP) > 2.5) {
    alerts.push({
      severity: '⚠️ WARNING',
      metric: 'Core Web Vitals (LCP)',
      message: `LCP exceeded 2.5s threshold (current: ${current.performance.LCP}s)`,
      current: current.performance.LCP + 's',
      threshold: '2.5s',
      action: 'Optimize images, reduce render-blocking resources, improve server response time',
    });
  }

  return alerts;
}

/**
 * Compare performance across pages
 */
function comparePagePerformance(data) {
  const latest = data[data.length - 1];
  const pages = Object.entries(latest.pageViews)
    .map(([page, views]) => ({
      page,
      views,
      viewsPercent: ((views / latest.sessions) * 100).toFixed(1) + '%',
    }))
    .sort((a, b) => b.views - a.views);

  return pages;
}

/**
 * Daily monitoring report
 */
function generateDailyReport(data) {
  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : latest;

  console.log('\n' + '='.repeat(80));
  console.log('📊 DAILY PRODUCTION METRICS REPORT');
  console.log('='.repeat(80));
  console.log(`Date: ${latest.date}`);
  console.log(`Report Generated: ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  // Key Metrics
  console.log('\n📈 KEY METRICS (24h)');
  console.log('-'.repeat(80));
  console.log(`Sessions: ${latest.sessions.toLocaleString()} (${((latest.sessions - previous.sessions) / previous.sessions * 100).toFixed(1)}% vs yesterday)`);
  console.log(`Conversions: ${latest.conversions.toLocaleString()} (${((latest.conversions - previous.conversions) / previous.conversions * 100).toFixed(1)}% vs yesterday)`);
  console.log(`Conversion Rate: ${(parseFloat(latest.conversionRate) * 100).toFixed(2)}% (${((parseFloat(latest.conversionRate) - parseFloat(previous.conversionRate)) / parseFloat(previous.conversionRate) * 100).toFixed(1)}% vs yesterday)`);
  console.log(`Revenue: $${parseFloat(latest.revenue).toLocaleString()} (${((parseFloat(latest.revenue) - parseFloat(previous.revenue)) / parseFloat(previous.revenue) * 100).toFixed(1)}% vs yesterday)`);
  console.log(`Revenue/Visitor: $${latest.revenuePerVisitor}`);
  console.log(`Avg Session Duration: ${latest.avgSessionDuration}s`);
  console.log(`Bounce Rate: ${(parseFloat(latest.bounceRate) * 100).toFixed(1)}%`);

  // Alerts
  const alerts = generateAlerts(data);
  if (alerts.length > 0) {
    console.log('\n🚨 ALERTS');
    console.log('-'.repeat(80));
    alerts.forEach(alert => {
      console.log(`${alert.severity} - ${alert.metric}`);
      console.log(`  ${alert.message}`);
      console.log(`  Current: ${alert.current} | Previous: ${alert.previous || alert.threshold}`);
      console.log(`  Action: ${alert.action}`);
      console.log('');
    });
  } else {
    console.log('\n✅ NO ALERTS - All metrics within normal ranges');
  }

  // Target Achievement
  const targets = analyzeTargets(data);
  console.log('\n🎯 TARGET ACHIEVEMENT');
  console.log('-'.repeat(80));
  Object.entries(targets).forEach(([metric, result]) => {
    console.log(`${metric}: ${result.status}`);
    console.log(`  Current: ${result.current} | Target: ${result.target} | Achievement: ${result.achievement}`);
    if (result.status.includes('BELOW') || result.status.includes('ABOVE')) {
      console.log(`  Gap: ${result.gap}`);
    }
  });

  // Top Pages
  const pages = comparePagePerformance(data);
  console.log('\n📄 TOP PAGES BY TRAFFIC');
  console.log('-'.repeat(80));
  pages.slice(0, 5).forEach((page, i) => {
    console.log(`${i + 1}. ${page.page}: ${page.views.toLocaleString()} views (${page.viewsPercent} of total)`);
  });

  // Performance Metrics
  console.log('\n⚡ CORE WEB VITALS');
  console.log('-'.repeat(80));
  console.log(`LCP: ${latest.performance.LCP}s ${parseFloat(latest.performance.LCP) <= 2.5 ? '✅' : '❌'} (target: ≤2.5s)`);
  console.log(`FID: ${latest.performance.FID}ms ${parseFloat(latest.performance.FID) <= 100 ? '✅' : '❌'} (target: ≤100ms)`);
  console.log(`CLS: ${latest.performance.CLS} ${parseFloat(latest.performance.CLS) <= 0.1 ? '✅' : '❌'} (target: ≤0.1)`);

  console.log('\n' + '='.repeat(80));
}

/**
 * Weekly trend analysis report
 */
function generateWeeklyReport(data) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 WEEKLY TREND ANALYSIS REPORT');
  console.log('='.repeat(80));
  console.log(`Period: ${data[0].date} to ${data[data.length - 1].date} (${data.length} days)`);
  console.log(`Report Generated: ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  // Trend Analysis
  console.log('\n📈 TREND ANALYSIS');
  console.log('-'.repeat(80));

  const metrics = ['sessions', 'conversions', 'conversionRate', 'revenue', 'avgSessionDuration', 'bounceRate'];
  metrics.forEach(metric => {
    const values = data.map(d => parseFloat(d[metric]));
    const trend = detectTrend(values);
    const stats = calculateStats(values);

    console.log(`\n${metric.toUpperCase()}`);
    console.log(`  Trend: ${trend.direction} (${trend.strength}, R²=${trend.rSquared.toFixed(3)})`);
    console.log(`  Change: ${trend.changePercent}% over period`);
    console.log(`  Mean: ${stats.mean.toFixed(2)} | Median: ${stats.median.toFixed(2)}`);
    console.log(`  Range: ${stats.min.toFixed(2)} - ${stats.max.toFixed(2)}`);
    console.log(`  Std Dev: ${stats.stdDev.toFixed(2)}`);
  });

  // Anomaly Detection
  console.log('\n\n🔍 ANOMALY DETECTION');
  console.log('-'.repeat(80));

  ['conversionRate', 'revenue', 'bounceRate'].forEach(metric => {
    const anomalies = detectAnomalies(data, metric);
    if (anomalies.length > 0) {
      console.log(`\n${metric.toUpperCase()} Anomalies (Z-score > 2):`);
      anomalies.forEach(a => {
        console.log(`  ${a.date}: ${a.value} (Z-score: ${a.zScore}, ${a.deviation} from mean)`);
      });
    }
  });

  // Device Breakdown
  console.log('\n\n📱 DEVICE PERFORMANCE');
  console.log('-'.repeat(80));
  const latestDevices = data[data.length - 1].devices;
  console.log(`Mobile: ${(parseFloat(latestDevices.mobile) * 100).toFixed(1)}%`);
  console.log(`Desktop: ${(parseFloat(latestDevices.desktop) * 100).toFixed(1)}%`);
  console.log(`Tablet: ${(parseFloat(latestDevices.tablet) * 100).toFixed(1)}%`);

  // Traffic Sources
  console.log('\n🚦 TRAFFIC SOURCES');
  console.log('-'.repeat(80));
  const latestSources = data[data.length - 1].sources;
  const totalTraffic = Object.values(latestSources).reduce((a, b) => a + b, 0);
  Object.entries(latestSources).forEach(([source, count]) => {
    console.log(`${source}: ${count.toLocaleString()} (${(count / totalTraffic * 100).toFixed(1)}%)`);
  });

  console.log('\n' + '='.repeat(80));
}

/**
 * Forecast report
 */
function generateForecastReport(data) {
  console.log('\n' + '='.repeat(80));
  console.log('🔮 REVENUE FORECAST REPORT');
  console.log('='.repeat(80));
  console.log(`Historical Period: ${data[0].date} to ${data[data.length - 1].date} (${data.length} days)`);
  console.log(`Report Generated: ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  const forecastResult = forecastRevenue(data, 30);

  console.log('\n📊 30-DAY REVENUE FORECAST');
  console.log('-'.repeat(80));
  console.log(`Total Forecast: $${parseFloat(forecastResult.totalForecast).toLocaleString()}`);
  console.log(`Average Daily: $${parseFloat(forecastResult.avgDaily).toLocaleString()}`);
  console.log(`Trend: ${forecastResult.trend.direction} (${forecastResult.trend.strength})`);
  console.log(`Change Rate: ${forecastResult.trend.changePercent}% over historical period`);
  console.log(`Confidence: 68% (±1 standard deviation)`);

  console.log('\n📅 WEEKLY BREAKDOWN');
  console.log('-'.repeat(80));

  for (let week = 0; week < 4; week++) {
    const weekStart = week * 7;
    const weekEnd = Math.min(weekStart + 7, 30);
    const weekData = forecastResult.forecast.slice(weekStart, weekEnd);
    const weekTotal = weekData.reduce((sum, d) => sum + parseFloat(d.predicted), 0);

    console.log(`\nWeek ${week + 1} (${weekData[0].date} to ${weekData[weekData.length - 1].date})`);
    console.log(`  Predicted Revenue: $${weekTotal.toLocaleString()}`);
    console.log(`  Daily Average: $${(weekTotal / weekData.length).toLocaleString()}`);
    console.log(`  Range: $${Math.min(...weekData.map(d => parseFloat(d.lower))).toLocaleString()} - $${Math.max(...weekData.map(d => parseFloat(d.upper))).toLocaleString()}`);
  }

  // Annual projection
  const annualRevenue = parseFloat(forecastResult.avgDaily) * 365;
  console.log('\n📈 ANNUAL PROJECTION');
  console.log('-'.repeat(80));
  console.log(`Projected Annual Revenue: $${annualRevenue.toLocaleString()}`);
  console.log(`Based on 30-day forecast trend`);

  // Save forecast to file
  const forecastPath = path.join(CONFIG.outputDir, `revenue-forecast-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(forecastPath, JSON.stringify(forecastResult, null, 2));
  console.log(`\n✅ Forecast saved to: ${forecastPath}`);

  console.log('\n' + '='.repeat(80));
}

/**
 * Realtime monitoring mode
 */
async function realtimeMonitoring(refreshInterval = 30000) {
  console.log('\n' + '='.repeat(80));
  console.log('⚡ REALTIME MONITORING MODE');
  console.log('='.repeat(80));
  console.log(`Refresh Interval: ${refreshInterval / 1000}s`);
  console.log(`Press Ctrl+C to exit`);
  console.log('='.repeat(80));

  let lastData = null;

  const monitor = () => {
    console.clear();
    console.log('\n🔴 LIVE DASHBOARD - ' + new Date().toLocaleString());
    console.log('='.repeat(80));

    // Generate fresh data (in production, fetch from GA4)
    const data = generateMockData(CONFIG.days);
    const latest = data[data.length - 1];

    // Show key metrics
    console.log('\n📊 CURRENT METRICS');
    console.log('-'.repeat(80));
    console.log(`Sessions: ${latest.sessions.toLocaleString()}`);
    console.log(`Conversions: ${latest.conversions.toLocaleString()}`);
    console.log(`Conversion Rate: ${(parseFloat(latest.conversionRate) * 100).toFixed(2)}%`);
    console.log(`Revenue: $${parseFloat(latest.revenue).toLocaleString()}`);
    console.log(`Revenue/Visitor: $${latest.revenuePerVisitor}`);

    // Show alerts
    const alerts = generateAlerts(data);
    if (alerts.length > 0) {
      console.log('\n🚨 ACTIVE ALERTS');
      console.log('-'.repeat(80));
      alerts.forEach(alert => {
        console.log(`${alert.severity} ${alert.metric}: ${alert.message}`);
      });
    }

    // Show trend
    const revenues = data.map(d => parseFloat(d.revenue));
    const trend = detectTrend(revenues);
    console.log('\n📈 TREND');
    console.log('-'.repeat(80));
    console.log(`Direction: ${trend.direction}`);
    console.log(`Strength: ${trend.strength} (R²=${trend.rSquared.toFixed(3)})`);

    console.log('\n⏰ Next update in ' + (refreshInterval / 1000) + 's...');
  };

  monitor();
  setInterval(monitor, refreshInterval);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Advanced Production Metrics Monitoring System');
  console.log(`Mode: ${CONFIG.mode}`);
  console.log(`Days: ${CONFIG.days}`);

  // Generate mock data (replace with real GA4 data in production)
  const data = generateMockData(CONFIG.days);

  // Save data for reference
  const dataPath = path.join(CONFIG.dataDir, `metrics-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  // Execute based on mode
  switch (CONFIG.mode) {
    case 'daily':
      generateDailyReport(data);
      break;

    case 'weekly':
      generateWeeklyReport(data);
      break;

    case 'monthly':
      generateWeeklyReport(generateMockData(30));
      break;

    case 'forecast':
      generateForecastReport(data);
      break;

    case 'realtime':
      await realtimeMonitoring();
      break;

    default:
      console.log('❌ Invalid mode. Use: daily, weekly, monthly, forecast, or realtime');
      process.exit(1);
  }

  console.log(`\n✅ Report complete! Data saved to: ${dataPath}`);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateMockData,
  calculateStats,
  detectTrend,
  detectAnomalies,
  forecastRevenue,
  analyzeTargets,
  generateAlerts,
  comparePagePerformance,
};
