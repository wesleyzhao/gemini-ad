#!/usr/bin/env node

/**
 * Advanced Alerting System with Anomaly Detection
 *
 * Proactively monitors for:
 * - Performance degradation patterns
 * - Unusual user behavior shifts
 * - Quality score anomalies
 * - Conversion rate drops
 * - Engagement pattern changes
 *
 * Uses statistical methods for anomaly detection:
 * - Moving averages
 * - Standard deviation analysis
 * - Trend detection
 * - Pattern recognition
 *
 * Feature #52: Advanced performance monitoring and UX optimization
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  reportsDir: path.join(__dirname, '..', 'reports'),
  alertsDir: path.join(__dirname, '..', 'reports', 'alerts'),
  historicalDir: path.join(__dirname, '..', 'reports', 'historical'),
  thresholds: {
    qualityScoreDrop: 10, // Alert if quality drops by 10+ points
    conversionRateDrop: 5, // Alert if conversion drops by 5+ percentage points
    bounceRateIncrease: 15, // Alert if bounce rate increases by 15+ points
    performanceDegradation: 500, // Alert if LCP/FCP increases by 500ms
    anomalyStdDev: 2, // Number of std deviations for anomaly
  },
  lookbackDays: 30,
};

// Ensure directories exist
[CONFIG.alertsDir, CONFIG.historicalDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============================================================================
// DATA COLLECTION
// ============================================================================

/**
 * Load current monitoring data
 */
function loadCurrentData() {
  const files = {
    cwv: path.join(CONFIG.reportsDir, 'core-web-vitals-report.json'),
    ux: getLatestReport(path.join(CONFIG.reportsDir, 'ux-analysis')),
    feedback: path.join(CONFIG.reportsDir, 'user-feedback.json'),
  };

  const data = {};

  for (const [key, filePath] of Object.entries(files)) {
    if (filePath && fs.existsSync(filePath)) {
      try {
        data[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        console.warn(`⚠️  Could not load ${key} data: ${err.message}`);
        data[key] = null;
      }
    } else {
      data[key] = null;
    }
  }

  return data;
}

/**
 * Get latest report from directory
 */
function getLatestReport(dir) {
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();

  return files.length > 0 ? path.join(dir, files[0]) : null;
}

/**
 * Load historical data for trend analysis
 */
function loadHistoricalData() {
  const historicalFiles = fs.existsSync(CONFIG.historicalDir)
    ? fs.readdirSync(CONFIG.historicalDir).filter(f => f.endsWith('.json')).sort()
    : [];

  const historical = [];
  for (const file of historicalFiles.slice(-30)) { // Last 30 data points
    try {
      const data = JSON.parse(fs.readFileSync(path.join(CONFIG.historicalDir, file), 'utf8'));
      historical.push(data);
    } catch (err) {
      // Skip corrupted files
    }
  }

  return historical;
}

// ============================================================================
// ANOMALY DETECTION
// ============================================================================

/**
 * Detect anomalies using statistical analysis
 */
function detectAnomalies(current, historical) {
  console.log('\n🔍 Detecting Anomalies...\n');

  const anomalies = [];

  if (!current.ux || !current.ux.engagementAnalysis) {
    console.log('⚠️  No UX data available for anomaly detection\n');
    return anomalies;
  }

  // Analyze each page
  for (const [page, currentMetrics] of Object.entries(current.ux.engagementAnalysis)) {
    // Get historical metrics for this page
    const pageHistory = historical
      .map(h => h.pages && h.pages[page])
      .filter(Boolean);

    if (pageHistory.length < 3) continue; // Need at least 3 data points

    // Check quality score anomaly
    const qualityAnomaly = detectMetricAnomaly(
      'qualityScore',
      currentMetrics.qualityScore,
      pageHistory.map(h => h.qualityScore)
    );
    if (qualityAnomaly) {
      anomalies.push({
        page,
        metric: 'Quality Score',
        severity: qualityAnomaly.severity,
        message: qualityAnomaly.message,
        current: currentMetrics.qualityScore,
        expected: qualityAnomaly.expected,
        deviation: qualityAnomaly.deviation
      });
    }

    // Check conversion rate anomaly
    const conversionRate = parseFloat(currentMetrics.metrics.conversionRate);
    const conversionAnomaly = detectMetricAnomaly(
      'conversionRate',
      conversionRate,
      pageHistory.map(h => parseFloat(h.metrics?.conversionRate || 0))
    );
    if (conversionAnomaly) {
      anomalies.push({
        page,
        metric: 'Conversion Rate',
        severity: conversionAnomaly.severity,
        message: conversionAnomaly.message,
        current: conversionRate.toFixed(1) + '%',
        expected: conversionAnomaly.expected.toFixed(1) + '%',
        deviation: conversionAnomaly.deviation
      });
    }

    // Check bounce rate anomaly
    const bounceRate = parseFloat(currentMetrics.metrics.bounceRate);
    const bounceAnomaly = detectMetricAnomaly(
      'bounceRate',
      bounceRate,
      pageHistory.map(h => parseFloat(h.metrics?.bounceRate || 0)),
      true // Higher is worse
    );
    if (bounceAnomaly) {
      anomalies.push({
        page,
        metric: 'Bounce Rate',
        severity: bounceAnomaly.severity,
        message: bounceAnomaly.message,
        current: bounceRate.toFixed(1) + '%',
        expected: bounceAnomaly.expected.toFixed(1) + '%',
        deviation: bounceAnomaly.deviation
      });
    }
  }

  // Check CWV anomalies
  if (current.cwv && historical.length > 0) {
    const cwvAnomalies = detectCWVAnomalies(current.cwv, historical);
    anomalies.push(...cwvAnomalies);
  }

  console.log(`✅ Detected ${anomalies.length} anomalies\n`);
  return anomalies;
}

/**
 * Detect anomaly for a specific metric using statistical analysis
 */
function detectMetricAnomaly(metricName, currentValue, historicalValues, higherIsWorse = false) {
  if (historicalValues.length < 3) return null;

  // Calculate statistics
  const mean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const variance = historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length;
  const stdDev = Math.sqrt(variance);

  // Calculate Z-score
  const zScore = Math.abs((currentValue - mean) / (stdDev || 1));

  // Determine if anomalous
  const isAnomaly = zScore > CONFIG.thresholds.anomalyStdDev;

  if (!isAnomaly) return null;

  // Determine severity
  const deviation = currentValue - mean;
  const isNegativeDeviation = higherIsWorse ? deviation > 0 : deviation < 0;

  let severity = 'info';
  if (zScore > 3) {
    severity = isNegativeDeviation ? 'critical' : 'info';
  } else if (zScore > 2.5) {
    severity = isNegativeDeviation ? 'high' : 'info';
  } else if (zScore > 2) {
    severity = isNegativeDeviation ? 'warning' : 'info';
  }

  // Generate message
  const direction = deviation > 0 ? 'increased' : 'decreased';
  const absDeviation = Math.abs(deviation).toFixed(1);

  let message = `${metricName} ${direction} by ${absDeviation} (${zScore.toFixed(1)}σ from mean)`;

  if (isNegativeDeviation) {
    message += ' - DEGRADATION DETECTED';
  } else {
    message += ' - Improvement detected';
  }

  return {
    severity,
    message,
    expected: mean,
    deviation: deviation.toFixed(1),
    zScore: zScore.toFixed(2)
  };
}

/**
 * Detect CWV performance anomalies
 */
function detectCWVAnomalies(currentCWV, historical) {
  const anomalies = [];

  // Simple CWV check - look for pages with poor metrics
  if (currentCWV.pageMetrics) {
    for (const [page, metrics] of Object.entries(currentCWV.pageMetrics)) {
      // Check LCP
      if (metrics.lcp && metrics.lcp.p75 > 2500) {
        const severity = metrics.lcp.p75 > 4000 ? 'critical' : 'warning';
        anomalies.push({
          page,
          metric: 'LCP',
          severity,
          message: `Poor LCP performance: ${metrics.lcp.p75}ms`,
          current: metrics.lcp.p75 + 'ms',
          expected: '< 2500ms',
          deviation: 'N/A'
        });
      }

      // Check FCP
      if (metrics.fcp && metrics.fcp.p75 > 1800) {
        const severity = metrics.fcp.p75 > 3000 ? 'critical' : 'warning';
        anomalies.push({
          page,
          metric: 'FCP',
          severity,
          message: `Poor FCP performance: ${metrics.fcp.p75}ms`,
          current: metrics.fcp.p75 + 'ms',
          expected: '< 1800ms',
          deviation: 'N/A'
        });
      }

      // Check CLS
      if (metrics.cls && metrics.cls.p75 > 0.1) {
        const severity = metrics.cls.p75 > 0.25 ? 'critical' : 'warning';
        anomalies.push({
          page,
          metric: 'CLS',
          severity,
          message: `Poor CLS performance: ${metrics.cls.p75.toFixed(3)}`,
          current: metrics.cls.p75.toFixed(3),
          expected: '< 0.1',
          deviation: 'N/A'
        });
      }
    }
  }

  return anomalies;
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

/**
 * Analyze trends over time
 */
function analyzeTrends(historical) {
  console.log('📊 Analyzing Trends...\n');

  if (historical.length < 5) {
    console.log('⚠️  Insufficient historical data for trend analysis (need 5+ data points)\n');
    return { trends: [], confidence: 'low' };
  }

  const trends = [];

  // Extract time series data
  const timePoints = historical.map((h, i) => ({
    index: i,
    timestamp: h.timestamp,
    avgQuality: h.avgQualityScore || 0,
    avgConversion: h.avgConversionRate || 0,
    avgBounce: h.avgBounceRate || 0
  }));

  // Calculate trends using linear regression
  const qualityTrend = calculateTrend(timePoints.map(t => t.avgQuality));
  const conversionTrend = calculateTrend(timePoints.map(t => t.avgConversion));
  const bounceTrend = calculateTrend(timePoints.map(t => t.avgBounce));

  if (Math.abs(qualityTrend.slope) > 0.5) {
    trends.push({
      metric: 'Quality Score',
      direction: qualityTrend.slope > 0 ? 'improving' : 'declining',
      slope: qualityTrend.slope.toFixed(2),
      confidence: qualityTrend.r2 > 0.7 ? 'high' : qualityTrend.r2 > 0.4 ? 'medium' : 'low',
      message: `${qualityTrend.slope > 0 ? '📈' : '📉'} Quality score ${qualityTrend.slope > 0 ? 'improving' : 'declining'} at ${Math.abs(qualityTrend.slope).toFixed(1)} points/day`
    });
  }

  if (Math.abs(conversionTrend.slope) > 0.3) {
    trends.push({
      metric: 'Conversion Rate',
      direction: conversionTrend.slope > 0 ? 'improving' : 'declining',
      slope: conversionTrend.slope.toFixed(2),
      confidence: conversionTrend.r2 > 0.7 ? 'high' : conversionTrend.r2 > 0.4 ? 'medium' : 'low',
      message: `${conversionTrend.slope > 0 ? '📈' : '📉'} Conversion rate ${conversionTrend.slope > 0 ? 'improving' : 'declining'} at ${Math.abs(conversionTrend.slope).toFixed(2)}%/day`
    });
  }

  if (Math.abs(bounceTrend.slope) > 0.5) {
    trends.push({
      metric: 'Bounce Rate',
      direction: bounceTrend.slope < 0 ? 'improving' : 'declining',
      slope: bounceTrend.slope.toFixed(2),
      confidence: bounceTrend.r2 > 0.7 ? 'high' : bounceTrend.r2 > 0.4 ? 'medium' : 'low',
      message: `${bounceTrend.slope < 0 ? '📈' : '📉'} Bounce rate ${bounceTrend.slope < 0 ? 'improving' : 'worsening'} at ${Math.abs(bounceTrend.slope).toFixed(1)}%/day`
    });
  }

  console.log(`✅ Identified ${trends.length} significant trends\n`);
  return { trends, dataPoints: timePoints.length };
}

/**
 * Calculate linear trend using simple linear regression
 */
function calculateTrend(values) {
  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² (coefficient of determination)
  const yMean = sumY / n;
  const ssTotal = values.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = values.reduce((sum, y, i) => sum + Math.pow(y - (slope * i + intercept), 2), 0);
  const r2 = 1 - (ssResidual / ssTotal);

  return { slope, intercept, r2 };
}

// ============================================================================
// ALERT GENERATION
// ============================================================================

/**
 * Generate alerts from anomalies and trends
 */
function generateAlerts(anomalies, trends) {
  console.log('🚨 Generating Alerts...\n');

  const alerts = [];

  // Critical anomalies
  const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
  if (criticalAnomalies.length > 0) {
    alerts.push({
      priority: 'critical',
      type: 'performance_degradation',
      title: `${criticalAnomalies.length} Critical Performance Issues Detected`,
      description: 'Immediate attention required for critical performance degradation',
      issues: criticalAnomalies,
      actions: [
        'Review affected pages immediately',
        'Check for recent code changes',
        'Run performance audit',
        'Consider rolling back recent deployments'
      ]
    });
  }

  // High severity anomalies
  const highAnomalies = anomalies.filter(a => a.severity === 'high');
  if (highAnomalies.length > 0) {
    alerts.push({
      priority: 'high',
      type: 'quality_degradation',
      title: `${highAnomalies.length} High-Priority Quality Issues`,
      description: 'Significant quality degradation detected',
      issues: highAnomalies,
      actions: [
        'Investigate root causes',
        'Review recent changes',
        'Monitor closely over next 24 hours'
      ]
    });
  }

  // Negative trends
  const negativeTrends = trends.trends?.filter(t => t.direction === 'declining') || [];
  if (negativeTrends.length > 0 && negativeTrends.some(t => t.confidence === 'high')) {
    alerts.push({
      priority: 'warning',
      type: 'negative_trend',
      title: 'Declining Performance Trend Detected',
      description: 'Metrics are trending in the wrong direction',
      trends: negativeTrends,
      actions: [
        'Analyze trend causes',
        'Review recent changes over trend period',
        'Implement corrective measures',
        'Monitor trend reversal'
      ]
    });
  }

  // Positive alerts (success stories)
  const positiveAnomalies = anomalies.filter(a => a.severity === 'info' && parseFloat(a.deviation) > 0);
  if (positiveAnomalies.length > 3) {
    alerts.push({
      priority: 'info',
      type: 'improvement_detected',
      title: 'Performance Improvements Detected',
      description: 'Recent changes showing positive impact',
      improvements: positiveAnomalies.slice(0, 5),
      actions: [
        'Document what changed to cause improvements',
        'Apply similar optimizations to other pages',
        'Share success with team'
      ]
    });
  }

  console.log(`✅ Generated ${alerts.length} alerts\n`);
  return alerts;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ADVANCED ALERTING SYSTEM');
  console.log('  Anomaly Detection & Trend Analysis');
  console.log('═══════════════════════════════════════════════════════════\n');

  const startTime = Date.now();

  // 1. Load data
  console.log('📥 Loading Data...\n');
  const currentData = loadCurrentData();
  const historicalData = loadHistoricalData();
  console.log(`✅ Loaded current data and ${historicalData.length} historical data points\n`);

  // 2. Detect anomalies
  const anomalies = detectAnomalies(currentData, historicalData);

  // 3. Analyze trends
  const trends = analyzeTrends(historicalData);

  // 4. Generate alerts
  const alerts = generateAlerts(anomalies, trends);

  // 5. Create report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalAnomalies: anomalies.length,
      criticalAnomalies: anomalies.filter(a => a.severity === 'critical').length,
      highAnomalies: anomalies.filter(a => a.severity === 'high').length,
      warningAnomalies: anomalies.filter(a => a.severity === 'warning').length,
      totalTrends: trends.trends?.length || 0,
      totalAlerts: alerts.length
    },
    anomalies,
    trends,
    alerts,
    dataPoints: {
      current: !!currentData.ux,
      historical: historicalData.length
    }
  };

  // Save reports
  const alertPath = path.join(CONFIG.alertsDir, `alerts-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(alertPath, JSON.stringify(report, null, 2));

  // Save current data to historical (for future trend analysis)
  if (currentData.ux) {
    const historicalEntry = {
      timestamp: new Date().toISOString(),
      avgQualityScore: Object.values(currentData.ux.engagementAnalysis || {})
        .reduce((sum, p) => sum + p.qualityScore, 0) / Object.keys(currentData.ux.engagementAnalysis || {}).length || 0,
      avgConversionRate: Object.values(currentData.ux.engagementAnalysis || {})
        .reduce((sum, p) => sum + parseFloat(p.metrics?.conversionRate || 0), 0) / Object.keys(currentData.ux.engagementAnalysis || {}).length || 0,
      avgBounceRate: Object.values(currentData.ux.engagementAnalysis || {})
        .reduce((sum, p) => sum + parseFloat(p.metrics?.bounceRate || 0), 0) / Object.keys(currentData.ux.engagementAnalysis || {}).length || 0,
      pages: currentData.ux.engagementAnalysis
    };

    const historicalPath = path.join(CONFIG.historicalDir, `snapshot-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(historicalPath, JSON.stringify(historicalEntry, null, 2));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ANALYSIS COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`📊 Alert report saved: ${alertPath}`);
  console.log(`⏱️  Duration: ${duration}s\n`);

  // Print summary
  printSummary(report);

  return report;
}

/**
 * Print alert summary
 */
function printSummary(report) {
  console.log('\n🚨 ALERT SUMMARY\n');

  if (report.alerts.length === 0) {
    console.log('✅ No alerts - all systems normal\n');
    return;
  }

  for (const alert of report.alerts) {
    const icon = alert.priority === 'critical' ? '🔴' : alert.priority === 'high' ? '🟠' : alert.priority === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} ${alert.priority.toUpperCase()}: ${alert.title}`);
    console.log(`   ${alert.description}`);
    console.log(`   Actions:`);
    alert.actions.forEach(action => console.log(`   - ${action}`));
    console.log('');
  }

  if (report.anomalies.length > 0) {
    console.log('📊 TOP ANOMALIES\n');
    const topAnomalies = report.anomalies
      .filter(a => ['critical', 'high'].includes(a.severity))
      .slice(0, 5);

    for (const anomaly of topAnomalies) {
      console.log(`  ${anomaly.page} - ${anomaly.metric}`);
      console.log(`    ${anomaly.message}`);
      console.log(`    Current: ${anomaly.current} | Expected: ${anomaly.expected}`);
      console.log('');
    }
  }

  if (report.trends.trends && report.trends.trends.length > 0) {
    console.log('📈 TRENDS\n');
    for (const trend of report.trends.trends) {
      console.log(`  ${trend.message}`);
      console.log(`    Confidence: ${trend.confidence}`);
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, detectAnomalies, analyzeTrends, generateAlerts };
