# Akun Development PintuKerja

Berikut adalah 3 akun utama yang sudah dibuat untuk keperluan development. Data ini disimpan di PostgreSQL database dan akan tetap ada meskipun aplikasi ditutup atau di-import ulang dari GitHub.

## 🔐 Akun Utama Development

### 1. 👤 Akun Pekerja (Worker)
```
Username: pekerja
Password: Pekerja123!
Email: pekerja@pintukerja.com
Role: pekerja
```

**Profile:**
- Nama: Ahmad Pekerja
- Skills: JavaScript, React, Node.js, PostgreSQL, TypeScript
- Lokasi: Jakarta, DKI Jakarta
- Preferensi Industri: Technology, Startup
- Preferensi Lokasi: Jakarta, Bandung
- Gaji yang diharapkan: Rp 8.000.000

### 2. 👔 Akun Admin
```
Username: admin
Password: Admin123!
Email: admin@pintukerja.com
Role: admin
```

**Profile:**
- Nama: Admin PintuKerja
- Lokasi: Jakarta, DKI Jakarta
- Akses penuh ke admin dashboard

### 3. 🏢 Akun Pemberi Kerja (Employer)
```
Username: pemberi_kerja
Password: Pemberi123!
Email: pemberi@pintukerja.com
Role: pemberi_kerja
Status: Verified
```

**Profile:**
- Nama: Budi Pemberi Kerja
- Position: HR Manager di TechStartup Indonesia
- Lokasi: Jakarta, DKI Jakarta
- Memiliki 3 perusahaan:
  1. TechStartup Indonesia (Technology, Jakarta Selatan)
  2. Digital Marketing Pro (Marketing, Bandung)
  3. E-Commerce Solutions (E-Commerce, Jakarta Barat)

---

## 📊 Data yang Sudah Tersedia

### Perusahaan
- **Total**: 28 perusahaan
- **Verified**: 3 perusahaan milik pemberi_kerja
- **Industri**: Technology, Marketing, E-Commerce, Retail, F&B, dll.

### Lowongan Pekerjaan
- **Total**: 80 lowongan
- **Featured Jobs**: 5 lowongan unggulan
- **Jenis**: Full-time, Part-time, Contract, Freelance
- **Lokasi**: Jakarta, Bandung, Surabaya, dan kota-kota lainnya
- **Range Gaji**: Rp 3.000.000 - Rp 25.000.000

### Blog Posts
- **Total**: 4 artikel blog yang sudah published
- **Kategori**: Tips, Newsletter, Insight
- **Topik**:
  1. "7 Tips Membuat CV yang Menarik Perhatian HRD"
  2. "Rahasia Sukses Interview Kerja: Panduan Lengkap"
  3. "Tren Pekerjaan 2024: Skill yang Paling Dicari Perusahaan"
  4. "Mencapai Work-Life Balance yang Sehat"

### Sample Interactions (untuk testing)
- 10 applications dari pekerja_test
- Wishlist items
- Messages dan notifications
- Various application statuses (submitted, reviewed, shortlisted, etc.)

---

## 🧪 Akun Testing Tambahan

Selain 3 akun utama di atas, ada juga akun testing:

### Pekerja Test
```
Username: pekerja_test
Password: password123
Email: pekerja@test.com
```

### Employer Test
```
Username: employer_test
Password: password123
Email: employer@test.com
```

---

## 💾 Database Information

**Database**: PostgreSQL (Neon-backed)
**Persistence**: Permanent - data tidak akan hilang meskipun:
- Aplikasi ditutup
- Project di-import ulang dari GitHub
- Development server di-restart

**Connection**: Menggunakan environment variable `DATABASE_URL`

---

## 🔄 Cara Mengisi Ulang Data

Jika Anda perlu mengisi ulang database dengan data sample, jalankan:

```bash
npx tsx server/seed.ts
```

**Catatan**: 
- Script seed sepenuhnya **idempotent** - aman untuk dijalankan berkali-kali
- Jika data sudah ada, script akan menggunakannya kembali daripada membuat duplicate
- Menggunakan `onConflictDoNothing()` dengan fallback ke query untuk memastikan tidak ada error
- Cocok untuk re-populate database setelah reset atau import ulang dari GitHub

---

## 📝 Notes

1. **Password Security**: Semua password menggunakan bcrypt hashing dengan salt rounds 10
2. **Data Persistence**: Semua data disimpan di PostgreSQL database yang permanent
3. **Auto-generated IDs**: Menggunakan UUID (`gen_random_uuid()`) untuk semua ID
4. **Timestamps**: Semua record memiliki created_at timestamp
5. **Relations**: Foreign keys sudah diset dengan benar untuk menjaga data integrity

---

## 🚀 Quick Start

1. Buka aplikasi: `npm run dev`
2. Akses halaman utama
3. Klik "Masuk" di navigation bar
4. Login dengan salah satu akun di atas
5. Explore fitur sesuai role masing-masing:
   - **Pekerja**: Browse jobs, apply, manage applications
   - **Admin**: Access admin dashboard, manage users, jobs, blog posts
   - **Pemberi Kerja**: Post jobs, manage applications, review candidates

---

**Terakhir diupdate**: 22 Oktober 2025

Data sudah siap untuk development! 🎉
