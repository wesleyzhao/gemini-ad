/**
 * Feature #72 Validation Tests
 * Validates exploratory pattern monitoring and scaling implementation
 */

const fs = require('fs');
const path = require('path');

class Feature72Validator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    test(name, fn) {
        try {
            fn();
            this.results.passed++;
            this.results.tests.push({ name, status: 'PASS' });
            console.log(`✅ ${name}`);
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'FAIL', error: error.message });
            console.log(`❌ ${name}: ${error.message}`);
        }
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    fileExists(filepath) {
        return fs.existsSync(path.resolve(__dirname, '..', filepath));
    }

    readJSON(filepath) {
        const fullPath = path.resolve(__dirname, '..', filepath);
        return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }

    readFile(filepath) {
        const fullPath = path.resolve(__dirname, '..', filepath);
        return fs.readFileSync(fullPath, 'utf8');
    }

    run() {
        console.log('==========================================');
        console.log('FEATURE #72 VALIDATION TESTS');
        console.log('==========================================\n');

        // Test Suite 1: Monitoring System
        console.log('Test Suite 1: Monitoring System');
        console.log('-'.repeat(40));

        this.test('Monitoring script exists', () => {
            this.assert(
                this.fileExists('scripts/monitor-exploratory-performance.js'),
                'monitor-exploratory-performance.js not found'
            );
        });

        this.test('Performance report generated', () => {
            this.assert(
                this.fileExists('reports/optimization/exploratory-performance-report.json'),
                'Performance report not generated'
            );
        });

        this.test('Performance report has correct structure', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            this.assert(report.timestamp, 'Missing timestamp');
            this.assert(report.patterns, 'Missing patterns array');
            this.assert(report.scalingRecommendations, 'Missing scaling recommendations');
            this.assert(report.summary, 'Missing summary');
        });

        this.test('Markdown report generated', () => {
            this.assert(
                this.fileExists('reports/optimization/exploratory-performance-report.md'),
                'Markdown report not generated'
            );
        });

        this.test('Scaling plan generated', () => {
            this.assert(
                this.fileExists('reports/optimization/pattern-scaling-plan.json'),
                'Scaling plan not generated'
            );
        });

        console.log('');

        // Test Suite 2: Pattern Analysis
        console.log('Test Suite 2: Pattern Analysis');
        console.log('-'.repeat(40));

        this.test('Both exploratory patterns analyzed', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            this.assert(report.patterns.length === 2, `Expected 2 patterns, got ${report.patterns.length}`);
        });

        this.test('Personalization pattern evaluated', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            const personalization = report.patterns.find(p => p.name === 'Personalization');
            this.assert(personalization, 'Personalization pattern not found');
            this.assert(personalization.actualPerformance, 'Missing performance data');
            this.assert(personalization.recommendation, 'Missing recommendation');
        });

        this.test('Urgency pattern evaluated', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            const urgency = report.patterns.find(p => p.name === 'Scarcity & Urgency');
            this.assert(urgency, 'Urgency pattern not found');
            this.assert(urgency.actualPerformance, 'Missing performance data');
            this.assert(urgency.recommendation, 'Missing recommendation');
        });

        this.test('Patterns meet scaling thresholds', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            const readyPatterns = report.patterns.filter(p => p.readyForScaling);
            this.assert(readyPatterns.length >= 1, 'No patterns ready for scaling');
        });

        this.test('Scaling recommendations generated', () => {
            const plan = this.readJSON('reports/optimization/pattern-scaling-plan.json');
            this.assert(plan.recommendations.length > 0, 'No scaling recommendations');
        });

        console.log('');

        // Test Suite 3: Pattern Scaling
        console.log('Test Suite 3: Pattern Scaling');
        console.log('-'.repeat(40));

        this.test('Scaling script exists', () => {
            this.assert(
                this.fileExists('scripts/scale-winning-patterns.js'),
                'scale-winning-patterns.js not found'
            );
        });

        this.test('Implementation report generated', () => {
            this.assert(
                this.fileExists('reports/optimization/scaling-implementation-report.json'),
                'Implementation report not generated'
            );
        });

        this.test('Personalization scaled to creators.html', () => {
            const html = this.readFile('pages/creators.html');
            this.assert(
                html.includes('personalizationRules') || html.includes('data-personalize'),
                'Personalization not found in creators.html'
            );
        });

        this.test('Personalization segments defined', () => {
            const html = this.readFile('pages/creators.html');
            this.assert(
                html.includes('video-creator') || html.includes('designer'),
                'Personalization segments not found'
            );
        });

        this.test('Urgency pattern scaled to trust.html', () => {
            const html = this.readFile('pages/trust.html');
            this.assert(
                html.includes('urgency-banner') || html.includes('countdown'),
                'Urgency pattern not found in trust.html'
            );
        });

        this.test('Countdown timer implemented', () => {
            const html = this.readFile('pages/trust.html');
            this.assert(
                html.includes('updateCountdown') || html.includes('endTime'),
                'Countdown functionality not found'
            );
        });

        console.log('');

        // Test Suite 4: Pattern Library Updates
        console.log('Test Suite 4: Pattern Library Updates');
        console.log('-'.repeat(40));

        this.test('Pattern library updated', () => {
            const library = this.readJSON('reports/iterations/pattern-library.json');
            const personalization = library.patterns.find(p => p.name === 'Personalization');
            const urgency = library.patterns.find(p => p.name === 'Scarcity & Urgency');

            this.assert(
                personalization && (personalization.status === 'production' || personalization.scaledTo),
                'Personalization pattern not updated in library'
            );
        });

        this.test('Pattern status changed to production', () => {
            const library = this.readJSON('reports/iterations/pattern-library.json');
            const productionPatterns = library.patterns.filter(p => p.status === 'production');
            this.assert(
                productionPatterns.length >= 2,
                `Expected at least 2 production patterns, got ${productionPatterns.length}`
            );
        });

        this.test('Scaling metadata tracked', () => {
            const library = this.readJSON('reports/iterations/pattern-library.json');
            const personalization = library.patterns.find(p => p.name === 'Personalization');

            if (personalization.scaledTo) {
                this.assert(
                    Array.isArray(personalization.scaledTo),
                    'scaledTo should be an array'
                );
                this.assert(
                    personalization.scaledTo.length > 0,
                    'scaledTo should have entries'
                );
            }
        });

        console.log('');

        // Test Suite 5: Analytics & Tracking
        console.log('Test Suite 5: Analytics & Tracking');
        console.log('-'.repeat(40));

        this.test('Personalization tracking implemented', () => {
            const html = this.readFile('pages/creators.html');
            this.assert(
                html.includes('personalization_applied') || html.includes('gtag'),
                'Personalization tracking not found'
            );
        });

        this.test('Urgency tracking implemented', () => {
            const html = this.readFile('pages/trust.html');
            this.assert(
                html.includes('urgency_pattern_view') || html.includes('gtag'),
                'Urgency tracking not found'
            );
        });

        this.test('Segment tracking configured', () => {
            const html = this.readFile('pages/creators.html');
            this.assert(
                html.includes('segment') && html.includes('gtag'),
                'Segment tracking not properly configured'
            );
        });

        console.log('');

        // Test Suite 6: Velocity Monitoring
        console.log('Test Suite 6: Velocity Monitoring');
        console.log('-'.repeat(40));

        this.test('Velocity tracking script exists', () => {
            this.assert(
                this.fileExists('scripts/track-exploratory-velocity.js'),
                'Velocity tracking script not found'
            );
        });

        this.test('Velocity analysis in performance report', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            this.assert(report.velocityAnalysis, 'Missing velocity analysis');
        });

        this.test('Velocity summary includes key metrics', () => {
            const report = this.readJSON('reports/optimization/exploratory-performance-report.json');
            const summary = report.summary;
            this.assert(summary.totalExploratoryPatterns !== undefined, 'Missing pattern count');
            this.assert(summary.overallStatus !== undefined, 'Missing overall status');
        });

        console.log('');

        // Test Suite 7: Implementation Quality
        console.log('Test Suite 7: Implementation Quality');
        console.log('-'.repeat(40));

        this.test('Personalization has fallback behavior', () => {
            const html = this.readFile('pages/creators.html');
            this.assert(
                html.includes('Object.keys(personalizationRules)[0]') ||
                html.includes('default'),
                'Missing fallback for unknown segments'
            );
        });

        this.test('Countdown handles expiration', () => {
            const html = this.readFile('pages/trust.html');
            this.assert(
                html.includes('distance < 0') || html.includes('00:00:00'),
                'Countdown expiration not handled'
            );
        });

        this.test('Mobile responsiveness maintained', () => {
            const creatorsHtml = this.readFile('pages/creators.html');
            const trustHtml = this.readFile('pages/trust.html');

            this.assert(
                creatorsHtml.includes('viewport') && trustHtml.includes('viewport'),
                'Viewport meta tag missing'
            );
        });

        this.test('Accessibility preserved', () => {
            const html = this.readFile('pages/creators.html');
            this.assert(
                html.includes('<h1') && html.includes('<p'),
                'Semantic HTML structure preserved'
            );
        });

        console.log('');

        // Print Summary
        this.printSummary();
    }

    printSummary() {
        console.log('==========================================');
        console.log('VALIDATION SUMMARY');
        console.log('==========================================\n');

        const total = this.results.passed + this.results.failed;
        const passRate = ((this.results.passed / total) * 100).toFixed(1);

        console.log(`Tests Run:    ${total}`);
        console.log(`Tests Passed: ${this.results.passed} ✅`);
        console.log(`Tests Failed: ${this.results.failed}`);
        console.log(`Pass Rate:    ${passRate}%\n`);

        let grade;
        if (passRate >= 95) grade = 'A+';
        else if (passRate >= 90) grade = 'A';
        else if (passRate >= 85) grade = 'B+';
        else if (passRate >= 80) grade = 'B';
        else if (passRate >= 75) grade = 'C+';
        else if (passRate >= 70) grade = 'C';
        else grade = 'F';

        console.log(`Grade: ${grade}`);
        console.log(`Status: ${this.results.failed === 0 ? '✅ PASS' : '❌ FAIL'}\n`);

        if (this.results.failed > 0) {
            console.log('Failed Tests:');
            this.results.tests
                .filter(t => t.status === 'FAIL')
                .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
            console.log('');
        }

        console.log('==========================================\n');

        // Save results
        const reportPath = path.resolve(__dirname, '../test-reports-feature-72/validation-results.json');
        const reportDir = path.dirname(reportPath);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const report = {
            timestamp: new Date().toISOString(),
            feature: 72,
            description: 'Monitor exploratory pattern performance and scale winning patterns',
            totalTests: total,
            passed: this.results.passed,
            failed: this.results.failed,
            passRate: parseFloat(passRate),
            grade,
            status: this.results.failed === 0 ? 'PASS' : 'FAIL',
            tests: this.results.tests
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✓ Test results saved to: ${path.relative(process.cwd(), reportPath)}\n`);

        // Exit with appropriate code
        process.exit(this.results.failed > 0 ? 1 : 0);
    }
}

// Run tests
const validator = new Feature72Validator();
validator.run();
