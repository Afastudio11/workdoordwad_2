# 🔐 Test Account Credentials - Pintu Kerja

Database sudah berhasil dibuat dan diisi dengan data lengkap untuk testing semua fitur!

## 📧 Akun Testing

### 👤 Admin Account
- **Email:** admin@pintuloker.com
- **Username:** admin
- **Password:** Admin123!
- **Role:** Administrator
- **Akses:** Dashboard Admin lengkap dengan semua fitur manajemen

### 👤 Employer Account (Pemberi Kerja)
- **Email:** employer@company.com
- **Username:** employer
- **Password:** Employer123!
- **Role:** Pemberi Kerja (Recruiter)
- **Akses:** Dashboard pemberi kerja untuk mengelola perusahaan, posting lowongan, dan mengelola aplikasi

### 👤 Job Seeker Account (Pekerja)
- **Email:** pekerja@email.com
- **Username:** pekerja
- **Password:** Pekerja123!
- **Role:** Pekerja (Job Seeker)
- **Akses:** Dashboard pekerja untuk mencari pekerjaan, apply, dan mengelola aplikasi

---

## 📊 Data yang Tersedia di Database

✅ **3 test users** dengan role berbeda (admin, pemberi_kerja, pekerja)
✅ **30 companies** - Berbagai perusahaan dari berbagai industri
✅ **30 job listings** - Lowongan pekerjaan aktif dari berbagai posisi dan level
✅ **15 job applications** - Aplikasi pekerjaan dari job seeker ke berbagai posisi
✅ **10 wishlists** - Job seeker menyimpan lowongan favorit
✅ **10 notifications** - Notifikasi untuk berbagai aktivitas
✅ **6 blog posts** - Artikel blog yang sudah published dengan berbagai kategori:
   - Tips wawancara kerja
   - Cara membuat CV
   - Tren pekerjaan 2024
   - Work-life balance
   - Networking untuk karir
   - Newsletter Februari 2024

---

## 🎯 Cara Testing

1. **Login sebagai Admin:**
   - Buka aplikasi dan klik "Masuk"
   - Login dengan email `admin@pintuloker.com` dan password `Admin123!`
   - Akses dashboard admin untuk mengelola users, jobs, companies, blog posts, dll

2. **Login sebagai Pemberi Kerja:**
   - Logout dari admin
   - Login dengan email `employer@company.com` dan password `Employer123!`
   - Posting lowongan kerja baru
   - Lihat dan kelola aplikasi yang masuk
   - Kelola profil perusahaan

3. **Login sebagai Pekerja:**
   - Logout dari employer
   - Login dengan email `pekerja@email.com` dan password `Pekerja123!`
   - Browse lowongan pekerjaan
   - Apply ke pekerjaan
   - Kelola profil dan CV
   - Lihat status aplikasi

4. **Testing Blog:**
   - Klik menu "Blog" di navigation bar
   - Lihat 6 artikel yang sudah published
   - Sebagai admin, bisa create/edit/delete blog posts

---

## 🚀 Fitur yang Bisa Ditest

### Dashboard Admin
- User management (block/unblock users)
- Company verification
- Job approval/rejection
- Blog post management
- System settings
- Activity logs
- Analytics dan statistik

### Dashboard Pemberi Kerja
- Company profile management
- Post job listings
- Manage applications
- Review candidates
- Send messages to applicants
- Save candidates
- Job templates

### Dashboard Pekerja
- Browse jobs dengan filter
- Apply to jobs
- Quick apply dengan CV
- Wishlist jobs
- Profile management (bio, skills, education, experience)
- Job preferences untuk rekomendasi
- View application status
- Receive notifications

### Blog
- Read published articles
- Filter by category (Tips, Insight, Newsletter)
- Filter by tags
- Admin can create/edit/delete posts

---

## 📝 Notes

- Semua password menggunakan format yang aman dengan kombinasi huruf besar, kecil, angka, dan karakter khusus
- Database menggunakan PostgreSQL dengan Drizzle ORM
- Data bisa di-reset kapan saja dengan menjalankan `npm run seed` lagi
- Untuk menambah lebih banyak data, bisa modify seeders di folder `db/seeders/`

Selamat testing! 🎉
