# Micro-Interactions Guide

Complete guide to using the Gemini Ads micro-interactions library for enhanced user engagement.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Button Interactions](#button-interactions)
- [Card Interactions](#card-interactions)
- [Link Interactions](#link-interactions)
- [Form Interactions](#form-interactions)
- [Icon Interactions](#icon-interactions)
- [Scroll Interactions](#scroll-interactions)
- [Loading States](#loading-states)
- [Toast Notifications](#toast-notifications)
- [Tooltips](#tooltips)
- [Image Effects](#image-effects)
- [Badge Animations](#badge-animations)
- [JavaScript API](#javascript-api)
- [Best Practices](#best-practices)
- [Accessibility](#accessibility)
- [Performance](#performance)

## Overview

The micro-interactions library provides delightful, subtle interactions that enhance user engagement without overwhelming the user. Inspired by Apple's attention to detail, these interactions are:

- **Smooth**: 60fps animations using GPU acceleration
- **Subtle**: Enhance without distracting
- **Accessible**: Respects `prefers-reduced-motion`
- **Performant**: Minimal JavaScript, CSS-driven when possible
- **Easy to use**: Simple data-attributes and classes

## Installation

Include the CSS and JavaScript files in your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="assets/css/design-system.css">
<link rel="stylesheet" href="assets/css/micro-interactions.css">

<!-- JavaScript -->
<script src="assets/js/micro-interactions.js"></script>
```

The JavaScript auto-initializes on page load. No additional setup required!

## Button Interactions

### Ripple Effect

Creates a ripple animation on click, like Material Design.

```html
<button class="btn btn-ripple">Click Me</button>
```

**When to use**: Primary action buttons, CTAs

### Scale on Press

Button scales down on click for tactile feedback.

```html
<button class="btn btn-scale">Click Me</button>
```

**When to use**: Any clickable button

### Magnetic Button

Button follows the cursor when you hover nearby.

```html
<button class="btn btn-magnetic">Hover Me</button>
```

**When to use**: Hero CTAs, important actions
**Note**: Requires JavaScript

### Glow Effect

Button glows on hover with shadow.

```html
<button class="btn btn-glow">Hover Me</button>
```

**When to use**: Primary CTAs, premium features

### Shimmer Effect

Light sweeps across button on hover.

```html
<button class="btn btn-shimmer">Hover Me</button>
```

**When to use**: Special offers, promotional buttons

### Combined Effects

Stack multiple effects for maximum impact:

```html
<button class="btn btn-ripple btn-scale btn-glow">
  Click Me
</button>
```

## Card Interactions

### Hover Lift

Card lifts up with shadow on hover.

```html
<div class="card card-lift">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

**When to use**: Product cards, blog posts, features

### 3D Tilt

Card tilts in 3D based on cursor position.

```html
<div class="card card-tilt">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

**When to use**: Premium features, hero cards
**Note**: Requires JavaScript, best for large cards

### Glow Border

Rainbow gradient border appears on hover.

```html
<div class="card card-glow">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

**When to use**: Special features, highlighted content

### Shine Effect

Light sweeps across card on hover.

```html
<div class="card card-shine">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

**When to use**: Product showcases, testimonials

## Link Interactions

### Underline Expand

Underline expands from left to right on hover.

```html
<a href="#" class="link-underline">Hover Me</a>
```

**When to use**: Navigation links, text links

### Underline Slide

Underline slides in from left on hover.

```html
<a href="#" class="link-slide">Hover Me</a>
```

**When to use**: Footer links, secondary navigation

### Arrow Reveal

Arrow appears and slides in on hover.

```html
<a href="#" class="link-arrow">Learn More</a>
```

**When to use**: CTAs, "Learn more" links

## Form Interactions

### Focus Glow

Input glows with brand color on focus.

```html
<input type="text" class="input-glow" placeholder="Enter text">
```

**When to use**: All form inputs

### Float Labels

Labels float up when input is focused or has value.

```html
<div class="input-float-label">
  <input type="text" id="name" placeholder=" " required>
  <label for="name">Your Name</label>
</div>
```

**When to use**: Modern forms, space-constrained layouts
**Note**: Requires JavaScript, placeholder=" " (space) is required

### Success Animation

Input pulses on successful validation.

```html
<!-- Applied automatically by validation -->
<input type="text" class="input-success">
```

**When to use**: Form validation feedback

### Error Shake

Input shakes on validation error.

```html
<!-- Applied automatically by validation -->
<input type="text" class="input-error">
```

**When to use**: Form validation feedback

### Form Validation

Automatic validation with animations:

```html
<form data-validate>
  <input type="text" required>
  <button type="submit">Submit</button>
</form>
```

**Features**:
- Shakes invalid inputs
- Pulses valid inputs
- Shows toast notification
- Prevents submission on errors

## Icon Interactions

### Rotate

Icon rotates 90° on hover.

```html
<span class="icon-rotate">⚙️</span>
```

**When to use**: Settings icons, interactive elements

### Bounce

Icon bounces on hover.

```html
<span class="icon-bounce">🎯</span>
```

**When to use**: Achievement icons, positive feedback

### Spin

Icon continuously spins.

```html
<span class="icon-spin">🔄</span>
```

**When to use**: Loading states, refresh indicators

### Pulse

Icon pulses in opacity.

```html
<span class="icon-pulse">💡</span>
```

**When to use**: Notifications, alerts, live indicators

## Scroll Interactions

### Progress Bar

Automatically added to page. Shows scroll progress at top.

**Auto-initialized**: No code required!

**Customize**:
```css
.scroll-progress {
  height: 5px; /* Default: 3px */
  background: linear-gradient(90deg, red, blue); /* Custom gradient */
}
```

### Back to Top Button

Automatically added to page. Appears after scrolling 300px.

**Auto-initialized**: No code required!

**Customize**:
```css
.back-to-top {
  background: #ea4335; /* Custom color */
  right: 20px; /* Custom position */
  bottom: 20px;
}
```

### Scroll Animations

Elements animate into view on scroll.

```html
<div data-scroll-animation="fade-in">
  <h2>Fades in from below</h2>
</div>

<div data-scroll-animation="slide-left">
  <p>Slides in from left</p>
</div>

<div data-scroll-animation="slide-right">
  <p>Slides in from right</p>
</div>

<div data-scroll-animation="scale">
  <p>Scales up</p>
</div>
```

**Animation types**:
- `fade-in`: Fades in with upward movement
- `slide-left`: Slides in from left
- `slide-right`: Slides in from right
- `scale`: Scales up from 90%

### Counter Animation

Numbers animate from 0 to target value when scrolled into view.

```html
<span data-counter="1000">0</span>
<span data-counter="99">0</span>
```

**When to use**: Statistics, metrics, achievements

## Loading States

### Shimmer

Animated shimmer effect for loading states.

```html
<div class="shimmer" style="width: 100%; height: 100px;"></div>
```

**When to use**: Content placeholders

### Skeleton

Skeleton screen with sweeping animation.

```html
<div class="skeleton" style="width: 100%; height: 100px;"></div>
```

**When to use**: Content placeholders, card loading

### Spinner

Circular loading spinner.

```html
<div class="spinner"></div>
```

**When to use**: Button loading, page loading

### Dots Loading

Three animated dots.

```html
<div class="dots-loading">
  <span></span>
  <span></span>
  <span></span>
</div>
```

**When to use**: Inline loading, typing indicators

## Toast Notifications

Show temporary notification messages.

### JavaScript API

```javascript
// Success toast
MicroToast.show('Operation successful!', 'success');

// Error toast
MicroToast.show('Something went wrong!', 'error');

// Warning toast
MicroToast.show('Please be careful!', 'warning');

// Info toast (default)
MicroToast.show('Here is some info', 'info');

// Custom duration (default: 3000ms)
MicroToast.show('Quick message', 'success', 1500);
```

**Toast types**:
- `success`: Green check icon
- `error`: Red X icon
- `warning`: Yellow warning icon
- `info`: Blue info icon

**Auto-features**:
- Slide in from right
- Auto-dismiss after duration
- Stack multiple toasts
- Smooth exit animation

## Tooltips

Show helpful text on hover.

```html
<button data-tooltip="This is a helpful tooltip!">
  Hover Me
</button>

<span data-tooltip="More information here">
  ℹ️
</span>
```

**Features**:
- Auto-positioned (stays on screen)
- Appears on hover
- Arrow pointing to element
- Dark background for contrast

## Image Effects

### Zoom on Hover

Image scales up on hover.

```html
<div class="img-zoom">
  <img src="image.jpg" alt="Image">
</div>
```

**When to use**: Product images, gallery items

### Grayscale to Color

Image transitions from grayscale to color on hover.

```html
<div class="img-grayscale">
  <img src="image.jpg" alt="Image">
</div>
```

**When to use**: Team photos, portfolio items

## Badge Animations

### Pulse

Badge pulses with expanding ring.

```html
<span class="badge badge-pulse">New</span>
```

**When to use**: Notifications, new features, live indicators

### Pop In

Badge pops in with spring animation.

```html
<span class="badge badge-pop">Hot</span>
```

**When to use**: Dynamic badges, appearing notifications

## JavaScript API

### Global Objects

The library exposes two global objects:

#### MicroToast

```javascript
// Show toast notification
MicroToast.show(message, type, duration);

// Examples
MicroToast.show('Success!', 'success');
MicroToast.show('Error occurred', 'error', 5000);
```

#### MicroInteractions

```javascript
// Animate counter manually
MicroInteractions.animateCounter(element, targetValue, duration);

// Example
const counter = document.querySelector('.my-counter');
MicroInteractions.animateCounter(counter, 1000, 2000);

// Re-initialize all interactions (if needed)
MicroInteractions.init();

// Access toast API
MicroInteractions.toast.show('Message', 'info');
```

### Copy to Clipboard

Use `data-copy` attribute:

```html
<button data-copy="Text to copy">
  Copy to Clipboard
</button>
```

**Features**:
- Copies text to clipboard
- Shows success toast
- Button text changes to "✓ Copied"
- Auto-reverts after 2 seconds

## Best Practices

### 1. Don't Overuse

- Use 1-2 effects per element maximum
- Choose effects that match the element's purpose
- More animations ≠ better experience

### 2. Be Consistent

- Use the same effects for similar elements
- Primary buttons should all use the same interaction
- Cards should all use the same hover effect

### 3. Performance First

- Use CSS animations when possible (they're faster)
- Avoid animating many elements simultaneously
- Test on lower-end devices

### 4. Consider Context

- **Hero CTAs**: Use magnetic + glow + scale
- **Form inputs**: Use float labels + glow
- **Cards**: Use lift OR tilt (not both)
- **Links**: Use underline expand for navigation

### 5. Mobile Considerations

- Some effects are automatically reduced on mobile
- Touch interactions are different from hover
- Test on actual mobile devices

## Accessibility

### Reduced Motion

The library respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations reduced to instant */
}
```

Users who prefer reduced motion will see instant state changes instead of animations.

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Skip-to-main-content links work with smooth scroll

### Screen Readers

- All interactive elements have proper labels
- Toast notifications are announced
- Form validation messages are accessible

### ARIA Compliance

- Back-to-top button has `aria-label`
- Form validation uses semantic HTML
- Loading states use appropriate ARIA attributes

## Performance

### Optimization Tips

1. **Use CSS transforms**: `transform` and `opacity` are GPU-accelerated
2. **Avoid layout thrashing**: Batch DOM reads and writes
3. **Use passive event listeners**: Already implemented for scroll events
4. **Lazy load**: Images use `loading="lazy"` automatically

### Metrics

- **CSS file size**: ~15 KB (unminified), ~8 KB (minified)
- **JS file size**: ~12 KB (unminified), ~6 KB (minified)
- **Performance impact**: < 5ms on page load
- **Animation FPS**: 60fps on modern devices

### Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS 14+, Android 8+

All effects degrade gracefully in older browsers.

## Examples

### Hero CTA Button

```html
<button class="btn btn-primary btn-ripple btn-scale btn-glow btn-magnetic">
  Get Started with Gemini
</button>
```

### Feature Card

```html
<div class="card card-lift card-shine">
  <h3>Trust & Citations</h3>
  <p>AI that shows its work with verifiable sources.</p>
  <a href="#" class="link-arrow">Learn More</a>
</div>
```

### Contact Form

```html
<form data-validate>
  <div class="input-float-label">
    <input type="text" id="name" placeholder=" " required class="input-glow">
    <label for="name">Your Name</label>
  </div>

  <div class="input-float-label">
    <input type="email" id="email" placeholder=" " required class="input-glow">
    <label for="email">Email Address</label>
  </div>

  <button type="submit" class="btn btn-primary btn-ripple btn-scale">
    Send Message
  </button>
</form>
```

### Stats Section

```html
<div class="stats">
  <div data-scroll-animation="fade-in">
    <h2 data-counter="10000">0</h2>
    <p>Happy Users</p>
  </div>

  <div data-scroll-animation="fade-in">
    <h2 data-counter="99">0</h2>
    <p>Success Rate %</p>
  </div>
</div>
```

### Image Gallery

```html
<div class="gallery">
  <div class="img-zoom">
    <img src="image1.jpg" alt="Product 1">
  </div>

  <div class="img-zoom">
    <img src="image2.jpg" alt="Product 2">
  </div>
</div>
```

## Testing

Test all interactions in:
- Different browsers (Chrome, Firefox, Safari)
- Different devices (mobile, tablet, desktop)
- With keyboard only
- With screen reader
- With reduced motion enabled

## Resources

- [Demo Page](pages/micro-interactions-demo.html)
- [CSS Source](assets/css/micro-interactions.css)
- [JS Source](assets/js/micro-interactions.js)
- [Design System](assets/css/design-system.css)

## Support

For issues or questions:
1. Check the demo page first
2. Review the best practices section
3. Test in different browsers
4. Check console for JavaScript errors

---

**Version**: 1.0.0
**Last Updated**: 2026-02-01
**Compatibility**: Modern browsers (2021+)
