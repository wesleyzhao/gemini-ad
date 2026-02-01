/**
 * Mobile Responsiveness Validation Script
 * Tests all landing pages for mobile-first responsive design
 */

const fs = require('fs');
const path = require('path');

// Test viewports (mobile-first)
const VIEWPORTS = {
    'iPhone SE': { width: 375, height: 667 },
    'iPhone 12/13': { width: 390, height: 844 },
    'iPhone 14 Pro Max': { width: 430, height: 932 },
    'Samsung Galaxy S21': { width: 360, height: 800 },
    'iPad Mini': { width: 768, height: 1024 },
    'iPad Pro': { width: 1024, height: 1366 },
    'Desktop': { width: 1440, height: 900 },
};

// Pages to validate
const PAGES = [
    'valentine.html',
    'writers.html',
    'creators.html',
    'operators.html',
    'automators.html',
    'apple-style.html',
    'trust.html',
    'research.html',
    'productivity.html',
    'workspace.html',
    'comparison.html',
    'future.html',
    'animations-demo.html',
    'index.html'
];

// Validation rules
const VALIDATION_RULES = [
    {
        name: 'Viewport Meta Tag',
        test: (content) => {
            return content.includes('<meta name="viewport"');
        },
        weight: 10,
        critical: true
    },
    {
        name: 'No Fixed Width Elements',
        test: (content) => {
            // Check for problematic fixed widths (allowing minmax and specific intentional cases)
            const fixedWidthPattern = /(?:width|min-width):\s*\d{4,}px/g;
            const matches = content.match(fixedWidthPattern) || [];
            // Filter out safe patterns like max-width
            const problematic = matches.filter(m => !m.includes('max-width'));
            return problematic.length === 0;
        },
        weight: 8,
        critical: false
    },
    {
        name: 'Responsive Images',
        test: (content) => {
            // Check if CSS includes responsive image rules
            return content.includes('max-width: 100%') ||
                   content.includes('max-width:100%') ||
                   !content.includes('<img'); // No images = pass
        },
        weight: 9,
        critical: true
    },
    {
        name: 'Fluid Typography',
        test: (content) => {
            // Check for fluid typography (clamp, rem, or CSS variables)
            return content.includes('clamp(') ||
                   content.includes('var(--text-') ||
                   content.includes('rem;');
        },
        weight: 8,
        critical: false
    },
    {
        name: 'Mobile Breakpoints',
        test: (content) => {
            // Check for mobile-first media queries
            return content.includes('@media') &&
                   (content.includes('max-width: 768px') ||
                    content.includes('max-width: 640px') ||
                    content.includes('max-width: 480px'));
        },
        weight: 10,
        critical: true
    },
    {
        name: 'Touch-Friendly Buttons',
        test: (content) => {
            // Check for button classes (shared styles ensure 44x44px)
            return content.includes('class="btn') ||
                   content.includes('min-height: 44px');
        },
        weight: 7,
        critical: false
    },
    {
        name: 'Responsive Grids',
        test: (content) => {
            // Check for responsive grid patterns
            return content.includes('auto-fit') ||
                   content.includes('auto-fill') ||
                   content.includes('minmax(') ||
                   content.includes('grid-template-columns: 1fr');
        },
        weight: 7,
        critical: false
    },
    {
        name: 'Shared Styles Linked',
        test: (content) => {
            return content.includes('shared-styles.css');
        },
        weight: 10,
        critical: true
    },
    {
        name: 'No Horizontal Overflow',
        test: (content) => {
            // Check for overflow-x handling
            return !content.includes('overflow-x: scroll;') ||
                   content.includes('overflow-x: auto') ||
                   content.includes('-webkit-overflow-scrolling: touch');
        },
        weight: 8,
        critical: false
    },
    {
        name: 'Accessible Text Sizing',
        test: (content) => {
            // Avoid absolute font sizes below 12px
            const tinyFontPattern = /font-size:\s*([0-9]|1[01])px/g;
            const matches = content.match(tinyFontPattern) || [];
            return matches.length === 0;
        },
        weight: 6,
        critical: false
    }
];

/**
 * Validate a single page
 */
function validatePage(pagePath, pageName) {
    const content = fs.readFileSync(pagePath, 'utf-8');
    const results = {
        page: pageName,
        passed: 0,
        failed: 0,
        warnings: 0,
        criticalIssues: [],
        allIssues: [],
        score: 0,
        maxScore: 0
    };

    VALIDATION_RULES.forEach(rule => {
        results.maxScore += rule.weight;
        const passed = rule.test(content);

        if (passed) {
            results.passed++;
            results.score += rule.weight;
        } else {
            if (rule.critical) {
                results.failed++;
                results.criticalIssues.push(rule.name);
            } else {
                results.warnings++;
            }
            results.allIssues.push({
                name: rule.name,
                critical: rule.critical
            });
        }
    });

    results.percentage = Math.round((results.score / results.maxScore) * 100);
    return results;
}

/**
 * Generate responsiveness report
 */
function generateReport() {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║     MOBILE RESPONSIVENESS VALIDATION REPORT                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const pagesDir = path.join(__dirname, '..', 'pages');
    const allResults = [];
    let totalScore = 0;
    let totalMaxScore = 0;

    console.log('Test Viewports:');
    Object.entries(VIEWPORTS).forEach(([device, { width, height }]) => {
        console.log(`  • ${device}: ${width}×${height}px`);
    });
    console.log('\n' + '─'.repeat(65) + '\n');

    // Validate each page
    PAGES.forEach(page => {
        const pagePath = path.join(pagesDir, page);

        if (!fs.existsSync(pagePath)) {
            console.log(`⚠️  SKIP: ${page} (not found)`);
            return;
        }

        const results = validatePage(pagePath, page);
        allResults.push(results);
        totalScore += results.score;
        totalMaxScore += results.maxScore;

        // Display result
        const statusIcon = results.criticalIssues.length === 0 ? '✅' : '❌';
        const warningIcon = results.warnings > 0 ? '⚠️ ' : '';

        console.log(`${statusIcon} ${warningIcon} ${page.padEnd(25)} ${results.percentage}% (${results.score}/${results.maxScore})`);

        if (results.criticalIssues.length > 0) {
            console.log(`   Critical Issues:`);
            results.criticalIssues.forEach(issue => {
                console.log(`     ❗ ${issue}`);
            });
        }

        if (results.warnings > 0 && results.criticalIssues.length === 0) {
            console.log(`   Warnings:`);
            results.allIssues.filter(i => !i.critical).forEach(issue => {
                console.log(`     ⚠️  ${issue.name}`);
            });
        }
        console.log('');
    });

    console.log('─'.repeat(65) + '\n');

    // Overall summary
    const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);
    const criticalFailures = allResults.filter(r => r.criticalIssues.length > 0).length;
    const readyPages = allResults.filter(r => r.criticalIssues.length === 0).length;

    console.log('📊 SUMMARY:');
    console.log(`   Overall Score: ${overallPercentage}% (${totalScore}/${totalMaxScore})`);
    console.log(`   Pages Ready: ${readyPages}/${PAGES.length} (${Math.round(readyPages/PAGES.length*100)}%)`);
    console.log(`   Critical Failures: ${criticalFailures}`);
    console.log(`   Total Warnings: ${allResults.reduce((sum, r) => sum + r.warnings, 0)}`);
    console.log('');

    // Quality assessment
    if (overallPercentage >= 95) {
        console.log('✨ EXCELLENT: All pages are mobile-ready!');
    } else if (overallPercentage >= 85) {
        console.log('✅ GOOD: Mobile responsiveness is solid, minor improvements possible.');
    } else if (overallPercentage >= 70) {
        console.log('⚠️  FAIR: Some mobile issues need attention.');
    } else {
        console.log('❌ NEEDS WORK: Significant mobile responsiveness issues detected.');
    }
    console.log('');

    // Recommendations
    console.log('📋 RECOMMENDATIONS:\n');

    const commonIssues = {};
    allResults.forEach(result => {
        result.allIssues.forEach(issue => {
            commonIssues[issue.name] = (commonIssues[issue.name] || 0) + 1;
        });
    });

    const sortedIssues = Object.entries(commonIssues)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedIssues.length > 0) {
        console.log('   Most Common Issues:');
        sortedIssues.forEach(([issue, count]) => {
            console.log(`     • ${issue}: ${count} page(s)`);
        });
    } else {
        console.log('   ✅ No common issues found!');
    }
    console.log('');

    // Test instructions
    console.log('🧪 MANUAL TESTING:');
    console.log('   1. Start dev server: npm run serve');
    console.log('   2. Open browser DevTools (F12)');
    console.log('   3. Toggle Device Toolbar (Ctrl+Shift+M)');
    console.log('   4. Test viewports: 375px, 768px, 1024px, 1440px');
    console.log('   5. Check for: horizontal scroll, readable text, tappable buttons');
    console.log('');

    console.log('─'.repeat(65) + '\n');

    return {
        overallPercentage,
        readyPages,
        totalPages: PAGES.length,
        criticalFailures,
        allResults
    };
}

// Run validation
if (require.main === module) {
    const report = generateReport();

    // Exit with error code if critical failures exist
    if (report.criticalFailures > 0) {
        process.exit(1);
    }
}

module.exports = { validatePage, generateReport, VALIDATION_RULES, VIEWPORTS };
