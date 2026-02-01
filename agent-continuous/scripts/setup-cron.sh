#!/bin/bash

###############################################################################
# Cron Setup Script for Wave 4 Monitoring
#
# Sets up automated cron jobs for:
# - Daily maintenance (9:00 AM)
# - Hourly health checks (every hour)
# - Weekly optimization reports (Monday 10:00 AM)
#
# Usage: ./scripts/setup-cron.sh [--install|--uninstall|--status]
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default action
ACTION=${1:-"--status"}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

install_cron() {
    print_header "INSTALLING WAVE 4 MONITORING CRON JOBS"

    # Make scripts executable
    chmod +x "$SCRIPT_DIR/daily-maintenance.sh" 2>/dev/null || true
    chmod +x "$SCRIPT_DIR/health-check-monitor.js" 2>/dev/null || true
    chmod +x "$SCRIPT_DIR/optimization-engine.js" 2>/dev/null || true

    print_success "Scripts made executable"

    # Create cron jobs
    CRON_FILE="/tmp/wave4-cron-$$.txt"

    # Get current crontab (if exists)
    crontab -l > "$CRON_FILE" 2>/dev/null || echo "# Wave 4 Monitoring Cron Jobs" > "$CRON_FILE"

    # Remove existing Wave 4 jobs
    grep -v "Wave 4 Monitoring" "$CRON_FILE" > "${CRON_FILE}.tmp" || true
    mv "${CRON_FILE}.tmp" "$CRON_FILE"

    # Add new jobs
    cat >> "$CRON_FILE" << EOF

# Wave 4 Monitoring - Daily Maintenance (9:00 AM every day)
0 9 * * * cd $PROJECT_ROOT && $SCRIPT_DIR/daily-maintenance.sh --alert >> $PROJECT_ROOT/logs/cron-daily.log 2>&1

# Wave 4 Monitoring - Hourly Health Checks
0 * * * * cd $PROJECT_ROOT && node $SCRIPT_DIR/health-check-monitor.js >> $PROJECT_ROOT/logs/cron-health.log 2>&1

# Wave 4 Monitoring - Weekly Optimization Report (Monday 10:00 AM)
0 10 * * 1 cd $PROJECT_ROOT && node $SCRIPT_DIR/optimization-engine.js >> $PROJECT_ROOT/logs/cron-optimization.log 2>&1

# Wave 4 Monitoring - Cleanup old logs (First day of month, 2:00 AM)
0 2 1 * * find $PROJECT_ROOT/logs -name "*.log" -mtime +60 -delete 2>/dev/null

EOF

    # Install new crontab
    if crontab "$CRON_FILE"; then
        print_success "Cron jobs installed successfully"
    else
        print_error "Failed to install cron jobs"
        rm "$CRON_FILE"
        exit 1
    fi

    rm "$CRON_FILE"

    echo ""
    echo "Installed cron jobs:"
    echo "  📅 Daily Maintenance: Every day at 9:00 AM"
    echo "  🏥 Health Checks: Every hour"
    echo "  📊 Optimization Report: Every Monday at 10:00 AM"
    echo "  🧹 Log Cleanup: First day of month at 2:00 AM"
    echo ""

    print_warning "Make sure Node.js is in PATH for cron jobs to work"
    print_warning "Logs will be written to: $PROJECT_ROOT/logs/"

    echo ""
    echo "To view logs:"
    echo "  tail -f $PROJECT_ROOT/logs/cron-daily.log"
    echo "  tail -f $PROJECT_ROOT/logs/cron-health.log"
    echo "  tail -f $PROJECT_ROOT/logs/cron-optimization.log"
}

uninstall_cron() {
    print_header "UNINSTALLING WAVE 4 MONITORING CRON JOBS"

    CRON_FILE="/tmp/wave4-cron-$$.txt"

    # Get current crontab
    if ! crontab -l > "$CRON_FILE" 2>/dev/null; then
        print_warning "No crontab found"
        return
    fi

    # Remove Wave 4 jobs
    grep -v "Wave 4 Monitoring" "$CRON_FILE" > "${CRON_FILE}.tmp" || true
    mv "${CRON_FILE}.tmp" "$CRON_FILE"

    # Install cleaned crontab
    if crontab "$CRON_FILE"; then
        print_success "Wave 4 cron jobs uninstalled"
    else
        print_error "Failed to update crontab"
    fi

    rm "$CRON_FILE"
}

show_status() {
    print_header "WAVE 4 MONITORING CRON STATUS"

    echo "Current cron jobs:"
    echo ""

    if crontab -l 2>/dev/null | grep -A 10 "Wave 4 Monitoring" > /dev/null; then
        crontab -l 2>/dev/null | grep -A 10 "Wave 4 Monitoring" || true
        echo ""
        print_success "Wave 4 monitoring is active"
    else
        print_warning "No Wave 4 monitoring cron jobs found"
        echo ""
        echo "Run with --install to set up automated monitoring"
    fi

    echo ""
    echo "Recent log files:"
    echo ""

    if [ -d "$PROJECT_ROOT/logs" ]; then
        ls -lht "$PROJECT_ROOT/logs" | head -n 10 || echo "  No logs found"
    else
        echo "  Logs directory not created yet"
    fi
}

test_run() {
    print_header "TESTING WAVE 4 MONITORING SCRIPTS"

    echo "Running test executions..."
    echo ""

    # Test health check
    echo "1️⃣  Testing health check monitor..."
    if [ -f "$SCRIPT_DIR/health-check-monitor.js" ]; then
        if node "$SCRIPT_DIR/health-check-monitor.js" > /dev/null 2>&1; then
            print_success "Health check monitor works"
        else
            print_error "Health check monitor failed"
        fi
    else
        print_warning "Health check monitor script not found"
    fi

    # Test optimization engine
    echo "2️⃣  Testing optimization engine..."
    if [ -f "$SCRIPT_DIR/optimization-engine.js" ]; then
        if node "$SCRIPT_DIR/optimization-engine.js" > /dev/null 2>&1; then
            print_success "Optimization engine works"
        else
            print_error "Optimization engine failed"
        fi
    else
        print_warning "Optimization engine script not found"
    fi

    # Test daily maintenance
    echo "3️⃣  Testing daily maintenance script..."
    if [ -f "$SCRIPT_DIR/daily-maintenance.sh" ]; then
        chmod +x "$SCRIPT_DIR/daily-maintenance.sh"
        if "$SCRIPT_DIR/daily-maintenance.sh" > /dev/null 2>&1; then
            print_success "Daily maintenance script works"
        else
            print_error "Daily maintenance script failed"
        fi
    else
        print_warning "Daily maintenance script not found"
    fi

    echo ""
    print_success "Test run complete"
}

# Main execution
case $ACTION in
    --install)
        install_cron
        ;;
    --uninstall)
        uninstall_cron
        ;;
    --status)
        show_status
        ;;
    --test)
        test_run
        ;;
    --help)
        echo "Usage: $0 [--install|--uninstall|--status|--test|--help]"
        echo ""
        echo "Options:"
        echo "  --install    Install Wave 4 monitoring cron jobs"
        echo "  --uninstall  Remove Wave 4 monitoring cron jobs"
        echo "  --status     Show current cron job status"
        echo "  --test       Test all monitoring scripts"
        echo "  --help       Show this help message"
        echo ""
        ;;
    *)
        print_error "Unknown option: $ACTION"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

echo ""
