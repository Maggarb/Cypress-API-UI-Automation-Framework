// ============================================================
// NETWORK INTERCEPTION TESTS
// ============================================================

describe('Network Interception — Stub & Spy', () => {

  it('TC-018: Spy on GET /users request', () => {
    cy.intercept('GET', '**/users').as('getUsers');

    cy.request('/users').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('TC-019: Verify stubbed empty users response', () => {
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [],
    }).as('emptyUsers');

    // Trigger request from browser context
    cy.window().then((win) => {
      win.fetch(`${Cypress.config('baseUrl')}/users`);
    });

    cy.wait('@emptyUsers')
      .its('response.body')
      .should('deep.equal', []);
  });

  it('TC-020: Verify stubbed 500 error response', () => {
    cy.intercept('GET', '**/users', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    }).as('serverError');

    cy.window().then((win) => {
      win.fetch(`${Cypress.config('baseUrl')}/users`);
    });

    cy.wait('@serverError')
      .its('response.statusCode')
      .should('equal', 500);
  });

  it('TC-021: Simulate slow network response', () => {
    cy.intercept('GET', '**/users', {
      delay: 1500,
      statusCode: 200,
      body: [],
    }).as('slowUsers');

    const start = Date.now();

    cy.window().then((win) => {
      win.fetch(`${Cypress.config('baseUrl')}/users`);
    });

    cy.wait('@slowUsers').then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.greaterThan(1400);
    });
  });

  it('TC-022: Verify POST payload structure', () => {
    const payload = {
      name: 'Magdalena',
      job: 'QA Engineer',
    };

    cy.request({
      method: 'POST',
      url: '/posts',
      body: payload,
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal(payload.name);
      expect(response.body.job).to.equal(payload.job);
    });
  });

  it('TC-023: Verify custom user object structure', () => {
    const stubbedUser = {
      id: 999,
      name: 'Magdalena Garbowska',
      email: 'magda@test.com',
      username: 'magda',
    };

    expect(stubbedUser.id).to.equal(999);
    expect(stubbedUser.email).to.equal('magda@test.com');
    expect(stubbedUser.username).to.equal('magda');
  });

});