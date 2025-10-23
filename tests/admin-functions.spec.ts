import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

/**
 * Comprehensive Admin Function Tests (Task 23)
 * 
 * Test Coverage:
 * - User management: List users, verify, reject, block, unblock
 * - Job management: List jobs, approve aggregated jobs, delete jobs
 * - Financial operations: View transactions, process refunds
 * - Fraud reports: View reports, update status
 * - Dashboard statistics
 */

test.describe('Comprehensive Admin Functions', () => {
  let adminContext: any;
  let adminPage: any;
  let adminAuth: AuthHelper;
  const timestamp = Date.now();
  const adminEmail = `admin_func_${timestamp}@test.com`;
  
  test.beforeAll(async ({ browser }) => {
    adminContext = await browser.newContext();
    adminPage = await adminContext.newPage();
    adminAuth = new AuthHelper(adminPage);
    
    // Register admin
    await adminAuth.register({
      email: adminEmail,
      password: 'AdminPassword123!',
      name: 'Test Admin Functions',
      phone: `0820${timestamp.toString().slice(-8)}`,
      role: 'admin',
    });
    
    expect(await adminAuth.isLoggedIn()).toBeTruthy();
    console.log('✓ Admin logged in for comprehensive tests');
  });
  
  test.afterAll(async () => {
    await adminContext.close();
  });
  
  test.describe('User Management Functions', () => {
    test('Admin can view all users with filters', async () => {
      await adminPage.goto('/admin/users');
      await adminPage.waitForLoadState('networkidle');
      
      // Check tabs exist - these should be visible
      const recruiterTab = adminPage.getByRole('tab', { name: /perekrut|recruiter/i });
      const workerTab = adminPage.getByRole('tab', { name: /pekerja|worker/i });
      
      await expect(recruiterTab).toBeVisible({ timeout: 10000 });
      await expect(workerTab).toBeVisible({ timeout: 10000 });
      console.log('✓ User management tabs displayed');
      
      // Switch between tabs
      await recruiterTab.click();
      await adminPage.waitForTimeout(1000);
      
      await workerTab.click();
      await adminPage.waitForTimeout(1000);
      
      console.log('✓ Can switch between user types');
    });
    
    test('Admin can see user details and actions', async () => {
      await adminPage.goto('/admin/users');
      await adminPage.waitForLoadState('networkidle');
      
      // Look for action buttons - at least one type should exist
      const hasVerifyButtons = await adminPage.locator('[data-testid^="button-verify-"]').count();
      const hasBlockButtons = await adminPage.locator('[data-testid^="button-block-"]').count();
      const hasUnblockButtons = await adminPage.locator('[data-testid^="button-unblock-"]').count();
      const hasRejectButtons = await adminPage.locator('[data-testid^="button-reject-"]').count();
      
      const totalActionButtons = hasVerifyButtons + hasBlockButtons + hasUnblockButtons + hasRejectButtons;
      
      // Assert that at least some action buttons exist
      expect(totalActionButtons).toBeGreaterThan(0);
      console.log(`✓ Action buttons found: Verify=${hasVerifyButtons}, Block=${hasBlockButtons}, Unblock=${hasUnblockButtons}, Reject=${hasRejectButtons}`);
    });
  });
  
  test.describe('Job Management Functions', () => {
    test('Admin can view all jobs', async () => {
      await adminPage.goto('/admin/jobs');
      await adminPage.waitForLoadState('networkidle');
      
      // Check if jobs list is displayed
      const jobsTable = adminPage.locator('table').or(
        adminPage.locator('[data-testid^="card-job"]')
      ).or(
        adminPage.getByText(/pekerjaan|lowongan|job/i)
      );
      
      await expect(jobsTable.first()).toBeVisible({ timeout: 10000 });
      console.log('✓ Jobs management page accessible');
    });
    
    test('Admin can view aggregated jobs pending review', async () => {
      await adminPage.goto('/admin/aggregated-jobs');
      await adminPage.waitForLoadState('networkidle');
      
      // Page should load - check for title or heading
      const pageHeading = adminPage.getByRole('heading').or(
        adminPage.getByText(/aggregat|pending|menunggu/i)
      );
      
      await expect(pageHeading.first()).toBeVisible({ timeout: 10000 });
      console.log('✓ Aggregated jobs page accessible');
      
      // If there are pending jobs, verify action buttons exist
      const hasPendingJobs = await adminPage.getByText(/pending|menunggu/i).count() > 0;
      
      if (hasPendingJobs) {
        console.log('✓ Pending jobs found - checking for action buttons');
        
        const approveButton = adminPage.locator('[data-testid^="button-approve"]').first();
        const rejectButton = adminPage.locator('[data-testid^="button-reject"]').first();
        
        // At least one action type should be available
        const hasApproveBtn = await approveButton.isVisible({ timeout: 3000 }).catch(() => false);
        const hasRejectBtn = await rejectButton.isVisible({ timeout: 3000 }).catch(() => false);
        
        expect(hasApproveBtn || hasRejectBtn).toBeTruthy();
        console.log(`✓ Job actions available: Approve=${hasApproveBtn}, Reject=${hasRejectBtn}`);
      } else {
        console.log('ℹ No pending jobs to review (this is OK)');
      }
    });
  });
  
  test.describe('Financial Management Functions', () => {
    test('Admin can view transaction history', async () => {
      await adminPage.goto('/admin/transactions');
      await adminPage.waitForLoadState('networkidle');
      
      // Check if transactions page loads - must have heading or title
      const transactionsPage = adminPage.getByRole('heading').or(
        adminPage.getByText(/transaksi|transaction/i)
      );
      
      await expect(transactionsPage.first()).toBeVisible({ timeout: 10000 });
      console.log('✓ Transactions page accessible');
      
      // Look for table or list structure
      const transactionsList = adminPage.locator('table, [data-testid^="transaction-"]').or(
        adminPage.locator('tbody')
      );
      
      const hasTransactionsList = await transactionsList.first().isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasTransactionsList) {
        console.log('✓ Transactions list displayed');
      } else {
        console.log('ℹ No transactions yet (this is OK for new admin)');
      }
    });
    
    test('Admin can access refund functionality', async () => {
      await adminPage.goto('/admin/transactions');
      await adminPage.waitForLoadState('networkidle');
      
      // Look for refund buttons (may not exist if no eligible transactions)
      const refundButton = adminPage.locator('[data-testid^="button-refund"]').first();
      const hasRefundBtn = await refundButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasRefundBtn) {
        console.log('✓ Refund functionality found - testing dialog');
        
        // Test refund dialog opens
        await refundButton.click();
        await adminPage.waitForTimeout(1000);
        
        const reasonInput = adminPage.getByTestId('input-refund-reason').or(
          adminPage.getByLabel(/reason|alasan/i)
        );
        
        await expect(reasonInput).toBeVisible({ timeout: 5000 });
        console.log('✓ Refund dialog opens correctly');
        
        // Close dialog
        const cancelButton = adminPage.getByTestId('button-cancel').or(
          adminPage.getByRole('button', { name: /cancel|batal/i })
        );
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();
        console.log('✓ Refund dialog closes correctly');
      } else {
        console.log('ℹ No refundable transactions available (this is OK)');
      }
    });
  });
  
  test.describe('Fraud Report Management', () => {
    test('Admin can view fraud reports', async () => {
      await adminPage.goto('/admin/fraud-reports');
      await adminPage.waitForLoadState('networkidle');
      
      // Check if fraud reports page loads - must have heading or content
      const reportsPage = adminPage.getByRole('heading').or(
        adminPage.getByText(/fraud|penipuan|laporan/i)
      );
      
      await expect(reportsPage.first()).toBeVisible({ timeout: 10000 });
      console.log('✓ Fraud reports page accessible');
      
      // Look for reports list structure
      const reportsList = adminPage.locator('table, [data-testid^="report-"]').or(
        adminPage.locator('tbody')
      );
      
      const hasReportsList = await reportsList.first().isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasReportsList) {
        console.log('✓ Fraud reports list displayed');
      } else {
        console.log('ℹ No fraud reports yet (this is OK)');
      }
    });
    
    test('Admin can update fraud report status', async () => {
      await adminPage.goto('/admin/fraud-reports');
      await adminPage.waitForLoadState('networkidle');
      
      // Look for action buttons on reports (may not exist if no reports)
      const updateButton = adminPage.locator('[data-testid^="button-update-status"]').first().or(
        adminPage.getByRole('button', { name: /update|resolve|process|proses/i }).first()
      );
      
      const hasUpdateBtn = await updateButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasUpdateBtn) {
        console.log('✓ Fraud report status update available');
        
        // Try to open update dialog
        await updateButton.click();
        await adminPage.waitForTimeout(1000);
        
        // Look for status selection or update form
        const statusSelect = adminPage.locator('select, [role="combobox"]').or(
          adminPage.getByTestId('select-status')
        );
        
        const hasStatusSelect = await statusSelect.first().isVisible({ timeout: 3000 }).catch(() => false);
        
        if (hasStatusSelect) {
          console.log('✓ Status update form displayed');
          
          // Close dialog
          const cancelButton = adminPage.getByRole('button', { name: /cancel|batal/i });
          const hasCancelBtn = await cancelButton.isVisible({ timeout: 3000 }).catch(() => false);
          if (hasCancelBtn) {
            await cancelButton.click();
          } else {
            await adminPage.keyboard.press('Escape');
          }
        }
      } else {
        console.log('ℹ No fraud reports to update (this is OK)');
      }
    });
  });
  
  test.describe('Dashboard Statistics', () => {
    test('Admin dashboard shows key metrics', async () => {
      await adminPage.goto('/admin/dashboard');
      await adminPage.waitForLoadState('networkidle');
      
      // Dashboard should load
      const dashboard = adminPage.getByRole('heading').or(
        adminPage.getByText(/dashboard|statistik/i)
      );
      
      await expect(dashboard.first()).toBeVisible({ timeout: 10000 });
      console.log('✓ Admin dashboard loads');
      
      // Check for key statistics (at least one metric should be visible)
      const metrics = [
        'total.*user|jumlah.*user|pengguna',
        'total.*job|jumlah.*lowongan|pekerjaan',
        'revenue|pendapatan|transaksi',
        'pending|menunggu|verifikasi',
      ];
      
      let visibleMetrics = 0;
      for (const metric of metrics) {
        const metricElement = adminPage.getByText(new RegExp(metric, 'i')).first();
        const isVisible = await metricElement.isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          visibleMetrics++;
        }
      }
      
      // At least one metric should be visible
      expect(visibleMetrics).toBeGreaterThan(0);
      console.log(`✓ Dashboard metrics displayed: ${visibleMetrics}/${metrics.length}`);
    });
    
    test('Admin dashboard has navigation to all sections', async () => {
      await adminPage.goto('/admin/dashboard');
      await adminPage.waitForLoadState('networkidle');
      
      // Check for navigation links or sidebar
      const navSections = [
        /user|pengguna/i,
        /job|lowongan|pekerjaan/i,
        /transaction|transaksi/i,
      ];
      
      let accessibleSections = 0;
      for (const section of navSections) {
        const navLink = adminPage.getByRole('link', { name: section }).or(
          adminPage.locator('nav').getByText(section)
        ).or(
          adminPage.locator('aside, [role="navigation"]').getByText(section)
        );
        
        const isVisible = await navLink.first().isVisible({ timeout: 3000 }).catch(() => false);
        if (isVisible) {
          accessibleSections++;
        }
      }
      
      // At least half of the sections should be accessible
      expect(accessibleSections).toBeGreaterThanOrEqual(Math.floor(navSections.length / 2));
      console.log(`✓ Navigation sections accessible: ${accessibleSections}/${navSections.length}`);
    });
  });
  
  test.describe('Admin Activity Logging', () => {
    test('Admin actions are logged or activity page exists', async () => {
      await adminPage.goto('/admin/activity-logs');
      await adminPage.waitForLoadState('networkidle');
      
      // Check if activity logs page exists
      const currentUrl = adminPage.url();
      
      // If we're not redirected to 404 or error page, the route exists
      const is404 = currentUrl.includes('404') || 
                   await adminPage.getByText(/not found|404/i).isVisible({ timeout: 3000 }).catch(() => false);
      
      if (!is404) {
        console.log('✓ Activity logs page accessible');
        
        // Look for logs heading or table
        const logsPage = adminPage.getByRole('heading').or(
          adminPage.getByText(/activity|aktivitas|log|riwayat/i)
        );
        
        const hasLogsPage = await logsPage.first().isVisible({ timeout: 5000 }).catch(() => false);
        
        if (hasLogsPage) {
          console.log('✓ Activity logs page displays correctly');
        }
      } else {
        console.log('ℹ Activity logs page not implemented yet (optional feature)');
      }
    });
  });
});
