/**
 * Test Suite for Feature #89: Real-Time Monitoring Dashboard & Analytics
 *
 * Tests:
 * 1. Dashboard HTML structure and functionality
 * 2. Analytics integration system
 * 3. Quality scoring system
 * 4. Revenue validation framework
 */

const fs = require('fs');
const path = require('path');

// Test results
const results = {
    passed: 0,
    failed: 0,
    total: 0,
    tests: []
};

// Test helper
function test(name, fn) {
    results.total++;
    try {
        fn();
        results.passed++;
        results.tests.push({ name, status: 'PASS' });
        console.log(`✅ ${name}`);
    } catch (error) {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', error: error.message });
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
    }
}

console.log('\n========================================');
console.log('Feature #89 Test Suite');
console.log('Real-Time Monitoring Dashboard & Analytics');
console.log('========================================\n');

// Test 1: Dashboard HTML exists and has correct structure
test('Dashboard HTML file exists', () => {
    if (!fs.existsSync('dashboard.html')) {
        throw new Error('dashboard.html not found');
    }
});

test('Dashboard HTML has required sections', () => {
    const content = fs.readFileSync('dashboard.html', 'utf-8');
    const required = [
        'Gemini Landing Pages Dashboard',
        'Total Annual Revenue',
        'Average Conversion Rate',
        'Pages Optimized',
        'Quality Score',
        'Page Performance Overview',
        'Revenue Validation & Projections',
        'Quality Improvement Roadmap'
    ];

    required.forEach(section => {
        if (!content.includes(section)) {
            throw new Error(`Missing section: ${section}`);
        }
    });
});

test('Dashboard displays correct revenue target ($201.96M)', () => {
    const content = fs.readFileSync('dashboard.html', 'utf-8');
    if (!content.includes('$201.96M')) {
        throw new Error('Revenue target not displayed correctly');
    }
});

test('Dashboard displays correct conversion rate (13.41%)', () => {
    const content = fs.readFileSync('dashboard.html', 'utf-8');
    if (!content.includes('13.41%')) {
        throw new Error('Conversion rate not displayed correctly');
    }
});

test('Dashboard has all 13 pages in data', () => {
    const content = fs.readFileSync('dashboard.html', 'utf-8');
    const expectedPages = [
        'workspace.html',
        'research.html',
        'comparison.html',
        'writers.html',
        'creators.html',
        'productivity.html',
        'future.html',
        'index.html',
        'apple-style.html',
        'valentine.html',
        'operators.html',
        'automators.html',
        'trust.html'
    ];

    expectedPages.forEach(page => {
        if (!content.includes(page)) {
            throw new Error(`Missing page: ${page}`);
        }
    });
});

test('Dashboard includes quality score display', () => {
    const content = fs.readFileSync('dashboard.html', 'utf-8');
    if (!content.includes('94.2%') || !content.includes('Quality Score')) {
        throw new Error('Quality score not displayed correctly');
    }
});

// Test 2: Analytics integration system
test('Analytics integration file exists', () => {
    if (!fs.existsSync('analytics-integration.js')) {
        throw new Error('analytics-integration.js not found');
    }
});

test('Analytics integration has GA4 support', () => {
    const content = fs.readFileSync('analytics-integration.js', 'utf-8');
    if (!content.includes('ga4MeasurementId') || !content.includes('gtag')) {
        throw new Error('GA4 support not implemented');
    }
});

test('Analytics integration tracks CTA clicks', () => {
    const content = fs.readFileSync('analytics-integration.js', 'utf-8');
    if (!content.includes('trackCTAClicks') || !content.includes('cta_click')) {
        throw new Error('CTA click tracking not implemented');
    }
});

test('Analytics integration tracks scroll depth', () => {
    const content = fs.readFileSync('analytics-integration.js', 'utf-8');
    if (!content.includes('trackScrollDepth') || !content.includes('scroll_depth')) {
        throw new Error('Scroll depth tracking not implemented');
    }
});

test('Analytics integration has page view tracking', () => {
    const content = fs.readFileSync('analytics-integration.js', 'utf-8');
    if (!content.includes('trackPageView') || !content.includes('page_view')) {
        throw new Error('Page view tracking not implemented');
    }
});

test('Analytics integration has session and user ID tracking', () => {
    const content = fs.readFileSync('analytics-integration.js', 'utf-8');
    if (!content.includes('getSessionId') || !content.includes('getUserId')) {
        throw new Error('Session/User ID tracking not implemented');
    }
});

// Test 3: Quality scoring system
test('Quality scoring system file exists', () => {
    if (!fs.existsSync('quality-scoring-system.js')) {
        throw new Error('quality-scoring-system.js not found');
    }
});

test('Quality scoring system has all 13 pages', () => {
    const { PAGES } = require('./quality-scoring-system.js');
    if (PAGES.length !== 13) {
        throw new Error(`Expected 13 pages, got ${PAGES.length}`);
    }
});

test('Quality scoring system has correct categories', () => {
    const { QUALITY_CONFIG } = require('./quality-scoring-system.js');
    const expectedCategories = ['performance', 'accessibility', 'seo', 'bestPractices', 'mobileUX'];
    const actualCategories = Object.keys(QUALITY_CONFIG.weights);

    expectedCategories.forEach(cat => {
        if (!actualCategories.includes(cat)) {
            throw new Error(`Missing category: ${cat}`);
        }
    });
});

test('Quality scoring system calculates correct overall scores', () => {
    const { QualityScorer } = require('./quality-scoring-system.js');
    const scorer = new QualityScorer();

    const testScores = {
        performance: 96,
        accessibility: 94,
        seo: 95,
        bestPractices: 95,
        mobileUX: 93
    };

    const overall = scorer.calculateOverallScore(testScores);
    const expected = Math.round((96 + 94 + 95 + 95 + 93) / 5);

    if (overall !== expected) {
        throw new Error(`Expected ${expected}, got ${overall}`);
    }
});

test('Quality scoring system generates results correctly', () => {
    if (!fs.existsSync('quality-scoring-results.json')) {
        throw new Error('quality-scoring-results.json not generated');
    }

    const results = JSON.parse(fs.readFileSync('quality-scoring-results.json', 'utf-8'));
    if (!results.summary || !results.pages || !results.recommendations) {
        throw new Error('Results missing required sections');
    }
});

test('Quality scoring system generates HTML report', () => {
    if (!fs.existsSync('quality-report.html')) {
        throw new Error('quality-report.html not generated');
    }

    const content = fs.readFileSync('quality-report.html', 'utf-8');
    if (!content.includes('Quality Scoring Report') || !content.includes('<table>')) {
        throw new Error('HTML report missing required elements');
    }
});

test('Quality scoring results show correct average (94.5%)', () => {
    const results = JSON.parse(fs.readFileSync('quality-scoring-results.json', 'utf-8'));
    const avg = results.summary.averageOverall;

    // Allow small floating point variance
    if (Math.abs(avg - 94.5) > 0.5) {
        throw new Error(`Expected ~94.5%, got ${avg}%`);
    }
});

// Test 4: Revenue validation framework
test('Revenue validation framework file exists', () => {
    if (!fs.existsSync('revenue-validation-framework.md')) {
        throw new Error('revenue-validation-framework.md not found');
    }
});

test('Revenue validation framework has all sections', () => {
    const content = fs.readFileSync('revenue-validation-framework.md', 'utf-8');
    const sections = [
        'Executive Summary',
        'Baseline Validation Methodology',
        'A/B Testing Validation',
        'Revenue Projection Model',
        'Real-Time Data Validation Plan',
        'Quality Scoring System',
        'Continuous Improvement Framework',
        'Deployment & Monitoring Checklist'
    ];

    sections.forEach(section => {
        if (!content.includes(section)) {
            throw new Error(`Missing section: ${section}`);
        }
    });
});

test('Revenue validation framework shows correct revenue ($201.96M)', () => {
    const content = fs.readFileSync('revenue-validation-framework.md', 'utf-8');
    if (!content.includes('$201.96M')) {
        throw new Error('Revenue projection not documented correctly');
    }
});

test('Revenue validation framework documents all 13 pages', () => {
    const content = fs.readFileSync('revenue-validation-framework.md', 'utf-8');
    const pages = [
        'workspace.html',
        'research.html',
        'comparison.html',
        'writers.html',
        'creators.html',
        'productivity.html',
        'future.html',
        'index.html',
        'apple-style.html',
        'valentine.html',
        'operators.html',
        'automators.html',
        'trust.html'
    ];

    pages.forEach(page => {
        if (!content.includes(page)) {
            throw new Error(`Missing page: ${page}`);
        }
    });
});

test('Revenue validation framework includes statistical validation', () => {
    const content = fs.readFileSync('revenue-validation-framework.md', 'utf-8');
    if (!content.includes('p-value') || !content.includes('95% confidence')) {
        throw new Error('Statistical validation not documented');
    }
});

test('Revenue validation framework has quality improvement roadmap', () => {
    const content = fs.readFileSync('revenue-validation-framework.md', 'utf-8');
    if (!content.includes('Improvement Roadmap') || !content.includes('95%+')) {
        throw new Error('Quality improvement roadmap not documented');
    }
});

// Print results
console.log('\n========================================');
console.log('Test Results Summary');
console.log('========================================');
console.log(`Total Tests: ${results.total}`);
console.log(`Passed: ${results.passed} ✅`);
console.log(`Failed: ${results.failed} ❌`);
console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
console.log('========================================\n');

// Save results
const report = {
    feature: 89,
    description: 'Real-Time Monitoring Dashboard & Analytics',
    timestamp: new Date().toISOString(),
    summary: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        successRate: ((results.passed / results.total) * 100).toFixed(1) + '%'
    },
    tests: results.tests
};

fs.writeFileSync('test-reports-feature-89/validation-results.json', JSON.stringify(report, null, 2));
console.log('✅ Test report saved to test-reports-feature-89/validation-results.json\n');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
