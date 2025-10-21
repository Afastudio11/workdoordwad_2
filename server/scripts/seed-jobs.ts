import { faker } from "@faker-js/faker";
import { db } from "../db.js";
import { jobs, companies, users } from "../../shared/schema.js";
import { eq } from "drizzle-orm";

const jobTitles = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer",
  "UI/UX Designer", "Graphic Designer", "Content Writer", "Social Media Specialist",
  "Digital Marketing Specialist", "SEO Specialist", "Data Analyst", "Business Analyst",
  "Product Manager", "Project Manager", "Sales Executive", "Customer Service",
  "HR Manager", "Recruiter", "Accountant", "Finance Manager",
  "Admin Staff", "Warehouse Staff", "Delivery Driver", "Cook",
  "Waiter/Waitress", "Barista", "Cashier", "Security Guard",
  "Cleaning Service", "Receptionist", "Secretary", "IT Support",
  "Network Engineer", "DevOps Engineer", "QA Engineer", "Database Administrator",
  "Marketing Manager", "Brand Manager", "Event Organizer", "Photographer",
  "Video Editor", "Content Creator", "Copywriter", "Translator",
  "Teacher", "Tutor", "Customer Success", "Account Manager"
];

const industries = ["Teknologi", "Retail", "F&B", "Kesehatan", "Pendidikan", "Keuangan", "Media", "Konstruksi", "Manufaktur", "Logistik"];
const locations = ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Utara", "Jakarta Barat", "Jakarta Timur", "Tangerang", "Bekasi", "Depok", "Bogor", "Bandung", "Surabaya", "Semarang", "Yogyakarta", "Bali"];
const jobTypes = ["full-time", "part-time", "contract", "freelance"];
const educations = ["SMA", "D3", "S1", "S2"];
const experiences = ["0-1 tahun", "1-3 tahun", "3-5 tahun", "5+ tahun"];

async function seedJobs() {
  try {
    console.log("Starting job seeding...");

    // Get existing companies
    const existingCompanies = await db.select().from(companies).limit(10);
    
    if (existingCompanies.length === 0) {
      console.log("No companies found. Please run seed-test-data.ts first.");
      process.exit(1);
    }

    // Get admin user
    const adminUsers = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    const adminId = adminUsers[0]?.id;

    if (!adminId) {
      console.log("No admin user found. Please run seed-test-data.ts first.");
      process.exit(1);
    }

    const jobsToInsert = [];

    // Generate 200 jobs from AI (source: "ai")
    console.log("Generating 200 AI-sourced jobs...");
    for (let i = 0; i < 200; i++) {
      const company = faker.helpers.arrayElement(existingCompanies);
      const title = faker.helpers.arrayElement(jobTitles);
      const industry = faker.helpers.arrayElement(industries);
      const location = faker.helpers.arrayElement(locations);
      const jobType = faker.helpers.arrayElement(jobTypes);
      const education = faker.helpers.arrayElement(educations);
      const experience = faker.helpers.arrayElement(experiences);
      
      const salaryMin = faker.number.int({ min: 3, max: 15 }) * 1000000;
      const salaryMax = salaryMin + faker.number.int({ min: 2, max: 10 }) * 1000000;

      jobsToInsert.push({
        companyId: company.id,
        title: title,
        description: `${title} dibutuhkan untuk bergabung dengan tim ${company.name}. ${faker.lorem.paragraph()}`,
        requirements: `Pendidikan minimal ${education}; Pengalaman ${experience}; ${faker.lorem.sentence()}; ${faker.lorem.sentence()}`,
        location: location,
        jobType: jobType,
        industry: industry,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        education: education,
        experience: experience,
        isFeatured: faker.datatype.boolean({ probability: 0.1 }),
        isActive: faker.datatype.boolean({ probability: 0.9 }),
        source: "ai",
        sourceUrl: `https://instagram.com/p/${faker.string.alphanumeric(11)}`,
        postedBy: adminId,
        viewCount: faker.number.int({ min: 0, max: 1000 }),
      });
    }

    // Generate 200 jobs from companies (source: "direct")
    console.log("Generating 200 company-posted jobs...");
    for (let i = 0; i < 200; i++) {
      const company = faker.helpers.arrayElement(existingCompanies);
      const title = faker.helpers.arrayElement(jobTitles);
      const industry = faker.helpers.arrayElement(industries);
      const location = faker.helpers.arrayElement(locations);
      const jobType = faker.helpers.arrayElement(jobTypes);
      const education = faker.helpers.arrayElement(educations);
      const experience = faker.helpers.arrayElement(experiences);
      
      const salaryMin = faker.number.int({ min: 3, max: 15 }) * 1000000;
      const salaryMax = salaryMin + faker.number.int({ min: 2, max: 10 }) * 1000000;

      jobsToInsert.push({
        companyId: company.id,
        title: title,
        description: `Bergabunglah dengan ${company.name} sebagai ${title}. ${faker.lorem.paragraph(2)}`,
        requirements: `Minimal ${education}; ${experience} pengalaman; ${faker.lorem.sentence()}; ${faker.lorem.sentence()}; ${faker.lorem.sentence()}`,
        location: location,
        jobType: jobType,
        industry: industry,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        education: education,
        experience: experience,
        isFeatured: faker.datatype.boolean({ probability: 0.2 }),
        isActive: faker.datatype.boolean({ probability: 0.95 }),
        source: "direct",
        sourceUrl: null,
        postedBy: company.createdBy || adminId,
        viewCount: faker.number.int({ min: 0, max: 500 }),
      });
    }

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < jobsToInsert.length; i += batchSize) {
      const batch = jobsToInsert.slice(i, i + batchSize);
      await db.insert(jobs).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(jobsToInsert.length / batchSize)}`);
    }

    console.log("✅ Successfully seeded 400 jobs!");
    console.log("  - 200 AI-sourced jobs (source: 'ai')");
    console.log("  - 200 Company-posted jobs (source: 'direct')");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
}

seedJobs();
