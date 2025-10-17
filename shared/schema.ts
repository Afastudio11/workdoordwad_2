import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  phone: text("phone"),
  role: text("role").notNull().default("job_seeker"), // job_seeker | recruiter | admin
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
  logo: text("logo"),
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
