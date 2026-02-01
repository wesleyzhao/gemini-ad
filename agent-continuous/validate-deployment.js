#!/usr/bin/env node

/**
 * Deployment Validation Script
 *
 * Validates that all files are ready for production deployment.
 * Run this before pushing to GitHub Pages.
 *
 * Usage: node validate-deployment.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Validation results
const results = {
    passed: [],
    failed: [],
    warnings: []
};

/**
 * Log helper functions
 */
function logSuccess(message) {
    console.log(`${colors.green}✅ ${message}${colors.reset}`);
    results.passed.push(message);
}

function logError(message) {
    console.log(`${colors.red}❌ ${message}${colors.reset}`);
    results.failed.push(message);
}

function logWarning(message) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
    results.warnings.push(message);
}

function logInfo(message) {
    console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logHeader(message) {
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}${message}${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

/**
 * Read file content
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        return null;
    }
}

/**
 * Validation checks
 */

// 1. Check all 13 main landing pages exist
function validateLandingPages() {
    logHeader('Validating Landing Pages');

    const requiredPages = [
        'pages/index.html',
        'pages/apple-style.html',
        'pages/valentine.html',
        'pages/writers.html',
        'pages/creators.html',
        'pages/operators.html',
        'pages/automators.html',
        'pages/trust.html',
        'pages/workspace.html',
        'pages/research.html',
        'pages/productivity.html',
        'pages/comparison.html',
        'pages/future.html'
    ];

    let allPagesExist = true;

    requiredPages.forEach(page => {
        if (fileExists(page)) {
            logSuccess(`Found: ${page}`);
        } else {
            logError(`Missing: ${page}`);
            allPagesExist = false;
        }
    });

    if (allPagesExist) {
        logSuccess('All 13 main landing pages found');
    } else {
        logError('Some landing pages are missing');
    }

    return allPagesExist;
}

// 2. Check analytics integration
function validateAnalytics() {
    logHeader('Validating Analytics Integration');

    const analyticsFile = 'analytics-integration.js';

    if (!fileExists(analyticsFile)) {
        logError(`Missing: ${analyticsFile}`);
        return false;
    }

    logSuccess(`Found: ${analyticsFile}`);

    const content = readFile(analyticsFile);

    // Check if GA4 ID is configured
    if (content.includes("'G-XXXXXXXXXX'")) {
        logWarning('GA4 Measurement ID not configured (still shows G-XXXXXXXXXX)');
        logInfo('Action required: Update analytics-integration.js line 24 with your GA4 ID');
        logInfo('See DEPLOY-TO-PRODUCTION.md Step 1 for instructions');
    } else if (content.includes("ga4MeasurementId: 'G-")) {
        logSuccess('GA4 Measurement ID configured');
    } else {
        logError('GA4 Measurement ID configuration not found');
        return false;
    }

    // Check if debug mode is appropriate
    if (content.includes('enableDebugMode: true')) {
        logWarning('Debug mode is enabled (recommended to disable for production)');
        logInfo('Consider setting enableDebugMode: false in analytics-integration.js line 32');
    } else if (content.includes('enableDebugMode: false')) {
        logSuccess('Debug mode disabled (production-ready)');
    }

    // Check for required functions
    const requiredFunctions = [
        'initGA4',
        'trackPageView',
        'trackCTAClick',
        'trackScrollDepth'
    ];

    requiredFunctions.forEach(func => {
        if (content.includes(func)) {
            logSuccess(`Analytics function found: ${func}`);
        } else {
            logError(`Analytics function missing: ${func}`);
        }
    });

    return true;
}

// 3. Check quality improvements applied
function validateQualityImprovements() {
    logHeader('Validating Quality Improvements');

    // Check a sample page for quality improvements
    const samplePage = 'pages/apple-style.html';

    if (!fileExists(samplePage)) {
        logError(`Sample page not found: ${samplePage}`);
        return false;
    }

    const content = readFile(samplePage);

    // Check for key quality improvements
    const qualityChecks = [
        { pattern: 'fetchpriority="high"', name: 'Image priority hints' },
        { pattern: 'loading="lazy"', name: 'Lazy loading' },
        { pattern: 'aria-label=', name: 'ARIA labels' },
        { pattern: 'rel="noopener noreferrer"', name: 'Secure external links' },
        { pattern: '<meta name="description"', name: 'Meta description' },
        { pattern: 'og:title', name: 'Open Graph tags' },
        { pattern: 'twitter:card', name: 'Twitter Card tags' }
    ];

    qualityChecks.forEach(check => {
        if (content.includes(check.pattern)) {
            logSuccess(`Quality improvement found: ${check.name}`);
        } else {
            logWarning(`Quality improvement may be missing: ${check.name}`);
        }
    });

    return true;
}

// 4. Check monitoring dashboard
function validateDashboard() {
    logHeader('Validating Monitoring Dashboard');

    const dashboardFile = 'dashboard.html';

    if (!fileExists(dashboardFile)) {
        logError(`Missing: ${dashboardFile}`);
        return false;
    }

    logSuccess(`Found: ${dashboardFile}`);

    const content = readFile(dashboardFile);

    // Check for key dashboard elements
    if (content.includes('$201.96M') || content.includes('201.96')) {
        logSuccess('Revenue target ($201.96M) found in dashboard');
    } else {
        logWarning('Revenue target not found in dashboard');
    }

    if (content.includes('13.41%') || content.includes('13.41')) {
        logSuccess('Conversion rate target (13.41%) found in dashboard');
    } else {
        logWarning('Conversion rate target not found in dashboard');
    }

    return true;
}

// 5. Check documentation files
function validateDocumentation() {
    logHeader('Validating Documentation');

    const requiredDocs = [
        'PRODUCTION-DEPLOYMENT-GUIDE.md',
        'DEPLOY-TO-PRODUCTION.md',
        'revenue-validation-framework.md',
        'FEATURE-90-SUMMARY.md',
        'feature_list.json'
    ];

    let allDocsExist = true;

    requiredDocs.forEach(doc => {
        if (fileExists(doc)) {
            logSuccess(`Found: ${doc}`);
        } else {
            logWarning(`Missing: ${doc} (recommended but not critical)`);
            allDocsExist = false;
        }
    });

    return true; // Documentation is not critical for deployment
}

// 6. Check git repository state
function validateGitState() {
    logHeader('Validating Git Repository');

    // Check if .git directory exists
    if (!fileExists('.git')) {
        logError('Not a git repository');
        return false;
    }

    logSuccess('Git repository found');

    try {
        const { execSync } = require('child_process');

        // Check current branch
        const branch = execSync('git branch --show-current').toString().trim();
        logInfo(`Current branch: ${branch}`);

        if (branch === 'main' || branch === 'master') {
            logSuccess(`On production branch: ${branch}`);
        } else {
            logWarning(`Not on main/master branch (current: ${branch})`);
            logInfo('Consider switching to main branch before deploying');
        }

        // Check if there are uncommitted changes
        const status = execSync('git status --porcelain').toString().trim();
        if (status === '') {
            logSuccess('No uncommitted changes (working tree clean)');
        } else {
            logWarning('There are uncommitted changes');
            logInfo('Commit changes before deploying to production');
        }

        // Check if there are commits ahead of origin
        try {
            const ahead = execSync('git rev-list --count HEAD ^origin/HEAD 2>/dev/null || echo "0"').toString().trim();
            if (ahead === '0') {
                logSuccess('Up to date with remote');
            } else {
                logInfo(`${ahead} commit(s) ahead of origin (ready to push)`);
            }
        } catch (err) {
            // Ignore if origin doesn't exist or can't be checked
            logInfo('Could not check remote status (may not have pushed yet)');
        }

    } catch (err) {
        logWarning('Could not execute git commands (git may not be installed)');
    }

    return true;
}

// 7. Check test results
function validateTests() {
    logHeader('Validating Test Results');

    const testReportFile = 'test-reports-feature-90/test-results.json';

    if (!fileExists(testReportFile)) {
        logWarning('Test results not found (recommended to run tests before deploying)');
        logInfo('Run: node test-feature-90.js');
        return true; // Not critical
    }

    logSuccess(`Found: ${testReportFile}`);

    try {
        const testResults = JSON.parse(readFile(testReportFile));

        if (testResults.totalTests && testResults.passedTests) {
            const passRate = (testResults.passedTests / testResults.totalTests * 100).toFixed(1);

            if (testResults.passedTests === testResults.totalTests) {
                logSuccess(`All tests passing: ${testResults.passedTests}/${testResults.totalTests} (${passRate}%)`);
            } else {
                logWarning(`Some tests failing: ${testResults.passedTests}/${testResults.totalTests} passed (${passRate}%)`);
                logInfo('Consider fixing failing tests before deploying');
            }
        }
    } catch (err) {
        logWarning('Could not parse test results');
    }

    return true;
}

// 8. Check quality scoring results
function validateQualityScores() {
    logHeader('Validating Quality Scores');

    const qualityReportFile = 'quality-scoring-results.json';

    if (!fileExists(qualityReportFile)) {
        logWarning('Quality scores not found (recommended to check quality before deploying)');
        logInfo('Run: node quality-scoring-system.js');
        return true; // Not critical
    }

    logSuccess(`Found: ${qualityReportFile}`);

    try {
        const qualityResults = JSON.parse(readFile(qualityReportFile));

        if (qualityResults.overallScore) {
            const score = qualityResults.overallScore;

            if (score >= 95) {
                logSuccess(`Quality score: ${score}% (meets 95%+ target)`);
            } else if (score >= 90) {
                logWarning(`Quality score: ${score}% (below 95% target, but acceptable)`);
                logInfo('Consider running improvement scripts for higher quality');
            } else {
                logError(`Quality score: ${score}% (below 90%, needs improvement)`);
                logInfo('Run: node apply-targeted-improvements.js');
                return false;
            }
        }
    } catch (err) {
        logWarning('Could not parse quality results');
    }

    return true;
}

/**
 * Main validation function
 */
function runValidation() {
    console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         Gemini Landing Pages - Deployment Validator       ║
║                                                            ║
║         Checking if everything is ready for production    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

    // Run all validation checks
    const checks = [
        { name: 'Landing Pages', func: validateLandingPages, critical: true },
        { name: 'Analytics Integration', func: validateAnalytics, critical: true },
        { name: 'Quality Improvements', func: validateQualityImprovements, critical: false },
        { name: 'Monitoring Dashboard', func: validateDashboard, critical: false },
        { name: 'Documentation', func: validateDocumentation, critical: false },
        { name: 'Git Repository', func: validateGitState, critical: false },
        { name: 'Test Results', func: validateTests, critical: false },
        { name: 'Quality Scores', func: validateQualityScores, critical: false }
    ];

    let allCriticalPassed = true;

    checks.forEach(check => {
        const passed = check.func();
        if (!passed && check.critical) {
            allCriticalPassed = false;
        }
    });

    // Print summary
    logHeader('Validation Summary');

    console.log(`${colors.green}Passed: ${results.passed.length}${colors.reset}`);
    console.log(`${colors.yellow}Warnings: ${results.warnings.length}${colors.reset}`);
    console.log(`${colors.red}Failed: ${results.failed.length}${colors.reset}\n`);

    // Final verdict
    if (allCriticalPassed && results.failed.length === 0) {
        console.log(`${colors.green}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                  ✅ READY FOR DEPLOYMENT!                  ║
║                                                            ║
║  All critical checks passed. You can deploy to production.║
║                                                            ║
║  Next steps:                                               ║
║  1. Make sure GA4 ID is configured (check warnings above) ║
║  2. Run: git push origin main                             ║
║  3. Wait 2-5 minutes for GitHub Pages to rebuild          ║
║  4. Verify deployment at your GitHub Pages URL            ║
║                                                            ║
║  See DEPLOY-TO-PRODUCTION.md for detailed instructions.   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
        process.exit(0);
    } else if (allCriticalPassed && results.failed.length === 0 && results.warnings.length > 0) {
        console.log(`${colors.yellow}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║            ⚠️  READY WITH WARNINGS                         ║
║                                                            ║
║  Critical checks passed, but there are some warnings.     ║
║  You CAN deploy, but consider addressing warnings first.  ║
║                                                            ║
║  Review warnings above, especially:                        ║
║  - GA4 Measurement ID configuration                       ║
║  - Debug mode settings                                    ║
║  - Quality scores                                         ║
║                                                            ║
║  See DEPLOY-TO-PRODUCTION.md for guidance.                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
        process.exit(0);
    } else {
        console.log(`${colors.red}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║               ❌ NOT READY FOR DEPLOYMENT                  ║
║                                                            ║
║  Critical checks failed. Fix the errors above before      ║
║  deploying to production.                                 ║
║                                                            ║
║  Common fixes:                                             ║
║  - Ensure all 13 landing pages exist in pages/ directory  ║
║  - Verify analytics-integration.js exists                 ║
║  - Check quality scores are acceptable                    ║
║                                                            ║
║  After fixing, run this script again:                     ║
║  node validate-deployment.js                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);
        process.exit(1);
    }
}

// Run validation
runValidation();
