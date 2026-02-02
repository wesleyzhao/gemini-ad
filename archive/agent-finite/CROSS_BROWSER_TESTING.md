# Cross-Browser Testing Guide

## Overview

This document describes the cross-browser testing infrastructure for the Gemini Ads landing pages. Our testing suite ensures compatibility across all major browsers and devices.

## Supported Browsers

### ✅ Fully Tested Browsers

1. **Chromium-based browsers** (Chrome, Edge, Opera)
   - Latest stable version
   - Auto-updating rendering engine
   - Excellent CSS Grid, Flexbox, and modern JavaScript support

2. **Firefox**
   - Latest stable version
   - Gecko rendering engine
   - Strong standards compliance

3. **Safari (WebKit)**
   - Latest stable version (macOS and iOS)
   - WebKit rendering engine
   - Mobile Safari compatibility

## Testing Infrastructure

### Automated Testing Script

Location: `scripts/cross-browser-test.js`

The script tests all 25 landing pages across:
- **3 browsers**: Chromium, Firefox, WebKit (Safari)
- **3 viewports**: Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)
- **Total tests**: 225 test cases (25 pages × 3 browsers × 3 viewports)

### What We Test

#### 1. Page Load & HTTP Status
- ✅ Page loads successfully (HTTP 200)
- ✅ No network errors
- ✅ Resources load correctly

#### 2. JavaScript Compatibility
- ✅ No JavaScript errors in console
- ✅ No page errors or exceptions
- ✅ Event handlers work correctly
- ✅ Animations run smoothly

#### 3. CSS Rendering
- ✅ Stylesheets load correctly
- ✅ CSS rules apply properly
- ✅ Layout renders as expected
- ✅ No horizontal scrollbars
- ✅ Elements don't overflow viewport

#### 4. Core Web Vitals
- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ First Input Delay (FID) < 100ms
- ✅ Cumulative Layout Shift (CLS) < 0.1

#### 5. Critical UI Elements
- ✅ H1 heading renders correctly
- ✅ CTA buttons are visible and clickable
- ✅ Main content area displays properly
- ✅ Navigation elements work

#### 6. Responsive Design
- ✅ Mobile layout (375px width)
- ✅ Tablet layout (768px width)
- ✅ Desktop layout (1920px width)
- ✅ No horizontal overflow
- ✅ Touch targets are appropriately sized

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install
```

### Run Cross-Browser Tests

```bash
# Run all cross-browser tests
npm run test:cross-browser

# Or run directly with Node
node scripts/cross-browser-test.js
```

### Test Output

The script generates:

1. **Console output** with real-time test results
2. **Screenshots** for visual comparison (`screenshots/cross-browser/`)
3. **JSON report** with detailed results (`test-results/cross-browser-test-results.json`)
4. **HTML report** for easy viewing (`test-results/cross-browser-test-results.html`)

### Screenshots

Screenshots are organized by browser:

```
screenshots/cross-browser/
├── chromium/
│   ├── apple-inspired_mobile.png
│   ├── apple-inspired_tablet.png
│   ├── apple-inspired_desktop.png
│   └── ...
├── firefox/
│   └── ...
└── webkit/
    └── ...
```

## Browser-Specific Considerations

### Chromium (Chrome, Edge)

**Strengths:**
- Excellent modern web standards support
- Best DevTools for debugging
- Strong performance

**Known Issues:**
- None identified

**Special CSS:**
```css
/* Chromium-specific fixes (if needed) */
@supports (-webkit-appearance: none) {
  /* Chromium-only styles */
}
```

### Firefox

**Strengths:**
- Excellent standards compliance
- Strong privacy features
- Good developer tools

**Known Issues:**
- Slightly different font rendering
- Some CSS filters may render differently

**Special CSS:**
```css
/* Firefox-specific fixes (if needed) */
@-moz-document url-prefix() {
  /* Firefox-only styles */
}
```

### Safari (WebKit)

**Strengths:**
- Excellent mobile performance
- Good battery efficiency
- Strong iOS integration

**Known Issues:**
- More conservative with new features
- Requires `-webkit-` prefixes for some features
- Date input styling differs

**Special CSS:**
```css
/* Safari-specific fixes (if needed) */
@supports (-webkit-backdrop-filter: blur(1px)) {
  /* Safari-only styles */
}

/* iOS Safari specific */
@supports (-webkit-touch-callout: none) {
  /* iOS Safari styles */
}
```

## CSS Compatibility

### Vendor Prefixes

All CSS uses appropriate vendor prefixes for maximum compatibility:

```css
/* Example: Backdrop filter with prefixes */
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);

/* Example: Transform with prefixes */
-webkit-transform: translateY(-50%);
-moz-transform: translateY(-50%);
transform: translateY(-50%);

/* Example: Transition with prefixes */
-webkit-transition: all 0.3s ease;
-moz-transition: all 0.3s ease;
transition: all 0.3s ease;
```

### Feature Detection

Use feature detection instead of browser detection:

```javascript
// Good: Feature detection
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback
}

// Bad: Browser detection
if (navigator.userAgent.includes('Chrome')) {
  // Don't do this
}
```

## JavaScript Compatibility

### ES6+ Features

All JavaScript uses modern ES6+ features with appropriate fallbacks:

```javascript
// Arrow functions
const myFunction = () => {};

// Const/let (no var)
const element = document.querySelector('.hero');

// Template literals
const message = `Hello, ${name}!`;

// Spread operator
const newArray = [...oldArray];

// Destructuring
const { width, height } = element.getBoundingClientRect();
```

### Browser APIs

Use modern browser APIs with feature detection:

```javascript
// Intersection Observer (with fallback)
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(callback);
  observer.observe(element);
}

// Fetch API (widely supported)
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data));
```

## Mobile Testing

### iOS Safari

**Special Considerations:**
- Test on actual iOS devices when possible
- 100vh can be problematic (address bar)
- Touch events differ from desktop

**CSS Fixes:**
```css
/* Fix iOS Safari 100vh issue */
.fullscreen {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

/* Prevent iOS text size adjustment */
html {
  -webkit-text-size-adjust: 100%;
}

/* Remove iOS input shadows */
input, textarea {
  -webkit-appearance: none;
  border-radius: 0;
}
```

### Android Chrome

**Special Considerations:**
- More consistent with desktop Chrome
- Good standards support
- Test on various screen sizes

## Performance Testing

### Core Web Vitals Thresholds

- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1

### Testing Commands

```bash
# Run performance audit
npm run perf:audit

# Run cross-browser with performance metrics
npm run test:cross-browser
```

## Debugging

### Browser DevTools

**Chrome DevTools:**
- F12 or Cmd+Option+I (Mac)
- Device toolbar for mobile testing
- Network tab for performance
- Lighthouse for audits

**Firefox DevTools:**
- F12 or Cmd+Option+I (Mac)
- Responsive design mode
- Network monitor
- Accessibility inspector

**Safari DevTools:**
- Enable in Preferences > Advanced
- Cmd+Option+I (Mac)
- Responsive design mode
- Timeline for performance

### Common Issues

#### Issue: Horizontal scrollbar on mobile

**Solution:**
```css
html, body {
  overflow-x: hidden;
  max-width: 100%;
}

* {
  max-width: 100%;
}
```

#### Issue: Animations not working in Safari

**Solution:**
```css
/* Add -webkit- prefix */
@-webkit-keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Issue: Font rendering differs between browsers

**Solution:**
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Cross-Browser Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npm run test:cross-browser
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: test-results
          path: test-results/
```

## Accessibility Testing

Cross-browser testing includes accessibility checks:

```bash
# Run accessibility audit
npm run a11y:audit

# Run accessibility tests in all browsers
npm run a11y:test
```

## Best Practices

### 1. Test Early, Test Often
- Run cross-browser tests before each commit
- Automate testing in CI/CD pipeline
- Test on real devices when possible

### 2. Use Feature Detection
- Don't use browser detection
- Use `@supports` for CSS features
- Use `if ('feature' in window)` for JavaScript

### 3. Progressive Enhancement
- Build for the most limited browser first
- Add enhancements for modern browsers
- Ensure core functionality works everywhere

### 4. Mobile First
- Design for mobile first
- Add desktop features progressively
- Test on various screen sizes

### 5. Performance Matters
- Optimize for all browsers
- Test Core Web Vitals
- Monitor performance regressions

## Troubleshooting

### Tests Failing

1. **Check browser versions**: Ensure Playwright browsers are up to date
   ```bash
   npx playwright install
   ```

2. **Check local server**: Ensure server is running on port 8080
   ```bash
   npx http-server -p 8080
   ```

3. **Check console output**: Look for specific error messages

4. **View HTML report**: Open `test-results/cross-browser-test-results.html`

5. **Compare screenshots**: Check visual differences in `screenshots/cross-browser/`

### Specific Browser Issues

**Chromium fails but others pass:**
- Check for Chrome-specific CSS or JavaScript
- Review console errors in Chrome DevTools

**Firefox fails but others pass:**
- Check for vendor prefixes
- Review Gecko-specific rendering issues

**WebKit fails but others pass:**
- Check for Safari-specific issues
- Add `-webkit-` prefixes where needed
- Test on actual Safari if possible

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference
- [Can I Use](https://caniuse.com/) - Browser feature support tables
- [Playwright Docs](https://playwright.dev/) - Testing framework docs

### Browser DevTools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Firefox DevTools](https://firefox-source-docs.mozilla.org/devtools-user/)
- [Safari Web Inspector](https://webkit.org/web-inspector/)

### Testing Tools
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [Sauce Labs](https://saucelabs.com/) - Cross-browser testing platform
- [LambdaTest](https://www.lambdatest.com/) - Browser testing platform

## Support Matrix

| Browser | Version | Mobile | Tablet | Desktop | Status |
|---------|---------|--------|--------|---------|--------|
| Chrome  | Latest  | ✅ | ✅ | ✅ | Fully Supported |
| Firefox | Latest  | ✅ | ✅ | ✅ | Fully Supported |
| Safari  | Latest  | ✅ | ✅ | ✅ | Fully Supported |
| Edge    | Latest  | ✅ | ✅ | ✅ | Fully Supported |
| Opera   | Latest  | ✅ | ✅ | ✅ | Should work (Chromium-based) |

## Changelog

### 2026-02-01
- ✅ Initial cross-browser testing infrastructure
- ✅ Automated testing across 3 browsers × 3 viewports
- ✅ Screenshot generation for visual comparison
- ✅ HTML and JSON reporting
- ✅ Core Web Vitals monitoring
- ✅ 225 automated test cases

---

**Last Updated:** 2026-02-01
**Maintained By:** Gemini Ads Team
