/**
 * Simple SEO Audit Script (No Playwright Required)
 *
 * Uses JSDOM to audit all landing pages for SEO compliance.
 * Checks meta tags, Open Graph, Twitter Cards, structured data, and more.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const PAGES_DIR = path.join(__dirname, '../pages');
const REPORT_DIR = path.join(__dirname, '../reports');

// SEO best practices thresholds
const THRESHOLDS = {
  title: { min: 30, max: 60, ideal: 55 },
  description: { min: 120, max: 160, ideal: 155 },
  h1Count: { min: 1, max: 1 },
  imageAltCoverage: 0.9, // 90% of images should have alt text
};

// Test results
const results = {
  pages: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: 0,
    warnings: 0,
  },
  issues: [],
};

/**
 * Check if title tag meets SEO best practices
 */
function checkTitle(title, page) {
  const issues = [];
  const length = title ? title.length : 0;

  if (!title) {
    issues.push({ severity: 'error', message: 'Missing title tag', page });
  } else if (length < THRESHOLDS.title.min) {
    issues.push({ severity: 'warning', message: `Title too short (${length} chars, recommended: ${THRESHOLDS.title.min}-${THRESHOLDS.title.max})`, page });
  } else if (length > THRESHOLDS.title.max) {
    issues.push({ severity: 'warning', message: `Title too long (${length} chars, recommended: ${THRESHOLDS.title.min}-${THRESHOLDS.title.max})`, page });
  }

  return { passed: issues.length === 0, issues, value: title, length };
}

/**
 * Check if meta description meets SEO best practices
 */
function checkDescription(description, page) {
  const issues = [];
  const length = description ? description.length : 0;

  if (!description) {
    issues.push({ severity: 'error', message: 'Missing meta description', page });
  } else if (length < THRESHOLDS.description.min) {
    issues.push({ severity: 'warning', message: `Description too short (${length} chars, recommended: ${THRESHOLDS.description.min}-${THRESHOLDS.description.max})`, page });
  } else if (length > THRESHOLDS.description.max) {
    issues.push({ severity: 'warning', message: `Description too long (${length} chars, recommended: ${THRESHOLDS.description.min}-${THRESHOLDS.description.max})`, page });
  }

  return { passed: issues.length === 0, issues, value: description, length };
}

/**
 * Check heading hierarchy
 */
function checkHeadings(h1Count, headingStructure, page) {
  const issues = [];

  if (h1Count === 0) {
    issues.push({ severity: 'error', message: 'Missing h1 tag', page });
  } else if (h1Count > 1) {
    issues.push({ severity: 'warning', message: `Multiple h1 tags found (${h1Count}, recommended: 1)`, page });
  }

  return { passed: issues.length === 0, issues, h1Count, structure: headingStructure };
}

/**
 * Check Open Graph tags
 */
function checkOpenGraph(ogTags, page) {
  const issues = [];
  const required = ['og:title', 'og:description', 'og:url', 'og:type', 'og:image'];

  required.forEach(prop => {
    if (!ogTags[prop]) {
      issues.push({ severity: 'error', message: `Missing Open Graph tag: ${prop}`, page });
    }
  });

  return { passed: issues.length === 0, issues, tags: ogTags };
}

/**
 * Check Twitter Card tags
 */
function checkTwitterCard(twitterTags, page) {
  const issues = [];
  const required = ['twitter:card', 'twitter:title', 'twitter:description'];

  required.forEach(prop => {
    if (!twitterTags[prop]) {
      issues.push({ severity: 'error', message: `Missing Twitter Card tag: ${prop}`, page });
    }
  });

  return { passed: issues.length === 0, issues, tags: twitterTags };
}

/**
 * Audit a single page
 */
function auditPage(filename) {
  const filepath = path.join(PAGES_DIR, filename);

  console.log(`\n🔍 Auditing: ${filename}`);

  try {
    // Read the HTML file
    const html = fs.readFileSync(filepath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Get title
    const titleElement = document.querySelector('title');
    const title = titleElement ? titleElement.textContent : null;

    // Get meta tags
    const descriptionElement = document.querySelector('meta[name="description"]');
    const description = descriptionElement ? descriptionElement.getAttribute('content') : null;

    const canonicalElement = document.querySelector('link[rel="canonical"]');
    const canonical = canonicalElement ? canonicalElement.getAttribute('href') : null;

    const langElement = document.querySelector('html');
    const lang = langElement ? langElement.getAttribute('lang') : null;

    // Get Open Graph tags
    const ogTags = {};
    const ogElements = document.querySelectorAll('meta[property^="og:"]');
    ogElements.forEach(el => {
      const property = el.getAttribute('property');
      const content = el.getAttribute('content');
      ogTags[property] = content;
    });

    // Get Twitter Card tags
    const twitterTags = {};
    const twitterElements = document.querySelectorAll('meta[name^="twitter:"]');
    twitterElements.forEach(el => {
      const name = el.getAttribute('name');
      const content = el.getAttribute('content');
      twitterTags[name] = content;
    });

    // Get headings
    const h1Elements = document.querySelectorAll('h1');
    const h1Count = h1Elements.length;
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingStructure = Array.from(headingElements).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent.trim().substring(0, 50)
    }));

    // Get images and alt attributes
    const imageElements = document.querySelectorAll('img');
    const images = Array.from(imageElements).map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt'),
      hasAlt: Boolean(img.getAttribute('alt'))
    }));
    const imagesWithAlt = images.filter(img => img.hasAlt).length;
    const altCoverage = images.length > 0 ? imagesWithAlt / images.length : 1;

    // Check for structured data (JSON-LD)
    const structuredDataElements = document.querySelectorAll('script[type="application/ld+json"]');
    const structuredData = Array.from(structuredDataElements).map(s => {
      try {
        return JSON.parse(s.textContent);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    // Run checks
    const titleCheck = checkTitle(title, filename);
    const descriptionCheck = checkDescription(description, filename);
    const headingsCheck = checkHeadings(h1Count, headingStructure, filename);
    const ogCheck = checkOpenGraph(ogTags, filename);
    const twitterCheck = checkTwitterCard(twitterTags, filename);

    // Additional checks
    const langCheck = lang ? { passed: true, issues: [] } : {
      passed: false,
      issues: [{ severity: 'error', message: 'Missing lang attribute on <html>', page: filename }]
    };

    const canonicalCheck = canonical ? { passed: true, issues: [] } : {
      passed: false,
      issues: [{ severity: 'warning', message: 'Missing canonical URL', page: filename }]
    };

    const altCheck = altCoverage >= THRESHOLDS.imageAltCoverage ? { passed: true, issues: [] } : {
      passed: false,
      issues: [{ severity: 'warning', message: `Low alt text coverage (${Math.round(altCoverage * 100)}%, recommended: ${THRESHOLDS.imageAltCoverage * 100}%)`, page: filename }]
    };

    const structuredDataCheck = structuredData.length > 0 ? { passed: true, issues: [] } : {
      passed: false,
      issues: [{ severity: 'warning', message: 'Missing structured data (JSON-LD)', page: filename }]
    };

    // Collect all issues
    const allIssues = [
      ...titleCheck.issues,
      ...descriptionCheck.issues,
      ...headingsCheck.issues,
      ...ogCheck.issues,
      ...twitterCheck.issues,
      ...langCheck.issues,
      ...canonicalCheck.issues,
      ...altCheck.issues,
      ...structuredDataCheck.issues,
    ];

    const pageResult = {
      filename,
      passed: allIssues.filter(i => i.severity === 'error').length === 0,
      issues: allIssues,
      checks: {
        title: titleCheck,
        description: descriptionCheck,
        headings: headingsCheck,
        openGraph: ogCheck,
        twitterCard: twitterCheck,
        lang: langCheck,
        canonical: canonicalCheck,
        altText: altCheck,
        structuredData: structuredDataCheck,
      },
      stats: {
        totalIssues: allIssues.length,
        errors: allIssues.filter(i => i.severity === 'error').length,
        warnings: allIssues.filter(i => i.severity === 'warning').length,
        imageCount: images.length,
        imagesWithAlt,
        altCoverage: Math.round(altCoverage * 100),
        structuredDataCount: structuredData.length,
      }
    };

    results.pages.push(pageResult);
    results.issues.push(...allIssues);

    // Update summary
    if (pageResult.passed) {
      results.summary.passed++;
      console.log(`   ✅ PASSED (${pageResult.stats.warnings} warnings)`);
    } else {
      results.summary.failed++;
      console.log(`   ❌ FAILED (${pageResult.stats.errors} errors, ${pageResult.stats.warnings} warnings)`);
    }
    results.summary.errors += pageResult.stats.errors;
    results.summary.warnings += pageResult.stats.warnings;

  } catch (error) {
    console.error(`   ❌ Error auditing ${filename}:`, error.message);
    results.summary.failed++;
    results.issues.push({
      severity: 'error',
      message: `Failed to audit page: ${error.message}`,
      page: filename
    });
  }
}

/**
 * Check for duplicate titles and descriptions
 */
function checkDuplicates() {
  console.log('\n🔍 Checking for duplicate titles and descriptions...');

  const titles = {};
  const descriptions = {};

  results.pages.forEach(page => {
    const title = page.checks.title.value;
    const description = page.checks.description.value;

    if (title) {
      if (!titles[title]) titles[title] = [];
      titles[title].push(page.filename);
    }

    if (description) {
      if (!descriptions[description]) descriptions[description] = [];
      descriptions[description].push(page.filename);
    }
  });

  // Find duplicates
  Object.entries(titles).forEach(([title, pages]) => {
    if (pages.length > 1) {
      console.log(`   ⚠️  Duplicate title found in: ${pages.join(', ')}`);
      results.issues.push({
        severity: 'warning',
        message: `Duplicate title: "${title}"`,
        pages: pages
      });
      results.summary.warnings++;
    }
  });

  Object.entries(descriptions).forEach(([desc, pages]) => {
    if (pages.length > 1) {
      console.log(`   ⚠️  Duplicate description found in: ${pages.join(', ')}`);
      results.issues.push({
        severity: 'warning',
        message: `Duplicate description: "${desc.substring(0, 50)}..."`,
        pages: pages
      });
      results.summary.warnings++;
    }
  });
}

/**
 * Generate audit report
 */
function generateReport() {
  // Ensure reports directory exists
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  // Generate JSON report
  const jsonReport = path.join(REPORT_DIR, 'seo-audit.json');
  fs.writeFileSync(jsonReport, JSON.stringify(results, null, 2));

  // Generate text report
  const textReport = path.join(REPORT_DIR, 'seo-audit.txt');
  let reportText = '═══════════════════════════════════════════════════════════\n';
  reportText += '                    SEO AUDIT REPORT                        \n';
  reportText += '═══════════════════════════════════════════════════════════\n\n';

  reportText += `📊 Summary:\n`;
  reportText += `   Total Pages: ${results.summary.total}\n`;
  reportText += `   ✅ Passed: ${results.summary.passed}\n`;
  reportText += `   ❌ Failed: ${results.summary.failed}\n`;
  reportText += `   ⚠️  Total Errors: ${results.summary.errors}\n`;
  reportText += `   ⚠️  Total Warnings: ${results.summary.warnings}\n\n`;

  reportText += '───────────────────────────────────────────────────────────\n\n';

  // Group issues by severity
  const errors = results.issues.filter(i => i.severity === 'error');
  const warnings = results.issues.filter(i => i.severity === 'warning');

  if (errors.length > 0) {
    reportText += `❌ ERRORS (${errors.length}):\n\n`;
    errors.forEach(issue => {
      reportText += `   • ${issue.page || issue.pages?.join(', ')}: ${issue.message}\n`;
    });
    reportText += '\n';
  }

  if (warnings.length > 0) {
    reportText += `⚠️  WARNINGS (${warnings.length}):\n\n`;
    warnings.forEach(issue => {
      reportText += `   • ${issue.page || issue.pages?.join(', ')}: ${issue.message}\n`;
    });
    reportText += '\n';
  }

  if (errors.length === 0 && warnings.length === 0) {
    reportText += '🎉 No issues found! All pages meet SEO best practices.\n\n';
  }

  reportText += '───────────────────────────────────────────────────────────\n\n';

  // Page details
  reportText += 'PAGE DETAILS:\n\n';
  results.pages.forEach(page => {
    const status = page.passed ? '✅' : '❌';
    reportText += `${status} ${page.filename}\n`;
    reportText += `   Title: ${page.checks.title.value || 'N/A'} (${page.checks.title.length || 0} chars)\n`;
    reportText += `   Description: ${page.checks.description.length || 0} chars\n`;
    reportText += `   H1 count: ${page.checks.headings.h1Count}\n`;
    reportText += `   Images with alt: ${page.stats.imagesWithAlt}/${page.stats.imageCount} (${page.stats.altCoverage}%)\n`;
    reportText += `   Structured data: ${page.stats.structuredDataCount > 0 ? 'Yes' : 'No'}\n`;
    reportText += `   Open Graph: ${Object.keys(page.checks.openGraph.tags).length} tags\n`;
    reportText += `   Twitter Card: ${Object.keys(page.checks.twitterCard.tags).length} tags\n`;
    reportText += `   Canonical: ${page.checks.canonical.passed ? 'Yes' : 'No'}\n`;
    reportText += `   Lang attribute: ${page.checks.lang.passed ? 'Yes' : 'No'}\n`;
    reportText += `   Issues: ${page.stats.errors} errors, ${page.stats.warnings} warnings\n\n`;
  });

  reportText += '═══════════════════════════════════════════════════════════\n';
  reportText += `Report generated: ${new Date().toISOString()}\n`;
  reportText += '═══════════════════════════════════════════════════════════\n';

  fs.writeFileSync(textReport, reportText);

  console.log(`\n📄 Reports generated:`);
  console.log(`   JSON: ${jsonReport}`);
  console.log(`   Text: ${textReport}`);
}

/**
 * Run SEO audit on all pages
 */
function runAudit() {
  console.log('🚀 Starting SEO audit for all landing pages...');

  // Get all HTML files
  const files = fs.readdirSync(PAGES_DIR)
    .filter(file => file.endsWith('.html'))
    .sort();

  results.summary.total = files.length;

  // Audit each page
  files.forEach(file => {
    auditPage(file);
  });

  // Check for duplicates
  checkDuplicates();

  // Generate report
  generateReport();

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    SEO AUDIT COMPLETE                      ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📊 Summary:`);
  console.log(`   Total Pages: ${results.summary.total}`);
  console.log(`   ✅ Passed: ${results.summary.passed}`);
  console.log(`   ❌ Failed: ${results.summary.failed}`);
  console.log(`   📛 Errors: ${results.summary.errors}`);
  console.log(`   ⚠️  Warnings: ${results.summary.warnings}`);

  if (results.summary.errors > 0) {
    console.log(`\n❌ ${results.summary.errors} critical SEO issues found. Please review the report.`);
    process.exit(1);
  } else if (results.summary.warnings > 0) {
    console.log(`\n⚠️  ${results.summary.warnings} warnings found. Review recommended.`);
  } else {
    console.log('\n🎉 All pages meet SEO best practices!');
  }
}

// Run the audit
runAudit();
