#!/usr/bin/env node
/**
 * Performance Validation Script
 * Checks for performance best practices in HTML, CSS, and JS
 */

const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

class PerformanceValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passes = [];
    }

    validateHTMLFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);

        console.log(`\n${colors.cyan}Analyzing: ${fileName}${colors.reset}`);

        this.errors = [];
        this.warnings = [];
        this.passes = [];

        // File size check
        const sizeKB = Math.round((content.length / 1024) * 10) / 10;
        if (sizeKB < 100) {
            this.passes.push(`HTML size: ${sizeKB}KB (excellent)`);
        } else if (sizeKB < 200) {
            this.warnings.push(`HTML size: ${sizeKB}KB (consider optimization)`);
        } else {
            this.errors.push(`HTML size: ${sizeKB}KB (too large, split content)`);
        }

        // External resource loading
        const linkTags = content.match(/<link[^>]*>/gi) || [];
        const scriptTags = content.match(/<script[^>]*>/gi) || [];

        // Check for async/defer on scripts
        const scriptsWithoutAsync = scriptTags.filter(tag => {
            return !tag.match(/async|defer/i) && !tag.match(/type=["']module["']/i);
        });

        if (scriptsWithoutAsync.length > 0) {
            this.warnings.push(`${scriptsWithoutAsync.length} script(s) without async/defer - may block rendering`);
        } else if (scriptTags.length > 0) {
            this.passes.push('All scripts use async/defer or module type');
        }

        // Check for preconnect/dns-prefetch
        const hasPreconnect = linkTags.some(tag => tag.match(/rel=["']preconnect["']/i));
        const hasDnsPrefetch = linkTags.some(tag => tag.match(/rel=["']dns-prefetch["']/i));

        if (hasPreconnect || hasDnsPrefetch) {
            this.passes.push('Uses DNS optimization (preconnect/dns-prefetch)');
        }

        // Check for resource hints (preload)
        const hasPreload = linkTags.some(tag => tag.match(/rel=["']preload["']/i));
        if (hasPreload) {
            this.passes.push('Uses resource preloading');
        }

        // Image optimization
        const imgTags = content.match(/<img[^>]*>/gi) || [];

        // Check for lazy loading
        const lazyImages = imgTags.filter(tag => tag.match(/loading=["']lazy["']/i));
        if (lazyImages.length > 0 && lazyImages.length < imgTags.length) {
            this.passes.push(`${lazyImages.length}/${imgTags.length} images use lazy loading`);
        } else if (imgTags.length > 3 && lazyImages.length === 0) {
            this.warnings.push('No lazy loading on images. Consider adding loading="lazy"');
        } else if (lazyImages.length === imgTags.length && imgTags.length > 0) {
            this.passes.push('All images use lazy loading');
        }

        // Check for explicit width/height
        const imgsWithDimensions = imgTags.filter(tag => {
            return tag.match(/width=["']\d+["']/i) && tag.match(/height=["']\d+["']/i);
        });

        if (imgsWithDimensions.length === imgTags.length && imgTags.length > 0) {
            this.passes.push('All images have explicit dimensions (prevents layout shift)');
        } else if (imgTags.length > 0) {
            this.warnings.push(`${imgTags.length - imgsWithDimensions.length} image(s) missing width/height attributes`);
        }

        // Check for modern image formats (WebP, AVIF)
        const modernImages = imgTags.filter(tag => tag.match(/\.(webp|avif)["']/i));
        const oldFormatImages = imgTags.filter(tag => tag.match(/\.(jpg|jpeg|png)["']/i));

        if (modernImages.length > 0) {
            this.passes.push(`Uses modern image formats (${modernImages.length} WebP/AVIF images)`);
        } else if (oldFormatImages.length > 0) {
            this.warnings.push('No modern image formats detected. Consider WebP/AVIF for better performance');
        }

        // Font loading strategy
        const fontLinks = linkTags.filter(tag =>
            tag.match(/fonts\.googleapis\.com|fonts\.gstatic\.com/i)
        );

        if (fontLinks.length > 0) {
            const fontsWithPreconnect = linkTags.some(tag =>
                tag.match(/rel=["']preconnect["'][^>]*fonts\.gstatic\.com/i)
            );

            if (fontsWithPreconnect) {
                this.passes.push('Google Fonts optimized with preconnect');
            } else {
                this.warnings.push('Google Fonts detected but no preconnect. Add preconnect for better performance');
            }

            // Check for font-display
            const hasStylesheet = content.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
            const hasFontDisplay = hasStylesheet.some(style => style.match(/font-display\s*:/i));

            if (hasFontDisplay) {
                this.passes.push('Uses font-display property');
            } else {
                this.warnings.push('No font-display property found. Consider adding font-display: swap');
            }
        }

        // CSS loading
        const cssLinks = linkTags.filter(tag => tag.match(/rel=["']stylesheet["']/i));

        if (cssLinks.length > 3) {
            this.warnings.push(`${cssLinks.length} CSS files detected. Consider combining for fewer requests`);
        } else if (cssLinks.length > 0) {
            this.passes.push(`Minimal CSS files (${cssLinks.length})`);
        }

        // Check for critical CSS inlining
        const hasInlineStyles = content.match(/<style[^>]*>[\s\S]*?<\/style>/i);
        if (hasInlineStyles) {
            const inlineCSSSize = hasInlineStyles[0].length;
            if (inlineCSSSize > 14 * 1024) { // 14KB is typical TCP packet size
                this.warnings.push('Inline CSS is very large. Consider extracting to external file');
            } else {
                this.passes.push('Uses inline critical CSS (good for first paint)');
            }
        }

        // Third-party scripts
        const thirdPartyScripts = scriptTags.filter(tag =>
            tag.match(/src=["']https?:\/\/(?!localhost)/i)
        );

        if (thirdPartyScripts.length > 5) {
            this.warnings.push(`${thirdPartyScripts.length} third-party scripts. May impact performance`);
        } else if (thirdPartyScripts.length > 0) {
            this.passes.push(`Minimal third-party scripts (${thirdPartyScripts.length})`);
        } else {
            this.passes.push('No third-party scripts (excellent)');
        }

        // DOM size
        const totalTags = (content.match(/<[^>]+>/g) || []).length;
        if (totalTags < 500) {
            this.passes.push(`DOM size: ${totalTags} elements (good)`);
        } else if (totalTags < 1000) {
            this.warnings.push(`DOM size: ${totalTags} elements (consider reducing complexity)`);
        } else {
            this.errors.push(`DOM size: ${totalTags} elements (too large, impacts performance)`);
        }

        // Inline scripts
        const inlineScripts = content.match(/<script[^>]*>(?!.*src=)[\s\S]*?<\/script>/gi) || [];
        const inlineScriptSize = inlineScripts.reduce((sum, script) => sum + script.length, 0);

        if (inlineScriptSize > 10000) {
            this.warnings.push('Large inline JavaScript. Consider moving to external file');
        }

        return {
            file: fileName,
            sizeKB: sizeKB,
            errors: this.errors.length,
            warnings: this.warnings.length,
            passes: this.passes.length
        };
    }

    validateJSFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);

        console.log(`\n${colors.cyan}Analyzing: ${fileName}${colors.reset}`);

        this.errors = [];
        this.warnings = [];
        this.passes = [];

        const sizeKB = Math.round((content.length / 1024) * 10) / 10;

        if (sizeKB < 50) {
            this.passes.push(`File size: ${sizeKB}KB (good)`);
        } else if (sizeKB < 100) {
            this.warnings.push(`File size: ${sizeKB}KB (consider code splitting)`);
        } else {
            this.warnings.push(`File size: ${sizeKB}KB (large, definitely split or minify)`);
        }

        // Check for event listeners
        const eventListeners = (content.match(/addEventListener/g) || []).length;
        if (eventListeners > 0) {
            this.passes.push(`Uses ${eventListeners} event listeners`);
        }

        // Check for passive event listeners (performance optimization)
        const passiveListeners = (content.match(/\{\s*passive\s*:\s*true\s*\}/g) || []).length;
        if (passiveListeners > 0) {
            this.passes.push(`${passiveListeners} passive event listeners (performance optimized)`);
        }

        // Check for requestAnimationFrame
        const rafUsage = (content.match(/requestAnimationFrame/g) || []).length;
        if (rafUsage > 0) {
            this.passes.push(`Uses requestAnimationFrame for smooth animations (${rafUsage} instances)`);
        }

        // Check for debounce/throttle patterns
        const hasDebounce = content.match(/debounce|throttle/i);
        if (hasDebounce) {
            this.passes.push('Uses debounce/throttle for performance');
        }

        // Check for Intersection Observer
        const hasIntersectionObserver = content.match(/IntersectionObserver/);
        if (hasIntersectionObserver) {
            this.passes.push('Uses IntersectionObserver for efficient scroll detection');
        }

        // Check for console.log (should be removed in production)
        const consoleLogs = (content.match(/console\.(log|warn|error|debug)/g) || []).length;
        if (consoleLogs > 5) {
            this.warnings.push(`${consoleLogs} console statements found. Remove for production`);
        }

        // Check for querySelector in loops
        const hasQuerySelectorInLoop = content.match(/(for|while)\s*\([^)]*\)\s*{[^}]*querySelector/);
        if (hasQuerySelectorInLoop) {
            this.warnings.push('querySelector inside loop detected. Cache selectors for better performance');
        }

        // Check for modern JavaScript features
        const usesArrowFunctions = (content.match(/=>/g) || []).length;
        const usesConst = (content.match(/\bconst\b/g) || []).length;
        const usesLet = (content.match(/\blet\b/g) || []).length;

        if (usesArrowFunctions > 0 || usesConst > 0 || usesLet > 0) {
            this.passes.push('Uses modern JavaScript (ES6+)');
        }

        return {
            file: fileName,
            sizeKB: sizeKB,
            errors: this.errors.length,
            warnings: this.warnings.length,
            passes: this.passes.length
        };
    }

    printResults(fileName) {
        if (this.passes.length > 0) {
            console.log(`\n${colors.green}✓ Passes (${this.passes.length}):${colors.reset}`);
            this.passes.forEach(pass => console.log(`  ${colors.green}✓${colors.reset} ${pass}`));
        }

        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}⚠ Warnings (${this.warnings.length}):${colors.reset}`);
            this.warnings.forEach(warning => console.log(`  ${colors.yellow}⚠${colors.reset} ${warning}`));
        }

        if (this.errors.length > 0) {
            console.log(`\n${colors.red}✗ Errors (${this.errors.length}):${colors.reset}`);
            this.errors.forEach(error => console.log(`  ${colors.red}✗${colors.reset} ${error}`));
        }

        const total = this.passes.length + this.warnings.length + this.errors.length;
        const score = total > 0 ? Math.round((this.passes.length / total) * 100) : 0;
        console.log(`\n${colors.blue}Performance Score: ${score}%${colors.reset}`);
    }
}

// Main execution
if (require.main === module) {
    const validator = new PerformanceValidator();

    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Performance Validation Report${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    const results = [];

    // Validate HTML files
    console.log(`\n${colors.blue}HTML Files:${colors.reset}`);
    const pagesDir = path.join(__dirname, '../pages');
    const htmlFiles = fs.readdirSync(pagesDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(pagesDir, file));

    htmlFiles.forEach(file => {
        const result = validator.validateHTMLFile(file);
        validator.printResults(result.file);
        results.push(result);
    });

    // Validate JS files
    console.log(`\n${colors.blue}JavaScript Files:${colors.reset}`);
    const jsFile = path.join(__dirname, '../assets/js/animations.js');
    if (fs.existsSync(jsFile)) {
        const result = validator.validateJSFile(jsFile);
        validator.printResults(result.file);
        results.push(result);
    }

    // Summary
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);
    const totalPasses = results.reduce((sum, r) => sum + r.passes, 0);
    const totalSize = results.reduce((sum, r) => sum + r.sizeKB, 0);

    console.log(`\nTotal files analyzed: ${results.length}`);
    console.log(`Total size: ${Math.round(totalSize * 10) / 10}KB`);
    console.log(`${colors.green}✓ Passes: ${totalPasses}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Warnings: ${totalWarnings}${colors.reset}`);
    console.log(`${colors.red}✗ Errors: ${totalErrors}${colors.reset}`);

    const overallScore = Math.round((totalPasses / (totalPasses + totalWarnings + totalErrors)) * 100);
    console.log(`\n${colors.blue}Overall Performance Score: ${overallScore}%${colors.reset}\n`);

    process.exit(totalErrors > 0 ? 1 : 0);
}

module.exports = PerformanceValidator;
