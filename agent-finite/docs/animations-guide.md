# Animation System Guide

Complete guide to using the Gemini Ads animation system with `animations.css` and `animations.js`.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Fade Animations](#fade-animations)
4. [Slide Animations](#slide-animations)
5. [Scale Animations](#scale-animations)
6. [Combined Animations](#combined-animations)
7. [Rotation Animations](#rotation-animations)
8. [Stagger Effects](#stagger-effects)
9. [Keyframe Animations](#keyframe-animations)
10. [Hover Animations](#hover-animations)
11. [Parallax Effects](#parallax-effects)
12. [Text Animations](#text-animations)
13. [Duration & Delay Modifiers](#duration--delay-modifiers)
14. [JavaScript API](#javascript-api)
15. [Performance](#performance)
16. [Accessibility](#accessibility)

---

## Overview

The animation system provides Apple.com-inspired animations that are:

- **Scroll-triggered**: Animations activate when elements enter the viewport
- **Performance-optimized**: Uses Intersection Observer API and GPU acceleration
- **Accessible**: Respects `prefers-reduced-motion` setting
- **Responsive**: Optimized for mobile, tablet, and desktop
- **Zero dependencies**: Pure CSS and vanilla JavaScript

### Files

- `assets/css/animations.css` - Animation utilities and CSS variables
- `assets/js/animations.js` - Scroll-triggered animation controller
- `tests/animations-test.html` - Comprehensive test/demo page

---

## Quick Start

### 1. Include Files

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="assets/css/design-system.css">
  <link rel="stylesheet" href="assets/css/animations.css">
</head>
<body>
  <!-- Your content here -->

  <!-- Load at end of body -->
  <script src="assets/js/animations.js"></script>
</body>
</html>
```

### 2. Add Animation Classes

```html
<!-- Basic fade-in animation -->
<div class="animate-fade-in">
  This will fade in when scrolled into view
</div>

<!-- Slide up animation (Apple.com signature) -->
<div class="animate-slide-up">
  This will slide up from bottom
</div>

<!-- Combined fade + slide + scale -->
<div class="animate-hero">
  Hero section animation
</div>
```

### 3. That's it!

The JavaScript automatically:
- Observes all elements with `animate-*` classes
- Adds `animate-active` class when they enter viewport
- Triggers smooth CSS transitions

---

## Fade Animations

### Basic Fade In

```html
<div class="animate-fade-in">
  Fades in with default duration (600ms)
</div>
```

### Speed Variations

```html
<!-- Fast fade (300ms) -->
<div class="animate-fade-in-fast">Quick fade</div>

<!-- Slow fade (900ms) -->
<div class="animate-fade-in-slow">Slow fade</div>

<!-- Slower fade (1200ms) -->
<div class="animate-fade-in-slower">Very slow fade</div>
```

**Classes:**
- `animate-fade-in` - Normal fade (600ms)
- `animate-fade-in-fast` - Fast fade (300ms)
- `animate-fade-in-slow` - Slow fade (900ms)
- `animate-fade-in-slower` - Very slow fade (1200ms)

---

## Slide Animations

### Slide Directions

```html
<!-- Slide from bottom (most common) -->
<div class="animate-slide-up">Slides up</div>

<!-- Slide from top -->
<div class="animate-slide-down">Slides down</div>

<!-- Slide from left -->
<div class="animate-slide-right">Slides right</div>

<!-- Slide from right -->
<div class="animate-slide-left">Slides left</div>
```

### Distance Variations

```html
<!-- Small distance (20px) -->
<div class="animate-slide-up-sm">Small slide</div>

<!-- Medium distance (40px) - default -->
<div class="animate-slide-up">Medium slide</div>

<!-- Large distance (60px) -->
<div class="animate-slide-up-lg">Large slide</div>
```

**Classes:**
- `animate-slide-up` - Slide from bottom (40px)
- `animate-slide-up-sm` - Small slide (20px)
- `animate-slide-up-lg` - Large slide (60px)
- `animate-slide-down` - Slide from top
- `animate-slide-right` - Slide from left
- `animate-slide-left` - Slide from right

---

## Scale Animations

```html
<!-- Scale up from 90% -->
<div class="animate-scale-up">Grows to full size</div>

<!-- Scale up from 80% -->
<div class="animate-scale-up-lg">Grows from smaller</div>

<!-- Scale down from 110% -->
<div class="animate-scale-down">Shrinks to normal</div>
```

**Classes:**
- `animate-scale-up` - Scale from 0.9 to 1.0
- `animate-scale-up-lg` - Scale from 0.8 to 1.0
- `animate-scale-down` - Scale from 1.1 to 1.0

---

## Combined Animations

### Fade + Slide Up (Apple.com Signature)

```html
<div class="animate-fade-slide-up">
  This is the most common Apple.com animation
</div>
```

### Fade + Scale

```html
<div class="animate-fade-scale">
  Fades in while scaling up
</div>
```

### Hero Animation (Fade + Slide + Scale)

```html
<div class="animate-hero">
  Perfect for hero sections - combines fade, slide, and scale
</div>
```

**Classes:**
- `animate-fade-slide-up` - Fade + slide from bottom
- `animate-fade-scale` - Fade + scale up
- `animate-hero` - Fade + slide + scale (hero sections)

---

## Rotation Animations

```html
<!-- Rotate in from slight tilt -->
<div class="animate-rotate-in">
  Rotates from -5deg to 0deg
</div>

<!-- 3D flip effect -->
<div class="animate-flip-in">
  Flips in with 3D perspective
</div>
```

**Classes:**
- `animate-rotate-in` - Rotate + scale
- `animate-flip-in` - 3D flip perspective

---

## Stagger Effects

Apply to a **parent container** to stagger child animations:

```html
<!-- Normal stagger (100ms between items) -->
<div class="animate-stagger">
  <div class="animate-slide-up">Item 1 (0ms delay)</div>
  <div class="animate-slide-up">Item 2 (100ms delay)</div>
  <div class="animate-slide-up">Item 3 (200ms delay)</div>
  <div class="animate-slide-up">Item 4 (300ms delay)</div>
</div>

<!-- Fast stagger (50ms between items) -->
<div class="animate-stagger-fast">
  <div class="animate-fade-in">Quick 1</div>
  <div class="animate-fade-in">Quick 2</div>
  <div class="animate-fade-in">Quick 3</div>
</div>

<!-- Slow stagger (200ms between items) -->
<div class="animate-stagger-slow">
  <div class="animate-slide-up">Slow 1</div>
  <div class="animate-slide-up">Slow 2</div>
  <div class="animate-slide-up">Slow 3</div>
</div>
```

**Classes:**
- `animate-stagger` - 100ms delay between children
- `animate-stagger-fast` - 50ms delay
- `animate-stagger-slow` - 200ms delay

---

## Keyframe Animations

Continuous animations (always animating):

```html
<!-- Pulse (for CTAs, badges) -->
<div class="animate-pulse">💓</div>

<!-- Bounce -->
<div class="animate-bounce">⚽</div>

<!-- Spin (loading) -->
<div class="animate-spin">⚙️</div>

<!-- Float (subtle) -->
<div class="animate-float">☁️</div>

<!-- Gradient shift (backgrounds) -->
<div class="animate-gradient" style="background: linear-gradient(90deg, blue, purple);">
  Animated gradient
</div>
```

**Classes:**
- `animate-pulse` - Pulsing scale effect
- `animate-bounce` - Bouncing up/down
- `animate-spin` - Continuous rotation
- `animate-float` - Gentle floating motion
- `animate-gradient` - Gradient position shift
- `animate-shimmer` - Shimmer/shine effect

---

## Hover Animations

```html
<!-- Lift on hover -->
<div class="hover-lift">Lifts up 8px</div>

<!-- Scale on hover -->
<div class="hover-scale">Scales to 105%</div>

<!-- Glow on hover -->
<div class="hover-glow">Glows with blue shadow</div>

<!-- Brighten on hover -->
<div class="hover-brighten">Brightness increases</div>

<!-- Rotate on hover -->
<div class="hover-rotate">Rotates 5deg</div>
```

**Classes:**
- `hover-lift` - Translates up 8px
- `hover-scale` - Scales to 1.05
- `hover-glow` - Blue glow shadow
- `hover-brighten` - Brightness filter
- `hover-rotate` - Rotates 5deg

---

## Parallax Effects

Elements that move at different speeds when scrolling:

```html
<div class="parallax-container">
  <!-- Background layer (slowest) -->
  <div class="parallax-slow">
    Moves at 30% scroll speed
  </div>

  <!-- Middle layer -->
  <div class="parallax-medium">
    Moves at 50% scroll speed
  </div>

  <!-- Foreground layer (fastest) -->
  <div class="parallax-fast">
    Moves at 80% scroll speed
  </div>
</div>
```

**Classes:**
- `parallax-container` - Wrapper for parallax layers
- `parallax-slow` - 30% scroll speed
- `parallax-medium` - 50% scroll speed
- `parallax-fast` - 80% scroll speed

**Note:** Parallax is disabled on mobile for performance.

---

## Text Animations

### Word-by-Word Animation

```html
<h1 class="animate-text-words">
  Each word appears sequentially
</h1>
```

The JavaScript will automatically split the text into `<span class="word">` elements and animate them sequentially.

### Typing Effect

```html
<p class="animate-typing">
  This text appears with a typing effect
</p>
```

---

## Duration & Delay Modifiers

### Duration Modifiers

```html
<!-- Force fast duration -->
<div class="animate-fade-in animate-duration-fast">Fast (300ms)</div>

<!-- Force normal duration -->
<div class="animate-slide-up animate-duration-normal">Normal (600ms)</div>

<!-- Force slow duration -->
<div class="animate-scale-up animate-duration-slow">Slow (900ms)</div>

<!-- Force slower duration -->
<div class="animate-hero animate-duration-slower">Slower (1200ms)</div>
```

**Classes:**
- `animate-duration-fast` - 300ms
- `animate-duration-normal` - 600ms
- `animate-duration-slow` - 900ms
- `animate-duration-slower` - 1200ms

### Delay Modifiers

```html
<!-- Delay animation start -->
<div class="animate-fade-in animate-delay-100">100ms delay</div>
<div class="animate-fade-in animate-delay-200">200ms delay</div>
<div class="animate-fade-in animate-delay-300">300ms delay</div>
<div class="animate-fade-in animate-delay-400">400ms delay</div>
<div class="animate-fade-in animate-delay-500">500ms delay</div>
```

**Classes:**
- `animate-delay-100` - 100ms delay
- `animate-delay-200` - 200ms delay
- `animate-delay-300` - 300ms delay
- `animate-delay-400` - 400ms delay
- `animate-delay-500` - 500ms delay

---

## JavaScript API

### Configuration

```javascript
// Access configuration
window.GeminiAnimations.config

// Modify settings
window.GeminiAnimations.config.observerOptions.rootMargin = '0px 0px -50px 0px';
window.GeminiAnimations.config.parallaxEnabled = false;
```

### Methods

```javascript
// Refresh scroll animations (re-observe elements)
window.GeminiAnimations.refresh();

// Update parallax
window.GeminiAnimations.updateParallax();

// Update scroll progress
window.GeminiAnimations.updateProgress();
```

### Custom Configuration

```javascript
// Example: Disable scroll progress bar
window.GeminiAnimations.config.scrollProgressEnabled = false;

// Example: Change stagger delay
window.GeminiAnimations.config.staggerDelay = 150; // 150ms instead of 100ms
```

---

## Performance

### GPU Acceleration

All animations use `transform` and `opacity` for GPU acceleration:

```css
/* GPU-accelerated properties */
transform: translateY(40px); /* ✅ Fast */
opacity: 0; /* ✅ Fast */

/* Avoid these in animations */
top: 40px; /* ❌ Slow (layout) */
margin-top: 40px; /* ❌ Slow (layout) */
```

### Intersection Observer

Uses modern Intersection Observer API instead of scroll listeners:

- Extremely performant (runs on compositor thread)
- Battery-efficient (no continuous scroll calculations)
- Triggers only when elements enter/exit viewport

### Mobile Optimization

Animations are simplified on mobile:

```css
@media (max-width: 768px) {
  /* Faster durations */
  [class*="animate-"] {
    transition-duration: var(--anim-duration-fast) !important;
  }

  /* No stagger delays */
  .animate-stagger > * {
    transition-delay: 0ms !important;
  }

  /* No parallax */
  .parallax-slow, .parallax-medium, .parallax-fast {
    transform: none !important;
  }
}
```

### Performance Tips

1. **Limit animated elements**: Don't animate everything
2. **Use `will-change` sparingly**: Only on actively animating elements
3. **Avoid animating many items simultaneously**: Use stagger effects
4. **Test on real devices**: Performance varies across devices

---

## Accessibility

### Respects `prefers-reduced-motion`

Users with motion sensitivity will see instant transitions:

```css
@media (prefers-reduced-motion: reduce) {
  [class*="animate-"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

The JavaScript also checks:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  console.log('Animations disabled: prefers-reduced-motion is enabled');
  return; // Exit without initializing animations
}
```

### Focus Management

All interactive elements maintain proper focus states:

```css
.hover-lift:focus,
.hover-scale:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Print Styles

Animations are disabled in print:

```css
@media print {
  [class*="animate-"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Examples

### Hero Section

```html
<section class="hero">
  <h1 class="animate-hero">
    Transform your workflow with Gemini
  </h1>
  <p class="animate-fade-slide-up animate-delay-200">
    AI-powered assistance that understands you
  </p>
  <div class="cta-buttons animate-fade-in animate-delay-400">
    <button class="btn-primary hover-lift">Get Started</button>
    <button class="btn-secondary hover-scale">Learn More</button>
  </div>
</section>
```

### Feature Grid

```html
<div class="feature-grid animate-stagger">
  <div class="feature-card animate-slide-up hover-lift">
    <h3>Fast</h3>
    <p>Lightning-quick responses</p>
  </div>
  <div class="feature-card animate-slide-up hover-lift">
    <h3>Smart</h3>
    <p>Contextual understanding</p>
  </div>
  <div class="feature-card animate-slide-up hover-lift">
    <h3>Secure</h3>
    <p>Enterprise-grade protection</p>
  </div>
</div>
```

### Testimonial Section

```html
<section class="testimonials">
  <h2 class="animate-fade-in">What our users say</h2>

  <div class="testimonial-list animate-stagger-slow">
    <blockquote class="animate-fade-slide-up">
      "Game-changing for my workflow"
    </blockquote>
    <blockquote class="animate-fade-slide-up">
      "Best AI assistant I've used"
    </blockquote>
    <blockquote class="animate-fade-slide-up">
      "Saves me hours every day"
    </blockquote>
  </div>
</section>
```

### Parallax Background

```html
<section class="parallax-section">
  <div class="parallax-container">
    <div class="parallax-slow" style="background: url('bg.jpg')"></div>
    <div class="parallax-medium content">
      <h2 class="animate-fade-in">Content over parallax</h2>
    </div>
  </div>
</section>
```

---

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 13+)
- **Mobile**: Optimized animations

### Required APIs

- Intersection Observer API (2017+)
- CSS Custom Properties (2016+)
- CSS Transforms (2012+)
- ES6 (2015+)

All modern browsers support these features.

---

## Troubleshooting

### Animations not triggering

1. **Check JavaScript is loaded**: Look for `window.GeminiAnimations` in console
2. **Check CSS is loaded**: Verify `animations.css` in Network tab
3. **Check element visibility**: Element must be at least 10% visible
4. **Check console**: Look for initialization messages

### Animations too slow/fast

```html
<!-- Override duration -->
<div class="animate-fade-in animate-duration-fast">Faster</div>

<!-- Or modify CSS variable -->
<style>
  :root {
    --anim-duration-normal: 400ms; /* Default is 600ms */
  }
</style>
```

### Parallax not working

1. **Mobile**: Parallax is disabled on mobile (<768px)
2. **Reduced motion**: Disabled when user prefers reduced motion
3. **Element visibility**: Must be in/near viewport

### Stagger not working

Ensure animations are on **direct children**:

```html
<!-- ✅ Correct -->
<div class="animate-stagger">
  <div class="animate-fade-in">Child 1</div>
  <div class="animate-fade-in">Child 2</div>
</div>

<!-- ❌ Wrong (nested too deep) -->
<div class="animate-stagger">
  <div>
    <div class="animate-fade-in">Won't stagger</div>
  </div>
</div>
```

---

## CSS Variables Reference

```css
/* Durations */
--anim-duration-fast: 300ms;
--anim-duration-normal: 600ms;
--anim-duration-slow: 900ms;
--anim-duration-slower: 1200ms;

/* Easing (Apple-style) */
--anim-ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--anim-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--anim-ease-apple: cubic-bezier(0.4, 0.0, 0.2, 1);
--anim-ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--anim-ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);

/* Delays */
--anim-delay-1: 0ms;
--anim-delay-2: 100ms;
--anim-delay-3: 200ms;
--anim-delay-4: 300ms;
--anim-delay-5: 400ms;

/* Distances */
--anim-distance-sm: 20px;
--anim-distance-md: 40px;
--anim-distance-lg: 60px;
--anim-distance-xl: 100px;
```

---

## Next Steps

1. **Test your animations**: Use `tests/animations-test.html` as reference
2. **Run Playwright tests**: `npm run test:animations`
3. **Check performance**: Use browser DevTools Performance tab
4. **Test accessibility**: Enable reduced motion in your OS settings

For more examples, see:
- `tests/animations-test.html` - Full demo page
- `docs/component-library-docs.md` - Component integration
- `docs/apple-design-research.md` - Design inspiration

---

## Credits

Inspired by Apple.com's animation philosophy:
- Subtle, purposeful motion
- Performance-first approach
- Accessibility by default
- Premium feel without excess
