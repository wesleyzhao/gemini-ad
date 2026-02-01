# Production Core Web Vitals Monitoring Guide

> **Feature #49**: Monitor Core Web Vitals in production and implement data-driven optimizations

## Overview

This guide explains how to monitor real user Core Web Vitals metrics in production and use data-driven insights to optimize your landing pages for better performance and user experience.

## Table of Contents

- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Data Collection](#data-collection)
- [Monitoring Dashboard](#monitoring-dashboard)
- [Alerts & Notifications](#alerts--notifications)
- [Optimization Workflow](#optimization-workflow)
- [GA4 Integration](#ga4-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Quick Start

### Running the Monitoring System

```bash
# Generate full monitoring report (recommended)
npm run monitor:cwv

# Analyze metrics only
npm run monitor:cwv:analyze

# Generate dashboard only
npm run monitor:cwv:dashboard

# Check for alerts only
npm run monitor:cwv:alerts
```

### Viewing the Dashboard

After running the monitoring system, open the dashboard:

```bash
# Latest dashboard
open reports/dashboards/latest.html

# Or specific date
open reports/dashboards/cwv-dashboard-2026-02-01.html
```

---

## System Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Landing Pages (20)                       │
│                 (web-vitals monitoring injected)             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Google Analytics 4   │
          │  (Real User Metrics)  │
          └──────────┬────────────┘
                     │
                     ▼
       ┌─────────────────────────────┐
       │  monitor-production-cwv.js   │
       │  - Extract GA4 data          │
       │  - Analyze metrics           │
       │  - Generate recommendations  │
       │  - Detect issues             │
       └────────────┬─────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    ┌──────────┐         ┌──────────┐
    │Dashboard │         │ Alerts   │
    │  (HTML)  │         │  (JSON)  │
    └──────────┘         └──────────┘
```

### Data Flow

1. **User visits landing page** → Page loads with web-vitals monitoring
2. **User interacts** → Browser measures LCP, FID, INP, CLS, FCP, TTFB
3. **Metrics sent to GA4** → Real-time data collection
4. **Monitoring script runs** → Extracts and analyzes data
5. **Dashboard generated** → Visual performance overview
6. **Alerts triggered** → Notifications for critical issues
7. **Recommendations provided** → Data-driven optimization suggestions

---

## Data Collection

### Metrics Collected

All landing pages automatically collect these Core Web Vitals:

#### Primary Metrics (Google's Core Web Vitals)

| Metric | What It Measures | Good | Poor | Target |
|--------|------------------|------|------|--------|
| **LCP** | Loading performance | ≤2.5s | >4.0s | ≤2.0s |
| **FID** | First interactivity | ≤100ms | >300ms | ≤50ms |
| **INP** | Overall responsiveness | ≤200ms | >500ms | ≤150ms |
| **CLS** | Visual stability | ≤0.1 | >0.25 | ≤0.05 |

#### Secondary Metrics

| Metric | What It Measures | Good | Poor |
|--------|------------------|------|------|
| **FCP** | First paint | ≤1.8s | >3.0s |
| **TTFB** | Server response | ≤800ms | >1.8s |

### What Gets Tracked

For each metric, we collect:

- **Value**: The measured metric value (e.g., 2.3s for LCP)
- **Rating**: good, needs-improvement, or poor
- **ID**: Unique identifier for the measurement
- **Page**: Which landing page the metric came from
- **Device**: Mobile, desktop, or tablet
- **Connection**: 3G, 4G, 5G, or WiFi

### Data Segments

Metrics are segmented by:

1. **Page variant** (which landing page)
2. **Device type** (mobile, desktop, tablet)
3. **Connection type** (3G, 4G, 5G, WiFi)
4. **Geography** (when available)
5. **Time period** (hourly, daily, weekly trends)

---

## Monitoring Dashboard

### Dashboard Features

The auto-generated dashboard provides:

1. **Executive Summary**
   - Total pages analyzed
   - Performance distribution (excellent/good/needs-work/poor)
   - Overall health score

2. **Core Web Vitals Overview**
   - LCP, FID, INP, CLS metrics
   - Percentage of users with good experience
   - Visual progress bars

3. **Alerts & Issues**
   - Critical performance problems
   - Pages needing attention
   - Percentage of users affected

4. **Recommendations**
   - Data-driven optimization suggestions
   - Prioritized action items
   - Expected impact

5. **Page-Level Metrics**
   - Individual page performance
   - Device breakdown
   - Connection type analysis

### Understanding the Dashboard

#### Summary Cards

```
┌─────────────────┐
│   Excellent     │  ≥90% of users have good CWV
│       5         │  All metrics performing well
└─────────────────┘

┌─────────────────┐
│     Good        │  75-90% of users have good CWV
│       8         │  Most metrics performing well
└─────────────────┘

┌─────────────────┐
│  Needs Work     │  50-75% of users have good CWV
│       3         │  Some optimization needed
└─────────────────┘

┌─────────────────┐
│     Poor        │  <50% of users have good CWV
│       0         │  Immediate action required
└─────────────────┘
```

#### Metric Cards

Each metric shows:
- **Percentage good**: Primary indicator
- **Visual bar**: Distribution across good/needs-improvement/poor
- **Breakdown**: Exact percentages for each rating

**Color coding**:
- 🟢 Green (≥75% good) = Excellent
- 🟡 Yellow (50-75% good) = Needs attention
- 🔴 Red (<50% good) = Critical

---

## Alerts & Notifications

### Alert Levels

#### 🚨 Critical (>25% users affected)

Triggers when more than 25% of users experience poor metrics.

**Example**:
```
🚨 CRITICAL: trust.html - LCP: 30% of users experiencing
poor LCP (>4000ms)
```

**Action**: Immediate investigation and fix required.

#### ⚠️ Warning (10-25% users affected)

Triggers when 10-25% of users experience poor metrics.

**Example**:
```
⚠️  WARNING: creators.html - CLS: 15% of users experiencing
poor CLS
```

**Action**: Schedule optimization work.

#### ℹ️ Info (<10% users affected)

Minor issues affecting small percentage of users.

**Action**: Monitor and optimize when convenient.

### Alert Storage

Alerts are saved to:
```
reports/alerts/alerts-2026-02-01.json
```

**Format**:
```json
{
  "critical": [
    {
      "severity": "critical",
      "page": "trust.html",
      "metric": "LCP",
      "message": "30% of users experiencing poor LCP (>4000ms)",
      "value": 4500
    }
  ],
  "warning": [...],
  "info": [...]
}
```

### Automated Alert Actions

When alerts are detected:

1. **Log to console** during monitoring runs
2. **Save to JSON file** for historical tracking
3. **Display in dashboard** with prominent badges
4. **Include in email reports** (when configured)

---

## Optimization Workflow

### 1. Analyze Current Performance

```bash
npm run monitor:cwv
```

This generates:
- Performance dashboard
- List of issues
- Recommendations

### 2. Review Dashboard

Open `reports/dashboards/latest.html` and identify:

- **Critical alerts** (fix first)
- **Most common issues** (biggest impact)
- **Page-specific problems** (targeted fixes)

### 3. Prioritize Issues

Use this priority framework:

**Priority 1 - Critical** (Fix immediately)
- >25% users affected
- Core business pages (trust.html, workspace.html)
- Multiple metrics failing

**Priority 2 - High** (Fix this week)
- 10-25% users affected
- Key conversion pages
- Single metric failing badly

**Priority 3 - Medium** (Fix this month)
- 5-10% users affected
- Supporting pages
- Metrics in "needs improvement" range

**Priority 4 - Low** (Optimize when convenient)
- <5% users affected
- Edge cases
- Already meeting "good" threshold

### 4. Implement Optimizations

Follow recommendations from the dashboard. Common fixes:

#### For LCP (Largest Contentful Paint)

```bash
# Optimize images
npm run optimize-images

# Check implementation
node scripts/core-web-vitals.js --analyze
```

**Manual optimizations**:
- Convert images to WebP
- Add responsive srcset
- Inline critical CSS
- Preload hero images
- Enable CDN

#### For FID/INP (Interactivity)

```javascript
// Before: Blocking JavaScript
<script src="heavy-library.js"></script>

// After: Deferred JavaScript
<script src="heavy-library.js" defer></script>
```

**Additional optimizations**:
- Split long tasks
- Use web workers
- Debounce expensive operations
- Remove unused JavaScript

#### For CLS (Cumulative Layout Shift)

```html
<!-- Before: No dimensions -->
<img src="hero.jpg" alt="Hero">

<!-- After: Explicit dimensions -->
<img src="hero.jpg" width="1200" height="800" alt="Hero">
```

**Additional optimizations**:
- Add aspect-ratio CSS
- Reserve space for ads/embeds
- Use font-display: swap
- Avoid layout-shifting animations

#### For TTFB (Time to First Byte)

- Enable server-side caching
- Use CDN
- Optimize backend
- Enable HTTP/2
- Enable compression

### 5. Test Changes

```bash
# Run validation
npm run validate

# Check Core Web Vitals
npm run test:cwv

# Generate new report
npm run monitor:cwv
```

### 6. Deploy & Monitor

1. Deploy changes to production
2. Wait 7 days for data collection
3. Run monitoring again
4. Compare before/after metrics
5. Iterate based on results

---

## GA4 Integration

### Current Status

**Monitoring is live** on all pages. Each page sends real-time metrics to Google Analytics 4.

### Setting Up GA4 Data API (Optional)

For automated data extraction from GA4:

#### 1. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google Analytics Data API
4. Create service account
5. Download credentials JSON

#### 2. Grant Access

1. Go to [Google Analytics](https://analytics.google.com)
2. Admin → Property Access Management
3. Add service account email
4. Grant "Viewer" permissions

#### 3. Configure Environment

```bash
# .env file
GA4_ENABLED=true
GA4_PROPERTY_ID=123456789
GA4_CREDENTIALS_PATH=./ga4-credentials.json
```

#### 4. Install Dependencies

```bash
npm install @google-analytics/data
```

#### 5. Test Connection

```bash
npm run monitor:cwv
```

Should now fetch real data instead of simulated data.

### GA4 Queries

The monitoring system can query GA4 for:

**Metrics**:
- LCP values and distribution
- FID values and distribution
- INP values and distribution
- CLS values and distribution
- FCP, TTFB values

**Dimensions**:
- Page path (which landing page)
- Device category (mobile/desktop/tablet)
- Connection type (3G/4G/5G/WiFi)
- Country
- Date/time

**Date Ranges**:
- Last 24 hours
- Last 7 days (default)
- Last 30 days
- Custom range

---

## Troubleshooting

### Issue: Dashboard shows "No data"

**Causes**:
- Pages not deployed yet
- GA4 not configured
- Insufficient traffic

**Solutions**:
1. Verify pages are live and accessible
2. Check GA4 configuration
3. Wait for sufficient traffic (100+ visits)
4. Use simulated data for testing: `GA4_ENABLED=false`

### Issue: Metrics look unrealistic

**Causes**:
- Using simulated data
- GA4 API not configured

**Solution**:
Configure GA4 integration (see [GA4 Integration](#ga4-integration))

### Issue: High CLS scores

**Common causes**:
- Images without dimensions
- Web fonts causing FOIT
- Late-loading ads/embeds

**Debug**:
```bash
# Check for images without dimensions
grep -r "img src" pages/ | grep -v "width=" | grep -v "height="

# Check font loading
grep -r "font-display" pages/
```

### Issue: High LCP scores

**Common causes**:
- Large hero images
- Render-blocking CSS/JS
- Slow server response

**Debug**:
```bash
# Run Lighthouse
npm run lighthouse

# Check image sizes
ls -lh pages/assets/images/

# Analyze waterfall in DevTools Network tab
```

### Issue: Monitoring script fails

**Error**: `Cannot find module @google-analytics/data`

**Solution**:
```bash
# Simulated mode (no GA4 API)
GA4_ENABLED=false npm run monitor:cwv

# Or install dependencies
npm install @google-analytics/data
```

---

## Best Practices

### 1. Monitor Regularly

```bash
# Add to cron for weekly monitoring
0 9 * * MON npm run monitor:cwv
```

**Recommended frequency**:
- Production sites: Daily
- Development: Weekly
- After major changes: Immediately

### 2. Set Performance Budgets

Define and enforce performance budgets in `performance-budgets.json`:

```json
{
  "coreweb vitals": {
    "lcp": { "target": 2000, "max": 2500 },
    "fid": { "target": 50, "max": 100 },
    "inp": { "target": 150, "max": 200 },
    "cls": { "target": 0.05, "max": 0.1 }
  }
}
```

### 3. Segment Your Data

Analyze performance by:

- **Device**: Mobile often slower than desktop
- **Connection**: 3G vs 5G differences
- **Geography**: Server distance impacts TTFB
- **Time of day**: Peak hours may be slower

### 4. Track Trends Over Time

Compare metrics week-over-week:

```bash
# Generate historical comparison
node scripts/monitor-production-cwv.js --historical
```

### 5. Correlate with Business Metrics

Track relationship between performance and:

- Conversion rates
- Bounce rates
- Time on page
- Revenue per visitor

**Example insights**:
- 1s faster LCP = +5% conversion rate
- <100ms FID = +10% user engagement
- Zero CLS = -15% bounce rate

### 6. A/B Test Performance Optimizations

Use A/B testing framework to measure impact:

```bash
# Create performance variation
npm run create-ab-test -- --type=performance
```

Test:
- Image formats (JPEG vs WebP)
- Lazy loading strategies
- Font loading approaches
- Critical CSS techniques

### 7. Automate Response to Alerts

Create automated workflows:

**Example**: Slack notifications for critical alerts

```bash
# In CI/CD pipeline
if [ $(npm run monitor:cwv:alerts --silent | grep CRITICAL | wc -l) -gt 0 ]; then
  curl -X POST $SLACK_WEBHOOK \
    -d "Performance alert: Critical CWV issues detected"
fi
```

### 8. Document All Changes

When optimizing:

1. Record baseline metrics
2. Document changes made
3. Measure impact after 7 days
4. Update CONTEXT.md with learnings

---

## Monitoring Checklist

### Daily
- [ ] Check for critical alerts
- [ ] Review dashboard health score
- [ ] Respond to alerts

### Weekly
- [ ] Generate full monitoring report
- [ ] Review trends vs previous week
- [ ] Prioritize optimization work
- [ ] Update team on performance status

### Monthly
- [ ] Comprehensive performance review
- [ ] Analyze correlation with business metrics
- [ ] Update performance budgets
- [ ] Plan optimization sprints

### Quarterly
- [ ] Deep-dive analysis
- [ ] Competitive benchmarking
- [ ] Update monitoring strategy
- [ ] Present findings to stakeholders

---

## Reports & Outputs

### Generated Files

```
reports/
├── dashboards/
│   ├── latest.html                    # Most recent dashboard
│   ├── cwv-dashboard-2026-02-01.html  # Daily dashboards
│   └── cwv-dashboard-2026-01-25.html
├── alerts/
│   ├── alerts-2026-02-01.json         # Daily alerts
│   └── alerts-2026-01-25.json
└── cwv-monitoring-report-2026-02-01.json  # Full JSON reports
```

### Report Contents

**Dashboard (HTML)**:
- Executive summary
- Alerts and issues
- Core Web Vitals overview
- Recommendations
- Page-level breakdowns

**Alerts (JSON)**:
- Critical, warning, info levels
- Affected pages and metrics
- User impact percentages

**Full Report (JSON)**:
- Complete dataset
- All metrics and dimensions
- Historical comparisons
- Configuration settings

---

## Integration Examples

### CI/CD Integration

```yaml
# .github/workflows/monitor-performance.yml
name: Monitor Performance

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run monitor:cwv
      - uses: actions/upload-artifact@v3
        with:
          name: performance-reports
          path: reports/
```

### Slack Notifications

```javascript
// scripts/notify-slack.js
const { WebClient } = require('@slack/web-api');
const alerts = require('../reports/alerts/latest.json');

const slack = new WebClient(process.env.SLACK_TOKEN);

if (alerts.critical.length > 0) {
  slack.chat.postMessage({
    channel: '#performance-alerts',
    text: `🚨 ${alerts.critical.length} critical performance issues detected!`,
    attachments: alerts.critical.map(alert => ({
      color: 'danger',
      text: `${alert.page}: ${alert.message}`
    }))
  });
}
```

### Email Reports

```javascript
// scripts/email-report.js
const nodemailer = require('nodemailer');
const fs = require('fs');

const dashboard = fs.readFileSync('reports/dashboards/latest.html', 'utf-8');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: 'performance@yourcompany.com',
  to: 'team@yourcompany.com',
  subject: 'Weekly Performance Report',
  html: dashboard
});
```

---

## Next Steps

1. **Deploy pages to production** (if not already live)
2. **Configure GA4 integration** for real data
3. **Set up automated monitoring** (daily/weekly)
4. **Create performance dashboards** for team visibility
5. **Establish performance culture** with regular reviews
6. **Iterate and optimize** based on real user data

---

## Resources

### Internal Documentation
- [Core Web Vitals Optimization Guide](./CORE_WEB_VITALS.md)
- [Image Optimization Guide](./IMAGE_OPTIMIZATION.md)
- [Performance Budgets](../performance-budgets.json)
- [A/B Testing Framework](./AB_TESTING_FRAMEWORK.md)

### External Resources
- [Web Vitals](https://web.dev/vitals/)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Tools
- [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Last Updated**: 2026-02-01
**Feature**: #49 - Production Core Web Vitals Monitoring
**Status**: ✅ Complete
**Maintainer**: Performance Team
