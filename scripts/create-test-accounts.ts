import { db } from "../server/db";
import { users, companies } from "../shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const TEST_ACCOUNTS = [
  {
    email: "free@testcompany.com",
    password: "Test123!",
    companyName: "Free Test Company",
    plan: "free" as const,
  },
  {
    email: "starter@testcompany.com",
    password: "Test123!",
    companyName: "Starter Test Company",
    plan: "starter" as const,
  },
  {
    email: "professional@testcompany.com",
    password: "Test123!",
    companyName: "Professional Test Company",
    plan: "professional" as const,
  },
  {
    email: "enterprise@testcompany.com",
    password: "Test123!",
    companyName: "Enterprise Test Company",
    plan: "enterprise" as const,
  },
];

async function createTestAccounts() {
  console.log("Creating test accounts...\n");

  for (const account of TEST_ACCOUNTS) {
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, account.email))
        .limit(1);

      if (existingUser.length > 0) {
        console.log(`❌ Account ${account.email} already exists. Skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(account.password, 10);

      const [user] = await db
        .insert(users)
        .values({
          username: account.email.split("@")[0],
          email: account.email,
          password: hashedPassword,
          fullName: `${account.plan.charAt(0).toUpperCase() + account.plan.slice(1)} Plan User`,
          phone: "+62812345678" + TEST_ACCOUNTS.indexOf(account),
          role: "pemberi_kerja",
          verificationStatus: account.plan === "free" ? "pending" : "verified",
          verifiedAt: account.plan === "free" ? null : new Date(),
        })
        .returning();

      const [company] = await db
        .insert(companies)
        .values({
          name: account.companyName,
          createdBy: user.id,
          subscriptionPlan: account.plan,
          subscriptionStartDate: new Date(),
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          paymentStatus: account.plan === "free" ? "pending" : "completed",
          verificationStatus: account.plan === "free" ? "pending" : "verified",
          verifiedAt: account.plan === "free" ? null : new Date(),
          description: `Test company for ${account.plan} plan`,
          industry: "Technology",
          location: "Jakarta",
          employeeCount: "10-50",
          foundedYear: "2024",
        })
        .returning();

      console.log(`✅ Created ${account.plan.toUpperCase()} account:`);
      console.log(`   Email: ${account.email}`);
      console.log(`   Password: ${account.password}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Company ID: ${company.id}`);
      console.log(`   Subscription: ${account.plan}`);
      console.log(`   Verified: ${account.plan !== "free" ? "Yes" : "No"}\n`);
    } catch (error) {
      console.error(`❌ Error creating account ${account.email}:`, error);
    }
  }

  console.log("\n✅ Test accounts creation completed!");
  console.log("\n═══════════════════════════════════════");
  console.log("CREDENTIALS SUMMARY (SAVE THESE!)");
  console.log("═══════════════════════════════════════");
  TEST_ACCOUNTS.forEach((account) => {
    console.log(`\n${account.plan.toUpperCase()} Plan:`);
    console.log(`Email: ${account.email}`);
    console.log(`Password: ${account.password}`);
  });
  console.log("\n═══════════════════════════════════════\n");

  process.exit(0);
}

createTestAccounts().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
