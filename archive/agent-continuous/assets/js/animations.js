/**
 * Gemini Ad Campaign - Animation Utilities
 * Apple.com-inspired smooth animations and interactions
 */

// ============================================
// INTERSECTION OBSERVER - Scroll Animations
// ============================================

/**
 * Initialize scroll-triggered animations
 * Observes elements and triggers animations when they enter viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animate;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    element.classList.add(animationType);
                    element.style.opacity = '1';
                }, delay);

                // Optionally unobserve after animation
                if (element.dataset.once !== 'false') {
                    observer.unobserve(element);
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// ============================================
// PARALLAX SCROLLING
// ============================================

/**
 * Create parallax effect for hero sections
 * Elements with data-parallax will move at different speeds
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// ============================================
// SMOOTH SCROLL TO ANCHOR
// ============================================

/**
 * Smooth scroll to anchor links
 * Enhanced version with easing
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerOffset = document.querySelector('.header')?.offsetHeight || 0;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// HEADER SCROLL BEHAVIOR
// ============================================

/**
 * Hide/show header on scroll
 * Apple.com-style header behavior
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Ignore small scrolls
        if (Math.abs(currentScroll - lastScroll) < scrollThreshold) return;

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// ============================================
// STAGGER ANIMATION
// ============================================

/**
 * Stagger animation for lists of items
 * Children animate in sequence
 */
function initStaggerAnimation(container, itemSelector, delayIncrement = 100) {
    const items = container.querySelectorAll(itemSelector);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll(itemSelector);
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('fade-in');
                        item.style.opacity = '1';
                    }, index * delayIncrement);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(container);
}

// ============================================
// TYPING EFFECT
// ============================================

/**
 * Typewriter effect for text
 * Simulates typing animation
 */
function typewriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================
// COUNTER ANIMATION
// ============================================

/**
 * Animate numbers counting up
 * Useful for statistics and metrics
 */
function animateCounter(element, start, end, duration = 2000) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = Math.round(end);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// ============================================
// CARD TILT EFFECT
// ============================================

/**
 * 3D tilt effect on mouse move
 * Apple.com-style interactive cards
 */
function initCardTilt(cards) {
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
}

// ============================================
// SLIDING PANEL
// ============================================

/**
 * Sliding panel showcase
 * For use case demonstrations
 */
class SlidingPanel {
    constructor(container) {
        this.container = container;
        this.panels = container.querySelectorAll('.panel');
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.createNavigation();
        this.showPanel(0);
        this.startAutoPlay();
    }

    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'panel-navigation';

        this.panels.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'panel-dot';
            dot.setAttribute('aria-label', `Go to panel ${index + 1}`);
            dot.addEventListener('click', () => this.goToPanel(index));
            nav.appendChild(dot);
        });

        this.container.appendChild(nav);
        this.dots = nav.querySelectorAll('.panel-dot');
    }

    showPanel(index) {
        this.panels.forEach((panel, i) => {
            panel.classList.toggle('active', i === index);
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    }

    goToPanel(index) {
        this.showPanel(index);
        this.resetAutoPlay();
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.panels.length;
        this.showPanel(nextIndex);
    }

    startAutoPlay(interval = 5000) {
        this.autoPlayTimer = setInterval(() => this.next(), interval);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayTimer);
        this.startAutoPlay();
    }

    destroy() {
        clearInterval(this.autoPlayTimer);
    }
}

// ============================================
// VIDEO INLINE PLAY WITH LAZY LOADING
// ============================================

/**
 * Lazy load and autoplay videos when in viewport
 * Pause when out of viewport
 * 2026 Best Practice: Only load video sources when needed
 */
function initVideoAutoplay() {
    const videos = document.querySelectorAll('video[data-autoplay]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                // Lazy load video sources if they haven't been loaded yet
                if (video.dataset.lazyLoad === 'true' && !video.dataset.loaded) {
                    const sources = video.querySelectorAll('source[data-src]');
                    sources.forEach(source => {
                        source.src = source.dataset.src;
                        source.removeAttribute('data-src');
                    });
                    video.load();
                    video.dataset.loaded = 'true';
                }

                // Play video
                video.play().catch(err => console.log('Video autoplay prevented:', err));
            } else {
                // Pause when out of viewport to save resources
                video.pause();
            }
        });
    }, {
        threshold: 0.25, // Start loading a bit earlier
        rootMargin: '50px' // Preload 50px before entering viewport
    });

    videos.forEach(video => {
        // Add loading class for visual feedback
        video.classList.add('lazy-video');
        observer.observe(video);
    });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

/**
 * Magnetic effect for buttons
 * Button follows cursor slightly
 */
function initMagneticButtons(buttons) {
    buttons.forEach(button => {
        button.addEventListener('mousemove', magneticMove);
        button.addEventListener('mouseleave', magneticReset);
    });

    function magneticMove(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }

    function magneticReset(e) {
        const button = e.currentTarget;
        button.style.transform = 'translate(0, 0)';
    }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

/**
 * Lazy load images with fade-in effect
 * 2026 Best Practice: Native loading="lazy" is preferred,
 * but this provides fallback and loading states
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    // For browsers that don't support native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;

                // Add srcset if present
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-srcset');
                }

                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                });
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before entering viewport
    });

    images.forEach(img => {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
    });
}

/**
 * Lazy load iframes (embeds, videos)
 * 2026 Best Practice: Defer iframe loading to improve INP and LCP
 */
function initIframeLazyLoading() {
    const iframes = document.querySelectorAll('iframe[data-src]');

    const iframeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
                iframe.classList.add('loaded');
                iframeObserver.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '100px' // Preload iframes a bit earlier for smooth experience
    });

    iframes.forEach(iframe => {
        iframe.classList.add('lazy-iframe');
        iframeObserver.observe(iframe);
    });
}

// ============================================
// GRADIENT ANIMATION
// ============================================

/**
 * Animated gradient background
 * Creates flowing color effect
 */
function initGradientAnimation(element) {
    let hue = 0;

    function animate() {
        hue = (hue + 0.5) % 360;
        element.style.background = `linear-gradient(135deg,
            hsl(${hue}, 70%, 60%),
            hsl(${(hue + 60) % 360}, 70%, 60%)
        )`;
        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// SVG ANIMATION LAZY LOADING
// ============================================

/**
 * Lazy load SVG path animations
 * 2026 Best Practice: Defer expensive draw animations
 */
function initSVGLazyLoading() {
    const svgs = document.querySelectorAll('svg[data-animate-draw]');

    const svgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const svg = entry.target;
                const paths = svg.querySelectorAll('path, circle, line, polyline, rect');

                paths.forEach(path => {
                    const length = path.getTotalLength ? path.getTotalLength() : 0;
                    if (length) {
                        path.style.strokeDasharray = length;
                        path.style.strokeDashoffset = length;
                        path.style.animation = `drawPath 2s ease-out forwards`;
                    }
                });

                svg.classList.add('svg-animated');
                svgObserver.unobserve(svg);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    svgs.forEach(svg => svgObserver.observe(svg));
}

/**
 * Defer heavy animations until needed
 * 2026 Best Practice: Respect prefers-reduced-motion
 */
function initDeferredAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Disable heavy animations
        document.body.classList.add('reduce-motion');
        return;
    }

    // Defer parallax until after critical content loads
    if (document.querySelector('[data-parallax]')) {
        requestIdleCallback(() => initParallax(), { timeout: 2000 });
    }

    // Defer tilt effects
    const tiltCards = document.querySelectorAll('.card-tilt');
    if (tiltCards.length) {
        requestIdleCallback(() => initCardTilt(tiltCards), { timeout: 2000 });
    }

    // Defer magnetic buttons
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    if (magneticBtns.length) {
        requestIdleCallback(() => initMagneticButtons(magneticBtns), { timeout: 2000 });
    }
}

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback, options) {
        const start = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
            });
        }, 1);
    };
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

/**
 * Keyboard navigation support
 * 2026 WCAG 2.1 AA Compliance
 */
function initKeyboardNavigation() {
    // Escape key handling for modals and panels
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            // Close any open modals or panels
            const openModals = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
            openModals.forEach(modal => {
                const closeButton = modal.querySelector('[data-close-modal]');
                if (closeButton) closeButton.click();
            });

            // Close any open dropdowns
            const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
            openDropdowns.forEach(dropdown => {
                dropdown.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Tab trap for modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
        modal.addEventListener('keydown', trapFocus);
    });

    // Arrow key navigation for card grids
    initArrowKeyNavigation();

    // Enter/Space for custom interactive elements
    initCustomKeyPressHandlers();
}

/**
 * Trap focus within modal dialogs
 */
function trapFocus(e) {
    if (e.key !== 'Tab' && e.keyCode !== 9) return;

    const modal = e.currentTarget;
    const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

/**
 * Arrow key navigation for card grids
 */
function initArrowKeyNavigation() {
    const grids = document.querySelectorAll('[role="grid"], .grid, .gallery-grid');

    grids.forEach(grid => {
        const cards = Array.from(grid.querySelectorAll('.card, .page-card, [role="article"]'));

        cards.forEach((card, index) => {
            // Make cards focusable
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }

            card.addEventListener('keydown', (e) => {
                let targetIndex = index;

                switch (e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = Math.min(index + 1, cards.length - 1);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = Math.max(index - 1, 0);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        // Calculate columns based on grid
                        const cols = getGridColumns(grid);
                        targetIndex = Math.min(index + cols, cards.length - 1);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const columnsUp = getGridColumns(grid);
                        targetIndex = Math.max(index - columnsUp, 0);
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = cards.length - 1;
                        break;
                }

                if (targetIndex !== index) {
                    cards[targetIndex].focus();
                }
            });

            // Enter activates card link
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    const link = card.querySelector('a');
                    if (link) {
                        link.click();
                    }
                }
            });
        });
    });
}

/**
 * Get number of columns in grid
 */
function getGridColumns(grid) {
    const firstCard = grid.querySelector('.card, .page-card, [role="article"]');
    if (!firstCard) return 1;

    const gridComputedStyle = window.getComputedStyle(grid);
    const gridTemplateColumns = gridComputedStyle.gridTemplateColumns;

    if (gridTemplateColumns && gridTemplateColumns !== 'none') {
        return gridTemplateColumns.split(' ').length;
    }

    return 1;
}

/**
 * Custom keyboard handlers for interactive elements
 */
function initCustomKeyPressHandlers() {
    // Handle div/span elements with role="button"
    const customButtons = document.querySelectorAll('[role="button"]:not(button)');

    customButtons.forEach(button => {
        // Make focusable
        if (!button.hasAttribute('tabindex')) {
            button.setAttribute('tabindex', '0');
        }

        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Handle citation markers
    const citations = document.querySelectorAll('.citation-marker');
    citations.forEach(citation => {
        if (!citation.hasAttribute('tabindex')) {
            citation.setAttribute('tabindex', '0');
        }
        citation.setAttribute('role', 'button');
        citation.setAttribute('aria-label', `View source citation ${citation.textContent}`);
    });
}

/**
 * ARIA live region announcements
 * Announce dynamic content changes to screen readers
 */
function announceToScreenReader(message, priority = 'polite') {
    // Create or get existing live region
    let liveRegion = document.getElementById('aria-live-announcer');

    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-announcer';
        liveRegion.className = 'aria-live-region';
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }

    // Clear and announce
    liveRegion.textContent = '';
    setTimeout(() => {
        liveRegion.textContent = message;
    }, 100);

    // Clear after announcement
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 5000);
}

/**
 * Announce animation state changes
 */
function enhanceScrollAnimationsWithAria() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const ariaLabel = element.getAttribute('aria-label') ||
                                element.textContent.substring(0, 50);

                // Don't announce decorative elements
                if (element.getAttribute('aria-hidden') !== 'true') {
                    // Only announce important content
                    if (element.matches('h1, h2, h3, [role="alert"]')) {
                        announceToScreenReader(`${ariaLabel} appeared`, 'polite');
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    animatedElements.forEach(element => observer.observe(element));
}

/**
 * Enhance Sliding Panel with keyboard support
 */
class AccessibleSlidingPanel extends SlidingPanel {
    init() {
        super.init();
        this.addKeyboardSupport();
        this.addAriaAttributes();
    }

    addKeyboardSupport() {
        // Arrow keys to navigate panels
        this.container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previous();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
            }
        });

        // Make dots keyboard accessible
        this.dots.forEach((dot, index) => {
            dot.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToPanel(index);
                }
            });
        });
    }

    addAriaAttributes() {
        // Add role and labels to container
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Interactive panel showcase');

        // Add ARIA to panels
        this.panels.forEach((panel, index) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-label', `Panel ${index + 1} of ${this.panels.length}`);
            panel.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
        });

        // Add ARIA to dots
        this.dots.forEach((dot, index) => {
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');
            dot.setAttribute('aria-controls', `panel-${index}`);
        });
    }

    showPanel(index) {
        super.showPanel(index);

        // Update ARIA states
        this.panels.forEach((panel, i) => {
            panel.setAttribute('tabindex', i === index ? '0' : '-1');
        });

        this.dots.forEach((dot, i) => {
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });

        // Announce panel change
        announceToScreenReader(`Showing panel ${index + 1} of ${this.panels.length}`, 'polite');
    }

    previous() {
        const prevIndex = (this.currentIndex - 1 + this.panels.length) % this.panels.length;
        this.goToPanel(prevIndex);
    }
}

/**
 * Enhanced video autoplay with keyboard controls
 */
function initAccessibleVideoAutoplay() {
    const videos = document.querySelectorAll('video[data-autoplay]');

    videos.forEach(video => {
        // Add ARIA labels
        video.setAttribute('aria-label', video.getAttribute('title') || 'Video content');

        // Add keyboard controls
        video.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    video.paused ? video.play() : video.pause();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime += 5;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime -= 5;
                    break;
                case 'f':
                    e.preventDefault();
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    }
                    break;
                case 'm':
                    e.preventDefault();
                    video.muted = !video.muted;
                    break;
            }
        });

        // Announce play/pause state
        video.addEventListener('play', () => {
            announceToScreenReader('Video playing', 'polite');
        });

        video.addEventListener('pause', () => {
            announceToScreenReader('Video paused', 'polite');
        });
    });

    // Call original video autoplay
    initVideoAutoplay();
}

/**
 * Focus management utilities
 */
const FocusManager = {
    // Store last focused element before opening modal
    lastFocusedElement: null,

    // Save current focus
    saveFocus() {
        this.lastFocusedElement = document.activeElement;
    },

    // Restore previous focus
    restoreFocus() {
        if (this.lastFocusedElement && this.lastFocusedElement.focus) {
            this.lastFocusedElement.focus();
        }
    },

    // Move focus to element
    moveFocusTo(element) {
        if (element && element.focus) {
            element.focus();
        }
    },

    // Get all focusable elements within container
    getFocusableElements(container) {
        return container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), ' +
            'input:not([disabled]), select:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        );
    }
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all animations on page load
 * 2026 Best Practice: Lazy load everything possible
 */
document.addEventListener('DOMContentLoaded', () => {
    // ACCESSIBILITY FIRST - Initialize keyboard navigation
    initKeyboardNavigation();

    // Critical animations (load immediately)
    initScrollAnimations();
    initSmoothScroll();

    // Enhanced ARIA announcements for animations
    enhanceScrollAnimationsWithAria();

    // Lazy loading (load immediately but defer actual loading)
    initLazyLoading();
    initIframeLazyLoading();

    // Video lazy loading with accessibility
    if (document.querySelector('[data-autoplay]')) {
        initAccessibleVideoAutoplay();
    }

    // SVG animations (defer until in viewport)
    if (document.querySelector('[data-animate-draw]')) {
        initSVGLazyLoading();
    }

    // Header scroll behavior
    if (document.querySelector('.header')) {
        initHeaderScroll();
    }

    // Initialize accessible sliding panels
    document.querySelectorAll('.sliding-panel-container').forEach(container => {
        new AccessibleSlidingPanel(container);
    });

    // Defer heavy animations (respect reduced motion, use idle time)
    initDeferredAnimations();

    // Create global ARIA live region
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-announcer';
    liveRegion.className = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get scroll percentage
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initScrollAnimations,
        initParallax,
        initSmoothScroll,
        initHeaderScroll,
        initStaggerAnimation,
        typewriterEffect,
        animateCounter,
        initCardTilt,
        SlidingPanel,
        initVideoAutoplay,
        initMagneticButtons,
        initLazyLoading,
        initGradientAnimation,
        debounce,
        throttle,
        isInViewport,
        getScrollPercentage
    };
}
