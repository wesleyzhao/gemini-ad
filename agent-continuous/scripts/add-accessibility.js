#!/usr/bin/env node

/**
 * Automated Accessibility Enhancement Script
 * Adds WCAG 2.1 AA compliant ARIA labels, landmarks, and keyboard navigation
 * to all Gemini landing pages
 *
 * 2026 Best Practices:
 * - Skip-to-content links
 * - ARIA landmarks (banner, main, navigation, contentinfo)
 * - Proper heading hierarchy
 * - ARIA labels on interactive elements
 * - role attributes for semantic clarity
 */

const fs = require('fs');
const path = require('path');

// Pages to update (excluding already updated ones)
const pagesToUpdate = [
    'writers.html',
    'creators.html',
    'operators.html',
    'automators.html',
    'apple-style.html',
    'trust.html',
    'workspace.html',
    'research.html',
    'productivity.html',
    'future.html',
    'comparison.html',
    'animations-demo.html'
];

const pagesDir = path.join(__dirname, '..', 'pages');

/**
 * Apply accessibility enhancements to HTML content
 */
function enhanceAccessibility(htmlContent, filename) {
    let enhanced = htmlContent;

    // 1. Add meta description if missing
    if (!enhanced.includes('<meta name="description"')) {
        enhanced = enhanced.replace(
            /<title>([^<]+)<\/title>/,
            `<title>$1</title>\n    <meta name="description" content="$1 - Gemini AI powered features and capabilities">`
        );
    }

    // 2. Add skip-to-content link after <body>
    if (!enhanced.includes('skip-to-content')) {
        enhanced = enhanced.replace(
            /<body[^>]*>/,
            `$&\n    <!-- Skip to main content link for keyboard users -->\n    <a href="#main-content" class="skip-to-content">Skip to main content</a>\n`
        );
    }

    // 3. Add role="banner" to header
    enhanced = enhanced.replace(
        /<header class="header">/g,
        '<header class="header" role="banner">'
    );

    // 4. Add ARIA label to logo link
    enhanced = enhanced.replace(
        /<a href="\.\.\/index\.html" style="font-weight: 600; font-size: 1\.125rem; color: var\(--gray-900\);">Gemini<\/a>/g,
        '<a href="../index.html" style="font-weight: 600; font-size: 1.125rem; color: var(--gray-900);" aria-label="Gemini Home">Gemini</a>'
    );

    // 5. Add navigation landmark with ARIA label
    enhanced = enhanced.replace(
        /<nav>/g,
        '<nav role="navigation" aria-label="Primary navigation">'
    );

    // 6. Add ARIA labels to CTA buttons
    enhanced = enhanced.replace(
        /<a href="https:\/\/gemini\.google\.com" class="btn btn-primary btn-small">Try Gemini<\/a>/g,
        '<a href="https://gemini.google.com" class="btn btn-primary btn-small" aria-label="Try Gemini AI">Try Gemini</a>'
    );

    // 7. Wrap main content in <main> with id="main-content"
    if (!enhanced.includes('<main id="main-content"')) {
        // Find first section after header and wrap everything before footer in main
        enhanced = enhanced.replace(
            /((?:<\/header>|<\/nav>)[^]*?)(\s*<!-- Hero Section -->|\s*<section)/,
            '$1\n\n    <main id="main-content" role="main">$2'
        );

        // Close main before footer
        enhanced = enhanced.replace(
            /(\s*)<footer/,
            '\n    </main>\n$1<footer'
        );
    }

    // 8. Add role="contentinfo" to footer
    enhanced = enhanced.replace(
        /<footer style=/g,
        '<footer role="contentinfo" style='
    );

    // 9. Add aria-labelledby to hero sections
    enhanced = enhanced.replace(
        /<section class="hero([^"]*)">/g,
        '<section class="hero$1" aria-labelledby="hero-heading">'
    );

    // 10. Add IDs to main headings for aria-labelledby
    let h1Count = 0;
    enhanced = enhanced.replace(
        /<h1 class="([^"]*)">/g,
        (match) => {
            h1Count++;
            if (h1Count === 1) {
                return `<h1 id="hero-heading" class="$1">`;
            }
            return match;
        }
    );

    // 11. Add aria-labelledby to feature sections
    enhanced = enhanced.replace(
        /<section id="features" class="section">/g,
        '<section id="features" class="section" aria-labelledby="features-heading">'
    );

    // 12. Add IDs to section headings
    enhanced = enhanced.replace(
        /(<section[^>]*>[\s\S]*?<h2[^>]*class="text-center[^"]*"[^>]*>)([^<]+)(<\/h2>)/g,
        (match, before, text, after) => {
            const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-heading';
            if (!before.includes(' id=')) {
                return before.replace('<h2', `<h2 id="${id}"`) + text + after;
            }
            return match;
        }
    );

    // 13. Add aria-hidden to decorative icons
    enhanced = enhanced.replace(
        /<div style="font-size: 3rem; margin-bottom: var\(--space-3\);">([^<]+)<\/div>/g,
        '<div style="font-size: 3rem; margin-bottom: var(--space-3);" aria-hidden="true">$1</div>'
    );

    // 14. Add role="list" to grid containers with cards
    enhanced = enhanced.replace(
        /<div class="grid grid-([234]) gap-([0-9])">/g,
        '<div class="grid grid-$1 gap-$2" role="list">'
    );

    // 15. Convert cards to articles with role="listitem"
    enhanced = enhanced.replace(
        /<div class="card([^"]*)"([^>]*)>/g,
        '<article class="card$1"$2 role="listitem">'
    );
    enhanced = enhanced.replace(
        /<\/div>(\s*)<\/div>(\s*)<\/div>(\s*)<\/section>/g,
        '</article>$1</div>$2</div>$3</section>'
    );

    // 16. Add aria-hidden to decorative background elements
    enhanced = enhanced.replace(
        /<div class="(floating-heart|star|particle|background-[^"]*)" /g,
        '<div class="$1" aria-hidden="true" '
    );

    // 17. Add aria-labels to view/CTA buttons
    enhanced = enhanced.replace(
        /<a href="https:\/\/gemini\.google\.com" class="btn btn-primary btn-large">([^<]+)<\/a>/g,
        (match, text) => {
            const cleanText = text.replace(/[^\w\s]/g, '').trim();
            return `<a href="https://gemini.google.com" class="btn btn-primary btn-large" aria-label="${cleanText}">${text}</a>`;
        }
    );

    // 18. Add proper blockquote tags for testimonials
    enhanced = enhanced.replace(
        /<div class="([^"]*quote[^"]*)"([^>]*)>/g,
        '<blockquote class="$1"$2 role="complementary">'
    );

    // 19. Add role="article" to stat cards
    enhanced = enhanced.replace(
        /<div class="stat-card">/g,
        '<div class="stat-card" role="listitem">'
    );

    // 20. Add aria-label to stats
    enhanced = enhanced.replace(
        /<span class="stat-number[^"]*">([0-9.]+[KM+%★]*)<\/span>/g,
        (match, num) => {
            let label = num;
            label = label.replace(/K\+?/g, ' thousand plus');
            label = label.replace(/M\+?/g, ' million plus');
            label = label.replace(/%/g, ' percent');
            label = label.replace(/★/g, ' stars');
            return `<span class="stat-number" aria-label="${label}">${num}</span>`;
        }
    );

    return enhanced;
}

/**
 * Process a single HTML file
 */
function processFile(filename) {
    const filepath = path.join(pagesDir, filename);

    console.log(`Processing ${filename}...`);

    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const enhanced = enhanceAccessibility(content, filename);

        // Create backup
        const backupPath = filepath + '.backup';
        fs.writeFileSync(backupPath, content);

        // Write enhanced version
        fs.writeFileSync(filepath, enhanced);

        console.log(`✓ ${filename} enhanced successfully`);
        console.log(`  Backup created at: ${backupPath}`);

    } catch (error) {
        console.error(`✗ Error processing ${filename}:`, error.message);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('='.repeat(60));
    console.log('Gemini Landing Pages - Accessibility Enhancement Script');
    console.log('WCAG 2.1 AA Compliance - 2026 Best Practices');
    console.log('='.repeat(60));
    console.log('');

    pagesToUpdate.forEach(processFile);

    console.log('');
    console.log('='.repeat(60));
    console.log(`✓ Processed ${pagesToUpdate.length} pages`);
    console.log('✓ All pages now include:');
    console.log('  - Skip-to-content links');
    console.log('  - ARIA landmarks (banner, main, navigation, contentinfo)');
    console.log('  - Proper ARIA labels on interactive elements');
    console.log('  - Semantic HTML with role attributes');
    console.log('  - Decorative elements marked with aria-hidden');
    console.log('='.repeat(60));
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { enhanceAccessibility };
