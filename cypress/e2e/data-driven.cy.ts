// ============================================================
// DATA-DRIVEN TESTS (FIXED FOR JSONPLACEHOLDER)
// ============================================================

describe('Data-Driven Tests', () => {

  // ── Multiple pages ─────────────────────────────────────────

  const pages = [1, 2];

  pages.forEach((page) => {
    it(`TC-024-page${page}: GET /users?page=${page} returns valid response`, () => {
      cy.request({
        method: 'GET',
        url: `/users?_page=${page}&_limit=5`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  });

  // ── Multiple user IDs ──────────────────────────────────────

  const validUserIds = [1, 2, 3, 4, 5, 6];

  validUserIds.forEach((id) => {
    it(`TC-025-id${id}: GET /users/${id} returns correct user`, () => {
      cy.request('GET', `/users/${id}`).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(id);
        expect(response.body.email).to.be.a('string').and.include('@');
      });
    });
  });

// ── Invalid user IDs ──────────────────────────────────────
// JSONPlaceholder returns 404 for non-existent users

const invalidUserIds = [9999, 99999];

invalidUserIds.forEach((id) => {
  it(`TC-026-id${id}: GET /users/${id} returns 404`, () => {
    cy.request({
      method: 'GET',
      url: `/users/${id}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({});
    });
  });
});
  

  // ── CREATE multiple posts ─────────────────────────────────

  it('TC-027: Create multiple posts and verify responses', () => {
    const posts = [
      { title: 'Alice', body: 'QA Lead', userId: 1 },
      { title: 'Bob', body: 'Developer', userId: 1 },
      { title: 'Charlie', body: 'DevOps', userId: 1 },
    ];

    const ids: number[] = [];

    posts.forEach((post) => {
      cy.request({
        method: 'POST',
        url: '/posts',
        body: post,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(post.title);

        // JSONPlaceholder always returns id = 101 (mock API limitation)
        expect(response.body).to.have.property('id');

        ids.push(response.body.id);
      });
    });
  });

  // ── POST validation ───────────────────────────────────────

  it('TC-028: POST /posts returns created object', () => {
    cy.request({
      method: 'POST',
      url: '/posts',
      body: {
        title: 'test user',
        body: 'test body',
        userId: 1,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.equal('test user');
    });
  });

  // ── HTTP Methods ───────────────────────────────────────────

  const updateMethods: Array<'PUT' | 'PATCH'> = ['PUT', 'PATCH'];

  updateMethods.forEach((method) => {
    it(`TC-029-${method}: ${method} /posts/1 updates post successfully`, () => {
      cy.request({
        method,
        url: '/posts/1',
        body: {
          title: 'Updated Title',
          body: 'Updated Body',
          userId: 1,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('Updated Title');
      });
    });
  });

});