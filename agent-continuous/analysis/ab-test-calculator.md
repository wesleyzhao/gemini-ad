# A/B Test Statistical Calculator

**Purpose:** Calculate statistical significance for A/B test results
**Tool:** Google Sheets formula-based calculator
**Last Updated:** 2026-02-01

---

## Quick Start

### Option 1: Use Online Calculators (Recommended)

**Evan Miller's Calculator** (Most trusted)
https://www.evanmiller.org/ab-testing/chi-squared.html

1. Enter Variant A visitors and conversions
2. Enter Variant B visitors and conversions
3. Instantly get p-value and confidence level

**AB Test Guide Calculator**
https://abtestguide.com/calc/

- Simple interface
- Provides confidence intervals
- Shows sample size recommendations

---

## Option 2: Google Sheets Template

### Step 1: Create New Sheet

Create a new Google Sheet with this structure:

```
A                    | B          | C
---------------------|------------|------------
TEST INPUTS          |            |
Variant A (Control)  |            |
Visitors             | 2450       |
Conversions          | 122        |
Conversion Rate      | =C3/C2     | [Auto-calc]
                     |            |
Variant B            |            |
Visitors             | 2478       |
Conversions          | 149        |
Conversion Rate      | =C8/C7     | [Auto-calc]
                     |            |
RESULTS              |            |
Absolute Difference  | =C9-C4     | [Auto-calc]
Relative Lift (%)    | =(C9-C4)/C4*100 | [Auto-calc]
Pooled Conv Rate     | =(C3+C8)/(C2+C7) | [Auto-calc]
Standard Error       | =SQRT(C14*(1-C14)*(1/C2+1/C7)) | [Auto-calc]
Z-Score              | =(C9-C4)/C15 | [Auto-calc]
P-Value              | =2*(1-NORM.S.DIST(ABS(C16),TRUE)) | [Auto-calc]
Confidence Level     | =(1-C17)*100 | [Auto-calc]
                     |            |
DECISION             |            |
Significant?         | =IF(C18>=95,"✅ YES","❌ NO") | [Auto-calc]
Winner               | =IF(C9>C4,"Variant B","Variant A") | [Auto-calc]
Recommendation       | =IF(C18>=95,CONCATENATE("Implement ",C21," (+",ROUND(C12,1),"% lift)"),"Keep running test") | [Auto-calc]
```

### Step 2: Format for Readability

**Number Formats:**
- Visitors/Conversions (C2, C3, C7, C8): `#,##0`
- Conversion Rates (C4, C9): `0.00%`
- Absolute Difference (C11): `0.00%`
- Relative Lift (C12): `0.0%`
- Standard Error/P-Value (C15, C17): `0.0000`
- Z-Score (C16): `0.00`
- Confidence (C18): `0.0%`

**Conditional Formatting:**
- C20 (Significant?): Green if ✅, Red if ❌
- C18 (Confidence): Green if ≥95%, Yellow if 90-95%, Red if <90%

### Step 3: Example Calculation

**Sample Data:**
```
Variant A: 2,450 visitors, 122 conversions (4.98%)
Variant B: 2,478 visitors, 149 conversions (6.01%)
```

**Results:**
```
Absolute Difference: +1.03%
Relative Lift: +20.7%
Pooled Conv Rate: 5.50%
Standard Error: 0.0046
Z-Score: 2.24
P-Value: 0.0251
Confidence Level: 97.5%

✅ SIGNIFICANT - Implement Variant B (+20.7% lift)
```

---

## Option 3: Manual Calculation (if needed)

### Step-by-Step Formula

Given:
- n_A = Variant A visitors
- c_A = Variant A conversions
- n_B = Variant B visitors
- c_B = Variant B conversions

**1. Calculate Conversion Rates**
```
p_A = c_A / n_A
p_B = c_B / n_B
```

**2. Calculate Pooled Conversion Rate**
```
p_pooled = (c_A + c_B) / (n_A + n_B)
```

**3. Calculate Standard Error**
```
SE = √[p_pooled × (1 - p_pooled) × (1/n_A + 1/n_B)]
```

**4. Calculate Z-Score**
```
z = (p_B - p_A) / SE
```

**5. Calculate P-Value**
```
p_value = 2 × (1 - Φ(|z|))
```
where Φ is the standard normal CDF

**Use a Z-table or calculator:**
- z = 1.96 → p = 0.05 (95% confidence)
- z = 2.58 → p = 0.01 (99% confidence)

**6. Calculate Confidence Interval (95%)**
```
CI = (p_B - p_A) ± 1.96 × SE
```

### Decision Rules

**Declare Significant if:**
- z ≥ 1.96 (for 95% confidence), OR
- p ≤ 0.05 (5% significance level)

**AND:**
- Minimum sample size met (2,400+ per variant)
- Minimum conversions (200+ per variant)

---

## Sample Size Calculator

### Pre-Test: How Many Visitors Needed?

**Formula:**
```
n = (z_α/2 + z_β)² × [p₁(1-p₁) + p₂(1-p₂)] / (p₁ - p₂)²

Where:
z_α/2 = 1.96 (for 95% confidence)
z_β = 0.84 (for 80% power)
p₁ = baseline conversion rate
p₂ = expected new conversion rate
```

**Quick Reference Table:**

| Baseline CR | Minimum Detectable Effect | Sample Size per Variant |
|-------------|---------------------------|------------------------|
| 2% | 20% relative (+0.4pp) | ~8,000 |
| 2% | 15% relative (+0.3pp) | ~14,000 |
| 2% | 10% relative (+0.2pp) | ~31,000 |
| 5% | 20% relative (+1.0pp) | ~3,000 |
| 5% | 15% relative (+0.75pp) | ~5,400 |
| 5% | 10% relative (+0.5pp) | ~12,000 |
| 10% | 20% relative (+2.0pp) | ~1,400 |
| 10% | 15% relative (+1.5pp) | ~2,500 |
| 10% | 10% relative (+1.0pp) | ~5,700 |

**For our tests (assuming 5% baseline CR):**
- To detect 15% lift: ~5,400 visitors per variant
- To detect 10% lift: ~12,000 visitors per variant
- **Our target: 2,400 visitors** can detect ~20% lift

---

## Confidence Interval Calculator

### Purpose
Show the range where the true lift likely falls

### Formula
```
CI = (p_B - p_A) ± z × SE

Where:
z = 1.96 for 95% confidence
z = 2.58 for 99% confidence
SE = standard error (calculated above)
```

### Example
```
Given:
- Variant A: 4.98% conversion
- Variant B: 6.01% conversion
- SE = 0.0046
- Difference = 1.03%

95% CI:
Lower bound = 1.03% - (1.96 × 0.46%) = 0.13%
Upper bound = 1.03% + (1.96 × 0.46%) = 1.93%

Interpretation:
We are 95% confident the true lift is between 0.13% and 1.93%.
```

### What This Means

**Wide Interval (e.g., 0.1% to 5.0%):**
- High uncertainty
- Need more data
- Consider running test longer

**Narrow Interval (e.g., 0.8% to 1.2%):**
- High certainty
- Confident in result
- Safe to implement

**Interval Includes Zero (e.g., -0.5% to +1.5%):**
- Not statistically significant
- Could be no real difference
- Do NOT implement

---

## Segmented Analysis

### When to Segment

Analyze subgroups ONLY if:
- [ ] Overall test is already significant
- [ ] Segment has ≥400 visitors per variant
- [ ] You have a pre-defined hypothesis

**Warning:** Don't data-mine for significant segments post-hoc

### Common Segments to Analyze

1. **Device Type**
   - Desktop vs Mobile vs Tablet
   - Helps identify device-specific issues

2. **New vs Returning Visitors**
   - May respond differently to changes
   - Consider separate experiences

3. **Traffic Source**
   - Organic vs Paid vs Direct
   - Different intent levels

4. **Time of Day**
   - Morning vs Afternoon vs Evening
   - Consider time-based messaging

5. **Geography**
   - Different markets may respond differently
   - Localization opportunities

### Segmented Analysis Sheet Structure

```
Segment    | Var A Visitors | Var A Conv | Var B Visitors | Var B Conv | Lift | Significant?
-----------|----------------|------------|----------------|------------|------|-------------
Desktop    | 1,200          | 5.2%       | 1,220          | 6.4%       | +23% | ✅ Yes
Mobile     | 1,100          | 4.5%       | 1,108          | 5.3%       | +18% | ✅ Yes
Tablet     | 150            | 5.0%       | 150            | 5.5%       | +10% | ❌ No (low n)
```

**Insights:**
- Variant B works across devices
- Strongest on desktop (+23%)
- Tablet sample too small to conclude

---

## Sequential Testing (Advanced)

### When Your Test Reaches Significance Early

**Problem:** If you peek at results before planned end date, traditional stats can give false positives

**Solution:** Use Sequential Testing (Optimizely Stats Engine approach)

**Adjusted Significance Threshold:**
```
For continuous monitoring:
- Use p < 0.01 instead of p < 0.05
- Or use z > 2.58 instead of z > 1.96
- This controls for "peeking"
```

**Optimizely's Always Valid P-Value:**
https://www.optimizely.com/optimization-glossary/sequential-testing/

Allows checking results anytime without inflation

---

## Common Mistakes to Avoid

### ❌ Stopping Test Too Early
**Problem:** Not enough data, high variance
**Fix:** Wait for 2,400+ visitors per variant

### ❌ Multiple Comparisons
**Problem:** Testing A vs B vs C vs D inflates false positive rate
**Fix:** Limit to 2-3 variants, use Bonferroni correction if more

### ❌ Changing Test Mid-Flight
**Problem:** Invalidates statistical assumptions
**Fix:** Let test run completely, make changes in Round 2

### ❌ Ignoring Guardrail Metrics
**Problem:** Win on conversion, lose on engagement
**Fix:** Always check bounce rate, time on page, etc.

### ❌ Testing Too Small Changes
**Problem:** Need huge sample to detect tiny lift
**Fix:** Test bold changes (aim for 15%+ expected lift)

### ❌ HARKing (Hypothesizing After Results Known)
**Problem:** Making up hypothesis to fit data
**Fix:** Document hypothesis BEFORE running test

---

## Resources

### Online Calculators
- **Evan Miller** (Best): https://www.evanmiller.org/ab-testing/chi-squared.html
- **AB Test Guide**: https://abtestguide.com/calc/
- **Optimizely**: https://www.optimizely.com/sample-size-calculator/
- **VWO**: https://vwo.com/tools/ab-test-significance-calculator/

### Statistical Tables
- **Z-Score Table**: http://www.z-table.com/
- **T-Test Table**: http://www.ttable.org/

### Learning Resources
- **Trustworthy Online Controlled Experiments** by Kohavi, Tang, Xu (Book)
- **Google's A/B Testing Guide**: https://support.google.com/optimize/answer/7405543
- **Optimizely Stats Engine**: https://www.optimizely.com/optimization-glossary/

### Google Sheets Functions
- `NORM.S.DIST(z, TRUE)` - Standard normal CDF (for p-value)
- `NORM.S.INV(p)` - Inverse normal CDF (for z-score from p-value)
- `CONFIDENCE.NORM(alpha, stdev, size)` - Confidence interval
- `T.TEST(array1, array2, tails, type)` - T-test for small samples

---

## Changelog

**2026-02-01:** Created initial calculator templates and formulas

---

*Use this calculator for all 6 active A/B tests when results are ready (March 2026)*
