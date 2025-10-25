# Pintu Kerja - Job Portal Platform

## Overview
Pintu Kerja is a freemium job classifieds platform for UMKM and blue/grey collar job seekers in Indonesia. It features AI-powered job aggregation from social media (primarily Instagram) and a mobile-first, minimalist design inspired by Glassdoor. The platform's mission is "Rekrutmen Cepat, Tanpa Ribet, Terjangkau" (Fast, Simple, Affordable Recruitment), aiming to streamline recruitment for businesses and simplify job searching for individuals.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses React 18, TypeScript, and Vite. Wouter handles routing, and TanStack Query manages server state. The UI follows a "New York" style variant inspired by Glassdoor, utilizing Shadcn/ui (Radix UI) and Tailwind CSS for a minimalist, mobile-first design. It features a dark mode by default with an HSL-based color system. Components are organized into pages, sections, and atomic UI elements with path aliases.

### Backend Architecture
The backend is an Express.js application in TypeScript, using an ESM module system. It provides RESTful API endpoints under `/api`, handling job listings, user management, and application processes. Custom middleware is used for logging and error handling, and `tsx` enables hot-reloading.

### Data Storage
PostgreSQL, hosted via Neon serverless, is the primary database, using `pg Pool` for connection pooling. Drizzle ORM ensures type-safe queries and migrations, with Zod for runtime validation. Key tables include `Users` (role-based), `Companies`, and `Jobs` (with salary, source, and active status). Queries support filtering, joining, pagination, and ordering.

### Authentication & Authorization
The system supports role-based access (`job_seeker`, `recruiter`, `admin`). Authentication is planned to be session-based using `express-session` and `connect-pg-simple`, with role-based authorization for feature access. Security hardening includes SESSION_SECRET enforcement, Zod validation for SQL injection prevention, ownership verification for authorization, CSRF protection infrastructure, rate limiting, error sanitization, and enhanced cookie security.

### AI Integration (Planned)
Future AI integration will aggregate job listings from social media (e.g., Instagram) through data scraping, NLP for classification and entity extraction, and human verification. The database includes fields for source tracking.

### UI/UX Decisions
The design emphasizes a minimalist, mobile-first approach with a "New York" style. The color palette focuses on white space with minimal color usage and defaults to dark mode. Pricing plans offer both monthly and yearly billing options, with yearly plans providing savings. Verified badges (blue checkmarks) are included for Starter and Professional plans, displayed next to company names. A user-friendly toggle switches between monthly and yearly billing cycles.

### Feature Specifications
- **Permanent Test Accounts**: 6 persistent test accounts across various roles and subscription tiers for comprehensive testing.
- **Database Seeding**: Comprehensive system for creating test data including users, companies, jobs, applications, wishlists, and notifications.
- **Pricing Plans**: Introduction of yearly billing options and a "Verified Badge" feature for premium plans.
- **Security Hardening**: Implementation of critical fixes like `SESSION_SECRET` enforcement, SQL injection prevention via Zod, robust authorization controls, CSRF protection, rate limiting, and secure cookie settings.
- **E2E Testing Framework**: Comprehensive Playwright testing framework covering job seeker and employer journeys, cross-user interactions, performance, security, and error handling.

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
- **DOMPurify**: XSS protection for user-generated content.

### Development Tools
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **ESBuild**: Production build bundling.
- **Tailwind CSS**: Utility-first styling.
- **Playwright**: End-to-end testing framework.

### Fonts & Assets
- **Google Fonts (Inter)**: Primary typeface.