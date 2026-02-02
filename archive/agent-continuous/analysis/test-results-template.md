# [TEST NAME] - A/B Test Results

**Test ID:** `[test-id]`
**Test Period:** [Start Date] - [End Date] ([X] days)
**Status:** 🟢 COMPLETE - WINNER DECLARED | 🟡 ANALYZING | 🔴 INCONCLUSIVE

---

## Executive Summary

**WINNER: Variant [A/B]** (95.X% confidence)

One-sentence summary of what won and why.

**Business Impact:**
- Conversion lift: **+X.X%** (relative) / **+X.Xpp** (absolute)
- Estimated annual value: **$XXk ARR**
- Recommended action: ✅ Implement immediately

---

## Test Hypothesis

### Original Hypothesis
**We hypothesized that:** [Variation approach] would outperform [Control approach]

**Because:** [Reasoning - user psychology, industry benchmarks, etc.]

**Expected lift:** +X-X%

### Validation
- [ ] ✅ Hypothesis confirmed - variant performed as expected
- [ ] ❌ Hypothesis rejected - opposite result occurred
- [ ] ⚠️ Mixed results - some metrics up, some down

---

## Detailed Results

### Primary Metric: CTA Click Rate

| Metric | Variant A (Control) | Variant B | Difference | Significance |
|--------|---------------------|-----------|------------|--------------|
| **Visitors** | X,XXX | X,XXX | - | - |
| **CTA Clicks** | XXX | XXX | +XX | - |
| **Conversion Rate** | X.XX% | X.XX% | **+X.Xpp** | **p < 0.05** |
| **Relative Lift** | - | - | **+XX.X%** | ✅ Significant |

**Statistical Analysis:**
- Z-score: X.XX (threshold: 1.96)
- P-value: 0.0XX
- Confidence level: 95.X%
- Statistical power: XX%

**Interpretation:**
We are 95.X% confident that Variant [A/B] has a true conversion rate between [X.X% - X.X%] higher than the other variant. The probability this result occurred by chance is less than X%.

---

### Secondary Metrics

| Metric | Variant A | Variant B | Difference | Winner |
|--------|-----------|-----------|------------|--------|
| **Bounce Rate** | XX.X% | XX.X% | -X.Xpp | [A/B] ✅ |
| **Avg. Time on Page** | XXs | XXs | +Xs | [A/B] ✅ |
| **Scroll Depth (avg)** | XX% | XX% | +X% | [A/B] ✅ |
| **Scroll to Footer** | XX% | XX% | +X% | [A/B] ✅ |
| **Secondary CTA Click** | X.X% | X.X% | +X.Xpp | [A/B] ✅ |

**Engagement Quality:**
- ✅ All secondary metrics aligned with primary winner
- ⚠️ [Metric] showed opposite trend - investigate why
- ❌ No significant differences in engagement

**Quality Score:** [High/Medium/Low]
- High = All metrics aligned, confident winner
- Medium = Mixed signals, primary metric strong
- Low = Contradictory metrics, reconsider implementation

---

### Traffic Breakdown

**Desktop vs Mobile:**
| Segment | Variant A Conv. | Variant B Conv. | Lift |
|---------|-----------------|-----------------|------|
| Desktop (XX%) | X.X% | X.X% | +X.X% |
| Mobile (XX%) | X.X% | X.X% | +X.X% |
| Tablet (XX%) | X.X% | X.X% | +X.X% |

**Insights:**
- [Device type] showed strongest lift (+XX%)
- [Device type] showed weakest lift (+XX%)
- Consider device-specific optimizations

**Time of Day:**
| Time Period | Variant A Conv. | Variant B Conv. | Lift |
|-------------|-----------------|-----------------|------|
| Morning (9am-12pm) | X.X% | X.X% | +X.X% |
| Afternoon (12-5pm) | X.X% | X.X% | +X.X% |
| Evening (5-10pm) | X.X% | X.X% | +X.X% |

**Insights:**
- Peak performance during [time period]
- Consider time-based messaging

---

## Key Learnings

### What Worked ✅

1. **[Specific element, e.g., "Competitor comparison table"]**
   - Drove XX% more clicks than abstract features
   - Users spent XXs longer on this section
   - Direct feedback: "Finally, a clear comparison"

2. **[Specific messaging, e.g., "Concrete ROI numbers"]**
   - "$46,800/year" performed XX% better than "save time"
   - Numbers create urgency and justification
   - Especially resonated with [segment]

3. **[Design choice, e.g., "Above-the-fold calculator"]**
   - XX% of users interacted with calculator
   - Calculator users converted at X.Xx higher rate
   - Interactive elements = engagement

### What Didn't Work ❌

1. **[Element that underperformed]**
   - Expected to increase engagement by X%, actually decreased by Y%
   - Likely because: [hypothesis]
   - Recommendation: Try [alternative approach]

2. **[Unexpected negative]**
   - [Metric] worse in winning variant
   - May need optimization in Round 2

### Surprises 🔍

1. **[Unexpected finding]**
   - We thought [X] would happen
   - Instead, [Y] happened
   - Insight: [what this tells us about users]

---

## User Behavior Insights

### Scroll Patterns
- Variant A: Average scroll depth XX%, XX% reached footer
- Variant B: Average scroll depth XX%, XX% reached footer
- **Insight:** [Interpretation of scroll behavior]

### Interaction Heatmap (Conceptual)
```
[Hero Section]
- Variant A: XX% clicked CTA immediately
- Variant B: XX% clicked CTA immediately

[Features Section]
- Variant A: XX% scrolled through all features
- Variant B: XX% scrolled through all features

[Social Proof]
- Variant A: XX% read testimonials
- Variant B: XX% read testimonials

[Footer CTA]
- Variant A: XX% converted at footer
- Variant B: XX% converted at footer
```

### Drop-off Points
- Variant A: Lost XX% at [section]
- Variant B: Lost XX% at [section]
- **Recommendation:** Optimize [losing section] in both variants

---

## Visual Comparison

### Variant A (Control)
**Screenshot:** `screenshots/[test-id]-variant-a.png`

**Key Features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Strengths:**
- [What worked well]

**Weaknesses:**
- [What could be improved]

### Variant B
**Screenshot:** `screenshots/[test-id]-variant-b.png`

**Key Features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Strengths:**
- [What worked well]

**Weaknesses:**
- [What could be improved]

### Side-by-Side Differences
1. **[Section]:** Variant A has [X], Variant B has [Y]
2. **[Section]:** Variant A uses [X], Variant B uses [Y]
3. **[Section]:** Variant A focuses on [X], Variant B focuses on [Y]

---

## Recommendations

### Immediate Actions (This Week)

1. **✅ Implement Winning Variant**
   - Replace `pages/[page].html` with winning variant
   - Remove A/B test routing
   - Deploy to production
   - **Assigned to:** [Name]
   - **ETA:** [Date]

2. **📊 Monitor Post-Implementation**
   - Track for 1 week to confirm lift holds
   - Watch for any negative signals
   - Compare to pre-test baseline
   - **Assigned to:** [Name]

### Short-term Actions (Next Month)

3. **📤 Apply Learnings to Other Pages**
   - Pattern: [Winning element] tested on [Page X, Page Y]
   - Timeline: 2-week test starting [Date]
   - Expected impact: +X% conversion across all pages

4. **🔬 Iterate on Winner**
   - Test identified in analysis: [Improvement opportunity]
   - New hypothesis: [What to test next]
   - Expected lift: +X-X% incremental

### Long-term Strategic Insights

5. **Update Design System**
   - Add component: `[Component name]`
   - Update guidelines: `[Pattern to document]`
   - Share learnings: Present to design team

6. **Audience Insights**
   - [Segment] resonated most with [approach]
   - Future pages for [segment] should use [pattern]
   - Consider dedicated landing pages for [sub-segment]

---

## Design Pattern Documentation

### New Component: [Component Name]

**Use when:** [Scenario where this pattern works best]

**Avoid when:** [Scenario where this pattern doesn't work]

**Code snippet:**
```html
<!-- Winning component structure -->
<div class="[component-class]">
  <!-- Key elements -->
</div>
```

**CSS:**
```css
/* Winning styles */
.[component-class] {
  /* Critical properties */
}
```

**Performance notes:**
- Loads in XXms
- Mobile-friendly: [Yes/No/Notes]
- Accessibility: [WCAG compliance level]

---

## Rollout Plan

### Phase 1: Implement Winner (Week 1)
- [x] Backup current control: `pages/[page]-original-control.html.backup`
- [x] Copy winning variant to control: `cp pages/[page]-variation-b.html pages/[page].html`
- [x] Remove A/B router script from page
- [x] Update `ab-test-router.js` with winner designation
- [x] Git commit with full test results
- [x] Deploy to production
- [x] Verify live page matches winning variant

### Phase 2: Monitor (Week 2)
- [ ] Daily conversion rate checks
- [ ] Compare to pre-test baseline (should match test results)
- [ ] Watch for any technical issues
- [ ] Collect qualitative feedback

### Phase 3: Scale Learnings (Week 3-4)
- [ ] Apply [Pattern X] to [Page A]
- [ ] Apply [Pattern Y] to [Page B]
- [ ] Launch Round 2 tests on [Pages C, D, E]

### Phase 4: Document & Share (Week 4)
- [ ] Present results to marketing team
- [ ] Update design system documentation
- [ ] Share insights company-wide
- [ ] Plan next quarter testing roadmap

---

## Historical Context

### Previous Tests on This Page
- **[Date]:** Tested [X vs Y], Result: [Winner], Lift: [X%]
- **[Date]:** Tested [X vs Y], Result: [Winner], Lift: [X%]

### Cumulative Impact
- Baseline conversion (original): X.X%
- After Test 1: X.X% (+X.X% lift)
- After Test 2: X.X% (+X.X% lift)
- **Current (this test):** X.X% (+X.X% cumulative lift from original)

**Total improvement since launch:** +XX% 🎉

---

## Appendix: Raw Data

### Daily Performance (Sample)

| Date | Variant A Visitors | Variant A Conv. | Variant B Visitors | Variant B Conv. | B Lift |
|------|-------------------|-----------------|-------------------|-----------------|--------|
| Day 1 | XXX | X.X% | XXX | X.X% | +X.X% |
| Day 2 | XXX | X.X% | XXX | X.X% | +X.X% |
| ... | ... | ... | ... | ... | ... |
| Day 35 | XXX | X.X% | XXX | X.X% | +X.X% |

**Trend:**
- [ ] Consistent lift throughout test
- [ ] Lift increased over time (learning effect)
- [ ] Lift decreased over time (novelty effect)
- [ ] High variance day-to-day

### Statistical Calculations

```
Sample Sizes:
n_A = [control visitors]
n_B = [variant visitors]

Conversions:
c_A = [control conversions]
c_B = [variant conversions]

Conversion Rates:
p_A = c_A / n_A = X.XXX
p_B = c_B / n_B = X.XXX

Pooled Conversion Rate:
p_pooled = (c_A + c_B) / (n_A + n_B) = X.XXX

Standard Error:
SE = sqrt(p_pooled * (1 - p_pooled) * (1/n_A + 1/n_B)) = X.XXXX

Z-Score:
z = (p_B - p_A) / SE = X.XX

P-Value:
p = 2 * (1 - Φ(|z|)) = X.XXXX
where Φ is the cumulative distribution function of the standard normal distribution

Confidence Interval (95%):
CI = (p_B - p_A) ± 1.96 * SE
   = [X.XX%, X.XX%]

We are 95% confident the true lift is between X.X% and X.X%.
```

---

## Sign-off

**Analysis completed by:** [Name]
**Date:** [Date]
**Reviewed by:** [Name(s)]
**Approved for implementation:** ✅ Yes / ❌ No / ⏳ Pending

**Notes:**
[Any final comments or considerations]

---

*Template version: 1.0*
*Last updated: 2026-02-01*
