# Playwright Testing Documentation

## Overview

This directory contains automated tests for the Gemini Ads landing pages using Playwright. The test suite covers:

- **Visual regression testing** - Screenshot comparison across browsers and viewports
- **Accessibility testing** - WCAG compliance, keyboard navigation, screen readers
- **Performance testing** - Load times, file sizes, animation performance
- **Cross-browser testing** - Chrome, Firefox, Safari (WebKit)
- **Responsive testing** - Mobile, tablet, and desktop viewports

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Install Playwright

```bash
# Install Playwright and dependencies
npm install

# Install Playwright browsers
npx playwright install chromium firefox webkit

# Install system dependencies (Linux only)
npx playwright install-deps
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test tests/smoke.spec.js

# Run tests for specific browser
npx playwright test --project=chromium-desktop

# Run tests in debug mode
npx playwright test --debug
```

### Screenshot Generation

```bash
# Generate screenshots (update snapshots)
npm run test:screenshot

# Or manually
npx playwright test --update-snapshots
```

### Viewing Reports

```bash
# Open HTML report
npx playwright show-report test-results/html-report

# View JSON results
cat test-results/results.json
```

## Test Structure

### Test Files

- `smoke.spec.js` - Basic smoke tests to verify Playwright setup
- `test-utils.js` - Reusable helper functions for testing
- `screenshot-*.spec.js` - Screenshot generation tests
- `*-test.html` - HTML test fixtures
- `*.spec.js` - Individual page test suites

### Test Utilities (`test-utils.js`)

Common helper functions available:

```javascript
const {
  VIEWPORTS,              // Viewport configurations
  FINAL_PAGES,            // List of 10 final landing pages
  waitForPageLoad,        // Wait for full page load
  captureScreenshot,      // Capture single screenshot
  captureMultiViewportScreenshots, // Capture at multiple sizes
  testAccessibility,      // Run accessibility checks
  testResponsiveBreakpoints, // Test responsive behavior
  testAnimationPerformance, // Check animation performance
  getPerformanceMetrics,  // Get page performance data
  assertPerformanceTargets, // Assert performance goals
  waitForImages,          // Wait for all images to load
  setupConsoleErrorTracking, // Track console errors
  testCTAButtons,         // Test CTA buttons
} = require('./test-utils');
```

## Configuration

The Playwright configuration is in `playwright.config.js` at the project root.

### Projects (Browser/Viewport Combinations)

The config includes multiple test projects:

**Desktop Browsers:**
- `chromium-desktop` - Chrome on 1920x1080
- `firefox-desktop` - Firefox on 1920x1080
- `webkit-desktop` - Safari on 1920x1080

**Tablets:**
- `tablet-ipad` - iPad Pro (1024x1366)
- `tablet-landscape` - iPad Pro landscape (1366x1024)

**Mobile:**
- `mobile-chrome` - Pixel 5 (393x851)
- `mobile-safari` - iPhone 13 Pro (390x844)
- `mobile-samsung` - Galaxy S9+ (412x846)
- `small-mobile` - iPhone SE (375x667)

**Special:**
- `large-desktop` - 2560x1440 (ultra-wide)
- `screenshot-*` - Dedicated screenshot projects

### Running Specific Projects

```bash
# Run only mobile tests
npx playwright test --project=mobile-chrome

# Run all mobile projects
npx playwright test --project=mobile-*

# Run desktop browsers only
npx playwright test --project=chromium-desktop --project=firefox-desktop

# Run screenshot projects
npx playwright test --project=screenshot-*
```

## Writing Tests

### Example: Basic Page Test

```javascript
const { test, expect } = require('@playwright/test');
const { waitForPageLoad, testAccessibility } = require('./test-utils');

test.describe('My Landing Page', () => {
  test('should load and be accessible', async ({ page }) => {
    await page.goto('/pages/my-page.html');
    await waitForPageLoad(page);

    // Test accessibility
    await testAccessibility(page);

    // Take screenshot
    await page.screenshot({ path: 'screenshots/my-page.png' });
  });
});
```

### Example: Screenshot Test

```javascript
const { test } = require('@playwright/test');
const { captureMultiViewportScreenshots } = require('./test-utils');

test('should capture screenshots', async ({ page }) => {
  await page.goto('/pages/my-page.html');

  await captureMultiViewportScreenshots(page, 'my-page', [
    'mobile',
    'tablet',
    'desktop',
  ]);
});
```

### Example: Performance Test

```javascript
const { test, expect } = require('@playwright/test');
const { assertPerformanceTargets } = require('./test-utils');

test('should meet performance targets', async ({ page }) => {
  await page.goto('/pages/my-page.html');

  const metrics = await assertPerformanceTargets(page, {
    maxLoadTime: 2000,        // 2 seconds
    maxFirstContentfulPaint: 1000, // 1 second
    maxTransferSize: 50000,   // 50 KB
  });

  console.log('Performance:', metrics);
});
```

## CI/CD Integration

The test suite is designed to run in CI environments:

```bash
# Set CI environment variable
CI=true npx playwright test

# This will:
# - Run with 1 worker (reduce resource usage)
# - Retry failed tests 2 times
# - Fail build if test.only is found
```

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/
```

## Debugging

### Visual Debugging

```bash
# Run in headed mode to see browser
npx playwright test --headed

# Run with slow motion
npx playwright test --headed --slow-mo=1000

# Run specific test in debug mode
npx playwright test tests/smoke.spec.js --debug
```

### Trace Viewer

Traces are automatically captured on first retry. To view:

```bash
# Show trace for failed test
npx playwright show-trace test-results/traces/trace.zip
```

### Screenshots and Videos

- Screenshots on failure: Saved to `test-results/artifacts/`
- Videos on failure: Saved to `test-results/artifacts/`
- Full page screenshots: Saved to `screenshots/`

## Best Practices

1. **Always use `waitForPageLoad()`** before assertions
2. **Track console errors** with `setupConsoleErrorTracking()`
3. **Use semantic selectors** (role, text, label) over CSS selectors
4. **Test at multiple viewports** for responsive pages
5. **Disable animations** for screenshots with `animations: 'disabled'`
6. **Assert performance** for all landing pages
7. **Check accessibility** for WCAG compliance
8. **Reuse test utilities** to avoid duplication

## Troubleshooting

### Browsers not installed

```bash
npx playwright install chromium firefox webkit
```

### System dependencies missing (Linux)

```bash
npx playwright install-deps
```

### Port 8080 already in use

```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use a different port in playwright.config.js
```

### Tests timing out

Increase timeout in `playwright.config.js`:

```javascript
timeout: 60 * 1000, // 60 seconds
```

### Screenshots don't match

Update snapshots:

```bash
npx playwright test --update-snapshots
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Final 10 Landing Pages

The following pages are tested:

1. **Think Different** - `/pages/think-different.html`
2. **Workspace Infinity** - `/pages/workspace-infinity.html`
3. **Truth Matters** - `/pages/truth-matters.html`
4. **Love Letter** - `/pages/love-letter.html`
5. **Secret Weapon** - `/pages/secret-weapon.html`
6. **Pro** - `/pages/pro.html`
7. **Email Savior** - `/pages/email-savior.html`
8. **Meeting Notes Magic** - `/pages/meeting-notes-magic.html`
9. **The Writer's Room** - `/pages/writer-room.html`
10. **Workflow Wizard** - `/pages/workflow-wizard.html`

All tests should cover these pages across all viewports and browsers.
