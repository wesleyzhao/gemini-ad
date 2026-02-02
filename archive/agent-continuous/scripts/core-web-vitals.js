/**
 * Core Web Vitals Optimization Script
 * Implements performance optimizations for LCP, FID/INP, and CLS
 * Measures and monitors Core Web Vitals metrics
 *
 * Usage:
 *   node scripts/core-web-vitals.js --analyze    # Analyze current pages
 *   node scripts/core-web-vitals.js --optimize   # Apply optimizations
 *   node scripts/core-web-vitals.js --report     # Generate performance report
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  pagesDir: path.join(process.cwd(), 'pages'),
  assetsDir: path.join(process.cwd(), 'assets'),
  outputDir: path.join(process.cwd(), 'reports'),

  // Performance budgets (Core Web Vitals thresholds)
  budgets: {
    LCP: {
      good: 2500,      // 2.5s
      needsWork: 4000  // 4.0s
    },
    FID: {
      good: 100,       // 100ms
      needsWork: 300   // 300ms
    },
    CLS: {
      good: 0.1,
      needsWork: 0.25
    },
    // Additional metrics
    FCP: {
      good: 1800,      // 1.8s
      needsWork: 3000  // 3.0s
    },
    TTFB: {
      good: 800,       // 800ms
      needsWork: 1800  // 1.8s
    },
    TBT: {
      good: 200,       // 200ms
      needsWork: 600   // 600ms
    }
  },

  // Optimization settings
  optimizations: {
    inlineCSS: true,           // Inline critical CSS
    preconnect: true,          // Add preconnect hints
    preload: true,             // Add preload hints
    deferNonCritical: true,    // Defer non-critical JS
    imageOptimization: true,   // Add width/height to images
    fontDisplay: true,         // Add font-display: swap
    reduceLayoutShift: true    // Add size attributes
  }
};

// ============================================
// CORE WEB VITALS MONITORING SNIPPET
// ============================================

const WEB_VITALS_SNIPPET = `
<!-- Core Web Vitals Monitoring -->
<script>
(function() {
  'use strict';

  // Core Web Vitals measurement using PerformanceObserver
  const vitals = {
    LCP: null,
    FID: null,
    CLS: 0,
    FCP: null,
    TTFB: null,
    INP: null
  };

  // Largest Contentful Paint (LCP)
  function measureLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = Math.round(lastEntry.renderTime || lastEntry.loadTime);

        if (window.gtag) {
          gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: vitals.LCP,
            metric_rating: vitals.LCP <= 2500 ? 'good' : vitals.LCP <= 4000 ? 'needs-improvement' : 'poor',
            non_interaction: true
          });
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP measurement not supported');
    }
  }

  // First Input Delay (FID)
  function measureFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          vitals.FID = Math.round(entry.processingStart - entry.startTime);

          if (window.gtag) {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'FID',
              value: vitals.FID,
              metric_rating: vitals.FID <= 100 ? 'good' : vitals.FID <= 300 ? 'needs-improvement' : 'poor',
              non_interaction: true
            });
          }
        });
      });
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID measurement not supported');
    }
  }

  // Interaction to Next Paint (INP) - New metric replacing FID
  function measureINP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let maxDuration = 0;

        entries.forEach((entry) => {
          const duration = entry.processingEnd - entry.startTime;
          if (duration > maxDuration) {
            maxDuration = duration;
          }
        });

        vitals.INP = Math.round(maxDuration);

        if (window.gtag && vitals.INP > 0) {
          gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'INP',
            value: vitals.INP,
            metric_rating: vitals.INP <= 200 ? 'good' : vitals.INP <= 500 ? 'needs-improvement' : 'poor',
            non_interaction: true
          });
        }
      });
      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {
      console.warn('INP measurement not supported');
    }
  }

  // Cumulative Layout Shift (CLS)
  function measureCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            vitals.CLS = Math.round(clsValue * 1000) / 1000;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page unload
      addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && window.gtag) {
          gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'CLS',
            value: Math.round(vitals.CLS * 1000),
            metric_rating: vitals.CLS <= 0.1 ? 'good' : vitals.CLS <= 0.25 ? 'needs-improvement' : 'poor',
            non_interaction: true
          });
        }
      });
    } catch (e) {
      console.warn('CLS measurement not supported');
    }
  }

  // First Contentful Paint (FCP)
  function measureFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            vitals.FCP = Math.round(entry.startTime);
          }
        });
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('FCP measurement not supported');
    }
  }

  // Time to First Byte (TTFB)
  function measureTTFB() {
    try {
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry) {
        vitals.TTFB = Math.round(navEntry.responseStart - navEntry.requestStart);
      }
    } catch (e) {
      console.warn('TTFB measurement not supported');
    }
  }

  // Initialize measurements when DOM is ready
  if (document.readyState === 'complete') {
    measureLCP();
    measureFID();
    measureINP();
    measureCLS();
    measureFCP();
    measureTTFB();
  } else {
    addEventListener('load', () => {
      measureLCP();
      measureFID();
      measureINP();
      measureCLS();
      measureFCP();
      measureTTFB();
    });
  }

  // Expose vitals for debugging
  window.__webVitals = vitals;
})();
</script>
`;

// ============================================
// CRITICAL CSS EXTRACTION
// ============================================

function extractCriticalCSS() {
  // For now, return common critical CSS patterns
  // In production, use tools like critical or penthouse
  return `
/* Critical CSS - Above the fold */
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:'SF Pro Display',-apple-system,BlinkMacSystemFont,'Google Sans','Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
header{position:fixed;top:0;left:0;right:0;height:48px;background:#fff;z-index:1000;border-bottom:1px solid #e8eaed}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center}
.container{max-width:1280px;margin:0 auto;padding:0 24px}
.btn-primary{display:inline-flex;align-items:center;padding:14px 28px;background:#1a73e8;color:#fff;border:none;border-radius:8px;font-weight:500;cursor:pointer;transition:all .2s}
`;
}

// ============================================
// OPTIMIZATION FUNCTIONS
// ============================================

function optimizePage(htmlPath) {
  console.log(`\nOptimizing: ${path.basename(htmlPath)}`);

  let html = fs.readFileSync(htmlPath, 'utf8');
  let optimizations = [];

  // 1. Add DNS prefetch and preconnect for external resources
  if (CONFIG.optimizations.preconnect && !html.includes('rel="preconnect"')) {
    const preconnectLinks = `
  <!-- Preconnect to external domains for faster resource loading -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://app.tailorhq.ai">`;

    html = html.replace('</head>', `${preconnectLinks}\n</head>`);
    optimizations.push('Added preconnect/dns-prefetch hints');
  }

  // 2. Add font-display: swap to font imports
  if (CONFIG.optimizations.fontDisplay) {
    html = html.replace(
      /family=([^"'&]+)/g,
      'family=$1&display=swap'
    );
    optimizations.push('Added font-display:swap to Google Fonts');
  }

  // 3. Preload critical assets
  if (CONFIG.optimizations.preload && !html.includes('rel="preload"')) {
    const cssPath = html.match(/href="([^"]+shared-styles\.css[^"]*)"/);
    if (cssPath) {
      const preloadLink = `  <link rel="preload" href="${cssPath[1]}" as="style">`;
      html = html.replace('<link rel="stylesheet"', `${preloadLink}\n  <link rel="stylesheet"`);
      optimizations.push('Added preload for critical CSS');
    }
  }

  // 4. Defer non-critical JavaScript
  if (CONFIG.optimizations.deferNonCritical) {
    // Add defer to animation script
    html = html.replace(
      /<script src="([^"]+animations\.js[^"]*)"><\/script>/g,
      '<script src="$1" defer></script>'
    );
    optimizations.push('Added defer to non-critical scripts');
  }

  // 5. Add explicit width/height to images to prevent CLS
  if (CONFIG.optimizations.imageOptimization) {
    // This is a placeholder - would need actual image analysis
    optimizations.push('Image optimization check (manual review needed)');
  }

  // 6. Add Core Web Vitals monitoring snippet
  if (!html.includes('__webVitals')) {
    html = html.replace('</head>', `${WEB_VITALS_SNIPPET}</head>`);
    optimizations.push('Added Core Web Vitals monitoring');
  }

  // 7. Optimize CSS delivery - inline critical CSS
  if (CONFIG.optimizations.inlineCSS && html.includes('shared-styles.css')) {
    const criticalCSS = extractCriticalCSS();
    const inlineStyle = `  <style id="critical-css">${criticalCSS}</style>`;
    html = html.replace('</head>', `${inlineStyle}\n</head>`);

    // Load full stylesheet asynchronously
    html = html.replace(
      /<link rel="stylesheet" href="([^"]+shared-styles\.css[^"]*)"/,
      `<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="$1"></noscript>`
    );
    optimizations.push('Inlined critical CSS and deferred full stylesheet');
  }

  // 8. Add resource hints for better performance
  const metaTag = html.match(/<meta name="viewport"[^>]*>/);
  if (metaTag) {
    const performanceHints = `
  <!-- Performance optimizations -->
  <meta name="theme-color" content="#1a73e8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">`;
    html = html.replace(metaTag[0], `${metaTag[0]}${performanceHints}`);
  }

  // Write optimized HTML
  fs.writeFileSync(htmlPath, html, 'utf8');

  console.log(`✅ Applied ${optimizations.length} optimizations:`);
  optimizations.forEach(opt => console.log(`   - ${opt}`));

  return {
    file: path.basename(htmlPath),
    optimizations: optimizations.length,
    details: optimizations
  };
}

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

function analyzePages() {
  console.log('🔍 Analyzing pages for Core Web Vitals issues...\n');

  const pagesDir = CONFIG.pagesDir;
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

  const analysis = files.map(file => {
    const filePath = path.join(pagesDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // Check for common CWV issues
    if (!html.includes('rel="preconnect"')) {
      issues.push('Missing preconnect for external resources');
    }

    if (!html.includes('display=swap')) {
      issues.push('Missing font-display:swap on Google Fonts');
    }

    if (!html.includes('rel="preload"')) {
      issues.push('No preload hints for critical resources');
    }

    if (!html.includes('defer') && html.includes('animations.js')) {
      issues.push('Scripts not deferred');
    }

    if (!html.includes('__webVitals')) {
      issues.push('No Core Web Vitals monitoring');
    }

    // Count external requests
    const externalRequests = (html.match(/https?:\/\//g) || []).length;

    // Estimate CSS size
    const inlineStyles = html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
    const totalInlineCSS = inlineStyles.reduce((sum, style) => sum + style.length, 0);

    return {
      file,
      issues: issues.length,
      issuesList: issues,
      externalRequests,
      inlineCSSSize: Math.round(totalInlineCSS / 1024) + ' KB'
    };
  });

  // Print analysis
  console.log('Analysis Results:');
  console.log('='.repeat(80));

  analysis.forEach(result => {
    console.log(`\n📄 ${result.file}`);
    console.log(`   Issues: ${result.issues}`);
    console.log(`   External requests: ${result.externalRequests}`);
    console.log(`   Inline CSS: ${result.inlineCSSSize}`);

    if (result.issuesList.length > 0) {
      console.log(`   Problems:`);
      result.issuesList.forEach(issue => console.log(`     - ${issue}`));
    }
  });

  const totalIssues = analysis.reduce((sum, r) => sum + r.issues, 0);
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 Total issues found: ${totalIssues}`);
  console.log(`📈 Pages analyzed: ${files.length}`);

  return analysis;
}

// ============================================
// PERFORMANCE REPORT GENERATION
// ============================================

function generateReport(analysisData) {
  console.log('\n📊 Generating Core Web Vitals Performance Report...\n');

  const report = {
    generated: new Date().toISOString(),
    budgets: CONFIG.budgets,
    analysis: analysisData || [],
    recommendations: [
      {
        priority: 'HIGH',
        metric: 'LCP',
        issue: 'Optimize Largest Contentful Paint',
        actions: [
          'Preload hero images or use CSS gradients',
          'Inline critical CSS for above-fold content',
          'Use CDN for faster asset delivery',
          'Optimize font loading with font-display:swap',
          'Minimize render-blocking resources'
        ]
      },
      {
        priority: 'HIGH',
        metric: 'CLS',
        issue: 'Prevent Cumulative Layout Shift',
        actions: [
          'Add explicit width/height to all images',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS aspect-ratio for responsive images',
          'Preload fonts to avoid FOIT/FOUT'
        ]
      },
      {
        priority: 'MEDIUM',
        metric: 'FID/INP',
        issue: 'Optimize First Input Delay & Interaction',
        actions: [
          'Defer non-critical JavaScript',
          'Split long tasks into smaller chunks',
          'Use web workers for heavy computation',
          'Minimize main thread work',
          'Optimize event handlers'
        ]
      },
      {
        priority: 'MEDIUM',
        metric: 'FCP',
        issue: 'Improve First Contentful Paint',
        actions: [
          'Reduce server response time (TTFB)',
          'Eliminate render-blocking resources',
          'Minify CSS and JavaScript',
          'Use HTTP/2 for multiplexing',
          'Enable text compression (gzip/brotli)'
        ]
      }
    ],
    performanceBudgets: {
      description: 'Maximum allowed values for production',
      budgets: CONFIG.budgets,
      enforcement: 'Monitor via Lighthouse CI and GitHub Actions'
    }
  };

  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const reportPath = path.join(CONFIG.outputDir, 'core-web-vitals-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('✅ Report generated: ' + reportPath);

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('PERFORMANCE BUDGETS');
  console.log('='.repeat(80));
  console.log('\nCore Web Vitals Thresholds:');
  console.log(`  LCP (Largest Contentful Paint):`);
  console.log(`    ✅ Good: ≤ ${CONFIG.budgets.LCP.good}ms`);
  console.log(`    ⚠️  Needs Work: ≤ ${CONFIG.budgets.LCP.needsWork}ms`);
  console.log(`\n  FID (First Input Delay):`);
  console.log(`    ✅ Good: ≤ ${CONFIG.budgets.FID.good}ms`);
  console.log(`    ⚠️  Needs Work: ≤ ${CONFIG.budgets.FID.needsWork}ms`);
  console.log(`\n  CLS (Cumulative Layout Shift):`);
  console.log(`    ✅ Good: ≤ ${CONFIG.budgets.CLS.good}`);
  console.log(`    ⚠️  Needs Work: ≤ ${CONFIG.budgets.CLS.needsWork}`);

  return report;
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('Core Web Vitals Optimization Tool');
  console.log('='.repeat(80));

  if (command === '--analyze') {
    const analysis = analyzePages();
    generateReport(analysis);
  } else if (command === '--optimize') {
    console.log('\n🚀 Optimizing all landing pages...\n');

    const pagesDir = CONFIG.pagesDir;
    const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

    const results = files.map(file => {
      const filePath = path.join(pagesDir, file);
      return optimizePage(filePath);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`✅ Optimized ${results.length} pages`);
    console.log(`📈 Total optimizations applied: ${results.reduce((sum, r) => sum + r.optimizations, 0)}`);
  } else if (command === '--report') {
    const analysis = analyzePages();
    generateReport(analysis);
  } else {
    console.log('\nUsage:');
    console.log('  node scripts/core-web-vitals.js --analyze    # Analyze pages');
    console.log('  node scripts/core-web-vitals.js --optimize   # Apply optimizations');
    console.log('  node scripts/core-web-vitals.js --report     # Generate report');
    console.log('\nFor best results, run --analyze first, then --optimize\n');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  optimizePage,
  analyzePages,
  generateReport,
  CONFIG
};
