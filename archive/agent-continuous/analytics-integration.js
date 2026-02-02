/**
 * Gemini Landing Pages - Analytics Integration System
 *
 * This script provides a unified analytics tracking system for all 13 landing pages.
 * It supports multiple analytics platforms and provides real-time conversion tracking.
 *
 * Supported Platforms:
 * - Google Analytics 4 (GA4)
 * - Mixpanel
 * - Amplitude
 * - Custom event tracking
 *
 * Usage:
 * Include this script in all landing pages before the closing </body> tag:
 * <script src="analytics-integration.js"></script>
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        // Replace with your actual tracking IDs when deploying to production
        ga4MeasurementId: 'G-XXXXXXXXXX', // TODO: Replace with real GA4 ID
        mixpanelToken: 'YOUR_MIXPANEL_TOKEN', // TODO: Replace with real token
        amplitudeApiKey: 'YOUR_AMPLITUDE_KEY', // TODO: Replace with real key

        // Feature flags
        enableGA4: true,
        enableMixpanel: false, // Enable when token is added
        enableAmplitude: false, // Enable when API key is added
        enableDebugMode: true, // Set to false in production

        // Tracking settings
        trackPageViews: true,
        trackCTAClicks: true,
        trackScrollDepth: true,
        trackTimeOnPage: true,
        trackFormInteractions: true
    };

    // Analytics Manager
    const AnalyticsManager = {
        initialized: false,
        pageLoadTime: Date.now(),
        scrollDepths: [25, 50, 75, 90, 100],
        trackedScrollDepths: new Set(),

        /**
         * Initialize analytics tracking
         */
        init() {
            if (this.initialized) return;

            this.log('Initializing analytics...');

            // Initialize GA4
            if (config.enableGA4) {
                this.initGA4();
            }

            // Initialize Mixpanel
            if (config.enableMixpanel) {
                this.initMixpanel();
            }

            // Initialize Amplitude
            if (config.enableAmplitude) {
                this.initAmplitude();
            }

            // Set up event listeners
            this.setupEventListeners();

            // Track initial page view
            if (config.trackPageViews) {
                this.trackPageView();
            }

            this.initialized = true;
            this.log('Analytics initialized successfully');
        },

        /**
         * Initialize Google Analytics 4
         */
        initGA4() {
            if (window.gtag) {
                this.log('GA4 already loaded');
                return;
            }

            // Load GA4 script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}`;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', config.ga4MeasurementId, {
                send_page_view: false // We'll send manually
            });

            this.log('GA4 initialized');
        },

        /**
         * Initialize Mixpanel
         */
        initMixpanel() {
            // Mixpanel initialization code would go here
            // For now, just a placeholder
            this.log('Mixpanel would be initialized here');
        },

        /**
         * Initialize Amplitude
         */
        initAmplitude() {
            // Amplitude initialization code would go here
            // For now, just a placeholder
            this.log('Amplitude would be initialized here');
        },

        /**
         * Set up event listeners for tracking
         */
        setupEventListeners() {
            // Track CTA button clicks
            if (config.trackCTAClicks) {
                this.trackCTAClicks();
            }

            // Track scroll depth
            if (config.trackScrollDepth) {
                this.trackScrollDepth();
            }

            // Track time on page
            if (config.trackTimeOnPage) {
                this.trackTimeOnPage();
            }

            // Track form interactions
            if (config.trackFormInteractions) {
                this.trackFormInteractions();
            }
        },

        /**
         * Track CTA button clicks
         */
        trackCTAClicks() {
            // Track all CTA buttons
            const ctaButtons = document.querySelectorAll('[href*="gemini.google.com"], .cta-button, .sticky-cta, a[href*="try"], a[href*="start"]');

            ctaButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const buttonText = button.textContent.trim();
                    const buttonHref = button.getAttribute('href');
                    const buttonId = button.id || 'unknown';

                    this.trackEvent('cta_click', {
                        button_text: buttonText,
                        button_href: buttonHref,
                        button_id: buttonId,
                        page_url: window.location.pathname,
                        timestamp: new Date().toISOString()
                    });
                });
            });

            this.log(`Tracking ${ctaButtons.length} CTA buttons`);
        },

        /**
         * Track scroll depth
         */
        trackScrollDepth() {
            let ticking = false;

            const checkScrollDepth = () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );

                this.scrollDepths.forEach(depth => {
                    if (scrollPercent >= depth && !this.trackedScrollDepths.has(depth)) {
                        this.trackedScrollDepths.add(depth);
                        this.trackEvent('scroll_depth', {
                            depth_percent: depth,
                            page_url: window.location.pathname,
                            time_to_scroll: Date.now() - this.pageLoadTime
                        });
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

            this.log('Scroll depth tracking enabled');
        },

        /**
         * Track time on page
         */
        trackTimeOnPage() {
            // Track every 30 seconds
            setInterval(() => {
                const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);

                this.trackEvent('time_on_page', {
                    seconds: timeOnPage,
                    page_url: window.location.pathname
                });
            }, 30000);

            // Track on page unload
            window.addEventListener('beforeunload', () => {
                const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);

                this.trackEvent('page_exit', {
                    time_on_page: timeOnPage,
                    page_url: window.location.pathname
                });
            });

            this.log('Time on page tracking enabled');
        },

        /**
         * Track form interactions
         */
        trackFormInteractions() {
            const forms = document.querySelectorAll('form');

            forms.forEach(form => {
                // Track form focus
                form.addEventListener('focusin', (e) => {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                        this.trackEvent('form_field_focus', {
                            field_name: e.target.name || e.target.id,
                            form_id: form.id || 'unknown'
                        });
                    }
                });

                // Track form submission
                form.addEventListener('submit', (e) => {
                    this.trackEvent('form_submit', {
                        form_id: form.id || 'unknown',
                        page_url: window.location.pathname
                    });
                });
            });

            this.log(`Tracking ${forms.length} forms`);
        },

        /**
         * Track page view
         */
        trackPageView() {
            const pageName = this.getPageName();
            const pageData = {
                page_title: document.title,
                page_url: window.location.pathname,
                page_name: pageName,
                referrer: document.referrer,
                user_agent: navigator.userAgent,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString()
            };

            this.trackEvent('page_view', pageData);
        },

        /**
         * Track custom event
         */
        trackEvent(eventName, eventData = {}) {
            // Add common properties
            const enrichedData = {
                ...eventData,
                page_name: this.getPageName(),
                session_id: this.getSessionId(),
                user_id: this.getUserId()
            };

            // Send to GA4
            if (config.enableGA4 && window.gtag) {
                window.gtag('event', eventName, enrichedData);
            }

            // Send to Mixpanel
            if (config.enableMixpanel && window.mixpanel) {
                window.mixpanel.track(eventName, enrichedData);
            }

            // Send to Amplitude
            if (config.enableAmplitude && window.amplitude) {
                window.amplitude.getInstance().logEvent(eventName, enrichedData);
            }

            this.log(`Event tracked: ${eventName}`, enrichedData);
        },

        /**
         * Get page name from URL
         */
        getPageName() {
            const path = window.location.pathname;
            const fileName = path.split('/').pop().replace('.html', '') || 'index';

            const pageNames = {
                'index': 'Homepage Hub',
                'workspace': 'Workspace Integration',
                'research': 'Research Professional',
                'comparison': 'Competitor Comparison',
                'writers': 'Writers Segment',
                'creators': 'Creators Segment',
                'productivity': 'Productivity Focus',
                'future': 'Future/Aspirational',
                'apple-style': 'Apple-Style Minimalist',
                'valentine': 'Valentine\'s Day Hook',
                'operators': 'Operators Segment',
                'automators': 'Automators Segment',
                'trust': 'Trust & Citations'
            };

            return pageNames[fileName] || fileName;
        },

        /**
         * Get or create session ID
         */
        getSessionId() {
            let sessionId = sessionStorage.getItem('analytics_session_id');

            if (!sessionId) {
                sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('analytics_session_id', sessionId);
            }

            return sessionId;
        },

        /**
         * Get or create user ID
         */
        getUserId() {
            let userId = localStorage.getItem('analytics_user_id');

            if (!userId) {
                userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('analytics_user_id', userId);
            }

            return userId;
        },

        /**
         * Log message (only in debug mode)
         */
        log(message, data = null) {
            if (config.enableDebugMode) {
                console.log(`[Analytics] ${message}`, data || '');
            }
        }
    };

    // Public API
    window.GeminiAnalytics = {
        /**
         * Track a custom event
         */
        track(eventName, eventData) {
            AnalyticsManager.trackEvent(eventName, eventData);
        },

        /**
         * Track a conversion
         */
        trackConversion(conversionType = 'cta_click', value = 0) {
            AnalyticsManager.trackEvent('conversion', {
                conversion_type: conversionType,
                conversion_value: value,
                page_url: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Get analytics configuration
         */
        getConfig() {
            return { ...config };
        },

        /**
         * Update configuration
         */
        updateConfig(updates) {
            Object.assign(config, updates);
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AnalyticsManager.init();
        });
    } else {
        AnalyticsManager.init();
    }

})();
