# Apple.com Design Patterns Research
**Research Date:** February 1, 2026
**Purpose:** Document Apple's design patterns to inform Gemini landing page design

---

## Table of Contents
1. [Typography](#typography)
2. [Whitespace & Layout](#whitespace--layout)
3. [Color Palette](#color-palette)
4. [Animation Patterns](#animation-patterns)
5. [Hero Section Design](#hero-section-design)
6. [Implementation Guidelines](#implementation-guidelines)

---

## Typography

### Font System

Apple uses the **San Francisco (SF Pro)** font family across its web and digital properties. SF Pro is a neutral, flexible, sans-serif typeface designed for optimal legibility across all Apple platforms.

#### SF Pro Characteristics:
- **9 weights available:** From Ultralight to Black, including italics
- **Variable font format:** Combines different styles in one file with interpolation between styles
- **Width variations (2022+):** Condensed, Compressed, Expanded, and Regular
- **Optical sizing:** Dynamic optical sizes merge Text and Display variants seamlessly
- **Special features:** Small caps, fractions, superior/inferior numerals, indices, arrows

#### Web Typography Stack:
```css
font-family: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

### Typographic Scale

Apple uses a responsive typographic scale that adapts to viewport size:

| Element Type | Desktop | Tablet (≤1068px) | Mobile (≤735px) |
|--------------|---------|------------------|-----------------|
| **Large Heading** | 48px | 40px | 32px |
| **Font Weight** | 600 (Semi-bold) | 600 | 600 |
| **Line Height** | 1.08365 | 1.1 | 1.125 |
| **Letter Spacing** | -0.003em | 0em | 0.004em |

### Typography Best Practices from Apple:

1. **Clear Hierarchy:** Use size, weight, and spacing to create obvious visual hierarchy
2. **Large, Clean Fonts:** Campaign text is large enough to convey benefits within seconds
3. **Dynamic Type Support:** Text scales appropriately across devices
4. **Minimal Decoration:** Typography serves the content, not the other way around
5. **Kinetic Typography (2026 trend):** Subtle text animations (slide, fade, zoom) for key moments

### Key Observations:
- Negative letter spacing on desktop creates tighter, more premium feel
- Line heights increase on smaller screens for better readability
- Font sizes decrease significantly on mobile (33% reduction from desktop)
- Apple favors semi-bold (600 weight) for headings over bold

---

## Whitespace & Layout

### Core Whitespace Philosophy

Apple's design is characterized by **generous whitespace** that creates breathing room and emphasizes individual elements. This approach reduces cognitive load and signals premium quality.

### Spacing System

#### Vertical Spacing (Section Margins):
| Viewport | Top Margin | Bottom Margin |
|----------|------------|---------------|
| Desktop | 92px | 140px |
| Tablet (≤1068px) | 90px | 120px |
| Mobile (≤735px) | 45px | 60px |

### Layout Principles:

1. **Clean Layouts:** Restrained, spacious designs let content breathe
2. **Generous Padding:** Substantial padding around all interactive zones
3. **Expansive Vertical Spacing:** Creates visual breathing room between sections
4. **Distraction-Free:** Products and key messages take center stage
5. **Balanced Composition:** Elements positioned with mathematical precision

### Best Practices:
- Use whitespace strategically to direct attention to key features
- Maintain consistent spacing ratios (approximately 2:3 between top and bottom on desktop)
- Reduce spacing proportionally on mobile (roughly 50% of desktop values)
- Never let content feel cramped—when in doubt, add more space
- Keep layouts simple with clear focal points

### Visual Balance:
Apple achieves balance through:
- Asymmetric layouts that feel intentional, not accidental
- Product imagery centered or offset with text counterbalancing
- Consistent margins and padding creating invisible grid structure
- Large imagery paired with minimal text for maximum impact

---

## Color Palette

### Primary Brand Colors

Apple's modern color system is minimal and sophisticated, emphasizing content over decoration.

#### Core Colors:
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Science Blue** | `#0066CC` | rgb(0, 102, 204) | Links, CTAs, interactive elements |
| **Shark (Near Black)** | `#1D1D1F` | rgb(29, 29, 31) | Primary text, dark backgrounds |
| **Athens Gray** | `#F5F5F7` | rgb(245, 245, 247) | Light backgrounds, sections |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Primary backgrounds, text on dark |

### Color Strategy:

1. **Monochromatic Foundation:** Primarily black text on white backgrounds
2. **High Contrast:** Accessibility-first approach with strong contrast ratios
3. **Subtle Grays:** Support hierarchy without adding visual noise
4. **Strategic Color Use:** Color draws attention to interactive elements
5. **Product Photography Dominates:** Rich imagery provides color, not UI

### Design Philosophy Evolution:
- **Early Apple:** Vibrant rainbow logo, colorful branding
- **Modern Apple (2026):** Sleek, minimalist palette reflecting simplicity and elegance
- **Current Approach:** Let product imagery provide color; UI remains neutral

### Background Treatments:
- **White (#FFFFFF):** Default, creates clean slate
- **Athens Gray (#F5F5F7):** Subtle contrast for alternating sections
- **Shark (#1D1D1F):** Premium, sophisticated feel for hero sections
- **Gradient Backgrounds:** Rare, but used for special product launches

### Accessibility:
- All color combinations meet WCAG AA standards minimum
- Dark mode support with inverted color schemes
- Never rely on color alone to convey information

---

## Animation Patterns

### Core Animation Philosophy

Apple uses **subtle, purposeful animations** that enhance user experience without overwhelming. Animations feel smooth, natural, and high-end.

### Scroll-Driven Animations

Apple pioneered scroll-driven animations for product pages, creating immersive storytelling experiences.

#### Implementation Approaches:

**Traditional (2024-2025):**
- JavaScript-driven scroll listeners
- RAF (requestAnimationFrame) for smooth 60fps
- `transform` properties (not `top`) for GPU acceleration

**Modern (2026):**
```css
animation-timeline: scroll(root);
```
- Zero JavaScript required
- Runs on compositor thread
- Limited browser support (no Firefox yet)

### Parallax Effects

**Definition:** Background moves slower than foreground as user scrolls, creating depth illusion.

#### Best Practices:
- **Speed Differential:** 0.2-0.5 feels natural; >0.7 can cause motion sickness
- **Use Transform:** `transform: translateY()` not `top` for 60fps performance
- **Respect Motion Preferences:** Disable for `prefers-reduced-motion: reduce`
- **Subtle Implementation:** Effect should enhance, not distract

### Hero Section Animations

Apple's product pages feature:
- **Video Backgrounds:** Captivating product videos covering nearly full screen
- **Scroll-Triggered Transitions:** Elements fade, scale, or slide as user scrolls
- **Image Sequences:** Canvas-based frame-by-frame animations (like Mac Pro page)
- **Shifting Light Effects:** Subtle lighting changes on product imagery

### Hover & Micro-Interactions

- **Navigation Hovers:** Smooth submenu reveals with fade-in
- **Button Hovers:** Subtle scale (1.02-1.05) or color shift
- **Card Hovers:** Elevation change (box-shadow) + slight lift
- **Link Underlines:** Animated underline grow from left to right

### Transition Timing

Apple favors:
- **Ease Curves:** `cubic-bezier(0.4, 0, 0.2, 1)` for natural feel
- **Duration:** 200-400ms for most interactions
- **Stagger:** Sequential animations with 50-100ms delay between elements
- **Spring Physics:** iOS-style bouncy animations for playful moments

### Animation Types by Use Case:

| Use Case | Animation Type | Duration | Easing |
|----------|---------------|----------|--------|
| Navigation reveal | Fade + slide | 300ms | ease-out |
| Hero scroll | Transform | N/A (scroll-linked) | linear |
| Button hover | Scale | 200ms | ease |
| Content reveal | Fade + translate up | 400ms | ease-out |
| Image parallax | Transform Y | N/A (scroll-linked) | linear |

### Performance Considerations:
- Animations run on compositor thread (transform, opacity only)
- Avoid animating: width, height, top, left, margin, padding
- Use `will-change` sparingly and remove after animation
- Test on mobile devices for frame rate

---

## Hero Section Design

### Apple's Hero Section Formula

Apple's hero sections are legendary for their **clean, product-focused approach** with minimal text and maximum visual impact.

### Design Patterns:

#### 1. **Chromeless Images**
- Not full-screen but borderless with transparent backgrounds
- Products "float" on clean white or subtle gradient backgrounds
- No visible borders or containers

#### 2. **Minimalist Text**
- **Headline:** 1-2 lines maximum, large type (48px+ desktop)
- **Subheadline:** 1 sentence describing key benefit
- **CTA:** 1-2 clear action buttons ("Learn more", "Buy", "Pre-order")
- **Legal/Details:** Tiny text below if necessary

#### 3. **Visual Hierarchy**
```
[Large Product Image - 60-70% of viewport height]
         ↓
[Short Headline - 48-80px font]
         ↓
[Brief Subheadline - 18-24px font]
         ↓
[CTA Buttons - prominent, spaced]
```

### Layout Variations:

**Image-Dominant:**
- Product centered
- Text overlaid or positioned below
- Background: white, gradient, or video

**Split Layout:**
- Product on one side (60%)
- Text on other side (40%)
- Asymmetric balance

**Full-Bleed Video:**
- Video covers entire viewport
- Text overlaid with dark overlay for readability
- Auto-play, loop, muted

### Typography in Hero Sections:

- **Font Size:** 2.5-4x larger than body text
- **Weight:** Semi-bold to Bold (600-700)
- **Color:** High contrast (white on dark, near-black on light)
- **Line Height:** Tight (1.0-1.2) for impact
- **Alignment:** Center or left, never right

### Best Practices from Apple:

1. **Less is More:** Remove everything that doesn't support the core message
2. **Product First:** Let the product image be the hero, not the text
3. **Instant Comprehension:** User should "get it" in 2-3 seconds
4. **High-Quality Imagery:** 4K+ resolution, professionally shot
5. **Subtle Animation:** Gentle fade-in, slight parallax, or video loop
6. **Mobile Adaptation:** Stack vertically, reduce image size, maintain impact
7. **Loading Priority:** Hero content loads first, optimized for speed
8. **Accessibility:** Alt text, sufficient contrast, keyboard navigable CTAs

### Example Structure (HTML):
```html
<section class="hero" role="banner">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-headline">iPhone 15 Pro</h1>
      <p class="hero-subheadline">Titanium. So strong. So light. So Pro.</p>
      <div class="hero-cta">
        <a href="#" class="btn-primary">Learn more</a>
        <a href="#" class="btn-secondary">Buy</a>
      </div>
    </div>
    <div class="hero-visual">
      <!-- Product imagery or video -->
    </div>
  </div>
</section>
```

### Conversion Optimization:
- **Compelling Imagery:** Photos/videos convey more than paragraphs in seconds
- **Impactful Headlines:** Oversized text paired with minimal content
- **Clear CTAs:** No ambiguity about next action
- **Above the Fold:** Key message visible without scrolling
- **Fast Load Time:** Hero optimized for <2s load

---

## Implementation Guidelines

### For Gemini Landing Pages

Based on Apple's design patterns, here are specific recommendations for implementing the Gemini ad campaign:

### 1. Typography Implementation

**Font Stack:**
```css
:root {
  /* Primary font - use system fonts as SF Pro alternative */
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  "Helvetica Neue", Arial, sans-serif;

  /* Sizes - responsive scale */
  --font-size-hero-desktop: 48px;
  --font-size-hero-tablet: 40px;
  --font-size-hero-mobile: 32px;

  --font-size-heading-desktop: 32px;
  --font-size-heading-tablet: 28px;
  --font-size-heading-mobile: 24px;

  --font-size-body: 18px;
  --font-size-body-small: 16px;

  /* Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line heights */
  --line-height-tight: 1.1;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.7;

  /* Letter spacing */
  --letter-spacing-tight: -0.003em;
  --letter-spacing-normal: 0;
  --letter-spacing-loose: 0.004em;
}
```

### 2. Spacing System

```css
:root {
  /* Spacing scale (8px base) */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  --space-4xl: 128px;

  /* Section spacing */
  --section-padding-desktop: 140px 0 92px;
  --section-padding-tablet: 120px 0 90px;
  --section-padding-mobile: 60px 0 45px;

  /* Container widths */
  --container-max: 1280px;
  --container-padding: 24px;
}
```

### 3. Color System

```css
:root {
  /* Neutrals */
  --color-black: #1D1D1F;
  --color-white: #FFFFFF;
  --color-gray-light: #F5F5F7;
  --color-gray-medium: #86868B;
  --color-gray-dark: #424245;

  /* Brand colors */
  --color-primary: #0066CC; /* Science Blue for links/CTAs */
  --color-gemini-blue: #4285F4; /* Google/Gemini brand */
  --color-accent: #34A853; /* Google green for success states */

  /* Semantic colors */
  --color-text-primary: var(--color-black);
  --color-text-secondary: var(--color-gray-medium);
  --color-text-inverse: var(--color-white);
  --color-background: var(--color-white);
  --color-background-alt: var(--color-gray-light);
  --color-border: rgba(0, 0, 0, 0.1);
}
```

### 4. Animation System

```css
:root {
  /* Timing functions */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Durations */
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 400ms;
}

/* Scroll animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Responsive Breakpoints

```css
/* Match Apple's breakpoints */
@media (max-width: 1068px) { /* Tablet */ }
@media (max-width: 735px) { /* Mobile */ }
@media (max-width: 428px) { /* Small mobile */ }
```

### 6. Hero Section Template

```html
<section class="hero" role="banner">
  <div class="hero-container">
    <div class="hero-content">
      <h1 class="hero-headline">The Truth Matters</h1>
      <p class="hero-subheadline">
        Every answer. Every source. Verified by Google.
      </p>
      <div class="hero-cta">
        <a href="#" class="btn btn-primary">Try Gemini Free</a>
        <a href="#learn-more" class="btn btn-secondary">Learn more</a>
      </div>
    </div>
    <div class="hero-visual">
      <!-- Product imagery or video -->
    </div>
  </div>
</section>
```

### 7. Component Patterns to Implement

**Must-Have Components:**
- Hero section (multiple variants)
- Navigation (sticky, minimal)
- Feature cards (3-column grid)
- CTA sections (full-width, centered)
- Footer (minimal, legal links)
- Button system (primary, secondary, tertiary)

**Advanced Components:**
- Sliding panels (for use case demos)
- Parallax sections
- Video backgrounds
- Image carousels
- Animated icons

### 8. Performance Budget

Following Apple's standards:
- **Page Load:** <2 seconds
- **First Contentful Paint:** <1 second
- **Time to Interactive:** <3 seconds
- **Image Optimization:** WebP format, lazy loading
- **CSS/JS:** Minified, combined, deferred where possible

### 9. Accessibility Requirements

**WCAG AA Compliance:**
- Contrast ratio: 4.5:1 for body text, 3:1 for large text
- Keyboard navigation: All interactive elements
- ARIA labels: For screen readers
- Focus states: Visible on all interactive elements
- Alt text: Descriptive for all images
- Semantic HTML: Proper heading hierarchy

### 10. Browser Compatibility

**Target Support:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (iOS and desktop)
- Progressive enhancement: Core experience works without JS

### 11. Key Differentiators from Apple

While inspired by Apple, Gemini pages should:
- Use **Google's brand colors** (blues, greens) strategically
- Emphasize **trust and verification** (citations, sources)
- Show **workspace integration** (Gmail, Docs, Calendar icons)
- Highlight **AI capabilities** (not hardware)
- Use **warmer, more approachable** tone than Apple's minimalism

### 12. Testing Checklist

Before marking any page complete:
- [ ] Screenshot test at 3 viewport sizes (mobile, tablet, desktop)
- [ ] Verify all animations are smooth (60fps)
- [ ] Check color contrast with accessibility tools
- [ ] Test with keyboard navigation only
- [ ] Validate HTML/CSS
- [ ] Test on actual mobile device
- [ ] Verify <2s load time
- [ ] Check all links work
- [ ] Proofread all copy
- [ ] Get feedback: "Does this capture attention in 3 seconds?"

---

## References & Sources

This research was compiled from the following sources:

### Typography:
- [How to Design a Website "Like Apple's" | DBS Interactive](https://www.dbswebsite.com/blog/how-to-design-a-website-like-apples/)
- [Typography | Apple Developer Documentation](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Typography Trends 2026: Future of Fonts in Web Design](https://www.designmonks.co/blog/typography-trends-2026)
- [San Francisco (sans-serif typeface) - Wikipedia](https://en.wikipedia.org/wiki/San_Francisco_(sans-serif_typeface))

### Whitespace & Layout:
- [40 conversion-boosting hero image website examples - Justinmind](https://www.justinmind.com/blog/inspiring-hero-image-websites/)
- [60 Best Website Design Examples for Ideas (2026)](https://tabnav.com/blog/best-website-design-examples)

### Color Palette:
- [Color | Apple Developer Documentation](https://developer.apple.com/design/human-interface-guidelines/color)
- [Apple Brand Color Palette: Hex, RGB, CMYK and UIs](https://mobbin.com/colors/brand/apple)

### Animations:
- [Let's Make One of Those Fancy Scrolling Animations Used on Apple Product Pages | CSS-Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [The best way to create a parallax scrolling effect in 2026](https://www.builder.io/blog/parallax-scrolling-effect)
- [How to Recreate Apple's Parallax Effect | ProtoPie](https://www.protopie.io/blog/parallax-effect)

### Hero Sections:
- [What is the hero section on a website? Plus tips & examples - Radical Web Design](https://radicalwebdesign.co.uk/blog/website-hero-section/)
- [Best Practices and Creative Hero Section Design Ideas for 2025 - Detachless](https://detachless.com/blog/hero-section-web-design-ideas)

### General Design Trends:
- [10 Web Design Trends Shaping 2026 | Stay Ahead Online](https://www.aufaitux.com/blog/web-design-trends-2026/)
- [14 Web Design Trends to Keep up with in 2026](https://uxpilot.ai/blogs/web-design-trends-2026)

---

## Conclusion

Apple's design system is characterized by:
- **Simplicity:** Remove everything unnecessary
- **Quality:** Premium materials, imagery, typography
- **Clarity:** Instant comprehension, no confusion
- **Elegance:** Refined, sophisticated, timeless
- **Performance:** Fast, smooth, responsive

For the Gemini landing pages, we'll adapt these principles while maintaining Google's brand identity and emphasizing the unique value propositions of Gemini as an AI assistant.

The key is to **capture attention in 2-3 seconds** with bold visuals and minimal text, then provide clear paths to action through strategic CTAs.

---

**Document Version:** 1.0
**Last Updated:** February 1, 2026
**Next Review:** Before implementing design system (Feature #6)
