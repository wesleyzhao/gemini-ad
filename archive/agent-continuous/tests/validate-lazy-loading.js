#!/usr/bin/env node

/**
 * Lazy Loading Validation Script
 *
 * Validates lazy loading implementation across all Gemini landing pages
 * Checks for 2026 best practices:
 * - Native loading="lazy" for images
 * - Preload attributes for videos
 * - Data attributes for lazy loading
 * - Intersection Observer patterns
 * - Accessibility compliance (prefers-reduced-motion)
 *
 * Usage: node tests/validate-lazy-loading.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const PAGES_DIR = path.join(__dirname, '..', 'pages');
const JS_DIR = path.join(__dirname, '..', 'assets', 'js');
const CSS_DIR = path.join(__dirname, '..', 'assets', 'css');

// Quality criteria for lazy loading
const QUALITY_CHECKS = {
    hasLazyVideos: { weight: 15, name: 'Videos have lazy loading attributes' },
    hasPreloadNone: { weight: 15, name: 'Videos use preload="none" for deferred loading' },
    hasDataLazyLoad: { weight: 10, name: 'Custom data-lazy-load attributes present' },
    hasLazyImages: { weight: 10, name: 'Images use lazy loading (data-src or loading="lazy")' },
    hasIframeLazy: { weight: 10, name: 'Iframes use lazy loading' },
    hasSVGAnimations: { weight: 10, name: 'SVG animations deferred with data-animate-draw' },
    animationsJSHasLazyFunctions: { weight: 15, name: 'animations.js has lazy loading functions' },
    cssHasLazyStyles: { weight: 10, name: 'CSS has lazy loading styles' },
    hasReducedMotion: { weight: 5, name: 'Respects prefers-reduced-motion' },
};

const results = {
    pages: [],
    globalChecks: {
        animationsJSHasLazyFunctions: false,
        cssHasLazyStyles: false,
        hasReducedMotion: false,
    },
    summary: {
        totalPages: 0,
        averageScore: 0,
        passedPages: 0,
        failedPages: 0,
    }
};

/**
 * Validate a single HTML page
 */
function validatePage(filePath) {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    const pageResult = {
        file: fileName,
        score: 0,
        maxScore: 0,
        checks: {},
        warnings: [],
        errors: [],
        suggestions: [],
    };

    // Check 1: Videos have lazy loading attributes
    const videoMatches = content.match(/<video[^>]*>/g) || [];
    const lazyVideoCount = videoMatches.filter(v =>
        v.includes('data-lazy-load') || v.includes('loading=')).length;

    if (videoMatches.length > 0) {
        pageResult.checks.hasLazyVideos = lazyVideoCount > 0;
        if (!pageResult.checks.hasLazyVideos) {
            pageResult.errors.push(`Found ${videoMatches.length} videos without lazy loading attributes`);
        }
    } else {
        pageResult.checks.hasLazyVideos = null; // N/A
    }

    // Check 2: Videos use preload="none"
    const preloadNoneCount = videoMatches.filter(v => v.includes('preload="none"')).length;
    const preloadAutoCount = videoMatches.filter(v => v.includes('preload="auto"')).length;

    if (videoMatches.length > 0) {
        pageResult.checks.hasPreloadNone = preloadNoneCount > 0 || preloadAutoCount > 0;

        // Hero videos can use preload="auto", others should use preload="none"
        const nonHeroVideos = videoMatches.filter(v => !v.includes('hero')).length;
        const nonHeroPreloadNone = content.match(/<video(?![^>]*hero)[^>]*preload="none"/g)?.length || 0;

        if (nonHeroVideos > nonHeroPreloadNone && nonHeroVideos > 0) {
            pageResult.warnings.push(`${nonHeroVideos - nonHeroPreloadNone} non-hero videos should use preload="none"`);
        }
    } else {
        pageResult.checks.hasPreloadNone = null;
    }

    // Check 3: Custom data-lazy-load attributes
    pageResult.checks.hasDataLazyLoad = content.includes('data-lazy-load');

    // Check 4: Images use lazy loading
    const imageMatches = content.match(/<img[^>]*>/g) || [];
    const lazyImageCount = imageMatches.filter(img =>
        img.includes('loading="lazy"') || img.includes('data-src')).length;

    if (imageMatches.length > 0) {
        pageResult.checks.hasLazyImages = lazyImageCount > 0;
        if (!pageResult.checks.hasLazyImages) {
            pageResult.suggestions.push(`Consider adding loading="lazy" to ${imageMatches.length} images`);
        }
    } else {
        pageResult.checks.hasLazyImages = null; // No images = N/A
    }

    // Check 5: Iframes use lazy loading
    const iframeMatches = content.match(/<iframe[^>]*>/g) || [];
    const lazyIframeCount = iframeMatches.filter(iframe =>
        iframe.includes('loading="lazy"') || iframe.includes('data-src')).length;

    if (iframeMatches.length > 0) {
        pageResult.checks.hasIframeLazy = lazyIframeCount > 0;
        if (!pageResult.checks.hasIframeLazy) {
            pageResult.errors.push(`${iframeMatches.length} iframes without lazy loading (affects INP and LCP)`);
        }
    } else {
        pageResult.checks.hasIframeLazy = null;
    }

    // Check 6: SVG animations deferred
    const svgMatches = content.match(/<svg[^>]*>/g) || [];
    const svgAnimateCount = svgMatches.filter(svg => svg.includes('data-animate-draw')).length;

    if (svgMatches.length > 0) {
        pageResult.checks.hasSVGAnimations = svgAnimateCount > 0;
        if (svgMatches.length > svgAnimateCount && svgMatches.length > 5) {
            pageResult.suggestions.push(`Consider adding data-animate-draw to ${svgMatches.length - svgAnimateCount} SVGs`);
        }
    } else {
        pageResult.checks.hasSVGAnimations = null;
    }

    // Calculate score for this page
    Object.keys(pageResult.checks).forEach(checkKey => {
        const checkValue = pageResult.checks[checkKey];
        const checkConfig = QUALITY_CHECKS[checkKey];

        if (checkConfig) {
            if (checkValue === null) {
                // N/A - don't count towards max score
                return;
            }

            pageResult.maxScore += checkConfig.weight;
            if (checkValue === true) {
                pageResult.score += checkConfig.weight;
            }
        }
    });

    // Add global checks to max score
    pageResult.maxScore += QUALITY_CHECKS.animationsJSHasLazyFunctions.weight;
    pageResult.maxScore += QUALITY_CHECKS.cssHasLazyStyles.weight;
    pageResult.maxScore += QUALITY_CHECKS.hasReducedMotion.weight;

    return pageResult;
}

/**
 * Validate animations.js for lazy loading functions
 */
function validateAnimationsJS() {
    const filePath = path.join(JS_DIR, 'animations.js');

    if (!fs.existsSync(filePath)) {
        results.globalChecks.animationsJSHasLazyFunctions = false;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for lazy loading functions
    const hasInitLazyLoading = content.includes('initLazyLoading');
    const hasInitIframeLazyLoading = content.includes('initIframeLazyLoading');
    const hasInitSVGLazyLoading = content.includes('initSVGLazyLoading');
    const hasInitDeferredAnimations = content.includes('initDeferredAnimations');
    const hasVideoLazyLoad = content.includes('dataset.lazyLoad') || content.includes('data-lazy-load');

    results.globalChecks.animationsJSHasLazyFunctions =
        hasInitLazyLoading &&
        hasInitIframeLazyLoading &&
        hasInitSVGLazyLoading &&
        hasInitDeferredAnimations &&
        hasVideoLazyLoad;

    if (!results.globalChecks.animationsJSHasLazyFunctions) {
        console.log(`${colors.yellow}⚠ Warning: animations.js missing some lazy loading functions${colors.reset}`);
        if (!hasInitLazyLoading) console.log(`  - Missing: initLazyLoading`);
        if (!hasInitIframeLazyLoading) console.log(`  - Missing: initIframeLazyLoading`);
        if (!hasInitSVGLazyLoading) console.log(`  - Missing: initSVGLazyLoading`);
        if (!hasInitDeferredAnimations) console.log(`  - Missing: initDeferredAnimations`);
        if (!hasVideoLazyLoad) console.log(`  - Missing: video lazy loading support`);
    }
}

/**
 * Validate CSS for lazy loading styles
 */
function validateCSS() {
    const filePath = path.join(CSS_DIR, 'shared-styles.css');

    if (!fs.existsSync(filePath)) {
        results.globalChecks.cssHasLazyStyles = false;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for lazy loading styles
    const hasLazyImageStyles = content.includes('.lazy-image');
    const hasLazyVideoStyles = content.includes('.lazy-video');
    const hasLazyIframeStyles = content.includes('.lazy-iframe');
    const hasReducedMotion = content.includes('prefers-reduced-motion');
    const hasDrawPath = content.includes('drawPath');

    results.globalChecks.cssHasLazyStyles =
        hasLazyImageStyles &&
        hasLazyVideoStyles &&
        hasLazyIframeStyles &&
        hasDrawPath;

    results.globalChecks.hasReducedMotion = hasReducedMotion;

    if (!results.globalChecks.cssHasLazyStyles) {
        console.log(`${colors.yellow}⚠ Warning: shared-styles.css missing some lazy loading styles${colors.reset}`);
        if (!hasLazyImageStyles) console.log(`  - Missing: .lazy-image styles`);
        if (!hasLazyVideoStyles) console.log(`  - Missing: .lazy-video styles`);
        if (!hasLazyIframeStyles) console.log(`  - Missing: .lazy-iframe styles`);
        if (!hasDrawPath) console.log(`  - Missing: @keyframes drawPath`);
    }

    if (!results.globalChecks.hasReducedMotion) {
        console.log(`${colors.red}✗ Error: shared-styles.css missing prefers-reduced-motion support${colors.reset}`);
    }
}

/**
 * Generate detailed report
 */
function generateReport() {
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  Lazy Loading Validation Report${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

    // Global checks summary
    console.log(`${colors.bright}Global Framework Checks:${colors.reset}`);
    const jsCheck = results.globalChecks.animationsJSHasLazyFunctions;
    const cssCheck = results.globalChecks.cssHasLazyStyles;
    const motionCheck = results.globalChecks.hasReducedMotion;

    console.log(`  animations.js: ${jsCheck ? colors.green + '✓ Pass' : colors.red + '✗ Fail'}${colors.reset}`);
    console.log(`  shared-styles.css: ${cssCheck ? colors.green + '✓ Pass' : colors.red + '✗ Fail'}${colors.reset}`);
    console.log(`  Reduced motion: ${motionCheck ? colors.green + '✓ Pass' : colors.red + '✗ Fail'}${colors.reset}`);
    console.log('');

    // Per-page results
    console.log(`${colors.bright}Per-Page Analysis:${colors.reset}\n`);

    results.pages.forEach(page => {
        const percentage = page.maxScore > 0 ? Math.round((page.score / page.maxScore) * 100) : 0;
        const globalScore = results.globalChecks.animationsJSHasLazyFunctions ?
            QUALITY_CHECKS.animationsJSHasLazyFunctions.weight : 0;
        const globalScore2 = results.globalChecks.cssHasLazyStyles ?
            QUALITY_CHECKS.cssHasLazyStyles.weight : 0;
        const globalScore3 = results.globalChecks.hasReducedMotion ?
            QUALITY_CHECKS.hasReducedMotion.weight : 0;

        const totalScore = page.score + globalScore + globalScore2 + globalScore3;
        const totalMax = page.maxScore;
        const totalPercentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

        let statusColor = colors.green;
        let statusIcon = '✓';
        if (totalPercentage < 70) {
            statusColor = colors.red;
            statusIcon = '✗';
        } else if (totalPercentage < 90) {
            statusColor = colors.yellow;
            statusIcon = '⚠';
        }

        console.log(`${statusColor}${statusIcon} ${page.file}${colors.reset}`);
        console.log(`  Score: ${totalScore}/${totalMax} (${totalPercentage}%)`);

        // Show check details
        const checkResults = [];
        Object.keys(page.checks).forEach(key => {
            const value = page.checks[key];
            if (value === true) checkResults.push(`${colors.green}✓${colors.reset} ${QUALITY_CHECKS[key].name}`);
            if (value === false) checkResults.push(`${colors.red}✗${colors.reset} ${QUALITY_CHECKS[key].name}`);
        });

        if (checkResults.length > 0) {
            console.log(`  Checks:`);
            checkResults.forEach(check => console.log(`    ${check}`));
        }

        // Show errors
        if (page.errors.length > 0) {
            console.log(`  ${colors.red}Errors:${colors.reset}`);
            page.errors.forEach(error => console.log(`    ${colors.red}✗${colors.reset} ${error}`));
        }

        // Show warnings
        if (page.warnings.length > 0) {
            console.log(`  ${colors.yellow}Warnings:${colors.reset}`);
            page.warnings.forEach(warning => console.log(`    ${colors.yellow}⚠${colors.reset} ${warning}`));
        }

        // Show suggestions
        if (page.suggestions.length > 0) {
            console.log(`  ${colors.cyan}Suggestions:${colors.reset}`);
            page.suggestions.forEach(suggestion => console.log(`    ${colors.cyan}→${colors.reset} ${suggestion}`));
        }

        console.log('');
    });

    // Summary
    const totalScore = results.pages.reduce((sum, p) => {
        const globalScore = results.globalChecks.animationsJSHasLazyFunctions ?
            QUALITY_CHECKS.animationsJSHasLazyFunctions.weight : 0;
        const globalScore2 = results.globalChecks.cssHasLazyStyles ?
            QUALITY_CHECKS.cssHasLazyStyles.weight : 0;
        const globalScore3 = results.globalChecks.hasReducedMotion ?
            QUALITY_CHECKS.hasReducedMotion.weight : 0;

        const total = p.score + globalScore + globalScore2 + globalScore3;
        const percentage = p.maxScore > 0 ? (total / p.maxScore) * 100 : 0;
        return sum + percentage;
    }, 0);

    results.summary.totalPages = results.pages.length;
    results.summary.averageScore = results.summary.totalPages > 0 ?
        Math.round(totalScore / results.summary.totalPages) : 0;

    results.summary.passedPages = results.pages.filter(p => {
        const globalScore = results.globalChecks.animationsJSHasLazyFunctions ?
            QUALITY_CHECKS.animationsJSHasLazyFunctions.weight : 0;
        const globalScore2 = results.globalChecks.cssHasLazyStyles ?
            QUALITY_CHECKS.cssHasLazyStyles.weight : 0;
        const globalScore3 = results.globalChecks.hasReducedMotion ?
            QUALITY_CHECKS.hasReducedMotion.weight : 0;

        const total = p.score + globalScore + globalScore2 + globalScore3;
        const percentage = p.maxScore > 0 ? (total / p.maxScore) * 100 : 0;
        return percentage >= 70;
    }).length;

    results.summary.failedPages = results.summary.totalPages - results.summary.passedPages;

    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Summary:${colors.reset}`);
    console.log(`  Total Pages: ${results.summary.totalPages}`);
    console.log(`  Average Score: ${results.summary.averageScore}%`);
    console.log(`  Passed (≥70%): ${colors.green}${results.summary.passedPages}${colors.reset}`);
    console.log(`  Failed (<70%): ${results.summary.failedPages > 0 ? colors.red : colors.green}${results.summary.failedPages}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

    // Best practices recommendations
    console.log(`${colors.bright}2026 Lazy Loading Best Practices:${colors.reset}`);
    console.log(`  ${colors.green}✓${colors.reset} Use native loading="lazy" for images when possible`);
    console.log(`  ${colors.green}✓${colors.reset} Use preload="none" for below-fold videos`);
    console.log(`  ${colors.green}✓${colors.reset} Use preload="auto" only for above-fold hero videos`);
    console.log(`  ${colors.green}✓${colors.reset} Defer iframe loading with loading="lazy" or data-src`);
    console.log(`  ${colors.green}✓${colors.reset} Respect prefers-reduced-motion for accessibility`);
    console.log(`  ${colors.green}✓${colors.reset} Use Intersection Observer for custom lazy loading`);
    console.log(`  ${colors.green}✓${colors.reset} Defer heavy animations with requestIdleCallback`);
    console.log('');

    // Save results to markdown
    saveMarkdownReport();

    // Return exit code
    return results.summary.failedPages === 0 &&
           results.globalChecks.animationsJSHasLazyFunctions &&
           results.globalChecks.cssHasLazyStyles &&
           results.globalChecks.hasReducedMotion ? 0 : 1;
}

/**
 * Save results to markdown file
 */
function saveMarkdownReport() {
    const reportPath = path.join(__dirname, '..', 'LAZY_LOADING_REPORT.md');

    let md = '# Lazy Loading Validation Report\n\n';
    md += `**Generated:** ${new Date().toISOString()}\n\n`;
    md += `## Summary\n\n`;
    md += `- **Total Pages:** ${results.summary.totalPages}\n`;
    md += `- **Average Score:** ${results.summary.averageScore}%\n`;
    md += `- **Passed (≥70%):** ${results.summary.passedPages}\n`;
    md += `- **Failed (<70%):** ${results.summary.failedPages}\n\n`;

    md += `## Global Framework Checks\n\n`;
    md += `| Component | Status |\n`;
    md += `|-----------|--------|\n`;
    md += `| animations.js | ${results.globalChecks.animationsJSHasLazyFunctions ? '✓ Pass' : '✗ Fail'} |\n`;
    md += `| shared-styles.css | ${results.globalChecks.cssHasLazyStyles ? '✓ Pass' : '✗ Fail'} |\n`;
    md += `| Reduced Motion | ${results.globalChecks.hasReducedMotion ? '✓ Pass' : '✗ Fail'} |\n\n`;

    md += `## Per-Page Results\n\n`;
    results.pages.forEach(page => {
        const globalScore = results.globalChecks.animationsJSHasLazyFunctions ?
            QUALITY_CHECKS.animationsJSHasLazyFunctions.weight : 0;
        const globalScore2 = results.globalChecks.cssHasLazyStyles ?
            QUALITY_CHECKS.cssHasLazyStyles.weight : 0;
        const globalScore3 = results.globalChecks.hasReducedMotion ?
            QUALITY_CHECKS.hasReducedMotion.weight : 0;

        const totalScore = page.score + globalScore + globalScore2 + globalScore3;
        const totalPercentage = page.maxScore > 0 ? Math.round((totalScore / page.maxScore) * 100) : 0;

        md += `### ${page.file}\n\n`;
        md += `**Score:** ${totalScore}/${page.maxScore} (${totalPercentage}%)\n\n`;

        if (Object.keys(page.checks).length > 0) {
            md += `**Checks:**\n\n`;
            Object.keys(page.checks).forEach(key => {
                const value = page.checks[key];
                if (value !== null) {
                    md += `- ${value ? '✓' : '✗'} ${QUALITY_CHECKS[key].name}\n`;
                }
            });
            md += `\n`;
        }

        if (page.errors.length > 0) {
            md += `**Errors:**\n\n`;
            page.errors.forEach(error => md += `- ✗ ${error}\n`);
            md += `\n`;
        }

        if (page.warnings.length > 0) {
            md += `**Warnings:**\n\n`;
            page.warnings.forEach(warning => md += `- ⚠ ${warning}\n`);
            md += `\n`;
        }

        if (page.suggestions.length > 0) {
            md += `**Suggestions:**\n\n`;
            page.suggestions.forEach(suggestion => md += `- → ${suggestion}\n`);
            md += `\n`;
        }
    });

    md += `## 2026 Lazy Loading Best Practices\n\n`;
    md += `1. Use native \`loading="lazy"\` for images when possible\n`;
    md += `2. Use \`preload="none"\` for below-fold videos\n`;
    md += `3. Use \`preload="auto"\` only for above-fold hero videos\n`;
    md += `4. Defer iframe loading with \`loading="lazy"\` or \`data-src\`\n`;
    md += `5. Respect \`prefers-reduced-motion\` for accessibility\n`;
    md += `6. Use Intersection Observer for custom lazy loading\n`;
    md += `7. Defer heavy animations with \`requestIdleCallback\`\n`;

    fs.writeFileSync(reportPath, md);
    console.log(`${colors.cyan}Report saved to: LAZY_LOADING_REPORT.md${colors.reset}\n`);
}

/**
 * Main execution
 */
function main() {
    console.log(`${colors.bright}Validating lazy loading implementation...${colors.reset}\n`);

    // Validate global JavaScript and CSS
    validateAnimationsJS();
    validateCSS();

    // Validate all HTML pages
    const files = fs.readdirSync(PAGES_DIR)
        .filter(f => f.endsWith('.html'))
        .sort();

    files.forEach(file => {
        const filePath = path.join(PAGES_DIR, file);
        const pageResult = validatePage(filePath);
        results.pages.push(pageResult);
    });

    // Generate and display report
    const exitCode = generateReport();

    process.exit(exitCode);
}

// Run the script
main();
