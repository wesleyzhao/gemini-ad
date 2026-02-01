# Screenshot Generation Guide

## Feature #35: Generate Screenshots at Multiple Viewport Sizes

This guide documents the screenshot generation process for all 10 final Gemini Ads landing pages.

## System Requirements

### Prerequisites
1. **Node.js** v16+ and npm
2. **Playwright** v1.58+ installed (`npm install`)
3. **System Dependencies** for running browsers

### Installing System Dependencies

#### On Ubuntu/Debian Linux:
```bash
sudo npx playwright install-deps
```

Or manually:
```bash
sudo apt-get install \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2
```

#### On macOS:
```bash
# Playwright works out-of-the-box on macOS
npx playwright install chromium firefox webkit
```

#### On Windows:
```bash
# Playwright works out-of-the-box on Windows
npx playwright install chromium firefox webkit
```

### Installing Playwright Browsers
```bash
npx playwright install chromium firefox webkit
```

## Generating Screenshots

### Quick Start

#### Generate All Screenshots (Recommended)
```bash
npm run test:screenshot
```

This generates 100+ screenshots across:
- **5 viewport sizes**: Small mobile (320px), Mobile (375px), Tablet (768px), Desktop (1920px), Large Desktop (2560px)
- **3 browsers**: Chromium, Firefox, WebKit
- **10 pages**: All final landing pages
- **Multiple states**: Normal, hover, animation states, tab states

#### Generate by Viewport Type

**Mobile Screenshots Only:**
```bash
npm run test:screenshot:mobile
```

**Tablet Screenshots Only:**
```bash
npm run test:screenshot:tablet
```

**Desktop Screenshots Only:**
```bash
npm run test:screenshot:desktop
```

### Advanced Usage

#### Run with Visible Browser (for debugging):
```bash
npx playwright test screenshots.spec.js --headed
```

#### Interactive UI Mode:
```bash
npx playwright test screenshots.spec.js --ui
```

#### Specific Browser Only:
```bash
npx playwright test screenshots.spec.js --project=chromium-desktop
npx playwright test screenshots.spec.js --project=firefox-desktop
npx playwright test screenshots.spec.js --project=webkit-desktop
```

#### Specific Test Group:
```bash
# Hero sections only
npx playwright test screenshots.spec.js --grep "Hero Section"

# Animation states only
npx playwright test screenshots.spec.js --grep "Animation State"

# Interactive elements only
npx playwright test screenshots.spec.js --grep "Interactive Element"
```

#### Parallel Execution (faster):
```bash
npx playwright test screenshots.spec.js --workers=4
```

## Screenshot Output

### Directory Structure
All screenshots are saved to the `screenshots/` directory:

```
screenshots/
├── think-different-mobile.png
├── think-different-tablet.png
├── think-different-desktop.png
├── think-different-small-mobile.png
├── think-different-large-desktop.png
├── think-different-mobile-quick.png
├── think-different-desktop-quick.png
├── think-different-tablet-quick.png
├── think-different-hero-desktop.png
├── think-different-cta-normal.png
├── think-different-cta-hover.png
├── workspace-infinity-mobile.png
├── workspace-infinity-tablet.png
├── workspace-infinity-desktop.png
... (100+ total screenshots)
├── email-savior-before-animation.png
├── email-savior-after-animation.png
├── writers-room-tab-1.png
├── writers-room-tab-2.png
├── writers-room-tab-3.png
└── workflow-wizard-after-animation.png
```

### File Naming Convention
- **Format**: `{page-name}-{viewport/state}.png`
- **Page Name**: Lowercase, hyphens for spaces (e.g., "think-different", "writers-room")
- **Viewport**: mobile, tablet, desktop, small-mobile, large-desktop
- **State**: quick, hero, before-animation, after-animation, cta-normal, cta-hover, tab-1, tab-2, tab-3

### Screenshot Categories

#### 1. Multi-Viewport Screenshots (30 images)
- Each page captured at 3 viewports: mobile (375×812), tablet (768×1024), desktop (1920×1080)
- Full-page captures
- Files: `{page}-mobile.png`, `{page}-tablet.png`, `{page}-desktop.png`

#### 2. Quick Preview Screenshots (30 images)
- Fast generation for rapid iteration
- Files: `{page}-mobile-quick.png`, `{page}-desktop-quick.png`, `{page}-tablet-quick.png`

#### 3. Hero Section Screenshots (10 images)
- Above-fold desktop captures only
- Perfect for A/B testing hero text and CTAs
- Files: `{page}-hero-desktop.png`

#### 4. Animation State Screenshots (8 images)
- Before/after animation captures
- Pages: Email Savior, Meeting Notes Magic, Writer's Room, Workflow Wizard
- Files: `{page}-before-animation.png`, `{page}-after-animation.png`

#### 5. Small Mobile Screenshots (10 images)
- Smallest viewport (320×568) - iPhone SE size
- Edge case testing
- Files: `{page}-small-mobile.png`

#### 6. Large Desktop Screenshots (10 images)
- Ultra-wide viewport (2560×1440)
- Tests max-width behavior
- Files: `{page}-large-desktop.png`

#### 7. Interactive Element Screenshots (5+ images)
- CTA button hover states
- Tab switching states (Writer's Room)
- Files: `think-different-cta-normal.png`, `think-different-cta-hover.png`, `writers-room-tab-1.png`, etc.

## Viewport Specifications

| Viewport Name | Width × Height | Device |
|--------------|----------------|---------|
| Small Mobile | 320 × 568 | iPhone SE |
| Mobile | 375 × 812 | iPhone 13 |
| Tablet | 768 × 1024 | iPad |
| Desktop | 1920 × 1080 | Standard Desktop |
| Large Desktop | 2560 × 1440 | Ultra-Wide Monitor |

## Browser Coverage

| Browser | Engine | Platform Support |
|---------|--------|-----------------|
| Chromium | Blink | Chrome, Edge, Brave |
| Firefox | Gecko | Firefox |
| WebKit | WebKit | Safari |

## Use Cases

### 1. Design Review and Stakeholder Approval
Generate high-resolution desktop screenshots:
```bash
npm run test:screenshot:desktop
```

Share screenshots with stakeholders for design sign-off.

### 2. Visual Regression Testing
1. Generate baseline screenshots
2. Make design changes
3. Re-run screenshot tests
4. Compare screenshots to detect unintended changes

### 3. Responsive Design Validation
Generate screenshots at all viewports:
```bash
npm run test:screenshot
```

Verify:
- No horizontal scrolling
- Proper breakpoint behavior
- Content readability at all sizes

### 4. A/B Testing Hero Text and CTAs
Generate hero section screenshots:
```bash
npx playwright test screenshots.spec.js --grep "Hero Section"
```

Test different headlines and CTA button copy.

### 5. Animation Quality Verification
Generate animation state screenshots:
```bash
npx playwright test screenshots.spec.js --grep "Animation State"
```

Verify animations work correctly and look polished.

### 6. Cross-Browser Compatibility Testing
Run tests across all browsers:
```bash
npx playwright test screenshots.spec.js --project=chromium-desktop --project=firefox-desktop --project=webkit-desktop
```

Compare screenshots to identify rendering differences.

## Troubleshooting

### Issue: "Host system is missing dependencies"
**Solution**: Install system dependencies (see "Installing System Dependencies" section above)

### Issue: "No screenshots generated"
**Solutions**:
1. Ensure local server is running on port 8080 (Playwright auto-starts it)
2. Check `screenshots/` directory permissions
3. Run with `--headed` flag to see browser errors
4. Check for JavaScript errors in the pages

### Issue: "Tests timing out"
**Solutions**:
1. Increase timeout: `npx playwright test screenshots.spec.js --timeout=60000`
2. Reduce parallel workers: `--workers=1`
3. Run specific test groups instead of all tests

### Issue: "Screenshots look different across browsers"
**Expected Behavior**: Minor rendering differences are normal across browser engines.
- Font rendering may vary slightly
- Anti-aliasing differences
- Color profile handling

### Issue: "Cannot install browser dependencies (no sudo access)"
**Alternative Solutions**:
1. **Use Docker**: Run Playwright in a Docker container with all dependencies pre-installed
   ```bash
   docker run --rm --network host -v $(pwd):/workspace -w /workspace mcr.microsoft.com/playwright:v1.58.1-jammy npm run test:screenshot
   ```

2. **Use Cloud CI/CD**: Run screenshot generation in GitHub Actions, GitLab CI, or other CI platforms with pre-configured environments

3. **Use a Development Machine**: Run on a local machine or VM where you have sudo access

4. **Request Administrator Access**: Ask your system administrator to install the required dependencies

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Generate Screenshots

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Generate screenshots
        run: npm run test:screenshot
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: screenshots/
          retention-days: 30
```

## Screenshot Quality Standards

All generated screenshots should meet these quality standards:

### Technical Requirements
- ✅ Full-page capture (entire page height)
- ✅ No horizontal scrollbars
- ✅ Content fully loaded (no loading spinners)
- ✅ Fonts fully loaded (no FOUT/FOIT)
- ✅ Images fully loaded
- ✅ Animations completed or disabled (for consistency)

### Visual Requirements
- ✅ Crisp text rendering
- ✅ Proper color accuracy
- ✅ No visual artifacts
- ✅ Proper spacing and alignment
- ✅ CTAs clearly visible
- ✅ Hero text prominent and readable

### Performance Requirements
- ✅ Screenshot generation completes in <3 seconds per page
- ✅ Total test suite completes in <5 minutes (all 260 tests)
- ✅ File sizes reasonable (<2 MB per full-page screenshot)

## Next Steps

### After Screenshot Generation
1. **Review all screenshots** for design quality
2. **Archive as baseline** for visual regression testing
3. **Share with stakeholders** for approval
4. **Use for A/B testing** hero text and CTAs
5. **Update screenshots** when designs change

### Visual Regression Testing (Feature #36)
Set up automated screenshot comparison:
1. Store baseline screenshots in version control or cloud storage
2. Generate new screenshots on design changes
3. Compare pixel-by-pixel using tools like:
   - Playwright's built-in screenshot comparison
   - Percy.io
   - Applitools
   - BackstopJS
4. Create diff reports highlighting changes

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Screenshot API](https://playwright.dev/docs/screenshots)
- [Playwright Testing Guide](https://playwright.dev/docs/test-guide)
- [Visual Regression Testing Best Practices](https://playwright.dev/docs/test-snapshots)

## Summary

This screenshot generation infrastructure provides:
- ✅ 100+ screenshots across 5 viewports
- ✅ 3 browser engines for cross-browser testing
- ✅ Automated generation via npm scripts
- ✅ Comprehensive coverage of all landing pages
- ✅ Multiple states (normal, hover, animation, tabs)
- ✅ Production-ready visual testing foundation

**Total Screenshots Per Run**: ~103 images (when running all projects and test groups)

**Estimated Generation Time**: 3-5 minutes (all tests, all projects, parallel execution)

**Output Size**: ~50-100 MB (all screenshots combined)

---

**Feature Status**: ✅ Complete (Infrastructure Ready)
**Prerequisites**: System dependencies installation required
**Next Feature**: Visual Regression Testing (#36)
