# Image Optimization Guide

## Overview

This guide explains how to use the image optimization infrastructure for the Gemini landing pages.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install sharp --save-dev
   ```

2. **Place source images:**
   - Put your high-resolution source images in `assets/images/source`
   - Supported formats: JPG, PNG, WebP

3. **Run optimization:**
   ```bash
   node scripts/optimize-images.js --report
   ```

4. **Use generated images in HTML:**
   - See examples below for proper HTML markup

## Generated Image Sizes

Images are automatically generated in these sizes:
- 320px width
- 640px width
- 768px width
- 1024px width
- 1440px width
- 1920px width

## Output Formats

- **WebP:** Modern format with excellent compression (default)
- **JPEG:** Universal fallback for older browsers
- **AVIF:** Next-gen format (optional, use `--formats webp,avif,jpg`)

## HTML Usage Examples

### Basic Responsive Image

```html
<picture>
    <!-- WebP format for modern browsers -->
    <source
        type="image/webp"
        srcset="optimized/webp/example-320w.webp 320w, optimized/webp/example-640w.webp 640w, optimized/webp/example-768w.webp 768w, optimized/webp/example-1024w.webp 1024w, optimized/webp/example-1440w.webp 1440w, optimized/webp/example-1920w.webp 1920w"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
    />

    <!-- JPEG fallback for older browsers -->
    <source
        type="image/jpeg"
        srcset="optimized/jpg/example-320w.jpg 320w, optimized/jpg/example-640w.jpg 640w, optimized/jpg/example-768w.jpg 768w, optimized/jpg/example-1024w.jpg 1024w, optimized/jpg/example-1440w.jpg 1440w, optimized/jpg/example-1920w.jpg 1920w"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
    />

    <!-- Default img tag -->
    <img
        src="optimized/jpg/example-1024w.jpg"
        alt="Example image description"
        class="feature-image"
        loading="lazy"
        decoding="async"
        width="1024"
        height="auto"
    />
</picture>
```

### Hero Image (No Lazy Loading)

```html
<picture>
    <!-- WebP format for modern browsers -->
    <source
        type="image/webp"
        srcset="optimized/webp/hero-320w.webp 320w, optimized/webp/hero-640w.webp 640w, optimized/webp/hero-768w.webp 768w, optimized/webp/hero-1024w.webp 1024w, optimized/webp/hero-1440w.webp 1440w, optimized/webp/hero-1920w.webp 1920w"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
    />

    <!-- JPEG fallback for older browsers -->
    <source
        type="image/jpeg"
        srcset="optimized/jpg/hero-320w.jpg 320w, optimized/jpg/hero-640w.jpg 640w, optimized/jpg/hero-768w.jpg 768w, optimized/jpg/hero-1024w.jpg 1024w, optimized/jpg/hero-1440w.jpg 1440w, optimized/jpg/hero-1920w.jpg 1920w"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
    />

    <!-- Default img tag -->
    <img
        src="optimized/jpg/hero-1024w.jpg"
        alt="Hero image"
        class="hero-image"
        
        decoding="async"
        width="1024"
        height="auto"
    />
</picture>
```

### Custom Sizes Attribute

```html
<picture>
    <source
        type="image/webp"
        srcset="optimized/webp/product-320w.webp 320w,
                optimized/webp/product-640w.webp 640w,
                optimized/webp/product-1024w.webp 1024w"
        sizes="(max-width: 600px) 100vw, 50vw"
    />
    <img src="optimized/jpg/product-640w.jpg" alt="Product image" loading="lazy" />
</picture>
```

## Best Practices

### 1. Image Placement

- **Hero images:** Place above the fold, don't lazy load
- **Feature images:** Lazy load, use appropriate sizes
- **Thumbnails:** Use smaller size variants

### 2. Alt Text

Always provide descriptive alt text:
```html
<!-- Good -->
<img alt="Gemini AI suggesting relevant citations from academic sources" />

<!-- Bad -->
<img alt="Screenshot" />
```

### 3. Sizes Attribute

Match the `sizes` attribute to your layout:
```html
<!-- Full width on mobile, half width on desktop -->
sizes="(max-width: 768px) 100vw, 50vw"

<!-- Sidebar image, always 300px max -->
sizes="(max-width: 300px) 100vw, 300px"
```

### 4. Lazy Loading

Use lazy loading for all images except:
- Hero images
- Above-the-fold content
- Critical UI elements

```html
<!-- Lazy load (default for most images) -->
<img src="..." loading="lazy" />

<!-- Eager load (hero/critical images) -->
<img src="..." loading="eager" />
```

### 5. Aspect Ratio

Prevent layout shift by specifying dimensions:
```html
<img
    src="optimized/jpg/image-640w.jpg"
    width="640"
    height="480"
    alt="Description"
    loading="lazy"
/>
```

Or use CSS aspect-ratio:
```css
.feature-image {
    aspect-ratio: 16 / 9;
    width: 100%;
    object-fit: cover;
}
```

## Advanced Usage

### Custom Quality Settings

```bash
# High quality for portfolio/showcase images
node scripts/optimize-images.js --quality 95

# Lower quality for thumbnails
node scripts/optimize-images.js --quality 75 --sizes 100,200,300
```

### Multiple Formats

```bash
# Include next-gen AVIF format
node scripts/optimize-images.js --formats webp,avif,jpg
```

### Custom Directories

```bash
node scripts/optimize-images.js \
    --source path/to/source \
    --output path/to/output
```

## Performance Impact

Proper image optimization can improve:

- **Page Load Time:** 30-50% faster
- **Largest Contentful Paint (LCP):** 25-40% improvement
- **Bandwidth Usage:** 50-80% reduction
- **Mobile Experience:** Significantly better on slow connections

## Monitoring

After implementing optimized images:

1. Check PageSpeed Insights scores
2. Monitor LCP in performance dashboard
3. Test on slow 3G connections
4. Verify images load correctly across browsers

## Troubleshooting

### Sharp Installation Issues

If sharp fails to install:
```bash
npm install --platform=linux --arch=x64 sharp
```

### WebP Not Supported

For very old browsers, ensure JPEG fallback:
```html
<picture>
    <source type="image/webp" srcset="image.webp" />
    <img src="image.jpg" alt="Fallback" />
</picture>
```

### Image Quality Too Low

Adjust quality setting:
```bash
node scripts/optimize-images.js --quality 90
```

## Integration with Build Process

Add to package.json:
```json
{
    "scripts": {
        "optimize-images": "node scripts/optimize-images.js --report",
        "build": "npm run optimize-images && npm run build:css && npm run build:js"
    }
}
```

## Future Enhancements

Potential improvements:
- Automatic image optimization on commit (git hook)
- CDN integration
- Responsive background images
- Art direction (different crops per size)
- Blurhash placeholders for smooth loading
