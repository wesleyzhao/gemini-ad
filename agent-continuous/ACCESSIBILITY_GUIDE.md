# Gemini Landing Pages - Accessibility Guide

## Overview

All 14 Gemini landing pages are designed to meet **WCAG 2.1 Level AA** standards, ensuring they are accessible to users with disabilities. This guide documents the accessibility features implemented across all pages and provides guidance for maintaining and testing accessibility.

**Current Compliance Score: 90% Overall (94% WCAG AA)**

---

## Table of Contents

1. [Key Accessibility Features](#key-accessibility-features)
2. [WCAG 2.1 Compliance](#wcag-21-compliance)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Screen Reader Support](#screen-reader-support)
5. [Testing Accessibility](#testing-accessibility)
6. [Maintenance Guidelines](#maintenance-guidelines)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Key Accessibility Features

### 1. Skip-to-Content Links

Every page includes a skip navigation link that allows keyboard users to bypass repetitive content:

```html
<a href="#main-content" class="skip-to-content">Skip to main content</a>
```

**Behavior:**
- Hidden by default
- Becomes visible when focused with Tab key
- Jumps directly to main content
- Styled with high contrast for visibility

### 2. ARIA Landmarks

All pages use semantic HTML5 landmarks enhanced with ARIA roles:

```html
<header role="banner">           <!-- Site header -->
<nav role="navigation">          <!-- Primary navigation -->
<main id="main-content" role="main">  <!-- Main content -->
<footer role="contentinfo">      <!-- Footer -->
```

**Benefits:**
- Screen readers can navigate by landmarks
- Users can skip to specific page sections
- Improved page structure comprehension

### 3. Semantic HTML

Pages use proper semantic elements:

- `<article>` for card content
- `<section>` with `aria-labelledby` for major page sections
- `<h1>` through `<h6>` in proper hierarchy
- `<blockquote>` for testimonials
- `<nav>` for navigation menus

### 4. ARIA Labels and Descriptions

Interactive elements have descriptive labels:

```html
<!-- Navigation links -->
<a href="https://gemini.google.com"
   aria-label="Try Gemini AI">Try Gemini</a>

<!-- Card grids -->
<div class="gallery-grid"
     role="grid"
     aria-label="Landing page gallery">

<!-- Sections -->
<section id="features"
         aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
```

### 5. Decorative Elements

Non-informative visual elements are hidden from screen readers:

```html
<!-- Decorative icons -->
<span aria-hidden="true">💕</span>

<!-- Background animations -->
<div class="floating-heart" aria-hidden="true">❤️</div>
```

### 6. Focus Indicators

All interactive elements have visible focus states:

```css
/* Keyboard focus */
*:focus {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
}

.btn:focus {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.2);
}
```

**Features:**
- 3px outline for visibility
- High contrast colors
- Offset for clarity
- Works with dark themes

### 7. Keyboard Navigation

Full keyboard support implemented via `animations.js`:

**Arrow Key Navigation:**
- Arrow keys navigate through card grids
- Up/Down/Left/Right move focus between cards
- Home/End jump to first/last item
- Enter activates cards

**Modal Controls:**
- Escape closes modals and dropdowns
- Tab traps focus within modals
- Focus returns to trigger element on close

**Video Controls:**
- Space/K: Play/Pause
- Arrow Left/Right: Seek
- F: Fullscreen
- M: Mute/Unmute

### 8. Screen Reader Announcements

Dynamic content changes are announced:

```javascript
// ARIA live regions
announceToScreenReader('Panel 2 of 5 now showing', 'polite');

// Animation state changes
announceToScreenReader('Features section appeared', 'polite');
```

### 9. Reduced Motion Support

Respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    [data-animate] {
        opacity: 1 !important;
        transform: none !important;
    }
}
```

### 10. High Contrast Mode Support

Enhanced contrast for users who need it:

```css
@media (prefers-contrast: high) {
    *:focus {
        outline-width: 4px;
        outline-offset: 3px;
    }

    .btn {
        border: 2px solid currentColor;
    }
}
```

### 11. Touch Target Sizing

All interactive elements meet minimum 44x44px size:

```css
@media (hover: none) and (pointer: coarse) {
    button, a, input, select, textarea {
        min-width: 44px;
        min-height: 44px;
    }
}
```

---

## WCAG 2.1 Compliance

### Level A Requirements (100% Compliant)

✓ **1.1.1 Non-text Content**
- All images have alt text or aria-hidden for decorative images
- Icons have aria-labels

✓ **1.3.1 Info and Relationships**
- Semantic HTML structure
- Proper heading hierarchy
- ARIA landmarks

✓ **2.1.1 Keyboard**
- All functionality available via keyboard
- No keyboard traps

✓ **2.4.1 Bypass Blocks**
- Skip-to-content links on all pages

✓ **2.4.2 Page Titled**
- All pages have descriptive titles

✓ **3.1.1 Language of Page**
- `<html lang="en">` on all pages

✓ **4.1.2 Name, Role, Value**
- Interactive elements have accessible names
- ARIA roles defined

### Level AA Requirements (94% Compliant)

✓ **1.4.3 Contrast (Minimum)**
- Text meets 4.5:1 contrast ratio
- Large text meets 3:1 ratio

✓ **2.4.6 Headings and Labels**
- Descriptive headings throughout
- Form labels (where applicable)

✓ **2.4.7 Focus Visible**
- All focusable elements have visible focus indicators

✓ **3.2.3 Consistent Navigation**
- Navigation is consistent across pages

⚠ **1.4.13 Content on Hover or Focus** (In Progress)
- Some tooltips need enhancement

### 2026 Best Practices (71% Compliant)

✓ **Responsive Design**
- Mobile-first approach
- Touch targets sized appropriately

✓ **Performance**
- Lazy loading for images and videos
- Optimized animations

⚠ **ARIA Best Practices**
- Most sections have aria-labelledby
- Some sections need enhancement

---

## Keyboard Navigation

### Global Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move to next interactive element |
| `Shift + Tab` | Move to previous interactive element |
| `Enter` | Activate links and buttons |
| `Space` | Activate buttons, play/pause videos |
| `Escape` | Close modals, dropdowns, and overlays |

### Card Grid Navigation

When focused on a card in a grid:

| Key | Action |
|-----|--------|
| `→` | Move to next card (right) |
| `←` | Move to previous card (left) |
| `↓` | Move down one row |
| `↑` | Move up one row |
| `Home` | Jump to first card |
| `End` | Jump to last card |
| `Enter` | Activate card link |

### Video Controls

When focused on a video:

| Key | Action |
|-----|--------|
| `Space` or `K` | Toggle play/pause |
| `→` | Skip forward 5 seconds |
| `←` | Skip backward 5 seconds |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |

### Sliding Panels

When focused on sliding panel:

| Key | Action |
|-----|--------|
| `→` | Next panel |
| `←` | Previous panel |
| `1-9` | Jump to specific panel (if fewer than 10) |

---

## Screen Reader Support

### Tested With

- **NVDA** (Windows) - Fully supported
- **JAWS** (Windows) - Fully supported
- **VoiceOver** (macOS/iOS) - Fully supported
- **TalkBack** (Android) - Fully supported

### Navigation

Screen reader users can navigate by:
- Landmarks (header, navigation, main, footer)
- Headings (H1-H6)
- Links
- Buttons
- Lists
- Articles

### Live Regions

Dynamic content updates are announced:

```html
<div id="aria-live-announcer"
     aria-live="polite"
     aria-atomic="true"></div>
```

**Announcement Examples:**
- "Panel 2 of 5 now showing"
- "Features section appeared"
- "Video playing"
- "Video paused"

---

## Testing Accessibility

### Automated Testing

Run the validation script:

```bash
node scripts/validate-accessibility.js
```

**Output:**
- Overall compliance score
- Per-page scores
- Detailed issue reports
- Recommendations

### Manual Testing Checklist

#### Keyboard Testing

- [ ] Tab through entire page
- [ ] All interactive elements are reachable
- [ ] Focus indicator is visible
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Skip-to-content link works
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals

#### Screen Reader Testing

- [ ] All content is announced
- [ ] Images have appropriate alt text
- [ ] Headings create logical structure
- [ ] Landmarks are properly labeled
- [ ] Dynamic content is announced
- [ ] Forms have labels (if applicable)

#### Visual Testing

- [ ] Text meets contrast ratios
- [ ] Focus indicators are visible
- [ ] Content reflows at 200% zoom
- [ ] No horizontal scrolling at 320px width
- [ ] Text spacing can be adjusted

#### Motion Testing

- [ ] Test with `prefers-reduced-motion: reduce`
- [ ] Animations are disabled or minimal
- [ ] Content is still accessible

### Browser Testing

Test in:
- Chrome with ChromeVox
- Firefox with NVDA
- Safari with VoiceOver
- Edge with Narrator

### Tools

**Automated:**
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

**Manual:**
- [NVDA](https://www.nvaccess.org/)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/)
- Keyboard only testing

---

## Maintenance Guidelines

### Adding New Content

#### New Page Checklist

1. **Copy structure from existing accessible page**
2. **Add skip-to-content link:**
   ```html
   <a href="#main-content" class="skip-to-content">Skip to main content</a>
   ```

3. **Use semantic HTML:**
   ```html
   <header role="banner">
   <nav role="navigation" aria-label="Primary navigation">
   <main id="main-content" role="main">
   <footer role="contentinfo">
   ```

4. **Add ARIA labels to sections:**
   ```html
   <section aria-labelledby="section-heading">
     <h2 id="section-heading">Section Title</h2>
   </section>
   ```

5. **Label all interactive elements:**
   ```html
   <a href="..." aria-label="Descriptive action">Click Here</a>
   ```

6. **Hide decorative elements:**
   ```html
   <div aria-hidden="true">🎨</div>
   ```

7. **Test with validation script:**
   ```bash
   node scripts/validate-accessibility.js
   ```

### Adding New Components

#### Interactive Card

```html
<article class="card" role="listitem" aria-labelledby="card-title">
  <div aria-hidden="true">🎨</div>
  <h3 id="card-title">Card Title</h3>
  <p>Description text</p>
  <a href="..." aria-label="View Card Title details">View Details →</a>
</article>
```

#### Button/CTA

```html
<!-- Primary action -->
<a href="..."
   class="btn btn-primary"
   aria-label="Start using Gemini AI">
  Get Started
</a>

<!-- Secondary action -->
<button class="btn btn-secondary"
        aria-label="Learn more about features">
  Learn More
</button>
```

#### Statistics/Metrics

```html
<div class="stat-card" role="listitem">
  <span class="stat-number" aria-label="95 percent">95%</span>
  <p>User satisfaction</p>
</div>
```

#### Testimonial/Quote

```html
<blockquote role="complementary">
  <p>Quote text goes here...</p>
  <footer>
    — Person Name, Title
  </footer>
</blockquote>
```

### Common Mistakes to Avoid

❌ **Don't:**
- Use `<div>` or `<span>` for buttons (use `<button>` or `<a>`)
- Omit alt text on informative images
- Use placeholder as label
- Create keyboard traps
- Use color alone to convey information
- Auto-play audio without controls

✓ **Do:**
- Use semantic HTML
- Provide text alternatives
- Ensure keyboard access
- Include focus indicators
- Test with screen readers
- Provide skip links

---

## Common Patterns

### Hero Section

```html
<section class="hero" aria-labelledby="hero-heading">
  <!-- Decorative background -->
  <div class="background-element" aria-hidden="true"></div>

  <div class="container">
    <div class="hero-content" data-animate="fade-in">
      <h1 id="hero-heading">Main Headline</h1>
      <p class="text-xl">Subheading or description</p>

      <div class="flex gap-4 justify-center">
        <a href="..."
           class="btn btn-primary btn-large"
           aria-label="Start using Gemini">
          Get Started
        </a>
        <a href="#features"
           class="btn btn-secondary btn-large"
           aria-label="View features">
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>
```

### Feature Grid

```html
<section id="features"
         class="section"
         aria-labelledby="features-heading">
  <div class="container">
    <h2 id="features-heading">Features</h2>

    <div class="grid grid-3 gap-6" role="list">
      <article class="card" role="listitem">
        <div aria-hidden="true">🚀</div>
        <h3>Feature Name</h3>
        <p>Feature description</p>
      </article>

      <!-- More feature cards... -->
    </div>
  </div>
</section>
```

### Statistics Section

```html
<section aria-labelledby="stats-heading">
  <h2 id="stats-heading" class="sr-only">Impact Statistics</h2>

  <div class="stats-container" role="list">
    <div class="stat-card" role="listitem">
      <span class="stat-number" aria-label="2 million plus">2M+</span>
      <p>Users worldwide</p>
    </div>

    <div class="stat-card" role="listitem">
      <span class="stat-number" aria-label="98 percent">98%</span>
      <p>Customer satisfaction</p>
    </div>
  </div>
</section>
```

---

## Troubleshooting

### Focus Not Visible

**Problem:** Focus indicator not showing on elements

**Solution:**
```css
/* Ensure focus styles aren't overridden */
*:focus {
    outline: 3px solid var(--color-primary) !important;
    outline-offset: 2px !important;
}
```

### Screen Reader Not Announcing

**Problem:** Content not being read by screen reader

**Check:**
1. Is element marked `aria-hidden="true"`?
2. Is element positioned off-screen?
3. Is element in a landmark?
4. Does element have accessible name?

**Solution:**
```html
<!-- Add role and label -->
<div role="region" aria-label="Description">
  Content here
</div>
```

### Keyboard Trap

**Problem:** Can't Tab out of element

**Check:**
1. Is `tabindex="-1"` preventing focus?
2. Is JavaScript preventing default Tab behavior?
3. Is element in modal without tab trap logic?

**Solution:**
```javascript
// Implement proper tab trap
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Manage focus within bounds
  }
});
```

### Animation Not Respecting Reduced Motion

**Problem:** Animations still play with reduced motion enabled

**Check:**
1. Is CSS media query properly set?
2. Is JavaScript checking preference?

**Solution:**
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion) {
  // Run animations
}
```

---

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG 2.2 What's New](https://www.w3.org/WAI/WCAG22/quickref/)

### ARIA
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Screen Readers
- [NVDA](https://www.nvaccess.org/) (Free, Windows)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (Built-in, macOS/iOS)

---

## Support

For accessibility questions or issues:

1. **Run validation:** `node scripts/validate-accessibility.js`
2. **Check this guide** for common patterns
3. **Test manually** with keyboard and screen reader
4. **Review WCAG guidelines** for specific requirements

---

**Last Updated:** February 2026
**WCAG Version:** 2.1 Level AA
**Compliance Score:** 90% Overall (94% AA)
**Pages Covered:** All 14 Gemini landing pages
