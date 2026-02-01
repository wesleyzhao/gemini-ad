#!/usr/bin/env node

/**
 * Deployment Status Checker
 *
 * Provides information about deployment configuration and next steps.
 * This script does NOT actually check GitHub deployment status (requires API access).
 * Instead, it validates local configuration and provides guidance.
 *
 * Usage: npm run deploy:check
 */

const fs = require('fs');

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
    dim: '\x1b[2m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
    log(`\n${'='.repeat(70)}`, 'cyan');
    log(`  ${text}`, 'bold');
    log('='.repeat(70), 'cyan');
}

function box(lines, color = 'cyan') {
    const maxLength = Math.max(...lines.map(l => l.length));
    const width = maxLength + 4;

    log(`┌${'─'.repeat(width)}┐`, color);
    lines.forEach(line => {
        const padding = ' '.repeat(maxLength - line.length);
        log(`│  ${line}${padding}  │`, color);
    });
    log(`└${'─'.repeat(width)}┘`, color);
}

function checkDeploymentStatus() {
    header('GitHub Pages Deployment Status');

    // Check if required files exist
    const hasWorkflow = fs.existsSync('.github/workflows/deploy.yml');
    const hasNojekyll = fs.existsSync('.nojekyll');
    const hasIndex = fs.existsSync('index.html');
    const hasCNAME = fs.existsSync('CNAME');

    log('\n  Configuration Status:', 'cyan');
    log(`    ${hasWorkflow ? '✓' : '✗'} GitHub Actions workflow: ${hasWorkflow ? 'Configured' : 'Missing'}`, hasWorkflow ? 'green' : 'red');
    log(`    ${hasNojekyll ? '✓' : '✗'} .nojekyll file: ${hasNojekyll ? 'Present' : 'Missing'}`, hasNojekyll ? 'green' : 'red');
    log(`    ${hasIndex ? '✓' : '✗'} Homepage: ${hasIndex ? 'Present' : 'Missing'}`, hasIndex ? 'green' : 'red');
    log(`    ${hasCNAME ? '✓' : '⚠'} Custom domain: ${hasCNAME ? 'Configured' : 'Not configured (using default)'}`, hasCNAME ? 'green' : 'yellow');

    if (hasCNAME) {
        const domain = fs.readFileSync('CNAME', 'utf8').trim();
        log(`      Domain: ${domain}`, 'cyan');
    }

    const isReady = hasWorkflow && hasNojekyll && hasIndex;

    if (isReady) {
        log('\n  ✓ Deployment configuration is READY!', 'green');
    } else {
        log('\n  ✗ Deployment configuration is INCOMPLETE!', 'red');
        log('    Run: npm run validate:deployment', 'yellow');
        return;
    }

    // Deployment instructions
    header('How to Deploy');

    log('\n  Automatic Deployment (Recommended):', 'cyan');
    log('    1. Ensure GitHub Pages is enabled in repository settings:', 'reset');
    log('       → Settings → Pages → Source: "GitHub Actions"', 'dim');
    log('    2. Push to main branch:', 'reset');
    log('       git add .', 'dim');
    log('       git commit -m "Deploy to GitHub Pages"', 'dim');
    log('       git push origin main', 'dim');
    log('    3. Monitor deployment:', 'reset');
    log('       → Go to Actions tab in GitHub repository', 'dim');
    log('       → Watch "Deploy to GitHub Pages" workflow', 'dim');

    log('\n  Manual Deployment Trigger:', 'cyan');
    log('    1. Go to repository Actions tab', 'reset');
    log('    2. Select "Deploy to GitHub Pages" workflow', 'reset');
    log('    3. Click "Run workflow" button', 'reset');
    log('    4. Select "main" branch', 'reset');
    log('    5. Click green "Run workflow" button', 'reset');

    header('Expected Site URLs');

    // Try to detect repository info from git
    let repoInfo = '';
    try {
        const { execSync } = require('child_process');
        const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();

        // Parse GitHub URL
        const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
        if (match) {
            const username = match[1];
            const repoName = match[2];
            repoInfo = `${username}.github.io/${repoName}`;

            log('\n  Default GitHub Pages URL:', 'cyan');
            log(`    https://${repoInfo}/`, 'green');

            log('\n  Landing Pages:', 'cyan');
            log(`    https://${repoInfo}/pages/index.html (Gallery hub)`, 'dim');
            log(`    https://${repoInfo}/pages/valentine.html`, 'dim');
            log(`    https://${repoInfo}/pages/writers.html`, 'dim');
            log(`    https://${repoInfo}/pages/creators.html`, 'dim');
            log(`    ... (14 pages total)`, 'dim');
        }
    } catch (e) {
        // Git not available or not a git repo
        log('\n  GitHub Pages URL:', 'cyan');
        log('    https://[username].github.io/[repository-name]/', 'yellow');
    }

    if (hasCNAME) {
        const domain = fs.readFileSync('CNAME', 'utf8').trim();
        log('\n  Custom Domain URL:', 'cyan');
        log(`    https://${domain}/`, 'green');
        log(`    (After DNS propagation - may take 24-48 hours)`, 'dim');
    }

    header('Validation & Testing');

    log('\n  Before deploying, run:', 'cyan');
    log('    npm run validate           # Full validation suite', 'dim');
    log('    npm run validate:deployment # Deployment config check', 'dim');
    log('    npm run serve              # Test locally at localhost:8080', 'dim');

    log('\n  After deploying, test:', 'cyan');
    log('    • All 14 landing pages load correctly', 'dim');
    log('    • CSS and JavaScript work (check browser console)', 'dim');
    log('    • Mobile responsiveness (test on phone/tablet)', 'dim');
    log('    • Accessibility (keyboard navigation)', 'dim');
    log('    • Performance (Google PageSpeed Insights)', 'dim');

    header('Troubleshooting');

    log('\n  Common Issues:', 'yellow');
    log('    1. Site not loading:', 'reset');
    log('       → Check Settings → Pages → GitHub Pages enabled', 'dim');
    log('       → Wait 2-5 minutes after first deployment', 'dim');
    log('       → Clear browser cache (Ctrl+Shift+Delete)', 'dim');

    log('\n    2. CSS/JS not loading:', 'reset');
    log('       → Verify .nojekyll file exists', 'dim');
    log('       → Check browser console for 404 errors', 'dim');

    log('\n    3. Deployment fails:', 'reset');
    log('       → Check Actions tab → Click failed workflow → View logs', 'dim');
    log('       → Fix validation errors and push again', 'dim');

    log('\n    4. Custom domain not working:', 'reset');
    log('       → Verify DNS records (dig +noall +answer [domain])', 'dim');
    log('       → Wait for DNS propagation (24-48 hours)', 'dim');
    log('       → Enable "Enforce HTTPS" after DNS propagates', 'dim');

    header('Resources');

    log('\n  Documentation:', 'cyan');
    log('    • DEPLOYMENT.md - Comprehensive deployment guide', 'dim');
    log('    • GitHub Pages Docs: https://docs.github.com/pages', 'dim');
    log('    • GitHub Actions Docs: https://docs.github.com/actions', 'dim');

    log('\n  Monitoring:', 'cyan');
    log('    • Actions tab - Workflow status and logs', 'dim');
    log('    • Settings → Pages - Deployment status', 'dim');
    log('    • PageSpeed Insights - Performance', 'dim');

    // Final message
    log('\n');
    box([
        'Ready to deploy? Just push to main!',
        '',
        '  git add .',
        '  git commit -m "Deploy landing pages"',
        '  git push origin main',
        '',
        'Then monitor deployment in the Actions tab.'
    ], 'green');

    log('\n');
}

// Run check
checkDeploymentStatus();
