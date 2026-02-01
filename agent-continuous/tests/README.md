# Testing Framework Documentation

## Overview

This directory contains a comprehensive testing and validation framework for the Gemini Ad Campaign landing pages. The framework includes both automated validation scripts and manual testing guidelines to ensure Apple.com-level quality.

---

## Quick Start

### Run All Validations

```bash
# Run all automated validations
npm run validate

# Or run individually:
npm run validate:html  # HTML structure and accessibility
npm run validate:css   # CSS quality and best practices
npm run validate:perf  # Performance optimization checks
```

### Expected Output

Each validation script provides:
- ✓ **Passes**: Things that are working well
- ⚠ **Warnings**: Areas for improvement (won't fail build)
- ✗ **Errors**: Critical issues that should be fixed
- **Score**: Percentage of checks passed

**Target Scores**:
- HTML Validation: 80%+ (excellent)
- CSS Validation: 85%+ (excellent)
- Performance: 80%+ (excellent)

---

## Automated Validation Scripts

### 1. HTML Validation (`validate-html.js`)

**Purpose**: Validates HTML structure, semantic elements, and accessibility.

**What it checks**:
- DOCTYPE and HTML5 compliance
- Meta tags (charset, viewport, description)
- Semantic HTML elements (header, main, section, etc.)
- Heading hierarchy (H1, H2, H3)
- Image alt attributes
- Link accessibility
- ARIA labels
- Open Graph tags for social sharing
- External link security (rel="noopener")

**Usage**:
```bash
npm run validate:html
```

**Sample Output**:
```
✓ Has DOCTYPE declaration
✓ Has lang attribute on <html>
✓ Uses 4 semantic elements: header, nav, section, footer
⚠ Missing Open Graph meta tags for social sharing
✗ No <h1> heading found

Score: 75% (15/20 checks passed)
```

---

### 2. CSS Validation (`validate-css.js`)

**Purpose**: Validates CSS quality, consistency, and modern best practices.

**What it checks**:
- CSS variable usage (custom properties)
- Mobile-first media queries
- Responsive breakpoints
- Flexbox and Grid usage
- Animations and transitions
- Font size units (rem vs px)
- !important usage (should be minimal)
- Color format consistency
- Box-sizing approach
- Accessibility (prefers-reduced-motion)
- File size optimization

**Usage**:
```bash
npm run validate:css
```

**Sample Output**:
```
✓ Uses 116 CSS variable references
✓ Uses mobile-first approach (5 min-width vs 1 max-width)
✓ Defines 3 CSS animations
✓ Respects prefers-reduced-motion for accessibility
⚠ Found 10 pixel-based font sizes. Consider using rem/em

Score: 87% (13/15 checks passed)
```

---

### 3. Performance Validation (`validate-performance.js`)

**Purpose**: Checks for performance best practices and optimization opportunities.

**What it checks**:

**HTML Files**:
- File size (target: < 100KB)
- Script async/defer attributes
- Resource hints (preconnect, dns-prefetch, preload)
- Image lazy loading
- Image dimensions (prevent layout shift)
- Modern image formats (WebP, AVIF)
- Font loading optimization
- CSS file count
- Critical CSS inlining
- Third-party script count
- DOM size (target: < 500 elements)

**JavaScript Files**:
- File size
- Event listener optimization (passive listeners)
- requestAnimationFrame usage
- Debounce/throttle patterns
- IntersectionObserver usage
- Modern JavaScript features (ES6+)
- Console.log statements (remove for production)

**Usage**:
```bash
npm run validate:perf
```

**Sample Output**:
```
✓ HTML size: 15.4KB (excellent)
✓ All scripts use async/defer or module type
✓ Uses resource preloading
✓ DOM size: 284 elements (good)
⚠ No lazy loading on images. Consider adding loading="lazy"

Performance Score: 83%
```

---

## Manual Testing

### Comprehensive Testing Checklist

See [`TESTING_CHECKLIST.md`](../TESTING_CHECKLIST.md) for the complete manual testing guide.

**Key areas to test manually**:
1. **First Impression** (< 3 seconds) - Does it grab attention?
2. **Design Quality** - Apple.com-level polish?
3. **Content & Messaging** - Clear and compelling?
4. **CTA Optimization** - Easy to find and click?
5. **Mobile Responsiveness** - Works on all devices?
6. **Performance** - Fast loading and smooth animations?
7. **Accessibility** - Keyboard navigation and screen readers?
8. **Cross-Browser** - Works in Chrome, Safari, Firefox, Edge?

### Manual Testing Tools

**Browser DevTools**:
- **Lighthouse**: Run audits for performance, accessibility, SEO
- **Network Tab**: Check load times and resource sizes
- **Performance Tab**: Identify bottlenecks
- **Device Emulation**: Test responsive design

**Online Tools**:
- [WebPageTest](https://www.webpagetest.org/) - Load time analysis
- [WAVE](https://wave.webaim.org/) - Accessibility checker
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance metrics
- [Can I Use](https://caniuse.com/) - Browser compatibility

---

## Playwright Screenshot Testing

**Note**: Playwright requires system dependencies that may not be available in all environments. If you encounter errors, use the validation scripts above instead.

### Setup

```bash
# Install Playwright browsers (one-time setup)
npx playwright install

# Install system dependencies (requires sudo)
npx playwright install-deps
```

### Running Tests

```bash
# Generate screenshots with HTML report
npm run screenshots

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests interactively
npm run test:debug
```

### What it does

- Captures full-page screenshots of all 13 landing pages
- Tests on 5 different devices/browsers:
  - Desktop Chrome (1440x900)
  - Desktop Firefox (1440x900)
  - Desktop Safari (1440x900)
  - Mobile Chrome - Pixel 5 (375x812)
  - Mobile Safari - iPhone 12 (375x812)
- Tests on 3 viewport sizes:
  - Desktop: 1440x900
  - Tablet: 768x1024
  - Mobile: 375x812
- Generates HTML gallery for visual review

**Total screenshots**: 13 pages × 3 viewports × 5 browsers = 195 screenshots

---

## Continuous Integration

### Add to GitHub Actions

Create `.github/workflows/validate.yml`:

```yaml
name: Validate Pages

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Validate HTML
        run: npm run validate:html

      - name: Validate CSS
        run: npm run validate:css

      - name: Validate Performance
        run: npm run validate:perf
```

---

## Interpreting Results

### Scores

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Excellent | Ship it! |
| 80-89% | Good | Review warnings, but acceptable |
| 70-79% | Fair | Fix critical issues before shipping |
| < 70% | Needs work | Address errors and major warnings |

### Common Issues and Fixes

**HTML Validation**:

❌ **Issue**: Missing meta description
✅ **Fix**: Add `<meta name="description" content="...">`

❌ **Issue**: No `<main>` tag
✅ **Fix**: Wrap primary content in `<main>` element

❌ **Issue**: Images missing alt text
✅ **Fix**: Add descriptive `alt="..."` to all images

**CSS Validation**:

❌ **Issue**: Using px for font sizes
✅ **Fix**: Use `rem` or `clamp()` for responsive typography

❌ **Issue**: No prefers-reduced-motion support
✅ **Fix**: Add media query:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Performance Validation**:

❌ **Issue**: Scripts without async/defer
✅ **Fix**: Add `defer` to script tags:
```html
<script src="animations.js" defer></script>
```

❌ **Issue**: No lazy loading on images
✅ **Fix**: Add `loading="lazy"`:
```html
<img src="image.jpg" loading="lazy" alt="...">
```

---

## File Structure

```
tests/
├── README.md                    # This file
├── screenshot.spec.js           # Playwright screenshot tests
├── validate-html.js            # HTML validation script
├── validate-css.js             # CSS validation script
├── validate-performance.js     # Performance validation script
└── ...

../TESTING_CHECKLIST.md         # Manual testing guide
```

---

## Extending the Framework

### Adding New Validation Checks

**1. Add to existing validator:**

Edit `validate-html.js`, `validate-css.js`, or `validate-performance.js`:

```javascript
// Add new check
const hasNewFeature = content.match(/pattern/);
if (hasNewFeature) {
    this.passes.push('New feature detected');
} else {
    this.warnings.push('Consider adding new feature');
}
```

**2. Create new validator:**

Create `tests/validate-new.js`:

```javascript
#!/usr/bin/env node
const fs = require('fs');

class NewValidator {
    validateFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Add validation logic
    }
}

// Main execution
if (require.main === module) {
    const validator = new NewValidator();
    // Run validation
}

module.exports = NewValidator;
```

Add to `package.json`:
```json
{
  "scripts": {
    "validate:new": "node tests/validate-new.js"
  }
}
```

---

## Best Practices

### Before Committing

Always run validations before committing:

```bash
npm run validate
```

If any errors are found, fix them before pushing.

### During Development

Run validations frequently to catch issues early:

```bash
# Quick check while developing
npm run validate:html -- path/to/file.html
```

### Before Deployment

1. Run full validation suite
2. Complete manual testing checklist
3. Generate screenshots for visual review
4. Test on actual devices (mobile, tablet, desktop)
5. Run Lighthouse audits

---

## Troubleshooting

### Validation Scripts Fail to Run

**Problem**: `node: command not found`
**Solution**: Install Node.js (v16 or higher)

**Problem**: `Cannot find module`
**Solution**: Run `npm install`

### Playwright Issues

**Problem**: `Target page, context or browser has been closed`
**Solution**: Install system dependencies:
```bash
npx playwright install-deps
```

**Problem**: Can't install dependencies (no sudo)
**Solution**: Use validation scripts instead of Playwright tests

---

## Support

For issues or questions about the testing framework:

1. Check this README
2. Review the validation script source code
3. Consult `TESTING_CHECKLIST.md` for manual testing guidance
4. Check Playwright documentation: https://playwright.dev/

---

## Summary

This testing framework provides:

✅ **Automated validation** for HTML, CSS, and performance
✅ **Manual testing checklist** for design quality
✅ **Screenshot testing** (when Playwright is available)
✅ **Clear scoring system** with actionable feedback
✅ **CI/CD integration** ready
✅ **Extensible architecture** for new checks

**Goal**: Ensure every landing page meets Apple.com-level quality standards before deployment.

---

**Remember**: These tools help catch issues, but human judgment is essential. Always review pages visually and test with real users.
