# A/B Test Results: Call to Action

**Test ID:** test_cta_001
**Status:** active
**Duration:** 7 days
**Analyzed:** 2026-02-01T14:18:22.572Z

## Summary

✅ **Winner Identified:** Enhanced

- **Lift Over Control:** +6.6%
- **Absolute Improvement:** +5.1 points
- **Statistical Confidence:** 100.0%
- **P-Value:** 0.0004
- **Effect Size (Cohen's d):** 0.476

## Performance by Variation

| Variation | UX Score | Sample Size | Lift vs Control |
|-----------|----------|-------------|------------------|
| ⚖️ Control | 77.2 | 107 | 0.0% |
| 🏆 Enhanced | 82.3 | 114 | +6.6% |

## Detailed Metrics

### Control

**UX Score:**
- Mean: 77.2
- Std Dev: 11.7
- Median: 77.9
- Range: 62.2 - 87.2

**Secondary Metrics:**
- Engagement: 73.4
- Bounce Rate: 40.8%
- Time on Page: 154s

### Enhanced

**UX Score:**
- Mean: 82.3
- Std Dev: 9.5
- Median: 82.5
- Range: 67.3 - 92.3

**Secondary Metrics:**
- Engagement: 69.4
- Bounce Rate: 34.5%
- Time on Page: 131s

## Statistical Analysis

**Hypothesis Test:**
- H0: No difference between variations
- H1: Winning variation performs better than control
- Test: Two-sample t-test
- Significance Level: α = 0.05

**Results:**
- t-statistic: 3.536
- p-value: 0.0004
- Degrees of Freedom: 219
- Effect Size: 0.476
- Conclusion: Reject H0

## Recommendation

**Action:** SCALE WINNER

Scale winning variation "Enhanced" to all pages

### Next Steps

1. Scale winning variation to all target pages
2. Update pattern library with winning configuration
3. Monitor production performance
4. Document learnings for future tests
