# Visual Regression Testing Guide

## Overview

This guide covers visual regression testing for all 10 Gemini Ads landing pages. Visual regression testing automatically detects unintended visual changes by comparing screenshots against baseline images.

## What is Visual Regression Testing?

Visual regression testing captures screenshots of your web pages and compares them pixel-by-pixel against baseline screenshots. When visual changes are detected, the tests fail and generate diff images highlighting the differences.

**Benefits:**
- ✅ Detect unintended visual changes automatically
- ✅ Catch CSS regressions before deployment
- ✅ Ensure design consistency across pages
- ✅ Verify responsive design at multiple viewports
- ✅ Test cross-browser rendering consistency
- ✅ Document visual changes over time

## Test Coverage

Our visual regression test suite covers:

### 1. **Full-Page Screenshots** (30 total)
   - Mobile viewport: 375×812 (iPhone 13)
   - Tablet viewport: 768×1024 (iPad)
   - Desktop viewport: 1920×1080 (Standard)
   - All 10 pages at each viewport

### 2. **Hero Section Screenshots** (10 total)
   - Above-fold content only (desktop viewport)
   - Critical for A/B testing headlines and CTAs
   - Fast iteration on hero text changes

### 3. **CTA Button Screenshots** (10 total)
   - Primary call-to-action buttons
   - Ensures consistent button styling
   - Verifies hover states and interactions

### 4. **Animation State Screenshots** (8 total)
   - Before and after animation states
   - 4 pages with notable animations:
     - Email Savior
     - Meeting Notes Magic
     - The Writer's Room
     - Workflow Wizard

### 5. **Responsive Breakpoint Screenshots** (20 total)
   - Small mobile: 320×568 (iPhone SE)
   - Large desktop: 2560×1440 (Ultra-wide)
   - Tests edge cases and extreme viewports

### 6. **Cross-Browser Screenshots** (30+ total)
   - Chromium (Chrome, Edge, Brave)
   - Firefox (Gecko engine)
   - WebKit (Safari)
   - Detects browser-specific rendering issues

**Total: 108+ screenshot comparisons per test run**

## Prerequisites

### 1. Install Playwright (if not already installed)

```bash
npm install --save-dev @playwright/test
npx playwright install chromium firefox webkit
```

### 2. Install System Dependencies (Linux)

If on Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libcairo2 \
  libasound2
```

### 3. Start Local Server

The test suite requires a local server running on port 8080. This is handled automatically by `playwright.config.js`, but you can also start it manually:

```bash
# Auto-start (recommended)
npm run test:visual

# Manual start (if needed)
npx http-server -p 8080 &
npm run test:visual
```

## Running Visual Regression Tests

### Basic Commands

```bash
# Run all visual regression tests
npm run test:visual

# Run tests for a specific browser
npx playwright test visual-regression.spec.js --project=chromium
npx playwright test visual-regression.spec.js --project=firefox
npx playwright test visual-regression.spec.js --project=webkit

# Run specific test group
npx playwright test visual-regression.spec.js --grep "Mobile Viewport"
npx playwright test visual-regression.spec.js --grep "Hero Sections"
npx playwright test visual-regression.spec.js --grep "CTA Buttons"

# Run tests in headed mode (watch in browser)
npx playwright test visual-regression.spec.js --headed

# Run tests in UI mode (interactive)
npx playwright test visual-regression.spec.js --ui

# Run tests with more workers (parallel)
npx playwright test visual-regression.spec.js --workers=4
```

### First Run: Creating Baselines

The **first time** you run visual regression tests, Playwright will create baseline screenshots:

```bash
npm run test:visual
```

Expected output:
```
Running 108 tests using 4 workers

✓ Visual Regression - Mobile Viewport > Think Different - Mobile Full Page (2.3s)
✓ Visual Regression - Mobile Viewport > Workspace Infinity - Mobile Full Page (2.1s)
...

108 passed (3m 45s)
```

Baseline screenshots are saved to:
```
tests/visual-regression.spec.js-snapshots/
├── think-different-mobile-full.png
├── think-different-tablet-full.png
├── think-different-desktop-full.png
├── think-different-hero-desktop.png
├── think-different-cta-button.png
├── think-different-before-animation.png
├── think-different-after-animation.png
├── think-different-small-mobile.png
├── think-different-large-desktop.png
├── think-different-chromium.png
├── think-different-firefox.png
├── think-different-webkit.png
└── [Same for all 10 pages...]
```

### Subsequent Runs: Detecting Changes

After baselines are created, subsequent test runs will **compare** against these baselines:

```bash
npm run test:visual
```

If no changes:
```
✓ All 108 tests passed
```

If changes detected:
```
✗ Visual Regression - Desktop Viewport > Think Different - Desktop Full Page (2.1s)

Expected: tests/.../think-different-desktop-full.png
Received: tests/.../think-different-desktop-full-actual.png
Diff: tests/.../think-different-desktop-full-diff.png

1234 pixels differ (0.05% of total)
```

### Updating Baselines (After Intentional Changes)

When you intentionally change designs, update the baselines:

```bash
# Update all baselines
npm run test:visual -- --update-snapshots

# Update specific test group
npx playwright test visual-regression.spec.js --grep "Mobile" --update-snapshots

# Update specific page
npx playwright test visual-regression.spec.js --grep "Think Different" --update-snapshots
```

**⚠️ Warning:** Only update baselines when you've intentionally changed designs. Updating baselines on unintended changes will hide visual regressions!

## Understanding Test Results

### Passing Tests ✅

```
✓ Visual Regression - Mobile Viewport > Think Different - Mobile Full Page (2.3s)
```

The screenshot matches the baseline within the configured tolerance.

### Failing Tests ❌

```
✗ Visual Regression - Desktop Viewport > Think Different - Desktop Full Page (2.1s)

Error: Screenshot comparison failed:
  1234 pixels (ratio 0.0005 of all image pixels) are different.

Expected: tests/.../think-different-desktop-full.png
Received: tests/.../think-different-desktop-full-actual.png
Diff: tests/.../think-different-desktop-full-diff.png
```

**What it means:**
- **Expected:** The baseline screenshot (what it should look like)
- **Received:** The current screenshot (what it actually looks like)
- **Diff:** A visual diff highlighting changes (red = differences)

**What to do:**
1. Open the diff image to see what changed
2. Determine if the change was intentional or a regression
3. If intentional: Update baseline with `--update-snapshots`
4. If regression: Fix the CSS/HTML and re-run tests

### Viewing Test Reports

Playwright generates detailed HTML reports with embedded screenshots:

```bash
# Generate and open HTML report
npx playwright show-report

# Generate report without opening
npx playwright test visual-regression.spec.js --reporter=html
```

The report shows:
- ✅ Passed tests (green)
- ❌ Failed tests (red)
- 📸 Screenshot comparisons (before/after/diff)
- ⏱️ Test timing and performance
- 🌐 Browser used

## Configuration

### Visual Comparison Thresholds

Configure thresholds in `tests/visual-regression.spec.js`:

```javascript
const VISUAL_COMPARISON_CONFIG = {
  maxDiffPixels: 100,        // Max pixels that can differ
  maxDiffPixelRatio: 0.01,   // Max ratio (0-1) that can differ
  threshold: 0.2,            // Per-pixel color threshold (0-1)
};
```

**Threshold Guide:**
- `maxDiffPixels: 100` - Allows up to 100 pixels to differ (handles font rendering differences)
- `maxDiffPixelRatio: 0.01` - Allows up to 1% of pixels to differ
- `threshold: 0.2` - Pixels with < 20% color difference are ignored

**When to adjust:**
- Increase thresholds if tests are too sensitive (flaky)
- Decrease thresholds if tests miss small changes
- Start strict (low values) and loosen only if needed

### Test Viewports

Viewports are defined in `tests/visual-regression.spec.js`:

```javascript
const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 812 },   // iPhone 13
  tablet: { width: 768, height: 1024 },  // iPad
  desktop: { width: 1920, height: 1080 }, // Standard
};
```

Add custom viewports as needed for specific devices.

## Common Use Cases

### 1. Detect CSS Regressions

**Scenario:** You modify `design-system.css` and want to ensure no pages broke.

```bash
# Run visual regression tests
npm run test:visual

# If failures occur, review diffs
npx playwright show-report

# If changes are unintended, fix CSS and re-run
# If changes are intentional, update baselines
npm run test:visual -- --update-snapshots
```

### 2. Verify Responsive Design Changes

**Scenario:** You update mobile styles and want to verify all pages still work.

```bash
# Test only mobile viewport
npx playwright test visual-regression.spec.js --grep "Mobile Viewport"

# Review any failures
npx playwright show-report

# Update baselines if changes are correct
npx playwright test visual-regression.spec.js --grep "Mobile" --update-snapshots
```

### 3. Test New Feature Impact

**Scenario:** You add a new component to shared CSS. Test impact across all pages.

```bash
# Generate new screenshots
npm run test:visual

# Compare against baselines
# Any failures show which pages were affected

# Review diffs to ensure changes are expected
npx playwright show-report
```

### 4. A/B Test Hero Text

**Scenario:** You want to test different hero headlines.

```bash
# Capture current hero sections as baseline
npx playwright test visual-regression.spec.js --grep "Hero Sections"

# Make headline changes
# Re-run hero tests
npx playwright test visual-regression.spec.js --grep "Hero Sections"

# Review diffs to compare headlines
npx playwright show-report

# Revert or update baselines based on results
```

### 5. Cross-Browser Testing

**Scenario:** Verify page renders consistently in Chrome, Firefox, and Safari.

```bash
# Test all browsers
npx playwright test visual-regression.spec.js --grep "Cross-Browser"

# Test specific browser
npx playwright test visual-regression.spec.js --project=firefox

# Review browser-specific diffs
npx playwright show-report
```

### 6. Pre-Deployment Validation

**Scenario:** Before deploying, ensure no visual regressions occurred.

```bash
# Run full visual regression suite
npm run test:visual

# If all pass, safe to deploy
# If failures occur, review and fix before deploying
```

## Troubleshooting

### Issue: "Screenshot comparison failed" on first run

**Solution:** The first run creates baselines. This is expected. Run again:

```bash
npm run test:visual
```

### Issue: Tests fail due to font rendering differences

**Cause:** Different operating systems render fonts slightly differently.

**Solution 1:** Increase `threshold` value:
```javascript
threshold: 0.3,  // Allow more color variation
```

**Solution 2:** Generate baselines on the same OS as CI/CD:
```bash
# Use Docker for consistent environment
docker run --rm -v $(pwd):/work -w /work \
  mcr.microsoft.com/playwright:v1.58.1-jammy \
  npm run test:visual -- --update-snapshots
```

### Issue: Tests are flaky (sometimes pass, sometimes fail)

**Cause:** Animation timing, async content loading, or system performance.

**Solution 1:** Disable animations (already done in test suite)

**Solution 2:** Increase wait times:
```javascript
await browserPage.waitForTimeout(1000);  // Increase from 500ms
```

**Solution 3:** Increase thresholds:
```javascript
maxDiffPixels: 200,  // Allow more variation
```

### Issue: "Port 8080 already in use"

**Cause:** Another server is running on port 8080.

**Solution 1:** Stop other server:
```bash
# Find process on port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Solution 2:** Change port in `playwright.config.js`:
```javascript
webServer: {
  command: 'npx http-server -p 8081',
  port: 8081,
}
```

And update `BASE_URL` in tests:
```javascript
const BASE_URL = 'http://localhost:8081';
```

### Issue: "Browser not found" or missing dependencies

**Cause:** Playwright browsers not installed or missing system libraries.

**Solution 1:** Install Playwright browsers:
```bash
npx playwright install chromium firefox webkit
```

**Solution 2:** Install system dependencies (Linux):
```bash
npx playwright install-deps
```

**Solution 3:** Use Docker (no system deps needed):
```bash
./generate-screenshots-docker.sh all
```

### Issue: Tests are too slow

**Cause:** Running 108 tests serially.

**Solution:** Increase parallelism:
```bash
# Use more workers
npx playwright test visual-regression.spec.js --workers=8

# Run specific viewport only (faster)
npx playwright test visual-regression.spec.js --grep "Desktop Viewport"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run visual regression tests
        run: npm run test:visual

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

      - name: Upload failed screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: failed-screenshots
          path: tests/**/*-diff.png
```

### Baseline Management in CI

**Option 1: Store baselines in Git**

```bash
# Add baselines to Git
git add tests/visual-regression.spec.js-snapshots/
git commit -m "Update visual regression baselines"
git push
```

**Pros:** Versioned, easy to review changes
**Cons:** Large binary files in Git

**Option 2: Store baselines in cloud storage**

- Upload baselines to S3/GCS after approval
- Download baselines in CI before tests
- Update baselines via manual CI job

**Pros:** Keeps Git repo small
**Cons:** More complex setup

## Best Practices

### 1. ✅ Generate Baselines on Clean State

Always create baselines from a known-good state:
- After design approval
- Before major refactors
- On production-like environment

### 2. ✅ Review Diffs Carefully

Never blindly update baselines. Always:
- Open diff images
- Verify changes are intentional
- Check multiple viewports
- Test in multiple browsers

### 3. ✅ Keep Baselines in Version Control

Store baselines in Git (or cloud storage) to:
- Track visual changes over time
- Enable team collaboration
- Ensure consistent CI/CD runs

### 4. ✅ Run Tests Before Committing

Make visual regression tests part of your workflow:
```bash
# Pre-commit hook
npm run test:visual && git commit
```

### 5. ✅ Use Meaningful Baseline Names

Our naming convention:
```
{page-slug}-{viewport}-{state}.png
```

Examples:
- `think-different-mobile-full.png`
- `email-savior-before-animation.png`
- `writers-room-cta-button.png`

### 6. ✅ Test Critical Paths First

Prioritize tests for:
- Hero sections (highest visibility)
- CTA buttons (conversion critical)
- Mobile viewports (majority of traffic)

### 7. ✅ Adjust Thresholds Appropriately

Start strict and loosen only if needed:
- Development: Stricter (catch all changes)
- CI/CD: Slightly looser (avoid flakiness)
- Production: Balanced

### 8. ❌ Don't Update Baselines on Failures

If tests fail in CI:
- Investigate the cause
- Fix the regression
- Re-run tests
- Only update baselines if changes are intentional

## Next Steps

### Immediate Actions

1. **Generate Baselines**
   ```bash
   npm run test:visual
   ```

2. **Review Baselines**
   - Check `tests/visual-regression.spec.js-snapshots/`
   - Verify screenshots look correct
   - Commit baselines to Git

3. **Run Regression Tests**
   ```bash
   # Make a small CSS change
   # Re-run tests
   npm run test:visual
   # Verify change is detected
   ```

### Long-Term Integration

1. **Add to CI/CD Pipeline**
   - Integrate with GitHub Actions
   - Run on every pull request
   - Block merges on failures

2. **Create Baseline Update Workflow**
   - Define approval process
   - Create update scripts
   - Document baseline management

3. **Expand Coverage**
   - Add interaction states (hover, focus, active)
   - Add error states
   - Add loading states

4. **Performance Monitoring**
   - Track test execution time
   - Optimize slow tests
   - Parallelize more aggressively

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Our Screenshot Testing Guide](./SCREENSHOT_TESTING_GUIDE.md)
- [Test Utils Documentation](./test-utils.js)

## Summary

Visual regression testing provides:
- ✅ Automated visual quality assurance
- ✅ Catch CSS regressions before deployment
- ✅ Ensure design consistency across 10 pages
- ✅ Test responsive design at 5 viewports
- ✅ Verify cross-browser compatibility
- ✅ Enable confident refactoring

Run tests regularly and review diffs carefully to maintain high visual quality across all Gemini Ads landing pages.
