import { db } from "../../server/db";
import { users, companies } from "../../shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function seedTestAccounts() {
  console.log("🌱 Creating test accounts...");

  // 1. Admin Account
  const adminData = {
    username: "admin",
    email: "admin@pintuloker.com",
    password: await bcrypt.hash("Admin123!", 10),
    fullName: "Admin Pintu Loker",
    phone: "081234567890",
    role: "admin",
    isActive: true,
    emailVerified: true,
  };

  let adminUser = await db
    .select()
    .from(users)
    .where(eq(users.email, adminData.email))
    .limit(1);

  if (adminUser.length === 0) {
    const [admin] = await db.insert(users).values(adminData).returning();
    console.log(`  ✓ Created admin: ${adminData.email}`);
    adminUser = [admin];
  } else {
    console.log(`  ⊘ Admin already exists: ${adminData.email}`);
  }

  // 2. Job Seeker Account
  const jobSeekerData = {
    username: "pekerja",
    email: "pekerja@email.com",
    password: await bcrypt.hash("Pekerja123!", 10),
    fullName: "Siti Nurhaliza",
    phone: "082345678901",
    role: "pekerja",
    isActive: true,
    emailVerified: true,
    bio: "Fresh graduate mencari kesempatan berkarir di bidang teknologi",
    city: "Jakarta",
    province: "DKI Jakarta",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    preferredJobTypes: ["full-time", "contract"],
    preferredLocations: ["Jakarta", "Tangerang", "Bekasi"],
    preferredIndustries: ["Technology", "Startup"],
    expectedSalaryMin: 5000000,
    lastEducation: "S1",
    major: "Teknik Informatika",
    institution: "Universitas Indonesia",
    graduationYear: "2023",
    employmentStatus: "Fresh Graduate",
    yearsOfExperience: "0 tahun",
  };

  let jobSeeker = await db
    .select()
    .from(users)
    .where(eq(users.email, jobSeekerData.email))
    .limit(1);

  if (jobSeeker.length === 0) {
    const [seeker] = await db.insert(users).values(jobSeekerData).returning();
    console.log(`  ✓ Created job seeker: ${jobSeekerData.email}`);
    jobSeeker = [seeker];
  } else {
    console.log(`  ⊘ Job seeker already exists: ${jobSeekerData.email}`);
  }

  // 3-6. Four Employer Accounts with Different Subscription Plans
  const employerAccounts = [
    {
      user: {
        username: "employer_free",
        email: "employer.free@company.com",
        password: await bcrypt.hash("Employer123!", 10),
        fullName: "Budi Santoso",
        phone: "081234567891",
        role: "pemberi_kerja",
        isActive: true,
        emailVerified: true,
        verificationStatus: "verified",
        bio: "HR Manager di perusahaan startup",
        city: "Jakarta",
        province: "DKI Jakarta",
      },
      company: {
        name: "PT Startup Berkembang",
        description: "Startup teknologi yang sedang berkembang dengan fokus pada solusi digital untuk UMKM",
        industry: "Technology",
        location: "Jakarta Selatan, DKI Jakarta",
        website: "https://startupberkembang.id",
        contactEmail: "hr@startupberkembang.id",
        contactPhone: "021-11111111",
        whatsappNumber: "6281234567891",
        employeeCount: "1-10",
        foundedYear: "2023",
        picName: "Budi Santoso",
        picPosition: "HR Manager",
        subscriptionPlan: "free",
        verificationStatus: "verified",
      },
    },
    {
      user: {
        username: "employer_starter",
        email: "employer.starter@company.com",
        password: await bcrypt.hash("Employer123!", 10),
        fullName: "Ani Wijaya",
        phone: "081234567892",
        role: "pemberi_kerja",
        isActive: true,
        emailVerified: true,
        verificationStatus: "verified",
        bio: "Recruitment Manager di perusahaan retail",
        city: "Bandung",
        province: "Jawa Barat",
      },
      company: {
        name: "CV Toko Modern",
        description: "Perusahaan retail modern dengan beberapa cabang di Jawa Barat",
        industry: "Retail",
        location: "Bandung, Jawa Barat",
        website: "https://tokomodern.co.id",
        contactEmail: "recruitment@tokomodern.co.id",
        contactPhone: "022-22222222",
        whatsappNumber: "6281234567892",
        employeeCount: "11-50",
        foundedYear: "2020",
        picName: "Ani Wijaya",
        picPosition: "Recruitment Manager",
        subscriptionPlan: "starter",
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        subscriptionDuration: "1_month",
        paymentStatus: "completed",
        verificationStatus: "verified",
        verifiedAt: new Date(),
      },
    },
    {
      user: {
        username: "employer_starter_yearly",
        email: "employer.starter.yearly@company.com",
        password: await bcrypt.hash("Employer123!", 10),
        fullName: "Rina Kartika",
        phone: "081234567893",
        role: "pemberi_kerja",
        isActive: true,
        emailVerified: true,
        verificationStatus: "verified",
        bio: "Owner di perusahaan F&B",
        city: "Yogyakarta",
        province: "DI Yogyakarta",
      },
      company: {
        name: "CV Kuliner Nusantara",
        description: "Perusahaan F&B dengan beberapa outlet di Yogyakarta dan sekitarnya",
        industry: "Food & Beverage",
        location: "Yogyakarta, DI Yogyakarta",
        website: "https://kulinernusantara.id",
        contactEmail: "hrd@kulinernusantara.id",
        contactPhone: "0274-33333333",
        whatsappNumber: "6281234567893",
        employeeCount: "51-100",
        foundedYear: "2019",
        picName: "Rina Kartika",
        picPosition: "Owner",
        subscriptionPlan: "starter",
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +365 days (1 year)
        subscriptionDuration: "12_months",
        paymentStatus: "completed",
        verificationStatus: "verified",
        verifiedAt: new Date(),
      },
    },
    {
      user: {
        username: "employer_professional",
        email: "employer.professional@company.com",
        password: await bcrypt.hash("Employer123!", 10),
        fullName: "Eko Prasetyo",
        phone: "081234567894",
        role: "pemberi_kerja",
        isActive: true,
        emailVerified: true,
        verificationStatus: "verified",
        bio: "Head of HR di perusahaan manufaktur",
        city: "Surabaya",
        province: "Jawa Timur",
      },
      company: {
        name: "PT Industri Maju Jaya",
        description: "Perusahaan manufaktur dengan puluhan tahun pengalaman di industri otomotif",
        industry: "Manufacturing",
        location: "Surabaya, Jawa Timur",
        website: "https://industrimajujaya.co.id",
        contactEmail: "hrd@industrimajujaya.co.id",
        contactPhone: "031-44444444",
        whatsappNumber: "6281234567894",
        employeeCount: "201-500",
        foundedYear: "1995",
        picName: "Eko Prasetyo",
        picPosition: "Head of HR",
        subscriptionPlan: "professional",
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +365 days (1 year)
        subscriptionDuration: "12_months",
        paymentStatus: "completed",
        verificationStatus: "verified",
        verifiedAt: new Date(),
      },
    },
  ];

  // Create employer accounts and their companies
  for (const account of employerAccounts) {
    // Check if user exists
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, account.user.email))
      .limit(1);

    let employerUser;
    if (existingUser.length === 0) {
      const [newUser] = await db.insert(users).values(account.user).returning();
      employerUser = newUser;
      console.log(`  ✓ Created employer (${account.company.subscriptionPlan}): ${account.user.email}`);
    } else {
      employerUser = existingUser[0];
      console.log(`  ⊘ Employer already exists: ${account.user.email}`);
    }

    // Check if company exists
    const existingCompany = await db
      .select()
      .from(companies)
      .where(eq(companies.name, account.company.name))
      .limit(1);

    if (existingCompany.length === 0) {
      await db.insert(companies).values({
        ...account.company,
        createdBy: employerUser.id,
        verifiedBy: adminUser[0].id,
      });
      console.log(`  ✓ Created company (${account.company.subscriptionPlan}): ${account.company.name}`);
    } else {
      console.log(`  ⊘ Company already exists: ${account.company.name}`);
    }
  }

  console.log("\n✅ Test accounts seeding completed!");
  console.log("\n📋 Login Credentials:");
  console.log("┌─────────────────────────────────────────────────────────────┐");
  console.log("│ ADMIN                                                       │");
  console.log("│ Email: admin@pintuloker.com                                 │");
  console.log("│ Password: Admin123!                                         │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log("│ JOB SEEKER / PESERTA                                        │");
  console.log("│ Email: pekerja@email.com                                    │");
  console.log("│ Password: Pekerja123!                                       │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log("│ EMPLOYER - FREE PLAN                                        │");
  console.log("│ Email: employer.free@company.com                            │");
  console.log("│ Password: Employer123!                                      │");
  console.log("│ Company: PT Startup Berkembang                              │");
  console.log("│ Quota: 3 job postings                                       │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log("│ EMPLOYER - STARTER MONTHLY                                  │");
  console.log("│ Email: employer.starter@company.com                         │");
  console.log("│ Password: Employer123!                                      │");
  console.log("│ Company: CV Toko Modern                                     │");
  console.log("│ Quota: 10 jobs, 3 featured (30 hari aktif)                  │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log("│ EMPLOYER - STARTER YEARLY                                   │");
  console.log("│ Email: employer.starter.yearly@company.com                  │");
  console.log("│ Password: Employer123!                                      │");
  console.log("│ Company: CV Kuliner Nusantara                               │");
  console.log("│ Quota: 10 jobs, 3 featured (365 hari aktif)                 │");
  console.log("├─────────────────────────────────────────────────────────────┤");
  console.log("│ EMPLOYER - PROFESSIONAL YEARLY                              │");
  console.log("│ Email: employer.professional@company.com                    │");
  console.log("│ Password: Employer123!                                      │");
  console.log("│ Company: PT Industri Maju Jaya                              │");
  console.log("│ Quota: 30 jobs, unlimited featured (365 hari aktif)         │");
  console.log("│ Features: Analytics, CV Database (100/month)                │");
  console.log("└─────────────────────────────────────────────────────────────┘");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestAccounts()
    .then(() => {
      console.log("\n✅ Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Error seeding:", error);
      process.exit(1);
    });
}
