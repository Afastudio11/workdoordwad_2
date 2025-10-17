# Pintu Kerja - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material-inspired) with localized Indonesian market considerations

**Rationale:** Job portals prioritize functionality, information density, and user trust. We'll use Material Design principles adapted for Indonesian users, focusing on clarity, accessibility across devices (important for mobile-heavy Indonesian market), and efficient workflows.

**Key Design Principles:**
1. **Clarity First:** Every element serves a clear purpose in the job search/posting journey
2. **Mobile-Primary:** Design for mobile users first (Indonesia's mobile-first market)
3. **Trust & Credibility:** Professional appearance to build confidence in job listings
4. **Speed & Efficiency:** Minimize clicks and cognitive load for both recruiters and job seekers

---

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- **Brand Blue:** 210 85% 45% (trustworthy, professional - similar to LinkedIn/Indeed)
- **Dark Blue:** 210 90% 25% (headers, important CTAs)

**Secondary/Accent Colors:**
- **Success Green:** 145 65% 45% (job posted, application sent confirmations)
- **Warning Orange:** 25 90% 55% (featured/boosted jobs, urgent actions)
- **Neutral Gray Scale:** 220 10% 20% (text), 220 10% 50% (secondary text), 220 15% 95% (backgrounds)

**Dark Mode (Optional future enhancement):**
- Background: 220 15% 12%
- Surface: 220 12% 18%
- Inverted primary: 210 80% 60%

### B. Typography

**Font Stack:**
```
Primary: 'Inter' (Google Fonts) - clean, highly legible for Indonesian and English
Fallback: system-ui, -apple-system, sans-serif
```

**Type Scale:**
- **Headings (H1):** text-4xl md:text-5xl, font-bold (landing hero)
- **Headings (H2):** text-3xl md:text-4xl, font-bold (section headers)
- **Headings (H3):** text-xl md:text-2xl, font-semibold (job titles, card headers)
- **Body Large:** text-lg, font-normal (introductions, descriptions)
- **Body:** text-base, font-normal (main content, job details)
- **Body Small:** text-sm, font-normal (metadata, timestamps, locations)
- **Caption:** text-xs, font-medium (tags, labels, helper text)

### C. Layout System

**Spacing Primitives (Tailwind units):**
- **Micro spacing:** 1, 2 (tight elements, badges)
- **Component spacing:** 4, 6 (internal card padding, button padding)
- **Section spacing:** 8, 12, 16 (between components, cards)
- **Page spacing:** 20, 24, 32 (section padding, major divisions)

**Container Strategy:**
- Marketing pages: max-w-7xl mx-auto px-4 md:px-6
- App dashboard: max-w-screen-2xl mx-auto px-4 md:px-8
- Job listings grid: max-w-6xl mx-auto
- Forms: max-w-2xl mx-auto

**Grid Patterns:**
- Job cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Dashboard stats: grid-cols-2 md:grid-cols-4 gap-4
- Search filters: Sidebar (w-64) + Main content (flex-1)

### D. Component Library

**Navigation:**
- **Top Nav:** Sticky header with logo left, search center (desktop), auth/profile right
- **Mobile Nav:** Hamburger menu, bottom tab bar for app sections
- **Breadcrumbs:** For job details and nested pages

**Cards & Listings:**
- **Job Card:** White background, rounded-lg, shadow-sm with hover:shadow-md transition
  - Company logo (40x40)
  - Job title (H3)
  - Company name + location (secondary text)
  - Salary range (if available, highlighted)
  - Posted time (text-xs, text-gray-500)
  - Tags for job type (Full-time, Remote, etc.)
  - Quick apply button (primary or outline)
  
- **Featured Job Card:** Border-2 border-orange-400 with "Featured" badge

**Forms:**
- **Input Fields:** Rounded-lg, border-gray-300, focus:border-primary, focus:ring-2 focus:ring-primary/20
- **Select Dropdowns:** Match input styling
- **Textareas:** Min height 120px for job descriptions
- **File Upload:** Dashed border box with icon, max 5MB indicator

**Buttons:**
- **Primary:** bg-primary text-white, rounded-lg, px-6 py-3, hover:bg-primary-dark
- **Secondary:** bg-white text-primary border-2 border-primary, rounded-lg
- **Outline on Images:** bg-white/10 backdrop-blur-md text-white border border-white/30
- **Ghost/Text:** text-primary hover:bg-primary/10
- **Sizes:** sm (px-4 py-2 text-sm), md (px-6 py-3), lg (px-8 py-4 text-lg)

**Data Display:**
- **Stats Cards:** Gradient backgrounds (subtle), large numbers, descriptive labels
- **Status Badges:** Rounded-full, px-3 py-1, text-xs, colored by status
  - Active: bg-green-100 text-green-800
  - Closed: bg-gray-100 text-gray-800
  - Under Review: bg-orange-100 text-orange-800

**Search & Filters:**
- **Search Bar:** Large, prominent with icon, rounded-full on landing, rounded-lg in app
- **Filter Panel:** Collapsible on mobile, sticky sidebar on desktop
- **Active Filters:** Pills with X to remove, count indicator

**Overlays:**
- **Modals:** max-w-2xl, rounded-xl, shadow-2xl, backdrop blur
- **Dropdowns:** rounded-lg, shadow-lg, border
- **Toasts:** Fixed top-right, slide-in animation, auto-dismiss

### E. Animations & Interactions

**Minimal, Purposeful Animations:**
- Card hover: transform scale(1.02), shadow elevation (150ms ease)
- Button hover: slight darkening (100ms)
- Page transitions: Fade-in content (200ms)
- Loading states: Skeleton screens (not spinners)
- Filter application: Smooth list re-ordering (300ms)

**NO:**
- Parallax effects
- Auto-playing carousels
- Excessive micro-interactions

---

## Marketing Landing Page Design

### Structure (5-7 Sections):

1. **Hero Section** (h-[600px] md:h-[700px])
   - Large bold headline: "Cari Kerja Lebih Cepat, Posting Lowongan Lebih Mudah"
   - Subheading about AI aggregation from Instagram
   - Prominent search bar (location + keyword)
   - Background: Large hero image showing diverse Indonesian workers (modern office, warehouse, retail - representing target audience)
   - Dual CTAs: "Cari Lowongan" (primary) + "Posting Lowongan Gratis" (outline with backdrop blur)
   - Trust indicator: "50,000+ Lowongan Aktif" (small text below)

2. **Features Grid** (py-20, 2x2 grid on desktop)
   - Icon + Title + Description for each:
     - Quick Apply (clock icon)
     - AI Social Media Aggregation (robot/sparkles icon)
     - Free Job Posting (rupiah icon with slash)
     - Multi-Platform Support (device icons)

3. **How It Works** (py-24, bg-gray-50)
   - For Job Seekers: 3 steps with numbers (Search → Apply → Track)
   - For Recruiters: 3 steps (Post → Review Applications → Hire)
   - Visual flow with arrows

4. **AI Innovation Section** (py-20)
   - Highlight Instagram aggregation feature
   - "Lowongan dari Instagram, Langsung di Dashboard Anda"
   - Mockup/illustration of AI processing
   - Trust badge: "Verified by Human Editors"

5. **Stats Section** (py-16, gradient bg from primary to primary-dark)
   - 4-column grid: Jobs Posted, Active Users, Companies, Avg. Time to Hire
   - Large numbers, white text

6. **Testimonials/Social Proof** (py-20)
   - 3-column grid of testimonial cards
   - Profile pic + quote + name + company
   - Mix of recruiter and job seeker testimonials

7. **CTA Section** (py-24, bg-primary text-white)
   - Final push with benefit summary
   - Large button: "Mulai Sekarang - Gratis"
   - Secondary link: "Pelajari Lebih Lanjut"

### Images:
- **Hero Image:** Professional photo of diverse Indonesian workers (30% office workers, 40% service industry, 30% skilled trades) - optimistic, modern feel. Position: background with overlay gradient from transparent to primary-dark/40
- **Feature Icons:** Use Heroicons via CDN
- **How It Works:** Simple illustrated steps or icons with connecting lines
- **AI Section:** Dashboard mockup or abstract tech illustration
- **Testimonials:** Profile photos (placeholder circles with gradients if real photos unavailable)

---

## Application Interface Design

### Dashboard (Recruiter):
- **Top Stats Bar:** 4 metrics (Active Jobs, Total Applications, Views, Response Rate)
- **Job Management Table:** Sortable columns, inline actions
- **Quick Actions Panel:** "Post New Job" prominent button, recent activity feed

### Dashboard (Job Seeker):
- **Applied Jobs List:** Card view with status indicators
- **Recommended Jobs:** Based on profile (if built)
- **Profile Completion Widget:** Progress bar with steps

### Job Search/Browse:
- **Left Sidebar Filters** (desktop): Sticky position
  - Location (dropdown with autocomplete)
  - Industry/Category (checkboxes)
  - Job Type (Full-time, Part-time, Contract)
  - Salary Range (slider)
  - Date Posted (radio buttons)
  - "Clear All" link at bottom
  
- **Main Content Area:**
  - Search bar at top
  - Sort dropdown (Latest, Salary, Relevance)
  - Job cards grid
  - Infinite scroll or pagination

### Job Detail Page:
- **Left Column (8/12):** Full job description, requirements, benefits
- **Right Sidebar (4/12):** Sticky apply panel
  - Company info card
  - "Quick Apply" button
  - Share button
  - Save for later
  - Report listing

---

## Responsive Breakpoints
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full layouts, sidebars)

**Mobile Optimizations:**
- Collapsible filters in bottom sheet
- Simplified cards (vertical layout)
- Fixed bottom CTA for job details
- Swipe gestures for navigation