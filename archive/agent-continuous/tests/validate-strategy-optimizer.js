#!/usr/bin/env node

/**
 * Validation Tests for Iteration Strategy Optimizer
 * Feature #57: Track long-term trends and optimize iteration strategy
 *
 * Validates that the strategy optimizer correctly analyzes trends,
 * optimizes iteration strategy, and generates actionable recommendations.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class StrategyOptimizerValidator {
  constructor() {
    this.testResults = [];
    this.reportsDir = path.join(process.cwd(), 'reports', 'iterations');
  }

  /**
   * Run all validation tests
   */
  async runAllTests() {
    console.log('🧪 Iteration Strategy Optimizer Validation Tests');
    console.log('='.repeat(70));
    console.log('');

    // Component Tests
    await this.testScriptExists();
    await this.testScriptExecutable();
    await this.testOutputGeneration();
    await this.testReportGeneration();
    await this.testTrendDataGeneration();

    // Content Tests
    await this.testAnalysisStructure();
    await this.testVelocityAnalysis();
    await this.testEffectivenessAnalysis();
    await this.testROIAnalysis();
    await this.testSaturationAnalysis();
    await this.testPatternEvolution();

    // Strategy Tests
    await this.testStrategyOptimization();
    await this.testActionPlan();
    await this.testExpectedImpact();
    await this.testRecommendations();

    // Integration Tests
    await this.testDataIntegration();
    await this.testTrendTracking();
    await this.testReportFormatting();

    // Display Results
    this.displayResults();

    // Return exit code
    const failureCount = this.testResults.filter(r => !r.passed).length;
    return failureCount === 0 ? 0 : 1;
  }

  /**
   * Test: Script exists
   */
  async testScriptExists() {
    const testName = 'Script exists and is accessible';
    try {
      const scriptPath = path.join(process.cwd(), 'scripts', 'optimize-iteration-strategy.js');
      const exists = fs.existsSync(scriptPath);

      if (exists) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Script file not found');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Script is executable
   */
  async testScriptExecutable() {
    const testName = 'Script executes without errors';
    try {
      execSync('node scripts/optimize-iteration-strategy.js', {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      this.pass(testName);
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Output file is generated
   */
  async testOutputGeneration() {
    const testName = 'Strategy optimization JSON is generated';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const exists = fs.existsSync(outputFile);

      if (exists) {
        const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        if (data.analysis && data.dataPoints) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Output file missing required fields');
        }
      } else {
        this.fail(testName, 'Output file not generated');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Report file is generated
   */
  async testReportGeneration() {
    const testName = 'Strategy optimization report is generated';
    try {
      const reportFile = path.join(this.reportsDir, 'strategy-optimization.md');
      const exists = fs.existsSync(reportFile);

      if (exists) {
        const content = fs.readFileSync(reportFile, 'utf8');
        if (content.length > 100) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Report file is too short');
        }
      } else {
        this.fail(testName, 'Report file not generated');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Trend data file is generated
   */
  async testTrendDataGeneration() {
    const testName = 'Trend data file is generated and updated';
    try {
      const trendFile = path.join(this.reportsDir, 'trend-data.json');
      const exists = fs.existsSync(trendFile);

      if (exists) {
        const data = JSON.parse(fs.readFileSync(trendFile, 'utf8'));
        if (data.snapshots && Array.isArray(data.snapshots)) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Trend data missing snapshots array');
        }
      } else {
        this.fail(testName, 'Trend data file not generated');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Analysis structure is valid
   */
  async testAnalysisStructure() {
    const testName = 'Analysis data structure is valid';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const requiredFields = [
        'velocityTrends',
        'effectivenessTrends',
        'roiTrends',
        'saturationAnalysis',
        'patternEvolution',
        'strategyRecommendations'
      ];

      const hasAllFields = requiredFields.every(field => field in data.analysis);

      if (hasAllFields) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Missing required analysis fields');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Velocity analysis is present
   */
  async testVelocityAnalysis() {
    const testName = 'Velocity trend analysis is present';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const velocity = data.analysis.velocityTrends;

      if (velocity && (velocity.trend || velocity.status === 'insufficient_data')) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Velocity analysis missing or invalid');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Effectiveness analysis is present
   */
  async testEffectivenessAnalysis() {
    const testName = 'Effectiveness trend analysis is present';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const effectiveness = data.analysis.effectivenessTrends;

      if (effectiveness && (effectiveness.trend || effectiveness.status === 'insufficient_data')) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Effectiveness analysis missing or invalid');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: ROI analysis is present
   */
  async testROIAnalysis() {
    const testName = 'ROI trend analysis is present';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const roi = data.analysis.roiTrends;

      if (roi && (roi.trend || roi.status === 'insufficient_data')) {
        this.pass(testName);
      } else {
        this.fail(testName, 'ROI analysis missing or invalid');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Saturation analysis is present
   */
  async testSaturationAnalysis() {
    const testName = 'Saturation point analysis is present';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const saturation = data.analysis.saturationAnalysis;

      if (saturation) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Saturation analysis missing');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Pattern evolution is tracked
   */
  async testPatternEvolution() {
    const testName = 'Pattern evolution is tracked';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const evolution = data.analysis.patternEvolution;

      if (evolution) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Pattern evolution missing');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Strategy optimization generates recommendations
   */
  async testStrategyOptimization() {
    const testName = 'Strategy optimization generates valid recommendations';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const strategy = data.analysis.strategyRecommendations;

      if (strategy && strategy.optimized && strategy.optimized.frequency) {
        const validFrequencies = ['weekly', 'bi-weekly', 'monthly'];
        if (validFrequencies.includes(strategy.optimized.frequency)) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Invalid frequency recommendation');
        }
      } else {
        this.fail(testName, 'Strategy recommendations missing or invalid');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Action plan is generated
   */
  async testActionPlan() {
    const testName = 'Action plan contains immediate, short-term, and long-term actions';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const actionPlan = data.analysis.strategyRecommendations?.actionPlan;

      if (actionPlan && actionPlan.immediate && actionPlan.shortTerm && actionPlan.longTerm) {
        const hasActions = actionPlan.immediate.length > 0 &&
                          actionPlan.shortTerm.length > 0 &&
                          actionPlan.longTerm.length > 0;

        if (hasActions) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Action plan sections are empty');
        }
      } else {
        this.fail(testName, 'Action plan missing required sections');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Expected impact is calculated
   */
  async testExpectedImpact() {
    const testName = 'Expected impact projections are calculated';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const impact = data.analysis.strategyRecommendations?.expectedImpact;

      if (impact && impact.perIteration && impact.perMonth && impact.threeMonth && impact.sixMonth) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Expected impact missing required projections');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Recommendations are actionable
   */
  async testRecommendations() {
    const testName = 'Recommendations include specific actions and reasoning';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const strategy = data.analysis.strategyRecommendations;

      if (strategy && strategy.optimized && strategy.optimized.reasoning) {
        if (Array.isArray(strategy.optimized.reasoning) && strategy.optimized.reasoning.length > 0) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Reasoning array is empty');
        }
      } else {
        this.fail(testName, 'Recommendations missing reasoning');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Data integration from multiple sources
   */
  async testDataIntegration() {
    const testName = 'Data is integrated from multiple sources';
    try {
      const outputFile = path.join(this.reportsDir, 'strategy-optimization.json');
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

      const dataPoints = data.dataPoints;

      if (dataPoints && typeof dataPoints.iterations === 'number') {
        this.pass(testName);
      } else {
        this.fail(testName, 'Data points not properly tracked');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Trend tracking maintains history
   */
  async testTrendTracking() {
    const testName = 'Trend tracking maintains historical snapshots';
    try {
      const trendFile = path.join(this.reportsDir, 'trend-data.json');
      const data = JSON.parse(fs.readFileSync(trendFile, 'utf8'));

      if (data.snapshots && data.snapshots.length > 0) {
        const latestSnapshot = data.snapshots[data.snapshots.length - 1];
        if (latestSnapshot.date && latestSnapshot.strategy) {
          this.pass(testName);
        } else {
          this.fail(testName, 'Snapshot missing required fields');
        }
      } else {
        this.fail(testName, 'No snapshots in trend data');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Test: Report formatting is valid
   */
  async testReportFormatting() {
    const testName = 'Report is properly formatted with all sections';
    try {
      const reportFile = path.join(this.reportsDir, 'strategy-optimization.md');
      const content = fs.readFileSync(reportFile, 'utf8');

      const requiredSections = [
        '# Iteration Strategy Optimization Report',
        '## Executive Summary',
        '## 🎯 Strategy Recommendations',
        '### Action Plan'
      ];

      const hasAllSections = requiredSections.every(section => content.includes(section));

      if (hasAllSections) {
        this.pass(testName);
      } else {
        this.fail(testName, 'Report missing required sections');
      }
    } catch (error) {
      this.fail(testName, error.message);
    }
  }

  /**
   * Mark test as passed
   */
  pass(testName) {
    this.testResults.push({
      name: testName,
      passed: true
    });
  }

  /**
   * Mark test as failed
   */
  fail(testName, reason) {
    this.testResults.push({
      name: testName,
      passed: false,
      reason: reason
    });
  }

  /**
   * Display test results
   */
  displayResults() {
    console.log('');
    console.log('Test Results:');
    console.log('='.repeat(70));
    console.log('');

    let passCount = 0;
    let failCount = 0;

    for (const result of this.testResults) {
      if (result.passed) {
        console.log(`✅ ${result.name}`);
        passCount++;
      } else {
        console.log(`❌ ${result.name}`);
        console.log(`   Reason: ${result.reason}`);
        failCount++;
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log(`Total: ${this.testResults.length} tests`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Success Rate: ${((passCount / this.testResults.length) * 100).toFixed(1)}%`);
    console.log('');

    if (failCount === 0) {
      console.log('🎉 All tests passed!');
      console.log('');
      console.log('Grade: A+ (100% success rate)');
    } else {
      console.log('⚠️  Some tests failed. Please review and fix.');
      console.log('');
      console.log(`Grade: ${this.calculateGrade(passCount / this.testResults.length)}`);
    }

    console.log('');
  }

  /**
   * Calculate letter grade
   */
  calculateGrade(percentage) {
    if (percentage >= 0.97) return 'A+';
    if (percentage >= 0.93) return 'A';
    if (percentage >= 0.90) return 'A-';
    if (percentage >= 0.87) return 'B+';
    if (percentage >= 0.83) return 'B';
    if (percentage >= 0.80) return 'B-';
    if (percentage >= 0.77) return 'C+';
    if (percentage >= 0.73) return 'C';
    if (percentage >= 0.70) return 'C-';
    if (percentage >= 0.67) return 'D+';
    if (percentage >= 0.63) return 'D';
    if (percentage >= 0.60) return 'D-';
    return 'F';
  }
}

// Run tests if called directly
if (require.main === module) {
  const validator = new StrategyOptimizerValidator();
  validator.runAllTests().then(exitCode => {
    process.exit(exitCode);
  });
}

module.exports = StrategyOptimizerValidator;
