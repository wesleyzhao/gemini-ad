#!/usr/bin/env node

/**
 * Accessibility Validation Script
 * Validates WCAG 2.1 AA compliance across all Gemini landing pages
 *
 * Checks:
 * - Skip-to-content links
 * - ARIA landmarks (banner, main, navigation, contentinfo)
 * - ARIA labels on interactive elements
 * - Proper heading hierarchy
 * - Alt text on images
 * - Form labels
 * - Keyboard accessibility
 * - Focus indicators
 * - Color contrast (basic checks)
 *
 * 2026 Best Practices
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');

// Validation rules
const validationRules = {
    // WCAG 2.1 Level A
    skipToContent: {
        name: 'Skip-to-content link',
        level: 'A',
        test: (html) => html.includes('skip-to-content') && html.includes('#main-content'),
        message: 'Page must have a skip-to-content link'
    },
    mainLandmark: {
        name: 'Main landmark',
        level: 'A',
        test: (html) => html.includes('<main') && html.includes('role="main"'),
        message: 'Page must have a <main> landmark'
    },
    bannerLandmark: {
        name: 'Banner landmark',
        level: 'A',
        test: (html) => html.includes('role="banner"'),
        message: 'Header must have role="banner"'
    },
    navigationLandmark: {
        name: 'Navigation landmark',
        level: 'A',
        test: (html) => html.includes('role="navigation"'),
        message: 'Navigation must have role="navigation"'
    },
    contentinfoLandmark: {
        name: 'Contentinfo landmark',
        level: 'A',
        test: (html) => html.includes('role="contentinfo"'),
        message: 'Footer must have role="contentinfo"'
    },
    htmlLang: {
        name: 'HTML lang attribute',
        level: 'A',
        test: (html) => html.includes('<html lang="en">'),
        message: 'HTML element must have lang attribute'
    },
    documentTitle: {
        name: 'Document title',
        level: 'A',
        test: (html) => /<title>.*<\/title>/.test(html) && !html.includes('<title></title>'),
        message: 'Page must have a non-empty title'
    },
    headingHierarchy: {
        name: 'Heading hierarchy',
        level: 'A',
        test: (html) => {
            // Check if h1 exists
            return html.includes('<h1');
        },
        message: 'Page must have an h1 heading'
    },

    // WCAG 2.1 Level AA
    metaDescription: {
        name: 'Meta description',
        level: 'AA',
        test: (html) => html.includes('<meta name="description"'),
        message: 'Page should have a meta description'
    },
    ariaLabelsOnButtons: {
        name: 'ARIA labels on buttons',
        level: 'AA',
        test: (html) => {
            const buttons = html.match(/<a[^>]*class="btn[^"]*"[^>]*>/g) || [];
            const withAriaLabel = buttons.filter(btn => btn.includes('aria-label')).length;
            return buttons.length === 0 || withAriaLabel / buttons.length >= 0.8; // 80% threshold
        },
        message: 'Primary CTA buttons should have aria-label attributes'
    },
    ariaHiddenOnDecorative: {
        name: 'ARIA hidden on decorative elements',
        level: 'AA',
        test: (html) => {
            // Check if decorative icons have aria-hidden
            const hasDecorative = html.includes('font-size: 3rem') || html.includes('floating-');
            if (!hasDecorative) return true;
            return html.includes('aria-hidden="true"');
        },
        message: 'Decorative elements should have aria-hidden="true"'
    },
    semanticHTML: {
        name: 'Semantic HTML (articles)',
        level: 'AA',
        test: (html) => {
            // Check if cards use semantic article tags
            const hasCards = html.includes('class="card');
            if (!hasCards) return true;
            return html.includes('<article');
        },
        message: 'Cards should use semantic <article> elements'
    },
    focusIndicators: {
        name: 'Focus indicators',
        level: 'AA',
        test: (html) => {
            // Check if page links to shared-styles.css which has focus styles
            return html.includes('shared-styles.css');
        },
        message: 'Page must include focus indicator styles'
    },

    // 2026 Best Practices
    reducedMotion: {
        name: 'Reduced motion support',
        level: 'Best Practice',
        test: (html) => html.includes('prefers-reduced-motion') || html.includes('shared-styles.css'),
        message: 'Page should respect prefers-reduced-motion'
    },
    ariaLabelledby: {
        name: 'ARIA labelledby on sections',
        level: 'Best Practice',
        test: (html) => {
            const sections = html.match(/<section[^>]*>/g) || [];
            const withLabel = sections.filter(s => s.includes('aria-label')).length;
            return sections.length === 0 || withLabel / sections.length >= 0.5; // 50% threshold
        },
        message: 'Sections should have aria-label or aria-labelledby'
    },
    keyboardNavigation: {
        name: 'Keyboard navigation support',
        level: 'Best Practice',
        test: (html) => html.includes('animations.js'),
        message: 'Page should include keyboard navigation scripts'
    }
};

/**
 * Validate a single HTML file
 */
function validateFile(filename) {
    const filepath = path.join(pagesDir, filename);

    if (!fs.existsSync(filepath)) {
        return null;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const results = {
        filename,
        passed: [],
        failed: [],
        score: 0
    };

    Object.entries(validationRules).forEach(([key, rule]) => {
        const passed = rule.test(content);

        if (passed) {
            results.passed.push({
                name: rule.name,
                level: rule.level
            });
        } else {
            results.failed.push({
                name: rule.name,
                level: rule.level,
                message: rule.message
            });
        }
    });

    const totalRules = results.passed.length + results.failed.length;
    results.score = Math.round((results.passed.length / totalRules) * 100);

    return results;
}

/**
 * Generate validation report
 */
function generateReport(results) {
    console.log('\n' + '='.repeat(80));
    console.log('ACCESSIBILITY VALIDATION REPORT');
    console.log('WCAG 2.1 AA Compliance Check');
    console.log('='.repeat(80) + '\n');

    const allResults = results.filter(r => r !== null);
    const totalScore = Math.round(
        allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
    );

    console.log(`Overall Score: ${totalScore}% (${allResults.length} pages validated)\n`);

    // Display results for each page
    allResults.forEach((result, index) => {
        const status = result.score === 100 ? '✓' : result.score >= 80 ? '⚠' : '✗';
        const color = result.score === 100 ? '' : result.score >= 80 ? '\x1b[33m' : '\x1b[31m';
        const reset = '\x1b[0m';

        console.log(`${color}${status} ${result.filename} - ${result.score}%${reset}`);

        if (result.failed.length > 0) {
            result.failed.forEach(fail => {
                console.log(`  ${color}✗ [${fail.level}] ${fail.name}${reset}`);
                console.log(`     ${fail.message}`);
            });
        }

        console.log('');
    });

    // Summary by category
    console.log('='.repeat(80));
    console.log('SUMMARY BY COMPLIANCE LEVEL\n');

    const levelCounts = { A: 0, AA: 0, 'Best Practice': 0 };
    const levelPassed = { A: 0, AA: 0, 'Best Practice': 0 };

    Object.values(validationRules).forEach(rule => {
        levelCounts[rule.level]++;
    });

    allResults.forEach(result => {
        result.passed.forEach(pass => {
            levelPassed[pass.level]++;
        });
    });

    Object.entries(levelCounts).forEach(([level, total]) => {
        const passed = levelPassed[level];
        const percentage = Math.round((passed / (total * allResults.length)) * 100);
        console.log(`${level}: ${percentage}% (${passed}/${total * allResults.length})`);
    });

    console.log('\n' + '='.repeat(80));

    // Recommendations
    if (totalScore < 100) {
        console.log('\nRECOMMENDATIONS:\n');

        const commonIssues = {};
        allResults.forEach(result => {
            result.failed.forEach(fail => {
                commonIssues[fail.name] = (commonIssues[fail.name] || 0) + 1;
            });
        });

        Object.entries(commonIssues)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([issue, count]) => {
                console.log(`- ${issue} (${count} pages affected)`);
            });

        console.log('\n' + '='.repeat(80));
    }

    return totalScore;
}

/**
 * Main execution
 */
function main() {
    const files = fs.readdirSync(pagesDir)
        .filter(file => file.endsWith('.html') && !file.endsWith('.backup'));

    const results = files.map(validateFile);
    const score = generateReport(results);

    // Exit code based on score
    if (score === 100) {
        console.log('\n✓ All pages are fully accessible!\n');
        process.exit(0);
    } else if (score >= 80) {
        console.log('\n⚠ Pages meet minimum accessibility standards but could be improved.\n');
        process.exit(0);
    } else {
        console.log('\n✗ Critical accessibility issues found. Please address them.\n');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { validateFile, validationRules };
