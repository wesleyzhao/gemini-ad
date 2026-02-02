#!/usr/bin/env node

/**
 * Performance Improvement Implementation Tracker
 *
 * Tracks implementation of recommendations and measures their impact
 *
 * Features:
 * - Track recommended optimizations
 * - Monitor implementation progress
 * - Measure impact of changes
 * - Generate before/after comparisons
 * - ROI analysis for optimizations
 *
 * Usage:
 *   node scripts/implementation-tracker.js --track       # Track current state
 *   node scripts/implementation-tracker.js --implement   # Mark recommendation as implemented
 *   node scripts/implementation-tracker.js --impact      # Measure impact of changes
 *   node scripts/implementation-tracker.js --dashboard   # Generate dashboard
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  trackingFile: './reports/analysis/implementation-tracking.json',
  impactReportFile: './reports/analysis/impact-report.json',
  dashboardFile: './reports/dashboards/implementation-dashboard.html',
  recommendationsFile: './reports/analysis/recommendations.json'
};

/**
 * Initialize tracking data structure
 */
function initializeTracking() {
  return {
    version: '1.0',
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    implementations: [],
    metrics: {
      totalRecommendations: 0,
      implemented: 0,
      inProgress: 0,
      planned: 0,
      totalImpact: {
        lcp: 0,
        fcp: 0,
        cls: 0,
        inp: 0,
        ttfb: 0,
        fid: 0
      }
    }
  };
}

/**
 * Load or create tracking data
 */
function loadTracking() {
  if (fs.existsSync(CONFIG.trackingFile)) {
    return JSON.parse(fs.readFileSync(CONFIG.trackingFile, 'utf8'));
  }
  return initializeTracking();
}

/**
 * Save tracking data
 */
function saveTracking(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CONFIG.trackingFile, JSON.stringify(data, null, 2));
}

/**
 * Import recommendations into tracking
 */
function importRecommendations() {
  if (!fs.existsSync(CONFIG.recommendationsFile)) {
    console.log('⚠️  No recommendations file found. Run: npm run analyze:trends --recommend');
    return null;
  }

  const recommendations = JSON.parse(fs.readFileSync(CONFIG.recommendationsFile, 'utf8'));
  const tracking = loadTracking();

  // Process all priority levels
  const allRecs = [
    ...recommendations.high_priority.map(r => ({ ...r, priority: 'high' })),
    ...recommendations.medium_priority.map(r => ({ ...r, priority: 'medium' })),
    ...recommendations.quick_wins.map(r => ({ ...r, priority: 'quick-win' })),
    ...(recommendations.low_priority || []).map(r => ({ ...r, priority: 'low' }))
  ];

  let newCount = 0;

  allRecs.forEach(rec => {
    const existing = tracking.implementations.find(impl => impl.title === rec.title);

    if (!existing) {
      tracking.implementations.push({
        id: generateId(),
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        estimatedImpact: rec.estimatedImpact,
        effort: rec.effort,
        affectedPages: rec.affectedPages,
        actions: rec.actions,
        status: 'planned',
        createdAt: new Date().toISOString(),
        implementedAt: null,
        beforeMetrics: null,
        afterMetrics: null,
        actualImpact: null
      });
      newCount++;
    }
  });

  tracking.metrics.totalRecommendations = tracking.implementations.length;
  tracking.metrics.implemented = tracking.implementations.filter(i => i.status === 'implemented').length;
  tracking.metrics.inProgress = tracking.implementations.filter(i => i.status === 'in-progress').length;
  tracking.metrics.planned = tracking.implementations.filter(i => i.status === 'planned').length;

  saveTracking(tracking);

  console.log(`✅ Imported ${newCount} new recommendations`);
  console.log(`📊 Total tracked: ${tracking.implementations.length}`);

  return tracking;
}

/**
 * Generate unique ID
 */
function generateId() {
  return 'impl-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Mark implementation as started
 */
function startImplementation(implId) {
  const tracking = loadTracking();
  const impl = tracking.implementations.find(i => i.id === implId);

  if (!impl) {
    console.log('❌ Implementation not found');
    return;
  }

  impl.status = 'in-progress';
  impl.startedAt = new Date().toISOString();

  // Capture before metrics
  impl.beforeMetrics = captureCurrentMetrics(impl.affectedPages);

  saveTracking(tracking);
  console.log(`✅ Started implementation: ${impl.title}`);
  console.log(`📊 Captured before metrics for ${impl.affectedPages?.length || 0} pages`);
}

/**
 * Mark implementation as complete
 */
function completeImplementation(implId) {
  const tracking = loadTracking();
  const impl = tracking.implementations.find(i => i.id === implId);

  if (!impl) {
    console.log('❌ Implementation not found');
    return;
  }

  impl.status = 'implemented';
  impl.implementedAt = new Date().toISOString();

  // Capture after metrics
  impl.afterMetrics = captureCurrentMetrics(impl.affectedPages);

  // Calculate impact
  impl.actualImpact = calculateImpact(impl.beforeMetrics, impl.afterMetrics);

  // Update total impact
  if (impl.actualImpact) {
    Object.keys(impl.actualImpact).forEach(metric => {
      if (tracking.metrics.totalImpact[metric] !== undefined) {
        tracking.metrics.totalImpact[metric] += impl.actualImpact[metric].improvement || 0;
      }
    });
  }

  saveTracking(tracking);
  console.log(`✅ Completed implementation: ${impl.title}`);

  if (impl.actualImpact) {
    console.log('\n📊 Measured Impact:');
    Object.entries(impl.actualImpact).forEach(([metric, data]) => {
      if (data.improvement !== 0) {
        const icon = data.improvement < 0 ? '📈' : '📉';
        console.log(`   ${icon} ${metric.toUpperCase()}: ${Math.abs(data.improvement).toFixed(1)}% ${data.improvement < 0 ? 'faster' : 'slower'}`);
      }
    });
  }
}

/**
 * Capture current metrics for pages
 */
function captureCurrentMetrics(pages) {
  // Try to load latest monitoring report
  const reportsDir = './reports';
  const reports = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('cwv-monitoring-report-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (reports.length === 0) return null;

  const latestReport = JSON.parse(
    fs.readFileSync(path.join(reportsDir, reports[0]), 'utf8')
  );

  const metrics = {
    timestamp: latestReport.timestamp,
    pages: {}
  };

  if (pages && Array.isArray(pages)) {
    pages.forEach(page => {
      if (latestReport.pages[page]) {
        metrics.pages[page] = latestReport.pages[page].metrics;
      }
    });
  }

  return metrics;
}

/**
 * Calculate impact between before and after metrics
 */
function calculateImpact(before, after) {
  if (!before || !after) return null;

  const impact = {};
  const metrics = ['lcp', 'fcp', 'cls', 'inp', 'ttfb', 'fid'];

  metrics.forEach(metric => {
    let totalBefore = 0;
    let totalAfter = 0;
    let count = 0;

    Object.keys(before.pages).forEach(page => {
      const beforeVal = before.pages[page]?.[metric]?.p75;
      const afterVal = after.pages[page]?.[metric]?.p75;

      if (beforeVal && afterVal) {
        totalBefore += parseFloat(beforeVal);
        totalAfter += parseFloat(afterVal);
        count++;
      }
    });

    if (count > 0) {
      const avgBefore = totalBefore / count;
      const avgAfter = totalAfter / count;
      const change = avgAfter - avgBefore;
      const percentChange = (change / avgBefore) * 100;

      impact[metric] = {
        before: avgBefore,
        after: avgAfter,
        change: change,
        improvement: percentChange, // Negative is good (faster)
        pagesAffected: count
      };
    }
  });

  return impact;
}

/**
 * Generate impact report
 */
function generateImpactReport() {
  const tracking = loadTracking();
  const implemented = tracking.implementations.filter(i => i.status === 'implemented');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImplementations: implemented.length,
      totalPages: new Set(implemented.flatMap(i => i.affectedPages || [])).size,
      totalImpact: tracking.metrics.totalImpact
    },
    implementations: implemented.map(impl => ({
      title: impl.title,
      priority: impl.priority,
      implementedAt: impl.implementedAt,
      duration: calculateDuration(impl.startedAt, impl.implementedAt),
      impact: impl.actualImpact,
      roi: calculateROI(impl)
    })),
    topWins: [],
    lessonsLearned: []
  };

  // Identify top wins
  report.topWins = implemented
    .filter(i => i.actualImpact)
    .sort((a, b) => {
      const aScore = calculateImpactScore(a.actualImpact);
      const bScore = calculateImpactScore(b.actualImpact);
      return bScore - aScore;
    })
    .slice(0, 5)
    .map(impl => ({
      title: impl.title,
      impact: impl.actualImpact,
      effort: impl.effort,
      priority: impl.priority
    }));

  fs.writeFileSync(CONFIG.impactReportFile, JSON.stringify(report, null, 2));
  console.log(`✅ Impact report generated: ${CONFIG.impactReportFile}`);

  return report;
}

/**
 * Calculate duration in days
 */
function calculateDuration(start, end) {
  if (!start || !end) return null;
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Calculate ROI
 */
function calculateROI(impl) {
  if (!impl.actualImpact) return null;

  const impactScore = calculateImpactScore(impl.actualImpact);
  const effortScore = { low: 1, medium: 2, high: 3 }[impl.effort] || 2;

  return {
    score: impactScore / effortScore,
    rating: impactScore / effortScore > 5 ? 'excellent' :
            impactScore / effortScore > 2 ? 'good' : 'fair'
  };
}

/**
 * Calculate impact score
 */
function calculateImpactScore(impact) {
  if (!impact) return 0;

  let score = 0;

  // LCP and FCP are most important for user experience
  if (impact.lcp) score += Math.abs(impact.lcp.improvement) * 2;
  if (impact.fcp) score += Math.abs(impact.fcp.improvement) * 1.5;

  // Other metrics
  if (impact.cls) score += Math.abs(impact.cls.improvement) * 1.5;
  if (impact.inp) score += Math.abs(impact.inp.improvement);
  if (impact.ttfb) score += Math.abs(impact.ttfb.improvement);
  if (impact.fid) score += Math.abs(impact.fid.improvement);

  return score;
}

/**
 * Generate HTML dashboard
 */
function generateDashboard() {
  const tracking = loadTracking();
  const impactReport = fs.existsSync(CONFIG.impactReportFile)
    ? JSON.parse(fs.readFileSync(CONFIG.impactReportFile, 'utf8'))
    : null;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Implementation Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f7;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 48px; font-weight: 600; margin-bottom: 10px; color: #1d1d1f; }
    .subtitle { font-size: 21px; color: #6e6e73; margin-bottom: 40px; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 48px;
      font-weight: 600;
      color: #0071e3;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 17px;
      color: #6e6e73;
    }
    .section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .section h2 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 24px;
      color: #1d1d1f;
    }
    .implementation {
      border-left: 4px solid #0071e3;
      padding: 16px;
      margin-bottom: 16px;
      background: #f5f5f7;
      border-radius: 8px;
    }
    .implementation.high { border-left-color: #ff3b30; }
    .implementation.medium { border-left-color: #ff9500; }
    .implementation.quick-win { border-left-color: #34c759; }
    .implementation h3 {
      font-size: 21px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1d1d1f;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 8px;
    }
    .badge.planned { background: #e5e5ea; color: #1d1d1f; }
    .badge.in-progress { background: #ff9500; color: white; }
    .badge.implemented { background: #34c759; color: white; }
    .badge.high { background: #ff3b30; color: white; }
    .badge.medium { background: #ff9500; color: white; }
    .badge.quick-win { background: #34c759; color: white; }
    .impact {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    .metric {
      padding: 8px 12px;
      background: white;
      border-radius: 6px;
      font-size: 14px;
    }
    .metric .value {
      font-size: 20px;
      font-weight: 600;
      color: #34c759;
    }
    .metric .value.negative { color: #ff3b30; }
    .progress-bar {
      height: 8px;
      background: #e5e5ea;
      border-radius: 4px;
      overflow: hidden;
      margin: 20px 0;
    }
    .progress-fill {
      height: 100%;
      background: #0071e3;
      transition: width 0.3s ease;
    }
    .timestamp {
      font-size: 14px;
      color: #86868b;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Performance Implementation Dashboard</h1>
    <p class="subtitle">Track and measure optimization impact</p>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${tracking.implementations.length}</div>
        <div class="stat-label">Total Recommendations</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${tracking.metrics.implemented}</div>
        <div class="stat-label">Implemented</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${tracking.metrics.inProgress}</div>
        <div class="stat-label">In Progress</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${tracking.metrics.planned}</div>
        <div class="stat-label">Planned</div>
      </div>
    </div>

    <div class="section">
      <h2>Progress Overview</h2>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(tracking.metrics.implemented / tracking.implementations.length * 100).toFixed(0)}%"></div>
      </div>
      <p>${(tracking.metrics.implemented / tracking.implementations.length * 100).toFixed(0)}% complete</p>
    </div>

    ${impactReport ? `
    <div class="section">
      <h2>Top Wins</h2>
      ${impactReport.topWins.map(win => `
        <div class="implementation ${win.priority}">
          <h3>${win.title}</h3>
          <span class="badge ${win.priority}">${win.priority}</span>
          <span class="badge">${win.effort} effort</span>
          ${win.impact ? `
            <div class="impact">
              ${Object.entries(win.impact).map(([metric, data]) => `
                <div class="metric">
                  <div>${metric.toUpperCase()}</div>
                  <div class="value ${data.improvement > 0 ? 'negative' : ''}">${Math.abs(data.improvement).toFixed(1)}%</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="section">
      <h2>All Implementations</h2>
      ${tracking.implementations.map(impl => `
        <div class="implementation ${impl.priority}">
          <h3>${impl.title}</h3>
          <span class="badge ${impl.status}">${impl.status}</span>
          <span class="badge ${impl.priority}">${impl.priority}</span>
          <p style="margin-top: 8px; color: #6e6e73;">${impl.description}</p>
          ${impl.actualImpact ? `
            <div class="impact">
              ${Object.entries(impl.actualImpact).map(([metric, data]) => `
                <div class="metric">
                  <div>${metric.toUpperCase()}</div>
                  <div class="value ${data.improvement > 0 ? 'negative' : ''}">${Math.abs(data.improvement).toFixed(1)}%</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <div class="timestamp">
      Last updated: ${new Date(tracking.lastUpdated).toLocaleString()}
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(CONFIG.dashboardFile, html);
  console.log(`✅ Dashboard generated: ${CONFIG.dashboardFile}`);
}

/**
 * List implementations
 */
function listImplementations(filter = 'all') {
  const tracking = loadTracking();
  let items = tracking.implementations;

  if (filter !== 'all') {
    items = items.filter(i => i.status === filter);
  }

  console.log(`\n📋 Implementations (${filter}):\n`);

  items.forEach((impl, i) => {
    const statusIcon = {
      'planned': '⏳',
      'in-progress': '🚧',
      'implemented': '✅'
    }[impl.status] || '❓';

    console.log(`${i + 1}. ${statusIcon} ${impl.title}`);
    console.log(`   ID: ${impl.id}`);
    console.log(`   Priority: ${impl.priority} | Status: ${impl.status}`);
    console.log(`   Impact: ${impl.estimatedImpact} | Effort: ${impl.effort}`);
    if (impl.affectedPages) {
      console.log(`   Pages: ${impl.affectedPages.length}`);
    }
    console.log('');
  });
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--help';

  if (command === '--help') {
    console.log(`
Performance Implementation Tracker

Commands:
  --track              Import recommendations and initialize tracking
  --list [filter]      List implementations (all|planned|in-progress|implemented)
  --start <id>         Start implementation (captures before metrics)
  --complete <id>      Complete implementation (captures after metrics)
  --impact             Generate impact report
  --dashboard          Generate HTML dashboard

Examples:
  npm run track:implementations
  node scripts/implementation-tracker.js --list planned
  node scripts/implementation-tracker.js --start impl-123456
  node scripts/implementation-tracker.js --complete impl-123456
    `);
    return;
  }

  if (command === '--track') {
    importRecommendations();
    generateDashboard();
    return;
  }

  if (command === '--list') {
    const filter = args[1] || 'all';
    listImplementations(filter);
    return;
  }

  if (command === '--start') {
    const id = args[1];
    if (!id) {
      console.log('❌ Please provide implementation ID');
      return;
    }
    startImplementation(id);
    return;
  }

  if (command === '--complete') {
    const id = args[1];
    if (!id) {
      console.log('❌ Please provide implementation ID');
      return;
    }
    completeImplementation(id);
    generateImpactReport();
    generateDashboard();
    return;
  }

  if (command === '--impact') {
    generateImpactReport();
    return;
  }

  if (command === '--dashboard') {
    generateDashboard();
    return;
  }

  console.log('❌ Unknown command. Use --help for usage information.');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadTracking,
  saveTracking,
  importRecommendations,
  startImplementation,
  completeImplementation,
  generateImpactReport,
  generateDashboard
};
