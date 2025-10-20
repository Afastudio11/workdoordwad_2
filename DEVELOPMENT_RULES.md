# ATURAN PENGEMBANGAN KETAT - PINTU KERJA

## ⚠️ MANDATORY RULES - WAJIB DITAATI

### 1. ISOLASI KOMPONEN BERDASARKAN ROLE

#### Rule #1: Layout Separation (KODE KERAS)
**SETIAP ROLE HARUS MENGGUNAKAN LAYOUT YANG TERPISAH DAN TIDAK BOLEH DIPERTUKARKAN**

```typescript
// ✅ BENAR - Admin Page
import AdminLayout from "@/components/AdminLayout";

export default function AdminBlogManagerPage() {
  return (
    <AdminLayout>
      {/* Admin content */}
    </AdminLayout>
  );
}

// ❌ SALAH - Admin Page menggunakan DashboardHeader
import DashboardHeader from "@/components/DashboardHeader";  // FATAL ERROR!

export default function AdminBlogManagerPage() {
  return (
    <div>
      <DashboardHeader />  {/* INI SALAH! */}
    </div>
  );
}
```

#### Rule #2: Component-Role Mapping (WAJIB)

| Role | Layout Component | Header Component | Allowed Pages |
|------|-----------------|------------------|---------------|
| **Admin** | `AdminLayout` | Built-in AdminLayout Header/Sidebar | `/admin/*` only |
| **Worker (Pekerja)** | N/A (uses DashboardHeader directly) | `DashboardHeader` | `/user/dashboard`, `/community` |
| **Employer (Pemberi Kerja)** | N/A (uses EmployerDashboardHeader directly) | `EmployerDashboardHeader` | `/employer/*`, `/find-candidate`, `/hiring` |
| **Public** | N/A | `Header` or `DynamicHeader` | `/`, `/blog`, `/contact`, `/faq` |

#### Rule #3: File Location Rules

```
client/src/pages/
├── Admin*.tsx              → MUST use AdminLayout
├── employer/               → MUST use EmployerDashboardHeader or part of EmployerDashboardPage
│   └── *.tsx              → Employer-only components
├── dashboard/              → MUST be part of UserDashboardPage (Worker)
│   └── *.tsx              → Worker-only components
└── *.tsx                   → Public or uses DynamicHeader
```

### 2. VALIDASI ROLE DI SETIAP HALAMAN ADMIN

#### Rule #4: AdminLayout WAJIB Memiliki Role Check
`AdminLayout` component sudah memiliki validasi role built-in:

```typescript
// client/src/components/AdminLayout.tsx
const DEV_MODE = import.meta.env.VITE_DEV_BYPASS_AUTH === "true" || import.meta.env.MODE === "development";
const hasAccess = DEV_MODE || (user && user.role === 'admin');

if (!hasAccess) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1>Akses Ditolak</h1>
        <p>Anda tidak memiliki akses ke halaman admin</p>
      </div>
    </div>
  );
}
```

#### Rule #5: Backend Route Protection
SEMUA route `/api/admin/*` HARUS menggunakan `requireAdmin` middleware:

```typescript
// server/routes.ts
app.get("/api/admin/blog", requireAdmin, async (req, res) => {
  // Admin-only logic
});

app.post("/api/admin/blog", requireAdmin, async (req, res) => {
  // Admin-only logic
});
```

### 3. ENFORCEMENT CHECKLIST

Sebelum membuat atau memodifikasi halaman, WAJIB cek:

#### ✅ Untuk Halaman Admin Baru:
- [ ] File dibuat di `client/src/pages/Admin*.tsx`
- [ ] Import `AdminLayout` dari `@/components/AdminLayout`
- [ ] Wrap semua content dengan `<AdminLayout>`
- [ ] Route ditambahkan di `App.tsx` dengan path `/admin/*`
- [ ] API endpoint menggunakan `requireAdmin` middleware
- [ ] Testing: Login sebagai non-admin, harus ditolak

#### ✅ Untuk Halaman Worker Baru:
- [ ] Jika standalone: Import `DashboardHeader`
- [ ] Jika sub-page: Tambahkan di `UserDashboardPage.tsx`
- [ ] TIDAK BOLEH import komponen dari `Admin*`
- [ ] TIDAK BOLEH akses route `/api/admin/*`

#### ✅ Untuk Halaman Employer Baru:
- [ ] Import `EmployerDashboardHeader`
- [ ] Atau tambahkan di `EmployerDashboardPage.tsx`
- [ ] TIDAK BOLEH import komponen dari `Admin*`
- [ ] TIDAK BOLEH akses route `/api/admin/*`

### 4. FORBIDDEN PATTERNS (DILARANG KERAS)

#### ❌ SALAH #1: Admin Page dengan Worker Header
```typescript
// client/src/pages/AdminBlogManagerPage.tsx
import DashboardHeader from "@/components/DashboardHeader";  // FATAL ERROR!

export default function AdminBlogManagerPage() {
  return (
    <div>
      <DashboardHeader />  {/* SALAH! */}
      {/* content */}
    </div>
  );
}
```

#### ❌ SALAH #2: Worker Page dengan Admin Features
```typescript
// client/src/pages/dashboard/SettingsPage.tsx
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const deleteAllUsers = async () => {
    await apiRequest("/api/admin/users", "DELETE");  // SALAH!
  };
  
  return <Button onClick={deleteAllUsers}>Delete All Users</Button>;
}
```

#### ❌ SALAH #3: DynamicHeader di Admin Page
```typescript
// client/src/pages/AdminAnalyticsPage.tsx
import DynamicHeader from "@/components/DynamicHeader";  // SALAH!

export default function AdminAnalyticsPage() {
  return (
    <div>
      <DynamicHeader />  {/* SALAH! Harus AdminLayout */}
    </div>
  );
}
```

### 5. VALIDATION RULES

#### Rule #6: Pre-Commit Validation
Sebelum commit, WAJIB cek:

```bash
# Check 1: Pastikan tidak ada Admin page yang import DashboardHeader
grep -r "DashboardHeader" client/src/pages/Admin*.tsx
# Output harus kosong

# Check 2: Pastikan tidak ada Admin page yang import DynamicHeader  
grep -r "DynamicHeader" client/src/pages/Admin*.tsx
# Output harus kosong

# Check 3: Pastikan semua Admin page import AdminLayout
grep -r "import.*AdminLayout" client/src/pages/Admin*.tsx
# Output harus ada untuk setiap Admin page
```

#### Rule #7: API Route Validation
```bash
# Check: Pastikan semua route /api/admin/* protected
grep -A 2 '"/api/admin/' server/routes.ts | grep -v requireAdmin
# Output harus kosong
```

### 6. MANDATORY HEADER COMMENTS (WAJIB)

#### Rule #10: File Header Documentation
**SETIAP file dashboard pages (Admin, Worker, Employer) WAJIB memiliki header comment** yang mendokumentasikan:

```typescript
/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/dashboard
 * - DO NOT import worker or employer components
 */
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
// ... rest of imports
```

**Contoh Header Comments untuk Setiap Role:**

**Admin Pages:**
```typescript
/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/[page-name]
 * - DO NOT import worker or employer components
 */
```

**Worker Pages:**
```typescript
/**
 * IMPORTANT: THIS IS A WORKER-ONLY PAGE
 * - MUST USE: DashboardHeader/DynamicHeader (NOT AdminLayout or EmployerDashboardHeader)
 * - ROLE REQUIRED: pekerja (worker/job seeker)
 * - ROUTE: /dashboard/[page-name] or /user/dashboard
 * - DO NOT import admin or employer components
 */
```

**Employer Pages:**
```typescript
/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/[page-name]
 * - DO NOT import admin or worker components
 */
```

**Shared Pages (Worker + Employer):**
```typescript
/**
 * IMPORTANT: THIS IS A SHARED PAGE (Worker + Employer)
 * - MUST USE: DynamicHeader (adapts based on user role)
 * - ROLE REQUIRED: pekerja OR pemberi_kerja
 * - ROUTE: /messages
 * - DO NOT import AdminLayout
 */
```

#### Rule #11: Dependency Analysis Before Implementation
**SEBELUM membuat atau memodifikasi halaman, WAJIB lakukan dependency analysis:**

**Step 1: Identify Required Components**
```bash
# Check what layout/header component should be used
# Based on file location and intended role

# Admin page? → AdminLayout
# Worker page? → DashboardHeader
# Employer page? → EmployerDashboardHeader
# Shared page? → DynamicHeader
```

**Step 2: Verify Import Compliance**
```typescript
// ✅ BENAR - Admin page only imports admin components
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";  // Shared UI OK

// ❌ SALAH - Admin page imports worker component
import AdminLayout from "@/components/AdminLayout";
import DashboardHeader from "@/components/DashboardHeader";  // FORBIDDEN!
```

**Step 3: Check for Cross-Role Contamination**
```bash
# Before committing, verify no cross-contamination
grep -r "import.*DashboardHeader" client/src/pages/Admin*.tsx
grep -r "import.*EmployerDashboardHeader" client/src/pages/Admin*.tsx
grep -r "import.*AdminLayout" client/src/pages/dashboard/*.tsx
grep -r "import.*AdminLayout" client/src/pages/employer/*.tsx

# All outputs should be empty
```

#### Rule #12: Pre-Development Validation Checklist
Sebelum menulis kode untuk halaman baru:

**For Admin Pages:**
- [ ] Filename starts with `Admin` (e.g., `AdminBlogManagerPage.tsx`)
- [ ] Located in `client/src/pages/` (root level)
- [ ] Header comment present and correct
- [ ] Imports ONLY `AdminLayout` (never `DashboardHeader` or `EmployerDashboardHeader`)
- [ ] Route registered in `App.tsx` as `/admin/*`

**For Worker Pages:**
- [ ] Located in `client/src/pages/dashboard/` OR is `UserDashboardPage.tsx`
- [ ] Header comment present and correct
- [ ] Imports ONLY `DashboardHeader` or `DynamicHeader`
- [ ] NO imports from admin or employer components
- [ ] Route registered for worker access only

**For Employer Pages:**
- [ ] Located in `client/src/pages/employer/` OR is `EmployerDashboardPage.tsx`
- [ ] Header comment present and correct
- [ ] Imports ONLY `EmployerDashboardHeader`
- [ ] NO imports from admin or worker components
- [ ] Route registered for employer access only

### 7. WARNA DAN IDENTITAS VISUAL

#### Rule #13: Header Colors by Role
- **Admin**: Dark sidebar dengan primary accent (#D4FF00)
- **Worker**: Dark header (#1a1a1a) dengan primary accent
- **Employer**: Dark header (#1a1a1a) dengan primary accent
- **Public**: Can be light or dark

TIDAK BOLEH mencampur warna header antar role!

### 8. NAVIGATION RULES

#### Rule #14: Menu Items by Role

**Admin Navigation (AdminLayout):**
- ✅ Ringkasan (Dashboard)
- ✅ Moderasi Konten
- ✅ Manajemen User
- ✅ Keuangan
- ✅ Sistem/Log
- ✅ Blog Manager (via /admin/blog)
- ✅ Content Pages (via /admin/content)
- ✅ Analytics (via /admin/analytics)

**Worker Navigation (DashboardHeader):**
- ✅ Dashboard
- ✅ My Applications
- ✅ Saved Jobs
- ✅ Profile
- ❌ TIDAK BOLEH: Blog Manager, User Management, Financial

**Employer Navigation (EmployerDashboardHeader):**
- ✅ Dashboard
- ✅ My Applications
- ✅ Cari Pekerjaan
- ✅ Cari Kandidat
- ✅ Profile
- ❌ TIDAK BOLEH: Blog Manager, User Management, Financial

### 9. DEPLOYMENT CHECKLIST

Sebelum deploy ke production:

- [ ] Run all validation checks (Rule #6, #7)
- [ ] Manual test: Login sebagai admin, pastikan admin pages accessible
- [ ] Manual test: Login sebagai worker, pastikan admin pages NOT accessible
- [ ] Manual test: Login sebagai employer, pastikan admin pages NOT accessible
- [ ] Check browser console untuk error
- [ ] Verify role-based routing works correctly

---

## RINGKASAN: 3 GOLDEN RULES

1. **ADMIN PAGES = AdminLayout ONLY**
   - File: `Admin*.tsx`
   - Import: `AdminLayout`
   - Route: `/admin/*`

2. **WORKER PAGES = DashboardHeader ONLY**
   - File: `dashboard/*.tsx` or uses `DashboardHeader`
   - No admin imports
   - No admin routes

3. **EMPLOYER PAGES = EmployerDashboardHeader ONLY**
   - File: `employer/*.tsx` or uses `EmployerDashboardHeader`
   - No admin imports
   - No admin routes

**VIOLATION = CRITICAL BUG** ❌
