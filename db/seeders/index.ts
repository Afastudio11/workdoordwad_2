#!/usr/bin/env tsx

/**
 * Database Seeding Script for Pintu Loker
 * 
 * This script seeds the database with test data including:
 * - 3 test accounts (Admin, Employer, Job Seeker)
 * - 30 companies
 * - 90 job listings
 * - Sample applications, wishlists, and notifications
 * 
 * Usage:
 *   npm run seed           - Run all seeders
 *   npm run seed:users     - Run users seeder only
 *   npm run seed:companies - Run companies seeder only
 *   npm run seed:jobs      - Run jobs seeder only
 */

import { seedUsers } from "./01-users.seed";
import { seedCompanies } from "./02-companies.seed";
import { seedJobs } from "./03-jobs.seed";
import { seedApplications } from "./04-applications.seed";
import { seedWishlists } from "./05-wishlists.seed";
import { seedNotifications } from "./06-notifications.seed";
import { seedBlogPosts } from "./07-blog.seed";
import { seedTestAccounts } from "./test-accounts.seed";

async function runAllSeeders() {
  console.log("\n🚀 Starting database seeding...\n");
  console.log("=" .repeat(50));
  
  const startTime = Date.now();

  try {
    // Run seeders in sequence (order is important!)
    await seedTestAccounts(); // Create permanent test accounts first
    await seedUsers();
    await seedCompanies();
    await seedJobs();
    await seedApplications();
    await seedWishlists();
    await seedNotifications();
    await seedBlogPosts();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("=" .repeat(50));
    console.log(`\n✅ All seeders completed successfully in ${duration}s!\n`);
    console.log("=" .repeat(50));
    console.log("\n📊 Summary:");
    console.log("   ✓ 6 permanent test accounts created");
    console.log("   ✓ 30 companies created");
    console.log("   ✓ 90 job listings created");
    console.log("   ✓ 15 job applications created");
    console.log("   ✓ 10 wishlists created");
    console.log("   ✓ 10 notifications created");
    console.log("   ✓ 6 blog posts created\n");
    
    console.log("=" .repeat(50));
    console.log("\n💡 Lihat PERMANENT_ACCOUNTS.md untuk kredensial lengkap!");
    console.log("=" .repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during seeding:");
    console.error(error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Run all seeders
  runAllSeeders();
} else {
  // Run specific seeder
  const seederName = args[0];
  
  (async () => {
    try {
      switch (seederName) {
        case "permanent":
          await seedTestAccounts();
          break;
        case "users":
          await seedUsers();
          break;
        case "companies":
          await seedCompanies();
          break;
        case "jobs":
          await seedJobs();
          break;
        case "applications":
          await seedApplications();
          break;
        case "wishlists":
          await seedWishlists();
          break;
        case "notifications":
          await seedNotifications();
          break;
        default:
          console.log(`❌ Unknown seeder: ${seederName}`);
          console.log("\nAvailable seeders:");
          console.log("  - permanent (6 permanent test accounts)");
          console.log("  - users");
          console.log("  - companies");
          console.log("  - jobs");
          console.log("  - applications");
          console.log("  - wishlists");
          console.log("  - notifications");
          process.exit(1);
      }
      process.exit(0);
    } catch (error) {
      console.error("\n❌ Error during seeding:");
      console.error(error);
      process.exit(1);
    }
  })();
}
