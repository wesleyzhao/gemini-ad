#!/usr/bin/env node

/**
 * Image Optimization Script for Gemini Landing Pages
 *
 * This script provides comprehensive image optimization including:
 * - WebP conversion with fallback support
 * - Responsive image generation (multiple sizes)
 * - Automatic srcset generation
 * - Lazy loading enhancement
 * - AVIF support (future-ready)
 *
 * Usage:
 *   node scripts/optimize-images.js [options]
 *
 * Options:
 *   --source <dir>     Source directory (default: assets/images/source)
 *   --output <dir>     Output directory (default: assets/images/optimized)
 *   --formats <list>   Output formats (default: webp,jpg)
 *   --sizes <list>     Image widths to generate (default: 320,640,768,1024,1440,1920)
 *   --quality <num>    Quality 1-100 (default: 85)
 *   --report           Generate optimization report
 *
 * Examples:
 *   node scripts/optimize-images.js --report
 *   node scripts/optimize-images.js --quality 90 --formats webp,avif,jpg
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    sourceDir: 'assets/images/source',
    outputDir: 'assets/images/optimized',
    formats: ['webp', 'jpg'],
    sizes: [320, 640, 768, 1024, 1440, 1920],
    quality: 85,
    generateReport: false
};

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--source':
                config.sourceDir = args[++i];
                break;
            case '--output':
                config.outputDir = args[++i];
                break;
            case '--formats':
                config.formats = args[++i].split(',');
                break;
            case '--sizes':
                config.sizes = args[++i].split(',').map(Number);
                break;
            case '--quality':
                config.quality = parseInt(args[++i], 10);
                break;
            case '--report':
                config.generateReport = true;
                break;
            case '--help':
                console.log(getHelpText());
                process.exit(0);
                break;
        }
    }
}

function getHelpText() {
    return `
Image Optimization Script for Gemini Landing Pages

Usage:
  node scripts/optimize-images.js [options]

Options:
  --source <dir>     Source directory (default: assets/images/source)
  --output <dir>     Output directory (default: assets/images/optimized)
  --formats <list>   Output formats (default: webp,jpg)
  --sizes <list>     Image widths to generate (default: 320,640,768,1024,1440,1920)
  --quality <num>    Quality 1-100 (default: 85)
  --report           Generate optimization report
  --help             Show this help message

Examples:
  node scripts/optimize-images.js --report
  node scripts/optimize-images.js --quality 90 --formats webp,avif,jpg
  node scripts/optimize-images.js --source custom/dir --output build/images

Note: This script requires sharp package for image processing.
Install with: npm install sharp --save-dev
`;
}

// Check if sharp is available
function checkDependencies() {
    try {
        require.resolve('sharp');
        return true;
    } catch (e) {
        console.error('❌ Error: sharp package is not installed.');
        console.error('');
        console.error('Sharp is required for image optimization.');
        console.error('Install it with: npm install sharp --save-dev');
        console.error('');
        console.error('For now, this script will run in documentation mode.');
        console.error('');
        return false;
    }
}

// Create directories
function ensureDirectories() {
    const dirs = [
        config.sourceDir,
        config.outputDir,
        path.join(config.outputDir, 'webp'),
        path.join(config.outputDir, 'jpg'),
        path.join(config.outputDir, 'avif')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    });
}

// Generate HTML helper for responsive images
function generateImageHelper(imageName, alt, className = '', lazy = true) {
    const baseName = path.parse(imageName).name;

    // Generate srcset for WebP
    const webpSrcset = config.sizes
        .map(size => `optimized/webp/${baseName}-${size}w.webp ${size}w`)
        .join(', ');

    // Generate srcset for JPG fallback
    const jpgSrcset = config.sizes
        .map(size => `optimized/jpg/${baseName}-${size}w.jpg ${size}w`)
        .join(', ');

    // Determine default size (use middle size)
    const defaultSize = config.sizes[Math.floor(config.sizes.length / 2)];

    return `
<picture>
    <!-- WebP format for modern browsers -->
    <source
        type="image/webp"
        srcset="${webpSrcset}"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
    />

    <!-- JPEG fallback for older browsers -->
    <source
        type="image/jpeg"
        srcset="${jpgSrcset}"
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
    />

    <!-- Default img tag -->
    <img
        src="optimized/jpg/${baseName}-${defaultSize}w.jpg"
        alt="${alt}"
        ${className ? `class="${className}"` : ''}
        ${lazy ? 'loading="lazy"' : ''}
        decoding="async"
        width="${defaultSize}"
        height="auto"
    />
</picture>`.trim();
}

// Main optimization function
async function optimizeImages() {
    const hasSharp = checkDependencies();

    if (!hasSharp) {
        console.log('\n📚 Running in documentation mode...\n');
        ensureDirectories();
        generateDocumentation();
        return;
    }

    const sharp = require('sharp');
    ensureDirectories();

    // Get all source images
    const sourceFiles = fs.readdirSync(config.sourceDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

    if (sourceFiles.length === 0) {
        console.log('ℹ️  No images found in source directory.');
        console.log(`   Place source images in: ${config.sourceDir}`);
        console.log('');
        generateDocumentation();
        return;
    }

    console.log(`\n🖼️  Found ${sourceFiles.length} images to optimize\n`);

    const results = [];

    for (const file of sourceFiles) {
        const sourcePath = path.join(config.sourceDir, file);
        const baseName = path.parse(file).name;
        const stats = fs.statSync(sourcePath);
        const originalSize = stats.size;

        console.log(`Processing: ${file}`);

        let totalOptimizedSize = 0;

        for (const format of config.formats) {
            for (const size of config.sizes) {
                const outputFile = `${baseName}-${size}w.${format}`;
                const outputPath = path.join(config.outputDir, format, outputFile);

                try {
                    const image = sharp(sourcePath);
                    const metadata = await image.metadata();

                    // Only resize if source is larger than target
                    if (metadata.width > size) {
                        image.resize(size, null, {
                            fit: 'inside',
                            withoutEnlargement: true
                        });
                    }

                    // Convert to target format
                    if (format === 'webp') {
                        image.webp({ quality: config.quality });
                    } else if (format === 'jpg' || format === 'jpeg') {
                        image.jpeg({ quality: config.quality, mozjpeg: true });
                    } else if (format === 'avif') {
                        image.avif({ quality: config.quality });
                    }

                    await image.toFile(outputPath);

                    const optimizedStats = fs.statSync(outputPath);
                    totalOptimizedSize += optimizedStats.size;

                    console.log(`  ✓ ${format} ${size}w: ${(optimizedStats.size / 1024).toFixed(1)} KB`);
                } catch (error) {
                    console.error(`  ✗ Error creating ${outputFile}: ${error.message}`);
                }
            }
        }

        results.push({
            file,
            originalSize,
            optimizedSize: totalOptimizedSize,
            savings: originalSize - totalOptimizedSize,
            savingsPercent: ((originalSize - totalOptimizedSize) / originalSize * 100).toFixed(1)
        });

        console.log('');
    }

    // Print summary
    console.log('━'.repeat(60));
    console.log('Optimization Summary');
    console.log('━'.repeat(60));

    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
    const totalSavings = totalOriginal - totalOptimized;
    const totalSavingsPercent = (totalSavings / totalOriginal * 100).toFixed(1);

    console.log(`Total original size:  ${(totalOriginal / 1024).toFixed(1)} KB`);
    console.log(`Total optimized size: ${(totalOptimized / 1024).toFixed(1)} KB`);
    console.log(`Total savings:        ${(totalSavings / 1024).toFixed(1)} KB (${totalSavingsPercent}%)`);
    console.log('');

    if (config.generateReport) {
        generateReport(results);
    }

    generateDocumentation();
}

// Generate optimization report
function generateReport(results) {
    const reportPath = path.join('performance-reports', `image-optimization-${new Date().toISOString().split('T')[0]}.md`);

    if (!fs.existsSync('performance-reports')) {
        fs.mkdirSync('performance-reports', { recursive: true });
    }

    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
    const totalSavings = totalOriginal - totalOptimized;
    const totalSavingsPercent = (totalSavings / totalOriginal * 100).toFixed(1);

    const report = `# Image Optimization Report

**Date:** ${new Date().toISOString().split('T')[0]}
**Images Processed:** ${results.length}

## Summary

- **Total Original Size:** ${(totalOriginal / 1024).toFixed(2)} KB
- **Total Optimized Size:** ${(totalOptimized / 1024).toFixed(2)} KB
- **Total Savings:** ${(totalSavings / 1024).toFixed(2)} KB (${totalSavingsPercent}%)

## Configuration

- **Output Formats:** ${config.formats.join(', ')}
- **Sizes Generated:** ${config.sizes.join(', ')} pixels
- **Quality Setting:** ${config.quality}%

## Individual Results

${results.map(r => `### ${r.file}

- Original Size: ${(r.originalSize / 1024).toFixed(2)} KB
- Optimized Size: ${(r.optimizedSize / 1024).toFixed(2)} KB
- Savings: ${(r.savings / 1024).toFixed(2)} KB (${r.savingsPercent}%)
`).join('\n')}

## Next Steps

1. Review optimized images for quality
2. Update HTML pages to use responsive images
3. Test loading performance on various devices
4. Monitor Core Web Vitals improvements
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📊 Report generated: ${reportPath}\n`);
}

// Generate usage documentation
function generateDocumentation() {
    const docPath = 'docs/IMAGE_OPTIMIZATION.md';

    if (!fs.existsSync('docs')) {
        fs.mkdirSync('docs', { recursive: true });
    }

    const doc = `# Image Optimization Guide

## Overview

This guide explains how to use the image optimization infrastructure for the Gemini landing pages.

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install sharp --save-dev
   \`\`\`

2. **Place source images:**
   - Put your high-resolution source images in \`${config.sourceDir}\`
   - Supported formats: JPG, PNG, WebP

3. **Run optimization:**
   \`\`\`bash
   node scripts/optimize-images.js --report
   \`\`\`

4. **Use generated images in HTML:**
   - See examples below for proper HTML markup

## Generated Image Sizes

Images are automatically generated in these sizes:
${config.sizes.map(size => `- ${size}px width`).join('\n')}

## Output Formats

- **WebP:** Modern format with excellent compression (default)
- **JPEG:** Universal fallback for older browsers
- **AVIF:** Next-gen format (optional, use \`--formats webp,avif,jpg\`)

## HTML Usage Examples

### Basic Responsive Image

\`\`\`html
${generateImageHelper('example.jpg', 'Example image description', 'feature-image')}
\`\`\`

### Hero Image (No Lazy Loading)

\`\`\`html
${generateImageHelper('hero.jpg', 'Hero image', 'hero-image', false)}
\`\`\`

### Custom Sizes Attribute

\`\`\`html
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
\`\`\`

## Best Practices

### 1. Image Placement

- **Hero images:** Place above the fold, don't lazy load
- **Feature images:** Lazy load, use appropriate sizes
- **Thumbnails:** Use smaller size variants

### 2. Alt Text

Always provide descriptive alt text:
\`\`\`html
<!-- Good -->
<img alt="Gemini AI suggesting relevant citations from academic sources" />

<!-- Bad -->
<img alt="Screenshot" />
\`\`\`

### 3. Sizes Attribute

Match the \`sizes\` attribute to your layout:
\`\`\`html
<!-- Full width on mobile, half width on desktop -->
sizes="(max-width: 768px) 100vw, 50vw"

<!-- Sidebar image, always 300px max -->
sizes="(max-width: 300px) 100vw, 300px"
\`\`\`

### 4. Lazy Loading

Use lazy loading for all images except:
- Hero images
- Above-the-fold content
- Critical UI elements

\`\`\`html
<!-- Lazy load (default for most images) -->
<img src="..." loading="lazy" />

<!-- Eager load (hero/critical images) -->
<img src="..." loading="eager" />
\`\`\`

### 5. Aspect Ratio

Prevent layout shift by specifying dimensions:
\`\`\`html
<img
    src="optimized/jpg/image-640w.jpg"
    width="640"
    height="480"
    alt="Description"
    loading="lazy"
/>
\`\`\`

Or use CSS aspect-ratio:
\`\`\`css
.feature-image {
    aspect-ratio: 16 / 9;
    width: 100%;
    object-fit: cover;
}
\`\`\`

## Advanced Usage

### Custom Quality Settings

\`\`\`bash
# High quality for portfolio/showcase images
node scripts/optimize-images.js --quality 95

# Lower quality for thumbnails
node scripts/optimize-images.js --quality 75 --sizes 100,200,300
\`\`\`

### Multiple Formats

\`\`\`bash
# Include next-gen AVIF format
node scripts/optimize-images.js --formats webp,avif,jpg
\`\`\`

### Custom Directories

\`\`\`bash
node scripts/optimize-images.js \\
    --source path/to/source \\
    --output path/to/output
\`\`\`

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
\`\`\`bash
npm install --platform=linux --arch=x64 sharp
\`\`\`

### WebP Not Supported

For very old browsers, ensure JPEG fallback:
\`\`\`html
<picture>
    <source type="image/webp" srcset="image.webp" />
    <img src="image.jpg" alt="Fallback" />
</picture>
\`\`\`

### Image Quality Too Low

Adjust quality setting:
\`\`\`bash
node scripts/optimize-images.js --quality 90
\`\`\`

## Integration with Build Process

Add to package.json:
\`\`\`json
{
    "scripts": {
        "optimize-images": "node scripts/optimize-images.js --report",
        "build": "npm run optimize-images && npm run build:css && npm run build:js"
    }
}
\`\`\`

## Future Enhancements

Potential improvements:
- Automatic image optimization on commit (git hook)
- CDN integration
- Responsive background images
- Art direction (different crops per size)
- Blurhash placeholders for smooth loading
`;

    fs.writeFileSync(docPath, doc);
    console.log(`📖 Documentation generated: ${docPath}\n`);
}

// Main execution
parseArgs();
optimizeImages().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
