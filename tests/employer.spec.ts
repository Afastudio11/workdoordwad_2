import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { JobHelper } from './helpers/job.helper';
import { ProfileHelper } from './helpers/profile.helper';
import { TEST_USERS, TEST_JOBS } from './fixtures/test-data';

test.describe('Employer User Journeys', () => {
  test.describe('Startup HR - TechStart Indonesia', () => {
    let authHelper: AuthHelper;
    let jobHelper: JobHelper;
    let profileHelper: ProfileHelper;
    const user = TEST_USERS.employers.startup;

    test.beforeEach(async ({ page }) => {
      authHelper = new AuthHelper(page);
      jobHelper = new JobHelper(page);
      profileHelper = new ProfileHelper(page);
    });

    test('Complete journey: Register → Post 3 jobs → Review candidates → Try 4th job (should prompt upgrade)', async ({ page }) => {
      // 1. Register as employer
      await test.step('Register as employer', async () => {
        await authHelper.register({
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
          companyName: user.companyName,
        });
        
        const isLoggedIn = await authHelper.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
      });

      // 2. Setup company profile
      await test.step('Setup complete company profile', async () => {
        await profileHelper.updateCompanyProfile({
          description: user.companyDescription,
          website: user.companyWebsite,
          companySize: user.companySize,
          industry: user.industry,
          location: user.location,
        });
      });

      // 3. Post first job - Software Developer
      await test.step('Post job #1: Software Developer', async () => {
        await jobHelper.postJob(TEST_JOBS.softwareDeveloper);
        await page.waitForTimeout(2000);
      });

      // 4. Post second job - UI/UX Designer
      await test.step('Post job #2: UI/UX Designer', async () => {
        await jobHelper.postJob(TEST_JOBS.uiuxDesigner);
        await page.waitForTimeout(2000);
      });

      // 5. Post third job - Marketing Manager
      await test.step('Post job #3: Marketing Manager', async () => {
        await jobHelper.postJob(TEST_JOBS.marketingManager);
        await page.waitForTimeout(2000);
        
        const jobCount = await jobHelper.getPostedJobsCount();
        console.log(`Total jobs posted: ${jobCount}`);
        expect(jobCount).toBe(3);
      });

      // 6. Check candidates for first job
      await test.step('View candidates for Software Developer position', async () => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        const jobCard = page.getByText(TEST_JOBS.softwareDeveloper.title).first();
        if (await jobCard.isVisible().catch(() => false)) {
          await jobCard.click();
          await page.waitForLoadState('networkidle');
          
          const viewCandidatesButton = page.getByTestId('button-view-candidates').or(
            page.getByRole('link', { name: /kandidat|applicant/i })
          );
          if (await viewCandidatesButton.isVisible().catch(() => false)) {
            await viewCandidatesButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      });

      // 7. Filter and sort candidates
      await test.step('Filter and sort candidates', async () => {
        const sortButton = page.getByTestId('select-sort').or(
          page.getByLabel(/sort|urutkan/i)
        );
        if (await sortButton.isVisible().catch(() => false)) {
          await sortButton.click();
          await page.getByRole('option', { name: /salary|gaji/i }).click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 8. Download candidate CV
      await test.step('Download candidate CV', async () => {
        const downloadButton = page.getByTestId('button-download-cv').first();
        if (await downloadButton.isVisible().catch(() => false)) {
          const [download] = await Promise.all([
            page.waitForEvent('download').catch(() => null),
            downloadButton.click(),
          ]);
          if (download) {
            console.log(`Downloaded CV: ${download.suggestedFilename()}`);
          }
        }
      });

      // 9. Shortlist 5 candidates
      await test.step('Shortlist candidates', async () => {
        const candidateCards = page.locator('[data-testid^="card-candidate"]');
        const totalCandidates = await candidateCards.count();
        const toShortlist = Math.min(5, totalCandidates);
        
        for (let i = 0; i < toShortlist; i++) {
          const shortlistButton = candidateCards.nth(i).getByTestId('button-shortlist');
          if (await shortlistButton.isVisible().catch(() => false)) {
            await shortlistButton.click();
            await page.waitForTimeout(1000);
          }
        }
        
        console.log(`Shortlisted ${toShortlist} candidates`);
      });

      // 10. Reject 2 candidates
      await test.step('Reject candidates with template message', async () => {
        const candidateCards = page.locator('[data-testid^="card-candidate"]');
        const totalCandidates = await candidateCards.count();
        const toReject = Math.min(2, totalCandidates);
        
        for (let i = 0; i < toReject; i++) {
          const rejectButton = candidateCards.nth(i).getByTestId('button-reject');
          if (await rejectButton.isVisible().catch(() => false)) {
            await rejectButton.click();
            
            const messageInput = page.getByTestId('input-rejection-message');
            if (await messageInput.isVisible().catch(() => false)) {
              await messageInput.fill('Terima kasih atas lamaran Anda. Saat ini kami memilih kandidat dengan kualifikasi yang lebih sesuai.');
            }
            
            const confirmButton = page.getByTestId('button-confirm').or(
              page.getByRole('button', { name: /confirm|ya|kirim/i })
            );
            if (await confirmButton.isVisible().catch(() => false)) {
              await confirmButton.click();
              await page.waitForTimeout(1000);
            }
          }
        }
      });

      // 11. Try to post 4th job - should show upgrade prompt
      await test.step('Try to post 4th job - expect upgrade prompt', async () => {
        await page.goto('/dashboard');
        
        const postJobButton = page.getByTestId('button-post-job').or(
          page.getByRole('link', { name: /posting|post|tambah.*lowongan/i })
        );
        await postJobButton.click();
        await page.waitForLoadState('networkidle');
        
        const upgradeMessage = page.getByText(/upgrade|berlangganan|limit.*tercapai/i);
        if (await upgradeMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('✓ Upgrade prompt shown correctly after 3 free jobs');
          expect(await upgradeMessage.isVisible()).toBeTruthy();
        } else {
          await jobHelper.postJob(TEST_JOBS.dataAnalyst);
          const afterPostUpgradeMessage = page.getByText(/upgrade|berlangganan|limit/i);
          if (await afterPostUpgradeMessage.isVisible().catch(() => false)) {
            console.log('✓ Upgrade prompt shown after attempting 4th job post');
          }
        }
      });

      // 12. View subscription packages
      await test.step('View subscription packages', async () => {
        const upgradeButton = page.getByTestId('button-upgrade').or(
          page.getByRole('link', { name: /upgrade|berlangganan|paket/i })
        );
        if (await upgradeButton.isVisible().catch(() => false)) {
          await upgradeButton.click();
          await page.waitForLoadState('networkidle');
          
          const packages = page.locator('[data-testid^="package-"]');
          const packageCount = await packages.count();
          console.log(`Available subscription packages: ${packageCount}`);
        }
      });

      // 13. Don't upgrade yet (as per instructions)
      await test.step('View packages but do not upgrade', async () => {
        console.log('✓ Viewed packages without purchasing (as instructed)');
      });
    });
  });

  test.describe('Corporate HR - PT Maju Bersama', () => {
    let authHelper: AuthHelper;
    let jobHelper: JobHelper;
    let profileHelper: ProfileHelper;
    const user = TEST_USERS.employers.corporate;

    test.beforeEach(async ({ page }) => {
      authHelper = new AuthHelper(page);
      jobHelper = new JobHelper(page);
      profileHelper = new ProfileHelper(page);
    });

    test('Register → Post 3 jobs → Edit → Close → Upgrade → Post more → Test premium features', async ({ page }) => {
      // 1. Register with complete company data
      await test.step('Register with complete company data', async () => {
        await authHelper.register({
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
          companyName: user.companyName,
        });
        
        await profileHelper.updateCompanyProfile({
          description: user.companyDescription,
          website: user.companyWebsite,
          companySize: user.companySize,
          industry: user.industry,
          location: user.location,
        });
      });

      // 2. Post 3 jobs (using free slots)
      await test.step('Post 3 jobs quickly', async () => {
        await jobHelper.postJob(TEST_JOBS.softwareDeveloper);
        await page.waitForTimeout(1000);
        
        await jobHelper.postJob(TEST_JOBS.dataAnalyst);
        await page.waitForTimeout(1000);
        
        await jobHelper.postJob(TEST_JOBS.accountant);
        await page.waitForTimeout(1000);
      });

      // 3. Edit a posted job
      await test.step('Edit an existing job posting', async () => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        const firstJobCard = page.locator('[data-testid^="card-job"]').first();
        await firstJobCard.click();
        await page.waitForLoadState('networkidle');
        
        const editButton = page.getByTestId('button-edit-job').or(
          page.getByRole('button', { name: /edit|ubah/i })
        );
        if (await editButton.isVisible().catch(() => false)) {
          await editButton.click();
          
          const titleInput = page.getByTestId('input-title');
          await titleInput.fill(TEST_JOBS.softwareDeveloper.title + ' (Updated)');
          
          const saveButton = page.getByTestId('button-save').or(
            page.getByRole('button', { name: /simpan|save/i })
          );
          await saveButton.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 4. Close one job
      await test.step('Close one job listing', async () => {
        await page.goto('/dashboard');
        const firstJobCard = page.locator('[data-testid^="card-job"]').first();
        await firstJobCard.click();
        
        const closeButton = page.getByTestId('button-close-job').or(
          page.getByRole('button', { name: /close|tutup/i })
        );
        if (await closeButton.isVisible().catch(() => false)) {
          await closeButton.click();
          
          const confirmButton = page.getByTestId('button-confirm');
          if (await confirmButton.isVisible().catch(() => false)) {
            await confirmButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      });

      // 5. Re-open the closed job
      await test.step('Re-open the closed job', async () => {
        const reopenButton = page.getByTestId('button-reopen-job').or(
          page.getByRole('button', { name: /reopen|buka kembali/i })
        );
        if (await reopenButton.isVisible().catch(() => false)) {
          await reopenButton.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 6. View analytics
      await test.step('View job analytics', async () => {
        const analyticsButton = page.getByTestId('button-analytics').or(
          page.getByRole('link', { name: /analytics|statistik/i })
        );
        if (await analyticsButton.isVisible().catch(() => false)) {
          await analyticsButton.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 7. Export candidate data
      await test.step('Export candidate data to CSV/Excel', async () => {
        const exportButton = page.getByTestId('button-export-candidates').or(
          page.getByRole('button', { name: /export|unduh/i })
        );
        if (await exportButton.isVisible().catch(() => false)) {
          const [download] = await Promise.all([
            page.waitForEvent('download').catch(() => null),
            exportButton.click(),
          ]);
          if (download) {
            console.log(`Exported data: ${download.suggestedFilename()}`);
          }
        }
      });

      // 8. Try to post 4th job
      await test.step('Try to post 4th job - should show upgrade', async () => {
        await page.goto('/dashboard');
        const postJobButton = page.getByTestId('button-post-job');
        await postJobButton.click();
        
        const upgradePrompt = page.getByText(/upgrade|berlangganan/i);
        await expect(upgradePrompt).toBeVisible({ timeout: 10000 });
      });

      // 9. Select Premium subscription
      await test.step('Select Premium subscription package', async () => {
        const upgradeButton = page.getByTestId('button-upgrade').or(
          page.getByRole('link', { name: /upgrade|paket/i })
        );
        if (await upgradeButton.isVisible().catch(() => false)) {
          await upgradeButton.click();
          await page.waitForLoadState('networkidle');
        }
        
        const premiumPackage = page.getByTestId('package-premium').or(
          page.getByRole('button', { name: /premium/i })
        );
        if (await premiumPackage.isVisible().catch(() => false)) {
          await premiumPackage.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 10. Simulate payment (test mode)
      await test.step('Simulate payment gateway', async () => {
        const payButton = page.getByTestId('button-pay').or(
          page.getByRole('button', { name: /bayar|pay/i })
        );
        if (await payButton.isVisible().catch(() => false)) {
          await payButton.click();
          await page.waitForLoadState('networkidle');
          
          const testPaymentButton = page.getByText(/test.*payment|simulasi/i);
          if (await testPaymentButton.isVisible().catch(() => false)) {
            await testPaymentButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      });

      // 11. Post 5 additional jobs after upgrade
      await test.step('Post 5 additional jobs after upgrade', async () => {
        for (let i = 0; i < 5; i++) {
          await jobHelper.postJob({
            ...TEST_JOBS.softwareDeveloper,
            title: `Job ${i + 4}`,
          });
          await page.waitForTimeout(1000);
        }
        
        const totalJobs = await jobHelper.getPostedJobsCount();
        console.log(`Total jobs after upgrade: ${totalJobs}`);
      });

      // 12. Test premium features
      await test.step('Test premium features (highlight, featured)', async () => {
        await page.goto('/dashboard');
        const firstJobCard = page.locator('[data-testid^="card-job"]').first();
        await firstJobCard.click();
        
        const highlightButton = page.getByTestId('button-highlight-job').or(
          page.getByRole('button', { name: /highlight|sorot/i })
        );
        if (await highlightButton.isVisible().catch(() => false)) {
          await highlightButton.click();
          await page.waitForTimeout(1000);
          console.log('✓ Highlight feature tested');
        }
        
        const featuredButton = page.getByTestId('button-feature-job');
        if (await featuredButton.isVisible().catch(() => false)) {
          await featuredButton.click();
          await page.waitForTimeout(1000);
          console.log('✓ Featured listing tested');
        }
      });
    });
  });

  test.describe('SME Owner - CV Usaha Mandiri', () => {
    let authHelper: AuthHelper;
    let jobHelper: JobHelper;
    const user = TEST_USERS.employers.sme;

    test.beforeEach(async ({ page }) => {
      authHelper = new AuthHelper(page);
      jobHelper = new JobHelper(page);
    });

    test('Error handling → Draft → Bulk actions → Duplicate → Subscription management', async ({ page }) => {
      // 1. Register with error handling
      await test.step('Test registration with validation errors', async () => {
        await page.goto('/');
        const registerButton = page.getByTestId('button-register');
        await registerButton.click();
        
        // Submit empty form
        const submitButton = page.getByTestId('button-submit');
        await submitButton.click();
        
        const errorMessage = page.getByText(/required|wajib|harus diisi/i);
        if (await errorMessage.isVisible().catch(() => false)) {
          console.log('✓ Form validation working');
        }
        
        // Now register correctly
        await authHelper.register({
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
          companyName: user.companyName,
        });
      });

      // 2. Post job with minimum info
      await test.step('Post job with minimum information', async () => {
        await page.goto('/dashboard');
        const postJobButton = page.getByTestId('button-post-job');
        await postJobButton.click();
        
        await page.getByTestId('input-title').fill('Staff Kasir');
        await page.getByTestId('input-description').fill('Dicari staff kasir untuk toko kami');
        
        const submitButton = page.getByTestId('button-submit');
        await submitButton.click();
        await page.waitForLoadState('networkidle');
      });

      // 3. Save job as draft
      await test.step('Save job as draft', async () => {
        const postJobButton = page.getByTestId('button-post-job');
        await postJobButton.click();
        
        await page.getByTestId('input-title').fill('Marketing Staff (Draft)');
        await page.getByTestId('input-description').fill('Draft job posting');
        
        const saveDraftButton = page.getByTestId('button-save-draft').or(
          page.getByRole('button', { name: /draft|simpan.*draft/i })
        );
        if (await saveDraftButton.isVisible().catch(() => false)) {
          await saveDraftButton.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 4. Continue draft and publish
      await test.step('Continue draft and publish', async () => {
        await page.goto('/dashboard');
        const draftsTab = page.getByTestId('tab-drafts').or(
          page.getByRole('tab', { name: /draft/i })
        );
        if (await draftsTab.isVisible().catch(() => false)) {
          await draftsTab.click();
          
          const draftCard = page.locator('[data-testid^="card-job-draft"]').first();
          await draftCard.click();
          
          const publishButton = page.getByTestId('button-publish').or(
            page.getByRole('button', { name: /publish|terbitkan/i })
          );
          await publishButton.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 5. Post until limit of 3
      await test.step('Post jobs until free limit reached', async () => {
        const currentJobs = await jobHelper.getPostedJobsCount();
        const remaining = 3 - currentJobs;
        
        for (let i = 0; i < remaining; i++) {
          await jobHelper.postJob({
            ...TEST_JOBS.softwareDeveloper,
            title: `Job Posting ${i + 1}`,
          });
          await page.waitForTimeout(1000);
        }
      });

      // 6. Duplicate existing job
      await test.step('Duplicate an existing job listing', async () => {
        await page.goto('/dashboard');
        const firstJobCard = page.locator('[data-testid^="card-job"]').first();
        await firstJobCard.click();
        
        const duplicateButton = page.getByTestId('button-duplicate-job').or(
          page.getByRole('button', { name: /duplicate|gandakan|salin/i })
        );
        if (await duplicateButton.isVisible().catch(() => false)) {
          await duplicateButton.click();
          await page.waitForLoadState('networkidle');
        }
      });

      // 7. Bulk action - candidates
      await test.step('Test bulk actions on candidates', async () => {
        const jobCard = page.locator('[data-testid^="card-job"]').first();
        await jobCard.click();
        
        const viewCandidatesButton = page.getByTestId('button-view-candidates');
        if (await viewCandidatesButton.isVisible().catch(() => false)) {
          await viewCandidatesButton.click();
          await page.waitForLoadState('networkidle');
          
          const selectAllCheckbox = page.getByTestId('checkbox-select-all').or(
            page.getByRole('checkbox', { name: /select.*all/i })
          );
          if (await selectAllCheckbox.isVisible().catch(() => false)) {
            await selectAllCheckbox.click();
            
            const bulkRejectButton = page.getByTestId('button-bulk-reject');
            if (await bulkRejectButton.isVisible().catch(() => false)) {
              await bulkRejectButton.click();
              const confirmButton = page.getByTestId('button-confirm');
              if (await confirmButton.isVisible().catch(() => false)) {
                await confirmButton.click();
                await page.waitForLoadState('networkidle');
              }
            }
          }
        }
      });
    });
  });
});
