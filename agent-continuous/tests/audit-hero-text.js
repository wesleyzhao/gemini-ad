#!/usr/bin/env node

/**
 * Hero Text Audit Script
 *
 * Analyzes hero sections across all landing pages to evaluate:
 * - Headline clarity and length (5-10 words ideal)
 * - Value proposition clarity
 * - Subheading effectiveness
 * - Time-to-comprehension (< 3 seconds)
 * - Emotional impact
 * - Action-oriented language
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

// Hero text quality criteria
const CRITERIA = {
  HEADLINE_LENGTH: { min: 3, ideal_min: 5, ideal_max: 10, max: 15 },
  SUBHEADING_LENGTH: { min: 5, ideal_min: 10, ideal_max: 20, max: 30 },
  WORD_COUNT_TOTAL: { ideal_max: 30 }, // Total words in hero section
  CLARITY_KEYWORDS: ['free', 'fast', 'easy', 'simple', 'powerful', 'trusted', 'better'],
  VAGUE_WORDS: ['empower', 'revolutionize', 'transform', 'leverage', 'synergy', 'paradigm'],
  ACTION_VERBS: ['get', 'start', 'create', 'build', 'discover', 'learn', 'save', 'find'],
  BENEFIT_INDICATORS: ['save time', 'increase', 'improve', 'reduce', 'faster', 'easier', 'better'],
  QUESTION_HEADLINES: /\?$/, // Questions can work but need to be specific
};

function analyzeHeroText(html, filename) {
  const root = parse(html);

  // Find hero section
  const hero = root.querySelector('.hero');
  if (!hero) {
    return {
      filename,
      error: 'No hero section found',
      score: 0
    };
  }

  // Extract text elements
  const h1 = hero.querySelector('h1');
  const subtitle = hero.querySelector('.subtitle, p');
  const supportingCopy = hero.querySelector('.hero-supporting-copy');

  const headline = h1 ? h1.text.trim() : '';
  const subheading = subtitle ? subtitle.text.trim() : '';
  const supporting = supportingCopy ? supportingCopy.text.trim() : '';

  // Analysis
  const analysis = {
    filename,
    headline,
    subheading,
    supporting,
    headlineWordCount: headline.split(/\s+/).length,
    subheadingWordCount: subheading.split(/\s+/).length,
    totalWordCount: (headline + ' ' + subheading + ' ' + supporting).split(/\s+/).filter(w => w).length,
    issues: [],
    strengths: [],
    score: 100
  };

  // Check headline length
  if (analysis.headlineWordCount < CRITERIA.HEADLINE_LENGTH.min) {
    analysis.issues.push(`Headline too short (${analysis.headlineWordCount} words)`);
    analysis.score -= 15;
  } else if (analysis.headlineWordCount > CRITERIA.HEADLINE_LENGTH.max) {
    analysis.issues.push(`Headline too long (${analysis.headlineWordCount} words)`);
    analysis.score -= 10;
  } else if (analysis.headlineWordCount >= CRITERIA.HEADLINE_LENGTH.ideal_min &&
             analysis.headlineWordCount <= CRITERIA.HEADLINE_LENGTH.ideal_max) {
    analysis.strengths.push(`Ideal headline length (${analysis.headlineWordCount} words)`);
  }

  // Check for vague language
  const headlineLower = headline.toLowerCase();
  CRITERIA.VAGUE_WORDS.forEach(word => {
    if (headlineLower.includes(word)) {
      analysis.issues.push(`Vague word detected: "${word}"`);
      analysis.score -= 8;
    }
  });

  // Check for clarity keywords (positive)
  let clarityCount = 0;
  CRITERIA.CLARITY_KEYWORDS.forEach(word => {
    if (headlineLower.includes(word)) {
      clarityCount++;
    }
  });
  if (clarityCount > 0) {
    analysis.strengths.push(`Uses ${clarityCount} clarity keyword(s)`);
  } else {
    analysis.issues.push('No clarity keywords found');
    analysis.score -= 5;
  }

  // Check for benefit-driven language
  let benefitCount = 0;
  const fullText = (headline + ' ' + subheading).toLowerCase();
  CRITERIA.BENEFIT_INDICATORS.forEach(phrase => {
    if (fullText.includes(phrase)) {
      benefitCount++;
    }
  });
  if (benefitCount > 0) {
    analysis.strengths.push(`${benefitCount} benefit indicator(s) found`);
  } else {
    analysis.issues.push('No clear benefits communicated');
    analysis.score -= 10;
  }

  // Check for action verbs in CTA context
  const cta = hero.querySelector('.btn, .cta-primary');
  if (cta) {
    const ctaText = cta.text.trim().toLowerCase();
    let hasActionVerb = false;
    CRITERIA.ACTION_VERBS.forEach(verb => {
      if (ctaText.includes(verb)) {
        hasActionVerb = true;
      }
    });
    if (hasActionVerb) {
      analysis.strengths.push('CTA uses action verb');
    } else {
      analysis.issues.push('CTA lacks action verb');
      analysis.score -= 5;
    }
  }

  // Check subheading
  if (!subheading) {
    analysis.issues.push('No subheading found');
    analysis.score -= 15;
  } else if (analysis.subheadingWordCount > CRITERIA.SUBHEADING_LENGTH.max) {
    analysis.issues.push(`Subheading too long (${analysis.subheadingWordCount} words)`);
    analysis.score -= 8;
  } else if (analysis.subheadingWordCount >= CRITERIA.SUBHEADING_LENGTH.ideal_min &&
             analysis.subheadingWordCount <= CRITERIA.SUBHEADING_LENGTH.ideal_max) {
    analysis.strengths.push(`Good subheading length (${analysis.subheadingWordCount} words)`);
  }

  // Check total word count (< 3 second comprehension)
  if (analysis.totalWordCount > 50) {
    analysis.issues.push(`Hero text too long (${analysis.totalWordCount} words) - may exceed 3-second comprehension`);
    analysis.score -= 10;
  } else if (analysis.totalWordCount <= 30) {
    analysis.strengths.push(`Concise hero text (${analysis.totalWordCount} words) - ideal for quick comprehension`);
  }

  // Check for question headlines
  if (CRITERIA.QUESTION_HEADLINES.test(headline)) {
    analysis.issues.push('Question headline - ensure it\'s specific and not generic');
    analysis.score -= 3;
  }

  // Check for numbers/specificity
  if (/\d+/.test(headline + subheading)) {
    analysis.strengths.push('Uses specific numbers/metrics');
  }

  // Ensure score doesn't go below 0
  analysis.score = Math.max(0, analysis.score);

  return analysis;
}

function generateReport(analyses) {
  console.log('\n' + '='.repeat(80));
  console.log('HERO TEXT AUDIT REPORT');
  console.log('='.repeat(80));
  console.log('\nBest Practices for 2026:');
  console.log('• Headline: 5-10 words for instant comprehension');
  console.log('• Subheading: 10-20 words to expand on value');
  console.log('• Total: < 30 words for < 3 second understanding');
  console.log('• Clarity > Cleverness: Be direct, not vague');
  console.log('• Benefit-driven: Communicate value, not features');
  console.log('• Action-oriented: Use verbs that prompt engagement');
  console.log('='.repeat(80));

  // Sort by score
  const sorted = analyses.filter(a => !a.error).sort((a, b) => b.score - a.score);
  const errors = analyses.filter(a => a.error);

  console.log('\n📊 SUMMARY STATISTICS\n');
  const avgScore = sorted.reduce((sum, a) => sum + a.score, 0) / sorted.length;
  console.log(`Average Score: ${avgScore.toFixed(1)}/100`);
  console.log(`Pages Analyzed: ${sorted.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`High Quality (90+): ${sorted.filter(a => a.score >= 90).length}`);
  console.log(`Good Quality (70-89): ${sorted.filter(a => a.score >= 70 && a.score < 90).length}`);
  console.log(`Needs Improvement (<70): ${sorted.filter(a => a.score < 70).length}`);

  console.log('\n' + '='.repeat(80));
  console.log('DETAILED RESULTS (sorted by score)');
  console.log('='.repeat(80));

  sorted.forEach((analysis, index) => {
    const statusEmoji = analysis.score >= 90 ? '✅' : analysis.score >= 70 ? '⚠️' : '❌';
    console.log(`\n${statusEmoji} ${index + 1}. ${analysis.filename} - Score: ${analysis.score}/100`);
    console.log('-'.repeat(80));

    console.log(`\n📝 Headline (${analysis.headlineWordCount} words):`);
    console.log(`   "${analysis.headline}"`);

    if (analysis.subheading) {
      console.log(`\n📄 Subheading (${analysis.subheadingWordCount} words):`);
      console.log(`   "${analysis.subheading}"`);
    }

    if (analysis.supporting) {
      console.log(`\n💬 Supporting Copy:`);
      console.log(`   "${analysis.supporting}"`);
    }

    console.log(`\n📊 Total Word Count: ${analysis.totalWordCount}`);

    if (analysis.strengths.length > 0) {
      console.log('\n✅ Strengths:');
      analysis.strengths.forEach(s => console.log(`   • ${s}`));
    }

    if (analysis.issues.length > 0) {
      console.log('\n⚠️  Issues:');
      analysis.issues.forEach(i => console.log(`   • ${i}`));
    }
  });

  // Errors
  if (errors.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('ERRORS');
    console.log('='.repeat(80));
    errors.forEach(e => {
      console.log(`\n❌ ${e.filename}: ${e.error}`);
    });
  }

  // Recommendations
  console.log('\n' + '='.repeat(80));
  console.log('TOP RECOMMENDATIONS');
  console.log('='.repeat(80));

  const needsWork = sorted.filter(a => a.score < 70);
  if (needsWork.length > 0) {
    console.log('\n🔧 Priority Improvements:');
    needsWork.forEach(a => {
      console.log(`\n   ${a.filename}:`);
      a.issues.slice(0, 3).forEach(i => console.log(`   • ${i}`));
    });
  } else {
    console.log('\n🎉 All pages meet quality standards!');
  }

  console.log('\n' + '='.repeat(80));
  console.log('HERO TEXT OPTIMIZATION PRINCIPLES');
  console.log('='.repeat(80));
  console.log(`
1. CLARITY FIRST: Users should understand value in 3 seconds
   ❌ "Revolutionize your workflow"
   ✅ "Save 20 hours per week with AI automation"

2. BE SPECIFIC: Use numbers and concrete benefits
   ❌ "Powerful AI assistant"
   ✅ "AI that reads 10,000 pages in 2 minutes"

3. AVOID JARGON: Speak human, not corporate
   ❌ "Leverage synergistic paradigms"
   ✅ "Get better answers, faster"

4. BENEFIT > FEATURE: Show outcome, not capability
   ❌ "Advanced natural language processing"
   ✅ "Answers that actually help"

5. ACTION-ORIENTED: Guide users to next step
   ❌ "Learn more"
   ✅ "Start writing for free"
  `);

  console.log('\n' + '='.repeat(80) + '\n');

  return {
    avgScore,
    sorted,
    errors,
    needsWork
  };
}

// Main execution
function main() {
  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.html'))
    .sort();

  const analyses = files.map(filename => {
    const filepath = path.join(PAGES_DIR, filename);
    const html = fs.readFileSync(filepath, 'utf-8');
    return analyzeHeroText(html, filename);
  });

  const report = generateReport(analyses);

  // Save report to file
  const reportPath = path.join(__dirname, '..', 'HERO_TEXT_AUDIT.md');
  const markdown = generateMarkdownReport(analyses, report);
  fs.writeFileSync(reportPath, markdown);
  console.log(`📄 Detailed report saved to: HERO_TEXT_AUDIT.md\n`);
}

function generateMarkdownReport(analyses, report) {
  const timestamp = new Date().toISOString().split('T')[0];

  let md = `# Hero Text Audit Report\n\n`;
  md += `**Generated:** ${timestamp}\n\n`;
  md += `## Executive Summary\n\n`;
  md += `- **Average Score:** ${report.avgScore.toFixed(1)}/100\n`;
  md += `- **Pages Analyzed:** ${report.sorted.length}\n`;
  md += `- **High Quality (90+):** ${report.sorted.filter(a => a.score >= 90).length}\n`;
  md += `- **Good Quality (70-89):** ${report.sorted.filter(a => a.score >= 70 && a.score < 90).length}\n`;
  md += `- **Needs Improvement (<70):** ${report.sorted.filter(a => a.score < 70).length}\n\n`;

  md += `## Best Practices for 2026\n\n`;
  md += `### The 3-Second Rule\n`;
  md += `Users should understand your value proposition in **< 3 seconds**. This means:\n\n`;
  md += `- **Headline:** 5-10 words for instant comprehension\n`;
  md += `- **Subheading:** 10-20 words to expand on value\n`;
  md += `- **Total hero text:** < 30 words ideal\n`;
  md += `- **Clarity > Cleverness:** Be direct, not vague\n`;
  md += `- **Benefit-driven:** Communicate value, not just features\n\n`;

  md += `## Detailed Analysis\n\n`;

  report.sorted.forEach((analysis, index) => {
    const statusEmoji = analysis.score >= 90 ? '✅' : analysis.score >= 70 ? '⚠️' : '❌';
    md += `### ${statusEmoji} ${index + 1}. ${analysis.filename} (${analysis.score}/100)\n\n`;

    md += `**Headline** (${analysis.headlineWordCount} words):\n`;
    md += `> ${analysis.headline}\n\n`;

    if (analysis.subheading) {
      md += `**Subheading** (${analysis.subheadingWordCount} words):\n`;
      md += `> ${analysis.subheading}\n\n`;
    }

    md += `**Total Word Count:** ${analysis.totalWordCount}\n\n`;

    if (analysis.strengths.length > 0) {
      md += `**Strengths:**\n`;
      analysis.strengths.forEach(s => md += `- ✅ ${s}\n`);
      md += `\n`;
    }

    if (analysis.issues.length > 0) {
      md += `**Issues:**\n`;
      analysis.issues.forEach(i => md += `- ⚠️ ${i}\n`);
      md += `\n`;
    }

    md += `---\n\n`;
  });

  if (report.errors.length > 0) {
    md += `## Errors\n\n`;
    report.errors.forEach(e => {
      md += `- ❌ **${e.filename}:** ${e.error}\n`;
    });
    md += `\n`;
  }

  md += `## Optimization Principles\n\n`;
  md += `### 1. Clarity First\n`;
  md += `Users should understand value in 3 seconds\n\n`;
  md += `❌ "Revolutionize your workflow"\n`;
  md += `✅ "Save 20 hours per week with AI automation"\n\n`;

  md += `### 2. Be Specific\n`;
  md += `Use numbers and concrete benefits\n\n`;
  md += `❌ "Powerful AI assistant"\n`;
  md += `✅ "AI that reads 10,000 pages in 2 minutes"\n\n`;

  md += `### 3. Avoid Jargon\n`;
  md += `Speak human, not corporate\n\n`;
  md += `❌ "Leverage synergistic paradigms"\n`;
  md += `✅ "Get better answers, faster"\n\n`;

  md += `### 4. Benefit > Feature\n`;
  md += `Show outcome, not capability\n\n`;
  md += `❌ "Advanced natural language processing"\n`;
  md += `✅ "Answers that actually help"\n\n`;

  md += `### 5. Action-Oriented\n`;
  md += `Guide users to next step\n\n`;
  md += `❌ "Learn more"\n`;
  md += `✅ "Start writing for free"\n\n`;

  return md;
}

if (require.main === module) {
  main();
}

module.exports = { analyzeHeroText, generateReport };
