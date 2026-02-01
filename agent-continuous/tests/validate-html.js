#!/usr/bin/env node
/**
 * HTML Validation Script
 * Validates HTML structure, semantic elements, and accessibility
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

class HTMLValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passes = [];
    }

    /**
     * Validate a single HTML file
     */
    validateFile(filePath) {
        console.log(`\n${colors.cyan}Validating: ${filePath}${colors.reset}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);

        this.errors = [];
        this.warnings = [];
        this.passes = [];

        // Check 1: Has DOCTYPE
        if (!content.match(/<!DOCTYPE html>/i)) {
            this.errors.push('Missing DOCTYPE declaration');
        } else {
            this.passes.push('Has DOCTYPE declaration');
        }

        // Check 2: Has html tag with lang attribute
        if (!content.match(/<html[^>]*lang=["'][a-z]{2}["']/i)) {
            this.errors.push('Missing or invalid lang attribute on <html>');
        } else {
            this.passes.push('Has lang attribute on <html>');
        }

        // Check 3: Has meta charset
        if (!content.match(/<meta[^>]*charset=["']utf-8["']/i)) {
            this.errors.push('Missing UTF-8 charset declaration');
        } else {
            this.passes.push('Has UTF-8 charset declaration');
        }

        // Check 4: Has viewport meta tag
        if (!content.match(/<meta[^>]*name=["']viewport["']/i)) {
            this.errors.push('Missing viewport meta tag');
        } else {
            this.passes.push('Has viewport meta tag');
        }

        // Check 5: Has title tag
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        if (!titleMatch) {
            this.errors.push('Missing <title> tag');
        } else if (titleMatch[1].length < 10) {
            this.warnings.push('Title is too short (< 10 characters)');
        } else {
            this.passes.push(`Has descriptive title: "${titleMatch[1]}"`);
        }

        // Check 6: Has meta description
        const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        if (!descMatch) {
            this.warnings.push('Missing meta description');
        } else if (descMatch[1].length < 50) {
            this.warnings.push('Meta description is too short (< 50 characters)');
        } else {
            this.passes.push('Has meta description');
        }

        // Check 7: Semantic HTML elements
        const semanticElements = ['header', 'nav', 'main', 'section', 'article', 'footer'];
        const foundSemanticElements = semanticElements.filter(el =>
            content.match(new RegExp(`<${el}[^>]*>`, 'i'))
        );

        if (foundSemanticElements.length < 3) {
            this.warnings.push(`Only ${foundSemanticElements.length} semantic elements found. Consider using more: header, nav, main, section, article, footer`);
        } else {
            this.passes.push(`Uses ${foundSemanticElements.length} semantic elements: ${foundSemanticElements.join(', ')}`);
        }

        // Check 8: Main tag (should have exactly one)
        const mainCount = (content.match(/<main[^>]*>/gi) || []).length;
        if (mainCount === 0) {
            this.warnings.push('No <main> tag found');
        } else if (mainCount > 1) {
            this.errors.push('Multiple <main> tags found (should be exactly one)');
        } else {
            this.passes.push('Has exactly one <main> tag');
        }

        // Check 9: Images have alt attributes
        const imgTags = content.match(/<img[^>]*>/gi) || [];
        const imgsWithoutAlt = imgTags.filter(tag => !tag.match(/alt=["'][^"']*["']/i));
        if (imgsWithoutAlt.length > 0) {
            this.errors.push(`${imgsWithoutAlt.length} image(s) missing alt attribute`);
        } else if (imgTags.length > 0) {
            this.passes.push(`All ${imgTags.length} images have alt attributes`);
        }

        // Check 10: Links have meaningful text
        const linkMatches = content.match(/<a[^>]*>(.*?)<\/a>/gi) || [];
        const suspiciousLinks = linkMatches.filter(link => {
            const text = link.replace(/<[^>]*>/g, '').trim().toLowerCase();
            return text === 'click here' || text === 'here' || text === 'read more' || text.length === 0;
        });
        if (suspiciousLinks.length > 0) {
            this.warnings.push(`${suspiciousLinks.length} link(s) with non-descriptive text (e.g., "click here")`);
        }

        // Check 11: Heading hierarchy
        const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
        if (h1Count === 0) {
            this.errors.push('No <h1> heading found');
        } else if (h1Count > 1) {
            this.warnings.push('Multiple <h1> headings found (typically should be one)');
        } else {
            this.passes.push('Has exactly one <h1> heading');
        }

        // Check 12: ARIA labels for interactive elements
        const buttons = content.match(/<button[^>]*>/gi) || [];
        const buttonsWithoutLabel = buttons.filter(btn => {
            return !btn.match(/aria-label=["'][^"']+["']/i) && !btn.match(/>.*<\/button>/i);
        });
        if (buttonsWithoutLabel.length > 0) {
            this.warnings.push(`${buttonsWithoutLabel.length} button(s) may need aria-label or inner text`);
        }

        // Check 13: External links security
        const externalLinks = content.match(/<a[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/gi) || [];
        const unsafeExternalLinks = externalLinks.filter(link => {
            return !link.match(/rel=["'][^"']*noopener[^"']*["']/i);
        });
        if (unsafeExternalLinks.length > 0) {
            this.warnings.push(`${unsafeExternalLinks.length} external link(s) missing rel="noopener noreferrer"`);
        }

        // Check 14: CSS is linked or embedded
        const hasCSSLink = content.match(/<link[^>]*rel=["']stylesheet["']/i);
        const hasStyleTag = content.match(/<style[^>]*>/i);
        if (!hasCSSLink && !hasStyleTag) {
            this.warnings.push('No CSS detected (no <link> or <style> tags)');
        } else {
            this.passes.push('Has CSS styling');
        }

        // Check 15: JavaScript is properly placed
        const scriptTags = content.match(/<script[^>]*>/gi) || [];
        const scriptsInHead = content.match(/<head>[\s\S]*?<script[^>]*>[\s\S]*?<\/head>/i);
        const scriptsWithDefer = scriptTags.filter(tag => tag.match(/defer/i)).length;

        if (scriptsInHead && scriptsWithDefer === 0) {
            this.warnings.push('Scripts in <head> should use defer or async attribute');
        }

        // Check 16: No inline styles (best practice)
        const inlineStyles = content.match(/style=["'][^"']+["']/gi) || [];
        if (inlineStyles.length > 10) {
            this.warnings.push(`${inlineStyles.length} inline styles found. Consider moving to CSS classes.`);
        }

        // Check 17: Favicon
        const hasFavicon = content.match(/<link[^>]*rel=["']icon["']/i);
        if (!hasFavicon) {
            this.warnings.push('No favicon link found');
        } else {
            this.passes.push('Has favicon link');
        }

        // Check 18: Open Graph tags (for social sharing)
        const ogTags = content.match(/<meta[^>]*property=["']og:[^"']+["']/gi) || [];
        if (ogTags.length < 3) {
            this.warnings.push('Missing Open Graph meta tags for social sharing');
        } else {
            this.passes.push(`Has ${ogTags.length} Open Graph tags`);
        }

        // Print results
        this.printResults(fileName);

        return {
            file: fileName,
            errors: this.errors.length,
            warnings: this.warnings.length,
            passes: this.passes.length
        };
    }

    printResults(fileName) {
        // Print passes
        if (this.passes.length > 0) {
            console.log(`\n${colors.green}✓ Passes (${this.passes.length}):${colors.reset}`);
            this.passes.forEach(pass => console.log(`  ${colors.green}✓${colors.reset} ${pass}`));
        }

        // Print warnings
        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}⚠ Warnings (${this.warnings.length}):${colors.reset}`);
            this.warnings.forEach(warning => console.log(`  ${colors.yellow}⚠${colors.reset} ${warning}`));
        }

        // Print errors
        if (this.errors.length > 0) {
            console.log(`\n${colors.red}✗ Errors (${this.errors.length}):${colors.reset}`);
            this.errors.forEach(error => console.log(`  ${colors.red}✗${colors.reset} ${error}`));
        }

        // Print summary
        const total = this.passes.length + this.warnings.length + this.errors.length;
        const score = Math.round((this.passes.length / total) * 100);
        console.log(`\n${colors.blue}Score: ${score}% (${this.passes.length}/${total} checks passed)${colors.reset}`);
    }
}

// Main execution
if (require.main === module) {
    const validator = new HTMLValidator();
    const pagesDir = path.join(__dirname, '../pages');

    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}HTML Validation Report${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    // Get all HTML files in pages directory
    const files = fs.readdirSync(pagesDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(pagesDir, file));

    // Also check root HTML files
    const rootFiles = ['index.html', 'index-v1.html', 'index-trust.html']
        .map(file => path.join(__dirname, '..', file))
        .filter(file => fs.existsSync(file));

    const allFiles = [...files, ...rootFiles];

    const results = allFiles.map(file => validator.validateFile(file));

    // Print summary
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);
    const totalPasses = results.reduce((sum, r) => sum + r.passes, 0);

    console.log(`\nTotal files validated: ${results.length}`);
    console.log(`${colors.green}✓ Total passes: ${totalPasses}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Total warnings: ${totalWarnings}${colors.reset}`);
    console.log(`${colors.red}✗ Total errors: ${totalErrors}${colors.reset}`);

    const overallScore = Math.round((totalPasses / (totalPasses + totalWarnings + totalErrors)) * 100);
    console.log(`\n${colors.blue}Overall Score: ${overallScore}%${colors.reset}\n`);

    // Exit with error code if there are errors
    process.exit(totalErrors > 0 ? 1 : 0);
}

module.exports = HTMLValidator;
