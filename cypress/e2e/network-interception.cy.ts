// ============================================================
// NETWORK INTERCEPTION TESTS
//
// This is one of Cypress's most powerful features — cy.intercept()
// lets you:
// 1. SPY on API calls made by the UI (verify the app calls the right endpoint)
// 2. STUB responses (return fake data to test UI edge cases)
// 3. DELAY responses (test loading states)
//
// This is exactly what real QA teams do to test error states,
// loading spinners, empty states, and network failures —
// without needing the backend to actually be broken.
// ============================================================

describe('Network Interception — Stub & Spy', () => {

  it('TC-018: Intercept and verify app calls /api/users on load', () => {
    // Set up intercept BEFORE visiting the page
    cy.intercept('GET', '/api/users*').as('getUsers');

    cy.visit('/api/users');

    // Wait for the intercepted call and assert on it
    cy.wait('@getUsers').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.request.url).to.include('/api/users');
    });
  });

  it('TC-019: Stub API to return empty list — UI handles empty state', () => {
    // Override the real API response with our fake one
    cy.intercept('GET', '/api/users*', {
      statusCode: 200,
      body: {
        page: 1,
        per_page: 6,
        total: 0,
        total_pages: 0,
        data: [],  // Empty list
      },
    }).as('emptyUsers');

    cy.visit('/api/users');
    cy.wait('@emptyUsers');

    // The stub worked — response has empty data
    cy.get('@emptyUsers').its('response.body.data').should('have.length', 0);
  });

  it('TC-020: Stub API to return 500 error — app handles server errors', () => {
    cy.intercept('GET', '/api/users*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('serverError');

    cy.visit('/api/users');
    cy.wait('@serverError');

    cy.get('@serverError').its('response.statusCode').should('equal', 500);
  });

  it('TC-021: Stub API to simulate slow network (1500ms delay)', () => {
    cy.intercept('GET', '/api/users*', (req) => {
      // Add a 1500ms delay to simulate slow network
      req.reply((res) => {
        res.setDelay(1500);
        res.send({ statusCode: 200 });
      });
    }).as('slowResponse');

    const start = Date.now();
    cy.visit('/api/users');

    cy.wait('@slowResponse').then(() => {
      const duration = Date.now() - start;
      // Response should have taken at least 1500ms
      expect(duration).to.be.greaterThan(1500);
    });
  });

  it('TC-022: Intercept POST and verify correct request body is sent', () => {
    const expectedBody = { name: 'Magdalena', job: 'QA Engineer' };

    cy.intercept('POST', '/api/users', (req) => {
      // Assert on the outgoing request body
      expect(req.body.name).to.equal(expectedBody.name);
      expect(req.body.job).to.equal(expectedBody.job);

      // Let the real request go through
      req.continue();
    }).as('createUser');

    // Make the actual request
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: expectedBody,
    });

    cy.wait('@createUser');
  });

  it('TC-023: Stub single user endpoint with custom data', () => {
    const stubbedUser = {
      data: {
        id: 999,
        email: 'magda@test.com',
        first_name: 'Magdalena',
        last_name: 'Garbowska',
        avatar: 'https://reqres.in/img/faces/999-image.jpg',
      },
    };

    cy.intercept('GET', '/api/users/999', {
      statusCode: 200,
      body: stubbedUser,
    }).as('customUser');

    cy.request({
      method: 'GET',
      url: '/api/users/999',
      failOnStatusCode: false,
    });

    cy.wait('@customUser').its('response.body.data.email').should('equal', 'magda@test.com');
  });

});
