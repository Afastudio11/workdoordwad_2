import { db } from "./db";
import { users, companies, jobs, applications } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedEmployers() {
  console.log("🌱 Creating 4 employers with different subscription plans...");

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 1. FREE PLAN - Pemberi Kerja
  console.log("\n📦 Creating FREE plan employer...");
  const [employerFree] = await db.insert(users).values({
    username: "warung.makan",
    password: hashedPassword,
    email: "owner@warungmakan.com",
    fullName: "Ibu Siti Rahayu",
    phone: "081234560001",
    role: "pemberi_kerja",
    city: "Jakarta",
    address: "Jl. Raya Condet No. 45",
    verificationStatus: "verified",
    isActive: true,
    emailVerified: true,
  }).returning();

  const [companyFree] = await db.insert(companies).values({
    name: "Warung Makan Bu Siti",
    description: "Warung makan rumahan dengan menu masakan Indonesia yang lezat dan harga terjangkau. Sudah berdiri sejak 2015 dan memiliki pelanggan setia.",
    industry: "F&B",
    location: "Jakarta Timur",
    contactEmail: "owner@warungmakan.com",
    contactPhone: "021-8765432",
    whatsappNumber: "081234560001",
    employeeCount: "1-10",
    foundedYear: "2015",
    picName: "Ibu Siti Rahayu",
    picPosition: "Owner",
    subscriptionPlan: "free",
    verificationStatus: "verified",
    verifiedAt: new Date(),
    createdBy: employerFree.id,
  }).returning();

  // Create 2 jobs for FREE plan (limited)
  const [jobFree1] = await db.insert(jobs).values({
    companyId: companyFree.id,
    title: "Pelayan Warung Makan",
    description: "Dicari pelayan untuk warung makan. Tugas meliputi melayani pelanggan, mengambil pesanan, dan menjaga kebersihan warung.",
    requirements: "- Minimal SMA/SMK\n- Jujur dan rajin\n- Ramah dan sopan\n- Bersedia bekerja shift\n- Domisili sekitar Jakarta Timur",
    location: "Jakarta Timur",
    jobType: "full-time",
    industry: "F&B",
    salaryMin: 3000000,
    salaryMax: 4000000,
    education: "SMA",
    experience: "0-1 tahun",
    isFeatured: false,
    isUrgent: false,
    isActive: true,
    postedBy: employerFree.id,
    viewCount: 45,
  }).returning();

  await db.insert(jobs).values({
    companyId: companyFree.id,
    title: "Juru Masak / Koki",
    description: "Membutuhkan juru masak yang bisa memasak masakan Indonesia. Pengalaman minimal 1 tahun.",
    requirements: "- Bisa memasak masakan Indonesia\n- Pengalaman minimal 1 tahun\n- Jujur dan bertanggung jawab\n- Bersih dan rapi",
    location: "Jakarta Timur",
    jobType: "full-time",
    industry: "F&B",
    salaryMin: 4000000,
    salaryMax: 5500000,
    education: "SMA",
    experience: "1-3 tahun",
    isFeatured: false,
    isUrgent: false,
    isActive: true,
    postedBy: employerFree.id,
    viewCount: 32,
  });

  console.log("✓ FREE plan employer created");

  // 2. STARTER PLAN - Pemberi Kerja
  console.log("\n📦 Creating STARTER plan employer...");
  const [employerStarter] = await db.insert(users).values({
    username: "toko.elektronik",
    password: hashedPassword,
    email: "hr@tokoelektronik.com",
    fullName: "Pak Andi Wijaya",
    phone: "081234560002",
    role: "pemberi_kerja",
    city: "Bandung",
    address: "Jl. Cihampelas No. 88",
    verificationStatus: "verified",
    isActive: true,
    emailVerified: true,
  }).returning();

  const [companyStarter] = await db.insert(companies).values({
    name: "Toko Elektronik Maju Jaya",
    description: "Toko elektronik terpercaya di Bandung. Menjual berbagai produk elektronik, gadget, dan aksesoris dengan harga kompetitif. Melayani penjualan retail dan grosir.",
    industry: "Retail",
    location: "Bandung",
    website: "https://www.elektronikjaya.com",
    contactEmail: "hr@tokoelektronik.com",
    contactPhone: "022-7654321",
    whatsappNumber: "081234560002",
    employeeCount: "11-50",
    foundedYear: "2018",
    picName: "Pak Andi Wijaya",
    picPosition: "Owner & General Manager",
    subscriptionPlan: "starter",
    subscriptionStartDate: new Date("2024-10-01"),
    subscriptionEndDate: new Date("2024-12-31"),
    subscriptionDuration: "3_months",
    paymentStatus: "completed",
    verificationStatus: "verified",
    verifiedAt: new Date(),
    createdBy: employerStarter.id,
  }).returning();

  // Create 5 jobs for STARTER plan
  await db.insert(jobs).values([
    {
      companyId: companyStarter.id,
      title: "Sales Toko Elektronik",
      description: "Dicari sales yang berpengalaman untuk melayani pelanggan di toko elektronik. Bertugas membantu pelanggan memilih produk dan mencapai target penjualan.",
      requirements: "- Minimal SMA/SMK\n- Pengalaman di retail minimal 1 tahun\n- Komunikatif dan ramah\n- Mengerti produk elektronik (nilai plus)\n- Target oriented",
      location: "Bandung",
      jobType: "full-time",
      industry: "Retail",
      salaryMin: 4000000,
      salaryMax: 6000000,
      education: "SMA",
      experience: "1-3 tahun",
      isFeatured: true,
      isUrgent: false,
      isActive: true,
      postedBy: employerStarter.id,
      viewCount: 156,
    },
    {
      companyId: companyStarter.id,
      title: "Teknisi Elektronik",
      description: "Membutuhkan teknisi untuk service dan perbaikan produk elektronik.",
      requirements: "- Minimal SMK Teknik Elektronika\n- Bisa service berbagai produk elektronik\n- Pengalaman minimal 2 tahun\n- Teliti dan bertanggung jawab",
      location: "Bandung",
      jobType: "full-time",
      industry: "Retail",
      salaryMin: 4500000,
      salaryMax: 7000000,
      education: "SMA",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: true,
      isActive: true,
      postedBy: employerStarter.id,
      viewCount: 89,
    },
    {
      companyId: companyStarter.id,
      title: "Kasir Toko",
      description: "Dibutuhkan kasir untuk melayani transaksi penjualan di toko.",
      requirements: "- Minimal SMA\n- Jujur dan teliti\n- Bisa mengoperasikan komputer\n- Pengalaman sebagai kasir (lebih diutamakan)",
      location: "Bandung",
      jobType: "full-time",
      industry: "Retail",
      salaryMin: 3500000,
      salaryMax: 4500000,
      education: "SMA",
      experience: "0-1 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerStarter.id,
      viewCount: 67,
    },
    {
      companyId: companyStarter.id,
      title: "Admin Gudang",
      description: "Mengelola inventory dan administrasi gudang toko elektronik.",
      requirements: "- Minimal SMA\n- Bisa Microsoft Excel\n- Teliti dan rapi\n- Pengalaman admin gudang lebih diutamakan",
      location: "Bandung",
      jobType: "full-time",
      industry: "Retail",
      salaryMin: 4000000,
      salaryMax: 5500000,
      education: "SMA",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerStarter.id,
      viewCount: 45,
    },
    {
      companyId: companyStarter.id,
      title: "Driver & Kurir",
      description: "Mengantarkan barang elektronik ke pelanggan.",
      requirements: "- Memiliki SIM C/A\n- Kendaraan sendiri (motor/mobil)\n- Mengenal wilayah Bandung\n- Jujur dan bertanggung jawab",
      location: "Bandung",
      jobType: "full-time",
      industry: "Retail",
      salaryMin: 3500000,
      salaryMax: 5000000,
      education: "SMA",
      experience: "0-1 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerStarter.id,
      viewCount: 78,
    },
  ]);

  console.log("✓ STARTER plan employer created");

  // 3. PROFESSIONAL PLAN - Pemberi Kerja
  console.log("\n📦 Creating PROFESSIONAL plan employer...");
  const [employerPro] = await db.insert(users).values({
    username: "pt.logistik",
    password: hashedPassword,
    email: "recruitment@logistikexpress.com",
    fullName: "Bapak Hendro Susanto",
    phone: "081234560003",
    role: "pemberi_kerja",
    city: "Surabaya",
    address: "Jl. Raya Industri No. 100",
    verificationStatus: "verified",
    isActive: true,
    emailVerified: true,
  }).returning();

  const [companyPro] = await db.insert(companies).values({
    name: "PT Logistik Express Indonesia",
    description: "Perusahaan logistik dan pengiriman barang terkemuka di Indonesia Timur. Melayani pengiriman domestik dan internasional dengan armada lengkap dan teknologi tracking modern.",
    industry: "Logistik",
    location: "Surabaya",
    website: "https://www.logistikexpress.co.id",
    contactEmail: "recruitment@logistikexpress.com",
    contactPhone: "031-5551234",
    whatsappNumber: "081234560003",
    logo: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=200",
    employeeCount: "51-200",
    foundedYear: "2012",
    picName: "Hendro Susanto",
    picPosition: "HR Manager",
    subscriptionPlan: "professional",
    subscriptionStartDate: new Date("2024-09-01"),
    subscriptionEndDate: new Date("2025-08-31"),
    subscriptionDuration: "12_months",
    paymentStatus: "completed",
    verificationStatus: "verified",
    verifiedAt: new Date(),
    createdBy: employerPro.id,
  }).returning();

  // Create 8 jobs for PROFESSIONAL plan
  await db.insert(jobs).values([
    {
      companyId: companyPro.id,
      title: "Warehouse Supervisor",
      description: "Memimpin tim warehouse dan bertanggung jawab atas operasional gudang sehari-hari. Mengelola inventory, loading/unloading, dan memastikan efisiensi operasional.",
      requirements: "- Minimal D3/S1\n- Pengalaman minimal 3 tahun di warehouse/logistik\n- Leadership skill yang baik\n- Familiar dengan sistem WMS\n- Bersedia kerja shift",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 7000000,
      salaryMax: 11000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: true,
      isUrgent: true,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 234,
    },
    {
      companyId: companyPro.id,
      title: "Driver Truk Fuso",
      description: "Mengoperasikan truk untuk pengiriman barang antar kota.",
      requirements: "- SIM B2 Umum\n- Pengalaman minimal 2 tahun mengendarai truk\n- Mengenal rute Jawa Timur\n- Sehat jasmani dan rohani\n- Bersedia perjalanan jauh",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 5000000,
      salaryMax: 8000000,
      education: "SMA",
      experience: "1-3 tahun",
      isFeatured: true,
      isUrgent: false,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 189,
    },
    {
      companyId: companyPro.id,
      title: "Admin Logistik",
      description: "Mengelola dokumentasi dan administrasi pengiriman barang.",
      requirements: "- Minimal D3\n- Familiar dengan sistem logistik\n- Mahir Microsoft Office terutama Excel\n- Teliti dan detail oriented\n- Komunikasi yang baik",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 4500000,
      salaryMax: 6500000,
      education: "D3",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 98,
    },
    {
      companyId: companyPro.id,
      title: "Customer Service Officer",
      description: "Melayani pelanggan, menangani komplain, dan memberikan informasi tentang layanan pengiriman.",
      requirements: "- Minimal SMA/SMK\n- Pengalaman CS minimal 1 tahun\n- Komunikatif dan ramah\n- Problem solving skill\n- Bisa bahasa Inggris (nilai plus)",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 4000000,
      salaryMax: 6000000,
      education: "SMA",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 145,
    },
    {
      companyId: companyPro.id,
      title: "Loading & Unloading Staff",
      description: "Bertanggung jawab untuk bongkar muat barang di warehouse.",
      requirements: "- Minimal SMP\n- Fisik sehat dan kuat\n- Teliti dan hati-hati\n- Bisa bekerja dalam tim\n- Bersedia kerja shift",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 3500000,
      salaryMax: 4500000,
      education: "SMA",
      experience: "0-1 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 112,
    },
    {
      companyId: companyPro.id,
      title: "IT Support Staff",
      description: "Memberikan support IT untuk sistem logistik dan peralatan kantor.",
      requirements: "- Minimal D3 Teknik Informatika\n- Pengalaman IT Support minimal 1 tahun\n- Troubleshooting hardware & software\n- Networking basic\n- Customer oriented",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 5000000,
      salaryMax: 7500000,
      education: "D3",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 87,
    },
    {
      companyId: companyPro.id,
      title: "Kurir Sepeda Motor",
      description: "Mengantarkan paket ke pelanggan di area Surabaya.",
      requirements: "- SIM C aktif\n- Motor sendiri\n- Mengenal area Surabaya\n- Jujur dan tepat waktu\n- Smartphone Android",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 3000000,
      salaryMax: 5000000,
      education: "SMA",
      experience: "0-1 tahun",
      isFeatured: false,
      isUrgent: true,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 267,
    },
    {
      companyId: companyPro.id,
      title: "Finance & Accounting Staff",
      description: "Mengelola pembukuan, invoice, dan laporan keuangan perusahaan.",
      requirements: "- Minimal S1 Akuntansi\n- Pengalaman minimal 2 tahun\n- Mahir software akuntansi\n- Teliti dan detail oriented\n- Memahami perpajakan",
      location: "Surabaya",
      jobType: "full-time",
      industry: "Logistik",
      salaryMin: 6000000,
      salaryMax: 9000000,
      education: "S1",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerPro.id,
      viewCount: 76,
    },
  ]);

  console.log("✓ PROFESSIONAL plan employer created");

  // 4. ENTERPRISE PLAN - Pemberi Kerja
  console.log("\n📦 Creating ENTERPRISE plan employer...");
  const [employerEnterprise] = await db.insert(users).values({
    username: "bank.digital",
    password: hashedPassword,
    email: "career@bankdigital.co.id",
    fullName: "Ibu Diana Kartika",
    phone: "081234560004",
    role: "pemberi_kerja",
    city: "Jakarta",
    address: "Menara Bank Digital, Jl. Jendral Sudirman Kav. 52-53",
    verificationStatus: "verified",
    isActive: true,
    emailVerified: true,
  }).returning();

  const [companyEnterprise] = await db.insert(companies).values({
    name: "PT Bank Digital Nusantara",
    description: "Bank digital terkemuka di Indonesia yang menyediakan layanan perbankan modern dan inovatif. Kami berkomitmen untuk memberikan pengalaman perbankan terbaik melalui teknologi digital yang canggih dan user-friendly.",
    industry: "Teknologi",
    location: "Jakarta Selatan",
    website: "https://www.bankdigital.co.id",
    contactEmail: "career@bankdigital.co.id",
    contactPhone: "021-5551234",
    whatsappNumber: "081234560004",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    employeeCount: "201-500",
    foundedYear: "2019",
    picName: "Diana Kartika",
    picPosition: "Head of Talent Acquisition",
    subscriptionPlan: "enterprise",
    subscriptionStartDate: new Date("2024-01-01"),
    subscriptionEndDate: new Date("2024-12-31"),
    subscriptionDuration: "12_months",
    paymentStatus: "completed",
    verificationStatus: "verified",
    verifiedAt: new Date(),
    createdBy: employerEnterprise.id,
  }).returning();

  // Create 10 jobs for ENTERPRISE plan (unlimited posting)
  const [jobEnterprise1] = await db.insert(jobs).values({
    companyId: companyEnterprise.id,
    title: "Senior Backend Engineer (Go/Node.js)",
    description: `
<h3>Tentang Posisi</h3>
<p>Kami mencari Senior Backend Engineer yang akan bertanggung jawab untuk merancang dan mengembangkan sistem backend yang scalable dan reliable untuk platform banking kami yang melayani jutaan pengguna.</p>

<h3>Tanggung Jawab</h3>
<ul>
  <li>Design dan develop RESTful API dan microservices</li>
  <li>Optimize database queries dan improve system performance</li>
  <li>Implement security best practices untuk aplikasi banking</li>
  <li>Code review dan mentoring junior engineers</li>
  <li>Collaborate dengan product dan frontend team</li>
</ul>

<h3>Requirements</h3>
<ul>
  <li>Minimal S1 Teknik Informatika atau setara</li>
  <li>5+ tahun pengalaman backend development</li>
  <li>Expert di Go atau Node.js</li>
  <li>Strong understanding of microservices architecture</li>
  <li>Pengalaman dengan PostgreSQL, Redis, Kafka</li>
  <li>Familiar dengan cloud platforms (AWS/GCP)</li>
  <li>Pengalaman di fintech/banking (nilai plus)</li>
</ul>
    `.trim(),
    requirements: "Expert level Go/Node.js, Microservices, PostgreSQL, Redis, Kafka",
    location: "Jakarta Selatan",
    jobType: "full-time",
    industry: "Teknologi",
    salaryMin: 20000000,
    salaryMax: 35000000,
    education: "S1",
    experience: "3-5 tahun",
    isFeatured: true,
    isUrgent: true,
    isActive: true,
    postedBy: employerEnterprise.id,
    viewCount: 445,
  }).returning();

  await db.insert(jobs).values([
    {
      companyId: companyEnterprise.id,
      title: "Mobile Engineer (React Native/Flutter)",
      description: "Develop dan maintain aplikasi mobile banking kami yang digunakan oleh jutaan pengguna.",
      requirements: "- Minimal S1 Teknik Informatika\n- 3+ tahun pengalaman mobile development\n- Expert React Native atau Flutter\n- Pengalaman publish app ke Play Store & App Store\n- Understanding of mobile security",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 15000000,
      salaryMax: 28000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: true,
      isUrgent: true,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 389,
    },
    {
      companyId: companyEnterprise.id,
      title: "DevOps Engineer",
      description: "Mengelola infrastructure dan CI/CD pipeline untuk platform banking kami.",
      requirements: "- Minimal S1 Teknik Informatika\n- 3+ tahun pengalaman DevOps\n- Expert Kubernetes, Docker\n- Pengalaman dengan AWS/GCP\n- Strong scripting skills (Python/Bash)\n- Monitoring & logging tools",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 18000000,
      salaryMax: 30000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: true,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 312,
    },
    {
      companyId: companyEnterprise.id,
      title: "Product Manager - Digital Banking",
      description: "Lead product development untuk fitur-fitur banking digital kami.",
      requirements: "- Minimal S1 bidang terkait\n- 4+ tahun pengalaman sebagai Product Manager\n- Strong analytical & data-driven mindset\n- Pengalaman di fintech/banking\n- Excellent communication skills",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 22000000,
      salaryMax: 40000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: true,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 267,
    },
    {
      companyId: companyEnterprise.id,
      title: "UI/UX Designer - Mobile App",
      description: "Design user experience untuk aplikasi mobile banking yang intuitive dan user-friendly.",
      requirements: "- Minimal S1 Desain/DKV\n- 3+ tahun pengalaman UI/UX Design\n- Expert Figma\n- Portfolio mobile app design\n- Understanding of design systems\n- User research & testing experience",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 12000000,
      salaryMax: 22000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 198,
    },
    {
      companyId: companyEnterprise.id,
      title: "Data Scientist",
      description: "Analyze data untuk improve product dan business decision making.",
      requirements: "- Minimal S1 Statistik/Matematika/CS\n- 3+ tahun pengalaman data science\n- Expert Python, SQL\n- Machine Learning & AI\n- Data visualization tools\n- Pengalaman di fintech (nilai plus)",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 16000000,
      salaryMax: 28000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 234,
    },
    {
      companyId: companyEnterprise.id,
      title: "Customer Experience Manager",
      description: "Memimpin tim customer service dan meningkatkan customer satisfaction.",
      requirements: "- Minimal S1\n- 4+ tahun pengalaman customer service/CX\n- Leadership skills\n- Data-driven approach\n- Excellent communication\n- Pengalaman di banking/fintech",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 14000000,
      salaryMax: 24000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 156,
    },
    {
      companyId: companyEnterprise.id,
      title: "Compliance Officer",
      description: "Ensure compliance dengan regulasi OJK dan perbankan Indonesia.",
      requirements: "- Minimal S1 Hukum/Ekonomi\n- 3+ tahun pengalaman compliance di banking\n- Memahami regulasi OJK\n- Detail oriented\n- Strong analytical skills",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 13000000,
      salaryMax: 22000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 134,
    },
    {
      companyId: companyEnterprise.id,
      title: "Security Engineer",
      description: "Protect sistem banking dari cyber threats dan vulnerability.",
      requirements: "- Minimal S1 Teknik Informatika\n- 3+ tahun pengalaman security\n- Penetration testing\n- Security tools & frameworks\n- Certifications (CISSP/CEH nilai plus)",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 18000000,
      salaryMax: 32000000,
      education: "S1",
      experience: "3-5 tahun",
      isFeatured: false,
      isUrgent: true,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 201,
    },
    {
      companyId: companyEnterprise.id,
      title: "QA Engineer - Automation",
      description: "Develop dan maintain automated testing untuk ensure quality aplikasi.",
      requirements: "- Minimal S1 Teknik Informatika\n- 2+ tahun pengalaman QA automation\n- Selenium, Appium\n- Programming (Python/Java)\n- API testing\n- CI/CD integration",
      location: "Jakarta Selatan",
      jobType: "full-time",
      industry: "Teknologi",
      salaryMin: 10000000,
      salaryMax: 18000000,
      education: "S1",
      experience: "1-3 tahun",
      isFeatured: false,
      isUrgent: false,
      isActive: true,
      postedBy: employerEnterprise.id,
      viewCount: 167,
    },
  ]);

  console.log("✓ ENTERPRISE plan employer created");

  // Get existing workers untuk membuat aplikasi
  const workers = await db.select().from(users).where(eq(users.role, "pekerja"));

  if (workers.length > 0) {
    console.log("\n📝 Creating job applications...");
    
    // Create applications untuk beberapa jobs
    const applicationsData = [
      // Applications ke FREE plan jobs
      {
        jobId: jobFree1.id,
        applicantId: workers[0]?.id,
        coverLetter: "Saya tertarik dengan posisi pelayan warung makan ini. Saya rajin, jujur, dan siap belajar.",
        status: "submitted",
      },
      // Applications ke ENTERPRISE plan jobs (high-tier)
      {
        jobId: jobEnterprise1.id,
        applicantId: workers[0]?.id,
        coverLetter: "Saya memiliki pengalaman 5 tahun sebagai Backend Engineer dengan expertise di Node.js dan microservices. Portfolio saya mencakup project-project scalable yang menangani jutaan users.",
        status: "shortlisted",
      },
    ];

    for (const appData of applicationsData) {
      if (appData.applicantId) {
        await db.insert(applications).values(appData);
      }
    }

    console.log("✓ Applications created");
  }

  console.log("\n✅ All 4 employers with different plans created successfully!");
  console.log("\n📊 Summary:");
  console.log("=" .repeat(60));
  console.log("1. FREE Plan:");
  console.log("   Username: warung.makan");
  console.log("   Company: Warung Makan Bu Siti");
  console.log("   Jobs: 2 lowongan");
  console.log("");
  console.log("2. STARTER Plan (3 bulan):");
  console.log("   Username: toko.elektronik");
  console.log("   Company: Toko Elektronik Maju Jaya");
  console.log("   Jobs: 5 lowongan (1 featured, 1 urgent)");
  console.log("");
  console.log("3. PROFESSIONAL Plan (12 bulan):");
  console.log("   Username: pt.logistik");
  console.log("   Company: PT Logistik Express Indonesia");
  console.log("   Jobs: 8 lowongan (2 featured, 2 urgent)");
  console.log("");
  console.log("4. ENTERPRISE Plan (12 bulan):");
  console.log("   Username: bank.digital");
  console.log("   Company: PT Bank Digital Nusantara");
  console.log("   Jobs: 10 lowongan (4 featured, 2 urgent)");
  console.log("=" .repeat(60));
  console.log("\n🔑 Password untuk semua akun: Password123!");
}

seedEmployers()
  .then(() => {
    console.log("\n✨ Employer seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding employers:", error);
    process.exit(1);
  });
