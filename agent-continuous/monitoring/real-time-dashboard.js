/**
 * Real-Time Analytics Dashboard for Gemini Ad Campaign
 *
 * This script provides real-time monitoring of all 13 optimized landing pages
 * to validate revenue projections and identify optimization opportunities.
 *
 * Usage: Include this script in your analytics platform or run locally
 * to monitor conversion rates, user behavior, and performance metrics.
 */

// Configuration
const CONFIG = {
  // All 13 optimized pages
  pages: [
    { id: 'workspace', file: 'workspace.html', baseline_cr: 6.45, target_cr: 13.41, segment: 'Operators' },
    { id: 'research', file: 'research.html', baseline_cr: 6.13, target_cr: 13.41, segment: 'Academic' },
    { id: 'comparison', file: 'comparison.html', baseline_cr: 6.98, target_cr: 13.41, segment: 'Switchers' },
    { id: 'writers', file: 'writers.html', baseline_cr: 6.8, target_cr: 13.41, segment: 'Writers' },
    { id: 'creators', file: 'creators.html', baseline_cr: 6.5, target_cr: 13.41, segment: 'Creators' },
    { id: 'productivity', file: 'productivity.html', baseline_cr: 7.56, target_cr: 13.41, segment: 'Productivity' },
    { id: 'future', file: 'future.html', baseline_cr: 7.23, target_cr: 13.41, segment: 'Aspirational' },
    { id: 'index', file: 'index.html', baseline_cr: 5.87, target_cr: 13.41, segment: 'General' },
    { id: 'apple-style', file: 'apple-style.html', baseline_cr: 8.21, target_cr: 13.41, segment: 'Premium' },
    { id: 'valentine', file: 'valentine.html', baseline_cr: 5.2, target_cr: 13.41, segment: 'Seasonal' },
    { id: 'operators', file: 'operators.html', baseline_cr: 7.1, target_cr: 13.41, segment: 'Operators' },
    { id: 'automators', file: 'automators.html', baseline_cr: 7.3, target_cr: 13.41, segment: 'Automators' },
    { id: 'trust', file: 'trust.html', baseline_cr: 6.2, target_cr: 13.41, segment: 'Trust-Focused' }
  ],

  // Revenue assumptions (from feature #87)
  monthly_visitors_per_page: 50000,
  user_ltv: 120,
  total_baseline_revenue: 151160000, // $151.16M
  total_target_revenue: 201960000,   // $201.96M

  // Monitoring thresholds
  thresholds: {
    critical_cr_drop: 0.10,    // Alert if CR drops >10% from target
    warning_cr_drop: 0.05,     // Warn if CR drops >5% from target
    performance_budget_lcp: 2500,  // LCP < 2.5s
    performance_budget_fid: 100,   // FID < 100ms
    performance_budget_cls: 0.1    // CLS < 0.1
  }
};

/**
 * Real-Time Metrics Collection
 */
class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
  }

  /**
   * Collect conversion rate data for a page
   */
  recordConversion(pageId, timestamp = Date.now()) {
    if (!this.metrics.has(pageId)) {
      this.metrics.set(pageId, {
        visits: 0,
        conversions: 0,
        conversion_rate: 0,
        revenue: 0,
        timestamps: []
      });
    }

    const data = this.metrics.get(pageId);
    data.conversions++;
    data.timestamps.push(timestamp);
    this.updateMetrics(pageId);
  }

  /**
   * Record a page visit
   */
  recordVisit(pageId, timestamp = Date.now()) {
    if (!this.metrics.has(pageId)) {
      this.metrics.set(pageId, {
        visits: 0,
        conversions: 0,
        conversion_rate: 0,
        revenue: 0,
        timestamps: []
      });
    }

    const data = this.metrics.get(pageId);
    data.visits++;
    this.updateMetrics(pageId);
  }

  /**
   * Update calculated metrics
   */
  updateMetrics(pageId) {
    const data = this.metrics.get(pageId);
    if (data.visits > 0) {
      data.conversion_rate = (data.conversions / data.visits) * 100;
      data.revenue = data.conversions * CONFIG.user_ltv;
    }

    // Check for alerts
    this.checkAlerts(pageId, data);
  }

  /**
   * Check if metrics trigger any alerts
   */
  checkAlerts(pageId, data) {
    const page = CONFIG.pages.find(p => p.id === pageId);
    if (!page) return;

    const crDiff = ((page.target_cr - data.conversion_rate) / page.target_cr);

    if (crDiff > CONFIG.thresholds.critical_cr_drop) {
      this.addAlert({
        severity: 'critical',
        pageId,
        message: `${page.file}: CR ${data.conversion_rate.toFixed(2)}% is ${(crDiff * 100).toFixed(1)}% below target ${page.target_cr}%`,
        timestamp: Date.now()
      });
    } else if (crDiff > CONFIG.thresholds.warning_cr_drop) {
      this.addAlert({
        severity: 'warning',
        pageId,
        message: `${page.file}: CR ${data.conversion_rate.toFixed(2)}% is ${(crDiff * 100).toFixed(1)}% below target ${page.target_cr}%`,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Add an alert
   */
  addAlert(alert) {
    this.alerts.push(alert);
    console.warn(`[${alert.severity.toUpperCase()}] ${alert.message}`);
  }

  /**
   * Get summary report
   */
  getSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      total_visits: 0,
      total_conversions: 0,
      total_revenue: 0,
      average_cr: 0,
      pages: [],
      alerts: this.alerts.filter(a => {
        // Only include alerts from last 24 hours
        return (Date.now() - a.timestamp) < 86400000;
      })
    };

    for (const page of CONFIG.pages) {
      const data = this.metrics.get(page.id) || {
        visits: 0,
        conversions: 0,
        conversion_rate: 0,
        revenue: 0
      };

      summary.total_visits += data.visits;
      summary.total_conversions += data.conversions;
      summary.total_revenue += data.revenue;

      summary.pages.push({
        id: page.id,
        file: page.file,
        segment: page.segment,
        baseline_cr: page.baseline_cr,
        target_cr: page.target_cr,
        actual_cr: data.conversion_rate,
        visits: data.visits,
        conversions: data.conversions,
        revenue: data.revenue,
        status: this.getPageStatus(page, data)
      });
    }

    if (summary.total_visits > 0) {
      summary.average_cr = (summary.total_conversions / summary.total_visits) * 100;
    }

    return summary;
  }

  /**
   * Determine page status
   */
  getPageStatus(page, data) {
    if (data.visits < 1000) return 'insufficient_data';

    const crDiff = ((page.target_cr - data.conversion_rate) / page.target_cr);

    if (data.conversion_rate >= page.target_cr * 1.1) return 'exceeding';
    if (data.conversion_rate >= page.target_cr * 0.95) return 'on_target';
    if (crDiff <= CONFIG.thresholds.warning_cr_drop) return 'warning';
    return 'critical';
  }

  /**
   * Export data as JSON
   */
  exportJSON() {
    return JSON.stringify(this.getSummary(), null, 2);
  }
}

/**
 * Performance Monitoring
 */
class PerformanceMonitor {
  constructor() {
    this.measurements = new Map();
  }

  /**
   * Record Core Web Vitals
   */
  recordCoreWebVitals(pageId, metrics) {
    if (!this.measurements.has(pageId)) {
      this.measurements.set(pageId, {
        lcp: [],
        fid: [],
        cls: [],
        ttfb: []
      });
    }

    const data = this.measurements.get(pageId);

    if (metrics.lcp) data.lcp.push(metrics.lcp);
    if (metrics.fid) data.fid.push(metrics.fid);
    if (metrics.cls) data.cls.push(metrics.cls);
    if (metrics.ttfb) data.ttfb.push(metrics.ttfb);

    this.checkPerformanceAlerts(pageId, metrics);
  }

  /**
   * Check performance alerts
   */
  checkPerformanceAlerts(pageId, metrics) {
    const alerts = [];

    if (metrics.lcp > CONFIG.thresholds.performance_budget_lcp) {
      alerts.push({
        severity: 'warning',
        metric: 'LCP',
        value: metrics.lcp,
        threshold: CONFIG.thresholds.performance_budget_lcp,
        message: `LCP ${metrics.lcp}ms exceeds budget ${CONFIG.thresholds.performance_budget_lcp}ms`
      });
    }

    if (metrics.fid > CONFIG.thresholds.performance_budget_fid) {
      alerts.push({
        severity: 'warning',
        metric: 'FID',
        value: metrics.fid,
        threshold: CONFIG.thresholds.performance_budget_fid,
        message: `FID ${metrics.fid}ms exceeds budget ${CONFIG.thresholds.performance_budget_fid}ms`
      });
    }

    if (metrics.cls > CONFIG.thresholds.performance_budget_cls) {
      alerts.push({
        severity: 'warning',
        metric: 'CLS',
        value: metrics.cls,
        threshold: CONFIG.thresholds.performance_budget_cls,
        message: `CLS ${metrics.cls} exceeds budget ${CONFIG.thresholds.performance_budget_cls}`
      });
    }

    if (alerts.length > 0) {
      console.warn(`[Performance Alert] ${pageId}:`, alerts);
    }
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      pages: []
    };

    for (const page of CONFIG.pages) {
      const data = this.measurements.get(page.id);

      if (!data) {
        summary.pages.push({
          id: page.id,
          file: page.file,
          status: 'no_data'
        });
        continue;
      }

      const avg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      const p75 = (arr) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length * 0.75)];
      };

      summary.pages.push({
        id: page.id,
        file: page.file,
        metrics: {
          lcp: { avg: avg(data.lcp), p75: p75(data.lcp), samples: data.lcp.length },
          fid: { avg: avg(data.fid), p75: p75(data.fid), samples: data.fid.length },
          cls: { avg: avg(data.cls), p75: p75(data.cls), samples: data.cls.length },
          ttfb: { avg: avg(data.ttfb), p75: p75(data.ttfb), samples: data.ttfb.length }
        },
        status: this.getPerformanceStatus(data)
      });
    }

    return summary;
  }

  /**
   * Determine overall performance status
   */
  getPerformanceStatus(data) {
    const avg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const avgLCP = avg(data.lcp);
    const avgFID = avg(data.fid);
    const avgCLS = avg(data.cls);

    if (avgLCP > CONFIG.thresholds.performance_budget_lcp ||
        avgFID > CONFIG.thresholds.performance_budget_fid ||
        avgCLS > CONFIG.thresholds.performance_budget_cls) {
      return 'needs_optimization';
    }

    return 'good';
  }
}

/**
 * Dashboard Export
 */
class Dashboard {
  constructor() {
    this.metricsCollector = new MetricsCollector();
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * Generate comprehensive dashboard report
   */
  generateReport() {
    const conversionSummary = this.metricsCollector.getSummary();
    const performanceSummary = this.performanceMonitor.getSummary();

    return {
      generated_at: new Date().toISOString(),
      program_status: {
        total_pages: CONFIG.pages.length,
        baseline_revenue: CONFIG.total_baseline_revenue,
        target_revenue: CONFIG.total_target_revenue,
        actual_revenue: conversionSummary.total_revenue * 12, // Annualized
        target_achievement: ((conversionSummary.total_revenue * 12) / CONFIG.total_target_revenue * 100).toFixed(2) + '%'
      },
      conversion_metrics: conversionSummary,
      performance_metrics: performanceSummary,
      recommendations: this.generateRecommendations(conversionSummary, performanceSummary)
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(conversionData, performanceData) {
    const recommendations = [];

    // Identify underperforming pages
    const underperforming = conversionData.pages.filter(p => p.status === 'critical' || p.status === 'warning');
    if (underperforming.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'conversion',
        title: 'Optimize Underperforming Pages',
        pages: underperforming.map(p => p.file),
        action: 'Review and test micro-optimizations (copy, CTA placement, colors)'
      });
    }

    // Identify high performers to scale
    const highPerformers = conversionData.pages.filter(p => p.status === 'exceeding');
    if (highPerformers.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'scaling',
        title: 'Scale High-Performing Patterns',
        pages: highPerformers.map(p => p.file),
        action: 'Analyze successful elements and apply to similar pages'
      });
    }

    // Performance optimization opportunities
    const slowPages = performanceData.pages.filter(p => p.status === 'needs_optimization');
    if (slowPages.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: 'Improve Page Performance',
        pages: slowPages.map(p => p.file),
        action: 'Optimize images, reduce JavaScript, improve Core Web Vitals'
      });
    }

    return recommendations;
  }

  /**
   * Export dashboard as JSON
   */
  exportJSON() {
    return JSON.stringify(this.generateReport(), null, 2);
  }

  /**
   * Export dashboard as HTML
   */
  exportHTML() {
    const report = this.generateReport();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gemini Ad Campaign - Real-Time Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f7;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .metric-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .metric-value {
      font-size: 32px;
      font-weight: 600;
      color: #1a73e8;
      margin: 10px 0;
    }
    .metric-label {
      color: #5f6368;
      font-size: 14px;
    }
    .pages-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e8eaed;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #202124;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-exceeding { background: #e6f4ea; color: #137333; }
    .status-on_target { background: #e8f0fe; color: #1967d2; }
    .status-warning { background: #fef7e0; color: #f9ab00; }
    .status-critical { background: #fce8e6; color: #c5221f; }
    .status-insufficient_data { background: #f1f3f4; color: #5f6368; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Gemini Ad Campaign Dashboard</h1>
      <p>Real-time monitoring of 13 optimized landing pages</p>
      <p style="color: #5f6368; margin-top: 10px;">Last updated: ${report.generated_at}</p>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Visits</div>
        <div class="metric-value">${report.conversion_metrics.total_visits.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Conversions</div>
        <div class="metric-value">${report.conversion_metrics.total_conversions.toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Average CR</div>
        <div class="metric-value">${report.conversion_metrics.average_cr.toFixed(2)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Revenue</div>
        <div class="metric-value">$${(report.conversion_metrics.total_revenue / 1000000).toFixed(2)}M</div>
      </div>
    </div>

    <div class="pages-table">
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Segment</th>
            <th>Baseline CR</th>
            <th>Target CR</th>
            <th>Actual CR</th>
            <th>Visits</th>
            <th>Conversions</th>
            <th>Revenue</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${report.conversion_metrics.pages.map(page => `
            <tr>
              <td>${page.file}</td>
              <td>${page.segment}</td>
              <td>${page.baseline_cr.toFixed(2)}%</td>
              <td>${page.target_cr.toFixed(2)}%</td>
              <td><strong>${page.actual_cr.toFixed(2)}%</strong></td>
              <td>${page.visits.toLocaleString()}</td>
              <td>${page.conversions.toLocaleString()}</td>
              <td>$${(page.revenue / 1000).toFixed(1)}K</td>
              <td><span class="status-badge status-${page.status}">${page.status.replace('_', ' ')}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    MetricsCollector,
    PerformanceMonitor,
    Dashboard
  };
}

// Example usage in browser console:
// const dashboard = new Dashboard();
// dashboard.metricsCollector.recordVisit('workspace');
// dashboard.metricsCollector.recordConversion('workspace');
// console.log(dashboard.exportJSON());
