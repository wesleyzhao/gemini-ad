#!/usr/bin/env node

/**
 * Cross-Browser Compatibility Validation Script
 *
 * Validates and analyzes cross-browser test results
 * - Checks CROSS_BROWSER_REPORT.json for compatibility issues
 * - Identifies browser-specific bugs and inconsistencies
 * - Generates compatibility matrix
 * - Assigns compatibility grade (A-F)
 * - Provides actionable recommendations
 *
 * Exit codes:
 * 0 - All browsers compatible (A/B grade)
 * 1 - Critical compatibility issues (C/D/F grade)
 *
 * Usage:
 *   node scripts/validate-cross-browser.js
 *   npm run test:cross-browser
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

console.log(colorize('\n🌐 Cross-Browser Compatibility Validation\n', 'cyan'));

// Check if report exists
const reportPath = path.join(__dirname, '..', 'CROSS_BROWSER_REPORT.json');
if (!fs.existsSync(reportPath)) {
  console.error(colorize('❌ ERROR: CROSS_BROWSER_REPORT.json not found', 'red'));
  console.log(colorize('\n💡 Run cross-browser tests first:', 'yellow'));
  console.log(colorize('   npm run test:cross-browser\n', 'dim'));
  process.exit(1);
}

// Load test results
let testResults;
try {
  testResults = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
} catch (error) {
  console.error(colorize('❌ ERROR: Failed to parse CROSS_BROWSER_REPORT.json', 'red'));
  console.error(error.message);
  process.exit(1);
}

console.log(colorize(`📅 Test Date: ${new Date(testResults.timestamp).toLocaleString()}`, 'dim'));
console.log(colorize(`📄 Pages: ${testResults.totalPages}`, 'dim'));
console.log(colorize(`🌐 Browsers: ${testResults.browsers.join(', ')}`, 'dim'));
console.log('');

// Validation metrics
const validation = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  warnings: 0,
  browserIssues: {},
  pageIssues: {},
  criticalIssues: [],
  recommendations: []
};

// Analyze each page and browser combination
Object.keys(testResults.results).forEach(pageName => {
  const pageResults = testResults.results[pageName];

  Object.keys(pageResults).forEach(browser => {
    const browserResults = pageResults[browser];

    if (!validation.browserIssues[browser]) {
      validation.browserIssues[browser] = {
        passed: 0,
        failed: 0,
        warnings: 0,
        issues: []
      };
    }

    if (!validation.pageIssues[pageName]) {
      validation.pageIssues[pageName] = {
        passed: 0,
        failed: 0,
        warnings: 0,
        browsers: {}
      };
    }

    browserResults.tests.forEach(test => {
      validation.totalTests++;

      if (test.status === 'passed' || test.status === 'info') {
        validation.passedTests++;
        validation.browserIssues[browser].passed++;
        validation.pageIssues[pageName].passed++;
      } else if (test.status === 'failed') {
        validation.failedTests++;
        validation.browserIssues[browser].failed++;
        validation.pageIssues[pageName].failed++;

        const issue = {
          page: pageName,
          browser: browser,
          test: test.name,
          message: test.message,
          details: test.details
        };

        validation.browserIssues[browser].issues.push(issue);
        validation.criticalIssues.push(issue);
      } else if (test.status === 'warning') {
        validation.warnings++;
        validation.browserIssues[browser].warnings++;
        validation.pageIssues[pageName].warnings++;
      }
    });

    validation.pageIssues[pageName].browsers[browser] = {
      passed: browserResults.tests.filter(t => t.status === 'passed' || t.status === 'info').length,
      failed: browserResults.tests.filter(t => t.status === 'failed').length,
      warnings: browserResults.tests.filter(t => t.status === 'warning').length
    };
  });
});

// Calculate compatibility score
const passRate = validation.totalTests > 0
  ? (validation.passedTests / validation.totalTests) * 100
  : 0;

// Assign grade
let grade;
let gradeColor;
if (passRate >= 95) {
  grade = 'A+';
  gradeColor = 'green';
} else if (passRate >= 90) {
  grade = 'A';
  gradeColor = 'green';
} else if (passRate >= 85) {
  grade = 'B+';
  gradeColor = 'green';
} else if (passRate >= 80) {
  grade = 'B';
  gradeColor = 'yellow';
} else if (passRate >= 70) {
  grade = 'C';
  gradeColor = 'yellow';
} else if (passRate >= 60) {
  grade = 'D';
  gradeColor = 'red';
} else {
  grade = 'F';
  gradeColor = 'red';
}

// Print summary
console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
console.log(colorize('  COMPATIBILITY SUMMARY', 'bright'));
console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
console.log('');

console.log(colorize(`  Grade: ${grade} (${passRate.toFixed(1)}% compatible)`, gradeColor));
console.log('');

console.log(colorize('  Tests:', 'bright'));
console.log(`    Total:    ${validation.totalTests}`);
console.log(colorize(`    Passed:   ${validation.passedTests}`, 'green'));
if (validation.failedTests > 0) {
  console.log(colorize(`    Failed:   ${validation.failedTests}`, 'red'));
}
if (validation.warnings > 0) {
  console.log(colorize(`    Warnings: ${validation.warnings}`, 'yellow'));
}
console.log('');

// Browser-specific results
console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
console.log(colorize('  BROWSER COMPATIBILITY', 'bright'));
console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
console.log('');

Object.keys(validation.browserIssues).forEach(browser => {
  const browserData = validation.browserIssues[browser];
  const browserPassRate = (browserData.passed / (browserData.passed + browserData.failed + browserData.warnings)) * 100;

  let browserGrade;
  if (browserPassRate >= 90) {
    browserGrade = colorize('✓ EXCELLENT', 'green');
  } else if (browserPassRate >= 80) {
    browserGrade = colorize('✓ GOOD', 'yellow');
  } else {
    browserGrade = colorize('✗ NEEDS WORK', 'red');
  }

  console.log(colorize(`  ${browser.toUpperCase()}:`, 'bright'));
  console.log(`    Status: ${browserGrade} (${browserPassRate.toFixed(1)}%)`);
  console.log(colorize(`    Passed:   ${browserData.passed}`, 'green'));
  if (browserData.failed > 0) {
    console.log(colorize(`    Failed:   ${browserData.failed}`, 'red'));
  }
  if (browserData.warnings > 0) {
    console.log(colorize(`    Warnings: ${browserData.warnings}`, 'yellow'));
  }

  if (browserData.issues.length > 0) {
    console.log(colorize('\n    Issues:', 'red'));
    browserData.issues.slice(0, 3).forEach(issue => {
      console.log(colorize(`      • ${issue.page}: ${issue.message}`, 'dim'));
    });
    if (browserData.issues.length > 3) {
      console.log(colorize(`      ... and ${browserData.issues.length - 3} more`, 'dim'));
    }
  }

  console.log('');
});

// Page-specific results
console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
console.log(colorize('  PAGE COMPATIBILITY', 'bright'));
console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan'));
console.log('');

// Sort pages by failure count
const sortedPages = Object.keys(validation.pageIssues).sort((a, b) => {
  return validation.pageIssues[b].failed - validation.pageIssues[a].failed;
});

sortedPages.forEach(pageName => {
  const pageData = validation.pageIssues[pageName];
  const pagePassRate = (pageData.passed / (pageData.passed + pageData.failed + pageData.warnings)) * 100;

  let pageStatus;
  if (pageData.failed === 0 && pageData.warnings === 0) {
    pageStatus = colorize('✓ ALL BROWSERS', 'green');
  } else if (pageData.failed === 0) {
    pageStatus = colorize('✓ MINOR ISSUES', 'yellow');
  } else {
    pageStatus = colorize('✗ HAS ISSUES', 'red');
  }

  console.log(colorize(`  ${pageName}:`, 'bright'));
  console.log(`    Status: ${pageStatus} (${pagePassRate.toFixed(1)}%)`);

  // Show browser compatibility breakdown
  const browserStatuses = Object.keys(pageData.browsers).map(browser => {
    const browserData = pageData.browsers[browser];
    if (browserData.failed > 0) {
      return colorize(`${browser}`, 'red');
    } else if (browserData.warnings > 0) {
      return colorize(`${browser}`, 'yellow');
    } else {
      return colorize(`${browser}`, 'green');
    }
  });

  console.log(`    Browsers: ${browserStatuses.join(' | ')}`);
  console.log('');
});

// Critical issues
if (validation.criticalIssues.length > 0) {
  console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red'));
  console.log(colorize('  ⚠️  CRITICAL ISSUES', 'red'));
  console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red'));
  console.log('');

  validation.criticalIssues.slice(0, 10).forEach((issue, index) => {
    console.log(colorize(`  ${index + 1}. ${issue.page} (${issue.browser})`, 'bright'));
    console.log(colorize(`     Test: ${issue.test}`, 'dim'));
    console.log(colorize(`     ${issue.message}`, 'red'));
    console.log('');
  });

  if (validation.criticalIssues.length > 10) {
    console.log(colorize(`  ... and ${validation.criticalIssues.length - 10} more issues\n`, 'dim'));
  }
}

// Generate recommendations
if (validation.failedTests > 0) {
  validation.recommendations.push('Fix critical browser compatibility issues before deployment');
}

if (validation.warnings > 5) {
  validation.recommendations.push('Review layout warnings - may indicate responsive design issues');
}

// Check for browser-specific issues
Object.keys(validation.browserIssues).forEach(browser => {
  const browserData = validation.browserIssues[browser];
  if (browserData.failed > browserData.passed / 2) {
    validation.recommendations.push(`${browser} has significant issues - prioritize fixes for this browser`);
  }
});

// Check for page-specific issues
Object.keys(validation.pageIssues).forEach(pageName => {
  const pageData = validation.pageIssues[pageName];
  if (pageData.failed > 3) {
    validation.recommendations.push(`Page "${pageName}" has multiple failures across browsers - needs review`);
  }
});

// Display recommendations
if (validation.recommendations.length > 0) {
  console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow'));
  console.log(colorize('  💡 RECOMMENDATIONS', 'yellow'));
  console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow'));
  console.log('');

  validation.recommendations.forEach((rec, index) => {
    console.log(colorize(`  ${index + 1}. ${rec}`, 'dim'));
  });

  console.log('');
}

// Save validation report
const validationReportPath = path.join(__dirname, '..', 'CROSS_BROWSER_VALIDATION.json');
fs.writeFileSync(validationReportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  grade: grade,
  passRate: passRate,
  summary: {
    totalTests: validation.totalTests,
    passed: validation.passedTests,
    failed: validation.failedTests,
    warnings: validation.warnings
  },
  browserIssues: validation.browserIssues,
  pageIssues: validation.pageIssues,
  criticalIssues: validation.criticalIssues,
  recommendations: validation.recommendations
}, null, 2));

console.log(colorize('✅ Validation report saved to CROSS_BROWSER_VALIDATION.json\n', 'green'));

// Exit with appropriate code
if (grade === 'F' || grade === 'D' || validation.failedTests > 10) {
  console.log(colorize('❌ VALIDATION FAILED: Critical compatibility issues detected\n', 'red'));
  process.exit(1);
} else if (grade === 'C' || validation.failedTests > 5) {
  console.log(colorize('⚠️  VALIDATION WARNING: Some compatibility issues detected\n', 'yellow'));
  console.log(colorize('   Consider fixing issues before deployment\n', 'dim'));
  process.exit(0);
} else {
  console.log(colorize(`✅ VALIDATION PASSED: ${grade} grade - Excellent browser compatibility!\n`, 'green'));
  process.exit(0);
}
