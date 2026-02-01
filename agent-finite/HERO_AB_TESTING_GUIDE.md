# Hero A/B Testing Guide

Complete guide to hero headline and subtitle A/B testing for optimizing conversion rates through data-driven headline selection.

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Quick Start](#quick-start)
4. [Headline Variants](#headline-variants)
5. [JavaScript API](#javascript-api)
6. [Analytics Integration](#analytics-integration)
7. [Best Practices](#best-practices)
8. [Testing](#testing)
9. [Maintenance](#maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Hero A/B Testing system enables data-driven optimization of landing page headlines and subtitles through automated variant rotation and performance tracking.

### Features

✅ **Multiple Variants**: 3-5 headline/subtitle options per page
✅ **Automatic Rotation**: Random variant selection with persistence
✅ **Performance Tracking**: Impressions, clicks, conversions
✅ **LocalStorage Persistence**: Consistent experience per user
✅ **Analytics Integration**: Google Analytics event tracking
✅ **Easy Implementation**: Simple data attributes
✅ **No Dependencies**: Pure JavaScript, works everywhere
✅ **Developer-Friendly**: Console API for testing

### Why A/B Test Headlines?

- **Headlines drive conversions**: 5-word change can increase CTR by 50%+
- **Audience preferences vary**: What works for one segment may not work for another
- **Data beats opinions**: Let users tell you which headlines work best
- **Continuous improvement**: Optimize based on real performance metrics

---

## How It Works

### 1. Variant Definition

Headlines and subtitles are defined with `data-hero-variants` and `data-subtitle-variants` attributes:

```html
<h1 id="hero-title" data-hero-variants='[
  {"text": "AI that thinks with you.", "weight": 1},
  {"text": "Intelligence amplified.", "weight": 1},
  {"text": "Think bigger. Work smarter.", "weight": 1}
]'>
  AI that thinks with you.
</h1>

<p id="hero-subtitle" data-subtitle-variants='[
  {"text": "Effortlessly brilliant. Remarkably simple.", "weight": 1},
  {"text": "Your thoughts, supercharged.", "weight": 1}
]'>
  Effortlessly brilliant. Remarkably simple.
</p>
```

### 2. Variant Selection

On page load, the library:
1. Checks localStorage for previously shown variant
2. If found and still valid (< 7 days), uses that variant
3. Otherwise, randomly selects a new variant
4. Stores selection for consistency across sessions

### 3. Performance Tracking

Automatically tracks:
- **Impressions**: Variant shown to user
- **Clicks**: User clicks CTA button near hero
- **Conversions**: Custom conversion events

### 4. Data Analysis

Access performance data via console API:

```javascript
// View all tracking data
heroABTesting.getReport()

// Get performance metrics
heroABTesting.getPerformanceMetrics()

// Export data
heroABTesting.exportData()
```

---

## Quick Start

### Step 1: Add Script to Page

```html
<body>
  <!-- Your page content -->

  <!-- Add before closing body tag -->
  <script src="../assets/js/hero-ab-testing.js" defer></script>
</body>
```

### Step 2: Add Variants to Hero

```html
<h1 id="hero-title" data-hero-variants='[
  {"text": "First Headline Variant", "weight": 1},
  {"text": "Second Headline Variant", "weight": 1},
  {"text": "Third Headline Variant", "weight": 1}
]'>
  First Headline Variant
</h1>
```

### Step 3: Test in Browser

Open page in browser, then in console:

```javascript
// View current variant
document.querySelector('h1').getAttribute('data-current-variant')

// Get tracking data
heroABTesting.getReport()

// Try another variant
heroABTesting.refreshVariant('hero-title')

// Clear data to start fresh
heroABTesting.clearData()
```

---

## Headline Variants

### Current Page Variants

All landing pages have 5 carefully crafted headline variants optimized for different user motivations:

#### Apple-Inspired Page
1. "AI that thinks with you." - Partnership focus
2. "Intelligence amplified." - Enhancement focus
3. "Think bigger. Work smarter." - Productivity focus
4. "Beyond AI. Pure genius." - Aspirational positioning
5. "Your mind, enhanced." - Personal connection

#### Trust & Citations Page
1. "Trust Every Answer" - Direct trust message
2. "Truth You Can Verify" - Verification capability
3. "Never Wonder If It's True" - Pain point solution
4. "The AI That Proves Itself" - Confidence building
5. "Facts, Not Fiction" - Strong differentiator

#### Workspace Integration Page
1. "Your Workspace, Supercharged" - Enhancement focus
2. "AI Built for Google Workspace" - Platform positioning
3. "Work Smarter in Gmail, Docs & More" - Specific apps
4. "Your Tools. Amplified." - Simple, direct
5. "Stop Switching Apps" - Pain point solution

[See `headline-variants.json` for complete list of all page variants]

### Variant Design Principles

When creating new variants:

1. **Test Different Angles**
   - Pain point vs. benefit
   - Feature vs. outcome
   - Rational vs. emotional

2. **Vary Length**
   - Short (2-3 words)
   - Medium (4-6 words)
   - Longer (7-10 words)

3. **Different Tones**
   - Professional
   - Casual
   - Bold/Confident
   - Friendly

4. **Clarity Over Cleverness**
   - Clear beats clever
   - Benefit beats feature
   - Specific beats vague

5. **A/B Test Assumptions**
   - Don't assume you know best
   - Let data decide
   - Be willing to be surprised

---

## JavaScript API

### Global Instance

```javascript
// Access global instance
window.heroABTesting

// Check if loaded
if (typeof heroABTesting !== 'undefined') {
  // Library is loaded
}
```

### Viewing Results

```javascript
// Get all tracking data
const report = heroABTesting.getReport();
console.log(report);

// Get data for specific page
const pageReport = heroABTesting.getReport('/pages/apple-inspired.html');

// Get performance metrics
const metrics = heroABTesting.getPerformanceMetrics();
console.log(metrics);

// Example output:
// {
//   "hero-title": {
//     "totalImpressions": 100,
//     "variants": {
//       "AI that thinks with you.": {
//         "impressions": 20,
//         "clicks": 8,
//         "conversions": 2,
//         "ctr": 40.00,
//         "conversionRate": 25.00
//       },
//       "Intelligence amplified.": {
//         "impressions": 18,
//         "clicks": 12,
//         "conversions": 4,
//         "ctr": 66.67,
//         "conversionRate": 33.33
//       }
//     }
//   }
// }
```

### Managing Variants

```javascript
// Refresh variant (pick new random variant)
heroABTesting.refreshVariant('hero-title');

// Clear all tracking data
heroABTesting.clearData();

// Export data as JSON
const json = heroABTesting.exportData();
console.log(json);

// Download data
const dataStr = heroABTesting.exportData();
const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
const link = document.createElement('a');
link.setAttribute('href', dataUri);
link.setAttribute('download', 'hero-ab-test-data.json');
link.click();
```

### Custom Configuration

```javascript
// Create custom instance
const customAB = new HeroABTesting({
  // How long to show same variant (days)
  testDuration: 14,

  // Enable/disable tracking
  enableTracking: true,

  // Debug mode
  debug: true,

  // Custom callback when variant shown
  onVariantShown: (data) => {
    console.log('Variant shown:', data);
    // Send to your analytics
  },

  // Custom callback for interactions
  onVariantInteraction: (data) => {
    console.log('Interaction:', data);
    // Send to your analytics
  }
});
```

### Tracking Custom Events

```javascript
// Track conversion manually
heroABTesting.trackVariantInteraction('hero-title', {text: 'Current Headline'}, 'conversion');

// Track custom interaction
heroABTesting.trackVariantInteraction('hero-title', {text: 'Current Headline'}, 'custom_event');
```

---

## Analytics Integration

### Google Analytics (GA4)

The library automatically sends events to Google Analytics if `gtag` is available:

```javascript
// Events sent automatically:
gtag('event', 'hero_variant_shown', {
  page_path: '/pages/apple-inspired.html',
  element_id: 'hero-title',
  variant: 'AI that thinks with you.'
});

gtag('event', 'hero_variant_click', {
  page_path: '/pages/apple-inspired.html',
  element_id: 'hero-title',
  variant: 'AI that thinks with you.'
});
```

### Add Google Analytics to Page

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Then add hero A/B testing -->
<script src="../assets/js/hero-ab-testing.js" defer></script>
```

### Custom Analytics

```javascript
const heroAB = new HeroABTesting({
  onVariantShown: (data) => {
    // Send to your analytics platform
    if (window.analytics) {
      analytics.track('Hero Variant Shown', {
        page: data.page,
        variant: data.variant,
        allVariants: data.allVariants
      });
    }
  },

  onVariantInteraction: (data) => {
    if (window.analytics) {
      analytics.track('Hero Variant Interaction', {
        page: data.page,
        variant: data.variant,
        type: data.interactionType
      });
    }
  }
});
```

### Viewing Analytics in GA4

1. Go to Google Analytics
2. Navigate to **Events** section
3. Look for custom events:
   - `hero_variant_shown`
   - `hero_variant_click`
4. Create custom reports filtering by:
   - `page_path` (which page)
   - `variant` (which headline)
   - `element_id` (which element)

---

## Best Practices

### 1. Headline Writing

**Clear and Specific**
```
❌ "Great AI"
✅ "AI that thinks with you."
```

**Benefit Over Feature**
```
❌ "Advanced language model"
✅ "Write with confidence"
```

**Action-Oriented**
```
❌ "Available productivity tools"
✅ "Work smarter. Think bigger."
```

**Emotional Connection**
```
❌ "Efficient task management"
✅ "Never miss a beat"
```

### 2. Test Design

**Vary One Thing at a Time**
- Test headline changes separately from subtitle
- Test tone separately from length
- Test one assumption per variant set

**Statistically Significant Sample Size**
- Minimum 100 impressions per variant
- Prefer 500+ for reliable data
- Account for weekend vs. weekday traffic

**Run Tests Long Enough**
- Minimum 1 week per test
- Prefer 2-4 weeks for seasonal effects
- Consider user cohorts and traffic sources

### 3. Data Interpretation

**Look at Multiple Metrics**
- Impressions: Reach
- CTR: Engagement
- Conversions: Business impact

**Consider Context**
- Time of day/week
- Traffic source
- User segment
- Device type

**Avoid Analysis Paralysis**
- Ship early, iterate often
- 20% improvement is significant
- Perfect is the enemy of good

### 4. Implementation

**Keep Variants Consistent**
- Same tone across variants
- Aligned with brand voice
- Match page content

**Don't Over-Test**
- 3-5 variants maximum
- More variants = longer test time
- Focus on meaningful differences

**Document Learnings**
- What worked and why
- Apply insights to other pages
- Build a headline playbook

---

## Testing

### Automated Tests

Run Playwright test suite:

```bash
# Run all hero A/B tests
npm run test:hero

# Run in headed mode
npm run test:hero:headed

# Run specific test category
npx playwright test hero-ab-testing.spec.js --grep "Variant attributes"
```

### Manual Testing

#### Test Variant Display

1. Open page in browser
2. Open console
3. Run:
   ```javascript
   document.querySelector('h1').getAttribute('data-current-variant')
   ```
4. Refresh page several times
5. Variant should persist

#### Test Variant Rotation

```javascript
// See current variant
console.log(document.querySelector('h1').textContent);

// Try new variant
heroABTesting.refreshVariant('hero-title');

// Check new variant
console.log(document.querySelector('h1').textContent);
```

#### Test Tracking

```javascript
// Check tracking data
console.log(heroABTesting.getReport());

// Click a CTA button
// Then check again
console.log(heroABTesting.getReport());
// Clicks should increment
```

### Test Checklist

- [ ] Variants load correctly
- [ ] Correct number of variants per page (3-5)
- [ ] Each variant has meaningful text
- [ ] Variants persist across page reloads
- [ ] Tracking increments on page view
- [ ] Tracking increments on CTA click
- [ ] Console API works
- [ ] Analytics events fire (if configured)
- [ ] Export data works
- [ ] Clear data works

---

## Maintenance

### Adding New Pages

1. **Add variants to `headline-variants.json`**:
   ```json
   {
     "headline_variants": {
       "new-page.html": {
         "page_name": "New Page",
         "current_headline": "Original Headline",
         "current_subtitle": "Original Subtitle",
         "variants": [
           {
             "headline": "Variant 1 Headline",
             "subtitle": "Variant 1 Subtitle",
             "rationale": "Why this variant"
           }
         ]
       }
     }
   }
   ```

2. **Run update script**:
   ```bash
   node scripts/add-hero-variants.js
   ```

3. **Test the page**:
   ```bash
   npx playwright test hero-ab-testing.spec.js --grep "new-page.html"
   ```

### Updating Existing Variants

1. Edit `headline-variants.json`
2. Re-run update script
3. Clear localStorage in browser to see new variants
4. Test thoroughly

### Removing Low-Performing Variants

1. Get performance metrics:
   ```javascript
   heroABTesting.getPerformanceMetrics()
   ```

2. Identify low CTR variants

3. Remove from `headline-variants.json`

4. Re-run update script

### Analyzing Results

```javascript
// Get full report
const report = heroABTesting.getReport();

// For each page
Object.entries(report).forEach(([page, pageData]) => {
  console.log(`\n📄 ${page}`);

  // For each element
  Object.entries(pageData).forEach(([elementId, elementData]) => {
    console.log(`\n  🎯 ${elementId}`);
    console.log(`  Total impressions: ${elementData.totalImpressions}`);

    // For each variant
    Object.entries(elementData.variants).forEach(([variant, variantData]) => {
      const ctr = (variantData.clicks / variantData.impressions * 100).toFixed(2);
      console.log(`\n    📊 "${variant}"`);
      console.log(`       Impressions: ${variantData.impressions}`);
      console.log(`       Clicks: ${variantData.clicks}`);
      console.log(`       CTR: ${ctr}%`);
    });
  });
});
```

---

## Troubleshooting

### Variants Not Showing

**Issue**: Headline doesn't change

**Solutions**:
1. Check `data-hero-variants` attribute exists:
   ```javascript
   document.querySelector('h1').getAttribute('data-hero-variants')
   ```

2. Verify script loaded:
   ```javascript
   typeof heroABTesting !== 'undefined'
   ```

3. Check console for errors

4. Clear localStorage and refresh

### Variant Persists Too Long

**Issue**: Want to see different variant

**Solution**:
```javascript
// Clear stored variant
heroABTesting.clearData();

// Or just refresh specific variant
heroABTesting.refreshVariant('hero-title');
```

### Tracking Not Working

**Issue**: Impressions/clicks not incrementing

**Solutions**:
1. Check localStorage enabled in browser
2. Verify page path is correct
3. Check CTA buttons have correct class/selector
4. Open console and look for errors

### Script Not Loading

**Issue**: `heroABTesting` is undefined

**Solutions**:
1. Check script path is correct
2. Verify `defer` attribute present
3. Check browser console for 404 errors
4. Ensure script is before closing `</body>` tag

### Data Export Issues

**Issue**: Can't export data

**Solution**:
```javascript
// Manual export
const data = heroABTesting.exportData();
console.log(data);

// Copy from console or download
const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);
const link = document.createElement('a');
link.setAttribute('href', dataUri);
link.setAttribute('download', 'test-data.json');
link.click();
```

---

## Advanced Usage

### Weighted Variants

Give more weight to promising variants:

```html
<h1 data-hero-variants='[
  {"text": "Original (baseline)", "weight": 1},
  {"text": "High performer", "weight": 3},
  {"text": "New test variant", "weight": 1}
]'>
```

With these weights, "High performer" will show 3x more often than others.

### Cohort Testing

Test different variants for different user segments:

```javascript
// Determine user cohort
const userCohort = getUserCohort(); // your function

// Select variants based on cohort
const cohortVariants = {
  'writers': [
    {"text": "Write with confidence", "weight": 1},
    {"text": "Your writing partner", "weight": 1}
  ],
  'developers': [
    {"text": "Code faster. Debug smarter.", "weight": 1},
    {"text": "Your AI pair programmer", "weight": 1}
  ]
};

// Apply cohort-specific variants
document.querySelector('h1').setAttribute(
  'data-hero-variants',
  JSON.stringify(cohortVariants[userCohort])
);

// Re-initialize
heroABTesting.setupVariants();
```

### Multi-Element Testing

Test multiple elements together:

```javascript
// Track which combination performs best
const comboTracking = {
  'headline_A + subtitle_A': { impressions: 0, clicks: 0 },
  'headline_A + subtitle_B': { impressions: 0, clicks: 0 },
  'headline_B + subtitle_A': { impressions: 0, clicks: 0 },
  'headline_B + subtitle_B': { impressions: 0, clicks: 0 }
};

// Track current combination
const headline = document.querySelector('h1').textContent;
const subtitle = document.querySelector('.hero-subtitle').textContent;
const combo = `${headline} + ${subtitle}`;

// Increment on page load
comboTracking[combo].impressions++;

// Increment on click
document.querySelector('.btn').addEventListener('click', () => {
  comboTracking[combo].clicks++;
});
```

---

## Resources

### Documentation
- [CTA Optimization Guide](CTA_OPTIMIZATION_GUIDE.md)
- [Micro-Interactions Guide](MICRO_INTERACTIONS_GUIDE.md)
- [Performance Optimization](PERFORMANCE_OPTIMIZATION.md)

### External Resources
- [Copywriting Best Practices](https://copyblogger.com/headline-formulas/)
- [A/B Testing Guide](https://www.optimizely.com/optimization-glossary/ab-testing/)
- [Conversion Rate Optimization](https://cxl.com/conversion-rate-optimization/)
- [Statistical Significance Calculator](https://abtestguide.com/calc/)

### Tools
- [Headline Analyzer](https://coschedule.com/headline-analyzer)
- [Emotional Marketing Value Analyzer](https://www.aminstitute.com/headline/)
- [Google Analytics](https://analytics.google.com/)

---

## Support

### Getting Help

1. **Check Console**: Open browser console for error messages
2. **Review This Guide**: Most issues covered in Troubleshooting section
3. **Check Examples**: See working examples in test pages
4. **Test Scripts**: Run automated tests to verify functionality

### Common Questions

**Q: How long should I run a test?**
A: Minimum 1 week, prefer 2-4 weeks for 500+ impressions per variant.

**Q: How many variants should I test?**
A: 3-5 variants maximum. More variants = longer test time.

**Q: What if all variants perform similarly?**
A: Pick the clearest/simplest one. Small differences aren't worth optimizing.

**Q: Can I change variants mid-test?**
A: Avoid it. Invalidates data. Finish test, then iterate.

**Q: Should I test headlines or subtitles first?**
A: Headlines. Bigger impact on conversion. Then test subtitles.

---

## Changelog

### Version 1.0.0 (2026-02-01)

Initial release:
- ✅ Multi-variant headline/subtitle testing
- ✅ LocalStorage persistence
- ✅ Performance tracking (impressions, clicks, conversions)
- ✅ Google Analytics integration
- ✅ Console API for data access
- ✅ 15 pages with 5 variants each (75 total headlines)
- ✅ Comprehensive test suite
- ✅ Complete documentation

---

**Built with ❤️ for the Gemini Ads project**
*Data-driven optimization for maximum conversion impact*
