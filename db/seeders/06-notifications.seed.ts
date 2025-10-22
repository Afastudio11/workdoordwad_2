import { db } from "../../server/db";
import { notifications, users } from "../../shared/schema";
import { eq } from "drizzle-orm";

export async function seedNotifications() {
  console.log("🌱 Seeding notifications...");

  // Get all test users
  const testUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@pintuloker.com"))
    .limit(1);

  const jobSeeker = await db
    .select()
    .from(users)
    .where(eq(users.email, "pekerja@email.com"))
    .limit(1);

  const employer = await db
    .select()
    .from(users)
    .where(eq(users.email, "employer@company.com"))
    .limit(1);

  if (testUsers.length === 0 || jobSeeker.length === 0 || employer.length === 0) {
    console.log("  ⚠️  Test users not found. Skipping notifications seeding.");
    return;
  }

  const adminId = testUsers[0].id;
  const jobSeekerId = jobSeeker[0].id;
  const employerId = employer[0].id;

  const notificationsData = [
    // Admin notifications
    {
      userId: adminId,
      type: "system",
      title: "Sistem Berhasil Diinisialisasi",
      message: "Database telah berhasil di-seed dengan data testing.",
      linkUrl: "/admin",
      isRead: false,
    },
    {
      userId: adminId,
      type: "verification_request",
      title: "Permintaan Verifikasi Baru",
      message: "Ada 3 perusahaan yang meminta verifikasi.",
      linkUrl: "/admin/verification",
      isRead: false,
    },

    // Job Seeker notifications
    {
      userId: jobSeekerId,
      type: "application_status",
      title: "Lamaran Anda Telah Ditinjau",
      message: "Lamaran Anda untuk posisi Web Developer telah ditinjau oleh recruiter.",
      linkUrl: "/dashboard",
      isRead: false,
    },
    {
      userId: jobSeekerId,
      type: "application_status",
      title: "Selamat! Anda Lolos Tahap Seleksi",
      message: "Anda telah lolos seleksi untuk posisi UI/UX Designer. Harap tunggu info selanjutnya.",
      linkUrl: "/dashboard#applications",
      isRead: false,
    },
    {
      userId: jobSeekerId,
      type: "job_match",
      title: "Lowongan Baru Sesuai Profil Anda",
      message: "Ada 5 lowongan baru yang sesuai dengan preferensi Anda.",
      linkUrl: "/find-job",
      isRead: false,
    },
    {
      userId: jobSeekerId,
      type: "job_match",
      title: "Rekomendasi Pekerjaan",
      message: "Lowongan Frontend Developer di PT Teknologi Maju mungkin cocok untuk Anda.",
      linkUrl: "/find-job",
      isRead: true,
    },

    // Employer notifications
    {
      userId: employerId,
      type: "new_applicant",
      title: "Pelamar Baru",
      message: "Ada 3 pelamar baru untuk posisi Web Developer.",
      linkUrl: "/employer/dashboard#my-jobs",
      isRead: false,
    },
    {
      userId: employerId,
      type: "new_applicant",
      title: "Kandidat Potensial",
      message: "Seorang kandidat dengan kualifikasi tinggi melamar posisi Senior Developer.",
      linkUrl: "/employer/dashboard#my-jobs",
      isRead: false,
    },
    {
      userId: employerId,
      type: "job_status",
      title: "Lowongan Akan Segera Berakhir",
      message: "Lowongan Mobile Developer akan berakhir dalam 7 hari.",
      linkUrl: "/employer/dashboard#my-jobs",
      isRead: true,
    },
    {
      userId: employerId,
      type: "subscription",
      title: "Paket Gratis Hampir Habis",
      message: "Anda telah menggunakan 2 dari 3 slot gratis. Upgrade untuk posting lebih banyak lowongan.",
      linkUrl: "/employer/dashboard#upgrade",
      isRead: true,
    },
  ];

  let createdCount = 0;

  for (const notification of notificationsData) {
    await db.insert(notifications).values(notification);
    createdCount++;
  }

  console.log(`✅ Notifications seeding completed: ${createdCount} notifications created\n`);
}
