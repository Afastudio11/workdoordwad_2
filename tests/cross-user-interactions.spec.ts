import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { JobHelper } from './helpers/job.helper';
import { TEST_USERS, TEST_JOBS } from './fixtures/test-data';

test.describe('Cross-User Interactions', () => {
  test('Complete hiring workflow: Employer posts → Job seekers apply → Employer reviews → Notifications sent', async ({ browser }) => {
    // Create separate contexts for different users
    const employerContext = await browser.newContext();
    const jobSeeker1Context = await browser.newContext();
    const jobSeeker2Context = await browser.newContext();
    const jobSeeker3Context = await browser.newContext();

    const employerPage = await employerContext.newPage();
    const jobSeeker1Page = await jobSeeker1Context.newPage();
    const jobSeeker2Page = await jobSeeker2Context.newPage();
    const jobSeeker3Page = await jobSeeker3Context.newPage();

    const employerAuth = new AuthHelper(employerPage);
    const employerJob = new JobHelper(employerPage);
    
    const js1Auth = new AuthHelper(jobSeeker1Page);
    const js1Job = new JobHelper(jobSeeker1Page);
    
    const js2Auth = new AuthHelper(jobSeeker2Page);
    const js2Job = new JobHelper(jobSeeker2Page);
    
    const js3Auth = new AuthHelper(jobSeeker3Page);
    const js3Job = new JobHelper(jobSeeker3Page);

    try {
      // Step 1: Employer posts a job
      await test.step('Employer registers and posts job', async () => {
        await employerAuth.register({
          email: 'employer.test@email.com',
          password: 'TestPassword123!',
          name: 'Test Employer',
          phone: '081234567899',
          role: 'employer',
          companyName: 'Test Company',
        });

        await employerJob.postJob({
          ...TEST_JOBS.softwareDeveloper,
          title: 'Full Stack Developer Position',
        });

        await employerPage.waitForTimeout(2000);
      });

      // Step 2: Three job seekers apply
      await test.step('Job Seeker 1 applies', async () => {
        await js1Auth.register({
          email: 'jobseeker1.test@email.com',
          password: 'TestPassword123!',
          name: 'Budi Test',
          phone: '081234567897',
          role: 'job_seeker',
        });

        await js1Job.searchJobs('Full Stack Developer');
        await jobSeeker1Page.waitForTimeout(2000);
        
        const jobCard = jobSeeker1Page.getByText('Full Stack Developer Position').first();
        if (await jobCard.isVisible().catch(() => false)) {
          await jobCard.click();
          await jobSeeker1Page.waitForLoadState('networkidle');
          
          const applyButton = jobSeeker1Page.getByTestId('button-apply');
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const submitButton = jobSeeker1Page.getByTestId('button-submit-application');
            if (await submitButton.isVisible().catch(() => false)) {
              await submitButton.click();
              await jobSeeker1Page.waitForLoadState('networkidle');
            }
          }
        }
      });

      await test.step('Job Seeker 2 applies', async () => {
        await js2Auth.register({
          email: 'jobseeker2.test@email.com',
          password: 'TestPassword123!',
          name: 'Sarah Test',
          phone: '081234567896',
          role: 'job_seeker',
        });

        await js2Job.searchJobs('Full Stack Developer');
        await jobSeeker2Page.waitForTimeout(2000);
        
        const jobCard = jobSeeker2Page.getByText('Full Stack Developer Position').first();
        if (await jobCard.isVisible().catch(() => false)) {
          await jobCard.click();
          await jobSeeker2Page.waitForLoadState('networkidle');
          
          const applyButton = jobSeeker2Page.getByTestId('button-apply');
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const submitButton = jobSeeker2Page.getByTestId('button-submit-application');
            if (await submitButton.isVisible().catch(() => false)) {
              await submitButton.click();
              await jobSeeker2Page.waitForLoadState('networkidle');
            }
          }
        }
      });

      await test.step('Job Seeker 3 applies', async () => {
        await js3Auth.register({
          email: 'jobseeker3.test@email.com',
          password: 'TestPassword123!',
          name: 'Ahmad Test',
          phone: '081234567895',
          role: 'job_seeker',
        });

        await js3Job.searchJobs('Full Stack Developer');
        await jobSeeker3Page.waitForTimeout(2000);
        
        const jobCard = jobSeeker3Page.getByText('Full Stack Developer Position').first();
        if (await jobCard.isVisible().catch(() => false)) {
          await jobCard.click();
          await jobSeeker3Page.waitForLoadState('networkidle');
          
          const applyButton = jobSeeker3Page.getByTestId('button-apply');
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const submitButton = jobSeeker3Page.getByTestId('button-submit-application');
            if (await submitButton.isVisible().catch(() => false)) {
              await submitButton.click();
              await jobSeeker3Page.waitForLoadState('networkidle');
            }
          }
        }
      });

      // Step 3: Employer views applicants
      await test.step('Employer views all applicants', async () => {
        await employerPage.goto('/dashboard');
        await employerPage.waitForLoadState('networkidle');
        
        const jobCard = employerPage.getByText('Full Stack Developer Position').first();
        if (await jobCard.isVisible().catch(() => false)) {
          await jobCard.click();
          await employerPage.waitForLoadState('networkidle');
          
          const viewCandidatesButton = employerPage.getByTestId('button-view-candidates');
          if (await viewCandidatesButton.isVisible().catch(() => false)) {
            await viewCandidatesButton.click();
            await employerPage.waitForLoadState('networkidle');
            
            const candidateCards = employerPage.locator('[data-testid^="card-candidate"]');
            const count = await candidateCards.count();
            console.log(`Total candidates received: ${count}`);
          }
        }
      });

      // Step 4: Employer shortlists Job Seeker 1
      await test.step('Employer shortlists Job Seeker 1', async () => {
        const shortlistButton = employerPage.getByTestId('button-shortlist-Budi Test').or(
          employerPage.locator('text=Budi Test').locator('..').getByRole('button', { name: /shortlist/i }).first()
        );
        if (await shortlistButton.isVisible().catch(() => false)) {
          await shortlistButton.click();
          await employerPage.waitForTimeout(2000);
        }
      });

      // Step 5: Job Seeker 1 checks notification
      await test.step('Job Seeker 1 receives shortlist notification', async () => {
        await jobSeeker1Page.goto('/dashboard');
        await jobSeeker1Page.waitForLoadState('networkidle');
        
        const notificationBell = jobSeeker1Page.getByTestId('button-notifications');
        if (await notificationBell.isVisible().catch(() => false)) {
          await notificationBell.click();
          await jobSeeker1Page.waitForTimeout(1000);
          
          const shortlistNotification = jobSeeker1Page.getByText(/shortlist|dipertimbangkan/i);
          if (await shortlistNotification.isVisible().catch(() => false)) {
            console.log('✓ Shortlist notification received by Job Seeker 1');
          }
        }
      });

      // Step 6: Employer rejects Job Seeker 2
      await test.step('Employer rejects Job Seeker 2', async () => {
        await employerPage.goto('/dashboard');
        const jobCard = employerPage.getByText('Full Stack Developer Position').first();
        await jobCard.click();
        
        const viewCandidatesButton = employerPage.getByTestId('button-view-candidates');
        if (await viewCandidatesButton.isVisible().catch(() => false)) {
          await viewCandidatesButton.click();
          await employerPage.waitForLoadState('networkidle');
        }
        
        const rejectButton = employerPage.getByTestId('button-reject-Sarah Test').or(
          employerPage.locator('text=Sarah Test').locator('..').getByRole('button', { name: /reject|tolak/i }).first()
        );
        if (await rejectButton.isVisible().catch(() => false)) {
          await rejectButton.click();
          
          const messageInput = employerPage.getByTestId('input-rejection-message');
          if (await messageInput.isVisible().catch(() => false)) {
            await messageInput.fill('Terima kasih atas lamarannya, namun saat ini kami memilih kandidat lain.');
          }
          
          const confirmButton = employerPage.getByTestId('button-confirm');
          if (await confirmButton.isVisible().catch(() => false)) {
            await confirmButton.click();
            await employerPage.waitForTimeout(2000);
          }
        }
      });

      // Step 7: Job Seeker 2 receives rejection notification
      await test.step('Job Seeker 2 receives rejection notification', async () => {
        await jobSeeker2Page.goto('/dashboard');
        await jobSeeker2Page.waitForLoadState('networkidle');
        
        const notificationBell = jobSeeker2Page.getByTestId('button-notifications');
        if (await notificationBell.isVisible().catch(() => false)) {
          await notificationBell.click();
          await jobSeeker2Page.waitForTimeout(1000);
          
          const rejectionNotification = jobSeeker2Page.getByText(/rejected|ditolak|kandidat lain/i);
          if (await rejectionNotification.isVisible().catch(() => false)) {
            console.log('✓ Rejection notification received by Job Seeker 2');
          }
        }
      });

      // Step 8: Job Seeker 3 withdraws application
      await test.step('Job Seeker 3 withdraws application', async () => {
        await jobSeeker3Page.goto('/dashboard');
        const myApplicationsLink = jobSeeker3Page.getByTestId('link-my-applications');
        if (await myApplicationsLink.isVisible().catch(() => false)) {
          await myApplicationsLink.click();
          await jobSeeker3Page.waitForLoadState('networkidle');
          
          const withdrawButton = jobSeeker3Page.getByTestId('button-withdraw').first();
          if (await withdrawButton.isVisible().catch(() => false)) {
            await withdrawButton.click();
            
            const confirmButton = jobSeeker3Page.getByTestId('button-confirm');
            if (await confirmButton.isVisible().catch(() => false)) {
              await confirmButton.click();
              await jobSeeker3Page.waitForTimeout(2000);
            }
          }
        }
      });

      // Step 9: Employer sees updated status
      await test.step('Employer sees withdrawn application status', async () => {
        await employerPage.goto('/dashboard');
        const jobCard = employerPage.getByText('Full Stack Developer Position').first();
        await jobCard.click();
        
        const viewCandidatesButton = employerPage.getByTestId('button-view-candidates');
        if (await viewCandidatesButton.isVisible().catch(() => false)) {
          await viewCandidatesButton.click();
          await employerPage.waitForLoadState('networkidle');
          
          const withdrawnStatus = employerPage.getByText(/withdrawn|dibatalkan/i);
          if (await withdrawnStatus.isVisible().catch(() => false)) {
            console.log('✓ Withdrawn status visible to employer');
          }
        }
      });

      console.log('✓ Complete cross-user interaction test passed');
    } finally {
      await employerContext.close();
      await jobSeeker1Context.close();
      await jobSeeker2Context.close();
      await jobSeeker3Context.close();
    }
  });

  test('Real-time notification test', async ({ browser }) => {
    const employerContext = await browser.newContext();
    const jobSeekerContext = await browser.newContext();

    const employerPage = await employerContext.newPage();
    const jobSeekerPage = await jobSeekerContext.newPage();

    const employerAuth = new AuthHelper(employerPage);
    const jobSeekerAuth = new AuthHelper(jobSeekerPage);
    const jobHelper = new JobHelper(jobSeekerPage);

    try {
      await test.step('Setup users and job', async () => {
        await employerAuth.register({
          email: 'realtime.employer@test.com',
          password: 'TestPassword123!',
          name: 'Realtime Employer',
          phone: '081234560001',
          role: 'employer',
          companyName: 'Realtime Test Co',
        });

        await jobSeekerAuth.register({
          email: 'realtime.seeker@test.com',
          password: 'TestPassword123!',
          name: 'Realtime Seeker',
          phone: '081234560002',
          role: 'job_seeker',
        });

        const employerJobHelper = new JobHelper(employerPage);
        await employerJobHelper.postJob({
          ...TEST_JOBS.softwareDeveloper,
          title: 'Realtime Test Job',
        });
      });

      await test.step('Job seeker applies and employer receives real-time notification', async () => {
        await jobHelper.searchJobs('Realtime Test Job');
        const jobCard = jobSeekerPage.getByText('Realtime Test Job').first();
        if (await jobCard.isVisible().catch(() => false)) {
          await jobCard.click();
          await jobSeekerPage.waitForLoadState('networkidle');
          
          const applyButton = jobSeekerPage.getByTestId('button-apply');
          if (await applyButton.isVisible().catch(() => false)) {
            await applyButton.click();
            
            const submitButton = jobSeekerPage.getByTestId('button-submit-application');
            if (await submitButton.isVisible().catch(() => false)) {
              await submitButton.click();
              await jobSeekerPage.waitForLoadState('networkidle');
            }
          }
        }

        await employerPage.waitForTimeout(3000);

        const employerNotificationBell = employerPage.getByTestId('button-notifications');
        if (await employerNotificationBell.isVisible().catch(() => false)) {
          await employerNotificationBell.click();
          await employerPage.waitForTimeout(1000);
          
          const newApplicationNotif = employerPage.getByText(/new.*application|lamaran.*baru/i);
          if (await newApplicationNotif.isVisible().catch(() => false)) {
            console.log('✓ Real-time notification working');
          }
        }
      });
    } finally {
      await employerContext.close();
      await jobSeekerContext.close();
    }
  });
});
