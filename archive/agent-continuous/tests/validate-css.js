#!/usr/bin/env node
/**
 * CSS Validation Script
 * Validates CSS quality, consistency, and best practices
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

class CSSValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passes = [];
    }

    validateFile(filePath) {
        console.log(`\n${colors.cyan}Validating: ${filePath}${colors.reset}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);

        this.errors = [];
        this.warnings = [];
        this.passes = [];

        // Check 1: Uses CSS variables
        const cssVarUsage = (content.match(/var\(--[^)]+\)/g) || []).length;
        if (cssVarUsage > 0) {
            this.passes.push(`Uses ${cssVarUsage} CSS variable references`);
        } else {
            this.warnings.push('No CSS variables detected. Consider using CSS custom properties.');
        }

        // Check 2: CSS variable definitions
        const cssVarDefs = (content.match(/--[\w-]+\s*:/g) || []).length;
        if (cssVarDefs > 0) {
            this.passes.push(`Defines ${cssVarDefs} CSS variables`);
        }

        // Check 3: Mobile-first media queries
        const mediaQueries = content.match(/@media[^{]+{/g) || [];
        const minWidthQueries = mediaQueries.filter(mq => mq.includes('min-width'));
        const maxWidthQueries = mediaQueries.filter(mq => mq.includes('max-width'));

        if (mediaQueries.length > 0) {
            if (minWidthQueries.length > maxWidthQueries.length) {
                this.passes.push(`Uses mobile-first approach (${minWidthQueries.length} min-width vs ${maxWidthQueries.length} max-width)`);
            } else {
                this.warnings.push(`Consider mobile-first media queries (found ${maxWidthQueries.length} max-width queries)`);
            }
        }

        // Check 4: Responsive breakpoints
        const breakpoints = new Set();
        mediaQueries.forEach(mq => {
            const widthMatch = mq.match(/(\d+)px/);
            if (widthMatch) {
                breakpoints.add(widthMatch[1]);
            }
        });

        if (breakpoints.size > 0) {
            this.passes.push(`Uses ${breakpoints.size} responsive breakpoints: ${Array.from(breakpoints).join(', ')}px`);
        }

        // Check 5: Flexbox usage
        const flexboxUsage = (content.match(/display\s*:\s*flex/gi) || []).length;
        if (flexboxUsage > 0) {
            this.passes.push(`Uses Flexbox (${flexboxUsage} instances)`);
        }

        // Check 6: Grid usage
        const gridUsage = (content.match(/display\s*:\s*grid/gi) || []).length;
        if (gridUsage > 0) {
            this.passes.push(`Uses CSS Grid (${gridUsage} instances)`);
        }

        // Check 7: Transitions
        const transitions = (content.match(/transition\s*:/gi) || []).length;
        if (transitions > 0) {
            this.passes.push(`Uses transitions (${transitions} instances)`);
        }

        // Check 8: Animations
        const animations = (content.match(/@keyframes\s+[\w-]+/gi) || []).length;
        if (animations > 0) {
            this.passes.push(`Defines ${animations} CSS animations`);
        }

        // Check 9: Font sizes use relative units
        const pxFontSizes = (content.match(/font-size\s*:\s*\d+px/gi) || []).length;
        const remFontSizes = (content.match(/font-size\s*:\s*[\d.]+rem/gi) || []).length;
        const emFontSizes = (content.match(/font-size\s*:\s*[\d.]+em/gi) || []).length;
        const clampFontSizes = (content.match(/font-size\s*:\s*clamp\(/gi) || []).length;

        if (remFontSizes + emFontSizes + clampFontSizes > pxFontSizes) {
            this.passes.push(`Uses relative font sizes (${remFontSizes} rem, ${emFontSizes} em, ${clampFontSizes} clamp)`);
        } else if (pxFontSizes > 0) {
            this.warnings.push(`Found ${pxFontSizes} pixel-based font sizes. Consider using rem/em/clamp for better accessibility.`);
        }

        // Check 10: Vendor prefixes (might need autoprefixer)
        const vendorPrefixes = (content.match(/-(webkit|moz|ms|o)-/gi) || []).length;
        if (vendorPrefixes > 10) {
            this.warnings.push(`Many vendor prefixes found (${vendorPrefixes}). Consider using autoprefixer.`);
        }

        // Check 11: !important usage (should be minimal)
        const importantUsage = (content.match(/!important/gi) || []).length;
        if (importantUsage > 5) {
            this.warnings.push(`Excessive !important usage (${importantUsage} instances). Review CSS specificity.`);
        } else if (importantUsage > 0) {
            this.passes.push(`Minimal !important usage (${importantUsage} instances)`);
        } else {
            this.passes.push('No !important usage (excellent)');
        }

        // Check 12: Color format consistency
        const hexColors = (content.match(/#[0-9a-f]{3,6}\b/gi) || []).length;
        const rgbColors = (content.match(/rgba?\(/gi) || []).length;
        const hslColors = (content.match(/hsla?\(/gi) || []).length;

        if (hexColors + rgbColors + hslColors > 0) {
            this.passes.push(`Color usage: ${hexColors} hex, ${rgbColors} rgb, ${hslColors} hsl`);
        }

        // Check 13: Box-sizing
        const hasBoxSizing = content.match(/box-sizing\s*:\s*border-box/i);
        if (hasBoxSizing) {
            this.passes.push('Uses border-box box-sizing');
        }

        // Check 14: Z-index values (check for excessive values)
        const zIndexValues = content.match(/z-index\s*:\s*(\d+)/gi) || [];
        const highZIndex = zIndexValues.filter(z => {
            const value = parseInt(z.match(/\d+/)[0]);
            return value > 1000;
        });

        if (highZIndex.length > 0) {
            this.warnings.push(`${highZIndex.length} very high z-index values found. Consider a z-index scale.`);
        }

        // Check 15: Accessibility - reduced motion
        const hasReducedMotion = content.match(/@media\s*\(prefers-reduced-motion/i);
        if (hasReducedMotion) {
            this.passes.push('Respects prefers-reduced-motion for accessibility');
        } else if (animations > 0 || transitions > 0) {
            this.warnings.push('Has animations but no prefers-reduced-motion media query');
        }

        // Check 16: Comments
        const comments = (content.match(/\/\*[\s\S]*?\*\//g) || []).length;
        if (comments > 0) {
            this.passes.push(`Includes ${comments} comments for documentation`);
        } else {
            this.warnings.push('No comments found. Consider adding section comments.');
        }

        // Check 17: CSS nesting (if using modern CSS)
        const nestedSelectors = content.match(/{\s*&/g) || [];
        if (nestedSelectors.length > 0) {
            this.passes.push(`Uses modern CSS nesting (${nestedSelectors.length} instances)`);
        }

        // Check 18: Performance - will-change
        const willChange = (content.match(/will-change\s*:/gi) || []).length;
        if (willChange > 5) {
            this.warnings.push(`Excessive will-change usage (${willChange}). Use sparingly.`);
        }

        // Check 19: Print styles
        const hasPrintStyles = content.match(/@media\s*print/i);
        if (hasPrintStyles) {
            this.passes.push('Includes print styles');
        }

        // Check 20: File size
        const sizeKB = Math.round((content.length / 1024) * 10) / 10;
        if (sizeKB < 50) {
            this.passes.push(`File size: ${sizeKB}KB (good)`);
        } else if (sizeKB < 100) {
            this.warnings.push(`File size: ${sizeKB}KB (consider optimization)`);
        } else {
            this.warnings.push(`File size: ${sizeKB}KB (large, consider splitting or minifying)`);
        }

        // Print results
        this.printResults(fileName);

        return {
            file: fileName,
            errors: this.errors.length,
            warnings: this.warnings.length,
            passes: this.passes.length,
            sizeKB: sizeKB
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
        console.log(`\n${colors.blue}Score: ${score}% (${this.passes.length}/${total} checks passed)${colors.reset}`);
    }
}

// Main execution
if (require.main === module) {
    const validator = new CSSValidator();

    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}CSS Validation Report${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    // Check shared CSS
    const sharedCSS = path.join(__dirname, '../assets/css/shared-styles.css');
    const results = [];

    if (fs.existsSync(sharedCSS)) {
        results.push(validator.validateFile(sharedCSS));
    }

    // Check for any other CSS files in assets/css
    const cssDir = path.join(__dirname, '../assets/css');
    if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir)
            .filter(file => file.endsWith('.css') && file !== 'shared-styles.css')
            .map(file => path.join(cssDir, file));

        cssFiles.forEach(file => {
            results.push(validator.validateFile(file));
        });
    }

    // Print summary
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);
    const totalPasses = results.reduce((sum, r) => sum + r.passes, 0);
    const totalSize = results.reduce((sum, r) => sum + r.sizeKB, 0);

    console.log(`\nTotal files validated: ${results.length}`);
    console.log(`Total size: ${Math.round(totalSize * 10) / 10}KB`);
    console.log(`${colors.green}✓ Total passes: ${totalPasses}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Total warnings: ${totalWarnings}${colors.reset}`);
    console.log(`${colors.red}✗ Total errors: ${totalErrors}${colors.reset}`);

    const overallScore = Math.round((totalPasses / (totalPasses + totalWarnings + totalErrors)) * 100);
    console.log(`\n${colors.blue}Overall Score: ${overallScore}%${colors.reset}\n`);

    process.exit(totalErrors > 0 ? 1 : 0);
}

module.exports = CSSValidator;
