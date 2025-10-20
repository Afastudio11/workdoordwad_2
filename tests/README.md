# Pintu Kerja - E2E Testing Suite

## Deskripsi

Test suite End-to-End yang komprehensif untuk mensimulasikan siklus hidup lengkap pekerjaan di platform Pintu Kerja, mulai dari registrasi pengguna hingga penyelesaian lowongan.

## Siklus Test yang Diuji

### 1. **Registrasi Role**
- ✅ Registrasi Pekerja (Job Seeker)
- ✅ Registrasi Pemberi Kerja (Employer) dengan company
- ✅ Registrasi/Login Admin (Bootstrap)

### 2. **Monetisasi**
- ✅ Pemberi Kerja mem-posting lowongan baru
- ✅ Pembelian fitur "Boost Iklan" (Job Booster)
- ✅ Verifikasi payment dan perubahan status `is_premium`
- ✅ Aplikasi lowongan menjadi `isFeatured: true`

### 3. **Pencarian & Aplikasi**
- ✅ Pekerja mencari lowongan yang di-boost
- ✅ Verifikasi scoring (featured jobs muncul di atas)
- ✅ Pekerja upload CV (atau menggunakan CV yang sudah ada)
- ✅ Pekerja mengajukan lamaran via **Quick Apply**

### 4. **Notifikasi & ATS**
- ✅ Pemberi Kerja menerima **Notifikasi** lamaran baru di Header Bar
- ✅ Pemberi Kerja melihat aplikasi di **ATS Lite**
- ✅ Pemberi Kerja mengubah status lamaran (misalnya ke "Shortlisted")

### 5. **Sinkronisasi Pekerja**
- ✅ Pekerja menerima **Notifikasi** perubahan status di Header Bar
- ✅ Verifikasi real-time data flow antar-role
- ✅ Status aplikasi ter-sinkronisasi dengan benar

### 6. **Penyelesaian & Audit**
- ✅ Pemberi Kerja menutup lowongan (`isActive: false`)
- ✅ Admin login dan memverifikasi **Audit Trail**
- ✅ Verifikasi transaksi Boost dan status lowongan yang ditutup
- ✅ Verifikasi Activity Logs

### 7. **Security & Access Control**
- ✅ Verifikasi tidak ada hak akses (403 Forbidden) yang salah
- ✅ Pekerja tidak dapat akses admin endpoint
- ✅ Pemberi Kerja tidak dapat akses aplikasi worker langsung
- ✅ Pekerja tidak dapat akses employer dashboard

### 8. **Visual Branding**
- ✅ Verifikasi keberadaan Lime Green (#d4ff00) branding
- ✅ Identifikasi dashboard endpoints untuk setiap role

## Cara Menjalankan Test

### Persiapan

1. Pastikan aplikasi berjalan di `http://localhost:5000`:
```bash
npm run dev
```

2. Pastikan database sudah di-setup:
```bash
npm run db:push
```

### Menjalankan Test

```bash
# Jalankan E2E test
npm run test:e2e

# Atau jalankan langsung dengan tsx
npx tsx tests/e2e-lifecycle.test.ts
```

### Menjalankan dengan Custom URL

```bash
BASE_URL=http://your-domain.com npx tsx tests/e2e-lifecycle.test.ts
```

## Assertion yang Digunakan

Setiap langkah test menggunakan **strict assertions** untuk memvalidasi:

- **Status Code HTTP**: Memastikan response code yang benar (201, 200, 403, dll)
- **Data Structure**: Memverifikasi keberadaan field yang diperlukan
- **Data Integrity**: Memastikan data sesuai dengan yang dikirim
- **Role Permissions**: Memverifikasi access control yang tepat
- **State Synchronization**: Memastikan perubahan status tersinkronisasi antar-role
- **Business Logic**: Memverifikasi workflow bisnis berjalan dengan benar

## Output Test

Test akan menampilkan output yang detail untuk setiap langkah:

```
╔════════════════════════════════════════════════════════════════╗
║   PINTU KERJA - E2E TESTING SUITE                             ║
║   Siklus Hidup Lengkap: Registrasi → Boost → Apply → Close   ║
╚════════════════════════════════════════════════════════════════╝

==== TEST 1: REGISTRASI PEKERJA ====

✓ Pekerja berhasil registrasi
  Details: {
    id: '...',
    username: 'test_worker_...',
    role: 'pekerja'
  }

...

╔════════════════════════════════════════════════════════════════╗
║                    TEST SUMMARY                                ║
╚════════════════════════════════════════════════════════════════╝

Total Tests: 17
✓ Passed: 17
✗ Failed: 0
```

## Test Coverage

Test ini mencakup **17 skenario** yang berbeda:

1. Registrasi Pekerja
2. Registrasi Pemberi Kerja
3. Registrasi/Login Admin
4. Pemberi Kerja Posting Lowongan
5. Pembelian Paket Boost
6. Boost Lowongan
7. Pekerja Mencari Lowongan Boosted
8. Pekerja Upload CV
9. Pekerja Quick Apply
10. Pemberi Kerja Menerima Notifikasi
11. Pemberi Kerja Melihat Aplikasi di ATS
12. Pemberi Kerja Mengubah Status Aplikasi
13. Pekerja Menerima Notifikasi Status
14. Pemberi Kerja Menutup Lowongan
15. Admin Verifikasi Audit Trail
16. Verifikasi Access Control (403)
17. Verifikasi Lime Green Branding

## Troubleshooting

### Test Gagal: "Connection Refused"
- Pastikan aplikasi berjalan di port 5000
- Jalankan `npm run dev` terlebih dahulu

### Test Gagal: "Database Error"
- Pastikan database sudah di-setup dengan `npm run db:push`
- Cek koneksi database di `.env`

### Test Gagal: "Notification Not Found"
- Beberapa notifikasi bersifat asynchronous
- Test akan tetap lanjut meskipun notifikasi belum terdeteksi

### Test Gagal: "CV Upload Error"
- Test memiliki fallback untuk menggunakan mock CV
- Pastikan direktori `uploads/cv` ada dan writable

## Pengembangan Lebih Lanjut

Untuk menambah test case baru:

1. Tambahkan method test baru di class `E2ETestSuite`
2. Gunakan naming convention `testXX_DescriptiveName`
3. Tambahkan assertion menggunakan `assert` module
4. Gunakan `this.logStep()` untuk logging yang konsisten
5. Tambahkan test ke array `tests` di method `runAllTests()`

## Integrasi CI/CD

Test ini dapat diintegrasikan ke CI/CD pipeline:

```yaml
# .github/workflows/e2e-test.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run db:push
      - run: npm run dev &
      - run: sleep 10
      - run: npm run test:e2e
```

## Lisensi

Test suite ini adalah bagian dari Pintu Kerja platform.
