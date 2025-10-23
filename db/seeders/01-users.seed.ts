import { db } from "../../server/db";
import { users } from "../../shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function seedUsers() {
  console.log("🌱 Seeding users...");

  const testAccounts = [
    {
      username: "admin",
      email: "admin@pintuloker.com",
      password: await bcrypt.hash("Admin123!", 10),
      fullName: "Admin Pintu Loker",
      phone: "081234567890",
      role: "admin",
      isActive: true,
      isVerified: true,
    },
    // EXISTING EMPLOYER (untuk backward compatibility)
    {
      username: "employer",
      email: "employer@company.com",
      password: await bcrypt.hash("Employer123!", 10),
      fullName: "Budi Santoso",
      phone: "081234567890",
      role: "pemberi_kerja",
      isActive: true,
      isVerified: true,
      bio: "PIC Recruitment di PT Teknologi Maju",
      city: "Jakarta",
      province: "DKI Jakarta",
      subscriptionPlan: "free",
    },
    // 4 AKUN EMPLOYER SESUAI PAKET PLAN
    {
      username: "employer_free",
      email: "free@company.com",
      password: await bcrypt.hash("Employer123!", 10),
      fullName: "Ahmad Fauzi",
      phone: "081234567891",
      role: "pemberi_kerja",
      isActive: true,
      isVerified: true,
      bio: "HRD Manager di CV Maju Sejahtera",
      city: "Bandung",
      province: "Jawa Barat",
      picPosition: "HRD Manager",
      subscriptionPlan: "free",
      paymentStatus: "completed",
    },
    {
      username: "employer_starter_monthly",
      email: "starter.monthly@company.com",
      password: await bcrypt.hash("Employer123!", 10),
      fullName: "Dewi Lestari",
      phone: "081234567892",
      role: "pemberi_kerja",
      isActive: true,
      isVerified: true,
      bio: "Talent Acquisition Lead di PT Digital Sukses",
      city: "Surabaya",
      province: "Jawa Timur",
      picPosition: "Talent Acquisition Lead",
      subscriptionPlan: "starter",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari
      subscriptionDuration: "1_month",
      paymentStatus: "completed",
    },
    {
      username: "employer_starter_yearly",
      email: "starter.yearly@company.com",
      password: await bcrypt.hash("Employer123!", 10),
      fullName: "Rizki Pratama",
      phone: "081234567893",
      role: "pemberi_kerja",
      isActive: true,
      isVerified: true,
      bio: "CEO & Founder di Startup Inovasi Indonesia",
      city: "Yogyakarta",
      province: "DI Yogyakarta",
      picPosition: "CEO",
      subscriptionPlan: "starter",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 hari
      subscriptionDuration: "12_months",
      paymentStatus: "completed",
    },
    {
      username: "employer_professional",
      email: "professional@company.com",
      password: await bcrypt.hash("Employer123!", 10),
      fullName: "Andi Wijaya",
      phone: "081234567894",
      role: "pemberi_kerja",
      isActive: true,
      isVerified: true,
      bio: "HR Director di PT Perusahaan Besar Indonesia",
      city: "Jakarta",
      province: "DKI Jakarta",
      picPosition: "HR Director",
      subscriptionPlan: "professional",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 hari
      subscriptionDuration: "12_months",
      paymentStatus: "completed",
    },
    // JOB SEEKER
    {
      username: "pekerja",
      email: "pekerja@email.com",
      password: await bcrypt.hash("Pekerja123!", 10),
      fullName: "Siti Nurhaliza",
      phone: "082345678901",
      role: "pekerja",
      isActive: true,
      bio: "Fresh graduate mencari kesempatan berkarir di bidang teknologi",
      city: "Jakarta",
      province: "DKI Jakarta",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      preferredJobTypes: ["full-time", "contract"],
      preferredLocations: ["Jakarta", "Tangerang", "Bekasi"],
      preferredIndustries: ["Technology", "Startup"],
      expectedSalaryMin: 5000000,
      education: JSON.stringify([
        {
          degree: "S1",
          major: "Teknik Informatika",
          institution: "Universitas Indonesia",
          graduationYear: "2023",
        },
      ]),
      experience: JSON.stringify([
        {
          title: "Intern Frontend Developer",
          company: "Startup XYZ",
          startDate: "2022-06",
          endDate: "2022-12",
          description: "Developed responsive web applications using React",
        },
      ]),
    },
  ];

  for (const account of testAccounts) {
    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, account.email))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values(account);
      console.log(`  ✓ Created ${account.role} account: ${account.email} (${account.subscriptionPlan || 'N/A'})`);
    } else {
      console.log(`  ⊘ ${account.role} account already exists: ${account.email}`);
    }
  }

  console.log("✅ Users seeding completed\n");
}
