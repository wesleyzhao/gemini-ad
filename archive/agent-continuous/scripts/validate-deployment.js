#!/usr/bin/env node

/**
 * Deployment Configuration Validator
 *
 * Validates that all required files and configurations are in place
 * for successful GitHub Pages deployment via GitHub Actions.
 *
 * Usage: npm run validate:deployment
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`  ${text}`, 'bold');
    log('='.repeat(60), 'cyan');
}

function checkmark() {
    return `${colors.green}✓${colors.reset}`;
}

function crossmark() {
    return `${colors.red}✗${colors.reset}`;
}

function warning() {
    return `${colors.yellow}⚠${colors.reset}`;
}

// Validation checks
const validationChecks = {
    requiredFiles: [
        { path: '.nojekyll', description: 'Prevents Jekyll processing' },
        { path: '.github/workflows/deploy.yml', description: 'GitHub Actions workflow' },
        { path: 'index.html', description: 'Homepage (GitHub Pages requirement)' },
        { path: 'package.json', description: 'NPM configuration' },
        { path: 'DEPLOYMENT.md', description: 'Deployment documentation' }
    ],

    optionalFiles: [
        { path: 'CNAME', description: 'Custom domain configuration' },
        { path: 'CNAME.example', description: 'Custom domain template' }
    ],

    requiredDirectories: [
        { path: 'pages', description: 'Landing pages directory' },
        { path: 'assets', description: 'Static assets directory' },
        { path: 'assets/css', description: 'CSS files' },
        { path: 'assets/js', description: 'JavaScript files' },
        { path: '.github/workflows', description: 'GitHub Actions workflows' }
    ],

    landingPages: [
        'pages/valentine.html',
        'pages/writers.html',
        'pages/creators.html',
        'pages/operators.html',
        'pages/automators.html',
        'pages/apple-style.html',
        'pages/trust.html',
        'pages/workspace.html',
        'pages/research.html',
        'pages/productivity.html',
        'pages/future.html',
        'pages/comparison.html',
        'pages/animations-demo.html',
        'pages/index.html'
    ],

    packageJsonScripts: [
        'validate',
        'validate:html',
        'validate:css',
        'validate:perf',
        'test:mobile',
        'test:lazy',
        'test:accessibility',
        'validate:deployment',
        'serve'
    ]
};

let totalChecks = 0;
let passedChecks = 0;
let warnings = 0;
let errors = 0;

function validateFileExists(filePath, description, required = true) {
    totalChecks++;
    const exists = fs.existsSync(filePath);

    if (exists) {
        passedChecks++;
        log(`  ${checkmark()} ${description}`, 'green');
        log(`     ${filePath}`, 'reset');
        return true;
    } else {
        if (required) {
            errors++;
            log(`  ${crossmark()} ${description}`, 'red');
            log(`     Missing: ${filePath}`, 'red');
        } else {
            warnings++;
            log(`  ${warning()} ${description} (optional)`, 'yellow');
            log(`     Not found: ${filePath}`, 'yellow');
        }
        return false;
    }
}

function validateDirectoryExists(dirPath, description) {
    totalChecks++;
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();

    if (exists) {
        passedChecks++;
        log(`  ${checkmark()} ${description}`, 'green');

        // Count files in directory
        const files = fs.readdirSync(dirPath);
        log(`     ${dirPath} (${files.length} files)`, 'reset');
        return true;
    } else {
        errors++;
        log(`  ${crossmark()} ${description}`, 'red');
        log(`     Missing directory: ${dirPath}`, 'red');
        return false;
    }
}

function validateWorkflowFile() {
    header('Validating GitHub Actions Workflow');

    const workflowPath = '.github/workflows/deploy.yml';
    if (!validateFileExists(workflowPath, 'GitHub Actions workflow file')) {
        return;
    }

    const content = fs.readFileSync(workflowPath, 'utf8');

    // Check for required workflow elements
    const requiredElements = [
        { pattern: /push:\s*\n\s*branches:/m, name: 'Push trigger' },
        { pattern: /workflow_dispatch:/m, name: 'Manual trigger' },
        { pattern: /permissions:/m, name: 'Permissions configuration' },
        { pattern: /pages:\s*write/m, name: 'Pages write permission' },
        { pattern: /actions\/checkout@v/m, name: 'Checkout action' },
        { pattern: /actions\/setup-node@v/m, name: 'Node.js setup' },
        { pattern: /npm ci/m, name: 'Dependency installation' },
        { pattern: /npm run validate/m, name: 'Validation tests' },
        { pattern: /actions\/upload-pages-artifact@v/m, name: 'Upload artifact' },
        { pattern: /actions\/deploy-pages@v/m, name: 'Deploy to Pages' }
    ];

    log('\n  Workflow Components:', 'cyan');
    requiredElements.forEach(({ pattern, name }) => {
        totalChecks++;
        if (pattern.test(content)) {
            passedChecks++;
            log(`    ${checkmark()} ${name}`, 'green');
        } else {
            errors++;
            log(`    ${crossmark()} ${name}`, 'red');
        }
    });
}

function validatePackageJson() {
    header('Validating package.json');

    const pkgPath = 'package.json';
    if (!fs.existsSync(pkgPath)) {
        errors++;
        log(`  ${crossmark()} package.json not found`, 'red');
        return;
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    log('\n  Required NPM Scripts:', 'cyan');
    validationChecks.packageJsonScripts.forEach(script => {
        totalChecks++;
        if (pkg.scripts && pkg.scripts[script]) {
            passedChecks++;
            log(`    ${checkmark()} ${script}`, 'green');
        } else {
            warnings++;
            log(`    ${warning()} ${script} (recommended)`, 'yellow');
        }
    });

    // Check for required dependencies
    log('\n  Required Dependencies:', 'cyan');
    const requiredDeps = ['http-server', 'playwright', 'node-html-parser'];
    requiredDeps.forEach(dep => {
        totalChecks++;
        const hasDevDep = pkg.devDependencies && pkg.devDependencies[dep];
        const hasDep = pkg.dependencies && pkg.dependencies[dep];

        if (hasDevDep || hasDep) {
            passedChecks++;
            log(`    ${checkmark()} ${dep}`, 'green');
        } else {
            warnings++;
            log(`    ${warning()} ${dep} (recommended)`, 'yellow');
        }
    });
}

function validateNojekyll() {
    header('Validating .nojekyll File');

    const nojekyllPath = '.nojekyll';
    if (validateFileExists(nojekyllPath, 'Bypasses Jekyll processing')) {
        const stats = fs.statSync(nojekyllPath);
        log(`     File size: ${stats.size} bytes (should be 0)`, 'reset');

        // .nojekyll should be empty
        if (stats.size > 0) {
            warnings++;
            log(`     ${warning()} .nojekyll should be empty`, 'yellow');
        }
    }
}

function validateCNAME() {
    header('Validating CNAME Configuration');

    const cnamePath = 'CNAME';
    const cnameExamplePath = 'CNAME.example';

    const hasCNAME = fs.existsSync(cnamePath);
    const hasExample = validateFileExists(cnameExamplePath, 'CNAME template', false);

    if (hasCNAME) {
        totalChecks++;
        passedChecks++;
        log(`  ${checkmark()} Custom domain configured`, 'green');

        const content = fs.readFileSync(cnamePath, 'utf8').trim();
        log(`     Domain: ${content}`, 'cyan');

        // Validate CNAME format
        if (content.includes('http://') || content.includes('https://')) {
            warnings++;
            log(`     ${warning()} CNAME should not include protocol (http/https)`, 'yellow');
        }

        if (content.includes('/')) {
            warnings++;
            log(`     ${warning()} CNAME should not include paths`, 'yellow');
        }

        if (content.split('\n').length > 1) {
            warnings++;
            log(`     ${warning()} CNAME should contain only one domain`, 'yellow');
        }
    } else {
        log(`  ${warning()} No custom domain configured (using default GitHub Pages URL)`, 'yellow');
        log(`     Copy CNAME.example to CNAME to add custom domain`, 'reset');
    }
}

function validateLandingPages() {
    header('Validating Landing Pages');

    log('\n  Required Pages:', 'cyan');
    validationChecks.landingPages.forEach(page => {
        validateFileExists(page, path.basename(page));
    });

    // Check for gallery hub
    totalChecks++;
    if (fs.existsSync('pages/index.html')) {
        passedChecks++;
        log(`\n  ${checkmark()} Gallery hub page exists`, 'green');
    } else {
        errors++;
        log(`\n  ${crossmark()} Gallery hub page missing`, 'red');
    }
}

function validateAssets() {
    header('Validating Static Assets');

    // Check CSS
    log('\n  CSS Files:', 'cyan');
    const cssFiles = ['assets/css/shared-styles.css'];
    cssFiles.forEach(file => {
        validateFileExists(file, path.basename(file));
    });

    // Check JS
    log('\n  JavaScript Files:', 'cyan');
    const jsFiles = ['assets/js/animations.js'];
    jsFiles.forEach(file => {
        validateFileExists(file, path.basename(file));
    });

    // Check images directory
    log('\n  Assets Structure:', 'cyan');
    if (fs.existsSync('assets/images') && fs.statSync('assets/images').isDirectory()) {
        totalChecks++;
        passedChecks++;
        const images = fs.readdirSync('assets/images').filter(f => {
            return f.match(/\.(svg|png|jpg|jpeg|gif|webp)$/i);
        });
        log(`  ${checkmark()} Images directory (${images.length} images)`, 'green');
    } else {
        warnings++;
        log(`  ${warning()} No images directory found`, 'yellow');
    }
}

function validateGitIgnore() {
    header('Validating .gitignore');

    const gitignorePath = '.gitignore';
    if (fs.existsSync(gitignorePath)) {
        totalChecks++;
        passedChecks++;
        log(`  ${checkmark()} .gitignore exists`, 'green');

        const content = fs.readFileSync(gitignorePath, 'utf8');

        // Check for common entries
        const recommendedEntries = [
            { pattern: /node_modules/, name: 'node_modules' },
            { pattern: /\.DS_Store/, name: '.DS_Store (macOS)' },
            { pattern: /\.env/, name: '.env files' }
        ];

        log('\n  Recommended Entries:', 'cyan');
        recommendedEntries.forEach(({ pattern, name }) => {
            totalChecks++;
            if (pattern.test(content)) {
                passedChecks++;
                log(`    ${checkmark()} ${name}`, 'green');
            } else {
                warnings++;
                log(`    ${warning()} ${name} (recommended)`, 'yellow');
            }
        });
    } else {
        warnings++;
        log(`  ${warning()} .gitignore not found (recommended)`, 'yellow');
    }
}

function validateDocumentation() {
    header('Validating Documentation');

    const docs = [
        { path: 'README.md', description: 'Project README', required: true },
        { path: 'DEPLOYMENT.md', description: 'Deployment guide', required: true },
        { path: 'project_context.md', description: 'Project context', required: false },
        { path: 'ideas.md', description: 'Ideas documentation', required: false },
        { path: 'reflections-and-best.md', description: 'Design reflections', required: false },
        { path: 'CONTEXT.md', description: 'Architectural context', required: false },
        { path: 'ACCESSIBILITY_GUIDE.md', description: 'Accessibility guide', required: false },
        { path: 'LAZY_LOADING_GUIDE.md', description: 'Lazy loading guide', required: false },
        { path: 'HERO_TEXT_OPTIMIZATION.md', description: 'Hero text guide', required: false }
    ];

    docs.forEach(doc => {
        validateFileExists(doc.path, doc.description, doc.required);
    });
}

function generateReport() {
    header('Deployment Validation Summary');

    const successRate = totalChecks > 0 ? (passedChecks / totalChecks * 100).toFixed(1) : 0;

    log(`\n  Total Checks: ${totalChecks}`, 'cyan');
    log(`  Passed: ${passedChecks}`, 'green');
    log(`  Warnings: ${warnings}`, 'yellow');
    log(`  Errors: ${errors}`, errors > 0 ? 'red' : 'green');
    log(`  Success Rate: ${successRate}%\n`, successRate >= 90 ? 'green' : (successRate >= 70 ? 'yellow' : 'red'));

    if (errors === 0) {
        log(`  ${checkmark()} Deployment configuration is READY!`, 'green');
        log(`\n  Next steps:`, 'cyan');
        log(`    1. Push to main: git push origin main`, 'reset');
        log(`    2. Enable GitHub Pages: Settings → Pages → Source: GitHub Actions`, 'reset');
        log(`    3. Monitor: Actions tab → "Deploy to GitHub Pages"`, 'reset');
    } else {
        log(`  ${crossmark()} Deployment configuration has ERRORS!`, 'red');
        log(`\n  Fix the errors above before deploying.`, 'yellow');
    }

    if (warnings > 0) {
        log(`\n  ${warning()} ${warnings} warnings found (non-blocking)`, 'yellow');
    }
}

function validateDeploymentReadiness() {
    header('GitHub Pages Deployment Validator');
    log('  Checking deployment configuration...', 'cyan');

    // Run all validation checks
    header('Validating Required Files');
    validationChecks.requiredFiles.forEach(({ path, description }) => {
        validateFileExists(path, description);
    });

    header('Validating Optional Files');
    validationChecks.optionalFiles.forEach(({ path, description }) => {
        validateFileExists(path, description, false);
    });

    header('Validating Directory Structure');
    validationChecks.requiredDirectories.forEach(({ path, description }) => {
        validateDirectoryExists(path, description);
    });

    validateNojekyll();
    validateCNAME();
    validateWorkflowFile();
    validatePackageJson();
    validateLandingPages();
    validateAssets();
    validateGitIgnore();
    validateDocumentation();

    // Generate summary report
    generateReport();

    // Exit code
    process.exit(errors > 0 ? 1 : 0);
}

// Run validation
validateDeploymentReadiness();
