// ============================================================
// SUPPORT FILE — runs before every test file
// Import custom commands here so they're always available
// ============================================================

import './commands';

// Global beforeEach — useful for resetting state, logging, etc.
beforeEach(() => {
  // Clear any stored tokens or cookies between tests
  cy.clearCookies();
  cy.clearLocalStorage();
});
