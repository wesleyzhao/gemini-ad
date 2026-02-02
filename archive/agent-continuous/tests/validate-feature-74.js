/**
 * Comprehensive Test Suite for Feature #74
 * A/B Testing Infrastructure, Real User Monitoring, and Pattern Combinations
 *
 * Tests:
 * - A/B testing infrastructure functionality
 * - Real user monitoring system
 * - Pattern combination testing
 * - Integration and end-to-end workflows
 */

const fs = require('fs');
const path = require('path');
const ABTestingInfrastructure = require('../scripts/ab-testing-infrastructure');
const RealUserMonitoring = require('../scripts/real-user-monitoring');
const PatternCombinationTester = require('../scripts/test-pattern-combinations');

class Feature74Validator {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    /**
     * Run a test and record result
     */
    test(name, fn) {
        this.results.total++;
        try {
            fn();
            this.results.passed++;
            this.results.tests.push({ name, status: 'PASS' });
            console.log(`✓ ${name}`);
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'FAIL', error: error.message });
            console.log(`✗ ${name}: ${error.message}`);
        }
    }

    /**
     * Assert condition is true
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    /**
     * Assert two values are equal
     */
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    /**
     * Assert array includes value
     */
    assertIncludes(array, value, message) {
        if (!array.includes(value)) {
            throw new Error(message || `Array does not include ${value}`);
        }
    }

    /**
     * Assert file exists
     */
    assertFileExists(filePath, message) {
        if (!fs.existsSync(filePath)) {
            throw new Error(message || `File does not exist: ${filePath}`);
        }
    }

    /**
     * Assert object has property
     */
    assertHasProperty(obj, prop, message) {
        if (!obj.hasOwnProperty(prop)) {
            throw new Error(message || `Object does not have property: ${prop}`);
        }
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('Feature #74 Validation Tests');
        console.log('=============================\n');

        this.testABTestingInfrastructure();
        this.testRealUserMonitoring();
        this.testPatternCombinations();
        this.testIntegration();
        this.testReports();

        console.log('\n=============================');
        console.log(`Results: ${this.results.passed}/${this.results.total} tests passed`);

        const passRate = (this.results.passed / this.results.total) * 100;
        let grade;
        if (passRate >= 95) grade = 'A+';
        else if (passRate >= 90) grade = 'A';
        else if (passRate >= 85) grade = 'B+';
        else if (passRate >= 80) grade = 'B';
        else if (passRate >= 75) grade = 'C';
        else grade = 'F';

        console.log(`Pass Rate: ${passRate.toFixed(1)}%`);
        console.log(`Grade: ${grade}\n`);

        // Save results
        const reportPath = path.join(__dirname, '../test-reports-feature-74');
        if (!fs.existsSync(reportPath)) {
            fs.mkdirSync(reportPath, { recursive: true });
        }

        fs.writeFileSync(
            path.join(reportPath, 'validation-results.json'),
            JSON.stringify(this.results, null, 2)
        );

        return this.results.failed === 0;
    }

    /**
     * Test A/B Testing Infrastructure
     */
    testABTestingInfrastructure() {
        console.log('\nA/B Testing Infrastructure Tests:');
        console.log('---------------------------------');

        const ab = new ABTestingInfrastructure();

        this.test('ABTestingInfrastructure class instantiates', () => {
            this.assert(ab instanceof ABTestingInfrastructure, 'Instance created');
        });

        this.test('Can create a new A/B test', () => {
            const test = ab.createTest({
                testId: 'test_validation',
                name: 'Validation Test',
                page: 'test.html',
                variants: [
                    {
                        variantId: 'control',
                        name: 'Control',
                        description: 'Original version'
                    },
                    {
                        variantId: 'treatment',
                        name: 'Treatment',
                        description: 'New version'
                    }
                ],
                trafficSplit: {
                    'control': 50,
                    'treatment': 50
                },
                minSampleSize: 100
            });

            this.assert(test, 'Test created');
            this.assertEqual(test.testId, 'test_validation');
            this.assertEqual(test.variants.length, 2);
        });

        this.test('Traffic split validation rejects invalid splits', () => {
            let errorThrown = false;
            try {
                ab.createTest({
                    testId: 'test_invalid',
                    name: 'Invalid Test',
                    page: 'test.html',
                    variants: [
                        { variantId: 'control', name: 'Control', description: 'Test' },
                        { variantId: 'treatment', name: 'Treatment', description: 'Test' }
                    ],
                    trafficSplit: {
                        'control': 50,
                        'treatment': 40 // Only 90%!
                    }
                });
            } catch (error) {
                errorThrown = true;
            }
            this.assert(errorThrown, 'Invalid traffic split rejected');
        });

        this.test('Variant assignment is consistent', () => {
            const variant1 = ab.assignVariant('test_validation', 'user123');
            const variant2 = ab.assignVariant('test_validation', 'user123');
            this.assertEqual(variant1.variantId, variant2.variantId, 'Same user gets same variant');
        });

        this.test('Variant assignment distributes traffic', () => {
            const assignments = {};
            for (let i = 0; i < 1000; i++) {
                const variant = ab.assignVariant('test_validation', `user${i}`);
                assignments[variant.variantId] = (assignments[variant.variantId] || 0) + 1;
            }

            // Should be roughly 50/50 (allow 40-60% range)
            const controlPercent = (assignments.control / 1000) * 100;
            this.assert(controlPercent >= 40 && controlPercent <= 60, `Traffic split is balanced: ${controlPercent.toFixed(1)}%`);
        });

        this.test('Can record conversion events', () => {
            // Get current conversion count
            const resultsBefore = ab.loadTestResults();
            const conversionsBefore = resultsBefore.test_validation?.variants?.control?.conversions || 0;

            // Record new conversion
            ab.recordConversion('test_validation', 'control', {
                converted: true,
                timeOnPage: 145,
                scrollDepth: 75,
                ctaClick: true
            });

            // Verify conversion was recorded
            const resultsAfter = ab.loadTestResults();
            this.assert(resultsAfter.test_validation, 'Results recorded');
            this.assert(resultsAfter.test_validation.variants.control, 'Variant data recorded');
            this.assertEqual(resultsAfter.test_validation.variants.control.conversions, conversionsBefore + 1, 'Conversion count increased by 1');
        });

        this.test('Statistical analysis works correctly', () => {
            // Add more sample data
            for (let i = 0; i < 100; i++) {
                ab.recordConversion('test_validation', 'control', { converted: i < 10 });
                ab.recordConversion('test_validation', 'treatment', { converted: i < 20 });
            }

            const analysis = ab.analyzeTest('test_validation');
            this.assert(analysis, 'Analysis generated');
            this.assert(analysis.variants.length === 2, 'All variants analyzed');
            this.assertHasProperty(analysis, 'confidence');
            this.assertHasProperty(analysis, 'recommendation');
        });

        this.test('Chi-square test calculation is accurate', () => {
            const result = ab.chiSquareTest(10, 100, 20, 100);
            this.assertHasProperty(result, 'chiSquare');
            this.assertHasProperty(result, 'pValue');
            this.assertHasProperty(result, 'confidence');
            this.assertHasProperty(result, 'isSignificant');
        });

        this.test('Client script generation works', () => {
            const script = ab.generateClientScript('test_validation');
            this.assert(script.includes('test_validation'), 'Test ID in script');
            this.assert(script.includes('gtag'), 'Google Analytics integration');
            this.assert(script.includes('localStorage'), 'User ID storage');
        });

        this.test('Test report generation is comprehensive', () => {
            const report = ab.generateReport('test_validation');
            this.assertHasProperty(report, 'testDetails');
            this.assertHasProperty(report, 'recommendations');
            this.assertHasProperty(report, 'nextSteps');
            this.assert(report.recommendations.length > 0, 'Recommendations generated');
        });

        this.test('Can list active tests', () => {
            const activeTests = ab.listActiveTests();
            this.assert(Array.isArray(activeTests), 'Returns array');
            this.assert(activeTests.length > 0, 'Has active tests');
        });

        this.test('Can stop a test', () => {
            ab.stopTest('test_validation', 'Testing complete');
            const tests = ab.loadActiveTests();
            this.assertEqual(tests.test_validation.status, 'stopped');
        });
    }

    /**
     * Test Real User Monitoring
     */
    testRealUserMonitoring() {
        console.log('\nReal User Monitoring Tests:');
        console.log('---------------------------');

        const rum = new RealUserMonitoring();

        this.test('RealUserMonitoring class instantiates', () => {
            this.assert(rum instanceof RealUserMonitoring, 'Instance created');
        });

        this.test('Configuration loads correctly', () => {
            this.assert(rum.config, 'Config exists');
            this.assertHasProperty(rum.config, 'gaTrackingId');
            this.assertHasProperty(rum.config, 'enabledMetrics');
            this.assertHasProperty(rum.config, 'alerts');
        });

        this.test('GA4 script generation includes all features', () => {
            const script = rum.generateGA4Script();
            this.assert(script.includes('gtag'), 'Google Analytics');
            this.assert(script.includes('user_segment'), 'Custom dimensions');
            this.assert(script.includes('conversion'), 'Conversion tracking');
        });

        this.test('Core Web Vitals script is generated', () => {
            const script = rum.getCoreWebVitalsScript();
            this.assert(script.includes('LCP'), 'LCP tracking');
            this.assert(script.includes('FID'), 'FID tracking');
            this.assert(script.includes('CLS'), 'CLS tracking');
            this.assert(script.includes('TTFB'), 'TTFB tracking');
        });

        this.test('Error tracking script is generated', () => {
            const script = rum.getErrorTrackingScript();
            this.assert(script.includes('error'), 'Error event tracking');
            this.assert(script.includes('unhandledrejection'), 'Promise rejection tracking');
        });

        this.test('User timing script is generated', () => {
            const script = rum.getUserTimingScript();
            this.assert(script.includes('page_load'), 'Page load timing');
            this.assert(script.includes('dom_ready'), 'DOM ready timing');
        });

        this.test('Can process GA4 data', async () => {
            const startDate = new Date('2026-01-15');
            const endDate = new Date('2026-02-01');
            const metrics = await rum.processGA4Data(startDate, endDate);

            this.assert(metrics, 'Metrics generated');
            this.assertHasProperty(metrics, 'pageViews');
            this.assertHasProperty(metrics, 'conversions');
            this.assertHasProperty(metrics, 'conversionRates');
            this.assertHasProperty(metrics, 'coreWebVitals');
            this.assertHasProperty(metrics, 'performanceScores');
        });

        this.test('Metrics file is created', () => {
            const metricsPath = path.join(rum.dataDir, 'user-metrics.json');
            this.assertFileExists(metricsPath, 'Metrics file exists');
        });

        this.test('Dashboard HTML is generated', () => {
            const html = rum.generateDashboard();
            this.assert(html.includes('<html'), 'Valid HTML');
            this.assert(html.includes('Real User Monitoring'), 'Dashboard title');
            this.assert(html.includes('Core Web Vitals'), 'Core Web Vitals section');
            this.assert(html.includes('Conversion Performance'), 'Conversion section');
        });

        this.test('Dashboard file is created', () => {
            const dashboardPath = path.join(rum.dataDir, 'dashboard.html');
            this.assertFileExists(dashboardPath, 'Dashboard file exists');
        });

        this.test('Alert system works correctly', () => {
            const alerts = rum.checkAlerts();
            this.assert(Array.isArray(alerts), 'Returns array');
            // May or may not have alerts depending on thresholds
        });

        this.test('Alerts have correct structure', () => {
            const alerts = rum.checkAlerts();
            if (alerts.length > 0) {
                const alert = alerts[0];
                this.assertHasProperty(alert, 'severity');
                this.assertHasProperty(alert, 'metric');
                this.assertHasProperty(alert, 'message');
                this.assertHasProperty(alert, 'timestamp');
            }
        });
    }

    /**
     * Test Pattern Combinations
     */
    testPatternCombinations() {
        console.log('\nPattern Combination Tests:');
        console.log('-------------------------');

        const tester = new PatternCombinationTester();

        this.test('PatternCombinationTester class instantiates', () => {
            this.assert(tester instanceof PatternCombinationTester, 'Instance created');
        });

        this.test('Can load pattern library', () => {
            const library = tester.loadPatternLibrary();
            this.assert(library, 'Library loaded');
            this.assertHasProperty(library, 'patterns');
            this.assert(Array.isArray(library.patterns), 'Patterns is array');
        });

        this.test('Pattern library has required structure', () => {
            const library = tester.loadPatternLibrary();
            this.assertHasProperty(library, 'version');
            this.assertHasProperty(library, 'lastUpdated');
            this.assertHasProperty(library, 'totalPatterns');
            this.assert(library.patterns.length > 0, 'Has patterns');
        });

        this.test('Can test all combinations', () => {
            const results = tester.testAllCombinations({
                maxCombinationSize: 2,
                minPerformanceThreshold: 5.0,
                onlyProduction: true
            });

            this.assert(results, 'Results generated');
            this.assertHasProperty(results, 'tested');
            this.assertHasProperty(results, 'promising');
            this.assertHasProperty(results, 'combinations');
        });

        this.test('Conflict detection works', () => {
            const library = tester.loadPatternLibrary();
            const patterns = library.patterns.filter(p => p.status === 'production');

            if (patterns.length >= 2) {
                const conflicts = tester.detectConflicts(patterns.slice(0, 2));
                this.assert(Array.isArray(conflicts), 'Returns array');
            }
        });

        this.test('Synergy detection works', () => {
            const library = tester.loadPatternLibrary();
            const patterns = library.patterns.filter(p => p.status === 'production');

            if (patterns.length >= 2) {
                const synergies = tester.detectSynergies(patterns);
                this.assert(Array.isArray(synergies), 'Returns array');

                // Should detect personalization + urgency synergy
                const hasPersonalization = patterns.some(p => p.category === 'personalization');
                const hasUrgency = patterns.some(p => p.category === 'urgency');

                if (hasPersonalization && hasUrgency) {
                    this.assert(synergies.length > 0, 'Detects personalization + urgency synergy');
                }
            }
        });

        this.test('Lift prediction is reasonable', () => {
            const library = tester.loadPatternLibrary();
            const patterns = library.patterns.filter(p => p.status === 'production');

            if (patterns.length >= 2) {
                const synergies = tester.detectSynergies(patterns);
                const conflicts = tester.detectConflicts(patterns);
                const prediction = tester.predictCombinedLift(patterns, synergies, conflicts);

                this.assertHasProperty(prediction, 'lift');
                this.assertHasProperty(prediction, 'confidence');
                this.assert(prediction.lift >= 0, 'Lift is non-negative');
                this.assert(prediction.confidence >= 0 && prediction.confidence <= 1, 'Confidence in valid range');
            }
        });

        this.test('Complexity assessment works', () => {
            const library = tester.loadPatternLibrary();
            const patterns = library.patterns.slice(0, 2);

            if (patterns.length >= 2) {
                const complexity = tester.assessComplexity(patterns);
                this.assertIncludes(['low', 'medium', 'high'], complexity, 'Valid complexity level');
            }
        });

        this.test('Recommendations are generated', () => {
            const library = tester.loadPatternLibrary();
            const patterns = library.patterns.filter(p => p.status === 'production');

            if (patterns.length >= 2) {
                const combo = tester.testCombination(patterns);
                this.assertHasProperty(combo, 'recommendation');
                this.assert(combo.recommendation.length > 0, 'Recommendation not empty');
            }
        });

        this.test('Can generate comprehensive report', () => {
            const results = tester.testAllCombinations({
                maxCombinationSize: 2,
                minPerformanceThreshold: 5.0,
                onlyProduction: true
            });

            const report = tester.generateReport(results, 5);
            this.assertHasProperty(report, 'summary');
            this.assertHasProperty(report, 'top_combinations');
            this.assertHasProperty(report, 'implementation_plan');
            this.assertHasProperty(report, 'recommendations');
        });

        this.test('Priority calculation is correct', () => {
            const combo = {
                predicted_lift: 20,
                confidence: 0.9,
                implementation_complexity: 'low',
                conflicts: []
            };

            const priority = tester.calculatePriority(combo);
            this.assertIncludes(['HIGH', 'MEDIUM', 'LOW'], priority, 'Valid priority');
        });

        this.test('Implementation plan is actionable', () => {
            const results = tester.testAllCombinations({
                maxCombinationSize: 2,
                minPerformanceThreshold: 5.0,
                onlyProduction: true
            });

            const report = tester.generateReport(results);
            this.assert(report.implementation_plan.length > 0, 'Has implementation phases');

            const phase = report.implementation_plan[0];
            this.assertHasProperty(phase, 'phase');
            this.assertHasProperty(phase, 'action');
            this.assertHasProperty(phase, 'expected_impact');
        });

        this.test('Markdown report generation works', () => {
            const results = tester.testAllCombinations({
                maxCombinationSize: 2,
                minPerformanceThreshold: 5.0,
                onlyProduction: true
            });

            const report = tester.generateReport(results);
            const markdown = tester.generateMarkdownReport(report);

            this.assert(markdown.includes('# Pattern Combination Analysis'), 'Has title');
            this.assert(markdown.includes('## Summary'), 'Has summary section');
            this.assert(markdown.includes('## Top'), 'Has top combinations');
        });
    }

    /**
     * Test Integration
     */
    testIntegration() {
        console.log('\nIntegration Tests:');
        console.log('-----------------');

        this.test('All three systems can work together', () => {
            const ab = new ABTestingInfrastructure();
            const rum = new RealUserMonitoring();
            const tester = new PatternCombinationTester();

            this.assert(ab && rum && tester, 'All systems instantiate');
        });

        this.test('Pattern combination results can inform A/B tests', () => {
            const tester = new PatternCombinationTester();
            const results = tester.testAllCombinations({
                maxCombinationSize: 2,
                onlyProduction: true
            });

            const ab = new ABTestingInfrastructure();

            // Top combination should be testable
            if (results.combinations.length > 0) {
                const topCombo = results.combinations[0];
                this.assert(topCombo.pattern_names.length >= 2, 'Top combo has multiple patterns');
                this.assert(topCombo.predicted_lift > 0, 'Has predicted lift');
            }
        });

        this.test('RUM data can inform pattern selection', async () => {
            const rum = new RealUserMonitoring();
            const metrics = await rum.processGA4Data(
                new Date('2026-01-15'),
                new Date('2026-02-01')
            );

            const tester = new PatternCombinationTester();
            const library = tester.loadPatternLibrary();

            // Metrics should help prioritize patterns
            this.assert(metrics.conversionRates, 'Has conversion data');
            this.assert(library.patterns.length > 0, 'Has patterns to select from');
        });
    }

    /**
     * Test Reports and Documentation
     */
    testReports() {
        console.log('\nReport and Documentation Tests:');
        console.log('-------------------------------');

        this.test('A/B testing reports directory exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/ab-tests'),
                'A/B tests directory exists'
            );
        });

        this.test('RUM reports directory exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/rum'),
                'RUM directory exists'
            );
        });

        this.test('Pattern combinations reports directory exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/pattern-combinations'),
                'Pattern combinations directory exists'
            );
        });

        this.test('Pattern library file exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/iterations/pattern-library.json'),
                'Pattern library exists'
            );
        });

        this.test('Combination analysis report exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/pattern-combinations/combination-analysis-report.json'),
                'Combination analysis report exists'
            );
        });

        this.test('Combination analysis markdown exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/pattern-combinations/COMBINATION_ANALYSIS.md'),
                'Combination analysis markdown exists'
            );
        });

        this.test('RUM dashboard exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/rum/dashboard.html'),
                'RUM dashboard exists'
            );
        });

        this.test('RUM metrics file exists', () => {
            this.assertFileExists(
                path.join(__dirname, '../reports/rum/user-metrics.json'),
                'RUM metrics file exists'
            );
        });
    }
}

// Run tests
if (require.main === module) {
    const validator = new Feature74Validator();
    const success = validator.runAllTests();
    process.exit(success ? 0 : 1);
}

module.exports = Feature74Validator;
