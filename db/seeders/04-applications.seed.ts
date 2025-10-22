import { db } from "../../server/db";
import { applications, jobs, users } from "../../shared/schema";
import { eq } from "drizzle-orm";

export async function seedApplications() {
  console.log("🌱 Seeding applications...");

  // Get job seeker user
  const jobSeeker = await db
    .select()
    .from(users)
    .where(eq(users.email, "pekerja@email.com"))
    .limit(1);

  if (jobSeeker.length === 0) {
    console.log("  ⚠️  Job seeker user not found. Skipping applications seeding.");
    return;
  }

  const applicantId = jobSeeker[0].id;

  // Get active jobs
  const activeJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.isActive, true))
    .limit(15);

  if (activeJobs.length === 0) {
    console.log("  ⚠️  No active jobs found. Skipping applications seeding.");
    return;
  }

  const statuses = ["submitted", "reviewed", "shortlisted", "rejected", "accepted"];
  const coverLetters = [
    "Saya sangat tertarik dengan posisi ini dan yakin dapat memberikan kontribusi yang baik bagi perusahaan.",
    "Dengan pengalaman dan keterampilan yang saya miliki, saya siap untuk menghadapi tantangan di posisi ini.",
    "Saya percaya bahwa latar belakang pendidikan dan pengalaman saya sesuai dengan kebutuhan posisi ini.",
    "Saya ingin bergabung dengan perusahaan Anda karena visi dan misi yang sejalan dengan nilai-nilai saya.",
    "Mohon pertimbangan untuk lamaran saya. Saya siap untuk belajar dan berkembang bersama tim.",
  ];

  let createdCount = 0;

  for (let i = 0; i < Math.min(15, activeJobs.length); i++) {
    const job = activeJobs[i];
    const status = statuses[i % statuses.length];
    const coverLetter = coverLetters[i % coverLetters.length];

    // Calculate application date (within 30 days of job posting)
    const jobPostedDate = new Date(job.createdAt);
    const applicationDate = new Date(jobPostedDate);
    applicationDate.setDate(applicationDate.getDate() + Math.floor(Math.random() * 30));

    // Check if application already exists
    const existing = await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, job.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(applications).values({
        jobId: job.id,
        applicantId,
        cvUrl: "/uploads/cv/siti-nurhaliza-cv.pdf",
        coverLetter,
        status,
        createdAt: applicationDate,
      });
      createdCount++;
      console.log(`  ✓ Created application for: ${job.title}`);
    }
  }

  console.log(`✅ Applications seeding completed: ${createdCount} applications created\n`);
}
