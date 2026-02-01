# Google Analytics 4 Integration Guide

## Overview

This guide walks through integrating Google Analytics 4 (GA4) with the Gemini Ads landing pages to enable Real User Monitoring (RUM) and A/B test tracking.

## Prerequisites

- Google Analytics 4 property created
- GA4 Measurement ID (format: G-XXXXXXXXXX)
- Admin access to GA4 property

## Step 1: Add GA4 to Landing Pages

Add this script to the `<head>` section of all landing pages:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    'anonymize_ip': true
  });
</script>
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Step 2: Configure Custom Dimensions

In GA4 Admin > Custom Definitions > Create Custom Dimensions:

| Dimension Name | Scope | Description | Event Parameter |
|---|---|---|---|
| AB Test Name | Event | The A/B test identifier | ab_test |
| AB Test Variant | Event | The variant (control/variantA/variantB) | variant |
| User Segment | User | User type (writer/creator/operator/automator) | user_segment |
| Page Template | Event | Landing page template | page_template |

## Step 3: Configure Custom Metrics

In GA4 Admin > Custom Definitions > Create Custom Metrics:

| Metric Name | Scope | Unit | Description | Event Parameter |
|---|---|---|---|---|
| LCP | Event | Milliseconds | Largest Contentful Paint | lcp |
| FID | Event | Milliseconds | First Input Delay | fid |
| CLS | Event | Standard | Cumulative Layout Shift | cls |
| Scroll Depth | Event | Percent | Max scroll depth | scroll_depth |
| Time to CTA | Event | Seconds | Time to first CTA click | time_to_cta |

## Step 4: Add Core Web Vitals Tracking

Add this script before the closing `</body>` tag:

```html
<script type="module">
  import {onCLS, onFID, onLCP} from 'https://unpkg.com/web-vitals@3?module';

  function sendToGA(metric) {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta
    });
  }

  onCLS(sendToGA);
  onFID(sendToGA);
  onLCP(sendToGA);
</script>
```

## Step 5: Track A/B Test Events

The A/B test deployment already includes tracking. Verify these events are firing:

### Page View with Variant
```javascript
gtag('event', 'page_view', {
  'ab_test': 'personalization-urgency-combo',
  'variant': 'variantB'
});
```

### CTA Click
```javascript
gtag('event', 'cta_click', {
  'ab_test': 'personalization-urgency-combo',
  'variant': 'variantB',
  'cta_type': 'primary'
});
```

### Conversion (Try Gemini)
```javascript
gtag('event', 'conversion', {
  'ab_test': 'personalization-urgency-combo',
  'variant': 'variantB',
  'value': 1
});
```

## Step 6: Create GA4 Explorations

### A/B Test Performance Report

1. Go to **Explore** > **Create New Exploration**
2. Select **Free Form** template
3. Configure:
   - **Dimensions**: Add "AB Test Name", "AB Test Variant"
   - **Metrics**: Add "Conversions", "Engagement Rate", "Average Engagement Time"
   - **Rows**: AB Test Variant
   - **Values**: Conversions, Engagement Rate
   - **Filters**: AB Test Name = "personalization-urgency-combo"

### Core Web Vitals Report

1. Go to **Explore** > **Create New Exploration**
2. Select **Free Form** template
3. Configure:
   - **Dimensions**: "Page Path", "Device Category"
   - **Metrics**: "LCP", "FID", "CLS" (custom metrics)
   - **Rows**: Page Path
   - **Values**: Average LCP, Average FID, Average CLS
   - **Filters**: Add thresholds for "good" ranges

### Conversion Funnel by Variant

1. Go to **Explore** > **Create New Exploration**
2. Select **Funnel Exploration** template
3. Configure steps:
   - Step 1: Page View
   - Step 2: Scroll > 50%
   - Step 3: CTA Click
   - Step 4: Conversion
4. Add "AB Test Variant" as breakdown dimension

## Step 7: Set Up Real-Time Alerts

### Conversion Rate Alert

1. Go to **Admin** > **Custom Alerts**
2. Create alert:
   - **Name**: Low Conversion Rate
   - **Condition**: Conversions per user < 0.05 (5%)
   - **Period**: Last 1 hour
   - **Notification**: Email

### Performance Alert

1. Create alert:
   - **Name**: Poor LCP Performance
   - **Condition**: Average LCP > 2500ms
   - **Period**: Last 1 hour
   - **Notification**: Email

## Step 8: Dashboard Setup

### Create Custom Dashboard

1. Go to **Reports** > **Library**
2. Click **Create Custom Report**
3. Add cards:
   - **Summary Card**: Total Conversions, Engagement Rate
   - **Line Chart**: Conversions over time by variant
   - **Bar Chart**: Conversion rate by page
   - **Gauge**: Core Web Vitals scores

### Share Dashboard

1. Click **Share** button
2. Set permissions (view/edit)
3. Generate shareable link

## Step 9: Export Data for Analysis

### BigQuery Export (Enterprise)

1. Go to **Admin** > **BigQuery Linking**
2. Link GA4 property to BigQuery
3. Enable daily export
4. Query data:

```sql
SELECT
  event_date,
  user_pseudo_id,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant') as variant,
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'value') as conversion_value
FROM
  `project.analytics_XXXXXXXXX.events_*`
WHERE
  event_name IN ('page_view', 'conversion', 'cta_click')
  AND _TABLE_SUFFIX BETWEEN '20260201' AND '20260215'
ORDER BY
  event_timestamp DESC
```

### Data API (Standard)

Use GA4 Data API to fetch data programmatically:

```javascript
// Example: Fetch A/B test results
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

const analyticsDataClient = new BetaAnalyticsDataClient();

async function getABTestResults() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/XXXXXXXXX`,
    dateRanges: [{
      startDate: '14daysAgo',
      endDate: 'today',
    }],
    dimensions: [{name: 'customEvent:variant'}],
    metrics: [
      {name: 'conversions'},
      {name: 'engagementRate'}
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'customEvent:ab_test',
        stringFilter: {
          value: 'personalization-urgency-combo'
        }
      }
    }
  });

  return response.rows.map(row => ({
    variant: row.dimensionValues[0].value,
    conversions: row.metricValues[0].value,
    engagementRate: row.metricValues[1].value
  }));
}
```

## Step 10: Validate Setup

### Use GA4 DebugView

1. Install **Google Analytics Debugger** Chrome extension
2. Enable debug mode
3. Visit test pages
4. Open GA4 > **Admin** > **DebugView**
5. Verify events are firing correctly

### Test Checklist

- [ ] GA4 script loads on all pages
- [ ] Page views tracked with variant parameter
- [ ] Core Web Vitals events firing
- [ ] CTA clicks tracked
- [ ] Conversions tracked
- [ ] Custom dimensions populated
- [ ] Custom metrics recorded
- [ ] A/B test router assigns variants correctly
- [ ] Variant assignment persists across sessions

## Troubleshooting

### Events Not Showing Up

- Check that Measurement ID is correct
- Verify script is in `<head>` section
- Check browser console for errors
- Use DebugView to see real-time events
- Wait 24-48 hours for data to appear in standard reports

### Custom Dimensions Not Working

- Ensure event parameters match custom dimension names exactly
- Custom dimensions can take 24-48 hours to populate
- Check data in Realtime reports first

### Core Web Vitals Not Tracking

- Verify web-vitals library is loaded
- Check browser supports performance APIs
- Test in production environment (localhost may not track)

## Best Practices

1. **Always use consistent naming** for events and parameters
2. **Test in DebugView** before deploying to production
3. **Document all custom dimensions/metrics** in a shared spreadsheet
4. **Set up alerts** for critical metrics
5. **Export to BigQuery** for advanced analysis
6. **Review data quality** weekly to catch tracking issues
7. **Archive completed tests** to keep reports clean

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267744)

## Support

For questions or issues:
1. Check GA4 Help Center
2. Review troubleshooting section above
3. Test in DebugView
4. Contact analytics team
