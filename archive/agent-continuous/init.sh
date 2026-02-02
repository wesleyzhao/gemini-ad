#!/bin/bash

# Gemini Ad Campaign - Development Environment Setup Script
# This script sets up the complete development environment for the project

set -e  # Exit on any error

echo "🚀 Gemini Ad Campaign - Environment Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "feature_list.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Setting up project structure..."
# Create necessary directories if they don't exist
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/images
mkdir -p pages
mkdir -p screenshots
mkdir -p tests
echo "✅ Project structure created"
echo ""

# Check for Node.js
echo "🔍 Checking for Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "⚠️  Node.js not found. Installing Node.js is recommended for:"
    echo "   - Running Playwright tests"
    echo "   - Using development servers"
    echo "   - Running build tools"
    echo ""
    echo "   Install from: https://nodejs.org/"
    echo ""
fi

# Check for npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm found: $NPM_VERSION"
    echo ""

    # Initialize package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        echo "📦 Initializing npm package..."
        npm init -y
        echo "✅ package.json created"
        echo ""
    fi

    # Install Playwright for testing
    echo "🎭 Installing Playwright for automated testing..."
    npm install --save-dev playwright
    npm install --save-dev @playwright/test
    echo "✅ Playwright installed"
    echo ""

    # Install http-server for local development
    echo "🌐 Installing http-server for local development..."
    npm install --save-dev http-server
    echo "✅ http-server installed"
    echo ""
else
    echo "⚠️  npm not found - skipping package installation"
    echo ""
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
else
    echo "✅ Git repository already initialized"
    echo ""
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Node modules
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build outputs
dist/
build/

# Test outputs
test-results/
playwright-report/

# Temporary files
*.tmp
*.temp
EOF
    echo "✅ .gitignore created"
    echo ""
else
    echo "✅ .gitignore already exists"
    echo ""
fi

# Create README.md if it doesn't exist
if [ ! -f "README.md" ]; then
    echo "📝 Creating README.md..."
    cat > README.md << 'EOF'
# Gemini Ad Campaign

High-quality, single-page website advertisements for Google Gemini AI.

## Project Structure

```
/
├── assets/
│   ├── css/           # Shared stylesheets
│   ├── js/            # Shared JavaScript
│   └── images/        # Image assets
├── pages/             # Individual landing pages
├── screenshots/       # Automated test screenshots
├── tests/            # Testing scripts
├── feature_list.json # Feature tracking
├── project_context.md # Strategy and approach
├── ideas.md          # Landing page brainstorming
└── reflections-and-best.md # Design analysis
```

## Getting Started

1. Run the setup script:
   ```bash
   ./init.sh
   ```

2. Start local development server:
   ```bash
   npm run serve
   ```

3. Run tests and capture screenshots:
   ```bash
   npm test
   ```

## Development

- All pages are static HTML/CSS/JS compatible with GitHub Pages
- Design inspired by Apple.com aesthetics
- Focus on short attention spans and strong CTAs
- Mobile-first responsive design

## Testing

Automated screenshot testing using Playwright ensures design quality across:
- Multiple viewports (mobile, tablet, desktop)
- Different browsers (Chrome, Safari, Firefox)
- Visual regression testing

## Deployment

Deploy to GitHub Pages:
1. Push to main branch
2. Enable GitHub Pages in repository settings
3. Select main branch as source

## Target Segments

1. **Writers** - Content creators and bloggers
2. **Creators** - Video and multimedia professionals
3. **Operators** - Business workflow managers
4. **Automators** - Power users and automation enthusiasts
EOF
    echo "✅ README.md created"
    echo ""
else
    echo "✅ README.md already exists"
    echo ""
fi

# Create package.json scripts if package.json exists
if [ -f "package.json" ]; then
    echo "📝 Adding npm scripts..."

    # Check if jq is available for JSON manipulation
    if command -v jq &> /dev/null; then
        # Use jq to add scripts
        jq '.scripts = {
            "serve": "http-server . -p 8080 -o",
            "test": "playwright test",
            "test:headed": "playwright test --headed",
            "test:debug": "playwright test --debug",
            "screenshots": "playwright test --reporter=html"
        }' package.json > package.json.tmp && mv package.json.tmp package.json
        echo "✅ npm scripts added"
    else
        echo "⚠️  jq not found - please manually add scripts to package.json"
        echo ""
        echo "Add these scripts to package.json:"
        echo '  "serve": "http-server . -p 8080 -o",'
        echo '  "test": "playwright test",'
        echo '  "test:headed": "playwright test --headed",'
        echo '  "test:debug": "playwright test --debug",'
        echo '  "screenshots": "playwright test --reporter=html"'
    fi
    echo ""
fi

# Create basic Playwright config
if [ ! -f "playwright.config.js" ]; then
    echo "📝 Creating Playwright configuration..."
    cat > playwright.config.js << 'EOF'
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'http-server . -p 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
EOF
    echo "✅ Playwright config created"
    echo ""
else
    echo "✅ Playwright config already exists"
    echo ""
fi

echo "=========================================="
echo "✨ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Review feature_list.json for all planned features"
echo "  2. Check ideas.md for 100+ landing page concepts"
echo "  3. Read project_context.md for strategy overview"
echo ""
echo "Development commands:"
echo "  npm run serve          - Start local development server"
echo "  npm test               - Run automated tests"
echo "  npm run screenshots    - Generate screenshots with HTML report"
echo ""
echo "Happy building! 🚀"
