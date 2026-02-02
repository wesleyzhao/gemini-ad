#!/usr/bin/env node

/**
 * Performance Audit Script
 *
 * Runs Lighthouse audits on all landing pages and generates a comprehensive report
 * with actionable recommendations.
 *
 * Usage: node scripts/performance-audit.js
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const REPORTS_DIR = path.join(__dirname, '..', 'performance-reports');
const TIMESTAMP = new Date().toISOString().split('T')[0];

// Lighthouse configuration
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  },
};

// Performance thresholds
const THRESHOLDS = {
  performance: 90,
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 800,
};

/**
 * Get all HTML files in pages directory
 */
async function getPageFiles() {
  const files = await fs.readdir(PAGES_DIR);
  return files
    .filter(file => file.endsWith('.html'))
    .sort();
}

/**
 * Run Lighthouse audit on a single page
 */
async function auditPage(pagePath, chrome) {
  const url = `file://${pagePath}`;

  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
    }, lighthouseConfig);

    return {
      success: true,
      result: runnerResult.lhr,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Analyze audit results and extract key metrics
 */
function analyzeResults(results) {
  const analysis = {
    performance: results.categories.performance.score * 100,
    accessibility: results.categories.accessibility.score * 100,
    bestPractices: results.categories['best-practices'].score * 100,
    seo: results.categories.seo.score * 100,
    metrics: {
      lcp: results.audits['largest-contentful-paint']?.numericValue,
      fid: results.audits['max-potential-fid']?.numericValue,
      cls: results.audits['cumulative-layout-shift']?.numericValue,
      fcp: results.audits['first-contentful-paint']?.numericValue,
      si: results.audits['speed-index']?.numericValue,
      tti: results.audits['interactive']?.numericValue,
      tbt: results.audits['total-blocking-time']?.numericValue,
      ttfb: results.audits['server-response-time']?.numericValue,
    },
    opportunities: [],
    diagnostics: [],
  };

  // Extract optimization opportunities
  Object.entries(results.audits).forEach(([key, audit]) => {
    if (audit.details?.type === 'opportunity' && audit.score < 1) {
      analysis.opportunities.push({
        title: audit.title,
        description: audit.description,
        score: audit.score,
        savings: audit.details.overallSavingsMs,
        items: audit.details.items?.length || 0,
      });
    }

    if (audit.details?.type === 'diagnostic' && audit.score !== null && audit.score < 1) {
      analysis.diagnostics.push({
        title: audit.title,
        description: audit.description,
        score: audit.score,
      });
    }
  });

  // Sort opportunities by potential savings
  analysis.opportunities.sort((a, b) => (b.savings || 0) - (a.savings || 0));

  return analysis;
}

/**
 * Generate issues list based on thresholds
 */
function generateIssues(pageName, analysis) {
  const issues = [];

  // Performance score
  if (analysis.performance < THRESHOLDS.performance) {
    issues.push({
      severity: 'high',
      category: 'Performance',
      issue: `Low performance score: ${analysis.performance.toFixed(1)}/100`,
      target: `≥ ${THRESHOLDS.performance}`,
      fix: 'Implement top optimization opportunities listed below',
    });
  }

  // Core Web Vitals
  if (analysis.metrics.lcp > THRESHOLDS.lcp) {
    issues.push({
      severity: 'high',
      category: 'LCP',
      issue: `Slow Largest Contentful Paint: ${(analysis.metrics.lcp / 1000).toFixed(2)}s`,
      target: `≤ ${THRESHOLDS.lcp / 1000}s`,
      fix: 'Optimize hero image, use fetchpriority="high", convert to WebP',
    });
  }

  if (analysis.metrics.cls > THRESHOLDS.cls) {
    issues.push({
      severity: 'high',
      category: 'CLS',
      issue: `High Cumulative Layout Shift: ${analysis.metrics.cls.toFixed(3)}`,
      target: `≤ ${THRESHOLDS.cls}`,
      fix: 'Add width/height to images, reserve space for dynamic content',
    });
  }

  if (analysis.metrics.fcp > THRESHOLDS.fcp) {
    issues.push({
      severity: 'medium',
      category: 'FCP',
      issue: `Slow First Contentful Paint: ${(analysis.metrics.fcp / 1000).toFixed(2)}s`,
      target: `≤ ${THRESHOLDS.fcp / 1000}s`,
      fix: 'Reduce render-blocking resources, optimize critical CSS',
    });
  }

  // Top opportunities
  analysis.opportunities.slice(0, 3).forEach(opp => {
    if (opp.savings > 500) {
      issues.push({
        severity: 'medium',
        category: 'Optimization',
        issue: opp.title,
        target: `Save ${(opp.savings / 1000).toFixed(2)}s`,
        fix: opp.description,
      });
    }
  });

  return issues;
}

/**
 * Create summary report
 */
function createSummaryReport(results) {
  const summary = {
    totalPages: results.length,
    timestamp: new Date().toISOString(),
    averageScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    },
    pagesPassingThresholds: 0,
    totalIssues: 0,
    criticalIssues: 0,
    pageDetails: [],
  };

  results.forEach(result => {
    if (!result.success) return;

    const analysis = result.analysis;
    summary.averageScores.performance += analysis.performance;
    summary.averageScores.accessibility += analysis.accessibility;
    summary.averageScores.bestPractices += analysis.bestPractices;
    summary.averageScores.seo += analysis.seo;

    if (analysis.performance >= THRESHOLDS.performance) {
      summary.pagesPassingThresholds++;
    }

    const issues = generateIssues(result.page, analysis);
    summary.totalIssues += issues.length;
    summary.criticalIssues += issues.filter(i => i.severity === 'high').length;

    summary.pageDetails.push({
      page: result.page,
      scores: {
        performance: analysis.performance,
        accessibility: analysis.accessibility,
        bestPractices: analysis.bestPractices,
        seo: analysis.seo,
      },
      metrics: analysis.metrics,
      issueCount: issues.length,
      topIssues: issues.slice(0, 3),
    });
  });

  // Calculate averages
  const successfulAudits = results.filter(r => r.success).length;
  Object.keys(summary.averageScores).forEach(key => {
    summary.averageScores[key] = (summary.averageScores[key] / successfulAudits).toFixed(1);
  });

  // Sort pages by performance score (worst first)
  summary.pageDetails.sort((a, b) => a.scores.performance - b.scores.performance);

  return summary;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(summary) {
  let markdown = `# Performance Audit Report\n\n`;
  markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
  markdown += `**Pages Audited:** ${summary.totalPages}\n`;
  markdown += `**Report Type:** Feature #46 - Continuous Performance Improvements\n\n`;

  markdown += `---\n\n`;

  // Executive Summary
  markdown += `## 📊 Executive Summary\n\n`;
  markdown += `### Overall Scores\n\n`;
  markdown += `| Category | Average Score | Status |\n`;
  markdown += `|----------|---------------|--------|\n`;
  markdown += `| Performance | ${summary.averageScores.performance}/100 | ${summary.averageScores.performance >= 90 ? '✅ Good' : '⚠️ Needs Work'} |\n`;
  markdown += `| Accessibility | ${summary.averageScores.accessibility}/100 | ${summary.averageScores.accessibility >= 90 ? '✅ Good' : '⚠️ Needs Work'} |\n`;
  markdown += `| Best Practices | ${summary.averageScores.bestPractices}/100 | ${summary.averageScores.bestPractices >= 90 ? '✅ Good' : '⚠️ Needs Work'} |\n`;
  markdown += `| SEO | ${summary.averageScores.seo}/100 | ${summary.averageScores.seo >= 90 ? '✅ Good' : '⚠️ Needs Work'} |\n\n`;

  markdown += `### Key Metrics\n\n`;
  markdown += `- **Pages Meeting Performance Threshold (≥90):** ${summary.pagesPassingThresholds}/${summary.totalPages}\n`;
  markdown += `- **Total Issues Found:** ${summary.totalIssues}\n`;
  markdown += `- **Critical Issues:** ${summary.criticalIssues}\n\n`;

  markdown += `---\n\n`;

  // Pages needing attention (bottom 5)
  markdown += `## 🔴 Priority Pages (Lowest Performance)\n\n`;
  summary.pageDetails.slice(0, 5).forEach((page, index) => {
    markdown += `### ${index + 1}. ${page.page}\n\n`;
    markdown += `**Performance Score:** ${page.scores.performance.toFixed(1)}/100\n\n`;
    markdown += `**Core Web Vitals:**\n`;
    markdown += `- LCP: ${(page.metrics.lcp / 1000).toFixed(2)}s ${page.metrics.lcp <= THRESHOLDS.lcp ? '✅' : '❌'}\n`;
    markdown += `- CLS: ${page.metrics.cls.toFixed(3)} ${page.metrics.cls <= THRESHOLDS.cls ? '✅' : '❌'}\n`;
    markdown += `- FCP: ${(page.metrics.fcp / 1000).toFixed(2)}s ${page.metrics.fcp <= THRESHOLDS.fcp ? '✅' : '❌'}\n\n`;

    if (page.topIssues.length > 0) {
      markdown += `**Top Issues:**\n`;
      page.topIssues.forEach(issue => {
        markdown += `- **[${issue.severity.toUpperCase()}]** ${issue.issue}\n`;
        markdown += `  - Target: ${issue.target}\n`;
        markdown += `  - Fix: ${issue.fix}\n`;
      });
      markdown += `\n`;
    }
  });

  markdown += `---\n\n`;

  // Best performing pages
  markdown += `## ✅ Best Performing Pages (Top 5)\n\n`;
  const topPages = [...summary.pageDetails].reverse().slice(0, 5);
  topPages.forEach((page, index) => {
    markdown += `${index + 1}. **${page.page}** - ${page.scores.performance.toFixed(1)}/100\n`;
  });
  markdown += `\n`;

  markdown += `---\n\n`;

  // Recommendations
  markdown += `## 🎯 Recommended Actions\n\n`;
  markdown += `### High Priority (This Week)\n\n`;

  const highPriorityPages = summary.pageDetails.filter(p => p.scores.performance < 80);
  if (highPriorityPages.length > 0) {
    highPriorityPages.forEach(page => {
      const criticalIssues = page.topIssues.filter(i => i.severity === 'high');
      if (criticalIssues.length > 0) {
        markdown += `**${page.page}:**\n`;
        criticalIssues.forEach(issue => {
          markdown += `- ${issue.fix}\n`;
        });
        markdown += `\n`;
      }
    });
  } else {
    markdown += `No high-priority issues found. All pages performing well! ✅\n\n`;
  }

  markdown += `### Medium Priority (Next 2 Weeks)\n\n`;
  markdown += `1. Optimize images across all pages (convert to WebP, add srcset)\n`;
  markdown += `2. Implement lazy loading for below-the-fold images\n`;
  markdown += `3. Minimize and combine CSS/JS files\n`;
  markdown += `4. Add fetchpriority="high" to LCP elements\n\n`;

  markdown += `### Low Priority (Ongoing)\n\n`;
  markdown += `1. Monitor Core Web Vitals weekly\n`;
  markdown += `2. Test on real devices and slow connections\n`;
  markdown += `3. Review and respond to user feedback\n`;
  markdown += `4. A/B test performance improvements\n\n`;

  markdown += `---\n\n`;

  // Detailed results table
  markdown += `## 📋 Complete Results\n\n`;
  markdown += `| Page | Perf | A11y | BP | SEO | LCP | CLS | Issues |\n`;
  markdown += `|------|------|------|-----|-----|-----|-----|--------|\n`;
  summary.pageDetails.forEach(page => {
    markdown += `| ${page.page} | ${page.scores.performance.toFixed(0)} | ${page.scores.accessibility.toFixed(0)} | ${page.scores.bestPractices.toFixed(0)} | ${page.scores.seo.toFixed(0)} | ${(page.metrics.lcp / 1000).toFixed(1)}s | ${page.metrics.cls.toFixed(2)} | ${page.issueCount} |\n`;
  });

  markdown += `\n---\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n`;
  markdown += `**Tool:** Lighthouse 11.x\n`;
  markdown += `**Device:** Mobile (Simulated)\n`;
  markdown += `**Throttling:** Slow 4G\n`;

  return markdown;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Performance Audit...\n');

  // Create reports directory
  try {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }

  // Get all pages
  const pages = await getPageFiles();
  console.log(`📄 Found ${pages.length} pages to audit\n`);

  // Launch Chrome
  console.log('🌐 Launching Chrome...');
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });

  console.log('✓ Chrome launched\n');

  // Audit each page
  const results = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pagePath = path.join(PAGES_DIR, page);

    process.stdout.write(`[${i + 1}/${pages.length}] Auditing ${page}... `);

    const result = await auditPage(pagePath, chrome);

    if (result.success) {
      const analysis = analyzeResults(result.result);
      results.push({
        page,
        success: true,
        analysis,
      });
      console.log(`✓ (Score: ${analysis.performance.toFixed(1)})`);
    } else {
      results.push({
        page,
        success: false,
        error: result.error,
      });
      console.log(`✗ (Error: ${result.error})`);
    }
  }

  // Close Chrome
  await chrome.kill();
  console.log('\n✓ Chrome closed\n');

  // Generate reports
  console.log('📊 Generating reports...\n');

  const summary = createSummaryReport(results);
  const markdown = generateMarkdownReport(summary);

  // Save reports
  const reportPath = path.join(REPORTS_DIR, `audit-${TIMESTAMP}.md`);
  const summaryPath = path.join(REPORTS_DIR, `audit-${TIMESTAMP}.json`);

  await fs.writeFile(reportPath, markdown);
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`✅ Markdown report: ${reportPath}`);
  console.log(`✅ JSON summary: ${summaryPath}\n`);

  // Print summary
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 AUDIT SUMMARY');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`Average Performance Score: ${summary.averageScores.performance}/100`);
  console.log(`Pages Meeting Threshold: ${summary.pagesPassingThresholds}/${summary.totalPages}`);
  console.log(`Total Issues: ${summary.totalIssues}`);
  console.log(`Critical Issues: ${summary.criticalIssues}\n`);

  if (summary.criticalIssues > 0) {
    console.log('⚠️  Action required: Fix critical performance issues\n');
  } else {
    console.log('✅ No critical issues found!\n');
  }

  console.log('See full report for details.');
  console.log('═══════════════════════════════════════════════════\n');
}

// Run audit
main().catch(error => {
  console.error('Error running audit:', error);
  process.exit(1);
});
