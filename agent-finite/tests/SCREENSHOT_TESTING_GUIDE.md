# Screenshot Testing Guide for Gemini Ads Landing Pages

This guide explains how to use the automated screenshot generation system for all 10 final landing pages.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Screenshot Categories](#screenshot-categories)
4. [Running Tests](#running-tests)
5. [Output Structure](#output-structure)
6. [Use Cases](#use-cases)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Overview

The screenshot testing system (`screenshots.spec.js`) automatically generates high-quality screenshots of all 10 final Gemini Ads landing pages across multiple viewports and states. This provides:

- **Visual Quality Assurance**: Verify pixel-perfect design implementation
- **Design Review**: Share screenshots with stakeholders for approval
- **Visual Regression Testing**: Baseline images for detecting unintended changes
- **Documentation**: Visual catalog of all landing page variations
- **Responsive Testing**: Verify designs at mobile, tablet, and desktop sizes

### Statistics

- **Total Pages**: 10 final landing pages
- **Total Viewports**: 5 viewport sizes (320px, 375px, 768px, 1920px, 2560px)
- **Total Screenshots**: 100+ images generated
- **Test Groups**: 10 test suites covering different scenarios

---

## Quick Start

### Prerequisites

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Install Playwright browsers (first time only)
npx playwright install chromium

# 3. Ensure local server is ready (auto-starts during tests)
```

### Generate All Screenshots

```bash
# Run all screenshot tests (recommended)
npm run test:screenshot

# Or with more verbose output
npx playwright test screenshots.spec.js --headed
```

### Generate Specific Categories

```bash
# Mobile screenshots only
npm run test:screenshot:mobile

# Desktop screenshots only
npm run test:screenshot:desktop

# Tablet screenshots only
npm run test:screenshot:tablet

# Hero sections only
npx playwright test screenshots.spec.js --grep "Hero Section"

# Animation states only
npx playwright test screenshots.spec.js --grep "Animation State"
```

---

## Screenshot Categories

### 1. Individual Page Screenshots - All Viewports

**Test Group**: `Individual Page Screenshots - All Viewports`
**Screenshots**: 30 (10 pages × 3 viewports)
**Viewports**: Mobile (375×812), Tablet (768×1024), Desktop (1920×1080)

Captures each of the 10 final landing pages at all three primary viewports.

**Files Generated**:
- `think-different-mobile.png`
- `think-different-tablet.png`
- `think-different-desktop.png`
- _(Same pattern for all 10 pages)_

**Use Case**: Comprehensive visual review across all devices

---

### 2. Mobile Quick Preview

**Test Group**: `Mobile Screenshots - All Pages`
**Screenshots**: 10 (one per page)
**Viewport**: Mobile (375×812)

Fast generation of all pages at mobile size for quick mobile design review.

**Files Generated**:
- `think-different-mobile-quick.png`
- `workspace-infinity-mobile-quick.png`
- _(All 10 pages)_

**Use Case**: Fast mobile-first design iteration

---

### 3. Desktop Quick Preview

**Test Group**: `Desktop Screenshots - All Pages`
**Screenshots**: 10 (one per page)
**Viewport**: Desktop (1920×1080)

High-resolution desktop screenshots for presentations and stakeholder reviews.

**Files Generated**:
- `think-different-desktop-quick.png`
- `workspace-infinity-desktop-quick.png`
- _(All 10 pages)_

**Use Case**: Design presentations, stakeholder approval

---

### 4. Tablet Quick Preview

**Test Group**: `Tablet Screenshots - All Pages`
**Screenshots**: 10 (one per page)
**Viewport**: Tablet (768×1024)

Tablet screenshots to verify the critical 768px breakpoint.

**Files Generated**:
- `think-different-tablet-quick.png`
- `workspace-infinity-tablet-quick.png`
- _(All 10 pages)_

**Use Case**: Tablet breakpoint verification

---

### 5. Hero Section Screenshots

**Test Group**: `Hero Section Screenshots - Desktop`
**Screenshots**: 10 (one per page)
**Viewport**: Desktop (1920×1080)
**Capture**: Above the fold only (no scroll)

Captures only the hero section of each page for A/B testing headlines and CTAs.

**Files Generated**:
- `think-different-hero-desktop.png`
- `workspace-infinity-hero-desktop.png`
- _(All 10 pages)_

**Use Case**: A/B testing hero text, CTA optimization

---

### 6. Animation State Screenshots

**Test Group**: `Animation State Screenshots - Selected Pages`
**Screenshots**: 8 (4 pages × 2 states)
**Pages**: Email Savior, Meeting Notes Magic, Writer's Room, Workflow Wizard

Captures pages with JavaScript animations in two states:
- Before animation (initial load)
- After animation (scrolled/triggered)

**Files Generated**:
- `email-savior-before-animation.png`
- `email-savior-after-animation.png`
- _(Same for 4 animated pages)_

**Use Case**: Animation quality verification, debugging

---

### 7. Small Mobile Screenshots

**Test Group**: `Small Mobile Screenshots - All Pages`
**Screenshots**: 10 (one per page)
**Viewport**: Small Mobile (320×568)

Tests the absolute minimum mobile width to ensure graceful degradation.

**Files Generated**:
- `think-different-small-mobile.png`
- `workspace-infinity-small-mobile.png`
- _(All 10 pages)_

**Use Case**: Edge case testing, small device compatibility

---

### 8. Large Desktop Screenshots

**Test Group**: `Large Desktop Screenshots - All Pages`
**Screenshots**: 10 (one per page)
**Viewport**: Large Desktop (2560×1440)

Tests ultra-wide displays to ensure designs scale up gracefully.

**Files Generated**:
- `think-different-large-desktop.png`
- `workspace-infinity-large-desktop.png`
- _(All 10 pages)_

**Use Case**: Ultra-wide display testing, max-width verification

---

### 9. Interactive Element Screenshots

**Test Group**: `Interactive Element Screenshots - Hover States`
**Screenshots**: 5+ (varies)
**Elements**: CTA buttons, tabs, panels

Captures interactive elements in different states (normal, hover, active).

**Files Generated**:
- `think-different-cta-normal.png`
- `think-different-cta-hover.png`
- `writers-room-tab-1.png`
- `writers-room-tab-2.png`
- `writers-room-tab-3.png`

**Use Case**: Interaction design verification, hover effect testing

---

## Running Tests

### Basic Commands

```bash
# Run all screenshot tests
npm run test:screenshot

# Run with visible browser (watch screenshots being taken)
npx playwright test screenshots.spec.js --headed

# Run with slow motion (for debugging)
npx playwright test screenshots.spec.js --headed --slow-mo=1000

# Run in UI mode (interactive)
npx playwright test screenshots.spec.js --ui
```

### Advanced Commands

```bash
# Run specific test group
npx playwright test screenshots.spec.js --grep "Individual Page Screenshots"

# Run tests in parallel (faster)
npx playwright test screenshots.spec.js --workers=4

# Run tests with retries (on failure)
npx playwright test screenshots.spec.js --retries=2

# Generate HTML report
npx playwright test screenshots.spec.js --reporter=html
npx playwright show-report
```

### Selective Generation

```bash
# Only mobile screenshots
npx playwright test screenshots.spec.js --grep "Mobile"

# Only desktop screenshots
npx playwright test screenshots.spec.js --grep "Desktop"

# Only hero sections
npx playwright test screenshots.spec.js --grep "Hero"

# Only animation states
npx playwright test screenshots.spec.js --grep "Animation"

# Only interactive elements
npx playwright test screenshots.spec.js --grep "Interactive"
```

---

## Output Structure

All screenshots are saved to the `screenshots/` directory:

```
screenshots/
├── think-different-mobile.png
├── think-different-tablet.png
├── think-different-desktop.png
├── think-different-mobile-quick.png
├── think-different-desktop-quick.png
├── think-different-tablet-quick.png
├── think-different-hero-desktop.png
├── think-different-small-mobile.png
├── think-different-large-desktop.png
├── think-different-cta-normal.png
├── think-different-cta-hover.png
├── workspace-infinity-mobile.png
├── workspace-infinity-tablet.png
├── workspace-infinity-desktop.png
├── ... (all 10 pages × multiple viewports)
├── email-savior-before-animation.png
├── email-savior-after-animation.png
├── writers-room-tab-1.png
├── writers-room-tab-2.png
└── writers-room-tab-3.png
```

### File Naming Convention

- **Format**: `{page-name}-{viewport/state}.png`
- **Page Name**: Lowercase, hyphens for spaces (e.g., `think-different`, `writers-room`)
- **Viewport**: `mobile`, `tablet`, `desktop`, `small-mobile`, `large-desktop`
- **Special**: `hero`, `before-animation`, `after-animation`, `cta-normal`, `cta-hover`, `tab-1`

---

## Use Cases

### 1. Design Review and Approval

**Scenario**: Share screenshots with stakeholders for design sign-off.

```bash
# Generate all desktop screenshots for presentation
npm run test:screenshot:desktop

# Share screenshots/ folder with stakeholders
```

**Recommended**: Desktop and hero screenshots for high-level review.

---

### 2. Visual Regression Testing

**Scenario**: Detect unintended visual changes after code updates.

```bash
# Before making changes: Generate baseline screenshots
npm run test:screenshot

# After making changes: Generate new screenshots
npm run test:screenshot

# Compare screenshots/ folder (manual or automated diff)
```

**Tool Recommendation**: Use Playwright's built-in visual comparison or tools like Percy, Applitools.

---

### 3. Mobile-First Design Iteration

**Scenario**: Rapidly iterate on mobile designs.

```bash
# Generate only mobile screenshots (faster)
npm run test:screenshot:mobile

# Review screenshots/
# Make design changes
# Re-run
npm run test:screenshot:mobile
```

---

### 4. Responsive Design Validation

**Scenario**: Verify all pages work across all viewports.

```bash
# Generate all viewports for all pages
npm run test:screenshot

# Review:
# - Mobile: 375px and 320px screenshots
# - Tablet: 768px screenshots (critical breakpoint)
# - Desktop: 1920px and 2560px screenshots
```

---

### 5. A/B Testing Hero Text and CTAs

**Scenario**: Test different hero headlines and CTA copy.

```bash
# Generate hero section screenshots
npx playwright test screenshots.spec.js --grep "Hero Section"

# Make changes to hero text
# Re-generate
npx playwright test screenshots.spec.js --grep "Hero Section"

# Compare before/after
```

---

### 6. Animation Quality Verification

**Scenario**: Verify JavaScript animations are working correctly.

```bash
# Generate animation state screenshots
npx playwright test screenshots.spec.js --grep "Animation State"

# Review:
# - email-savior-before-animation.png
# - email-savior-after-animation.png
# - (Same for other animated pages)
```

---

### 7. Cross-Browser Testing Preparation

**Scenario**: Generate screenshots in multiple browsers.

```bash
# Chromium (Chrome/Edge)
npx playwright test screenshots.spec.js --project=chromium

# Firefox
npx playwright test screenshots.spec.js --project=firefox

# WebKit (Safari)
npx playwright test screenshots.spec.js --project=webkit

# Compare screenshots across browsers
```

---

## Troubleshooting

### Issue: No screenshots generated

**Solution**:
```bash
# Check if screenshots/ directory exists
mkdir -p screenshots

# Check if server is running
npm run serve
# In another terminal:
npm run test:screenshot
```

---

### Issue: Screenshots are blank or broken

**Solution**:
```bash
# Increase wait time for animations
# Edit screenshots.spec.js:
# waitForPageLoad(page, { waitForAnimations: true, timeout: 10000 })

# Or manually wait longer
# await page.waitForTimeout(5000);
```

---

### Issue: Tests timeout

**Solution**:
```bash
# Increase timeout in playwright.config.js or run with:
npx playwright test screenshots.spec.js --timeout=60000
```

---

### Issue: Server not starting

**Solution**:
```bash
# Manually start server before tests
npm run serve

# In another terminal:
npx playwright test screenshots.spec.js --config playwright.config.js
# Comment out webServer in config temporarily
```

---

## Best Practices

### 1. Generate Baseline Screenshots First

Before making any design changes, generate a complete set of baseline screenshots:

```bash
npm run test:screenshot
# Save screenshots/ folder as baseline/
```

### 2. Run Specific Tests During Iteration

Don't regenerate all screenshots for small changes:

```bash
# Only regenerate the page you're working on
npx playwright test screenshots.spec.js --grep "Think Different"
```

### 3. Use Headed Mode for Debugging

When tests fail or screenshots look wrong:

```bash
npx playwright test screenshots.spec.js --headed --slow-mo=500
```

### 4. Regular Screenshot Updates

Update screenshots after every major design change:

```bash
# After CSS changes
npm run test:screenshot

# Commit updated screenshots to version control
git add screenshots/
git commit -m "Update screenshots after design changes"
```

### 5. Screenshot Optimization

Screenshots can be large. Optimize before committing:

```bash
# Use tools like imagemagick to compress
mogrify -strip -quality 85 screenshots/*.png
```

### 6. Version Control

Add screenshots to `.gitignore` if too large, or commit only critical ones:

```gitignore
# .gitignore
screenshots/*-quick.png      # Exclude quick previews
screenshots/*-small-mobile.png  # Exclude edge cases
```

Keep only:
- Main viewport screenshots (mobile, tablet, desktop)
- Hero screenshots for documentation

---

## Summary

The screenshot testing system provides comprehensive visual coverage of all 10 Gemini Ads landing pages across 5 viewports and multiple states, generating 100+ screenshots for quality assurance, design review, and visual regression testing.

**Key Commands**:
- `npm run test:screenshot` - Generate all screenshots
- `npm run test:screenshot:mobile` - Mobile only
- `npm run test:screenshot:desktop` - Desktop only
- `npx playwright test screenshots.spec.js --headed` - Watch tests run

**Next Steps**:
1. Generate baseline screenshots
2. Review for design quality
3. Use as visual regression baseline
4. Update after design changes

For more information, see the main [Testing README](./README.md).
