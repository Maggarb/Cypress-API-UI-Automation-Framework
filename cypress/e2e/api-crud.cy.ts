// ============================================================
// API TESTS — POST, PUT, PATCH, DELETE
// ============================================================

describe('API — POST / PUT / PATCH / DELETE', () => {

  // ── CREATE ─────────────────────────────────────────────────

  it('TC-009: POST /posts creates a new post', () => {
    cy.request({
      method: 'POST',
      url: '/posts',
      body: {
        title: 'Cypress test post',
        body: 'This is a test',
        userId: 1,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.title).to.equal('Cypress test post');
      expect(response.body.body).to.equal('This is a test');
      expect(response.body).to.have.property('id');
    });
  });

  it('TC-010: POST /posts returns created id', () => {
    cy.request({
      method: 'POST',
      url: '/posts',
      body: {
        title: 'Another post',
        body: 'Testing timestamp-like behavior',
        userId: 1,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
    });
  });

  // ── UPDATE (PUT) ────────────────────────────────────────────

  it('TC-011: PUT /posts/:id updates a post', () => {
    cy.request({
      method: 'PUT',
      url: '/posts/1',
      body: {
        id: 1,
        title: 'Updated title',
        body: 'Updated body',
        userId: 1,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal('Updated title');
      expect(response.body).to.have.property('id', 1);
    });
  });

  // ── PATCH ──────────────────────────────────────────────────

  it('TC-012: PATCH /posts/:id partially updates a post', () => {
    cy.request({
      method: 'PATCH',
      url: '/posts/1',
      body: { title: 'Patched title' },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal('Patched title');
    });
  });

  // ── DELETE ─────────────────────────────────────────────────

  it('TC-013: DELETE /posts/:id returns 200', () => {
    cy.request({
      method: 'DELETE',
      url: '/posts/1',
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });

});

it('TC-014: POST /posts returns created resource', () => {
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {
      title: 'foo',
      body: 'bar',
      userId: 1,
    },
  }).then((response) => {
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    expect(response.body.title).to.equal('foo');
  });
});

it('TC-015: POST /posts missing fields still returns response', () => {
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {},
  }).then((response) => {
    expect(response.status).to.equal(201);
  });
});

it('TC-016: PUT /posts/1 updates post', () => {
  cy.request({
    method: 'PUT',
    url: '/posts/1',
    body: {
      id: 1,
      title: 'updated',
      body: 'updated body',
      userId: 1,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body.title).to.equal('updated');
  });
});

it('TC-017: DELETE /posts/1 returns empty object', () => {
  cy.request({
    method: 'DELETE',
    url: '/posts/1',
  }).then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.be.empty;
  });
});
