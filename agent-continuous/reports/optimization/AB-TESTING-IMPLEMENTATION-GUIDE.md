# A/B Testing Implementation Guide

## Quick Start: Deploy Your First A/B Test in 5 Minutes

### Step 1: Create Test Configuration

```javascript
const ABTestingInfrastructure = require('./scripts/ab-testing-infrastructure');
const ab = new ABTestingInfrastructure();

const test = ab.createTest({
    testId: 'personalization_urgency_combo',
    name: 'Personalization + Urgency Combination',
    page: 'creators.html',
    variants: [
        {
            variantId: 'control',
            name: 'Control (Original)',
            description: 'Current page without modifications'
        },
        {
            variantId: 'personalization_urgency',
            name: 'Personalization + Urgency',
            description: 'Segment-specific content + countdown timer',
            implementation: {
                type: 'combined_pattern',
                code: `
                    // Apply personalization
                    const segment = new URLSearchParams(window.location.search).get('segment') || 'default';
                    applyPersonalization(segment);

                    // Apply urgency banner
                    showUrgencyBanner();
                `
            }
        }
    ],
    trafficSplit: {
        'control': 50,
        'personalization_urgency': 50
    },
    minSampleSize: 500,
    confidenceLevel: 0.95
});
```

### Step 2: Add Test Script to Page

```html
<!-- Insert before closing </body> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- A/B Test Script (auto-generated) -->
<script>
// Paste output from: ab.generateClientScript('personalization_urgency_combo')
</script>
```

### Step 3: Monitor Results

```javascript
// Check test status
const analysis = ab.analyzeTest('personalization_urgency_combo');
console.log('Winner:', analysis.winner);
console.log('Lift:', analysis.lift);
console.log('Confidence:', analysis.confidence);
console.log('Recommendation:', analysis.recommendation);

// Generate full report
const report = ab.generateReport('personalization_urgency_combo');
```

### Step 4: Scale Winner

When test reaches significance:
1. Check `analysis.readyToScale === true`
2. Implement winning variant on all traffic
3. Update pattern library
4. Create new test for next optimization

---

## Real User Monitoring Setup

### Step 1: Configure RUM

```javascript
const RealUserMonitoring = require('./scripts/real-user-monitoring');
const rum = new RealUserMonitoring();

// Configuration is auto-loaded from rum-config.json
// Customize if needed:
rum.config.gaTrackingId = 'G-YOUR-TRACKING-ID';
rum.config.alerts.thresholds.conversionRateDrop = 15; // Alert if >15% drop
rum.saveConfig();
```

### Step 2: Add RUM Script to Pages

```html
<!-- Insert in <head> section -->
<script>
// Paste output from: rum.generateGA4Script()
</script>
```

### Step 3: View Dashboard

```bash
# Generate dashboard
node scripts/real-user-monitoring.js

# Open dashboard
open reports/rum/dashboard.html
```

### Step 4: Monitor Alerts

```javascript
// Check for alerts
const alerts = rum.checkAlerts();
alerts.forEach(alert => {
    console.log(`[${alert.severity.toUpperCase()}] ${alert.message}`);
});
```

---

## Pattern Combination Testing

### Step 1: Ensure Pattern Library is Current

```json
// reports/iterations/pattern-library.json
{
  "patterns": [
    {
      "id": "pattern_personalization_v1",
      "name": "Segment-Specific Personalization",
      "status": "production",
      "performance": {
        "average_lift": 18.5
      }
    },
    {
      "id": "pattern_urgency_v1",
      "name": "Time-Limited Urgency Banner",
      "status": "production",
      "performance": {
        "average_lift": 18.7
      }
    }
  ]
}
```

### Step 2: Run Combination Tests

```javascript
const PatternCombinationTester = require('./scripts/test-pattern-combinations');
const tester = new PatternCombinationTester();

// Test all production patterns
const results = tester.testAllCombinations({
    maxCombinationSize: 3,
    minPerformanceThreshold: 5.0,
    onlyProduction: true
});

console.log(`Tested ${results.tested} combinations`);
console.log(`Found ${results.promising} promising combinations`);
```

### Step 3: Review Top Combinations

```javascript
// Generate comprehensive report
const report = tester.generateReport(results, 10);

console.log('Top Combination:', report.top_combinations[0].pattern_names.join(' + '));
console.log('Predicted Lift:', report.top_combinations[0].predicted_lift);
console.log('Priority:', report.top_combinations[0].priority);

// View full report
// open reports/pattern-combinations/COMBINATION_ANALYSIS.md
```

### Step 4: Implement Top Combination

Use findings to create A/B test (see Step 1 above).

---

## Best Practices

### A/B Testing

**DO**:
- ✅ Run tests for at least 7 days to account for weekly patterns
- ✅ Ensure minimum 500 samples per variant before making decisions
- ✅ Test one major change at a time for clear attribution
- ✅ Use 95% confidence level (or higher) for important decisions
- ✅ Consider secondary metrics (time on page, engagement)

**DON'T**:
- ❌ Stop tests early when you "see a winner"
- ❌ Change test configuration mid-test
- ❌ Run too many tests simultaneously (traffic dilution)
- ❌ Ignore statistical significance
- ❌ Test trivial changes (< 5% expected lift)

### Real User Monitoring

**DO**:
- ✅ Monitor Core Web Vitals daily
- ✅ Set up alerts for critical metrics
- ✅ Track segment-specific performance
- ✅ Use custom events for key user actions
- ✅ Review dashboard weekly for trends

**DON'T**:
- ❌ Track excessive data (privacy concerns)
- ❌ Ignore error tracking
- ❌ Sample at <100% for low-traffic sites
- ❌ Skip mobile device testing
- ❌ Forget to anonymize user data

### Pattern Combinations

**DO**:
- ✅ Test combinations with known synergies first
- ✅ Resolve high-severity conflicts before deployment
- ✅ Start with 2-pattern combinations
- ✅ Update pattern library with real performance data
- ✅ Consider implementation complexity vs impact

**DON'T**:
- ❌ Combine patterns that target same DOM elements
- ❌ Mix contradictory messaging (e.g., urgent + patient)
- ❌ Deploy combinations with predicted negative lift
- ❌ Ignore conflict warnings
- ❌ Test complex 4+ pattern combinations without data

---

## Troubleshooting

### A/B Test Not Assigning Variants

**Symptoms**: All users see control variant

**Solutions**:
1. Check localStorage is enabled in browser
2. Verify traffic split sums to 100%
3. Ensure test status is 'active'
4. Clear localStorage and retry: `localStorage.clear()`

### RUM Dashboard Shows No Data

**Symptoms**: Dashboard displays "No metrics data available"

**Solutions**:
1. Run data processing: `rum.processGA4Data(startDate, endDate)`
2. Check GA4 tracking ID is correct
3. Verify GA4 property is receiving data
4. Wait 24-48 hours for GA4 data to populate

### Pattern Combinations Not Found

**Symptoms**: "Pattern library not found" error

**Solutions**:
1. Ensure pattern library exists: `reports/iterations/pattern-library.json`
2. Check file permissions
3. Run pattern scaling script first (Feature #72)
4. Verify JSON is valid

### Statistical Significance Not Reached

**Symptoms**: Test runs for weeks without winner

**Solutions**:
1. Increase traffic allocation (more than 50/50 if low traffic)
2. Reduce confidence level requirement (90% vs 95%)
3. Reduce minimum sample size (if appropriate)
4. Test larger impact changes (current change may be too subtle)
5. Ensure conversion events are tracking correctly

---

## Advanced Usage

### Multi-Armed Bandit Optimization

For advanced users, implement dynamic traffic allocation:

```javascript
// Gradually shift traffic to better-performing variants
function adjustTrafficSplit(testId) {
    const analysis = ab.analyzeTest(testId);
    const variants = analysis.variants.sort((a, b) =>
        b.conversionRate - a.conversionRate
    );

    // Allocate traffic proportionally to performance
    const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);
    const newSplit = {};

    variants.forEach(v => {
        newSplit[v.variantId] = Math.max(
            10, // Min 10% for exploration
            (v.conversions / totalConversions) * 100
        );
    });

    // Update test configuration
    // (Requires extending ABTestingInfrastructure class)
}
```

### Sequential Testing

For faster decision-making with lower samples:

```javascript
// Check for early stopping conditions
function checkEarlyStopping(testId, alpha = 0.05) {
    const analysis = ab.analyzeTest(testId);

    // Stop if treatment is significantly worse
    if (analysis.pValue < alpha && analysis.lift < -10) {
        ab.stopTest(testId, 'Treatment significantly worse');
        return true;
    }

    // Stop if treatment is overwhelmingly better
    if (analysis.pValue < 0.001 && analysis.lift > 30) {
        ab.stopTest(testId, 'Treatment overwhelmingly better');
        return true;
    }

    return false;
}
```

### Custom Metrics

Track additional metrics beyond conversion rate:

```javascript
// Track revenue per user
ab.recordConversion('test_id', 'variant_id', {
    converted: true,
    revenue: 99.99,
    customMetric: 42
});

// Calculate revenue lift
function calculateRevenueLift(testId) {
    const results = ab.loadTestResults()[testId];
    const control = results.variants.control;
    const treatment = results.variants.treatment;

    const controlRevenue = control.totalRevenue / control.impressions;
    const treatmentRevenue = treatment.totalRevenue / treatment.impressions;

    return ((treatmentRevenue - controlRevenue) / controlRevenue) * 100;
}
```

---

## Integration with Existing Tools

### Google Optimize Integration

If migrating from Google Optimize:

```javascript
// Export test configuration to Google Optimize format
function exportToGoogleOptimize(testId) {
    const test = ab.loadActiveTests()[testId];

    return {
        name: test.name,
        objectives: [{
            type: 'INCREASE_CONVERSIONS',
            metric: test.primaryMetric
        }],
        variations: test.variants.map(v => ({
            name: v.name,
            weight: v.trafficPercent / 100
        }))
    };
}
```

### Mixpanel Integration

Track events to Mixpanel:

```javascript
// In client script
function trackToMixpanel(variantId) {
    if (typeof mixpanel !== 'undefined') {
        mixpanel.track('AB Test Impression', {
            'Test ID': testId,
            'Variant': variantId,
            'Variant Name': assignedVariant.name
        });
    }
}
```

---

## FAQ

**Q: How long should I run an A/B test?**
A: Minimum 7 days to account for weekly patterns. Continue until you reach minimum sample size (500+) and statistical significance (95%+).

**Q: What conversion rate lift is worth testing?**
A: Test changes expected to have >5% lift. Smaller lifts require very large samples to detect.

**Q: Can I run multiple A/B tests simultaneously?**
A: Yes, but ensure tests don't interact. Test different pages or orthogonal changes on the same page.

**Q: How do I handle mobile vs desktop traffic?**
A: Use custom dimensions to segment by device type, then analyze separately.

**Q: What if my test shows no significant difference?**
A: Either the change has no impact, or you need more samples. Extend test or try a bolder variation.

**Q: How accurate is the pattern combination lift prediction?**
A: Predictions are estimates based on individual lifts and known synergies. Always validate with real A/B tests.

**Q: Can I use this for B2B SaaS products?**
A: Yes! Adjust minSampleSize based on your traffic (lower for B2B, higher for B2C).

**Q: How do I track newsletter signups as conversions?**
A: Add `data-conversion="true"` attribute to signup button, or call `ab.recordConversion()` on form submit.

---

## Support

For questions or issues:
1. Check this guide first
2. Review test results and logs
3. Verify configuration files
4. Check browser console for errors
5. Review FEATURE-74-SUMMARY.md for technical details

**Pro Tip**: Start simple. Run one A/B test, monitor it daily, and scale from there. The infrastructure supports complex scenarios, but mastering the basics first ensures success.
