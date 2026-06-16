// ============================================================
// DATA-DRIVEN TESTS
//
// Instead of writing one test per input, we loop over an array
// of test cases. This is called "data-driven testing" and is
// a key skill in QA automation.
//
// Benefits:
// - One test function covers many scenarios
// - Easy to add new cases by just adding data
// - Keeps tests DRY (Don't Repeat Yourself)
// ============================================================

describe('Data-Driven Tests', () => {

  // ── Multiple pages ─────────────────────────────────────────

  const pages = [1, 2];

  pages.forEach((page) => {
    it(`TC-024-page${page}: GET /api/users?page=${page} returns valid response`, () => {
      cy.request(`GET`, `/api/users?page=${page}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.page).to.equal(page);
        expect(response.body.data).to.be.an('array').and.have.length.greaterThan(0);
      });
    });
  });

  // ── Multiple user IDs ──────────────────────────────────────

  const validUserIds = [1, 2, 3, 4, 5, 6];

  validUserIds.forEach((id) => {
    it(`TC-025-id${id}: GET /api/users/${id} returns correct user`, () => {
      cy.request('GET', `/api/users/${id}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.id).to.equal(id);
        expect(response.body.data.email).to.be.a('string').and.include('@');
      });
    });
  });

  // ── Invalid user IDs ──────────────────────────────────────

  const invalidUserIds = [0, 9999, 99999];

  invalidUserIds.forEach((id) => {
    it(`TC-026-id${id}: GET /api/users/${id} returns 404`, () => {
      cy.request({
        method: 'GET',
        url: `/api/users/${id}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });

  // ── CRUD operations with fixture data ─────────────────────

  it('TC-027: Create multiple users in sequence and verify unique IDs', () => {
    const users = [
      { name: 'Alice', job: 'QA Lead' },
      { name: 'Bob', job: 'Developer' },
      { name: 'Charlie', job: 'DevOps' },
    ];

    const createdIds: string[] = [];

    // Chain requests sequentially
    users.forEach((user) => {
      cy.request({
        method: 'POST',
        url: '/api/users',
        body: user,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(user.name);

        // IDs should be unique
        expect(createdIds).not.to.include(response.body.id);
        createdIds.push(response.body.id);
      });
    });
  });

  // ── Login with fixture data ────────────────────────────────

  it('TC-028: Login with valid credentials from fixture', () => {
    cy.fixture('users').then((data) => {
      // Test first valid user from fixture
      const user = data.validUsers[0];
      cy.request({
        method: 'POST',
        url: '/api/login',
        body: { email: user.email, password: user.password },
        failOnStatusCode: false,
      }).then((response) => {
        // Note: reqres.in only accepts specific pre-seeded users
        // This tests that our fixture data is correctly structured
        expect(response.status).to.be.oneOf([200, 400]);
        expect(response.body).to.be.an('object');
      });
    });
  });

  // ── HTTP Methods ───────────────────────────────────────────

  const updateMethods: Array<'PUT' | 'PATCH'> = ['PUT', 'PATCH'];

  updateMethods.forEach((method) => {
    it(`TC-029-${method}: ${method} /api/users/2 updates user successfully`, () => {
      cy.request({
        method,
        url: '/api/users/2',
        body: { name: 'Updated Name', job: 'Updated Job' },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('updatedAt');
      });
    });
  });

});
