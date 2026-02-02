# Lazy Loading Validation Report

**Generated:** 2026-02-01T08:52:43.831Z

## Summary

- **Total Pages:** 14
- **Average Score:** 77%
- **Passed (≥70%):** 14
- **Failed (<70%):** 0

## Global Framework Checks

| Component | Status |
|-----------|--------|
| animations.js | ✓ Pass |
| shared-styles.css | ✓ Pass |
| Reduced Motion | ✓ Pass |

## Per-Page Results

### animations-demo.html

**Score:** 80/80 (100%)

**Checks:**

- ✓ Videos have lazy loading attributes
- ✓ Videos use preload="none" for deferred loading
- ✓ Custom data-lazy-load attributes present
- ✓ SVG animations deferred with data-animate-draw

**Warnings:**

- ⚠ 1 non-hero videos should use preload="none"

### apple-style.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### automators.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### comparison.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### creators.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### future.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### index.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### operators.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### productivity.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### research.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### trust.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### valentine.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### workspace.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

### writers.html

**Score:** 30/40 (75%)

**Checks:**

- ✗ Custom data-lazy-load attributes present

## 2026 Lazy Loading Best Practices

1. Use native `loading="lazy"` for images when possible
2. Use `preload="none"` for below-fold videos
3. Use `preload="auto"` only for above-fold hero videos
4. Defer iframe loading with `loading="lazy"` or `data-src`
5. Respect `prefers-reduced-motion` for accessibility
6. Use Intersection Observer for custom lazy loading
7. Defer heavy animations with `requestIdleCallback`
