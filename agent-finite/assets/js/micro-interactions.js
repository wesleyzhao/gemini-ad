/**
 * Gemini Ads - Micro-Interactions JavaScript
 *
 * Powers interactive micro-interactions for enhanced user engagement.
 * Inspired by Apple's attention to detail and modern UX patterns.
 *
 * Features:
 * - Magnetic buttons (cursor following)
 * - Card tilt effects (3D perspective)
 * - Float labels for forms
 * - Scroll progress indicator
 * - Back to top button
 * - Toast notifications
 * - Ripple effects
 * - Form validation animations
 *
 * Usage: Include this script and add data-attributes or classes
 * Example: <button class="btn-magnetic">Click me</button>
 */

(function() {
  'use strict';

  // ========================================
  // MAGNETIC BUTTONS
  // ========================================

  function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');

    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move the button towards the cursor (max 20px)
        const moveX = x * 0.3;
        const moveY = y * 0.3;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ========================================
  // CARD TILT EFFECT
  // ========================================

  function initCardTilt() {
    const tiltCards = document.querySelectorAll('.card-tilt');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10; // Max 10 degrees
        const rotateY = (centerX - x) / 10; // Max 10 degrees

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  // ========================================
  // FLOAT LABELS
  // ========================================

  function initFloatLabels() {
    const floatInputs = document.querySelectorAll('.input-float-label input, .input-float-label textarea');

    floatInputs.forEach(input => {
      // Add placeholder for detection
      if (!input.getAttribute('placeholder')) {
        input.setAttribute('placeholder', ' ');
      }

      // Check initial state
      if (input.value) {
        input.classList.add('has-value');
      }

      // Update on input
      input.addEventListener('input', () => {
        if (input.value) {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
    });
  }

  // ========================================
  // SCROLL PROGRESS INDICATOR
  // ========================================

  function initScrollProgress() {
    // Check if progress bar already exists
    let progressBar = document.querySelector('.scroll-progress');

    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
    }

    function updateScrollProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      progressBar.style.width = `${scrollPercentage}%`;
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial call
  }

  // ========================================
  // BACK TO TOP BUTTON
  // ========================================

  function initBackToTop() {
    // Check if button already exists
    let backToTop = document.querySelector('.back-to-top');

    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.className = 'back-to-top';
      backToTop.innerHTML = '↑';
      backToTop.setAttribute('aria-label', 'Back to top');
      document.body.appendChild(backToTop);
    }

    function toggleBackToTop() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop(); // Initial call
  }

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================

  const MicroToast = {
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },

    show(message, type = 'info', duration = 3000) {
      this.init();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const icon = this.getIcon(type);
      const text = document.createElement('span');
      text.textContent = message;

      toast.appendChild(icon);
      toast.appendChild(text);

      this.container.appendChild(toast);

      // Auto remove
      setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, duration);
    },

    getIcon(type) {
      const icon = document.createElement('span');
      icon.style.fontSize = '20px';

      switch(type) {
        case 'success':
          icon.textContent = '✓';
          icon.style.color = '#34a853';
          break;
        case 'error':
          icon.textContent = '✕';
          icon.style.color = '#ea4335';
          break;
        case 'warning':
          icon.textContent = '⚠';
          icon.style.color = '#fbbc04';
          break;
        default:
          icon.textContent = 'ℹ';
          icon.style.color = '#4285f4';
      }

      return icon;
    }
  };

  // Expose to window for easy usage
  window.MicroToast = MicroToast;

  // ========================================
  // FORM VALIDATION ANIMATIONS
  // ========================================

  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
          if (!input.value.trim()) {
            input.classList.add('input-error');
            setTimeout(() => input.classList.remove('input-error'), 500);
            isValid = false;
          } else {
            input.classList.add('input-success');
            setTimeout(() => input.classList.remove('input-success'), 500);
          }
        });

        if (isValid) {
          MicroToast.show('Form submitted successfully!', 'success');
        } else {
          MicroToast.show('Please fill in all required fields', 'error');
        }
      });
    });
  }

  // ========================================
  // RIPPLE EFFECT ON CLICK
  // ========================================

  function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.btn-ripple');

    rippleButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        // Get click position
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set ripple position and size
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x - size / 2 + 'px';
        ripple.style.top = y - size / 2 + 'px';

        // Add to button
        this.appendChild(ripple);

        // Remove after animation
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ========================================
  // TOOLTIP POSITIONING
  // ========================================

  function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    tooltips.forEach(element => {
      const tooltipText = element.getAttribute('data-tooltip');

      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip-text';
      tooltip.textContent = tooltipText;

      element.classList.add('tooltip');
      element.appendChild(tooltip);

      // Position adjustment on hover
      element.addEventListener('mouseenter', () => {
        const rect = tooltip.getBoundingClientRect();
        if (rect.left < 0) {
          tooltip.style.left = '0';
          tooltip.style.transform = 'translateX(0)';
        }
        if (rect.right > window.innerWidth) {
          tooltip.style.left = 'auto';
          tooltip.style.right = '0';
          tooltip.style.transform = 'translateX(0)';
        }
      });
    });
  }

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-scroll-animation]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.getAttribute('data-scroll-animation');
          entry.target.style.opacity = '1';

          switch(animationType) {
            case 'fade-in':
              entry.target.style.transform = 'translateY(0)';
              break;
            case 'slide-left':
              entry.target.style.transform = 'translateX(0)';
              break;
            case 'slide-right':
              entry.target.style.transform = 'translateX(0)';
              break;
            case 'scale':
              entry.target.style.transform = 'scale(1)';
              break;
          }
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
      // Set initial state
      element.style.opacity = '0';
      element.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';

      const animationType = element.getAttribute('data-scroll-animation');
      switch(animationType) {
        case 'fade-in':
          element.style.transform = 'translateY(30px)';
          break;
        case 'slide-left':
          element.style.transform = 'translateX(-30px)';
          break;
        case 'slide-right':
          element.style.transform = 'translateX(30px)';
          break;
        case 'scale':
          element.style.transform = 'scale(0.9)';
          break;
      }

      observer.observe(element);
    });
  }

  // ========================================
  // COUNTER ANIMATION
  // ========================================

  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const target = parseInt(entry.target.getAttribute('data-counter'));
          animateCounter(entry.target, target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ========================================
  // COPY TO CLIPBOARD
  // ========================================

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');

    copyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const textToCopy = button.getAttribute('data-copy');

        navigator.clipboard.writeText(textToCopy).then(() => {
          MicroToast.show('Copied to clipboard!', 'success');

          // Visual feedback
          const originalText = button.textContent;
          button.textContent = '✓ Copied';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }).catch(() => {
          MicroToast.show('Failed to copy', 'error');
        });
      });
    });
  }

  // ========================================
  // LAZY LOAD IMAGES
  // ========================================

  function initLazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================

  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    initMagneticButtons();
    initCardTilt();
    initFloatLabels();
    initScrollProgress();
    initBackToTop();
    initFormValidation();
    initRippleEffect();
    initTooltips();
    initScrollAnimations();
    initCounters();
    initCopyButtons();
    initLazyLoadImages();
    initSmoothScroll();

    // Log initialization
    console.log('✨ Micro-interactions initialized');
  }

  // Auto-initialize
  init();

  // Expose API for manual usage
  window.MicroInteractions = {
    toast: MicroToast,
    animateCounter,
    init: initAll
  };

})();
