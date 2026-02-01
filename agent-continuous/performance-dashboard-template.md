# Performance Dashboard Template
**Google Sheets Configuration for Gemini Landing Pages**

Last Updated: 2026-02-01

---

## Overview

This document provides the complete setup for a Google Sheets-based performance dashboard that tracks Core Web Vitals, user engagement, and conversion metrics.

**Dashboard URL:** [Create your own copy](https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/copy)

---

## Sheet Structure

### Tab 1: 📊 Overview Dashboard

**Purpose:** Quick snapshot of current performance vs. targets

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  GEMINI LANDING PAGES - PERFORMANCE DASHBOARD               │
│  Last Updated: [Auto-updated timestamp]                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────── CORE WEB VITALS (Last 7 Days) ─────────────┐
│ Metric     │ Current │ Previous │ Change  │ Target │ Status │
├────────────┼─────────┼──────────┼─────────┼────────┼────────┤
│ LCP (avg)  │  2.1s   │   2.3s   │ ↓ 8.7%  │ <2.5s  │   ✅   │
│ FID (avg)  │  45ms   │   52ms   │ ↓ 13.5% │ <100ms │   ✅   │
│ CLS (avg)  │  0.08   │   0.12   │ ↓ 33.3% │ <0.1   │   ✅   │
│ INP (avg)  │  180ms  │   195ms  │ ↓ 7.7%  │ <200ms │   ✅   │
│ TTFB (avg) │  650ms  │   720ms  │ ↓ 9.7%  │ <800ms │   ✅   │
└────────────┴─────────┴──────────┴─────────┴────────┴────────┘

┌────────────── USER ENGAGEMENT (Last 7 Days) ───────────────┐
│ Metric            │ Current │ Previous │ Change  │ Target │
├───────────────────┼─────────┼──────────┼─────────┼────────┤
│ Total Visitors    │  6,565  │  5,890   │ ↑ 11.5% │  5,000 │
│ Conversion Rate   │  3.2%   │   2.9%   │ ↑ 10.3% │  >3.0% │
│ Bounce Rate       │  42%    │   45%    │ ↓ 6.7%  │  <50%  │
│ Avg. Time on Page │  2:15   │   2:05   │ ↑ 8.0%  │  >2:00 │
│ Scroll to 75%+    │  58%    │   53%    │ ↑ 9.4%  │  >50%  │
└───────────────────┴─────────┴──────────┴─────────┴────────┘

┌──────────────── USER FEEDBACK (Last 7 Days) ───────────────┐
│ Total Responses: 234                                        │
│ Helpful (Yes): 88%    Not Helpful (No): 12%                │
│                                                              │
│ Top Issues:                                                 │
│  1. Need more pricing information (15 mentions)            │
│  2. Mobile load speed concerns (8 mentions)                │
│  3. Want more case studies (6 mentions)                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────── PERFORMANCE ALERTS ────────────────────────┐
│ 🟢 All systems green - No critical issues                  │
│ ⚠️  Mobile LCP slightly elevated (2.8s vs 2.5s target)     │
└─────────────────────────────────────────────────────────────┘
```

**Formulas:**

- **Change %:** `=(Current-Previous)/Previous`
- **Status:** `=IF(Current<=Target,"✅","⚠️")`
- **Color Coding:** Green if meeting target, Yellow if within 10%, Red if >10% over

---

### Tab 2: 📄 Page-by-Page Analysis

**Purpose:** Detailed breakdown of each landing page's performance

**Columns:**

| Column | Formula/Source | Description |
|--------|----------------|-------------|
| Page Name | Manual | e.g., "apple-style.html" |
| Visitors (7d) | GA4 Export | Total unique visitors |
| Conversion Rate | `=Conversions/Visitors` | CTA click rate |
| Avg. LCP | GA4 Web Vitals | Largest Contentful Paint |
| Avg. FID | GA4 Web Vitals | First Input Delay |
| Avg. CLS | GA4 Web Vitals | Cumulative Layout Shift |
| Bounce Rate | GA4 Export | % who left immediately |
| Avg. Time | GA4 Export | Average session duration |
| Performance Score | `=AVERAGE(LCP_Score, FID_Score, CLS_Score)` | Composite 0-100 |
| Status | `=IF(Score>=90,"🟢","⚠️")` | Health indicator |

**Example Data:**

```
Page                    │ Visitors │ Conv.% │ LCP   │ FID  │ CLS  │ Bounce │ Time  │ Score
────────────────────────┼──────────┼────────┼───────┼──────┼──────┼────────┼───────┼───────
apple-style.html        │   1,240  │  2.8%  │ 2.3s  │ 38ms │ 0.06 │  44%   │ 2:12  │ 92
productivity.html       │     980  │  3.5%  │ 2.0s  │ 42ms │ 0.09 │  41%   │ 2:18  │ 95
trust.html              │   1,450  │  4.1%  │ 1.9s  │ 35ms │ 0.07 │  38%   │ 2:30  │ 97
writers.html            │     875  │  3.8%  │ 2.2s  │ 40ms │ 0.08 │  39%   │ 2:25  │ 94
creators.html           │     920  │  3.2%  │ 2.1s  │ 45ms │ 0.10 │  43%   │ 2:15  │ 93
operators.html          │   1,100  │  4.5%  │ 1.8s  │ 32ms │ 0.05 │  36%   │ 2:35  │ 98
```

**Conditional Formatting:**
- Green: Performance Score ≥ 90
- Yellow: 80-89
- Red: < 80

---

### Tab 3: 📱 Device Breakdown

**Purpose:** Performance comparison across device types

**Columns:**

| Device Type | % of Traffic | Visitors | Conv. Rate | Avg. LCP | Avg. FID | Avg. CLS | Bounce Rate |
|-------------|--------------|----------|------------|----------|----------|----------|-------------|
| Desktop     | 45%          | 2,954    | 4.2%       | 1.8s     | 35ms     | 0.06     | 38%         |
| Mobile      | 48%          | 3,151    | 2.6%       | 2.8s     | 55ms     | 0.12     | 48%         |
| Tablet      | 7%           | 460      | 3.1%       | 2.2s     | 42ms     | 0.08     | 42%         |

**Charts:**
1. **Pie Chart:** Traffic distribution by device
2. **Bar Chart:** Conversion rate comparison
3. **Line Chart:** LCP trends over time by device

**Key Insights:**
- Mobile has worse performance (2.8s LCP vs 1.8s desktop)
- Mobile conversion rate 38% lower than desktop
- **Action:** Prioritize mobile optimization

---

### Tab 4: 🌐 Browser Breakdown

**Purpose:** Cross-browser performance analysis

**Columns:**

| Browser | % Traffic | Visitors | Conv. Rate | Avg. LCP | Issues | Priority |
|---------|-----------|----------|------------|----------|--------|----------|
| Chrome  | 68%       | 4,464    | 3.5%       | 2.0s     | None   | Low      |
| Safari  | 18%       | 1,182    | 3.2%       | 2.3s     | CLS    | Medium   |
| Firefox | 8%        | 525      | 3.0%       | 2.2s     | None   | Low      |
| Edge    | 6%        | 394      | 3.4%       | 2.1s     | None   | Low      |

**Action Items:**
- Investigate Safari CLS issue (0.12 vs 0.06 in Chrome)
- Test on real Safari devices (iOS and macOS)

---

### Tab 5: 💬 User Feedback Log

**Purpose:** Track all user feedback submissions

**Columns:**

| Date | Page | Rating | Comment | Theme | Status | Action Taken |
|------|------|--------|---------|-------|--------|--------------|
| 2026-01-25 | trust.html | No | "Too much text, hard to read" | Readability | Done | Reduced paragraph length |
| 2026-01-26 | writers.html | Yes | "Love the examples!" | Positive | - | - |
| 2026-01-27 | productivity.html | No | "Slow on my phone" | Performance | In Progress | Optimizing images |
| 2026-01-28 | operators.html | Yes | "Perfect for my workflow" | Positive | - | - |

**Pivot Table:**
- **Rows:** Theme
- **Values:** Count of Feedback
- **Filter:** Last 30 days

**Theme Categories:**
- Performance
- Content
- Design
- Features
- Trust
- Pricing
- Other

---

### Tab 6: 📈 Weekly Trends

**Purpose:** Track metrics over time to spot trends

**Columns:**

| Week Starting | Total Visitors | Conv. Rate | Avg. LCP | Avg. FID | Avg. CLS | Feedback % Positive |
|---------------|----------------|------------|----------|----------|----------|---------------------|
| 2026-01-05    | 5,234          | 2.5%       | 2.6s     | 58ms     | 0.13     | 82%                 |
| 2026-01-12    | 5,890          | 2.9%       | 2.3s     | 52ms     | 0.12     | 85%                 |
| 2026-01-19    | 6,245          | 3.1%       | 2.2s     | 48ms     | 0.10     | 87%                 |
| 2026-01-26    | 6,565          | 3.2%       | 2.1s     | 45ms     | 0.08     | 88%                 |

**Charts:**
1. **Line Chart:** Conversion rate over time
2. **Combo Chart:** Visitors (bars) + Conv. Rate (line)
3. **Area Chart:** Core Web Vitals trends

**Trend Analysis:**
- ✅ Steady improvement in all Core Web Vitals
- ✅ Conversion rate up 28% in 4 weeks
- ✅ User satisfaction increasing

---

### Tab 7: 🎯 A/B Test Results

**Purpose:** Track performance of A/B test variations

**See Also:** `AB_TEST_ANALYSIS_FRAMEWORK.md`

**Columns:**

| Test Name | Control Page | Variation | Control Conv. | Var. Conv. | Lift | Significance | Winner | Status |
|-----------|--------------|-----------|---------------|------------|------|--------------|--------|--------|
| Apple Style | apple-style.html | apple-style-b.html | 2.8% | 3.1% | +10.7% | 87% | TBD | Running |
| Productivity | productivity.html | productivity-b.html | 3.1% | 3.6% | +16.1% | 94% | Variation | Implement |
| Trust | trust.html | trust-b.html | 4.1% | 4.8% | +17.1% | 96% | Variation | Implement |

**Decision Criteria:**
- ✅ Implement if: Lift >10% AND Significance >95%
- ⏸ Keep Running if: Significance <95%
- ❌ Archive if: Lift <5% at 95% significance

---

### Tab 8: 💰 Performance Budget Tracker

**Purpose:** Monitor asset sizes and request counts

**Columns:**

| Page | HTML Size | CSS Size | JS Size | Images | Fonts | Total Size | Budget | Status |
|------|-----------|----------|---------|--------|-------|------------|--------|--------|
| apple-style.html | 65 KB | 45 KB | 95 KB | 320 KB | 60 KB | 585 KB | 1 MB | ✅ |
| productivity.html | 72 KB | 45 KB | 95 KB | 380 KB | 60 KB | 652 KB | 1 MB | ✅ |
| trust.html | 68 KB | 45 KB | 95 KB | 290 KB | 60 KB | 558 KB | 1 MB | ✅ |

**Budget Alerts:**
- 🟢 Green: < 80% of budget
- 🟡 Yellow: 80-100% of budget
- 🔴 Red: > 100% of budget

**Request Count:**

| Page | HTML | CSS | JS | Images | Fonts | Total | Budget | Status |
|------|------|-----|----|----|-------|-------|--------|--------|
| apple-style.html | 1 | 1 | 3 | 12 | 2 | 19 | 30 | ✅ |
| productivity.html | 1 | 1 | 3 | 15 | 2 | 22 | 30 | ✅ |

---

## Data Import Instructions

### Step 1: Export from Google Analytics 4

**Navigate to:** Explore → Create New Exploration

**Metrics to Include:**
- Sessions
- Engaged sessions
- Conversions (CTA clicks)
- Average engagement time
- Bounce rate
- Event count (by event name)

**Dimensions:**
- Page path
- Device category
- Browser
- Date

**Export Format:** Google Sheets (creates automatic connection)

### Step 2: Import Core Web Vitals

**Option A: Google Search Console**
1. Go to Search Console → Core Web Vitals
2. Export data
3. Import to "Core Web Vitals Raw Data" tab

**Option B: Chrome User Experience Report (CrUX)**
1. Use BigQuery: `chrome-ux-report.all.*`
2. Query for your domain
3. Export to Sheets

**Option C: Web Vitals Library (Real-Time)**
1. Data sent to GA4 via `web_vitals` event
2. Export from GA4 Events report

### Step 3: User Feedback Collection

**Option A: Google Forms Integration**
1. Create Google Form for feedback
2. Link responses to "User Feedback Log" tab
3. Automatic updates

**Option B: Custom Backend**
1. Set up simple API endpoint
2. POST feedback data
3. Use Apps Script to import

---

## Automation with Google Apps Script

### Auto-Update Dashboard Weekly

```javascript
/**
 * Weekly Performance Dashboard Update
 * Runs every Monday at 9 AM
 */
function updateDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const overviewSheet = ss.getSheetByName('Overview Dashboard');

  // Update timestamp
  overviewSheet.getRange('B2').setValue(new Date());

  // Calculate week-over-week changes
  const trendsSheet = ss.getSheetByName('Weekly Trends');
  const lastRow = trendsSheet.getLastRow();

  if (lastRow >= 3) {
    const currentWeek = trendsSheet.getRange(lastRow, 2, 1, 6).getValues()[0];
    const previousWeek = trendsSheet.getRange(lastRow - 1, 2, 1, 6).getValues()[0];

    // Calculate changes and update Overview
    for (let i = 0; i < currentWeek.length; i++) {
      const change = ((currentWeek[i] - previousWeek[i]) / previousWeek[i]) * 100;
      overviewSheet.getRange(5 + i, 4).setValue(change.toFixed(1) + '%');
    }
  }

  // Send email alert if any metric is below threshold
  checkAlerts();
}

/**
 * Check for performance alerts
 */
function checkAlerts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const overviewSheet = ss.getSheetByName('Overview Dashboard');

  const metrics = overviewSheet.getRange('A5:E9').getValues();
  const alerts = [];

  metrics.forEach(row => {
    const [metric, current, previous, change, target, status] = row;
    if (status !== '✅') {
      alerts.push(`⚠️ ${metric}: ${current} (Target: ${target})`);
    }
  });

  if (alerts.length > 0) {
    MailApp.sendEmail({
      to: 'team@example.com',
      subject: '⚠️ Performance Dashboard Alert',
      body: 'The following metrics need attention:\n\n' + alerts.join('\n')
    });
  }
}

/**
 * Set up triggers (run once)
 */
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Weekly update every Monday at 9 AM
  ScriptApp.newTrigger('updateDashboard')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}
```

---

## Visualization Recommendations

### Chart 1: Core Web Vitals Gauge Charts

**Type:** Gauge Chart
**Data:** Current LCP, FID, CLS
**Ranges:**
- Green: Good (0-2.5s for LCP, 0-100ms for FID, 0-0.1 for CLS)
- Yellow: Needs Improvement
- Red: Poor

### Chart 2: Conversion Funnel

**Type:** Funnel Chart
**Steps:**
1. Page Load (100%)
2. Scroll to 25% (85%)
3. Scroll to 50% (68%)
4. Scroll to 75% (58%)
5. CTA Click (3.2%)

### Chart 3: Performance Trends

**Type:** Line Chart with multiple series
**X-axis:** Week
**Y-axis:** Milliseconds/Score
**Series:** LCP, FID, INP, Performance Score

### Chart 4: Device Performance Comparison

**Type:** Grouped Column Chart
**Categories:** Desktop, Mobile, Tablet
**Series:** LCP, FID, CLS

---

## Weekly Review Checklist

**Monday Morning (30 min):**
- [ ] Run dashboard update script
- [ ] Review automated email alerts
- [ ] Check for anomalies in data
- [ ] Update "Weekly Trends" tab

**Monday Afternoon (60 min):**
- [ ] Analyze week-over-week changes
- [ ] Review user feedback themes
- [ ] Identify top 3 priorities for the week
- [ ] Create GitHub issues for action items

**Friday (30 min):**
- [ ] Document completed improvements
- [ ] Measure impact of changes
- [ ] Update stakeholders via email
- [ ] Set goals for next week

---

## Key Stakeholders

**Dashboard Access:**
- 👁️ View Only: Marketing team, executives
- ✏️ Edit Access: Performance team, developers
- 🔧 Admin: Tech lead, product manager

**Email Reports:**
- Weekly summary: All stakeholders
- Critical alerts: Tech lead, on-call engineer
- Monthly executive summary: VP Product, VP Engineering

---

## Next Steps

1. **Week 1:**
   - [ ] Create Google Sheet from this template
   - [ ] Set up GA4 data connector
   - [ ] Import initial data
   - [ ] Create basic charts

2. **Week 2:**
   - [ ] Add Apps Script automation
   - [ ] Configure email alerts
   - [ ] Train team on dashboard usage

3. **Week 3:**
   - [ ] Refine metrics based on feedback
   - [ ] Add custom dimensions
   - [ ] Create mobile-friendly view

4. **Ongoing:**
   - [ ] Weekly data reviews
   - [ ] Monthly dashboard improvements
   - [ ] Quarterly target adjustments

---

**Template Version:** 1.0
**Last Updated:** 2026-02-01
**Owner:** Performance Team

---
