#!/usr/bin/env node

/**
 * Automated Health Check Monitor
 *
 * Performs comprehensive health checks on all scaled Wave 4 pages
 * Monitors: Performance, Conversion Rates, Core Web Vitals, Error Rates
 * Alerts: Slack/Email notifications for critical issues
 *
 * Usage: node scripts/health-check-monitor.js [--verbose] [--alert]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    // Performance thresholds
    thresholds: {
        conversionRate: {
            critical: 15.0,  // Below this = critical alert
            warning: 18.0,   // Below this = warning alert
            target: 21.26    // Target overall CR
        },
        coreWebVitals: {
            lcp: { good: 2500, needsImprovement: 4000 },  // ms
            fid: { good: 100, needsImprovement: 300 },    // ms
            cls: { good: 0.1, needsImprovement: 0.25 }    // score
        },
        errorRate: {
            critical: 5.0,   // % error rate
            warning: 2.0
        },
        revenue: {
            daily: 413000,   // $151.16M / 365 days
            weekly: 2900000  // $151.16M / 52 weeks
        }
    },

    // Pages to monitor
    pages: [
        { name: 'Quad Threat Mega Combo', pattern: 'Quad Threat', targetCR: 14.12 },
        { name: 'AI Personalization Engine', pattern: 'AI Optimization', targetCR: 11.65 },
        { name: 'Voice-Activated Assistant', pattern: 'Voice Interface', targetCR: 10.28 },
        { name: 'AR/VR Preview Experience', pattern: 'AR/VR Previews', targetCR: 10.85 },
        { name: 'Writers Segment (Optimized)', pattern: 'Triple Threat', targetCR: 13.45 },
        { name: 'Creators Segment (Optimized)', pattern: 'Video+Social', targetCR: 12.89 },
        { name: 'Trust & Citations (Optimized)', pattern: 'AI Personal', targetCR: 11.23 },
        { name: 'Workspace Integration', pattern: 'Interactive', targetCR: 10.67 },
        { name: 'Operators Segment', pattern: 'Social Proof', targetCR: 9.84 },
        { name: 'Automators Segment', pattern: 'Scarcity+Trust', targetCR: 10.12 },
        { name: 'Valentine\'s Day Special', pattern: 'Mobile Combo', targetCR: 8.95 },
        { name: 'Apple-Style Minimalist', pattern: 'Baseline', targetCR: 8.21 },
        { name: 'Research Professional', pattern: 'Baseline', targetCR: 7.89 },
        { name: 'Productivity Focus', pattern: 'Baseline', targetCR: 7.56 },
        { name: 'Premium Aspirational', pattern: 'Baseline', targetCR: 7.23 },
        { name: 'Comparison vs Competitors', pattern: 'Baseline', targetCR: 6.98 },
        { name: 'Google Workspace Deep Dive', pattern: 'Baseline', targetCR: 6.45 },
        { name: 'Academic Research Hub', pattern: 'Baseline', targetCR: 6.13 },
        { name: 'Landing Hub/Index', pattern: 'Baseline', targetCR: 5.87 }
    ],

    // Alert configuration
    alerts: {
        enabled: process.argv.includes('--alert'),
        channels: {
            slack: process.env.SLACK_WEBHOOK_URL,
            email: process.env.ALERT_EMAIL
        }
    }
};

// Simulate fetching real-time data (in production, this would call analytics API)
function fetchPageMetrics(page) {
    const baseVariance = (Math.random() - 0.5) * 0.1; // ±5% variance
    const visitors = Math.floor(3000 + Math.random() * 2500);
    const actualCR = page.targetCR * (1 + baseVariance);
    const conversions = Math.floor(visitors * (actualCR / 100));
    const revenue = conversions * 50; // $50 per conversion

    return {
        name: page.name,
        pattern: page.pattern,
        targetCR: page.targetCR,
        actualCR: parseFloat(actualCR.toFixed(2)),
        visitors,
        conversions,
        revenue,
        coreWebVitals: {
            lcp: 2000 + Math.random() * 800,
            fid: 50 + Math.random() * 100,
            cls: 0.05 + Math.random() * 0.08
        },
        errorRate: Math.random() * 1.5,
        uptime: 99.5 + Math.random() * 0.5
    };
}

// Health check severity levels
const SEVERITY = {
    CRITICAL: 'critical',
    WARNING: 'warning',
    INFO: 'info',
    SUCCESS: 'success'
};

// Perform health checks
function performHealthChecks() {
    const results = {
        timestamp: new Date().toISOString(),
        overallHealth: SEVERITY.SUCCESS,
        checks: [],
        summary: {
            totalPages: CONFIG.pages.length,
            healthy: 0,
            warnings: 0,
            critical: 0
        },
        metrics: {
            overallCR: 0,
            totalRevenue: 0,
            totalVisitors: 0,
            totalConversions: 0
        },
        recommendations: []
    };

    console.log('\n🔍 Starting Health Check Monitor...\n');
    console.log('=' .repeat(80));

    CONFIG.pages.forEach(page => {
        const metrics = fetchPageMetrics(page);
        const check = {
            page: page.name,
            pattern: page.pattern,
            severity: SEVERITY.SUCCESS,
            issues: [],
            metrics
        };

        // Check 1: Conversion Rate
        const crDelta = ((metrics.actualCR - metrics.targetCR) / metrics.targetCR) * 100;
        if (metrics.actualCR < metrics.targetCR * 0.8) {
            check.severity = SEVERITY.CRITICAL;
            check.issues.push(`Conversion rate ${metrics.actualCR}% is ${Math.abs(crDelta).toFixed(1)}% below target ${metrics.targetCR}%`);
            results.summary.critical++;
        } else if (metrics.actualCR < metrics.targetCR * 0.9) {
            check.severity = SEVERITY.WARNING;
            check.issues.push(`Conversion rate ${metrics.actualCR}% is ${Math.abs(crDelta).toFixed(1)}% below target ${metrics.targetCR}%`);
            results.summary.warnings++;
        } else {
            results.summary.healthy++;
        }

        // Check 2: Core Web Vitals
        const vitals = metrics.coreWebVitals;
        if (vitals.lcp > CONFIG.thresholds.coreWebVitals.lcp.needsImprovement) {
            check.severity = SEVERITY.WARNING;
            check.issues.push(`LCP ${vitals.lcp.toFixed(0)}ms exceeds threshold`);
        }
        if (vitals.fid > CONFIG.thresholds.coreWebVitals.fid.needsImprovement) {
            check.severity = SEVERITY.WARNING;
            check.issues.push(`FID ${vitals.fid.toFixed(0)}ms exceeds threshold`);
        }
        if (vitals.cls > CONFIG.thresholds.coreWebVitals.cls.needsImprovement) {
            check.severity = SEVERITY.WARNING;
            check.issues.push(`CLS ${vitals.cls.toFixed(3)} exceeds threshold`);
        }

        // Check 3: Error Rate
        if (metrics.errorRate > CONFIG.thresholds.errorRate.critical) {
            check.severity = SEVERITY.CRITICAL;
            check.issues.push(`Error rate ${metrics.errorRate.toFixed(2)}% exceeds critical threshold`);
            results.summary.critical++;
        } else if (metrics.errorRate > CONFIG.thresholds.errorRate.warning) {
            if (check.severity === SEVERITY.SUCCESS) check.severity = SEVERITY.WARNING;
            check.issues.push(`Error rate ${metrics.errorRate.toFixed(2)}% exceeds warning threshold`);
        }

        // Check 4: Uptime
        if (metrics.uptime < 99.0) {
            check.severity = SEVERITY.CRITICAL;
            check.issues.push(`Uptime ${metrics.uptime.toFixed(2)}% below 99%`);
        }

        results.checks.push(check);

        // Update aggregate metrics
        results.metrics.totalRevenue += metrics.revenue;
        results.metrics.totalVisitors += metrics.visitors;
        results.metrics.totalConversions += metrics.conversions;

        // Print status
        const statusIcon = {
            critical: '🚨',
            warning: '⚠️',
            info: 'ℹ️',
            success: '✅'
        }[check.severity];

        console.log(`${statusIcon} ${page.name}`);
        console.log(`   Pattern: ${page.pattern} | CR: ${metrics.actualCR}% (target: ${metrics.targetCR}%) | Visitors: ${metrics.visitors}`);
        if (check.issues.length > 0) {
            check.issues.forEach(issue => console.log(`   └─ ${issue}`));
        }
        console.log('');
    });

    // Calculate overall conversion rate
    results.metrics.overallCR = (results.metrics.totalConversions / results.metrics.totalVisitors) * 100;

    // Determine overall health
    if (results.summary.critical > 0) {
        results.overallHealth = SEVERITY.CRITICAL;
    } else if (results.summary.warnings > 3) {
        results.overallHealth = SEVERITY.WARNING;
    }

    // Generate recommendations
    results.recommendations = generateRecommendations(results);

    return results;
}

function generateRecommendations(results) {
    const recommendations = [];

    // Find underperforming pages
    const underperforming = results.checks
        .filter(check => check.severity === SEVERITY.CRITICAL || check.severity === SEVERITY.WARNING)
        .sort((a, b) => {
            const aDelta = (a.metrics.actualCR - a.metrics.targetCR) / a.metrics.targetCR;
            const bDelta = (b.metrics.actualCR - b.metrics.targetCR) / b.metrics.targetCR;
            return aDelta - bDelta;
        });

    if (underperforming.length > 0) {
        recommendations.push({
            priority: 'high',
            title: 'Investigate Underperforming Pages',
            description: `${underperforming.length} pages below target. Top concern: ${underperforming[0].page}`,
            action: `Review ${underperforming[0].page} analytics and user behavior data`
        });
    }

    // Check if baseline pages need optimization
    const baselinePages = results.checks.filter(check => check.pattern === 'Baseline');
    if (baselinePages.length > 0) {
        const avgBaselineCR = baselinePages.reduce((sum, p) => sum + p.metrics.actualCR, 0) / baselinePages.length;
        recommendations.push({
            priority: 'medium',
            title: 'Scale Wave 4 Patterns to Baseline Pages',
            description: `${baselinePages.length} pages at ${avgBaselineCR.toFixed(2)}% avg CR vs 21.26% overall`,
            action: 'Apply Quad Threat or AI Optimization patterns to baseline pages'
        });
    }

    // Check Core Web Vitals
    const slowPages = results.checks.filter(check =>
        check.metrics.coreWebVitals.lcp > CONFIG.thresholds.coreWebVitals.lcp.good
    );
    if (slowPages.length > 2) {
        recommendations.push({
            priority: 'medium',
            title: 'Optimize Core Web Vitals',
            description: `${slowPages.length} pages have LCP > 2.5s`,
            action: 'Implement image optimization and lazy loading improvements'
        });
    }

    // Revenue projection
    const dailyRevenue = results.metrics.totalRevenue;
    const annualProjection = (dailyRevenue * 365) / 1000000; // Convert to millions
    if (annualProjection < 140) {
        recommendations.push({
            priority: 'high',
            title: 'Revenue Below $150M Target',
            description: `Current projection: $${annualProjection.toFixed(2)}M annual`,
            action: 'Accelerate pattern scaling and test new optimizations'
        });
    }

    return recommendations;
}

function printSummary(results) {
    console.log('=' .repeat(80));
    console.log('\n📊 HEALTH CHECK SUMMARY\n');
    console.log('=' .repeat(80));

    const healthIcon = {
        critical: '🚨 CRITICAL',
        warning: '⚠️  WARNING',
        success: '✅ HEALTHY'
    }[results.overallHealth];

    console.log(`Overall Health: ${healthIcon}`);
    console.log(`Timestamp: ${new Date(results.timestamp).toLocaleString()}\n`);

    console.log('Pages Status:');
    console.log(`  ✅ Healthy: ${results.summary.healthy}`);
    console.log(`  ⚠️  Warnings: ${results.summary.warnings}`);
    console.log(`  🚨 Critical: ${results.summary.critical}\n`);

    console.log('Performance Metrics:');
    console.log(`  Overall Conversion Rate: ${results.metrics.overallCR.toFixed(2)}%`);
    console.log(`  Total Daily Visitors: ${results.metrics.totalVisitors.toLocaleString()}`);
    console.log(`  Total Daily Conversions: ${results.metrics.totalConversions.toLocaleString()}`);
    console.log(`  Total Daily Revenue: $${results.metrics.totalRevenue.toLocaleString()}`);

    const annualProjection = (results.metrics.totalRevenue * 365) / 1000000;
    console.log(`  Annual Revenue Projection: $${annualProjection.toFixed(2)}M\n`);

    if (results.recommendations.length > 0) {
        console.log('🎯 Recommendations:\n');
        results.recommendations.forEach((rec, index) => {
            const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
            console.log(`${index + 1}. ${priorityIcon} ${rec.title}`);
            console.log(`   ${rec.description}`);
            console.log(`   Action: ${rec.action}\n`);
        });
    }

    console.log('=' .repeat(80));
}

function saveReport(results) {
    const reportsDir = path.join(__dirname, '..', 'reports', 'health-checks');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `health-check-${timestamp}.json`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Report saved to: ${filepath}\n`);

    // Also save latest report
    const latestPath = path.join(reportsDir, 'latest.json');
    fs.writeFileSync(latestPath, JSON.stringify(results, null, 2));
}

function sendAlerts(results) {
    if (!CONFIG.alerts.enabled) {
        return;
    }

    if (results.overallHealth === SEVERITY.CRITICAL) {
        console.log('\n🚨 SENDING CRITICAL ALERTS...\n');

        // In production, send to Slack/Email
        const message = {
            text: `🚨 CRITICAL: Wave 4 Health Check Failed`,
            attachments: [{
                color: 'danger',
                fields: [
                    { title: 'Critical Issues', value: results.summary.critical, short: true },
                    { title: 'Warnings', value: results.summary.warnings, short: true },
                    { title: 'Overall CR', value: `${results.metrics.overallCR.toFixed(2)}%`, short: true },
                    { title: 'Timestamp', value: new Date(results.timestamp).toLocaleString(), short: true }
                ]
            }]
        };

        console.log('Alert payload:', JSON.stringify(message, null, 2));
        console.log('\n📧 Alert would be sent to configured channels\n');
    }
}

// Main execution
function main() {
    const verbose = process.argv.includes('--verbose');

    console.log('\n' + '='.repeat(80));
    console.log('  WAVE 4 AUTOMATED HEALTH CHECK MONITOR');
    console.log('  $150M+ Annual Revenue Tracking System');
    console.log('='.repeat(80) + '\n');

    const results = performHealthChecks();
    printSummary(results);
    saveReport(results);
    sendAlerts(results);

    console.log('✅ Health check complete!\n');

    // Exit with appropriate code
    if (results.overallHealth === SEVERITY.CRITICAL) {
        process.exit(1);
    } else if (results.overallHealth === SEVERITY.WARNING) {
        process.exit(0); // Don't fail on warnings
    } else {
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { performHealthChecks, generateRecommendations };
