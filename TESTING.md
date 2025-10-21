# E2E Testing Guide - Pintu Kerja

This document provides a comprehensive guide for the Playwright-based E2E testing framework for the Pintu Kerja job board application.

## 📋 Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Scenarios](#test-scenarios)
- [Writing Tests](#writing-tests)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This E2E testing suite uses **Playwright** to test the complete user journey for both job seekers and employers on the Pintu Kerja platform. Tests cover:

- ✅ User registration and authentication
- ✅ Profile management
- ✅ Job posting (free tier + subscription)
- ✅ Job search and application
- ✅ Candidate management
- ✅ Cross-user interactions
- ✅ Performance testing
- ✅ Security validation
- ✅ Edge cases and error handling

## 🚀 Quick Start

### 1. Install Playwright
```bash
npx playwright install
```

### 2. Generate Test Data
```bash
npm run generate:test-data
```

### 3. Start the Application
```bash
npm run dev
```

### 4. Run Tests
```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed
```

## 📁 Test Structure

```
tests/
├── fixtures/
│   └── test-data.ts              # Test users, jobs, and data
├── helpers/
│   ├── auth.helper.ts            # Authentication utilities
│   ├── job.helper.ts             # Job operations
│   └── profile.helper.ts         # Profile management
├── utils/
│   └── report-generator.ts       # Test reporting
├── test-data/
│   ├── test-cv.pdf               # Sample CV
│   ├── test-photo.jpg            # Sample photo
│   └── README.md                 # Test data info
├── job-seeker.spec.ts            # Job seeker tests
├── employer.spec.ts              # Employer tests
├── cross-user-interactions.spec.ts  # Multi-user scenarios
├── performance-security.spec.ts  # Performance & security
└── edge-cases.spec.ts            # Edge cases & errors
```

## 🏃 Running Tests

### Basic Commands
```bash
# All tests
npm test

# With UI mode (recommended for development)
npm run test:ui

# Headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# View latest report
npm run test:report
```

### Specific Test Suites
```bash
# Job seeker tests only
npx playwright test job-seeker

# Employer tests only
npx playwright test employer

# Cross-user interactions
npx playwright test cross-user

# Performance tests
npx playwright test performance

# Security tests
npx playwright test security
```

### Specific Browsers
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# All browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

## 🎭 Test Scenarios

### Job Seeker Tests

#### 1. Fresh Graduate Journey
- Complete registration
- Profile setup with CV and photo
- Browse and filter jobs
- Save favorites
- Apply with custom cover letters
- Check application status

#### 2. Experienced Professional
- Quick registration
- Setup job alerts
- Advanced search
- Multiple applications
- Withdraw application
- Mobile responsive testing

#### 3. Job Hopper
- Minimal profile registration
- Apply without complete profile
- Bulk applications (test pagination)
- Search with typos
- Empty result handling

### Employer Tests

#### 1. Startup (Free Tier)
- Company registration
- Complete profile setup
- Post 3 jobs (free slots)
- Review candidates
- Shortlist and reject
- Try 4th job → upgrade prompt ✅

#### 2. Corporate (Premium)
- Bulk job posting
- Edit and close jobs
- View analytics
- Export candidate data
- Upgrade to premium
- Post unlimited jobs
- Test premium features

#### 3. SME
- Error handling
- Save drafts
- Duplicate jobs
- Bulk candidate actions
- Subscription management

### Cross-User Interactions
- Employer posts job
- Multiple job seekers apply
- Employer reviews and shortlists
- Notifications sent to all parties
- Real-time updates
- Withdrawal handling

### Performance Tests
- Load 100+ job listings
- Search with 1000+ results
- Page load < 3 seconds
- 6 concurrent users
- Slow network (3G) simulation

### Security Tests
- SQL Injection prevention
- XSS attack prevention
- File upload validation
- Password strength
- Rate limiting
- Session management
- CSRF protection

## ✍️ Writing Tests

### Basic Test Example
```typescript
import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { JobHelper } from './helpers/job.helper';

test('User can apply to a job', async ({ page }) => {
  const authHelper = new AuthHelper(page);
  const jobHelper = new JobHelper(page);

  // Login
  await authHelper.login('user@email.com', 'password');

  // Search and apply
  await jobHelper.searchJobs('developer');
  await jobHelper.applyToJob('Software Developer', 'I am interested');

  // Verify
  await page.goto('/dashboard/applications');
  await expect(page.getByText('Software Developer')).toBeVisible();
});
```

### Using Test Helpers

```typescript
// Authentication
const authHelper = new AuthHelper(page);
await authHelper.register({ email, password, name, phone, role });
await authHelper.login(email, password);
await authHelper.logout();

// Job Operations
const jobHelper = new JobHelper(page);
await jobHelper.postJob(jobData);
await jobHelper.searchJobs('keyword');
await jobHelper.applyToJob('Job Title', 'Cover letter');
await jobHelper.viewCandidates('Job Title');
await jobHelper.shortlistCandidate('Candidate Name');

// Profile Management
const profileHelper = new ProfileHelper(page);
await profileHelper.updateJobSeekerProfile(profileData);
await profileHelper.uploadCV('test-cv.pdf');
await profileHelper.updateCompanyProfile(companyData);
```

## 🐛 Troubleshooting

### Tests Failing

**Application not running:**
```bash
# Start the dev server
npm run dev

# Verify it's running on port 5000
curl http://localhost:5000
```

**Missing test data:**
```bash
# Generate test files
npm run generate:test-data

# Check if files were created
ls tests/test-data/
```

**Browser issues:**
```bash
# Reinstall browsers
npx playwright install --force

# Install system dependencies
npx playwright install-deps
```

### Debugging Tests

**Run in headed mode:**
```bash
npm run test:headed
```

**Use debug mode:**
```bash
npm run test:debug
```

**Add breakpoints in code:**
```typescript
await page.pause(); // Pauses test execution
```

**Check screenshots:**
```bash
# Failed tests automatically capture screenshots
ls test-results/
```

### Common Issues

**Error: "Cannot find element"**
- Element might not have `data-testid`
- Element might be loading slowly
- Use `await page.waitForLoadState('networkidle')`

**Error: "Timeout waiting for element"**
- Increase timeout in `playwright.config.ts`
- Use `.isVisible().catch(() => false)` for optional elements

**Error: "Port 5000 already in use"**
- Stop other dev servers
- Or run tests against different port

## 📊 Test Reports

After running tests, view reports:

```bash
# HTML report
npm run test:report

# Reports are saved in:
# - test-reports/html/          # Interactive HTML report
# - test-reports/results.json   # JSON results
# - test-results/               # Screenshots and videos
```

## ✅ Success Criteria

Tests are considered successful when:
- ✅ Success rate > 95%
- ✅ No critical bugs found
- ✅ All payment flows work correctly
- ✅ Page load times < 3 seconds
- ✅ Mobile responsive on all screen sizes
- ✅ Core user journeys complete without errors
- ✅ Data integrity maintained
- ✅ All security tests pass

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Helpers Source Code](./tests/helpers/)
- [Test Data Configuration](./tests/fixtures/test-data.ts)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

When adding new tests:
1. Use existing helpers when possible
2. Add `data-testid` attributes to new elements
3. Follow the existing naming conventions
4. Include assertions for expected outcomes
5. Handle loading states properly
6. Clean up test data after tests run

## 📝 Test Data

Pre-configured test users:

**Job Seekers:**
- `freshgrad.test@email.com` - Fresh Graduate
- `senior.test@email.com` - Experienced Professional
- `jobhopper.test@email.com` - Job Hopper

**Employers:**
- `startup.hr@email.com` - Startup Company
- `corporate.hr@email.com` - Corporate Company
- `sme.owner@email.com` - SME Owner

All passwords: `TestPassword123!`
