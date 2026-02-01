/**
 * Accessibility Fix Script
 *
 * Automatically fixes common accessibility issues identified by the audit:
 * 1. Adds <main> landmark to pages
 * 2. Adds skip-to-main-content link
 * 3. Fixes heading hierarchy (h2 -> h4 becomes h2 -> h3)
 * 4. Adds missing h1 if needed
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// Get all HTML pages
const pagesDir = path.join(__dirname, '..', 'pages');
const pages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(pagesDir, file));

let totalFixes = 0;

console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`${colors.bright}ACCESSIBILITY FIX SCRIPT${colors.reset}`);
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}\n`);

function fixPage(filePath) {
  const filename = path.basename(filePath);
  let html = fs.readFileSync(filePath, 'utf-8');
  let fixes = 0;

  console.log(`${colors.cyan}Processing: ${filename}${colors.reset}`);

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Fix 1: Add main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    // Find the body content (usually after any header/nav)
    const body = document.querySelector('body');

    if (body) {
      // Look for container divs or sections that hold main content
      const containers = body.querySelectorAll('.container, .hero, section');

      if (containers.length > 0) {
        // Wrap content in main tag
        // Strategy: Find first major section and wrap everything except header/nav in <main>
        const header = body.querySelector('header, nav');
        const footer = body.querySelector('footer');

        // Get all body children except header and footer
        const bodyChildren = Array.from(body.children);
        const mainContent = bodyChildren.filter(child =>
          !child.matches('header') &&
          !child.matches('nav') &&
          !child.matches('footer') &&
          !child.matches('script')
        );

        if (mainContent.length > 0) {
          // Create main element
          const mainElement = document.createElement('main');
          mainElement.setAttribute('id', 'main-content');

          // Move children into main
          mainContent.forEach(child => {
            mainElement.appendChild(child.cloneNode(true));
          });

          // Remove old children and add main
          mainContent.forEach(child => child.remove());

          // Insert main after header or at beginning
          if (header) {
            header.parentNode.insertBefore(mainElement, header.nextSibling);
          } else if (footer) {
            footer.parentNode.insertBefore(mainElement, footer);
          } else {
            body.insertBefore(mainElement, body.firstChild);
          }

          html = dom.serialize();
          fixes++;
          console.log(`  ${colors.green}✓ Added <main> landmark${colors.reset}`);
        }
      }
    }
  }

  // Fix 2: Add skip-to-main link
  if (!html.includes('skip') || !html.includes('main-content')) {
    // Add skip link CSS if not exists
    const skipLinkStyles = `
    <style>
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 100;
        font-weight: 600;
        border-radius: 0 0 4px 0;
      }
      .skip-link:focus {
        top: 0;
      }
    </style>`;

    const skipLinkHTML = `<a href="#main-content" class="skip-link">Skip to main content</a>`;

    // Insert skip link styles in head
    if (!html.includes('.skip-link')) {
      html = html.replace('</head>', `  ${skipLinkStyles}\n  </head>`);
    }

    // Insert skip link at start of body
    html = html.replace('<body>', `<body>\n  ${skipLinkHTML}\n`);

    fixes++;
    console.log(`  ${colors.green}✓ Added skip-to-main-content link${colors.reset}`);
  }

  // Fix 3: Fix heading hierarchy (h4 -> h3 where appropriate)
  // This is more complex and page-specific, so we'll do a simple fix
  const dom2 = new JSDOM(html);
  const document2 = dom2.window.document;

  const headings = Array.from(document2.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingLevels = headings.map(h => ({
    element: h,
    level: parseInt(h.tagName.substring(1))
  }));

  let headingFixes = 0;
  for (let i = 1; i < headingLevels.length; i++) {
    const prev = headingLevels[i - 1];
    const curr = headingLevels[i];
    const diff = curr.level - prev.level;

    // If we skip a level (e.g., h2 to h4), downgrade to h3
    if (diff > 1) {
      const correctLevel = prev.level + 1;
      const oldTag = curr.element.outerHTML;
      const newTag = oldTag.replace(
        new RegExp(`<h${curr.level}`, 'g'),
        `<h${correctLevel}`
      ).replace(
        new RegExp(`</h${curr.level}>`, 'g'),
        `</h${correctLevel}>`
      );

      html = html.replace(oldTag, newTag);
      headingFixes++;
    }
  }

  if (headingFixes > 0) {
    fixes += headingFixes;
    console.log(`  ${colors.green}✓ Fixed ${headingFixes} heading hierarchy issues${colors.reset}`);
  }

  // Fix 4: Check for h1
  const dom3 = new JSDOM(html);
  const document3 = dom3.window.document;
  const h1s = document3.querySelectorAll('h1');

  if (h1s.length === 0) {
    // Find the first h2 and make it h1
    const firstH2 = document3.querySelector('h2');
    if (firstH2) {
      const oldTag = firstH2.outerHTML;
      const newTag = oldTag.replace('<h2', '<h1').replace('</h2>', '</h1>');
      html = html.replace(oldTag, newTag);
      fixes++;
      console.log(`  ${colors.green}✓ Converted first h2 to h1${colors.reset}`);
    }
  }

  // Write fixed HTML back to file
  if (fixes > 0) {
    fs.writeFileSync(filePath, html);
    console.log(`  ${colors.yellow}Total fixes: ${fixes}${colors.reset}\n`);
    totalFixes += fixes;
  } else {
    console.log(`  ${colors.green}No fixes needed${colors.reset}\n`);
  }

  return fixes;
}

// Process all pages
let pagesFixed = 0;

pages.forEach((page) => {
  const fixes = fixPage(page);
  if (fixes > 0) {
    pagesFixed++;
  }
});

console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`${colors.bright}SUMMARY${colors.reset}`);
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}`);
console.log(`Pages Processed: ${pages.length}`);
console.log(`Pages Fixed: ${pagesFixed}`);
console.log(`Total Fixes Applied: ${totalFixes}`);
console.log(`${colors.bright}${'='.repeat(80)}${colors.reset}\n`);
console.log(`${colors.green}✓ Accessibility fixes complete!${colors.reset}\n`);
