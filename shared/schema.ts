import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("pekerja"), // pekerja | pemberi_kerja | admin
  
  // Profile fields
  bio: text("bio"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"), // male | female | other
  address: text("address"),
  city: text("city"),
  province: text("province"),
  photoUrl: text("photo_url"),
  
  // Fields untuk pekerja
  cvUrl: text("cv_url"),
  cvFileName: text("cv_file_name"),
  education: text("education"), // JSON array
  experience: text("experience"), // JSON array
  skills: text("skills").array(),
  
  // Pendidikan detail (untuk registrasi)
  lastEducation: text("last_education"), // SMA/SMK | D3 | S1 | S2 | S3
  major: text("major"),
  institution: text("institution"),
  graduationYear: text("graduation_year"),
  employmentStatus: text("employment_status"), // Belum Bekerja | Bekerja - Mencari Peluang Baru | Fresh Graduate
  yearsOfExperience: text("years_of_experience"), // 0 tahun | <1 tahun | 1-3 tahun | 3-5 tahun | >5 tahun
  
  // Job preferences untuk rekomendasi
  preferredIndustries: text("preferred_industries").array(),
  preferredLocations: text("preferred_locations").array(),
  preferredJobTypes: text("preferred_job_types").array(),
  expectedSalaryMin: integer("expected_salary_min"),
  
  // Registration tracking
  registrationStep: integer("registration_step").default(0),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  
  // Fields untuk pemberi_kerja
  isVerified: boolean("is_verified").default(false),
  
  // Admin fields
  isActive: boolean("is_active").default(true).notNull(),
  blockedUntil: timestamp("blocked_until"),
  blockedReason: text("blocked_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry"),
  location: text("location"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  whatsappNumber: text("whatsapp_number"),
  logo: text("logo"),
  legalDocUrl: text("legal_doc_url"),
  employeeCount: text("employee_count"),
  foundedYear: text("founded_year"),
  
  // PIC (Person In Charge) info
  picName: text("pic_name"),
  picPosition: text("pic_position"),
  
  // Subscription info
  subscriptionPlan: text("subscription_plan").default("free"), // free | starter | professional | enterprise
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  subscriptionDuration: text("subscription_duration"), // 1_month | 3_months | 12_months
  paymentStatus: text("payment_status").default("pending"), // pending | completed | failed
  
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").references(() => companies.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(), // full-time | part-time | contract | freelance
  industry: text("industry"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  education: text("education"), // SMA | D3 | S1 | S2
  experience: text("experience"), // 0-1 tahun | 1-3 tahun | 3-5 tahun | 5+ tahun
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  source: text("source").default("direct").notNull(), // direct | instagram | aggregated
  sourceUrl: text("source_url"),
  postedBy: varchar("posted_by").references(() => users.id),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aggregatedJobs = pgTable("aggregated_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rawText: text("raw_text").notNull(), // Original Instagram post text
  sourceUrl: text("source_url").notNull(),
  sourcePlatform: text("source_platform").default("instagram").notNull(),
  
  // AI-extracted data
  extractedTitle: text("extracted_title"),
  extractedCompany: text("extracted_company"),
  extractedLocation: text("extracted_location"),
  extractedSalary: text("extracted_salary"),
  extractedRequirements: text("extracted_requirements"),
  extractedContact: text("extracted_contact"),
  
  aiConfidence: integer("ai_confidence"), // 0-100
  status: text("status").default("pending").notNull(), // pending | approved | rejected
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  publishedJobId: varchar("published_job_id").references(() => jobs.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  applicantId: varchar("applicant_id").references(() => users.id).notNull(),
  cvUrl: text("cv_url"),
  coverLetter: text("cover_letter"),
  status: text("status").default("submitted").notNull(), // submitted | reviewed | shortlisted | rejected | accepted
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applicantNotes = pgTable("applicant_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => applications.id).notNull(),
  note: text("note").notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wishlists = pgTable("wishlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobTemplates = pgTable("job_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(),
  industry: text("industry"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  education: text("education"),
  experience: text("experience"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const premiumTransactions = pgTable("premium_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: varchar("job_id").references(() => jobs.id),
  type: text("type").notNull(), // job_booster | slot_package
  amount: integer("amount").notNull(),
  status: text("status").default("pending").notNull(), // pending | completed | failed | refunded
  refundReason: text("refund_reason"),
  refundedBy: varchar("refunded_by").references(() => users.id),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  applicationId: varchar("application_id").references(() => applications.id),
  jobId: varchar("job_id").references(() => jobs.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // application_status | new_message | new_applicant | job_match
  title: text("title").notNull(),
  message: text("message").notNull(),
  linkUrl: text("link_url"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedCandidates = pgTable("saved_candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employerId: varchar("employer_id").references(() => users.id).notNull(),
  candidateId: varchar("candidate_id").references(() => users.id).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // user_blocked | job_approved | job_rejected | refund_processed | etc
  targetType: text("target_type"), // user | job | transaction
  targetId: varchar("target_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(), // HTML content from WYSIWYG
  heroImage: text("hero_image"),
  category: text("category").notNull(), // Newsletter | Tips | Insight
  tags: text("tags").array(),
  readTime: text("read_time"), // e.g., "7 min read"
  authorId: varchar("author_id").references(() => users.id).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentPages = pgTable("content_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // privacy-policy | terms-of-service | about-us
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML content
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(true).notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobEvents = pgTable("job_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  userId: varchar("user_id").references(() => users.id), // nullable for anonymous views
  eventType: text("event_type").notNull(), // view | click | apply
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referer: text("referer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Error Logs Table
export const errorLogs = pgTable("error_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  level: text("level").notNull(), // error | warn | info
  service: text("service").default("backend").notNull(),
  endpoint: text("endpoint"),
  statusCode: integer("status_code"),
  message: text("message").notNull(),
  stack: text("stack"),
  meta: text("meta"), // JSON string for additional context
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Verification Requests Table
export const verificationRequests = pgTable("verification_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subjectType: text("subject_type").notNull(), // user | company
  subjectId: varchar("subject_id").notNull(),
  status: text("status").default("pending").notNull(), // pending | approved | rejected
  submittedBy: varchar("submitted_by").references(() => users.id).notNull(),
  reviewerId: varchar("reviewer_id").references(() => users.id),
  documents: text("documents"), // JSON array of document URLs
  notes: text("notes"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});

// Fraud Reports Table
export const fraudReports = pgTable("fraud_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id").references(() => users.id).notNull(),
  targetType: text("target_type").notNull(), // job | company | user
  targetId: varchar("target_id").notNull(),
  reason: text("reason").notNull(), // fake_job | scam | inappropriate | spam | other
  description: text("description").notNull(),
  evidenceUrls: text("evidence_urls").array(),
  status: text("status").default("pending").notNull(), // pending | in_review | resolved | dismissed
  resolutionNotes: text("resolution_notes"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAggregatedJobSchema = createInsertSchema(aggregatedJobs).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertApplicantNoteSchema = createInsertSchema(applicantNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlists).omit({
  id: true,
  createdAt: true,
});

export const insertJobTemplateSchema = createInsertSchema(jobTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertPremiumTransactionSchema = createInsertSchema(premiumTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertSavedCandidateSchema = createInsertSchema(savedCandidates).omit({
  id: true,
  createdAt: true,
});

export const insertAdminActivityLogSchema = createInsertSchema(adminActivityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentPageSchema = createInsertSchema(contentPages).omit({
  id: true,
  updatedAt: true,
});

export const insertJobEventSchema = createInsertSchema(jobEvents).omit({
  id: true,
  createdAt: true,
});

// Strong password validation
const strongPasswordSchema = z.string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar")
  .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
  .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
  .regex(/[^A-Za-z0-9]/, "Password harus mengandung minimal 1 karakter khusus (!@#$%^&*)");

// Register schemas dengan validasi tambahan
export const registerPekerjaSchema = insertUserSchema.extend({
  password: strongPasswordSchema,
}).omit({
  role: true, // Backend akan set role secara otomatis
  isVerified: true,
  cvUrl: true,
  cvFileName: true,
  education: true,
  experience: true,
  skills: true,
  preferredIndustries: true,
  preferredLocations: true,
  preferredJobTypes: true,
  expectedSalaryMin: true,
  isActive: true,
});

export const registerPemberiKerjaSchema = insertUserSchema.extend({
  password: strongPasswordSchema,
  companyName: z.string().min(1, "Nama perusahaan harus diisi"),
}).omit({
  role: true, // Backend akan set role secara otomatis
  isVerified: true,
  cvUrl: true,
  cvFileName: true,
  education: true,
  experience: true,
  skills: true,
  preferredIndustries: true,
  preferredLocations: true,
  preferredJobTypes: true,
  expectedSalaryMin: true,
  isActive: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi. Silakan masukkan username Anda."),
  password: z.string().min(1, "Password wajib diisi. Silakan masukkan password Anda."),
});

// Update profile schemas
export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi").optional(),
  email: z.string().email("Email tidak valid").optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  photoUrl: z.string().optional(),
});

export const updateEducationSchema = z.object({
  education: z.string(), // JSON string
});

export const updateExperienceSchema = z.object({
  experience: z.string(), // JSON string
});

export const updateSkillsSchema = z.object({
  skills: z.array(z.string()),
});

export const updatePreferencesSchema = z.object({
  preferredIndustries: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
  preferredJobTypes: z.array(z.string()).optional(),
  expectedSalaryMin: z.number().optional(),
});

export const quickApplySchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
});

// Update schemas for fixing SQL injection vulnerabilities
// Use coerce to accept both numbers and numeric strings from forms
export const updateJobSchema = z.object({
  companyId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  industry: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  viewCount: z.coerce.number().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  logo: z.string().optional(),
  employeeCount: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["submitted", "reviewed", "shortlisted", "rejected", "accepted", "withdrawn"]),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertAggregatedJob = z.infer<typeof insertAggregatedJobSchema>;
export type AggregatedJob = typeof aggregatedJobs.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertApplicantNote = z.infer<typeof insertApplicantNoteSchema>;
export type ApplicantNote = typeof applicantNotes.$inferSelect;

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;

export type InsertJobTemplate = z.infer<typeof insertJobTemplateSchema>;
export type JobTemplate = typeof jobTemplates.$inferSelect;

export type InsertPremiumTransaction = z.infer<typeof insertPremiumTransactionSchema>;
export type PremiumTransaction = typeof premiumTransactions.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertSavedCandidate = z.infer<typeof insertSavedCandidateSchema>;
export type SavedCandidate = typeof savedCandidates.$inferSelect;

export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;
export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;

export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertContentPage = z.infer<typeof insertContentPageSchema>;
export type ContentPage = typeof contentPages.$inferSelect;

export type InsertJobEvent = z.infer<typeof insertJobEventSchema>;
export type JobEvent = typeof jobEvents.$inferSelect;

// Error Log schemas
export const insertErrorLogSchema = createInsertSchema(errorLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertErrorLog = z.infer<typeof insertErrorLogSchema>;
export type ErrorLog = typeof errorLogs.$inferSelect;

// Verification Request schemas
export const insertVerificationRequestSchema = createInsertSchema(verificationRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertVerificationRequest = z.infer<typeof insertVerificationRequestSchema>;
export type VerificationRequest = typeof verificationRequests.$inferSelect;

// Fraud Report schemas
export const insertFraudReportSchema = createInsertSchema(fraudReports).omit({
  id: true,
  createdAt: true,
});
export type InsertFraudReport = z.infer<typeof insertFraudReportSchema>;
export type FraudReport = typeof fraudReports.$inferSelect;

export type RegisterPekerja = z.infer<typeof registerPekerjaSchema>;
export type RegisterPemberiKerja = z.infer<typeof registerPemberiKerjaSchema>;
export type Login = z.infer<typeof loginSchema>;
