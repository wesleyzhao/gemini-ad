#!/usr/bin/env node

/**
 * Add Hero Variants to Landing Pages
 *
 * This script adds data-hero-variants and data-subtitle-variants attributes
 * to landing pages, enabling A/B testing of headlines and subtitles.
 *
 * Usage: node scripts/add-hero-variants.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Load headline variants configuration
const variantsPath = path.join(__dirname, '..', 'headline-variants.json');
const variantsData = JSON.parse(fs.readFileSync(variantsPath, 'utf8'));

const pagesDir = path.join(__dirname, '..', 'pages');

// Pages to process
const pagesToUpdate = Object.keys(variantsData.headline_variants);

console.log('🎯 Adding Hero Variants to Landing Pages\n');
console.log(`Found ${pagesToUpdate.length} pages with variant configurations\n`);

let updatedCount = 0;
let skippedCount = 0;
const errors = [];

pagesToUpdate.forEach(pageFile => {
  const pagePath = path.join(pagesDir, pageFile);

  // Check if page exists
  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  Skipping ${pageFile} - file not found`);
    skippedCount++;
    return;
  }

  try {
    const html = fs.readFileSync(pagePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const pageConfig = variantsData.headline_variants[pageFile];
    const variants = pageConfig.variants;

    // Find hero title (h1)
    let heroTitle = document.querySelector('h1.hero-title');
    if (!heroTitle) {
      heroTitle = document.querySelector('.hero h1');
    }
    if (!heroTitle) {
      heroTitle = document.querySelector('h1');
    }

    // Find hero subtitle
    let heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) {
      heroSubtitle = document.querySelector('.hero p');
    }

    // Prepare headline variants array
    const headlineVariants = variants.map(v => ({
      text: v.headline,
      weight: 1
    }));

    // Prepare subtitle variants array
    const subtitleVariants = variants.map(v => ({
      text: v.subtitle,
      weight: 1
    }));

    // Add variants to hero title
    if (heroTitle) {
      // Add ID if not present
      if (!heroTitle.id) {
        heroTitle.id = 'hero-title';
      }

      // Add data-hero-variants attribute
      heroTitle.setAttribute('data-hero-variants', JSON.stringify(headlineVariants));

      console.log(`✅ ${pageFile}`);
      console.log(`   → Added ${headlineVariants.length} headline variants to #${heroTitle.id}`);
    } else {
      console.log(`⚠️  ${pageFile} - No hero title found`);
    }

    // Add variants to hero subtitle
    if (heroSubtitle) {
      // Add ID if not present
      if (!heroSubtitle.id) {
        heroSubtitle.id = 'hero-subtitle';
      }

      // Add data-subtitle-variants attribute
      heroSubtitle.setAttribute('data-subtitle-variants', JSON.stringify(subtitleVariants));

      console.log(`   → Added ${subtitleVariants.length} subtitle variants to #${heroSubtitle.id}`);
    }

    // Check if hero-ab-testing.js is already included
    const scripts = Array.from(document.querySelectorAll('script'));
    const hasABScript = scripts.some(script =>
      script.src && script.src.includes('hero-ab-testing')
    );

    // Add hero-ab-testing.js script if not present
    if (!hasABScript && (heroTitle || heroSubtitle)) {
      const body = document.querySelector('body');
      if (body) {
        // Add before closing body tag
        const scriptTag = document.createElement('script');
        scriptTag.src = '../assets/js/hero-ab-testing.js';
        scriptTag.defer = true;

        // Insert before other scripts or at end
        const existingScript = body.querySelector('script');
        if (existingScript) {
          body.insertBefore(scriptTag, existingScript);
        } else {
          body.appendChild(scriptTag);
        }

        console.log(`   → Added hero-ab-testing.js script`);
      }
    }

    // Write updated HTML
    const updatedHtml = dom.serialize();
    fs.writeFileSync(pagePath, updatedHtml, 'utf8');

    updatedCount++;
    console.log('');

  } catch (error) {
    console.error(`❌ Error processing ${pageFile}:`, error.message);
    errors.push({ page: pageFile, error: error.message });
    skippedCount++;
  }
});

// Summary
console.log('═══════════════════════════════════════════════════════');
console.log('📊 Summary\n');
console.log(`✅ Updated: ${updatedCount} pages`);
console.log(`⚠️  Skipped: ${skippedCount} pages`);

if (errors.length > 0) {
  console.log(`\n❌ Errors: ${errors.length}`);
  errors.forEach(({ page, error }) => {
    console.log(`   ${page}: ${error}`);
  });
}

console.log('\n✨ Hero variant attributes added successfully!');
console.log('\nNext steps:');
console.log('1. Test variants: Open any page in browser');
console.log('2. View results: Open browser console and run: heroABTesting.getReport()');
console.log('3. Refresh variant: heroABTesting.refreshVariant("hero-title")');
console.log('4. Clear data: heroABTesting.clearData()');
