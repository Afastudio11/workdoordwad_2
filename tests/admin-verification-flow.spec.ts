import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

/**
 * E2E Test for Employer Verification Flow (Task 21)
 * 
 * Test Coverage:
 * - Employer registration with complete profile
 * - Verification request submission
 * - Admin approval flow
 * - Admin rejection flow with reason
 * - Status reflection across UI
 * - Blocked/pending state pages
 */

test.describe('Admin Verification Flow', () => {
  test('Complete verification flow: Employer registers → Admin approves → Employer can post jobs', async ({ browser }) => {
    const employerContext = await browser.newContext();
    const adminContext = await browser.newContext();
    
    const employerPage = await employerContext.newPage();
    const adminPage = await adminContext.newPage();
    
    const employerAuth = new AuthHelper(employerPage);
    const adminAuth = new AuthHelper(adminPage);
    
    const timestamp = Date.now();
    const employerEmail = `employer_verify_${timestamp}@test.com`;
    const adminEmail = `admin_verify_${timestamp}@test.com`;
    
    try {
      // Step 1: Employer registers
      await test.step('Employer registers with complete profile', async () => {
        await employerAuth.register({
          email: employerEmail,
          password: 'TestPassword123!',
          name: 'Test Employer Verification',
          phone: `0812${timestamp.toString().slice(-8)}`,
          role: 'employer',
          companyName: 'Verification Test Company',
        });
        
        const isLoggedIn = await employerAuth.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        console.log('✓ Employer registered successfully');
      });
      
      // Step 2: Check pending verification status
      await test.step('Employer sees pending verification banner', async () => {
        await employerPage.goto('/employer/dashboard');
        await employerPage.waitForLoadState('networkidle');
        
        const pendingBanner = employerPage.getByTestId('alert-verification-pending').or(
          employerPage.getByText(/sedang.*diproses|verification.*pending/i)
        );
        
        await expect(pendingBanner.first()).toBeVisible({ timeout: 10000 });
        console.log('✓ Pending verification banner displayed');
      });
      
      // Step 3: Employer tries to post job (should be blocked)
      await test.step('Employer cannot post job while unverified', async () => {
        await employerPage.goto('/employer/post-job');
        await employerPage.waitForLoadState('networkidle');
        
        // Should see unverified page or disabled form
        const unverifiedMessage = employerPage.getByTestId('alert-verification-pending').or(
          employerPage.getByText(/verifikasi.*diperlukan|verification.*required|sedang.*diproses/i)
        );
        
        await expect(unverifiedMessage.first()).toBeVisible({ timeout: 10000 });
        console.log('✓ Job posting blocked for unverified employer');
      });
      
      // Step 4: Admin logs in
      await test.step('Admin logs in', async () => {
        // First register admin if not exists (in real scenario, admin would already exist)
        await adminAuth.register({
          email: adminEmail,
          password: 'AdminPassword123!',
          name: 'Test Admin',
          phone: `0813${timestamp.toString().slice(-8)}`,
          role: 'admin',
        });
        
        const isLoggedIn = await adminAuth.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        console.log('✓ Admin logged in successfully');
      });
      
      // Step 5: Admin approves employer
      await test.step('Admin approves employer verification', async () => {
        await adminPage.goto('/admin/users');
        await adminPage.waitForLoadState('networkidle');
        
        // Switch to recruiter tab
        const recruiterTab = adminPage.getByRole('tab', { name: /perekrut|recruiter/i });
        await expect(recruiterTab).toBeVisible({ timeout: 5000 });
        await recruiterTab.click();
        await adminPage.waitForTimeout(1000);
        
        // Find the employer row by email or company name
        const employerRow = adminPage.locator('tr', {
          has: adminPage.getByText('Verification Test Company')
        }).or(
          adminPage.locator('tr', {
            has: adminPage.getByText(employerEmail)
          })
        );
        
        await expect(employerRow.first()).toBeVisible({ timeout: 5000 });
        
        // Find verify button within the employer's row
        const verifyButton = employerRow.first().locator(`[data-testid^="button-verify-"]`);
        await expect(verifyButton).toBeVisible({ timeout: 3000 });
        await verifyButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Confirm in dialog
        const confirmButton = adminPage.getByTestId('button-confirm-action');
        await expect(confirmButton).toBeVisible({ timeout: 3000 });
        await confirmButton.click();
        await adminPage.waitForTimeout(2000);
        console.log('✓ Admin approved employer');
      });
      
      // Step 6: Employer refreshes and sees verified status
      await test.step('Employer can now access all features', async () => {
        await employerPage.reload();
        await employerPage.waitForLoadState('networkidle');
        
        // Verification banner should be gone or show success
        await employerPage.goto('/employer/post-job');
        await employerPage.waitForLoadState('networkidle');
        
        // Should see job posting form
        const jobTitleInput = employerPage.getByTestId('input-job-title').or(
          employerPage.getByLabel(/judul.*lowongan|job.*title|title|judul/i)
        );
        
        await expect(jobTitleInput.first()).toBeVisible({ timeout: 10000 });
        console.log('✓ Employer can now post jobs');
      });
      
    } finally {
      await employerContext.close();
      await adminContext.close();
    }
  });
  
  test('Rejection flow: Employer registers → Admin rejects with reason → Employer sees rejection', async ({ browser }) => {
    const employerContext = await browser.newContext();
    const adminContext = await browser.newContext();
    
    const employerPage = await employerContext.newPage();
    const adminPage = await adminContext.newPage();
    
    const employerAuth = new AuthHelper(employerPage);
    const adminAuth = new AuthHelper(adminPage);
    
    const timestamp = Date.now();
    const employerEmail = `employer_reject_${timestamp}@test.com`;
    const adminEmail = `admin_reject_${timestamp}@test.com`;
    const rejectionReason = 'Dokumen perusahaan tidak lengkap atau tidak valid';
    
    try {
      // Step 1: Employer registers
      await test.step('Employer registers', async () => {
        await employerAuth.register({
          email: employerEmail,
          password: 'TestPassword123!',
          name: 'Test Employer Rejection',
          phone: `0814${timestamp.toString().slice(-8)}`,
          role: 'employer',
          companyName: 'Rejection Test Company',
        });
        
        expect(await employerAuth.isLoggedIn()).toBeTruthy();
        console.log('✓ Employer registered');
      });
      
      // Step 2: Admin logs in
      await test.step('Admin logs in', async () => {
        await adminAuth.register({
          email: adminEmail,
          password: 'AdminPassword123!',
          name: 'Test Admin Rejection',
          phone: `0815${timestamp.toString().slice(-8)}`,
          role: 'admin',
        });
        
        expect(await adminAuth.isLoggedIn()).toBeTruthy();
        console.log('✓ Admin logged in');
      });
      
      // Step 3: Admin rejects employer with reason
      await test.step('Admin rejects employer with reason', async () => {
        await adminPage.goto('/admin/users');
        await adminPage.waitForLoadState('networkidle');
        
        // Switch to recruiter tab
        const recruiterTab = adminPage.getByRole('tab', { name: /perekrut|recruiter/i });
        await expect(recruiterTab).toBeVisible({ timeout: 5000 });
        await recruiterTab.click();
        await adminPage.waitForTimeout(1000);
        
        // Find the employer row by company name or email
        const employerRow = adminPage.locator('tr', {
          has: adminPage.getByText('Rejection Test Company')
        }).or(
          adminPage.locator('tr', {
            has: adminPage.getByText(employerEmail)
          })
        );
        
        await expect(employerRow.first()).toBeVisible({ timeout: 5000 });
        
        // Find reject button within the employer's row
        const rejectButton = employerRow.first().locator(`[data-testid^="button-reject-"]`);
        await expect(rejectButton).toBeVisible({ timeout: 3000 });
        await rejectButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Enter rejection reason
        const reasonTextarea = adminPage.getByTestId('input-action-reason');
        await expect(reasonTextarea).toBeVisible({ timeout: 3000 });
        await reasonTextarea.fill(rejectionReason);
        await adminPage.waitForTimeout(500);
        
        // Confirm rejection
        const confirmButton = adminPage.getByTestId('button-confirm-action');
        await expect(confirmButton).toBeVisible({ timeout: 3000 });
        await confirmButton.click();
        await adminPage.waitForTimeout(2000);
        console.log('✓ Admin rejected employer with reason');
      });
      
      // Step 4: Employer sees rejection message
      await test.step('Employer sees rejection reason', async () => {
        await employerPage.reload();
        await employerPage.waitForLoadState('networkidle');
        await employerPage.goto('/employer/dashboard');
        await employerPage.waitForLoadState('networkidle');
        
        // Should see rejected banner or message
        const rejectedAlert = employerPage.getByTestId('alert-verification-rejected').or(
          employerPage.getByText(/ditolak|rejected/i)
        );
        
        await expect(rejectedAlert.first()).toBeVisible({ timeout: 10000 });
        console.log('✓ Rejection alert displayed');
        
        // Check if reason is shown
        const reasonText = employerPage.getByTestId('text-rejection-reason').or(
          employerPage.getByText(rejectionReason)
        );
        
        await expect(reasonText.first()).toBeVisible({ timeout: 5000 });
        console.log('✓ Rejection reason displayed to employer');
      });
      
    } finally {
      await employerContext.close();
      await adminContext.close();
    }
  });
});
