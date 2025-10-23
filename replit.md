# Pintu Kerja - Job Portal Platform

## Overview
Pintu Kerja is a freemium job classifieds platform designed for UMKM (small-medium businesses) and blue/grey collar job seekers in Indonesia. Its unique selling proposition lies in AI-powered job aggregation from social media (primarily Instagram) and a mobile-first, minimalist design inspired by Glassdoor. The platform's core mission is to provide "Rekrutmen Cepat, Tanpa Ribet, Terjangkau" (Fast, Simple, Affordable Recruitment). The project aims to streamline recruitment processes for businesses and simplify job searching for individuals, leveraging technology for efficiency and accessibility.

## Recent Changes

### Database Seeding - 4 Employer Accounts by Subscription Plan (October 23, 2025)
**Successfully created 4 employer test accounts with different subscription plans:**

**Accounts Created:**
1. **Free Plan** - free@company.com
   - Name: Ahmad Fauzi, HRD Manager
   - Company: CV Maju Sejahtera
   - Features: 3 free job slots, no verified badge

2. **Starter Monthly** - starter.monthly@company.com
   - Name: Dewi Lestari, Talent Acquisition Lead
   - Company: PT Digital Sukses
   - Plan: Rp 199,000/month (30 days active)
   - Features: 20 job slots, verified badge

3. **Starter Yearly** - starter.yearly@company.com
   - Name: Rizki Pratama, CEO
   - Companies: Startup Inovasi Indonesia + CV Kreatif Digital Yogya
   - Plan: Rp 1,990,000/year (365 days active, save Rp 398,000)
   - Features: 20 job slots, verified badge

4. **Professional Yearly** - professional@company.com
   - Name: Andi Wijaya, HR Director
   - Companies: PT Perusahaan Besar Indonesia + PT Teknologi Masa Depan + PT Bank Digital Indonesia
   - Plan: Rp 3,990,000/year (365 days active, save Rp 798,000)
   - Features: 100 job slots, verified badge, priority support, featured jobs

**Files Updated:**
- `db/seeders/01-users.seed.ts` - Added 4 employer accounts with subscription details
- `db/seeders/02-companies.seed.ts` - Assigned companies to each employer
- `AKUN_EMPLOYER.md` - Complete documentation of all employer accounts
- `SEEDING.md` - Updated with new employer accounts

**Database Status:**
- ✅ 7 test accounts (1 admin, 5 employers, 1 job seeker)
- ✅ 37 companies total
- ✅ 90 job listings
- ✅ All employers have proper subscription plan configuration

## Previous Updates

### Pricing Plans Update & Migration Completed (October 23, 2025)
**Successfully migrated from Replit Agent to Replit environment:**

**Completed:**
- ✅ All packages installed (Node.js 20, dependencies)
- ✅ Workflow configured and running on port 5000
- ✅ Database schema pushed successfully
- ✅ Application running without errors
- ✅ Fixed file upload error: Changed `require('fs')` to ESM import `unlinkSync` from 'fs'
- ✅ Added X button to cancel selected files in employer registration upload form
- ✅ Created upload directories for logos and legal documents

**Pricing Plans Enhancement:**
- ✅ **Added Yearly Billing Option**: All plans now have monthly and yearly pricing
  - Yearly plans save 2 months (10 months price for 12 months service)
  - Starter: Rp 199,000/month or Rp 1,990,000/year
  - Professional: Rp 399,000/month or Rp 3,990,000/year
- ✅ **Verified Badge Feature**: Starter and Professional plans now include verified badge (blue checkmark)
  - Similar to Instagram/Twitter verification badge
  - Shows trust and authenticity for premium users
  - Icon displayed next to company name in pricing cards
- ✅ **Billing Cycle Toggle**: User-friendly toggle to switch between monthly and yearly plans
- ✅ **Updated Features List**: All plans now clearly show verified badge as a feature

**Pending:**
- ⏳ **Email Verification System**: UI exists but email sending not implemented yet
  - User declined Resend integration setup
  - Future: Need RESEND_API_KEY secret to enable email verification
  - Location: `client/src/pages/RegisterJobSeekerPage.tsx`, `client/src/pages/RegisterEmployerPage.tsx`

## Recent Changes

### Database Seeding System (October 22, 2025)
**Comprehensive database seeding system implemented** for testing and development:

**Features:**
- **3 Permanent Test Accounts**: Admin, Employer, and Job Seeker with consistent credentials
- **30 Diverse Companies**: From startups to corporations across 20+ industries
- **90 Job Listings**: Realistic positions with varied locations, types, salaries, and levels
- **Sample Data**: 15 applications, 10 wishlists, 10 notifications for testing user journeys

**Files Created:**
- `db/seeders/01-users.seed.ts` - Test user accounts
- `db/seeders/02-companies.seed.ts` - Company data
- `db/seeders/03-jobs.seed.ts` - Job listings
- `db/seeders/04-applications.seed.ts` - Job applications
- `db/seeders/05-wishlists.seed.ts` - Saved jobs
- `db/seeders/06-notifications.seed.ts` - User notifications
- `db/seeders/index.ts` - Main orchestrator
- `SEEDING.md` - Complete documentation

**Usage:**
- `npm run seed` - Run all seeders
- `npm run seed:users` - Users only
- `npm run seed:companies` - Companies only
- `npm run seed:jobs` - Jobs only

**Test Credentials:**
- Admin: admin@pintuloker.com / Admin123!
- Employer: employer@company.com / Employer123!
- Job Seeker: pekerja@email.com / Pekerja123!

**Key Features:**
- Idempotent (safe to run multiple times)
- Realistic data distribution
- Follows database schema constraints
- See `SEEDING.md` for complete guide

### Security Hardening (October 22, 2025)
**Comprehensive security audit and fixes implemented** - 15/16 vulnerabilities addressed:

**CRITICAL Fixes:**
- **SESSION_SECRET Enforcement**: Application crashes on startup if not set, prevents session hijacking
- **SQL Injection Prevention**: Comprehensive Zod validation schemas for all user inputs
- **Authorization Controls**: Ownership verification for application updates, role-based restrictions
- **CSRF Protection Infrastructure**: Token generation utilities ready (pending client-side integration)

**HIGH Priority Fixes:**
- **Rate Limiting**: Multi-tier protection (5 req/15min for auth, 100 req/min for API)
- **Error Sanitization**: Production mode hides stack traces and sensitive data
- **Cookie Security**: Upgraded sameSite to "strict" for enhanced CSRF protection

**MEDIUM Priority Fixes:**
- **XSS Protection**: DOMPurify sanitization for all user-generated content (jobs, messages, notes, profiles)
- **Admin Bootstrap Security**: Token-based authentication for first admin creation (requires ADMIN_BOOTSTRAP_TOKEN)
- **View Count Protection**: Session-based tracking with 1-minute cooldown to prevent inflation

**LOW Priority Fixes:**
- **Strong Password Policy**: 8+ chars with uppercase, lowercase, numbers, special characters

**New Files Created:**
- `server/sanitize.ts` - XSS protection utilities with DOMPurify
- `server/csrf.ts` - CSRF token generation and validation
- `.local/state/replit/agent/progress_tracker.md` - Security implementation tracking

**Environment Variables Required:**
- `SESSION_SECRET` (REQUIRED) - Cryptographically secure session encryption key
- `ADMIN_BOOTSTRAP_TOKEN` (RECOMMENDED) - Required for creating first admin account

### E2E Testing Framework (October 21, 2025)

### E2E Testing Framework Implementation
- **Implemented comprehensive Playwright testing framework** with 8 test suites covering:
  - Job seeker user journeys (Fresh Graduate, Experienced Professional, Job Hopper)
  - Employer workflows (Startup, Corporate, SME) including 3 free job slots and subscription flow
  - Cross-user interactions and real-time notifications
  - Performance testing (100+ jobs, concurrent users, slow network simulation)
  - Security testing (SQL injection, XSS, file upload, rate limiting, CSRF)
  - Edge cases and error handling
- **Created test helpers** for authentication, job operations, and profile management
- **Added test scripts** to package.json: `npm test`, `npm run test:ui`, `npm run test:headed`
- **Created test data generation**: `npm run generate:test-data`
- **Documentation**: See `TESTING.md` for complete testing guide

### Database & Content Synchronization Fixes
- **Fixed blog data inconsistency**: Seeded database with 3 published blog posts to match landing page articles
- **Updated AIInnovationSection**: Changed from hardcoded articles to fetch from `/api/blog` endpoint
- **Fixed popular categories**: Now conditionally displays based on actual trending jobs data from API
- **Updated Footer navigation**: Fixed broken link `/jobs` → `/find-job`, added proper privacy/terms page routes
- **Fixed authentication pages**: Updated "Lupa kata sandi?" to route to contact page, "Ketentuan Layanan" to terms page

### Previous Updates
- Added 400 sample jobs (200 from AI sources, 200 from direct company postings)
- Created Admin Jobs Management page (`/admin/jobs`) for viewing all jobs
- Added source filtering to distinguish AI-generated vs company-posted jobs
- Implemented trending jobs algorithm with popularity scoring
- Enhanced view count tracking and analytics
- Updated storage layer to support source, isActive, and isFeatured filters
- Fixed pagination: Changed from 9 to 21 jobs per page with server-side pagination
- Implemented smart pagination UI with ellipsis for large page counts
- Fixed filter mapping: Indonesian labels (Waktu Penuh, Paruh Waktu, etc) now correctly map to database values (full-time, part-time, contract, freelance)
- Added auto-reset to page 1 when filters change
- Fixed job type display bug: JobCard now correctly shows "Kontrak", "Freelance", etc based on actual job type
- Optimized layout: Reduced filter sidebar width from col-span-3 to col-span-2 for better focus on job listings

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for development and bundling. Wouter handles client-side routing, and TanStack Query manages server state and caching. The UI adheres to a "New York" style variant, inspired by Glassdoor, utilizing Shadcn/ui (built on Radix UI primitives) and Tailwind CSS for a minimalist, mobile-first design. The color palette emphasizes white space with minimal color usage, defaulting to dark mode with an HSL-based color system. Components are organized into pages, reusable sections, and atomic UI elements, with path aliases for `@/` and `@shared/`.

### Backend Architecture
The backend is an Express.js application written in TypeScript, using an ESM module system. It provides RESTful API endpoints under the `/api` prefix, handling job listings, user management, and application processes. Custom middleware is used for logging and error handling, and `tsx` facilitates hot-reloading during development.

### Data Storage
PostgreSQL, hosted via Neon serverless, serves as the primary database, utilizing `pg Pool` for connection pooling. Drizzle ORM ensures type-safe database queries and migrations, with schemas defined first and TypeScript types generated. Zod integration is used for runtime validation. Key tables include `Users` (with role-based access), `Companies`, and `Jobs` (including details like salary range, source tracking, and active status). Queries support filtering, joining, pagination, and ordering.

### Authentication & Authorization
The system supports role-based access (`job_seeker`, `recruiter`, `admin`). While user creation and retrieval are implemented, active authentication middleware is planned to be session-based using `express-session` and `connect-pg-simple` for PostgreSQL session storage, with role-based authorization governing feature access.

### AI Integration (Planned)
Future plans include AI integration for aggregating job listings from social media platforms like Instagram. This involves data scraping, NLP processing for classification and entity extraction (position, company, location), and human verification before publication. The database schema already includes fields for source tracking (`source`, `sourceUrl`).

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting.
- **Replit Platform**: Development environment.

### UI Component Libraries
- **Radix UI**: Accessible primitive components.
- **Shadcn/ui**: Pre-built component patterns.
- **Lucide React**: Icon library.

### Data & State Management
- **Drizzle ORM**: Type-safe database queries and migrations.
- **TanStack Query**: Server state management and API caching.
- **React Hook Form**: Form state management with Zod validation.

### Utilities & Tools
- **date-fns**: Date manipulation and formatting.
- **clsx & tailwind-merge**: Conditional className composition.
- **class-variance-authority**: Variant-based component styling.
- **cmdk**: Command menu/palette component.
- **nanoid**: Unique ID generation.

### Development Tools
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **ESBuild**: Production build bundling.
- **Tailwind CSS**: Utility-first styling.
- **Playwright**: End-to-end testing framework.

### Testing Infrastructure
- **Playwright E2E Tests**: Comprehensive automated testing covering all user journeys
- **Test Coverage**: Job seekers, employers, cross-user interactions, performance, security, edge cases
- **Test Helpers**: Reusable utilities for authentication, job operations, and profile management
- **Test Data**: Pre-configured test users and automated test file generation
- **CI/CD Ready**: Tests can run in continuous integration pipelines

### Fonts & Assets
- **Google Fonts (Inter)**: Primary typeface.