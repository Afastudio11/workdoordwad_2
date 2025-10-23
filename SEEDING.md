# Database Seeding Guide - Pintu Loker

Dokumentasi lengkap untuk sistem seeding database Pintu Loker.

## 📋 Daftar Isi

- [Tentang Seeding](#tentang-seeding)
- [Data Yang Tersedia](#data-yang-tersedia)
- [Cara Menjalankan](#cara-menjalankan)
- [Test Account Credentials](#test-account-credentials)
- [Struktur File Seeder](#struktur-file-seeder)
- [Troubleshooting](#troubleshooting)

## 🎯 Tentang Seeding

Database seeding adalah proses mengisi database dengan data awal untuk keperluan development dan testing. Sistem seeding ini dirancang agar:

- ✅ **Otomatis** - Jalankan satu command, semua data terisi
- ✅ **Idempoten** - Aman dijalankan berulang kali tanpa duplikasi
- ✅ **Realistis** - Data yang dihasilkan menyerupai kondisi production
- ✅ **Modular** - Setiap tipe data memiliki seeder terpisah

## 📊 Data Yang Tersedia

### 1. Users (7 akun test)

| Role | Email | Password | Nama | Subscription Plan |
|------|-------|----------|------|-------------------|
| Admin | admin@pintuloker.com | Admin123! | Admin Pintu Loker | - |
| Employer (Legacy) | employer@company.com | Employer123! | Budi Santoso | Free |
| **Employer Free** | **free@company.com** | **Employer123!** | **Ahmad Fauzi** | **Free** |
| **Employer Starter Monthly** | **starter.monthly@company.com** | **Employer123!** | **Dewi Lestari** | **Starter (Monthly)** |
| **Employer Starter Yearly** | **starter.yearly@company.com** | **Employer123!** | **Rizki Pratama** | **Starter (Yearly)** |
| **Employer Professional** | **professional@company.com** | **Employer123!** | **Andi Wijaya** | **Professional (Yearly)** |
| Job Seeker | pekerja@email.com | Pekerja123! | Siti Nurhaliza | - |

### 2. Companies (30 perusahaan)

Berbagai jenis perusahaan dari berbagai industri:
- 🏢 Corporate (PT Bank Digital Nusantara, PT Telekomunikasi Modern)
- 🚀 Startup (Startup Inovasi Tech, Startup AI Solutions, dll)
- 🏪 UMKM (CV Berkah Digital, CV Fotografi Profesional, dll)
- 🎨 Agency (PT Kreatif Nusantara, CV Konten Kreator Agency, dll)

**Industri yang tercakup:**
- Technology, Fintech, Healthcare, E-commerce
- Marketing & Advertising, Creative & Design
- F&B, Education, Logistics, Manufacturing
- Dan 15+ industri lainnya

### 3. Jobs (90 lowongan kerja)

**Posisi (30 jenis, masing-masing 3x):**
- Web Developer, Mobile Developer, UI/UX Designer
- Data Analyst, Digital Marketing, Content Writer
- Sales Executive, Customer Service, Accounting
- Project Manager, Product Manager, DevOps Engineer
- QA Tester, Business Analyst, dan 15+ posisi lainnya

**Distribusi:**
- 50 Full Time
- 15 Part Time
- 10 Freelance
- 15 Contract

**Status:**
- 70 lowongan aktif
- 15 lowongan closed
- 5 lowongan pending moderation

**Sumber:**
- 60 lowongan dari perusahaan (direct)
- 30 lowongan dari AI scraping (aggregated)

**Lokasi:**
Jakarta, Surabaya, Bandung, Yogyakarta, Semarang, Medan, Bali, Makassar, Malang, Tangerang, Bekasi, Bogor, Depok, Solo

**Level & Gaji:**
- Entry Level: Rp 3-5 juta
- Junior: Rp 5-8 juta
- Mid Level: Rp 8-12 juta
- Senior: Rp 12-18 juta
- Manager: Rp 15-25 juta

### 4. Applications (15 lamaran)

Akun job seeker memiliki 15 lamaran dengan berbagai status:
- ✅ Submitted
- 👀 Reviewed
- ⭐ Shortlisted
- ❌ Rejected
- 🎉 Accepted

### 5. Wishlists (10 lowongan favorit)

Akun job seeker memiliki 10 lowongan yang di-bookmark/favorit.

### 6. Notifications (10 notifikasi)

Notifikasi sample untuk setiap role:
- Admin: Verifikasi, sistem updates
- Employer: Pelamar baru, lowongan akan berakhir
- Job Seeker: Status lamaran, rekomendasi pekerjaan

## 🚀 Cara Menjalankan

### Persiapan Awal

Pastikan database sudah setup dan `.env` sudah dikonfigurasi:

```bash
# Cek file .env
cat .env | grep DATABASE_URL
```

### Menjalankan Semua Seeder

```bash
npm run seed
```

Output yang diharapkan:
```
🚀 Starting database seeding...
==================================================
🌱 Seeding users...
  ✓ Created admin account: admin@pintuloker.com
  ✓ Created pemberi_kerja account: employer@company.com
  ✓ Created pekerja account: pekerja@email.com
✅ Users seeding completed

🌱 Seeding companies...
  ✓ Created company: PT Teknologi Maju
  ✓ Created company: CV Berkah Digital
  ...
✅ Companies seeding completed

🌱 Seeding jobs...
  ✓ Created 10 jobs...
  ✓ Created 20 jobs...
  ...
✅ Jobs seeding completed: 90 jobs created
...
```

### Menjalankan Seeder Spesifik

```bash
# Hanya users
npm run seed:users

# Hanya companies
npm run seed:companies

# Hanya jobs
npm run seed:jobs
```

## 🔑 Test Account Credentials

### Admin Account
```
Email: admin@pintuloker.com
Password: Admin123!
Role: Administrator
```
**Akses:** Dashboard admin lengkap dengan verifikasi, moderasi, financial management, dll.

### Employer Account
```
Email: employer@company.com
Password: Employer123!
Role: Pemberi Kerja (Recruiter)
```
**Akses:** Dashboard employer dengan manajemen lowongan, lihat pelamar, dll.
**Perusahaan:** PT Teknologi Maju (sudah verified)

### Job Seeker Account
```
Email: pekerja@email.com
Password: Pekerja123!
Role: Pekerja (Job Seeker)
```
**Akses:** Dashboard job seeker dengan lamaran, wishlist, rekomendasi, dll.
**Data:** Sudah ada CV, pendidikan (S1 Teknik Informatika), pengalaman, skills

## 📁 Struktur File Seeder

```
db/seeders/
├── index.ts                    # Main orchestrator
├── 01-users.seed.ts           # 3 test users
├── 02-companies.seed.ts       # 30 companies
├── 03-jobs.seed.ts            # 90 job listings
├── 04-applications.seed.ts    # 15 applications
├── 05-wishlists.seed.ts       # 10 wishlists
└── 06-notifications.seed.ts   # 10 notifications
```

### Urutan Eksekusi

Seeder dijalankan secara berurutan karena ada dependency:

1. **Users** - Harus pertama (diperlukan oleh semua tabel lain)
2. **Companies** - Memerlukan employer user
3. **Jobs** - Memerlukan companies dan employer
4. **Applications** - Memerlukan jobs dan job seeker
5. **Wishlists** - Memerlukan jobs dan job seeker
6. **Notifications** - Memerlukan users

### Idempotency

Setiap seeder akan:
- ✅ Mengecek apakah data sudah ada
- ✅ Skip jika data sudah ada (tidak duplikasi)
- ✅ Hanya insert data yang belum ada

Contoh check:
```typescript
const existing = await db
  .select()
  .from(users)
  .where(eq(users.email, account.email))
  .limit(1);

if (existing.length === 0) {
  await db.insert(users).values(account);
}
```

## 🔧 Troubleshooting

### Error: "Employer user not found"

**Penyebab:** Users seeder belum dijalankan atau gagal.

**Solusi:**
```bash
npm run seed:users
```

### Error: "No companies found"

**Penyebab:** Companies seeder belum dijalankan.

**Solusi:**
```bash
npm run seed:companies
```

### Error: "Connection refused"

**Penyebab:** Database tidak running atau konfigurasi salah.

**Solusi:**
```bash
# Cek DATABASE_URL di .env
cat .env | grep DATABASE_URL

# Restart database (jika menggunakan Replit)
# Database biasanya auto-start, tapi bisa restart dari Replit Tools
```

### Error: "Password hashing failed"

**Penyebab:** Package bcrypt tidak terinstall.

**Solusi:**
```bash
npm install bcrypt @types/bcrypt
```

### Data Duplikat Terdeteksi

**Penyebab:** Seeder dijalankan 2x (ini normal, tidak akan create duplikat).

**Output yang normal:**
```
⊘ admin account already exists: admin@pintuloker.com
⊘ Company already exists: PT Teknologi Maju
```

### Reset Database ke Kondisi Awal

Jika ingin menghapus semua data dan re-seed:

```bash
# HATI-HATI: Ini akan menghapus SEMUA data!

# Option 1: Reset database via Drizzle (recommended)
npm run db:push --force

# Option 2: Manual delete (jika tahu apa yang dilakukan)
# Buka database console dan delete data secara manual

# Setelah reset, jalankan seeder lagi
npm run seed
```

## 📝 Best Practices

### Kapan Menjalankan Seeder?

1. **Setup awal** - Pertama kali clone/setup project
2. **Reset development** - Butuh fresh data untuk testing
3. **Demo preparation** - Sebelum demo ke stakeholder
4. **After migration** - Setelah schema change yang signifikan

### Keamanan

⚠️ **JANGAN** gunakan seeder di production database!

Seeder ini hanya untuk:
- ✅ Local development
- ✅ Testing environment
- ✅ Staging/Demo environment

### Customization

Jika ingin menambah/modifikasi data seeder:

1. Edit file seeder yang relevan (01-users.seed.ts, 02-companies.seed.ts, dll)
2. Tambahkan data ke array `testAccounts`, `companyData`, dll
3. Save dan jalankan: `npm run seed`

Contoh menambah user:
```typescript
// di 01-users.seed.ts
const testAccounts = [
  // ... existing accounts
  {
    username: "newuser",
    email: "newuser@example.com",
    password: await bcrypt.hash("Password123!", 10),
    fullName: "New User Name",
    role: "pekerja",
    // ... fields lainnya
  }
];
```

## 🎓 Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Database Schema](../shared/schema.ts)
- [Replit Database Guide](https://docs.replit.com/hosting/databases/postgresql-on-replit)

## 💡 Tips

1. **Jalankan seeder setelah schema change** - Pastikan data test tetap tersedia
2. **Gunakan test accounts untuk E2E testing** - Credentials sudah konsisten
3. **Variasikan data** - Tambahkan lebih banyak companies/jobs jika diperlukan
4. **Check logs** - Perhatikan output seeder untuk memastikan semua berhasil

---

**Pertanyaan atau masalah?** 
Hubungi team development atau buka issue di repository.
