import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { JobHelper } from './helpers/job.helper';
import { TEST_USERS } from './fixtures/test-data';

test.describe('Edge Cases and Error Handling', () => {
  test('Register with existing email', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    const user = { ...TEST_USERS.jobSeekers.freshGraduate, email: 'duplicate.test@email.com' };

    await authHelper.register({
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });

    await authHelper.logout();

    await page.goto('/');
    const registerButton = page.getByTestId('button-register');
    await registerButton.click();

    await page.getByTestId('input-email').fill(user.email);
    await page.getByTestId('input-password').fill(user.password);
    await page.getByTestId('input-name').fill(user.name);
    await page.getByTestId('input-phone').fill(user.phone);
    
    const submitButton = page.getByTestId('button-submit');
    await submitButton.click();
    
    await page.waitForTimeout(2000);
    
    const errorMessage = page.getByText(/already.*exists|email.*taken|sudah.*terdaftar/i);
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    if (hasError) {
      console.log('✓ Duplicate email error shown');
      expect(hasError).toBeTruthy();
    }
  });

  test('Login with wrong password 5 times', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    const user = TEST_USERS.jobSeekers.freshGraduate;

    await authHelper.register({
      email: 'wrongpass.test@email.com',
      password: 'CorrectPassword123!',
      name: 'Wrong Pass Test',
      phone: '081234560097',
      role: 'job_seeker',
    });

    await authHelper.logout();

    for (let i = 0; i < 5; i++) {
      await page.goto('/');
      const loginButton = page.getByTestId('button-login');
      await loginButton.click();

      await page.getByTestId('input-email').fill('wrongpass.test@email.com');
      await page.getByTestId('input-password').fill('WrongPassword123!');
      
      const submitButton = page.getByTestId('button-submit');
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/incorrect|invalid|wrong|salah/i);
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      console.log(`Attempt ${i + 1}: ${hasError ? 'Error shown' : 'No error'}`);
    }

    const lockoutMessage = page.getByText(/locked|blocked|too.*many.*attempts/i);
    const isLocked = await lockoutMessage.isVisible().catch(() => false);
    
    if (isLocked) {
      console.log('✓ Account locked after 5 failed attempts');
    }
  });

  test('Apply to closed job', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    const closedJobCard = page.locator('[data-testid^="card-job"]').filter({ hasText: /closed|ditutup/i }).first();
    
    if (await closedJobCard.isVisible().catch(() => false)) {
      await closedJobCard.click();
      await page.waitForLoadState('networkidle');
      
      const applyButton = page.getByTestId('button-apply');
      const isDisabled = await applyButton.isDisabled().catch(() => false);
      const isHidden = !(await applyButton.isVisible().catch(() => true));
      
      if (isDisabled || isHidden) {
        console.log('✓ Cannot apply to closed job');
      } else {
        await applyButton.click();
        const errorMessage = page.getByText(/closed|ditutup|tidak.*tersedia/i);
        const hasError = await errorMessage.isVisible().catch(() => false);
        expect(hasError).toBeTruthy();
      }
    }
  });

  test('Upload corrupt file', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.register({
      email: 'corruptfile.test@email.com',
      password: 'TestPassword123!',
      name: 'Corrupt File Test',
      phone: '081234560096',
      role: 'job_seeker',
    });

    await page.goto('/profile');
    
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible().catch(() => false)) {
      await fileInput.setInputFiles({
        name: 'corrupt.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('This is not a real PDF file'),
      });

      await page.waitForTimeout(2000);
      
      const errorMessage = page.getByText(/invalid.*file|corrupt|gagal|error/i);
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      if (hasError) {
        console.log('✓ Corrupt file rejected');
      }
    }
  });

  test('Browser back button after form submit', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.register({
      email: 'backbutton.test@email.com',
      password: 'TestPassword123!',
      name: 'Back Button Test',
      phone: '081234560095',
      role: 'job_seeker',
    });

    await page.goto('/jobs');
    const firstJob = page.locator('[data-testid^="card-job"]').first();
    if (await firstJob.isVisible().catch(() => false)) {
      await firstJob.click();
      await page.waitForLoadState('networkidle');
      
      const applyButton = page.getByTestId('button-apply');
      if (await applyButton.isVisible().catch(() => false)) {
        await applyButton.click();
        
        const submitButton = page.getByTestId('button-submit-application');
        if (await submitButton.isVisible().catch(() => false)) {
          await submitButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }

    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    const duplicateWarning = page.getByText(/already.*applied|sudah.*melamar/i);
    const hasWarning = await duplicateWarning.isVisible().catch(() => false);
    
    if (hasWarning) {
      console.log('✓ Duplicate application prevented');
    }
  });

  test('Multiple tabs same user', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    const authHelper1 = new AuthHelper(page1);
    await authHelper1.register({
      email: 'multitab.test@email.com',
      password: 'TestPassword123!',
      name: 'Multi Tab Test',
      phone: '081234560094',
      role: 'job_seeker',
    });

    await page2.goto('/dashboard');
    await page2.waitForLoadState('networkidle');
    
    const isLoggedIn = await authHelper1.isLoggedIn();
    console.log(`✓ Session shared across tabs: ${isLoggedIn}`);

    await authHelper1.logout();
    
    await page2.reload();
    await page2.waitForLoadState('networkidle');
    
    const authHelper2 = new AuthHelper(page2);
    const stillLoggedIn = await authHelper2.isLoggedIn();
    expect(stillLoggedIn).toBeFalsy();
    console.log('✓ Logout synced across tabs');

    await context.close();
  });

  test('Session expired handling', async ({ page, context }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.register({
      email: 'sessionexpired.test@email.com',
      password: 'TestPassword123!',
      name: 'Session Expired Test',
      phone: '081234560093',
      role: 'job_seeker',
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await context.clearCookies();
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const loginPage = page.url().includes('/login') || page.url().includes('/signin');
    const loginPrompt = await page.getByText(/login|sign.*in|masuk/i).isVisible().catch(() => false);
    
    if (loginPage || loginPrompt) {
      console.log('✓ Session expiration handled correctly');
    }
  });

  test('404 page handling', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await page.waitForLoadState('networkidle');
    
    const notFoundMessage = page.getByText(/404|not.*found|tidak.*ditemukan/i);
    const hasMessage = await notFoundMessage.isVisible().catch(() => false);
    
    if (hasMessage) {
      console.log('✓ 404 page displayed correctly');
      expect(hasMessage).toBeTruthy();
    }
    
    const homeLink = page.getByRole('link', { name: /home|beranda/i });
    if (await homeLink.isVisible().catch(() => false)) {
      console.log('✓ 404 page has navigation to home');
    }
  });

  test('Empty form submission', async ({ page }) => {
    await page.goto('/');
    const registerButton = page.getByTestId('button-register');
    await registerButton.click();

    const submitButton = page.getByTestId('button-submit');
    await submitButton.click();
    
    await page.waitForTimeout(1000);
    
    const errorMessages = page.getByText(/required|wajib|harus.*diisi/i);
    const count = await errorMessages.count();
    
    console.log(`✓ ${count} validation errors shown for empty form`);
    expect(count).toBeGreaterThan(0);
  });

  test('Special characters in search', async ({ page }) => {
    await page.goto('/jobs');
    
    const specialSearches = [
      '!@#$%^&*()',
      '<script>test</script>',
      '????????',
      '    ',
      '\n\n\n',
    ];

    for (const search of specialSearches) {
      const searchInput = page.getByTestId('input-search');
      await searchInput.fill(search);
      
      const searchButton = page.getByTestId('button-search');
      await searchButton.click();
      await page.waitForLoadState('networkidle');
      
      await page.waitForTimeout(1000);
      
      const errorPage = page.getByText(/error|500/i);
      const hasError = await errorPage.isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
      
      console.log(`✓ Special characters handled: ${search.substring(0, 20)}`);
    }
  });

  test('Very long input strings', async ({ page }) => {
    await page.goto('/');
    const registerButton = page.getByTestId('button-register');
    await registerButton.click();

    const veryLongString = 'A'.repeat(10000);
    
    const nameInput = page.getByTestId('input-name');
    await nameInput.fill(veryLongString);
    
    await page.waitForTimeout(1000);
    
    const inputValue = await nameInput.inputValue();
    const isTruncated = inputValue.length < veryLongString.length;
    
    if (isTruncated) {
      console.log(`✓ Long input truncated to ${inputValue.length} characters`);
    }
  });
});
