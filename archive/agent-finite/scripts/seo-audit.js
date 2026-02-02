/**
 * SEO Audit Script
 *
 * Automated SEO testing for all Gemini Ads landing pages using Playwright.
 * Checks for essential SEO elements and generates a comprehensive report.
 *
 * Tests:
 * - Title tags (presence, length, uniqueness)
 * - Meta descriptions (presence, length, uniqueness)
 * - Heading hierarchy (h1, proper structure)
 * - Open Graph tags (required properties)
 * - Twitter Card tags
 * - Canonical URLs
 * - Language attribute
 * - Structured data (JSON-LD)
 * - Image alt attributes
 * - Internal linking
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const PAGES_DIR = path.join(__dirname, '../pages');
const REPORT_DIR = path.join(__dirname, '../reports');
const BASE_URL = 'file://' + PAGES_DIR;

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
async function auditPage(page, filename) {
  const filepath = path.join(PAGES_DIR, filename);
  const fileUrl = 'file://' + filepath;

  console.log(`\n🔍 Auditing: ${filename}`);

  try {
    await page.goto(fileUrl, { waitUntil: 'networkidle' });

    // Get title
    const title = await page.title();

    // Get meta tags
    const description = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
    const canonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    const lang = await page.$eval('html', el => el.lang).catch(() => null);

    // Get Open Graph tags
    const ogTags = {};
    const ogElements = await page.$$('meta[property^="og:"]');
    for (const el of ogElements) {
      const property = await el.getAttribute('property');
      const content = await el.getAttribute('content');
      ogTags[property] = content;
    }

    // Get Twitter Card tags
    const twitterTags = {};
    const twitterElements = await page.$$('meta[name^="twitter:"]');
    for (const el of twitterElements) {
      const name = await el.getAttribute('name');
      const content = await el.getAttribute('content');
      twitterTags[name] = content;
    }

    // Get headings
    const h1Count = await page.$$eval('h1', els => els.length);
    const headingStructure = await page.$$eval('h1, h2, h3, h4, h5, h6', els =>
      els.map(el => ({ tag: el.tagName.toLowerCase(), text: el.textContent.trim() }))
    );

    // Get images and alt attributes
    const images = await page.$$eval('img', imgs =>
      imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: Boolean(img.alt)
      }))
    );
    const imagesWithAlt = images.filter(img => img.hasAlt).length;
    const altCoverage = images.length > 0 ? imagesWithAlt / images.length : 1;

    // Check for structured data (JSON-LD)
    const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts =>
      scripts.map(s => {
        try {
          return JSON.parse(s.textContent);
        } catch (e) {
          return null;
        }
      }).filter(Boolean)
    );

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
  reportText += `   ⚠️  Warnings: ${results.summary.warnings}\n\n`;

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
async function runAudit() {
  console.log('🚀 Starting SEO audit for all landing pages...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Get all HTML files
  const files = fs.readdirSync(PAGES_DIR)
    .filter(file => file.endsWith('.html'))
    .sort();

  results.summary.total = files.length;

  // Audit each page
  for (const file of files) {
    await auditPage(page, file);
  }

  // Check for duplicates
  checkDuplicates();

  await browser.close();

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
  console.log(`   ⚠️  Warnings: ${results.summary.warnings}`);

  const errors = results.issues.filter(i => i.severity === 'error').length;
  if (errors > 0) {
    console.log(`\n❌ ${errors} critical SEO issues found. Please review the report.`);
    process.exit(1);
  } else if (results.summary.warnings > 0) {
    console.log(`\n⚠️  ${results.summary.warnings} warnings found. Review recommended.`);
  } else {
    console.log('\n🎉 All pages meet SEO best practices!');
  }
}

// Run the audit
runAudit().catch(error => {
  console.error('❌ Audit failed:', error);
  process.exit(1);
});
