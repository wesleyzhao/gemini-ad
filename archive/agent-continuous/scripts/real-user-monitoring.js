/**
 * Real User Monitoring (RUM) System
 *
 * Integrates with Google Analytics 4 to collect and analyze real user data
 * across all landing pages. Provides dashboards, alerts, and insights.
 *
 * Features:
 * - Google Analytics 4 integration
 * - Custom event tracking
 * - Performance monitoring (Core Web Vitals)
 * - User journey analysis
 * - Conversion funnel tracking
 * - Real-time alerting
 * - Automated reporting
 *
 * @module real-user-monitoring
 */

const fs = require('fs');
const path = require('path');

class RealUserMonitoring {
    constructor() {
        this.dataDir = path.join(__dirname, '../reports/rum');
        this.configFile = path.join(this.dataDir, 'rum-config.json');
        this.metricsFile = path.join(this.dataDir, 'user-metrics.json');
        this.alertsFile = path.join(this.dataDir, 'alerts.json');

        this.ensureDirectories();
        this.loadConfig();
    }

    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    /**
     * Load or initialize RUM configuration
     */
    loadConfig() {
        if (fs.existsSync(this.configFile)) {
            this.config = JSON.parse(fs.readFileSync(this.configFile, 'utf-8'));
        } else {
            this.config = this.getDefaultConfig();
            this.saveConfig();
        }
    }

    /**
     * Get default RUM configuration
     * @returns {Object} Default configuration
     */
    getDefaultConfig() {
        return {
            gaTrackingId: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
            enabledMetrics: {
                coreWebVitals: true,
                userEngagement: true,
                conversionTracking: true,
                errorTracking: true,
                performanceMonitoring: true
            },
            alerts: {
                enabled: true,
                thresholds: {
                    conversionRateDrop: 20, // Alert if conversion rate drops >20%
                    errorRateIncrease: 50, // Alert if error rate increases >50%
                    lcpThreshold: 2500, // LCP should be < 2.5s
                    fidThreshold: 100, // FID should be < 100ms
                    clsThreshold: 0.1 // CLS should be < 0.1
                },
                notificationChannels: ['console', 'file']
            },
            sampling: {
                enabled: true,
                rate: 100 // Sample 100% of users (adjust for high traffic)
            },
            customDimensions: {
                userSegment: true,
                testVariant: true,
                deviceType: true,
                connectionSpeed: true
            },
            customMetrics: {
                timeToConversion: true,
                scrollDepth: true,
                ctaClicks: true,
                pageExits: true
            }
        };
    }

    /**
     * Save configuration
     */
    saveConfig() {
        fs.writeFileSync(
            this.configFile,
            JSON.stringify(this.config, null, 2)
        );
    }

    /**
     * Generate Google Analytics 4 tracking script
     *
     * @param {Object} options - Configuration options
     * @returns {string} GA4 tracking script
     */
    generateGA4Script(options = {}) {
        const {
            trackingId = this.config.gaTrackingId,
            enableCoreWebVitals = true,
            enableErrorTracking = true,
            enableUserTiming = true
        } = options;

        return `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Configure GA4
gtag('config', '${trackingId}', {
    'send_page_view': true,
    'anonymize_ip': true,
    'custom_map': {
        'dimension1': 'user_segment',
        'dimension2': 'ab_test_variant',
        'dimension3': 'device_type',
        'dimension4': 'connection_speed',
        'metric1': 'time_to_conversion',
        'metric2': 'scroll_depth',
        'metric3': 'cta_clicks'
    }
});

// Track user segment
const urlParams = new URLSearchParams(window.location.search);
const userSegment = urlParams.get('segment') || 'default';
gtag('set', {'user_segment': userSegment});

// Track device type
const deviceType = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
gtag('set', {'device_type': deviceType});

// Track connection speed
if ('connection' in navigator) {
    const connectionSpeed = navigator.connection.effectiveType || 'unknown';
    gtag('set', {'connection_speed': connectionSpeed});
}

${enableCoreWebVitals ? this.getCoreWebVitalsScript() : ''}
${enableErrorTracking ? this.getErrorTrackingScript() : ''}
${enableUserTiming ? this.getUserTimingScript() : ''}

// Track page engagement
let scrollDepth = 0;
let ctaClicks = 0;

window.addEventListener('scroll', function() {
    const currentScrollDepth = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );
    if (currentScrollDepth > scrollDepth) {
        scrollDepth = currentScrollDepth;
        gtag('event', 'scroll_depth', {
            'value': scrollDepth,
            'scroll_depth': scrollDepth
        });
    }
});

// Track CTA clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.cta-primary, .cta-secondary, .btn-primary')) {
        ctaClicks++;
        gtag('event', 'cta_click', {
            'event_category': 'engagement',
            'event_label': e.target.textContent,
            'value': ctaClicks,
            'cta_clicks': ctaClicks
        });
    }
});

// Track conversions (sign-up button clicks)
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-signup, [data-conversion="true"]')) {
        const timeToConversion = Date.now() - performance.timing.navigationStart;
        gtag('event', 'conversion', {
            'event_category': 'conversion',
            'event_label': 'signup_click',
            'value': 1,
            'time_to_conversion': timeToConversion
        });
    }
});

// Track page exits
window.addEventListener('beforeunload', function() {
    gtag('event', 'page_exit', {
        'event_category': 'engagement',
        'scroll_depth': scrollDepth,
        'cta_clicks': ctaClicks,
        'time_on_page': Date.now() - performance.timing.navigationStart
    });
});
</script>
`.trim();
    }

    /**
     * Generate Core Web Vitals tracking script
     * @returns {string} Core Web Vitals tracking code
     */
    getCoreWebVitalsScript() {
        return `
// Track Core Web Vitals
(function() {
    // Track LCP (Largest Contentful Paint)
    new PerformanceObserver(function(list) {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        gtag('event', 'web_vitals', {
            'metric_name': 'LCP',
            'value': Math.round(lastEntry.renderTime || lastEntry.loadTime),
            'metric_id': 'lcp_' + Date.now()
        });
    }).observe({entryTypes: ['largest-contentful-paint']});

    // Track FID (First Input Delay)
    new PerformanceObserver(function(list) {
        const entries = list.getEntries();
        entries.forEach(function(entry) {
            gtag('event', 'web_vitals', {
                'metric_name': 'FID',
                'value': Math.round(entry.processingStart - entry.startTime),
                'metric_id': 'fid_' + Date.now()
            });
        });
    }).observe({entryTypes: ['first-input']});

    // Track CLS (Cumulative Layout Shift)
    let clsScore = 0;
    new PerformanceObserver(function(list) {
        const entries = list.getEntries();
        entries.forEach(function(entry) {
            if (!entry.hadRecentInput) {
                clsScore += entry.value;
            }
        });
        gtag('event', 'web_vitals', {
            'metric_name': 'CLS',
            'value': Math.round(clsScore * 1000) / 1000,
            'metric_id': 'cls_' + Date.now()
        });
    }).observe({entryTypes: ['layout-shift']});

    // Track TTFB (Time to First Byte)
    window.addEventListener('load', function() {
        const ttfb = performance.timing.responseStart - performance.timing.requestStart;
        gtag('event', 'web_vitals', {
            'metric_name': 'TTFB',
            'value': ttfb,
            'metric_id': 'ttfb_' + Date.now()
        });
    });
})();
`.trim();
    }

    /**
     * Generate error tracking script
     * @returns {string} Error tracking code
     */
    getErrorTrackingScript() {
        return `
// Track JavaScript errors
window.addEventListener('error', function(e) {
    gtag('event', 'exception', {
        'description': e.message,
        'fatal': false,
        'error_source': e.filename,
        'error_line': e.lineno,
        'error_column': e.colno
    });
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    gtag('event', 'exception', {
        'description': 'Unhandled Promise Rejection: ' + e.reason,
        'fatal': false
    });
});
`.trim();
    }

    /**
     * Generate user timing script
     * @returns {string} User timing code
     */
    getUserTimingScript() {
        return `
// Track custom timings
window.addEventListener('load', function() {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

    gtag('event', 'timing_complete', {
        'name': 'page_load',
        'value': loadTime,
        'event_category': 'performance'
    });

    gtag('event', 'timing_complete', {
        'name': 'dom_ready',
        'value': domReady,
        'event_category': 'performance'
    });
});
`.trim();
    }

    /**
     * Process GA4 data export (simulated for now)
     *
     * In production, this would connect to GA4 Data API:
     * https://developers.google.com/analytics/devguides/reporting/data/v1
     *
     * @param {Date} startDate - Start date for data
     * @param {Date} endDate - End date for data
     * @returns {Object} Processed metrics
     */
    async processGA4Data(startDate, endDate) {
        // Simulated data - in production, fetch from GA4 API
        const simulatedData = {
            pageViews: {
                'creators.html': 12547,
                'trust.html': 9832,
                'writers.html': 8234,
                'bundle.html': 7621,
                'workspace.html': 6543
            },
            conversions: {
                'creators.html': 1254,
                'trust.html': 1179,
                'writers.html': 823,
                'bundle.html': 610,
                'workspace.html': 524
            },
            avgTimeOnPage: {
                'creators.html': 142,
                'trust.html': 156,
                'writers.html': 128,
                'bundle.html': 165,
                'workspace.html': 134
            },
            avgScrollDepth: {
                'creators.html': 68,
                'trust.html': 72,
                'writers.html': 64,
                'bundle.html': 75,
                'workspace.html': 66
            },
            coreWebVitals: {
                lcp: {
                    good: 8234, // < 2.5s
                    needsImprovement: 2341, // 2.5-4s
                    poor: 876 // > 4s
                },
                fid: {
                    good: 10234,
                    needsImprovement: 891,
                    poor: 326
                },
                cls: {
                    good: 9876,
                    needsImprovement: 1234,
                    poor: 341
                }
            },
            timestamp: new Date().toISOString(),
            dateRange: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            }
        };

        // Calculate derived metrics
        const metrics = {
            ...simulatedData,
            conversionRates: {},
            performanceScores: {}
        };

        // Calculate conversion rates
        for (const page in simulatedData.pageViews) {
            metrics.conversionRates[page] =
                (simulatedData.conversions[page] / simulatedData.pageViews[page]) * 100;
        }

        // Calculate performance scores (% of users with good Core Web Vitals)
        const totalUsers = Object.values(simulatedData.coreWebVitals.lcp).reduce((a, b) => a + b, 0);
        metrics.performanceScores = {
            lcp: (simulatedData.coreWebVitals.lcp.good / totalUsers) * 100,
            fid: (simulatedData.coreWebVitals.fid.good / totalUsers) * 100,
            cls: (simulatedData.coreWebVitals.cls.good / totalUsers) * 100
        };

        metrics.performanceScores.overall =
            (metrics.performanceScores.lcp +
             metrics.performanceScores.fid +
             metrics.performanceScores.cls) / 3;

        // Save metrics
        fs.writeFileSync(
            this.metricsFile,
            JSON.stringify(metrics, null, 2)
        );

        return metrics;
    }

    /**
     * Generate dashboard HTML
     *
     * @returns {string} Dashboard HTML
     */
    generateDashboard() {
        const metrics = this.loadMetrics();

        if (!metrics) {
            return '<p>No metrics data available. Run processGA4Data() first.</p>';
        }

        const pages = Object.keys(metrics.pageViews);

        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real User Monitoring Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f7;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        h1 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #1d1d1f;
        }

        .subtitle {
            font-size: 21px;
            color: #6e6e73;
            margin-bottom: 40px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .card-title {
            font-size: 17px;
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 20px;
        }

        .metric {
            margin-bottom: 15px;
        }

        .metric-label {
            font-size: 14px;
            color: #6e6e73;
            margin-bottom: 5px;
        }

        .metric-value {
            font-size: 32px;
            font-weight: 700;
            color: #1d1d1f;
        }

        .metric-value.good {
            color: #28a745;
        }

        .metric-value.warning {
            color: #ffc107;
        }

        .metric-value.poor {
            color: #dc3545;
        }

        .bar {
            height: 8px;
            background: #e5e5ea;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }

        .bar-fill {
            height: 100%;
            background: #007aff;
            transition: width 0.3s ease;
        }

        .bar-fill.good {
            background: #28a745;
        }

        .bar-fill.warning {
            background: #ffc107;
        }

        .bar-fill.poor {
            background: #dc3545;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e5ea;
        }

        th {
            font-size: 14px;
            font-weight: 600;
            color: #6e6e73;
        }

        td {
            font-size: 15px;
            color: #1d1d1f;
        }

        .timestamp {
            font-size: 14px;
            color: #6e6e73;
            text-align: center;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Real User Monitoring</h1>
        <p class="subtitle">Live performance and engagement metrics</p>

        <div class="grid">
            <div class="card">
                <div class="card-title">Core Web Vitals</div>
                <div class="metric">
                    <div class="metric-label">Overall Performance Score</div>
                    <div class="metric-value ${metrics.performanceScores.overall >= 75 ? 'good' : metrics.performanceScores.overall >= 50 ? 'warning' : 'poor'}">
                        ${metrics.performanceScores.overall.toFixed(1)}%
                    </div>
                    <div class="bar">
                        <div class="bar-fill ${metrics.performanceScores.overall >= 75 ? 'good' : metrics.performanceScores.overall >= 50 ? 'warning' : 'poor'}"
                             style="width: ${metrics.performanceScores.overall}%"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">LCP (< 2.5s)</div>
                    <div class="metric-value">${metrics.performanceScores.lcp.toFixed(1)}%</div>
                    <div class="bar">
                        <div class="bar-fill good" style="width: ${metrics.performanceScores.lcp}%"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">FID (< 100ms)</div>
                    <div class="metric-value">${metrics.performanceScores.fid.toFixed(1)}%</div>
                    <div class="bar">
                        <div class="bar-fill good" style="width: ${metrics.performanceScores.fid}%"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">CLS (< 0.1)</div>
                    <div class="metric-value">${metrics.performanceScores.cls.toFixed(1)}%</div>
                    <div class="bar">
                        <div class="bar-fill good" style="width: ${metrics.performanceScores.cls}%"></div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Conversion Performance</div>
                ${pages.slice(0, 3).map(page => `
                <div class="metric">
                    <div class="metric-label">${page}</div>
                    <div class="metric-value">${metrics.conversionRates[page].toFixed(1)}%</div>
                    <div class="bar">
                        <div class="bar-fill" style="width: ${Math.min(metrics.conversionRates[page], 20) * 5}%"></div>
                    </div>
                </div>
                `).join('')}
            </div>

            <div class="card">
                <div class="card-title">Engagement Metrics</div>
                ${pages.slice(0, 3).map(page => `
                <div class="metric">
                    <div class="metric-label">${page} - Avg Time</div>
                    <div class="metric-value">${metrics.avgTimeOnPage[page]}s</div>
                </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <div class="card-title">Page Performance Summary</div>
            <table>
                <thead>
                    <tr>
                        <th>Page</th>
                        <th>Page Views</th>
                        <th>Conversions</th>
                        <th>Conv. Rate</th>
                        <th>Avg Time</th>
                        <th>Scroll Depth</th>
                    </tr>
                </thead>
                <tbody>
                    ${pages.map(page => `
                    <tr>
                        <td><strong>${page}</strong></td>
                        <td>${metrics.pageViews[page].toLocaleString()}</td>
                        <td>${metrics.conversions[page].toLocaleString()}</td>
                        <td><strong>${metrics.conversionRates[page].toFixed(1)}%</strong></td>
                        <td>${metrics.avgTimeOnPage[page]}s</td>
                        <td>${metrics.avgScrollDepth[page]}%</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <p class="timestamp">Last updated: ${new Date(metrics.timestamp).toLocaleString()}</p>
    </div>
</body>
</html>
`.trim();

        return html;
    }

    /**
     * Load metrics from file
     * @returns {Object|null} Metrics data
     */
    loadMetrics() {
        if (fs.existsSync(this.metricsFile)) {
            return JSON.parse(fs.readFileSync(this.metricsFile, 'utf-8'));
        }
        return null;
    }

    /**
     * Check for alerts based on threshold violations
     * @returns {Array} Active alerts
     */
    checkAlerts() {
        const metrics = this.loadMetrics();
        if (!metrics) {
            return [];
        }

        const alerts = [];
        const thresholds = this.config.alerts.thresholds;

        // Check Core Web Vitals
        if (metrics.performanceScores.lcp < 75) {
            alerts.push({
                severity: 'warning',
                metric: 'LCP',
                message: `LCP performance is below target: ${metrics.performanceScores.lcp.toFixed(1)}% (target: >75%)`,
                timestamp: new Date().toISOString()
            });
        }

        if (metrics.performanceScores.cls < 75) {
            alerts.push({
                severity: 'warning',
                metric: 'CLS',
                message: `CLS performance is below target: ${metrics.performanceScores.cls.toFixed(1)}% (target: >75%)`,
                timestamp: new Date().toISOString()
            });
        }

        // Check conversion rates (compare to baseline)
        const avgConversionRate = Object.values(metrics.conversionRates).reduce((a, b) => a + b, 0) / Object.keys(metrics.conversionRates).length;

        for (const page in metrics.conversionRates) {
            const rate = metrics.conversionRates[page];
            if (rate < avgConversionRate * 0.8) {
                alerts.push({
                    severity: 'high',
                    metric: 'Conversion Rate',
                    message: `${page} conversion rate is 20%+ below average: ${rate.toFixed(1)}% (avg: ${avgConversionRate.toFixed(1)}%)`,
                    timestamp: new Date().toISOString()
                });
            }
        }

        // Save alerts
        if (alerts.length > 0) {
            fs.writeFileSync(this.alertsFile, JSON.stringify(alerts, null, 2));
        }

        return alerts;
    }
}

module.exports = RealUserMonitoring;

// Example usage
if (require.main === module) {
    const rum = new RealUserMonitoring();

    console.log('Real User Monitoring System Demo');
    console.log('=================================\n');

    // Generate GA4 script
    console.log('Google Analytics 4 Script:\n');
    console.log(rum.generateGA4Script());

    // Process sample data
    console.log('\n\nProcessing sample data...');
    const startDate = new Date('2026-01-15');
    const endDate = new Date('2026-02-01');
    rum.processGA4Data(startDate, endDate);

    // Check alerts
    const alerts = rum.checkAlerts();
    console.log(`\n${alerts.length} alerts found`);
    alerts.forEach(alert => {
        console.log(`  ${alert.severity.toUpperCase()}: ${alert.message}`);
    });

    // Generate dashboard
    const dashboardPath = path.join(rum.dataDir, 'dashboard.html');
    fs.writeFileSync(dashboardPath, rum.generateDashboard());
    console.log(`\n✅ Dashboard generated: ${dashboardPath}`);
}
