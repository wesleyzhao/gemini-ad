/**
 * Pattern Combination Testing
 *
 * Tests synergistic effects of combining multiple optimization patterns
 * (e.g., personalization + urgency, social proof + scarcity, etc.)
 *
 * Features:
 * - Multi-pattern application
 * - Interaction effect analysis
 * - Synergy detection
 * - Conflict resolution
 * - Performance prediction
 *
 * @module test-pattern-combinations
 */

const fs = require('fs');
const path = require('path');

class PatternCombinationTester {
    constructor() {
        this.patternsDir = path.join(__dirname, '../reports/iterations/pattern-library.json');
        this.resultsDir = path.join(__dirname, '../reports/pattern-combinations');
        this.ensureDirectories();
    }

    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        if (!fs.existsSync(this.resultsDir)) {
            fs.mkdirSync(this.resultsDir, { recursive: true });
        }
    }

    /**
     * Load pattern library
     * @returns {Object} Pattern library
     */
    loadPatternLibrary() {
        if (!fs.existsSync(this.patternsDir)) {
            throw new Error('Pattern library not found');
        }
        return JSON.parse(fs.readFileSync(this.patternsDir, 'utf-8'));
    }

    /**
     * Test all possible pattern combinations
     *
     * @param {Object} options - Test options
     * @returns {Array} Combination test results
     */
    testAllCombinations(options = {}) {
        const {
            maxCombinationSize = 3,
            minPerformanceThreshold = 5.0,
            onlyProduction = true
        } = options;

        const library = this.loadPatternLibrary();
        const patterns = library.patterns || [];

        // Filter to production patterns if requested
        const eligiblePatterns = onlyProduction
            ? patterns.filter(p => p.status === 'production')
            : patterns;

        console.log(`Testing combinations of ${eligiblePatterns.length} patterns...`);

        const results = {
            tested: 0,
            promising: 0,
            conflicting: 0,
            combinations: [],
            timestamp: new Date().toISOString()
        };

        // Test 2-pattern combinations
        for (let i = 0; i < eligiblePatterns.length; i++) {
            for (let j = i + 1; j < eligiblePatterns.length; j++) {
                const combo = this.testCombination([
                    eligiblePatterns[i],
                    eligiblePatterns[j]
                ]);
                results.tested++;
                if (combo.predicted_lift >= minPerformanceThreshold) {
                    results.promising++;
                }
                if (combo.conflicts.length > 0) {
                    results.conflicting++;
                }
                results.combinations.push(combo);
            }
        }

        // Test 3-pattern combinations (selective)
        if (maxCombinationSize >= 3) {
            const topPairs = results.combinations
                .filter(c => c.predicted_lift >= minPerformanceThreshold)
                .slice(0, 10); // Top 10 pairs

            for (const pair of topPairs) {
                for (const pattern of eligiblePatterns) {
                    if (!pair.patterns.includes(pattern.id)) {
                        const combo = this.testCombination([
                            ...pair.patterns.map(id => patterns.find(p => p.id === id)),
                            pattern
                        ]);
                        results.tested++;
                        if (combo.predicted_lift >= minPerformanceThreshold) {
                            results.promising++;
                        }
                        if (combo.conflicts.length > 0) {
                            results.conflicting++;
                        }
                        results.combinations.push(combo);
                    }
                }
            }
        }

        // Sort by predicted lift
        results.combinations.sort((a, b) => b.predicted_lift - a.predicted_lift);

        // Save results
        const outputPath = path.join(this.resultsDir, 'combination-test-results.json');
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

        console.log(`\n✅ Tested ${results.tested} combinations`);
        console.log(`   ${results.promising} promising (>=${minPerformanceThreshold}% lift)`);
        console.log(`   ${results.conflicting} with conflicts`);

        return results;
    }

    /**
     * Test a specific combination of patterns
     *
     * @param {Array} patterns - Array of pattern objects
     * @returns {Object} Combination test result
     */
    testCombination(patterns) {
        const patternIds = patterns.map(p => p.id);
        const patternNames = patterns.map(p => p.name);

        const result = {
            patterns: patternIds,
            pattern_names: patternNames,
            size: patterns.length,
            conflicts: [],
            synergies: [],
            predicted_lift: 0,
            confidence: 0,
            recommendation: '',
            implementation_complexity: 'low'
        };

        // Check for conflicts
        const conflicts = this.detectConflicts(patterns);
        result.conflicts = conflicts;

        // Detect synergies
        const synergies = this.detectSynergies(patterns);
        result.synergies = synergies;

        // Predict combined lift
        const prediction = this.predictCombinedLift(patterns, synergies, conflicts);
        result.predicted_lift = prediction.lift;
        result.confidence = prediction.confidence;
        result.calculation_method = prediction.method;

        // Assess implementation complexity
        result.implementation_complexity = this.assessComplexity(patterns);

        // Generate recommendation
        result.recommendation = this.generateRecommendation(result);

        return result;
    }

    /**
     * Detect conflicts between patterns
     *
     * @param {Array} patterns - Array of pattern objects
     * @returns {Array} Detected conflicts
     */
    detectConflicts(patterns) {
        const conflicts = [];

        // Check for DOM conflicts (same elements targeted)
        const targets = patterns.flatMap(p => p.targets || []);
        const duplicateTargets = targets.filter((t, i) => targets.indexOf(t) !== i);

        if (duplicateTargets.length > 0) {
            conflicts.push({
                type: 'dom_conflict',
                severity: 'high',
                description: `Multiple patterns target same elements: ${[...new Set(duplicateTargets)].join(', ')}`,
                affected_patterns: patterns
                    .filter(p => (p.targets || []).some(t => duplicateTargets.includes(t)))
                    .map(p => p.id)
            });
        }

        // Check for message conflicts (contradictory messaging)
        const hasUrgency = patterns.some(p => p.category === 'urgency' || p.name.toLowerCase().includes('urgency'));
        const hasTrust = patterns.some(p => p.category === 'trust' || p.name.toLowerCase().includes('trust'));

        if (hasUrgency && hasTrust) {
            // Urgency + trust can conflict if not carefully balanced
            conflicts.push({
                type: 'messaging_tension',
                severity: 'medium',
                description: 'Urgency patterns can undermine trust if too aggressive',
                mitigation: 'Use subtle urgency messaging with strong trust signals'
            });
        }

        // Check for timing conflicts
        const hasAnimation = patterns.some(p => p.type === 'animation' || (p.implementation && p.implementation.includes('animate')));
        if (hasAnimation && patterns.length > 2) {
            conflicts.push({
                type: 'performance_risk',
                severity: 'low',
                description: 'Multiple animation patterns may impact performance',
                mitigation: 'Stagger animations and use will-change CSS property'
            });
        }

        return conflicts;
    }

    /**
     * Detect synergies between patterns
     *
     * @param {Array} patterns - Array of pattern objects
     * @returns {Array} Detected synergies
     */
    detectSynergies(patterns) {
        const synergies = [];

        // Personalization + Urgency = Strong synergy
        const hasPersonalization = patterns.some(p => p.category === 'personalization');
        const hasUrgency = patterns.some(p => p.category === 'urgency');

        if (hasPersonalization && hasUrgency) {
            synergies.push({
                type: 'complementary_psychology',
                strength: 'high',
                description: 'Personalized urgency is more compelling than generic urgency',
                expected_boost: 1.3, // 30% synergy multiplier
                evidence: 'Personalization increases relevance, urgency drives action'
            });
        }

        // Social proof + Scarcity = Strong synergy
        const hasSocialProof = patterns.some(p => p.category === 'social_proof' || p.name.toLowerCase().includes('social'));
        const hasScarcity = patterns.some(p => p.category === 'scarcity' || p.name.toLowerCase().includes('scarcity'));

        if (hasSocialProof && hasScarcity) {
            synergies.push({
                type: 'cialdini_combination',
                strength: 'high',
                description: 'Social proof + scarcity triggers FOMO and validation',
                expected_boost: 1.25,
                evidence: 'Cialdini principles compound when combined'
            });
        }

        // Trust + Urgency = Moderate synergy
        const hasTrust = patterns.some(p => p.category === 'trust');
        if (hasTrust && hasUrgency) {
            synergies.push({
                type: 'trust_driven_action',
                strength: 'medium',
                description: 'Trust enables users to act on urgency signals',
                expected_boost: 1.15,
                evidence: 'Trust reduces risk perception, enabling faster decisions'
            });
        }

        // Personalization + Social Proof = Moderate synergy
        if (hasPersonalization && hasSocialProof) {
            synergies.push({
                type: 'relevant_validation',
                strength: 'medium',
                description: 'Personalized social proof is more credible',
                expected_boost: 1.20,
                evidence: 'Segment-specific testimonials increase identification'
            });
        }

        return synergies;
    }

    /**
     * Predict combined lift from multiple patterns
     *
     * @param {Array} patterns - Array of pattern objects
     * @param {Array} synergies - Detected synergies
     * @param {Array} conflicts - Detected conflicts
     * @returns {Object} Prediction results
     */
    predictCombinedLift(patterns, synergies, conflicts) {
        // Get individual lifts
        const individualLifts = patterns.map(p => p.performance?.average_lift || 0);

        // Method 1: Simple additive (naive)
        const additiveLift = individualLifts.reduce((sum, lift) => sum + lift, 0);

        // Method 2: Multiplicative with diminishing returns
        let multiplicativeLift = 1;
        for (const lift of individualLifts) {
            multiplicativeLift *= (1 + lift / 100);
        }
        multiplicativeLift = (multiplicativeLift - 1) * 100;

        // Method 3: Synergy-adjusted
        let synergyMultiplier = 1;
        for (const synergy of synergies) {
            synergyMultiplier *= synergy.expected_boost || 1.0;
        }
        const synergyAdjustedLift = multiplicativeLift * synergyMultiplier;

        // Method 4: Conflict-penalized
        let conflictPenalty = 1;
        for (const conflict of conflicts) {
            if (conflict.severity === 'high') {
                conflictPenalty *= 0.7; // 30% penalty
            } else if (conflict.severity === 'medium') {
                conflictPenalty *= 0.85; // 15% penalty
            } else {
                conflictPenalty *= 0.95; // 5% penalty
            }
        }
        const finalLift = synergyAdjustedLift * conflictPenalty;

        // Confidence calculation
        const hasConflicts = conflicts.length > 0;
        const hasSynergies = synergies.length > 0;

        let confidence = 0.6; // Base confidence
        if (hasSynergies) confidence += 0.2;
        if (!hasConflicts) confidence += 0.2;

        // Reduce confidence for larger combinations (more uncertainty)
        confidence *= Math.pow(0.9, patterns.length - 2);

        return {
            lift: Math.max(0, finalLift), // Can't be negative
            confidence: Math.min(1, confidence),
            method: 'synergy_adjusted_multiplicative',
            breakdown: {
                additive: additiveLift,
                multiplicative: multiplicativeLift,
                synergy_boost: synergyMultiplier,
                conflict_penalty: conflictPenalty,
                final: finalLift
            }
        };
    }

    /**
     * Assess implementation complexity
     *
     * @param {Array} patterns - Array of pattern objects
     * @returns {string} Complexity level
     */
    assessComplexity(patterns) {
        const hasAnimation = patterns.some(p => p.type === 'animation');
        const hasPersonalization = patterns.some(p => p.category === 'personalization');
        const hasDynamicContent = patterns.some(p => p.implementation && p.implementation.includes('dynamic'));

        let complexityScore = patterns.length; // Base: number of patterns

        if (hasAnimation) complexityScore += 2;
        if (hasPersonalization) complexityScore += 1;
        if (hasDynamicContent) complexityScore += 1;

        if (complexityScore <= 3) return 'low';
        if (complexityScore <= 6) return 'medium';
        return 'high';
    }

    /**
     * Generate recommendation for combination
     *
     * @param {Object} result - Combination test result
     * @returns {string} Recommendation
     */
    generateRecommendation(result) {
        const { predicted_lift, confidence, conflicts, synergies, implementation_complexity } = result;

        if (conflicts.some(c => c.severity === 'high')) {
            return `❌ NOT RECOMMENDED: High-severity conflicts detected. Resolve conflicts before implementation.`;
        }

        if (predicted_lift >= 20 && confidence >= 0.7 && implementation_complexity !== 'high') {
            return `✅ HIGHLY RECOMMENDED: ${predicted_lift.toFixed(1)}% predicted lift with ${synergies.length} synergies detected. Implement immediately.`;
        }

        if (predicted_lift >= 10 && confidence >= 0.6) {
            return `✅ RECOMMENDED: ${predicted_lift.toFixed(1)}% predicted lift. Good candidate for A/B testing.`;
        }

        if (predicted_lift >= 5 && conflicts.length === 0) {
            return `⚠️ CONSIDER: ${predicted_lift.toFixed(1)}% predicted lift. May be worth testing if resources allow.`;
        }

        return `❌ NOT RECOMMENDED: Low predicted lift (${predicted_lift.toFixed(1)}%) or high risk. Focus on higher-impact combinations.`;
    }

    /**
     * Generate top recommendations report
     *
     * @param {Object} testResults - Results from testAllCombinations
     * @param {number} topN - Number of top combinations to include
     * @returns {Object} Report
     */
    generateReport(testResults, topN = 10) {
        const topCombinations = testResults.combinations
            .filter(c => c.conflicts.filter(conf => conf.severity === 'high').length === 0)
            .slice(0, topN);

        const report = {
            summary: {
                total_tested: testResults.tested,
                promising_found: testResults.promising,
                conflicts_detected: testResults.conflicting,
                top_predicted_lift: topCombinations[0]?.predicted_lift || 0,
                timestamp: testResults.timestamp
            },
            top_combinations: topCombinations.map((combo, index) => ({
                rank: index + 1,
                ...combo,
                priority: this.calculatePriority(combo)
            })),
            implementation_plan: this.generateImplementationPlan(topCombinations),
            recommendations: this.generateTopLevelRecommendations(topCombinations)
        };

        return report;
    }

    /**
     * Calculate implementation priority
     *
     * @param {Object} combo - Combination result
     * @returns {string} Priority level
     */
    calculatePriority(combo) {
        const { predicted_lift, confidence, implementation_complexity, conflicts } = combo;

        const highSeverityConflicts = conflicts.filter(c => c.severity === 'high').length;
        if (highSeverityConflicts > 0) return 'LOW';

        const score = (predicted_lift * confidence) / (implementation_complexity === 'high' ? 2 : 1);

        if (score >= 15) return 'HIGH';
        if (score >= 8) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Generate implementation plan
     *
     * @param {Array} combinations - Top combinations
     * @returns {Array} Implementation steps
     */
    generateImplementationPlan(combinations) {
        const plan = [];

        const highPriority = combinations.filter(c => this.calculatePriority(c) === 'HIGH');
        const mediumPriority = combinations.filter(c => this.calculatePriority(c) === 'MEDIUM');

        if (highPriority.length > 0) {
            plan.push({
                phase: 'Week 1-2',
                action: 'Implement high-priority combinations',
                combinations: highPriority.slice(0, 3).map(c => c.pattern_names.join(' + ')),
                expected_impact: `+${highPriority.slice(0, 3).reduce((sum, c) => sum + c.predicted_lift, 0).toFixed(1)}% cumulative lift`
            });
        }

        if (mediumPriority.length > 0) {
            plan.push({
                phase: 'Week 3-4',
                action: 'A/B test medium-priority combinations',
                combinations: mediumPriority.slice(0, 2).map(c => c.pattern_names.join(' + ')),
                expected_impact: `+${mediumPriority.slice(0, 2).reduce((sum, c) => sum + c.predicted_lift, 0).toFixed(1)}% cumulative lift`
            });
        }

        plan.push({
            phase: 'Ongoing',
            action: 'Monitor performance and iterate',
            combinations: ['All deployed combinations'],
            expected_impact: 'Sustained optimization through continuous refinement'
        });

        return plan;
    }

    /**
     * Generate top-level recommendations
     *
     * @param {Array} combinations - Top combinations
     * @returns {Array} Recommendations
     */
    generateTopLevelRecommendations(combinations) {
        const recommendations = [];

        // Top combination
        if (combinations.length > 0) {
            const top = combinations[0];
            recommendations.push({
                priority: 'IMMEDIATE',
                action: `Implement ${top.pattern_names.join(' + ')}`,
                rationale: `Highest predicted lift (${top.predicted_lift.toFixed(1)}%) with ${top.synergies.length} synergies`,
                next_steps: [
                    'Create A/B test configuration',
                    'Implement pattern combination on test page',
                    'Monitor for 7-14 days',
                    'Scale to production if successful'
                ]
            });
        }

        // Pattern types to explore
        const categories = [...new Set(combinations.flatMap(c => c.patterns))];
        if (categories.length < 3) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Expand pattern library',
                rationale: 'Limited pattern diversity reduces combination opportunities',
                next_steps: [
                    'Conduct exploratory discovery for new pattern types',
                    'Test emerging UX trends',
                    'Cross-pollinate patterns from high-performing industries'
                ]
            });
        }

        // Conflict resolution
        const conflictingCombos = combinations.filter(c => c.conflicts.length > 0);
        if (conflictingCombos.length > 0) {
            recommendations.push({
                priority: 'LOW',
                action: 'Resolve pattern conflicts',
                rationale: `${conflictingCombos.length} promising combinations have conflicts`,
                next_steps: [
                    'Refactor patterns to avoid DOM conflicts',
                    'Create conflict resolution guidelines',
                    'Test conflict mitigations'
                ]
            });
        }

        return recommendations;
    }
}

// Add markdown report generation
PatternCombinationTester.prototype.generateMarkdownReport = function(report) {
    let md = `# Pattern Combination Analysis Report\n\n`;
    md += `**Generated**: ${new Date(report.summary.timestamp).toLocaleString()}\n\n`;

    md += `## Summary\n\n`;
    md += `- **Total Combinations Tested**: ${report.summary.total_tested}\n`;
    md += `- **Promising Combinations**: ${report.summary.promising_found}\n`;
    md += `- **Conflicts Detected**: ${report.summary.conflicts_detected}\n`;
    md += `- **Top Predicted Lift**: ${report.summary.top_predicted_lift.toFixed(1)}%\n\n`;

    md += `## Top 10 Combinations\n\n`;
    report.top_combinations.forEach(combo => {
        md += `### ${combo.rank}. ${combo.pattern_names.join(' + ')}\n\n`;
        md += `- **Predicted Lift**: ${combo.predicted_lift.toFixed(1)}%\n`;
        md += `- **Confidence**: ${(combo.confidence * 100).toFixed(1)}%\n`;
        md += `- **Priority**: ${combo.priority}\n`;
        md += `- **Complexity**: ${combo.implementation_complexity}\n`;
        md += `- **Synergies**: ${combo.synergies.length}\n`;
        md += `- **Conflicts**: ${combo.conflicts.length}\n\n`;

        if (combo.synergies.length > 0) {
            md += `**Synergies Detected**:\n`;
            combo.synergies.forEach(s => {
                md += `- ${s.description} (${s.strength} strength, +${((s.expected_boost - 1) * 100).toFixed(0)}% boost)\n`;
            });
            md += `\n`;
        }

        if (combo.conflicts.length > 0) {
            md += `**Conflicts**:\n`;
            combo.conflicts.forEach(c => {
                md += `- [${c.severity.toUpperCase()}] ${c.description}\n`;
            });
            md += `\n`;
        }

        md += `**Recommendation**: ${combo.recommendation}\n\n`;
        md += `---\n\n`;
    });

    md += `## Implementation Plan\n\n`;
    report.implementation_plan.forEach(phase => {
        md += `### ${phase.phase}\n\n`;
        md += `**Action**: ${phase.action}\n\n`;
        md += `**Combinations**:\n`;
        phase.combinations.forEach(c => {
            md += `- ${c}\n`;
        });
        md += `\n**Expected Impact**: ${phase.expected_impact}\n\n`;
    });

    md += `## Recommendations\n\n`;
    report.recommendations.forEach(rec => {
        md += `### ${rec.priority} Priority: ${rec.action}\n\n`;
        md += `**Rationale**: ${rec.rationale}\n\n`;
        md += `**Next Steps**:\n`;
        rec.next_steps.forEach(step => {
            md += `1. ${step}\n`;
        });
        md += `\n`;
    });

    return md;
};

module.exports = PatternCombinationTester;

// Example usage
if (require.main === module) {
    const tester = new PatternCombinationTester();

    console.log('Pattern Combination Testing');
    console.log('============================\n');

    // Test all combinations
    const results = tester.testAllCombinations({
        maxCombinationSize: 3,
        minPerformanceThreshold: 5.0,
        onlyProduction: true
    });

    // Generate report
    const report = tester.generateReport(results, 10);

    // Save report
    const reportPath = path.join(tester.resultsDir, 'combination-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    const mdPath = path.join(tester.resultsDir, 'COMBINATION_ANALYSIS.md');
    fs.writeFileSync(mdPath, tester.generateMarkdownReport(report));

    console.log(`\n✅ Report generated: ${reportPath}`);
    console.log(`✅ Markdown report: ${mdPath}`);
}
