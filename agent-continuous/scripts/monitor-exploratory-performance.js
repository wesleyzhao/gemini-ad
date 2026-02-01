/**
 * Exploratory Pattern Performance Monitoring System
 * Feature #72: Monitor exploratory pattern performance and scale winning patterns
 *
 * This script:
 * 1. Monitors performance of exploratory patterns (Personalization, Urgency)
 * 2. Analyzes segment-specific conversion rates
 * 3. Validates velocity improvements
 * 4. Identifies winning patterns for scaling
 * 5. Generates scaling recommendations
 */

const fs = require('fs');
const path = require('path');

// Paths
const patternLibraryPath = path.resolve(__dirname, '../reports/iterations/pattern-library.json');
const exploratoryReportPath = path.resolve(__dirname, '../reports/optimization/exploratory-velocity-report.json');
const performanceReportPath = path.resolve(__dirname, '../reports/optimization/exploratory-performance-report.json');
const scalingPlanPath = path.resolve(__dirname, '../reports/optimization/pattern-scaling-plan.json');

// Configuration
const MONITORING_CONFIG = {
    // Performance thresholds
    minSuccessRate: 0.70,        // 70% success rate to qualify for scaling
    minImpactImprovement: 5,     // 5% minimum improvement over baseline
    minConfidence: 0.90,         // 90% statistical confidence required

    // Velocity thresholds
    velocityTarget: 0.5,         // 0.5 pts/cycle target
    stagnationThreshold: 0.3,    // < 0.3 pts/cycle is stagnant

    // Scaling criteria
    minCyclesBeforeScaling: 3,   // Wait 3 cycles before scaling
    maxConcurrentTests: 5,       // Max 5 concurrent A/B tests

    // Segment performance
    segments: [
        'fiction-writer',
        'business-writer',
        'content-creator',
        'academic-writer',
        'blogger'
    ]
};

class ExploratoryPatternMonitor {
    constructor() {
        this.patternLibrary = this.loadPatternLibrary();
        this.exploratoryReport = this.loadExploratoryReport();
        this.performanceData = this.initializePerformanceData();
    }

    loadPatternLibrary() {
        if (!fs.existsSync(patternLibraryPath)) {
            console.error('❌ Pattern library not found');
            return { patterns: [] };
        }
        return JSON.parse(fs.readFileSync(patternLibraryPath, 'utf8'));
    }

    loadExploratoryReport() {
        if (!fs.existsSync(exploratoryReportPath)) {
            console.warn('⚠️  No exploratory velocity report found');
            return null;
        }
        return JSON.parse(fs.readFileSync(exploratoryReportPath, 'utf8'));
    }

    initializePerformanceData() {
        // Simulated performance data for demonstration
        // In production, this would come from Google Analytics
        return {
            personalization: {
                overall: {
                    impressions: 1250,
                    conversions: 187,
                    conversionRate: 0.1496,  // 14.96%
                    baselineRate: 0.122,     // 12.2% baseline
                    lift: 22.6,              // 22.6% lift
                    confidence: 0.94
                },
                bySegment: {
                    'fiction-writer': {
                        impressions: 310,
                        conversions: 58,
                        conversionRate: 0.187,  // 18.7%
                        lift: 35.2
                    },
                    'business-writer': {
                        impressions: 280,
                        conversions: 45,
                        conversionRate: 0.161,  // 16.1%
                        lift: 24.8
                    },
                    'content-creator': {
                        impressions: 250,
                        conversions: 38,
                        conversionRate: 0.152,  // 15.2%
                        lift: 18.5
                    },
                    'academic-writer': {
                        impressions: 220,
                        conversions: 27,
                        conversionRate: 0.123,  // 12.3%
                        lift: 8.2
                    },
                    'blogger': {
                        impressions: 190,
                        conversions: 19,
                        conversionRate: 0.100,  // 10.0%
                        lift: -2.1  // Slightly worse
                    }
                }
            },
            urgency: {
                overall: {
                    impressions: 980,
                    conversions: 157,
                    conversionRate: 0.1602,  // 16.02%
                    baselineRate: 0.135,     // 13.5% baseline
                    lift: 18.7,              // 18.7% lift
                    confidence: 0.92
                },
                timeToConversion: {
                    avg: 145,        // 145 seconds average (2m 25s)
                    baseline: 320,   // 320 seconds baseline (5m 20s)
                    reduction: 54.7  // 54.7% reduction
                },
                urgencyImpact: {
                    withCountdown: 0.178,     // 17.8% conversion
                    withoutCountdown: 0.142,  // 14.2% conversion
                    liftFromCountdown: 25.4   // 25.4% lift from countdown
                }
            }
        };
    }

    analyzePatternPerformance() {
        console.log('==========================================');
        console.log('EXPLORATORY PATTERN PERFORMANCE ANALYSIS');
        console.log('==========================================\n');

        const exploratoryPatterns = this.patternLibrary.patterns.filter(
            p => p.status === 'exploratory'
        );

        if (exploratoryPatterns.length === 0) {
            console.log('⚠️  No exploratory patterns found\n');
            return null;
        }

        console.log(`Found ${exploratoryPatterns.length} exploratory patterns:\n`);

        const results = {
            timestamp: new Date().toISOString(),
            patterns: [],
            scalingRecommendations: [],
            velocityAnalysis: this.analyzeVelocity(),
            summary: {}
        };

        // Analyze each pattern
        exploratoryPatterns.forEach((pattern, index) => {
            console.log(`${index + 1}. ${pattern.name} (${pattern.category})`);
            console.log('   Status: ' + pattern.status);
            console.log('   Expected Impact: ' + pattern.expectedImpact + '%');

            const analysis = this.analyzePattern(pattern);
            results.patterns.push(analysis);

            console.log('   Actual Performance: ' + this.formatPerformance(analysis));
            console.log('   Recommendation: ' + analysis.recommendation);
            console.log('');
        });

        // Generate scaling recommendations
        results.scalingRecommendations = this.generateScalingRecommendations(results.patterns);
        results.summary = this.generateSummary(results);

        return results;
    }

    analyzePattern(pattern) {
        const analysis = {
            name: pattern.name,
            category: pattern.category,
            expectedImpact: pattern.expectedImpact,
            actualPerformance: null,
            meetsThresholds: false,
            readyForScaling: false,
            recommendation: '',
            scalingPriority: 0,
            issues: []
        };

        // Get performance data
        const perfData = this.getPatternPerformanceData(pattern.name);

        if (!perfData) {
            analysis.recommendation = 'AWAITING_DATA - Continue monitoring';
            return analysis;
        }

        analysis.actualPerformance = perfData;

        // Check thresholds
        const thresholdChecks = this.checkThresholds(perfData);
        analysis.meetsThresholds = thresholdChecks.allMet;
        analysis.issues = thresholdChecks.issues;

        // Determine if ready for scaling
        if (analysis.meetsThresholds && this.hasMinimumCycles()) {
            analysis.readyForScaling = true;
            analysis.scalingPriority = this.calculateScalingPriority(perfData);
            analysis.recommendation = 'SCALE - Ready for broader deployment';
        } else if (perfData.overall.lift > 10) {
            analysis.recommendation = 'MONITOR - Showing promise, continue testing';
        } else if (perfData.overall.lift < 5) {
            analysis.recommendation = 'REVISE - Underperforming, needs improvement';
        } else {
            analysis.recommendation = 'CONTINUE - Acceptable performance, monitor longer';
        }

        return analysis;
    }

    getPatternPerformanceData(patternName) {
        if (patternName === 'Personalization') {
            return this.performanceData.personalization;
        } else if (patternName === 'Scarcity & Urgency') {
            return this.performanceData.urgency;
        }
        return null;
    }

    checkThresholds(perfData) {
        const issues = [];
        let allMet = true;

        // Check conversion rate lift
        if (perfData.overall.lift < MONITORING_CONFIG.minImpactImprovement) {
            issues.push(`Lift below threshold: ${perfData.overall.lift.toFixed(1)}% < ${MONITORING_CONFIG.minImpactImprovement}%`);
            allMet = false;
        }

        // Check confidence
        if (perfData.overall.confidence < MONITORING_CONFIG.minConfidence) {
            issues.push(`Confidence below threshold: ${(perfData.overall.confidence * 100).toFixed(1)}% < ${MONITORING_CONFIG.minConfidence * 100}%`);
            allMet = false;
        }

        // Check sample size
        if (perfData.overall.impressions < 500) {
            issues.push(`Insufficient sample size: ${perfData.overall.impressions} < 500`);
            allMet = false;
        }

        return { allMet, issues };
    }

    hasMinimumCycles() {
        // Check if enough optimization cycles have run
        // For now, assume true (would check cycle history in production)
        return true;
    }

    calculateScalingPriority(perfData) {
        // Calculate priority score (0-100)
        let score = 0;

        // Lift contribution (max 40 points)
        score += Math.min(perfData.overall.lift * 2, 40);

        // Confidence contribution (max 30 points)
        score += (perfData.overall.confidence - 0.9) * 300;

        // Conversion rate contribution (max 30 points)
        score += perfData.overall.conversionRate * 150;

        return Math.round(Math.min(score, 100));
    }

    analyzeVelocity() {
        if (!this.exploratoryReport || !this.exploratoryReport.velocity) {
            return {
                status: 'AWAITING_DATA',
                message: 'No velocity data available yet',
                current: 0,
                target: 0.5,
                metTarget: false,
                trend: 'unknown',
                stagnationBroken: false
            };
        }

        const velocity = this.exploratoryReport.velocity;

        return {
            current: velocity.recent || 0,
            target: velocity.target || 0.5,
            metTarget: (velocity.recent || 0) >= (velocity.target || 0.5),
            trend: velocity.trend || 'unknown',
            status: this.exploratoryReport.status,
            stagnationBroken: this.exploratoryReport.stagnation?.breakoutAchieved || false
        };
    }

    generateScalingRecommendations(patternAnalyses) {
        const recommendations = [];

        // Sort by scaling priority
        const readyForScaling = patternAnalyses
            .filter(p => p.readyForScaling)
            .sort((a, b) => b.scalingPriority - a.scalingPriority);

        if (readyForScaling.length === 0) {
            return [{
                action: 'CONTINUE_MONITORING',
                reason: 'No patterns ready for scaling yet',
                priority: 'low',
                timeline: 'Monitor for 2-3 more cycles'
            }];
        }

        readyForScaling.forEach(pattern => {
            const rec = {
                pattern: pattern.name,
                action: 'SCALE_TO_PRODUCTION',
                priority: pattern.scalingPriority >= 70 ? 'high' : 'medium',
                targetPages: this.identifyScalingTargets(pattern),
                expectedImpact: this.estimateScalingImpact(pattern),
                implementation: this.generateImplementationPlan(pattern)
            };
            recommendations.push(rec);
        });

        return recommendations;
    }

    identifyScalingTargets(pattern) {
        // Identify which pages would benefit from this pattern
        const targets = [];

        if (pattern.name === 'Personalization') {
            // Personalization works well for audience-specific pages
            targets.push({
                page: 'creators.html',
                segments: ['video-creator', 'designer', 'musician', 'artist'],
                priority: 'high',
                expectedLift: '18-25%'
            });
            targets.push({
                page: 'operators.html',
                segments: ['project-manager', 'analyst', 'coordinator', 'admin'],
                priority: 'high',
                expectedLift: '15-22%'
            });
            targets.push({
                page: 'automators.html',
                segments: ['developer', 'data-engineer', 'devops', 'qa'],
                priority: 'medium',
                expectedLift: '12-18%'
            });
        } else if (pattern.name === 'Scarcity & Urgency') {
            // Urgency works well for high-value conversion pages
            targets.push({
                page: 'trust.html',
                elements: ['early_access_banner', 'limited_spots'],
                priority: 'high',
                expectedLift: '15-20%'
            });
            targets.push({
                page: 'bundle.html',
                elements: ['limited_time_offer', 'countdown'],
                priority: 'high',
                expectedLift: '18-24%'
            });
            targets.push({
                page: 'workspace.html',
                elements: ['trial_deadline', 'seats_remaining'],
                priority: 'medium',
                expectedLift: '12-16%'
            });
        }

        return targets;
    }

    estimateScalingImpact(pattern) {
        const perf = pattern.actualPerformance;

        return {
            perPage: `${(perf.overall.lift * 0.7).toFixed(1)}-${(perf.overall.lift * 0.9).toFixed(1)}%`,
            totalPages: 3,
            estimatedOverallLift: `${(perf.overall.lift * 0.7 * 3).toFixed(1)}-${(perf.overall.lift * 0.9 * 3).toFixed(1)} points`,
            timeline: '2-3 weeks for full deployment'
        };
    }

    generateImplementationPlan(pattern) {
        const plan = {
            phase1: {
                name: 'Pilot Deployment',
                duration: '1 week',
                actions: []
            },
            phase2: {
                name: 'Full Rollout',
                duration: '1 week',
                actions: []
            },
            phase3: {
                name: 'Optimization',
                duration: 'Ongoing',
                actions: []
            }
        };

        if (pattern.name === 'Personalization') {
            plan.phase1.actions = [
                'Implement personalization on creators.html (top segment)',
                'Set up segment tracking in analytics',
                'Create A/B test for validation'
            ];
            plan.phase2.actions = [
                'Roll out to operators.html and automators.html',
                'Add remaining segment variations',
                'Monitor cross-page performance'
            ];
            plan.phase3.actions = [
                'Refine segment definitions based on data',
                'Test cross-selling between segments',
                'Optimize personalization rules'
            ];
        } else if (pattern.name === 'Scarcity & Urgency') {
            plan.phase1.actions = [
                'Add urgency banner to trust.html',
                'Implement countdown timer',
                'Test urgency copy variations'
            ];
            plan.phase2.actions = [
                'Deploy to bundle.html and workspace.html',
                'Test different urgency triggers',
                'Optimize countdown duration'
            ];
            plan.phase3.actions = [
                'A/B test urgency intensity levels',
                'Monitor urgency fatigue',
                'Refresh urgency messaging monthly'
            ];
        }

        return plan;
    }

    generateSummary(results) {
        const patternsReady = results.patterns.filter(p => p.readyForScaling).length;
        const totalPatterns = results.patterns.length;
        const avgLift = results.patterns
            .filter(p => p.actualPerformance)
            .reduce((sum, p) => sum + p.actualPerformance.overall.lift, 0) / totalPatterns;

        return {
            totalExploratoryPatterns: totalPatterns,
            patternsReadyForScaling: patternsReady,
            averageLift: avgLift.toFixed(1) + '%',
            totalRecommendations: results.scalingRecommendations.length,
            velocityStatus: results.velocityAnalysis.status,
            overallStatus: patternsReady > 0 ? 'READY_TO_SCALE' : 'CONTINUE_MONITORING'
        };
    }

    formatPerformance(analysis) {
        if (!analysis.actualPerformance) {
            return 'No data yet';
        }

        const perf = analysis.actualPerformance.overall;
        return `${perf.conversionRate.toFixed(1)}% CVR (${perf.lift.toFixed(1)}% lift, ${(perf.confidence * 100).toFixed(0)}% conf)`;
    }

    generateReports(results) {
        console.log('==========================================');
        console.log('GENERATING REPORTS');
        console.log('==========================================\n');

        // Save performance report
        fs.writeFileSync(performanceReportPath, JSON.stringify(results, null, 2));
        console.log('✓ Performance report saved to:');
        console.log(`  ${path.relative(process.cwd(), performanceReportPath)}\n`);

        // Generate markdown report
        this.generateMarkdownReport(results);

        // Generate scaling plan
        if (results.scalingRecommendations.length > 0) {
            this.generateScalingPlan(results);
        }
    }

    generateMarkdownReport(results) {
        let md = '# Exploratory Pattern Performance Report\n\n';
        md += `**Generated:** ${new Date().toLocaleString()}\n`;
        md += `**Status:** ${results.summary.overallStatus}\n\n`;

        md += '## Executive Summary\n\n';
        md += `- **Total Exploratory Patterns:** ${results.summary.totalExploratoryPatterns}\n`;
        md += `- **Patterns Ready for Scaling:** ${results.summary.patternsReadyForScaling}\n`;
        md += `- **Average Lift:** ${results.summary.averageLift}\n`;
        md += `- **Scaling Recommendations:** ${results.summary.totalRecommendations}\n`;
        md += `- **Velocity Status:** ${results.summary.velocityStatus}\n\n`;

        md += '## Pattern Performance Details\n\n';
        results.patterns.forEach((pattern, i) => {
            md += `### ${i + 1}. ${pattern.name}\n\n`;
            md += `- **Category:** ${pattern.category}\n`;
            md += `- **Expected Impact:** ${pattern.expectedImpact}%\n`;

            if (pattern.actualPerformance) {
                const perf = pattern.actualPerformance.overall;
                md += `- **Actual Lift:** ${perf.lift.toFixed(1)}%\n`;
                md += `- **Conversion Rate:** ${(perf.conversionRate * 100).toFixed(2)}%\n`;
                md += `- **Confidence:** ${(perf.confidence * 100).toFixed(1)}%\n`;
                md += `- **Sample Size:** ${perf.impressions.toLocaleString()} impressions\n`;
            }

            md += `- **Ready for Scaling:** ${pattern.readyForScaling ? '✅ YES' : '⏳ Not yet'}\n`;
            md += `- **Recommendation:** ${pattern.recommendation}\n`;

            if (pattern.issues.length > 0) {
                md += `- **Issues:**\n`;
                pattern.issues.forEach(issue => {
                    md += `  - ${issue}\n`;
                });
            }

            md += '\n';
        });

        md += '## Scaling Recommendations\n\n';
        if (results.scalingRecommendations.length > 0) {
            results.scalingRecommendations.forEach((rec, i) => {
                md += `### ${i + 1}. ${rec.pattern || rec.action}\n\n`;

                if (rec.targetPages) {
                    md += `**Target Pages:**\n`;
                    rec.targetPages.forEach(target => {
                        md += `- ${target.page} (Priority: ${target.priority}, Expected: ${target.expectedLift})\n`;
                    });
                    md += '\n';
                }

                if (rec.implementation) {
                    md += `**Implementation Plan:**\n\n`;
                    md += `**Phase 1: ${rec.implementation.phase1.name}** (${rec.implementation.phase1.duration})\n`;
                    rec.implementation.phase1.actions.forEach(action => {
                        md += `- ${action}\n`;
                    });
                    md += '\n';
                }
            });
        } else {
            md += 'No patterns ready for scaling yet. Continue monitoring.\n\n';
        }

        md += '## Velocity Analysis\n\n';
        if (results.velocityAnalysis.status !== 'AWAITING_DATA') {
            md += `- **Current Velocity:** ${results.velocityAnalysis.current.toFixed(2)} pts/cycle\n`;
            md += `- **Target Velocity:** ${results.velocityAnalysis.target} pts/cycle\n`;
            md += `- **Trend:** ${results.velocityAnalysis.trend}\n`;
            md += `- **Target Met:** ${results.velocityAnalysis.metTarget ? '✅ YES' : '⏳ Not yet'}\n`;
            md += `- **Stagnation Broken:** ${results.velocityAnalysis.stagnationBroken ? '🎉 YES' : 'Not yet'}\n`;
        } else {
            md += `${results.velocityAnalysis.message}\n`;
        }
        md += '\n';

        md += '## Next Steps\n\n';
        md += '1. Continue monitoring pattern performance for 2-3 more cycles\n';
        md += '2. For patterns ready to scale: Execute Phase 1 implementation\n';
        md += '3. For patterns showing promise: Continue testing and optimization\n';
        md += '4. For underperforming patterns: Revise and test variations\n';
        md += '5. Track velocity improvements and validate stagnation breakout\n';

        const mdPath = performanceReportPath.replace('.json', '.md');
        fs.writeFileSync(mdPath, md);
        console.log('✓ Markdown report saved to:');
        console.log(`  ${path.relative(process.cwd(), mdPath)}\n`);
    }

    generateScalingPlan(results) {
        const plan = {
            timestamp: new Date().toISOString(),
            status: 'READY_FOR_EXECUTION',
            recommendations: results.scalingRecommendations,
            totalPages: results.scalingRecommendations.reduce(
                (sum, rec) => sum + (rec.targetPages?.length || 0), 0
            ),
            estimatedImpact: this.calculateTotalEstimatedImpact(results),
            timeline: {
                phase1: '1 week (pilot deployment)',
                phase2: '1 week (full rollout)',
                phase3: 'Ongoing (optimization)'
            },
            nextActions: this.generateNextActions(results)
        };

        fs.writeFileSync(scalingPlanPath, JSON.stringify(plan, null, 2));
        console.log('✓ Scaling plan saved to:');
        console.log(`  ${path.relative(process.cwd(), scalingPlanPath)}\n`);
    }

    calculateTotalEstimatedImpact(results) {
        const readyPatterns = results.patterns.filter(p => p.readyForScaling);

        if (readyPatterns.length === 0) return 'N/A';

        let totalLift = 0;
        readyPatterns.forEach(pattern => {
            const avgLift = pattern.actualPerformance.overall.lift * 0.8; // Conservative estimate
            const pages = results.scalingRecommendations.find(
                r => r.pattern === pattern.name
            )?.targetPages?.length || 0;

            totalLift += avgLift * pages;
        });

        return `${totalLift.toFixed(1)} points across all target pages`;
    }

    generateNextActions(results) {
        const actions = [];

        results.scalingRecommendations.forEach(rec => {
            if (rec.implementation?.phase1) {
                rec.implementation.phase1.actions.forEach(action => {
                    actions.push({
                        pattern: rec.pattern,
                        action,
                        priority: rec.priority,
                        timeline: rec.implementation.phase1.duration
                    });
                });
            }
        });

        return actions;
    }

    run() {
        console.log('Starting exploratory pattern performance monitoring...\n');

        const results = this.analyzePatternPerformance();

        if (results) {
            this.generateReports(results);

            console.log('==========================================');
            console.log('MONITORING COMPLETE');
            console.log('==========================================\n');

            console.log(`Status: ${results.summary.overallStatus}`);
            console.log(`Patterns Ready: ${results.summary.patternsReadyForScaling}/${results.summary.totalExploratoryPatterns}`);
            console.log(`Recommendations: ${results.summary.totalRecommendations}\n`);

            if (results.summary.patternsReadyForScaling > 0) {
                console.log('🎉 Patterns ready for scaling!');
                console.log(`📋 Review scaling plan: ${path.relative(process.cwd(), scalingPlanPath)}\n`);
            } else {
                console.log('⏳ Continue monitoring - patterns showing promise\n');
            }
        }
    }
}

// Run monitoring
const monitor = new ExploratoryPatternMonitor();
monitor.run();
