/**
 * Analytics Tracking Library for Gemini Ads Campaign
 *
 * Provides easy-to-use analytics tracking for Google Analytics 4 (GA4)
 * and custom event tracking. Works entirely client-side, compatible
 * with GitHub Pages.
 *
 * Features:
 * - Page view tracking
 * - CTA click tracking
 * - Scroll depth tracking
 * - Time on page tracking
 * - Form submission tracking
 * - Video interaction tracking
 * - Custom event tracking
 * - Privacy-friendly (respects Do Not Track)
 * - Works without GA4 (console logging fallback)
 *
 * @version 1.0.0
 */

(function() {
  'use strict';

  /**
   * Analytics Configuration
   */
  const CONFIG = {
    // Set to true to enable debug logging
    debug: false,

    // Respect Do Not Track browser setting
    respectDoNotTrack: true,

    // Scroll depth thresholds to track
    scrollDepthThresholds: [25, 50, 75, 100],

    // Time thresholds to track (in seconds)
    timeThresholds: [10, 30, 60, 120, 300],

    // Enable automatic tracking
    autoTrack: {
      pageView: true,
      ctaClicks: true,
      scrollDepth: true,
      timeOnPage: true,
      outboundLinks: true
    }
  };

  /**
   * Analytics Manager
   */
  class Analytics {
    constructor() {
      this.initialized = false;
      this.scrollDepthTracked = new Set();
      this.timeThresholdsTracked = new Set();
      this.startTime = Date.now();
      this.maxScrollDepth = 0;
      this.isDoNotTrack = this._checkDoNotTrack();

      // Initialize tracking
      this.init();
    }

    /**
     * Initialize analytics tracking
     */
    init() {
      if (this.initialized) return;

      // Check if tracking is disabled
      if (this.isDoNotTrack && CONFIG.respectDoNotTrack) {
        this._log('Do Not Track is enabled. Analytics disabled.');
        return;
      }

      // Track page view
      if (CONFIG.autoTrack.pageView) {
        this.trackPageView();
      }

      // Setup automatic tracking
      if (CONFIG.autoTrack.ctaClicks) {
        this._setupCTATracking();
      }

      if (CONFIG.autoTrack.scrollDepth) {
        this._setupScrollTracking();
      }

      if (CONFIG.autoTrack.timeOnPage) {
        this._setupTimeTracking();
      }

      if (CONFIG.autoTrack.outboundLinks) {
        this._setupOutboundLinkTracking();
      }

      // Track page unload
      this._setupUnloadTracking();

      this.initialized = true;
      this._log('Analytics initialized');
    }

    /**
     * Check if Do Not Track is enabled
     */
    _checkDoNotTrack() {
      return navigator.doNotTrack === '1' ||
             navigator.doNotTrack === 'yes' ||
             window.doNotTrack === '1';
    }

    /**
     * Track a page view
     */
    trackPageView() {
      const data = {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_referrer: document.referrer || '(direct)'
      };

      this._sendEvent('page_view', data);
      this._log('Page view tracked', data);
    }

    /**
     * Track a custom event
     * @param {string} eventName - Name of the event
     * @param {Object} eventData - Event data/parameters
     */
    trackEvent(eventName, eventData = {}) {
      this._sendEvent(eventName, eventData);
      this._log(`Event tracked: ${eventName}`, eventData);
    }

    /**
     * Track CTA click
     * @param {string} ctaText - Text of the CTA button
     * @param {string} ctaLocation - Location/section of the CTA
     */
    trackCTAClick(ctaText, ctaLocation = 'unknown') {
      this.trackEvent('cta_click', {
        cta_text: ctaText,
        cta_location: ctaLocation,
        page_path: window.location.pathname
      });
    }

    /**
     * Track scroll depth
     * @param {number} depth - Scroll depth percentage
     */
    trackScrollDepth(depth) {
      if (this.scrollDepthTracked.has(depth)) return;

      this.scrollDepthTracked.add(depth);
      this.trackEvent('scroll_depth', {
        depth_percentage: depth,
        page_path: window.location.pathname
      });
    }

    /**
     * Track time on page
     * @param {number} seconds - Time spent on page in seconds
     */
    trackTimeOnPage(seconds) {
      if (this.timeThresholdsTracked.has(seconds)) return;

      this.timeThresholdsTracked.add(seconds);
      this.trackEvent('time_on_page', {
        time_seconds: seconds,
        page_path: window.location.pathname
      });
    }

    /**
     * Track form submission
     * @param {string} formName - Name/ID of the form
     * @param {Object} formData - Additional form data
     */
    trackFormSubmission(formName, formData = {}) {
      this.trackEvent('form_submission', {
        form_name: formName,
        ...formData,
        page_path: window.location.pathname
      });
    }

    /**
     * Track video interaction
     * @param {string} action - Video action (play, pause, complete)
     * @param {string} videoName - Name/ID of the video
     * @param {number} progress - Video progress percentage
     */
    trackVideo(action, videoName, progress = 0) {
      this.trackEvent('video_interaction', {
        video_action: action,
        video_name: videoName,
        video_progress: progress,
        page_path: window.location.pathname
      });
    }

    /**
     * Track outbound link click
     * @param {string} url - URL of the outbound link
     */
    trackOutboundLink(url) {
      this.trackEvent('outbound_link', {
        link_url: url,
        link_domain: new URL(url).hostname,
        page_path: window.location.pathname
      });
    }

    /**
     * Track search
     * @param {string} searchTerm - Search query
     */
    trackSearch(searchTerm) {
      this.trackEvent('search', {
        search_term: searchTerm,
        page_path: window.location.pathname
      });
    }

    /**
     * Setup automatic CTA click tracking
     */
    _setupCTATracking() {
      document.addEventListener('click', (e) => {
        const cta = e.target.closest('.cta-button, .btn, [data-cta]');
        if (!cta) return;

        const ctaText = cta.textContent.trim();
        const ctaLocation = cta.dataset.cta || cta.closest('section')?.id || 'unknown';

        this.trackCTAClick(ctaText, ctaLocation);
      });
    }

    /**
     * Setup automatic scroll depth tracking
     */
    _setupScrollTracking() {
      let ticking = false;

      const checkScrollDepth = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

        // Update max scroll depth
        if (scrollPercent > this.maxScrollDepth) {
          this.maxScrollDepth = scrollPercent;
        }

        // Track configured thresholds
        CONFIG.scrollDepthThresholds.forEach(threshold => {
          if (scrollPercent >= threshold) {
            this.trackScrollDepth(threshold);
          }
        });

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(checkScrollDepth);
          ticking = true;
        }
      });
    }

    /**
     * Setup automatic time on page tracking
     */
    _setupTimeTracking() {
      CONFIG.timeThresholds.forEach(threshold => {
        setTimeout(() => {
          this.trackTimeOnPage(threshold);
        }, threshold * 1000);
      });
    }

    /**
     * Setup automatic outbound link tracking
     */
    _setupOutboundLinkTracking() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

        try {
          const url = new URL(href, window.location.origin);
          const isOutbound = url.hostname !== window.location.hostname;

          if (isOutbound) {
            this.trackOutboundLink(href);
          }
        } catch (err) {
          // Invalid URL, ignore
        }
      });
    }

    /**
     * Setup page unload tracking
     */
    _setupUnloadTracking() {
      window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

        this.trackEvent('page_exit', {
          time_on_page: timeOnPage,
          max_scroll_depth: this.maxScrollDepth,
          page_path: window.location.pathname
        });
      });
    }

    /**
     * Send event to Google Analytics
     * @param {string} eventName - Event name
     * @param {Object} eventData - Event parameters
     */
    _sendEvent(eventName, eventData = {}) {
      if (this.isDoNotTrack && CONFIG.respectDoNotTrack) {
        return;
      }

      // Send to Google Analytics 4
      if (typeof gtag === 'function') {
        gtag('event', eventName, eventData);
      }
      // Fallback to dataLayer
      else if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: eventName,
          ...eventData
        });
      }
      // Console log if GA4 not available
      else if (CONFIG.debug) {
        console.log('[Analytics]', eventName, eventData);
      }
    }

    /**
     * Debug logging
     */
    _log(...args) {
      if (CONFIG.debug) {
        console.log('[Analytics]', ...args);
      }
    }

    /**
     * Get analytics report
     */
    getReport() {
      return {
        initialized: this.initialized,
        doNotTrack: this.isDoNotTrack,
        timeOnPage: Math.round((Date.now() - this.startTime) / 1000),
        maxScrollDepth: this.maxScrollDepth,
        scrollDepthsTracked: Array.from(this.scrollDepthTracked),
        timeThresholdsTracked: Array.from(this.timeThresholdsTracked)
      };
    }

    /**
     * Enable debug mode
     */
    enableDebug() {
      CONFIG.debug = true;
      this._log('Debug mode enabled');
    }

    /**
     * Disable debug mode
     */
    disableDebug() {
      CONFIG.debug = false;
    }
  }

  /**
   * Create global analytics instance
   */
  const analytics = new Analytics();

  // Expose to window for manual tracking
  window.geminiAnalytics = analytics;

  // Expose simplified tracking methods
  window.trackEvent = (eventName, eventData) => analytics.trackEvent(eventName, eventData);
  window.trackCTA = (ctaText, ctaLocation) => analytics.trackCTAClick(ctaText, ctaLocation);
  window.trackForm = (formName, formData) => analytics.trackFormSubmission(formName, formData);
  window.trackVideo = (action, videoName, progress) => analytics.trackVideo(action, videoName, progress);

})();
