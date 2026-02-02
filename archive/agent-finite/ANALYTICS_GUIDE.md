# Analytics Tracking Guide

Complete guide for analytics tracking in the Gemini Ads Campaign.

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Google Analytics 4 Setup](#google-analytics-4-setup)
- [Analytics Library Features](#analytics-library-features)
- [Automatic Tracking](#automatic-tracking)
- [Manual Tracking](#manual-tracking)
- [Events Reference](#events-reference)
- [JavaScript API](#javascript-api)
- [Privacy & Compliance](#privacy--compliance)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

The Gemini Ads Campaign uses a custom analytics library (`analytics.js`) integrated with Google Analytics 4 (GA4) to track user behavior and measure campaign performance.

### What It Tracks

✅ **Automatic Tracking:**
- Page views
- CTA button clicks
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page (10s, 30s, 60s, 120s, 300s)
- Outbound link clicks
- Page exit events

✅ **Manual Tracking:**
- Form submissions
- Video interactions
- Custom events
- Search queries

### Privacy Features

- ✅ Respects "Do Not Track" browser setting
- ✅ IP anonymization enabled
- ✅ Secure cookies (SameSite=None;Secure)
- ✅ No tracking without user consent (respects DNT)

## Quick Start

### 1. Setup Google Analytics 4

1. Create a GA4 property in Google Analytics
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Update the Measurement ID in `scripts/add-analytics.js`:

```javascript
const GA4_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID';
```

4. Re-run the setup script:

```bash
npm run analytics:add
```

### 2. Verify Installation

Open any landing page and check the browser console:

```javascript
// Check if analytics is loaded
console.log(window.geminiAnalytics);

// Get analytics report
geminiAnalytics.getReport();
```

### 3. Enable Debug Mode

To see analytics events in the console:

```javascript
geminiAnalytics.enableDebug();
```

## Google Analytics 4 Setup

### Creating a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left)
3. Click **Create Property**
4. Enter property details:
   - Property name: "Gemini Ads Campaign"
   - Reporting time zone: Your time zone
   - Currency: Your currency
5. Click **Next** and complete business information
6. Click **Create** and accept Terms of Service
7. Choose **Web** as platform
8. Enter website details:
   - Website URL: Your GitHub Pages URL
   - Stream name: "Gemini Ads"
9. Click **Create Stream**
10. Copy your **Measurement ID** (starts with `G-`)

### Installing the Measurement ID

1. Open `scripts/add-analytics.js`
2. Replace the placeholder:

```javascript
// Before
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// After
const GA4_MEASUREMENT_ID = 'G-ABC123XYZ'; // Your actual ID
```

3. Run the script to update all pages:

```bash
npm run analytics:add
```

### Verifying GA4 Installation

1. Open any landing page
2. Open Google Analytics Real-Time report
3. You should see your visit in real-time
4. Wait 24-48 hours for data to appear in standard reports

## Analytics Library Features

### Core Features

1. **Automatic Initialization**: No setup required, works immediately
2. **Privacy-First**: Respects Do Not Track, anonymizes IPs
3. **Fallback Logging**: Works without GA4 (console logging)
4. **Performance Optimized**: Minimal impact on page load
5. **Easy API**: Simple functions for custom tracking

### File Structure

```
assets/js/
├── analytics.js         # Full library (10.8 KB)
└── analytics.min.js     # Minified (8.6 KB)
```

All pages use the full version by default. Switch to minified for production:

```html
<!-- Production -->
<script src="../assets/js/analytics.min.js" defer></script>
```

## Automatic Tracking

### Page Views

Tracked automatically on page load.

**Event Name:** `page_view`

**Data Tracked:**
```javascript
{
  page_title: "Think Different - Gemini AI",
  page_location: "https://example.com/pages/apple-inspired.html",
  page_path: "/pages/apple-inspired.html",
  page_referrer: "https://google.com" // or "(direct)"
}
```

### CTA Clicks

All buttons with these classes are tracked automatically:
- `.cta-button`
- `.btn`
- `[data-cta]` attribute

**Event Name:** `cta_click`

**Data Tracked:**
```javascript
{
  cta_text: "Try Gemini Free",
  cta_location: "hero-section",
  page_path: "/pages/apple-inspired.html"
}
```

**Example HTML:**
```html
<!-- Automatically tracked -->
<button class="cta-button">Try Gemini Free</button>

<!-- Custom location -->
<button class="btn" data-cta="pricing-section">Start Now</button>
```

### Scroll Depth

Tracked at 25%, 50%, 75%, and 100% of page scroll.

**Event Name:** `scroll_depth`

**Data Tracked:**
```javascript
{
  depth_percentage: 75,
  page_path: "/pages/apple-inspired.html"
}
```

### Time on Page

Tracked at 10s, 30s, 60s, 120s, and 300s.

**Event Name:** `time_on_page`

**Data Tracked:**
```javascript
{
  time_seconds: 60,
  page_path: "/pages/apple-inspired.html"
}
```

### Outbound Links

External links are tracked automatically when clicked.

**Event Name:** `outbound_link`

**Data Tracked:**
```javascript
{
  link_url: "https://gemini.google.com",
  link_domain: "gemini.google.com",
  page_path: "/pages/apple-inspired.html"
}
```

### Page Exit

Tracked when user leaves the page.

**Event Name:** `page_exit`

**Data Tracked:**
```javascript
{
  time_on_page: 145, // seconds
  max_scroll_depth: 87, // percentage
  page_path: "/pages/apple-inspired.html"
}
```

## Manual Tracking

### Custom Events

Track any custom event:

```javascript
// Basic event
trackEvent('button_hover', {
  button_id: 'signup-button'
});

// Complex event
geminiAnalytics.trackEvent('feature_interaction', {
  feature_name: 'workspace-integration',
  interaction_type: 'demo_click',
  user_segment: 'operators'
});
```

### Form Submissions

Track form submissions:

```javascript
// Simple tracking
trackForm('newsletter-signup');

// With additional data
trackForm('contact-form', {
  form_type: 'enterprise',
  fields_completed: 5
});

// In your form handler
document.querySelector('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();

  trackForm('contact-form', {
    inquiry_type: document.querySelector('#inquiry-type').value
  });

  // Submit form
});
```

### Video Interactions

Track video play, pause, and completion:

```javascript
const video = document.querySelector('#hero-video');

// Play
video.addEventListener('play', () => {
  trackVideo('play', 'hero-video');
});

// Pause
video.addEventListener('pause', () => {
  const progress = (video.currentTime / video.duration) * 100;
  trackVideo('pause', 'hero-video', progress);
});

// Complete
video.addEventListener('ended', () => {
  trackVideo('complete', 'hero-video', 100);
});
```

### Search Queries

Track search interactions:

```javascript
document.querySelector('#search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.querySelector('#search-input').value;

  geminiAnalytics.trackSearch(query);
});
```

## Events Reference

### Standard Events

| Event Name | Trigger | Data Tracked |
|------------|---------|--------------|
| `page_view` | Page load | Title, URL, path, referrer |
| `cta_click` | CTA button click | Button text, location, path |
| `scroll_depth` | Scroll milestone | Percentage, path |
| `time_on_page` | Time threshold | Seconds, path |
| `outbound_link` | External link click | URL, domain, path |
| `page_exit` | Page unload | Time, scroll depth, path |

### Custom Events

| Event Name | Use Case | Example Data |
|------------|----------|--------------|
| `form_submission` | Form submitted | Form name, type, fields |
| `video_interaction` | Video play/pause/end | Action, name, progress |
| `search` | Search query | Search term, path |
| *custom* | Any custom event | Any custom data |

### Event Data Structure

All events include these common fields:
```javascript
{
  event: 'event_name',           // Event name
  page_path: '/pages/...',       // Current page
  timestamp: 1234567890,         // Unix timestamp (GA4 adds this)
  // ... event-specific data
}
```

## JavaScript API

### Global Instance

```javascript
// Access the global analytics instance
window.geminiAnalytics
```

### Global Helper Functions

```javascript
// Track custom event
trackEvent('event_name', { key: 'value' });

// Track CTA click
trackCTA('Button Text', 'section-id');

// Track form submission
trackForm('form-name', { extra: 'data' });

// Track video interaction
trackVideo('play', 'video-name', 0);
```

### Instance Methods

```javascript
// Get analytics report
const report = geminiAnalytics.getReport();
console.log(report);
// {
//   initialized: true,
//   doNotTrack: false,
//   timeOnPage: 145,
//   maxScrollDepth: 87,
//   scrollDepthsTracked: [25, 50, 75],
//   timeThresholdsTracked: [10, 30, 60, 120]
// }

// Enable debug mode
geminiAnalytics.enableDebug();

// Disable debug mode
geminiAnalytics.disableDebug();

// Track custom event
geminiAnalytics.trackEvent('my_event', { data: 'value' });

// Track CTA click
geminiAnalytics.trackCTAClick('Button Text', 'location');

// Track scroll depth
geminiAnalytics.trackScrollDepth(75);

// Track time on page
geminiAnalytics.trackTimeOnPage(60);

// Track form submission
geminiAnalytics.trackFormSubmission('form-name', { type: 'contact' });

// Track video interaction
geminiAnalytics.trackVideo('play', 'hero-video', 0);

// Track outbound link
geminiAnalytics.trackOutboundLink('https://example.com');

// Track search
geminiAnalytics.trackSearch('gemini features');
```

## Privacy & Compliance

### Do Not Track

The analytics library respects the "Do Not Track" browser setting:

```javascript
// Check DNT status
const report = geminiAnalytics.getReport();
console.log('DNT Enabled:', report.doNotTrack);
```

**How it works:**
1. Checks `navigator.doNotTrack` and `window.doNotTrack`
2. If DNT is enabled, no events are sent to GA4
3. Debug logging still works (if enabled)

### IP Anonymization

GA4 is configured to anonymize IP addresses:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

### Secure Cookies

Cookies are set with secure flags:

```javascript
{
  'cookie_flags': 'SameSite=None;Secure'
}
```

### GDPR Compliance

For GDPR compliance, you may need to:

1. **Add a cookie consent banner** (not included)
2. **Disable analytics by default** until consent given
3. **Provide opt-out mechanism**

Example consent implementation:

```javascript
// Disable analytics by default
if (!localStorage.getItem('analytics-consent')) {
  // Don't initialize until consent given
  // Show cookie banner
}

// After consent
localStorage.setItem('analytics-consent', 'true');
window.location.reload(); // Reload to initialize analytics
```

## Testing

### Run Analytics Tests

```bash
# Run all analytics tests
npm run test:analytics

# Run in headed mode (see browser)
npm run test:analytics:headed
```

### Manual Testing

1. **Open browser DevTools**
2. **Enable debug mode:**
   ```javascript
   geminiAnalytics.enableDebug();
   ```
3. **Perform actions** (click buttons, scroll, etc.)
4. **Check console** for analytics events

### Test Checklist

- [ ] GA4 Measurement ID is correct
- [ ] Page view tracked on load
- [ ] CTA clicks tracked
- [ ] Scroll depth tracked (25%, 50%, 75%, 100%)
- [ ] Time thresholds tracked (10s, 30s, 60s, etc.)
- [ ] Outbound links tracked
- [ ] Page exit tracked
- [ ] Do Not Track respected
- [ ] Events appear in GA4 Real-Time reports

### GA4 Real-Time Testing

1. Open [Google Analytics](https://analytics.google.com/)
2. Go to **Reports** > **Real-time**
3. Open your landing page in another tab
4. Verify events appear in real-time:
   - Page view
   - CTA clicks
   - Scroll events
   - Time events

## Troubleshooting

### Events Not Appearing in GA4

**Problem:** Events not showing up in Google Analytics.

**Solutions:**

1. **Check Measurement ID:**
   ```bash
   grep "G-" pages/apple-inspired.html
   ```
   Verify it matches your GA4 property.

2. **Check GA4 Real-Time:**
   - Events may take 24-48 hours for standard reports
   - Check Real-Time reports for immediate verification

3. **Check Browser Console:**
   ```javascript
   geminiAnalytics.enableDebug();
   ```
   Verify events are being sent.

4. **Check Do Not Track:**
   ```javascript
   geminiAnalytics.getReport().doNotTrack
   ```
   If `true`, analytics is disabled.

### Debug Mode Not Working

**Problem:** No console logs even with debug enabled.

**Solutions:**

1. **Enable debug mode:**
   ```javascript
   geminiAnalytics.enableDebug();
   ```

2. **Check if analytics loaded:**
   ```javascript
   console.log(window.geminiAnalytics);
   ```

3. **Check console filter:**
   - Ensure console filter is set to "All levels"
   - Look for `[Analytics]` prefix

### Scroll Depth Not Tracking

**Problem:** Scroll events not firing.

**Solutions:**

1. **Page must be scrollable:**
   - Page height must exceed viewport height
   - Check with: `document.documentElement.scrollHeight > window.innerHeight`

2. **Check if already tracked:**
   ```javascript
   geminiAnalytics.getReport().scrollDepthsTracked
   ```

3. **Scroll slowly:**
   - Scroll events use requestAnimationFrame
   - Scroll slowly to ensure detection

### CTA Clicks Not Tracking

**Problem:** Button clicks not being tracked.

**Solutions:**

1. **Check button classes:**
   Buttons must have one of:
   - `class="cta-button"`
   - `class="btn"`
   - `data-cta="section-name"`

2. **Check event listener:**
   ```javascript
   // Add to button
   onclick="trackCTA('Button Text', 'location')"
   ```

3. **Verify in console:**
   ```javascript
   geminiAnalytics.enableDebug();
   // Click button, check console
   ```

## Best Practices

### 1. Use Descriptive Event Names

✅ **Good:**
```javascript
trackEvent('workspace_demo_clicked', { demo_type: 'gmail' });
```

❌ **Bad:**
```javascript
trackEvent('click', { type: 'demo' });
```

### 2. Include Context in Event Data

✅ **Good:**
```javascript
trackCTA('Try Gemini Free', 'hero-section');
```

❌ **Bad:**
```javascript
trackCTA('Click here');
```

### 3. Track User Flow

```javascript
// Landing
trackEvent('user_flow', { step: 'landed', source: 'social' });

// Interaction
trackEvent('user_flow', { step: 'interacted', action: 'demo_click' });

// Conversion
trackEvent('user_flow', { step: 'converted', type: 'signup' });
```

### 4. Use Custom Dimensions

```javascript
trackEvent('page_view', {
  user_segment: 'writers',      // Target audience
  campaign_variant: 'A',         // A/B test variant
  traffic_source: 'facebook'     // Traffic source
});
```

### 5. Avoid Over-Tracking

❌ **Don't track:**
- Every mouse movement
- Every hover
- Rapid repeated events

✅ **Do track:**
- Meaningful interactions
- Conversion events
- User journey milestones

### 6. Test Before Deploying

```bash
# Always test locally first
npm run test:analytics

# Check GA4 Real-Time reports
# Verify events before pushing to production
```

### 7. Monitor Performance

```javascript
// Check analytics impact
const report = geminiAnalytics.getReport();
console.log('Time on page:', report.timeOnPage);
console.log('Events tracked:',
  report.scrollDepthsTracked.length +
  report.timeThresholdsTracked.length
);
```

### 8. Document Custom Events

Always document custom events in your code:

```javascript
/**
 * Track workspace integration demo interaction
 * @param {string} appName - Name of Google Workspace app (Gmail, Docs, etc.)
 * @param {string} action - User action (click, hover, play)
 */
function trackWorkspaceDemo(appName, action) {
  trackEvent('workspace_demo', {
    app: appName,
    action: action,
    segment: 'operators'
  });
}
```

---

## Summary

The analytics tracking system provides:

✅ **Comprehensive Tracking**: Page views, clicks, scrolling, time, exits
✅ **Privacy-First**: Respects DNT, anonymizes IPs, secure cookies
✅ **Easy to Use**: Automatic tracking + simple API
✅ **Production Ready**: Works with GA4, fallback logging
✅ **Well Tested**: Automated tests, manual verification
✅ **Well Documented**: Complete guide with examples

### Quick Links

- **Library**: `assets/js/analytics.js`
- **Setup Script**: `scripts/add-analytics.js`
- **Tests**: `tests/analytics.spec.js`
- **Google Analytics**: https://analytics.google.com/

### Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Enable debug mode: `geminiAnalytics.enableDebug()`
3. Check browser console for errors
4. Verify GA4 setup in Google Analytics

---

**Version**: 1.0.0
**Last Updated**: 2026-02-01
**Compatibility**: GitHub Pages, Modern Browsers, GA4
