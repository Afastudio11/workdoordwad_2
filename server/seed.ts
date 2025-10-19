import { db } from "./db";
import { users, companies, jobs, applications, wishlists, messages, notifications } from "@shared/schema";
import bcrypt from "bcrypt";

const locations = [
  "Jakarta", "Bandung", "Surabaya", "Medan", "Semarang", "Makassar", 
  "Palembang", "Tangerang", "Depok", "Bekasi", "Yogyakarta", "Malang",
  "Batam", "Denpasar", "Bogor", "Pekanbaru"
];

const industries = [
  "Retail", "F&B", "Teknologi", "Manufaktur", "Logistik", 
  "Pendidikan", "Kesehatan", "Konstruksi", "Kecantikan", "Otomotif"
];

const jobTypes = ["full-time", "part-time", "contract", "freelance"];
const educationLevels = ["SMA", "D3", "S1", "S2"];
const experiences = ["0-1 tahun", "1-3 tahun", "3-5 tahun", "5+ tahun"];

// Mock company names
const companyNames = [
  "PT Maju Bersama", "CV Sejahtera", "UD Sukses Makmur", "PT Global Indo", 
  "Toko Berkah", "PT Nusantara Digital", "CV Harapan Jaya", "PT Indo Prima",
  "Warung Kopi Kenangan", "PT Teknologi Indonesia", "CV Sumber Rejeki",
  "PT Cahaya Sentosa", "Toko Elektronik Mandiri", "PT Rasa Nusantara",
  "CV Karya Utama", "PT Bangun Indonesia", "Salon Cantik Selalu",
  "PT Logistik Express", "Bengkel Motor Jaya", "PT Retail Modern",
  "Rumah Sakit Sehat", "PT Konstruksi Mega", "CV Pendidikan Cerdas",
  "PT Agro Indonesia", "Toko Fashion Style", "PT Media Kreatif"
];

const jobTitles = [
  // Retail & Customer Service
  "Pramuniaga", "Kasir", "SPG/SPB", "Sales Counter", "Customer Service",
  "Supervisor Toko", "Store Manager", "Inventory Staff",
  
  // F&B
  "Waiters/Waitress", "Barista", "Cook", "Chef", "Kitchen Helper",
  "Restaurant Manager", "Koki", "Pelayan Restoran",
  
  // Admin & Office
  "Staff Admin", "Admin Gudang", "Data Entry", "Resepsionis",
  "Secretary", "HR Staff", "Finance Staff", "Accounting",
  
  // Teknologi
  "IT Support", "Programmer", "Web Developer", "Graphic Designer",
  "Digital Marketing", "Social Media Specialist", "Content Creator",
  
  // Logistik
  "Driver", "Kurir", "Warehouse Staff", "Packing", "Loading",
  "Delivery", "Supir Truk", "Helper Gudang",
  
  // Konstruksi
  "Tukang Bangunan", "Teknisi", "Mekanik", "Operator Alat Berat",
  "Welder", "Electrician", "Plumber",
  
  // Kesehatan & Kecantikan
  "Perawat", "Apoteker", "Beautician", "Terapis", "Massage Therapist",
  
  // Pendidikan
  "Guru", "Tutor", "Pengajar", "Admin Sekolah",
  
  // Manufaktur
  "Operator Produksi", "Quality Control", "Supervisor Produksi",
  
  // Lainnya
  "Security", "Office Boy", "Cleaning Service", "Telemarketing"
];

const requirements = [
  "Minimal lulusan SMA/SMK",
  "Bisa mengoperasikan komputer",
  "Jujur dan bertanggung jawab",
  "Berpengalaman minimal 1 tahun",
  "Mampu bekerja dalam team",
  "Berpenampilan menarik dan rapi",
  "Komunikatif dan ramah",
  "Bisa bahasa Inggris (nilai plus)",
  "Disiplin dan tepat waktu",
  "Bersedia bekerja shift",
  "Memiliki kendaraan sendiri",
  "Domisili dekat lokasi kerja",
  "Dapat bekerja di bawah tekanan",
  "Teliti dan detail oriented",
  "Fast learner",
  "Customer oriented",
  "Familiar dengan Microsoft Office",
  "Bersedia ditempatkan di seluruh cabang",
  "Pengalaman di bidang yang sama",
  "Memiliki SIM A/C"
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSalary(): { min: number; max: number } {
  const bases = [3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 15];
  const min = randomElement(bases);
  const max = min + (Math.random() > 0.5 ? 1 : 2);
  return { min: min * 1000000, max: max * 1000000 };
}

function generateJobDescription(title: string, companyName: string): string {
  const reqList = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => 
    randomElement(requirements)
  );
  
  return `${companyName} membutuhkan ${title}.

Kualifikasi:
${reqList.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Kirimkan CV dan lamaran Anda segera!`;
}

async function seed() {
  console.log("🌱 Starting seed...");
  
  // Create test users
  console.log("Creating test users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const [testPekerja] = await db
    .insert(users)
    .values({
      username: "pekerja_test",
      password: hashedPassword,
      email: "pekerja@test.com",
      fullName: "Ahmad Setiawan",
      phone: "081234567890",
      role: "pekerja",
      bio: "Fresh graduate yang bersemangat mencari pekerjaan pertama di bidang IT",
      city: "Jakarta",
      province: "DKI Jakarta",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      preferredIndustries: ["Teknologi", "Startup"],
      preferredLocations: ["Jakarta", "Bandung"],
      preferredJobTypes: ["full-time"],
      expectedSalaryMin: 5000000,
    })
    .returning()
    .onConflictDoNothing();

  const [testEmployer] = await db
    .insert(users)
    .values({
      username: "employer_test",
      password: hashedPassword,
      email: "employer@test.com",
      fullName: "Budi Santoso",
      phone: "081234567891",
      role: "pemberi_kerja",
    })
    .returning()
    .onConflictDoNothing();

  console.log("✓ Created test users");
  
  // Create companies
  console.log("Creating companies...");
  const createdCompanies = [];
  
  for (let i = 0; i < 50; i++) {
    const employeeCounts = ["1 - 10", "2 - 5", "5 - 15", "10 - 50", "50 - 100", "100+", "1", "2", "3", "6", "8"];
    const company = await db.insert(companies).values({
      name: companyNames[i % companyNames.length] + (i >= companyNames.length ? ` ${Math.floor(i / companyNames.length) + 1}` : ''),
      description: `Perusahaan ${randomElement(industries)} terkemuka di Indonesia`,
      industry: randomElement(industries),
      location: randomElement(locations),
      contactEmail: `hr@company${i}.com`,
      contactPhone: `08${Math.floor(Math.random() * 900000000 + 100000000)}`,
      employeeCount: randomElement(employeeCounts),
    }).returning();
    
    createdCompanies.push(company[0]);
  }
  
  console.log(`✓ Created ${createdCompanies.length} companies`);
  
  // Create 100 jobs
  console.log("Creating 100 jobs...");
  const createdJobs = [];
  
  for (let i = 0; i < 100; i++) {
    const company = randomElement(createdCompanies);
    const title = randomElement(jobTitles);
    const salary = randomSalary();
    const isFeatured = Math.random() > 0.9; // 10% featured
    const isInstagram = Math.random() > 0.3; // 70% from Instagram
    
    const job = await db.insert(jobs).values({
      companyId: company.id,
      title,
      description: generateJobDescription(title, company.name),
      location: randomElement(locations),
      jobType: randomElement(jobTypes),
      industry: randomElement(industries),
      salaryMin: salary.min,
      salaryMax: salary.max,
      education: randomElement(educationLevels),
      experience: randomElement(experiences),
      isFeatured,
      isActive: true,
      source: isInstagram ? "instagram" : "direct",
      sourceUrl: isInstagram ? `https://instagram.com/p/${Math.random().toString(36).substring(7)}` : null,
    }).returning();
    
    createdJobs.push(job[0]);
  }
  
  console.log(`✓ Created ${createdJobs.length} jobs`);
  
  // Create applications with various statuses
  console.log("Creating applications...");
  const statuses = ["submitted", "reviewed", "shortlisted", "rejected", "accepted"];
  const createdApplications = [];
  
  for (let i = 0; i < 15; i++) {
    const app = await db.insert(applications).values({
      jobId: randomElement(createdJobs).id,
      applicantId: testPekerja.id,
      coverLetter: `Saya tertarik dengan posisi ini. Saya memiliki pengalaman yang relevan dan siap untuk bergabung dengan tim Anda.`,
      status: randomElement(statuses),
    }).returning();
    createdApplications.push(app[0]);
  }
  
  console.log(`✓ Created ${createdApplications.length} applications`);
  
  // Create wishlists
  console.log("Creating wishlist items...");
  for (let i = 0; i < 10; i++) {
    await db.insert(wishlists).values({
      userId: testPekerja.id,
      jobId: randomElement(createdJobs).id,
    }).onConflictDoNothing();
  }
  
  console.log(`✓ Created wishlist items`);
  
  // Create messages untuk aplikasi yang di-shortlist atau accepted
  console.log("Creating messages...");
  const messageableApps = createdApplications.filter(app => 
    app.status === "shortlisted" || app.status === "accepted"
  );
  
  for (const app of messageableApps.slice(0, 5)) {
    // Message from employer to applicant
    await db.insert(messages).values({
      senderId: testEmployer.id,
      receiverId: testPekerja.id,
      applicationId: app.id,
      jobId: app.jobId,
      content: `Halo! Kami tertarik dengan lamaran Anda. Apakah Anda bisa hadir untuk wawancara minggu ini?`,
      isRead: Math.random() > 0.5,
    });
    
    // Reply from applicant
    if (Math.random() > 0.3) {
      await db.insert(messages).values({
        senderId: testPekerja.id,
        receiverId: testEmployer.id,
        applicationId: app.id,
        jobId: app.jobId,
        content: `Terima kasih atas responnya! Saya tersedia untuk wawancara. Kapan waktu yang tepat?`,
        isRead: true,
      });
    }
  }
  
  console.log(`✓ Created message threads`);
  
  // Create notifications
  console.log("Creating notifications...");
  const notificationTypes = [
    {
      type: "application_status",
      title: "Status Lamaran Diperbarui",
      message: "Lamaran Anda untuk posisi {job} telah di-review",
      linkUrl: "/user/dashboard#applications",
    },
    {
      type: "new_message",
      title: "Pesan Baru",
      message: "Anda mendapat pesan baru dari pemberi kerja",
      linkUrl: "/messages",
    },
    {
      type: "job_match",
      title: "Lowongan Cocok Untuk Anda! 🎯",
      message: "Ada lowongan baru yang sesuai dengan preferensi Anda",
      linkUrl: "/jobs",
    },
    {
      type: "new_applicant",
      title: "Pelamar Baru",
      message: "Ada pelamar baru untuk lowongan Anda",
      linkUrl: "/employer/dashboard#applicants",
    },
  ];
  
  // Notifications for pekerja
  for (let i = 0; i < 8; i++) {
    const notif = randomElement(notificationTypes.filter(n => n.type !== "new_applicant"));
    await db.insert(notifications).values({
      userId: testPekerja.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      linkUrl: notif.linkUrl,
      isRead: Math.random() > 0.4,
    });
  }
  
  // Notifications for employer
  for (let i = 0; i < 5; i++) {
    const notif = randomElement(notificationTypes.filter(n => 
      n.type === "new_applicant" || n.type === "new_message"
    ));
    await db.insert(notifications).values({
      userId: testEmployer.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      linkUrl: notif.linkUrl,
      isRead: Math.random() > 0.3,
    });
  }
  
  console.log(`✓ Created notifications`);
  
  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Companies: ${createdCompanies.length}`);
  console.log(`   - Jobs: ${createdJobs.length}`);
  console.log(`   - Applications: ${createdApplications.length} (with various statuses)`);
  console.log(`   - Wishlists: 10 items`);
  console.log(`   - Messages: Multiple conversation threads`);
  console.log(`   - Notifications: For both pekerja and employer`);
  console.log("\nTest accounts created:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Pekerja Account:");
  console.log("   Username: pekerja_test");
  console.log("   Password: password123");
  console.log("   Email: pekerja@test.com");
  console.log("\n👔 Employer Account:");
  console.log("   Username: employer_test");
  console.log("   Password: password123");
  console.log("   Email: employer@test.com");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
