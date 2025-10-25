# 🔐 Akun Permanen Pintu Kerja

Dokumentasi ini berisi kredensial untuk 6 akun permanen yang digunakan untuk testing dan development.

## 📋 Daftar Akun

### 1. ADMIN
**Email:** `admin@pintuloker.com`  
**Password:** `Admin123!`  
**Role:** Administrator  
**Akses:**
- Dashboard admin lengkap
- Manajemen users, companies, jobs
- Verifikasi perusahaan
- Moderasi konten
- Analytics platform
- Financial reports

---

### 2. JOB SEEKER / PESERTA
**Email:** `pekerja@email.com`  
**Password:** `Pekerja123!`  
**Role:** Pekerja (Job Seeker)  
**Profile:**
- Nama: Siti Nurhaliza
- Lokasi: Jakarta, DKI Jakarta
- Pendidikan: S1 Teknik Informatika, Universitas Indonesia (2023)
- Skills: JavaScript, React, Node.js, TypeScript
- Status: Fresh Graduate
- Expected Salary: Rp 5,000,000+

**Akses:**
- Cari dan lamar pekerjaan
- Dashboard pribadi
- Aplikasi dan wishlist
- Notifikasi
- Profile management

---

### 3. EMPLOYER - FREE PLAN
**Email:** `employer.free@company.com`  
**Password:** `Employer123!`  
**Role:** Pemberi Kerja (Employer)  

**User Info:**
- Nama: Budi Santoso
- Position: HR Manager
- Company: PT Startup Berkembang

**Company Info:**
- Industry: Technology
- Location: Jakarta Selatan, DKI Jakarta
- Employees: 1-10
- Website: https://startupberkembang.id
- Verification: ✓ Verified

**Subscription:**
- Plan: FREE
- Duration: Permanent
- Features:
  - ✓ 3 job postings per bulan
  - ✗ Featured jobs
  - ✗ Verified badge
  - ✗ Analytics
  - ✗ CV Database

---

### 4. EMPLOYER - STARTER MONTHLY
**Email:** `employer.starter@company.com`  
**Password:** `Employer123!`  
**Role:** Pemberi Kerja (Employer)  

**User Info:**
- Nama: Ani Wijaya
- Position: Recruitment Manager
- Company: CV Toko Modern

**Company Info:**
- Industry: Retail
- Location: Bandung, Jawa Barat
- Employees: 11-50
- Website: https://tokomodern.co.id
- Verification: ✓ Verified

**Subscription:**
- Plan: STARTER (Monthly)
- Price: Rp 199,000/bulan
- Duration: 30 hari (aktif hingga +30 hari dari sekarang)
- Payment: Completed
- Features:
  - ✓ 10 job postings per bulan
  - ✓ 3 featured jobs
  - ✓ Verified badge
  - ✓ Basic analytics
  - ✗ CV Database

---

### 5. EMPLOYER - STARTER YEARLY
**Email:** `employer.starter.yearly@company.com`  
**Password:** `Employer123!`  
**Role:** Pemberi Kerja (Employer)  

**User Info:**
- Nama: Rina Kartika
- Position: Owner
- Company: CV Kuliner Nusantara

**Company Info:**
- Industry: Food & Beverage
- Location: Yogyakarta, DI Yogyakarta
- Employees: 51-100
- Website: https://kulinernusantara.id
- Verification: ✓ Verified

**Subscription:**
- Plan: STARTER (Yearly)
- Price: Rp 1,990,000/tahun (hemat Rp 398,000)
- Duration: 365 hari (aktif hingga +1 tahun dari sekarang)
- Payment: Completed
- Features:
  - ✓ 10 job postings per bulan
  - ✓ 3 featured jobs
  - ✓ Verified badge
  - ✓ Basic analytics
  - ✗ CV Database

---

### 6. EMPLOYER - PROFESSIONAL YEARLY
**Email:** `employer.professional@company.com`  
**Password:** `Employer123!`  
**Role:** Pemberi Kerja (Employer)  

**User Info:**
- Nama: Eko Prasetyo
- Position: Head of HR
- Company: PT Industri Maju Jaya

**Company Info:**
- Industry: Manufacturing
- Location: Surabaya, Jawa Timur
- Employees: 201-500
- Website: https://industrimajujaya.co.id
- Verification: ✓ Verified

**Subscription:**
- Plan: PROFESSIONAL (Yearly)
- Price: Rp 3,990,000/tahun (hemat Rp 798,000)
- Duration: 365 hari (aktif hingga +1 tahun dari sekarang)
- Payment: Completed
- Features:
  - ✓ 30 job postings per bulan
  - ✓ Unlimited featured jobs
  - ✓ Unlimited urgent jobs
  - ✓ Verified badge
  - ✓ Advanced analytics
  - ✓ CV Database (100 downloads/bulan)

---

## 🚀 Cara Menggunakan

### Setup Pertama Kali (Setelah Import Replit)

1. **Push database schema:**
   ```bash
   npm run db:push
   ```

2. **Seed akun permanen:**
   ```bash
   npm run seed:permanent
   ```
   
   atau untuk seed semua data (termasuk companies, jobs, dll):
   ```bash
   npm run seed
   ```

3. **Login dan test:**
   - Buka aplikasi di browser
   - Login menggunakan salah satu email dan password di atas
   - Test fitur sesuai dengan role dan subscription plan

### Re-seed (Jika Perlu)

Jika database sudah ada data dan ingin di-seed ulang:

```bash
# Hanya seed akun permanen
npm run seed:permanent

# Atau seed semua data
npm run seed
```

**Note:** Seeder sudah idempotent (aman dijalankan berulang kali). Jika akun sudah ada, tidak akan dibuat duplikat.

---

## 💾 Persistensi Data

### ✅ Data yang PERSISTEN (tidak hilang):
- Database PostgreSQL Neon (data users, companies, jobs, dll)
- Environment variables (.env secrets)

### ❌ Data yang TIDAK PERSISTEN saat re-import:
- Database content (harus di-seed ulang)
- Uploaded files (logos, documents) - stored in file system

### 💡 Tips Agar Data Tidak Hilang:

1. **Jangan hapus project Replit** - Selama project tidak dihapus, database akan tetap ada
2. **Backup database** - Export database secara berkala jika data penting
3. **Dokumentasikan custom data** - Jika menambahkan data manual, dokumentasikan agar bisa di-recreate
4. **Gunakan seeder** - Selalu seed ulang setelah import project

---

## 🔄 Import Ulang ke Replit

Ketika Anda import ulang project ke Replit baru:

1. Clone/Import project dari Git
2. Pastikan environment variables sudah di-set (DATABASE_URL, SESSION_SECRET, dll)
3. Jalankan `npm install`
4. Push schema: `npm run db:push`
5. Seed data: `npm run seed`
6. Start aplikasi: `npm run dev`

**Database Neon akan tetap ada** selama Anda menggunakan DATABASE_URL yang sama.

---

## 📊 Monitoring Progress

Setelah login, Anda bisa melihat:

### Untuk Job Seeker:
- Dashboard → Lihat aplikasi dan wishlist
- Find Jobs → Cari dan lamar pekerjaan
- Profile → Edit profile dan skills

### Untuk Employer:
- Dashboard → Quota usage, active jobs
- Post Job → Test quota limits per plan
- Analytics → (hanya Professional plan)
- CV Database → (hanya Professional plan)
- Company Profile → Update company info

### Untuk Admin:
- Admin Dashboard → Overview statistics
- Users → Manage all users
- Companies → Verify companies
- Jobs → Moderate job listings
- Verifications → Approve/reject employer verifications

---

## 🧪 Testing Scenarios

### Test Free Plan Limits:
1. Login sebagai `employer.free@company.com`
2. Coba post lebih dari 3 jobs
3. Verifikasi muncul upgrade prompt

### Test Starter Features:
1. Login sebagai `employer.starter@company.com`
2. Post job dengan featured badge
3. Test quota 10 jobs dan 3 featured
4. Verifikasi basic analytics tersedia

### Test Professional Features:
1. Login sebagai `employer.professional@company.com`
2. Akses CV Database
3. Akses Advanced Analytics
4. Test unlimited featured jobs

### Test Verification Flow:
1. Login sebagai admin
2. Buka Admin → Verifications
3. Approve/reject company verifications
4. Test reupload documents flow

---

## 🆘 Troubleshooting

### "Email already exists"
Akun sudah ada di database. Seeder akan skip dan tidak membuat duplikat.

### "Cannot connect to database"
Pastikan DATABASE_URL sudah di-set di environment variables.

### "Quota tidak update"
Quota dihitung dari jobs yang active. Check di database atau refresh company data.

### "Subscription sudah expired"
Update `subscriptionEndDate` di database atau jalankan ulang seeder untuk reset tanggal.

---

## 📝 Notes

- **Password format:** Minimal 8 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial
- **All accounts are verified** - Tidak perlu proses verifikasi manual
- **Subscription dates** - Dihitung dari waktu seeding (today + duration)
- **Safe to re-run** - Seeder idempotent, tidak akan membuat duplikat

---

**Last Updated:** October 25, 2025  
**Version:** 1.0
