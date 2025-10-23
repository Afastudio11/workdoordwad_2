import { db } from "./db";
import { users, companies, jobs, applications } from "@shared/schema";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";

async function generateDummyData() {
  console.log("🚀 Starting dummy data generation...");

  // Generate password once for all test accounts
  const password = await bcrypt.hash("Test123!@#", 10);

  // Helper to create dates
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  const daysFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  try {
    // ==========================================
    // 1. FREE ACCOUNT (free@testcompany.com)
    // ==========================================
    console.log("\n📦 Creating FREE account...");
    
    const [freeUser] = await db.insert(users).values({
      username: "free_test",
      password,
      email: "free@testcompany.com",
      fullName: "Free Company Admin",
      phone: "+6281234567890",
      role: "pemberi_kerja",
      verificationStatus: "verified",
      verifiedAt: new Date(),
    }).returning().onConflictDoNothing();

    if (freeUser) {
      const [freeCompany] = await db.insert(companies).values({
        name: "Free Test Company",
        description: "A free tier company for testing",
        industry: "Technology",
        location: "Jakarta Selatan",
        contactEmail: "free@testcompany.com",
        contactPhone: "+6281234567890",
        employeeCount: "10-50",
        createdBy: freeUser.id,
        subscriptionPlan: "free",
        jobPostingCount: 3, // FULL quota
        featuredJobCount: 0,
        urgentJobCount: 0,
        cvDownloadCount: 0,
        quotaResetDate: daysFromNow(30),
        verificationStatus: "verified",
        verifiedAt: new Date(),
      }).returning().onConflictDoNothing();

      if (freeCompany) {
        // Create 3 jobs (quota full)
        const freeJobs = [
          {
            title: "Admin Staff",
            description: "Mencari admin staff yang berpengalaman untuk mengelola operasional kantor.",
            requirements: "Minimal pendidikan D3, pengalaman 1-2 tahun",
            location: "Jakarta Selatan",
            jobType: "full-time",
            industry: "Operations",
            salaryMin: 4500000,
            salaryMax: 6000000,
            education: "D3",
            experience: "1-3 tahun",
            companyId: freeCompany.id,
            postedBy: freeUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 45,
            createdAt: daysAgo(5),
            expiresAt: daysFromNow(25),
          },
          {
            title: "Customer Service",
            description: "Dibutuhkan customer service yang ramah dan komunikatif.",
            requirements: "Minimal SMA, memiliki kemampuan komunikasi yang baik",
            location: "Jakarta Pusat",
            jobType: "full-time",
            industry: "Customer Service",
            salaryMin: 4000000,
            salaryMax: 5500000,
            education: "SMA",
            experience: "0-1 tahun",
            companyId: freeCompany.id,
            postedBy: freeUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 32,
            createdAt: daysAgo(3),
            expiresAt: daysFromNow(27),
          },
          {
            title: "Data Entry Operator",
            description: "Mencari data entry operator untuk input data harian.",
            requirements: "Teliti, cepat mengetik, minimal SMA",
            location: "Tangerang",
            jobType: "part-time",
            industry: "Operations",
            salaryMin: 3000000,
            salaryMax: 4000000,
            education: "SMA",
            experience: "0-1 tahun",
            companyId: freeCompany.id,
            postedBy: freeUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 18,
            createdAt: daysAgo(1),
            expiresAt: daysFromNow(29),
          },
        ];

        await db.insert(jobs).values(freeJobs);
        console.log("✅ Free account: 3 jobs created");
      }
    }

    // ==========================================
    // 2. STARTER ACCOUNT (starter@testcompany.com)
    // ==========================================
    console.log("\n🎯 Creating STARTER account...");
    
    const [starterUser] = await db.insert(users).values({
      username: "starter_test",
      password,
      email: "starter@testcompany.com",
      fullName: "Starter Company Admin",
      phone: "+6281234567891",
      role: "pemberi_kerja",
      verificationStatus: "verified",
      verifiedAt: new Date(),
    }).returning().onConflictDoNothing();

    if (starterUser) {
      const [starterCompany] = await db.insert(companies).values({
        name: "Starter Test Company",
        description: "A starter tier company for testing",
        industry: "Marketing",
        location: "Bandung",
        contactEmail: "starter@testcompany.com",
        contactPhone: "+6281234567891",
        employeeCount: "50-200",
        createdBy: starterUser.id,
        subscriptionPlan: "starter",
        jobPostingCount: 7, // 70% of quota
        featuredJobCount: 3, // FULL featured quota
        urgentJobCount: 0,
        cvDownloadCount: 0,
        quotaResetDate: new Date("2025-11-01"),
        verificationStatus: "verified",
        verifiedAt: new Date(),
      }).returning().onConflictDoNothing();

      if (starterCompany) {
        // Create 7 jobs (3 featured)
        const starterJobs = [
          {
            title: "Marketing Manager",
            description: "Memimpin tim marketing untuk strategi digital dan konvensional.",
            requirements: "S1 Marketing, pengalaman 3-5 tahun sebagai marketing manager",
            location: "Bandung",
            jobType: "full-time",
            industry: "Marketing",
            salaryMin: 8000000,
            salaryMax: 12000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 234,
            createdAt: daysAgo(7),
            expiresAt: daysFromNow(23),
          },
          {
            title: "Graphic Designer",
            description: "Membuat desain visual untuk kampanye marketing dan branding.",
            requirements: "Portfolio yang menarik, mahir Adobe Creative Suite",
            location: "Bandung",
            jobType: "full-time",
            industry: "Design",
            salaryMin: 6000000,
            salaryMax: 9000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 189,
            createdAt: daysAgo(5),
            expiresAt: daysFromNow(25),
          },
          {
            title: "Social Media Specialist",
            description: "Mengelola dan mengembangkan strategi media sosial perusahaan.",
            requirements: "Paham trend social media, kreatif, komunikatif",
            location: "Bandung",
            jobType: "full-time",
            industry: "Marketing",
            salaryMin: 5500000,
            salaryMax: 8000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 156,
            createdAt: daysAgo(4),
            expiresAt: daysFromNow(26),
          },
          {
            title: "Sales Executive",
            description: "Mencari sales executive yang target oriented.",
            requirements: "Pengalaman sales, berorientasi target",
            location: "Bandung",
            jobType: "full-time",
            industry: "Sales",
            salaryMin: 5000000,
            salaryMax: 8000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 120,
            createdAt: daysAgo(6),
            expiresAt: daysFromNow(24),
          },
          {
            title: "Content Writer",
            description: "Menulis konten untuk website, blog, dan media sosial.",
            requirements: "Kemampuan menulis excellent, SEO-friendly",
            location: "Bandung",
            jobType: "full-time",
            industry: "Marketing",
            salaryMin: 4500000,
            salaryMax: 7000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 98,
            createdAt: daysAgo(5),
            expiresAt: daysFromNow(25),
          },
          {
            title: "HR Staff",
            description: "Mengelola administrasi HR dan rekrutmen.",
            requirements: "Minimal S1 Psikologi/Manajemen, paham regulasi ketenagakerjaan",
            location: "Bandung",
            jobType: "full-time",
            industry: "Human Resources",
            salaryMin: 5000000,
            salaryMax: 7500000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 76,
            createdAt: daysAgo(4),
            expiresAt: daysFromNow(26),
          },
          {
            title: "Accountant",
            description: "Mengelola pembukuan dan laporan keuangan perusahaan.",
            requirements: "S1 Akuntansi, paham perpajakan, teliti",
            location: "Bandung",
            jobType: "full-time",
            industry: "Finance",
            salaryMin: 6000000,
            salaryMax: 9000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: starterCompany.id,
            postedBy: starterUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 145,
            createdAt: daysAgo(3),
            expiresAt: daysFromNow(27),
          },
        ];

        await db.insert(jobs).values(starterJobs);
        console.log("✅ Starter account: 7 jobs created (3 featured)");
      }
    }

    // ==========================================
    // 3. PROFESSIONAL ACCOUNT (professional@testcompany.com)
    // ==========================================
    console.log("\n💎 Creating PROFESSIONAL account...");
    
    const [professionalUser] = await db.insert(users).values({
      username: "professional_test",
      password,
      email: "professional@testcompany.com",
      fullName: "Professional Company Admin",
      phone: "+6281234567892",
      role: "pemberi_kerja",
      verificationStatus: "verified",
      verifiedAt: new Date(),
    }).returning().onConflictDoNothing();

    if (professionalUser) {
      const [professionalCompany] = await db.insert(companies).values({
        name: "Professional Test Company",
        description: "A professional tier tech company for testing",
        industry: "Information Technology",
        location: "Jakarta",
        contactEmail: "professional@testcompany.com",
        contactPhone: "+6281234567892",
        employeeCount: "200-500",
        createdBy: professionalUser.id,
        subscriptionPlan: "professional",
        jobPostingCount: 18, // 60% of quota
        featuredJobCount: 13,
        urgentJobCount: 5,
        cvDownloadCount: 35,
        quotaResetDate: daysFromNow(30),
        verificationStatus: "verified",
        verifiedAt: new Date(),
      }).returning().onConflictDoNothing();

      if (professionalCompany) {
        // Create 18 jobs (5 featured+urgent, 8 featured only, 5 regular)
        const professionalJobs = [
          // 5 Featured + Urgent
          {
            title: "Senior Frontend Developer",
            description: "Lead frontend development dengan React dan TypeScript.",
            requirements: "5+ tahun pengalaman React, TypeScript, modern web development",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 15000000,
            salaryMax: 25000000,
            education: "S1",
            experience: "5+ tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 456,
            createdAt: daysAgo(10),
            expiresAt: daysFromNow(20),
          },
          {
            title: "Backend Developer",
            description: "Develop dan maintain backend systems menggunakan Node.js.",
            requirements: "Pengalaman Node.js, PostgreSQL, RESTful API",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 12000000,
            salaryMax: 20000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 398,
            createdAt: daysAgo(9),
            expiresAt: daysFromNow(21),
          },
          {
            title: "UI/UX Designer",
            description: "Design user interface yang beautiful dan user-friendly.",
            requirements: "Portfolio strong, Figma expert, user research experience",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 10000000,
            salaryMax: 18000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 367,
            createdAt: daysAgo(8),
            expiresAt: daysFromNow(22),
          },
          {
            title: "Product Manager",
            description: "Lead product development dari ideation hingga launch.",
            requirements: "Pengalaman product management, data-driven decision making",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 18000000,
            salaryMax: 30000000,
            education: "S1",
            experience: "5+ tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 423,
            createdAt: daysAgo(7),
            expiresAt: daysFromNow(23),
          },
          {
            title: "DevOps Engineer",
            description: "Manage infrastructure, CI/CD, dan monitoring systems.",
            requirements: "Experience dengan AWS/GCP, Docker, Kubernetes, CI/CD tools",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 14000000,
            salaryMax: 22000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 334,
            createdAt: daysAgo(6),
            expiresAt: daysFromNow(24),
          },
          // 8 Featured only
          {
            title: "Junior Developer",
            description: "Fresh graduate atau junior developer untuk join tim development.",
            requirements: "Basic programming, eager to learn, team player",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 6000000,
            salaryMax: 9000000,
            education: "S1",
            experience: "0-1 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 289,
            createdAt: daysAgo(5),
            expiresAt: daysFromNow(25),
          },
          {
            title: "QA Engineer",
            description: "Ensure software quality melalui testing dan automation.",
            requirements: "Manual testing, automation testing, attention to detail",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 8000000,
            salaryMax: 14000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 234,
            createdAt: daysAgo(5),
            expiresAt: daysFromNow(25),
          },
          {
            title: "Business Analyst",
            description: "Analyze business requirements dan translate ke technical specs.",
            requirements: "Analytical thinking, SQL, documentation skills",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 9000000,
            salaryMax: 15000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 267,
            createdAt: daysAgo(4),
            expiresAt: daysFromNow(26),
          },
          {
            title: "Project Manager",
            description: "Manage multiple tech projects dengan agile methodology.",
            requirements: "PMP/Scrum certified, project management experience",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 12000000,
            salaryMax: 20000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 312,
            createdAt: daysAgo(4),
            expiresAt: daysFromNow(26),
          },
          {
            title: "Data Analyst",
            description: "Analyze data untuk business insights dan recommendations.",
            requirements: "SQL, Python/R, data visualization tools (Tableau/PowerBI)",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 8000000,
            salaryMax: 13000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 256,
            createdAt: daysAgo(3),
            expiresAt: daysFromNow(27),
          },
          {
            title: "Mobile Developer",
            description: "Develop mobile apps untuk iOS dan Android.",
            requirements: "React Native atau Flutter, mobile app development experience",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 10000000,
            salaryMax: 17000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 298,
            createdAt: daysAgo(3),
            expiresAt: daysFromNow(27),
          },
          {
            title: "System Analyst",
            description: "Design dan analyze system architecture untuk scalability.",
            requirements: "System design, architecture patterns, documentation",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 11000000,
            salaryMax: 18000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 223,
            createdAt: daysAgo(2),
            expiresAt: daysFromNow(28),
          },
          {
            title: "Scrum Master",
            description: "Facilitate agile development process dan remove blockers.",
            requirements: "Certified Scrum Master, agile coaching experience",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 10000000,
            salaryMax: 16000000,
            education: "S1",
            experience: "3-5 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: true,
            isUrgent: false,
            isActive: true,
            viewCount: 201,
            createdAt: daysAgo(2),
            expiresAt: daysFromNow(28),
          },
          // 5 Regular
          {
            title: "IT Support",
            description: "Provide technical support untuk internal team.",
            requirements: "Basic troubleshooting, customer service, patient",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 5000000,
            salaryMax: 8000000,
            education: "D3",
            experience: "0-1 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 145,
            createdAt: daysAgo(2),
            expiresAt: daysFromNow(28),
          },
          {
            title: "Network Admin",
            description: "Manage dan maintain network infrastructure.",
            requirements: "CCNA certified, network security knowledge",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 7000000,
            salaryMax: 12000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 123,
            createdAt: daysAgo(1),
            expiresAt: daysFromNow(29),
          },
          {
            title: "Database Admin",
            description: "Maintain database performance, backup, dan security.",
            requirements: "PostgreSQL/MySQL expert, database optimization",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 9000000,
            salaryMax: 15000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 167,
            createdAt: daysAgo(1),
            expiresAt: daysFromNow(29),
          },
          {
            title: "Security Analyst",
            description: "Monitor dan analyze security threats.",
            requirements: "Security tools, penetration testing, threat analysis",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 10000000,
            salaryMax: 16000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 134,
            createdAt: daysAgo(1),
            expiresAt: daysFromNow(29),
          },
          {
            title: "Technical Writer",
            description: "Create technical documentation dan user guides.",
            requirements: "Excellent writing, technical understanding, detail oriented",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Information Technology",
            salaryMin: 7000000,
            salaryMax: 11000000,
            education: "S1",
            experience: "1-3 tahun",
            companyId: professionalCompany.id,
            postedBy: professionalUser.id,
            isFeatured: false,
            isUrgent: false,
            isActive: true,
            viewCount: 112,
            createdAt: daysAgo(1),
            expiresAt: daysFromNow(29),
          },
        ];

        await db.insert(jobs).values(professionalJobs);
        console.log("✅ Professional account: 18 jobs created (5 featured+urgent, 8 featured, 5 regular)");
      }
    }

    // ==========================================
    // 4. ENTERPRISE ACCOUNT (enterprise@testcompany.com)
    // ==========================================
    console.log("\n🏢 Creating ENTERPRISE account...");
    
    const [enterpriseUser] = await db.insert(users).values({
      username: "enterprise_test",
      password,
      email: "enterprise@testcompany.com",
      fullName: "Enterprise Company Admin",
      phone: "+6281234567893",
      role: "pemberi_kerja",
      verificationStatus: "verified",
      verifiedAt: new Date(),
    }).returning().onConflictDoNothing();

    if (enterpriseUser) {
      const [enterpriseCompany] = await db.insert(companies).values({
        name: "Enterprise Test Company",
        description: "An enterprise tier company with unlimited resources",
        industry: "Technology & Consulting",
        location: "Jakarta",
        contactEmail: "enterprise@testcompany.com",
        contactPhone: "+6281234567893",
        employeeCount: "500+",
        createdBy: enterpriseUser.id,
        subscriptionPlan: "enterprise",
        jobPostingCount: 35, // Show unlimited usage
        featuredJobCount: 20,
        urgentJobCount: 15,
        cvDownloadCount: 234, // Unlimited - no restrictions
        quotaResetDate: daysFromNow(30),
        verificationStatus: "verified",
        verifiedAt: new Date(),
      }).returning().onConflictDoNothing();

      if (enterpriseCompany) {
        // Create 35 jobs to showcase enterprise scale
        const enterpriseJobs = [
          // 15 Featured + Urgent (high priority positions)
          {
            title: "Chief Technology Officer (CTO)",
            description: "Lead overall technology strategy dan team development.",
            requirements: "10+ years tech leadership, strategic planning, team management",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Technology & Consulting",
            salaryMin: 50000000,
            salaryMax: 100000000,
            education: "S2",
            experience: "5+ tahun",
            companyId: enterpriseCompany.id,
            postedBy: enterpriseUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 789,
            createdAt: daysAgo(15),
            expiresAt: daysFromNow(15),
          },
          {
            title: "Engineering Manager",
            description: "Manage engineering team dan product delivery.",
            requirements: "5+ years engineering, 3+ years management",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Technology & Consulting",
            salaryMin: 30000000,
            salaryMax: 50000000,
            education: "S1",
            experience: "5+ tahun",
            companyId: enterpriseCompany.id,
            postedBy: enterpriseUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 654,
            createdAt: daysAgo(14),
            expiresAt: daysFromNow(16),
          },
          {
            title: "Senior Solutions Architect",
            description: "Design scalable solutions untuk enterprise clients.",
            requirements: "Cloud architecture, microservices, system design",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Technology & Consulting",
            salaryMin: 25000000,
            salaryMax: 40000000,
            education: "S1",
            experience: "5+ tahun",
            companyId: enterpriseCompany.id,
            postedBy: enterpriseUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 598,
            createdAt: daysAgo(13),
            expiresAt: daysFromNow(17),
          },
          {
            title: "Lead Data Scientist",
            description: "Lead data science initiatives dan ML model development.",
            requirements: "Advanced ML, Python, big data technologies",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Technology & Consulting",
            salaryMin: 28000000,
            salaryMax: 45000000,
            education: "S2",
            experience: "5+ tahun",
            companyId: enterpriseCompany.id,
            postedBy: enterpriseUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 712,
            createdAt: daysAgo(12),
            expiresAt: daysFromNow(18),
          },
          {
            title: "Security Architect",
            description: "Design dan implement enterprise security infrastructure.",
            requirements: "Security certifications, penetration testing, compliance",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Technology & Consulting",
            salaryMin: 22000000,
            salaryMax: 38000000,
            education: "S1",
            experience: "5+ tahun",
            companyId: enterpriseCompany.id,
            postedBy: enterpriseUser.id,
            isFeatured: true,
            isUrgent: true,
            isActive: true,
            viewCount: 543,
            createdAt: daysAgo(11),
            expiresAt: daysFromNow(19),
          },
        ];

        // Add more jobs to reach 35 total (abbreviated for space)
        for (let i = 0; i < 30; i++) {
          const isFeatured = i < 25; // First 25 are featured
          const isUrgent = i < 10; // First 10 are also urgent
          
          enterpriseJobs.push({
            title: `Senior Developer ${i + 1}`,
            description: `Senior developer position for various tech stacks - Position ${i + 1}`,
            requirements: "5+ years experience, strong technical background",
            location: "Jakarta",
            jobType: "full-time",
            industry: "Technology & Consulting",
            salaryMin: 15000000 + (i * 100000),
            salaryMax: 25000000 + (i * 200000),
            education: "S1",
            experience: i < 10 ? "5+ tahun" : "3-5 tahun",
            companyId: enterpriseCompany.id,
            postedBy: enterpriseUser.id,
            isFeatured,
            isUrgent,
            isActive: true,
            viewCount: 200 + (i * 15),
            createdAt: daysAgo(10 - Math.floor(i / 3)),
            expiresAt: daysFromNow(20 + Math.floor(i / 3)),
          });
        }

        await db.insert(jobs).values(enterpriseJobs);
        console.log("✅ Enterprise account: 35 jobs created (20 featured, 15 urgent)");
      }
    }

    console.log("\n✨ Dummy data generation completed successfully!");
    console.log("\n📊 Summary:");
    console.log("- FREE account: 3 jobs (quota full)");
    console.log("- STARTER account: 7 jobs (3 featured, quota 70%)");
    console.log("- PROFESSIONAL account: 18 jobs (5 featured+urgent, 8 featured, 5 regular)");
    console.log("- ENTERPRISE account: 35 jobs (showing unlimited capabilities)");
    console.log("\n🔐 Test Accounts:");
    console.log("- free@testcompany.com / Test123!@#");
    console.log("- starter@testcompany.com / Test123!@#");
    console.log("- professional@testcompany.com / Test123!@#");
    console.log("- enterprise@testcompany.com / Test123!@#");
    
  } catch (error) {
    console.error("❌ Error generating dummy data:", error);
    throw error;
  }
}

generateDummyData()
  .then(() => {
    console.log("\n✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
