#!/usr/bin/env node

/**
 * Feature #78 Validation Test Suite
 * Wave 2 Results Analysis + Scaling + Wave 3 Design
 */

const fs = require('fs');
const path = require('path');

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility functions
function testExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  results.tests.push({
    name: description,
    passed: exists,
    error: exists ? null : `File not found: ${filePath}`
  });
  if (exists) results.passed++;
  else results.failed++;
  return exists;
}

function testFileSize(filePath, minSize, description) {
  if (!fs.existsSync(filePath)) {
    results.tests.push({
      name: description,
      passed: false,
      error: `File not found: ${filePath}`
    });
    results.failed++;
    return false;
  }

  const stats = fs.statSync(filePath);
  const passed = stats.size >= minSize;
  results.tests.push({
    name: description,
    passed: passed,
    error: passed ? null : `File too small: ${stats.size} bytes (min: ${minSize})`
  });
  if (passed) results.passed++;
  else results.failed++;
  return passed;
}

function testJSONValid(filePath, description) {
  if (!fs.existsSync(filePath)) {
    results.tests.push({
      name: description,
      passed: false,
      error: `File not found: ${filePath}`
    });
    results.failed++;
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    results.tests.push({
      name: description,
      passed: true,
      error: null
    });
    results.passed++;
    return true;
  } catch (error) {
    results.tests.push({
      name: description,
      passed: false,
      error: `Invalid JSON: ${error.message}`
    });
    results.failed++;
    return false;
  }
}

function testContains(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    results.tests.push({
      name: description,
      passed: false,
      error: `File not found: ${filePath}`
    });
    results.failed++;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const passed = content.includes(searchString);
  results.tests.push({
    name: description,
    passed: passed,
    error: passed ? null : `String not found: "${searchString}"`
  });
  if (passed) results.passed++;
  else results.failed++;
  return passed;
}

function testMultiplePatterns(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    results.tests.push({
      name: description,
      passed: false,
      error: `File not found: ${filePath}`
    });
    results.failed++;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const foundPatterns = patterns.filter(p => content.includes(p));
  const passed = foundPatterns.length >= Math.ceil(patterns.length * 0.7); // 70% threshold

  results.tests.push({
    name: description,
    passed: passed,
    error: passed ? null : `Found ${foundPatterns.length}/${patterns.length} patterns`
  });
  if (passed) results.passed++;
  else results.failed++;
  return passed;
}

console.log('\n' + '='.repeat(60));
console.log('🧪 FEATURE #78 VALIDATION TEST SUITE');
console.log('='.repeat(60) + '\n');

// Category 1: Wave 2 Test Results Data
console.log('📊 Category 1: Wave 2 Test Results Data\n');

testExists(
  'reports/wave2/test-results-day-14.json',
  '1.1 Wave 2 test results file exists'
);

testFileSize(
  'reports/wave2/test-results-day-14.json',
  10000,
  '1.2 Test results file is substantial (>10KB)'
);

testJSONValid(
  'reports/wave2/test-results-day-14.json',
  '1.3 Test results JSON is valid'
);

testContains(
  'reports/wave2/test-results-day-14.json',
  'WINNER',
  '1.4 Test results contain winner designation'
);

testMultiplePatterns(
  'reports/wave2/test-results-day-14.json',
  ['Mobile-Optimized Combo', 'Social Proof', 'Scarcity + Trust', '+56.6%', '+44.2%', '+27.9%'],
  '1.5 Test results contain all three patterns with lifts'
);

testContains(
  'reports/wave2/test-results-day-14.json',
  '99.9%',
  '1.6 Test results show statistical confidence'
);

// Category 2: Wave 2 Analysis Report
console.log('\n📋 Category 2: Wave 2 Analysis Report\n');

testExists(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  '2.1 Wave 2 analysis report exists'
);

testFileSize(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  30000,
  '2.2 Analysis report is comprehensive (>30KB)'
);

testContains(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  'Executive Summary',
  '2.3 Report has executive summary'
);

testContains(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  'Key Learnings',
  '2.4 Report documents key learnings'
);

testMultiplePatterns(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  ['Scaling Strategy', 'Revenue Impact', 'Statistical Validity', 'Core Web Vitals'],
  '2.5 Report covers critical analysis areas'
);

testContains(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  'Wave 3',
  '2.6 Report includes Wave 3 recommendations'
);

// Category 3: Scaling Script & Execution
console.log('\n🚀 Category 3: Scaling Script & Execution\n');

testExists(
  'scripts/scale-wave2-winners.js',
  '3.1 Scaling script exists'
);

testFileSize(
  'scripts/scale-wave2-winners.js',
  15000,
  '3.2 Scaling script is substantial (>15KB)'
);

testContains(
  'scripts/scale-wave2-winners.js',
  'applyMobileOptimized',
  '3.3 Script has mobile optimization function'
);

testContains(
  'scripts/scale-wave2-winners.js',
  'applySocialProof',
  '3.4 Script has social proof function'
);

testContains(
  'scripts/scale-wave2-winners.js',
  'applyScarcityTrust',
  '3.5 Script has scarcity+trust function'
);

testExists(
  'reports/wave2/scaling-report.json',
  '3.6 Scaling execution report exists'
);

testJSONValid(
  'reports/wave2/scaling-report.json',
  '3.7 Scaling report JSON is valid'
);

// Category 4: Pattern Application to Pages
console.log('\n📄 Category 4: Pattern Application to Pages\n');

const pagesToCheck = [
  'trust.html',
  'workspace.html',
  'research.html',
  'productivity.html',
  'apple-style.html',
  'valentine.html',
  'comparison.html',
  'future.html'
];

let pagesWithMobile = 0;
pagesToCheck.forEach(page => {
  const filePath = path.join('pages', page);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Mobile-Optimized Pattern') ||
        content.includes('mobile-sticky-cta')) {
      pagesWithMobile++;
    }
  }
});

results.tests.push({
  name: '4.1 Mobile-Optimized pattern applied to 8 pages',
  passed: pagesWithMobile >= 8,
  error: pagesWithMobile >= 8 ? null : `Only ${pagesWithMobile}/8 pages have mobile pattern`
});
if (pagesWithMobile >= 8) results.passed++;
else results.failed++;

let pagesWithSocialProof = 0;
['trust.html', 'research.html', 'apple-style.html', 'valentine.html'].forEach(page => {
  const filePath = path.join('pages', page);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Social Proof Pattern') ||
        content.includes('social-proof-banner')) {
      pagesWithSocialProof++;
    }
  }
});

results.tests.push({
  name: '4.2 Social Proof pattern applied to 4 desktop pages',
  passed: pagesWithSocialProof >= 4,
  error: pagesWithSocialProof >= 4 ? null : `Only ${pagesWithSocialProof}/4 pages have social proof`
});
if (pagesWithSocialProof >= 4) results.passed++;
else results.failed++;

let pagesWithScarcity = 0;
['workspace.html', 'productivity.html'].forEach(page => {
  const filePath = path.join('pages', page);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Scarcity + Trust Pattern') ||
        content.includes('trust-badge-bar')) {
      pagesWithScarcity++;
    }
  }
});

results.tests.push({
  name: '4.3 Scarcity+Trust pattern applied to 2 critical pages',
  passed: pagesWithScarcity >= 2,
  error: pagesWithScarcity >= 2 ? null : `Only ${pagesWithScarcity}/2 pages have scarcity pattern`
});
if (pagesWithScarcity >= 2) results.passed++;
else results.failed++;

// Category 5: Wave 3 Test Design
console.log('\n🧪 Category 5: Wave 3 Test Design\n');

testExists(
  'docs/WAVE3-TEST-DESIGN.md',
  '5.1 Wave 3 test design document exists'
);

testFileSize(
  'docs/WAVE3-TEST-DESIGN.md',
  25000,
  '5.2 Wave 3 design is comprehensive (>25KB)'
);

testContains(
  'docs/WAVE3-TEST-DESIGN.md',
  'Triple Threat Combo',
  '5.3 Wave 3 includes Triple Threat test'
);

testContains(
  'docs/WAVE3-TEST-DESIGN.md',
  'Video + Social Proof',
  '5.4 Wave 3 includes Video test'
);

testContains(
  'docs/WAVE3-TEST-DESIGN.md',
  'AI Personalization',
  '5.5 Wave 3 includes AI Personalization test'
);

testContains(
  'docs/WAVE3-TEST-DESIGN.md',
  'Interactive Demos',
  '5.6 Wave 3 includes Interactive Demos test'
);

testMultiplePatterns(
  'docs/WAVE3-TEST-DESIGN.md',
  ['Implementation Plan', 'Expected Results', 'Success Criteria', 'Risks & Mitigation'],
  '5.7 Wave 3 design includes critical planning sections'
);

// Category 6: Documentation Quality
console.log('\n📚 Category 6: Documentation Quality\n');

testMultiplePatterns(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  ['Revenue Impact', 'ROI', 'Statistical', 'Confidence', 'Lift'],
  '6.1 Analysis includes quantitative metrics'
);

testMultiplePatterns(
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  ['What Worked', 'What Didn\'t Work', 'Surprises', 'Learnings'],
  '6.2 Analysis includes qualitative insights'
);

testMultiplePatterns(
  'docs/WAVE3-TEST-DESIGN.md',
  ['Hypothesis', 'Traffic Split', 'Success Metrics', 'Expected Results'],
  '6.3 Wave 3 design includes test specifications'
);

testContains(
  'docs/WAVE3-TEST-DESIGN.md',
  'Risk',
  '6.4 Wave 3 design includes risk analysis'
);

// Category 7: Feature Completeness
console.log('\n✅ Category 7: Feature Completeness\n');

const requiredFiles = [
  'reports/wave2/test-results-day-14.json',
  'reports/wave2/scaling-report.json',
  'docs/WAVE2-RESULTS-ANALYSIS.md',
  'docs/WAVE3-TEST-DESIGN.md',
  'scripts/scale-wave2-winners.js'
];

const allFilesExist = requiredFiles.every(f => fs.existsSync(f));
results.tests.push({
  name: '7.1 All required files created',
  passed: allFilesExist,
  error: allFilesExist ? null : 'Some required files missing'
});
if (allFilesExist) results.passed++;
else results.failed++;

// Check scaling report content
if (fs.existsSync('reports/wave2/scaling-report.json')) {
  try {
    const scalingReport = JSON.parse(fs.readFileSync('reports/wave2/scaling-report.json', 'utf8'));
    const totalUpdated = scalingReport.totalPagesUpdated || 0;
    const passed = totalUpdated >= 10; // Should have updated at least 10 pattern applications
    results.tests.push({
      name: '7.2 Scaling report shows substantial updates',
      passed: passed,
      error: passed ? null : `Only ${totalUpdated} pattern applications (expected 14+)`
    });
    if (passed) results.passed++;
    else results.failed++;
  } catch (e) {
    results.tests.push({
      name: '7.2 Scaling report shows substantial updates',
      passed: false,
      error: `Error reading scaling report: ${e.message}`
    });
    results.failed++;
  }
}

// Check test results completeness
if (fs.existsSync('reports/wave2/test-results-day-14.json')) {
  try {
    const testResults = JSON.parse(fs.readFileSync('reports/wave2/test-results-day-14.json', 'utf8'));
    const hasAllPatterns = testResults.patterns && testResults.patterns.length >= 4;
    results.tests.push({
      name: '7.3 Test results include all patterns (control + 3 variants)',
      passed: hasAllPatterns,
      error: hasAllPatterns ? null : 'Missing pattern data'
    });
    if (hasAllPatterns) results.passed++;
    else results.failed++;
  } catch (e) {
    results.tests.push({
      name: '7.3 Test results include all patterns',
      passed: false,
      error: `Error reading test results: ${e.message}`
    });
    results.failed++;
  }
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60) + '\n');

console.log(`Total Tests: ${results.passed + results.failed}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`Pass Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

// Calculate grade
const passRate = results.passed / (results.passed + results.failed);
let grade;
if (passRate >= 0.97) grade = 'A+';
else if (passRate >= 0.93) grade = 'A';
else if (passRate >= 0.90) grade = 'A-';
else if (passRate >= 0.87) grade = 'B+';
else if (passRate >= 0.83) grade = 'B';
else if (passRate >= 0.80) grade = 'B-';
else if (passRate >= 0.77) grade = 'C+';
else if (passRate >= 0.70) grade = 'C';
else grade = 'F';

console.log(`Grade: ${grade}`);
console.log('\n' + '='.repeat(60) + '\n');

// Print failed tests if any
if (results.failed > 0) {
  console.log('❌ Failed Tests:\n');
  results.tests.filter(t => !t.passed).forEach((test, i) => {
    console.log(`${i + 1}. ${test.name}`);
    console.log(`   Error: ${test.error}\n`);
  });
}

// Save results
const reportDir = 'test-reports-feature-78';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const report = {
  feature: 78,
  timestamp: new Date().toISOString(),
  summary: {
    total: results.passed + results.failed,
    passed: results.passed,
    failed: results.failed,
    passRate: `${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`,
    grade: grade
  },
  tests: results.tests,
  categories: {
    'Wave 2 Test Results': results.tests.slice(0, 6).filter(t => t.passed).length + '/6',
    'Wave 2 Analysis Report': results.tests.slice(6, 12).filter(t => t.passed).length + '/6',
    'Scaling Script': results.tests.slice(12, 19).filter(t => t.passed).length + '/7',
    'Pattern Application': results.tests.slice(19, 22).filter(t => t.passed).length + '/3',
    'Wave 3 Design': results.tests.slice(22, 29).filter(t => t.passed).length + '/7',
    'Documentation Quality': results.tests.slice(29, 33).filter(t => t.passed).length + '/4',
    'Feature Completeness': results.tests.slice(33).filter(t => t.passed).length + '/3'
  }
};

fs.writeFileSync(
  path.join(reportDir, 'validation-results.json'),
  JSON.stringify(report, null, 2),
  'utf8'
);

console.log(`✅ Test report saved to ${reportDir}/validation-results.json\n`);

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
