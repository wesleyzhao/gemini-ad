/**
 * Wave 3 GA4 Tracking Configuration
 *
 * Configures Google Analytics 4 custom dimensions, events, and metrics
 * for Wave 3 A/B testing.
 *
 * Feature #79: Wave 3 Implementation
 * Launch Date: February 8, 2026
 */

(function() {
  'use strict';

  /**
   * Wave 3 Custom Dimensions for GA4
   *
   * Configure these in GA4 Admin > Custom Definitions:
   * 1. Go to Property Settings > Custom Definitions
   * 2. Click "Create custom dimension"
   * 3. Add each dimension with the parameter name listed below
   */
  const WAVE3_CUSTOM_DIMENSIONS = {
    // Test Assignment
    'test_variant': {
      scope: 'event',
      description: 'Wave 3 test variant (control/variant)',
      parameter: 'test_variant'
    },
    'test_name': {
      scope: 'event',
      description: 'Wave 3 test name',
      parameter: 'test_name'
    },
    'test_key': {
      scope: 'event',
      description: 'Wave 3 test key (triple-threat, video-social, etc.)',
      parameter: 'test_key'
    },

    // Personalization (AI Personalization test)
    'traffic_source_type': {
      scope: 'event',
      description: 'Traffic source type (search, social, direct, referral)',
      parameter: 'traffic_source'
    },
    'device_category': {
      scope: 'event',
      description: 'Device category (mobile, desktop, tablet)',
      parameter: 'device_type'
    },
    'geographic_region': {
      scope: 'event',
      description: 'Geographic region (US, Europe, Asia, Other)',
      parameter: 'geographic'
    },
    'time_of_day_category': {
      scope: 'event',
      description: 'Time of day (morning, afternoon, evening, night)',
      parameter: 'time_of_day'
    },
    'visitor_type': {
      scope: 'event',
      description: 'Visitor type (first, returning, power)',
      parameter: 'visitor_type'
    },
    'personalization_rules': {
      scope: 'event',
      description: 'Applied personalization rules',
      parameter: 'rules_applied'
    },

    // Video Engagement (Video + Social Proof test)
    'video_title': {
      scope: 'event',
      description: 'Video title or ID',
      parameter: 'video_title'
    },
    'video_duration': {
      scope: 'event',
      description: 'Video duration in seconds',
      parameter: 'video_duration'
    },
    'video_percent': {
      scope: 'event',
      description: 'Video completion percentage',
      parameter: 'video_percent'
    },

    // Demo Interaction (Interactive Demos test)
    'demo_type': {
      scope: 'event',
      description: 'Demo type (workspace, code, research, etc.)',
      parameter: 'demo_type'
    },
    'demo_action': {
      scope: 'event',
      description: 'Demo action performed',
      parameter: 'demo_action'
    },
    'interaction_duration': {
      scope: 'event',
      description: 'Time spent in demo (seconds)',
      parameter: 'interaction_time'
    },

    // Pattern Exposure
    'patterns_shown': {
      scope: 'event',
      description: 'Patterns shown on page',
      parameter: 'patterns'
    }
  };

  /**
   * Wave 3 Custom Events
   */
  const WAVE3_EVENTS = {
    // Test Assignment
    'wave3_test_assignment': {
      description: 'User assigned to Wave 3 test variant',
      parameters: ['test_key', 'test_name', 'test_variant', 'user_id', 'timestamp']
    },
    'wave3_variant_view': {
      description: 'User viewed Wave 3 test variant page',
      parameters: ['test_key', 'test_name', 'test_variant', 'page_url']
    },

    // Personalization Events
    'personalization_applied': {
      description: 'AI personalization rules applied',
      parameters: ['traffic_source', 'device_type', 'geographic', 'time_of_day', 'visitor_type', 'rules_applied']
    },

    // Video Events
    'video_start': {
      description: 'Video playback started',
      parameters: ['video_title', 'video_duration', 'test_variant']
    },
    'video_play': {
      description: 'Video play button clicked',
      parameters: ['video_title', 'current_time']
    },
    'video_pause': {
      description: 'Video paused',
      parameters: ['video_title', 'current_time', 'video_percent']
    },
    'video_complete': {
      description: 'Video watched to completion',
      parameters: ['video_title', 'video_duration']
    },
    'video_progress': {
      description: 'Video progress milestone (25%, 50%, 75%)',
      parameters: ['video_title', 'video_percent', 'current_time']
    },
    'video_unmute': {
      description: 'Video unmuted by user',
      parameters: ['video_title', 'current_time']
    },
    'testimonial_overlay_view': {
      description: 'Testimonial overlay appeared',
      parameters: ['video_title', 'testimonial_index', 'current_time']
    },
    'testimonial_overlay_dismiss': {
      description: 'Testimonial overlay dismissed',
      parameters: ['video_title', 'testimonial_index']
    },

    // Demo Events
    'demo_start': {
      description: 'Interactive demo started',
      parameters: ['demo_type', 'test_variant']
    },
    'demo_interaction': {
      description: 'User interacted with demo',
      parameters: ['demo_type', 'demo_action', 'interaction_count']
    },
    'demo_complete': {
      description: 'Demo completed successfully',
      parameters: ['demo_type', 'interaction_time', 'interaction_count']
    },
    'demo_reset': {
      description: 'Demo reset by user',
      parameters: ['demo_type', 'interaction_count']
    },

    // Pattern Events (Triple Threat)
    'pattern_exposure': {
      description: 'User exposed to conversion patterns',
      parameters: ['patterns', 'pattern_count', 'test_variant']
    },
    'pattern_interaction': {
      description: 'User interacted with pattern element',
      parameters: ['pattern_type', 'element_id', 'action']
    },

    // Conversion Events
    'wave3_conversion': {
      description: 'Conversion tracked for Wave 3 test',
      parameters: ['test_key', 'test_variant', 'conversion_type', 'value']
    },
    'wave3_cta_click': {
      description: 'CTA clicked in Wave 3 test',
      parameters: ['test_key', 'test_variant', 'cta_text', 'cta_location']
    }
  };

  /**
   * Wave 3 Custom Metrics
   */
  const WAVE3_METRICS = {
    'wave3_conversion_value': {
      scope: 'event',
      description: 'Conversion value for Wave 3 tests',
      unit: 'currency'
    },
    'wave3_engagement_score': {
      scope: 'event',
      description: 'Engagement score (0-100)',
      unit: 'standard'
    },
    'demo_interaction_count': {
      scope: 'event',
      description: 'Number of demo interactions',
      unit: 'standard'
    },
    'video_watch_time': {
      scope: 'event',
      description: 'Total video watch time in seconds',
      unit: 'seconds'
    }
  };

  /**
   * Initialize GA4 with Wave 3 configuration
   */
  function initializeWave3Tracking() {
    if (typeof gtag !== 'function') {
      console.warn('[Wave 3 GA4] gtag not available');
      return;
    }

    // Set default parameters for all events
    gtag('set', {
      'wave3_enabled': true,
      'wave3_version': '1.0',
      'test_start_date': '2026-02-08',
      'test_end_date': '2026-02-22'
    });

    // Get current test assignment
    const assignments = JSON.parse(sessionStorage.getItem('wave3_assignments') || '{}');
    if (Object.keys(assignments).length > 0) {
      for (const [testKey, assignment] of Object.entries(assignments)) {
        gtag('set', {
          [`test_${testKey}_variant`]: assignment.variant,
          [`test_${testKey}_assigned_at`]: assignment.timestamp
        });
      }
    }

    console.log('[Wave 3 GA4] Tracking initialized');
  }

  /**
   * Track Wave 3 event with standard parameters
   */
  function trackWave3Event(eventName, parameters = {}) {
    if (typeof gtag !== 'function') {
      console.warn('[Wave 3 GA4] gtag not available');
      return;
    }

    // Add standard Wave 3 parameters
    const enrichedParams = {
      ...parameters,
      wave3_version: '1.0',
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title
    };

    // Add test assignment if available
    const assignments = JSON.parse(sessionStorage.getItem('wave3_assignments') || '{}');
    if (Object.keys(assignments).length > 0) {
      const testKey = Object.keys(assignments)[0]; // Primary test for current page
      enrichedParams.current_test = testKey;
      enrichedParams.current_variant = assignments[testKey].variant;
    }

    gtag('event', eventName, enrichedParams);
    console.log(`[Wave 3 GA4] Event: ${eventName}`, enrichedParams);
  }

  /**
   * Track conversion with value
   */
  function trackConversion(testKey, variant, conversionType, value = 0) {
    trackWave3Event('wave3_conversion', {
      test_key: testKey,
      test_variant: variant,
      conversion_type: conversionType,
      value: value,
      currency: 'USD'
    });

    // Also send to standard GA4 conversion
    gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION-ID', // Replace with actual conversion ID
      value: value,
      currency: 'USD',
      transaction_id: `wave3_${testKey}_${Date.now()}`
    });
  }

  /**
   * Track CTA click
   */
  function trackCTAClick(ctaText, ctaLocation) {
    const assignments = JSON.parse(sessionStorage.getItem('wave3_assignments') || '{}');
    const testKey = Object.keys(assignments)[0];
    const variant = assignments[testKey] ? assignments[testKey].variant : 'unknown';

    trackWave3Event('wave3_cta_click', {
      test_key: testKey,
      test_variant: variant,
      cta_text: ctaText,
      cta_location: ctaLocation
    });
  }

  /**
   * Track video event
   */
  function trackVideoEvent(eventType, videoTitle, params = {}) {
    trackWave3Event(`video_${eventType}`, {
      video_title: videoTitle,
      ...params
    });
  }

  /**
   * Track demo event
   */
  function trackDemoEvent(eventType, demoType, params = {}) {
    trackWave3Event(`demo_${eventType}`, {
      demo_type: demoType,
      ...params
    });
  }

  /**
   * Track personalization
   */
  function trackPersonalization(profile) {
    trackWave3Event('personalization_applied', {
      traffic_source: profile.source,
      device_type: profile.device,
      geographic: profile.geo,
      time_of_day: profile.time,
      visitor_type: profile.visitorType,
      rules_applied: profile.rulesApplied.join(',')
    });
  }

  /**
   * Track pattern exposure
   */
  function trackPatternExposure(patterns) {
    trackWave3Event('pattern_exposure', {
      patterns: patterns.join(','),
      pattern_count: patterns.length
    });
  }

  /**
   * Auto-track page view
   */
  function trackPageView() {
    const testBody = document.querySelector('[data-test]');
    if (!testBody) return;

    const testType = testBody.getAttribute('data-test');
    const variant = testBody.getAttribute('data-variant') || 'unknown';

    trackWave3Event('wave3_variant_view', {
      test_key: testType,
      test_variant: variant,
      page_url: window.location.href
    });
  }

  /**
   * Initialize on DOM ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeWave3Tracking();
      trackPageView();
    });
  } else {
    initializeWave3Tracking();
    trackPageView();
  }

  /**
   * Expose tracking API
   */
  window.Wave3Analytics = {
    trackEvent: trackWave3Event,
    trackConversion: trackConversion,
    trackCTAClick: trackCTAClick,
    trackVideoEvent: trackVideoEvent,
    trackDemoEvent: trackDemoEvent,
    trackPersonalization: trackPersonalization,
    trackPatternExposure: trackPatternExposure,
    customDimensions: WAVE3_CUSTOM_DIMENSIONS,
    customEvents: WAVE3_EVENTS,
    customMetrics: WAVE3_METRICS
  };

  console.log('[Wave 3 GA4] Analytics API available: window.Wave3Analytics');

})();
