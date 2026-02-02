/**
 * CTA Copy Variants Database
 * ===========================
 * A comprehensive library of proven CTA copy variations for A/B testing
 * Organized by category, goal, and psychological trigger
 *
 * Usage:
 * const variants = CTACopyVariants.getVariants('signup');
 * const random = CTACopyVariants.getRandom('signup');
 *
 * @version 1.0.0
 */

const CTACopyVariants = (function() {
    'use strict';

    /**
     * CTA Copy Library
     * Organized by use case and psychological principle
     */
    const COPY_LIBRARY = {
        // Sign up / Get Started CTAs
        signup: {
            direct: [
                'Get Started',
                'Start Free',
                'Sign Up Free',
                'Create Account',
                'Join Now',
                'Get Started Free'
            ],
            value: [
                'Start Your Free Trial',
                'Try Gemini Free',
                'Get Free Access',
                'Unlock Free Features',
                'Start Creating Free',
                'Begin Your Journey'
            ],
            urgency: [
                'Start Now',
                'Get Started Today',
                'Join Free Today',
                'Start Your Free Trial Now',
                'Sign Up - Limited Time',
                'Get Instant Access'
            ],
            social: [
                'Join 1M+ Users',
                'See Why 1M+ Choose Gemini',
                'Join the Community',
                'Get Started Like 1M+ Others',
                'Join Thousands of Happy Users'
            ],
            noCommitment: [
                'Try Free - No Credit Card',
                'Start Free - Cancel Anytime',
                'Free Forever',
                'No Credit Card Required',
                'Start Risk-Free'
            ]
        },

        // Learn More / Information CTAs
        learnMore: {
            direct: [
                'Learn More',
                'Discover More',
                'See How It Works',
                'Explore Features',
                'View Details'
            ],
            value: [
                'See What You Can Do',
                'Discover the Possibilities',
                'See How Gemini Helps',
                'Explore Your Options',
                'Find Out How'
            ],
            curiosity: [
                'See It In Action',
                'Watch Demo',
                'See the Magic',
                'Discover the Secret',
                'See What\'s Inside'
            ]
        },

        // Download / Access CTAs
        download: {
            direct: [
                'Download Now',
                'Get the App',
                'Install Free',
                'Download Free'
            ],
            value: [
                'Get Your Free Download',
                'Download and Start Creating',
                'Get Instant Access'
            ],
            urgency: [
                'Download Today',
                'Get It Now',
                'Install Today'
            ]
        },

        // Purchase / Upgrade CTAs
        purchase: {
            direct: [
                'Buy Now',
                'Upgrade Now',
                'Get Premium',
                'Go Pro',
                'Choose Plan'
            ],
            value: [
                'Unlock All Features',
                'Get Full Access',
                'Upgrade to Premium',
                'Unlock Your Potential',
                'Get More Power'
            ],
            urgency: [
                'Upgrade Today - Save 20%',
                'Limited Time Offer',
                'Get It Before It\'s Gone',
                'Save Now'
            ],
            noCommitment: [
                'Try Premium Free',
                'Start Free Trial',
                'Try Risk-Free'
            ]
        },

        // Contact / Demo CTAs
        contact: {
            direct: [
                'Contact Us',
                'Get in Touch',
                'Request Demo',
                'Schedule Demo',
                'Talk to Sales'
            ],
            value: [
                'See It In Action',
                'Get Your Free Demo',
                'Book Your Demo',
                'Get Personal Demo',
                'Schedule Your Consultation'
            ],
            urgency: [
                'Request Demo Today',
                'Book Your Spot',
                'Schedule Now',
                'Get Demo This Week'
            ]
        },

        // Newsletter / Subscribe CTAs
        subscribe: {
            direct: [
                'Subscribe',
                'Sign Up',
                'Get Updates',
                'Join Newsletter'
            ],
            value: [
                'Get Free Tips',
                'Get Weekly Insights',
                'Get Expert Advice',
                'Stay Informed',
                'Never Miss an Update'
            ],
            gift: [
                'Get Your Free Guide',
                'Download Free eBook',
                'Get Free Resources',
                'Claim Your Gift'
            ]
        },

        // Specific to Gemini AI
        gemini: {
            productivity: [
                'Boost Your Productivity',
                'Work Smarter Today',
                'Start Saving Time',
                'Automate Your Workflow',
                'Get More Done'
            ],
            trust: [
                'Try Trusted AI',
                'Experience Reliable AI',
                'Get Accurate Results',
                'Trust Google AI',
                'See Real Citations'
            ],
            integration: [
                'Connect Your Workspace',
                'Integrate with Google',
                'Sync Your Tools',
                'Link Your Accounts',
                'Connect Everything'
            ],
            creative: [
                'Start Creating',
                'Unleash Your Creativity',
                'Bring Ideas to Life',
                'Create Something Amazing',
                'Generate Your Vision'
            ],
            research: [
                'Start Researching',
                'Get Instant Answers',
                'Find What You Need',
                'Discover Insights',
                'Explore Knowledge'
            ]
        },

        // By psychological trigger
        psychological: {
            fomo: [
                'Don\'t Miss Out',
                'Join Before It\'s Too Late',
                'Limited Spots Available',
                'Offer Ends Soon',
                'Last Chance'
            ],
            authority: [
                'Join Industry Leaders',
                'Trusted by Millions',
                'Google\'s AI Technology',
                'Enterprise-Grade Solution',
                'Professional Standard'
            ],
            curiosity: [
                'See What\'s Possible',
                'Discover the Future',
                'Experience the Difference',
                'See for Yourself',
                'Find Out Why'
            ],
            reciprocity: [
                'Get Your Free Trial',
                'Claim Your Free Gift',
                'Get Bonus Features',
                'Free Access Inside'
            ],
            simplicity: [
                'Get Started in 30 Seconds',
                'One Click Setup',
                'No Installation Required',
                'Instant Access',
                'Works Immediately'
            ]
        }
    };

    /**
     * Emoji combinations for CTAs
     */
    const EMOJI_LIBRARY = {
        action: ['→', '▶', '↗', '⚡', '✨'],
        success: ['✓', '✅', '🎯', '🚀', '⭐'],
        gift: ['🎁', '🎉', '💎', '🏆', '👑'],
        time: ['⏰', '⌛', '🔔', '📅', '⏳'],
        security: ['🔒', '🛡️', '✓', '🔐', '🏅'],
        creativity: ['🎨', '✨', '💡', '🌟', '🎭'],
        productivity: ['📈', '⚡', '🚀', '💪', '🎯']
    };

    /**
     * Get all variants for a category
     */
    function getVariants(category, subcategory = null) {
        if (!COPY_LIBRARY[category]) {
            console.warn(`[CTACopyVariants] Category not found: ${category}`);
            return [];
        }

        if (subcategory) {
            return COPY_LIBRARY[category][subcategory] || [];
        }

        // Return all variants in category
        const allVariants = [];
        Object.values(COPY_LIBRARY[category]).forEach(variants => {
            allVariants.push(...variants);
        });
        return allVariants;
    }

    /**
     * Get a random variant from a category
     */
    function getRandom(category, subcategory = null) {
        const variants = getVariants(category, subcategory);
        if (variants.length === 0) return null;
        return variants[Math.floor(Math.random() * variants.length)];
    }

    /**
     * Get variants with emoji
     */
    function withEmoji(text, emojiCategory = 'action') {
        const emojis = EMOJI_LIBRARY[emojiCategory] || EMOJI_LIBRARY.action;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        return `${text} ${emoji}`;
    }

    /**
     * Generate test variants for A/B testing
     * Returns array of variants with different copy and styles
     */
    function generateTestVariants(category, count = 4) {
        const variants = [];
        const copies = getVariants(category);

        // Shuffle copies
        const shuffled = copies.sort(() => Math.random() - 0.5);

        // Generate variants with different styles
        const styles = [
            'cta-primary',
            'cta-secondary',
            'cta-outline-primary',
            'cta-primary cta-pill',
            'cta-secondary cta-3d',
            'cta-primary cta-glow',
            'cta-primary cta-arrow',
            'cta-secondary cta-pulse'
        ];

        for (let i = 0; i < Math.min(count, shuffled.length); i++) {
            variants.push({
                id: String.fromCharCode(65 + i), // A, B, C, D...
                copy: shuffled[i],
                style: styles[i % styles.length],
                withEmoji: i % 2 === 0 // Alternate emoji usage
            });
        }

        return variants;
    }

    /**
     * Get recommended variants based on context
     */
    function getRecommended(context) {
        const recommendations = {
            hero: ['signup.value', 'signup.direct', 'gemini.productivity'],
            footer: ['signup.noCommitment', 'subscribe.value', 'learnMore.direct'],
            pricing: ['purchase.value', 'purchase.noCommitment', 'signup.direct'],
            feature: ['learnMore.value', 'learnMore.curiosity', 'signup.value'],
            blog: ['subscribe.value', 'subscribe.gift', 'learnMore.direct'],
            landing: ['signup.urgency', 'signup.social', 'gemini.productivity']
        };

        const paths = recommendations[context] || recommendations.landing;
        return paths.map(path => {
            const [category, subcategory] = path.split('.');
            return getRandom(category, subcategory);
        }).filter(Boolean);
    }

    /**
     * Generate A/B test configuration
     */
    function generateABTest(testName, category, options = {}) {
        const {
            variantCount = 3,
            includeEmoji = true,
            baseClass = 'cta',
            context = 'landing'
        } = options;

        const variants = generateTestVariants(category, variantCount);

        return {
            testName,
            variants: variants.map(variant => ({
                id: variant.id,
                copy: variant.withEmoji && includeEmoji
                    ? withEmoji(variant.copy)
                    : variant.copy,
                classes: `${baseClass} ${variant.style}`,
                html: `<a href="https://gemini.google.com"
                          class="${baseClass} ${variant.style}"
                          data-ab-test="${testName}"
                          data-ab-variant="${variant.id}"
                          data-ab-copy="${variant.copy}">
                          ${variant.copy}
                       </a>`
            }))
        };
    }

    /**
     * Get all categories
     */
    function getCategories() {
        return Object.keys(COPY_LIBRARY);
    }

    /**
     * Get subcategories for a category
     */
    function getSubcategories(category) {
        if (!COPY_LIBRARY[category]) return [];
        return Object.keys(COPY_LIBRARY[category]);
    }

    /**
     * Search variants by keyword
     */
    function search(keyword) {
        const results = [];
        const lowerKeyword = keyword.toLowerCase();

        Object.entries(COPY_LIBRARY).forEach(([category, subcategories]) => {
            Object.entries(subcategories).forEach(([subcategory, variants]) => {
                variants.forEach(variant => {
                    if (variant.toLowerCase().includes(lowerKeyword)) {
                        results.push({
                            category,
                            subcategory,
                            copy: variant
                        });
                    }
                });
            });
        });

        return results;
    }

    // Public API
    return {
        getVariants,
        getRandom,
        withEmoji,
        generateTestVariants,
        getRecommended,
        generateABTest,
        getCategories,
        getSubcategories,
        search,
        COPY_LIBRARY,
        EMOJI_LIBRARY
    };
})();

// Expose to window for console access
window.CTACopyVariants = CTACopyVariants;

// Example usage:
// console.log(CTACopyVariants.getRandom('signup', 'value'));
// console.log(CTACopyVariants.getRecommended('hero'));
// console.log(CTACopyVariants.generateABTest('hero-cta', 'signup'));
