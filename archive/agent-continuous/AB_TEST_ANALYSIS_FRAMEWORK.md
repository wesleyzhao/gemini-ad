# A/B Test Analysis Framework
**Gemini Landing Pages - Data-Driven Optimization**

Last Updated: 2026-02-01
Status: 🟡 Awaiting Data (4-6 weeks collection period)

---

## Executive Summary

This document provides the complete framework for analyzing A/B test results from our 6 active landing page tests. Use this guide when we reach statistical significance (2,400+ visitors per variant at 95% confidence).

**Current Status:**
- ✅ 6 tests active and collecting data
- ⏳ Target: 2,400 visitors per variant
- ⏳ Timeline: 4-6 weeks at 100 visitors/day
- 📊 Expected completion: March 7-21, 2026

---

## Table of Contents

1. [Active Tests Overview](#active-tests-overview)
2. [Data Collection Setup](#data-collection-setup)
3. [Statistical Analysis Method](#statistical-analysis-method)
4. [Analysis Checklist](#analysis-checklist)
5. [Winning Variation Implementation](#winning-variation-implementation)
6. [Reporting Template](#reporting-template)

---

## Active Tests Overview

### Test 1: Apple Style - Content Density
**Control:** `pages/apple-style.html`
**Variation B:** `pages/apple-style-variation-b.html`

**Hypothesis:** Rich content showcase > Ultra-minimal design
**Expected Lift:** +8-12%
**Decision Criteria:** 95% confidence, min 200 conversions per variant

**Key Metrics:**
- Primary: CTA click rate
- Secondary: Time on page, scroll depth
- Guardrails: Bounce rate <70%

---

### Test 2: Productivity - Messaging Strategy
**Control:** `pages/productivity.html`
**Variation B:** `pages/productivity-variation-b.html`

**Hypothesis:** Work-life balance messaging > ROI metrics
**Expected Lift:** +12-18%
**Decision Criteria:** 95% confidence, min 200 conversions per variant

**Key Metrics:**
- Primary: CTA click rate
- Secondary: Engagement with "Your Time Unlocked" section
- Guardrails: Bounce rate <65%

---

### Test 3: Trust - Competitive Positioning
**Control:** `pages/trust.html`
**Variation B:** `pages/trust-variation-b.html`

**Hypothesis:** Competitor comparison > Abstract citations focus
**Expected Lift:** +15-20%
**Decision Criteria:** 95% confidence, min 200 conversions per variant

**Key Metrics:**
- Primary: CTA click rate
- Secondary: Engagement with comparison table
- Guardrails: Bounce rate <60%

---

### Test 4: Writers - Outcome Focus
**Control:** `pages/writers.html`
**Variation B:** `pages/writers-variation-b.html`

**Hypothesis:** Finished work examples > Tool features
**Expected Lift:** +18-25%
**Decision Criteria:** 95% confidence, min 200 conversions per variant

**Key Metrics:**
- Primary: CTA click rate
- Secondary: Engagement with portfolio showcase
- Guardrails: Bounce rate <55%

---

### Test 5: Creators - Design Minimalism
**Control:** `pages/creators.html`
**Variation B:** `pages/creators-variation-b.html`

**Hypothesis:** Ultra-minimal Apple style > Rich visuals
**Expected Lift:** +10-15%
**Decision Criteria:** 95% confidence, min 200 conversions per variant

**Key Metrics:**
- Primary: CTA click rate
- Secondary: Scroll depth, time on page
- Guardrails: Bounce rate <65%

---

### Test 6: Operators - Time Savings ROI
**Control:** `pages/operators.html`
**Variation B:** `pages/operators-variation-b.html`

**Hypothesis:** Specific ROI ($46K/year) > Vague "efficiency"
**Expected Lift:** +20-30% (HIGHEST confidence)
**Decision Criteria:** 95% confidence, min 200 conversions per variant

**Key Metrics:**
- Primary: CTA click rate
- Secondary: ROI calculator interaction, time breakdown engagement
- Guardrails: Bounce rate <60%

---

## Data Collection Setup

### Required Google Analytics 4 Custom Dimensions

```javascript
// Custom dimensions to set up in GA4
{
  test_id: string,        // e.g., "apple-style", "productivity"
  variant: string,        // "A" or "B"
  test_name: string,      // Human-readable test name
  page_segment: string    // "writers", "creators", "operators", etc.
}
```

### Event Tracking Requirements

**1. Page View Events**
```javascript
gtag('event', 'page_view', {
  test_id: 'apple-style',
  variant: 'B',
  test_name: 'Apple Style - Content Density',
  page_segment: 'apple-style'
});
```

**2. CTA Click Events** (PRIMARY CONVERSION)
```javascript
gtag('event', 'cta_click', {
  test_id: 'apple-style',
  variant: 'B',
  cta_location: 'hero', // or 'footer', 'inline'
  cta_text: 'Try Gemini'
});
```

**3. Engagement Events**
```javascript
// Scroll depth
gtag('event', 'scroll', {
  test_id: 'apple-style',
  variant: 'B',
  scroll_depth: 75 // percentage
});

// Time on page milestones
gtag('event', 'time_on_page', {
  test_id: 'apple-style',
  variant: 'B',
  duration_seconds: 30
});

// Interactive element clicks
gtag('event', 'element_interaction', {
  test_id: 'operators',
  variant: 'B',
  element_type: 'roi_calculator',
  element_action: 'input_change'
});
```

### Data Export Query (BigQuery)

```sql
-- Query to export A/B test results
SELECT
  event_date,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'test_id') as test_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant') as variant,
  event_name,
  COUNT(*) as event_count,
  COUNTIF(event_name = 'cta_click') as conversions
FROM
  `project.dataset.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'test_id') IS NOT NULL
GROUP BY
  1, 2, 3, 4, 5
ORDER BY
  event_date DESC;
```

---

## Statistical Analysis Method

### Formula: Two-Proportion Z-Test

Use this for primary metric (CTA click rate):

```
z = (p₁ - p₂) / sqrt(p * (1 - p) * (1/n₁ + 1/n₂))

Where:
p₁ = conversion rate variant A
p₂ = conversion rate variant B
p = pooled conversion rate = (conversions_A + conversions_B) / (visitors_A + visitors_B)
n₁ = visitors variant A
n₂ = visitors variant B
```

**Significance Threshold:** 95% confidence (z > 1.96 or z < -1.96)

### Sample Size Requirements

**Minimum detectable effect:** 10% relative improvement
**Statistical power:** 80%
**Alpha:** 0.05 (5% false positive rate)
**Required sample:** ~2,400 visitors per variant

### Online Calculator Recommendations

1. **Evan Miller's A/B Test Calculator**
   https://www.evanmiller.org/ab-testing/chi-squared.html
   - Upload conversion data
   - Get instant significance results

2. **Optimizely Stats Engine**
   https://www.optimizely.com/sample-size-calculator/
   - Check if we've reached significance

3. **Google Sheets Template**
   Make a copy of: [Link to be created with formulas]

---

## Analysis Checklist

### Week 1-2: Setup Validation ✅

- [ ] Verify GA4 custom dimensions are firing
- [ ] Confirm all 6 tests are receiving traffic
- [ ] Check A/B test router is working (50/50 split)
- [ ] Validate conversion events are tracking
- [ ] Spot-check 100 visitors across all tests

**Debug Commands:**
```javascript
// Run in browser console on any test page
ABTest.getVariantInfo()      // Check assignment
ABTest.getActiveTests()      // List active tests
```

### Week 3-4: Early Monitoring ⏳

- [ ] Check for technical issues (broken pages, JS errors)
- [ ] Monitor bounce rates for anomalies
- [ ] Verify traffic distribution (should be ~50/50)
- [ ] Review scroll depth and engagement metrics
- [ ] Flag any tests with concerning bounce rates (>75%)

**Warning Signs:**
- Bounce rate >75% on either variant
- Conversion rate <0.5% (possible tracking issue)
- Traffic split not 45-55% range
- Page load errors in GA4

### Week 5-6: Statistical Analysis 📊

For each test:

1. **Export Data**
   - Run BigQuery export query
   - Download to CSV
   - Import to Google Sheets

2. **Calculate Results**
   ```
   Test: [Test Name]

   Variant A (Control):
   - Visitors: [n_A]
   - Conversions: [c_A]
   - Conversion Rate: [c_A / n_A]

   Variant B:
   - Visitors: [n_B]
   - Conversions: [c_B]
   - Conversion Rate: [c_B / n_B]

   Relative Lift: [(CR_B - CR_A) / CR_A * 100]%
   Absolute Lift: [CR_B - CR_A]%
   Z-Score: [calculated]
   P-Value: [calculated]
   Confidence: [1 - p_value]%

   Decision: [WINNER / NO WINNER / KEEP RUNNING]
   ```

3. **Decision Criteria**

   **Declare Winner if:**
   - Z-score > 1.96 (95% confidence)
   - Min 2,400 visitors per variant
   - Min 200 conversions per variant
   - Guardrail metrics acceptable

   **Keep Running if:**
   - Not yet significant (z < 1.96)
   - < 2,400 visitors per variant
   - Directionally promising trend

   **Declare No Winner if:**
   - After 6 weeks, still not significant
   - Both variants perform equally
   - Implement control (safer choice)

4. **Secondary Metrics Analysis**

   For winning variant, also check:
   - Time on page (higher is better)
   - Scroll depth (deeper is better)
   - Bounce rate (lower is better)
   - Engagement with key sections

   **Red Flags:**
   - Variant wins on conversion but loses on engagement
   - Variant has much higher bounce rate
   - Secondary metrics contradict primary win

---

## Winning Variation Implementation

### Step 1: Declare Winner (Per Test)

Create file: `analysis/[test-name]-results.md`

```markdown
# [Test Name] - Results

**Test Period:** Feb 1 - Mar 7, 2026 (35 days)
**Status:** ✅ COMPLETE - WINNER DECLARED

## Results Summary

**WINNER: Variant [A/B]** (95% confidence)

| Metric | Variant A | Variant B | Lift | Confidence |
|--------|-----------|-----------|------|------------|
| Visitors | X,XXX | X,XXX | - | - |
| Conversions | XXX | XXX | - | - |
| Conversion Rate | X.X% | X.X% | +X.X% | 95.X% |
| Bounce Rate | XX% | XX% | -X% | - |
| Avg. Time on Page | XXs | XXs | +Xs | - |

## Decision

✅ Implement Variant [A/B] as new control
❌ Retire losing variant

## Next Steps

1. Replace control page with winning variant
2. Update all links and references
3. Archive losing variant for future reference
4. Document learnings in design system
```

### Step 2: Implement Winning Variations

For each winning test:

1. **Backup Current Control**
   ```bash
   cp pages/[page].html pages/[page]-original-control.html.backup
   ```

2. **Replace with Winner**
   ```bash
   # If Variant B wins:
   cp pages/[page]-variation-b.html pages/[page].html

   # If Variant A wins (control):
   # Keep as-is, just document
   ```

3. **Remove A/B Test Router**
   - Edit `pages/[page].html`
   - Remove `<script src="../assets/js/ab-test-router.js"></script>`
   - Remove router initialization code

4. **Update ab-test-router.js**
   - Set test to `active: false`
   - Add `winner: 'A'` or `winner: 'B'`
   - Add `implemented: '2026-03-15'`

5. **Update Documentation**
   - Update `reflections-and-best.md` with learnings
   - Update `CONTEXT.md` with winning patterns
   - Document in `PROJECT_SUMMARY.md`

### Step 3: Extract Design Patterns

For each winning variation, document patterns to replicate:

```markdown
## Winning Patterns from [Test Name]

**What Worked:**
- [Specific design element, e.g., "Competitor comparison table"]
- [Messaging approach, e.g., "Concrete ROI numbers vs vague claims"]
- [Layout choice, e.g., "Above-the-fold calculator"]

**Apply to Other Pages:**
- [ ] [Page 1]: Add [pattern]
- [ ] [Page 2]: Replace [element] with [pattern]
- [ ] [Page 3]: Test [pattern] in next iteration

**Design System Updates:**
- Add component: `components/[new-component].css`
- Update guideline: `docs/design-system.md`
```

### Step 4: Commit and Deploy

```bash
# Commit winning variations
git add pages/*.html
git add assets/js/ab-test-router.js
git add analysis/*.md
git add CONTEXT.md reflections-and-best.md

git commit -m "$(cat <<'EOF'
feat: Implement winning A/B test variations

Results from 6-week A/B test program (Feb 1 - Mar 15, 2026):

WINNERS IMPLEMENTED:
- [Test 1]: Variant [A/B] (+X.X% conversion) - [one-line reason]
- [Test 2]: Variant [A/B] (+X.X% conversion) - [one-line reason]
- [Test 3]: Variant [A/B] (+X.X% conversion) - [one-line reason]
- [Test 4]: Variant [A/B] (+X.X% conversion) - [one-line reason]
- [Test 5]: Variant [A/B] (+X.X% conversion) - [one-line reason]
- [Test 6]: Variant [A/B] (+X.X% conversion) - [one-line reason]

Overall program lift: +XX% average conversion improvement
Estimated revenue impact: $XXXk ARR

Changes:
- Replaced controls with winning variants
- Removed A/B test routing (now permanent)
- Documented learnings in CONTEXT.md
- Updated design patterns in reflections-and-best.md

Statistical significance: 95% confidence on all tests
Sample size: 2,400+ visitors per variant

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

# Deploy
git push origin main
```

---

## Reporting Template

### Executive Summary (for Stakeholders)

```markdown
# A/B Test Program Results
**Testing Period:** February 1 - March 15, 2026 (6 weeks)

## 🎯 Program Impact

**Overall Results:**
- Average conversion lift: **+XX%**
- Tests reaching significance: **X of 6**
- Estimated annual revenue impact: **$XXXk ARR**

## 🏆 Winning Tests

1. **[Test Name]** (+XX% lift, 95% conf.)
   - Winner: Variant [A/B]
   - Key insight: [One sentence]

2. **[Test Name]** (+XX% lift, 95% conf.)
   - Winner: Variant [A/B]
   - Key insight: [One sentence]

[...continue for all tests...]

## 📊 Key Learnings

1. **[Category, e.g., "Messaging"]**
   - [Specific learning from tests]
   - [Recommendation for future pages]

2. **[Category, e.g., "Design"]**
   - [Specific learning from tests]
   - [Recommendation for future pages]

## 🚀 Next Steps

1. **Immediate** (This week):
   - [x] Implement winning variations
   - [x] Deploy to production
   - [ ] Monitor for regression

2. **Short-term** (Next month):
   - [ ] Apply learnings to other pages
   - [ ] Launch Round 2 testing on [pages]

3. **Long-term** (Next quarter):
   - [ ] Continuous optimization program
   - [ ] Expand to [new test areas]
```

### Detailed Results (for Marketing Team)

Use the analysis template above for each test, with:
- Full statistical breakdown
- Secondary metrics analysis
- Hypothesis validation
- User behavior insights
- Screenshots of winning variants

---

## Round 2: Next Test Ideas

Based on learnings from Round 1, consider testing:

### Potential Test Candidates

1. **Hero CTA Text**
   - Control: "Try Gemini"
   - Variation: "Start Free Trial"
   - Hypothesis: Explicit "free" > generic CTA

2. **Social Proof Placement**
   - Control: Bottom of page
   - Variation: Hero section
   - Hypothesis: Early social proof > late

3. **Pricing Transparency**
   - Control: No pricing shown
   - Variation: Pricing tiers visible
   - Hypothesis: Transparency > discovery friction

4. **Video vs Static**
   - Control: Static hero image
   - Variation: Looping video demo
   - Hypothesis: Motion > static

5. **Form Length**
   - Control: Email + Name + Company
   - Variation: Email only
   - Hypothesis: Less friction > more data

### Prioritization Framework

Rank by:
- **Potential impact:** High / Medium / Low
- **Implementation effort:** Easy / Medium / Hard
- **Test duration:** 2 weeks / 4 weeks / 6 weeks

Choose: High impact + Easy implementation first

---

## Appendix: Tools & Resources

### Analysis Tools
- Google Analytics 4: Event tracking, conversion funnels
- BigQuery: Raw data export, custom queries
- Google Sheets: Statistical calculations, charts
- Looker Studio: Dashboards, automated reporting

### Statistical Calculators
- Evan Miller: https://www.evanmiller.org/ab-testing/
- Optimizely: https://www.optimizely.com/sample-size-calculator/
- AB Test Guide: https://abtestguide.com/calc/

### Learning Resources
- "Trustworthy Online Controlled Experiments" (Kohavi et al.)
- Google's A/B Testing Whitepaper
- Optimizely's Experimentation Blog

---

## Changelog

**2026-02-01:** Framework created, tests launched
**[Date TBD]:** First analysis completed
**[Date TBD]:** Winners implemented

---

*This framework will be updated as tests progress. Check back weekly for latest results.*
