# Real-Time Monitoring Dashboard - Deployment Guide

## 📊 Overview

This guide explains how to deploy and use the real-time monitoring dashboard created in Feature #88 to track the performance of all 13 optimized Gemini landing pages.

---

## 🚀 Quick Start

### Step 1: Include the Dashboard Script

Add to your analytics platform or HTML pages:

```html
<script src="/monitoring/real-time-dashboard.js"></script>
<script>
  // Initialize dashboard
  const dashboard = new Dashboard();

  // Track page visit
  dashboard.metricsCollector.recordVisit('workspace');

  // Track conversion (when user signs up)
  document.getElementById('cta-button').addEventListener('click', () => {
    dashboard.metricsCollector.recordConversion('workspace');
  });

  // Track Core Web Vitals
  if ('PerformanceObserver' in window) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          dashboard.performanceMonitor.recordCoreWebVitals('workspace', {
            lcp: entry.renderTime || entry.loadTime
          });
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }
</script>
```

### Step 2: View Dashboard

```javascript
// Generate HTML dashboard
const html = dashboard.exportHTML();

// Save to file or display in browser
document.body.innerHTML = html;

// Or export as JSON for API integration
const json = dashboard.exportJSON();
console.log(json);
```

---

## 📈 Integration Options

### Option 1: Google Analytics 4 Integration

```javascript
// Track conversions in GA4
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
  'value': 120, // User LTV
  'currency': 'USD'
});

// Also track in dashboard
dashboard.metricsCollector.recordConversion(pageId);
```

### Option 2: Google Tag Manager

```javascript
// Push to dataLayer
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'gemini_conversion',
  'page_id': pageId,
  'value': 120
});

// Track in dashboard
dashboard.metricsCollector.recordConversion(pageId);
```

### Option 3: Custom Analytics API

```javascript
// Send to your backend
fetch('/api/analytics/conversion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    page_id: pageId,
    timestamp: Date.now(),
    user_ltv: 120
  })
});

// Track in dashboard
dashboard.metricsCollector.recordConversion(pageId);
```

---

## 🎯 Tracking All 13 Pages

### Page ID Mapping

```javascript
const PAGE_IDS = {
  '/pages/workspace.html': 'workspace',
  '/pages/research.html': 'research',
  '/pages/comparison.html': 'comparison',
  '/pages/writers.html': 'writers',
  '/pages/creators.html': 'creators',
  '/pages/productivity.html': 'productivity',
  '/pages/future.html': 'future',
  '/pages/index.html': 'index',
  '/pages/apple-style.html': 'apple-style',
  '/pages/valentine.html': 'valentine',
  '/pages/operators.html': 'operators',
  '/pages/automators.html': 'automators',
  '/pages/trust.html': 'trust'
};

// Auto-detect current page
const currentPath = window.location.pathname;
const pageId = PAGE_IDS[currentPath] || 'unknown';

// Track visit
dashboard.metricsCollector.recordVisit(pageId);
```

---

## 🔔 Alert Configuration

### Email Alerts (Example with SendGrid)

```javascript
class DashboardWithAlerts extends Dashboard {
  constructor() {
    super();

    // Override alert handler
    this.metricsCollector.addAlert = (alert) => {
      this.metricsCollector.alerts.push(alert);
      console.warn(`[${alert.severity.toUpperCase()}] ${alert.message}`);

      // Send email for critical alerts
      if (alert.severity === 'critical') {
        this.sendEmailAlert(alert);
      }
    };
  }

  sendEmailAlert(alert) {
    fetch('/api/send-alert-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `[CRITICAL] Gemini Ad Performance Alert`,
        message: alert.message,
        timestamp: new Date(alert.timestamp).toISOString()
      })
    });
  }
}
```

### Slack Alerts

```javascript
async sendSlackAlert(alert) {
  const webhook = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 *${alert.severity.toUpperCase()}*: ${alert.message}`,
      attachments: [{
        color: alert.severity === 'critical' ? 'danger' : 'warning',
        fields: [
          { title: 'Page', value: alert.pageId, short: true },
          { title: 'Time', value: new Date(alert.timestamp).toLocaleString(), short: true }
        ]
      }]
    })
  });
}
```

---

## 📊 Dashboard Views

### View 1: Executive Summary

```javascript
const report = dashboard.generateReport();

console.log(`
📊 Gemini Ad Campaign Performance

Total Visits: ${report.conversion_metrics.total_visits.toLocaleString()}
Total Conversions: ${report.conversion_metrics.total_conversions.toLocaleString()}
Average CR: ${report.conversion_metrics.average_cr.toFixed(2)}%
Monthly Revenue: $${(report.conversion_metrics.total_revenue / 1000000).toFixed(2)}M
Annual Revenue: $${(report.conversion_metrics.total_revenue * 12 / 1000000).toFixed(2)}M

Target: $201.96M
Achievement: ${report.program_status.target_achievement}
`);
```

### View 2: Page-Level Details

```javascript
const summary = dashboard.metricsCollector.getSummary();

summary.pages.forEach(page => {
  console.log(`
📄 ${page.file} (${page.segment})
   Baseline CR: ${page.baseline_cr}%
   Target CR: ${page.target_cr}%
   Actual CR: ${page.actual_cr.toFixed(2)}%
   Status: ${page.status}
   Visits: ${page.visits.toLocaleString()}
   Conversions: ${page.conversions.toLocaleString()}
   Revenue: $${(page.revenue / 1000).toFixed(1)}K
  `);
});
```

### View 3: Performance Metrics

```javascript
const perfSummary = dashboard.performanceMonitor.getSummary();

perfSummary.pages.forEach(page => {
  if (page.status === 'no_data') return;

  console.log(`
⚡ ${page.file}
   LCP: ${page.metrics.lcp.avg.toFixed(0)}ms (target: <2500ms)
   FID: ${page.metrics.fid.avg.toFixed(0)}ms (target: <100ms)
   CLS: ${page.metrics.cls.avg.toFixed(3)} (target: <0.1)
   Status: ${page.status}
  `);
});
```

---

## 🎨 Custom Dashboard UI

### Embed in HTML Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gemini Ad Dashboard</title>
  <script src="/monitoring/real-time-dashboard.js"></script>
</head>
<body>
  <div id="dashboard"></div>

  <script>
    const dashboard = new Dashboard();

    // Generate and display dashboard
    function updateDashboard() {
      const html = dashboard.exportHTML();
      document.getElementById('dashboard').innerHTML = html;
    }

    // Update every 30 seconds
    setInterval(updateDashboard, 30000);
    updateDashboard();
  </script>
</body>
</html>
```

---

## 📈 Revenue Projection Validation

### Compare Projected vs. Actual

```javascript
function validateRevenueProjections() {
  const summary = dashboard.metricsCollector.getSummary();

  // Calculate actual annual revenue based on real data
  const actualAnnualRevenue = summary.total_revenue * 12;

  // Compare to projection
  const projectedRevenue = 201960000; // $201.96M
  const achievement = (actualAnnualRevenue / projectedRevenue) * 100;

  console.log(`
  📊 Revenue Projection Validation

  Projected Annual Revenue: $${(projectedRevenue / 1000000).toFixed(2)}M
  Actual Annual Revenue: $${(actualAnnualRevenue / 1000000).toFixed(2)}M
  Achievement: ${achievement.toFixed(1)}%

  ${achievement >= 100 ? '✅ Exceeding projections!' : '⚠️ Below projections - investigate'}
  `);

  // Identify top and bottom performers
  const pages = summary.pages
    .filter(p => p.visits > 100) // Sufficient data
    .sort((a, b) => b.actual_cr - a.actual_cr);

  console.log('\n🏆 Top Performers:');
  pages.slice(0, 3).forEach((p, i) => {
    console.log(`${i + 1}. ${p.file}: ${p.actual_cr.toFixed(2)}% CR`);
  });

  console.log('\n⚠️ Needs Improvement:');
  pages.slice(-3).forEach((p, i) => {
    console.log(`${i + 1}. ${p.file}: ${p.actual_cr.toFixed(2)}% CR`);
  });
}

// Run validation weekly
setInterval(validateRevenueProjections, 7 * 24 * 60 * 60 * 1000);
```

---

## 🔧 Troubleshooting

### Issue: No Data Showing

**Solution:** Check that you're recording visits/conversions:

```javascript
// Verify data collection
console.log('Visits:', dashboard.metricsCollector.metrics);
console.log('Performance:', dashboard.performanceMonitor.measurements);
```

### Issue: Alerts Not Triggering

**Solution:** Ensure sufficient data:

```javascript
// Need at least 1000 visits per page for alerts
const data = dashboard.metricsCollector.metrics.get('workspace');
console.log('Visit count:', data.visits);
```

### Issue: Dashboard Not Updating

**Solution:** Call updateMetrics manually:

```javascript
// Force metrics update
PAGES.forEach(page => {
  dashboard.metricsCollector.updateMetrics(page.id);
});
```

---

## 📚 API Reference

### MetricsCollector

```javascript
// Record visit
dashboard.metricsCollector.recordVisit(pageId, timestamp?)

// Record conversion
dashboard.metricsCollector.recordConversion(pageId, timestamp?)

// Get summary
dashboard.metricsCollector.getSummary()

// Export JSON
dashboard.metricsCollector.exportJSON()
```

### PerformanceMonitor

```javascript
// Record Core Web Vitals
dashboard.performanceMonitor.recordCoreWebVitals(pageId, {
  lcp: number,    // Largest Contentful Paint (ms)
  fid: number,    // First Input Delay (ms)
  cls: number,    // Cumulative Layout Shift
  ttfb: number    // Time to First Byte (ms)
})

// Get summary
dashboard.performanceMonitor.getSummary()
```

### Dashboard

```javascript
// Generate report
dashboard.generateReport()

// Export JSON
dashboard.exportJSON()

// Export HTML
dashboard.exportHTML()
```

---

## 🎯 Best Practices

1. **Track Both Visits and Conversions**
   - Don't forget to call both methods
   - Track at the right time (page load vs. CTA click)

2. **Monitor Regularly**
   - Check dashboard at least daily
   - Set up automated alerts for critical issues

3. **Validate Projections**
   - Compare actual to projected revenue weekly
   - Adjust strategies based on real data

4. **Performance Matters**
   - Monitor Core Web Vitals
   - Fix performance issues immediately
   - Slow pages = lower conversions

5. **Test Before Deploying**
   - Test in staging environment first
   - Verify all tracking fires correctly
   - Check that alerts work

---

## 📞 Support

For questions or issues:
1. Review this deployment guide
2. Check the troubleshooting section
3. Refer to `monitoring/real-time-dashboard.js` source code
4. See `FEATURE-88-SUMMARY.md` for implementation details

---

**Last Updated:** 2026-02-01
**Version:** 1.0.0
**Status:** Ready for Production Deployment 🚀
