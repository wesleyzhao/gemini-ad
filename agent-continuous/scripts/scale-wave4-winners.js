#!/usr/bin/env node

/**
 * Wave 4 Scaling Automation Script
 * Automatically scales Wave 4 winning patterns to production pages
 *
 * Usage: node scripts/scale-wave4-winners.js
 *
 * Patterns to scale:
 * 1. Quad Threat Mega Combo → 8 additional pages
 * 2. AI Optimization → 5 additional pages
 * 3. Voice Interface → 3 additional pages (mobile-heavy)
 * 4. AR/VR Previews → 2 additional pages (premium)
 *
 * Date: 2026-03-01
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  patterns: {
    quad_threat: {
      name: 'Quad Threat Mega Combo',
      current_pages: ['trust.html', 'workspace.html', 'apple-style.html'],
      target_pages: [
        'research.html',
        'productivity.html',
        'valentine.html',
        'comparison.html',
        'future.html',
        'writers.html',
        'creators.html',
        'operators.html'
      ],
      lift: 1.303,
      annual_revenue_per_page: 1267447
    },

    ai_optimization: {
      name: 'AI Optimization',
      current_pages: ['research.html', 'comparison.html'],
      target_pages: [
        'trust.html',
        'workspace.html',
        'productivity.html',
        'valentine.html',
        'future.html'
      ],
      lift: 0.900,
      annual_revenue_per_page: 1066460
    },

    voice_interface: {
      name: 'Voice Interface',
      current_pages: ['productivity.html', 'future.html'],
      target_pages: [
        'writers.html',
        'creators.html',
        'automators.html'
      ],
      lift: 0.677,
      annual_revenue_per_page: 688440
    },

    ar_vr_preview: {
      name: 'AR/VR Previews',
      current_pages: ['apple-style.html', 'future.html'],
      target_pages: [
        'valentine.html',
        'creators.html'
      ],
      lift: 0.770,
      annual_revenue_per_page: 520170
    }
  },

  project_root: path.resolve(__dirname, '..')
};

// Scaling report
const report = {
  timestamp: new Date().toISOString(),
  patterns_scaled: [],
  pages_modified: [],
  total_pattern_applications: 0,
  expected_annual_revenue: 0,
  errors: []
};

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(80));
  console.log('Wave 4 Scaling Automation Script');
  console.log('='.repeat(80));
  console.log();

  // Scale each pattern
  await scaleQuadThreat();
  await scaleAIOptimization();
  await scaleVoiceInterface();
  await scaleARVR();

  // Generate report
  generateReport();

  // Save report
  saveReport();

  console.log();
  console.log('='.repeat(80));
  console.log('✅ Wave 4 Scaling Complete!');
  console.log('='.repeat(80));
  console.log();
  console.log(`Total Patterns Applied: ${report.total_pattern_applications}`);
  console.log(`Pages Modified: ${report.pages_modified.length}`);
  console.log(`Expected Annual Revenue: $${report.expected_annual_revenue.toLocaleString()}`);
  console.log();
  console.log('Next steps:');
  console.log('1. Review modified pages for quality');
  console.log('2. Test on multiple devices and browsers');
  console.log('3. Deploy to staging for validation');
  console.log('4. Monitor performance metrics');
  console.log('5. Deploy to production');
  console.log();
}

/**
 * Scale Quad Threat Mega Combo
 */
async function scaleQuadThreat() {
  console.log('\n📊 Scaling Quad Threat Mega Combo...\n');

  const pattern = config.patterns.quad_threat;
  let applied = 0;
  let skipped = 0;

  for (const page of pattern.target_pages) {
    const pagePath = path.join(config.project_root, page);

    if (!fs.existsSync(pagePath)) {
      console.log(`⚠️  ${page} - File not found, skipping`);
      skipped++;
      continue;
    }

    // Check if already has pattern
    const content = fs.readFileSync(pagePath, 'utf8');
    if (content.includes('quad-threat-container') || content.includes('sticky-cta-quad')) {
      console.log(`⏭️  ${page} - Already has Quad Threat, skipping`);
      skipped++;
      continue;
    }

    // Apply pattern
    try {
      applyQuadThreatPattern(pagePath, content);
      console.log(`✅ ${page} - Quad Threat applied successfully`);
      applied++;
      report.pages_modified.push(page);
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
      report.errors.push({ page, pattern: 'quad_threat', error: error.message });
      skipped++;
    }
  }

  console.log(`\n   Applied: ${applied} | Skipped: ${skipped}`);

  report.patterns_scaled.push({
    name: pattern.name,
    applied,
    skipped,
    revenue_impact: applied * pattern.annual_revenue_per_page
  });

  report.total_pattern_applications += applied;
  report.expected_annual_revenue += applied * pattern.annual_revenue_per_page;
}

/**
 * Apply Quad Threat pattern to a page
 */
function applyQuadThreatPattern(pagePath, content) {
  // Find insertion point (after hero or main opening tag)
  let insertionPoint = content.indexOf('<main');
  if (insertionPoint === -1) {
    insertionPoint = content.indexOf('<body');
  }

  if (insertionPoint === -1) {
    throw new Error('Could not find insertion point');
  }

  // Find end of opening tag
  insertionPoint = content.indexOf('>', insertionPoint) + 1;

  // Quad Threat HTML
  const quadThreatHTML = `
    <!-- Wave 4: Quad Threat Mega Combo -->
    <div class="quad-threat-container">
      <!-- Sticky CTA (Mobile-Optimized) -->
      <button class="sticky-cta-quad" onclick="window.open('https://gemini.google.com', '_blank')">
        Try Gemini Free →
      </button>

      <!-- Social Proof Banner -->
      <div class="social-proof-banner-quad">
        <div class="social-proof-avatars">
          <img src="data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%234285f4'/%3E%3C/svg%3E" alt="User 1">
          <img src="data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2334a853'/%3E%3C/svg%3E" alt="User 2">
          <img src="data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23fbbc04'/%3E%3C/svg%3E" alt="User 3">
        </div>
        <span style="font-weight: 600; font-size: 16px;">
          Join 2.5M+ professionals using Gemini
        </span>
      </div>
    </div>
    <!-- End Wave 4 Quad Threat -->
`;

  // Quad Threat CSS
  const quadThreatCSS = `
    <style>
      /* Wave 4: Quad Threat Mega Combo Styles */
      .quad-threat-container {
        position: relative;
      }

      .sticky-cta-quad {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(66, 133, 244, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
      }

      .sticky-cta-quad:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow: 0 12px 32px rgba(66, 133, 244, 0.4);
      }

      .social-proof-banner-quad {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 16px 24px;
        margin: 24px auto;
        max-width: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .social-proof-avatars {
        display: flex;
      }

      .social-proof-avatars img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: -8px;
      }

      .social-proof-avatars img:first-child {
        margin-left: 0;
      }

      @media (max-width: 768px) {
        .sticky-cta-quad {
          bottom: 10px;
          padding: 14px 28px;
          font-size: 16px;
        }

        .social-proof-banner-quad {
          flex-direction: column;
          text-align: center;
          padding: 12px 16px;
        }
      }
    </style>
`;

  // Insert HTML after main/body opening
  const newContent = content.slice(0, insertionPoint) +
                      quadThreatHTML +
                      content.slice(insertionPoint);

  // Insert CSS before </head>
  const headCloseIndex = newContent.indexOf('</head>');
  const finalContent = newContent.slice(0, headCloseIndex) +
                       quadThreatCSS +
                       newContent.slice(headCloseIndex);

  fs.writeFileSync(pagePath, finalContent, 'utf8');
}

/**
 * Scale AI Optimization
 */
async function scaleAIOptimization() {
  console.log('\n🤖 Scaling AI Optimization...\n');

  const pattern = config.patterns.ai_optimization;
  let applied = 0;
  let skipped = 0;

  for (const page of pattern.target_pages) {
    const pagePath = path.join(config.project_root, page);

    if (!fs.existsSync(pagePath)) {
      console.log(`⚠️  ${page} - File not found, skipping`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(pagePath, 'utf8');
    if (content.includes('AIOptimizer') || content.includes('ai-personalization')) {
      console.log(`⏭️  ${page} - Already has AI Optimization, skipping`);
      skipped++;
      continue;
    }

    try {
      applyAIOptimizationPattern(pagePath, content);
      console.log(`✅ ${page} - AI Optimization applied successfully`);
      applied++;
      if (!report.pages_modified.includes(page)) {
        report.pages_modified.push(page);
      }
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
      report.errors.push({ page, pattern: 'ai_optimization', error: error.message });
      skipped++;
    }
  }

  console.log(`\n   Applied: ${applied} | Skipped: ${skipped}`);

  report.patterns_scaled.push({
    name: pattern.name,
    applied,
    skipped,
    revenue_impact: applied * pattern.annual_revenue_per_page
  });

  report.total_pattern_applications += applied;
  report.expected_annual_revenue += applied * pattern.annual_revenue_per_page;
}

/**
 * Apply AI Optimization pattern
 */
function applyAIOptimizationPattern(pagePath, content) {
  const aiScript = `
    <script>
      // Wave 4: AI Optimization
      (function() {
        class AIOptimizer {
          constructor() {
            this.userProfile = this.buildUserProfile();
            this.optimize();
          }

          buildUserProfile() {
            return {
              device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
              source: document.referrer || 'direct',
              timeOfDay: new Date().getHours(),
              returning: localStorage.getItem('gemini_visited') !== null
            };
          }

          optimize() {
            this.optimizeHero();
            this.optimizeCTA();
            localStorage.setItem('gemini_visited', 'true');
          }

          optimizeHero() {
            const profile = this.userProfile;
            let heroText = "Get instant answers with Gemini";

            if (profile.returning) {
              heroText = "Welcome back! Ready to continue?";
            } else if (profile.timeOfDay >= 22 || profile.timeOfDay < 6) {
              heroText = "Work smarter, even late at night";
            } else if (profile.source.includes('google')) {
              heroText = "Supercharge your Google Workspace";
            }

            const heroElement = document.querySelector('.hero h1, .hero-text, h1');
            if (heroElement && !heroElement.hasAttribute('data-ai-optimized')) {
              heroElement.setAttribute('data-ai-optimized', 'true');
              heroElement.setAttribute('data-original', heroElement.textContent);
              heroElement.textContent = heroText;
            }
          }

          optimizeCTA() {
            const ctaButton = document.querySelector('.cta-button, .btn-primary, button');
            if (ctaButton && this.userProfile.returning && !ctaButton.hasAttribute('data-ai-optimized')) {
              ctaButton.setAttribute('data-ai-optimized', 'true');
              ctaButton.textContent = 'Continue with Gemini →';
            }
          }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => new AIOptimizer());
        } else {
          new AIOptimizer();
        }
      })();
    </script>
`;

  const bodyCloseIndex = content.lastIndexOf('</body>');
  if (bodyCloseIndex === -1) {
    throw new Error('Could not find </body> tag');
  }

  const newContent = content.slice(0, bodyCloseIndex) +
                     aiScript +
                     content.slice(bodyCloseIndex);

  fs.writeFileSync(pagePath, newContent, 'utf8');
}

/**
 * Scale Voice Interface
 */
async function scaleVoiceInterface() {
  console.log('\n🎙️  Scaling Voice Interface...\n');

  const pattern = config.patterns.voice_interface;
  let applied = 0;
  let skipped = 0;

  for (const page of pattern.target_pages) {
    const pagePath = path.join(config.project_root, page);

    if (!fs.existsSync(pagePath)) {
      console.log(`⚠️  ${page} - File not found, skipping`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(pagePath, 'utf8');
    if (content.includes('voice-trigger') || content.includes('SpeechRecognition')) {
      console.log(`⏭️  ${page} - Already has Voice Interface, skipping`);
      skipped++;
      continue;
    }

    try {
      applyVoiceInterfacePattern(pagePath, content);
      console.log(`✅ ${page} - Voice Interface applied successfully`);
      applied++;
      if (!report.pages_modified.includes(page)) {
        report.pages_modified.push(page);
      }
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
      report.errors.push({ page, pattern: 'voice_interface', error: error.message });
      skipped++;
    }
  }

  console.log(`\n   Applied: ${applied} | Skipped: ${skipped}`);

  report.patterns_scaled.push({
    name: pattern.name,
    applied,
    skipped,
    revenue_impact: applied * pattern.annual_revenue_per_page
  });

  report.total_pattern_applications += applied;
  report.expected_annual_revenue += applied * pattern.annual_revenue_per_page;
}

/**
 * Apply Voice Interface pattern
 */
function applyVoiceInterfacePattern(pagePath, content) {
  // Voice interface HTML + CSS + JS (simplified version)
  const voiceCode = `
    <style>
      .voice-trigger {
        position: fixed;
        bottom: 80px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ea4335 0%, #fbbc04 100%);
        border: none;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(234, 67, 53, 0.3);
        z-index: 999;
        transition: all 0.3s ease;
      }

      .voice-trigger:hover {
        transform: scale(1.1);
      }
    </style>

    <button class="voice-trigger" title="Voice Command" onclick="alert('Voice interface demo - say \\'Try Gemini\\'')">🎤</button>

    <script>
      // Wave 4: Voice Interface (basic implementation)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        const button = document.querySelector('.voice-trigger');

        button.onclick = () => {
          recognition.start();
        };

        recognition.onresult = (event) => {
          const command = event.results[0][0].transcript.toLowerCase();
          if (command.includes('try gemini') || command.includes('sign up')) {
            window.open('https://gemini.google.com', '_blank');
          }
        };
      }
    </script>
`;

  const bodyCloseIndex = content.lastIndexOf('</body>');
  if (bodyCloseIndex === -1) {
    throw new Error('Could not find </body> tag');
  }

  const newContent = content.slice(0, bodyCloseIndex) +
                     voiceCode +
                     content.slice(bodyCloseIndex);

  fs.writeFileSync(pagePath, newContent, 'utf8');
}

/**
 * Scale AR/VR Previews
 */
async function scaleARVR() {
  console.log('\n🥽 Scaling AR/VR Previews...\n');

  const pattern = config.patterns.ar_vr_preview;
  let applied = 0;
  let skipped = 0;

  for (const page of pattern.target_pages) {
    const pagePath = path.join(config.project_root, page);

    if (!fs.existsSync(pagePath)) {
      console.log(`⚠️  ${page} - File not found, skipping`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(pagePath, 'utf8');
    if (content.includes('ar-vr-section') || content.includes('ar-button')) {
      console.log(`⏭️  ${page} - Already has AR/VR, skipping`);
      skipped++;
      continue;
    }

    try {
      applyARVRPattern(pagePath, content);
      console.log(`✅ ${page} - AR/VR Preview applied successfully`);
      applied++;
      if (!report.pages_modified.includes(page)) {
        report.pages_modified.push(page);
      }
    } catch (error) {
      console.log(`❌ ${page} - Error: ${error.message}`);
      report.errors.push({ page, pattern: 'ar_vr_preview', error: error.message });
      skipped++;
    }
  }

  console.log(`\n   Applied: ${applied} | Skipped: ${skipped}`);

  report.patterns_scaled.push({
    name: pattern.name,
    applied,
    skipped,
    revenue_impact: applied * pattern.annual_revenue_per_page
  });

  report.total_pattern_applications += applied;
  report.expected_annual_revenue += applied * pattern.annual_revenue_per_page;
}

/**
 * Apply AR/VR pattern
 */
function applyARVRPattern(pagePath, content) {
  const arvrHTML = `
    <style>
      .ar-vr-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 60px 24px;
        text-align: center;
        margin: 48px 0;
        border-radius: 24px;
      }

      .ar-button {
        background: white;
        color: #667eea;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        margin: 12px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }
    </style>

    <div class="ar-vr-section">
      <h2 style="font-size: 36px; margin-bottom: 16px;">Experience Gemini in 3D</h2>
      <p style="font-size: 18px; opacity: 0.9; margin-bottom: 24px;">
        See how Gemini transforms your workspace
      </p>

      <button class="ar-button" onclick="alert('AR experience launching... (Demo mode)')">
        📱 View in Your Space (AR)
      </button>

      <button class="ar-button" onclick="alert('VR demo launching... (Demo mode)')">
        🥽 Launch VR Demo
      </button>
    </div>
`;

  const bodyCloseIndex = content.lastIndexOf('</body>');
  if (bodyCloseIndex === -1) {
    throw new Error('Could not find </body> tag');
  }

  const newContent = content.slice(0, bodyCloseIndex) +
                     arvrHTML +
                     content.slice(bodyCloseIndex);

  fs.writeFileSync(pagePath, newContent, 'utf8');
}

/**
 * Generate console report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('WAVE 4 SCALING REPORT');
  console.log('='.repeat(80));

  report.patterns_scaled.forEach(pattern => {
    console.log(`\n${pattern.name}:`);
    console.log(`  Applied: ${pattern.applied} pages`);
    console.log(`  Skipped: ${pattern.skipped} pages`);
    console.log(`  Revenue Impact: $${pattern.revenue_impact.toLocaleString()}`);
  });

  console.log('\n' + '-'.repeat(80));
  console.log(`Total Pattern Applications: ${report.total_pattern_applications}`);
  console.log(`Total Pages Modified: ${report.pages_modified.length}`);
  console.log(`Expected Annual Revenue: $${report.expected_annual_revenue.toLocaleString()}`);

  if (report.errors.length > 0) {
    console.log(`\nErrors: ${report.errors.length}`);
    report.errors.forEach(err => {
      console.log(`  - ${err.page} (${err.pattern}): ${err.error}`);
    });
  }
}

/**
 * Save report to file
 */
function saveReport() {
  const reportPath = path.join(config.project_root, 'reports/wave4/scaling-report.json');
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
