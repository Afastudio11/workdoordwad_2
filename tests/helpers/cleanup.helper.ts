import { Pool } from 'pg';

export class CleanupHelper {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async cleanupTestUsers(emailPattern: string = '@email.com') {
    try {
      const query = `
        DELETE FROM users 
        WHERE email LIKE $1 
        AND email NOT LIKE '%@replit.com%'
      `;
      const result = await this.pool.query(query, [`%${emailPattern}%`]);
      console.log(`Cleaned up ${result.rowCount} test users`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning up test users:', error);
      throw error;
    }
  }

  async cleanupTestJobs() {
    try {
      const query = `
        DELETE FROM jobs 
        WHERE title LIKE '%Test%' 
        OR title LIKE '%Realtime%'
        OR title LIKE '%Job Posting %'
        OR title LIKE '%Full Stack Developer Position%'
      `;
      const result = await this.pool.query(query);
      console.log(`Cleaned up ${result.rowCount} test jobs`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning up test jobs:', error);
      throw error;
    }
  }

  async cleanupTestApplications() {
    try {
      const query = `
        DELETE FROM applications 
        WHERE applicant_id IN (
          SELECT id FROM users WHERE email LIKE '%@email.com%'
        )
      `;
      const result = await this.pool.query(query);
      console.log(`Cleaned up ${result.rowCount} test applications`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning up test applications:', error);
      throw error;
    }
  }

  async cleanupTestCompanies() {
    try {
      const query = `
        DELETE FROM companies 
        WHERE name LIKE '%Test%' 
        OR name = 'TechStart Indonesia'
        OR name = 'PT Maju Bersama'
        OR name = 'CV Usaha Mandiri'
        OR name = 'Test Company'
        OR name = 'Realtime Test Co'
      `;
      const result = await this.pool.query(query);
      console.log(`Cleaned up ${result.rowCount} test companies`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning up test companies:', error);
      throw error;
    }
  }

  async cleanupAllTestData() {
    console.log('Starting test data cleanup...');
    
    try {
      await this.cleanupTestApplications();
      await this.cleanupTestJobs();
      await this.cleanupTestCompanies();
      await this.cleanupTestUsers();
      
      console.log('✓ Test data cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

export async function globalSetup() {
  const cleanup = new CleanupHelper();
  await cleanup.cleanupAllTestData();
  await cleanup.close();
}

export async function globalTeardown() {
  const cleanup = new CleanupHelper();
  await cleanup.cleanupAllTestData();
  await cleanup.close();
}
