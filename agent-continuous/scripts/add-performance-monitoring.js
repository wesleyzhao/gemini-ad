#!/usr/bin/env node

/**
 * Add Performance Monitoring to Landing Pages
 *
 * This script adds Google Analytics 4, Core Web Vitals tracking,
 * and user feedback widgets to all landing pages.
 *
 * Usage: node scripts/add-performance-monitoring.js
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// GA4 Tracking Code
const GA4_TRACKING_CODE = `
<!-- Google Analytics 4 - Performance Monitoring -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    'page_path': window.location.pathname,
    'page_title': document.title,
    'custom_map': {
      'dimension1': 'page_variant',
      'dimension2': 'user_segment',
      'dimension3': 'scroll_depth'
    }
  });

  // CTA Click Tracking
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cta-button, .cta, [data-cta]').forEach(button => {
      button.addEventListener('click', function() {
        gtag('event', 'cta_click', {
          'cta_location': this.dataset.location || this.className,
          'cta_text': this.textContent.trim(),
          'page_variant': document.body.dataset.variant || 'control'
        });
      });
    });

    // Scroll Depth Tracking
    let scrollDepths = [25, 50, 75, 90, 100];
    let triggeredDepths = new Set();

    window.addEventListener('scroll', function() {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !triggeredDepths.has(depth)) {
          triggeredDepths.add(depth);
          gtag('event', 'scroll_depth', {
            'scroll_percentage': depth,
            'page_variant': document.body.dataset.variant || 'control'
          });
        }
      });
    });

    // Time on Page Tracking
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      gtag('event', 'time_on_page', {
        'time_seconds': timeSpent,
        'page_variant': document.body.dataset.variant || 'control'
      });
    });
  });
</script>
`;

// Core Web Vitals Tracking
const WEB_VITALS_CODE = `
<!-- Core Web Vitals Tracking -->
<script type="module">
  import {onCLS, onFID, onLCP, onFCP, onTTFB, onINP} from 'https://unpkg.com/web-vitals@3?module';

  function sendToAnalytics({name, value, id, rating}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        'metric_name': name,
        'metric_value': Math.round(value),
        'metric_id': id,
        'metric_rating': rating,
        'page_variant': document.body.dataset.variant || 'control'
      });
    }

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(\`[Web Vital] \${name}:\`, {
        value: Math.round(value) + (name === 'CLS' ? '' : 'ms'),
        rating: rating,
        id: id
      });
    }
  }

  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
</script>
`;

// Feedback Widget HTML/CSS/JS
const FEEDBACK_WIDGET = `
<!-- User Feedback Widget -->
<div id="feedback-widget" class="feedback-widget" style="display: none;">
  <div class="feedback-prompt">Was this page helpful?</div>
  <div class="feedback-buttons">
    <button class="feedback-btn" data-rating="yes" aria-label="Yes, this page was helpful">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 1l2.5 5.5L18 7.5l-4 4 1 6-5-2.5-5 2.5 1-6-4-4 5.5-1z" fill="currentColor"/>
      </svg>
      Yes
    </button>
    <button class="feedback-btn" data-rating="no" aria-label="No, this page was not helpful">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" fill="none" stroke-width="2"/>
        <line x1="6" y1="6" x2="14" y2="14" stroke="currentColor" stroke-width="2"/>
        <line x1="14" y1="6" x2="6" y2="14" stroke="currentColor" stroke-width="2"/>
      </svg>
      No
    </button>
  </div>
  <div class="feedback-followup" style="display: none;">
    <textarea placeholder="Tell us more (optional)" maxlength="500" aria-label="Additional feedback"></textarea>
    <button class="feedback-submit">Send</button>
    <button class="feedback-skip">Skip</button>
  </div>
  <div class="feedback-thanks" style="display: none;">
    Thank you for your feedback! 🙏
  </div>
</div>

<style>
.feedback-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 16px 20px;
  font-size: 14px;
  max-width: 300px;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.feedback-prompt {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
}

.feedback-btn {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  transition: all 0.2s;
  font-size: 14px;
  color: #1a1a1a;
}

.feedback-btn:hover {
  background: #f5f5f7;
  border-color: #1a73e8;
}

.feedback-btn:focus {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
}

.feedback-followup textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 12px 0 8px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  min-height: 60px;
}

.feedback-followup textarea:focus {
  outline: 2px solid #1a73e8;
  border-color: #1a73e8;
}

.feedback-submit,
.feedback-skip {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  margin-right: 8px;
  transition: all 0.2s;
}

.feedback-submit {
  background: #1a73e8;
  color: white;
}

.feedback-submit:hover {
  background: #1557b0;
}

.feedback-skip {
  background: transparent;
  color: #666;
}

.feedback-skip:hover {
  background: #f5f5f7;
}

.feedback-thanks {
  color: #1a73e8;
  font-weight: 500;
}

@media (max-width: 768px) {
  .feedback-widget {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feedback-widget {
    transition: none;
  }
}
</style>

<script>
(function() {
  // Show widget after 10 seconds on page
  setTimeout(function() {
    const widget = document.getElementById('feedback-widget');
    if (widget && !sessionStorage.getItem('feedback_submitted')) {
      widget.style.display = 'block';
    }
  }, 10000);

  const widget = document.getElementById('feedback-widget');
  if (!widget) return;

  const buttons = widget.querySelectorAll('.feedback-btn');
  const followup = widget.querySelector('.feedback-followup');
  const thanks = widget.querySelector('.feedback-thanks');
  const submitBtn = widget.querySelector('.feedback-submit');
  const skipBtn = widget.querySelector('.feedback-skip');
  const textarea = widget.querySelector('textarea');

  let selectedRating = null;

  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      selectedRating = this.dataset.rating;

      // Track initial rating
      if (typeof gtag !== 'undefined') {
        gtag('event', 'feedback_rating', {
          'rating': selectedRating,
          'page_variant': document.body.dataset.variant || 'control',
          'page_path': window.location.pathname
        });
      }

      // Show followup
      widget.querySelector('.feedback-buttons').style.display = 'none';
      widget.querySelector('.feedback-prompt').textContent = 'Tell us more:';
      followup.style.display = 'block';
      textarea.focus();
    });
  });

  submitBtn.addEventListener('click', function() {
    const comment = textarea.value.trim();

    // Track detailed feedback
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feedback_comment', {
        'rating': selectedRating,
        'has_comment': comment.length > 0,
        'comment_length': comment.length,
        'page_variant': document.body.dataset.variant || 'control',
        'page_path': window.location.pathname
      });
    }

    // Log feedback (in production, send to backend)
    console.log('User Feedback:', {
      rating: selectedRating,
      comment: comment,
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });

    sessionStorage.setItem('feedback_submitted', 'true');
    showThanks();
  });

  skipBtn.addEventListener('click', function() {
    sessionStorage.setItem('feedback_submitted', 'true');
    showThanks();
  });

  function showThanks() {
    followup.style.display = 'none';
    widget.querySelector('.feedback-prompt').style.display = 'none';
    thanks.style.display = 'block';

    setTimeout(() => {
      widget.style.opacity = '0';
      setTimeout(() => widget.style.display = 'none', 300);
    }, 2000);
  }
})();
</script>
`;

function addMonitoringToPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Check if monitoring is already added
    if (content.includes('Google Analytics 4 - Performance Monitoring')) {
      log('yellow', `  ⚠ Monitoring already exists in ${fileName}`);
      return false;
    }

    // Add GA4 tracking before </head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${GA4_TRACKING_CODE}\n${WEB_VITALS_CODE}\n</head>`);
    } else {
      log('yellow', `  ⚠ No </head> tag found in ${fileName}`);
      return false;
    }

    // Add feedback widget before </body>
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${FEEDBACK_WIDGET}\n</body>`);
    } else {
      log('yellow', `  ⚠ No </body> tag found in ${fileName}`);
      return false;
    }

    // Write updated content
    fs.writeFileSync(filePath, content);
    log('green', `  ✓ Added monitoring to ${fileName}`);
    return true;

  } catch (error) {
    log('yellow', `  ⚠ Error processing ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

function main() {
  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║     🔍 ADD PERFORMANCE MONITORING TO LANDING PAGES         ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝\n');

  log('cyan', 'This script will add:');
  log('cyan', '  • Google Analytics 4 tracking');
  log('cyan', '  • Core Web Vitals monitoring');
  log('cyan', '  • User feedback widget');
  log('cyan', '  • Event tracking (CTA clicks, scroll depth, time on page)\n');

  const pagesDir = path.join(__dirname, '../pages');

  if (!fs.existsSync(pagesDir)) {
    log('yellow', '⚠ Pages directory not found. Creating...');
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  const htmlFiles = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(pagesDir, file));

  if (htmlFiles.length === 0) {
    log('yellow', '⚠ No HTML files found in pages/ directory\n');
    return;
  }

  log('blue', `Found ${htmlFiles.length} HTML files to process:\n`);

  let updated = 0;
  let skipped = 0;

  htmlFiles.forEach(file => {
    if (addMonitoringToPage(file)) {
      updated++;
    } else {
      skipped++;
    }
  });

  log('bright', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('bright', '  SUMMARY');
  log('bright', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  log('green', `✓ Updated: ${updated} files`);
  log('yellow', `⚠ Skipped: ${skipped} files\n`);

  if (updated > 0) {
    log('cyan', 'NEXT STEPS:\n');
    log('cyan', '1. Replace "G-XXXXXXXXXX" with your actual Google Analytics 4 ID');
    log('cyan', '2. Test the pages locally to verify tracking works');
    log('cyan', '3. Check GA4 real-time reports to see events coming in');
    log('cyan', '4. Deploy to production\n');

    log('blue', 'To test locally:');
    log('blue', '  1. Open browser DevTools Console');
    log('blue', '  2. Look for "[Web Vital]" logs');
    log('blue', '  3. Click CTAs and check for event tracking');
    log('blue', '  4. Wait 10 seconds for feedback widget to appear\n');
  }

  log('green', '✅ Performance monitoring setup complete!\n');
}

main();
