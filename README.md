# Cypress API & UI Test Suite

![Cypress Tests](https://github.com/Maggarb/cypress-api-tests/actions/workflows/cypress.yml/badge.svg)

API and network interception test suite built with **Cypress** and **TypeScript**, testing the [reqres.in](https://reqres.in) REST API. Demonstrates API testing, response validation, network stubbing, and data-driven testing.

---

## 🗂️ Project Structure

```
cypress-api-tests/
├── cypress/
│   ├── e2e/
│   │   ├── api-get.cy.ts              # GET request tests (8 cases)
│   │   ├── api-crud.cy.ts             # POST/PUT/PATCH/DELETE tests (9 cases)
│   │   ├── network-interception.cy.ts # cy.intercept() stub & spy (6 cases)
│   │   └── data-driven.cy.ts          # Parameterised tests (6 test groups)
│   ├── fixtures/
│   │   └── users.json                 # Centralised test data
│   └── support/
│       ├── commands.ts                # Custom Cypress commands
│       └── e2e.ts                     # Global setup
├── .github/workflows/
│   └── cypress.yml                    # CI pipeline
└── cypress.config.ts                  # Cypress configuration
```

---

## ✅ Test Coverage

| File | Test Cases | Techniques |
|------|-----------|-----------|
| `api-get.cy.ts` | TC-001 to TC-008 | Schema validation, pagination, response time |
| `api-crud.cy.ts` | TC-009 to TC-017 | Full CRUD, auth, error handling |
| `network-interception.cy.ts` | TC-018 to TC-023 | Stubbing, spying, delay simulation |
| `data-driven.cy.ts` | TC-024 to TC-029 | Parameterised loops, fixture-driven |

**Total: 30+ test scenarios** covering GET, POST, PUT, PATCH, DELETE, auth, and network edge cases.

---

##  Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Maggarb/cypress-api-tests.git
cd cypress-api-tests
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
Reusable commands (`cy.apiLogin()`, `cy.createUser()`) that abstract common actions — the Cypress equivalent of Page Object Model.

**Fixtures**
Test data stored in `cypress/fixtures/users.json` and loaded with `cy.fixture()` — separates data from test logic for cleaner, more maintainable tests.

---

##  Tech Stack

| Tool | Purpose |
|------|---------|
| [Cypress](https://cypress.io) | Test framework |
| TypeScript | Type-safe test code |
| GitHub Actions | CI/CD — runs on every push |
| reqres.in | Public REST API under test |

---

