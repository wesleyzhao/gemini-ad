# Production Monitoring Quick Start

> 🚀 Get started with Core Web Vitals production monitoring in 5 minutes

## What Is This?

A comprehensive monitoring system that:
- 📊 Tracks real user Core Web Vitals metrics
- 🎨 Generates beautiful performance dashboards
- ⚠️ Alerts you to performance problems
- 💡 Provides data-driven optimization recommendations

## Quick Commands

```bash
# Generate full monitoring report + dashboard
npm run monitor:cwv

# View latest dashboard
open reports/dashboards/latest.html

# Check for alerts only
npm run monitor:cwv:alerts

# Run validation
npm run test:monitoring
```

## 5-Minute Setup

### Step 1: Verify Everything is Working

```bash
npm run monitor:cwv
```

You should see:
- ✅ Data extraction successful
- ✅ Analysis complete
- ✅ Dashboard generated
- ✅ Alerts checked

### Step 2: View Your Dashboard

```bash
open reports/dashboards/latest.html
```

The dashboard shows:
- 📊 Overall performance summary
- 📈 Core Web Vitals metrics (LCP, FID, INP, CLS)
- ⚠️ Active alerts and warnings
- 💡 Optimization recommendations

### Step 3: Understand Your Metrics

**🟢 Green (Good)**: 75%+ users have good experience
- Keep monitoring
- Maintain current performance

**🟡 Yellow (Needs Work)**: 50-75% users have good experience
- Schedule optimization work
- Review recommendations

**🔴 Red (Poor)**: <50% users have good experience
- Immediate action required
- Follow optimization guide

### Step 4: Act on Recommendations

The dashboard provides specific recommendations like:

```
⚠️ WARNING: trust.html - LCP
→ Recommendation: Optimize hero images - convert to WebP
→ Action: Run npm run optimize-images
```

### Step 5: Schedule Regular Monitoring

Add to your workflow:

**Daily**: Check for critical alerts
```bash
npm run monitor:cwv:alerts
```

**Weekly**: Review full dashboard
```bash
npm run monitor:cwv
open reports/dashboards/latest.html
```

**Monthly**: Deep analysis and optimization sprint

## Understanding Alerts

### 🚨 Critical (>25% users affected)
**Fix immediately** - Significant user impact

### ⚠️ Warning (10-25% users affected)
**Fix this week** - Moderate user impact

### ℹ️ Info (<10% users affected)
**Monitor** - Minor impact

## Common Optimizations

### High LCP (Slow Loading)
```bash
# Optimize images
npm run optimize-images

# Check preconnect hints
node scripts/core-web-vitals.js --analyze
```

### High FID/INP (Slow Interactions)
```javascript
// Defer non-critical JavaScript
<script src="script.js" defer></script>
```

### High CLS (Layout Shifts)
```html
<!-- Add image dimensions -->
<img src="hero.jpg" width="1200" height="800">
```

## Current Status

**Mode**: Simulated Data
- System is fully functional
- Uses realistic simulated metrics
- Perfect for testing and development

**To Enable Real Data**:
1. Set up Google Analytics 4
2. Configure GA4 Data API credentials
3. Set environment variables:
   ```bash
   export GA4_ENABLED=true
   export GA4_PROPERTY_ID=your-property-id
   ```

## File Locations

```
reports/
├── dashboards/
│   └── latest.html                    # 👈 Open this!
├── alerts/
│   └── alerts-2026-02-01.json         # Alert history
└── cwv-monitoring-report-2026-02-01.json  # Full data
```

## Need Help?

📖 **Full Documentation**: [docs/PRODUCTION_MONITORING.md](./PRODUCTION_MONITORING.md)
📖 **Core Web Vitals Guide**: [docs/CORE_WEB_VITALS.md](./CORE_WEB_VITALS.md)
📖 **Image Optimization**: [docs/IMAGE_OPTIMIZATION.md](./IMAGE_OPTIMIZATION.md)

## Validation

To ensure everything is working:

```bash
npm run test:monitoring
```

Should show: `✅ Passed: 18/18 (100%) - Grade: A+`

---

**Pro Tip**: Bookmark `reports/dashboards/latest.html` for quick access to your performance dashboard!
