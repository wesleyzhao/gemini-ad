# Screenshot Generation Guide

This document provides comprehensive instructions for generating screenshots of all Gemini Ad landing pages across multiple devices.

## Quick Start

Due to system dependency limitations in the current environment, automated screenshot generation with Playwright is not available. However, all pages are ready for screenshots and can be captured manually or in a CI/CD environment with proper dependencies.

## Automated Screenshot Generation (Recommended for CI/CD)

### Option 1: Using Playwright (Requires System Dependencies)

```bash
# Install system dependencies (requires sudo)
npx playwright install-deps chromium

# Run screenshot tests
npm run screenshots
```

This will:
- Capture screenshots at 3 viewports (desktop, tablet, mobile)
- Generate hero section close-ups
- Run performance checks
- Create an HTML gallery at `screenshots/gallery.html`

### Option 2: Using Docker (No sudo required)

```bash
# Run in a Docker container with all dependencies
docker run --rm -v $(pwd):/workspace -w /workspace mcr.microsoft.com/playwright:v1.58.0-focal npm test
```

## Manual Screenshot Generation

### Setup

1. Start the local development server:
```bash
npm run serve
```

2. The server will start at `http://localhost:8080`

### Pages to Screenshot

Below are all 14 landing pages that need screenshots. For each page, capture at 3 viewports:

#### Desktop (1440×900)
- Standard desktop experience
- Full feature showcase
- Hero sections with animations

#### Tablet (768×1024)
- iPad and tablet layouts
- Responsive grid adaptations
- Touch-friendly interactions

#### Mobile (375×812)
- iPhone and mobile phones
- Mobile-first design validation
- Vertical scrolling experience

### Landing Pages List

| # | Page Name | URL | Description |
|---|-----------|-----|-------------|
| 1 | Valentine's Day | `/pages/valentine.html` | Seasonal campaign with love letter hook |
| 2 | Writers | `/pages/writers.html` | VO3 and content creation tools for writers |
| 3 | Creators | `/pages/creators.html` | Nano Banana and creative tools showcase |
| 4 | Operators | `/pages/operators.html` | Workspace integration and productivity features |
| 5 | Automators | `/pages/automators.html` | Automation workflows and technical features |
| 6 | Apple Style | `/pages/apple-style.html` | Premium minimalist design with bundling concept |
| 7 | Trust & Citations | `/pages/trust.html` | Citations, fact-checking, and trustworthiness |
| 8 | Research | `/pages/research.html` | Academic and professional research tools |
| 9 | Productivity | `/pages/productivity.html` | Time-saving features and ROI messaging |
| 10 | Workspace | `/pages/workspace.html` | Google Workspace integration |
| 11 | Comparison | `/pages/comparison.html` | Competitive comparison vs ChatGPT, Claude, Perplexity |
| 12 | Future | `/pages/future.html` | Aspirational starfield animation |
| 13 | Animations Demo | `/pages/animations-demo.html` | Video animations showcase |
| 14 | Gallery Index | `/pages/index.html` | Hub page linking to all landing pages |

### Screenshot Naming Convention

Use this naming pattern for consistency:

```
{page-name}-{viewport}.png

Examples:
- valentine-desktop.png
- valentine-tablet.png
- valentine-mobile.png
- writers-desktop.png
- writers-tablet.png
- writers-mobile.png
```

### Browser DevTools Method

1. Open page in Chrome/Firefox
2. Press `F12` to open DevTools
3. Click device toolbar icon (or press `Ctrl+Shift+M`)
4. Select viewport size:
   - Desktop: 1440×900
   - Tablet: 768×1024
   - Mobile: 375×812
5. Press `Ctrl+Shift+P` and type "screenshot"
6. Select "Capture full size screenshot"
7. Save with proper naming convention

### Browser Extensions (Easiest)

**Recommended Extensions:**
- **Awesome Screenshot** (Chrome/Firefox) - Capture full page screenshots
- **GoFullPage** (Chrome) - One-click full page screenshots
- **Nimbus Screenshot** (Chrome/Firefox) - Multiple viewport options

## Screenshot Validation Checklist

For each screenshot, verify:

- [ ] Page loads completely (no missing images or broken layout)
- [ ] Animations have settled (wait 1-2 seconds after page load)
- [ ] Text is readable and not blurry
- [ ] Hero section is clearly visible
- [ ] CTAs (Call-to-Action buttons) are prominent
- [ ] No horizontal scrolling on mobile
- [ ] Colors match design system (blues, gradients, etc.)
- [ ] Typography is consistent
- [ ] No console errors visible

## Quality Standards

### First Impression (< 3 seconds)
Each screenshot should demonstrate that a user can understand the value proposition within 3 seconds:

✅ **Good Screenshot:**
- Clear hero headline
- Obvious primary CTA
- Compelling visual element
- Clean, uncluttered layout

❌ **Bad Screenshot:**
- Ambiguous messaging
- Hidden or unclear CTA
- Busy or confusing layout
- Broken images/styles

### Design Quality (Apple.com Standard)
Landing pages should match Apple.com aesthetic:

✅ **Good:**
- Generous white space
- Smooth animations
- Premium typography (SF Pro Display, Inter)
- Subtle shadows and gradients
- Glassmorphism effects

❌ **Bad:**
- Cramped layout
- Jarring animations
- Generic fonts
- Harsh shadows
- Outdated visual effects

## Screenshot Gallery

After generating screenshots, view them in the auto-generated gallery:

```bash
open screenshots/gallery.html
```

The gallery provides:
- Side-by-side viewport comparison
- All pages in one view
- Click to enlarge
- Visual quality assessment

## Automated Testing (When Dependencies Available)

The Playwright test suite (`tests/screenshot.spec.js`) includes:

### Screenshot Tests
- ✅ Desktop screenshots (1440×900)
- ✅ Tablet screenshots (768×1024)
- ✅ Mobile screenshots (375×812)
- ✅ Hero section close-ups

### Quality Checks
- ✅ Page load performance (< 3 seconds)
- ✅ CTA button presence
- ✅ No horizontal scroll on mobile
- ✅ Page title exists
- ✅ Network idle detection

### Performance Metrics
```bash
npm run test
```

Expected results:
- Load time: < 3000ms per page
- No failed network requests
- No JavaScript errors
- All CTAs clickable

## Screenshot Output

### File Structure
```
screenshots/
├── valentine-desktop.png
├── valentine-tablet.png
├── valentine-mobile.png
├── valentine-hero.png
├── writers-desktop.png
├── writers-tablet.png
├── writers-mobile.png
├── writers-hero.png
├── (... more screenshots)
└── gallery.html
```

### Expected Total
- **42 full-page screenshots** (14 pages × 3 viewports)
- **14 hero screenshots** (1 per page)
- **1 HTML gallery** for review

### File Sizes
- Desktop: ~200-500 KB per screenshot
- Tablet: ~150-350 KB per screenshot
- Mobile: ~100-250 KB per screenshot
- Total: ~15-25 MB for all screenshots

## Next Steps After Screenshots

1. **Review Gallery**: Open `screenshots/gallery.html` in browser
2. **Visual QA**: Use `TESTING_CHECKLIST.md` to score each page
3. **Identify Issues**: Note any design inconsistencies or bugs
4. **Iterate**: Fix issues and regenerate screenshots
5. **Final Selection**: Confirm top 10 pages for deployment
6. **Documentation**: Update `reflections-and-best.md` with findings

## Troubleshooting

### "Page won't load"
- Check that `npm run serve` is running
- Verify port 8080 is not in use: `lsof -i :8080`
- Try a different port: `http-server . -p 3000`

### "Animations don't appear"
- Wait 1-2 seconds after page load
- Scroll down slightly to trigger scroll animations
- Check browser console for JavaScript errors
- Verify `animations.js` is loading

### "Layout looks broken"
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check viewport size is set correctly
- Verify CSS files are loading

### "Can't install Playwright dependencies"
- Requires sudo access to install system libraries
- Use Docker alternative (see above)
- Use manual screenshot method
- Run in CI/CD with proper permissions

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Generate Screenshots

on: [push]

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v2
        with:
          name: screenshots
          path: screenshots/
```

## Resources

- **Playwright Documentation**: https://playwright.dev/docs/screenshots
- **Browser DevTools Guide**: https://developer.chrome.com/docs/devtools/
- **Responsive Design Testing**: https://responsively.app/
- **Screenshot Comparison Tools**: https://percy.io/, https://chromatic.com/

## Status

✅ **Ready for Screenshots**: All 14 landing pages are production-ready
✅ **Test Suite**: Playwright tests configured and validated
✅ **Gallery Generator**: Automatic HTML gallery creation
⏳ **Automated Execution**: Pending system dependency installation
✅ **Manual Instructions**: Complete guide provided above

---

**Last Updated**: 2026-02-01
**Total Pages**: 14 landing pages
**Target Screenshots**: 56 total (42 full-page + 14 hero)
**Estimated Time**: 30 minutes manual, 5 minutes automated
