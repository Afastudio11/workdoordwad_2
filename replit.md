# Pintu Kerja - Job Portal Platform

## Overview
Pintu Kerja is a freemium job classifieds platform designed for UMKM (small-medium businesses) and blue/grey collar job seekers in Indonesia. Its unique selling proposition lies in AI-powered job aggregation from social media (primarily Instagram) and a mobile-first, minimalist design inspired by Glassdoor. The platform's core mission is to provide "Rekrutmen Cepat, Tanpa Ribet, Terjangkau" (Fast, Simple, Affordable Recruitment). The project aims to streamline recruitment processes for businesses and simplify job searching for individuals, leveraging technology for efficiency and accessibility.

## Recent Changes (October 21, 2025)
- Added 400 sample jobs (200 from AI sources, 200 from direct company postings)
- Created Admin Jobs Management page (`/admin/jobs`) for viewing all jobs
- Added source filtering to distinguish AI-generated vs company-posted jobs
- Implemented trending jobs algorithm with popularity scoring
- Enhanced view count tracking and analytics
- Updated storage layer to support source, isActive, and isFeatured filters

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

### Fonts & Assets
- **Google Fonts (Inter)**: Primary typeface.