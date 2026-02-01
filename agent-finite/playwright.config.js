// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for Gemini Ads Landing Pages
 *
 * This config supports:
 * - Multi-browser testing (Chromium, Firefox, WebKit)
 * - Multiple viewport sizes (mobile, tablet, desktop)
 * - Screenshot generation and visual regression testing
 * - Local development server integration
 * - Parallel test execution
 * - HTML report generation
 */

module.exports = defineConfig({
  // Test directory
  testDir: './tests',

  // Maximum time one test can run for (30 seconds)
  timeout: 30 * 1000,

  // Test file pattern
  testMatch: '**/*.spec.js',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI (can be resource-intensive)
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL for the local server
    baseURL: 'http://localhost:8080',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Maximum time each action can take (10 seconds)
    actionTimeout: 10 * 1000,

    // Browser context options
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
  },

  // Configure projects for major browsers and viewports
  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Tablet viewports
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },
    {
      name: 'tablet-landscape',
      use: {
        ...devices['iPad Pro landscape'],
        viewport: { width: 1366, height: 1024 },
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13 Pro'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'mobile-samsung',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 412, height: 846 },
      },
    },

    // Additional responsive breakpoint tests
    {
      name: 'small-mobile',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'large-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 },
      },
    },

    // Screenshot-specific projects (headless only)
    {
      name: 'screenshot-mobile',
      use: {
        ...devices['iPhone 13 Pro'],
        viewport: { width: 375, height: 812 },
      },
      testMatch: '**/*screenshot*.spec.js',
    },
    {
      name: 'screenshot-tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 768, height: 1024 },
      },
      testMatch: '**/*screenshot*.spec.js',
    },
    {
      name: 'screenshot-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*screenshot*.spec.js',
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npx http-server . -p 8080',
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Global setup/teardown
  // globalSetup: require.resolve('./tests/global-setup.js'),
  // globalTeardown: require.resolve('./tests/global-teardown.js'),

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results/artifacts',

  // Snapshot path template
  snapshotPathTemplate: 'tests/__snapshots__/{testFilePath}/{arg}{ext}',

  // Update snapshots if they don't exist
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true' ? 'all' : 'missing',
});
