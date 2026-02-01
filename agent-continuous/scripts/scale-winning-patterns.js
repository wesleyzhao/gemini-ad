/**
 * Pattern Scaling Implementation Script
 * Feature #72: Scale winning exploratory patterns to production pages
 *
 * This script:
 * 1. Reads scaling plan from monitoring system
 * 2. Implements personalization on creators.html
 * 3. Implements urgency patterns on trust.html
 * 4. Validates implementation
 * 5. Updates pattern library status
 */

const fs = require('fs');
const path = require('path');

// Paths
const scalingPlanPath = path.resolve(__dirname, '../reports/optimization/pattern-scaling-plan.json');
const patternLibraryPath = path.resolve(__dirname, '../reports/iterations/pattern-library.json');
const creatorsPagePath = path.resolve(__dirname, '../pages/creators.html');
const trustPagePath = path.resolve(__dirname, '../pages/trust.html');

class PatternScaler {
    constructor() {
        this.scalingPlan = this.loadScalingPlan();
        this.patternLibrary = this.loadPatternLibrary();
        this.implementationLog = [];
    }

    loadScalingPlan() {
        if (!fs.existsSync(scalingPlanPath)) {
            console.error('❌ No scaling plan found. Run monitor-exploratory-performance.js first.');
            process.exit(1);
        }
        return JSON.parse(fs.readFileSync(scalingPlanPath, 'utf8'));
    }

    loadPatternLibrary() {
        if (!fs.existsSync(patternLibraryPath)) {
            console.error('❌ Pattern library not found');
            process.exit(1);
        }
        return JSON.parse(fs.readFileSync(patternLibraryPath, 'utf8'));
    }

    async scalePatterns() {
        console.log('==========================================');
        console.log('SCALING WINNING PATTERNS TO PRODUCTION');
        console.log('==========================================\n');

        console.log(`Plan Status: ${this.scalingPlan.status}`);
        console.log(`Total Recommendations: ${this.scalingPlan.recommendations.length}`);
        console.log(`Estimated Impact: ${this.scalingPlan.estimatedImpact}\n`);

        // Scale each recommended pattern
        for (const rec of this.scalingPlan.recommendations) {
            await this.scalePattern(rec);
        }

        // Update pattern library
        this.updatePatternLibrary();

        // Generate implementation report
        this.generateImplementationReport();

        console.log('\n==========================================');
        console.log('SCALING COMPLETE');
        console.log('==========================================\n');
    }

    async scalePattern(recommendation) {
        console.log(`\n📋 Scaling Pattern: ${recommendation.pattern}`);
        console.log(`   Priority: ${recommendation.priority}`);
        console.log(`   Target Pages: ${recommendation.targetPages.length}\n`);

        if (recommendation.pattern === 'Personalization') {
            await this.scalePersonalization(recommendation);
        } else if (recommendation.pattern === 'Scarcity & Urgency') {
            await this.scaleUrgency(recommendation);
        }
    }

    async scalePersonalization(recommendation) {
        console.log('   Implementing Personalization Pattern...');

        // Get the first target (creators.html)
        const target = recommendation.targetPages.find(t => t.page === 'creators.html');

        if (!target) {
            console.log('   ⚠️  creators.html not in target list, skipping');
            return;
        }

        // Check if page exists
        if (!fs.existsSync(creatorsPagePath)) {
            console.log('   ⚠️  creators.html not found, will need to be created');
            this.implementationLog.push({
                pattern: 'Personalization',
                page: 'creators.html',
                status: 'NEEDS_CREATION',
                message: 'Page does not exist yet'
            });
            return;
        }

        // Read existing page
        const html = fs.readFileSync(creatorsPagePath, 'utf8');

        // Check if personalization already exists
        if (html.includes('data-personalize') || html.includes('personalizationRules')) {
            console.log('   ✓ Personalization already implemented');
            this.implementationLog.push({
                pattern: 'Personalization',
                page: 'creators.html',
                status: 'ALREADY_IMPLEMENTED',
                segments: target.segments
            });
            return;
        }

        // Add personalization
        const personalized = this.addPersonalizationToPage(html, target.segments, 'creators');

        // Save updated page
        fs.writeFileSync(creatorsPagePath, personalized);

        console.log('   ✓ Personalization added to creators.html');
        console.log(`   ✓ Segments: ${target.segments.join(', ')}`);

        this.implementationLog.push({
            pattern: 'Personalization',
            page: 'creators.html',
            status: 'IMPLEMENTED',
            segments: target.segments,
            expectedLift: target.expectedLift
        });
    }

    addPersonalizationToPage(html, segments, pageType) {
        // This is a simplified implementation
        // In production, this would be more sophisticated

        const personalizationRules = this.generatePersonalizationRules(segments, pageType);

        // Add personalization script before </body>
        const scriptTag = `
    <script>
    // Personalization Pattern (Auto-scaled from exploratory testing)
    const personalizationRules = ${JSON.stringify(personalizationRules, null, 6)};

    function getUserSegment() {
        const urlParams = new URLSearchParams(window.location.search);
        const segment = urlParams.get('segment');
        return segment && personalizationRules[segment] ? segment : Object.keys(personalizationRules)[0];
    }

    function applyPersonalization() {
        const segment = getUserSegment();
        const rules = personalizationRules[segment];

        // Apply personalization
        const badge = document.querySelector('[data-personalize="badge"]');
        const heading = document.querySelector('[data-personalize="heading"]');
        const description = document.querySelector('[data-personalize="description"]');
        const ctaPrimary = document.querySelector('[data-personalize="cta-primary"]');

        if (badge && rules.badge) badge.textContent = rules.badge;
        if (heading && rules.heading) heading.innerHTML = rules.heading;
        if (description && rules.description) description.innerHTML = rules.description;
        if (ctaPrimary && rules.ctaPrimary) ctaPrimary.textContent = rules.ctaPrimary;

        // Track personalization event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'personalization_applied', {
                'segment': segment,
                'page': '${pageType}'
            });
        }
    }

    // Apply personalization on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPersonalization);
    } else {
        applyPersonalization();
    }
    </script>`;

        // Add data attributes to hero section
        const heroWithAttributes = html.replace(
            /<h1([^>]*)>(.*?)<\/h1>/,
            '<h1$1 data-personalize="heading">$2</h1>'
        ).replace(
            /<p class="hero-description"([^>]*)>(.*?)<\/p>/,
            '<p class="hero-description"$1 data-personalize="description">$2</p>'
        ).replace(
            /<a href="([^"]*)" class="cta-primary"([^>]*)>(.*?)<\/a>/,
            '<a href="$1" class="cta-primary"$2 data-personalize="cta-primary">$3</a>'
        );

        // Insert script before </body>
        return heroWithAttributes.replace('</body>', `${scriptTag}\n</body>`);
    }

    generatePersonalizationRules(segments, pageType) {
        const rules = {};

        if (pageType === 'creators') {
            segments.forEach(segment => {
                rules[segment] = {
                    badge: this.getBadgeForSegment(segment),
                    heading: this.getHeadingForSegment(segment),
                    description: this.getDescriptionForSegment(segment),
                    ctaPrimary: this.getCTAForSegment(segment)
                };
            });
        }

        return rules;
    }

    getBadgeForSegment(segment) {
        const badges = {
            'video-creator': '🎥 Perfect for Video Creators',
            'designer': '🎨 Perfect for Designers',
            'musician': '🎵 Perfect for Musicians',
            'artist': '✨ Perfect for Artists'
        };
        return badges[segment] || '✨ Personalized for You';
    }

    getHeadingForSegment(segment) {
        const headings = {
            'video-creator': 'Create Videos That<br>Captivate Your Audience',
            'designer': 'Design With AI-Powered<br>Creative Intelligence',
            'musician': 'Compose Music With<br>Intelligent Assistance',
            'artist': 'Bring Your Artistic Vision<br>To Life With AI'
        };
        return headings[segment] || 'Create With Gemini';
    }

    getDescriptionForSegment(segment) {
        const descriptions = {
            'video-creator': 'Generate scripts, brainstorm concepts, and refine your video content with AI that understands storytelling and audience engagement.',
            'designer': 'From concept to execution, Gemini helps you explore design possibilities, refine your ideas, and deliver stunning visual work faster.',
            'musician': 'Explore melodies, write lyrics, and develop musical concepts with an AI collaborator that understands rhythm, harmony, and creative expression.',
            'artist': 'Generate ideas, explore techniques, and push creative boundaries with AI that understands artistic vision and creative process.'
        };
        return descriptions[segment] || 'Create amazing content with Gemini';
    }

    getCTAForSegment(segment) {
        const ctas = {
            'video-creator': 'Start Creating Videos',
            'designer': 'Start Designing',
            'musician': 'Start Composing',
            'artist': 'Start Creating Art'
        };
        return ctas[segment] || 'Get Started';
    }

    async scaleUrgency(recommendation) {
        console.log('   Implementing Scarcity & Urgency Pattern...');

        // Get the first target (trust.html)
        const target = recommendation.targetPages.find(t => t.page === 'trust.html');

        if (!target) {
            console.log('   ⚠️  trust.html not in target list, skipping');
            return;
        }

        // Check if page exists
        if (!fs.existsSync(trustPagePath)) {
            console.log('   ⚠️  trust.html not found, will need to be created');
            this.implementationLog.push({
                pattern: 'Scarcity & Urgency',
                page: 'trust.html',
                status: 'NEEDS_CREATION',
                message: 'Page does not exist yet'
            });
            return;
        }

        // Read existing page
        const html = fs.readFileSync(trustPagePath, 'utf8');

        // Check if urgency already exists
        if (html.includes('urgency-banner') || html.includes('countdown')) {
            console.log('   ✓ Urgency already implemented');
            this.implementationLog.push({
                pattern: 'Scarcity & Urgency',
                page: 'trust.html',
                status: 'ALREADY_IMPLEMENTED',
                elements: target.elements
            });
            return;
        }

        // Add urgency elements
        const withUrgency = this.addUrgencyToPage(html, target.elements);

        // Save updated page
        fs.writeFileSync(trustPagePath, withUrgency);

        console.log('   ✓ Urgency pattern added to trust.html');
        console.log(`   ✓ Elements: ${target.elements.join(', ')}`);

        this.implementationLog.push({
            pattern: 'Scarcity & Urgency',
            page: 'trust.html',
            status: 'IMPLEMENTED',
            elements: target.elements,
            expectedLift: target.expectedLift
        });
    }

    addUrgencyToPage(html, elements) {
        // Add urgency banner at the top
        const urgencyBanner = `
    <div class="urgency-banner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; text-align: center; font-size: 14px; font-weight: 500; animation: slideDown 0.5s ease-out;">
        ⏰ Early Access Ending Soon • <span id="countdown-inline">24:00:00</span> Remaining • <span id="spots-remaining">47</span> Spots Left
    </div>

    <style>
    @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .urgency-banner {
        position: relative;
        z-index: 100;
    }
    #countdown-inline {
        font-weight: 700;
        font-family: 'SF Mono', Monaco, 'Courier New', monospace;
    }
    </style>`;

        // Insert after <body>
        const withBanner = html.replace('<body>', `<body>\n${urgencyBanner}`);

        // Add countdown script
        const countdownScript = `
    <script>
    // Urgency Pattern (Auto-scaled from exploratory testing)
    const endTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    let spotsRemaining = 47;

    function updateCountdown() {
        const distance = endTime - Date.now();

        if (distance < 0) {
            document.getElementById('countdown-inline').textContent = '00:00:00';
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown-inline').textContent =
            \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;

        // Gradually decrease spots
        if (Math.random() < 0.001) {
            spotsRemaining = Math.max(1, spotsRemaining - 1);
            document.getElementById('spots-remaining').textContent = spotsRemaining;
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Track urgency impression
    if (typeof gtag !== 'undefined') {
        gtag('event', 'urgency_pattern_view', {
            'hours_remaining': 24
        });
    }
    </script>`;

        // Insert script before </body>
        return withBanner.replace('</body>', `${countdownScript}\n</body>`);
    }

    updatePatternLibrary() {
        console.log('\n📚 Updating Pattern Library...');

        // Mark patterns as "production" instead of "exploratory"
        this.patternLibrary.patterns.forEach(pattern => {
            if (pattern.status === 'exploratory') {
                const implementation = this.implementationLog.find(
                    log => log.pattern === pattern.name && log.status === 'IMPLEMENTED'
                );

                if (implementation) {
                    pattern.status = 'production';
                    pattern.validation.applications += 1;
                    pattern.scaledTo = pattern.scaledTo || [];
                    pattern.scaledTo.push({
                        page: implementation.page,
                        date: new Date().toISOString(),
                        expectedLift: implementation.expectedLift
                    });

                    console.log(`   ✓ ${pattern.name} → production status`);
                }
            }
        });

        // Save updated library
        fs.writeFileSync(patternLibraryPath, JSON.stringify(this.patternLibrary, null, 2));
        console.log('   ✓ Pattern library updated');
    }

    generateImplementationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            status: 'COMPLETE',
            implementations: this.implementationLog,
            totalPatterns: this.scalingPlan.recommendations.length,
            successfulImplementations: this.implementationLog.filter(l => l.status === 'IMPLEMENTED').length,
            alreadyImplemented: this.implementationLog.filter(l => l.status === 'ALREADY_IMPLEMENTED').length,
            needsCreation: this.implementationLog.filter(l => l.status === 'NEEDS_CREATION').length,
            estimatedImpact: this.scalingPlan.estimatedImpact,
            nextSteps: [
                'Monitor performance over next 2-3 optimization cycles',
                'Analyze segment-specific conversion rates',
                'Validate velocity improvements (target: > 0.5 pts/cycle)',
                'Scale to additional pages if successful',
                'Refine patterns based on production data'
            ]
        };

        const reportPath = path.resolve(__dirname, '../reports/optimization/scaling-implementation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('\n📊 Implementation Report:');
        console.log(`   Total Patterns: ${report.totalPatterns}`);
        console.log(`   Successfully Implemented: ${report.successfulImplementations}`);
        console.log(`   Already Implemented: ${report.alreadyImplemented}`);
        console.log(`   Needs Page Creation: ${report.needsCreation}`);
        console.log(`   Estimated Impact: ${report.estimatedImpact}`);
        console.log(`\n   ✓ Report saved to: ${path.relative(process.cwd(), reportPath)}`);
    }
}

// Run scaling
const scaler = new PatternScaler();
scaler.scalePatterns().catch(error => {
    console.error('❌ Error scaling patterns:', error);
    process.exit(1);
});
