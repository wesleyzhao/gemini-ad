# GA4 Integration Guide for Optimization Framework

**Date**: 2026-02-01
**Purpose**: Connect Google Analytics 4 to the optimization monitoring framework
**Status**: Production-ready integration guide

---

## Overview

This guide shows you how to integrate Google Analytics 4 (GA4) with the optimization monitoring framework (Features #90-96) to replace mock data with real user metrics.

---

## Prerequisites

### 1. GA4 Setup
- ✅ GA4 property created for your domain
- ✅ Google Tag (gtag.js) installed on all 13 landing pages
- ✅ Enhanced measurement enabled
- ✅ Custom events configured (if needed)
- ✅ API access enabled

### 2. API Credentials
- ✅ Google Cloud Project created
- ✅ Analytics Data API enabled
- ✅ Service account created with Analytics Viewer role
- ✅ JSON key file downloaded

### 3. Node.js Dependencies
```bash
npm install @google-analytics/data
npm install dotenv
```

---

## Step 1: Install GA4 Data API

```bash
# Install required packages
npm install @google-analytics/data --save
npm install dotenv --save
npm install google-auth-library --save
```

---

## Step 2: Configure API Credentials

### Create `.env` file:
```bash
# .env (DO NOT commit to git!)
GA4_PROPERTY_ID=123456789
GA4_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
```

### Add to `.gitignore`:
```bash
echo ".env" >> .gitignore
echo "service-account-key.json" >> .gitignore
```

---

## Step 3: Create GA4 Data Connector

Create `lib/ga4-connector.js`:

```javascript
/**
 * GA4 Data Connector
 * Fetches real user data from Google Analytics 4
 */

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

class GA4Connector {
  constructor() {
    this.propertyId = `properties/${process.env.GA4_PROPERTY_ID}`;
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: process.env.GA4_SERVICE_ACCOUNT_KEY_PATH,
    });
  }

  /**
   * Fetch page performance metrics
   * @param {string} pagePath - Page path (e.g., '/writers.html')
   * @param {string} startDate - Start date (YYYY-MM-DD or 'NdaysAgo')
   * @param {string} endDate - End date (YYYY-MM-DD or 'today')
   * @returns {Promise<Object>} Page metrics
   */
  async getPageMetrics(pagePath, startDate = '7daysAgo', endDate = 'today') {
    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'eventCount' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: { value: pagePath },
          },
        },
      });

      if (!response.rows || response.rows.length === 0) {
        return null;
      }

      const row = response.rows[0];
      return {
        pagePath: row.dimensionValues[0].value,
        pageViews: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
        engagementRate: parseFloat(row.metricValues[2].value),
        avgSessionDuration: parseFloat(row.metricValues[3].value),
        bounceRate: parseFloat(row.metricValues[4].value),
        events: parseInt(row.metricValues[5].value),
      };
    } catch (error) {
      console.error('Error fetching page metrics:', error);
      throw error;
    }
  }

  /**
   * Fetch conversion events
   * @param {string} eventName - Event name (e.g., 'cta_click', 'sign_up')
   * @param {string} pagePath - Optional page filter
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Object>} Conversion metrics
   */
  async getConversionMetrics(eventName, pagePath = null, startDate = '7daysAgo', endDate = 'today') {
    try {
      const request = {
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [
          { name: 'eventCount' },
          { name: 'eventCountPerUser' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: eventName },
          },
        },
      };

      // Add page filter if specified
      if (pagePath) {
        request.dimensionFilter = {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: 'eventName',
                  stringFilter: { value: eventName },
                },
              },
              {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: { value: pagePath },
                },
              },
            ],
          },
        };
        request.dimensions.push({ name: 'pagePath' });
      }

      const [response] = await this.analyticsDataClient.runReport(request);

      if (!response.rows || response.rows.length === 0) {
        return { eventCount: 0, eventCountPerUser: 0 };
      }

      const row = response.rows[0];
      return {
        eventName: row.dimensionValues[0].value,
        eventCount: parseInt(row.metricValues[0].value),
        eventCountPerUser: parseFloat(row.metricValues[1].value),
      };
    } catch (error) {
      console.error('Error fetching conversion metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate conversion rate for a page
   * @param {string} pagePath - Page path
   * @param {string} conversionEvent - Conversion event name
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Object>} Conversion rate data
   */
  async getConversionRate(pagePath, conversionEvent = 'cta_click', startDate = '7daysAgo', endDate = 'today') {
    try {
      const [pageMetrics, conversionMetrics] = await Promise.all([
        this.getPageMetrics(pagePath, startDate, endDate),
        this.getConversionMetrics(conversionEvent, pagePath, startDate, endDate),
      ]);

      if (!pageMetrics || pageMetrics.pageViews === 0) {
        return {
          pagePath,
          pageViews: 0,
          conversions: 0,
          conversionRate: 0,
        };
      }

      const conversionRate = (conversionMetrics.eventCount / pageMetrics.pageViews) * 100;

      return {
        pagePath,
        pageViews: pageMetrics.pageViews,
        sessions: pageMetrics.sessions,
        conversions: conversionMetrics.eventCount,
        conversionRate: conversionRate,
        engagementRate: pageMetrics.engagementRate * 100,
        bounceRate: pageMetrics.bounceRate * 100,
        avgSessionDuration: pageMetrics.avgSessionDuration,
      };
    } catch (error) {
      console.error('Error calculating conversion rate:', error);
      throw error;
    }
  }

  /**
   * Fetch all pages performance
   * @param {Array<string>} pages - Array of page paths
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Array>} Array of page metrics
   */
  async getAllPagesMetrics(pages, startDate = '7daysAgo', endDate = 'today') {
    try {
      const results = await Promise.all(
        pages.map(page => this.getConversionRate(page, 'cta_click', startDate, endDate))
      );
      return results;
    } catch (error) {
      console.error('Error fetching all pages metrics:', error);
      throw error;
    }
  }

  /**
   * Compare two time periods (for A/B testing)
   * @param {string} pagePath - Page path
   * @param {string} baselineStart - Baseline start date
   * @param {string} baselineEnd - Baseline end date
   * @param {string} testStart - Test start date
   * @param {string} testEnd - Test end date
   * @returns {Promise<Object>} Comparison results
   */
  async compareTimePeriods(pagePath, baselineStart, baselineEnd, testStart, testEnd) {
    try {
      const [baseline, test] = await Promise.all([
        this.getConversionRate(pagePath, 'cta_click', baselineStart, baselineEnd),
        this.getConversionRate(pagePath, 'cta_click', testStart, testEnd),
      ]);

      const conversionLift = ((test.conversionRate - baseline.conversionRate) / baseline.conversionRate) * 100;
      const engagementLift = ((test.engagementRate - baseline.engagementRate) / baseline.engagementRate) * 100;

      return {
        pagePath,
        baseline: {
          pageViews: baseline.pageViews,
          conversions: baseline.conversions,
          conversionRate: baseline.conversionRate,
          engagementRate: baseline.engagementRate,
        },
        test: {
          pageViews: test.pageViews,
          conversions: test.conversions,
          conversionRate: test.conversionRate,
          engagementRate: test.engagementRate,
        },
        lift: {
          conversionRate: conversionLift,
          engagementRate: engagementLift,
        },
        isSignificant: Math.abs(conversionLift) > 5 && test.pageViews > 1000,
      };
    } catch (error) {
      console.error('Error comparing time periods:', error);
      throw error;
    }
  }
}

module.exports = GA4Connector;
```

---

## Step 4: Update Monitoring Scripts

### Update `monitor-production-metrics.js`:

Replace mock data generation with real GA4 data:

```javascript
// At the top of the file
const GA4Connector = require('./lib/ga4-connector');
const ga4 = new GA4Connector();

// Replace generateMockData() with:
async function fetchRealData(pages, startDate = '7daysAgo', endDate = 'today') {
  try {
    const data = await ga4.getAllPagesMetrics(pages, startDate, endDate);
    return data.map(page => ({
      page: page.pagePath.replace('.html', '').replace('/', ''),
      pageViews: page.pageViews,
      sessions: page.sessions,
      conversionRate: page.conversionRate / 100, // Convert to decimal
      conversions: page.conversions,
      bounceRate: page.bounceRate / 100,
      avgSessionDuration: page.avgSessionDuration,
    }));
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    console.log('Falling back to mock data...');
    return generateMockData(); // Fallback to mock data if GA4 fails
  }
}
```

---

## Step 5: Configure Custom Events in GA4

### Required Events:

1. **cta_click** - Primary conversion event
   - Triggered when user clicks main CTA button
   - Parameters: `button_text`, `page_path`, `button_position`

2. **sign_up** - Sign-up conversion
   - Triggered on sign-up form submission
   - Parameters: `method`, `page_path`

3. **scroll_depth** - Engagement metric
   - Triggered at 25%, 50%, 75%, 90% scroll
   - Parameters: `percent_scrolled`, `page_path`

4. **video_play** - Video engagement
   - Triggered when video starts playing
   - Parameters: `video_title`, `page_path`

### Example gtag.js implementation:

```html
<!-- Add to each landing page <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');

  // Track CTA clicks
  document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta, .cta-button, .btn-primary');
    ctaButtons.forEach(button => {
      button.addEventListener('click', function() {
        gtag('event', 'cta_click', {
          'button_text': this.textContent.trim(),
          'page_path': window.location.pathname,
          'button_position': this.dataset.position || 'unknown'
        });
      });
    });

    // Track scroll depth
    let scrollMarks = { 25: false, 50: false, 75: false, 90: false };
    window.addEventListener('scroll', function() {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      Object.keys(scrollMarks).forEach(mark => {
        if (scrollPercent >= mark && !scrollMarks[mark]) {
          scrollMarks[mark] = true;
          gtag('event', 'scroll_depth', {
            'percent_scrolled': mark,
            'page_path': window.location.pathname
          });
        }
      });
    });
  });
</script>
```

---

## Step 6: Test GA4 Connection

Create `test-ga4-connection.js`:

```javascript
const GA4Connector = require('./lib/ga4-connector');

async function testConnection() {
  console.log('Testing GA4 connection...\n');

  const ga4 = new GA4Connector();

  try {
    // Test 1: Fetch single page metrics
    console.log('Test 1: Fetching writers.html metrics...');
    const writerMetrics = await ga4.getConversionRate('/writers.html', 'cta_click', '7daysAgo', 'today');
    console.log('✅ Success:', writerMetrics);
    console.log('');

    // Test 2: Fetch all pages
    console.log('Test 2: Fetching all pages...');
    const allPages = [
      '/writers.html',
      '/creators.html',
      '/operators.html',
      '/automators.html',
      '/trust.html',
    ];
    const allMetrics = await ga4.getAllPagesMetrics(allPages, '7daysAgo', 'today');
    console.log('✅ Success:', allMetrics.length, 'pages fetched');
    console.log('');

    // Test 3: Compare time periods
    console.log('Test 3: Comparing time periods...');
    const comparison = await ga4.compareTimePeriods(
      '/writers.html',
      '14daysAgo',
      '7daysAgo',
      '7daysAgo',
      'today'
    );
    console.log('✅ Success:');
    console.log('  Baseline CR:', comparison.baseline.conversionRate.toFixed(2) + '%');
    console.log('  Test CR:', comparison.test.conversionRate.toFixed(2) + '%');
    console.log('  Lift:', comparison.lift.conversionRate.toFixed(2) + '%');
    console.log('');

    console.log('🎉 All tests passed! GA4 connection working.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check .env file exists with correct GA4_PROPERTY_ID');
    console.error('2. Verify service account key path is correct');
    console.error('3. Ensure Analytics Data API is enabled');
    console.error('4. Confirm service account has Analytics Viewer role');
  }
}

testConnection();
```

Run test:
```bash
node test-ga4-connection.js
```

---

## Step 7: Update All Monitoring Tools

### Files to update:

1. **monitor-production-metrics.js**
   - Replace `generateMockData()` with `fetchRealData()`
   - Use GA4Connector

2. **monitor-scaled-patterns.js**
   - Replace mock pattern performance with real GA4 data
   - Track pattern-specific metrics

3. **analyze-template-effectiveness.js**
   - Use real conversion data for baseline vs refined comparison
   - Calculate actual lift percentages

4. **execute-optimization-iterations.js**
   - Use GA4 for A/B test monitoring
   - Compare control vs variation with real data

5. **apply-winning-patterns.js**
   - Monitor applied pattern performance with GA4
   - Track before/after metrics

6. **continue-optimization-cycle.js**
   - Use real performance data for status reports
   - Calculate actual ROI and impact

---

## Step 8: Production Checklist

### Before Going Live:

- [ ] GA4 property configured with all landing pages
- [ ] Custom events (cta_click, sign_up, etc.) implemented
- [ ] Service account created with correct permissions
- [ ] `.env` file configured (not in git)
- [ ] Dependencies installed (`npm install`)
- [ ] Test connection successful (`node test-ga4-connection.js`)
- [ ] All monitoring scripts updated to use GA4Connector
- [ ] Data collection running for at least 7 days (for baseline)
- [ ] Automated monitoring scheduled (cron jobs)
- [ ] Team trained on dashboard and tools

---

## Step 9: Migration Strategy

### Week 1: Parallel Running
- ✅ Run both mock and real data
- ✅ Compare results for validation
- ✅ Identify any discrepancies

### Week 2: Gradual Cutover
- ✅ Switch 50% of monitoring to real data
- ✅ Monitor for issues
- ✅ Validate accuracy

### Week 3: Full Migration
- ✅ 100% real data
- ✅ Remove mock data generators
- ✅ Update documentation

---

## Troubleshooting

### Issue: "Permission denied" error
**Solution**: Ensure service account has "Viewer" role on GA4 property

### Issue: "No data returned"
**Solution**:
- Check property ID is correct
- Verify page paths match exactly (e.g., `/writers.html` not `writers.html`)
- Ensure data exists for the date range

### Issue: "Rate limit exceeded"
**Solution**:
- Implement caching for frequently accessed data
- Batch requests where possible
- Increase delay between API calls

### Issue: Conversion rate seems too high/low
**Solution**:
- Verify event name is correct
- Check event is firing (use GA4 DebugView)
- Confirm page path filter is accurate

---

## Best Practices

### 1. Caching
Implement 15-minute cache for API responses:

```javascript
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function getCachedData(key, fetchFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### 2. Error Handling
Always have fallback to mock data:

```javascript
async function fetchDataSafely() {
  try {
    return await ga4.getConversionRate(...);
  } catch (error) {
    console.warn('GA4 fetch failed, using mock data:', error.message);
    return generateMockData();
  }
}
```

### 3. Rate Limiting
Respect GA4 API quotas (25,000 requests/day):

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
});
```

### 4. Data Validation
Validate data before using:

```javascript
function validateMetrics(metrics) {
  if (!metrics || metrics.pageViews < 100) {
    console.warn('Insufficient data, skipping analysis');
    return false;
  }
  if (metrics.conversionRate > 50) {
    console.warn('Suspiciously high conversion rate, check implementation');
    return false;
  }
  return true;
}
```

---

## Expected Performance

### API Response Times:
- Single page query: 200-500ms
- Multi-page query (13 pages): 2-3 seconds
- Time period comparison: 500-1000ms

### Data Freshness:
- GA4 data is typically 24-48 hours delayed
- Real-time data available through Realtime API (separate)
- For production monitoring, 24-hour delay is acceptable

### Quota Usage:
- Daily monitoring: ~50 API calls/day
- Weekly analysis: ~200 API calls/week
- Monthly review: ~500 API calls/month
- Total: ~2,000 API calls/month (well under 25,000 quota)

---

## Support & Resources

### Google Analytics Documentation:
- [Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [GA4 Events](https://support.google.com/analytics/answer/9322688)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

### Internal Documentation:
- FEATURE-92-SUMMARY.md - Week 1 monitoring framework
- FEATURE-95-SUMMARY.md - Optimization execution
- FEATURE-96-SUMMARY.md - Pattern application

### Need Help?
- Check troubleshooting section above
- Review GA4 DebugView for event tracking
- Validate service account permissions
- Test with `test-ga4-connection.js`

---

## Summary

✅ **GA4 Integration Complete** when:
1. Service account configured
2. Custom events tracking
3. API connection tested
4. Monitoring scripts updated
5. Data validated against baselines
6. Automated monitoring running

**Estimated Setup Time**: 2-4 hours
**Time to First Data**: 7 days (baseline collection)
**Ongoing Maintenance**: 5-10 minutes/day

**Next**: Run automated monitoring with real data and continue optimization cycles!

---

*GA4 Integration Guide - Part of Feature #97*
*Complete Optimization Framework (Features #90-97)*
