/**
 * Hero Media Manager
 * Handles hero video backgrounds and animated SVG graphics
 * Inspired by Apple.com premium aesthetics
 *
 * Features:
 * - Video background with fallback images
 * - Lazy loading for performance
 * - SVG animation management
 * - Responsive video optimization
 * - Automatic play/pause on visibility
 * - Prefers-reduced-motion support
 *
 * @version 1.0.0
 */

(function() {
  'use strict';

  const HeroMedia = {
    /**
     * Initialize all hero media elements
     */
    init() {
      this.initVideoBackgrounds();
      this.initSVGGraphics();
      this.setupIntersectionObserver();
      this.setupReducedMotion();
      console.log('Hero Media initialized');
    },

    /**
     * Initialize video backgrounds
     */
    initVideoBackgrounds() {
      const videoContainers = document.querySelectorAll('[data-hero-video]');

      videoContainers.forEach(container => {
        const videoSrc = container.dataset.heroVideo;
        const fallbackImage = container.dataset.heroFallback;
        const autoplay = container.dataset.heroAutoplay !== 'false';
        const loop = container.dataset.heroLoop !== 'false';
        const muted = container.dataset.heroMuted !== 'false';

        // Create video element
        const video = this.createVideoElement(videoSrc, {
          autoplay,
          loop,
          muted,
          playsinline: true,
          preload: 'metadata'
        });

        // Add fallback image
        if (fallbackImage) {
          container.style.backgroundImage = `url(${fallbackImage})`;
          container.style.backgroundSize = 'cover';
          container.style.backgroundPosition = 'center';
        }

        // Insert video
        container.appendChild(video);

        // Handle video load
        video.addEventListener('loadeddata', () => {
          container.classList.add('hero-video-loaded');
          if (autoplay) {
            this.playVideo(video);
          }
        });

        // Handle video errors
        video.addEventListener('error', () => {
          console.warn('Video failed to load, using fallback image');
          container.classList.add('hero-video-error');
        });
      });
    },

    /**
     * Create video element with attributes
     */
    createVideoElement(src, attributes = {}) {
      const video = document.createElement('video');
      video.className = 'hero-video';

      // Set attributes
      Object.keys(attributes).forEach(key => {
        if (attributes[key] === true) {
          video.setAttribute(key, '');
        } else if (attributes[key] !== false) {
          video.setAttribute(key, attributes[key]);
        }
      });

      // Add source
      const source = document.createElement('source');
      source.src = src;
      source.type = this.getVideoType(src);
      video.appendChild(source);

      return video;
    },

    /**
     * Get video MIME type from filename
     */
    getVideoType(src) {
      const extension = src.split('.').pop().toLowerCase();
      const types = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'ogg': 'video/ogg',
        'mov': 'video/quicktime'
      };
      return types[extension] || 'video/mp4';
    },

    /**
     * Play video with error handling
     */
    playVideo(video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Video autoplay failed:', error);
        });
      }
    },

    /**
     * Initialize SVG graphics
     */
    initSVGGraphics() {
      const svgContainers = document.querySelectorAll('[data-hero-svg]');

      svgContainers.forEach(container => {
        const svgId = container.dataset.heroSvg;
        const svgColor = container.dataset.heroSvgColor || null;
        const svgOpacity = container.dataset.heroSvgOpacity || '0.5';

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('hero-svg');
        svg.setAttribute('aria-hidden', 'true');

        // Set opacity
        svg.style.opacity = svgOpacity;

        // Add use element referencing the symbol
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `../assets/svg/hero-graphics.svg#${svgId}`);

        // Apply color override if specified
        if (svgColor) {
          svg.style.color = svgColor;
        }

        svg.appendChild(use);
        container.appendChild(svg);

        // Mark as loaded
        container.classList.add('hero-svg-loaded');
      });
    },

    /**
     * Setup Intersection Observer for video play/pause
     */
    setupIntersectionObserver() {
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting) {
              this.playVideo(video);
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.25 }
      );

      const videoContainers = document.querySelectorAll('[data-hero-video]');
      videoContainers.forEach(container => observer.observe(container));
    },

    /**
     * Setup reduced motion support
     */
    setupReducedMotion() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      const handleReducedMotion = (e) => {
        if (e.matches) {
          // Pause all videos
          document.querySelectorAll('.hero-video').forEach(video => {
            video.pause();
          });

          // Disable SVG animations
          document.querySelectorAll('.hero-svg').forEach(svg => {
            svg.style.animation = 'none';
          });

          // Add reduced motion class
          document.body.classList.add('reduced-motion');
        } else {
          // Re-enable animations
          document.body.classList.remove('reduced-motion');

          // Restart videos
          document.querySelectorAll('.hero-video').forEach(video => {
            this.playVideo(video);
          });
        }
      };

      // Check initial state
      handleReducedMotion(prefersReducedMotion);

      // Listen for changes
      prefersReducedMotion.addEventListener('change', handleReducedMotion);
    },

    /**
     * Create a gradient overlay
     * @param {string} colors - Comma-separated color values
     * @param {number} angle - Gradient angle in degrees
     */
    createGradientOverlay(container, colors = '#4285f4,#34a853', angle = 135) {
      const overlay = document.createElement('div');
      overlay.className = 'hero-gradient-overlay';

      const colorArray = colors.split(',').map(c => c.trim());
      const gradient = `linear-gradient(${angle}deg, ${colorArray.join(', ')})`;
      overlay.style.background = gradient;

      container.appendChild(overlay);
    },

    /**
     * Lazy load hero media when in viewport
     */
    lazyLoadHeroMedia() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: load immediately
        this.init();
        return;
      }

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.init();
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      const heroSection = document.querySelector('.hero, [data-hero-video], [data-hero-svg]');
      if (heroSection) {
        observer.observe(heroSection);
      } else {
        // No hero section found, init anyway
        this.init();
      }
    }
  };

  /**
   * Utility functions for creating hero media programmatically
   */
  window.HeroMediaUtils = {
    /**
     * Add video background to an element
     * @param {HTMLElement} element - Target element
     * @param {string} videoSrc - Video source URL
     * @param {Object} options - Configuration options
     */
    addVideoBackground(element, videoSrc, options = {}) {
      const defaults = {
        autoplay: true,
        loop: true,
        muted: true,
        fallback: null,
        overlay: false,
        overlayOpacity: 0.5
      };

      const config = { ...defaults, ...options };

      element.setAttribute('data-hero-video', videoSrc);
      if (config.fallback) {
        element.setAttribute('data-hero-fallback', config.fallback);
      }
      if (!config.autoplay) {
        element.setAttribute('data-hero-autoplay', 'false');
      }
      if (!config.loop) {
        element.setAttribute('data-hero-loop', 'false');
      }
      if (!config.muted) {
        element.setAttribute('data-hero-muted', 'false');
      }

      // Add overlay if requested
      if (config.overlay) {
        const overlay = document.createElement('div');
        overlay.className = 'hero-video-overlay';
        overlay.style.opacity = config.overlayOpacity;
        element.appendChild(overlay);
      }

      // Initialize
      HeroMedia.initVideoBackgrounds();
    },

    /**
     * Add SVG graphic to an element
     * @param {HTMLElement} element - Target element
     * @param {string} svgId - SVG symbol ID
     * @param {Object} options - Configuration options
     */
    addSVGGraphic(element, svgId, options = {}) {
      const defaults = {
        color: null,
        opacity: 0.5,
        position: 'absolute'
      };

      const config = { ...defaults, ...options };

      element.setAttribute('data-hero-svg', svgId);
      if (config.color) {
        element.setAttribute('data-hero-svg-color', config.color);
      }
      element.setAttribute('data-hero-svg-opacity', config.opacity);

      // Set positioning
      if (config.position === 'absolute' && !element.style.position) {
        element.style.position = 'relative';
      }

      // Initialize
      HeroMedia.initSVGGraphics();
    },

    /**
     * Create a canvas particle background
     * @param {HTMLElement} element - Target element
     * @param {Object} options - Particle configuration
     */
    createParticleBackground(element, options = {}) {
      const defaults = {
        particleCount: 50,
        color: '#4285f4',
        opacity: 0.5,
        speed: 1,
        size: 2
      };

      const config = { ...defaults, ...options };

      const canvas = document.createElement('canvas');
      canvas.className = 'hero-particles-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';

      element.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const particles = [];

      // Resize canvas
      const resize = () => {
        canvas.width = element.offsetWidth;
        canvas.height = element.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      // Create particles
      for (let i = 0; i < config.particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          size: Math.random() * config.size + 1
        });
      }

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = config.color;
        ctx.globalAlpha = config.opacity;

        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        requestAnimationFrame(animate);
      };

      animate();
    }
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HeroMedia.lazyLoadHeroMedia());
  } else {
    HeroMedia.lazyLoadHeroMedia();
  }

  // Export for manual initialization
  window.HeroMedia = HeroMedia;
})();
