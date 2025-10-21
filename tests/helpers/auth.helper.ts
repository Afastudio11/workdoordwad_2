import { Page, expect } from '@playwright/test';

export class AuthHelper {
  constructor(private page: Page) {}

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
    companyName?: string;
  }) {
    await this.page.goto('/');
    
    const registerButton = this.page.getByTestId('button-register').or(
      this.page.getByRole('link', { name: /daftar/i })
    );
    await registerButton.click();

    await this.page.getByTestId('input-email').fill(userData.email);
    await this.page.getByTestId('input-password').fill(userData.password);
    await this.page.getByTestId('input-name').fill(userData.name);
    await this.page.getByTestId('input-phone').fill(userData.phone);
    
    const roleSelector = this.page.getByTestId(`select-role-${userData.role}`).or(
      this.page.locator(`input[value="${userData.role}"]`)
    );
    await roleSelector.click();

    if (userData.role === 'employer' && userData.companyName) {
      const companyInput = this.page.getByTestId('input-company-name');
      if (await companyInput.isVisible().catch(() => false)) {
        await companyInput.fill(userData.companyName);
      }
    }

    await this.page.getByTestId('button-submit').or(
      this.page.getByRole('button', { name: /daftar|register/i })
    ).click();

    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.page.goto('/');
    
    const loginButton = this.page.getByTestId('button-login').or(
      this.page.getByRole('link', { name: /masuk|login/i })
    );
    await loginButton.click();

    await this.page.getByTestId('input-email').fill(email);
    await this.page.getByTestId('input-password').fill(password);
    
    await this.page.getByTestId('button-submit').or(
      this.page.getByRole('button', { name: /masuk|login/i })
    ).click();

    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    const logoutButton = this.page.getByTestId('button-logout').or(
      this.page.getByRole('button', { name: /keluar|logout/i })
    );
    
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async isLoggedIn(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const logoutButton = this.page.getByTestId('button-logout');
    return await logoutButton.isVisible().catch(() => false);
  }

  async getCurrentUserEmail(): Promise<string | null> {
    try {
      const response = await this.page.request.get('/api/auth/me');
      if (response.ok()) {
        const data = await response.json();
        return data.email;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
    return null;
  }
}
