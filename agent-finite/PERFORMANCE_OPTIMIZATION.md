# Performance Optimization Guide

Comprehensive guide for performance optimization of Gemini Ads landing pages.

## Table of Contents

1. [Overview](#overview)
2. [Performance Targets](#performance-targets)
3. [Optimization Strategies](#optimization-strategies)
4. [Asset Optimization](#asset-optimization)
5. [Lazy Loading](#lazy-loading)
6. [Resource Hints](#resource-hints)
7. [Performance Monitoring](#performance-monitoring)
8. [Best Practices](#best-practices)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This project implements comprehensive performance optimizations to ensure all landing pages load quickly and provide an excellent user experience. Our goal is to achieve **sub-2-second load times** on all pages with minimal resource usage.

### Key Features

✅ **Asset Minification** - CSS and JS files compressed by ~37-51%
✅ **Lazy Loading** - Images and iframes load on-demand
✅ **Resource Hints** - DNS prefetch, preconnect, prefetch
✅ **Performance Monitoring** - Core Web Vitals tracking
✅ **Optimized Fonts** - Font-display: swap for faster text rendering
✅ **Third-Party Optimization** - Async loading of external scripts

---

## Performance Targets

### Load Time Goals

| Metric | Target | Threshold |
|--------|--------|-----------|
| **Total Load Time** | < 2.0s | ❌ > 2.5s |
| **First Contentful Paint (FCP)** | < 1.0s | ❌ > 1.5s |
| **Largest Contentful Paint (LCP)** | < 2.5s | ❌ > 4.0s |
| **First Input Delay (FID)** | < 100ms | ❌ > 300ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ❌ > 0.25 |

### Resource Size Goals

| Resource Type | Target | Threshold |
|--------------|--------|-----------|
| **Total Page Size** | < 300 KB | ❌ > 500 KB |
| **CSS (Total)** | < 50 KB | ❌ > 100 KB |
| **JavaScript (Total)** | < 50 KB | ❌ > 100 KB |
| **Images (Per Page)** | < 200 KB | ❌ > 500 KB |

---

## Optimization Strategies

### 1. Minification

All CSS and JavaScript files are minified for production use:

```bash
# Generate minified assets
npm run optimize

# This creates:
# - assets/css/*.min.css (31.64% smaller)
# - assets/js/*.min.js (51.50% smaller)
```

**Savings:**
- CSS: 61.23 KB → 41.86 KB (31.64% reduction)
- JS: 25.8 KB → 12.51 KB (51.50% reduction)
- **Total: 32.66 KB saved (37.53%)**

### 2. Production vs Development

**Development (use full files):**
```html
<link rel="stylesheet" href="../assets/css/design-system.css">
<link rel="stylesheet" href="../assets/css/components.css">
<link rel="stylesheet" href="../assets/css/animations.css">
<script src="../assets/js/animations.js"></script>
<script src="../assets/js/performance.js"></script>
```

**Production (use minified files):**
```html
<link rel="stylesheet" href="../assets/css/design-system.min.css">
<link rel="stylesheet" href="../assets/css/components.min.css">
<link rel="stylesheet" href="../assets/css/animations.min.css">
<script src="../assets/js/animations.min.js"></script>
<script src="../assets/js/performance.min.js"></script>
```

### 3. Critical CSS (Future Enhancement)

For even faster initial rendering, consider inlining critical CSS:

```html
<head>
    <style>
        /* Critical CSS - above-the-fold styles */
        /* Inline 10-15 KB of critical CSS here */
    </style>

    <!-- Load full CSS asynchronously -->
    <link rel="preload" href="assets/css/design-system.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="assets/css/design-system.min.css"></noscript>
</head>
```

---

## Asset Optimization

### Automated Asset Optimization

Run the optimization script to minify all CSS and JS files:

```bash
npm run optimize
```

**What it does:**
- ✅ Removes all comments
- ✅ Removes unnecessary whitespace
- ✅ Reduces file sizes by 30-50%
- ✅ Creates `.min.css` and `.min.js` versions
- ✅ Preserves original files for development

**Output:**
```
🎉 OPTIMIZATION COMPLETE
📊 Total Size: 87.03 KB → 54.37 KB
💾 Space Saved: 32.66 KB (37.53%)
```

### Manual Optimization Checklist

- [ ] Run `npm run optimize` before deployment
- [ ] Update HTML files to use `.min.css` and `.min.js`
- [ ] Verify all pages load correctly with minified assets
- [ ] Test on mobile devices and slow connections
- [ ] Run performance audit: `npm run perf:audit`

---

## Lazy Loading

### Image Lazy Loading

The `performance.js` script automatically lazy loads images with the `data-src` attribute:

**HTML:**
```html
<!-- Lazy load image -->
<img data-src="path/to/image.jpg"
     alt="Description"
     loading="lazy"
     class="lazy-image">

<!-- Lazy load with srcset -->
<img data-src="image-mobile.jpg"
     data-srcset="image-mobile.jpg 480w, image-tablet.jpg 768w, image-desktop.jpg 1200w"
     alt="Responsive image"
     loading="lazy">
```

**How it works:**
1. Browser-native lazy loading (if supported) via `loading="lazy"`
2. IntersectionObserver fallback for older browsers
3. Images load 200px before entering viewport
4. No layout shift - always specify width/height

### Iframe Lazy Loading

Lazy load embedded content (videos, maps, etc.):

```html
<!-- YouTube video - lazy load -->
<iframe data-src="https://www.youtube.com/embed/VIDEO_ID"
        loading="lazy"
        width="560"
        height="315"
        frameborder="0"></iframe>
```

### Background Images (CSS)

For CSS background images, use JavaScript to add them on scroll:

```html
<div class="hero-section" data-bg="hero-background.jpg"></div>

<script>
// In performance.js - automatically handles data-bg attributes
</script>
```

---

## Resource Hints

### DNS Prefetch

Resolve DNS for external domains early:

```html
<head>
    <!-- Already in pages -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
</head>
```

### Preconnect

Establish early connections to critical origins:

```html
<head>
    <!-- Already in pages -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

### Prefetch

Prefetch resources for next page navigation:

```html
<!-- performance.js automatically prefetches internal links -->
```

The performance.js script automatically:
- Detects internal links on the page
- Prefetches linked pages after 2 seconds
- Improves navigation speed

### Preload

Load critical resources early:

```html
<head>
    <!-- Preload critical CSS -->
    <link rel="preload" href="assets/css/design-system.min.css" as="style">

    <!-- Preload critical fonts -->
    <link rel="preload" href="fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

    <!-- Preload hero image -->
    <link rel="preload" href="images/hero.jpg" as="image">
</head>
```

---

## Performance Monitoring

### Automatic Monitoring

The `performance.js` script tracks Core Web Vitals automatically:

**Enable logging:**
```javascript
// In browser console
GeminiPerformance.enableLogging();

// Disable logging
GeminiPerformance.disableLogging();
```

**Metrics tracked:**
- ⏱️ Time to First Byte (TTFB)
- 🎨 First Contentful Paint (FCP)
- 🖼️ Largest Contentful Paint (LCP)
- 🖱️ First Input Delay (FID)
- 📐 Cumulative Layout Shift (CLS)
- 📊 Total resource size

### Performance Audit

Run comprehensive performance audits:

```bash
# Start local server
npm run serve

# In another terminal, run audit
npm run perf:audit
```

**Audit checks:**
- ✅ Load time < 2 seconds
- ✅ First Contentful Paint < 1 second
- ✅ Total page size < 500 KB
- ✅ CSS size < 100 KB
- ✅ JS size < 100 KB
- ✅ Layout shift < 0.1

**Output:**
```
📊 PERFORMANCE AUDIT REPORT
═══════════════════════════════════════

1. trust-citations
   ⏱️  Timing:
      Load Time: 1.2s ✅
      FCP: 0.8s ✅
   📦 Resources:
      Total Size: 245 KB ✅
      CSS: 42 KB ✅
      JS: 18 KB ✅
   🎯 Score: 5/5 checks passed
```

---

## Best Practices

### 1. Minimize HTTP Requests

✅ **Do:**
- Combine CSS files (use shared design system)
- Use CSS sprites for icons
- Inline small, critical CSS
- Use SVG for icons and graphics

❌ **Don't:**
- Load separate CSS for every component
- Use many small image files
- Import external stylesheets from multiple CDNs

### 2. Optimize Images

✅ **Do:**
- Use modern formats (WebP, AVIF with fallbacks)
- Compress images (80-85% quality)
- Use responsive images with srcset
- Lazy load below-the-fold images
- Specify width and height to prevent layout shift

```html
<!-- Good: Responsive, lazy-loaded, sized -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg"
         alt="Description"
         loading="lazy"
         width="800"
         height="600">
</picture>
```

❌ **Don't:**
- Use uncompressed images
- Load large images for small displays
- Forget width/height attributes
- Eager-load all images

### 3. Optimize Fonts

✅ **Do:**
- Use `font-display: swap` (already implemented)
- Preload critical fonts
- Use WOFF2 format
- Limit font weights and styles
- Self-host fonts when possible

```html
<!-- Good: Preloaded, optimized -->
<link rel="preload" href="fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<style>
    @font-face {
        font-family: 'Inter';
        src: url('fonts/inter-var.woff2') format('woff2');
        font-display: swap;
    }
</style>
```

❌ **Don't:**
- Load many font weights/styles
- Use font-display: block (causes invisible text)
- Load fonts from slow CDNs

### 4. Optimize JavaScript

✅ **Do:**
- Minify JS (use `npm run optimize`)
- Load non-critical JS with `defer` or `async`
- Use native browser features when possible
- Tree-shake unused code

```html
<!-- Good: Deferred, minified -->
<script src="assets/js/animations.min.js" defer></script>
<script src="assets/js/performance.min.js" defer></script>
```

❌ **Don't:**
- Load JS in `<head>` without defer/async
- Use heavy JavaScript frameworks for simple tasks
- Include unused libraries

### 5. Optimize CSS

✅ **Do:**
- Minify CSS (use `npm run optimize`)
- Remove unused CSS
- Use efficient selectors
- Leverage CSS custom properties
- Combine related stylesheets

❌ **Don't:**
- Use overly specific selectors
- Duplicate styles across files
- Include unused CSS frameworks

### 6. Reduce Layout Shifts

✅ **Do:**
- Set width and height on images/videos
- Reserve space for dynamic content
- Use CSS aspect-ratio boxes
- Preload fonts to avoid FOIT/FOUT

❌ **Don't:**
- Inject content above existing content
- Use auto dimensions for images
- Load fonts without fallbacks

---

## Testing

### Local Performance Testing

1. **Start development server:**
   ```bash
   npm run serve
   ```

2. **Run performance audit:**
   ```bash
   npm run perf:audit
   ```

3. **Check browser DevTools:**
   - Open Chrome DevTools (F12)
   - Go to "Lighthouse" tab
   - Run audit for Performance
   - Target: 90+ score

### Visual Regression Testing

```bash
# Test that optimizations don't break design
npm run test:visual
```

### Network Throttling

Test on slow connections:

1. Open Chrome DevTools (F12)
2. Network tab → Throttling dropdown
3. Select "Slow 3G" or "Fast 3G"
4. Reload page and verify load time

### Real Device Testing

Test on actual devices:
- iPhone (Safari)
- Android phone (Chrome)
- Tablet (iPad, Android tablet)
- Desktop (Chrome, Firefox, Safari, Edge)

---

## Troubleshooting

### Issue: Pages load slowly

**Diagnosis:**
```bash
npm run perf:audit
```

**Solutions:**
- Check if using minified assets (.min.css, .min.js)
- Verify images are optimized and lazy-loaded
- Check for large third-party scripts
- Enable compression on server (gzip/brotli)

### Issue: Layout shifts on load

**Diagnosis:**
- Check CLS score in performance audit
- Look for elements without dimensions

**Solutions:**
- Add width/height to all images
- Reserve space for dynamic content
- Use aspect-ratio CSS for responsive elements
- Preload critical fonts

### Issue: Fonts loading slowly

**Solutions:**
- Add `font-display: swap` (already implemented)
- Preload critical fonts
- Use system font stack as fallback
- Self-host fonts instead of CDN

### Issue: JavaScript blocking render

**Solutions:**
- Add `defer` to all non-critical scripts
- Move scripts to bottom of body
- Use `async` for independent scripts
- Inline critical JS if very small

---

## Deployment Checklist

Before deploying to GitHub Pages:

- [ ] Run `npm run optimize` to generate minified files
- [ ] Update all HTML pages to use `.min.css` and `.min.js`
- [ ] Run `npm run perf:audit` - all pages should pass
- [ ] Run `npm run test:visual` - no regressions
- [ ] Test on slow 3G network throttling
- [ ] Test on mobile device
- [ ] Verify all images have width/height
- [ ] Check Lighthouse score > 90
- [ ] Verify lazy loading works
- [ ] Test with JavaScript disabled (graceful degradation)

---

## Performance Metrics Reference

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

### Additional Metrics

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **TTFB** | < 600ms | 600ms - 1.8s | > 1.8s |
| **FCP** | < 1.8s | 1.8s - 3.0s | > 3.0s |
| **Speed Index** | < 3.4s | 3.4s - 5.8s | > 5.8s |
| **TTI** | < 3.8s | 3.8s - 7.3s | > 7.3s |

---

## Tools & Resources

### NPM Scripts

```bash
npm run optimize           # Minify CSS and JS
npm run perf:audit        # Run performance audit
npm run test:visual       # Visual regression tests
npm run serve             # Start dev server
```

### Browser Tools

- **Chrome DevTools** - Lighthouse, Performance tab
- **Firefox DevTools** - Performance monitor
- **Safari Web Inspector** - Timelines

### Online Tools

- [WebPageTest](https://www.webpagetest.org/) - Comprehensive testing
- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's tool
- [GTmetrix](https://gtmetrix.com/) - Performance report
- [web.dev/measure](https://web.dev/measure/) - Core Web Vitals

---

## Continuous Improvement

Performance optimization is an ongoing process:

1. **Monitor** - Regularly run performance audits
2. **Measure** - Track Core Web Vitals in production
3. **Optimize** - Continuously improve based on data
4. **Test** - Verify changes don't regress performance
5. **Iterate** - Repeat the cycle

**Goal:** All pages should load in < 2 seconds on 3G connections and achieve 90+ Lighthouse scores.

---

*Last updated: 2026-02-01*
*Performance optimization is a critical feature for user experience and conversion rates.*
