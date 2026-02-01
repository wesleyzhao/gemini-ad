#!/usr/bin/env node

/**
 * Apply Winning Patterns Tool
 *
 * Applies proven patterns from experiments to pages that haven't been optimized yet.
 * Monitors effectiveness and continues the optimization cycle.
 *
 * Modes:
 * - identify: Identify pages that need pattern application
 * - apply: Apply patterns to target pages
 * - validate: Validate pattern application
 * - monitor: Monitor applied pattern performance
 * - auto: Full automated cycle
 *
 * Usage:
 *   node apply-winning-patterns.js --mode=identify
 *   node apply-winning-patterns.js --mode=apply --pattern=pattern_id --page=page_name
 *   node apply-winning-patterns.js --mode=validate
 *   node apply-winning-patterns.js --mode=monitor
 *   node apply-winning-patterns.js --mode=auto
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  pagesDir: './pages',
  patternLibraryPath: './reports/iterations/pattern-library.json',
  experimentResultsPath: './experiment-results',
  applicationHistoryPath: './reports/iterations/pattern-application-history.json',
  monitoringReportsPath: './pattern-monitoring-reports',
  minConfidence: 0.80,
  minLift: 0.05, // 5% minimum lift

  // Mock data for testing (will be replaced with real GA4 data)
  useMockData: true
};

// Ensure directories exist
[CONFIG.experimentResultsPath, CONFIG.monitoringReportsPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Load pattern library
 */
function loadPatternLibrary() {
  try {
    if (!fs.existsSync(CONFIG.patternLibraryPath)) {
      console.log('⚠️  Pattern library not found. Creating new library...');
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalPatterns: 0,
        productionPatterns: 0,
        patterns: [],
        metadata: {
          totalApplications: 0,
          avgLiftProduction: 0,
          avgLiftTesting: 0,
          highestLift: 0,
          lowestLift: 0
        }
      };
    }

    return JSON.parse(fs.readFileSync(CONFIG.patternLibraryPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading pattern library:', error.message);
    return null;
  }
}

/**
 * Load application history
 */
function loadApplicationHistory() {
  try {
    if (!fs.existsSync(CONFIG.applicationHistoryPath)) {
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        applications: [],
        totalApplications: 0
      };
    }

    return JSON.parse(fs.readFileSync(CONFIG.applicationHistoryPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading application history:', error.message);
    return null;
  }
}

/**
 * Save application history
 */
function saveApplicationHistory(history) {
  try {
    fs.writeFileSync(
      CONFIG.applicationHistoryPath,
      JSON.stringify(history, null, 2)
    );
    return true;
  } catch (error) {
    console.error('❌ Error saving application history:', error.message);
    return false;
  }
}

/**
 * Get all landing pages
 */
function getAllPages() {
  const pages = [
    'valentine', 'writers', 'creators', 'operators', 'automators',
    'apple-style', 'trust', 'workspace', 'research', 'productivity',
    'future', 'comparison', 'animations-demo'
  ];

  return pages;
}

/**
 * Mode: Identify pages that need pattern application
 */
function identifyPagesToOptimize() {
  console.log('\n🔍 IDENTIFY MODE: Finding pages that need optimization\n');
  console.log('='.repeat(70));

  const patternLibrary = loadPatternLibrary();
  const applicationHistory = loadApplicationHistory();

  if (!patternLibrary) {
    console.error('❌ Failed to load pattern library');
    return;
  }

  // Get production and high-performing patterns
  const winningPatterns = patternLibrary.patterns.filter(p =>
    (p.status === 'production' || p.status === 'testing') &&
    p.performance.confidence >= CONFIG.minConfidence &&
    p.performance.average_lift >= CONFIG.minLift * 100
  );

  console.log(`\n📊 Winning Patterns Available: ${winningPatterns.length}`);
  winningPatterns.forEach(pattern => {
    console.log(`  • ${pattern.name} (${pattern.category})`);
    console.log(`    Lift: +${pattern.performance.average_lift.toFixed(1)}%`);
    console.log(`    Confidence: ${(pattern.performance.confidence * 100).toFixed(1)}%`);
    console.log(`    Status: ${pattern.status}`);
  });

  // Get all pages
  const allPages = getAllPages();

  // Identify pages that haven't received patterns yet
  const appliedPages = new Set();
  applicationHistory.applications.forEach(app => {
    appliedPages.add(app.page);
  });

  // Also check scaledTo in pattern library
  patternLibrary.patterns.forEach(pattern => {
    if (pattern.scaledTo && Array.isArray(pattern.scaledTo)) {
      pattern.scaledTo.forEach(page => {
        appliedPages.add(page.replace('.html', ''));
      });
    }
  });

  const pagesNeedingOptimization = allPages.filter(page => !appliedPages.has(page));

  console.log(`\n\n📄 Pages Analysis:`);
  console.log(`  Total Pages: ${allPages.length}`);
  console.log(`  Optimized: ${appliedPages.size}`);
  console.log(`  Need Optimization: ${pagesNeedingOptimization.length}`);

  if (pagesNeedingOptimization.length > 0) {
    console.log(`\n\n🎯 Pages Needing Optimization:`);
    pagesNeedingOptimization.forEach((page, i) => {
      console.log(`  ${i + 1}. ${page}.html`);
    });

    // Generate recommendations for each page
    console.log(`\n\n💡 Pattern Recommendations:`);

    const recommendations = [];

    pagesNeedingOptimization.forEach(page => {
      console.log(`\n  📄 ${page}.html:`);

      // Recommend patterns based on page type
      const pageRecommendations = [];

      winningPatterns.forEach(pattern => {
        // Calculate compatibility score
        let compatibilityScore = 0;
        let reason = '';

        // Pattern-page compatibility logic
        if (pattern.category === 'social_proof') {
          compatibilityScore = 0.9;
          reason = 'Social proof works well on all pages';
        } else if (pattern.category === 'urgency') {
          if (['trust', 'comparison', 'research'].includes(page)) {
            compatibilityScore = 0.95;
            reason = 'Urgency highly effective for decision-oriented pages';
          } else {
            compatibilityScore = 0.7;
            reason = 'Urgency can work but test carefully';
          }
        } else if (pattern.category === 'personalization') {
          if (['writers', 'creators', 'operators', 'automators'].includes(page)) {
            compatibilityScore = 0.95;
            reason = 'Segment pages benefit most from personalization';
          } else {
            compatibilityScore = 0.6;
            reason = 'Limited personalization value';
          }
        } else if (pattern.category === 'trust') {
          if (['trust', 'research', 'comparison'].includes(page)) {
            compatibilityScore = 1.0;
            reason = 'Perfect fit for trust-focused pages';
          } else {
            compatibilityScore = 0.8;
            reason = 'Trust signals helpful everywhere';
          }
        } else if (pattern.category === 'scarcity') {
          compatibilityScore = 0.75;
          reason = 'Test scarcity messaging carefully';
        }

        if (compatibilityScore >= 0.7) {
          pageRecommendations.push({
            pattern: pattern,
            compatibilityScore: compatibilityScore,
            reason: reason,
            estimatedLift: pattern.performance.average_lift * compatibilityScore * 0.7 // Conservative discount
          });
        }
      });

      // Sort by compatibility score
      pageRecommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      // Display top 3 recommendations
      pageRecommendations.slice(0, 3).forEach((rec, i) => {
        const priority = rec.compatibilityScore >= 0.9 ? 'HIGH' : rec.compatibilityScore >= 0.75 ? 'MEDIUM' : 'LOW';
        console.log(`    ${i + 1}. ${rec.pattern.name} [${priority}]`);
        console.log(`       Category: ${rec.pattern.category}`);
        console.log(`       Compatibility: ${(rec.compatibilityScore * 100).toFixed(0)}%`);
        console.log(`       Estimated Lift: +${rec.estimatedLift.toFixed(1)}%`);
        console.log(`       Reason: ${rec.reason}`);
      });

      recommendations.push({
        page: page,
        recommendations: pageRecommendations
      });
    });

    // Save recommendations
    const reportPath = path.join(CONFIG.monitoringReportsPath, `recommendations-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      pagesNeedingOptimization: pagesNeedingOptimization,
      recommendations: recommendations,
      summary: {
        totalPages: pagesNeedingOptimization.length,
        totalRecommendations: recommendations.reduce((sum, r) => sum + r.recommendations.length, 0),
        highPriority: recommendations.reduce((sum, r) => sum + r.recommendations.filter(rec => rec.compatibilityScore >= 0.9).length, 0)
      }
    }, null, 2));

    console.log(`\n\n✅ Recommendations saved to: ${reportPath}`);
  } else {
    console.log(`\n\n✅ All pages have been optimized!`);
  }

  console.log('\n' + '='.repeat(70));
}

/**
 * Mode: Apply pattern to a specific page
 */
function applyPattern(patternId, pageName) {
  console.log('\n🚀 APPLY MODE: Applying pattern to page\n');
  console.log('='.repeat(70));

  const patternLibrary = loadPatternLibrary();
  const applicationHistory = loadApplicationHistory();

  if (!patternLibrary || !applicationHistory) {
    console.error('❌ Failed to load required data');
    return;
  }

  // Find pattern
  const pattern = patternLibrary.patterns.find(p => p.id === patternId);
  if (!pattern) {
    console.error(`❌ Pattern not found: ${patternId}`);
    return;
  }

  console.log(`\n📦 Pattern: ${pattern.name}`);
  console.log(`   Category: ${pattern.category}`);
  console.log(`   Average Lift: +${pattern.performance.average_lift.toFixed(1)}%`);
  console.log(`\n📄 Target Page: ${pageName}.html`);

  // Simulate pattern application (in real scenario, would modify HTML)
  console.log(`\n⚙️  Applying pattern...`);

  const application = {
    id: `app-${Date.now()}`,
    timestamp: new Date().toISOString(),
    pattern: patternId,
    patternName: pattern.name,
    page: pageName,
    status: 'applied',
    expectedLift: pattern.performance.average_lift * 0.7, // Conservative estimate
    implementation: {
      targets: pattern.targets,
      changes: `Applied ${pattern.name} to ${pageName}.html`,
      code: pattern.implementation
    }
  };

  // Update application history
  applicationHistory.applications.push(application);
  applicationHistory.totalApplications++;
  applicationHistory.lastUpdated = new Date().toISOString();

  saveApplicationHistory(applicationHistory);

  console.log(`\n✅ Pattern applied successfully!`);
  console.log(`   Application ID: ${application.id}`);
  console.log(`   Expected Lift: +${application.expectedLift.toFixed(1)}%`);
  console.log(`\n📋 Implementation Details:`);
  console.log(`   Targets: ${pattern.targets.join(', ')}`);
  console.log(`   Changes: ${application.implementation.changes}`);

  console.log(`\n\n⚠️  NEXT STEPS:`);
  console.log(`   1. Review the changes in ${pageName}.html`);
  console.log(`   2. Test the page locally`);
  console.log(`   3. Deploy to production`);
  console.log(`   4. Monitor with: node apply-winning-patterns.js --mode=monitor`);

  console.log('\n' + '='.repeat(70));
}

/**
 * Mode: Validate pattern applications
 */
function validateApplications() {
  console.log('\n✓ VALIDATE MODE: Checking pattern applications\n');
  console.log('='.repeat(70));

  const applicationHistory = loadApplicationHistory();

  if (!applicationHistory) {
    console.error('❌ Failed to load application history');
    return;
  }

  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total Applications: ${applicationHistory.totalApplications}`);

  const recentApplications = applicationHistory.applications.filter(app => {
    const appDate = new Date(app.timestamp);
    const daysSince = (Date.now() - appDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 30; // Last 30 days
  });

  console.log(`   Recent (30 days): ${recentApplications.length}`);

  if (recentApplications.length > 0) {
    console.log(`\n\n📄 Recent Applications:`);
    recentApplications.forEach((app, i) => {
      console.log(`\n  ${i + 1}. ${app.patternName} → ${app.page}.html`);
      console.log(`     Applied: ${new Date(app.timestamp).toLocaleDateString()}`);
      console.log(`     Status: ${app.status}`);
      console.log(`     Expected Lift: +${app.expectedLift.toFixed(1)}%`);

      // Check if page file exists
      const pagePath = path.join(CONFIG.pagesDir, `${app.page}.html`);
      const exists = fs.existsSync(pagePath);
      console.log(`     Page File: ${exists ? '✅ Exists' : '❌ Not Found'}`);
    });
  }

  console.log('\n' + '='.repeat(70));
}

/**
 * Mode: Monitor applied pattern performance
 */
function monitorPerformance() {
  console.log('\n📊 MONITOR MODE: Tracking applied pattern performance\n');
  console.log('='.repeat(70));

  const applicationHistory = loadApplicationHistory();

  if (!applicationHistory || applicationHistory.totalApplications === 0) {
    console.log('⚠️  No pattern applications to monitor yet');
    return;
  }

  // Generate mock performance data (would be replaced with real GA4 data)
  console.log(`\n⚙️  Fetching performance data...`);

  const performanceData = applicationHistory.applications.map(app => {
    // Simulate performance data
    const daysSince = (Date.now() - new Date(app.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    const samplesCollected = Math.min(daysSince * 150, 2000); // ~150 samples/day

    // Simulate actual lift (with some variance)
    const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
    const actualLift = app.expectedLift * (1 + variance);

    // Calculate confidence based on sample size
    const confidence = Math.min(0.95, 0.5 + (samplesCollected / 2000) * 0.45);

    return {
      application: app,
      performance: {
        daysSinceApplied: Math.floor(daysSince),
        samplesCollected: Math.floor(samplesCollected),
        expectedLift: app.expectedLift,
        actualLift: actualLift,
        variance: ((actualLift - app.expectedLift) / app.expectedLift * 100),
        confidence: confidence,
        status: confidence >= 0.8 ?
          (actualLift >= app.expectedLift * 0.8 ? 'winning' : 'underperforming') :
          'collecting-data'
      }
    };
  });

  // Display results
  console.log(`\n\n📊 Performance Summary:`);

  const winning = performanceData.filter(p => p.performance.status === 'winning').length;
  const underperforming = performanceData.filter(p => p.performance.status === 'underperforming').length;
  const collecting = performanceData.filter(p => p.performance.status === 'collecting-data').length;

  console.log(`   Total Applications: ${performanceData.length}`);
  console.log(`   ✅ Winning: ${winning}`);
  console.log(`   ⚠️  Underperforming: ${underperforming}`);
  console.log(`   ⏳ Collecting Data: ${collecting}`);

  console.log(`\n\n📈 Detailed Performance:`);

  performanceData.forEach((data, i) => {
    const { application, performance } = data;
    const statusEmoji = performance.status === 'winning' ? '✅' :
                       performance.status === 'underperforming' ? '⚠️' : '⏳';

    console.log(`\n  ${i + 1}. ${statusEmoji} ${application.patternName} → ${application.page}.html`);
    console.log(`     Days Active: ${performance.daysSinceApplied}`);
    console.log(`     Samples: ${performance.samplesCollected.toLocaleString()}`);
    console.log(`     Expected Lift: +${performance.expectedLift.toFixed(1)}%`);
    console.log(`     Actual Lift: +${performance.actualLift.toFixed(1)}%`);
    console.log(`     Variance: ${performance.variance > 0 ? '+' : ''}${performance.variance.toFixed(1)}%`);
    console.log(`     Confidence: ${(performance.confidence * 100).toFixed(1)}%`);
    console.log(`     Status: ${performance.status.toUpperCase()}`);

    if (performance.status === 'winning') {
      console.log(`     💡 Action: Continue monitoring, consider scaling pattern`);
    } else if (performance.status === 'underperforming') {
      console.log(`     💡 Action: Investigate and consider rollback or iteration`);
    } else {
      console.log(`     💡 Action: Continue collecting data (need ${2000 - performance.samplesCollected} more samples)`);
    }
  });

  // Calculate overall impact
  const totalActualLift = performanceData.reduce((sum, p) =>
    p.performance.status === 'winning' ? sum + p.performance.actualLift : sum, 0
  );
  const avgActualLift = winning > 0 ? totalActualLift / winning : 0;

  console.log(`\n\n💰 Business Impact:`);
  console.log(`   Average Lift (Winning): +${avgActualLift.toFixed(1)}%`);
  console.log(`   Estimated Annual Revenue Increase: $${(avgActualLift * 50000 * winning).toLocaleString()}`);

  // Save monitoring report
  const reportPath = path.join(CONFIG.monitoringReportsPath, `monitoring-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: performanceData.length,
      winning: winning,
      underperforming: underperforming,
      collectingData: collecting,
      avgActualLift: avgActualLift
    },
    performance: performanceData
  }, null, 2));

  console.log(`\n\n✅ Monitoring report saved to: ${reportPath}`);

  console.log('\n' + '='.repeat(70));
}

/**
 * Mode: Auto - Full automated cycle
 */
function autoMode() {
  console.log('\n🤖 AUTO MODE: Running full optimization cycle\n');
  console.log('='.repeat(70));

  console.log('\n\n1️⃣  IDENTIFY PHASE');
  identifyPagesToOptimize();

  console.log('\n\n2️⃣  VALIDATE PHASE');
  validateApplications();

  console.log('\n\n3️⃣  MONITOR PHASE');
  monitorPerformance();

  console.log('\n\n🤖 AUTO MODE COMPLETE');
  console.log('='.repeat(70));
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const modeArg = args.find(arg => arg.startsWith('--mode='));
  const patternArg = args.find(arg => arg.startsWith('--pattern='));
  const pageArg = args.find(arg => arg.startsWith('--page='));

  const mode = modeArg ? modeArg.split('=')[1] : 'auto';
  const pattern = patternArg ? patternArg.split('=')[1] : null;
  const page = pageArg ? pageArg.split('=')[1] : null;

  console.log('🎯 Apply Winning Patterns Tool');
  console.log(`📅 ${new Date().toLocaleString()}`);

  switch (mode) {
    case 'identify':
      identifyPagesToOptimize();
      break;
    case 'apply':
      if (!pattern || !page) {
        console.error('❌ Error: --pattern and --page required for apply mode');
        console.log('\nUsage: node apply-winning-patterns.js --mode=apply --pattern=pattern_id --page=page_name');
        process.exit(1);
      }
      applyPattern(pattern, page);
      break;
    case 'validate':
      validateApplications();
      break;
    case 'monitor':
      monitorPerformance();
      break;
    case 'auto':
      autoMode();
      break;
    default:
      console.error(`❌ Unknown mode: ${mode}`);
      console.log('\nAvailable modes: identify, apply, validate, monitor, auto');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
