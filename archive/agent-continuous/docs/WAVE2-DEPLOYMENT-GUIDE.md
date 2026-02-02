# Wave 2 A/B Testing Deployment Guide

**Feature #77: Launch Wave 2 A/B Tests**
**Date**: February 1, 2026
**Status**: Production Ready
**Test Duration**: 14 days

---

## 📋 Executive Summary

Wave 2 deploys three next-generation pattern combinations based on Feature #75's winning results (+67.1% lift). This guide covers deployment, monitoring, and scaling of:

1. **Social Proof + Personalization** (Predicted: +45%)
2. **Scarcity + Trust Signals** (Predicted: +38%)
3. **Mobile-Optimized Combo** (Predicted: +50% mobile)

**Expected Impact**: +100-120% cumulative conversion improvement if all tests succeed.

---

## 🎯 Test Overview

### Pattern 1: Social Proof + Personalization

**Target**: Writers, Creators, Operators, Automators
**Predicted Lift**: +45%
**Key Elements**:
- Segment-specific testimonials with avatars
- Real-time social proof stats (2.5M+ users, 4.9/5 rating)
- Personalized messaging by user segment
- Trust-building through peer validation

**Traffic Split**: 33% Control, 33% Variant (Desktop only)

### Pattern 2: Scarcity + Trust Signals

**Target**: Trust-focused users, Enterprise
**Predicted Lift**: +38%
**Key Elements**:
- Trust badge bar (Google Verified, SOC 2, GDPR, Rating)
- Animated scarcity callout (Beta Access Closing Soon)
- Dynamic spot counter (decrements over time)
- Security and compliance indicators

**Traffic Split**: 33% Control, 34% Variant (Desktop only)

### Pattern 3: Mobile-Optimized Combo

**Target**: Mobile users (60%+ of traffic)
**Predicted Lift**: +50% (mobile only)
**Key Elements**:
- Sticky bottom CTA (slides up after 1s)
- Quick action floating bubble (bouncing animation)
- Swipeable testimonial cards (horizontal scroll)
- Touch-optimized interactions (44x44px targets)

**Traffic Split**: 50% Control, 50% Variant (Mobile only)

---

## 🚀 Deployment Steps

### Step 1: Generate Variant Pages

```bash
node scripts/deploy-wave2-ab-tests.js
```

**Output**:
- 12 variant pages created (4 base pages × 3 patterns)
- Deployment manifest: `ab-tests/wave2-variants/deployment-manifest.json`
- Organized by pattern: `social-proof/`, `scarcity-trust/`, `mobile-optimized/`

**Verification**:
```bash
ls -la ab-tests/wave2-variants/social-proof/
ls -la ab-tests/wave2-variants/scarcity-trust/
ls -la ab-tests/wave2-variants/mobile-optimized/
```

### Step 2: Deploy Router Script

Add Wave 2 router to all base pages:

```html
<!-- Add before </body> -->
<script src="/ab-tests/wave2-router.js"></script>
```

**Pages to update**:
- `pages/writers.html`
- `pages/creators.html`
- `pages/operators.html`
- `pages/automators.html`

The router will:
- Assign users to variants based on device type
- Persist assignment via cookies (30 days)
- Track events to Google Analytics 4
- Route to appropriate variant pages

### Step 3: Configure Google Analytics 4

**Custom Dimensions** (add to GA4 property):

| Dimension Name | Scope | Parameter |
|----------------|-------|-----------|
| `wave2_variant` | User | `variant` |
| `test_wave` | Event | `test_wave` |
| `device_type` | Session | `isMobile` |

**Custom Events**:
- `wave2_variant_assigned` - User assigned to variant
- `wave2_page_view` - Page view with variant info
- `wave2_conversion` - Conversion event (CTA click)

**Setup Instructions**:
1. Go to GA4 Admin → Custom Definitions
2. Create custom dimensions (see table above)
3. Enable Enhanced Measurement
4. Verify events in DebugView

### Step 4: Launch Tests

```bash
# Commit and push to GitHub
git add .
git commit -m "Launch Wave 2 A/B tests (Social Proof, Scarcity+Trust, Mobile Combo)"
git push origin main

# Verify deployment
curl https://your-domain.github.io/pages/writers.html
curl https://your-domain.github.io/ab-tests/wave2-variants/social-proof/writers.html
```

**Go-Live Checklist**:
- [ ] All variant pages generated and deployed
- [ ] Router script added to base pages
- [ ] GA4 custom dimensions configured
- [ ] Mobile conversion dashboard accessible
- [ ] Test duration set to 14 days
- [ ] Alerts configured for anomalies

---

## 📊 Monitoring & Analytics

### Real-Time Dashboard

Access the mobile conversion dashboard:
```
https://your-domain.github.io/dashboard/mobile-conversion-dashboard.html
```

**Features**:
- Real-time conversion rates by device
- Pattern performance comparison
- Engagement metrics (time on page, scroll depth)
- Test progress tracker
- Auto-refresh every 30 seconds

### GA4 Exploration

**Create Custom Exploration**:

1. **Dimensions**:
   - `wave2_variant`
   - `device_type`
   - `page_location`

2. **Metrics**:
   - `conversions`
   - `conversion_rate`
   - `engagement_rate`
   - `average_engagement_time`

3. **Filters**:
   - `test_wave = "wave2"`
   - Date range: Last 14 days

### Key Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Mobile Conversion Rate | > 9.0% | < 7.0% |
| Desktop Conversion Rate | > 12.0% | < 9.0% |
| Mobile Traffic Share | 60-65% | < 55% or > 70% |
| Avg. Time on Page (Mobile) | > 40s | < 30s |
| Scroll Depth (Mobile) | > 70% | < 60% |

### Statistical Significance

**Minimum Requirements**:
- Confidence Level: 95%
- Statistical Power: 80%
- Minimum Sample Size: 385 conversions per variant
- Test Duration: 14 days (2 full weeks)

**Calculate significance**:
```bash
node scripts/monitor-ab-test-performance.js --test wave2 --days 14
```

---

## 🎨 Pattern Implementation Details

### Social Proof Pattern

**CSS Classes**:
- `.social-proof-banner` - Main container with gradient
- `.social-proof-stats` - Stats display (flex layout)
- `.stat-item` - Individual stat
- `.testimonial-card` - Testimonial container
- `.author-avatar` - User avatar with gradient

**Customization**:
```javascript
// Update stats dynamically
document.querySelector('.stat-number').textContent = '3.2M+';
```

### Scarcity + Trust Pattern

**CSS Classes**:
- `.trust-badge-bar` - Trust badges container
- `.trust-badge` - Individual badge
- `.scarcity-callout` - Urgency banner with animation
- `.scarcity-counter` - Dynamic spot counter

**Countdown Logic**:
```javascript
// Spots decrease randomly every 5 seconds
let spots = 23;
setInterval(() => {
  if (spots > 15 && Math.random() > 0.7) {
    spots--;
    document.getElementById('beta-spots').textContent = spots;
  }
}, 5000);
```

### Mobile-Optimized Pattern

**CSS Classes**:
- `.mobile-sticky-cta` - Fixed bottom CTA
- `.mobile-cta-button` - CTA button (white bg)
- `.quick-action-bubble` - Floating action button
- `.mobile-testimonials` - Swipeable cards
- `.mobile-testimonial-card` - Individual card

**Mobile Detection**:
```javascript
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
}
```

---

## 🔍 Testing & Validation

### Manual Testing

**Desktop Testing**:
1. Clear cookies: `document.cookie = "gemini_wave2_variant=; expires=Thu, 01 Jan 1970 00:00:00 UTC"`
2. Refresh page multiple times
3. Verify variant assignment (check console logs)
4. Test social proof and scarcity patterns

**Mobile Testing**:
1. Use Chrome DevTools device emulation
2. Test iPhone (375px), Android (360px), iPad (768px)
3. Verify sticky CTA appears after 1s
4. Test swipeable testimonials (scroll horizontally)
5. Verify quick action bubble bounces

### Automated Testing

```bash
# Run Wave 2 validation tests
node test-feature-77.js

# Expected output:
# ✅ All variant pages exist
# ✅ Router script deployed
# ✅ Mobile dashboard accessible
# ✅ Pattern CSS/HTML injected correctly
```

### Visual Regression Testing

```bash
# Capture screenshots of all variants
npm run test:visual -- --variants wave2

# Compare against baselines
npm run test:visual:compare
```

---

## 📈 Expected Results

### Conversion Improvements (by Pattern)

| Pattern | Device | Baseline | Target | Predicted Lift |
|---------|--------|----------|--------|----------------|
| Social Proof | Desktop | 8.6% | 12.5% | +45% |
| Scarcity+Trust | Desktop | 8.6% | 11.9% | +38% |
| Mobile Combo | Mobile | 6.2% | 9.3% | +50% |

### Revenue Projections (14-day test)

**Assumptions**:
- Daily traffic: 10,000 visitors (60% mobile, 40% desktop)
- Avg. conversion value: $50

**Best Case** (all patterns succeed):
- Additional conversions: +1,200
- Additional revenue: +$60,000 over 14 days
- Annualized impact: +$1.5M

**Conservative** (mobile-only success):
- Additional conversions: +620
- Additional revenue: +$31,000 over 14 days
- Annualized impact: +$800K

---

## 🚨 Troubleshooting

### Issue: Variant not loading

**Symptoms**: User stays on control page despite cookie assignment
**Solution**:
1. Check browser console for errors
2. Verify router script loaded: `console.log(window.geminiWave2)`
3. Clear cache and cookies
4. Verify variant file exists at expected path

### Issue: Mobile pattern showing on desktop

**Symptoms**: Sticky CTA appears on desktop (>768px)
**Solution**:
1. Check CSS media query: `@media (max-width: 768px)`
2. Verify device detection: `window.geminiWave2.isMobile`
3. Disable browser device emulation

### Issue: Stats not tracking in GA4

**Symptoms**: Events not appearing in GA4 DebugView
**Solution**:
1. Verify GA4 tag installed: `window.gtag`
2. Check custom dimensions configured
3. Enable DebugView mode: `?debug_mode=1`
4. Wait 24-48 hours for data processing

### Issue: High bounce rate on variants

**Symptoms**: Bounce rate >70% on variant pages
**Solution**:
1. Check page load time (should be <3s)
2. Verify all assets loading (CSS, images)
3. Test on real devices (not just emulators)
4. Review error logs for JavaScript errors

---

## 📚 Additional Resources

### Documentation
- [Feature #76 Summary](../FEATURE-76-SUMMARY.md) - Previous wave context
- [Mobile Conversion Guide](./MOBILE-CONVERSION-OPTIMIZATION-GUIDE.md)
- [GA4 Integration Guide](./GA4-INTEGRATION-GUIDE.md)

### Dashboards
- [Wave 2 Mobile Dashboard](../dashboard/mobile-conversion-dashboard.html)
- [RUM Dashboard](../dashboard/rum-dashboard.html)

### Scripts
- `scripts/deploy-wave2-ab-tests.js` - Generate variants
- `scripts/monitor-ab-test-performance.js` - Track results
- `ab-tests/wave2-router.js` - Routing logic

### Support
- **Questions**: Check project documentation
- **Issues**: Review troubleshooting section
- **Data Analysis**: Use GA4 custom exploration

---

## ✅ Success Criteria

Tests are considered successful when:

- [ ] Statistical significance achieved (95% confidence)
- [ ] At least one pattern shows >30% lift
- [ ] Mobile conversion rate >9.0%
- [ ] No negative impact on engagement metrics
- [ ] Core Web Vitals remain "Good"
- [ ] Test completes full 14-day duration

**Next Steps After Success**:
1. Analyze winning patterns
2. Scale winners to all production pages
3. Design Wave 3 tests (Feature #78)
4. Document learnings and best practices

---

**Last Updated**: February 1, 2026
**Version**: 1.0
**Feature**: #77 - Wave 2 A/B Testing Launch
