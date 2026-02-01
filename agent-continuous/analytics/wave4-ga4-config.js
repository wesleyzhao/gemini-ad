/**
 * Wave 4 Google Analytics 4 Event Tracking Configuration
 * Comprehensive tracking for all Wave 4 A/B tests
 *
 * Date: 2026-02-01
 */

// GA4 Measurement ID (replace with actual ID in production)
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';

/**
 * Initialize GA4 tracking
 */
function initWave4Tracking() {
  // Load gtag.js if not already loaded
  if (!window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  }

  // Setup event listeners
  setupWave4EventListeners();
}

/**
 * Setup all Wave 4 event listeners
 */
function setupWave4EventListeners() {
  // Page load events
  trackPageView();

  // Test variant exposure
  trackVariantExposure();

  // CTA interactions
  trackCTAClicks();

  // Quad Threat specific events
  trackQuadThreatEvents();

  // AI Optimization events
  trackAIOptimizationEvents();

  // Voice Interface events
  trackVoiceInterfaceEvents();

  // AR/VR events
  trackARVREvents();

  // Engagement metrics
  trackEngagement();

  // Conversion events
  trackConversions();

  // Performance metrics
  trackPerformance();
}

/**
 * Track page view with test context
 */
function trackPageView() {
  const testAssignment = getTestAssignment();
  gtag('event', 'page_view', {
    page_location: window.location.href,
    page_title: document.title,
    wave4_test: testAssignment.testId || 'control',
    wave4_variant: testAssignment.variantId || 'baseline',
    device_category: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    timestamp: new Date().toISOString()
  });
}

/**
 * Track test variant exposure
 */
function trackVariantExposure() {
  const testAssignment = getTestAssignment();
  if (testAssignment.testId && testAssignment.testId !== 'control') {
    gtag('event', 'wave4_variant_exposed', {
      test_id: testAssignment.testId,
      variant_id: testAssignment.variantId,
      page: getCurrentPage(),
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Track CTA clicks (all CTAs)
 */
function trackCTAClicks() {
  // Track all CTA buttons
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('.cta-button, .btn-primary, .sticky-cta-quad, .ar-button, button[href*="gemini.google.com"]');
    if (cta) {
      const testAssignment = getTestAssignment();
      gtag('event', 'wave4_cta_click', {
        cta_text: cta.textContent.trim(),
        cta_type: cta.className,
        test_id: testAssignment.testId || 'control',
        variant_id: testAssignment.variantId || 'baseline',
        element_position: getElementPosition(cta),
        timestamp: new Date().toISOString()
      });

      // Also track as conversion
      gtag('event', 'wave4_conversion', {
        test_id: testAssignment.testId || 'control',
        variant_id: testAssignment.variantId || 'baseline',
        conversion_type: 'cta_click',
        value: 1.0
      });
    }
  });
}

/**
 * Track Quad Threat specific events
 */
function trackQuadThreatEvents() {
  // Track sticky CTA visibility
  const stickyCTA = document.querySelector('.sticky-cta-quad');
  if (stickyCTA) {
    observeVisibility(stickyCTA, () => {
      gtag('event', 'wave4_quad_sticky_cta_visible', {
        scroll_depth: getScrollDepth()
      });
    });
  }

  // Track video plays
  const heroVideo = document.querySelector('.hero-video-quad');
  if (heroVideo) {
    heroVideo.addEventListener('play', () => {
      gtag('event', 'wave4_quad_video_play', {
        video_duration: heroVideo.duration,
        autoplay: heroVideo.autoplay
      });
    });

    heroVideo.addEventListener('ended', () => {
      gtag('event', 'wave4_quad_video_complete', {
        video_duration: heroVideo.duration
      });
    });

    // Track video progress (25%, 50%, 75%)
    let progress25 = false, progress50 = false, progress75 = false;
    heroVideo.addEventListener('timeupdate', () => {
      const percent = (heroVideo.currentTime / heroVideo.duration) * 100;
      if (percent >= 25 && !progress25) {
        gtag('event', 'wave4_quad_video_progress', { progress: 25 });
        progress25 = true;
      }
      if (percent >= 50 && !progress50) {
        gtag('event', 'wave4_quad_video_progress', { progress: 50 });
        progress50 = true;
      }
      if (percent >= 75 && !progress75) {
        gtag('event', 'wave4_quad_video_progress', { progress: 75 });
        progress75 = true;
      }
    });
  }

  // Track interactive demo engagement
  const interactiveDemo = document.querySelector('.interactive-demo-quad');
  if (interactiveDemo) {
    observeVisibility(interactiveDemo, () => {
      gtag('event', 'wave4_quad_demo_visible', {
        scroll_depth: getScrollDepth()
      });
    });

    // Track iframe interactions (approximate)
    const iframe = interactiveDemo.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        gtag('event', 'wave4_quad_demo_loaded');
      });
    }
  }

  // Track social proof banner visibility
  const socialProof = document.querySelector('.social-proof-banner-quad');
  if (socialProof) {
    observeVisibility(socialProof, () => {
      gtag('event', 'wave4_quad_social_proof_visible');
    });
  }
}

/**
 * Track AI Optimization events
 */
function trackAIOptimizationEvents() {
  // Track personalization delivery
  const heroText = document.querySelector('.hero h1, .hero-text, h1');
  if (heroText && heroText.hasAttribute('data-original')) {
    gtag('event', 'wave4_ai_personalization_delivered', {
      original_text: heroText.getAttribute('data-original'),
      personalized_text: heroText.textContent,
      personalization_type: 'hero_text'
    });
  }

  // Track returning user detection
  if (localStorage.getItem('gemini_visited')) {
    gtag('event', 'wave4_ai_returning_user_detected', {
      previous_visits: localStorage.getItem('gemini_visit_count') || 1
    });
  }

  // Track user behavior patterns
  let scrollSpeed = 0;
  let lastScrollTime = Date.now();
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const now = Date.now();
    const timeDiff = now - lastScrollTime;
    const scrollDiff = Math.abs(window.scrollY - lastScrollY);
    scrollSpeed = scrollDiff / timeDiff;

    // Detect quick scrollers (>5 px/ms)
    if (scrollSpeed > 5) {
      gtag('event', 'wave4_ai_quick_scroller_detected', {
        scroll_speed: scrollSpeed.toFixed(2)
      });
    }

    lastScrollTime = now;
    lastScrollY = window.scrollY;
  }, { passive: true });
}

/**
 * Track Voice Interface events
 */
function trackVoiceInterfaceEvents() {
  const voiceTrigger = document.querySelector('.voice-trigger');
  if (voiceTrigger) {
    voiceTrigger.addEventListener('click', () => {
      gtag('event', 'wave4_voice_trigger_clicked', {
        device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    });

    // Listen for custom voice events
    document.addEventListener('voiceCommandRecognized', (e) => {
      gtag('event', 'wave4_voice_command_recognized', {
        command: e.detail.command,
        confidence: e.detail.confidence
      });
    });

    document.addEventListener('voiceCommandExecuted', (e) => {
      gtag('event', 'wave4_voice_command_executed', {
        command: e.detail.command,
        action: e.detail.action
      });
    });

    document.addEventListener('voiceError', (e) => {
      gtag('event', 'wave4_voice_error', {
        error_type: e.detail.error
      });
    });
  }
}

/**
 * Track AR/VR events
 */
function trackARVREvents() {
  // Track AR button clicks
  const arButtons = document.querySelectorAll('.ar-button');
  arButtons.forEach(button => {
    button.addEventListener('click', () => {
      const buttonText = button.textContent.trim();
      const eventName = buttonText.includes('AR') ? 'wave4_ar_button_clicked' : 'wave4_vr_button_clicked';

      gtag('event', eventName, {
        button_text: buttonText,
        device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    });
  });

  // Track model viewer interactions (if model-viewer is present)
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    modelViewer.addEventListener('load', () => {
      gtag('event', 'wave4_3d_model_loaded', {
        load_time: performance.now()
      });
    });

    modelViewer.addEventListener('ar-status', (e) => {
      if (e.detail.status === 'session-started') {
        gtag('event', 'wave4_ar_session_started');
      } else if (e.detail.status === 'session-ended') {
        gtag('event', 'wave4_ar_session_ended');
      }
    });

    modelViewer.addEventListener('camera-change', () => {
      gtag('event', 'wave4_3d_model_interaction', {
        interaction_type: 'camera_change'
      });
    });
  }
}

/**
 * Track engagement metrics
 */
function trackEngagement() {
  // Track time on page
  let startTime = Date.now();
  let engaged = false;

  window.addEventListener('beforeunload', () => {
    const timeOnPage = (Date.now() - startTime) / 1000;
    const testAssignment = getTestAssignment();

    gtag('event', 'wave4_time_on_page', {
      time_seconds: Math.round(timeOnPage),
      test_id: testAssignment.testId || 'control',
      variant_id: testAssignment.variantId || 'baseline',
      engaged: engaged
    });
  });

  // Track scroll depth
  let maxScrollDepth = 0;
  window.addEventListener('scroll', () => {
    const scrollDepth = getScrollDepth();
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;

      // Track milestone scroll depths
      if ([25, 50, 75, 90].includes(scrollDepth)) {
        const testAssignment = getTestAssignment();
        gtag('event', 'wave4_scroll_depth', {
          depth_percent: scrollDepth,
          test_id: testAssignment.testId || 'control',
          variant_id: testAssignment.variantId || 'baseline'
        });

        // Mark as engaged at 50% scroll
        if (scrollDepth >= 50) {
          engaged = true;
        }
      }
    }
  }, { passive: true });

  // Track clicks
  let clickCount = 0;
  document.addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 3) {
      engaged = true;
    }
  });
}

/**
 * Track conversions
 */
function trackConversions() {
  // Track form submissions
  document.addEventListener('submit', (e) => {
    const testAssignment = getTestAssignment();
    gtag('event', 'wave4_conversion', {
      test_id: testAssignment.testId || 'control',
      variant_id: testAssignment.variantId || 'baseline',
      conversion_type: 'form_submit',
      value: 1.0
    });
  });

  // Track external link clicks to Gemini
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="gemini.google.com"]');
    if (link) {
      const testAssignment = getTestAssignment();
      gtag('event', 'wave4_conversion', {
        test_id: testAssignment.testId || 'control',
        variant_id: testAssignment.variantId || 'baseline',
        conversion_type: 'gemini_link_click',
        value: 1.0
      });
    }
  });
}

/**
 * Track performance metrics
 */
function trackPerformance() {
  // Wait for page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const testAssignment = getTestAssignment();

      // Core Web Vitals
      if (window.performance && window.performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          gtag('event', 'wave4_performance', {
            test_id: testAssignment.testId || 'control',
            variant_id: testAssignment.variantId || 'baseline',
            load_time: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            first_byte: Math.round(navigation.responseStart - navigation.requestStart)
          });
        }
      }

      // LCP (Largest Contentful Paint)
      if (window.PerformanceObserver) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            gtag('event', 'wave4_lcp', {
              test_id: testAssignment.testId || 'control',
              lcp_ms: Math.round(lastEntry.renderTime || lastEntry.loadTime)
            });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {}

        // FID (First Input Delay)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              gtag('event', 'wave4_fid', {
                test_id: testAssignment.testId || 'control',
                fid_ms: Math.round(entry.processingStart - entry.startTime)
              });
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {}

        // CLS (Cumulative Layout Shift)
        try {
          let clsScore = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsScore += entry.value;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Report CLS on page unload
          window.addEventListener('beforeunload', () => {
            gtag('event', 'wave4_cls', {
              test_id: testAssignment.testId || 'control',
              cls_score: clsScore.toFixed(4)
            });
          });
        } catch (e) {}
      }
    }, 1000);
  });
}

/**
 * Helper: Get test assignment from cookie
 */
function getTestAssignment() {
  const cookie = getCookie('wave4_test_assignment');
  if (!cookie) return { testId: null, variantId: null };

  try {
    const assignment = JSON.parse(cookie);
    // Find first variant assignment
    for (const [testId, group] of Object.entries(assignment)) {
      if (group === 'variant') {
        return { testId, variantId: 'variant' };
      }
    }
    return { testId: 'control', variantId: 'baseline' };
  } catch (e) {
    return { testId: null, variantId: null };
  }
}

/**
 * Helper: Get current page
 */
function getCurrentPage() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1);
}

/**
 * Helper: Get scroll depth percentage
 */
function getScrollDepth() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const trackLength = documentHeight - windowHeight;
  const percentScrolled = Math.floor((scrollTop / trackLength) * 100);
  return Math.min(100, Math.max(0, percentScrolled));
}

/**
 * Helper: Get element position on page
 */
function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;
  return {
    top: Math.round(rect.top + scrollTop),
    left: Math.round(rect.left + scrollLeft),
    viewport_top: Math.round(rect.top),
    viewport_left: Math.round(rect.left)
  };
}

/**
 * Helper: Observe element visibility
 */
function observeVisibility(element, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(element);
}

/**
 * Helper: Get cookie value
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Auto-initialize tracking
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWave4Tracking);
} else {
  initWave4Tracking();
}
