/**
 * Accessibility Audit Script
 *
 * Audits all landing pages for WCAG 2.1 Level AA compliance by analyzing HTML directly.
 * Checks for:
 * - ARIA labels and roles
 * - Alt text for images
 * - Form labels
 * - Heading hierarchy
 * - Semantic HTML
 * - Lang attribute
 * - Page titles
 * - Keyboard accessibility attributes
 * - Link text
 * - Button text
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Get all HTML pages
const pagesDir = path.join(__dirname, '..', 'pages');
const pages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(pagesDir, file));

// Audit results
const results = {
  totalPages: pages.length,
  pagesWithIssues: 0,
  totalIssues: 0,
  issuesByType: {},
  issuesBySeverity: {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  },
  pageResults: [],
};

// Issue severity levels
const SEVERITY = {
  CRITICAL: 'critical',
  SERIOUS: 'serious',
  MODERATE: 'moderate',
  MINOR: 'minor',
};

function logIssue(severity, type, message, element = null) {
  const issue = {
    severity,
    type,
    message,
    element: element ? element.outerHTML.substring(0, 200) : null,
  };

  return issue;
}

function auditPage(filePath) {
  const filename = path.basename(filePath);
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const pageIssues = [];

  console.log(`\n${colors.cyan}Auditing: ${filename}${colors.reset}`);

  // 1. Check for lang attribute on html element
  const htmlEl = document.querySelector('html');
  if (!htmlEl || !htmlEl.getAttribute('lang')) {
    pageIssues.push(logIssue(
      SEVERITY.SERIOUS,
      'missing-lang',
      'HTML element missing lang attribute for screen readers',
      htmlEl
    ));
  }

  // 2. Check for page title
  const title = document.querySelector('title');
  if (!title || !title.textContent.trim()) {
    pageIssues.push(logIssue(
      SEVERITY.SERIOUS,
      'missing-title',
      'Page missing descriptive title',
      title
    ));
  } else if (title.textContent.trim() === 'Document') {
    pageIssues.push(logIssue(
      SEVERITY.MODERATE,
      'generic-title',
      'Page has generic title "Document"',
      title
    ));
  }

  // 3. Check heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const h1s = document.querySelectorAll('h1');

  if (h1s.length === 0) {
    pageIssues.push(logIssue(
      SEVERITY.SERIOUS,
      'missing-h1',
      'Page missing h1 heading',
    ));
  } else if (h1s.length > 1) {
    pageIssues.push(logIssue(
      SEVERITY.MODERATE,
      'multiple-h1',
      `Page has ${h1s.length} h1 headings (should have exactly 1)`,
    ));
  }

  // Check for skipped heading levels
  const headingLevels = headings.map(h => parseInt(h.tagName.substring(1)));
  for (let i = 1; i < headingLevels.length; i++) {
    const diff = headingLevels[i] - headingLevels[i - 1];
    if (diff > 1) {
      pageIssues.push(logIssue(
        SEVERITY.MODERATE,
        'skipped-heading-level',
        `Heading hierarchy skips from h${headingLevels[i - 1]} to h${headingLevels[i]}`,
        headings[i]
      ));
    }
  }

  // 4. Check images for alt text
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const role = img.getAttribute('role');

    if (!alt && !ariaLabel && role !== 'presentation' && role !== 'none') {
      pageIssues.push(logIssue(
        SEVERITY.SERIOUS,
        'missing-alt-text',
        'Image missing alt text, aria-label, or role="presentation"',
        img
      ));
    }
  });

  // 5. Check buttons for accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');

    if (!text && !ariaLabel && !ariaLabelledby) {
      pageIssues.push(logIssue(
        SEVERITY.SERIOUS,
        'button-no-accessible-name',
        'Button has no accessible name (no text, aria-label, or aria-labelledby)',
        button
      ));
    }
  });

  // 6. Check links for accessible names
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledby = link.getAttribute('aria-labelledby');

    if (!text && !ariaLabel && !ariaLabelledby) {
      pageIssues.push(logIssue(
        SEVERITY.SERIOUS,
        'link-no-accessible-name',
        'Link has no accessible name',
        link
      ));
    } else if (text && (text.toLowerCase() === 'click here' || text.toLowerCase() === 'read more' || text.toLowerCase() === 'here')) {
      pageIssues.push(logIssue(
        SEVERITY.MINOR,
        'non-descriptive-link-text',
        `Link has non-descriptive text: "${text}"`,
        link
      ));
    }
  });

  // 7. Check form inputs for labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const type = input.getAttribute('type');

    // Skip hidden and submit inputs
    if (type === 'hidden' || type === 'submit' || type === 'button') {
      return;
    }

    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');

    let hasLabel = false;

    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        hasLabel = true;
      }
    }

    if (!hasLabel && !ariaLabel && !ariaLabelledby) {
      pageIssues.push(logIssue(
        SEVERITY.SERIOUS,
        'input-no-label',
        `Form input has no associated label (id="${id || 'none'}")`,
        input
      ));
    }
  });

  // 8. Check for main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    pageIssues.push(logIssue(
      SEVERITY.SERIOUS,
      'missing-main-landmark',
      'Page missing main landmark region',
    ));
  } else if (mainLandmarks.length > 1) {
    pageIssues.push(logIssue(
      SEVERITY.MODERATE,
      'multiple-main-landmarks',
      `Page has ${mainLandmarks.length} main landmarks (should have 1)`,
    ));
  }

  // 9. Check navigation landmarks for labels
  const navs = document.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((nav) => {
      const ariaLabel = nav.getAttribute('aria-label');
      const ariaLabelledby = nav.getAttribute('aria-labelledby');

      if (!ariaLabel && !ariaLabelledby) {
        pageIssues.push(logIssue(
          SEVERITY.MODERATE,
          'nav-no-label',
          'Multiple navigation landmarks should have aria-label to distinguish them',
          nav
        ));
      }
    });
  }

  // 10. Check for aria-hidden on interactive elements
  const ariaHiddenElements = document.querySelectorAll('[aria-hidden="true"]');
  ariaHiddenElements.forEach((el) => {
    const interactiveChildren = el.querySelectorAll('button, a, input, textarea, select, [tabindex]');
    if (interactiveChildren.length > 0) {
      pageIssues.push(logIssue(
        SEVERITY.CRITICAL,
        'aria-hidden-with-interactive',
        `Element with aria-hidden="true" contains ${interactiveChildren.length} interactive elements`,
        el
      ));
    }
  });

  // 11. Check for positive tabindex values (anti-pattern)
  const positiveTabindexElements = document.querySelectorAll('[tabindex]');
  positiveTabindexElements.forEach((el) => {
    const tabindex = parseInt(el.getAttribute('tabindex'));
    if (tabindex > 0) {
      pageIssues.push(logIssue(
        SEVERITY.MODERATE,
        'positive-tabindex',
        `Element has positive tabindex="${tabindex}" (anti-pattern, use 0 or -1)`,
        el
      ));
    }
  });

  // 12. Check for meta viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    pageIssues.push(logIssue(
      SEVERITY.MODERATE,
      'missing-viewport',
      'Missing viewport meta tag for responsive design',
    ));
  } else {
    const content = viewport.getAttribute('content') || '';
    if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
      pageIssues.push(logIssue(
        SEVERITY.SERIOUS,
        'viewport-zoom-disabled',
        'Viewport disables zoom (accessibility issue)',
        viewport
      ));
    }
  }

  // 13. Check for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  let hasSkipToMain = false;
  skipLinks.forEach((link) => {
    const text = link.textContent.toLowerCase();
    if (text.includes('skip') && (text.includes('main') || text.includes('content'))) {
      hasSkipToMain = true;
    }
  });

  if (!hasSkipToMain) {
    pageIssues.push(logIssue(
      SEVERITY.MINOR,
      'missing-skip-link',
      'Page should have a "skip to main content" link for keyboard users',
    ));
  }

  // Count issues by severity
  const issueCountBySeverity = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };

  pageIssues.forEach((issue) => {
    issueCountBySeverity[issue.severity]++;
    results.issuesByType[issue.type] = (results.issuesByType[issue.type] || 0) + 1;
    results.issuesBySeverity[issue.severity]++;
  });

  // Print page summary
  if (pageIssues.length === 0) {
    console.log(`  ${colors.green}✓ No issues found${colors.reset}`);
  } else {
    results.pagesWithIssues++;
    console.log(`  ${colors.red}✗ Found ${pageIssues.length} issues${colors.reset}`);
    console.log(`    Critical: ${issueCountBySeverity.critical}, Serious: ${issueCountBySeverity.serious}, Moderate: ${issueCountBySeverity.moderate}, Minor: ${issueCountBySeverity.minor}`);
  }

  results.totalIssues += pageIssues.length;

  return {
    filename,
    path: filePath,
    issueCount: pageIssues.length,
    issues: pageIssues,
    issuesBySeverity: issueCountBySeverity,
  };
}

// Main execution
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`${colors.bright}ACCESSIBILITY AUDIT${colors.reset}`);
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`Auditing ${pages.length} pages for WCAG 2.1 Level AA compliance...\n`);

// Audit all pages
pages.forEach((page) => {
  const pageResult = auditPage(page);
  results.pageResults.push(pageResult);
});

// Sort pages by issue count
results.pageResults.sort((a, b) => b.issueCount - a.issueCount);

// Print summary
console.log(`\n${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`${colors.bright}SUMMARY${colors.reset}`);
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`Total Pages: ${results.totalPages}`);
console.log(`Pages with Issues: ${colors.red}${results.pagesWithIssues}${colors.reset}`);
console.log(`Total Issues: ${colors.red}${results.totalIssues}${colors.reset}`);
console.log(`\nIssues by Severity:`);
console.log(`  ${colors.red}Critical: ${results.issuesBySeverity.critical}${colors.reset}`);
console.log(`  ${colors.red}Serious: ${results.issuesBySeverity.serious}${colors.reset}`);
console.log(`  ${colors.yellow}Moderate: ${results.issuesBySeverity.moderate}${colors.reset}`);
console.log(`  ${colors.yellow}Minor: ${results.issuesBySeverity.minor}${colors.reset}`);

if (Object.keys(results.issuesByType).length > 0) {
  console.log(`\nTop Issues:`);
  const sortedIssues = Object.entries(results.issuesByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedIssues.forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
}

// Save detailed results
const resultsDir = path.join(__dirname, '..', 'test-results', 'accessibility');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

const resultsPath = path.join(resultsDir, 'audit-results.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

// Generate detailed text report
let detailedReport = '';
detailedReport += '='.repeat(80) + '\n';
detailedReport += 'ACCESSIBILITY AUDIT - DETAILED REPORT\n';
detailedReport += '='.repeat(80) + '\n\n';
detailedReport += `Generated: ${new Date().toISOString()}\n`;
detailedReport += `Total Pages: ${results.totalPages}\n`;
detailedReport += `Pages with Issues: ${results.pagesWithIssues}\n`;
detailedReport += `Total Issues: ${results.totalIssues}\n\n`;

detailedReport += 'ISSUES BY SEVERITY\n';
detailedReport += '-'.repeat(80) + '\n';
detailedReport += `Critical: ${results.issuesBySeverity.critical}\n`;
detailedReport += `Serious: ${results.issuesBySeverity.serious}\n`;
detailedReport += `Moderate: ${results.issuesBySeverity.moderate}\n`;
detailedReport += `Minor: ${results.issuesBySeverity.minor}\n\n`;

detailedReport += 'ISSUES BY TYPE\n';
detailedReport += '-'.repeat(80) + '\n';
Object.entries(results.issuesByType)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    detailedReport += `${type}: ${count}\n`;
  });
detailedReport += '\n';

detailedReport += 'PAGE-BY-PAGE RESULTS\n';
detailedReport += '-'.repeat(80) + '\n\n';

results.pageResults.forEach((pageResult) => {
  detailedReport += `${pageResult.filename}\n`;
  detailedReport += `  Total Issues: ${pageResult.issueCount}\n`;
  detailedReport += `  Critical: ${pageResult.issuesBySeverity.critical}, Serious: ${pageResult.issuesBySeverity.serious}, Moderate: ${pageResult.issuesBySeverity.moderate}, Minor: ${pageResult.issuesBySeverity.minor}\n`;

  if (pageResult.issues.length > 0) {
    detailedReport += '  Issues:\n';
    pageResult.issues.forEach((issue, idx) => {
      detailedReport += `    ${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.type}\n`;
      detailedReport += `       ${issue.message}\n`;
      if (issue.element) {
        detailedReport += `       Element: ${issue.element}\n`;
      }
    });
  }

  detailedReport += '\n';
});

detailedReport += '='.repeat(80) + '\n';

const reportPath = path.join(resultsDir, 'audit-report.txt');
fs.writeFileSync(reportPath, detailedReport);

console.log(`\nDetailed reports saved to:`);
console.log(`  ${resultsPath}`);
console.log(`  ${reportPath}`);
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}\n`);

// Exit with error code if there are critical or serious issues
if (results.issuesBySeverity.critical > 0 || results.issuesBySeverity.serious > 0) {
  console.log(`${colors.red}Audit failed: Found ${results.issuesBySeverity.critical} critical and ${results.issuesBySeverity.serious} serious issues${colors.reset}`);
  process.exit(1);
} else {
  console.log(`${colors.green}Audit passed: No critical or serious issues found${colors.reset}`);
  process.exit(0);
}
