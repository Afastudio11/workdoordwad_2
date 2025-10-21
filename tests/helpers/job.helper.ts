import { Page, expect } from '@playwright/test';

export class JobHelper {
  constructor(private page: Page) {}

  async postJob(jobData: {
    title: string;
    description: string;
    requirements: string;
    location: string;
    type: string;
    salary: number;
    maxSalary?: number;
    category: string;
  }) {
    await this.page.goto('/dashboard');
    
    const postJobButton = this.page.getByTestId('button-post-job').or(
      this.page.getByRole('link', { name: /posting|post|tambah.*lowongan/i })
    );
    await postJobButton.click();

    await this.page.getByTestId('input-title').fill(jobData.title);
    await this.page.getByTestId('input-description').fill(jobData.description);
    await this.page.getByTestId('input-requirements').fill(jobData.requirements);
    await this.page.getByTestId('input-location').fill(jobData.location);
    
    const typeSelect = this.page.getByTestId('select-type');
    if (await typeSelect.isVisible().catch(() => false)) {
      await typeSelect.click();
      await this.page.getByRole('option', { name: jobData.type }).click();
    }

    await this.page.getByTestId('input-salary').fill(jobData.salary.toString());
    
    if (jobData.maxSalary) {
      const maxSalaryInput = this.page.getByTestId('input-max-salary');
      if (await maxSalaryInput.isVisible().catch(() => false)) {
        await maxSalaryInput.fill(jobData.maxSalary.toString());
      }
    }

    const categorySelect = this.page.getByTestId('select-category');
    if (await categorySelect.isVisible().catch(() => false)) {
      await categorySelect.click();
      await this.page.getByRole('option', { name: jobData.category }).click();
    }

    await this.page.getByTestId('button-submit').click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchJobs(keyword: string) {
    await this.page.goto('/');
    
    const searchInput = this.page.getByTestId('input-search').or(
      this.page.getByPlaceholder(/cari.*pekerjaan/i)
    );
    await searchInput.fill(keyword);
    
    const searchButton = this.page.getByTestId('button-search').or(
      this.page.locator('button[type="submit"]').first()
    );
    await searchButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async applyToJob(jobTitle: string, coverLetter?: string) {
    const jobCard = this.page.getByTestId(`card-job-${jobTitle}`).or(
      this.page.getByText(jobTitle).first()
    );
    await jobCard.click();

    await this.page.waitForLoadState('networkidle');

    const applyButton = this.page.getByTestId('button-apply').or(
      this.page.getByRole('button', { name: /lamar|apply/i })
    );
    await applyButton.click();

    if (coverLetter) {
      const coverLetterInput = this.page.getByTestId('input-cover-letter').or(
        this.page.getByLabel(/cover.*letter|surat.*lamaran/i)
      );
      if (await coverLetterInput.isVisible().catch(() => false)) {
        await coverLetterInput.fill(coverLetter);
      }
    }

    const submitButton = this.page.getByTestId('button-submit-application').or(
      this.page.getByRole('button', { name: /kirim|submit/i })
    );
    await submitButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async saveJobToFavorites(jobTitle: string) {
    const saveButton = this.page.getByTestId(`button-save-${jobTitle}`).or(
      this.page.locator('[aria-label*="save"]').or(
        this.page.locator('[aria-label*="simpan"]')
      ).first()
    );
    await saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getPostedJobsCount(): Promise<number> {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    
    const jobCards = this.page.locator('[data-testid^="card-job-"]');
    return await jobCards.count();
  }

  async viewCandidates(jobTitle: string) {
    const jobCard = this.page.getByTestId(`card-job-${jobTitle}`).or(
      this.page.getByText(jobTitle).first()
    );
    await jobCard.click();

    const viewCandidatesButton = this.page.getByTestId('button-view-candidates').or(
      this.page.getByRole('link', { name: /kandidat|applicant/i })
    );
    await viewCandidatesButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async shortlistCandidate(candidateName: string) {
    const shortlistButton = this.page.getByTestId(`button-shortlist-${candidateName}`).or(
      this.page.locator(`text=${candidateName}`).locator('..').getByRole('button', { name: /shortlist/i })
    );
    await shortlistButton.click();
    await this.page.waitForTimeout(1000);
  }

  async rejectCandidate(candidateName: string, message?: string) {
    const rejectButton = this.page.getByTestId(`button-reject-${candidateName}`).or(
      this.page.locator(`text=${candidateName}`).locator('..').getByRole('button', { name: /reject|tolak/i })
    );
    await rejectButton.click();

    if (message) {
      const messageInput = this.page.getByTestId('input-rejection-message');
      if (await messageInput.isVisible().catch(() => false)) {
        await messageInput.fill(message);
      }
    }

    const confirmButton = this.page.getByTestId('button-confirm').or(
      this.page.getByRole('button', { name: /confirm|ya/i })
    );
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
    
    await this.page.waitForTimeout(1000);
  }
}
