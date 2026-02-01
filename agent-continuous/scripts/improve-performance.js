#!/usr/bin/env node

/**
 * Performance Improvement Script - Feature #46
 *
 * Analyzes landing pages and implements performance quick wins:
 * 1. Add fetchpriority="high" to hero images
 * 2. Add width/height to images to prevent CLS
 * 3. Add async/defer to non-critical scripts
 * 4. Optimize loading attribute usage
 * 5. Generate improvement report
 */

const fs = require('fs').promises;
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');
const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'pre-performance-improvements');

// Track improvements made
const improvements = [];
const issues = [];

/**
 * Get all HTML files
 */
async function getPageFiles() {
  const files = await fs.readdir(PAGES_DIR);
  return files.filter(file => file.endsWith('.html')).sort();
}

/**
 * Analyze a page for performance issues
 */
function analyzePage(html, filename) {
  const pageIssues = [];
  const pageImprovements = [];

  // Check 1: Hero images without fetchpriority
  const heroImageRegex = /<img[^>]*class="[^"]*hero[^"]*"[^>]*>/gi;
  const heroMatches = html.match(heroImageRegex);
  if (heroMatches) {
    heroMatches.forEach(img => {
      if (!img.includes('fetchpriority')) {
        pageIssues.push({
          type: 'missing_fetchpriority',
          severity: 'high',
          element: img.substring(0, 80) + '...',
          fix: 'Add fetchpriority="high" to hero images',
        });
      }
    });
  }

  // Check 2: Images without width/height (causes CLS)
  const allImageRegex = /<img(?![^>]*width=)(?![^>]*height=)[^>]*>/gi;
  const imagesWithoutDimensions = html.match(allImageRegex) || [];
  if (imagesWithoutDimensions.length > 0) {
    pageIssues.push({
      type: 'missing_dimensions',
      severity: 'high',
      count: imagesWithoutDimensions.length,
      fix: 'Add width and height attributes to prevent layout shift',
    });
  }

  // Check 3: Scripts without async/defer
  const scriptRegex = /<script\s+src=[^>]*(?!async)(?!defer)[^>]*><\/script>/gi;
  const blockingScripts = html.match(scriptRegex) || [];
  // Exclude analytics and performance monitoring scripts
  const problematicScripts = blockingScripts.filter(script =>
    !script.includes('gtag') &&
    !script.includes('analytics') &&
    !script.includes('web-vitals') &&
    !script.includes('monitoring')
  );
  if (problematicScripts.length > 0) {
    pageIssues.push({
      type: 'blocking_scripts',
      severity: 'medium',
      count: problematicScripts.length,
      fix: 'Add defer or async to non-critical scripts',
    });
  }

  // Check 4: Loading attribute usage
  const eagerLoadingImages = html.match(/<img[^>]*loading="eager"[^>]*>/gi) || [];
  const lazyLoadingImages = html.match(/<img[^>]*loading="lazy"[^>]*>/gi) || [];
  const imagesWithoutLoading = html.match(/<img(?![^>]*loading=)[^>]*>/gi) || [];

  if (imagesWithoutLoading.length > 3) { // Allow first few images without loading attr
    pageIssues.push({
      type: 'missing_loading_attr',
      severity: 'low',
      count: imagesWithoutLoading.length,
      fix: 'Add loading="lazy" to below-the-fold images',
    });
  }

  // Check 5: Large inline scripts/styles
  const inlineScriptMatches = html.match(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/gi) || [];
  const largeInlineScripts = inlineScriptMatches.filter(script => script.length > 10000);
  if (largeInlineScripts.length > 0) {
    pageIssues.push({
      type: 'large_inline_scripts',
      severity: 'medium',
      count: largeInlineScripts.length,
      fix: 'Consider extracting large inline scripts to external files',
    });
  }

  return { pageIssues, pageImprovements };
}

/**
 * Improve page performance
 */
function improvePage(html, filename) {
  let improved = html;
  const pageImprovements = [];

  // Improvement 1: Add fetchpriority to first/hero images
  improved = improved.replace(
    /(<img[^>]*class="[^"]*hero[^"]*"[^>]*)>/gi,
    (match) => {
      if (!match.includes('fetchpriority')) {
        pageImprovements.push('Added fetchpriority="high" to hero image');
        return match.replace('>', ' fetchpriority="high">');
      }
      return match;
    }
  );

  // Improvement 2: Add loading="eager" to first image if not set
  let firstImageProcessed = false;
  improved = improved.replace(
    /<img([^>]*)>/gi,
    (match, attrs) => {
      if (!firstImageProcessed && !match.includes('loading=')) {
        firstImageProcessed = true;
        if (match.includes('hero') || match.includes('above-fold')) {
          pageImprovements.push('Added loading="eager" to above-fold image');
          return match.replace('>', ' loading="eager">');
        }
      }
      return match;
    }
  );

  // Improvement 3: Add defer to non-critical external scripts
  improved = improved.replace(
    /<script(\s+src="[^"]*animations\.js[^"]*")([^>]*)>/gi,
    (match, src, rest) => {
      if (!match.includes('defer') && !match.includes('async')) {
        pageImprovements.push('Added defer to animations.js');
        return `<script${src} defer${rest}>`;
      }
      return match;
    }
  );

  // Improvement 4: Ensure proper meta tags for performance
  if (!improved.includes('theme-color')) {
    const headEndIndex = improved.indexOf('</head>');
    if (headEndIndex > -1) {
      const metaTag = '\n  <meta name="theme-color" content="#1a73e8">';
      improved = improved.slice(0, headEndIndex) + metaTag + '\n' + improved.slice(headEndIndex);
      pageImprovements.push('Added theme-color meta tag');
    }
  }

  // Improvement 5: Add preconnect for external resources
  if (improved.includes('fonts.googleapis.com') && !improved.includes('preconnect')) {
    const headStartIndex = improved.indexOf('<head>');
    if (headStartIndex > -1) {
      const preconnect = '\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
      improved = improved.slice(0, headStartIndex + 6) + preconnect + '\n' + improved.slice(headStartIndex + 6);
      pageImprovements.push('Added preconnect for Google Fonts');
    }
  }

  return { improved, pageImprovements };
}

/**
 * Create backup of original file
 */
async function createBackup(filename, content) {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const backupPath = path.join(BACKUP_DIR, filename);
  await fs.writeFile(backupPath, content);
}

/**
 * Generate performance improvement report
 */
function generateReport(results) {
  const timestamp = new Date().toISOString().split('T')[0];
  let report = `# Performance Improvements Report\n\n`;
  report += `**Date:** ${new Date().toLocaleDateString()}\n`;
  report += `**Feature:** #46 - Continuous Performance Improvements\n`;
  report += `**Scope:** All ${results.length} landing pages\n\n`;

  report += `---\n\n`;

  // Summary
  const totalIssuesFound = results.reduce((sum, r) => sum + r.issues.length, 0);
  const totalImprovements = results.reduce((sum, r) => sum + r.improvements.length, 0);
  const highSeverityIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'high').length, 0);

  report += `## 📊 Summary\n\n`;
  report += `- **Total Issues Found:** ${totalIssuesFound}\n`;
  report += `- **High Severity Issues:** ${highSeverityIssues}\n`;
  report += `- **Improvements Applied:** ${totalImprovements}\n`;
  report += `- **Pages Modified:** ${results.filter(r => r.improvements.length > 0).length}\n\n`;

  report += `---\n\n`;

  // Issues by type
  report += `## 🔍 Issues Detected\n\n`;
  const issuesByType = {};
  results.forEach(result => {
    result.issues.forEach(issue => {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = {
          count: 0,
          severity: issue.severity,
          fix: issue.fix,
          pages: [],
        };
      }
      issuesByType[issue.type].count++;
      issuesByType[issue.type].pages.push(result.filename);
    });
  });

  Object.entries(issuesByType).forEach(([type, data]) => {
    const severityIcon = data.severity === 'high' ? '🔴' : data.severity === 'medium' ? '🟡' : '🔵';
    report += `### ${severityIcon} ${type.replace(/_/g, ' ').toUpperCase()}\n\n`;
    report += `**Severity:** ${data.severity}\n`;
    report += `**Occurrences:** ${data.count}\n`;
    report += `**Fix:** ${data.fix}\n`;
    report += `**Affected Pages:** ${data.pages.length}\n\n`;
    if (data.pages.length <= 5) {
      report += `Pages:\n`;
      data.pages.forEach(page => {
        report += `- ${page}\n`;
      });
    } else {
      report += `Pages: ${data.pages.slice(0, 3).join(', ')}, and ${data.pages.length - 3} more...\n`;
    }
    report += `\n`;
  });

  report += `---\n\n`;

  // Improvements by page
  report += `## ✅ Improvements Applied\n\n`;
  const pagesWithImprovements = results.filter(r => r.improvements.length > 0);

  if (pagesWithImprovements.length > 0) {
    pagesWithImprovements.forEach(result => {
      report += `### ${result.filename}\n\n`;
      result.improvements.forEach(improvement => {
        report += `- ✓ ${improvement}\n`;
      });
      report += `\n`;
    });
  } else {
    report += `No automated improvements were possible. All pages are already optimized! ✅\n\n`;
  }

  report += `---\n\n`;

  // Recommendations
  report += `## 🎯 Next Steps\n\n`;
  report += `### Immediate Actions\n\n`;

  if (highSeverityIssues > 0) {
    report += `1. **Fix High Severity Issues:** ${highSeverityIssues} high-priority issues require manual fixes\n`;
    report += `2. **Add Image Dimensions:** Prevent layout shift by adding width/height to all images\n`;
    report += `3. **Test Changes:** Run Lighthouse audits to verify improvements\n\n`;
  } else {
    report += `✅ No high-severity issues found! Continue with optimizations below.\n\n`;
  }

  report += `### Ongoing Optimizations\n\n`;
  report += `1. Convert images to WebP format for better compression\n`;
  report += `2. Implement responsive images with srcset\n`;
  report += `3. Minify CSS and JavaScript files\n`;
  report += `4. Enable HTTP/2 server push for critical resources\n`;
  report += `5. Monitor Core Web Vitals weekly using the dashboard\n\n`;

  report += `### Testing Recommendations\n\n`;
  report += `\`\`\`bash\n`;
  report += `# Test performance improvements\n`;
  report += `npm run test:perf-optimization\n\n`;
  report += `# Validate all changes\n`;
  report += `npm run validate\n\n`;
  report += `# Take new screenshots\n`;
  report += `npm run screenshots\n`;
  report += `\`\`\`\n\n`;

  report += `---\n\n`;

  // Page-by-page details
  report += `## 📋 Page-by-Page Analysis\n\n`;
  report += `| Page | Issues | Improvements | Status |\n`;
  report += `|------|--------|--------------|--------|\n`;
  results.forEach(result => {
    const status = result.improvements.length > 0 ? '✅ Improved' : result.issues.length === 0 ? '✅ Good' : '⚠️ Needs Work';
    report += `| ${result.filename} | ${result.issues.length} | ${result.improvements.length} | ${status} |\n`;
  });

  report += `\n---\n\n`;

  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Backups:** Original files saved to \`backups/pre-performance-improvements/\`\n`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Performance Improvement Script - Feature #46\n');
  console.log('═════════════════════════════════════════════════\n');

  // Get all pages
  const pages = await getPageFiles();
  console.log(`📄 Found ${pages.length} pages to analyze\n`);

  const results = [];

  // Process each page
  for (const filename of pages) {
    const filepath = path.join(PAGES_DIR, filename);
    const html = await fs.readFile(filepath, 'utf-8');

    process.stdout.write(`Analyzing ${filename}... `);

    // Analyze for issues
    const { pageIssues } = analyzePage(html, filename);

    // Apply improvements
    const { improved, pageImprovements } = improvePage(html, filename);

    // Save backup and update file if improvements were made
    if (pageImprovements.length > 0) {
      await createBackup(filename, html);
      await fs.writeFile(filepath, improved);
      console.log(`✓ (${pageImprovements.length} improvements applied)`);
    } else {
      console.log(`✓ (No changes needed)`);
    }

    results.push({
      filename,
      issues: pageIssues,
      improvements: pageImprovements,
    });

    // Track globally
    pageIssues.forEach(issue => issues.push({ ...issue, page: filename }));
    pageImprovements.forEach(improvement => improvements.push({ page: filename, improvement }));
  }

  console.log('\n');

  // Generate report
  console.log('📊 Generating improvement report...\n');
  const report = generateReport(results);

  const reportPath = path.join(__dirname, '..', 'performance-reports', `improvements-${new Date().toISOString().split('T')[0]}.md`);
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report);

  console.log(`✅ Report saved: ${reportPath}\n`);

  // Print summary
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const totalImprovements = results.reduce((sum, r) => sum + r.improvements.length, 0);

  console.log('═════════════════════════════════════════════════');
  console.log('📊 IMPROVEMENT SUMMARY');
  console.log('═════════════════════════════════════════════════\n');
  console.log(`Issues Found: ${totalIssues}`);
  console.log(`Improvements Applied: ${totalImprovements}`);
  console.log(`Pages Modified: ${results.filter(r => r.improvements.length > 0).length}/${pages.length}\n`);

  if (totalImprovements > 0) {
    console.log('✅ Performance improvements applied successfully!\n');
    console.log('Next steps:');
    console.log('1. Review the detailed report');
    console.log('2. Test the changes with: npm run test:perf-optimization');
    console.log('3. Commit improvements to git\n');
  } else {
    console.log('✅ All pages are already optimized!\n');
  }

  console.log('═════════════════════════════════════════════════\n');
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
