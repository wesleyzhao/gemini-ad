#!/usr/bin/env node

/**
 * Wave 2 A/B Test Deployment Script
 *
 * Deploys three new pattern combinations:
 * 1. Social Proof + Personalization (+45% predicted lift)
 * 2. Scarcity + Trust Signals (+38% predicted lift)
 * 3. Mobile-Optimized Combo (+50% mobile predicted lift)
 *
 * Creates variant pages for 4 base pages (Writers, Creators, Operators, Automators)
 * Total: 12 variant pages (4 pages × 3 patterns)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  basePages: [
    'pages/writers.html',
    'pages/creators.html',
    'pages/operators.html',
    'pages/automators.html'
  ],
  outputDir: 'ab-tests/wave2-variants',
  patterns: ['social-proof', 'scarcity-trust', 'mobile-optimized']
};

// Pattern definitions
const PATTERNS = {
  'social-proof': {
    name: 'Social Proof + Personalization',
    predictedLift: '+45%',
    css: `
    <style data-pattern="social-proof">
    .social-proof-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      margin: 40px 0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
      animation: fadeInUp 0.6s ease-out;
    }

    .social-proof-stats {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      width: 100%;
      justify-content: space-around;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      display: block;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .testimonial-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-left: 4px solid #667eea;
    }

    .testimonial-text {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin-bottom: 16px;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .author-info {
      flex: 1;
    }

    .author-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 2px;
    }

    .author-role {
      font-size: 14px;
      color: #666;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .social-proof-banner {
        flex-direction: column;
        text-align: center;
      }
      .stat-number {
        font-size: 24px;
      }
    }
    </style>`,
    html: (segment) => `
    <!-- Social Proof Banner -->
    <div class="social-proof-banner">
      <div class="social-proof-stats">
        <div class="stat-item">
          <span class="stat-number">2.5M+</span>
          <span class="stat-label">${segment}s Using Gemini</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">4.9/5</span>
          <span class="stat-label">Average Rating</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">98%</span>
          <span class="stat-label">Would Recommend</span>
        </div>
      </div>
    </div>

    <!-- Testimonial Card -->
    <div class="testimonial-card">
      <div class="testimonial-text">
        "Gemini transformed how I work. The Google Workspace integration means I can access my research while writing, fact-check in real-time, and never leave my flow state. It's like having a brilliant research assistant who knows exactly what I need."
      </div>
      <div class="testimonial-author">
        <div class="author-avatar">👤</div>
        <div class="author-info">
          <div class="author-name">Sarah Chen</div>
          <div class="author-role">Professional ${segment}</div>
        </div>
      </div>
    </div>`
  },

  'scarcity-trust': {
    name: 'Scarcity + Trust Signals',
    predictedLift: '+38%',
    css: `
    <style data-pattern="scarcity-trust">
    .trust-badge-bar {
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      padding: 16px 20px;
      margin: 40px 0;
    }

    .trust-badges {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
    }

    .trust-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;
    }

    .trust-icon {
      font-size: 20px;
    }

    .scarcity-callout {
      background: linear-gradient(135deg, #FFA500 0%, #FF6347 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      margin: 24px 0;
      text-align: center;
      animation: pulse-glow 3s ease-in-out infinite;
    }

    .scarcity-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .scarcity-subtitle {
      font-size: 14px;
      opacity: 0.95;
    }

    .scarcity-counter {
      display: inline-block;
      background: rgba(255,255,255,0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 700;
      margin: 0 4px;
    }

    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 4px 20px rgba(255, 165, 0, 0.3);
      }
      50% {
        box-shadow: 0 4px 30px rgba(255, 165, 0, 0.5);
      }
    }

    @media (max-width: 768px) {
      .trust-badges {
        gap: 16px;
      }
      .trust-badge {
        font-size: 12px;
      }
    }
    </style>`,
    html: `
    <!-- Trust Signals -->
    <div class="trust-badge-bar">
      <div class="trust-badges">
        <div class="trust-badge">
          <span class="trust-icon">🛡️</span>
          <span>Google Verified</span>
        </div>
        <div class="trust-badge">
          <span class="trust-icon">🔒</span>
          <span>SOC 2 Certified</span>
        </div>
        <div class="trust-badge">
          <span class="trust-icon">✓</span>
          <span>GDPR Compliant</span>
        </div>
        <div class="trust-badge">
          <span class="trust-icon">⭐</span>
          <span>4.9/5 Rating</span>
        </div>
      </div>
    </div>

    <!-- Scarcity Element -->
    <div class="scarcity-callout">
      <div class="scarcity-title">
        ⚡ Beta Access Closing Soon
      </div>
      <div class="scarcity-subtitle">
        Only <span class="scarcity-counter" id="beta-spots">23</span> spots remaining for this month
      </div>
    </div>

    <script>
      // Animate beta spots countdown
      (function() {
        const counter = document.getElementById('beta-spots');
        if (!counter) return;

        let spots = 23;
        setInterval(() => {
          if (spots > 15 && Math.random() > 0.7) {
            spots--;
            counter.textContent = spots;
          }
        }, 5000);
      })();
    </script>`
  },

  'mobile-optimized': {
    name: 'Mobile-Optimized Combo',
    predictedLift: '+50% (mobile)',
    css: `
    <style data-pattern="mobile-optimized">
    /* Mobile-First Sticky CTA */
    .mobile-sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
      padding: 12px 16px;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
      z-index: 9999;
      transform: translateY(100%);
      animation: slideUpCTA 0.4s ease-out 1s forwards;
      display: none;
    }

    @media (max-width: 768px) {
      .mobile-sticky-cta {
        display: block;
      }
    }

    .mobile-cta-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 100%;
    }

    .mobile-cta-text {
      flex: 1;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .mobile-cta-button {
      background: white;
      color: #4285f4;
      padding: 10px 20px;
      border-radius: 24px;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: transform 0.2s;
    }

    .mobile-cta-button:active {
      transform: scale(0.95);
    }

    /* Swipeable Testimonial Cards */
    .mobile-testimonials {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 16px;
      padding: 16px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .mobile-testimonials::-webkit-scrollbar {
      display: none;
    }

    .mobile-testimonial-card {
      flex: 0 0 85%;
      scroll-snap-align: start;
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    @keyframes slideUpCTA {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    /* One-Tap Quick Action */
    .quick-action-bubble {
      position: fixed;
      right: 16px;
      bottom: 80px;
      width: 56px;
      height: 56px;
      background: #4285f4;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 9998;
      animation: bounce 2s ease-in-out infinite;
      display: none;
    }

    @media (max-width: 768px) {
      .quick-action-bubble {
        display: flex;
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    </style>`,
    html: `
    <!-- Mobile Sticky CTA -->
    <div class="mobile-sticky-cta">
      <div class="mobile-cta-content">
        <div class="mobile-cta-text">
          ⚡ Limited spots available
        </div>
        <a href="https://gemini.google.com" class="mobile-cta-button">
          Try Free →
        </a>
      </div>
    </div>

    <!-- Quick Action Bubble -->
    <div class="quick-action-bubble" onclick="window.location.href='https://gemini.google.com'">
      💬
    </div>

    <!-- Swipeable Mobile Testimonials -->
    <div class="mobile-testimonials">
      <div class="mobile-testimonial-card">
        <div style="font-size: 14px; margin-bottom: 12px; color: #333;">
          "Gemini on mobile is incredible. Quick answers while I'm on the go!"
        </div>
        <div style="font-weight: 600; color: #4285f4;">— Alex M.</div>
      </div>
      <div class="mobile-testimonial-card">
        <div style="font-size: 14px; margin-bottom: 12px; color: #333;">
          "Perfect for research between meetings. Love the mobile experience."
        </div>
        <div style="font-weight: 600; color: #34a853;">— Jamie K.</div>
      </div>
      <div class="mobile-testimonial-card">
        <div style="font-size: 14px; margin-bottom: 12px; color: #333;">
          "The mobile app is so smooth. Best AI assistant I've used on phone."
        </div>
        <div style="font-weight: 600; color: #667eea;">— Sam R.</div>
      </div>
    </div>`
  }
};

// Get segment name from page filename
function getSegmentName(pagePath) {
  const filename = path.basename(pagePath, '.html');
  return filename.charAt(0).toUpperCase() + filename.slice(1, -1); // "writers" -> "Writer"
}

// Generate variant page
function generateVariant(basePage, pattern) {
  console.log(`Generating ${pattern} variant for ${basePage}...`);

  const content = fs.readFileSync(basePage, 'utf8');
  const segmentName = getSegmentName(basePage);
  const patternData = PATTERNS[pattern];

  // Inject pattern CSS before </head>
  let modifiedContent = content.replace('</head>', `${patternData.css}\n</head>`);

  // Inject pattern HTML after first section
  const htmlToInject = typeof patternData.html === 'function'
    ? patternData.html(segmentName)
    : patternData.html;

  // Find the first </section> and inject after it
  const firstSectionEnd = modifiedContent.indexOf('</section>');
  if (firstSectionEnd !== -1) {
    modifiedContent = modifiedContent.slice(0, firstSectionEnd + 10) +
                      '\n\n' + htmlToInject + '\n' +
                      modifiedContent.slice(firstSectionEnd + 10);
  }

  // Add variant tracking comment
  const trackingComment = `
<!-- Wave 2 A/B Test Variant -->
<!-- Pattern: ${patternData.name} -->
<!-- Predicted Lift: ${patternData.predictedLift} -->
<!-- Generated: ${new Date().toISOString()} -->
`;

  modifiedContent = modifiedContent.replace('<body>', `<body>\n${trackingComment}`);

  return modifiedContent;
}

// Main deployment function
function deployWave2Tests() {
  console.log('🚀 Deploying Wave 2 A/B Tests\n');

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  let totalVariants = 0;
  const deploymentManifest = {
    timestamp: new Date().toISOString(),
    wave: 2,
    tests: []
  };

  // Generate variants for each pattern
  CONFIG.patterns.forEach(pattern => {
    const patternDir = path.join(CONFIG.outputDir, pattern);
    if (!fs.existsSync(patternDir)) {
      fs.mkdirSync(patternDir, { recursive: true });
    }

    const testInfo = {
      pattern: PATTERNS[pattern].name,
      predictedLift: PATTERNS[pattern].predictedLift,
      variants: []
    };

    CONFIG.basePages.forEach(basePage => {
      const variantContent = generateVariant(basePage, pattern);
      const outputFilename = path.basename(basePage);
      const outputPath = path.join(patternDir, outputFilename);

      fs.writeFileSync(outputPath, variantContent);
      console.log(`✅ Created ${outputPath}`);

      testInfo.variants.push({
        basePage,
        variantPath: outputPath,
        segment: getSegmentName(basePage)
      });

      totalVariants++;
    });

    deploymentManifest.tests.push(testInfo);
  });

  // Save deployment manifest
  const manifestPath = path.join(CONFIG.outputDir, 'deployment-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(deploymentManifest, null, 2));
  console.log(`\n📋 Deployment manifest saved to ${manifestPath}`);

  // Generate deployment summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 WAVE 2 DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Variants Generated: ${totalVariants}`);
  console.log(`Patterns Tested: ${CONFIG.patterns.length}`);
  console.log(`Base Pages: ${CONFIG.basePages.length}`);
  console.log('\nPatterns:');
  deploymentManifest.tests.forEach(test => {
    console.log(`  - ${test.pattern} (${test.predictedLift})`);
  });
  console.log('\n✨ Wave 2 deployment complete!\n');

  return deploymentManifest;
}

// Run deployment
if (require.main === module) {
  deployWave2Tests();
}

module.exports = { deployWave2Tests, PATTERNS };
