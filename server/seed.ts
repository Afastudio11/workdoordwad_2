import { db } from "./db";
import { users, companies, jobs, blogPosts, applications, wishlists, messages, notifications } from "@shared/schema";
import { eq } from "drizzle-orm";
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
  "Pramuniaga", "Kasir", "SPG/SPB", "Sales Counter", "Customer Service",
  "Supervisor Toko", "Store Manager", "Inventory Staff",
  "Waiters/Waitress", "Barista", "Cook", "Chef", "Kitchen Helper",
  "Restaurant Manager", "Koki", "Pelayan Restoran",
  "Staff Admin", "Admin Gudang", "Data Entry", "Resepsionis",
  "Secretary", "HR Staff", "Finance Staff", "Accounting",
  "IT Support", "Programmer", "Web Developer", "Graphic Designer",
  "Digital Marketing", "Social Media Specialist", "Content Creator",
  "Driver", "Kurir", "Warehouse Staff", "Packing", "Loading",
  "Delivery", "Supir Truk", "Helper Gudang",
  "Tukang Bangunan", "Teknisi", "Mekanik", "Operator Alat Berat",
  "Welder", "Electrician", "Plumber",
  "Perawat", "Apoteker", "Beautician", "Terapis", "Massage Therapist",
  "Guru", "Tutor", "Pengajar", "Admin Sekolah",
  "Operator Produksi", "Quality Control", "Supervisor Produksi",
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
  console.log("🌱 Starting database seeding...");
  
  // Create main accounts for development
  console.log("\n📝 Creating main development accounts...");
  const hashedPasswordWorker = await bcrypt.hash("Pekerja123!", 10);
  const hashedPasswordAdmin = await bcrypt.hash("Admin123!", 10);
  const hashedPasswordEmployer = await bcrypt.hash("Pemberi123!", 10);

  // Try to insert, if conflict then fetch existing users
  let worker = (await db
    .insert(users)
    .values({
      username: "pekerja",
      password: hashedPasswordWorker,
      email: "pekerja@pintukerja.com",
      fullName: "Ahmad Pekerja",
      phone: "081234567890",
      role: "pekerja",
      bio: "Saya seorang web developer dengan pengalaman 3 tahun di bidang frontend dan backend development.",
      dateOfBirth: "1995-05-15",
      gender: "male",
      address: "Jl. Merdeka No. 123",
      city: "Jakarta",
      province: "DKI Jakarta",
      skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "TypeScript"],
      preferredIndustries: ["Technology", "Startup"],
      preferredLocations: ["Jakarta", "Bandung"],
      preferredJobTypes: ["full-time", "remote"],
      expectedSalaryMin: 8000000,
      isActive: true,
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!worker) {
    [worker] = await db.select().from(users).where(eq(users.username, "pekerja"));
  }

  let admin = (await db
    .insert(users)
    .values({
      username: "admin",
      password: hashedPasswordAdmin,
      email: "admin@pintukerja.com",
      fullName: "Admin PintuKerja",
      phone: "081234567891",
      role: "admin",
      bio: "Administrator sistem PintuKerja",
      city: "Jakarta",
      province: "DKI Jakarta",
      isActive: true,
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!admin) {
    [admin] = await db.select().from(users).where(eq(users.username, "admin"));
  }

  let employer = (await db
    .insert(users)
    .values({
      username: "pemberi_kerja",
      password: hashedPasswordEmployer,
      email: "pemberi@pintukerja.com",
      fullName: "Budi Pemberi Kerja",
      phone: "081234567892",
      role: "pemberi_kerja",
      bio: "HR Manager di TechStartup Indonesia",
      city: "Jakarta",
      province: "DKI Jakarta",
      isVerified: true,
      isActive: true,
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!employer) {
    [employer] = await db.select().from(users).where(eq(users.username, "pemberi_kerja"));
  }

  console.log("✓ Main development accounts created:");
  console.log(`  - Pekerja: username=pekerja, password=Pekerja123!`);
  console.log(`  - Admin: username=admin, password=Admin123!`);
  console.log(`  - Pemberi Kerja: username=pemberi_kerja, password=Pemberi123!`);

  // Create test users
  console.log("\nCreating test users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  let testPekerja = (await db
    .insert(users)
    .values({
      username: "pekerja_test",
      password: hashedPassword,
      email: "pekerja@test.com",
      fullName: "Ahmad Setiawan",
      phone: "081234567893",
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
    .onConflictDoNothing())[0];

  if (!testPekerja) {
    [testPekerja] = await db.select().from(users).where(eq(users.username, "pekerja_test"));
  }

  let testEmployer = (await db
    .insert(users)
    .values({
      username: "employer_test",
      password: hashedPassword,
      email: "employer@test.com",
      fullName: "Budi Santoso",
      phone: "081234567894",
      role: "pemberi_kerja",
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!testEmployer) {
    [testEmployer] = await db.select().from(users).where(eq(users.username, "employer_test"));
  }

  console.log("✓ Test users created");
  
  // Create companies for main employer
  console.log("\n🏢 Creating companies for main employer...");
  let company1 = (await db
    .insert(companies)
    .values({
      name: "TechStartup Indonesia",
      description: "Perusahaan teknologi yang berfokus pada pengembangan aplikasi mobile dan web. Kami membantu bisnis bertransformasi digital dengan solusi teknologi inovatif.",
      industry: "Technology",
      location: "Jakarta Selatan",
      website: "https://techstartup.id",
      contactEmail: "hr@techstartup.id",
      contactPhone: "021-12345678",
      employeeCount: "50-100",
      isVerified: true,
      verifiedAt: new Date(),
      createdBy: employer.id,
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!company1) {
    [company1] = await db.select().from(companies).where(eq(companies.name, "TechStartup Indonesia"));
  }

  let company2 = (await db
    .insert(companies)
    .values({
      name: "Digital Marketing Pro",
      description: "Agensi digital marketing yang membantu brand meningkatkan presence online mereka melalui strategi marketing yang terukur dan data-driven.",
      industry: "Marketing",
      location: "Bandung",
      website: "https://digitalmarketingpro.com",
      contactEmail: "careers@digitalmarketingpro.com",
      contactPhone: "022-87654321",
      employeeCount: "20-50",
      isVerified: true,
      verifiedAt: new Date(),
      createdBy: employer.id,
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!company2) {
    [company2] = await db.select().from(companies).where(eq(companies.name, "Digital Marketing Pro"));
  }

  let company3 = (await db
    .insert(companies)
    .values({
      name: "E-Commerce Solutions",
      description: "Platform e-commerce terkemuka di Indonesia yang melayani jutaan pengguna. Kami terus berinovasi untuk memberikan pengalaman berbelanja online terbaik.",
      industry: "E-Commerce",
      location: "Jakarta Barat",
      website: "https://ecommercesolutions.id",
      contactEmail: "recruitment@ecommercesolutions.id",
      contactPhone: "021-99887766",
      employeeCount: "100-500",
      isVerified: true,
      verifiedAt: new Date(),
      createdBy: employer.id,
    })
    .returning()
    .onConflictDoNothing())[0];

  if (!company3) {
    [company3] = await db.select().from(companies).where(eq(companies.name, "E-Commerce Solutions"));
  }

  console.log("✓ Main companies created");
  
  // Create more companies
  console.log("\nCreating additional companies...");
  const createdCompanies = [company1, company2, company3];
  
  for (let i = 0; i < 25; i++) {
    const employeeCounts = ["1 - 10", "2 - 5", "5 - 15", "10 - 50", "50 - 100", "100+"];
    const company = await db.insert(companies).values({
      name: companyNames[i % companyNames.length] + (i >= companyNames.length ? ` ${Math.floor(i / companyNames.length) + 1}` : ''),
      description: `Perusahaan ${randomElement(industries)} terkemuka di Indonesia`,
      industry: randomElement(industries),
      location: randomElement(locations),
      contactEmail: `hr@company${i}.com`,
      contactPhone: `08${Math.floor(Math.random() * 900000000 + 100000000)}`,
      employeeCount: randomElement(employeeCounts),
    }).returning().onConflictDoNothing();
    
    if (company && company[0]) {
      createdCompanies.push(company[0]);
    }
  }
  
  console.log(`✓ Created total ${createdCompanies.length} companies`);
  
  // Create featured jobs for main companies
  console.log("\n💼 Creating featured jobs...");
  await db.insert(jobs).values([
    {
      companyId: company1.id,
      title: "Frontend Developer React",
      description: `
<h3>Tentang Pekerjaan</h3>
<p>Kami mencari Frontend Developer yang berpengalaman dengan React untuk bergabung dengan tim development kami. Kamu akan bertanggung jawab untuk membangun dan memelihara aplikasi web modern yang user-friendly.</p>

<h3>Tanggung Jawab</h3>
<ul>
  <li>Mengembangkan fitur baru menggunakan React dan TypeScript</li>
  <li>Kolaborasi dengan UI/UX designer untuk implementasi design</li>
  <li>Optimasi performa aplikasi web</li>
  <li>Code review dan mentoring junior developer</li>
  <li>Maintenance dan bug fixing</li>
</ul>
      `.trim(),
      requirements: `
<ul>
  <li>Minimal 2 tahun pengalaman dengan React</li>
  <li>Menguasai JavaScript/TypeScript, HTML5, CSS3</li>
  <li>Familiar dengan state management (Redux, Zustand, dll)</li>
  <li>Pengalaman dengan REST API dan GraphQL</li>
  <li>Memahami responsive design dan cross-browser compatibility</li>
  <li>Git version control</li>
</ul>
      `.trim(),
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Technology",
      salaryMin: 8000000,
      salaryMax: 15000000,
      education: "S1",
      experience: "1-3 tahun",
      isFeatured: true,
      isActive: true,
      source: "direct",
      postedBy: employer.id,
      viewCount: 245,
    },
    {
      companyId: company1.id,
      title: "Backend Developer Node.js",
      description: `
<h3>Tentang Pekerjaan</h3>
<p>Kami membuka posisi Backend Developer yang akan bekerja dengan teknologi Node.js dan PostgreSQL. Kamu akan berkontribusi dalam membangun scalable backend systems.</p>
      `.trim(),
      requirements: `
<ul>
  <li>Minimal 2 tahun pengalaman backend development</li>
  <li>Menguasai Node.js dan Express.js</li>
  <li>Pengalaman dengan PostgreSQL atau MySQL</li>
  <li>Memahami RESTful API design principles</li>
  <li>Familiar dengan Docker dan CI/CD</li>
</ul>
      `.trim(),
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Technology",
      salaryMin: 9000000,
      salaryMax: 16000000,
      education: "S1",
      experience: "1-3 tahun",
      isFeatured: true,
      isActive: true,
      source: "direct",
      postedBy: employer.id,
      viewCount: 189,
    },
    {
      companyId: company2.id,
      title: "Digital Marketing Specialist",
      description: "Bergabunglah dengan tim digital marketing kami untuk membantu klien mencapai target marketing mereka.",
      requirements: "Minimal 1 tahun pengalaman di digital marketing\nMenguasai Google Ads, Facebook Ads\nMemahami SEO dan SEM",
      location: "Bandung",
      jobType: "full-time",
      industry: "Marketing",
      salaryMin: 5000000,
      salaryMax: 9000000,
      education: "S1",
      experience: "1-3 tahun",
      isFeatured: false,
      isActive: true,
      source: "direct",
      postedBy: employer.id,
      viewCount: 132,
    },
    {
      companyId: company3.id,
      title: "Product Manager",
      description: "Kami mencari Product Manager yang akan bertanggung jawab untuk mengembangkan dan mengelola product roadmap kami.",
      requirements: "Minimal 3 tahun pengalaman sebagai Product Manager\nStrong analytical skills\nPengalaman dengan agile methodology",
      location: "Jakarta Barat",
      jobType: "full-time",
      industry: "E-Commerce",
      salaryMin: 15000000,
      salaryMax: 25000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: true,
      isActive: true,
      source: "direct",
      postedBy: employer.id,
      viewCount: 312,
    },
    {
      companyId: company3.id,
      title: "UI/UX Designer",
      description: "Join our design team! Kami mencari UI/UX Designer yang akan membantu menciptakan pengalaman berbelanja yang seamless.",
      requirements: "Minimal 2 tahun pengalaman sebagai UI/UX Designer\nPortfolio yang menunjukkan design process\nMenguasai Figma atau Adobe XD",
      location: "Jakarta Barat",
      jobType: "full-time",
      industry: "E-Commerce",
      salaryMin: 8000000,
      salaryMax: 14000000,
      education: "S1",
      experience: "1-3 tahun",
      isFeatured: false,
      isActive: true,
      source: "direct",
      postedBy: employer.id,
      viewCount: 156,
    },
  ]).onConflictDoNothing();

  // Create many more jobs
  console.log("\nCreating additional jobs...");
  const createdJobs = [];
  
  for (let i = 0; i < 75; i++) {
    const company = randomElement(createdCompanies);
    const title = randomElement(jobTitles);
    const salary = randomSalary();
    const isFeatured = Math.random() > 0.9;
    const isInstagram = Math.random() > 0.3;
    
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
    }).returning().onConflictDoNothing();
    
    if (job && job[0]) {
      createdJobs.push(job[0]);
    }
  }
  
  console.log(`✓ Created total ~80 jobs`);

  // Create blog posts
  console.log("\n📝 Creating blog posts...");
  await db.insert(blogPosts).values([
    {
      slug: "tips-cv-yang-menarik-perhatian-hrd",
      title: "7 Tips Membuat CV yang Menarik Perhatian HRD",
      excerpt: "CV adalah kunci pertama untuk mendapatkan pekerjaan impian. Pelajari cara membuat CV yang profesional dan eye-catching untuk meningkatkan peluang Anda dipanggil interview.",
      content: `
<p>Curriculum Vitae (CV) adalah dokumen pertama yang dilihat oleh HRD atau recruiter ketika Anda melamar pekerjaan. CV yang baik dapat meningkatkan peluang Anda untuk dipanggil interview hingga berkali-kali lipat. Berikut adalah 7 tips untuk membuat CV yang menarik perhatian HRD:</p>

<h2>1. Gunakan Format yang Clean dan Profesional</h2>
<p>Pilih template CV yang clean, mudah dibaca, dan tidak terlalu ramai. Gunakan font yang profesional seperti Arial, Calibri, atau Times New Roman dengan ukuran 10-12pt.</p>

<h2>2. Tulis Summary yang Kuat</h2>
<p>Di bagian awal CV, tulis summary singkat (2-3 kalimat) yang merangkum pengalaman dan keahlian Anda.</p>

<h2>3. Fokus pada Achievement, Bukan Hanya Job Description</h2>
<p>Gunakan angka dan data konkret. Contoh: "Meningkatkan konversi penjualan sebesar 25% dalam 6 bulan".</p>
      `.trim(),
      heroImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
      category: "Tips",
      tags: ["CV", "Job Search", "Career Tips", "Interview"],
      readTime: "5 min read",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2024-01-15"),
    },
    {
      slug: "cara-sukses-interview-kerja",
      title: "Rahasia Sukses Interview Kerja: Panduan Lengkap",
      excerpt: "Interview adalah tahap krusial dalam proses rekrutmen. Pelajari strategi dan tips praktis untuk menghadapi interview dengan percaya diri.",
      content: `
<p>Interview kerja seringkali menjadi momen yang menegangkan bagi banyak orang. Namun dengan persiapan yang tepat, Anda bisa menghadapi interview dengan percaya diri.</p>

<h2>Persiapan Sebelum Interview</h2>
<p>Research perusahaan, pahami job description, dan siapkan jawaban untuk pertanyaan umum.</p>

<h2>Saat Interview</h2>
<p>First impression matters - datang tepat waktu, berpakaian profesional, dan tunjukkan antusiasme.</p>
      `.trim(),
      heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=600&fit=crop",
      category: "Tips",
      tags: ["Interview", "Career Tips", "Job Search"],
      readTime: "8 min read",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2024-01-20"),
    },
    {
      slug: "tren-pekerjaan-2024",
      title: "Tren Pekerjaan 2024: Skill yang Paling Dicari Perusahaan",
      excerpt: "Dunia kerja terus berevolusi. Ketahui skill apa saja yang paling dicari oleh perusahaan di tahun 2024.",
      content: `
<p>Tahun 2024 membawa perubahan signifikan dalam lanskap pekerjaan global.</p>

<h2>Technical Skills yang Paling Dicari</h2>
<ul>
  <li>Artificial Intelligence & Machine Learning</li>
  <li>Cloud Computing</li>
  <li>Cybersecurity</li>
  <li>Data Science & Analytics</li>
</ul>

<h2>Soft Skills yang Semakin Penting</h2>
<p>Adaptability, critical thinking, communication, dan emotional intelligence.</p>
      `.trim(),
      heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      category: "Insight",
      tags: ["Career Trends", "Skills", "Future of Work"],
      readTime: "10 min read",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2024-01-25"),
    },
    {
      slug: "work-life-balance-tips",
      title: "Mencapai Work-Life Balance yang Sehat",
      excerpt: "Work-life balance bukan mitos! Pelajari strategi praktis untuk menjaga keseimbangan antara pekerjaan dan kehidupan pribadi.",
      content: `
<p>Di era hustle culture, work-life balance seringkali terasa seperti luxury yang tidak terjangkau.</p>

<h2>Mengapa Work-Life Balance Penting?</h2>
<p>Research menunjukkan bahwa employees dengan good work-life balance lebih produktif dan engaged di work.</p>

<h2>Strategi Mencapai Work-Life Balance</h2>
<ul>
  <li>Set Clear Boundaries</li>
  <li>Prioritize Tasks Effectively</li>
  <li>Take Regular Breaks</li>
  <li>Practice Self-Care</li>
</ul>
      `.trim(),
      heroImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop",
      category: "Newsletter",
      tags: ["Work-Life Balance", "Mental Health", "Wellness"],
      readTime: "7 min read",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date("2024-02-01"),
    },
  ]).onConflictDoNothing();

  console.log("✓ Blog posts created");
  
  // Create sample data for test accounts
  console.log("\nCreating applications and interactions...");
  const statuses = ["submitted", "reviewed", "shortlisted", "rejected", "accepted"];
  const createdApplications = [];
  
  for (let i = 0; i < 10; i++) {
    if (createdJobs.length > 0) {
      const app = await db.insert(applications).values({
        jobId: randomElement(createdJobs).id,
        applicantId: testPekerja.id,
        coverLetter: `Saya tertarik dengan posisi ini. Saya memiliki pengalaman yang relevan dan siap untuk bergabung dengan tim Anda.`,
        status: randomElement(statuses),
      }).returning().onConflictDoNothing();
      if (app && app[0]) {
        createdApplications.push(app[0]);
      }
    }
  }
  
  console.log(`✓ Created ${createdApplications.length} applications`);
  
  // Create wishlists
  for (let i = 0; i < 5; i++) {
    if (createdJobs.length > 0) {
      await db.insert(wishlists).values({
        userId: testPekerja.id,
        jobId: randomElement(createdJobs).id,
      }).onConflictDoNothing();
    }
  }
  
  console.log(`✓ Created wishlist items`);
  
  // Create messages
  const messageableApps = createdApplications.filter(app => 
    app.status === "shortlisted" || app.status === "accepted"
  );
  
  for (const app of messageableApps.slice(0, 3)) {
    await db.insert(messages).values({
      senderId: testEmployer.id,
      receiverId: testPekerja.id,
      applicationId: app.id,
      jobId: app.jobId,
      content: `Halo! Kami tertarik dengan lamaran Anda. Apakah Anda bisa hadir untuk wawancara minggu ini?`,
      isRead: false,
    }).onConflictDoNothing();
  }
  
  console.log(`✓ Created message threads`);
  
  // Create notifications
  const notificationTypes = [
    {
      type: "application_status",
      title: "Status Lamaran Diperbarui",
      message: "Lamaran Anda telah di-review",
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
  ];
  
  for (let i = 0; i < 5; i++) {
    const notif = randomElement(notificationTypes);
    await db.insert(notifications).values({
      userId: testPekerja.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      linkUrl: notif.linkUrl,
      isRead: Math.random() > 0.5,
    }).onConflictDoNothing();
  }
  
  console.log(`✓ Created notifications`);
  
  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Companies: ${createdCompanies.length}`);
  console.log(`   - Jobs: ~80`);
  console.log(`   - Blog Posts: 4`);
  console.log(`   - Applications: ${createdApplications.length}`);
  console.log(`   - Sample interactions (wishlists, messages, notifications)`);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 MAIN DEVELOPMENT ACCOUNTS (PERSISTENT):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n👤 PEKERJA (Worker):");
  console.log("   Username: pekerja");
  console.log("   Password: Pekerja123!");
  console.log("   Email: pekerja@pintukerja.com");
  console.log("\n👔 ADMIN:");
  console.log("   Username: admin");
  console.log("   Password: Admin123!");
  console.log("   Email: admin@pintukerja.com");
  console.log("\n🏢 PEMBERI KERJA (Employer):");
  console.log("   Username: pemberi_kerja");
  console.log("   Password: Pemberi123!");
  console.log("   Email: pemberi@pintukerja.com");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nTest accounts (for testing only):");
  console.log("  - pekerja_test / password123");
  console.log("  - employer_test / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
