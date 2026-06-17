// ============================================================
// API TESTS — GET Requests
//
// These test the reqres.in REST API directly using cy.request()
// No browser UI involved 
// ============================================================

describe('API — GET Requests', () => {

  // ── Users ──────────────────────────────────────────────────

  it('TC-001: GET /users returns 200 with list', () => {
    cy.request('GET', '/users?page=1').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('TC-002: GET /users — each user has correct schema', () => {
    cy.request('GET', '/users').then((response) => {
      const users = response.body;

      users.forEach((user: any) => {
        expect(user).to.have.property('id').that.is.a('number');
        expect(user).to.have.property('name').that.is.a('string');
        expect(user).to.have.property('username').that.is.a('string');
        expect(user).to.have.property('email').that.includes('@');
        expect(user).to.have.property('address');
      });
    });
  });

  it('TC-003: GET /users/:id returns single user', () => {
    cy.request('GET', '/users/2').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id', 2);
      expect(response.body).to.have.property('email');
      expect(response.body).to.have.property('name');
    });
  });

  it('TC-004: GET /users/:id returns 404 for non-existent user', () => {
    cy.request({
      method: 'GET',
      url: '/users/9999',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body).to.be.empty;
    });
  });

  it('TC-005: GET /users returns consistent but valid data', () => {
  cy.request('GET', '/users').then((r1) => {
    const ids = r1.body.map((u: any) => u.id);

    expect(ids.length).to.equal(10);
    expect(new Set(ids).size).to.equal(10); // no duplicates
  });
});

  // ── Posts (replaces /unknown) ──────────────────────────────

  it('TC-006: GET /posts returns list of resources', () => {
    cy.request('GET', '/posts').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('TC-007: GET /posts/:id returns single resource', () => {
    cy.request('GET', '/posts/2').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('id', 2);
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('body');
    });
  });

  // ── Performance ────────────────────────────────────────────

  it('TC-008: Response time is under 3 seconds', () => {
    cy.request('GET', '/users').then((response) => {
      expect(response.duration).to.be.lessThan(3000);
    });
  });

});