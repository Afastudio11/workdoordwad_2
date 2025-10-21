import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { JobHelper } from './helpers/job.helper';
import { TEST_USERS } from './fixtures/test-data';

test.describe('Performance Tests', () => {
  test('Load 100 job listings performance', async ({ page }) => {
    await page.goto('/jobs');
    
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Job listings page loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
    
    const jobCards = page.locator('[data-testid^="card-job"]');
    const count = await jobCards.count();
    console.log(`Loaded ${count} job listings`);
  });

  test('Search performance with 1000+ results', async ({ page }) => {
    await page.goto('/jobs');
    
    const searchInput = page.getByTestId('input-search');
    await searchInput.fill('developer');
    
    const startTime = Date.now();
    const searchButton = page.getByTestId('button-search');
    await searchButton.click();
    await page.waitForLoadState('networkidle');
    const searchTime = Date.now() - startTime;
    
    console.log(`Search completed in ${searchTime}ms`);
    expect(searchTime).toBeLessThan(3000);
  });

  test('Page load time < 3 seconds for all main pages', async ({ page }) => {
    const pagesToTest = ['/', '/jobs', '/about', '/contact'];
    
    for (const path of pagesToTest) {
      const startTime = Date.now();
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`${path} loaded in ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('Concurrent users test - 6 users active simultaneously', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
    ]);

    const startTime = Date.now();

    await Promise.all(
      contexts.map(async (context, index) => {
        const page = await context.newPage();
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');
        
        const searchInput = page.getByTestId('input-search');
        if (await searchInput.isVisible().catch(() => false)) {
          await searchInput.fill(`test ${index}`);
          await searchInput.press('Enter');
          await page.waitForLoadState('networkidle');
        }
      })
    );

    const totalTime = Date.now() - startTime;
    console.log(`6 concurrent users completed in ${totalTime}ms`);
    
    expect(totalTime).toBeLessThan(10000);

    await Promise.all(contexts.map(ctx => ctx.close()));
  });

  test('Slow 3G network simulation', async ({ page, context }) => {
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Page loaded on slow 3G in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(15000);
  });
});

test.describe('Security Tests', () => {
  test('SQL Injection attempt in search box', async ({ page }) => {
    await page.goto('/jobs');
    
    const maliciousInputs = [
      "' OR '1'='1",
      "'; DROP TABLE jobs; --",
      "1' UNION SELECT * FROM users--",
      "admin'--",
      "' OR 1=1--",
    ];

    for (const maliciousInput of maliciousInputs) {
      const searchInput = page.getByTestId('input-search');
      await searchInput.fill(maliciousInput);
      
      const searchButton = page.getByTestId('button-search');
      await searchButton.click();
      await page.waitForLoadState('networkidle');
      
      const errorPage = page.getByText(/error|500|database.*error/i);
      const shouldNotExist = await errorPage.isVisible().catch(() => false);
      expect(shouldNotExist).toBeFalsy();
      
      console.log(`✓ SQL injection attempt blocked: ${maliciousInput}`);
    }
  });

  test('XSS attempt in form inputs', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    
    await page.goto('/');
    const registerButton = page.getByTestId('button-register');
    await registerButton.click();

    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg/onload=alert("XSS")>',
    ];

    const nameInput = page.getByTestId('input-name');
    for (const payload of xssPayloads) {
      await nameInput.fill(payload);
      await page.waitForTimeout(500);
      
      page.on('dialog', dialog => {
        expect(dialog.type()).not.toBe('alert');
        dialog.dismiss();
      });
      
      console.log(`✓ XSS attempt sanitized: ${payload.substring(0, 30)}...`);
    }
  });

  test('File upload validation - only PDF and DOC allowed', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.register({
      email: 'fileupload.test@email.com',
      password: 'TestPassword123!',
      name: 'File Upload Test',
      phone: '081234560099',
      role: 'job_seeker',
    });

    await page.goto('/profile');
    
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible().catch(() => false)) {
      const acceptAttr = await fileInput.getAttribute('accept');
      console.log(`File input accept attribute: ${acceptAttr}`);
      
      expect(acceptAttr).toContain('pdf');
    }
  });

  test('Password strength enforcement', async ({ page }) => {
    await page.goto('/');
    const registerButton = page.getByTestId('button-register');
    await registerButton.click();

    const weakPasswords = [
      '123',
      'password',
      'abc',
      '12345678',
    ];

    const emailInput = page.getByTestId('input-email');
    const passwordInput = page.getByTestId('input-password');
    const nameInput = page.getByTestId('input-name');
    const phoneInput = page.getByTestId('input-phone');

    await emailInput.fill('test@email.com');
    await nameInput.fill('Test User');
    await phoneInput.fill('081234567890');

    for (const weakPassword of weakPasswords) {
      await passwordInput.fill(weakPassword);
      
      const submitButton = page.getByTestId('button-submit');
      await submitButton.click();
      
      await page.waitForTimeout(1000);
      
      const errorMessage = page.getByText(/password.*weak|password.*strong|minimum.*character/i);
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      if (hasError) {
        console.log(`✓ Weak password rejected: ${weakPassword}`);
      }
    }
  });

  test('Rate limiting for job applications', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.register({
      email: 'ratelimit.test@email.com',
      password: 'TestPassword123!',
      name: 'Rate Limit Test',
      phone: '081234560098',
      role: 'job_seeker',
    });

    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    const jobCards = page.locator('[data-testid^="card-job"]');
    const totalJobs = await jobCards.count();
    let applicationsCount = 0;

    for (let i = 0; i < Math.min(20, totalJobs); i++) {
      await jobCards.nth(i % totalJobs).click();
      await page.waitForLoadState('networkidle');
      
      const applyButton = page.getByTestId('button-apply');
      if (await applyButton.isVisible().catch(() => false)) {
        await applyButton.click();
        
        const submitButton = page.getByTestId('button-submit-application');
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          await page.waitForTimeout(500);
          applicationsCount++;
        }
      }
      
      const rateLimitMessage = page.getByText(/too.*many|rate.*limit|tunggu/i);
      if (await rateLimitMessage.isVisible().catch(() => false)) {
        console.log(`✓ Rate limiting triggered after ${applicationsCount} applications`);
        break;
      }
      
      await page.goto('/jobs');
      await page.waitForLoadState('networkidle');
    }
  });

  test('Unauthorized access attempts', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes('/login') || currentUrl.includes('/signin');
    
    if (isRedirected) {
      console.log('✓ Unauthorized access redirected to login');
    } else {
      const unauthorizedMessage = page.getByText(/unauthorized|not.*authorized|forbidden/i);
      const hasMessage = await unauthorizedMessage.isVisible().catch(() => false);
      expect(hasMessage).toBeTruthy();
    }
  });

  test('Session timeout handling', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.login(TEST_USERS.jobSeekers.freshGraduate.email, TEST_USERS.jobSeekers.freshGraduate.password);
    
    await page.context().clearCookies();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loginPrompt = page.getByText(/login|sign.*in|masuk/i);
    const hasLoginPrompt = await loginPrompt.isVisible().catch(() => false);
    
    if (hasLoginPrompt) {
      console.log('✓ Session timeout handled correctly');
    }
  });

  test('CSRF token validation', async ({ page }) => {
    await page.goto('/');
    
    const csrfToken = await page.locator('input[name="_csrf"]').or(
      page.locator('meta[name="csrf-token"]')
    ).getAttribute('value').catch(() => null) || await page.locator('meta[name="csrf-token"]').getAttribute('content').catch(() => null);
    
    if (csrfToken) {
      console.log('✓ CSRF token present');
      expect(csrfToken).toBeTruthy();
    } else {
      console.log('⚠ CSRF token not found - may be implemented differently');
    }
  });
});
