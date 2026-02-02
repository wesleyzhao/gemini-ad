#!/bin/bash

# Gemini Ads Project - Development Environment Setup Script
# This script sets up the complete development environment for the project

set -e  # Exit on any error

echo "======================================"
echo "Gemini Ads - Environment Setup"
echo "======================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "feature_list.json" ]; then
    echo -e "${YELLOW}Warning: feature_list.json not found. Are you in the project root?${NC}"
fi

echo -e "${BLUE}[1/6] Checking system dependencies...${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "  ✓ Node.js $(node --version) found"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

echo "  ✓ npm $(npm --version) found"

# Check for git
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first."
    exit 1
fi

echo "  ✓ Git $(git --version | cut -d' ' -f3) found"

echo ""
echo -e "${BLUE}[2/6] Creating directory structure...${NC}"

# Create all necessary directories
mkdir -p assets/{css,js,images,screenshots}
mkdir -p pages
mkdir -p tests
mkdir -p docs

echo "  ✓ Created assets/css - for stylesheets"
echo "  ✓ Created assets/js - for JavaScript files"
echo "  ✓ Created assets/images - for images and graphics"
echo "  ✓ Created assets/screenshots - for test screenshots"
echo "  ✓ Created pages - for landing page HTML files"
echo "  ✓ Created tests - for Playwright tests"
echo "  ✓ Created docs - for additional documentation"

echo ""
echo -e "${BLUE}[3/6] Initializing package.json...${NC}"

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    cat > package.json << 'EOF'
{
  "name": "gemini-ads",
  "version": "1.0.0",
  "description": "Single-page website advertisements for Google Gemini AI",
  "main": "index.html",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:screenshot": "playwright test --project=chromium --update-snapshots",
    "serve": "npx http-server . -p 8080 -o",
    "format": "prettier --write \"**/*.{html,css,js,json,md}\"",
    "lint": "eslint assets/js/**/*.js"
  },
  "keywords": [
    "gemini",
    "ai",
    "landing-page",
    "google",
    "advertisement"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@playwright/test": "^1.41.0",
    "prettier": "^3.2.0",
    "eslint": "^8.56.0",
    "http-server": "^14.1.1"
  }
}
EOF
    echo "  ✓ Created package.json"
else
    echo "  ✓ package.json already exists"
fi

echo ""
echo -e "${BLUE}[4/6] Installing npm dependencies...${NC}"

# Install dependencies
npm install

echo ""
echo -e "${BLUE}[5/6] Installing Playwright browsers...${NC}"

# Install Playwright browsers
npx playwright install chromium firefox webkit

echo ""
echo -e "${BLUE}[6/6] Setting up Git hooks (optional)...${NC}"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Test results
test-results/
playwright-report/

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary files
*.tmp
.env

# Screenshots (optional - comment out if you want to commit them)
# assets/screenshots/
EOF
    echo "  ✓ Created .gitignore"
else
    echo "  ✓ .gitignore already exists"
fi

echo ""
echo -e "${GREEN}======================================"
echo "Setup Complete! ✓"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Review feature_list.json for all planned features"
echo "  2. Read project_context.md for project overview"
echo "  3. Check ideas.md for landing page concepts"
echo ""
echo "Development commands:"
echo "  npm run serve           - Start local dev server on port 8080"
echo "  npm test                - Run Playwright tests"
echo "  npm run test:ui         - Run tests with UI"
echo "  npm run test:screenshot - Generate screenshots"
echo "  npm run format          - Format all code with Prettier"
echo ""
echo "Project structure:"
echo "  pages/                  - Landing page HTML files"
echo "  assets/css/             - Stylesheets"
echo "  assets/js/              - JavaScript files"
echo "  assets/images/          - Images and graphics"
echo "  tests/                  - Playwright test files"
echo ""
echo -e "${GREEN}Happy building! 🚀${NC}"
echo ""
