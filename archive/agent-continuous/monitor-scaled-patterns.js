#!/usr/bin/env node

/**
 * Scaled Pattern Performance Monitoring System
 *
 * Monitors the performance of scaled patterns from Feature #93 and provides
 * detailed analytics on pattern effectiveness, scaling success, and ROI.
 *
 * Usage:
 *   node monitor-scaled-patterns.js --mode=daily       # Daily performance check
 *   node monitor-scaled-patterns.js --mode=weekly      # Weekly trend analysis
 *   node monitor-scaled-patterns.js --mode=effectiveness # Pattern effectiveness report
 *   node monitor-scaled-patterns.js --mode=roi         # ROI analysis
 *   node monitor-scaled-patterns.js --mode=recommendations # Get optimization recommendations
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  analyticsDir: path.join(__dirname, 'analytics-data'),
  scalingDir: path.join(__dirname, 'scaling-plans'),
  optimizationsDir: path.join(__dirname, 'optimizations', 'refined'),
  reportsDir: path.join(__dirname, 'pattern-performance-reports'),

  // Thresholds for success criteria
  thresholds: {
    minConversionLift: 0.05,      // 5% minimum lift
    minConfidence: 0.95,           // 95% confidence
    minROI: 2.0,                   // 2x minimum ROI
    maxRolloutDays: 30,            // Maximum rollout time
    minStability: 0.90             // 90% stability (low variance)
  },

  // Revenue metrics
  baselineRevenue: 201960000,      // $201.96M baseline
  targetRevenue: 223500000,        // $223.5M target (from Feature #93)

  // Patterns being monitored (from Feature #93)
  patterns: [
    'cta-optimization',
    'social-proof',
    'scarcity-urgency',
    'value-clarity',
    'friction-reduction'
  ]
};

// Ensure directories exist
function ensureDirectories() {
  [CONFIG.analyticsDir, CONFIG.scalingDir, CONFIG.optimizationsDir, CONFIG.reportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Generate mock pattern performance data (replace with GA4 data in production)
function generateMockPatternData(days = 7) {
  const data = {
    generatedAt: new Date().toISOString(),
    period: `${days} days`,
    patterns: {}
  };

  CONFIG.patterns.forEach(pattern => {
    const baselineConversion = 0.12; // 12% baseline
    const expectedLift = 0.25 + Math.random() * 0.15; // 25-40% lift

    data.patterns[pattern] = {
      name: pattern,
      pagesScaledTo: Math.floor(Math.random() * 8) + 5, // 5-12 pages
      rolloutDays: Math.floor(Math.random() * 20) + 5,   // 5-25 days
      performance: []
    };

    // Generate daily performance data
    for (let i = 0; i < days; i++) {
      const noise = (Math.random() - 0.5) * 0.02; // ±1% noise
      const trend = i * 0.005; // Slight upward trend

      data.patterns[pattern].performance.push({
        day: i + 1,
        date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        controlConversion: baselineConversion + noise,
        treatmentConversion: baselineConversion * (1 + expectedLift) + noise + trend,
        sessions: Math.floor(Math.random() * 5000) + 10000, // 10k-15k sessions
        revenue: (Math.random() * 50000) + 150000 // $150k-200k daily
      });
    }
  });

  return data;
}

// Calculate statistical metrics
function calculateStatistics(data) {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    stdDev,
    variance,
    min: Math.min(...data),
    max: Math.max(...data),
    stability: 1 - (stdDev / mean) // High stability = low coefficient of variation
  };
}

// Analyze pattern effectiveness
function analyzePatternEffectiveness(patternData) {
  const { performance } = patternData;

  // Calculate average conversion rates
  const controlConversions = performance.map(d => d.controlConversion);
  const treatmentConversions = performance.map(d => d.treatmentConversion);

  const controlStats = calculateStatistics(controlConversions);
  const treatmentStats = calculateStatistics(treatmentConversions);

  // Calculate lift
  const avgLift = (treatmentStats.mean - controlStats.mean) / controlStats.mean;

  // Calculate Z-score for statistical significance
  const pooledStdDev = Math.sqrt((controlStats.variance + treatmentStats.variance) / 2);
  const zScore = (treatmentStats.mean - controlStats.mean) / (pooledStdDev / Math.sqrt(performance.length));

  // Z-score to p-value approximation (two-tailed test)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  const confidence = 1 - pValue;

  // Calculate total revenue impact
  const totalRevenue = performance.reduce((sum, d) => sum + d.revenue, 0);
  const avgDailyRevenue = totalRevenue / performance.length;
  const projectedAnnualRevenue = avgDailyRevenue * 365;

  // Calculate ROI (benefit / cost)
  const implementationCost = 5000; // Estimated cost per pattern
  const annualBenefit = avgDailyRevenue * 365 * avgLift;
  const roi = annualBenefit / implementationCost;

  return {
    avgLift,
    confidence,
    zScore,
    pValue,
    controlStats,
    treatmentStats,
    totalRevenue,
    avgDailyRevenue,
    projectedAnnualRevenue,
    roi,
    stability: treatmentStats.stability,

    // Success criteria checks
    meetsLiftThreshold: avgLift >= CONFIG.thresholds.minConversionLift,
    meetsConfidenceThreshold: confidence >= CONFIG.thresholds.minConfidence,
    meetsROIThreshold: roi >= CONFIG.thresholds.minROI,
    meetsStabilityThreshold: treatmentStats.stability >= CONFIG.thresholds.minStability,

    // Overall success
    isSuccessful: (
      avgLift >= CONFIG.thresholds.minConversionLift &&
      confidence >= CONFIG.thresholds.minConfidence &&
      roi >= CONFIG.thresholds.minROI &&
      treatmentStats.stability >= CONFIG.thresholds.minStability
    )
  };
}

// Normal CDF approximation for Z-score to p-value
function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// Daily performance check
function runDailyCheck() {
  console.log('📊 Daily Scaled Pattern Performance Check\n');
  console.log('=' .repeat(80));

  const data = generateMockPatternData(1); // Last 24 hours

  console.log(`\n📅 Date: ${new Date().toISOString().split('T')[0]}`);
  console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

  let totalDailyRevenue = 0;
  const results = [];

  CONFIG.patterns.forEach(patternName => {
    const patternData = data.patterns[patternName];
    const analysis = analyzePatternEffectiveness(patternData);

    console.log(`\n📈 ${patternName.toUpperCase()}`);
    console.log('-'.repeat(80));
    console.log(`Pages Scaled: ${patternData.pagesScaledTo}`);
    console.log(`Rollout Days: ${patternData.rolloutDays}`);
    console.log(`Conversion Lift: ${(analysis.avgLift * 100).toFixed(2)}% ${analysis.meetsLiftThreshold ? '✅' : '⚠️'}`);
    console.log(`Confidence: ${(analysis.confidence * 100).toFixed(2)}% ${analysis.meetsConfidenceThreshold ? '✅' : '⚠️'}`);
    console.log(`Daily Revenue: $${analysis.avgDailyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`ROI: ${analysis.roi.toFixed(2)}x ${analysis.meetsROIThreshold ? '✅' : '⚠️'}`);
    console.log(`Stability: ${(analysis.stability * 100).toFixed(2)}% ${analysis.meetsStabilityThreshold ? '✅' : '⚠️'}`);
    console.log(`Status: ${analysis.isSuccessful ? '✅ SUCCESSFUL' : '⚠️ NEEDS ATTENTION'}`);

    totalDailyRevenue += analysis.avgDailyRevenue;
    results.push({ pattern: patternName, analysis });
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n💰 TOTAL DAILY REVENUE: $${totalDailyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`📊 PROJECTED ANNUAL: $${(totalDailyRevenue * 365).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`🎯 TARGET: $${CONFIG.targetRevenue.toLocaleString()}`);
  console.log(`📈 PROGRESS: ${((totalDailyRevenue * 365 / CONFIG.targetRevenue) * 100).toFixed(2)}%`);

  const successfulPatterns = results.filter(r => r.analysis.isSuccessful).length;
  console.log(`\n✅ Successful Patterns: ${successfulPatterns}/${CONFIG.patterns.length}`);

  // Save daily report
  const reportPath = path.join(CONFIG.reportsDir, `daily-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    date: new Date().toISOString(),
    totalDailyRevenue,
    projectedAnnual: totalDailyRevenue * 365,
    results
  }, null, 2));

  console.log(`\n📝 Report saved: ${reportPath}`);
}

// Weekly trend analysis
function runWeeklyAnalysis() {
  console.log('📊 Weekly Scaled Pattern Trend Analysis\n');
  console.log('=' .repeat(80));

  const data = generateMockPatternData(7);

  console.log(`\n📅 Period: Last 7 days`);
  console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

  const weeklyResults = {};
  let totalWeeklyRevenue = 0;

  CONFIG.patterns.forEach(patternName => {
    const patternData = data.patterns[patternName];
    const analysis = analyzePatternEffectiveness(patternData);

    weeklyResults[patternName] = analysis;
    totalWeeklyRevenue += analysis.totalRevenue;

    console.log(`\n📈 ${patternName.toUpperCase()}`);
    console.log('-'.repeat(80));
    console.log(`Pages: ${patternData.pagesScaledTo} | Rollout: ${patternData.rolloutDays} days`);
    console.log(`Conversion Lift: ${(analysis.avgLift * 100).toFixed(2)}%`);
    console.log(`Confidence: ${(analysis.confidence * 100).toFixed(2)}%`);
    console.log(`Z-Score: ${analysis.zScore.toFixed(3)}`);
    console.log(`Weekly Revenue: $${analysis.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`Avg Daily: $${analysis.avgDailyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`Projected Annual: $${analysis.projectedAnnualRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`ROI: ${analysis.roi.toFixed(2)}x`);
    console.log(`Stability: ${(analysis.stability * 100).toFixed(2)}%`);

    // Trend detection
    const firstHalfRevenue = patternData.performance.slice(0, 3).reduce((sum, d) => sum + d.revenue, 0) / 3;
    const secondHalfRevenue = patternData.performance.slice(4, 7).reduce((sum, d) => sum + d.revenue, 0) / 3;
    const trend = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;

    console.log(`Trend: ${trend > 0 ? '📈' : '📉'} ${trend.toFixed(2)}% ${Math.abs(trend) > 5 ? '(Significant)' : '(Stable)'}`);
    console.log(`Status: ${analysis.isSuccessful ? '✅ SUCCESSFUL' : '⚠️ NEEDS OPTIMIZATION'}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n💰 TOTAL WEEKLY REVENUE: $${totalWeeklyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`📊 AVG DAILY REVENUE: $${(totalWeeklyRevenue / 7).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`📊 PROJECTED ANNUAL: $${((totalWeeklyRevenue / 7) * 365).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`🎯 TARGET: $${CONFIG.targetRevenue.toLocaleString()}`);
  console.log(`📈 PROGRESS: ${(((totalWeeklyRevenue / 7) * 365 / CONFIG.targetRevenue) * 100).toFixed(2)}%`);

  // Save weekly report
  const reportPath = path.join(CONFIG.reportsDir, `weekly-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    period: '7 days',
    endDate: new Date().toISOString(),
    totalWeeklyRevenue,
    avgDailyRevenue: totalWeeklyRevenue / 7,
    projectedAnnual: (totalWeeklyRevenue / 7) * 365,
    patterns: weeklyResults
  }, null, 2));

  console.log(`\n📝 Report saved: ${reportPath}`);
}

// Pattern effectiveness report
function runEffectivenessReport() {
  console.log('📊 Pattern Effectiveness Report\n');
  console.log('=' .repeat(80));

  const data = generateMockPatternData(14); // 2 weeks of data

  console.log(`\n📅 Period: Last 14 days`);
  console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

  const rankings = [];

  CONFIG.patterns.forEach(patternName => {
    const patternData = data.patterns[patternName];
    const analysis = analyzePatternEffectiveness(patternData);

    rankings.push({
      pattern: patternName,
      score: (
        (analysis.avgLift * 0.3) +
        (analysis.confidence * 0.2) +
        ((analysis.roi / 10) * 0.2) +
        (analysis.stability * 0.15) +
        ((analysis.projectedAnnualRevenue / 50000000) * 0.15)
      ),
      ...analysis
    });
  });

  // Sort by effectiveness score
  rankings.sort((a, b) => b.score - a.score);

  console.log('\n🏆 PATTERN EFFECTIVENESS RANKINGS\n');

  rankings.forEach((item, index) => {
    console.log(`${index + 1}. ${item.pattern.toUpperCase()} (Score: ${item.score.toFixed(3)})`);
    console.log(`   Lift: ${(item.avgLift * 100).toFixed(2)}% | Confidence: ${(item.confidence * 100).toFixed(2)}%`);
    console.log(`   ROI: ${item.roi.toFixed(2)}x | Stability: ${(item.stability * 100).toFixed(2)}%`);
    console.log(`   Annual Revenue: $${item.projectedAnnualRevenue.toLocaleString()}`);
    console.log(`   Status: ${item.isSuccessful ? '✅' : '⚠️'}`);
    console.log('');
  });

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS\n');

  const topPatterns = rankings.slice(0, 2);
  const underperforming = rankings.filter(r => !r.isSuccessful);

  console.log(`🌟 Top Performers (scale aggressively):`);
  topPatterns.forEach(p => {
    console.log(`   • ${p.pattern}: ${(p.avgLift * 100).toFixed(2)}% lift, ${p.roi.toFixed(2)}x ROI`);
  });

  if (underperforming.length > 0) {
    console.log(`\n⚠️  Needs Optimization:`);
    underperforming.forEach(p => {
      const issues = [];
      if (!p.meetsLiftThreshold) issues.push('Low lift');
      if (!p.meetsConfidenceThreshold) issues.push('Low confidence');
      if (!p.meetsROIThreshold) issues.push('Low ROI');
      if (!p.meetsStabilityThreshold) issues.push('High variance');

      console.log(`   • ${p.pattern}: ${issues.join(', ')}`);
    });
  }

  // Save effectiveness report
  const reportPath = path.join(CONFIG.reportsDir, `effectiveness-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    period: '14 days',
    generatedAt: new Date().toISOString(),
    rankings,
    topPatterns: topPatterns.map(p => p.pattern),
    underperforming: underperforming.map(p => p.pattern)
  }, null, 2));

  console.log(`\n📝 Report saved: ${reportPath}`);
}

// ROI Analysis
function runROIAnalysis() {
  console.log('💰 ROI Analysis Report\n');
  console.log('=' .repeat(80));

  const data = generateMockPatternData(30); // 30 days of data

  console.log(`\n📅 Period: Last 30 days`);
  console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

  let totalInvestment = 0;
  let totalRevenueLift = 0;
  let totalProjectedAnnual = 0;

  const roiResults = [];

  CONFIG.patterns.forEach(patternName => {
    const patternData = data.patterns[patternName];
    const analysis = analyzePatternEffectiveness(patternData);

    // Calculate investment
    const implementationCost = 5000;
    const scalingCost = patternData.pagesScaledTo * 500; // $500 per page
    const totalCost = implementationCost + scalingCost;

    // Calculate benefit
    const baseRevenue = analysis.avgDailyRevenue / (1 + analysis.avgLift);
    const liftRevenue = analysis.avgDailyRevenue - baseRevenue;
    const monthlyBenefit = liftRevenue * 30;
    const annualBenefit = liftRevenue * 365;

    const roi = annualBenefit / totalCost;
    const paybackDays = totalCost / liftRevenue;

    roiResults.push({
      pattern: patternName,
      investment: totalCost,
      monthlyBenefit,
      annualBenefit,
      roi,
      paybackDays,
      lift: analysis.avgLift
    });

    totalInvestment += totalCost;
    totalRevenueLift += liftRevenue * 30;
    totalProjectedAnnual += annualBenefit;

    console.log(`\n💎 ${patternName.toUpperCase()}`);
    console.log('-'.repeat(80));
    console.log(`Investment: $${totalCost.toLocaleString()}`);
    console.log(`  - Implementation: $${implementationCost.toLocaleString()}`);
    console.log(`  - Scaling (${patternData.pagesScaledTo} pages): $${scalingCost.toLocaleString()}`);
    console.log(`\nRevenue Impact:`);
    console.log(`  - Daily Lift: $${liftRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`  - Monthly Benefit: $${monthlyBenefit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`  - Annual Benefit: $${annualBenefit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    console.log(`\nROI Metrics:`);
    console.log(`  - ROI: ${roi.toFixed(2)}x (${((roi - 1) * 100).toFixed(0)}% return)`);
    console.log(`  - Payback Period: ${paybackDays.toFixed(1)} days`);
    console.log(`  - Conversion Lift: ${(analysis.avgLift * 100).toFixed(2)}%`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 PORTFOLIO ROI SUMMARY\n`);
  console.log(`Total Investment: $${totalInvestment.toLocaleString()}`);
  console.log(`Monthly Revenue Lift: $${totalRevenueLift.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`Annual Revenue Lift: $${totalProjectedAnnual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
  console.log(`\nPortfolio ROI: ${(totalProjectedAnnual / totalInvestment).toFixed(2)}x`);
  console.log(`Portfolio Payback: ${(totalInvestment / (totalRevenueLift / 30)).toFixed(1)} days`);

  // Investment efficiency
  const avgROI = roiResults.reduce((sum, r) => sum + r.roi, 0) / roiResults.length;
  const bestROI = Math.max(...roiResults.map(r => r.roi));
  const worstROI = Math.min(...roiResults.map(r => r.roi));

  console.log(`\n📈 Portfolio Metrics:`);
  console.log(`  - Average ROI: ${avgROI.toFixed(2)}x`);
  console.log(`  - Best ROI: ${bestROI.toFixed(2)}x`);
  console.log(`  - Worst ROI: ${worstROI.toFixed(2)}x`);
  console.log(`  - ROI Range: ${(bestROI - worstROI).toFixed(2)}x`);

  // Save ROI report
  const reportPath = path.join(CONFIG.reportsDir, `roi-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    period: '30 days',
    generatedAt: new Date().toISOString(),
    totalInvestment,
    totalRevenueLift,
    totalProjectedAnnual,
    portfolioROI: totalProjectedAnnual / totalInvestment,
    patterns: roiResults
  }, null, 2));

  console.log(`\n📝 Report saved: ${reportPath}`);
}

// Generate optimization recommendations
function generateRecommendations() {
  console.log('💡 Optimization Recommendations\n');
  console.log('=' .repeat(80));

  const data = generateMockPatternData(14);

  console.log(`\n📅 Based on: Last 14 days`);
  console.log(`⏰ Generated: ${new Date().toLocaleString()}\n`);

  const recommendations = [];

  CONFIG.patterns.forEach(patternName => {
    const patternData = data.patterns[patternName];
    const analysis = analyzePatternEffectiveness(patternData);

    // Generate specific recommendations
    if (!analysis.isSuccessful) {
      if (!analysis.meetsLiftThreshold) {
        recommendations.push({
          priority: 'HIGH',
          pattern: patternName,
          issue: 'Low conversion lift',
          action: 'Refine pattern implementation, test variations, or pause scaling',
          impact: 'Could improve by ' + ((CONFIG.thresholds.minConversionLift - analysis.avgLift) * 100).toFixed(2) + '% to meet threshold'
        });
      }

      if (!analysis.meetsConfidenceThreshold) {
        recommendations.push({
          priority: 'MEDIUM',
          pattern: patternName,
          issue: 'Statistical confidence too low',
          action: 'Increase sample size, extend test duration, or reduce variance',
          impact: 'Need ' + ((CONFIG.thresholds.minConfidence - analysis.confidence) * 100).toFixed(2) + '% more confidence'
        });
      }

      if (!analysis.meetsStabilityThreshold) {
        recommendations.push({
          priority: 'MEDIUM',
          pattern: patternName,
          issue: 'High performance variance',
          action: 'Investigate inconsistencies, stabilize implementation, or segment audience',
          impact: 'Stability at ' + (analysis.stability * 100).toFixed(2) + '% (target: 90%+)'
        });
      }
    } else {
      // Successful patterns - scale opportunities
      if (patternData.pagesScaledTo < 10) {
        recommendations.push({
          priority: 'HIGH',
          pattern: patternName,
          issue: 'Successful pattern not fully scaled',
          action: `Scale to ${10 - patternData.pagesScaledTo} more pages`,
          impact: `Potential +$${((analysis.avgDailyRevenue / patternData.pagesScaledTo) * (10 - patternData.pagesScaledTo) * 365).toLocaleString()} annual revenue`
        });
      }
    }
  });

  // Sort by priority
  const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  console.log('\n🎯 ACTION ITEMS\n');

  let highCount = 0, mediumCount = 0, lowCount = 0;

  recommendations.forEach((rec, index) => {
    const icon = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢';
    console.log(`${icon} [${rec.priority}] ${rec.pattern.toUpperCase()}`);
    console.log(`   Issue: ${rec.issue}`);
    console.log(`   Action: ${rec.action}`);
    console.log(`   Impact: ${rec.impact}`);
    console.log('');

    if (rec.priority === 'HIGH') highCount++;
    else if (rec.priority === 'MEDIUM') mediumCount++;
    else lowCount++;
  });

  console.log('='.repeat(80));
  console.log(`\n📋 Summary: ${recommendations.length} recommendations`);
  console.log(`   🔴 High Priority: ${highCount}`);
  console.log(`   🟡 Medium Priority: ${mediumCount}`);
  console.log(`   🟢 Low Priority: ${lowCount}`);

  // Next steps
  console.log(`\n📅 NEXT STEPS:\n`);
  console.log(`1. Address all HIGH priority items within 3 days`);
  console.log(`2. Plan MEDIUM priority items for next week`);
  console.log(`3. Monitor pattern performance daily`);
  console.log(`4. Re-run analysis in 7 days to validate improvements`);

  // Save recommendations
  const reportPath = path.join(CONFIG.reportsDir, `recommendations-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalRecommendations: recommendations.length,
    highPriority: highCount,
    mediumPriority: mediumCount,
    lowPriority: lowCount,
    recommendations
  }, null, 2));

  console.log(`\n📝 Report saved: ${reportPath}`);
}

// Main execution
function main() {
  ensureDirectories();

  const args = process.argv.slice(2);
  const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'daily';

  console.log('\n🚀 Scaled Pattern Performance Monitor\n');

  switch (mode) {
    case 'daily':
      runDailyCheck();
      break;
    case 'weekly':
      runWeeklyAnalysis();
      break;
    case 'effectiveness':
      runEffectivenessReport();
      break;
    case 'roi':
      runROIAnalysis();
      break;
    case 'recommendations':
      generateRecommendations();
      break;
    default:
      console.error(`❌ Unknown mode: ${mode}`);
      console.log('\nAvailable modes:');
      console.log('  --mode=daily           Daily performance check');
      console.log('  --mode=weekly          Weekly trend analysis');
      console.log('  --mode=effectiveness   Pattern effectiveness rankings');
      console.log('  --mode=roi             ROI analysis');
      console.log('  --mode=recommendations Optimization recommendations');
      process.exit(1);
  }

  console.log('\n✅ Analysis complete!\n');
}

if (require.main === module) {
  main();
}

module.exports = {
  generateMockPatternData,
  analyzePatternEffectiveness,
  calculateStatistics
};
