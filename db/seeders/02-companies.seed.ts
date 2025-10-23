import { db } from "../../server/db";
import { companies, users } from "../../shared/schema";
import { eq, inArray } from "drizzle-orm";

export async function seedCompanies() {
  console.log("🌱 Seeding companies...");

  // Get all employer users
  const employers = await db
    .select()
    .from(users)
    .where(inArray(users.email, [
      "employer@company.com",
      "free@company.com", 
      "starter.monthly@company.com",
      "starter.yearly@company.com",
      "professional@company.com"
    ]));

  if (employers.length === 0) {
    console.log("  ⚠️  Employer users not found. Skipping company seeding.");
    return;
  }

  // Map employers by email for easy lookup
  const employerMap = new Map(employers.map(e => [e.email, e.id]));

  const companyData = [
    // =============================================
    // COMPANIES FOR EMPLOYER FREE PLAN (free@company.com)
    // =============================================
    {
      name: "CV Maju Sejahtera",
      description: "UMKM yang bergerak di bidang perdagangan umum dan jasa",
      industry: "Retail",
      location: "Bandung, Jawa Barat",
      contactEmail: "hr@majusejahtera.com",
      contactPhone: "022-12345678",
      employeeCount: "11-50",
      isVerified: false,
      createdBy: employerMap.get("free@company.com"),
    },
    
    // =============================================
    // COMPANIES FOR EMPLOYER STARTER MONTHLY (starter.monthly@company.com)
    // =============================================
    {
      name: "PT Digital Sukses",
      description: "Perusahaan teknologi yang fokus pada pengembangan aplikasi mobile dan web",
      industry: "Technology",
      location: "Surabaya, Jawa Timur",
      website: "https://digitalsukses.com",
      contactEmail: "careers@digitalsukses.com",
      contactPhone: "031-12345678",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("starter.monthly@company.com"),
    },
    
    // =============================================
    // COMPANIES FOR EMPLOYER STARTER YEARLY (starter.yearly@company.com)
    // =============================================
    {
      name: "Startup Inovasi Indonesia",
      description: "Startup teknologi yang mengembangkan solusi AI untuk industri ritel",
      industry: "Artificial Intelligence",
      location: "Yogyakarta, DI Yogyakarta",
      website: "https://inovasiindonesia.id",
      contactEmail: "jobs@inovasiindonesia.id",
      contactPhone: "0274-987654",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("starter.yearly@company.com"),
    },
    {
      name: "CV Kreatif Digital Yogya",
      description: "Agensi kreatif yang melayani brand lokal dan nasional",
      industry: "Creative & Design",
      location: "Yogyakarta, DI Yogyakarta",
      website: "https://kreatifdigital.id",
      contactEmail: "hello@kreatifdigital.id",
      contactPhone: "0274-123456",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("starter.yearly@company.com"),
    },
    
    // =============================================
    // COMPANIES FOR EMPLOYER PROFESSIONAL (professional@company.com)
    // =============================================
    {
      name: "PT Perusahaan Besar Indonesia",
      description: "Perusahaan manufaktur dan distribusi terkemuka di Indonesia dengan 20+ cabang",
      industry: "Manufacturing",
      location: "Jakarta Pusat, DKI Jakarta",
      website: "https://perusahaanbesar.co.id",
      contactEmail: "recruitment@perusahaanbesar.co.id",
      contactPhone: "021-12345678",
      employeeCount: "500+",
      isVerified: true,
      createdBy: employerMap.get("professional@company.com"),
    },
    {
      name: "PT Teknologi Masa Depan",
      description: "Perusahaan teknologi enterprise dengan klien Fortune 500",
      industry: "Technology",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://teknologimasadepan.com",
      contactEmail: "hr@teknologimasadepan.com",
      contactPhone: "021-87654321",
      employeeCount: "201-500",
      isVerified: true,
      createdBy: employerMap.get("professional@company.com"),
    },
    {
      name: "PT Bank Digital Indonesia",
      description: "Bank digital terkemuka dengan 5 juta+ pengguna aktif",
      industry: "Banking",
      location: "Jakarta Pusat, DKI Jakarta",
      website: "https://bankdigital.id",
      contactEmail: "career@bankdigital.id",
      contactPhone: "021-99998888",
      employeeCount: "500+",
      isVerified: true,
      createdBy: employerMap.get("professional@company.com"),
    },

    // =============================================
    // COMPANIES FOR ORIGINAL EMPLOYER (employer@company.com) 
    // Keeping existing companies for backward compatibility
    // =============================================
    {
      name: "PT Teknologi Maju",
      description: "Perusahaan teknologi terkemuka yang fokus pada pengembangan solusi digital untuk UMKM",
      industry: "Technology",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://teknologimaju.com",
      contactEmail: "hr@teknologimaju.com",
      contactPhone: "021-12345678",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Berkah Digital",
      description: "Agensi digital marketing yang melayani UMKM di seluruh Indonesia",
      industry: "Marketing & Advertising",
      location: "Bandung, Jawa Barat",
      website: "https://berkahdigital.id",
      contactEmail: "info@berkahdigital.id",
      contactPhone: "022-87654321",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Maju Bersama Indonesia",
      description: "Perusahaan retail dengan puluhan cabang di seluruh Indonesia",
      industry: "Retail",
      location: "Surabaya, Jawa Timur",
      contactEmail: "recruitment@majubersama.co.id",
      contactPhone: "031-23456789",
      employeeCount: "201-500",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup Inovasi Tech",
      description: "Startup fintech yang sedang berkembang pesat di Indonesia",
      industry: "Fintech",
      location: "Jakarta Pusat, DKI Jakarta",
      website: "https://inovasitech.id",
      contactEmail: "careers@inovasitech.id",
      contactPhone: "021-98765432",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Kreatif Nusantara",
      description: "Perusahaan creative agency yang melayani brand-brand besar",
      industry: "Creative & Design",
      location: "Yogyakarta, DI Yogyakarta",
      website: "https://kreatifnusantara.com",
      contactEmail: "hr@kreatifnusantara.com",
      contactPhone: "0274-123456",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Media Sosial Pro",
      description: "Agensi social media management untuk berbagai industri",
      industry: "Marketing & Advertising",
      location: "Semarang, Jawa Tengah",
      contactEmail: "contact@mediasospro.id",
      contactPhone: "024-87654321",
      employeeCount: "1-10",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Solusi Data Analytics",
      description: "Konsultan data analytics untuk perusahaan enterprise",
      industry: "Technology",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://solusidataanalytics.com",
      contactEmail: "jobs@solusidataanalytics.com",
      contactPhone: "021-55556666",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Warung Kopi Digital",
      description: "Café chain yang mengintegrasikan teknologi dalam operasionalnya",
      industry: "F&B",
      location: "Bali",
      website: "https://warungkopidigital.com",
      contactEmail: "hr@warungkopidigital.com",
      contactPhone: "0361-123456",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Edukasi Online Indonesia",
      description: "Platform edukasi online terbesar di Indonesia",
      industry: "Education",
      location: "Tangerang, Banten",
      website: "https://edukasionline.id",
      contactEmail: "recruitment@edukasionline.id",
      contactPhone: "021-77778888",
      employeeCount: "201-500",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Konten Kreator Agency",
      description: "Agensi yang menghubungkan brand dengan content creators",
      industry: "Creative & Design",
      location: "Jakarta Barat, DKI Jakarta",
      contactEmail: "info@kontenkreator.id",
      contactPhone: "021-11112222",
      employeeCount: "11-50",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Logistik Express",
      description: "Perusahaan logistik dengan jangkauan seluruh Indonesia",
      industry: "Logistics",
      location: "Bekasi, Jawa Barat",
      website: "https://logistikexpress.co.id",
      contactEmail: "hrd@logistikexpress.co.id",
      contactPhone: "021-33334444",
      employeeCount: "500+",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup Healthtech Care",
      description: "Platform kesehatan digital yang menghubungkan pasien dengan dokter",
      industry: "Healthcare",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://healthtechcare.id",
      contactEmail: "careers@healthtechcare.id",
      contactPhone: "021-99990000",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Desain Interior Modern",
      description: "Jasa desain interior untuk rumah dan kantor",
      industry: "Architecture & Design",
      location: "Medan, Sumatera Utara",
      contactEmail: "info@desaininterior.id",
      contactPhone: "061-123456",
      employeeCount: "1-10",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Asuransi Keluarga",
      description: "Perusahaan asuransi dengan fokus pada proteksi keluarga Indonesia",
      industry: "Insurance",
      location: "Jakarta Pusat, DKI Jakarta",
      website: "https://asuransikeluarga.com",
      contactEmail: "recruitment@asuransikeluarga.com",
      contactPhone: "021-55554444",
      employeeCount: "500+",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup Agritech Farmers",
      description: "Platform teknologi untuk membantu petani meningkatkan produktivitas",
      industry: "Agriculture",
      location: "Malang, Jawa Timur",
      website: "https://agritechfarmers.id",
      contactEmail: "jobs@agritechfarmers.id",
      contactPhone: "0341-123456",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Bank Digital Nusantara",
      description: "Bank digital yang memberikan layanan perbankan modern",
      industry: "Banking",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://bankdigitalnusantara.com",
      contactEmail: "career@bankdigitalnusantara.com",
      contactPhone: "021-12341234",
      employeeCount: "201-500",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Fashion Online Store",
      description: "Toko fashion online dengan brand lokal berkualitas",
      industry: "E-commerce",
      location: "Depok, Jawa Barat",
      website: "https://fashiononline.id",
      contactEmail: "hr@fashiononline.id",
      contactPhone: "021-87658765",
      employeeCount: "11-50",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Properti Investasi",
      description: "Perusahaan properti dengan fokus pada investasi dan pengembangan",
      industry: "Real Estate",
      location: "Bogor, Jawa Barat",
      website: "https://propertiinvestasi.com",
      contactEmail: "hrd@propertiinvestasi.com",
      contactPhone: "0251-123456",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup Gaming Indonesia",
      description: "Studio game development yang membuat game lokal berkualitas",
      industry: "Gaming",
      location: "Jakarta Barat, DKI Jakarta",
      website: "https://gamingindonesia.id",
      contactEmail: "careers@gamingindonesia.id",
      contactPhone: "021-44445555",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Konsultan Bisnis Pro",
      description: "Konsultan bisnis untuk UMKM dan startup",
      industry: "Consulting",
      location: "Solo, Jawa Tengah",
      contactEmail: "info@konsultanbisnispro.id",
      contactPhone: "0271-123456",
      employeeCount: "1-10",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Travel Online Indonesia",
      description: "Platform booking travel dan hotel online",
      industry: "Travel & Tourism",
      location: "Bali",
      website: "https://travelonline.id",
      contactEmail: "recruitment@travelonline.id",
      contactPhone: "0361-987654",
      employeeCount: "201-500",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup AI Solutions",
      description: "Perusahaan yang mengembangkan solusi AI untuk berbagai industri",
      industry: "Artificial Intelligence",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://aisolutions.id",
      contactEmail: "jobs@aisolutions.id",
      contactPhone: "021-66667777",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Catering Sehat",
      description: "Layanan catering makanan sehat untuk perusahaan dan event",
      industry: "F&B",
      location: "Tangerang, Banten",
      contactEmail: "hr@cateringsehat.id",
      contactPhone: "021-22223333",
      employeeCount: "11-50",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Telekomunikasi Modern",
      description: "Provider telekomunikasi dengan jaringan luas",
      industry: "Telecommunications",
      location: "Jakarta Pusat, DKI Jakarta",
      website: "https://telkomodern.com",
      contactEmail: "career@telkomodern.com",
      contactPhone: "021-88889999",
      employeeCount: "500+",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup Blockchain Tech",
      description: "Perusahaan yang fokus pada teknologi blockchain dan cryptocurrency",
      industry: "Blockchain",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://blockchaintech.id",
      contactEmail: "jobs@blockchaintech.id",
      contactPhone: "021-33332222",
      employeeCount: "11-50",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Event Organizer Pro",
      description: "Event organizer untuk berbagai acara corporate dan personal",
      industry: "Event Management",
      location: "Makassar, Sulawesi Selatan",
      contactEmail: "info@eventorganizerpro.id",
      contactPhone: "0411-123456",
      employeeCount: "11-50",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Manufaktur Elektronik",
      description: "Pabrik elektronik dengan standar internasional",
      industry: "Manufacturing",
      location: "Bekasi, Jawa Barat",
      website: "https://manufakturelektronik.com",
      contactEmail: "hrd@manufakturelektronik.com",
      contactPhone: "021-77776666",
      employeeCount: "500+",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "Startup IoT Indonesia",
      description: "Perusahaan IoT yang mengembangkan smart home dan smart city solutions",
      industry: "IoT",
      location: "Jakarta Selatan, DKI Jakarta",
      website: "https://iotindonesia.id",
      contactEmail: "careers@iotindonesia.id",
      contactPhone: "021-11119999",
      employeeCount: "51-200",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "CV Fotografi Profesional",
      description: "Jasa fotografi untuk berbagai kebutuhan komersial dan personal",
      industry: "Photography",
      location: "Yogyakarta, DI Yogyakarta",
      contactEmail: "info@fotografipro.id",
      contactPhone: "0274-987654",
      employeeCount: "1-10",
      isVerified: false,
      createdBy: employerMap.get("employer@company.com"),
    },
    {
      name: "PT Energi Terbarukan",
      description: "Perusahaan yang fokus pada pengembangan energi terbarukan",
      industry: "Energy",
      location: "Jakarta Pusat, DKI Jakarta",
      website: "https://energiterbarukan.com",
      contactEmail: "recruitment@energiterbarukan.com",
      contactPhone: "021-55558888",
      employeeCount: "201-500",
      isVerified: true,
      createdBy: employerMap.get("employer@company.com"),
    },
  ];

  for (const company of companyData) {
    // Check if company already exists
    const existing = await db
      .select()
      .from(companies)
      .where(eq(companies.name, company.name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(companies).values(company);
      console.log(`  ✓ Created company: ${company.name}`);
    } else {
      console.log(`  ⊘ Company already exists: ${company.name}`);
    }
  }

  console.log("✅ Companies seeding completed\n");
}
