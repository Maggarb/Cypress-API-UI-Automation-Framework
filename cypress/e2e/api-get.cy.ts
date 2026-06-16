// ============================================================
// API TESTS — GET Requests
//
// These test the reqres.in REST API directly using cy.request()
// No browser UI involved — pure API testing.
//
// Why test APIs separately from UI?
// - Faster (no browser rendering)
// - More stable (no flaky selectors)
// - Catches backend bugs before the UI even loads
// ============================================================

describe('API — GET Requests', () => {

  // ── Users ──────────────────────────────────────────────────

  it('TC-001: GET /api/users returns 200 with paginated list', () => {
    cy.request('GET', '/api/users?page=1').then((response) => {
      // Status code
      expect(response.status).to.equal(200);

      // Response structure
      expect(response.body).to.have.property('page', 1);
      expect(response.body).to.have.property('per_page');
      expect(response.body).to.have.property('total');
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
    });
  });

  it('TC-002: GET /api/users — each user has correct schema', () => {
    cy.request('GET', '/api/users?page=1').then((response) => {
      const users = response.body.data;

      // Every user must have these fields with correct types
      users.forEach((user: { id: number; email: string; first_name: string; last_name: string; avatar: string }) => {
        expect(user).to.have.property('id').that.is.a('number');
        expect(user).to.have.property('email').that.includes('@');
        expect(user).to.have.property('first_name').that.is.a('string');
        expect(user).to.have.property('last_name').that.is.a('string');
        expect(user).to.have.property('avatar').that.includes('https');
      });
    });
  });

  it('TC-003: GET /api/users/:id returns single user', () => {
    cy.request('GET', '/api/users/2').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data.id).to.equal(2);
      expect(response.body.data).to.have.property('email');
      expect(response.body.data).to.have.property('first_name');
    });
  });

  it('TC-004: GET /api/users/:id returns 404 for non-existent user', () => {
    cy.request({
      method: 'GET',
      url: '/api/users/9999',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({});
    });
  });

  it('TC-005: GET /api/users page 2 returns different users than page 1', () => {
    let page1Ids: number[] = [];

    cy.request('GET', '/api/users?page=1').then((r1) => {
      page1Ids = r1.body.data.map((u: { id: number }) => u.id);

      cy.request('GET', '/api/users?page=2').then((r2) => {
        const page2Ids = r2.body.data.map((u: { id: number }) => u.id);
        // No IDs should overlap between pages
        const overlap = page1Ids.filter(id => page2Ids.includes(id));
        expect(overlap).to.have.length(0);
      });
    });
  });

  // ── Resources ──────────────────────────────────────────────

  it('TC-006: GET /api/unknown returns list of resources', () => {
    cy.request('GET', '/api/unknown').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
    });
  });

  it('TC-007: GET /api/unknown/:id returns single resource', () => {
    cy.request('GET', '/api/unknown/2').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('id', 2);
      expect(response.body.data).to.have.property('name');
      expect(response.body.data).to.have.property('color');
    });
  });

  it('TC-008: Response time is under 3 seconds', () => {
    const start = Date.now();
    cy.request('GET', '/api/users').then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(3000);
    });
  });

});
