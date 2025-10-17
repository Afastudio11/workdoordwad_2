import { db } from "./db";
import { companies, jobs } from "@shared/schema";

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
  console.log("✅ Seed completed!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
