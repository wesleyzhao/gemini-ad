# Performance Monitoring - Quick Start Guide
**Get Up and Running in 30 Minutes**

Last Updated: 2026-02-01

---

## 🚀 Quick Setup (30 Minutes)

This guide gets you from zero to monitoring in 30 minutes.

### Step 1: Add Tracking Code (10 min)

**Option A: Automatic (Recommended)**

```bash
# Run the automated script
node scripts/add-performance-monitoring.js

# Replace placeholder with your GA4 ID
# Find and replace "G-XXXXXXXXXX" with your actual ID in all pages
```

**Option B: Manual**

1. Get your Google Analytics 4 ID from [analytics.google.com](https://analytics.google.com)
2. Add tracking code to `<head>` of each page (see `PERFORMANCE_MONITORING_GUIDE.md`)
3. Add feedback widget before `</body>` of each page

### Step 2: Set Up Google Analytics 4 (10 min)

**2a. Create Custom Events**

In GA4 Admin → Events → Create Event:

```
Event Name: cta_click
Parameters:
  - cta_location (string)
  - cta_text (string)
  - page_variant (string)

Event Name: scroll_depth
Parameters:
  - scroll_percentage (number)

Event Name: web_vitals
Parameters:
  - metric_name (string)
  - metric_value (number)
  - metric_rating (string)

Event Name: feedback_rating
Parameters:
  - rating (string: yes/no)
  - page_path (string)
```

**2b. Mark Conversions**

1. Go to Events → Mark as conversion
2. Select `cta_click` → Toggle on
3. This becomes your primary conversion metric

### Step 3: Create Dashboard (10 min)

**3a. Make a Copy of Template**

```
1. Copy performance-dashboard-template.md content
2. Create new Google Sheet
3. Set up tabs as described in template
4. Or use our pre-made template: [Link to template]
```

**3b. Connect GA4 to Google Sheets**

```
1. In Google Sheets: Data → Data connectors → Connect to Google Analytics
2. Select your GA4 property
3. Choose metrics: Sessions, Conversions, Avg engagement time
4. Auto-refresh: Daily
```

---

## 📊 What to Monitor (Priority Order)

### Week 1: Core Web Vitals

**Primary Focus:**
- ✅ LCP (Largest Contentful Paint) - Target: < 2.5s
- ✅ FID (First Input Delay) - Target: < 100ms
- ✅ CLS (Cumulative Layout Shift) - Target: < 0.1

**How to Check:**
1. Open Chrome DevTools → Lighthouse
2. Run audit on each page
3. Check "Performance" section
4. Look for "Core Web Vitals Assessment"

**Red Flags:**
- 🔴 LCP > 4.0s = Critical issue
- 🔴 CLS > 0.25 = Major layout shifts
- 🔴 FID > 300ms = Slow interactions

### Week 2: User Engagement

**Metrics to Track:**
- Conversion Rate (CTA clicks / Visitors)
- Bounce Rate (should be < 50%)
- Time on Page (target: > 2 minutes)
- Scroll Depth (target: >50% reach 75%)

**Where to Find:**
- GA4 → Reports → Engagement

### Week 3: User Feedback

**Monitor:**
- Feedback widget responses
- Positive vs. negative ratio (target: >85% positive)
- Common themes in comments

**Action Items:**
- Address recurring complaints
- Amplify what users love
- Test solutions to common issues

---

## 🎯 Performance Targets (At a Glance)

```
┌──────────────────────────────────────────────────┐
│  METRIC              │ GOOD    │ POOR    │ TARGET │
├──────────────────────┼─────────┼─────────┼────────┤
│  LCP                 │ <2.5s   │ >4.0s   │ <2.0s  │
│  FID                 │ <100ms  │ >300ms  │ <50ms  │
│  CLS                 │ <0.1    │ >0.25   │ <0.05  │
│  Conversion Rate     │ >3.0%   │ <1.5%   │ >4.0%  │
│  Bounce Rate         │ <45%    │ >60%    │ <40%   │
│  Time on Page        │ >2:00   │ <1:00   │ >2:30  │
│  Page Load Time      │ <3.0s   │ >5.0s   │ <2.0s  │
│  Total Page Size     │ <500KB  │ >1MB    │ <400KB │
│  Lighthouse Score    │ >90     │ <70     │ >95    │
└──────────────────────┴─────────┴─────────┴────────┘
```

---

## 🔧 Common Fixes (Quick Wins)

### Issue: Slow LCP

**Quick Fix (5 min):**
```html
<!-- Add fetchpriority to hero image -->
<img src="hero.jpg" fetchpriority="high" loading="eager" alt="...">
```

**Better Fix (15 min):**
```html
<!-- Use WebP and responsive images -->
<img src="hero.webp"
     srcset="hero-400.webp 400w, hero-800.webp 800w"
     sizes="(max-width: 768px) 100vw, 800px"
     fetchpriority="high"
     width="800" height="600"
     alt="...">
```

**Best Fix (30 min):**
```bash
# Optimize all images with Squoosh or similar
# Convert to WebP format
# Generate multiple sizes for srcset
npm install -g @squoosh/cli
squoosh-cli --webp auto -d optimized *.jpg
```

### Issue: High CLS

**Quick Fix (2 min):**
```html
<!-- Add width and height to ALL images -->
<img src="image.jpg" width="800" height="600" alt="...">
```

**Better Fix (10 min):**
```css
/* Use aspect-ratio to reserve space */
.image-container {
  aspect-ratio: 16 / 9;
}

.image-container img {
  width: 100%;
  height: auto;
}
```

### Issue: Slow JavaScript

**Quick Fix (5 min):**
```html
<!-- Add defer to all non-critical scripts -->
<script src="script.js" defer></script>
```

**Better Fix (10 min):**
```html
<!-- Use async for independent scripts -->
<script src="analytics.js" async></script>

<!-- Use defer for DOM-dependent scripts -->
<script src="animations.js" defer></script>
```

### Issue: Poor Mobile Performance

**Quick Fix (10 min):**
```javascript
// Disable heavy animations on mobile
if (window.innerWidth < 768) {
  // Skip parallax effects
} else {
  initParallaxEffects();
}
```

**Better Fix (30 min):**
```html
<!-- Use different images for mobile -->
<picture>
  <source media="(max-width: 768px)" srcset="hero-mobile.webp">
  <source media="(min-width: 769px)" srcset="hero-desktop.webp">
  <img src="hero-desktop.webp" alt="...">
</picture>
```

---

## 📈 Weekly Workflow

### Monday (30 min)
```
1. Check dashboard for week-over-week changes
2. Review any performance alerts
3. Prioritize top 3 issues
4. Create GitHub issues for fixes
```

### Tuesday-Thursday (As needed)
```
1. Implement fixes for priority issues
2. Test changes locally
3. Measure impact with Lighthouse
4. Deploy to production
```

### Friday (20 min)
```
1. Document what was improved
2. Update performance dashboard
3. Share wins with team
4. Set goals for next week
```

---

## 🚨 Alert Thresholds

**Critical (Fix Immediately):**
- LCP > 4.0s
- CLS > 0.25
- Page crashes or errors affecting >5% of users
- Conversion rate drops >30% week-over-week

**High Priority (Fix This Week):**
- LCP 2.5s - 4.0s
- CLS 0.1 - 0.25
- Bounce rate > 60%
- Conversion rate drops 15-30%

**Medium Priority (Fix Within 2 Weeks):**
- Lighthouse score < 90
- Page size > 800KB
- Negative feedback > 20%

**Low Priority (Monitor):**
- Small performance fluctuations
- Minor browser compatibility issues
- Feature requests from <5% of users

---

## 📋 Pre-Launch Checklist

Before deploying any page:

**Performance:**
- [ ] Lighthouse Performance score > 90
- [ ] All images optimized (WebP format, responsive)
- [ ] CSS and JS minified
- [ ] No console errors
- [ ] Core Web Vitals in "Good" range

**Tracking:**
- [ ] GA4 tracking code present
- [ ] Web Vitals monitoring active
- [ ] CTA click tracking working
- [ ] Feedback widget present

**Testing:**
- [ ] Tested on Chrome, Safari, Firefox, Edge
- [ ] Tested on mobile device (iOS and Android)
- [ ] Tested on slow 3G connection
- [ ] Accessibility audit passes

**Content:**
- [ ] Hero text clear and compelling
- [ ] CTA above the fold
- [ ] All images have alt text
- [ ] No broken links

---

## 🛠️ Essential Tools

**Free Tools:**
1. **Lighthouse** (Chrome DevTools) - Performance audits
2. **PageSpeed Insights** - Google's performance checker
3. **Web Vitals Extension** - Real-time Core Web Vitals
4. **Chrome UX Report** - Real user metrics
5. **Google Analytics 4** - User tracking

**Paid Tools (Optional):**
1. **Sentry** ($26/month) - Error tracking
2. **SpeedCurve** ($20/month) - Performance monitoring
3. **Calibre** ($49/month) - Automated performance testing

---

## 📚 Resources

**Documentation:**
- [PERFORMANCE_MONITORING_GUIDE.md](./PERFORMANCE_MONITORING_GUIDE.md) - Full guide
- [performance-dashboard-template.md](./performance-dashboard-template.md) - Dashboard setup
- [AB_TEST_ANALYSIS_FRAMEWORK.md](./AB_TEST_ANALYSIS_FRAMEWORK.md) - A/B testing

**External Resources:**
- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)

---

## ❓ FAQ

**Q: How long until I have enough data?**
A: 1 week for basic trends, 2-4 weeks for statistical significance in A/B tests.

**Q: What's the most important metric?**
A: Conversion rate (CTA clicks). Everything else supports this.

**Q: How often should I check the dashboard?**
A: Weekly reviews are sufficient. Daily checks can lead to over-optimization.

**Q: What if my LCP is high but users aren't complaining?**
A: Still fix it. Many users leave before complaining (reflected in bounce rate).

**Q: Should I prioritize mobile or desktop?**
A: Mobile first. 48% of traffic is mobile and growing.

**Q: How do I know if a change worked?**
A: Compare metrics 7 days before vs. 7 days after the change.

---

## 🎓 Learning Path

**Week 1: Learn the Basics**
- Read Core Web Vitals guide
- Run Lighthouse on all pages
- Set up GA4 tracking

**Week 2: Start Monitoring**
- Create performance dashboard
- Review metrics weekly
- Identify top issues

**Week 3: Make Improvements**
- Fix highest-impact issues
- Measure before/after metrics
- Document learnings

**Week 4: Automate**
- Set up automated alerts
- Create weekly report template
- Train team on dashboard

---

## 🏆 Success Story Template

**Before:**
- LCP: 3.2s
- Conversion Rate: 2.1%
- Bounce Rate: 55%

**Changes Made:**
- Optimized hero image (3MB → 150KB WebP)
- Added fetchpriority="high" to LCP element
- Deferred non-critical JavaScript
- Fixed layout shift by adding image dimensions

**After:**
- LCP: 1.9s (-41%)
- Conversion Rate: 3.4% (+62%)
- Bounce Rate: 41% (-25%)

**Impact:**
- 62% increase in conversions = +$50k annual revenue
- Improved Google search rankings
- Better user experience

---

**Next Steps:**
1. ✅ Run `node scripts/add-performance-monitoring.js`
2. ✅ Set up GA4 tracking
3. ✅ Create performance dashboard
4. ✅ Review metrics weekly

**Questions?** Check [PERFORMANCE_MONITORING_GUIDE.md](./PERFORMANCE_MONITORING_GUIDE.md)

---

Last Updated: 2026-02-01
Version: 1.0
