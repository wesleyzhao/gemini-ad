#!/usr/bin/env node

/**
 * Run Improvement Cycle
 * Feature #53: Complete end-to-end continuous improvement workflow
 *
 * This script orchestrates the entire continuous improvement process:
 * 1. Monitors current UX metrics
 * 2. Analyzes and generates improvement plans
 * 3. (Optional) Auto-implements safe improvements
 * 4. Measures impact of previous implementations
 * 5. Schedules next iteration
 *
 * Usage:
 *   node scripts/run-improvement-cycle.js [--auto-implement] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ImprovementCycle {
  constructor(options = {}) {
    this.autoImplement = options.autoImplement || false;
    this.dryRun = options.dryRun || false;
    this.reportsDir = path.join(__dirname, '../reports');
    this.cycleLogDir = path.join(this.reportsDir, 'cycle-logs');

    if (!fs.existsSync(this.cycleLogDir)) {
      fs.mkdirSync(this.cycleLogDir, { recursive: true });
    }

    this.cycleNumber = this.getNextCycleNumber();
  }

  /**
   * Get next cycle number
   */
  getNextCycleNumber() {
    const files = fs.readdirSync(this.cycleLogDir)
      .filter(f => f.startsWith('cycle-'))
      .sort()
      .reverse();

    if (files.length === 0) return 1;

    const lastCycle = files[0].match(/cycle-(\d+)/)?.[1];
    return lastCycle ? parseInt(lastCycle) + 1 : 1;
  }

  /**
   * Run complete improvement cycle
   */
  async runCycle() {
    const startTime = Date.now();

    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║         CONTINUOUS UX IMPROVEMENT CYCLE                       ║');
    console.log(`║         Cycle #${this.cycleNumber.toString().padStart(3, '0')}                                          ║`);
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('\n');

    const cycleLog = {
      cycleNumber: this.cycleNumber,
      startTime: new Date().toISOString(),
      steps: [],
      summary: {},
      errors: []
    };

    try {
      // Step 1: Run UX Monitoring
      console.log('STEP 1: UX Monitoring & Analysis');
      console.log('─────────────────────────────────────────────────────────────\n');

      const monitoringResult = await this.runMonitoring();
      cycleLog.steps.push({
        step: 1,
        name: 'UX Monitoring',
        status: monitoringResult.success ? 'success' : 'failed',
        result: monitoringResult
      });

      if (!monitoringResult.success) {
        throw new Error('Monitoring failed: ' + monitoringResult.error);
      }

      console.log(`✅ Monitoring complete\n`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      // Step 2: Generate Improvement Plan
      console.log('STEP 2: Generate Improvement Plan');
      console.log('─────────────────────────────────────────────────────────────\n');

      const planResult = await this.generatePlan();
      cycleLog.steps.push({
        step: 2,
        name: 'Improvement Planning',
        status: planResult.success ? 'success' : 'failed',
        result: planResult
      });

      if (!planResult.success) {
        throw new Error('Planning failed: ' + planResult.error);
      }

      console.log(`✅ Plan generated: ${planResult.improvements} improvements for ${planResult.pages} pages\n`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      // Step 3: Auto-implement (if enabled)
      if (this.autoImplement) {
        console.log('STEP 3: Auto-Implement Improvements');
        console.log('─────────────────────────────────────────────────────────────\n');

        const implementResult = await this.autoImplement();
        cycleLog.steps.push({
          step: 3,
          name: 'Auto-Implementation',
          status: implementResult.success ? 'success' : 'failed',
          result: implementResult
        });

        console.log(`✅ Implementation ${this.dryRun ? 'simulated' : 'complete'}: ${implementResult.changes} changes\n`);
        console.log('═══════════════════════════════════════════════════════════════\n');
      } else {
        console.log('STEP 3: Auto-Implementation (SKIPPED)');
        console.log('─────────────────────────────────────────────────────────────\n');
        console.log('⏭️  Auto-implementation disabled. Use --auto-implement to enable.\n');
        console.log('═══════════════════════════════════════════════════════════════\n');
      }

      // Step 4: Measure Impact (if historical data exists)
      console.log('STEP 4: Measure Impact');
      console.log('─────────────────────────────────────────────────────────────\n');

      const impactResult = await this.measureImpact();
      cycleLog.steps.push({
        step: 4,
        name: 'Impact Measurement',
        status: impactResult.success ? 'success' : 'skipped',
        result: impactResult
      });

      if (impactResult.success) {
        console.log(`✅ Impact measured: ${impactResult.effectiveness} overall effectiveness\n`);
      } else {
        console.log(`⏭️  ${impactResult.message}\n`);
      }

      console.log('═══════════════════════════════════════════════════════════════\n');

      // Step 5: Generate Summary Report
      console.log('STEP 5: Generate Cycle Summary');
      console.log('─────────────────────────────────────────────────────────────\n');

      const summary = this.generateSummary(cycleLog);
      cycleLog.summary = summary;

      const endTime = Date.now();
      cycleLog.endTime = new Date().toISOString();
      cycleLog.duration = endTime - startTime;

      // Save cycle log
      this.saveCycleLog(cycleLog);

      // Display summary
      this.displaySummary(cycleLog);

      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log(`✅ Cycle #${this.cycleNumber} complete in ${(cycleLog.duration / 1000).toFixed(1)}s\n`);

      return cycleLog;

    } catch (error) {
      console.error(`\n❌ Cycle failed: ${error.message}\n`);
      cycleLog.errors.push(error.message);
      cycleLog.status = 'failed';
      this.saveCycleLog(cycleLog);
      throw error;
    }
  }

  /**
   * Run UX monitoring
   */
  async runMonitoring() {
    try {
      const output = execSync(
        'node scripts/advanced-ux-monitoring.js',
        { encoding: 'utf8', stdio: 'pipe' }
      );

      return {
        success: true,
        output: output
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate improvement plan
   */
  async generatePlan() {
    try {
      const output = execSync(
        'node scripts/continuous-ux-improvement.js --analyze',
        { encoding: 'utf8', stdio: 'pipe' }
      );

      // Parse output to extract stats
      const pagesMatch = output.match(/Pages analyzed: (\d+)/);
      const improvementsMatch = output.match(/Total improvements: (\d+)/);

      return {
        success: true,
        pages: pagesMatch ? parseInt(pagesMatch[1]) : 0,
        improvements: improvementsMatch ? parseInt(improvementsMatch[1]) : 0,
        output: output
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Auto-implement improvements
   */
  async autoImplementChanges() {
    try {
      const command = this.dryRun
        ? 'node scripts/auto-implement-improvements.js --dry-run'
        : 'node scripts/auto-implement-improvements.js';

      const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });

      // Parse output
      const changesMatch = output.match(/Total changes: (\d+)/);

      return {
        success: true,
        changes: changesMatch ? parseInt(changesMatch[1]) : 0,
        output: output
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Measure impact
   */
  async measureImpact() {
    try {
      const output = execSync(
        'node scripts/measure-improvement-impact.js',
        { encoding: 'utf8', stdio: 'pipe' }
      );

      // Parse effectiveness score
      const effectivenessMatch = output.match(/Overall Effectiveness: ([\d.]+)/);

      return {
        success: true,
        effectiveness: effectivenessMatch ? parseFloat(effectivenessMatch[1]) : 0,
        output: output
      };
    } catch (error) {
      // Impact measurement might fail if insufficient data
      if (error.message.includes('Need at least 2')) {
        return {
          success: false,
          message: 'Insufficient historical data for impact measurement'
        };
      }

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate cycle summary
   */
  generateSummary(cycleLog) {
    const successSteps = cycleLog.steps.filter(s => s.status === 'success').length;
    const failedSteps = cycleLog.steps.filter(s => s.status === 'failed').length;

    return {
      successRate: successSteps / cycleLog.steps.length,
      successSteps: successSteps,
      failedSteps: failedSteps,
      totalSteps: cycleLog.steps.length,
      recommendations: this.generateRecommendations(cycleLog)
    };
  }

  /**
   * Generate recommendations for next cycle
   */
  generateRecommendations(cycleLog) {
    const recommendations = [];

    // Check if auto-implement was used
    if (!this.autoImplement) {
      recommendations.push({
        priority: 'medium',
        action: 'Enable Auto-Implementation',
        details: 'Use --auto-implement flag to automatically apply safe improvements'
      });
    }

    // Check if impact measurement succeeded
    const impactStep = cycleLog.steps.find(s => s.name === 'Impact Measurement');
    if (impactStep && !impactStep.result.success) {
      recommendations.push({
        priority: 'low',
        action: 'Continue Data Collection',
        details: 'Run more cycles to build historical data for impact analysis'
      });
    }

    // Check overall success rate
    if (cycleLog.summary.successRate === 1.0) {
      recommendations.push({
        priority: 'high',
        action: 'Scale Up Improvements',
        details: 'All steps successful. Consider increasing automation level.'
      });
    }

    return recommendations;
  }

  /**
   * Save cycle log
   */
  saveCycleLog(cycleLog) {
    const filename = path.join(
      this.cycleLogDir,
      `cycle-${this.cycleNumber.toString().padStart(3, '0')}.json`
    );

    fs.writeFileSync(filename, JSON.stringify(cycleLog, null, 2));
    console.log(`💾 Cycle log saved: ${filename}\n`);
  }

  /**
   * Display summary
   */
  displaySummary(cycleLog) {
    console.log('📊 CYCLE SUMMARY\n');
    console.log(`Cycle Number: #${cycleLog.cycleNumber}`);
    console.log(`Started: ${cycleLog.startTime}`);
    console.log(`Duration: ${(cycleLog.duration / 1000).toFixed(1)}s\n`);

    console.log('Steps Completed:');
    cycleLog.steps.forEach(step => {
      const statusIcon = step.status === 'success' ? '✅' : step.status === 'failed' ? '❌' : '⏭️';
      console.log(`  ${statusIcon} ${step.name}`);
    });
    console.log();

    console.log(`Success Rate: ${(cycleLog.summary.successRate * 100).toFixed(0)}%\n`);

    if (cycleLog.summary.recommendations.length > 0) {
      console.log('💡 Recommendations for Next Cycle:\n');
      cycleLog.summary.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.action}`);
        console.log(`   ${rec.details}\n`);
      });
    }
  }

  /**
   * Schedule next cycle
   */
  scheduleNextCycle(interval = 'daily') {
    const schedules = {
      hourly: '0 * * * *',
      daily: '0 2 * * *',    // 2 AM daily
      weekly: '0 2 * * 0',   // 2 AM Sunday
      monthly: '0 2 1 * *'   // 2 AM 1st of month
    };

    const cron = schedules[interval] || schedules.daily;

    console.log(`\n📅 To schedule automated cycles (${interval}):`);
    console.log(`   Add to crontab: ${cron} cd ${process.cwd()} && node scripts/run-improvement-cycle.js\n`);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    autoImplement: args.includes('--auto-implement'),
    dryRun: args.includes('--dry-run')
  };

  const cycle = new ImprovementCycle(options);

  cycle.runCycle()
    .then(() => {
      console.log('🎉 Improvement cycle completed successfully!\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Improvement cycle failed:', error.message);
      process.exit(1);
    });
}

module.exports = ImprovementCycle;
