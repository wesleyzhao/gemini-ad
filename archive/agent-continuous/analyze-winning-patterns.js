#!/usr/bin/env node

/**
 * Analyze Winning Patterns
 *
 * Analyzes successful experiments to extract reusable patterns,
 * identifies cross-page opportunities, and builds pattern library
 *
 * Modes:
 * - extract: Extract patterns from winning experiments
 * - catalog: Build pattern catalog
 * - recommend: Recommend patterns for other pages
 * - forecast: Forecast impact of pattern application
 * - auto: Full automated pattern analysis
 */

const fs = require('fs');
const path = require('path');

class PatternAnalyzer {
    constructor() {
        this.resultsDir = path.join(__dirname, 'experiment-results');
        this.patternsDir = path.join(__dirname, 'pattern-library');
        this.recommendationsDir = path.join(__dirname, 'pattern-recommendations');

        // Ensure directories exist
        [this.resultsDir, this.patternsDir, this.recommendationsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * Extract patterns from winning experiments
     */
    async extractPatterns(options = {}) {
        console.log('\n🔍 EXTRACTING PATTERNS FROM WINNING EXPERIMENTS');
        console.log('=' .repeat(80));

        // Get winning experiments from analysis files
        const winners = this.getWinningExperiments();

        if (winners.length === 0) {
            console.log('\n⚠️  No winning experiments found');
            console.log('Run experiments first with: node execute-optimization-iterations.js');
            return;
        }

        console.log(`\n📊 Analyzing ${winners.length} winning experiments\n`);

        const patterns = [];

        for (const winner of winners) {
            console.log(`\n🔬 Analyzing: ${winner.name}`);
            console.log(`   Page: ${winner.page}`);
            console.log(`   Lift: +${(winner.lift * 100).toFixed(2)}%`);
            console.log(`   Levers: ${winner.levers.join(', ')}`);

            // Extract pattern
            const pattern = {
                id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: this.generatePatternName(winner),
                description: this.generatePatternDescription(winner),
                sourceExperiment: winner.experimentId,
                sourcePage: winner.page,
                levers: winner.levers,
                lift: winner.lift,
                confidence: winner.confidence,
                annualRevenue: winner.annualRevenue,
                category: this.categorizePattern(winner.levers),
                applicability: this.assessApplicability(winner),
                implementation: this.extractImplementation(winner),
                createdAt: new Date().toISOString()
            };

            patterns.push(pattern);

            console.log(`   ✅ Pattern extracted: ${pattern.name}`);
            console.log(`   📁 Category: ${pattern.category}`);
            console.log(`   🎯 Applicability: ${pattern.applicability.join(', ')}`);
        }

        // Save patterns
        for (const pattern of patterns) {
            const patternFile = path.join(this.patternsDir, `${pattern.id}.json`);
            fs.writeFileSync(patternFile, JSON.stringify(pattern, null, 2));
        }

        // Generate summary
        const summary = {
            extractedAt: new Date().toISOString(),
            totalPatterns: patterns.length,
            categories: this.groupByCategory(patterns),
            averageLift: patterns.reduce((sum, p) => sum + p.lift, 0) / patterns.length,
            totalAnnualRevenue: patterns.reduce((sum, p) => sum + p.annualRevenue, 0)
        };

        const summaryFile = path.join(this.patternsDir, 'extraction-summary.json');
        fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

        console.log('\n' + '='.repeat(80));
        console.log('🎉 PATTERN EXTRACTION COMPLETE');
        console.log('='.repeat(80));
        console.log(`\n✅ ${patterns.length} patterns extracted`);
        console.log(`📊 Average lift: +${(summary.averageLift * 100).toFixed(2)}%`);
        console.log(`💰 Total annual revenue: $${summary.totalAnnualRevenue.toLocaleString()}`);

        return patterns;
    }

    /**
     * Build pattern catalog
     */
    async buildCatalog(options = {}) {
        console.log('\n📚 BUILDING PATTERN CATALOG');
        console.log('=' .repeat(80));

        const patterns = this.getAllPatterns();

        if (patterns.length === 0) {
            console.log('\n⚠️  No patterns found');
            console.log('Extract patterns first with: node analyze-winning-patterns.js --mode=extract');
            return;
        }

        const catalog = {
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            totalPatterns: patterns.length,
            categories: {},
            patterns: []
        };

        // Group by category
        for (const pattern of patterns) {
            if (!catalog.categories[pattern.category]) {
                catalog.categories[pattern.category] = {
                    name: pattern.category,
                    description: this.getCategoryDescription(pattern.category),
                    patterns: [],
                    averageLift: 0,
                    totalRevenue: 0
                };
            }

            catalog.categories[pattern.category].patterns.push(pattern.id);
            catalog.categories[pattern.category].totalRevenue += pattern.annualRevenue;
            catalog.patterns.push(pattern);
        }

        // Calculate category metrics
        for (const category of Object.values(catalog.categories)) {
            const categoryPatterns = patterns.filter(p => p.category === category.name);
            category.averageLift = categoryPatterns.reduce((sum, p) => sum + p.lift, 0) /
                categoryPatterns.length;
        }

        // Save catalog
        const catalogFile = path.join(this.patternsDir, 'pattern-catalog.json');
        fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2));

        // Display catalog
        console.log(`\n📖 Pattern Catalog v${catalog.version}`);
        console.log(`   Last Updated: ${catalog.lastUpdated}`);
        console.log(`   Total Patterns: ${catalog.totalPatterns}\n`);

        for (const [categoryName, category] of Object.entries(catalog.categories)) {
            console.log(`\n📁 ${categoryName} (${category.patterns.length} patterns)`);
            console.log(`   ${category.description}`);
            console.log(`   Average Lift: +${(category.averageLift * 100).toFixed(2)}%`);
            console.log(`   Total Revenue: $${category.totalRevenue.toLocaleString()}`);

            const categoryPatterns = patterns.filter(p => p.category === categoryName);
            for (const pattern of categoryPatterns) {
                console.log(`\n   • ${pattern.name}`);
                console.log(`     Lift: +${(pattern.lift * 100).toFixed(2)}%`);
                console.log(`     Revenue: $${pattern.annualRevenue.toLocaleString()}/year`);
                console.log(`     Levers: ${pattern.levers.join(', ')}`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log(`📝 Catalog saved to: ${path.basename(catalogFile)}`);

        return catalog;
    }

    /**
     * Recommend patterns for other pages
     */
    async recommendPatterns(options = {}) {
        console.log('\n🎯 RECOMMENDING PATTERNS FOR PAGES');
        console.log('=' .repeat(80));

        const patterns = this.getAllPatterns();

        if (patterns.length === 0) {
            console.log('\n⚠️  No patterns available');
            return;
        }

        const pages = [
            'valentines', 'writers', 'creators', 'operators', 'automators',
            'bundling', 'trust', 'workspace', 'research', 'productivity',
            'aspirational', 'comparison', 'google-ai-future'
        ];

        const recommendations = {
            generatedAt: new Date().toISOString(),
            totalPages: pages.length,
            totalPatterns: patterns.length,
            pageRecommendations: []
        };

        for (const page of pages) {
            console.log(`\n📄 Analyzing: ${page}.html`);

            // Get applicable patterns
            const applicablePatterns = patterns.filter(p =>
                p.applicability.includes('all') ||
                p.applicability.includes(this.getPageCategory(page))
            );

            // Remove patterns already from this page
            const newPatterns = applicablePatterns.filter(p => p.sourcePage !== page);

            if (newPatterns.length === 0) {
                console.log(`   ⚠️  No new patterns applicable`);
                continue;
            }

            // Rank by expected impact
            const rankedPatterns = newPatterns
                .sort((a, b) => b.lift - a.lift)
                .slice(0, 5); // Top 5

            const pageRec = {
                page,
                applicablePatterns: rankedPatterns.length,
                topRecommendations: rankedPatterns.map(p => ({
                    patternId: p.id,
                    patternName: p.name,
                    category: p.category,
                    expectedLift: p.lift,
                    expectedRevenue: Math.floor(p.annualRevenue * 0.7), // 70% of original
                    levers: p.levers,
                    priority: this.calculatePriority(p, page)
                })),
                estimatedTotalImpact: rankedPatterns.reduce(
                    (sum, p) => sum + Math.floor(p.annualRevenue * 0.7),
                    0
                )
            };

            recommendations.pageRecommendations.push(pageRec);

            console.log(`   ✅ ${rankedPatterns.length} patterns recommended`);
            console.log(`   💰 Estimated annual impact: $${pageRec.estimatedTotalImpact.toLocaleString()}`);

            // Show top 3
            for (let i = 0; i < Math.min(3, rankedPatterns.length); i++) {
                const rec = pageRec.topRecommendations[i];
                console.log(`\n   ${i + 1}. ${rec.patternName}`);
                console.log(`      Priority: ${rec.priority}`);
                console.log(`      Expected Lift: +${(rec.expectedLift * 100).toFixed(2)}%`);
                console.log(`      Expected Revenue: $${rec.expectedRevenue.toLocaleString()}/year`);
            }
        }

        // Save recommendations
        const recFile = path.join(
            this.recommendationsDir,
            `recommendations-${new Date().toISOString().split('T')[0]}.json`
        );
        fs.writeFileSync(recFile, JSON.stringify(recommendations, null, 2));

        // Summary
        const totalImpact = recommendations.pageRecommendations.reduce(
            (sum, pr) => sum + pr.estimatedTotalImpact,
            0
        );

        console.log('\n' + '='.repeat(80));
        console.log('🎉 RECOMMENDATIONS COMPLETE');
        console.log('='.repeat(80));
        console.log(`\n📊 ${recommendations.totalPages} pages analyzed`);
        console.log(`💰 Total estimated annual impact: $${totalImpact.toLocaleString()}`);
        console.log(`\n📝 Recommendations saved to: ${path.basename(recFile)}`);

        return recommendations;
    }

    /**
     * Forecast impact of pattern application
     */
    async forecastImpact(options = {}) {
        console.log('\n📈 FORECASTING PATTERN APPLICATION IMPACT');
        console.log('=' .repeat(80));

        const recommendations = await this.recommendPatterns();

        const forecast = {
            forecastedAt: new Date().toISOString(),
            scenarios: []
        };

        // Scenario 1: Apply high-priority patterns only
        const highPriorityRecs = recommendations.pageRecommendations.map(pr => ({
            page: pr.page,
            patterns: pr.topRecommendations.filter(r => r.priority === 'HIGH')
        })).filter(pr => pr.patterns.length > 0);

        const highPriorityImpact = highPriorityRecs.reduce(
            (sum, pr) => sum + pr.patterns.reduce((s, p) => s + p.expectedRevenue, 0),
            0
        );

        forecast.scenarios.push({
            name: 'Conservative (High Priority Only)',
            pagesImpacted: highPriorityRecs.length,
            patternsApplied: highPriorityRecs.reduce((sum, pr) => sum + pr.patterns.length, 0),
            estimatedAnnualRevenue: highPriorityImpact,
            implementationTime: '2-4 weeks',
            risk: 'Low'
        });

        // Scenario 2: Apply high + medium priority
        const mediumPriorityRecs = recommendations.pageRecommendations.map(pr => ({
            page: pr.page,
            patterns: pr.topRecommendations.filter(r =>
                r.priority === 'HIGH' || r.priority === 'MEDIUM'
            )
        })).filter(pr => pr.patterns.length > 0);

        const mediumPriorityImpact = mediumPriorityRecs.reduce(
            (sum, pr) => sum + pr.patterns.reduce((s, p) => s + p.expectedRevenue, 0),
            0
        );

        forecast.scenarios.push({
            name: 'Moderate (High + Medium Priority)',
            pagesImpacted: mediumPriorityRecs.length,
            patternsApplied: mediumPriorityRecs.reduce((sum, pr) => sum + pr.patterns.length, 0),
            estimatedAnnualRevenue: mediumPriorityImpact,
            implementationTime: '4-8 weeks',
            risk: 'Medium'
        });

        // Scenario 3: Apply all recommendations
        const allImpact = recommendations.pageRecommendations.reduce(
            (sum, pr) => sum + pr.estimatedTotalImpact,
            0
        );

        forecast.scenarios.push({
            name: 'Aggressive (All Recommendations)',
            pagesImpacted: recommendations.pageRecommendations.length,
            patternsApplied: recommendations.pageRecommendations.reduce(
                (sum, pr) => sum + pr.topRecommendations.length,
                0
            ),
            estimatedAnnualRevenue: allImpact,
            implementationTime: '8-12 weeks',
            risk: 'Medium-High'
        });

        // Save forecast
        const forecastFile = path.join(
            this.recommendationsDir,
            `impact-forecast-${new Date().toISOString().split('T')[0]}.json`
        );
        fs.writeFileSync(forecastFile, JSON.stringify(forecast, null, 2));

        // Display forecast
        console.log('\n📊 IMPACT FORECAST SCENARIOS\n');

        for (let i = 0; i < forecast.scenarios.length; i++) {
            const scenario = forecast.scenarios[i];
            console.log(`\n${i + 1}. ${scenario.name}`);
            console.log('   ' + '-'.repeat(70));
            console.log(`   Pages Impacted: ${scenario.pagesImpacted}`);
            console.log(`   Patterns Applied: ${scenario.patternsApplied}`);
            console.log(`   Estimated Annual Revenue: $${scenario.estimatedAnnualRevenue.toLocaleString()}`);
            console.log(`   Implementation Time: ${scenario.implementationTime}`);
            console.log(`   Risk: ${scenario.risk}`);
        }

        console.log('\n' + '='.repeat(80));
        console.log('💡 RECOMMENDATION');
        console.log('='.repeat(80));
        console.log('\nStart with Scenario 1 (Conservative) for quick wins,');
        console.log('then progressively implement Scenarios 2 and 3.');
        console.log('\n📝 Forecast saved to:', path.basename(forecastFile));

        return forecast;
    }

    /**
     * Full automated pattern analysis
     */
    async runAutomatedAnalysis(options = {}) {
        console.log('\n🤖 RUNNING AUTOMATED PATTERN ANALYSIS');
        console.log('=' .repeat(80));

        const results = {
            startedAt: new Date().toISOString(),
            steps: []
        };

        // Step 1: Extract patterns
        console.log('\n🔍 Step 1/4: Extracting patterns...\n');
        const patterns = await this.extractPatterns();
        results.steps.push({ step: 'extract', status: 'complete', count: patterns.length });

        // Step 2: Build catalog
        console.log('\n\n📚 Step 2/4: Building catalog...\n');
        const catalog = await this.buildCatalog();
        results.steps.push({ step: 'catalog', status: 'complete', data: catalog });

        // Step 3: Generate recommendations
        console.log('\n\n🎯 Step 3/4: Generating recommendations...\n');
        const recommendations = await this.recommendPatterns();
        results.steps.push({ step: 'recommend', status: 'complete', data: recommendations });

        // Step 4: Forecast impact
        console.log('\n\n📈 Step 4/4: Forecasting impact...\n');
        const forecast = await this.forecastImpact();
        results.steps.push({ step: 'forecast', status: 'complete', data: forecast });

        results.completedAt = new Date().toISOString();

        // Save results
        const resultsFile = path.join(
            this.patternsDir,
            `pattern-analysis-${new Date().toISOString().split('T')[0]}.json`
        );
        fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

        console.log('\n' + '='.repeat(80));
        console.log('🎉 AUTOMATED ANALYSIS COMPLETE');
        console.log('='.repeat(80));
        console.log(`\n📝 Results saved to: ${path.basename(resultsFile)}`);

        return results;
    }

    // Helper methods

    getWinningExperiments() {
        if (!fs.existsSync(this.resultsDir)) {
            return [];
        }

        const files = fs.readdirSync(this.resultsDir);
        const winners = [];

        for (const file of files) {
            if (file.startsWith('analysis-') && file.endsWith('.json')) {
                const content = fs.readFileSync(
                    path.join(this.resultsDir, file),
                    'utf8'
                );
                const analysis = JSON.parse(content);
                winners.push(...analysis.winners);
            }
        }

        return winners;
    }

    getAllPatterns() {
        if (!fs.existsSync(this.patternsDir)) {
            return [];
        }

        const files = fs.readdirSync(this.patternsDir);
        const patterns = [];

        for (const file of files) {
            if (file.startsWith('pattern-') && file.endsWith('.json')) {
                const content = fs.readFileSync(
                    path.join(this.patternsDir, file),
                    'utf8'
                );
                patterns.push(JSON.parse(content));
            }
        }

        return patterns;
    }

    generatePatternName(winner) {
        const leverName = winner.levers[0].replace(/-/g, ' ');
        return `${leverName.charAt(0).toUpperCase() + leverName.slice(1)} Pattern`;
    }

    generatePatternDescription(winner) {
        return `Proven pattern from ${winner.page} achieving +${(winner.lift * 100).toFixed(2)}% conversion lift using ${winner.levers.join(', ')}`;
    }

    categorizePattern(levers) {
        if (levers.some(l => l.includes('cta') || l.includes('button'))) return 'CTA Optimization';
        if (levers.some(l => l.includes('social') || l.includes('trust'))) return 'Trust & Social Proof';
        if (levers.some(l => l.includes('video') || l.includes('animation'))) return 'Visual & Animation';
        if (levers.some(l => l.includes('copy') || l.includes('headline'))) return 'Copy & Messaging';
        if (levers.some(l => l.includes('mobile') || l.includes('responsive'))) return 'Mobile Optimization';
        return 'Other';
    }

    assessApplicability(winner) {
        const page = winner.page;
        const levers = winner.levers;

        // Patterns applicable to all pages
        if (levers.some(l => l.includes('cta') || l.includes('headline'))) {
            return ['all'];
        }

        // Patterns applicable to specific segments
        if (page.includes('writer') || page.includes('creator')) {
            return ['writers', 'creators', 'content'];
        }

        if (page.includes('operator') || page.includes('automator')) {
            return ['operators', 'automators', 'business'];
        }

        return ['all'];
    }

    extractImplementation(winner) {
        return {
            type: 'HTML/CSS/JS',
            steps: [
                'Review variant code from experiment',
                'Apply changes to target page',
                'Test on staging',
                'Deploy to production'
            ],
            estimatedTime: '2-4 hours'
        };
    }

    groupByCategory(patterns) {
        const categories = {};
        for (const pattern of patterns) {
            if (!categories[pattern.category]) {
                categories[pattern.category] = 0;
            }
            categories[pattern.category]++;
        }
        return categories;
    }

    getCategoryDescription(category) {
        const descriptions = {
            'CTA Optimization': 'Patterns that improve call-to-action effectiveness',
            'Trust & Social Proof': 'Patterns that build credibility and trust',
            'Visual & Animation': 'Patterns that enhance visual appeal and engagement',
            'Copy & Messaging': 'Patterns that improve messaging clarity and persuasion',
            'Mobile Optimization': 'Patterns that enhance mobile user experience',
            'Other': 'Miscellaneous optimization patterns'
        };
        return descriptions[category] || 'No description available';
    }

    getPageCategory(page) {
        if (['writers', 'creators'].includes(page)) return 'content';
        if (['operators', 'automators'].includes(page)) return 'business';
        if (['research', 'trust'].includes(page)) return 'academic';
        return 'general';
    }

    calculatePriority(pattern, targetPage) {
        // High priority if:
        // - High lift (> 20%)
        // - High confidence (> 95%)
        // - High revenue (> $1M)

        if (pattern.lift > 0.20 && pattern.confidence > 0.95 && pattern.annualRevenue > 1000000) {
            return 'HIGH';
        }

        if (pattern.lift > 0.10 && pattern.confidence > 0.90) {
            return 'MEDIUM';
        }

        return 'LOW';
    }
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'extract';

    const analyzer = new PatternAnalyzer();

    (async () => {
        switch (mode) {
            case 'extract':
                await analyzer.extractPatterns();
                break;
            case 'catalog':
                await analyzer.buildCatalog();
                break;
            case 'recommend':
                await analyzer.recommendPatterns();
                break;
            case 'forecast':
                await analyzer.forecastImpact();
                break;
            case 'auto':
                await analyzer.runAutomatedAnalysis();
                break;
            default:
                console.log('Usage: node analyze-winning-patterns.js --mode=<mode>');
                console.log('Modes: extract, catalog, recommend, forecast, auto');
        }
    })();
}

module.exports = PatternAnalyzer;
