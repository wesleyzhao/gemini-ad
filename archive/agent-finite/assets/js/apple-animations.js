/**
 * Apple-Inspired Animation Library
 *
 * Premium animation effects inspired by Apple.com including:
 * - Parallax scrolling
 * - Product showcase animations
 * - SVG path animations
 * - Canvas-based particle effects
 * - Video-like sequence animations
 * - Smooth easing and transitions
 */

class AppleAnimations {
  constructor() {
    this.scrollY = 0;
    this.ticking = false;
    this.init();
  }

  init() {
    this.setupParallax();
    this.setupProductShowcase();
    this.setupSVGAnimations();
    this.setupCanvasParticles();
    this.setupSequenceAnimations();
    this.setupScrollListener();
  }

  /**
   * Parallax Scrolling Effects
   * Creates depth and smooth movement on scroll
   */
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
      const direction = element.getAttribute('data-parallax-direction') || 'y';

      element.dataset.parallaxSpeed = speed;
      element.dataset.parallaxDirection = direction;
    });

    this.updateParallax();
  }

  updateParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const speed = parseFloat(element.dataset.parallaxSpeed);
      const direction = element.dataset.parallaxDirection;

      // Only animate if element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrolled = window.pageYOffset;
        const offset = (scrolled - rect.top) * speed;

        if (direction === 'y') {
          element.style.transform = `translate3d(0, ${offset}px, 0)`;
        } else if (direction === 'x') {
          element.style.transform = `translate3d(${offset}px, 0, 0)`;
        } else if (direction === 'scale') {
          const scale = 1 + (offset / 1000);
          element.style.transform = `scale(${Math.max(0.5, Math.min(1.5, scale))})`;
        }
      }
    });
  }

  /**
   * Product Showcase Animations
   * Apple-style feature reveals on scroll
   */
  setupProductShowcase() {
    const showcases = document.querySelectorAll('[data-showcase]');

    showcases.forEach(showcase => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateShowcase(entry.target);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(showcase);
    });
  }

  animateShowcase(element) {
    const items = element.querySelectorAll('[data-showcase-item]');

    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('showcase-active');
      }, index * 200);
    });
  }

  /**
   * SVG Path Animations
   * Smooth drawing/morphing effects
   */
  setupSVGAnimations() {
    const svgPaths = document.querySelectorAll('[data-svg-animate]');

    svgPaths.forEach(path => {
      const length = path.getTotalLength();

      // Set up initial state
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateSVGPath(entry.target, length);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(path);
    });
  }

  animateSVGPath(path, length) {
    const duration = parseFloat(path.getAttribute('data-svg-duration')) || 2000;
    const delay = parseFloat(path.getAttribute('data-svg-delay')) || 0;

    setTimeout(() => {
      path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      path.style.strokeDashoffset = '0';
    }, delay);
  }

  /**
   * Canvas Particle Effects
   * Dynamic, performant particle animations
   */
  setupCanvasParticles() {
    const canvases = document.querySelectorAll('[data-particles]');

    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const particleCount = parseInt(canvas.getAttribute('data-particle-count')) || 50;
      const particleColor = canvas.getAttribute('data-particle-color') || '#4285f4';

      // Set canvas size
      const resize = () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      };

      resize();
      window.addEventListener('resize', resize);

      // Create particles
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3
        });
      }

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        particles.forEach(particle => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.offsetWidth;
          if (particle.x > canvas.offsetWidth) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.offsetHeight;
          if (particle.y > canvas.offsetHeight) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.hexToRgba(particleColor, particle.opacity);
          ctx.fill();
        });

        // Connect nearby particles
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = this.hexToRgba(particleColor, (1 - distance / 100) * 0.2);
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  /**
   * Sequence Animations
   * Video-like frame-by-frame animations
   */
  setupSequenceAnimations() {
    const sequences = document.querySelectorAll('[data-sequence]');

    sequences.forEach(sequence => {
      const frameCount = parseInt(sequence.getAttribute('data-frame-count')) || 100;
      const scrollDistance = parseInt(sequence.getAttribute('data-scroll-distance')) || 2000;

      sequence.dataset.frameCount = frameCount;
      sequence.dataset.scrollDistance = scrollDistance;

      this.updateSequence(sequence);
    });
  }

  updateSequence(sequence) {
    const rect = sequence.getBoundingClientRect();
    const frameCount = parseInt(sequence.dataset.frameCount);
    const scrollDistance = parseInt(sequence.dataset.scrollDistance);

    // Calculate scroll progress
    const scrolled = window.pageYOffset - sequence.offsetTop + window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));

    // Calculate current frame
    const frame = Math.floor(progress * (frameCount - 1));

    // Apply transformations based on frame
    const scale = 0.8 + (progress * 0.2);
    const opacity = Math.min(1, progress * 2);
    const translateY = (1 - progress) * 100;

    sequence.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    sequence.style.opacity = opacity;

    // Update frame number for custom animations
    sequence.dataset.currentFrame = frame;
  }

  /**
   * Smooth Scroll Listener
   * Optimized scroll event handling
   */
  setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.pageYOffset;

      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();

          // Update sequence animations
          const sequences = document.querySelectorAll('[data-sequence]');
          sequences.forEach(seq => this.updateSequence(seq));

          this.ticking = false;
        });

        this.ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Utility: Convert hex to rgba
   */
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Magnetic Button Effect
   * Buttons that follow cursor (Apple-style)
   */
  static enableMagneticButtons() {
    const magneticButtons = document.querySelectorAll('[data-magnetic]');

    magneticButtons.forEach(button => {
      const strength = parseFloat(button.getAttribute('data-magnetic')) || 0.3;

      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  /**
   * Smooth Number Counter
   * Animates numbers counting up
   */
  static animateCounter(element, start, end, duration = 2000) {
    const startTime = performance.now();
    const range = end - start;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const current = start + (range * easeProgress);
      element.textContent = Math.floor(current).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = end.toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Text Reveal Animation
   * Apple-style text reveals
   */
  static enableTextReveal() {
    const textReveals = document.querySelectorAll('[data-text-reveal]');

    textReveals.forEach(element => {
      const text = element.textContent;
      const chars = text.split('');

      element.textContent = '';
      element.style.display = 'inline-block';

      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.display = 'inline-block';
        span.style.transition = `opacity 0.5s ${i * 0.03}s, transform 0.5s ${i * 0.03}s`;
        element.appendChild(span);
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            spans.forEach(span => {
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(element);
    });
  }

  /**
   * Image Sequence Player
   * Play through image sequences on scroll (like Apple product videos)
   */
  static createImageSequence(container, imageUrls, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    const images = [];
    let imagesLoaded = 0;

    // Load all images
    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === imageUrls.length) {
          setupSequence();
        }
      };
      img.src = url;
      images[index] = img;
    });

    const setupSequence = () => {
      canvas.width = images[0].width;
      canvas.height = images[0].height;

      const updateFrame = () => {
        const rect = container.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1,
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        ));

        const frameIndex = Math.floor(scrollProgress * (images.length - 1));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[frameIndex], 0, 0);
      };

      window.addEventListener('scroll', updateFrame, { passive: true });
      updateFrame();
    };
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AppleAnimations();
    AppleAnimations.enableMagneticButtons();
    AppleAnimations.enableTextReveal();
  });
} else {
  new AppleAnimations();
  AppleAnimations.enableMagneticButtons();
  AppleAnimations.enableTextReveal();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppleAnimations;
}
