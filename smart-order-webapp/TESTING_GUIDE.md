# Testing Guide

This project has two separate testing strategies:

## 🧪 Unit Tests (Jest + React Testing Library)
**Location**: `src/unit-testing/`
**Framework**: Jest + React Testing Library
**Purpose**: Test individual components, utilities, and services

### Run Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run in watch mode
npm run test:unit:watch

# Run with coverage report
npm run test:unit:coverage

# Run specific module (DMS Cleanup)
npm run test:unit:dms
```

### Coverage Report
After running `npm run test:unit:coverage`, open:
```
coverage/lcov-report/index.html
```

### Documentation
- Full Guide: `src/unit-testing/README.md`
- Quick Reference: `src/unit-testing/QUICK_REFERENCE.md`
- Setup Details: `TESTING_SETUP_COMPLETE.md`

---

## 🎭 E2E Tests (Playwright)
**Location**: `tests/`
**Framework**: Playwright
**Purpose**: End-to-end user journey testing

### Run E2E Tests
```bash
# Run all e2e tests (headless)
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Show test report
npm run test:e2e:report
```

### Documentation
- Setup: `tests/BTP_DESTINATION_SETUP.md`
- Results: `tests/TEST_RESULTS_INFO.md`

---

## 📊 When to Use Which?

### Use Unit Tests when:
- Testing component rendering
- Testing utility functions
- Testing form validation
- Testing business logic
- Testing API service calls (mocked)
- Testing Redux reducers/actions
- Quick feedback during development

### Use E2E Tests when:
- Testing complete user workflows
- Testing cross-component interactions
- Testing API integration (real)
- Testing authentication flows
- Testing navigation
- Validating production-like scenarios
- Pre-deployment validation

---

## 🚀 Quick Start

### First Time Setup
```bash
# Install all dependencies
npm install

# Verify unit tests work
npm run test:unit

# Verify e2e tests work (requires app running)
npm run test:e2e
```

### CI/CD Integration
```bash
# In CI pipeline
npm run test:unit:coverage  # Unit tests with coverage
npm run build               # Build the app
npm run test:e2e           # E2E tests
```

---

## 📁 Project Structure

```
smart-order-webapp/
├── src/
│   └── unit-testing/        # Unit tests
│       ├── admin-console/
│       ├── dashboard/
│       ├── document-management/
│       └── sales-order/
├── tests/                   # E2E tests
│   ├── e2e/
│   ├── playwright.config.js
│   └── custom-reporter.js
├── jest.config.js           # Jest config
├── babel.config.cjs         # Babel config
└── package.json            # Test scripts
```

---

## 🔧 Troubleshooting

### Unit Tests Issues
- **"Cannot find module"**: Run `npm install`
- **Tests timeout**: Check async/await usage
- **Mocks not working**: Clear Jest cache: `npx jest --clearCache`

### E2E Tests Issues
- **Browser not launching**: Install browsers: `npx playwright install`
- **Tests failing**: Check if app is running on correct URL
- **Timeout**: Increase timeout in `playwright.config.js`

---

## 📈 Coverage Goals

### Unit Tests
- **Target**: 85-90% coverage
- **Current**: DMS Cleanup module at 90%+

### E2E Tests
- **Coverage**: Critical user paths
- **Focus**: Happy paths + error scenarios

---

**Need Help?**
- Unit Tests: See `src/unit-testing/README.md`
- E2E Tests: See `tests/TEST_RESULTS_INFO.md`
