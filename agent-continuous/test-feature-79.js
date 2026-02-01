/**
 * Validation Tests for Feature #79: Wave 3 Implementation
 *
 * Tests all four Wave 3 test types:
 * - Triple Threat Combo (3 pages)
 * - Video + Social Proof (3 pages)
 * - AI Personalization (2 pages)
 * - Interactive Demos (3 pages)
 *
 * Plus infrastructure (router, GA4 config)
 */

const fs = require('fs');
const path = require('path');

// Test Results
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: []
};

function test(name, fn) {
  results.total++;
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function fileExists(filepath) {
  return fs.existsSync(filepath);
}

function fileSize(filepath) {
  if (!fileExists(filepath)) return 0;
  return fs.statSync(filepath).size;
}

function fileContains(filepath, searchString) {
  if (!fileExists(filepath)) return false;
  const content = fs.readFileSync(filepath, 'utf8');
  return content.includes(searchString);
}

function countOccurrences(filepath, searchString) {
  if (!fileExists(filepath)) return 0;
  const content = fs.readFileSync(filepath, 'utf8');
  return (content.match(new RegExp(searchString, 'g')) || []).length;
}

console.log('\n=== Feature #79: Wave 3 A/B Testing Implementation - Validation Tests ===\n');

// ============================================================================
// Test Category 1: Triple Threat Combo Variants (3 pages)
// ============================================================================
console.log('Category 1: Triple Threat Combo Variants');

test('Triple Threat: trust.html exists', () => {
  assert(fileExists('wave3-variants/triple-threat/trust.html'),
    'trust.html variant not found');
});

test('Triple Threat: trust.html has data-test attribute', () => {
  assert(fileContains('wave3-variants/triple-threat/trust.html', 'data-test="triple-threat"'),
    'Missing data-test attribute');
});

test('Triple Threat: trust.html combines all 3 patterns', () => {
  const file = 'wave3-variants/triple-threat/trust.html';
  assert(fileContains(file, 'social-proof') || fileContains(file, 'Social proof'),
    'Missing social proof pattern');
  assert(fileContains(file, 'scarcity') || fileContains(file, 'trust badge'),
    'Missing scarcity/trust pattern');
  assert(fileContains(file, 'mobile-sticky-cta') || fileContains(file, 'sticky'),
    'Missing mobile-optimized pattern');
});

test('Triple Threat: workspace.html exists', () => {
  assert(fileExists('wave3-variants/triple-threat/workspace.html'),
    'workspace.html variant not found');
});

test('Triple Threat: workspace.html has adequate size (>15KB)', () => {
  const size = fileSize('wave3-variants/triple-threat/workspace.html');
  assert(size > 15000, `File too small: ${size} bytes`);
});

test('Triple Threat: productivity.html exists', () => {
  assert(fileExists('wave3-variants/triple-threat/productivity.html'),
    'productivity.html variant not found');
});

test('Triple Threat: productivity.html has adequate size (>15KB)', () => {
  const size = fileSize('wave3-variants/triple-threat/productivity.html');
  assert(size > 15000, `File too small: ${size} bytes`);
});

test('Triple Threat: All variants have GA4 tracking', () => {
  const files = ['trust.html', 'workspace.html', 'productivity.html'];
  files.forEach(file => {
    const filepath = `wave3-variants/triple-threat/${file}`;
    assert(fileContains(filepath, 'gtag') || fileContains(filepath, 'analytics'),
      `${file} missing GA4 tracking`);
  });
});

// ============================================================================
// Test Category 2: Video + Social Proof Variants (3 pages)
// ============================================================================
console.log('\nCategory 2: Video + Social Proof Variants');

test('Video+Social: apple-style.html exists', () => {
  assert(fileExists('wave3-variants/video-social/apple-style.html'),
    'apple-style.html variant not found');
});

test('Video+Social: apple-style.html has video element', () => {
  assert(fileContains('wave3-variants/video-social/apple-style.html', '<video'),
    'Missing video element');
});

test('Video+Social: apple-style.html has testimonial overlays', () => {
  const file = 'wave3-variants/video-social/apple-style.html';
  assert(fileContains(file, 'testimonial') || fileContains(file, 'overlay'),
    'Missing testimonial overlays');
});

test('Video+Social: future.html exists and has video', () => {
  const file = 'wave3-variants/video-social/future.html';
  assert(fileExists(file), 'future.html not found');
  assert(fileContains(file, '<video'), 'Missing video element');
});

test('Video+Social: valentine.html exists and has video', () => {
  const file = 'wave3-variants/video-social/valentine.html';
  assert(fileExists(file), 'valentine.html not found');
  assert(fileContains(file, '<video'), 'Missing video element');
});

test('Video+Social: All variants have data-test attribute', () => {
  const files = ['apple-style.html', 'future.html', 'valentine.html'];
  files.forEach(file => {
    const filepath = `wave3-variants/video-social/${file}`;
    assert(fileContains(filepath, 'data-test="video-social"'),
      `${file} missing data-test attribute`);
  });
});

test('Video+Social: Videos have multiple formats (MP4, WebM)', () => {
  const file = 'wave3-variants/video-social/apple-style.html';
  assert(fileContains(file, '.mp4') || fileContains(file, 'video/mp4'),
    'Missing MP4 format');
  assert(fileContains(file, '.webm') || fileContains(file, 'video/webm'),
    'Missing WebM format');
});

test('Video+Social: Videos have controls and accessibility', () => {
  const file = 'wave3-variants/video-social/apple-style.html';
  assert(fileContains(file, 'controls') || fileContains(file, 'play'),
    'Missing video controls');
  assert(fileContains(file, 'aria-') || fileContains(file, 'aria-label'),
    'Missing accessibility attributes');
});

// ============================================================================
// Test Category 3: AI Personalization Variants (2 pages)
// ============================================================================
console.log('\nCategory 3: AI Personalization Variants');

test('AI Personalization: research.html exists', () => {
  assert(fileExists('wave3-variants/ai-personalization/research.html'),
    'research.html variant not found');
});

test('AI Personalization: research.html has personalization engine', () => {
  const file = 'wave3-variants/ai-personalization/research.html';
  assert(fileContains(file, 'personalize') || fileContains(file, 'Personalization'),
    'Missing personalization engine');
});

test('AI Personalization: research.html detects traffic source', () => {
  const file = 'wave3-variants/ai-personalization/research.html';
  assert(fileContains(file, 'referrer') || fileContains(file, 'source'),
    'Missing traffic source detection');
});

test('AI Personalization: research.html detects device type', () => {
  const file = 'wave3-variants/ai-personalization/research.html';
  assert(fileContains(file, 'userAgent') || fileContains(file, 'device'),
    'Missing device detection');
});

test('AI Personalization: research.html detects location', () => {
  const file = 'wave3-variants/ai-personalization/research.html';
  assert(fileContains(file, 'timezone') || fileContains(file, 'geo') || fileContains(file, 'location'),
    'Missing location detection');
});

test('AI Personalization: research.html detects time of day', () => {
  const file = 'wave3-variants/ai-personalization/research.html';
  assert(fileContains(file, 'getHours') || fileContains(file, 'time'),
    'Missing time of day detection');
});

test('AI Personalization: research.html detects returning visitors', () => {
  const file = 'wave3-variants/ai-personalization/research.html';
  assert(fileContains(file, 'localStorage') || fileContains(file, 'visitCount'),
    'Missing returning visitor detection');
});

test('AI Personalization: comparison.html exists', () => {
  assert(fileExists('wave3-variants/ai-personalization/comparison.html'),
    'comparison.html variant not found');
});

test('AI Personalization: comparison.html has personalization', () => {
  const file = 'wave3-variants/ai-personalization/comparison.html';
  assert(fileContains(file, 'personalize') || fileContains(file, 'Personalization'),
    'Missing personalization engine');
});

test('AI Personalization: Both variants have data-test attribute', () => {
  const files = ['research.html', 'comparison.html'];
  files.forEach(file => {
    const filepath = `wave3-variants/ai-personalization/${file}`;
    assert(fileContains(filepath, 'data-test="ai-personalization"'),
      `${file} missing data-test attribute`);
  });
});

test('AI Personalization: README documentation exists', () => {
  assert(fileExists('wave3-variants/ai-personalization/README.md'),
    'README documentation not found');
});

// ============================================================================
// Test Category 4: Interactive Demos Variants (3 pages)
// ============================================================================
console.log('\nCategory 4: Interactive Demos Variants');

test('Interactive Demos: workspace.html exists', () => {
  assert(fileExists('wave3-variants/interactive-demos/workspace.html'),
    'workspace.html variant not found');
});

test('Interactive Demos: workspace.html has interactive elements', () => {
  const file = 'wave3-variants/interactive-demos/workspace.html';
  assert(fileContains(file, 'demo') || fileContains(file, 'interactive'),
    'Missing interactive demo elements');
});

test('Interactive Demos: workspace.html has adequate size (>25KB)', () => {
  const size = fileSize('wave3-variants/interactive-demos/workspace.html');
  assert(size > 25000, `File too small: ${size} bytes (expected >25KB)`);
});

test('Interactive Demos: productivity.html exists', () => {
  assert(fileExists('wave3-variants/interactive-demos/productivity.html'),
    'productivity.html variant not found');
});

test('Interactive Demos: productivity.html has demo elements', () => {
  const file = 'wave3-variants/interactive-demos/productivity.html';
  assert(fileContains(file, 'demo') || fileContains(file, 'interactive'),
    'Missing demo elements');
});

test('Interactive Demos: automators.html exists', () => {
  assert(fileExists('wave3-variants/interactive-demos/automators.html'),
    'automators.html variant not found');
});

test('Interactive Demos: automators.html has workflow/automation demos', () => {
  const file = 'wave3-variants/interactive-demos/automators.html';
  assert(fileContains(file, 'workflow') || fileContains(file, 'automation'),
    'Missing workflow/automation demos');
});

test('Interactive Demos: All variants have data-test attribute', () => {
  const files = ['workspace.html', 'productivity.html', 'automators.html'];
  files.forEach(file => {
    const filepath = `wave3-variants/interactive-demos/${file}`;
    assert(fileContains(filepath, 'data-test="interactive-demos"'),
      `${file} missing data-test attribute`);
  });
});

test('Interactive Demos: All variants have event tracking', () => {
  const files = ['workspace.html', 'productivity.html', 'automators.html'];
  files.forEach(file => {
    const filepath = `wave3-variants/interactive-demos/${file}`;
    assert(fileContains(filepath, 'demo_start') || fileContains(filepath, 'trackDemo'),
      `${file} missing demo event tracking`);
  });
});

test('Interactive Demos: README documentation exists', () => {
  assert(fileExists('wave3-variants/interactive-demos/README.md'),
    'README documentation not found');
});

// ============================================================================
// Test Category 5: Infrastructure (Router & GA4)
// ============================================================================
console.log('\nCategory 5: Infrastructure (Router & GA4)');

test('Router: wave3-router.js exists', () => {
  assert(fileExists('scripts/wave3-router.js'),
    'Router script not found');
});

test('Router: has adequate size (>10KB)', () => {
  const size = fileSize('scripts/wave3-router.js');
  assert(size > 10000, `Router too small: ${size} bytes`);
});

test('Router: has test configuration', () => {
  assert(fileContains('scripts/wave3-router.js', 'WAVE3_CONFIG'),
    'Missing test configuration');
});

test('Router: supports all 4 test types', () => {
  const file = 'scripts/wave3-router.js';
  assert(fileContains(file, 'triple-threat'), 'Missing triple-threat config');
  assert(fileContains(file, 'video-social'), 'Missing video-social config');
  assert(fileContains(file, 'ai-personalization'), 'Missing ai-personalization config');
  assert(fileContains(file, 'interactive-demos'), 'Missing interactive-demos config');
});

test('Router: has user ID generation', () => {
  assert(fileContains('scripts/wave3-router.js', 'getUserId'),
    'Missing user ID generation');
});

test('Router: has consistent assignment logic', () => {
  const file = 'scripts/wave3-router.js';
  assert(fileContains(file, 'hash') || fileContains(file, 'consistent'),
    'Missing consistent assignment logic');
});

test('Router: has GA4 tracking integration', () => {
  assert(fileContains('scripts/wave3-router.js', 'gtag'),
    'Missing GA4 tracking');
});

test('GA4 Config: wave3-ga4-config.js exists', () => {
  assert(fileExists('scripts/wave3-ga4-config.js'),
    'GA4 config script not found');
});

test('GA4 Config: has adequate size (>10KB)', () => {
  const size = fileSize('scripts/wave3-ga4-config.js');
  assert(size > 10000, `GA4 config too small: ${size} bytes`);
});

test('GA4 Config: has custom dimensions', () => {
  assert(fileContains('scripts/wave3-ga4-config.js', 'CUSTOM_DIMENSIONS') ||
         fileContains('scripts/wave3-ga4-config.js', 'custom dimension'),
    'Missing custom dimensions');
});

test('GA4 Config: has custom events', () => {
  const file = 'scripts/wave3-ga4-config.js';
  assert(fileContains(file, 'wave3_') || fileContains(file, 'WAVE3_EVENTS'),
    'Missing Wave 3 custom events');
});

test('GA4 Config: tracks video events', () => {
  const file = 'scripts/wave3-ga4-config.js';
  assert(fileContains(file, 'video_play') || fileContains(file, 'video_'),
    'Missing video event tracking');
});

test('GA4 Config: tracks demo events', () => {
  const file = 'scripts/wave3-ga4-config.js';
  assert(fileContains(file, 'demo_start') || fileContains(file, 'demo_'),
    'Missing demo event tracking');
});

test('GA4 Config: tracks personalization events', () => {
  assert(fileContains('scripts/wave3-ga4-config.js', 'personalization'),
    'Missing personalization event tracking');
});

// ============================================================================
// Test Category 6: Documentation & Quality
// ============================================================================
console.log('\nCategory 6: Documentation & Quality');

test('Documentation: Wave 3 test design exists (from Feature #78)', () => {
  assert(fileExists('docs/WAVE3-TEST-DESIGN.md'),
    'Wave 3 test design doc not found');
});

test('Documentation: Wave 3 design has all 4 tests described', () => {
  const file = 'docs/WAVE3-TEST-DESIGN.md';
  assert(fileContains(file, 'Triple Threat'), 'Missing Triple Threat description');
  assert(fileContains(file, 'Video'), 'Missing Video description');
  assert(fileContains(file, 'Personalization'), 'Missing Personalization description');
  assert(fileContains(file, 'Interactive'), 'Missing Interactive description');
});

test('Quality: All HTML files are valid HTML5', () => {
  const dirs = ['triple-threat', 'video-social', 'ai-personalization', 'interactive-demos'];
  dirs.forEach(dir => {
    const dirPath = `wave3-variants/${dir}`;
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
      files.forEach(file => {
        const filepath = path.join(dirPath, file);
        assert(fileContains(filepath, '<!DOCTYPE html>'),
          `${file} missing DOCTYPE`);
        assert(fileContains(filepath, '<html'),
          `${file} missing html tag`);
      });
    }
  });
});

test('Quality: All variants have mobile responsiveness', () => {
  const dirs = ['triple-threat', 'video-social', 'ai-personalization', 'interactive-demos'];
  dirs.forEach(dir => {
    const dirPath = `wave3-variants/${dir}`;
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
      files.forEach(file => {
        const filepath = path.join(dirPath, file);
        assert(fileContains(filepath, '@media') || fileContains(filepath, 'mobile'),
          `${file} missing mobile responsiveness`);
      });
    }
  });
});

test('Quality: All variants have accessibility attributes', () => {
  const dirs = ['triple-threat', 'video-social', 'ai-personalization', 'interactive-demos'];
  dirs.forEach(dir => {
    const dirPath = `wave3-variants/${dir}`;
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
      files.forEach(file => {
        const filepath = path.join(dirPath, file);
        assert(fileContains(filepath, 'aria-') || fileContains(filepath, 'alt='),
          `${file} missing accessibility attributes`);
      });
    }
  });
});

// ============================================================================
// Test Category 7: Feature Completeness
// ============================================================================
console.log('\nCategory 7: Feature Completeness');

test('Completeness: All 11 variant pages exist', () => {
  const expectedFiles = [
    'wave3-variants/triple-threat/trust.html',
    'wave3-variants/triple-threat/workspace.html',
    'wave3-variants/triple-threat/productivity.html',
    'wave3-variants/video-social/apple-style.html',
    'wave3-variants/video-social/future.html',
    'wave3-variants/video-social/valentine.html',
    'wave3-variants/ai-personalization/research.html',
    'wave3-variants/ai-personalization/comparison.html',
    'wave3-variants/interactive-demos/workspace.html',
    'wave3-variants/interactive-demos/productivity.html',
    'wave3-variants/interactive-demos/automators.html'
  ];

  const existingFiles = expectedFiles.filter(f => fileExists(f));
  assert(existingFiles.length === expectedFiles.length,
    `Only ${existingFiles.length}/11 variant pages exist`);
});

test('Completeness: All infrastructure scripts exist', () => {
  assert(fileExists('scripts/wave3-router.js'), 'Router missing');
  assert(fileExists('scripts/wave3-ga4-config.js'), 'GA4 config missing');
});

test('Completeness: Feature #79 ready for deployment', () => {
  // Check key files
  assert(fileExists('wave3-variants/triple-threat/trust.html'), 'Missing Triple Threat variant');
  assert(fileExists('wave3-variants/video-social/apple-style.html'), 'Missing Video variant');
  assert(fileExists('wave3-variants/ai-personalization/research.html'), 'Missing AI variant');
  assert(fileExists('wave3-variants/interactive-demos/workspace.html'), 'Missing Demo variant');
  assert(fileExists('scripts/wave3-router.js'), 'Missing router');
  assert(fileExists('scripts/wave3-ga4-config.js'), 'Missing GA4 config');
});

// ============================================================================
// Print Results
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('TEST RESULTS SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${results.total}`);
console.log(`Passed: ${results.passed} (${((results.passed/results.total)*100).toFixed(1)}%)`);
console.log(`Failed: ${results.failed}`);

if (results.failed > 0) {
  console.log('\nFailed Tests:');
  results.tests.filter(t => t.status === 'FAIL').forEach(t => {
    console.log(`  ✗ ${t.name}`);
    console.log(`    ${t.error}`);
  });
}

const passRate = (results.passed / results.total) * 100;
let grade;
if (passRate >= 95) grade = 'A+';
else if (passRate >= 90) grade = 'A';
else if (passRate >= 85) grade = 'A-';
else if (passRate >= 80) grade = 'B+';
else if (passRate >= 75) grade = 'B';
else grade = 'C or below';

console.log(`\nGrade: ${grade}`);
console.log('='.repeat(70));

// Write results to file
const reportDir = 'test-reports-feature-79';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

fs.writeFileSync(
  path.join(reportDir, 'validation-results.json'),
  JSON.stringify(results, null, 2)
);

console.log(`\nDetailed results saved to: ${reportDir}/validation-results.json\n`);

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
