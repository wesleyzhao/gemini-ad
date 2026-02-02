/**
 * ============================================
 * ANIMATIONS.JS - Animation Controller
 * ============================================
 *
 * Handles scroll-triggered animations using Intersection Observer API
 * Works with animations.css classes
 *
 * Features:
 * - Automatic scroll-triggered animations
 * - Parallax scroll effects
 * - Scroll progress indicator
 * - Performance-optimized with Intersection Observer
 * - Respects prefers-reduced-motion
 */

(function() {
  'use strict';

  /* ============================================
     CONFIGURATION
     ============================================ */

  const CONFIG = {
    // Intersection Observer options
    observerOptions: {
      root: null, // viewport
      rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
      threshold: 0.1 // Trigger when 10% of element is visible
    },

    // Animation settings
    animationDelay: 0, // Base delay for sequential animations
    staggerDelay: 100, // Delay between staggered items (ms)

    // Parallax settings
    parallaxEnabled: true,
    parallaxSpeeds: {
      slow: 0.3,
      medium: 0.5,
      fast: 0.8
    },

    // Scroll progress
    scrollProgressEnabled: true
  };

  /* ============================================
     DETECT USER PREFERENCES
     ============================================ */

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Disable animations if user prefers reduced motion
  if (prefersReducedMotion) {
    console.log('Animations disabled: prefers-reduced-motion is enabled');
    return;
  }

  /* ============================================
     INTERSECTION OBSERVER - SCROLL ANIMATIONS
     ============================================ */

  /**
   * Initialize scroll-triggered animations
   */
  function initScrollAnimations() {
    // Find all elements with animation classes
    const animatedElements = document.querySelectorAll('[class*="animate-"]');

    if (animatedElements.length === 0) {
      return;
    }

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add active class when element enters viewport
          entry.target.classList.add('animate-active');

          // Optional: Unobserve after animation completes (one-time animation)
          // Uncomment next line if you want animations to trigger only once
          // observer.unobserve(entry.target);
        } else {
          // Optional: Remove active class when element leaves viewport
          // This allows animations to re-trigger when scrolling back up
          // Comment out next line if you want one-time animations
          // entry.target.classList.remove('animate-active');
        }
      });
    }, CONFIG.observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
      // Skip elements that already have animate-active (immediate animations)
      if (!element.classList.contains('animate-active')) {
        observer.observe(element);
      }
    });

    console.log(`Observing ${animatedElements.length} animated elements`);
  }

  /* ============================================
     PARALLAX SCROLL EFFECTS
     ============================================ */

  /**
   * Initialize parallax scroll effects
   */
  function initParallax() {
    if (!CONFIG.parallaxEnabled) {
      return;
    }

    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');

    if (parallaxElements.length === 0) {
      return;
    }

    // Track scroll position
    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Only apply parallax if element is near viewport
        if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
          let speed = CONFIG.parallaxSpeeds.medium;

          if (element.classList.contains('parallax-slow')) {
            speed = CONFIG.parallaxSpeeds.slow;
          } else if (element.classList.contains('parallax-fast')) {
            speed = CONFIG.parallaxSpeeds.fast;
          }

          // Calculate parallax offset
          const offset = (scrollY - elementTop) * speed;
          element.style.transform = `translateY(${offset}px)`;
        }
      });

      ticking = false;
    }

    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Update on scroll (throttled with requestAnimationFrame)
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });

    // Initial update
    updateParallax();

    console.log(`Initialized parallax for ${parallaxElements.length} elements`);
  }

  /* ============================================
     SCROLL PROGRESS INDICATOR
     ============================================ */

  /**
   * Create and update scroll progress bar
   */
  function initScrollProgress() {
    if (!CONFIG.scrollProgressEnabled) {
      return;
    }

    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    // Track scroll position
    let ticking = false;

    function updateScrollProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Calculate scroll percentage
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Update progress bar width
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;

      ticking = false;
    }

    function requestProgressUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    }

    // Update on scroll
    window.addEventListener('scroll', requestProgressUpdate, { passive: true });

    // Initial update
    updateScrollProgress();

    console.log('Scroll progress indicator initialized');
  }

  /* ============================================
     STAGGER ANIMATIONS
     ============================================ */

  /**
   * Apply stagger delays to children elements
   */
  function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.animate-stagger, .animate-stagger-fast, .animate-stagger-slow');

    staggerContainers.forEach(container => {
      const children = Array.from(container.children);
      let delay = CONFIG.staggerDelay;

      // Adjust delay based on container class
      if (container.classList.contains('animate-stagger-fast')) {
        delay = 50;
      } else if (container.classList.contains('animate-stagger-slow')) {
        delay = 200;
      }

      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * delay}ms`;
      });
    });

    if (staggerContainers.length > 0) {
      console.log(`Initialized stagger animations for ${staggerContainers.length} containers`);
    }
  }

  /* ============================================
     TEXT WORD ANIMATION
     ============================================ */

  /**
   * Split text into words and wrap each in a span for animation
   */
  function initTextWordAnimations() {
    const textElements = document.querySelectorAll('.animate-text-words');

    textElements.forEach(element => {
      const text = element.textContent;
      const words = text.split(' ');

      // Clear original text
      element.textContent = '';

      // Wrap each word in a span
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        element.appendChild(span);

        // Add space after word (except last word)
        if (index < words.length - 1) {
          element.appendChild(document.createTextNode(' '));
        }
      });
    });

    if (textElements.length > 0) {
      console.log(`Initialized text word animations for ${textElements.length} elements`);
    }
  }

  /* ============================================
     HOVER EFFECTS ENHANCEMENT
     ============================================ */

  /**
   * Add enhanced hover effects with touch support
   */
  function initHoverEffects() {
    const hoverElements = document.querySelectorAll('[class*="hover-"]');

    // Add touch support for mobile devices
    hoverElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.classList.add('is-touching');
      }, { passive: true });

      element.addEventListener('touchend', function() {
        this.classList.remove('is-touching');
      }, { passive: true });
    });

    if (hoverElements.length > 0) {
      console.log(`Enhanced hover effects for ${hoverElements.length} elements`);
    }
  }

  /* ============================================
     SMOOTH SCROLL TO ANCHOR LINKS
     ============================================ */

  /**
   * Enable smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        // Skip if href is just "#"
        if (targetId === '#') {
          return;
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });

    if (anchorLinks.length > 0) {
      console.log(`Enabled smooth scroll for ${anchorLinks.length} anchor links`);
    }
  }

  /* ============================================
     LAZY LOAD IMAGES WITH FADE-IN
     ============================================ */

  /**
   * Lazy load images with fade-in animation
   */
  function initLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

    if (lazyImages.length === 0) {
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Load image if data-src is present
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          // Add fade-in class
          img.classList.add('animate-fade-in', 'animate-active');

          imageObserver.unobserve(img);
        }
      });
    }, CONFIG.observerOptions);

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });

    console.log(`Lazy loading ${lazyImages.length} images`);
  }

  /* ============================================
     VIDEO AUTOPLAY ON SCROLL
     ============================================ */

  /**
   * Autoplay videos when they enter viewport
   */
  function initVideoAutoplay() {
    const videos = document.querySelectorAll('video[data-autoplay]');

    if (videos.length === 0) {
      return;
    }

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(err => {
            console.log('Video autoplay failed:', err);
          });
        } else {
          video.pause();
        }
      });
    }, {
      threshold: 0.5 // Play when 50% visible
    });

    videos.forEach(video => {
      videoObserver.observe(video);
    });

    console.log(`Initialized autoplay for ${videos.length} videos`);
  }

  /* ============================================
     PERFORMANCE MONITORING
     ============================================ */

  /**
   * Monitor animation performance
   */
  function monitorPerformance() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Log slow animations (>16ms = below 60fps)
            if (entry.duration > 16) {
              console.warn(`Slow animation detected: ${entry.name} (${entry.duration}ms)`);
            }
          }
        });

        observer.observe({ entryTypes: ['measure'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  /* ============================================
     INITIALIZE ALL ANIMATIONS
     ============================================ */

  /**
   * Main initialization function
   */
  function init() {
    console.log('Initializing animations...');

    // Core animations
    initScrollAnimations();
    initStaggerAnimations();
    initTextWordAnimations();

    // Scroll effects
    initParallax();
    initScrollProgress();
    initSmoothScroll();

    // Media
    initLazyImages();
    initVideoAutoplay();

    // Interactions
    initHoverEffects();

    // Performance
    if (process?.env?.NODE_ENV === 'development') {
      monitorPerformance();
    }

    console.log('Animations initialized successfully');
  }

  /* ============================================
     EXECUTION
     ============================================ */

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

  /* ============================================
     EXPOSE PUBLIC API
     ============================================ */

  // Expose API for manual control
  window.GeminiAnimations = {
    config: CONFIG,
    refresh: initScrollAnimations,
    updateParallax: initParallax,
    updateProgress: initScrollProgress
  };

})();
