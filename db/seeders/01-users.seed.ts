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
    },
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
      console.log(`  ✓ Created ${account.role} account: ${account.email}`);
    } else {
      console.log(`  ⊘ ${account.role} account already exists: ${account.email}`);
    }
  }

  console.log("✅ Users seeding completed\n");
}
