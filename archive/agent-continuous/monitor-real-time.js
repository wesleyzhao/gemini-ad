#!/usr/bin/env node

/**
 * Real-Time Production Monitoring Dashboard
 *
 * Monitors live GA4 data and provides instant insights
 * Run: node monitor-real-time.js
 *
 * Features:
 * - Live conversion rate tracking
 * - Page performance comparison
 * - Mobile vs desktop metrics
 * - Anomaly detection
 * - Auto-refresh every 60 seconds
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m'
};

// Configuration
const CONFIG = {
    refreshInterval: 60000, // 60 seconds
    targetCR: { min: 11, max: 13 },
    targetBounceRate: 35,
    targetScrollDepth: 65,
    targetPageLoadTime: 2500, // ms
    alertThresholds: {
        criticalCR: 9,
        excellentCR: 14,
        highBounce: 40,
        slowLoad: 3000
    }
};

// Mock data generator for testing (remove when GA4 connected)
function generateMockData() {
    const pages = [
        'writers-quad-threat.html',
        'creators-quad-threat.html',
        'workspace-quad-threat.html',
        'trust-quad-threat.html',
        'operators-quad-threat.html',
        'automators-quad-threat.html',
        'productivity-quad-threat.html',
        'aspirational-quad-threat.html',
        'research-quad-threat.html',
        'comparison-quad-threat.html',
        'valentines-quad-threat.html',
        'bundling-quad-threat.html',
        'apple-minimal-quad-threat.html'
    ];

    const mockPageData = pages.map(page => {
        const baseCR = 11 + Math.random() * 4; // 11-15%
        const sessions = Math.floor(Math.random() * 1000) + 500;
        const conversions = Math.floor(sessions * (baseCR / 100));

        return {
            page,
            sessions,
            conversions,
            conversionRate: (conversions / sessions * 100).toFixed(2),
            bounceRate: (30 + Math.random() * 20).toFixed(1),
            avgSessionDuration: Math.floor(80 + Math.random() * 60),
            pageLoadTime: (2000 + Math.random() * 1500).toFixed(0),
            scrollDepth50: (65 + Math.random() * 25).toFixed(1),
            mobilePercent: (45 + Math.random() * 20).toFixed(1)
        };
    });

    const overall = {
        totalSessions: mockPageData.reduce((sum, p) => sum + p.sessions, 0),
        totalConversions: mockPageData.reduce((sum, p) => sum + p.conversions, 0)
    };

    overall.overallCR = (overall.totalConversions / overall.totalSessions * 100).toFixed(2);
    overall.estimatedHourlyRevenue = (overall.totalConversions * 15.75 / 24).toFixed(2);

    return { overall, pages: mockPageData, timestamp: new Date() };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format currency
function formatCurrency(num) {
    return '$' + parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get status color based on metric and value
function getStatusColor(metric, value) {
    value = parseFloat(value);

    switch(metric) {
        case 'cr':
            if (value < CONFIG.alertThresholds.criticalCR) return colors.red;
            if (value > CONFIG.alertThresholds.excellentCR) return colors.green;
            if (value >= CONFIG.targetCR.min && value <= CONFIG.targetCR.max) return colors.green;
            return colors.yellow;

        case 'bounce':
            if (value > CONFIG.alertThresholds.highBounce) return colors.red;
            if (value < CONFIG.targetBounceRate) return colors.green;
            return colors.yellow;

        case 'load':
            if (value > CONFIG.alertThresholds.slowLoad) return colors.red;
            if (value < CONFIG.targetPageLoadTime) return colors.green;
            return colors.yellow;

        default:
            return colors.reset;
    }
}

// Get status indicator
function getStatusIndicator(metric, value) {
    const color = getStatusColor(metric, value);
    value = parseFloat(value);

    if (color === colors.green) return '✅';
    if (color === colors.yellow) return '⚠️';
    if (color === colors.red) return '🔴';
    return '⚪';
}

// Clear terminal
function clearScreen() {
    process.stdout.write('\x1Bc');
}

// Draw header
function drawHeader(timestamp) {
    console.log(colors.bright + colors.cyan + '═'.repeat(100) + colors.reset);
    console.log(colors.bright + colors.cyan + '  GEMINI AD CAMPAIGN - REAL-TIME MONITORING DASHBOARD' + colors.reset);
    console.log(colors.cyan + '  Last Updated: ' + timestamp.toLocaleString() + colors.reset);
    console.log(colors.cyan + '═'.repeat(100) + colors.reset);
    console.log();
}

// Draw overall metrics
function drawOverallMetrics(overall) {
    console.log(colors.bright + '📊 OVERALL PERFORMANCE' + colors.reset);
    console.log('─'.repeat(100));

    const crColor = getStatusColor('cr', overall.overallCR);
    const crIndicator = getStatusIndicator('cr', overall.overallCR);

    console.log(`  Total Sessions:      ${colors.bright}${formatNumber(overall.totalSessions)}${colors.reset}`);
    console.log(`  Total Conversions:   ${colors.bright}${formatNumber(overall.totalConversions)}${colors.reset}`);
    console.log(`  Conversion Rate:     ${crIndicator} ${crColor}${overall.overallCR}%${colors.reset} (Target: ${CONFIG.targetCR.min}-${CONFIG.targetCR.max}%)`);
    console.log(`  Est. Hourly Revenue: ${colors.green}${formatCurrency(overall.estimatedHourlyRevenue)}${colors.reset}`);
    console.log(`  Projected Daily:     ${colors.green}${formatCurrency(overall.estimatedHourlyRevenue * 24)}${colors.reset}`);
    console.log(`  Projected Weekly:    ${colors.bright}${colors.green}${formatCurrency(overall.estimatedHourlyRevenue * 24 * 7)}${colors.reset}`);
    console.log();
}

// Draw top performers table
function drawTopPerformers(pages) {
    console.log(colors.bright + '🏆 TOP 5 PERFORMERS' + colors.reset);
    console.log('─'.repeat(100));

    const sorted = [...pages].sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate));
    const top5 = sorted.slice(0, 5);

    console.log(`  ${'Rank'.padEnd(6)} ${'Page'.padEnd(35)} ${'Sessions'.padStart(10)} ${'Conv.'.padStart(8)} ${'CR'.padStart(8)} ${'Status'.padStart(8)}`);
    console.log(`  ${'-'.repeat(98)}`);

    top5.forEach((page, idx) => {
        const indicator = getStatusIndicator('cr', page.conversionRate);
        const crColor = getStatusColor('cr', page.conversionRate);
        const pageName = page.page.replace('-quad-threat.html', '').replace(/-/g, ' ');

        console.log(
            `  ${(idx + 1).toString().padEnd(6)}` +
            `${pageName.substring(0, 35).padEnd(35)}` +
            `${formatNumber(page.sessions).padStart(10)}` +
            `${formatNumber(page.conversions).padStart(8)}` +
            `${crColor}${page.conversionRate.padStart(7)}%${colors.reset}` +
            `${indicator.padStart(8)}`
        );
    });
    console.log();
}

// Draw bottom performers table
function drawBottomPerformers(pages) {
    console.log(colors.bright + '⚠️  BOTTOM 5 PERFORMERS (NEEDS ATTENTION)' + colors.reset);
    console.log('─'.repeat(100));

    const sorted = [...pages].sort((a, b) => parseFloat(a.conversionRate) - parseFloat(b.conversionRate));
    const bottom5 = sorted.slice(0, 5);

    console.log(`  ${'Rank'.padEnd(6)} ${'Page'.padEnd(35)} ${'Sessions'.padStart(10)} ${'Conv.'.padStart(8)} ${'CR'.padStart(8)} ${'Status'.padStart(8)}`);
    console.log(`  ${'-'.repeat(98)}`);

    bottom5.forEach((page, idx) => {
        const indicator = getStatusIndicator('cr', page.conversionRate);
        const crColor = getStatusColor('cr', page.conversionRate);
        const pageName = page.page.replace('-quad-threat.html', '').replace(/-/g, ' ');

        console.log(
            `  ${(idx + 1).toString().padEnd(6)}` +
            `${pageName.substring(0, 35).padEnd(35)}` +
            `${formatNumber(page.sessions).padStart(10)}` +
            `${formatNumber(page.conversions).padStart(8)}` +
            `${crColor}${page.conversionRate.padStart(7)}%${colors.reset}` +
            `${indicator.padStart(8)}`
        );
    });
    console.log();
}

// Draw alerts
function drawAlerts(pages) {
    const alerts = [];

    pages.forEach(page => {
        const cr = parseFloat(page.conversionRate);
        const bounce = parseFloat(page.bounceRate);
        const load = parseFloat(page.pageLoadTime);

        if (cr < CONFIG.alertThresholds.criticalCR) {
            alerts.push({
                severity: 'critical',
                page: page.page,
                message: `CRITICAL: CR only ${cr}% (expected ${CONFIG.targetCR.min}%+)`
            });
        }

        if (bounce > CONFIG.alertThresholds.highBounce) {
            alerts.push({
                severity: 'warning',
                page: page.page,
                message: `High bounce rate: ${bounce}% (target <${CONFIG.targetBounceRate}%)`
            });
        }

        if (load > CONFIG.alertThresholds.slowLoad) {
            alerts.push({
                severity: 'warning',
                page: page.page,
                message: `Slow load time: ${load}ms (target <${CONFIG.targetPageLoadTime}ms)`
            });
        }
    });

    if (alerts.length > 0) {
        console.log(colors.bright + colors.red + '🚨 ALERTS & WARNINGS' + colors.reset);
        console.log('─'.repeat(100));

        alerts.forEach(alert => {
            const icon = alert.severity === 'critical' ? '🔴' : '⚠️';
            const color = alert.severity === 'critical' ? colors.red : colors.yellow;
            const pageName = alert.page.replace('-quad-threat.html', '').replace(/-/g, ' ');

            console.log(`  ${icon} ${color}${pageName}${colors.reset}: ${alert.message}`);
        });
        console.log();
    } else {
        console.log(colors.bright + colors.green + '✅ NO ALERTS - ALL SYSTEMS NORMAL' + colors.reset);
        console.log();
    }
}

// Draw device breakdown
function drawDeviceBreakdown(pages) {
    const avgMobile = pages.reduce((sum, p) => sum + parseFloat(p.mobilePercent), 0) / pages.length;
    const avgDesktop = 100 - avgMobile;

    console.log(colors.bright + '📱 DEVICE BREAKDOWN' + colors.reset);
    console.log('─'.repeat(100));
    console.log(`  Mobile:  ${avgMobile.toFixed(1)}% ${'█'.repeat(Math.floor(avgMobile / 2))}${colors.reset}`);
    console.log(`  Desktop: ${avgDesktop.toFixed(1)}% ${'█'.repeat(Math.floor(avgDesktop / 2))}${colors.reset}`);
    console.log();
}

// Draw recommendations
function drawRecommendations(pages, overall) {
    console.log(colors.bright + '💡 OPTIMIZATION RECOMMENDATIONS' + colors.reset);
    console.log('─'.repeat(100));

    const recommendations = [];
    const overallCR = parseFloat(overall.overallCR);

    // Overall CR recommendations
    if (overallCR < CONFIG.targetCR.min) {
        recommendations.push({
            priority: 'high',
            action: `Overall CR at ${overallCR}% (target ${CONFIG.targetCR.min}-${CONFIG.targetCR.max}%)`,
            recommendation: 'Run: node analyze-week-one.js --diagnostic=low-cr'
        });
    }

    // Page-specific recommendations
    const lowPerformers = pages.filter(p => parseFloat(p.conversionRate) < CONFIG.targetCR.min);
    if (lowPerformers.length > 0) {
        recommendations.push({
            priority: 'high',
            action: `${lowPerformers.length} pages below target CR`,
            recommendation: `Optimize: ${lowPerformers.slice(0, 3).map(p => p.page.replace('-quad-threat.html', '')).join(', ')}`
        });
    }

    // Mobile recommendations
    const highMobilePages = pages.filter(p => parseFloat(p.mobilePercent) > 60);
    if (highMobilePages.length > 0) {
        recommendations.push({
            priority: 'medium',
            action: `${highMobilePages.length} pages have >60% mobile traffic`,
            recommendation: 'Prioritize mobile UX optimization for these pages'
        });
    }

    // Engagement recommendations
    const lowScrollPages = pages.filter(p => parseFloat(p.scrollDepth50) < CONFIG.targetScrollDepth);
    if (lowScrollPages.length > 0) {
        recommendations.push({
            priority: 'medium',
            action: `${lowScrollPages.length} pages have low scroll depth`,
            recommendation: 'Review content length and engagement hooks'
        });
    }

    if (recommendations.length === 0) {
        console.log(`  ${colors.green}✅ All metrics on target - continue monitoring${colors.reset}`);
    } else {
        recommendations.forEach((rec, idx) => {
            const icon = rec.priority === 'high' ? '🔴' : '🟡';
            const color = rec.priority === 'high' ? colors.red : colors.yellow;

            console.log(`  ${icon} ${color}${rec.action}${colors.reset}`);
            console.log(`     → ${rec.recommendation}`);
            if (idx < recommendations.length - 1) console.log();
        });
    }
    console.log();
}

// Draw footer
function drawFooter() {
    console.log(colors.cyan + '─'.repeat(100) + colors.reset);
    console.log(colors.cyan + '  Auto-refreshing every 60 seconds... Press Ctrl+C to exit' + colors.reset);
    console.log(colors.cyan + '═'.repeat(100) + colors.reset);
}

// Main dashboard render
function renderDashboard(data) {
    clearScreen();
    drawHeader(data.timestamp);
    drawOverallMetrics(data.overall);
    drawTopPerformers(data.pages);
    drawBottomPerformers(data.pages);
    drawAlerts(data.pages);
    drawDeviceBreakdown(data.pages);
    drawRecommendations(data.pages, data.overall);
    drawFooter();
}

// Fetch real GA4 data (placeholder for actual implementation)
async function fetchGA4Data() {
    // TODO: Replace with actual GA4 Data API call
    // For now, return mock data
    console.log(colors.yellow + '\nNote: Using mock data. Connect to GA4 Data API for real metrics.' + colors.reset);
    return generateMockData();
}

// Main monitoring loop
async function startMonitoring() {
    console.log(colors.bright + colors.green + '\n🚀 Starting Real-Time Monitoring Dashboard...\n' + colors.reset);
    console.log('Connecting to GA4...');

    // Initial render
    const data = await fetchGA4Data();
    renderDashboard(data);

    // Auto-refresh loop
    setInterval(async () => {
        const data = await fetchGA4Data();
        renderDashboard(data);
    }, CONFIG.refreshInterval);
}

// Export data to file
function exportData(data, filename) {
    const exportPath = path.join(__dirname, 'monitoring-exports', filename);
    fs.mkdirSync(path.dirname(exportPath), { recursive: true });
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    console.log(colors.green + `\n✅ Data exported to: ${exportPath}` + colors.reset);
}

// CLI interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}Real-Time Monitoring Dashboard${colors.reset}

Usage:
  node monitor-real-time.js [options]

Options:
  --help, -h          Show this help message
  --export [file]     Export current data to file
  --once              Run once and exit (no auto-refresh)
  --interval <ms>     Set refresh interval in milliseconds (default: 60000)

Examples:
  node monitor-real-time.js
  node monitor-real-time.js --once
  node monitor-real-time.js --interval 30000
  node monitor-real-time.js --export snapshot.json

${colors.cyan}Note: Currently using mock data. Connect to GA4 Data API for real metrics.${colors.reset}
    `);
    process.exit(0);
}

// Handle export
if (args.includes('--export')) {
    (async () => {
        const data = await fetchGA4Data();
        const filename = args[args.indexOf('--export') + 1] || `snapshot-${Date.now()}.json`;
        exportData(data, filename);
        renderDashboard(data);
    })();
} else if (args.includes('--once')) {
    // Run once
    (async () => {
        const data = await fetchGA4Data();
        renderDashboard(data);
    })();
} else {
    // Start continuous monitoring
    startMonitoring();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(colors.yellow + '\n\n👋 Monitoring stopped. Goodbye!\n' + colors.reset);
    process.exit(0);
});
