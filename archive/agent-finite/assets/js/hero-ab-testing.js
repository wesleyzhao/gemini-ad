/**
 * Hero Text A/B Testing Library
 *
 * Enables dynamic headline testing with variant rotation, analytics tracking,
 * and performance measurement. Supports multiple variants per page with
 * automatic persistence and reporting.
 *
 * Usage:
 * <h1 class="hero-title" data-hero-variants='["Variant 1", "Variant 2", "Variant 3"]'>Default Headline</h1>
 *
 * @version 1.0.0
 */

class HeroABTesting {
  constructor(options = {}) {
    this.options = {
      // Storage key prefix
      storagePrefix: 'gemini_hero_',

      // Test duration in days (how long to show same variant to user)
      testDuration: 7,

      // Enable analytics tracking
      enableTracking: true,

      // Custom analytics callback
      onVariantShown: null,

      // Custom analytics callback for interactions
      onVariantInteraction: null,

      // Debug mode
      debug: false,

      ...options
    };

    this.currentVariants = {};
    this.trackingData = this.loadTrackingData();

    this.init();
  }

  /**
   * Initialize A/B testing on page load
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupVariants());
    } else {
      this.setupVariants();
    }
  }

  /**
   * Setup all hero variants on the page
   */
  setupVariants() {
    // Find all elements with data-hero-variants attribute
    const heroElements = document.querySelectorAll('[data-hero-variants]');

    heroElements.forEach((element, index) => {
      try {
        const variants = JSON.parse(element.getAttribute('data-hero-variants'));
        const elementId = element.id || `hero-${index}`;

        if (!element.id) {
          element.id = elementId;
        }

        // Select and apply variant
        const selectedVariant = this.selectVariant(elementId, variants);
        this.applyVariant(element, selectedVariant);

        // Track variant
        this.trackVariantShown(elementId, selectedVariant, variants);

        // Setup interaction tracking
        this.setupInteractionTracking(element, elementId, selectedVariant);

        this.log(`Applied variant "${selectedVariant.text}" to #${elementId}`);
      } catch (error) {
        console.error('Error parsing hero variants:', error);
      }
    });

    // Setup subtitle variants
    this.setupSubtitleVariants();
  }

  /**
   * Setup subtitle variants (optional)
   */
  setupSubtitleVariants() {
    const subtitleElements = document.querySelectorAll('[data-subtitle-variants]');

    subtitleElements.forEach((element, index) => {
      try {
        const variants = JSON.parse(element.getAttribute('data-subtitle-variants'));
        const elementId = element.id || `subtitle-${index}`;

        if (!element.id) {
          element.id = elementId;
        }

        const selectedVariant = this.selectVariant(elementId, variants);
        this.applyVariant(element, selectedVariant);
        this.trackVariantShown(elementId, selectedVariant, variants);

        this.log(`Applied subtitle variant "${selectedVariant.text}" to #${elementId}`);
      } catch (error) {
        console.error('Error parsing subtitle variants:', error);
      }
    });
  }

  /**
   * Select a variant for display
   * Uses stored variant if within test duration, otherwise selects new random variant
   */
  selectVariant(elementId, variants) {
    const storageKey = this.options.storagePrefix + elementId;
    const stored = this.getStoredVariant(storageKey);

    // Check if stored variant is still valid
    if (stored && this.isVariantValid(stored)) {
      const variantData = this.findVariantByText(variants, stored.text);
      if (variantData) {
        return variantData;
      }
    }

    // Select new random variant
    const selectedVariant = this.getRandomVariant(variants);

    // Store for consistency
    this.storeVariant(storageKey, selectedVariant);

    return selectedVariant;
  }

  /**
   * Get random variant with weighted selection support
   */
  getRandomVariant(variants) {
    if (variants.length === 0) {
      return { text: '', weight: 1 };
    }

    // Support both string arrays and object arrays
    const normalizedVariants = variants.map(v =>
      typeof v === 'string' ? { text: v, weight: 1 } : v
    );

    // Weighted random selection
    const totalWeight = normalizedVariants.reduce((sum, v) => sum + (v.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const variant of normalizedVariants) {
      random -= (variant.weight || 1);
      if (random <= 0) {
        return variant;
      }
    }

    return normalizedVariants[0];
  }

  /**
   * Find variant by text in variants array
   */
  findVariantByText(variants, text) {
    const normalizedVariants = variants.map(v =>
      typeof v === 'string' ? { text: v, weight: 1 } : v
    );

    return normalizedVariants.find(v => v.text === text);
  }

  /**
   * Apply variant to element
   */
  applyVariant(element, variant) {
    // Preserve HTML structure (like <br> tags)
    const hasHTML = element.innerHTML.includes('<');

    if (hasHTML && variant.text.includes('<br>')) {
      element.innerHTML = variant.text;
    } else {
      element.textContent = variant.text;
    }

    // Store current variant for tracking
    element.setAttribute('data-current-variant', variant.text);
  }

  /**
   * Store variant in localStorage
   */
  storeVariant(key, variant) {
    try {
      const data = {
        text: variant.text,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      this.log('Could not store variant:', error);
    }
  }

  /**
   * Get stored variant from localStorage
   */
  getStoredVariant(key) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      this.log('Could not retrieve stored variant:', error);
      return null;
    }
  }

  /**
   * Check if stored variant is still valid (within test duration)
   */
  isVariantValid(stored) {
    const now = Date.now();
    const elapsed = now - stored.timestamp;
    const maxAge = this.options.testDuration * 24 * 60 * 60 * 1000; // Convert days to ms

    return elapsed < maxAge;
  }

  /**
   * Track variant shown event
   */
  trackVariantShown(elementId, variant, allVariants) {
    const pagePath = window.location.pathname;

    // Update tracking data
    if (!this.trackingData[pagePath]) {
      this.trackingData[pagePath] = {};
    }

    if (!this.trackingData[pagePath][elementId]) {
      this.trackingData[pagePath][elementId] = {
        variants: {},
        totalImpressions: 0
      };
    }

    if (!this.trackingData[pagePath][elementId].variants[variant.text]) {
      this.trackingData[pagePath][elementId].variants[variant.text] = {
        impressions: 0,
        clicks: 0,
        conversions: 0
      };
    }

    this.trackingData[pagePath][elementId].variants[variant.text].impressions++;
    this.trackingData[pagePath][elementId].totalImpressions++;

    this.saveTrackingData();

    // Call custom callback
    if (this.options.onVariantShown) {
      this.options.onVariantShown({
        page: pagePath,
        elementId,
        variant: variant.text,
        allVariants: allVariants.map(v => typeof v === 'string' ? v : v.text)
      });
    }

    // Send to analytics (Google Analytics, etc.)
    if (this.options.enableTracking && typeof gtag !== 'undefined') {
      gtag('event', 'hero_variant_shown', {
        page_path: pagePath,
        element_id: elementId,
        variant: variant.text
      });
    }
  }

  /**
   * Setup interaction tracking for CTAs near hero
   */
  setupInteractionTracking(heroElement, elementId, variant) {
    // Find nearby CTAs (next few elements)
    const parent = heroElement.closest('section, .hero, .hero-section');
    if (!parent) return;

    const ctas = parent.querySelectorAll('a.btn, button.btn, .hero-cta a, .hero-cta button');

    ctas.forEach(cta => {
      cta.addEventListener('click', () => {
        this.trackVariantInteraction(elementId, variant, 'click');
      });
    });
  }

  /**
   * Track variant interaction (click, conversion, etc.)
   */
  trackVariantInteraction(elementId, variant, interactionType = 'click') {
    const pagePath = window.location.pathname;

    if (this.trackingData[pagePath] &&
        this.trackingData[pagePath][elementId] &&
        this.trackingData[pagePath][elementId].variants[variant.text]) {

      if (interactionType === 'click') {
        this.trackingData[pagePath][elementId].variants[variant.text].clicks++;
      } else if (interactionType === 'conversion') {
        this.trackingData[pagePath][elementId].variants[variant.text].conversions++;
      }

      this.saveTrackingData();
    }

    // Call custom callback
    if (this.options.onVariantInteraction) {
      this.options.onVariantInteraction({
        page: pagePath,
        elementId,
        variant: variant.text,
        interactionType
      });
    }

    // Send to analytics
    if (this.options.enableTracking && typeof gtag !== 'undefined') {
      gtag('event', `hero_variant_${interactionType}`, {
        page_path: pagePath,
        element_id: elementId,
        variant: variant.text
      });
    }
  }

  /**
   * Load tracking data from localStorage
   */
  loadTrackingData() {
    try {
      const data = localStorage.getItem('gemini_hero_tracking');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      this.log('Could not load tracking data:', error);
      return {};
    }
  }

  /**
   * Save tracking data to localStorage
   */
  saveTrackingData() {
    try {
      localStorage.setItem('gemini_hero_tracking', JSON.stringify(this.trackingData));
    } catch (error) {
      this.log('Could not save tracking data:', error);
    }
  }

  /**
   * Get tracking report for current page or all pages
   */
  getReport(pagePath = null) {
    if (pagePath) {
      return this.trackingData[pagePath] || {};
    }

    return this.trackingData;
  }

  /**
   * Get performance metrics for variants
   */
  getPerformanceMetrics(pagePath = window.location.pathname, elementId = null) {
    const pageData = this.trackingData[pagePath];
    if (!pageData) return null;

    if (elementId) {
      return this.calculateMetrics(pageData[elementId]);
    }

    // Return metrics for all elements on page
    const metrics = {};
    Object.keys(pageData).forEach(id => {
      metrics[id] = this.calculateMetrics(pageData[id]);
    });

    return metrics;
  }

  /**
   * Calculate performance metrics for variant data
   */
  calculateMetrics(data) {
    if (!data || !data.variants) return null;

    const metrics = {
      totalImpressions: data.totalImpressions,
      variants: {}
    };

    Object.entries(data.variants).forEach(([variantText, variantData]) => {
      const ctr = variantData.impressions > 0
        ? (variantData.clicks / variantData.impressions * 100).toFixed(2)
        : 0;

      const conversionRate = variantData.clicks > 0
        ? (variantData.conversions / variantData.clicks * 100).toFixed(2)
        : 0;

      metrics.variants[variantText] = {
        impressions: variantData.impressions,
        clicks: variantData.clicks,
        conversions: variantData.conversions,
        ctr: parseFloat(ctr),
        conversionRate: parseFloat(conversionRate)
      };
    });

    return metrics;
  }

  /**
   * Export tracking data as JSON
   */
  exportData() {
    return JSON.stringify(this.trackingData, null, 2);
  }

  /**
   * Clear all tracking data
   */
  clearData() {
    this.trackingData = {};
    this.saveTrackingData();

    // Clear variant storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.options.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Force refresh variant (useful for testing)
   */
  refreshVariant(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const variantsAttr = element.getAttribute('data-hero-variants') ||
                         element.getAttribute('data-subtitle-variants');
    if (!variantsAttr) return;

    try {
      const variants = JSON.parse(variantsAttr);
      const selectedVariant = this.getRandomVariant(variants);
      this.applyVariant(element, selectedVariant);
      this.storeVariant(this.options.storagePrefix + elementId, selectedVariant);
      this.log(`Refreshed variant for #${elementId}: "${selectedVariant.text}"`);
    } catch (error) {
      console.error('Error refreshing variant:', error);
    }
  }

  /**
   * Debug logging
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[HeroABTesting]', ...args);
    }
  }
}

// Auto-initialize with default options
let heroABTesting;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    heroABTesting = new HeroABTesting({ debug: false });
  });
} else {
  heroABTesting = new HeroABTesting({ debug: false });
}

// Global API for manual control
window.HeroABTesting = HeroABTesting;
window.heroABTesting = heroABTesting;

// Console helper for viewing results
console.log('%c📊 Hero A/B Testing Active', 'color: #4285f4; font-size: 14px; font-weight: bold;');
console.log('%cUse heroABTesting.getReport() to view results', 'color: #666; font-size: 12px;');
console.log('%cUse heroABTesting.getPerformanceMetrics() to see conversion data', 'color: #666; font-size: 12px;');
