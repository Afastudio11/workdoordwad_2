import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import article1Img from "@assets/5_1760872341106.png";
import article2Img from "@assets/3_1760872341107.png";
import article3Img from "@assets/4_1760872341107.png";

const blogPosts = [
  {
    id: 1,
    category: "Newsletter",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "The Future of Job Market: Emerging Trends to Watch",
    description: "Technological advancements, data analytics, and industry disruptions: navigating the evolving landscape",
    image: article1Img,
    content: `
      <h2>Navigating the Changing Landscape</h2>
      <p>The job market is undergoing a profound transformation, driven by technological advancements, shifting demographics, and evolving workplace expectations. As we look ahead, several key trends are reshaping how we think about careers and employment.</p>
      
      <h3>The Rise of Remote and Hybrid Work</h3>
      <p>The COVID-19 pandemic accelerated a shift that was already underway. Remote work is no longer a perk—it's an expectation for many professionals. Companies that embrace flexible work arrangements are finding it easier to attract and retain top talent.</p>
      
      <h3>AI and Automation</h3>
      <p>Artificial intelligence isn't just changing how we work; it's changing what work means. While some jobs will be automated, new roles are emerging that require uniquely human skills like creativity, emotional intelligence, and complex problem-solving.</p>
      
      <h3>Skills Over Degrees</h3>
      <p>Traditional education pathways are being complemented—and sometimes replaced—by skills-based hiring. Employers are increasingly focused on what you can do rather than where you went to school.</p>
      
      <h3>The Gig Economy Expands</h3>
      <p>More professionals are choosing portfolio careers, combining multiple income streams and projects. This trend offers flexibility but also requires new approaches to benefits and job security.</p>
      
      <h3>Preparing for the Future</h3>
      <p>To thrive in tomorrow's job market, focus on continuous learning, developing adaptable skills, and building a strong professional network. The future belongs to those who can navigate change with confidence and resilience.</p>
    `
  },
  {
    id: 2,
    category: "Tips",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Mental Health Matters: Strategies for Job Seeker Well-Being",
    description: "Addressing stress, burnout, and mental health in the workplace. A holistic approach to support employee well-being",
    image: article2Img,
    content: `
      <h2>Taking Care of Yourself During the Job Search</h2>
      <p>Job searching can be one of life's most stressful experiences. The uncertainty, rejections, and pressure to find the "perfect" opportunity can take a serious toll on your mental health. Here's how to protect your well-being while pursuing your career goals.</p>
      
      <h3>Recognize the Signs of Job Search Burnout</h3>
      <p>Burnout doesn't happen overnight. Watch for warning signs like constant fatigue, cynicism about the job market, difficulty concentrating, or feeling hopeless about your prospects. Acknowledging these feelings is the first step to addressing them.</p>
      
      <h3>Create Structure and Boundaries</h3>
      <p>Treat your job search like a job itself—but with reasonable hours. Set specific times for applications and networking, then step away. You don't need to be "on" 24/7 to be successful.</p>
      
      <h3>Celebrate Small Wins</h3>
      <p>Got a phone screen? Updated your resume? Had a good networking conversation? These all count as progress. Acknowledge your efforts, not just outcomes you can't fully control.</p>
      
      <h3>Maintain Your Routine</h3>
      <p>Keep up with exercise, healthy eating, and sleep. These aren't luxuries—they're essentials that directly impact your mental clarity and resilience.</p>
      
      <h3>Stay Connected</h3>
      <p>Isolation makes everything harder. Maintain relationships with friends and family. Consider joining job seeker support groups where you can share experiences and strategies.</p>
      
      <h3>Seek Professional Help When Needed</h3>
      <p>There's no shame in talking to a therapist or counselor. Many offer sliding scale fees, and some communities have free resources for job seekers.</p>
      
      <p>Remember: Your worth isn't determined by your employment status. Take care of yourself first—the right opportunity will come.</p>
    `
  },
  {
    id: 3,
    category: "Insight",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Creating a Career Path: Leadership Insights",
    description: "Empowering your team to prioritize success every day, leadership strategies, training, and cultivating growth",
    image: article3Img,
    content: `
      <h2>Building Tomorrow's Leaders Today</h2>
      <p>Effective leadership isn't about having all the answers—it's about empowering your team to find them. Here's how to create an environment where career growth and leadership development thrive.</p>
      
      <h3>Start with Individual Development Plans</h3>
      <p>Every team member has unique aspirations and strengths. Regular one-on-ones focused on career goals help you understand what motivates each person and how you can support their growth.</p>
      
      <h3>Create Stretch Opportunities</h3>
      <p>Growth happens outside comfort zones. Assign projects that challenge your team members in new ways. Provide support, but resist the urge to rescue them at the first sign of struggle—that's where learning happens.</p>
      
      <h3>Model the Way</h3>
      <p>Your team watches how you handle challenges, setbacks, and successes. Demonstrate the behaviors you want to see: transparency, continuous learning, and resilience.</p>
      
      <h3>Invest in Skills Development</h3>
      <p>Budget isn't just for tools and software—it's for people. Support conference attendance, online courses, certifications, and mentorship programs. Education is an investment that pays dividends.</p>
      
      <h3>Create Leadership Opportunities at All Levels</h3>
      <p>You don't need a title to lead. Encourage team members to lead initiatives, mentor peers, or present to stakeholders. These experiences build confidence and skills.</p>
      
      <h3>Provide Honest, Constructive Feedback</h3>
      <p>Regular feedback—both positive and developmental—is essential for growth. Make it specific, timely, and focused on behaviors rather than personality.</p>
      
      <h3>Celebrate Progress and Promote from Within</h3>
      <p>When possible, fill leadership positions with internal candidates. This shows your team that investing in their development leads to real opportunities.</p>
      
      <p>Remember: Great leaders create more leaders, not followers. Your success is measured by your team's growth.</p>
    `
  },
  {
    id: 4,
    category: "Newsletter",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Tips Menulis CV yang Menarik Perhatian Recruiter",
    description: "Panduan lengkap membuat CV yang profesional dan menarik perhatian recruiter untuk meningkatkan peluang diterima",
    image: article1Img,
    content: `
      <h2>Membuat CV yang Menonjol di Mata Recruiter</h2>
      <p>CV adalah pintu gerbang pertama menuju pekerjaan impian Anda. Dalam hitungan detik, recruiter memutuskan apakah CV Anda layak dibaca lebih lanjut atau tidak. Berikut panduan membuat CV yang efektif.</p>
      
      <h3>Format yang Bersih dan Profesional</h3>
      <p>Gunakan format yang mudah dibaca dengan font standar seperti Arial atau Calibri ukuran 10-12. Hindari warna-warna mencolok atau desain yang terlalu ramai. Kesederhanaan adalah kunci.</p>
      
      <h3>Ringkasan Profesional yang Kuat</h3>
      <p>Di bagian atas CV, tulis 2-3 kalimat yang merangkum pengalaman dan keahlian utama Anda. Ini adalah "elevator pitch" Anda di atas kertas.</p>
      
      <h3>Cantumkan Pencapaian, Bukan Hanya Tugas</h3>
      <p>Jangan hanya daftar job description. Tunjukkan dampak Anda dengan angka konkret. Contoh: "Meningkatkan penjualan 30% dalam 6 bulan" lebih kuat dari "Bertanggung jawab atas penjualan".</p>
      
      <h3>Sesuaikan dengan Posisi yang Dilamar</h3>
      <p>Jangan kirim CV yang sama ke semua perusahaan. Sesuaikan kata kunci dan pengalaman yang relevan dengan job description yang Anda lamar.</p>
      
      <h3>Bagian Keahlian yang Jelas</h3>
      <p>Buat bagian khusus untuk hard skills dan soft skills. Pastikan mencantumkan keahlian teknis yang relevan dengan posisi yang dilamar.</p>
      
      <h3>Pendidikan dan Sertifikasi</h3>
      <p>Cantumkan pendidikan formal Anda, serta sertifikasi atau pelatihan yang relevan. Untuk fresh graduate, bagian ini bisa lebih detail.</p>
      
      <h3>Periksa Kesalahan</h3>
      <p>Typo atau kesalahan tata bahasa bisa membuat CV Anda langsung ditolak. Minta teman atau keluarga untuk membaca ulang CV Anda.</p>
      
      <p>Ingat: CV yang baik membuka pintu interview. Pastikan CV Anda merepresentasikan versi terbaik dari diri Anda!</p>
    `
  },
  {
    id: 5,
    category: "Tips",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Cara Memaksimalkan Peluang Diterima Kerja",
    description: "Strategi efektif untuk meningkatkan peluang kamu diterima di perusahaan impian dengan persiapan yang matang",
    image: article2Img,
    content: `
      <h2>Strategi Jitu Meningkatkan Peluang Diterima Kerja</h2>
      <p>Mendapatkan pekerjaan impian bukan hanya tentang keberuntungan—ini tentang persiapan, strategi, dan konsistensi. Berikut cara memaksimalkan peluang Anda.</p>
      
      <h3>Riset Mendalam tentang Perusahaan</h3>
      <p>Sebelum melamar, pelajari visi, misi, produk, dan budaya perusahaan. Ini akan membantu Anda menyesuaikan aplikasi dan memberikan kesan di interview bahwa Anda benar-benar tertarik.</p>
      
      <h3>Optimalkan LinkedIn Profile</h3>
      <p>LinkedIn adalah CV digital Anda. Pastikan foto profesional, headline yang menarik, dan ringkasan yang menunjukkan value Anda. Aktif posting dan berinteraksi juga meningkatkan visibility.</p>
      
      <h3>Networking yang Efektif</h3>
      <p>80% pekerjaan tidak pernah dipublikasikan secara terbuka. Bangun relasi dengan profesional di industri Anda melalui LinkedIn, acara networking, atau alumni groups.</p>
      
      <h3>Siapkan Portfolio atau Project</h3>
      <p>Jika memungkinkan, tunjukkan bukti nyata kemampuan Anda. Untuk developer, buat GitHub portfolio. Untuk designer, siapkan portofolio visual. Untuk marketer, tunjukkan case study kampanye Anda.</p>
      
      <h3>Latihan Interview</h3>
      <p>Persiapan adalah kunci sukses interview. Latih jawaban untuk pertanyaan umum, siapkan pertanyaan untuk interviewer, dan lakukan mock interview dengan teman.</p>
      
      <h3>Follow Up yang Tepat</h3>
      <p>Setelah interview, kirim email terima kasih dalam 24 jam. Tunjukkan antusiasme Anda dan tegaskan kembali mengapa Anda cocok untuk posisi tersebut.</p>
      
      <h3>Terus Belajar dan Berkembang</h3>
      <p>Ikuti kursus online, dapatkan sertifikasi, atau pelajari skill baru yang relevan. Continuous learning menunjukkan growth mindset yang dicari employer.</p>
      
      <h3>Jaga Sikap Positif</h3>
      <p>Penolakan adalah bagian dari proses. Jangan menyerah! Setiap rejection adalah kesempatan belajar untuk interview berikutnya.</p>
      
      <p>Kunci sukses: Konsistensi, persiapan matang, dan attitude yang baik akan membawa Anda ke pekerjaan impian!</p>
    `
  },
  {
    id: 6,
    category: "Insight",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Strategi Interview yang Efektif untuk Fresh Graduate",
    description: "Tips dan trik menghadapi interview kerja bagi fresh graduate untuk tampil percaya diri dan profesional",
    image: article3Img,
    content: `
      <h2>Panduan Interview untuk Fresh Graduate</h2>
      <p>Sebagai fresh graduate, interview kerja pertama bisa terasa menakutkan. Tanpa pengalaman kerja yang panjang, bagaimana Anda bisa menonjol? Berikut strategi yang terbukti efektif.</p>
      
      <h3>Manfaatkan Pengalaman Kampus</h3>
      <p>Organisasi mahasiswa, proyek kuliah, magang, atau volunteer work semuanya adalah pengalaman berharga. Ceritakan apa yang Anda pelajari dan kontribusi Anda dengan metode STAR (Situation, Task, Action, Result).</p>
      
      <h3>Tunjukkan Passion dan Eagerness to Learn</h3>
      <p>Yang Anda belum miliki dalam pengalaman, ganti dengan antusiasme dan kemauan belajar. Employer tahu fresh graduate masih perlu training—mereka mencari sikap yang benar.</p>
      
      <h3>Persiapkan Jawaban untuk Pertanyaan Umum</h3>
      <p>Beberapa pertanyaan yang sering muncul:</p>
      <ul>
        <li>"Ceritakan tentang diri Anda" - Fokus pada latar belakang pendidikan, keahlian relevan, dan minat karir</li>
        <li>"Mengapa Anda tertarik dengan posisi ini?" - Tunjukkan riset Anda tentang perusahaan</li>
        <li>"Apa kekuatan dan kelemahan Anda?" - Jujur tapi strategis, tunjukkan self-awareness</li>
        <li>"Di mana Anda melihat diri Anda 5 tahun ke depan?" - Tunjukkan ambisi yang realistis</li>
      </ul>
      
      <h3>Riset Perusahaan dengan Mendalam</h3>
      <p>Ketahui produk/layanan mereka, kompetitor, berita terbaru, dan budaya perusahaan. Ini akan membantu Anda menjawab pertanyaan dengan konteks yang tepat.</p>
      
      <h3>Siapkan Pertanyaan Cerdas</h3>
      <p>Interview adalah two-way street. Tanyakan tentang:</p>
      <ul>
        <li>Program training dan mentorship</li>
        <li>Kesempatan growth dan development</li>
        <li>Tantangan yang dihadapi tim</li>
        <li>Budaya kerja dan kolaborasi</li>
      </ul>
      
      <h3>Berpakaian Profesional</h3>
      <p>First impression matters. Berpakaian sedikit lebih formal dari budaya perusahaan selalu lebih aman. Ketika ragu, pilih business casual.</p>
      
      <h3>Body Language yang Baik</h3>
      <p>Kontak mata, senyum natural, jabat tangan yang firm, dan postur tubuh yang percaya diri menunjukkan profesionalisme.</p>
      
      <h3>Follow Up</h3>
      <p>Kirim email terima kasih dalam 24 jam. Singkat, profesional, dan tunjukkan kembali antusiasme Anda.</p>
      
      <p>Ingat: Setiap orang pernah menjadi fresh graduate. Dengan persiapan yang baik dan sikap yang benar, Anda bisa sukses di interview pertama Anda!</p>
    `
  },
];

export default function BlogDetailPage() {
  const [, params] = useRoute("/blog/:id");
  const blogId = params?.id ? parseInt(params.id) : null;
  
  const post = blogPosts.find(p => p.id === blogId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="dark" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <p className="text-center text-gray-600">Blog post not found</p>
          <div className="text-center mt-4">
            <Link href="/blog" className="text-primary hover:underline">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="dark" />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          data-testid="link-back-to-blog"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Blog
        </Link>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight" data-testid="article-title">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
          data-testid="article-content"
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
            data-testid="button-back-to-blog"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat Artikel Lainnya
          </Link>
        </div>
      </article>
    </div>
  );
}
