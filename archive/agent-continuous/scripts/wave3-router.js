/**
 * Wave 3 A/B Testing Router
 *
 * Routes users to Wave 3 test variants based on:
 * - Test assignment (50/50 split)
 * - User consistency (same user always sees same variant)
 * - Test configuration
 *
 * Feature #79: Wave 3 Implementation
 * Test Duration: 14 days
 * Launch Date: February 8, 2026
 */

(function() {
  'use strict';

  // Wave 3 Test Configuration
  const WAVE3_CONFIG = {
    enabled: true,
    startDate: '2026-02-08',
    endDate: '2026-02-22',

    tests: {
      'triple-threat': {
        name: 'Triple Threat Combo',
        enabled: true,
        trafficSplit: 0.5, // 50% control, 50% variant
        pages: ['trust', 'workspace', 'productivity'],
        description: 'Combines all three Wave 2 winners',
        expectedLift: 0.838 // +83.8%
      },
      'video-social': {
        name: 'Video + Social Proof',
        enabled: true,
        trafficSplit: 0.5,
        pages: ['apple-style', 'future', 'valentine'],
        description: 'Short-form videos with testimonial overlays',
        expectedLift: 0.70 // +70%
      },
      'ai-personalization': {
        name: 'AI Personalization',
        enabled: true,
        trafficSplit: 0.5,
        pages: ['research', 'comparison'],
        description: 'Dynamic content based on user context',
        expectedLift: 0.575 // +57.5%
      },
      'interactive-demos': {
        name: 'Interactive Demos',
        enabled: true,
        trafficSplit: 0.5,
        pages: ['workspace', 'productivity', 'automators'],
        description: 'Live product demos with real-time interaction',
        expectedLift: 0.65 // +65%
      }
    }
  };

  /**
   * Get or create user ID for consistent test assignment
   */
  function getUserId() {
    let userId = localStorage.getItem('wave3_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('wave3_user_id', userId);
    }
    return userId;
  }

  /**
   * Hash function for consistent assignment
   * Based on user ID + test name
   */
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Determine if user should see variant for a given test
   */
  function shouldShowVariant(testName, trafficSplit) {
    const userId = getUserId();
    const hashInput = userId + testName;
    const hash = hashCode(hashInput);
    const bucket = (hash % 100) / 100; // 0.00 to 0.99
    return bucket < trafficSplit;
  }

  /**
   * Check if current date is within test window
   */
  function isTestActive() {
    const now = new Date();
    const start = new Date(WAVE3_CONFIG.startDate);
    const end = new Date(WAVE3_CONFIG.endDate);
    return now >= start && now <= end;
  }

  /**
   * Get current page name from URL
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const pageName = filename.replace('.html', '');
    return pageName;
  }

  /**
   * Determine which test (if any) applies to current page
   */
  function getApplicableTest(pageName) {
    for (const [testKey, testConfig] of Object.entries(WAVE3_CONFIG.tests)) {
      if (!testConfig.enabled) continue;
      if (testConfig.pages.includes(pageName)) {
        return { key: testKey, config: testConfig };
      }
    }
    return null;
  }

  /**
   * Build variant URL
   */
  function getVariantUrl(testKey, pageName) {
    // Variants are in: wave3-variants/{test-key}/{page}.html
    const baseUrl = window.location.origin;
    const path = window.location.pathname.split('/').slice(0, -1).join('/');
    return `${baseUrl}${path}/../wave3-variants/${testKey}/${pageName}.html`;
  }

  /**
   * Track test assignment to GA4
   */
  function trackTestAssignment(testKey, testName, variant) {
    if (typeof gtag === 'function') {
      gtag('event', 'wave3_test_assignment', {
        test_key: testKey,
        test_name: testName,
        variant: variant, // 'control' or 'variant'
        user_id: getUserId(),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Store test assignment in session
   */
  function storeTestAssignment(testKey, variant) {
    const assignments = JSON.parse(sessionStorage.getItem('wave3_assignments') || '{}');
    assignments[testKey] = {
      variant: variant,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('wave3_assignments', JSON.stringify(assignments));
  }

  /**
   * Get stored test assignment (for consistency within session)
   */
  function getStoredAssignment(testKey) {
    const assignments = JSON.parse(sessionStorage.getItem('wave3_assignments') || '{}');
    return assignments[testKey] ? assignments[testKey].variant : null;
  }

  /**
   * Main router logic
   */
  function routeToVariant() {
    // Check if Wave 3 testing is enabled
    if (!WAVE3_CONFIG.enabled) {
      console.log('[Wave 3 Router] Testing disabled');
      return;
    }

    // Check if we're within test window
    if (!isTestActive()) {
      console.log('[Wave 3 Router] Test not active (outside date range)');
      return;
    }

    // Get current page
    const pageName = getCurrentPage();
    if (!pageName) {
      console.log('[Wave 3 Router] Could not determine page name');
      return;
    }

    // Check if there's a test for this page
    const applicableTest = getApplicableTest(pageName);
    if (!applicableTest) {
      console.log(`[Wave 3 Router] No test configured for page: ${pageName}`);
      return;
    }

    const { key: testKey, config: testConfig } = applicableTest;

    // Check for existing assignment (consistency within session)
    const storedVariant = getStoredAssignment(testKey);
    if (storedVariant) {
      console.log(`[Wave 3 Router] Using stored assignment: ${storedVariant}`);
      if (storedVariant === 'variant') {
        // Already on variant page, do nothing
        return;
      } else {
        // On control page, stay there
        return;
      }
    }

    // Determine assignment
    const showVariant = shouldShowVariant(testKey, testConfig.trafficSplit);
    const variant = showVariant ? 'variant' : 'control';

    // Store assignment
    storeTestAssignment(testKey, variant);

    // Track assignment
    trackTestAssignment(testKey, testConfig.name, variant);

    console.log(`[Wave 3 Router] Test: ${testConfig.name}, Variant: ${variant}`);

    // Redirect to variant if assigned
    if (showVariant) {
      const variantUrl = getVariantUrl(testKey, pageName);
      console.log(`[Wave 3 Router] Redirecting to: ${variantUrl}`);
      window.location.href = variantUrl;
    } else {
      console.log(`[Wave 3 Router] Showing control (current page)`);
    }
  }

  /**
   * Initialize router when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', routeToVariant);
  } else {
    routeToVariant();
  }

  /**
   * Expose utility functions for debugging
   */
  window.Wave3Router = {
    config: WAVE3_CONFIG,
    getUserId: getUserId,
    getCurrentAssignments: function() {
      return JSON.parse(sessionStorage.getItem('wave3_assignments') || '{}');
    },
    forceVariant: function(testKey) {
      storeTestAssignment(testKey, 'variant');
      location.reload();
    },
    forceControl: function(testKey) {
      storeTestAssignment(testKey, 'control');
      location.reload();
    },
    resetAssignments: function() {
      sessionStorage.removeItem('wave3_assignments');
      location.reload();
    },
    getApplicableTest: function() {
      const pageName = getCurrentPage();
      return getApplicableTest(pageName);
    }
  };

  console.log('[Wave 3 Router] Initialized');
  console.log('[Wave 3 Router] User ID:', getUserId());
  console.log('[Wave 3 Router] Debug: window.Wave3Router');

})();
