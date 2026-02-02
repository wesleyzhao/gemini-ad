
/**
 * Client-Side A/B Testing Router
 * Automatically routes users to appropriate test variant
 */
(function() {
  const testConfig = {
  "testName": "personalization-urgency-combo",
  "testPages": [
    "pages/writers.html",
    "pages/creators.html",
    "pages/operators.html",
    "pages/automators.html"
  ],
  "trafficSplit": {
    "control": 0.33,
    "variantA": 0.33,
    "variantB": 0.34
  },
  "testDuration": "14 days",
  "primaryMetric": "conversion_rate",
  "secondaryMetrics": [
    "time_on_page",
    "scroll_depth",
    "cta_clicks"
  ]
};

  // Check if user already has variant assigned
  let variant = localStorage.getItem('ab_test_' + testConfig.testName);

  if (!variant) {
    // Assign new variant based on traffic split
    const rand = Math.random();
    if (rand < testConfig.trafficSplit.control) {
      variant = 'control';
    } else if (rand < testConfig.trafficSplit.control + testConfig.trafficSplit.variantA) {
      variant = 'variantA';
    } else {
      variant = 'variantB';
    }

    // Store assignment
    localStorage.setItem('ab_test_' + testConfig.testName, variant);
  }

  // Route to appropriate variant
  const currentPage = window.location.pathname.split('/').pop();
  if (testConfig.testPages.includes(currentPage)) {
    if (variant !== 'control') {
      const variantPath = currentPage.replace('.html', '-' + variant + '.html');
      if (window.location.pathname !== '/' + variantPath) {
        window.location.href = variantPath;
      }
    }
  }

  console.log('[A/B Test Router] Test:', testConfig.testName, 'Variant:', variant);
})();
