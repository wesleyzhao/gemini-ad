/**
 * A/B Testing Router for Gemini Landing Pages
 *
 * This script manages client-side A/B test traffic splitting for GitHub Pages deployment.
 * It uses localStorage to ensure consistent variant assignment for returning visitors.
 *
 * Usage: Add this script to the <head> of control pages to enable A/B testing.
 *
 * @version 1.0.0
 * @date 2026-02-01
 */

(function() {
  'use strict';

  /**
   * A/B Test Configuration
   * Define your tests here with page mappings and split ratios
   */
  const AB_TESTS = {
    'apple-style': {
      name: 'Content Richness Test',
      controlPage: '/pages/apple-style.html',
      variationPage: '/pages/apple-style-variation-b.html',
      splitRatio: 0.5, // 50/50 split
      active: true
    },
    'productivity': {
      name: 'Emotional Appeal Test',
      controlPage: '/pages/productivity.html',
      variationPage: '/pages/productivity-variation-b.html',
      splitRatio: 0.5,
      active: true // ✅ Variation B created - Ready to test
    },
    'trust': {
      name: 'Competitive Positioning Test',
      controlPage: '/pages/trust.html',
      variationPage: '/pages/trust-variation-b.html',
      splitRatio: 0.5,
      active: true // ✅ Variation B created - Ready to test
    },
    'writers': {
      name: 'Outcome Focus Test',
      controlPage: '/pages/writers.html',
      variationPage: '/pages/writers-variation-b.html',
      splitRatio: 0.5,
      active: true // ✅ Variation B created - Ready to test
    },
    'creators': {
      name: 'Design Minimalism Test',
      controlPage: '/pages/creators.html',
      variationPage: '/pages/creators-variation-b.html',
      splitRatio: 0.5,
      active: true // ✅ Variation B created - Ready to test
    },
    'operators': {
      name: 'Time Savings Test',
      controlPage: '/pages/operators.html',
      variationPage: '/pages/operators-variation-b.html',
      splitRatio: 0.5,
      active: true // ✅ Variation B created - Ready to test
    }
  };

  /**
   * Get the current test configuration based on URL
   */
  function getCurrentTest() {
    const currentPath = window.location.pathname;

    for (const testId in AB_TESTS) {
      const test = AB_TESTS[testId];
      if (test.active && (currentPath.includes(test.controlPage) || currentPath.includes(test.variationPage))) {
        return { id: testId, config: test };
      }
    }

    return null;
  }

  /**
   * Get or assign variant for a user
   * Uses localStorage to maintain consistent assignment
   */
  function getAssignedVariant(testId, splitRatio) {
    const storageKey = `ab-test-${testId}`;
    let variant = localStorage.getItem(storageKey);

    if (!variant) {
      // New visitor - assign variant based on split ratio
      variant = Math.random() < splitRatio ? 'A' : 'B';
      localStorage.setItem(storageKey, variant);

      // Track assignment event if GA4 is available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ab_test_assigned', {
          'test_id': testId,
          'variant': variant,
          'timestamp': new Date().toISOString()
        });
      }
    }

    return variant;
  }

  /**
   * Redirect to appropriate variant if needed
   */
  function routeToVariant() {
    const test = getCurrentTest();

    if (!test) {
      // Not on an A/B test page
      return;
    }

    const { id, config } = test;
    const currentPath = window.location.pathname;
    const assignedVariant = getAssignedVariant(id, config.splitRatio);

    // Check if we need to redirect
    const isOnControl = currentPath.includes(config.controlPage);
    const isOnVariation = currentPath.includes(config.variationPage);
    const shouldBeOnVariation = assignedVariant === 'B';

    if (shouldBeOnVariation && isOnControl) {
      // Redirect from control to variation
      window.location.href = config.variationPage;
    } else if (!shouldBeOnVariation && isOnVariation) {
      // Redirect from variation to control (e.g., if manually visiting variation URL)
      window.location.href = config.controlPage;
    }

    // Track page view with variant info if GA4 is available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_variant': assignedVariant,
        'test_id': id,
        'test_name': config.name
      });
    }
  }

  /**
   * Enhanced CTA click tracking with variant information
   * Call this function on CTA button clicks
   */
  window.trackCTAClick = function(ctaLabel) {
    const test = getCurrentTest();

    if (!test) {
      // Not in a test, use standard tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'Conversion',
          'event_label': ctaLabel
        });
      }
      return;
    }

    const { id, config } = test;
    const variant = getAssignedVariant(id, config.splitRatio);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        'event_category': 'Conversion',
        'event_label': `${ctaLabel} - ${config.name} - Variant ${variant}`,
        'test_id': id,
        'variant': variant,
        'test_name': config.name
      });
    }

    // Also track as conversion event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'test_id': id,
        'variant': variant
      });
    }
  };

  /**
   * Get variant info for debugging
   * Usage: ABTest.getVariantInfo() in console
   */
  window.ABTest = {
    getVariantInfo: function() {
      const test = getCurrentTest();
      if (!test) {
        return 'Not on an A/B test page';
      }

      const { id, config } = test;
      const variant = getAssignedVariant(id, config.splitRatio);

      return {
        testId: id,
        testName: config.name,
        variant: variant,
        controlPage: config.controlPage,
        variationPage: config.variationPage,
        currentPage: window.location.pathname
      };
    },

    clearAssignment: function(testId) {
      if (testId) {
        localStorage.removeItem(`ab-test-${testId}`);
        console.log(`Cleared assignment for test: ${testId}`);
      } else {
        // Clear all test assignments
        for (const id in AB_TESTS) {
          localStorage.removeItem(`ab-test-${id}`);
        }
        console.log('Cleared all test assignments');
      }
      window.location.reload();
    },

    forceVariant: function(testId, variant) {
      if (!AB_TESTS[testId]) {
        console.error(`Test ${testId} not found`);
        return;
      }

      if (variant !== 'A' && variant !== 'B') {
        console.error('Variant must be "A" or "B"');
        return;
      }

      localStorage.setItem(`ab-test-${testId}`, variant);
      console.log(`Forced variant ${variant} for test: ${testId}`);
      window.location.reload();
    },

    getActiveTests: function() {
      const activeTests = {};
      for (const id in AB_TESTS) {
        if (AB_TESTS[id].active) {
          activeTests[id] = AB_TESTS[id];
        }
      }
      return activeTests;
    }
  };

  /**
   * URL parameter override for QA testing
   * Usage: ?variant=b or ?variant=a
   */
  function checkForceVariant() {
    const urlParams = new URLSearchParams(window.location.search);
    const forceVariant = urlParams.get('variant');

    if (forceVariant && (forceVariant.toUpperCase() === 'A' || forceVariant.toUpperCase() === 'B')) {
      const test = getCurrentTest();
      if (test) {
        const variant = forceVariant.toUpperCase();
        localStorage.setItem(`ab-test-${test.id}`, variant);
        console.log(`[A/B Test] Forced variant ${variant} via URL parameter`);
      }
    }
  }

  /**
   * Initialize A/B testing
   */
  function init() {
    // Check for URL parameter override first
    checkForceVariant();

    // Route to appropriate variant
    routeToVariant();

    // Log test info in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const test = getCurrentTest();
      if (test) {
        console.log('[A/B Test] Active test:', test.config.name);
        console.log('[A/B Test] Assigned variant:', getAssignedVariant(test.id, test.config.splitRatio));
        console.log('[A/B Test] Debug commands: ABTest.getVariantInfo(), ABTest.clearAssignment(), ABTest.forceVariant()');
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
