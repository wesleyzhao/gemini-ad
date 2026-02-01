#!/usr/bin/env node

/**
 * Validation Tests for Improvement Iteration System
 * Feature #54: Iterate on improvement results and scale successful patterns
 *
 * Tests:
 * 1. Iteration script components
 * 2. Pilot implementation
 * 3. Pattern analysis
 * 4. Scaling logic
 * 5. Lessons learned generation
 * 6. Data integrity
 */

const fs = require('fs');
const path = require('path');

class IterationSystemValidator {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports/iterations');
    this.scriptsDir = path.join(__dirname, '../scripts');
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  /**
   * Run all validation tests
   */
  async runAllTests() {
    console.log('🧪 Validating Improvement Iteration System\n');
    console.log('=' .repeat(60));

    // Component tests
    await this.testScriptExists();
    await this.testScriptExecutable();
    await this.testReportGeneration();

    // Data integrity tests
    await this.testPilotImplementationData();
    await this.testAnalysisData();
    await this.testScalingData();
    await this.testLessonsLearnedData();

    // Logic tests
    await this.testPilotPageSelection();
    await this.testPatternIdentification();
    await this.testImpactCalculation();
    await this.testScalingLogic();

    // Integration tests
    await this.testEndToEndWorkflow();
    await this.testReportConsistency();

    // Best practices tests
    await this.testBackupCreation();
    await this.testErrorHandling();

    this.printResults();
    return this.results.failed === 0;
  }

  /**
   * Test: Script exists
   */
  async testScriptExists() {
    const test = 'Script file exists';
    const scriptPath = path.join(this.scriptsDir, 'iterate-improvements.js');

    if (fs.existsSync(scriptPath)) {
      this.pass(test);
    } else {
      this.fail(test, 'iterate-improvements.js not found');
    }
  }

  /**
   * Test: Script is executable
   */
  async testScriptExecutable() {
    const test = 'Script is executable';
    const scriptPath = path.join(this.scriptsDir, 'iterate-improvements.js');

    try {
      const stats = fs.statSync(scriptPath);
      const isExecutable = (stats.mode & 0o111) !== 0;

      if (isExecutable) {
        this.pass(test);
      } else {
        this.fail(test, 'Script not executable');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Reports were generated
   */
  async testReportGeneration() {
    const test = 'Reports generated successfully';

    if (!fs.existsSync(this.reportsDir)) {
      this.fail(test, 'Iterations directory does not exist');
      return;
    }

    const files = fs.readdirSync(this.reportsDir);
    const hasImplementation = files.some(f => f.startsWith('pilot-implementation-'));
    const hasAnalysis = files.some(f => f.startsWith('pilot-analysis-'));
    const hasScaling = files.some(f => f.startsWith('pattern-scaling-'));
    const hasLessons = files.some(f => f.startsWith('lessons-learned-'));

    if (hasImplementation && hasAnalysis && hasScaling && hasLessons) {
      this.pass(test);
    } else {
      this.fail(test, `Missing reports: impl=${hasImplementation}, analysis=${hasAnalysis}, scaling=${hasScaling}, lessons=${hasLessons}`);
    }
  }

  /**
   * Test: Pilot implementation data structure
   */
  async testPilotImplementationData() {
    const test = 'Pilot implementation data integrity';

    const file = this.getLatestFile(this.reportsDir, 'pilot-implementation-');
    if (!file) {
      this.fail(test, 'No pilot implementation file found');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      const hasTimestamp = !!data.timestamp;
      const hasPilotPages = Array.isArray(data.pilotPages) && data.pilotPages.length > 0;
      const hasImplementations = Array.isArray(data.implementations);
      const hasSummary = !!data.summary;

      if (hasTimestamp && hasPilotPages && hasImplementations && hasSummary) {
        this.pass(test);
      } else {
        this.fail(test, 'Invalid data structure');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Analysis data structure
   */
  async testAnalysisData() {
    const test = 'Analysis data integrity';

    const file = this.getLatestFile(this.reportsDir, 'pilot-analysis-');
    if (!file) {
      this.fail(test, 'No analysis file found');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      const hasResults = Array.isArray(data.results) && data.results.length > 0;
      const hasPatterns = !!data.patterns;
      const hasRecommendations = Array.isArray(data.recommendations);

      // Check result structure
      const firstResult = data.results[0];
      const hasMetrics = firstResult.beforeMetrics && firstResult.afterMetrics;
      const hasImprovements = !!firstResult.improvements;
      const hasEffectiveness = firstResult.effectiveness && firstResult.effectiveness.score >= 0;

      if (hasResults && hasPatterns && hasRecommendations && hasMetrics && hasImprovements && hasEffectiveness) {
        this.pass(test);
      } else {
        this.fail(test, 'Invalid analysis data structure');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Scaling data structure
   */
  async testScalingData() {
    const test = 'Scaling data integrity';

    const file = this.getLatestFile(this.reportsDir, 'pattern-scaling-');
    if (!file) {
      this.fail(test, 'No scaling file found');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      const hasPatternsApplied = Array.isArray(data.patternsApplied);
      const hasPagesScaled = Array.isArray(data.pagesScaled);
      const hasResults = Array.isArray(data.results);
      const hasSummary = !!data.summary;

      if (hasPatternsApplied && hasPagesScaled && hasResults && hasSummary) {
        this.pass(test);
      } else {
        this.fail(test, 'Invalid scaling data structure');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Lessons learned data structure
   */
  async testLessonsLearnedData() {
    const test = 'Lessons learned data integrity';

    const jsonFile = this.getLatestFile(this.reportsDir, 'lessons-learned-iteration-');
    const mdFile = path.join(this.reportsDir, 'lessons-learned-iteration-1.md');

    if (!jsonFile || !fs.existsSync(mdFile)) {
      this.fail(test, 'Lessons learned files not found');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

      const hasExecutiveSummary = !!data.executiveSummary;
      const hasSuccessfulPatterns = Array.isArray(data.successfulPatterns);
      const hasBestPractices = Array.isArray(data.bestPractices);
      const hasRecommendations = Array.isArray(data.recommendations);
      const hasNextIteration = !!data.nextIteration;

      const mdContent = fs.readFileSync(mdFile, 'utf8');
      const hasMdContent = mdContent.length > 500;
      const hasHeadings = mdContent.includes('## Executive Summary');

      if (hasExecutiveSummary && hasSuccessfulPatterns && hasBestPractices && hasRecommendations && hasNextIteration && hasMdContent && hasHeadings) {
        this.pass(test);
      } else {
        this.fail(test, 'Invalid lessons learned structure');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Pilot page selection logic
   */
  async testPilotPageSelection() {
    const test = 'Pilot page selection is appropriate';

    const file = this.getLatestFile(this.reportsDir, 'pilot-implementation-');
    if (!file) {
      this.fail(test, 'No implementation file');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      // Should select 3 pages
      const hasCorrectCount = data.pilotPages.length === 3;

      // Pages should be diverse (different types)
      const pages = data.pilotPages;
      const hasDiversity = new Set(pages.map(p => p.split('-')[0])).size >= 2;

      if (hasCorrectCount && hasDiversity) {
        this.pass(test);
      } else {
        this.fail(test, `Count: ${data.pilotPages.length}, Diversity: ${hasDiversity}`);
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Pattern identification
   */
  async testPatternIdentification() {
    const test = 'Pattern identification works correctly';

    const file = this.getLatestFile(this.reportsDir, 'pilot-analysis-');
    if (!file) {
      this.fail(test, 'No analysis file');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      const hasPatterns = data.patterns.successful.length > 0 ||
                         data.patterns.moderate.length > 0 ||
                         data.patterns.minimal.length > 0;

      // Each pattern should have required fields
      const allPatternsValid = [...data.patterns.successful, ...data.patterns.moderate, ...data.patterns.minimal].every(p =>
        p.pattern && typeof p.avgImprovement === 'number' && p.occurrences > 0
      );

      if (hasPatterns && allPatternsValid) {
        this.pass(test);
      } else {
        this.fail(test, 'Invalid patterns structure');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Impact calculation
   */
  async testImpactCalculation() {
    const test = 'Impact calculations are reasonable';

    const file = this.getLatestFile(this.reportsDir, 'pilot-analysis-');
    if (!file) {
      this.fail(test, 'No analysis file');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      let allReasonable = true;

      for (const result of data.results) {
        const imp = result.improvements;

        // Quality score improvements should be reasonable (typically 5-20 points)
        if (imp.qualityScore < -10 || imp.qualityScore > 40) {
          allReasonable = false;
        }

        // Effectiveness score should be 0-100
        if (result.effectiveness.score < 0 || result.effectiveness.score > 100) {
          allReasonable = false;
        }
      }

      if (allReasonable) {
        this.pass(test);
      } else {
        this.fail(test, 'Some impact calculations are unrealistic');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Scaling logic
   */
  async testScalingLogic() {
    const test = 'Scaling logic applied correctly';

    const file = this.getLatestFile(this.reportsDir, 'pattern-scaling-');
    if (!file) {
      this.fail(test, 'No scaling file');
      return;
    }

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      // Should have scaled to multiple pages
      const scaledEnoughPages = data.pagesScaled.length >= 10;

      // Should have applied changes
      const appliedChanges = data.summary.totalChanges > 0;

      // Should exclude pilot pages
      const pilotFile = this.getLatestFile(this.reportsDir, 'pilot-implementation-');
      const pilot = JSON.parse(fs.readFileSync(pilotFile, 'utf8'));
      const excludesPilot = !data.pagesScaled.some(p => pilot.pilotPages.includes(p));

      if (scaledEnoughPages && appliedChanges && excludesPilot) {
        this.pass(test);
      } else {
        this.fail(test, `Scaled: ${data.pagesScaled.length}, Changes: ${data.summary.totalChanges}, Excludes pilot: ${excludesPilot}`);
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: End-to-end workflow
   */
  async testEndToEndWorkflow() {
    const test = 'End-to-end workflow completed successfully';

    try {
      const hasImplementation = this.getLatestFile(this.reportsDir, 'pilot-implementation-');
      const hasAnalysis = this.getLatestFile(this.reportsDir, 'pilot-analysis-');
      const hasScaling = this.getLatestFile(this.reportsDir, 'pattern-scaling-');
      const hasLessons = this.getLatestFile(this.reportsDir, 'lessons-learned-iteration-');

      if (hasImplementation && hasAnalysis && hasScaling && hasLessons) {
        this.pass(test);
      } else {
        this.fail(test, 'Workflow incomplete');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Report consistency
   */
  async testReportConsistency() {
    const test = 'Reports are consistent across workflow';

    try {
      const implFile = this.getLatestFile(this.reportsDir, 'pilot-implementation-');
      const analysisFile = this.getLatestFile(this.reportsDir, 'pilot-analysis-');
      const lessonsFile = this.getLatestFile(this.reportsDir, 'lessons-learned-iteration-');

      const impl = JSON.parse(fs.readFileSync(implFile, 'utf8'));
      const analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
      const lessons = JSON.parse(fs.readFileSync(lessonsFile, 'utf8'));

      // Pilot pages should match
      const pagesMatch = JSON.stringify(impl.pilotPages.sort()) === JSON.stringify(analysis.pilotPages.sort());

      // Summary counts should be consistent
      const resultsMatch = impl.implementations.length === analysis.results.length;

      // Executive summary should match analysis
      const summaryMatch = lessons.executiveSummary.pilotPages === analysis.pilotPages.length;

      if (pagesMatch && resultsMatch && summaryMatch) {
        this.pass(test);
      } else {
        this.fail(test, `Pages: ${pagesMatch}, Results: ${resultsMatch}, Summary: ${summaryMatch}`);
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  /**
   * Test: Backup creation
   */
  async testBackupCreation() {
    const test = 'Backups created for modified files';

    const backupDir = path.join(__dirname, '../backups');

    if (!fs.existsSync(backupDir)) {
      this.fail(test, 'Backup directory does not exist');
      return;
    }

    const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.backup'));

    if (backups.length > 0) {
      this.pass(test);
    } else {
      this.fail(test, 'No backup files created');
    }
  }

  /**
   * Test: Error handling
   */
  async testErrorHandling() {
    const test = 'System handles errors gracefully';

    // Check if script has try-catch blocks
    const scriptPath = path.join(this.scriptsDir, 'iterate-improvements.js');
    const content = fs.readFileSync(scriptPath, 'utf8');

    const hasTryCatch = content.includes('try {') && content.includes('catch');
    const hasErrorLogging = content.includes('console.error');

    if (hasTryCatch && hasErrorLogging) {
      this.pass(test);
    } else {
      this.fail(test, 'Missing error handling');
    }
  }

  /**
   * Helper methods
   */
  getLatestFile(dir, prefix) {
    if (!fs.existsSync(dir)) return null;

    const files = fs.readdirSync(dir)
      .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(dir, f),
        time: fs.statSync(path.join(dir, f)).mtime
      }))
      .sort((a, b) => b.time - a.time);

    return files.length > 0 ? files[0].path : null;
  }

  pass(test) {
    this.results.passed++;
    this.results.tests.push({ test, status: 'PASS' });
    console.log(`✅ PASS: ${test}`);
  }

  fail(test, reason) {
    this.results.failed++;
    this.results.tests.push({ test, status: 'FAIL', reason });
    console.log(`❌ FAIL: ${test}`);
    if (reason) console.log(`   Reason: ${reason}`);
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Results Summary\n');
    console.log(`Total Tests: ${this.results.passed + this.results.failed}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Pass Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    const grade = this.results.failed === 0 ? 'A+' :
                  this.results.passed / (this.results.passed + this.results.failed) >= 0.9 ? 'A' :
                  this.results.passed / (this.results.passed + this.results.failed) >= 0.8 ? 'B' :
                  this.results.passed / (this.results.passed + this.results.failed) >= 0.7 ? 'C' : 'F';

    console.log(`Grade: ${grade}`);
    console.log('='.repeat(60) + '\n');

    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! Iteration system is production ready.\n');
    } else {
      console.log('⚠️  Some tests failed. Review issues above.\n');
    }
  }
}

// Run tests
async function main() {
  const validator = new IterationSystemValidator();
  const success = await validator.runAllTests();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = IterationSystemValidator;
