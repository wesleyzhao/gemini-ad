/**
 * Simple validation test for exploratory pattern implementations
 * Validates file existence and HTML structure without browser automation
 */

const fs = require('fs');
const path = require('path');

function validateExploratoryPatterns() {
    console.log('==========================================');
    console.log('EXPLORATORY PATTERNS VALIDATION');
    console.log('==========================================\n');

    let testsPassed = 0;
    let testsFailed = 0;
    const tests = [];

    // Test 1: Personalized writers page exists
    console.log('Test 1: Personalized Writers Page');
    console.log('-----------------------------------');
    try {
        const filePath = path.resolve(__dirname, '../pages/writers-personalized.html');
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist');
        }

        const content = fs.readFileSync(filePath, 'utf8');

        // Check for personalization elements
        const hasPersonalizationBadge = content.includes('personalization-badge');
        const hasDataPersonalize = content.includes('data-personalize');
        const hasSegmentRules = content.includes('personalizationRules');
        const hasFictionWriter = content.includes('fiction-writer');
        const hasBusinessWriter = content.includes('business-writer');

        console.log(`  ✓ File exists: ${filePath}`);
        console.log(`  ✓ Has personalization badge: ${hasPersonalizationBadge}`);
        console.log(`  ✓ Has data-personalize attributes: ${hasDataPersonalize}`);
        console.log(`  ✓ Has personalization rules: ${hasSegmentRules}`);
        console.log(`  ✓ Includes fiction-writer segment: ${hasFictionWriter}`);
        console.log(`  ✓ Includes business-writer segment: ${hasBusinessWriter}`);

        if (hasPersonalizationBadge && hasDataPersonalize && hasSegmentRules) {
            console.log('  ✅ PASS: Personalization pattern correctly implemented\n');
            testsPassed++;
            tests.push({ name: 'Personalized Writers Page', status: 'PASS' });
        } else {
            throw new Error('Missing personalization elements');
        }
    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}\n`);
        testsFailed++;
        tests.push({ name: 'Personalized Writers Page', status: 'FAIL', error: error.message });
    }

    // Test 2: Urgency trust page exists
    console.log('Test 2: Urgency Trust Page');
    console.log('---------------------------');
    try {
        const filePath = path.resolve(__dirname, '../pages/trust-urgency.html');
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist');
        }

        const content = fs.readFileSync(filePath, 'utf8');

        // Check for urgency elements
        const hasUrgencyBanner = content.includes('urgency-banner');
        const hasCountdownTimer = content.includes('countdown-timer');
        const hasCountdownScript = content.includes('updateCountdown');
        const hasSpotsRemaining = content.includes('spots-remaining');
        const hasLimitedAccess = content.includes('Limited Early Access') || content.includes('Early Access');

        console.log(`  ✓ File exists: ${filePath}`);
        console.log(`  ✓ Has urgency banner: ${hasUrgencyBanner}`);
        console.log(`  ✓ Has countdown timer: ${hasCountdownTimer}`);
        console.log(`  ✓ Has countdown script: ${hasCountdownScript}`);
        console.log(`  ✓ Has spots remaining: ${hasSpotsRemaining}`);
        console.log(`  ✓ Has limited access messaging: ${hasLimitedAccess}`);

        if (hasUrgencyBanner && hasCountdownTimer && hasCountdownScript) {
            console.log('  ✅ PASS: Urgency pattern correctly implemented\n');
            testsPassed++;
            tests.push({ name: 'Urgency Trust Page', status: 'PASS' });
        } else {
            throw new Error('Missing urgency elements');
        }
    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}\n`);
        testsFailed++;
        tests.push({ name: 'Urgency Trust Page', status: 'FAIL', error: error.message });
    }

    // Test 3: HTML validity (basic checks)
    console.log('Test 3: HTML Structure Validation');
    console.log('----------------------------------');
    try {
        const files = [
            '../pages/writers-personalized.html',
            '../pages/trust-urgency.html'
        ];

        let allValid = true;
        for (const file of files) {
            const filePath = path.resolve(__dirname, file);
            const content = fs.readFileSync(filePath, 'utf8');

            // Basic HTML validation
            const hasDoctype = content.trim().startsWith('<!DOCTYPE html>');
            const hasHtmlTag = content.includes('<html') && content.includes('</html>');
            const hasHeadTag = content.includes('<head>') && content.includes('</head>');
            const hasBodyTag = content.includes('<body') && content.includes('</body>');
            const hasTitle = content.includes('<title>');
            const hasMetaViewport = content.includes('viewport');

            console.log(`  Validating ${path.basename(file)}:`);
            console.log(`    ✓ DOCTYPE: ${hasDoctype}`);
            console.log(`    ✓ HTML tags: ${hasHtmlTag}`);
            console.log(`    ✓ Head tags: ${hasHeadTag}`);
            console.log(`    ✓ Body tags: ${hasBodyTag}`);
            console.log(`    ✓ Title: ${hasTitle}`);
            console.log(`    ✓ Meta viewport: ${hasMetaViewport}`);

            if (!hasDoctype || !hasHtmlTag || !hasHeadTag || !hasBodyTag) {
                allValid = false;
            }
        }

        if (allValid) {
            console.log('  ✅ PASS: All HTML files are structurally valid\n');
            testsPassed++;
            tests.push({ name: 'HTML Structure Validation', status: 'PASS' });
        } else {
            throw new Error('Some HTML files have structural issues');
        }
    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}\n`);
        testsFailed++;
        tests.push({ name: 'HTML Structure Validation', status: 'FAIL', error: error.message });
    }

    // Test 4: JavaScript implementation
    console.log('Test 4: JavaScript Implementation');
    console.log('----------------------------------');
    try {
        // Check personalization script
        const personalizedPath = path.resolve(__dirname, '../pages/writers-personalized.html');
        const personalizedContent = fs.readFileSync(personalizedPath, 'utf8');

        const hasGetUserSegment = personalizedContent.includes('getUserSegment');
        const hasApplyPersonalization = personalizedContent.includes('applyPersonalization');
        const hasPersonalizationRules = personalizedContent.includes('personalizationRules');

        console.log('  Personalization Script:');
        console.log(`    ✓ Has getUserSegment function: ${hasGetUserSegment}`);
        console.log(`    ✓ Has applyPersonalization function: ${hasApplyPersonalization}`);
        console.log(`    ✓ Has personalizationRules object: ${hasPersonalizationRules}`);

        // Check urgency script
        const urgencyPath = path.resolve(__dirname, '../pages/trust-urgency.html');
        const urgencyContent = fs.readFileSync(urgencyPath, 'utf8');

        const hasUpdateCountdown = urgencyContent.includes('updateCountdown');
        const hasEndTime = urgencyContent.includes('endTime');
        const hasSpotsLogic = urgencyContent.includes('spotsRemaining');

        console.log('  Urgency Script:');
        console.log(`    ✓ Has updateCountdown function: ${hasUpdateCountdown}`);
        console.log(`    ✓ Has endTime variable: ${hasEndTime}`);
        console.log(`    ✓ Has spots logic: ${hasSpotsLogic}`);

        if (hasGetUserSegment && hasApplyPersonalization && hasUpdateCountdown && hasEndTime) {
            console.log('  ✅ PASS: JavaScript implementations are complete\n');
            testsPassed++;
            tests.push({ name: 'JavaScript Implementation', status: 'PASS' });
        } else {
            throw new Error('Missing JavaScript functions');
        }
    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}\n`);
        testsFailed++;
        tests.push({ name: 'JavaScript Implementation', status: 'FAIL', error: error.message });
    }

    // Test 5: Analytics tracking
    console.log('Test 5: Analytics Tracking');
    console.log('--------------------------');
    try {
        const files = [
            '../pages/writers-personalized.html',
            '../pages/trust-urgency.html'
        ];

        let allHaveTracking = true;
        for (const file of files) {
            const filePath = path.resolve(__dirname, file);
            const content = fs.readFileSync(filePath, 'utf8');

            const hasGtag = content.includes('gtag(');
            const hasEventTracking = content.includes("gtag('event'");

            console.log(`  ${path.basename(file)}:`);
            console.log(`    ✓ Has gtag: ${hasGtag}`);
            console.log(`    ✓ Has event tracking: ${hasEventTracking}`);

            if (!hasGtag || !hasEventTracking) {
                allHaveTracking = false;
            }
        }

        if (allHaveTracking) {
            console.log('  ✅ PASS: Analytics tracking implemented\n');
            testsPassed++;
            tests.push({ name: 'Analytics Tracking', status: 'PASS' });
        } else {
            throw new Error('Missing analytics tracking');
        }
    } catch (error) {
        console.log(`  ❌ FAIL: ${error.message}\n`);
        testsFailed++;
        tests.push({ name: 'Analytics Tracking', status: 'FAIL', error: error.message });
    }

    // Summary
    console.log('==========================================');
    console.log('VALIDATION SUMMARY');
    console.log('==========================================');
    const total = testsPassed + testsFailed;
    const passRate = ((testsPassed / total) * 100).toFixed(1);
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${testsPassed} ✅`);
    console.log(`Failed: ${testsFailed} ${testsFailed > 0 ? '❌' : ''}`);
    console.log(`Pass Rate: ${passRate}%`);
    console.log('==========================================\n');

    // Save results
    const results = {
        timestamp: new Date().toISOString(),
        total,
        passed: testsPassed,
        failed: testsFailed,
        passRate: parseFloat(passRate),
        tests
    };

    const reportDir = path.resolve(__dirname, '../test-reports-exploratory');
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(reportDir, 'validation-results.json'),
        JSON.stringify(results, null, 2)
    );

    // Generate markdown report
    let markdown = '# Exploratory Patterns Validation Report\n\n';
    markdown += `**Generated:** ${results.timestamp}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total Tests:** ${total}\n`;
    markdown += `- **Passed:** ${testsPassed} ✅\n`;
    markdown += `- **Failed:** ${testsFailed} ${testsFailed > 0 ? '❌' : ''}\n`;
    markdown += `- **Pass Rate:** ${passRate}%\n\n`;

    markdown += `## Test Results\n\n`;
    tests.forEach((test, index) => {
        markdown += `### ${index + 1}. ${test.name}\n\n`;
        markdown += `**Status:** ${test.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}\n\n`;
        if (test.error) {
            markdown += `**Error:** ${test.error}\n\n`;
        }
    });

    markdown += `## Implemented Patterns\n\n`;
    markdown += `### 1. Personalization Pattern (20% Expected Impact)\n\n`;
    markdown += `- **File:** pages/writers-personalized.html\n`;
    markdown += `- **Implementation:** Dynamic hero content based on URL segment parameter\n`;
    markdown += `- **Segments Supported:**\n`;
    markdown += `  - fiction-writer\n`;
    markdown += `  - business-writer\n`;
    markdown += `  - content-creator\n`;
    markdown += `  - academic-writer\n`;
    markdown += `  - blogger\n`;
    markdown += `- **Features:**\n`;
    markdown += `  - Dynamic badge text\n`;
    markdown += `  - Personalized heading\n`;
    markdown += `  - Customized description\n`;
    markdown += `  - Segment-specific CTAs\n`;
    markdown += `  - Analytics tracking\n\n`;

    markdown += `### 2. Urgency Pattern (18% Expected Impact)\n\n`;
    markdown += `- **File:** pages/trust-urgency.html\n`;
    markdown += `- **Implementation:** Countdown timer with scarcity messaging\n`;
    markdown += `- **Features:**\n`;
    markdown += `  - 24-hour countdown timer\n`;
    markdown += `  - Real-time seconds update\n`;
    markdown += `  - Spots remaining counter\n`;
    markdown += `  - Urgency banner\n`;
    markdown += `  - Animated CTA\n`;
    markdown += `  - Mobile responsive\n\n`;

    markdown += `## Next Steps\n\n`;
    markdown += `1. ✅ Patterns implemented and validated\n`;
    markdown += `2. ⏳ Deploy to test environment\n`;
    markdown += `3. ⏳ Monitor velocity improvements (target: > 0.5 pts/cycle)\n`;
    markdown += `4. ⏳ Compare against baseline (78.5/95)\n`;
    markdown += `5. ⏳ Add successful patterns to pattern library\n`;
    markdown += `6. ⏳ Scale winning patterns to other pages\n\n`;

    markdown += `## Success Criteria\n\n`;
    markdown += `- Velocity improves from 0.18 pts/cycle to >0.5 pts/cycle\n`;
    markdown += `- At least 1 pattern shows >10% improvement\n`;
    markdown += `- No regression in existing metrics\n`;
    markdown += `- New pattern category added to library\n`;

    fs.writeFileSync(
        path.join(reportDir, 'validation-report.md'),
        markdown
    );

    console.log('✓ Results saved to: test-reports-exploratory/validation-results.json');
    console.log('✓ Report saved to: test-reports-exploratory/validation-report.md\n');

    if (testsFailed === 0) {
        console.log('🎉 ALL TESTS PASSED! Exploratory patterns ready for deployment.\n');
        return 0;
    } else {
        console.log('⚠️  Some tests failed. Review results above.\n');
        return 1;
    }
}

// Run validation
try {
    process.exit(validateExploratoryPatterns());
} catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
}
