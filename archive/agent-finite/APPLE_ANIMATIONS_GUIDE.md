# Apple-Inspired Animation Library

Complete guide to using Apple.com-style animations in your Gemini Ads landing pages.

## Overview

This animation library brings premium, Apple-inspired effects to create engaging, cinematic user experiences using pure CSS and JavaScript. No frameworks or external dependencies required.

## Features

✅ **Parallax Scrolling** - Smooth depth and movement effects
✅ **Product Showcases** - Staggered reveal animations
✅ **SVG Path Animations** - Vector drawing effects
✅ **Canvas Particles** - Dynamic particle systems
✅ **Scroll Sequences** - Video-like scroll-based animations
✅ **Magnetic Buttons** - Cursor-following interactions
✅ **Text Reveals** - Character-by-character animations
✅ **Counter Animations** - Smooth number counting
✅ **3D Transforms** - Perspective and depth effects
✅ **Performance Optimized** - GPU-accelerated, 60fps smooth

## Installation

### 1. Include Required Files

```html
<!-- CSS -->
<link rel="stylesheet" href="../assets/css/design-system.css">
<link rel="stylesheet" href="../assets/css/apple-animations.css">

<!-- JavaScript -->
<script src="../assets/js/apple-animations.js"></script>
```

### 2. Initialize

The library auto-initializes on page load. No manual initialization required.

## Usage Guide

### Parallax Scrolling

Create depth with elements that move at different speeds:

```html
<!-- Parallax element moving on Y-axis -->
<div data-parallax="0.5" data-parallax-direction="y">
  <h2>This moves slower than scroll</h2>
</div>

<!-- Horizontal parallax -->
<div data-parallax="0.3" data-parallax-direction="x">
  <img src="image.jpg" alt="Slides horizontally">
</div>

<!-- Scale parallax -->
<div data-parallax="0.2" data-parallax-direction="scale">
  <p>This scales as you scroll</p>
</div>
```

**Attributes:**
- `data-parallax` - Speed multiplier (0.1 = slow, 1.0 = fast)
- `data-parallax-direction` - Direction: `y`, `x`, or `scale`

**Best Practices:**
- Use subtle speeds (0.2-0.5) for elegant effects
- Avoid too many parallax elements on one page
- Test on mobile - reduce or disable on small screens

---

### Product Showcase Animations

Staggered reveal effects for features/products:

```html
<!-- Container with showcase attribute -->
<section data-showcase>
  <div class="showcase-grid">
    <!-- Items reveal one by one -->
    <div class="showcase-card" data-showcase-item>
      <h3>Feature 1</h3>
      <p>Description...</p>
    </div>

    <div class="showcase-card" data-showcase-item>
      <h3>Feature 2</h3>
      <p>Description...</p>
    </div>

    <div class="showcase-card" data-showcase-item>
      <h3>Feature 3</h3>
      <p>Description...</p>
    </div>
  </div>
</section>
```

**Features:**
- Auto-detects when items enter viewport
- 200ms stagger delay between items
- Smooth fade + slide animation
- Uses Intersection Observer (performant)

---

### SVG Path Animations

Animated vector drawing effects:

```html
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Animated circle -->
  <circle cx="100" cy="100" r="80"
    data-svg-animate
    data-svg-duration="2000"
    data-svg-delay="0"
    style="stroke: #4285f4; stroke-width: 2; fill: none;" />

  <!-- Animated checkmark -->
  <path d="M 50,100 L 90,140 L 150,60"
    data-svg-animate
    data-svg-duration="1500"
    data-svg-delay="500"
    class="svg-checkmark" />
</svg>
```

**Attributes:**
- `data-svg-animate` - Enables SVG path animation
- `data-svg-duration` - Animation duration in milliseconds
- `data-svg-delay` - Delay before animation starts

**Supported SVG Elements:**
- `<path>` - Any SVG path
- `<circle>` - Circles
- `<rect>` - Rectangles
- `<line>` - Lines
- `<polyline>` - Multi-point lines

---

### Canvas Particle Effects

Beautiful, performant particle systems:

```html
<!-- Container for particles -->
<div class="particles-container" style="position: relative; height: 500px;">
  <canvas data-particles
    data-particle-count="60"
    data-particle-color="#4285f4"></canvas>

  <!-- Your content goes here -->
  <div style="position: relative; z-index: 10;">
    <h2>Content over particles</h2>
  </div>
</div>
```

**Attributes:**
- `data-particles` - Enables particle system
- `data-particle-count` - Number of particles (20-100 recommended)
- `data-particle-color` - Hex color for particles

**Features:**
- Particles move smoothly
- Connected by lines when close
- Auto-scales to container size
- 60fps smooth animation
- Low CPU usage

---

### Scroll Sequence Animations

Video-like animations tied to scroll position:

```html
<section data-sequence
  data-frame-count="100"
  data-scroll-distance="2000"
  style="min-height: 100vh;">

  <div class="sequence-content">
    <h2>This section animates as you scroll</h2>
    <p>Scale, opacity, and position change smoothly</p>
  </div>
</section>
```

**Attributes:**
- `data-sequence` - Enables sequence animation
- `data-frame-count` - Number of "frames" (higher = smoother)
- `data-scroll-distance` - Pixels to scroll for full animation

**Default Effects:**
- Scale from 80% to 100%
- Opacity from 0 to 100%
- TranslateY from 100px to 0

---

### Magnetic Buttons

Buttons that follow cursor movement:

```html
<!-- Basic magnetic button -->
<a href="#" class="magnetic-button" data-magnetic="0.3">
  Click Me
</a>

<!-- Stronger magnetic effect -->
<button class="magnetic-button" data-magnetic="0.5">
  Stronger Pull
</button>
```

**Attributes:**
- `data-magnetic` - Strength (0.1-1.0)
  - 0.1-0.3: Subtle effect
  - 0.4-0.6: Medium effect
  - 0.7-1.0: Strong effect

**CSS Classes:**
- `.magnetic-button` - Pre-styled button (optional)
- Works with any element

---

### Text Reveal Animations

Character-by-character text reveals:

```html
<h1 data-text-reveal>Premium Animations</h1>

<p data-text-reveal>
  Each character animates individually for a stunning effect
</p>
```

**Features:**
- Auto-splits text into individual characters
- 30ms stagger between characters
- Fade + slide animation
- Triggers when text enters viewport
- Only animates once per page load

**Note:** Best for headlines and short text. Avoid on long paragraphs.

---

### Counter Animations

Smooth number counting animations:

```html
<!-- HTML -->
<div class="animated-counter" data-counter-start="0" data-counter-end="1000000">
  0
</div>
<p class="counter-label">Users Worldwide</p>

<!-- JavaScript -->
<script>
  const counter = document.querySelector('.animated-counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        AppleAnimations.animateCounter(entry.target, 0, 1000000, 2000);
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(counter);
</script>
```

**JavaScript API:**
```javascript
AppleAnimations.animateCounter(element, startValue, endValue, duration);
```

**Parameters:**
- `element` - DOM element to animate
- `startValue` - Starting number
- `endValue` - Target number
- `duration` - Animation time in ms

---

### Image Sequence Player

Play through image sequences on scroll (like Apple product videos):

```javascript
// HTML container
<div id="sequence-container" style="height: 100vh;"></div>

// JavaScript
<script>
  const imageUrls = [
    'frame-001.jpg',
    'frame-002.jpg',
    // ... up to 100+ frames
    'frame-100.jpg'
  ];

  const container = document.getElementById('sequence-container');
  AppleAnimations.createImageSequence(container, imageUrls);
</script>
```

**Best Practices:**
- Use 60-120 frames for smooth animation
- Optimize images (compress, resize)
- Use WebP or AVIF format
- Preload images for better performance

---

## Advanced Examples

### Full Hero Section

```html
<section class="hero-section" style="position: relative; height: 100vh;">
  <!-- Particle background -->
  <canvas data-particles
    data-particle-count="80"
    data-particle-color="#4285f4"></canvas>

  <!-- Parallax background elements -->
  <div data-parallax="0.3" style="position: absolute; top: 20%; left: 10%;">
    <div style="width: 400px; height: 400px; background: radial-gradient(circle, rgba(66,133,244,0.3), transparent); filter: blur(60px);"></div>
  </div>

  <!-- Hero content -->
  <div style="position: relative; z-index: 10; text-align: center;">
    <h1 data-text-reveal style="font-size: 96px;">Gemini</h1>
    <p data-text-reveal style="font-size: 32px;">Your AI assistant</p>
    <a href="#" class="magnetic-button" data-magnetic="0.4">Get Started</a>
  </div>
</section>
```

### Product Feature Grid

```html
<section data-showcase style="padding: 120px 0;">
  <div class="showcase-grid">
    <div class="showcase-card" data-showcase-item>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40"
          data-svg-animate
          data-svg-duration="1500"
          style="stroke: #4285f4;" />
      </svg>
      <h3>Fast Responses</h3>
      <p>Get answers in milliseconds</p>
    </div>

    <div class="showcase-card" data-showcase-item>
      <svg viewBox="0 0 100 100">
        <path d="M 30,50 L 45,65 L 70,35"
          data-svg-animate
          data-svg-duration="1200"
          class="svg-checkmark" />
      </svg>
      <h3>Accurate Results</h3>
      <p>Verified citations and sources</p>
    </div>

    <div class="showcase-card" data-showcase-item>
      <svg viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="10"
          data-svg-animate
          data-svg-duration="1800"
          style="stroke: #34a853;" />
      </svg>
      <h3>Seamless Integration</h3>
      <p>Works with Google Workspace</p>
    </div>
  </div>
</section>
```

---

## Performance Optimization

### GPU Acceleration

The library automatically enables GPU acceleration for:
- Parallax transforms
- Sequence animations
- Magnetic button movements
- 3D card transforms

### Reduced Motion Support

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled or minimal */
}
```

### Mobile Considerations

1. **Reduce Particle Count:**
```html
<!-- Desktop: 80 particles -->
<!-- Mobile: 40 particles -->
<canvas data-particles data-particle-count="40"></canvas>
```

2. **Disable Heavy Effects:**
```javascript
// Detect mobile and adjust
if (window.innerWidth < 768) {
  // Reduce parallax speed
  // Disable particles on low-end devices
  // Simplify animations
}
```

3. **Lazy Load Sequences:**
Only initialize image sequences when in viewport

---

## Browser Support

✅ **Chrome/Edge** - Full support
✅ **Firefox** - Full support
✅ **Safari** - Full support (iOS 12+)
✅ **Opera** - Full support
⚠️ **IE11** - Not supported (modern features used)

### Required Browser APIs:
- Intersection Observer
- Canvas 2D Context
- CSS Custom Properties
- RequestAnimationFrame
- ES6 Classes

---

## Troubleshooting

### Animations not working?

1. **Check file inclusion:**
```html
<script src="../assets/js/apple-animations.js"></script>
```

2. **Check console for errors:**
Open DevTools → Console tab

3. **Verify attributes:**
Ensure `data-*` attributes are spelled correctly

### Performance issues?

1. **Reduce particle count:**
Use 20-40 particles instead of 80-100

2. **Limit parallax elements:**
Max 3-5 parallax elements per page

3. **Optimize images:**
Compress and resize images for sequences

### Mobile not smooth?

1. **Test on real device:**
Chrome DevTools mobile emulation ≠ real device

2. **Reduce effects:**
Lower particle counts, disable heavy animations

3. **Use `will-change` sparingly:**
Only on elements that actually animate

---

## Best Practices

### 1. Subtlety is Key
- Apple uses subtle, refined animations
- Less is more - don't overdo effects
- Focus on quality over quantity

### 2. Performance First
- Test on real devices
- Monitor frame rate (aim for 60fps)
- Use Chrome DevTools Performance tab

### 3. Accessibility
- Respect `prefers-reduced-motion`
- Ensure content is accessible without animations
- Don't rely solely on animations for meaning

### 4. Progressive Enhancement
- Content should work without JavaScript
- Animations enhance, not replace functionality
- Test with JS disabled

### 5. Mobile Optimization
- Reduce complexity on mobile
- Test on various devices
- Consider battery usage

---

## Examples in the Wild

Check out these demo pages using the library:

1. **apple-animations-demo.html** - Full showcase of all effects
2. **gemini-creative-studio.html** - Creative use of particles
3. **gemini-minimalist.html** - Subtle parallax and text reveals
4. **gemini-valentines.html** - Animated SVG hearts

---

## API Reference

### AppleAnimations Class

```javascript
// Auto-initializes on page load
const animations = new AppleAnimations();
```

### Static Methods

```javascript
// Enable magnetic buttons
AppleAnimations.enableMagneticButtons();

// Enable text reveals
AppleAnimations.enableTextReveal();

// Animate counter
AppleAnimations.animateCounter(element, start, end, duration);

// Create image sequence
AppleAnimations.createImageSequence(container, imageUrls, options);
```

---

## CSS Classes Reference

### Layout Classes
- `.parallax-container` - Container for parallax sections
- `.parallax-layer` - Individual parallax layer
- `.particles-container` - Container for particle canvas

### Component Classes
- `.showcase-grid` - Grid layout for showcases
- `.showcase-card` - Individual showcase item
- `.magnetic-button` - Pre-styled magnetic button
- `.svg-container` - SVG wrapper with responsive sizing

### Animation Classes
- `.animated-counter` - Counter number styling
- `.counter-label` - Counter description text
- `.video-hero` - Full-screen video-style hero
- `.floating` - Floating animation
- `.pulse` - Pulse animation
- `.glow` - Glow hover effect
- `.shimmer` - Shimmer loading effect
- `.card-3d` - 3D transform card
- `.animated-gradient` - Animated gradient background

---

## Contributing

Found a bug or have a feature request?
1. Check existing issues
2. Create detailed bug report
3. Include browser/device info
4. Provide code example if possible

---

## License

Part of the Gemini Ads project.
© 2024 Google. All rights reserved.

---

## Credits

Inspired by:
- Apple.com animations and interactions
- Modern web animation best practices
- GPU-accelerated performance techniques

Built with ❤️ for Gemini Ads
