/**
 * Wave 2 A/B Test Router
 *
 * Manages routing for Wave 2 A/B tests:
 * - Social Proof + Personalization
 * - Scarcity + Trust Signals
 * - Mobile-Optimized Combo
 *
 * Traffic split: 25% Control, 25% each variant
 * Cookie-based persistence for consistent user experience
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    cookieName: 'gemini_wave2_variant',
    cookieExpireDays: 30,
    testDuration: 14, // days
    tests: [
      {
        name: 'social-proof',
        displayName: 'Social Proof + Personalization',
        weight: 0.25,
        pages: ['writers', 'creators', 'operators', 'automators']
      },
      {
        name: 'scarcity-trust',
        displayName: 'Scarcity + Trust Signals',
        weight: 0.25,
        pages: ['writers', 'creators', 'operators', 'automators']
      },
      {
        name: 'mobile-optimized',
        displayName: 'Mobile-Optimized Combo',
        weight: 0.25,
        pages: ['writers', 'creators', 'operators', 'automators'],
        mobileOnly: true
      },
      {
        name: 'control',
        displayName: 'Control (Original)',
        weight: 0.25,
        pages: ['writers', 'creators', 'operators', 'automators']
      }
    ]
  };

  // Cookie utilities
  const Cookie = {
    set(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    get(name) {
      const nameEQ = name + '=';
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length);
        }
      }
      return null;
    }
  };

  // Detect if user is on mobile
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  // Get current page name
  function getCurrentPage() {
    const path = window.location.pathname;
    const match = path.match(/\/([^/]+)\.html$/);
    return match ? match[1] : null;
  }

  // Assign user to a variant
  function assignVariant() {
    const mobile = isMobile();
    let eligibleTests = CONFIG.tests;

    // If on mobile, prioritize mobile-optimized test
    if (mobile) {
      // 50% control, 50% mobile-optimized for mobile users
      eligibleTests = [
        { ...CONFIG.tests.find(t => t.name === 'control'), weight: 0.5 },
        { ...CONFIG.tests.find(t => t.name === 'mobile-optimized'), weight: 0.5 }
      ];
    } else {
      // For desktop: 33% control, 33% social-proof, 33% scarcity-trust
      eligibleTests = [
        { ...CONFIG.tests.find(t => t.name === 'control'), weight: 0.33 },
        { ...CONFIG.tests.find(t => t.name === 'social-proof'), weight: 0.33 },
        { ...CONFIG.tests.find(t => t.name === 'scarcity-trust'), weight: 0.34 }
      ];
    }

    // Weighted random selection
    const random = Math.random();
    let cumulative = 0;

    for (const test of eligibleTests) {
      cumulative += test.weight;
      if (random < cumulative) {
        return test.name;
      }
    }

    return 'control';
  }

  // Get or create user's variant assignment
  function getVariant() {
    let variant = Cookie.get(CONFIG.cookieName);

    if (!variant) {
      variant = assignVariant();
      Cookie.set(CONFIG.cookieName, variant, CONFIG.cookieExpireDays);

      // Track assignment event
      trackEvent('wave2_variant_assigned', {
        variant,
        isMobile: isMobile(),
        page: getCurrentPage()
      });
    }

    return variant;
  }

  // Route to appropriate variant page
  function routeToVariant() {
    const currentPage = getCurrentPage();
    const variant = getVariant();

    // Skip routing if:
    // - Not on a test page
    // - Already on a variant page
    // - Assigned to control
    if (!currentPage || variant === 'control' || window.location.pathname.includes('wave2-variants')) {
      return;
    }

    const testConfig = CONFIG.tests.find(t => t.name === variant);
    if (!testConfig || !testConfig.pages.includes(currentPage)) {
      return;
    }

    // Redirect to variant page
    const variantPath = `/ab-tests/wave2-variants/${variant}/${currentPage}.html`;
    if (window.location.pathname !== variantPath) {
      window.location.href = variantPath;
    }
  }

  // Track analytics events
  function trackEvent(eventName, params) {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, {
        ...params,
        test_wave: 'wave2',
        timestamp: new Date().toISOString()
      });
    }

    // Console logging for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[Wave 2 A/B Test]', eventName, params);
    }
  }

  // Track page view with variant info
  function trackPageView() {
    const variant = getVariant();
    const currentPage = getCurrentPage();

    trackEvent('wave2_page_view', {
      variant,
      page: currentPage,
      isMobile: isMobile(),
      isVariantPage: window.location.pathname.includes('wave2-variants')
    });
  }

  // Track conversion events
  function trackConversion(conversionType) {
    const variant = getVariant();

    trackEvent('wave2_conversion', {
      variant,
      conversion_type: conversionType,
      page: getCurrentPage(),
      isMobile: isMobile()
    });
  }

  // Initialize router
  function init() {
    // Track page view
    trackPageView();

    // Route to variant if needed
    routeToVariant();

    // Add conversion tracking to CTA buttons
    document.addEventListener('DOMContentLoaded', () => {
      const ctaButtons = document.querySelectorAll('a[href*="gemini.google.com"], .cta-button, .mobile-cta-button');
      ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
          trackConversion('cta_click');
        });
      });
    });

    // Expose API for manual tracking
    window.geminiWave2 = {
      getVariant,
      trackConversion,
      isMobile: isMobile(),
      variant: getVariant()
    };
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
