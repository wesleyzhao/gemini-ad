#!/usr/bin/env node

/**
 * Continuous UX Improvement Engine
 * Feature #53: Ongoing refinement - Continuous UX improvement and advanced analytics iteration
 *
 * This script implements an automated continuous improvement workflow that:
 * 1. Analyzes current UX metrics and recommendations
 * 2. Prioritizes improvements based on impact and effort
 * 3. Generates actionable improvement plans with specific changes
 * 4. Tracks improvement impact over time
 * 5. Iterates on successful patterns
 *
 * Usage:
 *   node scripts/continuous-ux-improvement.js [--analyze|--implement|--track]
 */

const fs = require('fs');
const path = require('path');

class ContinuousUXImprovement {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports');
    this.uxAnalysisDir = path.join(this.reportsDir, 'ux-analysis');
    this.recommendationsDir = path.join(this.reportsDir, 'recommendations');
    this.improvementsDir = path.join(this.reportsDir, 'improvements');
    this.historicalDir = path.join(this.reportsDir, 'historical');

    // Create improvements directory if it doesn't exist
    if (!fs.existsSync(this.improvementsDir)) {
      fs.mkdirSync(this.improvementsDir, { recursive: true });
    }

    this.improvementRules = this.defineImprovementRules();
  }

  /**
   * Define specific improvement rules with actionable changes
   */
  defineImprovementRules() {
    return {
      // Hero section improvements
      'improve-hero-clarity': {
        priority: 'critical',
        category: 'Hero Section',
        triggers: ['poor-quality-score', 'high-bounce-rate'],
        changes: [
          {
            element: 'h1',
            action: 'Shorten headline to max 8 words',
            example: 'Before: "Gemini: The Future of AI-Powered Productivity..." → After: "Your AI Assistant, Powered by Google"'
          },
          {
            element: 'hero-subtitle',
            action: 'Add benefit-focused subheadline',
            example: 'Add: "Get accurate answers with real-time web access and Google integration"'
          },
          {
            element: 'hero-visual',
            action: 'Add animated product screenshot or demo',
            example: 'Include 3-5 second auto-playing demo loop'
          }
        ],
        expectedImpact: {
          qualityScore: '+15-25 points',
          bounceRate: '-20-30%',
          timeOnPage: '+10-20s'
        },
        effort: 'medium',
        timeframe: '2-4 hours'
      },

      // CTA optimization
      'optimize-cta': {
        priority: 'critical',
        category: 'Call to Action',
        triggers: ['low-conversion', 'poor-quality-score'],
        changes: [
          {
            element: 'primary-cta',
            action: 'Use action-oriented, benefit-focused text',
            example: 'Before: "Try Now" → After: "Start Creating with Gemini"'
          },
          {
            element: 'cta-placement',
            action: 'Add CTA above the fold AND after each benefit section',
            example: 'Minimum 3 CTAs per page at strategic points'
          },
          {
            element: 'cta-design',
            action: 'Increase contrast and size for visibility',
            example: 'Use Google Blue (#4285f4) with white text, min 48px height'
          },
          {
            element: 'secondary-cta',
            action: 'Add low-friction secondary action',
            example: 'Add "Watch Demo" or "See Examples" as alternative'
          }
        ],
        expectedImpact: {
          conversionRate: '+30-50%',
          clickthrough: '+40-60%',
          qualityScore: '+10-15 points'
        },
        effort: 'low',
        timeframe: '1-2 hours'
      },

      // Engagement improvements
      'increase-interactivity': {
        priority: 'high',
        category: 'Engagement',
        triggers: ['low-interaction', 'low-engagement'],
        changes: [
          {
            element: 'feature-cards',
            action: 'Add hover animations and click-to-expand',
            example: 'Transform static features into interactive cards with details modal'
          },
          {
            element: 'demo-section',
            action: 'Add interactive product demo or playground',
            example: 'Embed live Gemini example users can try (pre-populated prompts)'
          },
          {
            element: 'comparison-tool',
            action: 'Add interactive feature comparison slider',
            example: 'Gemini vs ChatGPT vs Claude - users toggle features'
          },
          {
            element: 'video-content',
            action: 'Add 15-30 second feature highlight videos',
            example: 'Auto-play muted demo loops with play/pause control'
          }
        ],
        expectedImpact: {
          clicks: '+100-200%',
          timeOnPage: '+20-40s',
          engagementRate: '+25-35%',
          qualityScore: '+8-12 points'
        },
        effort: 'medium',
        timeframe: '3-5 hours'
      },

      // Content optimization
      'simplify-messaging': {
        priority: 'high',
        category: 'Content',
        triggers: ['high-bounce-rate', 'poor-quality-score'],
        changes: [
          {
            element: 'body-copy',
            action: 'Reduce text by 40%, use bullet points',
            example: 'Max 3 bullet points per section, 10 words per bullet'
          },
          {
            element: 'jargon',
            action: 'Replace technical terms with simple language',
            example: 'Before: "Leverage multimodal capabilities" → After: "Work with text, images, and code"'
          },
          {
            element: 'value-props',
            action: 'Lead with user benefits, not features',
            example: 'Before: "Advanced RAG architecture" → After: "Get accurate answers from your own files"'
          },
          {
            element: 'social-proof',
            action: 'Add credibility indicators early',
            example: 'Add: "Trusted by 10M+ Google users" near hero'
          }
        ],
        expectedImpact: {
          bounceRate: '-15-25%',
          readability: '+30-40%',
          qualityScore: '+10-15 points'
        },
        effort: 'low',
        timeframe: '1-3 hours'
      },

      // Visual hierarchy
      'improve-visual-hierarchy': {
        priority: 'medium',
        category: 'Design',
        triggers: ['poor-quality-score', 'low-scroll-depth'],
        changes: [
          {
            element: 'typography',
            action: 'Increase size contrast between headings and body',
            example: 'H1: 48-64px, H2: 32-40px, Body: 16-18px'
          },
          {
            element: 'whitespace',
            action: 'Add 2x spacing between sections',
            example: 'Min 80px vertical spacing between major sections'
          },
          {
            element: 'color-hierarchy',
            action: 'Use Google brand colors to guide attention',
            example: 'Blue for CTAs, Red for alerts, Green for success, Yellow for highlights'
          },
          {
            element: 'visual-flow',
            action: 'Add directional cues (arrows, animations)',
            example: 'Subtle scroll indicator, animated arrows pointing to CTA'
          }
        ],
        expectedImpact: {
          scrollDepth: '+15-25%',
          comprehension: '+20-30%',
          qualityScore: '+5-10 points'
        },
        effort: 'low',
        timeframe: '2-3 hours'
      },

      // Trust signals
      'add-trust-signals': {
        priority: 'high',
        category: 'Trust',
        triggers: ['low-conversion', 'high-bounce-rate'],
        changes: [
          {
            element: 'security-badge',
            action: 'Add Google security & privacy indicators',
            example: 'Display "Powered by Google" with security badge'
          },
          {
            element: 'testimonials',
            action: 'Add real user quotes with photos',
            example: '2-3 testimonials from verified Google Workspace users'
          },
          {
            element: 'stats',
            action: 'Display impressive usage numbers',
            example: '"10M+ users", "1B+ queries answered", "99.9% uptime"'
          },
          {
            element: 'integrations',
            action: 'Show logos of integrated Google services',
            example: 'Gmail, Drive, Docs, Calendar, Meet logos'
          }
        ],
        expectedImpact: {
          conversionRate: '+20-30%',
          trustScore: '+25-35%',
          qualityScore: '+8-12 points'
        },
        effort: 'low',
        timeframe: '1-2 hours'
      },

      // Mobile optimization
      'optimize-mobile': {
        priority: 'high',
        category: 'Responsive',
        triggers: ['poor-quality-score', 'high-bounce-rate'],
        changes: [
          {
            element: 'hero-mobile',
            action: 'Prioritize single-column layout with larger tap targets',
            example: 'Min 44px touch targets, remove horizontal scrolling'
          },
          {
            element: 'nav-mobile',
            action: 'Implement hamburger menu with clear sections',
            example: 'Sticky header with prominent CTA always visible'
          },
          {
            element: 'images-mobile',
            action: 'Optimize images for mobile bandwidth',
            example: 'Serve WebP format, max 300KB per image'
          },
          {
            element: 'forms-mobile',
            action: 'Simplify forms to essential fields only',
            example: 'Single-field email capture, large submit button'
          }
        ],
        expectedImpact: {
          mobileBounceRate: '-20-30%',
          mobileConversion: '+25-40%',
          qualityScore: '+10-15 points'
        },
        effort: 'medium',
        timeframe: '2-4 hours'
      },

      // Performance optimization
      'boost-performance': {
        priority: 'medium',
        category: 'Performance',
        triggers: ['slow-load-time', 'high-bounce-rate'],
        changes: [
          {
            element: 'images',
            action: 'Implement lazy loading and modern formats',
            example: 'Use loading="lazy" attribute, convert to WebP'
          },
          {
            element: 'fonts',
            action: 'Optimize font loading strategy',
            example: 'Use font-display: swap, preload critical fonts'
          },
          {
            element: 'animations',
            action: 'Use CSS transforms instead of layout properties',
            example: 'Transform/opacity for animations, not top/left/width'
          },
          {
            element: 'scripts',
            action: 'Defer non-critical JavaScript',
            example: 'Add defer/async attributes, load analytics last'
          }
        ],
        expectedImpact: {
          loadTime: '-30-50%',
          bounceRate: '-10-15%',
          qualityScore: '+5-8 points'
        },
        effort: 'low',
        timeframe: '1-2 hours'
      }
    };
  }

  /**
   * Analyze current state and generate improvement plan
   */
  async analyzeAndPlan() {
    console.log('🔍 Analyzing current UX metrics and generating improvement plan...\n');

    // Load latest data
    const uxAnalysis = this.loadLatestUXAnalysis();
    const recommendations = this.loadLatestRecommendations();

    if (!uxAnalysis || !recommendations) {
      console.error('❌ Could not load analysis data. Run monitoring first.');
      return null;
    }

    // Identify pages needing improvement
    const pagesNeedingImprovement = this.identifyPriorityPages(uxAnalysis);

    // Generate specific improvement plans for each page
    const improvementPlans = this.generateImprovementPlans(
      pagesNeedingImprovement,
      recommendations
    );

    // Prioritize improvements across all pages
    const prioritizedPlan = this.prioritizeImprovements(improvementPlans);

    // Save improvement plan
    this.saveImprovementPlan(prioritizedPlan);

    return prioritizedPlan;
  }

  /**
   * Identify pages that need improvement
   */
  identifyPriorityPages(uxAnalysis) {
    const pages = [];

    for (const [pageName, pageData] of Object.entries(uxAnalysis.engagementAnalysis)) {
      const issues = [];

      // Check quality score
      if (pageData.qualityScore < 60) {
        issues.push('poor-quality-score');
      }

      // Check bounce rate
      if (pageData.metrics.bounceRate > 40) {
        issues.push('high-bounce-rate');
      }

      // Check conversion
      if (pageData.metrics.conversionRate < 15) {
        issues.push('low-conversion');
      }

      // Check engagement
      if (pageData.metrics.engagementRate < 40) {
        issues.push('low-engagement');
      }

      // Check interactions
      if (pageData.metrics.avgClicks < 2.5) {
        issues.push('low-interaction');
      }

      // Check scroll depth
      if (pageData.metrics.avgScrollDepth < 50) {
        issues.push('low-scroll-depth');
      }

      if (issues.length > 0) {
        pages.push({
          page: pageName,
          qualityScore: pageData.qualityScore,
          grade: pageData.grade,
          metrics: pageData.metrics,
          issues: issues,
          urgency: this.calculateUrgency(pageData.qualityScore, issues.length)
        });
      }
    }

    // Sort by urgency
    return pages.sort((a, b) => b.urgency - a.urgency);
  }

  /**
   * Calculate urgency score
   */
  calculateUrgency(qualityScore, issueCount) {
    return (100 - qualityScore) * 0.7 + (issueCount * 10);
  }

  /**
   * Generate specific improvement plans for pages
   */
  generateImprovementPlans(pages, recommendations) {
    const plans = [];

    for (const page of pages) {
      const pagePlan = {
        page: page.page,
        currentState: {
          qualityScore: page.qualityScore,
          grade: page.grade,
          metrics: page.metrics,
          issues: page.issues
        },
        improvements: [],
        estimatedImpact: {
          qualityScoreIncrease: 0,
          effort: 0,
          timeframe: ''
        }
      };

      // Match improvement rules to issues
      for (const [ruleId, rule] of Object.entries(this.improvementRules)) {
        const matchingIssues = rule.triggers.filter(trigger =>
          page.issues.includes(trigger)
        );

        if (matchingIssues.length > 0) {
          pagePlan.improvements.push({
            ruleId: ruleId,
            title: rule.category,
            priority: rule.priority,
            changes: rule.changes,
            expectedImpact: rule.expectedImpact,
            effort: rule.effort,
            timeframe: rule.timeframe,
            matchedIssues: matchingIssues
          });
        }
      }

      // Calculate total estimated impact
      pagePlan.estimatedImpact = this.calculateTotalImpact(pagePlan.improvements);

      plans.push(pagePlan);
    }

    return plans;
  }

  /**
   * Calculate total impact of all improvements for a page
   */
  calculateTotalImpact(improvements) {
    let qualityScoreIncrease = 0;
    let totalHours = 0;

    for (const improvement of improvements) {
      // Parse quality score increase
      const impactStr = improvement.expectedImpact.qualityScore;
      if (impactStr) {
        const matches = impactStr.match(/\+(\d+)-(\d+)/);
        if (matches) {
          const avg = (parseInt(matches[1]) + parseInt(matches[2])) / 2;
          qualityScoreIncrease += avg;
        }
      }

      // Parse timeframe
      const timeStr = improvement.timeframe;
      if (timeStr) {
        const matches = timeStr.match(/(\d+)-(\d+) hours?/);
        if (matches) {
          const avg = (parseInt(matches[1]) + parseInt(matches[2])) / 2;
          totalHours += avg;
        }
      }
    }

    return {
      qualityScoreIncrease: Math.round(qualityScoreIncrease),
      totalHours: totalHours,
      timeframe: `${Math.round(totalHours)} hours`,
      roi: qualityScoreIncrease / totalHours // points per hour
    };
  }

  /**
   * Prioritize improvements across all pages
   */
  prioritizeImprovements(plans) {
    // Extract all improvements with page context
    const allImprovements = [];

    for (const plan of plans) {
      for (const improvement of plan.improvements) {
        allImprovements.push({
          page: plan.page,
          currentQualityScore: plan.currentState.qualityScore,
          ...improvement
        });
      }
    }

    // Sort by priority and ROI
    const priorityWeights = { critical: 3, high: 2, medium: 1, low: 0 };

    allImprovements.sort((a, b) => {
      const aPriority = priorityWeights[a.priority] || 0;
      const bPriority = priorityWeights[b.priority] || 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // If same priority, sort by ROI (impact per hour)
      const aTimeframe = parseFloat(a.timeframe) || 1;
      const bTimeframe = parseFloat(b.timeframe) || 1;
      const aImpact = this.parseImpactRange(a.expectedImpact.qualityScore);
      const bImpact = this.parseImpactRange(b.expectedImpact.qualityScore);

      return (bImpact / bTimeframe) - (aImpact / aTimeframe);
    });

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages: plans.length,
        totalImprovements: allImprovements.length,
        avgCurrentQuality: this.calculateAverage(plans.map(p => p.currentState.qualityScore)),
        estimatedQualityIncrease: plans.reduce((sum, p) => sum + p.estimatedImpact.qualityScoreIncrease, 0),
        totalEffort: plans.reduce((sum, p) => sum + p.estimatedImpact.totalHours, 0)
      },
      pageDetails: plans,
      prioritizedActions: allImprovements.slice(0, 20), // Top 20 actions
      implementationPhases: this.createImplementationPhases(allImprovements)
    };
  }

  /**
   * Parse impact range and return average
   */
  parseImpactRange(impactStr) {
    if (!impactStr) return 0;
    const matches = impactStr.match(/\+(\d+)-(\d+)/);
    if (matches) {
      return (parseInt(matches[1]) + parseInt(matches[2])) / 2;
    }
    return 0;
  }

  /**
   * Create phased implementation plan
   */
  createImplementationPhases(improvements) {
    const phases = {
      'Quick Wins (Week 1)': [],
      'High Impact (Week 2-3)': [],
      'Medium Impact (Week 4-6)': [],
      'Long Term (Month 2+)': []
    };

    for (const improvement of improvements) {
      const hours = parseFloat(improvement.timeframe) || 1;
      const impact = this.parseImpactRange(improvement.expectedImpact.qualityScore);
      const roi = impact / hours;

      if (hours <= 2 && improvement.priority === 'critical') {
        phases['Quick Wins (Week 1)'].push(improvement);
      } else if (roi > 5 || improvement.priority === 'critical') {
        phases['High Impact (Week 2-3)'].push(improvement);
      } else if (improvement.priority === 'high') {
        phases['Medium Impact (Week 4-6)'].push(improvement);
      } else {
        phases['Long Term (Month 2+)'].push(improvement);
      }
    }

    return phases;
  }

  /**
   * Save improvement plan
   */
  saveImprovementPlan(plan) {
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(this.improvementsDir, `improvement-plan-${date}.json`);

    fs.writeFileSync(filename, JSON.stringify(plan, null, 2));
    console.log(`✅ Improvement plan saved: ${filename}\n`);

    // Print summary
    this.printImprovementSummary(plan);

    return filename;
  }

  /**
   * Print improvement summary
   */
  printImprovementSummary(plan) {
    console.log('📊 IMPROVEMENT PLAN SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`📄 Pages analyzed: ${plan.summary.totalPages}`);
    console.log(`🎯 Total improvements: ${plan.summary.totalImprovements}`);
    console.log(`📈 Avg current quality: ${plan.summary.avgCurrentQuality.toFixed(1)}`);
    console.log(`⬆️  Estimated increase: +${plan.summary.estimatedQualityIncrease} points`);
    console.log(`⏱️  Total effort: ${plan.summary.totalEffort.toFixed(1)} hours`);
    console.log(`💡 ROI: ${(plan.summary.estimatedQualityIncrease / plan.summary.totalEffort).toFixed(1)} points/hour\n`);

    console.log('🚀 TOP 5 PRIORITY ACTIONS:\n');
    plan.prioritizedActions.slice(0, 5).forEach((action, i) => {
      console.log(`${i + 1}. [${action.priority.toUpperCase()}] ${action.title} - ${action.page}`);
      console.log(`   Expected: ${action.expectedImpact.qualityScore || 'N/A'} improvement`);
      console.log(`   Effort: ${action.timeframe}`);
      console.log(`   Changes: ${action.changes.length} specific actions\n`);
    });

    console.log('📅 IMPLEMENTATION PHASES:\n');
    for (const [phase, actions] of Object.entries(plan.implementationPhases)) {
      console.log(`${phase}: ${actions.length} actions`);
    }
    console.log();
  }

  /**
   * Track improvement impact over time
   */
  async trackImpact() {
    console.log('📈 Tracking improvement impact over time...\n');

    // Load historical data
    const historicalFiles = fs.readdirSync(this.historicalDir)
      .filter(f => f.startsWith('ux-metrics-'))
      .sort();

    if (historicalFiles.length < 2) {
      console.log('⚠️  Need at least 2 historical data points for trend analysis');
      return null;
    }

    // Load data points
    const dataPoints = historicalFiles.map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(this.historicalDir, file), 'utf8'));
      return {
        date: file.match(/ux-metrics-(.+)\.json/)[1],
        ...data
      };
    });

    // Calculate trends for each page
    const pageTrends = this.calculatePageTrends(dataPoints);

    // Identify successful improvements
    const successfulImprovements = this.identifySuccessfulImprovements(pageTrends);

    // Generate impact report
    const impactReport = {
      timestamp: new Date().toISOString(),
      period: {
        start: dataPoints[0].date,
        end: dataPoints[dataPoints.length - 1].date,
        days: dataPoints.length
      },
      trends: pageTrends,
      successfulImprovements: successfulImprovements,
      recommendations: this.generateTrendRecommendations(pageTrends)
    };

    // Save report
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(this.improvementsDir, `impact-tracking-${date}.json`);
    fs.writeFileSync(filename, JSON.stringify(impactReport, null, 2));

    console.log(`✅ Impact tracking report saved: ${filename}\n`);
    this.printImpactSummary(impactReport);

    return impactReport;
  }

  /**
   * Calculate trends for each page
   */
  calculatePageTrends(dataPoints) {
    const trends = {};

    // Get all unique pages
    const allPages = new Set();
    dataPoints.forEach(dp => {
      Object.keys(dp.pageMetrics || {}).forEach(page => allPages.add(page));
    });

    // Calculate trend for each page
    for (const page of allPages) {
      const pageData = dataPoints
        .map(dp => dp.pageMetrics?.[page])
        .filter(Boolean);

      if (pageData.length >= 2) {
        const first = pageData[0];
        const last = pageData[pageData.length - 1];

        trends[page] = {
          qualityScore: {
            start: first.qualityScore,
            end: last.qualityScore,
            change: last.qualityScore - first.qualityScore,
            percentChange: ((last.qualityScore - first.qualityScore) / first.qualityScore * 100)
          },
          conversionRate: {
            start: first.conversionRate,
            end: last.conversionRate,
            change: last.conversionRate - first.conversionRate,
            percentChange: ((last.conversionRate - first.conversionRate) / first.conversionRate * 100)
          },
          bounceRate: {
            start: first.bounceRate,
            end: last.bounceRate,
            change: last.bounceRate - first.bounceRate,
            percentChange: ((last.bounceRate - first.bounceRate) / first.bounceRate * 100)
          },
          dataPoints: pageData.length
        };
      }
    }

    return trends;
  }

  /**
   * Identify successful improvements
   */
  identifySuccessfulImprovements(trends) {
    const successful = [];

    for (const [page, trend] of Object.entries(trends)) {
      if (trend.qualityScore.change >= 10) {
        successful.push({
          page,
          improvement: 'Quality Score',
          increase: trend.qualityScore.change,
          percentIncrease: trend.qualityScore.percentChange,
          status: 'significant'
        });
      }

      if (trend.conversionRate.change >= 5) {
        successful.push({
          page,
          improvement: 'Conversion Rate',
          increase: trend.conversionRate.change,
          percentIncrease: trend.conversionRate.percentChange,
          status: 'significant'
        });
      }

      if (trend.bounceRate.change <= -10) {
        successful.push({
          page,
          improvement: 'Bounce Rate Reduction',
          decrease: Math.abs(trend.bounceRate.change),
          percentDecrease: Math.abs(trend.bounceRate.percentChange),
          status: 'significant'
        });
      }
    }

    return successful.sort((a, b) =>
      (b.increase || b.decrease || 0) - (a.increase || a.decrease || 0)
    );
  }

  /**
   * Generate recommendations based on trends
   */
  generateTrendRecommendations(trends) {
    const recommendations = [];

    for (const [page, trend] of Object.entries(trends)) {
      // Pages showing positive momentum - scale up
      if (trend.qualityScore.change > 5 && trend.qualityScore.change < 15) {
        recommendations.push({
          page,
          action: 'Scale Success',
          description: `${page} showing positive momentum (+${trend.qualityScore.change.toFixed(1)} quality). Double down on recent changes.`,
          priority: 'high'
        });
      }

      // Pages stagnating - try new approach
      if (Math.abs(trend.qualityScore.change) < 3) {
        recommendations.push({
          page,
          action: 'Try New Approach',
          description: `${page} showing minimal change. Current strategy not working - need fresh ideas.`,
          priority: 'medium'
        });
      }

      // Pages declining - urgent intervention
      if (trend.qualityScore.change < -5) {
        recommendations.push({
          page,
          action: 'Urgent Intervention',
          description: `${page} declining (${trend.qualityScore.change.toFixed(1)} quality). Investigate recent changes.`,
          priority: 'critical'
        });
      }

      // Pages with great conversion but low quality - optimize
      if (trend.conversionRate.end > 20 && trend.qualityScore.end < 50) {
        recommendations.push({
          page,
          action: 'Optimize High Converter',
          description: `${page} has good conversion (${trend.conversionRate.end.toFixed(1)}%) but low quality. Small improvements = big gains.`,
          priority: 'high'
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  }

  /**
   * Print impact summary
   */
  printImpactSummary(report) {
    console.log('📊 IMPACT TRACKING SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`📅 Period: ${report.period.start} to ${report.period.end} (${report.period.days} days)\n`);

    if (report.successfulImprovements.length > 0) {
      console.log('🎉 SUCCESSFUL IMPROVEMENTS:\n');
      report.successfulImprovements.slice(0, 5).forEach((improvement, i) => {
        console.log(`${i + 1}. ${improvement.page}: ${improvement.improvement}`);
        if (improvement.increase) {
          console.log(`   +${improvement.increase.toFixed(1)} points (+${improvement.percentIncrease.toFixed(1)}%)`);
        } else {
          console.log(`   -${improvement.decrease.toFixed(1)} points (-${improvement.percentDecrease.toFixed(1)}%)`);
        }
      });
      console.log();
    }

    if (report.recommendations.length > 0) {
      console.log('💡 TREND-BASED RECOMMENDATIONS:\n');
      report.recommendations.slice(0, 5).forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.action}: ${rec.page}`);
        console.log(`   ${rec.description}\n`);
      });
    }
  }

  /**
   * Load latest UX analysis
   */
  loadLatestUXAnalysis() {
    try {
      const files = fs.readdirSync(this.uxAnalysisDir)
        .filter(f => f.startsWith('ux-analysis-'))
        .sort()
        .reverse();

      if (files.length === 0) return null;

      return JSON.parse(fs.readFileSync(
        path.join(this.uxAnalysisDir, files[0]),
        'utf8'
      ));
    } catch (error) {
      console.error('Error loading UX analysis:', error.message);
      return null;
    }
  }

  /**
   * Load latest recommendations
   */
  loadLatestRecommendations() {
    try {
      const files = fs.readdirSync(this.recommendationsDir)
        .filter(f => f.startsWith('recommendations-'))
        .sort()
        .reverse();

      if (files.length === 0) return null;

      return JSON.parse(fs.readFileSync(
        path.join(this.recommendationsDir, files[0]),
        'utf8'
      ));
    } catch (error) {
      console.error('Error loading recommendations:', error.message);
      return null;
    }
  }

  /**
   * Calculate average
   */
  calculateAverage(values) {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Run full improvement cycle
   */
  async runFullCycle() {
    console.log('🔄 Starting Continuous UX Improvement Cycle\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Step 1: Analyze and plan
    const plan = await this.analyzeAndPlan();

    if (!plan) {
      console.error('❌ Could not generate improvement plan');
      return;
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    // Step 2: Track impact (if historical data exists)
    const impact = await this.trackImpact();

    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log('✅ Continuous improvement cycle complete!\n');

    return {
      plan,
      impact
    };
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  const engine = new ContinuousUXImprovement();

  switch (command) {
    case 'analyze':
    case '--analyze':
      engine.analyzeAndPlan();
      break;

    case 'track':
    case '--track':
      engine.trackImpact();
      break;

    case 'full':
    case '--full':
    default:
      engine.runFullCycle();
      break;
  }
}

module.exports = ContinuousUXImprovement;
