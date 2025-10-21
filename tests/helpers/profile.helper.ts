import { Page } from '@playwright/test';
import path from 'path';

export class ProfileHelper {
  constructor(private page: Page) {}

  async updateJobSeekerProfile(profileData: {
    bio?: string;
    location?: string;
    expectedSalary?: number;
    skills?: string[];
    education?: string;
  }) {
    await this.page.goto('/profile');
    
    const editButton = this.page.getByTestId('button-edit-profile').or(
      this.page.getByRole('button', { name: /edit|ubah/i })
    );
    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
    }

    if (profileData.bio) {
      const bioInput = this.page.getByTestId('input-bio');
      if (await bioInput.isVisible().catch(() => false)) {
        await bioInput.fill(profileData.bio);
      }
    }

    if (profileData.location) {
      const locationInput = this.page.getByTestId('input-location');
      if (await locationInput.isVisible().catch(() => false)) {
        await locationInput.fill(profileData.location);
      }
    }

    if (profileData.expectedSalary) {
      const salaryInput = this.page.getByTestId('input-expected-salary');
      if (await salaryInput.isVisible().catch(() => false)) {
        await salaryInput.fill(profileData.expectedSalary.toString());
      }
    }

    if (profileData.skills && profileData.skills.length > 0) {
      for (const skill of profileData.skills) {
        const skillInput = this.page.getByTestId('input-skills');
        if (await skillInput.isVisible().catch(() => false)) {
          await skillInput.fill(skill);
          await skillInput.press('Enter');
        }
      }
    }

    if (profileData.education) {
      const educationInput = this.page.getByTestId('input-education');
      if (await educationInput.isVisible().catch(() => false)) {
        await educationInput.fill(profileData.education);
      }
    }

    const saveButton = this.page.getByTestId('button-save-profile').or(
      this.page.getByRole('button', { name: /simpan|save/i })
    );
    await saveButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async uploadCV(filename: string = 'test-cv.pdf') {
    const fileInput = this.page.getByTestId('input-cv-upload').or(
      this.page.locator('input[type="file"][accept*="pdf"]')
    );
    
    if (await fileInput.isVisible().catch(() => false)) {
      const testFilePath = path.join(__dirname, '../test-data', filename);
      await fileInput.setInputFiles(testFilePath);
      await this.page.waitForTimeout(2000);
    }
  }

  async uploadPhoto(filename: string = 'test-photo.jpg') {
    const fileInput = this.page.getByTestId('input-photo-upload').or(
      this.page.locator('input[type="file"][accept*="image"]')
    );
    
    if (await fileInput.isVisible().catch(() => false)) {
      const testFilePath = path.join(__dirname, '../test-data', filename);
      await fileInput.setInputFiles(testFilePath);
      await this.page.waitForTimeout(2000);
    }
  }

  async updateCompanyProfile(profileData: {
    description?: string;
    website?: string;
    companySize?: string;
    industry?: string;
    location?: string;
  }) {
    await this.page.goto('/profile');
    
    const editButton = this.page.getByTestId('button-edit-profile');
    if (await editButton.isVisible().catch(() => false)) {
      await editButton.click();
    }

    if (profileData.description) {
      const descInput = this.page.getByTestId('input-company-description');
      if (await descInput.isVisible().catch(() => false)) {
        await descInput.fill(profileData.description);
      }
    }

    if (profileData.website) {
      const websiteInput = this.page.getByTestId('input-company-website');
      if (await websiteInput.isVisible().catch(() => false)) {
        await websiteInput.fill(profileData.website);
      }
    }

    if (profileData.companySize) {
      const sizeSelect = this.page.getByTestId('select-company-size');
      if (await sizeSelect.isVisible().catch(() => false)) {
        await sizeSelect.click();
        await this.page.getByRole('option', { name: profileData.companySize }).click();
      }
    }

    if (profileData.industry) {
      const industrySelect = this.page.getByTestId('select-industry');
      if (await industrySelect.isVisible().catch(() => false)) {
        await industrySelect.click();
        await this.page.getByRole('option', { name: profileData.industry }).click();
      }
    }

    if (profileData.location) {
      const locationInput = this.page.getByTestId('input-location');
      if (await locationInput.isVisible().catch(() => false)) {
        await locationInput.fill(profileData.location);
      }
    }

    const saveButton = this.page.getByTestId('button-save-profile');
    await saveButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }
}
