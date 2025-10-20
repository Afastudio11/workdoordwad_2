import { db } from "./db";
import { users, companies, jobs, applications, wishlists, messages, notifications, premiumTransactions, aggregatedJobs } from "@shared/schema";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/id_ID";
import { eq } from "drizzle-orm";

const BATCH_SIZE = 100;
const TARGET_PEKERJA = 5000;
const TARGET_PEMBERI_KERJA = 500;
const TARGET_COMPANIES = 500;
const TARGET_JOBS = 10000;

const locations = [
  "Jakarta Pusat", "Jakarta Selatan", "Jakarta Utara", "Jakarta Barat", "Jakarta Timur",
  "Bandung", "Surabaya", "Medan", "Semarang", "Makassar", "Palembang",
  "Tangerang", "Depok", "Bekasi", "Bogor", "Yogyakarta", "Malang",
  "Batam", "Denpasar", "Pekanbaru", "Bandar Lampung", "Padang",
  "Solo", "Balikpapan", "Manado", "Pontianak", "Samarinda"
];

const industries = [
  "Retail", "F&B", "Teknologi", "Manufaktur", "Logistik",
  "Pendidikan", "Kesehatan", "Konstruksi", "Kecantikan", "Otomotif",
  "Perbankan", "Asuransi", "Properti", "Telekomunikasi", "Media",
  "Pariwisata", "Pertanian", "Perikanan", "Tekstil", "Farmasi"
];

const jobTypes = ["full-time", "part-time", "contract", "freelance"];
const educationLevels = ["SMA", "D3", "S1", "S2"];
const experiences = ["0-1 tahun", "1-3 tahun", "3-5 tahun", "5+ tahun"];

const jobTitlesData = {
  Retail: ["Pramuniaga", "Kasir", "SPG/SPB", "Sales Counter", "Customer Service", "Supervisor Toko", "Store Manager"],
  "F&B": ["Waiters/Waitress", "Barista", "Cook", "Chef", "Kitchen Helper", "Restaurant Manager", "Koki"],
  Teknologi: ["IT Support", "Programmer", "Web Developer", "Graphic Designer", "Digital Marketing", "Data Analyst", "DevOps Engineer"],
  Manufaktur: ["Operator Produksi", "Quality Control", "Supervisor Produksi", "Technician", "Production Planner"],
  Logistik: ["Driver", "Kurir", "Warehouse Staff", "Packing", "Delivery", "Logistics Coordinator"],
  Konstruksi: ["Tukang Bangunan", "Teknisi", "Mekanik", "Operator Alat Berat", "Welder", "Project Manager"],
  Kesehatan: ["Perawat", "Apoteker", "Dokter Umum", "Radiografer", "Admin Klinik"],
  Kecantikan: ["Beautician", "Terapis", "Massage Therapist", "Hair Stylist", "Nail Artist"],
  Pendidikan: ["Guru", "Tutor", "Pengajar", "Admin Sekolah", "Kepala Sekolah"],
  Otomotif: ["Mekanik Mobil", "Mekanik Motor", "Sales Otomotif", "Service Advisor"]
};

const skills = [
  "Microsoft Office", "Excel", "PowerPoint", "Komunikasi", "Customer Service",
  "JavaScript", "Python", "React", "Node.js", "TypeScript", "SQL",
  "Photoshop", "Illustrator", "Figma", "UI/UX Design",
  "Sales", "Marketing", "Negotiation", "Leadership", "Team Management",
  "Accounting", "Finance", "Bookkeeping", "Tax", "Audit"
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSalary(): { min: number; max: number } {
  const bases = [3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 15, 20, 25];
  const min = randomElement(bases);
  const max = min + (Math.random() > 0.5 ? 1 : 2);
  return { min: min * 1000000, max: max * 1000000 };
}

function generateJobDescription(title: string, industry: string): string {
  const reqCount = 3 + Math.floor(Math.random() * 4);
  const reqs = [
    "Minimal lulusan SMA/SMK",
    "Berpengalaman di bidang yang sama",
    "Mampu bekerja dalam team",
    "Jujur dan bertanggung jawab",
    "Komunikatif dan ramah",
    "Disiplin dan tepat waktu",
    "Bersedia bekerja shift",
    "Berpenampilan menarik dan rapi",
    "Dapat bekerja di bawah tekanan"
  ];
  
  const selectedReqs = [];
  for (let i = 0; i < reqCount; i++) {
    selectedReqs.push(randomElement(reqs));
  }
  
  return `Dibutuhkan ${title} untuk posisi di industri ${industry}.

Kualifikasi:
${selectedReqs.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Benefit:
- Gaji kompetitif
- BPJS Kesehatan & Ketenagakerjaan
- Tunjangan Transportasi
- Bonus Kinerja

Kirimkan CV dan lamaran Anda segera!`;
}

async function batchInsert<T>(table: any, data: T[], batchSize: number, label: string) {
  const total = data.length;
  let inserted = 0;
  
  for (let i = 0; i < total; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await db.insert(table).values(batch).onConflictDoNothing();
    inserted += batch.length;
    const percentage = ((inserted / total) * 100).toFixed(1);
    process.stdout.write(`\r  Creating ${label}... ${inserted}/${total} (${percentage}%)`);
  }
  console.log(""); // New line
}

async function seedLarge() {
  console.log("🌱 Starting LARGE scale seed...\n");
  console.log("📊 Targets:");
  console.log(`   - Pekerja: ${TARGET_PEKERJA.toLocaleString()}`);
  console.log(`   - Pemberi Kerja: ${TARGET_PEMBERI_KERJA.toLocaleString()}`);
  console.log(`   - Companies: ${TARGET_COMPANIES.toLocaleString()}`);
  console.log(`   - Jobs: ${TARGET_JOBS.toLocaleString()}`);
  console.log(`\n${"=".repeat(60)}\n`);
  
  const startTime = Date.now();
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  // 1. Create PEKERJA (Job Seekers)
  console.log("👤 PHASE 1: Creating Pekerja accounts...");
  const pekerjaData = [];
  for (let i = 0; i < TARGET_PEKERJA; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const city = randomElement(locations);
    
    pekerjaData.push({
      username: `pekerja_${faker.internet.username().toLowerCase()}_${i}`,
      password: hashedPassword,
      email: `pekerja${i}@test.com`,
      fullName: `${firstName} ${lastName}`,
      phone: `08${Math.floor(Math.random() * 900000000 + 100000000)}`,
      role: "pekerja",
      bio: faker.person.bio(),
      city,
      province: city.includes("Jakarta") ? "DKI Jakarta" : city,
      skills: Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => randomElement(skills)),
      preferredIndustries: Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => randomElement(industries)),
      preferredLocations: [city, randomElement(locations)],
      preferredJobTypes: Math.random() > 0.5 ? ["full-time"] : ["full-time", "contract"],
      expectedSalaryMin: (3 + Math.floor(Math.random() * 7)) * 1000000,
    });
  }
  
  await batchInsert(users, pekerjaData, BATCH_SIZE, "pekerja");
  console.log(`✅ Created ${TARGET_PEKERJA.toLocaleString()} pekerja\n`);
  
  // 2. Create PEMBERI KERJA (Employers)
  console.log("👔 PHASE 2: Creating Pemberi Kerja accounts...");
  const pemberiKerjaData = [];
  for (let i = 0; i < TARGET_PEMBERI_KERJA; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    pemberiKerjaData.push({
      username: `employer_${faker.internet.username().toLowerCase()}_${i}`,
      password: hashedPassword,
      email: `employer${i}@test.com`,
      fullName: `${firstName} ${lastName}`,
      phone: `08${Math.floor(Math.random() * 900000000 + 100000000)}`,
      role: "pemberi_kerja",
    });
  }
  
  await batchInsert(users, pemberiKerjaData, BATCH_SIZE, "pemberi kerja");
  console.log(`✅ Created ${TARGET_PEMBERI_KERJA.toLocaleString()} pemberi kerja\n`);
  
  // Get created users
  const allPekerja = await db.select().from(users).where(eq(users.role, "pekerja")).limit(TARGET_PEKERJA);
  const allPemberiKerja = await db.select().from(users).where(eq(users.role, "pemberi_kerja")).limit(TARGET_PEMBERI_KERJA);
  
  console.log(`✓ Retrieved ${allPekerja.length} pekerja and ${allPemberiKerja.length} pemberi kerja from database\n`);
  
  // 3. Create COMPANIES
  console.log("🏢 PHASE 3: Creating Companies...");
  const companiesData = [];
  for (let i = 0; i < TARGET_COMPANIES; i++) {
    const industry = randomElement(industries);
    const companyType = randomElement(["PT", "CV", "UD", "Toko"]);
    const employeeCounts = ["1-10", "11-50", "51-100", "101-500", "500+"];
    
    companiesData.push({
      name: `${companyType} ${faker.company.name()} ${i > 0 && i % 50 === 0 ? `Cabang ${Math.floor(i / 50)}` : ''}`,
      description: `Perusahaan ${industry} yang bergerak di bidang ${faker.company.buzzPhrase()}`,
      industry,
      location: randomElement(locations),
      contactEmail: `hr@company${i}.com`,
      contactPhone: `021${Math.floor(Math.random() * 90000000 + 10000000)}`,
      employeeCount: randomElement(employeeCounts),
      createdBy: allPemberiKerja[i % allPemberiKerja.length]?.id,
    });
  }
  
  await batchInsert(companies, companiesData, BATCH_SIZE, "companies");
  console.log(`✅ Created ${TARGET_COMPANIES.toLocaleString()} companies\n`);
  
  const allCompanies = await db.select().from(companies).limit(TARGET_COMPANIES);
  console.log(`✓ Retrieved ${allCompanies.length} companies from database\n`);
  
  // 4. Create JOBS (with Premium & Aggregated flags)
  console.log("💼 PHASE 4: Creating Jobs...");
  const jobsData = [];
  for (let i = 0; i < TARGET_JOBS; i++) {
    const company = randomElement(allCompanies);
    const industry = company.industry || randomElement(industries);
    const possibleTitles = jobTitlesData[industry as keyof typeof jobTitlesData] || jobTitlesData.Retail;
    const title = randomElement(possibleTitles);
    const salary = randomSalary();
    
    // 10% featured (premium)
    const isFeatured = Math.random() > 0.9;
    // 30% from aggregated sources (Instagram/social media)
    const isAggregated = Math.random() > 0.7;
    
    jobsData.push({
      companyId: company.id,
      title,
      description: generateJobDescription(title, industry),
      location: randomElement(locations),
      jobType: randomElement(jobTypes),
      industry,
      salaryMin: salary.min,
      salaryMax: salary.max,
      education: randomElement(educationLevels),
      experience: randomElement(experiences),
      isFeatured,
      isActive: Math.random() > 0.05, // 95% active
      source: isAggregated ? (Math.random() > 0.5 ? "instagram" : "aggregated") : "direct",
      sourceUrl: isAggregated ? `https://instagram.com/p/${faker.string.alphanumeric(10)}` : null,
      postedBy: company.createdBy,
    });
  }
  
  await batchInsert(jobs, jobsData, BATCH_SIZE, "jobs");
  console.log(`✅ Created ${TARGET_JOBS.toLocaleString()} jobs\n`);
  
  const allJobs = await db.select().from(jobs).limit(TARGET_JOBS);
  console.log(`✓ Retrieved ${allJobs.length} jobs from database\n`);
  
  // 5. Create AGGREGATED JOBS (AI Review Queue)
  console.log("🤖 PHASE 5: Creating Aggregated Jobs (AI simulation)...");
  const aggregatedJobsData = [];
  const aggregatedCount = 500;
  
  for (let i = 0; i < aggregatedCount; i++) {
    const status = Math.random() > 0.7 ? "pending" : (Math.random() > 0.5 ? "approved" : "rejected");
    const industry = randomElement(industries);
    const possibleTitles = jobTitlesData[industry as keyof typeof jobTitlesData] || jobTitlesData.Retail;
    
    aggregatedJobsData.push({
      rawText: `Lowongan ${randomElement(possibleTitles)} di ${randomElement(locations)}. Gaji ${(3 + Math.floor(Math.random() * 7))}jt. Hub: 08xxxxxxxxx`,
      sourceUrl: `https://instagram.com/p/${faker.string.alphanumeric(10)}`,
      sourcePlatform: "instagram",
      extractedTitle: randomElement(possibleTitles),
      extractedCompany: faker.company.name(),
      extractedLocation: randomElement(locations),
      extractedSalary: `Rp ${(3 + Math.floor(Math.random() * 7))}jt`,
      extractedRequirements: "Min SMA, Pengalaman 1 tahun",
      extractedContact: "08xxxxxxxxx",
      aiConfidence: 60 + Math.floor(Math.random() * 40),
      status,
      reviewedBy: status !== "pending" ? allPemberiKerja[0]?.id : null,
      reviewedAt: status !== "pending" ? new Date() : null,
      publishedJobId: status === "approved" ? allJobs[i % allJobs.length]?.id : null,
    });
  }
  
  await batchInsert(aggregatedJobs, aggregatedJobsData, BATCH_SIZE, "aggregated jobs");
  console.log(`✅ Created ${aggregatedCount} aggregated jobs\n`);
  
  // 6. Create PREMIUM TRANSACTIONS
  console.log("💳 PHASE 6: Creating Premium Transactions...");
  const transactionsData = [];
  const transactionCount = 200;
  
  for (let i = 0; i < transactionCount; i++) {
    const type = Math.random() > 0.5 ? "job_booster" : "slot_package";
    const amount = type === "job_booster" ? 50000 : 200000;
    const status = Math.random() > 0.9 ? "pending" : (Math.random() > 0.05 ? "completed" : "failed");
    
    transactionsData.push({
      userId: randomElement(allPemberiKerja).id,
      jobId: Math.random() > 0.3 ? randomElement(allJobs).id : null,
      type,
      amount,
      status,
      refundReason: status === "failed" ? "Payment gateway error" : null,
    });
  }
  
  await batchInsert(premiumTransactions, transactionsData, BATCH_SIZE, "transactions");
  console.log(`✅ Created ${transactionCount} premium transactions\n`);
  
  // 7. Create SAMPLE APPLICATIONS (limited for performance)
  console.log("📄 PHASE 7: Creating sample Applications...");
  const applicationsData = [];
  const applicationCount = 2000; // Limited to keep DB performant
  const statuses = ["submitted", "reviewed", "shortlisted", "rejected", "accepted"];
  
  for (let i = 0; i < applicationCount; i++) {
    applicationsData.push({
      jobId: randomElement(allJobs).id,
      applicantId: randomElement(allPekerja).id,
      coverLetter: `Dengan hormat,\n\nSaya tertarik untuk melamar posisi ini. ${faker.lorem.paragraph()}\n\nHormat saya,\n${faker.person.fullName()}`,
      status: randomElement(statuses),
    });
  }
  
  await batchInsert(applications, applicationsData, BATCH_SIZE / 2, "applications");
  console.log(`✅ Created ${applicationCount.toLocaleString()} applications\n`);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n${"=".repeat(60)}`);
  console.log("🎉 LARGE SCALE SEED COMPLETED SUCCESSFULLY!");
  console.log(`${"=".repeat(60)}\n`);
  console.log("📊 Summary:");
  console.log(`   - Pekerja: ${TARGET_PEKERJA.toLocaleString()}`);
  console.log(`   - Pemberi Kerja: ${TARGET_PEMBERI_KERJA.toLocaleString()}`);
  console.log(`   - Companies: ${TARGET_COMPANIES.toLocaleString()}`);
  console.log(`   - Jobs: ${TARGET_JOBS.toLocaleString()}`);
  console.log(`   - Aggregated Jobs (AI Queue): ${aggregatedCount}`);
  console.log(`   - Premium Transactions: ${transactionCount}`);
  console.log(`   - Applications: ${applicationCount.toLocaleString()}`);
  console.log(`\n⏱️  Total time: ${duration}s\n`);
  console.log("Test accounts:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Any Pekerja: username: pekerja_* | password: password123");
  console.log("👔 Any Employer: username: employer_* | password: password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

seedLarge()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
