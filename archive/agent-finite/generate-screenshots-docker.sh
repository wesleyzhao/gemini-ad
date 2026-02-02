#!/bin/bash

# Screenshot Generation Script (Docker-based)
# This script generates screenshots using Docker to avoid system dependency issues
# Usage: ./generate-screenshots-docker.sh [mobile|tablet|desktop|all]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Gemini Ads - Screenshot Generation (Docker)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed${NC}"
    echo ""
    echo "Please install Docker first:"
    echo "  - macOS: https://docs.docker.com/desktop/install/mac-install/"
    echo "  - Linux: https://docs.docker.com/engine/install/"
    echo "  - Windows: https://docs.docker.com/desktop/install/windows-install/"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Error: Docker daemon is not running${NC}"
    echo "Please start Docker and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is available${NC}"
echo ""

# Determine which tests to run
TEST_TYPE="${1:-all}"
TEST_COMMAND=""

case "$TEST_TYPE" in
    mobile)
        echo -e "${BLUE}📱 Generating mobile screenshots...${NC}"
        TEST_COMMAND="npm run test:screenshot:mobile"
        ;;
    tablet)
        echo -e "${BLUE}📱 Generating tablet screenshots...${NC}"
        TEST_COMMAND="npm run test:screenshot:tablet"
        ;;
    desktop)
        echo -e "${BLUE}🖥️  Generating desktop screenshots...${NC}"
        TEST_COMMAND="npm run test:screenshot:desktop"
        ;;
    all)
        echo -e "${BLUE}📸 Generating ALL screenshots (mobile + tablet + desktop)...${NC}"
        TEST_COMMAND="npm run test:screenshot"
        ;;
    *)
        echo -e "${RED}❌ Invalid option: $TEST_TYPE${NC}"
        echo "Usage: $0 [mobile|tablet|desktop|all]"
        exit 1
        ;;
esac

echo ""

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

# Run Playwright tests in Docker
echo -e "${YELLOW}🐳 Starting Docker container with Playwright...${NC}"
echo ""

docker run --rm \
    --network host \
    -v "$(pwd):/workspace" \
    -w /workspace \
    --ipc=host \
    mcr.microsoft.com/playwright:v1.58.1-jammy \
    /bin/bash -c "npm install && $TEST_COMMAND"

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Screenshot generation complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📁 Screenshots saved to: ./screenshots/${NC}"
    echo ""

    # Count screenshots
    SCREENSHOT_COUNT=$(find screenshots -name "*.png" 2>/dev/null | wc -l)
    echo -e "${GREEN}📸 Total screenshots generated: $SCREENSHOT_COUNT${NC}"
    echo ""

    # List first 10 screenshots as examples
    echo -e "${BLUE}Sample screenshots:${NC}"
    find screenshots -name "*.png" | head -10 | while read -r file; do
        SIZE=$(du -h "$file" | cut -f1)
        echo -e "  ${GREEN}✓${NC} $(basename "$file") ($SIZE)"
    done

    if [ $SCREENSHOT_COUNT -gt 10 ]; then
        echo -e "  ... and $((SCREENSHOT_COUNT - 10)) more"
    fi
    echo ""

    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review screenshots in the screenshots/ directory"
    echo "  2. Share with stakeholders for approval"
    echo "  3. Use as baseline for visual regression testing"
    echo "  4. Update screenshots when designs change"
    echo ""
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Screenshot generation failed (exit code: $EXIT_CODE)${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Check the output above for error details."
    echo ""
    exit $EXIT_CODE
fi
