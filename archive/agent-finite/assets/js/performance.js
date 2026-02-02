/**
 * ============================================
 * PERFORMANCE.JS - Performance Optimization Utilities
 * ============================================
 *
 * Handles lazy loading, resource optimization, and performance monitoring
 * for Gemini Ads landing pages.
 *
 * Features:
 * - Lazy loading for images and iframes
 * - Resource prefetching and preloading
 * - Performance metrics tracking
 * - Connection optimization
 * - Third-party script optimization
 */

(function() {
  'use strict';

  /* ============================================
     CONFIGURATION
     ============================================ */

  const CONFIG = {
    // Lazy loading settings
    lazyLoadMargin: '200px', // Start loading 200px before element enters viewport
    lazyLoadThreshold: 0.01, // Trigger when 1% of element is visible

    // Prefetch settings
    enablePrefetch: true,
    prefetchDelay: 2000, // Delay before prefetching (ms)

    // Performance monitoring
    enablePerformanceLogging: false, // Set to true for debugging
    performanceMetrics: ['FCP', 'LCP', 'FID', 'CLS', 'TTFB']
  };

  /* ============================================
     LAZY LOADING - IMAGES
     ============================================ */

  /**
   * Initialize lazy loading for images
   * Uses native browser lazy loading with IntersectionObserver fallback
   */
  function initLazyLoadImages() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Use native lazy loading
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
      });
    } else {
      // Fallback to IntersectionObserver
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: CONFIG.lazyLoadMargin,
        threshold: CONFIG.lazyLoadThreshold
      });

      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => imageObserver.observe(img));
    }
  }

  /* ============================================
     LAZY LOADING - IFRAMES
     ============================================ */

  /**
   * Initialize lazy loading for iframes (videos, embeds, etc.)
   */
  function initLazyLoadIframes() {
    const iframeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.classList.add('loaded');
            observer.unobserve(iframe);
          }
        }
      });
    }, {
      rootMargin: CONFIG.lazyLoadMargin,
      threshold: CONFIG.lazyLoadThreshold
    });

    const iframes = document.querySelectorAll('iframe[data-src]');
    iframes.forEach(iframe => iframeObserver.observe(iframe));
  }

  /* ============================================
     RESOURCE PREFETCHING
     ============================================ */

  /**
   * Prefetch resources for next page navigation
   * Analyzes links and prefetches likely navigation targets
   */
  function initPrefetching() {
    if (!CONFIG.enablePrefetch) return;

    // Wait before prefetching to prioritize current page
    setTimeout(() => {
      const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
      const prefetchedUrls = new Set();

      links.forEach(link => {
        const href = link.getAttribute('href');

        // Skip if already prefetched
        if (prefetchedUrls.has(href)) return;

        // Skip hash links
        if (href.startsWith('#')) return;

        // Create prefetch link
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        prefetchLink.as = 'document';

        document.head.appendChild(prefetchLink);
        prefetchedUrls.add(href);
      });

      if (CONFIG.enablePerformanceLogging) {
        console.log(`[Performance] Prefetched ${prefetchedUrls.size} pages`);
      }
    }, CONFIG.prefetchDelay);
  }

  /* ============================================
     DNS PREFETCH & PRECONNECT
     ============================================ */

  /**
   * Add DNS prefetch and preconnect for external resources
   */
  function initResourceHints() {
    const externalDomains = new Set();

    // Find all external resources
    const images = document.querySelectorAll('img[src^="http"], img[data-src^="http"]');
    const scripts = document.querySelectorAll('script[src^="http"]');
    const stylesheets = document.querySelectorAll('link[href^="http"]');
    const iframes = document.querySelectorAll('iframe[src^="http"], iframe[data-src^="http"]');

    // Extract domains
    [...images, ...scripts, ...stylesheets, ...iframes].forEach(element => {
      const url = element.src || element.href || element.dataset.src;
      if (url) {
        try {
          const domain = new URL(url).origin;
          externalDomains.add(domain);
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    // Add DNS prefetch for each domain
    externalDomains.forEach(domain => {
      // Skip if already exists
      if (document.querySelector(`link[href="${domain}"]`)) return;

      const prefetch = document.createElement('link');
      prefetch.rel = 'dns-prefetch';
      prefetch.href = domain;
      document.head.appendChild(prefetch);
    });

    if (CONFIG.enablePerformanceLogging) {
      console.log(`[Performance] Added DNS prefetch for ${externalDomains.size} domains`);
    }
  }

  /* ============================================
     FONT OPTIMIZATION
     ============================================ */

  /**
   * Optimize font loading with font-display: swap
   */
  function initFontOptimization() {
    // Add font-display: swap to Google Fonts
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      if (!link.href.includes('display=swap')) {
        link.href = link.href + (link.href.includes('?') ? '&' : '?') + 'display=swap';
      }
    });
  }

  /* ============================================
     PERFORMANCE METRICS
     ============================================ */

  /**
   * Track and log Core Web Vitals
   */
  function initPerformanceMonitoring() {
    if (!CONFIG.enablePerformanceLogging) return;

    // Wait for page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const paintData = performance.getEntriesByType('paint');

        const metrics = {
          // Time to First Byte
          TTFB: perfData.responseStart - perfData.requestStart,

          // DOM Content Loaded
          DCL: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,

          // Load Complete
          Load: perfData.loadEventEnd - perfData.loadEventStart,

          // First Contentful Paint
          FCP: paintData.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

          // DOM Interactive
          DOMInteractive: perfData.domInteractive - perfData.fetchStart
        };

        console.table(metrics);

        // Log resource sizes
        const resources = performance.getEntriesByType('resource');
        const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
        console.log(`[Performance] Total transfer size: ${(totalSize / 1024).toFixed(2)} KB`);

      }, 0);
    });

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`[Performance] LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            console.log(`[Performance] FID: ${entry.processingStart - entry.startTime}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          console.log(`[Performance] CLS: ${clsScore.toFixed(4)}`);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }
    }
  }

  /* ============================================
     THIRD-PARTY SCRIPT OPTIMIZATION
     ============================================ */

  /**
   * Load third-party scripts asynchronously
   */
  function initThirdPartyScriptOptimization() {
    const scripts = document.querySelectorAll('script[data-async="true"]');
    scripts.forEach(script => {
      if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
        script.setAttribute('async', 'true');
      }
    });
  }

  /* ============================================
     SERVICE WORKER REGISTRATION (Optional)
     ============================================ */

  /**
   * Register service worker for caching and offline support
   * Uncomment to enable
   */
  function initServiceWorker() {
    // Service workers not needed for GitHub Pages static hosting
    // Uncomment if needed in the future
    /*
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('[Performance] Service Worker registered:', registration);
          })
          .catch(error => {
            console.log('[Performance] Service Worker registration failed:', error);
          });
      });
    }
    */
  }

  /* ============================================
     INITIALIZE ALL OPTIMIZATIONS
     ============================================ */

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }
  }

  function runOptimizations() {
    initLazyLoadImages();
    initLazyLoadIframes();
    initResourceHints();
    initFontOptimization();
    initPrefetching();
    initThirdPartyScriptOptimization();
    initPerformanceMonitoring();
  }

  // Start optimizations
  init();

  // Expose performance utilities globally (optional)
  window.GeminiPerformance = {
    config: CONFIG,
    enableLogging: () => { CONFIG.enablePerformanceLogging = true; },
    disableLogging: () => { CONFIG.enablePerformanceLogging = false; },
    getMetrics: () => performance.getEntriesByType('navigation')[0]
  };

})();
