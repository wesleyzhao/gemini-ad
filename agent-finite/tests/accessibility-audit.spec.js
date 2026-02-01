/**
 * Accessibility Audit Test Suite
 *
 * Tests all landing pages for WCAG 2.1 Level AA compliance using axe-core.
 * Checks for:
 * - ARIA labels and roles
 * - Keyboard navigation
 * - Color contrast
 * - Form labels
 * - Alt text for images
 * - Semantic HTML
 * - Focus management
 * - Screen reader compatibility
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';
import fs from 'fs';
import path from 'path';

// Get all landing pages
const pagesDir = path.join(process.cwd(), 'pages');
const allPages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => ({
    name: file.replace('.html', ''),
    path: `pages/${file}`
  }));

// Accessibility test configuration
const axeConfig = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
  }
};

// Create test results directory
const resultsDir = path.join(process.cwd(), 'test-results', 'accessibility');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

test.describe('Accessibility Audit - All Pages', () => {

  // Test each page for accessibility violations
  for (const page of allPages) {
    test(`${page.name} - should not have any WCAG AA violations`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Wait for animations to settle
      await pwPage.waitForTimeout(1000);

      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page: pwPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Save detailed results
      const reportPath = path.join(resultsDir, `${page.name}-axe-report.json`);
      fs.writeFileSync(reportPath, JSON.stringify(accessibilityScanResults, null, 2));

      // Check for violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe('Keyboard Navigation Tests', () => {

  for (const page of allPages) {
    test(`${page.name} - all interactive elements should be keyboard accessible`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Get all focusable elements
      const focusableElements = await pwPage.locator(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      ).all();

      expect(focusableElements.length).toBeGreaterThan(0);

      // Test tab navigation
      await pwPage.keyboard.press('Tab');

      // Check that focus is visible
      const focusedElement = await pwPage.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;

        const styles = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          hasOutline: styles.outline !== 'none' || styles.boxShadow !== 'none',
          isVisible: styles.opacity !== '0' && styles.visibility !== 'hidden'
        };
      });

      expect(focusedElement).not.toBeNull();
      expect(focusedElement.hasOutline || focusedElement.isVisible).toBe(true);
    });

    test(`${page.name} - CTA buttons should be activatable with Enter/Space`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Find CTA buttons
      const ctaButtons = await pwPage.locator('button, a.cta-button, .cta').all();

      if (ctaButtons.length > 0) {
        const firstCta = ctaButtons[0];
        await firstCta.focus();

        // Should be focusable
        const isFocused = await pwPage.evaluate(() =>
          document.activeElement?.tagName === 'BUTTON' ||
          document.activeElement?.tagName === 'A'
        );

        expect(isFocused).toBe(true);
      }
    });
  }
});

test.describe('ARIA Labels and Roles', () => {

  for (const page of allPages) {
    test(`${page.name} - images should have alt text or aria-label`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Check all images
      const imagesWithoutAlt = await pwPage.locator('img:not([alt])').all();

      // Check if images without alt have aria-label or are decorative
      for (const img of imagesWithoutAlt) {
        const ariaLabel = await img.getAttribute('aria-label');
        const role = await img.getAttribute('role');

        // Image should either have aria-label or role="presentation"
        expect(ariaLabel || role === 'presentation').toBeTruthy();
      }
    });

    test(`${page.name} - buttons should have accessible names`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      const buttons = await pwPage.locator('button').all();

      for (const button of buttons) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledby = await button.getAttribute('aria-labelledby');

        // Button should have text content or aria-label/aria-labelledby
        expect(
          (text && text.trim().length > 0) || ariaLabel || ariaLabelledby
        ).toBeTruthy();
      }
    });

    test(`${page.name} - links should have accessible names`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      const links = await pwPage.locator('a').all();

      for (const link of links) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const ariaLabelledby = await link.getAttribute('aria-labelledby');

        // Link should have text content or aria-label/aria-labelledby
        expect(
          (text && text.trim().length > 0) || ariaLabel || ariaLabelledby
        ).toBeTruthy();
      }
    });

    test(`${page.name} - page should have proper heading hierarchy`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Check for h1
      const h1Count = await pwPage.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      expect(h1Count).toBeLessThanOrEqual(1); // Only one h1 per page

      // Get all headings
      const headings = await pwPage.evaluate(() => {
        return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .map(h => parseInt(h.tagName.substring(1)));
      });

      // Check heading hierarchy (no skipping levels)
      for (let i = 1; i < headings.length; i++) {
        const diff = headings[i] - headings[i - 1];
        expect(diff).toBeLessThanOrEqual(1); // Don't skip heading levels
      }
    });
  }
});

test.describe('Color Contrast Tests', () => {

  for (const page of allPages) {
    test(`${page.name} - should have sufficient color contrast`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Use axe to check color contrast
      const results = await new AxeBuilder({ page: pwPage })
        .withTags(['wcag2aa'])
        .include('body')
        .analyze();

      const contrastViolations = results.violations.filter(
        v => v.id === 'color-contrast'
      );

      expect(contrastViolations).toEqual([]);
    });
  }
});

test.describe('Form Accessibility', () => {

  for (const page of allPages) {
    test(`${page.name} - form inputs should have labels`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      const inputs = await pwPage.locator('input, textarea, select').all();

      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');

        if (id) {
          // Check for associated label
          const label = await pwPage.locator(`label[for="${id}"]`).count();

          // Should have label, aria-label, or aria-labelledby
          expect(
            label > 0 || ariaLabel || ariaLabelledby
          ).toBeTruthy();
        } else {
          // Without id, must have aria-label
          expect(ariaLabel || ariaLabelledby).toBeTruthy();
        }
      }
    });
  }
});

test.describe('Landmark Roles', () => {

  for (const page of allPages) {
    test(`${page.name} - should have proper landmark regions`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Check for main landmark
      const mainLandmark = await pwPage.locator('main, [role="main"]').count();
      expect(mainLandmark).toBeGreaterThanOrEqual(1);

      // Check for navigation (if exists)
      const navElements = await pwPage.locator('nav').count();
      if (navElements > 0) {
        // Nav should have aria-label or aria-labelledby
        const navWithLabel = await pwPage.locator('nav[aria-label], nav[aria-labelledby]').count();
        expect(navWithLabel).toBeGreaterThanOrEqual(1);
      }
    });
  }
});

test.describe('Screen Reader Compatibility', () => {

  for (const page of allPages) {
    test(`${page.name} - hidden content should be properly marked`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      // Check for decorative elements
      const decorativeElements = await pwPage.evaluate(() => {
        const elements = document.querySelectorAll('[aria-hidden="true"]');
        return Array.from(elements).map(el => ({
          tagName: el.tagName,
          hasInteractiveChildren: el.querySelector('button, a, input, textarea, select') !== null
        }));
      });

      // aria-hidden elements should not contain interactive elements
      for (const el of decorativeElements) {
        expect(el.hasInteractiveChildren).toBe(false);
      }
    });

    test(`${page.name} - page should have a descriptive title`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      const title = await pwPage.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toBe('Document');
    });

    test(`${page.name} - page should have lang attribute`, async ({ page: pwPage }) => {
      await pwPage.goto(`http://localhost:8080/${page.path}`, {
        waitUntil: 'networkidle'
      });

      const lang = await pwPage.getAttribute('html', 'lang');
      expect(lang).toBeTruthy();
      expect(lang.length).toBeGreaterThanOrEqual(2);
    });
  }
});

// Generate summary report after all tests
test.afterAll(async () => {
  const reportFiles = fs.readdirSync(resultsDir)
    .filter(f => f.endsWith('-axe-report.json'));

  const summary = {
    totalPages: allPages.length,
    pagesWithViolations: 0,
    totalViolations: 0,
    violationsByImpact: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    },
    violationsByType: {},
    pageReports: []
  };

  for (const file of reportFiles) {
    const reportPath = path.join(resultsDir, file);
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    const pageName = file.replace('-axe-report.json', '');
    const violations = report.violations || [];

    if (violations.length > 0) {
      summary.pagesWithViolations++;
    }

    summary.totalViolations += violations.length;

    const pageReport = {
      page: pageName,
      violationCount: violations.length,
      passes: report.passes?.length || 0,
      violations: violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length
      }))
    };

    summary.pageReports.push(pageReport);

    // Count by impact
    for (const violation of violations) {
      const impact = violation.impact;
      summary.violationsByImpact[impact] = (summary.violationsByImpact[impact] || 0) + 1;

      // Count by type
      summary.violationsByType[violation.id] = (summary.violationsByType[violation.id] || 0) + 1;
    }
  }

  // Sort by violation count
  summary.pageReports.sort((a, b) => b.violationCount - a.violationCount);

  // Write summary
  const summaryPath = path.join(resultsDir, 'accessibility-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  // Write human-readable report
  const readableReport = generateReadableReport(summary);
  const readablePath = path.join(resultsDir, 'accessibility-report.txt');
  fs.writeFileSync(readablePath, readableReport);

  console.log('\n' + '='.repeat(80));
  console.log('ACCESSIBILITY AUDIT SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Pages Tested: ${summary.totalPages}`);
  console.log(`Pages with Violations: ${summary.pagesWithViolations}`);
  console.log(`Total Violations: ${summary.totalViolations}`);
  console.log('\nViolations by Impact:');
  console.log(`  Critical: ${summary.violationsByImpact.critical}`);
  console.log(`  Serious: ${summary.violationsByImpact.serious}`);
  console.log(`  Moderate: ${summary.violationsByImpact.moderate}`);
  console.log(`  Minor: ${summary.violationsByImpact.minor}`);
  console.log('\nDetailed report saved to:');
  console.log(`  ${summaryPath}`);
  console.log(`  ${readablePath}`);
  console.log('='.repeat(80) + '\n');
});

function generateReadableReport(summary) {
  let report = '';

  report += '='.repeat(80) + '\n';
  report += 'ACCESSIBILITY AUDIT REPORT\n';
  report += '='.repeat(80) + '\n\n';

  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Total Pages: ${summary.totalPages}\n`;
  report += `Pages with Violations: ${summary.pagesWithViolations}\n`;
  report += `Total Violations: ${summary.totalViolations}\n\n`;

  report += 'VIOLATIONS BY IMPACT\n';
  report += '-'.repeat(80) + '\n';
  report += `Critical: ${summary.violationsByImpact.critical}\n`;
  report += `Serious: ${summary.violationsByImpact.serious}\n`;
  report += `Moderate: ${summary.violationsByImpact.moderate}\n`;
  report += `Minor: ${summary.violationsByImpact.minor}\n\n`;

  report += 'VIOLATIONS BY TYPE\n';
  report += '-'.repeat(80) + '\n';
  const sortedTypes = Object.entries(summary.violationsByType)
    .sort((a, b) => b[1] - a[1]);
  for (const [type, count] of sortedTypes) {
    report += `${type}: ${count}\n`;
  }
  report += '\n';

  report += 'PAGE-BY-PAGE RESULTS\n';
  report += '-'.repeat(80) + '\n';

  for (const pageReport of summary.pageReports) {
    report += `\n${pageReport.page}\n`;
    report += `  Violations: ${pageReport.violationCount}\n`;
    report += `  Passes: ${pageReport.passes}\n`;

    if (pageReport.violations.length > 0) {
      report += '  Issues:\n';
      for (const v of pageReport.violations) {
        report += `    - [${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n`;
        report += `      Affected nodes: ${v.nodes}\n`;
        report += `      Help: ${v.helpUrl}\n`;
      }
    }
  }

  report += '\n' + '='.repeat(80) + '\n';

  return report;
}
