import { db } from "../../server/db";
import { wishlists, jobs, users } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export async function seedWishlists() {
  console.log("🌱 Seeding wishlists...");

  // Get job seeker user
  const jobSeeker = await db
    .select()
    .from(users)
    .where(eq(users.email, "pekerja@email.com"))
    .limit(1);

  if (jobSeeker.length === 0) {
    console.log("  ⚠️  Job seeker user not found. Skipping wishlists seeding.");
    return;
  }

  const userId = jobSeeker[0].id;

  // Get active jobs
  const activeJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.isActive, true))
    .limit(10);

  if (activeJobs.length === 0) {
    console.log("  ⚠️  No active jobs found. Skipping wishlists seeding.");
    return;
  }

  let createdCount = 0;

  for (let i = 0; i < Math.min(10, activeJobs.length); i++) {
    const job = activeJobs[i];

    // Check if wishlist entry already exists
    const existing = await db
      .select()
      .from(wishlists)
      .where(and(
        eq(wishlists.userId, userId),
        eq(wishlists.jobId, job.id)
      ))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(wishlists).values({
        userId,
        jobId: job.id,
      });
      createdCount++;
      console.log(`  ✓ Added to wishlist: ${job.title}`);
    }
  }

  console.log(`✅ Wishlists seeding completed: ${createdCount} wishlists created\n`);
}
