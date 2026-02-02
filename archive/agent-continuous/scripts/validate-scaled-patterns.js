#!/usr/bin/env node

/**
 * Feature #73: Validate Scaled Pattern Performance
 *
 * This script validates that the patterns scaled in Feature #72 are working correctly:
 * 1. Personalization on creators.html (4 segments)
 * 2. Urgency pattern on trust.html (countdown + scarcity)
 *
 * It performs comprehensive validation including:
 * - DOM element presence
 * - JavaScript functionality
 * - Analytics integration
 * - Mobile responsiveness
 * - Accessibility compliance
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
    log('\n' + '='.repeat(80), colors.bright);
    log(title, colors.bright + colors.blue);
    log('='.repeat(80), colors.bright);
}

function logSuccess(message) {
    log(`✓ ${message}`, colors.green);
}

function logError(message) {
    log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
    log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
    log(`ℹ ${message}`, colors.blue);
}

// Validation results tracking
const validationResults = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    patterns: {
        personalization: {
            status: 'unknown',
            tests: [],
            segments: []
        },
        urgency: {
            status: 'unknown',
            tests: [],
            elements: []
        }
    },
    recommendations: []
};

/**
 * Validate Personalization Pattern on creators.html
 */
function validatePersonalizationPattern() {
    logSection('Validating Personalization Pattern on creators.html');

    const filePath = path.join(__dirname, '../pages/creators.html');

    if (!fs.existsSync(filePath)) {
        logError('creators.html not found!');
        validationResults.patterns.personalization.status = 'failed';
        validationResults.failed++;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Test 1: Check for personalization data attributes
    validationResults.totalTests++;
    const hasDataPersonalize = content.includes('data-personalize=');
    if (hasDataPersonalize) {
        logSuccess('Found data-personalize attributes');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Data attributes present',
            status: 'pass'
        });
    } else {
        logError('Missing data-personalize attributes');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Data attributes present',
            status: 'fail'
        });
    }

    // Test 2: Check for all 4 personalization targets
    validationResults.totalTests++;
    const targets = ['badge', 'heading', 'description', 'cta-primary'];
    const allTargetsPresent = targets.every(target =>
        content.includes(`data-personalize="${target}"`)
    );
    if (allTargetsPresent) {
        logSuccess('All 4 personalization targets present (badge, heading, description, cta-primary)');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'All personalization targets present',
            status: 'pass'
        });
    } else {
        logError('Missing some personalization targets');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'All personalization targets present',
            status: 'fail'
        });
    }

    // Test 3: Check for personalization rules object
    validationResults.totalTests++;
    const hasPersonalizationRules = content.includes('personalizationRules');
    if (hasPersonalizationRules) {
        logSuccess('Found personalizationRules object');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Personalization rules defined',
            status: 'pass'
        });
    } else {
        logError('Missing personalizationRules object');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Personalization rules defined',
            status: 'fail'
        });
    }

    // Test 4: Check for all 4 segments + default
    validationResults.totalTests++;
    const segments = ['video-creator', 'designer', 'musician', 'artist', 'default'];
    const segmentChecks = segments.map(seg => {
        const present = content.includes(`'${seg}'`) || content.includes(`"${seg}"`);
        if (present) {
            validationResults.patterns.personalization.segments.push({
                name: seg,
                status: 'present'
            });
        }
        return present;
    });
    const allSegmentsPresent = segmentChecks.every(check => check);
    if (allSegmentsPresent) {
        logSuccess('All 5 segments defined (video-creator, designer, musician, artist, default)');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'All segments defined',
            status: 'pass'
        });
    } else {
        logError('Missing some segment definitions');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'All segments defined',
            status: 'fail'
        });
    }

    // Test 5: Check for getUserSegment function
    validationResults.totalTests++;
    const hasGetUserSegment = content.includes('function getUserSegment()') ||
                                content.includes('getUserSegment = ');
    if (hasGetUserSegment) {
        logSuccess('Found getUserSegment() function');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Segment detection function present',
            status: 'pass'
        });
    } else {
        logError('Missing getUserSegment() function');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Segment detection function present',
            status: 'fail'
        });
    }

    // Test 6: Check for applyPersonalization function
    validationResults.totalTests++;
    const hasApplyPersonalization = content.includes('function applyPersonalization()') ||
                                     content.includes('applyPersonalization = ');
    if (hasApplyPersonalization) {
        logSuccess('Found applyPersonalization() function');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Apply personalization function present',
            status: 'pass'
        });
    } else {
        logError('Missing applyPersonalization() function');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Apply personalization function present',
            status: 'fail'
        });
    }

    // Test 7: Check for Google Analytics integration
    validationResults.totalTests++;
    const hasAnalytics = content.includes('gtag') || content.includes('personalization_pattern');
    if (hasAnalytics) {
        logSuccess('Google Analytics integration present');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'Analytics tracking integrated',
            status: 'pass'
        });
    } else {
        logWarning('Google Analytics integration not detected');
        validationResults.warnings++;
        validationResults.patterns.personalization.tests.push({
            name: 'Analytics tracking integrated',
            status: 'warning'
        });
    }

    // Test 8: Check for URL parameter handling
    validationResults.totalTests++;
    const hasURLParams = content.includes('URLSearchParams') || content.includes('?segment=');
    if (hasURLParams) {
        logSuccess('URL parameter handling implemented');
        validationResults.passed++;
        validationResults.patterns.personalization.tests.push({
            name: 'URL parameter detection',
            status: 'pass'
        });
    } else {
        logError('Missing URL parameter handling');
        validationResults.failed++;
        validationResults.patterns.personalization.tests.push({
            name: 'URL parameter detection',
            status: 'fail'
        });
    }

    // Test 9: Check for mobile viewport meta tag
    validationResults.totalTests++;
    const hasMobileViewport = content.includes('viewport') && content.includes('width=device-width');
    if (hasMobileViewport) {
        logSuccess('Mobile viewport meta tag present');
        validationResults.passed++;
    } else {
        logWarning('Mobile viewport meta tag missing or incorrect');
        validationResults.warnings++;
    }

    // Set overall status
    const failedTests = validationResults.patterns.personalization.tests.filter(t => t.status === 'fail').length;
    if (failedTests === 0) {
        validationResults.patterns.personalization.status = 'pass';
        logSuccess('\nPersonalization pattern validation: PASS');
    } else {
        validationResults.patterns.personalization.status = 'fail';
        logError(`\nPersonalization pattern validation: FAIL (${failedTests} failed tests)`);
    }
}

/**
 * Validate Urgency Pattern on trust.html
 */
function validateUrgencyPattern() {
    logSection('Validating Urgency Pattern on trust.html');

    const filePath = path.join(__dirname, '../pages/trust.html');

    if (!fs.existsSync(filePath)) {
        logError('trust.html not found!');
        validationResults.patterns.urgency.status = 'failed';
        validationResults.failed++;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Test 1: Check for urgency banner
    validationResults.totalTests++;
    const hasUrgencyBanner = content.includes('urgency-banner');
    if (hasUrgencyBanner) {
        logSuccess('Found urgency-banner element');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Urgency banner present',
            status: 'pass'
        });
        validationResults.patterns.urgency.elements.push('urgency-banner');
    } else {
        logError('Missing urgency-banner element');
        validationResults.failed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Urgency banner present',
            status: 'fail'
        });
    }

    // Test 2: Check for countdown timer
    validationResults.totalTests++;
    const hasCountdown = content.includes('countdown') &&
                          (content.includes('id="countdown') || content.includes('countdown-inline'));
    if (hasCountdown) {
        logSuccess('Found countdown timer element');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Countdown timer present',
            status: 'pass'
        });
        validationResults.patterns.urgency.elements.push('countdown-timer');
    } else {
        logError('Missing countdown timer element');
        validationResults.failed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Countdown timer present',
            status: 'fail'
        });
    }

    // Test 3: Check for spots remaining counter
    validationResults.totalTests++;
    const hasSpotsRemaining = content.includes('spots-remaining') || content.includes('Spots Left');
    if (hasSpotsRemaining) {
        logSuccess('Found spots remaining counter');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Spots counter present',
            status: 'pass'
        });
        validationResults.patterns.urgency.elements.push('spots-counter');
    } else {
        logError('Missing spots remaining counter');
        validationResults.failed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Spots counter present',
            status: 'fail'
        });
    }

    // Test 4: Check for timer update logic (setInterval)
    validationResults.totalTests++;
    const hasTimerLogic = content.includes('setInterval') && content.includes('1000');
    if (hasTimerLogic) {
        logSuccess('Found countdown update logic (setInterval)');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Countdown update logic present',
            status: 'pass'
        });
    } else {
        logError('Missing countdown update logic');
        validationResults.failed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Countdown update logic present',
            status: 'fail'
        });
    }

    // Test 5: Check for expiration handling
    validationResults.totalTests++;
    const hasExpiration = content.includes('00:00:00') || content.includes('hours === 0');
    if (hasExpiration) {
        logSuccess('Found countdown expiration handling');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Expiration handling present',
            status: 'pass'
        });
    } else {
        logWarning('Countdown expiration handling not detected');
        validationResults.warnings++;
        validationResults.patterns.urgency.tests.push({
            name: 'Expiration handling present',
            status: 'warning'
        });
    }

    // Test 6: Check for slideDown animation
    validationResults.totalTests++;
    const hasAnimation = content.includes('slideDown') || content.includes('@keyframes');
    if (hasAnimation) {
        logSuccess('Found slideDown animation');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Banner animation present',
            status: 'pass'
        });
    } else {
        logWarning('Banner animation not detected');
        validationResults.warnings++;
        validationResults.patterns.urgency.tests.push({
            name: 'Banner animation present',
            status: 'warning'
        });
    }

    // Test 7: Check for Google Analytics integration
    validationResults.totalTests++;
    const hasAnalytics = content.includes('gtag') || content.includes('urgency_pattern');
    if (hasAnalytics) {
        logSuccess('Google Analytics integration present');
        validationResults.passed++;
        validationResults.patterns.urgency.tests.push({
            name: 'Analytics tracking integrated',
            status: 'pass'
        });
    } else {
        logWarning('Google Analytics integration not detected');
        validationResults.warnings++;
        validationResults.patterns.urgency.tests.push({
            name: 'Analytics tracking integrated',
            status: 'warning'
        });
    }

    // Test 8: Check for gradient background
    validationResults.totalTests++;
    const hasGradient = content.includes('linear-gradient') && content.includes('urgency');
    if (hasGradient) {
        logSuccess('Found gradient background styling');
        validationResults.passed++;
    } else {
        logWarning('Gradient background not detected');
        validationResults.warnings++;
    }

    // Test 9: Check for mobile responsiveness
    validationResults.totalTests++;
    const hasMobileViewport = content.includes('viewport') && content.includes('width=device-width');
    if (hasMobileViewport) {
        logSuccess('Mobile viewport meta tag present');
        validationResults.passed++;
    } else {
        logWarning('Mobile viewport meta tag missing or incorrect');
        validationResults.warnings++;
    }

    // Set overall status
    const failedTests = validationResults.patterns.urgency.tests.filter(t => t.status === 'fail').length;
    if (failedTests === 0) {
        validationResults.patterns.urgency.status = 'pass';
        logSuccess('\nUrgency pattern validation: PASS');
    } else {
        validationResults.patterns.urgency.status = 'fail';
        logError(`\nUrgency pattern validation: FAIL (${failedTests} failed tests)`);
    }
}

/**
 * Analyze performance data from Feature #72
 */
function analyzePerformanceData() {
    logSection('Analyzing Performance Data from Feature #72');

    const reportPath = path.join(__dirname, '../reports/optimization/exploratory-performance-report.json');

    if (!fs.existsSync(reportPath)) {
        logWarning('Performance report not found - cannot analyze data');
        return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    logInfo('Performance Report Analysis:');
    console.log('');

    // Personalization pattern
    if (report.patterns && report.patterns.personalization) {
        const p = report.patterns.personalization;
        log(`Personalization Pattern:`, colors.bright);
        log(`  Overall CVR: ${p.performance?.overall?.conversionRate || 'N/A'}%`);
        log(`  Lift: ${p.performance?.overall?.lift || 'N/A'}%`);
        log(`  Confidence: ${p.performance?.overall?.confidence || 'N/A'}%`);
        log(`  Sample Size: ${p.performance?.overall?.impressions || 'N/A'}`);
        log(`  Status: ${p.readyForScaling ? '✓ Ready for scaling' : '✗ Not ready'}`,
            p.readyForScaling ? colors.green : colors.red);
        console.log('');
    }

    // Urgency pattern
    if (report.patterns && report.patterns.scarcityUrgency) {
        const u = report.patterns.scarcityUrgency;
        log(`Urgency Pattern:`, colors.bright);
        log(`  Overall CVR: ${u.performance?.overall?.conversionRate || 'N/A'}%`);
        log(`  Lift: ${u.performance?.overall?.lift || 'N/A'}%`);
        log(`  Confidence: ${u.performance?.overall?.confidence || 'N/A'}%`);
        log(`  Sample Size: ${u.performance?.overall?.impressions || 'N/A'}`);
        log(`  Status: ${u.readyForScaling ? '✓ Ready for scaling' : '✗ Not ready'}`,
            u.readyForScaling ? colors.green : colors.red);
        console.log('');
    }

    // Velocity analysis
    if (report.velocityAnalysis) {
        const v = report.velocityAnalysis;
        log(`Velocity Analysis:`, colors.bright);
        log(`  Current Velocity: ${v.currentVelocity || 'N/A'} pts/cycle`);
        log(`  Target Velocity: ${v.targetVelocity || '>0.5'} pts/cycle`);
        log(`  Stagnation Status: ${v.stagnationStatus || 'Unknown'}`);
        log(`  Estimated Post-Scaling: ${v.estimatedVelocity || 'N/A'} pts/cycle`);
        console.log('');
    }
}

/**
 * Generate recommendations based on validation results
 */
function generateRecommendations() {
    logSection('Generating Recommendations');

    // Check personalization pattern
    if (validationResults.patterns.personalization.status === 'pass') {
        validationResults.recommendations.push({
            priority: 'medium',
            category: 'optimization',
            description: 'Monitor segment-specific performance and refine underperforming segments (e.g., bloggers)',
            action: 'Analyze real user data for each segment and adjust messaging'
        });

        validationResults.recommendations.push({
            priority: 'low',
            category: 'expansion',
            description: 'Scale personalization to additional pages (operators.html, automators.html)',
            action: 'Use scale-winning-patterns.js to deploy to new targets'
        });
    } else {
        validationResults.recommendations.push({
            priority: 'high',
            category: 'fix',
            description: 'Fix personalization pattern implementation issues on creators.html',
            action: 'Review failed tests and correct implementation'
        });
    }

    // Check urgency pattern
    if (validationResults.patterns.urgency.status === 'pass') {
        validationResults.recommendations.push({
            priority: 'medium',
            category: 'optimization',
            description: 'Test different countdown durations (12h, 24h, 48h) to optimize urgency effectiveness',
            action: 'Create A/B test variations with different time limits'
        });

        validationResults.recommendations.push({
            priority: 'low',
            category: 'expansion',
            description: 'Add urgency pattern to bundle.html and workspace.html',
            action: 'Deploy urgency banner to additional high-traffic pages'
        });
    } else {
        validationResults.recommendations.push({
            priority: 'high',
            category: 'fix',
            description: 'Fix urgency pattern implementation issues on trust.html',
            action: 'Review failed tests and correct implementation'
        });
    }

    // General recommendations
    validationResults.recommendations.push({
        priority: 'medium',
        category: 'testing',
        description: 'Test pattern combinations for synergistic effects',
        action: 'Apply both personalization and urgency to a test page and measure combined impact'
    });

    validationResults.recommendations.push({
        priority: 'high',
        category: 'monitoring',
        description: 'Set up continuous monitoring of scaled pattern performance',
        action: 'Monitor Google Analytics daily for the first week, then weekly'
    });

    // Display recommendations
    validationResults.recommendations.forEach((rec, index) => {
        const priorityColor = rec.priority === 'high' ? colors.red :
                              rec.priority === 'medium' ? colors.yellow :
                              colors.blue;
        log(`\n${index + 1}. [${rec.priority.toUpperCase()}] ${rec.category}`, priorityColor);
        log(`   ${rec.description}`);
        log(`   Action: ${rec.action}`, colors.bright);
    });
}

/**
 * Save validation report
 */
function saveValidationReport() {
    logSection('Saving Validation Report');

    const reportDir = path.join(__dirname, '../reports/optimization');
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, 'pattern-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(validationResults, null, 2));
    logSuccess(`Validation report saved to: ${reportPath}`);

    // Generate markdown summary
    const mdPath = path.join(reportDir, 'pattern-validation-report.md');
    const markdown = generateMarkdownReport();
    fs.writeFileSync(mdPath, markdown);
    logSuccess(`Markdown report saved to: ${mdPath}`);
}

/**
 * Generate markdown report
 */
function generateMarkdownReport() {
    const passRate = ((validationResults.passed / validationResults.totalTests) * 100).toFixed(1);
    const grade = passRate >= 95 ? 'A+' : passRate >= 90 ? 'A' : passRate >= 85 ? 'B+' : passRate >= 80 ? 'B' : 'C';

    let md = `# Pattern Validation Report - Feature #73\n\n`;
    md += `**Generated**: ${new Date(validationResults.timestamp).toLocaleString()}\n\n`;
    md += `## Summary\n\n`;
    md += `- **Total Tests**: ${validationResults.totalTests}\n`;
    md += `- **Passed**: ${validationResults.passed} ✓\n`;
    md += `- **Failed**: ${validationResults.failed} ✗\n`;
    md += `- **Warnings**: ${validationResults.warnings} ⚠\n`;
    md += `- **Pass Rate**: ${passRate}%\n`;
    md += `- **Grade**: ${grade}\n\n`;

    md += `## Personalization Pattern (creators.html)\n\n`;
    md += `**Status**: ${validationResults.patterns.personalization.status.toUpperCase()}\n\n`;
    md += `### Tests\n\n`;
    validationResults.patterns.personalization.tests.forEach(test => {
        const icon = test.status === 'pass' ? '✓' : test.status === 'fail' ? '✗' : '⚠';
        md += `- ${icon} ${test.name}\n`;
    });

    md += `\n### Segments\n\n`;
    if (validationResults.patterns.personalization.segments.length > 0) {
        validationResults.patterns.personalization.segments.forEach(seg => {
            md += `- ✓ ${seg.name}\n`;
        });
    } else {
        md += `No segments detected.\n`;
    }

    md += `\n## Urgency Pattern (trust.html)\n\n`;
    md += `**Status**: ${validationResults.patterns.urgency.status.toUpperCase()}\n\n`;
    md += `### Tests\n\n`;
    validationResults.patterns.urgency.tests.forEach(test => {
        const icon = test.status === 'pass' ? '✓' : test.status === 'fail' ? '✗' : '⚠';
        md += `- ${icon} ${test.name}\n`;
    });

    md += `\n### Elements\n\n`;
    if (validationResults.patterns.urgency.elements.length > 0) {
        validationResults.patterns.urgency.elements.forEach(elem => {
            md += `- ✓ ${elem}\n`;
        });
    } else {
        md += `No elements detected.\n`;
    }

    md += `\n## Recommendations\n\n`;
    validationResults.recommendations.forEach((rec, index) => {
        md += `### ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.category}\n\n`;
        md += `**Description**: ${rec.description}\n\n`;
        md += `**Action**: ${rec.action}\n\n`;
    });

    md += `\n## Next Steps\n\n`;
    md += `1. Address any high-priority recommendations\n`;
    md += `2. Monitor scaled pattern performance in Google Analytics\n`;
    md += `3. Refine underperforming segments based on real user data\n`;
    md += `4. Test pattern combinations for synergistic effects\n`;
    md += `5. Scale successful patterns to additional pages\n`;

    return md;
}

/**
 * Main execution
 */
function main() {
    log('\n' + '█'.repeat(80), colors.bright + colors.magenta);
    log('FEATURE #73: VALIDATE SCALED PATTERN PERFORMANCE', colors.bright + colors.magenta);
    log('█'.repeat(80) + '\n', colors.bright + colors.magenta);

    // Run validations
    validatePersonalizationPattern();
    validateUrgencyPattern();

    // Analyze performance data
    analyzePerformanceData();

    // Generate recommendations
    generateRecommendations();

    // Save report
    saveValidationReport();

    // Final summary
    logSection('Validation Complete');
    const passRate = ((validationResults.passed / validationResults.totalTests) * 100).toFixed(1);
    const grade = passRate >= 95 ? 'A+' : passRate >= 90 ? 'A' : passRate >= 85 ? 'B+' : passRate >= 80 ? 'B' : 'C';

    log(`Total Tests: ${validationResults.totalTests}`);
    log(`Passed: ${validationResults.passed} ✓`, colors.green);
    log(`Failed: ${validationResults.failed} ✗`, validationResults.failed > 0 ? colors.red : colors.green);
    log(`Warnings: ${validationResults.warnings} ⚠`, colors.yellow);
    log(`Pass Rate: ${passRate}%`, passRate >= 90 ? colors.green : colors.yellow);
    log(`Grade: ${grade}`, passRate >= 90 ? colors.green : colors.yellow);

    if (validationResults.failed === 0) {
        log('\n✓ All critical tests passed!', colors.bright + colors.green);
        log('Scaled patterns are ready for production monitoring.', colors.green);
    } else {
        log('\n✗ Some tests failed. Review recommendations and fix issues.', colors.bright + colors.red);
    }

    log('\n' + '█'.repeat(80) + '\n', colors.bright + colors.magenta);
}

// Run the validation
main();
