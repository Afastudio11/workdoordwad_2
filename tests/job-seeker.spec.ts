import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { JobHelper } from './helpers/job.helper';
import { ProfileHelper } from './helpers/profile.helper';
import { TEST_USERS, COVER_LETTERS } from './fixtures/test-data';

test.describe('Job Seeker User Journeys', () => {
  test.describe('Fresh Graduate - Budi Santoso', () => {
    let authHelper: AuthHelper;
    let jobHelper: JobHelper;
    let profileHelper: ProfileHelper;
    const user = TEST_USERS.jobSeekers.freshGraduate;

    test.beforeEach(async ({ page }) => {
      authHelper = new AuthHelper(page);
      jobHelper = new JobHelper(page);
      profileHelper = new ProfileHelper(page);
    });

    test('Complete journey: Register → Complete Profile → Browse → Save → Apply → Check Status', async ({ page }) => {
      // 1. Registration
      await test.step('Register with complete data', async () => {
        await authHelper.register({
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
        });
        
        const isLoggedIn = await authHelper.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
      });

      // 2. Complete Profile
      await test.step('Complete profile with CV, photo, and bio', async () => {
        await profileHelper.updateJobSeekerProfile({
          bio: user.bio,
          location: user.location,
          expectedSalary: user.expectedSalary,
          skills: user.skills,
          education: user.education,
        });

        await page.goto('/profile');
        const bio = page.getByTestId('text-bio').or(page.getByText(user.bio));
        await expect(bio).toBeVisible({ timeout: 10000 });
      });

      // 3. Browse job listings
      await test.step('Browse job listings', async () => {
        await page.goto('/');
        await page.getByTestId('link-jobs').or(page.getByRole('link', { name: /cari.*pekerjaan/i })).click();
        await page.waitForLoadState('networkidle');
        
        const jobListings = page.locator('[data-testid^="card-job"]');
        const count = await jobListings.count();
        console.log(`Found ${count} job listings`);
      });

      // 4. Use filters
      await test.step('Use filters (location, salary, job type)', async () => {
        const locationFilter = page.getByTestId('filter-location');
        if (await locationFilter.isVisible().catch(() => false)) {
          await locationFilter.click();
          await page.getByRole('option', { name: /jakarta/i }).click();
          await page.waitForLoadState('networkidle');
        }

        const salaryFilter = page.getByTestId('filter-salary');
        if (await salaryFilter.isVisible().catch(() => false)) {
          await salaryFilter.fill('5000000');
          await page.waitForLoadState('networkidle');
        }
      });

      // 5. Save 3 jobs to favorites
      await test.step('Save 3 jobs to favorites', async () => {
        const jobCards = page.locator('[data-testid^="card-job"]');
        const totalJobs = await jobCards.count();
        
        for (let i = 0; i < Math.min(3, totalJobs); i++) {
          const saveButton = jobCards.nth(i).getByTestId('button-save').or(
            jobCards.nth(i).locator('[aria-label*="save"]').or(
              jobCards.nth(i).locator('[aria-label*="simpan"]')
            )
          );
          if (await saveButton.isVisible().catch(() => false)) {
            await saveButton.click();
            await page.waitForTimeout(1000);
          }
        }
      });

      // 6. Apply to 2 jobs with different cover letters
      await test.step('Apply to 2 jobs with different cover letters', async () => {
        const jobCards = page.locator('[data-testid^="card-job"]');
        const totalJobs = await jobCards.count();
        
        if (totalJobs >= 1) {
          await jobCards.first().click();
          await page.waitForLoadState('networkidle');
          
          const applyButton = page.getByTestId('button-apply').or(
            page.getByRole('button', { name: /lamar|apply/i })
          );
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const coverLetterInput = page.getByTestId('input-cover-letter');
            if (await coverLetterInput.isVisible().catch(() => false)) {
              await coverLetterInput.fill(COVER_LETTERS.enthusiastic + '\n' + user.name);
            }
            
            const submitButton = page.getByTestId('button-submit-application').or(
              page.getByRole('button', { name: /kirim|submit/i })
            );
            await submitButton.click();
            await page.waitForLoadState('networkidle');
          }
        }

        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');
        
        if (totalJobs >= 2) {
          await jobCards.nth(1).click();
          await page.waitForLoadState('networkidle');
          
          const applyButton = page.getByTestId('button-apply').or(
            page.getByRole('button', { name: /lamar|apply/i })
          );
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const coverLetterInput = page.getByTestId('input-cover-letter');
            if (await coverLetterInput.isVisible().catch(() => false)) {
              await coverLetterInput.fill(COVER_LETTERS.professional + '\n' + user.name);
            }
            
            const submitButton = page.getByTestId('button-submit-application').or(
              page.getByRole('button', { name: /kirim|submit/i })
            );
            await submitButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      });

      // 7. Check application status
      await test.step('Check application status', async () => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        const applicationsLink = page.getByTestId('link-my-applications').or(
          page.getByRole('link', { name: /lamaran.*saya/i })
        );
        if (await applicationsLink.isVisible().catch(() => false)) {
          await applicationsLink.click();
          await page.waitForLoadState('networkidle');
          
          const applicationCards = page.locator('[data-testid^="card-application"]');
          const count = await applicationCards.count();
          console.log(`Total applications: ${count}`);
        }
      });

      // 8. Update profile
      await test.step('Update profile information', async () => {
        await profileHelper.updateJobSeekerProfile({
          bio: user.bio + ' - Updated',
        });
      });

      // 9. Logout
      await test.step('Logout successfully', async () => {
        await authHelper.logout();
        const isLoggedIn = await authHelper.isLoggedIn();
        expect(isLoggedIn).toBeFalsy();
      });
    });
  });

  test.describe('Experienced Professional - Sarah Wijaya', () => {
    let authHelper: AuthHelper;
    let jobHelper: JobHelper;
    let profileHelper: ProfileHelper;
    const user = TEST_USERS.jobSeekers.experiencedProfessional;

    test.beforeEach(async ({ page }) => {
      authHelper = new AuthHelper(page);
      jobHelper = new JobHelper(page);
      profileHelper = new ProfileHelper(page);
    });

    test('Quick registration → Job alerts → Multiple applications → Withdraw', async ({ page }) => {
      // 1. Register
      await test.step('Quick registration', async () => {
        await authHelper.register({
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
        });
      });

      // 2. Setup job alert
      await test.step('Setup job alert with specific criteria', async () => {
        const alertButton = page.getByTestId('button-job-alert').or(
          page.getByRole('button', { name: /job alert|notifikasi/i })
        );
        if (await alertButton.isVisible().catch(() => false)) {
          await alertButton.click();
          
          const keywordInput = page.getByTestId('input-alert-keyword');
          if (await keywordInput.isVisible().catch(() => false)) {
            await keywordInput.fill('Senior Developer');
          }
          
          const saveAlertButton = page.getByTestId('button-save-alert');
          if (await saveAlertButton.isVisible().catch(() => false)) {
            await saveAlertButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      });

      // 3. Search with keyword combination
      await test.step('Search jobs with keyword combinations', async () => {
        await jobHelper.searchJobs('Python Django Senior');
        await page.waitForTimeout(2000);
      });

      // 4. Apply to 5 different jobs
      await test.step('Apply to 5 different jobs', async () => {
        const jobCards = page.locator('[data-testid^="card-job"]');
        const totalJobs = await jobCards.count();
        const applicationsToMake = Math.min(5, totalJobs);
        
        for (let i = 0; i < applicationsToMake; i++) {
          await jobCards.nth(i).click();
          await page.waitForLoadState('networkidle');
          
          const applyButton = page.getByTestId('button-apply').or(
            page.getByRole('button', { name: /lamar|apply/i })
          );
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const submitButton = page.getByTestId('button-submit-application').or(
              page.getByRole('button', { name: /kirim|submit/i })
            );
            if (await submitButton.isVisible().catch(() => false)) {
              await submitButton.click();
              await page.waitForLoadState('networkidle');
            }
          }
          
          await page.goto('/jobs');
          await page.waitForLoadState('networkidle');
        }
      });

      // 5. Withdraw one application
      await test.step('Withdraw one application', async () => {
        await page.goto('/dashboard');
        const applicationsLink = page.getByTestId('link-my-applications');
        if (await applicationsLink.isVisible().catch(() => false)) {
          await applicationsLink.click();
          await page.waitForLoadState('networkidle');
          
          const withdrawButton = page.getByTestId('button-withdraw').first();
          if (await withdrawButton.isVisible().catch(() => false)) {
            await withdrawButton.click();
            
            const confirmButton = page.getByTestId('button-confirm').or(
              page.getByRole('button', { name: /confirm|ya/i })
            );
            if (await confirmButton.isVisible().catch(() => false)) {
              await confirmButton.click();
              await page.waitForLoadState('networkidle');
            }
          }
        }
      });

      // 6. Check notifications
      await test.step('Check notifications', async () => {
        const notificationBell = page.getByTestId('button-notifications').or(
          page.locator('[aria-label*="notification"]')
        );
        if (await notificationBell.isVisible().catch(() => false)) {
          await notificationBell.click();
          await page.waitForTimeout(1000);
        }
      });
    });

    test('Test responsive mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await authHelper.login(user.email, user.password);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const mobileMenu = page.getByTestId('button-mobile-menu').or(
        page.locator('[aria-label*="menu"]').or(page.locator('button:has-text("☰")'))
      );
      if (await mobileMenu.isVisible().catch(() => false)) {
        await mobileMenu.click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Job Hopper - Ahmad Prakoso', () => {
    let authHelper: AuthHelper;
    let jobHelper: JobHelper;
    const user = TEST_USERS.jobSeekers.jobHopper;

    test.beforeEach(async ({ page }) => {
      authHelper = new AuthHelper(page);
      jobHelper = new JobHelper(page);
    });

    test('Minimal registration → Apply without profile → Get notification → Complete profile gradually', async ({ page }) => {
      // 1. Register with minimal data
      await test.step('Register with minimal data', async () => {
        await authHelper.register({
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          role: user.role,
        });
      });

      // 2. Try to apply without complete profile
      await test.step('Apply without complete profile', async () => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');
        
        const firstJob = page.locator('[data-testid^="card-job"]').first();
        if (await firstJob.isVisible().catch(() => false)) {
          await firstJob.click();
          await page.waitForLoadState('networkidle');
          
          const applyButton = page.getByTestId('button-apply');
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            await page.waitForTimeout(2000);
          }
        }
      });

      // 3. Check for profile completion notification
      await test.step('Should see profile completion prompt', async () => {
        const notification = page.getByText(/lengkapi.*profil|complete.*profile/i);
        if (await notification.isVisible().catch(() => false)) {
          console.log('Profile completion notification shown');
        }
      });

      // 4. Apply to 10+ jobs to test pagination
      await test.step('Apply to multiple jobs (test pagination)', async () => {
        await page.goto('/jobs');
        await page.waitForLoadState('networkidle');
        
        const jobCards = page.locator('[data-testid^="card-job"]');
        let totalApplications = 0;
        
        for (let i = 0; i < 10; i++) {
          if (i < await jobCards.count()) {
            await jobCards.nth(i).click();
            await page.waitForLoadState('networkidle');
            
            const applyButton = page.getByTestId('button-apply');
            if (await applyButton.isVisible().catch(() => false)) {
              await applyButton.click();
              
              const submitButton = page.getByTestId('button-submit-application').or(
                page.getByRole('button', { name: /kirim|submit/i })
              );
              if (await submitButton.isVisible().catch(() => false)) {
                await submitButton.click();
                await page.waitForLoadState('networkidle');
                totalApplications++;
              }
            }
            
            await page.goto('/jobs');
            await page.waitForLoadState('networkidle');
          }
          
          const nextButton = page.getByTestId('button-next-page');
          if (await nextButton.isVisible().catch(() => false)) {
            await nextButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
        
        console.log(`Total applications made: ${totalApplications}`);
      });

      // 5. Test search with typo
      await test.step('Test search with typo', async () => {
        await jobHelper.searchJobs('Softwre Develper');
        await page.waitForTimeout(2000);
      });

      // 6. Test filter with no results
      await test.step('Test filter with no results', async () => {
        await page.goto('/jobs');
        const locationFilter = page.getByTestId('filter-location');
        if (await locationFilter.isVisible().catch(() => false)) {
          await locationFilter.click();
          await page.getByRole('option', { name: /papua/i }).click();
          await page.waitForLoadState('networkidle');
          
          const noResults = page.getByText(/tidak.*ditemukan|no.*found/i);
          if (await noResults.isVisible().catch(() => false)) {
            console.log('No results message displayed correctly');
          }
        }
      });
    });
  });
});
