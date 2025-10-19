import { type User, type InsertUser, type Job, type InsertJob, type Company, type InsertCompany, type Application, type InsertApplication, type Wishlist } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users & Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Jobs
  getJobs(filters?: {
    keyword?: string;
    location?: string;
    industry?: string;
    jobType?: string;
    experience?: string;
    salaryMin?: number;
    salaryMax?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: (Job & { company: Company })[], total: number }>;
  getJobById(id: string): Promise<(Job & { company: Company }) | undefined>;
  getRecommendedJobs(userId: string, limit?: number): Promise<(Job & { company: Company })[]>;
  getJobsByEmployer(userId: string): Promise<(Job & { company: Company })[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(jobId: string, updates: Partial<Job>): Promise<Job | undefined>;
  deleteJob(jobId: string): Promise<void>;
  getJobApplications(jobId: string): Promise<(Application & { user: User })[]>;
  
  // Companies
  getCompanyById(id: string): Promise<Company | undefined>;
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | undefined>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]>;
  getEmployerApplications(userId: string): Promise<(Application & { user: User; job: Job & { company: Company } })[]>;
  updateApplicationStatus(applicationId: string, status: string): Promise<Application | undefined>;
  checkApplicationExists(userId: string, jobId: string): Promise<boolean>;
  
  // Employer Analytics
  getEmployerStats(userId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplicationsThisWeek: number;
  }>;
  getEmployerAnalytics(userId: string): Promise<{
    applicationsOverTime: Array<{ date: string; count: number }>;
    jobsByType: Array<{ type: string; count: number }>;
  }>;
  getEmployerActivities(userId: string): Promise<Array<{
    id: string;
    type: "new_application" | "status_change" | "new_job";
    message: string;
    timestamp: string;
    jobTitle?: string;
    applicantName?: string;
  }>>;
  
  // Wishlists
  getUserWishlists(userId: string): Promise<(Wishlist & { job: Job & { company: Company } })[]>;
  addToWishlist(userId: string, jobId: string): Promise<Wishlist>;
  removeFromWishlist(userId: string, jobId: string): Promise<void>;
  checkWishlistExists(userId: string, jobId: string): Promise<boolean>;
}

import { db } from "./db";
import { users as usersTable, jobs as jobsTable, companies as companiesTable, applications as applicationsTable, wishlists as wishlistsTable } from "@shared/schema";
import { eq, and, or, ilike, desc, sql, gte, lte, inArray } from "drizzle-orm";

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(usersTable).values(insertUser).returning();
    return user;
  }

  async getJobs(filters?: {
    keyword?: string;
    location?: string;
    industry?: string;
    jobType?: string;
    experience?: string;
    salaryMin?: number;
    salaryMax?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: (Job & { company: Company })[], total: number }> {
    const { keyword, location, industry, jobType, experience, salaryMin, salaryMax, sortBy = "newest", limit = 20, offset = 0 } = filters || {};
    
    let query = db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(eq(jobsTable.isActive, true))
    .orderBy(desc(jobsTable.isFeatured), desc(jobsTable.createdAt))
    .$dynamic();

    const conditions = [eq(jobsTable.isActive, true)];

    if (keyword) {
      conditions.push(
        or(
          ilike(jobsTable.title, `%${keyword}%`),
          ilike(jobsTable.description, `%${keyword}%`),
          ilike(companiesTable.name, `%${keyword}%`)
        )!
      );
    }

    if (location) {
      conditions.push(ilike(jobsTable.location, `%${location}%`));
    }

    if (industry) {
      conditions.push(eq(jobsTable.industry, industry));
    }

    if (jobType) {
      conditions.push(eq(jobsTable.jobType, jobType));
    }

    if (experience) {
      conditions.push(eq(jobsTable.experience, experience));
    }

    if (salaryMin !== undefined) {
      conditions.push(gte(jobsTable.salaryMax, salaryMin));
    }

    if (salaryMax !== undefined) {
      conditions.push(lte(jobsTable.salaryMin, salaryMax));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (sortBy === "oldest") {
      query = query.orderBy(jobsTable.createdAt);
    } else if (sortBy === "salary") {
      query = query.orderBy(desc(jobsTable.salaryMax));
    } else {
      // Default: newest
      query = query.orderBy(desc(jobsTable.isFeatured), desc(jobsTable.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobsTable)
      .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      jobs: results as (Job & { company: Company })[],
      total: Number(count),
    };
  }

  async getJobById(id: string): Promise<(Job & { company: Company }) | undefined> {
    const [result] = await db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(eq(jobsTable.id, id));

    return result as (Job & { company: Company }) | undefined;
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
    return company;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companiesTable).values(insertCompany).returning();
    return company;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const users = await db.select().from(usersTable).where(eq(usersTable.role, role));
    return users;
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, userId))
      .returning();
    return updatedUser;
  }

  async getRecommendedJobs(userId: string, limit: number = 10): Promise<(Job & { company: Company })[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const conditions = [eq(jobsTable.isActive, true)];

    if (user.preferredIndustries && user.preferredIndustries.length > 0) {
      conditions.push(inArray(jobsTable.industry, user.preferredIndustries));
    }

    if (user.preferredLocations && user.preferredLocations.length > 0) {
      const locationConditions = user.preferredLocations.map(loc => 
        ilike(jobsTable.location, `%${loc}%`)
      );
      if (locationConditions.length > 0) {
        conditions.push(or(...locationConditions)!);
      }
    }

    if (user.preferredJobTypes && user.preferredJobTypes.length > 0) {
      conditions.push(inArray(jobsTable.jobType, user.preferredJobTypes));
    }

    if (user.expectedSalaryMin) {
      conditions.push(gte(jobsTable.salaryMax, user.expectedSalaryMin));
    }

    const results = await db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(and(...conditions))
    .orderBy(desc(jobsTable.isFeatured), desc(jobsTable.createdAt))
    .limit(limit);

    return results as (Job & { company: Company })[];
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applicationsTable)
      .values(application)
      .returning();
    return newApplication;
  }

  async getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]> {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.applicantId, userId))
      .orderBy(desc(applicationsTable.createdAt));

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const job = await this.getJobById(app.jobId);
        return {
          ...app,
          job: job!,
        };
      })
    );

    return enrichedApplications as (Application & { job: Job & { company: Company } })[];
  }

  async checkApplicationExists(userId: string, jobId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(applicationsTable)
      .where(and(
        eq(applicationsTable.applicantId, userId),
        eq(applicationsTable.jobId, jobId)
      ));
    return !!result;
  }

  async getUserWishlists(userId: string): Promise<(Wishlist & { job: Job & { company: Company } })[]> {
    const wishlists = await db
      .select()
      .from(wishlistsTable)
      .where(eq(wishlistsTable.userId, userId))
      .orderBy(desc(wishlistsTable.createdAt));

    const enrichedWishlists = await Promise.all(
      wishlists.map(async (wishlist) => {
        const job = await this.getJobById(wishlist.jobId);
        return {
          ...wishlist,
          job: job!,
        };
      })
    );

    return enrichedWishlists as (Wishlist & { job: Job & { company: Company } })[];
  }

  async addToWishlist(userId: string, jobId: string): Promise<Wishlist> {
    const [wishlist] = await db
      .insert(wishlistsTable)
      .values({ userId, jobId })
      .returning();
    return wishlist;
  }

  async removeFromWishlist(userId: string, jobId: string): Promise<void> {
    await db
      .delete(wishlistsTable)
      .where(and(
        eq(wishlistsTable.userId, userId),
        eq(wishlistsTable.jobId, jobId)
      ));
  }

  async checkWishlistExists(userId: string, jobId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(wishlistsTable)
      .where(and(
        eq(wishlistsTable.userId, userId),
        eq(wishlistsTable.jobId, jobId)
      ));
    return !!result;
  }

  async getJobsByEmployer(userId: string): Promise<(Job & { company: Company })[]> {
    const results = await db.select({
      id: jobsTable.id,
      companyId: jobsTable.companyId,
      title: jobsTable.title,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      location: jobsTable.location,
      jobType: jobsTable.jobType,
      industry: jobsTable.industry,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      education: jobsTable.education,
      experience: jobsTable.experience,
      isFeatured: jobsTable.isFeatured,
      isActive: jobsTable.isActive,
      source: jobsTable.source,
      sourceUrl: jobsTable.sourceUrl,
      postedBy: jobsTable.postedBy,
      createdAt: jobsTable.createdAt,
      updatedAt: jobsTable.updatedAt,
      company: companiesTable,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(eq(jobsTable.postedBy, userId))
    .orderBy(desc(jobsTable.createdAt));

    return results as (Job & { company: Company })[];
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobsTable).values(job).returning();
    return newJob;
  }

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job | undefined> {
    const [updatedJob] = await db
      .update(jobsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobsTable.id, jobId))
      .returning();
    return updatedJob;
  }

  async deleteJob(jobId: string): Promise<void> {
    await db.delete(jobsTable).where(eq(jobsTable.id, jobId));
  }

  async getJobApplications(jobId: string): Promise<(Application & { user: User })[]> {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.jobId, jobId))
      .orderBy(desc(applicationsTable.createdAt));

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const user = await this.getUser(app.applicantId);
        return {
          ...app,
          user: user!,
        };
      })
    );

    return enrichedApplications as (Application & { user: User })[];
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.createdBy, userId));
    return company;
  }

  async updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companiesTable)
      .set(updates)
      .where(eq(companiesTable.id, companyId))
      .returning();
    return updatedCompany;
  }

  async getEmployerApplications(userId: string): Promise<(Application & { user: User; job: Job & { company: Company } })[]> {
    const employerJobs = await this.getJobsByEmployer(userId);
    const jobIds = employerJobs.map(job => job.id);

    if (jobIds.length === 0) {
      return [];
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds))
      .orderBy(desc(applicationsTable.createdAt));

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const user = await this.getUser(app.applicantId);
        const job = await this.getJobById(app.jobId);
        return {
          ...app,
          user: user!,
          job: job!,
        };
      })
    );

    return enrichedApplications as (Application & { user: User; job: Job & { company: Company } })[];
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applicationsTable)
      .set({ status })
      .where(eq(applicationsTable.id, applicationId))
      .returning();
    return updatedApplication;
  }

  async getEmployerStats(userId: string): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplicationsThisWeek: number;
  }> {
    const jobs = await this.getJobsByEmployer(userId);
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.isActive).length;

    const jobIds = jobs.map(job => job.id);
    
    if (jobIds.length === 0) {
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        newApplicationsThisWeek: 0,
      };
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds));

    const totalApplications = applications.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newApplicationsThisWeek = applications.filter(
      app => new Date(app.createdAt) > oneWeekAgo
    ).length;

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      newApplicationsThisWeek,
    };
  }

  async getEmployerAnalytics(userId: string): Promise<{
    applicationsOverTime: Array<{ date: string; count: number }>;
    jobsByType: Array<{ type: string; count: number }>;
  }> {
    const jobs = await this.getJobsByEmployer(userId);
    const jobIds = jobs.map(job => job.id);

    if (jobIds.length === 0) {
      return {
        applicationsOverTime: [],
        jobsByType: [],
      };
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds))
      .orderBy(desc(applicationsTable.createdAt));

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const applicationsMap = new Map<string, number>();
    applications
      .filter(app => new Date(app.createdAt) > last30Days)
      .forEach(app => {
        const dateStr = new Date(app.createdAt).toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: 'short' 
        });
        applicationsMap.set(dateStr, (applicationsMap.get(dateStr) || 0) + 1);
      });

    const applicationsOverTime = Array.from(applicationsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .reverse();

    const jobTypesMap = new Map<string, number>();
    jobs.forEach(job => {
      jobTypesMap.set(job.jobType, (jobTypesMap.get(job.jobType) || 0) + 1);
    });

    const jobsByType = Array.from(jobTypesMap.entries())
      .map(([type, count]) => ({ type, count }));

    return {
      applicationsOverTime,
      jobsByType,
    };
  }

  async getEmployerActivities(userId: string): Promise<Array<{
    id: string;
    type: "new_application" | "status_change" | "new_job";
    message: string;
    timestamp: string;
    jobTitle?: string;
    applicantName?: string;
  }>> {
    const jobs = await this.getJobsByEmployer(userId);
    const jobIds = jobs.map(job => job.id);

    if (jobIds.length === 0) {
      return [];
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(inArray(applicationsTable.jobId, jobIds))
      .orderBy(desc(applicationsTable.createdAt))
      .limit(50);

    const activities: Array<{
      id: string;
      type: "new_application" | "status_change" | "new_job";
      message: string;
      timestamp: string;
      jobTitle?: string;
      applicantName?: string;
    }> = [];

    for (const app of applications) {
      const job = jobs.find(j => j.id === app.jobId);
      const user = await this.getUser(app.applicantId);
      
      if (job && user) {
        const isNew = new Date(app.createdAt).getTime() === new Date(app.createdAt).getTime();
        
        if (app.status === 'submitted') {
          activities.push({
            id: `app-${app.id}`,
            type: "new_application",
            message: `Lamaran baru dari ${user.fullName}`,
            timestamp: app.createdAt.toISOString(),
            jobTitle: job.title,
            applicantName: user.fullName,
          });
        } else {
          activities.push({
            id: `status-${app.id}`,
            type: "status_change",
            message: `Status lamaran ${user.fullName} diubah ke ${app.status}`,
            timestamp: app.createdAt.toISOString(),
            jobTitle: job.title,
            applicantName: user.fullName,
          });
        }
      }
    }

    const recentJobs = jobs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    recentJobs.forEach(job => {
      activities.push({
        id: `job-${job.id}`,
        type: "new_job",
        message: `Lowongan "${job.title}" dipublikasikan`,
        timestamp: job.createdAt.toISOString(),
        jobTitle: job.title,
      });
    });

    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 20);
  }
}

export const storage = new DbStorage();
