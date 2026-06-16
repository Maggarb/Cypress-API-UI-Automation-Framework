// ============================================================
// API TESTS — POST, PUT, PATCH, DELETE
//
// These cover the full CRUD lifecycle of the users API.
// We use fixtures (cypress/fixtures/users.json) for test data
// so the data is separated from the test logic.
// ============================================================

describe('API — POST / PUT / PATCH / DELETE', () => {

  // Load fixture data before all tests in this block
  let testData: {
    createUser: { name: string; job: string };
    updateUser: { name: string; job: string };
    invalidLogin: { email: string; password: string };
    missingPassword: { email: string };
  };

  before(() => {
    cy.fixture('users').then((data) => {
      testData = data;
    });
  });

  // ── CREATE ─────────────────────────────────────────────────

  it('TC-009: POST /api/users creates a new user and returns 201', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: testData.createUser,
    }).then((response) => {
      expect(response.status).to.equal(201);

      // Response must echo back what we sent
      expect(response.body.name).to.equal(testData.createUser.name);
      expect(response.body.job).to.equal(testData.createUser.job);

      // Server should assign an ID and timestamp
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });
  });

  it('TC-010: POST /api/users — createdAt is a valid ISO timestamp', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: testData.createUser,
    }).then((response) => {
      const timestamp = new Date(response.body.createdAt);
      expect(timestamp.toString()).not.to.equal('Invalid Date');
    });
  });

  // ── UPDATE (PUT) ────────────────────────────────────────────

  it('TC-011: PUT /api/users/:id fully updates a user and returns 200', () => {
    cy.request({
      method: 'PUT',
      url: '/api/users/2',
      body: testData.updateUser,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal(testData.updateUser.name);
      expect(response.body.job).to.equal(testData.updateUser.job);
      expect(response.body).to.have.property('updatedAt');
    });
  });

  // ── UPDATE (PATCH) ──────────────────────────────────────────

  it('TC-012: PATCH /api/users/:id partially updates a user', () => {
    cy.request({
      method: 'PATCH',
      url: '/api/users/2',
      body: { job: 'Lead QA Engineer' },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.job).to.equal('Lead QA Engineer');
      expect(response.body).to.have.property('updatedAt');
    });
  });

  // ── DELETE ─────────────────────────────────────────────────

  it('TC-013: DELETE /api/users/:id returns 204 No Content', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/users/2',
    }).then((response) => {
      // 204 means success with no body
      expect(response.status).to.equal(204);
      expect(response.body).to.be.empty;
    });
  });

  // ── AUTH ───────────────────────────────────────────────────

  it('TC-014: POST /api/login with valid credentials returns token', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string').and.not.be.empty;
    });
  });

  it('TC-015: POST /api/login without password returns 400 with error', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: testData.missingPassword,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'Missing password');
    });
  });

  it('TC-016: POST /api/register with valid data returns id and token', () => {
    cy.request({
      method: 'POST',
      url: '/api/register',
      body: {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('token');
    });
  });

  it('TC-017: POST /api/register without password returns 400', () => {
    cy.request({
      method: 'POST',
      url: '/api/register',
      body: { email: 'sydney@fife' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('Missing password');
    });
  });

});
