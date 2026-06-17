#  Cypress API & UI Test Suite

![Cypress Tests](https://github.com/Maggarb/Cypress-API-UI-Automation-Framework/actions/workflows/cypress.yml/badge.svg)

API and network interception test suite built with **Cypress** and **TypeScript**, testing [JSONPlaceholder](https://jsonplaceholder.typicode.com) — a free public REST API. Demonstrates API testing, response validation, network stubbing, and data-driven testing.

---

## 🗂️ Project Structure

```
Cypress-API-UI-Automation-Framework/
├── cypress/
│   ├── e2e/
│   │   ├── api-get.cy.ts              # GET request tests
│   │   ├── api-crud.cy.ts             # POST/PUT/PATCH/DELETE tests
│   │   ├── network-interception.cy.ts # cy.intercept() stub & spy
│   │   └── data-driven.cy.ts          # Parameterised tests
│   ├── fixtures/
│   │   └── posts.json                 # Centralised test data
│   └── support/
│       ├── commands.ts                # Custom Cypress commands
│       └── e2e.ts                     # Global setup
├── .github/workflows/
│   └── cypress.yml                    # CI pipeline
└── cypress.config.ts                  # Cypress configuration
```

---

## ✅ Test Coverage

| File | Focus | Techniques |
|------|-------|-----------|
| `api-get.cy.ts` | GET `/posts`, `/comments`, `/users` | Schema validation, filtering, response time |
| `api-crud.cy.ts` | POST/PUT/PATCH/DELETE on `/posts` | Full CRUD, status codes, payload validation |
| `network-interception.cy.ts` | Stubbing & spying | Empty states, 500 errors, slow network simulation |
| `data-driven.cy.ts` | Parameterised scenarios | Loops over multiple IDs and inputs |

Covers GET, POST, PUT, PATCH, DELETE, and network edge cases across the `/posts`, `/comments`, and `/users` endpoints.

---

##  Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Maggarb/Cypress-API-UI-Automation-Framework.git
cd Cypress-API-UI-Automation-Framework
npm install
```

### Running Tests

```bash
# Run all tests headlessly (CI mode)
npm test

# Open Cypress interactive UI
npm run test:open

# Run specific spec file
npm run test:api-get
npm run test:api-crud
npm run test:intercept
npm run test:data-driven
```

---

##  Key Techniques Demonstrated

**API Testing with `cy.request()`**
Direct HTTP requests to REST endpoints — faster and more stable than UI-driven tests. Validates status codes, response schemas, and headers.

**Network Interception with `cy.intercept()`**
Stubs API responses to simulate edge cases (empty states, 500 errors, slow networks) without needing the backend to actually be broken. Essential for testing error handling in real applications.

**Data-Driven Testing**
Parameterised test loops that run the same test logic across multiple inputs. Reduces duplication and makes adding new test cases trivial.

**Custom Commands**
Reusable commands that abstract common actions — the Cypress equivalent of Page Object Model.

**Fixtures**
Test data stored in `cypress/fixtures/` and loaded with `cy.fixture()` — separates data from test logic for cleaner, more maintainable tests.

---

##  Tech Stack

| Tool | Purpose |
|------|---------|
| [Cypress](https://cypress.io) | Test framework |
| TypeScript | Type-safe test code |
| GitHub Actions | CI/CD — runs on every push |
| JSONPlaceholder | Public REST API under test |

---


