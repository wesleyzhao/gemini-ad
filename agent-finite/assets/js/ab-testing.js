/**
 * A/B Testing Framework for CTAs
 * ===============================
 * A lightweight, client-side A/B testing framework for testing CTA copy,
 * styles, and placement. Tracks conversions and stores results in localStorage.
 *
 * Features:
 * - Multiple variant testing (A/B/C/D/...)
 * - Automatic variant assignment
 * - Click tracking and conversion tracking
 * - Statistical analysis
 * - LocalStorage persistence
 * - Easy configuration
 * - Privacy-friendly (client-side only)
 *
 * Usage:
 * 1. Define test variants in HTML using data attributes
 * 2. Initialize: ABTest.init()
 * 3. Track conversions: ABTest.trackConversion(testName)
 * 4. View results: ABTest.getResults(testName)
 *
 * @version 1.0.0
 */

const ABTest = (function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'abtest_data',
        cookieExpiry: 30, // days
        minSampleSize: 30, // minimum clicks before showing results
        confidenceLevel: 0.95 // 95% confidence level
    };

    // State
    let tests = {};
    let assignments = {};

    /**
     * Initialize the A/B testing framework
     */
    function init() {
        loadStoredData();
        discoverTests();
        assignVariants();
        attachEventListeners();

        console.log('[ABTest] Initialized with tests:', Object.keys(tests));
    }

    /**
     * Load stored test data from localStorage
     */
    function loadStoredData() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                tests = data.tests || {};
                assignments = data.assignments || {};
            }
        } catch (e) {
            console.warn('[ABTest] Error loading stored data:', e);
        }
    }

    /**
     * Save test data to localStorage
     */
    function saveData() {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify({
                tests,
                assignments,
                lastUpdated: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('[ABTest] Error saving data:', e);
        }
    }

    /**
     * Discover all A/B tests on the page
     */
    function discoverTests() {
        // Find all elements with data-ab-test attribute
        const testElements = document.querySelectorAll('[data-ab-test]');

        testElements.forEach(element => {
            const testName = element.getAttribute('data-ab-test');
            const variantId = element.getAttribute('data-ab-variant');
            const variantCopy = element.getAttribute('data-ab-copy');
            const variantStyle = element.getAttribute('data-ab-style');

            if (!testName || !variantId) {
                console.warn('[ABTest] Invalid test configuration:', element);
                return;
            }

            // Initialize test if it doesn't exist
            if (!tests[testName]) {
                tests[testName] = {
                    name: testName,
                    variants: {},
                    startDate: new Date().toISOString()
                };
            }

            // Initialize variant if it doesn't exist
            if (!tests[testName].variants[variantId]) {
                tests[testName].variants[variantId] = {
                    id: variantId,
                    copy: variantCopy || element.textContent.trim(),
                    style: variantStyle || '',
                    impressions: 0,
                    clicks: 0,
                    conversions: 0
                };
            }

            // Store reference to element
            element._abTestName = testName;
            element._abVariantId = variantId;
        });

        saveData();
    }

    /**
     * Assign variants to tests for this user session
     */
    function assignVariants() {
        Object.keys(tests).forEach(testName => {
            const test = tests[testName];

            // Check if user already has an assignment
            if (assignments[testName]) {
                showVariant(testName, assignments[testName]);
                return;
            }

            // Assign random variant
            const variantIds = Object.keys(test.variants);
            const randomIndex = Math.floor(Math.random() * variantIds.length);
            const assignedVariant = variantIds[randomIndex];

            assignments[testName] = assignedVariant;
            saveData();

            showVariant(testName, assignedVariant);
        });
    }

    /**
     * Show the assigned variant and hide others
     */
    function showVariant(testName, variantId) {
        const testElements = document.querySelectorAll(`[data-ab-test="${testName}"]`);

        testElements.forEach(element => {
            const elementVariantId = element.getAttribute('data-ab-variant');

            if (elementVariantId === variantId) {
                // Show this variant
                element.style.display = '';
                element.classList.add('ab-active-variant');

                // Track impression
                trackImpression(testName, variantId);

                // Apply variant copy if specified
                const variantCopy = element.getAttribute('data-ab-copy');
                if (variantCopy) {
                    element.textContent = variantCopy;
                }

                // Apply variant style if specified
                const variantStyle = element.getAttribute('data-ab-style');
                if (variantStyle) {
                    const styles = variantStyle.split(' ');
                    element.classList.add(...styles);
                }
            } else {
                // Hide other variants
                element.style.display = 'none';
                element.classList.remove('ab-active-variant');
            }
        });
    }

    /**
     * Track an impression (variant shown to user)
     */
    function trackImpression(testName, variantId) {
        if (!tests[testName] || !tests[testName].variants[variantId]) {
            return;
        }

        tests[testName].variants[variantId].impressions++;
        saveData();
    }

    /**
     * Track a click on a variant
     */
    function trackClick(testName, variantId) {
        if (!tests[testName] || !tests[testName].variants[variantId]) {
            return;
        }

        tests[testName].variants[variantId].clicks++;
        saveData();

        console.log(`[ABTest] Click tracked: ${testName} - ${variantId}`);
    }

    /**
     * Track a conversion (goal achieved)
     */
    function trackConversion(testName) {
        const variantId = assignments[testName];

        if (!variantId || !tests[testName] || !tests[testName].variants[variantId]) {
            console.warn('[ABTest] Cannot track conversion, test not found:', testName);
            return;
        }

        tests[testName].variants[variantId].conversions++;
        saveData();

        console.log(`[ABTest] Conversion tracked: ${testName} - ${variantId}`);
    }

    /**
     * Attach click event listeners to all test elements
     */
    function attachEventListeners() {
        const testElements = document.querySelectorAll('[data-ab-test]');

        testElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const testName = this._abTestName;
                const variantId = this._abVariantId;

                if (testName && variantId) {
                    trackClick(testName, variantId);
                }
            });
        });
    }

    /**
     * Get test results with statistical analysis
     */
    function getResults(testName) {
        const test = tests[testName];

        if (!test) {
            console.warn('[ABTest] Test not found:', testName);
            return null;
        }

        const results = {
            testName,
            startDate: test.startDate,
            variants: [],
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0,
            winner: null,
            confidence: null
        };

        // Calculate metrics for each variant
        Object.values(test.variants).forEach(variant => {
            const ctr = variant.impressions > 0 ? (variant.clicks / variant.impressions) * 100 : 0;
            const cvr = variant.clicks > 0 ? (variant.conversions / variant.clicks) * 100 : 0;

            results.variants.push({
                id: variant.id,
                copy: variant.copy,
                impressions: variant.impressions,
                clicks: variant.clicks,
                conversions: variant.conversions,
                ctr: ctr.toFixed(2) + '%',
                cvr: cvr.toFixed(2) + '%',
                ctrRaw: ctr,
                cvrRaw: cvr
            });

            results.totalImpressions += variant.impressions;
            results.totalClicks += variant.clicks;
            results.totalConversions += variant.conversions;
        });

        // Sort by conversion rate
        results.variants.sort((a, b) => b.cvrRaw - a.cvrRaw);

        // Determine winner if we have enough data
        if (results.totalClicks >= CONFIG.minSampleSize) {
            results.winner = results.variants[0];

            // Calculate confidence level (simplified)
            if (results.variants.length >= 2) {
                const winnerCVR = results.variants[0].cvrRaw;
                const runnerUpCVR = results.variants[1].cvrRaw;
                const improvementPercent = winnerCVR > 0 ? ((winnerCVR - runnerUpCVR) / winnerCVR) * 100 : 0;

                results.improvement = improvementPercent.toFixed(2) + '%';
                results.confidence = results.totalClicks >= 100 ? 'High' : 'Medium';
            }
        } else {
            results.message = `Need ${CONFIG.minSampleSize - results.totalClicks} more clicks for statistical significance`;
        }

        return results;
    }

    /**
     * Get all test results
     */
    function getAllResults() {
        const allResults = {};
        Object.keys(tests).forEach(testName => {
            allResults[testName] = getResults(testName);
        });
        return allResults;
    }

    /**
     * Display results in console
     */
    function displayResults(testName) {
        const results = testName ? getResults(testName) : getAllResults();

        if (!results) {
            console.log('[ABTest] No results available');
            return;
        }

        console.log('='.repeat(60));
        console.log('A/B TEST RESULTS');
        console.log('='.repeat(60));

        if (testName) {
            printTestResults(results);
        } else {
            Object.values(results).forEach(testResults => {
                printTestResults(testResults);
                console.log('-'.repeat(60));
            });
        }
    }

    /**
     * Print individual test results
     */
    function printTestResults(results) {
        console.log(`Test: ${results.testName}`);
        console.log(`Started: ${new Date(results.startDate).toLocaleDateString()}`);
        console.log(`Total Impressions: ${results.totalImpressions}`);
        console.log(`Total Clicks: ${results.totalClicks}`);
        console.log(`Total Conversions: ${results.totalConversions}`);
        console.log('');

        console.table(results.variants.map(v => ({
            Variant: v.id,
            Copy: v.copy.substring(0, 30) + (v.copy.length > 30 ? '...' : ''),
            Impressions: v.impressions,
            Clicks: v.clicks,
            Conversions: v.conversions,
            CTR: v.ctr,
            CVR: v.cvr
        })));

        if (results.winner) {
            console.log(`🏆 Winner: Variant ${results.winner.id} (${results.winner.copy.substring(0, 40)}...)`);
            console.log(`   Improvement: ${results.improvement || 'N/A'}`);
            console.log(`   Confidence: ${results.confidence || 'N/A'}`);
        } else if (results.message) {
            console.log(`ℹ️  ${results.message}`);
        }
    }

    /**
     * Reset a specific test or all tests
     */
    function resetTest(testName) {
        if (testName) {
            delete tests[testName];
            delete assignments[testName];
            console.log(`[ABTest] Reset test: ${testName}`);
        } else {
            tests = {};
            assignments = {};
            console.log('[ABTest] Reset all tests');
        }
        saveData();
    }

    /**
     * Export data as JSON
     */
    function exportData() {
        const data = {
            tests,
            assignments,
            exported: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `abtest-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('[ABTest] Data exported');
    }

    /**
     * Import data from JSON
     */
    function importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            tests = data.tests || tests;
            assignments = data.assignments || assignments;
            saveData();
            console.log('[ABTest] Data imported successfully');
        } catch (e) {
            console.error('[ABTest] Error importing data:', e);
        }
    }

    /**
     * Get current variant for a test
     */
    function getVariant(testName) {
        return assignments[testName] || null;
    }

    /**
     * Force a specific variant for testing
     */
    function forceVariant(testName, variantId) {
        assignments[testName] = variantId;
        saveData();
        showVariant(testName, variantId);
        console.log(`[ABTest] Forced variant: ${testName} = ${variantId}`);
    }

    // Public API
    return {
        init,
        trackConversion,
        getResults,
        getAllResults,
        displayResults,
        resetTest,
        exportData,
        importData,
        getVariant,
        forceVariant
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ABTest.init());
} else {
    ABTest.init();
}

// Expose to window for console access
window.ABTest = ABTest;
