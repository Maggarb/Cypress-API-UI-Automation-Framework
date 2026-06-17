import { defineConfig } from 'cypress';

export default defineConfig({
  // ============================================================
  // CYPRESS CONFIGURATION
  // ============================================================

  e2e: {
    // Base URL for the app under test
    baseUrl: 'https://jsonplaceholder.typicode.com',

    // Where spec files live
    specPattern: 'cypress/e2e/**/*.cy.ts',

    // Support file (custom commands, global setup)
    supportFile: 'cypress/support/e2e.ts',

    // Default timeout for commands (ms)
    defaultCommandTimeout: 10000,

    // Default timeout for page loads
    pageLoadTimeout: 30000,

    // Viewport size
    viewportWidth: 1280,
    viewportHeight: 720,

    // Keep videos off for speed (enable for debugging)
    video: false,

    // Screenshot on failure
    screenshotOnRunFailure: true,

    // Retry failed tests once in CI
    retries: {
      runMode: 1,    // CI
      openMode: 0,   // interactive
    },

    setupNodeEvents(on, config) {
      // Node event listeners go here if needed
      return config;
    },
  },
});
