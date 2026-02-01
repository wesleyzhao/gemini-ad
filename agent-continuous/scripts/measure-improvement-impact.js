#!/usr/bin/env node

/**
 * Measure Improvement Impact
 * Feature #53: Tracks the actual impact of implemented improvements
 *
 * This script measures the real-world impact of UX improvements by:
 * 1. Comparing metrics before and after implementation
 * 2. Calculating actual vs expected impact
 * 3. Identifying which improvements worked best
 * 4. Generating lessons learned for future iterations
 *
 * Usage:
 *   node scripts/measure-improvement-impact.js [--since=YYYY-MM-DD]
 */

const fs = require('fs');
const path = require('path');

class ImpactMeasurement {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports');
    this.historicalDir = path.join(this.reportsDir, 'historical');
    this.improvementsDir = path.join(this.reportsDir, 'improvements');
    this.impactReportsDir = path.join(this.reportsDir, 'impact-analysis');

    if (!fs.existsSync(this.impactReportsDir)) {
      fs.mkdirSync(this.impactReportsDir, { recursive: true });
    }
  }

  /**
   * Measure impact of implementations
   */
  async measureImpact(sinceDate) {
    console.log('📊 Measuring Improvement Impact\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Load historical metrics
    const historicalData = this.loadHistoricalData(sinceDate);

    if (historicalData.length < 2) {
      console.log('⚠️  Need at least 2 historical data points');
      console.log('   Run monitoring to generate more data over time\n');
      return null;
    }

    console.log(`📅 Analyzing ${historicalData.length} data points from ${historicalData[0].date} to ${historicalData[historicalData.length - 1].date}\n`);

    // Load implementation records
    const implementations = this.loadImplementationRecords();

    // Calculate impact for each page
    const pageImpacts = this.calculatePageImpacts(historicalData);

    // Correlate with implementations
    const correlatedResults = this.correlateWithImplementations(
      pageImpacts,
      implementations
    );

    // Analyze effectiveness
    const effectiveness = this.analyzeEffectiveness(correlatedResults);

    // Generate lessons learned
    const lessons = this.generateLessons(correlatedResults, effectiveness);

    // Create report
    const report = {
      timestamp: new Date().toISOString(),
      period: {
        start: historicalData[0].date,
        end: historicalData[historicalData.length - 1].date,
        dataPoints: historicalData.length
      },
      summary: {
        pagesAnalyzed: Object.keys(pageImpacts).length,
        implementationsTracked: implementations.length,
        overallImpact: effectiveness.overall
      },
      pageImpacts: pageImpacts,
      correlations: correlatedResults,
      effectiveness: effectiveness,
      lessons: lessons
    };

    // Save and display
    this.saveImpactReport(report);
    this.displayImpactSummary(report);

    return report;
  }

  /**
   * Load historical performance data
   */
  loadHistoricalData(sinceDate) {
    const files = fs.readdirSync(this.historicalDir)
      .filter(f => f.startsWith('ux-metrics-'))
      .sort();

    const data = [];

    for (const file of files) {
      const date = file.match(/ux-metrics-(.+)\.json/)?.[1];

      if (!date) continue;

      if (sinceDate && date < sinceDate) continue;

      try {
        const content = JSON.parse(
          fs.readFileSync(path.join(this.historicalDir, file), 'utf8')
        );
        data.push({
          date,
          ...content
        });
      } catch (error) {
        console.log(`⚠️  Error loading ${file}: ${error.message}`);
      }
    }

    return data;
  }

  /**
   * Load implementation records
   */
  loadImplementationRecords() {
    const files = fs.readdirSync(this.improvementsDir)
      .filter(f => f.startsWith('implementation-'))
      .sort();

    const implementations = [];

    for (const file of files) {
      try {
        const content = JSON.parse(
          fs.readFileSync(path.join(this.improvementsDir, file), 'utf8')
        );

        if (!content.dryRun) {
          implementations.push({
            date: content.timestamp.split('T')[0],
            ...content
          });
        }
      } catch (error) {
        console.log(`⚠️  Error loading ${file}: ${error.message}`);
      }
    }

    return implementations;
  }

  /**
   * Calculate impact for each page over time
   */
  calculatePageImpacts(historicalData) {
    const pageImpacts = {};

    // Get all unique pages
    const allPages = new Set();
    historicalData.forEach(data => {
      if (data.pageMetrics) {
        Object.keys(data.pageMetrics).forEach(page => allPages.add(page));
      }
    });

    // Calculate trends for each page
    for (const page of allPages) {
      const pageData = historicalData
        .map(data => ({
          date: data.date,
          metrics: data.pageMetrics?.[page]
        }))
        .filter(d => d.metrics);

      if (pageData.length >= 2) {
        const first = pageData[0];
        const last = pageData[pageData.length - 1];

        // Calculate changes
        const qualityChange = last.metrics.qualityScore - first.metrics.qualityScore;
        const conversionChange = last.metrics.conversionRate - first.metrics.conversionRate;
        const bounceChange = last.metrics.bounceRate - first.metrics.bounceRate;
        const engagementChange = last.metrics.engagementRate - first.metrics.engagementRate;

        // Calculate velocity (change per day)
        const days = this.daysBetween(first.date, last.date);
        const velocity = days > 0 ? qualityChange / days : 0;

        pageImpacts[page] = {
          baseline: {
            date: first.date,
            qualityScore: first.metrics.qualityScore,
            conversionRate: first.metrics.conversionRate,
            bounceRate: first.metrics.bounceRate,
            engagementRate: first.metrics.engagementRate
          },
          current: {
            date: last.date,
            qualityScore: last.metrics.qualityScore,
            conversionRate: last.metrics.conversionRate,
            bounceRate: last.metrics.bounceRate,
            engagementRate: last.metrics.engagementRate
          },
          changes: {
            qualityScore: qualityChange,
            conversionRate: conversionChange,
            bounceRate: bounceChange,
            engagementRate: engagementChange
          },
          percentChanges: {
            qualityScore: this.percentChange(first.metrics.qualityScore, last.metrics.qualityScore),
            conversionRate: this.percentChange(first.metrics.conversionRate, last.metrics.conversionRate),
            bounceRate: this.percentChange(first.metrics.bounceRate, last.metrics.bounceRate),
            engagementRate: this.percentChange(first.metrics.engagementRate, last.metrics.engagementRate)
          },
          velocity: velocity,
          trend: this.categorizeTrend(qualityChange, velocity),
          dataPoints: pageData.length
        };
      }
    }

    return pageImpacts;
  }

  /**
   * Correlate impacts with implementations
   */
  correlateWithImplementations(pageImpacts, implementations) {
    const correlations = [];

    for (const [page, impact] of Object.entries(pageImpacts)) {
      // Find implementations for this page
      const pageImplementations = implementations.filter(impl =>
        impl.details?.some(d => d.page === page && d.totalChanges > 0)
      );

      if (pageImplementations.length > 0) {
        // Calculate if improvements matched expectations
        const totalChanges = pageImplementations.reduce(
          (sum, impl) => sum + (impl.details.find(d => d.page === page)?.totalChanges || 0),
          0
        );

        correlations.push({
          page,
          implementations: pageImplementations.length,
          totalChanges,
          impact,
          effectiveness: this.calculateEffectiveness(impact),
          matchedExpectations: this.didMatchExpectations(impact)
        });
      }
    }

    return correlations;
  }

  /**
   * Calculate effectiveness score
   */
  calculateEffectiveness(impact) {
    let score = 0;
    let factors = 0;

    // Quality score improvement
    if (impact.changes.qualityScore > 0) {
      score += Math.min(impact.changes.qualityScore / 20, 1) * 40;
      factors++;
    }

    // Conversion improvement
    if (impact.changes.conversionRate > 0) {
      score += Math.min(impact.changes.conversionRate / 10, 1) * 30;
      factors++;
    }

    // Bounce rate reduction
    if (impact.changes.bounceRate < 0) {
      score += Math.min(Math.abs(impact.changes.bounceRate) / 15, 1) * 20;
      factors++;
    }

    // Engagement improvement
    if (impact.changes.engagementRate > 0) {
      score += Math.min(impact.changes.engagementRate / 15, 1) * 10;
      factors++;
    }

    return factors > 0 ? score : 0;
  }

  /**
   * Check if impact matched expectations
   */
  didMatchExpectations(impact) {
    const expectations = {
      qualityScore: 15, // Expected avg improvement
      conversionRate: 5,
      bounceRate: -10,
      engagementRate: 10
    };

    const matches = {
      qualityScore: impact.changes.qualityScore >= expectations.qualityScore * 0.7,
      conversionRate: impact.changes.conversionRate >= expectations.conversionRate * 0.7,
      bounceRate: impact.changes.bounceRate <= expectations.bounceRate * 0.7,
      engagementRate: impact.changes.engagementRate >= expectations.engagementRate * 0.7
    };

    const matchCount = Object.values(matches).filter(Boolean).length;
    return {
      score: matchCount / 4,
      matched: matches,
      overall: matchCount >= 2 ? 'yes' : matchCount >= 1 ? 'partial' : 'no'
    };
  }

  /**
   * Analyze overall effectiveness
   */
  analyzeEffectiveness(correlations) {
    if (correlations.length === 0) {
      return {
        overall: 0,
        grade: 'N/A',
        distribution: {}
      };
    }

    const avgEffectiveness = correlations.reduce(
      (sum, c) => sum + c.effectiveness,
      0
    ) / correlations.length;

    const distribution = {
      excellent: correlations.filter(c => c.effectiveness >= 80).length,
      good: correlations.filter(c => c.effectiveness >= 60 && c.effectiveness < 80).length,
      fair: correlations.filter(c => c.effectiveness >= 40 && c.effectiveness < 60).length,
      poor: correlations.filter(c => c.effectiveness < 40).length
    };

    return {
      overall: avgEffectiveness,
      grade: this.scoreToGrade(avgEffectiveness),
      distribution,
      successRate: (distribution.excellent + distribution.good) / correlations.length,
      topPerformers: correlations
        .filter(c => c.effectiveness >= 70)
        .sort((a, b) => b.effectiveness - a.effectiveness)
        .slice(0, 5)
        .map(c => ({ page: c.page, effectiveness: c.effectiveness })),
      underperformers: correlations
        .filter(c => c.effectiveness < 40)
        .map(c => ({ page: c.page, effectiveness: c.effectiveness }))
    };
  }

  /**
   * Generate lessons learned
   */
  generateLessons(correlations, effectiveness) {
    const lessons = {
      successes: [],
      failures: [],
      insights: [],
      recommendations: []
    };

    // Analyze successes
    const successful = correlations.filter(c => c.effectiveness >= 70);
    if (successful.length > 0) {
      const avgImpact = successful.reduce(
        (sum, c) => sum + (c.impact?.changes?.qualityScore || 0),
        0
      ) / successful.length;

      lessons.successes.push({
        pattern: 'High-effectiveness implementations',
        count: successful.length,
        avgImpact: avgImpact.toFixed(1),
        insight: `${successful.length} pages showed excellent results with avg +${avgImpact.toFixed(1)} quality improvement`
      });
    }

    // Analyze failures
    const failed = correlations.filter(c => c.effectiveness < 40);
    if (failed.length > 0) {
      lessons.failures.push({
        pattern: 'Low-effectiveness implementations',
        count: failed.length,
        insight: `${failed.length} pages did not respond well to improvements. May need different approach.`
      });
    }

    // Generate insights
    if (effectiveness.successRate >= 0.7) {
      lessons.insights.push({
        type: 'positive',
        message: `High success rate (${(effectiveness.successRate * 100).toFixed(0)}%) indicates improvement strategy is working well`
      });
    } else if (effectiveness.successRate < 0.4) {
      lessons.insights.push({
        type: 'concern',
        message: `Low success rate (${(effectiveness.successRate * 100).toFixed(0)}%) suggests need to revise improvement approach`
      });
    }

    // Generate recommendations
    if (effectiveness.topPerformers.length > 0) {
      lessons.recommendations.push({
        priority: 'high',
        action: 'Replicate Success Patterns',
        details: `Study top performers (${effectiveness.topPerformers.map(p => p.page).join(', ')}) and apply similar changes to other pages`
      });
    }

    if (effectiveness.underperformers.length > 0) {
      lessons.recommendations.push({
        priority: 'high',
        action: 'Investigate Underperformers',
        details: `Deep dive into why ${effectiveness.underperformers.length} pages didn't improve. Consider A/B testing different approaches.`
      });
    }

    if (effectiveness.overall >= 60) {
      lessons.recommendations.push({
        priority: 'medium',
        action: 'Continue Current Strategy',
        details: 'Overall effectiveness is good. Maintain current improvement approach while optimizing.'
      });
    } else {
      lessons.recommendations.push({
        priority: 'critical',
        action: 'Revise Improvement Strategy',
        details: 'Low overall effectiveness. Need to fundamentally rethink improvement approach.'
      });
    }

    return lessons;
  }

  /**
   * Save impact report
   */
  saveImpactReport(report) {
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(this.impactReportsDir, `impact-analysis-${date}.json`);

    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`\n✅ Impact report saved: ${filename}\n`);
  }

  /**
   * Display impact summary
   */
  displayImpactSummary(report) {
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 IMPACT ANALYSIS SUMMARY\n');
    console.log(`📅 Period: ${report.period.start} to ${report.period.end} (${report.period.dataPoints} data points)\n`);
    console.log(`📄 Pages analyzed: ${report.summary.pagesAnalyzed}`);
    console.log(`🔧 Implementations tracked: ${report.summary.implementationsTracked}\n`);

    console.log(`📈 Overall Effectiveness: ${report.effectiveness.overall.toFixed(1)} (${report.effectiveness.grade})`);
    console.log(`✅ Success Rate: ${(report.effectiveness.successRate * 100).toFixed(0)}%\n`);

    console.log('📊 Distribution:');
    console.log(`   Excellent (80+): ${report.effectiveness.distribution.excellent} pages`);
    console.log(`   Good (60-79): ${report.effectiveness.distribution.good} pages`);
    console.log(`   Fair (40-59): ${report.effectiveness.distribution.fair} pages`);
    console.log(`   Poor (<40): ${report.effectiveness.distribution.poor} pages\n`);

    if (report.effectiveness.topPerformers.length > 0) {
      console.log('🏆 Top Performers:');
      report.effectiveness.topPerformers.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.page}: ${p.effectiveness.toFixed(1)} effectiveness`);
      });
      console.log();
    }

    if (report.lessons.recommendations.length > 0) {
      console.log('💡 Key Recommendations:');
      report.lessons.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`);
        console.log(`      ${rec.details}\n`);
      });
    }

    console.log('═══════════════════════════════════════════════════════════════\n');
  }

  /**
   * Helper: Calculate percent change
   */
  percentChange(from, to) {
    if (from === 0) return 0;
    return ((to - from) / from) * 100;
  }

  /**
   * Helper: Calculate days between dates
   */
  daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2 - d1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Helper: Categorize trend
   */
  categorizeTrend(change, velocity) {
    if (change >= 15) return 'strong-positive';
    if (change >= 5) return 'positive';
    if (change >= -5) return 'stable';
    if (change >= -15) return 'negative';
    return 'strong-negative';
  }

  /**
   * Helper: Score to grade
   */
  scoreToGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    return 'F';
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const sinceDate = args.find(arg => arg.startsWith('--since='))?.split('=')[1];

  const measurement = new ImpactMeasurement();
  measurement.measureImpact(sinceDate);
}

module.exports = ImpactMeasurement;
