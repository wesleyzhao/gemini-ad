/**
 * Velocity Monitoring Script for Exploratory Patterns
 * Tracks improvement velocity and validates stagnation breakout
 */

const fs = require('fs');
const path = require('path');

// Paths
const cycleHistoryPath = path.resolve(__dirname, '../data/cycle-history.json');
const baselinePath = path.resolve(__dirname, '../data/performance-baseline.json');
const reportPath = path.resolve(__dirname, '../reports/optimization/exploratory-velocity-report.md');
const jsonReportPath = path.resolve(__dirname, '../reports/optimization/exploratory-velocity-report.json');

function trackExploratoryVelocity() {
    console.log('==========================================');
    console.log('EXPLORATORY PATTERN VELOCITY TRACKING');
    console.log('==========================================\n');

    // Load data
    const cycleHistory = fs.existsSync(cycleHistoryPath)
        ? JSON.parse(fs.readFileSync(cycleHistoryPath, 'utf8'))
        : [];

    const baseline = fs.existsSync(baselinePath)
        ? JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
        : { score: 75, timestamp: new Date().toISOString() };

    if (cycleHistory.length === 0) {
        console.log('⚠️  No cycle history found. Please run optimization cycles first.');
        console.log('   This script will track velocity improvements after exploratory patterns are deployed.\n');

        // Create placeholder report
        const placeholder = {
            timestamp: new Date().toISOString(),
            status: 'AWAITING_DATA',
            message: 'Exploratory patterns implemented. Awaiting cycle data to measure velocity improvements.',
            baseline: baseline.score,
            target: {
                velocity: 0.5,
                improvement: 10,
                currentVelocity: 0.18
            },
            exploratoryPatterns: [
                {
                    name: 'Personalization',
                    file: 'pages/writers-personalized.html',
                    expectedImpact: 20,
                    status: 'DEPLOYED'
                },
                {
                    name: 'Urgency',
                    file: 'pages/trust-urgency.html',
                    expectedImpact: 18,
                    status: 'DEPLOYED'
                }
            ]
        };

        fs.writeFileSync(jsonReportPath, JSON.stringify(placeholder, null, 2));
        console.log('✓ Placeholder report created\n');
        return;
    }

    // Calculate current metrics
    const recentCycles = cycleHistory.slice(-5); // Last 5 cycles
    const currentScore = cycleHistory[cycleHistory.length - 1]?.score || baseline.score;
    const previousScore = cycleHistory.length > 1
        ? cycleHistory[cycleHistory.length - 2].score
        : baseline.score;

    // Calculate velocity (points per cycle)
    const totalImprovement = currentScore - baseline.score;
    const velocity = cycleHistory.length > 0
        ? totalImprovement / cycleHistory.length
        : 0;

    // Calculate recent velocity (last 5 cycles)
    const recentVelocity = recentCycles.length > 1
        ? (recentCycles[recentCycles.length - 1].score - recentCycles[0].score) / recentCycles.length
        : velocity;

    // Detect trend
    let trend = 'stable';
    if (recentVelocity > velocity * 1.2) {
        trend = 'accelerating';
    } else if (recentVelocity < velocity * 0.8) {
        trend = 'decelerating';
    }

    // Check stagnation breakout
    const wasStagnant = velocity < 0.5;
    const isNowImproving = recentVelocity >= 0.5;
    const stagnationBroken = wasStagnant && isNowImproving;

    // Output results
    console.log('Current Metrics:');
    console.log('-'.repeat(40));
    console.log(`Current Score:       ${currentScore.toFixed(1)} / 95`);
    console.log(`Previous Score:      ${previousScore.toFixed(1)} / 95`);
    console.log(`Baseline Score:      ${baseline.score.toFixed(1)} / 95`);
    console.log(`Total Improvement:   +${totalImprovement.toFixed(1)} points`);
    console.log(`Cycles Completed:    ${cycleHistory.length}`);
    console.log(`\nVelocity Analysis:`);
    console.log('-'.repeat(40));
    console.log(`Overall Velocity:    ${velocity.toFixed(2)} pts/cycle`);
    console.log(`Recent Velocity:     ${recentVelocity.toFixed(2)} pts/cycle`);
    console.log(`Trend:               ${trend}`);
    console.log(`Target Velocity:     0.50 pts/cycle`);
    console.log(`\nStagnation Status:`);
    console.log('-'.repeat(40));
    console.log(`Previous State:      ${wasStagnant ? 'Stagnant' : 'Improving'}`);
    console.log(`Current State:       ${isNowImproving ? 'Improving ✅' : 'Stagnant ⚠️'}`);
    console.log(`Breakout Achieved:   ${stagnationBroken ? 'YES 🎉' : 'Not yet'}`);

    // Success criteria check
    console.log(`\nSuccess Criteria:`);
    console.log('-'.repeat(40));
    const velocityTarget = recentVelocity >= 0.5;
    const improvementTarget = totalImprovement >= 10;
    const trendPositive = trend === 'accelerating' || trend === 'stable';

    console.log(`✓ Velocity > 0.5:        ${velocityTarget ? 'PASS ✅' : 'PENDING'} (${recentVelocity.toFixed(2)})`);
    console.log(`✓ Improvement > 10pts:   ${improvementTarget ? 'PASS ✅' : 'PENDING'} (${totalImprovement.toFixed(1)})`);
    console.log(`✓ Positive Trend:        ${trendPositive ? 'PASS ✅' : 'NEEDS ATTENTION'} (${trend})`);

    // Recommendations
    console.log(`\nRecommendations:`);
    console.log('-'.repeat(40));

    if (stagnationBroken) {
        console.log('🎉 Stagnation successfully broken!');
        console.log('   → Add successful exploratory patterns to pattern library');
        console.log('   → Scale winning patterns to other pages');
        console.log('   → Continue monitoring velocity over next 3 cycles');
    } else if (isNowImproving) {
        console.log('✅ Velocity improving, continue current approach');
        console.log('   → Monitor for 2-3 more cycles to confirm trend');
        console.log('   → Prepare to scale successful patterns');
    } else {
        console.log('⚠️  Still stagnant, consider additional actions:');
        console.log('   → Test more exploratory pattern variations');
        console.log('   → Adjust test parameters (audience, timing)');
        console.log('   → Review pattern implementation quality');
    }

    // Create detailed report
    const report = {
        timestamp: new Date().toISOString(),
        status: stagnationBroken ? 'BREAKOUT_ACHIEVED' : isNowImproving ? 'IMPROVING' : 'STAGNANT',
        metrics: {
            currentScore,
            previousScore,
            baselineScore: baseline.score,
            totalImprovement,
            cyclesCompleted: cycleHistory.length
        },
        velocity: {
            overall: velocity,
            recent: recentVelocity,
            trend,
            target: 0.5
        },
        stagnation: {
            wasStagnant,
            isNowImproving,
            breakoutAchieved: stagnationBroken
        },
        successCriteria: {
            velocityTarget: { required: 0.5, actual: recentVelocity, met: velocityTarget },
            improvementTarget: { required: 10, actual: totalImprovement, met: improvementTarget },
            trendPositive: { required: true, actual: trend, met: trendPositive }
        },
        exploratoryPatterns: [
            {
                name: 'Personalization',
                file: 'pages/writers-personalized.html',
                expectedImpact: 20,
                status: 'ACTIVE'
            },
            {
                name: 'Urgency',
                file: 'pages/trust-urgency.html',
                expectedImpact: 18,
                status: 'ACTIVE'
            }
        ]
    };

    // Save JSON report
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
    console.log(`\n✓ Report saved to: ${path.relative(process.cwd(), jsonReportPath)}`);

    // Generate markdown report
    let markdown = '# Exploratory Pattern Velocity Report\n\n';
    markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
    markdown += `**Status:** ${report.status}\n\n`;

    markdown += `## Current Metrics\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Current Score | ${currentScore.toFixed(1)} / 95 |\n`;
    markdown += `| Previous Score | ${previousScore.toFixed(1)} / 95 |\n`;
    markdown += `| Baseline Score | ${baseline.score.toFixed(1)} / 95 |\n`;
    markdown += `| Total Improvement | +${totalImprovement.toFixed(1)} points |\n`;
    markdown += `| Cycles Completed | ${cycleHistory.length} |\n\n`;

    markdown += `## Velocity Analysis\n\n`;
    markdown += `| Metric | Value | Status |\n`;
    markdown += `|--------|-------|--------|\n`;
    markdown += `| Overall Velocity | ${velocity.toFixed(2)} pts/cycle | - |\n`;
    markdown += `| Recent Velocity | ${recentVelocity.toFixed(2)} pts/cycle | ${trend} |\n`;
    markdown += `| Target Velocity | 0.50 pts/cycle | ${velocityTarget ? '✅ Met' : '⏳ Pending'} |\n\n`;

    markdown += `## Stagnation Status\n\n`;
    markdown += `- **Previous State:** ${wasStagnant ? 'Stagnant' : 'Improving'}\n`;
    markdown += `- **Current State:** ${isNowImproving ? '✅ Improving' : '⚠️ Stagnant'}\n`;
    markdown += `- **Breakout Achieved:** ${stagnationBroken ? '🎉 YES' : 'Not yet'}\n\n`;

    markdown += `## Success Criteria\n\n`;
    markdown += `- ${velocityTarget ? '✅' : '⏳'} Velocity > 0.5 pts/cycle (${recentVelocity.toFixed(2)})\n`;
    markdown += `- ${improvementTarget ? '✅' : '⏳'} Total improvement > 10 points (${totalImprovement.toFixed(1)})\n`;
    markdown += `- ${trendPositive ? '✅' : '⚠️'} Positive trend (${trend})\n\n`;

    markdown += `## Exploratory Patterns Deployed\n\n`;
    markdown += `### 1. Personalization Pattern\n\n`;
    markdown += `- **File:** pages/writers-personalized.html\n`;
    markdown += `- **Expected Impact:** 20%\n`;
    markdown += `- **Status:** ACTIVE\n`;
    markdown += `- **Implementation:** Dynamic hero content based on user segment\n\n`;

    markdown += `### 2. Urgency Pattern\n\n`;
    markdown += `- **File:** pages/trust-urgency.html\n`;
    markdown += `- **Expected Impact:** 18%\n`;
    markdown += `- **Status:** ACTIVE\n`;
    markdown += `- **Implementation:** Countdown timer with scarcity messaging\n\n`;

    markdown += `## Recommendations\n\n`;
    if (stagnationBroken) {
        markdown += `✅ **Stagnation successfully broken!**\n\n`;
        markdown += `Next steps:\n`;
        markdown += `1. Add successful exploratory patterns to pattern library\n`;
        markdown += `2. Scale winning patterns to other pages\n`;
        markdown += `3. Continue monitoring velocity over next 3 cycles\n`;
    } else if (isNowImproving) {
        markdown += `✅ **Velocity improving**\n\n`;
        markdown += `Next steps:\n`;
        markdown += `1. Monitor for 2-3 more cycles to confirm trend\n`;
        markdown += `2. Prepare to scale successful patterns\n`;
    } else {
        markdown += `⚠️ **Still stagnant**\n\n`;
        markdown += `Actions needed:\n`;
        markdown += `1. Test more exploratory pattern variations\n`;
        markdown += `2. Adjust test parameters (audience, timing)\n`;
        markdown += `3. Review pattern implementation quality\n`;
    }

    markdown += `\n## Next Steps\n\n`;
    markdown += `1. Continue running optimization cycles\n`;
    markdown += `2. Monitor velocity over next 2-3 cycles\n`;
    markdown += `3. Analyze which exploratory patterns are most effective\n`;
    markdown += `4. Scale winning patterns to additional pages\n`;
    markdown += `5. Target: Sustained velocity > 0.5 pts/cycle\n`;

    fs.writeFileSync(reportPath, markdown);
    console.log(`✓ Markdown report saved to: ${path.relative(process.cwd(), reportPath)}\n`);

    console.log('==========================================\n');
}

// Run tracking
try {
    trackExploratoryVelocity();
} catch (error) {
    console.error('Error tracking velocity:', error);
    process.exit(1);
}
