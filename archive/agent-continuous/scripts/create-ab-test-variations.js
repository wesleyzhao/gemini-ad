#!/usr/bin/env node

/**
 * A/B Test Variation Creator
 *
 * Creates and manages A/B test variations for pattern optimization:
 * - Generates variations of existing patterns
 * - Creates test configurations
 * - Manages variation assignments
 * - Tracks test status
 * - Prepares for statistical analysis
 *
 * Usage:
 *   node scripts/create-ab-test-variations.js
 *   node scripts/create-ab-test-variations.js --pattern="Call to Action"
 *   node scripts/create-ab-test-variations.js --page="index.html"
 *   node scripts/create-ab-test-variations.js --variations=3
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  reportsDir: path.join(__dirname, '..', 'reports', 'ab-tests'),
  iterationsDir: path.join(__dirname, '..', 'reports', 'iterations'),
  pagesDir: path.join(__dirname, '..'),
  patternLibraryFile: path.join(__dirname, '..', 'reports', 'iterations', 'pattern-library.json'),
  testsFile: path.join(__dirname, '..', 'reports', 'ab-tests', 'active-tests.json'),
  variationsDir: path.join(__dirname, '..', 'reports', 'ab-tests', 'variations'),
  defaultVariations: 2, // Control + 1 variation by default
  minSampleSize: 100, // Minimum visits per variation for statistical significance
  confidenceLevel: 0.95 // 95% confidence level
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  pattern: args.find(arg => arg.startsWith('--pattern='))?.split('=')[1],
  page: args.find(arg => arg.startsWith('--page='))?.split('=')[1],
  variations: parseInt(args.find(arg => arg.startsWith('--variations='))?.split('=')[1]) || CONFIG.defaultVariations,
  explore: args.includes('--explore'),
};

/**
 * Ensure required directories exist
 */
function ensureDirectories() {
  [CONFIG.reportsDir, CONFIG.variationsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Load pattern library
 */
function loadPatternLibrary() {
  if (!fs.existsSync(CONFIG.patternLibraryFile)) {
    return { patterns: [] };
  }
  return JSON.parse(fs.readFileSync(CONFIG.patternLibraryFile, 'utf8'));
}

/**
 * Load active tests
 */
function loadActiveTests() {
  if (!fs.existsSync(CONFIG.testsFile)) {
    return {
      tests: [],
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    };
  }
  return JSON.parse(fs.readFileSync(CONFIG.testsFile, 'utf8'));
}

/**
 * Save active tests
 */
function saveActiveTests(tests) {
  tests.metadata.updated = new Date().toISOString();
  fs.writeFileSync(CONFIG.testsFile, JSON.stringify(tests, null, 2));
}

/**
 * Get production patterns eligible for A/B testing
 */
function getTestEligiblePatterns(library) {
  // Production patterns with moderate to high success rates are good candidates
  return library.patterns.filter(p =>
    p.status === 'production' &&
    p.stats &&
    p.stats.applications >= 3 &&
    p.stats.successRate >= 50
  );
}

/**
 * Generate pattern variations
 */
function generatePatternVariations(pattern, numVariations) {
  const variations = [
    {
      id: 'control',
      name: `${pattern.name} (Control)`,
      description: pattern.description,
      type: 'control',
      modifications: null,
      hypothesis: 'Baseline performance',
      expectedImpact: pattern.impact?.expectedImprovement || 10
    }
  ];

  // Generate test variations based on pattern category
  const variationStrategies = getVariationStrategies(pattern);

  for (let i = 0; i < numVariations - 1; i++) {
    if (i < variationStrategies.length) {
      variations.push({
        id: `variation_${i + 1}`,
        name: `${pattern.name} (Variation ${i + 1})`,
        description: variationStrategies[i].description,
        type: 'variation',
        modifications: variationStrategies[i].modifications,
        hypothesis: variationStrategies[i].hypothesis,
        expectedImpact: variationStrategies[i].expectedImpact
      });
    }
  }

  return variations;
}

/**
 * Get variation strategies based on pattern category
 */
function getVariationStrategies(pattern) {
  const strategies = [];

  // Common variation strategies by category
  const categoryStrategies = {
    'Call to Action': [
      {
        description: 'More urgent CTA language with scarcity',
        modifications: {
          ctaText: 'enhanced_urgency',
          colorContrast: 'increased',
          buttonSize: 'larger'
        },
        hypothesis: 'Urgency and scarcity will increase conversion',
        expectedImpact: 15
      },
      {
        description: 'Softer CTA language with value proposition',
        modifications: {
          ctaText: 'value_focused',
          ctaPlacement: 'above_fold',
          secondaryCta: 'added'
        },
        hypothesis: 'Value-focused messaging will improve quality of conversions',
        expectedImpact: 12
      }
    ],
    'Visual Hierarchy': [
      {
        description: 'Enhanced contrast and spacing',
        modifications: {
          contrast: 'increased',
          spacing: 'expanded',
          fontSize: 'larger_headings'
        },
        hypothesis: 'Better visual hierarchy will improve engagement',
        expectedImpact: 10
      },
      {
        description: 'Simplified layout with focus on key elements',
        modifications: {
          layout: 'simplified',
          elements: 'reduced',
          whitespace: 'increased'
        },
        hypothesis: 'Reduced complexity will improve comprehension',
        expectedImpact: 8
      }
    ],
    'Content Structure': [
      {
        description: 'Bullet points instead of paragraphs',
        modifications: {
          format: 'bullet_points',
          scanability: 'enhanced',
          headings: 'more_frequent'
        },
        hypothesis: 'Scannable content will improve engagement',
        expectedImpact: 12
      },
      {
        description: 'Shorter paragraphs with more headings',
        modifications: {
          paragraphLength: 'reduced',
          headings: 'increased',
          summaries: 'added'
        },
        hypothesis: 'Bite-sized content will improve retention',
        expectedImpact: 10
      }
    ],
    'Social Proof': [
      {
        description: 'Prominent testimonials with photos',
        modifications: {
          testimonials: 'with_photos',
          placement: 'above_fold',
          quantity: 'increased'
        },
        hypothesis: 'Visual social proof will increase trust',
        expectedImpact: 14
      },
      {
        description: 'Statistics and user counts',
        modifications: {
          stats: 'highlighted',
          userCount: 'displayed',
          recentActivity: 'shown'
        },
        hypothesis: 'Quantified social proof will drive conversions',
        expectedImpact: 13
      }
    ]
  };

  // Get strategies for this pattern's category
  const category = pattern.category || 'General';
  if (categoryStrategies[category]) {
    strategies.push(...categoryStrategies[category]);
  }

  // Generic variations if no category-specific ones exist
  if (strategies.length === 0) {
    strategies.push(
      {
        description: 'Enhanced version with stronger emphasis',
        modifications: {
          emphasis: 'increased',
          visibility: 'enhanced'
        },
        hypothesis: 'Stronger emphasis will improve effectiveness',
        expectedImpact: 12
      },
      {
        description: 'Subtle version with lighter touch',
        modifications: {
          emphasis: 'reduced',
          integration: 'smoother'
        },
        hypothesis: 'Subtle approach will improve user experience',
        expectedImpact: 8
      }
    );
  }

  return strategies;
}

/**
 * Create A/B test configuration
 */
function createTestConfig(pattern, variations, pages) {
  const testId = `test_${pattern.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

  return {
    id: testId,
    patternName: pattern.name,
    patternCategory: pattern.category || 'General',
    status: 'active',
    created: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: null,
    targetPages: pages,
    variations: variations,
    allocation: {
      // Equal split between variations
      ...Object.fromEntries(
        variations.map(v => [v.id, 100 / variations.length])
      )
    },
    metrics: {
      primaryMetric: 'ux_score',
      secondaryMetrics: ['engagement', 'bounce_rate', 'time_on_page']
    },
    sampleSize: {
      target: CONFIG.minSampleSize * variations.length,
      current: 0,
      perVariation: Object.fromEntries(
        variations.map(v => [v.id, 0])
      )
    },
    results: {
      winner: null,
      confidence: null,
      liftOverControl: null,
      statisticalSignificance: false
    },
    notes: `A/B test for ${pattern.name} pattern. Testing ${variations.length} variations to optimize performance.`
  };
}

/**
 * Get pages eligible for testing
 */
function getPagesForTest(pattern) {
  const pages = [];
  const htmlFiles = fs.readdirSync(CONFIG.pagesDir)
    .filter(f => f.endsWith('.html') && !f.includes('test-') && f !== 'index.html');

  // For now, include all production pages
  // In a real system, this would filter based on where the pattern is applied
  htmlFiles.forEach(file => {
    pages.push({
      file: file,
      assigned: true,
      variationAssignment: 'random' // Random assignment in production
    });
  });

  return pages.slice(0, 5); // Limit to 5 pages per test for manageability
}

/**
 * Generate test documentation
 */
function generateTestDocumentation(testConfig) {
  let doc = `# A/B Test: ${testConfig.patternName}\n\n`;
  doc += `**Test ID:** ${testConfig.id}\n`;
  doc += `**Status:** ${testConfig.status}\n`;
  doc += `**Created:** ${testConfig.created}\n`;
  doc += `**Pattern Category:** ${testConfig.patternCategory}\n\n`;

  doc += `## Objective\n\n`;
  doc += `Test variations of the "${testConfig.patternName}" pattern to identify the most effective implementation.\n\n`;

  doc += `## Variations\n\n`;
  testConfig.variations.forEach((variation, idx) => {
    doc += `### ${idx + 1}. ${variation.name} (${variation.id})\n\n`;
    doc += `- **Type:** ${variation.type}\n`;
    doc += `- **Description:** ${variation.description}\n`;
    doc += `- **Hypothesis:** ${variation.hypothesis}\n`;
    doc += `- **Expected Impact:** +${variation.expectedImpact} points\n`;
    doc += `- **Traffic Allocation:** ${testConfig.allocation[variation.id].toFixed(1)}%\n`;

    if (variation.modifications) {
      doc += `\n**Modifications:**\n`;
      Object.entries(variation.modifications).forEach(([key, value]) => {
        doc += `- ${key}: ${value}\n`;
      });
    }
    doc += `\n`;
  });

  doc += `## Target Pages\n\n`;
  testConfig.targetPages.forEach(page => {
    doc += `- ${page.file}\n`;
  });

  doc += `\n## Metrics\n\n`;
  doc += `**Primary Metric:** ${testConfig.metrics.primaryMetric}\n\n`;
  doc += `**Secondary Metrics:**\n`;
  testConfig.metrics.secondaryMetrics.forEach(metric => {
    doc += `- ${metric}\n`;
  });

  doc += `\n## Sample Size\n\n`;
  doc += `- **Target Sample Size:** ${testConfig.sampleSize.target} total visits\n`;
  doc += `- **Per Variation:** ~${Math.floor(testConfig.sampleSize.target / testConfig.variations.length)} visits\n`;
  doc += `- **Confidence Level:** ${(CONFIG.confidenceLevel * 100).toFixed(0)}%\n\n`;

  doc += `## Statistical Approach\n\n`;
  doc += `- **Test Type:** Multi-variant test\n`;
  doc += `- **Significance Level:** ${(1 - CONFIG.confidenceLevel).toFixed(2)}\n`;
  doc += `- **Minimum Detectable Effect:** 5% relative improvement\n`;
  doc += `- **Analysis Method:** Bayesian A/B testing with sequential analysis\n\n`;

  doc += `## Success Criteria\n\n`;
  doc += `A variation will be declared winner if:\n`;
  doc += `1. Statistical significance is achieved (p < 0.05)\n`;
  doc += `2. Minimum sample size is reached\n`;
  doc += `3. Improvement over control is meaningful (>5%)\n`;
  doc += `4. Results are consistent across secondary metrics\n\n`;

  doc += `## Timeline\n\n`;
  doc += `- **Start Date:** ${testConfig.startDate}\n`;
  doc += `- **Expected Duration:** 2-4 weeks (depending on traffic)\n`;
  doc += `- **Review Frequency:** Weekly\n\n`;

  doc += `## Next Steps\n\n`;
  doc += `1. Deploy variations to target pages\n`;
  doc += `2. Monitor traffic distribution\n`;
  doc += `3. Collect performance data\n`;
  doc += `4. Analyze results weekly\n`;
  doc += `5. Declare winner when criteria met\n`;
  doc += `6. Scale winning variation\n\n`;

  return doc;
}

/**
 * Create test variations
 */
function createTestVariations(pattern, numVariations) {
  console.log(`\n📊 Creating A/B test for: ${pattern.name}`);

  // Generate variations
  const variations = generatePatternVariations(pattern, numVariations);
  console.log(`   Generated ${variations.length} variations (including control)`);

  // Get target pages
  const pages = getPagesForTest(pattern);
  console.log(`   Target pages: ${pages.length}`);

  // Create test configuration
  const testConfig = createTestConfig(pattern, variations, pages);

  // Generate documentation
  const documentation = generateTestDocumentation(testConfig);

  // Save variation details
  const variationFile = path.join(CONFIG.variationsDir, `${testConfig.id}.json`);
  fs.writeFileSync(variationFile, JSON.stringify(testConfig, null, 2));

  // Save documentation
  const docFile = path.join(CONFIG.variationsDir, `${testConfig.id}.md`);
  fs.writeFileSync(docFile, documentation);

  console.log(`   ✅ Test configuration saved: ${variationFile}`);
  console.log(`   ✅ Documentation saved: ${docFile}`);

  return testConfig;
}

/**
 * Generate exploratory pattern categories
 * Creates new pattern categories to test when existing patterns have stagnated
 */
function generateExploratoryPatterns() {
  const exploratoryPatterns = [
    {
      name: 'Social Proof',
      category: 'trust_building',
      description: 'Add user testimonials, ratings, and social validation',
      hypothesis: 'Social proof increases trust and conversion',
      expectedImpact: 12,
      implementations: [
        {
          element: 'testimonials',
          placement: 'above_cta',
          variations: ['customer_quotes', 'star_ratings', 'usage_stats']
        },
        {
          element: 'trust_badges',
          placement: 'footer',
          variations: ['security_badges', 'partner_logos', 'certification_seals']
        }
      ]
    },
    {
      name: 'Interactive Elements',
      category: 'engagement',
      description: 'Add interactive demos, calculators, or configurators',
      hypothesis: 'Interactivity increases engagement and understanding',
      expectedImpact: 15,
      implementations: [
        {
          element: 'interactive_demo',
          placement: 'hero_section',
          variations: ['product_tour', 'roi_calculator', 'feature_configurator']
        },
        {
          element: 'hover_effects',
          placement: 'feature_cards',
          variations: ['card_flip', 'reveal_details', 'animated_icons']
        }
      ]
    },
    {
      name: 'Scarcity & Urgency',
      category: 'psychological_triggers',
      description: 'Time-limited offers, limited availability messaging',
      hypothesis: 'Scarcity drives faster decision-making',
      expectedImpact: 18,
      implementations: [
        {
          element: 'countdown_timer',
          placement: 'above_cta',
          variations: ['time_limited', 'spots_remaining', 'early_bird']
        },
        {
          element: 'urgency_text',
          placement: 'near_cta',
          variations: ['limited_time', 'exclusive_access', 'beta_slots']
        }
      ]
    },
    {
      name: 'Value Proposition',
      category: 'messaging',
      description: 'Clearer, benefit-focused messaging',
      hypothesis: 'Clear value proposition improves conversion',
      expectedImpact: 14,
      implementations: [
        {
          element: 'headline',
          placement: 'hero',
          variations: ['outcome_focused', 'problem_solution', 'benefit_driven']
        },
        {
          element: 'subheadline',
          placement: 'below_hero',
          variations: ['specificity', 'quantified_benefits', 'emotional_appeal']
        }
      ]
    },
    {
      name: 'Progressive Disclosure',
      category: 'information_architecture',
      description: 'Reveal information progressively to reduce cognitive load',
      hypothesis: 'Progressive disclosure improves comprehension and reduces bounce',
      expectedImpact: 11,
      implementations: [
        {
          element: 'expandable_sections',
          placement: 'feature_details',
          variations: ['accordion', 'tabs', 'read_more']
        },
        {
          element: 'layered_content',
          placement: 'product_info',
          variations: ['quick_overview', 'detailed_specs', 'comparison_mode']
        }
      ]
    },
    {
      name: 'Personalization',
      category: 'relevance',
      description: 'Personalized content based on user segment or behavior',
      hypothesis: 'Personalized experiences increase relevance and conversion',
      expectedImpact: 20,
      implementations: [
        {
          element: 'dynamic_hero',
          placement: 'hero_section',
          variations: ['segment_specific', 'use_case_based', 'role_targeted']
        },
        {
          element: 'dynamic_cta',
          placement: 'cta_button',
          variations: ['personalized_text', 'segment_offer', 'journey_stage']
        }
      ]
    },
    {
      name: 'Multimedia Content',
      category: 'engagement',
      description: 'Video demonstrations, animations, or interactive media',
      hypothesis: 'Rich media increases engagement and understanding',
      expectedImpact: 16,
      implementations: [
        {
          element: 'video_demo',
          placement: 'hero_or_features',
          variations: ['explainer_video', 'product_demo', 'customer_story']
        },
        {
          element: 'animations',
          placement: 'feature_showcase',
          variations: ['scroll_triggered', 'hover_activated', 'auto_play']
        }
      ]
    },
    {
      name: 'Risk Reversal',
      category: 'trust_building',
      description: 'Money-back guarantees, free trials, no commitment messaging',
      hypothesis: 'Reducing perceived risk increases conversion',
      expectedImpact: 13,
      implementations: [
        {
          element: 'guarantee_badge',
          placement: 'near_cta',
          variations: ['money_back', 'satisfaction_guaranteed', 'risk_free']
        },
        {
          element: 'trial_messaging',
          placement: 'cta_area',
          variations: ['free_trial', 'no_credit_card', 'cancel_anytime']
        }
      ]
    }
  ];

  return exploratoryPatterns;
}

/**
 * Create exploratory pattern tests
 */
function createExploratoryTests(numPatterns = 3) {
  console.log('\n🔬 Exploratory Pattern Discovery Mode\n');
  console.log('💡 Generating new pattern categories to break stagnation...\n');

  const exploratoryPatterns = generateExploratoryPatterns();

  // Prioritize by expected impact
  const sortedPatterns = exploratoryPatterns.sort((a, b) => b.expectedImpact - a.expectedImpact);

  // Select top N patterns
  const selectedPatterns = sortedPatterns.slice(0, numPatterns);

  console.log(`📋 Top ${numPatterns} exploratory patterns selected:\n`);
  selectedPatterns.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.name} (${p.category})`);
    console.log(`   Impact: ${p.expectedImpact}% | ${p.description}`);
  });

  return selectedPatterns;
}

/**
 * Main function
 */
async function main() {
  console.log('🧪 A/B Test Variation Creator\n');

  ensureDirectories();

  // Load pattern library
  const library = loadPatternLibrary();
  const activeTests = loadActiveTests();

  // Handle exploratory mode
  if (options.explore) {
    console.log('🔬 EXPLORATORY MODE ACTIVATED\n');
    console.log('⚠️  Stagnation detected - shifting to exploratory pattern discovery\n');

    const exploratoryPatterns = createExploratoryTests(3);

    // Save exploratory patterns to library for tracking
    const exploratoryReport = {
      timestamp: new Date().toISOString(),
      mode: 'exploratory',
      trigger: 'stagnation_detected',
      patterns: exploratoryPatterns,
      nextSteps: [
        'Manually implement exploratory patterns on test pages',
        'Monitor performance for 2-3 cycles',
        'Compare against baseline metrics',
        'Identify which patterns break stagnation',
        'Add successful patterns to pattern library'
      ]
    };

    const reportPath = path.join(CONFIG.reportsDir, 'exploratory-patterns-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(exploratoryReport, null, 2));

    // Generate markdown report
    let markdown = `# Exploratory Pattern Discovery Report\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n`;
    markdown += `**Trigger:** Stagnation detected in optimization cycles\n`;
    markdown += `**Mode:** Exploratory pattern discovery\n\n`;

    markdown += `## Selected Exploratory Patterns\n\n`;
    exploratoryPatterns.forEach((p, idx) => {
      markdown += `### ${idx + 1}. ${p.name}\n\n`;
      markdown += `- **Category:** ${p.category}\n`;
      markdown += `- **Expected Impact:** ${p.expectedImpact}%\n`;
      markdown += `- **Hypothesis:** ${p.hypothesis}\n`;
      markdown += `- **Description:** ${p.description}\n\n`;
      markdown += `**Implementation Options:**\n\n`;
      p.implementations.forEach(impl => {
        markdown += `- **${impl.element}** (${impl.placement})\n`;
        markdown += `  - Variations: ${impl.variations.join(', ')}\n`;
      });
      markdown += `\n`;
    });

    markdown += `## Next Steps\n\n`;
    markdown += `1. Review exploratory patterns above\n`;
    markdown += `2. Select 1-2 patterns to implement first\n`;
    markdown += `3. Create test variations on low-traffic pages\n`;
    markdown += `4. Monitor performance for 2-3 optimization cycles\n`;
    markdown += `5. Compare results against current baseline (78.5/95)\n`;
    markdown += `6. Identify patterns that successfully break stagnation\n`;
    markdown += `7. Add successful patterns to pattern library\n`;
    markdown += `8. Scale winning patterns across other pages\n\n`;

    markdown += `## Success Criteria\n\n`;
    markdown += `- Velocity improves from 0.18 pts/cycle to >0.5 pts/cycle\n`;
    markdown += `- At least 1 pattern shows >10% improvement\n`;
    markdown += `- No regression in existing metrics\n`;
    markdown += `- New pattern category added to library\n\n`;

    const markdownPath = path.join(CONFIG.reportsDir, 'exploratory-patterns-report.md');
    fs.writeFileSync(markdownPath, markdown);

    console.log(`\n✅ Exploratory pattern discovery complete!\n`);
    console.log(`📊 Patterns generated: ${exploratoryPatterns.length}`);
    console.log(`📄 Report: ${markdownPath}`);
    console.log(`📁 JSON: ${reportPath}\n`);
    console.log(`💡 Next: Review patterns and implement top 1-2 on test pages\n`);

    return;
  }

  // Normal mode: Get eligible patterns from library
  let eligiblePatterns = getTestEligiblePatterns(library);

  // Filter by pattern name if specified
  if (options.pattern) {
    eligiblePatterns = eligiblePatterns.filter(p =>
      p.name.toLowerCase().includes(options.pattern.toLowerCase())
    );
  }

  if (eligiblePatterns.length === 0) {
    console.log('❌ No eligible patterns found for A/B testing');
    console.log('   Patterns must be in production with ≥3 applications and ≥50% success rate');
    console.log('\n💡 Tip: Use --explore flag to generate new exploratory patterns');
    return;
  }

  console.log(`📋 Found ${eligiblePatterns.length} eligible patterns for A/B testing\n`);

  // Create tests for eligible patterns
  const newTests = [];
  for (const pattern of eligiblePatterns.slice(0, 3)) { // Limit to 3 tests at a time
    const testConfig = createTestVariations(pattern, options.variations);
    newTests.push(testConfig);
  }

  // Add to active tests
  activeTests.tests.push(...newTests);
  saveActiveTests(activeTests);

  // Generate summary report
  let summary = `# A/B Test Creation Summary\n\n`;
  summary += `**Date:** ${new Date().toISOString()}\n`;
  summary += `**Tests Created:** ${newTests.length}\n`;
  summary += `**Total Active Tests:** ${activeTests.tests.filter(t => t.status === 'active').length}\n\n`;

  summary += `## Created Tests\n\n`;
  newTests.forEach((test, idx) => {
    summary += `${idx + 1}. **${test.patternName}** (${test.id})\n`;
    summary += `   - Variations: ${test.variations.length}\n`;
    summary += `   - Target Pages: ${test.targetPages.length}\n`;
    summary += `   - Sample Size Target: ${test.sampleSize.target}\n`;
    summary += `   - Documentation: \`${test.id}.md\`\n\n`;
  });

  summary += `## Next Steps\n\n`;
  summary += `1. Review test configurations in \`reports/ab-tests/variations/\`\n`;
  summary += `2. Deploy variations (manual step - requires implementation)\n`;
  summary += `3. Monitor test progress with \`node scripts/analyze-ab-test-results.js\`\n`;
  summary += `4. Review results weekly\n`;
  summary += `5. Scale winning variations when statistical significance is achieved\n`;

  const summaryFile = path.join(CONFIG.reportsDir, 'test-creation-summary.md');
  fs.writeFileSync(summaryFile, summary);

  console.log(`\n✅ A/B test creation complete!\n`);
  console.log(`📊 Tests created: ${newTests.length}`);
  console.log(`📁 Configurations saved to: ${CONFIG.variationsDir}`);
  console.log(`📄 Summary: ${summaryFile}\n`);

  console.log(`💡 Next: Deploy variations and run \`node scripts/analyze-ab-test-results.js\` to track results`);
}

// Run
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

// Export for testing
module.exports = {
  loadPatternLibrary,
  getTestEligiblePatterns,
  generatePatternVariations,
  createTestConfig,
  getPagesForTest
};
