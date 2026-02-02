# Hero Media Guide

Complete guide to using premium video backgrounds and animated SVG graphics in Gemini Ads landing pages.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Video Backgrounds](#video-backgrounds)
- [SVG Graphics](#svg-graphics)
- [Canvas Particles](#canvas-particles)
- [JavaScript API](#javascript-api)
- [CSS Customization](#css-customization)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Best Practices](#best-practices)

---

## Overview

The Hero Media system provides Apple.com-inspired premium backgrounds for landing pages:

- **Video Backgrounds**: Full-screen video with fallback images
- **Animated SVGs**: 10 pre-built animated graphic presets
- **Canvas Particles**: Real-time particle systems
- **60fps Performance**: GPU-accelerated animations
- **Accessibility**: Respects `prefers-reduced-motion`
- **Responsive**: Optimized for all screen sizes

### Files

```
assets/
├── css/
│   └── hero-media.css          (11 KB - Styles)
├── js/
│   └── hero-media.js           (10 KB - Core functionality)
└── svg/
    └── hero-graphics.svg       (17 KB - SVG library)
```

---

## Quick Start

### 1. Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="../assets/css/hero-media.css">

<!-- SVG Library (inline in body, before closing </body>) -->
<script>
  fetch('../assets/svg/hero-graphics.svg')
    .then(response => response.text())
    .then(svg => {
      const div = document.createElement('div');
      div.innerHTML = svg;
      document.body.insertBefore(div.firstChild, document.body.firstChild);
    });
</script>

<!-- JavaScript -->
<script src="../assets/js/hero-media.js"></script>
```

### 2. Add Hero Media

**SVG Graphics:**
```html
<section class="hero" data-hero-svg="gradient-blob-1" data-hero-svg-opacity="0.5">
  <div class="hero-content">
    <h1>Your Hero Title</h1>
    <p>Your hero description</p>
  </div>
</section>
```

**Video Background:**
```html
<section class="hero"
         data-hero-video="../assets/videos/hero.mp4"
         data-hero-fallback="../assets/images/hero-fallback.jpg"
         data-hero-autoplay="true"
         data-hero-loop="true"
         data-hero-muted="true">
  <div class="hero-content">
    <h1>Your Hero Title</h1>
  </div>
</section>
```

---

## Video Backgrounds

### Basic Usage

```html
<div data-hero-video="path/to/video.mp4"
     data-hero-fallback="path/to/fallback.jpg">
  <div class="hero-content">
    <!-- Your content here -->
  </div>
</div>
```

### Data Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-hero-video` | string | required | Path to video file (.mp4, .webm, .ogg) |
| `data-hero-fallback` | string | optional | Fallback image if video fails to load |
| `data-hero-autoplay` | boolean | `true` | Auto-play video on load |
| `data-hero-loop` | boolean | `true` | Loop video continuously |
| `data-hero-muted` | boolean | `true` | Mute video audio |

### Video Formats

Recommended formats for best browser support:

```html
<!-- MP4 (best compatibility) -->
<div data-hero-video="video.mp4">

<!-- WebM (smaller size) -->
<div data-hero-video="video.webm">

<!-- Multiple sources (handled automatically) -->
```

### Video Optimization

**Recommended specifications:**
- Resolution: 1920×1080 (Full HD)
- Codec: H.264 (MP4) or VP9 (WebM)
- Bitrate: 2-5 Mbps
- Duration: 10-30 seconds (if looping)
- Frame rate: 30fps
- File size: < 5 MB

**Compression tips:**
```bash
# Using FFmpeg to optimize video
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -vf scale=1920:1080 -an output.mp4
```

### Video Effects

**Duotone Effect:**
```html
<div class="hero-video-duotone" data-hero-video="video.mp4">
```

**Black & White:**
```html
<div class="hero-video-bw" data-hero-video="video.mp4">
```

**Blur Effect:**
```html
<div class="hero-video-blur" data-hero-video="video.mp4">
```

**Zoom Effect:**
```html
<div class="hero-video-zoom" data-hero-video="video.mp4">
```

**Pan Effect:**
```html
<div class="hero-video-pan" data-hero-video="video.mp4">
```

---

## SVG Graphics

### Available Graphics

| ID | Description | Use Case |
|----|-------------|----------|
| `gradient-blob-1` | Morphing blob with Google colors | Creative, dynamic designs |
| `gradient-blob-2` | Rotating ellipse blob | Organic, fluid aesthetics |
| `abstract-lines` | Flowing wave lines | Professional, clean designs |
| `particle-field` | Floating particles | Tech, innovation themes |
| `geometric-mesh` | Grid with animated nodes | Data, analytics pages |
| `tech-circuit` | Circuit board paths | AI, technology showcases |
| `gradient-wave` | Multi-layer waves | Calm, flowing designs |
| `abstract-dots` | Grid of pulsing dots | Minimal, modern look |
| `hexagon-grid` | Hexagonal pattern | Technical, futuristic |
| `sparkles` | Twinkling sparkles | Magic, delight |
| `connection-network` | Connected node graph | Integration, connectivity |

### Basic Usage

```html
<div data-hero-svg="gradient-blob-1"
     data-hero-svg-opacity="0.5"
     data-hero-svg-color="#4285f4">
  <div class="hero-content">
    <!-- Your content -->
  </div>
</div>
```

### Data Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-hero-svg` | string | required | SVG symbol ID (see table above) |
| `data-hero-svg-opacity` | number | `0.5` | Opacity (0-1) |
| `data-hero-svg-color` | color | varies | Override SVG colors |

### SVG Animation Classes

Add these classes to the SVG container for extra effects:

```html
<!-- Floating animation -->
<div data-hero-svg="gradient-blob-1" class="hero-svg-float">

<!-- Rotation animation -->
<div data-hero-svg="geometric-mesh" class="hero-svg-rotate">

<!-- Pulse animation -->
<div data-hero-svg="particle-field" class="hero-svg-pulse">

<!-- Fade in/out animation -->
<div data-hero-svg="abstract-lines" class="hero-svg-fade">
```

### SVG Positioning

Use utility classes to position SVGs:

```html
<!-- Top left corner -->
<div data-hero-svg="sparkles" class="hero-svg-top-left">

<!-- Center -->
<div data-hero-svg="gradient-blob-1" class="hero-svg-center">

<!-- Bottom right -->
<div data-hero-svg="abstract-dots" class="hero-svg-bottom-right">
```

---

## Canvas Particles

Create real-time particle systems using JavaScript:

```javascript
// Basic usage
HeroMediaUtils.createParticleBackground(element, {
  particleCount: 50,      // Number of particles
  color: '#4285f4',       // Particle color
  opacity: 0.5,           // Particle opacity (0-1)
  speed: 1,               // Movement speed
  size: 2                 // Particle size (pixels)
});
```

### Example

```html
<section id="hero" class="hero">
  <div class="hero-content">
    <h1>Hero Title</h1>
  </div>
</section>

<script>
  const hero = document.getElementById('hero');
  HeroMediaUtils.createParticleBackground(hero, {
    particleCount: 100,
    color: '#4285f4',
    opacity: 0.6,
    speed: 0.5,
    size: 3
  });
</script>
```

---

## JavaScript API

### HeroMedia Object

The main object for controlling hero media:

```javascript
// Manual initialization
HeroMedia.init();

// Initialize video backgrounds only
HeroMedia.initVideoBackgrounds();

// Initialize SVG graphics only
HeroMedia.initSVGGraphics();

// Play a specific video
HeroMedia.playVideo(videoElement);
```

### HeroMediaUtils Object

Utility functions for programmatic control:

#### Add Video Background

```javascript
HeroMediaUtils.addVideoBackground(element, videoSrc, {
  autoplay: true,
  loop: true,
  muted: true,
  fallback: 'fallback.jpg',
  overlay: true,
  overlayOpacity: 0.5
});
```

#### Add SVG Graphic

```javascript
HeroMediaUtils.addSVGGraphic(element, 'gradient-blob-1', {
  color: '#4285f4',
  opacity: 0.5,
  position: 'absolute'
});
```

#### Create Gradient Overlay

```javascript
HeroMedia.createGradientOverlay(container, '#4285f4,#34a853', 135);
```

---

## CSS Customization

### Overlay Customization

```css
/* Custom overlay gradient */
.my-hero .hero-video-overlay {
  background: linear-gradient(
    135deg,
    rgba(66, 133, 244, 0.5) 0%,
    rgba(52, 168, 83, 0.5) 100%
  );
}
```

### Opacity Utilities

```html
<div data-hero-svg="gradient-blob-1" class="hero-media-opacity-30">
<div data-hero-svg="particle-field" class="hero-media-opacity-70">
```

Available: `hero-media-opacity-10` through `hero-media-opacity-90` (increments of 10)

### Z-Index Utilities

```html
<div data-hero-svg="gradient-blob-1" class="hero-media-z-0">
<div data-hero-svg="particle-field" class="hero-media-z-10">
```

Available: `hero-media-z-0`, `hero-media-z-1`, `hero-media-z-2`, `hero-media-z-10`

---

## Performance

### Optimization Features

✅ **Lazy Loading**: Videos/SVGs load only when in viewport
✅ **GPU Acceleration**: Hardware-accelerated CSS transforms
✅ **Intersection Observer**: Auto-pause videos when off-screen
✅ **Will-Change**: Optimized animation performance
✅ **Preload Metadata**: Videos preload metadata only

### Performance Metrics

- **CSS**: 11 KB (3 KB gzipped)
- **JavaScript**: 10 KB (4 KB gzipped)
- **SVG Library**: 17 KB (5 KB gzipped)
- **Total**: 38 KB (12 KB gzipped)

### Video Loading

Videos use `preload="metadata"` by default:
- Only metadata loads initially (~5-50 KB)
- Full video loads when needed
- Fallback image shown during load

### Mobile Optimization

Hide videos on mobile if needed:

```html
<div class="hero-video-mobile-hide" data-hero-video="video.mp4">
```

---

## Accessibility

### Reduced Motion Support

Respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Videos are hidden */
  /* SVG animations are disabled */
  /* Fallback images shown */
}
```

### Screen Readers

All media elements are properly hidden from screen readers:

```html
<svg aria-hidden="true">
  <!-- SVG content -->
</svg>
```

### ARIA Attributes

Hero media is decorative and marked appropriately:

```javascript
svg.setAttribute('aria-hidden', 'true');
video.setAttribute('aria-hidden', 'true');
```

### Keyboard Navigation

No focus traps or keyboard issues. All interactive elements remain accessible.

---

## Browser Support

| Browser | Video | SVG | Canvas |
|---------|-------|-----|--------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ✅ | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |
| iOS Safari 14+ | ✅ | ✅ | ✅ |
| Android Chrome 90+ | ✅ | ✅ | ✅ |

### Fallbacks

- **No video support**: Fallback image shown
- **No Intersection Observer**: Videos load immediately
- **Reduced motion**: Static fallback images

---

## Best Practices

### 1. Video Backgrounds

✅ **DO:**
- Use short loops (10-30 seconds)
- Compress videos (< 5 MB)
- Always provide fallback images
- Mute videos by default
- Use subtle, non-distracting content

❌ **DON'T:**
- Use videos with important visual information
- Autoplay with sound
- Use videos > 10 MB
- Forget fallback images
- Use fast-moving or distracting content

### 2. SVG Graphics

✅ **DO:**
- Use appropriate opacity (0.3-0.6 recommended)
- Match SVG theme to page content
- Combine multiple SVGs for layered effects
- Test on different backgrounds

❌ **DON'T:**
- Make SVGs too prominent (opacity > 0.7)
- Use conflicting animation styles
- Overload pages with too many SVGs

### 3. Performance

✅ **DO:**
- Test on mobile devices
- Monitor Core Web Vitals
- Use lazy loading (enabled by default)
- Optimize video files
- Use appropriate viewport sizes

❌ **DON'T:**
- Load multiple videos simultaneously
- Use uncompressed media files
- Ignore mobile performance
- Skip fallback images

### 4. Accessibility

✅ **DO:**
- Test with screen readers
- Respect reduced motion preferences
- Ensure text contrast over media
- Provide alternative content

❌ **DON'T:**
- Force animations on users
- Hide critical content behind media
- Ignore accessibility guidelines

---

## Examples

### Example 1: Simple SVG Hero

```html
<section class="hero" data-hero-svg="gradient-blob-1" data-hero-svg-opacity="0.4">
  <div class="hero-content">
    <h1>Welcome to Gemini</h1>
    <p>AI that works with you</p>
    <a href="#cta" class="cta-button">Get Started</a>
  </div>
</section>
```

### Example 2: Video with Overlay

```html
<section class="hero"
         data-hero-video="hero.mp4"
         data-hero-fallback="hero.jpg">
  <div class="hero-video-overlay"></div>
  <div class="hero-content">
    <h1>Premium AI Experience</h1>
    <p>Powered by Google</p>
  </div>
</section>
```

### Example 3: Layered SVGs

```html
<section class="hero" style="position: relative;">
  <!-- Background layer -->
  <div data-hero-svg="gradient-wave" data-hero-svg-opacity="0.3" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>

  <!-- Foreground layer -->
  <div data-hero-svg="sparkles" data-hero-svg-opacity="0.6" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>

  <!-- Content -->
  <div class="hero-content">
    <h1>Magic Happens Here</h1>
  </div>
</section>
```

### Example 4: Programmatic Creation

```javascript
// Get hero element
const hero = document.querySelector('.hero');

// Add video background
HeroMediaUtils.addVideoBackground(hero, 'video.mp4', {
  fallback: 'fallback.jpg',
  overlay: true,
  overlayOpacity: 0.6
});

// Or add SVG graphic
HeroMediaUtils.addSVGGraphic(hero, 'gradient-blob-1', {
  opacity: 0.5,
  color: '#4285f4'
});

// Or add canvas particles
HeroMediaUtils.createParticleBackground(hero, {
  particleCount: 50,
  color: '#4285f4',
  speed: 1
});
```

---

## Testing

### Visual Testing

```bash
# Open demo page
open pages/hero-media-demo.html

# Run Playwright tests
npm run test:hero-media
```

### Performance Testing

```javascript
// Check video load time
const video = document.querySelector('.hero-video');
video.addEventListener('loadeddata', () => {
  console.log('Video loaded');
});

// Check SVG render time
const svg = document.querySelector('.hero-svg');
console.log('SVG rendered:', svg !== null);
```

---

## Troubleshooting

### Video Not Playing

1. Check video format (MP4 recommended)
2. Ensure video is muted (autoplay requires muted)
3. Check browser console for errors
4. Verify video path is correct
5. Test fallback image displays

### SVG Not Showing

1. Ensure SVG sprite is loaded
2. Check SVG ID matches available graphics
3. Verify opacity is not too low
4. Check z-index stacking
5. Inspect element in dev tools

### Performance Issues

1. Compress videos (< 5 MB)
2. Reduce particle count
3. Lower SVG opacity
4. Enable mobile hiding for videos
5. Check for multiple concurrent videos

### Accessibility Issues

1. Test with `prefers-reduced-motion`
2. Verify screen reader compatibility
3. Check keyboard navigation
4. Test contrast ratios
5. Ensure ARIA attributes present

---

## Support

For issues or questions:
1. Check this documentation
2. View demo page: `pages/hero-media-demo.html`
3. Review test file: `tests/hero-media.spec.js`
4. Check browser console for errors

---

## Changelog

### Version 1.0.0 (2026-02-01)
- Initial release
- 10 animated SVG presets
- Video background system
- Canvas particle system
- Full accessibility support
- Mobile optimization
- Comprehensive documentation

---

**Built with ❤️ for Gemini Ads**
