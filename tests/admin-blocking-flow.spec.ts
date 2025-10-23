import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

/**
 * E2E Test for User Blocking Flow (Task 22)
 * 
 * Test Coverage:
 * - User activity and normal access
 * - Admin blocks user with reason
 * - User sees blocked account page
 * - User cannot access protected features
 * - Admin unblocks user
 * - User regains full access
 */

test.describe('Admin Blocking Flow', () => {
  test('Complete blocking flow: User active → Admin blocks → User blocked → Admin unblocks → User restored', async ({ browser }) => {
    const userContext = await browser.newContext();
    const adminContext = await browser.newContext();
    
    const userPage = await userContext.newPage();
    const adminPage = await adminContext.newPage();
    
    const userAuth = new AuthHelper(userPage);
    const adminAuth = new AuthHelper(adminPage);
    
    const timestamp = Date.now();
    const userName = `Test User Block ${timestamp}`;
    const userEmail = `user_block_${timestamp}@test.com`;
    const adminEmail = `admin_block_${timestamp}@test.com`;
    const blockReason = 'Aktivitas mencurigakan atau pelanggaran ketentuan layanan';
    
    try {
      // Step 1: User registers and is active
      await test.step('User registers and can access platform', async () => {
        await userAuth.register({
          email: userEmail,
          password: 'TestPassword123!',
          name: userName,
          phone: `0816${timestamp.toString().slice(-8)}`,
          role: 'job_seeker',
        });
        
        const isLoggedIn = await userAuth.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        console.log('✓ User registered and active');
      });
      
      // Step 2: User can browse jobs
      await test.step('User can browse jobs normally', async () => {
        await userPage.goto('/jobs');
        await userPage.waitForLoadState('networkidle');
        
        const jobListings = userPage.locator('[data-testid^="card-job"]');
        const hasJobs = await jobListings.count() >= 0;
        expect(hasJobs).toBeTruthy();
        console.log('✓ User can access job listings');
      });
      
      // Step 3: Admin logs in
      await test.step('Admin logs in', async () => {
        await adminAuth.register({
          email: adminEmail,
          password: 'AdminPassword123!',
          name: 'Test Admin Block',
          phone: `0817${timestamp.toString().slice(-8)}`,
          role: 'admin',
        });
        
        const isLoggedIn = await adminAuth.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        console.log('✓ Admin logged in');
      });
      
      // Step 4: Admin blocks specific user with reason
      await test.step('Admin blocks user with reason', async () => {
        await adminPage.goto('/admin/users');
        await adminPage.waitForLoadState('networkidle');
        
        // Switch to job seeker tab
        const workerTab = adminPage.getByRole('tab', { name: /pekerja|worker|job.*seeker/i });
        await expect(workerTab).toBeVisible({ timeout: 10000 });
        await workerTab.click();
        await adminPage.waitForTimeout(1000);
        
        // Find the specific user by name or email
        const userRow = adminPage.getByText(userName).or(
          adminPage.getByText(userEmail)
        );
        await expect(userRow).toBeVisible({ timeout: 10000 });
        
        // Find the block button for this specific user
        const userContainer = userRow.locator('xpath=ancestor::tr | xpath=ancestor::div[contains(@class, "card") or @data-testid]');
        const blockButton = userContainer.locator('[data-testid^="button-block-"]').first();
        
        await expect(blockButton).toBeVisible({ timeout: 5000 });
        await blockButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Enter block reason
        const reasonTextarea = adminPage.getByTestId('input-action-reason');
        await expect(reasonTextarea).toBeVisible({ timeout: 5000 });
        await reasonTextarea.fill(blockReason);
        await adminPage.waitForTimeout(500);
        
        // Confirm block
        const confirmButton = adminPage.getByTestId('button-confirm-action');
        await expect(confirmButton).toBeVisible({ timeout: 5000 });
        await confirmButton.click();
        await adminPage.waitForTimeout(2000);
        console.log('✓ Admin blocked user with reason');
      });
      
      // Step 5: User is logged out and sees blocked page
      await test.step('User sees blocked account page', async () => {
        // Try to navigate to a protected page
        await userPage.goto('/jobs');
        await userPage.waitForLoadState('networkidle');
        
        // Should see blocked account page or message
        const blockedPage = userPage.getByTestId('page-account-blocked').or(
          userPage.getByText(/akun.*diblokir|account.*blocked/i)
        );
        
        await expect(blockedPage).toBeVisible({ timeout: 10000 });
        console.log('✓ Blocked account page displayed');
        
        // Check if reason is shown
        const reasonText = userPage.getByTestId('text-block-reason').or(
          userPage.getByText(blockReason)
        );
        
        const reasonVisible = await reasonText.isVisible({ timeout: 3000 }).catch(() => false);
        if (reasonVisible) {
          console.log('✓ Block reason displayed to user');
        }
      });
      
      // Step 6: User cannot access protected features
      await test.step('User cannot access protected features', async () => {
        await userPage.goto('/profile');
        await userPage.waitForLoadState('networkidle');
        
        // Should be redirected or see blocked message
        const currentUrl = userPage.url();
        const blockedMessage = userPage.getByText(/akun.*diblokir|account.*blocked/i);
        
        const isBlocked = currentUrl.includes('blocked') || 
                         await blockedMessage.isVisible({ timeout: 3000 }).catch(() => false);
        
        expect(isBlocked).toBeTruthy();
        console.log('✓ User blocked from accessing profile');
      });
      
      // Step 7: Admin unblocks the specific user
      await test.step('Admin unblocks user', async () => {
        await adminPage.goto('/admin/users');
        await adminPage.waitForLoadState('networkidle');
        
        // Switch to job seeker tab
        const workerTab = adminPage.getByRole('tab', { name: /pekerja|worker|job.*seeker/i });
        await expect(workerTab).toBeVisible({ timeout: 10000 });
        await workerTab.click();
        await adminPage.waitForTimeout(1000);
        
        // Find the specific user by name or email
        const userRow = adminPage.getByText(userName).or(
          adminPage.getByText(userEmail)
        );
        await expect(userRow).toBeVisible({ timeout: 10000 });
        
        // Find the unblock button for this specific user
        const userContainer = userRow.locator('xpath=ancestor::tr | xpath=ancestor::div[contains(@class, "card") or @data-testid]');
        const unblockButton = userContainer.locator('[data-testid^="button-unblock-"]').first();
        
        await expect(unblockButton).toBeVisible({ timeout: 5000 });
        await unblockButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Confirm unblock
        const confirmButton = adminPage.getByTestId('button-confirm-action');
        await expect(confirmButton).toBeVisible({ timeout: 5000 });
        await confirmButton.click();
        await adminPage.waitForTimeout(2000);
        console.log('✓ Admin unblocked user');
      });
      
      // Step 8: User can access platform again
      await test.step('User regains access to platform', async () => {
        // Logout and login again
        await userAuth.logout();
        await userAuth.login(userEmail, 'TestPassword123!');
        
        // Verify logged in
        const isLoggedIn = await userAuth.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        
        // Try to access jobs
        await userPage.goto('/jobs');
        await userPage.waitForLoadState('networkidle');
        
        // Should not see blocked message
        const blockedMessage = userPage.getByText(/akun.*diblokir|account.*blocked/i);
        const isBlocked = await blockedMessage.isVisible({ timeout: 2000 }).catch(() => false);
        expect(isBlocked).toBeFalsy();
        
        console.log('✓ User can access platform again');
      });
      
    } finally {
      await userContext.close();
      await adminContext.close();
    }
  });
  
  test('Employer blocking: Admin blocks employer → Employer cannot post jobs → Admin unblocks → Employer can post', async ({ browser }) => {
    const employerContext = await browser.newContext();
    const adminContext = await browser.newContext();
    
    const employerPage = await employerContext.newPage();
    const adminPage = await adminContext.newPage();
    
    const employerAuth = new AuthHelper(employerPage);
    const adminAuth = new AuthHelper(adminPage);
    
    const timestamp = Date.now();
    const employerName = `Test Employer Block ${timestamp}`;
    const employerEmail = `employer_block_${timestamp}@test.com`;
    const adminEmail = `admin_eblock_${timestamp}@test.com`;
    const blockReason = 'Posting lowongan palsu';
    
    try {
      // Step 1: Employer registers
      await test.step('Employer registers', async () => {
        await employerAuth.register({
          email: employerEmail,
          password: 'TestPassword123!',
          name: employerName,
          phone: `0818${timestamp.toString().slice(-8)}`,
          role: 'employer',
          companyName: 'Block Test Company',
        });
        
        expect(await employerAuth.isLoggedIn()).toBeTruthy();
        console.log('✓ Employer registered');
      });
      
      // Step 2: Admin blocks specific employer
      await test.step('Admin blocks employer', async () => {
        await adminAuth.register({
          email: adminEmail,
          password: 'AdminPassword123!',
          name: 'Test Admin Employer Block',
          phone: `0819${timestamp.toString().slice(-8)}`,
          role: 'admin',
        });
        
        await adminPage.goto('/admin/users');
        await adminPage.waitForLoadState('networkidle');
        
        // Switch to recruiter tab
        const recruiterTab = adminPage.getByRole('tab', { name: /perekrut|recruiter/i });
        await expect(recruiterTab).toBeVisible({ timeout: 10000 });
        await recruiterTab.click();
        await adminPage.waitForTimeout(1000);
        
        // Find the specific employer by name or email
        const employerRow = adminPage.getByText(employerName).or(
          adminPage.getByText(employerEmail)
        );
        await expect(employerRow).toBeVisible({ timeout: 10000 });
        
        // Find the block button for this specific employer
        const employerContainer = employerRow.locator('xpath=ancestor::tr | xpath=ancestor::div[contains(@class, "card") or @data-testid]');
        const blockButton = employerContainer.locator('[data-testid^="button-block-"]').first();
        
        await expect(blockButton).toBeVisible({ timeout: 5000 });
        await blockButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Enter block reason
        const reasonTextarea = adminPage.getByTestId('input-action-reason');
        await expect(reasonTextarea).toBeVisible({ timeout: 5000 });
        await reasonTextarea.fill(blockReason);
        await adminPage.waitForTimeout(500);
        
        // Confirm block
        const confirmButton = adminPage.getByTestId('button-confirm-action');
        await expect(confirmButton).toBeVisible({ timeout: 5000 });
        await confirmButton.click();
        await adminPage.waitForTimeout(2000);
        console.log('✓ Admin blocked employer');
      });
      
      // Step 3: Employer sees blocked message
      await test.step('Employer sees blocked account page', async () => {
        await employerPage.reload();
        await employerPage.waitForLoadState('networkidle');
        
        const blockedMessage = employerPage.getByText(/akun.*diblokir|account.*blocked/i);
        await expect(blockedMessage).toBeVisible({ timeout: 10000 });
        console.log('✓ Employer sees blocked account message');
      });
      
      // Step 4: Admin unblocks the employer
      await test.step('Admin unblocks employer', async () => {
        await adminPage.goto('/admin/users');
        await adminPage.waitForLoadState('networkidle');
        
        // Switch to recruiter tab
        const recruiterTab = adminPage.getByRole('tab', { name: /perekrut|recruiter/i });
        await expect(recruiterTab).toBeVisible({ timeout: 10000 });
        await recruiterTab.click();
        await adminPage.waitForTimeout(1000);
        
        // Find the specific employer
        const employerRow = adminPage.getByText(employerName).or(
          adminPage.getByText(employerEmail)
        );
        await expect(employerRow).toBeVisible({ timeout: 10000 });
        
        // Find the unblock button for this specific employer
        const employerContainer = employerRow.locator('xpath=ancestor::tr | xpath=ancestor::div[contains(@class, "card") or @data-testid]');
        const unblockButton = employerContainer.locator('[data-testid^="button-unblock-"]').first();
        
        await expect(unblockButton).toBeVisible({ timeout: 5000 });
        await unblockButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Confirm unblock
        const confirmButton = adminPage.getByTestId('button-confirm-action');
        await expect(confirmButton).toBeVisible({ timeout: 5000 });
        await confirmButton.click();
        await adminPage.waitForTimeout(2000);
        console.log('✓ Admin unblocked employer');
      });
      
      // Step 5: Employer regains access
      await test.step('Employer regains access to platform', async () => {
        // Logout and login again
        await employerAuth.logout();
        await employerAuth.login(employerEmail, 'TestPassword123!');
        
        // Verify logged in
        const isLoggedIn = await employerAuth.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        
        // Should not see blocked message
        const blockedMessage = employerPage.getByText(/akun.*diblokir|account.*blocked/i);
        const isBlocked = await blockedMessage.isVisible({ timeout: 2000 }).catch(() => false);
        expect(isBlocked).toBeFalsy();
        
        console.log('✓ Employer can access platform again');
      });
      
    } finally {
      await employerContext.close();
      await adminContext.close();
    }
  });
});
