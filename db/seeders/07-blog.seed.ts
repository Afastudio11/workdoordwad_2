import { db } from "../../server/db";
import { blogPosts, users } from "../../shared/schema";
import { eq } from "drizzle-orm";

export async function seedBlogPosts() {
  console.log("🌱 Seeding blog posts...");

  const adminUser = await db
    .select()
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (adminUser.length === 0) {
    console.log("  ⚠ Admin user not found, skipping blog seeding");
    return;
  }

  const adminId = adminUser[0].id;

  const blogPostsData = [
    {
      slug: "tips-wawancara-kerja-sukses",
      title: "10 Tips Wawancara Kerja yang Harus Kamu Ketahui",
      excerpt: "Panduan lengkap untuk menghadapi wawancara kerja dengan percaya diri dan profesional",
      content: `
        <h2>Persiapan Sebelum Wawancara</h2>
        <p>Wawancara kerja adalah momen krusial dalam proses pencarian kerja. Berikut adalah tips yang bisa membantu kamu:</p>
        
        <h3>1. Riset Perusahaan</h3>
        <p>Pelajari visi, misi, dan budaya perusahaan. Pahami produk atau layanan yang mereka tawarkan.</p>
        
        <h3>2. Persiapkan Jawaban</h3>
        <p>Antisipasi pertanyaan umum seperti "Ceritakan tentang diri Anda" dan "Mengapa Anda tertarik bekerja di sini?"</p>
        
        <h3>3. Dress Code</h3>
        <p>Kenakan pakaian yang rapi dan profesional sesuai dengan budaya perusahaan.</p>
        
        <h3>4. Datang Tepat Waktu</h3>
        <p>Usahakan tiba 10-15 menit sebelum jadwal wawancara.</p>
        
        <h3>5. Bahasa Tubuh Positif</h3>
        <p>Jaga kontak mata, tersenyum, dan berjabat tangan dengan tegas.</p>
        
        <h2>Saat Wawancara</h2>
        
        <h3>6. Dengarkan dengan Baik</h3>
        <p>Perhatikan setiap pertanyaan yang diajukan dan jawab dengan jelas.</p>
        
        <h3>7. Tunjukkan Antusiasme</h3>
        <p>Biarkan pewawancara tahu bahwa kamu benar-benar tertarik dengan posisi ini.</p>
        
        <h3>8. Ajukan Pertanyaan</h3>
        <p>Siapkan pertanyaan cerdas tentang peran, tim, atau perusahaan.</p>
        
        <h2>Setelah Wawancara</h2>
        
        <h3>9. Kirim Thank You Email</h3>
        <p>Kirimkan email ucapan terima kasih dalam 24 jam setelah wawancara.</p>
        
        <h3>10. Follow Up</h3>
        <p>Jika belum ada kabar dalam waktu yang dijanjikan, jangan ragu untuk menanyakan status lamaran kamu.</p>
      `,
      heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=600&fit=crop",
      category: "Tips",
      tags: ["wawancara", "karir", "tips", "profesional"],
      readTime: "5 min read",
      authorId: adminId,
      isPublished: true,
      publishedAt: new Date("2024-01-15"),
    },
    {
      slug: "cara-membuat-cv-menarik",
      title: "Cara Membuat CV yang Menarik Perhatian Recruiter",
      excerpt: "Pelajari rahasia membuat CV yang stand out dan meningkatkan peluang dipanggil interview",
      content: `
        <h2>Struktur CV yang Efektif</h2>
        <p>CV yang baik harus mudah dibaca dan menyoroti pencapaian terbaik Anda. Berikut strukturnya:</p>
        
        <h3>1. Informasi Kontak</h3>
        <ul>
          <li>Nama lengkap</li>
          <li>Nomor telepon yang aktif</li>
          <li>Email profesional</li>
          <li>LinkedIn profile (opsional)</li>
        </ul>
        
        <h3>2. Professional Summary</h3>
        <p>Tulis 2-3 kalimat yang merangkum pengalaman dan keahlian terbaik Anda.</p>
        
        <h3>3. Pengalaman Kerja</h3>
        <p>Cantumkan pengalaman dari yang terbaru. Gunakan bullet points untuk menjelaskan pencapaian, bukan hanya tugas.</p>
        
        <h3>4. Pendidikan</h3>
        <p>Tuliskan gelar, institusi, dan tahun kelulusan.</p>
        
        <h3>5. Skills</h3>
        <p>List keahlian teknis dan soft skills yang relevan dengan posisi yang dilamar.</p>
        
        <h2>Tips Penting</h2>
        <ul>
          <li>Maksimal 2 halaman</li>
          <li>Gunakan font yang profesional (Arial, Calibri)</li>
          <li>Hindari typo dan grammatical errors</li>
          <li>Sesuaikan CV untuk setiap posisi</li>
          <li>Gunakan action verbs (achieved, managed, developed)</li>
        </ul>
      `,
      heroImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
      category: "Tips",
      tags: ["cv", "resume", "karir", "tips"],
      readTime: "4 min read",
      authorId: adminId,
      isPublished: true,
      publishedAt: new Date("2024-01-20"),
    },
    {
      slug: "tren-pekerjaan-2024",
      title: "Tren Pekerjaan 2024: Industri yang Sedang Berkembang",
      excerpt: "Analisis mendalam tentang industri dan pekerjaan yang paling dicari di tahun 2024",
      content: `
        <h2>Industri yang Berkembang Pesat</h2>
        
        <h3>1. Teknologi dan AI</h3>
        <p>Artificial Intelligence dan Machine Learning terus berkembang. Pekerjaan seperti AI Engineer, Data Scientist, dan ML Specialist sangat dicari.</p>
        
        <h3>2. Cybersecurity</h3>
        <p>Dengan meningkatnya ancaman digital, perusahaan membutuhkan lebih banyak Security Analyst dan Cybersecurity Engineer.</p>
        
        <h3>3. Healthcare Digital</h3>
        <p>Telemedicine dan healthtech menciptakan permintaan untuk Healthcare IT Specialist.</p>
        
        <h3>4. Sustainability</h3>
        <p>Green jobs seperti Renewable Energy Engineer dan Sustainability Consultant semakin populer.</p>
        
        <h3>5. E-commerce dan Digital Marketing</h3>
        <p>Pertumbuhan e-commerce meningkatkan kebutuhan untuk Digital Marketing Specialist dan E-commerce Manager.</p>
        
        <h2>Skills yang Paling Dicari</h2>
        <ul>
          <li>Programming (Python, JavaScript, Java)</li>
          <li>Data Analysis</li>
          <li>Cloud Computing (AWS, Azure, GCP)</li>
          <li>Digital Marketing</li>
          <li>Project Management</li>
          <li>UI/UX Design</li>
        </ul>
        
        <h2>Kesimpulan</h2>
        <p>Adaptasi dengan tren adalah kunci sukses karir. Terus update skills Anda sesuai kebutuhan pasar.</p>
      `,
      heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      category: "Insight",
      tags: ["tren", "2024", "industri", "karir"],
      readTime: "6 min read",
      authorId: adminId,
      isPublished: true,
      publishedAt: new Date("2024-02-01"),
    },
    {
      slug: "work-life-balance-tips",
      title: "Menjaga Work-Life Balance di Era Remote Working",
      excerpt: "Strategi praktis untuk menyeimbangkan kehidupan kerja dan pribadi saat bekerja dari rumah",
      content: `
        <h2>Tantangan Remote Working</h2>
        <p>Bekerja dari rumah memberikan fleksibilitas, namun juga tantangan dalam memisahkan waktu kerja dan pribadi.</p>
        
        <h3>1. Buat Jadwal yang Jelas</h3>
        <p>Tentukan jam kerja yang tetap dan patuhi jadwal tersebut. Jangan biarkan pekerjaan mengambil alih seluruh hari Anda.</p>
        
        <h3>2. Dedicated Workspace</h3>
        <p>Siapkan ruangan khusus untuk bekerja. Ini membantu otak Anda membedakan waktu kerja dan istirahat.</p>
        
        <h3>3. Take Regular Breaks</h3>
        <p>Gunakan teknik Pomodoro: 25 menit fokus, 5 menit istirahat. Setiap 2 jam, ambil break lebih panjang.</p>
        
        <h3>4. Olahraga Teratur</h3>
        <p>Luangkan waktu minimal 30 menit sehari untuk aktivitas fisik.</p>
        
        <h3>5. Digital Detox</h3>
        <p>Matikan notifikasi pekerjaan di luar jam kerja. Waktu pribadi Anda sama pentingnya.</p>
        
        <h3>6. Komunikasi dengan Keluarga</h3>
        <p>Jelaskan kepada keluarga tentang jam kerja Anda agar mereka bisa respect waktu fokus Anda.</p>
        
        <h2>Benefits of Good Work-Life Balance</h2>
        <ul>
          <li>Produktivitas meningkat</li>
          <li>Kesehatan mental lebih baik</li>
          <li>Hubungan personal lebih berkualitas</li>
          <li>Kreativitas meningkat</li>
          <li>Risiko burnout berkurang</li>
        </ul>
      `,
      heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
      category: "Tips",
      tags: ["work-life-balance", "remote-work", "produktivitas", "kesehatan"],
      readTime: "5 min read",
      authorId: adminId,
      isPublished: true,
      publishedAt: new Date("2024-02-10"),
    },
    {
      slug: "networking-untuk-karir",
      title: "Pentingnya Networking untuk Pengembangan Karir",
      excerpt: "Bagaimana membangun dan memanfaatkan jaringan profesional untuk kemajuan karir Anda",
      content: `
        <h2>Mengapa Networking Penting?</h2>
        <p>80% pekerjaan tidak diiklankan secara publik. Networking membuka akses ke peluang tersembunyi ini.</p>
        
        <h3>1. Mulai dari Lingkaran Terdekat</h3>
        <p>Teman kuliah, mantan kolega, dan kenalan bisa menjadi koneksi berharga.</p>
        
        <h3>2. Manfaatkan LinkedIn</h3>
        <p>Update profil secara berkala, bagikan konten relevan, dan engage dengan postingan orang lain.</p>
        
        <h3>3. Hadiri Event Industri</h3>
        <p>Seminar, workshop, dan conference adalah tempat bertemu profesional satu bidang.</p>
        
        <h3>4. Join Professional Communities</h3>
        <p>Bergabung dengan komunitas atau asosiasi profesional di bidang Anda.</p>
        
        <h3>5. Give Before You Ask</h3>
        <p>Tawarkan bantuan atau value terlebih dahulu sebelum meminta sesuatu.</p>
        
        <h2>Do's and Don'ts</h2>
        
        <h3>DO:</h3>
        <ul>
          <li>Follow up setelah bertemu orang baru</li>
          <li>Jadilah autentik</li>
          <li>Dengarkan lebih banyak daripada bicara</li>
          <li>Berterima kasih atas bantuan yang diberikan</li>
        </ul>
        
        <h3>DON'T:</h3>
        <ul>
          <li>Langsung minta pekerjaan saat pertama bertemu</li>
          <li>Hanya networking saat butuh sesuatu</li>
          <li>Lupa maintain hubungan</li>
          <li>Berpura-pura menjadi orang lain</li>
        </ul>
      `,
      heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop",
      category: "Insight",
      tags: ["networking", "karir", "profesional", "koneksi"],
      readTime: "7 min read",
      authorId: adminId,
      isPublished: true,
      publishedAt: new Date("2024-02-15"),
    },
    {
      slug: "newsletter-februari-2024",
      title: "Newsletter Februari 2024: Update Terbaru Pintu Kerja",
      excerpt: "Fitur baru, statistik platform, dan berita menarik bulan ini",
      content: `
        <h2>Hai Job Seekers & Recruiters!</h2>
        <p>Selamat datang di newsletter bulanan Pintu Kerja! Mari kita lihat update menarik bulan ini.</p>
        
        <h3>🎉 Fitur Baru</h3>
        <ul>
          <li><strong>AI Job Matching:</strong> Algoritma baru untuk mencocokkan kandidat dengan pekerjaan yang lebih relevan</li>
          <li><strong>Video Resume:</strong> Sekarang Anda bisa upload video perkenalan di profil</li>
          <li><strong>Salary Calculator:</strong> Estimasi gaji berdasarkan posisi, pengalaman, dan lokasi</li>
        </ul>
        
        <h3>📊 Statistik Platform</h3>
        <ul>
          <li>10,000+ lowongan kerja aktif</li>
          <li>50,000+ job seekers terdaftar</li>
          <li>2,500+ perusahaan mitra</li>
          <li>85% success rate untuk job placement</li>
        </ul>
        
        <h3>🏆 Success Stories</h3>
        <p>Bulan ini, lebih dari 500 kandidat berhasil mendapatkan pekerjaan impian mereka melalui Pintu Kerja!</p>
        
        <h3>📚 Webinar Mendatang</h3>
        <ul>
          <li><strong>25 Feb:</strong> "How to Ace Technical Interviews"</li>
          <li><strong>28 Feb:</strong> "Building Your Personal Brand on LinkedIn"</li>
        </ul>
        
        <h3>💡 Tips Bulan Ini</h3>
        <p>Jangan lupa untuk update profil Anda secara berkala! Profil yang lengkap memiliki 3x lebih banyak views dari recruiter.</p>
        
        <h2>Terima Kasih!</h2>
        <p>Terima kasih telah menjadi bagian dari komunitas Pintu Kerja. Jangan ragu untuk share feedback Anda!</p>
      `,
      heroImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      category: "Newsletter",
      tags: ["newsletter", "update", "fitur-baru"],
      readTime: "3 min read",
      authorId: adminId,
      isPublished: true,
      publishedAt: new Date("2024-02-28"),
    },
  ];

  for (const post of blogPostsData) {
    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, post.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(blogPosts).values(post);
      console.log(`  ✓ Created blog post: ${post.title}`);
    } else {
      console.log(`  ⊘ Blog post already exists: ${post.title}`);
    }
  }

  console.log(`✅ Blog posts seeding completed: ${blogPostsData.length} posts created\n`);
}
