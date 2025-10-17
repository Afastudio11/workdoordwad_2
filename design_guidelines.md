# Pintu Kerja - Design Guidelines (Minimalist Edition)

## Design Approach

**Selected Approach:** Reference-Based (Glassdoor-inspired minimalism)

**Rationale:** Glassdoor exemplifies content-first design with generous white space, minimal color usage, and straightforward functionality. Perfect for UMKM users who need simplicity without complexity. We'll adapt this for Indonesian market's mobile-first behavior while maintaining clean, distraction-free interfaces.

**Key Design Principles:**
1. **White Space is Content:** Breathing room enhances readability and reduces cognitive load
2. **Minimal Color Palette:** Let content speak, use color only for critical actions and status
3. **Content Hierarchy:** Clear visual structure through typography and spacing, not decoration
4. **Functional Simplicity:** Every element earns its place through utility

---

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- **Brand Blue:** 215 60% 50% (trust, professional - reserved for CTAs only)
- **Dark Text:** 220 15% 15% (primary content)

**Functional Colors:**
- **Success:** 145 50% 45% (applied, posted confirmations)
- **Alert:** 10 80% 55% (urgent, featured)
- **Neutral Scale:** 220 10% 25% (headings), 220 8% 45% (secondary text), 220 10% 65% (borders), 220 10% 98% (backgrounds)

**Minimalist Approach:** White (#FFFFFF) dominates 70% of surfaces. Color used sparingly for wayfinding and critical actions only.

### B. Typography

**Font Stack:**
```
Primary: 'Inter' (Google Fonts)
Fallback: system-ui, sans-serif
```

**Type Scale:**
- **H1:** text-3xl md:text-5xl, font-semibold, tracking-tight
- **H2:** text-2xl md:text-3xl, font-semibold
- **H3:** text-xl md:text-2xl, font-medium
- **Body Large:** text-lg, font-normal, leading-relaxed
- **Body:** text-base, font-normal, leading-relaxed
- **Small:** text-sm, leading-normal
- **Caption:** text-xs, uppercase, tracking-wide, text-gray-500

### C. Layout System

**Spacing Primitives:** 2, 4, 6, 8, 12, 16, 24 (generous, consistent)

**Containers:**
- Marketing: max-w-6xl mx-auto px-6 md:px-8
- Dashboard: max-w-7xl mx-auto px-6 md:px-12
- Forms: max-w-xl mx-auto

**Grid Patterns:**
- Job listings: Single column with dividers (mobile), 2-column (desktop)
- Stats: grid-cols-2 md:grid-cols-4 gap-8
- Filters: Top horizontal bar, not sidebar

### D. Component Library

**Cards:**
- **Job Card:** White bg, border-b border-gray-200 (list style), py-6 px-4
  - Company name (text-sm, gray-600, uppercase)
  - Job title (text-xl, font-medium, mt-1)
  - Location + Type (text-sm, gray-500, mt-2)
  - Salary (text-base, font-semibold, mt-3, if available)
  - Posted date (text-xs, gray-400, mt-4)
  - NO shadows, NO rounded corners on list items
  
- **Featured:** Subtle bg-blue-50 background, blue-500 text for "Featured" label

**Forms:**
- **Inputs:** border border-gray-300, rounded-md, px-4 py-3, focus:border-blue-500, focus:ring-1 focus:ring-blue-500
- **Labels:** text-sm, font-medium, text-gray-700, mb-2
- **Helper text:** text-xs, text-gray-500, mt-1

**Buttons:**
- **Primary:** bg-blue-600 text-white, rounded-md, px-6 py-3, font-medium, hover:bg-blue-700
- **Secondary:** border-2 border-gray-300 text-gray-700, rounded-md, hover:border-gray-400
- **Ghost:** text-blue-600 hover:text-blue-700, underline-offset-4 hover:underline
- **On Images:** bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-900 (no hover state specified)

**Navigation:**
- **Header:** White bg, border-b border-gray-200, py-4
- **Search Bar:** Prominent, rounded-md, border-gray-300, w-full max-w-2xl

**Status Badges:**
- Minimal: px-3 py-1, text-xs, font-medium, rounded-full
- Active: bg-green-50 text-green-700
- Closed: bg-gray-100 text-gray-600

### E. Interactions

**Minimal Animations:**
- Hover: Subtle text color change (100ms)
- Focus: Ring appearance (immediate)
- NO card lifts, NO transforms, NO slides

---

## Landing Page Structure

### 1. Hero Section (py-20 md:py-32)
- Clean headline: "Cari Kerja. Posting Lowongan. Sederhana."
- Subtitle: Supporting Indonesian SMBs and job seekers
- Large search bar: Location + Keyword combo
- Single primary CTA below search
- Background: Professional hero image (50% opacity overlay) showing diverse Indonesian professionals in modern, clean workspace
- Trust line: "15,000+ Lowongan Aktif" (text-sm, gray-600)

### 2. How It Works (py-24, bg-white)
- Two columns: Job Seekers | Recruiters
- 3 numbered steps each, text-only with generous line-height
- Minimal divider line between columns

### 3. Features Grid (py-24, bg-gray-50)
- 2x2 grid (md:grid-cols-2 gap-12)
- Icon (Heroicons, 32px) + Title + Description
- Quick Apply, Free Posting, Simple Dashboard, Mobile-First
- NO card containers, just content

### 4. For UMKM Section (py-24, bg-white)
- Left: Large text block about simplicity for small businesses
- Right: Clean dashboard preview image or stats
- "Gratis Selamanya untuk UMKM" highlight

### 5. Stats Bar (py-16, border-y border-gray-200)
- 4 columns: Jobs, Companies, Applications, Success Rate
- Large numbers (text-4xl, font-bold), small labels (text-sm, uppercase)
- Clean typography, no backgrounds

### 6. Testimonials (py-24, bg-gray-50)
- 3 cards with generous padding (p-8)
- Quote (text-lg, leading-relaxed)
- Name + Role (text-sm, gray-600)
- Minimal borders, white bg

### 7. Final CTA (py-24, bg-blue-600, text-white)
- Centered content, max-w-3xl
- Large heading + supporting text
- White button with blue text: "Mulai Gratis"

---

## Application Interface

### Job Search Page:
- **Top Filter Bar:** Horizontal, sticky, bg-white, shadow-sm
  - Dropdowns for Location, Industry, Type (inline, not sidebar)
  - Active filters shown as dismissible pills below
- **Job List:** Single column, border-b dividers
- **Pagination:** Simple numbered, centered

### Job Detail:
- **Single column layout** (max-w-4xl)
- Company header with logo, name, location
- Job title (text-3xl, font-semibold, mt-6)
- Quick facts bar: Type, Posted, Salary (border-y, py-4)
- Description with clear section headings
- Sticky bottom bar (mobile): Apply button
- Sticky right panel (desktop): Apply CTA + company info

### Recruiter Dashboard:
- **Top Stats:** 4 metrics, clean cards with borders
- **Job Table:** Minimal, sortable, with status indicators
- **"Post Job" button:** Top-right, primary blue

### Post Job Form:
- Single column, max-w-2xl
- Clear section dividers with headings
- Generous spacing between fields (space-y-6)
- Preview panel on desktop (sticky right)

---

## Images

**Hero Image:** High-quality photo showing 3-4 Indonesian professionals in bright, modern office - diverse roles (office worker with laptop, retail manager, warehouse supervisor). Natural lighting, minimal props. Image dims to 50% with white overlay gradient from bottom. Placement: Full-width background, centered.

**Dashboard Preview:** Clean screenshot of actual dashboard interface showing job listings table with minimal UI. Placement: Right column of UMKM section.

**All icons:** Heroicons via CDN (outline style for consistency with minimal aesthetic)

**No decorative images** - every image serves functional purpose of demonstrating platform or building trust.

---

**Responsive:** Mobile-first with bottom navigation, collapsible filters in sheet. Desktop expands to utilize white space without cluttering. Single-column content on mobile, strategic two-column on desktop (1024px+).