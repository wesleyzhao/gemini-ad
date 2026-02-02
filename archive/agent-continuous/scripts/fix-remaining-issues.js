#!/usr/bin/env node

/**
 * Fix remaining accessibility issues
 * Addresses issues found by validation script
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');

function fixRemainingIssues(htmlContent) {
    let fixed = htmlContent;

    // Fix: Add aria-labelledby to sections without it
    fixed = fixed.replace(
        /<section (id="[^"]+"|class="section[^"]*")/g,
        (match, attr) => {
            if (match.includes('aria-label')) return match;

            // Try to find the heading in the section
            const sectionStart = match;
            return sectionStart; // Will be fixed with heading IDs below
        }
    );

    // Fix: Add IDs to all h2 headings for aria-labelledby
    fixed = fixed.replace(
        /<h2([^>]*class="[^"]*text-center[^"]*"[^>]*)>([^<]+)<\/h2>/g,
        (match, attrs, text) => {
            if (attrs.includes(' id=')) return match;

            const id = text.trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50) + '-heading';

            return `<h2${attrs} id="${id}">${text}</h2>`;
        }
    );

    // Fix: Add aria-labelledby to sections based on their headings
    fixed = fixed.replace(
        /<section ([^>]*class="section[^"]*"[^>]*)>/g,
        (match, attrs) => {
            if (attrs.includes('aria-label')) return match;

            // Look for the section's heading ID
            const nextHeading = attrs.match(/id="([^"]+)"/);
            if (nextHeading) {
                return match; // Already has ID, skip
            }

            // Add aria-labelledby based on section ID if available
            const sectionId = attrs.match(/id="([^"]+)"/);
            if (sectionId && !attrs.includes('aria-label')) {
                const headingId = sectionId[1] === 'features' ? 'features-heading' :
                                 sectionId[1] === 'examples' ? 'examples-heading' :
                                 sectionId[1] === 'how' ? 'how-heading' :
                                 null;

                if (headingId && !attrs.includes('aria-label')) {
                    return `<section ${attrs} aria-labelledby="${headingId}">`;
                }
            }

            return match;
        }
    );

    // Fix: Ensure all main CTA buttons have aria-label
    fixed = fixed.replace(
        /<a href="https:\/\/gemini\.google\.com" class="btn btn-primary btn-large">([^<]+)<\/a>/g,
        (match, text) => {
            if (match.includes('aria-label')) return match;

            const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, '').trim();
            return `<a href="https://gemini.google.com" class="btn btn-primary btn-large" aria-label="${cleanText} with Gemini">${text}</a>`;
        }
    );

    // Fix: Ensure secondary CTA buttons have aria-label
    fixed = fixed.replace(
        /<a href="#[^"]*" class="btn btn-secondary btn-large">([^<]+)<\/a>/g,
        (match, text) => {
            if (match.includes('aria-label')) return match;

            const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, '').trim();
            return match.replace('>',` aria-label="${cleanText}">`);
        }
    );

    // Fix: Banner landmark for headers without role
    fixed = fixed.replace(
        /<header class="header">/g,
        '<header class="header" role="banner">'
    );

    // Fix: Navigation landmark
    fixed = fixed.replace(
        /<nav>(?!.*role="navigation")/g,
        '<nav role="navigation" aria-label="Primary navigation">'
    );

    // Fix: Contentinfo for footers
    fixed = fixed.replace(
        /<footer(?!\s+role=)/g,
        '<footer role="contentinfo"'
    );

    // Fix: Add aria-hidden to decorative clock/time icons in productivity page
    fixed = fixed.replace(
        /<div class="icon-clock">/g,
        '<div class="icon-clock" aria-hidden="true">'
    );

    fixed = fixed.replace(
        /<div class="productivity-icon">/g,
        '<div class="productivity-icon" aria-hidden="true">'
    );

    // Fix: Add main landmark if missing (for animations-demo)
    if (!fixed.includes('<main id="main-content"') && !fixed.includes('<!-- Hero Section -->')) {
        // For pages without hero section, wrap content after header in main
        fixed = fixed.replace(
            /(<\/header>[^]*?)(<section)/,
            '$1\n\n    <main id="main-content" role="main">\n    $2'
        );

        fixed = fixed.replace(
            /(\s*)<footer/,
            '\n    </main>\n$1<footer'
        );
    }

    return fixed;
}

function processFile(filename) {
    const filepath = path.join(pagesDir, filename);

    if (!fs.existsSync(filepath) || filename.endsWith('.backup')) {
        return;
    }

    console.log(`Fixing ${filename}...`);

    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const fixed = fixRemainingIssues(content);

        if (content !== fixed) {
            fs.writeFileSync(filepath, fixed);
            console.log(`✓ ${filename} fixed`);
        } else {
            console.log(`  ${filename} - no changes needed`);
        }
    } catch (error) {
        console.error(`✗ Error fixing ${filename}:`, error.message);
    }
}

function main() {
    console.log('='.repeat(60));
    console.log('Fixing Remaining Accessibility Issues');
    console.log('='.repeat(60));
    console.log('');

    const files = fs.readdirSync(pagesDir)
        .filter(file => file.endsWith('.html') && !file.endsWith('.backup'));

    files.forEach(processFile);

    console.log('');
    console.log('='.repeat(60));
    console.log('✓ Fixes applied');
    console.log('='.repeat(60));
}

if (require.main === module) {
    main();
}

module.exports = { fixRemainingIssues };
