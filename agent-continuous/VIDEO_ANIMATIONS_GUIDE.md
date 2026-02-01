# Video Animations Guide

Complete guide to implementing Apple-style video animations and visual effects for Gemini landing pages.

## Table of Contents

1. [Overview](#overview)
2. [Video Formats & Optimization](#video-formats--optimization)
3. [Implementation Methods](#implementation-methods)
4. [Usage Examples](#usage-examples)
5. [Performance Best Practices](#performance-best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

We've implemented multiple approaches for adding video-like animations to our static GitHub Pages site:

### Available Animation Types

1. **HTML5 Video Elements** - Actual video files (MP4/WebM)
2. **Canvas Image Sequences** - Apple's signature scroll-driven frame animations
3. **Animated SVGs** - Lightweight vector graphics that draw on scroll
4. **Text Morphing** - Smooth transitions between different text strings
5. **Scroll-Synced Playback** - Videos that play based on scroll position

All implementations are:
- ✅ GitHub Pages compatible (no backend required)
- ✅ Accessibility-aware (respects `prefers-reduced-motion`)
- ✅ Performance-optimized (Intersection Observer, requestAnimationFrame)
- ✅ Mobile-responsive
- ✅ Apple.com-inspired aesthetics

---

## Video Formats & Optimization

### Recommended Formats

For maximum browser compatibility, provide both MP4 and WebM:

```html
<video>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
</video>
```

### File Size Guidelines

| Use Case | Dimensions | Target Size | Duration |
|----------|-----------|-------------|----------|
| Hero background | 1920x1080 | 2-5 MB | 10-20 sec loop |
| Feature showcase | 1280x720 | 1-3 MB | 5-15 sec loop |
| Card/thumbnail | 800x600 | 500 KB - 1 MB | 3-8 sec loop |
| Icon animation | 400x400 | 100-300 KB | 2-5 sec loop |

### Video Compression Tools

**Online Tools:**
- [Handbrake](https://handbrake.fr/) - Free, open-source video converter
- [CloudConvert](https://cloudconvert.com/) - Online conversion to MP4/WebM
- [Clideo](https://clideo.com/compress-video) - Online video compressor

**FFmpeg Commands:**

```bash
# Compress MP4 (H.264)
ffmpeg -i input.mov -vcodec h264 -crf 28 -preset slow -vf scale=1920:1080 output.mp4

# Convert to WebM
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -vf scale=1920:1080 output.webm

# Create seamless loop (duplicate last frame to first)
ffmpeg -i input.mov -filter_complex "loop=loop=0:size=1:start=0" -t 10 output.mp4
```

### Creating Seamless Loops

For looping videos, ensure the last frame matches the first frame:

1. Plan your animation to return to the starting position
2. Use After Effects, Premiere Pro, or similar tools
3. Add crossfade between end and beginning
4. Test the loop for smoothness

---

## Implementation Methods

### 1. Auto-Playing Background Video

Perfect for hero sections. Plays automatically when in viewport, pauses when out.

```html
<video class="apple-video"
       data-autoplay="true"
       data-loop="true"
       muted
       playsinline>
  <source src="assets/videos/hero-bg.mp4" type="video/mp4">
  <source src="assets/videos/hero-bg.webm" type="video/webm">
</video>
```

**Attributes:**
- `data-autoplay="true"` - Auto-play when in viewport
- `data-loop="true"` - Loop continuously
- `muted` - Required for autoplay on mobile
- `playsinline` - Play inline on iOS (not fullscreen)

**CSS Styling:**

```css
.hero-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-section video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  opacity: 0.4; /* Subtle background effect */
}
```

---

### 2. Canvas Image Sequence Animation

Apple's signature technique. Scroll through a sequence of images frame-by-frame.

**Step 1: Export Your Animation**

1. Create animation in After Effects, Blender, Cinema 4D, etc.
2. Export as image sequence (PNG or JPG)
3. Name files: `frame-0001.jpg`, `frame-0002.jpg`, etc.
4. Recommended: 60-150 frames for smooth animation

**Step 2: Optimize Images**

```bash
# Batch optimize JPGs (requires ImageMagick)
mogrify -resize 1920x1080 -quality 85 frame-*.jpg

# Or use online tools like TinyPNG, Squoosh
```

**Step 3: Add to HTML**

```html
<canvas id="product-animation"
        data-frame-count="150"
        data-frame-path="assets/images/sequence/frame-{index}.jpg"
        data-frame-start="1"
        width="1920"
        height="1080">
</canvas>
```

**Step 4: JavaScript Initialization**

```javascript
// Automatically initialized by video-animations.js
// Or manually:
const canvas = document.getElementById('product-animation');
const sequence = new CanvasSequence(canvas, {
  frameCount: 150,
  framePath: 'assets/images/sequence/frame-{index}.jpg',
  frameStart: 1,
  scrollStart: 0,    // Start at 0% scroll
  scrollEnd: 1       // End at 100% scroll
});
```

---

### 3. Scroll-Driven Video Playback

Video that plays in sync with scroll position (not auto-playing).

```html
<video class="apple-video"
       data-scroll-play="true"
       muted
       playsinline>
  <source src="assets/videos/scroll-demo.mp4" type="video/mp4">
</video>
```

**Use Cases:**
- Product reveals
- Step-by-step tutorials
- Interactive storytelling

---

### 4. Animated SVG Graphics

Lightweight icons and illustrations that draw themselves on scroll.

```html
<svg data-animate-draw viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke="#4285f4" stroke-width="2" fill="none"/>
  <path d="M 30,50 L 45,65 L 70,35" stroke="#4285f4" stroke-width="3" fill="none"/>
</svg>
```

**Custom Styling:**

```css
svg[data-animate-draw] {
  width: 120px;
  height: 120px;
  stroke: var(--accent-primary);
  stroke-width: 2;
  fill: none;
}
```

---

### 5. Text Morphing Animation

Smooth transitions between different text phrases.

```html
<div class="hero-title"
     data-text-morph="Write better|Code faster|Research deeper">
  Write better
</div>
```

**Configuration:**

```javascript
// Auto-initialized, or manually:
const element = document.querySelector('.hero-title');
new TextMorph(element, ['Write better', 'Code faster', 'Research deeper'], {
  interval: 3000,      // Switch every 3 seconds
  morphDuration: 800   // 800ms transition
});
```

---

## Usage Examples

### Example 1: Hero Section with Video Background

```html
<section class="hero">
  <video class="apple-video" data-autoplay="true" data-loop="true" muted playsinline>
    <source src="assets/videos/gemini-hero.mp4" type="video/mp4">
    <source src="assets/videos/gemini-hero.webm" type="video/webm">
  </video>

  <div class="hero-content">
    <h1>Intelligence You Can Trust</h1>
    <p>Gemini brings Google AI to your fingertips</p>
    <a href="#" class="btn btn-primary">Get Started</a>
  </div>
</section>

<style>
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}
</style>
```

---

### Example 2: Feature Showcase with Side-by-Side Video

```html
<section class="feature">
  <div class="feature-video">
    <video class="apple-video" data-autoplay="true" data-loop="true" muted playsinline>
      <source src="assets/videos/citations-demo.mp4" type="video/mp4">
    </video>
  </div>

  <div class="feature-text">
    <h2>Citations You Can Trust</h2>
    <p>Every answer includes verifiable sources and citations</p>
    <a href="#" class="btn btn-primary">Learn More</a>
  </div>
</section>

<style>
.feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 6rem 2rem;
}

.feature-video video {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 30px 90px rgba(0,0,0,0.2);
}

@media (max-width: 968px) {
  .feature {
    grid-template-columns: 1fr;
  }
}
</style>
```

---

### Example 3: Product Scroll Animation (Canvas Sequence)

```html
<section class="product-reveal">
  <canvas id="product-animation"
          data-frame-count="120"
          data-frame-path="assets/images/product/frame-{index}.jpg"
          data-frame-start="1"
          width="1920"
          height="1080">
  </canvas>

  <div class="product-description">
    <h2>Scroll to explore</h2>
    <p>See every detail of Gemini's interface</p>
  </div>
</section>

<style>
.product-reveal {
  min-height: 300vh; /* Tall section for smooth scrolling */
  position: relative;
}

.product-reveal canvas {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: block;
}

.product-description {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 10;
}
</style>
```

---

## Performance Best Practices

### 1. Lazy Loading

Videos are automatically lazy-loaded using Intersection Observer. Only load videos when they're about to enter the viewport.

### 2. Reduce Motion Preference

Respect user accessibility preferences:

```css
@media (prefers-reduced-motion: reduce) {
  video,
  canvas,
  [data-animate] {
    animation: none !important;
    transition: none !important;
  }
}
```

### 3. Optimize Video Settings

- Use H.264 codec for MP4 (best compatibility)
- Use VP9 codec for WebM (better compression)
- Set CRF 28-32 for good quality/size balance
- Remove audio track if not needed (`-an` in FFmpeg)
- Use progressive encoding (not interlaced)

### 4. Image Sequence Optimization

- Use JPG for photographic content (smaller)
- Use PNG for graphics with transparency
- Compress images to 50-150 KB each
- Load 10-20 frames ahead of current position
- Unload frames that are far from current position

### 5. Mobile Considerations

```javascript
// Detect mobile and reduce quality
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

if (isMobile) {
  // Use lower resolution videos
  video.src = 'assets/videos/demo-mobile.mp4';
  // Or reduce frame count for canvas sequences
  canvasSequence.frameCount = 60; // Instead of 150
}
```

---

## Troubleshooting

### Video Not Auto-Playing

**Problem:** Video doesn't start automatically

**Solutions:**
1. Ensure `muted` attribute is present (required for autoplay)
2. Add `playsinline` for iOS compatibility
3. Check browser console for autoplay policy errors
4. Use `data-autoplay="true"` to enable Intersection Observer autoplay

```html
<!-- Correct -->
<video class="apple-video" data-autoplay="true" muted playsinline>
  <source src="video.mp4" type="video/mp4">
</video>
```

---

### Canvas Sequence Not Loading

**Problem:** Canvas remains blank or shows error

**Solutions:**
1. Check that image paths are correct
2. Verify image files are numbered correctly (0001, 0002, etc.)
3. Check browser console for 404 errors
4. Ensure canvas has width/height attributes
5. Verify images are optimized and not too large

```javascript
// Debug mode - log frame loading
const canvas = document.getElementById('scroll-sequence');
canvas.addEventListener('load', () => {
  console.log('Frame loaded successfully');
});
```

---

### Performance Issues

**Problem:** Page stutters or lags during scroll

**Solutions:**
1. Reduce video file sizes (compress more aggressively)
2. Lower frame rate (30fps instead of 60fps)
3. Reduce canvas sequence frame count
4. Use smaller image dimensions
5. Implement progressive loading

```javascript
// Throttle scroll updates
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Update animations
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

---

### Mobile Video Issues

**Problem:** Videos don't work properly on iOS/Android

**Solutions:**
1. Add `playsinline` attribute (critical for iOS)
2. Ensure videos are muted for autoplay
3. Use H.264 baseline profile for compatibility
4. Provide lower-resolution versions for mobile
5. Test on actual devices, not just emulators

```html
<!-- iOS-compatible video -->
<video class="apple-video"
       data-autoplay="true"
       muted
       playsinline
       webkit-playsinline>
  <source src="video.mp4" type="video/mp4">
</video>
```

---

## File Structure

Recommended folder structure for video assets:

```
gemini-ad/
├── assets/
│   ├── videos/
│   │   ├── hero-background.mp4
│   │   ├── hero-background.webm
│   │   ├── hero-background-mobile.mp4
│   │   ├── citations-demo.mp4
│   │   ├── workspace-demo.mp4
│   │   └── feature-*.mp4
│   ├── images/
│   │   └── sequence/
│   │       ├── product/
│   │       │   ├── frame-0001.jpg
│   │       │   ├── frame-0002.jpg
│   │       │   └── ...
│   │       └── hero/
│   │           ├── frame-0001.jpg
│   │           └── ...
│   ├── css/
│   │   └── shared-styles.css
│   └── js/
│       ├── animations.js
│       └── video-animations.js
└── pages/
    ├── animations-demo.html
    └── ...
```

---

## Resources

### Video Creation Tools

- **After Effects** - Professional motion graphics
- **Blender** - Free 3D animation software
- **Keynote/PowerPoint** - Simple animations, export as video
- **Canva** - Online video creation tool
- **Kapwing** - Online video editor

### Stock Video Sources

- **Pexels Videos** - Free stock videos
- **Pixabay** - Free videos and animations
- **Coverr** - Free videos for websites
- **Videvo** - Free stock footage

### Optimization Tools

- **Handbrake** - Video compression
- **FFmpeg** - Command-line video processing
- **Adobe Media Encoder** - Professional encoding
- **CloudConvert** - Online conversion
- **Squoosh** - Image optimization (for canvas sequences)

---

## Next Steps

1. **Create Your First Video**: Export a 5-10 second looping animation
2. **Compress It**: Use Handbrake or FFmpeg to get under 2 MB
3. **Add to Page**: Use the examples above as templates
4. **Test Performance**: Check on mobile devices and slower connections
5. **Iterate**: Refine based on user feedback and analytics

For questions or issues, refer to:
- `assets/js/video-animations.js` - Implementation code
- `pages/animations-demo.html` - Working examples
- `apple-design-research.md` - Design inspiration

---

**Pro Tip**: Start with one simple autoplay video in a hero section, then gradually add more complex animations as you become comfortable with the implementation.
