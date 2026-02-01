# Component Library Documentation

## Overview

The Gemini Ads Component Library provides a comprehensive set of reusable UI components built with pure CSS, following Apple.com-inspired design patterns. All components use design tokens from `design-system.css` for consistency.

**Files:**
- `assets/css/components.css` - Component library (1,404 lines)
- `assets/css/design-system.css` - Design system tokens (668 lines)
- `tests/component-library-test.html` - Visual component showcase

## Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Hero Sections](#hero-sections)
4. [Call-to-Action (CTA) Components](#call-to-action-cta-components)
5. [Navigation](#navigation)
6. [Feature Sections](#feature-sections)
7. [Badges & Tags](#badges--tags)
8. [Forms](#forms)
9. [Utility Components](#utility-components)
10. [Usage Guidelines](#usage-guidelines)

---

## Buttons

### Base Button Classes

#### `.btn`
Base button class with all core styling. All button variants extend this class.

**Properties:**
- Inline-flex layout with centered content
- Medium padding (`--space-3` `--space-6`)
- Medium font weight
- Rounded corners (`--radius-lg`)
- Apple-style easing transitions
- Focus-visible outline for accessibility

#### Button Variants

**`.btn-primary`**
```html
<button class="btn btn-primary">Primary Button</button>
```
- Google Blue background (`--color-button-primary-bg`)
- White text
- Medium shadow with hover lift effect
- **Use for:** Primary actions, main CTAs

**`.btn-secondary`**
```html
<button class="btn btn-secondary">Secondary Button</button>
```
- Dark background (`--color-button-secondary-bg`)
- White text
- **Use for:** Secondary actions, alternative options

**`.btn-tertiary`**
```html
<button class="btn btn-tertiary">Tertiary Button</button>
```
- Transparent background with blue border
- Blue text, fills on hover
- **Use for:** Less prominent actions

**`.btn-ghost`**
```html
<button class="btn btn-ghost">Ghost Button</button>
```
- Fully transparent background
- Text color only
- **Use for:** Subtle actions, navigation links

**`.btn-gemini`**
```html
<button class="btn btn-gemini">Gemini Button</button>
```
- Gradient background (Primary → Gemini Purple)
- Signature purple glow on hover
- **Use for:** Gemini-branded actions, premium features

### Button Sizes

```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-md">Medium (Default)</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

**Size Scale:**
- `btn-sm`: 8px × 16px padding
- `btn-md`: 12px × 24px padding (default)
- `btn-lg`: 16px × 32px padding
- `btn-xl`: 20px × 40px padding

### Button States

```html
<button class="btn btn-primary" disabled>Disabled</button>
<button class="btn btn-primary btn-loading">Loading...</button>
<button class="btn btn-primary btn-block">Full Width</button>
```

**States:**
- `disabled` / `.btn-disabled`: 50% opacity, pointer-events disabled
- `.btn-loading`: Shows animated spinner, hides text
- `.btn-block`: Full width, flex layout

### Button Groups

```html
<div class="btn-group">
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-secondary">Cancel</button>
</div>

<div class="btn-group btn-group-vertical">
  <button class="btn btn-tertiary">Option 1</button>
  <button class="btn btn-tertiary">Option 2</button>
</div>
```

---

## Cards

### Base Card

```html
<div class="card card-elevated">
  <div class="card-header">Header Content</div>
  <div class="card-body">Main Content</div>
  <div class="card-footer">Footer Content</div>
</div>
```

**Modifiers:**
- `.card-elevated`: Adds shadow and hover lift effect
- `.card-bordered`: Adds light border instead of shadow

### Product Card

Perfect for showcasing features, products, or services.

```html
<div class="card-product">
  <img src="product.jpg" alt="Product" class="card-product-image">
  <div class="card-product-content">
    <h3 class="card-product-title">Gemini Pro</h3>
    <p class="card-product-description">Advanced AI capabilities...</p>
    <div class="card-product-price">$19/mo</div>
    <div class="card-product-cta">
      <a href="#" class="btn btn-primary">Learn More</a>
    </div>
  </div>
</div>
```

**Features:**
- 16:9 aspect ratio image
- Flexbox content layout
- Hover lift animation (-8px translateY)
- CTA auto-positioned at bottom

### Feature Card

Centered layout for highlighting features with icons.

```html
<div class="card-feature">
  <div class="card-feature-icon">🎯</div>
  <h3 class="card-feature-title">Precise Answers</h3>
  <p class="card-feature-description">Get accurate responses...</p>
</div>
```

**Features:**
- Centered text alignment
- Gradient icon background
- Hover scale effect (1.02)
- Border color changes to primary on hover

### Testimonial Card

Display customer testimonials with avatars.

```html
<div class="card-testimonial">
  <p class="card-testimonial-quote">
    "Gemini has transformed my workflow..."
  </p>
  <div class="card-testimonial-author">
    <img src="avatar.jpg" alt="Sarah" class="card-testimonial-avatar">
    <div class="card-testimonial-info">
      <div class="card-testimonial-name">Sarah Johnson</div>
      <div class="card-testimonial-role">Product Manager</div>
    </div>
  </div>
</div>
```

**Features:**
- Large decorative quotation mark (::before)
- Circular avatar (48px)
- Author info flex layout

### Stat Card

Highlight key statistics or metrics.

```html
<div class="card-stat">
  <div class="card-stat-value">99.9%</div>
  <div class="card-stat-label">Accuracy Rate</div>
</div>
```

**Features:**
- Gradient background (Primary → Gemini)
- Hero-sized value text
- White color scheme

### Card Grid

Responsive grid layout for multiple cards.

```html
<div class="card-grid">
  <!-- Cards here auto-fit, minimum 300px width -->
</div>
```

---

## Hero Sections

### Full-Bleed Hero

Full-screen centered hero with gradient background.

```html
<section class="hero hero-fullbleed">
  <div class="hero-fullbleed-content">
    <h1 class="hero-fullbleed-headline">Meet Gemini</h1>
    <p class="hero-fullbleed-subheadline">AI that understands you better</p>
    <div class="hero-fullbleed-cta">
      <a href="#" class="btn btn-primary btn-lg">Get Started</a>
      <a href="#" class="btn btn-secondary btn-lg">Learn More</a>
    </div>
  </div>
</section>
```

**Features:**
- 100vh min-height
- Gradient background
- Centered content (max-width: reading container)
- Responsive typography (64px → 48px → 40px)

### Split Hero

Two-column layout with content and image.

```html
<section class="hero hero-split">
  <div class="hero-split-content">
    <h2 class="hero-split-headline">Transform Your Workflow</h2>
    <p class="hero-split-description">Experience AI-powered productivity...</p>
    <a href="#" class="btn btn-primary">Explore Features</a>
  </div>
  <img src="hero-image.jpg" alt="Hero" class="hero-split-image">
</section>
```

**Features:**
- 1fr 1fr grid layout
- Stacks vertically on mobile (<1068px)
- Image has rounded corners and shadow
- 80vh min-height

### Image-Dominant Hero

Background image with overlay and centered text.

```html
<section class="hero hero-image" style="background-image: url('hero.jpg');">
  <div class="hero-image-content">
    <h1 class="hero-image-headline">Discover Possibilities</h1>
    <p class="hero-image-description">Powered by Google AI</p>
    <a href="#" class="btn btn-primary btn-lg">Get Started</a>
  </div>
</section>
```

**Features:**
- Background image with dark gradient overlay
- Text shadow for readability
- Centered white text
- 80vh min-height

---

## Call-to-Action (CTA) Components

### Inline CTA

Subtle link with arrow animation.

```html
<a href="#" class="cta-inline">Learn more</a>
```

**Features:**
- Arrow (→) that slides right on hover
- Gap increases on hover
- Primary color

### Banner CTA

Prominent banner with gradient background.

```html
<div class="cta-banner">
  <h2 class="cta-banner-headline">Ready to get started?</h2>
  <p class="cta-banner-description">Join millions of users worldwide...</p>
  <div class="cta-banner-buttons">
    <a href="#" class="btn btn-primary btn-lg">Start Free Trial</a>
    <a href="#" class="btn btn-secondary btn-lg">View Pricing</a>
  </div>
</div>
```

**Features:**
- Gradient background (Primary → Gemini)
- Centered layout
- Large shadow
- Max-width description (600px)

### Section CTA

Section with eyebrow, headline, and description.

```html
<div class="cta-section">
  <p class="cta-section-eyebrow">Get Started Today</p>
  <h2 class="cta-section-headline">Experience the Future</h2>
  <p class="cta-section-description">No credit card required...</p>
  <a href="#" class="btn btn-gemini btn-lg">Try Gemini Free</a>
</div>
```

**Features:**
- Uppercase eyebrow label
- Max-width description (700px)
- Centered text
- Mobile-first padding

---

## Navigation

### Navbar

Fixed header with blur backdrop effect.

```html
<nav class="navbar">
  <div class="navbar-container">
    <a href="#" class="navbar-logo">
      <img src="logo.svg" class="navbar-logo-icon" alt="Logo">
      Gemini
    </a>
    <ul class="navbar-menu">
      <li class="navbar-menu-item">
        <a href="#features" class="navbar-link">Features</a>
      </li>
      <!-- More menu items -->
    </ul>
    <div class="navbar-cta">
      <a href="#" class="btn btn-primary btn-sm">Get Started</a>
    </div>
    <button class="navbar-toggle" aria-label="Toggle menu">
      <span class="navbar-toggle-icon"></span>
    </button>
  </div>
</nav>
```

**Features:**
- Fixed position at top
- Frosted glass effect (backdrop-filter: blur)
- Responsive mobile menu (hamburger icon)
- `.navbar-scrolled` class adds shadow on scroll
- Mobile menu collapses at <768px

**JavaScript Required:**
```javascript
// Mobile menu toggle
document.querySelector('.navbar-toggle').addEventListener('click', () => {
  document.querySelector('.navbar-menu').classList.toggle('active');
});

// Scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }
});
```

### Footer

Multi-column footer with links and social icons.

```html
<footer class="footer">
  <div class="footer-container">
    <div class="footer-grid">
      <div>
        <h3 class="footer-column-title">Product</h3>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Features</a></li>
          <li><a href="#" class="footer-link">Pricing</a></li>
        </ul>
      </div>
      <!-- More columns -->
    </div>
    <div class="footer-bottom">
      <p class="footer-copyright">© 2024 Gemini</p>
      <div class="footer-social">
        <a href="#" class="footer-social-link" aria-label="Twitter">𝕏</a>
        <!-- More social links -->
      </div>
    </div>
  </div>
</footer>
```

**Features:**
- Dark background
- Auto-fit grid (min 200px columns)
- Social icons with hover lift
- Responsive layout

### Breadcrumbs

Show navigation hierarchy.

```html
<nav class="breadcrumbs">
  <a href="#" class="breadcrumb-link">Home</a>
  <span class="breadcrumb-separator">/</span>
  <a href="#" class="breadcrumb-link">Products</a>
  <span class="breadcrumb-separator">/</span>
  <span class="breadcrumb-current">Gemini Pro</span>
</nav>
```

---

## Feature Sections

### Feature Grid

```html
<div class="feature-grid">
  <div class="card-feature"><!-- Feature card --></div>
  <div class="card-feature"><!-- Feature card --></div>
  <div class="card-feature"><!-- Feature card --></div>
</div>
```

**Features:**
- Auto-fit grid (min 300px)
- Responsive section padding
- Works with any card type

### Feature List

Alternating image-text layout.

```html
<div class="feature-list">
  <div class="feature-list-item">
    <div class="feature-list-content">
      <h3 class="feature-list-title">Smart Citations</h3>
      <p class="feature-list-description">Every answer includes sources...</p>
      <a href="#" class="cta-inline">Learn more</a>
    </div>
    <img src="feature.jpg" alt="Feature" class="feature-list-image">
  </div>
  <!-- More items alternate automatically -->
</div>
```

**Features:**
- Even items flip order (image on left)
- Stacks on mobile
- Rounded image with shadow

### Feature Showcase

Centered hero-style feature presentation.

```html
<div class="feature-showcase">
  <h2 class="feature-showcase-title">Powered by Google AI</h2>
  <p class="feature-showcase-subtitle">Next-generation intelligence</p>
  <img src="showcase.jpg" alt="Showcase" class="feature-showcase-image">
</div>
```

---

## Badges & Tags

### Badges

Small status indicators.

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Beta</span>
<span class="badge badge-error">Deprecated</span>
<span class="badge badge-trust">Verified</span>
<span class="badge badge-verified">Trusted</span>
```

**Features:**
- Uppercase text
- Pill-shaped (full border-radius)
- Semantic color variants

### Tags

Interactive labels.

```html
<span class="tag">Machine Learning</span>
<span class="tag">AI</span>
```

**Features:**
- Hover background change
- Can be used as buttons/links

### Trust Indicators

Special badges for trust and citations.

```html
<span class="trust-indicator">
  <span class="trust-indicator-icon">✓</span>
  Verified Source
</span>

<span class="citation-badge">Citation: Nature Journal, 2024</span>
```

---

## Forms

### Form Groups

```html
<div class="form-group">
  <label for="email" class="form-label">Email Address</label>
  <input type="email" id="email" class="form-input" placeholder="you@example.com">
  <span class="form-help">We'll never share your email.</span>
  <!-- For errors: <span class="form-error">Invalid email</span> -->
</div>
```

### Form Elements

```html
<!-- Text Input -->
<input type="text" class="form-input" placeholder="Enter text...">

<!-- Textarea -->
<textarea class="form-textarea" placeholder="Your message..."></textarea>

<!-- Select -->
<select class="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Checkbox -->
<div class="form-checkbox">
  <input type="checkbox" id="agree">
  <label for="agree">I agree to terms</label>
</div>

<!-- Radio -->
<div class="form-radio">
  <input type="radio" name="plan" id="free">
  <label for="free">Free Plan</label>
</div>
```

**Features:**
- Focus state with primary color border and glow
- Error/help text support
- Consistent padding and sizing

---

## Utility Components

### Dividers

```html
<hr class="divider">
<div class="divider-vertical"></div>
```

### Spacers

```html
<div class="spacer-sm"></div>  <!-- Mobile spacing -->
<div class="spacer-md"></div>  <!-- Tablet spacing -->
<div class="spacer-lg"></div>  <!-- Desktop spacing -->
```

### Loading Spinner

```html
<div class="spinner"></div>
```

### Image Utilities

```html
<img src="photo.jpg" class="img-responsive">
<img src="photo.jpg" class="img-rounded">
<img src="avatar.jpg" class="img-circle">
```

### Aspect Ratios

```html
<div class="aspect-video">
  <img src="video-thumbnail.jpg" alt="Video">
</div>

<div class="aspect-square">
  <img src="product.jpg" alt="Product">
</div>

<div class="aspect-portrait">
  <img src="portrait.jpg" alt="Portrait">
</div>
```

### Text Alignment

```html
<p class="text-center">Centered text</p>
<p class="text-left">Left-aligned text</p>
<p class="text-right">Right-aligned text</p>
```

### Responsive Display

```html
<!-- Hide on specific breakpoints -->
<div class="hide-mobile">Desktop/Tablet only</div>
<div class="hide-tablet">Mobile/Desktop only</div>
<div class="hide-desktop">Mobile/Tablet only</div>

<!-- Show only on specific breakpoints -->
<div class="show-mobile">Mobile only</div>
<div class="show-tablet">Tablet only</div>
<div class="show-desktop">Desktop only</div>
```

**Breakpoints:**
- Mobile: <735px
- Tablet: 736px - 1068px
- Desktop: >1068px

---

## Usage Guidelines

### Including the Component Library

Always include design-system.css first, then components.css:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Landing Page</title>
  <link rel="stylesheet" href="assets/css/design-system.css">
  <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

### Best Practices

1. **Use Semantic HTML**: Start with proper HTML5 structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)

2. **Combine Classes**: Components support multiple modifiers
   ```html
   <button class="btn btn-primary btn-lg">Large Primary Button</button>
   ```

3. **Responsive Design**: All components are mobile-first and responsive by default

4. **Accessibility**:
   - Include proper ARIA labels
   - Use semantic HTML elements
   - Ensure keyboard navigation works
   - Test with screen readers

5. **Performance**:
   - Components use CSS transforms for animations (GPU-accelerated)
   - No JavaScript required except for navbar scroll/mobile menu
   - Minimal CSS specificity for easy overrides

6. **Customization**: Override using CSS custom properties
   ```css
   :root {
     --color-primary: #YOUR_COLOR;
     --radius-lg: 16px; /* More rounded buttons */
   }
   ```

### Color Scheme

All components use design tokens from `design-system.css`:

**Primary Colors:**
- `--color-primary`: Google Blue (#4285F4)
- `--color-gemini`: Gemini Purple (#9334E9)

**Text Colors:**
- `--color-text-primary`: Near Black (#1D1D1F)
- `--color-text-secondary`: Gray (#6E6E73)
- `--color-text-tertiary`: Light Gray (#86868B)

**Backgrounds:**
- `--color-background-primary`: White (#FFFFFF)
- `--color-background-secondary`: Light Gray (#F5F5F7)

### Testing Your Implementation

1. **Visual Test**: Open `tests/component-library-test.html` in a browser
2. **Responsive Test**: Check at 375px (mobile), 768px (tablet), 1280px (desktop)
3. **Accessibility Test**: Run Lighthouse audit or axe DevTools
4. **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers with CSS Grid, Flexbox, and CSS Custom Properties support.

---

## Component Count

**Total Components: 50+**

- Buttons: 5 variants, 4 sizes, 3 states
- Cards: 4 types + grid layout
- Heroes: 3 layouts
- CTAs: 3 types
- Navigation: Header, Footer, Breadcrumbs
- Features: 3 section layouts
- Badges: 6 semantic types + 2 trust types
- Forms: 5 input types + helpers
- Utilities: 15+ helper classes

**Total Lines of Code:**
- components.css: 1,404 lines
- design-system.css: 668 lines
- **Total: 2,072 lines of production-ready CSS**

---

## Support & Contribution

For issues or enhancements, refer to the main project documentation.

**Testing:**
```bash
npm run serve          # Start local server
npm test              # Run Playwright tests (requires browser deps)
npm run test:ui       # Run tests with UI
```

**File Locations:**
- Component Library: `assets/css/components.css`
- Design System: `assets/css/design-system.css`
- Test Page: `tests/component-library-test.html`
- Test Suite: `tests/component-library.spec.js`
