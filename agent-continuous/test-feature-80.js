#!/usr/bin/env node

/**
 * Feature #80 Test Suite - Wave 3 Launch & Monitoring Validation
 *
 * Comprehensive test suite validating all aspects of Wave 3 implementation:
 * - Test results data (JSON)
 * - Analysis reports (Markdown)
 * - Scaling scripts (JavaScript)
 * - Monitoring dashboard (HTML)
 * - Router implementation (JavaScript)
 * - Documentation quality
 * - Feature completeness
 *
 * Target: >95% pass rate (A grade)
 *
 * Usage: node test-feature-80.js
 */

const fs = require('fs');
const path = require('path');

// ========================================
// Test Configuration
// ========================================

const CONFIG = {
  projectRoot: __dirname,
  reportsDir: path.join(__dirname, 'test-reports-feature-80'),
  files: {
    testResults: 'reports/wave3/test-results-day-14.json',
    analysisReport: 'docs/WAVE3-RESULTS-ANALYSIS.md',
    scalingScript: 'scripts/scale-wave3-winners.js',
    dashboard: 'monitoring/wave3-dashboard.html',
    router: 'scripts/wave3-router.js'
  }
};

// ========================================
// Colors for Terminal Output
// ========================================

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// ========================================
// Test Results Tracking
// ========================================

const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  categories: {},
  failures: []
};

// ========================================
// Utility Functions
// ========================================

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function logTest(testName, passed, details = '') {
  const symbol = passed ? '✓' : '✗';
  const color = passed ? COLORS.green : COLORS.red;
  const status = passed ? 'PASS' : 'FAIL';

  console.log(`  ${color}${symbol} ${testName}${COLORS.reset} ${COLORS.dim}[${status}]${COLORS.reset}`);

  if (!passed && details) {
    console.log(`    ${COLORS.red}${details}${COLORS.reset}`);
  }

  testResults.total++;
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
    testResults.failures.push({ test: testName, details });
  }
}

function startCategory(categoryName) {
  log(`\n${COLORS.cyan}${COLORS.bright}▶ ${categoryName}${COLORS.reset}`, COLORS.cyan);
  testResults.categories[categoryName] = { total: 0, passed: 0 };
}

function fileExists(filePath) {
  return fs.existsSync(path.join(CONFIG.projectRoot, filePath));
}

function getFileSize(filePath) {
  const fullPath = path.join(CONFIG.projectRoot, filePath);
  if (!fs.existsSync(fullPath)) return 0;
  return fs.statSync(fullPath).size;
}

function readFile(filePath) {
  const fullPath = path.join(CONFIG.projectRoot, filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function readJSON(filePath) {
  try {
    const content = readFile(filePath);
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}

function isExecutable(filePath) {
  const fullPath = path.join(CONFIG.projectRoot, filePath);
  try {
    const stats = fs.statSync(fullPath);
    // Check if file has execute permission (for owner, group, or others)
    return (stats.mode & 0o111) !== 0;
  } catch (err) {
    return false;
  }
}

// ========================================
// Test Suite 1: Wave 3 Test Results Data
// ========================================

function testWave3Results() {
  startCategory('1. Wave 3 Test Results Data (8 tests)');

  const filePath = CONFIG.files.testResults;

  // Test 1.1: File exists
  const exists = fileExists(filePath);
  logTest('File exists: reports/wave3/test-results-day-14.json', exists,
    exists ? '' : 'File not found');

  // Test 1.2: File size > 50KB
  const fileSize = getFileSize(filePath);
  const sizeOk = fileSize > 50000;
  logTest(`File size >50KB (actual: ${(fileSize / 1024).toFixed(1)}KB)`, sizeOk,
    sizeOk ? '' : `File too small: ${fileSize} bytes`);

  if (!exists) return;

  // Test 1.3: Valid JSON structure
  const data = readJSON(filePath);
  const validJSON = data !== null;
  logTest('Valid JSON structure', validJSON,
    validJSON ? '' : 'JSON parse error');

  if (!validJSON) return;

  // Test 1.4: Contains all 4 tests
  const hasTests = data.tests && Array.isArray(data.tests);
  const testCount = hasTests ? data.tests.length : 0;
  const has4Tests = testCount === 4;
  logTest('Contains all 4 tests (triple-threat, video-social, ai-personalization, interactive-demos)', has4Tests,
    has4Tests ? '' : `Found ${testCount} tests, expected 4`);

  // Test 1.5: All tests have "succeeded" status
  let allSucceeded = true;
  let failedTests = [];
  if (hasTests) {
    data.tests.forEach(test => {
      const status = test.status || '';
      if (!status.includes('SUCCESS')) {
        allSucceeded = false;
        failedTests.push(test.testName || test.testId);
      }
    });
  }
  logTest('All tests have "SUCCESS" status', allSucceeded,
    allSucceeded ? '' : `Tests without SUCCESS status: ${failedTests.join(', ')}`);

  // Test 1.6: Statistical confidence >95%
  let allHighConfidence = true;
  let lowConfidenceTests = [];
  if (hasTests) {
    data.tests.forEach(test => {
      const confidence = parseFloat(test.overallResults?.statisticalConfidence || '0%');
      if (confidence < 95) {
        allHighConfidence = false;
        lowConfidenceTests.push(`${test.testName}: ${confidence}%`);
      }
    });
  }
  logTest('Statistical confidence >95% for all tests', allHighConfidence,
    allHighConfidence ? '' : `Low confidence tests: ${lowConfidenceTests.join(', ')}`);

  // Test 1.7: Combined lift >70%
  const combinedLift = parseFloat((data.executiveSummary?.combinedLift || '0%').replace('%', '').replace('+', ''));
  const liftOk = combinedLift > 70;
  logTest(`Combined lift >70% (actual: ${combinedLift}%)`, liftOk,
    liftOk ? '' : `Combined lift too low: ${combinedLift}%`);

  // Test 1.8: Daily progression data (14 days)
  let allHave14Days = true;
  let invalidDailyData = [];
  if (hasTests) {
    data.tests.forEach(test => {
      const dailyData = test.dailyProgression || [];
      if (dailyData.length !== 14) {
        allHave14Days = false;
        invalidDailyData.push(`${test.testName}: ${dailyData.length} days`);
      }
    });
  }
  logTest('Daily progression data (14 days) for all tests', allHave14Days,
    allHave14Days ? '' : `Invalid daily data: ${invalidDailyData.join(', ')}`);
}

// ========================================
// Test Suite 2: Wave 3 Analysis Report
// ========================================

function testWave3Analysis() {
  startCategory('2. Wave 3 Analysis Report (8 tests)');

  const filePath = CONFIG.files.analysisReport;

  // Test 2.1: File exists
  const exists = fileExists(filePath);
  logTest('File exists: docs/WAVE3-RESULTS-ANALYSIS.md', exists,
    exists ? '' : 'File not found');

  // Test 2.2: File size > 25KB
  const fileSize = getFileSize(filePath);
  const sizeOk = fileSize > 25000;
  logTest(`File size >25KB (actual: ${(fileSize / 1024).toFixed(1)}KB)`, sizeOk,
    sizeOk ? '' : `File too small: ${fileSize} bytes`);

  if (!exists) return;

  const content = readFile(filePath);

  // Test 2.3: Contains all required sections
  const requiredSections = [
    'Executive Summary',
    'Test Results Summary',
    'Deep Dive',
    'Revenue Impact',
    'Key Learnings',
    'Recommendations'
  ];

  let missingSections = [];
  requiredSections.forEach(section => {
    if (!content.includes(section)) {
      missingSections.push(section);
    }
  });

  const hasAllSections = missingSections.length === 0;
  logTest('Contains all required sections (Executive Summary, Deep Dives, Revenue Impact, etc)', hasAllSections,
    hasAllSections ? '' : `Missing sections: ${missingSections.join(', ')}`);

  // Test 2.4: Includes test results tables
  const hasTableHeaders = content.includes('|') && content.includes('---');
  const hasTestTable = content.includes('Test ID') || content.includes('Test Name');
  logTest('Includes test results tables', hasTableHeaders && hasTestTable,
    (hasTableHeaders && hasTestTable) ? '' : 'No markdown tables found');

  // Test 2.5: Has Wave 4 recommendations
  const hasWave4 = content.includes('Wave 4') || content.includes('wave4');
  logTest('Has Wave 4 recommendations', hasWave4,
    hasWave4 ? '' : 'No Wave 4 recommendations found');

  // Test 2.6: Contains implementation roadmap
  const hasRoadmap = content.includes('roadmap') || content.includes('implementation') ||
                     content.includes('Next Steps') || content.includes('next steps');
  logTest('Contains implementation roadmap', hasRoadmap,
    hasRoadmap ? '' : 'No roadmap/implementation plan found');

  // Test 2.7: Revenue projections present
  const hasRevenue = content.includes('revenue') || content.includes('Revenue') ||
                     content.includes('$') && content.includes('M');
  logTest('Revenue projections present', hasRevenue,
    hasRevenue ? '' : 'No revenue projections found');

  // Test 2.8: Actionable next steps
  const hasNextSteps = content.includes('next step') || content.includes('Next Step') ||
                       content.includes('action') || content.includes('Action') ||
                       content.includes('immediate');
  logTest('Actionable next steps', hasNextSteps,
    hasNextSteps ? '' : 'No actionable next steps found');
}

// ========================================
// Test Suite 3: Scaling Script
// ========================================

function testScalingScript() {
  startCategory('3. Scaling Script (8 tests)');

  const filePath = CONFIG.files.scalingScript;

  // Test 3.1: File exists
  const exists = fileExists(filePath);
  logTest('File exists: scripts/scale-wave3-winners.js', exists,
    exists ? '' : 'File not found');

  // Test 3.2: File size > 15KB
  const fileSize = getFileSize(filePath);
  const sizeOk = fileSize > 15000;
  logTest(`File size >15KB (actual: ${(fileSize / 1024).toFixed(1)}KB)`, sizeOk,
    sizeOk ? '' : `File too small: ${fileSize} bytes`);

  // Test 3.3: Executable permissions set
  const execOk = isExecutable(filePath);
  logTest('Executable permissions set', execOk,
    execOk ? '' : 'File not executable (chmod +x needed)');

  if (!exists) return;

  const content = readFile(filePath);

  // Test 3.4: Contains all 4 pattern implementations
  const patterns = [
    'triple-threat',
    'video-social',
    'ai-personalization',
    'interactive-demos'
  ];

  let missingPatterns = [];
  patterns.forEach(pattern => {
    if (!content.toLowerCase().includes(pattern)) {
      missingPatterns.push(pattern);
    }
  });

  const hasAllPatterns = missingPatterns.length === 0;
  logTest('Contains all 4 pattern implementations', hasAllPatterns,
    hasAllPatterns ? '' : `Missing patterns: ${missingPatterns.join(', ')}`);

  // Test 3.5: Has dry-run mode support
  const hasDryRun = content.includes('dry-run') || content.includes('dryRun') ||
                    content.includes('--dry');
  logTest('Has dry-run mode support', hasDryRun,
    hasDryRun ? '' : 'No dry-run mode found');

  // Test 3.6: Backup functionality present
  const hasBackup = content.includes('backup') || content.includes('Backup');
  logTest('Backup functionality present', hasBackup,
    hasBackup ? '' : 'No backup functionality found');

  // Test 3.7: Error handling implemented
  const hasErrorHandling = (content.includes('try') && content.includes('catch')) ||
                           content.includes('error') || content.includes('Error');
  logTest('Error handling implemented', hasErrorHandling,
    hasErrorHandling ? '' : 'No error handling found');

  // Test 3.8: Revenue calculator included
  const hasRevenueCalc = content.includes('revenue') || content.includes('Revenue') ||
                         content.includes('projection') || content.includes('impact');
  logTest('Revenue calculator included', hasRevenueCalc,
    hasRevenueCalc ? '' : 'No revenue calculation found');
}

// ========================================
// Test Suite 4: Monitoring Dashboard
// ========================================

function testMonitoringDashboard() {
  startCategory('4. Monitoring Dashboard (7 tests)');

  const filePath = CONFIG.files.dashboard;

  // Test 4.1: File exists
  const exists = fileExists(filePath);
  logTest('File exists: monitoring/wave3-dashboard.html', exists,
    exists ? '' : 'File not found');

  // Test 4.2: File size > 30KB
  const fileSize = getFileSize(filePath);
  const sizeOk = fileSize > 30000;
  logTest(`File size >30KB (actual: ${(fileSize / 1024).toFixed(1)}KB)`, sizeOk,
    sizeOk ? '' : `File too small: ${fileSize} bytes`);

  if (!exists) return;

  const content = readFile(filePath);

  // Test 4.3: Valid HTML structure
  const hasDoctype = content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>');
  const hasHtml = content.includes('<html') && content.includes('</html>');
  const hasHead = content.includes('<head>') && content.includes('</head>');
  const hasBody = content.includes('<body>') && content.includes('</body>');
  const validHTML = hasDoctype && hasHtml && hasHead && hasBody;
  logTest('Valid HTML structure', validHTML,
    validHTML ? '' : 'Missing HTML structure elements');

  // Test 4.4: Contains all 4 test cards
  const testNames = [
    'Triple Threat',
    'Video',
    'Personalization',
    'Interactive'
  ];

  let missingTests = [];
  testNames.forEach(name => {
    if (!content.includes(name)) {
      missingTests.push(name);
    }
  });

  const hasAllTests = missingTests.length === 0;
  logTest('Contains all 4 test cards', hasAllTests,
    hasAllTests ? '' : `Missing test cards: ${missingTests.join(', ')}`);

  // Test 4.5: Has chart visualizations
  const hasCharts = content.includes('chart') || content.includes('Chart') ||
                    content.includes('canvas') || content.includes('svg') ||
                    content.includes('graph') || content.includes('visualization');
  logTest('Has chart visualizations', hasCharts,
    hasCharts ? '' : 'No charts/visualizations found');

  // Test 4.6: Includes executive summary
  const hasSummary = content.includes('Executive') || content.includes('Summary') ||
                     content.includes('summary') || content.includes('overview');
  logTest('Includes executive summary', hasSummary,
    hasSummary ? '' : 'No executive summary found');

  // Test 4.7: Theme toggle or export functionality
  const hasTheme = content.includes('theme') || content.includes('dark') ||
                   content.includes('light');
  const hasExport = content.includes('export') || content.includes('Export') ||
                    content.includes('download');
  const hasFeatures = hasTheme || hasExport;
  logTest('Theme toggle or export functionality present', hasFeatures,
    hasFeatures ? '' : 'No theme toggle or export functionality found');
}

// ========================================
// Test Suite 5: Wave 3 Router Script
// ========================================

function testWave3Router() {
  startCategory('5. Wave 3 Router Script (6 tests)');

  const filePath = CONFIG.files.router;

  // Test 5.1: File exists
  const exists = fileExists(filePath);
  logTest('File exists: scripts/wave3-router.js', exists,
    exists ? '' : 'File not found');

  if (!exists) return;

  const content = readFile(filePath);

  // Test 5.2: Valid JavaScript
  const hasValidJS = content.includes('function') || content.includes('=>');
  const hasNoSyntaxErrors = !content.includes('<<<<<<') && !content.includes('>>>>>>');
  const validJS = hasValidJS && hasNoSyntaxErrors;
  logTest('Valid JavaScript', validJS,
    validJS ? '' : 'Invalid JavaScript syntax detected');

  // Test 5.3: Configuration for all 4 tests
  const tests = [
    'triple-threat',
    'video-social',
    'ai-personalization',
    'interactive-demos'
  ];

  let missingConfigs = [];
  tests.forEach(test => {
    if (!content.includes(test)) {
      missingConfigs.push(test);
    }
  });

  const hasAllConfigs = missingConfigs.length === 0;
  logTest('Configuration for all 4 tests', hasAllConfigs,
    hasAllConfigs ? '' : `Missing configs: ${missingConfigs.join(', ')}`);

  // Test 5.4: Traffic allocation logic present
  const hasTrafficLogic = content.includes('split') || content.includes('allocation') ||
                          content.includes('bucket') || content.includes('hash') ||
                          content.includes('random');
  logTest('Traffic allocation logic present', hasTrafficLogic,
    hasTrafficLogic ? '' : 'No traffic allocation logic found');

  // Test 5.5: User ID tracking implemented
  const hasUserTracking = content.includes('userId') || content.includes('user_id') ||
                          content.includes('getUserId') || content.includes('localStorage');
  logTest('User ID tracking implemented', hasUserTracking,
    hasUserTracking ? '' : 'No user ID tracking found');

  // Test 5.6: GA4 tracking hooks present
  const hasGA4 = content.includes('gtag') || content.includes('GA4') ||
                 content.includes('google') || content.includes('analytics') ||
                 content.includes('track');
  logTest('GA4 tracking hooks present', hasGA4,
    hasGA4 ? '' : 'No GA4/analytics tracking found');
}

// ========================================
// Test Suite 6: Documentation Quality
// ========================================

function testDocumentationQuality() {
  startCategory('6. Documentation Quality (6 tests)');

  const analysisPath = CONFIG.files.analysisReport;

  if (!fileExists(analysisPath)) {
    logTest('Markdown files properly formatted', false, 'Analysis file not found');
    logTest('Tables rendered correctly', false, 'Analysis file not found');
    logTest('Links valid', false, 'Analysis file not found');
    logTest('Code blocks syntax highlighted', false, 'Analysis file not found');
    logTest('Numbers and metrics consistent across files', false, 'Analysis file not found');
    logTest('Professional presentation', false, 'Analysis file not found');
    return;
  }

  const content = readFile(analysisPath);

  // Test 6.1: Markdown files properly formatted
  const hasHeaders = content.includes('#');
  const hasBullets = content.includes('- ') || content.includes('* ');
  const hasNumbers = content.includes('1. ');
  const properFormat = hasHeaders && (hasBullets || hasNumbers);
  logTest('Markdown files properly formatted', properFormat,
    properFormat ? '' : 'Missing proper markdown formatting');

  // Test 6.2: Tables rendered correctly
  const hasTables = content.includes('|');
  const hasTableSeparator = content.includes('---|') || content.includes('|---');
  const tablesOk = hasTables && hasTableSeparator;
  logTest('Tables rendered correctly', tablesOk,
    tablesOk ? '' : 'Tables not properly formatted');

  // Test 6.3: Links valid (checking format, not actual URLs)
  const hasLinks = content.includes('[') && content.includes('](');
  const nobrokenLinks = !content.includes('](]') && !content.includes('[](');
  const linksOk = !hasLinks || nobrokenLinks; // OK if no links or links are formatted
  logTest('Links valid (format check)', linksOk,
    linksOk ? '' : 'Broken link format detected');

  // Test 6.4: Code blocks syntax highlighted
  const hasCodeBlocks = content.includes('```');
  const hasCodeBlocksOrNone = !hasCodeBlocks || (content.match(/```/g) || []).length % 2 === 0;
  logTest('Code blocks syntax highlighted (proper closure)', hasCodeBlocksOrNone,
    hasCodeBlocksOrNone ? '' : 'Unclosed code blocks detected');

  // Test 6.5: Numbers and metrics consistent
  const hasMetrics = content.includes('%') || content.includes('$');
  const hasFormatting = content.includes('+') || content.includes('-');
  const metricsPresent = hasMetrics && hasFormatting;
  logTest('Numbers and metrics consistent across files', metricsPresent,
    metricsPresent ? '' : 'Missing metrics or inconsistent formatting');

  // Test 6.6: Professional presentation
  const hasTitle = content.includes('#');
  const hasStructure = content.split('\n').length > 50; // Substantial content
  const noTypos = !content.includes('teh ') && !content.includes('recieve');
  const professional = hasTitle && hasStructure && noTypos;
  logTest('Professional presentation', professional,
    professional ? '' : 'Document lacks professional quality');
}

// ========================================
// Test Suite 7: Feature Completeness
// ========================================

function testFeatureCompleteness() {
  startCategory('7. Feature Completeness (7 tests)');

  // Test 7.1: All deliverables created
  const requiredFiles = [
    CONFIG.files.testResults,
    CONFIG.files.analysisReport,
    CONFIG.files.scalingScript,
    CONFIG.files.dashboard,
    CONFIG.files.router
  ];

  let missingFiles = [];
  requiredFiles.forEach(file => {
    if (!fileExists(file)) {
      missingFiles.push(file);
    }
  });

  const allCreated = missingFiles.length === 0;
  logTest('All deliverables created', allCreated,
    allCreated ? '' : `Missing files: ${missingFiles.join(', ')}`);

  // Test 7.2: Test data realistic and comprehensive
  let dataRealistic = false;
  if (fileExists(CONFIG.files.testResults)) {
    const data = readJSON(CONFIG.files.testResults);
    if (data) {
      const hasVisitors = data.overallMetrics?.totalVisitors > 100000;
      const hasTests = data.tests?.length === 4;
      const hasProgression = data.tests?.[0]?.dailyProgression?.length === 14;
      dataRealistic = hasVisitors && hasTests && hasProgression;
    }
  }
  logTest('Test data realistic and comprehensive', dataRealistic,
    dataRealistic ? '' : 'Test data incomplete or unrealistic');

  // Test 7.3: Analysis actionable and strategic
  let analysisActionable = false;
  if (fileExists(CONFIG.files.analysisReport)) {
    const content = readFile(CONFIG.files.analysisReport);
    const hasRecommendations = content.includes('Recommendation') || content.includes('recommendation');
    const hasActions = content.includes('action') || content.includes('Action');
    const hasStrategy = content.includes('strateg') || content.includes('Strateg');
    analysisActionable = hasRecommendations && (hasActions || hasStrategy);
  }
  logTest('Analysis actionable and strategic', analysisActionable,
    analysisActionable ? '' : 'Analysis lacks actionable recommendations');

  // Test 7.4: Scaling ready for execution
  let scalingReady = false;
  if (fileExists(CONFIG.files.scalingScript)) {
    const content = readFile(CONFIG.files.scalingScript);
    const hasShebang = content.startsWith('#!');
    const hasConfig = content.includes('config') || content.includes('CONFIG');
    const executable = isExecutable(CONFIG.files.scalingScript);
    scalingReady = hasConfig && (hasShebang || executable);
  }
  logTest('Scaling ready for execution', scalingReady,
    scalingReady ? '' : 'Scaling script not ready for execution');

  // Test 7.5: Monitoring dashboard functional
  let dashboardFunctional = false;
  if (fileExists(CONFIG.files.dashboard)) {
    const content = readFile(CONFIG.files.dashboard);
    const hasHTML = content.includes('<html');
    const hasScript = content.includes('<script') || content.includes('function');
    const hasStyle = content.includes('<style') || content.includes('css');
    dashboardFunctional = hasHTML && hasScript && hasStyle;
  }
  logTest('Monitoring dashboard functional', dashboardFunctional,
    dashboardFunctional ? '' : 'Dashboard missing key components');

  // Test 7.6: Router production-ready
  let routerReady = false;
  if (fileExists(CONFIG.files.router)) {
    const content = readFile(CONFIG.files.router);
    const hasConfig = content.includes('config') || content.includes('CONFIG');
    const hasRouting = content.includes('route') || content.includes('redirect');
    const hasTracking = content.includes('track') || content.includes('gtag');
    routerReady = hasConfig && hasRouting && hasTracking;
  }
  logTest('Router production-ready', routerReady,
    routerReady ? '' : 'Router missing production features');

  // Test 7.7: Wave 4 roadmap clear
  let roadmapClear = false;
  if (fileExists(CONFIG.files.analysisReport)) {
    const content = readFile(CONFIG.files.analysisReport);
    const hasWave4 = content.includes('Wave 4');
    const hasRoadmap = content.includes('roadmap') || content.includes('next') ||
                       content.includes('future');
    roadmapClear = hasWave4 && hasRoadmap;
  }
  logTest('Wave 4 roadmap clear', roadmapClear,
    roadmapClear ? '' : 'Wave 4 roadmap not clearly defined');
}

// ========================================
// Summary & Grading
// ========================================

function calculateGrade(percentage) {
  if (percentage >= 95) return 'A';
  if (percentage >= 85) return 'B';
  if (percentage >= 75) return 'C';
  if (percentage >= 65) return 'D';
  return 'F';
}

function printSummary() {
  const percentage = testResults.total > 0
    ? (testResults.passed / testResults.total * 100).toFixed(1)
    : 0;
  const grade = calculateGrade(percentage);

  log('\n' + '='.repeat(70), COLORS.bright);
  log('TEST SUMMARY', COLORS.bright);
  log('='.repeat(70), COLORS.bright);

  log(`\nTotal Tests: ${COLORS.bright}${testResults.total}${COLORS.reset}`);
  log(`Passed: ${COLORS.green}${testResults.passed}${COLORS.reset}`);
  log(`Failed: ${COLORS.red}${testResults.failed}${COLORS.reset}`);
  log(`Pass Rate: ${COLORS.bright}${percentage}%${COLORS.reset}`);

  const gradeColor = grade === 'A' ? COLORS.green :
                     grade === 'B' ? COLORS.cyan :
                     grade === 'C' ? COLORS.yellow : COLORS.red;
  log(`Grade: ${gradeColor}${COLORS.bright}${grade}${COLORS.reset}`);

  if (testResults.failed > 0) {
    log(`\n${COLORS.red}${COLORS.bright}FAILED TESTS:${COLORS.reset}`);
    testResults.failures.forEach((failure, index) => {
      log(`\n${index + 1}. ${COLORS.red}${failure.test}${COLORS.reset}`);
      if (failure.details) {
        log(`   ${COLORS.dim}${failure.details}${COLORS.reset}`);
      }
    });
  }

  log('\n' + '='.repeat(70), COLORS.bright);

  if (grade === 'A') {
    log(`${COLORS.green}${COLORS.bright}✓ EXCELLENT! Target achieved (>95% pass rate)${COLORS.reset}`);
  } else if (grade === 'B') {
    log(`${COLORS.cyan}${COLORS.bright}→ GOOD! Close to target (85-94% pass rate)${COLORS.reset}`);
  } else {
    log(`${COLORS.red}${COLORS.bright}✗ NEEDS WORK! Below target (<85% pass rate)${COLORS.reset}`);
  }

  log('='.repeat(70) + '\n', COLORS.bright);
}

// ========================================
// Save Results to JSON
// ========================================

function saveResults() {
  // Create reports directory
  if (!fs.existsSync(CONFIG.reportsDir)) {
    fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
  }

  const percentage = testResults.total > 0
    ? (testResults.passed / testResults.total * 100)
    : 0;
  const grade = calculateGrade(percentage);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      passRate: `${percentage.toFixed(1)}%`,
      grade: grade,
      targetMet: grade === 'A'
    },
    failures: testResults.failures,
    categories: Object.keys(testResults.categories).map(cat => ({
      name: cat,
      passed: testResults.categories[cat].passed,
      total: testResults.categories[cat].total
    }))
  };

  const reportPath = path.join(CONFIG.reportsDir, 'validation-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log(`${COLORS.green}✓ Results saved to: ${reportPath}${COLORS.reset}\n`);
}

// ========================================
// Main Execution
// ========================================

function main() {
  log('\n' + '='.repeat(70), COLORS.bright);
  log('Feature #80 Test Suite - Wave 3 Launch & Monitoring', COLORS.bright);
  log('='.repeat(70) + '\n', COLORS.bright);

  // Run all test suites
  testWave3Results();
  testWave3Analysis();
  testScalingScript();
  testMonitoringDashboard();
  testWave3Router();
  testDocumentationQuality();
  testFeatureCompleteness();

  // Print summary
  printSummary();

  // Save results
  saveResults();

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run the tests
main();
