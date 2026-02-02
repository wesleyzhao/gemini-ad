#!/usr/bin/env node

/**
 * Feature #88: Comprehensive Quality Audit & Monitoring
 *
 * This test validates all 13 optimized pages for:
 * - Quad Threat pattern implementation
 * - Code quality and consistency
 * - Performance optimization
 * - Mobile responsiveness
 * - Accessibility compliance
 * - Cross-page consistency
 */

const fs = require('fs');
const path = require('path');

// All 13 optimized pages
const PAGES = [
  { id: 'workspace', file: 'pages/workspace.html', segment: 'Operators' },
  { id: 'research', file: 'pages/research.html', segment: 'Academic' },
  { id: 'comparison', file: 'pages/comparison.html', segment: 'Switchers' },
  { id: 'writers', file: 'pages/writers.html', segment: 'Writers' },
  { id: 'creators', file: 'pages/creators.html', segment: 'Creators' },
  { id: 'productivity', file: 'pages/productivity.html', segment: 'Productivity' },
  { id: 'future', file: 'pages/future.html', segment: 'Aspirational' },
  { id: 'index', file: 'pages/index.html', segment: 'General' },
  { id: 'apple-style', file: 'pages/apple-style.html', segment: 'Premium' },
  { id: 'valentine', file: 'pages/valentine.html', segment: 'Seasonal' },
  { id: 'operators', file: 'pages/operators.html', segment: 'Operators' },
  { id: 'automators', file: 'pages/automators.html', segment: 'Automators' },
  { id: 'trust', file: 'pages/trust.html', segment: 'Trust-Focused' }
];

// Test results
const results = {
  feature: 88,
  description: "Comprehensive Quality Audit & Monitoring of All 13 Optimized Pages",
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    successRate: "0%",
    grade: "F"
  },
  pages: PAGES.map(p => `${p.segment} (${p.file})`),
  tests: [],
  quality_metrics: {
    quad_threat_compliance: 0,
    performance_score: 0,
    accessibility_score: 0,
    consistency_score: 0
  },
  recommendations: []
};

/**
 * Run a test and record result
 */
function test(name, fn) {
  results.summary.total++;
  try {
    fn();
    results.tests.push({
      testName: name,
      passed: true,
      message: ""
    });
    results.summary.passed++;
    return true;
  } catch (error) {
    results.tests.push({
      testName: name,
      passed: false,
      message: error.message
    });
    results.summary.failed++;
    console.error(`❌ ${name}: ${error.message}`);
    return false;
  }
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Read file helper
 */
function readFile(filepath) {
  const fullPath = path.join(__dirname, filepath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filepath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Check if content contains pattern
 */
function contains(content, pattern, description) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  assert(regex.test(content), `Missing ${description}: expected pattern ${pattern}`);
}

/**
 * Main test execution
 */
function runTests() {
  console.log('🔍 Feature #88: Comprehensive Quality Audit\n');
  console.log(`Testing ${PAGES.length} optimized pages...\n`);

  let quadThreatCount = 0;
  let performanceIssues = [];
  let accessibilityIssues = [];
  let consistencyIssues = [];

  // Test each page
  for (const page of PAGES) {
    console.log(`\n📄 Testing ${page.segment}: ${page.file}`);

    // Test 1: File exists
    test(`${page.segment}: File Exists`, () => {
      const content = readFile(page.file);
      assert(content.length > 0, 'File is empty');
    });

    let content;
    try {
      content = readFile(page.file);
    } catch (error) {
      console.warn(`⚠️  Skipping ${page.file} tests - file not found`);
      continue;
    }

    // Test 2: Quad Threat - Sticky CTA present
    const hasStickyCTA = test(`${page.segment}: Quad Threat - Sticky CTA`, () => {
      contains(content, /sticky-cta-button|class="[^"]*sticky[^"]*cta/i, 'Sticky CTA button');
    });

    // Test 3: Quad Threat - Social Proof present
    const hasSocialProof = test(`${page.segment}: Quad Threat - Social Proof`, () => {
      contains(content, /social-proof-banner|2\.5M\+|professionals using/i, 'Social proof banner');
    });

    // Track Quad Threat compliance
    if (hasStickyCTA && hasSocialProof) {
      quadThreatCount++;
    }

    // Test 4: Mobile responsiveness
    test(`${page.segment}: Mobile Responsive Meta Tag`, () => {
      contains(content, /<meta name="viewport" content="width=device-width/, 'Viewport meta tag');
    });

    // Test 5: Mobile responsive styles
    test(`${page.segment}: Mobile Responsive CSS`, () => {
      contains(content, /@media.*max-width|@media.*min-width/i, 'Responsive media queries');
    });

    // Test 6: Accessibility - ARIA labels
    test(`${page.segment}: Accessibility - ARIA Labels`, () => {
      contains(content, /aria-label|role=|aria-live/i, 'ARIA attributes');
    });

    // Test 7: Performance - Lazy loading
    const hasLazyLoading = test(`${page.segment}: Performance - Lazy Loading`, () => {
      // Check for loading="lazy" or data-src patterns
      const hasLazy = /loading="lazy"|data-src=|intersection.*observer/i.test(content);
      assert(hasLazy, 'No lazy loading implementation found');
    });

    // Test 8: Performance - Optimized images
    test(`${page.segment}: Performance - Image Optimization`, () => {
      // Check that images have proper attributes
      const imgTags = content.match(/<img[^>]+>/gi) || [];
      if (imgTags.length > 0) {
        // At least some images should have width/height or srcset
        const hasOptimized = imgTags.some(img =>
          /width=|height=|srcset=/i.test(img)
        );
        assert(hasOptimized, 'Images missing optimization attributes (width/height/srcset)');
      }
    });

    // Test 9: Brand consistency - Google colors
    test(`${page.segment}: Brand Consistency - Google Colors`, () => {
      contains(content, /#4285f4|#34a853|#fbbc04|#ea4335/i, 'Google brand colors');
    });

    // Test 10: SEO - Title tag
    test(`${page.segment}: SEO - Title Tag`, () => {
      contains(content, /<title>[^<]+<\/title>/i, 'Title tag');
    });

    // Test 11: SEO - Meta description
    test(`${page.segment}: SEO - Meta Description`, () => {
      contains(content, /<meta name="description" content="[^"]+"/i, 'Meta description');
    });

    // Test 12: Code quality - No console.log in production
    test(`${page.segment}: Code Quality - No Debug Code`, () => {
      const hasDebugCode = /console\.log|debugger;/i.test(content);
      assert(!hasDebugCode, 'Debug code found (console.log or debugger)');
    });

    // Test 13: CTA clarity - Clear call to action
    test(`${page.segment}: CTA Clarity - Action Verb`, () => {
      contains(content, /Try Gemini|Get Started|Start Free|Sign Up|Learn More/i, 'Clear CTA text');
    });
  }

  // Cross-page consistency checks
  console.log('\n\n🔗 Cross-Page Consistency Checks');

  // Test 14: Consistent Google branding
  test('Cross-Page: Consistent Branding', () => {
    const brandingPatterns = PAGES.map(page => {
      try {
        const content = readFile(page.file);
        return {
          page: page.file,
          hasGemini: /Gemini/i.test(content),
          hasGoogle: /Google/i.test(content),
          hasBrandColors: /#4285f4|#34a853/.test(content)
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    const allHaveGemini = brandingPatterns.every(p => p.hasGemini);
    const allHaveBrandColors = brandingPatterns.every(p => p.hasBrandColors);

    assert(allHaveGemini, 'Not all pages mention Gemini');
    assert(allHaveBrandColors, 'Not all pages use Google brand colors');
  });

  // Test 15: Consistent mobile optimization
  test('Cross-Page: Mobile Optimization', () => {
    const mobileOptimized = PAGES.map(page => {
      try {
        const content = readFile(page.file);
        return /@media.*max-width/.test(content);
      } catch (e) {
        return false;
      }
    });

    const allOptimized = mobileOptimized.every(Boolean);
    assert(allOptimized, 'Not all pages have mobile responsive styles');
  });

  // Calculate quality metrics
  results.quality_metrics.quad_threat_compliance = Math.round((quadThreatCount / PAGES.length) * 100);
  results.quality_metrics.performance_score = Math.round(((results.summary.total - performanceIssues.length) / results.summary.total) * 100);
  results.quality_metrics.accessibility_score = Math.round(((results.summary.total - accessibilityIssues.length) / results.summary.total) * 100);
  results.quality_metrics.consistency_score = Math.round((results.summary.passed / results.summary.total) * 100);

  // Generate recommendations
  generateRecommendations();

  // Calculate success rate and grade
  results.summary.successRate = `${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`;
  const successRate = results.summary.passed / results.summary.total;

  if (successRate >= 0.97) results.summary.grade = "A+";
  else if (successRate >= 0.93) results.summary.grade = "A";
  else if (successRate >= 0.90) results.summary.grade = "A-";
  else if (successRate >= 0.87) results.summary.grade = "B+";
  else if (successRate >= 0.83) results.summary.grade = "B";
  else if (successRate >= 0.80) results.summary.grade = "B-";
  else if (successRate >= 0.77) results.summary.grade = "C+";
  else if (successRate >= 0.70) results.summary.grade = "C";
  else results.summary.grade = "F";

  // Print summary
  console.log('\n\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.summary.total}`);
  console.log(`Passed: ${results.summary.passed} ✅`);
  console.log(`Failed: ${results.summary.failed} ❌`);
  console.log(`Success Rate: ${results.summary.successRate}`);
  console.log(`Grade: ${results.summary.grade}`);
  console.log('\nQuality Metrics:');
  console.log(`  Quad Threat Compliance: ${results.quality_metrics.quad_threat_compliance}%`);
  console.log(`  Performance Score: ${results.quality_metrics.performance_score}%`);
  console.log(`  Accessibility Score: ${results.quality_metrics.accessibility_score}%`);
  console.log(`  Consistency Score: ${results.quality_metrics.consistency_score}%`);

  if (results.recommendations.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('RECOMMENDATIONS');
    console.log('='.repeat(80));
    results.recommendations.forEach((rec, i) => {
      console.log(`\n${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
      console.log(`   Category: ${rec.category}`);
      console.log(`   Action: ${rec.action}`);
      if (rec.pages && rec.pages.length > 0) {
        console.log(`   Affected Pages: ${rec.pages.join(', ')}`);
      }
    });
  }

  console.log('\n' + '='.repeat(80));

  // Save results
  const reportDir = path.join(__dirname, 'test-reports-feature-88');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, 'validation-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Results saved to: ${reportPath}\n`);

  return results.summary.failed === 0;
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations() {
  const failedTests = results.tests.filter(t => !t.passed);

  // Group failures by category
  const categories = {
    quad_threat: failedTests.filter(t => t.testName.includes('Quad Threat')),
    mobile: failedTests.filter(t => t.testName.includes('Mobile')),
    accessibility: failedTests.filter(t => t.testName.includes('Accessibility')),
    performance: failedTests.filter(t => t.testName.includes('Performance')),
    seo: failedTests.filter(t => t.testName.includes('SEO')),
    quality: failedTests.filter(t => t.testName.includes('Code Quality'))
  };

  // Add recommendations based on failures
  if (categories.quad_threat.length > 0) {
    results.recommendations.push({
      priority: 'critical',
      category: 'conversion',
      title: 'Complete Quad Threat Implementation',
      pages: categories.quad_threat.map(t => t.testName.split(':')[0]),
      action: 'Add missing Sticky CTA or Social Proof components to maximize conversion rates'
    });
  }

  if (categories.performance.length > 0) {
    results.recommendations.push({
      priority: 'high',
      category: 'performance',
      title: 'Optimize Page Performance',
      pages: categories.performance.map(t => t.testName.split(':')[0]),
      action: 'Implement lazy loading, optimize images, and improve Core Web Vitals'
    });
  }

  if (categories.accessibility.length > 0) {
    results.recommendations.push({
      priority: 'high',
      category: 'accessibility',
      title: 'Improve Accessibility',
      pages: categories.accessibility.map(t => t.testName.split(':')[0]),
      action: 'Add ARIA labels, semantic HTML, and keyboard navigation support'
    });
  }

  if (categories.mobile.length > 0) {
    results.recommendations.push({
      priority: 'high',
      category: 'mobile',
      title: 'Enhance Mobile Experience',
      pages: categories.mobile.map(t => t.testName.split(':')[0]),
      action: 'Add responsive styles and mobile-optimized layouts'
    });
  }

  if (categories.seo.length > 0) {
    results.recommendations.push({
      priority: 'medium',
      category: 'seo',
      title: 'Improve SEO',
      pages: categories.seo.map(t => t.testName.split(':')[0]),
      action: 'Add missing meta tags, titles, and structured data'
    });
  }

  // Add proactive recommendations even if tests pass
  if (results.summary.passed === results.summary.total) {
    results.recommendations.push({
      priority: 'low',
      category: 'optimization',
      title: 'Continuous Improvement Opportunities',
      action: 'Test micro-optimizations: A/B test CTA copy variations, test different social proof numbers, experiment with color variations'
    });

    results.recommendations.push({
      priority: 'low',
      category: 'monitoring',
      title: 'Set Up Real-Time Analytics',
      action: 'Deploy monitoring dashboard to track actual conversion rates and validate revenue projections'
    });

    results.recommendations.push({
      priority: 'low',
      category: 'expansion',
      title: 'Expand to New Segments',
      action: 'Consider creating additional pages for emerging use cases (AI coding, legal research, healthcare)'
    });
  }
}

// Run tests
const success = runTests();
process.exit(success ? 0 : 1);
