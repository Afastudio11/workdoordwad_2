import { CleanupHelper } from '../helpers/cleanup.helper';

async function globalSetup() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Running Global Test Setup - Cleaning Test Data          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const cleanup = new CleanupHelper();
  
  try {
    await cleanup.cleanupAllTestData();
  } catch (error) {
    console.error('Warning: Some cleanup operations failed. Tests may fail if database has stale data.');
    console.error(error);
  } finally {
    await cleanup.close();
  }

  console.log('\n✓ Global setup completed\n');
}

export default globalSetup;
