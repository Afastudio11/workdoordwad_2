# Pintu Kerja - Job Portal Platform

## Overview

Pintu Kerja is a freemium job classifieds platform targeting UMKM (small-medium businesses) and blue/grey collar job seekers in Indonesia. The platform differentiates itself through AI-powered job aggregation from social media sources (primarily Instagram) and a mobile-first, minimalist design approach inspired by Glassdoor. The core value proposition is "Rekrutmen Cepat, Tanpa Ribet, Terjangkau" (Fast, Simple, Affordable Recruitment).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (October 18, 2025)

### Employer Dashboard Implementation
Implemented comprehensive employer (pemberi_kerja) dashboard with full recruitment workflow management:

**Dashboard Pages:**
1. **Overview (Ringkasan)**: Statistics dashboard showing total jobs, active jobs, new applicants this week, and total applicants
2. **Manage Jobs (Kelola Lowongan)**: Job posting management with create, edit, delete, and toggle active/inactive status
3. **Manage Applicants (Kelola Pelamar)**: ATS Lite (Applicant Tracking System) with application status workflow (submitted → reviewed → shortlisted → accepted/rejected)
4. **Company Profile (Profil Perusahaan)**: Company information management with editable fields (name, description, industry, location, website, contact details)

**Backend Implementation:**
- Storage methods: `getEmployerStats()`, `getEmployerApplications()`, `updateCompanyProfile()`
- API endpoints: `/api/employer/stats`, `/api/employer/applications`, `/api/employer/company`, `/api/employer/jobs`
- Application status management: `PUT /api/applications/:id/status` with workflow states
- Authentication checks on all employer endpoints (requires `req.session.userId`)

**Frontend Features:**
- Dedicated EmployerDashboardHeader with employer-specific navigation (Dashboard, Lowongan Saya, Pelamar, Perusahaan)
- Sidebar navigation matching worker dashboard UX pattern
- Consistent design: white background, black text, lime green (#D4FF00) for CTAs
- Search and filter functionality for jobs and applicants
- Real-time status updates with optimistic UI updates via TanStack Query
- Comprehensive data-testid attributes for E2E testing
- Indonesian language throughout (labels, messages, tips)
- Employer-specific notifications (pelamar baru, lowongan dipublikasikan)

**Recruitment Workflow:**
- Post new job → Review incoming applications → Update status → Hire candidates
- Status tracking: Baru (submitted) → Ditinjau (reviewed) → Shortlist → Diterima/Ditolak (accepted/rejected)
- Quick actions on overview page for common tasks

**Technical Stack:**
- React Query for state management and cache invalidation
- Wouter for nested routing within dashboard
- Shadcn/ui components (Card, Button, Select, Dropdown Menu, etc.)
- date-fns with Indonesian locale for relative timestamps
- TypeScript types shared between frontend and backend via `@shared/schema`

**Access Route:** `/employer/dashboard` (requires authentication with pemberi_kerja role)

### UI/UX Color Accessibility Improvements
Completed comprehensive audit and fixes for color contrast and readability issues throughout the application:

**Problems Addressed:**
- Eliminated all instances of lime green (#D4FF00) text on white/light backgrounds that caused readability issues
- Standardized header appearance across login and register pages to use dark variant (black background)
- Removed Sparkles icon from Recommendations page title for cleaner design

**Files Modified:**
- Login & Register pages: Changed header from light to dark variant for consistency
- DashboardHeader: Updated notification dropdown to use black text instead of lime green for "Tandai semua dibaca" and "Lihat semua notifikasi"
- NotificationsPage: Changed notification badge and icon colors from lime to gray
- QuickAccessPage: Updated all role icons and "Kembali ke Halaman Utama" link to use readable gray/black
- FAQPage: Changed help icon to gray
- CommunityPage: Updated avatar circles and like button colors to use gray when active
- RecommendationsPage: Removed Sparkles icon from page title

**Design Token Changes:**
- Replaced `text-primary` (lime green) with `text-gray-700` or `text-gray-900` on light backgrounds
- Replaced `bg-primary/10` with `bg-gray-100` for better contrast
- Used `font-semibold` to maintain visual hierarchy without relying on color

**Accessibility Impact:**
- Improved text contrast ratios across all pages
- Better readability for users with visual impairments
- Maintained brand color (#D4FF00) only for primary action buttons and highlights where appropriate

### Job Preferences Feature
Added comprehensive job preferences system allowing users to set their preferences for better job recommendations:
- **Industries**: Users can select from 8 predefined industries (Teknologi, Keuangan, Kesehatan, Pendidikan, Retail, Manufaktur, Pariwisata, Media)
- **Locations**: Users can select preferred job locations (Jakarta, Bandung, Surabaya, Yogyakarta, Bali, Semarang, Medan, Remote)
- **Job Types**: Users can select preferred employment types (Full Time, Part Time, Contract, Freelance)
- **Minimum Salary**: Users can set their expected minimum salary

**Implementation Details:**
- Preferences form located in Settings page (`/user/dashboard/settings`)
- Backend API endpoint: `PUT /api/profile/preferences`
- Recommendations endpoint uses these preferences to filter jobs
- All interactive elements have proper data-testid attributes for testing
- Code refactored to use shared utility functions (`client/src/lib/formatters.ts`) for salary formatting

**Code Quality Improvements:**
- Extracted duplicate `formatSalary` function into shared utility
- Added comprehensive test IDs across all dashboard pages
- Consistent UI/UX patterns following existing design system

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for server state management and API caching

**UI Design System:**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- "New York" style variant with minimalist Glassdoor-inspired aesthetic
- Dark mode by default with HSL-based color system
- Mobile-first responsive design approach

**Component Organization:**
- Page components in `client/src/pages/` (LandingPage, BrowseJobsPage, JobDetailPage)
- Reusable UI sections in `client/src/components/` (HeroSection, FeaturesSection, etc.)
- Atomic design with shadcn/ui primitives in `client/src/components/ui/`
- Path aliases configured: `@/` for client source, `@shared/` for shared code

**Design Principles:**
- Minimalist color palette (70% white space, minimal color usage)
- Content-first hierarchy with generous spacing
- Inter font family from Google Fonts
- Functional simplicity - every element earns its place

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system (type: "module")
- Custom middleware for request logging and error handling
- Development hot-reload with tsx

**API Design:**
- RESTful API endpoints under `/api` prefix
- Jobs API: GET `/api/jobs` (list with filters), GET `/api/jobs/:id` (detail)
- Query parameters for filtering: keyword, location, industry, jobType, pagination
- JSON response format with consistent error handling

**Data Layer Pattern:**
- Storage abstraction through `IStorage` interface
- `DbStorage` implementation using Drizzle ORM
- Separation of concerns: routes → storage → database

### Data Storage

**Database:**
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- WebSocket connection for serverless compatibility
- Connection pooling with pg Pool

**ORM & Schema:**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript types generated from Drizzle schemas
- Zod integration for runtime validation via drizzle-zod
- Migration management with drizzle-kit

**Database Schema:**

*Users Table:*
- UUID primary key with auto-generation
- Role-based system: job_seeker | recruiter | admin
- Authentication fields (username, password)
- Profile information (email, fullName, phone)

*Companies Table:*
- UUID primary key
- Company profile (name, description, industry, location)
- Contact information (website, email, phone)
- Foreign key to users (createdBy)

*Jobs Table:*
- UUID primary key
- Foreign key to companies (companyId)
- Job details (title, description, requirements, location)
- Filtering fields (jobType, industry, education, experience)
- Salary range (salaryMin, salaryMax)
- Boolean flags (isFeatured, isActive)
- Source tracking (source: direct | instagram | aggregated, sourceUrl)
- Timestamps (createdAt, updatedAt)

**Query Patterns:**
- Filter-based search with Drizzle's `ilike` for case-insensitive matching
- Join queries for job listings with company information
- Pagination support with limit/offset
- Ordering by featured status and creation date

### Authentication & Authorization

**Current State:**
- Schema supports role-based access (job_seeker, recruiter, admin)
- User creation and retrieval methods implemented in storage layer
- No active authentication middleware implemented yet

**Planned Architecture:**
- Session-based authentication anticipated (express-session infrastructure visible)
- connect-pg-simple for PostgreSQL session storage
- Role-based authorization for recruiter vs job seeker features

### AI Integration (Planned Feature)

**Purpose:**
- Aggregate job listings from social media (Instagram focus)
- Automated extraction of job information from unstructured posts

**Planned Workflow:**
1. Data scraping from Instagram posts
2. NLP processing to classify posts as job listings
3. Entity extraction (position, company, location, qualifications)
4. Human verification by editorial team before publication
5. Storage with source attribution (source, sourceUrl fields)

**Implementation Notes:**
- Schema prepared with source tracking fields
- AI-powered jobs marked with source: "instagram" or "aggregated"
- Manual verification workflow planned (isActive flag for editorial control)

## External Dependencies

### Core Infrastructure
- **Neon Database** - Serverless PostgreSQL hosting
- **Replit Platform** - Development environment with specific plugins for error overlay, cartographer, dev banner

### UI Component Libraries
- **Radix UI** - Accessible primitive components (20+ primitives including Dialog, Dropdown, Select, etc.)
- **Shadcn/ui** - Pre-built component patterns on top of Radix
- **Lucide React** - Icon library for UI elements

### Data & State Management
- **Drizzle ORM** - Type-safe database queries and migrations
- **TanStack Query** - Server state management, caching, and data fetching
- **React Hook Form** - Form state management (with @hookform/resolvers for Zod validation)

### Utilities & Tools
- **date-fns** - Date manipulation and formatting
- **clsx & tailwind-merge** - Conditional className composition
- **class-variance-authority** - Variant-based component styling
- **cmdk** - Command menu/palette component
- **nanoid** - Unique ID generation

### Development Tools
- **Vite** - Build tool and dev server with React plugin
- **TypeScript** - Type safety across full stack
- **ESBuild** - Production build bundling
- **Tailwind CSS** - Utility-first styling with PostCSS

### Fonts & Assets
- **Google Fonts (Inter)** - Primary typeface
- **Custom attached assets** - Generated images for hero sections

### Future Integrations (Planned)
- Payment gateway for freemium monetization (job boosting, featured listings)
- Social media scraping APIs (Instagram data collection)
- NLP services for job post classification and entity extraction