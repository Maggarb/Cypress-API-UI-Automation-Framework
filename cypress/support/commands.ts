// ============================================================
// CUSTOM CYPRESS COMMANDS
//
// Custom commands extend Cypress with your own reusable actions.
// Instead of writing cy.request(...) everywhere, you write
// cy.apiLogin(email, password) — cleaner and reusable.
//
// This is the Cypress equivalent of Page Object Model.
// ============================================================

// Declare custom commands for TypeScript autocomplete
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login via API and return the token
       * @example cy.apiLogin('email@test.com', 'password')
       */
      apiLogin(email: string, password: string): Chainable<string>;

      /**
       * Create a user via API and return the created user data
       * @example cy.createUser({ name: 'Magda', job: 'QA' })
       */
      createUser(userData: { name: string; job: string }): Chainable<{ id: string; name: string; job: string }>;

      /**
       * Assert that a response has a specific status code
       * @example cy.wrap(response).shouldHaveStatus(200)
       */
      shouldHaveStatus(statusCode: number): Chainable<Cypress.Response<unknown>>;
    }
  }
}

// LOGIN command — makes a POST request to /api/login
// Returns the token so tests can use it for authenticated requests
Cypress.Commands.add('apiLogin', (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: '/api/login',
    body: { email, password },
    failOnStatusCode: false, // Don't fail on 4xx — we want to assert the error ourselves
  }).then((response) => {
    return response.body.token;
  });
});

// CREATE USER command — makes a POST to /api/users
Cypress.Commands.add('createUser', (userData: { name: string; job: string }) => {
  return cy.request({
    method: 'POST',
    url: '/api/users',
    body: userData,
  }).then((response) => {
    return response.body;
  });
});

// STATUS CODE assertion — chainable helper
Cypress.Commands.add(
  'shouldHaveStatus',
  { prevSubject: true },
  (response: Cypress.Response<unknown>, statusCode: number) => {
    expect(response.status).to.equal(statusCode);
    return cy.wrap(response);
  }
);

export {};
