import { CleanupHelper } from '../helpers/cleanup.helper';

async function globalTeardown() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Running Global Test Teardown - Cleaning Test Data       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const cleanup = new CleanupHelper();
  
  try {
    await cleanup.cleanupAllTestData();
  } catch (error) {
    console.error('Warning: Some cleanup operations failed.');
    console.error(error);
  } finally {
    await cleanup.close();
  }

  console.log('\n✓ Global teardown completed\n');
}

export default globalTeardown;
