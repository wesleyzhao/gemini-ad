/**
 * Enhanced Lazy Loading Module for Gemini Landing Pages
 *
 * Provides advanced lazy loading capabilities for:
 * - Images (<img>, <picture>, background-image)
 * - Videos (<video>, <iframe>)
 * - Heavy content sections
 * - Third-party embeds
 *
 * Features:
 * - Intersection Observer API for performance
 * - Progressive image loading with blur-up effect
 * - Automatic retry on failure
 * - Bandwidth-aware loading (respects Save-Data)
 * - Loading placeholders and skeletons
 * - Analytics events for loading metrics
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        // Root margin: start loading before element is visible
        rootMargin: '50px 0px',

        // Threshold: percentage of element that must be visible
        threshold: 0.01,

        // Enable blur-up effect for images
        enableBlurUp: true,

        // Respect user's data saver preference
        respectDataSaver: true,

        // Retry failed loads
        enableRetry: true,
        maxRetries: 3,
        retryDelay: 1000,

        // Class names
        classes: {
            lazy: 'lazy',
            loading: 'lazy-loading',
            loaded: 'lazy-loaded',
            error: 'lazy-error',
            placeholder: 'lazy-placeholder'
        }
    };

    // Check if user has enabled data saver
    const isDataSaverEnabled = () => {
        return config.respectDataSaver &&
               navigator.connection &&
               navigator.connection.saveData === true;
    };

    // Check if user prefers reduced motion
    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Enhanced Intersection Observer
    const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: config.rootMargin,
        threshold: config.threshold
    });

    // Load an element (image, video, etc.)
    function loadElement(element, retryCount = 0) {
        // Skip if data saver is enabled and element is not critical
        if (isDataSaverEnabled() && !element.hasAttribute('data-critical')) {
            showDataSaverNotice(element);
            return;
        }

        element.classList.add(config.classes.loading);

        // Determine element type and load accordingly
        if (element.tagName === 'IMG') {
            loadImage(element, retryCount);
        } else if (element.tagName === 'PICTURE') {
            loadPicture(element, retryCount);
        } else if (element.tagName === 'VIDEO') {
            loadVideo(element);
        } else if (element.tagName === 'IFRAME') {
            loadIframe(element);
        } else if (element.hasAttribute('data-bg')) {
            loadBackgroundImage(element, retryCount);
        } else {
            loadContent(element);
        }
    }

    // Load regular <img> element
    function loadImage(img, retryCount = 0) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (!src && !srcset) {
            console.warn('Lazy image missing data-src or data-srcset', img);
            return;
        }

        // Create a new image to test loading
        const tempImg = new Image();

        tempImg.onload = () => {
            // Successfully loaded, apply to actual image
            if (srcset) img.srcset = srcset;
            if (src) img.src = src;

            // Apply blur-up effect
            if (config.enableBlurUp && !prefersReducedMotion()) {
                img.style.filter = 'blur(0)';
                img.style.transition = 'filter 0.3s ease';
            }

            img.classList.remove(config.classes.loading);
            img.classList.add(config.classes.loaded);

            // Remove placeholder
            const placeholder = img.parentElement?.querySelector(`.${config.classes.placeholder}`);
            if (placeholder) {
                placeholder.style.opacity = '0';
                setTimeout(() => placeholder.remove(), 300);
            }

            // Track loading success
            trackLazyLoad('image', 'success', img.src);
        };

        tempImg.onerror = () => {
            // Retry if enabled
            if (config.enableRetry && retryCount < config.maxRetries) {
                setTimeout(() => {
                    loadImage(img, retryCount + 1);
                }, config.retryDelay * (retryCount + 1));
            } else {
                img.classList.remove(config.classes.loading);
                img.classList.add(config.classes.error);
                showErrorPlaceholder(img);
                trackLazyLoad('image', 'error', img.dataset.src);
            }
        };

        // Start loading
        if (srcset) tempImg.srcset = srcset;
        if (src) tempImg.src = src;
    }

    // Load <picture> element
    function loadPicture(picture, retryCount = 0) {
        const sources = picture.querySelectorAll('source[data-srcset]');
        const img = picture.querySelector('img');

        // Load all source elements
        sources.forEach(source => {
            source.srcset = source.dataset.srcset;
            delete source.dataset.srcset;
        });

        // Load the img element
        if (img && img.dataset.src) {
            loadImage(img, retryCount);
        }
    }

    // Load background image
    function loadBackgroundImage(element, retryCount = 0) {
        const bgUrl = element.dataset.bg;

        if (!bgUrl) return;

        // Preload the image
        const tempImg = new Image();

        tempImg.onload = () => {
            element.style.backgroundImage = `url('${bgUrl}')`;
            element.classList.remove(config.classes.loading);
            element.classList.add(config.classes.loaded);

            if (config.enableBlurUp && !prefersReducedMotion()) {
                element.style.filter = 'blur(0)';
                element.style.transition = 'filter 0.3s ease';
            }

            trackLazyLoad('background', 'success', bgUrl);
        };

        tempImg.onerror = () => {
            if (config.enableRetry && retryCount < config.maxRetries) {
                setTimeout(() => {
                    loadBackgroundImage(element, retryCount + 1);
                }, config.retryDelay * (retryCount + 1));
            } else {
                element.classList.remove(config.classes.loading);
                element.classList.add(config.classes.error);
                trackLazyLoad('background', 'error', bgUrl);
            }
        };

        tempImg.src = bgUrl;
    }

    // Load video
    function loadVideo(video) {
        const sources = video.querySelectorAll('source[data-src]');

        sources.forEach(source => {
            source.src = source.dataset.src;
            delete source.dataset.src;
        });

        if (video.dataset.src) {
            video.src = video.dataset.src;
        }

        video.load();

        video.classList.remove(config.classes.loading);
        video.classList.add(config.classes.loaded);

        trackLazyLoad('video', 'success', video.src);
    }

    // Load iframe (YouTube, etc.)
    function loadIframe(iframe) {
        if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            delete iframe.dataset.src;
        }

        iframe.classList.remove(config.classes.loading);
        iframe.classList.add(config.classes.loaded);

        trackLazyLoad('iframe', 'success', iframe.src);
    }

    // Load heavy content section
    function loadContent(element) {
        element.classList.remove(config.classes.loading);
        element.classList.add(config.classes.loaded);

        // Trigger any custom events
        element.dispatchEvent(new CustomEvent('lazyloaded'));

        trackLazyLoad('content', 'success');
    }

    // Show data saver notice
    function showDataSaverNotice(element) {
        const notice = document.createElement('div');
        notice.className = 'data-saver-notice';
        notice.innerHTML = `
            <p>Content hidden to save data</p>
            <button onclick="this.parentElement.parentElement.querySelector('.lazy').click()">Load anyway</button>
        `;
        notice.style.cssText = `
            padding: 1rem;
            background: #f3f4f6;
            border-radius: 8px;
            text-align: center;
            color: #6b7280;
        `;

        // Make element clickable to load on demand
        element.addEventListener('click', () => {
            loadElement(element);
            notice.remove();
        }, { once: true });

        element.parentNode.insertBefore(notice, element.nextSibling);
    }

    // Show error placeholder
    function showErrorPlaceholder(element) {
        const placeholder = document.createElement('div');
        placeholder.className = 'lazy-error-placeholder';
        placeholder.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="4" fill="#f3f4f6"/>
                <path d="M20 14v8m0 4h.01" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">Failed to load image</p>
        `;
        placeholder.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: #f9fafb;
            border-radius: 8px;
        `;

        element.parentNode.insertBefore(placeholder, element.nextSibling);
    }

    // Track lazy loading for analytics
    function trackLazyLoad(type, status, url = '') {
        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'lazy_load', {
                event_category: 'Performance',
                event_label: type,
                value: status === 'success' ? 1 : 0
            });
        }

        // Log for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`[Lazy Load] ${type} - ${status}`, url);
        }
    }

    // Initialize lazy loading
    function initLazyLoading() {
        // Find all lazy-loadable elements
        const lazyElements = document.querySelectorAll(`
            img.lazy[data-src],
            img.lazy[data-srcset],
            picture.lazy,
            video.lazy,
            iframe.lazy,
            [data-bg].lazy,
            [data-lazy].lazy
        `);

        // Observe each element
        lazyElements.forEach(element => {
            // Add blur effect initially if enabled
            if (config.enableBlurUp && !prefersReducedMotion()) {
                element.style.filter = 'blur(10px)';
            }

            lazyObserver.observe(element);
        });

        console.log(`[Lazy Loading] Initialized for ${lazyElements.length} elements`);
    }

    // Fallback for browsers without Intersection Observer
    function fallbackLazyLoad() {
        console.warn('[Lazy Loading] Intersection Observer not supported, using fallback');

        const lazyElements = document.querySelectorAll('.lazy');

        // Load all immediately (fallback behavior)
        lazyElements.forEach(element => {
            loadElement(element);
        });
    }

    // Utility: Manually trigger lazy load (for dynamic content)
    window.lazyLoadElement = function(element) {
        if (element) {
            loadElement(element);
        }
    };

    // Utility: Reload failed lazy loads
    window.retryFailedLazyLoads = function() {
        const failedElements = document.querySelectorAll(`.${config.classes.error}`);
        failedElements.forEach(element => {
            element.classList.remove(config.classes.error);
            loadElement(element);
        });
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if ('IntersectionObserver' in window) {
                initLazyLoading();
            } else {
                fallbackLazyLoad();
            }
        });
    } else {
        if ('IntersectionObserver' in window) {
            initLazyLoading();
        } else {
            fallbackLazyLoad();
        }
    }

    // Expose config for customization
    window.lazyLoadingConfig = config;

})();
