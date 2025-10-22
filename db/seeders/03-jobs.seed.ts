import { db } from "../../server/db";
import { jobs, companies, users } from "../../shared/schema";
import { eq } from "drizzle-orm";

export async function seedJobs() {
  console.log("🌱 Seeding jobs...");

  // Get all companies
  const allCompanies = await db.select().from(companies);
  
  if (allCompanies.length === 0) {
    console.log("  ⚠️  No companies found. Skipping job seeding.");
    return;
  }

  // Get employer user
  const employer = await db
    .select()
    .from(users)
    .where(eq(users.email, "employer@company.com"))
    .limit(1);

  if (employer.length === 0) {
    console.log("  ⚠️  Employer user not found. Skipping job seeding.");
    return;
  }

  const postedBy = employer[0].id;

  // Job positions (30 different positions, each will appear 3 times)
  const positions = [
    "Web Developer",
    "Mobile Developer",
    "UI/UX Designer",
    "Data Analyst",
    "Digital Marketing Specialist",
    "Content Writer",
    "Sales Executive",
    "Customer Service Representative",
    "Accounting Staff",
    "Human Resources Officer",
    "Project Manager",
    "Product Manager",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Tester",
    "Business Analyst",
    "Graphic Designer",
    "Video Editor",
    "Social Media Specialist",
    "SEO Specialist",
    "Marketing Manager",
    "Finance Manager",
    "Operations Manager",
    "Data Scientist",
    "Machine Learning Engineer",
    "Mobile App Developer (iOS)",
    "Mobile App Developer (Android)",
    "System Administrator",
  ];

  const locations = [
    "Jakarta", "Surabaya", "Bandung", "Yogyakarta", "Semarang",
    "Medan", "Bali", "Makassar", "Malang", "Tangerang",
    "Bekasi", "Bogor", "Depok", "Solo"
  ];

  const jobTypes = [
    { type: "full-time", count: 50 },
    { type: "part-time", count: 15 },
    { type: "freelance", count: 10 },
    { type: "contract", count: 15 },
  ];

  const levels = ["Entry Level", "Junior", "Mid Level", "Senior", "Manager"];
  const educationLevels = ["SMA", "D3", "S1", "S2"];

  // Job descriptions templates
  const getJobDescription = (position: string, level: string) => {
    const baseDesc = `Kami sedang mencari ${position} yang berpengalaman dan berdedikasi untuk bergabung dengan tim kami. Sebagai ${position} ${level}, Anda akan bertanggung jawab untuk mengembangkan dan meningkatkan produk/layanan kami.`;
    
    const responsibilities = `<h3>Tanggung Jawab:</h3><ul>
      <li>Mengembangkan dan mengimplementasikan solusi sesuai kebutuhan bisnis</li>
      <li>Berkolaborasi dengan tim lintas fungsi untuk mencapai tujuan perusahaan</li>
      <li>Melakukan analisis dan pelaporan berkala kepada atasan</li>
      <li>Memberikan kontribusi dalam peningkatan proses kerja</li>
      <li>Menjaga kualitas pekerjaan sesuai standar perusahaan</li>
    </ul>`;
    
    return baseDesc + responsibilities;
  };

  const getRequirements = (position: string, level: string, education: string) => {
    return `<h3>Kualifikasi:</h3><ul>
      <li>Pendidikan minimal ${education} dari jurusan terkait</li>
      <li>Pengalaman kerja ${level === "Entry Level" ? "0-1 tahun" : level === "Junior" ? "1-2 tahun" : level === "Mid Level" ? "3-5 tahun" : level === "Senior" ? "5-7 tahun" : "7+ tahun"}</li>
      <li>Menguasai tools dan teknologi yang relevan dengan posisi</li>
      <li>Memiliki kemampuan komunikasi yang baik</li>
      <li>Mampu bekerja dalam tim maupun individu</li>
      <li>Proaktif dan memiliki inisiatif tinggi</li>
      <li>Bersedia bekerja di bawah tekanan dan deadline</li>
      ${level !== "Entry Level" ? "<li>Memiliki portofolio atau pengalaman proyek yang relevan</li>" : ""}
    </ul>`;
  };

  const getSalaryRange = (level: string): { min: number; max: number } => {
    switch (level) {
      case "Entry Level":
        return { min: 3000000, max: 5000000 };
      case "Junior":
        return { min: 5000000, max: 8000000 };
      case "Mid Level":
        return { min: 8000000, max: 12000000 };
      case "Senior":
        return { min: 12000000, max: 18000000 };
      case "Manager":
        return { min: 15000000, max: 25000000 };
      default:
        return { min: 4000000, max: 7000000 };
    }
  };

  const getIndustry = (companyId: string): string => {
    const company = allCompanies.find(c => c.id === companyId);
    return company?.industry || "Technology";
  };

  // Generate 90 jobs
  const jobsData: any[] = [];
  let jobTypeIndex = 0;
  let currentJobType = jobTypes[0];
  let jobTypeCounter = 0;

  for (let i = 0; i < 90; i++) {
    // Distribute job types according to count
    if (jobTypeCounter >= currentJobType.count) {
      jobTypeIndex++;
      currentJobType = jobTypes[jobTypeIndex] || jobTypes[jobTypes.length - 1];
      jobTypeCounter = 0;
    }
    jobTypeCounter++;

    const positionIndex = i % positions.length;
    const position = positions[positionIndex];
    const companyIndex = i % allCompanies.length;
    const company = allCompanies[companyIndex];
    const location = locations[i % locations.length];
    const level = levels[i % levels.length];
    const education = educationLevels[i % educationLevels.length];
    const salary = getSalaryRange(level);
    
    // Determine if active (70 active, 15 inactive, 5 pending)
    let isActive = true;
    if (i >= 70 && i < 85) {
      isActive = false; // 15 closed jobs
    }

    // Determine source (60 direct, 30 AI scraping)
    const source = i < 60 ? "direct" : "aggregated";
    const sourceUrl = source === "aggregated" 
      ? `https://instagram.com/p/job_${i}/`
      : null;

    // Calculate posting date (distributed from 60 days ago to now)
    const daysAgo = Math.floor((i / 90) * 60);
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - daysAgo);

    const viewCount = Math.floor(Math.random() * 500) + 50;

    jobsData.push({
      companyId: company.id,
      title: `${position} - ${level}`,
      description: getJobDescription(position, level),
      requirements: getRequirements(position, level, education),
      location,
      jobType: currentJobType.type,
      industry: getIndustry(company.id),
      salaryMin: salary.min,
      salaryMax: salary.max,
      education,
      experience: level === "Entry Level" ? "0-1 tahun" : 
                  level === "Junior" ? "1-3 tahun" :
                  level === "Mid Level" ? "3-5 tahun" :
                  level === "Senior" ? "5-8 tahun" : "8+ tahun",
      isFeatured: i % 10 === 0, // Every 10th job is featured
      isActive,
      source,
      sourceUrl,
      postedBy,
      viewCount,
      createdAt: postedDate,
      updatedAt: postedDate,
    });
  }

  // Insert jobs in batches
  // Note: We allow duplicate titles from different companies (realistic scenario)
  let createdCount = 0;
  for (const job of jobsData) {
    await db.insert(jobs).values(job);
    createdCount++;
    if (createdCount % 10 === 0) {
      console.log(`  ✓ Created ${createdCount} jobs...`);
    }
  }

  console.log(`✅ Jobs seeding completed: ${createdCount} jobs created\n`);
}
