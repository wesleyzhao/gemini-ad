#!/bin/bash
#
# Automated Monitoring Script
# Sets up cron jobs for daily, weekly, and monthly optimization monitoring
# Part of Feature #97 - Continuous monitoring and optimization
#

set -e

echo "=========================================="
echo "Automated Monitoring Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs"

# Create logs directory
mkdir -p "$LOG_DIR"

echo "Project directory: $PROJECT_DIR"
echo "Logs directory: $LOG_DIR"
echo ""

# ==================== CRON JOB TEMPLATES ====================

# Daily monitoring (every day at 9 AM)
DAILY_CRON="0 9 * * * cd $PROJECT_DIR && node monitor-production-metrics.js --mode=daily >> $LOG_DIR/daily-monitoring.log 2>&1"

# Weekly analysis (every Monday at 10 AM)
WEEKLY_CRON="0 10 * * 1 cd $PROJECT_DIR && node continue-optimization-cycle.js --mode=auto >> $LOG_DIR/weekly-analysis.log 2>&1"

# Monthly review (first day of month at 11 AM)
MONTHLY_CRON="0 11 1 * * cd $PROJECT_DIR && node continue-optimization-cycle.js --mode=forecast >> $LOG_DIR/monthly-review.log 2>&1"

# Pattern monitoring (every day at 2 PM)
PATTERN_CRON="0 14 * * * cd $PROJECT_DIR && node apply-winning-patterns.js --mode=monitor >> $LOG_DIR/pattern-monitoring.log 2>&1"

# Experiment monitoring (every day at 3 PM)
EXPERIMENT_CRON="0 15 * * * cd $PROJECT_DIR && node execute-optimization-iterations.js --mode=monitor >> $LOG_DIR/experiment-monitoring.log 2>&1"

# ==================== FUNCTIONS ====================

# Function to check if cron job exists
cron_exists() {
    local pattern="$1"
    crontab -l 2>/dev/null | grep -F "$pattern" > /dev/null
}

# Function to add cron job
add_cron() {
    local cron_job="$1"
    local description="$2"

    # Extract just the command pattern for checking
    local command_pattern=$(echo "$cron_job" | sed 's/^[0-9* ]* //')

    if cron_exists "$command_pattern"; then
        echo -e "${YELLOW}⏭  $description already exists, skipping${NC}"
    else
        (crontab -l 2>/dev/null; echo "$cron_job") | crontab -
        echo -e "${GREEN}✅ Added: $description${NC}"
    fi
}

# Function to remove all optimization cron jobs
remove_all_crons() {
    echo "Removing all optimization monitoring cron jobs..."
    crontab -l 2>/dev/null | grep -v "monitor-production-metrics.js\|continue-optimization-cycle.js\|apply-winning-patterns.js\|execute-optimization-iterations.js" | crontab -
    echo -e "${GREEN}✅ All optimization cron jobs removed${NC}"
}

# Function to list current cron jobs
list_crons() {
    echo "Current optimization monitoring cron jobs:"
    echo "=========================================="
    crontab -l 2>/dev/null | grep "monitor-production-metrics.js\|continue-optimization-cycle.js\|apply-winning-patterns.js\|execute-optimization-iterations.js" || echo "No monitoring cron jobs found"
    echo ""
}

# Function to install cron jobs
install_crons() {
    echo "Installing automated monitoring cron jobs..."
    echo ""

    add_cron "$DAILY_CRON" "Daily monitoring (9 AM)"
    add_cron "$WEEKLY_CRON" "Weekly analysis (Monday 10 AM)"
    add_cron "$MONTHLY_CRON" "Monthly review (1st of month 11 AM)"
    add_cron "$PATTERN_CRON" "Pattern monitoring (2 PM daily)"
    add_cron "$EXPERIMENT_CRON" "Experiment monitoring (3 PM daily)"

    echo ""
    echo -e "${GREEN}✅ Installation complete!${NC}"
    echo ""
}

# Function to test all scripts
test_scripts() {
    echo "Testing all monitoring scripts..."
    echo ""

    # Test daily monitoring
    echo "Testing: monitor-production-metrics.js --mode=status"
    if node "$PROJECT_DIR/monitor-production-metrics.js" --mode=status > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Daily monitoring script working${NC}"
    else
        echo -e "${RED}❌ Daily monitoring script failed${NC}"
    fi

    # Test weekly analysis
    echo "Testing: continue-optimization-cycle.js --mode=status"
    if node "$PROJECT_DIR/continue-optimization-cycle.js" --mode=status > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Weekly analysis script working${NC}"
    else
        echo -e "${RED}❌ Weekly analysis script failed${NC}"
    fi

    # Test pattern monitoring
    echo "Testing: apply-winning-patterns.js --mode=identify"
    if node "$PROJECT_DIR/apply-winning-patterns.js" --mode=identify > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Pattern monitoring script working${NC}"
    else
        echo -e "${RED}❌ Pattern monitoring script failed${NC}"
    fi

    echo ""
    echo -e "${GREEN}✅ Script tests complete${NC}"
    echo ""
}

# Function to show manual commands
show_manual_commands() {
    echo "Manual Monitoring Commands"
    echo "=========================================="
    echo ""
    echo "Daily (5-10 minutes):"
    echo "  node monitor-production-metrics.js --mode=daily"
    echo "  node apply-winning-patterns.js --mode=monitor"
    echo ""
    echo "Weekly (30-60 minutes):"
    echo "  node continue-optimization-cycle.js --mode=auto"
    echo "  node apply-winning-patterns.js --mode=identify"
    echo ""
    echo "Monthly (2-3 hours):"
    echo "  node continue-optimization-cycle.js --mode=forecast"
    echo "  node optimization-iteration-engine.js --mode=generate"
    echo ""
    echo "View logs:"
    echo "  tail -f $LOG_DIR/daily-monitoring.log"
    echo "  tail -f $LOG_DIR/weekly-analysis.log"
    echo "  tail -f $LOG_DIR/monthly-review.log"
    echo ""
}

# ==================== MAIN MENU ====================

case "${1:-help}" in
    install)
        install_crons
        list_crons
        show_manual_commands
        ;;

    remove)
        remove_all_crons
        ;;

    list)
        list_crons
        ;;

    test)
        test_scripts
        ;;

    manual)
        show_manual_commands
        ;;

    help|*)
        echo "Usage: $0 {install|remove|list|test|manual|help}"
        echo ""
        echo "Commands:"
        echo "  install  - Install all automated monitoring cron jobs"
        echo "  remove   - Remove all optimization monitoring cron jobs"
        echo "  list     - List currently installed cron jobs"
        echo "  test     - Test all monitoring scripts"
        echo "  manual   - Show manual monitoring commands"
        echo "  help     - Show this help message"
        echo ""
        echo "Cron Schedule:"
        echo "  Daily monitoring:     Every day at 9 AM"
        echo "  Weekly analysis:      Every Monday at 10 AM"
        echo "  Monthly review:       1st of month at 11 AM"
        echo "  Pattern monitoring:   Every day at 2 PM"
        echo "  Experiment monitoring: Every day at 3 PM"
        echo ""
        echo "Logs directory: $LOG_DIR"
        echo ""
        exit 0
        ;;
esac
