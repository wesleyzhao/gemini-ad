# Design Guidelines

> Comprehensive guide to using the Gemini Ads design system for building consistent, beautiful, and accessible landing pages.

**Version**: 1.0.0
**Last Updated**: 2026-02-01
**Status**: Production Ready

---

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Design Philosophy](#design-philosophy)
3. [Getting Started](#getting-started)
4. [Design System Architecture](#design-system-architecture)
5. [Color System](#color-system)
6. [Typography](#typography)
7. [Spacing & Layout](#spacing--layout)
8. [Components](#components)
9. [Animations](#animations)
10. [Responsive Design](#responsive-design)
11. [Accessibility](#accessibility)
12. [Best Practices](#best-practices)
13. [Common Patterns](#common-patterns)
14. [Examples](#examples)
15. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is the Design System?

The Gemini Ads design system is a comprehensive collection of design tokens, components, and patterns that ensure consistency, quality, and efficiency across all landing pages. It's built on three core CSS files:

1. **design-system.css** (38 KB) - Foundation: colors, typography, spacing, utilities
2. **components.css** (28 KB) - Reusable UI components: buttons, cards, heroes, CTAs
3. **animations.css** (27 KB) - Apple-inspired animations and transitions

### Why Use the Design System?

✅ **Consistency** - Unified look and feel across all pages
✅ **Speed** - Build pages faster with pre-built components
✅ **Quality** - Battle-tested, accessible, and performant
✅ **Maintainability** - Update once, reflect everywhere
✅ **Scalability** - Easy to extend and customize

### Who Should Use This Guide?

- **Developers** building new landing pages
- **Designers** creating mockups and prototypes
- **Marketers** understanding design constraints
- **QA Engineers** validating design consistency

---

## Design Philosophy

### Apple-Inspired Aesthetics

Our design system is heavily inspired by Apple.com's world-class design approach:

#### 1. **Minimalism & Whitespace**
- Use generous whitespace to create breathing room
- Let content shine without clutter
- One primary message per section
- Strategic use of negative space

#### 2. **Elegant Typography**
- Clear hierarchy with size and weight
- Limited font family (system fonts for performance)
- Readable line lengths (50-75 characters)
- Ample line height for comfortable reading

#### 3. **Purposeful Animation**
- Every animation serves a purpose (reveal, guide, delight)
- Smooth, natural-feeling transitions (600ms default)
- Scroll-triggered reveals create engagement
- GPU-accelerated for 60fps performance

#### 4. **Premium Visual Quality**
- High-quality imagery and graphics
- Subtle gradients and shadows
- Refined details (border radius, spacing)
- Professional polish in every pixel

### Core Principles

1. **Elegance First** - Every page must feel premium and polished
2. **Mobile-First** - Design for mobile, enhance for desktop
3. **Performance Matters** - Fast load times, smooth interactions
4. **Accessibility Always** - WCAG AA compliance is non-negotiable
5. **Trust & Credibility** - Leverage Google brand, show sources
6. **Short Attention Span** - Hook users in 3 seconds or less

---

## Getting Started

### Quick Setup

#### 1. Include CSS Files

Add these three CSS files to every landing page in this order:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>

  <!-- Design System CSS (in order) -->
  <link rel="stylesheet" href="../assets/css/design-system.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="../assets/css/animations.css">

  <!-- Optional: Feature-specific CSS -->
  <link rel="stylesheet" href="../assets/css/micro-interactions.css">
  <link rel="stylesheet" href="../assets/css/hero-media.css">
</head>
<body>
  <!-- Your content here -->

  <!-- JavaScript (before closing body tag) -->
  <script src="../assets/js/animations.js" defer></script>
</body>
</html>
```

#### 2. Use Production Minified Files

For production, use minified versions for better performance:

```html
<!-- Production CSS -->
<link rel="stylesheet" href="../assets/css/design-system.min.css">
<link rel="stylesheet" href="../assets/css/components.min.css">
<link rel="stylesheet" href="../assets/css/animations.min.css">

<!-- Production JS -->
<script src="../assets/js/animations.min.js" defer></script>
```

#### 3. Basic Page Structure

Every landing page should follow this semantic HTML structure:

```html
<body>
  <!-- Hero Section (above the fold) -->
  <section class="hero-fullbleed">
    <div class="container">
      <h1 class="hero-fullbleed-headline animate-fade-slide-up">
        Your Headline
      </h1>
      <p class="hero-fullbleed-subheadline animate-fade-slide-up animate-delay-100">
        Your subheadline
      </p>
      <div class="hero-fullbleed-cta animate-fade-slide-up animate-delay-200">
        <a href="#" class="btn btn-primary btn-lg">Try Gemini Free</a>
        <a href="#" class="btn btn-ghost btn-lg">Learn More</a>
      </div>
    </div>
  </section>

  <!-- Content Sections -->
  <section class="section">
    <div class="container">
      <!-- Section content -->
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-banner">
    <h2 class="cta-banner-headline">Ready to get started?</h2>
    <p class="cta-banner-description">Join millions using Gemini today</p>
    <div class="cta-banner-buttons">
      <a href="#" class="btn btn-primary btn-xl">Get Started</a>
    </div>
  </section>
</body>
```

---

## Design System Architecture

### CSS Variables (Custom Properties)

The design system uses CSS variables for easy theming and consistency. All variables are defined in `:root` and can be accessed anywhere:

```css
/* Using design tokens */
.my-component {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  padding: var(--space-4);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-base) var(--ease-apple);
}
```

### File Structure

```
assets/
├── css/
│   ├── design-system.css      # 📦 Foundation (38 KB)
│   │   ├── Colors
│   │   ├── Typography
│   │   ├── Spacing
│   │   ├── Layout utilities
│   │   └── Base styles
│   │
│   ├── components.css         # 🧩 Components (28 KB)
│   │   ├── Buttons
│   │   ├── Cards
│   │   ├── Heroes
│   │   ├── CTAs
│   │   ├── Navigation
│   │   ├── Forms
│   │   └── Utilities
│   │
│   └── animations.css         # ✨ Animations (27 KB)
│       ├── Scroll triggers
│       ├── Fade animations
│       ├── Slide animations
│       ├── Scale animations
│       ├── Hover effects
│       └── Keyframe animations
│
└── js/
    └── animations.js          # 🎬 Animation controller (10 KB)
        ├── IntersectionObserver
        ├── Parallax effects
        ├── Scroll progress
        └── Stagger animations
```

### Naming Conventions

#### BEM-Inspired Naming
We use a simplified BEM (Block Element Modifier) approach:

```css
/* Block - standalone component */
.card { }

/* Element - child of block */
.card-header { }
.card-body { }
.card-footer { }

/* Modifier - variation of block */
.card-elevated { }
.card-bordered { }

/* State - dynamic state */
.card.is-active { }
.card.is-loading { }
```

#### Utility Classes
Utility classes follow a consistent pattern:

```css
/* Property-value pattern */
.text-center { text-align: center; }
.flex { display: flex; }
.gap-4 { gap: var(--space-4); }
.mt-8 { margin-top: var(--space-8); }

/* Responsive variants */
.hidden-mobile { } /* Hide on mobile */
.show-desktop { } /* Show on desktop only */
```

---

## Color System

### Brand Colors

#### Google Blue (Primary)
```css
--color-primary: #4285F4;        /* Main brand color */
--color-primary-dark: #1967D2;   /* Hover states */
--color-primary-light: #8AB4F8;  /* Backgrounds */
```

**Usage**: Primary CTAs, links, interactive elements

```html
<button class="btn btn-primary">Try Gemini Free</button>
<a href="#" style="color: var(--color-primary)">Learn more →</a>
```

#### Gemini Purple (Accent)
```css
--color-gemini: #9334E9;         /* Gemini brand */
--color-gemini-dark: #7C3AED;    /* Darker variant */
--color-gemini-light: #C084FC;   /* Lighter variant */
```

**Usage**: Gradient accents, special features, branding

```html
<div style="background: linear-gradient(135deg, var(--color-primary), var(--color-gemini))">
  Premium content
</div>
```

### Semantic Colors

#### Success, Warning, Error
```css
--color-success: #34A853;  /* Green - positive actions */
--color-warning: #FBBC04;  /* Yellow - caution */
--color-error: #EA4335;    /* Red - errors */
--color-info: #4285F4;     /* Blue - information */
```

**Usage**: Feedback messages, status indicators, alerts

```html
<span class="badge badge-success">✓ Verified</span>
<span class="badge badge-warning">⚠ Beta</span>
<span class="badge badge-error">✕ Error</span>
```

### Text Colors

#### Hierarchy with Gray Scale
```css
--color-text-primary: #1D1D1F;     /* Primary text (near black) */
--color-text-secondary: #6E6E73;   /* Secondary text (gray) */
--color-text-tertiary: #86868B;    /* Tertiary text (light gray) */
```

**Usage**: Create visual hierarchy in content

```html
<h1 style="color: var(--color-text-primary)">Main Headline</h1>
<p style="color: var(--color-text-secondary)">Supporting text</p>
<small style="color: var(--color-text-tertiary)">Fine print</small>
```

### Background Colors

```css
--color-background-primary: #FFFFFF;    /* White - main bg */
--color-background-secondary: #F5F5F7;  /* Light gray - sections */
--color-background-tertiary: #FAFAFA;   /* Off-white - subtle */
```

**Usage**: Section backgrounds, cards, alternating rows

```html
<section class="bg-primary">White background</section>
<section class="bg-secondary">Light gray background</section>
<section class="bg-tertiary">Off-white background</section>
```

### Gradients

#### Pre-built Gradients
```css
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-gemini) 100%);
}

.bg-gradient-subtle {
  background: linear-gradient(180deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%);
}
```

**Usage**: Hero backgrounds, premium sections, CTAs

```html
<section class="hero-fullbleed bg-gradient-primary">
  <h1>Gradient hero background</h1>
</section>
```

### Color Contrast Guidelines

Follow WCAG AA standards:

| Use Case | Min Contrast Ratio | Example |
|----------|-------------------|---------|
| Normal text (<18px) | 4.5:1 | #1D1D1F on #FFFFFF ✅ |
| Large text (≥18px) | 3:1 | #6E6E73 on #FFFFFF ✅ |
| Interactive elements | 3:1 | #4285F4 on #FFFFFF ✅ |

**Tip**: Use Chrome DevTools contrast checker to verify ratios.

---

## Typography

### Font Families

```css
/* Primary font stack (system fonts for performance) */
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;

/* Display font (same as primary for consistency) */
--font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;

/* Monospace (for code) */
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
```

**Why system fonts?**
- ⚡ Zero network requests (instant rendering)
- 🎨 Native look and feel on each OS
- 📱 Optimized for each platform
- 💾 Smaller page size

### Font Scale

#### Desktop Sizes (>1068px)
```css
--font-size-hero: 64px;      /* Hero headlines */
--font-size-h1: 48px;        /* Page titles */
--font-size-h2: 40px;        /* Section titles */
--font-size-h3: 32px;        /* Subsection titles */
--font-size-h4: 24px;        /* Card titles */
--font-size-h5: 20px;        /* Small headings */
--font-size-h6: 18px;        /* Tiny headings */
--font-size-body: 17px;      /* Body text */
--font-size-body-sm: 15px;   /* Small body text */
--font-size-caption: 13px;   /* Captions, labels */
--font-size-tiny: 11px;      /* Fine print */
```

#### Tablet Sizes (736px - 1068px)
Font sizes scale down by ~15-20% automatically.

#### Mobile Sizes (<736px)
Font sizes scale down by ~30-40% automatically.

### Font Weights

```css
--font-weight-light: 300;      /* Rare, decorative only */
--font-weight-regular: 400;    /* Body text */
--font-weight-medium: 500;     /* Emphasis, buttons */
--font-weight-semibold: 600;   /* Headings, strong */
--font-weight-bold: 700;       /* Hero headlines */
```

### Line Heights

```css
--line-height-tight: 1.1;      /* Headlines (64px → 70px) */
--line-height-snug: 1.2;       /* Large text */
--line-height-normal: 1.5;     /* Body text (default) */
--line-height-relaxed: 1.6;    /* Comfortable reading */
--line-height-loose: 1.8;      /* Extra breathing room */
```

### Letter Spacing

```css
--letter-spacing-tight: -0.02em;  /* Large headlines (tighten) */
--letter-spacing-normal: 0;       /* Default */
--letter-spacing-wide: 0.02em;    /* Small text, labels */
```

### Typography Usage Examples

#### Hero Headlines
```html
<h1 style="
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-text-primary);
">
  Think Different. Think Gemini.
</h1>
```

#### Body Text
```html
<p style="
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
">
  Experience AI reimagined with Google Gemini...
</p>
```

#### Captions
```html
<small style="
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
">
  Source: Google Research 2026
</small>
```

### Typography Best Practices

#### 1. Establish Clear Hierarchy
```html
<!-- ✅ Good - Clear hierarchy -->
<h1>Main Headline</h1>        <!-- 48px, bold, primary color -->
<h2>Section Title</h2>        <!-- 40px, semibold, primary color -->
<p>Body text here</p>         <!-- 17px, regular, primary color -->
<small>Caption text</small>   <!-- 13px, regular, secondary color -->
```

#### 2. Limit Line Length
```html
<!-- ✅ Good - Readable line length -->
<div class="container-reading">  <!-- Max 980px -->
  <p>Long-form content with comfortable line length...</p>
</div>

<!-- ❌ Bad - Too wide -->
<div style="max-width: 1920px;">
  <p>This text will be too wide to read comfortably...</p>
</div>
```

#### 3. Use Semantic HTML
```html
<!-- ✅ Good - Semantic markup -->
<h1>Page Title</h1>
<h2>Section Title</h2>
<p>Body text</p>

<!-- ❌ Bad - Non-semantic -->
<div class="big-text">Page Title</div>
<div class="medium-text">Section Title</div>
<div>Body text</div>
```

---

## Spacing & Layout

### Spacing System (8px Base Unit)

All spacing uses an 8px base unit for consistency:

```css
--space-1: 8px;      /* 0.5rem */
--space-2: 16px;     /* 1rem */
--space-3: 24px;     /* 1.5rem */
--space-4: 32px;     /* 2rem */
--space-5: 40px;     /* 2.5rem */
--space-6: 48px;     /* 3rem */
--space-8: 64px;     /* 4rem */
--space-10: 80px;    /* 5rem */
--space-12: 96px;    /* 6rem */
--space-16: 128px;   /* 8rem */
--space-20: 160px;   /* 10rem */
--space-24: 192px;   /* 12rem */
```

### Spacing Utilities

#### Margin
```html
<!-- Top margin -->
<div class="mt-1">margin-top: 8px</div>
<div class="mt-2">margin-top: 16px</div>
<div class="mt-4">margin-top: 32px</div>
<div class="mt-8">margin-top: 64px</div>

<!-- Bottom margin -->
<div class="mb-1">margin-bottom: 8px</div>
<div class="mb-4">margin-bottom: 32px</div>
```

#### Padding
```html
<!-- All sides padding -->
<div class="p-2">padding: 16px</div>
<div class="p-4">padding: 32px</div>
<div class="p-8">padding: 64px</div>
```

#### Gap (for Flexbox/Grid)
```html
<div class="flex gap-2">gap: 16px</div>
<div class="flex gap-4">gap: 32px</div>
<div class="grid gap-6">gap: 48px</div>
```

### Container Widths

```css
--container-max-width: 1280px;       /* Default container */
--container-reading-width: 980px;    /* Reading content */
--container-narrow-width: 730px;     /* Narrow content */
```

#### Usage
```html
<!-- Default container (1280px max) -->
<div class="container">
  <h1>Page content</h1>
</div>

<!-- Reading width (980px max) -->
<div class="container-reading">
  <p>Long-form article text...</p>
</div>

<!-- Narrow width (730px max) -->
<div class="container-narrow">
  <form>Contact form</form>
</div>
```

### Section Spacing

```css
/* Responsive section padding */
--section-spacing-desktop: 140px;   /* Large screens */
--section-spacing-tablet: 100px;    /* Medium screens */
--section-spacing-mobile: 60px;     /* Small screens */
```

#### Usage
```html
<section class="section">
  <!-- Automatically applies responsive padding -->
  <div class="container">
    Section content
  </div>
</section>
```

### Layout Utilities

#### Flexbox
```html
<!-- Basic flex -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex column -->
<div class="flex flex-col">
  <div>Top</div>
  <div>Bottom</div>
</div>

<!-- Center items -->
<div class="flex items-center justify-center">
  <div>Centered</div>
</div>

<!-- Space between -->
<div class="flex justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- With gap -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### CSS Grid
```html
<!-- 2-column grid -->
<div class="grid grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 3-column grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<!-- Auto-fit responsive grid -->
<div class="card-grid">
  <!-- Automatically responsive, min 300px per column -->
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Spacing Best Practices

#### 1. Use Consistent Spacing
```html
<!-- ✅ Good - Consistent spacing -->
<section class="section">
  <h2 class="mb-4">Title</h2>
  <p class="mb-4">Paragraph 1</p>
  <p class="mb-4">Paragraph 2</p>
</section>

<!-- ❌ Bad - Inconsistent spacing -->
<section>
  <h2 style="margin-bottom: 27px">Title</h2>
  <p style="margin-bottom: 19px">Paragraph 1</p>
  <p style="margin-bottom: 35px">Paragraph 2</p>
</section>
```

#### 2. Use Design Tokens
```html
<!-- ✅ Good - Design tokens -->
<div style="padding: var(--space-4)">Content</div>

<!-- ❌ Bad - Hard-coded values -->
<div style="padding: 32px">Content</div>
```

#### 3. Embrace Whitespace
```html
<!-- ✅ Good - Generous whitespace -->
<section class="section">  <!-- 140px padding top/bottom -->
  <div class="container">
    <h2 class="mb-8">Title with breathing room</h2>
    <p class="mb-6">Paragraph with space</p>
  </div>
</section>

<!-- ❌ Bad - Cramped spacing -->
<section style="padding: 20px">
  <h2 style="margin-bottom: 5px">Title too close</h2>
  <p style="margin-bottom: 5px">Paragraph too close</p>
</section>
```

---

## Components

### Buttons

#### Button Variants

```html
<!-- Primary button (blue, most prominent) -->
<button class="btn btn-primary">Try Gemini Free</button>

<!-- Secondary button (black) -->
<button class="btn btn-secondary">Learn More</button>

<!-- Tertiary button (outline) -->
<button class="btn btn-tertiary">View Details</button>

<!-- Ghost button (transparent) -->
<button class="btn btn-ghost">Cancel</button>

<!-- Gemini gradient button (special) -->
<button class="btn btn-gemini">Get Started</button>
```

#### Button Sizes

```html
<!-- Small -->
<button class="btn btn-primary btn-sm">Small</button>

<!-- Medium (default) -->
<button class="btn btn-primary btn-md">Medium</button>

<!-- Large -->
<button class="btn btn-primary btn-lg">Large</button>

<!-- Extra large -->
<button class="btn btn-primary btn-xl">Extra Large</button>
```

#### Button States

```html
<!-- Disabled -->
<button class="btn btn-primary" disabled>Disabled</button>

<!-- Loading -->
<button class="btn btn-primary btn-loading">Loading...</button>

<!-- Block (full width) -->
<button class="btn btn-primary btn-block">Full Width</button>
```

#### Button Groups

```html
<div class="btn-group">
  <button class="btn btn-primary">Option 1</button>
  <button class="btn btn-ghost">Option 2</button>
  <button class="btn btn-ghost">Option 3</button>
</div>
```

### Cards

#### Product Card

```html
<div class="card card-product">
  <img src="image.jpg" alt="Product" class="card-product-image">
  <div class="card-product-content">
    <h3 class="card-product-title">Product Title</h3>
    <p class="card-product-description">Product description goes here...</p>
    <div class="card-product-cta">
      <a href="#" class="btn btn-primary">Learn More</a>
    </div>
  </div>
</div>
```

#### Feature Card

```html
<div class="card card-feature">
  <div class="card-feature-icon">✨</div>
  <h4 class="card-feature-title">Feature Title</h4>
  <p class="card-feature-description">Feature description...</p>
</div>
```

#### Testimonial Card

```html
<div class="card card-testimonial">
  <p class="card-testimonial-quote">
    "This product changed my life! Highly recommend."
  </p>
  <div class="card-testimonial-author">
    <img src="avatar.jpg" alt="John Doe" class="card-testimonial-avatar">
    <div class="card-testimonial-info">
      <div class="card-testimonial-name">John Doe</div>
      <div class="card-testimonial-role">CEO, Company</div>
    </div>
  </div>
</div>
```

#### Stat Card

```html
<div class="card card-stat">
  <div class="card-stat-value">1M+</div>
  <div class="card-stat-label">Active Users</div>
</div>
```

#### Card Grid

```html
<div class="card-grid">
  <div class="card card-feature">Feature 1</div>
  <div class="card card-feature">Feature 2</div>
  <div class="card card-feature">Feature 3</div>
</div>
```

### Hero Sections

#### Full-Bleed Hero

```html
<section class="hero-fullbleed bg-gradient-primary">
  <div class="hero-fullbleed-content">
    <h1 class="hero-fullbleed-headline">
      Think Different. Think Gemini.
    </h1>
    <p class="hero-fullbleed-subheadline">
      Experience AI reimagined with intelligence you can trust.
    </p>
    <div class="hero-fullbleed-cta">
      <a href="#" class="btn btn-primary btn-xl">Try Gemini Free</a>
      <a href="#" class="btn btn-ghost btn-xl">Learn More</a>
    </div>
  </div>
</section>
```

#### Split Hero

```html
<section class="hero-split">
  <div class="hero-split-content">
    <h1 class="hero-split-headline">AI That Works With You</h1>
    <p class="hero-split-description">
      Seamless integration with your existing tools.
    </p>
    <a href="#" class="btn btn-primary btn-lg">Get Started</a>
  </div>
  <div>
    <img src="hero.jpg" alt="Hero" class="hero-split-image">
  </div>
</section>
```

#### Image-Dominant Hero

```html
<section class="hero-image" style="background-image: url('hero-bg.jpg')">
  <div class="hero-image-content">
    <h1 class="hero-image-headline">Your Headline</h1>
    <p class="hero-image-description">Your description</p>
    <a href="#" class="btn btn-primary btn-xl">Call to Action</a>
  </div>
</section>
```

### Call-to-Action (CTA) Components

#### Inline CTA

```html
<a href="#" class="cta-inline">
  Learn more
  <!-- Arrow auto-added via CSS ::after -->
</a>
```

#### Banner CTA

```html
<section class="cta-banner">
  <h2 class="cta-banner-headline">Ready to Transform Your Workflow?</h2>
  <p class="cta-banner-description">
    Join millions of users already using Gemini daily.
  </p>
  <div class="cta-banner-buttons">
    <a href="#" class="btn btn-primary btn-xl">Try Gemini Free</a>
    <a href="#" class="btn btn-ghost btn-xl">Watch Demo</a>
  </div>
</section>
```

#### Section CTA

```html
<section class="cta-section">
  <p class="cta-section-eyebrow">GET STARTED</p>
  <h2 class="cta-section-headline">Experience Gemini Today</h2>
  <p class="cta-section-description">
    No credit card required. Start in seconds.
  </p>
  <a href="#" class="btn btn-primary btn-xl">Sign Up Free</a>
</section>
```

### Forms

#### Basic Form

```html
<form>
  <div class="form-group">
    <label for="name" class="form-label">Your Name</label>
    <input
      type="text"
      id="name"
      class="form-input"
      placeholder="John Doe"
      required
    >
  </div>

  <div class="form-group">
    <label for="email" class="form-label">Email Address</label>
    <input
      type="email"
      id="email"
      class="form-input"
      placeholder="john@example.com"
      required
    >
    <small class="form-help">We'll never share your email.</small>
  </div>

  <div class="form-group">
    <label for="message" class="form-label">Message</label>
    <textarea
      id="message"
      class="form-textarea"
      placeholder="Your message..."
      required
    ></textarea>
  </div>

  <button type="submit" class="btn btn-primary btn-lg">Submit</button>
</form>
```

#### Form with Error

```html
<div class="form-group">
  <label for="email" class="form-label">Email Address</label>
  <input
    type="email"
    id="email"
    class="form-input"
    value="invalid-email"
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <p id="email-error" class="form-error">
    Please enter a valid email address.
  </p>
</div>
```

### Badges & Tags

```html
<!-- Badge variants -->
<span class="badge badge-primary">New</span>
<span class="badge badge-success">✓ Verified</span>
<span class="badge badge-warning">Beta</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-trust">Trusted</span>

<!-- Tags -->
<span class="tag">Productivity</span>
<span class="tag">AI</span>
<span class="tag">Workspace</span>
```

### Trust Indicators

```html
<!-- Trust indicator -->
<div class="trust-indicator">
  <span class="trust-indicator-icon">✓</span>
  Verified by Google
</div>

<!-- Citation badge -->
<div class="citation-badge">
  <span>Source: Nature Journal 2026</span>
</div>
```

---

## Animations

### Scroll-Triggered Animations

#### Basic Fade In

```html
<div class="animate-fade-in">
  Content fades in when scrolled into view
</div>
```

#### Slide Up (Apple Style)

```html
<div class="animate-slide-up">
  Content slides up and fades in
</div>
```

#### Combined Animations

```html
<div class="animate-fade-slide-up">
  Fade + slide up (most common)
</div>
```

#### Animation Variants

```html
<!-- Slide directions -->
<div class="animate-slide-up">Slide from bottom</div>
<div class="animate-slide-down">Slide from top</div>
<div class="animate-slide-left">Slide from right</div>
<div class="animate-slide-right">Slide from left</div>

<!-- Scale animations -->
<div class="animate-scale-up">Scale up from small</div>
<div class="animate-scale-down">Scale down from large</div>

<!-- Rotation -->
<div class="animate-rotate-in">Rotate in</div>
<div class="animate-flip-in">Flip in (card-like)</div>
```

### Stagger Animations

#### Stagger Container

```html
<div class="animate-stagger">
  <div class="animate-fade-slide-up">Item 1 (0ms delay)</div>
  <div class="animate-fade-slide-up">Item 2 (100ms delay)</div>
  <div class="animate-fade-slide-up">Item 3 (200ms delay)</div>
  <div class="animate-fade-slide-up">Item 4 (300ms delay)</div>
</div>
```

#### Stagger Speeds

```html
<!-- Fast stagger (50ms between items) -->
<div class="animate-stagger-fast">
  <div class="animate-fade-in">Item</div>
  <div class="animate-fade-in">Item</div>
</div>

<!-- Slow stagger (200ms between items) -->
<div class="animate-stagger-slow">
  <div class="animate-fade-in">Item</div>
  <div class="animate-fade-in">Item</div>
</div>
```

### Animation Delays

```html
<!-- Manual delays -->
<div class="animate-fade-in animate-delay-100">100ms delay</div>
<div class="animate-fade-in animate-delay-200">200ms delay</div>
<div class="animate-fade-in animate-delay-300">300ms delay</div>
```

### Animation Durations

```html
<!-- Duration modifiers -->
<div class="animate-fade-in animate-duration-fast">300ms</div>
<div class="animate-fade-in animate-duration-normal">600ms (default)</div>
<div class="animate-fade-in animate-duration-slow">900ms</div>
<div class="animate-fade-in animate-duration-slower">1200ms</div>
```

### Hover Effects

```html
<!-- Lift on hover -->
<div class="card hover-lift">Lifts 8px on hover</div>

<!-- Scale on hover -->
<div class="card hover-scale">Scales 1.05x on hover</div>

<!-- Glow on hover -->
<div class="card hover-glow">Glows on hover</div>

<!-- Brighten on hover -->
<img src="image.jpg" class="hover-brighten" alt="Image">
```

### Keyframe Animations

```html
<!-- Continuous animations -->
<div class="animate-pulse">Pulsing effect</div>
<div class="animate-bounce">Bouncing effect</div>
<div class="animate-float">Floating effect</div>
<div class="animate-spin">Spinning (loading)</div>

<!-- Background effects -->
<div class="animate-gradient bg-gradient-primary">
  Animated gradient shift
</div>
```

### Animation Best Practices

#### 1. Don't Overdo It
```html
<!-- ✅ Good - Subtle, purposeful -->
<section>
  <h2 class="animate-fade-slide-up">Title</h2>
  <p class="animate-fade-slide-up animate-delay-100">Content</p>
</section>

<!-- ❌ Bad - Too many animations -->
<section>
  <h2 class="animate-bounce animate-spin animate-pulse">Title</h2>
</section>
```

#### 2. Use Stagger for Lists
```html
<!-- ✅ Good - Staggered entrance -->
<div class="card-grid animate-stagger">
  <div class="card animate-fade-slide-up">Card 1</div>
  <div class="card animate-fade-slide-up">Card 2</div>
  <div class="card animate-fade-slide-up">Card 3</div>
</div>

<!-- ❌ Bad - All animate simultaneously -->
<div class="card-grid">
  <div class="card animate-fade-slide-up">Card 1</div>
  <div class="card animate-fade-slide-up">Card 2</div>
  <div class="card animate-fade-slide-up">Card 3</div>
</div>
```

#### 3. Respect Reduced Motion
Animations automatically respect `prefers-reduced-motion`. No additional code needed!

```css
/* Automatically handled by design system */
@media (prefers-reduced-motion: reduce) {
  [class*="animate-"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
  }
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile-first breakpoints */
--breakpoint-mobile: 735px;    /* Phone to tablet */
--breakpoint-tablet: 1068px;   /* Tablet to desktop */
--breakpoint-desktop: 1440px;  /* Desktop to wide */
--breakpoint-wide: 1920px;     /* Wide screens */
```

### Responsive Utilities

#### Hide/Show Elements

```html
<!-- Hide on mobile -->
<div class="hidden-mobile">Hidden on phones</div>

<!-- Hide on tablet -->
<div class="hidden-tablet">Hidden on tablets</div>

<!-- Show only on mobile -->
<div class="show-mobile">Only visible on phones</div>

<!-- Show only on desktop -->
<div class="show-desktop">Only visible on desktop</div>
```

### Responsive Grid

```html
<!-- Automatically responsive grid -->
<div class="grid grid-cols-4 gap-6">
  <!-- 4 columns on desktop -->
  <!-- 2 columns on tablet -->
  <!-- 1 column on mobile -->
  <div>Item</div>
  <div>Item</div>
  <div>Item</div>
  <div>Item</div>
</div>
```

### Mobile-First Media Queries

```css
/* Base styles (mobile) */
.my-component {
  font-size: 16px;
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 736px) {
  .my-component {
    font-size: 18px;
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1069px) {
  .my-component {
    font-size: 20px;
    padding: 32px;
  }
}
```

### Responsive Typography

Typography automatically scales at breakpoints:

| Screen Size | Hero | H1 | H2 | Body |
|-------------|------|----|----|------|
| Desktop (>1068px) | 64px | 48px | 40px | 17px |
| Tablet (736-1068px) | 56px | 40px | 32px | 16px |
| Mobile (<736px) | 40px | 32px | 28px | 15px |

### Touch-Friendly Targets

Ensure all interactive elements meet minimum touch target size:

```html
<!-- ✅ Good - 44px minimum -->
<button class="btn btn-primary btn-lg">
  Tap Me
</button>

<!-- ✅ Good - Increased padding for touch -->
<a href="#" style="padding: 12px 24px;">
  Link
</a>

<!-- ❌ Bad - Too small for touch -->
<button style="padding: 4px 8px; font-size: 10px;">
  Too Small
</button>
```

### Responsive Images

```html
<!-- Basic responsive image -->
<img src="image.jpg" alt="Description" class="img-responsive">

<!-- Lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Responsive srcset -->
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 735px) 100vw, (max-width: 1068px) 50vw, 800px"
  alt="Description"
>
```

---

## Accessibility

### WCAG AA Compliance

All components follow WCAG AA standards for accessibility.

### Semantic HTML

```html
<!-- ✅ Good - Semantic structure -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <section>
    <h1>Page Title</h1>
    <p>Content</p>
  </section>
</main>
<footer>
  <p>Copyright</p>
</footer>

<!-- ❌ Bad - Non-semantic -->
<div class="header">
  <div class="nav">
    <a href="/">Home</a>
  </div>
</div>
<div class="main">
  <div class="section">
    <div class="title">Page Title</div>
    <div>Content</div>
  </div>
</div>
```

### Heading Hierarchy

```html
<!-- ✅ Good - Proper hierarchy -->
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>

<!-- ❌ Bad - Skipped levels -->
<h1>Page Title</h1>
  <h4>Section Title</h4>  <!-- Skipped h2 and h3 -->
```

### Alt Text

```html
<!-- ✅ Good - Descriptive alt text -->
<img src="gemini-logo.png" alt="Google Gemini AI logo">

<!-- ✅ Good - Decorative image -->
<img src="decoration.png" alt="" role="presentation">

<!-- ❌ Bad - Missing alt -->
<img src="important.png">

<!-- ❌ Bad - Generic alt text -->
<img src="chart.png" alt="image">
```

### Keyboard Navigation

```html
<!-- ✅ Good - Keyboard accessible -->
<button class="btn btn-primary" tabindex="0">
  Click Me
</button>

<a href="#content" class="btn btn-ghost">
  Skip to Content
</a>

<!-- ❌ Bad - Click handler on div -->
<div onclick="doSomething()">
  Click Me
</div>
```

### Focus Indicators

All interactive elements automatically have focus indicators. Don't remove them!

```css
/* ✅ Good - Visible focus indicator (default) */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ❌ Bad - No focus indicator */
button:focus {
  outline: none;  /* Don't do this! */
}
```

### ARIA Labels

```html
<!-- Button with icon only -->
<button class="btn btn-primary" aria-label="Close dialog">
  ✕
</button>

<!-- Screen reader only text -->
<a href="#">
  Learn more
  <span class="sr-only">about Google Gemini AI</span>
</a>

<!-- Form with ARIA -->
<form>
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    aria-required="true"
    aria-describedby="email-help"
  >
  <small id="email-help">We'll never share your email.</small>
</form>
```

### Color Contrast

Always check contrast ratios:

```html
<!-- ✅ Good - High contrast (7:1) -->
<p style="color: #1D1D1F; background: #FFFFFF;">
  Black text on white background
</p>

<!-- ⚠️ Acceptable - Medium contrast (4.5:1) -->
<p style="color: #6E6E73; background: #FFFFFF;">
  Gray text on white background
</p>

<!-- ❌ Bad - Low contrast (2:1) -->
<p style="color: #E0E0E0; background: #FFFFFF;">
  Light gray on white (fails WCAG)
</p>
```

Use Chrome DevTools to check contrast ratios in real-time.

### Reduced Motion

Animations automatically respect `prefers-reduced-motion`. Users who enable this setting will see instant transitions instead of animations.

```css
/* Automatically handled - no code needed */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Best Practices

### 1. Mobile-First Development

Always start with mobile layout and enhance for larger screens:

```css
/* ✅ Good - Mobile first */
.component {
  font-size: 16px;  /* Mobile base */
}

@media (min-width: 736px) {
  .component {
    font-size: 18px;  /* Tablet enhancement */
  }
}

@media (min-width: 1069px) {
  .component {
    font-size: 20px;  /* Desktop enhancement */
  }
}

/* ❌ Bad - Desktop first */
.component {
  font-size: 20px;  /* Desktop base */
}

@media (max-width: 1068px) {
  .component {
    font-size: 18px;  /* Tablet override */
  }
}
```

### 2. Use Design Tokens

Always use CSS variables instead of hard-coded values:

```css
/* ✅ Good - Design tokens */
.my-component {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  padding: var(--space-4);
  border-radius: var(--border-radius-md);
}

/* ❌ Bad - Hard-coded values */
.my-component {
  color: #1D1D1F;
  font-size: 17px;
  padding: 32px;
  border-radius: 8px;
}
```

### 3. Semantic HTML

Use proper HTML5 semantic elements:

```html
<!-- ✅ Good -->
<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2026-02-01">February 1, 2026</time>
  </header>
  <p>Article content...</p>
  <footer>
    <p>Author: John Doe</p>
  </footer>
</article>

<!-- ❌ Bad -->
<div class="article">
  <div class="header">
    <div class="title">Article Title</div>
    <div class="date">February 1, 2026</div>
  </div>
  <div class="content">Article content...</div>
  <div class="footer">Author: John Doe</div>
</div>
```

### 4. Optimize Performance

```html
<!-- ✅ Good - Optimized loading -->
<!-- Critical CSS inline -->
<style>
  /* Critical above-the-fold styles */
  .hero { ... }
</style>

<!-- Defer non-critical CSS -->
<link rel="stylesheet" href="../assets/css/design-system.min.css">

<!-- Defer JavaScript -->
<script src="../assets/js/animations.min.js" defer></script>

<!-- Lazy load images -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- ❌ Bad - Blocking resources -->
<link rel="stylesheet" href="massive-file.css">
<script src="massive-file.js"></script>
<img src="large-image.jpg" alt="Image">
```

### 5. Consistent Naming

Follow BEM-inspired naming:

```html
<!-- ✅ Good - Consistent naming -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    <p class="card-text">Content</p>
  </div>
</div>

<!-- ❌ Bad - Inconsistent naming -->
<div class="card">
  <div class="cardHeader">
    <h3 class="title">Title</h3>
  </div>
  <div class="body">
    <p class="txt">Content</p>
  </div>
</div>
```

### 6. Test Across Devices

Always test on:
- **Mobile**: iPhone SE (375px), iPhone 12 (390px)
- **Tablet**: iPad (768px), iPad Pro (1024px)
- **Desktop**: MacBook (1440px), 4K (1920px)

Use Chrome DevTools device emulation for quick testing.

### 7. Validate HTML

Run HTML validation before committing:

```bash
# Use W3C validator or browser DevTools
# Check for:
# - Proper nesting
# - Closed tags
# - Valid attributes
# - Semantic structure
```

---

## Common Patterns

### Hero Section + Features

```html
<section class="hero-fullbleed bg-gradient-primary">
  <div class="hero-fullbleed-content">
    <h1 class="hero-fullbleed-headline animate-fade-slide-up">
      Transform Your Workflow
    </h1>
    <p class="hero-fullbleed-subheadline animate-fade-slide-up animate-delay-100">
      Experience AI that understands your needs
    </p>
    <div class="hero-fullbleed-cta animate-fade-slide-up animate-delay-200">
      <a href="#" class="btn btn-primary btn-xl">Try Gemini Free</a>
      <a href="#" class="btn btn-ghost btn-xl">Watch Demo</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="text-center mb-12 animate-fade-slide-up">Key Features</h2>
    <div class="card-grid animate-stagger">
      <div class="card card-feature animate-fade-slide-up">
        <div class="card-feature-icon">⚡</div>
        <h3 class="card-feature-title">Lightning Fast</h3>
        <p class="card-feature-description">Instant responses...</p>
      </div>
      <div class="card card-feature animate-fade-slide-up">
        <div class="card-feature-icon">🔒</div>
        <h3 class="card-feature-title">Secure</h3>
        <p class="card-feature-description">Enterprise-grade...</p>
      </div>
      <div class="card card-feature animate-fade-slide-up">
        <div class="card-feature-icon">🌐</div>
        <h3 class="card-feature-title">Integrated</h3>
        <p class="card-feature-description">Works with...</p>
      </div>
    </div>
  </div>
</section>
```

### Testimonial Section

```html
<section class="section bg-secondary">
  <div class="container-reading">
    <h2 class="text-center mb-12 animate-fade-slide-up">
      What Our Users Say
    </h2>
    <div class="grid grid-cols-2 gap-6 animate-stagger">
      <div class="card card-testimonial animate-fade-slide-up">
        <p class="card-testimonial-quote">
          "Gemini has completely transformed how I work. It's like having a brilliant assistant by my side 24/7."
        </p>
        <div class="card-testimonial-author">
          <img src="avatar1.jpg" alt="Sarah Johnson" class="card-testimonial-avatar">
          <div class="card-testimonial-info">
            <div class="card-testimonial-name">Sarah Johnson</div>
            <div class="card-testimonial-role">Content Writer</div>
          </div>
        </div>
      </div>
      <div class="card card-testimonial animate-fade-slide-up">
        <p class="card-testimonial-quote">
          "The Google Workspace integration is seamless. I can't imagine working without it now."
        </p>
        <div class="card-testimonial-author">
          <img src="avatar2.jpg" alt="Mike Chen" class="card-testimonial-avatar">
          <div class="card-testimonial-info">
            <div class="card-testimonial-name">Mike Chen</div>
            <div class="card-testimonial-role">Product Manager</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Pricing Section

```html
<section class="section">
  <div class="container">
    <h2 class="text-center mb-12 animate-fade-slide-up">
      Choose Your Plan
    </h2>
    <div class="grid grid-cols-3 gap-6 animate-stagger">
      <div class="card card-product animate-fade-slide-up">
        <div class="card-product-content">
          <h3 class="card-product-title">Free</h3>
          <div class="card-product-price">$0</div>
          <p class="card-product-description">
            Perfect for individuals getting started
          </p>
          <ul class="mb-6">
            <li>10 queries per day</li>
            <li>Basic features</li>
            <li>Email support</li>
          </ul>
          <a href="#" class="btn btn-tertiary btn-block">Get Started</a>
        </div>
      </div>
      <div class="card card-product animate-fade-slide-up">
        <div class="card-product-content">
          <span class="badge badge-primary">Popular</span>
          <h3 class="card-product-title">Pro</h3>
          <div class="card-product-price">$20/mo</div>
          <p class="card-product-description">
            For professionals and teams
          </p>
          <ul class="mb-6">
            <li>Unlimited queries</li>
            <li>Advanced features</li>
            <li>Priority support</li>
          </ul>
          <a href="#" class="btn btn-primary btn-block">Start Free Trial</a>
        </div>
      </div>
      <div class="card card-product animate-fade-slide-up">
        <div class="card-product-content">
          <h3 class="card-product-title">Enterprise</h3>
          <div class="card-product-price">Custom</div>
          <p class="card-product-description">
            For large organizations
          </p>
          <ul class="mb-6">
            <li>Everything in Pro</li>
            <li>Custom integration</li>
            <li>Dedicated support</li>
          </ul>
          <a href="#" class="btn btn-secondary btn-block">Contact Sales</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Final CTA

```html
<section class="cta-banner">
  <div class="container-narrow">
    <h2 class="cta-banner-headline">
      Ready to Transform Your Workflow?
    </h2>
    <p class="cta-banner-description">
      Join millions of users who trust Gemini for their daily work.
    </p>
    <div class="cta-banner-buttons">
      <a href="#" class="btn btn-primary btn-xl">Try Gemini Free</a>
      <a href="#" class="btn btn-ghost btn-xl">Schedule Demo</a>
    </div>
    <p class="text-center mt-4 text-secondary">
      No credit card required • Cancel anytime
    </p>
  </div>
</section>
```

---

## Examples

### Complete Landing Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title | Google Gemini</title>

  <!-- Design System CSS -->
  <link rel="stylesheet" href="../assets/css/design-system.min.css">
  <link rel="stylesheet" href="../assets/css/components.min.css">
  <link rel="stylesheet" href="../assets/css/animations.min.css">
</head>
<body>

  <!-- Hero Section -->
  <section class="hero-fullbleed bg-gradient-primary">
    <div class="hero-fullbleed-content">
      <h1 class="hero-fullbleed-headline animate-fade-slide-up">
        Your Compelling Headline
      </h1>
      <p class="hero-fullbleed-subheadline animate-fade-slide-up animate-delay-100">
        A clear, concise value proposition
      </p>
      <div class="hero-fullbleed-cta animate-fade-slide-up animate-delay-200">
        <a href="#" class="btn btn-primary btn-xl">Primary CTA</a>
        <a href="#" class="btn btn-ghost btn-xl">Secondary CTA</a>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="section">
    <div class="container">
      <h2 class="text-center mb-12 animate-fade-slide-up">
        Why Choose Gemini
      </h2>
      <div class="card-grid animate-stagger">
        <div class="card card-feature animate-fade-slide-up">
          <div class="card-feature-icon">✨</div>
          <h3 class="card-feature-title">Feature 1</h3>
          <p class="card-feature-description">Description...</p>
        </div>
        <div class="card card-feature animate-fade-slide-up">
          <div class="card-feature-icon">⚡</div>
          <h3 class="card-feature-title">Feature 2</h3>
          <p class="card-feature-description">Description...</p>
        </div>
        <div class="card card-feature animate-fade-slide-up">
          <div class="card-feature-icon">🔒</div>
          <h3 class="card-feature-title">Feature 3</h3>
          <p class="card-feature-description">Description...</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Social Proof Section -->
  <section class="section bg-secondary">
    <div class="container-reading">
      <h2 class="text-center mb-12 animate-fade-slide-up">
        Trusted by Millions
      </h2>
      <div class="grid grid-cols-2 gap-6 animate-stagger">
        <div class="card card-testimonial animate-fade-slide-up">
          <p class="card-testimonial-quote">"Amazing product!"</p>
          <div class="card-testimonial-author">
            <img src="avatar.jpg" alt="User" class="card-testimonial-avatar">
            <div class="card-testimonial-info">
              <div class="card-testimonial-name">John Doe</div>
              <div class="card-testimonial-role">CEO, Company</div>
            </div>
          </div>
        </div>
        <!-- More testimonials -->
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="cta-banner">
    <h2 class="cta-banner-headline">Ready to Get Started?</h2>
    <p class="cta-banner-description">
      Join millions using Gemini today
    </p>
    <div class="cta-banner-buttons">
      <a href="#" class="btn btn-primary btn-xl">Try Gemini Free</a>
      <a href="#" class="btn btn-ghost btn-xl">Learn More</a>
    </div>
  </section>

  <!-- JavaScript -->
  <script src="../assets/js/animations.min.js" defer></script>
</body>
</html>
```

---

## Troubleshooting

### Common Issues

#### 1. Animations Not Working

**Problem**: Elements with animation classes don't animate

**Solutions**:
```html
<!-- ✅ Check JavaScript is loaded -->
<script src="../assets/js/animations.min.js" defer></script>

<!-- ✅ Check CSS is loaded -->
<link rel="stylesheet" href="../assets/css/animations.min.css">

<!-- ✅ Check prefers-reduced-motion -->
<!-- Animations disabled if user prefers reduced motion -->

<!-- ✅ Check element is in viewport -->
<!-- Scroll to element to trigger animation -->
```

#### 2. Styles Not Applying

**Problem**: Component classes not working

**Solutions**:
```html
<!-- ✅ Check CSS load order -->
<link rel="stylesheet" href="../assets/css/design-system.min.css">  <!-- 1st -->
<link rel="stylesheet" href="../assets/css/components.min.css">     <!-- 2nd -->
<link rel="stylesheet" href="../assets/css/animations.min.css">     <!-- 3rd -->

<!-- ✅ Check for typos -->
<button class="btn btn-primary">Correct</button>
<button class="btn btn-primery">Typo!</button>

<!-- ✅ Check relative paths -->
<link rel="stylesheet" href="../assets/css/design-system.min.css">  <!-- Correct -->
<link rel="stylesheet" href="assets/css/design-system.min.css">     <!-- Missing ../ -->
```

#### 3. Layout Issues on Mobile

**Problem**: Content overflows or doesn't fit on mobile

**Solutions**:
```html
<!-- ✅ Add viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- ✅ Use responsive containers -->
<div class="container">Content</div>

<!-- ✅ Test with Chrome DevTools -->
<!-- Cmd+Opt+I (Mac) or Ctrl+Shift+I (Windows) -->
<!-- Toggle device toolbar (Cmd+Shift+M or Ctrl+Shift+M) -->
```

#### 4. Buttons Not Centered

**Problem**: Buttons appear left-aligned when they should be centered

**Solutions**:
```html
<!-- ✅ Use flexbox centering -->
<div class="flex justify-center">
  <button class="btn btn-primary">Centered</button>
</div>

<!-- ✅ Use text-center for inline elements -->
<div class="text-center">
  <button class="btn btn-primary">Centered</button>
</div>

<!-- ❌ Don't use btn-block (full width) -->
<button class="btn btn-primary btn-block">Not centered (full width)</button>
```

#### 5. Colors Look Wrong

**Problem**: Colors don't match the design system

**Solutions**:
```css
/* ✅ Use CSS variables */
color: var(--color-text-primary);

/* ❌ Don't hard-code colors */
color: #333;  /* Wrong! */

/* ✅ Check variable names */
color: var(--color-primary);        /* Correct */
color: var(--color-blue-primary);   /* Wrong variable name */
```

### Performance Issues

#### Slow Page Load

```html
<!-- ✅ Use minified files in production -->
<link rel="stylesheet" href="../assets/css/design-system.min.css">

<!-- ✅ Defer JavaScript -->
<script src="../assets/js/animations.min.js" defer></script>

<!-- ✅ Lazy load images -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- ✅ Use appropriate image formats -->
<!-- WebP for photos, SVG for icons -->
```

#### Janky Animations

```css
/* ✅ Use GPU acceleration */
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}

/* ✅ Animate transform and opacity only */
.animated-element {
  transition: transform 300ms, opacity 300ms;
}

/* ❌ Don't animate expensive properties */
.animated-element {
  transition: width 300ms;  /* Causes reflow */
}
```

### Debugging Tips

```javascript
// Check if animations.js is loaded
console.log('Animations loaded:', typeof MicroInteractions !== 'undefined');

// Check CSS variables
console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));

// Check viewport size
console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);

// Check for animation classes
console.log('Animated elements:', document.querySelectorAll('[class*="animate-"]').length);
```

---

## Resources

### Design System Files

- **design-system.css** - [View source](../assets/css/design-system.css)
- **components.css** - [View source](../assets/css/components.css)
- **animations.css** - [View source](../assets/css/animations.css)
- **animations.js** - [View source](../assets/js/animations.js)

### Documentation

- **README.md** - Project overview and setup
- **CONTEXT.md** - Architectural decisions
- **APPLE_ANIMATIONS_GUIDE.md** - Animation system deep dive
- **MICRO_INTERACTIONS_GUIDE.md** - Interaction patterns
- **ACCESSIBILITY.md** - Accessibility compliance
- **PERFORMANCE_OPTIMIZATION.md** - Performance best practices

### External Resources

- **Apple.com** - Design inspiration
- **WCAG Guidelines** - https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Web Docs** - https://developer.mozilla.org/
- **Can I Use** - https://caniuse.com/
- **CSS-Tricks** - https://css-tricks.com/

### Tools

- **Chrome DevTools** - Browser debugging
- **Lighthouse** - Performance audits
- **axe DevTools** - Accessibility testing
- **Playwright** - Automated testing
- **Prettier** - Code formatting

---

## Changelog

### Version 1.0.0 (2026-02-01)
- Initial release
- Complete design system documentation
- All components documented
- Best practices and common patterns
- Troubleshooting guide

---

## Support

For questions or issues:

1. Check this guide for solutions
2. Review component source code
3. Test in Chrome DevTools
4. Check accessibility compliance
5. Open a GitHub issue

---

**Maintained by**: Gemini Ads Team
**Last Updated**: 2026-02-01
**License**: MIT

---

🎨 **Happy building with the Gemini Ads design system!**
