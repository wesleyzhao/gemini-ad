# A/B Test Deployment Instructions

## Test: personalization-urgency-combo
**Status**: ✅ Deployed
**Deployed**: 2026-02-01T15:26:23.479Z
**Duration**: 14 days
**Predicted Lift**: 52.9%

## Integration Steps

### 1. Add A/B Test Router to Test Pages

Add this script to the `<head>` section of each test page:

```html
<script src="ab-tests/personalization-urgency-combo/ab-test-router.js"></script>
```

### 2. Verify Variant Files

Ensure these variant files are deployed:

- pages/writers.html (control)
- pages/writers-variantA.html (personalization only)
- pages/writers-variantB.html (personalization + urgency)
- pages/creators.html (control)
- pages/creators-variantA.html (personalization only)
- pages/creators-variantB.html (personalization + urgency)
- pages/operators.html (control)
- pages/operators-variantA.html (personalization only)
- pages/operators-variantB.html (personalization + urgency)
- pages/automators.html (control)
- pages/automators-variantA.html (personalization only)
- pages/automators-variantB.html (personalization + urgency)

### 3. Configure Google Analytics

Add these custom dimensions in GA4:
- `ab_test` - The test name
- `variant` - The variant (control/variantA/variantB)

### 4. Monitor Results

Use the Real User Monitoring dashboard to track:
- Conversion rate by variant
- Time on page by variant
- Scroll depth by variant
- CTA clicks by variant

Expected results after 14 days:
- Control: baseline
- Variant A (Personalization): +18.5% lift
- Variant B (Combo): +52.9% lift

### 5. Scale Winner

After 14 days with statistical significance:
1. Analyze results in `reports/ab-tests/results/`
2. Scale winning variant to production
3. Apply learnings to other pages

## Traffic Split

- Control: 33%
- Variant A: 33%
- Variant B: 34%

## Notes

- Users are consistently assigned to same variant (cookie-based)
- Variant assignment persists across sessions
- All variants are mobile-responsive
- Urgency banner countdown resets daily at midnight